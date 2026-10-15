// Small, dependency-free HTML → Markdown converter for the agent-readable layer.
// It only has to handle the HTML this repository generates, so it favours
// predictable output over full HTML5 parsing.

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])
const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title'])
const SKIP = new Set(['script', 'style', 'svg', 'noscript', 'template', 'button', 'input', 'select', 'option', 'textarea', 'canvas', 'video', 'audio', 'iframe', 'object', 'picture', 'img', 'head', 'meta', 'link'])
const BLOCK = new Set([
  'address', 'article', 'aside', 'blockquote', 'body', 'dd', 'details', 'dialog', 'div', 'dl', 'dt', 'fieldset',
  'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'html', 'label', 'legend', 'li',
  'main', 'nav', 'ol', 'output', 'p', 'pre', 'section', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul', 'caption',
])

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rarr: '→', larr: '←', middot: '·', times: '×', minus: '−',
  ndash: '–', mdash: '—', hellip: '…', pound: '£', euro: '€', copy: '©', reg: '®', trade: '™', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  bull: '•', check: '✓', darr: '↓', uarr: '↑', le: '≤', ge: '≥', asymp: '≈', divide: '÷', plusmn: '±', sect: '§', deg: '°',
}

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const code = entity[1].toLowerCase() === 'x' ? Number.parseInt(entity.slice(2), 16) : Number.parseInt(entity.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : match
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match
  })
}

function parseAttributes(source) {
  const attributes = {}
  for (const match of source.matchAll(/([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    attributes[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '')
  }
  return attributes
}

export function parseHtml(html) {
  const root = { tag: '#root', attrs: {}, children: [] }
  const stack = [root]
  const pattern = /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>|[^<]+|</gi
  let match
  while ((match = pattern.exec(html))) {
    const [token, closeTag, openTag, attrSource, selfClose] = match
    const top = stack.at(-1)
    if (token.startsWith('<!--') || /^<!doctype/i.test(token)) continue
    if (closeTag) {
      const tag = closeTag.toLowerCase()
      const index = stack.findLastIndex((node) => node.tag === tag)
      if (index > 0) stack.length = index
      continue
    }
    if (openTag) {
      const tag = openTag.toLowerCase()
      const node = { tag, attrs: parseAttributes(attrSource || ''), children: [] }
      top.children.push(node)
      if (RAW_TEXT.has(tag)) {
        const end = html.toLowerCase().indexOf(`</${tag}`, pattern.lastIndex)
        const stop = end === -1 ? html.length : end
        node.children.push({ text: html.slice(pattern.lastIndex, stop) })
        pattern.lastIndex = end === -1 ? html.length : html.indexOf('>', end) + 1
        continue
      }
      if (!VOID.has(tag) && !selfClose) stack.push(node)
      continue
    }
    top.children.push({ text: token })
  }
  return root
}

export function findElement(node, predicate) {
  if (node.tag && predicate(node)) return node
  for (const child of node.children || []) {
    const found = findElement(child, predicate)
    if (found) return found
  }
  return null
}

export function textContent(node) {
  if (node.text !== undefined) return decodeEntities(node.text)
  if (SKIP.has(node.tag)) return ''
  return node.children.map(textContent).join('')
}

const isHidden = (node) =>
  'hidden' in node.attrs ||
  node.attrs['aria-hidden'] === 'true' ||
  /(?:^|\s)sr-only(?:\s|$)/.test(node.attrs.class || '') ||
  /display\s*:\s*none/i.test(node.attrs.style || '')

function absoluteHref(href, origin, pagePath) {
  if (!href || href.startsWith('#') || /^(?:mailto|tel|javascript):/i.test(href)) return href
  try {
    return new URL(href, `${origin}${pagePath}`).toString()
  } catch {
    return href
  }
}

const squash = (value) => value.replace(/[ \t\r\n\f]+/g, ' ')
const escapeCell = (value) => value.replaceAll('|', '\\|').trim()

// Adjacent elements with no whitespace between them (e.g. <span>A</span><strong>B</strong>)
// read as separate words on screen; keep them separate in Markdown too.
function joinInline(children, context) {
  let out = ''
  let previousWasElement = false
  for (const child of children) {
    const part = inline(child, context)
    if (!part) continue
    const isElement = child.text === undefined
    if (previousWasElement && /[^\s(\[]$/.test(out) && (isElement ? /^[^\s.,;:!?)\]]/ : /^[A-Z0-9£]/).test(part)) out += ' '
    out += part
    previousWasElement = isElement
  }
  return out
}

function inline(node, context) {
  if (node.text !== undefined) return squash(decodeEntities(node.text))
  if (SKIP.has(node.tag) || isHidden(node)) return ''
  if (node.tag === 'br') return '\n'
  const inner = joinInline(node.children, context)
  switch (node.tag) {
    case 'a': {
      const label = inner.trim()
      const href = node.attrs.href
      if (!label) return ''
      if (!href || href.startsWith('#') || /^javascript:/i.test(href)) return label
      return `[${label}](${absoluteHref(href, context.origin, context.pagePath)})`
    }
    case 'strong':
    case 'b':
      return inner.trim() ? `**${inner.trim()}**` : ''
    case 'em':
    case 'i':
      return inner.trim() ? `*${inner.trim()}*` : ''
    case 'code':
    case 'kbd':
    case 'samp':
      return inner.trim() ? `\`${inner.trim()}\`` : ''
    default:
      return inner
  }
}

function tableToMarkdown(table, context) {
  const rows = []
  let caption = ''
  const walk = (node) => {
    for (const child of node.children || []) {
      if (!child.tag || isHidden(child)) continue
      if (child.tag === 'caption') caption = inline(child, context).trim()
      else if (child.tag === 'tr') {
        rows.push(child.children.filter((cell) => cell.tag === 'th' || cell.tag === 'td').map((cell) => escapeCell(squash(inline(cell, context)))))
      } else walk(child)
    }
  }
  walk(table)
  if (!rows.length) return caption
  const width = Math.max(...rows.map((row) => row.length))
  const pad = (row) => [...row, ...Array(width - row.length).fill('')]
  const [head, ...body] = rows.map(pad)
  const lines = [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...body.map((row) => `| ${row.join(' | ')} |`)]
  return `${caption ? `**${caption}**\n\n` : ''}${lines.join('\n')}`
}

function blocks(node, context, depth = 0) {
  const out = []
  let buffer = ''
  const flush = () => {
    const text = buffer.replace(/ *\n */g, '\n').trim()
    if (text) out.push(text)
    buffer = ''
  }
  let previousWasElement = false
  for (const child of node.children || []) {
    if (child.text !== undefined) {
      const part = inline(child, context)
      if (previousWasElement && /[^\s(\[]$/.test(buffer) && /^[A-Z0-9£]/.test(part)) buffer += ' '
      buffer += part
      previousWasElement = false
      continue
    }
    if (SKIP.has(child.tag) || isHidden(child)) continue
    if (!BLOCK.has(child.tag)) {
      const part = inline(child, context)
      if (part && previousWasElement && /[^\s(\[]$/.test(buffer) && /^[^\s.,;:!?)\]]/.test(part)) buffer += ' '
      buffer += part
      if (part) previousWasElement = true
      continue
    }
    previousWasElement = false
    flush()
    const tag = child.tag
    if (/^h[1-6]$/.test(tag)) {
      const text = squash(inline(child, context)).trim()
      if (text) out.push(`${'#'.repeat(Number(tag[1]))} ${text}`)
    } else if (tag === 'p' || tag === 'figcaption' || tag === 'legend' || tag === 'caption' || tag === 'output') {
      const text = inline(child, context).replace(/ *\n */g, '\n').trim()
      if (text) out.push(text)
    } else if (tag === 'summary' || tag === 'dt') {
      const text = squash(inline(child, context)).trim()
      if (text) out.push(`**${text}**`)
    } else if (tag === 'hr') {
      out.push('---')
    } else if (tag === 'pre') {
      out.push(`\`\`\`\n${textContent(child).replace(/\n+$/, '')}\n\`\`\``)
    } else if (tag === 'table') {
      const table = tableToMarkdown(child, context)
      if (table) out.push(table)
    } else if (tag === 'ul' || tag === 'ol') {
      let index = Number(child.attrs.start || 1)
      const items = []
      for (const item of child.children) {
        if (!item.tag || isHidden(item)) continue
        const marker = tag === 'ol' ? `${index++}.` : '-'
        const body = item.tag === 'li' ? blocks(item, context, depth + 1) : blocks({ children: [item] }, context, depth + 1)
        if (!body) continue
        const indent = ' '.repeat(marker.length + 1)
        const lines = body.split('\n').filter((line, lineIndex, all) => !(line === '' && all[lineIndex - 1] === ''))
        items.push(`${marker} ${lines.map((line, lineIndex) => (lineIndex === 0 || line === '' ? line : `${indent}${line}`)).join('\n')}`)
      }
      if (items.length) out.push(items.join('\n'))
    } else if (tag === 'blockquote') {
      const body = blocks(child, context, depth)
      if (body) out.push(body.split('\n').map((line) => `> ${line}`).join('\n'))
    } else {
      const body = blocks(child, context, depth)
      if (body) out.push(body)
    }
  }
  flush()
  return out.join('\n\n')
}

export function htmlToMarkdown(node, { origin, pagePath }) {
  return `${blocks(node, { origin, pagePath })
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`
}

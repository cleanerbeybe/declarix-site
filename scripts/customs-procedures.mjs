// Special procedures, customs identifiers and the customs glossary (lane L11).
// Content lives in customs-procedures-content.mjs; this file renders it.
// Links to routes built by other lanes (the /customs-reference/ hub, CPC / document-code / error-code
// references, planned free tools) render as links only when that route exists in the build, so no
// page ever links to a missing URL. setKnownPaths() is called by generate-static-routes.mjs.
import { glossaryRoute, procedurePages, referencePages } from './customs-procedures-content.mjs'

export const procedureRoutes = [...procedurePages, ...referencePages, glossaryRoute].filter(Boolean)

let knownPaths = new Set(procedureRoutes.map((route) => route.path))

export function setKnownPaths(paths) {
  knownPaths = new Set([...paths, ...procedureRoutes.map((route) => route.path)])
}

export const isKnownPath = (path) => knownPaths.has(path.split('#')[0])

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

// Inline markup in content strings: [label](/path/) becomes a link when the path is published,
// otherwise plain text. Everything else is escaped.
function rich(value) {
  const text = String(value)
  let out = ''
  let last = 0
  for (const match of text.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
    out += escapeHtml(text.slice(last, match.index))
    const [, label, href] = match
    const external = /^https?:\/\//.test(href)
    if (external || isKnownPath(href)) {
      out += `<a href="${escapeHtml(href)}"${external ? '' : ` data-authority-related="inline_${escapeHtml(href.split('/').filter(Boolean).join('_'))}"`}>${escapeHtml(label)}</a>`
    } else {
      out += escapeHtml(label)
    }
    last = match.index + match[0].length
  }
  return out + escapeHtml(text.slice(last))
}

const slugId = (route, suffix) => `${route.path.split('/').filter(Boolean).join('-')}-${suffix}`

function bookingHref(route, placement) {
  const sourceName = `reference_${route.path.split('/').filter(Boolean).join('_')}_${placement}`
  return `/?src=${encodeURIComponent(sourceName)}#book`
}

function breadcrumbTrail(route) {
  const trail = [{ name: 'Home', path: '/' }]
  if (isKnownPath('/customs-reference/') && route.path !== '/customs-reference/') {
    trail.push({ name: 'Customs reference', path: '/customs-reference/' })
  }
  trail.push({ name: route.shortName, path: route.path })
  return trail
}

function breadcrumbHtml(route) {
  return breadcrumbTrail(route)
    .map((item, index, all) =>
      index === all.length - 1 ? escapeHtml(item.name.toUpperCase()) : `<a href="${item.path}">${escapeHtml(item.name.toUpperCase())}</a>`,
    )
    .join(' → ')
}

function jsonLd(route, site) {
  const page = {
    '@type': route.kind === 'glossary' ? 'CollectionPage' : 'TechArticle',
    '@id': `${site.origin}${route.path}#page`,
    url: `${site.origin}${route.path}`,
    name: route.title,
    headline: route.h1,
    description: route.description,
    inLanguage: 'en-GB',
    datePublished: route.publishedOn,
    dateModified: route.reviewedOn,
    isPartOf: { '@id': `${site.origin}/#website` },
    author: { '@id': `${site.origin}/#organization` },
    publisher: { '@id': `${site.origin}/#organization` },
    about: route.about.map((name) => ({ '@type': 'Thing', name })),
    citation: route.sources.map((item) => item.url),
  }
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${site.origin}/#organization`,
      name: site.company,
      legalName: site.company,
      url: `${site.origin}/`,
      identifier: site.companyNumber,
    },
    page,
    {
      '@type': 'WebSite',
      '@id': `${site.origin}/#website`,
      name: 'Declarix',
      url: `${site.origin}/`,
      publisher: { '@id': `${site.origin}/#organization` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbTrail(route).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${site.origin}${item.path}`,
      })),
    },
  ]
  if (route.kind === 'glossary') {
    const set = {
      '@type': 'DefinedTermSet',
      '@id': `${site.origin}${route.path}#terms`,
      name: 'UK customs glossary',
      hasDefinedTerm: route.terms.map((term) => ({
        '@type': 'DefinedTerm',
        name: term.term,
        ...(term.alt ? { alternateName: term.alt } : {}),
        description: term.plain,
        inDefinedTermSet: `${site.origin}${route.path}#terms`,
        ...(term.page && isKnownPath(term.page) ? { url: `${site.origin}${term.page}` } : {}),
      })),
    }
    graph.push(set)
    page.mainEntity = { '@id': `${site.origin}${route.path}#terms` }
  } else if (route.term) {
    graph.push({
      '@type': 'DefinedTerm',
      '@id': `${site.origin}${route.path}#term`,
      name: route.term.name,
      ...(route.term.alt ? { alternateName: route.term.alt } : {}),
      description: route.term.description,
      inDefinedTermSet: `${site.origin}/customs-reference/glossary/#terms`,
      url: `${site.origin}${route.path}`,
    })
    page.mainEntity = { '@id': `${site.origin}${route.path}#term` }
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')
}

function renderTable(table, route, index) {
  const id = slugId(route, `table-${index}`)
  return `<div class="ref-table-wrap" role="region" aria-labelledby="${id}" tabindex="0"><table class="ref-table"><caption id="${id}">${rich(table.caption)}</caption><thead><tr>${table.head
    .map((cell) => `<th scope="col">${escapeHtml(cell)}</th>`)
    .join('')}</tr></thead><tbody>${table.rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell, cellIndex) =>
            cellIndex === 0
              ? `<th scope="row" data-label="${escapeHtml(table.head[0])}">${rich(cell)}</th>`
              : `<td data-label="${escapeHtml(table.head[cellIndex])}">${rich(cell)}</td>`,
          )
          .join('')}</tr>`,
    )
    .join('')}</tbody></table></div>`
}

function renderSection(section, route, index) {
  const id = slugId(route, section.id || `s${index}`)
  const paras = (section.paras || []).map((paragraph) => `<p>${rich(paragraph)}</p>`).join('')
  const list = section.list ? `<ul>${section.list.map((item) => `<li>${rich(item)}</li>`).join('')}</ul>` : ''
  const steps = section.steps
    ? `<ol class="ref-steps">${section.steps
        .map(([number, title, copy]) => `<li><b>${escapeHtml(number)}</b><div><strong>${escapeHtml(title)}</strong><p>${rich(copy)}</p></div></li>`)
        .join('')}</ol>`
    : ''
  const table = section.table ? renderTable(section.table, route, index) : ''
  const after = (section.after || []).map((paragraph) => `<p>${rich(paragraph)}</p>`).join('')
  return `<section class="ref-section" aria-labelledby="${id}"><span class="ref-label">${escapeHtml(section.label)}</span><h2 id="${id}">${escapeHtml(section.title)}</h2>${paras}${list}${steps}${table}${after}</section>`
}

function renderFacts(route) {
  if (!route.facts?.length) return ''
  return `<section class="ref-facts" aria-labelledby="${slugId(route, 'facts')}"><span class="ref-label">AT A GLANCE</span><h2 id="${slugId(route, 'facts')}">${escapeHtml(route.factsTitle || 'The short version.')}</h2><dl>${route.facts
    .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${rich(value)}</dd></div>`)
    .join('')}</dl></section>`
}

function renderExample(route) {
  const example = route.example
  if (!example) return ''
  const id = slugId(route, 'example')
  return `<section class="ref-example" aria-labelledby="${id}"><span class="ref-label">WORKED UK EXAMPLE</span><h2 id="${id}">${escapeHtml(example.title)}</h2>${example.intro
    .map((paragraph) => `<p>${rich(paragraph)}</p>`)
    .join('')}<div class="ref-ledger" role="table" aria-label="${escapeHtml(example.title)}">${example.rows
    .map(
      ([label, value, strong]) =>
        `<div role="row" class="${strong ? 'ref-ledger-total' : ''}"><span role="rowheader">${escapeHtml(label)}</span><span role="cell">${escapeHtml(value)}</span></div>`,
    )
    .join('')}</div>${(example.notes || []).map((paragraph) => `<p class="ref-note">${rich(paragraph)}</p>`).join('')}</section>`
}

function renderErrors(route) {
  if (!route.errors?.length) return ''
  const id = slugId(route, 'errors')
  return `<section class="ref-errors" aria-labelledby="${id}"><span class="ref-label">COMMON ERRORS</span><h2 id="${id}">${escapeHtml(route.errorsTitle || 'Where these entries go wrong.')}</h2><ol>${route.errors
    .map(([title, fix]) => `<li><strong>${escapeHtml(title)}</strong><p>${rich(fix)}</p></li>`)
    .join('')}</ol></section>`
}

function renderDeclarix(route) {
  const block = route.declarix
  if (!block) return ''
  const id = slugId(route, 'declarix')
  return `<section class="ref-declarix" aria-labelledby="${id}"><span class="ref-label">HOW DECLARIX PRE-CHECKS THE ENTRY</span><h2 id="${id}">${escapeHtml(block.title)}</h2>${block.paras
    .map((paragraph) => `<p>${rich(paragraph)}</p>`)
    .join('')}${block.list ? `<ul>${block.list.map((item) => `<li>${rich(item)}</li>`).join('')}</ul>` : ''}<div class="ref-actions"><a class="button" data-authority-related="pack_check" href="/tools/customs-document-pack-check/">RUN THE FREE PACK CHECK</a><a data-authority-related="pilot" href="/pilot/">SEE THE PILOT TERMS →</a></div></section>`
}

function renderFaqs(route) {
  if (!route.faqs?.length) return ''
  const id = slugId(route, 'faq')
  return `<section class="ref-faq" aria-labelledby="${id}"><span class="ref-label">QUESTIONS BROKERS ASK</span><h2 id="${id}">Answers first.</h2>${route.faqs
    .map(([question, answer]) => `<div class="ref-faq-item"><h3>${escapeHtml(question)}</h3><p>${rich(answer)}</p></div>`)
    .join('')}</section>`
}

function renderRelated(route) {
  const siblings = route.kind === 'procedure' ? procedurePages : route.kind === 'term' ? referencePages : []
  const siblingLinks = siblings
    .map((page) => {
      const current = page.path === route.path
      return `<a href="${page.path}"${current ? ' aria-current="page"' : ''} data-authority-related="sibling_${page.slug}"><span>${escapeHtml(page.code)}</span><strong>${escapeHtml(page.shortName)}</strong><em>${current ? 'THIS PAGE' : 'OPEN →'}</em></a>`
    })
    .join('')
  const extra = (route.related || [])
    .filter(([path]) => isKnownPath(path))
    .map(([path, code, label]) => `<a href="${path}" data-authority-related="related_${path.split('/').filter(Boolean).join('_')}"><span>${escapeHtml(code)}</span><strong>${escapeHtml(label)}</strong><em>OPEN →</em></a>`)
    .join('')
  const glossary = route.kind === 'glossary' ? '' : `<a href="/customs-reference/glossary/" data-authority-related="glossary"><span>A–Z</span><strong>UK customs glossary</strong><em>OPEN →</em></a>`
  const heading = route.kind === 'procedure' ? 'The six UK special procedures and reliefs.' : route.kind === 'term' ? 'Keep the next reference on the same desk.' : 'Go deeper on any term.'
  const id = slugId(route, 'related')
  return `<section class="workflow-register ref-register" aria-labelledby="${id}"><header><span>${route.kind === 'procedure' ? 'SPECIAL PROCEDURES' : 'CUSTOMS REFERENCE'}</span><h2 id="${id}">${heading}</h2></header><div>${siblingLinks}${extra}${glossary}</div></section>`
}

function renderGlossary(route) {
  const letters = [...new Set(route.terms.map((term) => term.term[0].toUpperCase()))].sort()
  const nav = `<nav class="glossary-index" aria-label="Glossary letters">${letters
    .map((letter) => `<a href="#letter-${letter.toLowerCase()}">${letter}</a>`)
    .join('')}</nav>`
  const groups = letters
    .map((letter) => {
      const terms = route.terms.filter((term) => term.term[0].toUpperCase() === letter)
      return `<section class="glossary-letter" aria-labelledby="letter-${letter.toLowerCase()}"><h2 id="letter-${letter.toLowerCase()}">${letter}</h2><dl>${terms
        .map((term) => {
          const id = term.term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          const page = term.page && isKnownPath(term.page) ? `<a class="glossary-more" href="${term.page}" data-authority-related="glossary_${id}">${escapeHtml(term.more || `Full guide to ${term.term}`)} →</a>` : ''
          const source = term.source ? ` <a class="glossary-source" href="${escapeHtml(term.source)}">GOV.UK source</a>` : ''
          return `<div id="term-${id}"><dt>${escapeHtml(term.term)}${term.alt ? ` <small>${escapeHtml(term.alt)}</small>` : ''}</dt><dd><p>${rich(term.plain)}${source}</p>${page}</dd></div>`
        })
        .join('')}</dl></section>`
    })
    .join('')
  return `${nav}<div class="glossary-body">${groups}</div>`
}

function renderSources(route) {
  const id = slugId(route, 'sources')
  return `<section class="authority-sources" aria-labelledby="${id}"><header><span>PRIMARY SOURCE REGISTER</span><h2 id="${id}">Every rule above, traced to GOV.UK.</h2><p>We checked each source on ${escapeHtml(route.checkedLabel)}. The date beside each link is the date the publisher last updated that page.</p></header><ol>${route.sources
    .map(
      (item) =>
        `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a><span>${escapeHtml(item.publisher)} · UPDATED ${escapeHtml(item.updated)} · CHECKED ${escapeHtml(item.checked)}</span></li>`,
    )
    .join('')}</ol></section>`
}

function analyticsScript(route, posthogKey, posthogHost) {
  const config = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  return `<script>(() => {
    const config = ${config};
    const get = (key) => { try { return sessionStorage.getItem(key) || ''; } catch { return ''; } };
    const set = (key, value) => { try { sessionStorage.setItem(key, value); } catch {} };
    const attribution = () => { const params = new URLSearchParams(location.search); const incoming = { source: params.get('utm_source') || params.get('src') || '', medium: params.get('utm_medium') || '', campaign: params.get('utm_campaign') || '' }; Object.entries(incoming).forEach(([key,value]) => { if (value && !get('dclrx-' + key)) set('dclrx-' + key, value); }); return Object.fromEntries(Object.keys(incoming).map((key) => [key, get('dclrx-' + key) || (key === 'source' ? 'direct' : 'none')])); };
    const distinctId = get('dclrx-distinct-id') || crypto.randomUUID(); set('dclrx-distinct-id', distinctId);
    const track = (event, properties = {}) => { const payload = { ...attribution(), ...properties, asset_family: 'customs-reference-${route.kind}', page_path: location.pathname }; window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event, ...payload }); if (!config.posthogKey) return; const body = JSON.stringify({ api_key: config.posthogKey, event, distinct_id: distinctId, properties: payload }); if (navigator.sendBeacon && navigator.sendBeacon(config.posthogHost + '/capture/', body)) return; fetch(config.posthogHost + '/capture/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => null); };
    document.querySelectorAll('[data-authority-related]').forEach((link) => link.addEventListener('click', () => track('authority_related_clicked', { target: link.dataset.authorityRelated })));
    document.querySelectorAll('[data-authority-booking]').forEach((link) => link.addEventListener('click', () => track('authority_booking_clicked', { placement: link.dataset.authorityBooking })));
  })();</script>`
}

export function renderProcedureRoute(route, site, { navHtml, webmasterHtml, posthogKey = '', posthogHost = 'https://eu.i.posthog.com' }) {
  const canonical = `${site.origin}${route.path}`
  const answer = `<section class="direct-answer"><span>DIRECT ANSWER · ${escapeHtml(route.code)}</span><h2>${escapeHtml(route.answer.heading)}</h2>${route.answer.body
    .map((paragraph) => `<p>${rich(paragraph)}</p>`)
    .join('')}</section>`
  const body =
    route.kind === 'glossary'
      ? `${answer}${renderGlossary(route)}${route.sections.map((section, index) => renderSection(section, route, index)).join('')}`
      : `${answer}${renderFacts(route)}${route.sections.map((section, index) => renderSection(section, route, index)).join('')}${renderExample(route)}${renderErrors(route)}${renderDeclarix(route)}${renderFaqs(route)}`
  return `<!doctype html><html lang="en-GB"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><meta name="description" content="${escapeHtml(route.description)}"/><meta name="robots" content="index,follow,max-image-preview:large"/><meta name="theme-color" content="#17333d"/>${webmasterHtml}<link rel="canonical" href="${canonical}"/><link rel="icon" type="image/svg+xml" href="/favicon.svg"/><link rel="stylesheet" href="/static-routes.css"/><link rel="stylesheet" href="/authority-library.css"/><link rel="stylesheet" href="/customs-procedures.css"/><meta property="og:type" content="article"/><meta property="og:site_name" content="Declarix"/><meta property="og:title" content="${escapeHtml(route.title)}"/><meta property="og:description" content="${escapeHtml(route.description)}"/><meta property="og:url" content="${canonical}"/><meta property="og:image" content="${site.origin}/og.jpg"/><meta name="twitter:card" content="summary_large_image"/><meta property="article:modified_time" content="${route.reviewedOn}"/><title>${escapeHtml(route.title)}</title><script type="application/ld+json">${jsonLd(route, site)}</script></head><body><div class="docket"><header class="masthead"><a class="wordmark" href="/">DECLARIX</a><div class="masthead-cell"><span>CUSTOMS REFERENCE</span><strong>UP TO 3×</strong></div><a class="masthead-cta" data-authority-booking="masthead" href="${bookingHref(route, 'masthead')}">BOOK THE NUMBERS CALL</a></header><nav class="route-nav" aria-label="Primary">${navHtml}</nav><div class="breadcrumbs">${breadcrumbHtml(route)}</div><main><header class="authority-hero"><div><p class="eyebrow">${escapeHtml(route.eyebrow)}</p><h1>${escapeHtml(route.h1)}</h1><p>${escapeHtml(route.standfirst)}</p></div><aside><span>${escapeHtml(route.ref)}</span><strong>${escapeHtml(route.stamp).replaceAll('\n', '<br/>')}</strong><small>PUBLISHED ${route.publishedOn}<br/>REVIEWED ${route.reviewedOn}<br/>BY DECLARIX CUSTOMS DESK</small></aside></header>${body}${renderRelated(route)}${renderSources(route)}<section class="cta-band authority-cta"><div><h2>Send the whole job. Your clerk checks it instead of building it.</h2><p>Declarix turns customer paperwork into a CDS-ready entry pack for Sequoia, Descartes e-Customs or your customer integration, with the source beside every field. Up to 3× more declarations per clerk. Bring your weekly volume to the 20-minute numbers call.</p></div><a class="button" data-authority-booking="bottom" href="${bookingHref(route, 'bottom')}">BOOK THE 20-MINUTE NUMBERS CALL</a></section><div class="source-stamp">SOURCE-LED CUSTOMS REFERENCE · REVIEWED ${route.reviewedOn} · <a href="/editorial-policy/">SOURCES AND CORRECTIONS</a> · <a href="mailto:${site.contact}">${site.contact}</a></div></main><footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav></footer></div>${analyticsScript(route, posthogKey, posthogHost)}</body></html>`
}

// Shared helpers for the trade tool page definitions.
export const REVIEWED = '2026-10-15'
export const CHECKED = '15 OCTOBER 2026'
export const PACK_CHECK = '/tools/customs-document-pack-check/'

export const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

export const gbp = (value) => `${Number(value) < 0 ? '−' : ''}£${Math.abs(Number(value)).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const source = (title, publisher, url, checked = CHECKED) => ({ title, publisher, url, checked })

// Links between the round-2 tools render only when the target tool is published,
// so each tool can ship on its own.
export const TRADE_TOOL_PATHS = new Set([
  '/tools/mrn-checker/',
  '/tools/gmr-checker/',
  '/tools/postponed-vat-statement-checker/',
  '/tools/import-duty-repayment-checker/',
  '/tools/commodity-code-checker/',
])
export const publishedTradeTools = new Set()
export const isLive = (path) => !TRADE_TOOL_PATHS.has(path) || publishedTradeTools.has(path)
export const link = (path, text) => (isLive(path) ? `<a href="${path}">${text}</a>` : text)

// Phone tables (issue S5): copy each column heading onto its body cells as data-label,
// so rows can turn into labelled cards under 480px. Runs at build time on the page HTML
// and, through toString(), in the browser on every result. Self-contained on purpose.
export function labelTables(html) {
  return String(html).replace(/<table([^>]*)>([\s\S]*?)<\/table>/g, (whole, attrs, inner) => {
    const head = inner.match(/<thead>([\s\S]*?)<\/thead>/)
    if (!head || / data-label=/.test(inner)) return whole
    const labels = [...head[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => m[1].replace(/<[^>]*>/g, '').replace(/"/g, '&quot;').trim())
    if (labels.length < 3) return whole
    const body = inner.replace(/<tbody>([\s\S]*?)<\/tbody>/, (all, rows) => '<tbody>' + rows.replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, (row, rowAttrs, cells) => {
      let index = 0
      return '<tr' + rowAttrs + '>' + cells.replace(/<(td|th)(\s[^>]*)?>/g, (cell, tag, cellAttrs = '') => '<' + tag + cellAttrs + ' data-label="' + (labels[index++] || '') + '">') + '</tr>'
    }) + '</tbody>')
    const cls = /class="/.test(attrs) ? attrs.replace(/class="/, 'class="tt-cardable ') : attrs + ' class="tt-cardable"'
    return '<table' + cls + '>' + body + '</table>'
  })
}

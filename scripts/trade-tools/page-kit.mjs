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

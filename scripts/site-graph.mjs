// Shared site graph: short page names, breadcrumb trails and entity nodes.
// Every renderer uses these helpers so hub levels and names stay consistent.
// New routes need nothing here: names fall back to the page title, and a new
// section hub is picked up as a breadcrumb level as soon as it is registered.

const shortNames = {
  '/': 'Home',
  '/privacy/': 'Privacy',
  '/security/': 'Security',
  '/supported-scope/': 'Supported scope',
  '/pricing/': 'Pricing',
  '/pricing-policy/': 'Pricing policy',
  '/how-it-works/': 'How it works',
  '/pilot/': 'Pilot',
  '/about/': 'About',
  '/terms/': 'Website terms',
  '/editorial-policy/': 'Editorial policy',
  '/customs-declaration-software/': 'Customs declaration software',
  '/customs-clearance-software/': 'Customs clearance software',
  '/customs-intermediary-registration-2026/': 'Intermediary registration 2026',
  '/roi-calculator/': 'ROI calculator',
  '/compare/automation-vs-outsourcing/': 'Automation vs outsourcing',
  '/tools/': 'Free tools',
  '/tools/customs-document-pack-check/': 'Document pack check',
  '/tools/customs-declaration-cost-calculator/': 'Declaration cost calculator',
  '/tools/customs-value-import-duty-vat-calculator/': 'Customs value, duty and VAT calculator',
  '/tools/eori-checker/': 'GB EORI checker',
  '/research/': 'Research',
  '/research/uk-customs-operations-signal-report-2026/': 'UK customs operations signal report 2026',
  '/research/hmrc-customs-administrative-burden-explorer-2026/': 'HMRC customs burden explorer 2026',
  '/research/cds-operations-radar/': 'CDS Operations Radar',
  '/customs-workflows/': 'Customs workflows',
  '/customs-workflows/gmr-gvms-checklist/': 'GMR and GVMS checklist',
  '/customs-workflows/postponed-vat-accounting-checklist/': 'Postponed VAT accounting checklist',
  '/customs-workflows/ipaffs-import-notification-checklist/': 'IPAFFS notification checklist',
  '/customs-workflows/ens-ics2-entry-summary-declaration-checklist/': 'ENS and ICS2 checklist',
  '/customs-workflows/duty-deferment-account-checklist/': 'Duty deferment account checklist',
  '/customs-workflows/t1-ncts-transit-checklist/': 'T1 and NCTS transit checklist',
  '/customs-reference/': 'Customs reference',
  '/customs-reference/incoterms/': 'Incoterms',
  '/customs-reference/incoterms/fob/': 'FOB',
  '/customs-reference/incoterms/cif/': 'CIF',
  '/customs-reference/incoterms/dap/': 'DAP',
  '/customs-reference/incoterms/fca/': 'FCA',
  '/customs-reference/incoterms/ddp/': 'DDP',
}

const registry = new Map()

export function shortName(route) {
  if (route.shortName) return route.shortName
  if (shortNames[route.path]) return shortNames[route.path]
  const title = String(route.schemaName || route.title || route.h1 || route.path)
  return title.split(' | ')[0].trim()
}

// Called once by the static generator with every published route (hubs included).
export function registerRoutes(routes) {
  registry.clear()
  registry.set('/', 'Home')
  for (const route of routes) registry.set(route.path, shortName(route))
}

export function registeredPaths() {
  return new Set(registry.keys())
}

export function nameForPath(path) {
  return registry.get(path) || shortNames[path] || path
}

// Published ancestors of a path, nearest last, excluding home and the page itself.
export function ancestorPaths(path) {
  const parts = path.split('/').filter(Boolean)
  const ancestors = []
  for (let index = 1; index < parts.length; index += 1) {
    const candidate = `/${parts.slice(0, index).join('/')}/`
    if (registry.has(candidate)) ancestors.push(candidate)
  }
  return ancestors
}

export function breadcrumbList(site, path, leafName = nameForPath(path)) {
  const trail = [['Home', '/'], ...ancestorPaths(path).map((ancestor) => [nameForPath(ancestor), ancestor]), [leafName, path]]
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, item], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${site.origin}${item}`,
    })),
  }
}

// Visible trail. leafHtml must already be escaped.
export function breadcrumbHtml(path, leafHtml) {
  const links = ancestorPaths(path).map((ancestor) => `<a href="${ancestor}">${escapeHtml(nameForPath(ancestor).toUpperCase())}</a>`)
  return ['<a href="/">HOME</a>', ...links, leafHtml].join(' → ')
}

// Shared Open Graph + Twitter card head block for hand-built pages.
export function socialHead(site, { title, description, path, type = 'website' }) {
  const canonical = `${site.origin}${path}`
  return [
    `<meta property="og:type" content="${type}" />`,
    '<meta property="og:site_name" content="Declarix" />',
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${site.origin}/og.jpg" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${site.origin}/og.jpg" />`,
  ].join('')
}

export function jsonLdScript(graph) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

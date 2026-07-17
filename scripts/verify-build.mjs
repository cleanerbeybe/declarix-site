import { access, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Script } from 'node:vm'
import { calculators } from './calculators.mjs'
import { eoriChecker, resolvePublicEoriReleaseConfig } from './eori-checker.mjs'
import { aggregateCsv, reports } from './reports.mjs'
import { routes, site } from './routes.mjs'
import { tools } from './tools.mjs'
import { calculateValueDutyScenario, valueDutyWorkpapers } from './value-duty-workpapers.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const contract = JSON.parse(await readFile(join(root, 'contracts/public-claims.v2.0.0.json'), 'utf8'))
const publicEori = resolvePublicEoriReleaseConfig()

if (contract.manifest_version !== site.claimsVersion) {
  throw new Error(`Claims manifest mismatch: ${contract.manifest_version} != ${site.claimsVersion}`)
}

const publicSources = [
  'index.html',
  'src/App.tsx',
  'src/data.ts',
  'src/world.tsx',
  'public/og.html',
  'scripts/routes.mjs',
  'scripts/tools.mjs',
  'scripts/calculators.mjs',
  'scripts/eori-checker.mjs',
  'scripts/reports.mjs',
  'scripts/value-duty-workpapers.mjs',
]
const publicSourceText = []
for (const source of publicSources) {
  const content = (await readFile(join(root, source), 'utf8')).toLowerCase()
  publicSourceText.push(content)
  for (const phrase of contract.prohibited_phrases) {
    if (content.includes(phrase.toLowerCase())) {
      throw new Error(`Prohibited public phrase "${phrase}" found in ${source}`)
    }
  }
}
const claimSurface = publicSourceText.join('\n')
for (const phrase of contract.required_product_language) {
  if (!claimSurface.includes(phrase.toLowerCase())) {
    throw new Error(`Required product boundary missing: ${phrase}`)
  }
}

const expected = [
  { path: '/', title: 'Up to 3× more declarations per clerk | Declarix' },
  ...routes,
  ...tools,
  ...calculators,
  ...reports,
  ...valueDutyWorkpapers,
  ...(publicEori.enabled ? [eoriChecker] : []),
]
const expectedPaths = new Set(expected.map((route) => route.path))
const detailedHeroBoundaryRoutes = new Set(['/privacy/', '/security/', '/terms/', '/editorial-policy/'])
const titles = new Set()
const canonicals = new Set()
const headings = new Set()
const inbound = new Map(expected.map((route) => [route.path, 0]))
for (const route of expected) {
  const file = route.path === '/' ? join(root, 'dist/index.html') : join(root, 'dist', route.path.slice(1), 'index.html')
  const html = await readFile(file, 'utf8')
  const h1s = [...html.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/g)]
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]
  const canonical = html.match(/<link rel="canonical" href="(.*?)"/i)?.[1]
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]
  if (h1s.length !== 1) throw new Error(`${route.path} has ${h1s.length} H1 elements`)
  if (!title || title !== route.title) throw new Error(`${route.path} has unexpected title: ${title}`)
  if (!canonical || canonical !== `${site.origin}${route.path}`) throw new Error(`${route.path} has unexpected canonical: ${canonical}`)
  if (!description || description.length < 80 || description.length > 180) throw new Error(`${route.path} has invalid description length`)
  if (html.includes('undefined') || html.includes('{{')) throw new Error(`${route.path} contains an unresolved publication token`)
  if (process.env.VITE_GOOGLE_SITE_VERIFICATION && !html.includes(process.env.VITE_GOOGLE_SITE_VERIFICATION)) {
    throw new Error(`${route.path} is missing Google site verification`)
  }
  if (process.env.VITE_BING_SITE_VERIFICATION && !html.includes(process.env.VITE_BING_SITE_VERIFICATION)) {
    throw new Error(`${route.path} is missing Bing site verification`)
  }
  if (titles.has(title)) throw new Error(`Duplicate title: ${title}`)
  if (canonicals.has(canonical)) throw new Error(`Duplicate canonical: ${canonical}`)
  const heading = h1s[0][1].replace(/<[^>]*>/g, '').trim()
  if (headings.has(heading)) throw new Error(`Duplicate H1: ${heading}`)
  if (route.path !== '/' && /<script\s[^>]*src=/i.test(html)) throw new Error(`${route.path} loads route JavaScript`)
  if (route.path !== '/' && !detailedHeroBoundaryRoutes.has(route.path)) {
    const heroStart = html.indexOf('<header class="hero')
    const heroEnd = html.indexOf('</header>', heroStart)
    const heroAdjacentMarkup = html.slice(heroEnd + 9).trimStart()
    const rendersLimitationStrip = /^<p\s+class="limitations"/i.test(heroAdjacentMarkup)
    const valueStrip = heroAdjacentMarkup.match(/^<div\s+class="hero-value-strip">([\s\S]*?)<\/div>/i)?.[1] || ''
    if (rendersLimitationStrip || /\b(?:LIMITATION|LEGAL|GOVERNANCE)\b/i.test(valueStrip.replace(/<[^>]*>/g, ' '))) {
      throw new Error(`${route.path} puts legal or governance language directly under its acquisition hero`)
    }
  }
  if (route.sources) {
    if (!html.includes('class="source-register"')) throw new Error(`${route.path} is missing its source register`)
    for (const source of route.sources) {
      if (!html.includes(source.url)) throw new Error(`${route.path} is missing source ${source.url}`)
    }
  }
  if (route.schemaType === 'Article' && !html.includes('"@type":"Article"')) {
    throw new Error(`${route.path} is missing Article structured data`)
  }
  if (tools.includes(route)) {
    const checkboxCount = (html.match(/type="checkbox"/g) || []).length
    if (checkboxCount < 18) throw new Error(`${route.path} has only ${checkboxCount} checklist prompts`)
    if (/type="(?:text|email|file)"/i.test(html) || /<textarea/i.test(html)) {
      throw new Error(`${route.path} must not collect document data, identifiers, or free text`)
    }
    for (const phrase of ['not a legal completeness check', 'not a readiness verdict', 'tool_started', 'tool_completed', 'tool_result_shared', 'tool_booking_clicked']) {
      if (!html.toLowerCase().includes(phrase.toLowerCase())) throw new Error(`${route.path} is missing tool contract: ${phrase}`)
    }
    if (!html.includes('"@type":"WebApplication"') || !html.includes('"isAccessibleForFree":true')) {
      throw new Error(`${route.path} is missing truthful WebApplication structured data`)
    }
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })
  }
  if (route.resourceKit) {
    if (
      !html.includes('class="resource-kit"') ||
      !html.includes("event, page_path: location.pathname") ||
      !html.includes('data-kit-booking="masthead"') ||
      !html.includes('data-kit-booking="bottom_cta"')
    ) {
      throw new Error(`${route.path} is missing the response kit or its privacy-safe dataLayer events`)
    }
    for (const asset of route.resourceKit.assets) {
      if (!html.includes(`href="${asset.href}"`) || !html.includes(`data-kit-download="${asset.id}"`)) {
        throw new Error(`${route.path} is missing downloadable kit asset ${asset.id}`)
      }
      await access(join(root, 'dist', asset.href.slice(1)))
    }
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })
  }
  if (calculators.includes(route)) {
    if (/type="(?:text|email|file)"/i.test(html) || /<textarea/i.test(html)) {
      throw new Error(`${route.path} must not collect document data, identifiers, or free text`)
    }
    for (const phrase of [
      'LABOUR COST / ENTRY = MINUTES / ENTRY × LOADED HOURLY COST ÷ 60',
      'No Declarix rate is assumed',
      'tool_started',
      'tool_completed',
      'tool_result_copied',
      'tool_result_printed',
      'tool_booking_clicked',
    ]) {
      if (!html.toLowerCase().includes(phrase.toLowerCase())) {
        throw new Error(`${route.path} is missing calculator contract: ${phrase}`)
      }
    }
    if (!html.includes('"@type":"WebApplication"') || !html.includes('"isAccessibleForFree":true')) {
      throw new Error(`${route.path} is missing truthful WebApplication structured data`)
    }
    if ((html.match(/class="calculator-faq"/g) || []).length < 3) {
      throw new Error(`${route.path} is missing visible question-and-answer support`)
    }
    if (html.includes('"@type":"FAQPage"')) {
      throw new Error(`${route.path} must not use restricted FAQPage schema on a commercial site`)
    }
    for (const outputId of [
      'annual-entries', 'current-hours', 'current-cost', 'target-hours', 'target-cost',
      'recoverable-hours', 'capacity-entries', 'labour-headroom', 'break-even',
    ]) {
      if (!html.includes(`id="${outputId}"`)) throw new Error(`${route.path} is missing output ${outputId}`)
    }
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })
  }
  if (reports.includes(route)) {
    for (const phrase of [
      '1,203 LEDGER DECISIONS',
      '50 PRIORITY-GRADE SIGNALS',
      '397 CMS-PRESERVATION FITS',
      '25% pain + 25% product fit + 20% timing + 15% reachability + 15% evidence quality',
      'operations_report_downloaded',
      'operations_report_booking_clicked',
      'operations_report_related_clicked',
      'operations_report_methodology_viewed',
      'operations_report_shared',
      'data-report-related="value_duty_workpaper"',
      "sessionStorage.getItem(key)",
      "config.posthogHost + '/capture/'",
    ]) {
      if (!html.toLowerCase().includes(phrase.toLowerCase())) {
        throw new Error(`${route.path} is missing report contract: ${phrase}`)
      }
    }
    if (!html.includes('"@type":"Report"') || !html.includes('"@type":"Dataset"')) {
      throw new Error(`${route.path} is missing Report and Dataset structured data`)
    }
    const reportSchema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')
    const breadcrumbs = reportSchema['@graph']?.find((item) => item['@type'] === 'BreadcrumbList')?.itemListElement || []
    if (breadcrumbs.length !== 2 || new Set(breadcrumbs.map((item) => item.item)).size !== 2) {
      throw new Error(`${route.path} must expose a two-level, non-duplicated breadcrumb trail`)
    }
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) {
      throw new Error(`${route.path} must not emit FAQPage or HowTo structured data`)
    }
    if (/type="(?:text|email|file)"/i.test(html) || /<textarea/i.test(html) || /<form/i.test(html)) {
      throw new Error(`${route.path} must not collect prospect, document, or newsletter data`)
    }
    if ((html.match(/<table>/g) || []).length < 3 || !html.includes('id="methodology"')) {
      throw new Error(`${route.path} is missing visible accessible data tables or methodology`)
    }
    for (const asset of route.downloads) {
      if (!html.includes(`href="${asset.href}"`) || !html.includes(`data-report-download="${asset.id}"`)) {
        throw new Error(`${route.path} is missing report download ${asset.id}`)
      }
      await access(join(root, 'dist', asset.href.slice(1)))
    }
    const csv = await readFile(join(root, 'dist', route.downloads[0].href.slice(1)), 'utf8')
    if (csv !== aggregateCsv(route)) throw new Error(`${route.path} aggregate CSV differs from the deterministic data model`)
    if (!csv.startsWith('"group","metric_id","label","count","denominator","percent","definition","snapshot_date"')) {
      throw new Error(`${route.path} aggregate CSV has an unexpected publication schema`)
    }
    for (const privateField of ['company_name', 'prospect_name', 'candidate_id', 'source_url', 'website_url', 'email_address', 'phone_number', 'http://', 'https://', '@']) {
      if (csv.toLowerCase().includes(privateField)) throw new Error(`${route.path} aggregate CSV exposes prohibited field ${privateField}`)
    }
    const svg = await readFile(join(root, 'dist', route.downloads[1].href.slice(1)), 'utf8')
    if (!svg.includes('<title') || !svg.includes('<desc') || !svg.includes('402') || !svg.includes('279')) {
      throw new Error(`${route.path} press chart is missing accessible aggregate context`)
    }
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })
  }

  if (valueDutyWorkpapers.includes(route)) {
    if (/type="(?:text|email|file)"/i.test(html) || /<textarea/i.test(html)) {
      throw new Error(`${route.path} must not collect document data, identifiers, email, or free text`)
    }
    if ((html.match(/type="number"/g) || []).length !== 10) {
      throw new Error(`${route.path} must expose exactly ten explicit numerical inputs`)
    }
    for (const phrase of [
      'CONVERTED GOODS = GOODS AMOUNT ÷ CURRENCY UNITS PER £1',
      'CUSTOMS VALUE = CONVERTED GOODS + FREIGHT + INSURANCE + ADDITIONS − DEDUCTIONS',
      'AD VALOREM DUTY',
      'IMPORT VAT VALUE',
      'does not calculate a specific or compound tariff',
      'No input is fetched or inferred',
      'does not perform a tariff lookup',
      'tool_started',
      'tool_completed',
      'tool_result_shared',
      'tool_result_printed',
      'tool_booking_clicked',
      '/research/uk-customs-operations-signal-report-2026/',
    ]) {
      if (!html.toLowerCase().includes(phrase.toLowerCase())) {
        throw new Error(`${route.path} is missing value and duty contract: ${phrase}`)
      }
    }
    if (!html.includes('"@type":"WebApplication"') || !html.includes('"isAccessibleForFree":true')) {
      throw new Error(`${route.path} is missing truthful WebApplication structured data`)
    }
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) {
      throw new Error(`${route.path} must not emit restricted FAQPage or HowTo structured data`)
    }
    for (const outputId of [
      'converted-goods', 'net-adjustments', 'customs-value', 'customs-duty',
      'import-vat-value', 'import-vat', 'tax-duty-total', 'planning-total',
    ]) {
      if (!html.includes(`id="${outputId}"`)) throw new Error(`${route.path} is missing output ${outputId}`)
    }
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })
  }

  if (route === eoriChecker) {
    if ((html.match(/type="text"/g) || []).length !== 1 || /type="(?:email|file)"/i.test(html) || /<textarea/i.test(html)) {
      throw new Error(`${route.path} must collect exactly one EORI value and no email, file or free text`)
    }
    for (const phrase of [
      'HMRC confirms this GB EORI is valid',
      'HMRC does not confirm this GB EORI as valid',
      'No registry answer',
      'European Commission checker',
      '/public/v1/eori/check',
      "method: 'POST'",
      "credentials: 'omit'",
      "cache: 'no-store'",
      'new AbortController()',
      "payload.registry.provider !== 'HMRC Check an EORI Number API'",
      'eori_check_started',
      'eori_check_completed',
      'eori_check_unavailable',
      'eori_result_booking_clicked',
      'eori_result_pack_checker_clicked',
      'data-eori-pack="result"',
      'data-eori-booking="result"',
      'public_company_details',
      "sessionStorage.getItem(key)",
    ]) {
      if (!html.toLowerCase().includes(phrase.toLowerCase())) {
        throw new Error(`${route.path} is missing EORI release contract: ${phrase}`)
      }
    }
    for (const prohibited of [
      'eori: candidate, outcome',
      'properties: { eori',
      'format is valid',
      'business is verified',
      'HMRC approved',
      'HMRC accredited',
    ]) {
      if (html.toLowerCase().includes(prohibited.toLowerCase())) {
        throw new Error(`${route.path} contains prohibited EORI copy or analytics shape: ${prohibited}`)
      }
    }
    if (!html.includes('"@type":"WebApplication"') || !html.includes('"isAccessibleForFree":true')) {
      throw new Error(`${route.path} is missing truthful WebApplication structured data`)
    }
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) {
      throw new Error(`${route.path} must not emit restricted FAQPage or HowTo structured data`)
    }
    if ((html.match(/class="eori-question"/g) || []).length < 4) {
      throw new Error(`${route.path} is missing visible question-and-answer support`)
    }
    const configMatch = html.match(/const config = (\{"apiUrl"[^;]+\});/)
    if (!configMatch) throw new Error(`${route.path} is missing the EORI browser endpoint configuration`)
    const browserConfig = JSON.parse(configMatch[1])
    if (browserConfig.apiUrl !== `${publicEori.apiOrigin}/public/v1/eori/check`) {
      throw new Error(`${route.path} EORI API endpoint differs from the release origin`)
    }
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })
  }

  for (const match of html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
    const href = match[1]
    if (href.startsWith('#') || href.startsWith('mailto:')) continue
    const url = new URL(href, site.origin)
    if (url.origin !== site.origin) continue
    if (url.pathname.startsWith('/downloads/')) continue
    if (!expectedPaths.has(url.pathname)) throw new Error(`${route.path} links to unknown route ${url.pathname}`)
    inbound.set(url.pathname, inbound.get(url.pathname) + 1)
  }

  if (route.path !== '/') {
    const words = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .trim()
      .split(/\s+/).length
    if (words < 220) throw new Error(`${route.path} is too thin at ${words} words`)
  }
  titles.add(title)
  canonicals.add(canonical)
  headings.add(heading)
}

const formulaFixture = calculateValueDutyScenario({
  goodsAmount: 10000,
  fxRate: 1.25,
  freight: 500,
  insurance: 100,
  additions: 400,
  deductions: 200,
  dutyRate: 5,
  otherImportCharges: 60,
  incidentalExpenses: 200,
  vatRate: 20,
})
const formulaExpected = {
  convertedGoods: 8000,
  netAdjustments: 200,
  customsValueBeforeClamp: 8800,
  customsValue: 8800,
  customsDuty: 440,
  importVatValue: 9500,
  importVat: 1900,
  taxDutyTotal: 2400,
  planningTotal: 11400,
}
for (const [key, expectedValue] of Object.entries(formulaExpected)) {
  if (Math.abs(formulaFixture[key] - expectedValue) > 1e-9) {
    throw new Error(`Value and duty formula drift at ${key}: ${formulaFixture[key]} != ${expectedValue}`)
  }
}
const clampedFixture = calculateValueDutyScenario({
  goodsAmount: 100,
  fxRate: 1,
  freight: 0,
  insurance: 0,
  additions: 0,
  deductions: 110,
  dutyRate: 10,
  otherImportCharges: 0,
  incidentalExpenses: 0,
  vatRate: 20,
})
if (clampedFixture.customsValueBeforeClamp !== -10 || clampedFixture.customsValue !== 0) {
  throw new Error('Value and duty negative-value formula boundary drifted')
}

const precisionFixture = calculateValueDutyScenario({
  goodsAmount: 100000000,
  fxRate: 0.0001,
  freight: 0,
  insurance: 0,
  additions: 0.01,
  deductions: 0,
  dutyRate: 0,
  otherImportCharges: 0,
  incidentalExpenses: 0,
  vatRate: 0,
})
if (Math.round(precisionFixture.customsValue * 100) !== 100000000000001) {
  throw new Error('Value and duty supported boundary no longer preserves the added penny')
}
try {
  calculateValueDutyScenario({
    goodsAmount: 100000000.01,
    fxRate: 1,
    freight: 0,
    insurance: 0,
    additions: 0,
    deductions: 0,
    dutyRate: 0,
    otherImportCharges: 0,
    incidentalExpenses: 0,
    vatRate: 0,
  })
  throw new Error('Value and duty amount above supported bounds was accepted')
} catch (error) {
  if (!String(error.message).includes('supported planning range')) throw error
}

for (const [path, count] of inbound) {
  if (path !== '/' && count === 0) throw new Error(`Orphan route: ${path}`)
}

const sitemap = await readFile(join(root, 'dist/sitemap.xml'), 'utf8')
for (const route of expected) {
  if (!sitemap.includes(`<loc>${site.origin}${route.path}</loc>`)) throw new Error(`Sitemap missing ${route.path}`)
}
const sitemapLocations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
if (sitemapLocations.length !== expected.length || new Set(sitemapLocations).size !== expected.length) {
  throw new Error('Sitemap route count or uniqueness mismatch')
}
if (!publicEori.enabled && sitemap.includes(eoriChecker.path)) {
  throw new Error('Dormant EORI checker must not appear in the sitemap before its release gates are enabled')
}

const notFound = await readFile(join(root, 'dist/404.html'), 'utf8')
if (!notFound.includes('noindex,follow') || /rel="canonical"/.test(notFound) || /<script/i.test(notFound)) {
  throw new Error('404 must be noindex, non-canonical, and static')
}

const bookingConfirmed = await readFile(join(root, 'dist/booking-confirmed/index.html'), 'utf8')
if (
  !bookingConfirmed.includes('noindex,follow') ||
  /rel="canonical"/.test(bookingConfirmed) ||
  (bookingConfirmed.match(/<h1(?:\s[^>]*)?>/g) || []).length !== 1 ||
  !bookingConfirmed.includes("event: 'booking_completed'")
) {
  throw new Error('Booking confirmation must be noindex, non-canonical, single-H1, and emit booking_completed')
}

const robots = await readFile(join(root, 'dist/robots.txt'), 'utf8')
for (const crawler of [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'PerplexityBot',
  'Applebot-Extended',
  'Google-Extended',
  'CCBot',
  'anthropic-ai',
  'Bytespider',
  'Amazonbot',
  'FacebookBot',
]) {
  if (!robots.includes(`User-agent: ${crawler}`)) throw new Error(`robots.txt does not explicitly manage ${crawler}`)
}
if (!robots.includes(`Sitemap: ${site.origin}/sitemap.xml`)) throw new Error('robots.txt does not advertise the sitemap')

for (const filename of ['llms.txt', 'llms-full.txt']) {
  const content = await readFile(join(root, `dist/${filename}`), 'utf8')
  for (const route of expected) {
    if (!content.includes(`${site.origin}${route.path}`)) throw new Error(`${filename} is missing ${route.path}`)
  }
  if (!content.includes('Declarix does not submit to HMRC')) throw new Error(`${filename} is missing the filing boundary`)
}

const indexNowKey = (await readFile(join(root, 'dist/indexnow.txt'), 'utf8')).trim()
if (!/^[A-Za-z0-9-]{8,128}$/.test(indexNowKey)) throw new Error('IndexNow key is invalid')

console.log(`Verified ${expected.length} indexable routes, one conversion receipt, one real 404, and owner-approved offer manifest ${site.claimsVersion}`)

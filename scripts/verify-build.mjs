import { access, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Script } from 'node:vm'
import { calculators } from './calculators.mjs'
import { documentGenerators, templateCsv } from './document-generators.mjs'
import { eoriChecker, resolvePublicEoriReleaseConfig } from './eori-checker.mjs'
import { radarCsv, radarDigests, radarHub, radarJson, radarLastObservedAt, radarRecords, radarRoutes } from './radar.mjs'
import { authorityAssets, authorityRoutes, incotermExample } from './authority-library.mjs'
import { alternativesRoutes } from './alternatives.mjs'
import { additionalRecords, documentRecords, errorRecords, procedureRecords, referenceAssets, referenceRoutes } from './customs-reference.mjs'
import { procedureRoutes } from './customs-procedures.mjs'
import { aggregateCsv, reports } from './reports.mjs'
import { agentFactsRoute } from './agent-facts.mjs'
import { economicsRoute } from './preparation-economics.mjs'
import { comparisonRoutes, pageSources } from './comparisons.mjs'
import { roiRoute } from './roi-calculator.mjs'
import { productPages } from './product-pages.mjs'
import { routes, site } from './routes.mjs'
import { sectionHubs } from './section-hubs.mjs'
import { organizationNode } from './site-graph.mjs'
import { softwareApplicationNode, softwareSchemaPaths } from './software-schema.mjs'
import { tools } from './tools.mjs'
import { tradeTools } from './trade-tools.mjs'
import { calculateValueDutyScenario, valueDutyWorkpapers } from './value-duty-workpapers.mjs'
import { useCaseRoutes } from './use-cases.mjs'
import { packages } from './pricing.mjs'

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
  'scripts/preparation-economics.mjs',
  'scripts/pricing.mjs',
  'scripts/roi-calculator.mjs',
  'scripts/eori-checker.mjs',
  'scripts/radar.mjs',
  'scripts/radar-observations.mjs',
  'scripts/authority-library.mjs',
  'scripts/customs-reference.mjs',
  'scripts/customs-reference-links.mjs',
  'scripts/customs-procedures.mjs',
  'scripts/customs-procedures-content.mjs',
  'scripts/reports.mjs',
  'scripts/value-duty-workpapers.mjs',
  'scripts/comparisons.mjs',
  'scripts/comparison-sources.mjs',
  'scripts/alternatives.mjs',
  'scripts/alternatives-vendors.mjs',
  'scripts/section-hubs.mjs',
  'scripts/site-graph.mjs',
  'scripts/software-schema.mjs',
  'scripts/document-generators.mjs',
  'scripts/product-pages.mjs',
  'scripts/product-pages-content.mjs',
  'scripts/use-cases.mjs',
  'scripts/trade-tools.mjs',
  'scripts/trade-tools/page-kit.mjs',
  ...tradeTools.map((tool) => `scripts/trade-tools/pages/${tool.pageFile}`),
  ...[...new Set(tradeTools.flatMap((tool) => tool.modules))].map((name) => `scripts/trade-tools/${name}.mjs`),
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

if (radarRecords.length < 5) throw new Error(`Radar must keep every released source-verified record, found ${radarRecords.length}`)
for (const legacyId of ['cds-service-status-current', 'cds-workarounds-release-5-2-0', 'cds-technical-documentation-2026-07-09', 'cds-document-code-9001-uk-india-fta-2026-07-15', 'cds-aggregation-eu-eori-2026-07-04']) {
  if (!radarRecords.some((record) => record.id === legacyId)) throw new Error(`Radar record was deleted instead of superseded: ${legacyId}`)
}
for (const record of radarRecords) {
  if (
    !record.review.publicationReady ||
    record.review.state !== 'agent_source_verified' ||
    record.review.reviewerKind !== 'agent' ||
    !record.review.reviewerIdentity ||
    record.review.publicationScope !== 'narrow_primary_source_fact' ||
    record.review.editorialAuthorization !== 'owner_authorized_build'
  ) {
    throw new Error(`Radar publication gate failed closed for ${record.id}`)
  }
  if (!/^[a-f0-9]{64}$/.test(record.source.sha256) || record.source.bytes < 1 || record.impacts.length < 2) {
    throw new Error(`Radar source or workflow evidence is incomplete for ${record.id}`)
  }
  for (const source of record.supportingSources) {
    if (!/^[a-f0-9]{64}$/.test(source.sha256) || source.bytes < 1 || !source.url.startsWith('https://')) {
      throw new Error(`Radar supporting source evidence is incomplete for ${record.id}`)
    }
  }
  const lastEvent = record.history.reduce((max, event) => (Date.parse(event.observedAt) > Date.parse(max) ? event.observedAt : max), record.history[0].observedAt)
  if (record.modifiedAt !== lastEvent || Date.parse(record.observedAt) > Date.parse(record.modifiedAt)) {
    throw new Error(`Radar record ${record.id} dateModified does not follow its append-only history`)
  }
  if (Date.parse(record.freshUntil) <= Date.parse(record.observedAt)) throw new Error(`Radar record ${record.id} has no freshness window`)
  if (record.supersededBy && !radarRecords.some((candidate) => candidate.id === record.supersededBy && candidate.supersedes === record.id)) {
    throw new Error(`Radar supersession link is not reciprocal for ${record.id}`)
  }
  const route = radarRoutes.find((candidate) => candidate.path === record.path)
  if (!route || route.reviewedOn !== record.modifiedAt.slice(0, 10)) throw new Error(`Radar route date drifted from record history: ${record.id}`)
}
if (radarRoutes.find((route) => route.kind === 'hub').reviewedOn !== radarLastObservedAt.slice(0, 10)) {
  throw new Error('Radar hub dateModified must equal the latest record observation')
}

const expected = [
  roiRoute,
  economicsRoute,
  ...comparisonRoutes,
  { path: '/', title: 'Up to 3× more declarations per clerk | Declarix' },
  ...routes,
  ...sectionHubs,
  ...tools,
  ...calculators,
  ...reports,
  ...valueDutyWorkpapers,
  ...documentGenerators,
  ...tradeTools,
  ...(publicEori.enabled ? [eoriChecker] : []),
  ...radarRoutes,
  ...authorityRoutes,
  ...alternativesRoutes,
  ...referenceRoutes,
  ...productPages,
  ...useCaseRoutes,
  agentFactsRoute,
  ...procedureRoutes,
]
const expectedPaths = new Set(expected.map((route) => route.path))
const detailedHeroBoundaryRoutes = new Set(['/privacy/', '/security/', '/terms/', '/editorial-policy/'])
const titles = new Set()
const canonicals = new Set()
const headings = new Set()
const inbound = new Map(expected.map((route) => [route.path, 0]))
const inboundPages = new Map(expected.map((route) => [route.path, new Set()]))
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
    if (!html.includes('class="source-register"') && !html.includes('class="authority-sources"')) {
      throw new Error(`${route.path} is missing its source register`)
    }
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
    if (breadcrumbs.length < 2 || new Set(breadcrumbs.map((item) => item.item)).size !== breadcrumbs.length) {
      throw new Error(`${route.path} must expose a non-duplicated breadcrumb trail of at least two levels`)
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

  if (documentGenerators.includes(route)) {
    if (/type="email"/i.test(html) || /type="password"/i.test(html) || /<form[^>]*action=/i.test(html)) {
      throw new Error(`${route.path} must not post or collect contact data`)
    }
    if (/fetch\(config\.apiUrl|XMLHttpRequest/.test(html)) throw new Error(`${route.path} must keep document data in the browser`)
    for (const phrase of [
      'Your data never leaves your browser.',
      'id="gen-preview"',
      'id="gen-print"',
      'id="gen-csv"',
      'id="gen-json"',
      'id="gen-print-blank"',
      'window.print()',
      '@media print',
      'tool_started',
      'tool_completed',
      'tool_result_printed',
      'tool_result_downloaded',
      'tool_booking_clicked',
      'data-gen-pack="result"',
      'href="/tools/customs-document-pack-check/"',
      `href="${route.templateCsv}"`,
      '<td>DE 6/8</td>',
      'WORKED EXAMPLE',
      "sessionStorage.getItem(key)",
    ]) {
      const haystack = phrase === '@media print' ? await readFile(join(root, 'dist/document-generator.css'), 'utf8') : html
      if (!haystack.includes(phrase)) throw new Error(`${route.path} is missing generator contract: ${phrase}`)
    }
    if (!html.includes('"@type":"WebApplication"') || !html.includes('"isAccessibleForFree":true')) {
      throw new Error(`${route.path} is missing truthful WebApplication structured data`)
    }
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) {
      throw new Error(`${route.path} must not emit restricted FAQPage or HowTo structured data`)
    }
    if ((html.match(/class="gen-question"/g) || []).length < 4) {
      throw new Error(`${route.path} is missing visible question-and-answer support`)
    }
    if ((html.match(/data-line-field/g) || []).length < route.schema.lineFields.length * 2) {
      throw new Error(`${route.path} is missing its repeatable line template`)
    }
    const csvTemplate = await readFile(join(root, 'dist', route.templateCsv.slice(1)), 'utf8')
    if (csvTemplate !== templateCsv(route)) throw new Error(`${route.path} blank CSV template drifted`)
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })
  }

  if (tradeTools.includes(route)) {
    for (const phrase of [
      'DIRECT ANSWER',
      'WORKED EXAMPLE',
      'HOW IT WORKS',
      'tool_started',
      'tool_completed',
      'tool_pack_check_clicked',
      'tool_booking_clicked',
      'data-tt-pack="result"',
      'data-tt-pilot="declarix"',
      'up to 3× more declarations',
      "sessionStorage.getItem(key)",
    ]) {
      if (!html.includes(phrase)) throw new Error(`${route.path} is missing trade tool contract: ${phrase}`)
    }
    if (!html.includes('"@type":"WebApplication"') || !html.includes('"isAccessibleForFree":true')) {
      throw new Error(`${route.path} is missing truthful WebApplication structured data`)
    }
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) {
      throw new Error(`${route.path} must not emit restricted FAQPage or HowTo structured data`)
    }
    if ((html.match(/class="tt-question"/g) || []).length < 4) throw new Error(`${route.path} is missing visible question-and-answer support`)
    if (!html.includes(`href="/tools/customs-document-pack-check/"`) || !html.includes('href="/pilot/"')) {
      throw new Error(`${route.path} is missing the pack-check and pilot next steps`)
    }
    // Analytics never carry what the visitor typed or uploaded.
    for (const prohibited of ['properties: { mrn', 'properties: { gmr', 'query: q.query', 'track(event, input', 'mrn: item']) {
      if (html.includes(prohibited)) throw new Error(`${route.path} sends visitor input to analytics: ${prohibited}`)
    }
    if (/sk_live|api[_-]?key\s*[:=]\s*['"][A-Za-z0-9]/i.test(html)) throw new Error(`${route.path} embeds a secret`)
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    if (inlineScripts.length !== 1) throw new Error(`${route.path} must ship exactly one inline tool script`)
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

  if (radarRoutes.includes(route)) {
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) {
      throw new Error(`${route.path} must not emit FAQPage or HowTo structured data`)
    }
    if (!html.includes('radar_booking_clicked') || !html.includes('radar_source_opened') || !html.includes('data-radar-booking="masthead"')) {
      throw new Error(`${route.path} is missing privacy-safe Radar conversion or source events`)
    }
    if (!html.includes('<meta property="og:image:width" content="1200"') || !html.includes('<meta name="twitter:image" content="https://getdeclarix.com/og.jpg"')) {
      throw new Error(`${route.path} is missing complete social-preview metadata`)
    }
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })

    const schemaText = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}'
    const schemaGraph = JSON.parse(schemaText)['@graph'] || []
    const dated = schemaGraph.find((item) => item.dateModified)
    if (!dated || dated.dateModified !== route.reviewedOn) throw new Error(`${route.path} JSON-LD dateModified differs from its sitemap lastmod`)
    if (route.kind === 'digest') {
      const digest = radarDigests.find((candidate) => candidate.id === route.digestId)
      for (const section of digest.sections) {
        for (const id of section.recordIds) {
          const record = radarRecords.find((candidate) => candidate.id === id)
          if (!html.includes(`href="${record.path}"`)) throw new Error(`${route.path} is missing digest record link ${id}`)
        }
      }
      for (const item of digest.watchList) if (!html.includes(item.source.url)) throw new Error(`${route.path} is missing watch-list source ${item.source.url}`)
      for (const required of ['"@type":"Article"', '"@type":"BreadcrumbList"', 'KEY DATES', 'ON THE WATCH LIST', 'data-radar-booking="bottom_cta"', '<meta property="og:type" content="article"']) {
        if (!html.includes(required)) throw new Error(`${route.path} is missing digest contract: ${required}`)
      }
    } else if (route.path === radarHub.path) {
      if (
        (html.match(/data-radar-result(?:\s|>)/g) || []).length !== radarRecords.length ||
        !html.includes('data-radar-filters') ||
        !html.includes('name="q"') ||
        !html.includes('name="topic"') ||
        !html.includes('name="stage"') ||
        !html.includes('name="state"') ||
        !html.includes('history.replaceState') ||
        !html.includes("not_yet_effective: 'NOT YET EFFECTIVE'") ||
        !html.includes('data-radar-download="json"') ||
        !html.includes('data-radar-download="csv"') ||
        !html.includes('"@type":"CollectionPage"') ||
        !html.includes('"@type":"ItemList"') ||
        !html.includes('<meta property="og:type" content="website"')
      ) {
        throw new Error('Radar hub is missing search, filters, live freshness, downloads, or collection schema')
      }
      if (/type="(?:email|file)"/i.test(html) || /<textarea/i.test(html)) {
        throw new Error('Radar hub must not collect prospect or operational data')
      }
    } else {
      const record = radarRecords.find((candidate) => candidate.path === route.path)
      if (!record) throw new Error(`Unknown Radar record route: ${route.path}`)
      for (const required of [
        record.source.url,
        record.source.sha256,
        record.review.reviewerIdentity,
        'WHY THIS MAY MATTER',
        'WORKFLOW IMPACT',
        'FRESHNESS + CORRECTION',
        'PRIMARY SOURCE PROOF',
        'APPEND-ONLY HISTORY',
        'data-radar-booking="after_value"',
        '"@type":"Article"',
        `"mainEntityOfPage":"${site.origin}${record.path}"`,
        '<meta property="og:type" content="article"',
      ]) {
        if (!html.includes(required)) throw new Error(`${route.path} is missing Radar record evidence: ${required}`)
      }
      if (/human[- ]reviewed|reviewed by (?:an?|the) human/i.test(html)) {
        throw new Error(`${route.path} falsely represents agent source verification as human review`)
      }
      for (const source of record.supportingSources) {
        if (!html.includes(source.url) || !html.includes(source.sha256)) throw new Error(`${route.path} is missing supporting source proof ${source.url}`)
      }
      if (record.supersededBy && !html.includes('SUPERSEDED BY A NEWER RECORD')) throw new Error(`${route.path} hides its superseded state`)
      for (const impact of record.impacts) {
        if (!html.includes(impact.impact) || !html.includes(impact.action)) {
          throw new Error(`${route.path} is missing bounded workflow impact ${impact.stage}`)
        }
      }
    }
  }

  if (authorityRoutes.includes(route)) {
    if (/<script\s[^>]*src=/i.test(html)) throw new Error(`${route.path} must stay self-contained`)
    if (/type="(?:text|email|file)"/i.test(html) || /<textarea/i.test(html)) {
      throw new Error(`${route.path} must not collect prospect, document, or newsletter data`)
    }
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) {
      throw new Error(`${route.path} must not emit FAQPage or HowTo structured data`)
    }
    for (const phrase of [
      'authority_asset_downloaded',
      'authority_related_clicked',
      'authority_booking_clicked',
      "sessionStorage.getItem(key)",
      "config.posthogHost + '/capture/'",
      'PRIMARY SOURCE REGISTER',
      'BOOK THE 20-MINUTE NUMBERS CALL',
    ]) {
      if (!html.toLowerCase().includes(phrase.toLowerCase())) {
        throw new Error(`${route.path} is missing authority contract: ${phrase}`)
      }
    }
    for (const source of route.sources) {
      if (!html.includes(source.url)) throw new Error(`${route.path} is missing source ${source.url}`)
    }
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')
    const graph = schema['@graph'] || []
    const requiredType = route.kind === 'burden-report' ? 'Report' : route.kind === 'incoterms-hub' ? 'CollectionPage' : 'Article'
    if (!graph.some((item) => item['@type'] === requiredType)) {
      throw new Error(`${route.path} is missing ${requiredType} structured data`)
    }
    if (route.kind === 'burden-report' && !graph.some((item) => item['@type'] === 'Dataset')) {
      throw new Error(`${route.path} is missing Dataset structured data`)
    }
    const breadcrumbs = graph.find((item) => item['@type'] === 'BreadcrumbList')?.itemListElement || []
    if (breadcrumbs.length < 2 || new Set(breadcrumbs.map((item) => item.item)).size !== breadcrumbs.length) {
      throw new Error(`${route.path} must expose a non-duplicated breadcrumb trail of at least two levels`)
    }
    for (const asset of authorityAssets(route)) {
      if (!html.includes(`href="${asset.href}"`) || !html.includes('data-authority-download=')) {
        throw new Error(`${route.path} is missing downloadable authority asset ${asset.href}`)
      }
      const assetPath = join(root, 'dist', asset.href.slice(1))
      await access(assetPath)
      const publishedAsset = await readFile(assetPath, 'utf8')
      if (publishedAsset !== asset.content) throw new Error(`${route.path} authority asset drifted: ${asset.href}`)
      if (asset.href.endsWith('.svg') && (!publishedAsset.includes('<title>') || !publishedAsset.includes('<desc>') || !publishedAsset.includes('viewBox='))) {
        throw new Error(`${route.path} authority SVG is missing accessible, responsive metadata: ${asset.href}`)
      }
    }
    if (route.kind === 'incoterms-hub') {
      for (const code of ['fob', 'cif', 'dap', 'fca', 'ddp', 'exw', 'fas', 'cfr', 'cpt', 'cip', 'dpu']) {
        if (!html.includes(`/customs-reference/incoterms/${code}/`)) throw new Error(`${route.path} is missing ${code.toUpperCase()} sheet`)
      }
      if ((html.match(/type="radio"/g) || []).length !== 8 || !html.includes('authority_chooser_completed')) {
        throw new Error(`${route.path} is missing the four-question chooser contract`)
      }
    }
    if (route.kind === 'incoterm-term') {
      if (!html.includes('/tools/customs-value-import-duty-vat-calculator/')) {
        throw new Error(`${route.path} is missing the value-and-duty bridge`)
      }
      if ((html.match(/class="handoff-map"/g) || []).length !== 1 || (html.match(/class="value-checks"/g) || []).length !== 1) {
        throw new Error(`${route.path} is missing its handoff map or value checks`)
      }
      if ((html.match(/class="worked-example"/g) || []).length !== 1) throw new Error(`${route.path} is missing its worked UK example`)
      const example = incotermExample(route)
      const customsValue = `£${example.customsValue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      if (!html.includes(customsValue)) throw new Error(`${route.path} worked example lost its customs value ${customsValue}`)
    }
    if (route.kind === 'burden-report') {
      for (const phrase of ['460', '19–28', '£5–£7', '≈70%', 'At most 1 in 5', '402 qualified accounts']) {
        if (!html.includes(phrase)) throw new Error(`${route.path} is missing source-faithful burden finding ${phrase}`)
      }
      const csv = await readFile(join(root, 'dist/downloads/hmrc-customs-burden-wave-2-summary.csv'), 'utf8')
      if (!csv.includes('upper bound') || !csv.includes('Do not convert weighted percentage')) {
        throw new Error(`${route.path} burden CSV lost an interpretation boundary`)
      }
    }
    if (route.kind === 'workflow') {
      if ((html.match(/class="workflow-path"/g) || []).length !== 1 || !html.includes('FIVE-CHECK HANDOFF')) {
        throw new Error(`${route.path} is missing its five-step workflow`)
      }
    }
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })
  }

  if (comparisonRoutes.includes(route)) {
    if (!/<table class="compare-table">[\s\S]*?<caption[\s\S]*?<th scope="col">[\s\S]*?<th scope="row">/.test(html)) {
      throw new Error(`${route.path} is missing its semantic comparison table`)
    }
    if (!html.includes('id="verdict-heading"') || !html.includes('class="faq-item"') || !html.includes('class="source-register"')) {
      throw new Error(`${route.path} is missing its verdict, visible FAQ or source register`)
    }
    if (route.kind !== 'hub' && !html.includes('Choose Declarix if')) throw new Error(`${route.path} is missing its Choose Declarix section`)
    for (const href of ['/tools/customs-document-pack-check/', '/pilot/']) {
      if (!html.includes(`href="${href}"`)) throw new Error(`${route.path} is missing next step ${href}`)
    }
    for (const source of pageSources(route)) {
      if (!html.includes(`href="${source.url}"`)) throw new Error(`${route.path} is missing source ${source.url}`)
    }
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')
    const graph = schema['@graph'] || []
    const faq = graph.find((item) => item['@type'] === 'FAQPage')
    const visible = (html.match(/class="faq-item"/g) || []).length
    if (!faq || faq.mainEntity.length !== visible) throw new Error(`${route.path} FAQPage must match the visible FAQ`)
    for (const question of faq.mainEntity) {
      if (!html.includes(question.name.replaceAll('&', '&amp;'))) throw new Error(`${route.path} FAQPage question is not visible: ${question.name}`)
    }
    if (!graph.some((item) => item['@type'] === 'BreadcrumbList')) throw new Error(`${route.path} is missing BreadcrumbList`)
    if (route.kind === 'hub' && !graph.some((item) => item['@type'] === 'ItemList')) throw new Error('/compare/ is missing ItemList')
  }

  if (alternativesRoutes.includes(route)) {
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) {
      throw new Error(`${route.path} must not emit FAQPage or HowTo structured data`)
    }
    if (!html.includes('class="verdict"') || (html.match(/class="faq-item"/g) || []).length < 4) {
      throw new Error(`${route.path} is missing its answer-first verdict or visible buyer questions`)
    }
    if (route.options && (!html.includes('<table class="compare-table">') || !html.includes('<th scope="row">Declarix</th>'))) {
      throw new Error(`${route.path} is missing its semantic comparison table with Declarix first`)
    }
    if (route.kind === 'hub' && !html.includes('"@type":"ItemList"')) throw new Error(`${route.path} is missing ItemList structured data`)
    for (const source of route.sources) {
      if (!html.includes(source.url)) throw new Error(`${route.path} is missing source ${source.url}`)
    }
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')
    if (!schema['@graph']?.some((item) => item['@type'] === 'BreadcrumbList')) throw new Error(`${route.path} is missing BreadcrumbList`)
  }

  if (route.path !== '/') {
    const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]))
    const nodes = graphs.flatMap((schema) => schema['@graph'] || [schema])
    const trail = nodes.find((item) => item['@type'] === 'BreadcrumbList')?.itemListElement || []
    if (trail.length < 2) throw new Error(`${route.path} is missing its BreadcrumbList`)
    if (trail.at(-1).item !== `${site.origin}${route.path}`) throw new Error(`${route.path} breadcrumb does not end at the page`)
    trail.forEach((item, index) => {
      if (item.position !== index + 1) throw new Error(`${route.path} breadcrumb positions are not sequential`)
      if (!item.name || item.name.length > 60 || /[.!?]$/.test(item.name)) throw new Error(`${route.path} breadcrumb name is not a short page name: ${item.name}`)
      const itemPath = new URL(item.item).pathname
      if (!expectedPaths.has(itemPath)) throw new Error(`${route.path} breadcrumb links to unknown route ${itemPath}`)
      if (!route.path.startsWith(itemPath)) throw new Error(`${route.path} breadcrumb level ${itemPath} is not an ancestor`)
    })
    for (const ancestor of expected) {
      if (ancestor.path !== '/' && ancestor.path !== route.path && route.path.startsWith(ancestor.path) && !trail.some((item) => item.item === `${site.origin}${ancestor.path}`)) {
        throw new Error(`${route.path} breadcrumb skips published level ${ancestor.path}`)
      }
    }
  }
  if (route.path !== '/') {
    for (const tag of ['og:image', 'og:title', 'og:description', 'og:url']) {
      if (!html.includes(`property="${tag}"`)) throw new Error(`${route.path} is missing ${tag}`)
    }
    if (!html.includes('name="twitter:card" content="summary_large_image"')) throw new Error(`${route.path} is missing its Twitter card`)
    if (title.length > 70) throw new Error(`${route.path} title is ${title.length} characters`)
  }
  if (route === roiRoute && !html.includes('"@type":"WebApplication"')) throw new Error(`${route.path} is missing WebApplication structured data`)
  if (route === economicsRoute && !html.includes('"@type":"WebPage"')) throw new Error(`${route.path} is missing WebPage structured data`)
  if (route === economicsRoute && title.length > 60) throw new Error(`${route.path} title exceeds 60 characters`)
  {
    const expectedOrganization = JSON.stringify(organizationNode(site))
    const organizations = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .flatMap((match) => JSON.parse(match[1])['@graph'] || [])
      .filter((item) => item['@type'] === 'Organization')
    if (organizations.length !== 1 || JSON.stringify(organizations[0]) !== expectedOrganization) {
      throw new Error(`${route.path} Organization entity differs from site-graph organizationNode()`)
    }
  }
  {
    const softwareNodes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .flatMap((match) => JSON.parse(match[1])['@graph'] || [])
      .filter((item) => item['@type'] === 'SoftwareApplication')
    if (softwareSchemaPaths.includes(route.path)) {
      if (softwareNodes.length !== 1 || JSON.stringify(softwareNodes[0]) !== JSON.stringify(softwareApplicationNode(site))) {
        throw new Error(`${route.path} SoftwareApplication entity differs from software-schema.mjs`)
      }
    } else if (softwareNodes.length) {
      throw new Error(`${route.path} carries a SoftwareApplication node outside the approved pages`)
    }
  }
  if (sectionHubs.includes(route)) {
    const children = expected.filter((candidate) => candidate.path !== route.path && candidate.path.startsWith(route.path))
    if (children.length < 2) throw new Error(`${route.path} hub has fewer than two children`)
    for (const child of children) {
      if (!html.includes(`href="${child.path}"`)) throw new Error(`${route.path} hub does not link ${child.path}`)
    }
    if (!html.includes('"@type":"CollectionPage"') || !html.includes('"@type":"ItemList"') || !html.includes(`"numberOfItems":${children.length}`)) {
      throw new Error(`${route.path} hub is missing CollectionPage / ItemList structured data`)
    }
  }
  if (referenceRoutes.includes(route)) {
    if (/<script\s[^>]*src=/i.test(html)) throw new Error(`${route.path} must stay self-contained`)
    if (/type="(?:text|email|file)"/i.test(html) || /<textarea/i.test(html)) throw new Error(`${route.path} must not collect free text or files`)
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) throw new Error(`${route.path} must not emit FAQPage or HowTo structured data`)
    for (const phrase of ['PRIMARY SOURCE REGISTER', 'BOOK THE 20-MINUTE NUMBERS CALL', 'authority_related_clicked', 'reference_filter_used', '/tools/customs-document-pack-check/', 'up to 3× more declarations per clerk', 'class="direct-answer"', 'class="ref-faq"']) {
      if (!html.includes(phrase)) throw new Error(`${route.path} is missing reference contract: ${phrase}`)
    }
    for (const source of route.sources) if (!html.includes(source.url)) throw new Error(`${route.path} is missing source ${source.url}`)
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')
    const types = (schema['@graph'] || []).map((item) => item['@type'])
    for (const type of ['TechArticle', 'Dataset', 'BreadcrumbList']) if (!types.includes(type)) throw new Error(`${route.path} is missing ${type} structured data`)
    const countRows = (name) => {
      const table = html.match(new RegExp(`<table[^>]*data-filter-table="${name}"[^>]*>([\\s\\S]*?)</table>`))?.[1] || ''
      return (table.match(/<tr\s+id=/g) || []).length
    }
    const expectedRows =
      route.kind === 'reference-procedure'
        ? [['pc', procedureRecords], ['apc', additionalRecords]]
        : route.kind === 'reference-document'
          ? [['doc', documentRecords]]
          : [['err', errorRecords]]
    for (const [name, records] of expectedRows) {
      const rows = countRows(name)
      if (rows !== records.length) throw new Error(`${route.path} server HTML has ${rows} of ${records.length} ${name} records`)
      for (const record of records) {
        if (!record.source_url || !/^\d{4}-\d{2}-\d{2}$/.test(record.checked_on)) throw new Error(`${route.path} record ${record.code} lacks source or checked date`)
      }
    }
    if (route.kind === 'reference-procedure') {
      for (const url of new Set([...procedureRecords, ...additionalRecords].map((record) => record.source_url))) {
        if (!html.includes(url)) throw new Error(`${route.path} is missing record source ${url}`)
      }
      if (!html.includes('id="cpc-checker"') || !html.includes('reference_combination_checked')) throw new Error(`${route.path} is missing the combination checker`)
    }
    for (const asset of referenceAssets(route)) {
      const published = await readFile(join(root, 'dist', asset.href.slice(1)), 'utf8')
      if (published !== asset.content) throw new Error(`${route.path} download drifted: ${asset.href}`)
      if (!html.includes(`href="${asset.href}"`)) throw new Error(`${route.path} does not link its download ${asset.href}`)
    }
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })
  }

  if (useCaseRoutes.includes(route)) {
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) {
      throw new Error(`${route.path} must not emit FAQPage or HowTo structured data`)
    }
    if (/type="(?:text|email|file)"/i.test(html) || /<textarea/i.test(html) || /<form/i.test(html)) {
      throw new Error(`${route.path} must not collect prospect or document data`)
    }
    if (html.includes('[PHONE]') || /\[your (?:name|firm)\]/i.test(html)) throw new Error(`${route.path} contains an unresolved placeholder`)
    for (const phrase of [
      'UP TO 3× MORE DECLARATIONS PER CLERK',
      'DIRECT ANSWER',
      'PRIMARY SOURCE REGISTER',
      'usecase_booking_clicked',
      'usecase_related_clicked',
      'data-usecase-booking="masthead"',
      'data-usecase-booking="bottom"',
      'Declarix',
    ]) {
      if (!html.includes(phrase)) throw new Error(`${route.path} is missing use-case contract: ${phrase}`)
    }
    if ((html.match(/class="uc-faq"/g) || []).length < 3) throw new Error(`${route.path} is missing visible question-and-answer support`)
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')
    const graph = schema['@graph'] || []
    const requiredType = route.kind === 'hub' ? 'CollectionPage' : 'WebPage'
    if (!graph.some((item) => item['@type'] === requiredType)) throw new Error(`${route.path} is missing ${requiredType} structured data`)
    if (route.kind === 'hub' && !graph.some((item) => item['@type'] === 'ItemList')) throw new Error(`${route.path} is missing ItemList structured data`)
    const breadcrumbs = graph.find((item) => item['@type'] === 'BreadcrumbList')?.itemListElement || []
    const expectedDepth = route.path.startsWith('/use-cases/') && route.path !== '/use-cases/' ? 3 : 2
    if (breadcrumbs.length !== expectedDepth || breadcrumbs.at(-1)?.item !== `${site.origin}${route.path}` || new Set(breadcrumbs.map((item) => item.item)).size !== expectedDepth) {
      throw new Error(`${route.path} has an unexpected breadcrumb trail`)
    }
    if (route.title.length > 60 || route.description.length > 155) throw new Error(`${route.path} title or description is too long`)
    for (const match of html.matchAll(/<img\s[^>]*src="([^"]+)"[^>]*>/gi)) {
      if (!/\salt="[^"]{20,}"/.test(match[0])) throw new Error(`${route.path} has an image without descriptive alt text`)
      await access(join(root, 'dist', match[1].slice(1)))
    }
    if (html.includes('worked-example-v3-page-') && !html.includes('WORKED EXAMPLE')) {
      throw new Error(`${route.path} shows the worked example without its WORKED EXAMPLE label`)
    }
    if (route.path === '/for/small-customs-brokerages/') {
      for (const tier of packages) {
        const row = `<th scope="row">${tier.name}</th><td>£${tier.monthly.toLocaleString('en-GB')} / month</td><td>${tier.included.toLocaleString('en-GB')} packs</td><td>£${tier.rate.toFixed(2)} / pack</td><td>£${tier.rate.toFixed(2)} / extra pack</td>`
        if (!html.includes(row)) throw new Error(`${route.path} package row differs from pricing.mjs: ${tier.name}`)
      }
      for (const phrase of ['£0 upfront. £1 per declaration, capped at £500. The pilot fee is fully waived if the agreed success criteria are missed.', 'Month to month. Cancel anytime. No seat fees. No hosting fees.']) {
        if (!html.includes(phrase)) throw new Error(`${route.path} lost verbatim commercial copy: ${phrase}`)
      }
    }
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })
  }

  if (procedureRoutes.includes(route)) {
    if (/type="(?:text|email|file)"/i.test(html) || /<textarea/i.test(html)) {
      throw new Error(`${route.path} must not collect prospect, document, or newsletter data`)
    }
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) {
      throw new Error(`${route.path} must not emit FAQPage or HowTo structured data`)
    }
    for (const phrase of ['PRIMARY SOURCE REGISTER', 'DIRECT ANSWER', 'authority_related_clicked', 'authority_booking_clicked', 'BOOK THE 20-MINUTE NUMBERS CALL']) {
      if (!html.includes(phrase)) throw new Error(`${route.path} is missing customs reference contract: ${phrase}`)
    }
    if (route.kind !== 'glossary') {
      for (const phrase of ['WORKED UK EXAMPLE', 'COMMON ERRORS', 'HOW DECLARIX PRE-CHECKS THE ENTRY', '/tools/customs-document-pack-check/']) {
        if (!html.includes(phrase)) throw new Error(`${route.path} is missing customs reference section: ${phrase}`)
      }
    }
    if (!route.sources.every((source) => /^https:\/\/(www\.gov\.uk|www\.trade-tariff\.service\.gov\.uk|developer\.service\.hmrc\.gov\.uk|assets\.publishing\.service\.gov\.uk)\//.test(source.url))) {
      throw new Error(`${route.path} cites a rule source outside GOV.UK`)
    }
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')
    const graph = schema['@graph'] || []
    const requiredType = route.kind === 'glossary' ? 'CollectionPage' : 'TechArticle'
    if (!graph.some((item) => item['@type'] === requiredType)) throw new Error(`${route.path} is missing ${requiredType} structured data`)
    if (route.kind === 'glossary' && !graph.some((item) => item['@type'] === 'DefinedTermSet')) {
      throw new Error(`${route.path} is missing DefinedTermSet structured data`)
    }
    const breadcrumbs = graph.find((item) => item['@type'] === 'BreadcrumbList')?.itemListElement || []
    if (breadcrumbs.length < 2 || breadcrumbs.at(-1).item !== `${site.origin}${route.path}`) {
      throw new Error(`${route.path} has an incomplete breadcrumb trail`)
    }
    const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, source] of inlineScripts) new Script(source, { filename: route.path })
  }

  if (productPages.includes(route)) {
    if (/<script\s[^>]*src=/i.test(html) || /<form/i.test(html)) throw new Error(`${route.path} must stay static and collect no data`)
    if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"HowTo"')) {
      throw new Error(`${route.path} must not emit FAQPage or HowTo structured data`)
    }
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')
    const graph = schema['@graph'] || []
    if (!graph.some((item) => item['@type'] === route.schemaType)) throw new Error(`${route.path} is missing ${route.schemaType} structured data`)
    const crumbs = graph.find((item) => item['@type'] === 'BreadcrumbList')?.itemListElement || []
    if (crumbs.length < 2 || crumbs.at(-1).item !== `${site.origin}${route.path}`) throw new Error(`${route.path} has a broken breadcrumb trail`)
    if (!html.includes('class="pp-answer"')) throw new Error(`${route.path} is missing its answer-first block`)
    if (route.family !== 'hub' && (html.match(/class="pp-faq-item"/g) || []).length < 4) throw new Error(`${route.path} is missing visible FAQs`)
    if (!html.includes('#book')) throw new Error(`${route.path} is missing the booking CTA`)
    for (const image of html.matchAll(/<img\s[^>]*>/gi)) {
      const src = image[0].match(/src="([^"]+)"/)?.[1]
      const alt = image[0].match(/alt="([^"]*)"/)?.[1]
      if (!alt || alt.length < 20) throw new Error(`${route.path} has an image without descriptive alt text`)
      if (!/width="\d+"/.test(image[0]) || !/height="\d+"/.test(image[0])) throw new Error(`${route.path} image lacks dimensions`)
      await access(join(root, 'dist', src.slice(1)))
    }
    for (const source of route.sources || []) {
      if (!html.includes(source.url)) throw new Error(`${route.path} is missing source ${source.url}`)
    }
  }

  for (const match of html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
    const href = match[1]
    if (href.startsWith('#') || href.startsWith('mailto:')) continue
    const url = new URL(href, site.origin)
    if (url.origin !== site.origin) continue
    if (url.pathname.startsWith('/downloads/')) continue
    // Agent-layer files (Markdown twins, JSON, feeds, llms.txt) are files, not routes; they must exist.
    if (/\.(?:md|json|xml|txt)$/.test(url.pathname)) {
      await access(join(root, 'dist', url.pathname.slice(1)))
      continue
    }
    if (!expectedPaths.has(url.pathname)) throw new Error(`${route.path} links to unknown route ${url.pathname}`)
    inbound.set(url.pathname, inbound.get(url.pathname) + 1)
    if (url.pathname !== route.path) inboundPages.get(url.pathname).add(route.path)
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

const radarJsonDownload = await readFile(join(root, 'dist/downloads/cds-operations-radar-v1.json'), 'utf8')
const radarCsvDownload = await readFile(join(root, 'dist/downloads/cds-operations-radar-v1.csv'), 'utf8')
if (radarJsonDownload !== radarJson()) throw new Error('Radar JSON download differs from its deterministic data model')
if (radarCsvDownload !== radarCsv()) throw new Error('Radar CSV download differs from its deterministic data model')
if (radarCsvDownload.trim().split('\n').length !== radarRecords.length + 1) throw new Error('Radar CSV must contain one header and one row per record')
const parsedRadar = JSON.parse(radarJsonDownload)
if (parsedRadar.record_count !== radarRecords.length || parsedRadar.records.length !== radarRecords.length) throw new Error('Radar JSON record count drifted')
const sitemapXml = await readFile(join(root, 'dist/sitemap.xml'), 'utf8')
for (const route of radarRoutes) {
  if (!sitemapXml.includes(`<loc>${site.origin}${route.path}</loc><lastmod>${route.reviewedOn}</lastmod>`)) {
    throw new Error(`Sitemap lastmod for ${route.path} must equal its Radar dateModified ${route.reviewedOn}`)
  }
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
for (const [path, sources] of inboundPages) {
  if (path !== '/' && sources.size < 2) throw new Error(`Weakly linked route: ${path} has ${sources.size} linking page(s); add a contextual link`)
}
const valueDutyHtml = await readFile(join(root, 'dist/tools/customs-value-import-duty-vat-calculator/index.html'), 'utf8')
for (const route of authorityRoutes.filter((candidate) => candidate.kind === 'incoterm-term')) {
  if (!valueDutyHtml.includes(`href="${route.path}"`)) throw new Error(`Customs value calculator does not link ${route.path}`)
}
for (const path of ['how-it-works', 'supported-scope']) {
  const html = await readFile(join(root, 'dist', path, 'index.html'), 'utf8')
  const body = html.slice(html.indexOf('<div class="content-grid">'), html.indexOf('</main>'))
  for (const money of ['/customs-declaration-software/', '/customs-clearance-software/']) {
    if (!body.includes(`href="${money}"`)) throw new Error(`/${path}/ body copy does not link ${money}`)
  }
}

const sitemap = await readFile(join(root, 'dist/sitemap.xml'), 'utf8')
for (const route of expected) {
  if (!sitemap.includes(`<loc>${site.origin}${route.path}</loc>`)) throw new Error(`Sitemap missing ${route.path}`)
}
for (const route of expected) {
  const lastmod = sitemap.match(new RegExp(`<loc>${site.origin}${route.path}</loc><lastmod>(\\d{4}-\\d{2}-\\d{2})</lastmod>`))?.[1]
  const floor = [route.reviewedOn, route.publishedOn, route.modifiedOn].filter(Boolean).sort().at(-1)
  if (!lastmod) throw new Error(`Sitemap is missing a lastmod for ${route.path}`)
  if (floor && lastmod < floor) throw new Error(`Sitemap lastmod for ${route.path} is older than its own dates`)
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
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
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

{
  const llmsFull = await readFile(join(root, 'dist/llms-full.txt'), 'utf8')
  const llmsIndex = await readFile(join(root, 'dist/llms.txt'), 'utf8')
  for (const phrase of ['# Full text of the main pages', 'Desk', '£500', 'Up to 3', 'CDS-ready', 'Sequoia']) {
    if (!llmsFull.includes(phrase)) throw new Error(`llms-full.txt is missing full-text content: ${phrase}`)
  }
  if (llmsFull.length < llmsIndex.length * 3) throw new Error('llms-full.txt is not materially fuller than llms.txt')
  if (/<[a-z][^>]*>/i.test(llmsFull.split('# Full text of the main pages')[1])) throw new Error('llms-full.txt full text contains HTML tags')
}

const indexNowKey = (await readFile(join(root, 'dist/indexnow.txt'), 'utf8')).trim()
if (!/^[A-Za-z0-9-]{8,128}$/.test(indexNowKey)) throw new Error('IndexNow key is invalid')

// Golden rule (owner, 15 Oct 2026): new pages never volunteer negatives about Declarix or label the
// worked examples as fake. Applies to every route added by the 15 Oct SEO build.
{
  const newRoutes = new Set([...comparisonRoutes, ...alternativesRoutes, ...productPages, ...useCaseRoutes, ...referenceRoutes, ...documentGenerators, ...tradeTools, ...sectionHubs, ...procedureRoutes, agentFactsRoute, ...radarDigests].map((route) => route.path))
  const banned = /fictional|synthetic(?! diamonds)|illustrative(?! labour model)|sample shipment data|review-only|results may vary|not a substitute|does not replace|do not replace|not legal advice|we did not test|not been tested|not verified|unverified/i
  for (const path of newRoutes) {
    let html
    try { html = await readFile(join(root, 'dist', path.slice(1), 'index.html'), 'utf8') } catch { continue }
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    const hit = text.match(banned)
    if (hit) throw new Error(`${path} volunteers a negative or labels the example as fake: "${hit[0]}"`)
  }
}

// Held routes (scripts/held-routes.mjs) must be completely absent: no page, no sitemap entry, no link.
{
  const { HELD_ROUTES } = await import('./held-routes.mjs')
  const sitemapXml = await readFile(join(root, 'dist/sitemap.xml'), 'utf8')
  for (const path of HELD_ROUTES) {
    if (expectedPaths.has(path)) throw new Error(`Held route ${path} is still in the published route list`)
    if (sitemapXml.includes(`${site.origin}${path}<`)) throw new Error(`Held route ${path} is in sitemap.xml`)
    let exists = true
    try { await access(join(root, 'dist', path.slice(1), 'index.html')) } catch { exists = false }
    if (exists) throw new Error(`Held route ${path} was generated`)
  }
}

// Owner ruling 15 Oct 2026: the site never mentions other organisations that use the name Declarix.
// Scans every published text file (pages, Markdown twins, llms, JSON, feeds, SKILL.md).
{
  const { readdir } = await import('node:fs/promises')
  const walk = async (dir) => (await Promise.all((await readdir(dir, { withFileTypes: true })).map((entry) => (entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)])))).flat()
  const banned = /other organi[sz]ations (?:use|using|called|named|with) |use the name declarix|not connected to (?:them|us|declarix)|disambiguat/i
  for (const file of await walk(join(root, 'dist'))) {
    if (!/\.(?:html|md|txt|json|xml)$/.test(file)) continue
    const hit = (await readFile(file, 'utf8')).match(banned)
    if (hit) throw new Error(`${file.slice(root.length)} mentions other organisations using the Declarix name: "${hit[0]}"`)
  }
}

await import('./verify-agent-layer.mjs')

console.log(`Verified ${expected.length} indexable routes, one conversion receipt, one real 404, and owner-approved offer manifest ${site.claimsVersion}`)

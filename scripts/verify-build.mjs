import { access, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Script } from 'node:vm'
import { calculators } from './calculators.mjs'
import { routes, site } from './routes.mjs'
import { tools } from './tools.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const contract = JSON.parse(await readFile(join(root, 'contracts/public-claims.v2.0.0.json'), 'utf8'))

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

const expected = [{ path: '/', title: 'Up to 3× more declarations per clerk | Declarix' }, ...routes, ...tools, ...calculators]
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

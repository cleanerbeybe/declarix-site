import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { routes, site } from './routes.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const contract = JSON.parse(await readFile(join(root, 'contracts/public-claims.v1.0.0.json'), 'utf8'))

if (contract.manifest_version !== site.claimsVersion) {
  throw new Error(`Claims manifest mismatch: ${contract.manifest_version} != ${site.claimsVersion}`)
}
if (contract.product_scope.legal_coverage_complete !== false) {
  throw new Error('This site release expects the review-only claims contract')
}

const publicSources = [
  'index.html',
  'src/App.tsx',
  'src/data.ts',
  'src/world.tsx',
  'public/og.html',
  'scripts/routes.mjs',
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

const expected = [{ path: '/', title: 'Customs document preparation for brokers | Declarix' }, ...routes]
const expectedPaths = new Set(expected.map((route) => route.path))
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
  if (titles.has(title)) throw new Error(`Duplicate title: ${title}`)
  if (canonicals.has(canonical)) throw new Error(`Duplicate canonical: ${canonical}`)
  const heading = h1s[0][1].replace(/<[^>]*>/g, '').trim()
  if (headings.has(heading)) throw new Error(`Duplicate H1: ${heading}`)
  if (route.path !== '/' && /<script\s[^>]*src=/i.test(html)) throw new Error(`${route.path} loads route JavaScript`)

  for (const match of html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
    const href = match[1]
    if (href.startsWith('#') || href.startsWith('mailto:')) continue
    const url = new URL(href, site.origin)
    if (url.origin !== site.origin) continue
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

console.log(`Verified ${expected.length} indexable routes, one real 404, and claims manifest ${site.claimsVersion}`)

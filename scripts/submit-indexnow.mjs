import { access, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Modes:
//   node scripts/submit-indexnow.mjs                       full: every sitemap URL (default, unchanged behaviour)
//   node scripts/submit-indexnow.mjs --changed --previous <file|url>
//                                                          changed: only URLs that are new or whose <lastmod> differs
//                                                          from the previous deploy's sitemap, plus their Markdown twins
//                                                          and the feeds/llms.txt that list them. Falls back to full
//                                                          when no previous sitemap can be read.
//   add --dry-run to print the URL list without sending it.
// Environment equivalents: INDEXNOW_MODE=changed, INDEXNOW_PREVIOUS_SITEMAP=<file|url>, INDEXNOW_DRY_RUN=1.

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const option = (name) => {
  const index = args.indexOf(name)
  return index === -1 ? undefined : args[index + 1]
}
const mode = flag('--changed') || process.env.INDEXNOW_MODE === 'changed' ? 'changed' : 'full'
const previousSource = option('--previous') || process.env.INDEXNOW_PREVIOUS_SITEMAP || ''
const dryRun = flag('--dry-run') || process.env.INDEXNOW_DRY_RUN === '1'
const origin = 'https://getdeclarix.com'

const key = (await readFile(join(root, 'public/indexnow.txt'), 'utf8')).trim()
const sitemap = await readFile(join(root, 'dist/sitemap.xml'), 'utf8')

const parseSitemap = (xml) =>
  new Map(
    [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
      .map(([, body]) => [body.match(/<loc>(.*?)<\/loc>/)?.[1], body.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || ''])
      .filter(([loc]) => loc),
  )
const current = parseSitemap(sitemap)

async function readPrevious(source) {
  if (!source) return null
  try {
    const xml = /^https?:\/\//.test(source)
      ? await fetch(source, { headers: { 'cache-control': 'no-cache' } }).then((response) => (response.ok ? response.text() : ''))
      : await readFile(source, 'utf8')
    const parsed = parseSitemap(xml)
    return parsed.size ? parsed : null
  } catch {
    return null
  }
}

const exists = (path) => access(join(root, 'dist', path)).then(() => true, () => false)
const markdownPath = (pathname) => (pathname === '/' ? '/index.md' : `${pathname.replace(/\/$/, '')}.md`)

async function changedUrls(previous) {
  const pages = [...current].filter(([loc, lastmod]) => previous.get(loc) !== lastmod).map(([loc]) => loc)
  if (!pages.length) return []
  const extras = new Set()
  for (const loc of pages) {
    const twin = markdownPath(new URL(loc).pathname)
    if (await exists(twin.slice(1))) extras.add(`${origin}${twin}`)
    if (loc.startsWith(`${origin}/research/cds-operations-radar/`)) {
      for (const feed of ['research/cds-operations-radar/feed.xml', 'research/cds-operations-radar/feed.json']) {
        if (await exists(feed)) extras.add(`${origin}/${feed}`)
      }
    }
  }
  for (const file of ['feed.xml', 'llms.txt', 'llms-full.txt']) {
    if (await exists(file)) extras.add(`${origin}/${file}`)
  }
  return [...pages, ...extras]
}

let urlList = [...current.keys()]
let effectiveMode = 'full'
if (mode === 'changed') {
  const previous = await readPrevious(previousSource)
  if (!previous) {
    console.log(`IndexNow: no previous sitemap from "${previousSource || '(none given)'}"; sending the full list instead`)
  } else {
    urlList = await changedUrls(previous)
    effectiveMode = 'changed'
    if (!urlList.length) {
      console.log('IndexNow: no new or changed sitemap URLs since the previous deploy; nothing to send')
      process.exit(0)
    }
  }
}

if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) throw new Error('Invalid IndexNow key')
if (!urlList.length) throw new Error('No sitemap URLs found for IndexNow')
if (urlList.length > 10000) urlList = urlList.slice(0, 10000)

if (dryRun) {
  console.log(`IndexNow dry run (${effectiveMode}): ${urlList.length} URLs`)
  console.log(urlList.join('\n'))
  process.exit(0)
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'getdeclarix.com',
    key,
    keyLocation: 'https://getdeclarix.com/indexnow.txt',
    urlList,
  }),
})

if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`)
}

console.log(`IndexNow accepted ${urlList.length} Declarix URLs (${effectiveMode} mode) with status ${response.status}`)

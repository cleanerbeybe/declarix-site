// Checks for the agent-readable layer written by scripts/agent-layer.mjs.
// Imported at the end of verify-build.mjs; can also run alone after a build.

import { access, readFile } from 'node:fs/promises'
import { isDeepStrictEqual } from 'node:util'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Script } from 'node:vm'
import { agentFactsRoute, agentFiles, formatExtra, formatIncluded, formatMonthly, formatRate, markdownPath, pricingCopy, pricingExampleText } from './agent-facts.mjs'
import { decodeEntities, parseHtml } from './html-to-markdown.mjs'
import { packages, priceForVolume } from './pricing.mjs'
import { radarRecords } from './radar.mjs'
import { site } from './routes.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')
const read = (path) => readFile(join(dist, path.replace(/^\//, '')), 'utf8')
const htmlPath = (path) => (path === '/' ? '/index.html' : `${path}index.html`)
const fail = (message) => {
  throw new Error(`Agent layer: ${message}`)
}
const visibleText = (html) =>
  decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<[^>]*>/g, ' '),
  ).replace(/\s+/g, ' ')

// Text a reader can see: skips script/style/svg and anything marked hidden or aria-hidden.
const shownText = (html) => {
  const walk = (node) => {
    if (node.text !== undefined) return node.text
    if (['script', 'style', 'svg', 'template', 'noscript'].includes(node.tag)) return ' '
    if (node.attrs && ('hidden' in node.attrs || node.attrs['aria-hidden'] === 'true')) return ' '
    return ` ${node.children.map(walk).join('')} `
  }
  return decodeEntities(walk(parseHtml(html))).replace(/\s+/g, ' ')
}

const offerPaths = new Set(['/', '/pricing/', '/pilot/', '/pricing-policy/'])
const contract = JSON.parse(await readFile(join(root, `contracts/public-claims.v${site.claimsVersion}.json`), 'utf8'))

// Sitemap: the facts page is listed; Markdown twins, JSON and feeds are not.
const sitemap = await read('/sitemap.xml')
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, loc]) => new URL(loc).pathname)
if (!paths.includes(agentFactsRoute.path)) fail('sitemap is missing /for-ai-assistants/')
if (paths.some((path) => !path.endsWith('/'))) fail('sitemap must list HTML pages only (no .md, .json or feed URLs)')

// 1. Markdown twins: one per sitemap page, linked from its HTML, same H1, canonical and £ figures.
let footerLinks = 0
for (const path of paths) {
  const html = await read(htmlPath(path))
  const md = markdownPath(path)
  const twin = await read(md).catch(() => fail(`${path} has no Markdown twin at ${md}`))
  if (!html.includes(`<link rel="alternate" type="text/markdown" href="${md}"`)) fail(`${path} does not link its Markdown twin`)
  if (!html.includes(`<link rel="alternate" type="application/atom+xml" href="${agentFiles.siteFeed}"`)) fail(`${path} does not link the site feed`)
  if (!twin.includes(`- Canonical: ${site.origin}${path}\n`)) fail(`${md} is missing its canonical line`)
  const h1 = visibleText(html.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/)?.[1] || '').trim()
  if (!twin.startsWith(`# ${h1}\n`)) fail(`${md} does not start with the page H1 "${h1}"`)
  const mainHtml = path === '/' ? html.slice(html.indexOf('<div id="root">'), html.indexOf('<noscript>')) : html.match(/<main[\s>][\s\S]*<\/main>/)?.[0] || ''
  const flatTwin = twin.replace(/\s+/g, ' ')
  for (const money of new Set(shownText(mainHtml).match(/£\d[\d,]*(?:\.\d+)?/g) || [])) {
    if (!flatTwin.includes(money)) fail(`${md} is missing the figure ${money} shown on ${path}`)
  }
  if (twin.includes('undefined') || /<\/?(?:div|span|section|script)\b/i.test(twin)) fail(`${md} contains unconverted markup or an unresolved token`)
  const hasFooterLink = html.includes(`href="${agentFactsRoute.path}" data-agent-layer="footer"`)
  if (hasFooterLink && offerPaths.has(path)) fail(`${path} is an offer page and must not get new visible words`)
  if (hasFooterLink) footerLinks += 1
}
if (footerLinks < 2) fail(`/for-ai-assistants/ is linked from only ${footerLinks} pages`)

// 2. Pricing JSON equals scripts/pricing.mjs and the words on the built /pricing/ page.
const pricing = JSON.parse(await read(agentFiles.pricing))
const pricingHtml = visibleText(await read(htmlPath('/pricing/'))).replace(/ ([.,;:])/g, '$1')
const fromJson = pricing.packages.map((tier) => ({ name: tier.name, monthly: tier.monthly_fee, included: tier.included_packs, rate: tier.rate_per_pack }))
if (!isDeepStrictEqual(fromJson, packages.map(({ name, monthly, included, rate }) => ({ name, monthly, included, rate })))) {
  fail('/api/pricing.json packages differ from scripts/pricing.mjs')
}
for (const [index, tier] of packages.entries()) {
  const display = pricing.packages[index].display
  if (pricing.packages[index].extra_pack_rate !== tier.rate) fail(`${tier.name} extra-pack rate differs from pricing.mjs`)
  for (const [key, expected] of [['monthly_fee', formatMonthly(tier)], ['included', formatIncluded(tier)], ['rate', formatRate(tier)], ['extra_packs', formatExtra(tier)]]) {
    if (display[key] !== expected) fail(`${tier.name} ${key} display differs from pricing.mjs`)
    if (!pricingHtml.includes(expected)) fail(`${tier.name} ${key} "${expected}" is not shown on /pricing/`)
  }
}
const copy = pricingCopy()
for (const text of [copy.pilot, copy.terms, copy.largerDesks, pricingExampleText()]) {
  if (!pricingHtml.includes(text)) fail(`pricing text is not on /pricing/: ${text}`)
}
if (pricing.pilot.text !== copy.pilot || pricing.terms_text !== copy.terms || pricing.worked_example.text !== pricingExampleText()) {
  fail('/api/pricing.json text differs from the /pricing/ route')
}
if (pricing.worked_example.monthly_total !== priceForVolume(2000).total || pricing.above_largest_package.quoted_rate_per_pack !== priceForVolume(3001).rate) {
  fail('/api/pricing.json worked example or quoted rate differs from priceForVolume()')
}
if (!copy.pilot.includes(`£${pricing.pilot.upfront_fee} upfront`) || !copy.pilot.includes(`£${pricing.pilot.fee_per_declaration} per declaration`) || !copy.pilot.includes(`capped at £${pricing.pilot.fee_cap}`)) {
  fail('/api/pricing.json pilot numbers differ from the pilot text')
}

// 3. Product and tools JSON.
const product = JSON.parse(await read(agentFiles.product))
if (product.company.company_number !== site.companyNumber || product.company.legal_name !== site.company) fail('/api/product.json company identity drifted')
if (!isDeepStrictEqual(product.key_facts, contract.approved_public_facts)) fail('/api/product.json key facts differ from the approved claims contract')
const toolsData = JSON.parse(await read(agentFiles.tools))
if (toolsData.tool_count !== toolsData.tools.length || toolsData.tools.length < 3) fail('/api/tools.json tool count is wrong')
for (const tool of toolsData.tools) {
  const path = new URL(tool.url).pathname
  if (!paths.includes(path)) fail(`/api/tools.json lists ${path}, which is not in the sitemap`)
  if (tool.markdown !== `${site.origin}${markdownPath(path)}`) fail(`/api/tools.json has the wrong Markdown URL for ${path}`)
  if (tool.webmcp_tool) {
    const html = await read(htmlPath(path))
    const script = html.match(/<script data-agent-layer="webmcp">([\s\S]*?)<\/script>/)?.[1]
    if (!script || !script.includes(`name: '${tool.webmcp_tool}'`)) fail(`${path} is missing its WebMCP tool ${tool.webmcp_tool}`)
    if (!script.includes("if (!mc || (typeof mc.registerTool !== 'function' && typeof mc.provideContext !== 'function')) return;")) {
      fail(`${path} WebMCP hook is not feature-detected`)
    }
    new Script(script, { filename: `${path}#webmcp` })
  }
}

// 4. Facts page and skill file repeat the published packages and company identity.
const facts = visibleText(await read(htmlPath(agentFactsRoute.path)))
const skill = await read(agentFiles.skill)
if (!skill.startsWith('---\nname: declarix\n')) fail('/agents/SKILL.md is missing its front matter')
for (const tier of packages) {
  for (const text of [formatMonthly(tier), formatIncluded(tier), formatExtra(tier)]) {
    if (!facts.includes(text)) fail(`/for-ai-assistants/ is missing ${text}`)
    if (!skill.includes(text)) fail(`/agents/SKILL.md is missing ${text}`)
  }
}
for (const text of [copy.pilot, site.companyNumber, 'Declarix Limited is not connected to them']) {
  if (!facts.includes(text)) fail(`/for-ai-assistants/ is missing "${text}"`)
}
if (!skill.includes(copy.pilot)) fail('/agents/SKILL.md is missing the pilot terms')

// 5. Feeds.
const siteFeed = await read(agentFiles.siteFeed)
if ((siteFeed.match(/<entry>/g) || []).length !== paths.length) fail('/feed.xml must have one entry per sitemap page')
const radarFeed = await read(agentFiles.radarFeed)
if ((radarFeed.match(/<entry>/g) || []).length !== radarRecords.length) fail('Radar Atom feed must have one entry per Radar record')
for (const record of radarRecords) {
  if (!radarFeed.includes(`<id>${site.origin}${record.path}</id>`)) fail(`Radar Atom feed is missing ${record.id}`)
}
const radarJsonFeed = JSON.parse(await read(agentFiles.radarJsonFeed))
if (radarJsonFeed.version !== 'https://jsonfeed.org/version/1.1' || radarJsonFeed.items.length !== radarRecords.length) fail('Radar JSON Feed is invalid')
for (const feed of [siteFeed, radarFeed]) {
  if (!feed.startsWith('<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">') || !feed.trimEnd().endsWith('</feed>')) fail('Atom feed envelope is malformed')
  if (/&(?!amp;|lt;|gt;|quot;|#\d+;)/.test(feed)) fail('Atom feed contains an unescaped ampersand')
}

// 6. llms files point to the agent layer.
for (const filename of ['/llms.txt', '/llms-full.txt']) {
  const llms = await read(filename)
  for (const file of [agentFactsRoute.path, agentFiles.skill, agentFiles.pricing, agentFiles.product, agentFiles.tools]) {
    if (!llms.includes(`${site.origin}${file}`)) fail(`${filename} does not list ${file}`)
  }
}

// 7. Claims contract applies to the agent layer sources and outputs too.
const surfaces = [
  ['scripts/agent-facts.mjs', await readFile(join(root, 'scripts/agent-facts.mjs'), 'utf8')],
  ['scripts/agent-layer.mjs', await readFile(join(root, 'scripts/agent-layer.mjs'), 'utf8')],
  [agentFiles.skill, skill],
  [agentFiles.product, JSON.stringify(product)],
  [agentFiles.tools, JSON.stringify(toolsData)],
  [agentFactsRoute.path, facts],
]
for (const [name, content] of surfaces) {
  for (const phrase of contract.prohibited_phrases) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) fail(`prohibited phrase "${phrase}" in ${name}`)
  }
}
for (const file of Object.values(agentFiles)) await access(join(dist, file.slice(1)))

console.log(`Verified agent layer: ${paths.length} Markdown twins, facts page linked from ${footerLinks} pages, pricing JSON = pricing.mjs, ${toolsData.tools.length} tools, ${radarRecords.length} Radar feed entries`)

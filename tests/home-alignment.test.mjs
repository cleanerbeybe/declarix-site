import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { discoveryEntry, verifyLegacyDiscovery } from '../scripts/discovery-entry.mjs'
import { routes, site } from '../scripts/routes.mjs'
import { productScopeRoutes } from '../scripts/product-scope.mjs'

const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const contract = JSON.parse(read('contracts/home-discovery-draft-2026-09-16.json'))
const sources = ['index.html','src/App.tsx','src/data.ts','src/world.tsx','public/og.html']
const surface = sources.map(read).join('\n').toLowerCase()

test('home and discovery contract is explicitly draft-only', () => {
  assert.equal(contract.status, 'draft_only_not_publication_approval')
  assert.deepEqual(contract.surfaces.slice(0,5), sources)
  const legacy = JSON.parse(read('contracts/public-claims.v2.0.0.json'))
  assert.equal(legacy.status, 'legacy_record_superseded_for_home_and_discovery_only')
  assert.equal(legacy.superseding_draft_contract, contract.contract_id)
})
test('home surfaces contain the current product boundary', () => {
  for (const phrase of contract.required_language) assert.ok(surface.includes(phrase.toLowerCase()), phrase)
})
test('home surfaces reject unsupported result claims', () => {
  for (const phrase of contract.prohibited_result_claims) assert.ok(!surface.includes(phrase.toLowerCase()), phrase)
})
test('hero, metadata and no-JS copy agree', () => {
  const index = read('index.html'); const app = read('src/App.tsx')
  for (const phrase of ['Customs preparation','Evidence-linked review','H1 STANDARD IMPORTS: REVIEW-ONLY, INCOMPLETE']) {
    assert.ok(index.includes(phrase), `index: ${phrase}`); assert.ok(app.includes(phrase), `app: ${phrase}`)
  }
  assert.match(index, /<noscript>[\s\S]*Customs preparation\. Evidence-linked review\./)
})
test('walkthrough is labelled synthetic and destination handoff stays bounded', () => {
  const app = read('src/App.tsx')
  for (const phrase of ['synthetic illustration','not a live product capture','NOT ACCEPTED DECLARIX CONNECTORS','confirm the exact version, mapping and acceptance criteria']) assert.ok(app.toLowerCase().includes(phrase.toLowerCase()), phrase)
})
test('buyer-input economics replaces fixed-result calculator', () => {
  const app = read('src/App.tsx')
  assert.match(app,/Model your own preparation costs/)
  assert.match(app,/\/compare\/automation-vs-outsourcing\//)
  assert.ok(!/annualSaving|£7\.95|£2\.45|UP TO 3× MORE DECLARATIONS/.test(app))
})
test('booking still loads Zoho only after visitor action', () => {
  const app = read('src/App.tsx')
  assert.match(app,/if \(!revealed \|\| !configured\) return/)
  assert.match(app,/setRevealed\(true\)/)
  assert.match(app,/document\.createElement\('script'\)/)
})
test('pilot price and turnaround are preserved for separate owner decision', () => {
  const app = read('src/App.tsx'); const data = read('src/data.ts')
  assert.match(app,/CAPPED AT £500/i); assert.match(app,/WITHIN ONE WORKING DAY/)
  assert.match(data,/capped at £500/)
})
test('global discovery uses the bounded entry renderer', () => {
  assert.match(read('scripts/generate-static-routes.mjs'), /discoveryEntry\(route, site.origin, discoveryPaths\)/)
  assert.match(read('scripts/verify-build.mjs'), /verifyLegacyDiscovery\(content,/)
})
test('all legacy routes suppress both title and description, keeping links', () => {
  const reviewedPaths = new Set(productScopeRoutes.map(route => route.path))
  const legacy = routes.filter(route => !reviewedPaths.has(route.path))
  const content = legacy.map(route => discoveryEntry(route, site.origin, reviewedPaths)).join('\n')
  verifyLegacyDiscovery(content, legacy, site.origin)
  for (const route of legacy) {
    assert.ok(content.includes(`[Indexed route: ${route.path}](${site.origin}${route.path})`))
    assert.ok(!content.includes(`[${route.title}]`))
    assert.ok(!content.includes(route.description))
  }
})
test('discovery rejects restored unsafe titles, descriptions, missing and duplicate entries', () => {
  const route = {path:'/legacy/',title:'Customs declaration automation for Sequoia and Descartes',description:'Up to 3× more declarations'}
  const safe = discoveryEntry(route, site.origin, new Set())
  assert.ok(!safe.includes(route.title) && !safe.includes(route.description))
  for (const unsafe of [
    safe.replace('Indexed route: /legacy/', route.title),
    safe + ' ' + route.description,
    '', safe + '\n' + safe,
  ]) assert.throws(() => verifyLegacyDiscovery(unsafe, [route], site.origin), /Unaligned discovery/)
})
test('reviewed routes retain their exact reviewed title and description', () => {
  const route = productScopeRoutes[0]
  assert.equal(discoveryEntry(route, site.origin, new Set([route.path])), `- [${route.title}](${site.origin}${route.path}): ${route.description}`)
})

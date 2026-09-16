import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { productScopeRoutes, scopeCard, scopeBoundary, validateProductScope } from '../scripts/product-scope.mjs'
import { routes } from '../scripts/routes.mjs'

test('scoped draft contract is valid and integrated once per existing path', () => {
  assert.equal(validateProductScope(), true)
  for (const r of productScopeRoutes) assert.deepEqual(routes.filter(x => x.path === r.path), [r])
})
test('dated contract matches executable copy and does not assert owner publication approval', () => {
  const saved = JSON.parse(readFileSync(new URL('../contracts/product-scope-draft-2026-09-16.json', import.meta.url)))
  assert.equal(saved.status,'draft_only_not_publication_approval');assert.deepEqual(saved.routes,productScopeRoutes);assert.deepEqual(saved.socialCard,scopeCard)
})
test('duplicate or absent routes fail closed', () => {
  assert.throws(()=>validateProductScope([]));assert.throws(()=>validateProductScope([productScopeRoutes[0],productScopeRoutes[0]]))
})
test('required contract fields cannot disappear', () => {
  for (const key of ['title','description','h1','standfirst','stamp','limitations','reviewedOn','claimContract','ogImage','cta','sections']) {const copy=structuredClone(productScopeRoutes);delete copy[0][key];assert.throws(()=>validateProductScope(copy),key)}
})
test('readiness, connector, price and benchmark regressions fail closed', () => {
  for (const claim of ['CDS-ready','3×','3x','200 seconds','£500','every field','every proposed field','supported export','supports Sequoia','ready for Sequoia']) {const copy=structuredClone(productScopeRoutes);copy[0].standfirst+=' '+claim;assert.throws(()=>validateProductScope(copy),claim)}
})
test('scope limits, snapshot gates and data-transfer warning cannot disappear', () => {
  for (const phrase of ['current-snapshot','approval gates','review-only','incomplete','does not submit directly to HMRC','not an accepted named connector','Do not attach live customer documents']) {const copy=JSON.parse(JSON.stringify(productScopeRoutes).replaceAll(phrase,''));assert.throws(()=>validateProductScope(copy),phrase)}
})
test('route dates, image and draft identity cannot silently use legacy values', () => {
  for (const [key,val] of [['reviewedOn','2026-07-17'],['ogImage','/og.jpg'],['claimContract','public-claims.v2.0.0']]) {const copy=structuredClone(productScopeRoutes);copy[0][key]=val;assert.throws(()=>validateProductScope(copy))}
})
test('visible route boundaries and descriptions are useful and scoped', () => {
  for (const r of productScopeRoutes) {assert.equal(r.limitations,scopeBoundary);assert.ok(r.description.length>=80&&r.description.length<=180);assert.ok(r.sections.length>=4)}
  assert.notEqual(productScopeRoutes[0].h1,productScopeRoutes[1].h1)
})
test('empty section content cannot pass as a complete scope page', () => {
  const copy=structuredClone(productScopeRoutes);copy[0].sections=[{title:'Nothing'}];assert.throws(()=>validateProductScope(copy))
})
test('social card has bounded copy and correct PNG dimensions', () => {
  assert.match(scopeCard.boundary,/review-only, incomplete/)
  const png=readFileSync(new URL('../public/product-scope.png',import.meta.url));assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630)
})

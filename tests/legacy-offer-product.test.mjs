import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { routes } from '../scripts/routes.mjs'

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8')
const contract = JSON.parse(read('contracts/legacy-offer-product-draft-2026-09-16.json'))
const reviewed = contract.reviewed_paths.map(path => {
  const route = routes.find(item => item.path === path)
  assert.ok(route, `missing reviewed route ${path}`)
  return route
})
const serialised = route => JSON.stringify(route)

test('legacy offer/product contract is draft-only and names its exact reviewed paths', () => {
  assert.equal(contract.status, 'draft_only_not_publication_approval')
  assert.deepEqual(contract.reviewed_paths, ['/security/', '/pricing/', '/pilot/', '/editorial-policy/'])
  assert.equal(contract.unreviewed_routes_remain_outside_scope, true)
  assert.equal(new Set(contract.reviewed_paths).size, contract.reviewed_paths.length)
})

test('reviewed routes retain current preparation and review boundaries', () => {
  const text = reviewed.map(serialised).join('\n')
  for (const boundary of contract.required_boundaries) assert.match(text, new RegExp(boundary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  for (const claim of contract.prohibited_product_claims) assert.doesNotMatch(text, new RegExp(claim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))
})

test('commercial terms remain byte-for-byte available while product language changes', () => {
  const pilot = routes.find(route => route.path === '/pilot/')
  const text = serialised(pilot)
  for (const term of contract.preserved_commercial_terms) assert.match(text, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
})

test('the editorial route makes contract succession explicit without declaring a whole-site replacement', () => {
  const editorial = serialised(routes.find(route => route.path === '/editorial-policy/'))
  assert.match(editorial, /route-specific claim contracts/)
  assert.match(editorial, /Historical offer records remain visible as history/)
  assert.match(editorial, /outside that contract remains outside the reviewed set/)
  assert.doesNotMatch(editorial, /manifest 2\.0\.0/i)
})

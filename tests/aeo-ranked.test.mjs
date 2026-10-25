import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { routes } from '../scripts/routes.mjs'

const route = routes.find((r) => r.path === '/customs-clearance-software/')

test('D2 reuses the buying answer and adds only the missing decision links', () => {
  assert.equal(route.h1, 'Keep the filing system. Remove the bottleneck before it.')
  assert.equal(route.sections.length, 6)
  const buying = route.sections.find((s) => s.label === '05 · BUYING FILE')
  assert.equal(buying.title, 'Compare the same ugly pack.')
  assert.equal(buying.list.length, 5)
  assert.deepEqual(buying.linkSentence.filter(Array.isArray), [
    ['source evidence', '/how-it-works/'],
    ['agreed handoff', '/supported-scope/'],
    ['package costs', '/pricing/'],
    ['pilot', '/pilot/'],
  ])
  assert.equal(route.modifiedOn, '2026-10-25')
  assert.ok(route.sources.every((s) => s.checked === '2026-07-16'))
  assert.ok(routes.some((r) => r.path === '/customs-declaration-software/'))
})

test('D1 and D4 retain their existing prepared route owners and no new URL family', () => {
  const comparison = readFileSync(new URL('../scripts/comparisons.mjs', import.meta.url), 'utf8')
  const audiences = readFileSync(new URL('../scripts/use-cases.mjs', import.meta.url), 'utf8')
  const glossary = readFileSync(new URL('../scripts/customs-procedures-content.mjs', import.meta.url), 'utf8')
  const reference = readFileSync(new URL('../scripts/customs-reference.mjs', import.meta.url), 'utf8')
  assert.ok(comparison.includes('/compare/declarix-vs-customaite/'))
  assert.ok(audiences.includes('/for/small-customs-brokerages/'))
  assert.ok(glossary.includes('/customs-reference/glossary/'))
  assert.ok(reference.includes('/tools/customs-document-pack-check/'))
})

test('the proposed panel stays unmeasured and product proof remains explicitly open', () => {
  const panel = readFileSync(new URL('../docs/aeo/2026-10-25/PANEL.csv', import.meta.url), 'utf8')
  assert.equal((panel.match(/,not_run,/g) || []).length, 8)
  const proof = readFileSync(new URL('../docs/aeo/2026-10-25/PROOF-ACCEPTANCE.md', import.meta.url), 'utf8')
  assert.ok(proof.includes('Acceptance remains OPEN'))
  assert.ok(proof.includes('email-first customer reply'))
})

// Unit checks for the Incoterms hub, the 11 rule pages and the ENS checklist (iter1 incoterms lane, INTENT-REVIEW §4.3/§4.7).
import test from 'node:test'
import assert from 'node:assert/strict'
import { authorityAssets, authorityRoutes } from '../scripts/authority-library.mjs'
import { incotermsSeo } from '../scripts/incoterms-content.mjs'

const terms = authorityRoutes.filter((route) => route.kind === 'incoterm-term')
const hub = authorityRoutes.find((route) => route.kind === 'incoterms-hub')
const ens = authorityRoutes.find((route) => route.guide === 'ens')

test('every rule page has a keyword title, full-name H1, meta and kept subhead', () => {
  assert.equal(terms.length, 11)
  for (const route of terms) {
    assert.ok(route.title.length <= 60, `${route.code} title ${route.title.length}`)
    assert.ok(route.title.startsWith(`${route.code} Incoterms 2020`), route.title)
    assert.ok(route.description.length >= 140 && route.description.length <= 155, `${route.code} meta ${route.description.length}`)
    assert.ok(route.h1.toLowerCase().includes(route.name.toLowerCase()), `${route.code} H1 lacks ${route.name}`)
    assert.ok(route.seo.definition.startsWith(route.code), `${route.code} first line`)
    assert.ok(route.subhead && route.subhead !== route.h1)
    assert.ok(route.faqs.length >= 4 && route.faqs.length <= 6, `${route.code} FAQ count`)
    assert.ok(route.seo.vs.length >= 2)
    for (const key of ['export', 'carriage', 'insurance', 'unloading', 'import', 'duties']) assert.ok(route.seo.obligations[key]?.[1], `${route.code} ${key}`)
  }
  assert.equal(new Set(authorityRoutes.map((route) => route.title)).size, authorityRoutes.length)
  assert.equal(new Set(authorityRoutes.map((route) => route.h1)).size, authorityRoutes.length)
})

test('Incoterms 2020 facts: only CIF and CIP make the seller insure; only DDP moves UK import to the seller', () => {
  const insurers = Object.entries(incotermsSeo).filter(([, seo]) => seo.obligations.insurance[0] === 'Seller').map(([code]) => code).sort()
  assert.deepEqual(insurers, ['CIF', 'CIP'])
  const sellerImport = Object.entries(incotermsSeo).filter(([, seo]) => seo.obligations.import[0] === 'Seller').map(([code]) => code)
  assert.deepEqual(sellerImport, ['DDP'])
  assert.equal(incotermsSeo.EXW.obligations.export[0], 'Buyer')
  assert.equal(incotermsSeo.DPU.obligations.unloading[0], 'Seller')
})

test('hub: keyword title, kept subhead, FAQ and an 11-rule CSV chart', () => {
  assert.equal(hub.title, 'Incoterms 2020 Chart: All 11 Rules Explained for UK Trade')
  assert.equal(hub.subhead, 'Choose the handoff. Then build the customs value trail.')
  assert.ok(hub.description.length >= 140 && hub.description.length <= 155)
  assert.ok(!/pdf/i.test(hub.description), 'no PDF promise without a PDF file')
  const [csv] = authorityAssets(hub)
  assert.equal(csv.content.trim().split('\n').length, 12)
})

test('ENS checklist: keyword title and H1, kept subhead, FAQ', () => {
  assert.ok(ens.title.length <= 60 && ens.title.includes('ENS') && ens.title.includes('ICS2'))
  assert.ok(ens.h1.includes('ENS') && ens.h1.includes('ICS2'))
  assert.equal(ens.subhead, 'Choose the ENS system from the movement—not the habit.')
  assert.ok(ens.description.length >= 140 && ens.description.length <= 155)
  assert.ok(ens.faqs.length >= 4)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { formatCode, normaliseCodeQuery, parseCommodity, parseHeading, parseSearch, searchLink, tariffLinks } from '../scripts/trade-tools/tariff.mjs'

// Fixtures are UK Trade Tariff API responses saved on 15 Oct 2026.
const fixture = (name) => JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8'))
const commodity = fixture('tariff-commodity-6109100010.json')

test('reads codes and goods descriptions', () => {
  assert.deepEqual(normaliseCodeQuery(' 6109.10 00-10 '), { kind: 'code', query: '6109100010', level: 'commodity', valid: true })
  assert.equal(normaliseCodeQuery('6109').level, 'heading')
  assert.equal(normaliseCodeQuery('61').level, 'chapter')
  assert.equal(normaliseCodeQuery('610910').level, 'subheading')
  assert.equal(normaliseCodeQuery('61091').valid, false)
  assert.deepEqual(normaliseCodeQuery('  cotton   t-shirts '), { kind: 'text', query: 'cotton t-shirts', level: null, valid: true })
  assert.equal(normaliseCodeQuery('a').valid, false)
})

test('formats codes and builds official tariff links', () => {
  assert.equal(formatCode('6109100010'), '6109 10 00 10')
  assert.equal(tariffLinks('6109100010'), 'https://www.trade-tariff.service.gov.uk/commodities/6109100010')
  assert.equal(tariffLinks('61091000'), 'https://www.trade-tariff.service.gov.uk/commodities/6109100000')
  assert.equal(tariffLinks('6109'), 'https://www.trade-tariff.service.gov.uk/headings/6109')
  assert.equal(tariffLinks('61'), 'https://www.trade-tariff.service.gov.uk/chapters/61')
  assert.equal(searchLink('cotton t-shirts'), 'https://www.trade-tariff.service.gov.uk/search?q=cotton%20t-shirts')
})

test('search for cotton t-shirts ranks 6109 10 00 10 first, with its tariff path', () => {
  const result = parseSearch(fixture('tariff-search-cotton-tshirt.json'))
  assert.equal(result.type, 'candidates')
  const [first] = result.candidates
  assert.equal(first.code, '6109100010')
  assert.equal(first.declarable, true)
  assert.equal(first.path.at(-1), 'T-shirts')
  assert.ok(result.candidates.length <= 12)
  assert.equal(new Set(result.candidates.map((c) => c.code + c.suffix)).size, result.candidates.length)
})

test('search recognises an exact match', () => {
  const result = parseSearch({ data: { attributes: { type: 'exact_match', entry: { endpoint: 'commodities', id: 6109100010 } } } })
  assert.deepEqual(result, { type: 'exact', endpoint: 'commodities', id: '6109100010' })
})

test('heading 6109 lists its declarable leaves', () => {
  const heading = parseHeading(fixture('tariff-heading-6109.json'))
  assert.equal(heading.code, '6109000000')
  assert.equal(heading.declarable, false)
  assert.equal(heading.leaves.length, 4)
  assert.deepEqual(heading.leaves.slice(0, 2).map((leaf) => leaf.code), ['6109100010', '6109100090'])
})

test('commodity 6109 10 00 10 with any origin: third-country duty, VAT and units', () => {
  const c = parseCommodity(commodity)
  assert.equal(c.formatted, '6109 10 00 10')
  assert.equal(c.declarable, true)
  assert.equal(c.thirdCountryDuty, '12.00 %')
  assert.deepEqual(c.vat, ['0.00%', '20.00%'])
  assert.equal(c.supplementaryUnit, 'items (p/st)')
  assert.ok(c.preferences.length > 10)
  assert.deepEqual(c.originPreference, [])
  assert.equal(c.path.at(-1), 'T-shirts')
  assert.equal(c.officialUrl, 'https://www.trade-tariff.service.gov.uk/commodities/6109100010')
})

test('origin China: no preference, no extra documents', () => {
  const c = parseCommodity(commodity, { origin: 'CN' })
  assert.deepEqual(c.originPreference, [])
  assert.deepEqual(c.additionalDuties, [])
  assert.deepEqual(c.documents.map((d) => d.code), ['C990'])
})

test('origin Israel: 0% preference with proof of origin Y864', () => {
  const c = parseCommodity(commodity, { origin: 'IL' })
  assert.deepEqual(c.originPreference, [{ area: 'Israel', duty: '0.00%', type: 'Tariff preference' }])
  assert.ok(c.documents.some((d) => d.code === 'Y864'))
})

test('origin Germany: EU 0% preference through group membership', () => {
  const c = parseCommodity(commodity, { origin: 'DE' })
  assert.deepEqual(c.originPreference, [{ area: 'European Union', duty: '0.00%', type: 'Tariff preference' }])
})

test('origin Russia: 35% additional duties and the 9014 exemption code', () => {
  const c = parseCommodity(commodity, { origin: 'RU' })
  assert.deepEqual(c.additionalDuties, [{ type: 'Additional duties', area: 'Russia', duty: '35.00%' }])
  assert.ok(c.documents.some((d) => d.code === '9014'))
})

test('a response without a commodity throws', () => {
  assert.throws(() => parseCommodity({}), /No commodity/)
})

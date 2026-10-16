import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { formatCode, goodsWords, normaliseCodeQuery, originProofLine, parseCommodity, parseHeading, parseRulesOfOrigin, parseSearch, searchLink, searchVariants, shortRate, singularWord, tariffLinks } from '../scripts/trade-tools/tariff.mjs'

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
  assert.deepEqual(c.documents, [])
  assert.equal(c.path.at(-1), 'T-shirts')
  assert.equal(c.officialUrl, 'https://www.trade-tariff.service.gov.uk/commodities/6109100010')
})

test('origin China: no preference, no origin documents; C990 sits under special end uses (CC2)', () => {
  const c = parseCommodity(commodity, { origin: 'CN' })
  assert.deepEqual(c.originPreference, [])
  assert.deepEqual(c.additionalDuties, [])
  assert.deepEqual(c.documents, [])
  assert.deepEqual(c.endUseDocuments.map((d) => d.code), ['C990'])
  assert.match(c.endUse[0].type, /ships, boats/)
})

test('origin Bangladesh: DCTS 0% preference, no C990 among the origin documents (CC2)', () => {
  const c = parseCommodity(commodity, { origin: 'BD' })
  assert.equal(c.originPreference.length, 1)
  assert.match(c.originPreference[0].area, /DCTS/)
  assert.equal(c.originPreference[0].duty, '0.00%')
  assert.ok(!c.documents.some((d) => d.code === 'C990'))
})

test('origin Israel: 0% preference with its proof of origin Y864 under the preference', () => {
  const c = parseCommodity(commodity, { origin: 'IL' })
  assert.equal(c.originPreference.length, 1)
  assert.deepEqual(c.originPreference[0].documents.map((d) => d.code), ['Y864'])
  assert.ok(!c.documents.some((d) => d.code === 'Y864'))
})

test('origin Germany: EU 0% preference through group membership', () => {
  const c = parseCommodity(commodity, { origin: 'DE' })
  assert.deepEqual(c.originPreference.map(({ area, duty, type }) => ({ area, duty, type })), [{ area: 'European Union', duty: '0.00%', type: 'Tariff preference' }])
})

test('VAT reads as the standard rate plus the listed reliefs (CC4)', () => {
  const c = parseCommodity(commodity)
  assert.equal(c.vatSummary, '20% (standard). 0% applies only to the listed reliefs: VAT zero rate (VATZ).')
  assert.deepEqual(c.vatReliefs, [{ rate: '0%', code: 'VATZ', description: 'VAT zero rate' }])
  assert.equal(shortRate('12.00 %'), '12%')
  assert.equal(shortRate('2.70%'), '2.7%')
  assert.equal(shortRate('€ 3.50 / 100 kg'), '€ 3.50 / 100 kg')
})

test('rules of origin: DCTS proofs carry their DE 2/3 codes (CC3)', () => {
  const schemes = parseRulesOfOrigin(fixture('tariff-rules-of-origin-610910-BD.json'))
  assert.equal(schemes[0].scheme, 'dcts-ldcs')
  assert.deepEqual(schemes[0].codes, [{ code: '9001', label: 'origin declaration' }, { code: 'N865', label: 'Form A' }])
  assert.equal(originProofLine(schemes, []), 'Proof of origin: Generalised Scheme of Preferences Form A (code N865) or Origin declaration (code 9001). Declare the code in DE 2/3.')
})

test('rules of origin: Israel lists its proofs and the Y864 condition from the measure (CC3)', () => {
  const schemes = parseRulesOfOrigin(fixture('tariff-rules-of-origin-610910-IL.json'))
  const c = parseCommodity(commodity, { origin: 'IL' })
  const line = originProofLine(schemes, c.originPreference[0].documents)
  assert.match(line, /^Proof of origin: EUR\.1 movement certificate or EUR-MED movement certificate or Origin declaration\. Declare in DE 2\/3: Y864: /)
  assert.ok(!line.includes('..'))
  assert.equal(originProofLine([], []), '')
})

test('plain-language search: people, filler and construction words drop out (CC1)', () => {
  assert.deepEqual(goodsWords('mens t-shirts cotton knitted'), ['t-shirts', 'cotton', 'knitted'])
  assert.deepEqual(goodsWords('Men’s cotton T shirts'), ['cotton', 't-shirts'])
  assert.deepEqual(goodsWords("Women's leather handbags for the office"), ['leather', 'handbags', 'office'])
  assert.deepEqual(goodsWords('tshirts'), ['t-shirts'])
  assert.equal(singularWord('bottles'), 'bottle')
  assert.equal(singularWord('accessories'), 'accessory')
  assert.equal(singularWord('boxes'), 'box')
  assert.equal(singularWord('glass'), 'glass')
  assert.equal(singularWord('trousers'), 'trousers')
})

test('plain-language search: "mens t-shirts cotton knitted" retries with words the tariff matches (CC1)', () => {
  const variants = searchVariants('mens t-shirts cotton knitted')
  // Checked live on 16 Oct 2026: the first variant returns 6109 10 00 10, 6109 10 00 90 and 6109 10 00 00.
  assert.equal(variants[0], 't-shirts cotton knitted')
  assert.ok(variants.includes('t-shirts cotton'))
  assert.ok(!variants.includes('mens t-shirts cotton knitted'))
  assert.ok(variants.length <= 8)
  assert.deepEqual(searchVariants('womens leather handbags').slice(0, 3), ['leather handbags', 'leather handbag', 'handbags'])
  assert.equal(searchVariants('stainless steel water bottles')[1], 'water bottles')
  assert.deepEqual(searchVariants('cotton t-shirts'), ['cotton t-shirt', 't-shirts', 'cotton'])
  assert.deepEqual(searchVariants('the'), [])
})

test('origin Russia: 35% additional duties and the 9014 exemption code', () => {
  const c = parseCommodity(commodity, { origin: 'RU' })
  assert.deepEqual(c.additionalDuties, [{ type: 'Additional duties', area: 'Russia', duty: '35.00%' }])
  assert.ok(c.documents.some((d) => d.code === '9014'))
})

test('a response without a commodity throws', () => {
  assert.throws(() => parseCommodity({}), /No commodity/)
})

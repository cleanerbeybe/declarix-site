import test from 'node:test'
import assert from 'node:assert/strict'
import { GMR_PATTERN, checkGmr, gmrReferences, normaliseGmr } from '../scripts/trade-tools/gmr.mjs'

// gmrId examples from the HMRC Goods Movement System Haulier API 1.0 spec (checked 15 Oct 2026).
const SPEC_EXAMPLES = ['GMRA000002JR', 'GMRA000000F8', 'GMRB00000A9C', 'GMRA0000028D']

test('accepts the GMR examples from the HMRC API specification', () => {
  for (const gmr of SPEC_EXAMPLES) {
    assert.ok(GMR_PATTERN.test(gmr), gmr)
    const result = checkGmr(gmr)
    assert.equal(result.valid, true, gmr)
    assert.equal(result.parts.prefix, 'GMR')
  }
  assert.equal(checkGmr('GMRB00000A9C').parts.series, 'B')
})

test('cleans spaces, dashes and lower case', () => {
  assert.equal(normaliseGmr(' gmr-a000 002jr '), 'GMRA000002JR')
  assert.equal(checkGmr('gmr a000002jr').valid, true)
})

test('rejects wrong length, prefix and series character', () => {
  assert.match(checkGmr('GMRA00002JR').errors.join(' '), /12 characters/)
  assert.match(checkGmr('GMXA000002JR').errors.join(' '), /starts with the letters GMR/)
  assert.match(checkGmr('GMR1000002JR').errors.join(' '), /Character 4 must be a letter/)
  assert.match(checkGmr('').errors[0], /Enter a GMR/)
})

test('spots an MRN or a DUCR pasted in place of a GMR', () => {
  assert.match(checkGmr('21GB1NEXFX6SU9C4R1').hints[0], /looks like an MRN/)
  assert.match(checkGmr('6GB123456789000-INV1').hints[0], /DUCR/)
})

test('EU to GB accompanied movement needs the vehicle and import MRN', () => {
  const list = gmrReferences({ direction: 'eu_gb', accompanied: true }).map((item) => item.reference)
  assert.deepEqual(list, ['Vehicle registration number', 'Import MRN from CDS', 'Entry summary declaration MRN (optional)'])
})

test('transit movements use the NCTS MRN and never the import declaration', () => {
  const list = gmrReferences({ direction: 'eu_gb', accompanied: false, transit: true }).map((item) => item.reference)
  assert.equal(list[0], 'Trailer number or container reference')
  assert.ok(list.includes('Transit MRN from NCTS'))
  assert.ok(list.includes('Do not add import declaration references'))
  assert.ok(!list.includes('Import MRN from CDS'))
})

test('GB to NI needs the ENS MRN; GB to EU needs DUCRs', () => {
  assert.ok(gmrReferences({ direction: 'gb_ni' }).some((item) => item.reference === 'Entry summary declaration MRN'))
  assert.ok(gmrReferences({ direction: 'gb_eu' }).some((item) => item.reference === 'DUCR for every export declaration'))
  assert.ok(gmrReferences({ direction: 'ni_gb' }).some((item) => item.reference === 'Export Accompanying Document'))
})

test('carnets, EIDR and empty movements', () => {
  assert.ok(gmrReferences({ direction: 'eu_gb', carnet: true }).some((item) => /carnet/.test(item.reference)))
  assert.ok(gmrReferences({ direction: 'eu_gb', eidr: true }).some((item) => /EORI of the authorised trader/.test(item.reference)))
  assert.equal(gmrReferences({ direction: 'gb_eu', oralOrEmpty: true }).length, 2)
  assert.throws(() => gmrReferences({ direction: 'mars' }))
})

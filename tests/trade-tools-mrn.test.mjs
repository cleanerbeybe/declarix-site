import test from 'node:test'
import assert from 'node:assert/strict'
import { MRN_NEXT_STEP, MRN_PROCEDURES, decodeMrn, findMrns, mrnCharValue, mrnCheckDigit, mrnStatusService, mrnTracking, normaliseMrn } from '../scripts/trade-tools/mrn.mjs'

// MRNs published in HMRC Developer Hub API specifications (checked 15 Oct 2026).
const HMRC_EXAMPLES = ['19GB4S24GC3PPFGVR7', '20GB32VVZI0YMFGVR0', '20GBDPQ8A31WX1XXR5', '21GB1NEXFX6SU9C4R1', '10GB00002910B75BE5']

test('ISO 6346 letter values skip multiples of 11', () => {
  assert.equal(mrnCharValue('0'), 0)
  assert.equal(mrnCharValue('9'), 9)
  assert.equal(mrnCharValue('A'), 10)
  assert.equal(mrnCharValue('B'), 12)
  assert.equal(mrnCharValue('K'), 21)
  assert.equal(mrnCharValue('L'), 23)
  assert.equal(mrnCharValue('U'), 32)
  assert.equal(mrnCharValue('V'), 34)
  assert.equal(mrnCharValue('Z'), 38)
  assert.equal(mrnCharValue('-'), null)
})

test('check digit matches every published HMRC example MRN', () => {
  for (const mrn of HMRC_EXAMPLES) {
    assert.equal(mrnCheckDigit(mrn.slice(0, 17)), mrn[17], mrn)
    assert.equal(decodeMrn(mrn).valid, true, mrn)
  }
})

test('a remainder of 10 is written as 0', () => {
  // 20GB32VVZI0YMFGVR0 has a remainder of 10.
  assert.equal(mrnCheckDigit('20GB32VVZI0YMFGVR'), '0')
})

test('decodes the five parts of an import MRN', () => {
  const result = decodeMrn('21GB1NEXFX6SU9C4R1', { now: new Date('2026-10-15T00:00:00Z') })
  assert.equal(result.valid, true)
  assert.deepEqual(
    [result.parts.year, result.parts.yearFull, result.parts.country, result.parts.unique, result.parts.procedure, result.parts.checkDigit],
    ['21', 2021, 'GB', '1NEXFX6SU9C4', 'R', '1'],
  )
  assert.equal(result.parts.procedureLabel, 'Import declaration only')
  assert.equal(result.parts.family, 'import')
  assert.match(result.parts.tracking, /Customs Declaration Service/)
})

test('cleans spaces, dashes and lower case before checking', () => {
  assert.equal(normaliseMrn(' 21gb-1nex fx6s.u9c4 r1 '), '21GB1NEXFX6SU9C4R1')
  assert.equal(decodeMrn('21gb 1nex fx6s u9c4 r1').valid, true)
})

test('a wrong check digit is caught and the corrected MRN suggested', () => {
  const result = decodeMrn('21GB1NEXFX6SU9C4R2')
  assert.equal(result.valid, false)
  assert.match(result.errors[0], /must be “1”/)
  assert.equal(result.suggestion, '21GB1NEXFX6SU9C4R1')
})

test('a single-character typo in the body changes the check digit', () => {
  // Swap one character of a valid MRN: the published check digit no longer fits.
  assert.equal(decodeMrn('21GB1NEXFX6SU9C5R1').valid, false)
  assert.equal(decodeMrn('12GB1NEXFX6SU9C4R1').valid, false)
})

test('length, characters, procedure letter and GMR confusion are reported', () => {
  assert.match(decodeMrn('21GB1NEXFX6SU9C4R').errors[0], /18 characters/)
  assert.match(decodeMrn('').errors[0], /Enter an MRN/)
  assert.ok(decodeMrn('GMRA000002JR').errors.some((error) => /goods movement reference/.test(error)))
  const badLetter = decodeMrn('21GB1NEXFX6SU9C4Q' + mrnCheckDigit('21GB1NEXFX6SU9C4Q'))
  assert.equal(badLetter.valid, false)
  assert.ok(badLetter.errors.some((error) => /procedure letter/.test(error)))
})

test('older MRNs without a procedure letter still validate on the check digit', () => {
  const legacy = decodeMrn('18AT320000TVWJYM68')
  assert.equal(legacy.valid, true)
  assert.equal(legacy.parts.family, 'legacy')
})

test('the procedure table has the 17 Annex B letters', () => {
  assert.deepEqual(Object.keys(MRN_PROCEDURES).join(''), 'ABCDEJKLMPRSTUVWZ')
  assert.equal(MRN_PROCEDURES.J.family, 'transit')
  assert.equal(MRN_PROCEDURES.A.label, 'Export only')
})

test('future years are flagged as a warning', () => {
  const result = decodeMrn('29GB1NEXFX6SU9C4R' + mrnCheckDigit('29GB1NEXFX6SU9C4R'), { now: new Date('2026-10-15T00:00:00Z') })
  assert.equal(result.valid, true)
  assert.match(result.warnings[0], /future/)
})

test('finds MRNs inside free text', () => {
  assert.deepEqual(findMrns('Entry 21GB1NEXFX6SU9C4R1 £412.18; and 20gbdpq8a31wx1xxr5'), ['21GB1NEXFX6SU9C4R1', '20GBDPQ8A31WX1XXR5'])
})

const withLetter = (letter, country = 'GB') => { const body = `24${country}4KX1Q3R0A1B2${letter}`; return body + mrnCheckDigit(body) }

test('MR1: a check-digit failure names lookalikes and does not claim the last digit is the typo', () => {
  const result = decodeMrn('24GB4KX1Q3R0A1B2C3')
  assert.equal(result.valid, false)
  assert.match(result.errors.join(' '), /in any of the 18\. Check lookalikes first: O\/0, I\/1, S\/5, B\/8\./)
  assert.equal(result.suggestion, '24GB4KX1Q3R0A1B2C' + mrnCheckDigit('24GB4KX1Q3R0A1B2C'))
  assert.match(MRN_NEXT_STEP, /^This MRN will fail the check\. Get the correct number from whoever raised the declaration\.$/)
})

test('"Where it is used" follows the procedure letter (C never mentions entry summary declarations)', () => {
  const exit = decodeMrn(withLetter('C'))
  assert.equal(exit.valid, true)
  assert.match(exit.parts.tracking, /exit summary/i)
  assert.doesNotMatch(exit.parts.tracking, /entry summary/i)
  assert.match(decodeMrn(withLetter('T')).parts.tracking, /entry summary/i)
  assert.doesNotMatch(decodeMrn(withLetter('T')).parts.tracking, /exit summary/i)
  assert.doesNotMatch(decodeMrn(withLetter('L')).parts.tracking, /exit summary/i)
  assert.doesNotMatch(decodeMrn(withLetter('K')).parts.tracking, /entry summary/i)
  for (const letter of Object.keys(MRN_PROCEDURES)) {
    const label = MRN_PROCEDURES[letter].label.toLowerCase()
    const text = mrnTracking('GB', MRN_PROCEDURES[letter].family, letter).toLowerCase()
    if (!label.includes('entry summary')) assert.doesNotMatch(text, /entry summary/, letter)
    if (!label.includes('exit summary')) assert.doesNotMatch(text, /exit summary/, letter)
  }
})

test('the result names the status service for the MRN', () => {
  assert.match(decodeMrn('21GB1NEXFX6SU9C4R1').parts.status, /CDS/)
  assert.match(mrnStatusService('GB', 'transit'), /NCTS/)
  assert.match(mrnStatusService('FR', 'export'), /MRN follow-up/)
})

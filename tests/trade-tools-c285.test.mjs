import test from 'node:test'
import assert from 'node:assert/strict'
import { BROKER_AUTHORITY, C285_LIMITS, C285_START, PROOF_OF_ORIGIN, claimDeadline, repaymentRoute } from '../scripts/trade-tools/c285.mjs'

const today = new Date('2026-10-15T12:00:00Z')
const base = { reason: 'overpaid', postal: 'no', who: 'importer', eori: 'yes', system: 'cds', taxes: 'both', vatRegistered: 'yes', acceptedOn: '2025-02-03' }
const ids = (outcome) => outcome.routes.map((route) => route.id)

test('GOV.UK time limits: 3 years, 1 year, 90 days', () => {
  assert.equal(C285_LIMITS.overpaid.years, 3)
  assert.equal(C285_LIMITS.rejected.years, 1)
  assert.equal(C285_LIMITS.withdrawn.days, 90)
  assert.equal(claimDeadline('overpaid', '2025-02-03').toISOString().slice(0, 10), '2028-02-03')
  assert.equal(claimDeadline('rejected', '2026-03-01').toISOString().slice(0, 10), '2027-03-01')
  assert.equal(claimDeadline('withdrawn', '2026-09-01').toISOString().slice(0, 10), '2026-11-30')
  assert.equal(claimDeadline('overpaid', 'not a date'), null)
})

test('worked example: CDS claim for duty, VAT Return for VAT-registered import VAT', () => {
  const outcome = repaymentRoute(base, { today })
  assert.deepEqual(ids(outcome), ['vat_return', 'cds'])
  assert.equal(outcome.deadline, '2028-02-03')
  assert.equal(outcome.status, 'route')
  assert.ok(outcome.checklist.includes('UK bank account details: sort code, account number and account name'))
  assert.ok(outcome.checklist.includes('The amount that should have been paid to HMRC'))
})

test('no EORI, private individuals and the waiver scheme use the C285 form', () => {
  assert.deepEqual(ids(repaymentRoute({ ...base, eori: 'no', taxes: 'duty' }, { today })), ['c285'])
  assert.deepEqual(ids(repaymentRoute({ ...base, who: 'individual', taxes: 'duty' }, { today })), ['c285'])
  assert.deepEqual(ids(repaymentRoute({ ...base, reason: 'waiver', taxes: 'duty' }, { today })), ['c285'])
})

test('import VAT without VAT registration and without an EORI goes on C285', () => {
  const outcome = repaymentRoute({ ...base, taxes: 'vat', vatRegistered: 'no', eori: 'no' }, { today })
  assert.deepEqual(ids(outcome), ['c285'])
  assert.ok(outcome.checklist.includes('The import VAT paid to HMRC'))
})

test('VAT-registered import VAT only goes to the VAT Return, never C285', () => {
  assert.deepEqual(ids(repaymentRoute({ ...base, taxes: 'vat' }, { today })), ['vat_return'])
})

test('CHIEF declarations use the CHIEF route', () => {
  assert.deepEqual(ids(repaymentRoute({ ...base, system: 'chief', taxes: 'duty' }, { today })), ['chief'])
})

test('postal imports go to BOR286 and NI at-risk goods to their own guide', () => {
  assert.deepEqual(ids(repaymentRoute({ ...base, postal: 'yes' }, { today })), ['bor286'])
  assert.deepEqual(ids(repaymentRoute({ ...base, reason: 'ni_at_risk' }, { today })), ['ni_at_risk'])
})

test('rejected imports ask for proof of entitlement and a worksheet', () => {
  const outcome = repaymentRoute({ ...base, reason: 'rejected', taxes: 'duty', acceptedOn: '2026-09-01' }, { today })
  assert.ok(outcome.checklist.some((item) => /proof of entitlement/.test(item)))
  assert.ok(outcome.checklist.some((item) => /worksheet/.test(item)))
  assert.equal(outcome.deadline, '2027-09-01')
})

test('deadline status: expired, urgent and open', () => {
  assert.equal(repaymentRoute({ ...base, acceptedOn: '2023-01-10' }, { today }).status, 'expired')
  assert.match(repaymentRoute({ ...base, acceptedOn: '2023-01-10' }, { today }).notes[0], /Check the regulations/)
  assert.equal(repaymentRoute({ ...base, acceptedOn: '2023-11-20' }, { today }).status, 'urgent')
  assert.equal(repaymentRoute({ ...base, reason: 'withdrawn', acceptedOn: '2026-08-01' }, { today }).status, 'urgent')
  assert.equal(repaymentRoute({ ...base, acceptedOn: '' }, { today }).deadline, null)
})

test('RP1: a missed preference adds proof of origin to the checklist', () => {
  const outcome = repaymentRoute({ ...base, reason: 'preference' }, { today })
  assert.ok(outcome.checklist.includes(PROOF_OF_ORIGIN))
  assert.match(PROOF_OF_ORIGIN, /valid on the day you submit the claim/)
  assert.equal(outcome.deadline, '2028-02-03')
  assert.ok(!repaymentRoute(base, { today }).checklist.includes(PROOF_OF_ORIGIN))
})

test('RP2: the result links to the official start page for the route', () => {
  assert.deepEqual(repaymentRoute(base, { today }).start, [C285_START.cds])
  assert.equal(C285_START.cds.label, 'START YOUR CLAIM IN CDS ↗')
  assert.match(C285_START.cds.url, /^https:\/\/www\.tax\.service\.gov\.uk\/claim-back-import-duty-vat\//)
  assert.deepEqual(repaymentRoute({ ...base, eori: 'no', vatRegistered: 'no' }, { today }).start, [C285_START.c285])
})

test('RP3: who claims and the broker authority line, except for private individuals', () => {
  assert.equal(repaymentRoute({ ...base, who: 'agent' }, { today }).authority, BROKER_AUTHORITY)
  assert.match(BROKER_AUTHORITY, /written instructions/)
  assert.equal(repaymentRoute({ ...base, who: 'individual' }, { today }).authority, null)
})

test('rejected imports without an EORI use the C&E1179 form (GOV.UK, 2 April 2026)', () => {
  const outcome = repaymentRoute({ ...base, reason: 'rejected', eori: 'no', taxes: 'duty' }, { today })
  assert.deepEqual(ids(outcome), ['ce1179'])
  assert.deepEqual(outcome.start, [C285_START.ce1179])
})

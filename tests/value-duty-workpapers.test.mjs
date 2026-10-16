import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateValueDutyScenario, valueDutyWorkpapers } from '../scripts/value-duty-workpapers.mjs'
import { calculators } from '../scripts/calculators.mjs'

const exampleA = { goodsAmount: 10000, fxRate: 1.1564, freight: 500, insurance: 100, additions: 0, deductions: 0, dutyRate: 4, otherImportCharges: 0, incidentalExpenses: 150, vatRate: 20 }
const round = (value) => Math.round(value * 100) / 100

test('worked example A keeps its duty and VAT figures', () => {
  const result = calculateValueDutyScenario(exampleA)
  assert.equal(round(result.customsDuty), 369.9)
  assert.equal(round(result.importVat), 1953.49)
  assert.equal(round(result.taxDutyTotal), 2323.39)
  assert.equal('landedCostPerUnit' in result, false)
})

test('optional units give duty + VAT and landed cost per unit (DV3)', () => {
  const result = calculateValueDutyScenario({ ...exampleA, units: 1200 })
  assert.equal(round(result.dutyVatPerUnit), 1.94)
  assert.equal(round(result.landedCostPerUnit), 9.77)
  assert.equal(round(result.landedCostPerUnitExVat), round((result.planningTotal - result.importVat) / 1200))
  for (const units of [0, -5, Number.NaN, 1e9]) assert.throws(() => calculateValueDutyScenario({ ...exampleA, units }))
})

test('duty calculator search-intent words (intent review §4.1)', () => {
  const [page] = valueDutyWorkpapers
  assert.equal(page.title, 'Import Duty Calculator UK: Duty, VAT and Customs Value')
  assert.ok(page.title.length <= 60)
  assert.equal(page.h1, 'Import duty and VAT calculator UK')
  assert.equal(page.subhead, 'Build the customs value, ad valorem duty and import VAT scenario.')
  assert.ok(page.description.length >= 140 && page.description.length <= 155)
  for (const question of ['Is VAT charged on the duty?', 'What is landed cost?', 'Do I pay duty on shipping costs?']) {
    assert.ok(page.questions.some((item) => item.question === question), question)
  }
})

test('cost calculator search-intent words (intent review §4.1)', () => {
  const [page] = calculators
  assert.equal(page.title, 'Customs Declaration Cost Calculator: Cost per Entry')
  assert.equal(page.h1, 'How much does a customs declaration cost? Calculate yours.')
  assert.equal(page.subhead, 'Calculate your customs desk cost per declaration.')
  assert.ok(page.description.length >= 140 && page.description.length <= 155)
  assert.ok(page.faqs.some((item) => item.question === 'Is the clearance fee separate from duty and VAT?'))
})

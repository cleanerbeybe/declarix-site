import test from 'node:test'
import assert from 'node:assert/strict'
import { Script } from 'node:vm'
import { calculatePreparationEconomics as calculate, economicsCsv, economicsFields, economicsRoute, renderPreparationEconomics } from '../scripts/preparation-economics.mjs'

const input = { cases: 100, hourlyCost: 30, months: 12, internalMinutes: 20, internalRework: 2, softwareMonthly: 100, internalSetup: 1200, providerPerCase: 10, providerMonthly: 50, providerSetup: 600, oversightMinutes: 5, providerRework: 1 }

test('both workflows include staff review, rework, fees and amortised setup', () => {
  const m = calculate(input)
  assert.equal(m.status, 'complete')
  assert.deepEqual(m.result, { cases: 100, inHouseMonthly: 1300, outsourcedMonthly: 1400, inHousePerCase: 13, outsourcedPerCase: 14, difference: 100 })
  assert.deepEqual(m.sensitivity.map(x => x.cases), [50, 100, 150])
  assert.equal(m.sensitivity[0].inHouseMonthly, 750)
})
for (const [field] of economicsFields) {
  test(`${field}: unknown never becomes zero`, () => {
    for (const value of ['', ' ', null, undefined]) {
      const m = calculate({ ...input, [field]: value })
      assert.equal(m.status, 'incomplete')
      assert.equal(m.result, null)
      assert.ok(m.errors[field])
    }
  })
  test(`${field}: rejects negative, non-finite, boolean and object values`, () => {
    for (const value of [-1, Infinity, NaN, 'oops', false, true, [], {}]) assert.equal(calculate({ ...input, [field]: value }).status, 'incomplete')
  })
}
test('explicit zero is allowed for known costs and times, not cases/months', () => {
  const zero = Object.fromEntries(economicsFields.map(([key]) => [key, key === 'cases' || key === 'months' ? 1 : 0]))
  assert.equal(calculate(zero).result.difference, 0)
  for (const key of ['cases', 'months']) for (const value of [0, 0.5, 1.5]) assert.equal(calculate({ ...input, [key]: value }).status, 'incomplete')
})
test('range boundaries are enforced and finite', () => {
  const upper = Object.fromEntries(economicsFields.map(([key, , , max]) => [key, Number(max)]))
  const m = calculate(upper)
  assert.equal(m.status, 'complete')
  assert.ok(Number.isFinite(m.result.inHouseMonthly))
  assert.ok(m.sensitivity.every(x => x.cases <= 1000000))
  for (const [key, , , max] of economicsFields) assert.equal(calculate({ ...input, [key]: Number(max) + 1 }).status, 'incomplete')
})
test('either option can cost less and equal scenarios tie', () => {
  assert.ok(calculate(input).result.difference > 0)
  assert.ok(calculate({ ...input, providerPerCase: 0 }).result.difference < 0)
  assert.equal(calculate({ ...input, providerPerCase: 9 }).result.difference, 0)
})
test('decimal inputs remain numeric and rounded only on display/export', () => {
  const m = calculate({ ...input, hourlyCost: '30.25', internalMinutes: '20.5' })
  assert.equal(m.status, 'complete')
  assert.equal(m.result.inHouseMonthly, 100 * 22.5 * 30.25 / 60 + 200)
})
test('CSV requires complete inputs and contains assumptions and formulas', () => {
  assert.throws(() => economicsCsv(calculate({})), /Complete/)
  const csv = economicsCsv(calculate(input))
  assert.match(csv, /User assumptions; not measured results/)
  assert.match(csv, /internalRework/)
  assert.match(csv, /providerSetup \/ months/)
  assert.match(csv, /"100","1300.00","1400.00","100.00"/)
})
test('one-case sensitivity is unique, bounded and never divides by zero', () => {
  const m = calculate({ ...input, cases: 1 })
  assert.deepEqual(m.sensitivity.map(x => x.cases), [1, 2])
})
test('HTML has static explanation, accessible inputs, no assumed values or input telemetry', () => {
  const html = renderPreparationEconomics({ origin: 'https://getdeclarix.com' })
  assert.equal((html.match(/<h1>/g) || []).length, 1)
  assert.ok(html.includes(`href="https://getdeclarix.com${economicsRoute.path}"`))
  assert.equal((html.match(/type="number"/g) || []).length, 12)
  assert.doesNotMatch(html, /\bvalue="|fetch\(|sendBeacon|localStorage|sessionStorage|posthog|<script[^>]+src=/)
  for (const [key] of economicsFields) assert.ok(html.includes(`for="${key}"`) && html.includes(`id="${key}-error"`))
  assert.ok(html.includes('aria-live="polite"'))
  for (const [, js] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Script(js)
})

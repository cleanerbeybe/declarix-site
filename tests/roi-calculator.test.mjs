import test from 'node:test'
import assert from 'node:assert/strict'
import { priceForVolume, packages, renderPricingTable } from '../scripts/pricing.mjs'
import { calculateRoi, CLERK_HOURS_PER_YEAR, renderRoiCalculator, roiFaqs } from '../scripts/roi-calculator.mjs'

test('approved monthly ladder and £3 floor', () => {
  assert.deepEqual(packages.map(({monthly,included,rate}) => [monthly,included,rate]), [[500,100,5],[4000,1000,4],[9000,3000,3]])
  assert.deepEqual([100,800,801,1000,2000,2250,2251,3000,3001].map(v => [priceForVolume(v).name,priceForVolume(v).total]), [
    ['Desk',500],['Team',4000],['Team',4000],['Team',4000],['Team',8000],['Scale',9000],['Scale',9000],['Scale',9000],['Quoted',9003],
  ])
  assert.equal(priceForVolume(2000).overage,1000)
  for (const volume of [1,100,800,1000,2000,3000,3001,1000000]) assert.ok(priceForVolume(volume).rate >= 3)
  assert.throws(() => priceForVolume(0), RangeError)
})

test('each pricing cell has a real accessible label beyond visual CSS', () => {
  const table = renderPricingTable()
  for (const label of ['Monthly fee:', 'Included:', 'Rate:', 'Extra packs:']) {
    assert.equal(table.split(`<span class="sr-only">${label} </span>`).length - 1, 3)
  }
})

test('capacity and revenue transform workbook throughput arithmetic without double counting', () => {
  const result = calculateRoi({volume:'800',currentMinutes:'18',withDeclarixMinutes:'6',clientFee:'40',captureRate:'20'})
  assert.equal(result.hours,160)
  assert.equal(result.extraPacks,1600)
  assert.equal(result.annualCapturedRevenue,153600)
  assert.equal(result.packageFit.total,4000)
  assert.equal(calculateRoi({volume:'2000',currentMinutes:'24',withDeclarixMinutes:'8',clientFee:'',captureRate:''}).packageFit.total,8000)
})

test('no missing or invalid values produce a misleading result', () => {
  const base={volume:'100',currentMinutes:'24',withDeclarixMinutes:'8',clientFee:'',captureRate:''}
  for (const override of [{volume:''},{volume:'0'},{volume:'2.5'},{currentMinutes:''},{currentMinutes:'NaN'},{withDeclarixMinutes:'0'},{withDeclarixMinutes:'25'},{clientFee:'40'},{captureRate:'120',clientFee:'40'}]) {
    assert.throws(() => calculateRoi({...base,...override}), RangeError)
  }
})

test('loaded clerk cost gives the net monthly saving after the published plan fee (DE3)', () => {
  const base = { volume: '1100', currentMinutes: '22', withDeclarixMinutes: '9', clientFee: '', captureRate: '' }
  assert.equal(calculateRoi(base).netMonthlySaving, null)
  const result = calculateRoi({ ...base, loadedCost: '38000' })
  assert.equal(result.packageFit.name, 'Team')
  assert.equal(result.packageFit.total, 4400)
  assert.equal(Math.round(result.releasedLabourValue), 5205)
  assert.equal(Math.round(result.netMonthlySaving), 805)
  assert.equal(CLERK_HOURS_PER_YEAR, 1740)
  assert.equal(calculateRoi({ ...base, volume: '3500', loadedCost: '38000' }).packageFit.name, 'Quoted')
  for (const loadedCost of ['0', '-1', 'abc', '20000000']) assert.throws(() => calculateRoi({ ...base, loadedCost }), RangeError)
})

test('ROI page carries the formula section, three FAQs and the cost calculator link', () => {
  const html = renderRoiCalculator({ origin: 'https://example.test', company: 'Declarix Limited', companyNumber: '1', contact: 'x@example.test' }, { navHtml: '' })
  assert.ok(html.includes('How the capacity case is worked out'))
  assert.equal(roiFaqs.length, 3)
  assert.equal(html.split('class="roi-faq-item"').length - 1, 3)
  assert.ok(html.includes('href="/tools/customs-declaration-cost-calculator/"'))
  assert.ok(html.includes('Loaded cost per clerk (£/year)'))
  assert.ok(!html.includes('undefined'))
})

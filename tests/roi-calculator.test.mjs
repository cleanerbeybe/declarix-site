import test from 'node:test'
import assert from 'node:assert/strict'
import { priceForVolume, packages } from '../scripts/pricing.mjs'
import { calculateRoi } from '../scripts/roi-calculator.mjs'

test('approved monthly ladder and £3 floor', () => {
  assert.deepEqual(packages.map(({monthly,included,rate}) => [monthly,included,rate]), [[500,100,5],[4000,1000,4],[9000,3000,3]])
  assert.deepEqual([100,800,801,1000,2000,2250,2251,3000,3001].map(v => [priceForVolume(v).name,priceForVolume(v).total]), [
    ['Desk',500],['Team',4000],['Team',4000],['Team',4000],['Team',8000],['Scale',9000],['Scale',9000],['Scale',9000],['Quoted',9003],
  ])
  assert.equal(priceForVolume(2000).overage,1000)
  for (const volume of [1,100,800,1000,2000,3000,3001,1000000]) assert.ok(priceForVolume(volume).rate >= 3)
  assert.throws(() => priceForVolume(0), RangeError)
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

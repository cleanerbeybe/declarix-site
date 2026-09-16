import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { comparisons, vendors, sources, validateComparisons, renderVendorComparison } from '../scripts/vendor-comparisons.mjs'
import { site } from '../scripts/routes.mjs'

test('three distinct route decisions pass validation', () => {
  assert.equal(validateComparisons(), true)
  assert.deepEqual(comparisons.map(r => r.id), ['P13','P15','P27'])
  for (const field of ['summary','scenario','scenarioTitle','choiceTitle','lead','description']) assert.equal(new Set(comparisons.map(r => r[field])).size, 3)
})
test('snapshot matches executable route and evidence data', () => {
  const saved = JSON.parse(readFileSync(new URL('../contracts/comparisons/vendor-comparisons-2026-09-16.json', import.meta.url)))
  assert.deepEqual(saved.routes, comparisons); assert.deepEqual(saved.vendors, vendors); assert.deepEqual(saved.sources, sources)
})
test('route collision, duplicate vendors and missing content fail closed', () => {
  for (const mutate of [r => r[1].path = r[0].path, r => r[1].title = r[0].title, r => r[0].pair = ['declarix','declarix'], r => r[0].pair = ['absent','icustoms'], r => delete r[0].summary, r => r[0].steps = []]) {
    const copy = structuredClone(comparisons); mutate(copy); assert.throws(() => validateComparisons(copy))
  }
})
test('every evidence field is required', () => {
  for (const field of ['product','module','country','sourceUrl','reviewedOn','evidenceType','reviewer','status','text']) {
    const copy = structuredClone(vendors); delete copy.flytta.cells.handoff[field]; assert.throws(() => validateComparisons(comparisons, copy))
  }
})
test('invalid source, type or evidence status rejected', () => {
  for (const mutate of [v => v.flytta.cells.intake.source = 'absent', v => v.flytta.cells.intake.sourceUrl = 'https://example.com', v => v.flytta.cells.intake.evidenceType = 'independent acceptance', v => v.flytta.cells.intake.status = 'guaranteed']) {
    const copy = structuredClone(vendors); mutate(copy); assert.throws(() => validateComparisons(comparisons, copy))
  }
})
test('vendor pair cannot silently become a Declarix-first comparison', () => {
  const copy = structuredClone(comparisons); copy[2].pair = ['declarix','icustoms']; assert.throws(() => validateComparisons(copy))
})
test('iDP exports are recognised without claiming named acceptance', () => {
  const text = vendors.icustoms.cells.handoff.text
  assert.match(text, /CSV, Excel, XML/); assert.match(text, /not verified/)
  assert.equal(vendors.icustoms.cells.intake.source, 'idp')
})
test('Sedna named handoff is bounded to the customer case', () => {
  assert.match(vendors.flytta.cells.handoff.text, /at Casper/)
  assert.equal(vendors.flytta.cells.handoff.source, 'casper')
  assert.match(vendors.flytta.cells.handoff.text, /not a universal connector guarantee/)
})
for (const route of comparisons) {
  const html = renderVendorComparison(site, route)
  test(route.id+' metadata, dimensions and scope', () => {
    assert.equal((html.match(/<h1>/g)||[]).length, 1)
    assert.equal((html.match(/rel="canonical"/g)||[]).length, 1)
    assert.ok(html.includes(site.origin+route.path))
    assert.ok(route.description.length >= 80 && route.description.length <= 180)
    assert.equal((html.match(/<th scope="row">/g)||[]).length, 9)
    for (const text of ['review-only and incomplete','does not submit directly to HMRC','not a released customer portal','not an accepted named connector','not an independent product test','16 December 2026']) assert.ok(html.includes(text), text)
  })
  test(route.id+' no executable script, data intake, price or results claim', () => {
    assert.equal((html.match(/<script/g)||[]).length, 1)
    assert.ok(!/<form|<input|<textarea|localStorage|posthog|fetch\(/i.test(html))
    assert.ok(!/£\d|€\d|\$\d|99%|80%|6,000|3×/.test(html))
    const schema = JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/s)[1])
    assert.equal(schema['@type'], 'WebPage'); assert.ok(!/AggregateRating|Review|offers|priceCurrency/.test(JSON.stringify(schema)))
    assert.ok(html.includes('Do not attach live customer documents'))
    assert.ok(html.includes('mailto:'+site.contact))
  })
  test(route.id+' escaped content and correct source attribution', () => {
    assert.ok(renderVendorComparison(site, {...route,summary:'<script>"&'}).includes('&lt;script&gt;&quot;&amp;'))
    assert.ok(renderVendorComparison(site,route,{webmasterHtml:'<meta name="test" content="tag">'}).includes('content="tag"'))
    for (const id of route.pair) for (const c of Object.values(vendors[id].cells)) assert.ok(html.includes(c.sourceUrl))
  })
}
test('P27 names both vendors before the Declarix third path', () => {
  const html = renderVendorComparison(site, comparisons[2]); const body = html.slice(html.indexOf('id="main"'))
  assert.ok(body.indexOf('iCustoms') < body.indexOf('id="third-path"'))
  assert.ok(body.indexOf('Customaite') < body.indexOf('id="third-path"'))
  assert.ok(!body.slice(body.indexOf('<thead>'), body.indexOf('</thead>')).includes('Declarix'))
})
test('P15 recognises the present identity and does not copy vendor outcomes', () => {
  const html = renderVendorComparison(site, comparisons[1])
  assert.ok(html.includes('Flytta is now part of the Sedna decision'))
  assert.ok(html.includes('Sedna and Flytta are not separate alternatives'))
  assert.ok(html.includes('not yours'))
})

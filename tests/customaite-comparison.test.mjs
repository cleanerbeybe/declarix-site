import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { comparisonRoute, products, dimensions, sources, validateComparison, renderComparison } from '../scripts/customaite-comparison.mjs'
import { site } from '../scripts/routes.mjs'
const html = renderComparison(site)
test('45 scoped cells pass the evidence contract',()=>{assert.equal(validateComparison(),true);assert.equal(products.length*dimensions.length,45)})
test('four alternatives excluding focal vendor, one owner per option',()=>{assert.deepEqual(products.filter(p=>p.id!=='customaite').map(p=>p.id),['declarix','icustoms','asm','descartes']);assert.equal((html.match(/class="option"/g)||[]).length,4)})
test('each missing evidence field fails closed',()=>{for(const key of ['product','module','country','sourceUrl','reviewedOn','evidenceType','reviewer','status','text']){const copy=structuredClone(products);delete copy[0].cells.filing[key];assert.throws(()=>validateComparison(copy))}})
test('missing dimension, invalid source and invalid status fail',()=>{for(const mutate of [p=>delete p[0].cells.filing,p=>p[0].cells.filing.source='unknown',p=>p[0].cells.filing.status='assumed']){const copy=structuredClone(products);mutate(copy);assert.throws(()=>validateComparison(copy))}})
test('source ledger matches runtime comparison data',()=>{const c=JSON.parse(readFileSync(new URL('../contracts/comparisons/customaite-2026-09-16.json',import.meta.url)));assert.deepEqual(c.products,products);assert.deepEqual(c.sources,sources);assert.deepEqual(c.dimensions,dimensions)})
test('one canonical and one H1, no alternatives canonical',()=>{assert.equal((html.match(/<h1>/g)||[]).length,1);assert.equal((html.match(/rel="canonical"/g)||[]).length,1);assert.ok(html.includes(site.origin+comparisonRoute.path));assert.ok(!html.includes('/alternatives/customaite/'))})
test('current readiness and customer-release boundaries are visible',()=>{for(const s of ['review-only and incomplete','does not submit directly to HMRC','Customer self-service is not released','Generic controlled pack','not a complete customs lawbook'])assert.ok(html.includes(s),s)})
test('no rating, pricing, review or benchmark schema',()=>{const schema=JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(schema['@type'],'WebPage');assert.ok(!/AggregateRating|Review|offers|priceCurrency/.test(JSON.stringify(schema)));assert.ok(!/£\d|€\d|\$\d|99%|3×|200 seconds/.test(html))})
test('vendor facts link back and retain dated attribution',()=>{for(const s of Object.values(sources))assert.ok(html.includes(s.url));assert.ok(html.includes('Published by Declarix'));assert.ok(html.includes('not an independent product test'));assert.ok(html.includes('16 December 2026'))})
test('no form, tracking or executable route script',()=>{assert.ok(!/<form|<input|<textarea|localStorage|posthog|fetch\(/i.test(html));assert.equal((html.match(/<script/g)||[]).length,1)})
test('CTA uses correct mailbox and protects document intake',()=>{assert.ok(html.includes('mailto:'+site.contact));assert.ok(html.includes('Do not attach live customer documents'))})
test('verification tags passed through by static generator',()=>{assert.ok(renderComparison(site,{webmasterHtml:'<meta name="google-site-verification" content="test">'}).includes('content="test"'))})
test('meta description length and meaningful route',()=>{assert.ok(comparisonRoute.description.length>=80&&comparisonRoute.description.length<=180);assert.equal(comparisonRoute.path,'/compare/declarix-vs-customaite/')})
test('HTML escaping protects metadata',()=>{assert.ok(renderComparison({...site,contact:'x"<x>@example.test'}).includes('x&quot;&lt;x&gt;@example.test'))})

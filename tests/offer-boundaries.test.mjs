import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { routes } from '../scripts/routes.mjs'
import { scopeBoundary, scopeCta } from '../scripts/product-scope.mjs'
import { offerContract as contract, validateOfferBoundaries, validateOfferHtml } from '../scripts/offer-boundaries.mjs'
const read = path => readFileSync(new URL('../' + path, import.meta.url))
const hash = text => createHash('sha256').update(text).digest('hex')
const byPath = (copy,path) => copy.find(r=>r.path===path)

test('four offer pages retain draft-only route-specific scope and safe CTA',()=>{
  assert.deepEqual(contract.reviewed_paths,['/security/','/pricing/','/pricing-policy/','/pilot/'])
  assert.equal(validateOfferBoundaries(routes),true)
})
for(const path of contract.reviewed_paths){
  test(path+' cannot borrow missing limitations from another route',()=>{
    for(const phrase of contract.required_per_route){const copy=structuredClone(routes);const r=byPath(copy,path);r.limitations=r.limitations.replace(phrase,'');assert.throws(()=>validateOfferBoundaries(copy),/boundary missing/)}
  })
  test(path+' cannot regain fixed result claims or lose its safe enquiry',()=>{
    for(const phrase of contract.prohibited_result_claims){const copy=structuredClone(routes);byPath(copy,path).standfirst+=' '+phrase;assert.throws(()=>validateOfferBoundaries(copy),/Unsupported offer result/)}
    const copy=structuredClone(routes);delete byPath(copy,path).cta;assert.throws(()=>validateOfferBoundaries(copy),/Safe enquiry/)
  })
  test(path+' rendered limitation must be beside the hero, not elsewhere in the document',()=>{
    const html=`<header class="hero"><h1>Preparation</h1></header><p class="limitations scope-boundary">${scopeBoundary}</p><p>${scopeCta.copy}</p><a href="/compare/automation-vs-outsourcing/">Model</a>`
    assert.equal(validateOfferHtml(html,path),true)
    assert.throws(()=>validateOfferHtml(html.replace(scopeBoundary,'')+scopeBoundary,path),/boundary missing/)
    assert.throws(()=>validateOfferHtml(html.replace('limitations scope-boundary','hidden'),path),/boundary missing/)
  })
}
test('nine unrelated route objects and six booking/visual source files are unchanged',()=>{
  assert.equal(contract.preserved_routes.length,9)
  for(const r of contract.preserved_routes)assert.equal(hash(JSON.stringify(byPath(routes,r.path))),r.sha256,r.path)
  for(const f of contract.preserved_source_files)assert.equal(hash(read(f.path)),f.sha256,f.path)
})
test('security promises and pricing-policy commercial provisions remain unchanged',()=>{
  const security=byPath(routes,'/security/')
  for(const [key,value] of Object.entries(contract.preserved_security_fields))assert.deepEqual(security[key],value,key)
  assert.deepEqual(byPath(routes,'/pricing-policy/').sections.slice(0,3),contract.preserved_pricing_policy_sections)
})
test('pilot commercial term removal and economics link removal fail closed',()=>{
  for(const term of contract.preserved_commercial_strings){const copy=JSON.parse(JSON.stringify(routes).replaceAll(term,''));assert.throws(()=>validateOfferBoundaries(copy))}
  const copy=structuredClone(routes);byPath(copy,'/pricing/').sections.forEach(s=>delete s.links);assert.throws(()=>validateOfferBoundaries(copy),/economics link/)
})

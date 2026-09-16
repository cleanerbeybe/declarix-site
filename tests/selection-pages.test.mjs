import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { selectionRoutes, validateSelectionPages } from '../scripts/selection-pages.mjs'
import { routes, site } from '../scripts/routes.mjs'
import { scopeBoundary } from '../scripts/product-scope.mjs'
import { discoveryEntry } from '../scripts/discovery-entry.mjs'
const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8')

test('selection contract is integrated once per existing path',()=>{
  assert.equal(validateSelectionPages(),true)
  for(const route of selectionRoutes) assert.deepEqual(routes.filter(r=>r.path===route.path),[route])
})
test('draft snapshot matches executable routes and does not approve publication',()=>{
  const saved=JSON.parse(read('contracts/selection-pages-draft-2026-09-16.json'))
  assert.equal(saved.status,'draft_only_not_publication_approval'); assert.deepEqual(saved.routes,selectionRoutes)
})
test('missing or duplicate selection routes fail closed',()=>{
  assert.throws(()=>validateSelectionPages([]));assert.throws(()=>validateSelectionPages([selectionRoutes[0],selectionRoutes[0],selectionRoutes[2]]))
})
test('required fields cannot disappear',()=>{
  for(const key of ['title','description','h1','standfirst','stamp','limitations','reviewedOn','claimContract','ogImage','cta','sections']){
    const copy=structuredClone(selectionRoutes);delete copy[0][key];assert.throws(()=>validateSelectionPages(copy),key)
  }
})
test('unsupported readiness, connector and numerical claims fail closed',()=>{
  for(const phrase of ['CDS-ready','3×','3x','three times more','200 seconds','£500','every field','every proposed field','every proposed value','no new headcount','more margin','supported export','supports Sequoia','ready for Sequoia']){
    for(const field of ['title','description','standfirst']){const copy=structuredClone(selectionRoutes);copy[0][field]+=' '+phrase;assert.throws(()=>validateSelectionPages(copy),phrase+' '+field)}
  }
})
test('scope, approval and safe enquiry boundaries cannot disappear',()=>{
  for(const phrase of ['current-snapshot','approval gates','review-only','incomplete','does not submit directly to HMRC','not an accepted named connector','Do not attach live customer documents']){
    const copy=JSON.parse(JSON.stringify(selectionRoutes).replaceAll(phrase,''));assert.throws(()=>validateSelectionPages(copy),phrase)
  }
})
test('dates, draft identity and image stay current',()=>{
  for(const [key,value] of [['reviewedOn','2026-07-17'],['claimContract','legacy'],['ogImage','/og.jpg']]){const copy=structuredClone(selectionRoutes);copy[1][key]=value;assert.throws(()=>validateSelectionPages(copy))}
})
test('three routes serve distinct buyer decisions and surface a material scope limit',()=>{
  assert.equal(new Set(selectionRoutes.map(r=>r.h1)).size,3)
  assert.match(JSON.stringify(selectionRoutes[0]),/PRODUCT PURPOSE/)
  assert.match(JSON.stringify(selectionRoutes[1]),/Preparation is not submission/)
  assert.match(JSON.stringify(selectionRoutes[2]),/Name the owner of each step/)
  for(const r of selectionRoutes){assert.equal(r.limitations,scopeBoundary);assert.ok(r.sections.length>=4)}
})
test('empty content and bad source records fail closed',()=>{
  const copy=structuredClone(selectionRoutes);copy[0].sections=[];assert.throws(()=>validateSelectionPages(copy))
  for(const key of ['title','publisher','url','checked']){const copy=structuredClone(selectionRoutes);copy[1].sources[0][key]='';assert.throws(()=>validateSelectionPages(copy),key)}
})
test('selection discovery uses current titles and descriptions',()=>{
  const reviewed=new Set(selectionRoutes.map(r=>r.path))
  for(const r of selectionRoutes)assert.equal(discoveryEntry(r,site.origin,reviewed),`- [${r.title}](${site.origin}${r.path}): ${r.description}`)
  assert.match(read('scripts/generate-static-routes.mjs'),/\.\.\.productScopeRoutes, \.\.\.selectionRoutes,/)
})
test('commercial homepage terms and lazy booking behavior remain unchanged',()=>{
  const app=read('src/App.tsx');assert.match(app,/CAPPED AT £500/i);assert.match(app,/WITHIN ONE WORKING DAY/);assert.match(app,/if \(!revealed \|\| !configured\) return/);assert.match(app,/setRevealed\(true\)/)
})

test('all ten non-selection route definitions retain their baseline copy', async()=>{
  const {createHash}=await import('node:crypto')
  const snapshot=JSON.parse(read('contracts/selection-preserved-routes.json'))
  assert.equal(snapshot.routes.length,10)
  for(const item of snapshot.routes){const route=routes.find(r=>r.path===item.path);assert.ok(route);assert.equal(createHash('sha256').update(JSON.stringify(route)).digest('hex'),item.sha256,item.path)}
})

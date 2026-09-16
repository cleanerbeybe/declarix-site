import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { authorityRoutes, authorityAssets, renderAuthorityRoute } from '../scripts/authority-library.mjs'
import { routes, site } from '../scripts/routes.mjs'
import { radarRoutes } from '../scripts/radar.mjs'
import { reports } from '../scripts/reports.mjs'
import { isWorkpaper, workpaperNotice, wrapWorkpaperText } from '../scripts/workpaper-context.mjs'
import { validateWorkpaperHtml } from '../scripts/workpaper-validation.mjs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex')
const contract=JSON.parse(read('contracts/workpapers-draft-2026-09-16.json')),old=JSON.parse(read('contracts/research-lineage-draft-2026-09-16.json')),papers=authorityRoutes.filter(isWorkpaper)
const render=r=>renderAuthorityRoute(r,site,{navHtml:'',webmasterHtml:'',posthogKey:''})
test('eleven explicit preservation successors; historical baseline kept and all other routes unchanged',()=>{
 assert.equal(papers.length,11);assert.deepEqual(contract.supersedes_preservation_paths,papers.map(r=>r.path))
 for(const row of contract.prior_route_hashes)assert.equal(row.sha256,old.preserved_routes.find(r=>r.path===row.path).sha256)
 for(const row of contract.preserved_routes)assert.equal(hash(JSON.stringify([...routes,...radarRoutes,...reports,...authorityRoutes].find(r=>r.path===row.path))),row.sha256,row.path)
 assert.equal(contract.assets.length,11)
 assert.match(contract.migration,/1200x630 to1200x1200/)
})
for(const r of papers) {
 test(r.slug+' portable sources, scope and dates',()=>{
  const [a]=authorityAssets(r);assert.equal(a.href,contract.assets.find(x=>x.href===a.href).href)
  assert.ok(a.content.includes('viewBox="0 0 1200 1200"'));assert.ok(a.content.includes('aria-labelledby="title desc"'))
  const plain=a.content.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')
  for(const word of ['17 July 2026','16 September 2026','not a full regulatory review','current official instructions'])assert.ok(plain.includes(word),word)
  for(const src of r.sources){assert.ok(a.content.includes('href="'+src.url+'"'));assert.ok(plain.includes(src.checked))}
  assert.ok(!a.content.includes('<script'));assert.ok(!a.content.includes('<foreignObject'))
  if(r.kind==='incoterm-term'){assert.ok(plain.includes('not an ICC rulebook'));assert.ok(plain.includes('trademark of ICC'))}
  assert.equal(validateWorkpaperHtml(render(r),r),true)
 })
 test(r.slug+' context/style/edition mutation rejected',()=>{
  const html=render(r)
  for(const [a,b] of [[workpaperNotice,''],['href="/workpapers.css"',''],['EDITION<br/>2026-09-16','REVIEWED<br/>2026-09-16'],['not a complete source re-review','fully current']]){assert.notEqual(html.replace(a,b),html);assert.throws(()=>validateWorkpaperHtml(html.replace(a,b),r),/Workpaper/)}
 })
}
test('GMR selects route references, excludes associated imports on common transit and keeps ENS duty separate',()=>{
 const r=papers.find(r=>r.code==='GMR / GVMS');assert.match(r.steps[1][2],/do not add associated import/);assert.match(r.correction,/ENS reference is optional/);assert.match(r.correction,/ENS duty is separate/);assert.ok(!r.inputs.includes('All declaration and transit references'))
})
test('ENS NI origin scope and waivers, carrier responsibility retained',()=>{const r=papers.find(r=>r.code==='ENS / ICS2');assert.match(r.direct,/countries outside the EU/);assert.match(r.direct,/waivers/);assert.match(r.correction,/carrier remains responsible/)})
test('transit arrival is not discharge and source exists',()=>{const r=papers.find(r=>r.code==='T1 / NCTS');assert.match(r.steps[4][2],/separate discharge notification/);assert.match(r.correction,/not itself discharge/);assert.ok(r.sources.some(s=>s.url.includes('february-2026-monitoring')));assert.ok(!r.stop.some(s=>s.includes('Destination has not discharged')))})
test('long links wrap visibly without changing href and no clock-based date',()=>{const url=papers.at(-1).sources[1].url;assert.equal(wrapWorkpaperText(url).join(''),url);assert.ok(!read('scripts/workpaper-context.mjs').includes('new Date'))})

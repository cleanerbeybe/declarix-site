import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { reports, aggregateCsv, pressChartSvg, renderReport } from '../scripts/reports.mjs'
import { authorityRoutes, authorityAssets, renderAuthorityRoute } from '../scripts/authority-library.mjs'
import { routes, site } from '../scripts/routes.mjs'
import { radarRoutes } from '../scripts/radar.mjs'
import { lineage, burdenMetrics } from '../scripts/research-lineage.mjs'
import { validateResearchHtml } from '../scripts/research-validation.mjs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'), hash=x=>createHash('sha256').update(x).digest('hex')
const contract=JSON.parse(read('contracts/research-lineage-draft-2026-09-16.json')), original=reports[0],burden=authorityRoutes.find(x=>x.kind==='burden-report'), evidence=JSON.parse(read('docs/research-lineage/aggregate-evidence.json')), hmrc=JSON.parse(read('docs/research-lineage/hmrc-evidence.json'))
const options={navHtml:'',webmasterHtml:'',posthogKey:''}
const csvRows=text=>text.trimEnd().split('\n').map(line=>{const cells=[];let cell='',quoted=false;for(let i=0;i<line.length;i++){if(line[i]==='"'){if(quoted&&line[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(line[i]===','&&!quoted){cells.push(cell);cell=''}else cell+=line[i]}assert.equal(quoted,false);cells.push(cell);return cells})
test('unrelated route records and source files unchanged',()=>{
 for(const row of contract.preserved_routes)assert.equal(hash(JSON.stringify([...routes,...radarRoutes,...authorityRoutes].find(x=>x.path===row.path))),row.sha256,row.path)
 for(const row of contract.preserved_source_files)assert.equal(createHash('sha256').update(readFileSync(new URL('../'+row.path,import.meta.url))).digest('hex'),row.sha256,row.path)
})
test('private-ledger aggregate reconciliation, thresholds and denominators preserved',()=>{
 for(const[k,v]of Object.entries(contract.aggregate_values))assert.equal(original[k],v)
 assert.equal(original.totalDecisions,evidence.ledger_rows);assert.equal(original.qualifiedTotal,evidence.qualified_prospects);assert.equal(original.cmsPreservationCount,evidence.cms_preservation_rubric_count)
 assert.deepEqual(Object.fromEntries(original.tiers.map(x=>[x.id,x.count])),evidence.tiers)
 assert.deepEqual(Object.fromEntries(original.ledger.map(x=>[x.id,x.count])),evidence.ledger_status_counts)
 assert.deepEqual(Object.fromEntries(original.websiteDiscovery.map(x=>[x.id,x.count])),evidence.recomputed_website_term_categories)
 assert.equal(original.tiers.reduce((n,x)=>n+x.count,0),402);assert.equal(original.ledger.reduce((n,x)=>n+x.count,0),1203);assert.equal(original.websiteDiscovery.reduce((n,x)=>n+x.count,0),854)
})
test('original CSV every row has its own denominator, period, method and reuse context',()=>{
 const [header,...rows]=csvRows(aggregateCsv(original));assert.equal(rows.length,11)
 for(const row of rows){assert.equal(row.length,header.length);const r=Object.fromEntries(header.map((k,i)=>[k,row[i]]));assert.equal(r.source_url,lineage.originalUrl);assert.equal(r.method,lineage.originalMethod);assert.equal(r.reuse_notice,lineage.originalNotice);assert.equal(r.snapshot_date,'2026-07-15');assert.equal(r.schema_version,'2.0');assert.equal(r.denominator,r.group==='coverage_ledger'?'1203':r.group==='website_discovery'?'854':'402');assert.equal(r.percent,(100*Number(r.count)/Number(r.denominator)).toFixed(1))}
 assert.doesNotMatch(aggregateCsv(original),/company_name|candidate_id|email_address|phone_number|@/i)
 const urls=aggregateCsv(original).match(/https?:[^"\s]+/g);assert.ok(urls.every(x=>x===lineage.originalUrl))
})
test('HMRC source, periods, question bases and approximate / upper-bound meanings',()=>{
 assert.equal(lineage.hmrcFullUrl,hmrc.full_report_url);assert.equal(lineage.hmrcUrl,hmrc.source_url)
 const [header,...rows]=csvRows(authorityAssets(burden)[0].content);assert.equal(rows.length,7)
 for(const row of rows){assert.equal(row.length,header.length);const r=Object.fromEntries(header.map((k,i)=>[k,row[i]]));assert.equal(r.schema_version,'2.0');assert.equal(r.source_url,hmrc.source_url);assert.equal(r.fieldwork_from,hmrc.fieldwork_from);assert.equal(r.fieldwork_to,hmrc.fieldwork_to);assert.equal(r.published_on,hmrc.publication_on);assert.equal(r.method,lineage.hmrcMethod);assert.equal(r.reuse_notice,lineage.hmrcNotice)}
 const find=id=>burdenMetrics.find(x=>x[0]===id)
 assert.deepEqual(find('typical_process_time').slice(2,4),[19,28]);assert.deepEqual(find('internal_cost').slice(2,4),[5,7]);assert.match(find('automation_data_entry')[5],/approximate/);assert.equal(find('no_change_needed')[2],'');assert.equal(find('no_change_needed')[3],20)
 for(const[id,key]of [['typical_process_time','active_time_and_bases'],['internal_cost','internal_cost_and_bases'],['automation_data_entry','automation_and_bases']])for(const n of find(id)[6].split(': ')[1].match(/\d+/g))assert.ok(hmrc.excerpts[key].includes(n),id+' base '+n)
 assert.match(hmrc.excerpts.raw_bases,/94/);assert.match(hmrc.excerpts.raw_bases,/366/);assert.match(hmrc.excerpts.typical_and_weighted,/without major issues/);assert.match(hmrc.excerpts.internal_cost_and_bases,/top and bottom 5%/)
})
for(const route of [original,burden]){
 const html=route===original?renderReport(route,site,options):renderAuthorityRoute(route,site,options)
 test(route.path+' HTML/metadata/schema contains accurate context',()=>assert.ok(validateResearchHtml(html,route)))
 for(const [name,change]of [['method missing',s=>s.replaceAll(route===original?lineage.originalMethod:lineage.hmrcMethod,'unqualified method')],['notice missing',s=>s.replaceAll(route===original?lineage.originalNotice:lineage.hmrcNotice,'')],['wrong period',s=>s.replaceAll(route===original?'2026-07-15':'2024-10-21/2025-01-17','2026-09-16')],['human review invented',s=>s.replace('</main>','<p>directed human review</p></main>')],['style missing',s=>s.replaceAll('/research-lineage.css','/nothing.css')]])test(route.path+' rejects '+name,()=>assert.throws(()=>validateResearchHtml(change(html),route),/Research lineage/))
}
test('both SVGs carry visible sources, dates, methods, qualifiers and scaled geometry',()=>{
 for(const [svg,url,phrases]of [[pressChartSvg(original),lineage.originalUrl,['15 July 2026','Agent-assisted','not verified human qualification','not market size','402','309','489','3 aliases','50','73','279','65/100']],[authorityAssets(burden)[1].content,lineage.hmrcUrl,['21 October 2024','17 January 2025','26 FEBRUARY 2026','trimmed means','not broker fees','Not elapsed clearance time','weighted shares','Question bases vary','≈70%','366','94']]]){
 const visible=svg.replace(/<title[^>]*>.*?<\/title>|<desc[^>]*>.*?<\/desc>/g,'');for(const p of phrases)assert.ok(visible.toLowerCase().includes(p.toLowerCase()),p);assert.ok(visible.includes(url));assert.match(svg,/viewBox="0 0 1200 900"/);assert.match(svg,/aria-labelledby="title desc"/)
 }
})

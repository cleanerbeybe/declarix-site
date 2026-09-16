import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { radarRecords, radarHub, radarRoutes, radarJson, radarCsv, renderRadarHub, renderRadarRecord } from '../scripts/radar.mjs'
import { freshnessState, radarNotice } from '../scripts/radar-freshness.mjs'
import { validateRadarHtml, validateRadarJson, validateRadarCsv } from '../scripts/radar-validation.mjs'
import { routes, site } from '../scripts/routes.mjs'
const read = p => readFileSync(new URL('../' + p, import.meta.url))
const hash = x => createHash('sha256').update(x).digest('hex')
const contract = JSON.parse(read('contracts/radar-archive-draft-2026-09-16.json'))
const source = JSON.parse(read('docs/radar/july-source-records.json'))
const options = { navHtml:'<a href="/">HOME</a>', posthogKey:'', posthogHost:'' }
const htmls = [renderRadarHub(site, options), ...radarRecords.map(r => renderRadarRecord(r,site,options))]
const when = value => new Date(value)
const assess = (r,time) => freshnessState(r,when(time))
for (const r of radarRecords) test(r.id + ': recorded observation, fresh-until and expiry boundaries', () => {
  const observation = Date.parse(r.observedAt), fresh = Date.parse(r.freshUntil)
  assert.equal(assess(r,observation-1),'before_observation')
  assert.equal(assess(r,observation),'within_recorded_window')
  assert.equal(assess(r,observation+1),'within_recorded_window')
  assert.equal(assess(r,fresh-1),'within_recorded_window')
  assert.equal(assess(r,fresh),r.expiresAt === r.freshUntil ? 'expired':'stale')
  assert.equal(assess(r,fresh+1),r.expiresAt === r.freshUntil ? 'expired':'stale')
  assert.equal(assess(r,'2026-09-16T14:00:00Z'),r.expiresAt ? 'expired':'stale')
})
test('future effective and expiry boundaries use explicit exclusive upper bounds', () => {
  const r = {...radarRecords[0],effectiveFrom:'2026-07-18T10:00:00Z',freshUntil:'2026-07-19T10:00:00Z',expiresAt:'2026-07-20T10:00:00Z'}
  assert.equal(assess(r,Date.parse(r.effectiveFrom)-1),'not_yet_effective')
  assert.equal(assess(r,r.effectiveFrom),'within_recorded_window')
  assert.equal(assess(r,Date.parse(r.effectiveFrom)+1),'within_recorded_window')
  assert.equal(assess(r,Date.parse(r.expiresAt)-1),'stale')
  assert.equal(assess(r,r.expiresAt),'expired')
  assert.equal(assess(r,Date.parse(r.expiresAt)+1),'expired')
})
test('missing clock, invalid/normalized dates and inconsistent windows fail closed', () => {
  const r = radarRecords[0]
  for (const at of [undefined,null,'2026-07-17',new Date(NaN),Infinity]) assert.equal(freshnessState(r,at),'unknown')
  for (const key of ['observedAt','freshUntil','effectiveFrom','expiresAt']) for (const invalid of ['bad','','2026-02-30T12:00:00Z','2026-99-01T12:00:00Z',42]) assert.equal(assess({...r,[key]:invalid},r.observedAt),'unknown',key+' '+invalid)
  for (const patch of [{observedAt:null},{freshUntil:null},{freshUntil:'2026-07-16T10:00:00Z'},{expiresAt:'2026-07-16T10:00:00Z'},{effectiveFrom:'2026-07-19T10:00:00Z'}]) assert.equal(assess({...r,...patch},r.observedAt),'unknown')
})
test('epoch-zero timestamps do not get treated as absent', () => {
  const r = {observedAt:'1970-01-01T00:00:00Z',freshUntil:'1970-01-02T00:00:00Z',effectiveFrom:'1970-01-01T00:00:00Z',expiresAt:null}
  assert.equal(assess(r,0),'within_recorded_window'); assert.equal(assess(r,-1),'before_observation'); assert.equal(assess({...r,expiresAt:r.observedAt},0),'expired')
})
test('source observations/history and unrelated routes/assets remain unchanged', () => {
  assert.equal(hash(read('docs/radar/july-source-records.json')),contract.source_snapshot_sha256)
  assert.equal(source.length,5)
  radarRecords.forEach((r,i) => { for (const key of ['id','path','type','title','summary','whyItMatters','topics','impacts','source','history','correction','review','observedAt','freshUntil','effectiveFrom','expiresAt','pollHours','related']) assert.deepEqual(r[key],source[i][key],r.id+' '+key) })
  for (const r of contract.preserved_routes) assert.equal(hash(JSON.stringify(routes.find(x=>x.path===r.path))),r.sha256,r.path)
  for (const f of contract.preserved_source_files) assert.equal(hash(read(f.path)),f.sha256,f.path)
})
test('all six rendered static routes carry permanent archive context and dated metadata', () => {
  htmls.forEach((html,i)=>assert.equal(validateRadarHtml(html,radarRoutes[i]),true))
  for (const date of ['2026-07-01','2026-07-17','2026-09-16','2028-01-01']) {
    const old = Date.now
    try { Date.now=()=>Date.parse(date); assert.equal(renderRadarHub(site,options),htmls[0]);radarRecords.forEach((r,i)=>assert.equal(renderRadarRecord(r,site,options),htmls[i+1])) } finally { Date.now=old }
  }
  assert.ok(radarHub.description.includes('not live status'))
})
test('v2 portable records/rows retain context and source history', () => {assert.equal(validateRadarJson(radarJson()),true);assert.equal(validateRadarCsv(radarCsv()),true);assert.ok(!radarJson().includes('"status": "current"'));assert.ok(radarCsv().includes(radarNotice))})
test('HTML context and source mutation rejects', () => {
  htmls.forEach((html,i)=>{
    for(const phrase of ['<p>'+radarNotice+'</p>','17 JULY 2026 SOURCE ARCHIVE','JULY 2026 ARCHIVE','data-clock-label','"dateModified":"2026-09-16"']) assert.throws(()=>validateRadarHtml(html.replaceAll(phrase,''),radarRoutes[i]))
    assert.throws(()=>validateRadarHtml(html.replaceAll('data-freshness-state="archived_observation"','data-freshness-state="current"'),radarRoutes[i]))
    assert.throws(()=>validateRadarHtml(html+'CURRENT OBSERVATION',radarRoutes[i]))
  })
})
test('JSON missing context/version/history or unsafe status rejects', () => {
  for (const mutate of [d=>{d.schema_version='1.0'},d=>{delete d.reuse_notice},d=>{d.generated_at=d.source_edition_at},d=>{d.records[0].record_state='current'},d=>{d.records[0].status='current'},d=>{d.records[0].reuse_notice=''},d=>{d.records[0].freshness.observed_at='2026-09-16T18:08:43Z'},d=>{d.records[0].freshness.monitoring_active=true},d=>{d.records[0].provenance.sha256='bad'},d=>{d.records[0].history=[]}]) {const data=JSON.parse(radarJson());mutate(data);assert.throws(()=>validateRadarJson(JSON.stringify(data)))}
})
test('CSV detached rows need version, archive state, warning and source dates', () => {
  for (const text of [radarCsv().replaceAll(radarNotice,''),radarCsv().replaceAll('archived_observation','current'),radarCsv().replaceAll('"2.0"','"1.0"'),radarCsv().replaceAll('2026-07-17T18:08:43Z','2026-09-16T18:08:43Z'),radarCsv().replaceAll(radarRecords[0].source.url,'https://example.com/'),radarCsv().split('\n').slice(0,-2).join('\n')]) assert.throws(()=>validateRadarCsv(text))
})

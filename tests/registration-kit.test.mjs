import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync}from'node:fs'
import {createHash}from'node:crypto'
import {registrationRoute as route}from'../scripts/registration-kit.mjs'
import {routes}from'../scripts/routes.mjs'
import {registrationContract as contract,registrationEvidence as evidence,validateRegistrationRoute,validateRegistrationMarkdown,validateRegistrationCsv,validateRegistrationText,parseCsv}from'../scripts/registration-validation.mjs'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const md=read('public'+route.resourceKit.assets[0].href),csv=read('public'+route.resourceKit.assets[1].href)
const hash=x=>createHash('sha256').update(x).digest('hex')
test('dated route and portable files satisfy shared context contract',()=>{assert.equal(validateRegistrationRoute(route),true);assert.equal(validateRegistrationMarkdown(md),true);assert.equal(validateRegistrationCsv(csv),true);assert.equal(contract.status,'draft_only_not_publication_approval')})
test('twelve other route objects and six booking/visual sources remain unchanged',()=>{assert.equal(contract.preserved_routes.length,12);for(const r of contract.preserved_routes)assert.equal(hash(JSON.stringify(routes.find(x=>x.path===r.path))),r.sha256,r.path);for(const f of contract.preserved_source_files)assert.equal(hash(readFileSync(new URL('../'+f.path,import.meta.url))),f.sha256,f.path)})
test('publication and consultation start are separate primary-source facts',()=>{assert.equal(evidence.facts.publication_date,'2026-06-23');assert.equal(evidence.facts.consultation_start,'2026-06-22');assert.equal(evidence.captures[0].metadata['govuk:first-published-at'].slice(0,10),evidence.facts.publication_date);assert.match(evidence.duration_excerpt,/22 June 2026.*21 September 2026/s);assert.equal(evidence.questions.length,13)})
test('no clock logic: date-safe text is identical before, on and after recorded deadline',()=>{const original=Date.now;try{for(const date of ['2026-09-20T23:59:59Z','2026-09-21T12:00:00Z','2026-09-22T00:00:00Z','2027-01-01T00:00:00Z']){Date.now=()=>Date.parse(date);assert.equal(validateRegistrationRoute(route),true);assert.equal(validateRegistrationMarkdown(md),true);assert.equal(validateRegistrationCsv(csv),true)}}finally{Date.now=original}})
test('restored current-status claims fail closed in each surface',()=>{for(const phrase of contract.prohibited_current_claims){assert.throws(()=>validateRegistrationRoute({...route,standfirst:route.standfirst+' '+phrase}),/current-status/);assert.throws(()=>validateRegistrationMarkdown(md+' '+phrase),/current-status/);assert.throws(()=>validateRegistrationCsv(csv+' '+phrase),/current-status/)}})
test('lost or altered source context fails closed',()=>{for(const phrase of ['Dated source record, not live consultation status.','current status, deadline and submission instructions'])assert.throws(()=>validateRegistrationMarkdown(md.replaceAll(phrase,'')));assert.throws(()=>validateRegistrationRoute({...route,reviewedOn:'2026-07-17'}));assert.throws(()=>validateRegistrationRoute({...route,expiresOn:'2026-09-21'}));assert.throws(()=>validateRegistrationCsv(csv.replaceAll('2026-09-21','2026-09-22')));assert.throws(()=>validateRegistrationCsv(csv.replaceAll('not live status or current law','')));assert.throws(()=>validateRegistrationText('OPEN CONSULTATION'))})
test('all exact quoted official questions and 13 spreadsheet rows required',()=>{for(const q of evidence.questions)assert.throws(()=>validateRegistrationMarkdown(md.replace(q.text.split('\n').map(s=>'> '+s).join('\n'),'')));assert.throws(()=>validateRegistrationMarkdown(md.replace('## Question 13','## Question 14')));assert.throws(()=>validateRegistrationCsv(csv.split('\n').slice(0,-2).join('\n')));assert.equal(parseCsv(csv).length,14)})
test('CSV roundtrip handles quoting and rejects malformed files',()=>{assert.deepEqual(parseCsv('a,b\n"hello, world","quote ""yes"""\n'),[['a','b'],['hello, world','quote "yes"']]);assert.throws(()=>parseCsv('a,"unterminated'));assert.throws(()=>parseCsv('a,"b"c'));assert.throws(()=>parseCsv('a,b"c"'))})
test('committed text snapshots verify source excerpts and verbatim question mapping',()=>{
 for(const capture of evidence.captures)assert.equal(hash(read(capture.text_snapshot)),capture.text_sha256)
 const source=read(evidence.captures[0].text_snapshot);for(const key of ['duration_excerpt','scope_excerpt','next_steps_excerpt'])assert.ok(source.includes(evidence[key]),key)
 for(const q of evidence.questions)assert.ok(source.includes(q.text),'Question '+q.number)
 assert.ok(source.replace(/\s+/g,' ').includes(evidence.partial_response_excerpt))
})
test('registration stylesheet does not alter other route assets',()=>{
 assert.match(read('scripts/generate-static-routes.mjs'),/route.path === registrationRoute.path \? '<link rel="stylesheet" href="\/registration-kit.css" \/>' : ''/)
 assert.match(read('public/registration-kit.css'),/max-width: 1100px/)
})

test('download badges show exact portable-file byte counts',()=>{
 for(const asset of route.resourceKit.assets){const bytes=readFileSync(new URL('../public'+asset.href,import.meta.url)).length;assert.ok(asset.meta.endsWith(bytes.toLocaleString('en-GB')+' BYTES'))}
})

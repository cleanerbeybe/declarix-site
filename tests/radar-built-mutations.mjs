// Run against an already-built tree. Every mutated file is restored in finally.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { radarRoutes, radarRecords } from '../scripts/radar.mjs'
import { radarNotice } from '../scripts/radar-freshness.mjs'
const rows=[]
const mutate=(file,name,change)=>{
 const original=readFileSync(file,'utf8'), altered=change(original)
 if(original===altered)throw new Error('Mutation did not apply: '+name)
 try{
  writeFileSync(file,altered)
  let rejected=false
  try{execFileSync(process.execPath,['scripts/verify-build.mjs'],{stdio:'pipe'})}catch(error){if(error.status!==1 || !String(error.stderr).includes('Radar'))throw error;rejected=true}
  if(!rejected)throw new Error('Accepted unsafe built mutation: '+name)
  rows.push({file,name,rejected:true})
 }finally{writeFileSync(file,original)}
}
execFileSync(process.execPath,['scripts/verify-build.mjs'],{stdio:'pipe'})
for(const [i,route] of radarRoutes.entries()){
 const file='dist'+route.path+'index.html'
 mutate(file,'remove visible archive notice',s=>s.replace('<p>'+radarNotice+'</p>',''))
 mutate(file,'restore live-current state',s=>s.replaceAll('data-freshness-state="archived_observation"','data-freshness-state="current"'))
 mutate(file,'wrong source observation',s=>s.replaceAll('data-observed-at="2026-07-17T18:08:43Z"','data-observed-at="2026-09-16T18:08:43Z"'))
 mutate(file,'remove supplemental assessment',s=>s.replaceAll('data-clock-label','data-no-assessment'))
 if(i)mutate(file,'drop official source links',s=>s.replaceAll('href="'+radarRecords[i-1].source.url+'"','href="https://example.com/"'))
}
for(const version of ['v1','v2'])for(const ext of ['json','csv']){
 const file=`dist/downloads/cds-operations-radar-${version}.${ext}`
 mutate(file,'remove reuse warning',s=>s.replaceAll(radarNotice,''))
 mutate(file,'restore current state',s=>s.replaceAll('archived_observation','current'))
 mutate(file,'pretend observation refresh',s=>s.replaceAll('2026-07-17T18:08:43Z','2026-09-16T18:08:43Z'))
}
execFileSync(process.execPath,['scripts/verify-build.mjs'],{stdio:'pipe'})
mkdirSync('output/radar-freshness',{recursive:true})
writeFileSync('output/radar-freshness/BUILT_MUTATIONS.json',JSON.stringify({status:'PASS',checks:rows.length,rows},null,2)+'\n')
console.log(JSON.stringify({status:'PASS',checks:rows.length,scope:'actual built file mutations; production verifier rejected; all original files restored and final verify passed'}))

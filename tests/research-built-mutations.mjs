import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { reports } from '../scripts/reports.mjs'
import { authorityRoutes, authorityAssets } from '../scripts/authority-library.mjs'
import { lineage } from '../scripts/research-lineage.mjs'
const results=[]
const mutate=(file,name,change)=>{
 const original=readFileSync(file,'utf8'),altered=change(original);if(original===altered)throw new Error('Mutation did not apply '+name)
 try{writeFileSync(file,altered);let rejected=false;try{execFileSync(process.execPath,['scripts/verify-build.mjs'],{stdio:'pipe'})}catch(e){if(e.status!==1||!String(e.stderr).includes('Research lineage'))throw e;rejected=true}if(!rejected)throw new Error('Accepted unsafe mutation '+name);results.push({file,name,rejected})}finally{writeFileSync(file,original)}
}
execFileSync(process.execPath,['scripts/verify-build.mjs'],{stdio:'pipe'})
for(const [i,r]of [reports[0],authorityRoutes.find(x=>x.kind==='burden-report')].entries()){
 const file='dist'+r.path+'index.html',method=i?lineage.hmrcMethod:lineage.originalMethod,notice=i?lineage.hmrcNotice:lineage.originalNotice
 mutate(file,'remove visible method',s=>s.replace('<p>'+method+'</p>',''))
 mutate(file,'remove visible reuse notice',s=>s.replace('<p>'+notice+'</p>',''))
 mutate(file,'invent human review',s=>s.replace('</main>','<p>directed human review</p></main>'))
 mutate(file,'wrong schema period',s=>s.replaceAll(i?'2024-10-21/2025-01-17':'2026-07-15','2026-09-16'))
 mutate(file,'wrong metadata claim',s=>s.replaceAll(r.description,'Verified customer results'))
 if(i)mutate(file,'stale source-register date',s=>s.replace('source edition checked on 16 September 2026','source edition checked on 17 July 2026'))
 const assets=i?authorityAssets(r):r.downloads
 for(const a of assets){const f='dist'+a.href
  mutate(f,'wrong denominator',s=>s.replaceAll(i?'460':'402','999'))
  mutate(f,'wrong source',s=>s.replaceAll(i?lineage.hmrcUrl:lineage.originalUrl,'https://example.com/'))
  mutate(f,'wrong historical period',s=>s.replaceAll(a.href.endsWith('.svg')?(i?'21 October 2024':'15 July 2026'):(i?'2024-10-21':'2026-07-15'),'today'))
  if(a.href.endsWith('.csv'))mutate(f,'drop row reuse context',s=>s.replace(i?lineage.hmrcNotice:lineage.originalNotice,''))
  else mutate(f,'drop visible measurement limit',s=>s.replace(i?'Not elapsed clearance time.':'not verified human qualification',''))
 }
 for(const name of ['llms.txt','llms-full.txt'])mutate('dist/'+name,'unsafe discovery description',s=>s.replace(r.description,'Verified customer results'))
}
execFileSync(process.execPath,['scripts/verify-build.mjs'],{stdio:'pipe'})
mkdirSync('output/research-lineage',{recursive:true});writeFileSync('output/research-lineage/BUILT_MUTATIONS.json',JSON.stringify({status:'PASS',checks:results.length,results},null,2)+'\n');console.log(JSON.stringify({status:'PASS',checks:results.length,scope:'Actual built mutations rejected by production verifier; original bytes restored and final verify passed.'}))

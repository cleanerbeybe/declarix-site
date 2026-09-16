import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import assert from 'node:assert/strict'
import { authorityRoutes, authorityAssets } from '../scripts/authority-library.mjs'
import { isWorkpaper, workpaperNotice } from '../scripts/workpaper-context.mjs'
const root=dirname(dirname(fileURLToPath(import.meta.url))),results=[]
const verify=()=>spawnSync(process.execPath,['scripts/verify-build.mjs'],{cwd:root,encoding:'utf8'})
assert.equal(verify().status,0,'clean baseline')
function mutate(path,name,change){const file=join(root,'dist',path),before=readFileSync(file,'utf8'),after=change(before);assert.notEqual(after,before,name);try{writeFileSync(file,after);const run=verify();assert.notEqual(run.status,0,name);assert.match(run.stderr,/Workpaper:/,name+' correct verifier');results.push({name,rejected:true})}finally{writeFileSync(file,before)}}
for(const r of authorityRoutes.filter(isWorkpaper)){
 const html=r.path+'index.html',a=authorityAssets(r)[0]
 mutate(html,r.slug+' notice removal',s=>s.replace(workpaperNotice,''))
 mutate(html,r.slug+' date conflation',s=>s.replace('EDITION<br/>2026-09-16','REVIEWED<br/>2026-09-16'))
 mutate(a.href,r.slug+' source href removed',s=>s.replace('href="'+r.sources[0].url+'"','href="#"'))
 mutate(a.href,r.slug+' portable scope removed',s=>s.replace('not a full regulatory review','current legal approval'))
 if(r.correction)mutate(html,r.slug+' targeted step reversed',s=>s.replace(r.steps[r.code==='GMR / GVMS'?1:r.code==='T1 / NCTS'?4:0][2].replaceAll('&','&amp;'),'Use every reference and assume permission.'))
}
assert.equal(verify().status,0,'restored final verification');mkdirSync(join(root,'output/workpapers'),{recursive:true});writeFileSync(join(root,'output/workpapers/BUILT_MUTATIONS.json'),JSON.stringify({status:'PASS',checks:results.length,scope:'Actual built file mutations; production verifier rejected each; originals restored.',results},null,2)+'\n');console.log(JSON.stringify({status:'PASS',checks:results.length}))

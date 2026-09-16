import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { authorityRoutes, authorityAssets } from './authority-library.mjs'
import { isWorkpaper, workpaperNotice, workpaperScope } from './workpaper-context.mjs'
const xml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
const fail=s=>{throw new Error('Workpaper: '+s)}
export function validateWorkpaperHtml(html,route) {
  const visible=html.replace(/<head>[\s\S]*?<\/head>/i,'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'')
  for(const phrase of [workpaperNotice,workpaperScope(route),...(route.correction?[route.correction]:[])])if(!visible.includes(xml(phrase)))fail(route.path+' missing visible context: '+phrase)
  if(!html.includes('href="/workpapers.css"')||!visible.includes('class="workpaper-notice"'))fail('notice/style missing')
  if(!visible.includes('EDITION<br/>2026-09-16')||!visible.includes('not a complete source re-review'))fail('edition and check date conflated')
  for(const s of route.sources)if(!visible.includes('href="'+xml(s.url)+'"')||!visible.includes(xml(s.checked)))fail('source link/date missing')
  if(route.kind==='workflow')for(const [,title,copy] of route.steps)for(const s of [title,copy])if(!visible.includes(xml(s)))fail('step changed or missing')
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph']||[]
  if(!graph.some(x=>x.dateModified==='2026-09-16'))fail('edition metadata missing')
  for(const a of authorityAssets(route))if(!visible.includes(`download href="${a.href}"`))fail('download missing')
  return true
}
export async function verifyWorkpaperBuild(root) {
  for(const r of authorityRoutes.filter(isWorkpaper)) {
    validateWorkpaperHtml(await readFile(join(root,'dist',r.path,'index.html'),'utf8'),r)
    for(const a of authorityAssets(r))if(await readFile(join(root,'dist',a.href),'utf8')!==a.content)fail('portable content drift '+a.href)
  }
  return true
}

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { reports, aggregateCsv, pressChartSvg } from './reports.mjs'
import { authorityRoutes, authorityAssets } from './authority-library.mjs'
import { lineage } from './research-lineage.mjs'
const fail=msg=>{throw new Error('Research lineage: '+msg)}
const requireValue=(value,expected,label)=>{if(value!==expected)fail(label)}
export function validateResearchHtml(html, route) {
  const original=route===reports[0] || route.path===reports[0].path
  const method=original?lineage.originalMethod:lineage.hmrcMethod, notice=original?lineage.originalNotice:lineage.hmrcNotice
  const visible=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<head>[\s\S]*?<\/head>/i,'')
  for(const phrase of [method,notice])if(!visible.includes('<p>'+phrase+'</p>'))fail(route.path+' visible context missing')
  if(!html.includes('class="research-notice"')||!html.includes('href="/research-lineage.css"'))fail('notice/style missing')
  if(/directed human review|and human qualification|deterministic evidence scoring|397 CMS-PRESERVATION FITS/i.test(html))fail('unsupported attribution or fit claim')
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph']||[]
  const dataset=graph.find(x=>x['@type']==='Dataset');if(!dataset)fail('Dataset missing')
  requireValue(dataset.measurementTechnique,method,'schema method')
  requireValue(dataset.temporalCoverage,original?'2026-07-15':'2024-10-21/2025-01-17','schema period')
  requireValue(dataset.description,notice,'schema reuse limits')
  requireValue(dataset.dateModified,'2026-09-16','schema reviewed date')
  for(const prefix of ['name="description"','property="og:description"'])if(!html.includes(prefix+' content="'+route.description+'"'))fail('metadata context')
  if(!original){for(const phrase of ['366 intermediaries and 94 traders','15 qualitative interviews','not directly comparable to the 2023 wave',lineage.hmrcFullUrl])if(!visible.includes(phrase))fail('HMRC sample/source limit missing')}
  return true
}
export async function verifyResearchBuild(root) {
  for(const route of [reports[0],authorityRoutes.find(x=>x.kind==='burden-report')]) {
    validateResearchHtml(await readFile(join(root,'dist',route.path,'index.html'),'utf8'),route)
    const assets=route===reports[0] ? [{href:route.downloads[0].href,content:aggregateCsv(route)},{href:route.downloads[1].href,content:pressChartSvg(route)}] : authorityAssets(route)
    for(const asset of assets) requireValue(await readFile(join(root,'dist',asset.href),'utf8'),asset.content,'portable data or context drift: '+asset.href)
    for(const name of ['llms.txt','llms-full.txt']){
      const text=await readFile(join(root,'dist',name),'utf8')
      const expected=`- [${route.title}](https://getdeclarix.com${route.path}): ${route.description}`
      if(!text.split('\n').includes(expected))fail('dated discovery: '+name)
    }
  }
  return true
}

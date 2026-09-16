export const workpaperEdition = '2026-09-16'
export const isWorkpaper = route => ['incoterm-term', 'workflow'].includes(route.kind)
export const workpaperNotice = 'Workpaper edition: 16 September 2026. Original source-check record: 17 July 2026. Source links were retrieved on 16 September 2026; retrieval is not a full regulatory review. Dated corrections are identified below. Check the current official instructions before using this sheet.'
export const workpaperScope = route => route.kind === 'incoterm-term'
  ? 'Independent Incoterms 2020 summary, not an ICC rulebook. Check the contract, named place, transport mode and customs valuation guidance. Incoterms is a trademark of ICC.'
  : 'Operational prompts, not permission to move goods or submit a declaration. Check the movement, jurisdiction, exceptions, timing and current official instructions.'
const xml = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
export function wrapWorkpaperText(text, max=105) {
  const lines=[]
  for(const word of String(text).split(/\s+/)) {
    if(word.length>max) { for(let i=0;i<word.length;i+=max)lines.push(word.slice(i,i+max));continue }
    if(!lines.length || lines.at(-1).length+word.length+1>max)lines.push(word)
    else lines[lines.length-1]+=' '+word
  }
  return lines
}
export function workpaperFooter(route) {
  let y=622
  const line=(s,attributes='')=>{const out=`<text x="70" y="${y}" font-family="monospace" font-size="14" fill="#17333d" ${attributes}>${xml(s)}</text>`;y+=21;return out}
  const para=(s)=>wrapWorkpaperText(s).map(t=>line(t)).join('')
  let out='<g data-workpaper-context="2"><path d="M70 590 H1130" stroke="#17333d"/>'
  out+=line('PORTABLE SOURCE RECORD · EDITION 2026-09-16','font-weight="bold"')
  out+=para(workpaperNotice)+para(workpaperScope(route))
  if(route.correction)out+=para('TARGETED CORRECTION 2026-09-16: '+route.correction)
  out+=line('SOURCES · original check dates or limited correction check shown for each link')
  for(const s of route.sources) {
    out+=para(s.title+' · '+s.checked)
    out+=`<a href="${xml(s.url)}">${para(s.url)}</a>`
  }
  out+='</g>'
  if(y>1155)throw new Error('Workpaper source footer exceeds canvas: '+route.path+' '+y)
  return out
}
export function workpaperContextHtml(route) {
  return `<section class="workpaper-notice" aria-label="Workpaper source dates and reuse limits"><h2>Keep the source record with the sheet.</h2><p>${xml(workpaperNotice)}</p><p>${xml(workpaperScope(route))}</p>${route.correction?`<p>Targeted correction, 16 September 2026: ${xml(route.correction)}</p>`:''}</section>`
}

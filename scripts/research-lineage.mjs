export const lineage = {
  updatedOn: '2026-09-16',
  originalUrl: 'https://getdeclarix.com/research/uk-customs-operations-signal-report-2026/',
  originalMethod: 'Agent-assisted public-source research with coordinating-agent ledger checks; not verified human qualification.',
  originalNotice: 'Historical research classifications from 15 July 2026, not customers, buying intent, market size, software adoption or product results. Check current evidence before use.',
  hmrcUrl: 'https://www.gov.uk/government/publications/customs-administrative-burden-wave-2',
  hmrcFullUrl: 'https://assets.publishing.service.gov.uk/media/69989462bfdab2546272c0ae/HMRC_CAB_W2_Report___1_.odt',
  hmrcMethod: 'Weighted telephone survey; fieldwork 21 October 2024 to 17 January 2025. Published 26 February 2026. Headline values have different question bases.',
  hmrcNotice: 'Active work on a typical process without major issues, not elapsed clearance time. Time and internal wage-cost estimates are trimmed means, not broker fees or Declarix results. Question bases vary by process.',
}
export const burdenMetrics = [
  ['sample','Surveyed declarants',460,460,'respondents','exact sample size','460 respondents','Random probability telephone survey; 15 qualitative interviews are separate'],
  ['intermediary_mix','Customs intermediaries',70,70,'percent','weighted percentage','460 overall; 366 intermediary respondents unweighted','Do not convert weighted percentage to respondent count'],
  ['trader_mix','Traders',30,30,'percent','weighted percentage','460 overall; 94 trader respondents unweighted','Do not convert weighted percentage to respondent count'],
  ['typical_process_time','Average active-work time per typical process',19,28,'minutes','range of trimmed means','Figure 4.4: GVMS export 234; GVMS import 166; NCTS export 186; NCTS import 126; SDW import 112; S&S import 70','Active work excludes waiting; typical means no major issues; GVMS export low and NCTS import high'],
  ['internal_cost','Estimated internal wage cost per typical process',5,7,'GBP','range of trimmed means','Figure 4.6: GVMS export 226; GVMS import 162; NCTS export 183; NCTS import 125; SDW import 109; S&S import 66','Estimated using activity time and ASHE wage data; top and bottom 5 percent trimmed; not a broker fee'],
  ['automation_data_entry','Automated data entry would help',70,70,'percent','approximate across process types','Figure 4.7: GVMS export 260; GVMS import 184; NCTS export 206; NCTS import 140; SDW import 124; S&S import 76','Response to what would reduce time spent; approximately 70 percent, not an exact universal rate'],
  ['no_change_needed','No change needed or already efficient','',20,'percent','upper bound only','Figure 4.7: GVMS export 260; GVMS import 184; NCTS export 206; NCTS import 140; SDW import 124; S&S import 76','At most one in five; no lower endpoint is reported'],
]
const cell = value => '"' + String(value ?? '').replaceAll('"','""') + '"'
export function burdenLineageCsv() {
  const header=['metric_id','label','value_low','value_high','unit','precision','denominator','source_note','schema_version','source_url','fieldwork_from','fieldwork_to','published_on','source_checked_on','method','reuse_notice']
  const rows=burdenMetrics.map(row=>[...row,'2.0',lineage.hmrcUrl,'2024-10-21','2025-01-17','2026-02-26',lineage.updatedOn,lineage.hmrcMethod,lineage.hmrcNotice])
  return [header,...rows].map(row=>row.map(cell).join(',')).join('\n')+'\n'
}
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
const line=(text,y,size=23,color='#16313d')=>`<text x="64" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="${color}">${esc(text)}</text>`
function svg(title,desc,body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(desc)}</desc><rect width="1200" height="900" fill="#f7f6f1"/><rect x="28" y="28" width="1144" height="844" fill="none" stroke="#16313d" stroke-width="3"/>${body}</svg>`
}
export function originalLineageSvg(report) {
  let x=64
  const bars=report.tiers.map((row,i)=>{const width=1072*row.count/report.qualifiedTotal;const bar=`<rect x="${x}" y="225" width="${width}" height="74" fill="${['#c77b27','#1b7a4b','#16313d'][i]}"/>`;x+=width;return bar}).join('')
  return svg('July 2026 agent-assisted research classifications',lineage.originalMethod+' '+lineage.originalNotice,
    line('DECLARIX · HISTORICAL RESEARCH · 15 JULY 2026',78,23)+line(report.qualifiedTotal+' accounts met the research threshold',142,40)+line('Agent-assisted classification, not verified human qualification.',185,24)+bars+
    report.tiers.map((row,i)=>line(`${row.count} ${row.label} · ${(100*row.count/report.qualifiedTotal).toFixed(1)}% of ${report.qualifiedTotal}`,350+i*44,28)).join('')+
    line('Threshold: 65/100. Pain 25%, product fit 25%, timing 20%,',510)+line('reachability 15%, evidence quality 15%. These are research ratings.',544)+
    line('1,203 ledger decisions: 402 qualified, 309 excluded, 489 unresolved, 3 aliases.',600,22)+line('This is not market size, buying intent, software adoption or a product result.',644,22)+line('Source: Declarix July research ledger; coordinating-agent aggregate checks.',695,22)+line('Snapshot: 15 July 2026. Aggregate reconciliation: 16 September 2026.',730,22)+line('Check current evidence before using these historical classifications.',770,22)+
    `<a href="${lineage.originalUrl}">${line(lineage.originalUrl,824,17,'#1b7a4b')}</a>`)
}
export function burdenLineageSvg() {
  return svg('HMRC and Ipsos Wave 2: historical survey findings',lineage.hmrcMethod+' '+lineage.hmrcNotice,
    line('HMRC / IPSOS · WAVE 2 · PUBLISHED 26 FEBRUARY 2026',76,24)+line('460 survey respondents',140,46)+line('Fieldwork: 21 October 2024 to 17 January 2025',185,25)+
    line('70% intermediaries / 30% traders: weighted shares.',245,30)+line('Raw bases: 366 intermediaries and 94 traders. Do not infer counts from shares.',285,22)+
    line('19–28 minutes of active work',354,40)+line('Range of trimmed means across typical processes without major issues.',394,23)+line('Not elapsed clearance time. Process bases differ: see source Figure 4.4.',430,23)+
    line('£5–£7 estimated internal wage cost',496,37)+line('Trimmed means from activity time and wage data; not broker fees.',535,23)+
    line('≈70% said automated data entry would help across process types.',592,25)+line('Approximate responses, not a measured product saving. Question bases vary.',629,22)+
    line('Source: HMRC research report 861, Figures 4.4, 4.6 and 4.7; Annex A.',681,22)+line('The 15 qualitative interviews are a separate strand. Not Declarix results.',718,22)+line('Source checked: 16 September 2026. Keep these limits when reusing the chart.',755,22)+
    `<a href="${lineage.hmrcUrl}">${line(lineage.hmrcUrl,820,18,'#1b7a4b')}</a>`)
}

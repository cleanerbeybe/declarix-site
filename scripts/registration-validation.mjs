import { readFileSync } from 'node:fs'
export const registrationContract = JSON.parse(readFileSync(new URL('../contracts/registration-kit-draft-2026-09-16.json',import.meta.url),'utf8'))
export const registrationEvidence = JSON.parse(readFileSync(new URL('../docs/registration/source-check-2026-09-16.json',import.meta.url),'utf8'))
const requireText=(text,phrase)=>{if(!text.includes(phrase))throw new Error('Registration context missing: '+phrase)}
export function validateRegistrationText(text) {
  for(const phrase of registrationContract.prohibited_current_claims)if(text.toLowerCase().includes(phrase.toLowerCase()))throw new Error('Registration current-status claim: '+phrase)
  return true
}
export function validateRegistrationRoute(route) {
  if(route.path!==registrationContract.reviewed_paths[0] || route.freshnessMode!=='dated_source_record_not_live_status' || route.expiresOn)throw new Error('Registration freshness contract missing')
  if(route.reviewedOn!==registrationEvidence.checked_on || route.sourceSnapshotOn!==registrationEvidence.checked_on)throw new Error('Registration source dates disagree')
  const text=JSON.stringify(route);validateRegistrationText(text)
  for(const phrase of ['Dated source record, not live consultation status.','Check the official page for current status, deadline and submission instructions','23 June 2026','22 June 2026','21 September 2026'])requireText(text,phrase)
  if(route.sources.length!==2)throw new Error('Registration sources missing')
  for(const [i,source]of route.sources.entries())if(source.url!==registrationEvidence.captures[i].url || source.checked!==registrationEvidence.checked_on)throw new Error('Registration source mismatch')
  return true
}
export function validateRegistrationMarkdown(text) {
  validateRegistrationText(text)
  for(const phrase of ['Edition and source check: 16 September 2026','Published response deadline recorded from HMRC: Monday 21 September 2026','Dated source record, not live consultation status.','current status, deadline and submission instructions',registrationEvidence.captures[0].url])requireText(text,phrase)
  const numbers=[...text.matchAll(/^## Question (\d+) /gm)].map(m=>+m[1]);if(JSON.stringify(numbers)!==JSON.stringify(Array.from({length:13},(_,i)=>i+1)))throw new Error('Registration question count/order')
  for(const q of registrationEvidence.questions)requireText(text,q.text.split('\n').map(line=>'> '+line).join('\n'))
  return true
}
// CSV parser supports escaped quotes and embedded newlines; throws on malformed quotes.
export function parseCsv(text) {
  const rows=[];let row=[],cell='',quoted=false,closed=false
  for(let i=0;i<text.length;i++) {const c=text[i];if(quoted){if(c==='"' && text[i+1]==='"'){cell+='"';i++}else if(c==='"'){quoted=false;closed=true}else cell+=c;continue}
    if(c==='"'){if(cell || closed)throw new Error('Malformed CSV quote');quoted=true}
    else if(c===',' || c==='\n'){row.push(cell.replace(/\r$/,''));cell='';closed=false;if(c==='\n'){rows.push(row);row=[]}}
    else{if(closed && c!=='\r')throw new Error('Malformed CSV after quote');cell+=c}
  }
  if(quoted)throw new Error('Unclosed CSV quote');if(cell || row.length){row.push(cell);rows.push(row)}return rows
}
export function validateRegistrationCsv(text) {
  validateRegistrationText(text);const [header,...rows]=parseCsv(text)
  if(rows.length!==13)throw new Error('Registration CSV row count')
  const required=['question_number','source_url','source_checked_on','published_response_deadline','reuse_notice','question_wording_basis']
  for(const key of required)if(!header.includes(key))throw new Error('Registration CSV column missing: '+key)
  rows.forEach((row,i)=>{if(row.length!==header.length)throw new Error('Registration CSV row shape');const r=Object.fromEntries(header.map((h,k)=>[h,row[k]]))
    if(r.question_number!==String(i+1) || r.source_url!==registrationEvidence.captures[0].url || r.source_checked_on!==registrationEvidence.checked_on || r.published_response_deadline!==registrationContract.deadline_recorded)throw new Error('Registration CSV context mismatch')
    requireText(r.reuse_notice,'not live status or current law');requireText(r.reuse_notice,'current status deadline and submission instructions');requireText(r.question_wording_basis,'Theme paraphrase')
  });return true
}
export function validateRegistrationHtml(html,route) {
  validateRegistrationRoute(route);validateRegistrationText(html)
  requireText(html,route.boundary);requireText(html,route.h1);requireText(html,'"dateModified":"'+route.reviewedOn+'"');requireText(html,'"description":"'+route.description+'"')
  for(const asset of route.resourceKit.assets)requireText(html,'href="'+asset.href+'" download')
  for(const source of route.sources)requireText(html,'href="'+source.url+'"')
  return true
}

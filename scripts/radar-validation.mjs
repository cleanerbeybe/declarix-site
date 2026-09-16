import { radarRecords, radarHub } from './radar.mjs'
import { radarNotice } from './radar-freshness.mjs'
import { parseCsv } from './registration-validation.mjs'
const requireText = (text, phrase) => { if (!text.includes(phrase)) throw new Error('Radar context missing: ' + phrase) }
export function validateRadarHtml(html, route) {
  const record = radarRecords.find(r => r.path === route.path)
  if (!record && route.path !== radarHub.path) throw new Error('Unknown Radar route')
  requireText(html, '<p>' + radarNotice + '</p>')
  requireText(html, '17 JULY 2026 SOURCE ARCHIVE')
  requireText(html, 'JULY 2026 ARCHIVE')
  requireText(html, 'data-clock-label')
  requireText(html, 'Not a source recheck.')
  if (/CURRENT OBSERVATION|Use the current 5\.2\.0|data-freshness-state="(?!archived_observation)[^"]+"/.test(html)) throw new Error('Radar static current-state claim')
  if ((html.match(/data-freshness-state="archived_observation"/g) || []).length !== (record ? 2 : 5)) throw new Error('Radar static state count')
  requireText(html, 'name="description" content="' + route.description + '"')
  requireText(html, '"description":"' + route.description + '"')
  requireText(html, '"dateModified":"2026-09-16"')
  requireText(html, '<link rel="canonical" href="https://getdeclarix.com' + route.path + '"')
  for (const r of record ? [record] : radarRecords) {
    requireText(html, 'data-observed-at="' + r.observedAt + '"')
    requireText(html, 'data-fresh-until="' + r.freshUntil + '"')
  }
  if (record) {
    requireText(html, 'href="' + record.source.url + '"')
    requireText(html, record.source.sha256)
    for (const event of record.history) requireText(html, '<time datetime="' + event.observedAt + '">')
  } else {
    for (const ext of ['json','csv']) requireText(html, 'href="/downloads/cds-operations-radar-v2.' + ext + '" download')
    requireText(html, '<noscript>')
    requireText(html, 'data-js-control hidden')
  }
  return true
}
export function validateRadarJson(text) {
  const data = JSON.parse(text)
  if (data.schema_version !== '2.0' || data.record_count !== 5 || data.records?.length !== 5 || data.source_edition_at !== '2026-07-17T18:08:43Z' || data.presentation_updated_on !== '2026-09-16' || data.reuse_notice !== radarNotice || 'generated_at' in data) throw new Error('Radar JSON edition/version/context')
  for (const [i, r] of data.records.entries()) {
    const original = radarRecords[i]
    if (r.record_id !== original.id || r.record_state !== 'archived_observation' || 'status' in r || r.reuse_notice !== radarNotice) throw new Error('Radar JSON record state/context')
    if (r.freshness.observed_at !== original.observedAt || r.freshness.fresh_until !== original.freshUntil || r.freshness.monitoring_active !== false || r.freshness.recorded_poll_interval_hours !== original.pollHours) throw new Error('Radar JSON observation drift')
    for (const [key, expected] of Object.entries({ provenance: original.source, history: original.history, correction: original.correction, review: original.review, timing: { effective_from: original.effectiveFrom, expires_at: original.expiresAt } })) if (JSON.stringify(r[key]) !== JSON.stringify(expected)) throw new Error('Radar JSON source/history drift: ' + key)
  }
  return true
}
export function validateRadarCsv(text) {
  const [header, ...rows] = parseCsv(text)
  for (const key of ['schema_version','record_state','reuse_notice','observed_at','fresh_until','source_url','snapshot_sha256']) if (!header.includes(key)) throw new Error('Radar CSV column missing: ' + key)
  if (rows.length !== 5) throw new Error('Radar CSV record count')
  rows.forEach((row,i) => {
    if (row.length !== header.length) throw new Error('Radar CSV shape')
    const r = Object.fromEntries(header.map((h,k) => [h,row[k]])), original = radarRecords[i]
    for (const [key,expected] of Object.entries({schema_version:'2.0',record_state:'archived_observation',reuse_notice:radarNotice,record_id:original.id,observed_at:original.observedAt,fresh_until:original.freshUntil,effective_from:original.effectiveFrom || '',expires_at:original.expiresAt || '',source_url:original.source.url,snapshot_sha256:original.source.sha256,correction_status:original.correction.status,review_state:original.review.state})) if (r[key] !== expected) throw new Error('Radar CSV context drift: ' + key)
  })
  return true
}

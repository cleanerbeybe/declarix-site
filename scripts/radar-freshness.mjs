export const radarNotice = 'Historical observations from 17 July 2026, not live status or current instructions. No later source check or active monitoring is claimed. Check the linked official source before use, including when you reuse a saved page or download.'

// Keep this function closed over no module state: the same code runs in the browser.
// An explicit clock is required. Invalid/missing inputs fail closed, never as current.
export function freshnessState(record, at) {
  const parse = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value) && new Date(value).toISOString?.() === value.replace('Z', '.000Z') ? Date.parse(value) : NaN
  // Date parsing is guarded because invalid calendar values can throw or normalize.
  let now, observed, fresh, effective, expires
  try {
    now = at instanceof Date ? at.getTime() : NaN
    observed = parse(record?.observedAt)
    fresh = parse(record?.freshUntil)
    effective = record?.effectiveFrom == null ? null : parse(record.effectiveFrom)
    expires = record?.expiresAt == null ? null : parse(record.expiresAt)
  } catch { return 'unknown' }
  if (![now, observed, fresh].every(Number.isFinite) || (effective !== null && !Number.isFinite(effective)) || (expires !== null && !Number.isFinite(expires)) || fresh < observed || (expires !== null && expires < observed) || (effective !== null && expires !== null && expires < effective)) return 'unknown'
  if (now < observed) return 'before_observation'
  if (effective !== null && now < effective) return 'not_yet_effective'
  if (expires !== null && now >= expires) return 'expired'
  // The upper freshness boundary is exclusive: recheck when it is reached.
  if (now >= fresh) return 'stale'
  return 'within_recorded_window'
}

export function freshnessLabel(state) {
  return {
    archived_observation: 'JULY 2026 ARCHIVE',
    within_recorded_window: 'WITHIN RECORDED WINDOW (NOT LIVE)',
    stale: 'SOURCE RECHECK DUE',
    expired: 'POINT-IN-TIME RECORD EXPIRED',
    not_yet_effective: 'NOT YET EFFECTIVE',
    before_observation: 'BEFORE RECORDED OBSERVATION',
    unknown: 'DATES UNKNOWN; CHECK THE OFFICIAL SOURCE',
  }[state] || 'DATES UNKNOWN; CHECK THE OFFICIAL SOURCE'
}

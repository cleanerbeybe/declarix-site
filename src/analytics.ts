import { CONFIG, isConfigured } from './config'

type AnalyticsPayload = Record<string, string | number | boolean | null>

let enabled = false
let distinctId = ''

export function initAnalytics() {
  if (!isConfigured(CONFIG.posthogKey) || enabled) return
  enabled = true
  distinctId = crypto.randomUUID()
  track('$pageview')
}

export function track(event: string, payload: AnalyticsPayload = {}) {
  if (!enabled) return
  const body = JSON.stringify({
    api_key: CONFIG.posthogKey,
    event,
    distinct_id: distinctId,
    properties: {
      ...payload,
      $current_url: window.location.href,
      $host: window.location.host,
      $pathname: window.location.pathname,
    },
  })
  const sent = navigator.sendBeacon?.(`${CONFIG.posthogHost}/capture/`, body)
  if (sent) return

  void fetch(`${CONFIG.posthogHost}/capture/`, {
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      method: 'POST',
    }).catch(() => undefined)
}

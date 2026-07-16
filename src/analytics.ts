import { CONFIG, isConfigured } from './config'

type AnalyticsPayload = Record<string, string | number | boolean | null>

type Attribution = {
  source: string
  medium: string
  campaign: string
  content: string
  term: string
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

let enabled = false
let initialized = false
let distinctId = ''

const attributionKeys = ['source', 'medium', 'campaign', 'content', 'term'] as const

function safeSessionGet(key: string) {
  try {
    return sessionStorage.getItem(key) || ''
  } catch {
    return ''
  }
}

function safeSessionSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    // Analytics must never block the visitor journey.
  }
}

function readReferrerHost() {
  if (!document.referrer) return 'direct'
  try {
    return new URL(document.referrer).host || 'direct'
  } catch {
    return 'unknown'
  }
}

export function getAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search)
  const incoming: Attribution = {
    source: params.get('utm_source') || params.get('src') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '',
    content: params.get('utm_content') || '',
    term: params.get('utm_term') || '',
  }

  for (const key of attributionKeys) {
    if (incoming[key] && !safeSessionGet(`dclrx-${key}`)) safeSessionSet(`dclrx-${key}`, incoming[key])
  }

  return {
    source: safeSessionGet('dclrx-source') || incoming.source || 'direct',
    medium: safeSessionGet('dclrx-medium') || incoming.medium || 'none',
    campaign: safeSessionGet('dclrx-campaign') || incoming.campaign || 'none',
    content: safeSessionGet('dclrx-content') || incoming.content || 'none',
    term: safeSessionGet('dclrx-term') || incoming.term || 'none',
  }
}

export function initAnalytics() {
  if (initialized) return
  initialized = true
  distinctId = safeSessionGet('dclrx-distinct-id') || crypto.randomUUID()
  safeSessionSet('dclrx-distinct-id', distinctId)
  enabled = isConfigured(CONFIG.posthogKey)
  track('$pageview', {
    ...getAttribution(),
    referrer_host: readReferrerHost(),
  })
}

export function track(event: string, payload: AnalyticsPayload = {}) {
  const properties = {
    ...getAttribution(),
    ...payload,
    page_path: window.location.pathname,
  }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...properties })

  if (!enabled) return
  const body = JSON.stringify({
    api_key: CONFIG.posthogKey,
    event,
    distinct_id: distinctId,
    properties: {
      ...properties,
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

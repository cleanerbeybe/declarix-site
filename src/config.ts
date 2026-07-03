export const CONFIG = {
  domain: 'getdeclarix.com',
  packEmail: 'pack@getdeclarix.com',
  zohoBookingScriptUrl: 'https://bookings.nimbuspop.com/assets/embed.js',
  zohoBookingUrl: 'https://declarixlimited.zohobookings.eu/portal-embed#/declarixlimited',
  bookingEmbedHeight: '600px',
  companyLegal: 'Declarix',
  companyNo: '',
  companyLocation: 'Leicester, England',
  linkedin: '',
  posthogKey: '',
  posthogHost: 'https://eu.i.posthog.com',
  pilotSlotsOpen: 3,
  multimodalBarUntil: '2026-07-31',
  founderLine:
    'Ihusan Adam, a PhD engineer who builds document-reading systems for regulated industries',
}

export function isConfigured(value: string) {
  return Boolean(value && !value.includes('{{'))
}

export function siteOrigin() {
  return `https://${CONFIG.domain}`
}

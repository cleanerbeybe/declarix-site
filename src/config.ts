export const CONFIG = {
  domain: 'getdeclarix.com',
  packEmail: 'pack@getdeclarix.com',
  zohoBookingScriptUrl: 'https://bookings.nimbuspop.com/assets/embed.js',
  zohoBookingUrl: 'https://declarixlimited.zohobookings.eu/portal-embed#/declarixlimited',
  bookingEmbedHeight: '600px',
  companyLegal: 'Declarix Limited',
  // verified against the public register 2026-07-06: DECLARIX LIMITED, active, inc. 19 Jun 2026
  companyNo: '17288258',
  companyLocation: 'Leicester, England',
  linkedin: '',
  posthogKey: '',
  posthogHost: 'https://eu.i.posthog.com',
  pilotSlotsOpen: 3,
  multimodalBarUntil: '2026-07-31',
  founderLine:
    'Ihusan Adam, a PhD engineer who builds document-reading systems for regulated industries',
  founderName: 'Ihusan Adam',
  // v2.5 B1.2 — real duotone portrait path once approved; empty renders no exhibit
  founderPortrait: '',
  // v3.0 §2 — the 8-10s duotone terminal loop (≤2.5MB, H.265/VP9). Empty ships the
  // poster still with the 40s Ken Burns fallback; drop the file in and the film plays.
  heroLoopUrl: '',
  heroPosterWide: '/exhibits/hero-terminal-1920.jpg',
  heroPosterTall: '/exhibits/hero-terminal-1080.jpg',
  // v3.0 §1 — ICC finalist confirmed; year ships as a find-replace token
  iccFinalistYear: '{{YEAR}}',
  // v2.5 B1.8 — /security page truths still owed by the desk
  securitySubprocessors: '{{SUBPROCESSOR LIST}}',
  securityProcessingLocation: '{{UK / EU}}',
  // v2.5 B1.3 — testimonial sockets ship dark until the first pilot quote lands
  testimonials: [] as Array<{ quote: string; name: string; title: string; firm: string }>,
}

export function isConfigured(value: string) {
  return Boolean(value && !value.includes('{{'))
}

export function siteOrigin() {
  return `https://${CONFIG.domain}`
}

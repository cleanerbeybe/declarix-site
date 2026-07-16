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
  posthogKey: import.meta.env.VITE_POSTHOG_KEY ?? '',
  posthogHost: import.meta.env.VITE_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
  multimodalBarUntil: '2026-07-31',
  founderLine:
    'Ihusan Adam, a PhD engineer who builds document-reading systems for regulated industries',
  founderName: 'Ihusan Adam',
  // v2.5 B1.2 — real duotone portrait path once approved; empty renders no exhibit
  founderPortrait: '',
  // v3.0 §2 / v4.0 — the duotone terminal loop (16s seamless ping-pong, H.264 mp4 +
  // VP9 webm, both <1.5MB). Generated from the hero poster via Higgsfield i2v, graded
  // to the ink/paper duotone. Empty ships the poster still + Ken Burns fallback.
  heroLoopUrl: '/exhibits/hero-loop.mp4',
  heroPosterWide: '/exhibits/hero-terminal-1920.jpg',
  heroPosterTall: '/exhibits/hero-terminal-1080.jpg',
  // owner-confirmed 2026-07-07: Seamless Trade Across Borders Challenge with
  // the ICC (Digital Catapult delivery), cohort selected Oct 2025
  iccFinalistYear: '2025',
  // v2.5 B1.3 — testimonial sockets ship dark until the first pilot quote lands
  testimonials: [] as Array<{ quote: string; name: string; title: string; firm: string }>,
}

export function isConfigured(value: string) {
  return Boolean(value && !value.includes('{{'))
}

export function siteOrigin() {
  return `https://${CONFIG.domain}`
}

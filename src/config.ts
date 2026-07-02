export const CONFIG = {
  domain: 'cleanerbeybe.github.io/declarix-site',
  packEmail: 'pack@getdeclarix.com',
  googleCalendarUrl: '',
  companyLegal: 'Declarix Ltd',
  companyNo: 'TBC',
  linkedin: '',
  posthogKey: '',
  posthogHost: 'https://eu.i.posthog.com',
  pilotSlotsOpen: 3,
  multimodalBarUntil: '2026-07-31',
  founderLine:
    'a UK team building document-reading systems for regulated operators',
}

export function isConfigured(value: string) {
  return Boolean(value && !value.includes('{{') && value !== 'TBC')
}

export function siteOrigin() {
  return `https://${CONFIG.domain}`
}

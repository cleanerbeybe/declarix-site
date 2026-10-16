// Movement Reference Number (MRN) decoder and check-digit validator.
// Structure: Implementing Regulation (EU) 2015/2447 Annex B, data element 12 01 001 000
// (as amended by 2021/235 and 2024/250): YY + country (a2) + unique identifier (an12)
// + procedure identifier (a1) + check digit (an1). HMRC applies the same structure
// for GB and XI MRNs; HMRC rule R0028 says the check digit follows ISO 6346.
// Self-contained on purpose: the page script inlines this file (imports and exports stripped).

export const MRN_PROCEDURES = {
  A: { label: 'Export only', family: 'export' },
  B: { label: 'Export and exit summary declaration', family: 'export' },
  C: { label: 'Exit summary declaration only', family: 'exit' },
  D: { label: 'Re-export notification', family: 'export' },
  E: { label: 'Dispatch of goods in relation with special fiscal territories', family: 'export' },
  J: { label: 'Transit declaration only', family: 'transit' },
  K: { label: 'Transit declaration and exit summary declaration', family: 'transit' },
  L: { label: 'Transit declaration and entry summary declaration', family: 'transit' },
  M: { label: 'Transit declaration, exit summary declaration and entry summary declaration', family: 'transit' },
  P: { label: 'Proof of the customs status of Union goods / customs goods manifest', family: 'status' },
  R: { label: 'Import declaration only', family: 'import' },
  S: { label: 'Import declaration and entry summary declaration', family: 'import' },
  T: { label: 'Entry summary declaration only', family: 'entry' },
  U: { label: 'Temporary storage declaration', family: 'storage' },
  V: { label: 'Introduction of goods in relation with special fiscal territories', family: 'import' },
  W: { label: 'Temporary storage declaration and entry summary declaration', family: 'storage' },
  Z: { label: 'Arrival notification', family: 'entry' },
}

export const MRN_COUNTRIES = {
  GB: 'United Kingdom (Great Britain)', XI: 'United Kingdom (Northern Ireland)',
  AT: 'Austria', BE: 'Belgium', BG: 'Bulgaria', HR: 'Croatia', CY: 'Cyprus', CZ: 'Czechia', DK: 'Denmark',
  EE: 'Estonia', FI: 'Finland', FR: 'France', DE: 'Germany', GR: 'Greece', HU: 'Hungary', IE: 'Ireland',
  IT: 'Italy', LV: 'Latvia', LT: 'Lithuania', LU: 'Luxembourg', MT: 'Malta', NL: 'Netherlands', PL: 'Poland',
  PT: 'Portugal', RO: 'Romania', SK: 'Slovakia', SI: 'Slovenia', ES: 'Spain', SE: 'Sweden',
  CH: 'Switzerland', NO: 'Norway', IS: 'Iceland', TR: 'Türkiye', MK: 'North Macedonia', RS: 'Serbia',
  UA: 'Ukraine', ME: 'Montenegro', AL: 'Albania', GE: 'Georgia', MD: 'Moldova', AD: 'Andorra', SM: 'San Marino',
}

// ISO 6346 letter values: A=10 upwards, skipping multiples of 11 (11, 22, 33).
export function mrnCharValue(char) {
  if (/^[0-9]$/.test(char)) return Number(char)
  if (!/^[A-Z]$/.test(char)) return null
  let value = 10
  for (let code = 65; code <= char.charCodeAt(0); code += 1) {
    if (value % 11 === 0) value += 1
    if (code === char.charCodeAt(0)) return value
    value += 1
  }
  return null
}

export function mrnCheckDigit(first17) {
  const body = String(first17).toUpperCase()
  if (body.length !== 17) throw new Error('The check digit is calculated over the first 17 characters')
  let total = 0
  for (let index = 0; index < 17; index += 1) {
    const value = mrnCharValue(body[index])
    if (value === null) return null
    total += value * 2 ** index
  }
  const remainder = total % 11
  return remainder === 10 ? '0' : String(remainder)
}

export function normaliseMrn(input) {
  return String(input || '').toUpperCase().replace(/[\s\-.\/_]/g, '')
}

// "Where it is used" text, by procedure letter (MRN smoke test 16 Oct 2026: the text must
// match the decoded letter, so C never talks about entry summary declarations).
// Sources: GOV.UK "Create a goods movement reference" (updated 9 June 2026); GOV.UK
// "Safety and security declarations" manual, exit summary section (updated 31 January 2025);
// Annex B of Implementing Regulation (EU) 2015/2447 for the letter meanings.
const UK_USE = {
  A: 'Export declaration MRN from the Customs Declaration Service (CDS). The exit results go back to the declarant, and the export evidence supports zero-rating for VAT.',
  B: 'Combined export declaration MRN from CDS: one MRN covers the export declaration and its safety and security (exit summary) data. The exit results go back to the declarant, and the export evidence supports zero-rating for VAT.',
  C: 'Standalone exit summary declaration MRN: safety and security data for goods leaving, lodged in CDS when no combined export declaration covers them (for example goods in temporary storage for more than 14 days, or goods under transit). The carrier is responsible for it, and for GB to EU crossings it goes into the GMR.',
  D: 'Re-export notification MRN: used when non-UK goods held in temporary storage or a free zone leave the customs territory again without an export declaration.',
  E: 'Dispatch MRN for goods sent to a special fiscal territory, which sits inside the customs territory but outside the VAT area.',
  J: 'Transit MRN from the New Computerised Transit System (NCTS). The office of departure issues it, the transit accompanying document carries it, and a GVMS crossing needs it in the GMR.',
  K: 'Transit MRN from NCTS that also carries the exit summary (safety and security) data for goods leaving. The transit accompanying document carries it, and a GVMS crossing needs it in the GMR.',
  L: 'Transit MRN from NCTS that also carries the entry summary (safety and security) data for goods arriving. The transit accompanying document carries it, and a GVMS crossing needs it in the GMR.',
  M: 'Transit MRN from NCTS that also carries both the exit summary and the entry summary (safety and security) data. The transit accompanying document carries it, and a GVMS crossing needs it in the GMR.',
  P: 'Proof of customs status or customs goods manifest MRN. It shows the customs status of the goods; it is not an import or export declaration.',
  R: 'Import declaration MRN from the Customs Declaration Service (CDS). The declarant’s CDS software receives its status; the importer needs it for duty, postponed VAT statements and any repayment claim.',
  S: 'Combined import declaration MRN from CDS: one MRN covers the import declaration and its entry summary (safety and security) data. The importer needs it for duty, postponed VAT statements and any repayment claim, and it goes into the GMR for the crossing.',
  T: 'Entry summary declaration (ENS) MRN: safety and security data for goods arriving. Entry summary declarations for GB go through the UK safety and security service, and the MRN can be added to a GMR (it is required for GB to Northern Ireland).',
  U: 'Temporary storage MRN, used to link goods held in temporary storage to the declaration that follows.',
  V: 'Introduction MRN for goods arriving from a special fiscal territory, which sits inside the customs territory but outside the VAT area.',
  W: 'Temporary storage MRN that also carries the entry summary (safety and security) data, linking the goods in temporary storage to the declaration that follows.',
  Z: 'Arrival notification MRN: tells customs that the means of transport carrying the goods has arrived.',
}

const OTHER_USE = {
  export: 'Export MRN from the national export system of the country shown in characters 3–4. For MRNs issued in the EU, the European Commission runs a public MRN follow-up page.',
  exit: 'Exit summary declaration MRN: safety and security data for goods leaving, issued by the export control system of the country shown in characters 3–4.',
  transit: 'Transit MRN from NCTS in the country of departure. For MRNs issued in the EU, the European Commission runs a public MRN follow-up page.',
  import: 'Import declaration MRN from the national import system of the country shown in characters 3–4.',
  entry: 'Entry summary or arrival MRN: safety and security data for goods arriving, issued by the import control system of the country shown in characters 3–4.',
  storage: 'Temporary storage MRN from the country shown in characters 3–4, used to link goods held in temporary storage to the declaration that follows.',
  status: 'Proof of customs status or customs goods manifest MRN from the country shown in characters 3–4.',
}

export function mrnTracking(country, family, procedure) {
  if (family === 'legacy') return 'An older-format MRN. Characters 5–17 form the unique reference, and the check digit still follows ISO 6346. Check the declaration or movement it belongs to in the system that issued it.'
  const uk = country === 'GB' || country === 'XI'
  if (uk && UK_USE[procedure]) return UK_USE[procedure]
  return OTHER_USE[family] || 'Check the declaration or movement it belongs to in the system that issued it.'
}

// Where to see the status (intent review §4.1: "Track an MRN").
// Sources: GOV.UK "Upload documents and get messages for the Customs Declaration Service"
// (updated 2 December 2024); GOV.UK "Check if a goods movement reference is valid";
// European Commission MRN follow-up.
export function mrnStatusService(country, family) {
  const uk = country === 'GB' || country === 'XI'
  if (family === 'transit') return uk
    ? 'Track it: the holder of the transit procedure sees the status in NCTS. For a lorry crossing, the GMR in GVMS shows whether the goods must report for an inspection.'
    : 'Track it: the European Commission MRN follow-up page shows transit movements issued in the EU.'
  if (!uk && family === 'export') return 'Track it: the European Commission MRN follow-up page shows export movements issued in the EU.'
  if (uk && (family === 'import' || family === 'export' || family === 'exit' || family === 'entry' || family === 'storage')) {
    return 'Track it: the declarant sees the status in their CDS software. HMRC messages about the declaration arrive in the CDS inbox, where you sign in with your Government Gateway ID and the MRN.'
  }
  return 'Track it in the customs system that issued it.'
}

export const MRN_NEXT_STEP = 'This MRN will fail the check. Get the correct number from whoever raised the declaration.'

export function decodeMrn(input, { now = new Date() } = {}) {
  const normalised = normaliseMrn(input)
  const errors = []
  const result = { input: String(input || ''), normalised, valid: false, errors, parts: null, suggestion: null }
  if (!normalised) {
    errors.push('Enter an MRN. It has 18 characters, for example 21GB1NEXFX6SU9C4R1.')
    return result
  }
  if (normalised.length !== 18) {
    errors.push(`An MRN has 18 characters. This one has ${normalised.length}.`)
  }
  if (/[^A-Z0-9]/.test(normalised)) errors.push('An MRN uses only the letters A–Z and the digits 0–9.')
  if (/^GMR/.test(normalised)) errors.push('This looks like a goods movement reference (GMR), not an MRN. Use the GMR checker.')
  if (errors.length) return result

  const year = normalised.slice(0, 2)
  const country = normalised.slice(2, 4)
  const unique = normalised.slice(4, 16)
  const procedure = normalised[16]
  const checkDigit = normalised[17]
  if (!/^[0-9]{2}$/.test(year)) errors.push('Characters 1–2 must be the last two digits of the year the declaration was accepted.')
  if (!/^[A-Z]{2}$/.test(country)) errors.push('Characters 3–4 must be a two-letter country code, such as GB or XI.')
  const legacy = /^[0-9]$/.test(procedure)
  const procedureInfo = legacy
    ? { label: 'No procedure letter: an older MRN format', family: 'legacy' }
    : MRN_PROCEDURES[procedure]
  if (!procedureInfo) errors.push(`Character 17 is “${procedure}”. It must be a procedure letter: ${Object.keys(MRN_PROCEDURES).join(', ')}.`)
  const expected = mrnCheckDigit(normalised.slice(0, 17))
  if (expected !== null && expected !== checkDigit) {
    errors.push(`The check digit (character 18) is “${checkDigit}”. For the first 17 characters it must be “${expected}”. One character was probably mistyped, in any of the 18. Check lookalikes first: O/0, I/1, S/5, B/8.`)
  }

  const yearFull = 2000 + Number(year)
  const currentYear = now.getUTCFullYear()
  const warnings = []
  if (/^[0-9]{2}$/.test(year) && yearFull > currentYear) warnings.push(`The year reads as ${yearFull}, which is in the future. Check characters 1–2.`)
  if (/O/.test(unique)) warnings.push('The unique part contains the letter O. If the source shows a zero, retype it as 0.')

  result.parts = {
    year,
    yearFull,
    country,
    countryName: MRN_COUNTRIES[country] || null,
    unique,
    officePrefix: unique.slice(0, 6),
    procedure,
    procedureLabel: procedureInfo ? procedureInfo.label : null,
    family: procedureInfo ? procedureInfo.family : null,
    checkDigit,
    expectedCheckDigit: expected,
    tracking: procedureInfo ? mrnTracking(country, procedureInfo.family, procedure) : null,
    status: procedureInfo ? mrnStatusService(country, procedureInfo.family) : null,
  }
  result.warnings = warnings
  result.valid = errors.length === 0
  if (!result.valid && expected !== null && procedureInfo && /^[0-9]{2}[A-Z]{2}/.test(normalised)) {
    result.suggestion = normalised.slice(0, 17) + expected
  }
  return result
}

// Finds every MRN-shaped token in free text (used by the PVA reconciler).
export function findMrns(text) {
  return [...String(text || '').toUpperCase().matchAll(/\b[0-9]{2}[A-Z]{2}[A-Z0-9]{14}\b/g)].map((match) => match[0])
}

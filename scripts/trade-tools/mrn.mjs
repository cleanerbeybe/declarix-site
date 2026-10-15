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

function mrnTracking(country, family) {
  const uk = country === 'GB' || country === 'XI'
  if (family === 'transit') {
    return uk
      ? 'Transit MRN from the New Computerised Transit System (NCTS). The office of departure issues it; the transit accompanying document carries it, and a GVMS crossing needs it in the GMR.'
      : 'Transit MRN from NCTS in the country of departure. For EU MRNs, the European Commission runs a public MRN follow-up page.'
  }
  if (family === 'import') {
    return uk
      ? 'Import declaration MRN from the Customs Declaration Service (CDS). The declarant’s CDS software receives its status; the importer needs it for duty, postponed VAT statements and any repayment claim.'
      : 'Import declaration MRN from the national import system of the country shown in characters 3–4.'
  }
  if (family === 'export') {
    return uk
      ? 'Export declaration MRN from CDS. Exit results return to the declarant, and the export evidence supports zero-rating for VAT.'
      : 'Export MRN from the national export system of the country shown in characters 3–4.'
  }
  if (family === 'entry' || family === 'exit') {
    return uk
      ? 'Safety and security MRN. Entry summary declarations for GB go through the UK safety and security service, and the MRN can be added to a GMR.'
      : 'Safety and security MRN issued by the import control or export system of the country shown.'
  }
  if (family === 'legacy') return 'An older-format MRN. Characters 5–17 form the unique reference, and the check digit still follows ISO 6346. Check the declaration or movement it belongs to in the system that issued it.'
  if (family === 'storage') return 'Temporary storage MRN, used to link goods held in temporary storage to the declaration that follows.'
  return 'Proof of status or customs goods manifest MRN.'
}

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
    errors.push(`The check digit (character 18) is “${checkDigit}”. For the first 17 characters it must be “${expected}”. One character was probably mistyped.`)
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
    tracking: procedureInfo ? mrnTracking(country, procedureInfo.family) : null,
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

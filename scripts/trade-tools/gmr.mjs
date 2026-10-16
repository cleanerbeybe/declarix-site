// Goods movement reference (GMR) format check and GVMS reference planner.
// Format: HMRC Goods Movement System Haulier API v1.0, gmrId pattern ^GMR[A-Z][0-9A-Z]{8}$
// (examples in the spec: GMRA000002JR, GMRB00000A9C). References per direction:
// GOV.UK "Create a goods movement reference" (updated 9 June 2026). Exit summary rules:
// GOV.UK "Safety and security declarations" manual, exit summary declarations section
// (updated 31 January 2025, checked 16 October 2026): most exports are covered by a combined
// export declaration; a standalone exit summary declaration is needed for goods not covered by
// one (for example temporary storage over 14 days) and for goods moved under transit;
// ATA carnets and empty vehicles are exempt.
// Self-contained: the page script inlines this file.

export const GMR_PATTERN = /^GMR[A-Z][0-9A-Z]{8}$/

export function normaliseGmr(input) {
  return String(input || '').toUpperCase().replace(/[\s\-.\/_]/g, '')
}

export function checkGmr(input) {
  const normalised = normaliseGmr(input)
  const errors = []
  const hints = []
  if (!normalised) {
    errors.push('Enter a GMR. It has 12 characters and starts with GMR, for example GMRA000002JR.')
    return { input: String(input || ''), normalised, valid: false, errors, hints }
  }
  if (/[^A-Z0-9]/.test(normalised)) errors.push('A GMR uses only the letters A–Z and the digits 0–9.')
  if (!normalised.startsWith('GMR')) {
    if (/^[0-9]{2}[A-Z]{2}[A-Z0-9]{14}$/.test(normalised)) {
      hints.push('This looks like an MRN (18 characters, year + country). Check it with the MRN checker, then add it to the GMR.')
    } else if (/^[0-9][A-Z]{2}[0-9]{12}/.test(normalised)) {
      hints.push('This looks like a DUCR (Declaration Unique Consignment Reference). A DUCR goes inside a GMR for exports; it is not the GMR itself.')
    }
    errors.push('A GMR starts with the letters GMR.')
  }
  if (normalised.length !== 12) errors.push(`A GMR has 12 characters. This one has ${normalised.length}.`)
  if (normalised.startsWith('GMR') && normalised.length >= 4 && !/[A-Z]/.test(normalised[3])) {
    errors.push(`Character 4 must be a letter. It is “${normalised[3]}”.`)
  }
  if (normalised.startsWith('GMR') && normalised.length === 12 && /O/.test(normalised.slice(4))) {
    hints.push('The last 8 characters contain the letter O. If the GVMS screen shows a zero, retype it as 0.')
  }
  const valid = errors.length === 0 && GMR_PATTERN.test(normalised)
  return {
    input: String(input || ''),
    normalised,
    valid,
    errors,
    hints,
    parts: valid ? { prefix: 'GMR', series: normalised[3], sequence: normalised.slice(4) } : null,
  }
}

export const GMR_DIRECTIONS = {
  eu_gb: 'EU to Great Britain',
  gb_eu: 'Great Britain to the EU',
  gb_ni: 'Great Britain to Northern Ireland',
  ni_gb: 'Northern Ireland to Great Britain',
}

// Returns the references GVMS will ask for, in the order a desk should collect them.
// Short labels for one line per consignment (GM3) and for the ready-to-send message (GM4).
export const GMR_SHORT = {
  eu_gb: 'EU → GB',
  gb_eu: 'GB → EU',
  gb_ni: 'GB → NI',
  ni_gb: 'NI → GB',
}

export function gmrReferences({ direction, accompanied = true, transit = false, carnet = false, eidr = false, oralOrEmpty = false, standaloneExs = false, consignments = 1 } = {}) {
  if (!GMR_DIRECTIONS[direction]) throw new Error('Unknown direction')
  const count = Math.min(Math.max(Math.round(Number(consignments) || 1), 1), 50)
  const list = []
  // `slot` names the reference to collect once per consignment; `status` resolves a
  // conditional reference to needed / not needed from the answers (GM2).
  const add = (reference, detail, extra = {}) => list.push({ reference, detail, ...extra, slots: extra.slot ? Array.from({ length: count }, (_, index) => `Consignment ${index + 1}: ${extra.slot}`) : [] })
  add(
    accompanied ? 'Vehicle registration number' : 'Trailer number or container reference',
    accompanied ? 'Accompanied movement: the registration of the vehicle that reaches the carrier.' : 'Unaccompanied movement: the trailer or container identifier that reaches the carrier.',
  )
  if (oralOrEmpty) {
    add('“Oral or by conduct” or “empty” option', 'Select this option in GVMS instead of declaration references. Use it only for goods that qualify, and check the carrier accepts it.')
    return list
  }
  if (carnet) add('ATA, eATA or TIR carnet reference', 'Paper ATA or TIR carnets travel with the goods; an eATA carnet barcode must be presented. Add the reference before you reach the port.', { slot: 'carnet reference' })
  if (transit) {
    add('Transit MRN from NCTS', 'Every Common Transit Convention movement needs the NCTS transit MRN. If NCTS is down at departure, record the offline transit accompanying document under Manual Transit Procedure.', { slot: 'transit MRN' })
    if (direction === 'eu_gb' || direction === 'gb_ni') {
      add('Do not add import declaration references', 'GOV.UK: you must not include associated import declaration references in a GMR for goods moving under the Common Transit Convention.')
    }
    if (direction === 'gb_eu') {
      add('DUCRs or the transit accompanying document MRN', 'Include all DUCRs, unless an authorised consignor meets the criteria to use the transit accompanying document MRN.', { slot: 'DUCR' })
      add('Exit summary declaration MRN', 'Needed: goods moved under transit need a standalone exit summary declaration, lodged in CDS by the carrier. Not needed if you add a DUCR for all the goods in the transit movement.', { status: 'needed', slot: 'exit summary MRN (or DUCR for all the goods)' })
    }
    if (direction === 'ni_gb') add('Safety and security export summary declaration MRN', 'Needed for goods moving under transit with a TAD, TSAD or TIR carnet.')
    return list
  }
  if (direction === 'eu_gb') {
    add('Import MRN from CDS', 'One import Movement Reference Number for each declaration on the vehicle. Check each one with the MRN checker first.', { slot: 'import MRN' })
    if (eidr) add('EORI of the authorised trader', 'For goods declared in the trader’s own records (EIDR) instead of an import MRN.')
    add('Entry summary declaration MRN (optional)', 'Optional: you can add the safety and security MRN. It is not mandatory for this direction.', { status: 'optional' })
  }
  if (direction === 'gb_ni') {
    add('Import MRN from CDS', 'One import MRN for each declaration on the vehicle.', { slot: 'import MRN' })
    if (eidr) add('EORI of the authorised trader', 'For goods declared in the trader’s own records.')
    add('Entry summary declaration MRN', 'Needed: required for GB to NI. With the ENS and import MRN in the GMR, GVMS submits the arrival and presentation notifications for you.', { status: 'needed', slot: 'entry summary MRN' })
  }
  if (direction === 'ni_gb') {
    add('DUCR for the combined export declaration', 'The Declaration Unique Consignment Reference declared into CDS, where the combined customs and safety and security export declaration applies.', { slot: 'DUCR' })
    add('Export Accompanying Document', 'For an indirect export from Northern Ireland to Great Britain declared in Ireland.')
  }
  if (direction === 'gb_eu') {
    add('DUCR for every export declaration', 'All combined customs and safety and security export declarations declared into CDS. You can upload several.', { slot: 'DUCR' })
    if (carnet) {
      add('Exit summary declaration MRN', 'Not needed: goods covered by an ATA carnet do not need a standalone exit summary declaration.', { status: 'not_needed' })
    } else if (standaloneExs) {
      add('Exit summary declaration MRN', 'Needed for the goods that no combined export declaration covers (for example goods in temporary storage for more than 14 days). The carrier lodges it in CDS: the haulier for accompanied RoRo, the ferry operator for unaccompanied trailers.', { status: 'needed', slot: 'exit summary MRN, if this consignment has no combined export declaration' })
    } else {
      add('Exit summary declaration MRN', 'Not needed: your combined export declarations in CDS already include the safety and security data.', { status: 'not_needed' })
    }
  }
  return list
}

// GM4: a short checklist to paste into WhatsApp or a text message.
export function gmrMessage(options, list) {
  const count = Math.min(Math.max(Math.round(Number(options.consignments) || 1), 1), 50)
  const lines = [`GMR checklist · ${GMR_SHORT[options.direction]} · ${count} consignment${count === 1 ? '' : 's'}`, 'References for the GMR:']
  for (const item of list) {
    if (item.status === 'not_needed') { lines.push(`- ${item.reference}: not needed`); continue }
    if (item.status === 'optional') { lines.push(`- ${item.reference}`); continue }
    if (item.slots.length) item.slots.forEach((slot) => lines.push(`- ${slot}`))
    else lines.push(`- ${item.reference}`)
  }
  lines.push('Create the GMR in GVMS before the vehicle reaches the port, then send the GMR back.')
  return lines.join('\n')
}

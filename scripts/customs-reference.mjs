// Customs reference finders: P43 procedure codes, P42 document codes, P41 CDS error codes.
// Every table row comes from a dated HMRC source record in scripts/reference-data/*.json
// (refresh with scripts/reference-data/refresh-reference-data.mjs). Nothing here is loaded by client JavaScript:
// the full registers render into the server HTML and the inline script only filters rows that are already there.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { referenceHub, referenceLinkStrip } from './customs-reference-links.mjs'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), 'reference-data')
const load = (name) => JSON.parse(readFileSync(join(dataDir, name), 'utf8'))

export const procedureData = load('cds-procedure-codes.json')
export const documentData = load('cds-document-codes.json')
export const errorData = load('cds-error-codes.json')

const REVIEWED_ON = '2026-10-15'
const CHECKED_LABEL = '15 OCTOBER 2026'
const PACK_CHECK = '/tools/customs-document-pack-check/'
const VALUE_TOOL = '/tools/customs-value-import-duty-vat-calculator/'

// ---------- Source record model ----------
// Every record exposes: code, title (HMRC wording), meaning (plain English), source_url, checked_on.
export function sourceRecord({ code, title, meaning, source_url, checked_on, ...rest }) {
  if (!code || !title || !source_url || !checked_on) throw new Error(`Incomplete source record: ${code || '(no code)'}`)
  if (!/^https:\/\/(www\.gov\.uk|assets\.publishing\.service\.gov\.uk)\//.test(source_url)) {
    throw new Error(`Source record ${code} must cite GOV.UK: ${source_url}`)
  }
  return { code, title, meaning: meaning || title, source_url, checked_on, ...rest }
}

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const paragraphs = (value) =>
  escapeHtml(value)
    .split(/\n{2,}/)
    .map((block) => block.replaceAll('\n', '<br/>'))
    .join('<br/><br/>')

const source = (title, url, updated) => ({ title, publisher: 'HM Revenue & Customs · GOV.UK', url, checked: CHECKED_LABEL, updated })

// ---------- P43 procedure codes ----------
const seriesMeaning = {
  Import: {
    '01': 'Release to free circulation where the goods move straight on to another customs union territory (onward dispatch).',
    '07': 'Release to free circulation with the goods going straight into an excise warehouse, so excise duty stays suspended.',
    '40': 'The standard import: goods enter free circulation and duty and import VAT are accounted for unless a relief applies.',
    '42': 'Release to free circulation with onward supply to an EU member state under Onward Supply Relief.',
    '44': 'Release to free circulation with duty relief under Authorised Use (End Use in Northern Ireland) for goods put to a prescribed use.',
    '51': 'Inward processing: goods come in for processing or repair with import duty suspended while under the procedure.',
    '53': 'Temporary admission: goods come in for a limited time and leave again, with full or partial relief from import duty.',
    '61': 'Re-import into free circulation of goods that left earlier, including returned goods relief and return after outward processing.',
    '71': 'Customs warehousing: goods are stored with import duty and import VAT suspended until they leave the warehouse.',
    '78': 'Free zone or freeport: goods enter a designated customs zone with duty suspended.',
  },
  Export: {
    '10': 'Permanent export or dispatch of goods out of the UK.',
    '11': 'Inward processing prior export equivalence: processed goods leave before the matching imported goods arrive.',
    '21': 'Temporary export for outward processing: goods leave for processing or repair and return with relief.',
    '22': 'Temporary export or dispatch under outward processing where procedure 21 does not cover the goods.',
    '23': 'Temporary export of goods meant to come back unaltered, under returned goods relief.',
    '31': 'Re-export of non-UK goods after a special procedure such as inward processing, temporary admission or customs warehousing.',
  },
}

const previousMeaning = {
  '00': 'no previous procedure',
  '07': 'excise warehouse',
  '10': 'previously permanently exported',
  '11': 'IP prior export equivalence',
  '21': 'outward processing',
  '22': 'outward processing not covered by 21',
  '23': 'returned goods relief',
  '31': 'previously exported IP goods',
  '40': 'free circulation',
  '42': 'onward supply relief',
  '44': 'authorised use / end use',
  '51': 'inward processing',
  '53': 'temporary admission',
  '54': 'IP in another member state',
  '71': 'customs warehousing',
  '78': 'free zone / freeport',
}

const commonCpcs = [
  ['Import', '4000', '000', 'The everyday import', 'Commercial goods released to free circulation with duty and import VAT due and no special relief.'],
  ['Import', '4000', 'C07', 'Negligible-value consignment relief', 'A GB import claiming the duty relief for consignments of negligible value. HMRC notes C07 is no longer used on H1 declarations for Northern Ireland.'],
  ['Import', '4000', '1RV', 'Free circulation with a VAT relief claim', 'Goods released to free circulation where a VAT exemption is claimed under the APC conditions.'],
  ['Import', '4071', '000', 'Out of a customs warehouse', 'Goods leaving a customs warehouse and entering free circulation, with the suspended charges now due.'],
  ['Import', '4051', '000', 'Out of inward processing', 'Goods or processed products from inward processing released to the UK market instead of being re-exported.'],
  ['Import', '4400', '000', 'Authorised use relief', 'Goods released to free circulation with duty relief because they will be put to a prescribed use under an authorisation.'],
  ['Import', '5100', '000', 'Entry to inward processing', 'Goods imported for processing or repair with import duty suspended under an IP authorisation.'],
  ['Import', '5300', 'D23', 'Temporary admission for an event', 'Goods brought in for an exhibition, fair or similar event and taken out again afterwards.'],
  ['Import', '5300', 'D12', 'Temporary admission of professional equipment', 'Tools and kit a non-UK business brings in to do a job, then takes away.'],
  ['Import', '6123', 'F01', 'Returned goods relief', 'UK goods that went out temporarily and come back unaltered, with relief from import duty.'],
  ['Import', '6121', '000', 'Re-import after outward processing', 'Goods coming back after processing or repair abroad under an outward processing authorisation.'],
  ['Import', '7100', '000', 'Entry to a customs warehouse', 'Goods placed in a customs warehouse with duty and import VAT suspended.'],
  ['Import', '7800', '000', 'Entry to a free zone or freeport', 'Goods entering a freeport customs site with duty suspended.'],
  ['Export', '1040', '000', 'The everyday export', 'Permanent export of UK goods or goods in free circulation.'],
  ['Export', '1040', '3LV', 'Low-value export to one recipient', 'Permanent export of a low-value consignment to a single recipient.'],
  ['Export', '1007', '000', 'Export from an excise warehouse', 'Permanent export of goods held in an excise warehouse.'],
  ['Export', '2100', '000', 'Temporary export for outward processing', 'Goods sent abroad for processing or repair that will come back under outward processing.'],
  ['Export', '2300', '000', 'Temporary export to come back unaltered', 'UK goods going out for a trade show, demonstration or similar use and returning under returned goods relief.'],
  ['Export', '3151', '000', 'Re-export after inward processing', 'Processed products or imported goods leaving to discharge an inward processing procedure.'],
  ['Export', '3153', 'D23', 'Re-export after temporary admission', 'Event goods leaving after temporary admission, closing the TA procedure.'],
  ['Export', '3171', '000', 'Re-export from a customs warehouse', 'Non-UK goods leaving a customs warehouse for a destination outside the UK.'],
]

const procedureExamples = [
  {
    title: 'A Leicester importer clears a container of furniture from Vietnam',
    steps: [
      ['Requested procedure', '40 · release to free circulation. The furniture is going on sale in the UK.'],
      ['Previous procedure', '00 · the goods were not under any customs procedure before.'],
      ['Additional procedure', '000 · no relief, suspension or special treatment applies.'],
      ['Result', 'DE 1/10 = 4000, DE 1/11 = 000. Written as one CPC, that is 4000000. It sits in declaration category H1.'],
    ],
    combo: ['Import', '4000', '000'],
  },
  {
    title: 'A US exhibitor brings a trade-show stand to Birmingham for six weeks',
    steps: [
      ['Requested procedure', '53 · temporary admission. The stand leaves the UK after the show.'],
      ['Previous procedure', '00 · it arrives straight from outside the UK.'],
      ['Additional procedure', 'D23 · goods for events or for sale.'],
      ['Result', 'DE 1/10 = 5300, DE 1/11 = D23, declaration category H3. When the stand leaves, the re-export uses 3153 with D23, so the previous procedure digits (53) close the loop.'],
    ],
    combo: ['Import', '5300', 'D23'],
  },
  {
    title: 'A Sheffield toolmaker sends a press to Germany for repair and brings it back',
    steps: [
      ['Out', 'Export declaration with DE 1/10 = 2100 (temporary export under outward processing) and DE 1/11 = 000, category B2.'],
      ['Back', 'Import declaration with DE 1/10 = 6121 (re-import after outward processing) and DE 1/11 = 000.'],
      ['Why the digits matter', 'The previous procedure digits 21 on the import tell CDS the press left under outward processing.'],
    ],
    combo: ['Import', '6121', '000'],
  },
  {
    title: 'A Felixstowe customs warehouse releases a pallet of trainers to a UK retailer',
    steps: [
      ['Requested procedure', '40 · release to free circulation for sale in the UK.'],
      ['Previous procedure', '71 · the trainers are coming out of customs warehousing.'],
      ['Additional procedure', '000 · no further treatment applies.'],
      ['Result', 'DE 1/10 = 4071, DE 1/11 = 000. Use the 4071 completion notes for the warehouse authorisation and previous document entries.'],
    ],
    combo: ['Import', '4071', '000'],
  },
]

function validCombo(direction, procedure, additional) {
  return (procedureData.matrix[direction]?.[procedure] || []).includes(additional)
}

for (const [direction, procedure, additional, label] of commonCpcs) {
  if (!validCombo(direction, procedure, additional)) throw new Error(`Common CPC ${procedure} ${additional} (${label}) is not in HMRC's ${direction} correlation matrix`)
}
for (const example of procedureExamples) {
  if (!validCombo(...example.combo)) throw new Error(`Procedure example combination is not in HMRC's correlation matrix: ${example.combo.join(' ')}`)
}

export const procedureRecords = procedureData.records.map((record) =>
  sourceRecord({
    ...record,
    meaning: `${seriesMeaning[record.direction]?.[record.requested_procedure] || record.series_heading} Previous procedure: ${previousMeaning[record.previous_procedure] || record.previous_procedure}.`,
  }),
)
export const additionalRecords = procedureData.additional.map((record) =>
  sourceRecord({
    ...record,
    meaning: `${record.family} additional procedure code for ${record.direction.toLowerCase()} declarations.`,
    pairs: Object.entries(procedureData.matrix[record.direction] || {})
      .filter(([, apcs]) => apcs.includes(record.code))
      .map(([procedure]) => procedure),
  }),
)

// ---------- P42 document codes ----------
const documentFamilies = {
  C: 'Authorisations, certificates and licences',
  N: 'Commercial, transport and health documents',
  U: 'Origin and preference evidence',
  Y: 'Statements that a control does not apply',
  X: 'Export licences and authorisations',
  L: 'Import licences and certificates',
  A: 'Certificates of authenticity and quality',
  D: 'Anti-dumping and countervailing documents',
  E: 'Export licences and certificates',
  '9': 'UK national codes',
  '1': 'UK national codes',
}
const documentFamily = (record) => (record.family === 'National' ? 'UK national codes' : documentFamilies[record.code[0]] || 'Other Union codes')

const commonDocuments = [
  ['N935', 'The invoice behind the customs value', 'Declare it on imports with the invoice reference and status AC, the exact example HMRC gives in its status-code guidance.', 'CDS77000 if the identifier is missing; CDS77002 if the status code is missing.'],
  ['N380', 'Commercial invoice', 'A commercial invoice used as a supporting document, for example when a measure or procedure asks for it.', 'CDS71200 if the same code and identifier repeat on one goods item.'],
  ['N325', 'Proforma invoice', 'Supports goods with no commercial sale invoice, for example free-of-charge or replacement goods.', 'CDS77000 if the document identifier is missing.'],
  ['N705', 'Bill of lading', 'The sea transport document. The identifier and reason are conditional, so read the completion rule for the movement.', 'CDS12068 when a combination needs a document identifier that was left blank.'],
  ['N740', 'Air waybill', 'The air transport document for the consignment.', 'CDS77000 if the identifier is missing.'],
  ['N741', 'Master air waybill', 'The master air waybill for consolidated air freight.', 'CDS71200 for duplicated identifiers on one item.'],
  ['N271', 'Packing list or goods manifest', 'Packing list or manifest where it is not on an electronic inventory. Some APCs make N271 mandatory.', 'CDS12115 when the procedure code mandates a document that is missing.'],
  ['N853', 'CHED-P health entry document', 'Common Health Entry Document for products of animal origin.', 'CDS40045 when a tariff measure needs the document and it is missing.'],
  ['C085', 'CHED-PP health entry document', 'Common Health Entry Document for plants and plant products.', 'CDS40045 when the measure condition is not met.'],
  ['C501', 'AEO customs simplifications authorisation', 'Quotes the AEOC authorisation of the declarant or holder.', 'CDS12007 if the authorisation number is expired or not recognised.'],
  ['C505', 'Comprehensive guarantee (CGU) authorisation', 'HMRC lists two versions: where a comprehensive guarantee is required, and where it is not (including deferment accounts).', 'CDS12113 when the CGU needs a guarantee type in DE 8/2.'],
  ['C506', 'Deferment of payment (DPO) authorisation', 'Quotes the duty deferment approval number. HMRC pairs it with a deferred payment method.', 'CDS12148 when C506 is declared without a deferred payment method.'],
  ['C512', 'Simplified declaration (SDE) authorisation', 'Authorisation to use the simplified declaration procedure.', 'CDS12120 when the declaration type needs an authorisation that is missing.'],
  ['C514', 'Entry in declarant’s records (EIR) authorisation', 'Authorisation for declarations made through an entry in the declarant’s records.', 'CDS12120 when the declaration type needs an authorisation that is missing.'],
  ['C516', 'Temporary admission authorisation', 'TEA authorisation for goods under temporary admission.', 'CDS12096 when the authorisation type needs a specific document.'],
  ['C601', 'Inward processing authorisation', 'IPO authorisation for goods under inward processing.', 'CDS12115 when the procedure code mandates the authorisation document.'],
  ['U110', 'Statement on origin', 'The origin statement for a preference claim. HMRC directs EU preference claims to U116 instead.', 'CDS40045 or CDS40066 when the preference measure condition is not met.'],
  ['U112', 'Importer’s knowledge', 'Preference claim based on importer’s knowledge. HMRC directs EU preference claims to U117 instead.', 'CDS40066 when the tariff condition is not fulfilled.'],
  ['U116', 'Statement on origin under the EU-UK TCA', 'The EU-UK Trade and Cooperation Agreement statement on origin.', 'CDS40066 when the tariff condition is not fulfilled.'],
  ['9WKS', 'Valuation worksheet', 'A worksheet supporting the customs value calculation, for example method 4 without SIV or SPV.', 'CDS77000 if the identifier is missing.'],
  ['1207', 'Authority to use the importer’s deferment account', 'Gives the agent specific authority to use the importer’s duty deferment account (form C1207S details).', 'CDS12125 when the deferment account or authority is not recognised.'],
  ['Y923', 'Product not considered as waste', 'A statement that a waste control does not apply to the goods.', 'CDS40044 when the document is not allowed for the commodity code.'],
]

export const documentRecords = documentData.records.map((record) =>
  sourceRecord({
    ...record,
    meaning: `${record.direction === 'Both' ? 'Import and export' : record.direction} · ${documentFamily(record)}.`,
    group: documentFamily(record),
  }),
)
for (const [code] of commonDocuments) {
  if (!documentRecords.some((record) => record.code === code)) throw new Error(`Common document code ${code} is not in HMRC Appendix 5A`)
}

// ---------- P41 error codes ----------
const errorFamilies = [
  ['CDS100', 'Obligation, format and domain errors', 'A data element is missing, not allowed, in the wrong format or holds a value CDS does not accept.', 'Open the data element in the pointer and compare it with the completion rule for the declaration category.'],
  ['CDS110', 'Item and procedure relation errors', 'Counts, procedure codes and amendment rules do not line up across the declaration.', 'Check DE 1/9, DE 1/10, DE 1/11 and the declaration type against the correlation matrix.'],
  ['CDS120', 'Relation, authorisation and sequence errors', 'Two or more data elements conflict, an authorisation or account is not recognised, or a message arrived out of order.', 'Read every AddInfo line: it names the second data element or the authorisation CDS expected.'],
  ['CDS125', 'Value limits', 'A value exceeds the limit allowed for the procedure or relief.', 'Check the limit for the relief in the Tariff Volume 3 instructions.'],
  ['CDS130', 'Credibility checks', 'A value looks too high or too low for the goods or quota.', 'Re-check unit price, quantity, net mass and supplementary units for a keying or decimal slip.'],
  ['CDS199', 'Multiple errors', 'More errors were found than one message lists.', 'Fix the errors returned, then resubmit to see any that remain.'],
  ['CDS200', 'Related movement errors', 'CDS cannot find or match the related movement.', 'Match the movement reference and goods arrival details to the declaration.'],
  ['CDS400', 'Tariff measure errors', 'The commodity code’s measures need a document, code or condition that the declaration does not satisfy.', 'Look up the commodity code’s measures and conditions in the online tariff for the date of import.'],
  ['CDS499', 'Other errors', 'An error not covered by a specific code.', 'Read the description and AddInfo text, then contact the CDS service desk if the cause is not clear.'],
  ['CDS500', 'Inventory linking and movement errors', 'The consignment reference, goods location or movement message failed a check.', 'Check the DUCR or MUCR format, the goods location code and the consolidation.'],
  ['CDS707', 'Licence errors', 'An electronic licence is missing, invalid, used up or does not match the goods or parties.', 'Check the licence reference, status code, owner, country and remaining quantity.'],
  ['CDS770', 'Document obligation errors', 'A DE 2/3 document needs an identifier, status code, quantity or waiver reason.', 'Complete every component the Appendix 5A row marks as mandatory.'],
]
const errorFamily = (code) => {
  const number = Number(code.slice(3))
  if (number < 11000) return errorFamilies[0]
  if (number < 12000) return errorFamilies[1]
  if (number < 12500) return errorFamilies[2]
  if (number < 13000) return errorFamilies[3]
  if (number < 19999) return errorFamilies[4]
  if (number < 20000) return errorFamilies[5]
  if (number < 40000) return errorFamilies[6]
  if (number < 49999) return errorFamilies[7]
  if (number < 50000) return errorFamilies[8]
  if (number < 70000) return errorFamilies[9]
  if (number < 77000) return errorFamilies[10]
  return errorFamilies[11]
}

// Declarix next checks for codes where HMRC's published explanation gives no separate fix.
const errorNextChecks = {
  CDS12044: 'Check the MUCR in DE 2/1 for format, ownership and whether the consolidation is still open.',
  CDS12046: 'Resubmit the declaration as arrived (where permitted) or pre-lodge it again and send the arrival in time.',
  CDS12056: 'Read the AddInfo lines to find the second value involved, then check document status codes, APC pairs and any code that requires another code.',
  CDS12062: 'Check the DUCR in DE 2/1 is unique, correctly formatted and not already used on another declaration.',
  CDS12066: 'Find the second data element named in the pointer or AddInfo and either complete it with the value the rule needs or remove the combination.',
  CDS12067: 'Check each data element named in the pointers against the completion rules for this declaration category and its AI statements.',
  CDS12068: 'Add the document identifier for the DE 2/3 code named in the error.',
  CDS12069: 'Wait for the Office of Exit to finish processing the invalidation before sending another request.',
  CDS12078: 'Either declare the deferment account in DE 2/6 with a deferred method of payment, or give an immediate method of payment in DE 4/8.',
  CDS12079: 'Remove one of the two incompatible values, or move the data element to the one level (header or item) that the rule allows.',
  CDS12081: 'Check the importer and exporter identities in DE 3/16 and DE 3/2 and correct the party that was copied across.',
  CDS12132: 'Rebuild the DUCR in the published format and resubmit.',
  CDS12154: 'Remove 999L and declare the document codes the measure conditions on the commodity code require.',
  CDS12156: 'Enter the acceptance date against previous document code CLE in yyyymmdd format.',
  CDS12157: 'Check that each relevant party on the NI declaration is established in Northern Ireland or the EU, or change the party.',
  CDS12158: 'Add the NI movement AI statement (NIIMP, NIDOM or NIEXP) in DE 2/2, or use the correct EORI.',
  CDS12170: 'Check the VAT number. For Onward Supply Relief, the business must be identified as trading under the Windsor Framework for VAT.',
  CDS12171: 'Complete the third data element named in the error with a valid value for the combination already declared.',
  CDS12172: 'Complete the further data elements named in the error, for example a container ID when transport is containerised.',
  CDS12174: 'Re-add the item prices in DE 4/14 and make DE 4/11 equal their total.',
  CDS12500: 'Check the limit for the procedure or relief in Tariff Volume 3 and correct the value or the relief claimed.',
  CDS13000: 'Re-check price, quantity, net mass and supplementary units for a keying or decimal slip. If the value is right, keep the evidence that supports it.',
  CDS14000: 'Re-check the quantity or value claimed against the quota and the supplementary unit.',
  CDS20001: 'Check the related movement has been sent and the references match; retry once the movement exists.',
  CDS20002: 'Compare the related movement details with the declaration and correct whichever is wrong.',
  CDS20003: 'Check the movement reference quoted on the declaration.',
  CDS40012: 'Resubmit using the standard full export declaration dataset (B1).',
  CDS40047: 'Check the commodity code and origin for a prohibition measure and whether a licence or exemption applies.',
  CDS40049: 'The quota is used up: declare without the quota claim or wait for the next quota period.',
  CDS40053: 'The quota is suspended: declare without the quota claim.',
  CDS40059: 'Check the commodity code has all its digits and any additional codes the measure needs.',
  CDS40068: 'Add the national additional code for excise in DE 6/17.',
  CDS49999: 'Read the description and AddInfo text for the specific cause, then correct and resubmit.',
  CDS50000: 'Check the status of the linked ALVS or IPAFFS process; release is needed before CDS can proceed.',
  CDS50001: 'Correct the DUCR or MUCR to the published UCR format.',
  CDS50003: 'Send the request against the top-level UCR of the consolidation.',
  CDS50008: 'Check the UCR type (DUCR or MUCR) matches the reference format sent.',
  CDS50018: 'Add a valid goods arrival date and time to the inventory linking message.',
  CDS50027: 'Check the role and location permissions of the party sending the message.',
  CDS50031: 'The movement has already been closed with a successful RET; do not resend.',
  CDS71204: 'The licence has already been surrendered: quote a valid licence or the correct status code.',
  CDS71206: 'The licence is exhausted: quote a licence with remaining quantity.',
  CDS77004: 'Retry the licence reservation and check the remaining quantity on the licence.',
}

const workaroundsByCode = new Map()
for (const workaround of errorData.workarounds) {
  for (const code of workaround.error_codes) {
    if (!workaroundsByCode.has(code)) workaroundsByCode.set(code, [])
    workaroundsByCode.get(code).push(workaround)
  }
}

export const errorRecords = errorData.records.map((record) => {
  const family = errorFamily(record.code)
  return sourceRecord({
    ...record,
    family: family[1],
    check: record.check || errorNextChecks[record.code] || family[3],
    check_source: record.check ? 'HMRC' : 'Declarix',
    workarounds: (workaroundsByCode.get(record.code) || []).map((item) => item.code),
  })
})
for (const code of Object.keys(errorNextChecks)) {
  if (!errorData.records.some((record) => record.code === code)) throw new Error(`Next check written for unknown error code ${code}`)
}

// ---------- Routes ----------
const procedureSources = procedureData.sources
const documentSources = documentData.sources
const errorSources = errorData.sources

export const referenceRoutes = [
  {
    kind: 'reference-procedure',
    key: 'procedure',
    path: '/customs-reference/customs-procedure-codes/',
    title: 'Customs procedure codes (CPC): UK CDS list and checker',
    description:
      'Every UK CDS procedure code (DE 1/10) and additional procedure code (DE 1/11) from HMRC, with a combination checker and worked examples.',
    h1: 'Customs procedure codes: every UK CDS code, explained.',
    eyebrow: 'CUSTOMS REFERENCE · CDS PROCEDURE CODES · DE 1/10 AND DE 1/11',
    standfirst:
      'A UK customs procedure code tells CDS what is happening to the goods now and where they came from. This finder holds every DE 1/10 and DE 1/11 code HMRC publishes, the valid pairs from HMRC’s correlation matrix and worked examples a clerk can follow.',
    ref: 'REFERENCE 43 · PROCEDURE CODES',
    stamp: `${procedureRecords.length + additionalRecords.length}\nCODES`,
    publishedOn: REVIEWED_ON,
    reviewedOn: REVIEWED_ON,
    sources: [
      source('Appendix 1: DE 1/10 requested and previous procedure codes (imports)', procedureSources.import_procedures.url, procedureSources.import_procedures.updated),
      source('Appendix 1: DE 1/10 requested and previous procedure codes (exports)', procedureSources.export_procedures.url, procedureSources.export_procedures.updated),
      source('Appendix 2: DE 1/11 additional procedure codes (imports)', procedureSources.import_additional.url, procedureSources.import_additional.updated),
      source('Appendix 2: DE 1/11 additional procedure codes (exports)', procedureSources.export_additional.url, procedureSources.export_additional.updated),
      source('Procedure to additional procedure code correlation matrix (imports)', procedureSources.import_matrix.url, procedureSources.import_matrix.updated),
      source('Procedure to additional procedure code correlation matrix (exports)', procedureSources.export_matrix.url, procedureSources.export_matrix.updated),
      source('CDS Declaration and Customs Clearance Request Instructions (Tariff Volume 3)', 'https://www.gov.uk/government/collections/uk-trade-tariff-volume-3-for-cds--2'),
    ],
    download: { href: '/downloads/cds-procedure-codes.csv', label: 'All procedure and additional procedure codes (CSV)' },
  },
  {
    kind: 'reference-document',
    key: 'document',
    path: '/customs-reference/customs-document-codes/',
    title: 'CDS document codes (DE 2/3): full list with status codes',
    description:
      'All 998 CDS document codes for DE 2/3 from HMRC Appendix 5A, Union and national, with status codes, search, filters and common error fixes.',
    h1: 'Customs document codes: the full CDS DE 2/3 list, searchable.',
    eyebrow: 'CUSTOMS REFERENCE · CDS DOCUMENT CODES · DE 2/3',
    standfirst:
      'Every certificate, licence, authorisation, invoice and exemption on a CDS declaration travels as a four-character document code in DE 2/3. This finder holds all of HMRC’s Union and national codes with their status codes, so a clerk can find the right row in seconds.',
    ref: 'REFERENCE 42 · DOCUMENT CODES',
    stamp: `${documentRecords.length}\nCODES`,
    publishedOn: REVIEWED_ON,
    reviewedOn: REVIEWED_ON,
    sources: [
      source('DE 2/3 documents and other reference codes (Union), Appendix 5A', documentSources.union.url, documentSources.union.updated),
      source('DE 2/3 documents and other reference codes (National), Appendix 5A', documentSources.national.url, documentSources.national.updated),
      source('DE 2/3 document status codes, Appendix 5B', documentSources.status.url, documentSources.status.updated),
      source('Customs Declaration Service error codes', errorSources.errors.url, errorSources.errors.updated),
    ],
    download: { href: '/downloads/cds-document-codes.csv', label: 'All DE 2/3 document codes (CSV)' },
  },
  {
    kind: 'reference-error',
    key: 'error',
    path: '/customs-reference/cds-error-codes/',
    title: 'CDS error codes: meanings and fixes for every code',
    description:
      'Every CDS error code HMRC publishes, from CDS10001 to CDS77005, with what it means, what to check first and current HMRC workarounds.',
    h1: 'CDS error codes: what each one means and how to fix it.',
    eyebrow: 'CUSTOMS REFERENCE · CDS ERROR CODES · DMS VALIDATION',
    standfirst:
      'When CDS rejects a declaration it returns a validation code, a pointer and extra detail. This finder holds every error code on HMRC’s published list with HMRC’s explanation, a first thing to check and any open HMRC workaround that names the code.',
    ref: 'REFERENCE 41 · CDS ERROR CODES',
    stamp: `${errorRecords.length}\nCODES`,
    publishedOn: REVIEWED_ON,
    reviewedOn: REVIEWED_ON,
    sources: [
      source('Customs Declaration Service error codes', errorSources.errors.url, errorSources.errors.updated),
      source('Known error workarounds for the Customs Declaration Service', errorSources.workarounds.url, errorSources.workarounds.updated),
      source('CDS Declaration Error Messages: overview of error messages (CDSSG14100)', 'https://www.gov.uk/hmrc-internal-manuals/customs-cds-volume-3-tariff-step-by-step-guide/cdssg14100'),
      source('Report a problem using the Customs Declaration Service', 'https://www.gov.uk/guidance/report-a-problem-using-the-customs-declaration-service'),
    ],
    download: { href: '/downloads/cds-error-codes.csv', label: 'All CDS error codes (CSV)' },
  },
]

// ---------- Downloads ----------
const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
const csv = (header, rows) => `${[header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')}\n`

export function referenceAssets(route) {
  if (route.kind === 'reference-procedure') {
    return [
      {
        href: route.download.href,
        content: csv(
          ['data_element', 'direction', 'code', 'title', 'meaning', 'valid_pairs', 'source_url', 'checked_on'],
          [
            ...procedureRecords.map((record) => ['DE 1/10', record.direction, record.code, record.title, record.meaning, (procedureData.matrix[record.direction]?.[record.code] || []).join(' '), record.source_url, record.checked_on]),
            ...additionalRecords.map((record) => ['DE 1/11', record.direction, record.code, record.title, record.meaning, record.pairs.join(' '), record.source_url, record.checked_on]),
          ],
        ),
      },
    ]
  }
  if (route.kind === 'reference-document') {
    return [
      {
        href: route.download.href,
        content: csv(
          ['code', 'family', 'direction', 'title', 'details_to_declare', 'status_codes', 'document_id', 'document_reason', 'source_url', 'checked_on'],
          documentRecords.map((record) => [record.code, record.family, record.direction, record.title, record.details, record.status_codes, record.document_id, record.document_reason, record.source_url, record.checked_on]),
        ),
      },
    ]
  }
  return [
    {
      href: route.download.href,
      content: csv(
        ['code', 'title', 'meaning', 'what_to_check', 'check_source', 'open_hmrc_workarounds', 'source_url', 'checked_on'],
        errorRecords.map((record) => [record.code, record.title, record.meaning, record.check, record.check_source, record.workarounds.join(' '), record.source_url, record.checked_on]),
      ),
    },
  ]
}

// ---------- Rendering helpers ----------
function filterBar(table, { placeholder, selects = [] }) {
  const controls = selects
    .map(
      ([key, label, options]) =>
        `<label><span>${escapeHtml(label)}</span><select data-filter-key="${key}" data-filter-for="${table}"><option value="">All</option>${options.map(([value, text]) => `<option value="${escapeHtml(value)}">${escapeHtml(text)}</option>`).join('')}</select></label>`,
    )
    .join('')
  return `<div class="ref-filter" role="search"><label><span>Search</span><input type="search" data-filter-text="${table}" placeholder="${escapeHtml(placeholder)}" autocomplete="off" /></label>${controls}<output data-filter-count="${table}" aria-live="polite"></output></div>`
}

function renderDirectAnswer(label, heading, body) {
  return `<section class="direct-answer"><span>DIRECT ANSWER · ${escapeHtml(label)}</span><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(body)}</p></section>`
}

function renderFaq(items) {
  return `<section class="ref-faq" aria-labelledby="ref-faq-heading"><header><span>QUESTIONS CLERKS ASK</span><h2 id="ref-faq-heading">Straight answers.</h2></header>${items
    .map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`)
    .join('')}</section>`
}

function renderBridge(route) {
  return `<section class="authority-bridge ref-bridge"><span>FROM CODE TO CDS-READY PACK</span><h2>Let the codes arrive already attached to their evidence.</h2><p>Declarix turns the documents your customers send into a source-linked, CDS-ready entry pack. Proposed values keep the source document, page and line attached, conflicting or missing facts stay visible as questions, and your clerk checks and approves before your existing system files. Teams use it to handle up to 3× more declarations per clerk.</p><a data-authority-related="pack_check" href="${PACK_CHECK}">RUN THE FREE DOCUMENT PACK CHECK →</a><a data-authority-related="value_workpaper" href="${VALUE_TOOL}">OPEN THE VALUE + DUTY WORKPAPER →</a></section>`
}

function renderDownload(route) {
  return `<div class="download-row"><a class="authority-download" download href="${route.download.href}" data-authority-download="${route.kind}" data-asset-format="CSV"><span>CSV</span><strong>${escapeHtml(route.download.label)}</strong><b>DOWNLOAD ↓</b></a></div>`
}

// ---------- P43 content ----------
function renderProcedure() {
  const anatomy = `<figure class="cpc-anatomy"><figcaption><span>HOW A CPC IS BUILT</span><h2>Seven characters, two data elements.</h2></figcaption><ol><li><b>40</b><strong>Requested procedure</strong><em>DE 1/10 · digits 1–2 · where the goods are going now</em></li><li><b>00</b><strong>Previous procedure</strong><em>DE 1/10 · digits 3–4 · where they came from (00 = none)</em></li><li><b>000</b><strong>Additional procedure</strong><em>DE 1/11 · three characters · relief, suspension or special treatment</em></li></ol><p>Only one 4-digit procedure code is allowed per goods item. HMRC lets you tailor it with several DE 1/11 codes, and Union codes are declared before national codes.</p></figure>`

  const commonRows = commonCpcs
    .map(([direction, procedure, additional, label, when]) => {
      const record = procedureRecords.find((item) => item.code === procedure && item.direction === direction)
      return `<tr><th scope="row"><code>${procedure} ${additional}</code></th><td>${direction}</td><td><strong>${escapeHtml(label)}</strong><br/>${escapeHtml(when)}</td><td>${escapeHtml(record.title)}</td><td><a href="${escapeHtml(record.source_url)}">HMRC notes</a></td></tr>`
    })
    .join('')
  const common = `<section class="ref-section" aria-labelledby="common-cpc-heading"><header><span>EVERYDAY CODES</span><h2 id="common-cpc-heading">Common UK customs procedure codes.</h2><p>Every pair below is listed as valid in HMRC’s correlation matrix. The build fails if HMRC removes a pair, so this table cannot drift from the source.</p></header><div class="table-scroll" tabindex="0" role="region" aria-label="Common UK customs procedure codes"><table class="ref-table"><caption>Common CPCs with plain-English meaning</caption><thead><tr><th scope="col">DE 1/10 + DE 1/11</th><th scope="col">Direction</th><th scope="col">Meaning and when it is used</th><th scope="col">HMRC description of the 4-digit code</th><th scope="col">Source</th></tr></thead><tbody>${commonRows}</tbody></table></div></section>`

  const procedureOptions = (direction) =>
    procedureRecords
      .filter((record) => record.direction === direction)
      .map((record) => `<option value="${record.code}">${record.code} · ${escapeHtml(record.title)}</option>`)
      .join('')
  const apcOptions = (direction) =>
    additionalRecords
      .filter((record) => record.direction === direction)
      .map((record) => `<option value="${record.code}">${record.code} · ${escapeHtml(record.title.slice(0, 90))}${record.title.length > 90 ? '…' : ''}</option>`)
      .join('')
  const checker = `<section class="cpc-checker" aria-labelledby="cpc-checker-heading"><header><span>COMBINATION CHECKER</span><h2 id="cpc-checker-heading">Is this DE 1/10 and DE 1/11 pair valid?</h2><p>Pick the movement, the 4-digit procedure code and the additional procedure code. The answer comes from HMRC’s correlation matrix (imports edition ${procedureSources.import_matrix.updated}, exports edition ${procedureSources.export_matrix.updated}).</p></header><form id="cpc-checker"><fieldset><legend>Movement</legend><label><input type="radio" name="direction" value="Import" checked /> Import</label><label><input type="radio" name="direction" value="Export" /> Export</label></fieldset><label class="ref-select" data-direction="Import"><span>DE 1/10 procedure code (import)</span><select name="procedure-Import">${procedureOptions('Import')}</select></label><label class="ref-select" data-direction="Export" hidden><span>DE 1/10 procedure code (export)</span><select name="procedure-Export" disabled>${procedureOptions('Export')}</select></label><label class="ref-select" data-direction="Import"><span>DE 1/11 additional procedure code (import)</span><select name="apc-Import">${apcOptions('Import')}</select></label><label class="ref-select" data-direction="Export" hidden><span>DE 1/11 additional procedure code (export)</span><select name="apc-Export" disabled>${apcOptions('Export')}</select></label><button class="button" type="submit">CHECK THE PAIR</button></form><div class="cpc-result" id="cpc-result" aria-live="polite" hidden><strong id="cpc-verdict"></strong><p id="cpc-detail"></p></div><noscript><p>The checker needs JavaScript. The full register below lists, for every additional procedure code, the 4-digit codes it pairs with.</p></noscript></section>`

  const categories = ['Import', 'Export']
    .map((direction) =>
      (procedureData.categories[direction] || [])
        .map((item) => `<tr><th scope="row">${escapeHtml(item.category)}</th><td>${direction}</td><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.requested_procedures)}</td></tr>`)
        .join(''),
    )
    .join('')
  const categoryTable = `<section class="ref-section" aria-labelledby="category-heading"><header><span>DECLARATION CATEGORIES</span><h2 id="category-heading">Which procedure codes each declaration category allows.</h2><p>All procedure codes on one declaration must come from the same declaration category. HMRC gives the example that an H2 code may not be combined with an H4 code.</p></header><div class="table-scroll" tabindex="0" role="region" aria-label="Declaration categories"><table class="ref-table"><caption>Declaration categories and allowed requested procedures (digits 1 and 2)</caption><thead><tr><th scope="col">Category</th><th scope="col">Direction</th><th scope="col">Declaration</th><th scope="col">Requested procedures</th></tr></thead><tbody>${categories}</tbody></table></div></section>`

  const seriesRows = ['Import', 'Export']
    .map((direction) =>
      Object.entries(seriesMeaning[direction])
        .map(([series, meaning]) => `<tr><th scope="row"><code>${series}</code></th><td>${direction}</td><td>${escapeHtml(meaning)}</td><td>${procedureRecords.filter((record) => record.direction === direction && record.requested_procedure === series).length}</td></tr>`)
        .join(''),
    )
    .join('')
  const series = `<section class="ref-section" aria-labelledby="series-heading"><header><span>READ THE FIRST TWO DIGITS</span><h2 id="series-heading">The requested procedure series in plain English.</h2></header><div class="table-scroll" tabindex="0" role="region" aria-label="Requested procedure series"><table class="ref-table"><caption>Requested procedure series</caption><thead><tr><th scope="col">Series</th><th scope="col">Direction</th><th scope="col">What it means</th><th scope="col">Codes</th></tr></thead><tbody>${seriesRows}</tbody></table></div></section>`

  const procedureRows = procedureRecords
    .map(
      (record) =>
        `<tr id="pc-${record.direction.toLowerCase()}-${record.code}" data-direction="${record.direction}"><th scope="row"><code>${record.code}</code></th><td>${record.direction}</td><td>${escapeHtml(record.title)}<small>${escapeHtml(record.meaning)}</small></td><td>${(procedureData.matrix[record.direction]?.[record.code] || []).length}</td><td><a href="${escapeHtml(record.source_url)}">HMRC notes</a><small>Checked ${record.checked_on}</small></td></tr>`,
    )
    .join('')
  const procedureRegister = `<section class="ref-section" aria-labelledby="pc-register-heading"><header><span>FULL REGISTER · DE 1/10</span><h2 id="pc-register-heading">All ${procedureRecords.length} requested and previous procedure codes.</h2><p>HMRC’s description for each 4-digit code, a plain-English reading, the number of DE 1/11 codes it pairs with and a link to HMRC’s completion notes for its series.</p></header>${filterBar('pc', { placeholder: 'Search 4000, warehouse, temporary…', selects: [['direction', 'Movement', [['Import', 'Import'], ['Export', 'Export']]]] })}<div class="table-scroll" tabindex="0" role="region" aria-label="DE 1/10 register"><table class="ref-table" data-filter-table="pc"><caption>DE 1/10 requested and previous procedure codes</caption><thead><tr><th scope="col">Code</th><th scope="col">Movement</th><th scope="col">HMRC description · plain English</th><th scope="col">Valid DE 1/11 pairs</th><th scope="col">Source</th></tr></thead><tbody>${procedureRows}</tbody></table></div></section>`

  const apcRows = additionalRecords
    .map(
      (record) =>
        `<tr id="apc-${record.direction.toLowerCase()}-${record.code}" data-direction="${record.direction}" data-family="${record.family}"><th scope="row"><code>${record.code}</code></th><td>${record.direction}</td><td>${record.family}</td><td>${escapeHtml(record.title)}</td><td>${record.pairs.length ? `<span class="pairs">${record.pairs.join(' ')}</span>` : 'Not listed in the matrix'}</td><td><a href="${escapeHtml(record.source_url)}">HMRC notes</a><small>Checked ${record.checked_on}</small></td></tr>`,
    )
    .join('')
  const apcRegister = `<section class="ref-section" aria-labelledby="apc-register-heading"><header><span>FULL REGISTER · DE 1/11</span><h2 id="apc-register-heading">All ${additionalRecords.length} additional procedure codes.</h2><p>Union codes start with a letter (A inward processing, B outward processing, C relief, D temporary admission, E agricultural, F other). National codes start with a digit. The last column lists every 4-digit code HMRC’s matrix pairs with the code.</p></header>${filterBar('apc', { placeholder: 'Search C07, 1RV, samples, relief…', selects: [['direction', 'Movement', [['Import', 'Import'], ['Export', 'Export']]], ['family', 'Family', [['Union', 'Union'], ['National', 'National']]]] })}<div class="table-scroll" tabindex="0" role="region" aria-label="DE 1/11 register"><table class="ref-table" data-filter-table="apc"><caption>DE 1/11 additional procedure codes</caption><thead><tr><th scope="col">Code</th><th scope="col">Movement</th><th scope="col">Family</th><th scope="col">HMRC description</th><th scope="col">Pairs with DE 1/10</th><th scope="col">Source</th></tr></thead><tbody>${apcRows}</tbody></table></div></section>`

  const examples = `<section class="ref-section" aria-labelledby="cpc-examples-heading"><header><span>WORKED EXAMPLES</span><h2 id="cpc-examples-heading">Four UK movements, coded step by step.</h2><p>Each final pair is checked against HMRC’s correlation matrix when this page is built.</p></header><div class="ref-examples">${procedureExamples
    .map((example) => `<article><h3>${escapeHtml(example.title)}</h3><dl>${example.steps.map(([label, text]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(text)}</dd></div>`).join('')}</dl></article>`)
    .join('')}</div></section>`

  const faq = renderFaq([
    ['What is the most common UK customs procedure code?', 'For a standard import it is DE 1/10 4000 with DE 1/11 000, written as 4000000: release to free circulation with no previous procedure and no additional treatment. For a standard export it is 1040 with 000.'],
    ['Is a CPC the same as a procedure code?', 'In CDS the CPC is split across two data elements: the 4-digit procedure code in DE 1/10 and the 3-character additional procedure code in DE 1/11. Together they make the 7-character code brokers call the CPC.'],
    ['What does 00 mean in the third and fourth digits?', 'HMRC says 00 in digits three and four means the goods have not been under any previous customs procedure.'],
    ['Can I declare more than one additional procedure code?', 'Yes. HMRC allows several DE 1/11 codes on one goods item, with Union codes declared before national codes. Code 000 cannot be combined with any other additional procedure code (CDS error CDS12149).'],
    ['What happens if the pair is not valid?', 'CDS rejects invalid combinations. CDS11004 covers an invalid combination of trade movement, declaration type, requested procedure and additional procedure codes. Check the pair in the checker above before you submit.'],
    ['Where does this data come from?', `HMRC’s Appendix 1 (DE 1/10), Appendix 2 (DE 1/11) and the correlation matrices in the Tariff Volume 3 collection, all checked on ${CHECKED_LABEL.toLowerCase()}. Every row links to HMRC’s completion notes.`],
  ])

  return `${renderDirectAnswer('CPC', 'A UK customs procedure code (CPC) is 7 characters: a 4-digit procedure code in DE 1/10 plus a 3-character additional procedure code in DE 1/11.', 'The first two digits are the requested procedure, the next two are the previous procedure and the last three add any relief or special treatment. 4000 + 000 is a standard release to free circulation. 1040 + 000 is a standard permanent export.')}${anatomy}${common}${checker}${examples}${categoryTable}${series}${procedureRegister}${apcRegister}${faq}`
}

// ---------- P42 content ----------
function renderDocument() {
  const statusRows = documentData.status_codes
    .map((record) => `<tr><th scope="row"><code>${record.code}</code></th><td>${escapeHtml(record.title)}</td></tr>`)
    .join('')
  const errorByCode = new Map(errorRecords.map((record) => [record.code, record]))
  const linkErrors = (text) =>
    escapeHtml(text).replace(/CDS\d{5}/g, (code) => (errorByCode.has(code) ? `<a href="/customs-reference/cds-error-codes/#${code}">${code}</a>` : code))
  const commonRows = commonDocuments
    .map(([code, label, meaning, error]) => {
      const records = documentRecords.filter((record) => record.code === code)
      const record = records[0]
      return `<tr><th scope="row"><code>${code}</code></th><td><strong>${escapeHtml(label)}</strong><br/>${escapeHtml(meaning)}</td><td>${escapeHtml(record.direction)}</td><td>${escapeHtml(records.map((item) => item.status_codes).join(' / '))}</td><td>${linkErrors(error)}</td></tr>`
    })
    .join('')
  const common = `<section class="ref-section" aria-labelledby="common-doc-heading"><header><span>EVERYDAY CODES</span><h2 id="common-doc-heading">Common CDS document codes and the errors they trigger.</h2><p>Status codes are copied from HMRC Appendix 5A. Error codes link to the CDS error code finder.</p></header><div class="table-scroll" tabindex="0" role="region" aria-label="Common document codes"><table class="ref-table"><caption>Common DE 2/3 codes</caption><thead><tr><th scope="col">Code</th><th scope="col">What it is</th><th scope="col">Movement</th><th scope="col">Allowed status codes</th><th scope="col">Related CDS error</th></tr></thead><tbody>${commonRows}</tbody></table></div></section>`

  const anatomy = `<figure class="cpc-anatomy doc-anatomy"><figcaption><span>HOW A DE 2/3 ENTRY IS BUILT</span><h2>Code, identifier, status, reason.</h2></figcaption><ol><li><b>N935</b><strong>Document code</strong><em>Four characters from Appendix 5A</em></li><li><b>INV-4471</b><strong>Document identifier</strong><em>The reference on the document, when the row marks it M or C</em></li><li><b>AC</b><strong>Status code</strong><em>Two letters from Appendix 5B</em></li><li><b>Reason</b><strong>Document reason</strong><em>Free text, required for XX and XW waivers</em></li></ol><p>HMRC’s own example: declare document code N935 with the commercial sales invoice reference number and status code AC. Where a code allows XX or XW, a statement supporting the waiver goes in the reason component.</p></figure>`

  const errorCodes = ['CDS77000', 'CDS77001', 'CDS77002', 'CDS77005', 'CDS12068', 'CDS12115', 'CDS12119', 'CDS12151', 'CDS40044', 'CDS40045', 'CDS71200', 'CDS12154']
  const errorRows = errorCodes
    .map((code) => errorByCode.get(code))
    .filter(Boolean)
    .map((record) => `<tr><th scope="row"><a href="/customs-reference/cds-error-codes/#${record.code}">${record.code}</a></th><td>${escapeHtml(record.title)}</td><td>${escapeHtml(record.check.split('\n')[0])}</td></tr>`)
    .join('')
  const errors = `<section class="ref-section" aria-labelledby="doc-errors-heading"><header><span>COMMON ERRORS</span><h2 id="doc-errors-heading">DE 2/3 errors CDS returns, and the first fix.</h2><p>Descriptions are HMRC’s. The first fix is HMRC’s explanation where it gives one.</p></header><div class="table-scroll" tabindex="0" role="region" aria-label="Document code errors"><table class="ref-table"><caption>CDS errors linked to document codes</caption><thead><tr><th scope="col">Error</th><th scope="col">HMRC description</th><th scope="col">First fix</th></tr></thead><tbody>${errorRows}</tbody></table></div></section>`

  const groups = [...new Set(documentRecords.map((record) => record.group))]
  const rows = documentRecords
    .map(
      (record) =>
        `<tr id="doc-${record.code}${record.variant > 1 ? `-${record.variant}` : ''}" data-direction="${record.direction}" data-family="${record.family}" data-group="${escapeHtml(record.group)}"><th scope="row"><code>${record.code}</code></th><td>${escapeHtml(record.direction)}</td><td>${paragraphs(record.title)}</td><td>${escapeHtml(record.status_codes)}</td><td>${escapeHtml(record.document_id)} / ${escapeHtml(record.document_reason)}</td></tr>`,
    )
    .join('')
  const register = `<section class="ref-section" aria-labelledby="doc-register-heading"><header><span>FULL REGISTER · APPENDIX 5A</span><h2 id="doc-register-heading">All ${documentRecords.length} DE 2/3 document codes.</h2><p>${documentRecords.filter((record) => record.family === 'Union').length} Union codes (<a href="${escapeHtml(documentSources.union.url)}">HMRC Appendix 5A Union, updated ${documentSources.union.updated}</a>) and ${documentRecords.filter((record) => record.family === 'National').length} national codes (<a href="${escapeHtml(documentSources.national.url)}">HMRC Appendix 5A National, updated ${documentSources.national.updated}</a>), checked ${CHECKED_LABEL.toLowerCase()}. ID / Reason shows whether the document identifier and reason are Mandatory, Conditional or N/A. The CSV download adds HMRC’s full “details to be entered” column.</p></header>${filterBar('doc', {
    placeholder: 'Search N935, invoice, CITES, origin…',
    selects: [
      ['direction', 'Movement', [['Import', 'Import'], ['Export', 'Export'], ['Both', 'Both']]],
      ['family', 'List', [['Union', 'Union'], ['National', 'National']]],
      ['group', 'Type', groups.map((group) => [group, group])],
    ],
  })}<div class="table-scroll" tabindex="0" role="region" aria-label="DE 2/3 register"><table class="ref-table ref-table-wide" data-filter-table="doc"><caption>DE 2/3 documents and other reference codes</caption><thead><tr><th scope="col">Code</th><th scope="col">Movement</th><th scope="col">HMRC description and usage</th><th scope="col">Status codes</th><th scope="col">ID / Reason</th></tr></thead><tbody>${rows}</tbody></table></div></section>`

  const status = `<section class="ref-section" aria-labelledby="status-heading"><header><span>APPENDIX 5B</span><h2 id="status-heading">All ${documentData.status_codes.length} document status codes.</h2><p>Use only the status codes the document code’s row allows. HMRC states that XX or XW is a legal declaration that the goods are exempt from the documentary control, and the evidence must be held in records.</p></header><div class="table-scroll" tabindex="0" role="region" aria-label="Document status codes"><table class="ref-table"><caption>DE 2/3 document status codes</caption><thead><tr><th scope="col">Status</th><th scope="col">HMRC description</th></tr></thead><tbody>${statusRows}</tbody></table></div></section>`

  const faq = renderFaq([
    ['What is document code N935?', 'N935 is the invoice on the basis of which the customs value of the goods is declared. It is an import code and HMRC lists status code AC for it.'],
    ['What is the difference between N935 and N380?', 'N935 identifies the invoice the customs value is built on. N380 is a commercial invoice declared as a supporting document. HMRC lists N380 for imports and exports with a wider set of status codes.'],
    ['What does document code C505 mean?', 'C505 is the comprehensive guarantee (CGU) authorisation. HMRC publishes two rows: one where a comprehensive guarantee is required, and one where it is not, including deferment accounts.'],
    ['What do Y codes mean?', 'Most Y codes are statements that a control does not apply to the goods, for example Y923 (product not considered as waste) or Y900 (goods not covered by CITES).'],
    ['What does status code XW mean?', 'XW means a waiver is claimed. HMRC requires a supporting statement in the document reason and evidence in your records.'],
    ['Why does CDS say a document is missing when I declared it?', 'CDS40045 means the commodity code’s measure needs a document that is not on the item. Check the measure conditions for the commodity code and add the exact code they name.'],
  ])

  return `${renderDirectAnswer('DE 2/3', 'A CDS document code is the four-character code in DE 2/3 that tells HMRC which document, certificate, authorisation or exemption supports a goods item.', 'N935 is the invoice the customs value is based on, C506 is the duty deferment authorisation and Y-codes state that a control does not apply. Each code comes with the status codes and identifier rules HMRC sets in Appendix 5A.')}${anatomy}${common}${errors}${register}${status}${faq}`
}

// ---------- P41 content ----------
function renderError() {
  const anatomyRows = [
    ['ValidationCode', 'The reference number for the error. Look it up in the table below.', 'CDS40011'],
    ['CodeDescription', 'What has gone wrong and what needs fixing.', 'Missing data element value'],
    ['PointerNames', 'Where in the declaration the problem is. A number in brackets is the goods item.', 'Declaration->GoodsShipment->GovernmentAgencyGoodsItem(1)'],
    ['AdditionalDocument; FriendlyName', 'An occasional statement naming the data element.', 'Doc Code Statement'],
    ['AddInfoText', 'More information on the error. Several lines may appear.', 'Code missing from DE 6/17'],
    ['AddInfoCode', 'The code CDS needs. Several lines may appear.', 'Y904'],
  ]
  const anatomy = `<section class="ref-section" aria-labelledby="read-error-heading"><header><span>READ THE MESSAGE FIRST</span><h2 id="read-error-heading">How a CDS error message is built.</h2><p>HMRC’s step-by-step guide (CDSSG14100) describes each part. Your software may lay it out differently, but the parts are the same.</p></header><div class="table-scroll" tabindex="0" role="region" aria-label="Error message parts"><table class="ref-table"><caption>Parts of a CDS error message</caption><thead><tr><th scope="col">Part</th><th scope="col">What it tells you</th><th scope="col">Example</th></tr></thead><tbody>${anatomyRows.map(([part, meaning, example]) => `<tr><th scope="row"><code>${escapeHtml(part)}</code></th><td>${escapeHtml(meaning)}</td><td><code>${escapeHtml(example)}</code></td></tr>`).join('')}</tbody></table></div><pre class="error-sample"><code>ValidationCode:CDS40011;CodeDescription:Missing data element value;PointerNames:Declaration-&gt;GoodsShipment-&gt;GovernmentAgencyGoodsItem(1); AdditionalDocument;FriendlyName: Doc Code Statement ;AddInfoCode:C604;AddInfoText:Measure type 705 on commodity code 3926909790 requires document; AddInfoCode:Y904;AddInfoText:Measure type 705 on commodity code 3926909790 requires document;AddInfoCode:All;AddInfoType:Either of these documents need to be supplied</code></pre><p class="ref-note"><strong>Reading this example:</strong> goods item 1 is missing a document that tariff measure type 705 needs for commodity code 3926909790. Either C604 or Y904 in DE 2/3 satisfies it. HMRC also notes that an error can come from a rejected amendment, in which case the declaration itself is unchanged.</p></section>`

  const familyRows = errorFamilies
    .map(([prefix, name, meaning, check]) => {
      const count = errorRecords.filter((record) => record.family === name).length
      return `<tr><th scope="row">${escapeHtml(name)}</th><td>${count}</td><td>${escapeHtml(meaning)}</td><td>${escapeHtml(check)}</td></tr>`
    })
    .join('')
  const families = `<section class="ref-section" aria-labelledby="error-families-heading"><header><span>CODE FAMILIES</span><h2 id="error-families-heading">The number tells you where to look.</h2></header><div class="table-scroll" tabindex="0" role="region" aria-label="Error code families"><table class="ref-table"><caption>CDS error code families</caption><thead><tr><th scope="col">Family</th><th scope="col">Codes</th><th scope="col">What goes wrong</th><th scope="col">First move</th></tr></thead><tbody>${familyRows}</tbody></table></div></section>`

  const workaroundRows = errorData.workarounds
    .map((item) => `<tr id="${escapeHtml(item.code.replace(/\s+/g, '-'))}"><th scope="row">${escapeHtml(item.code)}</th><td>${item.error_codes.map((code) => `<a href="#${code}">${code}</a>`).join(' ')}</td><td><strong>${escapeHtml(item.title)}</strong></td><td>${paragraphs(item.workaround)}</td><td>${escapeHtml(item.status)}</td></tr>`)
    .join('')
  const workarounds = `<section class="ref-section" aria-labelledby="workarounds-heading"><header><span>OPEN HMRC WORKAROUNDS</span><h2 id="workarounds-heading">${errorData.workarounds.length} known issues that name an error code.</h2><p>From HMRC’s known error workarounds file (updated ${errorSources.workarounds.updated}). When one of these matches your declaration, follow HMRC’s workaround below.</p></header><div class="table-scroll" tabindex="0" role="region" aria-label="Open HMRC workarounds"><table class="ref-table ref-table-wide"><caption>Open known errors and known differences with error codes</caption><thead><tr><th scope="col">HMRC ID</th><th scope="col">Error codes</th><th scope="col">Issue</th><th scope="col">HMRC current workaround</th><th scope="col">HMRC status</th></tr></thead><tbody>${workaroundRows}</tbody></table></div></section>`

  const rows = errorRecords
    .map(
      (record) =>
        `<tr id="${record.code}" data-family="${escapeHtml(record.family)}" data-workaround="${record.workarounds.length ? 'yes' : 'no'}"><th scope="row"><code>${record.code}</code></th><td><strong>${escapeHtml(record.title)}</strong></td><td>${paragraphs(record.meaning)}</td><td>${paragraphs(record.check)}<small>${record.check_source === 'HMRC' ? 'HMRC explanation' : 'Declarix next check'}</small></td><td>${record.workarounds.length ? record.workarounds.map((id) => `<a href="#${escapeHtml(id.replace(/\s+/g, '-'))}">${escapeHtml(id)}</a>`).join(' ') : '—'}</td></tr>`,
    )
    .join('')
  const register = `<section class="ref-section" aria-labelledby="error-register-heading"><header><span>FULL REGISTER</span><h2 id="error-register-heading">All ${errorRecords.length} CDS error codes.</h2><p>Code and description from <a href="${escapeHtml(errorSources.errors.url)}">HMRC’s Customs Declaration Service error codes list</a> (updated ${errorSources.errors.updated}, checked ${CHECKED_LABEL.toLowerCase()}). “In plain English” is HMRC’s own explanation. “What to check” is HMRC’s fix where HMRC gives one; otherwise a Declarix next check, labelled as such.</p></header>${filterBar('err', {
    placeholder: 'Search CDS12056, licence, DUCR…',
    selects: [
      ['family', 'Family', errorFamilies.map(([, name]) => [name, name])],
      ['workaround', 'HMRC workaround', [['yes', 'Has an open workaround']]],
    ],
  })}<div class="table-scroll" tabindex="0" role="region" aria-label="CDS error code register"><table class="ref-table ref-table-wide" data-filter-table="err"><caption>CDS error codes, meanings and checks</caption><thead><tr><th scope="col">Code</th><th scope="col">HMRC description</th><th scope="col">In plain English</th><th scope="col">What to check</th><th scope="col">Open workaround</th></tr></thead><tbody>${rows}</tbody></table></div></section>`

  const faq = renderFaq([
    ['What does CDS10020 mean?', 'CDS10020 is a domain error: a data element holds a value CDS does not accept. Usually a code is not recognised, is not allowed on this declaration, or sits at the wrong level (header or item).'],
    ['What does CDS12056 mean?', 'CDS12056 means the combination of elements is not allowed: two values conflict, or one code needs another code that is missing. The AddInfo lines name the second value. HMRC lists open workarounds that cite CDS12056 in the table above.'],
    ['What does CDS10001 mean?', 'CDS10001 means a mandatory data element is missing or incomplete, for example a party address without a postcode.'],
    ['Where is the official list of CDS error codes?', `HMRC publishes it on GOV.UK as “Customs Declaration Service error codes”. This page holds every code from the edition updated ${errorSources.errors.updated}.`],
    ['Why did my amendment fail when the declaration looks right?', 'HMRC notes that an amendment request can generate its own errors. The amendment is rejected and the declaration data stays unchanged, so check the amendment message, not the original.'],
    ['What should I do if the error matches an HMRC known issue?', 'Follow the current workaround in HMRC’s known error workarounds file. The table above shows every open workaround that names an error code.'],
  ])

  return `${renderDirectAnswer('CDS ERRORS', 'A CDS error code is the validation code HMRC returns when a declaration fails a check, such as CDS10020 (invalid value) or CDS12056 (combination not allowed).', 'Read it with the pointer, which shows the goods item and data element, and the AddInfo lines, which name the value CDS expected. Then fix the source data and resubmit.')}${anatomy}${families}${register}${workarounds}${faq}`
}

// ---------- Page shell ----------
function bookingHref(route, placement) {
  const name = `reference_${route.path.split('/').filter(Boolean).join('_')}_${placement}`
  return `/?src=${encodeURIComponent(name)}#book`
}

function jsonLd(route, site) {
  const breadcrumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` }]
  if (referenceHub.available) breadcrumbs.push({ '@type': 'ListItem', position: 2, name: 'Customs reference', item: `${site.origin}${referenceHub.path}` })
  breadcrumbs.push({ '@type': 'ListItem', position: breadcrumbs.length + 1, name: route.h1, item: `${site.origin}${route.path}` })
  const count = route.kind === 'reference-procedure' ? procedureRecords.length + additionalRecords.length : route.kind === 'reference-document' ? documentRecords.length : errorRecords.length
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${site.origin}/#organization`, name: site.company, legalName: site.company, url: `${site.origin}/`, identifier: site.companyNumber },
      {
        '@type': 'TechArticle',
        '@id': `${site.origin}${route.path}#page`,
        url: `${site.origin}${route.path}`,
        name: route.title,
        headline: route.h1,
        description: route.description,
        datePublished: route.publishedOn,
        dateModified: route.reviewedOn,
        inLanguage: 'en-GB',
        isPartOf: { '@id': `${site.origin}/#website` },
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
        citation: route.sources.map((item) => item.url),
      },
      {
        '@type': 'Dataset',
        '@id': `${site.origin}${route.path}#dataset`,
        name: route.title,
        description: `${count} records copied from HMRC’s published CDS appendices, each with its GOV.UK source and the date it was checked.`,
        creator: { '@id': `${site.origin}/#organization` },
        isBasedOn: route.sources.map((item) => item.url),
        license: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
        dateModified: route.reviewedOn,
        distribution: [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${site.origin}${route.download.href}` }],
      },
      { '@type': 'WebSite', '@id': `${site.origin}/#website`, name: 'Declarix', url: `${site.origin}/`, publisher: { '@id': `${site.origin}/#organization` } },
      { '@type': 'BreadcrumbList', itemListElement: breadcrumbs },
    ],
  }).replaceAll('<', '\\u003c')
}

function renderSources(route) {
  const id = `sources-${route.key}`
  return `<section class="authority-sources" aria-labelledby="${id}"><header><span>PRIMARY SOURCE REGISTER</span><h2 id="${id}">Every row traces to HMRC.</h2><p>Each record stores its GOV.UK source and the date it was checked. HMRC publishes this material under the Open Government Licence v3.0.</p></header><ol>${route.sources
    .map((item) => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a><span>${escapeHtml(item.publisher)}${item.updated ? ` · UPDATED ${escapeHtml(item.updated)}` : ''} · CHECKED ${escapeHtml(item.checked)}</span></li>`)
    .join('')}</ol></section>`
}

function script(route, posthogKey, posthogHost) {
  const config = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  const matrix = route.kind === 'reference-procedure' ? JSON.stringify(procedureData.matrix).replaceAll('<', '\\u003c') : 'null'
  return `<script>(() => {
    const config = ${config};
    const get = (key) => { try { return sessionStorage.getItem(key) || ''; } catch { return ''; } };
    const set = (key, value) => { try { sessionStorage.setItem(key, value); } catch {} };
    const attribution = () => { const params = new URLSearchParams(location.search); const incoming = { source: params.get('utm_source') || params.get('src') || '', medium: params.get('utm_medium') || '', campaign: params.get('utm_campaign') || '' }; Object.entries(incoming).forEach(([key, value]) => { if (value && !get('dclrx-' + key)) set('dclrx-' + key, value); }); return Object.fromEntries(Object.keys(incoming).map((key) => [key, get('dclrx-' + key) || (key === 'source' ? 'direct' : 'none')])); };
    const distinctId = get('dclrx-distinct-id') || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())); set('dclrx-distinct-id', distinctId);
    const track = (event, properties = {}) => { const payload = { ...attribution(), ...properties, asset_family: '${route.kind}', page_path: location.pathname }; window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event, ...payload }); if (!config.posthogKey) return; const body = JSON.stringify({ api_key: config.posthogKey, event, distinct_id: distinctId, properties: payload }); if (navigator.sendBeacon && navigator.sendBeacon(config.posthogHost + '/capture/', body)) return; fetch(config.posthogHost + '/capture/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => null); };
    document.querySelectorAll('[data-authority-download]').forEach((link) => link.addEventListener('click', () => track('authority_asset_downloaded', { asset_type: link.dataset.authorityDownload, asset_format: link.dataset.assetFormat })));
    document.querySelectorAll('[data-authority-related]').forEach((link) => link.addEventListener('click', () => track('authority_related_clicked', { target: link.dataset.authorityRelated })));
    document.querySelectorAll('[data-authority-booking]').forEach((link) => link.addEventListener('click', () => track('authority_booking_clicked', { placement: link.dataset.authorityBooking })));
    let filterTracked = false;
    document.querySelectorAll('[data-filter-table]').forEach((table) => {
      const name = table.dataset.filterTable;
      const rows = [...table.tBodies[0].rows];
      const text = document.querySelector('[data-filter-text="' + name + '"]');
      const selects = [...document.querySelectorAll('select[data-filter-for="' + name + '"]')];
      const count = document.querySelector('[data-filter-count="' + name + '"]');
      const haystack = rows.map((row) => row.textContent.toLowerCase());
      const apply = () => {
        const terms = (text ? text.value : '').toLowerCase().trim().split(/\\s+/).filter(Boolean);
        let shown = 0;
        rows.forEach((row, index) => {
          const matchText = terms.every((term) => haystack[index].includes(term));
          const matchSelect = selects.every((select) => !select.value || row.dataset[select.dataset.filterKey] === select.value);
          const visible = matchText && matchSelect;
          row.hidden = !visible;
          if (visible) shown += 1;
        });
        if (count) count.textContent = 'Showing ' + shown + ' of ' + rows.length;
        if (!filterTracked && (terms.length || selects.some((select) => select.value))) { filterTracked = true; track('reference_filter_used', { table: name }); }
      };
      if (text) text.addEventListener('input', apply);
      selects.forEach((select) => select.addEventListener('change', apply));
      const hash = decodeURIComponent(location.hash.slice(1));
      if (text && hash && rows.some((row) => row.id === hash)) { /* deep link: keep every row visible and let the browser scroll */ }
      apply();
    });
    const matrix = ${matrix};
    const checker = document.getElementById('cpc-checker');
    if (checker && matrix) {
      const sync = () => {
        const direction = new FormData(checker).get('direction');
        checker.querySelectorAll('label[data-direction]').forEach((label) => { const active = label.dataset.direction === direction; label.hidden = !active; label.querySelector('select').disabled = !active; });
      };
      checker.querySelectorAll('input[name="direction"]').forEach((input) => input.addEventListener('change', sync));
      sync();
      checker.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(checker);
        const direction = data.get('direction');
        const procedure = data.get('procedure-' + direction);
        const apc = data.get('apc-' + direction);
        const valid = (matrix[direction][procedure] || []).includes(apc);
        const pairs = (matrix[direction][procedure] || []).length;
        document.getElementById('cpc-verdict').textContent = valid ? procedure + ' with ' + apc + ' is listed as a valid pair.' : procedure + ' with ' + apc + ' is not listed as a valid pair.';
        document.getElementById('cpc-detail').textContent = valid ? 'HMRC’s ' + direction.toLowerCase() + ' correlation matrix allows this combination. Read the completion notes for both codes before you submit.' : 'HMRC’s ' + direction.toLowerCase() + ' correlation matrix lists ' + pairs + ' additional procedure codes for ' + procedure + '. Open ' + procedure + ' in the register below to see them.';
        const result = document.getElementById('cpc-result');
        result.hidden = false;
        result.dataset.valid = valid ? 'yes' : 'no';
        track('reference_combination_checked', { direction: direction.toLowerCase(), valid });
      });
    }
  })();</script>`
}

export function renderReferenceRoute(route, site, { navHtml, webmasterHtml, posthogKey = '', posthogHost = 'https://eu.i.posthog.com' }) {
  const canonical = `${site.origin}${route.path}`
  const content = route.kind === 'reference-procedure' ? renderProcedure() : route.kind === 'reference-document' ? renderDocument() : renderError()
  const hubCrumb = referenceHub.available ? `<a href="${referenceHub.path}">CUSTOMS REFERENCE</a> → ` : ''
  return `<!doctype html><html lang="en-GB"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><meta name="description" content="${escapeHtml(route.description)}"/><meta name="robots" content="index,follow,max-image-preview:large"/><meta name="theme-color" content="#17333d"/>${webmasterHtml}<link rel="canonical" href="${canonical}"/><link rel="icon" type="image/svg+xml" href="/favicon.svg"/><link rel="stylesheet" href="/static-routes.css"/><link rel="stylesheet" href="/authority-library.css"/><link rel="stylesheet" href="/customs-reference.css"/><meta property="og:type" content="article"/><meta property="og:site_name" content="Declarix"/><meta property="og:title" content="${escapeHtml(route.title)}"/><meta property="og:description" content="${escapeHtml(route.description)}"/><meta property="og:url" content="${canonical}"/><meta property="og:image" content="${site.origin}/og.jpg"/><meta name="twitter:card" content="summary_large_image"/><title>${escapeHtml(route.title)}</title><script type="application/ld+json">${jsonLd(route, site)}</script></head><body><div class="docket"><header class="masthead"><a class="wordmark" href="/">DECLARIX</a><div class="masthead-cell"><span>FREE CUSTOMS REFERENCE</span><strong>UNGATED</strong></div><a class="masthead-cta" data-authority-booking="masthead" href="${bookingHref(route, 'masthead')}">BOOK THE NUMBERS CALL</a></header><nav class="route-nav" aria-label="Primary">${navHtml}</nav><div class="breadcrumbs"><a href="/">HOME</a> → ${hubCrumb}${escapeHtml(route.eyebrow)}</div><main class="reference-main"><header class="authority-hero"><div><p class="eyebrow">${escapeHtml(route.eyebrow)}</p><h1>${escapeHtml(route.h1)}</h1><p>${escapeHtml(route.standfirst)}</p></div><aside><span>${escapeHtml(route.ref)}</span><strong>${escapeHtml(route.stamp).replaceAll('\n', '<br/>')}</strong><small>CHECKED<br/>${route.reviewedOn}</small></aside></header>${content}${renderDownload(route)}${renderBridge(route)}${referenceLinkStrip(route.key)}${renderSources(route)}<section class="cta-band authority-cta"><div><h2>Bring the real workflow to the numbers call.</h2><p>Map the source documents, current handling time, customs system and failure points. Leave with the best first workflow and an ROI range.</p></div><a class="button" data-authority-booking="bottom" href="${bookingHref(route, 'bottom')}">BOOK THE 20-MINUTE NUMBERS CALL</a></section><div class="source-stamp">SOURCE-LED CUSTOMS REFERENCE · CHECKED ${route.reviewedOn} · <a href="/editorial-policy/">SOURCES AND CORRECTIONS</a> · <a href="mailto:${site.contact}">${site.contact}</a></div></main><footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav></footer></div>${script(route, posthogKey, posthogHost)}</body></html>`
}

export const referenceRecordCounts = () => ({
  procedure: procedureRecords.length,
  additional: additionalRecords.length,
  document: documentRecords.length,
  status: documentData.status_codes.length,
  error: errorRecords.length,
  workarounds: errorData.workarounds.length,
})

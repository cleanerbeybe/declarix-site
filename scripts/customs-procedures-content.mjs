// Content for lane L11: UK special procedures, customs identifiers and the glossary.
// Every rule is traced to GOV.UK (checked 15 October 2026). Duty rates come from the UK Trade Tariff.
// Inline links use [label](/path/); links to routes that are not published render as plain text.

const PUBLISHED = '2026-10-15'
const REVIEWED = '2026-10-15'
const CHECKED = '15 OCT 2026'

const src = (title, url, updated, publisher = 'HM Revenue & Customs · GOV.UK') => ({ title, url, updated, publisher, checked: CHECKED })
const tariff = (code) => src(`UK Trade Tariff: commodity ${code}`, `https://www.trade-tariff.service.gov.uk/commodities/${code}`, 'LIVE DATA', 'UK Trade Tariff · GOV.UK')

const base = {
  publishedOn: PUBLISHED,
  reviewedOn: REVIEWED,
  checkedLabel: '15 October 2026',
}

// Shared Declarix pre-check lines (all from existing site copy and the product's documented pipeline).
const intake =
  'Declarix reads the whole job as it arrives: invoices, packing lists, transport documents, spreadsheets, scans, phone photos and the email chain. Typical processing is around 200 seconds before your clerk starts the review.'
const evidence = 'Every proposed field keeps its source document, page and line, so the clerk checks the evidence instead of hunting for it.'
const procedureGuard =
  'A guided procedure check tests the requested procedure code (DE 1/10) against the additional procedure code (DE 1/11) before any CDS data is generated, so a mismatched pair is caught before it reaches the filing screen.'
const handoff = 'The CDS-ready pack goes to Sequoia, Descartes e-Customs or your customer integration. Your clerk approves it and files through the system and permissions the desk already uses.'

// ---------------------------------------------------------------------------------------------
// Special procedures
// ---------------------------------------------------------------------------------------------

const cwSources = [
  src('Apply to operate a customs warehouse', 'https://www.gov.uk/guidance/apply-to-operate-a-customs-warehouse', '2 FEB 2026'),
  src('How to use a customs warehouse', 'https://www.gov.uk/guidance/how-to-use-a-customs-warehouse', '2 FEB 2026'),
  src('Special procedure: customs warehousing — receiving goods', 'https://www.gov.uk/guidance/special-procedure-customs-warehousing/receiving-goods-into-a-customs-warehouse', '30 APR 2025'),
  src('Special procedure: customs warehousing — discharge', 'https://www.gov.uk/guidance/special-procedure-customs-warehousing/discharge-of-the-customs-warehousing-procedure', '30 APR 2025'),
  src('Special procedure: customs warehousing — applying to be a warehousekeeper', 'https://www.gov.uk/guidance/special-procedure-customs-warehousing/applying-to-be-approved-as-a-warehousekeeper', '30 APR 2025'),
  src('Managing your customs warehouse', 'https://www.gov.uk/guidance/managing-your-customs-warehouse', '7 MAY 2024'),
  src('Using a special procedure without a prior authorisation', 'https://www.gov.uk/guidance/using-a-special-procedure-without-a-prior-authorisation', '16 JUL 2025'),
  src('CDS Appendix 1: Requested Procedure 71 — entry to a customs warehouse', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes-of-the-customs-declaration-service-cds/requested-procedure-71-entry-to-a-customs-warehouse-cw', '6 OCT 2026'),
  src('CDS Appendix 1: Requested Procedure 40 — release to free circulation', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes-of-the-customs-declaration-service-cds/requested-procedure-40-release-to-free-circulation', '6 OCT 2026'),
  src('CDS Appendix 1 (exports): Requested Procedure 31 — re-export', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes/requested-procedure-31-re-export-or-dispatch-of-non-union-goods-following-a-special-procedure', '13 JUL 2026'),
  src('DE 2/3 document and reference codes (Union), Appendix 5A', 'https://www.gov.uk/government/publications/data-element-23-documents-and-other-reference-codes-union-of-the-customs-declaration-service-cds', '6 OCT 2026'),
  tariff('6203423100'),
]

const customsWarehouse = {
  ...base,
  kind: 'procedure',
  slug: 'bonded-warehouse',
  path: '/customs-reference/bonded-warehouse/',
  shortName: 'Bonded warehouse',
  code: 'CPC 71 00',
  about: ['Customs warehousing', 'Bonded warehouse', 'Customs procedure code 7100', 'Customs Declaration Service'],
  term: {
    name: 'Customs warehousing',
    alt: 'Bonded warehouse',
    description: 'An HMRC-authorised site where imported goods are stored with Customs Duty and import VAT suspended until they are released to the UK market or re-exported.',
  },
  title: 'Bonded warehouse (customs warehousing) UK guide',
  description:
    'How a UK bonded warehouse works: duty and VAT suspended, authorisation, CPC 7100, 4071 and 3171, CDS data, a worked example and the errors to avoid.',
  h1: 'Bonded warehouse: pay duty when the stock leaves, not when it lands.',
  eyebrow: 'SPECIAL PROCEDURE · CUSTOMS WAREHOUSING · CPC 7100',
  standfirst:
    'A customs warehouse (the trade still says bonded warehouse) holds imported goods with Customs Duty and import VAT suspended. You pay when you release stock to the UK market, batch by batch, and pay nothing on stock you re-export.',
  ref: 'PROCEDURE 01 · STORAGE',
  stamp: '71\n00',
  answer: {
    heading: 'A bonded warehouse is an HMRC-authorised store where imported goods wait with Customs Duty and import VAT suspended.',
    body: [
      'HMRC calls it a customs warehouse. Goods enter under procedure code 7100. Duty and import VAT become due only when goods are released for free circulation (CPC 4071). Goods re-exported from the warehouse (CPC 3171) pay neither. There is no time limit on storage once HMRC authorises the warehouse.',
    ],
  },
  facts: [
    ['What is suspended', 'Customs Duty, import VAT and excise duty'],
    ['Entry code', 'CPC 7100 (DE 1/10), usually APC 000'],
    ['Release to UK market', 'CPC 4071'],
    ['Re-export', 'CPC 3171'],
    ['Authorisation', 'Full authorisation only (no authorisation by declaration)'],
    ['GB warehouse types', 'Public (R / CW1) and private (U / CWP)'],
    ['Storage limit', 'None after authorisation'],
    ['Stock records kept', 'At least 4 years after removal'],
  ],
  sections: [
    {
      id: 'who',
      label: '01 · WHO IT SUITS',
      title: 'Importers who sell over time, and anyone who re-exports.',
      paras: ['GOV.UK lists the cases a customs warehouse is built for. The most common on a broker desk are these:'],
      list: [
        'Distributors who sell imported stock over months. Duty and VAT follow the sales, not the arrival.',
        'Traders who re-export part of a consignment. Re-exported goods never pay UK duty or import VAT.',
        'Importers waiting for a licence. Goods that need a licence can be warehoused without it; the licence is needed at release.',
        'Logistics firms running a public warehouse for other people’s goods (the depositors).',
        'Suppliers of duty-free shops and ships’ or aircraft stores.',
        'Goods that may only receive usual forms of handling: preserving, improving presentation or preparing for sale. Real processing belongs in [inward processing](/customs-reference/inward-processing-relief/).',
      ],
    },
    {
      id: 'authorisation',
      label: '02 · AUTHORISATION',
      title: 'Apply to operate a customs warehouse.',
      paras: [
        'Only a full authorisation works for customs warehousing. GOV.UK states plainly that authorisation by declaration cannot be used for it. HMRC recommends applying at least 2 months before you want to start. Apply online, or use the print and post form if you cannot apply online. Great Britain and Northern Ireland need separate forms.',
      ],
      steps: [
        ['01', 'Meet the warehousekeeper test', 'Be established in the UK with an EORI number, be solvent, have a good customs compliance record, show a business need, keep inventory records and either make declarations or employ an agent who can.'],
        ['02', 'Choose public or private', 'A public warehouse (type R, code CW1) stores other people’s goods. A private warehouse (type U, code CWP) stores the holder’s own goods. Public type 2 and 3 codes cannot be used with a GB warehouse ID.'],
        ['03', 'Prepare the evidence', 'Written goods-in and goods-out procedures, stock record screenshots from your warehouse or duty management system, site plans, signatories, the procedure codes and commodity codes you will use, and letters of intent from customers for a public warehouse.'],
        ['04', 'Settle the guarantee', 'A guarantee for Customs Duty and VAT may be needed. AEO status, or meeting AEO conditions, removes that need. Your authorisation letter confirms the position.'],
        ['05', 'Run the warehouse', 'Goods must arrive within 5 working days of customs clearance. Report shortages or overages within 14 days of entry. Keep stock records in real time, or by midnight of the next operating day with a duty management system HMRC has approved.'],
      ],
    },
    {
      id: 'codes',
      label: '03 · KEY CODES',
      title: 'The procedure codes a warehouse entry uses.',
      paras: ['These codes come from CDS Appendix 1, updated 6 October 2026. The full list sits in our [customs procedure codes reference](/customs-reference/customs-procedure-codes/).'],
      table: {
        caption: 'Customs warehousing procedure codes (DE 1/10)',
        head: ['CPC', 'Use', 'Notes'],
        rows: [
          ['7100', 'Entry to a customs warehouse', 'APCs 000, 1VW (VAT-only warehousing), 2CD, 2CG or F15. Every item must go to the same warehouse.'],
          ['7151 / 7153', 'Entry after inward processing / temporary admission', 'Moves goods from another special procedure into the warehouse.'],
          ['7171', 'Transfer between customs warehouses', 'Declaration type A only. The receiving depositor declares; the dispatching warehouse goes in a PREMS statement.'],
          ['4071', 'Release to free circulation from a warehouse', 'Duty and VAT become payable. Not usable with the simplified declaration procedure.'],
          ['4471', 'Authorised use relief on release', 'Moves goods into [authorised use](/customs-reference/end-use-relief/).'],
          ['3171', 'Re-export from a warehouse', 'No UK duty or import VAT. Give the MRN to the warehousekeeper for their records.'],
        ],
      },
    },
    {
      id: 'data',
      label: '04 · DECLARATION DATA',
      title: 'The CDS fields that make or break the entry.',
      table: {
        caption: 'Customs warehousing data elements on CDS',
        head: ['Data element', 'What to declare'],
        rows: [
          ['DE 2/3', 'C517 for a private warehouse or C518 for a public type 1 warehouse, with the authorisation number (for example GBCWP…). C519 cannot be used for GB.'],
          ['DE 3/39', 'CWP or CW1 with the authorisation holder’s EORI, matching the DE 2/3 entry.'],
          ['DE 2/7', 'Warehouse type letter and ID: R (public type 1) or U (private).'],
          ['DE 2/1', 'On entry: the temporary storage or ENS reference, or a stock reference and DUCR. On removal: the warehouse stock reference (Z-ZZZ) and the DUCR for that removal.'],
          ['DE 2/2', 'PREMS where needed, and WHSRP if you will claim preference when goods are removed.'],
          ['DE 2/3 on removal', 'C505 guarantee and C506 deferment account when duty is paid by deferment.'],
          ['DE 5/23 on removal', 'GBBYCW followed by the warehouse ID.'],
        ],
      },
      after: [
        'Agents need prior written approval from the authorisation holder to enter goods into the warehouse, and must return a copy of the declaration to the holder.',
      ],
    },
  ],
  example: {
    title: 'Denim jeans from China: £27,520 not paid on arrival.',
    intro: [
      'A distributor imports 10,000 pairs of men’s cotton denim trousers, commodity code 6203 42 31 00. The UK Trade Tariff shows a 12% third-country duty and 20% import VAT (checked 15 October 2026). Customs value is £80,000. Incidental costs are left at £0 to keep the arithmetic clear.',
    ],
    rows: [
      ['Normal entry (CPC 4000): duty £80,000 × 12%', '£9,600'],
      ['Normal entry: VAT (£80,000 + £9,600) × 20%', '£17,920'],
      ['Normal entry: total due on arrival', '£27,520', true],
      ['Warehouse entry (CPC 7100): due on arrival', '£0', true],
      ['Month 2: release 3,000 pairs (£24,000) under 4071', '£2,880 duty + £5,376 VAT = £8,256'],
      ['Month 4: release 5,000 pairs (£40,000) under 4071', '£4,800 duty + £8,960 VAT = £13,760'],
      ['Month 6: re-export 2,000 pairs (£16,000) under 3171', '£0'],
      ['Total paid, in step with sales', '£22,016', true],
      ['Duty and VAT never charged on re-exported stock', '£5,504', true],
    ],
    notes: [
      'Duty and exchange rates are those in force when each removal declaration is accepted. Import VAT on release can also be accounted for through [postponed VAT accounting](/customs-workflows/postponed-vat-accounting-checklist/), which moves the cash again in the importer’s favour.',
    ],
  },
  errors: [
    ['Wrong procedure code or APC', 'Use the procedure and additional procedure codes named in the warehouse authorisation letter. GOV.UK warns that the wrong pair can leave the warehousekeeper liable for a customs debt.'],
    ['Authorisation codes that do not match', 'DE 2/3 C517 or C518 needs a matching DE 3/39 CWP or CW1 with the holder’s EORI. C519, CW2 and warehouse types S and T are not allowed with a GB warehouse ID.'],
    ['Wrong warehouse ID in DE 2/7', 'The procedure only works for premises authorised as a customs warehouse, and only for goods that warehouse is authorised to receive.'],
    ['Goods arriving late or stored outside the approved area', 'Goods must reach the warehouse within 5 working days of clearance. GOV.UK calls storage outside the approved warehouse, such as dockside, unacceptable.'],
    ['Stock released before clearance', 'Do not remove goods until CDS confirms they have cleared. Early removal is an unlawful removal from customs supervision.'],
    ['EIDR used to enter and remove', 'Entry in the declarant’s records cannot be used for both entry and removal. The simplified declaration procedure cannot be used with 4071 or 7171.'],
    ['Preference lost at removal', 'Note the proof of origin in the stock records on receipt and declare WHSRP on entry. HMRC cannot accept proof of origin more than 2 years after its issue date.'],
  ],
  declarix: {
    title: 'The warehouse pack arrives with the evidence already in place.',
    paras: [intake, evidence],
    list: [
      procedureGuard,
      'Previous document references, stock references, values, quantities and origin move into their entry rows from the customer’s paperwork, ready for the 7100 entry or the 4071 release.',
      'If the invoice, packing list and transport document disagree on quantities or values, the conflict appears beside its sources as a question, not as a silent guess.',
      handoff,
    ],
  },
  faqs: [
    ['Is a bonded warehouse the same as a customs warehouse?', 'Yes. “Bonded warehouse” is the trade name; HMRC’s term is customs warehouse, and the procedure is customs warehousing under CPC 71. Excise warehouses are a separate regime.'],
    ['How long can goods stay in a customs warehouse?', 'There is no time limit once HMRC authorises the warehouse. HMRC can order removal if goods threaten health or the environment, and perishable goods are limited by their shelf life.'],
    ['When do I pay duty on warehoused goods?', 'You pay when you release the goods for free circulation, using CPC 4071. Goods re-exported under CPC 3171 pay no UK duty or import VAT.'],
    ['Can I use a customs warehouse without a full authorisation?', 'No. GOV.UK states that authorisation by declaration cannot be used for customs warehousing. A depositor using someone else’s public warehouse does not need its own authorisation.'],
    ['Can goods be processed in a customs warehouse?', 'Only usual forms of handling are allowed, such as preserving, repacking or preparing goods for sale. Processing needs inward processing or authorised use.'],
  ],
  related: [
    ['/customs-reference/customs-procedure-codes/', 'DE 1/10', 'Customs procedure codes'],
    ['/customs-reference/customs-document-codes/', 'DE 2/3', 'Customs document codes'],
    ['/customs-workflows/duty-deferment-account-checklist/', 'DDA', 'Duty deferment checklist'],
  ],
  sources: cwSources,
}

const auSources = [
  src('Special procedure: authorised use (end-use)', 'https://www.gov.uk/guidance/authorised-use-end-use/authorised-use', '16 JUL 2025'),
  src('Apply to pay less duty on goods you import for specific uses', 'https://www.gov.uk/guidance/apply-to-pay-less-duty-on-goods-you-import-for-specific-uses', '16 JUL 2025'),
  src('Declare your goods to authorised use and completing authorised use', 'https://www.gov.uk/guidance/declare-your-goods-to-end-use-and-completing-end-use', '6 AUG 2026'),
  src('Check if you can pay less duty if your goods are imported into authorised use', 'https://www.gov.uk/guidance/check-if-you-can-pay-less-duty-if-your-goods-are-imported-into-end-use', '31 OCT 2024'),
  src('Authorised use: completion and discharging liability', 'https://www.gov.uk/guidance/authorised-use-end-use/completion-of-authorised-use-and-discharging-liability', '30 APR 2025'),
  src('Reference document for authorised use: eligible goods and authorised uses', 'https://www.gov.uk/government/publications/authorised-use-eligible-goods-and-authorised-uses', '8 SEP 2026'),
  src('Using a special procedure without a prior authorisation', 'https://www.gov.uk/guidance/using-a-special-procedure-without-a-prior-authorisation', '16 JUL 2025'),
  src('CDS Appendix 1: Requested Procedure 44 — end use', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes-of-the-customs-declaration-service-cds/requested-procedure-44-release-to-free-circulation-with-duty-relief-granted-under-the-end-use-special-procedure', '6 OCT 2026'),
  src('DE 2/3 document and reference codes (Union), Appendix 5A', 'https://www.gov.uk/government/publications/data-element-23-documents-and-other-reference-codes-union-of-the-customs-declaration-service-cds', '6 OCT 2026'),
  tariff('8408107900'),
]

const endUse = {
  ...base,
  kind: 'procedure',
  slug: 'end-use-relief',
  path: '/customs-reference/end-use-relief/',
  shortName: 'End use relief',
  code: 'CPC 44 00',
  about: ['End use relief', 'Authorised use', 'Customs procedure code 4400', 'Customs Declaration Service'],
  term: {
    name: 'Authorised use',
    alt: 'End use relief',
    description: 'A UK customs special procedure that gives a reduced or zero rate of Customs Duty on eligible goods put to a prescribed use within a set period.',
  },
  title: 'End use relief (authorised use) UK guide',
  description:
    'UK end use relief, now authorised use: eligible goods, full and one-off authorisation, CPC 4400, N990 and C990, bills of discharge and a worked example.',
  h1: 'End use relief: zero or reduced duty for goods with a job to do.',
  eyebrow: 'SPECIAL PROCEDURE · AUTHORISED USE (END USE) · CPC 4400',
  standfirst:
    'Authorised use, still called end use in Northern Ireland and on CDS code lists, cuts Customs Duty to a reduced or zero rate when eligible goods are put to a prescribed use, such as fitting parts to ships or aircraft, within the set period.',
  ref: 'PROCEDURE 02 · RELIEF',
  stamp: '44\n00',
  answer: {
    heading: 'End use relief lets a UK business pay a reduced or zero rate of Customs Duty on eligible goods put to a prescribed use.',
    body: [
      'In Great Britain HMRC now calls it authorised use. Goods enter free circulation under CPC 4400 and stay under customs supervision until they are used as authorised and the procedure is discharged with a bill of discharge. The relief covers Customs Duty (and anti-dumping duty on certain bicycle parts). Import VAT stays payable unless a separate VAT relief applies.',
    ],
  },
  facts: [
    ['What is relieved', 'Customs Duty (and some anti-dumping duty)'],
    ['Entry code', 'CPC 4400 (DE 1/10)'],
    ['Document code', 'N990, or C990 with APC 1SW for ships and platforms'],
    ['Full authorisation', 'Apply at least 1 month ahead; up to 5 years'],
    ['One-off route', 'Authorisation by declaration: 10 uses a year, £500,000 per import'],
    ['Time to use the goods', 'Usually within 1 year; 6 months under authorisation by declaration'],
    ['Bill of discharge', 'Within 30 days; HMRC sends no reminders'],
    ['Records kept', 'At least 3 years after disposal of all goods'],
  ],
  sections: [
    {
      id: 'who',
      label: '01 · WHO IT SUITS',
      title: 'Aircraft, ship-work, food processing and defence.',
      paras: [
        'GOV.UK says authorised use is most common in the aircraft, ship-work, military, oil and gas industries, and for food-industry goods such as cheese, fish and prawns. Goods must appear in HMRC’s reference document of eligible goods and authorised uses.',
      ],
      list: [
        'Airlines and maintenance firms importing civil aircraft parts.',
        'Shipyards and repairers fitting parts to eligible ships, boats and drilling or production platforms.',
        'Food manufacturers processing fish, prawns or cheese for processed cheese.',
        'Bicycle assemblers claiming relief from anti-dumping duty on certain parts from China.',
        'Suppliers to the UK armed forces (APC 2MO).',
      ],
    },
    {
      id: 'authorisation',
      label: '02 · AUTHORISATION',
      title: 'Four ways to get authorised.',
      table: {
        caption: 'Authorised use authorisation routes on GOV.UK',
        head: ['Route', 'How it works', 'Limits'],
        rows: [
          ['Full authorisation', 'Apply online or by the print and post form, at least one month before importing.', 'Granted for up to 5 years. Separate applications for GB and NI.'],
          ['Authorisation by declaration', 'HMRC accepting your import declaration is your authorisation.', 'Up to 10 times in a rolling year, up to £500,000 per import. Security for duty and VAT usually needed. Not for anti-dumping goods or simplified declarations.'],
          ['Retrospective authorisation', 'A full authorisation with an earlier start date.', 'Exceptional circumstances only, no retrospective grant in the previous 3 years, back-dated no more than one year.'],
          ['Northern Ireland and EU', 'Email HMRC with your XI EORI for an EU Customs Trader Portal link.', 'Reply within 5 days.'],
        ],
      },
      after: [
        'Applicants must be established in the UK with a GB EORI, solvent, compliant and able to keep records. Direct representation is allowed; indirect representation is not. Agents need the holder’s prior written approval.',
      ],
    },
    {
      id: 'codes',
      label: '03 · KEY CODES',
      title: 'Procedure codes and additional codes.',
      paras: ['From CDS Appendix 1 and 2, updated 6 October 2026. See the full [customs procedure codes reference](/customs-reference/customs-procedure-codes/).'],
      table: {
        caption: 'Authorised use procedure codes',
        head: ['Code', 'Meaning'],
        rows: [
          ['4400', 'Authorised use relief, no previous procedure'],
          ['4451 / 4453', 'Authorised use after inward processing / temporary admission'],
          ['4471', 'Authorised use on goods released from a customs warehouse'],
          ['1044', 'Permanent export of goods previously entered to end use (keep export evidence for the bill of discharge)'],
          ['APC 1SW', 'Eligible goods entered under shipwork or platform end use'],
          ['APC 2MO', 'Goods imported by the MoD or military forces with duty relief'],
          ['APC 1RV', 'Relief from VAT where no other VAT relief or exemption applies'],
        ],
      },
    },
    {
      id: 'data',
      label: '04 · DECLARATION DATA',
      title: 'What the CDS entry carries.',
      table: {
        caption: 'Authorised use data elements on CDS',
        head: ['Data element', 'Full authorisation', 'Authorisation by declaration'],
        rows: [
          ['DE 2/3', 'N990 (GB EUS + number), or C990 for ships and platforms', 'N990 with status XW and “Waiver claimed”'],
          ['DE 3/39', 'EUS with the holder’s EORI', 'Not completed'],
          ['DE 2/2', 'GEN45 consignment or work number if allocated', '00100 and ABDIN, both required'],
          ['DE 8/2', '0 (guarantee waiver) or 1 (guarantee held)', '3'],
          ['DE 5/27', 'Supervising office on the authorisation (optional on GB entries)', 'GBBEL004, the National Imports Relief Unit'],
          ['DE 2/3 extra', 'D019 when an anti-dumping measure applies, with N990 or C990', 'Anti-dumping goods cannot use this route'],
        ],
      },
    },
  ],
  example: {
    title: 'A marine engine for a ship repair: £3,600 saved.',
    intro: [
      'A UK ship-repair yard with a full ship-work authorisation imports a new 750 kW marine diesel propulsion engine from the USA, commodity code 8408 10 79 00. The UK Trade Tariff shows 2% third-country duty, a 0% ship-work suspension when document code C990 is declared, and 20% VAT (checked 15 October 2026). Customs value is £150,000.',
    ],
    rows: [
      ['Normal entry (CPC 4000): duty £150,000 × 2%', '£3,000'],
      ['Normal entry: VAT (£150,000 + £3,000) × 20%', '£30,600'],
      ['Normal entry: total', '£33,600', true],
      ['Authorised use (CPC 4400, APC 1SW, C990): duty', '£0'],
      ['Authorised use: VAT £150,000 × 20%', '£30,000'],
      ['Authorised use: total', '£30,000', true],
      ['Saving per engine', '£3,600', true],
    ],
    notes: [
      'The saving is the £3,000 duty plus £600 of VAT that would have been charged on that duty. The relief is complete when the engine is fitted to the vessel; the yard then sends its bill of discharge.',
    ],
  },
  errors: [
    ['Authorisation number missing or wrong code', 'Ships and platforms need C990 with APC 1SW; other goods need N990. Full authorisations also need EUS and the holder’s EORI in DE 3/39.'],
    ['One-off route used where it is not allowed', 'Authorisation by declaration cannot cover anti-dumping goods or simplified declarations, more than 10 uses in 12 months, or a goods item over £500,000. It also needs 00100 and ABDIN, N990 with status XW, and DE 8/2 code 3.'],
    ['Late or missing bill of discharge', 'Send it within 30 days, including nil monthly returns. HMRC sends no reminders and a missing bill can lead to a duty liability and a civil penalty.'],
    ['Goods not used in time', 'Ask the supervising office for an extension before the period ends, not after.'],
    ['Indirect representation', 'Indirect representation is not allowed under authorised use. Agents need the holder’s prior written approval.'],
    ['Diversion or transfer without approval', 'Selling or using the goods another way creates a customs debt. Goods move to another holder only through a transfer of rights and obligations approved by HMRC.'],
    ['Ineligible goods or the wrong commodity code', 'Goods outside the eligible list pay the full duty, plus any anti-dumping duty.'],
  ],
  declarix: {
    title: 'The relief stays visible from the first document.',
    paras: [intake, evidence],
    list: [
      procedureGuard,
      'Commodity lines, values and origin come from the invoice and packing list with their sources attached, so the reviewer can confirm eligibility against the authorisation quickly.',
      'Conflicting or missing facts, such as a quantity mismatch between invoice and packing list, show as review questions before approval.',
      handoff,
    ],
  },
  faqs: [
    ['Is end use relief the same as authorised use?', 'Yes. Great Britain now calls the procedure authorised use; Northern Ireland and the CDS code lists still say end use. The procedure code is 44.'],
    ['Does end use relief cover import VAT?', 'No. Authorised use relieves Customs Duty. Import VAT stays payable unless a separate VAT relief applies, for example APC 1RV.'],
    ['Do I need an authorisation before importing?', 'Usually yes: apply for a full authorisation at least a month before importing. Occasional importers can use authorisation by declaration up to 10 times a year, up to £500,000 per import.'],
    ['When is a bill of discharge due?', 'Within 30 days of the end of the agreed discharge period, or within 30 days of discharge under authorisation by declaration. Monthly returns are due 30 days after month end.'],
    ['How do I know if my goods are eligible?', 'Check HMRC’s reference document of eligible goods and authorised uses, and look for an authorised use measure on the commodity code in the UK Trade Tariff.'],
  ],
  related: [
    ['/customs-reference/customs-procedure-codes/', 'DE 1/10', 'Customs procedure codes'],
    ['/customs-reference/customs-document-codes/', 'DE 2/3', 'Customs document codes'],
    ['/tools/commodity-code-checker/', 'TOOL', 'Commodity code checker'],
  ],
  sources: auSources,
}

const taSources = [
  src('Check if you can get import duty relief on goods using Temporary Admission', 'https://www.gov.uk/guidance/check-if-you-can-get-import-duty-relief-on-goods-using-temporary-admission', '8 SEP 2026'),
  src('Import goods to the UK temporarily', 'https://www.gov.uk/guidance/import-goods-to-the-uk-or-eu-temporarily', '16 JUL 2025'),
  src('Apply to import goods temporarily to the UK', 'https://www.gov.uk/guidance/apply-to-import-goods-temporarily-to-the-uk-or-eu', '1 JUL 2026'),
  src('Temporary admission handbook: applying', 'https://www.gov.uk/guidance/temporary-admission-customs-technical-handbook/applying-for-temporary-admission', '22 MAY 2026'),
  src('Temporary admission handbook: authorisation by declaration', 'https://www.gov.uk/guidance/temporary-admission-customs-technical-handbook/authorisation-by-declaration', '4 AUG 2025'),
  src('Temporary admission handbook: partial relief', 'https://www.gov.uk/guidance/temporary-admission-customs-technical-handbook/partial-relief', '4 AUG 2025'),
  src('Temporary admission handbook: time limits', 'https://www.gov.uk/guidance/temporary-admission-customs-technical-handbook/time-limits-for-goods-under-temporary-admission', '4 AUG 2025'),
  src('Temporary admission handbook: discharging goods', 'https://www.gov.uk/guidance/temporary-admission-customs-technical-handbook/discharging-goods-from-temporary-admission', '4 AUG 2025'),
  src('Temporary admission handbook: the Customs Declaration Service', 'https://www.gov.uk/guidance/temporary-admission-customs-technical-handbook/the-customs-declaration-service', '4 AUG 2025'),
  src('Temporary admission handbook: ATA carnets', 'https://www.gov.uk/guidance/temporary-admission-customs-technical-handbook/ata-carnets', '4 AUG 2025'),
  src('CDS Appendix 1: Requested Procedure 53 — entry to temporary admission', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes-of-the-customs-declaration-service-cds/requested-procedure-53-entry-to-temporary-admission', '6 OCT 2026'),
  src('CDS Appendix 2A: additional procedure codes, D series', 'https://www.gov.uk/government/publications/appendix-2-de-111-additional-procedure-codes-of-the-customs-declaration-service-cds/additional-procedure-code-d-series-appendix-2a', '6 OCT 2026'),
  tariff('8703801090'),
  tariff('8458112000'),
]

const temporaryAdmission = {
  ...base,
  kind: 'procedure',
  slug: 'temporary-admission',
  path: '/customs-reference/temporary-admission/',
  shortName: 'Temporary admission',
  code: 'CPC 53 00',
  about: ['Temporary admission', 'ATA carnet', 'Customs procedure code 5300', 'Customs Declaration Service'],
  term: {
    name: 'Temporary admission',
    description: 'A UK customs special procedure that lets non-UK goods enter for a specific use and leave again, with full or partial relief from import duty and VAT.',
  },
  title: 'Temporary admission (TA) UK customs guide',
  description:
    'UK temporary admission: full and partial relief, the six authorisation routes, CPC 5300 and D codes, ATA carnets, worked examples and common errors.',
  h1: 'Temporary admission: bring it in, use it, send it back duty-free.',
  eyebrow: 'SPECIAL PROCEDURE · TEMPORARY ADMISSION · CPC 5300',
  standfirst:
    'Temporary admission lets non-UK goods come into the UK for a set purpose, such as an exhibition, testing or professional work, with full relief from import duty and VAT, provided they leave again unaltered within the time limit.',
  ref: 'PROCEDURE 03 · TEMPORARY USE',
  stamp: '53\n00',
  answer: {
    heading: 'Temporary admission is a UK special procedure for non-UK goods that come in for a specific use and then leave again.',
    body: [
      'Eligible goods get full relief: no import duty and no import VAT. Goods outside the eligible list can use partial relief, paying 3% of the full duty for each month or part month plus import VAT. Goods enter under CPC 5300 with one D-series additional procedure code and usually leave under CPC 3153 within 24 months.',
    ],
  },
  facts: [
    ['Full relief', 'No import duty and no import VAT on eligible goods'],
    ['Partial relief', '3% of full duty per month (APC D51) plus import VAT'],
    ['Entry code', 'CPC 5300 with one D-series APC'],
    ['Exit codes', '3153 re-export; 4053 release to free circulation'],
    ['Usual time limit', '24 months (48 for works of art and antiques)'],
    ['Authorisation document', 'C516 (TEA) for full authorisations'],
    ['Representation', 'Direct only; indirect is not allowed'],
    ['Records kept', 'At least 4 years after discharge'],
  ],
  sections: [
    {
      id: 'who',
      label: '01 · WHO IT SUITS',
      title: 'Exhibitions, samples, testing and professional kit.',
      paras: ['GOV.UK lists the uses that qualify for full relief. Each has its own D-series code and conditions:'],
      table: {
        caption: 'Common temporary admission uses and their D codes',
        head: ['Use', 'APC', 'Key condition'],
        rows: [
          ['Goods for exhibitions and events', 'D23', 'The event is not organised purely for commercial sale. Goods may still be sold there.'],
          ['Commercial samples', 'D21', 'Shown or demonstrated only, in reasonable quantities, not for sale.'],
          ['Professional equipment', 'D12', 'Owned by a person established outside the UK. Not for industrial manufacture or construction.'],
          ['Goods for tests or demonstrations', 'D18', 'Prior authorisation needed.'],
          ['Acceptance tests under a sales contract', 'D19', 'The test is a condition of the sale.'],
          ['Works of art, collectors’ items, antiques', 'D25', 'For exhibition with a view to sale; up to 48 months.'],
          ['Goods with no full-relief category', 'D51', 'Partial relief; full authorisation and a guarantee needed.'],
        ],
      },
      after: ['Processing is not allowed under temporary admission. Maintenance to keep the goods in condition is allowed.'],
    },
    {
      id: 'authorisation',
      label: '02 · AUTHORISATION',
      title: 'Six ways in, from full authorisation to walking through the green channel.',
      steps: [
        ['01', 'Full authorisation (form SP5)', 'Apply online or by post at least a month before importing. Granted for 3 to 5 years and reusable. In GB no comprehensive guarantee is needed unless HMRC asks for one.'],
        ['02', 'Authorisation by declaration', 'HMRC accepting the import declaration is the authorisation. No value or frequency limits, but a refundable guarantee or security is needed. Not for partial relief, simplified declarations or anti-dumping goods.'],
        ['03', 'Oral declaration (form C108)', 'Accompanied goods only: present two copies of C108 to Border Force. Not accepted at GVMS locations such as Dover and Eurotunnel.'],
        ['04', 'Declaration by conduct', 'Walk through the green channel or drive past the control point with eligible goods such as personal effects or portable instruments.'],
        ['05', 'Retrospective authorisation', 'Exceptional cases only, back-dated no more than 12 months, and not if one was granted in the last 3 years.'],
        ['06', 'ATA carnet', 'An international goods passport issued by UK chambers of commerce. It replaces the import and export declarations in ATA countries, is valid for up to one year and can be used many times in that year.'],
      ],
    },
    {
      id: 'data',
      label: '03 · DECLARATION DATA',
      title: 'The CDS fields that decide whether the relief holds.',
      paras: ['From CDS Appendix 1 (Requested Procedure 53) and Appendix 2A, updated 6 October 2026. Full code lists sit in our [customs procedure codes reference](/customs-reference/customs-procedure-codes/).'],
      table: {
        caption: 'Temporary admission data elements on CDS',
        head: ['Data element', 'What to declare'],
        rows: [
          ['DE 1/10', '5300 on entry; 3153 on re-export; 4053 if goods stay in the UK; 5353 to transfer to another TA holder.'],
          ['DE 1/11', 'Exactly one D-series code per item. The re-export D code must match the entry D code.'],
          ['DE 2/2', '00100 and ABDIN for authorisation by declaration; 00100 and ABDOU on removal; GEN33 for exhibitions; OVR01 for partial relief.'],
          ['DE 2/3', 'C516 with GB TEA and the authorisation number (full authorisation). C505 and C506 where deferment secures the duty.'],
          ['DE 3/39', 'TEA with the holder’s EORI. Not needed for authorisation by declaration.'],
          ['DE 2/1 on re-export', 'The MRN of the declaration that entered the goods to temporary admission.'],
          ['DE 8/2', '3 for authorisation by declaration; 0 or 1 for full authorisation.'],
          ['DE 5/27', 'GBSFY001 for authorisation by declaration (optional on GB entries).'],
        ],
      },
      after: ['The importer must be the authorisation holder. Preferential duty rates do not apply to goods entered under 53 codes.'],
    },
  ],
  example: {
    title: 'An electric car at a UK motor show: £14,400 relieved.',
    intro: [
      'A non-UK manufacturer shows a new battery-electric car at a UK motor show, commodity code 8703 80 10 90. The UK Trade Tariff shows 10% third-country duty and 20% VAT (checked 15 October 2026). Customs value is £45,000. The car enters under CPC 5300 with APC D23 by authorisation by declaration and leaves under CPC 3153.',
    ],
    rows: [
      ['Duty that would be due: £45,000 × 10%', '£4,500'],
      ['Import VAT that would be due: (£45,000 + £4,500) × 20%', '£9,900'],
      ['Paid under temporary admission', '£0', true],
      ['Total relieved', '£14,400', true],
      ['Partial relief comparison: CNC lathe 8458 11 20 00, £180,000, 2% duty', 'Full duty £3,600'],
      ['Partial relief: 3% of £3,600 × 7 months', '£756', true],
      ['Duty saved against free circulation', '£2,844', true],
    ],
    notes: [
      'If the car is sold at the show and stays in the UK, the seller makes a CPC 4053 entry with the sales invoice within 90 days of payment and pays the duty and VAT then. The security lodged on entry is claimed back after re-export.',
    ],
  },
  errors: [
    ['Wrong D code', 'D01 is pallets; exhibitions use D23. The D code on re-export must match the one used on entry.'],
    ['More than one D code on an item', 'Declare exactly one D-series code per goods item, or CDS rejects the declaration.'],
    ['Authorisation by declaration without its statements', 'Entry needs 00100 and ABDIN; removal needs 00100 and ABDOU. The route cannot be combined with simplified declarations or partial relief.'],
    ['Indirect representation', 'Not allowed for temporary admission. Agents need the holder’s prior written approval.'],
    ['Exhibition goods sold without a diversion entry', 'Make the 4053 entry with the sales invoice within 90 days of payment, and do not release goods to the buyer until it is accepted.'],
    ['Extension asked for too late', 'Request any extension before the time limit ends.'],
    ['Goods destroyed without approval', 'HMRC must approve destruction at least 5 days in advance, or duty and VAT may become due.'],
  ],
  declarix: {
    title: 'The temporary admission entry, built from the paperwork.',
    paras: [intake, evidence],
    list: [
      procedureGuard,
      'Serial numbers, quantities and values come from the pro forma invoice and packing list with their sources pinned, so the reviewer can match the goods that leave against the goods that arrived.',
      'Missing facts, such as an unstated event date or a value that differs between documents, appear as review questions instead of guesses.',
      handoff,
    ],
  },
  faqs: [
    ['What is temporary admission in customs?', 'It is a UK special procedure that lets non-UK goods enter for a specific use, such as an exhibition or testing, with relief from import duty and VAT, provided they leave again unaltered within the time limit.'],
    ['How long can goods stay under temporary admission?', 'Usually up to 24 months, and up to 48 months for works of art, collectors’ items and antiques. Some goods have shorter limits, such as 3 months for goods imported occasionally.'],
    ['What is the difference between temporary admission and an ATA carnet?', 'An ATA carnet is one way to use temporary admission. It replaces the customs declarations in ATA countries and is valid for up to one year.'],
    ['How does partial relief work?', 'You pay import VAT at import and 3% of the full duty for each month or part month the goods stay. It needs a full authorisation and APC D51.'],
    ['Can goods under temporary admission be sold?', 'Yes, in some cases, such as exhibition goods. The buyer’s side then needs a 4053 entry within 90 days of payment, paying the duty and VAT due.'],
  ],
  related: [
    ['/customs-reference/customs-procedure-codes/', 'DE 1/10', 'Customs procedure codes'],
    ['/customs-workflows/gmr-gvms-checklist/', 'GMR', 'GMR and GVMS checklist'],
    ['/customs-workflows/t1-ncts-transit-checklist/', 'T1', 'T1 and NCTS transit checklist'],
  ],
  sources: taSources,
}

const rgrSources = [
  src('Pay less import duty and VAT when re-importing goods to the UK', 'https://www.gov.uk/guidance/pay-less-import-duty-and-vat-when-re-importing-goods-to-the-uk-and-eu', '26 NOV 2024'),
  src('Using outward processing to process or repair your goods', 'https://www.gov.uk/guidance/using-outward-processing-to-process-or-repair-your-goods', '8 MAY 2026'),
  src('Declare returned goods relief using duplicate lists (C&E1246)', 'https://www.gov.uk/government/publications/import-and-export-returned-goods-relief-declarations-for-using-duplicate-lists-ce1246', '31 DEC 2020'),
  src('CDS Appendix 1: Requested Procedure 61 — re-importation', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes-of-the-customs-declaration-service-cds/requested-procedure-61-re-importation-with-simultaneous-release-to-free-circulation', '6 OCT 2026'),
  src('CDS Appendix 1 (exports): Requested Procedure 23 — temporary export for RGR', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes/requested-procedure-23-temporary-export-for-return-of-goods-in-the-unaltered-state-returned-goods-relief', '13 JUL 2026'),
  src('CDS Appendix 2A: additional procedure codes, F series', 'https://www.gov.uk/government/publications/appendix-2-de-111-additional-procedure-codes-of-the-customs-declaration-service-cds/additional-procedure-code-f-series-appendix-2a', '6 OCT 2026'),
  src('DE 2/3 document and reference codes (National)', 'https://www.gov.uk/guidance/data-element-23-documents-and-other-reference-codes-national-of-the-customs-declaration-service-cds', '4 SEP 2026'),
  tariff('6110209100'),
]

const returnedGoods = {
  ...base,
  kind: 'procedure',
  slug: 'returned-goods-relief',
  path: '/customs-reference/returned-goods-relief/',
  shortName: 'Returned goods relief',
  code: 'CPC 61 23',
  about: ['Returned goods relief', 'RGR', 'Customs procedure code 6123', 'Customs Declaration Service'],
  term: {
    name: 'Returned goods relief',
    alt: 'RGR',
    description: 'Relief from UK import duty, and import VAT where the exporter and importer are the same, for goods exported from the UK that return unaltered within 3 years.',
  },
  title: 'Returned goods relief (RGR) UK customs guide',
  description:
    'Returned goods relief explained: the 3-year rule, VAT conditions, CPC 6123 and 6110, F01 and F05, the export MRN in DE 2/1 and a worked UK example.',
  h1: 'Returned goods relief: bring your own goods home without paying twice.',
  eyebrow: 'SPECIAL PROCEDURE · RETURNED GOODS RELIEF · CPC 6123',
  standfirst:
    'Goods that leave the UK and come back unaltered within 3 years can return free of import duty, and free of import VAT when the exporter and importer are the same. No prior authorisation is needed; the claim is made on the import declaration.',
  ref: 'PROCEDURE 04 · RE-IMPORT',
  stamp: '61\n23',
  answer: {
    heading: 'Returned goods relief (RGR) removes UK import duty on goods that were exported from the UK and come back unaltered within 3 years.',
    body: [
      'Import VAT is relieved too when the same person exported and re-imports the goods. Claim it on the import declaration: CPC 6123 for goods exported temporarily, or 6110 for goods exported permanently, with APC F05 (duty and VAT) or F01 (duty only), and quote the export MRN as the previous document.',
    ],
  },
  facts: [
    ['What is relieved', 'Import duty; import VAT if exporter and importer match'],
    ['Time limit', 'Re-import within 3 years of export'],
    ['Authorisation', 'None needed; claim on the import declaration'],
    ['After temporary export (2300)', 'CPC 6123'],
    ['After permanent export (1040)', 'CPC 6110'],
    ['Additional codes', 'F05 duty and VAT; F01 duty only'],
    ['Previous document', 'Z-MRN with the export MRN in DE 2/1'],
    ['Records kept', 'At least 4 years'],
  ],
  sections: [
    {
      id: 'who',
      label: '01 · WHO IT SUITS',
      title: 'Unsold stock, rejected orders and kit back from a show.',
      list: [
        'Brands whose overseas customer returns goods as defective or not as ordered.',
        'Exporters bringing back stock that did not sell abroad, or trade-fair goods that were not consumed or sold.',
        'Firms whose equipment returns from hire, lease or loan outside the UK.',
        'Goods that travelled on an ATA carnet and come home.',
        'Reusable pallets, containers and packaging.',
      ],
      after: [
        'Goods sent abroad to be repaired or processed do not qualify. That is [outward processing relief](/customs-reference/outward-processing-relief/), which charges duty only on the value of the work done.',
      ],
    },
    {
      id: 'conditions',
      label: '02 · CONDITIONS',
      title: 'Four conditions, all checked at the border.',
      steps: [
        ['01', 'Unaltered goods', 'The goods come back in the same state, apart from work to keep them in working order. Upgrades that add value break the relief.'],
        ['02', 'Within 3 years', 'Re-import within 3 years of export. HMRC can waive the limit in listed cases, such as long-term hire or exhibitions; declare GEN03 when claiming the waiver.'],
        ['03', 'Free circulation at export', 'The goods were in free circulation in the UK when they left.'],
        ['04', 'Same person for VAT', 'For VAT relief the exporter and the importer must be the same, with the identical EORI including the country prefix. Do not declare VATZ on the 2300 export if you will claim VAT relief on return.'],
      ],
    },
    {
      id: 'data',
      label: '03 · DECLARATION DATA',
      title: 'Link the return to its export.',
      paras: ['From CDS Appendix 1 (Requested Procedures 61 and 23) and Appendix 2A, F series. See the full [customs procedure codes reference](/customs-reference/customs-procedure-codes/).'],
      table: {
        caption: 'Returned goods relief data elements on CDS',
        head: ['Data element', 'What to declare'],
        rows: [
          ['DE 1/10 (export)', '2300 for a temporary export intended to return; 1040 for a permanent export.'],
          ['DE 1/10 (import)', '6123 after a 2300 export; 6110 after a 1040 export; 7123 to enter a customs warehouse after RGR.'],
          ['DE 1/11', 'F05 for duty and VAT relief; F01 for duty only; 1RL for RGR with authorised use.'],
          ['DE 2/1', 'Z-MRN with the export declaration MRN. Without an MRN, use ZZZ with the reference of the alternative evidence.'],
          ['DE 2/2', 'GEN45 with the consignment reference followed by “Returned goods”; GEN03 when claiming a waiver of the 3-year limit.'],
          ['DE 2/3', '1314 for form C1314 when HMRC asks for it; C605 for an INF3 where triangulation applies; 1246 for duplicate lists.'],
          ['DE 3/15 or 3/16', 'The same EORI as the exporter in DE 3/1 or 3/2, for VAT relief under F05.'],
        ],
      },
    },
  ],
  example: {
    title: 'Jumpers back from a US tour: £10,320 relieved.',
    intro: [
      'A GB clothing brand sends 2,000 men’s knitted cotton jumpers, commodity code 6110 20 91 00, to a US trade event under CPC 2300. They return unsold 5 months later. The UK Trade Tariff shows 12% third-country duty and 20% VAT for men’s clothing (checked 15 October 2026). Customs value on return is £30,000.',
    ],
    rows: [
      ['Without relief: duty £30,000 × 12%', '£3,600'],
      ['Without relief: VAT (£30,000 + £3,600) × 20%', '£6,720'],
      ['Without relief: total', '£10,320', true],
      ['With RGR: CPC 6123, APC F05, export MRN in DE 2/1', '£0', true],
      ['Total relieved', '£10,320', true],
      ['If the importer’s EORI differs from the exporter’s (F01)', 'Duty £0; VAT £6,000'],
    ],
    notes: [
      'UK-made goods get no preferential duty rate on the way back in, so without RGR they would pay full third-country duty. The relief turns on one link: the export MRN and a matching EORI.',
    ],
  },
  errors: [
    ['Different EORI at export and import', 'VAT relief under F05 needs the identical EORI, including the country prefix, on both declarations.'],
    ['VATZ declared on the 2300 export', 'Not permitted when VAT relief will be claimed on return.'],
    ['RGR claimed for goods repaired abroad', 'Goods exported for repair or processing use outward processing instead.'],
    ['No export MRN in DE 2/1', 'Quote Z-MRN with the export MRN, or ZZZ with the alternative evidence reference.'],
    ['Wrong 61 code', '6110 is for goods exported permanently; 6123 is for goods exported temporarily.'],
    ['Over 3 years without a waiver', 'Declare GEN03 and have the National Imports Relief Unit’s agreement, or the relief fails.'],
    ['Goods altered or upgraded abroad', 'Anything beyond maintenance removes the relief.'],
  ],
  declarix: {
    title: 'The return pack carries its export history.',
    paras: [intake, evidence],
    list: [
      procedureGuard,
      'Previous document references, including the export MRN, move into DE 2/1 from the paperwork with their source shown.',
      'Party details are extracted from each document, so an exporter and importer mismatch shows up before approval, while the VAT relief can still be protected.',
      handoff,
    ],
  },
  faqs: [
    ['What is returned goods relief?', 'It is relief from UK import duty, and import VAT where the exporter and importer are the same, for goods exported from the UK that return unaltered within 3 years.'],
    ['Do I need an authorisation for RGR?', 'No. You claim the relief on the import declaration with the right procedure code, additional procedure code and the export MRN.'],
    ['What is the difference between CPC 6123 and 6110?', '6123 is for goods exported temporarily under CPC 2300. 6110 is for goods exported permanently, for example under 1040.'],
    ['Does RGR cover import VAT?', 'Yes, when the person who exported the goods is the person who re-imports them, with the same EORI. Use APC F05. Otherwise use F01 for duty relief only.'],
    ['Can I use RGR for goods repaired abroad?', 'No. Goods sent abroad for repair or processing return under outward processing, which charges duty only on the value of the work.'],
  ],
  related: [
    ['/customs-reference/customs-procedure-codes/', 'DE 1/10', 'Customs procedure codes'],
    ['/customs-workflows/postponed-vat-accounting-checklist/', 'PVA', 'Postponed VAT accounting checklist'],
  ],
  sources: rgrSources,
}

const ipSources = [
  src('Apply to delay or pay less duty on goods you import to process or repair', 'https://www.gov.uk/guidance/apply-to-delay-or-pay-less-duty-on-goods-you-import-to-process-or-repair', '16 JUL 2025'),
  src('Using inward processing to process or repair your goods', 'https://www.gov.uk/guidance/using-inward-processing-to-process-or-repair-your-goods', '30 SEP 2022'),
  src('Moving processed or repaired goods into free circulation or re-exporting them', 'https://www.gov.uk/guidance/moving-processed-or-repaired-goods-into-free-circulation-or-re-exporting-them', '23 SEP 2026'),
  src('Using a special procedure without a prior authorisation', 'https://www.gov.uk/guidance/using-a-special-procedure-without-a-prior-authorisation', '16 JUL 2025'),
  src('Get an economic code to apply for inward processing', 'https://www.gov.uk/guidance/get-an-economic-code-to-apply-for-inward-processing', '1 AUG 2024'),
  src('Special procedure: inward processing — types of authorisation', 'https://www.gov.uk/guidance/special-procedure-inward-processing/types-of-inward-processing-authorisations', '16 JUL 2025'),
  src('Special procedure: inward processing — failing to submit a bill of discharge', 'https://www.gov.uk/guidance/special-procedure-inward-processing/what-happens-if-an-importer-fails-to-submit-bill-of-discharge', '30 APR 2025'),
  src('Special procedure: inward processing — how duty is calculated on release', 'https://www.gov.uk/guidance/special-procedure-inward-processing/how-duty-is-calculated-for-free-circulation-goods', '30 APR 2025'),
  src('CDS Appendix 1: Requested Procedure 51 — entry to inward processing', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes-of-the-customs-declaration-service-cds/requested-procedure-51-entry-to-inward-processing', '6 OCT 2026'),
  src('CDS Appendix 1: Requested Procedure 40 — release to free circulation', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes-of-the-customs-declaration-service-cds/requested-procedure-40-release-to-free-circulation', '6 OCT 2026'),
  src('CDS Appendix 1 (exports): Requested Procedure 31 — re-export', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes/requested-procedure-31-re-export-or-dispatch-of-non-union-goods-following-a-special-procedure', '13 JUL 2026'),
  src('DE 2/3 document and reference codes (Union), Appendix 5A', 'https://www.gov.uk/government/publications/data-element-23-documents-and-other-reference-codes-union-of-the-customs-declaration-service-cds', '6 OCT 2026'),
  tariff('5407520000'),
]

const inwardProcessing = {
  ...base,
  kind: 'procedure',
  slug: 'inward-processing-relief',
  path: '/customs-reference/inward-processing-relief/',
  shortName: 'Inward processing relief',
  code: 'CPC 51 00',
  about: ['Inward processing relief', 'IPR', 'Customs procedure code 5100', 'Customs Declaration Service'],
  term: {
    name: 'Inward processing',
    alt: 'Inward processing relief (IPR)',
    description: 'A UK special procedure that suspends Customs Duty and import VAT on goods imported for processing or repair; nothing is paid if the products are re-exported.',
  },
  title: 'Inward processing relief (IPR) UK guide',
  description:
    'Inward processing relief in the UK: duty and VAT suspended on goods processed or repaired, authorisation, CPC 5100, 3151 and 4051, and a worked example.',
  h1: 'Inward processing: import, make, export, and pay no duty on the way through.',
  eyebrow: 'SPECIAL PROCEDURE · INWARD PROCESSING · CPC 5100',
  standfirst:
    'Inward processing relief suspends Customs Duty and import VAT on goods you import to process or repair. Re-export the products and nothing is paid. Keep some in the UK and you pay only on those, at a basis you choose when you apply.',
  ref: 'PROCEDURE 05 · PROCESSING',
  stamp: '51\n00',
  answer: {
    heading: 'Inward processing relief (IPR) suspends Customs Duty and import VAT on goods imported for processing or repair in the UK.',
    body: [
      'Goods enter under CPC 5100. Processing can be anything from sorting or repacking to complex manufacturing. Products re-exported under CPC 3151 pay no duty or import VAT. Products released to the UK market under CPC 4051 pay duty and VAT, based either on the goods as imported or on the finished product. A bill of discharge closes each period.',
    ],
  },
  facts: [
    ['What is suspended', 'Customs Duty, import VAT and excise duty'],
    ['Entry code', 'CPC 5100, usually APC 000'],
    ['Re-export', 'CPC 3151'],
    ['Release to UK market', 'CPC 4051'],
    ['Authorisation document', 'C601 (GB IPO + number) in DE 2/3'],
    ['One-off route', 'Authorisation by declaration: 10 uses a year, £500,000 per import'],
    ['Discharge period', 'Set in the authorisation; 6 months by declaration'],
    ['Bill of discharge', '30 days after the discharge period ends'],
  ],
  sections: [
    {
      id: 'who',
      label: '01 · WHO IT SUITS',
      title: 'Manufacturers, repairers and contract processors.',
      list: [
        'Manufacturers who import materials or components and export the finished product. GOV.UK’s own example: sheet metal made into a car chassis and exported without duty or import VAT.',
        'Repairers importing goods to repair and return (economic code 2), with a 1:1 rate of yield.',
        'Contract processors working to the specification of a business outside the UK (economic code 3).',
        'Occasional importers who do all the processing themselves, using authorisation by declaration.',
        'Customs warehouse operators who also process goods on site.',
      ],
    },
    {
      id: 'authorisation',
      label: '02 · AUTHORISATION',
      title: 'Full authorisation for regular use, or one-off by declaration.',
      steps: [
        ['01', 'Check eligibility', 'Be established in the UK with an EORI number, solvent, with a sound customs record, and able to keep records. You must carry out or arrange the processing; you do not need to own the goods.'],
        ['02', 'Pick the economic code', 'Each authorisation names an economic code that describes the operation, such as repair or processing to a non-UK customer’s specification. Some operations need an economic test.'],
        ['03', 'Apply at least one month ahead', 'Apply online or with form SP3. Give the commodity codes, the process, the rate of yield, the discharge period and the duty basis you want if goods are released to the UK market. A full authorisation lasts up to 5 years.'],
        ['04', 'Or use authorisation by declaration', 'HMRC accepting your import declaration is the authorisation: up to 10 times in a rolling year, up to £500,000 per import, with a security deposit for the full duty and VAT. Not for anti-dumping goods, excise goods, simplified declarations or processing by a third party.'],
        ['05', 'Discharge and report', 'Re-export, release or transfer the goods within the discharge period, then send the bill of discharge within 30 days of that period ending, even for nil periods.'],
      ],
    },
    {
      id: 'data',
      label: '03 · DECLARATION DATA',
      title: 'Full authorisation and one-off entries carry different data.',
      paras: ['From CDS Appendix 1 (Requested Procedures 51, 40 and 31), updated 6 October 2026. See the full [customs procedure codes reference](/customs-reference/customs-procedure-codes/).'],
      table: {
        caption: 'Inward processing data elements on CDS',
        head: ['Data element', 'Full authorisation', 'Authorisation by declaration'],
        rows: [
          ['DE 1/10', '5100 entry; 3151 re-export; 4051 release; 5151 transfer to another holder', 'Same codes'],
          ['DE 1/11', '000, or F44 only where the authorisation states it; A04 for VAT-only IP', 'Same codes'],
          ['DE 2/3', 'C601 with GB IPO and the authorisation number; C505 guarantee', 'No authorisation document code'],
          ['DE 3/39', 'IPO with the holder’s EORI', 'Not completed'],
          ['DE 2/2', 'GEN45 consignment or work number; the ECO economic code', '00100 and ABDIN on entry; 00100 and ABDOU on discharge'],
          ['DE 8/2', '0 or 1', '3, with security for the full duty and VAT'],
          ['DE 2/1 on discharge', 'The MRN of the declaration that entered the goods to IP', 'Same'],
          ['DE 5/27', 'Supervising office (optional on GB entries)', 'GBBEL004, the National Imports Relief Unit'],
        ],
      },
      after: ['On release to free circulation (4051), declare the value of the processed products in DE 4/14. Postponed VAT accounting can be used.'],
    },
  ],
  example: {
    title: 'Polyester fabric made into jackets: £29,600 never paid at import.',
    intro: [
      'A GB clothing maker with a full IP authorisation imports dyed polyester fabric from China, commodity code 5407 52 00 00, customs value £100,000. The UK Trade Tariff shows 8% third-country duty and 20% VAT (checked 15 October 2026). It makes jackets and exports them to the USA under CPC 3151.',
    ],
    rows: [
      ['Duty suspended: £100,000 × 8%', '£8,000'],
      ['Import VAT suspended: (£100,000 + £8,000) × 20%', '£21,600'],
      ['Total suspended at import', '£29,600', true],
      ['All jackets re-exported: paid', '£0', true],
      ['If 10% are released to the UK under 4051: duty £8,000 × 10%', '£800'],
      ['Duty never paid on the re-exported 90%', '£7,200', true],
    ],
    notes: [
      'This uses the “goods at import” duty basis. Under authorisation by declaration the same import would need a £29,600 security, refunded once HMRC accepts the bill of discharge.',
    ],
  },
  errors: [
    ['Entering goods without a valid authorisation', 'An expired or missing authorisation turns the suspended duty and VAT into a customs debt.'],
    ['Late or missing bill of discharge', 'The debt arises the day after the deadline. Nil periods still need a bill, and HMRC sends no reminders.'],
    ['Discharge period exceeded', 'Ask the supervising office for an extension before the period ends. Authorisation by declaration allows 6 months.'],
    ['One-off route used outside its limits', 'Authorisation by declaration cannot exceed 10 uses in 12 months or £500,000, and cannot cover anti-dumping goods, excise goods, simplified declarations or third-party processing.'],
    ['Free circulation declared instead of IP', 'A 4000 entry made in error must be withdrawn through the supervising office within 90 days.'],
    ['Authorisation data missing', 'Full authorisations need C601 in DE 2/3 and IPO with the holder’s EORI in DE 3/39. One-off entries need 00100 with ABDIN or ABDOU.'],
    ['No written instructions to the agent', 'Agents need the holder’s prior written approval, including the authorisation number and procedure code.'],
  ],
  declarix: {
    title: 'IP entries with every line tied to its source.',
    paras: [intake, evidence],
    list: [
      procedureGuard,
      'Line-level quantities and values come from long invoices and packing lists, which is where IP rate-of-yield records start.',
      'Previous document references, including the IP entry MRN on a 3151 or 4051 discharge, move into DE 2/1 with their source attached.',
      handoff,
    ],
  },
  faqs: [
    ['What is inward processing relief?', 'It is a UK special procedure that suspends Customs Duty and import VAT on goods imported for processing or repair. Nothing is paid on products that are re-exported.'],
    ['What procedure code is used for inward processing?', 'CPC 5100 for entry, 3151 for re-export of the processed goods, and 4051 for release to free circulation.'],
    ['How long do I have to discharge inward processing goods?', 'The period is set in your authorisation, usually no more than 12 months, or 6 months under authorisation by declaration. The bill of discharge is due 30 days after the period ends.'],
    ['Can I use inward processing without a full authorisation?', 'Yes, by declaration, up to 10 times in a rolling year for goods up to £500,000 per import, with security for the full duty and VAT.'],
    ['What happens if processed goods stay in the UK?', 'You declare them under CPC 4051 and pay duty and import VAT, based on the goods as imported or on the finished product, as chosen in your authorisation.'],
  ],
  related: [
    ['/customs-reference/customs-procedure-codes/', 'DE 1/10', 'Customs procedure codes'],
    ['/customs-reference/customs-document-codes/', 'DE 2/3', 'Customs document codes'],
    ['/customs-workflows/postponed-vat-accounting-checklist/', 'PVA', 'Postponed VAT accounting checklist'],
  ],
  sources: ipSources,
}

const opSources = [
  src('Apply to pay less duty on goods you export to process or repair', 'https://www.gov.uk/guidance/apply-to-pay-less-duty-on-goods-you-export-to-process-or-repair', '16 JUL 2025'),
  src('Using outward processing to process or repair your goods', 'https://www.gov.uk/guidance/using-outward-processing-to-process-or-repair-your-goods', '8 MAY 2026'),
  src('Using a special procedure without a prior authorisation', 'https://www.gov.uk/guidance/using-a-special-procedure-without-a-prior-authorisation', '16 JUL 2025'),
  src('Special procedure: outward processing — authorisation', 'https://www.gov.uk/guidance/special-procedure-outward-processing/authorisation', '16 JUL 2025'),
  src('Special procedure: outward processing — duty on goods exported for repair', 'https://www.gov.uk/guidance/special-procedure-outward-processing/how-duty-is-charged-on-imported-goods-that-were-exported-for-repair', '30 APR 2025'),
  src('Special procedure: outward processing — warranty', 'https://www.gov.uk/guidance/special-procedure-outward-processing/warranty-under-outward-processing', '25 FEB 2026'),
  src('Outward Processing Relief calculation for imports (C&E1154)', 'https://www.gov.uk/government/publications/import-and-export-outward-processing-relief-ce1154', '31 DEC 2020'),
  src('CDS Appendix 1 (exports): Requested Procedure 21 — outward processing', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes/requested-procedure-21-temporary-export-under-outward-processing', '13 JUL 2026'),
  src('CDS Appendix 1: Requested Procedure 61 — re-importation', 'https://www.gov.uk/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes-of-the-customs-declaration-service-cds/requested-procedure-61-re-importation-with-simultaneous-release-to-free-circulation', '6 OCT 2026'),
  src('CDS Appendix 2: additional procedure codes, B series (outward processing)', 'https://www.gov.uk/government/publications/appendix-2-de-111-additional-procedure-codes/additional-procedure-code-b-series-outward-processing', '29 APR 2026'),
  tariff('8711500000'),
  tariff('6203110000'),
]

const outwardProcessing = {
  ...base,
  kind: 'procedure',
  slug: 'outward-processing-relief',
  path: '/customs-reference/outward-processing-relief/',
  shortName: 'Outward processing relief',
  code: 'CPC 21 00',
  about: ['Outward processing relief', 'OPR', 'Customs procedure code 2100', 'Customs procedure code 6121'],
  term: {
    name: 'Outward processing',
    alt: 'Outward processing relief (OPR)',
    description: 'A UK special procedure that cuts Customs Duty and import VAT on goods sent abroad for repair or processing, charging duty on the value added abroad instead of the full value.',
  },
  title: 'Outward processing relief (OPR) UK guide',
  description:
    'Outward processing relief in the UK: send goods abroad for repair or processing and pay duty only on the work done. CPC 2100, 6121, C&E1154 and examples.',
  h1: 'Outward processing: pay duty on the repair, not on the whole machine.',
  eyebrow: 'SPECIAL PROCEDURE · OUTWARD PROCESSING · CPC 2100 / 6121',
  standfirst:
    'Outward processing relief lets a UK business send goods abroad for repair or processing and bring them back paying duty only on the value added abroad. A free repair under guarantee comes back with no duty at all.',
  ref: 'PROCEDURE 06 · REPAIR ABROAD',
  stamp: '21\n00',
  answer: {
    heading: 'Outward processing relief (OPR) reduces UK duty and import VAT on goods sent abroad for repair or processing and brought back.',
    body: [
      'Goods leave under CPC 2100 and return under CPC 6121. Instead of duty on the full value, duty falls on the value added abroad: the repair or processing charge plus return shipping and insurance. Repairs free of charge under the original guarantee use CPC 2200 with B51 out and 6122 with B02 back, and pay no duty.',
    ],
  },
  facts: [
    ['What is relieved', 'Duty and import VAT on the value of the goods as exported'],
    ['Export code', 'CPC 2100 (2200 for guarantee repairs and other cases)'],
    ['Re-import code', 'CPC 6121 (6122 for guarantee repairs, textiles, standard exchange)'],
    ['Authorisation document', 'C019 (GB OPO + number) in DE 2/3'],
    ['One-off route', 'Authorisation by declaration, repairs only: 10 uses a year, £500,000'],
    ['Duty worksheet', 'Form C&E1154, declared as 9WKS'],
    ['Apply', 'At least 30 days before exporting'],
    ['Who cannot apply', 'Freight forwarders, express operators and customs agents'],
  ],
  sections: [
    {
      id: 'who',
      label: '01 · WHO IT SUITS',
      title: 'Repairs abroad, processing abroad and guarantee swaps.',
      list: [
        'Businesses sending equipment back to an overseas manufacturer for a chargeable repair.',
        'Owners of goods repaired free under the original guarantee, or replaced under the standard exchange system.',
        'Brands sending UK materials abroad to be made up, such as cloth into garments.',
        'Gold sent abroad to be made into jewellery, with assay certification before export.',
        'Inward processing holders who need one stage done abroad.',
      ],
      after: [
        'You do not have to own the goods or be the person who re-imports them. Goods that come back unaltered, with no work done, use [returned goods relief](/customs-reference/returned-goods-relief/) instead.',
      ],
    },
    {
      id: 'authorisation',
      label: '02 · AUTHORISATION',
      title: 'Full authorisation, or one-off for repairs.',
      steps: [
        ['01', 'Check eligibility', 'Be established in the UK, solvent, with a sound customs record and good records. Freight forwarders, express operators and customs agents cannot hold an OP authorisation.'],
        ['02', 'Full authorisation', 'Apply online or with form SP4 at least 30 days before exporting. Valid for up to 5 years. Needed for processing abroad and for regular use.'],
        ['03', 'Authorisation by declaration', 'For repairs only. HMRC accepting the export declaration is the authorisation: up to 10 times in a rolling year, up to £500,000, with no security at export.'],
        ['04', 'Export with the right codes', 'Declare 2100 (or 2200 with B51 for a guarantee repair) and quote the authorisation. Do not declare VATZ if you will claim VAT relief on return.'],
        ['05', 'Re-import and calculate', 'Declare 6121 or 6122, link the export MRN in DE 2/1 and complete form C&E1154 for the duty calculation.'],
      ],
    },
    {
      id: 'data',
      label: '03 · DECLARATION DATA',
      title: 'Two declarations, one link between them.',
      paras: ['From CDS Appendix 1 (Requested Procedures 21 and 61) and Appendix 2. See the full [customs procedure codes reference](/customs-reference/customs-procedure-codes/).'],
      table: {
        caption: 'Outward processing data elements on CDS',
        head: ['Data element', 'Export (2100)', 'Re-import (6121)'],
        rows: [
          ['DE 1/11', '000 (B51 or B52 with 2200 for guarantee cases)', '000 (B02 or B03 with 6122 for guarantee cases)'],
          ['DE 2/3', 'C019 with GB OPO and the authorisation number', 'C019 valid at export; 9WKS for the C&E1154 worksheet'],
          ['DE 3/39', 'OPO with the holder’s EORI (full authorisation)', 'Same'],
          ['DE 2/1', 'Not applicable', 'The MRN of the export declaration'],
          ['DE 2/2', '00100 and ABDIN for authorisation by declaration', '00100 and ABDOU; OVR01 for the duty override'],
          ['DE 4/4, 4/6', 'Not applicable', 'Value of the exported goods; tax due as calculated on the C&E1154'],
          ['DE 6/17', 'No VATZ if VAT relief will be claimed', 'Not applicable'],
        ],
      },
    },
  ],
  example: {
    title: 'A motorcycle engine rebuild in the USA: £4,806 less duty and VAT.',
    intro: [
      'A GB dealer sends a US-built motorcycle over 800cc, commodity code 8711 50 00 00, back to the maker for a chargeable engine rebuild. The UK Trade Tariff shows 6% third-country duty and 20% VAT (checked 15 October 2026). Value at export £18,000; repair invoice £3,000; outward freight £550; return freight £600; return insurance £100.',
    ],
    rows: [
      ['OPR duty base: £3,000 repair + £600 freight + £100 insurance', '£3,700'],
      ['OPR duty: £3,700 × 6%', '£222'],
      ['Without OPR: duty on £21,700 full value × 6%', '£1,302'],
      ['Duty relieved', '£1,080', true],
      ['OPR VAT: (£3,000 + £550 + £600 + £222) × 20%', '£874.40'],
      ['Without OPR: VAT (£21,700 + £1,302) × 20%', '£4,600.40'],
      ['Import VAT relieved', '£3,726.00', true],
      ['Total reduction on one repair', '£4,806', true],
    ],
    notes: [
      'Processing works the same way. UK wool cloth worth £20,000 is made into suits in China (commodity code 6203 11 00 00, 12% duty) and returns with a customs value of £37,500. Duty falls on £17,500 (£2,100) instead of £37,500 (£4,500): £2,400 less.',
    ],
  },
  errors: [
    ['One-off route used for processing', 'Authorisation by declaration covers repairs only. Processing abroad needs a full authorisation.'],
    ['No authorisation on the export or re-import', 'Quote C019 with OPO in DE 2/3 and OPO in DE 3/39 on both declarations.'],
    ['Re-import not linked to the export', 'Put the export MRN in DE 2/1 and keep the export entry or departure message. Without it, security on the full value can be required.'],
    ['No C&E1154 worksheet', 'The duty calculation on re-import is supported by form C&E1154, declared with code 9WKS.'],
    ['Free repair claimed where a warranty was bought', 'B51 and B02 are only for repairs free under the original guarantee. A bought warranty or service charge makes duty due.'],
    ['VATZ declared on export', 'Declaring VATZ, or selling the goods while abroad, removes VAT relief on return.'],
    ['Repair used to upgrade', 'Repairs restore goods. Work that improves technical performance falls outside the relief.'],
  ],
  declarix: {
    title: 'Export and re-import, kept on one evidence trail.',
    paras: [intake, evidence],
    list: [
      procedureGuard,
      'The repair invoice, freight bills and insurance charges are read and kept apart, so each cost reaches the right part of the duty and VAT calculation.',
      'The export MRN moves into DE 2/1 on the re-import from the paperwork, with its source shown.',
      handoff,
    ],
  },
  faqs: [
    ['What is outward processing relief?', 'It is a UK special procedure that cuts duty and import VAT on goods sent abroad for repair or processing, so duty is charged on the value added abroad rather than the full value.'],
    ['What procedure codes are used for outward processing?', 'CPC 2100 to export and 6121 to re-import. Guarantee repairs and some other cases use 2200 and 6122.'],
    ['Is a repair under guarantee duty-free?', 'Yes, when the repair is free under the original guarantee, the guarantee cost was in the original customs value and you use 2200 with B51 and 6122 with B02.'],
    ['Can a freight forwarder hold an OP authorisation?', 'No. GOV.UK states that freight forwarders, express operators and customs agents cannot apply. They can still make the declarations for the holder.'],
    ['What is form C&E1154?', 'It is HMRC’s outward processing relief calculation sheet for imports. Its date is declared in DE 2/3 under code 9WKS on the re-import.'],
  ],
  related: [
    ['/customs-reference/customs-procedure-codes/', 'DE 1/10', 'Customs procedure codes'],
    ['/customs-reference/customs-document-codes/', 'DE 2/3', 'Customs document codes'],
    ['/tools/customs-value-import-duty-vat-calculator/', 'TOOL', 'Customs value, duty and VAT calculator'],
  ],
  sources: opSources,
}

export const procedurePages = [customsWarehouse, inwardProcessing, outwardProcessing, temporaryAdmission, endUse, returnedGoods]
// ---------------------------------------------------------------------------------------------
// Customs identifiers, forms and systems
// ---------------------------------------------------------------------------------------------

const devGlossary = src('CDS end-to-end service guide: glossary', 'https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/documentation/glossary.html', 'LIVE', 'HMRC Developer Hub')
const cdsGroup2 = src('CDS import completion instructions: Group 2 (references and documents)', 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/group-2-references-of-messages-document-certificates-and-authorisations', '7 OCT 2026')
const cdsGroup1 = src('CDS import completion instructions: Group 1 (message information and procedure codes)', 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/group-1-message-information-including-procedure-codes', '7 OCT 2026')
const cdsGroup6 = src('CDS import completion instructions: Group 6 (goods identification)', 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/group-6-goods-identification', '7 OCT 2026')
const cdsIntro = src('CDS Declaration Completion Instructions for Imports', 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/uk-trade-tariff-cds-volume-3-import-declaration-completion-guide', '7 OCT 2026')
const repaySrc = src('How to claim a repayment of import duty and VAT if you’ve overpaid', 'https://www.gov.uk/guidance/how-to-claim-a-repayment-of-import-duty-and-vat-if-youve-overpaid', '1 SEP 2026')
const amendSrc = src('Amend or cancel a CDS import declaration', 'https://www.gov.uk/guidance/amend-or-cancel-a-customs-declaration-service-import-declaration', '16 JUN 2026')
const btmsSrc = src('Importing SPS controlled goods that interact with the Border Trade Matching Service', 'https://www.gov.uk/guidance/importing-sps-controlled-goods-that-interact-with-alvs', '2 FEB 2026')

const mrnPage = {
  ...base,
  kind: 'term',
  slug: 'mrn',
  path: '/customs-reference/mrn/',
  shortName: 'MRN',
  code: 'MRN',
  about: ['Movement Reference Number', 'MRN', 'Customs Declaration Service', 'New Computerised Transit System'],
  term: {
    name: 'MRN',
    alt: 'Movement Reference Number',
    description: 'The unique 18-character reference a customs system (CDS, NCTS or S&S GB) gives a declaration once it is accepted.',
  },
  title: 'What is an MRN number? UK customs MRN guide',
  description:
    'What an MRN is, how the 18 characters break down, where CDS, NCTS and ENS issue one, where it goes next (GMR, C285, DE 2/1) and the mix-ups to avoid.',
  h1: 'MRN: the reference that follows your goods through every customs step.',
  eyebrow: 'CUSTOMS REFERENCE · MOVEMENT REFERENCE NUMBER',
  standfirst:
    'Every accepted UK customs declaration gets a Movement Reference Number. It is the key HMRC, hauliers, ports and your own team use to find the entry again: on a GMR, a supplementary declaration, a repayment claim or a disclosure.',
  ref: 'IDENTIFIER 01 · MRN',
  stamp: 'MRN\n18',
  answer: {
    heading: 'An MRN (Movement Reference Number) is the unique 18-character reference a customs system gives a declaration once it accepts it.',
    body: [
      'CDS issues one for import and export declarations, NCTS for transit declarations, and S&S GB for entry summary declarations (ENS). It starts with the 2-digit year and the country code, for example 26GB. The declarant never chooses it; the declarant’s own reference is the LRN.',
    ],
  },
  facts: [
    ['Length', '18 characters'],
    ['Starts with', '2-digit year + country code (GB, or XI for Northern Ireland)'],
    ['Issued by', 'CDS, NCTS or S&S GB, after acceptance'],
    ['Not issued', 'At transit pre-lodgement (only the LRN exists)'],
    ['Track a transit MRN', 'European Commission MRN follow-up'],
    ['Track a CDS MRN', 'Your declaration software or HMRC’s declaration information API'],
  ],
  sections: [
    {
      id: 'where',
      label: '01 · WHERE MRNS COME FROM',
      title: 'Three systems issue MRNs.',
      table: {
        caption: 'Where a UK MRN is issued',
        head: ['System', 'Declaration', 'When the MRN appears'],
        rows: [
          ['CDS', 'Import and export declarations', 'Assigned once the declaration is submitted and accepted'],
          ['NCTS', 'Transit (T1, T2) declarations', 'On acceptance of a correct declaration; not at pre-lodgement'],
          ['S&S GB', 'Entry summary declarations (ENS)', 'After successful validation; issued to the carrier and declarant'],
        ],
      },
    },
    {
      id: 'next',
      label: '02 · WHERE IT GOES NEXT',
      title: 'The MRN is the thread through later steps.',
      list: [
        'GMR: an EU-to-GB movement through a GVMS port needs the import MRN; a transit movement needs the NCTS MRN. Read the [GMR and GVMS checklist](/customs-workflows/gmr-gvms-checklist/).',
        'Supplementary declarations: the simplified declaration’s MRN goes in DE 2/1 with previous document code SDE.',
        'Re-imports under special procedures: the export or entry MRN links the two declarations, for example under [returned goods relief](/customs-reference/returned-goods-relief/).',
        'Repayment claims: every CDS claim and every [C285](/customs-reference/c285-form/) needs the MRN.',
        'Voluntary disclosures (C2001) and importer detail corrections also start from the MRN.',
        'Transit at the border: since 21 January 2025 the driver needs the transit MRN as characters or a barcode, not a paper TAD.',
      ],
    },
    {
      id: 'compare',
      label: '03 · MRN, LRN, DUCR, MUCR, GMR',
      title: 'Five references that are easy to mix up.',
      table: {
        caption: 'UK customs references compared',
        head: ['Reference', 'Who creates it', 'What it identifies'],
        rows: [
          ['MRN', 'The customs system', 'One accepted declaration'],
          ['LRN', 'The declarant (DE 2/5, up to 22 characters)', 'The declarant’s own reference; unique for 48 hours'],
          ['DUCR', 'The declarant or trader', 'One consignment, in the format year + GB + EORI + “-” + reference'],
          ['MUCR', 'Trader, loader or port system', 'A group of DUCRs moving as one consignment'],
          ['GMR', 'The haulier, in GVMS', 'All declarations for one vehicle on one crossing'],
        ],
      },
    },
  ],
  example: {
    title: 'Reading a real transit MRN: 22GB00005112345678.',
    intro: ['GOV.UK’s Transit Manual uses this MRN to explain the structure. Each part tells you something.'],
    rows: [
      ['22', 'Year issued: 2022'],
      ['GB', 'Country of the office of departure'],
      ['000051', 'Office of departure: Felixstowe'],
      ['12345678', 'Unique movement identifier and check digit'],
      ['Total length', '18 characters', true],
    ],
    notes: [
      'CDS MRNs follow the same year and country pattern, such as 22GB38ATMLY0E6OAR0 in HMRC’s API documentation. A free [MRN checker](/tools/mrn-checker/) decodes any MRN you paste.',
    ],
  },
  errors: [
    ['Treating the LRN as the MRN', 'The LRN is your own reference. The MRN only exists after the system accepts the declaration.'],
    ['Re-using an LRN within 48 hours', 'CDS rejects a duplicate LRN from the same trader inside 48 hours.'],
    ['Import MRNs on a transit GMR', 'For Common Transit Convention movements, GOV.UK says not to add import declaration references to the GMR.'],
    ['Import-style references on an export GMR', 'GB-to-EU GMRs carry the DUCRs of the export declarations.'],
    ['Expecting an MRN under transit business continuity', 'No MRN is allocated during the NCTS business continuity procedure; the office of departure reference is used.'],
    ['Driver without the transit MRN', 'The paper TAD is no longer needed, but the MRN is.'],
  ],
  declarix: {
    title: 'Every reference in the right box, with its source.',
    paras: [intake, evidence],
    list: [
      'Previous document references, including MRNs for supplementary declarations and re-imports, move into DE 2/1 from the customer’s paperwork.',
      'Declarix generates UCR and MUCR references for consignments and consolidations, so the references your team builds match the declarations they belong to.',
      handoff,
    ],
  },
  faqs: [
    ['What is an MRN number?', 'It is the Movement Reference Number: the unique 18-character reference CDS, NCTS or S&S GB gives a customs declaration once it is accepted.'],
    ['How many characters is an MRN?', '18. It starts with the 2-digit year and the 2-letter country code, such as 26GB. A transit MRN then shows the office of departure, the unique movement identifier and a check digit.'],
    ['How do I check an MRN status?', 'For transit, use the European Commission MRN follow-up service. For CDS declarations, check your declaration software, which reads status from HMRC by MRN.'],
    ['Is the MRN the same as the LRN?', 'No. You choose the LRN; the customs system issues the MRN after it accepts your declaration.'],
    ['Do I need the MRN for a GMR?', 'Yes, for most imports through GVMS ports. Transit movements use the NCTS MRN; exports from GB to the EU use DUCRs.'],
  ],
  related: [
    ['/tools/mrn-checker/', 'TOOL', 'MRN checker'],
    ['/customs-workflows/t1-ncts-transit-checklist/', 'T1', 'T1 and NCTS transit checklist'],
    ['/customs-workflows/ens-ics2-entry-summary-declaration-checklist/', 'ENS', 'ENS and ICS2 checklist'],
  ],
  sources: [
    devGlossary,
    src('Transit Manual Supplement: common and Union transit', 'https://www.gov.uk/guidance/transit-manual-supplement/4-common-union-transit', '28 JUN 2024'),
    src('Create a goods movement reference', 'https://www.gov.uk/guidance/create-a-goods-movement-reference', '9 JUN 2026'),
    src('Previous document codes for DE 2/1', 'https://www.gov.uk/government/publications/previous-document-codes-for-data-element-21-of-the-customs-declaration-service', '28 MAR 2026'),
    src('Customs Declarations Information API 2.0', 'https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/customs-declarations-information/2.0', 'LIVE', 'HMRC Developer Hub'),
    src('Safety and security import declarations service guide', 'https://developer.service.hmrc.gov.uk/guides/safety-and-security-import-declarations-end-to-end-service-guide/', 'LIVE', 'HMRC Developer Hub'),
    cdsGroup2,
    repaySrc,
  ],
}

const c88Page = {
  ...base,
  kind: 'term',
  slug: 'c88-single-administrative-document',
  path: '/customs-reference/c88-single-administrative-document/',
  shortName: 'C88 / SAD',
  code: 'C88',
  about: ['C88', 'Single Administrative Document', 'SAD', 'CDS data elements'],
  term: {
    name: 'C88',
    alt: 'Single Administrative Document (SAD)',
    description: 'The paper customs declaration form, with numbered boxes, that CDS data elements have replaced for UK declarations.',
  },
  title: 'C88 form and SAD: what replaced the boxes on CDS',
  description:
    'What the C88 (Single Administrative Document) was, where its boxes went on CDS, when a paper C88 still appears, and the data element mix-ups to avoid.',
  h1: 'C88: from numbered boxes to CDS data elements.',
  eyebrow: 'CUSTOMS REFERENCE · C88 / SINGLE ADMINISTRATIVE DOCUMENT',
  standfirst:
    'The C88 is the box-numbered customs declaration form brokers learned on CHIEF. CDS replaced the boxes with data elements in eight groups. The habits still matter, because brokers, forms and even GOV.UK pages still say “Box 44”.',
  ref: 'FORM 01 · C88',
  stamp: 'C88',
  answer: {
    heading: 'The C88 is the UK version of the Single Administrative Document (SAD): the customs declaration form with numbered boxes.',
    body: [
      'HMRC describes it as the main customs form used in international trade to declare goods. On CDS, the UK’s single declaration platform since CHIEF closed in December 2024, the boxes are replaced by data elements (DEs) in eight groups. A paper or manual C88 still appears in narrow cases, such as authorised fallback during system downtime or a substitute entry to correct a CFSP error.',
    ],
  },
  facts: [
    ['What it is', 'The box-based customs declaration form (SAD)'],
    ['Replaced by', 'CDS data elements, Groups 1 to 8'],
    ['CHIEF closed', 'Fully decommissioned December 2024'],
    ['Paper fallback', 'Form C1402(F) CDS, when HMRC authorises it'],
    ['Still seen', 'Substitute entries; legacy “Box” wording'],
  ],
  sections: [
    {
      id: 'map',
      label: '01 · WHERE THE BOXES WENT',
      title: 'The boxes brokers ask about most.',
      paras: ['The data element names below come from HMRC’s CDS Declaration Completion Instructions. The box numbers are the C88 positions they replaced.'],
      table: {
        caption: 'Former C88 boxes and their CDS data elements',
        head: ['Former C88 box', 'CDS data element'],
        rows: [
          ['Box 1 Declaration', 'DE 1/1 declaration type and DE 1/2 additional declaration type'],
          ['Box 7 Reference number', 'DE 2/5 LRN'],
          ['Box 33 Commodity code', 'DE 6/14 commodity code, DE 6/15 TARIC code, DE 6/16 and 6/17 additional codes'],
          ['Box 37 Procedure', 'DE 1/10 procedure code and DE 1/11 additional procedure code'],
          ['Box 40 Previous document', 'DE 2/1 simplified declaration and previous documents'],
          ['Box 44 Additional information', 'DE 2/2 additional information and DE 2/3 documents, certificates and authorisations'],
          ['Box 47 Calculation of taxes', 'DE 4/3 tax type, DE 4/4 tax base, DE 4/6 payable tax, DE 4/8 method of payment'],
        ],
      },
      after: ['For the full code lists behind Box 37 and Box 44, see the [customs procedure codes](/customs-reference/customs-procedure-codes/) and [customs document codes](/customs-reference/customs-document-codes/) references.'],
    },
    {
      id: 'paper',
      label: '02 · WHEN PAPER STILL APPEARS',
      title: 'Three places the C88 lives on.',
      list: [
        'System downtime: HMRC can authorise short-term fallback using form C1402(F) CDS to request entry or clearance.',
        'CFSP corrections: for non-monetary errors, the CFSP National Assurance Team may ask for a letter and a manual C88 as a substitute entry.',
        'Paper continuation sheets: the CDS guide still sets rules for them, for example leaving DE 1/1 blank on a continuation sheet.',
      ],
    },
    {
      id: 'groups',
      label: '03 · THE EIGHT CDS GROUPS',
      title: 'How CDS organises what the boxes held.',
      table: {
        caption: 'CDS data element groups',
        head: ['Group', 'Covers'],
        rows: [
          ['1', 'Message information, including procedure codes'],
          ['2', 'References, documents, certificates and authorisations'],
          ['3', 'Parties'],
          ['4', 'Valuation, taxes and payment'],
          ['5', 'Dates, places, countries and regions'],
          ['6', 'Goods identification, including commodity code'],
          ['7', 'Transport information'],
          ['8', 'Other data, statistics, guarantees and tariff data'],
        ],
      },
    },
  ],
  example: {
    title: 'One previous document reference, read part by part.',
    intro: ['HMRC’s CDS guide gives this DE 2/1 entry for a supplementary declaration after an entry in the declarant’s records on 1 October 2017, item 2: YCLE20171001-2.'],
    rows: [
      ['Y', 'Category: simplified declaration or entry in records'],
      ['CLE', 'Type: entry in the declarant’s records (EIDR)'],
      ['20171001', 'Reference: the date of the entry in records'],
      ['-2', 'Item number on the previous document'],
      ['Former home', 'Box 40', true],
    ],
    notes: ['The item number is the one on the previous document, not on the declaration you are making now.'],
  },
  errors: [
    ['Box numbers in CDS software', 'CDS asks for data elements. Map from the box you know to the DE before keying.'],
    ['Wrong DE 2/1 format', 'DE 2/1 has four parts: category, type, reference and item number.'],
    ['Current item number in DE 2/1', 'Use the item number from the previous document.'],
    ['DE 3/15 completed alongside a GB EORI', 'Leave DE 3/15 blank where a GB EORI is in DE 3/16.'],
    ['Accented characters in DE 6/8', 'Copy-pasted accented tariff descriptions can stop automatic matching and delay clearance.'],
    ['Paper treated as a normal option', 'Paper fallback needs HMRC authorisation through form C1402(F) CDS.'],
  ],
  declarix: {
    title: 'Data elements filled from the documents, not from memory.',
    paras: [intake, evidence],
    list: [
      'Exporter, importer, values, weights, packages, previous documents, origin and line data move into their CDS data elements, each with its source.',
      procedureGuard,
      handoff,
    ],
  },
  faqs: [
    ['What is a C88 form?', 'It is the UK Single Administrative Document: the box-numbered customs declaration form. On CDS its boxes are replaced by data elements.'],
    ['Is the C88 still used?', 'Rarely. CDS uses data elements, but a paper or manual C88 can appear in authorised fallback or as a substitute entry to correct a CFSP error.'],
    ['What is Box 44 on CDS?', 'Box 44 content now sits in DE 2/2 additional information and DE 2/3 documents, certificates and authorisations.'],
    ['What replaced Box 37?', 'DE 1/10 holds the 4-digit procedure code and DE 1/11 the 3-character additional procedure code.'],
  ],
  related: [
    ['/customs-reference/customs-procedure-codes/', 'DE 1/10', 'Customs procedure codes'],
    ['/customs-reference/customs-document-codes/', 'DE 2/3', 'Customs document codes'],
    ['/customs-reference/cds-error-codes/', 'CDS', 'CDS error codes'],
  ],
  sources: [
    src('Apply for repayment of import duty and VAT (CHIEF): documents list', 'https://www.gov.uk/guidance/apply-for-repayment-of-import-duty-and-vat-chief', '10 SEP 2025'),
    cdsIntro,
    cdsGroup1,
    cdsGroup2,
    cdsGroup6,
    src('Single Customs Platform Programme: Accounting Officer’s assessment', 'https://www.gov.uk/government/publications/single-customs-platform-programme-accounting-officers-assessment-summary/single-customs-platform-programme-accounting-officers-assessment-summary', '18 MAR 2025'),
    src('Request entry or clearance during CDS downtime (C1402(F) CDS)', 'https://www.gov.uk/government/publications/import-and-export-chief-direct-trader-input-short-term-fallback-c1402-f', '3 AUG 2021'),
    src('Civil penalties for contraventions of customs law (Notice 301)', 'https://www.gov.uk/guidance/civil-penalties-for-contraventions-of-customs-law-customs-notice-301', '31 JUL 2026'),
    btmsSrc,
  ],
}

const c285Page = {
  ...base,
  kind: 'term',
  slug: 'c285-form',
  path: '/customs-reference/c285-form/',
  shortName: 'C285 form',
  code: 'C285',
  about: ['C285', 'Repayment of import duty', 'Overpaid import duty', 'Customs Declaration Service'],
  term: {
    name: 'C285',
    description: 'HMRC’s route to claim back overpaid import duty and VAT after clearance; most CDS importers now claim through the CDS online claim service.',
  },
  title: 'C285 form: claim back overpaid import duty (UK)',
  description:
    'How to claim overpaid UK import duty: when to use the C285 form or the CDS claim service, the 3-year limit, the evidence, VAT rules and a worked example.',
  h1: 'C285: get overpaid import duty back.',
  eyebrow: 'CUSTOMS REFERENCE · C285 REPAYMENT CLAIM',
  standfirst:
    'Paid too much import duty because of a wrong commodity code, value or relief? You have 3 years to claim it back. The route depends on whether you have an EORI and a CDS declaration, and import VAT has its own rules.',
  ref: 'FORM 02 · C285',
  stamp: 'C285',
  answer: {
    heading: 'C285 is HMRC’s route for claiming back import duty and VAT overpaid on a cleared declaration.',
    body: [
      'If you have an EORI and the declaration was made on CDS, claim through the CDS online claim service. The online C285 form is for claimants without an EORI registered to them, private individuals, and a few special cases. VAT-registered importers cannot use either route for import VAT: they correct it on their VAT Return.',
    ],
  },
  facts: [
    ['Time limit', '3 years for overpayments'],
    ['Rejected imports', '1 year'],
    ['Withdrawal after clearance', 'Within 90 days, by C285'],
    ['Minimum claim', 'More than £9 per declaration'],
    ['HMRC decision aim', 'Within 30 days'],
    ['Paid to', 'A UK bank account only'],
  ],
  sections: [
    {
      id: 'route',
      label: '01 · WHICH ROUTE',
      title: 'Pick the route before you fill anything in.',
      table: {
        caption: 'How to correct a UK import declaration',
        head: ['Situation', 'Route'],
        rows: [
          ['Declaration not yet cleared', 'Amend it in your declaration software; no need to contact HMRC'],
          ['Cleared, duty overpaid, you have an EORI, CDS declaration', 'CDS online claim service'],
          ['Cleared, duty overpaid, no EORI registered to you, or a private individual', 'Online C285 form'],
          ['Import VAT overpaid and you are VAT registered', 'Adjust your VAT Return, not C285'],
          ['Postponed VAT accounting used', 'Correct import VAT on the VAT Return'],
          ['Duty underpaid', 'Voluntary disclosure on form C2001, then a C18 demand'],
        ],
      },
    },
    {
      id: 'evidence',
      label: '02 · WHAT TO SEND',
      title: 'The evidence HMRC asks for.',
      list: [
        'Your EORI and the MRN of the declaration (an [MRN](/customs-reference/mrn/) is needed for every CDS claim and the C285 form).',
        'The commercial invoice and the amount that should have been paid.',
        'Optional supporting documents: packing list, air waybill or bill of lading.',
        'For rejected imports: the import invoice, proof of entitlement and a calculation worksheet if the claim is partial.',
        'UK bank details for the repayment.',
      ],
    },
    {
      id: 'who',
      label: '03 · WHO CAN CLAIM',
      title: 'Importers and the people acting for them.',
      paras: ['The importer or their representative, a customs agent, or a freight forwarder or express operator acting for the importer can claim. Private individuals can claim too, except for goods sent by Parcelforce or Royal Mail, which use form BOR286.'],
    },
  ],
  example: {
    title: 'E-bikes declared as ordinary bicycles: £1,600 back.',
    intro: [
      'An importer brings in 100 pedal-assist e-bikes from Taiwan with a customs value of £20,000, declared in error under 8712 00 30 90 (bicycles, 14%). The correct code is 8711 60 10 00 (pedal-assist bicycles, motor up to 250 W, 6%). Rates from the UK Trade Tariff, checked 15 October 2026.',
    ],
    rows: [
      ['Duty paid: £20,000 × 14%', '£2,800'],
      ['Duty due: £20,000 × 6%', '£1,200'],
      ['Duty to claim through the CDS claim service', '£1,600', true],
      ['Import VAT paid: (£20,000 + £2,800) × 20%', '£4,560'],
      ['Import VAT due: (£20,000 + £1,200) × 20%', '£4,240'],
      ['VAT overpaid: recover on the VAT Return if VAT registered', '£320', true],
    ],
    notes: ['The claim is made within 3 years, with the MRN, the invoice and the corrected calculation. A [commodity code checker](/tools/commodity-code-checker/) helps catch the wrong code before the entry is made.'],
  },
  errors: [
    ['Claiming import VAT when VAT registered', 'GOV.UK says VAT-registered importers cannot reclaim import VAT on the C285 or the online services. Adjust the VAT Return.'],
    ['Using C285 on an uncleared declaration', 'Amend it in your declaration software instead.'],
    ['Missing the time limits', '90 days to withdraw, 1 year for rejected imports, 3 years for overpayments.'],
    ['Claims of £9 or less', 'Claims must be more than £9 per full declaration.'],
    ['A non-UK bank account', 'HMRC repays to UK bank accounts only.'],
    ['Rejected goods where the defect was known', 'Rejected-imports relief does not cover defects known when the contract was made.'],
  ],
  declarix: {
    title: 'Fewer claims, because the entry is right the first time.',
    paras: [intake, evidence],
    list: [
      'Invoice values, quantities and descriptions reach the entry with their source line, so the reviewer sees what the classification and value rest on.',
      'Conflicts between documents, such as two different values for the same line, appear as questions before approval.',
      handoff,
    ],
  },
  faqs: [
    ['What is a C285 form?', 'It is HMRC’s claim for repayment or remission of import duty and VAT on a cleared declaration. Most CDS importers with an EORI now claim through the CDS online claim service instead.'],
    ['How long do I have to claim overpaid import duty?', '3 years for overpayments, 1 year for rejected imports and 90 days to withdraw a declaration.'],
    ['Can I reclaim import VAT on a C285?', 'Not if you are VAT registered. Adjust your VAT Return instead.'],
    ['How long does HMRC take to repay?', 'HMRC aims to decide claims within 30 days.'],
    ['Who can submit a C285?', 'The importer, their representative, a customs agent, or a freight forwarder or express operator acting for the importer, and private individuals.'],
  ],
  related: [
    ['/tools/import-duty-repayment-checker/', 'TOOL', 'Import duty repayment checker'],
    ['/tools/customs-value-import-duty-vat-calculator/', 'TOOL', 'Customs value, duty and VAT calculator'],
    ['/customs-workflows/postponed-vat-accounting-checklist/', 'PVA', 'Postponed VAT accounting checklist'],
  ],
  sources: [
    repaySrc,
    src('Refunds and waivers on customs debt', 'https://www.gov.uk/guidance/refunds-and-waivers-on-customs-debt', '6 OCT 2025'),
    amendSrc,
    src('Apply for a voluntary clearance amendment (C2001)', 'https://www.gov.uk/guidance/apply-for-a-voluntary-clearance-amendment-underpayment-c2001', '13 AUG 2026'),
    tariff('8712003090'),
    tariff('8711601000'),
  ],
}

const destin8Page = {
  ...base,
  kind: 'term',
  slug: 'destin8-port-community-systems',
  path: '/customs-reference/destin8-port-community-systems/',
  shortName: 'Destin8 and port systems',
  code: 'CSP',
  about: ['Destin8', 'Port community system', 'Community System Provider', 'CNS Compass', 'Inventory linking'],
  term: {
    name: 'Port community system',
    alt: 'Community System Provider (CSP)',
    description: 'An inventory system approved by HMRC, such as Destin8 or CNS Compass, that links a port’s cargo records to CDS and controls the release of goods.',
  },
  title: 'Destin8 and UK port community systems explained',
  description:
    'What Destin8, CNS Compass and other UK port community systems do, how inventory linking connects them to CDS, and the DUCR and MUCR rules brokers need.',
  h1: 'Destin8 and port community systems: where CDS meets the quayside.',
  eyebrow: 'CUSTOMS REFERENCE · PORT COMMUNITY SYSTEMS · INVENTORY LINKING',
  standfirst:
    'At inventory-linked ports and airports, a Community System Provider (CSP) holds the cargo record, tells HMRC when goods arrive, and releases them when CDS clears the declaration. Destin8 and CNS Compass are the names most brokers log in to.',
  ref: 'SYSTEM 01 · CSP',
  stamp: 'CSP',
  answer: {
    heading: 'Destin8 is a port community system: an inventory system approved by HMRC that links a port’s cargo records to CDS.',
    body: [
      'HMRC calls these operators Community System Providers (CSPs). At inventory-linked locations the CSP notifies HMRC of the arrival of goods, receives the clearance status from CDS and controls release. Destin8 is operated by Maritime Cargo Processing (MCP); Compass is operated by Community Network Services (CNS).',
    ],
  },
  facts: [
    ['HMRC term', 'Community System Provider (CSP)'],
    ['GOV.UK approved list', 'Cargo Community Systems UK, CNS, MCP, DHL, Pentant'],
    ['Destin8', 'Operated by Maritime Cargo Processing (MCP)'],
    ['Compass', 'Operated by Community Network Services (CNS)'],
    ['Import link', 'DE 2/1: Z + MCR + inventory reference, header level'],
    ['Export link', 'DUCRs consolidated into MUCRs; CSP sends arrival and departure'],
  ],
  sections: [
    {
      id: 'linking',
      label: '01 · INVENTORY LINKING',
      title: 'How a CSP connects to CDS.',
      steps: [
        ['01', 'Imports: arrival', 'At an inventory-linked office of entry, the CSP makes the arrival of goods notification to customs. At non-linked locations the trader does it.'],
        ['02', 'Imports: the declaration link', 'The declaration quotes the inventory reference in DE 2/1 as category Z, type MCR, at header level only.'],
        ['03', 'Imports: clearance', 'CDS sends clearance status and route of examination codes back to the CSP, which controls release.'],
        ['04', 'Exports: consolidation', 'Declarations wait for messages from the loader or CSP. DUCRs are consolidated into MUCRs, which can be nested once shut.'],
        ['05', 'Exports: arrival and departure', 'The CSP sends arrival (EAL) and departure (EDL) messages. The departure message is the official evidence of export.'],
      ],
    },
    {
      id: 'providers',
      label: '02 · THE PROVIDERS',
      title: 'Who runs what.',
      paras: [
        'GOV.UK lists five approved Community System Providers for temporary storage inventory linking: Cargo Community Systems UK, Community Network Services, Maritime Cargo Processing, DHL and Pentant. A facility can use several CSPs but only one as its stock account.',
        'MCP describes Destin8 as a system that exchanges information across port communities ([mcpplc.com](https://www.mcpplc.com/)). CNS describes Compass as the port community system for many large UK ports, including Southampton, Tilbury and London Gateway ([cnsonline.net](https://www.cnsonline.net/cargoes/products/compass/)).',
      ],
    },
    {
      id: 'gvms',
      label: '03 · CSP OR GVMS',
      title: 'Two different ways to tell HMRC goods have moved.',
      paras: [
        'Border locations need an inventory-linked system, the Goods Vehicle Movement Service (GVMS) or another approved service. Roll-on roll-off ports such as Dover, Eurotunnel and Holyhead use GVMS, where the haulier builds a GMR. See the [GMR and GVMS checklist](/customs-workflows/gmr-gvms-checklist/). At a non-linked, non-GVMS port with no approved loader, exporters report arrival and departure on forms C1601, C1602 or C1603.',
      ],
    },
  ],
  example: {
    title: 'Three export declarations, one container, one departure.',
    intro: ['An exporter files three CDS export declarations for one container. The forwarder consolidates them for the port system.'],
    rows: [
      ['DUCR on each declaration', '6GB123456789000-INV4471 and two more'],
      ['Forwarder consolidates', 'One MUCR, then shuts it'],
      ['Container reaches the port', 'CSP sends EAL: all three DUCRs arrive'],
      ['Container loaded', 'CSP sends EDL'],
      ['Result', 'Departure message: official export evidence', true],
    ],
    notes: ['When a MUCR is marked as arrived, every declaration under it is marked as arrived too.'],
  },
  errors: [
    ['Expecting a departure message at a non-linked port', 'Without a CSP, GVMS or approved loader, report with C1601, C1602 or C1603.'],
    ['Inventory reference at item level', 'Declare it once, at header level, as Z MCR plus the reference.'],
    ['Nesting a MUCR that is not shut', 'Shut a MUCR before consolidating it into another.'],
    ['Two CSPs as the stock account', 'Only one provider can hold the facility stock record.'],
    ['Moves between facilities on different CSPs', 'GOV.UK notes these movements are usually restricted to the same provider.'],
    ['Treating GVMS and inventory linking as one thing', 'They are alternative ways to give HMRC arrival and departure.'],
  ],
  declarix: {
    title: 'References built once and used everywhere.',
    paras: [intake, evidence],
    list: [
      'Declarix generates UCR and MUCR references, so DUCRs and consolidations match the declarations they belong to.',
      'Declarix export formats include a Destin8 CSV layout alongside CDS-ready output for Sequoia and Descartes e-Customs. The numbers call maps the route your desk uses.',
      handoff,
    ],
  },
  faqs: [
    ['What is Destin8?', 'Destin8 is a port community system operated by Maritime Cargo Processing. It holds cargo records at the ports that use it and links them to CDS through inventory linking.'],
    ['What is a port community system?', 'HMRC calls it a Community System Provider: an approved inventory system that notifies arrival, receives CDS clearance status and controls the release of goods at inventory-linked locations.'],
    ['What is CNS Compass?', 'Compass is the port community system run by Community Network Services, used at ports such as Southampton, Tilbury and London Gateway.'],
    ['Does every UK port use a port community system?', 'No. Roll-on roll-off ports such as Dover and Eurotunnel use GVMS, and some smaller locations use neither.'],
  ],
  related: [
    ['/customs-reference/mrn/', 'MRN', 'MRN guide'],
    ['/customs-workflows/gmr-gvms-checklist/', 'GMR', 'GMR and GVMS checklist'],
  ],
  sources: [
    devGlossary,
    src('Inventory linking for export declarations', 'https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/documentation/inventory-linking-export-declarations.html', 'LIVE', 'HMRC Developer Hub'),
    src('Setting up your temporary storage facility’s inventory system', 'https://www.gov.uk/guidance/setting-up-your-temporary-storage-facilitys-inventory-system', '31 DEC 2020'),
    src('Getting approval to operate a customs border location', 'https://www.gov.uk/guidance/getting-approval-to-operate-a-customs-border-location-in-the-uk', '17 APR 2023'),
    src('Report exports that arrived or left a UK port that were not notified in CDS', 'https://www.gov.uk/guidance/report-exports-that-arrived-or-left-a-uk-port-that-were-not-declared-in-chief', '3 SEP 2026'),
    src('Making a full export declaration', 'https://www.gov.uk/guidance/making-a-full-export-declaration', '13 MAY 2025'),
    src('List of ports using the Goods Vehicle Movement Service', 'https://www.gov.uk/guidance/list-of-ports-using-the-goods-vehicle-movement-service', '19 AUG 2026'),
    cdsGroup2,
  ],
}

const ipaffsPage = {
  ...base,
  kind: 'term',
  slug: 'ipaffs',
  path: '/customs-reference/ipaffs/',
  shortName: 'IPAFFS',
  code: 'IPAFFS',
  about: ['IPAFFS', 'Import of products, animals, food and feed system', 'CHED', 'Border Target Operating Model'],
  term: {
    name: 'IPAFFS',
    alt: 'Import of products, animals, food and feed system',
    description: 'The Defra system used to pre-notify GB authorities of live animals, animal products, high-risk food and feed, and plants before they arrive.',
  },
  title: 'IPAFFS: UK import notifications and CHED codes',
  description:
    'What IPAFFS is, which goods need it, CHED types and their CDS codes (C640, N853, C678, C085), pre-notification times and the matching errors to avoid.',
  h1: 'IPAFFS: notify before the goods arrive, then match the customs entry.',
  eyebrow: 'CUSTOMS REFERENCE · IPAFFS · CHED',
  standfirst:
    'IPAFFS is how importers tell GB authorities that animals, animal products, high-risk food and feed, or plants are on their way. The notification returns a CHED reference that must then match the customs declaration, line for line.',
  ref: 'SYSTEM 02 · IPAFFS',
  stamp: 'CHED',
  answer: {
    heading: 'IPAFFS (Import of products, animals, food and feed system) is the Defra system for pre-notifying sanitary and phytosanitary imports into Great Britain.',
    body: [
      'You must use it before live animals, germinal products, animal by-products, products of animal origin, composite foods, high-risk food and feed not of animal origin, and medium and high risk plants arrive. Each notification creates a Common Health Entry Document (CHED), whose reference goes in DE 2/3 of the CDS import declaration.',
    ],
  },
  facts: [
    ['Run by', 'Defra and APHA'],
    ['Creates', 'A CHED reference per notification'],
    ['CDS location', 'DE 2/3, identifier GBCHDyyyy.nnnnnnn'],
    ['Animal products, live animals, HRFNAO', 'At least 1 working day before arrival'],
    ['Plants: air and roll-on roll-off', '4 working hours before landing'],
    ['Plants: other freight', '1 working day before arrival'],
  ],
  sections: [
    {
      id: 'ched',
      label: '01 · CHED TYPES AND CODES',
      title: 'Each CHED type has its own CDS document code.',
      table: {
        caption: 'CHED types and CDS DE 2/3 document codes',
        head: ['CHED', 'Goods', 'DE 2/3 code'],
        rows: [
          ['CHED-A', 'Live animals', 'C640'],
          ['CHED-P', 'Products of animal origin', 'N853'],
          ['CHED-D', 'High-risk food and feed not of animal origin', 'C678'],
          ['CHED-PP', 'Plants, plant products, fruit and vegetables', 'C085'],
          ['Catch certificate', 'Caught fish (IUU)', 'C673 with identifier GBIUU'],
        ],
      },
      after: ['N851 is the phytosanitary control code. Only declare the codes the Trade Tariff requires for the commodity; extra codes cause a no-match. See all codes in the [customs document codes reference](/customs-reference/customs-document-codes/).'],
    },
    {
      id: 'matching',
      label: '02 · HOW THE MATCH WORKS',
      title: 'The Border Trade Matching Service compares three things.',
      list: [
        'The CHED reference in DE 2/3.',
        'The net mass in DE 6/1, or the number of animals in DE 6/2.',
        'The commodity code in DE 6/14 and DE 6/15.',
      ],
      after: ['If they do not match, the declaration gets an X00 no-match and is not cleared. Our [IPAFFS import notification checklist](/customs-workflows/ipaffs-import-notification-checklist/) walks through the pre-arrival handoff step by step.'],
    },
    {
      id: 'btom',
      label: '03 · BTOM CONTEXT',
      title: 'Where IPAFFS sits in the Border Target Operating Model.',
      paras: ['The Border Target Operating Model sets the GB approach to security controls on all imports and to sanitary and phytosanitary controls on live animals, animal products, plants and plant products. Each commodity has a published risk category, which decides the checks and the notification route.'],
    },
  ],
  example: {
    title: 'EU cheese into GB: one CHED, one matching entry.',
    intro: ['An importer brings EU cheese (a product of animal origin) into GB through a border control post.'],
    rows: [
      ['IPAFFS notification', 'At least 1 working day before arrival'],
      ['Reference returned', 'CHEDP.GB.2026.1234567'],
      ['CDS DE 2/3 document code', 'N853'],
      ['CDS DE 2/3 identifier', 'GBCHD2026.1234567'],
      ['Matched on', 'CHED, net mass (DE 6/1), commodity code (DE 6/14 to 6/15)', true],
    ],
    notes: ['The CHED year and number carry across; the prefix changes from CHEDP.GB. to GBCHD.'],
  },
  errors: [
    ['CHED missing or in the wrong format', 'Use GBCHD, the year, a full stop and the 7-digit number, or the match fails with X00.'],
    ['Codes the tariff does not ask for', 'Declaring N851 for green bananas, for example, causes a no-match. Those need C085.'],
    ['One notification for mixed goods', 'Raise a separate notification for each commodity type, and quote each CHED in the other’s documents.'],
    ['Late pre-notification', 'Plants need 4 working hours by air or roll-on roll-off and 1 working day otherwise.'],
    ['Accented descriptions in DE 6/8', 'Copy-pasted accented text can force manual handling and delay clearance.'],
    ['Intermediary setting in IPAFFS', 'Choosing “intermediaries” in IPAFFS account settings does not apply to IPAFFS.'],
  ],
  declarix: {
    title: 'The CHED, the weight and the code agree before filing.',
    paras: [intake, evidence],
    list: [
      'Net mass and commodity lines come from the packing list and invoice with their sources pinned, ready to match the CHED.',
      'Certificates in the pack are classified and their references carried to the entry, so the reviewer sees each document beside its field.',
      handoff,
    ],
  },
  faqs: [
    ['What is IPAFFS?', 'It is the Import of products, animals, food and feed system: Defra’s service for pre-notifying sanitary and phytosanitary imports into Great Britain.'],
    ['How far in advance must I notify in IPAFFS?', 'At least 1 working day for animals, animal products and high-risk food and feed. For plants, 4 working hours by air or roll-on roll-off and 1 working day for other freight.'],
    ['Where does the CHED reference go on the customs declaration?', 'In DE 2/3, with the document code for the CHED type and the identifier GBCHDyyyy.nnnnnnn.'],
    ['Who can raise an IPAFFS notification?', 'Importers and agents registered with their own business details. The person who raises it is responsible for the consignment until checks finish.'],
  ],
  related: [
    ['/customs-workflows/ipaffs-import-notification-checklist/', 'IPAFFS', 'IPAFFS import notification checklist'],
    ['/customs-reference/customs-document-codes/', 'DE 2/3', 'Customs document codes'],
  ],
  sources: [
    src('Import of products, animals, food and feed system (IPAFFS)', 'https://www.gov.uk/guidance/import-of-products-animals-food-and-feed-system', '17 SEP 2026', 'Defra and APHA · GOV.UK'),
    btmsSrc,
    src('Import or move food and drink from the EU and Northern Ireland to Great Britain', 'https://www.gov.uk/guidance/import-or-move-food-and-drink-from-the-eu-and-northern-ireland-to-great-britain', '22 APR 2025', 'Defra · GOV.UK'),
    src('Import plants and plant products from the EU to Great Britain', 'https://www.gov.uk/guidance/import-plants-and-plant-products-from-the-eu-to-great-britain', '14 OCT 2026', 'Defra · GOV.UK'),
    src('Importing live animals, animal products and HRFNAO from non-EU countries', 'https://www.gov.uk/guidance/importing-live-animals-or-animal-products-from-non-eu-countries', '28 JAN 2025', 'Defra · GOV.UK'),
    src('The Border Target Operating Model', 'https://www.gov.uk/government/publications/the-border-target-operating-model-august-2023', '13 FEB 2024', 'Cabinet Office · GOV.UK'),
  ],
}

const commodityPage = {
  ...base,
  kind: 'term',
  slug: 'commodity-code',
  path: '/customs-reference/commodity-code/',
  shortName: 'Commodity code',
  code: 'DE 6/14',
  about: ['Commodity code', 'HS code', 'UK Trade Tariff', 'Advance Tariff Ruling'],
  term: {
    name: 'Commodity code',
    alt: 'HS code, tariff code',
    description: 'The internationally recognised number that classifies goods for customs, setting duty, VAT, controls and preferences; the first 6 digits are shared worldwide.',
  },
  title: 'UK commodity codes: how to find and use them',
  description:
    'What a UK commodity code is, how to find one, Advance Tariff Rulings, where it goes on CDS (DE 6/14 to 6/17) and what a wrong code costs, worked through.',
  h1: 'Commodity code: the number that sets the duty.',
  eyebrow: 'CUSTOMS REFERENCE · COMMODITY CODE · DE 6/14',
  standfirst:
    'A commodity code classifies your goods for customs. It decides the duty rate, import VAT, licences, quotas, anti-dumping measures and preferences. Get it right and the rest of the entry follows; get it wrong and you pay too much, or face a demand.',
  ref: 'CLASSIFICATION 01',
  stamp: 'HS\n6+4',
  answer: {
    heading: 'A commodity code is the internationally recognised number that describes a product for customs and sets its duty, VAT and controls.',
    body: [
      'Only the first 6 digits are shared worldwide (the Harmonized System). The UK Trade Tariff shows 10-digit import codes, such as 8711 60 10 00. On CDS the code goes in DE 6/14 (Combined Nomenclature code) and DE 6/15 (TARIC code), with any additional codes in DE 6/16 and DE 6/17.',
    ],
  },
  facts: [
    ['Shared worldwide', 'First 6 digits (Harmonized System)'],
    ['UK imports', '10-digit code from the UK Trade Tariff'],
    ['CDS location', 'DE 6/14, 6/15; additional codes DE 6/16, 6/17'],
    ['Binding decision', 'Advance Tariff Ruling, usually valid 3 years'],
    ['ATaR reply', '30 to 120 days'],
    ['Overpaid duty', 'Claim within 3 years'],
  ],
  sections: [
    {
      id: 'find',
      label: '01 · HOW TO FIND ONE',
      title: 'Four ways to land on the right code.',
      steps: [
        ['01', 'Search the Trade Tariff', 'Search by product, then read down the headings to the 10-digit line that describes the goods. Use a free [commodity code checker](/tools/commodity-code-checker/) to start from an invoice line.'],
        ['02', 'Use the classification guides', 'HMRC publishes sector guides, including textiles, footwear, toys, vehicles and electrical equipment.'],
        ['03', 'Apply the interpretation rules', 'Classification follows the General Interpretative Rules, applied in order; HMRC tariff notices show the reasoning on real goods.'],
        ['04', 'Get a binding ruling when it matters', 'Apply for an Advance Tariff Ruling before the goods are cleared. You need an EORI starting GB and a plan to import or export.'],
      ],
      after: ['An overseas supplier’s code is a starting point only: just the first 6 digits are international.'],
    },
    {
      id: 'wrong',
      label: '02 · WHAT A WRONG CODE COSTS',
      title: 'Overpay, underpay, or fail the match.',
      list: [
        'Overpaid duty: claim it back within 3 years through the CDS claim service or the [C285 form](/customs-reference/c285-form/).',
        'Underpaid duty: make a voluntary disclosure on form C2001, then pay the C18 demand. HMRC has 3 years to raise a debt.',
        'Civil penalties: up to £2,500 per contravention for more significant irregularities, and a serious error where the duty and VAT exceed £10,000.',
        'Sanitary and phytosanitary goods: the code must match the IPAFFS notification or clearance stops. See the [IPAFFS guide](/customs-reference/ipaffs/).',
      ],
    },
    {
      id: 'atar',
      label: '03 · ADVANCE TARIFF RULING',
      title: 'A legally binding answer before you import.',
      paras: ['HMRC replies within 30 to 120 days with the code, the start of validity, a unique reference, the holder and the legal justification. Rulings are generally valid for 3 years and cannot be transferred to another business. HMRC refuses applications for goods already cleared, because rulings are not retrospective. Northern Ireland and EU movements use Binding Tariff Information instead.'],
    },
  ],
  example: {
    title: 'Pedal-assist e-bikes: one code worth £1,600.',
    intro: ['An importer declares £20,000 of pedal-assist e-bikes from Taiwan. Rates from the UK Trade Tariff, checked 15 October 2026.'],
    rows: [
      ['8712 00 30 90 bicycles (wrong code): 14%', '£2,800'],
      ['8711 60 10 00 pedal-assist, motor up to 250 W (right code): 6%', '£1,200'],
      ['Duty overpaid', '£1,600', true],
    ],
    notes: ['Both codes also carry anti-dumping measures for goods from China, which is why the origin matters as much as the code.'],
  },
  errors: [
    ['Copying the supplier’s code', 'Only the first 6 digits are international. Check the UK digits in the Trade Tariff.'],
    ['Asking for a ruling after clearance', 'Advance Tariff Rulings are refused for goods already cleared.'],
    ['Lending a ruling', 'Rulings belong to the holder and cannot be used by another business.'],
    ['Using DE 6/17 to claim a relief', 'National additional codes must not claim procedure reliefs; use DE 1/10 and DE 1/11.'],
    ['Code differs from the IPAFFS notification', 'The Border Trade Matching Service rejects the match.'],
    ['Ignoring trade remedies', 'Check anti-dumping and countervailing measures for the origin, not only the duty rate.'],
  ],
  declarix: {
    title: 'Classification with the evidence on screen.',
    paras: [intake, evidence],
    list: [
      'Declarix proposes commodity codes with candidate codes and the reasoning behind them, and checks the UK Trade Tariff for duty, VAT and anti-dumping measures on the code and origin.',
      'Your clerk sees the goods description, material and use from the invoice beside each proposed code and makes the classification decision.',
      handoff,
    ],
  },
  faqs: [
    ['What is a commodity code?', 'It is the number that classifies goods for customs and sets the duty rate, import VAT, controls and preferences. The first 6 digits are the international HS code.'],
    ['How many digits is a UK commodity code?', 'The UK Trade Tariff shows 10-digit codes for imports, split on CDS across DE 6/14 and DE 6/15. The first 6 digits are shared worldwide.'],
    ['How do I get a binding commodity code decision?', 'Apply to HMRC for an Advance Tariff Ruling before the goods are cleared. It is generally valid for 3 years.'],
    ['What happens if I use the wrong commodity code?', 'You may overpay and need to claim within 3 years, or underpay and face a C18 demand, interest and possible penalties.'],
  ],
  related: [
    ['/tools/commodity-code-checker/', 'TOOL', 'Commodity code checker'],
    ['/tools/customs-value-import-duty-vat-calculator/', 'TOOL', 'Customs value, duty and VAT calculator'],
  ],
  sources: [
    src('Finding commodity codes for imports into or exports out of the UK', 'https://www.gov.uk/guidance/finding-commodity-codes-for-imports-or-exports', '22 AUG 2022'),
    src('Apply for an Advance Tariff Ruling', 'https://www.gov.uk/guidance/apply-for-an-advance-tariff-ruling', '2 JUN 2026'),
    src('Check what you’ll need to get a legally binding decision on a commodity code', 'https://www.gov.uk/guidance/check-what-youll-need-to-get-a-legally-binding-decision-on-a-commodity-code', '9 SEP 2026'),
    cdsGroup6,
    repaySrc,
    src('Civil penalties for contraventions of customs law (Notice 301)', 'https://www.gov.uk/guidance/civil-penalties-for-contraventions-of-customs-law-customs-notice-301', '31 JUL 2026'),
    btmsSrc,
    tariff('8711601000'),
  ],
}

export const referencePages = [mrnPage, c88Page, c285Page, destin8Page, ipaffsPage, commodityPage]

// ---------------------------------------------------------------------------------------------
// Glossary
// ---------------------------------------------------------------------------------------------

const g = (term, plain, source, page, alt, more) => ({ term, plain, source, page, alt, more })

export const glossaryRoute = {
  ...base,
  kind: 'glossary',
  slug: 'glossary',
  path: '/customs-reference/glossary/',
  shortName: 'Glossary',
  code: 'A–Z',
  about: ['UK customs glossary', 'Customs Declaration Service', 'Customs special procedures'],
  title: 'UK customs glossary: CDS terms in plain English',
  description:
    'Plain-English definitions of UK customs terms: MRN, DUCR, CPC, APC, EORI, GMR, IPAFFS, C285, special procedures and more, each linked to its GOV.UK source.',
  h1: 'UK customs glossary: every term a broker meets, in one line.',
  eyebrow: 'CUSTOMS REFERENCE · GLOSSARY · A–Z',
  standfirst:
    'Short, plain-English definitions of the terms that fill a UK customs desk, each with its GOV.UK source. Where we have a full guide, the definition links to it.',
  ref: 'GLOSSARY · A–Z',
  stamp: 'A–Z',
  answer: {
    heading: 'This glossary defines the UK customs terms brokers, forwarders and importers use every day, from AEO to UCR.',
    body: ['Each entry is one or two sentences, traced to GOV.UK or the HMRC Developer Hub and checked on 15 October 2026. Terms with a full Declarix guide link straight to it.'],
  },
  terms: [
    g('AEO', 'Authorised Economic Operator: an internationally recognised status showing that a business’s customs controls and supply-chain security meet set standards. There are two types, AEOC for customs simplifications and AEOS for security and safety.', 'https://www.gov.uk/guidance/authorised-economic-operator-certification', null, 'Authorised Economic Operator'),
    g('APC', 'Additional procedure code: the 3-character code in DE 1/11 that refines the procedure code. Union codes start with a letter; national codes start with a digit.', 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/group-1-message-information-including-procedure-codes', '/customs-reference/customs-procedure-codes/', 'Additional procedure code', 'Customs procedure codes reference'),
    g('ATA carnet', 'An international customs document that replaces import and export declarations for goods taken temporarily to ATA countries, such as samples, exhibition goods and professional equipment. It is valid for up to one year.', 'https://www.gov.uk/guidance/temporary-admission-customs-technical-handbook/ata-carnets', '/customs-reference/temporary-admission/', null, 'Temporary admission guide'),
    g('Authorised use', 'The GB name for end use relief: a reduced or zero rate of Customs Duty on eligible goods put to a prescribed use within a set period.', 'https://www.gov.uk/guidance/authorised-use-end-use/authorised-use', '/customs-reference/end-use-relief/', 'End use', 'End use relief guide'),
    g('Bonded warehouse', 'The trade name for a customs warehouse: an HMRC-authorised store where imported goods wait with Customs Duty and import VAT suspended.', 'https://www.gov.uk/guidance/how-to-use-a-customs-warehouse', '/customs-reference/bonded-warehouse/', 'Customs warehouse', 'Bonded warehouse guide'),
    g('BTOM', 'Border Target Operating Model: the GB approach to security controls on all imports and to sanitary and phytosanitary controls on animals, animal products and plants, with a risk category for each commodity.', 'https://www.gov.uk/government/publications/the-border-target-operating-model-august-2023', '/customs-reference/ipaffs/', 'Border Target Operating Model', 'IPAFFS guide'),
    g('C285', 'HMRC’s route for claiming back import duty and VAT overpaid on a cleared declaration. Most CDS importers with an EORI now use the CDS online claim service.', 'https://www.gov.uk/guidance/how-to-claim-a-repayment-of-import-duty-and-vat-if-youve-overpaid', '/customs-reference/c285-form/', null, 'C285 guide'),
    g('C88', 'The box-numbered paper customs declaration form, the UK version of the Single Administrative Document. CDS data elements have replaced its boxes.', 'https://www.gov.uk/guidance/apply-for-repayment-of-import-duty-and-vat-chief', '/customs-reference/c88-single-administrative-document/', 'Single Administrative Document (SAD)', 'C88 and SAD guide'),
    g('CDS', 'Customs Declaration Service: HMRC’s system for UK import and export declarations, and the UK’s single customs declaration platform since CHIEF closed.', 'https://www.gov.uk/government/collections/customs-declaration-service', '/customs-declaration-software/', 'Customs Declaration Service', 'CDS declaration software'),
    g('CHED', 'Common Health Entry Document: the IPAFFS notification for sanitary and phytosanitary goods (CHED-A, CHED-P, CHED-D, CHED-PP). Its reference goes in DE 2/3 as GBCHDyyyy.nnnnnnn.', 'https://www.gov.uk/guidance/importing-sps-controlled-goods-that-interact-with-alvs', '/customs-reference/ipaffs/', 'Common Health Entry Document', 'IPAFFS guide'),
    g('CHIEF', 'Customs Handling of Import and Export Freight: HMRC’s former declaration system. It was fully decommissioned in December 2024.', 'https://www.gov.uk/government/publications/single-customs-platform-programme-accounting-officers-assessment-summary/single-customs-platform-programme-accounting-officers-assessment-summary'),
    g('Commodity code', 'The number that classifies goods for customs and sets duty, VAT, controls and preferences. The first 6 digits are shared worldwide; UK imports use 10 digits.', 'https://www.gov.uk/guidance/finding-commodity-codes-for-imports-or-exports', '/customs-reference/commodity-code/', 'HS code', 'Commodity code guide'),
    g('CPC', 'Customs procedure code: the 4-digit code in DE 1/10 made of the requested procedure (2 digits) and the previous procedure (2 digits), such as 4000 or 7100.', 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/group-1-message-information-including-procedure-codes', '/customs-reference/customs-procedure-codes/', 'Customs procedure code', 'Customs procedure codes reference'),
    g('CSP', 'Community System Provider: a port or airport inventory system approved by HMRC, such as Destin8 or CNS Compass, that links cargo records to CDS.', 'https://www.gov.uk/guidance/setting-up-your-temporary-storage-facilitys-inventory-system', '/customs-reference/destin8-port-community-systems/', 'Port community system', 'Destin8 and port systems guide'),
    g('DDA', 'Duty deferment account: lets you defer customs duty, import VAT and excise. On CDS, a calendar month’s deferred charges are paid on the 16th of the next month.', 'https://www.gov.uk/guidance/how-to-use-your-duty-deferment-account', '/customs-workflows/duty-deferment-account-checklist/', 'Duty deferment account', 'Duty deferment checklist'),
    g('Destin8', 'The port community system operated by Maritime Cargo Processing, used for inventory linking at the ports that run it.', 'https://www.gov.uk/guidance/setting-up-your-temporary-storage-facilitys-inventory-system', '/customs-reference/destin8-port-community-systems/', null, 'Destin8 and port systems guide'),
    g('DUCR', 'Declaration Unique Consignment Reference: the declarant’s reference for one consignment, in the format year digit + GB + EORI + “-” + reference, for example 5GB000000000000-12345.', 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/group-2-references-of-messages-document-certificates-and-authorisations', '/customs-reference/destin8-port-community-systems/', 'Declaration Unique Consignment Reference', 'How DUCRs and MUCRs work at the port'),
    g('EIDR', 'Entry in the Declarant’s Records: lets authorised traders release goods by making an entry in their own records, followed by a supplementary declaration unless waived.', 'https://www.gov.uk/guidance/simplified-customs-declaration-process/entry-in-the-declarant-s-records', null, 'Entry in the Declarant’s Records'),
    g('End use relief', 'The name used in Northern Ireland and in the CDS procedure code list for authorised use: reduced or zero duty on eligible goods put to a prescribed use.', 'https://www.gov.uk/guidance/authorised-use-end-use/authorised-use', '/customs-reference/end-use-relief/', 'Authorised use', 'End use relief guide'),
    g('ENS', 'Entry summary declaration: the safety and security declaration needed before goods arrive in GB. The carrier is responsible for it.', 'https://www.gov.uk/guidance/making-an-entry-summary-declaration', '/customs-workflows/ens-ics2-entry-summary-declaration-checklist/', 'Entry summary declaration', 'ENS and ICS2 checklist'),
    g('EORI', 'Economic Operators Registration and Identification number: the trader ID needed to move goods into or out of GB. It starts with GB, or XI for certain Northern Ireland movements.', 'https://www.gov.uk/eori', '/tools/eori-checker/', 'Economic Operators Registration and Identification', 'GB EORI checker'),
    g('GMR', 'Goods Movement Reference: one GVMS reference that brings together all declaration references for the goods in one vehicle on one crossing.', 'https://www.gov.uk/guidance/create-a-goods-movement-reference', '/customs-workflows/gmr-gvms-checklist/', 'Goods Movement Reference', 'GMR and GVMS checklist'),
    g('GVMS', 'Goods Vehicle Movement Service: the HMRC service that links declarations into a GMR at roll-on roll-off ports such as Dover and Eurotunnel.', 'https://www.gov.uk/government/collections/goods-vehicle-movement-service', '/customs-workflows/gmr-gvms-checklist/', 'Goods Vehicle Movement Service', 'GMR and GVMS checklist'),
    g('Inventory linking', 'The electronic link between a port or airport CSP and CDS: the CSP notifies arrival, receives clearance status and controls release.', 'https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/documentation/glossary.html', '/customs-reference/destin8-port-community-systems/', null, 'Destin8 and port systems guide'),
    g('Inward processing', 'A special procedure that suspends duty and import VAT on goods imported for processing or repair; nothing is paid if the products are re-exported.', 'https://www.gov.uk/guidance/apply-to-delay-or-pay-less-duty-on-goods-you-import-to-process-or-repair', '/customs-reference/inward-processing-relief/', 'IPR', 'Inward processing relief guide'),
    g('IPAFFS', 'Import of products, animals, food and feed system: the Defra system for pre-notifying sanitary and phytosanitary imports into GB.', 'https://www.gov.uk/guidance/import-of-products-animals-food-and-feed-system', '/customs-reference/ipaffs/', null, 'IPAFFS guide'),
    g('LRN', 'Local Reference Number: the declarant’s own reference in DE 2/5, up to 22 characters, unique for that trader within 48 hours.', 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/group-2-references-of-messages-document-certificates-and-authorisations', '/customs-reference/mrn/', 'Local Reference Number', 'MRN and LRN compared'),
    g('MRN', 'Movement Reference Number: the unique 18-character reference CDS, NCTS or S&S GB gives a declaration once it is accepted.', 'https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/documentation/glossary.html', '/customs-reference/mrn/', 'Movement Reference Number', 'MRN guide'),
    g('MUCR', 'Master Unique Consignment Reference: groups several DUCRs, and other MUCRs up to seven levels deep, so they move as one consignment.', 'https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/documentation/glossary.html', '/customs-reference/destin8-port-community-systems/', 'Master Unique Consignment Reference', 'How MUCRs work at the port'),
    g('NCTS', 'New Computerised Transit System: the online system for transit declarations under the Common Transit Convention.', 'https://www.gov.uk/guidance/using-the-new-computerised-transit-system-to-move-goods-across-the-eu-and-efta-countries', '/customs-workflows/t1-ncts-transit-checklist/', 'New Computerised Transit System', 'T1 and NCTS checklist'),
    g('Outward processing', 'A special procedure that cuts duty and import VAT on goods sent abroad for repair or processing, charging duty on the value added abroad.', 'https://www.gov.uk/guidance/apply-to-pay-less-duty-on-goods-you-export-to-process-or-repair', '/customs-reference/outward-processing-relief/', 'OPR', 'Outward processing relief guide'),
    g('PVA', 'Postponed VAT accounting: accounting for import VAT on your VAT Return instead of paying it at the border. You must be VAT registered; no approval is needed.', 'https://www.gov.uk/guidance/check-when-you-can-account-for-import-vat-on-your-vat-return', '/customs-workflows/postponed-vat-accounting-checklist/', 'Postponed VAT accounting', 'Postponed VAT accounting checklist'),
    g('Returned goods relief', 'Relief from import duty, and import VAT where the exporter and importer match, for UK goods that come back unaltered within 3 years.', 'https://www.gov.uk/guidance/pay-less-import-duty-and-vat-when-re-importing-goods-to-the-uk-and-eu', '/customs-reference/returned-goods-relief/', 'RGR', 'Returned goods relief guide'),
    g('SDP', 'Simplified Declaration Procedure: lets authorised traders release goods on a simplified declaration, then send a supplementary declaration that quotes its MRN with code SDE.', 'https://www.gov.uk/government/publications/previous-document-codes-for-data-element-21-of-the-customs-declaration-service', null, 'Simplified Declaration Procedure'),
    g('Temporary admission', 'A special procedure for non-UK goods that come in for a specific use and leave again, with full or partial relief from duty and VAT.', 'https://www.gov.uk/guidance/import-goods-to-the-uk-or-eu-temporarily', '/customs-reference/temporary-admission/', 'TA', 'Temporary admission guide'),
    g('UCR', 'Unique Consignment Reference: the umbrella term for consignment references; its two types are DUCR and MUCR. DE 2/4 holds an optional commercial reference on imports.', 'https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/documentation/glossary.html', '/customs-reference/destin8-port-community-systems/', 'Unique Consignment Reference', 'How UCRs work at the port'),
  ],
  sections: [
    {
      id: 'procedures',
      label: 'SPECIAL PROCEDURES AT A GLANCE',
      title: 'Six procedures, side by side.',
      paras: ['The six special procedures and reliefs brokers declare most often, with their main codes. Each name opens the full guide.'],
      table: {
        caption: 'UK special procedures compared',
        head: ['Procedure', 'Main codes', 'What it does'],
        rows: [
          ['[Bonded warehouse](/customs-reference/bonded-warehouse/)', '7100 in; 4071 or 3171 out', 'Suspends duty and import VAT while goods are stored'],
          ['[Inward processing](/customs-reference/inward-processing-relief/)', '5100 in; 3151 or 4051 out', 'Suspends duty and VAT on goods processed or repaired in the UK'],
          ['[Outward processing](/customs-reference/outward-processing-relief/)', '2100 out; 6121 back', 'Duty only on the value added abroad'],
          ['[Temporary admission](/customs-reference/temporary-admission/)', '5300 in; 3153 out', 'Full or partial relief for goods in the UK temporarily'],
          ['[End use relief](/customs-reference/end-use-relief/)', '4400', 'Reduced or zero duty for goods put to a prescribed use'],
          ['[Returned goods relief](/customs-reference/returned-goods-relief/)', '6123 or 6110', 'No duty on UK goods back unaltered within 3 years'],
        ],
      },
    },
  ],
  sources: [
    devGlossary,
    cdsGroup1,
    cdsGroup2,
    src('Customs Declaration Service collection', 'https://www.gov.uk/government/collections/customs-declaration-service', 'LIVE'),
    src('Authorised Economic Operator certification', 'https://www.gov.uk/guidance/authorised-economic-operator-certification', '4 AUG 2026'),
    src('Get an EORI number', 'https://www.gov.uk/eori', '7 AUG 2025'),
    src('Making an entry summary declaration', 'https://www.gov.uk/guidance/making-an-entry-summary-declaration', '14 OCT 2026'),
    src('How to use your duty deferment account', 'https://www.gov.uk/guidance/how-to-use-your-duty-deferment-account', '24 JUL 2025'),
    src('Check when you can account for import VAT on your VAT Return', 'https://www.gov.uk/guidance/check-when-you-can-account-for-import-vat-on-your-vat-return', '16 JUN 2025'),
    src('Entry in the declarant’s records', 'https://www.gov.uk/guidance/simplified-customs-declaration-process/entry-in-the-declarant-s-records', '26 MAR 2026'),
  ],
}

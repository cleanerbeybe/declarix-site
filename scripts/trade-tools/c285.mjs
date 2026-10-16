// Import duty and VAT repayment route checker (C285 / CDS claim).
// Source: GOV.UK "How to claim a repayment of import duty and VAT if you've overpaid"
// (updated 1 September 2026): time limits 3 years overpayment, 1 year rejected imports,
// 90 days withdrawal; routes by EORI, declaration system, VAT registration and postal delivery.
// Rejected imports: GOV.UK "Claim a repayment or remission of charges on rejected imports"
// (updated 2 April 2026): CDS claim with an EORI, otherwise online form C&E1179; VAT-registered
// importers adjust input tax on the VAT Return.
// Missed preference: GOV.UK "Proving originating status and claiming a reduced rate of Customs
// Duty for trade between the UK and EU" (updated 20 December 2022): a claim after import within
// 3 years must be accompanied by a valid proof of origin; a statement on origin is valid for 2
// years for UK imports and must be valid when the repayment application is submitted; the
// importer keeps it for 4 years. Who can claim and written authority: GOV.UK "Get someone to
// deal with customs for you" (updated 6 February 2025). All checked 16 October 2026.
// Self-contained: the page script inlines this file.

export const C285_LIMITS = {
  overpaid: { days: null, years: 3, label: '3 years for overpayments' },
  preference: { days: null, years: 3, label: '3 years for overpayments' },
  rejected: { days: null, years: 1, label: '1 year for rejected imports' },
  withdrawn: { days: 90, years: null, label: '90 days for withdrawal of an import declaration' },
}

const DAY = 24 * 60 * 60 * 1000

// Official start pages (the "Start now" buttons on GOV.UK), checked 16 October 2026.
export const C285_START = {
  cds: { label: 'START YOUR CLAIM IN CDS ↗', url: 'https://www.tax.service.gov.uk/claim-back-import-duty-vat/start-new-return' },
  c285: { label: 'START THE ONLINE C285 ↗', url: 'https://www.tax.service.gov.uk/submissions/new-form/claim-refund-of-import-duty-or-vat' },
  ce1179: { label: 'START THE ONLINE C&E1179 ↗', url: 'https://www.tax.service.gov.uk/submissions/new-form/claim-refund-of-duty-or-vat-rejected-imports' },
  chief: { label: 'OPEN THE CHIEF REPAYMENT GUIDE ↗', url: 'https://www.gov.uk/guidance/apply-for-repayment-of-import-duty-and-vat-chief' },
}

export const PROOF_OF_ORIGIN = 'Proof of origin (for example the origin statement on the invoice). It must be valid on the day you submit the claim: a UK–EU statement on origin is valid for 2 years from the date it was made out. Upload it with the claim and keep it for 4 years.'

export const BROKER_AUTHORITY = 'Your customs agent or broker can claim for you. They need your written instructions to act for you, and HMRC asks for that evidence only if it needs it. The claim asks for the bank details of the person receiving the repayment, so agree in writing who that is.'

export function claimDeadline(reason, acceptedOn) {
  const limit = C285_LIMITS[reason]
  if (!limit) return null
  const start = new Date(`${acceptedOn}T00:00:00Z`)
  if (Number.isNaN(start.getTime())) return null
  const end = new Date(start)
  if (limit.years) end.setUTCFullYear(end.getUTCFullYear() + limit.years)
  else end.setUTCDate(end.getUTCDate() + limit.days)
  return end
}

const iso = (date) => date.toISOString().slice(0, 10)
export const ukDate = (date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export function repaymentRoute(answers, { today = new Date() } = {}) {
  const { reason, system, who, eori, taxes, vatRegistered, postal, acceptedOn } = answers
  const routes = []
  const checklist = []
  const notes = []

  if (postal === 'yes') {
    routes.push({ id: 'bor286', title: 'Form BOR286', detail: 'Goods delivered by Parcelforce or Royal Mail: claim with form BOR286, not C285.' })
    return { routes, checklist: [], deadline: null, status: 'route', notes }
  }
  if (reason === 'ni_at_risk') {
    routes.push({ id: 'ni_at_risk', title: '“At risk” goods into Northern Ireland', detail: 'Use the GOV.UK guide “Apply to claim a repayment or remission of import duty on ‘at risk’ goods brought into Northern Ireland”.' })
    return { routes, checklist: [], deadline: null, status: 'route', notes }
  }

  const claimsVat = taxes === 'vat' || taxes === 'both'
  const claimsDuty = taxes === 'duty' || taxes === 'both'
  const rejected = reason === 'rejected'
  if (claimsVat && vatRegistered === 'yes') {
    routes.push(rejected
      ? { id: 'vat_return', title: 'VAT Return adjustment for the import VAT', detail: 'VAT-registered: for rejected imports, adjust your input tax on the VAT Return. You cannot claim the import VAT on the C&E1179 form or the online services.' }
      : { id: 'vat_return', title: 'VAT Return adjustment for the import VAT', detail: 'VAT-registered: reduce the output tax in Box 1 of your VAT Return and keep records to support it. You cannot use C285 or the online services for overpaid import VAT, and you cannot recover it as input tax.' })
  }
  const dutyOrUnregisteredVat = claimsDuty || (claimsVat && vatRegistered !== 'yes')
  if (dutyOrUnregisteredVat) {
    const needsC285 = eori === 'no' || who === 'individual' || reason === 'waiver'
    if (needsC285 && rejected) {
      routes.push({ id: 'ce1179', title: 'Online form C&E1179', detail: 'Rejected imports with no EORI registered to you, as a private individual, for import VAT without VAT registration or an EORI, or under the Customs Duty Waiver Scheme: use the online C&E1179 form for the duty and the VAT.' })
    } else if (needsC285) {
      routes.push({ id: 'c285', title: 'Online form C285', detail: 'Use the online C285 form: you have no EORI, you are a private individual, the claim is for import VAT without VAT registration or an EORI, or it is under the Customs Duty Waiver Scheme.' })
    } else if (system === 'chief') {
      routes.push({ id: 'chief', title: 'CHIEF repayment route', detail: 'The declaration was made in CHIEF, so claim through the CHIEF repayment route on GOV.UK.' })
    } else {
      routes.push({ id: 'cds', title: 'Customs Declaration Service claim', detail: 'You have an EORI and the declaration was made in CDS: claim online in the Customs Declaration Service, signed in with the Government Gateway ID linked to your EORI. Track the claim on your claims dashboard.' })
    }
  }

  const usesC285 = routes.some((route) => route.id === 'c285' || route.id === 'ce1179')
  const usesCds = routes.some((route) => route.id === 'cds' || route.id === 'chief')
  if (usesCds || usesC285) {
    checklist.push('Movement Reference Number (MRN) of the import declaration')
    checklist.push(usesC285 ? 'EORI number of the importer or agent (or the one used under the Customs Duty Waiver Scheme)' : 'Your EORI number')
    checklist.push('Contact and address details')
    checklist.push('UK bank account details: sort code, account number and account name')
    if (reason === 'rejected') {
      checklist.push('Copy of the import invoice')
      checklist.push('Documentary proof of entitlement (why the goods were rejected)')
      checklist.push('Calculation worksheet if you claim a proportion of the charges paid')
    } else {
      checklist.push(usesC285 ? 'Commercial invoice or receipt confirming the value of the goods' : 'Commercial invoice showing the value of the imported goods')
      if (usesCds) checklist.push('The amount that should have been paid to HMRC')
      if (usesC285 && claimsVat) checklist.push('The import VAT paid to HMRC')
      if (reason === 'preference') checklist.push(PROOF_OF_ORIGIN)
      checklist.push('Packing list (helpful)')
      checklist.push('Transport document: air waybill or bill of lading (helpful)')
    }
  }
  if (routes.some((route) => route.id === 'vat_return')) {
    checklist.push(rejected ? 'Records supporting the VAT Return adjustment: the import declaration, the rejection evidence and the VAT paid' : 'Records supporting the Box 1 adjustment: the import declaration, the corrected figures and the VAT paid')
  }

  const deadline = acceptedOn ? claimDeadline(reason === 'waiver' ? 'overpaid' : reason, acceptedOn) : null
  const start = routes.map((route) => C285_START[route.id]).filter(Boolean)
  const authority = who === 'individual' ? null : BROKER_AUTHORITY
  let status = 'route'
  if (deadline) {
    const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / DAY)
    if (daysLeft < 0) {
      status = 'expired'
      notes.push(`The standard time limit ended on ${ukDate(deadline)}. Read “Check the regulations” on GOV.UK for the exceptions before you decide.`)
    } else if (daysLeft <= 60) {
      status = 'urgent'
      notes.push(`Claim now: the time limit ends on ${ukDate(deadline)}, in ${daysLeft} days.`)
    } else {
      notes.push(`The time limit ends on ${ukDate(deadline)} (${daysLeft} days from today).`)
    }
  }
  return { routes, checklist, deadline: deadline ? iso(deadline) : null, status, notes, start, authority }
}

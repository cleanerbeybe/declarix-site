// Import duty and VAT repayment route checker (C285 / CDS claim).
// Source: GOV.UK "How to claim a repayment of import duty and VAT if you've overpaid"
// (updated 1 September 2026): time limits 3 years overpayment, 1 year rejected imports,
// 90 days withdrawal; routes by EORI, declaration system, VAT registration and postal delivery.
// Self-contained: the page script inlines this file.

export const C285_LIMITS = {
  overpaid: { days: null, years: 3, label: '3 years for overpayments' },
  rejected: { days: null, years: 1, label: '1 year for rejected imports' },
  withdrawn: { days: 90, years: null, label: '90 days for withdrawal of an import declaration' },
}

const DAY = 24 * 60 * 60 * 1000

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
  if (claimsVat && vatRegistered === 'yes') {
    routes.push({ id: 'vat_return', title: 'VAT Return adjustment for the import VAT', detail: 'VAT-registered: reduce the output tax in Box 1 of your VAT Return and keep records to support it. You cannot use C285 or the online services for overpaid import VAT, and you cannot recover it as input tax.' })
  }
  const dutyOrUnregisteredVat = claimsDuty || (claimsVat && vatRegistered !== 'yes')
  if (dutyOrUnregisteredVat) {
    const needsC285 = eori === 'no' || who === 'individual' || reason === 'waiver'
    if (needsC285) {
      routes.push({ id: 'c285', title: 'Online form C285', detail: 'Use the online C285 form: you have no EORI, you are a private individual, the claim is for import VAT without VAT registration or an EORI, or it is under the Customs Duty Waiver Scheme.' })
    } else if (system === 'chief') {
      routes.push({ id: 'chief', title: 'CHIEF repayment route', detail: 'The declaration was made in CHIEF, so claim through the CHIEF repayment route on GOV.UK.' })
    } else {
      routes.push({ id: 'cds', title: 'Customs Declaration Service claim', detail: 'You have an EORI and the declaration was made in CDS: claim online in the Customs Declaration Service, signed in with the Government Gateway ID linked to your EORI. Track the claim on your claims dashboard.' })
    }
  }

  const usesC285 = routes.some((route) => route.id === 'c285')
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
      checklist.push('Packing list (helpful)')
      checklist.push('Transport document: air waybill or bill of lading (helpful)')
    }
  }
  if (routes.some((route) => route.id === 'vat_return')) {
    checklist.push('Records supporting the Box 1 adjustment: the import declaration, the corrected figures and the VAT paid')
  }

  const deadline = acceptedOn ? claimDeadline(reason === 'waiver' ? 'overpaid' : reason, acceptedOn) : null
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
  return { routes, checklist, deadline: deadline ? iso(deadline) : null, status, notes }
}

// Draft claim alignment. Publication and commercial terms remain separate decisions.
export const scopeReview = '2026-09-16'
export const scopeBoundary = 'The H1 standard-import profile is review-only and incomplete. Declarix does not submit directly to HMRC. Generic export preparation is not an accepted named connector. Your authorised team retains customs judgment, approval and filing.'
export const scopeCta = {
  title: 'Choose a workflow worth testing.',
  copy: 'Bring your document types, review steps and filing system to a 20-minute numbers call. Agree the test, acceptance criteria and data controls before any live documents move. Do not attach live customer documents to an initial enquiry.',
  label: 'BOOK THE 20-MINUTE NUMBERS CALL',
}
export const scopeCard = {
  title: 'Customs preparation. Evidence-linked review.',
  subtitle: 'Keep missing facts and decisions visible.',
  boundary: 'H1: review-only, incomplete. Your authorised team files.',
}
export const productScopeRoutes = [
  {
    path: '/supported-scope/', ref: 'SCHEDULE 03 · PRODUCT FIT',
    title: 'Customs preparation scope and handoff | Declarix',
    description: 'Review Declarix document intake, evidence-linked checks and handoff preparation. See H1 coverage limits and what a named-system acceptance test must prove.',
    eyebrow: 'SUPPORTED SCOPE · PREPARATION AND REVIEW',
    h1: 'Know exactly where Declarix fits.',
    standfirst: 'Keep the documents, missing facts and review decisions together. Declarix is a case-based customs preparation and review workspace, not a replacement for your filing system.',
    stamp: 'PREPARE\nREVIEW',
    sections: [
      { label: '01 · DOCUMENT INTAKE', title: 'Start with the job, not one invoice.', paragraphs: [
        'Mixed document intake brings shipment information into one case. Invoice and packing-list comparison is one use case, alongside missing-information work and evidence-linked review.',
        'Agree the document types and quality to test. A supported format does not mean every layout or field is covered. Check available source references and record gaps rather than treating an empty value as a verified fact.',
      ] },
      { label: '02 · CURRENT SCOPE', title: 'Separate preparation from accepted filing data.', facts: [
        ['H1 standard imports', 'Review-only, incomplete coverage. This is not declaration-ready output.'],
        ['Checks', 'Configured structural, consistency and selected customs/documentary checks, not a complete lawbook.'],
        ['Evidence', 'Available source references support review; coverage depends on the field and document.'],
        ['Assignment and approval', 'Capability- and policy-driven controls, with second approval where the policy requires it.'],
        ['Customer questions', 'Request tracking and reply handling do not establish a live email-delivery service or released customer portal.'],
        ['Submission', 'Your authorised team uses its existing customs system and permissions. Declarix does not file.'],
      ] },
      { label: '03 · HANDOFF', title: 'Test the exact destination before relying on it.', paragraphs: [
        'For Sequoia, Descartes e-Customs or CargoWise, confirm the destination version, field mapping and acceptance criteria. Generic preparation and export code do not establish a tested connector to any of these systems.',
        'Controlled handoff preparation retains current-snapshot and approval gates. An incomplete H1 profile cannot bypass those gates. A generic export example is not proof that a recipient accepts it.',
      ] },
      { label: '04 · WORKFLOW FIT', title: 'Pick a useful, measurable first test.', list: [
        'Choose a document-heavy preparation task with visible review decisions.',
        'Record missing facts, conflicts, exceptions and unsupported cases as well as clean runs.',
        'Measure preparation, review, customer chase and filing separately, using your own baseline.',
        'Define recipient acceptance before claiming a working handoff.',
        'Agree access, transfer and retention controls before using real customer data.',
      ] },
    ],
  },
  {
    path: '/how-it-works/', ref: 'FORM 06 · OPERATING FLOW',
    title: 'How Declarix prepares customs cases for review',
    description: 'Bring documents, proposed shipment data and review decisions into one customs case. Understand missing-information work, H1 limits and controlled handoff preparation.',
    eyebrow: 'HOW IT WORKS · CASE PREPARATION AND REVIEW',
    h1: 'Keep the evidence beside the decision.',
    standfirst: 'Move from scattered paperwork to a case your team can review. Proposed shipment data, source references, missing facts and decisions stay in the same workflow.',
    stamp: 'EVIDENCE\nAND REVIEW',
    sections: [
      { label: '01 · INTAKE', title: 'Bring the documents into one case.', paragraphs: [
        'Mixed document intake starts the preparation workflow. Agree the supported formats and test representative layouts, scans and line tables; do not assume every attachment or field will be covered.',
      ] },
      { label: '02 · PROPOSED DATA', title: 'Check the value against its source.', paragraphs: [
        'Common shipment data and available document references support evidence-linked review. The reviewer checks the value, its source and any gaps. A proposed value is not a verified customs decision.',
      ] },
      { label: '03 · EXCEPTIONS', title: 'Keep missing facts and conflicts visible.', paragraphs: [
        'Configured structural, consistency and selected customs/documentary checks help organise review. They are not a complete lawbook. For example, conflicting delivery terms should become a review question, not a silent guess.',
        'Missing-information requests and reply handling belong to the case. This does not establish a live email-delivery service or a released customer portal.',
      ] },
      { label: '04 · REVIEW', title: 'Make the decision and record it.', paragraphs: [
        'Assignment and approval follow capabilities and configured policy. A policy can require second approval; the workflow does not assume one universal junior/senior hierarchy.',
        'Measure your preparation and review time on representative cases. There is no processing-time or savings promise on this page.',
      ] },
      { label: '05 · CONTROLLED HANDOFF', title: 'Prove the destination accepts the output.', paragraphs: [
        'Handoff preparation uses current-snapshot and approval gates. The incomplete H1 profile cannot bypass them. The broker remains responsible for classification, customs judgment and filing.',
        'Generic exports do not prove acceptance by Sequoia, Descartes e-Customs or CargoWise. Confirm the exact mapping and destination acceptance before treating any handoff as operational.',
      ] },
      { label: '06 · NEXT STEP', title: 'Agree a test that answers a desk problem.', paragraphs: [
        'Use your volume, preparation time, review burden and exception mix to choose the first test. Define success and unsupported cases before starting; a worked example is not a measured customer result.',
      ] },
    ],
  },
].map(route => ({ ...route, reviewedOn: scopeReview, claimContract: 'product-scope-draft-2026-09-16', ogImage: '/product-scope.png', limitations: scopeBoundary, cta: scopeCta }))

export function validateProductScope(candidate = productScopeRoutes) {
  const expected = ['/supported-scope/', '/how-it-works/']
  if (candidate.length !== expected.length || expected.some(path => candidate.filter(r => r.path === path).length !== 1)) throw new Error('Scope routes missing or duplicated')
  for (const route of candidate) {
    for (const key of ['title','description','h1','standfirst','stamp','limitations','reviewedOn','claimContract','ogImage','cta','sections']) if (!route[key]) throw new Error('Missing scope field: '+key)
    if (route.limitations !== scopeBoundary || route.reviewedOn !== scopeReview || route.claimContract !== 'product-scope-draft-2026-09-16' || route.ogImage !== '/product-scope.png') throw new Error('Scope contract mismatch')
    if (!route.sections.length || route.sections.some(s => !s.title || !(s.paragraphs?.length || s.list?.length || s.facts?.length))) throw new Error('Empty scope section')
    const text = JSON.stringify(route)
    if (/CDS.ready|3[×x]|200 seconds|£\d|every (?:proposed )?field|supported export|supports Sequoia|ready for Sequoia/i.test(text)) throw new Error('Unsupported scope claim')
    for (const phrase of ['current-snapshot','approval gates','review-only','incomplete','does not submit directly to HMRC','not an accepted named connector','Do not attach live customer documents']) if (!text.includes(phrase)) throw new Error('Missing scope boundary: '+phrase)
  }
  return true
}

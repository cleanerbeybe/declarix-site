import { scopeBoundary, scopeCta, scopeReview } from './product-scope.mjs'

export const selectionContract = 'selection-pages-draft-2026-09-16'
const hmrcSource = {
  title: 'Software developers providing customs declaration software',
  publisher: 'HM Revenue & Customs',
  url: 'https://www.gov.uk/guidance/list-of-software-developers-providing-customs-declaration-support',
  checked: scopeReview,
}
export const selectionRoutes = [
  {
    path: '/about/', ref: 'REGISTER 08 · COMPANY',
    title: 'About Declarix | Customs preparation and review',
    description: 'Declarix builds a customs preparation and review workspace for brokers and freight forwarders. See the product purpose, current limits and evaluation approach.',
    eyebrow: 'ABOUT · BUILT FOR THE CUSTOMS DESK',
    h1: 'Keep the paperwork and the decision together.',
    standfirst: 'Declarix focuses on the work around the filing system: bringing documents, proposed shipment data, missing facts and review decisions into one case.',
    stamp: 'DESK\nFIRST',
    sections: [
      { label: '01 · COMPANY', title: 'Declarix Limited.', facts: [
        ['Legal name', 'Declarix Limited'], ['Company number', '17288258'], ['Contact', 'pack@getdeclarix.com'],
      ] },
      { label: '02 · PRODUCT PURPOSE', title: 'Give the reviewer a clearer case.', paragraphs: [
        'A customs desk needs to understand what the documents say, which facts disagree and what still needs an answer. Declarix brings proposed data and available source references into the review workflow.',
        'The aim is to make preparation and missing-information work easier to follow. An aim is not a measured customer result: evaluate it against your own cases, people and baseline.',
      ] },
      { label: '03 · OPERATING APPROACH', title: 'A proposed value still needs a decision.', paragraphs: [
        'Configured checks support structural, consistency and selected customs/documentary review. They do not provide complete legal coverage or replace customs judgment.',
        'Handoff preparation retains current-snapshot and approval gates. An incomplete profile cannot bypass them. Missing facts and unsupported cases remain review work.',
      ] },
      { label: '04 · EVALUATION', title: 'Agree what a useful result would look like.', list: [
        'Choose representative document layouts and exceptions, not only a clean example.',
        'Count preparation, review, customer chase, corrections and filing separately.',
        'Check available evidence references and record gaps instead of assuming complete coverage.',
        'Confirm the destination mapping and acceptance criteria before relying on a handoff.',
        'Agree data controls and commercial terms before sending live customer information.',
      ] },
    ],
  },
  {
    path: '/customs-declaration-software/', ref: 'GUIDE 10 · CATEGORY',
    title: 'Customs declaration software: preparation or filing? | Declarix',
    description: 'Separate customs document preparation from declaration submission. Compare review, evidence and destination acceptance before choosing a software workflow.',
    eyebrow: 'CUSTOMS DECLARATION SOFTWARE · PREPARATION OR FILING',
    h1: 'Choose the part of the declaration workflow you need.',
    standfirst: 'Start with the decision: do you need software to submit declarations, or help preparing the documents and proposed data before filing? Test those jobs separately.',
    stamp: 'PREPARE\nTHEN REVIEW',
    sections: [
      { label: '01 · TWO DIFFERENT JOBS', title: 'Preparation is not submission.', facts: [
        ['Filing requirement', 'Confirm the declaration types, jurisdiction, permissions and submission service your team needs.'],
        ['Preparation requirement', 'Evaluate document intake, proposed data, source references, missing facts and review decisions.'],
        ['Declarix role', 'Case-based preparation and review; not direct HMRC submission.'],
        ['Handoff requirement', 'Prove the exact destination accepts the reviewed output; a file format alone is not proof.'],
      ], paragraphs: [
        'HMRC’s developer guide describes software interaction with its declaration APIs. That submission role is distinct from preparation and review.',
        'HMRC publishes contact details for developers supplying Customs Declaration Service software. HMRC states that it does not recommend or endorse one product over another. The list is not proof that a separate preparation tool has an accepted connector.',
      ] },
      { label: '02 · THE REVIEWER', title: 'Check the proposed data, not only the file.', list: [
        'Compare proposed values with available document and source references.',
        'Record conflicting, missing and unsupported facts as review work.',
        'Keep classification, origin, valuation and other customs judgments with the authorised team.',
        'Test the current-snapshot and approval gates before evaluating handoff preparation.',
      ] },
      { label: '03 · DESTINATION ACCEPTANCE', title: 'Ask for the exact mapping and version.', paragraphs: [
        'For Sequoia, Descartes e-Customs, CargoWise or another destination, agree the product version, required fields and acceptance criteria. Generic export preparation does not establish a tested connector to that destination.',
        'Separate local format checks from recipient-side import and error handling. Do not describe a handoff as operational until the agreed destination test passes.',
      ] },
      { label: '04 · BUYING TEST', title: 'Use a representative case and a defined baseline.', list: [
        'Agree data controls first, then use synthetic or properly anonymised examples for initial evaluation.',
        'Include scans, line tables, conflicting facts and an unsupported case.',
        'Measure preparation, review, chase, correction and filing time separately.',
        'Keep setup, ongoing costs, support and acceptance criteria in the written evaluation plan.',
      ] },
    ], sources: [hmrcSource, {title: 'Customs Declarations end-to-end service guide', publisher: 'HMRC Developer Hub', url: 'https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/', checked: scopeReview}],
  },
  {
    path: '/customs-clearance-software/', ref: 'BUYER FILE 12 · CLEARANCE SOFTWARE',
    title: 'Customs clearance software: compare the workflow | Declarix',
    description: 'Map intake, customer questions, review, filing and status work before choosing customs clearance software. Locate the preparation task worth testing first.',
    eyebrow: 'CUSTOMS CLEARANCE SOFTWARE · WORKFLOW FIT',
    h1: 'Find the work that holds the case up.',
    standfirst: 'A software shortlist is more useful when each option answers a specific desk problem. Separate document preparation from customer coordination, filing and release-status work.',
    stamp: 'WORKFLOW\nFIT',
    sections: [
      { label: '01 · MAP THE DESK', title: 'Name the owner of each step.', facts: [
        ['Intake', 'Which documents arrive, where they enter the workflow and how a case is identified.'],
        ['Missing information', 'Who asks the question, receives the reply and decides whether it is sufficient.'],
        ['Review', 'Who checks proposed data and handles exceptions before approval.'],
        ['Filing', 'Which authorised team and system submit, then handle the response.'],
        ['Status and release', 'Which existing process supplies the status information your team relies on.'],
      ] },
      { label: '02 · DECLARIX FIT', title: 'Evaluate the preparation work around filing.', paragraphs: [
        'Declarix brings documents, proposed shipment data and review decisions into one case. Available source references and configured checks help organise the review; coverage depends on the field, document and profile.',
        'Request tracking and reply handling do not establish a live email-delivery service or released customer portal. This page does not claim transport coordination, release-status tracking or a replacement filing service.',
        'Handoff preparation retains current-snapshot and approval gates. The incomplete H1 profile cannot bypass them.',
      ] },
      { label: '03 · YOUR BUYING FILE', title: 'Compare the work, not a feature count.', list: [
        'Record the case mix, document formats, exception frequency and current handling steps.',
        'Ask each supplier to show where work moves between systems and who owns a failed handoff.',
        'Verify permissions, data location, access, retention and deletion for the proposed deployment.',
        'Record implementation effort, ongoing review work and commercial units with your own inputs.',
        'Do not treat a clean demonstration or a calculator output as a measured customer saving.',
      ] },
      { label: '04 · TEST ONE BOTTLENECK', title: 'Make the result observable.', paragraphs: [
        'Pick one preparation task, agree representative cases and record the baseline. Count unresolved questions, unsupported cases and corrections as well as successful results.',
        'Keep the current filing system in the test plan. Confirm the exact destination version, mapping and recipient acceptance before relying on any preparation handoff.',
      ] },
    ],
  },
].map(route => ({ ...route, reviewedOn: scopeReview, claimContract: selectionContract, ogImage: '/product-scope.png', limitations: scopeBoundary, cta: scopeCta }))

export function validateSelectionPages(candidate = selectionRoutes) {
  const paths = ['/about/', '/customs-declaration-software/', '/customs-clearance-software/']
  if (candidate.length !== paths.length || paths.some(path => candidate.filter(r => r.path === path).length !== 1)) throw new Error('Selection routes missing or duplicated')
  for (const route of candidate) {
    for (const key of ['title','description','h1','standfirst','stamp','limitations','reviewedOn','claimContract','ogImage','cta','sections']) if (!route[key]) throw new Error('Missing selection field: '+key)
    if (route.limitations !== scopeBoundary || route.reviewedOn !== scopeReview || route.claimContract !== selectionContract || route.ogImage !== '/product-scope.png') throw new Error('Selection contract mismatch')
    if (route.description.length < 80 || route.description.length > 180 || route.sections.length < 4 || route.sections.some(s => !s.title || !(s.paragraphs?.length || s.list?.length || s.facts?.length))) throw new Error('Incomplete selection content')
    const text = JSON.stringify(route)
    if (/CDS.ready|3[×x]|three times more|200 seconds|£\d|every (?:proposed )?field|every proposed value|no new headcount|more margin|supported export|supports Sequoia|ready for Sequoia/i.test(text)) throw new Error('Unsupported selection claim')
    for (const phrase of ['current-snapshot','approval gates','review-only','incomplete','does not submit directly to HMRC','not an accepted named connector','Do not attach live customer documents']) if (!text.includes(phrase)) throw new Error('Missing selection boundary: '+phrase)
    if (route.sources?.some(s => !s.title || !s.publisher || !['https://www.gov.uk/','https://developer.service.hmrc.gov.uk/'].some(origin => s.url.startsWith(origin)) || s.checked !== scopeReview)) throw new Error('Invalid selection source')
  }
  return true
}

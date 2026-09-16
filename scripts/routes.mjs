import { registrationRoute } from './registration-kit.mjs'
import { selectionRoutes } from './selection-pages.mjs'
import { scopeBoundary, scopeCta, productScopeRoutes } from './product-scope.mjs'

export const site = {
  origin: 'https://getdeclarix.com',
  company: 'Declarix Limited',
  companyNumber: '17288258',
  contact: 'pack@getdeclarix.com',
  booking: 'https://declarixlimited.zohobookings.eu/#/declarixlimited',
  reviewedOn: '2026-07-17',
  claimsVersion: '2.0.0',
}

export const routes = [
  {
    path: '/privacy/',
    ref: 'NOTICE 01 · DATA HANDLING',
    title: 'Privacy notice | Declarix',
    description:
      'How Declarix handles website enquiries, booking data, and pilot information, including the controls agreed before documents are transferred.',
    eyebrow: 'PRIVACY · WEBSITE, ENQUIRIES AND PILOTS',
    h1: 'Know what happens before you send data.',
    standfirst:
      'This notice separates the public website and booking journey from product or pilot processing. A pilot data schedule is agreed before live documents move.',
    stamp: 'DATA FLOW\nBEFORE FILES',
    limitations:
      'Do not attach customer documents to an initial email. First agree the transfer channel, data schedule, retention treatment, and people authorised to access the pilot.',
    sections: [
      {
        label: '01 · CONTROLLER',
        title: 'Who to contact.',
        paragraphs: [
          'Declarix Limited, company number 17288258, is based in Leicester, England. Email pack@getdeclarix.com for privacy questions or requests.',
          'A customer agreement may allocate controller and processor roles differently for a pilot. Those roles are recorded in writing before product data is processed.',
        ],
      },
      {
        label: '02 · PUBLIC SITE',
        title: 'What the website handles.',
        paragraphs: [
          'The site is served through GitHub Pages, whose infrastructure may process routine request and security metadata. Declarix analytics is deployment-configured and records only documented interaction, route, and campaign properties; it must not receive document data, email addresses, EORIs, or free-text enquiry content.',
          'The Zoho Bookings frame loads only after a visitor asks to see available times. Zoho then handles the information entered in that booking flow under its own notices and the Declarix account configuration.',
        ],
      },
      {
        label: '03 · ENQUIRIES',
        title: 'Email and booking enquiries.',
        paragraphs: [
          'We use the contact details and message you provide to respond, arrange a call, scope a possible pilot, and keep an appropriate business record. Do not include an EORI, declaration, invoice, packing list, or other customer document in the first message.',
          'Enquiry retention follows the business and legal purpose for which it was collected. It is not represented as instant deletion.',
        ],
      },
      {
        label: '04 · PILOT DATA',
        title: 'Product data has its own schedule.',
        paragraphs: [
          'Before a pilot, Declarix records the approved transfer channel, data categories, permitted purpose, access, subprocessors, processing locations, retention classes, deletion behavior, legal-hold treatment, and incident contacts.',
          'Customs records and short-lived operational artefacts can have different retention obligations. The applicable schedule, not a generic website promise, controls the pilot.',
        ],
      },
      {
        label: '05 · YOUR RIGHTS',
        title: 'Questions, access, correction, and objection.',
        paragraphs: [
          'Contact pack@getdeclarix.com to ask what personal data Declarix holds about you, request correction, raise an objection, or ask about deletion. We will verify the requester and explain any legal obligation that limits a request.',
          'You may also complain to the UK Information Commissioner. This notice will be updated when the public data flow or pilot contract changes.',
        ],
      },
      {
        label: '06 · STATUS',
        title: 'Operational notice, reviewed with each data-flow change.',
        facts: [
          ['Last reviewed', '16 July 2026'],
          ['Public analytics', 'Deployment-configured, documented events only'],
          ['Booking provider', 'Zoho Bookings, loaded after visitor action'],
          ['Pilot document transfer', 'Agreed before live documents move'],
        ],
      },
    ],
  },
  {
    path: '/security/',
    claimContract: 'offer-boundaries-draft-2026-09-16',
    ref: 'SCHEDULE 02 · SECURITY',
    title: 'Security and data schedule | Declarix',
    description:
      'The current Declarix security boundary, HMRC submission boundary, and the deployment facts confirmed in writing before a customs-document pilot.',
    eyebrow: 'SECURITY · A FORWARDABLE OPERATIONS NOTE',
    h1: 'Your customer data is not the product.',
    standfirst:
      'Customer documents are processed for the job, returned with the entry pack and never used to train models. Deployment details are supplied before live data moves.',
    stamp: 'NO MODEL\nTRAINING',
    limitations:
      scopeBoundary + ' No public page can replace a customer security review or data-processing agreement. Deployment-specific answers are provided before customer documents are transferred.',
    cta: scopeCta,
    sections: [
      {
        label: '01 · PRODUCT BOUNDARY',
        title: 'Documents in. Evidence-linked preparation pack back.',
        paragraphs: [
          'Declarix reads customer documents and returns a preparation pack with available source evidence for the clerk to check. The current H1 profile is incomplete and review-only. Declarix does not submit to HMRC; the broker remains responsible for approval and filing.',
          'The public marketing site is separate from the product environment. The site does not accept document uploads.',
        ],
      },
      {
        label: '02 · BEFORE A PILOT',
        title: 'The schedule names what matters.',
        facts: [
          ['Data categories and purpose', 'Recorded for the proposed pilot'],
          ['Approved transfer channel', 'Confirmed before documents move'],
          ['Access and authorised roles', 'Confirmed for the deployment'],
          ['Subprocessors and locations', 'Current inventory supplied in writing'],
          ['Retention and deletion', 'Defined by data class and legal basis'],
          ['Incident contacts', 'Named in the pilot schedule'],
        ],
      },
      {
        label: '03 · WEBSITE',
        title: 'Small public attack surface.',
        paragraphs: [
          'The public site is static and served over enforced HTTPS through GitHub Pages. It has no login, payment form, or document-upload endpoint.',
          'The booking provider is loaded only after a visitor chooses to view the diary. The live product and its controls are reviewed separately from this marketing surface.',
        ],
      },
      {
        label: '04 · EVIDENCE',
        title: 'Ask for the deployment packet.',
        paragraphs: [
          'Security questionnaires, data-processing terms, the current vendor inventory, processing locations, retention rules, deletion evidence, and technical architecture are supplied for the deployment being assessed.',
          'Email pack@getdeclarix.com and identify your organisation, intended data, customs-system context, and security-review owner.',
        ],
      },
    ],
  },
  productScopeRoutes[0],
  {
    path: '/pricing/',
    claimContract: 'offer-boundaries-draft-2026-09-16',
    ref: 'SCHEDULE 04 · COMMERCIAL',
    title: 'Declarix pricing and ROI for customs desks',
    description:
      'See the Declarix per-entry pricing approach. Use your own preparation, review and cost inputs to assess a pilot without a preset savings claim.',
    eyebrow: 'PRICING · PER ENTRY, NOT PER SEAT',
    h1: 'Measure preparation cost before you price a pilot.',
    standfirst:
      'Declarix is priced per entry for the agreed workflow. Use the 20-minute numbers call to set out your desk’s representative volume, preparation time, review time and costs.',
    stamp: 'PER\nENTRY',
    limitations:
      scopeBoundary + ' Your own time and cost inputs define a scenario, not a measured saving or a quote.',
    cta: scopeCta,
    sections: [
      {
        label: '01 · INPUTS',
        title: 'Bring the inputs that define the work.',
        list: [
          'Declarations processed in a representative week.',
          'Minutes of clerk time used per declaration today.',
          'Loaded hourly cost of the people doing that work.',
          'The target workflow and any named destination that needs a separate version, mapping and acceptance test.',
          'The document mix and exceptions that make the job harder than average.',
        ],
      },
      {
        label: '02 · YOUR SCENARIO',
        title: 'Compare total cost using your own inputs.',
        list: [
          'Record preparation, checking, customer chasing and rework time for a representative job mix.',
          'Use your loaded staff cost and include software, setup, provider fees and retained review work.',
          'Enter your own assumptions in the preparation cost comparison. It has no default savings or provider rates.',
          'Recovered clerk time is a scenario input, not a capacity guarantee.',
          'The real test is whether your total cost falls after the Declarix per-entry rate is included.',
        ],
      },
      {
        label: '03 · COMPARISON',
        title: 'Keep assumptions separate from observed results.',
        links: [{ href: '/compare/automation-vs-outsourcing/', label: 'OPEN THE BUYER-INPUT PREPARATION COST COMPARISON' }],
        paragraphs: [
          'Use the preparation cost comparison to compare in-house assisted work with outsourced preparation. It calculates from your inputs only; it does not predict Declarix performance or state a Declarix price.',
          'Test the target workflow and any destination separately. Time released for other work is not automatically cash saved. If total cost rises, keep that result visible rather than assuming a saving.',
        ],
      },
      {
        label: '04 · NEXT STEP',
        title: 'Agree what the pilot must measure.',
        paragraphs: [
          'Book the 20-minute numbers call. Bring what you know; estimates are enough to start. Agree a representative job, the measures to record and the acceptance test for the target workflow.',
        ],
      },
    ],
  },
  {
    path: '/pricing-policy/',
    claimContract: 'offer-boundaries-draft-2026-09-16',
    ref: 'BUYER SHEET 05 · PRICING RULES',
    title: 'How Declarix pricing works: entries, rework and pilot',
    description:
      'See how Declarix pricing counts entries, handles rework and pilot costs, and compares total cost using your own time and cost inputs.',
    eyebrow: 'PRICING EXPLAINED · WHAT COUNTS AND WHAT TO ASK',
    h1: 'Know what you pay for before the pilot starts.',
    standfirst:
      'Define the unit, separate genuine rework from changed jobs, then measure preparation, review and rework costs for the agreed workflow.',
    stamp: 'CLEAR\nCOUNT',
    limitations:
      scopeBoundary + ' The final per-entry rate, inclusions and correction rules are stated in the quote. Use your own cost and time assumptions; this page promises no measured saving.',
    cta: scopeCta,
    sections: [
      {
        label: '01 · PER-ENTRY MODEL',
        title: 'Pay for declaration work, not another seat.',
        paragraphs: [
          'Declarix is priced against the entries and workflow it helps the desk process. Your quote names the unit being counted and shows how split shipments, amalgamated invoices, or unusual line volumes are treated, so the comparison uses the work you actually run.',
        ],
      },
      {
        label: '02 · REWORK',
        title: 'Separate a failed run from a changed job.',
        paragraphs: [
          'A processing failure, customer correction, broker amendment, duplicate submission, and expanded scope are different events. The quote explains which ones count and which do not, so a correction does not quietly become an unexplained second charge.',
        ],
      },
      {
        label: '03 · TOTAL COST',
        title: 'Compare the full desk cost, not a headline rate.',
        paragraphs: [
          'Put any minimum volume, VAT, payment timing, support, service window, pilot cap, renewal, and cancellation alongside the per-entry rate. Then compare that total with current preparation time, loaded clerk cost, customer chasing, and the declarations the team cannot take on today.',
        ],
      },
      {
        label: '04 · PILOT TEST',
        title: 'Remove the assumptions with one real workflow.',
        list: [
          'Use the same representative source pack and agreed start and stop points.',
          'Measure preparation, broker review, customer chase, rework, and filing time separately.',
          'Count the exceptions and unsupported cases as well as the clean runs.',
          'Use your own volume, current time, proposed review time, fees and loaded clerk cost. A scenario is not a measured result.',
        ],
      },
    ],
  },
  productScopeRoutes[1],
  {
    path: '/pilot/',
    claimContract: 'offer-boundaries-draft-2026-09-16',
    ref: 'DOCKET 07 · PILOT',
    title: 'Declarix customs-document preparation pilot',
    description:
      'After the 20-minute numbers call, prove Declarix on one anonymised customs job. The pilot is free if it fails and capped at £500 if it works.',
    eyebrow: 'PILOT · THE STEP AFTER THE NUMBERS WORK',
    h1: 'Prove it on one ugly job.',
    standfirst:
      'First run the ROI and map the target workflow. If the commercial case makes sense, send one anonymised job and let your clerk compare the evidence-linked preparation pack with the manual run.',
    stamp: '£0 FAIL\n£500 CAP',
    limitations:
      scopeBoundary + ' If the agreed job fails, you pay nothing. If it works, the initial pilot continues with a total cap of £500 before any wider rollout decision.',
    cta: scopeCta,
    sections: [
      {
        label: '01 · PREPARE',
        title: 'Choose the job your team hates.',
        list: [
          'Properly anonymise one real job.',
          'Include the document mess that creates real work, not a perfect demo bundle.',
          'Include the scans, spreadsheets, long line tables and conflicts that create the manual work.',
          'Use the system and declaration workflow mapped on the numbers call.',
        ],
      },
      {
        label: '02 · BASELINE',
        title: 'Compare the same job side by side.',
        paragraphs: [
          'Record the manual build and review time, then let Declarix process the same job. Your clerk checks the resulting pack, its evidence and the target-system handoff.',
        ],
      },
      {
        label: '03 · RUN',
        title: 'Get the preparation pack back.',
        paragraphs: [
          'Declarix returns the pack within one working day. Proposed values retain available sources, and conflicts stay visible for your clerk to resolve before approval.',
        ],
      },
      {
        label: '04 · DECIDE',
        title: 'Let the result make the decision.',
        facts: [
          ['Preparation time', 'Measured on the agreed pack'],
          ['Review time', 'Recorded separately'],
          ['Exceptions and unsupported cases', 'Counted, not hidden'],
          ['Corrections and rework', 'Assigned to their cause'],
          ['System handoff', 'Observed for the agreed target'],
          ['Pilot cost if the agreed job fails', '£0'],
          ['Initial pilot cap if it works', '£500 total'],
        ],
      },
    ],
  },
  selectionRoutes[0],
  {
    path: '/terms/',
    ref: 'NOTICE 09 · WEBSITE TERMS',
    title: 'Website terms | Declarix',
    description:
      'Terms for using the public Declarix website and its informational customs-document preparation content.',
    eyebrow: 'TERMS · PUBLIC WEBSITE',
    h1: 'Information here is not a filing decision.',
    standfirst:
      'These terms cover the public website. Product services, pilots, data processing, service levels, and commercial terms are governed by a separate written agreement.',
    stamp: 'WEBSITE\nONLY',
    limitations:
      'Nothing on this site is legal, tax, customs-classification, origin, valuation, or filing advice. The broker remains responsible for review and filing.',
    sections: [
      {
        label: '01 · OPERATOR',
        title: 'Who runs the site.',
        paragraphs: [
          'This website is operated by Declarix Limited, company number 17288258, Leicester, England. Contact pack@getdeclarix.com.',
        ],
      },
      {
        label: '02 · INFORMATION',
        title: 'Use the sources and your professional judgment.',
        paragraphs: [
          'We aim to keep public material clear, sourced, and dated, but customs rules and official services change. Check the linked official source and obtain appropriate professional review before acting.',
          'Declarix does not submit to HMRC and does not guarantee acceptance or an operational outcome.',
        ],
      },
      {
        label: '03 · ACCEPTABLE USE',
        title: 'Do not misuse the public surface.',
        paragraphs: [
          'Do not interfere with the site, attempt unauthorised access, submit unlawful material, impersonate another party, or use the content to misrepresent a filing decision. Do not send live customs documents until an approved channel is agreed.',
        ],
      },
      {
        label: '04 · LINKS AND MATERIAL',
        title: 'Sources remain their owners’ material.',
        paragraphs: [
          'External links are provided for context and do not imply endorsement. Declarix’s original site design, copy, and visual assets may not be republished as if they were another organisation’s work. Statutory and third-party rights remain unaffected.',
        ],
      },
      {
        label: '05 · CHANGES',
        title: 'Material changes receive a new reviewed date.',
        paragraphs: [
          'We may update these terms as the website and public resources change. The reviewed date and source/correction policy help visitors identify the current version.',
        ],
      },
    ],
  },
  selectionRoutes[1],
  selectionRoutes[2],
  registrationRoute,
  {
    path: '/editorial-policy/',
    ref: 'REGISTER 11 · SOURCES',
    title: 'Editorial, sources, and corrections policy | Declarix',
    description:
      'How Declarix sources, reviews, dates, corrects, and retires public customs guidance, tools, research, and product claims.',
    eyebrow: 'EDITORIAL POLICY · SOURCE BEFORE SUMMARY',
    h1: 'Every public claim needs an owner.',
    standfirst:
      'Declarix uses primary sources, reviewed interpretations, visible dates, and a correction path. Publication never silently changes product rules or makes an unsupported case safe.',
    stamp: 'SOURCE\nREVIEW\nCORRECT',
    limitations:
      'Official publishers remain authoritative for their domains. Declarix interpretation is identified as interpretation and reviewed before it affects a public operational recommendation.',
    sections: [
      {
        label: '01 · SOURCES',
        title: 'Primary authority first.',
        paragraphs: [
          'Regulated content starts with the relevant GOV.UK, HMRC, legislation, official API, or other primary publisher. Declarix records the source URL, capture date, effective date where known, and the part of the claim it supports.',
        ],
      },
      {
        label: '02 · REVIEW',
        title: 'Facts and interpretation stay separate.',
        paragraphs: [
          'A source capture is not automatically a public recommendation. Material customs interpretations require a named reviewer; public product, pricing, security, privacy, and outcome claims require their respective owner.',
        ],
      },
      {
        label: '03 · FRESHNESS',
        title: 'Stale is a visible state.',
        paragraphs: [
          'Time-sensitive resources receive a reviewed date and update or expiry rule. A material source change blocks or marks an affected result until the diff has been reviewed. Old pages are updated, consolidated, redirected, or removed rather than left to drift.',
        ],
      },
      {
        label: '04 · CORRECTIONS',
        title: 'Corrections become part of the record.',
        paragraphs: [
          'Email pack@getdeclarix.com with the URL, disputed statement, and supporting source. Material corrections record what changed and the review date. Good-faith corrections are welcomed; they do not require the reporter to become a lead.',
        ],
      },
      {
        label: '05 · AI AND AUTOMATION',
        title: 'Automation may assist; it does not own truth.',
        paragraphs: [
          'AI may help extract, reconcile, explain, draft, and prioritise. It must not invent a legal fact, silently reinterpret a rule, activate a product rule, or publish a material customs interpretation without the required review.',
        ],
      },
      {
        label: '06 · CLAIMS CONTRACT',
        title: 'Each reviewed route names its contract.',
        paragraphs: [
          'The publishing build checks public source files against versioned, route-specific claim contracts. Historical offer records remain visible as history; they do not approve newer route copy or publication.',
          'Each draft contract records its reviewed paths, scope limits, prohibited wording, owner gates and publication state. A route outside that contract remains outside the reviewed set.',
        ],
      },
    ],
  },
]

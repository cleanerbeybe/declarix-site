export const site = {
  origin: 'https://getdeclarix.com',
  company: 'Declarix Limited',
  companyNumber: '17288258',
  contact: 'pack@getdeclarix.com',
  booking: 'https://declarixlimited.zohobookings.eu/#/declarixlimited',
  reviewedOn: '2026-07-16',
  claimsVersion: '1.0.0',
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
    ref: 'SCHEDULE 02 · SECURITY',
    title: 'Security and data schedule | Declarix',
    description:
      'The current Declarix security boundary, HMRC submission boundary, and the deployment facts confirmed in writing before a customs-document pilot.',
    eyebrow: 'SECURITY · A FORWARDABLE OPERATIONS NOTE',
    h1: 'A security answer should name the deployment.',
    standfirst:
      'Declarix publishes only verified controls. Before a pilot, the team supplies the actual data flow, vendors, locations, access model, retention schedule, and incident contacts for the proposed deployment.',
    stamp: 'VERIFY\nTHEN STATE',
    limitations:
      'No public page can replace a customer security review or data-processing agreement. Deployment-specific answers are provided before customer documents are transferred.',
    sections: [
      {
        label: '01 · PRODUCT BOUNDARY',
        title: 'Preparation, not filing.',
        paragraphs: [
          'Declarix prepares a source-linked draft pack for broker review in front of the broker’s existing customs system. Declarix does not submit to HMRC; the broker remains responsible for review and filing.',
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
  {
    path: '/supported-scope/',
    ref: 'MANIFEST 03 · PUBLIC SCOPE',
    title: 'Supported scope and current limitations | Declarix',
    description:
      'The current Declarix H1 review scope, product boundary, unsupported elements, and the evidence gate required before wider readiness language.',
    eyebrow: 'SUPPORTED SCOPE · CLAIMS MANIFEST 1.0.0',
    h1: 'The current profile is review-only.',
    standfirst:
      'Declarix prepares source-linked draft data and unresolved questions for broker review. Current legal coverage is incomplete and the broker’s existing system remains the filing layer.',
    stamp: 'REVIEW\nONLY',
    limitations:
      'Profile CDS_IMPORT_H1_MINIMAL · scope status candidate_review_only · legal coverage complete false · activation mechanism implemented false.',
    sections: [
      {
        label: '01 · ALLOWED PUBLIC POSITION',
        title: 'What the product does today.',
        paragraphs: [
          'Declarix prepares a source-linked draft pack for broker review in front of the broker’s existing customs system. Declarix does not submit to HMRC; the broker remains responsible for review and filing.',
          'Unknown, conflicting, unsupported, stale, or unevaluated conditions must remain visible rather than being converted into a green outcome.',
        ],
      },
      {
        label: '02 · CURRENT PROFILE',
        title: 'The machine contract is fail-closed.',
        facts: [
          ['Profile', 'CDS_IMPORT_H1_MINIMAL'],
          ['Jurisdiction and category', 'GB import H1'],
          ['Scope status', 'Candidate review only'],
          ['Legal coverage', 'Incomplete'],
          ['Unsupported or unevaluated elements', '16'],
          ['Activation mechanism', 'Not implemented'],
        ],
      },
      {
        label: '03 · OPEN H1 ELEMENTS',
        title: 'Sixteen elements remain unsupported or unevaluated.',
        list: [
          'Additional declaration type; previous documents; declarant identification.',
          'Additions and deductions; valuation indicators; valuation-method evidence.',
          'Country of dispatch; goods location.',
          'Package type, count, shipping marks, and total packages.',
          'Container indicator; border transport mode; nature of transaction; statistical value.',
        ],
      },
      {
        label: '04 · CHANGE GATE',
        title: 'Wider claims need evidence, not copy approval alone.',
        list: [
          'Complete the supported-scope legal manifest for the same immutable run.',
          'Resolve every unsupported element and assert the rendered output independently.',
          'Pin fresh authority snapshots, rules, code, and target-system profile.',
          'Implement and separately review the activation mechanism.',
          'Prove that UI, report, API, release verdict, and exported artefact agree.',
        ],
      },
    ],
  },
  {
    path: '/pricing/',
    ref: 'SCHEDULE 04 · COMMERCIAL',
    title: 'Customs document preparation pricing | Declarix',
    description:
      'How Declarix scopes a written customs-document preparation pilot quote without unsupported price or savings promises.',
    eyebrow: 'PRICING · SCOPE BEFORE NUMBERS',
    h1: 'A written pilot quote before work starts.',
    standfirst:
      'Pricing depends on the agreed pilot, entry volume, document mix, exception load, support boundary, and measured workflow. Declarix does not publish a numerical rate until those commercial terms are approved.',
    stamp: 'QUOTE\nIN WRITING',
    limitations:
      'There is no self-serve checkout, public rate card, or universal savings claim in the current product. A quote is not complete until its counting and correction rules are explicit.',
    sections: [
      {
        label: '01 · INPUTS',
        title: 'What shapes a quote.',
        list: [
          'Weekly entry volume and peak pattern.',
          'Document formats, line counts, amalgamations, and source quality.',
          'Supported declaration scope and the broker’s existing customs-system workflow.',
          'Expected exception, review, and customer-chase load.',
          'Required support, service window, and evidence output.',
        ],
      },
      {
        label: '02 · WRITTEN TERMS',
        title: 'What the quote must say.',
        list: [
          'The pilot scope and what counts as a processed item.',
          'Inclusions, exclusions, minimums, taxes, and payment timing.',
          'Treatment of failures, retries, corrections, amendments, and cancelled jobs.',
          'Data schedule, support boundary, service expectations, and exit terms.',
          'How the pilot will measure time, quality, exceptions, and operational fit.',
        ],
      },
      {
        label: '03 · COMPARISON',
        title: 'Bring your real baseline.',
        paragraphs: [
          'The useful comparison is the same source pack processed by the current workflow and by the proposed Declarix-assisted workflow. Record elapsed preparation time, review time, exceptions, rework, and handoff outcome.',
          'That evidence can inform a commercial decision. A generic headline number cannot.',
        ],
      },
      {
        label: '04 · NEXT STEP',
        title: 'Leave with the questions answered.',
        paragraphs: [
          'Book a 20-minute workflow call with a representative week’s volume and one synthetic or properly anonymised pack shape. Declarix will identify the information needed for a written scope; do not send live documents before the transfer channel is agreed.',
        ],
      },
    ],
  },
  {
    path: '/pricing-policy/',
    ref: 'SCHEDULE 05 · COUNTING RULES',
    title: 'Pricing policy and pilot questions | Declarix',
    description:
      'The pricing, counting, correction, pilot, tax, support, and cancellation questions a Declarix quote must answer in writing.',
    eyebrow: 'PRICING POLICY · NO HIDDEN COUNTING RULES',
    h1: 'Define the edge cases before the invoice.',
    standfirst:
      'This page is the checklist a Declarix commercial proposal must satisfy. Where a term is not in the signed quote, it is not silently invented by this website.',
    stamp: 'TERMS\nBEFORE USE',
    limitations:
      'Current numerical pricing is pending commercial approval. This policy explains required transparency; it is not a rate card or a substitute for a signed order.',
    sections: [
      {
        label: '01 · VALUE METRIC',
        title: 'What is counted?',
        paragraphs: [
          'The written quote must identify whether the commercial unit is a reviewed entry, a source pack, a declaration line, a fixed pilot, or another defined unit. It must also explain how split shipments and amalgamated invoices are treated.',
        ],
      },
      {
        label: '02 · REWORK',
        title: 'What happens to retries and corrections?',
        paragraphs: [
          'The quote must distinguish a Declarix processing failure, customer-supplied correction, broker amendment, duplicate job, and scope change. The price and service treatment for each must be explicit.',
        ],
      },
      {
        label: '03 · COMMERCIAL TERMS',
        title: 'Minimums, tax, support, and cancellation.',
        paragraphs: [
          'Any minimum commitment, VAT treatment, payment period, support entitlement, service window, pilot cap, renewal, and cancellation right must appear in the written proposal. This website makes no default promise for an omitted term.',
        ],
      },
      {
        label: '04 · MEASUREMENT',
        title: 'What makes the pilot decision useful?',
        list: [
          'Use the same source pack and agreed start/stop points.',
          'Separate preparation, broker review, customer chase, rework, and filing time.',
          'Record exceptions and unsupported cases, not only successful runs.',
          'Treat any capacity scenario as illustrative until measured on the buyer’s desk.',
        ],
      },
    ],
  },
  {
    path: '/how-it-works/',
    ref: 'FORM 06 · OPERATING FLOW',
    title: 'How Declarix prepares customs declaration drafts',
    description:
      'A five-step view of how customer paperwork becomes a source-linked draft pack for broker review before filing in the existing customs system.',
    eyebrow: 'HOW IT WORKS · PAPERWORK TO BROKER REVIEW',
    h1: 'The broker keeps the filing decision.',
    standfirst:
      'Declarix sits between customer evidence and the broker’s existing customs system. It structures evidence, exposes missing facts, and prepares a draft for human review.',
    stamp: 'BROKER\nREVIEW',
    limitations:
      'Declarix does not submit to HMRC. Current H1 scope is review-only and legal coverage is incomplete. Unsupported cases stay visible.',
    sections: [
      {
        label: '01 · INTAKE',
        title: 'Agree the pack and channel.',
        paragraphs: [
          'The pilot starts by defining the source documents, supported case shape, approved transfer channel, and data schedule. Do not send live documents through the public website.',
        ],
      },
      {
        label: '02 · STRUCTURE',
        title: 'Extract values with source references.',
        paragraphs: [
          'Declarix maps proposed values into a structured draft while keeping the document, page, line, and other evidence references available for checking.',
        ],
      },
      {
        label: '03 · EXCEPTIONS',
        title: 'Surface what cannot be safely inferred.',
        paragraphs: [
          'Missing, conflicting, unsupported, stale, or ambiguous facts are surfaced for the right owner. The product boundary does not permit an unknown to become a completed fact.',
        ],
      },
      {
        label: '04 · REVIEW',
        title: 'The broker checks and decides.',
        paragraphs: [
          'The broker reviews the source-linked draft, resolves questions, and retains the judgment over classification, origin, valuation, procedure, licences, and release.',
        ],
      },
      {
        label: '05 · FILING',
        title: 'The existing customs system remains in charge.',
        paragraphs: [
          'After broker review, the broker uses its own Customs Management System and permissions to file. Any system-specific handoff is described as tested only when the corresponding evidence exists.',
        ],
      },
      {
        label: '06 · MEASURE',
        title: 'Compare the same job side by side.',
        paragraphs: [
          'A useful pilot records preparation time, broker-review time, exceptions, rework, unsupported cases, and handoff outcome for the same source pack. The result informs the buying decision without pretending to be a universal benchmark.',
        ],
      },
    ],
  },
  {
    path: '/pilot/',
    ref: 'DOCKET 07 · PILOT',
    title: 'Declarix customs-document preparation pilot',
    description:
      'Scope a side-by-side Declarix pilot using a synthetic or properly anonymised customs-document pack, written data terms, and explicit success measures.',
    eyebrow: 'PILOT · ONE PACK, SIDE BY SIDE',
    h1: 'Measure it on your workflow.',
    standfirst:
      'A pilot should answer whether Declarix reduces preparation work while preserving broker review, your existing customs system, and a defensible evidence trail.',
    stamp: 'MEASURED\nNOT PROMISED',
    limitations:
      'Pilot pricing, caps, service levels, data handling, and exit terms are confirmed in a written proposal. No public headline overrides those terms.',
    sections: [
      {
        label: '01 · PREPARE',
        title: 'Choose a representative pack.',
        list: [
          'Use a synthetic pack or properly anonymise a real pack.',
          'Include the document mess that creates real work, not a perfect demo bundle.',
          'State the current customs system, declaration type, weekly volume, and peak pattern.',
          'Do not transfer documents until the approved channel and data schedule are agreed.',
        ],
      },
      {
        label: '02 · BASELINE',
        title: 'Define start, stop, and exceptions.',
        paragraphs: [
          'Agree what counts as preparation, customer chase, broker review, correction, and filing. Record the manual baseline on the same pack rather than relying on memory or an industry average.',
        ],
      },
      {
        label: '03 · RUN',
        title: 'Review the draft beside the source.',
        paragraphs: [
          'Declarix prepares a source-linked draft pack and unresolved questions. The broker reviews the proposed fields and retains every judgment and filing decision.',
        ],
      },
      {
        label: '04 · DECIDE',
        title: 'Keep the evidence, including the misses.',
        facts: [
          ['Preparation time', 'Measured on the agreed pack'],
          ['Review time', 'Recorded separately'],
          ['Exceptions and unsupported cases', 'Counted, not hidden'],
          ['Corrections and rework', 'Assigned to their cause'],
          ['System handoff', 'Observed for the agreed target'],
          ['Commercial next step', 'Written only after the evidence review'],
        ],
      },
    ],
  },
  {
    path: '/about/',
    ref: 'REGISTER 08 · COMPANY',
    title: 'About Declarix | UK customs-document preparation',
    description:
      'Declarix Limited builds source-linked customs-document preparation software for broker and freight-forwarder teams that keep their existing filing system.',
    eyebrow: 'ABOUT · THE COMPANY AND THE BOUNDARY',
    h1: 'Built for the work before filing.',
    standfirst:
      'Declarix is a UK company building a preparation and evidence layer for customs brokers and freight forwarders. The broker’s own system remains the filing layer.',
    stamp: 'UK BUILT\nBROKER LED',
    limitations:
      'Declarix is early-stage. The current H1 profile is review-only, pricing is scoped in writing, and the public site does not claim customer outcomes that have not been independently measured.',
    sections: [
      {
        label: '01 · COMPANY',
        title: 'Declarix Limited.',
        facts: [
          ['Legal name', 'Declarix Limited'],
          ['Company number', '17288258'],
          ['Location', 'Leicester, England'],
          ['Founded', 'Incorporated 19 June 2026'],
          ['Contact', 'pack@getdeclarix.com'],
        ],
      },
      {
        label: '02 · PRODUCT THESIS',
        title: 'Preserve the broker’s system and judgment.',
        paragraphs: [
          'Customer paperwork creates a preparation problem before it becomes a filing problem. Declarix focuses on structuring that evidence, attaching sources, and closing exceptions without pretending to own the broker’s legal judgment.',
          'The product is designed to sit in front of existing Customs Management Systems rather than ask a broker to abandon them.',
        ],
      },
      {
        label: '03 · OPERATING PRINCIPLE',
        title: 'Unknown stays visible.',
        paragraphs: [
          'Deterministic rules decide applicability, requiredness, freshness, coverage, and release state. AI may extract, reconcile, explain, and draft; it must not invent legal facts or silently turn an unknown into green.',
        ],
      },
      {
        label: '04 · EVIDENCE',
        title: 'Public claims have a version.',
        paragraphs: [
          'The marketing site is pinned to public-claims manifest 1.0.0 from the product repository. Readiness, pricing, security, privacy, CMS, and outcome language remains gated by the named evidence owner.',
        ],
      },
    ],
  },
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
  {
    path: '/customs-declaration-software/',
    ref: 'GUIDE 10 · CATEGORY',
    title: 'Customs declaration preparation software | Declarix',
    description:
      'How source-linked customs declaration preparation software supports broker review before the existing Customs Management System files to HMRC.',
    eyebrow: 'CUSTOMS DECLARATION SOFTWARE · THE PREPARATION LAYER',
    h1: 'Less rekeying before the customs system.',
    standfirst:
      'Customs declaration work starts before a filing screen: documents arrive, values conflict, evidence is missing, and someone must resolve it. Declarix focuses on that preparation layer.',
    stamp: 'PREPARE\nTHEN REVIEW',
    limitations:
      'Declarix is not a direct-filing service. System-specific handoffs are described as tested only when vendor documentation, fixtures, error mapping, and pilot evidence exist.',
    sections: [
      {
        label: '01 · THE JOB',
        title: 'Preparation is a distinct customs-software problem.',
        paragraphs: [
          'A Customs Management System records and files a declaration. Before that, broker teams still reconcile invoices, packing lists, transport evidence, emails, codes, weights, values, parties, and missing information.',
          'Declarix prepares a source-linked draft pack for broker review in front of the broker’s existing customs system.',
        ],
      },
      {
        label: '02 · THE BOUNDARY',
        title: 'What stays with the broker.',
        list: [
          'Review and approval of every material proposed value.',
          'Classification, origin, valuation, procedure, licence, and other expert judgments.',
          'Use of the broker’s own badge, authorisations, duty accounts, and filing permissions.',
          'Submission through the existing customs system and response to HMRC outcomes.',
        ],
      },
      {
        label: '03 · THE DRAFT',
        title: 'What a useful preparation layer should expose.',
        list: [
          'A structured draft connected to the source document, page, line, or evidence.',
          'Missing and conflicting facts presented as questions rather than guesses.',
          'A versioned supported scope and visible unsupported cases.',
          'A clear handoff boundary for the target customs system.',
          'An audit trail of what the broker reviewed and changed.',
        ],
      },
      {
        label: '04 · BUYING CHECKLIST',
        title: 'Test the ugly pack, not the clean demo.',
        list: [
          'Use representative scans, amalgamated invoices, long line tables, and email conflicts.',
          'Measure preparation, review, chase, rework, and handoff separately.',
          'Ask which claims are measured outcomes and which are scenarios.',
          'Confirm data handling, retention, vendors, locations, and deletion in writing.',
          'Require explicit evidence for any named customs-system compatibility claim.',
        ],
      },
    ],
  },
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
        title: 'The site is pinned to manifest 1.0.0.',
        paragraphs: [
          'The publishing build checks public source files against a pinned product-claims contract. Current scope, prohibited wording, pending commercial and security facts, and evidence ownership are versioned in the main Declarix repository.',
        ],
      },
    ],
  },
]

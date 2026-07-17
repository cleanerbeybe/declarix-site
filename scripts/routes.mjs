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
      'No public page can replace a customer security review or data-processing agreement. Deployment-specific answers are provided before customer documents are transferred.',
    sections: [
      {
        label: '01 · PRODUCT BOUNDARY',
        title: 'Documents in. CDS-ready pack back.',
        paragraphs: [
          'Declarix reads customer documents and returns a CDS-ready entry pack with source evidence for the clerk to check. Declarix does not submit to HMRC; the broker remains responsible for approval and filing.',
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
    ref: 'SCHEDULE 03 · PRODUCT FIT',
    title: 'Supported customs workflows and integrations | Declarix',
    description:
      'Where Declarix fits in a customs operation, including document intake, CDS-ready exports, Sequoia, Descartes, customer integrations, and clerk review.',
    eyebrow: 'SUPPORTED SCOPE · DOCUMENTS TO CDS-READY EXPORT',
    h1: 'Know exactly where Declarix fits.',
    standfirst:
      'Declarix turns the documents your customers send into a source-linked, CDS-ready entry pack. Your clerk checks it, your existing system files it, and your desk keeps the judgment.',
    stamp: 'CDS\nREADY',
    limitations:
      'Declarix prepares the entry data and evidence. Your authorised team retains classification, customs judgment, approval and HMRC submission.',
    sections: [
      {
        label: '01 · DOCUMENT INTAKE',
        title: 'The whole job goes in.',
        paragraphs: [
          'Declarix reads invoices, packing lists, transport documents, spreadsheets, scans, phone photos and forwarded email chains. It works across the job instead of asking the clerk to re-enter one document at a time.',
          'Conflicting or missing facts stay visible as questions. Proposed values keep the source document, page and line attached so the clerk can check the evidence quickly.',
        ],
      },
      {
        label: '02 · OUTPUT',
        title: 'CDS-ready data for the system you keep.',
        facts: [
          ['Sequoia', 'Supported export and customer workflow integration'],
          ['Descartes e-Customs', 'Supported export and customer workflow integration'],
          ['Other customer systems', 'Mapped through the integration route agreed on the call'],
          ['Evidence', 'Source reference retained beside each proposed field'],
          ['Approval', 'Your clerk checks and approves'],
          ['Submission', 'Your existing customs system and permissions'],
        ],
      },
      {
        label: '03 · BEST FIRST WORKFLOW',
        title: 'Start where the manual work is heaviest.',
        list: [
          'High-volume repeat import work with consistent review rules.',
          'Document-heavy jobs with long line tables or amalgamated invoices.',
          'Workflows where senior clerks spend too much time on basic assembly.',
          'Desks turning away declarations because recruiting another experienced clerk is slow or expensive.',
          'Teams that need the source evidence beside each field before approval.',
        ],
      },
      {
        label: '04 · FIT CHECK',
        title: 'The 20-minute call locates the value.',
        list: [
          'Estimate annual ROI from your volume, current minutes and loaded clerk cost.',
          'Map the Sequoia, Descartes or customer-integration route.',
          'Choose the first declaration workflow most likely to pay for itself.',
          'Decide whether one real-job pilot is worth running.',
        ],
      },
    ],
  },
  {
    path: '/pricing/',
    ref: 'SCHEDULE 04 · COMMERCIAL',
    title: 'Declarix pricing and ROI for customs desks',
    description:
      'See the Declarix per-entry pricing model, worked labour economics, pilot terms, and the numbers to bring to a 20-minute ROI call.',
    eyebrow: 'PRICING · PER ENTRY, NOT PER SEAT',
    h1: 'More margin per declaration — or no deal worth doing.',
    standfirst:
      'Declarix is priced per entry against the labour and capacity it gives back. The 20-minute numbers call replaces the worked assumptions with your desk’s real volume, time and cost.',
    stamp: 'PER\nENTRY',
    limitations:
      'The £7.95 to £2.45 labour model is an example, not a quote. Your job mix, review time and loaded clerk cost determine the real result and per-entry rate.',
    sections: [
      {
        label: '01 · INPUTS',
        title: 'Four numbers build the commercial case.',
        list: [
          'Declarations processed in a representative week.',
          'Minutes of clerk time used per declaration today.',
          'Loaded hourly cost of the people doing that work.',
          'The Sequoia, Descartes or customer workflow the output needs to reach.',
          'The document mix and exceptions that make the job harder than average.',
        ],
      },
      {
        label: '02 · WORKED MODEL',
        title: 'What the homepage example shows.',
        list: [
          'Loaded clerk labour falls from £7.95 to £2.45 per declaration.',
          'That creates an illustrative £5.50 labour saving before the Declarix rate.',
          'At 120 declarations a week, the model shows £34,320 a year in recovered labour.',
          'The same reduction in clerk time creates room for up to three times more declarations.',
          'The real test is whether your total cost falls after the Declarix per-entry rate is included.',
        ],
      },
      {
        label: '03 · COMPARISON',
        title: 'Replace the example with your desk.',
        paragraphs: [
          'On the call, Declarix rebuilds the model using your weekly volume, current preparation time and loaded clerk cost. The result is an annual ROI range and a break-even per-entry price, not a generic savings promise.',
          'You also map the integration route and identify the workflow where recovered clerk time is most valuable. If the economics do not work, there is no reason to force a pilot.',
        ],
      },
      {
        label: '04 · NEXT STEP',
        title: 'Leave with the questions answered.',
        paragraphs: [
          'Book the 20-minute numbers call. Bring what you know; estimates are enough to start. You leave with the ROI range, integration route and recommended first declaration workflow.',
        ],
      },
    ],
  },
  {
    path: '/pricing-policy/',
    ref: 'BUYER SHEET 05 · PRICING RULES',
    title: 'How Declarix pricing works: entries, rework and pilot',
    description:
      'See how Declarix pricing counts entries, handles rework and pilot costs, and compares total cost with the clerk time and capacity returned to your customs desk.',
    eyebrow: 'PRICING EXPLAINED · WHAT COUNTS AND WHAT TO ASK',
    h1: 'Know what you pay for before the pilot starts.',
    standfirst:
      'Define the unit, separate genuine rework from changed jobs, then test the total cost against the clerk time and declaration capacity returned to your desk.',
    stamp: 'CLEAR\nCOUNT',
    limitations:
      'The final per-entry rate, inclusions and correction rules are stated in the quote. The homepage model is a transparent example used to start the ROI conversation.',
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
          'Replace the homepage example with your weekly volume, current time, and loaded clerk cost.',
        ],
      },
    ],
  },
  {
    path: '/how-it-works/',
    ref: 'FORM 06 · OPERATING FLOW',
    title: 'How Declarix builds CDS-ready customs entry packs',
    description:
      'See how Declarix reads customs documents, links every field to its source, and returns CDS-ready output for Sequoia, Descartes or customer integrations.',
    eyebrow: 'HOW IT WORKS · PAPERWORK TO CDS-READY OUTPUT',
    h1: 'Your clerk checks the entry instead of building it.',
    standfirst:
      'Send the whole job. Declarix reads the documents, assembles the entry data, links every proposed field to its evidence and returns it to the customs workflow your team already uses.',
    stamp: 'CHECK\nNOT KEY',
    limitations:
      'Your authorised clerk retains customs judgment and approval. Declarix prepares CDS-ready output; your existing system and permissions handle submission.',
    sections: [
      {
        label: '01 · INTAKE',
        title: 'Forward the job as it arrived.',
        paragraphs: [
          'Invoices, packing lists, transport documents, spreadsheets, scans, phone photos and the email chain arrive together. Declarix reads across the job instead of forcing the clerk to open and re-enter each file.',
        ],
      },
      {
        label: '02 · STRUCTURE',
        title: 'Build the entry and pin the evidence.',
        paragraphs: [
          'Exporter, importer, values, weights, packages, previous documents, origin and line data move into their entry rows. Each proposed value keeps its document, page and line reference for checking.',
        ],
      },
      {
        label: '03 · EXCEPTIONS',
        title: 'Flag the conflicts instead of hiding them.',
        paragraphs: [
          'If an invoice says CIF and the email says CIP, the conflict is shown beside the sources. Missing or ambiguous facts become a short review question rather than a silent guess.',
        ],
      },
      {
        label: '04 · REVIEW',
        title: 'The clerk checks the working.',
        paragraphs: [
          'The clerk opens any field, sees its source and makes the customs judgment. Typical Declarix processing is around 200 seconds before this review begins.',
        ],
      },
      {
        label: '05 · FILING',
        title: 'The CDS-ready export reaches your system.',
        paragraphs: [
          'Declarix supports Sequoia, Descartes e-Customs and customer integrations. Your team keeps the filing screen, badge, permissions and submission process it already knows.',
        ],
      },
      {
        label: '06 · COMMERCIAL FIT',
        title: 'Run the desk economics.',
        paragraphs: [
          'The 20-minute numbers call uses your weekly volume, current minutes and loaded clerk cost to estimate annual ROI. It also maps the integration route and chooses the best first declaration workflow.',
        ],
      },
    ],
  },
  {
    path: '/pilot/',
    ref: 'DOCKET 07 · PILOT',
    title: 'Declarix customs-document preparation pilot',
    description:
      'After the 20-minute numbers call, prove Declarix on one anonymised customs job. The pilot is free if it fails and capped at £500 if it works.',
    eyebrow: 'PILOT · THE STEP AFTER THE NUMBERS WORK',
    h1: 'Prove it on one ugly job.',
    standfirst:
      'First run the ROI and map the integration. If the commercial case makes sense, send one anonymised job and let your clerk compare the CDS-ready pack with the manual run.',
    stamp: '£0 FAIL\n£500 CAP',
    limitations:
      'If the agreed job fails, you pay nothing. If it works, the initial pilot continues with a total cap of £500 before any wider rollout decision.',
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
        title: 'Get the CDS-ready pack back.',
        paragraphs: [
          'Declarix returns the pack within one working day. Every proposed field keeps its source and every conflict stays visible for your clerk to resolve before approval.',
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
  {
    path: '/about/',
    ref: 'REGISTER 08 · COMPANY',
    title: 'About Declarix | More declarations, same customs desk',
    description:
      'Declarix Limited builds customs automation for broker and freight-forwarder teams that need more declarations per clerk without replacing their filing system.',
    eyebrow: 'ABOUT · BUILT FOR THE CUSTOMS DESK',
    h1: 'More declarations. Same experienced team.',
    standfirst:
      'Declarix is a UK company turning customs paperwork into CDS-ready entry packs for Sequoia, Descartes and customer integrations. Clerks keep the judgment; the manual build goes away.',
    stamp: 'UK BUILT\nDESK FIRST',
    limitations:
      'The up-to-3× outcome depends on document mix and review time. The 20-minute numbers call replaces worked assumptions with the buyer’s real desk economics.',
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
        title: 'Preserve the system and the judgment. Remove the keying.',
        paragraphs: [
          'Experienced customs clerks should spend their time checking the job and making customs decisions, not copying values from invoices, packing lists, emails and spreadsheets into entry fields.',
          'Declarix reads the whole job, builds the CDS-ready data and pins every proposed value to its source. The product works with the Customs Management System the broker already runs.',
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
        title: 'The commercial claim is testable.',
        paragraphs: [
          'The offer is simple: up to three times more declarations per clerk, no new headcount and more margin on each declaration. The 20-minute numbers call estimates the buyer’s ROI; one real-job pilot tests the workflow before a wider commitment.',
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
    title: 'Customs declaration automation for Sequoia and Descartes',
    description:
      'How Declarix turns customer paperwork into CDS-ready customs entry packs for Sequoia, Descartes and customer integrations, with source evidence attached.',
    eyebrow: 'CUSTOMS DECLARATION SOFTWARE · CHECK, DO NOT REBUILD',
    h1: 'Build up to 3× more declarations with the same clerk.',
    standfirst:
      'Declarix reads the emails, invoices, packing lists, scans and spreadsheets, then builds the CDS-ready entry pack. Your clerk checks the evidence in minutes instead of building the job field by field.',
    stamp: 'CDS\nREADY',
    limitations:
      'Your clerk retains customs judgment and approval. Your existing customs system and permissions handle HMRC submission.',
    sections: [
      {
        label: '01 · THE JOB',
        title: 'The expensive work happens before the filing screen.',
        paragraphs: [
          'A Customs Management System records and files a declaration. Before that, the clerk still opens the invoices, packing lists, transport evidence, emails and spreadsheets, then builds the entry one field at a time.',
          'Declarix does that assembly across the whole job and returns a CDS-ready pack with the evidence beside every proposed field.',
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
        label: '03 · THE OUTPUT',
        title: 'What reaches the clerk.',
        list: [
          'CDS-ready entry data connected to the source document, page, line, or evidence.',
          'Missing and conflicting facts presented as questions rather than guesses.',
          'Visible questions wherever the documents conflict or a fact is missing.',
          'Sequoia, Descartes e-Customs or a mapped customer-integration handoff.',
          'An audit trail of what the broker reviewed and changed.',
        ],
      },
      {
        label: '04 · BUYING CHECKLIST',
        title: 'Test the ugly pack, not the clean demo.',
        list: [
          'Use representative scans, amalgamated invoices, long line tables, and email conflicts.',
          'Measure preparation, review, chase, rework, and handoff separately.',
          'Run the supplier’s numbers against your weekly volume, clerk time and loaded cost.',
          'Confirm data handling, retention, vendors, locations, and deletion in writing.',
          'Confirm the exact Sequoia, Descartes or customer-integration route.',
        ],
      },
    ],
  },
  {
    path: '/customs-clearance-software/',
    ref: 'BUYER FILE 12 · CLEARANCE SOFTWARE',
    title: 'Customs clearance automation for broker workflows | Declarix',
    description:
      'How customs brokers can automate document-heavy declaration work, keep Sequoia or Descartes, and increase declarations per clerk with CDS-ready entry packs.',
    eyebrow: 'CUSTOMS CLEARANCE SOFTWARE · AUTOMATE THE MANUAL BUILD',
    h1: 'Keep the filing system. Remove the bottleneck before it.',
    standfirst:
      'Declarix turns the documents your customers send into CDS-ready output for Sequoia, Descartes and customer integrations. Your clerk checks the job instead of building every field.',
    stamp: 'MORE JOBS\nSAME DESK',
    limitations:
      'Declarix supports the work before submission. Your authorised team retains customs judgment, approval, filing permissions and the HMRC submission process.',
    sections: [
      {
        label: '01 · DIRECT ANSWER',
        title: 'What does customs clearance software need to cover?',
        paragraphs: [
          'Customs clearance software is an umbrella term. One product may transmit declarations to the Customs Declaration Service, manage authorisations, receive responses, and retain the filing record. Another may organise the work before submission: reading customer documents, structuring proposed values, exposing gaps, and preparing evidence for a broker to review. A buyer should identify which layer is creating the operational bottleneck before comparing vendors.',
          'Declarix automates the document-heavy build before submission. It keeps the broker’s existing customs system and permissions in place, returns CDS-ready output and makes conflicts visible for the clerk who approves the job.',
        ],
      },
      {
        label: '02 · THE TWO LAYERS',
        title: 'Filing and preparation are different jobs.',
        facts: [
          ['Filing layer', 'Creates, submits, amends, or cancels declarations through supported CDS services'],
          ['Document automation', 'Builds CDS-ready entry data and keeps source evidence attached'],
          ['Broker responsibility', 'Review, legal judgment, approval, and filing remain with the authorised firm'],
          ['Declarix role', 'CDS-ready entry pack with source evidence; no HMRC submission'],
        ],
        paragraphs: [
          'HMRC publishes a list of software developers supplying declaration software, while its developer guidance describes APIs and assurance for software that communicates with CDS. That is a distinct technical and regulatory role from preparing source material in front of the filing system.',
        ],
      },
      {
        label: '03 · EVIDENCE',
        title: 'The entry pack should show its working.',
        list: [
          'Keep the source document, page, line, or evidence reference beside each proposed value.',
          'Present missing, conflicting, stale, unsupported, or unevaluated facts as review work—not completed data.',
          'Separate document preparation, customer chase, broker review, correction, and filing time.',
          'Retain the broker’s change and approval path for the agreed workflow.',
          'Map the Sequoia, Descartes or customer-integration handoff before live volume.',
        ],
      },
      {
        label: '04 · COMPATIBILITY',
        title: 'Ask what “integrates” means.',
        paragraphs: [
          'Declarix supports CDS-ready exports for Sequoia, Descartes e-Customs and customer integrations. The 20-minute call maps which route fits the buyer’s current workflow, including how the clerk receives, checks and hands off the entry data.',
          'The pilot then runs the agreed route on one real-shaped job so the desk can see the fields, evidence, conflicts and handoff together before committing to wider volume.',
        ],
      },
      {
        label: '05 · BUYING FILE',
        title: 'Compare the same ugly pack.',
        list: [
          'Use one properly anonymised job with scans, spreadsheets, long line tables, and real conflicts.',
          'Record the current manual baseline with agreed start and stop points.',
          'Count unsupported cases, questions, retries, and corrections—not only successful rows.',
          'Review security, data location, access, retention, deletion, and support for the proposed deployment.',
          'Keep commercial units, minimums, corrections, service expectations, and exit terms in the written quote.',
        ],
      },
      {
        label: '06 · DECLARIX FIT',
        title: 'Use the call to locate the bottleneck.',
        paragraphs: [
          'Bring one week’s approximate volume, current minutes per declaration, loaded clerk cost and the customs system the team runs. The numbers call estimates ROI, maps the integration route and chooses the first workflow most likely to pay for itself.',
        ],
      },
    ],
    sources: [
      {
        title: 'Software developers providing customs declaration software',
        publisher: 'HM Revenue & Customs',
        url: 'https://www.gov.uk/guidance/list-of-software-developers-providing-customs-declaration-support',
        checked: '2026-07-16',
      },
      {
        title: 'Customs Declarations end-to-end service guide',
        publisher: 'HMRC Developer Hub',
        url: 'https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/',
        checked: '2026-07-16',
      },
      {
        title: 'Declarix supported scope and current limitations',
        publisher: 'Declarix Limited',
        url: 'https://getdeclarix.com/supported-scope/',
        checked: '2026-07-16',
      },
    ],
  },
  {
    path: '/customs-intermediary-registration-2026/',
    ref: 'RESPONSE KIT 13 · OPEN CONSULTATION',
    title: 'Customs intermediary registration 2026 response kit',
    description:
      'Download a free customs intermediary registration response kit for the 2026 HMRC consultation: a 13-question draft, evidence matrix, source register, and deadline plan.',
    eyebrow: 'FREE RESPONSE KIT · CUSTOMS INTERMEDIARY REGISTRATION 2026',
    h1: 'Build the response before the deadline.',
    standfirst:
      'Download a question-by-question draft and evidence matrix, map the operating examples that matter, and give your reviewer a clean working file before 21 September 2026.',
    stamp: 'KIT\nREADY',
    heroStrip: ['13 QUESTIONS MAPPED', '2 EDITABLE FILES', 'DEADLINE 21 SEP 2026'],
    boundary:
      'This resource organises a response to an open HMRC consultation. It does not predict the final policy or replace the current consultation page and submission instructions.',
    schemaType: 'Article',
    publishedOn: '2026-07-16',
    expiresOn: '2026-09-21',
    sections: [
      {
        label: '01 · DIRECT ANSWER',
        title: 'What is HMRC proposing—and what can you do now?',
        paragraphs: [
          'HMRC opened a 13-week consultation on proposed mandatory registration for customs intermediaries that interact with HMRC on behalf of traders. It was published on 23 June 2026 and closes on 21 September 2026. The consultation asks about scope, exclusions, minimum requirements, checks, enforcement, and proportionate implementation. HMRC says respondents may answer only the questions relevant to them.',
          'The practical job now is to turn operational experience into evidence: which entities and activities are affected, what the proposed checks would change, where a rule could duplicate an existing control, and what a proportionate alternative could look like. The free files below give that work a structure before drafting begins.',
        ],
      },
      {
        label: '02 · PROPOSED SCOPE',
        title: 'Which operating models are in the consultation?',
        facts: [
          ['Consultation status', 'Open proposal; not a current registration duty'],
          ['Published', '23 June 2026'],
          ['Response deadline', 'Monday 21 September 2026'],
          ['Proposed coverage', 'UK-wide; imports and exports; customs activity across declaration types'],
          ['Proposed focus', 'Intermediaries interacting with HMRC for traders'],
          ['Proposed exclusions', 'Advice-only work, specified carrier activity, and trader self-representation'],
        ],
      },
      {
        label: '03 · EVIDENCE WORKPAPER',
        title: 'Map the firm once. Reuse the evidence across the response.',
        list: [
          'List every legal entity, brand, branch, and subcontracted operating model involved in intermediary work.',
          'Separate declaration submission, amendment, advice-only, carrier, warehousing, and self-representation activities.',
          'Record the HMRC services, EORIs, badges, authorisations, systems, and permissions used by each role.',
          'Name who owns professional standards, staff competence, supervision, complaints, errors, and corrective action.',
          'Estimate implementation work for evidence collection, registration, periodic checks, changes, and appeals.',
          'Identify where a proportionate rule needs distinctions by size, service, risk, or operating model.',
        ],
      },
      {
        label: '04 · RESPONSE FILE',
        title: 'Give every material view an operating example.',
        paragraphs: [
          'For each consultation point, record the proposal, the affected workflow, a concrete example, the likely benefit or burden, supporting evidence, and a practical alternative. Separate facts about the current operation from forecasts about a future scheme. If a requirement would duplicate an existing control, name the control and explain how HMRC could rely on or align with it.',
          'HMRC invites partial responses. A focused response on the parts your firm understands well can be more useful than an answer that guesses across every question. Responses and enquiries go to the address published in the consultation; check the official page before sending because the source controls the process.',
        ],
      },
      {
        label: '05 · STANDARD',
        title: 'Registration and the industry Standard are related, not identical.',
        paragraphs: [
          'HMRC published the Standard for Customs Intermediaries in June 2026. It describes expectations for professional conduct, capability, and service delivery. The mandatory-registration consultation proposes a legal registration framework and minimum requirements. Firms should track both workstreams without presenting voluntary good-practice material as if it were already a statutory registration test.',
        ],
      },
      {
        label: '06 · EXPIRY RULE',
        title: 'This page changes when the source changes.',
        paragraphs: [
          'Declarix will review this resource when HMRC updates the consultation, closes responses, publishes a response summary, or announces legislation and implementation. After 21 September 2026, the page must not continue to describe the consultation as open. It will be updated into an outcome tracker or redirected to a current resource after the official next step is known.',
        ],
      },
    ],
    resourceKit: {
      label: 'DOWNLOAD THE FREE WORKING FILES',
      title: 'Start with the evidence, not a blank page.',
      intro:
        'The Markdown draft maps all 13 consultation questions. The CSV matrix gives each answer an owner, evidence trail, impact, and practical alternative. Both are editable, ungated, and ready to use in your normal working environment.',
      assets: [
        {
          id: 'response_draft_markdown',
          format: 'MARKDOWN',
          title: '13-question response draft',
          description: 'A clean drafting file with organisation context, all consultation questions, evidence prompts, and a final submission check.',
          href: '/downloads/customs-intermediary-registration-response-draft-2026.md',
          meta: 'EDITABLE · 13 QUESTIONS · 7 KB',
        },
        {
          id: 'evidence_matrix_csv',
          format: 'CSV',
          title: 'Question-by-question evidence matrix',
          description: 'A spreadsheet-ready matrix for owners, examples, quantified impact, supporting evidence, alternatives, review status, and next action.',
          href: '/downloads/customs-intermediary-registration-evidence-matrix-2026.csv',
          meta: 'SPREADSHEET READY · 13 ROWS · 2 KB',
        },
      ],
      steps: [
        ['01', 'Map the operating model', 'List the entities, intermediary roles, services, systems, permissions, and movement mix behind the response.'],
        ['02', 'Add evidence to the material questions', 'Use real workflows, implementation estimates, volumes, errors, controls, and practical alternatives where they strengthen the answer.'],
        ['03', 'Review and submit from the official page', 'Confirm the current deadline and submission instructions, then send only the questions your organisation is equipped to answer.'],
      ],
    },
    cta: {
      title: 'Turn the evidence work into a better customs desk.',
      copy:
        'If mapping the response exposes repeated document chasing, manual re-keying, or senior-clerk bottlenecks, bring the workflow and your weekly volume to the 20-minute numbers call.',
      label: 'BOOK THE 20-MINUTE WORKFLOW CALL',
    },
    sources: [
      {
        title: 'Introduction of Mandatory Registration for Customs Intermediaries',
        publisher: 'HM Revenue & Customs',
        url: 'https://www.gov.uk/government/consultations/introduction-of-mandatory-registration-for-customs-intermediaries/customs-intermediaries-introduction-of-mandatory-registration',
        checked: '2026-07-17',
      },
      {
        title: 'Standard for Customs Intermediaries',
        publisher: 'HM Revenue & Customs',
        url: 'https://www.gov.uk/government/publications/standard-for-customs-intermediaries',
        checked: '2026-07-17',
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
        title: 'The site is pinned to manifest 2.0.0.',
        paragraphs: [
          'The publishing build checks public source files against a pinned product-claims contract. Current scope, prohibited wording, pending commercial and security facts, and evidence ownership are versioned in the main Declarix repository.',
        ],
      },
    ],
  },
]

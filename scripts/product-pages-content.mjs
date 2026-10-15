// Content for the integration workflow, feature and guide pages (lane L7, 15 Oct 2026).
// Product facts come from the live site (/how-it-works/, /supported-scope/, /security/, /pilot/) and the
// product feature list compiled from the Declarix code base (research/pain/FEATURES.md, 6 Oct 2026).
// Vendor facts come from each vendor's own public pages, linked in the page source register.

// Set to '/customs-workflows/' once the customs-workflows hub ships; it adds the middle breadcrumb level.
export const workflowsHubPath = '/customs-workflows/'

const CHECKED = '2026-10-15'
const PUBLISHED = '2026-10-15'
const DEMO = 'Declarix web app — worked example.'

const screens = {
  review: { src: '/product/review-evidence.jpg', width: 1400, height: 788 },
  issues: { src: '/product/issue-cards.jpg', width: 1400, height: 1094 },
  audit: { src: '/product/audit-timeline.jpg', width: 1400, height: 622 },
  pack: { src: '/product/pack-generated-crop.jpg', width: 1400, height: 756 },
  rfi: { src: '/product/rfi-draft.jpg', width: 1400, height: 925 },
  readiness: { src: '/product/readiness.jpg', width: 1400, height: 858 },
  compare: { src: '/product/compare-conflict.jpg', width: 1400, height: 860 },
  queue: { src: '/product/queue-table.jpg', width: 1400, height: 486 },
}

const gov = {
  completion: {
    title: 'CDS Declaration Completion Instructions for Imports',
    publisher: 'HM Revenue & Customs',
    url: 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide',
    checked: CHECKED,
  },
  fullImport: {
    title: 'Making a full import declaration',
    publisher: 'HM Revenue & Customs',
    url: 'https://www.gov.uk/guidance/making-a-full-import-declaration',
    checked: CHECKED,
  },
  volume3: {
    title: 'CDS Declaration and Customs Clearance Request Instructions (UK Trade Tariff: volume 3 for CDS)',
    publisher: 'HM Revenue & Customs',
    url: 'https://www.gov.uk/government/collections/uk-trade-tariff-volume-3-for-cds--2',
    checked: CHECKED,
  },
  softwareList: {
    title: 'Software developers providing customs declaration software',
    publisher: 'HM Revenue & Customs',
    url: 'https://www.gov.uk/guidance/list-of-software-developers-providing-customs-declaration-support',
    checked: CHECKED,
  },
  developerGuide: {
    title: 'Customs Declarations end-to-end service guide',
    publisher: 'HMRC Developer Hub',
    url: 'https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/',
    checked: CHECKED,
  },
  importGoods: {
    title: 'Import goods into the UK: step by step',
    publisher: 'GOV.UK',
    url: 'https://www.gov.uk/import-goods-into-uk',
    checked: CHECKED,
  },
  valuation: {
    title: 'Working out the customs value of your imported goods',
    publisher: 'HM Revenue & Customs',
    url: 'https://www.gov.uk/government/collections/working-out-the-customs-value-of-your-imported-goods',
    checked: CHECKED,
  },
  commodityCodes: {
    title: 'Finding commodity codes for imports into or exports out of the UK',
    publisher: 'HM Revenue & Customs',
    url: 'https://www.gov.uk/guidance/finding-commodity-codes-for-imports-or-exports',
    checked: CHECKED,
  },
  licences: {
    title: 'Import controls',
    publisher: 'Department for Business and Trade',
    url: 'https://www.gov.uk/guidance/import-controls',
    checked: CHECKED,
  },
  representation: {
    title: 'Get someone to deal with customs for you',
    publisher: 'HM Revenue & Customs',
    url: 'https://www.gov.uk/guidance/appoint-someone-to-deal-with-customs-on-your-behalf',
    checked: CHECKED,
  },
}

const scopeSource = {
  title: 'Declarix supported scope',
  publisher: 'Declarix Limited',
  url: 'https://getdeclarix.com/supported-scope/',
  checked: CHECKED,
}

const pilotSentence = '£0 upfront. £1 per declaration, capped at £500. The pilot fee is fully waived if the agreed success criteria are missed.'

const numbersCta = {
  title: 'Run the numbers on your own desk.',
  copy: 'Bring weekly volume, current minutes per declaration, loaded clerk cost and the system your team files through. Leave the 20-minute numbers call with an ROI estimate, the integration route and the first workflow to pilot.',
  label: 'BOOK THE 20-MINUTE NUMBERS CALL',
}

// Shared mapping table for the three integration pages: where each common H1 import fact comes from.
const fieldMapRows = [
  ['DE 3/1 Exporter · DE 3/15 Importer · DE 3/16 Importer identification number', 'Commercial invoice, bill of lading or air waybill', 'Party names and addresses compared across documents; GB and XI EORI formats checked'],
  ['DE 4/1 Delivery terms', 'Commercial invoice and the email chain', 'Incoterm checked against the freight and insurance shown on the invoice'],
  ['DE 4/10 Currency · DE 4/11 Total amount invoiced', 'Commercial invoice', 'Invoice total must equal the sum of the lines; ISO 4217 currency code checked'],
  ['DE 4/9 Additions and deductions', 'Invoice, freight bill, delivery terms', 'Freight or insurance counted twice is flagged; collect freight with no figure becomes a question'],
  ['DE 6/1 Net mass · DE 6/5 Gross mass', 'Packing list (the authority for weight)', 'Gross not below net; totals equal the sum of the lines; per-line match with the invoice and transport document'],
  ['DE 6/18 Total packages', 'Packing list and bill of lading', 'Carton counts compared; a mismatch is flagged with both sources'],
  ['DE 6/8 Description · DE 6/14 Commodity code', 'Commercial invoice (the authority for description)', 'Code present and well formed on every line, then checked against the description with GIR reasoning'],
  ['DE 5/15 Country of origin', 'Invoice, packing list, certificate of origin', 'Origin present on every line; a preference claim triggers the origin-proof check'],
  ['DE 7/4 Mode of transport at the border', 'Bill of lading, air waybill or CMR', 'Declared mode checked against the transport ID and ports'],
  ['DE 2/1 Previous documents', 'Transport document references', 'Previous document category and type checked against CDS code lists'],
]

function integrationPage({ system, stamp, slug, ref, title, description, h1, standfirst, answer, systemFacts, routeParagraphs, faqs, sources, crumb }) {
  return {
    family: 'integration',
    path: `/customs-workflows/${slug}/`,
    crumb,
    ref,
    title,
    description,
    eyebrow: `CUSTOMS WORKFLOW · ${system.toUpperCase()}`,
    h1,
    standfirst,
    stamp,
    schemaType: 'WebPage',
    publishedOn: PUBLISHED,
    reviewedOn: CHECKED,
    strip: ['UP TO 3× MORE DECLARATIONS PER CLERK', 'AROUND 200 SECONDS BEFORE REVIEW', `${system.toUpperCase()} STAYS YOUR FILING SYSTEM`],
    answer,
    blocks: [
      {
        label: '01 · WHAT STAYS',
        title: `${system} keeps the filing. Declarix removes the keying before it.`,
        paragraphs: systemFacts,
        list: [
          `Your badge, authorisations, deferment and filing permissions stay in ${system}.`,
          'Your clerk keeps classification, valuation and procedure judgment, and approves every job.',
          `Submission to HMRC stays in ${system}. Declarix does not submit to HMRC.`,
          'What changes is the work before the filing screen: reading the documents, building the entry and chasing the gaps.',
        ],
      },
      {
        label: '02 · SOURCE TO FIELD',
        title: 'Every proposed value arrives with its source.',
        paragraphs: [
          'Send the job as it arrived: the forwarded email, commercial invoice, packing list, bill of lading or air waybill, scans, phone photos and spreadsheets. Declarix classifies each document, extracts every field with its document, page and line, and builds one entry across the whole job.',
          'The table shows where the common H1 import facts come from and the checks Declarix runs before your clerk sees them. HMRC sets the data element rules in the [CDS Declaration Completion Instructions for Imports](https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide).',
        ],
        table: {
          caption: 'Common H1 import data elements, their usual source and the Declarix check',
          head: ['CDS data element', 'Usual source document', 'What Declarix checks before review'],
          rows: fieldMapRows,
        },
      },
      {
        label: '03 · THE HANDOFF',
        title: `How the entry reaches ${system}.`,
        paragraphs: routeParagraphs,
        figure: {
          ...screens.pack,
          alt: 'Declarix pack screen showing a generated pack with three checksummed source documents and download buttons for the CDS declaration XML and PCS manifests.',
          caption: `${DEMO} The pack holds the CDS declaration XML, the PCS attachment manifest and SHA-256 checksums for every file.`,
        },
      },
      {
        label: '04 · APPROVAL AND RETURNS',
        title: 'Who checks, who files, and where a query goes.',
        steps: [
          ['Declarix prepares', 'The job runs through 124 named checks. Conflicts and missing facts become flags with the evidence attached and a written next step.'],
          ['Your clerk reviews', 'The clerk opens any field, sees its source, accepts, edits or overrides it. Flagged decisions can go to a second approver when your policy requires it.'],
          ['Customer gaps go out as queries', 'Missing documents become a drafted customer query, split by who must act. The reply is matched back to the open query.'],
          [`${system} files`, `The approved entry moves into ${system} through the agreed route. Your team submits as it does today.`],
          ['Corrections come back to the case', `If ${system} or HMRC returns a problem, the clerk reopens the case. Declarix re-runs its checks on the changed data and records the decision.`],
        ],
      },
      {
        label: '05 · PROVE IT ON ONE JOB',
        title: 'The acceptance checklist for your first live route.',
        list: [
          `Name the ${system} version and the declaration type for the first workflow, starting with GB standard imports (H1).`,
          'Agree the handoff route and the fields it carries on the 20-minute numbers call.',
          'Send one properly anonymised, real-shaped job with the scans, long line tables and conflicts that cost your team time.',
          `Your clerk compares the Declarix pack with the manual build and records the time spent on each.`,
          `Run a trial import into ${system} and record what arrives, what your clerk changed and why.`,
          `Decide on the result. Pilot terms: ${pilotSentence}`,
        ],
      },
    ],
    faqs,
    related: [
      ['How Declarix builds the entry pack', '/how-it-works/', 'The five-step flow from intake to filing.'],
      ['Supported scope and integration routes', '/supported-scope/', 'Sequoia, Descartes e-Customs and customer integrations.'],
      ['Keep your filing system: a rollout guide', '/guides/automate-customs-without-changing-software/', 'Plan the first workflow without a replacement project.'],
      ['CDS preflight checks', '/features/cds-preflight/', 'Schema checks on the compiled declaration before handoff.'],
      ['Free customs document pack check', '/tools/customs-document-pack-check/', 'Check a pack before it reaches the desk.'],
      ['The one-job pilot', '/pilot/', 'Prove it on your own documents.'],
    ],
    sources: [...sources, gov.completion, gov.softwareList, scopeSource],
    cta: { ...numbersCta, title: `Map your ${system} route on the call.`, secondary: ['READ THE PILOT TERMS →', '/pilot/'] },
  }
}

export const integrationRoutes = [
  integrationPage({
    system: 'ASM Sequoia',
    stamp: 'KEEP\nSEQUOIA',
    slug: 'customs-preparation-for-sequoia',
    crumb: 'Customs preparation for ASM Sequoia',
    ref: 'WORKFLOW 30 · SEQUOIA HANDOFF',
    title: 'Customs preparation for ASM Sequoia | Declarix',
    description: 'Keep ASM Sequoia for filing. Declarix reads the job, builds CDS-ready entry data with the source beside every field, and hands it to Sequoia.',
    h1: 'Prepare and review the job before ASM Sequoia',
    standfirst: 'Sequoia files the declaration. Declarix does the work in front of it: reading the documents, building the entry and flagging the gaps, so your clerk checks the job instead of keying it.',
    answer: 'Keep ASM Sequoia exactly as it is. Declarix reads the customer documents, builds CDS-ready entry data with the source document, page and line beside every value, and returns it through the supported Sequoia export route. Your clerk checks and approves, and Sequoia files. That is how a desk gets up to 3× more declarations per clerk without a new system.',
    systemFacts: [
      'ASM says Sequoia provides gateways to all of the UK Community Service Providers and to CDS, and offers a web services API for integration and data exchange. Your filing route, badge and CSP connection stay exactly where they are.',
    ],
    routeParagraphs: [
      'Sequoia is a supported Declarix export and customer workflow integration. On the 20-minute numbers call we map the route your team will use, the fields it carries and the point where your clerk approves the entry.',
      'ASM documents its integration options in public: the Sequoia web services API and an Intermediary Service that accepts requests through configured input mechanisms. The agreed route uses the option that fits your Sequoia set-up.',
      'Alongside the Sequoia handoff, Declarix keeps a downloadable pack for every job: the compiled CDS declaration XML checked against the CDS schema, the PCS attachment manifest, the validation report and SHA-256 checksums.',
    ],
    faqs: [
      ['Does Declarix replace Sequoia?', 'No, Sequoia stays your filing system and Declarix prepares the entry data before it.'],
      ['Does Declarix submit declarations to HMRC?', 'No, your team submits through Sequoia with its own badge and permissions.'],
      ['Is Sequoia supported today?', 'Yes, Sequoia is a supported Declarix export and customer workflow integration.'],
      ['What does the clerk see before approving?', 'Each proposed value with its source document, page and line, plus every conflict and missing fact as a flag.'],
      ['How fast is a job processed?', 'Typical Declarix processing is around 200 seconds before clerk review begins.'],
      ['How do we start?', 'Book the 20-minute numbers call, then prove it on one real job in the pilot.'],
    ],
    sources: [
      { title: 'Sequoia connectivity', publisher: 'ASM (UK) Ltd', url: 'https://www.asm.org.uk/en/our-software/connectivity/', checked: CHECKED },
      { title: 'Sequoia API: Intermediary Service', publisher: 'ASM Resource Centre', url: 'https://help.asm.org.uk/en/supporting-documentation/sequoia-api/intermediary-service', checked: CHECKED },
    ],
  }),
  integrationPage({
    system: 'Descartes e-Customs',
    stamp: 'KEEP\nE-CUSTOMS',
    slug: 'customs-preparation-for-descartes',
    crumb: 'Customs preparation for Descartes e-Customs',
    ref: 'WORKFLOW 31 · DESCARTES HANDOFF',
    title: 'Customs preparation for Descartes e-Customs | Declarix',
    description: 'Keep Descartes e-Customs for CDS filing. Declarix builds the CDS-ready entry data from the customer documents and hands it over with the evidence.',
    h1: 'Prepare and review the job before Descartes e-Customs',
    standfirst: 'Descartes e-Customs files the declaration. Declarix builds the entry from the documents your customers send, so your clerk opens a checked job instead of a blank screen.',
    answer: 'Keep Descartes e-Customs for CDS filing. Declarix reads the invoices, packing lists, transport documents and emails, builds CDS-ready entry data with the source beside every value, and hands it over through the supported Descartes e-Customs route. Your clerk checks, approves and files in e-Customs as today, with up to 3× more declarations per clerk.',
    systemFacts: [
      'Descartes describes its UK CDS software as used by hundreds of UK forwarders and brokers, connected directly to HMRC and major UK ports, with templates and smart data re-use for filing. Those strengths stay in place. Declarix feeds e-Customs a checked entry so the filing work starts from evidence, not from retyping.',
    ],
    routeParagraphs: [
      'Descartes e-Customs is a supported Declarix export and customer workflow integration. On the 20-minute numbers call we map how the entry data reaches e-Customs in your set-up, which fields it carries and where your clerk approves.',
      'Every job also keeps a downloadable Declarix pack: the compiled CDS declaration XML checked against the CDS schema, the PCS attachment manifest, the validation report and SHA-256 checksums.',
      'Clerks who already use e-Customs templates keep them. Declarix supplies the job-specific facts that a template cannot know: this shipment’s values, weights, packages, origin and references, each tied to its source.',
    ],
    faqs: [
      ['Does Declarix replace Descartes e-Customs?', 'No, e-Customs stays your filing system and Declarix prepares the entry before it.'],
      ['Is Descartes e-Customs supported today?', 'Yes, Descartes e-Customs is a supported Declarix export and customer workflow integration.'],
      ['Who submits to HMRC?', 'Your team submits through Descartes e-Customs; Declarix does not submit to HMRC.'],
      ['Can we keep our e-Customs templates?', 'Yes, templates keep their job and Declarix supplies the shipment-specific facts with their evidence.'],
      ['What if the documents disagree?', 'The conflict is shown beside both sources as a flag for your clerk to decide.'],
      ['How do we start?', 'Book the 20-minute numbers call, then run one real job in the pilot.'],
    ],
    sources: [
      { title: 'CDS software', publisher: 'Descartes Systems Group', url: 'https://www.descartes.com/uk-customs/cds', checked: CHECKED },
      { title: 'UK customs', publisher: 'Descartes Systems Group', url: 'https://www.descartes.com/uk-customs', checked: CHECKED },
    ],
  }),
  integrationPage({
    system: 'CargoWise',
    stamp: 'KEEP\nCARGOWISE',
    slug: 'customs-preparation-for-cargowise',
    crumb: 'Customs preparation for CargoWise',
    ref: 'WORKFLOW 32 · CARGOWISE HANDOFF',
    title: 'Customs preparation for CargoWise users | Declarix',
    description: 'Keep CargoWise customs for filing. Declarix builds CDS-ready entry data from the documents and maps the handoff as a customer integration.',
    h1: 'Prepare and review the job before CargoWise customs',
    standfirst: 'CargoWise runs the forwarding and the declaration. Declarix takes on the document reading and entry building before it, so your clerk reviews evidence rather than retyping invoices.',
    answer: 'Keep CargoWise for your forwarding and customs filing. Declarix reads the job as it arrived, builds CDS-ready entry data with the source beside every value and flags every conflict. The handoff into CargoWise is mapped as a customer integration on the 20-minute numbers call, and your clerk approves before anything is filed.',
    systemFacts: [
      'WiseTech Global describes CargoWise customs for the UK as handling export declarations on a single platform, with a CDS wizard, CDS-rule VAT calculation and the ability to automate customs declarations from shipments, backed by real-time validation and automated rules. Declarix strengthens the step before that: turning the customer’s paperwork into the clean, evidenced shipment data those features depend on.',
    ],
    routeParagraphs: [
      'Declarix supports CargoWise desks through its customer-integration route. On the 20-minute numbers call we map how the prepared entry data reaches your CargoWise set-up, the fields it carries and where your clerk approves.',
      'Every job keeps a downloadable Declarix pack: the compiled CDS declaration XML checked against the CDS schema, the PCS attachment manifest, the validation report and SHA-256 checksums.',
      'Your CargoWise shipment record, customer master data and filing permissions stay in CargoWise. Declarix adds the evidence: every proposed value carries its document, page and line.',
    ],
    faqs: [
      ['Does Declarix replace CargoWise?', 'No, CargoWise stays your operating and filing system and Declarix prepares the entry data before it.'],
      ['How does the data reach CargoWise?', 'Through the customer-integration route we map with your team on the 20-minute numbers call.'],
      ['Who submits to HMRC?', 'Your team submits through CargoWise; Declarix does not submit to HMRC.'],
      ['Which declarations come first?', 'GB standard imports (H1) with document-heavy jobs are the best first workflow.'],
      ['What does the clerk see?', 'Every proposed value with its source, plus each conflict and missing fact as a flag with a next step.'],
      ['How do we start?', 'Book the 20-minute numbers call, then prove it on one real job in the pilot.'],
    ],
    sources: [
      { title: 'CargoWise customs', publisher: 'WiseTech Global', url: 'https://www.cargowise.com/solutions/cargowise-customs/', checked: CHECKED },
    ],
  }),
]

// ---------------------------------------------------------------- features

const featureRelated = [
  ['How Declarix builds the entry pack', '/how-it-works/', 'The full flow from intake to filing.'],
  ['All Declarix features', '/features/', 'Intake, exceptions, approvals, audit trail and preflight.'],
  ['The one-job pilot', '/pilot/', 'Prove it on your own documents.'],
  ['Desk capacity and ROI calculator', '/roi-calculator/', 'See what your team could take on.'],
]

export const featureRoutes = [
  {
    family: 'feature',
    path: '/features/customs-document-intake/',
    crumb: 'Customs document intake',
    ref: 'FEATURE 51 · INTAKE',
    eyebrow: 'FEATURE · CUSTOMS DOCUMENT INTAKE',
    title: 'Customs document intake: start with the whole job | Declarix',
    description: 'Send the job as it arrived: emails, PDFs, scans, photos, spreadsheets and ZIP files. Declarix sorts every document and links every field to its source.',
    h1: 'Start a customs case with the documents you already have',
    standfirst: 'No templates, no retyping and no tidying first. Declarix takes the whole job as your customer sent it and turns it into one case your clerk can check.',
    stamp: 'WHOLE JOB\nIN',
    schemaType: 'WebPage',
    publishedOn: PUBLISHED,
    reviewedOn: CHECKED,
    strip: ['EMAILS, PDFS, SCANS, PHOTOS, SPREADSHEETS', '6 DOCUMENT TYPES CLASSIFIED', 'EVERY FIELD LINKED TO ITS SOURCE'],
    answer: 'Customs document intake in Declarix starts with the case, not a single file. Your clerk drops in the whole job: saved emails with attachments, PDFs, scans, phone photos, spreadsheets with merged cells and ZIP files. Declarix classifies each document, extracts every field with its document, page and line, and builds one entry across the job in around 200 seconds before review.',
    blocks: [
      {
        label: '01 · CASE FIRST',
        title: 'One case holds the whole job.',
        paragraphs: [
          'A real import rarely arrives as one tidy invoice. The supplier sends the commercial invoice, the forwarder sends the bill of lading, the customer forwards an email with a revised packing list, and someone sends a photo of a certificate. Declarix opens a case and keeps all of it together.',
          'Later documents join the same case. A revised packing list or a customer reply sits beside the originals, so the clerk sees the full history instead of a pair of files.',
        ],
      },
      {
        label: '02 · WHAT GOES IN',
        title: 'The formats your customers actually send.',
        table: {
          caption: 'Accepted inputs and what Declarix does with them',
          head: ['Input', 'What Declarix does'],
          rows: [
            ['Saved email (.eml) with attachments', 'Opens the attachments into the case and keeps the email text as evidence'],
            ['ZIP file', 'Unpacks the bundle into separate documents and shows which files joined the case'],
            ['Native PDF', 'Reads text and tables, page by page'],
            ['Scan or phone photo', 'Reads the image and keeps the page reference for checking'],
            ['Spreadsheet (including merged cells)', 'Reads long line tables without manual reformatting'],
          ],
        },
      },
      {
        label: '03 · CLASSIFY',
        title: 'Six document types, sorted automatically.',
        paragraphs: [
          'Declarix classifies each document as a commercial invoice, packing list, bill of lading, certificate of origin, customs declaration or receipt. Classification uses three independent votes, so a mislabelled file name does not send a packing list down the invoice path.',
          'Classification then decides authority. The invoice rules value and description. The packing list rules quantity and weight. That order drives the cross-document checks that follow.',
        ],
      },
      {
        label: '04 · EXTRACT WITH PROOF',
        title: 'Every field keeps its document, page and line.',
        paragraphs: [
          'Declarix runs one nine-stage pass: ingest, normalise, classify, extract, canonicalise, validate, compile the CDS declaration, package and export. Each extracted value carries a six-step evidence chain from the source text to the human decision.',
          'In the review screen the clerk selects a value and the source document opens at the highlighted line. Where two documents offer different values, both candidates appear with their sources and confidence.',
        ],
        figure: {
          ...screens.review,
          alt: 'Declarix review screen showing an invoice total with two candidate values, their source lines and confidence, beside the source document with the line highlighted.',
          caption: `${DEMO} The clerk sees each candidate value, where it came from and how Declarix read it.`,
        },
      },
      {
        label: '05 · NEXT',
        title: 'From intake straight into checks.',
        paragraphs: [
          'Once the documents are in, the job moves on without another handoff: 124 named checks, flags with evidence, drafted customer queries and a CDS-ready entry pack. See [customs exception management](/features/customs-exception-management/) for what happens when the documents disagree, and [CDS preflight](/features/cds-preflight/) for the schema check on the compiled declaration.',
          'Want to test a pack before it reaches the desk? The free [customs document pack check](/tools/customs-document-pack-check/) walks through what a complete import job usually contains.',
        ],
      },
    ],
    faqs: [
      ['Which file types can we send?', 'Saved emails with attachments, PDFs, scans, phone photos, spreadsheets and ZIP files.'],
      ['Do we need a template per supplier?', 'No, Declarix reads each document as it arrives without supplier templates.'],
      ['How long does processing take?', 'Typical processing is around 200 seconds before clerk review begins.'],
      ['Can the clerk see where a value came from?', 'Yes, every field keeps its document, page and line, and the source opens beside the value.'],
      ['Are our documents used to train models?', 'No, customer documents are never used to train models.'],
    ],
    related: [
      ['Customs declaration document checklist', '/guides/customs-declaration-document-checklist/', 'What a complete import job usually contains.'],
      ...featureRelated,
    ],
    sources: [gov.completion, gov.fullImport],
    cta: { ...numbersCta, title: 'Send us the job your team dreads.', secondary: ['SEE THE PILOT →', '/pilot/'] },
  },
  {
    family: 'feature',
    path: '/features/customs-exception-management/',
    crumb: 'Customs exception management',
    ref: 'FEATURE 48 · EXCEPTIONS',
    eyebrow: 'FEATURE · CUSTOMS EXCEPTION MANAGEMENT',
    title: 'Customs exception management with evidence | Declarix',
    description: 'Declarix turns document conflicts and missing facts into flags with the evidence, the affected field and a written next step for your clerk.',
    h1: 'Manage customs exceptions without losing the evidence',
    standfirst: 'Flagged, not guessed. When the invoice and packing list disagree, Declarix shows both sources, names the field and says what to do next.',
    stamp: 'FLAGGED\nNOT GUESSED',
    schemaType: 'WebPage',
    publishedOn: PUBLISHED,
    reviewedOn: CHECKED,
    strip: ['124 NAMED CHECKS', '99 ISSUE TYPES WITH A WRITTEN NEXT STEP', '8 PACK GATES'],
    answer: 'Declarix manages customs exceptions by turning every conflict, missing fact and failed check into a flag that carries its evidence, the affected field and a written next step. The clerk resolves it in one place: accept, edit, override, escalate, attach evidence or send a drafted customer query. Nothing is silently guessed.',
    blocks: [
      {
        label: '01 · WHAT COUNTS',
        title: 'Four kinds of exception, each handled its own way.',
        table: {
          caption: 'Exception types and how Declarix handles them',
          head: ['Exception', 'Example', 'What Declarix does'],
          rows: [
            ['Conflict between documents', 'Invoice net weight 120.0 kg, packing list 118.5 kg', 'Shows both values and sources; the packing list is the weight authority'],
            ['Missing fact', 'Collect freight with no freight figure for DE 4/9', 'Raises a question and drafts the customer query'],
            ['Failed check', 'XI EORI in the wrong format', 'Flags the field with the check name and the fix'],
            ['Hard stop', 'Controlled goods or a sanctioned country', 'Holds the pack; no clerk override'],
          ],
        },
      },
      {
        label: '02 · IN CONTEXT',
        title: 'Every flag shows its working.',
        paragraphs: [
          'Each issue card names the check, its severity, the affected fields and goods lines, the source text from each document and the next step. 99 issue types carry written guidance, so a junior clerk knows what to do and a senior clerk can see why.',
        ],
        figure: {
          ...screens.issues,
          alt: 'Declarix issue task list with a blocker for a border transport mode conflict, a schema error with a suggested code transform, and a net weight mismatch between invoice and packing list.',
          caption: `${DEMO} A transport-mode conflict blocks export; a package-type code error offers a controlled fix; a weight mismatch shows both documents.`,
        },
      },
      {
        label: '03 · RESOLVE',
        title: 'Choose the resolution in one place.',
        steps: [
          ['Inspect the evidence', 'Open the compare view to see each document’s value, page and extracted quote side by side.'],
          ['Decide', 'Accept the authoritative value, edit it, override the rule with a reason, or waive a non-blocking issue.'],
          ['Escalate', 'Send a judgement call to a senior reviewer. Flagged decisions can require a second approver.'],
          ['Ask the customer', 'Turn missing documents into a drafted query, split by who must act: importer or supplier.'],
          ['Recheck', 'Changed data runs back through the checks, so an old pass never clears new data.'],
        ],
        figure: {
          ...screens.compare,
          alt: 'Declarix compare evidence view showing net weight from the commercial invoice at 120 and from the packing list at 118.5, with the packing list marked authoritative.',
          caption: `${DEMO} Both documents, both values, and the authority rule that decides between them.`,
        },
      },
      {
        label: '04 · WORK LANES',
        title: 'Blocked work stays visible.',
        paragraphs: [
          'Issues are grouped by who acts: the clerk, a senior reviewer or the customer. A case waiting on the client shows as waiting, not as finished. A case that cannot proceed shows as blocked, with the reason.',
          'Four confidence bands route the work: clean jobs go to a quick check, doubtful jobs to full review. Eight pack gates act as hard stops, including missing mandatory data, validation errors, controlled goods and a sanctioned country.',
        ],
        figure: {
          ...screens.queue,
          alt: 'Declarix work queue listing shipments with document counts, status such as blocked, needs review, waiting and ready for sign-off, readiness percentage, due time and owner.',
          caption: `${DEMO} The queue shows what is blocked, what needs review and what is ready for sign-off.`,
        },
      },
      {
        label: '05 · THE CUSTOMER QUERY',
        title: 'The chase is drafted before the clerk asks.',
        paragraphs: [
          'When a document is missing, Declarix drafts the customer query with the shipment reference, the deadline and who provides each item. The query moves from draft to approved, sent, replied and resolved, and the customer’s reply is matched back to the open query for the clerk to confirm.',
        ],
        figure: {
          ...screens.rfi,
          alt: 'Declarix drafted customer query asking for a certificate of origin and confirmation of the final packing list, showing who provides each item and the deadline.',
          caption: `${DEMO} The clerk reviews the drafted message and sends it.`,
        },
      },
    ],
    faqs: [
      ['What is customs exception management?', 'It is how a customs desk finds, explains and resolves the conflicts and gaps in a job before filing.'],
      ['Does Declarix guess when documents disagree?', 'No, it shows both values and sources and leaves the decision to your clerk.'],
      ['Can a clerk override a check?', 'Yes, with a recorded reason, except for the eight pack gates, which no clerk can override.'],
      ['Who writes the customer chaser?', 'Declarix drafts it, and your clerk reviews and sends it.'],
      ['What happens after a fix?', 'The changed data runs back through the checks before the case can move on.'],
    ],
    related: [
      ['Customs data validation guide', '/guides/customs-data-validation/', 'How the layers of checks fit together.'],
      ['Customs approval workflow', '/features/customs-approval-workflow/', 'Second approver for flagged decisions.'],
      ...featureRelated,
    ],
    sources: [gov.completion, gov.valuation],
    cta: { ...numbersCta, title: 'See your own exceptions flagged.', secondary: ['TRY THE FREE PACK CHECK →', '/tools/customs-document-pack-check/'] },
  },
  {
    family: 'feature',
    path: '/features/customs-approval-workflow/',
    crumb: 'Customs approval workflow',
    ref: 'FEATURE 49 · APPROVAL',
    eyebrow: 'FEATURE · CUSTOMS APPROVAL WORKFLOW',
    title: 'Customs approval workflow: maker and checker | Declarix',
    description: 'Juniors clear routine items, seniors sign the judgement calls. Flagged decisions need a different approver, and nothing pending takes effect.',
    h1: 'Use a second approver for flagged customs decisions',
    standfirst: 'Your clerk checks. Your name signs. Declarix routes each decision to the right person and makes sure a flagged call gets a second pair of eyes.',
    stamp: 'FOUR\nEYES',
    schemaType: 'WebPage',
    publishedOn: PUBLISHED,
    reviewedOn: CHECKED,
    strip: ['MAKER AND CHECKER', '3 CLEARANCE TIERS', '13 ROLES × 33 PERMISSIONS'],
    answer: 'Declarix runs a maker-checker approval workflow for customs decisions. Routine items are cleared by the assigned clerk, and decisions your policy flags open an approval request that a different person must approve. A pending decision has no effect until it is approved, and a rejected decision is voided and the work returns to the case.',
    blocks: [
      {
        label: '01 · WHERE IT FITS',
        title: 'After the evidence review, before the pack.',
        paragraphs: [
          'Approval sits between the clerk’s field decisions and the release of the entry pack. The clerk has already seen each value with its source. Approval adds the senior check on the calls that matter: an overridden commodity code, a valuation adjustment, a waived flag.',
        ],
      },
      {
        label: '02 · WHO DOES WHAT',
        title: 'Juniors clear routine work. Seniors sign judgement calls.',
        table: {
          caption: 'Typical division of approval work',
          head: ['Decision', 'Who can make it', 'Second approval'],
          rows: [
            ['Accept a value that matches its authoritative source', 'Assigned clerk', 'Not needed'],
            ['Edit a value with evidence attached', 'Assigned clerk', 'When your policy flags the field'],
            ['Override a commodity code (for example under GIR 3a)', 'Senior reviewer', 'Yes, by a different person'],
            ['Waive a non-blocking issue', 'Clearance tier set by your policy', 'When flagged'],
            ['Release past a pack gate', 'No one', 'Pack gates are hard stops'],
          ],
        },
        after: [
          'Declarix has three clearance tiers and 13 roles across 33 permissions. Your firm sets which decisions need a second approver.',
        ],
      },
      {
        label: '03 · THE RULES',
        title: 'Four rules keep approval honest.',
        steps: [
          ['The maker cannot approve their own decision', 'The approval request goes to a different user with the right authority.'],
          ['Pending means not yet effective', 'A decision waiting for approval does not change the entry data.'],
          ['Rejection is real', 'A rejected decision is voided, and the field returns to review with the reason.'],
          ['Approval is tied to the current data', 'If the evidence changes after approval, the case is rechecked before the pack is released.'],
        ],
      },
      {
        label: '04 · TEAM WORK',
        title: 'Assignment and approval in the same flow.',
        paragraphs: [
          'Cases can be claimed, assigned, handed off, released and rebalanced across the team, with history kept for each move. The queue shows the owner, the due time and the status of every case, so a supervisor sees where approvals are waiting.',
          'Every approval and rejection is written to the [customs audit trail](/features/customs-audit-trail/) with who decided, when, and the values before and after.',
        ],
        figure: {
          ...screens.audit,
          alt: 'Declarix audit timeline listing accepted gross weight and invoice total changes, a supervisor override of an HS code under GIR 3a, a snapshot creation and pipeline events with times.',
          caption: `${DEMO} A supervisor override sits in the same timeline as the clerk’s decisions and the processing run.`,
        },
      },
    ],
    faqs: [
      ['What is a customs approval workflow?', 'It is the set of rules deciding who can make and who must approve each decision on a declaration.'],
      ['Does every decision need two people?', 'No, only the decisions your policy flags need a second approver.'],
      ['Can a clerk approve their own flagged decision?', 'No, a different user must approve or reject it.'],
      ['What happens to a rejected decision?', 'It is voided and the field goes back to review with the reason recorded.'],
      ['Who signs the final entry?', 'Your authorised clerk approves the entry, and your team files it in your existing system.'],
    ],
    related: [
      ['Customs exception management', '/features/customs-exception-management/', 'How flags reach the approver.'],
      ['Security and data schedule', '/security/', 'Access, roles and the deployment packet.'],
      ...featureRelated,
    ],
    sources: [gov.representation, gov.completion],
    cta: { ...numbersCta, title: 'Keep the senior check. Lose the keying.', secondary: ['SEE THE PILOT →', '/pilot/'] },
  },
  {
    family: 'feature',
    path: '/features/customs-audit-trail/',
    crumb: 'Customs audit trail',
    ref: 'FEATURE 50 · AUDIT TRAIL',
    eyebrow: 'FEATURE · CUSTOMS AUDIT TRAIL',
    title: 'Customs audit trail: evidence and decisions | Declarix',
    description: 'Every run, check, decision and snapshot written once and hash-chained. See the source behind each value and who changed it, when and why.',
    h1: 'See the evidence and decision history behind a customs case',
    standfirst: 'When HMRC, a customer or your own QA asks why a value is on the entry, the answer is one click away: the source line, the check that ran and the person who approved it.',
    stamp: 'EVERY\nDECISION\nKEPT',
    schemaType: 'WebPage',
    publishedOn: PUBLISHED,
    reviewedOn: CHECKED,
    strip: ['SHA-256 HASH-CHAINED', 'RULE VERSION ON EVERY CHECK', 'WHO, WHEN, BEFORE AND AFTER'],
    answer: 'The Declarix customs audit trail records every processing run, check, decision and snapshot once and keeps it. Entries are SHA-256 hash-chained, so tampering is evident, and each value links back to its source document, page and line. Reviewers can search the audit, compare versions and run an integrity check.',
    blocks: [
      {
        label: '01 · WHY HISTORY MATTERS',
        title: 'The latest value is not the whole story.',
        paragraphs: [
          'A gross weight of 412.5 kg on the entry means more when you can see that the packing list said 412.5, the bill of lading said 410.0, the clerk accepted the packing list at 14:35, and the check that compared them used a known rule version.',
          'That history protects the broker. It shows reasonable care on every job, answers customer disputes quickly and makes internal QA a review of decisions rather than a hunt through inboxes.',
        ],
        figure: {
          ...screens.audit,
          alt: 'Declarix audit timeline for one day listing clerk acceptances with before and after values, a supervisor HS code override citing GIR 3a, snapshot creation and pipeline processing events.',
          caption: `${DEMO} Each event shows who acted, what changed and the reason.`,
        },
      },
      {
        label: '02 · WHAT IS RECORDED',
        title: 'Six things the trail keeps for every case.',
        table: {
          caption: 'Audit trail contents',
          head: ['Record', 'What it holds'],
          rows: [
            ['Source evidence', 'Document, page, line and extracted quote for each proposed value'],
            ['Processing runs', 'Start, completion and snapshot number for each pipeline run'],
            ['Check results', 'Each check’s outcome and the rule version that produced it'],
            ['Human decisions', 'Accept, edit, override, waive or escalate, with values before and after'],
            ['Approvals', 'Who requested, who approved or rejected, and when'],
            ['Pack generation', 'Files in the pack, the manifest and SHA-256 checksums'],
          ],
        },
      },
      {
        label: '03 · VALUE TO SOURCE',
        title: 'Follow any value back to the page it came from.',
        paragraphs: [
          'Every field carries a six-step evidence chain: source text, extracted value, canonical field, check, CDS mapping and human decision. In the review screen, selecting a value opens the source document at the highlighted line.',
        ],
        figure: {
          ...screens.review,
          alt: 'Declarix review screen with an invoice total value, its candidate sources and confidence, and the source document panel showing the matching line.',
          caption: `${DEMO} The source panel shows the document and line behind the selected value.`,
        },
      },
      {
        label: '04 · INTEGRITY',
        title: 'Written once, chained, and checkable.',
        paragraphs: [
          'Audit entries are written once and linked with SHA-256 hashes, so a changed entry breaks the chain and shows. Reviewers can search the audit, compare two versions of a case and run an integrity check.',
          'The entry pack carries the same discipline: each file is checksummed and the pack screen confirms the audit chain is intact.',
        ],
        figure: {
          ...screens.pack,
          alt: 'Declarix pack generated screen with checksummed documents, the note that the audit chain is intact, and downloads for the CDS declaration XML and PCS manifests.',
          caption: `${DEMO} The pack screen confirms checksums and an intact audit chain.`,
        },
      },
      {
        label: '05 · FRESH DATA',
        title: 'New evidence means a new check.',
        paragraphs: [
          'When a customer sends a corrected invoice, the case gets a new snapshot and the checks run again. Release is tied to the current snapshot, so an approval on old data never clears new data.',
        ],
      },
    ],
    faqs: [
      ['What is a customs audit trail?', 'It is the record of where each declaration value came from and who decided it.'],
      ['Is the Declarix audit trail tamper-evident?', 'Yes, entries are written once and SHA-256 hash-chained, so a change breaks the chain.'],
      ['Does it record the rule version behind each check?', 'Yes, every check run is recorded with its outcome and rule version.'],
      ['Can we see who overrode a value?', 'Yes, every decision shows the person, the time and the values before and after.'],
      ['Does the audit trail travel with the pack?', 'Yes, the pack carries a manifest with SHA-256 checksums for every file.'],
    ],
    related: [
      ['Customs approval workflow', '/features/customs-approval-workflow/', 'How approvals enter the trail.'],
      ['Security and data schedule', '/security/', 'Retention, deletion and the deployment packet.'],
      ...featureRelated,
    ],
    sources: [gov.representation, gov.completion],
    cta: { ...numbersCta, title: 'Show your work on every job.', secondary: ['READ THE SECURITY SCHEDULE →', '/security/'] },
  },
  {
    family: 'feature',
    path: '/features/cds-preflight/',
    crumb: 'CDS preflight checks',
    ref: 'FEATURE 52 · CDS PREFLIGHT',
    eyebrow: 'FEATURE · CDS PREFLIGHT CHECKS',
    title: 'CDS preflight checks before handoff | Declarix',
    description: 'Declarix compiles the CDS import declaration, validates it against the CDS schema and maps every error back to the field and source behind it.',
    h1: 'Check the H1 declaration before it reaches your filing system',
    standfirst: 'Catch the error at your desk, not in a rejection message. Declarix compiles the CDS declaration and checks it against the CDS schema before the pack is built.',
    stamp: 'SCHEMA\nCHECKED',
    schemaType: 'WebPage',
    publishedOn: PUBLISHED,
    reviewedOn: CHECKED,
    strip: ['WCO DMS 3.6 · 12 XSD FILES', 'ERRORS MAPPED TO FIELD AND SOURCE', 'GB STANDARD IMPORTS (H1)'],
    answer: 'CDS preflight in Declarix compiles the GB standard import (H1) declaration from the checked case data and validates the XML against the CDS schema (WCO DMS 3.6, 12 XSD files) before the pack is built. Each error is mapped back to the CDS data element, the XML location, the source document and the transform that produced it, so the clerk fixes the cause rather than the symptom.',
    blocks: [
      {
        label: '01 · SCOPE',
        title: 'What preflight covers.',
        paragraphs: [
          'CDS is HMRC’s Customs Declaration Service. Declarix preflight is built for GB standard import declarations (H1), the high-volume work where document-heavy jobs cost clerks the most time. It runs after the 124 named checks on the case data and before the pack is released.',
        ],
      },
      {
        label: '02 · COMPILE AND VALIDATE',
        title: 'Four readiness dimensions, each judged on its own.',
        paragraphs: [
          'Declarix reports readiness on four separate dimensions: the documents, the canonical data, the target schema (CDS XML) and the pack. A passing dimension never hides a failing one.',
          'Code-list failures count as invalid even where the schema alone would let an empty value through, so a wrong package code or country code is caught at preflight.',
        ],
        figure: {
          ...screens.readiness,
          alt: 'Declarix readiness dimensions: document pass, canonical data pass, target schema CDS XML fail, and CMS pack blocked because DE 7/4 transport mode is in conflict.',
          caption: `${DEMO} Two dimensions pass; the schema check fails and the pack is held until DE 7/4 is resolved.`,
        },
      },
      {
        label: '03 · FIND THE CAUSE',
        title: 'Every schema error points back to its source.',
        table: {
          caption: 'Worked preflight errors and how Declarix maps them',
          head: ['Preflight finding', 'Mapped to', 'Next step offered'],
          rows: [
            ['PackagingTypeCode “Cartons” is not a valid value (an..2)', 'DE 6/9 type of packages, goods line 1, packing list page 1', 'Apply the controlled transform from “Cartons” to “CT”'],
            ['Border transport mode in conflict', 'DE 7/4, bill of lading page 1 (SEA and AIR both ticked)', 'Confirm the crossing mode with the carrier and set DE 7/4'],
            ['Gross mass missing on an item', 'DE 6/5, packing list line 3', 'Obtain the weight; the pack is held as missing mandatory data'],
            ['XI EORI with the wrong digit count', 'DE 3/16 importer identification number', 'Correct to XI plus 12 or 15 digits'],
          ],
        },
        after: [
          'Each finding carries the canonical field, the XML path and the conversion history, so the clerk sees whether the problem came from the document, the extraction or the mapping.',
        ],
      },
      {
        label: '04 · CORRECT AND RECHECK',
        title: 'Controlled fixes, then a fresh check.',
        steps: [
          ['Apply a controlled fix', 'Where the fix is mechanical, such as a package description to its two-character code, Declarix offers a controlled transform and shows the value before and after.'],
          ['Decide the judgement calls', 'Where the fix needs customs judgment, the clerk edits with evidence or escalates to a senior reviewer.'],
          ['Revalidate', 'The changed data is compiled and checked again. Only a clean run on the current snapshot lets the pack through.'],
        ],
        figure: {
          ...screens.issues,
          alt: 'Declarix issue list including a CDS XSD invalid finding for package type code with a suggested controlled transform from Cartons to CT.',
          caption: `${DEMO} A CDS schema finding with its controlled fix, beside a transport conflict and a weight mismatch.`,
        },
      },
      {
        label: '05 · HAND OFF',
        title: 'A checked pack for your filing system.',
        paragraphs: [
          'The released pack holds the compiled CDS declaration XML, the PCS attachment manifest, the validation report with rule versions and SHA-256 checksums. It moves to Sequoia, Descartes e-Customs or your agreed customer integration, and your team files it with its own badge and permissions. HMRC’s own processing and notifications are described in the [Customs Declarations end-to-end service guide](https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/).',
        ],
      },
    ],
    faqs: [
      ['What is a CDS preflight check?', 'It is a check of the compiled declaration against the CDS schema and code lists before it is filed.'],
      ['Which schema does Declarix check against?', 'The CDS declaration schema, WCO DMS 3.6, using 12 XSD files.'],
      ['Which declarations does it cover?', 'GB standard import declarations (H1).'],
      ['Does preflight submit anything to HMRC?', 'No, Declarix does not submit to HMRC; your team files through its own system.'],
      ['Does an error show where it came from?', 'Yes, each error maps to the data element, XML location, source document and transform.'],
    ],
    related: [
      ['Customs data validation guide', '/guides/customs-data-validation/', 'Where preflight sits among the checks.'],
      ['Customs exception management', '/features/customs-exception-management/', 'How findings become work for the clerk.'],
      ['CDS Operations Radar', '/research/cds-operations-radar/', 'Source-verified CDS changes that affect the desk.'],
      ...featureRelated,
    ],
    sources: [gov.completion, gov.developerGuide, gov.volume3],
    cta: { ...numbersCta, title: 'Catch it before it is filed.', secondary: ['SEE THE PILOT →', '/pilot/'] },
  },
]

export const featureHub = {
  family: 'hub',
  path: '/features/',
  ref: 'INDEX · FEATURES',
  title: 'Declarix features for customs desks',
  description: 'Document intake, exception management, maker-checker approval, a hash-chained audit trail and CDS preflight: how Declarix gets more from every clerk.',
  eyebrow: 'FEATURES · DOCUMENTS IN, CHECKED ENTRY OUT',
  h1: 'Everything between the inbox and the filing screen.',
  standfirst: 'Declarix reads the job, builds the entry, flags what is wrong and hands a CDS-ready pack to the system you already use. These are the parts that make up to 3× more declarations per clerk possible.',
  stamp: 'CHECK\nNOT KEY',
  schemaType: 'CollectionPage',
  publishedOn: PUBLISHED,
  reviewedOn: CHECKED,
  strip: ['124 NAMED CHECKS', 'AROUND 200 SECONDS BEFORE REVIEW', 'SEQUOIA · DESCARTES · CUSTOMER INTEGRATIONS'],
  answer: 'Declarix covers the work before filing. It takes the whole job in, links every field to its source, runs 124 named checks, turns problems into flags with a next step, routes judgement calls to a second approver, records every decision in a hash-chained audit trail and checks the compiled CDS declaration against the schema before handoff.',
  indexLabel: 'FIVE FEATURES',
  indexTitle: 'Pick the part of the job you want to see.',
  items: [
    { name: 'Customs document intake', path: '/features/customs-document-intake/', summary: 'Emails, PDFs, scans, photos, spreadsheets and ZIP files into one case.' },
    { name: 'Customs exception management', path: '/features/customs-exception-management/', summary: 'Conflicts and gaps as flags with evidence and a written next step.' },
    { name: 'Customs approval workflow', path: '/features/customs-approval-workflow/', summary: 'Maker and checker, with a second approver for flagged decisions.' },
    { name: 'Customs audit trail', path: '/features/customs-audit-trail/', summary: 'Every run, check and decision written once and hash-chained.' },
    { name: 'CDS preflight checks', path: '/features/cds-preflight/', summary: 'The compiled H1 declaration checked against the CDS schema.' },
  ],
  blocks: [
    {
      label: '01 · THE FLOW',
      title: 'How the features fit one job.',
      steps: [
        ['Intake', 'The whole job goes in as it arrived and becomes one case.'],
        ['Checks', '124 named checks run across documents, data, valuation, origin, controls and the schema.'],
        ['Exceptions', 'Every problem becomes a flag with evidence, a next step and a drafted customer query where needed.'],
        ['Approval', 'The clerk decides; flagged calls go to a second approver.'],
        ['Pack and handoff', 'The CDS-ready pack goes to Sequoia, Descartes e-Customs or your customer integration, and your team files.'],
      ],
    },
    {
      label: '02 · WHAT STAYS WITH YOU',
      title: 'Your system, your badge, your judgment.',
      paragraphs: [
        'Declarix sits in front of your filing system, not instead of it. Your authorised clerk approves every entry and your team submits through its existing system. Customer documents are never used to train models.',
        'See the integration workflows for [ASM Sequoia](/customs-workflows/customs-preparation-for-sequoia/), [Descartes e-Customs](/customs-workflows/customs-preparation-for-descartes/) and [CargoWise](/customs-workflows/customs-preparation-for-cargowise/).',
      ],
    },
  ],
  related: [
    ['How Declarix works', '/how-it-works/', 'The operating flow in five steps.'],
    ['Supported scope', '/supported-scope/', 'Where Declarix fits and which systems it supports.'],
    ['Buyer guides', '/guides/', 'Practical guides for customs desks.'],
    ['The one-job pilot', '/pilot/', 'Prove it on your own documents.'],
  ],
  cta: { ...numbersCta, secondary: ['READ HOW IT WORKS →', '/how-it-works/'] },
}

// ---------------------------------------------------------------- guides

export const guideRoutes = [
  {
    family: 'guide',
    path: '/guides/automate-customs-without-changing-software/',
    crumb: 'Automate customs without changing software',
    ref: 'GUIDE 46 · KEEP YOUR SYSTEM',
    eyebrow: 'GUIDE · AUTOMATE WITHOUT CHANGING SOFTWARE',
    title: 'Automate customs without replacing your software',
    description: 'A rollout guide for customs desks: keep Sequoia, Descartes or CargoWise, automate the document work before filing, and prove it on one job.',
    h1: 'Improve preparation while keeping your filing system',
    standfirst: 'Most of a clerk’s time goes on the work before the filing screen. You can automate that work without a migration, new badges or retraining on a new declaration system.',
    stamp: 'NO\nREPLACEMENT\nPROJECT',
    schemaType: 'TechArticle',
    publishedOn: PUBLISHED,
    reviewedOn: CHECKED,
    strip: ['KEEP YOUR FILING SYSTEM', 'AUTOMATE THE PREPARATION', 'PROVE IT ON ONE JOB'],
    answer: 'Yes, you can automate customs work without changing your filing software. Keep the system that holds your badge, authorisations and HMRC connection, and automate the preparation before it: reading documents, building the entry, checking it and chasing gaps. Declarix does that preparation and hands a CDS-ready pack to Sequoia, Descartes e-Customs or a mapped customer integration.',
    blocks: [
      {
        label: '01 · DECIDE WHAT STAYS',
        title: 'Draw the line between filing and preparation.',
        paragraphs: [
          'A customs management system files the declaration: it holds the badge, the CSP or direct CDS connection, the authorisations, the deferment account and the response from HMRC. HMRC lists the providers of that filing layer on its [software developers list](https://www.gov.uk/guidance/list-of-software-developers-providing-customs-declaration-support).',
          'Preparation is everything before that: opening the email, reading the invoice and packing list, keying lines, reconciling weights and values, and chasing the customer. That is where the hours go, and it is the layer you can automate without touching the filing system.',
        ],
        table: {
          caption: 'What stays and what changes',
          head: ['Task', 'Today', 'With Declarix'],
          rows: [
            ['Read and sort documents', 'Clerk opens each file', 'Declarix classifies six document types automatically'],
            ['Key the entry', 'Clerk types every field', 'Declarix builds the entry with the source beside every value'],
            ['Cross-check documents', 'Clerk compares by eye', '7 comparisons on every goods line'],
            ['Chase the customer', 'Clerk writes each email', 'Declarix drafts the query, split by who acts'],
            ['Approve', 'Clerk or senior', 'Unchanged: your clerk approves'],
            ['File with HMRC', 'Your CMS', 'Unchanged: your CMS'],
          ],
        },
      },
      {
        label: '02 · MAP THE CURRENT JOB',
        title: 'Time one real job, stage by stage.',
        list: [
          'Pick a representative GB import (H1): a sea or air job with an invoice, packing list, transport document and at least one conflict.',
          'Record minutes for each stage: reading, keying, cross-checking, customer chase, senior review and filing.',
          'Count the re-keys: how many values the clerk types that already exist in a document.',
          'Note the questions that went back to the customer and how long the answers took.',
          'Put the numbers into the [desk capacity and ROI calculator](/roi-calculator/) to see the hours the preparation layer costs.',
        ],
      },
      {
        label: '03 · CHOOSE THE FIRST WORKFLOW',
        title: 'Start where the manual work is heaviest.',
        list: [
          'High-volume repeat import work with consistent review rules.',
          'Document-heavy jobs with long line tables or amalgamated invoices.',
          'Work where senior clerks spend too long on basic assembly.',
          'Desks turning away declarations because hiring another experienced clerk is slow or expensive.',
        ],
      },
      {
        label: '04 · AGREE THE HANDOFF',
        title: 'Agree the route before you count on it.',
        paragraphs: [
          'Decide how prepared entry data reaches your filing system, which fields it carries and where your clerk approves. Declarix supports Sequoia and Descartes e-Customs exports and maps other systems as customer integrations on the 20-minute numbers call. See the workflow pages for [ASM Sequoia](/customs-workflows/customs-preparation-for-sequoia/), [Descartes e-Customs](/customs-workflows/customs-preparation-for-descartes/) and [CargoWise](/customs-workflows/customs-preparation-for-cargowise/).',
        ],
      },
      {
        label: '05 · RUN ONE JOB',
        title: 'Prove it on one real job before rolling out.',
        steps: [
          ['Anonymise one real job', 'Keep the scans, spreadsheets and conflicts that create the work. A perfect demo bundle proves nothing.'],
          ['Record the manual baseline', 'Use the stage timings from step 2 with agreed start and stop points.'],
          ['Let Declarix process the same job', 'The pack comes back within one working day, with every field’s source and every conflict visible.'],
          ['Compare side by side', 'Your clerk checks the pack and the handoff into your system, and records review time separately.'],
          ['Decide on the result', pilotSentence],
        ],
      },
      {
        label: '06 · ROLL OUT',
        title: 'The rollout checklist.',
        list: [
          'Permissions: set who claims, approves and releases, and which decisions need a second approver.',
          'Training: clerks learn to check evidence, not a new filing screen.',
          'Data terms: agree the transfer channel, retention and access in writing before live documents move. See the [security schedule](/security/).',
          'Measurement: track declarations per clerk, minutes per job and customer chase time from week one.',
          'Scale: add the next workflow once the first one pays for itself.',
        ],
      },
    ],
    faqs: [
      ['Can we automate customs without changing software?', 'Yes, automate the preparation before filing and keep your filing system as it is.'],
      ['Do our clerks need to learn a new filing system?', 'No, they keep filing in the system they know and check prepared entries.'],
      ['Which systems does Declarix support?', 'Sequoia and Descartes e-Customs, plus other systems mapped as customer integrations.'],
      ['How long does a first test take?', 'The pilot pack comes back within one working day of receiving the job.'],
      ['What does the pilot cost?', pilotSentence],
    ],
    related: [
      ['Customs clearance software: the two layers', '/customs-clearance-software/', 'Filing versus preparation.'],
      ['Supported scope', '/supported-scope/', 'Integrations and the best first workflow.'],
      ['Automation versus outsourcing', '/compare/automation-vs-outsourcing/', 'Compare preparation options.'],
      ['Free customs declaration cost calculator', '/tools/customs-declaration-cost-calculator/', 'Cost per entry from your own numbers.'],
      ['All guides', '/guides/', 'More practical guides for customs desks.'],
    ],
    sources: [gov.softwareList, gov.developerGuide, gov.fullImport],
    cta: { ...numbersCta, title: 'Map your first workflow on the call.', secondary: ['READ THE PILOT TERMS →', '/pilot/'] },
  },
  {
    family: 'guide',
    path: '/guides/customs-declaration-document-checklist/',
    crumb: 'Customs declaration document checklist',
    ref: 'GUIDE 53 · DOCUMENT CHECKLIST',
    eyebrow: 'GUIDE · CUSTOMS DOCUMENT CHECKLIST',
    title: 'Customs declaration document checklist (UK imports)',
    description: 'The documents a UK import declaration usually needs, the conditional ones, and the consistency checks to run before a clerk builds the entry.',
    h1: 'Check the documents for your customs case',
    standfirst: 'A complete pack saves a day of chasing. Use this checklist to see what a UK import usually needs, what depends on the goods, and where documents most often disagree.',
    stamp: 'PACK\nCHECKED',
    schemaType: 'TechArticle',
    publishedOn: PUBLISHED,
    reviewedOn: CHECKED,
    strip: ['CORE DOCUMENTS', 'CONDITIONAL EVIDENCE', 'CONSISTENCY CHECKS'],
    answer: 'A UK import declaration usually starts from a commercial invoice, a packing list and a transport document (bill of lading, air waybill or CMR). Depending on the goods, route and procedure you may also need a certificate or statement of origin, licences, health certificates and authorisation references. The documents must also agree with each other on quantities, weights, values and descriptions.',
    blocks: [
      {
        label: '01 · START HERE',
        title: 'What every import declaration draws on.',
        paragraphs: [
          'HMRC’s guidance on [making a full import declaration](https://www.gov.uk/guidance/making-a-full-import-declaration) lists the information you need: the customs procedure code, the commodity code, the declaration unique consignment reference, the departure point and destination, the consignee and consignor, the type, amount and packaging of the goods, transport methods and costs, currencies and valuation methods, and certificates and licences. The documents below are where those facts come from.',
        ],
        table: {
          caption: 'Core documents for a UK import declaration',
          head: ['Document', 'Facts it usually supplies', 'CDS data elements'],
          rows: [
            ['Commercial invoice', 'Seller, buyer, goods description, quantities, line values, currency, delivery terms', 'DE 3/24, 3/26, 6/8, 4/10, 4/11, 4/1'],
            ['Packing list', 'Packages, marks, net and gross weights per line', 'DE 6/9, 6/10, 6/1, 6/5, 6/18'],
            ['Bill of lading, air waybill or CMR', 'Transport mode, vessel or flight, ports, container numbers, carton count', 'DE 7/4, 7/9, 7/10, 5/21'],
            ['Freight and insurance invoices', 'Costs to the UK border for the customs value', 'DE 4/9'],
            ['Importer details', 'EORI, representation status, deferment', 'DE 3/15, 3/16, 3/21, 2/6'],
          ],
        },
      },
      {
        label: '02 · WHEN THEY APPLY',
        title: 'Conditional evidence depends on the goods and the claim.',
        table: {
          caption: 'Conditional documents and when they are needed',
          head: ['Document', 'When it applies', 'Where to check'],
          rows: [
            ['Certificate or statement of origin', 'When you claim preferential duty under a trade agreement', '[Commodity codes and measures](https://www.gov.uk/guidance/finding-commodity-codes-for-imports-or-exports)'],
            ['Import licence', 'Controlled goods such as firearms and ammunition, nuclear materials or certain chemicals', '[Import controls](https://www.gov.uk/guidance/import-controls)'],
            ['Health or phytosanitary certificate', 'Animals, animal products, plants and plant products', '[Import goods into the UK](https://www.gov.uk/import-goods-into-uk)'],
            ['Authorisation references', 'Special procedures, simplified declarations or deferment', '[Completion instructions, Group 2](https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide)'],
            ['Valuation evidence', 'Related-party sales, royalties, assists or other additions', '[Valuation guidance](https://www.gov.uk/government/collections/working-out-the-customs-value-of-your-imported-goods)'],
          ],
        },
      },
      {
        label: '03 · DO THEY AGREE?',
        title: 'Seven checks to run on every goods line.',
        list: [
          'Quantity: invoice against packing list.',
          'Net weight and gross weight: packing list against the transport document.',
          'Package count: packing list against the bill of lading or air waybill.',
          'Item value and line value: the invoice lines must add up to the invoice total.',
          'Description: the invoice description must match the packing list well enough to support the commodity code.',
          'Delivery terms: a CIF invoice should already include freight and insurance; EXW, FCA, FOB or collect freight needs the freight and insurance costs to the UK border added for the customs value.',
          'Origin: every line needs an origin; a preference claim needs proof of origin.',
        ],
        after: [
          'Declarix runs these seven comparisons on every goods line automatically, with the invoice as the authority for value and description and the packing list as the authority for quantity and weight. A 43-line job gets 301 comparisons before a clerk looks at it.',
        ],
      },
      {
        label: '04 · WORKED EXAMPLE',
        title: 'One sea import, three disagreements.',
        paragraphs: [
          'A Felixstowe import of industrial pump components arrives as an email, a commercial invoice, a packing list and a bill of lading. The invoice shows a net weight of 120.0 kg on line 1; the packing list shows 118.5 kg. The bill of lading has both SEA and AIR ticked. The packing list has no gross weight on line 3.',
          'Each problem needs a different action: accept the packing list weight as authoritative, confirm the transport mode with the carrier for DE 7/4, and ask the customer for the missing gross mass for DE 6/5. Declarix raises all three as flags with their sources and drafts the customer query for the missing weight.',
        ],
        figure: {
          ...screens.compare,
          alt: 'Declarix compare evidence view for net weight showing the commercial invoice value 120 and the packing list value 118.5, with the packing list marked authoritative.',
          caption: `${DEMO} The same disagreement as the worked example, shown with both sources.`,
        },
      },
      {
        label: '05 · CHECK YOUR PACK',
        title: 'Run the free pack check, then fix the gaps.',
        paragraphs: [
          'The free [customs document pack check](/tools/customs-document-pack-check/) walks through the same questions for your own job in a few minutes, with no upload. When the pack has conflicts or gaps, [customs exception management](/features/customs-exception-management/) shows how Declarix turns them into flags and drafted customer queries.',
          'A complete pack is the start of the declaration, not the end. Classification, valuation and procedure stay with your authorised team, guided by HMRC’s [completion instructions](https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide).',
        ],
      },
    ],
    faqs: [
      ['What documents do I need for a UK import declaration?', 'Usually a commercial invoice, a packing list and a transport document, plus any certificates or licences the goods require.'],
      ['Is a packing list always required?', 'It is not a legal requirement for every import, but it is the usual source for packages and weights.'],
      ['When do I need a certificate of origin?', 'When you claim preferential duty and the trade agreement requires proof of origin.'],
      ['Which document wins when weights disagree?', 'Declarix treats the packing list as the authority for quantity and weight, and your clerk confirms.'],
      ['Can I check a pack for free?', 'Yes, use the free customs document pack check, which needs no upload.'],
    ],
    related: [
      ['Free customs document pack check', '/tools/customs-document-pack-check/', 'Check your own pack in minutes.'],
      ['Customs document intake', '/features/customs-document-intake/', 'How Declarix takes the whole job in.'],
      ['Customs data validation guide', '/guides/customs-data-validation/', 'The layers of checks after the documents arrive.'],
      ['Incoterms for customs', '/customs-reference/incoterms/', 'How delivery terms change the customs value.'],
      ['All guides', '/guides/', 'More practical guides for customs desks.'],
    ],
    sources: [gov.fullImport, gov.completion, gov.importGoods, gov.licences, gov.commodityCodes, gov.valuation],
    cta: { ...numbersCta, title: 'Stop rebuilding packs by hand.', secondary: ['TRY THE FREE PACK CHECK →', '/tools/customs-document-pack-check/'] },
  },
  {
    family: 'guide',
    path: '/guides/customs-data-validation/',
    crumb: 'Customs data validation',
    ref: 'GUIDE 57 · DATA VALIDATION',
    eyebrow: 'GUIDE · CUSTOMS DATA VALIDATION',
    title: 'Customs data validation: check before you file',
    description: 'How to validate customs data across documents, rules, review and the CDS schema, with worked UK examples and the checks Declarix runs on every job.',
    h1: 'Validate customs data across documents, checks and review',
    standfirst: 'Validation is not one step. It is four layers: the documents agree, the data passes the rules, a person decides the judgement calls, and the compiled declaration passes the schema.',
    stamp: 'FOUR\nLAYERS',
    schemaType: 'TechArticle',
    publishedOn: PUBLISHED,
    reviewedOn: CHECKED,
    strip: ['CROSS-DOCUMENT', 'RULES AND CODE LISTS', 'REVIEW AND SCHEMA'],
    answer: 'Customs data validation checks a declaration’s data in four layers before filing: the source documents must agree, the data must pass customs rules and code lists, a person must decide the judgement calls, and the compiled declaration must pass the CDS schema. Declarix runs 124 named checks across these layers and turns every failure into a flag with evidence and a next step.',
    blocks: [
      {
        label: '01 · FOUR LAYERS',
        title: 'Each layer catches a different mistake.',
        table: {
          caption: 'The four layers of customs data validation',
          head: ['Layer', 'What it catches', 'Example'],
          rows: [
            ['1 · Cross-document', 'Documents that disagree', 'Invoice 2,400 PCS, packing list 2,200 PCS on line 1'],
            ['2 · Rules and code lists', 'Data that breaks a customs rule or format', 'XI EORI without 12 or 15 digits; invoice total not equal to the sum of lines'],
            ['3 · Human review', 'Judgement calls a rule cannot settle', 'Which commodity code applies under GIR 3a'],
            ['4 · Schema preflight', 'A compiled declaration CDS would reject on structure', 'Package type “Cartons” instead of the code “CT”'],
          ],
        },
      },
      {
        label: '02 · ONE COMMON RECORD',
        title: 'Validate the job, not one document.',
        paragraphs: [
          'Start by building one record from all the documents, keeping every competing value and its source. If you validate the invoice alone, a weight error that only shows against the bill of lading slips through.',
          'Declarix keeps both values when sources disagree and applies an authority order: the invoice for value and description, the packing list for quantity and weight. A tolerance of 0.5% stops rounding noise from becoming work.',
        ],
      },
      {
        label: '03 · THE CHECKS',
        title: 'What a thorough validation covers.',
        table: {
          caption: 'Main check families Declarix runs on a GB import',
          head: ['Family', 'Examples', 'Count'],
          rows: [
            ['Cross-document, per goods line', 'Quantity, net and gross weight, packages, item and line value, description', '7'],
            ['Maths and weights', 'Invoice adds up, CIF/FOB build-up reconciles, gross not below net', '10'],
            ['Valuation and Incoterms', 'Freight counted twice, Incoterm against charges, valuation method code', '8'],
            ['Commodity code', 'Present, well formed, checked against the description with GIR reasoning', '5'],
            ['Origin and preference', 'Origin on every line, ISO codes, preference needs proof', '8'],
            ['EORI and parties', 'GB and XI EORI formats, importer and exporter present', '7'],
            ['CDS data elements and code lists', 'Procedure codes, transport mode, goods location, currency, country', '15'],
            ['Controls and screening', 'Sanctions, licences, trade remedies, quotas, product compliance', '26'],
            ['Pack gates', 'Hard stops no clerk can override', '8'],
            ['Schema', 'Compiled CDS XML against the CDS schema', '1'],
          ],
        },
        after: [
          'Some checks sit in two families; Declarix runs 124 distinct named checks in total, and many repeat on every goods line. Valuation checks follow HMRC’s guidance on [working out the customs value of your imported goods](https://www.gov.uk/government/collections/working-out-the-customs-value-of-your-imported-goods).',
        ],
      },
      {
        label: '04 · WHEN A CHECK FAILS',
        title: 'A failure is the start of a decision.',
        steps: [
          ['Read the evidence', 'Open both sources and the extracted quotes before changing anything.'],
          ['Decide', 'Accept, edit, override with a reason, waive a non-blocking issue, or escalate.'],
          ['Ask', 'If the fact is missing, send a customer query that names the document and who provides it.'],
          ['Count the check that could not run', 'A check that cannot run is a failure, not a pass. Declarix counts it and holds the pack.'],
        ],
        figure: {
          ...screens.issues,
          alt: 'Declarix issue tasks showing a transport mode conflict blocker, a CDS schema error with a controlled fix, and a cross-document net weight mismatch with both document values.',
          caption: `${DEMO} Three failed checks, each with its evidence and next step.`,
        },
      },
      {
        label: '05 · AFTER A CHANGE',
        title: 'Validate again on the current data.',
        paragraphs: [
          'When the customer sends a corrected invoice, run every layer again. Declarix creates a new snapshot and ties release to it, so an earlier pass or approval never clears data it did not see.',
          'The final layer is [CDS preflight](/features/cds-preflight/): the compiled declaration is checked against the CDS schema and each error is mapped back to its field and source. Filing and HMRC’s response stay with your team and your customs system.',
        ],
      },
    ],
    faqs: [
      ['What is customs data validation?', 'It is checking a declaration’s data against the documents, customs rules, human review and the CDS schema before filing.'],
      ['How many checks does Declarix run?', 'Declarix runs 124 distinct named checks, many of them on every goods line.'],
      ['Is schema validation enough?', 'No, a schema-valid declaration can still carry a wrong weight or value, so all four layers matter.'],
      ['What happens when a check cannot run?', 'Declarix treats it as a failure, counts it and holds the pack.'],
      ['Do we need to revalidate after a correction?', 'Yes, every change triggers a fresh check on the current data.'],
    ],
    related: [
      ['CDS preflight checks', '/features/cds-preflight/', 'The schema layer in detail.'],
      ['Customs exception management', '/features/customs-exception-management/', 'How failures become flags and queries.'],
      ['Customs declaration document checklist', '/guides/customs-declaration-document-checklist/', 'The documents behind the data.'],
      ['Customs value, duty and VAT calculator', '/tools/customs-value-import-duty-vat-calculator/', 'Work through a valuation.'],
      ['All guides', '/guides/', 'More practical guides for customs desks.'],
    ],
    sources: [gov.completion, gov.valuation, gov.commodityCodes],
    cta: { ...numbersCta, title: 'Run 124 checks before your clerk starts.', secondary: ['SEE ALL FEATURES →', '/features/'] },
  },
]

export const guideHub = {
  family: 'hub',
  path: '/guides/',
  ref: 'INDEX · GUIDES',
  title: 'Customs desk guides | Declarix',
  description: 'Practical guides for UK customs brokers and forwarders: document checklists, data validation and automating preparation without changing software.',
  eyebrow: 'GUIDES · PRACTICAL WORK FOR CUSTOMS DESKS',
  h1: 'Guides for a faster, cleaner customs desk.',
  standfirst: 'Step-by-step guides written for UK brokers and forwarders, with worked examples, CDS data elements and links to the HMRC source.',
  stamp: 'SOURCED\nAND DATED',
  schemaType: 'CollectionPage',
  publishedOn: PUBLISHED,
  reviewedOn: CHECKED,
  strip: ['WORKED UK EXAMPLES', 'CDS DATA ELEMENTS', 'HMRC SOURCES LINKED'],
  answer: 'These guides help a UK customs desk prepare declarations faster and with fewer errors. Each one gives a direct answer, a worked example, the relevant CDS data elements and links to the HMRC source, then shows where Declarix takes the manual work off the clerk.',
  indexLabel: 'THREE GUIDES',
  indexTitle: 'Start with the question you have today.',
  items: [
    { name: 'Automate customs without changing software', path: '/guides/automate-customs-without-changing-software/', summary: 'Keep your filing system and automate the preparation before it.' },
    { name: 'Customs declaration document checklist', path: '/guides/customs-declaration-document-checklist/', summary: 'Core and conditional documents for a UK import, and the checks between them.' },
    { name: 'Customs data validation', path: '/guides/customs-data-validation/', summary: 'Four layers of checks, from cross-document to the CDS schema.' },
  ],
  blocks: [
    {
      label: '01 · MORE REFERENCE',
      title: 'Checklists, tools and research.',
      list: [
        'Work through a valuation with the [customs value, duty and VAT calculator](/tools/customs-value-import-duty-vat-calculator/).',
        'Check a pack before it reaches the desk with the free [customs document pack check](/tools/customs-document-pack-check/).',
        'See how delivery terms change the customs value in the [Incoterms reference](/customs-reference/incoterms/).',
        'Follow source-verified CDS changes in the [CDS Operations Radar](/research/cds-operations-radar/).',
        'Use the [GMR and GVMS checklist](/customs-workflows/gmr-gvms-checklist/) for roll-on roll-off movements.',
      ],
    },
    {
      label: '02 · HOW WE WRITE THEM',
      title: 'Sourced, dated and corrected in the open.',
      paragraphs: [
        'Every guide links its HMRC and GOV.UK sources with the date they were checked, and carries a reviewed date. Read the [editorial policy](/editorial-policy/) for how Declarix sources, reviews and corrects public guidance.',
      ],
    },
  ],
  related: [
    ['Declarix features', '/features/', 'Intake, exceptions, approval, audit trail and preflight.'],
    ['How Declarix works', '/how-it-works/', 'The operating flow in five steps.'],
    ['The one-job pilot', '/pilot/', 'Prove it on your own documents.'],
  ],
  cta: { ...numbersCta, secondary: ['SEE ALL FEATURES →', '/features/'] },
}

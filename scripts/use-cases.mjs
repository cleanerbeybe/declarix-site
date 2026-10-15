// Use cases, audience pages and the entry-checking category page (SEO lane L6, 15 October 2026).
// Content sources: live site copy (routes.mjs, src/data.ts, src/App.tsx), the product feature list
// (/data/orchestrator-100k/research/pain/FEATURES.md, LIVE rows only), the customer-request workflow
// (product PRs 464/465, reused from feat/customer-request-pages-20260916) and the fictional worked
// example v3 (8 October 2026). Prices come from pricing.mjs only.
import { packages, priceForVolume } from './pricing.mjs'
import { organizationNode, registeredPaths } from './site-graph.mjs'
import { calculateRoi } from './roi-calculator.mjs'

const REVIEWED_ON = '2026-10-15'
const PROOF = 'Up to 3× more declarations per clerk'

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const linkPattern = /\[([^\]]+)\]\((\/[^)\s]*)\)/g
// Inline [anchor](/path/) marks inside already-built HTML blocks.
const links = (html) => html.replace(linkPattern, '<a href="$2" data-usecase-related="inline">$1</a>')

// Escaped text with two small inline marks: [anchor](/path/) and **bold**.
function md(value) {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, '<a href="$2" data-usecase-related="inline">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

const money = (value) => `£${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
const rate = (value) => `£${value.toFixed(2)}`
const whole = (value) => Math.round(value).toLocaleString('en-GB')

const checked = '2026-10-15'
const sources = {
  cds: { title: 'Customs Declaration Service', publisher: 'HM Revenue & Customs', url: 'https://www.gov.uk/government/collections/customs-declaration-service', checked },
  vol3: { title: 'CDS Declaration Completion Instructions for Imports', publisher: 'HM Revenue & Customs', url: 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide', checked },
  appoint: { title: 'Get someone to deal with customs for you', publisher: 'HM Revenue & Customs', url: 'https://www.gov.uk/guidance/appoint-someone-to-deal-with-customs-on-your-behalf', checked },
  importSteps: { title: 'Import goods into the UK: step by step', publisher: 'GOV.UK', url: 'https://www.gov.uk/import-goods-into-uk', checked },
  valuation: { title: 'Delivery costs to include in the customs value', publisher: 'HM Revenue & Customs', url: 'https://www.gov.uk/guidance/delivery-costs-to-include-in-the-customs-value', checked },
  indiaOrigin: { title: 'UK-India CETA origin declaration', publisher: 'Department for Business and Trade', url: 'https://www.gov.uk/government/publications/uk-india-ceta-origin-declaration', checked },
  eori: { title: 'Get an EORI number', publisher: 'GOV.UK', url: 'https://www.gov.uk/eori', checked },
  amend: { title: 'Amend or cancel a Customs Declaration Service import declaration', publisher: 'HM Revenue & Customs', url: 'https://www.gov.uk/guidance/amend-or-cancel-a-customs-declaration-service-import-declaration', checked },
  origin: { title: 'Get proof of origin for your goods', publisher: 'HM Revenue & Customs', url: 'https://www.gov.uk/guidance/get-proof-of-origin-for-your-goods', checked },
  commodity: { title: 'Using commodity codes and related additional codes in the Customs Declaration Service', publisher: 'HM Revenue & Customs', url: 'https://www.gov.uk/guidance/using-commodity-codes-and-related-additional-codes-in-the-customs-declaration-service', checked },
  standard: { title: 'Standard for Customs Intermediaries', publisher: 'HM Revenue & Customs', url: 'https://www.gov.uk/government/publications/standard-for-customs-intermediaries', checked },
  developers: { title: 'Software developers providing customs declaration software', publisher: 'HM Revenue & Customs', url: 'https://www.gov.uk/guidance/list-of-software-developers-providing-customs-declaration-support', checked },
}

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

const desk = packages.find((tier) => tier.name === 'Desk')
const calculatorExample = calculateRoi({ volume: 1000, currentMinutes: 24, withDeclarixMinutes: 8, clientFee: '', captureRate: '' })
const smallDeskExample = calculateRoi({ volume: 150, currentMinutes: 24, withDeclarixMinutes: 8, clientFee: '', captureRate: '' })

const fictionalShipment = {
  label: 'WORKED EXAMPLE',
  note: 'Worked example. Each of the eight faults is caught by a named Declarix check.',
}

const shipmentFlags = [
  ['1', 'Quantity does not match', 'Invoice line 1: 2,400 PCS', 'Packing list line 1: 2,200 PCS', 'GOODS_RECONCILIATION_QUANTITY', 'Ask the shipper how many shipped. If 2,200, the invoice and the customs value change, so ask for a corrected invoice.'],
  ['2', 'Gross weight does not match', 'Bill of lading: 2,140.000 KGS', 'Packing list total: 1,805.0 kg', 'GOODS_RECONCILIATION_GROSS_WEIGHT_KG', '335.0 kg apart, and line 3 has no weight. Ask the shipper to confirm the total gross weight.'],
  ['3', 'Carton count differs from the B/L', 'Bill of lading: 118 CARTONS', 'Packing list total: 120 ctns', 'GOODS_RECONCILIATION_PACKAGE_COUNT', 'Ask the shipper to confirm the carton count before the entry is keyed.'],
  ['4', 'Net and gross mass missing on line 3', 'Packing list line 3: no net, no gross', 'Invoice totals: net 1,995.0 kg vs list 1,710.0 kg', 'REQUIRED_VALUE_MISSING · DE 6/1 · DE 6/5', 'Net mass (DE 6/1) is needed on every goods item, and gross mass (DE 6/5) on the header or every item. Ask for both for line 3.'],
  ['5', 'Goods description conflicts', 'Invoice line 2: Cotton bed sheets, double, plain white', 'Packing list line 2: Textile goods', 'GOODS_RECONCILIATION_DESCRIPTION', 'Ask the shipper to confirm the goods on line 2 and correct the packing list to match.'],
  ['6', 'Preference claimed, no proof of origin', 'Email: “Please claim UK–India preference”', 'Invoice: “Country of origin: India” only; line 3 origin blank', 'ORIGIN_CERTIFICATE_NEEDED · GOODS_ORIGIN_PRESENT', 'A preference claim needs its proof of origin. Ask the exporter for an origin declaration under the UK–India CETA (or a certificate of origin), and the origin of line 3.'],
  ['7', 'GB EORI is not valid', 'Invoice consignee: GB 1028 4471 093', 'Rule: GB + 12 or 15 digits', 'GB_EORI_FORMAT', 'One digit short. Ask the importer for its full GB EORI.'],
  ['8', 'EXW: costs to the UK border missing', 'Invoice terms: EXW Karur (Incoterms 2020)', 'Bill of lading: FREIGHT COLLECT, no cost figures in the pack', 'CONDITIONAL_VALUE_MISSING · DE 4/9', 'On EXW, the customs value adds transport, loading and handling, and insurance up to the UK border. Ask for each cost.'],
]

function flagTable(rows = shipmentFlags, caption = 'The eight flags Declarix raises on the Harbourline shipment') {
  return `<div class="uc-table-wrap" tabindex="0" role="region" aria-label="${escapeHtml(caption)}"><table class="uc-table uc-flags"><caption>${escapeHtml(caption)}</caption><thead><tr><th scope="col">#</th><th scope="col">Flag</th><th scope="col">Source A</th><th scope="col">Source B</th><th scope="col">What the clerk asks next</th></tr></thead><tbody>${rows
    .map(([n, title, a, b, check, next]) => `<tr><td><span class="uc-pin">${n}</span></td><th scope="row">${escapeHtml(title)}<small>${escapeHtml(check)}</small></th><td>${escapeHtml(a)}</td><td>${escapeHtml(b)}</td><td>${escapeHtml(next)}</td></tr>`)
    .join('')}</tbody></table></div>`
}

function exhibit(page, alt, caption) {
  return `<figure class="uc-exhibit"><img src="/exhibits/worked-example-v3-page-${page}.jpg" width="1000" height="1415" loading="lazy" decoding="async" alt="${escapeHtml(alt)}" /><figcaption><span>WORKED EXAMPLE · PAGE ${page} OF THE DECLARIX WORKED EXAMPLE</span>${escapeHtml(caption)}</figcaption></figure>`
}

const shipmentEmail = {
  from: [
    ['7', 'Your full GB EORI number. The invoice shows GB 1028 4471 093, which is one digit short.'],
    ['8', 'The goods were sold EXW Karur, so the customs value must include every cost up to the UK border. Please send the inland haulage from Karur to Chennai, the export handling and loading at Chennai, the sea freight to Felixstowe, and the insurance. (If we booked the sea freight, we will add our own figure.)'],
  ],
  supplier: [
    ['1', 'Towels, line 1: the invoice says 2,400 pieces, the packing list 2,200. How many shipped? If 2,200, we need a corrected invoice.'],
    ['4', 'Cushion covers, line 3: the net and gross weight. They are missing from the packing list.'],
    ['2', 'Total gross weight: the bill of lading says 2,140.0 kg, the packing list 1,805.0 kg. Please confirm the total once line 3 is added.'],
    ['3', 'Cartons: the bill of lading says 118, the packing list 120. Please confirm the count.'],
    ['5', 'Bed sheets, line 2: the packing list says “Textile goods”. Please confirm the goods and correct the packing list to match the invoice.'],
    ['6', 'Preference: to claim UK–India preference we need an origin declaration under the UK–India CETA (on the agreement’s template, sent with the invoice), and the country of origin for line 3.'],
  ],
}

function emailDraft({ fromLabel = 'From you', supplierLabel = 'From your supplier (please forward this part to Amaravathi Home Textiles Pvt. Ltd.)', only } = {}) {
  const items = (list, start) => list.map(([flag, text], index) => `<li><span class="uc-q-n">${start + index}.</span><span>${escapeHtml(text)}</span><span class="uc-pin" aria-label="Flag ${flag}">${flag}</span></li>`).join('')
  const from = `<p class="uc-mail-group">${escapeHtml(fromLabel)}</p><ol class="uc-mail-items">${items(shipmentEmail.from, 1)}</ol>`
  const supplier = `<p class="uc-mail-group">${escapeHtml(supplierLabel)}</p><ol class="uc-mail-items">${items(shipmentEmail.supplier, 3)}</ol>`
  return `<div class="uc-mail"><div class="uc-mail-bar">DRAFT · READY FOR YOUR CLERK TO CHECK AND SEND</div><div class="uc-mail-head"><p><span>TO</span>Harbourline Imports Ltd, import desk</p><p><span>SUBJECT</span>B/L CSL/MAA/FXT/26/04471: 8 details needed before we can clear</p></div><div class="uc-mail-body"><p>Hello,</p><p>We are preparing the customs entry for your shipment from Amaravathi Home Textiles Pvt. Ltd. (B/L CSL/MAA/FXT/26/04471, due into Felixstowe). Before we can clear it, we need the following.</p>${only === 'importer' ? from : `${from}${supplier}`}<p>As soon as these are in, we will complete the entry.</p></div></div>`
}

function shipmentDocuments() {
  return `<div class="uc-docs">
    <div class="uc-doc"><p class="uc-doc-title">COMMERCIAL INVOICE · AHT/EXP/26-27/0418</p><dl><dt>Seller</dt><dd>Amaravathi Home Textiles Pvt. Ltd., Karur, India</dd><dt>Consignee</dt><dd>Harbourline Imports Ltd, Leicester · EORI GB 1028 4471 093 <span class="uc-pin">7</span></dd><dt>Terms</dt><dd>EXW Karur (Incoterms 2020) <span class="uc-pin">8</span></dd><dt>Lines</dt><dd>1 · Cotton terry bath towels · 2,400 PCS <span class="uc-pin">1</span> × £3.10 = £7,440.00<br />2 · Cotton bed sheets, double, plain white · 1,200 PCS × £6.80 = £8,160.00<br />3 · Cotton cushion covers · origin blank <span class="uc-pin">6</span> · 3,000 PCS × £1.45 = £4,350.00</dd><dt>Total</dt><dd>£19,950.00 · 120 cartons · gross 2,140.0 kg · net 1,995.0 kg</dd></dl></div>
    <div class="uc-doc"><p class="uc-doc-title">PACKING LIST · SAME REFERENCE</p><dl><dt>Line 1</dt><dd>Towels · 55 ctns · 2,200 PCS <span class="uc-pin">1</span> · net 990.0 · gross 1,045.0 kg</dd><dt>Line 2</dt><dd>Textile goods <span class="uc-pin">5</span> · 40 ctns · 1,200 PCS · net 720.0 · gross 760.0 kg</dd><dt>Line 3</dt><dd>Cushion covers · 25 ctns · 3,000 PCS · net and gross blank <span class="uc-pin">4</span></dd><dt>Total</dt><dd>120 ctns <span class="uc-pin">3</span> · net 1,710.0 kg · gross 1,805.0 kg <span class="uc-pin">2</span></dd></dl></div>
    <div class="uc-doc"><p class="uc-doc-title">BILL OF LADING · CSL/MAA/FXT/26/04471</p><dl><dt>Route</dt><dd>Chennai, India → Felixstowe, UK · MV Coromandel Star</dd><dt>Packages</dt><dd>118 CARTONS <span class="uc-pin">3</span> · Cotton home textiles</dd><dt>Gross weight</dt><dd>2,140.000 KGS <span class="uc-pin">2</span></dd><dt>Freight</dt><dd>FREIGHT COLLECT <span class="uc-pin">8</span></dd></dl></div>
  </div>`
}

// ---------------------------------------------------------------------------
// Page definitions
// ---------------------------------------------------------------------------

const hub = {
  kind: 'hub',
  path: '/use-cases/',
  shortName: 'Use cases',
  title: 'Use cases for UK customs desks | Declarix',
  description: 'How UK customs brokers, freight forwarders and importers use Declarix to check documents, chase missing facts and build CDS-ready entry packs.',
  eyebrow: 'USE CASES · BY TEAM AND BY JOB',
  ref: 'REGISTER 13 · USE CASES',
  stamp: 'CHECK\nNOT KEY',
  h1: 'Find the Declarix workflow that fits your desk.',
  standfirst: 'Declarix sits in front of the software you already file in. Pick the team or the job that costs your desk the most time, and see the workflow before and after Declarix, with worked UK examples.',
  answer: {
    q: 'What do customs teams use Declarix for?',
    a: [
      'UK customs teams use Declarix to turn the documents a customer sends into a checked, CDS-ready entry pack before anyone keys a line. Every job gets 120+ checks, every flag points to its source document and line, customer queries come pre-drafted, and your clerk approves and files in Sequoia, Descartes e-Customs or your own system.',
      'The result is simple: up to 3× more declarations per clerk, no new headcount and more margin on every declaration.',
    ],
  },
  sources: [sources.cds, sources.appoint, sources.developers],
  faqs: [
    ['Which use case should we start with?', 'Start with the job your team hates most, usually long document-heavy imports where the invoice, packing list and bill of lading disagree. The 20-minute numbers call picks the first workflow most likely to pay for itself.'],
    ['Do we need to change our customs software?', 'No. Declarix works in front of Sequoia, Descartes e-Customs or a mapped customer integration, and your team keeps the filing screen, badge and permissions it already knows.'],
    ['Who files the declaration?', 'Your authorised clerk files it in your existing customs system, because Declarix prepares and checks the entry and never submits to HMRC.'],
    ['How do we prove the workflow on our own jobs?', '£0 upfront. £1 per declaration, capped at £500. The pilot fee is fully waived if the agreed success criteria are missed.'],
  ],
  cta: { title: 'Bring your hardest job to the numbers call.', copy: 'Bring weekly volume, current minutes per declaration, loaded clerk cost and the system your team files through. Leave with an ROI estimate, the integration route and the first workflow to run.' },
}

const brokers = {
  kind: 'usecase',
  group: 'team',
  path: '/use-cases/customs-brokers/',
  shortName: 'Customs brokers',
  title: 'Customs software for brokers: CDS-ready packs | Declarix',
  description: 'Customs software for UK brokers: 120+ checks on every job, drafted customer queries and CDS-ready packs for Sequoia or Descartes. Up to 3× per clerk.',
  eyebrow: 'USE CASE · CUSTOMS BROKERS',
  ref: 'CASE 01 · BROKER DESK',
  stamp: 'MORE JOBS\nSAME DESK',
  h1: 'Customs software for brokers: check the entry, skip the keying.',
  standfirst: 'Your customers send emails, PDFs, scans and spreadsheets. Declarix turns each job into a checked, CDS-ready entry pack, so your clerks review and approve instead of building every field by hand.',
  card: 'Every job checked and built before a clerk opens it. Your team approves and files in the system it already uses.',
  answer: {
    q: 'What should customs software for brokers do?',
    a: [
      'Customs software for brokers should take the job as the customer sent it, build the entry data, check it and hand your clerk a pack to approve. Declarix does exactly that for UK brokers. Every job gets 120+ checks, every flag points to its source line, customer queries arrive pre-drafted, and the CDS-ready pack goes into Sequoia, Descartes e-Customs or your own system.',
      'Your clerk keeps the customs judgement and the filing. Declarix removes the keying and the cross-checking that sit in front of it. That is how a desk reaches up to 3× more declarations per clerk with no new headcount.',
    ],
  },
  compare: [
    ['Intake', 'The customer emails PDFs, scans and a spreadsheet. A clerk opens every file to see what arrived.', 'The whole job goes in as it arrived: emails, PDFs, scans, phone photos and spreadsheets. Declarix sorts each document by type.'],
    ['Keying', 'The clerk re-keys parties, values, weights, packages and every goods line into Sequoia or Descartes.', 'Declarix builds the entry data and pins each proposed value to its document, page and line. Typical processing is around 200 seconds.'],
    ['Cross-checks', 'Invoice against packing list against bill of lading, by eye, as time allows.', '120+ checks run the same way on every job, line by line: quantities, weights, values, Incoterms, origin, EORI, CDS data elements, sanctions and licences.'],
    ['Missing facts', 'The clerk finds a gap halfway through keying, sends an RFI, waits, then finds the next gap.', 'Every gap goes into one drafted customer query on the first pass, split by who has to act. Replies are matched back to the open query.'],
    ['Approval', 'A senior clerk re-reads the entry against the paperwork.', 'Junior clerks clear routine items. Senior clerks sign the judgement calls. Every decision is logged against who made it.'],
    ['Filing', 'Submitted from your customs system.', 'Submitted from the same system, with the same badge and permissions. Declarix never submits to HMRC.'],
  ],
  steps: [
    ['01', 'Forward the job', 'Send the customer’s email and attachments exactly as they arrived. No template, no re-typing, no tidy-up first.'],
    ['02', 'Declarix builds and checks', 'The documents are read together. Parties, values, weights, packages, origin and goods lines move into their entry rows, and 120+ checks run on the result.'],
    ['03', 'Your clerk reviews the flags', 'Each flag shows both sources side by side, the check that raised it and the next step. Clean jobs go to a quick check; doubtful ones go to full review.'],
    ['04', 'The customer query goes out', 'Anything missing is already written up as one numbered email. Your clerk checks it and sends it.'],
    ['05', 'Approve and file', 'Your clerk approves the CDS-ready pack and files it in Sequoia, Descartes e-Customs or your own system, as today.'],
  ],
  example: () => `<section class="uc-block uc-example" aria-labelledby="broker-example"><span class="section-label">${fictionalShipment.label}</span><h2 id="broker-example">Three documents in. Eight flags, one email, one pack out.</h2><p>A new supplier in Karur sends a commercial invoice, a packing list and a bill of lading for three lines of home textiles, sold EXW and landing at Felixstowe for an importer in Leicester. On a manual desk, the clerk keys the entry first and discovers the problems one by one. With Declarix, the clerk opens a pack that already shows all eight.</p>${flagTable(shipmentFlags.slice(0, 4), 'First four of eight flags on the Harbourline shipment')}<p>The other four cover the goods description, a preference claim with no proof of origin, a GB EORI that is one digit short and missing EXW freight costs. [See all eight flags traced to their source lines](/use-cases/invoice-packing-list-reconciliation/).</p><p class="uc-note">${escapeHtml(fictionalShipment.note)}</p></section>`,
  proof: true,
  faqs: [
    ['Do we have to replace Sequoia or Descartes?', 'No. Declarix sits in front of the system you file in and hands it a CDS-ready pack, so your team keeps the filing screen, badge and permissions it already knows.'],
    ['Who files the declaration?', 'Your clerk does, in your own customs system, because Declarix prepares and checks the entry and never submits to HMRC.'],
    ['Which documents can Declarix read?', 'It reads invoices, packing lists, bills of lading, certificates of origin and other customs documents, whether they arrive as emails, PDFs, scans, phone photos or spreadsheets.'],
    ['How fast is it?', 'Typical Declarix processing is around 200 seconds before clerk review.'],
    ['What does it cost?', 'Desk is £500/month for 100 packs, Team is £4,000/month for 1,000 packs, and Scale is £9,000/month for 3,000 packs. Extra packs cost the same per-pack rate as your package, never below £3.00.'],
    ['How do we test it on our own work?', '£0 upfront. £1 per declaration, capped at £500. The pilot fee is fully waived if the agreed success criteria are missed.'],
  ],
  related: ['/customs-entry-checking-software/', '/use-cases/invoice-packing-list-reconciliation/', '/use-cases/customer-document-requests/', '/use-cases/customs-team-review/', '/for/small-customs-brokerages/', '/use-cases/freight-forwarders/', '/customs-clearance-software/', '/compare/', '/alternatives/', '/roi-calculator/', '/pilot/'],
  sources: [sources.appoint, sources.vol3, sources.standard],
}

const forwarders = {
  kind: 'usecase',
  group: 'team',
  path: '/use-cases/freight-forwarders/',
  shortName: 'Freight forwarders',
  title: 'Customs document workflow for freight forwarders | Declarix',
  description: 'Freight forwarders use Declarix to check invoices against bills of lading, chase shippers in one email and send CDS-ready packs to their filing software.',
  eyebrow: 'USE CASE · FREIGHT FORWARDERS',
  ref: 'CASE 02 · FORWARDER DESK',
  stamp: 'PEAK\nREADY',
  h1: 'Freight forwarders: keep customs moving with the system you have.',
  standfirst: 'Shipments arrive with documents from shippers, carriers and customers in every format. Declarix checks them against each other and the transport documents, then returns a CDS-ready pack your customs desk approves and files.',
  card: 'Commercial documents checked against the B/L, AWB or CMR, shippers chased in one email, packs ready for peak season.',
  answer: {
    q: 'How does Declarix fit a freight forwarder’s customs workflow?',
    a: [
      'A forwarder’s customs desk loses most of its time between the shipment documents arriving and the entry being ready to file. Declarix closes that gap. It reads the commercial invoice, packing list and bill of lading, air waybill or CMR together, flags every conflict against the transport documents, drafts the queries for your customer and their supplier, and returns a CDS-ready pack for your existing filing software.',
      'No transport-system project is needed. Forward the job, get the checked pack back, and let your customs team approve and file. In peak season the same team handles up to 3× more declarations per clerk.',
    ],
  },
  compare: [
    ['Shipment documents', 'Invoice, packing list and transport document arrive from three parties, at different times, in different formats.', 'Declarix reads them as one job and checks that the transport document chain (B/L, AWB or CMR) is complete.'],
    ['Transport cross-check', 'The clerk compares cartons and gross weight on the B/L with the packing list, if there is time.', 'Package count and gross weight are checked line by line against the bill of lading, and the declared transport mode is checked against the transport ID and ports.'],
    ['Freight in the customs value', 'On EXW and FCA buys, the clerk has to remember to add freight and insurance to the UK border.', 'An Incoterm that excludes freight raises a flag for the missing costs (DE 4/9), with the drafted question for each cost.'],
    ['Shipper queries', 'The customer forwards questions to the supplier one at a time, and each round trip costs a day.', 'One email, split into “from you” and “from your supplier”, so the customer forwards the supplier part in one go.'],
    ['Peak volume', 'Extra entries mean overtime, temporary staff or turning work away.', 'Clerks check packs instead of building entries, so the same desk takes on more declarations without hiring.'],
    ['Filing', 'Through your customs software and badge.', 'Through the same software and badge. Declarix never submits to HMRC.'],
  ],
  steps: [
    ['01', 'Forward the shipment file', 'Send the booking email with the invoice, packing list and transport document attached, as they landed.'],
    ['02', 'Declarix checks the paperwork against the move', 'Cartons, weights, transport mode and ports are checked against the B/L, AWB or CMR, and the commercial documents against each other.'],
    ['03', 'Queries go to the right party', 'Importer items and supplier items are drafted in one email, ready for your clerk to check and send.'],
    ['04', 'The pack is built', 'Once the facts are in, the CDS-ready pack carries every value with its source document, page and line.'],
    ['05', 'Your customs team files', 'Your clerk approves and files in Sequoia, Descartes e-Customs or your own system.'],
  ],
  example: () => `<section class="uc-block uc-example" aria-labelledby="forwarder-example"><span class="section-label">${fictionalShipment.label}</span><h2 id="forwarder-example">One sea shipment, three transport flags.</h2><p>In the Harbourline shipment from Chennai to Felixstowe, three of the eight flags come from the transport side of the file. A forwarder’s desk would usually find these only after keying, or when the goods are already at the port.</p>${flagTable([shipmentFlags[1], shipmentFlags[2], shipmentFlags[7]], 'Transport-side flags on the Harbourline shipment')}<p>The freight flag matters most to a forwarder. If you booked the sea freight, your own figure goes into the customs value. The drafted email says exactly that, so the customer only sends the costs you do not already hold. [See how the full eight-flag example is reconciled](/use-cases/invoice-packing-list-reconciliation/).</p><p class="uc-note">${escapeHtml(fictionalShipment.note)}</p></section>`,
  extra: () => `<section class="uc-block" aria-labelledby="forwarder-border"><span class="section-label">MORE THAN THE ENTRY</span><h2 id="forwarder-border">The customs entry is one handoff among several.</h2><p>Forwarders also manage the movement around the declaration. Keep these checklists beside the Declarix pack:</p><ul class="uc-list"><li>[GMR and GVMS checklist](/customs-workflows/gmr-gvms-checklist/) for roll-on roll-off moves.</li><li>[ENS and ICS2 entry summary checklist](/customs-workflows/ens-ics2-entry-summary-declaration-checklist/) for safety and security data.</li><li>[Postponed VAT accounting checklist](/customs-workflows/postponed-vat-accounting-checklist/) for importer VAT treatment.</li><li>[Incoterms sheets](/customs-reference/incoterms/) to see which costs belong in the customs value.</li></ul></section>`,
  proof: true,
  faqs: [
    ['Does Declarix need to connect to our transport management system?', 'No. Declarix works from the shipment documents themselves, so you forward the job and get the checked pack back, and the route into your filing software is mapped on the numbers call.'],
    ['Does it handle air and road as well as sea?', 'Yes. The transport document check covers the bill of lading, air waybill or CMR, and the declared transport mode is checked against the transport ID and ports.'],
    ['What happens on EXW or FCA shipments?', 'Declarix flags any freight, handling or insurance costs that the delivery terms leave out of the customs value, and drafts the question for each cost.'],
    ['Can we use it only in peak season?', 'Yes. Packages are month to month, so you can size the allowance to the volume you expect.'],
    ['Who files the entry?', 'Your customs clerk files it with your own badge and software, because Declarix never submits to HMRC.'],
  ],
  related: ['/use-cases/customs-brokers/', '/use-cases/invoice-packing-list-reconciliation/', '/use-cases/customer-document-requests/', '/customs-entry-checking-software/', '/customs-workflows/gmr-gvms-checklist/', '/best-customs-software/', '/how-it-works/', '/pilot/'],
  sources: [sources.importSteps, sources.valuation, sources.vol3],
}

const reconciliation = {
  kind: 'usecase',
  group: 'job',
  path: '/use-cases/invoice-packing-list-reconciliation/',
  shortName: 'Invoice and packing list reconciliation',
  title: 'Invoice and packing list discrepancies, flagged | Declarix',
  description: 'Declarix compares the invoice, packing list and bill of lading on every goods line and flags each discrepancy with both sources. See a worked example.',
  eyebrow: 'USE CASE · INVOICE AND PACKING LIST RECONCILIATION',
  ref: 'CASE 03 · RECONCILIATION',
  stamp: 'LINE BY\nLINE',
  h1: 'Find every invoice and packing list mismatch before the entry is keyed.',
  standfirst: 'Quantities, weights, cartons, values and descriptions that disagree are the most common reason a customs job stalls. Declarix compares every goods line across the documents and shows each difference with both sources side by side.',
  card: 'Seven fields compared on every goods line across invoice, packing list and bill of lading, with a worked example.',
  answer: {
    q: 'What is an invoice and packing list discrepancy?',
    a: [
      'An invoice and packing list discrepancy is any difference between what the seller billed and what was packed: quantity, net or gross weight, carton count, value or goods description. Each one changes what goes on the customs declaration, so it has to be settled before filing.',
      'Declarix compares the commercial invoice, packing list and bill of lading on every goods line, seven fields per line. It flags each difference with both source lines side by side, names the check that raised it and drafts the question to the shipper.',
    ],
  },
  compare: [
    ['Comparing the documents', 'The clerk lays the invoice next to the packing list and ticks lines by eye.', 'Seven fields per goods line are compared automatically: quantity, net weight, gross weight, package count, item value, line value and description.'],
    ['Deciding which figure counts', 'Depends on the clerk’s habit.', 'A clear document-authority order: the invoice rules value and description, the packing list rules quantity and weight. Rounding differences within 0.5% are not flagged.'],
    ['Transport document', 'Often checked only when the goods are held.', 'Cartons and gross weight on the bill of lading are checked against the packing list on the same pass.'],
    ['Telling the shipper', 'A separate email per problem, written from scratch.', 'Each flag carries its next step, and all of them go into one drafted email.'],
    ['After the reply', 'The clerk re-reads the whole file.', 'The reply is matched back to its query, and changed evidence goes back for a fresh review before the pack is built.'],
  ],
  steps: [
    ['01', 'Read every line', 'Declarix extracts each goods line from the invoice, packing list and bill of lading, with its page and line.'],
    ['02', 'Match the lines', 'Lines are paired across documents, and seven fields are compared on each pair.'],
    ['03', 'Raise the difference', 'Each mismatch becomes one flag with both values, the check ID and the next step.'],
    ['04', 'Resolve or ask', 'Your clerk confirms the right figure from evidence, waives a minor flag with a reason, or sends the drafted query.'],
    ['05', 'Recheck the new evidence', 'A corrected invoice or packing list is checked again before the CDS-ready pack is built.'],
  ],
  example: () => `<section class="uc-block uc-example" aria-labelledby="recon-example"><span class="section-label">${fictionalShipment.label}</span><h2 id="recon-example">One shipment, as it arrives. Eight problems in plain sight.</h2><p>Three documents from a new supplier in Karur, forwarded as they landed: home textiles, three lines, sold EXW, landing at Felixstowe for an importer in Leicester. Try to spot the problems before you read the flags.</p>${shipmentDocuments()}<div class="uc-exhibits">${exhibit(3, 'Worked example page 3: the commercial invoice, packing list and bill of lading for the Harbourline shipment, with eight numbered pins on the conflicting values.', 'The three documents as they arrived, with a pin on each value Declarix flags.')}${exhibit(5, 'Worked example page 5: eight flag cards, each showing the two conflicting source values, the named Declarix check and the next step for the clerk.', 'Each flag traced to its source line, with the check that raised it and what the clerk asks next.')}</div><h3>The eight flags</h3>${flagTable()}<h3>Why flag 1 matters to the customs value</h3><p>Invoice line 1 bills 2,400 towels at £3.10, which is £7,440.00. If the packing list is right and 2,200 shipped, the line is worth £6,820.00. That is £620.00 off the item price, so the customs value, the duty and the import VAT all move. The clerk needs a corrected invoice before the entry is filed, not a post-clearance amendment afterwards.</p><h3>Why flags 2 and 4 belong together</h3><p>The bill of lading says 2,140.000 kg gross; the packing list says 1,805.0 kg, a gap of 335.0 kg. The packing list is also missing both weights for line 3, and the invoice’s own net total (1,995.0 kg) disagrees with the packing list (1,710.0 kg). Declarix raises both flags and drafts one question, so the shipper confirms line 3 and the total in a single reply.</p><p class="uc-note">${escapeHtml(fictionalShipment.note)}</p></section>`,
  extra: () => `<section class="uc-block" aria-labelledby="recon-authority"><span class="section-label">WHICH DOCUMENT WINS</span><h2 id="recon-authority">The document-authority order Declarix uses.</h2><div class="uc-table-wrap" tabindex="0" role="region" aria-label="Document authority by field"><table class="uc-table"><caption>Default source for each compared field, and where it lands on the CDS declaration</caption><thead><tr><th scope="col">Field</th><th scope="col">Leading document</th><th scope="col">Checked against</th><th scope="col">CDS data element</th></tr></thead><tbody><tr><th scope="row">Item price</th><td>Commercial invoice</td><td>Line arithmetic and invoice total</td><td>DE 4/14</td></tr><tr><th scope="row">Goods description</th><td>Commercial invoice</td><td>Packing list description</td><td>DE 6/8</td></tr><tr><th scope="row">Quantity</th><td>Packing list</td><td>Invoice quantity</td><td>Supports DE 4/14 and supplementary units</td></tr><tr><th scope="row">Net mass</th><td>Packing list</td><td>Invoice net total</td><td>DE 6/1</td></tr><tr><th scope="row">Gross mass</th><td>Packing list</td><td>Bill of lading and invoice</td><td>DE 6/5</td></tr><tr><th scope="row">Packages</th><td>Packing list</td><td>Bill of lading</td><td>DE 6/10</td></tr></tbody></table></div><p>Your clerk still decides. The order tells Declarix which value to propose; the flag shows the other value beside it, so the clerk can confirm or override with a recorded reason. Check the [free customs document pack check](/tools/customs-document-pack-check/) to see which documents a job needs before it reaches the desk.</p></section>`,
  proof: true,
  faqs: [
    ['Why do invoice and packing list quantities differ?', 'Usually because of a short or split shipment, an old invoice template, or different units such as sets against pieces, and the shipper is the only party who can confirm which is right.'],
    ['Which figure goes on the customs declaration?', 'The figure your clerk confirms from evidence: Declarix proposes the invoice for value and description and the packing list for quantity and weight, and shows the other value beside it.'],
    ['Does Declarix flag tiny rounding differences?', 'No. Differences within 0.5% are treated as rounding, so the flags your clerk sees are the ones worth a question.'],
    ['Can Declarix correct the documents?', 'Declarix drafts the question to the shipper; the shipper corrects the document, and the reply is matched back to the open query for your clerk to confirm.'],
    ['What does the worked example show?', 'It shows one Harbourline shipment from arrival to a CDS-ready pack, and each of its eight faults is caught by a named Declarix check.'],
  ],
  related: ['/use-cases/customs-data-entry/', '/use-cases/customer-document-requests/', '/customs-entry-checking-software/', '/use-cases/customs-brokers/', '/tools/customs-document-pack-check/', '/tools/customs-value-import-duty-vat-calculator/', '/pilot/'],
  sources: [sources.vol3, sources.valuation, sources.amend],
}

const requests = {
  kind: 'usecase',
  group: 'job',
  path: '/use-cases/customer-document-requests/',
  shortName: 'Customer document requests',
  title: 'Missing customs document requests, drafted | Declarix',
  description: 'Declarix turns every missing customs fact into one drafted customer query, split by who acts, and matches each reply back to the open request.',
  eyebrow: 'USE CASE · CUSTOMER DOCUMENT REQUESTS',
  ref: 'CASE 04 · CUSTOMER QUERIES',
  stamp: 'ONE\nEMAIL',
  h1: 'Ask for every missing customs fact in one email, on the first pass.',
  standfirst: 'Chasing customers for documents is the slowest part of most customs jobs. Declarix finds every gap before keying starts, writes the request for your clerk and keeps each reply tied to the question it answers.',
  card: 'Every gap in one drafted query, split by importer and supplier, with replies matched back to the request.',
  answer: {
    q: 'How should a customs desk request missing documents?',
    a: [
      'A customs missing-document request works best when it names the exact fact, the document and the line, and asks everyone at once. Declarix turns every gap it finds into one drafted customer query, split by who has to act, with a chaser ready for slow replies.',
      'Replies are matched back to the open query, and your clerk confirms the evidence before the request closes. One request, one round trip, and the job moves on.',
    ],
  },
  compare: [
    ['Finding the gaps', 'The clerk finds one gap while keying, then another an hour later.', 'All gaps are found before keying starts, on the first pass of 120+ checks.'],
    ['Writing the request', 'An ad-hoc email: “please send the missing documents”.', 'A numbered request that names each fact, the document and the line, written for your clerk to check and send.'],
    ['Who has to act', 'The customer has to work out which questions are for their supplier.', 'Items are split into “from you” and “from your supplier”, ready to forward.'],
    ['Slow replies', 'Someone has to remember to chase.', 'A chaser is drafted too, ready when the reply is slow.'],
    ['The reply', 'It lands in a shared inbox, and nobody is sure which question it answers.', 'The reply is matched back to the open query, and your clerk confirms it before the request is resolved.'],
  ],
  stepsTitle: 'Five states from gap to answer.',
  steps: [
    ['01', 'Draft', 'Declarix writes the request from the flags: each item names the fact that is missing and where it should be.'],
    ['02', 'Approve', 'An authorised operator checks the wording and the recipient before anything leaves the team.'],
    ['03', 'Send', 'Your clerk sends the request from your own mailbox and records it against the job.'],
    ['04', 'Reply', 'The customer’s answer or revised document is matched back to the exact request item it answers.'],
    ['05', 'Resolve', 'Your clerk confirms the returned evidence and resolves the request. The job moves on to approval.'],
  ],
  example: () => `<section class="uc-block uc-example" aria-labelledby="request-example"><span class="section-label">${fictionalShipment.label}</span><h2 id="request-example">The customer email, written before your clerk opens the job.</h2><p>For the Harbourline shipment, Declarix found eight gaps. All eight go into one email, numbered, with each item pointing back to its flag. Two items are for the importer; six are for the supplier, ready to forward.</p><div class="uc-split">${emailDraft()}${exhibit(6, 'Worked example page 6: the drafted customer email covering all eight flags, split into importer items and supplier items, with a chaser drafted for slow replies.', 'Eight of eight flags covered in one email, split by who acts, with a chaser ready too.')}</div><p class="uc-note">${escapeHtml(fictionalShipment.note)}</p></section>`,
  extra: () => `<section class="uc-block" aria-labelledby="request-lifecycle"><span class="section-label">WORKED EXAMPLE · ONE REQUEST, START TO FINISH</span><h2 id="request-lifecycle">From a missing Incoterm to a confirmed reply.</h2><p>Worked-example job DEMO-104 has an invoice with no Incoterm. This is how the request moves through Declarix.</p><ol class="uc-timeline">${[
    ['Draft', 'Broker', 'The broker drafts one item: “Please provide a revised commercial invoice showing the agreed Incoterm and named place.”'],
    ['Approved', 'Authorised operator', 'An authorised operator approves the wording and the recipient before the request leaves the team.'],
    ['Sent', 'Clerk', 'The clerk sends the request and records the send against the job.'],
    ['Replied', 'Customer', 'The customer returns a revised invoice, version 1, showing “FCA, Chennai warehouse”. It lands on the right request item, ready for the broker’s check.'],
    ['Resolved', 'Broker', 'The broker confirms that the revised invoice answers the item and resolves the request.'],
    ['Reopened for review', 'Customer, then broker', 'The customer later replaces the invoice with version 2, showing “DAP, Leeds warehouse”. Declarix sends the changed evidence back for a fresh review, and the earlier decision stays in the history.'],
  ].map(([state, actor, copy], index) => `<li><span class="uc-step-n">${String(index + 1).padStart(2, '0')}</span><div><p class="uc-state"><strong>${escapeHtml(state)}</strong> · ${escapeHtml(actor)}</p><p>${escapeHtml(copy)}</p></div></li>`).join('')}</ol><p>Every reply waits for your clerk’s confirmation, and a changed document always gets a fresh check. The audit trail keeps every version and every decision. Share the [importer’s guide to answering a broker request](/use-cases/importers/) with customers who want to get it right first time.</p></section>`,
  proof: true,
  faqs: [
    ['What should a missing-document request include?', 'Each item should name the missing fact, the document it belongs on and the goods line, so the customer can answer without calling you.'],
    ['Who sends the request?', 'Your clerk checks the drafted request and sends it from your own mailbox, so the customer hears from the broker they know.'],
    ['Does a reply close the request automatically?', 'No. Your clerk confirms the returned evidence first, so a wrong or partial attachment never clears a query.'],
    ['What if the customer sends a different document later?', 'Declarix treats the replacement as new evidence and sends it back for a fresh review, while the earlier decision stays in the history.'],
    ['Can the customer reply to several items at once?', 'Yes. Each answer is matched back to the request item it belongs to, so one reply can close several items.'],
  ],
  related: ['/use-cases/importers/', '/use-cases/invoice-packing-list-reconciliation/', '/use-cases/customs-team-review/', '/use-cases/customs-brokers/', '/customs-entry-checking-software/', '/how-it-works/', '/pilot/'],
  sources: [sources.appoint, sources.importSteps, sources.eori],
}

const dataEntry = {
  kind: 'usecase',
  group: 'job',
  path: '/use-cases/customs-data-entry/',
  shortName: 'Customs data entry',
  title: 'Customs data entry automation for CDS | Declarix',
  description: 'Declarix reads customs documents, maps every field to its CDS data element with its source line and runs 120+ checks. Your clerk checks, not types.',
  eyebrow: 'USE CASE · CUSTOMS DATA ENTRY',
  ref: 'CASE 05 · DATA ENTRY',
  stamp: 'NO\nRE-KEYING',
  h1: 'Stop re-keying invoices into CDS entries.',
  standfirst: 'Declarix reads the commercial documents, fills the declaration data and links every value to its source. Your clerk checks the entry instead of typing it.',
  card: 'Every field read from the documents, mapped to its CDS data element and linked to its source line.',
  answer: {
    q: 'What is customs data entry automation?',
    a: [
      'Customs data entry automation reads the commercial documents and fills the declaration data for you, so your clerk checks values instead of typing them. Declarix extracts every field with its source document, page and line, maps it to the CDS data elements, runs 120+ checks and hands over a CDS-ready pack.',
      'Declarix reads across the whole job, not one template at a time. Scans, phone photos, spreadsheets with merged cells and forwarded email chains all go in as they arrived.',
    ],
  },
  compare: [
    ['Reading the documents', 'The clerk opens each attachment and finds the right figures.', 'Declarix classifies each document and extracts every field, with its document, page and line.'],
    ['Typing', 'Parties, terms, values, weights, packages, codes and origin are typed into the entry, line by line.', 'Values move into their CDS data elements automatically. Typical processing is around 200 seconds.'],
    ['Long line tables', 'A 60-line invoice means 60 lines of keying and 60 chances to slip.', 'Every line is extracted and checked the same way, however long the table.'],
    ['Checking', 'Typing errors surface as CDS rejections or amendments.', '120+ checks run before the pack is built, and the CDS XML is validated against the HMRC CDS schema.'],
    ['Evidence', 'The clerk’s memory of where a figure came from.', 'Tap any value and its source lights up. Six links tie each value from source to human decision.'],
  ],
  steps: [
    ['01', 'Ingest and classify', 'Emails, PDFs, scans, photos, spreadsheets and zip files go in. Each document is classified by type.'],
    ['02', 'Extract with evidence', 'Every field is read with its document, page and line, and given a confidence score.'],
    ['03', 'Map to CDS', 'Values move into their CDS data elements: parties, delivery terms, item price, masses, packages, commodity code and origin.'],
    ['04', 'Check', '120+ checks run on the mapped data. Low-confidence reads and missing mandatory data stop the pack until a person resolves them.'],
    ['05', 'Hand over', 'Your clerk reviews the CDS-ready pack and files it in Sequoia, Descartes e-Customs or your own system.'],
  ],
  extra: () => `<section class="uc-block" aria-labelledby="data-map"><span class="section-label">FIELD MAP</span><h2 id="data-map">Where each value comes from, and where it goes.</h2><div class="uc-table-wrap" tabindex="0" role="region" aria-label="Field map from documents to CDS data elements"><table class="uc-table"><caption>Document fields Declarix extracts and the CDS import data elements they feed</caption><thead><tr><th scope="col">Value</th><th scope="col">Usually found on</th><th scope="col">CDS data element</th><th scope="col">Declarix check before handover</th></tr></thead><tbody>${[
    ['Exporter', 'Invoice header', 'DE 3/1', 'Exporter present'],
    ['Importer EORI', 'Invoice consignee, customer email', 'DE 3/16', 'GB or XI EORI format'],
    ['Delivery terms', 'Invoice terms of delivery', 'DE 4/1', 'Valid Incoterm code, consistent with freight and insurance'],
    ['Additions to the value', 'Freight and insurance invoices', 'DE 4/9', 'Costs the Incoterm leaves out are flagged'],
    ['Item price', 'Invoice lines', 'DE 4/14', 'Line arithmetic and invoice total'],
    ['Net mass', 'Packing list', 'DE 6/1', 'Present on every goods item'],
    ['Gross mass', 'Packing list, bill of lading', 'DE 6/5', 'On the header or every item; gross not below net'],
    ['Goods description', 'Invoice lines', 'DE 6/8', 'Matches the packing list'],
    ['Number of packages', 'Packing list, bill of lading', 'DE 6/10', 'Matches the bill of lading'],
    ['Commodity code', 'Invoice HS column', 'DE 6/14', 'Format, then checked against the description with GIR reasoning'],
    ['Country of origin', 'Invoice, certificate of origin', 'DE 5/15', 'Present on every line'],
    ['Preferential origin', 'Origin declaration or certificate of origin', 'DE 5/16', 'A preference claim needs its proof'],
  ].map(([value, doc, de, check]) => `<tr><th scope="row">${escapeHtml(value)}</th><td>${escapeHtml(doc)}</td><td>${escapeHtml(de)}</td><td>${escapeHtml(check)}</td></tr>`).join('')}</tbody></table></div><p>Data element numbers follow HMRC’s CDS completion instructions for imports. On the Harbourline shipment, this map catches a GB EORI one digit short (DE 3/16), missing masses on line 3 (DE 6/1 and DE 6/5) and missing EXW freight costs (DE 4/9). [See the full worked example](/use-cases/invoice-packing-list-reconciliation/).</p></section><section class="uc-block" aria-labelledby="data-codes"><span class="section-label">COMMODITY CODES</span><h2 id="data-codes">The code is checked, not copied.</h2><p>A shipper’s HS column is a starting point, not an answer. Declarix checks every commodity code against the goods description using the General Interpretative Rules and offers up to three alternatives. A weak or mismatched code goes to review, and your clerk makes the classification decision.</p></section>`,
  proof: true,
  faqs: [
    ['Is this just OCR?', 'No. OCR turns a page into text; Declarix classifies the documents, extracts each field with its source, maps it to CDS data elements and runs 120+ checks on the result.'],
    ['Can it read scans and phone photos?', 'Yes. Declarix takes emails, PDFs, scans, phone photos, spreadsheets with merged cells and zip files as they arrived.'],
    ['Does Declarix choose the commodity code?', 'Your clerk does: Declarix checks the code against the description with GIR reasoning and proposes up to three alternatives for review.'],
    ['What happens when a value cannot be read clearly?', 'A low-confidence read becomes a flagged question, and it stops the pack until a person resolves it, so a weak read never reaches the entry.'],
    ['Which systems does the data go into?', 'The CDS-ready pack goes to Sequoia, Descartes e-Customs or a mapped customer integration.'],
  ],
  related: ['/use-cases/invoice-packing-list-reconciliation/', '/customs-entry-checking-software/', '/use-cases/customs-team-review/', '/use-cases/customs-brokers/', '/how-it-works/', '/supported-scope/', '/compare/automation-vs-manual-entry/', '/compare/automation-vs-outsourcing/', '/research/hmrc-customs-administrative-burden-explorer-2026/'],
  sources: [sources.vol3, sources.commodity, sources.cds],
}

const importers = {
  kind: 'audience',
  group: 'team',
  path: '/use-cases/importers/',
  shortName: 'Importers',
  title: 'Prepare customs documents for your broker | Declarix',
  description: 'What your customs broker needs from you, why invoices and packing lists must agree, and how to answer a Declarix-drafted request in one reply.',
  eyebrow: 'USE CASE · IMPORTERS',
  ref: 'CASE 06 · IMPORTER SIDE',
  stamp: 'FIRST\nASK',
  h1: 'Importers: give your customs broker everything on the first ask.',
  standfirst: 'Your goods clear faster when your broker gets the right facts the first time. Brokers who use Declarix send one numbered request that tells you exactly what is missing and where.',
  card: 'What your broker needs, and how to answer a numbered Declarix request in one reply.',
  answer: {
    q: 'What does my customs broker need from me?',
    a: [
      'Your customs broker needs a commercial invoice, packing list and transport document that agree with each other, plus your EORI number, the delivery terms with any costs to the UK border, and proof of origin if you claim a preference. Licences or certificates are needed only for goods that require them.',
      'Brokers who use Declarix check all of this before they start the entry. If anything is missing, you get one numbered request that names each fact and the document it belongs to. Answer each item, and your reply is matched straight back to your broker’s open query.',
    ],
  },
  compare: [
    ['The request', '“Please send the missing documents”, and a guess at what that means.', 'One numbered list: each item names the fact, the document and the goods line.'],
    ['Supplier questions', 'You find out a week later that the broker needed something from your supplier.', 'Supplier items are grouped together, ready for you to forward in one go.'],
    ['Rounds of email', 'Two or three rounds as new gaps appear.', 'All gaps are found up front, so one reply can clear the job.'],
    ['Your goods', 'Waiting at the port while the paperwork is fixed.', 'Moving sooner, because the entry is built from facts that already agree.'],
  ],
  stepsTitle: 'Five steps to a reply your broker can use.',
  steps: [
    ['01', 'Read the exact request', 'Check the shipment reference and each numbered item. If an item is unclear, ask your broker what they need rather than guess a value.'],
    ['02', 'Answer your items', 'Send the facts only you hold: your full EORI, costs you paid, and confirmation of the goods you ordered.'],
    ['03', 'Forward the supplier items', 'Send the supplier section to your seller as one message, so corrected documents come back together.'],
    ['04', 'Mark replacements clearly', 'If a document changed, say it replaces the earlier version. Your broker checks the new version before the entry moves on.'],
    ['05', 'Let your broker confirm', 'Your broker checks each answer, completes the entry and files it. You stay informed; the broker handles customs.'],
  ],
  example: () => `<section class="uc-block uc-example" aria-labelledby="importer-example"><span class="section-label">${fictionalShipment.label}</span><h2 id="importer-example">What the importer’s part of the request looks like.</h2><p>In the Harbourline shipment, the broker’s Declarix request has eight items. Two of them are for the importer, because only the importer holds those facts:</p>${emailDraft({ only: 'importer' })}<p>The other six items go to the supplier in Karur: a quantity that does not match, a missing weight, a carton count, a goods description and the origin declaration needed to claim UK–India preference. The importer forwards that section once. [See the full eight-item email](/use-cases/customer-document-requests/).</p><p class="uc-note">${escapeHtml(fictionalShipment.note)}</p></section>`,
  extra: () => `<section class="uc-block" aria-labelledby="importer-checklist"><span class="section-label">IMPORTER CHECKLIST</span><h2 id="importer-checklist">What your broker checks before filing.</h2><div class="uc-table-wrap" tabindex="0" role="region" aria-label="Importer document checklist"><table class="uc-table"><caption>The documents and facts a UK customs broker checks on a standard import</caption><thead><tr><th scope="col">Item</th><th scope="col">What the broker checks</th><th scope="col">Common gap</th></tr></thead><tbody>${[
    ['Commercial invoice', 'Seller, buyer, goods lines, prices, currency, delivery terms', 'Quantity or description differs from the packing list'],
    ['Packing list', 'Cartons, quantities, net and gross weight per line', 'Weights missing on a line'],
    ['Bill of lading, air waybill or CMR', 'Packages, gross weight, route, freight terms', 'Carton count differs from the packing list'],
    ['EORI number', 'A valid GB EORI for imports into Great Britain', 'A digit missing or the wrong prefix'],
    ['Delivery terms and costs', 'Which costs to the UK border belong in the customs value', 'EXW or FCA with no freight or insurance figures'],
    ['Proof of origin', 'A valid proof if you claim a preferential duty rate', 'Preference requested with no proof of origin'],
    ['Licences and certificates', 'Only for goods that need them, such as controlled or plant and animal goods', 'Not known until the goods are classified'],
  ].map(([item, check, gap]) => `<tr><th scope="row">${escapeHtml(item)}</th><td>${escapeHtml(check)}</td><td>${escapeHtml(gap)}</td></tr>`).join('')}</tbody></table></div><p>Run the [free customs document pack check](/tools/customs-document-pack-check/) before you send the paperwork, and use the [customs value, duty and VAT calculator](/tools/customs-value-import-duty-vat-calculator/) to see how freight and insurance change the value. If you are not sure your EORI is right, check it against the GOV.UK EORI service listed in the sources below.</p></section><section class="uc-block" aria-labelledby="importer-roles"><span class="section-label">WHO DOES WHAT</span><h2 id="importer-roles">Your reply supplies the evidence. Your broker makes the customs call.</h2><div class="uc-cards"><article><h3>You, the importer</h3><p>Answer the items addressed to you. Forward the supplier items. Tell your broker when a document replaces an earlier one.</p></article><article><h3>Your customs broker</h3><p>Checks every answer, confirms the evidence, completes the entry and files it with HMRC under the agreed representation.</p></article><article><h3>Declarix</h3><p>Finds every gap before the entry starts, drafts the request for your broker and matches your reply to the right question.</p></article></div></section>`,
  proof: false,
  faqs: [
    ['Do I need a Declarix account?', 'No. You answer your broker’s email as usual, and your reply is matched back to the right request item on the broker’s side.'],
    ['Why must my invoice and packing list agree?', 'Because quantities, values and weights from both documents go onto the customs declaration, and a mismatch has to be settled before your broker can file.'],
    ['What is proof of origin?', 'It is the exporter’s declaration or certificate that the goods meet a trade agreement’s origin rules, such as a statement on origin under the UK–EU agreement or an origin declaration under the UK–India agreement, and your broker needs it to claim a preferential duty rate.'],
    ['Why does my broker ask about freight on an EXW purchase?', 'Because the UK customs value includes transport and insurance costs up to the UK border, and EXW prices leave those costs out.'],
    ['How can I help my broker clear goods faster?', 'Send matching documents, your full EORI and any origin proof with the first email, and answer numbered requests item by item.'],
    ['Can my broker start using Declarix?', 'Yes. Your broker can book a 20-minute numbers call to see how Declarix fits their desk and run a pilot on real jobs.'],
  ],
  cta: { title: 'Introduce your broker to Declarix.', copy: 'Brokers who check every job before keying ask fewer, clearer questions. Your broker can book the 20-minute numbers call to see the desk economics and the pilot terms.', label: 'BOOK THE 20-MINUTE NUMBERS CALL' },
  related: ['/use-cases/customer-document-requests/', '/use-cases/invoice-packing-list-reconciliation/', '/tools/customs-document-pack-check/', '/tools/customs-value-import-duty-vat-calculator/', '/tools/eori-checker/', '/tools/commercial-invoice-generator/', '/customs-reference/incoterms/', '/use-cases/customs-brokers/'],
  sources: [sources.importSteps, sources.eori, sources.origin, sources.indiaOrigin, sources.appoint, sources.valuation],
}

const teamReview = {
  kind: 'usecase',
  group: 'job',
  path: '/use-cases/customs-team-review/',
  shortName: 'Customs team review',
  title: 'Customs document review software for teams | Declarix',
  description: 'Declarix routes each customs issue to the right reviewer, uses maker-checker approval and records every decision in a tamper-evident audit trail.',
  eyebrow: 'USE CASE · CUSTOMS TEAM REVIEW',
  ref: 'CASE 07 · TEAM REVIEW',
  stamp: 'MAKER\nCHECKER',
  h1: 'Review customs entries as a team, with every decision on record.',
  standfirst: 'Clean jobs get a quick check. Doubtful ones get a full review. Juniors clear routine items, seniors sign the judgement calls, and every decision is written to a tamper-evident audit trail.',
  card: 'Issues routed to the right person, maker-checker approval and a tamper-evident record of every decision.',
  answer: {
    q: 'What is customs document review software?',
    a: [
      'Customs document review software lets a team check proposed entry data against its evidence, route each issue to the right person and record who approved what. Declarix gives UK customs teams a review workstation where every field shows its source and every flag carries a written next step.',
      'Clean jobs go to a quick check and doubtful ones to full review. Junior clerks clear routine items while senior clerks sign judgement calls. Every decision is written once to a hash-chained, tamper-evident audit trail.',
    ],
  },
  compare: [
    ['Who sees which job', 'Whoever is free picks up the next file from a shared inbox.', 'Confidence routing sorts jobs into four bands: clean jobs to a quick check, doubtful ones to full review.'],
    ['Who acts on each issue', 'The senior clerk ends up reading everything.', 'Issues are grouped by who acts: clerk, senior or customer.'],
    ['Approval', 'A second pair of eyes when someone remembers.', 'Maker-checker with three clearance tiers. Thirteen roles and 33 permissions set who can do what.'],
    ['Hard stops', 'Rely on the clerk spotting a sanctioned country or controlled goods.', 'Eight pack gates, such as a sanctioned country or missing mandatory data, stop the pack, and no clerk can override them.'],
    ['Record', 'Notes in an email thread and the clerk’s memory.', 'Every decision, run, check and snapshot is written once and kept, with audit search, diff and an integrity check.'],
  ],
  stepsTitle: 'Five steps from queue to signed pack.',
  steps: [
    ['01', 'See the current queue', 'Each job shows where it stands: processing, in review, waiting on the customer or ready to approve.'],
    ['02', 'Work from evidence', 'The reviewer opens any field and sees its source document, page and line beside the proposed value.'],
    ['03', 'Resolve each flag', 'Correct from evidence, waive a minor flag with a reason, override a blocker with a recorded reason, or send a customer query.'],
    ['04', 'Second approval where policy needs it', 'A different person with the right clearance tier approves the judgement calls.'],
    ['05', 'Sign and build the pack', 'Your clerk checks and your name signs. The CDS-ready pack is built and handed to your filing system.'],
  ],
  extra: () => `<section class="uc-block" aria-labelledby="review-matrix"><span class="section-label">ISSUE ROUTING</span><h2 id="review-matrix">Who handles what.</h2><div class="uc-table-wrap" tabindex="0" role="region" aria-label="Issue routing matrix"><table class="uc-table"><caption>How Declarix routes customs issues on a team desk</caption><thead><tr><th scope="col">Issue type</th><th scope="col">Example</th><th scope="col">Who acts</th><th scope="col">What they can do</th></tr></thead><tbody>${[
    ['Routine format issue', 'GB EORI one digit short', 'Clerk', 'Correct from evidence or send the drafted customer query'],
    ['Document conflict', 'Invoice 2,400 PCS against packing list 2,200 PCS', 'Clerk', 'Confirm the right figure from evidence, or query the shipper'],
    ['Judgement call', 'Commodity code proposed for review, valuation method', 'Senior clerk', 'Decide and approve, with the decision logged against their name'],
    ['Missing customer fact', 'EXW freight costs to the UK border', 'Customer, via the drafted query', 'Reply matched back to the open query for clerk confirmation'],
    ['Blocker', 'A flag that stops the job', 'Senior clerk', 'Override only with a recorded reason'],
    ['Hard stop', 'Sanctioned country, controlled goods, missing mandatory data', 'Nobody', 'The pack stays held until the cause is fixed'],
  ].map(([type, example, who, action]) => `<tr><th scope="row">${escapeHtml(type)}</th><td>${escapeHtml(example)}</td><td>${escapeHtml(who)}</td><td>${escapeHtml(action)}</td></tr>`).join('')}</tbody></table></div><p>Examples come from the Harbourline shipment used across these pages. [See it worked through line by line](/use-cases/invoice-packing-list-reconciliation/).</p></section><section class="uc-block" aria-labelledby="review-audit"><span class="section-label">AUDIT TRAIL</span><h2 id="review-audit">A record you can hand to anyone who asks.</h2><ul class="uc-list"><li>Every proposed value keeps its chain: source, extracted value, canonical field, check, CDS mapping and human decision.</li><li>Every check run is recorded with its outcome and rule version.</li><li>Every decision is logged against the person who made it, including waivers and overrides with their reasons.</li><li>The audit record is SHA-256 hash-chained, so any change after the fact shows up in the integrity check.</li><li>Each firm works in its own workspace with role-based access.</li></ul><p>HMRC’s Standard for Customs Intermediaries (PAS 41201:2026) asks intermediaries to check and verify the documents behind each declaration, audit the declarations they submit and train the staff who submit them. A clear record of who checked and approved each entry is strong evidence of that work.</p></section>`,
  proof: true,
  faqs: [
    ['Can a clerk approve their own work?', 'Where your policy requires a second approval, Declarix routes the item to a different person with the right clearance tier.'],
    ['What can a reviewer do with a flag?', 'They can correct the value from evidence, waive a minor flag with a reason, override a blocker with a recorded reason, or send a customer query.'],
    ['Can anyone override a hard stop?', 'No. The eight pack gates, such as a sanctioned country or missing mandatory data, hold the pack until the cause is fixed.'],
    ['What does the audit trail record?', 'It records every decision, run, check and snapshot once, with who made each decision and the rule version behind each check.'],
    ['Is review fast for experienced clerks?', 'Yes. Review is keyboard-first with 11 shortcuts, and clean jobs go straight to a quick check.'],
  ],
  related: ['/use-cases/customer-document-requests/', '/use-cases/customs-data-entry/', '/customs-entry-checking-software/', '/use-cases/customs-brokers/', '/security/', '/supported-scope/', '/pilot/'],
  sources: [sources.standard, sources.appoint, sources.amend],
}

const deskRow = (tier) => `<tr${tier.name === 'Desk' ? ' class="uc-row-focus"' : ''}><th scope="row">${tier.name}</th><td>£${tier.monthly.toLocaleString('en-GB')} / month</td><td>${tier.included.toLocaleString('en-GB')} packs</td><td>£${tier.rate.toFixed(2)} / pack</td><td>£${tier.rate.toFixed(2)} / extra pack</td></tr>`

function volumeRows() {
  return [50, 100, 150, 250, 400, 600]
    .map((volume) => {
      const fit = priceForVolume(volume)
      const detail = fit.overage ? `£${packages.find((tier) => tier.name === fit.name).monthly.toLocaleString('en-GB')} + ${fit.overage.toLocaleString('en-GB')} extra × ${rate(fit.rate)}` : `Included in ${fit.name}`
      return `<tr><th scope="row">${volume.toLocaleString('en-GB')} packs</th><td>${fit.name}</td><td>${escapeHtml(detail)}</td><td>${money(fit.total)} / month</td></tr>`
    })
    .join('')
}

const crossover = (() => {
  for (let volume = 101; volume <= 3000; volume += 1) if (priceForVolume(volume).name !== 'Desk') return volume
  return 3000
})()

const smallBrokerages = {
  kind: 'audience',
  group: 'team',
  path: '/for/small-customs-brokerages/',
  shortName: 'Small customs brokerages',
  title: 'Customs software for small brokerages | Declarix Desk',
  description: `Declarix Desk gives small UK customs brokerages checked, CDS-ready entry packs: £${desk.monthly} / month for ${desk.included} packs, no seat fees, month to month.`,
  eyebrow: 'FOR SMALL CUSTOMS BROKERAGES · THE DESK PACKAGE',
  ref: 'AUDIENCE 01 · SMALL BROKERAGES',
  stamp: 'DESK\nPACKAGE',
  h1: 'Customs software for small brokerages, priced per pack.',
  standfirst: 'Take on more work with the team you have. Declarix checks every job and builds the CDS-ready pack, so a small desk handles more declarations without another hire.',
  card: `The Desk package: £${desk.monthly} / month for ${desk.included} packs, for brokerages that want more capacity without more seats.`,
  answer: {
    q: 'What is the best customs software for a small brokerage?',
    a: [
      `A small customs brokerage needs software that adds capacity without adding seats, setup projects or a new filing system. Declarix Desk is £${desk.monthly}/month for ${desk.included} packs, and extra packs cost the same per-pack rate as your package. No seat fees. No hosting fees.`,
      'Every pack is a checked, CDS-ready entry your clerk approves and files in the software you already use. Your two or three experienced people stop keying and start checking, and the desk handles up to 3× more declarations per clerk.',
    ],
  },
  compare: [
    ['Capacity', 'One clerk off sick and the backlog builds. New work gets turned away.', 'Clerks check packs instead of building entries, so the same people cover more declarations.'],
    ['Hiring', 'Recruiting another experienced clerk is slow and expensive.', 'Capacity comes from the package, month to month, with no new headcount.'],
    ['The owner’s time', 'The owner keys entries, chases customers and runs the business at once.', 'Customer queries arrive pre-drafted, and routine checks run on every job before anyone opens it.'],
    ['Software cost', 'Per-seat licences that grow with every new starter.', 'Pay per declaration pack. No seat fees. No hosting fees.'],
    ['Filing', 'Your current customs software.', 'The same software. Declarix supports Sequoia, Descartes e-Customs and customer integrations.'],
  ],
  stepsTitle: 'Five steps to a bigger desk.',
  steps: [
    ['01', 'Run your numbers', 'Use the free capacity calculator with your monthly volume and clerk minutes.'],
    ['02', 'Book the 20-minute numbers call', 'Bring weekly volume, current minutes per declaration, loaded clerk cost and the system you file through.'],
    ['03', 'Prove it on one ugly job', 'Run the pilot on a properly anonymised real job and compare it with the manual build.'],
    ['04', 'Start on Desk', `${desk.included} packs a month included, with extra packs at the same rate.`],
    ['05', 'Grow when the work grows', 'Move to Team when your volume makes it the better fit. Month to month throughout.'],
  ],
  extra: () => {
    const extraMonthly = smallDeskExample.packageFit
    return `<section class="uc-block uc-pricing" aria-labelledby="desk-packages"><span class="section-label">MONTHLY PACKAGES</span><h2 id="desk-packages">Desk is built for the small brokerage.</h2><p>One monthly allowance. The same clear rate for every pack above it.</p><div class="uc-table-wrap" tabindex="0" role="region" aria-label="Declarix monthly packages"><table class="uc-table"><caption>Declarix monthly declaration pack packages</caption><thead><tr><th scope="col">Package</th><th scope="col">Monthly fee</th><th scope="col">Included</th><th scope="col">Rate</th><th scope="col">Extra packs</th></tr></thead><tbody>${packages.map(deskRow).join('')}</tbody></table></div><p class="uc-terms">Month to month. Cancel anytime. No seat fees. No hosting fees. Annual indexation applies. Extra declaration packs are billed at your package rate.</p><h3>What Desk costs at your volume</h3><div class="uc-table-wrap" tabindex="0" role="region" aria-label="Monthly cost by volume"><table class="uc-table"><caption>Best-fit package and monthly total by volume, from the published pricing</caption><thead><tr><th scope="col">Packs a month</th><th scope="col">Best fit</th><th scope="col">How it adds up</th><th scope="col">Monthly total</th></tr></thead><tbody>${volumeRows()}</tbody></table></div><p>From ${crossover.toLocaleString('en-GB')} packs a month, Team gives the same or a lower total, and the [capacity calculator](/roi-calculator/) picks it for you. See every package on the [pricing page](/pricing/).</p></section><section class="uc-block uc-example" aria-labelledby="desk-example"><span class="section-label">WORKED EXAMPLE · CALCULATOR FORMULA</span><h2 id="desk-example">A two-clerk brokerage at 150 entries a month.</h2><p>Take a small brokerage sending 150 document-heavy import entries a month through Declarix. Today each entry takes 24 clerk minutes to build and check. With Declarix, the clerk checks a pack in 8 minutes. These are the public calculator’s example times; put your own into the calculator.</p><div class="uc-metrics"><div><span>CLERK HOURS RELEASED / MONTH</span><strong>${whole(smallDeskExample.hours)}</strong></div><div><span>EXTRA DECLARATIONS THAT TIME SUPPORTS / MONTH</span><strong>${whole(smallDeskExample.extraPacks)}</strong></div><div><span>BEST-FIT PACKAGE</span><strong>${extraMonthly.name} · ${money(extraMonthly.total)}</strong></div></div><p>How it adds up: 150 × (24 − 8) ÷ 60 = ${whole(smallDeskExample.hours)} hours. ${whole(smallDeskExample.hours)} × 60 ÷ 8 = ${whole(smallDeskExample.extraPacks)} more declarations. Desk is £${desk.monthly} for ${desk.included} packs, plus ${extraMonthly.overage} extra packs × ${rate(extraMonthly.rate)} = ${money(extraMonthly.total)} a month. Run it with your own numbers in the [capacity and ROI calculator](/roi-calculator/).</p></section><section class="uc-block" aria-labelledby="desk-pilot"><span class="section-label">PILOT</span><h2 id="desk-pilot">Prove it on your desk first.</h2><p>£0 upfront. £1 per declaration, capped at £500. The pilot fee is fully waived if the agreed success criteria are missed.</p><p>Read the [pilot terms and how the side-by-side test works](/pilot/).</p></section>`
  },
  proof: true,
  faqs: [
    ['Is there a minimum contract?', 'No. Month to month. Cancel anytime.'],
    ['What counts as a pack?', 'One pack is one declaration: the checked data and evidence for one entry, and your quote shows how split shipments and amalgamated invoices are counted.'],
    ['What if we go over 100 packs in a month?', `Extra packs cost the same per-pack rate as your package, so on Desk each extra pack is ${rate(desk.rate)}.`],
    ['Do we pay per user?', 'No. No seat fees. No hosting fees.'],
    ['Will it work with our customs software?', 'Declarix supports Sequoia, Descartes e-Customs and customer integrations, and the 20-minute numbers call maps the route for your system.'],
    ['Who files the declarations?', 'Your clerk files them in your own customs system, because Declarix never submits to HMRC.'],
  ],
  cta: { title: 'See what your desk can take on.', copy: 'Bring weekly volume, current minutes per declaration, loaded clerk cost and the system your team files through. Leave with an ROI estimate, the integration route and the first workflow to run on Desk.' },
  related: ['/use-cases/customs-brokers/', '/customs-entry-checking-software/', '/pricing/', '/roi-calculator/', '/pilot/', '/use-cases/customer-document-requests/', '/compare/automation-vs-hiring/', '/compare/automation-vs-outsourcing/'],
  sources: [sources.appoint, sources.standard, sources.developers],
}

const entryChecking = {
  kind: 'category',
  group: 'job',
  path: '/customs-entry-checking-software/',
  shortName: 'Customs entry checking software',
  title: 'Customs entry checking software for UK brokers | Declarix',
  description: 'Declarix pre-checks every customs entry before you file in CDS: 120+ checks, each flag linked to its source line, and a CDS-ready pack for your clerk.',
  eyebrow: 'CUSTOMS ENTRY CHECKING SOFTWARE · BEFORE YOU FILE',
  ref: 'GUIDE 14 · ENTRY CHECKING',
  stamp: '120+\nCHECKS',
  h1: 'Customs entry checking software that works before you file.',
  standfirst: 'Declarix checks every customs entry against its source documents and the customs rules before anyone keys it. Your clerk gets a CDS-ready pack with each issue flagged, sourced and ready to resolve.',
  card: 'Pre-check every entry before it is filed in CDS: 120+ checks, each flag linked to its source line.',
  answer: {
    q: 'What is customs entry checking software?',
    a: [
      'Customs entry checking software checks the documents and the proposed entry data before a declaration is filed in CDS. Declarix does this for UK brokers. Every job gets 120+ checks, every flag points to its source document and line with a written next step, and your clerk gets a CDS-ready pack to approve and file in Sequoia, Descartes e-Customs or your own system.',
      'CDS validates the data you send. It cannot see whether that data matches the invoice, the packing list and the bill of lading. Entry checking before filing closes that gap, which is where most rework, port holds and post-clearance amendments start.',
    ],
  },
  compare: [
    ['When problems surface', 'At CDS submission, when the goods are held, or months later as an amendment.', 'Before keying, on the first pass of 120+ checks.'],
    ['What gets checked', 'Whatever the clerk has time to check by eye.', 'The same checks on every job and every goods line, against the documents and the customs rules.'],
    ['Document against document', 'Invoice against packing list against B/L, if someone remembers.', 'Seven fields compared on every goods line across all three.'],
    ['Customs rules', 'Clerk knowledge, notes and checklists.', 'A governed rule library, CDS code lists and data-element rules, each check recorded with its rule version.'],
    ['Fix path', 'Re-key, resubmit, or ask HMRC to amend.', 'Each flag carries a next step, and missing facts are already drafted into one customer query.'],
  ],
  steps: [
    ['01', 'Forward the job', 'The documents go in as they arrived.'],
    ['02', 'Build the entry data', 'Every field is extracted with its source and mapped to its CDS data element.'],
    ['03', 'Run 120+ checks', 'Document consistency, maths and weights, valuation, origin, EORI, CDS data elements, sanctions, licences and more.'],
    ['04', 'Resolve the flags', 'Your clerk works through each flag with both sources side by side, and sends the drafted query for anything missing.'],
    ['05', 'Build and file', 'The CDS XML is validated against the HMRC CDS schema, the pack is built, and your clerk files it in your own system.'],
  ],
  extra: () => `<section class="uc-block" aria-labelledby="check-categories"><span class="section-label">WHAT GETS CHECKED</span><h2 id="check-categories">15 categories, 124 distinct named checks.</h2><p>Many checks repeat on every goods line, so a three-line job makes 21 cross-document comparisons on its own.</p><div class="uc-table-wrap" tabindex="0" role="region" aria-label="Check categories"><table class="uc-table"><caption>Declarix check categories with example checks</caption><thead><tr><th scope="col">Category</th><th scope="col">Example checks</th></tr></thead><tbody>${[
    ['Document consistency', 'Quantity, net and gross weight, packages, item value, line value and description agree across invoice, packing list and B/L, per line'],
    ['Maths and weights', 'Invoice total equals the sum of the lines; gross not below net; weight totals match the lines'],
    ['Valuation and Incoterms', 'Freight or insurance counted twice; Incoterm inconsistent with freight or insurance; valid CDS delivery-terms code'],
    ['Commodity code', 'Code present on every line, in the right format, and checked against the description with GIR reasoning'],
    ['Origin and preference', 'Origin on every line; a declared preference needs its origin proof'],
    ['EORI and parties', 'GB and XI EORI format; importer and exporter present; declarant EORI and representation set up'],
    ['CDS data elements and code lists', 'Procedure and additional procedure codes, transport mode, goods location, previous documents, currency and country codes'],
    ['Transport', 'Transport mode against transport ID and ports; B/L, AWB or CMR chain complete'],
    ['Documents needed', 'Commercial invoice present; certificate of origin, SPS certificate and dual-use screening where needed'],
    ['Duties and trade remedies', 'Anti-dumping, countervailing and safeguard duty; tariff quotas; excise'],
    ['Sanctions, licences and controls', 'Sanctions and embargoes; dual-use and strategic goods; import licences; CITES; plant and animal health'],
    ['Product compliance', 'UKCA, CE, RoHS, REACH, WEEE and other product rules by goods type'],
    ['Risk signals', 'Value-to-weight outliers, duplicate invoicing, unusual routing'],
    ['Pack gates (hard stops)', 'High value, controlled goods, sanctioned country, missing mandatory data, low extraction confidence and more'],
    ['CDS schema', 'The compiled CDS XML is validated against the HMRC CDS schema before the pack is built'],
  ].map(([category, examples]) => `<tr><th scope="row">${escapeHtml(category)}</th><td>${escapeHtml(examples)}</td></tr>`).join('')}</tbody></table></div><p>Every check that runs is recorded with its outcome and rule version. A check that cannot run holds the pack and is counted, so nothing is left unchecked.</p></section><section class="uc-block uc-example" aria-labelledby="check-example"><span class="section-label">${fictionalShipment.label}</span><h2 id="check-example">120+ checks before anyone keys a line. Eight flags.</h2><p>On the Harbourline shipment (three documents, three goods lines, Karur to Felixstowe), Declarix raises eight flags. Each would otherwise surface late: at keying, at a port hold, or as a post-clearance amendment.</p>${flagTable()}<p>[See the eight flags traced to their source lines](/use-cases/invoice-packing-list-reconciliation/), and [the customer email that covers all eight](/use-cases/customer-document-requests/).</p><p class="uc-note">${escapeHtml(fictionalShipment.note)}</p></section><section class="uc-block" aria-labelledby="check-buying"><span class="section-label">BUYING CHECKLIST</span><h2 id="check-buying">What to look for in entry checking software.</h2><ol class="uc-list"><li>It checks the entry against the source documents, not only the declaration format.</li><li>Every flag shows the document, page and line it came from.</li><li>Every flag says what to do next, and missing facts become a drafted customer query.</li><li>It works in front of the filing system you already use: Declarix supports Sequoia, Descartes e-Customs and customer integrations.</li><li>Hard stops cannot be overridden, and every override of a lesser flag is recorded with a reason.</li><li>It proves itself on your ugliest job. Use the [pilot](/pilot/) to compare it side by side with your manual build.</li></ol><p>Want to see the checks on your own document mix first? Start with the free [customs document pack check](/tools/customs-document-pack-check/).</p></section>`,
  proof: true,
  faqs: [
    ['Does CDS not check the entry already?', 'CDS validates the declaration data it receives, but it cannot see whether that data matches your invoice, packing list and bill of lading, which is what Declarix checks before you file.'],
    ['How many checks does Declarix run?', 'Declarix runs 124 distinct named checks across 15 categories, and many of them repeat on every goods line.'],
    ['Do our clerks still review each entry?', 'Yes. Your clerk gets a checked pack with every issue flagged and sourced, so the review is faster and nothing is missed.'],
    ['Can a clerk override a flag?', 'A lesser flag can be waived and a blocker overridden with a recorded reason, while the eight hard stops cannot be overridden by anyone.'],
    ['Does Declarix file the entry?', 'No. Your clerk files in your existing customs system, because Declarix never submits to HMRC.'],
  ],
  related: ['/use-cases/invoice-packing-list-reconciliation/', '/use-cases/customs-data-entry/', '/use-cases/customs-team-review/', '/use-cases/customs-brokers/', '/for/small-customs-brokerages/', '/customs-declaration-software/', '/best-customs-software/', '/compare/', '/tools/customs-document-pack-check/', '/pilot/'],
  sources: [sources.cds, sources.vol3, sources.amend, sources.developers],
}

export const useCasePages = [brokers, forwarders, smallBrokerages, importers, entryChecking, reconciliation, requests, dataEntry, teamReview]
export const useCaseRoutes = [hub, ...useCasePages].map((route) => ({ ...route, reviewedOn: REVIEWED_ON, publishedOn: REVIEWED_ON }))

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

const externalNames = {
  '/how-it-works/': ['How Declarix works', 'From the job as it arrived to a CDS-ready pack.'],
  '/supported-scope/': ['Supported workflows and integrations', 'Sequoia, Descartes e-Customs and customer integrations.'],
  '/pilot/': ['The Declarix pilot', '£0 upfront. £1 per declaration, capped at £500.'],
  '/pricing/': ['Declarix pricing', 'Desk, Team and Scale monthly packages.'],
  '/roi-calculator/': ['Capacity and ROI calculator', 'Hours released, extra declarations and the package that fits.'],
  '/security/': ['Security and data schedule', 'Customer data is never used to train models.'],
  '/customs-clearance-software/': ['Customs clearance automation for brokers', 'Keep the filing system. Remove the bottleneck before it.'],
  '/customs-declaration-software/': ['Customs declaration automation', 'For Sequoia, Descartes and customer integrations.'],
  '/compare/automation-vs-outsourcing/': ['Automation, outsourcing or hiring', 'Compare the options for a busier customs desk.'],
  '/tools/customs-document-pack-check/': ['Free customs document pack check', 'Check which documents a job needs before it reaches the desk.'],
  '/tools/eori-checker/': ['GB EORI checker', 'Check a GB EORI number before you send it to your broker.'],
  '/tools/customs-value-import-duty-vat-calculator/': ['Customs value, duty and VAT calculator', 'See how freight and insurance change the value.'],
  '/customs-reference/incoterms/': ['Incoterms for UK customs', 'Which costs and risks each term hands over.'],
  '/customs-workflows/gmr-gvms-checklist/': ['GMR and GVMS checklist', 'For roll-on roll-off moves through GB ports.'],
  '/compare/': ['Customs software comparisons', 'Declarix and the UK filing and preparation tools, side by side.'],
  '/alternatives/': ['Customs software alternatives', 'Grow the desk without leaving the filing system you know.'],
  '/best-customs-software/': ['Best customs declaration software UK', 'The 2026 buyer shortlist, with the best fit for each desk.'],
  '/compare/automation-vs-manual-entry/': ['Automation vs manual entry', 'The same job keyed by hand and prepared by Declarix.'],
  '/research/hmrc-customs-administrative-burden-explorer-2026/': ['HMRC customs burden explorer 2026', 'What 460 declarants told HMRC about process time and internal cost.'],
  '/compare/automation-vs-hiring/': ['Automation vs hiring', 'Model the workload before you add a clerk.'],
  '/tools/commercial-invoice-generator/': ['Free commercial invoice generator', 'Build an invoice your broker can enter first time.'],
}

function relatedEntry(path) {
  const page = useCaseRoutes.find((route) => route.path === path)
  if (page) return [page.shortName, page.card || page.description]
  return externalNames[path] || [path, '']
}

function bookingHref(route, placement) {
  const source = `usecase_${route.path.split('/').filter(Boolean).join('_')}_${placement}`
  return `/?src=${encodeURIComponent(source)}#book`
}

function breadcrumbTrail(route, site) {
  const trail = [['Home', `${site.origin}/`]]
  if (route.path.startsWith('/use-cases/') && route.path !== hub.path) trail.push([hub.shortName, `${site.origin}${hub.path}`])
  trail.push([route.shortName, `${site.origin}${route.path}`])
  return trail
}

function jsonLd(route, site) {
  const trail = breadcrumbTrail(route, site)
  const page = {
    '@type': route.kind === 'hub' ? 'CollectionPage' : 'WebPage',
    '@id': `${site.origin}${route.path}#webpage`,
    url: `${site.origin}${route.path}`,
    name: route.title,
    headline: route.h1,
    description: route.description,
    datePublished: route.publishedOn,
    dateModified: route.reviewedOn,
    inLanguage: 'en-GB',
    isPartOf: { '@id': `${site.origin}/#website` },
    about: { '@id': `${site.origin}/#organization` },
    publisher: { '@id': `${site.origin}/#organization` },
    image: `${site.origin}/og.jpg`,
    breadcrumb: { '@id': `${site.origin}${route.path}#breadcrumb` },
    citation: route.sources.map((source) => source.url),
  }
  const graph = [
    organizationNode(site),
    { '@type': 'WebSite', '@id': `${site.origin}/#website`, name: 'Declarix', url: `${site.origin}/`, publisher: { '@id': `${site.origin}/#organization` } },
    page,
    {
      '@type': 'BreadcrumbList',
      '@id': `${site.origin}${route.path}#breadcrumb`,
      itemListElement: trail.map(([name, item], index) => ({ '@type': 'ListItem', position: index + 1, name, item })),
    },
  ]
  if (route.kind === 'hub') {
    page.mainEntity = { '@id': `${site.origin}${route.path}#list` }
    graph.push({
      '@type': 'ItemList',
      '@id': `${site.origin}${route.path}#list`,
      name: 'Declarix use cases',
      numberOfItems: useCasePages.length,
      itemListElement: useCasePages.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.shortName, url: `${site.origin}${item.path}` })),
    })
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')
}

function renderAnswer(route) {
  return `<section class="uc-block uc-answer" aria-labelledby="answer-heading"><span class="section-label">DIRECT ANSWER</span><h2 id="answer-heading">${escapeHtml(route.answer.q)}</h2>${route.answer.a.map((paragraph) => `<p>${md(paragraph)}</p>`).join('')}</section>`
}

function renderCompare(route) {
  if (!route.compare) return ''
  return `<section class="uc-block" aria-labelledby="compare-heading"><span class="section-label">THE WORKFLOW · BEFORE AND AFTER</span><h2 id="compare-heading">The same job, before and after Declarix.</h2><div class="uc-table-wrap" tabindex="0" role="region" aria-label="Workflow before and after Declarix"><table class="uc-table uc-compare"><caption>How the work changes on a UK customs desk</caption><thead><tr><th scope="col">Stage</th><th scope="col">Today</th><th scope="col">With Declarix</th></tr></thead><tbody>${route.compare
    .map(([stage, before, after]) => `<tr><th scope="row">${escapeHtml(stage)}</th><td>${md(before)}</td><td>${md(after)}</td></tr>`)
    .join('')}</tbody></table></div></section>`
}

function renderSteps(route) {
  if (!route.steps) return ''
  return `<section class="uc-block" aria-labelledby="steps-heading"><span class="section-label">HOW IT RUNS</span><h2 id="steps-heading">${escapeHtml(route.stepsTitle || 'Five steps from inbox to filing.')}</h2><ol class="uc-timeline">${route.steps
    .map(([number, title, copy]) => `<li><span class="uc-step-n">${number}</span><div><h3>${escapeHtml(title)}</h3><p>${md(copy)}</p></div></li>`)
    .join('')}</ol></section>`
}

function renderProof(route) {
  if (!route.proof) return ''
  const example = calculatorExample
  return `<section class="uc-proof" aria-labelledby="proof-heading"><span class="section-label">THE OUTCOME</span><h2 id="proof-heading">${PROOF}.</h2><p>When a clerk checks a pack instead of building the entry, the same hour covers more declarations. In the public calculator’s example, 1,000 declarations a month at 24 minutes each drop to 8 minutes of checking. That releases ${whole(example.hours)} clerk hours a month, enough for ${whole(example.extraPacks)} more declarations, with no new headcount.</p><a class="button" data-usecase-related="roi_calculator" href="/roi-calculator/">RUN YOUR OWN NUMBERS →</a></section>`
}

function renderFaqs(route) {
  return `<section class="uc-block uc-faqs" aria-labelledby="faq-heading"><span class="section-label">QUESTIONS, ANSWERED FIRST</span><h2 id="faq-heading">Frequently asked questions</h2>${route.faqs
    .map(([question, answer]) => `<div class="uc-faq"><h3>${escapeHtml(question)}</h3><p>${md(answer)}</p></div>`)
    .join('')}</section>`
}

function renderRelated(route) {
  if (!route.related?.length) return ''
  return `<section class="uc-block uc-related" aria-labelledby="related-heading"><span class="section-label">KEEP GOING</span><h2 id="related-heading">Related workflows and free tools</h2><div class="uc-related-grid">${route.related
    // Only link pages published in this build (held routes and the dormant EORI checker drop out).
    .filter((path) => registeredPaths().has(path))
    .map((path) => {
      const [name, note] = relatedEntry(path)
      return `<a href="${path}" data-usecase-related="${escapeHtml(path)}"><strong>${escapeHtml(name)}</strong><span>${escapeHtml(note)}</span><em>OPEN →</em></a>`
    })
    .join('')}</div></section>`
}

function renderSources(route) {
  const id = `sources-${route.path.split('/').filter(Boolean).join('-')}`
  return `<section class="source-register" aria-labelledby="${id}"><header><span class="section-label">PRIMARY SOURCE REGISTER</span><h2 id="${id}">Check the official guidance behind this page.</h2><p>Customs facts on this page are traced to the official sources below. Declarix product facts come from the live product and its published scope.</p></header><ol>${route.sources
    .map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a><span>${escapeHtml(source.publisher)} · CHECKED ${escapeHtml(source.checked)}</span></li>`)
    .join('')}</ol></section>`
}

function renderHub() {
  const groups = [
    ['team', 'BY TEAM', 'Who Declarix works for.'],
    ['job', 'BY JOB', 'The work Declarix takes off the desk.'],
  ]
  const cards = groups
    .map(([group, label, heading]) => `<section class="uc-block" aria-labelledby="hub-${group}"><span class="section-label">${label}</span><h2 id="hub-${group}">${heading}</h2><div class="uc-related-grid uc-hub-grid">${useCasePages
      .filter((page) => page.group === group)
      .map((page) => `<a href="${page.path}" data-usecase-related="${page.path}"><strong>${escapeHtml(page.shortName)}</strong><span>${escapeHtml(page.card)}</span><em>SEE THE WORKFLOW →</em></a>`)
      .join('')}</div></section>`)
    .join('')
  const table = `<section class="uc-block" aria-labelledby="hub-table"><span class="section-label">AT A GLANCE</span><h2 id="hub-table">What changes on the desk.</h2><div class="uc-table-wrap" tabindex="0" role="region" aria-label="Use cases at a glance"><table class="uc-table"><caption>Declarix use cases and what each one changes</caption><thead><tr><th scope="col">Job</th><th scope="col">Today</th><th scope="col">With Declarix</th></tr></thead><tbody>${[
    ['/customs-entry-checking-software/', 'Problems surface at CDS submission or as amendments', '120+ checks before anyone keys a line'],
    ['/use-cases/invoice-packing-list-reconciliation/', 'Invoice and packing list compared by eye', 'Seven fields compared on every goods line'],
    ['/use-cases/customs-data-entry/', 'Every value typed into the entry', 'Every value extracted, mapped and linked to its source'],
    ['/use-cases/customer-document-requests/', 'One gap, one email, one wait, repeated', 'Every gap in one drafted query, replies matched back'],
    ['/use-cases/customs-team-review/', 'The senior clerk re-reads everything', 'Issues routed by who acts, maker-checker approval, full audit trail'],
  ].map(([path, before, after]) => `<tr><th scope="row"><a href="${path}" data-usecase-related="${path}">${escapeHtml(relatedEntry(path)[0])}</a></th><td>${escapeHtml(before)}</td><td>${escapeHtml(after)}</td></tr>`).join('')}</tbody></table></div></section>`
  const example = `<section class="uc-block uc-example" aria-labelledby="hub-example"><span class="section-label">${fictionalShipment.label}</span><h2 id="hub-example">One shipment runs through every page.</h2><p>The use cases share one worked-example job: three documents from a supplier in Karur, landing at Felixstowe for an importer in Leicester. Declarix finds eight problems before keying, writes one customer email for all of them and builds the CDS-ready pack once the answers are in. Follow it through [reconciliation](/use-cases/invoice-packing-list-reconciliation/), [customer requests](/use-cases/customer-document-requests/) and [team review](/use-cases/customs-team-review/).</p>${exhibit(3, 'Worked example page 3: the commercial invoice, packing list and bill of lading for the Harbourline shipment, with eight numbered pins on the values Declarix flags.', 'The Harbourline shipment as it arrived, with the eight flagged values pinned.')}</section>`
  return `${cards}${table}${example}`
}

function analyticsScript(route, posthogKey, posthogHost) {
  const config = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  return `<script>(() => {
    const config = ${config};
    const get = (key) => { try { return sessionStorage.getItem(key) || ''; } catch { return ''; } };
    const set = (key, value) => { try { sessionStorage.setItem(key, value); } catch {} };
    const attribution = () => { const params = new URLSearchParams(location.search); const incoming = { source: params.get('utm_source') || params.get('src') || '', medium: params.get('utm_medium') || '', campaign: params.get('utm_campaign') || '' }; Object.entries(incoming).forEach(([key, value]) => { if (value && !get('dclrx-' + key)) set('dclrx-' + key, value); }); return Object.fromEntries(Object.keys(incoming).map((key) => [key, get('dclrx-' + key) || (key === 'source' ? 'direct' : 'none')])); };
    const distinctId = get('dclrx-distinct-id') || crypto.randomUUID(); set('dclrx-distinct-id', distinctId);
    const track = (event, properties = {}) => { const payload = { ...attribution(), ...properties, page_family: '${route.kind}', page_path: location.pathname }; window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event, ...payload }); if (!config.posthogKey) return; const body = JSON.stringify({ api_key: config.posthogKey, event, distinct_id: distinctId, properties: payload }); if (navigator.sendBeacon && navigator.sendBeacon(config.posthogHost + '/capture/', body)) return; fetch(config.posthogHost + '/capture/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => null); };
    document.querySelectorAll('[data-usecase-related]').forEach((link) => link.addEventListener('click', () => track('usecase_related_clicked', { target: link.dataset.usecaseRelated })));
    document.querySelectorAll('[data-usecase-booking]').forEach((link) => link.addEventListener('click', () => track('usecase_booking_clicked', { placement: link.dataset.usecaseBooking })));
  })();</script>`
}

export function renderUseCase(route, site, { navHtml, webmasterHtml = '', posthogKey = '', posthogHost = 'https://eu.i.posthog.com' }) {
  const canonical = `${site.origin}${route.path}`
  const trail = breadcrumbTrail(route, site)
  const crumbs = trail
    .map(([name, url], index) => (index === trail.length - 1 ? escapeHtml(name.toUpperCase()) : `<a href="${url.replace(site.origin, '')}">${escapeHtml(name.toUpperCase())}</a>`))
    .join(' → ')
  const body = route.kind === 'hub'
    ? `${renderAnswer(route)}${links(renderHub())}${renderProof({ proof: true })}${renderFaqs(route)}${renderRelated({ related: ['/how-it-works/', '/supported-scope/', '/roi-calculator/', '/pilot/', '/tools/customs-document-pack-check/', '/compare/automation-vs-outsourcing/'] })}`
    : `${renderAnswer(route)}${renderCompare(route)}${renderSteps(route)}${route.example ? links(route.example()) : ''}${route.extra ? links(route.extra()) : ''}${renderProof(route)}${renderFaqs(route)}${renderRelated(route)}`
  const cta = route.cta || { title: 'Run the numbers before you buy.', copy: 'Bring weekly volume, current minutes per declaration, loaded clerk cost and the system your team files through. Leave with an ROI estimate, integration route and recommended first workflow.' }
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(route.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterHtml}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <link rel="stylesheet" href="/use-cases.css" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${escapeHtml(route.title)}</title>
    <script type="application/ld+json">${jsonLd(route, site)}</script>
  </head>
  <body>
    <div class="docket use-case">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>CORE OUTCOME</span><strong>UP TO 3×</strong></div>
        <a class="masthead-cta" data-usecase-booking="masthead" href="${bookingHref(route, 'masthead')}">BOOK THE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${navHtml}</nav>
      <div class="breadcrumbs">${crumbs}</div>
      <main>
        <header class="hero">
          <div class="hero-copy">
            <p class="eyebrow">${escapeHtml(route.eyebrow)}</p>
            <h1>${escapeHtml(route.h1)}</h1>
            <p>${escapeHtml(route.standfirst)}</p>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${escapeHtml(route.ref)}</span>
            <div class="stamp">${escapeHtml(route.stamp).replaceAll('\n', '<br />')}</div>
            <div class="review-cell"><span>LAST REVIEWED</span><strong>${route.reviewedOn}</strong></div>
          </aside>
        </header>
        <div class="hero-value-strip"><strong>UP TO 3× MORE DECLARATIONS PER CLERK</strong><strong>~200 SECONDS BEFORE CLERK REVIEW</strong><strong>SEQUOIA · DESCARTES · YOUR SYSTEM</strong><strong>ICC SEAMLESS TRADE FINALIST 2025</strong></div>
        ${body}
        ${renderSources(route)}
        <div class="source-stamp">SOURCE AND CORRECTIONS · REVIEWED ${route.reviewedOn} · <a href="/editorial-policy/">READ THE POLICY</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
        <section class="cta-band">
          <div><h2>${escapeHtml(cta.title)}</h2><p>${escapeHtml(cta.copy)}</p></div>
          <a class="button" data-usecase-booking="bottom" href="${bookingHref(route, 'bottom')}">${escapeHtml(cta.label || 'BOOK THE 20-MINUTE NUMBERS CALL')}</a>
        </section>
      </main>
      <footer class="footer">
        <span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span>
        <nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/pricing-policy/">PRICING POLICY</a><a href="/use-cases/">USE CASES</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav>
      </footer>
    </div>
    ${analyticsScript(route, posthogKey, posthogHost)}
  </body>
</html>`
}

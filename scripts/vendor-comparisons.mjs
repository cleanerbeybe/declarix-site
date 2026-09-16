import { products, sources as baseSources, dimensions, comparisonRoute } from './customaite-comparison.mjs'

export const reviewedOn = '2026-09-16'
export const sources = {
  ...baseSources,
  acquisition: {
    url: 'https://sedna.com/resources/sedna-expands-ai-leadership-in-global-trade-with-flytta-acquisition',
    title: 'Sedna announces Flytta acquisition', type: 'Official vendor acquisition announcement',
    excerpt: 'Sedna says Flytta’s Customs Import and Export Automation workflow is now part of Sedna AI. Flytta and Sedna are not two independent options in this comparison.',
  },
  casper: {
    url: 'https://sedna.com/case-studies/how-casper-customs-transformed-their-operations-with-sedna',
    title: 'Sedna: Casper Customs case study', type: 'Vendor-published customer case study, not our acceptance test',
    excerpt: 'Describes email document intake, extraction, output to ASM Sequoia and Descartes environments, staff due diligence and submission in customs software. This named implementation does not establish universal connector availability or results.',
  },
  sedna: {
    url: 'https://sedna.com/build/sedna-ai', title: 'Sedna AI', type: 'Official vendor product page',
    excerpt: 'Describes operational data extraction and automation within shipping communication workflows. Broad platform descriptions are not proof of specific UK customs procedure coverage.',
  },
}
const sednaCell = (source, text, status = 'published') => ({
  product: 'Sedna / Flytta', module: 'Sedna AI customs automation; confirm offered configuration',
  country: 'UK customer example; exact declaration types not established', source,
  sourceUrl: sources[source].url, reviewedOn, evidenceType: sources[source].type,
  reviewer: 'Nadia, Declarix', status, text,
})
export const vendors = {
  ...Object.fromEntries(products.filter(p => ['declarix','customaite','icustoms'].includes(p.id)).map(p => [p.id, p])),
  flytta: { id: 'flytta', name: 'Sedna / Flytta', role: 'Communication-led customs automation', cells: {
    jurisdiction: sednaCell('acquisition', 'Flytta’s customs import/export workflow is now part of Sedna AI. The announcement does not establish every UK declaration type or procedure; ask for current coverage.', 'not-verified'),
    filing: sednaCell('casper', 'The Casper case describes generating a declaration in customs software, staff due diligence and submission there. It does not establish Sedna as a direct HMRC filing service for your configuration.', 'not-verified'),
    intake: sednaCell('casper', 'Describes documents arriving by email and extracting data from invoices, shipping paperwork and PDFs. Demonstrate your formats and handling of conflicting or replaced documents.'),
    exceptions: sednaCell('casper', 'Describes automated confirmation emails after processing. That is not evidence of a missing-fact request, matched customer reply and authorised resolution workflow.', 'not-verified'),
    approval: sednaCell('casper', 'Describes staff due diligence before submission, and a different automated path for standardised high-volume cases. Role controls, second approval and audit export for your configuration need demonstration.', 'not-verified'),
    handoff: sednaCell('casper', 'The vendor names output to ASM Sequoia and Descartes environments at Casper. Confirm the product version, mapping, support and acceptance for your own destination. This is not a universal connector guarantee.'),
    implementation: sednaCell('sedna', 'Sedna AI describes automation within existing communication workflows. Customer-specific onboarding, permissions, exception ownership and support terms are not verified here.', 'not-verified'),
    pricing: sednaCell('sedna', 'No price or complete customs package is established by the reviewed sources. Request written module, setup, usage and support terms. Unknown fees are not zero.', 'not-verified'),
    fit: sednaCell('acquisition', 'Evaluate if email intake, trade communication and customs automation need to work together. If you need a particular UK procedure or destination, prove that configuration before selecting it.', 'editorial-fit'),
  } },
}

export const comparisons = [
  {
    id: 'P13', path: '/compare/declarix-vs-icustoms/',
    title: 'Declarix vs iCustoms: which workflow fits?', h1: 'Declarix vs iCustoms: which workflow fits?',
    description: 'Compare Declarix preparation and review with iCustoms iDP and UK iCDS. Separate document processing, export formats and filing responsibility.',
    reviewedOn, pair: ['declarix','icustoms'], thirdPath: false,
    eyebrow: 'KEEP YOUR FILING SYSTEM, OR EVALUATE A FILING MODULE?',
    lead: 'Choose the filing boundary before choosing the automation.',
    summary: 'iCustoms publishes separate document-processing and customs-filing modules. Its iDP page describes extraction, multi-document merging and exports. Its UK iCDS page describes direct HMRC CDS integration. Declarix focuses on evidence-linked preparation and review alongside a broker’s filing system.',
    boundary: 'Do not treat iDP, UK iCDS and Ireland products as one interchangeable package. Ask which country, module and plan the quote covers. Declarix does not submit directly to HMRC; its H1 profile is review-only and incomplete.',
    choiceTitle: 'Do you want to keep the filing system or change it?',
    choices: [
      ['Evaluate iCustoms for document processing plus UK filing', 'Ask for iDP and the relevant UK iCDS scope separately. Published CSV, Excel and XML exports are useful evidence, but they do not prove an accepted mapping into another filing system. A UK filing module is not proof that every Ireland feature or procedure is included.'],
      ['Evaluate Declarix for preparation and review', 'Keep the broker’s filing system and focus the evaluation on source evidence, missing facts and approval. Do not choose Declarix if the immediate requirement is direct HMRC filing or a complete H1 profile. A generic export is not an accepted named connector.'],
    ],
    scenarioTitle: 'Test the boundary between iDP and the filing module.',
    scenario: 'Synthetic case: an invoice, packing list and spreadsheet contain one weight conflict. A goods line lacks origin evidence. The clerk needs to keep the existing filing system for this shipment.',
    steps: [
      'Give each team the same synthetic files. Ask iCustoms to identify which functions belong to iDP and which require UK iCDS. Ask Declarix to show the source behind each proposed value.',
      'Ask the clerk to resolve the conflict and request the missing fact. Check how the reply is matched and who approves it; do not count a sent marker as delivery.',
      'Request the exact export format and recipient mapping. Open it in the named destination and record acceptance. A list of formats alone does not pass this test.',
      'For an iCDS filing evaluation, run a separately agreed UK procedure with the authorised filing party. For Declarix, stop at preparation and review; incomplete H1 is not filing readiness.',
    ],
    questions: ['Which iDP, UK iCDS or Ireland modules are quoted, and which are excluded?', 'Can we keep our current filing system, with a tested mapping and named support owner?', 'What happens when a corrected document arrives after approval?'],
  },
  {
    id: 'P15', path: '/compare/declarix-vs-flytta/',
    title: 'Declarix vs Flytta: compare the Sedna workflow', h1: 'Declarix vs Flytta: compare the Sedna workflow',
    description: 'Flytta’s customs workflow is part of Sedna AI. Compare email-led automation with Declarix preparation and review, with scoped sources and a test case.',
    reviewedOn, pair: ['declarix','flytta'], thirdPath: false,
    eyebrow: 'EMAIL-LED AUTOMATION OR CASE-BASED REVIEW?',
    lead: 'Flytta is now part of the Sedna decision.',
    summary: 'Sedna’s acquisition announcement places Flytta’s customs import/export workflow within Sedna AI. Its Casper Customs case study describes email intake, extraction and output to customs software. Declarix provides a different evaluation route: case preparation with source evidence and recorded review decisions.',
    boundary: 'Sedna and Flytta are not separate alternatives. A vendor’s named customer implementation does not guarantee your destination, procedure or result. Declarix does not submit directly to HMRC; its H1 profile is review-only and incomplete.',
    choiceTitle: 'Is the bottleneck in the shared inbox or the review case?',
    choices: [
      ['Evaluate Sedna for communication-led automation', 'If job intake starts in email and the wider communication workflow needs change, test Sedna’s current customs offering. The Casper story names ASM Sequoia and Descartes output. Ask for your own version, mapping and acceptance test rather than assuming the same deployment applies.'],
      ['Evaluate Declarix for evidence-linked preparation', 'If the problem is resolving conflicting documents and keeping decisions tied to source evidence, test a scoped Declarix case. Keep filing with the broker. Do not assume a released customer portal, named connector or automatic email delivery.'],
    ],
    scenarioTitle: 'Follow a replacement document through the email chain.',
    scenario: 'Synthetic case: a broker receives an invoice by email. Two replies attach different packing-list versions, and one reply belongs to another shipment. The clerk has already checked the first version.',
    steps: [
      'Show how the selected Sedna workflow identifies the shipment and attachments. For Declarix, show how the correct files enter the case. Measure the manual steps rather than assuming automatic intake.',
      'Introduce the wrong-shipment reply and replacement packing list. Show which facts change, which sources remain visible and what needs review again.',
      'Show due diligence, approval controls and the evidence history. If the proposed Sedna configuration has an automated path, ask when human review is required and how that policy is enforced.',
      'Test the agreed destination using synthetic data. Ask Sedna to demonstrate the quoted mapping rather than rely on the Casper example. Test Declarix preparation only; no accepted named connector is claimed.',
    ],
    questions: ['What is the current Sedna product and commercial package for the former Flytta workflow?', 'Which email permissions, routing rules and manual-review conditions apply?', 'Does the quoted configuration support our customs software version and exact UK procedures?'],
  },
  {
    id: 'P27', path: '/compare/icustoms-vs-customaite/',
    title: 'iCustoms vs Customaite: a customs-team decision guide', h1: 'iCustoms vs Customaite: a customs-team decision guide',
    description: 'Compare iCustoms modules with Customaite suites. Check UK scope, preparation, review, customer workflow and filing before choosing a demonstration.',
    reviewedOn, pair: ['icustoms','customaite'], thirdPath: true,
    eyebrow: 'A MODULE-BY-MODULE OR SUITE-BY-SUITE DECISION',
    lead: 'Compare the proposed configuration, not two homepages.',
    summary: 'iCustoms describes document processing in iDP and UK CDS filing in iCDS. Customaite describes compliance, automation and workflow suites across a source-data-to-declaration process. Start by naming the jurisdiction, filing owner and modules each vendor would supply.',
    boundary: 'A UK iCDS product page gives a specific UK filing claim. Broad Customaite suite pages do not establish your exact UK procedure or authority connection. That is an evidence boundary, not proof of a missing capability or a reason to declare a winner.',
    choiceTitle: 'Ask each vendor to draw the proposed workflow.',
    choices: [
      ['The iCustoms evaluation', 'Separate iDP intake, human review and exports from UK iCDS submission. Ask which module owns missing-information requests, which jurisdiction is supported, and whether the offer keeps or replaces your present filing system. Do not transfer Ireland product claims into a UK quote.'],
      ['The Customaite evaluation', 'Ask how the proposed compliance, automation and workflow suites combine. Demonstrate invoice/packing-list matching, customer correspondence and the plan that includes the portal. Obtain the exact UK procedure, authority connection and filing responsibility in writing.'],
    ],
    scenarioTitle: 'Use one job to compare modules with suites.',
    scenario: 'Synthetic case: a UK broker receives an invoice and packing list with conflicting weights. A missing origin fact comes back in a customer reply after the first review. The broker must decide whether to keep or replace its filing system.',
    steps: [
      'Have iCustoms label each step as iDP, UK iCDS or another quoted module. Have Customaite label each step with its suite and plan. Record exclusions alongside inclusions.',
      'Show the source for each proposed value, resolve the weight conflict and process the customer reply. Check who can accept the change and which approval must be repeated.',
      'Name the authorised filing party and exact UK procedure. If the existing filing system stays, demonstrate an accepted export; if it changes, demonstrate the proposed authority connection.',
      'Request like-for-like written quotes for setup, users, usage, portal access, support and data exit. Keep unknown amounts blank and do not substitute vendor performance claims for your own measurements.',
    ],
    questions: ['Which country, declaration types, modules and suite plans are in the written offer?', 'Who files, and where can a clerk see and resolve the authority response?', 'What is retained after a changed document, and can we export the evidence history?'],
  },
]

export function validateComparisons(routes = comparisons, data = vendors, refs = sources) {
  const paths = new Set([comparisonRoute.path]); const titles = new Set([comparisonRoute.title])
  for (const r of routes) {
    if (!/^\/compare\/[a-z-]+\/$/.test(r.path) || paths.has(r.path) || titles.has(r.title)) throw new Error('Duplicate or invalid comparison route')
    paths.add(r.path); titles.add(r.title)
    if (r.pair.length !== 2 || new Set(r.pair).size !== 2 || r.pair.some(id => !data[id])) throw new Error('Expected two distinct comparison vendors')
    if (r.id === 'P27' && r.pair.join(',') !== 'icustoms,customaite') throw new Error('Vendor-pair comparison must lead with named vendors')
    for (const field of ['h1','description','reviewedOn','summary','boundary','scenario','scenarioTitle','lead','choiceTitle','eyebrow']) if (!r[field]) throw new Error('Missing page content: '+field)
    if (r.choices.length !== 2 || r.steps.length !== 4 || r.questions.length < 3) throw new Error('Missing decision content')
    for (const id of [...r.pair, ...(r.thirdPath ? ['declarix'] : [])]) for (const [key] of dimensions) {
      const c = data[id].cells[key]
      if (!c || ['product','module','country','sourceUrl','reviewedOn','evidenceType','reviewer','status','text'].some(k => !c[k])) throw new Error('Missing scoped evidence: '+id+'/'+key)
      if (!refs[c.source] || c.sourceUrl !== refs[c.source].url || c.evidenceType !== refs[c.source].type) throw new Error('Unrecognised source')
      if (!['published','source-reviewed','not-verified','editorial-fit'].includes(c.status)) throw new Error('Unrecognised evidence status')
    }
  }
  return true
}
const esc = x => String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
function evidence(c) {
  return `<details class="evidence"><summary>Source and scope</summary><dl><dt>Product / module</dt><dd>${esc(c.product)} / ${esc(c.module)}</dd><dt>Country</dt><dd>${esc(c.country)}</dd><dt>Evidence</dt><dd>${esc(c.evidenceType)} · ${esc(c.status)}</dd><dt>Reviewed</dt><dd>${esc(c.reviewedOn)} · ${esc(c.reviewer)}</dd></dl><a href="${esc(c.sourceUrl)}">${esc(sources[c.source].title)}</a></details>`
}
export function renderVendorComparison(site, route, { webmasterHtml = '' } = {}) {
  validateComparisons([route])
  const pair = route.pair.map(id => vendors[id])
  const usedSources = new Set(['declarix', ...pair.flatMap(p => Object.values(p.cells).map(c => c.source))])
  if (route.id === 'P15') usedSources.add('acquisition')
  const matrix = dimensions.map(([key,label]) => `<tr><th scope="row">${esc(label)}</th>${pair.map(p => `<td><p>${esc(p.cells[key].text)}</p>${evidence(p.cells[key])}</td>`).join('')}</tr>`).join('')
  const refs = [...usedSources].map(id => `<li id="source-${id}"><a href="${esc(sources[id].url)}">${esc(sources[id].title)}</a><p>${esc(sources[id].excerpt)}</p><small>${esc(sources[id].type)}. Reviewed 16 September 2026 by Nadia, Declarix.</small></li>`).join('')
  const schema = { '@context':'https://schema.org', '@type':'WebPage', name:route.title, description:route.description, url:site.origin+route.path, dateModified:reviewedOn, publisher:{'@type':'Organization',name:'Declarix Limited'} }
  const related = [comparisonRoute,...comparisons].filter(r => r.path !== route.path).map(r => `<li><a href="${esc(r.path)}">${esc(r.title)}</a></li>`).join('')
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(route.title)}</title><meta name="description" content="${esc(route.description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${esc(site.origin+route.path)}"><meta property="og:title" content="${esc(route.title)}"><meta property="og:description" content="${esc(route.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${esc(site.origin+route.path)}">${webmasterHtml}<link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/static-routes.css"><link rel="stylesheet" href="/comparison.css"><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script></head><body>
<a class="skip-link" href="#main">Skip to comparison</a><div class="docket"><header class="masthead"><a class="wordmark" href="/">DECLARIX</a><span class="masthead-cell">WORKFLOW COMPARISON · 16 SEP 2026</span><a class="masthead-cta" href="#evaluation">PLAN YOUR EVALUATION</a></header>
<main id="main"><section class="comparison-hero"><p class="section-label">${esc(route.eyebrow)}</p><h1>${esc(route.h1)}</h1><p class="lead">${esc(route.lead)}</p><p>${esc(route.summary)}</p><div class="scope-note"><strong>The boundary that matters:</strong> ${esc(route.boundary)}</div><p class="disclosure">Published by Declarix. This is our scoped comparison, not an independent product test. Vendor statements are attributed below. We do not rank products or claim a measured performance advantage.</p><nav aria-label="On this page"><a href="#comparison">Compare workflows</a><a href="#scenario">Test the same case</a><a href="#evaluation">Evaluation checklist</a><a href="#sources">Sources and corrections</a></nav></section>
<section class="sheet" id="choice"><span class="section-label">01 · CHOOSE THE QUESTION</span><h2>${esc(route.choiceTitle)}</h2><div class="choice-grid">${route.choices.map(([h,p]) => `<article><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div></section>
<section class="sheet" id="comparison"><span class="section-label">02 · SAME DECISION POINTS</span><h2>Keep scope, review and filing separate.</h2><p>“Not verified” means this review does not establish the fact. It does not mean the vendor lacks the feature. Module availability and contract terms need a scoped demonstration.</p><div class="table-scroll" role="region" tabindex="0" aria-label="Workflow comparison table, scroll horizontally on small screens"><table><caption>${esc(pair.map(p => p.name).join(' and '))}, reviewed 16 September 2026</caption><thead><tr><th scope="col">Decision</th>${pair.map(p => `<th scope="col">${esc(p.name)}</th>`).join('')}</tr></thead><tbody>${matrix}</tbody></table></div></section>
<section class="sheet" id="scenario"><span class="section-label">03 · ONE REPRESENTATIVE CASE</span><h2>${esc(route.scenarioTitle)}</h2><p>${esc(route.scenario)} This is an evaluation design, not a customer result.</p><ol>${route.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></section>
${route.thirdPath ? `<section class="sheet" id="third-path"><h2>A limited third path: keep filing, change preparation.</h2><p>If neither broader product change is the goal, evaluate Declarix for case preparation and evidence-linked review beside the filing system you keep. This is not a claim that Declarix replaces either vendor or wins the comparison.</p><p>Declarix does not submit directly to HMRC. The H1 profile is review-only and incomplete. No released customer portal or accepted named connector is claimed.</p><p><a href="#declarix-scope">Read the exact Declarix evidence boundary</a>.</p></section>` : ''}
<section class="sheet" id="evaluation"><span class="section-label">04 · BEFORE YOU COMMIT</span><h2>Get a written scope and test the handoff.</h2><ul>${route.questions.map(q => `<li>${esc(q)}</li>`).join('')}<li>Agree security, access, retention, support hours and data exit before transferring documents.</li><li>Request module, user, setup and usage fees, minimum terms and exclusions. Unknown costs are not zero.</li></ul><p>No current vendor price, measured savings or migration guarantee is supplied here.</p><a class="comparison-cta" href="mailto:${esc(site.contact)}?subject=${encodeURIComponent('Scoped workflow comparison: '+route.title)}">Request a scoped workflow comparison</a><p>Tell us the workflow and filing system you want to keep. Do not attach live customer documents. Agree the scope and secure transfer method first. This enquiry goes to Declarix, not to the other companies named here.</p><p><a href="/compare/automation-vs-outsourcing/">Model costs using your own assumptions</a> · <a href="/security/">Review data-handling questions</a></p></section>
<section class="sheet" id="declarix-scope"><h2>What the Declarix evidence establishes.</h2><p>The 14 September 2026 source review, checked against current claim limits on 16 September, establishes implemented preparation and review controls, not deployed customer acceptance. Customer-return drafts are not a released customer portal.</p><p>The UK H1 profile is review-only and incomplete. Declarix does not submit directly to HMRC. Structural checks are not a complete customs lawbook. Generic export code is not an accepted named connector. No current price, service-level promise or measured savings is claimed.</p></section>
<section class="sheet" id="sources"><span class="section-label">05 · SOURCES AND MAINTENANCE</span><h2>Follow the claim to its source.</h2><p>Official pages describe what vendors say. We did not run hands-on vendor acceptance tests. A vendor case study describes that customer’s implementation, not yours. Fit guidance is our editorial interpretation. No affiliation or endorsement is implied.</p><ul class="source-list">${refs}</ul><p>Nadia owns this comparison. Review due: 16 December 2026, or earlier if a product, plan, jurisdiction or ownership changes. <a href="mailto:${esc(site.contact)}?subject=Comparison%20correction">Send a correction</a>.</p></section>
<section class="sheet" id="related"><h2>Compare a different decision.</h2><ul>${related}</ul></section></main><footer class="comparison-footer">DECLARIX LIMITED · <a href="/privacy/">Privacy</a> · <a href="/editorial-policy/">Editorial policy</a></footer></div></body></html>`
}

// P17 owns the comparison query and the P16 alternatives section. No separate P16 route.
export const comparisonRoute = {
  path: '/compare/declarix-vs-customaite/',
  title: 'Declarix vs Customaite: which workflow fits?',
  h1: 'Declarix vs Customaite: which workflow fits?',
  description: 'Compare preparation, review, filing responsibility and handoff. See Customaite’s published scope, Declarix’s limits and four options to evaluate.',
  reviewedOn: '2026-09-16',
}
export const sources = {
  declarix: { url: '#declarix-scope', title: 'Declarix scope review', type: 'First-party source review, not live acceptance', excerpt: 'Case-based preparation, source-linked review, configured checks and policy-driven approval. H1 remains review-only and incomplete. Direct HMRC submission is outside scope.' },
  home: { url: 'https://www.customaite.ai/home', title: 'Customaite platform', type: 'Official vendor product page', excerpt: 'Describes a workflow from source data through declaration and archive, with compliance, automation and workflow suites.' },
  automation: { url: 'https://www.customaite.ai/solutions/automation', title: 'Customaite automation suite', type: 'Official vendor product page', excerpt: 'Describes automated linking of invoice values and packing-list weights, extraction assistance and declarant tools.' },
  compliance: { url: 'https://www.customaite.ai/customs-compliance-suite', title: 'Customaite compliance suite', type: 'Official vendor product page', excerpt: 'Describes classification assistance, intelligent data validation and trade measures.' },
  workflow: { url: 'https://www.customaite.ai/solutions/workflow', title: 'Customaite workflow suite', type: 'Official vendor product page', excerpt: 'Describes customer correspondence, product data management and a management dashboard.' },
  plans: { url: 'https://www.customaite.ai/plans', title: 'Customaite plans', type: 'Official vendor plans page', excerpt: 'States subscription purchasing and volume-based packages. Includes customer portal in the enterprise package. No currency price was found in the reviewed page.' },
  icustoms: { url: 'https://www.icustoms.ai/uk-cds-import/', title: 'iCustoms iCDS Import & Export', type: 'Official vendor product page', excerpt: 'Describes UK CDS imports and exports, direct HMRC CDS integration, review before submission, and linked iDP document capture and iZap self-service products.' },
  idp: { url: 'https://www.icustoms.ai/intelligent-document-processing/', title: 'iCustoms iDP document processing', type: 'Official vendor product page', excerpt: 'Describes PDF/CSV/Excel intake, iCombine multi-document merging, human review and CSV/Excel/XML/custom-template exports. Authority submission uses separate customs modules; a named third-party handoff is not established.' },
  asm: { url: 'https://www.asm.org.uk/en/our-software/', title: 'ASM Sequoia', type: 'Official vendor product page', excerpt: 'Describes import, export and transit processing, customs and port-community connections, and back-office integration.' },
  descartes: { url: 'https://www.descartes.com/solutions/customs-and-regulatory-compliance/customs-declarations', title: 'Descartes customs declarations', type: 'Official vendor product page', excerpt: 'Identifies e-Customs for the United Kingdom. Wider platform descriptions must not be assumed to apply to every UK module.' },
}
export const dimensions = [
  ['jurisdiction', 'Country and declaration scope'],
  ['filing', 'Preparation or direct filing'],
  ['intake', 'Mixed-source intake and review'],
  ['exceptions', 'Missing facts and human decisions'],
  ['approval', 'Assignment, approval and evidence history'],
  ['handoff', 'Output and accepted handoff'],
  ['implementation', 'Implementation and support'],
  ['pricing', 'Pricing basis and inclusions'],
  ['fit', 'Best fit and no fit'],
]
const cell = (product, country, source, text, status = 'published', module = product) => ({
  product, module, country, source, sourceUrl: sources[source].url,
  reviewedOn: comparisonRoute.reviewedOn, evidenceType: sources[source].type,
  reviewer: 'Nadia, Declarix', status, text,
})
const d = (text, status = 'source-reviewed') => cell('Declarix', 'UK H1 review profile only; incomplete', 'declarix', text, status, 'Case preparation and review workspace')
const c = (source, text, status = 'published', module = 'Platform; confirm suite and plan') => cell('Customaite', 'UK declaration types not verified from these broad suite pages', source, text, status, module)
const i = (text, status = 'published', module = 'iCDS Import & Export') => cell('iCustoms', 'UK; import and export as described by vendor', 'icustoms', text, status, module)
const idp = (text, status = 'published') => cell('iCustoms', 'iDP page; country coverage must be confirmed separately', 'idp', text, status, 'iDP document processing, separate from iCDS filing')
const a = (text, status = 'published') => cell('ASM Sequoia', 'UK supplier context; confirm exact declaration types', 'asm', text, status, 'Sequoia customs clearance')
const e = (text, status = 'published') => cell('Descartes', 'United Kingdom e-Customs; do not infer global module features', 'descartes', text, status, 'UK e-Customs')
export const products = [
  { id: 'declarix', name: 'Declarix', role: 'Preparation and review', cells: {
    jurisdiction: d('The reviewed UK H1 import profile is review-only and incomplete. It must not be treated as ready for filing.'),
    filing: d('Prepares and reviews proposed declaration data. Declarix does not submit directly to HMRC. The broker keeps filing responsibility.'),
    intake: d('Source supports case-based mixed document intake and proposed values with source evidence. Test your formats and fields; universal coverage is not claimed.'),
    exceptions: d('Request tracking, reply matching and human resolution are implemented in source. A “sent” status is not proof of email delivery. Customer self-service is not released.'),
    approval: d('Assignment, recorded decisions and policy-driven second approval are implemented in source. They are not a universal junior/senior workflow.'),
    handoff: d('Generic controlled pack and export preparation does not establish a tested Sequoia, Descartes or CargoWise connector. Named recipient acceptance is not verified.', 'not-verified'),
    implementation: d('Agree document scope, permissions, checks and the recipient test before a pilot. Customer deployment acceptance and support terms are not verified.', 'not-verified'),
    pricing: d('No current price or pilot fee is quoted here. Request written scope, inclusions and terms; do not use an old offer as a current quote.', 'not-verified'),
    fit: d('Evaluate for evidence-linked preparation and review alongside an existing filing system. Not a fit if you need direct HMRC submission or a complete, filing-ready H1 profile today.', 'editorial-fit'),
  } },
  { id: 'customaite', name: 'Customaite', role: 'Broader customs suite', cells: {
    jurisdiction: c('home', 'Publishes a broad customs platform scope. Exact UK declaration types and plan coverage are not verified here; request them in writing.', 'not-verified'),
    filing: c('home', 'Describes a source-data-to-declaration-to-archive workflow. That is broader than preparation alone; confirm who files and the UK authority connection in the proposed configuration.'),
    intake: c('automation', 'Describes extraction assistance and automated linking of invoice values with packing-list weights. Source-to-field evidence behavior should be demonstrated on your pack.', 'published', 'Automation suite'),
    exceptions: c('workflow', 'Describes a customer communication portal for missing or incorrect information. Check which plan includes it and how a clerk accepts a reply.', 'published', 'Workflow suite / customer portal'),
    approval: c('workflow', 'The vendor describes an audit trail for customer exchanges and management tools. Exact assignment and second-approval rules are not verified here.', 'not-verified', 'Workflow suite'),
    handoff: c('home', 'An end-to-end platform description is not proof of an accepted export into your existing system. Exact formats, mappings and recipient acceptance are not verified.', 'not-verified'),
    implementation: c('plans', 'The vendor describes implementation guidance and integration with existing IT. This is a vendor statement, not a measured migration effort or a verified support agreement.'),
    pricing: c('plans', 'Publishes a subscription model and volume-based packages. No currency price was found in the reviewed plans page. Request a quote for modules, setup, support and usage; do not assume portal access in every package.'),
    fit: c('compliance', 'Evaluate when you want a broader suite covering preparation, compliance assistance and customer workflow. If you need confirmed UK coverage or a specific handoff, settle those points before choosing.', 'editorial-fit', 'Compliance, automation and workflow suites'),
  } },
  { id: 'icustoms', name: 'iCustoms', role: 'UK filing product family', cells: {
    jurisdiction: i('The vendor describes UK CDS imports and exports. Confirm the declaration categories and procedures you need.'),
    filing: i('States direct HMRC CDS integration and a review-then-submit process. This is a vendor statement, not our filing acceptance test.'),
    intake: idp('iDP describes PDF, CSV and Excel intake by upload, email or API; iCombine merges shipment data from multiple documents. Human checks are described. Demonstrate source-to-field review on your pack.'),
    exceptions: i('Describes review of suggested edits and links a self-service product. The missing-information request and reply workflow is not verified.', 'not-verified', 'iCDS; iZap linked separately'),
    approval: i('Assignment, separation of duties and evidence-history controls are not verified from this product page.', 'not-verified'),
    handoff: idp('iDP describes CSV, Excel, XML and custom-template exports, plus drafts within its customs modules. An accepted mapping to a named third-party filing system is not verified.', 'not-verified'),
    implementation: i('Describes account registration and onboarding. Required setup work, service levels and migration effort are not verified.', 'not-verified'),
    pricing: i('Pricing and module inclusions are not verified from this page. Request a quote; unknown fees are not zero.', 'not-verified'),
    fit: i('Evaluate if UK CDS filing and linked document capture are part of the decision. If you only want preparation while keeping another filing system, verify that handoff separately.', 'editorial-fit'),
  } },
  { id: 'asm', name: 'ASM Sequoia', role: 'Customs clearance platform', cells: {
    jurisdiction: a('Describes import, export and transit processing. Confirm your exact UK declaration types and procedure scope.'),
    filing: a('Describes connections to customs and port-community systems. Evaluate as a clearance platform, not just a document-preparation tool.'),
    intake: a('Describes sharing data with back-office and customer systems. Mixed-document extraction and source-linked review are not verified from this page.', 'not-verified'),
    exceptions: a('A customer request-and-reply workflow is not verified from the reviewed page.', 'not-verified'),
    approval: a('Exact assignment, approval and evidence-history controls are not verified from the reviewed page.', 'not-verified'),
    handoff: a('Describes back-office integration. Exact output formats and a tested mapping for your destination are not verified.', 'not-verified'),
    implementation: a('Implementation effort and support agreement are not verified from this page.', 'not-verified'),
    pricing: a('No price or pricing basis is verified here. Request a quote for the selected scope.', 'not-verified'),
    fit: a('Evaluate if the core decision is customs clearance with port-community connections. If preparation is the bottleneck in a system you already use, compare an upstream workflow too.', 'editorial-fit'),
  } },
  { id: 'descartes', name: 'Descartes e-Customs', role: 'UK customs clearance', cells: {
    jurisdiction: e('The official declarations page identifies e-Customs for the United Kingdom. Exact UK declaration-type coverage is not verified here.'),
    filing: e('Positioned for UK customs clearance within the declarations product family. Confirm the authority connection and responsibilities for your selected service.'),
    intake: e('The wider declarations page describes data capture. UK e-Customs mixed-document and source-linked review coverage is not verified; global features are not assumed.', 'not-verified'),
    exceptions: e('The UK-specific missing-information and customer-reply workflow is not verified from the reviewed page.', 'not-verified'),
    approval: e('UK-module assignment, approval and evidence-history controls are not verified from this page.', 'not-verified'),
    handoff: e('Exact UK output formats, mappings and accepted connections to your other systems are not verified here.', 'not-verified'),
    implementation: e('UK implementation work and support terms are not verified from this page.', 'not-verified'),
    pricing: e('UK-module pricing and inclusions are not verified. Request a scoped quote.', 'not-verified'),
    fit: e('Evaluate when UK customs clearance is the main requirement. Do not select a UK module on global feature copy alone; demonstrate the local workflow and handoff.', 'editorial-fit'),
  } },
]
export function validateComparison(data = products) {
  if (data.length !== 5 || new Set(data.map(p => p.id)).size !== 5) throw new Error('Expected focal vendor and four distinct options')
  for (const p of data) for (const [key] of dimensions) {
    const v = p.cells[key]
    if (!v || ['product','module','country','sourceUrl','reviewedOn','evidenceType','reviewer','status','text'].some(k => !v[k])) throw new Error(`Missing evidence: ${p.id}/${key}`)
    if (!sources[v.source] || v.sourceUrl !== sources[v.source].url) throw new Error('Unrecognised source')
    if (!['published','source-reviewed','not-verified','editorial-fit'].includes(v.status)) throw new Error('Unrecognised evidence status')
  }
  return true
}
const esc = x => String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
function evidence(v) {
  return `<details class="evidence"><summary>Source and scope</summary><dl><dt>Product / module</dt><dd>${esc(v.product)} / ${esc(v.module)}</dd><dt>Country</dt><dd>${esc(v.country)}</dd><dt>Evidence</dt><dd>${esc(v.evidenceType)} · ${esc(v.status)}</dd><dt>Reviewed</dt><dd>${esc(v.reviewedOn)} · ${esc(v.reviewer)}</dd></dl><a href="${esc(v.sourceUrl)}">${esc(sources[v.source].title)}</a></details>`
}
export function renderComparison(site, { webmasterHtml = '' } = {}) {
  validateComparison()
  const route = comparisonRoute
  const matrix = dimensions.map(([key,label]) => `<tr><th scope="row">${esc(label)}</th>${products.slice(0,2).map(p => `<td><p>${esc(p.cells[key].text)}</p>${evidence(p.cells[key])}</td>`).join('')}</tr>`).join('')
  const alternatives = products.filter(p=>p.id!=='customaite').map(p => `<article class="option" id="option-${p.id}"><h3>${esc(p.name)}</h3><p class="tag">${esc(p.role)}</p><p>${esc(p.cells.fit.text)}</p><details><summary>Compare the same nine decision points</summary><dl>${dimensions.map(([key,label])=>`<dt>${esc(label)}</dt><dd><p>${esc(p.cells[key].text)}</p>${evidence(p.cells[key])}</dd>`).join('')}</dl></details></article>`).join('')
  const refs = Object.entries(sources).map(([id,s]) => `<li id="source-${id}"><a href="${esc(s.url)}">${esc(s.title)}</a><p>${esc(s.excerpt)}</p><small>${esc(s.type)}. Reviewed 16 September 2026 by Nadia, Declarix.</small></li>`).join('')
  const schema = { '@context':'https://schema.org', '@type':'WebPage', name:route.title, description:route.description, url:site.origin+route.path, dateModified:route.reviewedOn, publisher:{'@type':'Organization',name:'Declarix Limited'} }
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(route.title)}</title><meta name="description" content="${esc(route.description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${site.origin}${route.path}"><meta property="og:title" content="${esc(route.title)}"><meta property="og:description" content="${esc(route.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${site.origin}${route.path}">${webmasterHtml}<link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/static-routes.css"><link rel="stylesheet" href="/comparison.css"><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script></head><body>
<a class="skip-link" href="#main">Skip to comparison</a><div class="docket"><header class="masthead"><a class="wordmark" href="/">DECLARIX</a><span class="masthead-cell">WORKFLOW COMPARISON · 16 SEP 2026</span><a class="masthead-cta" href="#evaluation">PLAN YOUR EVALUATION</a></header>
<main id="main"><section class="comparison-hero"><p class="section-label">PREPARATION, REVIEW OR A WIDER CUSTOMS SUITE?</p><h1>${route.h1}</h1><p class="lead">Start with the work you need to change, not a feature count.</p><p>Customaite describes a broader customs suite spanning source data, compliance assistance, customer workflow and declarations. Declarix focuses on case preparation and evidence-linked review alongside the system your broker uses to file.</p><div class="scope-note"><strong>The difference that matters:</strong> Declarix does not submit directly to HMRC. Its reviewed H1 import profile is review-only and incomplete. For Customaite, confirm the exact UK declaration scope and filing connection before treating broad suite features as a local commitment.</div><p class="disclosure">Published by Declarix. This is our scoped comparison, not an independent product test. Vendor statements are attributed below. We do not rank the products or claim a measured performance advantage.</p><nav aria-label="On this page"><a href="#comparison">Compare workflows</a><a href="#scenario">Test the same case</a><a href="#alternatives">Customaite alternatives</a><a href="#sources">Sources and corrections</a></nav></section>
<section class="sheet" id="choice"><span class="section-label">01 · CHOOSE THE QUESTION</span><h2>A broader suite, or better preparation inside the estate you keep?</h2><div class="choice-grid"><article><h3>When Customaite may be the better fit</h3><p>If you want to evaluate customer communication, master data, compliance assistance and declaration workflow together, Customaite’s published suite gives you a broader shortlist. Its automation pages describe matching information across invoices and packing lists. Its compliance pages describe classification, validation and trade measures.</p><p>Ask for the UK configuration, the plan that includes each module, and a demonstration of who can approve and file. Those points decide fit more than a general automation claim.</p></article><article><h3>When to evaluate Declarix</h3><p>If your first problem is assembling a job, resolving conflicting facts and keeping evidence beside review decisions, evaluate Declarix as an upstream preparation workspace. Keep filing responsibility with your broker and existing filing system.</p><p>Do not choose Declarix as a direct-filing replacement or assume a named connector is accepted. Scope the first workflow and recipient test before committing to a pilot.</p></article></div></section>
<section class="sheet" id="comparison"><span class="section-label">02 · SAME DECISION POINTS</span><h2>Separate the workflow from the filing responsibility.</h2><p>“Not verified” means this review does not establish the fact. It does not mean a vendor lacks the feature. Module availability and contract terms need a scoped demonstration.</p><div class="table-scroll" role="region" tabindex="0" aria-label="Workflow comparison table, scroll horizontally on small screens"><table><caption>Declarix and Customaite, reviewed 16 September 2026</caption><thead><tr><th scope="col">Decision</th><th scope="col">Declarix</th><th scope="col">Customaite</th></tr></thead><tbody>${matrix}</tbody></table></div></section>
<section class="sheet" id="scenario"><span class="section-label">03 · ONE REPRESENTATIVE CASE</span><h2>Use one pack to expose the difference.</h2><p><strong>Synthetic evaluation scenario, not a customer result:</strong> a broker receives an invoice and packing list with different weights. One goods line lacks an origin statement. A revised packing list arrives after the first review.</p><ol><li><strong>Assemble:</strong> show which source supports each proposed weight and value. Do not conceal disagreement behind a single confidence score.</li><li><strong>Ask:</strong> show who requests the missing fact, how the customer replies, and how the clerk accepts or rejects it. A portal, a sent marker and verified delivery are different things.</li><li><strong>Review again:</strong> identify the replacement document and the decisions that need rechecking. Show assignment, approval rules and the evidence history.</li><li><strong>Hand off or file:</strong> name the authorised filing party, output format, destination and acceptance test. Demonstrate the exact UK procedure, not an unrelated jurisdiction.</li></ol><p>For Customaite, use this case to test how its selected suites work together. For Declarix, use it to test preparation and review only. Do not ask an incomplete H1 profile to demonstrate filing readiness.</p></section>
<section class="sheet" id="alternatives"><span class="section-label">04 · CUSTOMAITE ALTERNATIVES</span><h2>Four options, not four interchangeable replacements.</h2><p>The common question is how a UK broker prepares, reviews and hands off or files a customs job. These options operate at different points in that workflow. Each uses the same nine decision points. This is a scoped shortlist, not a best-software ranking.</p><div class="options">${alternatives}</div></section>
<section class="sheet" id="evaluation"><span class="section-label">05 · BEFORE YOU COMMIT</span><h2>Get the same answers and a written scope.</h2><ul><li>Name the country, declaration types, procedures, document formats and monthly workload.</li><li>Ask who submits, under whose permissions, and what happens when a case cannot proceed.</li><li>Demonstrate source evidence, conflicting values, replacement documents and approval rules.</li><li>Agree the exact recipient mapping or filing connection and record acceptance on a representative case.</li><li>Request setup effort, support hours, security terms, data location, retention and access rules.</li><li>Ask for module, usage, user and setup fees, minimum terms and exclusions. Leave unknown costs unknown, not zero.</li></ul><p>No vendor price or savings estimate is supplied here. Use written quotes and your measured review time before making a cost comparison.</p><a class="comparison-cta" href="mailto:${esc(site.contact)}?subject=Scoped%20Declarix%20and%20Customaite%20workflow%20comparison">Request a scoped workflow comparison</a><p>Tell us the workflow and filing system you want to keep. Do not attach live customer documents. Agree the scope and secure transfer method first.</p><p><a href="/compare/automation-vs-outsourcing/">Model preparation costs with your own assumptions</a> · <a href="/security/">Review data-handling questions</a></p></section>
<section class="sheet" id="declarix-scope"><h2>What the Declarix evidence establishes.</h2><p>This comparison uses the 14 September 2026 source review, checked against the current claim limits on 16 September. It establishes implemented preparation and review controls, not deployed customer acceptance. The customer-return drafts are not a released customer portal.</p><p>The UK H1 profile remains review-only and incomplete. Configured structural and consistency checks are not a complete customs lawbook. Generic export code is not proof of an accepted named connector. No direct HMRC submission, current price, service-level promise or measured savings is claimed.</p></section>
<section class="sheet" id="sources"><span class="section-label">06 · SOURCES AND MAINTENANCE</span><h2>Follow the claim to its source.</h2><p>Official pages describe what vendors say about their products. We did not conduct hands-on vendor acceptance tests. Fit guidance is our editorial interpretation of that scoped evidence. No affiliation or endorsement is implied.</p><ul class="source-list">${refs}</ul><p>Nadia owns this comparison. Next scheduled review: 16 December 2026. Review earlier if a product, plan, jurisdiction or ownership changes. <a href="mailto:${esc(site.contact)}?subject=Comparison%20correction">Send a correction</a>.</p></section></main><footer class="comparison-footer">DECLARIX LIMITED · <a href="/privacy/">Privacy</a> · <a href="/editorial-policy/">Editorial policy</a></footer></div></body></html>`
}

// B01-PAGES: LOCAL PREVIEW ONLY until importer validation and publication approval.
// No workflow route is emitted by the production generator.
export const customerWorkflowRoutes = [
  { path: '/use-cases/customer-document-requests/', title: 'Request missing customs documents without losing the case | Declarix', h1: 'Keep missing information tied to the customs case.', description: 'Walk through a customs document request from a specific missing fact to a customer reply and broker review. See what happens when the evidence changes.', updatedOn: '2026-09-16', audience: 'broker' },
  { path: '/use-cases/importers/', title: 'Prepare customs documents for your broker | Declarix', h1: 'Give your broker the missing information they need.', description: 'Understand a broker’s customs document request, check the requested evidence and follow a worked reply example. Your broker keeps review and filing responsibility.', updatedOn: '2026-09-16', audience: 'importer' },
]

export const requestExample = [
  { state: 'Draft', actor: 'Broker', title: 'Ask for the fact that is missing.', body: 'Fictional case DEMO-104 has an invoice with no Incoterm. The broker drafts one item: “Please provide a revised commercial invoice showing the agreed Incoterm and named place.”', evidence: 'No customer reply is accepted while the request is a draft.' },
  { state: 'Approved', actor: 'Authorised operator', title: 'Check the request before it leaves the team.', body: 'An authorised operator approves the wording and the intended recipient. Approval is not a record that the customer received it.', evidence: 'The request is approved, but is not yet available for a customer return.' },
  { state: 'Sent', actor: 'Operator', title: 'Record that the request was sent.', body: 'The operator records the sending action. The customer uses the permitted return route for this case and request, after access is arranged.', evidence: 'Sent is an operator record, not email delivery proof. The return screen does not send invitations or grant access.' },
  { state: 'Replied · pending review', actor: 'Customer', title: 'Return the answer to the right item.', body: 'The customer supplies the fictional revised invoice, version 1, showing “FCA, Coventry warehouse”. The item now has returned evidence for the broker to check.', evidence: 'Receipt is not acceptance. The reply does not automatically confirm sufficiency or release a pack.' },
  { state: 'Resolved', actor: 'Broker', title: 'Confirm the evidence, then resolve the request.', body: 'The broker checks the returned invoice against the request and the rest of the case. In this example, they confirm that it answers the item and explicitly resolve the request.', evidence: 'Resolving this request is not shipment clearance. Other checks, approvals and current-snapshot release gates still apply.' },
  { state: 'Replied · review reopened', actor: 'Customer, then broker', title: 'A changed document needs a fresh review.', body: 'The customer replaces the same item’s invoice with version 2, now showing “DAP, Leeds warehouse”. The earlier human decision stays in the history but no longer counts as acceptance of the new evidence.', evidence: 'The broker must review the changed evidence again. Reprocessing or cancelling the request does not make the earlier acceptance valid for the replacement.' },
]

const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
export function renderCustomerWorkflow(route, site, { webmasterHtml = '' } = {}) {
  if (!customerWorkflowRoutes.includes(route)) throw new Error('Unknown customer workflow route')
  const broker = route.audience === 'broker'
  const counterpart = customerWorkflowRoutes[broker ? 1 : 0]
  const canonical = site.origin + route.path
  const intro = broker
    ? 'Turn “please send the missing documents” into a clear request for one case. Keep the answer, the evidence version and the broker’s review together, so a reply does not disappear into a separate email thread.'
    : 'Start with the exact question your broker asked. Return the requested fact or document to that item, and distinguish “received” from “reviewed”. You supply the evidence. Your broker reviews the case.'
  const preparation = broker ? [
    ['Name the gap', 'Say which fact or inconsistency prevents the next review step. Ask for the evidence that can answer it, rather than sending a generic document checklist.'],
    ['Keep the work visible', 'A case can still need work while the team waits for a reply. A request status is not a substitute for the case’s checks, assignment or approval state.'],
    ['Review the changed evidence', 'Compare the reply with the original question and other case documents. If the facts change, reopen the relevant review instead of carrying an old confirmation forward.'],
  ] : [
    ['Read the exact request', 'Check the case and item before preparing your answer. If the wording is unclear or the information is unavailable, ask your broker what they need. Do not guess a value.'],
    ['Check the version', 'If an invoice or other document changed, identify it as a replacement for the requested item. Explain the change to your broker rather than assuming an earlier review still applies.'],
    ['Let your broker decide sufficiency', 'A received reply can still need clarification. The required documents depend on the goods, movement and procedure. This page is not a universal document or licence list.'],
  ]
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': canonical, url: canonical, name: route.title, description: route.description, publisher: { '@type': 'Organization', name: 'Declarix', url: site.origin } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.origin + '/' }, { '@type': 'ListItem', position: 2, name: broker ? 'Customer document requests' : 'Importers', item: canonical }] },
  ] }
  return `<!doctype html><html lang="en-GB"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(route.title)}</title><meta name="description" content="${esc(route.description)}">
<link rel="canonical" href="${canonical}"><meta name="robots" content="noindex,nofollow">
<link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/static-routes.css"><link rel="stylesheet" href="/customer-workflows.css">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(route.title)}"><meta property="og:description" content="${esc(route.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site.origin}/og.jpg">
${webmasterHtml}<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>
</head><body><a class="skip-link" href="#main">Skip to content</a><div class="docket customer-workflow">
<header class="masthead"><a class="wordmark" href="/">DECLARIX</a><div class="masthead-cell"><span>CASE PREPARATION</span><strong>HUMAN REVIEW</strong></div><a class="masthead-cta" href="/pilot/">DISCUSS A PILOT</a></header>
<nav class="route-nav" aria-label="Primary"><a href="/how-it-works/">HOW IT WORKS</a><a href="/use-cases/customer-document-requests/">DOCUMENT REQUESTS</a><a href="/use-cases/importers/">FOR IMPORTERS</a><a href="/supported-scope/">SCOPE</a><a href="/pilot/">PILOT</a></nav>
<div class="breadcrumbs"><a href="/">HOME</a> → ${broker ? 'CUSTOMER DOCUMENT REQUESTS' : 'IMPORTER WORKFLOW'}</div>
<main id="main"><header class="hero"><div class="hero-copy"><p class="eyebrow">${broker ? 'BROKER WORKFLOW · MISSING INFORMATION' : 'IMPORTER WORKFLOW · ANSWER YOUR BROKER'}</p><h1>${esc(route.h1)}</h1><p>${esc(intro)}</p><a class="button" href="#worked-example">${broker ? 'Walk through a missing-information case' : 'See a broker request and reply'}</a></div>
<aside class="hero-ledger"><span class="route-ref">ONE CASE · ONE REQUEST · ONE EVIDENCE TRAIL</span><div class="stamp">REQUEST<br>RETURN<br>REVIEW</div><p>Keep the missing fact visible. Keep the decision with the broker.</p></aside></header>
<div class="hero-value-strip"><strong>SPECIFIC QUESTION</strong><strong>CASE-LINKED REPLY</strong><strong>FRESH HUMAN REVIEW</strong></div>
<section class="workflow-intro" aria-labelledby="prepare"><p class="section-label">${broker ? 'BEFORE YOU SEND' : 'BEFORE YOU REPLY'}</p><h2 id="prepare">${broker ? 'Make the next answer useful.' : 'Send an answer your broker can use.'}</h2><div class="workflow-cards">${preparation.map(([title, text]) => `<article><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div></section>
<section id="worked-example" class="workflow-example" aria-labelledby="example-title"><p class="section-label">FICTIONAL WORKED EXAMPLE · NO CUSTOMER DATA</p><h2 id="example-title">From a missing Incoterm to a reviewed reply.</h2><p>This example explains the workflow. It is not a live customer request or a product account. No files are uploaded and no message is sent. The places and terms below are fictional, not a customs recommendation.</p>
<div class="example-controls" hidden><button type="button" id="previous-step">Previous example step</button><p id="example-progress" role="status" aria-live="polite"></p><button type="button" id="next-step">Next example step</button><button type="button" id="show-all">Show all steps</button></div>
<ol class="example-steps">${requestExample.map((step, index) => `<li class="example-step" data-example-step="${index}"><div class="step-meta"><span>STEP ${index + 1} / ${requestExample.length}</span><strong>${esc(step.state)}</strong><span>${esc(step.actor)}</span></div><h3 tabindex="-1">${esc(step.title)}</h3><p>${esc(step.body)}</p><p class="evidence-note">${esc(step.evidence)}</p></li>`).join('')}</ol>
<noscript><p>All six steps are shown above. You do not need JavaScript to read the example.</p></noscript></section>
<section class="workflow-intro" aria-labelledby="responsibilities"><p class="section-label">WHO DOES WHAT</p><h2 id="responsibilities">A reply supplies evidence. A person makes the decision.</h2><div class="workflow-cards responsibility-map"><article><h3>Customer</h3><p>Answers the specific request. Supplies or corrects the evidence. Does not approve the declaration or release the case through the return screen.</p></article><article><h3>Permitted return route</h3><p>The pilot return route must connect each reply to its organisation, case, request item and evidence version. A link alone does not grant access. The public walkthrough does not open that route.</p></article><article><h3>Broker</h3><p>Checks sufficiency, handles conflicts and confirms any changed evidence. The broker remains responsible for approval and filing. Declarix does not submit to HMRC.</p></article></div></section>
<section class="workflow-intro" aria-labelledby="questions"><h2 id="questions">Before you use a customer return workflow</h2>
<details><summary>What happens if a reply is repeated or does not match?</summary><p>A repeated submission is not a second approval. A pilot return flow must reject duplicate or invalid item targets. Unmatched evidence needs an operator to route it; it must not silently clear another request. Refresh the request after a conflict rather than repeatedly sending the same reply.</p></details>
<details><summary>Does “sent” mean an email was delivered?</summary><p>No. It records an operator action. It is not an email delivery service or proof that a customer received a message.</p></details>
<details><summary>Can a replacement keep the earlier approval?</summary><p>No. A material replacement for the same item requires fresh broker confirmation. The earlier decision remains part of the history, not acceptance of the changed document. Other case checks still apply.</p></details>
<details><summary>${broker ? 'How do we try this with our customers?' : 'Can I upload my documents here?'}</summary><p>This public page does not accept documents or create customer accounts. <a href="/pilot/">Discuss the workflow for an agreed pilot</a>, including access, document scope and the approved transfer channel. Confirm deployment availability with the team before asking a customer to use it.</p></details>
</section>
<section class="workflow-intro"><h2>${broker ? 'Make the customer’s side clear, too.' : 'Understand what happens after you reply.'}</h2><p><a href="${counterpart.path}">${broker ? 'See the importer’s guide to answering a broker request' : 'See the broker’s request and review workflow'}</a>. Then check <a href="/how-it-works/">the wider preparation workflow</a> and <a href="/supported-scope/">the supported scope</a>.</p><p class="editorial-note">Editorial owner: Nadia, Declarix. Example basis: the case-linked request and human-review workflow. This is a fictional illustration, not a customer result or importer validation study.</p></section>
<section class="cta-band"><div><h2>${broker ? 'Bring one recurring missing-information problem.' : 'Make your next broker request easier to answer.'}</h2><p>${broker ? 'Discuss the request, the return path and the review step your team needs. Agree scope and access before any live documents move.' : 'Discuss the importer workflow with your broker and the Declarix team. Agree the right access and transfer channel before sharing documents.'}</p></div><a class="button" href="/pilot/">${broker ? 'DISCUSS A CUSTOMER-RETURN PILOT' : 'DISCUSS THE IMPORTER WORKFLOW'}</a></section>
</main><footer class="footer"><span>${esc(site.company || 'Declarix Limited')} · CASE PREPARATION AND REVIEW</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/editorial-policy/">EDITORIAL POLICY</a></nav></footer></div>
<script>${exampleController.toString()}; exampleController();</script></body></html>`
}

function exampleController() {
  const steps = Array.from(document.querySelectorAll('[data-example-step]'))
  const controls = document.querySelector('.example-controls')
  const previous = document.getElementById('previous-step')
  const next = document.getElementById('next-step')
  const all = document.getElementById('show-all')
  const progress = document.getElementById('example-progress')
  let current = 0
  function show(focus) {
    steps.forEach((step, index) => { step.hidden = index !== current })
    previous.disabled = current === 0
    next.disabled = current === steps.length - 1
    progress.textContent = 'Example step ' + (current + 1) + ' of ' + steps.length
    if (focus) steps[current].querySelector('h3').focus()
  }
  previous.addEventListener('click', () => { current = Math.max(0, current - 1); show(true) })
  next.addEventListener('click', () => { current = Math.min(steps.length - 1, current + 1); show(true) })
  all.addEventListener('click', () => {
    steps.forEach(step => { step.hidden = false })
    progress.textContent = 'All six example steps are shown.'
    previous.disabled = false
    next.disabled = false
    current = 0
    steps[0].querySelector('h3').focus()
  })
  controls.hidden = false
  show(false)
}

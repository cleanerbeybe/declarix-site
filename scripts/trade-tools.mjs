// Free trade tools, round 2 (lane L10, 15 Oct 2026): MRN checker, GMR checker,
// postponed VAT statement reconciler, import duty repayment (C285) checker and
// commodity code checker. Every tool runs in the browser. The logic lives in
// scripts/trade-tools/*.mjs, is unit-tested with node --test, and is inlined into
// the page script so the page loads no external JavaScript. Each page's copy,
// worked example and behaviour lives in scripts/trade-tools/pages/.
import { readFileSync } from 'node:fs'
import { PACK_CHECK, REVIEWED, escapeHtml, isLive, publishedTradeTools } from './trade-tools/page-kit.mjs'
import mrnChecker from './trade-tools/pages/mrn.mjs'
import gmrChecker from './trade-tools/pages/gmr.mjs'
import pvaChecker from './trade-tools/pages/pva.mjs'
import repaymentChecker from './trade-tools/pages/c285.mjs'
import commodityChecker from './trade-tools/pages/commodity.mjs'

// Inline a logic module for the browser: drop import lines and export keywords.
export function inlineModule(name) {
  return readFileSync(new URL(`./trade-tools/${name}.mjs`, import.meta.url), 'utf8')
    .replace(/^import .*$/gm, '')
    .replace(/^export (const|function|class|let) /gm, '$1 ')
}

export const tradeTools = [mrnChecker, gmrChecker, pvaChecker, repaymentChecker, commodityChecker]
for (const tool of tradeTools) publishedTradeTools.add(tool.path)

const RELATED_NAMES = {
  '/tools/mrn-checker/': ['FREE TOOL', 'MRN checker and decoder'],
  '/tools/gmr-checker/': ['FREE TOOL', 'GMR checker and GVMS reference planner'],
  '/tools/postponed-vat-statement-checker/': ['FREE TOOL', 'Postponed VAT statement reconciler'],
  '/tools/import-duty-repayment-checker/': ['FREE TOOL', 'C285 import duty repayment checker'],
  '/tools/commodity-code-checker/': ['FREE TOOL', 'Commodity code checker'],
  '/tools/customs-value-import-duty-vat-calculator/': ['FREE WORKPAPER', 'Customs value, duty and import VAT calculator'],
  '/customs-workflows/gmr-gvms-checklist/': ['WORKFLOW', 'GMR and GVMS five-step checklist'],
  '/customs-workflows/postponed-vat-accounting-checklist/': ['WORKFLOW', 'Postponed VAT accounting checklist'],
}

function clientScript(tool, posthogKey, posthogHost) {
  const config = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  const modules = tool.modules.map(inlineModule).join('\n')
  return `<script>
    (() => {
      ${modules}
      const config = ${config};
      const toolId = '${tool.id}';
      const form = document.getElementById('tt-form');
      const result = document.getElementById('tt-result');
      const resultBody = document.getElementById('tt-result-body');
      const status = document.getElementById('tt-status');
      const exampleButton = document.querySelector('[data-tt-example]');
      let started = false;
      let lastCopy = '';
      let lastCsv = '';
      const esc = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
      const get = (key) => { try { return sessionStorage.getItem(key) || ''; } catch { return ''; } };
      const set = (key, value) => { try { sessionStorage.setItem(key, value); } catch {} };
      const attribution = () => {
        const params = new URLSearchParams(location.search);
        const incoming = { source: params.get('utm_source') || params.get('src') || '', medium: params.get('utm_medium') || '', campaign: params.get('utm_campaign') || '', content: params.get('utm_content') || '', term: params.get('utm_term') || '' };
        Object.entries(incoming).forEach(([key, value]) => { if (value && !get('dclrx-' + key)) set('dclrx-' + key, value); });
        return Object.fromEntries(Object.keys(incoming).map((key) => [key, get('dclrx-' + key) || (key === 'source' ? 'direct' : 'none')]));
      };
      const distinctId = get('dclrx-distinct-id') || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
      set('dclrx-distinct-id', distinctId);
      // Analytics carry outcome categories and counts only: never an MRN, GMR, amount, file or search text.
      const track = (event, properties = {}) => {
        const payload = { ...attribution(), ...properties, tool_id: toolId, page_path: location.pathname };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event, ...payload });
        if (!config.posthogKey) return;
        const body = JSON.stringify({ api_key: config.posthogKey, event, distinct_id: distinctId, properties: payload });
        if (navigator.sendBeacon && navigator.sendBeacon(config.posthogHost + '/capture/', body)) return;
        fetch(config.posthogHost + '/capture/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => null);
      };
      const showResult = (html, properties = {}) => {
        resultBody.innerHTML = html;
        result.hidden = false;
        track(started ? 'tool_completed' : 'tool_started', properties);
        if (!started) track('tool_completed', properties);
        started = true;
        result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      };
      document.getElementById('tt-copy').addEventListener('click', async () => {
        const text = lastCopy || resultBody.innerText;
        try { await navigator.clipboard.writeText(text); status.textContent = 'Result copied.'; track('tool_result_copied'); }
        catch { status.textContent = 'Copy was blocked by the browser. Use print instead.'; }
      });
      document.getElementById('tt-print').addEventListener('click', () => { track('tool_result_printed'); window.print(); });
      document.querySelectorAll('[data-tt-pack]').forEach((link) => link.addEventListener('click', () => track('tool_pack_check_clicked', { placement: link.dataset.ttPack })));
      document.querySelectorAll('[data-tt-booking]').forEach((link) => link.addEventListener('click', () => track('tool_booking_clicked', { placement: link.dataset.ttBooking })));
      document.querySelectorAll('[data-tt-pilot]').forEach((link) => link.addEventListener('click', () => track('tool_pilot_clicked', { placement: link.dataset.ttPilot })));
      ${tool.behaviour}
      attribution();
    })();
  </script>`
}

// ---------------------------------------------------------------------------
// Shared page shell
// ---------------------------------------------------------------------------
function jsonLd(tool, site) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.origin}/#organization`,
        name: site.company,
        legalName: site.company,
        url: `${site.origin}/`,
        email: site.contact,
        identifier: site.companyNumber,
      },
      {
        '@type': 'WebApplication',
        '@id': `${site.origin}${tool.path}#application`,
        name: tool.schemaName,
        url: `${site.origin}${tool.path}`,
        description: tool.description,
        dateModified: tool.reviewedOn,
        applicationCategory: 'BusinessApplication',
        browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        featureList: tool.featureList,
        citation: tool.sources.map((item) => item.url),
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
          { '@type': 'ListItem', position: 2, name: tool.shortName, item: `${site.origin}${tool.path}` },
        ],
      },
    ],
  }).replaceAll('<', '\\u003c')
}

function renderRelated(tool) {
  const links = [PACK_CHECK, ...tool.related.filter(isLive)]
    .map((path) => {
      const [label, name] = path === PACK_CHECK ? ['FREE WORKPAPER', 'Customs document pack check'] : RELATED_NAMES[path]
      return `<a href="${path}"${path === PACK_CHECK ? ' data-tt-pack="related"' : ''}><span>${label}</span><strong>${escapeHtml(name)}</strong><b>OPEN →</b></a>`
    })
    .join('')
  return `<section class="tt-related" aria-labelledby="tt-related-heading">
      <header><span class="section-label">KEEP MOVING</span><h2 id="tt-related-heading">The next job on the same shipment.</h2></header>
      <nav aria-label="Related free customs tools">${links}</nav>
    </section>`
}

export function renderTradeTool(tool, site, { navHtml, webmasterHtml, posthogKey, posthogHost }) {
  const canonical = `${site.origin}${tool.path}`
  const { widget, content } = tool
  const src = `tool_${tool.id}`
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(tool.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterHtml}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <link rel="stylesheet" href="/trade-tools.css" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(tool.title)}" />
    <meta property="og:description" content="${escapeHtml(tool.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(tool.title)}" />
    <meta name="twitter:description" content="${escapeHtml(tool.description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${escapeHtml(tool.title)}</title>
    <script type="application/ld+json">${jsonLd(tool, site)}</script>
  </head>
  <body>
    <div class="docket tt-docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>FREE TOOL</span><strong>NO SIGN-UP · IN YOUR BROWSER</strong></div>
        <a class="masthead-cta" data-tt-booking="masthead" href="/?src=${src}#book">BOOK THE 20-MINUTE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${navHtml}</nav>
      <div class="breadcrumbs"><a href="/">HOME</a> → FREE TOOLS → ${escapeHtml(tool.shortName.toUpperCase())}</div>
      <main>
        <header class="hero tt-hero">
          <div class="hero-copy">
            <p class="eyebrow">${escapeHtml(tool.eyebrow)}</p>
            <h1>${escapeHtml(tool.h1)}</h1>
            <p>${escapeHtml(tool.standfirst)}</p>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${escapeHtml(tool.ref)}</span>
            <div class="stamp">${escapeHtml(tool.stamp).replaceAll('\n', '<br />')}</div>
            <div class="review-cell"><span>SOURCES CHECKED</span><strong>${tool.reviewedOn}</strong></div>
          </aside>
        </header>
        <div class="hero-value-strip">${tool.strip.map((item) => `<strong>${escapeHtml(item)}</strong>`).join('')}</div>
        <section class="answer-block tt-answer" aria-labelledby="tt-direct-answer">
          <span class="section-label">DIRECT ANSWER</span>
          <div><h2 id="tt-direct-answer">${escapeHtml(tool.answer.question)}</h2><p>${escapeHtml(tool.answer.text)}</p></div>
        </section>
        ${widget()}
        <section class="tt-result" id="tt-result" aria-live="polite" aria-labelledby="tt-result-label" hidden>
          <span class="section-label" id="tt-result-label">YOUR RESULT</span>
          <div id="tt-result-body"></div>
          <div class="tt-result-actions">
            <button class="tt-secondary" id="tt-copy" type="button">COPY RESULT</button>
            <button class="tt-secondary" id="tt-print" type="button">PRINT / SAVE</button>
            <a class="tt-secondary" data-tt-pack="result" href="${PACK_CHECK}">CHECK THE WHOLE PACK FREE</a>
            <a class="button" data-tt-booking="result" href="/?src=${src}_result#book">BOOK THE 20-MINUTE NUMBERS CALL</a>
          </div>
        </section>
        <p class="visually-hidden" id="tt-status" aria-live="polite"></p>
        <section class="tt-steps" aria-labelledby="tt-steps-heading">
          <header><span class="section-label">HOW IT WORKS</span><h2 id="tt-steps-heading">Four steps, under a minute.</h2></header>
          <ol>${tool.steps.map(([number, title, copy]) => `<li><b>${number}</b><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(copy)}</p></div></li>`).join('')}</ol>
        </section>
        ${content()}
        <section class="tt-declarix" aria-labelledby="tt-declarix-heading">
          <div><span class="section-label">FROM ONE REFERENCE TO THE WHOLE PACK</span><h2 id="tt-declarix-heading">Let the pack build itself.</h2><p>Declarix builds CDS-ready entry packs from customer documents, so each clerk can handle up to 3× more declarations. Every value keeps its document, page and line reference, and the clerk checks and approves before the broker files through Sequoia, Descartes e-Customs or its own system.</p></div>
          <div class="tt-declarix-actions"><a class="tt-secondary" data-tt-pack="declarix" href="${PACK_CHECK}">RUN THE FREE PACK CHECK</a><a class="tt-secondary" data-tt-pilot="declarix" href="/pilot/">SEE THE PILOT</a><a class="button" data-tt-booking="declarix" href="/?src=${src}_declarix#book">BOOK THE 20-MINUTE NUMBERS CALL</a></div>
        </section>
        <section class="tt-faq" aria-labelledby="tt-faq-heading">
          <header><span class="section-label">QUESTIONS, ANSWERED FIRST</span><h2 id="tt-faq-heading">Quick answers.</h2></header>
          <div>${tool.faqs.map(([question, answer], index) => `<details class="tt-question"${index === 0 ? ' open' : ''}><summary><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</div>
        </section>
        ${renderRelated(tool)}
        <section class="source-register" aria-labelledby="tt-sources">
          <header>
            <span class="section-label">PRIMARY SOURCE REGISTER</span>
            <h2 id="tt-sources">The official record behind the tool.</h2>
            <p>Each rule in this tool comes from the source below, checked on the date shown.</p>
          </header>
          <ol>${tool.sources.map((item) => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a><span>${escapeHtml(item.publisher)} · CHECKED ${escapeHtml(item.checked)}</span></li>`).join('')}</ol>
        </section>
        <section class="cta-band">
          <div><h2>Turn the next shipment into a ready pack.</h2><p>Bring weekly volume, current minutes per declaration, clerk cost and customs system. Leave with the ROI range, integration route and best first workflow.</p></div>
          <a class="button" data-tt-booking="bottom" href="/?src=${src}_bottom#book">BOOK THE 20-MINUTE NUMBERS CALL</a>
        </section>
        <div class="source-stamp">FREE TOOL · REVIEWED ${tool.reviewedOn} · <a href="/editorial-policy/">SOURCES AND CORRECTIONS</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
      </main>
      <footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav></footer>
    </div>
    ${clientScript(tool, posthogKey, posthogHost)}
  </body>
</html>`
}

for (const tool of tradeTools) tool.reviewedOn = REVIEWED

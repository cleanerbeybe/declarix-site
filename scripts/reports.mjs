const percent = (count, denominator) => Number(((count / denominator) * 100).toFixed(1))

export const reports = [
  {
    path: '/research/uk-customs-operations-signal-report-2026/',
    id: 'uk_customs_operations_signal_report_2026',
    ref: 'FIELD REPORT 01 · ORIGINAL RESEARCH',
    title: 'UK customs operations signal report 2026 | Declarix',
    description:
      'Explore aggregate signals from 1,203 public-source research decisions covering UK customs brokers and freight forwarders, with methods and free data.',
    eyebrow: 'ORIGINAL UK CUSTOMS RESEARCH · JULY 2026 · AGGREGATES ONLY',
    h1: 'What 402 qualified customs operations reveal.',
    standfirst:
      'A public-source census of customs brokers and freight forwarders found 50 priority-grade signals, 73 strong-fit operations, and 279 structurally qualified accounts. This report publishes the pattern—not a prospect directory.',
    reviewedOn: '2026-07-17',
    publishedOn: '2026-07-17',
    snapshotOn: '2026-07-15',
    schemaType: 'Report',
    totalDecisions: 1203,
    qualifiedTotal: 402,
    scoreThreshold: 65,
    tiers: [
      { id: 'priority', label: 'Priority signal', range: '85–100', count: 50, meaning: 'Current hiring, expansion, volume, shift, or explicit process-improvement evidence.' },
      { id: 'strong', label: 'Strong fit', range: '75–84', count: 73, meaning: 'Strong operational fit with better-than-structural timing evidence.' },
      { id: 'structural', label: 'Structural fit', range: '65–74', count: 279, meaning: 'Evidence threshold met; timing, volume, CMS, and workflow still need discovery.' },
    ],
    ledger: [
      { id: 'qualified', label: 'Qualified', count: 402, meaning: 'Canonical accounts at or above the evidence threshold.' },
      { id: 'excluded', label: 'Excluded', count: 309, meaning: 'Reviewed and found outside the target or evidence standard.' },
      { id: 'unresolved', label: 'Unresolved', count: 489, meaning: 'Kept as explicit research gaps for later human review.' },
      { id: 'duplicate_alias', label: 'Duplicate alias', count: 3, meaning: 'Related identity retained in the ledger but suppressed as a separate account.' },
    ],
    websiteDiscovery: [
      { id: 'customs_workflow', label: 'Customs + workflow terms', count: 469, meaning: 'Public pages exposed both customs and workflow or document terms.' },
      { id: 'customs_only', label: 'Customs terms only', count: 80, meaning: 'Customs terms appeared without a matching workflow excerpt.' },
      { id: 'insufficient', label: 'Insufficient public-page signal', count: 305, meaning: 'No usable site, blocked fetch, or no matching extractable terms.' },
    ],
    websiteUniverse: 854,
    cmsPreservationCount: 397,
    sources: [
      {
        title: 'List of customs agents and fast parcel operators',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '15 JULY 2026',
        url: 'https://www.gov.uk/guidance/list-of-customs-agents-and-fast-parcel-operators',
      },
      {
        title: 'External temporary storage facility codes',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '15 JULY 2026',
        url: 'https://www.gov.uk/government/publications/external-temporary-storage-facilities-codes-for-data-element-523-of-the-customs-declaration-service',
      },
      {
        title: 'BIFA member directory',
        publisher: 'British International Freight Association',
        checked: '15 JULY 2026',
        url: 'https://bifa.org/members/',
      },
      {
        title: 'FIATA United Kingdom directory',
        publisher: 'International Federation of Freight Forwarders Associations',
        checked: '15 JULY 2026',
        url: 'https://fiata.org/directory/gb/',
      },
    ],
    downloads: [
      {
        id: 'aggregate_csv',
        format: 'csv',
        href: '/downloads/uk-customs-operations-signals-2026-aggregates.csv',
        label: 'Aggregate data table',
        description: 'All published counts, denominators, percentages, and definitions in a reusable table.',
      },
      {
        id: 'press_chart_svg',
        format: 'svg',
        href: '/downloads/uk-customs-operations-signal-report-2026-press-chart.svg',
        label: 'Press-ready chart',
        description: 'A 1200 × 630 vector summary of the qualified tier distribution, with source and snapshot note.',
      },
    ],
  },
]

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const bookingHref = (report, placement) =>
  `/?src=research_${report.id}_${placement}#book`

function jsonLd(report, site) {
  const reportId = `${site.origin}${report.path}#report`
  const datasetId = `${site.origin}${report.path}#dataset`
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
        '@type': 'Report',
        '@id': reportId,
        url: `${site.origin}${report.path}`,
        name: report.title,
        headline: report.h1,
        description: report.description,
        datePublished: report.publishedOn,
        dateModified: report.reviewedOn,
        inLanguage: 'en-GB',
        isAccessibleForFree: true,
        mainEntity: { '@id': datasetId },
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
        image: `${site.origin}/downloads/uk-customs-operations-signal-report-2026-press-chart.svg`,
        citation: report.sources.map((source) => source.url),
      },
      {
        '@type': 'Dataset',
        '@id': datasetId,
        name: 'UK customs operations signal aggregates, July 2026',
        description: 'Aggregate-only counts from a documented public-source research census of UK customs broker and freight-forwarder operations.',
        url: `${site.origin}${report.path}#downloads`,
        datePublished: report.publishedOn,
        dateModified: report.reviewedOn,
        temporalCoverage: report.snapshotOn,
        spatialCoverage: { '@type': 'Place', name: 'United Kingdom' },
        creator: { '@id': `${site.origin}/#organization` },
        isAccessibleForFree: true,
        measurementTechnique: 'Documented public-source review with deterministic evidence scoring and human qualification.',
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Coverage ledger decisions', value: report.totalDecisions },
          { '@type': 'PropertyValue', name: 'Qualified canonical accounts', value: report.qualifiedTotal },
          { '@type': 'PropertyValue', name: 'Priority-grade signals', value: report.tiers[0].count },
        ],
        distribution: {
          '@type': 'DataDownload',
          contentUrl: `${site.origin}${report.downloads[0].href}`,
          encodingFormat: 'text/csv',
        },
        citation: report.sources.map((source) => source.url),
      },
      {
        '@type': 'WebSite',
        '@id': `${site.origin}/#website`,
        name: 'Declarix',
        url: `${site.origin}/`,
        publisher: { '@id': `${site.origin}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
          { '@type': 'ListItem', position: 2, name: report.h1, item: `${site.origin}${report.path}` },
        ],
      },
    ],
  }).replaceAll('<', '\\u003c')
}

function tierRows(report) {
  return report.tiers
    .map((tier) => `<tr>
      <th scope="row"><strong>${escapeHtml(tier.label)}</strong><span>${escapeHtml(tier.range)}</span></th>
      <td>${tier.count}</td>
      <td>${percent(tier.count, report.qualifiedTotal).toFixed(1)}%</td>
      <td>${escapeHtml(tier.meaning)}</td>
    </tr>`)
    .join('')
}

function ledgerRows(report) {
  return report.ledger
    .map((row) => `<tr>
      <th scope="row">${escapeHtml(row.label)}</th>
      <td>${row.count}</td>
      <td>${percent(row.count, report.totalDecisions).toFixed(1)}%</td>
      <td>${escapeHtml(row.meaning)}</td>
    </tr>`)
    .join('')
}

function discoveryRows(report) {
  return report.websiteDiscovery
    .map((row) => `<tr>
      <th scope="row">${escapeHtml(row.label)}</th>
      <td>${row.count}</td>
      <td>${percent(row.count, report.websiteUniverse).toFixed(1)}%</td>
      <td>${escapeHtml(row.meaning)}</td>
    </tr>`)
    .join('')
}

function sources(report) {
  return `<section class="source-register" aria-labelledby="report-sources">
    <header>
      <span class="section-label">PUBLIC SOURCE REGISTER</span>
      <h2 id="report-sources">Start with the source universe.</h2>
      <p>Counts describe the dated research snapshot, not the current size of each live directory. Source entries can change after review.</p>
    </header>
    <ol>${report.sources.map((source) => `<li>
      <a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a>
      <span>${escapeHtml(source.publisher)} · CHECKED ${escapeHtml(source.checked)}</span>
    </li>`).join('')}</ol>
  </section>`
}

function downloads(report) {
  return `<section class="report-downloads" id="downloads" aria-labelledby="downloads-heading">
    <header>
      <span class="section-label">UNGATED RESEARCH ASSETS</span>
      <h2 id="downloads-heading">Take the evidence with you.</h2>
      <p>No email wall. Download the aggregate table for analysis or the vector chart for a briefing, article, or deck. Cite Declarix and the 15 July 2026 snapshot.</p>
    </header>
    <div class="report-download-list">${report.downloads.map((asset) => `<a href="${escapeHtml(asset.href)}" download data-report-download="${escapeHtml(asset.id)}" data-report-format="${escapeHtml(asset.format)}">
      <span>${escapeHtml(asset.format.toUpperCase())}</span>
      <strong>${escapeHtml(asset.label)}</strong>
      <p>${escapeHtml(asset.description)}</p>
      <b aria-hidden="true">DOWNLOAD ↓</b>
    </a>`).join('')}</div>
  </section>`
}

function analytics(report, posthogKey, posthogHost) {
  const config = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  return `<script>
    (() => {
      const config = ${config};
      const get = (key) => { try { return sessionStorage.getItem(key) || ''; } catch { return ''; } };
      const set = (key, value) => { try { sessionStorage.setItem(key, value); } catch {} };
      const attribution = () => {
        const params = new URLSearchParams(location.search);
        const incoming = {
          source: params.get('utm_source') || params.get('src') || '',
          medium: params.get('utm_medium') || '',
          campaign: params.get('utm_campaign') || '',
          content: params.get('utm_content') || '',
          term: params.get('utm_term') || '',
        };
        Object.entries(incoming).forEach(([key, value]) => { if (value && !get('dclrx-' + key)) set('dclrx-' + key, value); });
        return Object.fromEntries(Object.keys(incoming).map((key) => [key, get('dclrx-' + key) || (key === 'source' ? 'direct' : 'none')]));
      };
      const distinctId = get('dclrx-distinct-id') || crypto.randomUUID();
      set('dclrx-distinct-id', distinctId);
      const track = (event, properties = {}) => {
        const payload = { ...attribution(), ...properties, page_path: location.pathname, report_id: '${report.id}' };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event, ...payload });
        if (!config.posthogKey) return;
        const body = JSON.stringify({ api_key: config.posthogKey, event, distinct_id: distinctId, properties: payload });
        if (navigator.sendBeacon && navigator.sendBeacon(config.posthogHost + '/capture/', body)) return;
        fetch(config.posthogHost + '/capture/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => null);
      };
      document.querySelectorAll('[data-report-download]').forEach((link) => link.addEventListener('click', () => {
        track('operations_report_downloaded', { asset_id: link.dataset.reportDownload, asset_format: link.dataset.reportFormat });
      }));
      document.querySelectorAll('[data-report-booking]').forEach((link) => link.addEventListener('click', () => {
        track('operations_report_booking_clicked', { placement: link.dataset.reportBooking });
      }));
      document.querySelectorAll('[data-report-related]').forEach((link) => link.addEventListener('click', () => {
        track('operations_report_related_clicked', { destination_id: link.dataset.reportRelated });
      }));
      const methodLink = document.querySelector('[data-report-methodology]');
      methodLink?.addEventListener('click', () => track('operations_report_methodology_viewed', { placement: 'hero_action' }));
      const share = document.querySelector('[data-report-share]');
      share?.addEventListener('click', async () => {
        try {
          if (navigator.share) await navigator.share({ title: document.title, url: location.href });
          else await navigator.clipboard.writeText(location.href);
          track('operations_report_shared', { method: navigator.share ? 'native' : 'clipboard' });
          share.textContent = navigator.share ? 'SHARED' : 'LINK COPIED';
        } catch (error) {
          if (error?.name !== 'AbortError') share.textContent = 'COPY THE URL';
        }
      });
      attribution();
    })();
  </script>`
}

export function renderReport(report, site, options) {
  const canonical = `${site.origin}${report.path}`
  const priority = report.tiers[0]
  const strong = report.tiers[1]
  const structural = report.tiers[2]
  const nonPriority = strong.count + structural.count
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(report.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${options.webmasterHtml}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <link rel="stylesheet" href="/report.css" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(report.title)}" />
    <meta property="og:description" content="${escapeHtml(report.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="article:published_time" content="${report.publishedOn}" />
    <meta property="article:modified_time" content="${report.reviewedOn}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(report.title)}" />
    <meta name="twitter:description" content="${escapeHtml(report.description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${escapeHtml(report.title)}</title>
    <script type="application/ld+json">${jsonLd(report, site)}</script>
  </head>
  <body>
    <div class="docket report-docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>RESEARCH SNAPSHOT</span><strong>${report.snapshotOn}</strong></div>
        <a class="masthead-cta" data-report-booking="masthead" href="${bookingHref(report, 'masthead')}">BOOK THE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${options.navHtml}</nav>
      <div class="breadcrumbs"><a href="/">HOME</a> → RESEARCH → UK CUSTOMS OPERATIONS SIGNALS</div>
      <main>
        <header class="hero report-hero">
          <div class="hero-copy">
            <p class="eyebrow">${escapeHtml(report.eyebrow)}</p>
            <h1>What <span class="report-number-word">402</span> qualified customs operations reveal.</h1>
            <p>${escapeHtml(report.standfirst)}</p>
            <div class="report-actions">
              <a class="button" data-report-download="aggregate_csv" data-report-format="csv" href="${report.downloads[0].href}" download>DOWNLOAD THE DATA</a>
              <a class="text-action" data-report-methodology href="#methodology">READ THE METHOD ↓</a>
              <button class="text-action" type="button" data-report-share>SHARE REPORT</button>
            </div>
          </div>
          <aside class="hero-ledger report-hero-ledger">
            <span class="route-ref">${escapeHtml(report.ref)}</span>
            <div class="report-hero-number"><strong>${report.qualifiedTotal}</strong><span>qualified operations accounts</span></div>
            <div class="review-cell"><span>SNAPSHOT / PUBLISHED</span><strong>${report.snapshotOn} / ${report.publishedOn}</strong></div>
          </aside>
        </header>
        <div class="hero-value-strip">
          <strong>${report.totalDecisions.toLocaleString('en-GB')} LEDGER DECISIONS</strong>
          <strong>${priority.count} PRIORITY-GRADE SIGNALS</strong>
          <strong>${report.cmsPreservationCount} CMS-PRESERVATION FITS</strong>
        </div>

        <section class="report-lede" aria-labelledby="read-heading">
          <span class="section-label">THE 90-SECOND READ</span>
          <h2 id="read-heading">Hiring shows urgency. Operations evidence shows the larger market.</h2>
          <div class="report-lede-copy">
            <p><strong>${priority.count} of ${report.qualifiedTotal}</strong> qualified accounts carried priority-grade current signals. The other <strong>${nonPriority}</strong> were not dead ends: ${strong.count} had strong-fit evidence and ${structural.count} met the structural threshold but still need timing discovery.</p>
            <p><strong>${report.cmsPreservationCount} of ${report.qualifiedTotal}</strong> qualified accounts scored 4 or 5 for product fit. Under this rubric, the credible wedge is preparing evidence-linked work in front of the customs management system the desk already uses—not asking the buyer to begin with a replacement migration.</p>
          </div>
        </section>

        <section class="report-figure-section" aria-labelledby="tier-heading">
          <header class="report-section-heading">
            <span class="section-label">FINDING 01 · QUALIFIED TIERS</span>
            <h2 id="tier-heading">Priority is a first wave, not the whole addressable workflow.</h2>
            <p>Every qualified account scored at least ${report.scoreThreshold} out of 100. The tier changes the next question: prove urgency now, or discover timing before pitching a pilot.</p>
          </header>
          <figure class="tier-figure">
            <figcaption>${report.qualifiedTotal} qualified accounts by evidence tier</figcaption>
            <div class="tier-bars" aria-hidden="true">
              ${report.tiers.map((tier) => `<div class="tier-bar tier-bar-${tier.id}" style="--share:${percent(tier.count, report.qualifiedTotal)}%"><strong>${tier.count}</strong><span>${escapeHtml(tier.label)} · ${percent(tier.count, report.qualifiedTotal).toFixed(1)}%</span></div>`).join('')}
            </div>
            <div class="table-scroll" tabindex="0" role="region" aria-label="Qualified account tiers table">
              <table>
                <caption>Qualified tier counts, shares, and research meaning</caption>
                <thead><tr><th scope="col">Tier / score</th><th scope="col">Accounts</th><th scope="col">Share</th><th scope="col">Research meaning</th></tr></thead>
                <tbody>${tierRows(report)}</tbody>
              </table>
            </div>
          </figure>
        </section>

        <section class="report-ledger-section" aria-labelledby="ledger-heading">
          <div class="report-section-heading">
            <span class="section-label">FINDING 02 · COVERAGE LEDGER</span>
            <h2 id="ledger-heading">Uncertainty stayed in the count.</h2>
            <p>The census did not turn every public directory row into a lead. Each company-level decision stayed qualified, excluded, unresolved, or preserved as a duplicate alias.</p>
          </div>
          <div class="ledger-strip" aria-hidden="true">${report.ledger.map((row) => `<span class="ledger-${row.id}" style="--share:${percent(row.count, report.totalDecisions)}%"><b>${row.count}</b><small>${escapeHtml(row.label)}</small></span>`).join('')}</div>
          <div class="table-scroll" tabindex="0" role="region" aria-label="Coverage ledger status table">
            <table>
              <caption>All ${report.totalDecisions.toLocaleString('en-GB')} coverage-ledger decisions</caption>
              <thead><tr><th scope="col">Status</th><th scope="col">Rows</th><th scope="col">Share</th><th scope="col">Definition</th></tr></thead>
              <tbody>${ledgerRows(report)}</tbody>
            </table>
          </div>
        </section>

        <section class="signal-split" aria-labelledby="fit-heading">
          <div class="signal-number"><strong>${percent(report.cmsPreservationCount, report.qualifiedTotal).toFixed(1)}%</strong><span>${report.cmsPreservationCount} of ${report.qualifiedTotal} qualified accounts</span></div>
          <div>
            <span class="section-label">FINDING 03 · PRODUCT WEDGE</span>
            <h2 id="fit-heading">Keep the CMS. Remove the document assembly drag.</h2>
            <p>The product-fit dimension gave 4 or 5 points to ${report.cmsPreservationCount} qualified accounts. That is a rubric result, not measured software usage or market share. It supports an entry strategy built around the current declaration workflow: prepare the pack, keep evidence and conflicts visible, let the authorised clerk review, then hand off to the existing system.</p>
            <a class="inline-link" data-report-related="how_it_works" href="/how-it-works/">SEE THE DECLARIX WORKFLOW →</a>
          </div>
        </section>

        <section class="report-figure-section" aria-labelledby="discovery-heading">
          <header class="report-section-heading">
            <span class="section-label">FINDING 04 · PUBLIC WEBSITE DISCOVERY</span>
            <h2 id="discovery-heading">Website language was a routing signal, never an automatic qualification.</h2>
            <p>A limited, robots-aware pass checked the home page and at most one same-domain service page for each of ${report.websiteUniverse} deduplicated directory candidates. Public terms directed human review; they did not create a lead.</p>
          </header>
          <div class="discovery-columns" aria-hidden="true">${report.websiteDiscovery.map((row) => `<div><span style="--height:${percent(row.count, report.websiteUniverse)}%"></span><strong>${row.count}</strong><small>${escapeHtml(row.label)}</small></div>`).join('')}</div>
          <div class="table-scroll" tabindex="0" role="region" aria-label="Public website discovery table">
            <table>
              <caption>Website discovery results across ${report.websiteUniverse} directory candidates</caption>
              <thead><tr><th scope="col">Discovery result</th><th scope="col">Candidates</th><th scope="col">Share</th><th scope="col">Meaning</th></tr></thead>
              <tbody>${discoveryRows(report)}</tbody>
            </table>
          </div>
        </section>

        <section class="methodology" id="methodology" aria-labelledby="method-heading">
          <header>
            <span class="section-label">METHOD · REPRODUCIBLE AGGREGATES</span>
            <h2 id="method-heading">How the signal was built.</h2>
            <p>The census reconciled public company directories, HMRC facility operators, limited public website discovery, current-signal research, and an earlier research phase into one decision ledger. The public report contains aggregates only.</p>
          </header>
          <ol class="method-steps">
            <li><span>01</span><div><strong>Define the universe.</strong><p>550 normalized HMRC customs-agent candidates, 180 BIFA company candidates, and 272 FIATA company candidates became an 854-company deduplicated directory union. These source counts overlap; they are not additive market size.</p></div></li>
            <li><span>02</span><div><strong>Cross-check operations.</strong><p>458 unique HMRC external temporary storage facility operators were reconciled against the union. 124 matched immediately; 334 entered a separate gap review.</p></div></li>
            <li><span>03</span><div><strong>Score evidence.</strong><p>Each qualified account was rated 0–5 for pain strength, product fit, timing, public reachability, and evidence quality. A weighted score of at least ${report.scoreThreshold} was required.</p></div></li>
            <li><span>04</span><div><strong>Audit every decision.</strong><p>Counts, identities, aliases, score recomputation, source links, and phase reconciliation were checked before the aggregate publication layer was derived.</p></div></li>
          </ol>
          <div class="formula-line"><span>SCORE</span><strong>25% pain + 25% product fit + 20% timing + 15% reachability + 15% evidence quality</strong></div>
        </section>

        <section class="report-boundaries" aria-labelledby="limits-heading">
          <div>
            <span class="section-label">READ THE NUMBERS CORRECTLY</span>
            <h2 id="limits-heading">What this report does—and does not—measure.</h2>
          </div>
          <ul>
            <li>“Census” means complete within the documented public-source universe and 15 July 2026 snapshot, not every company that may exist.</li>
            <li>Qualification indicates evidence-backed fit. It does not prove buying intent, budget, declaration volume, product use, or future conversion.</li>
            <li>Structural accounts require fresh timing, CMS, volume, workflow, and representative-pack discovery before outreach.</li>
            <li>Directory entries, websites, vacancies, and company structures change. Re-check the current public source before using a finding.</li>
            <li>No private contact discovery, personal email or phone enrichment, gated access, sensitive-trait inference, or form submission was used.</li>
            <li>The public CSV deliberately excludes company, prospect, contact, domain, candidate-ID, and source-row data.</li>
          </ul>
        </section>

        ${downloads(report)}

        <section class="next-actions" aria-labelledby="next-heading">
          <header>
            <span class="section-label">TURN THE SIGNAL INTO A DESK DECISION</span>
            <h2 id="next-heading">Use the free workbench.</h2>
            <p>Move from category evidence to your own workflow. No account required, and the browser tools do not ask you to upload customer documents.</p>
          </header>
          <div class="next-action-grid">
            <a data-report-related="desk_calculator" href="/tools/customs-declaration-cost-calculator/"><span>01 · ECONOMICS</span><strong>Model the desk cost per declaration.</strong><b>OPEN CALCULATOR →</b></a>
            <a data-report-related="pack_checker" href="/tools/customs-document-pack-check/"><span>02 · HANDOFF</span><strong>Turn a document pack into an action list.</strong><b>OPEN PACK CHECK →</b></a>
            <a data-report-related="registration_kit" href="/customs-intermediary-registration-2026/"><span>03 · RESPONSE KIT</span><strong>Structure the 2026 registration consultation response.</strong><b>GET THE KIT →</b></a>
          </div>
        </section>

        ${sources(report)}
        <div class="source-stamp">AGGREGATE PUBLICATION · SNAPSHOT ${report.snapshotOn} · REVIEWED ${report.reviewedOn} · <a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
        <section class="cta-band report-cta">
          <div><h2>Now test the signal against your desk.</h2><p>Bring weekly volume, current minutes per declaration, loaded clerk cost, document mix, and the system your team files through. Leave with a buyer-specific model and a sensible first workflow.</p></div>
          <a class="button" data-report-booking="bottom_cta" href="${bookingHref(report, 'bottom_cta')}">BOOK THE 20-MINUTE NUMBERS CALL</a>
        </section>
      </main>
      <footer class="footer">
        <span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span>
        <nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav>
      </footer>
    </div>
    ${analytics(report, options.posthogKey, options.posthogHost)}
  </body>
</html>`
}

const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`

export function aggregateCsv(report) {
  const rows = [
    ['group', 'metric_id', 'label', 'count', 'denominator', 'percent', 'definition', 'snapshot_date'],
    ...report.tiers.map((row) => ['qualified_tier', row.id, row.label, row.count, report.qualifiedTotal, percent(row.count, report.qualifiedTotal).toFixed(1), `${row.range}: ${row.meaning}`, report.snapshotOn]),
    ...report.ledger.map((row) => ['coverage_ledger', row.id, row.label, row.count, report.totalDecisions, percent(row.count, report.totalDecisions).toFixed(1), row.meaning, report.snapshotOn]),
    ...report.websiteDiscovery.map((row) => ['website_discovery', row.id, row.label, row.count, report.websiteUniverse, percent(row.count, report.websiteUniverse).toFixed(1), row.meaning, report.snapshotOn]),
    ['product_fit', 'cms_preservation', 'CMS-preservation fit', report.cmsPreservationCount, report.qualifiedTotal, percent(report.cmsPreservationCount, report.qualifiedTotal).toFixed(1), 'Qualified accounts rated 4 or 5 for product fit under the research rubric; not software market share.', report.snapshotOn],
  ]
  return `${rows.map((row) => row.map(csvCell).join(',')).join('\n')}\n`
}

export function pressChartSvg(report) {
  const priority = report.tiers[0]
  const strong = report.tiers[1]
  const structural = report.tiers[2]
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">UK customs operations signal report: 402 qualified accounts</title>
  <desc id="desc">Of 402 qualified accounts, 50 were priority-grade signals, 73 were strong fit, and 279 were structural fit in a 15 July 2026 public-source research snapshot.</desc>
  <rect width="1200" height="630" fill="#f7f6f1"/>
  <rect x="32" y="32" width="1136" height="566" fill="none" stroke="#16313d" stroke-width="4"/>
  <text x="72" y="88" fill="#5c6e76" font-family="monospace" font-size="18" font-weight="700" letter-spacing="2">DECLARIX · ORIGINAL RESEARCH · 15 JULY 2026</text>
  <text x="72" y="198" fill="#16313d" font-family="Arial, sans-serif" font-size="112" font-weight="900">402</text>
  <text x="72" y="246" fill="#16313d" font-family="Arial, sans-serif" font-size="34" font-weight="700">qualified UK customs operations</text>
  <text x="72" y="284" fill="#5c6e76" font-family="Arial, sans-serif" font-size="23">Evidence tiers across a documented public-source census</text>
  <rect x="72" y="346" width="126" height="94" fill="#c77b27"/>
  <rect x="198" y="346" width="184" height="94" fill="#1b7a4b"/>
  <rect x="382" y="346" width="706" height="94" fill="#16313d"/>
  <text x="72" y="484" fill="#16313d" font-family="monospace" font-size="18" font-weight="700">${priority.count} PRIORITY · ${percent(priority.count, report.qualifiedTotal).toFixed(1)}%</text>
  <text x="72" y="521" fill="#16313d" font-family="monospace" font-size="18" font-weight="700">${strong.count} STRONG · ${percent(strong.count, report.qualifiedTotal).toFixed(1)}%</text>
  <text x="72" y="558" fill="#16313d" font-family="monospace" font-size="18" font-weight="700">${structural.count} STRUCTURAL · ${percent(structural.count, report.qualifiedTotal).toFixed(1)}%</text>
  <text x="1110" y="565" fill="#5c6e76" text-anchor="end" font-family="monospace" font-size="12">GETDECLARIX.COM/RESEARCH/UK-CUSTOMS-OPERATIONS-SIGNAL-REPORT-2026/</text>
</svg>`
}

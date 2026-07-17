export const tools = [
  {
    path: '/tools/customs-document-pack-check/',
    ref: 'WORKPAPER 01 · FREE TOOL',
    title: 'Customs document pack checker and action plan | Free tool',
    description:
      'Use this free customs document pack checker to map 24 handoff prompts, rank the open actions, and copy, share, or print the result for your operations desk.',
    eyebrow: 'FREE CUSTOMS HANDOFF CHECK · 24 PROMPTS · BROWSER ONLY',
    h1: 'Turn a document pack into an ordered work list.',
    standfirst:
      'Mark what is already mapped. The checker ranks every open prompt into a practical action plan you can copy, share, or print for the desk—without uploading a document.',
    version: '2.0',
    limitations:
      'This is a preparation prompt list, not a legal completeness check, declaration validation, HMRC readiness decision, filing service, or customs advice. An unchecked prompt may be not applicable; a competent reviewer must decide.',
    groups: [
      {
        id: 'shipment',
        code: '01',
        priority: 1,
        priorityLabel: 'START HERE',
        title: 'Shipment and source pack',
        note: 'Can the reviewer locate the commercial and movement evidence?',
        prompts: [
          'Commercial invoice or equivalent transaction evidence is mapped.',
          'Packing list, package detail, or an agreed substitute is mapped.',
          'Transport document and movement references are mapped.',
          'Arrival, departure, routing, and location context has an owner.',
        ],
      },
      {
        id: 'parties',
        code: '02',
        priority: 1,
        priorityLabel: 'START HERE',
        title: 'Parties and representation',
        note: 'Can the desk distinguish the legal and operational roles?',
        prompts: [
          'Importer, exporter, consignor, and consignee roles are mapped.',
          'Required identity and EORI evidence has an owner.',
          'Declarant and direct or indirect representation position has an owner.',
          'Contact for party-detail conflicts or missing authority is named.',
        ],
      },
      {
        id: 'goods',
        code: '03',
        priority: 1,
        priorityLabel: 'START HERE',
        title: 'Goods and origin evidence',
        note: 'Is the evidence usable for classification and goods identification?',
        prompts: [
          'Goods descriptions state what the items are, their material, and use.',
          'Quantities, packages, gross mass, and net mass are mapped.',
          'Country of origin evidence and decision owner are mapped.',
          'Commodity-code evidence, rationale, and approver are mapped.',
        ],
      },
      {
        id: 'value',
        code: '04',
        priority: 2,
        priorityLabel: 'REVIEW NEXT',
        title: 'Commercial and valuation inputs',
        note: 'Can the reviewer trace the amount and adjustments being considered?',
        prompts: [
          'Invoice currency, line values, and totals are mapped.',
          'Incoterm and named place are mapped.',
          'Freight, insurance, assists, royalties, or other adjustments have an owner.',
          'Valuation method and any relationship question have an owner.',
        ],
      },
      {
        id: 'customs',
        code: '05',
        priority: 2,
        priorityLabel: 'REVIEW NEXT',
        title: 'Procedure and controls',
        note: 'Are customs decisions separated from facts extracted from documents?',
        prompts: [
          'Requested procedure and additional procedure code have an owner.',
          'Relief, authorisation, preference, or quota evidence is mapped where relevant.',
          'Prohibitions, restrictions, licences, and certificates have an owner.',
          'Tax, duty, guarantee, and payment questions have an owner.',
        ],
      },
      {
        id: 'handoff',
        code: '06',
        priority: 3,
        priorityLabel: 'CLOSE THE LOOP',
        title: 'Review and handoff control',
        note: 'Can the work reach the right reviewer without losing exceptions?',
        prompts: [
          'Target customs system and declaration category are known.',
          'Broker reviewer and escalation owner are assigned.',
          'Unknowns, conflicts, assumptions, and not-applicable decisions stay visible.',
          'Approved transfer channel and data-handling schedule are agreed.',
        ],
      },
    ],
    sources: [
      {
        title: 'Making a full import declaration',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '17 JULY 2026',
        url: 'https://www.gov.uk/guidance/making-a-full-import-declaration',
      },
      {
        title: 'CDS Declaration Completion Instructions for Imports',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '17 JULY 2026',
        url: 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/uk-trade-tariff-cds-volume-3-import-declaration-completion-guide',
      },
      {
        title: 'Standard for customs intermediaries',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '17 JULY 2026',
        url: 'https://www.gov.uk/government/publications/standard-for-customs-intermediaries',
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
        name: tool.title,
        url: `${site.origin}${tool.path}`,
        description: tool.description,
        applicationCategory: 'BusinessApplication',
        browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
        citation: tool.sources.map((source) => source.url),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
          { '@type': 'ListItem', position: 2, name: tool.h1, item: `${site.origin}${tool.path}` },
        ],
      },
    ],
  }).replaceAll('<', '\\u003c')
}

function renderGroups(tool) {
  return tool.groups
    .map(
      (group) => `<fieldset class="check-group" data-group="${group.id}">
        <legend><span>${group.code}</span>${escapeHtml(group.title)}</legend>
        <p>${escapeHtml(group.note)}</p>
        <div class="check-rows">${group.prompts
          .map(
            (prompt, index) => `<label class="check-row">
              <input type="checkbox" data-group="${group.id}" value="${escapeHtml(prompt)}" />
              <span class="check-box" aria-hidden="true"></span>
              <span><strong>${String(index + 1).padStart(2, '0')}</strong>${escapeHtml(prompt)}</span>
            </label>`,
          )
          .join('')}</div>
      </fieldset>`,
    )
    .join('')
}

function renderSources(tool) {
  return `<section class="source-register" aria-labelledby="tool-sources">
    <header>
      <span class="section-label">PRIMARY SOURCE REGISTER</span>
      <h2 id="tool-sources">The official record behind the prompts.</h2>
      <p>The workpaper interprets broad preparation themes. Always use the current guidance and declaration-category instructions for the movement in front of you.</p>
    </header>
    <ol>${tool.sources
      .map(
        (source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a><span>${escapeHtml(source.publisher)} · CHECKED ${escapeHtml(source.checked)}</span></li>`,
      )
      .join('')}</ol>
  </section>`
}

function toolScript(tool, site, posthogKey, posthogHost) {
  const config = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  const groupData = JSON.stringify(
    Object.fromEntries(
      tool.groups.map((group) => [
        group.id,
        { title: group.title, priority: group.priority, priorityLabel: group.priorityLabel },
      ]),
    ),
  ).replaceAll('<', '\\u003c')
  return `<script>
    (() => {
      const config = ${config};
      const groupData = ${groupData};
      const toolId = 'customs_document_pack_check';
      const canonicalUrl = '${site.origin}${tool.path}';
      const inputs = [...document.querySelectorAll('.check-row input')];
      const result = document.getElementById('tool-result');
      const score = document.getElementById('result-score');
      const resultHeading = document.getElementById('result-heading');
      const resultCopy = document.getElementById('result-copy');
      const resultGroups = document.getElementById('result-groups');
      const status = document.getElementById('tool-status');
      let started = false;

      const escape = (value) => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');

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
        const payload = { ...attribution(), ...properties, tool_id: toolId, page_path: location.pathname };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event, ...payload });
        if (!config.posthogKey) return;
        const body = JSON.stringify({ api_key: config.posthogKey, event, distinct_id: distinctId, properties: payload });
        if (navigator.sendBeacon && navigator.sendBeacon(config.posthogHost + '/capture/', body)) return;
        fetch(config.posthogHost + '/capture/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => null);
      };
      const current = () => {
        const checked = inputs.filter((input) => input.checked);
        const unmapped = inputs.filter((input) => !input.checked);
        const attention = [...new Set(unmapped.map((input) => input.dataset.group))];
        const actions = unmapped
          .map((input, order) => ({
            group: input.dataset.group,
            prompt: input.value,
            order,
            ...groupData[input.dataset.group],
          }))
          .sort((a, b) => a.priority - b.priority || a.order - b.order);
        return { checked, unmapped, attention, actions };
      };
      const updateRow = (input) => input.closest('.check-row').classList.toggle('is-checked', input.checked);
      const announce = (message) => { status.textContent = message; };

      inputs.forEach((input) => input.addEventListener('change', () => {
        updateRow(input);
        if (!started) { started = true; track('tool_started'); }
      }));

      document.getElementById('review-pack').addEventListener('click', () => {
        const { checked, unmapped, attention, actions } = current();
        score.textContent = checked.length + ' / ' + inputs.length;
        resultHeading.textContent = unmapped.length
          ? 'Work the list from priority 1 down.'
          : 'The handoff is mapped. Take it to review.';
        resultCopy.textContent = unmapped.length
          ? unmapped.length + ' open prompts across ' + attention.length + ' areas. Clear the start-here items first, then work through review and handoff controls.'
          : 'Every prompt has been mapped. Use the saved workpaper to run the desk review and record any not-applicable decisions in your normal job record.';
        resultGroups.innerHTML = actions.length
          ? actions.map((action) => '<li><strong><b>P' + action.priority + '</b>' + escape(action.title) + '</strong><span>' + escape(action.prompt) + '</span></li>').join('')
          : '<li><strong><b>READY</b>Desk review</strong><span>No open prompts. Confirm the evidence and movement-specific decisions with the reviewer.</span></li>';
        result.hidden = false;
        result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        track('tool_completed', {
          mapped_count: checked.length,
          open_count: unmapped.length,
          attention_groups: attention.length,
          priority_one_open_count: actions.filter((action) => action.priority === 1).length,
        });
        announce('Workpaper reviewed. ' + checked.length + ' of ' + inputs.length + ' prompts are mapped.');
      });

      document.getElementById('copy-unmapped').addEventListener('click', async () => {
        const { actions } = current();
        const text = actions.length
          ? [
              'CUSTOMS DOCUMENT PACK — PRIORITISED ACTION PLAN',
              '',
              ...actions.map((action) => 'P' + action.priority + ' | ' + action.title + ' | ' + action.prompt),
              '',
              'Run the list from P1 to P3. Assign an owner or record why a prompt is not applicable.',
              'Free checker: ' + canonicalUrl,
            ].join('\\n')
          : [
              'CUSTOMS DOCUMENT PACK — MAPPED FOR REVIEW',
              '',
              'All 24 prompts are mapped. Confirm the evidence and movement-specific decisions with the reviewer.',
              'Free checker: ' + canonicalUrl,
            ].join('\\n');
        try {
          await navigator.clipboard.writeText(text);
          announce('Prioritised action plan copied.');
          track('tool_result_copied', { open_count: actions.length });
        } catch {
          announce('Copy was blocked by the browser. Use Print / save instead.');
        }
      });

      document.getElementById('share-workpaper').addEventListener('click', async () => {
        const { actions } = current();
        const shareData = {
          title: 'Free customs document pack checker',
          text: actions.length
            ? 'I used this free checker to turn a customs document pack into a prioritised handoff list.'
            : 'I used this free checker to map a customs document pack for desk review.',
          url: canonicalUrl,
        };
        try {
          if (navigator.share) await navigator.share(shareData);
          else await navigator.clipboard.writeText(shareData.text + '\\n' + shareData.url);
          announce(navigator.share ? 'Share sheet opened.' : 'Share link copied.');
          track('tool_result_shared', { open_count: actions.length, method: navigator.share ? 'web_share' : 'clipboard' });
        } catch (error) {
          if (error && error.name === 'AbortError') return;
          announce('Sharing was blocked. Copy the action plan instead.');
        }
      });

      document.getElementById('print-workpaper').addEventListener('click', () => {
        track('tool_result_printed', { mapped_count: current().checked.length });
        window.print();
      });
      document.getElementById('tool-booking').addEventListener('click', () => {
        const { checked, actions } = current();
        track('tool_booking_clicked', {
          mapped_count: checked.length,
          open_count: actions.length,
          priority_one_open_count: actions.filter((action) => action.priority === 1).length,
        });
      });
      attribution();
    })();
  </script>`
}

export function renderTool(tool, site, { navHtml, webmasterHtml, posthogKey, posthogHost }) {
  const canonical = `${site.origin}${tool.path}`
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
    <link rel="stylesheet" href="/tool.css" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(tool.title)}" />
    <meta property="og:description" content="${escapeHtml(tool.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(tool.title)}" />
    <meta name="twitter:description" content="${escapeHtml(tool.description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${escapeHtml(tool.title)}</title>
    <script type="application/ld+json">${jsonLd(tool, site)}</script>
  </head>
  <body>
    <div class="docket tool-docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>WORKPAPER</span><strong>FREE · PRIVATE</strong></div>
        <a class="masthead-cta" href="/?src=tool_customs_document_pack_check#book">BOOK THE 20-MINUTE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${navHtml}</nav>
      <div class="breadcrumbs"><a href="/">HOME</a> → FREE TOOLS → CUSTOMS DOCUMENT PACK CHECK</div>
      <main>
        <header class="hero tool-hero">
          <div class="hero-copy">
            <p class="eyebrow">${escapeHtml(tool.eyebrow)}</p>
            <h1>${escapeHtml(tool.h1)}</h1>
            <p>${escapeHtml(tool.standfirst)}</p>
            <div class="privacy-strip"><strong>24-POINT HANDOFF</strong><strong>PRIORITISED ACTIONS</strong><strong>COPY · PRINT · SHARE</strong></div>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${escapeHtml(tool.ref)}</span>
            <div class="stamp">MAP<br />THEN REVIEW</div>
            <div class="review-cell"><span>EDITION</span><strong>${site.reviewedOn}</strong></div>
          </aside>
        </header>
        <section class="answer-block" aria-labelledby="direct-answer">
          <span class="section-label">DIRECT ANSWER</span>
          <div>
            <h2 id="direct-answer">What belongs in a customs document handoff?</h2>
            <p>A strong handoff gives the reviewer the source pack, party roles, goods and origin evidence, valuation inputs, procedure decisions, controls, and a named owner for every open question. The result is not more paperwork. It is fewer avoidable stops once preparation begins.</p>
          </div>
        </section>

        <section class="tool-intro" aria-labelledby="use-workpaper">
          <div><span class="section-label">HOW TO USE IT</span><h2 id="use-workpaper">Map it. Rank it. Hand it over.</h2></div>
          <div>
            <p>Tick a row when the evidence, decision, or responsible owner is mapped for the handoff. Leave it open when the point still needs work. Select “Review &amp; prioritise” to turn the open rows into a P1–P3 action list for the desk.</p>
            <p>Your individual selections stay in this page and disappear when it is closed or refreshed. The checker asks for no names, EORIs, values, goods descriptions, uploads, or free text.</p>
          </div>
        </section>

        <aside class="tool-boundary" aria-label="Scope of the checker">
          <strong>Use it to organise the handoff.</strong>
          <span>${escapeHtml(tool.limitations)}</span>
        </aside>

        <form class="check-workpaper" id="pack-check" novalidate>
          ${renderGroups(tool)}
          <div class="tool-actions">
            <p><strong>24 prompts. One ordered handoff.</strong> Review now to see what needs attention first.</p>
            <button class="button" id="review-pack" type="button">REVIEW &amp; PRIORITISE</button>
          </div>
        </form>

        <section class="tool-result" id="tool-result" aria-labelledby="result-heading" aria-live="polite" hidden>
          <div class="result-score"><span>MAPPED PROMPTS</span><strong id="result-score">0 / 24</strong></div>
          <div class="result-body">
            <span class="section-label">YOUR PRIORITISED HANDOFF</span>
            <h2 id="result-heading">Work the list from priority 1 down.</h2>
            <p id="result-copy"></p>
            <ul id="result-groups"></ul>
            <p class="result-limit"><strong>Desk boundary.</strong> This action plan is not a readiness verdict. It does not prove legal completeness, declaration validity, HMRC readiness, or correct filing. Check applicability and the current instructions for the movement.</p>
            <div class="result-actions">
              <button class="secondary-button" id="copy-unmapped" type="button">COPY ACTION PLAN</button>
              <button class="secondary-button" id="print-workpaper" type="button">PRINT / SAVE WORKPAPER</button>
              <button class="secondary-button" id="share-workpaper" type="button">SHARE THE CHECKER</button>
              <a class="button" id="tool-booking" href="/?src=tool_customs_document_pack_check#book">TURN THIS INTO A 20-MINUTE WORKFLOW PLAN</a>
            </div>
          </div>
        </section>
        <p class="visually-hidden" id="tool-status" aria-live="polite"></p>

        <section class="boundary-grid">
          <article><span class="section-label">USE IT ON THE DESK</span><h2>Make ownership visible before work stalls.</h2><p>Use the ordered list at intake, before preparation, or in a process review. Copy it into a job note, print it for a stand-up, or share the checker with the person sending the next pack.</p></article>
          <article><span class="section-label">USE IT ON THE CALL</span><h2>Find the recurring handoff cost.</h2><p>Bring the top open actions, weekly declaration volume, minutes per declaration, and current customs system. The 20-minute numbers call maps where better document intake can return clerk time.</p></article>
        </section>
        ${renderSources(tool)}
        <div class="source-stamp">FREE TOOL · VERSION ${escapeHtml(tool.version)} · REVIEWED ${site.reviewedOn} · <a href="/editorial-policy/">SOURCES AND CORRECTIONS</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
      </main>
      <footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav></footer>
    </div>
    ${toolScript(tool, site, posthogKey, posthogHost)}
  </body>
</html>`
}

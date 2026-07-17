export const calculators = [
  {
    path: '/tools/customs-declaration-cost-calculator/',
    id: 'customs_declaration_cost_calculator',
    ref: 'WORKPAPER 02 · DESK ECONOMICS',
    title: 'Customs declaration cost calculator | Free desk economics tool',
    schemaName: 'Customs declaration cost calculator',
    reviewedOn: '2026-07-17',
    description:
      'Calculate annual customs declaration labour cost, recoverable clerk capacity, labour headroom, and a break-even price per entry using your desk inputs.',
    eyebrow: 'FREE CUSTOMS DESK CALCULATOR · YOUR INPUTS · NO SIGN-UP',
    h1: 'Calculate your customs desk cost per declaration.',
    standfirst:
      'Put five desk numbers into a transparent labour model. See the annual hours, cost, recoverable capacity, and labour-only break-even price before you discuss software.',
    sources: [
      {
        title: 'Making a full import declaration',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '16 JULY 2026',
        url: 'https://www.gov.uk/guidance/making-a-full-import-declaration',
      },
      {
        title: 'Standard for customs intermediaries',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '16 JULY 2026',
        url: 'https://www.gov.uk/government/publications/standard-for-customs-intermediaries',
      },
    ],
    faqs: [
      {
        question: 'How do I calculate labour cost per customs declaration?',
        answer:
          'Multiply the minutes spent per declaration by the loaded hourly cost, then divide by 60. For example, 30 minutes at £24 per hour is £12 of labour per declaration.',
      },
      {
        question: 'What does the labour-only break-even price per entry mean?',
        answer:
          'It is the current labour cost per entry minus the modelled review labour cost per entry. It shows the most you could spend per processed entry before the labour saving alone reaches zero. It is not a Declarix quote or a complete return-on-investment calculation.',
      },
      {
        question: 'What should I enter for target review minutes?',
        answer:
          'Enter a scenario your team wants to test, not a promised Declarix result. Use a conservative figure until a representative workflow has been measured side by side.',
      },
      {
        question: 'Does recovered capacity guarantee more declarations or revenue?',
        answer:
          'No. The capacity figure converts recovered hours into additional declarations at the target review time. Demand, job mix, exceptions, staffing, integration, and service levels determine whether that theoretical capacity can be used.',
      },
      {
        question: 'Does this calculation include the price of Declarix?',
        answer:
          'No. The calculator does not invent or assume a Declarix rate. The 20-minute numbers call replaces the model inputs with your desk data and tests the commercial case including the proposed per-entry rate.',
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

function jsonLd(calculator, site) {
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
        '@id': `${site.origin}${calculator.path}#application`,
        name: calculator.schemaName,
        url: `${site.origin}${calculator.path}`,
        description: calculator.description,
        dateModified: calculator.reviewedOn,
        applicationCategory: 'BusinessApplication',
        browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${site.origin}${calculator.path}#faq`,
        mainEntity: calculator.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
          { '@type': 'ListItem', position: 2, name: calculator.schemaName, item: `${site.origin}${calculator.path}` },
        ],
      },
    ],
  }).replaceAll('<', '\\u003c')
}

function renderSources(calculator) {
  return `<section class="source-register" aria-labelledby="calculator-sources">
    <header>
      <span class="section-label">CONTEXT SOURCE REGISTER</span>
      <h2 id="calculator-sources">The arithmetic is yours. The customs context is official.</h2>
      <p>The sources below explain the declaration and intermediary context. They do not provide labour benchmarks, and Declarix does not use them as evidence for the model inputs.</p>
    </header>
    <ol>${calculator.sources
      .map(
        (source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a><span>${escapeHtml(source.publisher)} · CHECKED ${escapeHtml(source.checked)}</span></li>`,
      )
      .join('')}</ol>
  </section>`
}

function renderFaqs(calculator) {
  return calculator.faqs
    .map(
      (faq, index) => `<details class="calculator-faq">
        <summary><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(faq.question)}</summary>
        <p>${escapeHtml(faq.answer)}</p>
      </details>`,
    )
    .join('')
}

function calculatorScript(calculator, posthogKey, posthogHost) {
  const config = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  return `<script>
    (() => {
      const config = ${config};
      const toolId = '${calculator.id}';
      const form = document.getElementById('desk-calculator');
      const status = document.getElementById('calculator-status');
      const inputs = {
        declarations: document.getElementById('declarations'),
        minutes: document.getElementById('current-minutes'),
        cost: document.getElementById('hourly-cost'),
        target: document.getElementById('target-minutes'),
        weeks: document.getElementById('working-weeks'),
      };
      const outputIds = [
        'annual-entries', 'current-hours', 'current-cost', 'target-hours', 'target-cost',
        'recoverable-hours', 'capacity-entries', 'capacity-weekly', 'labour-headroom',
        'break-even', 'current-entry-cost', 'target-entry-cost'
      ];
      const outputs = Object.fromEntries(outputIds.map((id) => [id, document.getElementById(id)]));
      const scenarioNote = document.getElementById('scenario-note');
      let started = false;

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
      const formatNumber = (value, maximumFractionDigits = 0) => new Intl.NumberFormat('en-GB', { maximumFractionDigits }).format(value);
      const formatCurrency = (value, maximumFractionDigits = 0) => new Intl.NumberFormat('en-GB', {
        style: 'currency', currency: 'GBP', maximumFractionDigits, minimumFractionDigits: maximumFractionDigits
      }).format(value);
      const clampParam = (key, min, max) => {
        const raw = new URLSearchParams(location.search).get(key);
        if (raw === null || raw.trim() === '') return null;
        const value = Number(raw);
        return Number.isFinite(value) && value >= min && value <= max ? value : null;
      };
      const shared = {
        declarations: clampParam('d', 1, 100000), minutes: clampParam('m', 0.5, 480),
        cost: clampParam('c', 1, 500), target: clampParam('t', 0.5, 480), weeks: clampParam('w', 1, 52),
      };
      Object.entries(shared).forEach(([key, value]) => { if (value !== null) inputs[key].value = String(value); });
      const values = () => Object.fromEntries(Object.entries(inputs).map(([key, input]) => [key, Number(input.value)]));
      const volumeBand = (value) => value < 50 ? '1_49' : value < 150 ? '50_149' : value < 500 ? '150_499' : '500_plus';
      const minutesBand = (value) => value < 15 ? 'under_15' : value < 30 ? '15_29' : value < 60 ? '30_59' : '60_plus';
      const update = () => {
        if (!form.checkValidity()) return false;
        const value = values();
        const annualEntries = value.declarations * value.weeks;
        const currentHours = annualEntries * value.minutes / 60;
        const targetHours = annualEntries * value.target / 60;
        const recoverableHours = Math.max(0, currentHours - targetHours);
        const currentCost = currentHours * value.cost;
        const targetCost = targetHours * value.cost;
        const labourHeadroom = Math.max(0, currentCost - targetCost);
        const currentEntryCost = value.minutes * value.cost / 60;
        const targetEntryCost = value.target * value.cost / 60;
        const breakEven = Math.max(0, currentEntryCost - targetEntryCost);
        const capacityEntries = value.target > 0 ? recoverableHours / (value.target / 60) : 0;
        const capacityWeekly = value.weeks > 0 ? capacityEntries / value.weeks : 0;

        outputs['annual-entries'].textContent = formatNumber(annualEntries);
        outputs['current-hours'].textContent = formatNumber(currentHours);
        outputs['current-cost'].textContent = formatCurrency(currentCost);
        outputs['target-hours'].textContent = formatNumber(targetHours);
        outputs['target-cost'].textContent = formatCurrency(targetCost);
        outputs['recoverable-hours'].textContent = formatNumber(recoverableHours);
        outputs['capacity-entries'].textContent = formatNumber(capacityEntries);
        outputs['capacity-weekly'].textContent = formatNumber(capacityWeekly, 1);
        outputs['labour-headroom'].textContent = formatCurrency(labourHeadroom);
        outputs['break-even'].textContent = formatCurrency(breakEven, 2);
        outputs['current-entry-cost'].textContent = formatCurrency(currentEntryCost, 2);
        outputs['target-entry-cost'].textContent = formatCurrency(targetEntryCost, 2);
        scenarioNote.textContent = value.target < value.minutes
          ? 'This scenario releases ' + formatNumber(recoverableHours) + ' hours. Test the target minutes on representative work before using it in a buying decision.'
          : 'The target is not lower than the current time, so this model shows no recoverable labour. Change the target only if your team has a scenario worth testing.';
        return true;
      };

      Object.values(inputs).forEach((input) => input.addEventListener('input', () => {
        if (!started) { started = true; track('tool_started'); }
        update();
      }));
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity() || !update()) return;
        const value = values();
        track('tool_completed', {
          weekly_volume_band: volumeBand(value.declarations),
          current_minutes_band: minutesBand(value.minutes),
          target_reduces_minutes: value.target < value.minutes,
        });
        status.textContent = 'Desk model updated. Results use the five inputs shown.';
        document.getElementById('calculator-results').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      });
      document.getElementById('share-model').addEventListener('click', async () => {
        if (!form.reportValidity() || !update()) return;
        const value = values();
        const url = new URL(location.href);
        ['src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'd', 'm', 'c', 't', 'w'].forEach((key) => url.searchParams.delete(key));
        url.searchParams.set('d', value.declarations);
        url.searchParams.set('m', value.minutes);
        url.searchParams.set('c', value.cost);
        url.searchParams.set('t', value.target);
        url.searchParams.set('w', value.weeks);
        try {
          await navigator.clipboard.writeText(url.toString());
          status.textContent = 'Share link copied. It includes the five model inputs shown on this page.';
          track('tool_result_copied', { result_type: 'share_link' });
        } catch {
          status.textContent = 'Copy was blocked by the browser. Use Print or save instead.';
        }
      });
      document.getElementById('print-model').addEventListener('click', () => {
        track('tool_result_printed', { result_type: 'desk_model' });
        window.print();
      });
      document.getElementById('calculator-booking').addEventListener('click', () => {
        const value = values();
        track('tool_booking_clicked', {
          weekly_volume_band: volumeBand(value.declarations),
          target_reduces_minutes: value.target < value.minutes,
        });
      });
      attribution();
      update();
    })();
  </script>`
}

export function renderCalculator(calculator, site, { navHtml, webmasterHtml, posthogKey, posthogHost }) {
  const canonical = `${site.origin}${calculator.path}`
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(calculator.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterHtml}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <link rel="stylesheet" href="/calculator.css" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(calculator.title)}" />
    <meta property="og:description" content="${escapeHtml(calculator.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(calculator.title)}" />
    <meta name="twitter:description" content="${escapeHtml(calculator.description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${escapeHtml(calculator.title)}</title>
    <script type="application/ld+json">${jsonLd(calculator, site)}</script>
  </head>
  <body>
    <div class="docket calculator-docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>WORKPAPER</span><strong>FREE · PRIVATE</strong></div>
        <a class="masthead-cta" href="/?src=tool_customs_declaration_cost_calculator#book">BOOK THE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${navHtml}</nav>
      <div class="breadcrumbs"><a href="/">HOME</a> → FREE TOOLS → DECLARATION COST CALCULATOR</div>
      <main>
        <header class="hero calculator-hero">
          <div class="hero-copy">
            <p class="eyebrow">${escapeHtml(calculator.eyebrow)}</p>
            <h1>${escapeHtml(calculator.h1)}</h1>
            <p>${escapeHtml(calculator.standfirst)}</p>
            <div class="calculator-trust"><strong>NO ACCOUNT</strong><strong>CALCULATES IN YOUR BROWSER</strong><strong>PRINT OR SHARE</strong></div>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${escapeHtml(calculator.ref)}</span>
            <div class="stamp">RUN<br />YOUR NUMBERS</div>
            <div class="review-cell"><span>EDITION</span><strong>${calculator.reviewedOn}</strong></div>
          </aside>
        </header>

        <section class="calculator-answer" aria-labelledby="direct-answer">
          <span class="section-label">DIRECT ANSWER</span>
          <div>
            <h2 id="direct-answer">What does a customs declaration cost to prepare?</h2>
            <p>For a labour view, multiply the clerk minutes used per declaration by the loaded hourly cost, then divide by 60. Add weekly volume and working weeks to see the annual load. This calculator also compares that baseline with a target review-time scenario chosen by you.</p>
            <code>LABOUR COST / ENTRY = MINUTES / ENTRY × LOADED HOURLY COST ÷ 60</code>
          </div>
        </section>

        <section class="calculator-workpaper" aria-labelledby="calculator-heading">
          <header>
            <span class="section-label">BUYER-CONTROLLED MODEL</span>
            <h2 id="calculator-heading">Replace every example with your desk.</h2>
            <p>The starting values make the model visible. They are not a forecast, a benchmark, or a claim about Declarix. Change all five inputs to the scenario your team wants to test.</p>
          </header>
          <form id="desk-calculator">
            <div class="calculator-fields">
              <label class="calculator-field" for="declarations">
                <span><b>01</b> Declarations per week</span>
                <span class="input-line"><input id="declarations" name="declarations" type="number" min="1" max="100000" step="1" value="120" inputmode="numeric" required /><i>ENTRIES / WEEK</i></span>
              </label>
              <label class="calculator-field" for="current-minutes">
                <span><b>02</b> Current minutes per declaration</span>
                <span class="input-line"><input id="current-minutes" name="current-minutes" type="number" min="0.5" max="480" step="0.5" value="45" inputmode="decimal" required /><i>MINUTES / ENTRY</i></span>
              </label>
              <label class="calculator-field" for="hourly-cost">
                <span><b>03</b> Loaded clerk cost per hour</span>
                <span class="input-line prefix-pound"><input id="hourly-cost" name="hourly-cost" type="number" min="1" max="500" step="0.5" value="30" inputmode="decimal" required /><i>GBP / HOUR</i></span>
              </label>
              <label class="calculator-field" for="target-minutes">
                <span><b>04</b> Target review minutes</span>
                <span class="input-line"><input id="target-minutes" name="target-minutes" type="number" min="0.5" max="480" step="0.5" value="20" inputmode="decimal" required /><i>MINUTES / ENTRY</i></span>
              </label>
              <label class="calculator-field" for="working-weeks">
                <span><b>05</b> Working weeks per year</span>
                <span class="input-line"><input id="working-weeks" name="working-weeks" type="number" min="1" max="52" step="1" value="48" inputmode="numeric" required /><i>WEEKS / YEAR</i></span>
              </label>
            </div>
            <div class="calculator-submit">
              <p><strong>Your target is a scenario.</strong> Measure it on representative work before treating it as achievable.</p>
              <button class="button" type="submit">UPDATE MY DESK MODEL</button>
            </div>
          </form>
        </section>

        <section class="calculator-results" id="calculator-results" aria-labelledby="results-heading" aria-live="polite">
          <header class="result-lead">
            <span class="section-label">YOUR LABOUR MODEL</span>
            <h2 id="results-heading"><output id="labour-headroom">£72,000</output> annual labour headroom.</h2>
            <p id="scenario-note">This scenario releases 2,400 hours. Test the target minutes on representative work before using it in a buying decision.</p>
          </header>
          <div class="result-ledger">
            <article class="result-card result-card-dark">
              <span>LABOUR-ONLY BREAK-EVEN</span>
              <strong><output id="break-even">£12.50</output><small>/ ENTRY</small></strong>
              <p>Current labour cost per entry minus target review labour cost. No Declarix rate is assumed.</p>
            </article>
            <article class="result-card">
              <span>ANNUAL WORKLOAD</span>
              <strong><output id="annual-entries">5,760</output><small>ENTRIES</small></strong>
              <p>Weekly declarations × working weeks.</p>
            </article>
            <article class="result-card">
              <span>CURRENT LABOUR</span>
              <strong><output id="current-hours">4,320</output><small>HOURS</small></strong>
              <p><output id="current-cost">£129,600</output> a year · <output id="current-entry-cost">£22.50</output> per entry.</p>
            </article>
            <article class="result-card">
              <span>TARGET REVIEW LABOUR</span>
              <strong><output id="target-hours">1,920</output><small>HOURS</small></strong>
              <p><output id="target-cost">£57,600</output> a year · <output id="target-entry-cost">£10.00</output> per entry.</p>
            </article>
            <article class="result-card result-card-green">
              <span>RECOVERABLE CAPACITY</span>
              <strong><output id="recoverable-hours">2,400</output><small>HOURS</small></strong>
              <p>Equivalent to <output id="capacity-entries">7,200</output> more entries a year, or <output id="capacity-weekly">150</output> a week, if every released hour is used at the target review time.</p>
            </article>
          </div>
          <div class="calculator-actions">
            <div><span class="section-label">TAKE IT TO THE DESK</span><p>A share link includes the five visible inputs. Print produces a clean model for an internal discussion.</p></div>
            <button class="secondary-button" id="share-model" type="button">COPY SHARE LINK</button>
            <button class="secondary-button" id="print-model" type="button">PRINT / SAVE</button>
          </div>
        </section>
        <p class="visually-hidden" id="calculator-status" aria-live="polite"></p>

        <section class="formula-register" aria-labelledby="formula-heading">
          <header><span class="section-label">FORMULA REGISTER</span><h2 id="formula-heading">Every output, in plain sight.</h2><p>All calculations are deterministic and run in this browser. The page sends only aggregate interaction events when analytics is configured, never the five input values.</p></header>
          <div>
            <p><b>ANNUAL ENTRIES</b><code>WEEKLY ENTRIES × WORKING WEEKS</code></p>
            <p><b>CURRENT HOURS</b><code>ANNUAL ENTRIES × CURRENT MINUTES ÷ 60</code></p>
            <p><b>RECOVERABLE HOURS</b><code>MAX(0, CURRENT HOURS − TARGET HOURS)</code></p>
            <p><b>LABOUR HEADROOM</b><code>RECOVERABLE HOURS × LOADED HOURLY COST</code></p>
            <p><b>CAPACITY EQUIVALENT</b><code>RECOVERABLE HOURS ÷ (TARGET MINUTES ÷ 60)</code></p>
            <p><b>BREAK-EVEN / ENTRY</b><code>MAX(0, CURRENT COST / ENTRY − TARGET COST / ENTRY)</code></p>
          </div>
        </section>

        <section class="assumption-grid" aria-label="Model assumptions and next decision">
          <article><span class="section-label">USE IT FOR</span><h2>A first commercial filter.</h2><p>Use the result to see whether a workflow is worth measuring, which input matters most, and the per-entry cost ceiling created by labour alone.</p></article>
          <article><span class="section-label">KEEP BESIDE THE RESULT</span><h2>Labour is not total ROI.</h2><p>The model excludes software price, setup, integration, training, exception handling, quality changes, demand, and the value of faster service. The capacity number is theoretical until a representative workflow proves the target review time.</p></article>
        </section>

        <section class="calculator-cta">
          <div><span class="section-label">20-MINUTE NUMBERS CALL</span><h2>Now test the model against the real workflow.</h2><p>Bring weekly volume, current minutes, loaded clerk cost, document mix, and the system your team files through. Leave with a buyer-specific model, integration route, and recommended first workflow.</p></div>
          <a class="button" id="calculator-booking" href="/?src=tool_customs_declaration_cost_calculator#book">BOOK THE 20-MINUTE NUMBERS CALL</a>
        </section>

        <section class="faq-register" aria-labelledby="faq-heading">
          <header><span class="section-label">CALCULATOR QUESTIONS</span><h2 id="faq-heading">Know what the number means.</h2></header>
          <div>${renderFaqs(calculator)}</div>
        </section>
        ${renderSources(calculator)}
        <div class="source-stamp">FREE CALCULATOR · VERSION 1.0 · REVIEWED ${calculator.reviewedOn} · <a href="/editorial-policy/">SOURCES AND CORRECTIONS</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
      </main>
      <footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/pricing/">PRICING</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav></footer>
    </div>
    ${calculatorScript(calculator, posthogKey, posthogHost)}
  </body>
</html>`
}

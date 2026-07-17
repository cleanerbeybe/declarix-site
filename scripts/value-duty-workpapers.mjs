export const valueDutyWorkpapers = [
  {
    path: '/tools/customs-value-import-duty-vat-calculator/',
    id: 'customs_value_duty_vat_workpaper',
    ref: 'WORKPAPER 03 · VALUATION + DUTY',
    title: 'Customs value, import duty and VAT calculator | Free UK workpaper',
    schemaName: 'Customs value, import duty and VAT planning workpaper',
    reviewedOn: '2026-07-17',
    description:
      'Build a transparent UK customs value, import duty, import VAT value, and tax planning scenario using only the exchange rates and charges you enter.',
    eyebrow: 'FREE CUSTOMS VALUE WORKPAPER · YOUR RATES · NO SIGN-UP',
    h1: 'Build the customs value, duty and import VAT scenario.',
    standfirst:
      'Cross-foot the invoice, freight, insurance, adjustments, duty and import VAT in one browser-only worksheet. Every rate comes from you. Every formula stays visible.',
    questions: [
      {
        question: 'Which exchange rate should I enter?',
        answer:
          'Enter pounds sterling per one unit of invoice currency using the rate applicable to your valuation. If the goods amount is already in pounds, enter 1. HMRC guidance explains when published or contract rates apply; this workpaper does not choose the rate.',
      },
      {
        question: 'Where do I find the import duty and VAT rates?',
        answer:
          'Use the current UK Trade Tariff after the goods, commodity code, origin, date, procedure and applicable measures have been checked. Enter the percentage rates you have established. This workpaper does not perform a tariff lookup.',
      },
      {
        question: 'Does this workpaper decide which customs valuation method applies?',
        answer:
          'No. The build-up is useful for a transaction-value planning scenario, but the correct valuation method and the amounts to include or exclude must be established from the facts and current guidance.',
      },
      {
        question: 'Can I use a preferential or reduced duty rate?',
        answer:
          'Only enter that rate after eligibility, origin, evidence, quota, suspension, relief and declaration conditions have been checked. The workpaper applies the number you enter and does not test entitlement.',
      },
      {
        question: 'Does the import VAT result say what can be reclaimed?',
        answer:
          'No. It is an arithmetic planning amount based on the VAT value and rate entered. VAT accounting, postponement, payment and recovery depend on the importer and transaction facts.',
      },
    ],
    sources: [
      {
        title: 'Customs valuation handbook',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '17 JULY 2026',
        url: 'https://www.gov.uk/guidance/customs-valuation',
      },
      {
        title: 'Customs valuation: Method 1 — transaction value',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '17 JULY 2026',
        url: 'https://www.gov.uk/guidance/customs-valuation/method-1-transaction-value',
      },
      {
        title: 'Customs valuation: exchange rates',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '17 JULY 2026',
        url: 'https://www.gov.uk/guidance/customs-valuation/exchange-rates',
      },
      {
        title: 'Working out the VAT value using the customs value of imported goods',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '17 JULY 2026',
        url: 'https://www.gov.uk/guidance/working-out-the-vat-value-using-the-customs-value-of-the-imported-goods',
      },
      {
        title: 'Trade Tariff: look up commodity codes, duty and VAT rates',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '17 JULY 2026',
        url: 'https://www.gov.uk/trade-tariff',
      },
    ],
  },
]

export function calculateValueDutyScenario(input) {
  const keys = [
    'goodsAmount',
    'fxRate',
    'freight',
    'insurance',
    'additions',
    'deductions',
    'dutyRate',
    'otherImportCharges',
    'incidentalExpenses',
    'vatRate',
  ]
  for (const key of keys) {
    if (!Number.isFinite(input[key]) || input[key] < 0) throw new Error(`Invalid non-negative input: ${key}`)
  }
  if (input.fxRate <= 0) throw new Error('FX rate must be greater than zero')

  const convertedGoods = input.goodsAmount * input.fxRate
  const netAdjustments = input.additions - input.deductions
  const customsValueBeforeClamp = convertedGoods + input.freight + input.insurance + netAdjustments
  const customsValue = Math.max(0, customsValueBeforeClamp)
  const customsDuty = customsValue * (input.dutyRate / 100)
  const importVatValue = customsValue + customsDuty + input.otherImportCharges + input.incidentalExpenses
  const importVat = importVatValue * (input.vatRate / 100)
  const taxDutyTotal = customsDuty + input.otherImportCharges + importVat
  const planningTotal = customsValue + customsDuty + input.otherImportCharges + input.incidentalExpenses + importVat

  return {
    convertedGoods,
    netAdjustments,
    customsValueBeforeClamp,
    customsValue,
    customsDuty,
    importVatValue,
    importVat,
    taxDutyTotal,
    planningTotal,
  }
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

function jsonLd(workpaper, site) {
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
        '@id': `${site.origin}${workpaper.path}#application`,
        name: workpaper.schemaName,
        url: `${site.origin}${workpaper.path}`,
        description: workpaper.description,
        dateModified: workpaper.reviewedOn,
        applicationCategory: 'BusinessApplication',
        browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        featureList: [
          'User-entered customs value build-up',
          'User-entered import duty and import VAT planning scenario',
          'Visible formulas',
          'Print and explicit share link',
        ],
        citation: workpaper.sources.map((source) => source.url),
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
          { '@type': 'ListItem', position: 2, name: workpaper.schemaName, item: `${site.origin}${workpaper.path}` },
        ],
      },
    ],
  }).replaceAll('<', '\\u003c')
}

function renderSources(workpaper) {
  return `<section class="source-register" aria-labelledby="value-duty-sources">
    <header>
      <span class="section-label">OFFICIAL SOURCE REGISTER</span>
      <h2 id="value-duty-sources">Check the method and rates before the arithmetic.</h2>
      <p>These current HMRC sources support the valuation sequence and rate checks. They do not turn the workpaper into an HMRC calculation or decide which facts apply to a movement.</p>
    </header>
    <ol>${workpaper.sources
      .map(
        (source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a><span>${escapeHtml(source.publisher)} · CHECKED ${escapeHtml(source.checked)}</span></li>`,
      )
      .join('')}</ol>
  </section>`
}

function renderQuestions(workpaper) {
  return workpaper.questions
    .map(
      (item, index) => `<details class="calculator-faq">
        <summary><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(item.question)}</summary>
        <p>${escapeHtml(item.answer)}</p>
      </details>`,
    )
    .join('')
}

function workpaperScript(workpaper, posthogKey, posthogHost) {
  const config = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  const calculate = calculateValueDutyScenario.toString()
  return `<script>
    (() => {
      const config = ${config};
      const toolId = '${workpaper.id}';
      const calculateValueDutyScenario = ${calculate};
      const form = document.getElementById('value-duty-form');
      const result = document.getElementById('value-duty-result');
      const status = document.getElementById('value-duty-status');
      const inputs = {
        goodsAmount: document.getElementById('goods-amount'),
        fxRate: document.getElementById('fx-rate'),
        freight: document.getElementById('freight'),
        insurance: document.getElementById('insurance'),
        additions: document.getElementById('additions'),
        deductions: document.getElementById('deductions'),
        dutyRate: document.getElementById('duty-rate'),
        otherImportCharges: document.getElementById('other-import-charges'),
        incidentalExpenses: document.getElementById('incidental-expenses'),
        vatRate: document.getElementById('vat-rate'),
      };
      const outputIds = [
        'converted-goods', 'net-adjustments', 'customs-value', 'customs-duty',
        'import-vat-value', 'import-vat', 'tax-duty-total', 'planning-total'
      ];
      const outputs = Object.fromEntries(outputIds.map((id) => [id, document.getElementById(id)]));
      let started = false;
      let rendered = false;

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
      const formatCurrency = (value) => new Intl.NumberFormat('en-GB', {
        style: 'currency', currency: 'GBP', maximumFractionDigits: 2, minimumFractionDigits: 2
      }).format(value);
      const values = () => Object.fromEntries(Object.entries(inputs).map(([key, input]) => [key, Number(input.value)]));
      const valueBand = (value) => value < 1000 ? 'under_1k' : value < 10000 ? '1k_10k' : value < 100000 ? '10k_100k' : '100k_plus';
      const eventProperties = (value, scenario) => ({
        customs_value_band: valueBand(scenario.customsValue),
        non_unit_fx: value.fxRate !== 1,
        has_adjustments: value.additions > 0 || value.deductions > 0,
        has_duty_rate: value.dutyRate > 0,
        has_vat_rate: value.vatRate > 0,
      });
      const render = (showValidation = false) => {
        inputs.deductions.setCustomValidity('');
        if (showValidation ? !form.reportValidity() : !form.checkValidity()) return null;
        const value = values();
        const scenario = calculateValueDutyScenario(value);
        if (scenario.customsValueBeforeClamp < 0) {
          inputs.deductions.setCustomValidity('Deductions exceed the converted goods price and additions. Check the build-up.');
          if (showValidation) inputs.deductions.reportValidity();
          result.hidden = true;
          rendered = false;
          status.textContent = 'The customs value build-up is below zero. Check the deductions entered.';
          return null;
        }
        outputs['converted-goods'].textContent = formatCurrency(scenario.convertedGoods);
        outputs['net-adjustments'].textContent = formatCurrency(scenario.netAdjustments);
        outputs['customs-value'].textContent = formatCurrency(scenario.customsValue);
        outputs['customs-duty'].textContent = formatCurrency(scenario.customsDuty);
        outputs['import-vat-value'].textContent = formatCurrency(scenario.importVatValue);
        outputs['import-vat'].textContent = formatCurrency(scenario.importVat);
        outputs['tax-duty-total'].textContent = formatCurrency(scenario.taxDutyTotal);
        outputs['planning-total'].textContent = formatCurrency(scenario.planningTotal);
        document.getElementById('result-duty-rate').textContent = value.dutyRate.toLocaleString('en-GB', { maximumFractionDigits: 4 }) + '%';
        document.getElementById('result-vat-rate').textContent = value.vatRate.toLocaleString('en-GB', { maximumFractionDigits: 4 }) + '%';
        result.hidden = false;
        rendered = true;
        return { value, scenario };
      };

      Object.values(inputs).forEach((input) => input.addEventListener('input', () => {
        input.setCustomValidity('');
        if (!started) { started = true; track('tool_started'); }
        if (rendered) render(false);
      }));
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const calculation = render(true);
        if (!calculation) return;
        track('tool_completed', eventProperties(calculation.value, calculation.scenario));
        status.textContent = 'Planning scenario calculated from the ten inputs shown.';
        result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      });

      const shareUrl = (value) => {
        const url = new URL(location.href);
        ['src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'g', 'x', 'f', 'i', 'a', 'd', 'r', 'o', 'e', 'v'].forEach((key) => url.searchParams.delete(key));
        const params = { g: value.goodsAmount, x: value.fxRate, f: value.freight, i: value.insurance, a: value.additions, d: value.deductions, r: value.dutyRate, o: value.otherImportCharges, e: value.incidentalExpenses, v: value.vatRate };
        Object.entries(params).forEach(([key, entry]) => url.searchParams.set(key, entry));
        return url.toString();
      };
      document.getElementById('share-value-duty').addEventListener('click', async () => {
        const calculation = render(true);
        if (!calculation) return;
        const url = shareUrl(calculation.value);
        let method = 'copy_link';
        try {
          if (navigator.share) {
            method = 'native_share';
            await navigator.share({ title: '${escapeHtml(workpaper.schemaName)}', url });
            status.textContent = 'Planning scenario shared with the ten inputs shown.';
          } else {
            await navigator.clipboard.writeText(url);
            status.textContent = 'Share link copied. It includes the ten inputs shown on this page.';
          }
          track('tool_result_shared', { ...eventProperties(calculation.value, calculation.scenario), method });
        } catch (error) {
          if (error && error.name === 'AbortError') return;
          status.textContent = 'Sharing was blocked by the browser. Use Print or save instead.';
        }
      });
      document.getElementById('print-value-duty').addEventListener('click', () => {
        const calculation = render(true);
        if (!calculation) return;
        track('tool_result_printed', eventProperties(calculation.value, calculation.scenario));
        window.print();
      });
      document.getElementById('value-duty-booking').addEventListener('click', () => {
        const calculation = rendered ? render(false) : null;
        track('tool_booking_clicked', calculation ? eventProperties(calculation.value, calculation.scenario) : { result_generated: false });
      });

      const paramConfig = {
        goodsAmount: ['g', 0.01, 1000000000000], fxRate: ['x', 0.0000001, 1000000],
        freight: ['f', 0, 1000000000000], insurance: ['i', 0, 1000000000000],
        additions: ['a', 0, 1000000000000], deductions: ['d', 0, 1000000000000],
        dutyRate: ['r', 0, 1000], otherImportCharges: ['o', 0, 1000000000000],
        incidentalExpenses: ['e', 0, 1000000000000], vatRate: ['v', 0, 100],
      };
      const params = new URLSearchParams(location.search);
      let hasCompleteSharedState = true;
      Object.entries(paramConfig).forEach(([key, [param, min, max]]) => {
        const raw = params.get(param);
        const value = raw === null ? NaN : Number(raw);
        if (!Number.isFinite(value) || value < min || value > max) {
          hasCompleteSharedState = false;
          return;
        }
        inputs[key].value = String(value);
      });
      attribution();
      if (hasCompleteSharedState) {
        const calculation = render(false);
        if (calculation) status.textContent = 'Shared planning scenario restored from the ten inputs in the link.';
      }
    })();
  </script>`
}

export function renderValueDutyWorkpaper(workpaper, site, { navHtml, webmasterHtml, posthogKey, posthogHost }) {
  const canonical = `${site.origin}${workpaper.path}`
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(workpaper.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterHtml}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <link rel="stylesheet" href="/calculator.css" />
    <link rel="stylesheet" href="/value-duty-workpaper.css" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(workpaper.title)}" />
    <meta property="og:description" content="${escapeHtml(workpaper.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(workpaper.title)}" />
    <meta name="twitter:description" content="${escapeHtml(workpaper.description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${escapeHtml(workpaper.title)}</title>
    <script type="application/ld+json">${jsonLd(workpaper, site)}</script>
  </head>
  <body>
    <div class="docket calculator-docket value-duty-docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>WORKPAPER</span><strong>FREE · PRIVATE</strong></div>
        <a class="masthead-cta" href="/?src=tool_customs_value_duty_vat#book">BOOK THE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${navHtml}</nav>
      <div class="breadcrumbs"><a href="/">HOME</a> → FREE TOOLS → CUSTOMS VALUE + DUTY</div>
      <main>
        <header class="hero calculator-hero value-duty-hero">
          <div class="hero-copy">
            <p class="eyebrow">${escapeHtml(workpaper.eyebrow)}</p>
            <h1>${escapeHtml(workpaper.h1)}</h1>
            <p>${escapeHtml(workpaper.standfirst)}</p>
            <div class="value-duty-hero-actions"><a class="button" href="#valuation-workpaper">BUILD MY SCENARIO</a><a href="#official-checkpoints">CHECK THE INPUT SOURCES →</a></div>
            <div class="calculator-trust"><strong>10 EXPLICIT INPUTS</strong><strong>6 DECISION OUTPUTS</strong><strong>PRINT OR SHARE</strong></div>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${escapeHtml(workpaper.ref)}</span>
            <div class="stamp">BUILD<br />THEN CHECK</div>
            <div class="review-cell"><span>EDITION</span><strong>${workpaper.reviewedOn}</strong></div>
          </aside>
        </header>

        <section class="calculator-answer value-duty-answer" aria-labelledby="value-duty-direct-answer">
          <span class="section-label">DIRECT ANSWER</span>
          <div>
            <h2 id="value-duty-direct-answer">How do customs value, duty and import VAT connect?</h2>
            <p>For a transaction-value planning scenario, start with the converted goods price, then add or deduct the amounts you have established for customs value. Apply the duty rate you have checked. Build the import VAT value by adding duty, other import charges and relevant incidental expenses.</p>
            <div class="equation-stack"><code>CUSTOMS VALUE = CONVERTED GOODS + FREIGHT + INSURANCE + ADDITIONS − DEDUCTIONS</code><code>DUTY = CUSTOMS VALUE × YOUR DUTY RATE</code><code>IMPORT VAT = IMPORT VAT VALUE × YOUR VAT RATE</code></div>
          </div>
        </section>

        <section class="official-checkpoints" id="official-checkpoints" aria-labelledby="checkpoint-heading">
          <header><span class="section-label">BEFORE YOU TYPE</span><h2 id="checkpoint-heading">Bring the method and rates. The workpaper brings the cross-foot.</h2></header>
          <div>
            <a href="https://www.gov.uk/guidance/customs-valuation/method-1-transaction-value"><span>01 · VALUE</span><strong>Check the valuation method, sale, additions and deductions.</strong><b>HMRC GUIDANCE →</b></a>
            <a href="https://www.gov.uk/guidance/customs-valuation/exchange-rates"><span>02 · FX</span><strong>Check the exchange rate applicable to the valuation.</strong><b>HMRC GUIDANCE →</b></a>
            <a href="https://www.gov.uk/trade-tariff"><span>03 · RATES</span><strong>Check the commodity code, measures, duty and VAT rates.</strong><b>UK TRADE TARIFF →</b></a>
          </div>
        </section>

        <section class="value-duty-workpaper" id="valuation-workpaper" aria-labelledby="workpaper-heading">
          <header class="value-duty-workpaper-header"><span class="section-label">YOUR PLANNING SCENARIO</span><h2 id="workpaper-heading">Cross-foot the movement in three stages.</h2><p>Enter every field. Use 0 only where you have checked that a charge, adjustment or rate does not apply. No input is fetched or inferred.</p></header>
          <form id="value-duty-form">
            <fieldset class="valuation-stage">
              <legend><span>STAGE 01</span><strong>Convert the goods price.</strong><small>Enter the invoice amount and pounds sterling per one invoice-currency unit.</small></legend>
              <div class="valuation-fields">
                <label class="valuation-field" for="goods-amount"><span><b>01</b> Goods price / amount</span><small>Amount in the invoice currency before this workpaper converts it.</small><span class="valuation-input-line"><input id="goods-amount" name="goods-amount" type="number" min="0.01" max="1000000000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>INVOICE CURRENCY</i></span></label>
                <label class="valuation-field" for="fx-rate"><span><b>02</b> GBP per 1 currency unit</span><small>Enter 1 if the goods amount is already GBP. Otherwise enter the applicable rate you checked.</small><span class="valuation-input-line"><input id="fx-rate" name="fx-rate" type="number" min="0.0000001" max="1000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP / UNIT</i></span></label>
              </div>
            </fieldset>

            <fieldset class="valuation-stage">
              <legend><span>STAGE 02</span><strong>Build the customs value.</strong><small>Enter only the GBP amounts your valuation method and evidence support.</small></legend>
              <div class="valuation-fields">
                <label class="valuation-field" for="freight"><span><b>03</b> Freight, loading + handling</span><small>Amount to include up to the relevant UK place of introduction.</small><span class="valuation-input-line is-gbp"><input id="freight" name="freight" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
                <label class="valuation-field" for="insurance"><span><b>04</b> Insurance</span><small>Apportioned transport insurance amount you have established for customs value.</small><span class="valuation-input-line is-gbp"><input id="insurance" name="insurance" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
                <label class="valuation-field" for="additions"><span><b>05</b> Other additions</span><small>Assists, packing, royalties, commission or other additions only where established.</small><span class="valuation-input-line is-gbp"><input id="additions" name="additions" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
                <label class="valuation-field" for="deductions"><span><b>06</b> Permitted deductions</span><small>Amounts already included in price that you have established may be excluded.</small><span class="valuation-input-line is-gbp"><input id="deductions" name="deductions" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
              </div>
            </fieldset>

            <fieldset class="valuation-stage">
              <legend><span>STAGE 03</span><strong>Apply your duty + VAT scenario.</strong><small>Use the percentage and charge amounts you have checked for this movement.</small></legend>
              <div class="valuation-fields">
                <label class="valuation-field" for="duty-rate"><span><b>07</b> Ad valorem duty rate</span><small>Rate established from the applicable tariff treatment. Enter 0 only after checking.</small><span class="valuation-input-line"><input id="duty-rate" name="duty-rate" type="number" min="0" max="1000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>PERCENT</i></span></label>
                <label class="valuation-field" for="other-import-charges"><span><b>08</b> Other import charges</span><small>Excise Duty, levy or other charge payable on importation, excluding VAT itself.</small><span class="valuation-input-line is-gbp"><input id="other-import-charges" name="other-import-charges" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
                <label class="valuation-field" for="incidental-expenses"><span><b>09</b> Import VAT incidental expenses</span><small>Relevant known commissions, packing, transport or insurance beyond customs value.</small><span class="valuation-input-line is-gbp"><input id="incidental-expenses" name="incidental-expenses" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
                <label class="valuation-field" for="vat-rate"><span><b>10</b> Import VAT rate</span><small>Rate you have checked for the goods and import treatment.</small><span class="valuation-input-line"><input id="vat-rate" name="vat-rate" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>PERCENT</i></span></label>
              </div>
            </fieldset>

            <div class="calculator-submit value-duty-submit"><p><strong>10 explicit inputs.</strong> Nothing is looked up, inferred, uploaded or emailed.</p><button class="button" type="submit">BUILD MY PLANNING SCENARIO</button></div>
          </form>
        </section>

        <section class="value-duty-result" id="value-duty-result" aria-labelledby="value-duty-result-heading" aria-live="polite" hidden>
          <header class="value-duty-result-lead"><span class="section-label">YOUR CROSS-FOOT</span><h2 id="value-duty-result-heading"><output id="tax-duty-total">£0.00</output> duties + taxes in this scenario.</h2><p>The result applies only the ten inputs shown. Keep the source evidence, valuation decision, commodity code and rate checks beside it.</p></header>
          <div class="value-duty-ledger">
            <article><span>CONVERTED GOODS</span><strong><output id="converted-goods">£0.00</output></strong><p>Goods amount × your GBP-per-unit rate.</p></article>
            <article><span>NET OTHER ADJUSTMENTS</span><strong><output id="net-adjustments">£0.00</output></strong><p>Other additions minus permitted deductions.</p></article>
            <article class="value-duty-key"><span>CUSTOMS VALUE</span><strong><output id="customs-value">£0.00</output></strong><p>Converted goods + freight + insurance + net adjustments.</p></article>
            <article><span>CUSTOMS DUTY · <b id="result-duty-rate">0%</b></span><strong><output id="customs-duty">£0.00</output></strong><p>Customs value × your duty rate.</p></article>
            <article><span>IMPORT VAT VALUE</span><strong><output id="import-vat-value">£0.00</output></strong><p>Customs value + duty + other import charges + incidental expenses.</p></article>
            <article><span>IMPORT VAT · <b id="result-vat-rate">0%</b></span><strong><output id="import-vat">£0.00</output></strong><p>Import VAT value × your VAT rate.</p></article>
            <article class="value-duty-total"><span>PLANNING TOTAL</span><strong><output id="planning-total">£0.00</output></strong><p>Customs value + duty + other import charges + incidental expenses + import VAT. This is a worksheet cross-foot, not a declared or assessed amount.</p></article>
          </div>
          <aside class="result-checkpoint"><span>CHECKPOINT</span><div><h3>Before this number leaves the worksheet.</h3><p>Confirm the valuation method, exchange rate, inclusions, deductions, commodity code, origin, preference or relief, duty measures, VAT treatment, and declaration date. The workpaper does not decide or verify any of them.</p></div></aside>
          <div class="calculator-actions value-duty-actions"><div><span class="section-label">TAKE IT TO THE REVIEW</span><p>The share link includes the ten visible inputs. Print produces a clean input, formula and result record.</p></div><button class="secondary-button" id="share-value-duty" type="button">SHARE THIS SCENARIO</button><button class="secondary-button" id="print-value-duty" type="button">PRINT / SAVE</button></div>
        </section>
        <p class="visually-hidden" id="value-duty-status" aria-live="polite"></p>

        <section class="formula-register value-duty-formulas" aria-labelledby="value-duty-formulas-heading"><header><span class="section-label">FORMULA CONTRACT</span><h2 id="value-duty-formulas-heading">Every step is inspectable.</h2><p>The arithmetic is deterministic and runs in this browser. Change one input and rebuild the scenario; no hidden rate or tariff table changes the result.</p></header><div><p><b>CONVERTED GOODS</b><code>GOODS AMOUNT × YOUR GBP-PER-UNIT RATE</code></p><p><b>CUSTOMS VALUE</b><code>CONVERTED GOODS + FREIGHT + INSURANCE + ADDITIONS − DEDUCTIONS</code></p><p><b>CUSTOMS DUTY</b><code>CUSTOMS VALUE × YOUR DUTY RATE ÷ 100</code></p><p><b>IMPORT VAT VALUE</b><code>CUSTOMS VALUE + DUTY + OTHER IMPORT CHARGES + INCIDENTAL EXPENSES</code></p><p><b>IMPORT VAT</b><code>IMPORT VAT VALUE × YOUR VAT RATE ÷ 100</code></p><p><b>DUTIES + TAXES</b><code>DUTY + OTHER IMPORT CHARGES + IMPORT VAT</code></p></div></section>

        <section class="related-workpapers" aria-labelledby="related-workpapers-heading"><header><span class="section-label">KEEP WORKING</span><h2 id="related-workpapers-heading">Take the number into the operation.</h2><p>Use the other free Declarix workpapers to test desk economics, map the document handoff, and prepare a 2026 consultation response.</p></header><nav aria-label="Related free Declarix resources"><a href="/tools/customs-declaration-cost-calculator/"><span>FREE CALCULATOR</span><strong>Customs desk economics</strong><b>RUN THE COST MODEL →</b></a><a href="/tools/customs-document-pack-check/"><span>FREE WORKPAPER</span><strong>Customs document pack check</strong><b>MAP THE HANDOFF →</b></a><a href="/customs-intermediary-registration-2026/"><span>FREE RESPONSE KIT</span><strong>Customs intermediary registration 2026</strong><b>OPEN THE KIT →</b></a></nav></section>

        <section class="calculator-cta value-duty-cta"><div><span class="section-label">20-MINUTE NUMBERS CALL</span><h2>Now connect value, workflow and desk economics.</h2><p>Bring a representative document flow, the customs system your team files through, and the desk numbers you want to test. Leave with the integration route and recommended first workflow.</p></div><a class="button" id="value-duty-booking" href="/?src=tool_customs_value_duty_vat#book">BOOK THE 20-MINUTE NUMBERS CALL</a></section>

        <section class="faq-register value-duty-questions" aria-labelledby="value-duty-questions-heading"><header><span class="section-label">WORKPAPER QUESTIONS</span><h2 id="value-duty-questions-heading">Know what you still need to decide.</h2></header><div>${renderQuestions(workpaper)}</div></section>
        ${renderSources(workpaper)}
        <div class="source-stamp">FREE WORKPAPER · VERSION 1.0 · REVIEWED ${workpaper.reviewedOn} · <a href="/editorial-policy/">SOURCES AND CORRECTIONS</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
      </main>
      <footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/pricing/">PRICING</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav></footer>
    </div>
    ${workpaperScript(workpaper, posthogKey, posthogHost)}
  </body>
</html>`
}

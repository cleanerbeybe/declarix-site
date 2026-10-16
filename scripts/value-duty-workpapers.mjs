import { breadcrumbHtml, breadcrumbList, organizationNode } from './site-graph.mjs'
export const valueDutyWorkpapers = [
  {
    path: '/tools/customs-value-import-duty-vat-calculator/',
    id: 'customs_value_duty_vat_workpaper',
    ref: 'WORKPAPER 03 · VALUATION + DUTY',
    title: 'Import Duty Calculator UK: Duty, VAT and Customs Value',
    schemaName: 'Customs value, ad valorem duty and VAT planning workpaper',
    reviewedOn: '2026-10-16',
    modifiedOn: '2026-10-16',
    description:
      'Free UK import duty calculator: work out customs value (CIF to the UK border), import duty, import VAT and landed cost, every formula shown. No sign-up.',
    eyebrow: 'FREE CUSTOMS VALUE WORKPAPER · YOUR RATES · NO SIGN-UP',
    h1: 'Import duty and VAT calculator UK',
    subhead: 'Build the customs value, ad valorem duty and import VAT scenario.',
    standfirst:
      'Cross-foot the invoice, freight, insurance, adjustments, percentage-based duty and import VAT in one browser-only worksheet. Every rate comes from you. Every formula stays visible.',
    questions: [
      {
        question: 'Which exchange rate should I enter?',
        answer:
          'Enter invoice-currency units per £1. HMRC monthly tables use this direction: if £1 equals 1.1564 euros, enter 1.1564 and the workpaper divides the euro amount by that rate. If the goods amount is already in pounds, enter 1. This workpaper does not choose the applicable rate.',
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
      {
        question: 'Does this calculate specific or compound customs duties?',
        answer:
          'No. This version applies only an ad valorem percentage to customs value. If the tariff measure uses an amount per weight or unit, or combines that amount with a percentage, use the applicable tariff calculation instead of this duty result.',
      },
      {
        question: 'How is import duty calculated in the UK?',
        answer:
          'For a percentage (ad valorem) duty, multiply the customs value in pounds by the duty rate for the commodity code. The customs value under the transaction-value method usually starts from the price paid, converted to pounds, plus transport and insurance to the UK border and any other required additions. This calculator shows each of those steps.',
      },
      {
        question: 'Is VAT charged on the duty?',
        answer:
          'Yes. HMRC builds the VAT value from the customs value plus customs duty, any other import charges and relevant incidental expenses, then applies the VAT rate. That is why import VAT is usually more than 20% of the goods price alone.',
      },
      {
        question: 'Do goods from the EU pay import duty?',
        answer:
          'Goods that originate in the EU can qualify for a 0% preferential rate under the UK–EU Trade and Cooperation Agreement when the rules of origin are met and the importer holds the required proof of origin. Otherwise the standard rate for the commodity code applies. Enter the rate you have established for the movement.',
      },
      {
        question: 'What is landed cost?',
        answer:
          'Landed cost is the full cost of getting goods into the UK and cleared: the goods price, freight and insurance, import duty, import VAT and any other import charges. This calculator shows it as the planning total, and per unit when you enter the number of units. VAT-registered businesses can usually reclaim import VAT, so the result also shows the cost per unit without import VAT.',
      },
      {
        question: 'Do I pay duty on shipping costs?',
        answer:
          'Yes. Customs Duty is charged on the price paid for the goods plus postage, packaging and insurance. For a commercial import, freight, loading, handling and insurance up to the place where the goods enter the UK form part of the customs value. Transport and insurance after the goods arrive in the UK can be left out of the customs value when they are shown separately, but they still go into the import VAT value.',
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
        title: 'July 2026 HMRC monthly exchange-rate table',
        publisher: 'HM Revenue & Customs · UK Integrated Online Tariff',
        checked: '17 JULY 2026',
        url: 'https://www.trade-tariff.service.gov.uk/exchange_rates/view/2026-7',
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
      {
        title: 'Tax and customs for goods sent from abroad: tax and duty',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '16 OCTOBER 2026',
        url: 'https://www.gov.uk/goods-sent-from-abroad/tax-and-duty',
      },
      {
        title: 'Check when you can account for import VAT on your VAT Return',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '16 OCTOBER 2026',
        url: 'https://www.gov.uk/guidance/check-when-you-can-account-for-import-vat-on-your-vat-return',
      },
      {
        title: 'UK trade agreements in effect',
        publisher: 'Department for Business and Trade · GOV.UK',
        checked: '16 OCTOBER 2026',
        url: 'https://www.gov.uk/guidance/uk-trade-agreements-in-effect',
      },
      {
        title: 'Check your goods meet the rules of origin',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '16 OCTOBER 2026',
        url: 'https://www.gov.uk/guidance/check-your-goods-meet-the-rules-of-origin',
      },
      {
        title: 'Rates of VAT on different goods and services',
        publisher: 'HM Revenue & Customs · GOV.UK',
        checked: '16 OCTOBER 2026',
        url: 'https://www.gov.uk/guidance/rates-of-vat-on-different-goods-and-services',
      },
    ],
  },
]

export function calculateValueDutyScenario(input) {
  const maxAmount = 100000000
  const minCurrencyUnitsPerGbp = 0.0001
  const maxCurrencyUnitsPerGbp = 1000000
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
  for (const key of ['goodsAmount', 'freight', 'insurance', 'additions', 'deductions', 'otherImportCharges', 'incidentalExpenses']) {
    if (input[key] > maxAmount) throw new Error(`Amount exceeds supported planning range: ${key}`)
  }
  if (input.fxRate < minCurrencyUnitsPerGbp || input.fxRate > maxCurrencyUnitsPerGbp) {
    throw new Error('Currency units per GBP are outside the supported planning range')
  }
  if (input.dutyRate > 1000 || input.vatRate > 100) throw new Error('Percentage rate exceeds supported planning range')

  const convertedGoods = input.goodsAmount / input.fxRate
  const netAdjustments = input.additions - input.deductions
  const customsValueBeforeClamp = convertedGoods + input.freight + input.insurance + netAdjustments
  const customsValue = Math.max(0, customsValueBeforeClamp)
  const customsDuty = customsValue * (input.dutyRate / 100)
  const importVatValue = customsValue + customsDuty + input.otherImportCharges + input.incidentalExpenses
  const importVat = importVatValue * (input.vatRate / 100)
  const taxDutyTotal = customsDuty + input.otherImportCharges + importVat
  const planningTotal = customsValue + customsDuty + input.otherImportCharges + input.incidentalExpenses + importVat
  const scenario = {
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
  // Optional units: per-unit figures appear only when a unit count is given.
  if (input.units == null) return scenario
  if (!Number.isFinite(input.units) || input.units <= 0 || input.units > maxAmount) {
    throw new Error('Units must be above 0 and inside the supported planning range')
  }
  return {
    ...scenario,
    units: input.units,
    dutyVatPerUnit: taxDutyTotal / input.units,
    landedCostPerUnit: planningTotal / input.units,
    landedCostPerUnitExVat: (planningTotal - importVat) / input.units,
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
      organizationNode(site),
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
          'User-entered ad valorem import duty and import VAT planning scenario',
          'Visible formulas',
          'Print and explicit share link',
        ],
        citation: workpaper.sources.map((source) => source.url),
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
      },
      breadcrumbList(site, workpaper.path),
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

const workedExamples = [
  {
    id: 'A',
    title: 'EU goods invoiced in euros',
    story: 'A UK importer buys €10,000 of machine parts. Freight to the UK border is £500 and insurance £100. The tariff rate entered is 4%, with £150 of incidental expenses and 20% VAT.',
    currency: '€',
    input: { goodsAmount: 10000, fxRate: 1.1564, freight: 500, insurance: 100, additions: 0, deductions: 0, dutyRate: 4, otherImportCharges: 0, incidentalExpenses: 150, vatRate: 20 },
  },
  {
    id: 'B',
    title: 'US goods at a 0% duty rate',
    story: 'A $2,500 order of goods whose commodity code carries a 0% rate. Freight is £180 and insurance £20. Duty is nil, but import VAT at 20% still applies to the full VAT value.',
    currency: '$',
    input: { goodsAmount: 2500, fxRate: 1.3, freight: 180, insurance: 20, additions: 0, deductions: 0, dutyRate: 0, otherImportCharges: 0, incidentalExpenses: 0, vatRate: 20 },
  },
  {
    id: 'C',
    title: 'Sterling invoice with a royalty addition',
    story: 'A £1,200 invoice with £60 freight and a £100 royalty that must be added to the customs value. The tariff rate entered is 12%, with £40 of incidental expenses and 20% VAT.',
    currency: '£',
    input: { goodsAmount: 1200, fxRate: 1, freight: 60, insurance: 0, additions: 100, deductions: 0, dutyRate: 12, otherImportCharges: 0, incidentalExpenses: 40, vatRate: 20 },
  },
]

function renderWorkedExamples() {
  const gbp = (value) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
  const num = (value) => value.toLocaleString('en-GB', { maximumFractionDigits: 4 })
  return workedExamples
    .map((example) => {
      const i = example.input
      const r = calculateValueDutyScenario(i)
      const goods = example.currency === '£' ? gbp(i.goodsAmount) : `${example.currency}${num(i.goodsAmount)} ÷ ${num(i.fxRate)}`
      return `<article class="duty-example">
        <span class="section-label">WORKED EXAMPLE ${example.id}</span>
        <h3>${escapeHtml(example.title)}</h3>
        <p>${escapeHtml(example.story)}</p>
        <div class="duty-example-scroll" tabindex="0" role="region" aria-label="Worked example ${example.id}"><table>
          <tbody>
            <tr><th scope="row">Converted goods</th><td>${goods}</td><td>${gbp(r.convertedGoods)}</td></tr>
            <tr><th scope="row">Customs value</th><td>+ freight ${gbp(i.freight)} + insurance ${gbp(i.insurance)}${i.additions ? ` + additions ${gbp(i.additions)}` : ''}</td><td>${gbp(r.customsValue)}</td></tr>
            <tr><th scope="row">Import duty</th><td>${gbp(r.customsValue)} × ${num(i.dutyRate)}%</td><td>${gbp(r.customsDuty)}</td></tr>
            <tr><th scope="row">VAT value</th><td>Customs value + duty${i.incidentalExpenses ? ` + incidentals ${gbp(i.incidentalExpenses)}` : ''}</td><td>${gbp(r.importVatValue)}</td></tr>
            <tr><th scope="row">Import VAT</th><td>${gbp(r.importVatValue)} × ${num(i.vatRate)}%</td><td>${gbp(r.importVat)}</td></tr>
            <tr class="duty-example-total"><th scope="row">Duty + VAT</th><td>Import duty + import VAT</td><td>${gbp(r.taxDutyTotal)}</td></tr>
          </tbody>
        </table></div>
      </article>`
    })
    .join('')
}

// Facts below come from GOV.UK, checked 16 October 2026:
// - https://www.gov.uk/goods-sent-from-abroad/tax-and-duty (£135 and £39 gift rules, duty on postage + insurance)
// - https://www.gov.uk/guidance/check-when-you-can-account-for-import-vat-on-your-vat-return (PVA, no approval needed; updated 16 June 2025)
// - https://www.gov.uk/guidance/uk-trade-agreements-in-effect (no agreement with China or the USA; EU covered by the TCA; updated 1 September 2026)
// - https://www.gov.uk/guidance/check-your-goods-meet-the-rules-of-origin (preference needs origin + proof)
// - https://www.gov.uk/guidance/customs-valuation/method-1-transaction-value (transport + insurance to the place of introduction; updated 14 April 2026)
const originExamples = [
  {
    origin: 'China',
    agreement: 'No UK trade agreement',
    rate: 'The standard (third-country) rate for the commodity code in the UK Trade Tariff, unless a relief or suspension applies.',
    story: '£4,000 of goods, £350 freight and £50 insurance to the UK border, at a 6% rate',
    input: { goodsAmount: 4000, fxRate: 1, freight: 350, insurance: 50, additions: 0, deductions: 0, dutyRate: 6, otherImportCharges: 0, incidentalExpenses: 0, vatRate: 20 },
  },
  {
    origin: 'USA',
    agreement: 'No UK trade agreement',
    rate: 'The standard rate for the commodity code in the UK Trade Tariff. Check the code for any quota or suspension measure.',
    story: '$3,000 of goods at $1.30 per £1, £200 freight and £30 insurance, at a 2% rate',
    input: { goodsAmount: 3000, fxRate: 1.3, freight: 200, insurance: 30, additions: 0, deductions: 0, dutyRate: 2, otherImportCharges: 0, incidentalExpenses: 0, vatRate: 20 },
  },
  {
    origin: 'EU',
    agreement: 'UK–EU Trade and Cooperation Agreement',
    rate: '0% when the goods meet the rules of origin and you hold proof of origin. Otherwise the standard rate.',
    story: '€8,000 of goods at €1.1564 per £1, £300 freight and £40 insurance, at the 0% preference',
    input: { goodsAmount: 8000, fxRate: 1.1564, freight: 300, insurance: 40, additions: 0, deductions: 0, dutyRate: 0, otherImportCharges: 0, incidentalExpenses: 0, vatRate: 20 },
  },
]

function renderDutyTopics() {
  const gbp = (value) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
  const pvaExample = calculateValueDutyScenario(workedExamples[0].input)
  const originRows = originExamples
    .map((row) => {
      const r = calculateValueDutyScenario(row.input)
      return `<tr><th scope="row" data-label="Origin">${escapeHtml(row.origin)}</th><td data-label="Trade agreement">${escapeHtml(row.agreement)}</td><td data-label="Duty rate to enter">${escapeHtml(row.rate)}</td><td data-label="Worked example">${escapeHtml(row.story)}: customs value ${gbp(r.customsValue)}, duty ${gbp(r.customsDuty)}, import VAT ${gbp(r.importVat)}.</td></tr>`
    })
    .join('')
  return `<section class="duty-topics" aria-label="UK import duty and VAT rules">
          <article class="duty-topic" id="import-vat-pva">
            <span class="section-label">IMPORT VAT</span>
            <h2>Import VAT: pay now or postpone (PVA)</h2>
            <p>A VAT-registered business can postpone import VAT. Postponed VAT accounting (PVA) lets you declare the import VAT on your VAT Return and reclaim it on the same return, instead of paying it when the goods arrive. You do not need HMRC approval to use it. If you are not VAT-registered, you pay import VAT at import, usually through your courier or customs agent.</p>
            <p><strong>Cash-flow example.</strong> In worked example A, import VAT is ${gbp(pvaExample.importVat)}. Paid at the border, that cash leaves the business weeks before the VAT Return. With PVA, the charge and the reclaim sit on the same return, so the cash never leaves.</p>
            <p>HMRC puts the postponed amounts on a monthly postponed import VAT statement. Check that every import is on it with the free <a href="/tools/postponed-vat-statement-checker/">postponed VAT statement checker</a>.</p>
          </article>
          <article class="duty-topic" id="goods-under-135-and-gifts">
            <span class="section-label">LOW-VALUE GOODS</span>
            <h2>Goods under £135 and gifts</h2>
            <p>Goods worth £135 or less in total pay no Customs Duty unless they are excise goods. If you bought them, the seller adds the VAT at checkout. A gift from one person to another worth £39 or less pays no VAT. These are the Great Britain rules for goods sent by post or courier.</p>
            <div class="duty-table-wrap"><table class="duty-rules-table">
              <caption>Duty and VAT on goods sent from abroad to Great Britain</caption>
              <thead><tr><th scope="col">Goods</th><th scope="col">Customs Duty</th><th scope="col">VAT</th></tr></thead>
              <tbody>
                <tr><th scope="row" data-label="Goods">You bought them, £135 or less, not excise goods</th><td data-label="Customs Duty">No charge</td><td data-label="VAT">Included by the seller in the price you paid</td></tr>
                <tr><th scope="row" data-label="Goods">Gift worth £39 or less</th><td data-label="Customs Duty">No charge</td><td data-label="VAT">No VAT</td></tr>
                <tr><th scope="row" data-label="Goods">Gift worth more than £39, up to £135</th><td data-label="Customs Duty">No charge</td><td data-label="VAT">Paid to the delivery company</td></tr>
                <tr><th scope="row" data-label="Goods">Goods worth more than £135</th><td data-label="Customs Duty">The rate for the goods and origin in the Trade Tariff</td><td data-label="VAT">Paid to the delivery company, on the goods, postage, packaging, insurance and duty</td></tr>
                <tr><th scope="row" data-label="Goods">Excise goods (for example alcohol or tobacco)</th><td data-label="Customs Duty">Charged at any value</td><td data-label="VAT">Charged</td></tr>
              </tbody>
            </table></div>
          </article>
          <article class="duty-topic" id="duty-by-origin">
            <span class="section-label">ORIGIN + PREFERENCE</span>
            <h2>Duty from China, the USA and the EU</h2>
            <p>Where the goods were made sets the duty rate. The UK has no trade agreement with China or the USA, so the standard rate in the Trade Tariff applies. Goods made in the EU can enter at 0% under the UK–EU Trade and Cooperation Agreement when they meet the rules of origin and you hold the proof. All three examples use 20% VAT.</p>
            <div class="duty-table-wrap"><table class="duty-rules-table duty-origin-table">
              <caption>Worked examples by origin</caption>
              <thead><tr><th scope="col">Origin</th><th scope="col">Trade agreement</th><th scope="col">Duty rate to enter</th><th scope="col">Worked example</th></tr></thead>
              <tbody>${originRows}</tbody>
            </table></div>
            <p>Find the code and its rate with the free <a href="/tools/commodity-code-checker/">commodity code checker</a>, then enter the rate in field 07.</p>
          </article>
        </section>`
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
      const unitsInput = document.getElementById('units');
      const perUnit = document.getElementById('value-duty-per-unit');
      const shareButton = document.getElementById('share-value-duty');
      let flashTimer = null;
      const flashButton = (button, text) => {
        clearTimeout(flashTimer);
        button.textContent = text;
        button.classList.add('is-flashed');
        flashTimer = setTimeout(() => { button.textContent = button.dataset.label; button.classList.remove('is-flashed'); }, 2000);
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
      const values = () => {
        const value = Object.fromEntries(Object.entries(inputs).map(([key, input]) => [key, Number(input.value)]));
        if (unitsInput.value.trim() !== '') value.units = Number(unitsInput.value);
        return value;
      };
      const valueBand = (value) => value < 1000 ? 'under_1k' : value < 10000 ? '1k_10k' : value < 100000 ? '10k_100k' : '100k_plus';
      const eventProperties = (value, scenario) => ({
        customs_value_band: valueBand(scenario.customsValue),
        non_unit_fx: value.fxRate !== 1,
        has_adjustments: value.additions > 0 || value.deductions > 0,
        has_duty_rate: value.dutyRate > 0,
        has_vat_rate: value.vatRate > 0,
        has_units: 'units' in value,
      });
      const render = (showValidation = false) => {
        inputs.deductions.setCustomValidity('');
        if (showValidation ? !form.reportValidity() : !form.checkValidity()) return null;
        const value = values();
        const scenario = calculateValueDutyScenario(value);
        if (scenario.customsValueBeforeClamp < 0) {
          inputs.deductions.setCustomValidity('Deductions exceed the customs-value build-up before deductions. Check converted goods, freight, insurance and additions.');
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
        if (scenario.units) {
          document.getElementById('duty-vat-per-unit').textContent = formatCurrency(scenario.dutyVatPerUnit);
          document.getElementById('landed-cost-per-unit').textContent = formatCurrency(scenario.landedCostPerUnit);
          document.getElementById('landed-cost-per-unit-ex-vat').textContent = formatCurrency(scenario.landedCostPerUnitExVat);
          document.getElementById('result-units').textContent = scenario.units.toLocaleString('en-GB', { maximumFractionDigits: 4 });
          perUnit.hidden = false;
        } else {
          perUnit.hidden = true;
        }
        result.hidden = false;
        rendered = true;
        return { value, scenario };
      };

      [...Object.values(inputs), unitsInput].forEach((input) => input.addEventListener('input', () => {
        input.setCustomValidity('');
        if (!started) { started = true; track('tool_started'); }
        if (rendered) render(false);
      }));
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const calculation = render(true);
        if (!calculation) return;
        track('tool_completed', eventProperties(calculation.value, calculation.scenario));
        status.textContent = 'Planning scenario calculated from the inputs shown.';
        result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      });

      const shareUrl = (value) => {
        const url = new URL(location.href);
        ['src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'g', 'x', 'f', 'i', 'a', 'd', 'r', 'o', 'e', 'v', 'u'].forEach((key) => url.searchParams.delete(key));
        const params = { g: value.goodsAmount, x: value.fxRate, f: value.freight, i: value.insurance, a: value.additions, d: value.deductions, r: value.dutyRate, o: value.otherImportCharges, e: value.incidentalExpenses, v: value.vatRate };
        if ('units' in value) params.u = value.units;
        Object.entries(params).forEach(([key, entry]) => url.searchParams.set(key, entry));
        return url.toString();
      };
      shareButton.addEventListener('click', async () => {
        const calculation = render(true);
        if (!calculation) return;
        const url = shareUrl(calculation.value);
        let method = 'copy_link';
        try {
          if (navigator.share) {
            method = 'native_share';
            await navigator.share({ title: '${escapeHtml(workpaper.schemaName)}', url });
            status.textContent = 'Planning scenario shared with the inputs shown.';
            flashButton(shareButton, 'SHARED ✓');
          } else {
            await navigator.clipboard.writeText(url);
            status.textContent = 'Share link copied. It includes the inputs shown on this page.';
            flashButton(shareButton, 'COPIED ✓');
          }
          track('tool_result_shared', { ...eventProperties(calculation.value, calculation.scenario), method });
        } catch (error) {
          if (error && error.name === 'AbortError') return;
          status.textContent = 'Sharing was blocked by the browser. Use Print or save instead.';
          flashButton(shareButton, 'COPY BLOCKED · USE PRINT');
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
        goodsAmount: ['g', 0.01, 100000000], fxRate: ['x', 0.0001, 1000000],
        freight: ['f', 0, 100000000], insurance: ['i', 0, 100000000],
        additions: ['a', 0, 100000000], deductions: ['d', 0, 100000000],
        dutyRate: ['r', 0, 1000], otherImportCharges: ['o', 0, 100000000],
        incidentalExpenses: ['e', 0, 100000000], vatRate: ['v', 0, 100],
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
      const sharedUnits = params.get('u');
      if (sharedUnits !== null && Number.isFinite(Number(sharedUnits)) && Number(sharedUnits) > 0 && Number(sharedUnits) <= 100000000) unitsInput.value = String(Number(sharedUnits));
      attribution();
      if (hasCompleteSharedState) {
        const calculation = render(false);
        if (calculation) status.textContent = 'Shared planning scenario restored from the inputs in the link.';
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
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" /><link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
      <div class="breadcrumbs">${breadcrumbHtml(workpaper.path, 'CUSTOMS VALUE + DUTY')}</div>
      <main>
        <header class="hero calculator-hero tool-first-hero value-duty-hero">
          <p class="eyebrow">${escapeHtml(workpaper.eyebrow)}</p>
          <h1>${escapeHtml(workpaper.h1)}</h1>
          <p class="tool-subhead">${escapeHtml(workpaper.subhead)}</p>
        </header>

        <div class="tool-first-grid value-duty-tool-grid">
          <div class="tool-first-main">
        <section class="value-duty-workpaper" id="valuation-workpaper" aria-labelledby="workpaper-heading">
          <header class="value-duty-workpaper-header"><span class="section-label">YOUR PLANNING SCENARIO</span><h2 id="workpaper-heading">Cross-foot (add up and check) your shipment in three stages.</h2><p>Enter every field. Use 0 only where you have checked that a charge, adjustment or rate does not apply. No input is fetched or inferred.</p></header>
          <form id="value-duty-form">
            <fieldset class="valuation-stage">
              <legend><span>STAGE 01</span><strong>Convert the goods price.</strong><small>Enter the invoice amount and invoice-currency units per £1, matching HMRC's published table direction.</small></legend>
              <div class="valuation-fields">
                <label class="valuation-field" for="goods-amount"><span><b>01</b> Goods price / amount</span><small>Amount in the invoice currency before this workpaper converts it.</small><span class="valuation-input-line"><input id="goods-amount" name="goods-amount" type="number" min="0.01" max="100000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>INVOICE CURRENCY</i></span></label>
                <label class="valuation-field" for="fx-rate"><span><b>02</b> Currency units per £1</span><small>If £1 = 1.1564 EUR, enter 1.1564. Enter 1 when the goods amount is GBP.</small><span class="valuation-input-line"><input id="fx-rate" name="fx-rate" type="number" min="0.0001" max="1000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>UNITS / GBP</i></span></label>
              </div>
            </fieldset>

            <fieldset class="valuation-stage">
              <legend><span>STAGE 02</span><strong>Build the customs value.</strong><small>Enter only the GBP amounts your valuation method and evidence support.</small></legend>
              <div class="valuation-fields">
                <label class="valuation-field" for="freight"><span><b>03</b> Freight, loading + handling</span><small>Amount to include up to the relevant UK place of introduction (where the goods enter the UK).</small><span class="valuation-input-line is-gbp"><input id="freight" name="freight" type="number" min="0" max="100000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
                <label class="valuation-field" for="insurance"><span><b>04</b> Insurance</span><small>Apportioned transport insurance amount you have established (checked and can prove) for customs value.</small><span class="valuation-input-line is-gbp"><input id="insurance" name="insurance" type="number" min="0" max="100000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
                <label class="valuation-field" for="additions"><span><b>05</b> Other additions</span><small>Assists (tools, moulds, materials or designs you gave the maker free or at a reduced price), packing, royalties, commission or other additions only where established (checked and backed by evidence).</small><small class="valuation-hint">Most buyers who only pay the supplier for the goods enter 0 here.</small><span class="valuation-input-line is-gbp"><input id="additions" name="additions" type="number" min="0" max="100000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
                <label class="valuation-field" for="deductions"><span><b>06</b> Permitted deductions</span><small>Amounts already included in price that you have established (checked and can prove) may be excluded, such as UK transport after arrival shown separately on the invoice.</small><small class="valuation-hint">Most buyers who only pay the supplier for the goods enter 0 here.</small><span class="valuation-input-line is-gbp"><input id="deductions" name="deductions" type="number" min="0" max="100000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
              </div>
            </fieldset>

            <fieldset class="valuation-stage">
              <legend><span>STAGE 03</span><strong>Apply your duty + VAT scenario.</strong><small>Use the percentage and charge amounts you have checked for this movement.</small></legend>
              <div class="valuation-fields">
                <label class="valuation-field" for="duty-rate"><span><b>07</b> Duty rate (%) — ad valorem</span><small>Ad valorem means a percentage of the customs value. Use the rate established (checked and confirmed) for your commodity code and origin in the UK Trade Tariff. Enter 0 only after checking.</small><span class="valuation-input-line"><input id="duty-rate" name="duty-rate" type="number" min="0" max="1000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>PERCENT</i></span></label>
                <label class="valuation-field" for="other-import-charges"><span><b>08</b> Other import charges</span><small>Excise Duty, levy or other charge payable on importation, excluding VAT itself.</small><span class="valuation-input-line is-gbp"><input id="other-import-charges" name="other-import-charges" type="number" min="0" max="100000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
                <label class="valuation-field" for="incidental-expenses"><span><b>09</b> Import VAT incidental expenses</span><small>Relevant known commissions, packing, transport or insurance beyond customs value, such as delivery from the UK port to your first UK address.</small><small class="valuation-hint">Most buyers who only pay the supplier for the goods enter 0 here.</small><span class="valuation-input-line is-gbp"><input id="incidental-expenses" name="incidental-expenses" type="number" min="0" max="100000000" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>GBP</i></span></label>
                <label class="valuation-field" for="vat-rate"><span><b>10</b> Import VAT rate</span><small>Rate you have checked for the goods and import treatment: 20% standard, 5% reduced or 0% zero rate.</small><span class="valuation-input-line"><input id="vat-rate" name="vat-rate" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="Required" autocomplete="off" required /><i>PERCENT</i></span></label>
              </div>
            </fieldset>

            <fieldset class="valuation-stage valuation-stage-optional">
              <legend><span>OPTIONAL</span><strong>Cost per unit.</strong><small>Add the number of units to see duty + VAT and landed cost for each one.</small></legend>
              <div class="valuation-fields">
                <label class="valuation-field" for="units"><span><b>11</b> Units in this shipment</span><small>Optional. For example, 1,200 for 1,200 pieces. Leave blank to skip the per-unit view.</small><span class="valuation-input-line"><input id="units" name="units" type="number" min="0.0001" max="100000000" step="any" inputmode="decimal" placeholder="Optional" autocomplete="off" /><i>UNITS</i></span></label>
              </div>
            </fieldset>

            <div class="calculator-submit value-duty-submit"><p><strong>10 explicit inputs + optional units.</strong> Nothing is looked up, inferred, uploaded or emailed.</p><button class="button" type="submit">BUILD MY PLANNING SCENARIO</button></div>
          </form>
        </section>

        <section class="value-duty-result" id="value-duty-result" aria-labelledby="value-duty-result-heading" aria-live="polite" hidden>
          <header class="value-duty-result-lead"><span class="section-label">YOUR CROSS-FOOT (ADD-UP)</span><h2 id="value-duty-result-heading"><output id="tax-duty-total">£0.00</output> duties + taxes in this scenario.</h2><p>The result applies only the inputs shown. Keep the source evidence, valuation decision, commodity code and rate checks beside it.</p></header>
          <div class="value-duty-ledger">
            <article><span>CONVERTED GOODS</span><strong><output id="converted-goods">£0.00</output></strong><p>Goods amount ÷ invoice-currency units per £1.</p></article>
            <article><span>NET OTHER ADJUSTMENTS</span><strong><output id="net-adjustments">£0.00</output></strong><p>Other additions minus permitted deductions.</p></article>
            <article class="value-duty-key"><span>CUSTOMS VALUE</span><strong><output id="customs-value">£0.00</output></strong><p>Converted goods + freight + insurance + net adjustments.</p></article>
            <article><span>AD VALOREM DUTY · <b id="result-duty-rate">0%</b></span><strong><output id="customs-duty">£0.00</output></strong><p>Customs value × your percentage duty rate.</p></article>
            <article><span>IMPORT VAT VALUE</span><strong><output id="import-vat-value">£0.00</output></strong><p>Customs value + duty + other import charges + incidental expenses.</p></article>
            <article><span>IMPORT VAT · <b id="result-vat-rate">0%</b></span><strong><output id="import-vat">£0.00</output></strong><p>Import VAT value × your VAT rate.</p></article>
            <article class="value-duty-total"><span>PLANNING TOTAL · LANDED COST</span><strong><output id="planning-total">£0.00</output></strong><p>Customs value + duty + other import charges + incidental expenses + import VAT. This is a worksheet cross-foot, not a declared or assessed amount.</p></article>
          </div>
          <div class="value-duty-ledger value-duty-unit-ledger" id="value-duty-per-unit" hidden>
            <article><span>DUTY + VAT PER UNIT</span><strong><output id="duty-vat-per-unit">£0.00</output></strong><p>Duties + taxes ÷ <output id="result-units">0</output> units.</p></article>
            <article class="value-duty-key"><span>LANDED COST PER UNIT</span><strong><output id="landed-cost-per-unit">£0.00</output></strong><p>Planning total ÷ units. <output id="landed-cost-per-unit-ex-vat">£0.00</output> a unit without import VAT, for a VAT-registered importer who reclaims it.</p></article>
          </div>
          <aside class="result-checkpoint"><span>CHECKPOINT</span><div><h3>Before this number leaves the worksheet.</h3><p>Confirm the valuation method, exchange rate, inclusions, deductions, commodity code, origin, preference or relief, duty measures, VAT treatment, and declaration date. This duty result applies an ad valorem percentage only; it does not calculate a specific or compound tariff.</p></div></aside>
          <div class="calculator-actions value-duty-actions"><div><span class="section-label">TAKE IT TO THE REVIEW</span><p>The share link includes the visible inputs. Print produces a clean input, formula and result record.</p></div><button class="secondary-button" id="share-value-duty" type="button" data-label="SHARE THIS SCENARIO">SHARE THIS SCENARIO</button><button class="secondary-button" id="print-value-duty" type="button">PRINT / SAVE</button></div>
        </section>
        <p class="visually-hidden" id="value-duty-status" aria-live="polite"></p>
          </div>

        <aside class="calculator-answer value-duty-answer tool-first-answer" aria-labelledby="value-duty-direct-answer">
          <span class="section-label">DIRECT ANSWER</span>
          <div>
            <h2 id="value-duty-direct-answer">How do customs value, duty and import VAT connect?</h2>
            <p>For a transaction-value planning scenario, start with the converted goods price, then add or deduct the amounts you have established for customs value. Apply the ad valorem percentage you have checked. Build the import VAT value by adding duty, other import charges and relevant incidental expenses.</p>
            <div class="equation-stack"><code>CONVERTED GOODS = GOODS AMOUNT ÷ CURRENCY UNITS PER £1</code><code>CUSTOMS VALUE = CONVERTED GOODS + FREIGHT + INSURANCE + ADDITIONS − DEDUCTIONS</code><code>AD VALOREM DUTY = CUSTOMS VALUE × YOUR DUTY RATE</code><code>IMPORT VAT = IMPORT VAT VALUE × YOUR VAT RATE</code></div>
            <p class="tool-first-answer-link">Need the duty rate first? <a href="/tools/commodity-code-checker/">Find it with the free commodity code checker</a>.</p>
          </div>
        </aside>
        </div>

        <section class="tool-first-about value-duty-about" aria-label="About this workpaper">
          <div class="tool-first-about-copy">
            <p>${escapeHtml(workpaper.standfirst)}</p>
            <div class="value-duty-hero-actions"><a class="button" href="#valuation-workpaper">BUILD MY SCENARIO</a><a href="#official-checkpoints">CHECK THE INPUT SOURCES →</a></div>
            <div class="calculator-trust"><strong>10 EXPLICIT INPUTS</strong><strong>6 DECISION OUTPUTS</strong><strong>PRINT OR SHARE</strong></div>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${escapeHtml(workpaper.ref)}</span>
            <div class="stamp">BUILD<br />THEN CHECK</div>
            <div class="review-cell"><span>EDITION</span><strong>${workpaper.reviewedOn}</strong></div>
          </aside>
        </section>

        <section class="official-checkpoints" id="official-checkpoints" aria-labelledby="checkpoint-heading">
          <header><span class="section-label">BEFORE YOU TYPE</span><h2 id="checkpoint-heading">Bring the method and rates. The workpaper brings the cross-foot.</h2></header>
          <div>
            <a href="https://www.gov.uk/guidance/customs-valuation/method-1-transaction-value"><span>01 · VALUE</span><strong>Check the valuation method, sale, additions and deductions.</strong><b>HMRC GUIDANCE →</b></a>
            <a href="https://www.gov.uk/guidance/customs-valuation/exchange-rates"><span>02 · FX</span><strong>Check the exchange rate applicable to the valuation.</strong><b>HMRC GUIDANCE →</b></a>
            <a href="https://www.gov.uk/trade-tariff"><span>03 · RATES</span><strong>Check the commodity code, measures, duty and VAT rates.</strong><b>UK TRADE TARIFF →</b></a>
          </div>
        </section>

        <section class="official-checkpoints value-duty-incoterms" aria-labelledby="incoterms-bridge-heading">
          <header><span class="section-label">TRADE TERM FIRST</span><h2 id="incoterms-bridge-heading">Know which costs the price already includes.</h2><p>The Incoterm on the invoice tells you who paid for carriage and insurance and where risk moved. Open the matching sheet to see which freight and insurance amounts belong in fields 03 and 04.</p></header>
          <div>
            <a href="/customs-reference/incoterms/fob/"><span>FOB · FREE ON BOARD</span><strong>Buyer pays main carriage, so freight and insurance to the UK border are usually added.</strong><b>OPEN THE FOB SHEET →</b></a>
            <a href="/customs-reference/incoterms/cif/"><span>CIF · COST, INSURANCE AND FREIGHT</span><strong>Seller-paid freight and insurance may already be in the invoice price. Do not add them twice.</strong><b>OPEN THE CIF SHEET →</b></a>
            <a href="/customs-reference/incoterms/fca/"><span>FCA · FREE CARRIER</span><strong>Find the named-place carrier handoff, then add buyer-paid transport to the border.</strong><b>OPEN THE FCA SHEET →</b></a>
            <a href="/customs-reference/incoterms/dap/"><span>DAP · DELIVERED AT PLACE</span><strong>Split delivery cost before and after the UK border to find the border value.</strong><b>OPEN THE DAP SHEET →</b></a>
            <a href="/customs-reference/incoterms/ddp/"><span>DDP · DELIVERED DUTY PAID</span><strong>Unpack duty, import VAT and post-border costs from the delivered price.</strong><b>OPEN THE DDP SHEET →</b></a>
            <a href="/customs-reference/incoterms/exw/"><span>EXW · EX WORKS</span><strong>Buyer collects at the seller’s premises, so all transport and insurance to the UK border are added.</strong><b>OPEN THE EXW SHEET →</b></a>
            <a href="/customs-reference/incoterms/fas/"><span>FAS · FREE ALONGSIDE SHIP</span><strong>Buyer pays loading and main carriage from the port, so add them up to the UK border.</strong><b>OPEN THE FAS SHEET →</b></a>
            <a href="/customs-reference/incoterms/cfr/"><span>CFR · COST AND FREIGHT</span><strong>Seller-paid freight may already be in the price; add buyer-paid insurance to the border.</strong><b>OPEN THE CFR SHEET →</b></a>
            <a href="/customs-reference/incoterms/cpt/"><span>CPT · CARRIAGE PAID TO</span><strong>Seller pays carriage to the named place; split it before and after the UK border.</strong><b>OPEN THE CPT SHEET →</b></a>
            <a href="/customs-reference/incoterms/cip/"><span>CIP · CARRIAGE AND INSURANCE PAID TO</span><strong>Seller pays carriage and insurance; split both at the UK border and do not add them twice.</strong><b>OPEN THE CIP SHEET →</b></a>
            <a href="/customs-reference/incoterms/dpu/"><span>DPU · DELIVERED AT PLACE UNLOADED</span><strong>Split delivery and unloading cost before and after the UK border to find the border value.</strong><b>OPEN THE DPU SHEET →</b></a>
            <a href="/customs-reference/incoterms/"><span>NOT SURE WHICH TERM?</span><strong>Answer four questions in the Incoterms chooser to find the closest sheet.</strong><b>OPEN THE CHOOSER →</b></a>
          </div>
        </section>


        <section class="formula-register value-duty-formulas" aria-labelledby="value-duty-formulas-heading"><header><span class="section-label">FORMULA CONTRACT</span><h2 id="value-duty-formulas-heading">Every step is inspectable.</h2><p>The arithmetic is deterministic and runs in this browser. Change one input and rebuild the scenario; no hidden rate or tariff table changes the result.</p></header><div><p><b>CONVERTED GOODS</b><code>GOODS AMOUNT ÷ INVOICE-CURRENCY UNITS PER £1</code></p><p><b>CUSTOMS VALUE</b><code>CONVERTED GOODS + FREIGHT + INSURANCE + ADDITIONS − DEDUCTIONS</code></p><p><b>AD VALOREM DUTY</b><code>CUSTOMS VALUE × YOUR PERCENTAGE DUTY RATE ÷ 100</code></p><p><b>IMPORT VAT VALUE</b><code>CUSTOMS VALUE + DUTY + OTHER IMPORT CHARGES + INCIDENTAL EXPENSES</code></p><p><b>IMPORT VAT</b><code>IMPORT VAT VALUE × YOUR VAT RATE ÷ 100</code></p><p><b>DUTIES + TAXES</b><code>DUTY + OTHER IMPORT CHARGES + IMPORT VAT</code></p><p><b>DUTY + VAT PER UNIT</b><code>DUTIES + TAXES ÷ UNITS</code></p><p><b>LANDED COST PER UNIT</b><code>PLANNING TOTAL ÷ UNITS</code></p></div></section>

        <section class="duty-guide" id="import-duty-calculator-uk" aria-labelledby="duty-guide-heading">
          <header><span class="section-label">IMPORT DUTY CALCULATOR UK</span><h2 id="duty-guide-heading">How is UK import duty calculated?</h2><p>UK import duty on a percentage-rate commodity is the customs value in pounds multiplied by the tariff rate. The customs value is usually the goods price plus freight and insurance to the UK border (often called CIF value). Import VAT is then charged on the customs value plus the duty, other import charges and incidental expenses. The calculator above runs both steps with your own rates and shows every line.</p></header>
          <ol class="duty-steps">
            <li><b>01</b><div><strong>Find the duty rate.</strong><p>Find the commodity code with the <a href="/tools/commodity-code-checker/">free commodity code checker</a>, then note the duty rate for the origin in the <a href="https://www.gov.uk/trade-tariff">UK Trade Tariff</a>, plus any preference you can prove.</p></div></li>
            <li><b>02</b><div><strong>Convert the invoice to pounds.</strong><p>Use the HMRC exchange rate for the period. Enter it as currency units per £1, the way HMRC publishes it.</p></div></li>
            <li><b>03</b><div><strong>Build the customs value.</strong><p>Add freight and insurance to the UK border and any required additions, such as royalties or assists. Take off permitted deductions.</p></div></li>
            <li><b>04</b><div><strong>Apply duty, then VAT.</strong><p>Duty is the customs value × rate. VAT is the VAT value × VAT rate, where the VAT value includes the duty.</p></div></li>
          </ol>
          <div class="duty-examples">${renderWorkedExamples()}</div>
          <p class="duty-guide-note">The rates in these examples show how the arithmetic works. Take the rate for your own goods from the UK Trade Tariff. Need the invoice first? <a href="/tools/commercial-invoice-generator/">Build a commercial invoice with the free generator</a>.</p>
        </section>

        ${renderDutyTopics()}

        <section class="related-workpapers" aria-labelledby="related-workpapers-heading"><header><span class="section-label">KEEP WORKING</span><h2 id="related-workpapers-heading">Take the number into the operation.</h2><p>Use the Declarix research and free workbench to test desk economics, map the document handoff, and prepare for the customs intermediary registration next steps.</p></header><nav aria-label="Related free Declarix resources"><a href="/research/uk-customs-operations-signal-report-2026/"><span>ORIGINAL RESEARCH</span><strong>UK customs operations signals</strong><b>READ THE REPORT →</b></a><a href="/tools/customs-declaration-cost-calculator/"><span>FREE CALCULATOR</span><strong>Customs desk economics</strong><b>RUN THE COST MODEL →</b></a><a href="/tools/customs-document-pack-check/"><span>FREE WORKPAPER</span><strong>Customs document pack check</strong><b>MAP THE HANDOFF →</b></a><a href="/tools/commercial-invoice-generator/"><span>FREE GENERATOR</span><strong>Commercial invoice template and generator</strong><b>BUILD THE INVOICE →</b></a><a href="/customs-intermediary-registration-2026/"><span>FREE RESPONSE KIT</span><strong>Customs intermediary registration 2026</strong><b>OPEN THE KIT →</b></a></nav></section>

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

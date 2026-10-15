import { claimDeadline, ukDate } from '../c285.mjs'
import { link, source } from '../page-kit.mjs'

const c285ExampleDeadline = ukDate(claimDeadline('overpaid', '2025-02-03'))

function widget() {
  const radios = (name, legend, options) => `<fieldset><legend>${legend}</legend>${options
    .map(([value, label], index) => `<label><input type="radio" name="${name}" value="${value}"${index === 0 ? ' checked' : ''} /> ${label}</label>`)
    .join('')}</fieldset>`
  return `<section class="tt-panel" aria-labelledby="tt-form-heading">
    <header><span class="section-label">SIX QUESTIONS</span><h2 id="tt-form-heading">Tell us about the overpayment.</h2><p>Your answers stay in this page. Nothing is sent or stored.</p></header>
    <form id="tt-form" class="tt-form tt-grid-form" novalidate>
      ${radios('reason', '1 · Why are you claiming?', [['overpaid', 'Duty or VAT was overpaid (wrong code, value, origin or preference)'], ['rejected', 'The goods were rejected (faulty, damaged or not as ordered)'], ['withdrawn', 'The import declaration was withdrawn'], ['waiver', 'Customs Duty Waiver Scheme correction'], ['ni_at_risk', '“At risk” goods moved into Northern Ireland']])}
      ${radios('postal', '2 · Did Royal Mail or Parcelforce deliver the goods?', [['no', 'No'], ['yes', 'Yes']])}
      ${radios('who', '3 · Who is claiming?', [['importer', 'The importer or their representative'], ['agent', 'A customs agent, freight forwarder or express operator'], ['individual', 'A private individual, goods for personal use']])}
      ${radios('eori', '4 · Do you have an EORI number?', [['yes', 'Yes'], ['no', 'No']])}
      ${radios('system', '5 · Where was the import declaration made?', [['cds', 'Customs Declaration Service (CDS)'], ['chief', 'CHIEF (older declarations)']])}
      ${radios('taxes', '6 · What do you want back?', [['both', 'Import duty and import VAT'], ['duty', 'Import duty only'], ['vat', 'Import VAT only']])}
      ${radios('vatRegistered', 'Is the importer VAT-registered?', [['yes', 'Yes'], ['no', 'No']])}
      <label for="c285-date"><span>DATE THE DECLARATION WAS ACCEPTED</span><small>Used to count the time limit</small><input id="c285-date" name="acceptedOn" type="date" /></label>
      <div class="tt-actions"><button class="button" type="submit">SHOW MY ROUTE</button><button class="tt-secondary" type="button" data-tt-example>TRY THE WORKED EXAMPLE</button></div>
    </form>
  </section>`
}

function content() {
  return `<section class="tt-example" aria-labelledby="tt-example-heading">
      <header><span class="section-label">WORKED EXAMPLE</span><h2 id="tt-example-heading">A missed preference on cotton T-shirts.</h2><p>A VAT-registered importer with an EORI brought in cotton T-shirts from Israel through CDS on 3 February 2025. The agent declared the 12% third-country duty instead of the 0% preference, so £1,200 of duty was overpaid on £10,000 of goods, and £240 of import VAT was paid on that extra duty.</p></header>
      <div class="tt-table-wrap"><table><caption>Route for the worked example</caption><thead><tr><th scope="col">Item</th><th scope="col">Route</th><th scope="col">Why</th></tr></thead><tbody>
        <tr><th scope="row">£1,200 import duty</th><td>Claim in the Customs Declaration Service</td><td>The importer has an EORI and the declaration was made in CDS</td></tr>
        <tr><th scope="row">£240 import VAT</th><td>VAT Return: reduce output tax in Box 1</td><td>VAT-registered importers cannot use C285 or the online services for overpaid import VAT</td></tr>
        <tr><th scope="row">Time limit</th><td>${c285ExampleDeadline}</td><td>3 years for overpayments, counted from the acceptance date</td></tr>
        <tr><th scope="row">Evidence</th><td>MRN, EORI, UK bank details, commercial invoice, the duty that should have been paid, the proof of origin</td><td>The CDS claim asks for these; the proof of origin supports the preference</td></tr>
      </tbody></table></div>
      <p class="tt-note">Check the duty that should have applied with the ${link('/tools/commodity-code-checker/', 'commodity code checker')}, and confirm the MRN with the <a href="/tools/mrn-checker/">MRN checker</a> before you submit.</p>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-routes-heading">
      <header><span class="section-label">THE ROUTES</span><h2 id="tt-routes-heading">Five ways back, one right one.</h2></header>
      <div class="tt-table-wrap"><table><caption>Import duty and VAT repayment routes</caption><thead><tr><th scope="col">Route</th><th scope="col">Use it when</th></tr></thead><tbody>
        <tr><th scope="row">CDS online claim</th><td>You have an EORI and the declaration was made in the Customs Declaration Service. Track the claim on the claims dashboard.</td></tr>
        <tr><th scope="row">Online C285 form</th><td>No EORI registered to you, a private individual, import VAT without VAT registration or an EORI, the Customs Duty Waiver Scheme.</td></tr>
        <tr><th scope="row">VAT Return</th><td>Overpaid import VAT and you are VAT-registered: reduce output tax in Box 1 and keep the records.</td></tr>
        <tr><th scope="row">CHIEF route</th><td>The declaration was made in CHIEF and you have an EORI.</td></tr>
        <tr><th scope="row">BOR286</th><td>Goods delivered by Royal Mail or Parcelforce.</td></tr>
      </tbody></table></div>
      <p class="tt-note">Time limits on GOV.UK: 3 years for overpayments, 1 year for rejected imports, 90 days for the withdrawal of an import declaration. HMRC aims to decide within 30 days and pays only to a UK bank account.</p>
    </section>`
}

export default {
  pageFile: 'c285.mjs',
  id: 'import_duty_repayment_checker',
  path: '/tools/import-duty-repayment-checker/',
  shortName: 'C285 repayment checker',
  ref: 'PUBLIC TOOL 09 · C285',
  title: 'C285 repayment checker | Reclaim overpaid import duty',
  schemaName: 'Free import duty repayment (C285) checker',
  description:
    'Six questions show how to reclaim overpaid import duty and VAT (C285, CDS claim or VAT Return), your deadline and the evidence to gather.',
  eyebrow: 'FREE C285 CHECKER · ROUTE · DEADLINE · EVIDENCE',
  h1: 'Find the right route to reclaim overpaid import duty.',
  standfirst:
    'Six questions tell you whether to claim in the Customs Declaration Service, on the online C285 form, through your VAT Return or with BOR286, when the time limit ends, and which documents to have ready before you start.',
  strip: ['SIX QUESTIONS', 'DEADLINE CALCULATED', 'EVIDENCE CHECKLIST'],
  stamp: 'CLAIM\nROUTED',
  featureList: [
    'Routes the claim to CDS, the online C285 form, the VAT Return, CHIEF or BOR286',
    'Calculates the 3-year, 1-year or 90-day time limit from the acceptance date',
    'Builds the evidence checklist for overpayment and rejected-import claims',
    'Copies or prints the result for the claim file',
  ],
  answer: {
    question: 'What is a C285?',
    text: 'C285 is HMRC’s online form for claiming back import duty and import VAT that were overpaid. Since CDS, most importers and agents with an EORI claim in the Customs Declaration Service instead, VAT-registered importers adjust overpaid import VAT on their VAT Return, and C285 is used when there is no EORI, by private individuals and for the Customs Duty Waiver Scheme.',
  },
  steps: [
    ['01', 'Answer six questions', 'Why you are claiming, how the goods arrived, who you are, whether you have an EORI, which taxes and the date the declaration was accepted.'],
    ['02', 'Get the route', 'The checker applies the GOV.UK rules and names the route for the duty and, separately, for the import VAT.'],
    ['03', 'See the deadline', 'It counts the time limit from the acceptance date: 3 years for overpayments, 1 year for rejected imports, 90 days for a withdrawn declaration.'],
    ['04', 'Gather the evidence', 'Copy the checklist into the claim file, check the MRN with the free MRN checker, and submit with a UK bank account ready.'],
  ],
  faqs: [
    ['How long do I have to claim back overpaid import duty?', 'GOV.UK sets 3 years for overpayments, 1 year for rejected imports and 90 days for the withdrawal of an import declaration.'],
    ['Can a VAT-registered business reclaim import VAT on a C285?', 'No, a VAT-registered business adjusts overpaid import VAT on its VAT Return by reducing the output tax in Box 1.'],
    ['Who can make the claim?', 'The importer or their representative, a customs agent, a freight forwarder or express operator acting for the importer, or a private individual importing for personal use.'],
    ['How long does HMRC take to decide?', 'HMRC aims to decide a claim within 30 days and may ask for more information.'],
    ['Can the repayment go to a non-UK bank account?', 'No, repayments of import duty and VAT are only made to a UK bank account.'],
    ['What if the goods came by Royal Mail or Parcelforce?', 'Use form BOR286 to report incorrect duty or VAT on items imported by post.'],
  ],
  sources: [
    source('How to claim a repayment of import duty and VAT if you’ve overpaid', 'HM Revenue & Customs · GOV.UK · updated 1 September 2026', 'https://www.gov.uk/guidance/how-to-claim-a-repayment-of-import-duty-and-vat-if-youve-overpaid'),
    source('Apply for repayment of import duty and VAT (CHIEF)', 'HM Revenue & Customs · GOV.UK · updated 10 September 2025', 'https://www.gov.uk/guidance/apply-for-repayment-of-import-duty-and-vat-chief'),
    source('Report incorrect Customs Duty or VAT on items imported by post (BOR286)', 'HM Revenue & Customs · GOV.UK · updated 20 February 2026', 'https://www.gov.uk/government/publications/report-incorrect-customs-duty-or-vat-on-items-imported-by-post-bor286'),
    source('Apply to claim a repayment or remission of import duty on ‘at risk’ goods brought into Northern Ireland', 'HM Revenue & Customs · GOV.UK · updated 6 July 2026', 'https://www.gov.uk/guidance/apply-to-claim-a-repayment-or-remission-of-import-duty-on-at-risk-goods-brought-into-northern-ireland'),
    source('Complete your VAT Return to account for import VAT', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/complete-your-vat-return-to-account-for-import-vat'),
  ],
  related: ['/tools/mrn-checker/', '/tools/customs-value-import-duty-vat-calculator/', '/tools/commodity-code-checker/'],
  widget,
  content,
  modules: ['c285'],
  behaviour: `
      const render = () => {
        const data = Object.fromEntries(new FormData(form).entries());
        const outcome = repaymentRoute(data);
        const statusLabel = { expired: 'TIME LIMIT PASSED', urgent: 'CLAIM NOW', route: 'YOUR ROUTE' }[outcome.status];
        let html = '<header class="tt-verdict ' + (outcome.status === 'expired' ? 'is-fail' : 'is-pass') + '"><span>' + statusLabel + '</span><h2>' + esc(outcome.routes.map((route) => route.title).join(' + ')) + '</h2>' + outcome.notes.map((note) => '<p>' + esc(note) + '</p>').join('') + '</header>';
        html += '<ol class="tt-cards">' + outcome.routes.map((route) => '<li><strong>' + esc(route.title) + '</strong><span>' + esc(route.detail) + '</span></li>').join('') + '</ol>';
        if (outcome.checklist.length) html += '<h3 class="tt-subhead">Have these ready</h3><ul class="tt-checklist">' + outcome.checklist.map((item) => '<li>' + esc(item) + '</li>').join('') + '</ul>';
        html += '<p class="tt-note">Check the MRN with the <a href="/tools/mrn-checker/">MRN checker</a> before you start the claim.</p>';
        lastCopy = ['IMPORT DUTY AND VAT REPAYMENT ROUTE', '', ...outcome.routes.map((route) => '- ' + route.title + ': ' + route.detail), '', ...outcome.notes, '', 'Have ready:', ...outcome.checklist.map((item) => '- ' + item), '', 'Checker: ' + location.origin + location.pathname].join('\\n');
        showResult(html, { reason: data.reason, route: outcome.routes.map((route) => route.id).join('+'), deadline_status: outcome.status });
      };
      form.addEventListener('submit', (event) => { event.preventDefault(); render(); });
      exampleButton?.addEventListener('click', () => {
        const set = (name, value) => { const field = form.querySelector('[name="' + name + '"][value="' + value + '"]'); if (field) field.checked = true; };
        set('reason', 'overpaid'); set('postal', 'no'); set('who', 'importer'); set('eori', 'yes'); set('system', 'cds'); set('taxes', 'both'); set('vatRegistered', 'yes');
        form.querySelector('[name="acceptedOn"]').value = '2025-02-03';
        track('tool_example_loaded');
        render();
      });
  `,
}

import { MRN_PROCEDURES, decodeMrn, mrnCharValue } from '../mrn.mjs'
import { CHECKED, escapeHtml, link, source } from '../page-kit.mjs'

const MRN_EXAMPLE = '21GB1NEXFX6SU9C4R1'
const mrnExample = decodeMrn(MRN_EXAMPLE, { now: new Date('2026-10-15T00:00:00Z') })
const mrnExampleMaths = MRN_EXAMPLE.slice(0, 17).split('').map((char, index) => ({
  char,
  value: mrnCharValue(char),
  weight: 2 ** index,
  product: mrnCharValue(char) * 2 ** index,
}))
const mrnExampleTotal = mrnExampleMaths.reduce((sum, row) => sum + row.product, 0)

function widget() {
  return `<section class="tt-panel" aria-labelledby="tt-form-heading">
    <header><span class="section-label">CHECK ONE OR MANY</span><h2 id="tt-form-heading">Paste MRNs. See every part.</h2><p>One MRN per line, up to 200. Spaces, dashes and lower case are fine. Nothing leaves your browser.</p></header>
    <form id="tt-form" class="tt-form" novalidate>
      <label for="mrn-input"><span>MOVEMENT REFERENCE NUMBER(S)</span><small>18 characters, for example ${MRN_EXAMPLE}</small></label>
      <textarea id="mrn-input" name="mrn" rows="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="${MRN_EXAMPLE}"></textarea>
      <div class="tt-actions"><button class="button" type="submit">CHECK MRN</button><button class="tt-secondary" type="button" data-tt-example>TRY THE WORKED EXAMPLE</button></div>
    </form>
  </section>`
}

function content() {
  const parts = mrnExample.parts
  const procedures = Object.entries(MRN_PROCEDURES)
    .map(([code, info]) => `<tr><th scope="row">${code}</th><td>${escapeHtml(info.label)}</td></tr>`)
    .join('')
  const maths = mrnExampleMaths
    .map((row, index) => `<tr><td>${index + 1}</td><td>${row.char}</td><td>${row.value}</td><td>${row.weight.toLocaleString('en-GB')}</td><td>${row.product.toLocaleString('en-GB')}</td></tr>`)
    .join('')
  return `<section class="tt-example" aria-labelledby="tt-example-heading">
      <header><span class="section-label">WORKED EXAMPLE</span><h2 id="tt-example-heading">${MRN_EXAMPLE}, decoded.</h2><p>This MRN appears in HMRC’s published API examples. Here is what each part means and how the check digit comes out.</p></header>
      <div class="tt-table-wrap"><table><caption>The five parts of ${MRN_EXAMPLE}</caption><thead><tr><th scope="col">Characters</th><th scope="col">Value</th><th scope="col">Meaning</th></tr></thead><tbody>
        <tr><th scope="row">1–2 · Year</th><td>${parts.year}</td><td>Accepted in ${parts.yearFull}</td></tr>
        <tr><th scope="row">3–4 · Country</th><td>${parts.country}</td><td>${escapeHtml(parts.countryName)}</td></tr>
        <tr><th scope="row">5–16 · Unique reference</th><td>${parts.unique}</td><td>Unique for that year and country; administrations may use up to the first 6 characters for the customs office</td></tr>
        <tr><th scope="row">17 · Procedure letter</th><td>${parts.procedure}</td><td>${escapeHtml(parts.procedureLabel)}</td></tr>
        <tr><th scope="row">18 · Check digit</th><td>${parts.checkDigit}</td><td>Matches the calculation below</td></tr>
      </tbody></table></div>
      <details class="tt-maths"><summary>Show the check digit calculation</summary>
        <div class="tt-table-wrap"><table><caption>ISO 6346 check digit for ${MRN_EXAMPLE}</caption><thead><tr><th scope="col">Position</th><th scope="col">Character</th><th scope="col">Value</th><th scope="col">× 2^(position − 1)</th><th scope="col">Product</th></tr></thead><tbody>${maths}</tbody></table></div>
        <p>Total ${mrnExampleTotal.toLocaleString('en-GB')}. ${mrnExampleTotal.toLocaleString('en-GB')} ÷ 11 leaves a remainder of ${mrnExampleTotal % 11}, so the check digit is ${parts.expectedCheckDigit}. A remainder of 10 is written as 0.</p>
      </details>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-procedures-heading">
      <header><span class="section-label">REFERENCE</span><h2 id="tt-procedures-heading">The 17 procedure letters.</h2><p>Character 17 tells you what kind of message the MRN belongs to. The letters come from Annex B of the EU implementing regulation, the same structure HMRC uses for GB and XI MRNs.</p></header>
      <div class="tt-table-wrap"><table><caption>MRN procedure identifier letters</caption><thead><tr><th scope="col">Letter</th><th scope="col">Procedure</th></tr></thead><tbody>${procedures}</tbody></table></div>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-where-heading">
      <header><span class="section-label">WHERE THE MRN GOES NEXT</span><h2 id="tt-where-heading">One reference, four desk jobs.</h2></header>
      <ul class="tt-cards">
        <li><strong>GVMS crossing</strong><span>Import MRNs, transit MRNs and safety and security MRNs go into the GMR for the vehicle. ${link('/tools/gmr-checker/', 'Plan the GMR references')}.</span></li>
        <li><strong>Postponed VAT</strong><span>Each import MRN appears on the monthly postponed import VAT statement. ${link('/tools/postponed-vat-statement-checker/', 'Reconcile the statement')}.</span></li>
        <li><strong>Repayment claim</strong><span>Every CDS and C285 claim asks for the MRN of the import declaration. ${link('/tools/import-duty-repayment-checker/', 'Find the claim route')}.</span></li>
        <li><strong>EU movements</strong><span>For MRNs issued in the EU, the European Commission runs a public MRN follow-up page, listed in the sources below.</span></li>
      </ul>
    </section>`
}

export default {
  pageFile: 'mrn.mjs',
  id: 'mrn_checker',
  path: '/tools/mrn-checker/',
  shortName: 'MRN checker',
  ref: 'PUBLIC TOOL 06 · MRN',
  title: 'MRN checker | Decode and validate a customs MRN free',
  schemaName: 'Free MRN checker and decoder',
  description:
    'Free MRN checker: paste one or many Movement Reference Numbers to see the year, country, procedure letter and check digit, and catch typos in seconds.',
  eyebrow: 'FREE MRN CHECKER · CHECK DIGIT · BATCH PASTE',
  h1: 'Check an MRN before it reaches CDS or GVMS.',
  standfirst:
    'Paste one Movement Reference Number or a whole column of them. The checker splits each MRN into its five parts, explains the procedure letter and recalculates the check digit, so a mistyped character shows up before it reaches a GMR, a repayment claim or a VAT reconciliation.',
  strip: ['18 CHARACTERS DECODED', 'CHECK DIGIT RECALCULATED', 'RUNS IN YOUR BROWSER'],
  stamp: 'MRN\nDECODED',
  featureList: [
    'Splits an MRN into year, country, unique reference, procedure letter and check digit',
    'Recalculates the ISO 6346 check digit and suggests the corrected MRN',
    'Checks up to 200 MRNs pasted from a spreadsheet in one go',
    'Explains all 17 procedure letters and where each MRN is used',
  ],
  answer: {
    question: 'What is an MRN?',
    text: 'A Movement Reference Number (MRN) is the 18-character reference a customs system gives a declaration when it accepts it: two digits for the year, a two-letter country code, a 12-character unique reference, one procedure letter and one check digit. In the UK, CDS issues MRNs for import and export declarations and NCTS issues them for transit.',
  },
  steps: [
    ['01', 'Paste the MRN', 'Paste one MRN, or a column of MRNs from a spreadsheet or a statement. Spaces, dashes and lower case are cleaned up for you.'],
    ['02', 'Read the five parts', 'The checker shows the year of acceptance, the country, the unique reference, the procedure letter and the check digit, with a plain-English meaning for each.'],
    ['03', 'Fix the typo', 'If the check digit does not match, the checker shows the digit the first 17 characters produce, so you can find the mistyped character fast.'],
    ['04', 'Use it in the next job', 'Copy the clean MRN into the GMR, the repayment claim or the VAT reconciliation, then check the rest of the pack with the free pack check.'],
  ],
  faqs: [
    ['How many characters does an MRN have?', 'An MRN always has 18 characters: 2 year digits, 2 country letters, 12 unique characters, 1 procedure letter and 1 check digit.'],
    ['What does the letter near the end of an MRN mean?', 'Character 17 is the procedure letter, for example R for an import declaration only, A for export only and J for a transit declaration only.'],
    ['How is the MRN check digit calculated?', 'Each of the first 17 characters gets a value (digits keep their value, letters run from A=10 and skip 11, 22 and 33), each value is multiplied by 2 to the power of its position, and the total modulo 11 is the check digit, with 10 written as 0.'],
    ['Does a correct check digit mean the declaration exists?', 'A correct check digit proves the MRN was copied without a capture error; the declaration itself is confirmed in CDS, NCTS or the system that issued it.'],
    ['What is the difference between an MRN and a GMR?', 'An MRN identifies one declaration, while a GMR (goods movement reference) groups all the declaration references for one vehicle crossing through GVMS.'],
    ['Where do I find the MRN for an import?', 'The MRN appears on the declaration acceptance message from CDS, on your agent’s clearance notice and on your monthly postponed import VAT statement.'],
  ],
  sources: [
    source('Commission Implementing Regulation (EU) 2024/250, Annex B: MRN structure and procedure identifiers', 'European Union · EUR-Lex', 'https://eur-lex.europa.eu/eli/reg_impl/2024/250/oj'),
    source('CTC Traders technical interface: rule R0028 (MRN check digit follows ISO 6346)', 'HM Revenue & Customs · Developer Hub', 'https://developer.service.hmrc.gov.uk/guides/ctc-traders-tis/documentation/phase-6-rules/R0028.html'),
    source('Create a goods movement reference', 'HM Revenue & Customs · GOV.UK · updated 9 June 2026', 'https://www.gov.uk/guidance/create-a-goods-movement-reference'),
    source('How to claim a repayment of import duty and VAT if you’ve overpaid', 'HM Revenue & Customs · GOV.UK · updated 1 September 2026', 'https://www.gov.uk/guidance/how-to-claim-a-repayment-of-import-duty-and-vat-if-youve-overpaid'),
    source('MRN follow-up', 'European Commission · Taxation and Customs Union', 'https://ec.europa.eu/taxation_customs/dds2/mrn/mrn_home.jsp?Lang=en'),
  ],
  related: ['/tools/gmr-checker/', '/tools/postponed-vat-statement-checker/', '/tools/import-duty-repayment-checker/'],
  widget,
  content,
  modules: ['mrn'],
  behaviour: `
      const input = document.getElementById('mrn-input');
      const render = () => {
        const lines = input.value.split(/\\r?\\n/).map((line) => line.trim()).filter(Boolean).slice(0, 200);
        if (!lines.length) { input.setCustomValidity('Paste at least one MRN.'); input.reportValidity(); return; }
        input.setCustomValidity('');
        const results = lines.map((line) => decodeMrn(line));
        const validCount = results.filter((item) => item.valid).length;
        let html;
        if (results.length === 1) {
          const item = results[0];
          const p = item.parts;
          html = '<header class="tt-verdict ' + (item.valid ? 'is-pass' : 'is-fail') + '"><span>' + (item.valid ? 'CHECK DIGIT MATCHES' : 'CHECK THIS MRN') + '</span><h2>' + esc(item.normalised || item.input) + '</h2><p>' + (item.valid ? 'All 18 characters are well formed and the check digit matches.' : esc(item.errors.join(' '))) + '</p></header>';
          if (item.suggestion) html += '<p class="tt-note">If the first 17 characters are right, the MRN reads <strong>' + esc(item.suggestion) + '</strong>.</p>';
          if (p) {
            html += '<div class="tt-table-wrap"><table><caption>MRN parts</caption><tbody>' +
              '<tr><th scope="row">Year (1–2)</th><td>' + esc(p.year) + '</td><td>Accepted in ' + p.yearFull + '</td></tr>' +
              '<tr><th scope="row">Country (3–4)</th><td>' + esc(p.country) + '</td><td>' + esc(p.countryName || 'Country code ' + p.country) + '</td></tr>' +
              '<tr><th scope="row">Unique reference (5–16)</th><td>' + esc(p.unique) + '</td><td>Unique for the year and country</td></tr>' +
              '<tr><th scope="row">Procedure (17)</th><td>' + esc(p.procedure) + '</td><td>' + esc(p.procedureLabel || 'Not a recognised procedure letter') + '</td></tr>' +
              '<tr><th scope="row">Check digit (18)</th><td>' + esc(p.checkDigit) + '</td><td>Expected ' + esc(p.expectedCheckDigit ?? '–') + '</td></tr>' +
              '</tbody></table></div>';
            if (p.tracking) html += '<p class="tt-note"><strong>Where it is used.</strong> ' + esc(p.tracking) + '</p>';
            (item.warnings || []).forEach((warning) => { html += '<p class="tt-note">' + esc(warning) + '</p>'; });
          }
        } else {
          html = '<header class="tt-verdict ' + (validCount === results.length ? 'is-pass' : 'is-fail') + '"><span>BATCH RESULT</span><h2>' + validCount + ' of ' + results.length + ' MRNs pass.</h2><p>' + (results.length - validCount) + ' need a second look.</p></header>' +
            '<div class="tt-table-wrap"><table><caption>Batch MRN check</caption><thead><tr><th scope="col">MRN</th><th scope="col">Result</th><th scope="col">Procedure</th></tr></thead><tbody>' +
            results.map((item) => '<tr class="' + (item.valid ? 'is-pass' : 'is-fail') + '"><th scope="row">' + esc(item.normalised || item.input) + '</th><td>' + (item.valid ? 'Passes' : esc(item.errors[0]) + (item.suggestion ? ' Try ' + esc(item.suggestion) + '.' : '')) + '</td><td>' + esc(item.parts?.procedureLabel || '–') + '</td></tr>').join('') +
            '</tbody></table></div>';
        }
        showResult(html, { checked_count: results.length, pass_count: validCount });
      };
      form.addEventListener('submit', (event) => { event.preventDefault(); render(); });
      exampleButton?.addEventListener('click', () => { input.value = '${MRN_EXAMPLE}\\n21GB1NEXFX6SU9C4R2\\n20GBDPQ8A31WX1XXR5'; track('tool_example_loaded'); render(); });
  `,
}

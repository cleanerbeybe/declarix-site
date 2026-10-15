import { readFileSync } from 'node:fs'
import { extractRecords, reconcilePva } from '../pva.mjs'
import { gbp, source } from '../page-kit.mjs'

const pvaExampleStatement = readFileSync(new URL('../../../public/downloads/postponed-vat-statement-example.csv', import.meta.url), 'utf8')
const pvaExampleList = readFileSync(new URL('../../../public/downloads/import-list-example.csv', import.meta.url), 'utf8')
export const pvaExample = reconcilePva(extractRecords(pvaExampleStatement).records, extractRecords(pvaExampleList).records)

function widget() {
  const side = (id, title, hint, example) => `<div class="tt-drop" data-side="${id}">
      <span class="section-label">${title}</span>
      <label for="${id}-file" class="tt-file"><span>Choose a CSV or text file</span><input id="${id}-file" type="file" accept=".csv,.txt,text/csv,text/plain" /></label>
      <label for="${id}-text"><span>OR PASTE THE ROWS</span><small>${hint}</small></label>
      <textarea id="${id}-text" rows="6" spellcheck="false" autocomplete="off"></textarea>
      <a class="tt-download" href="${example}" download>DOWNLOAD THE EXAMPLE FILE ↓</a>
    </div>`
  return `<section class="tt-panel" aria-labelledby="tt-form-heading">
    <header><span class="section-label">RECONCILE ONE MONTH</span><h2 id="tt-form-heading">Statement on the left. Your imports on the right.</h2><p>Use a CSV export, or paste rows copied from the statement PDF. The files are read by this page only and never leave your browser.</p></header>
    <form id="tt-form" class="tt-form" novalidate>
      <div class="tt-two">
        ${side('statement', 'HMRC STATEMENT', 'Part 2 lines: MRN and import VAT on each line', '/downloads/postponed-vat-statement-example.csv')}
        ${side('imports', 'YOUR IMPORT LIST', 'Any export with an MRN and import VAT column', '/downloads/import-list-example.csv')}
      </div>
      <div class="tt-actions"><button class="button" type="submit">RECONCILE</button><button class="tt-secondary" type="button" data-tt-example>LOAD THE WORKED EXAMPLE</button></div>
    </form>
  </section>`
}

function content() {
  const totals = pvaExample.totals
  return `<section class="tt-example" aria-labelledby="tt-example-heading">
      <header><span class="section-label">WORKED EXAMPLE</span><h2 id="tt-example-heading">September: six statement lines, five imports.</h2><p>The example files show a typical month. Load them into the reconciler above, or read the result here.</p></header>
      <div class="tt-table-wrap"><table><caption>Reconciliation of the example September statement</caption><thead><tr><th scope="col">Result</th><th scope="col">Lines</th><th scope="col">What to do</th></tr></thead><tbody>
        <tr><th scope="row">Matched</th><td>${pvaExample.matched.length}</td><td>Include in the VAT Return.</td></tr>
        <tr><th scope="row">Amount differs</th><td>${pvaExample.amountMismatch.length}</td><td>Statement ${gbp(pvaExample.amountMismatch[0].statementVat)}, your list ${gbp(pvaExample.amountMismatch[0].yourVat)}: a transposed figure. The statement amount is what HMRC recorded; correct your list or ask the agent to amend.</td></tr>
        <tr><th scope="row">Duplicate on the statement</th><td>${pvaExample.duplicates.length}</td><td>Same MRN and ${gbp(pvaExample.duplicates[0].vat)} twice. Adjust the statement and account once, as HMRC’s guidance says.</td></tr>
        <tr><th scope="row">On the statement only</th><td>${pvaExample.notInYourList.length}</td><td>${gbp(pvaExample.notInYourList[0].vat)} under a different declarant EORI. Ask who made the declaration under your EORI.</td></tr>
        <tr><th scope="row">On your list only</th><td>${pvaExample.missingFromStatement.length}</td><td>${gbp(pvaExample.missingFromStatement[0].vat)} with no statement line. Check whether the agent used postponed VAT accounting or paid the VAT.</td></tr>
      </tbody></table></div>
      <p class="tt-note">Statement total after removing the duplicate: <strong>${gbp(totals.statement)}</strong>. Your list: <strong>${gbp(totals.yours)}</strong>. Difference to explain: <strong>${gbp(totals.difference)}</strong>.</p>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-statement-heading">
      <header><span class="section-label">READ THE STATEMENT</span><h2 id="tt-statement-heading">What is on a monthly PVA statement.</h2><p>HMRC splits each statement into two parts.</p></header>
      <ul class="tt-cards">
        <li><strong>Part 1 · Summary</strong><span>Your VAT registration number and EORI, the total import VAT to account for that month, and the amount postponed at each port of entry.</span></li>
        <li><strong>Part 2 · Individual entries</strong><span>For each entry: the date of import (when HMRC accepted the declaration), the entry number, the declarant’s reference, the declarant’s EORI and the import VAT to include on your VAT Return.</span></li>
        <li><strong>Estimated entries</strong><span>If you estimated import VAT earlier, account only for the amount that adjusts the estimate to the statement figure.</span></li>
        <li><strong>VAT groups</strong><span>Each member downloads its own statement under its own EORI and sends it to the representative member.</span></li>
      </ul>
      <p class="tt-note">For the declaration side of postponed VAT, use the <a href="/customs-workflows/postponed-vat-accounting-checklist/">postponed VAT accounting checklist</a>.</p>
    </section>`
}

export default {
  pageFile: 'pva.mjs',
  id: 'pva_statement_checker',
  path: '/tools/postponed-vat-statement-checker/',
  shortName: 'Postponed VAT statement checker',
  ref: 'PUBLIC TOOL 08 · PVA',
  title: 'Postponed VAT statement checker | Reconcile PVA free',
  schemaName: 'Free postponed VAT statement reconciler',
  description:
    'Reconcile your monthly postponed import VAT statement with your import list in the browser: matched, missing, mismatched and duplicate MRNs.',
  eyebrow: 'FREE PVA RECONCILER · FILES STAY IN YOUR BROWSER',
  h1: 'Reconcile your postponed VAT statement in minutes.',
  standfirst:
    'Drop in the monthly postponed import VAT statement and your own list of imports. The checker matches them by MRN, then by amount and EORI, and shows what matches, what is missing, what differs and what HMRC listed twice, with the VAT total to account for.',
  strip: ['MATCH BY MRN', 'DUPLICATES FLAGGED', 'NOTHING UPLOADED'],
  stamp: 'PVA\nRECONCILED',
  featureList: [
    'Reads a CSV export or text pasted from the statement PDF',
    'Matches statement lines to your import list by MRN, then by amount and EORI',
    'Flags duplicates with the same MRN and VAT amount, as described by HMRC',
    'Checks every MRN check digit and exports the reconciliation as CSV',
  ],
  answer: {
    question: 'How do I reconcile a postponed import VAT statement?',
    text: 'Download the monthly statement from the Customs Declaration Service, list the imports you expect for the same month with their MRNs and import VAT, and match the two line by line. Every matched line goes into the VAT Return; every missing, extra, different or duplicated line needs a decision before you file.',
  },
  steps: [
    ['01', 'Get the statement', 'Download the month’s postponed import VAT statement from the CDS dashboard. Statements are usually ready by the 10th working day and stay online for 6 months.'],
    ['02', 'Add your import list', 'Export your own list for the month (MRN, reference, import VAT) from your accounts, ERP or agent reports. Any CSV works; the checker finds the columns.'],
    ['03', 'Reconcile', 'The checker matches by MRN, flags amount differences, duplicates and lines on one side only, and checks each MRN’s check digit.'],
    ['04', 'Account and keep', 'Use the reconciled total on the VAT Return, keep the statement and the export with your records, and chase the open lines with your agent.'],
  ],
  faqs: [
    ['Where do I get my postponed import VAT statement?', 'You download it from the Customs Declaration Service, signed in with the details you used to register for VAT, usually by the 10th working day of the following month.'],
    ['How long can I download a statement for?', 'Each statement stays available for 6 months from publication, so download and keep a copy every month.'],
    ['What does a duplicated entry look like?', 'HMRC says a duplicate has the same MRN and the same VAT amount as the original entry, and you should adjust the statement and account for the revised amount.'],
    ['Do my files get uploaded anywhere?', 'No, the files are read by your browser on this page and are never sent to Declarix or anyone else.'],
    ['What if a line is on my list but not on the statement?', 'Check the MRN with your agent: the declaration may not have used postponed VAT accounting, may sit in a different month, or may carry a different EORI.'],
    ['Which box of the VAT Return does postponed import VAT go in?', 'Postponed import VAT goes in Box 1 as output tax and, where you can reclaim it under the normal rules, in Box 4 as input tax, with the net value in Box 7.'],
  ],
  sources: [
    source('Understanding your monthly postponed import VAT statements', 'HM Revenue & Customs · GOV.UK · updated 19 May 2026', 'https://www.gov.uk/guidance/understanding-your-monthly-postponed-import-vat-statements'),
    source('Get your postponed import VAT statement', 'HM Revenue & Customs · GOV.UK · updated 4 July 2024', 'https://www.gov.uk/guidance/get-your-postponed-import-vat-statement'),
    source('Complete your VAT Return to account for import VAT', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/complete-your-vat-return-to-account-for-import-vat'),
    source('Using postponed VAT accounting', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/collections/using-postponed-vat-accounting'),
  ],
  related: ['/customs-workflows/postponed-vat-accounting-checklist/', '/tools/mrn-checker/', '/tools/import-duty-repayment-checker/'],
  widget,
  content,
  modules: ['mrn', 'pva'],
  behaviour: `
      const statementText = document.getElementById('statement-text');
      const importsText = document.getElementById('imports-text');
      [['statement-file', statementText], ['imports-file', importsText]].forEach(([id, target]) => {
        document.getElementById(id).addEventListener('change', (event) => {
          const file = event.target.files && event.target.files[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) { status.textContent = 'That file is over 5 MB. Export one month at a time.'; return; }
          file.text().then((text) => { target.value = text; status.textContent = file.name + ' loaded in your browser.'; });
        });
      });
      const money = (value) => value === null || value === '' || Number.isNaN(Number(value)) ? '–' : (Number(value) < 0 ? '−' : '') + '£' + Math.abs(Number(value)).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const table = (caption, head, rows) => rows.length ? '<div class="tt-table-wrap"><table><caption>' + caption + '</caption><thead><tr>' + head.map((cell) => '<th scope="col">' + cell + '</th>').join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div>' : '';
      const run = () => {
        const statement = extractRecords(statementText.value);
        const own = extractRecords(importsText.value);
        if (!statement.records.length || !own.records.length) {
          status.textContent = 'Add both files. Each needs lines with an MRN and an import VAT amount.';
          showResult('<header class="tt-verdict is-fail"><span>NEED BOTH SIDES</span><h2>Add the statement and your list.</h2><p>We found ' + statement.records.length + ' statement lines and ' + own.records.length + ' import lines with an MRN or amount.</p></header>', { outcome: 'incomplete' });
          return;
        }
        const r = reconcilePva(statement.records, own.records);
        const t = r.totals;
        const open = r.amountMismatch.length + r.missingFromStatement.length + r.notInYourList.length + r.duplicates.length;
        lastCsv = [['result', 'mrn', 'statement_vat', 'your_vat', 'difference', 'reference'].join(',')]
          .concat(r.matched.map((x) => ['matched', x.mrn, x.statementVat, x.yourVat ?? '', '', x.reference || ''].join(',')))
          .concat(r.amountMismatch.map((x) => ['amount_differs', x.mrn, x.statementVat, x.yourVat, x.difference, x.reference || ''].join(',')))
          .concat(r.duplicates.map((x) => ['duplicate_on_statement', x.mrn, x.vat, '', '', x.reference || ''].join(',')))
          .concat(r.notInYourList.map((x) => ['statement_only', x.mrn, x.vat, '', '', x.reference || ''].join(',')))
          .concat(r.missingFromStatement.map((x) => ['your_list_only', x.mrn, '', x.vat, '', x.reference || ''].join(',')))
          .concat(r.matchedByAmount.map((x) => ['matched_by_amount', x.statementMrn, x.vat, x.vat, '', x.yourReference || ''].join(',')))
          .join('\\n');
        let html = '<header class="tt-verdict ' + (open ? 'is-fail' : 'is-pass') + '"><span>RECONCILIATION</span><h2>' + (open ? open + ' lines need a decision.' : 'Everything matches.') + '</h2><p>Statement ' + money(t.statement) + ' after duplicates · your list ' + money(t.yours) + ' · difference ' + money(t.difference) + '</p></header>' +
          '<ul class="tt-tiles"><li><b>' + r.matched.length + '</b>Matched</li><li><b>' + r.amountMismatch.length + '</b>Amount differs</li><li><b>' + r.duplicates.length + '</b>Duplicates</li><li><b>' + r.notInYourList.length + '</b>Statement only</li><li><b>' + r.missingFromStatement.length + '</b>Your list only</li></ul>';
        html += table('Amount differs', ['MRN', 'Statement', 'Your list', 'Difference'], r.amountMismatch.map((x) => '<tr><th scope="row">' + esc(x.mrn) + '</th><td>' + money(x.statementVat) + '</td><td>' + money(x.yourVat) + '</td><td>' + money(x.difference) + '</td></tr>'));
        html += table('Duplicates on the statement (same MRN and VAT)', ['MRN', 'VAT', 'Line'], r.duplicates.map((x) => '<tr><th scope="row">' + esc(x.mrn) + '</th><td>' + money(x.vat) + '</td><td>' + x.line + '</td></tr>'));
        html += table('On the statement, not on your list', ['MRN', 'VAT', 'Declarant EORI'], r.notInYourList.map((x) => '<tr><th scope="row">' + esc(x.mrn) + '</th><td>' + money(x.vat) + '</td><td>' + esc(x.eori || '–') + '</td></tr>'));
        html += table('On your list, not on the statement', ['MRN', 'VAT', 'Reference'], r.missingFromStatement.map((x) => '<tr><th scope="row">' + esc(x.mrn || '–') + '</th><td>' + money(x.vat) + '</td><td>' + esc(x.reference || '–') + '</td></tr>'));
        html += table('Matched by amount (no MRN on your line)', ['Statement MRN', 'VAT', 'Your reference'], r.matchedByAmount.map((x) => '<tr><th scope="row">' + esc(x.statementMrn) + '</th><td>' + money(x.vat) + '</td><td>' + esc(x.yourReference || '–') + '</td></tr>'));
        html += table('MRNs that fail the check digit', ['MRN', 'Problem'], r.invalidMrns.map((x) => '<tr><th scope="row">' + esc(x.mrn) + '</th><td>' + esc(x.error) + '</td></tr>'));
        html += table('Matched', ['MRN', 'VAT', 'Reference'], r.matched.map((x) => '<tr><th scope="row">' + esc(x.mrn) + '</th><td>' + money(x.statementVat) + '</td><td>' + esc(x.reference || '–') + '</td></tr>'));
        const labels = { mrn: 'MRN', vat: 'import VAT', eori: 'EORI', date: 'date', reference: 'reference' };
        const described = (read) => read.mode === 'columns' ? 'columns ' + Object.entries(read.columns).map(([key, header]) => labels[key] + ' = “' + header + '”').join(', ') : 'each line of pasted text';
        html += '<p class="tt-note">Statement read from ' + esc(described(statement)) + '. Your list read from ' + esc(described(own)) + '.</p>';
        html += '<div class="tt-actions"><button class="tt-secondary" type="button" data-tt-csv>DOWNLOAD THE RECONCILIATION CSV</button></div>';
        lastCopy = 'Postponed VAT reconciliation\\nMatched ' + r.matched.length + ', amount differs ' + r.amountMismatch.length + ', duplicates ' + r.duplicates.length + ', statement only ' + r.notInYourList.length + ', your list only ' + r.missingFromStatement.length + '\\nStatement ' + money(t.statement) + ' · your list ' + money(t.yours) + ' · difference ' + money(t.difference);
        showResult(html, { statement_lines: t.statementLines, list_lines: t.yourLines, open_lines: open, outcome: open ? 'open_lines' : 'all_matched' });
      };
      form.addEventListener('submit', (event) => { event.preventDefault(); run(); });
      exampleButton?.addEventListener('click', async () => {
        try {
          const [a, b] = await Promise.all(['/downloads/postponed-vat-statement-example.csv', '/downloads/import-list-example.csv'].map((path) => fetch(path).then((response) => response.text())));
          statementText.value = a; importsText.value = b;
          track('tool_example_loaded');
          run();
        } catch { status.textContent = 'The example files did not load. Download them with the links above.'; }
      });
      result.addEventListener('click', (event) => {
        if (!event.target.closest('[data-tt-csv]')) return;
        const blob = new Blob([lastCsv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'postponed-vat-reconciliation.csv';
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        track('tool_result_downloaded');
      });
  `,
}

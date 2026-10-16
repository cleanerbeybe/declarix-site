import { readFileSync } from 'node:fs'
import { ACTIONS, extractRecords, reconcilePva, vatReturnSummary } from '../pva.mjs'
import { gbp, source } from '../page-kit.mjs'

const pvaExampleStatement = readFileSync(new URL('../../../public/downloads/postponed-vat-statement-example.csv', import.meta.url), 'utf8')
const pvaExampleList = readFileSync(new URL('../../../public/downloads/import-list-example.csv', import.meta.url), 'utf8')
export const pvaExample = reconcilePva(extractRecords(pvaExampleStatement).records, extractRecords(pvaExampleList).records)
const pvaExampleSummary = vatReturnSummary(pvaExample)

// Issue intent §4.1 (16 Oct 2026): the H1 changed. The previous H1 stays word for word as the
// line under it; the previous standfirst moves into the tool panel.
const PREVIOUS_H1 = 'Reconcile your postponed VAT statement in minutes.'
const STANDFIRST =
  'Drop in the monthly postponed import VAT statement and your own list of imports. The checker matches them by MRN, then by amount and EORI, and shows what matches, what is missing, what differs and what HMRC listed twice, with the VAT total to account for.'

// GOV.UK "Get your postponed import VAT statement" (updated 4 July 2024, checked 16 Oct 2026):
// subscribe to CDS first; statements are usually ready by the 10th working day; each one can be
// accessed for 6 months from publication; sign in with the details created when registering for VAT.
const GET_STATEMENT = [
  ['1', 'Subscribe to CDS', 'One time: subscribe to the Customs Declaration Service with your EORI.'],
  ['2', 'Sign in', 'Use the sign-in details you created when you registered for VAT.'],
  ['3', 'Wait for the 10th working day', 'The statement for last month is usually ready by then.'],
  ['4', 'Download within 6 months', 'Save the CSV or PDF. After 6 months HMRC archives it.'],
]

function widget() {
  const side = (id, title, hint, example) => `<div class="tt-drop" data-side="${id}">
      <span class="section-label">${title}</span>
      <label for="${id}-file" class="tt-file"><span>Choose a CSV or text file</span><input id="${id}-file" type="file" accept=".csv,.txt,text/csv,text/plain" /></label>
      <label for="${id}-text"><span>OR PASTE THE ROWS</span><small>${hint}</small></label>
      <textarea id="${id}-text" rows="6" spellcheck="false" autocomplete="off"></textarea>
      <a class="tt-download" href="${example}" download>DOWNLOAD THE EXAMPLE FILE ↓</a>
    </div>`
  return `<section class="tt-panel tt-pva-panel" aria-labelledby="tt-form-heading">
    <header><span class="section-label">RECONCILE ONE MONTH</span><h2 id="tt-form-heading">Statement on the left. Your imports on the right.</h2><p>Use a CSV export, or paste rows copied from the statement PDF. The files are read by this page only and never leave your browser.</p></header>
    <form id="tt-form" class="tt-form" novalidate>
      <div class="tt-two">
        ${side('statement', 'HMRC STATEMENT', 'Part 2 lines: MRN and import VAT on each line', '/downloads/postponed-vat-statement-example.csv')}
        ${side('imports', 'YOUR IMPORT LIST', 'Any export with an MRN and import VAT column', '/downloads/import-list-example.csv')}
      </div>
      <div class="tt-actions"><button class="button" type="submit">RECONCILE</button><button class="tt-secondary" type="button" data-tt-example>LOAD THE WORKED EXAMPLE</button></div>
    </form>
    <aside class="tt-getstatement" aria-labelledby="tt-get-heading">
      <h2 id="tt-get-heading">How to get your statement</h2>
      <ol>${GET_STATEMENT.map(([number, title, copy]) => `<li><b>${number}</b><strong>${title}</strong><span>${copy}</span></li>`).join('')}</ol>
      <p><a href="https://www.gov.uk/guidance/get-your-postponed-import-vat-statement">Get your statement on GOV.UK ↗</a></p>
    </aside>
    <p class="tt-standfirst">${STANDFIRST}</p>
  </section>`
}

function content() {
  const totals = pvaExample.totals
  return `<section class="tt-example" aria-labelledby="tt-example-heading">
      <header><span class="section-label">WORKED EXAMPLE</span><h2 id="tt-example-heading">September: six statement lines, five imports.</h2><p>The example files show a typical month. Load them into the reconciler above, or read the result here.</p></header>
      <div class="tt-table-wrap"><table><caption>Reconciliation of the example September statement</caption><thead><tr><th scope="col">Result</th><th scope="col">Lines</th><th scope="col">What to do</th></tr></thead><tbody>
        <tr><th scope="row">Matched</th><td>${pvaExample.matched.length}</td><td>${ACTIONS.matched}</td></tr>
        <tr><th scope="row">Amount differs</th><td>${pvaExample.amountMismatch.length}</td><td>Statement ${gbp(pvaExample.amountMismatch[0].statementVat)}, your list ${gbp(pvaExample.amountMismatch[0].yourVat)}: a transposed figure. The statement amount is what HMRC recorded; correct your list or ask the agent to amend.</td></tr>
        <tr><th scope="row">Duplicate on the statement</th><td>${pvaExample.duplicates.length}</td><td>Same MRN and ${gbp(pvaExample.duplicates[0].vat)} twice. Adjust the statement and account once, as HMRC’s guidance says.</td></tr>
        <tr><th scope="row">On the statement only</th><td>${pvaExample.notInYourList.length}</td><td>${gbp(pvaExample.notInYourList[0].vat)} under a different declarant EORI. Ask who made the declaration under your EORI.</td></tr>
        <tr><th scope="row">On your list only</th><td>${pvaExample.missingFromStatement.length}</td><td>${gbp(pvaExample.missingFromStatement[0].vat)} with no statement line. Check whether the agent used postponed VAT accounting or paid the VAT.</td></tr>
      </tbody></table></div>
      <p class="tt-note">Statement total after removing the duplicate: <strong>${gbp(totals.statement)}</strong>. Your list: <strong>${gbp(totals.yours)}</strong>. Difference to explain: <strong>${gbp(totals.difference)}</strong>.</p>
      <p class="tt-note">VAT Return line from the result: ${pvaExampleSummary.text}</p>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-boxes-heading">
      <header><span class="section-label">VAT RETURN</span><h2 id="tt-boxes-heading">Which VAT Return boxes: 1, 4 and 7.</h2><p>Postponed import VAT goes on the VAT Return for the period that covers the date you imported the goods.</p></header>
      <div class="tt-table-wrap"><table><caption>Where postponed import VAT goes on the VAT Return</caption><thead><tr><th scope="col">Box</th><th scope="col">What goes in</th><th scope="col">Worked example (September)</th></tr></thead><tbody>
        <tr><th scope="row">Box 1</th><td data-label="What goes in">VAT due on imports accounted for through postponed VAT accounting, from the monthly statement.</td><td data-label="Worked example">${gbp(totals.statement)}</td></tr>
        <tr><th scope="row">Box 4</th><td data-label="What goes in">The VAT you reclaim on those imports. The normal input tax rules apply.</td><td data-label="Worked example">${gbp(totals.statement)} where all of it is reclaimable</td></tr>
        <tr><th scope="row">Box 7</th><td data-label="What goes in">The total value of all imports of goods in the period, excluding VAT.</td><td data-label="Worked example">The customs value of the September imports</td></tr>
      </tbody></table></div>
      <p class="tt-note">No statement yet, or you delayed the declaration? Estimate the import VAT from your records. When the statement arrives, account only for the amount that adjusts the estimate.</p>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-missing-heading">
      <header><span class="section-label">PROBLEMS</span><h2 id="tt-missing-heading">Statement missing or wrong? What to do.</h2></header>
      <ul class="tt-cards">
        <li><strong>An import is missing</strong><span>In a VAT group, or with a closely related company, check their statement. If an agent made the declaration, ask them to confirm the import VAT went to the correct EORI.</span></li>
        <li><strong>An entry appears twice</strong><span>A duplicate has the same MRN and the same VAT amount. Adjust the statement by hand and account for the revised amount.</span></li>
        <li><strong>The amount changed after you filed</strong><span>Correct a nil net tax error on your next VAT Return (the Box 1 change equals the Box 4 change), or follow the error correction procedure.</span></li>
        <li><strong>No statement at all</strong><span>Check that you subscribed to CDS and that the agent selected postponed VAT accounting with your EORI. For service problems, call the HMRC imports and exports helpline.</span></li>
        <li><strong>The statement is older than 6 months</strong><span>HMRC archives it. Your CDS dashboard explains how to request an archived statement.</span></li>
      </ul>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-c79-heading">
      <header><span class="section-label">TWO DOCUMENTS</span><h2 id="tt-c79-heading">PVA statement vs C79.</h2><p>Both come from the CDS dashboard each month. They cover different ways of handling import VAT.</p></header>
      <div class="tt-table-wrap"><table><caption>Postponed import VAT statement compared with the C79 import VAT certificate</caption><thead><tr><th scope="col"></th><th scope="col">Postponed import VAT statement (MPIVS)</th><th scope="col">Import VAT certificate (C79)</th></tr></thead><tbody>
        <tr><th scope="row">Shows</th><td data-label="PVA statement">Import VAT you postponed and account for on the VAT Return</td><td data-label="C79">Import VAT you paid, for example through a duty deferment account</td></tr>
        <tr><th scope="row">Used for</th><td data-label="PVA statement">Box 1 and Box 4 on the same return</td><td data-label="C79">Evidence to reclaim the VAT paid as input tax</td></tr>
        <tr><th scope="row">Ready</th><td data-label="PVA statement">Usually by the 10th working day of the next month</td><td data-label="C79">Usually by the 10th working day of the next month</td></tr>
        <tr><th scope="row">Available for</th><td data-label="PVA statement">6 months from publication</td><td data-label="C79">6 months from publication</td></tr>
      </tbody></table></div>
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
  title: 'Postponed VAT Statement: Get It and Reconcile It Free',
  schemaName: 'Free postponed VAT statement reconciler',
  description:
    'How to get your monthly postponed import VAT statement from CDS, then reconcile it with your imports by MRN in your browser: matched, missing, duplicates.',
  eyebrow: 'FREE PVA RECONCILER · FILES STAY IN YOUR BROWSER',
  h1: 'Postponed import VAT statement: download it, then reconcile it',
  standfirst: PREVIOUS_H1,
  strip: ['MATCH BY MRN', 'DUPLICATES FLAGGED', 'NOTHING UPLOADED'],
  stamp: 'PVA\nRECONCILED',
  featureList: [
    'Reads a CSV export or text pasted from the statement PDF',
    'Matches statement lines to your import list by MRN, then by amount and EORI',
    'Flags duplicates with the same MRN and VAT amount, as described by HMRC',
    'Checks every MRN check digit and exports the reconciliation as CSV',
    'Gives the Box 1 and Box 4 figure and lists the open items for the VAT Return',
    'Gives a reason and a next action for every line that does not match',
    'Exports an audit-ready CSV with totals, reconciling items, run date and file names, and prints a dated record',
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
    ['What is the MPIVS?', 'MPIVS is the monthly postponed import VAT statement: the HMRC statement on the CDS dashboard that lists the import VAT you postponed in the month, entry by entry.'],
    ['Can I use an estimate if the statement is late?', 'Yes, if you cannot get the statement in time you estimate the import VAT from your own records, then account only for the difference once the statement shows the real figure.'],
    ['Which box of the VAT Return does postponed import VAT go in?', 'Postponed import VAT goes in Box 1 as output tax and, where you can reclaim it under the normal rules, in Box 4 as input tax, with the net value in Box 7.'],
  ],
  sources: [
    source('Understanding your monthly postponed import VAT statements', 'HM Revenue & Customs · GOV.UK · updated 19 May 2026', 'https://www.gov.uk/guidance/understanding-your-monthly-postponed-import-vat-statements'),
    source('Get your postponed import VAT statement', 'HM Revenue & Customs · GOV.UK · updated 4 July 2024', 'https://www.gov.uk/guidance/get-your-postponed-import-vat-statement'),
    source('Complete your VAT Return to account for import VAT', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/complete-your-vat-return-to-account-for-import-vat'),
    source('Using postponed VAT accounting', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/collections/using-postponed-vat-accounting'),
    source('Get your import VAT certificate (C79)', 'HM Revenue & Customs · GOV.UK · updated 19 May 2026', 'https://www.gov.uk/guidance/get-your-import-vat-certificates', '16 OCTOBER 2026'),
  ],
  related: ['/customs-workflows/postponed-vat-accounting-checklist/', '/tools/mrn-checker/', '/tools/import-duty-repayment-checker/'],
  widget,
  content,
  modules: ['mrn', 'pva'],
  behaviour: `
      const statementText = document.getElementById('statement-text');
      const importsText = document.getElementById('imports-text');
      const fileNames = { statement: '', imports: '' };
      [['statement-file', statementText, 'statement'], ['imports-file', importsText, 'imports']].forEach(([id, target, side]) => {
        document.getElementById(id).addEventListener('change', (event) => {
          const file = event.target.files && event.target.files[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) { status.textContent = 'That file is over 5 MB. Export one month at a time.'; return; }
          file.text().then((text) => { target.value = text; fileNames[side] = file.name; status.textContent = file.name + ' loaded in your browser.'; });
        });
      });
      // A hand edit after loading a file means the rows are no longer that file's rows.
      [[statementText, 'statement'], [importsText, 'imports']].forEach(([area, side]) => area.addEventListener('input', () => { fileNames[side] = ''; }));
      const applyResultActions = (show) => ['tt-copy', 'tt-print'].forEach((id) => { const button = document.getElementById(id); if (button) button.hidden = !show; });
      // The shell's showResult() resets the buttons, so apply the choice again once the result is on screen.
      const setResultActions = (show) => { applyResultActions(show); setTimeout(() => applyResultActions(show), 0); };
      const money = (value) => value === null || value === '' || Number.isNaN(Number(value)) ? '–' : (Number(value) < 0 ? '−' : '') + '£' + Math.abs(Number(value)).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const table = (caption, head, rows, cls) => rows.length ? '<div class="tt-table-wrap"><table class="' + (cls || '') + '"><caption>' + caption + '</caption><thead><tr>' + head.map((cell) => '<th scope="col">' + cell + '</th>').join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div>' : '';
      const cell = (label, value) => '<td data-label="' + label + '">' + value + '</td>';
      const why = (kind, item) => { const e = explainLine(kind, item); return cell('Reason', esc(e.reason)) + cell('What to do', esc(e.action)); };
      const runDate = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const run = () => {
        const statement = extractRecords(statementText.value);
        const own = extractRecords(importsText.value);
        if (!statement.records.length || !own.records.length) {
          status.textContent = 'Add both files. Each needs lines with an MRN and an import VAT amount.';
          setResultActions(false);
          showResult('<header class="tt-verdict is-fail"><span>NEED BOTH SIDES</span><h2>Add the statement and your list.</h2><p>We found ' + statement.records.length + ' statement lines and ' + own.records.length + ' import lines with an MRN or amount.</p></header>', { outcome: 'incomplete' });
          return;
        }
        const r = reconcilePva(statement.records, own.records);
        const t = r.totals;
        const summary = vatReturnSummary(r);
        const open = r.amountMismatch.length + r.missingFromStatement.length + r.notInYourList.length + r.duplicates.length;
        const date = runDate();
        const statementName = fileNames.statement || 'pasted statement rows';
        const listName = fileNames.imports || 'pasted import rows';
        lastCsv = reconciliationCsv(r, { runDate: date, statementFile: fileNames.statement, listFile: fileNames.imports });
        let html = '<p class="tt-print-meta">Reconciled on ' + esc(date) + ' from ' + esc(statementName) + ' and ' + esc(listName) + '.</p>' +
          '<header class="tt-verdict ' + (open ? 'is-fail' : 'is-pass') + '"><span>RECONCILIATION</span><h2>' + (open ? open + ' lines need a decision.' : 'Everything matches.') + '</h2><p>Statement ' + money(t.statement) + ' after duplicates · your list ' + money(t.yours) + ' · difference ' + money(t.difference) + '</p></header>' +
          '<p class="tt-vat-return"><strong>VAT Return.</strong> ' + esc(summary.text) + '</p>' +
          '<ul class="tt-tiles"><li><b>' + r.matched.length + '</b>Matched</li><li><b>' + r.amountMismatch.length + '</b>Amount differs</li><li><b>' + r.duplicates.length + '</b>Duplicates</li><li><b>' + r.notInYourList.length + '</b>Statement only</li><li><b>' + r.missingFromStatement.length + '</b>Your list only</li></ul>';
        html += table('Amount differs', ['MRN', 'Statement', 'Your list', 'Difference', 'Reason', 'What to do'], r.amountMismatch.map((x) => '<tr><th scope="row">' + esc(x.mrn) + '</th>' + cell('Statement', money(x.statementVat)) + cell('Your list', money(x.yourVat)) + cell('Difference', money(x.difference)) + why('amount_differs', x) + '</tr>'), 'tt-pva-table');
        html += table('Duplicates on the statement (same MRN and VAT)', ['MRN', 'VAT', 'Where', 'Reason', 'What to do'], r.duplicates.map((x) => '<tr><th scope="row">' + esc(x.mrn) + '</th>' + cell('VAT', money(x.vat)) + cell('Where', esc(rowLabel(x))) + why('duplicate_on_statement', x) + '</tr>'), 'tt-pva-table');
        html += table('On the statement, not on your list', ['MRN', 'VAT', 'Declarant EORI', 'Reason', 'What to do'], r.notInYourList.map((x) => '<tr><th scope="row">' + esc(x.mrn) + '</th>' + cell('VAT', money(x.vat)) + cell('Declarant EORI', esc(x.eori || '–')) + why('statement_only', x) + '</tr>'), 'tt-pva-table');
        html += table('On your list, not on the statement', ['MRN', 'VAT', 'Reference', 'Reason', 'What to do'], r.missingFromStatement.map((x) => '<tr><th scope="row">' + esc(x.mrn || '–') + '</th>' + cell('VAT', money(x.vat)) + cell('Reference', esc(x.reference || '–')) + why('your_list_only', x) + '</tr>'), 'tt-pva-table');
        html += table('Matched by amount (no MRN on your line)', ['Statement MRN', 'VAT', 'Your reference', 'Reason', 'What to do'], r.matchedByAmount.map((x) => '<tr><th scope="row">' + esc(x.statementMrn) + '</th>' + cell('VAT', money(x.vat)) + cell('Your reference', esc(x.yourReference || '–')) + why('matched_by_amount', x) + '</tr>'), 'tt-pva-table');
        html += table('MRNs that fail the check digit', ['MRN', 'Where', 'Reason', 'What to do'], r.invalidMrns.map((x) => '<tr><th scope="row">' + esc(x.mrn) + '</th>' + cell('Where', esc(rowLabel(x))) + why('invalid_mrn', x) + '</tr>'), 'tt-pva-table');
        html += table('Matched', ['MRN', 'VAT', 'Reference'], r.matched.map((x) => '<tr><th scope="row">' + esc(x.mrn) + '</th>' + cell('VAT', money(x.statementVat)) + cell('Reference', esc(x.reference || '–')) + '</tr>'), 'tt-pva-table');
        const labels = { mrn: 'MRN', vat: 'import VAT', eori: 'EORI', date: 'date', reference: 'reference' };
        const described = (read) => read.mode === 'columns' ? 'columns ' + Object.entries(read.columns).map(([key, header]) => labels[key] + ' = “' + header + '”').join(', ') : 'each line of pasted text';
        html += '<p class="tt-note">Statement read from ' + esc(described(statement)) + '. Your list read from ' + esc(described(own)) + '. Row numbers count data rows; the file line includes the header.</p>';
        html += '<div class="tt-actions"><button class="tt-secondary" type="button" data-tt-csv>DOWNLOAD THE RECONCILIATION CSV</button></div>';
        html += '<p class="tt-print-brand">Prepared with the free Declarix postponed VAT statement checker · getdeclarix.com/tools/postponed-vat-statement-checker/</p>';
        lastCopy = 'Postponed VAT reconciliation\\nReconciled on ' + date + ' from ' + statementName + ' and ' + listName + '\\n' + summary.text + '\\nMatched ' + r.matched.length + ', amount differs ' + r.amountMismatch.length + ', duplicates ' + r.duplicates.length + ', statement only ' + r.notInYourList.length + ', your list only ' + r.missingFromStatement.length + '\\nStatement ' + money(t.statement) + ' · your list ' + money(t.yours) + ' · difference ' + money(t.difference);
        setResultActions(true);
        showResult(html, { statement_lines: t.statementLines, list_lines: t.yourLines, open_lines: open, outcome: open ? 'open_lines' : 'all_matched' });
      };
      form.addEventListener('submit', (event) => { event.preventDefault(); run(); });
      exampleButton?.addEventListener('click', async () => {
        try {
          const paths = ['/downloads/postponed-vat-statement-example.csv', '/downloads/import-list-example.csv'];
          const [a, b] = await Promise.all(paths.map((path) => fetch(path).then((response) => response.text())));
          statementText.value = a; importsText.value = b;
          fileNames.statement = 'postponed-vat-statement-example.csv'; fileNames.imports = 'import-list-example.csv';
          track('tool_example_loaded');
          run();
        } catch { status.textContent = 'The example files did not load. Download them with the links above.'; }
      });
      result.addEventListener('click', (event) => {
        if (!event.target.closest('[data-tt-csv]')) return;
        const blob = new Blob(['\\ufeff' + lastCsv], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'postponed-vat-reconciliation.csv';
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        track('tool_result_downloaded');
      });
  `,
}

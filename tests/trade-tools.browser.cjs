// Browser check for the round-2 free tools. Serves dist/, drives each tool at desktop
// and phone width, and asserts results, no page errors and no horizontal scroll.
// Run after `npm run build`: node tests/trade-tools.browser.cjs
const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '../dist');
const output = path.join(__dirname, '../output/trade-tools');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.csv': 'text/csv', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

const scenarios = {
  '/tools/mrn-checker/': async (page, record, width) => {
    await page.getByRole('button', { name: 'TRY THE WORKED EXAMPLE' }).click();
    const text = await page.locator('#tt-result').innerText();
    record(width + ' mrn batch result', text.includes('2 of 3 MRNs pass') && text.includes('21GB1NEXFX6SU9C4R1'));
    record(width + ' mrn batch says what to do', text.includes('will fail the check: get the correct number from whoever raised the declaration'));
    await page.locator('#mrn-input').fill('21GB1NEXFX6SU9C4R1');
    record(width + ' mrn live counter', (await page.locator('#mrn-count').innerText()).startsWith('18 of 18 characters'));
    await page.getByRole('button', { name: 'CHECK MRN' }).click();
    const single = await page.locator('#tt-result').innerText();
    record(width + ' mrn single decode', single.includes('Import declaration only') && single.includes('CHECK DIGIT MATCHES'));
    record(width + ' mrn status service', single.includes('Status service.'));
    record(width + ' mrn copy as message hidden', await page.locator('#tt-copy-message').isHidden());
    await page.locator('#tt-copy').click();
    record(width + ' mrn visible copy confirmation', await page.waitForFunction(() => document.getElementById('tt-copy').textContent.includes('COPIED ✓'), null, { timeout: 1500 }).then(() => true, () => false));
    await page.waitForTimeout(2200);
    record(width + ' mrn copy label resets', (await page.locator('#tt-copy').innerText()) === 'COPY RESULT');
    // MR2 + MR1: pasting checks at once; the failure names lookalikes and the next step.
    await page.locator('#mrn-input').fill('');
    await page.locator('#mrn-input').focus();
    await page.evaluate(() => navigator.clipboard.writeText('24GB4KX1Q3R0A1B2C3'));
    await page.keyboard.press('ControlOrMeta+V');
    await page.waitForFunction(() => document.getElementById('tt-result').innerText.includes('24GB4KX1Q3R0A1B2C3'));
    const fail = await page.locator('#tt-result').innerText();
    record(width + ' mrn paste checks at once', fail.includes('CHECK THIS MRN'));
    record(width + ' mrn MR1 wording', fail.includes('in any of the 18. Check lookalikes first: O/0, I/1, S/5, B/8.') && fail.includes('If only the last digit is wrong, the MRN would be') && fail.includes('Ask the sender to read it back from the declaration.'));
    record(width + ' mrn next step on invalid', fail.includes('This MRN will fail the check. Get the correct number from whoever raised the declaration.'));
    await page.locator('#mrn-input').fill('24GB4KX1Q3R0A1B2C0');
    await page.getByRole('button', { name: 'CHECK MRN' }).click();
    const exit = await page.locator('#tt-result').innerText();
    record(width + ' mrn procedure C never says entry summary', exit.includes('Exit summary declaration only') && !/entry summary/i.test(exit.split('Where it is used.')[1] || 'entry summary'));
    if (width === 375) record('375 mrn tables keep column labels', (await page.locator('td[data-label="Who sets it"]').count()) === 3);
  },
  '/tools/gmr-checker/': async (page, record, width) => {
    await page.locator('#gmr-input').fill('gmra000002jr');
    await page.getByRole('button', { name: 'CHECK GMR' }).click();
    record(width + ' gmr format pass', (await page.locator('#gmr-format-result').innerText()).includes('GMRA000002JR has the GVMS format'));
    await page.locator('#gmr-input').fill('21GB1NEXFX6SU9C4R1');
    await page.getByRole('button', { name: 'CHECK GMR' }).click();
    record(width + ' gmr spots an MRN', (await page.locator('#gmr-format-result').innerText()).includes('looks like an MRN'));
    record(width + ' gmr has no default direction', (await page.locator('input[name="direction"]:checked').count()) === 0);
    await page.getByRole('button', { name: 'LIST THE REFERENCES' }).click();
    record(width + ' gmr asks for a direction first', await page.locator('#tt-result').isHidden());
    await page.locator('input[name="direction"][value="gb_eu"]').check();
    await page.locator('#gmr-consignments').fill('2');
    await page.getByRole('button', { name: 'LIST THE REFERENCES' }).click();
    const plan = await page.locator('#tt-result').innerText();
    record(width + ' gmr plan', plan.includes('DUCR for every export declaration'));
    record(width + ' gmr one line per consignment', plan.includes('Consignment 1: DUCR') && plan.includes('Consignment 2: DUCR'));
    record(width + ' gmr exit summary resolved', /Exit summary declaration MRN · NOT NEEDED/i.test(plan));
    await page.locator('#tt-copy-message').click();
    record(width + ' gmr copy as message', await page.waitForFunction(() => document.getElementById('tt-copy-message').textContent.includes('COPIED ✓'), null, { timeout: 1500 }).then(() => true, () => false));
    const message = await page.evaluate(() => navigator.clipboard.readText());
    record(width + ' gmr message text', message.startsWith('GMR checklist · GB → EU · 2 consignments') && message.includes('- Consignment 2: DUCR'));
  },
  '/tools/postponed-vat-statement-checker/': async (page, record, width) => {
    await page.getByRole('button', { name: 'LOAD THE WORKED EXAMPLE' }).click();
    await page.locator('#tt-result .tt-tiles').waitFor();
    const text = await page.locator('#tt-result').innerText();
    record(width + ' pva reconciliation', text.includes('4 lines need a decision') && text.includes('−£378.50'));
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'DOWNLOAD THE RECONCILIATION CSV' }).click();
    const csv = fs.readFileSync(await (await download).path(), 'utf8');
    record(width + ' pva csv export', csv.startsWith('result,mrn') && csv.includes('duplicate_on_statement'));
    await page.locator('#statement-file').setInputFiles(path.join(root, 'downloads/postponed-vat-statement-example.csv'));
    await page.waitForFunction(() => document.getElementById('statement-text').value.includes('Date of import'));
    record(width + ' pva reads a chosen file', true);
  },
  '/tools/import-duty-repayment-checker/': async (page, record, width) => {
    await page.getByRole('button', { name: 'TRY THE WORKED EXAMPLE' }).click();
    const text = await page.locator('#tt-result').innerText();
    record(width + ' c285 example routes', text.includes('Customs Declaration Service claim') && text.includes('VAT Return adjustment') && text.includes('3 February 2028'));
    record(width + ' c285 proof of origin for a missed preference', text.includes('Proof of origin'));
    record(width + ' c285 who claims', text.includes('Your customs agent or broker can claim for you.'));
    const start = page.getByRole('link', { name: 'START YOUR CLAIM IN CDS ↗' });
    record(width + ' c285 start claim link', (await start.getAttribute('href')) === 'https://www.tax.service.gov.uk/claim-back-import-duty-vat/start-new-return');
    await page.locator('input[name="taxes"][value="duty"]').check();
    record(width + ' c285 VAT question hides for duty only', await page.locator('#c285-vat-question').isHidden());
    await page.locator('input[name="taxes"][value="both"]').check();
    await page.locator('input[name="eori"][value="no"]').check();
    await page.locator('input[name="vatRegistered"][value="no"]').check();
    await page.getByRole('button', { name: 'SHOW MY ROUTE' }).click();
    record(width + ' c285 no EORI routes to C285', (await page.locator('#tt-result').innerText()).includes('Online form C285'));
  },
  '/tools/commodity-code-checker/': async (page, record, width, live) => {
    const chapters = await page.locator('.tt-section').count();
    record(width + ' tariff chapter browser in HTML', chapters === 21);
    if (!live) return;
    await page.getByRole('button', { name: 'TRY THE WORKED EXAMPLE' }).click();
    await page.locator('#tt-result .tt-facts').waitFor({ timeout: 20000 });
    const text = await page.locator('#tt-result').innerText();
    record(width + ' tariff live commodity', text.includes('6109 10 00 10') && text.includes('Y864'));
    await page.locator('#tariff-origin').selectOption('');
    await page.locator('#tariff-query').fill('wooden dining chairs');
    await page.getByRole('button', { name: 'CHECK CODE' }).click();
    await page.waitForFunction(() => !document.getElementById('tt-result').innerText.includes('6109 10 00 10'), null, { timeout: 20000 });
    const search = await page.locator('#tt-result').innerText();
    record(width + ' tariff live search', /9403|9401/.test(search.replace(/\s/g, '')));
  },
};

(async () => {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(root, pathname, pathname.endsWith('/') ? 'index.html' : '');
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    try {
      const data = fs.readFileSync(file);
      res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
      res.end(data);
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const live = process.env.TARIFF_LIVE === '1';
  const browser = await chromium.launch({ headless: true });
  const checks = [];
  const record = (name, pass) => { assert.ok(pass, name); checks.push(name); };
  try {
    for (const [route, run] of Object.entries(scenarios)) {
      if (!fs.existsSync(path.join(root, route, 'index.html'))) continue;
      for (const width of [1440, 375]) {
        const context = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 900 }, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(origin + route);
        record(width + ' ' + route + ' answer in HTML', (await page.locator('.tt-answer').innerText()).length > 100);
        // S1: the first input of the tool is inside the first screen on a phone.
        if (width === 375) {
          const box = await page.locator('main :is(input, textarea, select):visible').first().boundingBox();
          record('375 ' + route + ' first input above the fold (top ' + Math.round(box.y) + ')', box && box.y + Math.min(box.height, 48) <= 812);
        }
        await run(page, record, width, live);
        record(width + ' ' + route + ' no horizontal scroll', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        record(width + ' ' + route + ' no page errors', errors.length === 0);
        await page.screenshot({ path: path.join(output, route.split('/').filter(Boolean).join('-') + '-' + width + '.png'), fullPage: false });
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`Trade tools browser checks passed: ${checks.length}`);
})().catch((error) => { console.error(error); process.exit(1); });

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
    await page.locator('#mrn-input').fill('21GB1NEXFX6SU9C4R1');
    await page.getByRole('button', { name: 'CHECK MRN' }).click();
    const single = await page.locator('#tt-result').innerText();
    record(width + ' mrn single decode', single.includes('Import declaration only') && single.includes('CHECK DIGIT MATCHES'));
  },
  '/tools/gmr-checker/': async (page, record, width) => {
    await page.locator('#gmr-input').fill('gmra000002jr');
    await page.getByRole('button', { name: 'CHECK GMR' }).click();
    record(width + ' gmr format pass', (await page.locator('#gmr-format-result').innerText()).includes('GMRA000002JR has the GVMS format'));
    await page.locator('#gmr-input').fill('21GB1NEXFX6SU9C4R1');
    await page.getByRole('button', { name: 'CHECK GMR' }).click();
    record(width + ' gmr spots an MRN', (await page.locator('#gmr-format-result').innerText()).includes('looks like an MRN'));
    await page.locator('#gmr-direction').selectOption('gb_eu');
    await page.getByRole('button', { name: 'LIST THE REFERENCES' }).click();
    record(width + ' gmr plan', (await page.locator('#tt-result').innerText()).includes('DUCR for every export declaration'));
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
        const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(origin + route);
        record(width + ' ' + route + ' answer in HTML', (await page.locator('.tt-answer').innerText()).length > 100);
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

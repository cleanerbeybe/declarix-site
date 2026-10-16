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
    record(width + ' pva new H1 and old H1 kept as subhead', (await page.locator('h1').innerText()).includes('download it, then reconcile it') && (await page.locator('h1 + p').first().innerText()).includes('Reconcile your postponed VAT statement in minutes.'));
    record(width + ' pva 4-step get-statement box', (await page.locator('.tt-getstatement li').count()) === 4);
    await page.getByRole('button', { name: 'LOAD THE WORKED EXAMPLE' }).click();
    await page.locator('#tt-result .tt-tiles').waitFor();
    const text = await page.locator('#tt-result').innerText();
    record(width + ' pva reconciliation', text.includes('4 lines need a decision') && text.includes('−£378.50'));
    record(width + ' pva VAT Return line (PV1)', text.includes('Account for £9,863.50 in Box 1 and Box 4') && text.includes('Open items: 1 amount difference (£270.00)'));
    record(width + ' pva reason and what to do (PV2)', text.includes('a transposed figure') && text.includes('Ask who made the declaration under your EORI'));
    record(width + ' pva data row and file line (PV5)', text.includes('Data row 4 (file line 5)'));
    record(width + ' pva run date and file names', /Reconciled on \d{1,2} \w+ \d{4} from postponed-vat-statement-example\.csv and import-list-example\.csv/.test(text));
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'DOWNLOAD THE RECONCILIATION CSV' }).click();
    const csv = fs.readFileSync(await (await download).path(), 'utf8').replace(/^﻿/, '');
    record(width + ' pva csv export (PV3)', csv.startsWith('Postponed import VAT reconciliation') && csv.includes('Statement file,postponed-vat-statement-example.csv') && csv.includes('Unexplained,,0.00') && csv.includes('duplicate_on_statement,Data row 4 (file line 5)') && csv.includes(',reason,action'));
    await page.emulateMedia({ media: 'print' });
    const print = await page.evaluate(() => ({
      hero: getComputedStyle(document.querySelector('.tt-hero')).display,
      nav: getComputedStyle(document.querySelector('.route-nav')).display,
      meta: getComputedStyle(document.querySelector('.tt-print-meta')).display,
      brand: getComputedStyle(document.querySelector('.tt-print-brand')).display,
    }));
    record(width + ' pva print starts with the result (PV4)', print.hero === 'none' && print.nav === 'none' && print.meta !== 'none' && print.brand !== 'none');
    await page.emulateMedia({ media: 'screen' });
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
    record(width + ' tariff finder label and new H1', (await page.locator('label[for="tariff-query"]').innerText()).includes('COMMODITY CODE FINDER') && (await page.locator('h1').innerText()).includes('HS code lookup'));
    record(width + ' tariff links the commodity code guide', (await page.locator('a[href="/customs-reference/commodity-code/"]').count()) > 0);
    if (!live) await mockTariff(page);
    await page.getByRole('button', { name: 'TRY THE WORKED EXAMPLE' }).click();
    await page.locator('#tt-result .tt-facts').waitFor({ timeout: 20000 });
    let text = await page.locator('#tt-result').innerText();
    record(width + ' tariff commodity with Israel proof', text.includes('6109 10 00 10') && text.includes('Y864') && text.includes('Proof of origin'));
    record(width + ' tariff VAT standard plus reliefs (CC4)', text.includes('20% (standard). 0% applies only to the listed reliefs'));
    record(width + ' tariff copy and print shown on a match', await page.locator('#tt-copy').isVisible() && await page.locator('#tt-print').isVisible());
    await page.getByRole('button', { name: 'COPY CODE' }).click();
    await page.waitForFunction(() => /COPIED ✓|COPY BLOCKED/.test(document.querySelector('[data-copy-code]').textContent));
    record(width + ' tariff COPY CODE confirms visibly (CC5)', /COPIED ✓|COPY BLOCKED/.test(await page.locator('[data-copy-code]').innerText()));
    await page.locator('#tariff-origin').selectOption('BD');
    await page.locator('#tariff-query').fill('6109100010');
    await page.getByRole('button', { name: 'CHECK CODE' }).click();
    await page.waitForFunction(() => document.getElementById('tt-result').innerText.includes('Bangladesh'), null, { timeout: 20000 });
    await page.locator('#tt-result .tt-proof').waitFor({ timeout: 20000 });
    text = await page.locator('#tt-result').innerText();
    const docsArea = await page.locator('#tt-result .tt-doc-table').count();
    record(width + ' tariff Bangladesh proof 9001/N865 (CC3)', text.includes('code 9001') && text.includes('code N865'));
    record(width + ' tariff C990 only under special end uses (CC2)', docsArea === 0 && (await page.locator('#tt-result .tt-enduse').textContent()).includes('Other measures on this line (special end uses)'));
    await page.locator('#tariff-origin').selectOption('');
    await page.locator('#tariff-query').fill('mens t-shirts cotton knitted');
    await page.getByRole('button', { name: 'CHECK CODE' }).click();
    await page.waitForFunction(() => document.getElementById('tt-result').innerText.includes('Closest lines'), null, { timeout: 30000 });
    text = await page.locator('#tt-result').innerText();
    record(width + ' tariff plain-language search leads to 6109 (CC1)', text.replace(/\s/g, '').includes('6109100010'));
    record(width + ' tariff copy and print hidden on a pick list', !(await page.locator('#tt-copy').isVisible()));
    await page.locator('#tariff-query').fill('zzqxv blorpt');
    await page.getByRole('button', { name: 'CHECK CODE' }).click();
    await page.waitForFunction(() => document.getElementById('tt-result').innerText.includes('NO MATCH'), null, { timeout: 30000 });
    text = await page.locator('#tt-result').innerText();
    record(width + ' tariff no-match hint (CC1)', text.includes('Try fewer words, for example ‘cotton t-shirts’'));
    record(width + ' tariff copy and print hidden on NO MATCH (CC6)', !(await page.locator('#tt-copy').isVisible()) && !(await page.locator('#tt-print').isVisible()));
    if (live) {
      await page.locator('#tariff-query').fill('wooden dining chairs');
      await page.getByRole('button', { name: 'CHECK CODE' }).click();
      await page.waitForFunction(() => !document.getElementById('tt-result').innerText.includes('NO MATCH'), null, { timeout: 20000 });
      const search = await page.locator('#tt-result').innerText();
      record(width + ' tariff live search', /9403|9401/.test(search.replace(/\s/g, '')));
    }
  },
};

// Offline runs answer the UK Trade Tariff API from saved responses (tests/fixtures, 15–16 Oct 2026).
const fixtures = path.join(__dirname, 'fixtures');
async function mockTariff(page) {
  const json = (name) => fs.readFileSync(path.join(fixtures, name), 'utf8');
  const empty = JSON.stringify({ data: { attributes: { type: 'fuzzy_match', goods_nomenclature_match: { chapters: [], headings: [], commodities: [] }, reference_match: { chapters: [], headings: [], commodities: [] } } } });
  await page.route('https://www.trade-tariff.service.gov.uk/uk/api/**', (route) => {
    const url = new URL(route.request().url());
    const body = (text) => route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: text });
    if (url.pathname.endsWith('/commodities/6109100010')) return body(json('tariff-commodity-6109100010.json'));
    if (url.pathname.endsWith('/headings/6109')) return body(json('tariff-heading-6109.json'));
    const roo = url.pathname.match(/rules_of_origin_schemes\/610910\/(BD|IL)$/);
    if (roo) return body(json('tariff-rules-of-origin-610910-' + roo[1] + '.json'));
    if (url.pathname.endsWith('/search')) {
      const words = (url.searchParams.get('q') || '').toLowerCase().split(/\s+/);
      // Like the live search: every word must match. Only the cotton T-shirt words are known.
      const known = ['cotton', 't-shirts', 't-shirt', 'knitted'];
      return body(words.every((word) => known.includes(word)) ? json('tariff-search-cotton-tshirt.json') : empty);
    }
    return route.fulfill({ status: 404, body: '' });
  });
}

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
        await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin }).catch(() => null);
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

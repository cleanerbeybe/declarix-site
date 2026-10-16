// Browser check for the Incoterms hub, the 11 rule pages and the ENS/ICS2 checklist (iter1 incoterms lane).
// Serves dist/, opens each page at 375×812 and 1280×900, and asserts: no page errors, no horizontal scroll,
// the chart leads the hub, the chooser still works, the print button marks the page, the FAQPage JSON-LD
// matches the visible FAQ, and the S5 table cards keep their labels on phones.
// Run after `npm run build`: node tests/authority-library.browser.cjs
const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '../dist');
const output = process.env.SHOTS_DIR || path.join(__dirname, '../output/authority-library');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.csv': 'text/csv', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const codes = ['exw', 'fca', 'cpt', 'cip', 'dap', 'dpu', 'ddp', 'fas', 'fob', 'cfr', 'cif'];
const hub = '/customs-reference/incoterms/';
const ens = '/customs-workflows/ens-ics2-entry-summary-declaration-checklist/';
const routes = [hub, ...codes.map((code) => `${hub}${code}/`), ens];
const widths = [[375, 812], [1280, 900]];

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
  const browser = await chromium.launch({ headless: true });
  const checks = [];
  const record = (name, pass) => checks.push([name, Boolean(pass)]);
  try {
    for (const [width, height] of widths) {
      for (const route of routes) {
        const page = await browser.newPage({ viewport: { width, height } });
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(origin + route, { waitUntil: 'load' });
        const label = `${width} ${route}`;
        if (['/customs-reference/incoterms/', '/customs-reference/incoterms/fob/', '/customs-reference/incoterms/ddp/', ens].includes(route)) {
          const name = route.split('/').filter(Boolean).pop();
          await page.screenshot({ path: path.join(output, `${name}-${width}-top.png`) });
          await page.screenshot({ path: path.join(output, `${name}-${width}-full.png`), fullPage: true });
        }
        record(`${label} no page errors`, errors.length === 0);
        record(`${label} no horizontal scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const faq = await page.evaluate(() => {
          const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
          const schema = graph.find((item) => item['@type'] === 'FAQPage');
          const visible = [...document.querySelectorAll('[data-faq-item]')].map((item) => (item.querySelector('h3, summary')?.textContent || ''));
          return { schema: schema ? schema.mainEntity.map((q) => q.name) : [], visible };
        });
        record(`${label} FAQPage matches visible FAQ`, faq.schema.length >= 4 && faq.schema.length === faq.visible.length && faq.schema.every((q) => faq.visible.some((v) => v.endsWith(q))));
        if (route === hub) {
          const chart = await page.evaluate(() => {
            const section = document.querySelector('.incoterms-chart');
            return { top: section.getBoundingClientRect().top + scrollY, rows: section.querySelectorAll('tbody tr').length };
          });
          record(`${label} chart has 11 rows`, chart.rows === 11);
          record(`${label} chart starts in the first screen`, chart.top < height);
          await page.locator('.incoterms-chart').screenshot({ path: path.join(output, `hub-chart-${width}.png`) }).catch(() => null);
          await page.check('input[name="mode"][value="sea"]');
          await page.check('input[name="carriage"][value="buyer"]');
          await page.check('input[name="import"][value="buyer"]');
          await page.check('input[name="destination"][value="no"]');
          await page.getByRole('button', { name: 'SHOW THE CLOSEST SHEET' }).click();
          record(`${label} chooser still answers FOB`, (await page.locator('#chooser-code').innerText()) === 'FOB');
          await page.evaluate(() => { window.print = () => { window.__printed = document.body.classList.contains('print-chart'); }; });
          await page.getByRole('button', { name: 'PRINT THE CHART' }).click();
          record(`${label} print button prints the chart only`, await page.evaluate(() => window.__printed === true));
          const csv = await (await page.request.get(origin + '/downloads/incoterms-2020-chart-uk.csv')).text();
          record(`${label} chart CSV has 11 rules`, csv.trim().split('\n').length === 12 && csv.includes('"DDP","Delivered Duty Paid"'));
          if (width === 375) {
            const labelled = await page.evaluate(() => getComputedStyle(document.querySelector('.incoterms-chart tbody td'), '::before').content.includes('Full name'));
            record(`${label} chart cards keep column labels`, labelled);
          }
        }
        if (route.startsWith(hub) && route !== hub) {
          const code = route.split('/')[3].toUpperCase();
          const h1 = await page.locator('h1').innerText();
          record(`${label} H1 spells out the rule`, h1.startsWith(code + ' ('));
          record(`${label} subhead kept`, (await page.locator('.authority-subhead').count()) === 1);
          const link = page.getByRole('link', { name: 'UK import duty and VAT calculator' });
          record(`${label} duty calculator link`, (await link.count()) >= 1 && (await link.first().getAttribute('href')) === '/tools/customs-value-import-duty-vat-calculator/');
          record(`${label} obligations table has 8 rows`, (await page.locator('.obligations tbody tr').count()) === 8);
          if (width === 375) {
            const noBreak = await page.evaluate(() => [...document.querySelectorAll('.obligations td, .obligations th')].every((cell) => getComputedStyle(cell).wordBreak !== 'break-all'));
            record(`${label} no word breaking in table cells`, noBreak);
          }
        }
        if (route === ens) {
          const order = await page.evaluate(() => {
            const direct = document.querySelector('.direct-answer');
            const deadlines = document.getElementById('ens-timings');
            return direct && deadlines && direct.nextElementSibling === deadlines;
          });
          record(`${label} deadlines table sits under the direct answer`, order);
          record(`${label} radar link`, (await page.locator('a[href="/research/cds-operations-radar/ics2-ens-data-elements-2026-10-14/"]').count()) === 1);
        }
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  const failed = checks.filter(([, pass]) => !pass);
  for (const [name, pass] of checks) console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`);
  console.log(`${checks.length - failed.length}/${checks.length} authority-library browser checks passed`);
  assert.equal(failed.length, 0);
})().catch((error) => { console.error(error); process.exit(1); });

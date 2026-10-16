// Browser check for the three customs reference finders (CPC, document codes, CDS error codes).
// Serves dist/, drives the find box and the CPC checker at desktop and phone width, and asserts the
// first tool input sits in the first phone screen, rows keep their labels and nothing scrolls sideways.
// Run after `npm run build`: node tests/customs-reference.browser.cjs [screenshot-dir]
const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.join(__dirname, '../dist');
const output = process.argv[2] || path.join(__dirname, '../output/customs-reference');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.csv': 'text/csv', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

const firstInput = {
  '/customs-reference/cds-error-codes/': '#find-err',
  '/customs-reference/customs-document-codes/': '#find-doc',
  '/customs-reference/customs-procedure-codes/': '#procedure-Import',
};

const scenarios = {
  '/customs-reference/cds-error-codes/': async (page, record, width) => {
    await page.locator('#find-err').fill('cds11004');
    const card = page.locator('[data-find-card="err"]');
    const text = await card.innerText();
    record(width + ' error card opens for an exact code', text.includes('CDS11004') && text.includes('4071') && text.includes('Check the pair in the procedure-code checker'));
    record(width + ' error card links the CPC checker', (await card.locator('a[href="/customs-reference/customs-procedure-codes/#checker"]').count()) === 1);
    const shown = await page.locator('[data-filter-table="err"] tbody tr:not([hidden])').count();
    record(width + ' find box filters the register', shown === 1);
    await page.locator('#find-err').fill('12056');
    record(width + ' bare number finds the CDS code', (await card.innerText()).includes('CDS12056'));
    await page.locator('#find-err').fill('licence');
    record(width + ' word search reports matches', /codes match/.test(await card.innerText()));
    await page.locator('#find-err').fill('');
    record(width + ' every row has a next check', (await page.locator('[data-filter-table="err"] tbody tr').count()) === (await page.locator('[data-filter-table="err"] tbody tr .next-check').count()));
    record(width + ' DMS notification H2', (await page.locator('#dms-heading').innerText()).includes('DMSREJ'));
    record(width + ' pre-lodged H2', (await page.locator('#prelodged-heading').innerText()).includes('Pre-lodged declaration rejected on arrival'));
    record(width + ' one H2 per top code', (await page.locator('.ref-top-error h2').count()) >= 9);
    await page.goto(page.url().split('#')[0] + '#cds11004');
    record(width + ' lower-case row anchor lands on the row', await page.evaluate(() => document.querySelector(':target')?.closest('tr')?.id === 'CDS11004'));
  },
  '/customs-reference/customs-document-codes/': async (page, record, width) => {
    await page.locator('#find-doc').fill('c505');
    const card = page.locator('[data-find-card="doc"]');
    const text = await card.innerText();
    record(width + ' doc card shows both C505 rows', (await card.locator('.ref-find-hit').count()) === 2 && text.includes('C505'));
    record(width + ' doc card links the C505 code card', (await card.locator('a[href="#c505"]').count()) >= 1);
    record(width + ' eight anchored code cards', (await page.locator('.ref-card').count()) === 8 && (await page.locator('#y900.ref-card').count()) === 1);
    const legend = await page.locator('.ref-legend').innerText();
    record(width + ' status legend explains AC and AE', legend.includes('AC') && legend.includes('Document attached for certification by customs') && legend.includes('AE'));
    record(width + ' Appendix 5B named for status meanings', !(await page.locator('#common-codes').innerText()).includes('copied from HMRC Appendix 5A'));
    record(width + ' recent changes link radar posts', (await page.locator('#recent-changes a[href^="/research/cds-operations-radar/"]').count()) >= 4);
  },
  '/customs-reference/customs-procedure-codes/': async (page, record, width) => {
    await page.locator('#procedure-Import').selectOption('4071');
    await page.locator('#apc-filter-Import').fill('c07');
    record(width + ' type-to-filter picks C07', (await page.locator('#apc-Import').inputValue()) === 'C07');
    await page.getByRole('button', { name: 'CHECK THE PAIR' }).click();
    const result = await page.locator('#cpc-result').innerText();
    record(width + ' checker verdict', result.includes('4071 with C07 is listed as a valid pair'));
    record(width + ' checker reasoning (CP2)', result.includes('£135') && result.includes('4000') && result.includes('customs warehousing'));
    record(width + ' checker source line (CP1)', result.includes('Source:') && result.includes('HMRC Appendix 1') && result.includes('checked 15 Oct 2026'));
    const hmrc = await page.locator('#cpc-source a').first().getAttribute('href');
    record(width + ' HMRC link is deep (section anchor)', /#section/.test(hmrc));
    await page.locator('#apc-filter-Import').fill('samples');
    record(width + ' word filter narrows the list', (await page.locator('#apc-Import option').count()) < 20);
    record(width + ' top CPC table anchors', (await page.locator('tr[id="4000c07"]').count()) === 1 && (await page.locator('#when-to-use-4000c07').count()) === 1);
    record(width + ' CHIEF vs CDS H2', (await page.locator('#chief-heading').innerText()).includes('Box 37'));
    for (const guide of ['bonded-warehouse', 'inward-processing-relief', 'outward-processing-relief', 'returned-goods-relief', 'end-use-relief', 'temporary-admission']) {
      record(width + ' links ' + guide, (await page.locator('a[href="/customs-reference/' + guide + '/"]').count()) > 0);
    }
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
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const record = (name, ok) => { results.push([name, ok]); console.log((ok ? 'PASS ' : 'FAIL ') + name); };
  try {
    for (const [width, height] of [[1280, 900], [375, 812]]) {
      for (const [route, scenario] of Object.entries(scenarios)) {
        const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(origin + route);
        const box = await page.locator(firstInput[route]).boundingBox();
        record(width + ' ' + route + ' first tool input in first screen', !!box && box.y + box.height <= height);
        const slug = route.split('/').filter(Boolean).pop();
        await page.screenshot({ path: path.join(output, slug + '-' + width + '-first-screen.png') });
        await scenario(page, record, width);
        await page.screenshot({ path: path.join(output, slug + '-' + width + '-after.png') });
        record(width + ' ' + route + ' no horizontal scroll', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (width === 375) {
          const unlabelled = await page.evaluate(() => [...document.querySelectorAll('.ref-table tbody td')].filter((cell) => !cell.dataset.label).length);
          record(width + ' ' + route + ' every table cell keeps its label', unlabelled === 0);
        }
        record(width + ' ' + route + ' no page errors', errors.length === 0);
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  const failed = results.filter(([, ok]) => !ok);
  console.log(results.length - failed.length + ' of ' + results.length + ' checks passed');
  if (failed.length) process.exit(1);
})().catch((error) => { console.error(error); process.exit(1); });

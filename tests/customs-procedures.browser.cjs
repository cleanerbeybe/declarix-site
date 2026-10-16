// Browser check for the special-procedure and identifier reference pages (lane ref-guides, iteration 1).
// Serves dist/, opens every page at 1280 and 375 wide and asserts: no horizontal scroll, the jump-link
// row works, phone table cards keep their column labels, the old H1 stays as the subhead, and the
// bonded-warehouse additions (postponed VAT row, 3PL section, importer box, broker bridge) are visible.
// Run after `npm run build`: node tests/customs-procedures.browser.cjs
const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '../dist');
const output = process.env.SHOTS_DIR || path.join(__dirname, '../output/customs-procedures');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

const pages = {
  '/customs-reference/bonded-warehouse/': 'Bonded warehouse: pay duty when the stock leaves, not when it lands.',
  '/customs-reference/end-use-relief/': 'End use relief: zero or reduced duty for goods with a job to do.',
  '/customs-reference/temporary-admission/': 'Temporary admission: bring it in, use it, send it back duty-free.',
  '/customs-reference/returned-goods-relief/': 'Returned goods relief: bring your own goods home without paying twice.',
  '/customs-reference/inward-processing-relief/': 'Inward processing: import, make, export, and pay no duty on the way through.',
  '/customs-reference/outward-processing-relief/': 'Outward processing: pay duty on the repair, not on the whole machine.',
  '/customs-reference/mrn/': 'MRN: the reference that follows your goods through every customs step.',
  '/customs-reference/c88-single-administrative-document/': 'C88: from numbered boxes to CDS data elements.',
  '/customs-reference/c285-form/': 'C285: get overpaid import duty back.',
  '/customs-reference/commodity-code/': 'Commodity code: the number that sets the duty.',
};

const toolLinks = {
  '/customs-reference/c285-form/': ['/tools/import-duty-repayment-checker/', 'Check your refund route free'],
  '/customs-reference/mrn/': ['/tools/mrn-checker/', 'Check an MRN now'],
  '/customs-reference/commodity-code/': ['/tools/commodity-code-checker/', 'Find a code with the free checker'],
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
  const browser = await chromium.launch({ headless: true });
  const checks = [];
  const record = (name, pass) => { assert.ok(pass, name); checks.push(name); };
  try {
    for (const [route, oldH1] of Object.entries(pages)) {
      for (const width of [1280, 375]) {
        const context = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 900 } });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(origin + route);
        const label = `${width} ${route}`;
        record(`${label} no horizontal scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
        record(`${label} old H1 kept as subhead`, (await page.locator('.ref-subhead').innerText()).trim() === oldH1);
        const jumps = page.locator('.ref-jump a');
        record(`${label} jump links`, (await jumps.count()) >= 5);
        // Every jump link points at an element on the page.
        const targets = await jumps.evaluateAll((links) => links.every((link) => document.querySelector(link.getAttribute('href'))));
        record(`${label} jump targets exist`, targets);
        await page.locator('.ref-jump a', { hasText: 'Sources' }).click();
        await page.waitForTimeout(150);
        record(`${label} jump row stays on screen`, await page.locator('.ref-jump').evaluate((nav) => nav.getBoundingClientRect().top >= -1 && nav.getBoundingClientRect().top < 5));
        if (width === 375 && (await page.locator('.ref-table').count())) {
          const labelled = await page.locator('.ref-table tbody th').first().evaluate((cell) => getComputedStyle(cell, '::before').content);
          record(`${label} table row header keeps its label`, labelled && labelled !== 'none' && labelled !== 'normal');
        }
        if (toolLinks[route]) {
          const [href, text] = toolLinks[route];
          record(`${label} tool link`, (await page.locator(`a[href="${href}"]`, { hasText: text }).count()) >= 1);
        }
        if (route === '/customs-reference/bonded-warehouse/') {
          const body = await page.locator('main').innerText();
          record(`${label} PVA row`, body.includes('If you use postponed VAT accounting: £9,600 duty not paid on arrival, plus £1,920 duty never paid on the re-exported share.'));
          record(`${label} 27,520 kept`, body.includes('£27,520 not paid on arrival'));
          record(`${label} 3PL section`, body.includes('Using a 3PL’s public warehouse'));
          record(`${label} importer box`, body.includes('Importers: next step'));
          record(`${label} broker bridge`, body.includes('Brokers who file warehouse entries for clients like yours use Declarix to prepare them faster.'));
          record(`${label} warehouse types wording`, body.includes('Public warehouse (a 3PL stores your goods) — type R / CW1; private warehouse (you run it) — type U / CWP'));
        }
        await page.goto(origin + route);
        await page.screenshot({ path: path.join(output, route.split('/').filter(Boolean).join('-') + '-' + width + '.png'), fullPage: false });
        record(`${label} no page errors`, errors.length === 0);
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`Customs procedure browser checks passed: ${checks.length}`);
})().catch((error) => { console.error(error); process.exit(1); });

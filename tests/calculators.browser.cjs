// Browser checks for the three calculators: duty/VAT workpaper, declaration cost calculator, ROI calculator.
// Covers ICP issues S1 (tool on the first phone screen), S4 (visible "COPIED ✓"), S5 (labelled table cards),
// DV1-DV3 (plain words, "enter 0" hints, per-unit costs) and DE3 (loaded clerk cost + net monthly saving).
const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '../dist');
const output = process.env.CALC_SHOTS || path.join(__dirname, '../output/calculators');
fs.mkdirSync(output, { recursive: true });
const DUTY = '/tools/customs-value-import-duty-vat-calculator/';
const COST = '/tools/customs-declaration-cost-calculator/';
const ROI = '/roi-calculator/';
const types = { '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.js': 'text/javascript' };

(async () => {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(root, pathname, pathname.endsWith('/') ? 'index.html' : '');
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    try { const data = fs.readFileSync(file); res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(data); } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true });
  const checks = [];
  const record = (name, pass) => { assert.ok(pass, name); checks.push(name); };
  const firstScreen = async (page, selector, height) => {
    const box = await page.locator(selector).boundingBox();
    return box && box.y >= 0 && box.y + box.height <= height;
  };
  try {
    for (const [width, height] of [[375, 812], [1280, 800]]) {
      const context = await browser.newContext({ viewport: { width, height } });
      await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.addInitScript(() => { try { delete Navigator.prototype.share; } catch {} });

      // Duty and VAT calculator.
      await page.goto(origin + DUTY);
      record(`${width} duty: H1`, (await page.locator('h1').textContent()).trim() === 'Import duty and VAT calculator UK');
      record(`${width} duty: first input on first screen`, await firstScreen(page, '#goods-amount', height));
      record(`${width} duty: no horizontal scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      record(`${width} duty: three "enter 0" hints`, (await page.locator('.valuation-hint', { hasText: 'Most buyers who only pay the supplier for the goods enter 0 here.' }).count()) === 3);
      record(`${width} duty: plain words beside ad valorem`, (await page.locator('label[for="duty-rate"]').textContent()).includes('Duty rate (%) — ad valorem'));
      if (width === 1280) {
        const form = await page.locator('#value-duty-form').boundingBox();
        const answer = await page.locator('.tool-first-answer').boundingBox();
        record('1280 duty: direct answer beside the tool', answer.x > form.x + form.width - 2 && answer.y < form.y + 200);
      } else {
        const result = await page.locator('#valuation-workpaper').boundingBox();
        const answer = await page.locator('.tool-first-answer').boundingBox();
        record('375 duty: direct answer under the tool', answer.y > result.y + result.height - 2);
      }
      await page.screenshot({ path: path.join(output, `duty-${width}-first-screen.png`) });
      const dutyInputs = { 'goods-amount': 10000, 'fx-rate': 1.1564, freight: 500, insurance: 100, additions: 0, deductions: 0, 'duty-rate': 4, 'other-import-charges': 0, 'incidental-expenses': 150, 'vat-rate': 20 };
      for (const [id, value] of Object.entries(dutyInputs)) await page.locator('#' + id).fill(String(value));
      await page.getByRole('button', { name: 'BUILD MY PLANNING SCENARIO' }).click();
      record(`${width} duty: worked example A total`, (await page.locator('#tax-duty-total').textContent()) === '£2,323.39');
      record(`${width} duty: per-unit hidden without units`, await page.locator('#value-duty-per-unit').isHidden());
      await page.locator('#units').fill('1200');
      await page.getByRole('button', { name: 'BUILD MY PLANNING SCENARIO' }).click();
      record(`${width} duty: per-unit shown`, await page.locator('#value-duty-per-unit').isVisible());
      record(`${width} duty: duty + VAT per unit`, (await page.locator('#duty-vat-per-unit').textContent()) === '£1.94');
      record(`${width} duty: landed cost per unit`, (await page.locator('#landed-cost-per-unit').textContent()) === '£9.77');
      const share = page.locator('#share-value-duty');
      await share.click();
      await page.waitForTimeout(150);
      record(`${width} duty: visible COPIED ✓`, (await share.textContent()) === 'COPIED ✓');
      record(`${width} duty: share link carries units`, (await page.evaluate(() => navigator.clipboard.readText())).includes('u=1200'));
      await page.screenshot({ path: path.join(output, `duty-${width}-result.png`) });
      await page.waitForTimeout(2100);
      record(`${width} duty: label returns`, (await share.textContent()) === 'SHARE THIS SCENARIO');
      record(`${width} duty: no horizontal scroll with result`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (width === 375) {
        const cell = page.locator('.duty-origin-table tbody td').first();
        const before = await cell.evaluate((el) => getComputedStyle(el, '::before').content);
        record('375 duty: origin table cards keep labels', before.includes('Trade agreement'));
        await page.locator('#duty-by-origin').screenshot({ path: path.join(output, 'duty-375-origin-cards.png') });
      }
      for (const heading of ['How is UK import duty calculated?', 'Import VAT: pay now or postpone (PVA)', 'Goods under £135 and gifts', 'Duty from China, the USA and the EU']) {
        record(`${width} duty: H2 ${heading}`, (await page.locator('h2', { hasText: heading }).count()) === 1);
      }
      await page.goto(origin + DUTY + '?g=10000&x=1.1564&f=500&i=100&a=0&d=0&r=4&o=0&e=150&v=20&u=1200');
      record(`${width} duty: shared units restore`, (await page.locator('#landed-cost-per-unit').textContent()) === '£9.77');

      // Customs declaration cost calculator.
      await page.goto(origin + COST);
      record(`${width} cost: H1`, (await page.locator('h1').textContent()).trim() === 'How much does a customs declaration cost? Calculate yours.');
      record(`${width} cost: subhead keeps the old H1`, (await page.locator('.tool-subhead').textContent()).trim() === 'Calculate your customs desk cost per declaration.');
      record(`${width} cost: first input on first screen`, await firstScreen(page, '#declarations', height));
      record(`${width} cost: no horizontal scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: path.join(output, `cost-${width}-first-screen.png`) });
      const copy = page.locator('#share-model');
      await copy.click();
      await page.waitForTimeout(150);
      record(`${width} cost: visible COPIED ✓`, (await copy.textContent()) === 'COPIED ✓');
      await page.waitForTimeout(2100);
      record(`${width} cost: label returns`, (await copy.textContent()) === 'COPY SHARE LINK');
      record(`${width} cost: drivers H2`, (await page.locator('h2', { hasText: 'What drives the cost per declaration' }).count()) === 1);
      record(`${width} cost: clearance fee FAQ`, (await page.locator('summary', { hasText: 'Is the clearance fee separate from duty and VAT?' }).count()) === 1);
      if (width === 375) {
        const before = await page.locator('.cost-drivers-table tbody td').first().evaluate((el) => getComputedStyle(el, '::before').content);
        record('375 cost: driver table cards keep labels', before.includes('Why it moves the cost'));
        await page.locator('#what-drives-the-cost').screenshot({ path: path.join(output, 'cost-375-driver-cards.png') });
      }

      // ROI calculator.
      await page.goto(origin + ROI);
      record(`${width} roi: first input on first screen`, await firstScreen(page, '#volume', height));
      record(`${width} roi: no horizontal scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: path.join(output, `roi-${width}-first-screen.png`) });
      await page.locator('#volume').fill('1100');
      await page.locator('#currentMinutes').fill('22');
      await page.locator('#withDeclarixMinutes').fill('9');
      await page.locator('#loadedCost').fill('38000');
      await page.getByRole('button', { name: /SHOW MY CAPACITY/ }).click();
      const roiText = await page.locator('#roi-results').textContent();
      // 1100 × 13 ÷ 60 = 238.33 h × £38,000 ÷ 1,740 = £5,205 − Team £4,400 = £805.
      record(`${width} roi: net monthly saving after the plan fee`, roiText.includes('Net monthly saving after the plan fee') && roiText.includes('£805'));
      record(`${width} roi: plan fee from pricing`, roiText.includes('£4,400 / month'));
      await page.locator('#roi-results').screenshot({ path: path.join(output, `roi-${width}-result.png`) });
      await page.locator('#volume').fill('3500');
      await page.getByRole('button', { name: /SHOW MY CAPACITY/ }).click();
      record(`${width} roi: Quoted label unchanged`, (await page.locator('#roi-results h3').textContent()) === 'Quoted');
      record(`${width} roi: formula H2`, (await page.locator('h2', { hasText: 'How the capacity case is worked out' }).count()) === 1);
      record(`${width} roi: three FAQs`, (await page.locator('.roi-faq-item').count()) === 3);
      record(`${width} roi: links the cost calculator`, (await page.locator(`a[href="${COST}"]`).count()) >= 1);
      record(`${width} no console runtime errors`, errors.length === 0);
      await context.close();
    }
    fs.writeFileSync(path.join(output, 'BROWSER_TESTS.json'), JSON.stringify({ status: 'PASS', checks: checks.length, names: checks }, null, 2));
    console.log(JSON.stringify({ status: 'PASS', checks: checks.length }));
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });

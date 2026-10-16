// Browser check for the software and comparison pages (iteration 1, 16 Oct 2026).
// Serves dist/, opens each page at phone (375×812) and desktop (1280×900) width and asserts:
// no horizontal scroll, the first-screen element in the first viewport, the new H2s, the kept subheads,
// the internal links and an FAQPage that matches the visible FAQ.
// Run after `npm run build`: node tests/software-pages.browser.cjs  (SHOTS_DIR=… to save screenshots elsewhere)
const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '../dist');
const output = process.env.SHOTS_DIR || path.join(__dirname, '../output/software-pages');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png' };

const pages = {
  '/best-customs-software/': {
    firstScreen: '.top-picks li:first-child',
    faqItem: '.faq-item',
    text: ['The best customs declaration software for UK desks in 2026.', 'How we compared', 'Is there free CDS software?', 'How much does customs software cost in the UK?'],
    links: ['/customs-entry-checking-software/', '/tools/', '/pricing/'],
  },
  '/customs-entry-checking-software/': {
    firstScreen: 'h1',
    faqItem: '.uc-faq',
    text: ['Customs data extraction: invoices, packing lists, bills of lading', 'Customs document automation vs entry checking: why you need both', 'What is an OCR customs data extractor?'],
    links: ['/features/cds-preflight/', '/guides/customs-data-validation/', '/best-customs-software/'],
  },
  '/compare/': {
    firstScreen: '.hub-matrix h2',
    desktopFirstScreen: '.matrix-table tbody tr:first-child',
    faqItem: '.faq-item',
    text: ['Compare customs workflows and software', 'Eight UK customs tools on six criteria.', 'Customs clearance vs customs declaration software'],
    links: ['/alternatives/', '/best-customs-software/'],
  },
  '/compare/declarix-vs-descartes-e-customs/': {
    firstScreen: 'h1',
    faqItem: '.faq-item',
    text: ['Descartes e-Customs alternatives for UK brokers', 'What does Descartes e-Customs cost?', 'Does Descartes e-Customs have a free version?'],
    links: ['/alternatives/', '/best-customs-software/', '/pricing/'],
  },
  '/compare/declarix-vs-icustoms/': {
    firstScreen: 'h1',
    faqItem: '.faq-item',
    text: ['iCustoms pricing vs Declarix pricing', 'Is iCustoms free?', 'Who uses iCustoms?', '£9,000 / month'],
    links: ['/alternatives/icustoms/', '/pricing/'],
  },
  '/alternatives/icustoms/': {
    firstScreen: 'h1',
    faqItem: '.faq-item',
    text: ['iCustoms alternatives'],
    links: ['/compare/declarix-vs-icustoms/'],
    noFaqSchema: true,
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
  const browser = await chromium.launch({ headless: true });
  const checks = [];
  const record = (name, pass) => { assert.ok(pass, name); checks.push(name); };
  try {
    for (const [route, spec] of Object.entries(pages)) {
      for (const [width, height] of [[375, 812], [1280, 900]]) {
        const context = await browser.newContext({ viewport: { width, height } });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(origin + route);
        const label = `${width} ${route}`;
        record(`${label} no page errors`, errors.length === 0);
        record(`${label} no horizontal scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
        const first = width > 760 && spec.desktopFirstScreen ? spec.desktopFirstScreen : spec.firstScreen;
        const box = await page.locator(first).first().boundingBox();
        record(`${label} ${first} in first viewport`, box && box.y + Math.min(box.height, 40) <= height);
        const body = await page.locator('main').innerText();
        for (const phrase of spec.text) record(`${label} shows "${phrase}"`, body.includes(phrase));
        for (const href of spec.links) record(`${label} links ${href}`, (await page.locator(`main a[href="${href}"]`).count()) > 0);
        const schema = await page.evaluate(() => [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((node) => { const json = JSON.parse(node.textContent); return json['@graph'] || [json]; }));
        const faq = schema.find((node) => node['@type'] === 'FAQPage');
        if (spec.noFaqSchema) record(`${label} has no FAQPage`, !faq);
        else {
          const visible = await page.locator(spec.faqItem).count();
          record(`${label} FAQPage matches ${visible} visible questions`, faq && faq.mainEntity.length === visible);
        }
        await page.screenshot({ path: path.join(output, `${route.split('/').filter(Boolean).join('-') || 'home'}-${width}.png`), fullPage: false });
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`Software page browser checks passed: ${checks.length}`);
})().catch((error) => { console.error(error); process.exit(1); });

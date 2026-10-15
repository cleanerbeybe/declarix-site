const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../dist');
const output = path.resolve(process.env.EORI_QA_OUTPUT || path.join(__dirname, '../output/eori'));
fs.mkdirSync(output, { recursive: true });
const html = fs.readFileSync(path.join(root, 'tools/eori-checker/index.html'), 'utf8');
const eori = 'GB123456789012';
const provider = 'HMRC Check an EORI Number API';
const base = { normalized_eori: eori, checked_at: '2026-10-08T09:00:00+00:00', format: { status: 'valid' }, registry: { status: 'valid', provider }, source: { name: provider } };
const clone = () => JSON.parse(JSON.stringify(base));
const specs = [
  { id: 'valid_details', state: 'registry_valid', details: true },
  { id: 'valid_no_details', state: 'registry_valid', details: false },
  { id: 'invalid', state: 'registry_invalid' },
  { id: 'format_invalid', input: 'GB123', state: 'format_invalid' },
  { id: 'xi', input: 'XI123456789012', state: 'unsupported', eu: true },
  { id: 'eu', input: 'DE123456789012', state: 'unsupported', eu: true },
  ...['unavailable', 'rate_limited', 'http503', 'malformed_json', 'malformed_contract', 'wrong_provider', 'missing_timestamp', 'network_failure', 'mismatch_valid', 'mismatch_invalid', 'missing_identifier', 'numeric_identifier', 'null_identifier'].map(id => ({ id, state: 'unavailable' })),
  { id: 'pasted_separators', input: ' gb-1234–5678—9012 ', state: 'registry_valid' },
  { id: 'full_width', input: 'ＧＢ１２３４５６７８９０１２', state: 'registry_valid' },
  { id: 'unicode_whitespace', input: 'GB\u00851234\u001c5678\u001f9012', state: 'registry_valid' },
  { id: 'xss', state: 'registry_valid', details: true },
  { id: 'blank', input: '', state: null },
];
function payload(s) {
  const p = clone();
  if (s.id === 'valid_details') p.registry.company_details = { trader_name: 'SYNTHETIC QA TRADER', address: { street_and_number: '1 Test Street', city_name: 'Test City', postcode: 'AA1 1AA' } };
  if (s.id === 'invalid' || s.id === 'mismatch_invalid') p.registry.status = 'invalid';
  if (s.id === 'format_invalid' || s.id === 'xi' || s.id === 'eu') {
    p.normalized_eori = s.input;
    p.format.status = s.id === 'format_invalid' ? 'invalid' : 'not_supported';
    p.registry.status = 'not_checked';
  }
  if (s.id === 'unavailable') p.registry = { status: 'unavailable', message: 'Synthetic provider outage' };
  if (s.id === 'wrong_provider') p.registry.provider = 'Untrusted fixture';
  if (s.id === 'missing_timestamp') delete p.checked_at;
  if (s.id.startsWith('mismatch_')) p.normalized_eori = 'GB123456789099';
  if (s.id === 'missing_identifier') delete p.normalized_eori;
  if (s.id === 'numeric_identifier') p.normalized_eori = 123456789012;
  if (s.id === 'null_identifier') p.normalized_eori = null;
  if (s.id === 'xss') p.registry.company_details = { trader_name: '<img src=x onerror="window.qaXss=true">', address: { street_and_number: '<script>window.qaXss=true</script>', city_name: 'Test', postcode: 'AA1 1AA' } };
  return p;
}
const checks = [];
const observations = [];
function record(name, value) { checks.push({ name, pass: Boolean(value) }); assert.ok(value, name); }
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--disable-background-networking'] });
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
      for (const s of specs) {
        const page = await context.newPage();
        const requests = [], errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.addInitScript(() => {
          window.qaFetchOptions = []; window.qaXss = false;
          const original = window.fetch;
          window.fetch = (url, options = {}) => {
            window.qaFetchOptions.push({ url: String(url), credentials: options.credentials, cache: options.cache, method: options.method, body: options.body });
            return original(url, options);
          };
        });
        // Every browser request is fulfilled or aborted locally. No live registry/analytics call.
        await page.route('**/*', async route => {
          const r = route.request(), u = new URL(r.url());
          requests.push({ url: r.url(), method: r.method(), body: r.postData(), served_locally: true });
          if (u.pathname === '/tools/eori-checker/') return route.fulfill({ contentType: 'text/html', body: html.replace('<body>', '<body><div style="background:#ffeda1;color:#111;padding:12px;font:14px monospace;text-align:center">SYNTHETIC OFFLINE CLIENT QA, NOT A LIVE REGISTRY RESULT</div>') });
          if (['/static-routes.css', '/eori-checker.css'].includes(u.pathname)) return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(path.join(root, u.pathname.slice(1))) });
          if (u.pathname === '/public/v1/eori/check') {
            if (s.id === 'network_failure') return route.abort('failed');
            const status = s.id === 'rate_limited' ? 429 : s.id === 'http503' ? 503 : 200;
            const body = s.id === 'malformed_json' ? '{bad json' : JSON.stringify(s.id === 'malformed_contract' ? {} : s.id === 'rate_limited' ? { message: 'Synthetic rate limit' } : payload(s));
            return route.fulfill({ status, contentType: 'application/json', headers: { 'Cache-Control': 'no-store' }, body });
          }
          return route.fulfill({ status: 204, body: '' });
        });
        const input = s.input === undefined ? eori : s.input;
        await page.goto('https://fixture.invalid/tools/eori-checker/', { waitUntil: 'load' });
        await page.locator('#eori-number').fill(input);
        await page.locator('#eori-submit').click();
        if (s.state) await page.waitForFunction(() => !document.getElementById('eori-result').hidden && !document.getElementById('eori-submit').disabled);
        const snap = await page.evaluate(() => ({
          className: document.getElementById('eori-result').className, hidden: document.getElementById('eori-result').hidden,
          title: document.getElementById('eori-result-heading').textContent, status: document.getElementById('eori-status').textContent,
          ariaLive: document.getElementById('eori-status').getAttribute('aria-live'), normalized: document.getElementById('eori-normalized').textContent,
          disabled: document.getElementById('eori-submit').disabled, detailsHidden: document.getElementById('eori-company-details').hidden,
          euHidden: document.getElementById('eori-result-eu').hidden, actionsHidden: document.getElementById('eori-result-actions').hidden,
          overflow: document.documentElement.scrollWidth > innerWidth, analytics: window.dataLayer || [],
          storage: JSON.stringify({ ...sessionStorage, ...localStorage }), url: location.href, fetchOptions: window.qaFetchOptions, xss: window.qaXss,
        }));
        const prefix = `${width} ${s.id}`;
        record(prefix + ' separate result state', s.state ? snap.className.split(' ').includes('is-' + s.state) : snap.hidden);
        record(prefix + ' button restored', !snap.disabled);
        record(prefix + ' no horizontal scroll', !snap.overflow);
        record(prefix + ' no input in URL', !input || !snap.url.includes(input.trim()));
        record(prefix + ' no input in analytics or storage', !input || (!JSON.stringify(snap.analytics).includes(input.trim()) && !snap.storage.includes(input.trim()) && !JSON.stringify(snap.analytics).includes(eori) && !snap.storage.includes(eori)));
        record(prefix + ' no script execution', !snap.xss);
        record(prefix + ' no runtime error', errors.length === 0);
        record(prefix + ' polite live region', snap.ariaLive === 'polite');
        if (s.state) record(prefix + ' final announcement matches heading', snap.status === snap.title);
        if (s.state === 'unavailable') {
          record(prefix + ' no stale checking announcement', snap.status !== 'Checking one GB EORI number with HMRC.');
          record(prefix + ' no result actions', snap.actionsHidden);
          record(prefix + ' unavailable not registry verdict', !snap.className.includes('is-registry_valid') && !snap.className.includes('is-registry_invalid'));
        }
        if (s.id.startsWith('mismatch_') || s.id.endsWith('_identifier')) record(prefix + ' no untrusted identifier shown', snap.normalized === 'Not checked');
        if (typeof s.details === 'boolean') record(prefix + ' public details visibility', snap.detailsHidden === !s.details);
        if (s.eu) record(prefix + ' EU handoff shown', !snap.euHidden);
        const api = requests.filter(r => new URL(r.url).pathname === '/public/v1/eori/check');
        record(prefix + ' one candidate request', api.length === (s.id === 'blank' ? 0 : 1));
        if (api.length) {
          record(prefix + ' exact single candidate POST', api[0].method === 'POST' && Object.keys(JSON.parse(api[0].body)).join() === 'eori' && JSON.parse(api[0].body).eori === input.trim());
          const options = snap.fetchOptions.find(r => r.url.endsWith('/public/v1/eori/check'));
          record(prefix + ' omit credentials and no-store', options.credentials === 'omit' && options.cache === 'no-store');
        }
        if (['valid_details', 'unavailable', 'mismatch_valid'].includes(s.id)) await page.screenshot({ path: path.join(output, `${s.id}-${width}.png`), fullPage: true });
        observations.push({ width, scenario: s.id, snapshot: snap, requests });
        await page.close();
      }
      await context.close();
    }
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(output, 'BROWSER_TESTS.json'), JSON.stringify({ status: checks.every(x => x.pass) && observations.length === specs.length * 2 ? 'PASS' : 'FAIL', checks: checks.length, passed: checks.filter(x => x.pass).length, scenario_count: specs.length, widths: [1440, 375], html_sha256: crypto.createHash('sha256').update(html).digest('hex'), environment: 'Actual local built page; all browser requests intercepted locally; synthetic registry fixtures only; not live registry/provider acceptance', results: checks }, null, 2) + '\n');
    fs.writeFileSync(path.join(output, 'OBSERVATIONS.json'), JSON.stringify(observations, null, 2) + '\n');
  }
  console.log(JSON.stringify({ status: 'PASS', checks: checks.length, scenarios: specs.length, widths: [1440, 375] }));
})().catch(e => { console.error(e); process.exitCode = 1; });

import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { eoriChecker, renderEoriChecker } from '../scripts/eori-checker.mjs'

const eori = 'GB123456789012'
const provider = 'HMRC Check an EORI Number API'
const fixture = (overrides = {}) => ({
  normalized_eori: eori,
  checked_at: '2026-10-08T09:00:00+00:00',
  format: { status: 'valid' },
  registry: { status: 'valid', provider },
  source: { name: provider },
  ...overrides,
})
const html = renderEoriChecker(eoriChecker, {
  origin: 'https://fixture.invalid', company: 'Declarix Limited', contact: 'test@example.invalid', companyNumber: 'TEST',
}, { apiOrigin: 'https://fixture.invalid', navHtml: '', webmasterHtml: '', posthogKey: '', posthogHost: 'https://fixture.invalid' })
const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1]

// Execute the actual rendered client. No DOM library, registry or network is used.
function client(respond, inputValue = eori) {
  const nodes = new Map()
  const element = (id) => {
    if (!nodes.has(id)) {
      const node = {
        value: '', textContent: '', hidden: true, disabled: false, className: '', handlers: {},
        addEventListener(type, handler) { this.handlers[type] = handler },
        scrollIntoView() {}, setCustomValidity(value) { this.validityMessage = value }, reportValidity() {},
      }
      node.classList = { add(name) { node.className += ' ' + name } }
      nodes.set(id, node)
    }
    return nodes.get(id)
  }
  const requests = []
  const timers = new Map()
  const storage = new Map()
  const window = { setTimeout(fn) { timers.set(1, fn); return 1 }, clearTimeout(id) { timers.delete(id) } }
  const context = {
    document: { getElementById: element, querySelectorAll: () => [] }, window,
    location: { search: '', pathname: eoriChecker.path },
    sessionStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    crypto: { randomUUID: () => 'synthetic-unit-id' }, URLSearchParams, AbortController,
    navigator: {}, matchMedia: () => ({ matches: true }),
    fetch: async (url, options) => { requests.push({ url, options }); return respond(url, options) },
  }
  vm.runInNewContext(script, context)
  element('eori-number').value = inputValue
  return {
    element, requests, timers, storage, window,
    async submit() { await element('eori-form').handlers.submit({ preventDefault() {} }) },
  }
}
const response = (payload, status = 200) => ({ status, ok: status >= 200 && status < 300, json: async () => payload })
function assertUnavailable(c) {
  assert.match(c.element('eori-result').className, /\bis-unavailable\b/)
  assert.equal(c.element('eori-status').textContent, 'HMRC did not return a current answer.')
  assert.equal(c.element('eori-status').textContent, c.element('eori-result-heading').textContent)
  assert.equal(c.element('eori-submit').disabled, false)
  assert.equal(c.element('eori-submit').textContent, 'CHECK WITH HMRC')
  assert.equal(c.element('eori-result-actions').hidden, true)
  assert.equal(c.timers.size, 0)
  assert.equal(c.window.dataLayer.at(-1).event, 'eori_check_unavailable')
}

for (const [name, respond] of [
  ['HTTP 429', () => response({ message: 'Synthetic rate limit' }, 429)],
  ['HTTP 429 malformed JSON', () => ({ ...response(null, 429), json: async () => { throw new SyntaxError('fixture') } })],
  ['HTTP 503', () => response({}, 503)],
  ['malformed JSON', () => ({ ...response(null), json: async () => { throw new SyntaxError('fixture') } })],
  ['malformed contract', () => response({})],
  ['wrong provider', () => response(fixture({ registry: { status: 'valid', provider: 'fixture wrong provider' } }))],
  ['missing timestamp', () => response(fixture({ checked_at: undefined }))],
  ['network failure', () => { throw new TypeError('fixture network failure') }],
  ['request aborted', () => { throw new DOMException('fixture timeout', 'AbortError') }],
  ['registry unavailable', () => response(fixture({ registry: { status: 'unavailable', message: 'Synthetic outage' } }))],
]) {
  test(`${name}: final accessible failure and retry`, async () => {
    const c = client(respond)
    await c.submit()
    assertUnavailable(c)
  })
}

for (const [name, normalized_eori] of [
  ['different number', 'GB123456789099'], ['missing', undefined], ['null', null],
  ['numeric', 123456789012], ['object', { value: eori }], ['empty', ''],
  ['noncanonical response', 'gb 123456789012'], ['punctuation', 'GB123456789012.'],
]) {
  for (const status of ['valid', 'invalid']) {
    test(`${name} response identifier never renders a ${status} verdict`, async () => {
      const c = client(() => response(fixture({ normalized_eori, registry: { status, provider } })))
      await c.submit()
      assertUnavailable(c)
      assert.equal(c.element('eori-normalized').textContent, 'Not checked')
    })
  }
}

for (const input of [
  eori, 'gb123456789012', '  gb 1234 5678 9012  ', 'GB-1234–5678—9012',
  'ＧＢ１２３４５６７８９０１２', 'GB\t1234\n5678\r9012', 'GB\u00851234\u001c5678\u001f9012',
  'GB\u00a01234\u20095678\u30009012',
]) {
  test(`matching canonical response accepts pasted input ${JSON.stringify(input)}`, async () => {
    const c = client(() => response(fixture()), input)
    await c.submit()
    assert.match(c.element('eori-result').className, /\bis-registry_valid\b/)
    assert.equal(c.element('eori-normalized').textContent, eori)
    assert.equal(c.element('eori-status').textContent, c.element('eori-result-heading').textContent)
    assert.equal(c.requests.length, 1)
    const { options } = c.requests[0]
    assert.equal(JSON.parse(options.body).eori, input.trim())
    assert.equal(options.credentials, 'omit')
    assert.equal(options.cache, 'no-store')
    assert.equal(options.method, 'POST')
    assert.equal(c.element('eori-submit').disabled, false)
    assert.equal(c.timers.size, 0)
    assert.equal(JSON.stringify(c.window.dataLayer).includes(eori), false)
    assert.equal(JSON.stringify([...c.storage]).includes(eori), false)
  })
}

for (const input of ['GB123456789012.', 'GB/123456789012', 'GB\ufeff123456789012']) {
  test(`normalisation does not erase unsupported punctuation ${JSON.stringify(input)}`, async () => {
    const c = client(() => response(fixture()), input)
    await c.submit()
    assertUnavailable(c)
  })
}

test('matching invalid, local-invalid and XI replies retain separate results', async () => {
  for (const [input, payload, state] of [
    [eori, fixture({ registry: { status: 'invalid', provider } }), 'registry_invalid'],
    ['GB123', fixture({ normalized_eori: 'GB123', format: { status: 'invalid' }, registry: { status: 'not_checked' } }), 'format_invalid'],
    ['xi 123456789012', fixture({ normalized_eori: 'XI123456789012', format: { status: 'not_supported' }, registry: { status: 'not_checked' } }), 'unsupported'],
  ]) {
    const c = client(() => response(payload), input)
    await c.submit()
    assert.match(c.element('eori-result').className, new RegExp(`\\bis-${state}\\b`))
    assert.equal(c.element('eori-status').textContent, c.element('eori-result-heading').textContent)
  }
})

test('response matching uses the submitted snapshot, not later edited input', async () => {
  let finish
  const c = client(() => new Promise((resolve) => { finish = resolve }))
  const pending = c.submit()
  assert.equal(c.element('eori-submit').disabled, true)
  c.element('eori-number').value = 'GB123456789099'
  await c.submit()
  assert.equal(c.requests.length, 1)
  finish(response(fixture()))
  await pending
  assert.match(c.element('eori-result').className, /\bis-registry_valid\b/)
  assert.equal(c.element('eori-normalized').textContent, eori)
})

test('Q6 record keeps its four 12 October check stamps; the 15 October guide adds two sources', () => {
  assert.equal(eoriChecker.reviewedOn, '2026-10-16')
  assert.equal(eoriChecker.sources.length, 6)
  assert.deepEqual(eoriChecker.sources.slice(0, 4).map(source => source.checked), Array(4).fill('12 OCTOBER 2026'))
  assert.deepEqual(eoriChecker.sources.slice(4).map(source => source.checked), Array(2).fill('15 OCTOBER 2026'))
})

test('Q6 renderer agrees on visible, structured and footer review dates', () => {
  assert.match(html, /HMRC SOURCES REVIEWED<\/span><strong>16 OCT 2026 · EVERY RESULT IS LIVE<\/strong>/)
  assert.match(html, /REVIEWED 2026-10-16/)
  assert.equal((html.match(/CHECKED 12 OCTOBER 2026/g) || []).length, 4)
  assert.equal((html.match(/CHECKED 15 OCTOBER 2026/g) || []).length, 2)
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  const app = data['@graph'].find(node => node['@type'] === 'WebApplication')
  assert.equal(app.dateModified, eoriChecker.reviewedOn)
})

test('Q6 guidance uses the captured final destination without changing source titles', () => {
  assert.equal(eoriChecker.sources[1].url, 'https://www.gov.uk/guidance/economic-operators-registration-and-identification-eori/finding-and-checking-an-eori-number')
  assert.equal(eoriChecker.sources[1].title, 'Finding and checking an EORI')
  assert.match(html, /href="https:\/\/www.gov.uk\/guidance\/economic-operators-registration-and-identification-eori\/finding-and-checking-an-eori-number"/)
})

test('Q6 source register separates our check date from publisher update dates', () => {
  const register = readFileSync(new URL('../docs/data/2026-07-17-eori-checker-public-release/SOURCE-REGISTER.md', import.meta.url), 'utf8')
  assert.match(register, /Checked on \*\*12 October 2026\*\*/)
  assert.match(register, /finding-and-checking-an-eori-number/)
  assert.match(register, /2 October 2026/)
  assert.match(register, /10 September 2025/)
  assert.match(register, /retrieval\/review date/)
})

test('failure followed by retry never retains stale result details', async () => {
  let attempt = 0
  const c = client(() => ++attempt === 1 ? response(fixture()) : response({}, 503))
  await c.submit()
  assert.match(c.element('eori-result').className, /\bis-registry_valid\b/)
  await c.submit()
  assertUnavailable(c)
  assert.equal(c.element('eori-company-details').hidden, true)
  assert.equal(c.element('eori-normalized').textContent, 'Not checked')
})

test('not confirmed: valid next-job box hidden, next-step block and fixed sub-line shown', async () => {
  const c = client(() => response(fixture({ registry: { status: 'invalid', provider, message: 'HMRC does not confirm this GB EORI as valid.' } })))
  await c.submit()
  assert.match(c.element('eori-result').className, /\bis-registry_invalid\b/)
  assert.equal(c.element('eori-result-heading').textContent, 'HMRC does not confirm this GB EORI as valid.')
  assert.equal(c.element('eori-result-copy').textContent, 'HMRC’s live register has no active GB EORI for this number. Check for a typo, then ask the holder for their HMRC confirmation.')
  assert.equal(c.element('eori-result-actions').hidden, true)
  assert.equal(c.element('eori-result-next').hidden, false)
  assert.equal(c.element('eori-normalized-label').textContent, 'NUMBER WE CHECKED WITH HMRC')
})

test('valid result keeps the next-job box and hides the not-confirmed block', async () => {
  const c = client(() => response(fixture()))
  await c.submit()
  assert.equal(c.element('eori-result-actions').hidden, false)
  assert.equal(c.element('eori-result-next').hidden, true)
})

test('format and XI results say the number was not sent to HMRC', async () => {
  const c = client(() => response(fixture({ normalized_eori: 'XI123456789012', format: { status: 'not_supported' }, registry: { status: 'not_checked' } })), 'XI123456789012')
  await c.submit()
  assert.equal(c.element('eori-normalized-label').textContent, 'NUMBER YOU ENTERED')
  assert.equal(c.element('eori-result-next').hidden, true)
})

test('page copy: tool sits directly under the H1; labels, sections and FAQs from iteration 1', () => {
  assert.equal(eoriChecker.title, 'EORI Checker UK: Check a GB or XI EORI Number Free')
  assert.ok(eoriChecker.title.length <= 60)
  assert.ok(eoriChecker.description.length >= 140 && eoriChecker.description.length <= 155)
  assert.match(html, /<h1 id="eori-h1">EORI number checker: check a GB EORI with HMRC<\/h1>\s*<p class="eori-subhead">Check a GB EORI number with HMRC\.<\/p>\s*<form id="eori-form"/)
  assert.ok(html.indexOf('id="eori-number"') < html.indexOf('class="hero-ledger"'))
  assert.ok(html.indexOf('id="eori-result"') < html.indexOf('DIRECT ANSWER'))
  assert.match(html, /LIVE FROM HMRC’S OFFICIAL CHECK AN EORI NUMBER API \(V1\.0 BETA\)/)
  assert.doesNotMatch(html, /NORMALIZED NUMBER|SOURCE REVIEW</)
  assert.match(html, /<h2 id="eori-format-heading">EORI number format<\/h2>/)
  assert.match(html, /<h2 id="eori-name-heading">Can I find an EORI number by company name\?<\/h2>/)
  assert.match(html, /What does not confirmed mean\?/)
  assert.match(html, /How do I validate an EU EORI number\?/)
  assert.match(html, /class="eori-chips"[\s\S]*?>GB<\/b>[\s\S]*?XI ↗[\s\S]*?EU ↗/)
  assert.match(html, /Number not confirmed\. Fix the party, then check the declaration handoff in minutes\./)
  assert.match(html, /Got the party identifier\. Now check the declaration handoff\./)
  assert.match(html, /data-eori-pack="not_confirmed"/)
  assert.match(html, /data-eori-booking="not_confirmed"/)
  assert.equal((html.match(/data-label="/g) || []).length, 24)
})

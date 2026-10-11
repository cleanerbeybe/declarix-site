import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
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

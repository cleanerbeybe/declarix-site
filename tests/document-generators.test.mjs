import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Script } from 'node:vm'
import {
  computeDocument,
  csvCell,
  documentFromJson,
  documentGenerators,
  documentToCsv,
  documentToJson,
  parseAmount,
  renderDocumentGenerator,
  renderDocumentHtml,
  templateCsv,
  validateDocument,
} from '../scripts/document-generators.mjs'

const invoice = documentGenerators.find((g) => g.schema.kind === 'invoice')
const packing = documentGenerators.find((g) => g.schema.kind === 'packing')
const site = { origin: 'https://getdeclarix.com', company: 'Declarix Limited', companyNumber: '17288258', contact: 'pack@getdeclarix.com' }

test('parseAmount handles blanks, separators and junk', () => {
  assert.equal(parseAmount(''), null)
  assert.equal(parseAmount('  '), null)
  assert.equal(parseAmount('1,234.50'), 1234.5)
  assert.equal(parseAmount('£12'), 12)
  assert.ok(Number.isNaN(parseAmount('12abc')))
  assert.ok(Number.isNaN(parseAmount('1.2.3')))
})

test('invoice arithmetic is exact to the penny on the synthetic example', () => {
  const { lines, totals } = computeDocument(invoice.schema, invoice.schema.example)
  assert.equal(lines[0].lineTotalPence, 274000) // 400 x 6.85
  assert.equal(lines[1].lineTotalPence, 50400) // 1200 x 0.42
  assert.equal(totals.subtotalPence, 324400)
  assert.equal(totals.totalPence, 324400 - 5000 + 32000 + 4500 + 0)
  assert.equal(totals.netMass, 114)
  assert.equal(totals.grossMass, 125.5)
})

test('floating point line totals round to the penny', () => {
  const { lines } = computeDocument(invoice.schema, { header: {}, lines: [{ quantity: '3', unitValue: '19.99' }, { quantity: '0.1', unitValue: '0.2' }] })
  assert.equal(lines[0].lineTotalPence, 5997)
  assert.equal(lines[1].lineTotalPence, 2)
})

test('packing list totals and volume', () => {
  const { lines, totals } = computeDocument(packing.schema, packing.schema.example)
  assert.equal(lines[0].volumeM3, 0.288)
  assert.equal(lines[1].volumeM3, 0.05)
  assert.equal(totals.packages, 5)
  assert.equal(totals.volumeM3, 0.338)
  assert.equal(totals.grossMass, 125.5)
  assert.equal(totals.volumeComplete, true)
})

test('synthetic examples validate with no errors or warnings', () => {
  for (const generator of documentGenerators) {
    const result = validateDocument(generator.schema, generator.schema.example)
    assert.deepEqual(result.errors, [], generator.path)
    assert.deepEqual(result.warnings, [], generator.path)
  }
})

test('blank state reports required fields and a missing line', () => {
  const result = validateDocument(invoice.schema, { header: {}, lines: [] })
  const fields = result.errors.map((e) => e.field)
  for (const id of ['exporterName', 'importerName', 'invoiceNumber', 'invoiceDate', 'currency', 'incoterm', 'incotermPlace', 'signatoryName', 'lines']) {
    assert.ok(fields.includes(id), id)
  }
})

test('invalid values are caught', () => {
  const state = structuredClone(invoice.schema.example)
  state.lines[0].quantity = '0'
  state.lines[0].netMass = '200'
  state.lines[1].origin = 'Germany'
  state.lines[1].commodityCode = '8482'
  state.lines[1].unitValue = 'abc'
  state.header.importerEori = 'GB12345'
  state.header.discount = '999999'
  const { errors, warnings } = validateDocument(invoice.schema, state)
  const messages = errors.map((e) => e.message).join(' | ')
  assert.match(messages, /Line 1: quantity must be more than 0/)
  assert.match(messages, /Line 1: gross mass must be at least the net mass/)
  assert.match(messages, /Line 2: use the two-letter origin code/)
  assert.match(messages, /Line 2: unit price must be a number/)
  assert.match(messages, /Discount cannot be more than the goods subtotal/)
  const warningText = warnings.map((w) => w.message).join(' | ')
  assert.match(warningText, /commodity codes have 6, 8 or 10 digits/)
  assert.match(warningText, /Importer EORI/)
})

test('packing list rules: whole packages, partial dimensions, invoice link', () => {
  const state = structuredClone(packing.schema.example)
  state.lines[0].packageCount = '2.5'
  state.lines[1].height = ''
  state.header.invoiceNumber = ''
  const { errors, warnings } = validateDocument(packing.schema, state)
  assert.ok(errors.some((e) => /whole number/.test(e.message)))
  assert.ok(warnings.some((w) => /length, width and height/.test(w.message)))
  assert.ok(warnings.some((w) => /invoice number/.test(w.message)))
  assert.equal(computeDocument(packing.schema, state).totals.volumeComplete, false)
})

test('EORI shape warnings accept GB, XI and EU forms', () => {
  for (const eori of ['GB123456789000', 'XI123456789000', 'GB123456789012345', 'DE1234567', 'FR12345678901234']) {
    const state = structuredClone(invoice.schema.example)
    state.header.importerEori = eori
    assert.deepEqual(validateDocument(invoice.schema, state).warnings, [], eori)
  }
})

test('CSV export escapes quotes and neutralises spreadsheet formulas', () => {
  assert.equal(csvCell('=SUM(A1)'), '"\'=SUM(A1)"')
  assert.equal(csvCell('say "hi"'), '"say ""hi"""')
  const csv = documentToCsv(invoice.schema, invoice.schema.example)
  const rows = csv.trim().split('\r\n')
  assert.equal(rows.length, 4) // header + 2 lines + total
  assert.match(rows[0], /"line","invoice_number"/)
  assert.match(rows[1], /"2740.00"$/)
  assert.match(rows[3], /^"TOTAL"/)
  assert.match(rows[3], /"3559.00"$/)
})

test('JSON export round-trips and rejects foreign files', () => {
  const json = documentToJson(invoice.schema, invoice.schema.example)
  const parsed = JSON.parse(json)
  assert.equal(parsed.format, 'declarix-invoice-v1')
  assert.equal(parsed.totals.invoice_total, 3559)
  const back = documentFromJson(invoice.schema, json)
  assert.deepEqual(back.lines, invoice.schema.example.lines)
  assert.throws(() => documentFromJson(packing.schema, json))
  assert.throws(() => documentFromJson(invoice.schema, '{"x":1}'))
})

test('rendered document escapes user input', () => {
  const state = structuredClone(invoice.schema.example)
  state.header.exporterName = '<img src=x onerror=alert(1)>'
  state.lines[0].description = '<script>bad()</script>'
  const html = renderDocumentHtml(invoice.schema, state, 'https://getdeclarix.com/tools/commercial-invoice-generator/')
  assert.ok(!html.includes('<img src=x'))
  assert.ok(!html.includes('<script>'))
  assert.ok(html.includes('&lt;script&gt;'))
})

test('blank template CSV has headers and three blank rows', () => {
  for (const generator of documentGenerators) {
    const rows = templateCsv(generator).trim().split('\r\n')
    assert.equal(rows.length, 4, generator.path)
  }
})

test('rendered pages parse and keep the privacy promise in raw HTML', () => {
  for (const generator of documentGenerators) {
    for (const eoriEnabled of [true, false]) {
      const html = renderDocumentGenerator(generator, site, { navHtml: '', webmasterHtml: '', posthogKey: '', posthogHost: 'https://eu.i.posthog.com', eoriEnabled })
      const scripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
      assert.equal(scripts.length, 1)
      new Script(scripts[0][1])
      assert.ok(html.includes('Your data never leaves your browser.'))
      assert.ok(html.includes('/tools/customs-document-pack-check/'))
      assert.equal(html.includes('/tools/eori-checker/'), eoriEnabled)
      assert.equal((html.match(/<h1[\s>]/g) || []).length, 1)
      assert.ok(generator.title.length <= 60, generator.title)
      assert.ok(generator.description.length <= 155, generator.description)
    }
  }
})

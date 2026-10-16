// Unit checks for the special-procedure and identifier reference pages (lane ref-guides, iteration 1).
import test from 'node:test'
import assert from 'node:assert/strict'
import { procedureRoutes, renderProcedureRoute, setKnownPaths } from '../scripts/customs-procedures.mjs'

setKnownPaths(['/tools/import-duty-repayment-checker/', '/tools/mrn-checker/', '/tools/commodity-code-checker/', '/tools/customs-document-pack-check/', '/pilot/', '/customs-reference/'])

const site = { origin: 'https://getdeclarix.com', contact: 'pack@getdeclarix.com', company: 'Declarix Ltd', companyNumber: '00000000' }
const render = (route) => renderProcedureRoute(route, site, { navHtml: '', webmasterHtml: '' })
const byPath = (path) => procedureRoutes.find((route) => route.path === path)
const money = (value) => Number(String(value).replace(/[^0-9.]/g, ''))

const lanePages = [
  '/customs-reference/bonded-warehouse/',
  '/customs-reference/end-use-relief/',
  '/customs-reference/temporary-admission/',
  '/customs-reference/returned-goods-relief/',
  '/customs-reference/inward-processing-relief/',
  '/customs-reference/outward-processing-relief/',
  '/customs-reference/mrn/',
  '/customs-reference/c88-single-administrative-document/',
  '/customs-reference/c285-form/',
  '/customs-reference/commodity-code/',
]

test('titles, metas, H1 and the old H1 kept as subhead', () => {
  for (const path of lanePages) {
    const route = byPath(path)
    assert.ok(route, path)
    assert.ok(route.title.length <= 60, `${path} title ${route.title.length}`)
    assert.ok(route.description.length >= 140 && route.description.length <= 155, `${path} meta ${route.description.length}`)
    assert.ok(route.subhead && route.subhead !== route.h1, `${path} subhead`)
    const html = render(route)
    assert.ok(html.includes(`<p class="ref-subhead">`), `${path} renders subhead`)
    assert.ok(html.includes('class="ref-jump"'), `${path} renders jump links`)
    assert.ok(!html.includes('"@type":"FAQPage"'), `${path} keeps the no-FAQPage rule`)
    for (const [href] of html.matchAll(/<nav class="ref-jump"[\s\S]*?<\/nav>/g)) {
      for (const [, id] of href.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${id}"`), `${path} jump target ${id}`)
    }
  }
})

test('bonded warehouse: postponed VAT figures come from the worked example', () => {
  const route = byPath('/customs-reference/bonded-warehouse/')
  const rows = Object.fromEntries(route.example.rows.map(([label, value]) => [label, value]))
  const duty = money(rows['Normal entry (CPC 4000): duty £80,000 × 12%'])
  assert.equal(duty, 9600)
  assert.equal(money(rows['If you use postponed VAT accounting: duty not paid on arrival']), duty)
  assert.equal(money(rows['… plus duty never paid on the re-exported share (£16,000 × 12%)']), 16000 * 0.12)
  const html = render(route)
  for (const phrase of [
    '£27,520 not paid on arrival',
    'If you use postponed VAT accounting: £9,600 duty not paid on arrival, plus £1,920 duty never paid on the re-exported share.',
    'Using a 3PL’s public warehouse',
    'Importers: next step',
    'Brokers who file warehouse entries for clients like yours use Declarix to prepare them faster.',
    'Public warehouse (a 3PL stores your goods) — type R / CW1; private warehouse (you run it) — type U / CWP',
  ]) {
    assert.ok(html.includes(phrase.replaceAll('&', '&amp;')), phrase)
  }
  // The bridge sits directly above the product block.
  assert.ok(html.indexOf('ref-bridge') < html.indexOf('HOW DECLARIX PRE-CHECKS THE ENTRY'))
})

test('tool links from the guides', () => {
  const expected = {
    '/customs-reference/c285-form/': ['/tools/import-duty-repayment-checker/', 'Check your refund route free'],
    '/customs-reference/mrn/': ['/tools/mrn-checker/', 'Check an MRN now'],
    '/customs-reference/commodity-code/': ['/tools/commodity-code-checker/', 'Find a code with the free checker'],
  }
  for (const [path, [href, label]] of Object.entries(expected)) {
    const html = render(byPath(path))
    assert.ok(html.includes(`href="${href}"`) && html.includes(label), `${path} → ${href}`)
  }
})

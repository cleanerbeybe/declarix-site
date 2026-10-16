// Unit checks for the customs reference finders (CPC, DE 2/3 document codes, CDS error codes).
import test from 'node:test'
import assert from 'node:assert/strict'
import { additionalRecords, annotateDataElements, errorRecords, govAnchor, procedureRecords, referenceAssets, referenceRoutes, renderReferenceRoute } from '../scripts/customs-reference.mjs'

const site = { origin: 'https://getdeclarix.com', contact: 'pack@getdeclarix.com', company: 'Declarix Ltd', companyNumber: '0' }
const render = (key) => renderReferenceRoute(referenceRoutes.find((route) => route.key === key), site, { navHtml: '', webmasterHtml: '' })

test('every CDS error code has a plain-English reading and a next check (CE1, CE3)', () => {
  for (const record of errorRecords) {
    assert.ok(record.plain && record.plain !== record.title, `${record.code} plain English`)
    assert.ok(record.next && record.next.length > 30, `${record.code} next check`)
  }
  const cds11004 = errorRecords.find((record) => record.code === 'CDS11004')
  assert.match(cds11004.next, /4071 means the goods are leaving a customs warehouse/)
  assert.equal(cds11004.next_link, 'cpc-checker')
})

test('HMRC field names gain their data element numbers once (CE3)', () => {
  assert.equal(annotateDataElements('The combination of Trade Movement Type, Declaration Type followed by requested procedure'), 'The combination of Trade Movement Type (DE 1/1), Declaration Type (DE 1/2) followed by requested procedure (DE 1/10)')
  assert.equal(annotateDataElements('A valid Declaration Type (D.E. 1/2) has not been provided'), 'A valid Declaration Type (D.E. 1/2) has not been provided')
})

test('every procedure and additional procedure code deep-links to its GOV.UK section (S6)', () => {
  for (const record of procedureRecords) assert.match(govAnchor('procedure', record.direction, record.code, ''), /#/, record.code)
  for (const record of additionalRecords) assert.match(govAnchor('additional', record.direction, record.code, ''), /#/, record.code)
})

test('titles, meta and H1s follow the intent review (§4.2)', () => {
  for (const route of referenceRoutes) {
    assert.ok(route.title.length <= 60, route.title)
    assert.ok(route.description.length <= 155, route.description)
  }
  const cpc = referenceRoutes.find((route) => route.key === 'procedure')
  assert.equal(cpc.h1, 'CPC codes: every UK customs procedure code on CDS')
  assert.equal(cpc.subhead, 'Customs procedure codes: every UK CDS code, explained.')
})

test('CPC page: top table anchors, 4000C07 answer, CHIEF vs CDS, guide links, checker in the hero', () => {
  const html = render('procedure')
  for (const id of ['id="4000c07"', 'id="4071"', 'id="c07"', 'id="checker"', 'id="when-to-use-4000c07"', 'CPC on CHIEF vs CDS (Box 37 → DE 1/10 + 1/11)']) assert.ok(html.includes(id), id)
  for (const guide of ['bonded-warehouse', 'inward-processing-relief', 'outward-processing-relief', 'returned-goods-relief', 'end-use-relief', 'temporary-admission']) assert.ok(html.includes(`href="/customs-reference/${guide}/"`), guide)
  assert.ok(html.indexOf('id="cpc-checker"') < html.indexOf('</header>', html.indexOf('ref-hero')), 'checker sits in the hero')
  assert.ok(html.includes('data-apc-filter="Import"'))
})

test('document page: find box, anchored cards, status legend, consistent appendix names', () => {
  const html = render('document')
  for (const id of ['id="find-doc"', 'id="y900"', 'id="n935"', 'id="9120"', 'id="c505"', 'id="c506"', 'id="u116"', 'id="y923"', 'id="9wks"', 'Status code legend', 'Recent document code changes', 'id="status-codes"']) assert.ok(html.includes(id), id)
  assert.ok(!html.includes('Status codes are copied from HMRC Appendix 5A'))
})

test('error page: find box, top-code H2s, notification types and pre-lodged section', () => {
  const html = render('error')
  for (const text of ['id="find-err"', 'DMSREJ, DMSACC, DMSCLE, DMSTAX: CDS notification types', 'Pre-lodged declaration rejected on arrival', 'id="cds11004"', 'id="about-cds12056"']) assert.ok(html.includes(text), text)
  assert.equal((html.match(/class="next-check"/g) || []).length >= errorRecords.length, true)
})

test('phone cards keep column labels on every body cell (S5)', () => {
  for (const key of ['procedure', 'document', 'error']) {
    const html = render(key)
    const cells = html.match(/<td(?=[\s>])[^>]*>/g) || []
    assert.ok(cells.length > 100)
    for (const cell of cells) assert.match(cell, /data-label="/, `${key}: ${cell}`)
  }
})

test('error CSV carries the plain-English reading and next check', () => {
  const [asset] = referenceAssets(referenceRoutes.find((route) => route.key === 'error'))
  assert.ok(asset.content.startsWith('"code","title","meaning","plain_english"'))
})

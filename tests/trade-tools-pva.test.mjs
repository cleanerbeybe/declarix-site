import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ACTIONS, detectColumns, detectDelimiter, explainLine, extractRecords, isTransposed, parseAmount, parseCsv, reconcilePva, reconciliationCsv, rowLabel, vatReturnSummary } from '../scripts/trade-tools/pva.mjs'

const statementCsv = readFileSync(new URL('../public/downloads/postponed-vat-statement-example.csv', import.meta.url), 'utf8')
const listCsv = readFileSync(new URL('../public/downloads/import-list-example.csv', import.meta.url), 'utf8')

test('parses quoted CSV, semicolons and tabs', () => {
  assert.deepEqual(parseCsv('a,"b, c",d\n1,"say ""hi""",3\n'), [['a', 'b, c', 'd'], ['1', 'say "hi"', '3']])
  assert.equal(detectDelimiter('a;b;c\n1;2;3'), ';')
  assert.equal(detectDelimiter('a\tb\n1\t2'), '\t')
  assert.deepEqual(parseCsv('﻿MRN;VAT\r\nX;1,50\r\n'), [['MRN', 'VAT'], ['X', '1,50']])
})

test('reads money in the formats statements and spreadsheets use', () => {
  assert.equal(parseAmount('£1,284.60'), 1284.6)
  assert.equal(parseAmount('412.18'), 412.18)
  assert.equal(parseAmount('(12.50)'), -12.5)
  assert.equal(parseAmount('-7.00'), -7)
  assert.equal(parseAmount('GBP 2,960.00'), 2960)
  assert.equal(parseAmount('n/a'), null)
  assert.equal(parseAmount(''), null)
})

test('finds MRN, VAT, EORI, date and reference columns by header', () => {
  const columns = detectColumns(['Date of import', 'MRN', 'Declarant reference', 'Declarant EORI', 'Import VAT (£)'])
  assert.deepEqual(columns, { mrn: 1, vat: 4, eori: 3, date: 0, reference: 2 })
})

test('finds the MRN and VAT columns by content when headers are unhelpful', () => {
  const rows = [['A', '21GB1NEXFX6SU9C4R1', '12.00'], ['B', '20GBDPQ8A31WX1XXR5', '30.50']]
  const columns = detectColumns(['Col 1', 'Col 2', 'Col 3'], rows)
  assert.equal(columns.mrn, 1)
  assert.equal(columns.vat, 2)
})

test('reads text pasted from a statement PDF line by line', () => {
  const pasted = `Port of entry: Dover
02/09/2026 21GB1NEXFX6SU9C4R1 DXR-1 GB987654321000 £1,284.60
04/09/2026 20GBDPQ8A31WX1XXR5 DXR-2 GB987654321000 412.18
Total 1,696.78`
  const { records, mode } = extractRecords(pasted)
  assert.equal(mode, 'lines')
  assert.deepEqual(records.map((record) => [record.mrn, record.vat, record.eori]), [
    ['21GB1NEXFX6SU9C4R1', 1284.6, 'GB987654321000'],
    ['20GBDPQ8A31WX1XXR5', 412.18, 'GB987654321000'],
  ])
})

test('the worked example reconciles to the published figures', () => {
  const statement = extractRecords(statementCsv)
  const list = extractRecords(listCsv)
  assert.equal(statement.mode, 'columns')
  assert.equal(statement.records.length, 6)
  assert.equal(list.records.length, 5)
  const result = reconcilePva(statement.records, list.records)
  assert.equal(result.matched.length, 3)
  assert.equal(result.amountMismatch.length, 1)
  assert.deepEqual([result.amountMismatch[0].statementVat, result.amountMismatch[0].yourVat, result.amountMismatch[0].difference], [2960, 2690, 270])
  assert.equal(result.duplicates.length, 1)
  assert.equal(result.duplicates[0].vat, 1284.6)
  assert.equal(result.notInYourList.length, 1)
  assert.equal(result.notInYourList[0].eori, 'GB112233445000')
  assert.equal(result.missingFromStatement.length, 1)
  assert.equal(result.missingFromStatement[0].vat, 736.9)
  assert.equal(result.invalidMrns.length, 0)
  assert.deepEqual(result.totals, {
    statement: 9863.5,
    statementWithDuplicates: 11148.1,
    yours: 10242,
    duplicates: 1284.6,
    difference: -378.5,
    statementLines: 6,
    yourLines: 5,
  })
})

test('a line without an MRN matches on amount and EORI', () => {
  const statement = [{ mrn: '21GB1NEXFX6SU9C4R1', vat: 50, eori: 'GB1', line: 2 }]
  const own = [{ mrn: '', vat: 50, eori: '', reference: 'INV-1', line: 2 }]
  const result = reconcilePva(statement, own)
  assert.equal(result.matchedByAmount.length, 1)
  assert.equal(result.notInYourList.length, 0)
})

test('MRNs with a bad check digit are listed', () => {
  const result = reconcilePva([{ mrn: '21GB1NEXFX6SU9C4R2', vat: 10, line: 2 }], [{ mrn: '21GB1NEXFX6SU9C4R2', vat: 10, line: 2 }])
  assert.equal(result.invalidMrns.length, 1)
  assert.equal(result.matched.length, 1)
})

test('several statement lines for one MRN are summed before matching', () => {
  const statement = [
    { mrn: '21GB1NEXFX6SU9C4R1', vat: 100, line: 2 },
    { mrn: '21GB1NEXFX6SU9C4R1', vat: 25.5, line: 3 },
  ]
  const result = reconcilePva(statement, [{ mrn: '21GB1NEXFX6SU9C4R1', vat: 125.5, line: 2 }])
  assert.equal(result.matched.length, 1)
  assert.equal(result.matched[0].lines, 2)
})

const example = () => reconcilePva(extractRecords(statementCsv).records, extractRecords(listCsv).records)

test('rows carry the data row and the file line, even after blank lines (PV5)', () => {
  const rows = parseCsv('MRN,VAT\n\n26GB7Q2K4M8D1X3PR5,10.00\n"26GB3H9W5T2B7C4NR5",20.00\n')
  assert.deepEqual(rows.map((row) => row.line), [1, 3, 4])
  const { records } = extractRecords('MRN,VAT\n\n26GB7Q2K4M8D1X3PR5,10.00\n26GB3H9W5T2B7C4NR5,20.00\n')
  assert.deepEqual(records.map((record) => [record.row, record.line]), [[1, 3], [2, 4]])
  const duplicate = example().duplicates[0]
  assert.equal(rowLabel(duplicate), 'Data row 4 (file line 5)')
  assert.equal(rowLabel({ row: 3, line: 3 }), 'Data row 3')
  assert.equal(rowLabel({ line: 7 }), 'File line 7')
})

test('the VAT Return line gives Box 1 and Box 4 and the open items (PV1)', () => {
  const summary = vatReturnSummary(example())
  assert.equal(summary.box1, 9863.5)
  assert.equal(summary.box4, 9863.5)
  assert.equal(summary.text, 'Account for £9,863.50 in Box 1 and Box 4 (statement total after removing duplicates; Box 4 follows the normal input tax rules). Include the value of these imports, excluding VAT, in Box 7. Open items: 1 amount difference (£270.00); 1 duplicate removed (£1,284.60); 1 on the statement only (£88.40); 1 on your list only (£736.90).')
  assert.equal(summary.explained, -378.5)
  assert.equal(summary.unexplained, 0)
})

test('every unmatched line gets a reason and a next action (PV2)', () => {
  const r = example()
  assert.equal(explainLine('amount_differs', r.amountMismatch[0]).reason, 'Statement £2,960.00, your list £2,690.00: difference £270.00, a transposed figure.')
  assert.equal(explainLine('amount_differs', r.amountMismatch[0]).action, ACTIONS.amount_differs)
  assert.equal(explainLine('duplicate_on_statement', r.duplicates[0]).reason, 'Same MRN and £1,284.60 as data row 1 (file line 2) of the statement.')
  assert.match(explainLine('statement_only', r.notInYourList[0]).reason, /declared by EORI GB112233445000/)
  assert.match(explainLine('your_list_only', r.missingFromStatement[0]).action, /VAT group/)
  assert.equal(isTransposed(2960, 2690), true)
  assert.equal(isTransposed(100, 101), false)
})

test('the CSV is audit-ready: run details, totals, reconciling items, reasons and 2 dp amounts (PV3)', () => {
  const csv = reconciliationCsv(example(), { runDate: '16 October 2026', statementFile: 'statement.csv', listFile: 'imports.csv' })
  const lines = csv.split('\n')
  assert.equal(lines[0], 'Postponed import VAT reconciliation')
  assert.ok(lines.includes('Run date,16 October 2026'))
  assert.ok(lines.includes('Statement file,statement.csv'))
  assert.ok(lines.includes('Import list file,imports.csv'))
  assert.ok(lines.includes('Statement total after duplicates (VAT Return Box 1 and Box 4),9863.50'))
  assert.ok(lines.includes('Your import list total,10242.00'))
  assert.ok(lines.includes('Difference to explain,-378.50'))
  assert.ok(lines.includes('Unexplained,,0.00'))
  assert.ok(lines.includes('result,statement_row,your_list_row,mrn,statement_vat,your_vat,difference,reference,declarant_eori,reason,action'))
  const duplicate = lines.find((line) => line.startsWith('duplicate_on_statement'))
  assert.match(duplicate, /^duplicate_on_statement,Data row 4 \(file line 5\),,26GB7Q2K4M8D1X3PR5,1284\.60,/)
  assert.ok(lines.some((line) => line.startsWith('matched,,Data row 1 (file line 2),26GB7Q2K4M8D1X3PR5,1284.60,1284.60,')))
  assert.ok(!/\b1284\.6\b(?!0)/.test(csv))
  assert.ok(!csv.includes('pasted text') && reconciliationCsv(example()).includes('Statement file,pasted text'))
})

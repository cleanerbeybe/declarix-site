import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { detectColumns, detectDelimiter, extractRecords, parseAmount, parseCsv, reconcilePva } from '../scripts/trade-tools/pva.mjs'

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

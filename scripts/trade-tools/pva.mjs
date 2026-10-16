// Postponed import VAT statement reconciler. Runs in the browser; files never leave the page.
// Matches the monthly statement (CDS, Part 2 individual entries) to the importer's own list.
// GOV.UK "Understanding your monthly postponed import VAT statements" (updated 19 May 2026):
// each entry shows date of import, entry number, declarant reference, declarant EORI and
// import VAT; duplicates carry the same MRN and VAT amount as the original entry.
// Depends on mrn.mjs (decodeMrn, findMrns) when inlined.
import { decodeMrn, findMrns } from './mrn.mjs'

export function detectDelimiter(text) {
  const sample = String(text || '').split(/\r?\n/).slice(0, 5).join('\n')
  const counts = { ',': 0, ';': 0, '\t': 0 }
  let quoted = false
  for (const char of sample) {
    if (char === '"') quoted = !quoted
    else if (!quoted && char in counts) counts[char] += 1
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][1] > 0
    ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    : ','
}

// Each returned row carries .line, the 1-based file line it starts on (issue PV5).
export function parseCsv(text, delimiter = detectDelimiter(text)) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  let fileLine = 1
  let rowStart = 1
  const source = String(text || '').replace(/^\uFEFF/, '')
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') { field += '"'; index += 1 }
      else if (char === '"') quoted = false
      else {
        if (char === '\n') fileLine += 1
        field += char
      }
    } else if (char === '"') quoted = true
    else if (char === delimiter) { row.push(field); field = '' }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[index + 1] === '\n') index += 1
      row.push(field); field = ''
      Object.defineProperty(row, 'line', { value: rowStart, enumerable: false })
      if (row.some((cell) => cell.trim() !== '')) rows.push(row)
      fileLine += 1
      rowStart = fileLine
      row = []
    } else field += char
  }
  row.push(field)
  Object.defineProperty(row, 'line', { value: rowStart, enumerable: false })
  if (row.some((cell) => cell.trim() !== '')) rows.push(row)
  return rows
}

export function parseAmount(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return null
  const negative = /^\(.*\)$/.test(raw) || /^-/.test(raw) || /-$/.test(raw) || /\bCR\b/i.test(raw)
  const cleaned = raw.replace(/[£$€,\s()]|GBP|CR|DR/gi, '').replace(/-/g, '')
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null
  const amount = Math.round(Number(cleaned) * 100) / 100
  return negative ? -amount : amount
}

const HEADER_RULES = {
  mrn: [/\bmrn\b/, /movement reference/, /entry number/, /declaration (id|number|reference)/],
  vat: [/import vat/, /\bvat\b.*(amount|postponed|£|gbp)/, /postponed/, /^vat$/, /vat amount/, /\bvat\b/],
  eori: [/eori/],
  date: [/date/],
  reference: [/declarant'?s? ref/, /\breference\b/, /\bref\b/, /invoice/, /ducr/],
}

export function detectColumns(headers, rows = []) {
  const lower = headers.map((header) => String(header).toLowerCase().trim())
  const found = {}
  for (const [key, rules] of Object.entries(HEADER_RULES)) {
    for (const rule of rules) {
      const index = lower.findIndex((header, position) => rule.test(header) && !Object.values(found).includes(position))
      if (index !== -1) { found[key] = index; break }
    }
  }
  // Fall back to content: the column where most cells are MRN-shaped, then the last money column.
  if (!('mrn' in found) && rows.length) {
    let best = -1
    let bestScore = 0
    headers.forEach((_, column) => {
      const score = rows.filter((row) => findMrns(row[column]).length === 1).length
      if (score > bestScore) { best = column; bestScore = score }
    })
    if (best !== -1) found.mrn = best
  }
  if (!('vat' in found) && rows.length) {
    for (let column = headers.length - 1; column >= 0; column -= 1) {
      if (column === found.mrn) continue
      const numeric = rows.filter((row) => /[.,]\d{2}\s*\)?$/.test(String(row[column] || '').trim()) && parseAmount(row[column]) !== null).length
      if (numeric >= Math.max(1, rows.length / 2)) { found.vat = column; break }
    }
  }
  return found
}

function lineRecord(line, lineNumber, row) {
  const mrns = findMrns(line)
  if (!mrns.length) return null
  const amounts = [...String(line).matchAll(/\(?-?£?\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})\)?-?|\(?-?£?\s?\d+\.\d{2}\)?-?/g)]
    .map((match) => parseAmount(match[0]))
    .filter((value) => value !== null)
  const eori = (String(line).toUpperCase().match(/\b(?:GB|XI)\d{12,15}\b/) || [])[0] || ''
  return { mrn: mrns[0], vat: amounts.length ? amounts[amounts.length - 1] : null, eori, date: '', reference: '', line: lineNumber, row }
}

// Accepts a CSV export or text pasted from the statement PDF. Returns records + how they were read.
export function extractRecords(text) {
  const source = String(text || '')
  const rows = parseCsv(source)
  const records = []
  let mode = 'lines'
  if (rows.length >= 2 && rows[0].length >= 2) {
    const headerHasLabels = rows[0].some((cell) => /[a-z]{3}/i.test(cell) && !findMrns(cell).length)
    const header = headerHasLabels ? rows[0] : rows[0].map((_, index) => `Column ${index + 1}`)
    const body = headerHasLabels ? rows.slice(1) : rows
    const columns = detectColumns(header, body)
    if (('mrn' in columns) || ('vat' in columns)) {
      mode = 'columns'
      body.forEach((row, index) => {
        const mrnCell = ('mrn' in columns) ? row[columns.mrn] : ''
        const mrn = findMrns(mrnCell)[0] || String(mrnCell || '').toUpperCase().replace(/\s/g, '')
        const vat = ('vat' in columns) ? parseAmount(row[columns.vat]) : null
        if (!mrn && vat === null) return
        if (/^(total|sub-?total)/i.test(String(row[0] || '').trim())) return
        records.push({
          mrn,
          vat,
          eori: ('eori' in columns) ? String(row[columns.eori] || '').toUpperCase().replace(/\s/g, '') : '',
          date: ('date' in columns) ? String(row[columns.date] || '').trim() : '',
          reference: ('reference' in columns) ? String(row[columns.reference] || '').trim() : '',
          row: index + 1,
          line: row.line || index + (headerHasLabels ? 2 : 1),
        })
      })
      return { records, mode, columns: Object.fromEntries(Object.entries(columns).map(([key, value]) => [key, header[value]])) }
    }
  }
  source.split(/\r?\n/).forEach((line, index) => {
    const record = lineRecord(line, index + 1, records.length + 1)
    if (record) records.push(record)
  })
  return { records, mode, columns: {} }
}

const round = (value) => Math.round(value * 100) / 100

export function reconcilePva(statementRecords, importRecords, { tolerance = 0.01 } = {}) {
  const result = { matched: [], amountMismatch: [], missingFromStatement: [], notInYourList: [], duplicates: [], matchedByAmount: [], invalidMrns: [], totals: {} }
  const seen = new Map()
  const statement = []
  for (const record of statementRecords) {
    const key = `${record.mrn}|${record.vat}`
    if (record.mrn && seen.has(key)) { result.duplicates.push({ ...record, original: seen.get(key) }); continue }
    if (record.mrn) seen.set(key, record)
    statement.push(record)
  }
  for (const record of [...statement, ...importRecords]) {
    if (record.mrn && !decodeMrn(record.mrn).valid) {
      if (!result.invalidMrns.some((item) => item.mrn === record.mrn)) result.invalidMrns.push({ mrn: record.mrn, line: record.line, row: record.row, error: decodeMrn(record.mrn).errors[0] })
    }
  }
  const byMrn = new Map()
  for (const record of statement) {
    if (!record.mrn) continue
    if (!byMrn.has(record.mrn)) byMrn.set(record.mrn, [])
    byMrn.get(record.mrn).push(record)
  }
  const usedStatement = new Set()
  const unmatchedImports = []
  for (const own of importRecords) {
    const candidates = own.mrn ? (byMrn.get(own.mrn) || []).filter((record) => !usedStatement.has(record)) : []
    if (candidates.length) {
      const statementVat = round(candidates.reduce((sum, record) => sum + (record.vat || 0), 0))
      candidates.forEach((record) => usedStatement.add(record))
      if (own.vat === null || Math.abs(statementVat - own.vat) <= tolerance) {
        result.matched.push({ mrn: own.mrn, statementVat, yourVat: own.vat, eori: candidates[0].eori || own.eori, reference: own.reference || candidates[0].reference, lines: candidates.length, row: own.row, line: own.line })
      } else {
        result.amountMismatch.push({ mrn: own.mrn, statementVat, yourVat: own.vat, difference: round(statementVat - own.vat), reference: own.reference || candidates[0].reference, eori: candidates[0].eori || own.eori, row: own.row, line: own.line, statementRow: candidates[0].row, statementLine: candidates[0].line })
      }
    } else unmatchedImports.push(own)
  }
  // Second pass: own rows with no MRN match, matched on amount (and EORI when both sides carry one).
  for (const own of unmatchedImports) {
    const candidate = own.vat === null ? null : statement.find((record) => !usedStatement.has(record) && record.vat !== null && Math.abs(record.vat - own.vat) <= tolerance && (!own.eori || !record.eori || own.eori === record.eori))
    if (candidate && !own.mrn) {
      usedStatement.add(candidate)
      result.matchedByAmount.push({ statementMrn: candidate.mrn, yourReference: own.reference, vat: candidate.vat, yourVat: own.vat, eori: candidate.eori, row: own.row, line: own.line })
    } else {
      result.missingFromStatement.push(own)
    }
  }
  result.notInYourList = statement.filter((record) => !usedStatement.has(record))
  const sum = (records) => round(records.reduce((total, record) => total + (record.vat || 0), 0))
  result.totals = {
    statement: sum(statement),
    statementWithDuplicates: sum(statementRecords),
    yours: sum(importRecords),
    duplicates: sum(result.duplicates),
    difference: round(sum(statement) - sum(importRecords)),
    statementLines: statementRecords.length,
    yourLines: importRecords.length,
  }
  return result
}

// ---------------------------------------------------------------------------
// Reasons, actions, the VAT Return line and the audit CSV (issues PV1–PV3, PV5, 16 Oct 2026).
// GOV.UK "Complete your VAT Return to account for import VAT" (checked 16 Oct 2026):
// Box 1 = VAT due on imports accounted for through postponed VAT accounting, from the monthly
// statement; Box 4 = the VAT reclaimed on those imports (normal input tax rules apply);
// Box 7 = the total value of all imports of goods, not including VAT. Missing entries: check a
// VAT group member's or related company's statement, and ask the agent to confirm the import
// VAT was allocated to the correct EORI. GOV.UK "Understanding your monthly postponed import VAT
// statements" (updated 19 May 2026): a duplicate has the same MRN and VAT amount; make a manual
// adjustment and account for the revised amount.
const money2 = (value) => (value == null || value === '' || Number.isNaN(Number(value)) ? '' : Number(value).toFixed(2))
const pounds = (value) => `${Number(value) < 0 ? '−' : ''}£${Math.abs(Number(value || 0)).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const rowLabel = (record) => {
  if (!record || !record.row) return record && record.line ? `File line ${record.line}` : ''
  return record.line && record.line !== record.row ? `Data row ${record.row} (file line ${record.line})` : `Data row ${record.row}`
}

// True when two amounts hold the same digits in a different order (a transposed figure).
export function isTransposed(a, b) {
  if (a === null || b === null || a === b) return false
  const digits = (value) => Number(value).toFixed(2).replace(/\D/g, '').split('').sort().join('')
  return digits(a) === digits(b)
}

export const ACTIONS = {
  matched: 'Include in the VAT Return.',
  amount_differs: 'The statement amount is what HMRC recorded. Correct your list, or ask the agent to amend the declaration.',
  duplicate_on_statement: 'Adjust the statement by hand and account for this amount once, as HMRC’s guidance says.',
  statement_only: 'Ask who made the declaration under your EORI. If the import is yours, add it to your list.',
  your_list_only: 'Check whether the agent used postponed VAT accounting or paid the VAT. Ask them to confirm the VAT went to your EORI; in a VAT group, check the other members’ statements.',
  matched_by_amount: 'Add the MRN to your list so next month matches by MRN.',
  invalid_mrn: 'Copy the MRN again from the declaration or the agent’s entry; this one fails the check digit.',
}

export function explainLine(kind, item) {
  switch (kind) {
    case 'amount_differs':
      return {
        reason: `Statement ${pounds(item.statementVat)}, your list ${pounds(item.yourVat)}: difference ${pounds(item.difference)}${isTransposed(item.statementVat, item.yourVat) ? ', a transposed figure' : ''}.`,
        action: ACTIONS.amount_differs,
      }
    case 'duplicate_on_statement':
      return { reason: `Same MRN and ${pounds(item.vat)} as ${rowLabel(item.original).replace(/^D/, 'd').replace(/^F/, 'f')} of the statement.`, action: ACTIONS.duplicate_on_statement }
    case 'statement_only':
      return { reason: `${pounds(item.vat)} on the statement with no line on your list${item.eori ? `, declared by EORI ${item.eori}` : ''}.`, action: ACTIONS.statement_only }
    case 'your_list_only':
      return { reason: `${item.vat === null ? 'This import' : pounds(item.vat)} on your list with no statement line for this MRN.`, action: ACTIONS.your_list_only }
    case 'matched_by_amount':
      return { reason: `Your line has no MRN. It matches statement MRN ${item.statementMrn} on ${pounds(item.vat)}${item.eori ? ' and EORI' : ''}.`, action: ACTIONS.matched_by_amount }
    case 'invalid_mrn':
      return { reason: item.error || 'The MRN fails the check digit.', action: ACTIONS.invalid_mrn }
    default:
      return { reason: 'Statement and your list agree.', action: ACTIONS.matched }
  }
}

// The figures for the VAT Return and the items that explain the difference.
export function vatReturnSummary(result) {
  const t = result.totals
  const sum = (list, pick) => Math.round(list.reduce((total, item) => total + (Number(pick(item)) || 0), 0) * 100) / 100
  const items = [
    { kind: 'amount_differs', label: 'Amount differs (statement minus your list)', count: result.amountMismatch.length, amount: sum(result.amountMismatch, (x) => x.difference) },
    { kind: 'statement_only', label: 'On the statement only', count: result.notInYourList.length, amount: sum(result.notInYourList, (x) => x.vat) },
    { kind: 'your_list_only', label: 'On your list only', count: result.missingFromStatement.length, amount: -sum(result.missingFromStatement, (x) => x.vat) },
    { kind: 'matched_no_vat', label: 'Matched, no VAT on your line', count: result.matched.filter((x) => x.yourVat === null).length, amount: sum(result.matched.filter((x) => x.yourVat === null), (x) => x.statementVat) },
    { kind: 'matched_by_amount', label: 'Matched by amount (rounding)', count: result.matchedByAmount.length, amount: sum(result.matchedByAmount, (x) => (x.yourVat == null ? 0 : x.vat - x.yourVat)) },
  ].filter((item) => item.count)
  const explained = Math.round(items.reduce((total, item) => total + item.amount, 0) * 100) / 100
  const unexplained = Math.round((t.difference - explained) * 100) / 100
  const open = []
  if (result.amountMismatch.length) open.push(`${result.amountMismatch.length} amount ${result.amountMismatch.length === 1 ? 'difference' : 'differences'} (${pounds(sum(result.amountMismatch, (x) => x.difference))})`)
  if (result.duplicates.length) open.push(`${result.duplicates.length} ${result.duplicates.length === 1 ? 'duplicate' : 'duplicates'} removed (${pounds(t.duplicates)})`)
  if (result.notInYourList.length) open.push(`${result.notInYourList.length} on the statement only (${pounds(sum(result.notInYourList, (x) => x.vat))})`)
  if (result.missingFromStatement.length) open.push(`${result.missingFromStatement.length} on your list only (${pounds(sum(result.missingFromStatement, (x) => x.vat))})`)
  if (result.invalidMrns.length) open.push(`${result.invalidMrns.length} MRN${result.invalidMrns.length === 1 ? '' : 's'} failing the check digit`)
  const text = `Account for ${pounds(t.statement)} in Box 1 and Box 4 (statement total after removing duplicates; Box 4 follows the normal input tax rules). Include the value of these imports, excluding VAT, in Box 7. Open items: ${open.length ? open.join('; ') : 'none'}.`
  return { box1: t.statement, box4: t.statement, text, open, items, explained, unexplained }
}

const csvCell = (value) => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

// Audit-ready CSV: run details, totals, reconciling items, then one row per line with reason and action.
export function reconciliationCsv(result, { runDate = '', statementFile = '', listFile = '' } = {}) {
  const t = result.totals
  const summary = vatReturnSummary(result)
  const rows = [
    ['Postponed import VAT reconciliation'],
    ['Run date', runDate],
    ['Statement file', statementFile || 'pasted text'],
    ['Import list file', listFile || 'pasted text'],
    [],
    ['Totals', 'Amount (GBP)'],
    ['Statement total, all lines', money2(t.statementWithDuplicates)],
    ['Less duplicates on the statement', money2(-t.duplicates)],
    ['Statement total after duplicates (VAT Return Box 1 and Box 4)', money2(t.statement)],
    ['Your import list total', money2(t.yours)],
    ['Difference to explain', money2(t.difference)],
    [],
    ['Reconciling items', 'Lines', 'Amount (GBP)'],
    ...summary.items.map((item) => [item.label, item.count, money2(item.amount)]),
    ['Total explained', '', money2(summary.explained)],
    ['Unexplained', '', money2(summary.unexplained)],
    [],
    ['result', 'statement_row', 'your_list_row', 'mrn', 'statement_vat', 'your_vat', 'difference', 'reference', 'declarant_eori', 'reason', 'action'],
  ]
  const line = (kind, item, values) => {
    const { reason, action } = explainLine(kind, item)
    return [kind, ...values, reason, action]
  }
  for (const x of result.amountMismatch) rows.push(line('amount_differs', x, [rowLabel({ row: x.statementRow, line: x.statementLine }), rowLabel(x), x.mrn, money2(x.statementVat), money2(x.yourVat), money2(x.difference), x.reference || '', x.eori || '']))
  for (const x of result.duplicates) rows.push(line('duplicate_on_statement', x, [rowLabel(x), '', x.mrn, money2(x.vat), '', '', x.reference || '', x.eori || '']))
  for (const x of result.notInYourList) rows.push(line('statement_only', x, [rowLabel(x), '', x.mrn, money2(x.vat), '', '', x.reference || '', x.eori || '']))
  for (const x of result.missingFromStatement) rows.push(line('your_list_only', x, ['', rowLabel(x), x.mrn || '', '', money2(x.vat), '', x.reference || '', x.eori || '']))
  for (const x of result.matchedByAmount) rows.push(line('matched_by_amount', x, ['', rowLabel(x), x.statementMrn, money2(x.vat), money2(x.yourVat ?? x.vat), '', x.yourReference || '', x.eori || '']))
  for (const x of result.invalidMrns) rows.push(line('invalid_mrn', x, ['', '', x.mrn, '', '', '', '', '']).map((cell, index) => (index === 1 ? rowLabel(x) : cell)))
  for (const x of result.matched) rows.push(line('matched', x, ['', rowLabel(x), x.mrn, money2(x.statementVat), money2(x.yourVat), '', x.reference || '', x.eori || '']))
  return rows.map((row) => row.map(csvCell).join(',')).join('\n')
}

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

export function parseCsv(text, delimiter = detectDelimiter(text)) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  const source = String(text || '').replace(/^\uFEFF/, '')
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') { field += '"'; index += 1 }
      else if (char === '"') quoted = false
      else field += char
    } else if (char === '"') quoted = true
    else if (char === delimiter) { row.push(field); field = '' }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[index + 1] === '\n') index += 1
      row.push(field); field = ''
      if (row.some((cell) => cell.trim() !== '')) rows.push(row)
      row = []
    } else field += char
  }
  row.push(field)
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

function lineRecord(line, lineNumber) {
  const mrns = findMrns(line)
  if (!mrns.length) return null
  const amounts = [...String(line).matchAll(/\(?-?£?\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})\)?-?|\(?-?£?\s?\d+\.\d{2}\)?-?/g)]
    .map((match) => parseAmount(match[0]))
    .filter((value) => value !== null)
  const eori = (String(line).toUpperCase().match(/\b(?:GB|XI)\d{12,15}\b/) || [])[0] || ''
  return { mrn: mrns[0], vat: amounts.length ? amounts[amounts.length - 1] : null, eori, date: '', reference: '', line: lineNumber }
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
          line: index + (headerHasLabels ? 2 : 1),
        })
      })
      return { records, mode, columns: Object.fromEntries(Object.entries(columns).map(([key, value]) => [key, header[value]])) }
    }
  }
  source.split(/\r?\n/).forEach((line, index) => {
    const record = lineRecord(line, index + 1)
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
      if (!result.invalidMrns.some((item) => item.mrn === record.mrn)) result.invalidMrns.push({ mrn: record.mrn, line: record.line, error: decodeMrn(record.mrn).errors[0] })
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
        result.matched.push({ mrn: own.mrn, statementVat, yourVat: own.vat, eori: candidates[0].eori || own.eori, reference: own.reference || candidates[0].reference, lines: candidates.length })
      } else {
        result.amountMismatch.push({ mrn: own.mrn, statementVat, yourVat: own.vat, difference: round(statementVat - own.vat), reference: own.reference || candidates[0].reference })
      }
    } else unmatchedImports.push(own)
  }
  // Second pass: own rows with no MRN match, matched on amount (and EORI when both sides carry one).
  for (const own of unmatchedImports) {
    const candidate = own.vat === null ? null : statement.find((record) => !usedStatement.has(record) && record.vat !== null && Math.abs(record.vat - own.vat) <= tolerance && (!own.eori || !record.eori || own.eori === record.eori))
    if (candidate && !own.mrn) {
      usedStatement.add(candidate)
      result.matchedByAmount.push({ statementMrn: candidate.mrn, yourReference: own.reference, vat: candidate.vat })
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

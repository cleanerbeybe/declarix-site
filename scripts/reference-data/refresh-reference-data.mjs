// Refreshes the customs reference source registers from HMRC's published files on GOV.UK.
// Usage: node scripts/reference-data/refresh-reference-data.mjs [YYYY-MM-DD]
// Every record keeps the official source URL and the date it was checked. Review the git diff before publishing.
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { inflateRawSync } from 'node:zlib'

const here = dirname(fileURLToPath(import.meta.url))
const checkedOn = process.argv[2] || new Date().toISOString().slice(0, 10)
const GOVUK = 'https://www.gov.uk'

async function content(path) {
  const response = await fetch(`${GOVUK}/api/content${path}`)
  if (!response.ok) throw new Error(`GOV.UK content API ${response.status} for ${path}`)
  return response.json()
}

async function binary(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Download ${response.status} for ${url}`)
  return Buffer.from(await response.arrayBuffer())
}

const decodeEntities = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')

const clean = (value) =>
  decodeEntities(String(value))
    .replace(/ /g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

// Minimal ZIP reader for OpenDocument spreadsheets (content.xml only).
function zipEntry(buffer, name) {
  let eocd = buffer.length - 22
  while (eocd >= 0 && buffer.readUInt32LE(eocd) !== 0x06054b50) eocd -= 1
  if (eocd < 0) throw new Error('Not a ZIP file')
  const entries = buffer.readUInt16LE(eocd + 10)
  let offset = buffer.readUInt32LE(eocd + 16)
  for (let index = 0; index < entries; index += 1) {
    const method = buffer.readUInt16LE(offset + 10)
    const compressedSize = buffer.readUInt32LE(offset + 20)
    const nameLength = buffer.readUInt16LE(offset + 28)
    const extraLength = buffer.readUInt16LE(offset + 30)
    const commentLength = buffer.readUInt16LE(offset + 32)
    const localOffset = buffer.readUInt32LE(offset + 42)
    const entryName = buffer.toString('utf8', offset + 46, offset + 46 + nameLength)
    if (entryName === name) {
      const localNameLength = buffer.readUInt16LE(localOffset + 26)
      const localExtraLength = buffer.readUInt16LE(localOffset + 28)
      const start = localOffset + 30 + localNameLength + localExtraLength
      const data = buffer.subarray(start, start + compressedSize)
      return method === 0 ? data : inflateRawSync(data)
    }
    offset += 46 + nameLength + extraLength + commentLength
  }
  throw new Error(`ZIP entry not found: ${name}`)
}

function cellText(cellXml) {
  const paragraphs = [...cellXml.matchAll(/<text:p\b[^>]*?(?:\/>|>([\s\S]*?)<\/text:p>)/g)].map((match) =>
    (match[1] || '')
      .replace(/<text:s(?:\s+text:c="(\d+)")?\s*\/>/g, (_, count) => ' '.repeat(Number(count || 1)))
      .replace(/<text:line-break\s*\/>/g, '\n')
      .replace(/<text:tab\s*\/>/g, ' ')
      .replace(/<[^>]+>/g, ''),
  )
  return clean(paragraphs.join('\n'))
}

function odsSheets(buffer) {
  const xml = zipEntry(buffer, 'content.xml').toString('utf8')
  const sheets = {}
  for (const table of xml.matchAll(/<table:table\b[^>]*table:name="([^"]*)"[^>]*>([\s\S]*?)<\/table:table>/g)) {
    const rows = []
    for (const row of table[2].matchAll(/<table:table-row\b[^>]*?(?:\/>|>([\s\S]*?)<\/table:table-row>)/g)) {
      const cells = []
      for (const cell of (row[1] || '').matchAll(/<table:(?:covered-)?table-cell\b([^>]*?)(?:\/>|>([\s\S]*?)<\/table:(?:covered-)?table-cell>)/g)) {
        const repeat = Math.min(Number(cell[1].match(/table:number-columns-repeated="(\d+)"/)?.[1] || 1), 500)
        const value = cellText(cell[2] || '')
        for (let index = 0; index < repeat; index += 1) cells.push(value)
      }
      while (cells.length && !cells.at(-1)) cells.pop()
      if (cells.length) rows.push(cells)
    }
    sheets[decodeEntities(table[1])] = rows
  }
  return sheets
}

function htmlTables(html) {
  return [...html.matchAll(/<table\b[\s\S]*?<\/table>/g)].map((table) =>
    [...table[0].matchAll(/<tr\b[\s\S]*?<\/tr>/g)]
      .map((row) => [...row[0].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/g)].map((cell) => clean(cell[1].replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, ''))))
      .filter((cells) => cells.length),
  )
}

async function attachmentAsset(publicationPath, pattern) {
  const publication = await content(publicationPath)
  const asset = (publication.details.attachments || []).find((item) => pattern.test(item.url || ''))
  if (!asset) throw new Error(`No attachment matching ${pattern} on ${publicationPath}`)
  return { publication, url: asset.url, title: clean(asset.title || publication.title) }
}

const register = (id, meta, records) => ({
  id,
  publisher: 'HM Revenue & Customs · GOV.UK',
  licence: 'Open Government Licence v3.0',
  checked_on: checkedOn,
  ...meta,
  record_count: records.length,
  records,
})

// ---------- DE 1/10 procedure codes ----------
async function procedureCodes(direction, publicationPath) {
  const publication = await content(publicationPath)
  const children = publication.details.attachments.map((item) => ({ title: clean(item.title), path: item.url }))
  const index = children.find((item) => /index/i.test(item.title) || /^Appendix 1/i.test(item.title))
  const indexPage = await content(index.path)
  const html = indexPage.details.body
  const records = []
  const sections = html.split(/<h[23][^>]*>/).slice(1)
  for (const section of sections) {
    const heading = clean(section.split(/<\/h[23]>/)[0].replace(/<[^>]+>/g, ''))
    const series = heading.match(/^Requested procedure (\d{2})/i)?.[1]
    if (!series) continue
    const child = children.find((item) => new RegExp(`^Requested procedure ${series}\\b`, 'i').test(item.title))
    for (const table of htmlTables(section)) {
      for (const [code, description] of table) {
        if (!/^\d{4}$/.test(code)) continue
        records.push({
          code,
          title: description,
          requested_procedure: code.slice(0, 2),
          previous_procedure: code.slice(2),
          series_heading: heading,
          direction,
          source_url: `${GOVUK}${child?.path || index.path}`,
          index_url: `${GOVUK}${index.path}`,
          source_updated: publication.public_updated_at.slice(0, 10),
          checked_on: checkedOn,
        })
      }
    }
  }
  const categories = []
  for (const table of htmlTables(html)) {
    if (!/Declaration Category/i.test(table[0]?.join(' ') || '')) continue
    for (const row of table.slice(1)) {
      if (row.length >= 3) categories.push({ category: row[0], title: row[1].split('\n')[0], requested_procedures: row[2] })
    }
  }
  return { records, categories, publication_url: `${GOVUK}${publicationPath}`, source_updated: publication.public_updated_at.slice(0, 10) }
}

// ---------- DE 1/11 additional procedure codes ----------
async function additionalProcedureCodes(direction, publicationPath) {
  const publication = await content(publicationPath)
  const children = publication.details.attachments.map((item) => ({ title: clean(item.title), path: item.url }))
  const index = children.find((item) => /index list/i.test(item.title))
  const html = (await content(index.path)).details.body
  const records = []
  const seen = new Set()
  for (const table of htmlTables(html)) {
    for (const [code, description] of table) {
      if (!/^[A-Z0-9]{3}$/.test(code) || seen.has(code)) continue
      seen.add(code)
      const series = /^[A-F]/.test(code) ? `${code[0]}-Series` : `${code[0]}-Series`
      const child = children.find((item) => item.title.includes(`Code ${series}`) || item.title.includes(`${code[0]}-Series`))
      records.push({
        code,
        title: description,
        family: /^[A-F]/.test(code) ? 'Union' : 'National',
        direction,
        source_url: `${GOVUK}${child?.path || index.path}`,
        index_url: `${GOVUK}${index.path}`,
        source_updated: publication.public_updated_at.slice(0, 10),
        checked_on: checkedOn,
      })
    }
  }
  return { records, publication_url: `${GOVUK}${publicationPath}`, source_updated: publication.public_updated_at.slice(0, 10) }
}

// ---------- 4-digit to 3-digit correlation matrix ----------
async function correlation(direction, publicationPath) {
  const { publication, url } = await attachmentAsset(publicationPath, /\.ods$/i)
  const sheets = odsSheets(await binary(url))
  const rows = Object.values(sheets).find((sheet) => sheet[0]?.[0] === 'Correlation matrix')
  const header = rows[0]
  const valid = {}
  for (const row of rows.slice(1)) {
    const apc = row[0].replace(/^APC\s+/i, '').trim()
    header.slice(1).forEach((procedure, index) => {
      if (/^yes/i.test(row[index + 1] || '')) (valid[procedure] ||= []).push(apc)
    })
  }
  return {
    direction,
    publication_url: `${GOVUK}${publicationPath}`,
    asset_url: url,
    source_updated: publication.public_updated_at.slice(0, 10),
    checked_on: checkedOn,
    valid,
  }
}

// ---------- DE 2/3 document codes ----------
async function documentCodes(family, publicationPath) {
  const { publication, url } = await attachmentAsset(publicationPath, /\.ods$/i)
  const sheets = odsSheets(await binary(url))
  const rows = sheets.Document_Codes || Object.values(sheets)[0]
  const records = []
  const counts = {}
  for (const row of rows.slice(1)) {
    const code = row[0]
    if (!/^[A-Z0-9]{4}$/.test(code)) continue
    counts[code] = (counts[code] || 0) + 1
    records.push({
      code,
      variant: counts[code],
      family,
      direction: row[1] || '',
      title: row[2] || '',
      details: row[3] || '',
      status_codes: row[4] || '',
      document_id: row[5] || '',
      document_reason: row[6] || '',
      source_url: `${GOVUK}${publicationPath}`,
      asset_url: url,
      source_updated: publication.public_updated_at.slice(0, 10),
      checked_on: checkedOn,
    })
  }
  return { records, publication_url: `${GOVUK}${publicationPath}`, asset_url: url, source_updated: publication.public_updated_at.slice(0, 10) }
}

async function documentStatusCodes() {
  const path = '/guidance/data-element-23-document-status-codes-of-the-customs-declaration-service-cds'
  const { publication, url } = await attachmentAsset(path, /\.ods$/i)
  const rows = Object.values(odsSheets(await binary(url)))[0]
  return {
    publication_url: `${GOVUK}${path}`,
    asset_url: url,
    source_updated: publication.public_updated_at.slice(0, 10),
    records: rows
      .slice(1)
      .filter((row) => /^[A-Z]{2}$/.test(row[0]))
      .map(([code, title]) => ({ code, title, source_url: `${GOVUK}${path}`, checked_on: checkedOn })),
  }
}

// ---------- CDS error codes ----------
async function errorCodes() {
  const path = '/government/publications/customs-declaration-service-error-codes'
  const { publication, url } = await attachmentAsset(path, /\.ods$/i)
  const rows = Object.values(odsSheets(await binary(url)))[0]
  return {
    publication_url: `${GOVUK}${path}`,
    asset_url: url,
    source_updated: publication.public_updated_at.slice(0, 10),
    records: rows
      .slice(1)
      .filter((row) => /^CDS\d{5}$/.test(row[0]))
      .map(([code, title, explanation = '']) => {
        const [meaning, ...rest] = explanation.split(/\n\s*\n/)
        return {
          code,
          title,
          meaning: clean(meaning || title),
          check: clean(rest.join('\n\n')),
          source_url: `${GOVUK}${path}`,
          asset_url: url,
          checked_on: checkedOn,
        }
      }),
  }
}

async function knownErrors() {
  const path = '/government/publications/known-error-workarounds-for-the-customs-declaration-service-cds'
  const { publication, url } = await attachmentAsset(path, /\.ods$/i)
  const sheets = odsSheets(await binary(url))
  const records = []
  for (const [sheet, kind, detailIndex, workaroundIndex, statusIndex] of [
    ['KEL_-_Workarounds', 'KEL', 4, 5, 6],
    ['Known_Difference_-_Workarounds', 'KD', 4, 5, 6],
  ]) {
    for (const row of (sheets[sheet] || []).slice(1)) {
      const codes = (row[3] || '').match(/CDS\d{5}/g) || []
      if (!codes.length) continue
      records.push({
        code: kind === 'KEL' ? `KEL ${row[0]}` : row[0],
        title: row[1],
        error_codes: codes,
        category: row[2] || '',
        meaning: row[detailIndex] || '',
        workaround: row[workaroundIndex] || '',
        status: row[statusIndex] || '',
        source_url: `${GOVUK}${path}`,
        asset_url: url,
        checked_on: checkedOn,
      })
    }
  }
  return { publication_url: `${GOVUK}${path}`, asset_url: url, source_updated: publication.public_updated_at.slice(0, 10), records }
}

const importProcedures = await procedureCodes('Import', '/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes-of-the-customs-declaration-service-cds')
const exportProcedures = await procedureCodes('Export', '/government/publications/appendix-1-de-110-requested-and-previous-procedure-codes')
const importApcs = await additionalProcedureCodes('Import', '/government/publications/appendix-2-de-111-additional-procedure-codes-of-the-customs-declaration-service-cds')
const exportApcs = await additionalProcedureCodes('Export', '/government/publications/appendix-2-de-111-additional-procedure-codes')
const importMatrix = await correlation('Import', '/government/publications/4-digit-to-3-digit-procedure-to-additional-procedure-code-correlation-matrix-for-cds')
const exportMatrix = await correlation('Export', '/government/publications/4-digit-to-3-digit-procedure-to-additional-procedure-code-correlation-matrix-for-exports')

await writeFile(
  join(here, 'cds-procedure-codes.json'),
  `${JSON.stringify(
    register('cds-procedure-codes', {
      title: 'CDS procedure codes: DE 1/10 and DE 1/11 with the correlation matrix',
      sources: {
        import_procedures: { url: importProcedures.publication_url, updated: importProcedures.source_updated },
        export_procedures: { url: exportProcedures.publication_url, updated: exportProcedures.source_updated },
        import_additional: { url: importApcs.publication_url, updated: importApcs.source_updated },
        export_additional: { url: exportApcs.publication_url, updated: exportApcs.source_updated },
        import_matrix: { url: importMatrix.publication_url, asset: importMatrix.asset_url, updated: importMatrix.source_updated },
        export_matrix: { url: exportMatrix.publication_url, asset: exportMatrix.asset_url, updated: exportMatrix.source_updated },
      },
      categories: { Import: importProcedures.categories, Export: exportProcedures.categories },
      additional: [...importApcs.records, ...exportApcs.records],
      matrix: { Import: importMatrix.valid, Export: exportMatrix.valid },
    }, [...importProcedures.records, ...exportProcedures.records]),
    null,
    1,
  )}\n`,
)

const union = await documentCodes('Union', '/government/publications/data-element-23-documents-and-other-reference-codes-union-of-the-customs-declaration-service-cds')
const national = await documentCodes('National', '/guidance/data-element-23-documents-and-other-reference-codes-national-of-the-customs-declaration-service-cds')
const statuses = await documentStatusCodes()
await writeFile(
  join(here, 'cds-document-codes.json'),
  `${JSON.stringify(
    register('cds-document-codes', {
      title: 'CDS document codes: DE 2/3 Appendix 5A (Union and National) with Appendix 5B status codes',
      sources: {
        union: { url: union.publication_url, asset: union.asset_url, updated: union.source_updated },
        national: { url: national.publication_url, asset: national.asset_url, updated: national.source_updated },
        status: { url: statuses.publication_url, asset: statuses.asset_url, updated: statuses.source_updated },
      },
      status_codes: statuses.records,
    }, [...union.records, ...national.records]),
    null,
    1,
  )}\n`,
)

const errors = await errorCodes()
const workarounds = await knownErrors()
await writeFile(
  join(here, 'cds-error-codes.json'),
  `${JSON.stringify(
    register('cds-error-codes', {
      title: 'Customs Declaration Service error codes with current known-error workarounds',
      sources: {
        errors: { url: errors.publication_url, asset: errors.asset_url, updated: errors.source_updated },
        workarounds: { url: workarounds.publication_url, asset: workarounds.asset_url, updated: workarounds.source_updated },
      },
      workarounds: workarounds.records,
    }, errors.records),
    null,
    1,
  )}\n`,
)

console.log(
  `Reference registers refreshed ${checkedOn}: ${importProcedures.records.length + exportProcedures.records.length} procedure codes, ` +
    `${importApcs.records.length + exportApcs.records.length} additional procedure codes, ${union.records.length + national.records.length} document codes, ` +
    `${errors.records.length} error codes, ${workarounds.records.length} open workarounds linked to error codes`,
)

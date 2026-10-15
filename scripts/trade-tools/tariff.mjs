// Commodity code checker helpers for the UK Trade Tariff public API
// (https://www.trade-tariff.service.gov.uk/uk/api, CORS-open, no key, checked 15 Oct 2026).
// The browser calls the API directly; nothing passes through Declarix.
// Self-contained: the page script inlines this file.

export const TARIFF_API = 'https://www.trade-tariff.service.gov.uk/uk/api'
export const TARIFF_SITE = 'https://www.trade-tariff.service.gov.uk'

export function normaliseCodeQuery(input) {
  const raw = String(input || '').trim()
  const digits = raw.replace(/[\s.\-]/g, '')
  if (/^\d+$/.test(digits)) {
    const level = digits.length <= 2 ? 'chapter' : digits.length <= 4 ? 'heading' : digits.length <= 6 ? 'subheading' : 'commodity'
    return { kind: 'code', query: digits, level, valid: [2, 4, 6, 8, 10].includes(digits.length) }
  }
  return { kind: 'text', query: raw.replace(/\s+/g, ' ').slice(0, 120), level: null, valid: raw.length >= 2 }
}

export function formatCode(code) {
  const digits = String(code || '').replace(/\D/g, '')
  if (digits.length !== 10) return digits
  return `${digits.slice(0, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
}

export function tariffLinks(code) {
  const digits = String(code || '').replace(/\D/g, '')
  if (digits.length >= 10 || digits.length === 8) return `${TARIFF_SITE}/commodities/${digits.padEnd(10, '0')}`
  if (digits.length >= 4) return `${TARIFF_SITE}/headings/${digits.slice(0, 4)}`
  if (digits.length === 2) return `${TARIFF_SITE}/chapters/${digits}`
  return `${TARIFF_SITE}/find_commodity`
}

export function searchLink(text) {
  return `${TARIFF_SITE}/search?q=${encodeURIComponent(String(text || '').trim())}`
}

const stripHtml = (value) => String(value || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()

// Turns a /search response into either an exact pointer or a ranked candidate list.
export function parseSearch(json) {
  const attributes = json?.data?.attributes || {}
  if (attributes.type === 'exact_match' && attributes.entry?.endpoint) {
    return { type: 'exact', endpoint: attributes.entry.endpoint, id: String(attributes.entry.id) }
  }
  const candidates = []
  const seen = new Set()
  const push = (source, via) => {
    const code = source?.goods_nomenclature_item_id
    if (!code || seen.has(code + (source.producline_suffix || ''))) return
    seen.add(code + (source.producline_suffix || ''))
    const path = (source.ancestor_descriptions || []).map(stripHtml)
    candidates.push({
      code,
      suffix: source.producline_suffix || '80',
      description: stripHtml(source.description),
      path: path.length ? path : [stripHtml(source.heading?.description), stripHtml(source.description)].filter(Boolean),
      chapter: stripHtml(source.chapter?.description),
      declarable: Boolean(source.declarable),
      via,
    })
  }
  const nomenclature = attributes.goods_nomenclature_match || {}
  for (const group of ['commodities', 'headings', 'chapters']) {
    for (const hit of nomenclature[group] || []) push(hit._source, 'description')
  }
  const references = attributes.reference_match || {}
  for (const group of ['commodities', 'headings', 'chapters']) {
    for (const hit of references[group] || []) push({ ...hit._source?.reference, title: hit._source?.title }, 'index')
  }
  return { type: 'candidates', candidates: candidates.slice(0, 12) }
}

// Lists the declarable leaves under a heading or subheading response.
export function parseHeading(json) {
  const leaves = (json?.included || [])
    .filter((item) => item.type === 'commodity' && item.attributes?.leaf)
    .map((item) => ({
      code: item.attributes.goods_nomenclature_item_id,
      suffix: item.attributes.producline_suffix || '80',
      description: stripHtml(item.attributes.description_plain || item.attributes.description),
      indents: item.attributes.number_indents,
    }))
  return {
    code: json?.data?.attributes?.goods_nomenclature_item_id || '',
    description: stripHtml(json?.data?.attributes?.description_plain || json?.data?.attributes?.description),
    declarable: Boolean(json?.data?.attributes?.declarable),
    leaves,
  }
}

const ALL_AREAS = new Set(['1011', '1400'])

// Summarises a /commodities/{code} response, optionally for one origin country.
export function parseCommodity(json, { origin = '' } = {}) {
  const data = json?.data
  if (!data) throw new Error('No commodity in response')
  const included = json.included || []
  const index = new Map(included.map((item) => [`${item.type}:${item.id}`, item]))
  const get = (ref) => (ref ? index.get(`${ref.type}:${ref.id}`) : null)
  const rel = data.relationships || {}
  const path = [
    stripHtml(get(rel.section?.data)?.attributes?.title),
    stripHtml(get(rel.chapter?.data)?.attributes?.formatted_description || get(rel.chapter?.data)?.attributes?.description),
    stripHtml(get(rel.heading?.data)?.attributes?.formatted_description || get(rel.heading?.data)?.attributes?.description),
    ...((rel.ancestors?.data || []).map((ref) => stripHtml(get(ref)?.attributes?.formatted_description || get(ref)?.attributes?.description))),
    stripHtml(data.attributes.formatted_description || data.attributes.description),
  ].filter(Boolean)
  const summary = included.find((item) => item.type === 'import_trade_summary')
  const areaCovers = (areaId, country) => {
    if (!country) return ALL_AREAS.has(areaId)
    if (ALL_AREAS.has(areaId) || areaId === country) return true
    const area = index.get(`geographical_area:${areaId}`)
    return (area?.relationships?.children_geographical_areas?.data || []).some((child) => child.id === country)
  }
  const measures = (rel.import_measures?.data || []).map((ref) => get(ref)).filter(Boolean).map((measure) => {
    const type = get(measure.relationships?.measure_type?.data)
    const areaId = measure.relationships?.geographical_area?.data?.id || ''
    const area = index.get(`geographical_area:${areaId}`)
    const duty = get(measure.relationships?.duty_expression?.data)
    const excluded = (measure.relationships?.excluded_countries?.data || []).map((item) => item.id)
    const conditions = (measure.relationships?.measure_conditions?.data || []).map((ref) => get(ref)?.attributes).filter(Boolean)
    return {
      type: type?.attributes?.description || '',
      typeId: type?.id || '',
      series: type?.attributes?.measure_type_series_id || '',
      areaId,
      area: area?.attributes?.description || areaId,
      duty: stripHtml(duty?.attributes?.verbose_duty || duty?.attributes?.base),
      excluded,
      documents: conditions
        .filter((condition) => condition.document_code)
        .map((condition) => ({ code: condition.document_code, description: stripHtml(condition.certificate_description || condition.requirement), action: condition.action })),
    }
  })
  const applies = (measure) => areaCovers(measure.areaId, origin) && !(origin && measure.excluded.includes(origin))
  const vat = [...new Set(measures.filter((measure) => measure.typeId === '305' || /value added tax/i.test(measure.type)).map((measure) => measure.duty).filter(Boolean))]
  const preferences = measures
    .filter((measure) => /tariff preference|preferential tariff quota/i.test(measure.type))
    .map((measure) => ({ area: measure.area, areaId: measure.areaId, duty: measure.duty, quota: /quota/i.test(measure.type), documents: measure.documents }))
  const relevant = measures.filter(applies)
  const documentMap = new Map()
  for (const measure of relevant) {
    for (const doc of measure.documents) {
      if (!documentMap.has(doc.code)) documentMap.set(doc.code, { code: doc.code, description: doc.description, measures: new Set() })
      documentMap.get(doc.code).measures.add(measure.type)
    }
  }
  const supplementary = measures.find((measure) => /supplementary unit/i.test(measure.type))
  const originPreference = origin ? relevant.filter((measure) => /tariff preference|preferential tariff quota/i.test(measure.type)) : []
  return {
    code: data.attributes.goods_nomenclature_item_id,
    formatted: formatCode(data.attributes.goods_nomenclature_item_id),
    description: stripHtml(data.attributes.formatted_description || data.attributes.description),
    declarable: Boolean(data.attributes.declarable),
    path,
    thirdCountryDuty: stripHtml(summary?.attributes?.basic_third_country_duty) || (measures.find((measure) => measure.typeId === '103')?.duty ?? ''),
    vat,
    supplementaryUnit: supplementary ? supplementary.duty : '',
    preferences,
    originPreference: originPreference.map((measure) => ({ area: measure.area, duty: measure.duty, type: measure.type })),
    additionalDuties: relevant.filter((measure) => /additional duties|anti-dumping|countervailing|safeguard/i.test(measure.type)).map((measure) => ({ type: measure.type, area: measure.area, duty: measure.duty })),
    controls: relevant.filter((measure) => measure.series === 'B' || /restriction|control|prohibition|licen/i.test(measure.type)).map((measure) => ({ type: measure.type, area: measure.area })),
    documents: [...documentMap.values()].map((doc) => ({ code: doc.code, description: doc.description, measures: [...doc.measures] })),
    officialUrl: tariffLinks(data.attributes.goods_nomenclature_item_id),
    btiUrl: data.attributes.bti_url || 'https://www.gov.uk/guidance/apply-for-a-binding-tariff-information-decision',
  }
}

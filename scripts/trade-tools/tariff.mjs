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

// Plain-language searches (issue CC1, 16 Oct 2026). The UK Trade Tariff search
// (GET /uk/api/search?q=…) matches every word, so "mens t-shirts cotton knitted"
// returns nothing while "t-shirts cotton knitted" returns 6109 10 00 10. Checked with
// curl on 16 Oct 2026. The page tries the words as typed first, then these variants in order.
const PEOPLE_WORDS = new Set(['men', 'mens', 'man', 'male', 'gents', 'gentlemen', 'women', 'womens', 'woman', 'female', 'ladies', 'lady', 'boys', 'boy', 'girls', 'girl', 'kids', 'kid', 'children', 'childrens', 'child', 'baby', 'babies', 'babys', 'infant', 'infants', 'toddler', 'toddlers', 'unisex', 'adult', 'adults', 'youth', 'junior', 'juniors'])
const FILLER_WORDS = new Set(['a', 'an', 'the', 'for', 'of', 'with', 'and', 'in', 'on', 'to', 'new', 'pcs', 'pc', 'piece', 'pieces', 'assorted', 'various', 'style', 'quality', 'premium', 'brand', 'branded', 'x'])
const CONSTRUCTION_WORDS = new Set(['knitted', 'knit', 'knits', 'crocheted', 'crochet', 'woven', 'handmade', 'hand-made'])
const SYNONYMS = new Map([['tshirt', 't-shirts'], ['tshirts', 't-shirts'], ['tee', 't-shirts'], ['tees', 't-shirts'], ['teeshirt', 't-shirts'], ['teeshirts', 't-shirts'], ['sneakers', 'trainers'], ['sneaker', 'trainers']])
const KEEP_S = /(ss|us|is|ics|ous|shoes|clothes|trousers|jeans|glasses|scissors|pliers|tongs)$/

export function singularWord(word) {
  if (word.length <= 3 || KEEP_S.test(word)) return word
  if (/ies$/.test(word)) return word.slice(0, -3) + 'y'
  if (/(ches|shes|xes|sses|zes)$/.test(word)) return word.slice(0, -2)
  if (/s$/.test(word)) return word.slice(0, -1)
  return word
}

export function goodsWords(input) {
  const words = String(input || '')
    .toLowerCase()
    .replace(/\bt\s+shirts?\b/g, 't-shirts')
    .replace(/[’']s?\b/g, '')
    .replace(/[^a-z0-9\- ]+/g, ' ')
    .split(/\s+/)
    .map((word) => word.replace(/^-+|-+$/g, ''))
    .filter(Boolean)
    .map((word) => SYNONYMS.get(word) || word)
  return [...new Set(words)].filter((word) => !PEOPLE_WORDS.has(word) && !FILLER_WORDS.has(word))
}

// Ordered retry queries for a description that found nothing: drop people and filler
// words, then construction words, then singular forms, then the last two words (usually the goods
// noun), then one word at a time, then pairs. Two-word searches fall back to the last word.
export function searchVariants(input, { limit = 8 } = {}) {
  const typed = String(input || '').trim().replace(/\s+/g, ' ').toLowerCase()
  const words = goodsWords(input)
  const core = words.filter((word) => !CONSTRUCTION_WORDS.has(word))
  const base = core.length ? core : words
  const list = [words, base, base.map(singularWord)]
  if (base.length >= 3) list.push(base.slice(-2))
  if (base.length >= 3) base.forEach((_, skip) => list.push(base.filter((__, index) => index !== skip)))
  if (base.length >= 4) for (let i = 0; i < base.length; i += 1) for (let j = i + 1; j < base.length; j += 1) list.push([base[i], base[j]])
  if (base.length === 2) list.push([base[1]], [base[0]])
  const seen = new Set([typed])
  const variants = []
  for (const option of list) {
    const query = option.join(' ')
    if (!query || query.length < 2 || seen.has(query)) continue
    seen.add(query)
    variants.push(query)
    if (variants.length >= limit) break
  }
  return variants
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

// "20.00%" -> "20%", "12.00 %" -> "12%"; other duty expressions are left as the tariff gives them.
export const shortRate = (value) => String(value || '').replace(/^(\d+)(?:\.0+)?\s?%$/, '$1%').replace(/^(\d+\.\d*?[1-9])0+\s?%$/, '$1%')

// Measures that only apply to goods put to a special end use (ships, aircraft, platforms)
// or held under an end-use authorisation. Issue CC2: these sit apart from the origin's documents.
const END_USE_CODES = /^(C990|N990)$/
export const isEndUseMeasure = (measure) =>
  /suspension|end[- ]use|airworth|ships|platforms|aircraft/i.test(measure.type) || measure.documents.some((doc) => END_USE_CODES.test(doc.code))
const isPreference = (measure) => /tariff preference|preferential tariff quota/i.test(measure.type)

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
    const additional = get(measure.relationships?.additional_code?.data)?.attributes
    const footnotes = (measure.relationships?.footnotes?.data || []).map((ref) => stripHtml(get(ref)?.attributes?.description)).filter(Boolean)
    return {
      type: type?.attributes?.description || '',
      typeId: type?.id || '',
      series: type?.attributes?.measure_type_series_id || '',
      areaId,
      area: area?.attributes?.description || areaId,
      duty: stripHtml(duty?.attributes?.verbose_duty || duty?.attributes?.base),
      excluded,
      additionalCode: additional?.code || '',
      additionalDescription: stripHtml(additional?.description || ''),
      footnotes,
      documents: conditions
        .filter((condition) => condition.document_code)
        .map((condition) => ({ code: condition.document_code, description: stripHtml(condition.certificate_description || condition.requirement), action: condition.action })),
    }
  })
  const applies = (measure) => areaCovers(measure.areaId, origin) && !(origin && measure.excluded.includes(origin))
  const vatMeasures = measures.filter((measure) => measure.typeId === '305' || /value added tax/i.test(measure.type))
  const vat = [...new Set(vatMeasures.map((measure) => measure.duty).filter(Boolean))]
  // Issue CC4: the standard VAT measure carries no additional code (footnote "UK VAT standard
  // rate"); zero and reduced rates carry a VAT additional code (VATZ, VATR) for a listed relief.
  const standardVat = vatMeasures.find((measure) => !measure.additionalCode) || null
  const vatReliefs = vatMeasures
    .filter((measure) => measure !== standardVat && measure.duty)
    .map((measure) => ({ rate: shortRate(measure.duty), code: measure.additionalCode, description: measure.additionalDescription || measure.footnotes[0] || '' }))
  const vatSummary = standardVat
    ? `${shortRate(standardVat.duty)} (standard).${vatReliefs.length ? ' ' + [...new Set(vatReliefs.map((relief) => relief.rate))].join(' or ') + ' applies only to the listed reliefs: ' + vatReliefs.map((relief) => (relief.description || 'relief') + (relief.code ? ' (' + relief.code + ')' : '')).join('; ') + '.' : ''}`
    : vat.map(shortRate).join(' or ')
  const preferences = measures
    .filter(isPreference)
    .map((measure) => ({ area: measure.area, areaId: measure.areaId, duty: measure.duty, quota: /quota/i.test(measure.type), documents: measure.documents }))
  const relevant = measures.filter(applies)
  const endUse = relevant.filter((measure) => !isPreference(measure) && isEndUseMeasure(measure))
  const originMeasures = relevant.filter((measure) => !isPreference(measure) && !isEndUseMeasure(measure))
  const collect = (list) => {
    const documentMap = new Map()
    for (const measure of list) {
      for (const doc of measure.documents) {
        if (!documentMap.has(doc.code)) documentMap.set(doc.code, { code: doc.code, description: doc.description, measures: new Set() })
        documentMap.get(doc.code).measures.add(measure.type)
      }
    }
    return [...documentMap.values()].map((doc) => ({ code: doc.code, description: doc.description, measures: [...doc.measures] }))
  }
  const supplementary = measures.find((measure) => /supplementary unit/i.test(measure.type))
  const originPreference = origin ? relevant.filter(isPreference) : []
  return {
    code: data.attributes.goods_nomenclature_item_id,
    formatted: formatCode(data.attributes.goods_nomenclature_item_id),
    description: stripHtml(data.attributes.formatted_description || data.attributes.description),
    declarable: Boolean(data.attributes.declarable),
    path,
    thirdCountryDuty: stripHtml(summary?.attributes?.basic_third_country_duty) || (measures.find((measure) => measure.typeId === '103')?.duty ?? ''),
    vat,
    vatSummary,
    vatReliefs,
    supplementaryUnit: supplementary ? supplementary.duty : '',
    preferences,
    originPreference: originPreference.map((measure) => ({ area: measure.area, areaId: measure.areaId, duty: measure.duty, type: measure.type, documents: measure.documents.map(({ code, description }) => ({ code, description })) })),
    additionalDuties: originMeasures.filter((measure) => /additional duties|anti-dumping|countervailing|safeguard/i.test(measure.type)).map((measure) => ({ type: measure.type, area: measure.area, duty: measure.duty })),
    controls: originMeasures.filter((measure) => measure.series === 'B' || /restriction|control|prohibition|licen/i.test(measure.type)).map((measure) => ({ type: measure.type, area: measure.area })),
    // Document codes for the chosen origin at its normal rate: no preference proofs (shown under
    // the preference) and no end-use authorisations (shown under "Other measures on this line").
    documents: collect(originMeasures),
    endUse: endUse.map((measure) => ({ type: measure.type, area: measure.area, duty: measure.duty, documents: measure.documents.map(({ code, description }) => ({ code, description })) })),
    endUseDocuments: collect(endUse),
    officialUrl: tariffLinks(data.attributes.goods_nomenclature_item_id),
    btiUrl: data.attributes.bti_url || 'https://www.gov.uk/guidance/apply-for-a-binding-tariff-information-decision',
  }
}

// Issue CC3: the proof of origin behind a preference. GET /uk/api/rules_of_origin_schemes/{6 digits}/{country}
// (UK Trade Tariff, CORS-open, checked 16 Oct 2026) lists each scheme's accepted proofs and, for some
// schemes, the DE 2/3 document codes (DCTS: 9001 origin declaration, N865 Form A). GOV.UK "Get proof
// of origin for your goods" (updated 6 Nov 2024): the proof is noted on the customs declaration.
export const ORIGIN_PROOF_GUIDE = 'https://www.gov.uk/guidance/get-proof-of-origin-for-your-goods'

export function parseRulesOfOrigin(json) {
  const included = new Map((json?.included || []).map((item) => [`${item.type}:${item.id}`, item]))
  return (json?.data || []).map((scheme) => {
    const attributes = scheme.attributes || {}
    const proofs = (scheme.relationships?.proofs?.data || [])
      .map((ref) => included.get(`${ref.type}:${ref.id}`)?.attributes)
      .filter(Boolean)
      .map((proof) => ({ summary: stripHtml(proof.summary), subtext: stripHtml(proof.subtext), url: proof.url && proof.url !== 'None' ? proof.url : '' }))
    const codeText = String(attributes.proof_codes?.['DE 2/3'] || '')
    const codes = [...codeText.matchAll(/\*\*([A-Z0-9]{4})\*\*\s*\(([^)]+)\)/g)].map((match) => ({ code: match[1], label: match[2].trim() }))
    return { scheme: attributes.scheme_code || scheme.id, title: stripHtml(attributes.title), proofs, codes }
  })
}

// One copyable line per preference: the proof the exporter (or importer) provides, and the DE 2/3 codes.
export function originProofLine(schemes, preferenceDocuments = []) {
  const parts = []
  for (const scheme of schemes || []) {
    const names = scheme.proofs.map((proof) => {
      const code = scheme.codes.find((item) => item.label.toLowerCase().includes(proof.summary.toLowerCase().replace(/^generalised scheme of preferences /, '').toLowerCase()) || proof.summary.toLowerCase().includes(item.label.toLowerCase()))
      return proof.summary + (code ? ` (code ${code.code})` : '')
    })
    const unmatched = scheme.codes.filter((item) => !names.some((name) => name.includes(`code ${item.code}`)))
    names.push(...unmatched.map((item) => `${item.label} (code ${item.code})`))
    if (names.length) parts.push(names.join(' or '))
  }
  const docs = preferenceDocuments.filter((doc) => doc.code).map((doc) => `${doc.code}: ${doc.description}`)
  if (!parts.length && !docs.length) return ''
  const lines = parts.length ? [`Proof of origin: ${parts.join('; ')}.`] : []
  if (docs.length) lines.push(`Declare in DE 2/3: ${docs.join('; ').replace(/\.$/, '')}.`)
  else if ((schemes || []).some((scheme) => scheme.codes.length)) lines.push('Declare the code in DE 2/3.')
  return lines.join(' ')
}

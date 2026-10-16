import { breadcrumbHtml, breadcrumbList, nameForPath, organizationNode } from './site-graph.mjs'
// Free browser-only document generators: commercial invoice (P37) and packing list (P36).
// One shared engine. The pure functions below run in Node for tests and are injected
// verbatim into each page, so the arithmetic the tests prove is the arithmetic users run.

const CURRENCIES = ['GBP', 'EUR', 'USD', 'CNY', 'JPY', 'CHF', 'CAD', 'AUD', 'INR', 'TRY', 'HKD', 'SGD', 'AED', 'SEK', 'NOK', 'DKK', 'PLN', 'KRW']
const INCOTERMS = [
  ['EXW', 'EXW · Ex Works'],
  ['FCA', 'FCA · Free Carrier'],
  ['CPT', 'CPT · Carriage Paid To'],
  ['CIP', 'CIP · Carriage and Insurance Paid To'],
  ['DAP', 'DAP · Delivered at Place'],
  ['DPU', 'DPU · Delivered at Place Unloaded'],
  ['DDP', 'DDP · Delivered Duty Paid'],
  ['FAS', 'FAS · Free Alongside Ship'],
  ['FOB', 'FOB · Free on Board'],
  ['CFR', 'CFR · Cost and Freight'],
  ['CIF', 'CIF · Cost, Insurance and Freight'],
]
const TRANSPORT_MODES = [
  ['', 'Select if known'],
  ['sea', 'Sea'],
  ['air', 'Air'],
  ['road', 'Road'],
  ['rail', 'Rail'],
  ['post', 'Postal / courier'],
  ['multimodal', 'Multimodal'],
]
const UNITS = [
  ['pcs', 'pcs · pieces'],
  ['kg', 'kg · kilograms'],
  ['l', 'l · litres'],
  ['m', 'm · metres'],
  ['m2', 'm² · square metres'],
  ['m3', 'm³ · cubic metres'],
  ['pr', 'pr · pairs'],
  ['set', 'set · sets'],
  ['doz', 'doz · dozen'],
]
const PACKAGE_TYPES = [
  ['CT', 'CT · carton'],
  ['PX', 'PX · pallet'],
  ['CR', 'CR · crate'],
  ['BX', 'BX · box'],
  ['DR', 'DR · drum'],
  ['BG', 'BG · bag'],
  ['CS', 'CS · case'],
  ['PK', 'PK · package'],
]
const REASONS = [
  ['', 'Select if known'],
  ['sale', 'Sale'],
  ['return', 'Return'],
  ['repair', 'Repair or processing'],
  ['sample', 'Sample'],
  ['gift', 'Gift'],
  ['other', 'Other'],
]

const DOCUMENT_TYPES = [
  ['commercial', 'Commercial invoice'],
  ['proforma', 'Proforma invoice'],
]

const invoiceSchema = {
  kind: 'invoice',
  documentTitle: 'COMMERCIAL INVOICE',
  proformaTitle: 'PROFORMA INVOICE',
  numberField: 'invoiceNumber',
  groups: [
    { id: 'seller', title: 'Exporter / seller', note: 'The party selling and sending the goods.' },
    { id: 'buyer', title: 'Importer / buyer', note: 'The party buying and importing the goods.' },
    { id: 'refs', title: 'Invoice references and delivery', note: 'Number, date, currency and the Incoterm with its named place.' },
    { id: 'charges', title: 'Charges and adjustments', note: 'Amounts in the invoice currency. Leave blank where none apply.' },
    { id: 'declaration', title: 'Declaration and signature', note: 'The person who confirms the invoice is true and correct.' },
  ],
  fields: [
    { id: 'exporterName', group: 'seller', label: 'Exporter name', type: 'text', required: true, cds: 'DE 3/1', help: 'Legal name of the seller or exporter.', example: 'Beispiel Lager GmbH' },
    { id: 'exporterAddress', group: 'seller', label: 'Exporter address', type: 'textarea', required: true, cds: 'DE 3/1', help: 'Street, town, postcode and country.', example: 'Hafenstraße 1, 20457 Hamburg, Germany' },
    { id: 'exporterEori', group: 'seller', label: 'Exporter EORI', type: 'text', eori: true, cds: 'DE 3/2', help: 'Needed when the exporter holds one. EU numbers start with the country code.', example: 'DE1234567' },
    { id: 'exporterVat', group: 'seller', label: 'Exporter VAT number', type: 'text', help: 'Optional. Useful for the buyer and for VAT records.', example: 'DE123456789' },
    { id: 'importerName', group: 'buyer', label: 'Importer name', type: 'text', required: true, cds: 'DE 3/15', help: 'Legal name of the buyer or importer.', example: 'Harbour Example Trading Ltd' },
    { id: 'importerAddress', group: 'buyer', label: 'Importer address', type: 'textarea', required: true, cds: 'DE 3/15', help: 'Street, town, postcode and country.', example: 'Unit 4, Example Park, Leicester LE1 1AA, United Kingdom' },
    { id: 'importerEori', group: 'buyer', label: 'Importer EORI', type: 'text', eori: true, cds: 'DE 3/16', requiredUnless: { field: 'destinationCountry', values: ['GB'] }, requiredHint: 'Needed by the importer’s customs for EU deliveries.', help: 'A GB importer’s EORI starts with GB. Use XI for Northern Ireland movements where required.', example: 'GB123456789000' },
    { id: 'consignee', group: 'buyer', label: 'Consignee, if different', type: 'textarea', cds: 'DE 3/8', help: 'The party receiving the goods when it is not the importer.', example: '' },
    { id: 'documentType', group: 'refs', label: 'Document type', type: 'select', options: DOCUMENT_TYPES, help: 'Choose proforma when the goods ship before the sale or with no sale, such as samples or repairs.', example: 'commercial' },
    { id: 'invoiceNumber', group: 'refs', label: 'Invoice number', type: 'text', required: true, cds: 'DE 2/3 (N935)', help: 'Unique number. The declaration cites it as the invoice document.', example: 'INV-2026-0142' },
    { id: 'invoiceDate', group: 'refs', label: 'Invoice date', type: 'date', required: true, cds: 'DE 2/3', help: 'Date the invoice was issued.', example: '2026-10-15' },
    { id: 'orderRef', group: 'refs', label: 'Order or contract reference', type: 'text', help: 'Purchase order or contract number, if any.', example: 'PO-88231' },
    { id: 'currency', group: 'refs', label: 'Invoice currency', type: 'select', options: CURRENCIES.map((code) => [code, code]), required: true, cds: 'DE 4/10', help: 'The currency every price on the invoice uses.', example: 'EUR' },
    { id: 'incoterm', group: 'refs', label: 'Incoterm', type: 'select', options: INCOTERMS, required: true, cds: 'DE 4/1', help: 'Incoterms® 2020 rule agreed in the sale.', example: 'FCA' },
    { id: 'incotermPlace', group: 'refs', label: 'Incoterm named place', type: 'text', required: true, cds: 'DE 4/1', help: 'The place the rule names, for example “Hamburg”.', example: 'Hamburg, Germany' },
    { id: 'transportMode', group: 'refs', label: 'Mode of transport', type: 'select', options: TRANSPORT_MODES, cds: 'DE 7/4', help: 'Main mode at the border, if known.', example: 'sea' },
    { id: 'dispatchCountry', group: 'refs', label: 'Country of dispatch', type: 'text', country: true, cds: 'DE 5/14', help: 'Two-letter code, for example DE.', example: 'DE' },
    { id: 'destinationCountry', group: 'refs', label: 'Country of destination', type: 'text', country: true, cds: 'DE 5/8', help: 'Two-letter code, for example GB.', example: 'GB' },
    { id: 'packages', group: 'refs', label: 'Number and kind of packages', type: 'text', cds: 'DE 6/10, 6/9', help: 'How the goods are packed, for example “2 pallets” or “5 cartons”.', example: '5 cartons' },
    { id: 'reason', group: 'refs', label: 'Reason for export', type: 'select', options: REASONS, cds: 'DE 8/5', help: 'Sale, return, repair, sample or gift.', example: 'sale' },
    { id: 'paymentTerms', group: 'charges', label: 'Payment terms', type: 'text', help: 'For example “30 days from invoice date”.', example: '30 days from invoice date' },
    { id: 'discount', group: 'charges', label: 'Discount', type: 'money', cds: 'DE 4/9', help: 'Total discount deducted from the goods subtotal.', example: '50' },
    { id: 'freight', group: 'charges', label: 'Freight charged', type: 'money', cds: 'DE 4/9', help: 'Freight invoiced to the buyer, if shown separately.', example: '320' },
    { id: 'insurance', group: 'charges', label: 'Insurance charged', type: 'money', cds: 'DE 4/9', help: 'Insurance invoiced to the buyer, if shown separately.', example: '45' },
    { id: 'otherCharges', group: 'charges', label: 'Other charges', type: 'money', cds: 'DE 4/9', help: 'Packing or handling invoiced separately.', example: '0' },
    { id: 'signatoryName', group: 'declaration', label: 'Signatory name', type: 'text', required: true, help: 'The person confirming the invoice.', example: 'A. Example' },
    { id: 'signatoryPosition', group: 'declaration', label: 'Position', type: 'text', help: 'Job title of the signatory.', example: 'Export Manager' },
    { id: 'signaturePlace', group: 'declaration', label: 'Place of signature', type: 'text', help: 'Town where the invoice is signed.', example: 'Hamburg' },
  ],
  lineFields: [
    { id: 'description', label: 'Goods description', type: 'text', required: true, cds: 'DE 6/8', help: 'What the goods are, what they are made of and what they do. Avoid “parts” or “samples” alone.', example: 'Stainless steel ball bearings, 22 mm bore, for industrial pumps' },
    { id: 'commodityCode', label: 'Commodity code', type: 'text', commodity: true, cds: 'DE 6/14', help: '6, 8 or 10 digits from the UK Trade Tariff.', example: '848210' },
    { id: 'origin', label: 'Origin', type: 'text', country: true, required: true, cds: 'DE 5/15', help: 'Two-letter country of origin code.', example: 'DE' },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true, positive: true, cds: 'DE 6/2 (supplementary units, where the tariff requires them)', help: 'Number of units in the unit shown.', example: '400' },
    { id: 'unit', label: 'Unit', type: 'select', options: UNITS, help: 'Unit of the quantity.', example: 'pcs' },
    { id: 'netMass', label: 'Net kg', type: 'number', cds: 'DE 6/1', help: 'Net mass of the line in kilograms, without packaging.', example: '96' },
    { id: 'grossMass', label: 'Gross kg', type: 'number', cds: 'DE 6/5', help: 'Gross mass of the line in kilograms, with packaging.', example: '104' },
    { id: 'unitValue', label: 'Unit price', type: 'money', required: true, cds: 'DE 4/14', help: 'Price per unit in the invoice currency.', example: '6.85' },
  ],
  example: {
    header: {
      exporterName: 'Beispiel Lager GmbH',
      exporterAddress: 'Hafenstraße 1, 20457 Hamburg, Germany',
      exporterEori: 'DE1234567',
      exporterVat: 'DE123456789',
      importerName: 'Harbour Example Trading Ltd',
      importerAddress: 'Unit 4, Example Park, Leicester LE1 1AA, United Kingdom',
      importerEori: 'GB123456789000',
      consignee: '',
      documentType: 'commercial',
      invoiceNumber: 'INV-2026-0142',
      invoiceDate: '2026-10-15',
      orderRef: 'PO-88231',
      currency: 'EUR',
      incoterm: 'FCA',
      incotermPlace: 'Hamburg, Germany',
      transportMode: 'sea',
      dispatchCountry: 'DE',
      destinationCountry: 'GB',
      packages: '5 cartons',
      reason: 'sale',
      paymentTerms: '30 days from invoice date',
      discount: '50',
      freight: '320',
      insurance: '45',
      otherCharges: '0',
      signatoryName: 'A. Example',
      signatoryPosition: 'Export Manager',
      signaturePlace: 'Hamburg',
    },
    lines: [
      { description: 'Stainless steel ball bearings, 22 mm bore, for industrial pumps', commodityCode: '848210', origin: 'DE', quantity: '400', unit: 'pcs', netMass: '96', grossMass: '104', unitValue: '6.85' },
      { description: 'Vulcanised rubber gaskets, 60 mm, for pump housings', commodityCode: '401693', origin: 'CZ', quantity: '1200', unit: 'pcs', netMass: '18', grossMass: '21.5', unitValue: '0.42' },
    ],
  },
}

const packingSchema = {
  kind: 'packing',
  documentTitle: 'PACKING LIST',
  numberField: 'packingListNumber',
  groups: [
    { id: 'seller', title: 'Shipper / exporter', note: 'The party packing and sending the goods.' },
    { id: 'buyer', title: 'Consignee / importer', note: 'The party receiving the goods.' },
    { id: 'refs', title: 'Shipment references', note: 'Tie the list to the invoice and the transport document.' },
    { id: 'declaration', title: 'Prepared by', note: 'The person who checked the packed goods.' },
  ],
  fields: [
    { id: 'shipperName', group: 'seller', label: 'Shipper name', type: 'text', required: true, cds: 'DE 3/1', help: 'Legal name of the shipper or exporter.', example: 'Beispiel Lager GmbH' },
    { id: 'shipperAddress', group: 'seller', label: 'Shipper address', type: 'textarea', required: true, cds: 'DE 3/1', help: 'Street, town, postcode and country.', example: 'Hafenstraße 1, 20457 Hamburg, Germany' },
    { id: 'shipperEori', group: 'seller', label: 'Shipper EORI', type: 'text', eori: true, cds: 'DE 3/2', help: 'Needed when the shipper holds one.', example: 'DE1234567' },
    { id: 'consigneeName', group: 'buyer', label: 'Consignee name', type: 'text', required: true, cds: 'DE 3/8', help: 'Legal name of the receiving party.', example: 'Harbour Example Trading Ltd' },
    { id: 'consigneeAddress', group: 'buyer', label: 'Consignee address', type: 'textarea', required: true, cds: 'DE 3/8', help: 'Delivery address including postcode and country.', example: 'Unit 4, Example Park, Leicester LE1 1AA, United Kingdom' },
    { id: 'consigneeEori', group: 'buyer', label: 'Consignee or importer EORI', type: 'text', eori: true, cds: 'DE 3/16', help: 'Imports into the UK: the importer’s GB EORI (GB…). Exports to the EU: the customer’s EU EORI (for example IE… for Ireland). Add it and the forwarder will not have to ask.', example: 'GB123456789000' },
    { id: 'packingListNumber', group: 'refs', label: 'Packing list number', type: 'text', required: true, help: 'Your reference for this list.', example: 'PL-2026-0142' },
    { id: 'packingDate', group: 'refs', label: 'Date', type: 'date', required: true, help: 'Date the goods were packed.', example: '2026-10-15' },
    { id: 'invoiceNumber', group: 'refs', label: 'Commercial invoice number', type: 'text', linkInvoice: true, cds: 'DE 2/3 (N935)', help: 'The invoice this list supports. Reviewers match the two.', example: 'INV-2026-0142' },
    { id: 'transportMode', group: 'refs', label: 'Mode of transport', type: 'select', options: TRANSPORT_MODES, cds: 'DE 7/4', help: 'Main mode at the border, if known.', example: 'sea' },
    { id: 'transportDocument', group: 'refs', label: 'Transport document number', type: 'text', cds: 'DE 2/1', help: 'Bill of lading, air waybill or CMR number, if known.', example: 'HLCUHAM2610150001' },
    { id: 'containerNumber', group: 'refs', label: 'Container or trailer number', type: 'text', cds: 'DE 7/10', help: 'For containerised or trailer loads.', example: 'MSKU1234565' },
    { id: 'dispatchCountry', group: 'refs', label: 'Country of dispatch', type: 'text', country: true, cds: 'DE 5/14', help: 'Two-letter code, for example DE.', example: 'DE' },
    { id: 'destinationCountry', group: 'refs', label: 'Country of destination', type: 'text', country: true, cds: 'DE 5/8', help: 'Two-letter code, for example GB.', example: 'GB' },
    { id: 'preparedBy', group: 'declaration', label: 'Prepared by', type: 'text', required: true, help: 'Name of the person who checked the packing.', example: 'A. Example' },
  ],
  lineFields: [
    { id: 'marks', label: 'Marks and numbers', type: 'text', cds: 'DE 6/11', help: 'Shipping marks on the packages, for example “HX/0142 1–4”.', example: 'HX/0142 1-4' },
    { id: 'packageCount', label: 'Packages', type: 'number', required: true, integer: true, positive: true, cds: 'DE 6/10', help: 'Number of packages on this line.', example: '4' },
    { id: 'packageType', label: 'Package type', type: 'select', options: PACKAGE_TYPES, cds: 'DE 6/9', help: 'Kind of package. Codes follow UN/ECE Rec 21.', example: 'CT' },
    { id: 'description', label: 'Contents', type: 'text', required: true, cds: 'DE 6/8', help: 'What is inside, matching the invoice description.', example: 'Stainless steel ball bearings, 22 mm bore' },
    { id: 'commodityCode', label: 'Commodity code', type: 'text', commodity: true, cds: 'DE 6/14', help: 'Optional on a packing list. Copy it from the commercial invoice when you have it: 6, 8 or 10 digits.', example: '848210' },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true, positive: true, help: 'Total units across these packages.', example: '400' },
    { id: 'unit', label: 'Unit', type: 'select', options: UNITS, help: 'Unit of the quantity.', example: 'pcs' },
    { id: 'netMass', label: 'Net kg (whole line)', type: 'number', required: true, perPackage: true, cds: 'DE 6/1', help: 'Net mass of all the packages on this line together, in kilograms.', example: '96' },
    { id: 'grossMass', label: 'Gross kg (whole line)', type: 'number', required: true, perPackage: true, cds: 'DE 6/5', help: 'Gross mass of all the packages on this line together, in kilograms.', example: '104' },
    { id: 'length', label: 'L cm', type: 'number', dimension: true, help: 'Length of one package in centimetres.', example: '60' },
    { id: 'width', label: 'W cm', type: 'number', dimension: true, help: 'Width of one package in centimetres.', example: '40' },
    { id: 'height', label: 'H cm', type: 'number', dimension: true, help: 'Height of one package in centimetres.', example: '30' },
  ],
  example: {
    header: {
      shipperName: 'Beispiel Lager GmbH',
      shipperAddress: 'Hafenstraße 1, 20457 Hamburg, Germany',
      shipperEori: 'DE1234567',
      consigneeName: 'Harbour Example Trading Ltd',
      consigneeAddress: 'Unit 4, Example Park, Leicester LE1 1AA, United Kingdom',
      consigneeEori: 'GB123456789000',
      packingListNumber: 'PL-2026-0142',
      packingDate: '2026-10-15',
      invoiceNumber: 'INV-2026-0142',
      transportMode: 'sea',
      transportDocument: 'HLCUHAM2610150001',
      containerNumber: 'MSKU1234565',
      dispatchCountry: 'DE',
      destinationCountry: 'GB',
      preparedBy: 'A. Example',
    },
    lines: [
      { marks: 'HX/0142 1-4', packageCount: '4', packageType: 'CT', description: 'Stainless steel ball bearings, 22 mm bore', commodityCode: '848210', quantity: '400', unit: 'pcs', netMass: '96', grossMass: '104', length: '60', width: '40', height: '30' },
      { marks: 'HX/0142 5', packageCount: '1', packageType: 'CT', description: 'Vulcanised rubber gaskets, 60 mm', commodityCode: '401693', quantity: '1200', unit: 'pcs', netMass: '18', grossMass: '21.5', length: '50', width: '40', height: '25' },
    ],
  },
}

// ---------------------------------------------------------------------------
// Pure engine. Each function is self-contained or calls only the functions below,
// because the page script injects them by source text.

export function parseAmount(value) {
  if (value == null) return null
  const text = String(value).replace(/[\s,£€$]/g, '')
  if (text === '') return null
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(text)) return NaN
  const number = Number(text)
  return Number.isFinite(number) ? number : NaN
}

export function computeDocument(schema, state) {
  const lines = (state.lines || []).map((line) => {
    const quantity = parseAmount(line.quantity)
    const netMass = parseAmount(line.netMass)
    const grossMass = parseAmount(line.grossMass)
    const out = { quantity, netMass, grossMass }
    if (schema.kind === 'invoice') {
      const unitValue = parseAmount(line.unitValue)
      out.unitValue = unitValue
      out.lineTotalPence = Number.isFinite(quantity) && Number.isFinite(unitValue) && quantity !== null && unitValue !== null
        ? Math.round(quantity * unitValue * 100)
        : null
    } else {
      const count = parseAmount(line.packageCount)
      const dims = [parseAmount(line.length), parseAmount(line.width), parseAmount(line.height)]
      out.packageCount = count
      out.volumeM3 = Number.isFinite(count) && count !== null && dims.every((d) => Number.isFinite(d) && d !== null && d > 0)
        ? (count * dims[0] * dims[1] * dims[2]) / 1000000
        : null
    }
    return out
  })
  const sum = (key) => lines.reduce((total, line) => total + (Number.isFinite(line[key]) && line[key] !== null ? line[key] : 0), 0)
  const round3 = (value) => Math.round(value * 1000) / 1000
  const totals = { lineCount: lines.length, netMass: round3(sum('netMass')), grossMass: round3(sum('grossMass')) }
  if (schema.kind === 'invoice') {
    const pence = (key) => {
      const value = parseAmount(state.header?.[key])
      return Number.isFinite(value) && value !== null ? Math.round(value * 100) : 0
    }
    totals.subtotalPence = sum('lineTotalPence')
    totals.discountPence = pence('discount')
    totals.freightPence = pence('freight')
    totals.insurancePence = pence('insurance')
    totals.otherPence = pence('otherCharges')
    totals.totalPence = totals.subtotalPence - totals.discountPence + totals.freightPence + totals.insurancePence + totals.otherPence
  } else {
    totals.packages = sum('packageCount')
    totals.volumeM3 = round3(sum('volumeM3'))
    totals.volumeComplete = lines.length > 0 && lines.every((line) => line.volumeM3 !== null)
  }
  return { lines, totals }
}

export function fieldRequiredNow(field, header) {
  if (field.required) return true
  const rule = field.requiredUnless
  if (!rule) return false
  const other = String((header || {})[rule.field] || '').trim().toUpperCase()
  return other !== '' && !rule.values.includes(other)
}

// Lines that hold goods but have no package size at all. The volume total skips them.
export function missingDimensionLines(schema, state) {
  if (schema.kind !== 'packing') return []
  const blank = (value) => value == null || String(value).trim() === ''
  return (state.lines || []).reduce((out, line, index) => {
    const hasGoods = !blank(line.description) || !blank(line.packageCount)
    const dims = ['length', 'width', 'height'].filter((key) => !blank(line[key]) && parseAmount(line[key]) > 0)
    if (hasGoods && dims.length < 3) out.push(index)
    return out
  }, [])
}

// Shipping marks for a duplicated line. "HX/0142 1-4" with 4 packages becomes "HX/0142 5-8";
// "BGC/1-3" with 1 package (carton 1 of 3) becomes "BGC/2-3"; "HX/0142 5" with 1 package becomes
// "HX/0142 6". Anything else is copied unchanged.
export function nextMarks(marks, packageCount) {
  const text = String(marks == null ? '' : marks)
  const count = Number(String(packageCount == null ? '' : packageCount).trim())
  const pad = (value, like) => String(value).padStart(like.length, '0')
  const range = text.match(/^(|.*\D)(\d+)(\s*[-–]\s*)(\d+)\s*$/)
  if (range) {
    const start = Number(range[2])
    const end = Number(range[4])
    if (end < start) return text
    const size = end - start + 1
    // One package marked "x-n" is carton x of n ("BGC/1-3"): the next carton is x+1 of the same n.
    // The last carton ("BGC/3-3") is copied unchanged.
    if (count === 1) return start < end ? range[1] + pad(start + 1, range[2]) + range[3] + range[4] : text
    // A range that covers exactly this line's packages ("1-4" on a 4-package line) moves on to the next block.
    if (Number.isInteger(count) && count === size) return range[1] + pad(end + 1, range[2]) + range[3] + pad(end + size, range[4])
    // Anything else: copy the marks exactly as they are, so nothing on the box is invented.
    return text
  }
  const single = text.match(/^(.*\s)(\d+)\s*$/)
  if (single && Number.isInteger(count) && count >= 1) {
    const last = Number(single[2])
    return single[1] + pad(last + 1, single[2]) + (count === 1 ? '' : '-' + pad(last + count, single[2]))
  }
  return text
}

export function validateDocument(schema, state) {
  const errors = []
  const warnings = []
  const header = state.header || {}
  const blank = (value) => value == null || String(value).trim() === ''
  const eoriShape = (value) => {
    const v = String(value).replace(/[\s-]/g, '').toUpperCase()
    if (/^(GB|XI)\d{12}$/.test(v) || /^(GB|XI)\d{15}$/.test(v)) return true
    if (/^(GB|XI)/.test(v)) return false
    return /^[A-Z]{2}[A-Z0-9]{1,15}$/.test(v)
  }
  for (const field of schema.fields) {
    const value = header[field.id]
    if (field.required && blank(value)) {
      errors.push({ field: field.id, message: field.label + ' is required.' })
      continue
    }
    if (fieldRequiredNow(field, header) && blank(value)) {
      errors.push({ field: field.id, message: field.label + ' is required when the destination is not GB. ' + (field.requiredHint || '') })
      continue
    }
    if (blank(value)) {
      if (field.linkInvoice) warnings.push({ field: field.id, message: 'Add the commercial invoice number so the reviewer can match the two documents.' })
      continue
    }
    if (field.type === 'money') {
      const amount = parseAmount(value)
      if (!Number.isFinite(amount) || amount < 0) errors.push({ field: field.id, message: field.label + ' must be a number of 0 or more.' })
    }
    if (field.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
      errors.push({ field: field.id, message: field.label + ' must be a date.' })
    }
    if (field.country && !/^[A-Za-z]{2}$/.test(String(value).trim())) {
      errors.push({ field: field.id, message: field.label + ': use the two-letter country code, for example GB, DE or CN.' })
    }
    if (field.eori && !eoriShape(value)) {
      warnings.push({ field: field.id, message: field.label + ': GB and XI EORI numbers are usually the prefix plus 12 digits. Check the number before you rely on it.' })
    }
  }
  const lines = state.lines || []
  if (lines.length === 0) errors.push({ field: 'lines', message: 'Add at least one line.' })
  const computed = computeDocument(schema, state)
  lines.forEach((line, index) => {
    const n = index + 1
    for (const field of schema.lineFields) {
      const value = line[field.id]
      if (field.required && blank(value)) {
        errors.push({ field: field.id, line: index, message: 'Line ' + n + ': ' + field.label.toLowerCase() + ' is required.' })
        continue
      }
      if (blank(value)) continue
      if (field.type === 'number' || field.type === 'money') {
        const amount = parseAmount(value)
        if (!Number.isFinite(amount) || amount < 0) {
          errors.push({ field: field.id, line: index, message: 'Line ' + n + ': ' + field.label.toLowerCase() + ' must be a number of 0 or more.' })
        } else if (field.positive && amount <= 0) {
          errors.push({ field: field.id, line: index, message: 'Line ' + n + ': ' + field.label.toLowerCase() + ' must be more than 0.' })
        } else if (field.integer && !Number.isInteger(amount)) {
          errors.push({ field: field.id, line: index, message: 'Line ' + n + ': ' + field.label.toLowerCase() + ' must be a whole number.' })
        }
      }
      if (field.country && !/^[A-Za-z]{2}$/.test(String(value).trim())) {
        errors.push({ field: field.id, line: index, message: 'Line ' + n + ': use the two-letter origin code, for example CN.' })
      }
      if (field.commodity && !/^(\d{6}|\d{8}|\d{10})$/.test(String(value).replace(/[\s.]/g, ''))) {
        warnings.push({ field: field.id, line: index, message: 'Line ' + n + ': commodity codes have 6, 8 or 10 digits.' })
      }
    }
    const c = computed.lines[index]
    if (Number.isFinite(c.netMass) && Number.isFinite(c.grossMass) && c.netMass !== null && c.grossMass !== null && c.netMass > c.grossMass) {
      errors.push({ field: 'grossMass', line: index, message: 'Line ' + n + ': gross mass must be at least the net mass.' })
    }
    if (schema.kind === 'packing') {
      const given = ['length', 'width', 'height'].filter((key) => !blank(line[key]))
      if (given.length > 0 && given.length < 3) {
        warnings.push({ field: 'length', line: index, message: 'Line ' + n + ': enter length, width and height to include the volume.' })
      } else if (given.length === 0 && (!blank(line.description) || !blank(line.packageCount))) {
        warnings.push({ field: 'length', line: index, message: 'Line ' + n + ' has no dimensions. Total volume is incomplete.' })
      }
    }
    if (schema.kind === 'invoice' && !blank(line.netMass) && blank(line.grossMass)) {
      warnings.push({ field: 'grossMass', line: index, message: 'Line ' + n + ': add the gross mass if the shipment needs it.' })
    }
  })
  if (schema.kind === 'invoice' && computed.totals.discountPence > computed.totals.subtotalPence) {
    errors.push({ field: 'discount', message: 'Discount cannot be more than the goods subtotal.' })
  }
  return { errors, warnings }
}

export function escapeText(value) {
  return String(value == null ? '' : value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function formatPence(pence, currency) {
  const value = (pence || 0) / 100
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
  } catch {
    return (currency || '') + ' ' + value.toFixed(2)
  }
}

export function renderDocumentHtml(schema, state, canonicalUrl) {
  const header = state.header || {}
  const computed = computeDocument(schema, state)
  const show = (value) => (value == null || String(value).trim() === '' ? '<span class="doc-blank">&nbsp;</span>' : escapeText(value).replaceAll('\n', '<br/>'))
  const optionLabel = (fieldId, value, source) => {
    const field = source.find((item) => item.id === fieldId)
    const match = field && field.options ? field.options.find(([code]) => code === value) : null
    return match && value ? match[1] : value
  }
  const fmtNum = (value, digits) => (Number.isFinite(value) && value !== null ? value.toLocaleString('en-GB', { maximumFractionDigits: digits }) : '')
  const metaRow = (label, value) => '<tr><th scope="row">' + escapeText(label) + '</th><td>' + show(value) + '</td></tr>'
  const party = (title, name, address, eori, extra) =>
    '<section class="doc-party"><h3>' + escapeText(title) + '</h3><p class="doc-party-name">' + show(name) + '</p><p>' + show(address) + '</p><p><b>EORI</b> ' + show(eori) + '</p>' + (extra || '') + '</section>'
  const rows = state.lines && state.lines.length ? state.lines : [{}, {}, {}]
  let parties
  let meta
  let table
  let totals
  let footer
  if (schema.kind === 'invoice') {
    const currency = header.currency || ''
    const money = (pence) => (pence == null ? '' : formatPence(pence, currency || 'GBP'))
    parties =
      party('Exporter / seller', header.exporterName, header.exporterAddress, header.exporterEori, '<p><b>VAT</b> ' + show(header.exporterVat) + '</p>') +
      party('Importer / buyer', header.importerName, header.importerAddress, header.importerEori, header.consignee ? '<p><b>Consignee</b> ' + show(header.consignee) + '</p>' : '')
    meta =
      metaRow('Invoice number', header.invoiceNumber) +
      metaRow('Invoice date', header.invoiceDate) +
      metaRow('Order reference', header.orderRef) +
      metaRow('Currency', currency) +
      metaRow('Incoterm', (header.incoterm || '') + (header.incotermPlace ? ' ' + header.incotermPlace : '')) +
      metaRow('Transport', optionLabel('transportMode', header.transportMode, schema.fields)) +
      metaRow('Dispatch → destination', [header.dispatchCountry, header.destinationCountry].filter(Boolean).join(' → ').toUpperCase()) +
      metaRow('Packages', header.packages) +
      metaRow('Reason for export', optionLabel('reason', header.reason, schema.fields)) +
      metaRow('Payment terms', header.paymentTerms)
    const body = rows
      .map((line, index) => {
        const c = computed.lines[index] || {}
        return '<tr><td>' + (state.lines && state.lines.length ? index + 1 : '') + '</td><td>' + show(line.description) + '</td><td>' + show(line.commodityCode) + '</td><td>' + show((line.origin || '').toUpperCase()) + '</td><td class="num">' + show(fmtNum(c.quantity, 3)) + '</td><td>' + show(line.description ? line.unit || 'pcs' : '') + '</td><td class="num">' + show(fmtNum(c.netMass, 3)) + '</td><td class="num">' + show(fmtNum(c.grossMass, 3)) + '</td><td class="num">' + show(Number.isFinite(c.unitValue) && c.unitValue !== null ? c.unitValue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '') + '</td><td class="num">' + show(Number.isFinite(c.lineTotalPence) && c.lineTotalPence !== null ? money(c.lineTotalPence) : '') + '</td></tr>'
      })
      .join('')
    table = '<table class="doc-lines"><caption class="doc-caption">Goods</caption><thead><tr><th scope="col">#</th><th scope="col">Description of goods</th><th scope="col">Commodity code</th><th scope="col">Origin</th><th scope="col" class="num">Qty</th><th scope="col">Unit</th><th scope="col" class="num">Net kg</th><th scope="col" class="num">Gross kg</th><th scope="col" class="num">Unit price</th><th scope="col" class="num">Line total</th></tr></thead><tbody>' + body + '</tbody></table>'
    const t = computed.totals
    totals =
      '<table class="doc-totals"><tbody>' +
      '<tr><th scope="row">Goods subtotal</th><td>' + money(t.subtotalPence) + '</td></tr>' +
      '<tr><th scope="row">Discount</th><td>' + (t.discountPence ? '− ' + money(t.discountPence) : money(0)) + '</td></tr>' +
      '<tr><th scope="row">Freight</th><td>' + money(t.freightPence) + '</td></tr>' +
      '<tr><th scope="row">Insurance</th><td>' + money(t.insurancePence) + '</td></tr>' +
      '<tr><th scope="row">Other charges</th><td>' + money(t.otherPence) + '</td></tr>' +
      '<tr class="doc-grand"><th scope="row">Invoice total' + (currency ? ' (' + escapeText(currency) + ')' : '') + '</th><td>' + money(t.totalPence) + '</td></tr>' +
      '<tr><th scope="row">Total net / gross mass</th><td>' + fmtNum(t.netMass, 3) + ' kg / ' + fmtNum(t.grossMass, 3) + ' kg</td></tr>' +
      '</tbody></table>'
    footer =
      '<section class="doc-declaration"><h3>Declaration</h3><p>I declare that the information on this ' + (header.documentType === 'proforma' ? 'proforma invoice' : 'invoice') + ' is true and correct, and that the contents and values of this shipment are as stated above.</p><div class="doc-sign"><p><b>Name</b> ' + show(header.signatoryName) + '</p><p><b>Position</b> ' + show(header.signatoryPosition) + '</p><p><b>Place and date</b> ' + show([header.signaturePlace, header.invoiceDate].filter(Boolean).join(', ')) + '</p><p class="doc-signature-line"><b>Signature</b> <span></span></p></div></section>'
  } else {
    parties =
      party('Shipper / exporter', header.shipperName, header.shipperAddress, header.shipperEori, '') +
      party('Consignee / importer', header.consigneeName, header.consigneeAddress, header.consigneeEori, '')
    meta =
      metaRow('Packing list number', header.packingListNumber) +
      metaRow('Date', header.packingDate) +
      metaRow('Commercial invoice', header.invoiceNumber) +
      metaRow('Transport', optionLabel('transportMode', header.transportMode, schema.fields)) +
      metaRow('Transport document', header.transportDocument) +
      metaRow('Container / trailer', header.containerNumber) +
      metaRow('Dispatch → destination', [header.dispatchCountry, header.destinationCountry].filter(Boolean).join(' → ').toUpperCase())
    const body = rows
      .map((line, index) => {
        const c = computed.lines[index] || {}
        const dims = [line.length, line.width, line.height].every((d) => d != null && String(d).trim() !== '') ? escapeText(line.length + ' × ' + line.width + ' × ' + line.height) : ''
        return '<tr><td>' + show(line.marks) + '</td><td class="num">' + show(fmtNum(c.packageCount, 0)) + '</td><td>' + show(line.description ? line.packageType || 'CT' : '') + '</td><td>' + show(line.description) + '</td><td>' + show(line.commodityCode) + '</td><td class="num">' + show(fmtNum(c.quantity, 3)) + '</td><td>' + show(line.description ? line.unit || 'pcs' : '') + '</td><td class="num">' + show(fmtNum(c.netMass, 3)) + '</td><td class="num">' + show(fmtNum(c.grossMass, 3)) + '</td><td>' + (dims || '<span class="doc-blank">&nbsp;</span>') + '</td><td class="num">' + show(c.volumeM3 != null ? fmtNum(c.volumeM3, 3) : '') + '</td></tr>'
      })
      .join('')
    table = '<table class="doc-lines"><caption class="doc-caption">Packages and contents</caption><thead><tr><th scope="col">Marks and numbers</th><th scope="col" class="num">Pkgs</th><th scope="col">Type</th><th scope="col">Contents</th><th scope="col">Commodity code</th><th scope="col" class="num">Qty</th><th scope="col">Unit</th><th scope="col" class="num">Net kg</th><th scope="col" class="num">Gross kg</th><th scope="col">L × W × H cm (each)</th><th scope="col" class="num">m³</th></tr></thead><tbody>' + body + '</tbody></table>'
    const t = computed.totals
    totals =
      '<table class="doc-totals"><tbody>' +
      '<tr><th scope="row">Total packages</th><td>' + fmtNum(t.packages, 0) + '</td></tr>' +
      '<tr><th scope="row">Total net mass</th><td>' + fmtNum(t.netMass, 3) + ' kg</td></tr>' +
      '<tr class="doc-grand"><th scope="row">Total gross mass</th><td>' + fmtNum(t.grossMass, 3) + ' kg</td></tr>' +
      '<tr><th scope="row">Total volume (CBM)</th><td>' + fmtNum(t.volumeM3, 3) + ' m³' + (t.lineCount && !t.volumeComplete ? ' (lines with dimensions)' : '') + '</td></tr>' +
      '</tbody></table>'
    footer =
      '<section class="doc-declaration"><h3>Packing confirmation</h3><p>The packages listed above were packed and marked as described.</p><div class="doc-sign"><p><b>Prepared by</b> ' + show(header.preparedBy) + '</p><p><b>Date</b> ' + show(header.packingDate) + '</p><p class="doc-signature-line"><b>Signature</b> <span></span></p></div></section>'
  }
  const title = schema.proformaTitle && header.documentType === 'proforma' ? schema.proformaTitle : schema.documentTitle
  return (
    '<header class="doc-head"><h2 class="doc-title">' + escapeText(title) + '</h2><p class="doc-number">' + show(header[schema.numberField]) + '</p></header>' +
    '<div class="doc-parties">' + parties + '<section class="doc-meta"><h3>References</h3><table><tbody>' + meta + '</tbody></table></section></div>' +
    '<div class="doc-table-wrap">' + table + '</div>' +
    '<div class="doc-foot">' + footer + totals + '</div>' +
    '<p class="doc-generated">Prepared with the free Declarix ' + (schema.kind === 'invoice' ? 'commercial invoice' : 'packing list') + ' generator · ' + escapeText(canonicalUrl) + '</p>'
  )
}

export function csvCell(value) {
  let text = String(value == null ? '' : value)
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text
  return '"' + text.replaceAll('"', '""') + '"'
}

export function documentToCsv(schema, state) {
  const header = state.header || {}
  const computed = computeDocument(schema, state)
  // Every row carries the document header, so one row on its own still names the parties and references.
  const lead = schema.kind === 'invoice'
    ? [
        ['document_type', header.documentType === 'proforma' ? 'Proforma invoice' : header.documentType === 'commercial' ? 'Commercial invoice' : ''],
        ['invoice_number', header.invoiceNumber], ['invoice_date', header.invoiceDate], ['order_ref', header.orderRef],
        ['exporter_name', header.exporterName], ['exporter_address', header.exporterAddress], ['exporter_eori', header.exporterEori], ['exporter_vat', header.exporterVat],
        ['importer_name', header.importerName], ['importer_address', header.importerAddress], ['importer_eori', header.importerEori], ['consignee', header.consignee],
        ['currency', header.currency], ['incoterm', header.incoterm], ['incoterm_place', header.incotermPlace], ['packages', header.packages],
        ['dispatch_country', header.dispatchCountry], ['destination_country', header.destinationCountry],
      ]
    : [
        ['packing_list_number', header.packingListNumber], ['packing_date', header.packingDate], ['invoice_number', header.invoiceNumber],
        ['shipper_name', header.shipperName], ['shipper_eori', header.shipperEori], ['consignee_name', header.consigneeName], ['consignee_eori', header.consigneeEori],
        ['transport_document', header.transportDocument], ['container_number', header.containerNumber],
      ]
  const extra = schema.kind === 'invoice' ? ['line_total'] : ['volume_m3']
  const columns = ['line', ...lead.map(([key]) => key), ...schema.lineFields.map((field) => field.id.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())), ...extra]
  const rows = (state.lines || []).map((line, index) => {
    const c = computed.lines[index]
    const tail = schema.kind === 'invoice'
      ? [c.lineTotalPence === null ? '' : (c.lineTotalPence / 100).toFixed(2)]
      : [c.volumeM3 === null ? '' : String(Math.round(c.volumeM3 * 1000) / 1000)]
    return [index + 1, ...lead.map(([, value]) => value), ...schema.lineFields.map((field) => line[field.id]), ...tail]
  })
  const t = computed.totals
  const totalRow = schema.kind === 'invoice'
    ? ['TOTAL', ...lead.map(() => ''), ...schema.lineFields.map((field) => (field.id === 'netMass' ? t.netMass : field.id === 'grossMass' ? t.grossMass : '')), (t.totalPence / 100).toFixed(2)]
    : ['TOTAL', ...lead.map(() => ''), ...schema.lineFields.map((field) => (field.id === 'packageCount' ? t.packages : field.id === 'netMass' ? t.netMass : field.id === 'grossMass' ? t.grossMass : '')), t.volumeM3]
  return [columns, ...rows, ...(rows.length ? [totalRow] : [])].map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n'
}

export function documentToJson(schema, state) {
  const computed = computeDocument(schema, state)
  const t = computed.totals
  const totals = schema.kind === 'invoice'
    ? { goods_subtotal: t.subtotalPence / 100, discount: t.discountPence / 100, freight: t.freightPence / 100, insurance: t.insurancePence / 100, other_charges: t.otherPence / 100, invoice_total: t.totalPence / 100, net_mass_kg: t.netMass, gross_mass_kg: t.grossMass }
    : { packages: t.packages, net_mass_kg: t.netMass, gross_mass_kg: t.grossMass, volume_m3: t.volumeM3 }
  return JSON.stringify({ format: 'declarix-' + schema.kind + '-v1', header: state.header || {}, lines: state.lines || [], totals }, null, 2) + '\n'
}

export function documentFromJson(schema, text) {
  const data = JSON.parse(text)
  if (!data || data.format !== 'declarix-' + schema.kind + '-v1' || typeof data.header !== 'object' || !Array.isArray(data.lines)) {
    throw new Error('format')
  }
  const header = {}
  for (const field of schema.fields) header[field.id] = typeof data.header[field.id] === 'string' ? data.header[field.id].slice(0, 500) : ''
  const lines = data.lines.slice(0, 200).map((line) => {
    const out = {}
    for (const field of schema.lineFields) out[field.id] = line && typeof line[field.id] === 'string' ? line[field.id].slice(0, 500) : ''
    return out
  })
  return { header, lines }
}

// ---------------------------------------------------------------------------
// Page definitions.

export const documentGenerators = [
  {
    path: '/tools/commercial-invoice-generator/',
    id: 'commercial_invoice_generator',
    schema: invoiceSchema,
    ref: 'FREE TOOL 05 · COMMERCIAL INVOICE',
    title: 'Commercial Invoice Template UK: Free Generator, PDF + CSV',
    schemaName: 'Free commercial invoice template and generator',
    reviewedOn: '2026-10-15',
    description:
      'Free UK commercial invoice template: EORI, Incoterm, HS code and origin per line. Print to PDF or export CSV for Excel. Customs-ready, no sign-up.',
    eyebrow: 'FREE COMMERCIAL INVOICE TEMPLATE · CDS-MAPPED FIELDS · BROWSER ONLY',
    h1: 'Commercial invoice template and generator',
    intro: 'Free, no sign-up. Fill it in below, then print to PDF or export CSV for Excel.',
    standfirst:
      'Fill in a customs-ready commercial invoice in your browser. Every field maps to the CDS data element a declarant needs, the totals add up as you type, and you can print it to PDF or download it as CSV or JSON.',
    templateCsv: '/downloads/commercial-invoice-template.csv',
    sibling: { path: '/tools/packing-list-generator/', label: 'Packing list template and generator' },
    directAnswer: {
      question: 'What should a commercial invoice include for UK customs?',
      answer:
        'A commercial invoice for UK customs should name the exporter and importer with their EORI numbers, carry a unique invoice number and date, state the currency and the Incoterm with its named place, and list every line of goods with a clear description, commodity code, country of origin, quantity, net and gross mass, unit price and line total. Add any discount, freight and insurance, the invoice total, and a signed declaration that the details are true and correct.',
    },
    questions: [
      { question: 'Is this commercial invoice generator free?', answer: 'Yes. The generator, the blank template and the CSV download are free, with no sign-up and no limit on use.' },
      { question: 'Does my invoice data leave my browser?', answer: 'No. The invoice is built entirely on this page. Nothing you type is uploaded, emailed or stored by Declarix. Once the page has loaded it keeps working without a connection.' },
      { question: 'How do I save the invoice as a PDF?', answer: 'Select “Print / save as PDF” and choose “Save as PDF” as the printer. The print layout shows only the finished invoice, on A4.' },
      { question: 'Can I edit the invoice later?', answer: 'Yes. Download the JSON file, then use “Open a saved JSON file” to load it back into the generator and carry on editing.' },
      { question: 'Do I need a commodity code on a commercial invoice?', answer: 'It is strongly recommended. The declarant needs a commodity code for every item on a UK customs declaration, so putting it on the invoice saves a round of questions. Look it up in the UK Trade Tariff.' },
      { question: 'Should the invoice be in English?', answer: 'Yes. HMRC’s customs checklist asks for a commercial invoice in English as part of the document pack.' },
      { question: 'What is the difference between a commercial invoice and a proforma invoice?', answer: 'A commercial invoice records a completed sale and its price. A proforma invoice is issued before the sale or where there is no sale, such as samples or repairs. Use the reason-for-export field to show which applies.' },
      { question: 'Can I open it in Excel or Word?', answer: 'Yes. The CSV download opens in Excel, Google Sheets or Numbers, with the parties, EORI numbers, invoice number, date, Incoterm and order reference on every row. For Word or email, print the invoice to PDF from your browser and attach it.' },
      { question: 'Can I make a proforma invoice with it?', answer: 'Yes. Set “Document type” to “Proforma invoice” and the printed document, the declaration line and the CSV relabel themselves. Everything else works the same way.' },
      { question: 'Can I use it for a DHL, FedEx or UPS shipment?', answer: 'Yes. Couriers ask for a commercial invoice with the parties, a clear description, the commodity code, origin and value of each line. Print the PDF and attach it to the parcel, or upload it where the courier’s booking asks for the invoice.' },
      { question: 'Which Incoterm should I put on the invoice?', answer: 'Use the Incoterms® 2020 rule agreed in the sale contract, with its named place, for example “FCA Hamburg”. The Incoterm tells the declarant which costs are inside the price.' },
    ],
    sources: [
      { title: 'Customs checklist (international events guidance)', publisher: 'HM Revenue & Customs · GOV.UK', checked: '15 OCTOBER 2026', url: 'https://www.gov.uk/guidance/international-events/customs-checklist' },
      { title: 'Making a full import declaration', publisher: 'HM Revenue & Customs · GOV.UK', checked: '15 OCTOBER 2026', url: 'https://www.gov.uk/guidance/making-a-full-import-declaration' },
      { title: 'CDS Declaration Completion Instructions for Imports', publisher: 'HM Revenue & Customs · GOV.UK', checked: '15 OCTOBER 2026', url: 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/uk-trade-tariff-cds-volume-3-import-declaration-completion-guide' },
      { title: 'Customs valuation: Method 1 — transaction value', publisher: 'HM Revenue & Customs · GOV.UK', checked: '15 OCTOBER 2026', url: 'https://www.gov.uk/guidance/customs-valuation/method-1-transaction-value' },
      { title: 'Trade Tariff: look up commodity codes, duty and VAT rates', publisher: 'HM Revenue & Customs · GOV.UK', checked: '15 OCTOBER 2026', url: 'https://www.gov.uk/trade-tariff' },
    ],
  },
  {
    path: '/tools/packing-list-generator/',
    id: 'packing_list_generator',
    schema: packingSchema,
    ref: 'FREE TOOL 06 · PACKING LIST',
    title: 'Shipping Packing List Template: Free Export Generator',
    schemaName: 'Free shipping packing list template and generator',
    reviewedOn: '2026-10-15',
    description:
      'Free shipping packing list template for export and UK customs: packages, marks, net and gross weight, dimensions and CBM. Print to PDF or export CSV.',
    eyebrow: 'FREE PACKING LIST TEMPLATE · WEIGHTS + VOLUME · BROWSER ONLY',
    h1: 'Shipping and export packing list template and generator',
    subhead: 'Shipping packing list template and generator',
    intro: 'Free, no sign-up. Add each carton or pallet below, then print to PDF or export CSV.',
    standfirst:
      'Build a clear packing list in your browser. Add each package line with marks, contents, weights and dimensions. Totals for packages, net and gross mass and volume update as you type. Print it to PDF or download it as CSV or JSON.',
    templateCsv: '/downloads/packing-list-template.csv',
    sibling: { path: '/tools/commercial-invoice-generator/', label: 'Commercial invoice template and generator' },
    directAnswer: {
      question: 'What goes on a shipping packing list?',
      answer:
        'A shipping packing list names the shipper and consignee, gives the packing list number and date, and links to the commercial invoice and transport document. For each line it lists the shipping marks, the number and type of packages, the contents, quantity, net and gross mass and package dimensions. It ends with totals for packages, net mass, gross mass and volume, so the carrier, the declarant and the receiver can all check the shipment against the invoice.',
    },
    questions: [
      { question: 'Is this packing list generator free?', answer: 'Yes. The generator, the blank template and the CSV download are free, with no sign-up and no limit on use.' },
      { question: 'Does my packing data leave my browser?', answer: 'No. The packing list is built entirely on this page. Nothing you type is uploaded, emailed or stored by Declarix. Once the page has loaded it keeps working without a connection.' },
      { question: 'Is a packing list needed for UK customs?', answer: 'It is part of the standard document pack. HMRC’s customs checklist lists a commercial invoice in English and a packing list among the documents to prepare.' },
      { question: 'What is the difference between net and gross mass?', answer: 'Net mass is the weight of the goods alone. Gross mass includes the packaging but not the transport equipment such as containers. Gross mass is always at least the net mass, and the generator checks this for every line.' },
      { question: 'How is the volume worked out?', answer: 'For each line the generator multiplies length × width × height of one package in centimetres, divides by 1,000,000 to get cubic metres, and multiplies by the number of packages.' },
      { question: 'How do I save the packing list as a PDF?', answer: 'Select “Print / save as PDF” and choose “Save as PDF” as the printer. The print layout shows only the finished packing list.' },
      { question: 'Are the weights per package or for the whole line?', answer: 'For the whole line. Enter the net and gross kilograms of all the packages on that line together. The generator shows the weight per package under each box so you can check it against the scale.' },
      { question: 'What is CBM on a packing list?', answer: 'CBM means cubic metres, the volume the shipment takes up. The generator works it out from the size of one package and the number of packages, then adds every line into the total CBM that forwarders use to price and plan the load.' },
      { question: 'Can I open it in Excel?', answer: 'Yes. The CSV download opens in Excel, Google Sheets or Numbers, with the shipper, consignee, references and totals on the rows. For Word or email, print the packing list to PDF from your browser and attach it.' },
      { question: 'Should the packing list match the commercial invoice?', answer: 'Yes. Descriptions, quantities and weights should agree with the invoice. Put the invoice number on the packing list so the reviewer can match the two quickly.' },
    ],
    sources: [
      { title: 'Customs checklist (international events guidance)', publisher: 'HM Revenue & Customs · GOV.UK', checked: '15 OCTOBER 2026', url: 'https://www.gov.uk/guidance/international-events/customs-checklist' },
      { title: 'Making a full import declaration', publisher: 'HM Revenue & Customs · GOV.UK', checked: '15 OCTOBER 2026', url: 'https://www.gov.uk/guidance/making-a-full-import-declaration' },
      { title: 'CDS Declaration Completion Instructions for Imports', publisher: 'HM Revenue & Customs · GOV.UK', checked: '15 OCTOBER 2026', url: 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/uk-trade-tariff-cds-volume-3-import-declaration-completion-guide' },
      { title: 'Export goods from the UK: step by step', publisher: 'HM Government · GOV.UK', checked: '15 OCTOBER 2026', url: 'https://www.gov.uk/export-goods' },
    ],
  },
]

export function templateCsv(generator) {
  const schema = generator.schema
  const blankLines = [{}, {}, {}].map(() => Object.fromEntries(schema.lineFields.map((field) => [field.id, ''])))
  const csv = documentToCsv(schema, { header: {}, lines: blankLines })
  // Blank template: drop the computed TOTAL row so the file is a clean starting sheet.
  return csv.split('\r\n').filter((row) => !row.startsWith('"TOTAL"')).join('\r\n')
}

// ---------------------------------------------------------------------------
// Server rendering.

const escapeHtml = escapeText

function jsonLd(generator, site) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode(site),
      {
        '@type': 'WebApplication',
        '@id': `${site.origin}${generator.path}#application`,
        name: generator.schemaName,
        url: `${site.origin}${generator.path}`,
        description: generator.description,
        dateModified: generator.reviewedOn,
        applicationCategory: 'BusinessApplication',
        browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        featureList: [
          'Free blank template with CDS data element mapping',
          'Repeatable line items with live totals',
          'Print or save as PDF',
          'CSV and JSON download',
          'Runs in the browser; no upload',
        ],
        citation: generator.sources.map((source) => source.url),
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
      },
      breadcrumbList(site, generator.path),
    ],
  }).replaceAll('<', '\\u003c')
}

function inputControl(field, { id, name, value = '', line = false }) {
  const describedBy = `${id}-help`
  const common = `id="${id}" name="${name}" data-field="${field.id}"${line ? ' data-line-field' : ''} aria-describedby="${describedBy}"${field.required ? ' aria-required="true"' : ''}`
  if (field.type === 'textarea') {
    return `<textarea ${common} rows="3" maxlength="500" autocomplete="off">${escapeHtml(value)}</textarea>`
  }
  if (field.type === 'select') {
    return `<select ${common}>${field.options.map(([code, label]) => `<option value="${escapeHtml(code)}"${code === value ? ' selected' : ''}>${escapeHtml(label)}</option>`).join('')}</select>`
  }
  if (field.type === 'date') {
    return `<input ${common} type="date" value="${escapeHtml(value)}" />`
  }
  const numeric = field.type === 'number' || field.type === 'money'
  return `<input ${common} type="text"${numeric ? ' inputmode="decimal"' : ''} maxlength="${numeric ? 20 : 200}" autocomplete="off" spellcheck="false" value="${escapeHtml(value)}" />`
}

function renderHeaderFields(schema) {
  return schema.groups
    .map((group) => {
      const fields = schema.fields.filter((field) => field.group === group.id)
      return `<fieldset class="gen-group" data-group="${group.id}">
        <legend>${escapeHtml(group.title)}</legend>
        <p class="gen-group-note">${escapeHtml(group.note)}</p>
        <div class="gen-fields">${fields
          .map(
            (field) => `<div class="gen-field${field.type === 'textarea' ? ' is-wide' : ''}">
              <label for="h-${field.id}">${escapeHtml(field.label)}${
                field.required
                  ? ' <b aria-hidden="true">*</b>'
                  : field.requiredUnless
                    ? ' <b aria-hidden="true" data-required-mark hidden>*</b><small data-optional-mark>optional</small>'
                    : ' <small>optional</small>'
              }</label>
              ${inputControl(field, { id: `h-${field.id}`, name: field.id })}
              ${field.type === 'date' ? `<span class="gen-date-readout" data-date-readout aria-hidden="true">&nbsp;</span>` : ''}
              ${field.requiredHint ? `<span class="gen-required-hint" id="h-${field.id}-required" data-required-hint hidden>${escapeHtml(field.requiredHint)}</span>` : ''}
              <span class="gen-help" id="h-${field.id}-help">${escapeHtml(field.help)}${field.cds ? ` <i>CDS ${escapeHtml(field.cds)}</i>` : ''}</span>
              <span class="gen-error" id="h-${field.id}-error" hidden></span>
            </div>`,
          )
          .join('')}</div>
      </fieldset>`
    })
    .join('')
}

function renderLineRow(schema, index) {
  return `<fieldset class="gen-line" data-line="${index}">
    <legend><span class="gen-line-number">Line ${index + 1}</span></legend>
    <div class="gen-line-fields">${schema.lineFields
      .map(
        (field) => `<div class="gen-field gen-line-field" data-col="${field.id}">
          <label for="l${index}-${field.id}">${escapeHtml(field.label)}${field.required ? ' <b aria-hidden="true">*</b>' : ''}</label>
          ${inputControl(field, { id: `l${index}-${field.id}`, name: `${field.id}`, line: true })}
          ${field.perPackage ? `<span class="gen-per-package" data-per-package="${field.id}">&nbsp;</span>` : ''}
          <span class="visually-hidden" id="l${index}-${field.id}-help">${escapeHtml(field.help)}</span>
        </div>`,
      )
      .join('')}
      ${schema.kind === 'invoice' ? '<div class="gen-line-total"><span>LINE TOTAL</span><output data-line-total>—</output></div>' : '<div class="gen-line-total"><span>VOLUME</span><output data-line-total>—</output></div>'}
    </div>
    <div class="gen-line-actions"><button class="gen-remove gen-duplicate" type="button" data-duplicate-line>DUPLICATE LINE</button><button class="gen-remove" type="button" data-remove-line>REMOVE LINE</button></div>
  </fieldset>`
}

function renderFieldGuide(schema) {
  const all = [...schema.fields.map((field) => ({ ...field, scope: 'Header' })), ...schema.lineFields.map((field) => ({ ...field, scope: 'Each line' }))]
  return `<div class="gen-table-scroll" tabindex="0" role="region" aria-label="Field guide table"><table class="gen-guide-table gen-card-table">
    <caption>Field-by-field guide with the matching CDS data element</caption>
    <thead><tr><th scope="col">Field</th><th scope="col">Where</th><th scope="col">What to enter</th><th scope="col">CDS data element</th><th scope="col">Example</th></tr></thead>
    <tbody>${all
      .map(
        (field) => `<tr><th scope="row">${escapeHtml(field.label)}${field.required ? ' *' : field.requiredUnless ? ' *&nbsp;(outside GB)' : ''}</th><td data-label="Where">${field.scope}</td><td data-label="What to enter">${escapeHtml(field.help)}</td><td>${escapeHtml(field.cds || '—')}</td><td data-label="Example">${escapeHtml(field.example || '—')}</td></tr>`,
      )
      .join('')}</tbody>
  </table></div>`
}

function renderQuestions(generator) {
  return generator.questions
    .map(
      (item, index) => `<details class="gen-question">
        <summary><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(item.question)}</summary>
        <p>${escapeHtml(item.answer)}</p>
      </details>`,
    )
    .join('')
}

function renderSources(generator) {
  return `<section class="source-register" aria-labelledby="gen-sources">
    <header>
      <span class="section-label">OFFICIAL SOURCE REGISTER</span>
      <h2 id="gen-sources">The official guidance behind the fields.</h2>
      <p>Field names follow the CDS import completion instructions so the document lines up with the declaration your broker builds.</p>
    </header>
    <ol>${generator.sources
      .map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a><span>${escapeHtml(source.publisher)} · CHECKED ${escapeHtml(source.checked)}</span></li>`)
      .join('')}</ol>
  </section>`
}

function renderInvoiceContent(eoriEnabled) {
  return `<section class="gen-content" aria-labelledby="gen-what">
    <header><span class="section-label">COMMERCIAL INVOICE GUIDE</span><h2 id="gen-what">How to fill in a commercial invoice for UK customs</h2></header>
    <div class="gen-content-grid">
      <article><h3>1 · Name both parties with their EORI</h3><p>Put the exporter (seller) and importer (buyer) in full, with addresses and EORI numbers. A UK importer’s EORI starts with GB. Add a separate consignee only when the goods go to someone other than the importer.${eoriEnabled ? ' <a href="/tools/eori-checker/" data-gen-related="eori">Check a GB EORI number free</a> before you send the invoice.' : ''}</p></article>
      <article><h3>2 · Fix the references</h3><p>Give the invoice a unique number and date. The declarant quotes the invoice as document code N935 in DE 2/3, so the number must match the paperwork exactly.</p></article>
      <article><h3>3 · State currency and Incoterm</h3><p>Name the invoice currency (DE 4/10) and the Incoterms® 2020 rule with its named place (DE 4/1). The rule shows which freight and insurance costs sit inside the price, which feeds the customs value. <a href="/customs-reference/incoterms/" data-gen-related="incoterms">Compare FOB, CIF, DAP, FCA and DDP</a>.</p></article>
      <article><h3>4 · Describe every line properly</h3><p>Write what each item is, what it is made of and what it is for. Add the commodity code (DE 6/14), country of origin (DE 5/15), quantity and unit, net mass (DE 6/1), gross mass (DE 6/5) and unit price. Vague words such as “parts”, “samples” or “gifts” on their own slow clearance.</p></article>
      <article><h3>5 · Show the arithmetic</h3><p>The generator multiplies quantity by unit price for every line, then applies discount, freight, insurance and other charges to reach the invoice total. Every amount is rounded to the penny, so the total on the page is the total in the export.</p></article>
      <article><h3>6 · Sign the declaration</h3><p>Finish with the signatory’s name, position, place and date, then sign the printed copy. The declaration states that the invoice is true and correct.</p></article>
    </div>
  </section>`
}

function renderPackingContent() {
  return `<section class="gen-content" aria-labelledby="gen-what">
    <header><span class="section-label">PACKING LIST GUIDE</span><h2 id="gen-what">How to fill in a shipping packing list</h2></header>
    <div class="gen-content-grid">
      <article><h3>1 · Name shipper and consignee</h3><p>Give both parties in full with addresses and EORI numbers. The consignee is the party receiving the goods.</p></article>
      <article><h3>2 · Link the documents</h3><p>Add the packing list number and date, the commercial invoice number, and the bill of lading, air waybill or CMR number. Matching references let the declarant tie the pack together in seconds.</p></article>
      <article><h3>3 · One line per package group</h3><p>For each group of identical packages, enter the shipping marks (DE 6/11), the number (DE 6/10) and type (DE 6/9) of packages, and what is inside (DE 6/8).</p></article>
      <article><h3>4 · Weigh and measure</h3><p>Enter net and gross mass in kilograms for the whole line, and the size of one package in centimetres. The generator works out volume in cubic metres and checks that gross mass is never below net mass.</p></article>
      <article><h3>5 · Check against the invoice</h3><p>Descriptions, quantities and weights should agree with the commercial invoice line by line. A mismatch is one of the most common reasons a declarant has to stop and ask.</p></article>
      <article><h3>6 · Confirm and sign</h3><p>Add the name of the person who checked the packing, then sign the printed copy.</p></article>
    </div>
  </section>`
}

// Search-intent sections (intent review §4.1, 16 Oct 2026). Data element numbers follow the CDS import
// completion guide; valuation wording follows HMRC "Customs valuation: Method 1" (both checked 15 Oct 2026,
// URLs in the source register).
function renderInvoiceIntentSections() {
  const rows = [
    ['Exporter and importer, with EORI', 'DE 3/1, 3/2, 3/15, 3/16', 'The declaration names the same parties and their EORI numbers.'],
    ['Invoice number and date', 'DE 2/3 (N935)', 'The declaration quotes the invoice as the document behind the declared value.'],
    ['Currency', 'DE 4/10', 'The declarant converts the total with the HMRC exchange rate for the period.'],
    ['Incoterm and named place', 'DE 4/1', 'Shows which freight and insurance costs sit inside the price, so the customs value can be built.'],
    ['Price of each line', 'DE 4/14', 'The price paid or payable is the starting point of the customs value (Method 1, transaction value).'],
    ['Goods description', 'DE 6/8', 'Must be clear enough to support the commodity code. “Parts” or “samples” alone is not.'],
    ['Commodity code', 'DE 6/14', 'Sets the duty rate and any licence or control on the goods.'],
    ['Country of origin', 'DE 5/15', 'Decides whether a preferential duty rate can apply.'],
    ['Net and gross mass', 'DE 6/1, 6/5', 'Checked against the packing list and the transport document.'],
    ['Number and kind of packages', 'DE 6/10, 6/9', 'Checked against the packing list, the marks and the bill of lading, air waybill or CMR.'],
  ]
  return `<section class="gen-content gen-intent" aria-labelledby="gen-proforma">
    <header><span class="section-label">PROFORMA INVOICE TEMPLATE</span><h2 id="gen-proforma">Proforma invoice template</h2></header>
    <p>Need a proforma invoice? Set <b>Document type</b> to “Proforma invoice” at the top of the references. The printed document, the declaration line and the CSV all relabel themselves, and every field, check and total works the same way.</p>
    <p>Send a proforma before the sale is final, for example as a quote the buyer uses to pay or to apply for an import licence. Use it too when goods cross the border with no sale, such as free samples, goods sent for repair or returns. Customs still needs a value for goods with no sale. HMRC’s transaction value method needs a sale, so the declarant uses one of the other valuation methods, and the value on your proforma is the evidence they start from.</p>
  </section>

  <section class="gen-content gen-intent" aria-labelledby="gen-hmrc">
    <header><span class="section-label">FOR UK CUSTOMS</span><h2 id="gen-hmrc">Commercial invoice for customs: what HMRC checks</h2><p>HMRC checks the customs declaration, and the declaration is built from your commercial invoice. These are the invoice facts that reach it, with the data element each one fills.</p></header>
    <div class="gen-table-scroll" tabindex="0" role="region" aria-label="Invoice facts on the customs declaration"><table class="gen-guide-table gen-card-table">
      <thead><tr><th scope="col">On the invoice</th><th scope="col">On the declaration</th><th scope="col">Why it matters</th></tr></thead>
      <tbody>${rows.map(([fact, de, why]) => `<tr><th scope="row">${escapeHtml(fact)}</th><td data-label="On the declaration" class="gen-nowrap">${escapeHtml(de)}</td><td data-label="Why it matters">${escapeHtml(why)}</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="gen-example-note">HMRC’s customs checklist also asks for the commercial invoice in English. When the invoice and the packing list agree line by line, the broker can key the entry without stopping to ask. <a href="/tools/packing-list-generator/" data-gen-related="sibling_hmrc">Build the matching export packing list</a>.</p>
  </section>`
}

function renderPackingIntentSections() {
  const rows = [
    ['What it proves', 'The sale: who sold what to whom, and at what price', 'The packing: what is in each package, and how it is marked'],
    ['Values and prices', 'Yes, per line and in total', 'Not needed'],
    ['Weights', 'Net and gross per line, where known', 'Net and gross per line, with totals'],
    ['Packages and marks', 'Number and kind of packages', 'Marks, package count, type and size for every line'],
    ['Volume (CBM)', 'Not needed', 'Yes, from the size of each package'],
    ['Who reads it', 'The declarant, to build the customs value', 'The carrier, the warehouse and the declarant, to check the load'],
  ]
  return `<section class="gen-content gen-intent" aria-labelledby="gen-vs">
    <header><span class="section-label">EXPORT PACKING LIST VS COMMERCIAL INVOICE</span><h2 id="gen-vs">Export packing list vs commercial invoice</h2><p>You need both. The commercial invoice states the sale and its value. The export packing list states how the same goods are packed. Customs, the carrier and the receiver read them side by side.</p></header>
    <div class="gen-table-scroll" tabindex="0" role="region" aria-label="Packing list and commercial invoice compared"><table class="gen-guide-table gen-card-table">
      <thead><tr><th scope="col">Point</th><th scope="col">Commercial invoice</th><th scope="col">Packing list</th></tr></thead>
      <tbody>${rows.map(([point, invoice, packing]) => `<tr><th scope="row">${escapeHtml(point)}</th><td data-label="Commercial invoice">${escapeHtml(invoice)}</td><td data-label="Packing list">${escapeHtml(packing)}</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="gen-example-note"><a href="/tools/commercial-invoice-generator/" data-gen-related="sibling_vs">Build the matching commercial invoice</a> with the same references and lines.</p>
  </section>

  <section class="gen-content gen-intent" aria-labelledby="gen-match">
    <header><span class="section-label">PACKING LIST FOR CUSTOMS</span><h2 id="gen-match">Packing list for customs: what must match</h2><p>The declarant checks the packing list against the invoice and the transport document before the entry is built. Make these agree and the shipment moves without questions.</p></header>
    <ol class="gen-checks">
      <li><b>01</b><span><strong>Invoice number.</strong> The packing list quotes the commercial invoice it supports.</span></li>
      <li><b>02</b><span><strong>Descriptions and quantities.</strong> Every line uses the same goods description and quantity as the invoice.</span></li>
      <li><b>03</b><span><strong>Package count and type.</strong> Total packages equal the number on the bill of lading, air waybill or CMR (DE 6/10, 6/9).</span></li>
      <li><b>04</b><span><strong>Gross mass.</strong> Total gross kilograms match the transport document and the invoice (DE 6/5).</span></li>
      <li><b>05</b><span><strong>Marks and numbers.</strong> The marks on the list are the marks on the packages (DE 6/11), so a checked package is found fast.</span></li>
      <li><b>06</b><span><strong>Total volume (CBM).</strong> Every line has its sizes, so the CBM the forwarder plans with is complete.</span></li>
    </ol>
  </section>`
}

function renderWorkedExample(generator) {
  const schema = generator.schema
  const computed = computeDocument(schema, schema.example)
  if (schema.kind === 'invoice') {
    const t = computed.totals
    const money = (p) => formatPence(p, 'EUR')
    return `<section class="gen-example" aria-labelledby="gen-example-heading">
      <header><span class="section-label">WORKED EXAMPLE</span><h2 id="gen-example-heading">A worked commercial invoice, line by line</h2><p>A German seller ships bearings and gaskets to a UK importer on FCA Hamburg terms, invoiced in euros. Load it into the generator with “Load an example”.</p></header>
      <div class="gen-table-scroll" tabindex="0" role="region" aria-label="Worked example arithmetic"><table class="gen-guide-table gen-card-table">
        <thead><tr><th scope="col">Line</th><th scope="col">Calculation</th><th scope="col">Amount</th></tr></thead>
        <tbody>
          <tr><th scope="row">1 · Ball bearings (848210, DE)</th><td data-label="Calculation">400 pcs × €6.85</td><td data-label="Amount">${money(computed.lines[0].lineTotalPence)}</td></tr>
          <tr><th scope="row">2 · Rubber gaskets (401693, CZ)</th><td data-label="Calculation">1,200 pcs × €0.42</td><td data-label="Amount">${money(computed.lines[1].lineTotalPence)}</td></tr>
          <tr><th scope="row">Goods subtotal</th><td data-label="Calculation">Line 1 + line 2</td><td data-label="Amount">${money(t.subtotalPence)}</td></tr>
          <tr><th scope="row">Discount</th><td data-label="Calculation">Agreed discount</td><td data-label="Amount">− ${money(t.discountPence)}</td></tr>
          <tr><th scope="row">Freight + insurance</th><td data-label="Calculation">€320 + €45 invoiced to the buyer</td><td data-label="Amount">${money(t.freightPence + t.insurancePence)}</td></tr>
          <tr><th scope="row">Invoice total</th><td data-label="Calculation">Subtotal − discount + freight + insurance + other</td><td data-label="Amount"><strong>${money(t.totalPence)}</strong></td></tr>
          <tr><th scope="row">Mass</th><td data-label="Calculation">Net and gross, all lines</td><td data-label="Amount">${t.netMass} kg / ${t.grossMass} kg</td></tr>
        </tbody>
      </table></div>
      <p class="gen-example-note">Next, the declarant converts the euro total with the HMRC exchange rate and builds the customs value. <a href="/tools/customs-value-import-duty-vat-calculator/" data-gen-related="value_duty">Work out customs value, import duty and VAT</a> with the free calculator.</p>
    </section>`
  }
  const t = computed.totals
  return `<section class="gen-example" aria-labelledby="gen-example-heading">
    <header><span class="section-label">WORKED EXAMPLE</span><h2 id="gen-example-heading">A worked packing list, package by package</h2><p>The same shipment as the invoice example: five cartons of bearings and gaskets in one container from Hamburg. Load it with “Load an example”.</p></header>
    <div class="gen-table-scroll" tabindex="0" role="region" aria-label="Worked example arithmetic"><table class="gen-guide-table gen-card-table">
      <thead><tr><th scope="col">Line</th><th scope="col">Calculation</th><th scope="col">Result</th></tr></thead>
      <tbody>
        <tr><th scope="row">1 · 4 cartons, 60 × 40 × 30 cm</th><td data-label="Calculation">4 × (60 × 40 × 30) ÷ 1,000,000</td><td data-label="Result">${computed.lines[0].volumeM3.toLocaleString('en-GB', { maximumFractionDigits: 3 })} m³</td></tr>
        <tr><th scope="row">2 · 1 carton, 50 × 40 × 25 cm</th><td data-label="Calculation">1 × (50 × 40 × 25) ÷ 1,000,000</td><td data-label="Result">${computed.lines[1].volumeM3.toLocaleString('en-GB', { maximumFractionDigits: 3 })} m³</td></tr>
        <tr><th scope="row">Total packages</th><td data-label="Calculation">4 + 1</td><td data-label="Result">${t.packages}</td></tr>
        <tr><th scope="row">Net / gross mass</th><td data-label="Calculation">96 + 18 kg / 104 + 21.5 kg</td><td data-label="Result">${t.netMass} kg / ${t.grossMass} kg</td></tr>
        <tr><th scope="row">Total volume</th><td data-label="Calculation">Line 1 + line 2</td><td data-label="Result"><strong>${t.volumeM3.toLocaleString('en-GB', { maximumFractionDigits: 3 })} m³</strong></td></tr>
      </tbody>
    </table></div>
    <p class="gen-example-note">The quantities and weights match the commercial invoice example exactly, which is what a reviewer looks for first. <a href="/tools/commercial-invoice-generator/" data-gen-related="sibling_example">Build the matching commercial invoice</a>.</p>
  </section>`
}

function generatorScript(generator, site, posthogKey, posthogHost) {
  const config = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  const schemaJson = JSON.stringify(generator.schema).replaceAll('<', '\\u003c')
  const canonical = `${site.origin}${generator.path}`
  const engine = [parseAmount, computeDocument, fieldRequiredNow, missingDimensionLines, nextMarks, validateDocument, escapeText, formatPence, renderDocumentHtml, csvCell, documentToCsv, documentToJson, documentFromJson]
    .map((fn) => fn.toString())
    .join('\n')
  return `<script>
    (() => {
      const config = ${config};
      const schema = ${schemaJson};
      const toolId = '${generator.id}';
      const canonicalUrl = '${canonical}';
      ${engine}
      const form = document.getElementById('gen-form');
      const linesHost = document.getElementById('gen-lines');
      const lineTemplate = document.getElementById('gen-line-template');
      const preview = document.getElementById('gen-preview');
      const summary = document.getElementById('gen-summary');
      const summaryList = document.getElementById('gen-summary-list');
      const summaryHeading = document.getElementById('gen-summary-heading');
      const status = document.getElementById('gen-status');
      const fileInput = document.getElementById('gen-open-json');
      let started = false;
      let showValidation = false;

      const get = (key) => { try { return sessionStorage.getItem(key) || ''; } catch { return ''; } };
      const set = (key, value) => { try { sessionStorage.setItem(key, value); } catch {} };
      const attribution = () => {
        const params = new URLSearchParams(location.search);
        const incoming = {
          source: params.get('utm_source') || params.get('src') || '',
          medium: params.get('utm_medium') || '',
          campaign: params.get('utm_campaign') || '',
          content: params.get('utm_content') || '',
          term: params.get('utm_term') || '',
        };
        Object.entries(incoming).forEach(([key, value]) => { if (value && !get('dclrx-' + key)) set('dclrx-' + key, value); });
        return Object.fromEntries(Object.keys(incoming).map((key) => [key, get('dclrx-' + key) || (key === 'source' ? 'direct' : 'none')]));
      };
      const distinctId = get('dclrx-distinct-id') || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
      set('dclrx-distinct-id', distinctId);
      // Analytics carry event names and counts only. No field value ever leaves the page.
      const track = (event, properties = {}) => {
        const payload = { ...attribution(), ...properties, tool_id: toolId, page_path: location.pathname };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event, ...payload });
        if (!config.posthogKey || !navigator.onLine) return;
        const body = JSON.stringify({ api_key: config.posthogKey, event, distinct_id: distinctId, properties: payload });
        if (navigator.sendBeacon && navigator.sendBeacon(config.posthogHost + '/capture/', body)) return;
        fetch(config.posthogHost + '/capture/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => null);
      };

      const lineRows = () => [...linesHost.querySelectorAll('.gen-line')];
      const readState = () => {
        const header = {};
        schema.fields.forEach((field) => { header[field.id] = form.querySelector('#h-' + field.id).value; });
        const lines = lineRows().map((row) => {
          const line = {};
          schema.lineFields.forEach((field) => { line[field.id] = row.querySelector('[data-field="' + field.id + '"]').value; });
          return line;
        });
        return { header, lines };
      };
      const renumber = () => {
        lineRows().forEach((row, index) => {
          row.dataset.line = String(index);
          row.querySelector('.gen-line-number').textContent = 'Line ' + (index + 1);
          row.querySelectorAll('[data-field]').forEach((control) => {
            const id = 'l' + index + '-' + control.dataset.field;
            const label = row.querySelector('label[for="' + control.id + '"]');
            const help = row.querySelector('#' + CSS.escape(control.id + '-help'));
            if (label) label.htmlFor = id;
            if (help) help.id = id + '-help';
            control.id = id;
            control.setAttribute('aria-describedby', id + '-help');
          });
          row.querySelector('[data-remove-line]').setAttribute('aria-label', 'Remove line ' + (index + 1));
          row.querySelector('[data-duplicate-line]').setAttribute('aria-label', 'Duplicate line ' + (index + 1));
        });
      };
      const addLine = (values, after) => {
        const row = lineTemplate.content.firstElementChild.cloneNode(true);
        if (values) schema.lineFields.forEach((field) => { const control = row.querySelector('[data-field="' + field.id + '"]'); if (values[field.id] != null && values[field.id] !== '') control.value = values[field.id]; });
        if (after) after.after(row);
        else linesHost.appendChild(row);
        renumber();
        return row;
      };
      const todayIso = () => {
        const now = new Date();
        return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
      };
      // Date boxes start on today; the user can still change them.
      const fillToday = () => {
        schema.fields.filter((field) => field.type === 'date').forEach((field) => {
          const control = form.querySelector('#h-' + field.id);
          if (control && !control.value) control.value = todayIso();
        });
      };
      const readableDate = (value) => {
        if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(value || '')) return '\u00a0';
        const [y, m, d] = value.split('-').map(Number);
        return 'Reads as ' + new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
      };
      const dimWarning = document.getElementById('gen-dim-warning');
      const dimWarningText = document.getElementById('gen-dim-warning-text');
      let missingLines = [];
      const fillState = (state) => {
        schema.fields.forEach((field) => {
          const control = form.querySelector('#h-' + field.id);
          const value = state.header[field.id] || '';
          if (control.tagName === 'SELECT') control.value = value || control.options[0].value;
          else control.value = value;
        });
        linesHost.innerHTML = '';
        (state.lines.length ? state.lines : [{}]).forEach((line) => addLine(line));
        fillToday();
      };

      const clearMarks = () => {
        form.querySelectorAll('[aria-invalid]').forEach((control) => control.removeAttribute('aria-invalid'));
        form.querySelectorAll('.gen-error').forEach((node) => { node.hidden = true; node.textContent = ''; });
        form.querySelectorAll('.is-warning').forEach((node) => node.classList.remove('is-warning'));
      };
      const controlFor = (issue) => {
        if (issue.line == null) return form.querySelector('#h-' + issue.field) || document.getElementById('gen-add-line');
        const row = lineRows()[issue.line];
        return row ? row.querySelector('[data-field="' + issue.field + '"]') : null;
      };
      const render = () => {
        const state = readState();
        const computed = computeDocument(schema, state);
        const result = validateDocument(schema, state);
        preview.innerHTML = renderDocumentHtml(schema, state, canonicalUrl);
        lineRows().forEach((row, index) => {
          const c = computed.lines[index];
          const out = row.querySelector('[data-line-total]');
          if (schema.kind === 'invoice') out.textContent = c && c.lineTotalPence !== null && Number.isFinite(c.lineTotalPence) ? formatPence(c.lineTotalPence, state.header.currency || 'GBP') : '—';
          else out.textContent = c && c.volumeM3 !== null ? c.volumeM3.toLocaleString('en-GB', { maximumFractionDigits: 3 }) + ' m³' : '—';
        });
        const total = document.getElementById('gen-running-total');
        if (schema.kind === 'invoice') total.textContent = formatPence(computed.totals.totalPence, state.header.currency || 'GBP');
        else total.textContent = computed.totals.packages.toLocaleString('en-GB') + ' pkgs · ' + computed.totals.grossMass.toLocaleString('en-GB', { maximumFractionDigits: 3 }) + ' kg · ' + computed.totals.volumeM3.toLocaleString('en-GB', { maximumFractionDigits: 3 }) + ' m³';
        schema.fields.forEach((field) => {
          const control = form.querySelector('#h-' + field.id);
          const box = control.closest('.gen-field');
          if (field.type === 'date') box.querySelector('[data-date-readout]').textContent = readableDate(control.value);
          if (!field.requiredUnless) return;
          const needed = fieldRequiredNow(field, state.header);
          box.querySelector('[data-required-mark]').hidden = !needed;
          box.querySelector('[data-optional-mark]').hidden = needed;
          const hint = box.querySelector('[data-required-hint]');
          if (hint) hint.hidden = !needed;
          if (needed) control.setAttribute('aria-required', 'true');
          else control.removeAttribute('aria-required');
          control.setAttribute('aria-describedby', (needed && hint ? hint.id + ' ' : '') + 'h-' + field.id + '-help');
        });
        lineRows().forEach((row, index) => {
          const count = computed.lines[index] ? computed.lines[index].packageCount : null;
          row.querySelectorAll('[data-per-package]').forEach((node) => {
            const mass = computed.lines[index] ? computed.lines[index][node.dataset.perPackage] : null;
            node.textContent = Number.isFinite(count) && count > 0 && Number.isFinite(mass) && mass !== null
              ? '= ' + (mass / count).toLocaleString('en-GB', { maximumFractionDigits: 3 }) + ' kg per package'
              : '\u00a0';
          });
        });
        missingLines = missingDimensionLines(schema, state);
        form.querySelectorAll('.is-missing').forEach((node) => node.classList.remove('is-missing'));
        missingLines.forEach((index) => {
          lineRows()[index].querySelectorAll('[data-field="length"], [data-field="width"], [data-field="height"]').forEach((control) => {
            if (!(parseAmount(control.value) > 0)) control.closest('.gen-field').classList.add('is-missing');
          });
        });
        if (dimWarning) {
          const names = missingLines.map((index) => String(index + 1));
          dimWarning.hidden = names.length === 0;
          dimWarningText.textContent = names.length === 0 ? '' : (names.length === 1
            ? 'Line ' + names[0] + ' has no dimensions.'
            : 'Lines ' + names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] + ' have no dimensions.') + ' Total volume is incomplete.';
        }
        clearMarks();
        if (showValidation) {
          result.errors.forEach((issue) => {
            const control = controlFor(issue);
            if (!control) return;
            control.setAttribute('aria-invalid', 'true');
            if (issue.line == null) {
              const node = document.getElementById('h-' + issue.field + '-error');
              if (node) { node.hidden = false; node.textContent = issue.message; }
            }
          });
          result.warnings.forEach((issue) => { const control = controlFor(issue); if (control) control.closest('.gen-field')?.classList.add('is-warning'); });
          const items = [...result.errors.map((issue) => ({ ...issue, level: 'error' })), ...result.warnings.map((issue) => ({ ...issue, level: 'warning' }))];
          summary.hidden = items.length === 0;
          summary.className = 'gen-summary ' + (result.errors.length ? 'has-errors' : 'has-warnings');
          summaryHeading.textContent = result.errors.length
            ? result.errors.length + (result.errors.length === 1 ? ' field needs' : ' fields need') + ' attention before export'
            : 'Ready to export · ' + result.warnings.length + (result.warnings.length === 1 ? ' point' : ' points') + ' to double-check';
          summaryList.innerHTML = items.map((issue, index) => '<li class="is-' + issue.level + '"><a href="#" data-issue="' + index + '">' + escapeText(issue.message) + '</a></li>').join('');
          summaryList.querySelectorAll('[data-issue]').forEach((link) => link.addEventListener('click', (event) => {
            event.preventDefault();
            const control = controlFor(items[Number(link.dataset.issue)]);
            if (control) control.focus();
          }));
        } else {
          summary.hidden = true;
        }
        return { state, computed, result };
      };

      const begin = () => { if (!started) { started = true; track('tool_started'); } };
      form.addEventListener('input', () => { begin(); render(); });
      form.addEventListener('change', () => { begin(); render(); });
      form.addEventListener('submit', (event) => { event.preventDefault(); });
      linesHost.addEventListener('click', (event) => {
        const copy = event.target.closest('[data-duplicate-line]');
        if (copy) {
          if (lineRows().length >= 200) { status.textContent = 'The generator supports up to 200 lines.'; return; }
          begin();
          const source = copy.closest('.gen-line');
          const values = {};
          schema.lineFields.forEach((field) => { values[field.id] = source.querySelector('[data-field="' + field.id + '"]').value; });
          if ('marks' in values) values.marks = nextMarks(values.marks, values.packageCount);
          const row = addLine(values, source);
          render();
          const from = Number(source.dataset.line) + 1;
          const to = Number(row.dataset.line) + 1;
          status.textContent = 'Line ' + to + ' added as a copy of line ' + from + '.';
          row.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          row.querySelector('[data-field]').focus({ preventScroll: true });
          track('tool_line_duplicated', { line_count: lineRows().length });
          return;
        }
        const button = event.target.closest('[data-remove-line]');
        if (!button) return;
        const rows = lineRows();
        if (rows.length === 1) {
          rows[0].querySelectorAll('[data-field]').forEach((control) => { control.value = control.tagName === 'SELECT' ? control.options[0].value : ''; });
        } else {
          button.closest('.gen-line').remove();
        }
        renumber();
        render();
        status.textContent = 'Line removed.';
        const first = lineRows()[0];
        if (first) first.querySelector('[data-field]').focus();
      });
      document.getElementById('gen-add-line').addEventListener('click', () => {
        if (lineRows().length >= 200) { status.textContent = 'The generator supports up to 200 lines.'; return; }
        begin();
        const row = addLine();
        render();
        row.querySelector('[data-field]').focus();
        status.textContent = 'Line ' + lineRows().length + ' added.';
      });

      const ready = (action) => {
        showValidation = true;
        const { state, computed, result } = render();
        const blank = state.lines.every((line) => Object.values(line).every((value) => !value || value === 'pcs' || value === 'CT'));
        if (result.errors.length) {
          track('tool_validation_failed', { action, error_count: result.errors.length, warning_count: result.warnings.length, blank_lines: blank });
          summary.focus();
          status.textContent = summaryHeading.textContent;
          return null;
        }
        return { state, computed, result };
      };
      const props = (data) => ({ line_count: data.state.lines.length, warning_count: data.result.warnings.length });
      const download = (filename, mime, content) => {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
      const fileBase = (state) => (schema.kind === 'invoice' ? (state.header.documentType === 'proforma' ? 'proforma-invoice-' : 'commercial-invoice-') : 'packing-list-') + ((state.header[schema.numberField] || 'draft').replace(/[^A-Za-z0-9_-]+/g, '-').slice(0, 60) || 'draft');

      document.getElementById('gen-check').addEventListener('click', () => {
        const data = ready('check');
        if (!data) return;
        status.textContent = data.result.warnings.length ? summaryHeading.textContent : 'Every required field is complete. Ready to print or download.';
        track('tool_completed', { ...props(data), action: 'check' });
        if (!data.result.warnings.length) { summary.hidden = false; summary.className = 'gen-summary is-ready'; summaryHeading.textContent = 'Ready to print or download'; summaryList.innerHTML = ''; summary.focus(); }
      });
      document.getElementById('gen-print').addEventListener('click', () => {
        const data = ready('print');
        if (!data) return;
        track('tool_completed', { ...props(data), action: 'print' });
        track('tool_result_printed', props(data));
        window.print();
      });
      document.getElementById('gen-csv').addEventListener('click', () => {
        const data = ready('csv');
        if (!data) return;
        download(fileBase(data.state) + '.csv', 'text/csv;charset=utf-8', '\\ufeff' + documentToCsv(schema, data.state));
        track('tool_completed', { ...props(data), action: 'csv' });
        track('tool_result_downloaded', { ...props(data), format: 'csv' });
        status.textContent = 'CSV downloaded.';
      });
      document.getElementById('gen-json').addEventListener('click', () => {
        const state = readState();
        download(fileBase(state) + '.json', 'application/json', documentToJson(schema, state));
        track('tool_result_downloaded', { line_count: state.lines.length, format: 'json' });
        status.textContent = 'JSON downloaded. Open it here later to keep editing.';
      });
      document.getElementById('gen-print-blank').addEventListener('click', () => {
        const before = preview.innerHTML;
        preview.innerHTML = renderDocumentHtml(schema, { header: {}, lines: [] }, canonicalUrl);
        track('tool_blank_template_printed');
        const restore = () => { preview.innerHTML = before; window.removeEventListener('afterprint', restore); };
        window.addEventListener('afterprint', restore);
        window.print();
        setTimeout(restore, 1500);
      });
      document.getElementById('gen-example').addEventListener('click', () => {
        begin();
        fillState(schema.example);
        showValidation = false;
        render();
        track('tool_example_loaded');
        status.textContent = 'Example loaded. Replace it with your own details.';
      });
      document.getElementById('gen-clear').addEventListener('click', () => {
        fillState({ header: {}, lines: [] });
        showValidation = false;
        render();
        status.textContent = 'Form cleared.';
        form.querySelector('[data-field]').focus();
      });
      fileInput.addEventListener('change', async () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        try {
          if (file.size > 1000000) throw new Error('size');
          const state = documentFromJson(schema, await file.text());
          begin();
          fillState(state);
          showValidation = false;
          render();
          status.textContent = 'Saved file opened. Nothing was uploaded.';
          track('tool_saved_file_opened', { line_count: state.lines.length });
        } catch {
          status.textContent = 'That file is not a saved ' + (schema.kind === 'invoice' ? 'commercial invoice' : 'packing list') + ' JSON from this generator.';
        }
        fileInput.value = '';
      });
      document.querySelectorAll('[data-gen-booking]').forEach((link) => link.addEventListener('click', () => track('tool_booking_clicked', { placement: link.dataset.genBooking })));
      document.querySelectorAll('[data-gen-pack]').forEach((link) => link.addEventListener('click', () => track('tool_pack_check_clicked', { placement: link.dataset.genPack })));
      document.querySelectorAll('[data-gen-related]').forEach((link) => link.addEventListener('click', () => track('tool_related_clicked', { target: link.dataset.genRelated })));
      const dimFix = document.getElementById('gen-dim-fix');
      if (dimFix) dimFix.addEventListener('click', () => {
        const row = lineRows()[missingLines[0]];
        if (!row) return;
        const target = [...row.querySelectorAll('[data-field="length"], [data-field="width"], [data-field="height"]')].find((control) => !(parseAmount(control.value) > 0));
        if (target) { target.scrollIntoView({ block: 'center' }); target.focus({ preventScroll: true }); }
      });
      document.documentElement.classList.add('gen-js');
      fillToday();
      render();
      attribution();
    })();
  </script>`
}

export function renderDocumentGenerator(generator, site, { navHtml, webmasterHtml, posthogKey, posthogHost, eoriEnabled }) {
  const canonical = `${site.origin}${generator.path}`
  const schema = generator.schema
  const isInvoice = schema.kind === 'invoice'
  const noun = isInvoice ? 'commercial invoice' : 'packing list'
  const blankPreview = renderDocumentHtml(schema, { header: {}, lines: [] }, canonical)
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(generator.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterHtml}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <link rel="stylesheet" href="/tool.css" />
    <link rel="stylesheet" href="/document-generator.css" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(generator.title)}" />
    <meta property="og:description" content="${escapeHtml(generator.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(generator.title)}" />
    <meta name="twitter:description" content="${escapeHtml(generator.description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${escapeHtml(generator.title)}</title>
    <script type="application/ld+json">${jsonLd(generator, site)}</script>
  </head>
  <body>
    <div class="docket tool-docket gen-docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>FREE TOOL</span><strong>BROWSER ONLY · NO UPLOAD</strong></div>
        <a class="masthead-cta" data-gen-booking="masthead" href="/?src=tool_${generator.id}#book">BOOK THE 20-MINUTE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${navHtml}</nav>
      <div class="breadcrumbs">${breadcrumbHtml(generator.path, escapeHtml(nameForPath(generator.path).toUpperCase()))}</div>
      <main>
        <header class="hero tool-hero gen-hero gen-hero-lead">
          <div class="hero-copy">
            <p class="eyebrow">${escapeHtml(generator.eyebrow)}</p>
            <h1>${escapeHtml(generator.h1)}</h1>
            ${generator.subhead ? `<p class="gen-subhead">${escapeHtml(generator.subhead)}</p>` : ''}
            <p class="gen-intro">${escapeHtml(generator.intro)}</p>
          </div>
        </header>

        <section class="gen-builder" id="gen-builder" aria-labelledby="gen-builder-heading">
          <header class="gen-builder-head">
            <div><span class="section-label">GENERATOR</span><h2 id="gen-builder-heading">Create your ${noun}</h2><p class="gen-cds-note">Green tags show where each field goes on the UK customs declaration, so your broker can key it straight in.</p><p>Fields marked * are needed before export. Amounts use a full stop for decimals; commas and currency symbols are ignored.</p></div>
            <div class="gen-quick"><button class="secondary-button" id="gen-example" type="button">LOAD AN EXAMPLE</button><button class="secondary-button" id="gen-clear" type="button">CLEAR FORM</button><label class="secondary-button gen-file" for="gen-open-json">OPEN A SAVED JSON FILE<input id="gen-open-json" type="file" accept="application/json,.json" /></label></div>
          </header>
          <noscript><p class="gen-noscript">The live generator needs JavaScript. You can still print the blank template below or download the <a href="${generator.templateCsv}">blank CSV template</a>.</p></noscript>
          <form id="gen-form" novalidate>
            <div class="gen-groups">${renderHeaderFields(schema)}</div>
            <section class="gen-lines-block" aria-labelledby="gen-lines-heading">
              <header><h3 id="gen-lines-heading">${isInvoice ? 'Goods lines' : 'Package lines'}</h3><p>${isInvoice ? 'One line per type of goods. Line totals are quantity × unit price, rounded to the penny.' : 'One line per group of identical packages. Dimensions are for one package; volume covers the whole line.'}</p></header>
              <div id="gen-lines">${renderLineRow(schema, 0)}</div>
              <template id="gen-line-template">${renderLineRow(schema, 0)}</template>
              <div class="gen-lines-foot"><button class="secondary-button" id="gen-add-line" type="button">+ ADD LINE</button><p>${isInvoice ? 'Running invoice total' : 'Running totals'} <output id="gen-running-total">—</output></p></div>
            </section>
          </form>
          <div class="gen-summary" id="gen-summary" tabindex="-1" role="alert" hidden><h3 id="gen-summary-heading"></h3><ul id="gen-summary-list"></ul></div>
          ${isInvoice ? '' : '<p class="gen-dim-warning" id="gen-dim-warning" role="status" hidden><span id="gen-dim-warning-text"></span> <button class="gen-text-button" id="gen-dim-fix" type="button">ADD SIZES</button></p>'}
          <div class="gen-actions">
            <button class="button" id="gen-print" type="button">PRINT / SAVE AS PDF</button>
            <button class="secondary-button" id="gen-csv" type="button">DOWNLOAD CSV</button>
            <button class="secondary-button" id="gen-json" type="button">DOWNLOAD JSON</button>
            <button class="secondary-button" id="gen-check" type="button">CHECK MY ${noun.toUpperCase()}</button>
          </div>
          <p class="visually-hidden" id="gen-status" aria-live="polite"></p>
        </section>

        <section class="hero tool-hero gen-hero gen-hero-more" aria-label="About the free ${noun} generator">
          <div class="hero-copy">
            <p>${escapeHtml(generator.standfirst)}</p>
            <div class="gen-hero-actions"><a class="button" href="#gen-builder">BUILD MY ${noun.toUpperCase()}</a><a class="gen-text-link" href="#gen-template">SEE THE FREE TEMPLATE →</a></div>
            <div class="privacy-strip"><strong>FREE · NO SIGN-UP</strong><strong>STAYS IN YOUR BROWSER</strong><strong>PDF · CSV · JSON</strong></div>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${escapeHtml(generator.ref)}</span>
            <div class="stamp">${isInvoice ? 'INVOICE<br />READY' : 'PACKED<br />+ LISTED'}</div>
            <div class="review-cell"><span>EDITION</span><strong>${generator.reviewedOn}</strong></div>
          </aside>
        </section>

        <section class="answer-block" aria-labelledby="direct-answer">
          <span class="section-label">DIRECT ANSWER</span>
          <div>
            <h2 id="direct-answer">${escapeHtml(generator.directAnswer.question)}</h2>
            <p>${escapeHtml(generator.directAnswer.answer)}</p>
          </div>
        </section>

        <section class="gen-privacy" aria-label="Privacy">
          <strong>Your data never leaves your browser.</strong>
          <span>The ${noun} is built on this page. Nothing you type is uploaded, emailed or stored by Declarix, and once the page has loaded it keeps working offline. Download the JSON file to keep a copy you can reopen here.</span>
        </section>


        <section class="gen-template" id="gen-template" aria-labelledby="gen-template-heading">
          <header><span class="section-label">FREE ${noun.toUpperCase()} TEMPLATE</span><h2 id="gen-template-heading">${isInvoice ? 'Commercial invoice template' : 'Packing list template'}: live preview</h2><p>This is the layout the generator prints. It fills in as you type above. Print it blank to complete by hand, or take the <a href="${generator.templateCsv}" download data-gen-related="template_csv">blank CSV template</a> into a spreadsheet.</p><button class="secondary-button" id="gen-print-blank" type="button">PRINT THE BLANK TEMPLATE</button></header>
          <article class="gen-doc" id="gen-preview" aria-label="${escapeHtml(noun)} preview">${blankPreview}</article>
        </section>

        <section class="gen-next" aria-labelledby="gen-next-heading">
          <div><span class="section-label">NEXT STEP</span><h2 id="gen-next-heading">Your ${noun} is ready. Now check the whole pack.</h2><p>A clean ${noun} is one document. The free pack check turns the rest of the handoff (transport document, origin, valuation, procedure and controls) into a prioritised work list.</p></div>
          <div class="gen-next-actions"><a class="button" data-gen-pack="result" href="/tools/customs-document-pack-check/">RUN THE FREE PACK CHECK</a><a class="gen-text-link" href="/${isInvoice ? 'tools/packing-list-generator/' : 'tools/commercial-invoice-generator/'}" data-gen-related="sibling">${isInvoice ? 'BUILD THE MATCHING PACKING LIST →' : 'BUILD THE MATCHING COMMERCIAL INVOICE →'}</a></div>
        </section>

        ${isInvoice ? renderInvoiceContent(eoriEnabled) : renderPackingContent()}

        ${isInvoice ? renderInvoiceIntentSections() : renderPackingIntentSections()}

        <section class="gen-guide" aria-labelledby="gen-guide-heading">
          <header><span class="section-label">FIELD GUIDE</span><h2 id="gen-guide-heading">Every field, mapped to the customs declaration</h2><p>Each field lines up with the CDS data element the declarant completes, so the ${noun} answers the broker’s questions before they are asked.</p></header>
          ${renderFieldGuide(schema)}
        </section>

        ${renderWorkedExample(generator)}

        <section class="gen-content gen-handoff" aria-labelledby="gen-handoff-heading">
          <header><span class="section-label">BEFORE CUSTOMS HANDOFF</span><h2 id="gen-handoff-heading">Five checks before the ${noun} goes to your broker</h2></header>
          <ol class="gen-checks">
            <li><b>01</b><span>${isInvoice ? 'Every line has a full description, commodity code and origin.' : 'Every line has marks, a package count and contents that match the invoice.'}</span></li>
            <li><b>02</b><span>${isInvoice ? 'The invoice total equals the goods subtotal after discount and charges.' : 'Total packages match the transport document.'}</span></li>
            <li><b>03</b><span>Net mass is never above gross mass, on any line.</span></li>
            <li><b>04</b><span>EORI numbers are present for the parties that hold them.${eoriEnabled ? ' <a href="/tools/eori-checker/" data-gen-related="eori_check">Check a GB EORI</a>.' : ''}</span></li>
            <li><b>05</b><span>${isInvoice ? 'The packing list shows the same quantities and weights.' : 'The commercial invoice shows the same quantities and weights.'} <a href="/${isInvoice ? 'tools/packing-list-generator/' : 'tools/commercial-invoice-generator/'}" data-gen-related="sibling_check">${escapeHtml(generator.sibling.label)}</a>.</span></li>
          </ol>
          <p>For brokers and forwarders, Declarix reads the invoice, packing list and transport documents on every incoming job, shows any conflict beside its source for the clerk, and builds the CDS-ready entry pack. That is how teams reach up to 3× more declarations per clerk.</p>
        </section>

        <section class="gen-questions" aria-labelledby="gen-questions-heading">
          <header><span class="section-label">QUESTIONS</span><h2 id="gen-questions-heading">${isInvoice ? 'Commercial invoice questions' : 'Packing list questions'}, answered</h2></header>
          <div>${renderQuestions(generator)}</div>
        </section>

        <section class="related-workpapers gen-related" aria-labelledby="gen-related-heading"><header><span class="section-label">KEEP WORKING</span><h2 id="gen-related-heading">More free customs tools</h2></header><nav aria-label="Related free Declarix tools">
          <a href="${generator.sibling.path}" data-gen-related="sibling_nav"><span>FREE GENERATOR</span><strong>${escapeHtml(generator.sibling.label)}</strong><b>OPEN →</b></a>
          <a href="/tools/customs-document-pack-check/" data-gen-pack="related"><span>FREE TOOL</span><strong>Customs document pack check</strong><b>OPEN →</b></a>
          <a href="/tools/customs-value-import-duty-vat-calculator/" data-gen-related="value_duty_nav"><span>FREE CALCULATOR</span><strong>Import duty and VAT calculator</strong><b>OPEN →</b></a>
          ${eoriEnabled ? '<a href="/tools/eori-checker/" data-gen-related="eori_nav"><span>FREE CHECKER</span><strong>GB EORI number checker</strong><b>OPEN →</b></a>' : ''}
        </nav></section>

        ${renderSources(generator)}
        <section class="cta-band"><div><h2>Turn every incoming ${noun} into a CDS-ready entry.</h2><p>Declarix reads the invoice, packing list and transport documents your customers send, builds the CDS-ready pack and hands it to your clerk for review. Bring your weekly volume to the 20-minute numbers call.</p></div><a class="button" data-gen-booking="bottom" href="/?src=tool_${generator.id}_bottom#book">BOOK THE 20-MINUTE NUMBERS CALL</a></section>
        <div class="source-stamp">FREE TOOL · VERSION 1.0 · REVIEWED ${generator.reviewedOn} · <a href="/editorial-policy/">SOURCES AND CORRECTIONS</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
      </main>
      <footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav></footer>
    </div>
    ${generatorScript(generator, site, posthogKey, posthogHost)}
  </body>
</html>`
}

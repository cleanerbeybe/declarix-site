export const flights = [
  {
    value: 'OSAKA TABLEWARE CO., LTD',
    source: 'D1 head',
    row: 'EXPORTER',
    ref: 'D1 · P.1 · L.03',
  },
  {
    value: 'MERIDIAN HOUSEWARES LTD, LEICESTER',
    source: 'D1',
    row: 'IMPORTER · EORI GB4471...',
    ref: 'D1 · P.1 · L.08',
  },
  {
    value: 'CIF FELIXSTOWE',
    source: 'D1 footer',
    row: 'INCOTERM / DELIVERY TERMS',
    ref: 'D1 · P.2 · L.44',
  },
  {
    value: '£ 25,540.11',
    source: 'D1 total',
    row: 'INVOICE TOTAL',
    ref: 'D1 · P.2 · L.48',
    note: 'JPY→GBP · HMRC MONTHLY RATE — APPLIED ✓',
  },
  {
    value: '640 CARTONS / 16 PALLETS',
    source: 'D3',
    row: 'PACKAGES',
    ref: 'D3 · P.1 · L.12',
  },
  {
    value: '8,412 KG GROSS · 7,706 KG NET',
    source: 'D3',
    row: 'MASS',
    ref: 'D3 · P.1 · L.13',
  },
  {
    value: 'MAEU 2264 8891',
    source: 'D4',
    row: 'PREVIOUS DOCUMENT (N705)',
    ref: 'D4 · P.1 · L.04',
  },
  {
    value: 'JP — ORIGIN, LINES 1-43',
    source: 'D1/D2',
    row: 'COUNTRY OF ORIGIN',
    ref: 'D2 · P.1 · L.17',
  },
]

export const packRows = [
  ...flights,
  {
    value: 'DECLARIX DEMO LTD',
    source: 'Configured account',
    row: 'DECLARANT',
    ref: 'PROFILE · DECLARANT',
  },
  {
    value: '40 00 000',
    source: 'Entry template',
    row: 'CPC',
    ref: 'PACK · RULE SET',
  },
  {
    value: 'N935 · N271 · N705',
    source: 'D1 / D3 / D4',
    row: 'DOC CODES',
    ref: 'PACK · DOC INDEX',
  },
  {
    value: 'GBFXT',
    source: 'Bill of lading',
    row: 'LOCATION',
    ref: 'D4 · P.1 · L.09',
  },
  {
    value: '...29 FURTHER LINE ITEMS IN THE PACK',
    source: 'D1/D2 line table',
    row: 'FURTHER LINES',
    ref: 'D1-D2 · LINE TABLE',
  },
]

export const documents = [
  {
    tag: 'D1 · INVOICE OTC-4471',
    title: 'OSAKA TABLEWARE CO., LTD',
    lines: [
      'Ship to: Meridian Housewares Ltd, Leicester',
      'CIF FELIXSTOWE',
      '¥ 4,862,400 · JPY',
    ],
  },
  {
    tag: 'D2 · INVOICE OTC-4488',
    title: 'ADDITIONAL STONEWARE LINES',
    lines: ['Lines 19-43 · JP origin', 'Material: stoneware', 'Totals reconciled ✓'],
  },
  {
    tag: 'D3 · PACKING LIST',
    title: '640 CARTONS / 16 PALLETS',
    lines: ['8,412 KG GROSS', '7,706 KG NET', 'Marks: DX-2216'],
  },
  {
    tag: 'D4 · BILL OF LADING MAEU 2264 8891',
    title: 'PORT OF LOADING: OSAKA',
    lines: ['Previous document: N705', 'Arrival: GBFXT', 'Container: MRKU 118204-7'],
  },
  {
    tag: 'D5 · EMAIL — RE: URGENT FELIXSTOWE',
    title: '14:22 FROM CUSTOMER',
    lines: ['Need this cleared tomorrow.', 'Terms may be CIP?', 'Packing list attached.'],
  },
  {
    tag: 'D6 · PHONE PHOTO DELIVERY NOTE',
    title: 'DELIVERY NOTE',
    lines: ['Photo skewed 4°', 'Pallet count confirmed', 'Two signatures visible'],
  },
]

export const questions = [
  {
    q: 'Who carries the liability?',
    a: 'You do — exactly as today. Declarix prepares; your clerk approves; your firm submits through its own badge. Nothing reaches HMRC from us, ever. The pack exists to make your check faster, not to skip it.',
  },
  {
    q: 'We already run Sequoia / Descartes.',
    a: "Keep them. That's the point. Declarix outputs a pack your system ingests; we sit in front of your software, not instead of it.",
  },
  {
    q: 'Our jobs are messy.',
    a: "Good — messy is the product's home ground: amalgamated invoices, part shipments, scans, spreadsheets that fight back. The pilot is one anonymised ugly pack processed side-by-side. If Declarix can't structure it, you've lost nothing and we've learned something.",
  },
  {
    q: 'Where does client data go?',
    a: 'In, through, out. Documents are deleted once the pack is returned — retention zero days, no training on your data, subprocessors listed on request.',
  },
  {
    q: 'What does it cost?',
    a: "Per entry, not per seat. The pilot is free if it fails and capped at £500 if it works. Exact per-entry rate depends on your mix — that's the 20-minute call.",
  },
  {
    q: 'Will my clerks need training?',
    a: 'No. The pack arrives; they check it in the system they already know. Most clerks are reviewing their first pack within the hour — with their own name still on the entry.',
  },
]

export const specimens = [
  'SCANNED CMR — SKEWED 4°',
  'XLSX — 312 LINES, MERGED CELLS',
  '.EML + 5 ATTACHMENTS',
  'HANDWRITTEN DELIVERY NOTE',
  'TWO INVOICES, ONE ENTRY',
  'PHOTO — TAKEN IN A CAB',
]

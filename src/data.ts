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
      'LINE 01 STONEWARE MUGS · 180 CTN',
      'LINE 02 SIDE PLATES · 220 CTN',
      'PAGE 1 OF 2 · TOTALS CARRIED',
    ],
  },
  {
    tag: 'D2 · INVOICE OTC-4488',
    title: 'ADDITIONAL STONEWARE LINES',
    lines: [
      'Lines 19-43 · JP origin',
      'Material: stoneware',
      'Totals reconciled ✓',
      'LINE 41 BOWLS · 72 CTN',
      'AMALGAMATION NOTE: OTC-4471 + OTC-4488',
    ],
  },
  {
    tag: 'D3 · PACKING LIST',
    title: '640 CARTONS / 16 PALLETS',
    lines: [
      '8,412 KG GROSS',
      '7,706 KG NET',
      'Marks: DX-2216',
      'PALLET 01-08 · FELIXSTOWE',
      'PALLET 09-16 · FELIXSTOWE',
    ],
  },
  {
    tag: 'D4 · BILL OF LADING MAEU 2264 8891',
    title: 'PORT OF LOADING: OSAKA',
    lines: [
      'Previous document: N705',
      'Arrival: GBFXT',
      'Container: MRKU 118204-7',
      'Vessel: MAERSK AVON',
      'ETA: 09 JUL · TERMS CHECKED',
    ],
  },
  {
    tag: 'D5 · EMAIL — RE: URGENT FELIXSTOWE',
    title: '14:22 FROM CUSTOMER',
    lines: [
      'Need this cleared tomorrow.',
      'Terms may be CIP?',
      'Packing list attached.',
      'Please combine both invoices.',
      'Call if tariff code missing.',
    ],
  },
  {
    tag: 'D6 · PHONE PHOTO DELIVERY NOTE',
    title: 'DELIVERY NOTE',
    lines: [
      'Photo skewed 4°',
      'Pallet count confirmed',
      'Two signatures visible',
      'Warehouse copy · partial glare',
    ],
  },
]

export const mobileMovements = [
  {
    tag: 'MV-1 · THE MESS',
    title: '08:52 — the job lands.',
    copy: '6 attachments, 3 formats, 43 lines, 2 invoices. The stack arrives exactly how your customer sends it.',
  },
  {
    tag: 'MV-2 · THE READ',
    title: 'The scan finds the values.',
    copy: 'Exporter, importer, terms, totals, packages, mass, previous document and origin move into their rows.',
    chips: ['EXPORTER', 'INCOTERM', 'TOTAL', 'MASS', 'ORIGIN'],
  },
  {
    tag: 'MV-3 · THE FLAGS',
    title: 'Missing facts are surfaced.',
    copy: 'Commodity code not stated. Incoterm conflict. The question is raised with evidence instead of guessed.',
  },
  {
    tag: 'MV-4 · THE EVIDENCE',
    title: 'Every field shows its working.',
    copy: 'Tap a row and the source document, page and line stay attached to the value your clerk checks.',
  },
  {
    tag: 'MV-5 · THE HANDOVER',
    title: 'The pack is ready for your system.',
    copy: 'The CDS-ready export moves into Sequoia, Descartes e-Customs or your customer integration.',
  },
]

export const questions = [
  {
    q: 'Who carries the liability?',
    a: 'You do — exactly as today. Declarix prepares; your clerk approves; your firm submits through its own badge. Nothing reaches HMRC from us. The entry pack keeps sources visible during the check; it does not skip it.',
  },
  {
    q: 'We already run Sequoia / Descartes.',
    a: "Keep them. That's the point. Declarix produces CDS-ready exports for Sequoia, Descartes e-Customs and customer integrations. We sit in front of your filing system, not instead of it.",
  },
  {
    q: "We're comparing capture platforms.",
    a: 'Compare the whole job, not a clean invoice demo: messy attachments in, clerk-checked entry data out, inside your existing system. Then compare cost per declaration, time to value and what the clerk still has to do.',
  },
  {
    q: "We're a forwarder, not a broker.",
    a: "Same paperwork, same manual build. If your team files through its own permissions or hands the job to a broker, Declarix can prepare the entry pack and evidence for that workflow.",
  },
  {
    q: 'Our jobs are messy.',
    a: "Good. Messy is the product's home ground: amalgamated invoices, part shipments, scans, phone photos and spreadsheets that fight back. Bring the worst workflow to the call; that is usually where the ROI is easiest to find.",
  },
  {
    q: 'Where does client data go?',
    a: 'Customer documents are processed for the job, returned with the pack and never used to train models. Before live documents move, we provide the deployment details your security and data teams need.',
  },
  {
    q: "What's the turnaround at 9am, not in a demo?",
    a: 'Typical Declarix processing is around 200 seconds before clerk review. Live desk turnaround depends on queue, job mix and exceptions, so the call maps your peak volume and the pilot proves it under your conditions.',
  },
  {
    q: 'What does it cost?',
    a: "Per entry, not per seat. We size the rate against the labour and capacity you recover. The pilot is free if it fails and capped at £500 if it works. Your per-entry rate comes from the 20-minute numbers call.",
  },
  {
    q: 'Will my clerks need training?',
    a: 'They keep the system they already know. Declarix changes the work arriving at their desk: instead of building the entry field by field, they check the CDS-ready pack and its linked evidence before approval.',
  },
  {
    q: 'We outsource customs today.',
    a: 'Declarix changes the maths of bringing declarations in-house: one experienced clerk can review far more jobs when the entry is already built. Bring the outsourced cost and expected volume to the numbers call and compare it properly.',
  },
]

export const specimens = [
  'D6 · FROM THE JOB ABOVE',
  'SCANNED CMR — SKEWED 4°',
  'XLSX — 312 LINES, MERGED CELLS',
  '.EML + 5 ATTACHMENTS',
  'HANDWRITTEN DELIVERY NOTE',
  'TWO INVOICES, ONE ENTRY',
  'PHOTO — TAKEN IN A CAB',
]

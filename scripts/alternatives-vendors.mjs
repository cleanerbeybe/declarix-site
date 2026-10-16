// Dated vendor fact registry for the alternatives pages, the buyer shortlist and the automation page.
// Every competitor fact comes from the vendor's own public page or the HMRC software-developer list,
// checked on VENDOR_CHECKED. Unknown stays "not stated on the pages checked" — never "no".
// Review owner: Declarix SEO lead. Re-check every vendor row before changing a "best for" label.

export const VENDOR_CHECKED = '2026-10-15'
export const HMRC_LIST_UPDATED = '22 September 2026'

export const hmrcList = {
  title: 'List of software developers providing customs declaration support',
  publisher: 'HM Revenue & Customs · GOV.UK',
  url: 'https://www.gov.uk/guidance/list-of-software-developers-providing-customs-declaration-support',
  checked: VENDOR_CHECKED,
}

const src = (title, publisher, url) => ({ title, publisher, url, checked: VENDOR_CHECKED })

// GOV.UK pages behind the "Is there free CDS software?" answer on /best-customs-software/ (checked 16 Oct 2026).
// "Subscribe to the Customs Declaration Service" (updated 6 July 2026): "use your own purchased customs software
// for Customs Declaration Service import and export declarations".
// "Get someone to deal with customs for you" (updated 6 February 2025): agents, brokers and freight forwarders.
export const govSubscribe = {
  title: 'Subscribe to the Customs Declaration Service',
  publisher: 'HM Revenue & Customs · GOV.UK',
  url: 'https://www.gov.uk/guidance/get-access-to-the-customs-declaration-service',
  checked: '2026-10-16',
}
export const govAgent = {
  title: 'Get someone to deal with customs for you',
  publisher: 'HM Revenue & Customs · GOV.UK',
  url: 'https://www.gov.uk/guidance/appoint-someone-to-deal-with-customs-on-your-behalf',
  checked: '2026-10-16',
}

export const declarix = {
  id: 'declarix',
  name: 'Declarix',
  bestFor: 'Best for UK brokers and forwarders who want up to 3× more declarations per clerk while keeping Sequoia or Descartes',
  layer: 'Document preparation in front of your filing system',
  filing: 'Builds the CDS-ready entry pack; your existing system and badge file it',
  worksWith: 'Sequoia, Descartes e-Customs and customer integrations',
  precheck: 'Reads the whole job, links every field to its source and raises conflicts as questions',
  throughput: 'Up to 3× more declarations per clerk; typical processing around 200 seconds before clerk review',
  pricing: 'Published: Desk £500/month for 100 packs, Team £4,000/month for 1,000, Scale £9,000/month for 3,000; extra packs at the package rate, never below £3.00',
  uk: 'UK company, Leicester; 20-minute numbers call and one-job pilot',
  summary:
    'Declarix reads the emails, invoices, packing lists, scans and spreadsheets a customer sends, then builds the CDS-ready entry pack. Every proposed value keeps its source document, page and line, and every conflict stays visible as a question. Your clerk checks the evidence and approves; Sequoia, Descartes e-Customs or your customer integration files it.',
  points: [
    'Up to 3× more declarations per clerk, with no new headcount.',
    'Typical processing is around 200 seconds before clerk review.',
    'Per pack, not per seat: no seat fees and no hosting fees.',
    'Pilot: £0 upfront, £1 per declaration, capped at £500, and fully waived if the agreed success criteria are missed.',
    'Customer documents are never used to train models.',
  ],
  sources: [
    src('Declarix supported scope', 'Declarix Limited', 'https://getdeclarix.com/supported-scope/'),
    src('Declarix pricing', 'Declarix Limited', 'https://getdeclarix.com/pricing/'),
  ],
}

export const vendors = {
  icustoms: {
    id: 'icustoms',
    name: 'iCustoms',
    bestFor: 'Best for UK and Irish traders who want filing, classification and document processing on one platform',
    layer: 'Customs filing and trade-compliance platform',
    filing: 'Yes. HMRC lists iCustoms for CDS imports, CDS exports and simplified import declarations',
    worksWith: 'Its own modules (iDP, iCDS, iAIS/iAES, ICS2, iClassification); no third-party filing system named on the pages checked',
    precheck: 'Markets an intelligent document processing module (iDP)',
    throughput: 'Vendor states “Submit declaration in 3 minutes”',
    pricing: 'Quote-based; no public price on the pages checked',
    uk: 'UK and Ireland, plus EU and global coverage stated by the vendor',
    summary:
      'iCustoms describes itself as an “AI customs and trade compliance platform for importers and exporters”. Its iCDS module covers UK imports and exports on CDS, and iAIS/iAES covers Irish filings. It also markets AI tariff classification.',
    facts: [
      ['Product', 'iCustoms platform: iDP, iCDS, iAIS/iAES, ICS2 and iClassification modules'],
      ['Who it is for', 'Customs agents, traders, carriers and postal operators (vendor wording)'],
      ['CDS filing', 'On the HMRC list for CDS imports, CDS exports and simplified imports'],
      ['Jurisdictions', 'UK and Ireland; the vendor also lists EU and global coverage'],
      ['Pricing', 'Quote-based; no public price found on the pages checked'],
    ],
    sources: [
      src('iCustoms homepage', 'iCustoms', 'https://www.icustoms.ai/'),
      src('iCustoms customs automation', 'iCustoms', 'https://www.icustoms.ai/customs-automation/'),
    ],
  },
  flytta: {
    id: 'flytta',
    name: 'Flytta (now part of Sedna)',
    bestFor: 'Best for teams that want customs automation inside the Sedna trade-communication platform',
    layer: 'AI declaration automation, now part of Sedna AI',
    filing: 'Returns a completed declaration as Excel or CSV, or sends it to a provider such as ASM or Descartes by API',
    worksWith: 'ASM Sequoia, Descartes, Sedna and Outlook (vendor list)',
    precheck: 'Reads commercial invoices, packing lists and CMRs in over 50 formats',
    throughput: 'Vendor states it creates declarations “instantly”',
    pricing: 'Published: “£5 Per Trade”; Flytta Pro “£50 Per Month Per Seat”; Enterprise on request',
    uk: 'UK (HMRC, CDS and UK Tariff references)',
    summary:
      'Flytta automates import and export declarations from commercial invoices, packing lists and CMRs. Its site carries the banner “Flytta Has Been Acquired By Sedna”, and Sedna states that Flytta’s customs workflow “is now part of Sedna AI”.',
    facts: [
      ['Ownership', 'Acquired by Sedna; Sedna says the workflow “is now part of Sedna AI”'],
      ['Who it is for', 'Customs agents and importers/exporters (vendor wording)'],
      ['Output', 'Excel, CSV or API drop into a provider such as ASM or Descartes'],
      ['Pricing', '“£5 Per Trade”; Flytta Pro “£50 Per Month Per Seat”; Enterprise on request'],
      ['HMRC list', 'Not listed under Flytta or Sedna (the list covers filing software)'],
    ],
    sources: [
      src('Flytta homepage', 'Flytta', 'https://flytta.uk/'),
      src('Flytta customs declaration automation', 'Flytta', 'https://flytta.uk/customs-declaration-automation'),
      src('Flytta ASM Sequoia integration', 'Flytta', 'https://flytta.uk/asm-sequoia-customs-automation-integration-flytta'),
      src('Sedna expands AI leadership in global trade with Flytta acquisition', 'Sedna', 'https://sedna.com/resources/sedna-expands-ai-leadership-in-global-trade-with-flytta-acquisition'),
    ],
  },
  customaite: {
    id: 'customaite',
    name: 'Customaite',
    bestFor: 'Best for broker and enterprise customs teams buying a declaration-preparation suite by volume tier',
    layer: 'AI declaration preparation and validation suite',
    filing: 'Not stated on the pages checked; vendor says it “works with the declaration software your team already uses”',
    worksWith: 'Stream Software, Descartes, ASM Sequoia and others (vendor wording)',
    precheck: 'States that AI reads, structures and validates incoming information',
    throughput: 'Not stated on the pages checked',
    pricing: 'Quote-based; plans by volume: Lite 200–2,500, Pro 2,500–25,000, Enterprise 50,000+ declarations a month',
    uk: 'Countries not stated on the pages checked',
    summary:
      'Customaite says it “turns source documents into accurate, defensible declarations ready for submission” and plugs into a TMS, ERP or middleware. It sells Lite, Pro and Enterprise plans banded by monthly declaration volume.',
    facts: [
      ['Who it is for', '“customs broker, logistics provider or enterprise customs team”'],
      ['Filing systems named', 'Stream Software, Descartes, ASM Sequoia and others'],
      ['Plans', 'Lite 200–2,500; Pro 2,500–25,000; Enterprise 50,000+ declarations a month'],
      ['Pricing', 'Quote-based; no public price on the plans page'],
      ['HMRC list', 'Not listed (the list covers filing software)'],
    ],
    sources: [
      src('Customaite homepage', 'Customaite', 'https://www.customaite.ai/'),
      src('Customaite plans', 'Customaite', 'https://www.customaite.ai/plans'),
    ],
  },
  sequoia: {
    id: 'sequoia',
    name: 'ASM Sequoia',
    bestFor: 'Best for UK forwarders who want an established filing platform with customs and port-community connections',
    layer: 'Customs clearance and filing platform',
    filing: 'Yes. HMRC lists ASM for CDS imports, CDS exports and simplified imports and exports',
    worksWith: 'Customs and port community systems; back-office and customer system integration (vendor wording)',
    precheck: 'Not stated on the pages checked',
    throughput: 'Vendor describes a “high performance customs clearance platform”',
    pricing: 'Quote-based; no public price on the pages checked',
    uk: 'UK company (Agency Sector Management (UK) Ltd, formed 1986)',
    summary:
      'ASM describes Sequoia as a “state-of-the-art, high performance customs clearance platform” for forwarders. It processes import, export and transit shipments with a “connection to customs and all of the port community systems”.',
    facts: [
      ['Vendor', 'Agency Sector Management (UK) Ltd (ASM), formed 1986'],
      ['Who it is for', 'Forwarders (vendor wording)'],
      ['CDS filing', 'On the HMRC list for CDS imports, exports and simplified imports and exports'],
      ['Connections', 'Customs and port community systems; back-office integration'],
      ['Pricing', 'Quote-based; no public price found on the pages checked'],
    ],
    sources: [
      src('ASM homepage', 'ASM UK Ltd', 'https://www.asm.org.uk/en/home/'),
      src('ASM software (Sequoia)', 'ASM UK Ltd', 'https://www.asm.org.uk/en/our-software/'),
    ],
  },
  descartes: {
    id: 'descartes',
    name: 'Descartes e-Customs',
    bestFor: 'Best for UK teams that want filing plus warehousing, GVMS, transit and excise in one cloud suite',
    layer: 'Cloud customs filing and compliance suite',
    filing: 'Yes. HMRC lists Descartes Systems UK for CDS imports, CDS exports and simplified imports',
    worksWith: 'ERP and commercial systems, UK port systems, the Descartes Global Logistics Network and Excel upload',
    precheck: 'Not stated as document AI on the page checked; markets classification',
    throughput: 'Not stated on the page checked',
    pricing: 'Published: base platform from £178 a month plus a £704 + VAT set-up fee; modules £150–£900 a month; volume pricing on request',
    uk: 'UK-first product page; transit and EMCS in multiple countries',
    summary:
      'Descartes e-Customs is a “cloud-based platform that automates import and export declarations, ensuring accuracy and HMRC compliance”. It also lists bonded warehousing, ETSF, GVMS, transit, EMCS, ICS/ECS and classification.',
    facts: [
      ['Product', 'Descartes e-Customs™'],
      ['Who it is for', '“any businesses wanting to submit import and export customs declarations”'],
      ['CDS filing', 'On the HMRC list (Descartes Systems UK Ltd) for CDS imports, exports and simplified imports'],
      ['Wider suite', 'Bonded warehousing, ETSF, GVMS, transit, EMCS, ICS/ECS and classification'],
      ['Pricing', 'Base platform “Starting from £178 per month”, set-up fee £704 + VAT; modules £150–£900 a month'],
    ],
    sources: [
      src('Descartes UK customs (e-Customs)', 'Descartes Systems Group', 'https://www.descartes.com/uk-customs'),
      src('The costs of a UK customs software', 'Descartes Systems Group', 'https://www.descartes.com/uk-customs/the-costs-of-a-uk-customs-software'),
    ],
  },
  cargowise: {
    id: 'cargowise',
    name: 'CargoWise Customs and Compliance',
    bestFor: 'Best for global forwarders who want customs inside one logistics operating platform',
    layer: 'Customs module inside a global logistics platform',
    filing: 'Yes. HMRC lists WiseTech Global (UK) Ltd for CDS imports, CDS exports and simplified imports and exports',
    worksWith: 'Direct connections to national customs systems inside CargoWise',
    precheck: 'Not stated as document AI on the page checked',
    throughput: 'Not stated on the page checked',
    pricing: 'Quote-based; no public price on the page checked',
    uk: 'UK among 15 listed countries, with a CDS wizard',
    summary:
      'CargoWise Customs and Compliance helps operators “automate, manage and clear import and export customs declarations” inside the wider CargoWise platform. Its UK section mentions a CDS wizard and CDS codes.',
    facts: [
      ['Vendor', 'WiseTech Global'],
      ['Who it is for', 'Forwarders, customs brokers, warehouse operators, carriers and drayage operators'],
      ['CDS filing', 'On the HMRC list (WiseTech Global (UK) Ltd) for CDS imports, exports and simplified procedures'],
      ['Countries', '15 listed, including the UK, Ireland, the US and Australia'],
      ['Pricing', 'Quote-based; no public price found on the page checked'],
    ],
    sources: [src('CargoWise Customs', 'WiseTech Global', 'https://www.cargowise.com/solutions/cargowise-customs/')],
  },
  customs4trade: {
    id: 'customs4trade',
    name: 'Customs4trade CAS',
    bestFor: 'Best for multi-country importers running customs, special procedures and excise in-house',
    layer: 'Enterprise customs and excise platform',
    filing: 'Yes. HMRC lists Customs4trade for CDS imports, exports, simplified procedures and customs warehouse',
    worksWith: 'ERP by API, port community systems, Excel upload and manual entry',
    precheck: 'Not stated as document AI on the page checked',
    throughput: 'Not stated on the page checked',
    pricing: 'Quote-based: “depends on the modules required, the number of declarations and the Support Services”',
    uk: 'UK among eight listed countries (with Ireland, Belgium, the Netherlands and others)',
    summary:
      'Customs4trade’s CAS (Customs Automation Software) automates declaration filing for imports, exports and transit, and adds Special Procedures and excise modules. It connects to ERP systems by API and to port community systems.',
    facts: [
      ['Product', 'CAS (Customs Automation Software)'],
      ['Scope', 'Declarations, transit, Special Procedures and excise'],
      ['CDS filing', 'On the HMRC list for CDS imports, exports, simplified procedures and customs warehouse'],
      ['Countries', 'Belgium, Netherlands, UK, Ireland, France, Germany, Spain and Sweden'],
      ['Pricing', 'Quote-based, by modules, declaration count and support services'],
    ],
    sources: [src('Customs4trade CAS customs compliance', 'Customs4trade', 'https://www.customs4trade.com/cas-customs-compliance')],
  },
  digicust: {
    id: 'digicust',
    name: 'Digicust',
    bestFor: 'Best for EU-centred teams on ATLAS, DAKOSY or AEB that want AI agents across customs tasks',
    layer: 'AI customs agents that extend existing customs software',
    filing: 'Pushes validated declarations into your existing customs software (vendor wording)',
    worksWith: 'ATLAS, AEB, Format, DAKOSY, Scope and other EU systems; SAP, Oracle, Dynamics and Infor ERPs',
    precheck: 'Reads invoices, CMRs, certificates and shipping emails, then matches and validates',
    throughput: 'Not stated on the page checked',
    pricing: 'Published: pay per use “€5.00 per credit”; Basic €4,500, Growth €15,120 and Team €25,500 a year; Enterprise on request',
    uk: 'UK listed among 30+ countries, with CDS filings named',
    summary:
      'Digicust offers AI customs agents that prepare work “for seamless handoff to your existing customs software”. It reads invoices, CMRs, certificates and shipping emails, and lists CDS filings for the UK among more than 30 countries.',
    facts: [
      ['Who it is for', 'Teams extending existing customs software; brokers and consultants'],
      ['Systems named', 'ATLAS, AEB, Format, DAKOSY, Scope and other EU systems'],
      ['UK', '“CDS filings (UK)” listed among 30+ countries'],
      ['Pricing', 'Published: “€5.00 per credit” pay per use, or yearly packages from €4,500'],
      ['HMRC list', 'Not listed (the list covers filing software)'],
    ],
    sources: [src('Digicust homepage', 'Digicust', 'https://digicust.com/'), src('Digicust pricing', 'Digicust', 'https://digicust.com/en/price/')],
  },
}

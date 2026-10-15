// Vendor fact ledger for /compare/ pages. Every vendor fact was checked on the vendor's own public page
// (or GOV.UK) on 15 October 2026. Re-check each source before changing a fact or its date.
import { packages } from './pricing.mjs'

export const CHECKED_ISO = '2026-10-15'
export const CHECKED = '15 Oct 2026'

const s = (title, publisher, url) => ({ title, publisher, url, checked: CHECKED })

export const sources = {
  // Declarix (first-party)
  dxHome: s('Declarix homepage: worked desk model', 'Declarix Limited', 'https://getdeclarix.com/'),
  dxHow: s('How Declarix builds CDS-ready customs entry packs', 'Declarix Limited', 'https://getdeclarix.com/how-it-works/'),
  dxScope: s('Supported customs workflows and integrations', 'Declarix Limited', 'https://getdeclarix.com/supported-scope/'),
  dxPricing: s('Declarix pricing', 'Declarix Limited', 'https://getdeclarix.com/pricing/'),
  dxPilot: s('Declarix pilot', 'Declarix Limited', 'https://getdeclarix.com/pilot/'),
  dxSecurity: s('Security and data schedule', 'Declarix Limited', 'https://getdeclarix.com/security/'),
  dxAbout: s('About Declarix', 'Declarix Limited', 'https://getdeclarix.com/about/'),
  // HMRC
  hmrcList: s('List of software developers providing Customs Declaration Service software (updated 22 Sep 2026)', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/list-of-software-developers-providing-customs-declaration-support'),
  hmrcNi: s('Rates and thresholds for employers 2026 to 2027', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027'),
  hmrcPension: s('Workplace pensions: what you, your employer and the government pay', 'GOV.UK', 'https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay'),
  // iCustoms
  icHome: s('iCustoms homepage and product list', 'iCustoms', 'https://www.icustoms.ai/'),
  icCds: s('iCDS: UK CDS import and export', 'iCustoms', 'https://www.icustoms.ai/uk-cds-import/'),
  icIdp: s('iDP: intelligent document processing', 'iCustoms', 'https://www.icustoms.ai/intelligent-document-processing/'),
  icZap: s('iZap: self-service customs declarations', 'iCustoms', 'https://www.icustoms.ai/izap/'),
  icAbout: s('About iCustoms', 'iCustoms', 'https://www.icustoms.ai/about-us/'),
  // Customaite
  caHome: s('Customaite platform', 'Customaite', 'https://www.customaite.ai/home'),
  caAuto: s('Customaite automation suite', 'Customaite', 'https://www.customaite.ai/solutions/automation'),
  caComp: s('Customaite compliance suite', 'Customaite', 'https://www.customaite.ai/customs-compliance-suite'),
  caFlow: s('Customaite workflow suite', 'Customaite', 'https://www.customaite.ai/solutions/workflow'),
  caPlans: s('Customaite plans', 'Customaite', 'https://www.customaite.ai/plans'),
  caAbout: s('About Customaite', 'Customaite', 'https://www.customaite.ai/about-us'),
  // Descartes
  deUk: s('Descartes e-Customs for the UK', 'Descartes Systems Group', 'https://www.descartes.com/uk-customs'),
  deDecl: s('Descartes customs declarations', 'Descartes Systems Group', 'https://www.descartes.com/solutions/customs-and-regulatory-compliance/customs-declarations'),
  dePrice: s('The costs of a UK customs software', 'Descartes Systems Group', 'https://www.descartes.com/uk-customs/the-costs-of-a-uk-customs-software'),
  deIr: s('Descartes investor FAQs', 'Descartes Systems Group', 'https://www.descartes.com/about/investor-resources/investor-faqs'),
  // ASM Sequoia
  asmSw: s('ASM software: Sequoia', 'ASM', 'https://www.asm.org.uk/en/our-software/'),
  asmConn: s('Sequoia connectivity', 'ASM', 'https://www.asm.org.uk/en/our-software/connectivity/'),
  asmTech: s('Sequoia technology', 'ASM', 'https://www.asm.org.uk/en/our-software/technology/'),
  asmInt: s('Sequoia integration', 'ASM', 'https://www.asm.org.uk/en/our-software/integration/'),
  asmFeat: s('Sequoia features', 'ASM', 'https://www.asm.org.uk/en/our-software/features/'),
  asmCo: s('About ASM: the company', 'ASM', 'https://www.asm.org.uk/en/the-company/'),
  // CargoWise
  cwCustoms: s('CargoWise Customs', 'WiseTech Global', 'https://www.cargowise.com/solutions/cargowise-customs/'),
  cwUk: s('How to take control of your UK customs declarations with technology', 'WiseTech Global', 'https://www.cargowise.com/solutions/cargowise-customs/how-to-take-control-of-your-uk-customs-declarations-with-technology/'),
  cwPr: s('WiseTech Global launches CargoWise Value Packs (1 Dec 2025)', 'WiseTech Global', 'https://www.wisetechglobal.com/news/wisetech-global-launches-cargowise-value-packs-introducing-substantial-new-product-capabilities-and-simplified-billing/'),
  // Flytta / Sedna
  seAcq: s('Sedna expands AI leadership in global trade with Flytta acquisition', 'Sedna', 'https://sedna.com/resources/sedna-expands-ai-leadership-in-global-trade-with-flytta-acquisition'),
  seCase: s('How Casper Customs transformed their operations with Sedna', 'Sedna', 'https://sedna.com/case-studies/how-casper-customs-transformed-their-operations-with-sedna'),
  seNews: s('Sedna steers AI innovation with takeover (4 Mar 2025)', 'Bdaily', 'https://bdaily.co.uk/articles/2025/03/04/sedna-steers-ai-innovation-with-takeover'),
  // Customs4trade
  c4Home: s('Customs4trade CAS homepage', 'Customs4trade', 'https://www.customs4trade.com/'),
  c4Decl: s('CAS Declarations', 'Customs4trade', 'https://www.customs4trade.com/cas-customs-compliance/declarations'),
  c4Country: s('CAS country coverage', 'Customs4trade', 'https://www.customs4trade.com/cas-customs-compliance/country-coverage'),
  c4Pricing: s('CAS pricing', 'Customs4trade', 'https://www.customs4trade.com/cas-customs-compliance/pricing'),
  c4Blog: s('CAS 3.0 is here (4 Jun 2026)', 'Customs4trade', 'https://www.customs4trade.com/blog/cas-3.0-is-here-weve-rebuilt-our-platform-from-the-ground-up'),
}

const money = (value) => `£${value.toLocaleString('en-GB')}`
const [desk, team, scale] = packages
// Same wording as the published pricing policy page.
export const priceLine = `${desk.name} ${money(desk.monthly)}/month for ${desk.included} packs, ${team.name} ${money(team.monthly)}/month for ${team.included.toLocaleString('en-GB')}, and ${scale.name} ${money(scale.monthly)}/month for ${scale.included.toLocaleString('en-GB')}`
export const deskLine = `${money(desk.monthly)}/month for ${desk.included} packs`
export const pilotLine = '£0 upfront, £1 per declaration, capped at £500; the pilot fee is fully waived if the agreed success criteria are missed'

// Standard criteria. Every Declarix-versus page uses these rows in this order.
export const criteria = [
  ['job', 'Main job'],
  ['filing', 'Filing to HMRC CDS'],
  ['intake', 'Reading customer documents'],
  ['evidence', 'Evidence and checks'],
  ['systems', 'Works with your filing system'],
  ['pricing', 'Published pricing'],
  ['trial', 'Pilot or trial terms'],
  ['company', 'Company'],
]

const c = (text, ...src) => ({ text, src })

export const products = {
  declarix: {
    name: 'Declarix',
    site: 'https://getdeclarix.com/',
    role: 'Customs preparation layer · UK',
    cells: {
      job: c('Builds the CDS-ready entry pack from the customer’s documents, so the clerk checks the job instead of keying it.', 'dxHow'),
      filing: c('Hands a CDS-ready pack to the system you already run. Your badge, permissions and filing screen stay the same.', 'dxScope'),
      intake: c('Reads invoices, packing lists, transport documents, spreadsheets, scans, phone photos and forwarded email chains across the whole job. Typical processing is around 200 seconds.', 'dxScope', 'dxHow'),
      evidence: c('Every proposed field keeps its document, page and line. Conflicts, such as CIF on the invoice and CIP in the email, show beside the sources as questions.', 'dxHow'),
      systems: c('CDS-ready exports for Sequoia, Descartes e-Customs and customer integrations.', 'dxScope'),
      pricing: c(`Yes. ${priceLine}. No seat fees. Month to month.`, 'dxPricing'),
      trial: c(`Pilot on one real job: ${pilotLine}.`, 'dxPilot'),
      company: c('Declarix Limited, Leicester, England. Customer documents are never used to train models.', 'dxAbout', 'dxSecurity'),
    },
    facts: [],
  },
  icustoms: {
    name: 'iCustoms',
    site: 'https://www.icustoms.ai/',
    role: 'AI customs and trade compliance platform · London',
    cells: {
      job: c('AI customs and trade compliance platform with modules for filing (iCDS), document processing (iDP), self-service (iZap), classification and more.', 'icHome', 'icAbout'),
      filing: c('Yes. iCustoms states that iCDS is integrated directly with HMRC CDS. HMRC lists iCustoms for CDS imports, CDS exports and simplified import declarations.', 'icCds', 'hmrcList'),
      intake: c('iDP extracts and validates data from structured and unstructured documents, including PDF, CSV, JSON, Word and image files.', 'icIdp'),
      evidence: c('iCDS lists AI checks before submission. iDP lists a rules engine that validates data.', 'icCds', 'icIdp'),
      systems: c('iCDS is its own filing product. iCustoms states it integrates with other software through APIs, EDI and CSV.', 'icCds', 'icIdp'),
      pricing: c('Not published on the pages checked. Demo booking and self-registration are offered.', 'icHome'),
      trial: c('Demo booking and a “Start Now” registration. A free trial is not stated.', 'icHome'),
      company: c('Based in London. iCustoms states it was founded by an ex-HMRC member.', 'icAbout'),
    },
    facts: [
      c('Describes itself as an “award-winning AI platform to simplify customs and trade compliance”.', 'icAbout'),
      c('Lists iCDS, iDP, iZap, iClassification, iTSS, iNCTS, iGVMS, iWarehouse and further modules.', 'icHome'),
      c('States that iCDS is integrated directly with HMRC CDS.', 'icCds'),
      c('iZap lets traders upload documents and submit draft declarations for a customs agent to review.', 'icZap'),
      c('Lists the UK, Ireland and EU states among 28+ countries.', 'icHome'),
      c('Listed by HMRC for CDS imports, CDS exports and simplified import declarations.', 'hmrcList'),
    ],
  },
  customaite: {
    name: 'Customaite',
    site: 'https://www.customaite.ai/',
    role: 'Customs automation and compliance suite · Belgium',
    cells: {
      job: c('Automation and compliance platform that takes customs from source data to a declaration ready for submission.', 'caHome'),
      filing: c('Works alongside declaration software. Customaite names Stream Software, Descartes and ASM Sequoia; the declarant reviews and submits.', 'caHome'),
      intake: c('Self-learning extraction, scanned data and handwriting support, and automatic matching of invoice and packing-list lines.', 'caAuto'),
      evidence: c('Intelligent data validation, a goods classification assistant and trade-measure screening.', 'caComp'),
      systems: c('Names Stream Software, Descartes and ASM Sequoia, and shows CargoWise, DAKOSY and Thyme logos, plus TMS, ERP and middleware links.', 'caHome'),
      pricing: c('Subscription in volume tiers: Lite 200–2,500, Pro 2,500–25,000 and Enterprise 50,000+ declarations a month. Prices are not published.', 'caPlans'),
      trial: c('Demo request and a 30-minute chat. A free trial is not stated.', 'caPlans', 'caHome'),
      company: c('Lists a Belgian (+32) contact number and launched with a first customer in Antwerp in 2021. States ISO 27001 certification.', 'caPlans', 'caAbout'),
    },
    facts: [
      c('Describes itself as “the automation and compliance platform for customs”, from source data to submission.', 'caHome'),
      c('Names customs brokers, freight forwarders and enterprise customs teams as buyers.', 'caHome'),
      c('Automation suite: extraction, handwriting support, line matching and one-click translation of goods descriptions.', 'caAuto'),
      c('Compliance suite: classification assistant, trade-measure screening and data validation.', 'caComp'),
      c('Workflow suite: a customer communication portal with an archived audit trail.', 'caFlow'),
      c('Plans: Lite, Pro and Enterprise volume tiers; the customer portal sits in Enterprise.', 'caPlans'),
    ],
  },
  descartes: {
    name: 'Descartes e-Customs',
    site: 'https://www.descartes.com/uk-customs',
    role: 'Customs declaration system (SaaS) · Descartes Systems Group',
    cells: {
      job: c('Internet-based SaaS customs declaration system for UK clearances.', 'deUk'),
      filing: c('Yes. Submits to CDS. HMRC lists Descartes Systems UK Ltd for CDS imports, CDS exports and simplified import declarations.', 'deUk', 'hmrcList'),
      intake: c('Templates, master data, copy and clone of past declarations, and Excel upload into certain modules.', 'deUk'),
      evidence: c('States full compliance with HMRC requirements for CDS, with GVMS and transit modules.', 'deUk'),
      systems: c('It is the filing system. Option to integrate with ERP, commercial or back-office systems; links to UK port systems.', 'deUk'),
      pricing: c('Published: base platform from £178 a month plus a £704 + VAT set-up fee; volume pricing on request. Demo on request.', 'dePrice', 'deDecl'),
      trial: c('Demo on request.', 'deDecl'),
      company: c('Descartes Systems Group, Waterloo, Ontario. Listed on NASDAQ (DSGX) and TSX (DSG).', 'deIr'),
    },
    facts: [
      c('Describes e-Customs as “an internet-based Software as a Service solution” for UK customs.', 'deUk'),
      c('Serves customs brokers and forwarders; its customs declarations page shows Kuehne+Nagel, DSV and Cardinal Global Logistics.', 'deDecl'),
      c('UK page lists GVMS GMR creation, transit and EMCS movements, and links to all UK port systems.', 'deUk'),
      c('Covers the US, Canada, the UK, Ireland, the Netherlands, Belgium, Sweden, Denmark, Norway and Luxembourg.', 'deDecl'),
      c('Listed by HMRC for CDS imports, CDS exports and simplified import declarations.', 'hmrcList'),
    ],
  },
  sequoia: {
    name: 'ASM Sequoia',
    site: 'https://www.asm.org.uk/en/our-software/',
    role: 'Customs clearance platform for forwarders · ASM, Ashford',
    cells: {
      job: c('High-performance customs clearance platform for forwarders.', 'asmSw'),
      filing: c('Yes. Gateways to CDS and to all UK Community Service Providers. HMRC lists ASM for CDS imports and exports and simplified declarations.', 'asmConn', 'hmrcList'),
      intake: c('Feature list covers import ETSF, export DEP, NCTS transit, CFSP, customs warehousing, document management and job costing.', 'asmFeat'),
      evidence: c('ASM describes outstanding levels of productivity and compliance for forwarders.', 'asmSw'),
      systems: c('It is the filing system. Web services API and a range of interfacing options.', 'asmConn', 'asmInt'),
      pricing: c('Not published on the pages checked.', 'asmSw'),
      trial: c('Not stated on the pages checked.', 'asmSw'),
      company: c('ASM, formed in 1986 by the Institute of Freight Forwarders (now BIFA); a not-for-profit mutual owned by its users.', 'asmCo'),
    },
    facts: [
      c('Describes Sequoia as its “state-of-the-art, high performance customs clearance platform” for forwarders.', 'asmSw'),
      c('Provides gateways to all UK Community Service Providers and to CDS.', 'asmConn'),
      c('Features include NCTS transit, import ETSF, export DEP, CFSP, customs warehousing, document management and job costing.', 'asmFeat'),
      c('Technology page lists the Microsoft .Net framework, SQL Server and support for virtual environments.', 'asmTech'),
      c('ASM is a not-for-profit mutual trading company owned by its users, formed in September 1986.', 'asmCo'),
      c('Listed by HMRC for CDS imports, CDS exports and simplified import and export declarations.', 'hmrcList'),
    ],
  },
  cargowise: {
    name: 'CargoWise Customs',
    site: 'https://www.cargowise.com/solutions/cargowise-customs/',
    role: 'Customs inside a global logistics platform · WiseTech Global',
    cells: {
      job: c('Embeds customs and compliance into the core of a logistics operating platform.', 'cwCustoms'),
      filing: c('Yes. CargoWise describes submitting UK entries to CDS, through community system providers such as CNS, MCP, CCS-UK and Pentant. HMRC lists WiseTech Global (UK) Ltd for CDS imports, exports and simplified declarations.', 'cwUk', 'hmrcList'),
      intake: c('Automated workflows and electronic documentation. Value Packs (from 1 December 2025) include AI Classification Assistant and ComplianceWise.', 'cwCustoms', 'cwPr'),
      evidence: c('Automated screening and compliance tools inside the CargoWise platform.', 'cwCustoms'),
      systems: c('It is the filing and freight platform. Deep integrations to ports, airports, government and third-party systems.', 'cwCustoms'),
      pricing: c('Value Packs: a transaction fee per logistics job, with no CargoWise Cloud standard hosting costs or seat fees. Rates are not published.', 'cwPr'),
      trial: c('Not stated on the pages checked.', 'cwCustoms'),
      company: c('WiseTech Global, listed on the ASX (WTC).', 'cwPr'),
    },
    facts: [
      c('States CargoWise “embeds customs and compliance into the core of your operations”.', 'cwCustoms'),
      c('Names customs brokers, freight forwarders and warehouse operators as buyers.', 'cwCustoms'),
      c('UK entries go through community system providers such as CNS, MCP, CCS-UK and Pentant.', 'cwUk'),
      c('Customs coverage listed for 15 markets, including the UK, US, Australia, Canada and Germany.', 'cwCustoms'),
      c('Value Packs bill a transaction fee per logistics job, announced 1 December 2025.', 'cwPr'),
    ],
  },
  flytta: {
    name: 'Flytta (Sedna)',
    site: 'https://sedna.com/',
    role: 'Customs document automation, now inside Sedna AI',
    cells: {
      job: c('Flytta’s customs import and export automation workflow is now part of Sedna AI, after Sedna acquired Flytta in March 2025.', 'seAcq', 'seNews'),
      filing: c('Outputs to ASM Sequoia and Descartes environments, which file the declaration.', 'seCase'),
      intake: c('Extracts customs data from invoices and shipping paperwork arriving by email, including PDFs.', 'seCase'),
      evidence: c('Built-in compliance checks against HMRC requirements, per the Casper Customs case study.', 'seCase'),
      systems: c('Automatic output to ASM Sequoia and Descartes.', 'seCase'),
      pricing: c('Not published on the pages checked.', 'seAcq'),
      trial: c('Not stated on the pages checked.', 'seAcq'),
      company: c('Sedna, with offices including London and Middlesbrough. Flytta began as an in-house tool at Casper Shipping.', 'seAcq'),
    },
    facts: [
      c('Sedna announced that Flytta’s customs import and export automation workflow is now part of Sedna AI.', 'seAcq'),
      c('Bdaily reported the acquisition on 4 March 2025; the co-founders joined Sedna.', 'seNews'),
      c('The Casper Customs case study describes extraction from commercial documents and output to ASM Sequoia and Descartes.', 'seCase'),
      c('Customers named include Casper Customs, Pentagon Freight Services and Mobius Technology.', 'seAcq'),
      c('flytta.com did not resolve when checked; the product is presented on sedna.com.', 'seAcq'),
    ],
  },
  customs4trade: {
    name: 'Customs4trade CAS',
    site: 'https://www.customs4trade.com/',
    role: 'Cloud customs and excise platform · Mechelen and Wigan',
    cells: {
      job: c('CAS (Customs Automation System): a cloud-native platform for customs and excise compliance across countries.', 'c4Home'),
      filing: c('Yes. Connected to CDS, NCTS5, S&S GB and GVMS. HMRC lists Customs4trade for CDS imports, exports, simplified declarations and customs warehouse.', 'c4Country', 'hmrcList'),
      intake: c('AI data extraction reads trade documents and delivers structured data into CAS.', 'c4Decl'),
      evidence: c('Declarations, Special Procedures, Excise Management, AI Product Classification and Master Data modules.', 'c4Home'),
      systems: c('It is the filing platform. Connects to ERP and WMS through APIs or Excel upload; links to 30+ customs-related systems.', 'c4Decl', 'c4Blog'),
      pricing: c('Annual subscription priced by modules and declaration volume. Figures are not published.', 'c4Pricing'),
      trial: c('Not stated on the pages checked.', 'c4Pricing'),
      company: c('Customs4trade, Mechelen, Belgium, with a UK office in Wigan.', 'c4Home'),
    },
    facts: [
      c('Describes CAS as “your automated customs and excise solution”.', 'c4Home'),
      c('CAS 3.0 launched on 4 June 2026, covering 8 jurisdictions and connecting to more than 30 customs-related systems.', 'c4Blog'),
      c('UK coverage includes CDS, NCTS5, S&S GB and GVMS; Northern Ireland is listed separately.', 'c4Country'),
      c('Logos shown include Kraft Heinz, Danone, BAE Systems, Tata Steel and BrewDog.', 'c4Home'),
      c('Listed by HMRC for CDS imports and exports, simplified declarations and customs warehouse.', 'hmrcList'),
    ],
  },
}

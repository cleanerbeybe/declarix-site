// /compare/ hub and comparison pages (growth pack P13, P15, P17, P19, P21, P23, P25–P29, P33, P35, P44).
// Vendor facts live in comparison-sources.mjs with source URLs and the date checked.
import { breadcrumbList, organizationNode } from './site-graph.mjs'
import { CHECKED, CHECKED_ISO, criteria, deskLine, pilotLine, priceLine, products, sources } from './comparison-sources.mjs'

const PACK_CHECK = '/tools/customs-document-pack-check/'
const ROI = '/roi-calculator/'

const declarixBestFor =
  'UK customs desks that want up to 3× more declarations per clerk without changing their filing system. Declarix works ahead of Sequoia and Descartes.'

// ---------- Declarix versus another product ----------

function versus(vendorKey, page) {
  return { kind: 'versus', columns: ['declarix', vendorKey], vendors: [vendorKey], ...page }
}

function pair(a, b, page) {
  return { kind: 'pair', columns: [a, b], vendors: [a, b], ...page }
}

const commonChoose = [
  'You want every clerk to handle up to 3× more declarations without hiring.',
  'You want to keep Sequoia, Descartes e-Customs or your current customer integration as the filing system.',
  'You want the source document, page and line beside every proposed field before approval.',
  'Your jobs arrive as mixed email chains, scans, spreadsheets and amalgamated invoices.',
  `You want published monthly packages, from ${deskLine}, with no seat fees.`,
  `You want to prove it on one real job first: ${pilotLine}.`,
]

export const comparisonPages = [
  versus('descartes', {
    path: '/compare/declarix-vs-descartes-e-customs/',
    title: 'Declarix vs Descartes customs software (e-Customs)',
    description:
      'Descartes customs software files UK declarations. Declarix builds the CDS-ready pack ahead of e-Customs for up to 3× more declarations per clerk.',
    h1: 'Declarix vs Descartes customs software: keep e-Customs, add capacity',
    eyebrow: 'COMPARE · DECLARIX AND DESCARTES E-CUSTOMS',
    ref: 'COMPARE 21 · DESCARTES',
    stamp: 'KEEP\nE-CUSTOMS',
    standfirst:
      'Descartes e-Customs is the filing system. Declarix is the preparation layer that works ahead of it. Your clerk checks a CDS-ready pack instead of keying the job, and e-Customs files it as before.',
    verdict: [
      'Descartes e-Customs is best for UK brokers, forwarders and importers that need a cloud system to submit import and export declarations to CDS, with GVMS and port-system links. Declarix is best for UK customs desks that want up to 3× more declarations per clerk without changing their filing system. It reads the customer’s documents, builds the CDS-ready entry pack and hands it to e-Customs.',
      'You do not have to pick one. Keep Descartes customs software for submission and put Declarix in front of it to remove the keying.',
    ],
    bestFor: [
      ['Descartes e-Customs', 'Brokers, forwarders and importers that need a SaaS system to file UK declarations to CDS, with GVMS, transit and port-system links.'],
    ],
    blocks: [
      {
        label: 'HOW THEY WORK TOGETHER',
        title: 'One job, from inbox to CDS.',
        ordered: [
          'The customer’s email lands with invoices, a packing list, transport documents and a spreadsheet.',
          'Declarix reads the whole job. Typical processing is around 200 seconds.',
          'The clerk opens the CDS-ready pack. Each proposed value shows its document, page and line. Conflicts show as questions.',
          'The CDS-ready export moves into Descartes e-Customs.',
          'e-Customs submits to CDS with your badge, permissions and filing screen, exactly as today.',
        ],
      },
      {
        label: 'WORKED EXAMPLE',
        title: 'The same declaration, costed.',
        paragraphs: [
          'The Declarix worked desk model takes one job with 6 attachments, 3 formats, 43 lines and 2 amalgamated invoices. Keyed by hand, keying and assembly take about 46 minutes. With Declarix, the clerk checks and submits in about 9 minutes. Labour cost per declaration moves from £7.95 to £2.45 in that model.',
          'At 480 declarations a week, the homepage model shows a bottom line of £137,280 a year. Put your own volume, minutes and loaded clerk cost into the [ROI calculator](/roi-calculator/).',
        ],
        src: ['dxHome'],
      },
    ],
    faqs: [
      ['Does Declarix replace Descartes e-Customs?', 'No, Declarix works ahead of e-Customs: it builds the CDS-ready entry pack that your clerk checks and e-Customs files.'],
      ['Does Declarix support Descartes e-Customs?', 'Yes, Declarix supports CDS-ready exports for Descartes e-Customs, and the 20-minute numbers call maps the exact route for your desk.'],
      ['Is Descartes on HMRC’s list of CDS software providers?', `Yes, HMRC lists Descartes Systems UK Ltd for CDS imports, CDS exports and simplified import declarations (checked ${CHECKED}).`],
      ['Who uses Descartes customs software?', 'Descartes serves customs brokers and forwarders, and shows Kuehne+Nagel, DSV and Cardinal Global Logistics on its customs declarations page.'],
      ['How fast is Declarix?', 'Typical Declarix processing is around 200 seconds before the clerk starts the check.'],
      ['What does Declarix cost?', `Declarix publishes its packages: ${priceLine}, with no seat fees.`],
      ['How do I try it on my own work?', `Run one anonymised job through the [pilot](/pilot/): ${pilotLine}.`],
    ],
    related: ['/compare/sequoia-vs-descartes/', '/compare/icustoms-vs-descartes/', '/compare/declarix-vs-sequoia/', '/compare/declarix-vs-icustoms/'],
  }),
  versus('icustoms', {
    path: '/compare/declarix-vs-icustoms/',
    title: 'Declarix vs iCustoms: UK customs automation compared',
    description:
      'Declarix vs iCustoms compared on filing, document reading, evidence, pricing and pilot terms. Every vendor fact sourced and checked 15 Oct 2026.',
    h1: 'Declarix vs iCustoms: which fits a UK customs desk?',
    eyebrow: 'COMPARE · DECLARIX AND ICUSTOMS',
    ref: 'COMPARE 13 · ICUSTOMS',
    stamp: 'KEEP YOUR\nSYSTEM',
    standfirst:
      'iCustoms offers its own AI platform, including CDS filing. Declarix makes the system you already run more productive. Here is how the two compare on the work that fills a clerk’s day.',
    verdict: [
      'iCustoms is best for traders and customs agents that want one AI platform with its own CDS filing (iCDS), document extraction (iDP), trader self-service (iZap) and further modules across the UK, Ireland and the EU. Declarix is best for UK customs desks that want up to 3× more declarations per clerk without changing their filing system. It builds the CDS-ready pack ahead of Sequoia or Descartes, with the source of every field in view.',
      'The deciding question is simple. Do you want to move filing to a new platform? iCustoms brings its own filing product. Declarix keeps the system your clerks already know and removes the keying in front of it.',
    ],
    bestFor: [
      ['iCustoms', 'Traders, customs agents, carriers and postal operators that want one AI platform for filing, extraction, self-service and classification.'],
    ],
    blocks: [
      {
        label: 'THE REAL DIFFERENCE',
        title: 'Change the filing system, or upgrade the desk.',
        paragraphs: [
          'Moving to a new filing platform touches badges, permissions, templates, training and every customer integration. Declarix avoids that project. It takes the job as it arrives, builds the CDS-ready pack and hands it to Sequoia, Descartes e-Customs or your mapped customer integration.',
          'Your clerk keeps the filing screen they know. What changes is the time it takes: the clerk checks a finished, source-linked pack instead of building the entry field by field.',
        ],
      },
    ],
    faqs: [
      ['Is Declarix an alternative to iCustoms?', 'Yes, for the preparation work: Declarix turns customer documents into a CDS-ready entry pack for the filing system you already run.'],
      ['Does iCustoms file to CDS?', `Yes, iCustoms states that iCDS is integrated directly with HMRC CDS, and HMRC lists iCustoms as a CDS software provider (checked ${CHECKED}).`],
      ['Do I need to change my customs system to use Declarix?', 'No, Declarix supports CDS-ready exports for Sequoia, Descartes e-Customs and customer integrations.'],
      ['Which publishes its prices?', `Declarix publishes its packages (${priceLine}); iCustoms did not publish prices on the pages checked.`],
      ['Is my customer data used to train models?', 'No, Declarix never uses customer documents to train models.'],
      ['How do I compare them on my own work?', `Run the same anonymised job through both, starting with the Declarix [pilot](/pilot/): ${pilotLine}.`],
    ],
    related: ['/compare/icustoms-vs-descartes/', '/compare/icustoms-vs-customaite/', '/compare/declarix-vs-customaite/', '/compare/icustoms-vs-flytta/'],
  }),
  versus('customaite', {
    path: '/compare/declarix-vs-customaite/',
    title: 'Declarix vs Customaite: customs automation compared',
    description:
      'Declarix vs Customaite compared on document reading, evidence, filing systems, pricing and pilot terms, with every vendor fact sourced and dated.',
    h1: 'Declarix vs Customaite: which fits a UK customs desk?',
    eyebrow: 'COMPARE · DECLARIX AND CUSTOMAITE',
    ref: 'COMPARE 17 · CUSTOMAITE',
    stamp: 'FROM 100\nPACKS',
    standfirst:
      'Both work ahead of your declaration software. The differences are in how evidence reaches the clerk, who each product is sized for, and whether you can see the price before the first call.',
    verdict: [
      'Customaite is best for brokers, forwarders and enterprise customs teams that want one suite for extraction, classification, trade-measure screening and customer communication, sold in volume tiers from 200 declarations a month. Declarix is best for UK customs desks that want up to 3× more declarations per clerk without changing their filing system, with published monthly packages that start at 100 packs.',
      'Both sit in front of the filing system. Customaite names Sequoia, Descartes, CargoWise and others. Declarix supports CDS-ready exports for Sequoia, Descartes e-Customs and customer integrations.',
    ],
    bestFor: [
      ['Customaite', 'Brokers, forwarders and enterprise teams that want a broad automation, compliance and workflow suite, sized from 200 declarations a month.'],
    ],
    blocks: [
      {
        label: 'SIZE AND PRICE',
        title: 'See the price before the call.',
        paragraphs: [
          `Declarix publishes its packages: ${priceLine}. Extra packs keep the package rate, never below £3.00. There are no seat fees, and terms are month to month.`,
          'Customaite sells by subscription in Lite, Pro and Enterprise tiers. Its smallest tier starts at 200 declarations a month, and prices are not published. A desk filing 100 declarations a month starts on Declarix Desk.',
        ],
        src: ['dxPricing', 'caPlans'],
      },
      {
        label: 'EVIDENCE AT REVIEW',
        title: 'The clerk sees the source, not just the value.',
        paragraphs: [
          'Declarix keeps the document, page and line beside each proposed field. When the invoice says CIF and the email says CIP, the conflict appears beside both sources as a question for the clerk. Nothing is silently guessed.',
        ],
        src: ['dxHow'],
      },
    ],
    faqs: [
      ['Is Declarix an alternative to Customaite?', 'Yes, Declarix builds the CDS-ready entry pack from customer documents and hands it to the filing system you already run.'],
      ['Does Customaite file to CDS itself?', 'Customaite describes working alongside declaration software such as Stream Software, Descartes and ASM Sequoia, where the declarant reviews and submits.'],
      ['Which suits a smaller desk?', `Declarix Desk is ${deskLine}, while Customaite’s smallest published tier starts at 200 declarations a month.`],
      ['Do both work with Sequoia and Descartes?', 'Yes, both work ahead of Sequoia and Descartes, and Declarix also maps customer integrations on the 20-minute numbers call.'],
      ['Is customer data used to train models?', 'No, Declarix never uses customer documents to train models.'],
      ['How do I test Declarix?', `Use the [pilot](/pilot/): ${pilotLine}.`],
    ],
    related: ['/compare/icustoms-vs-customaite/', '/compare/declarix-vs-icustoms/', '/compare/declarix-vs-flytta/', '/compare/declarix-vs-sequoia/'],
  }),
  pair('icustoms', 'descartes', {
    path: '/compare/icustoms-vs-descartes/',
    title: 'iCustoms vs Descartes: UK customs software compared',
    description:
      'iCustoms vs Descartes e-Customs: filing, document handling, UK services, countries, pricing and company facts, each sourced and checked 15 Oct 2026.',
    h1: 'iCustoms vs Descartes e-Customs: UK customs software compared',
    eyebrow: 'COMPARE · ICUSTOMS AND DESCARTES',
    ref: 'COMPARE 30 · ICUSTOMS / DESCARTES',
    stamp: 'TWO FILING\nSYSTEMS',
    standfirst:
      'Both file UK declarations to CDS and both appear on HMRC’s list of CDS software providers. They differ in approach, scope and company. Then there is the work before filing, which is where Declarix fits.',
    verdict: [
      'iCustoms suits teams that want an AI-led platform with CDS filing, document extraction, trader self-service and modules for the UK, Ireland and the EU. Descartes e-Customs suits brokers, forwarders and importers that want an established SaaS filing system with GVMS, transit and UK port-system links, from a group listed on NASDAQ and TSX.',
      'Whichever filing system you choose, Declarix works ahead of it. It builds the CDS-ready entry pack so each clerk handles up to 3× more declarations. Declarix supports Descartes e-Customs directly and other systems through a mapped customer integration.',
    ],
    bestFor: [
      ['iCustoms', 'Teams that want one AI platform for filing, extraction, self-service and classification across the UK, Ireland and EU.'],
      ['Descartes e-Customs', 'Brokers, forwarders and importers that want a SaaS filing system with GVMS, transit and UK port-system links.'],
    ],
    blocks: [
      {
        label: 'BEFORE THE FILING SCREEN',
        title: 'The third decision: who builds the entry?',
        paragraphs: [
          'A filing system records and submits the declaration. Before that, a clerk still opens the invoices, packing lists, transport documents, emails and spreadsheets and builds the entry. In the Declarix worked desk model, that keying and assembly takes about 46 minutes for one 43-line job.',
          'Declarix does that assembly across the whole job and returns a CDS-ready pack with the evidence beside every field. The clerk checks and submits in about 9 minutes in the same model.',
        ],
        src: ['dxHome'],
      },
    ],
    faqs: [
      ['Is iCustoms on HMRC’s CDS software list?', `Yes, HMRC lists iCustoms for CDS imports, CDS exports and simplified import declarations (checked ${CHECKED}).`],
      ['Is Descartes on HMRC’s CDS software list?', `Yes, HMRC lists Descartes Systems UK Ltd for CDS imports, CDS exports and simplified import declarations (checked ${CHECKED}).`],
      ['Which one reads documents with AI?', 'iCustoms offers iDP for AI extraction, while the Descartes UK e-Customs page lists templates, copy and clone, and Excel upload.'],
      ['Which one covers GVMS?', 'Both list GVMS support: iCustoms through its iGVMS module and Descartes through GMR creation in e-Customs.'],
      ['Do either publish prices?', 'Descartes publishes a base platform price from £178 a month on its UK pricing page, iCustoms did not publish prices on the pages checked, and both offer a demo.'],
      ['Where does Declarix fit?', 'Declarix works ahead of the filing system, building the CDS-ready pack so each clerk handles up to 3× more declarations.'],
    ],
    related: ['/compare/declarix-vs-descartes-e-customs/', '/compare/declarix-vs-icustoms/', '/compare/sequoia-vs-descartes/', '/compare/icustoms-vs-customs4trade/'],
  }),
  versus('flytta', {
    path: '/compare/declarix-vs-flytta/',
    title: 'Declarix vs Flytta (now Sedna): customs automation',
    description:
      'Declarix vs Flytta, now part of Sedna AI: document reading, evidence, filing systems, pricing and pilot terms, with vendor facts checked 15 Oct 2026.',
    h1: 'Declarix vs Flytta (Sedna): customs document automation compared',
    eyebrow: 'COMPARE · DECLARIX AND FLYTTA / SEDNA',
    ref: 'COMPARE 15 · FLYTTA',
    stamp: 'EVIDENCE\nIN VIEW',
    standfirst:
      'Flytta is now part of Sedna AI. Both Flytta and Declarix read customs documents and feed Sequoia and Descartes. Declarix adds published pricing, a pilot with £0 upfront and the source of every field in view.',
    verdict: [
      'Flytta, now inside Sedna AI, is best for teams that want customs import and export automation as part of Sedna’s wider email and trade-communication platform. Declarix is best for UK customs desks that want up to 3× more declarations per clerk without changing their filing system, with a dedicated customs product, published packages and evidence beside every field.',
      'Both feed Sequoia and Descartes. Declarix also maps customer integrations on the 20-minute numbers call.',
    ],
    bestFor: [
      ['Flytta (Sedna)', 'Teams that want customs automation as one workflow inside the Sedna AI communication platform.'],
    ],
    blocks: [
      {
        label: 'WHAT CHANGED',
        title: 'Flytta is now a Sedna workflow.',
        paragraphs: [
          'Sedna acquired Flytta in March 2025. Sedna states that Flytta’s customs import and export automation workflow is now part of Sedna AI. When checked, flytta.com did not resolve and the product was presented on sedna.com.',
          'Declarix is a dedicated UK customs product from Declarix Limited in Leicester. Its pages, prices and pilot terms are published at getdeclarix.com.',
        ],
        src: ['seAcq', 'seNews', 'dxAbout'],
      },
    ],
    faqs: [
      ['What happened to Flytta?', 'Sedna acquired Flytta in March 2025, and its customs automation workflow is now part of Sedna AI.'],
      ['Is Declarix an alternative to Flytta?', 'Yes, Declarix reads the whole customs job and returns a CDS-ready pack for Sequoia, Descartes e-Customs or a customer integration.'],
      ['Do both work with Sequoia and Descartes?', 'Yes, Sedna describes output to ASM Sequoia and Descartes, and Declarix supports CDS-ready exports for both.'],
      ['Which publishes its prices?', `Declarix publishes its packages (${priceLine}); Sedna did not publish customs pricing on the pages checked.`],
      ['How do I test Declarix?', `Use the [pilot](/pilot/): ${pilotLine}.`],
    ],
    related: ['/compare/icustoms-vs-flytta/', '/compare/declarix-vs-customaite/', '/compare/declarix-vs-icustoms/', '/compare/declarix-vs-sequoia/'],
  }),
  pair('icustoms', 'customaite', {
    path: '/compare/icustoms-vs-customaite/',
    title: 'iCustoms vs Customaite: a customs-team decision guide',
    description:
      'iCustoms vs Customaite: filing, extraction, compliance, integrations and pricing, each fact sourced and checked 15 Oct 2026, plus where Declarix fits.',
    h1: 'iCustoms vs Customaite: a customs-team decision guide',
    eyebrow: 'COMPARE · ICUSTOMS AND CUSTOMAITE',
    ref: 'COMPARE 27 · ICUSTOMS / CUSTOMAITE',
    stamp: 'TWO AI\nSUITES',
    standfirst:
      'Both sell AI customs automation. The key difference is filing: iCustoms brings its own CDS filing product, while Customaite works alongside declaration software such as Sequoia and Descartes.',
    verdict: [
      'iCustoms suits teams that want one platform that also files to CDS, with extraction, self-service and classification modules. Customaite suits brokers, forwarders and enterprise teams that want to keep their declaration software and add a suite for extraction, classification, trade-measure screening and customer communication.',
      'If you want to keep your filing system, Declarix is the third option to compare. It builds the CDS-ready pack ahead of Sequoia or Descartes for up to 3× more declarations per clerk, with packages published from £500 a month.',
    ],
    bestFor: [
      ['iCustoms', 'Teams ready to move filing to a new AI platform with CDS filing built in.'],
      ['Customaite', 'Brokers, forwarders and enterprise teams keeping their declaration software and adding a broad suite.'],
    ],
    blocks: [
      {
        label: 'DEMO CHECKLIST',
        title: 'Run the same job through every option.',
        ordered: [
          'Pick one anonymised job with scans, an amalgamated invoice and a real conflict.',
          'Time the current manual build from email to filed entry.',
          'Ask each vendor to process the same job and show where each value came from.',
          'Check how conflicts and missing facts reach the clerk.',
          'Confirm how the output reaches your filing system and who submits.',
          'Get the full price for your monthly volume in writing.',
        ],
      },
    ],
    faqs: [
      ['Which one files to CDS?', `iCustoms states that iCDS is integrated directly with HMRC CDS and is on HMRC’s list, while Customaite works alongside declaration software such as Sequoia and Descartes (checked ${CHECKED}).`],
      ['Which one has a customer portal?', 'Both: iCustoms offers iZap self-service, and Customaite offers a customer communication portal in its Enterprise plan.'],
      ['Do either publish prices?', 'Neither published prices on the pages checked; Customaite publishes volume tiers from 200 declarations a month.'],
      ['Where does Declarix fit?', 'Declarix builds the CDS-ready pack ahead of your filing system, with published packages from £500 a month.'],
    ],
    related: ['/compare/declarix-vs-icustoms/', '/compare/declarix-vs-customaite/', '/compare/icustoms-vs-flytta/', '/compare/icustoms-vs-descartes/'],
  }),
  versus('sequoia', {
    path: '/compare/declarix-vs-sequoia/',
    title: 'Declarix vs ASM Sequoia: keep Sequoia, add capacity',
    description:
      'ASM Sequoia files your declarations. Declarix builds the CDS-ready pack ahead of it, for up to 3× more declarations per clerk. Sources checked 15 Oct 2026.',
    h1: 'Declarix vs ASM Sequoia: keep Sequoia, clear more entries',
    eyebrow: 'COMPARE · DECLARIX AND ASM SEQUOIA',
    ref: 'COMPARE 19 · SEQUOIA',
    stamp: 'KEEP\nSEQUOIA',
    standfirst:
      'Sequoia is where your forwarders file. Declarix is where the entry gets built. Put Declarix in front of Sequoia and each clerk checks a finished pack instead of keying the job.',
    verdict: [
      'ASM Sequoia is best for UK forwarders that need a clearance platform with gateways to CDS and every UK community system, plus NCTS, warehousing and job costing. Declarix is best for UK customs desks that want up to 3× more declarations per clerk without changing their filing system. It works ahead of Sequoia, so Sequoia stays exactly where it is.',
      'This is not an either-or choice. Sequoia files. Declarix removes the keying before Sequoia.',
    ],
    bestFor: [
      ['ASM Sequoia', 'Forwarders that need a UK clearance platform with CDS and port community gateways.'],
    ],
    blocks: [
      {
        label: 'HOW THEY WORK TOGETHER',
        title: 'Sequoia files. Declarix builds.',
        ordered: [
          'The job arrives as an email with invoices, packing lists, transport documents and spreadsheets.',
          'Declarix reads the whole job and builds the CDS-ready entry data in around 200 seconds.',
          'The clerk checks each value against its source and resolves any flagged conflicts.',
          'The CDS-ready export moves into Sequoia.',
          'Sequoia submits through its CDS gateway with your existing permissions.',
        ],
      },
      {
        label: 'WHO IT HELPS MOST',
        title: 'Desks where keying is the bottleneck.',
        list: [
          'High-volume repeat import work with consistent review rules.',
          'Document-heavy jobs with long line tables or amalgamated invoices.',
          'Desks turning away declarations because recruiting another experienced clerk is slow or expensive.',
          'Senior clerks spending too much time on basic assembly.',
        ],
        src: ['dxScope'],
      },
    ],
    faqs: [
      ['Does Declarix replace Sequoia?', 'No, Declarix works ahead of Sequoia: it builds the CDS-ready pack and Sequoia files it.'],
      ['Does Declarix support Sequoia?', 'Yes, Declarix supports CDS-ready exports and customer workflow integration for Sequoia.'],
      ['Is ASM on HMRC’s CDS software list?', `Yes, HMRC lists ASM for CDS imports and exports and simplified import and export declarations (checked ${CHECKED}).`],
      ['Will my clerks need to learn a new filing screen?', 'No, your clerks keep filing in Sequoia; Declarix changes the work before the filing screen.'],
      ['What does Declarix cost?', `Declarix publishes its packages: ${priceLine}, with no seat fees.`],
      ['How do I try it?', `Book the 20-minute numbers call, then run the [pilot](/pilot/): ${pilotLine}.`],
    ],
    related: ['/compare/sequoia-vs-descartes/', '/compare/declarix-vs-descartes-e-customs/', '/compare/declarix-vs-cargowise-customs/', '/compare/declarix-vs-flytta/'],
  }),
  versus('customs4trade', {
    path: '/compare/declarix-vs-customs4trade/',
    title: 'Declarix vs Customs4trade CAS: which fits your desk?',
    description:
      'Customs4trade CAS is a multi-country customs and excise platform. Declarix adds up to 3× more declarations per clerk to the system you already run.',
    h1: 'Declarix vs Customs4trade CAS: which fits your customs desk?',
    eyebrow: 'COMPARE · DECLARIX AND CUSTOMS4TRADE',
    ref: 'COMPARE 25 · CUSTOMS4TRADE',
    stamp: 'MORE\nPER CLERK',
    standfirst:
      'CAS is a cloud platform that files customs and excise declarations across several countries. Declarix is a preparation layer for UK desks that already have a filing system and want more output from each clerk.',
    verdict: [
      'Customs4trade CAS is best for larger manufacturers, retailers and brand owners that want one cloud platform for declarations, special procedures and excise across the UK and EU. Declarix is best for UK customs desks that want up to 3× more declarations per clerk without changing their filing system. It works ahead of Sequoia and Descartes.',
      'If you are replacing your filing platform across several countries, CAS is in that conversation. If you want your current UK desk to clear more entries next month, start with Declarix.',
    ],
    bestFor: [
      ['Customs4trade CAS', 'Larger traders that want one cloud platform for customs and excise across 8 jurisdictions, including the UK and Northern Ireland.'],
    ],
    blocks: [
      {
        label: 'TIME TO VALUE',
        title: 'No platform migration first.',
        paragraphs: [
          'A new filing platform means migration, testing and training before the desk sees a gain. Declarix starts with one anonymised job on the pilot. Your clerk compares the CDS-ready pack with the manual run, and the system you file through stays the same.',
        ],
        src: ['dxPilot'],
      },
    ],
    faqs: [
      ['Does Customs4trade file to CDS?', `Yes, Customs4trade states CAS connects to CDS, NCTS5, S&S GB and GVMS, and HMRC lists it as a CDS software provider (checked ${CHECKED}).`],
      ['Is Declarix an alternative to Customs4trade?', 'For UK preparation work, yes: Declarix builds the CDS-ready pack for the filing system you already run.'],
      ['Who is Customs4trade built for?', 'Customs4trade shows larger brands in manufacturing, FMCG, automotive and retail, including Kraft Heinz, Danone and BAE Systems.'],
      ['Which publishes its prices?', `Declarix publishes its packages (${priceLine}); Customs4trade prices by modules and volume on request.`],
      ['How do I test Declarix?', `Use the [pilot](/pilot/): ${pilotLine}.`],
    ],
    related: ['/compare/icustoms-vs-customs4trade/', '/compare/declarix-vs-cargowise-customs/', '/compare/declarix-vs-descartes-e-customs/', '/compare/declarix-vs-sequoia/'],
  }),
  versus('cargowise', {
    path: '/compare/declarix-vs-cargowise-customs/',
    title: 'Declarix vs CargoWise Customs: keep your platform',
    description:
      'CargoWise Customs sits inside a logistics platform. Declarix builds CDS-ready packs ahead of your filing system: up to 3× more declarations per clerk.',
    h1: 'Declarix vs CargoWise Customs: more declarations per clerk',
    eyebrow: 'COMPARE · DECLARIX AND CARGOWISE CUSTOMS',
    ref: 'COMPARE 23 · CARGOWISE',
    stamp: 'BUILD\nTHE ENTRY',
    standfirst:
      'CargoWise runs customs inside a full logistics platform. Declarix concentrates on the slowest part of a UK customs job: reading the customer’s documents and building the entry.',
    verdict: [
      'CargoWise Customs is best for forwarders, brokers and warehouse operators that want customs inside one global logistics platform with customs coverage in 15 listed markets. Declarix is best for UK customs desks that want up to 3× more declarations per clerk without changing their filing system. It works ahead of Sequoia and Descartes, and connects to other systems through a mapped customer integration.',
      'CargoWise users can still use Declarix for the build. The 20-minute numbers call maps the integration route for your desk.',
    ],
    bestFor: [
      ['CargoWise Customs', 'Forwarders, brokers and warehouse operators that want customs inside one global logistics platform.'],
    ],
    blocks: [
      {
        label: 'THE BUILD, NOT THE PLATFORM',
        title: 'Remove the keying, whatever you file through.',
        paragraphs: [
          'Most of a clerk’s time on a document-heavy job goes into reading and keying, not submitting. In the Declarix worked desk model, keying and assembly take about 46 minutes for one 43-line job. With Declarix the clerk checks and submits in about 9 minutes.',
          'The integration route is agreed on the 20-minute numbers call, then proven on one real job in the pilot.',
        ],
        src: ['dxHome', 'dxScope'],
      },
    ],
    faqs: [
      ['Does CargoWise file to CDS?', `Yes, CargoWise describes UK submission to CDS, and HMRC lists WiseTech Global (UK) Ltd as a CDS software provider (checked ${CHECKED}).`],
      ['Can Declarix work with CargoWise?', 'Declarix connects to customer systems through an integration route mapped on the 20-minute numbers call.'],
      ['How does CargoWise price customs?', 'CargoWise Value Packs charge a transaction fee per logistics job, with no CargoWise Cloud standard hosting costs or seat fees.'],
      ['What does Declarix cost?', `Declarix publishes its packages: ${priceLine}, with no seat fees.`],
      ['How do I test Declarix?', `Use the [pilot](/pilot/): ${pilotLine}.`],
    ],
    related: ['/compare/declarix-vs-sequoia/', '/compare/declarix-vs-customs4trade/', '/compare/declarix-vs-descartes-e-customs/', '/compare/automation-vs-hiring/'],
  }),
  pair('icustoms', 'flytta', {
    path: '/compare/icustoms-vs-flytta/',
    title: 'iCustoms vs Flytta (Sedna): a customs decision guide',
    description:
      'iCustoms vs Flytta, now part of Sedna AI: filing, extraction, integrations and pricing, sourced and checked 15 Oct 2026, plus where Declarix fits.',
    h1: 'iCustoms vs Flytta (Sedna): a customs-team decision guide',
    eyebrow: 'COMPARE · ICUSTOMS AND FLYTTA / SEDNA',
    ref: 'COMPARE 26 · ICUSTOMS / FLYTTA',
    stamp: 'CHECK THE\nSCOPE',
    standfirst:
      'iCustoms is a customs platform with its own CDS filing. Flytta is now a customs workflow inside Sedna AI that feeds Sequoia and Descartes. Start by deciding where filing should live.',
    verdict: [
      'iCustoms suits teams that want an AI platform that also files to CDS, with extraction, self-service and classification modules. Flytta, now part of Sedna AI, suits teams that want customs document automation inside a wider email and trade-communication platform, with output to Sequoia and Descartes.',
      'If you want a dedicated customs product that keeps your filing system, compare Declarix. It builds the CDS-ready pack ahead of Sequoia or Descartes for up to 3× more declarations per clerk.',
    ],
    bestFor: [
      ['iCustoms', 'Teams ready to move filing to an AI platform with CDS filing built in.'],
      ['Flytta (Sedna)', 'Teams that want customs automation as one workflow inside Sedna’s communication platform.'],
    ],
    blocks: [],
    faqs: [
      ['Is Flytta still a separate product?', 'No, Sedna acquired Flytta in March 2025, and its customs workflow is now part of Sedna AI.'],
      ['Which one files to CDS?', `iCustoms states iCDS is integrated directly with HMRC CDS and is on HMRC’s list; Sedna describes output to ASM Sequoia and Descartes, which file (checked ${CHECKED}).`],
      ['Do either publish prices?', 'Neither published customs prices on the pages checked.'],
      ['Where does Declarix fit?', 'Declarix builds the CDS-ready pack ahead of Sequoia or Descartes, with published packages from £500 a month.'],
    ],
    related: ['/compare/declarix-vs-flytta/', '/compare/declarix-vs-icustoms/', '/compare/icustoms-vs-customaite/', '/compare/icustoms-vs-descartes/'],
  }),
  pair('sequoia', 'descartes', {
    path: '/compare/sequoia-vs-descartes/',
    title: 'ASM Sequoia vs Descartes e-Customs: UK filing compared',
    description:
      'ASM Sequoia vs Descartes e-Customs: CDS filing, UK services, integrations, company and pricing, sourced and checked 15 Oct 2026. Declarix works with both.',
    h1: 'ASM Sequoia vs Descartes e-Customs',
    eyebrow: 'COMPARE · SEQUOIA AND DESCARTES',
    ref: 'COMPARE 28 · SEQUOIA / DESCARTES',
    stamp: 'WORKS\nWITH BOTH',
    standfirst:
      'Sequoia and e-Customs are both established UK filing systems. Both are on HMRC’s CDS software list. Declarix supports both, so this choice never limits your preparation workflow.',
    verdict: [
      'ASM Sequoia suits UK forwarders that want a clearance platform from a user-owned, not-for-profit mutual, with gateways to CDS and every UK community system. Descartes e-Customs suits brokers, forwarders and importers that want a SaaS filing system from a listed global group, with GVMS, transit and multi-country coverage.',
      'Declarix works ahead of both. It builds the CDS-ready pack so each clerk handles up to 3× more declarations, whichever system files.',
    ],
    bestFor: [
      ['ASM Sequoia', 'Forwarders that want a UK clearance platform with CDS and port community gateways, from a user-owned mutual.'],
      ['Descartes e-Customs', 'Brokers, forwarders and importers that want a SaaS filing system with GVMS links and multi-country coverage.'],
    ],
    blocks: [
      {
        label: 'DECLARIX WITH EITHER',
        title: 'Same pack, either system.',
        paragraphs: [
          'Declarix supports CDS-ready exports for Sequoia and for Descartes e-Customs. If you run both across branches, the clerk gets the same source-linked pack and each branch files through its own system.',
        ],
        src: ['dxScope'],
      },
    ],
    faqs: [
      ['Are both on HMRC’s CDS software list?', `Yes, HMRC lists both ASM and Descartes Systems UK Ltd as CDS software providers (checked ${CHECKED}).`],
      ['Which one is cloud-based?', 'Descartes describes e-Customs as an internet-based SaaS product, and ASM’s technology page lists .NET, SQL Server and virtual environment support.'],
      ['Who owns ASM?', 'ASM describes itself as a not-for-profit mutual trading company owned by its users, formed in 1986.'],
      ['Does Declarix work with both?', 'Yes, Declarix supports CDS-ready exports for both Sequoia and Descartes e-Customs.'],
    ],
    related: ['/compare/declarix-vs-sequoia/', '/compare/declarix-vs-descartes-e-customs/', '/compare/icustoms-vs-descartes/', '/compare/declarix-vs-cargowise-customs/'],
  }),
  pair('icustoms', 'customs4trade', {
    path: '/compare/icustoms-vs-customs4trade/',
    title: 'iCustoms vs Customs4trade: a customs decision guide',
    description:
      'iCustoms vs Customs4trade CAS: CDS filing, countries, extraction, buyers and pricing, each sourced and checked 15 Oct 2026, plus where Declarix fits.',
    h1: 'iCustoms vs Customs4trade: a customs-team decision guide',
    eyebrow: 'COMPARE · ICUSTOMS AND CUSTOMS4TRADE',
    ref: 'COMPARE 29 · ICUSTOMS / C4T',
    stamp: 'UK AND\nEU FILING',
    standfirst:
      'Both file to CDS and both cover the UK and EU. iCustoms leads with AI modules and self-service. Customs4trade leads with customs and excise for large traders.',
    verdict: [
      'iCustoms suits customs agents and traders that want an AI platform with CDS filing, document extraction, self-service and many smaller modules. Customs4trade CAS suits larger manufacturers and retailers that want one cloud platform for declarations, special procedures and excise across 8 jurisdictions.',
      'Both replace your filing system. If you want to keep yours and raise output per clerk, compare Declarix. It builds the CDS-ready pack ahead of Sequoia or Descartes for up to 3× more declarations per clerk.',
    ],
    bestFor: [
      ['iCustoms', 'Customs agents and traders that want an AI platform with filing, extraction and self-service.'],
      ['Customs4trade CAS', 'Larger traders that want customs and excise on one cloud platform across the UK and EU.'],
    ],
    blocks: [],
    faqs: [
      ['Are both on HMRC’s CDS software list?', `Yes, HMRC lists both iCustoms and Customs4trade as CDS software providers (checked ${CHECKED}).`],
      ['Which one covers excise?', 'Customs4trade CAS has an Excise Management module, and iCustoms lists an iEMCS module.'],
      ['Do either publish prices?', 'Neither published prices on the pages checked; Customs4trade prices by modules and declaration volume.'],
      ['Where does Declarix fit?', 'Declarix builds the CDS-ready pack ahead of your filing system, with published packages from £500 a month.'],
    ],
    related: ['/compare/declarix-vs-customs4trade/', '/compare/declarix-vs-icustoms/', '/compare/icustoms-vs-descartes/', '/compare/icustoms-vs-customaite/'],
  }),
]

// ---------- Workflow comparisons (P33, P35) ----------

export const workflowPages = [
  {
    kind: 'workflow',
    path: '/compare/automation-vs-manual-entry/',
    title: 'Customs automation vs manual entry: the real work',
    description:
      'Customs automation vs manual data entry on one real UK job: keying time, evidence, conflicts and clerk capacity. Up to 3× more declarations per clerk.',
    h1: 'Compare the full customs job, not just typing speed',
    eyebrow: 'COMPARE · AUTOMATION AND MANUAL ENTRY',
    ref: 'COMPARE 33 · MANUAL ENTRY',
    stamp: '46 MIN\n→ 9 MIN',
    standfirst:
      'Manual entry means a clerk reads every document and keys every field. With Declarix, the clerk checks a finished, source-linked pack. The difference shows up across the whole job, not just in typing.',
    verdict: [
      'Automation with Declarix is best for UK customs desks that want up to 3× more declarations per clerk without changing their filing system. Manual entry keeps the clerk on the slowest part of the job: reading six attachments and keying 43 lines by hand. In the Declarix worked desk model, that is about 46 minutes. Checking a Declarix pack and submitting takes about 9.',
      'The clerk still makes every customs judgment. What goes away is the copying.',
    ],
    bestFor: [
      ['Manual entry', 'The way most desks work today: a clerk reads each document and keys each field into the filing system.'],
    ],
    tableTitle: 'Manual entry and Declarix, step by step.',
    table: {
      caption: `The same job, worked two ways. Declarix figures from the worked desk model, checked ${CHECKED}.`,
      columns: ['Step', 'Manual entry', 'With Declarix'],
      rows: [
        ['Open the job', 'Clerk opens each attachment in turn: invoices, packing list, transport document, spreadsheet, email thread.', ['Declarix reads the whole job together, including scans, phone photos and forwarded email chains.', 'dxScope']],
        ['Build the entry', 'Clerk keys parties, values, weights, packages, origin and each line.', ['Declarix builds the CDS-ready entry data. Typical processing is around 200 seconds.', 'dxHow']],
        ['Find conflicts', 'Depends on the clerk spotting that the invoice says CIF and the email says CIP.', ['The conflict shows beside both sources as a question.', 'dxHow']],
        ['Check the work', 'Re-reading the documents against the screen.', ['Each proposed value shows its document, page and line.', 'dxHow']],
        ['Time per declaration', 'About 46 minutes of keying and assembly in the worked model.', ['About 9 minutes to check and submit in the worked model.', 'dxHome']],
        ['Labour cost per declaration', '£7.95 in the worked model.', ['£2.45 in the worked model.', 'dxHome']],
        ['File', 'Through your filing system.', ['Through the same filing system: Sequoia, Descartes e-Customs or a customer integration.', 'dxScope']],
      ],
    },
    blocks: [
      {
        label: 'WORKED UK EXAMPLE',
        title: 'One job: 6 attachments, 3 formats, 43 lines.',
        paragraphs: [
          'The job lands at 08:52 with two amalgamated invoices. Keyed by hand, it takes about 50 minutes of a clerk’s morning. With Declarix the pack is ready at 08:56, and the clerk has checked and submitted by 09:05. The other 40 minutes go back to the desk.',
          'Repeat that across a week and the desk clears more work with the same team. At 480 declarations a week, the homepage model shows a bottom line of £137,280 a year.',
        ],
        src: ['dxHome'],
      },
      {
        label: 'RUN YOUR OWN TIME STUDY',
        title: 'Measure the same job both ways.',
        ordered: [
          'Choose one anonymised job your team dislikes: scans, long line tables, a real conflict.',
          'Time the manual build from opening the email to a filed entry.',
          'Run the same job through the Declarix pilot and time the clerk’s check.',
          'Record preparation, review, customer chasing and rework separately.',
          'Put your volume, minutes and loaded clerk cost into the ROI calculator.',
        ],
      },
    ],
    faqs: [
      ['Is customs automation faster than manual entry?', 'Yes: in the Declarix worked desk model, about 46 minutes of keying becomes about 9 minutes of checking and submitting.'],
      ['Does automation remove the clerk?', 'No, the clerk still checks every value and makes every customs judgment; Declarix removes the copying.'],
      ['What happens when documents disagree?', 'Declarix shows the conflict beside both sources as a question for the clerk instead of guessing.'],
      ['Do we need a new filing system?', 'No, Declarix hands a CDS-ready pack to Sequoia, Descartes e-Customs or your customer integration.'],
      ['How do I measure it on my work?', `Run one anonymised job through the [pilot](/pilot/): ${pilotLine}.`],
    ],
    related: ['/compare/automation-vs-hiring/', '/compare/automation-vs-outsourcing/', '/compare/declarix-vs-sequoia/', '/compare/declarix-vs-descartes-e-customs/'],
  },
  {
    kind: 'workflow',
    path: '/compare/automation-vs-hiring/',
    title: 'Customs automation vs hiring: model the workload',
    description:
      'Hire another customs clerk or add capacity with automation? Compare cost lines, time to productivity and output: up to 3× more declarations per clerk.',
    h1: 'Model capacity before choosing software or another hire',
    eyebrow: 'COMPARE · AUTOMATION AND HIRING',
    ref: 'COMPARE 35 · HIRING',
    stamp: 'SAME\nTEAM',
    standfirst:
      'When declarations pile up, the usual answer is another clerk. Declarix gives each clerk you already have up to 3× more declarations, from the first month, on published monthly terms.',
    verdict: [
      'Automation with Declarix is best for UK customs desks that want up to 3× more declarations per clerk without changing their filing system or waiting for a recruit. Hiring adds one person’s hours after recruitment and training. Declarix multiplies the hours of every experienced clerk you already employ.',
      'Your experienced clerks keep the judgment work. New capacity comes from removing the keying, not from adding desks.',
    ],
    bestFor: [
      ['Another hire', 'Desks that need more people for judgment work, customer relationships or new services.'],
    ],
    tableTitle: 'Hiring and Declarix, line by line.',
    table: {
      caption: `Cost lines and capacity. UK employer rates from GOV.UK and Declarix prices from the published pricing page, checked ${CHECKED}.`,
      columns: ['Line', 'Hire another clerk', 'Add Declarix'],
      rows: [
        ['Time to capacity', 'Recruitment, notice period and training before the new clerk works at full speed.', ['One-job pilot first; CDS-ready pack returned within one working day.', 'dxPilot']],
        ['Salary costs', ['Salary plus employer National Insurance at 15% above £5,000 a year (2026 to 2027).', 'hmrcNi'], ['No seat fees.', 'dxPricing']],
        ['Pension', ['Employer auto-enrolment minimum of 3% of qualifying earnings.', 'hmrcPension'], ['None.', 'dxPricing']],
        ['Monthly price', 'Fixed salary whatever the volume.', [`Published packages: ${priceLine}.`, 'dxPricing']],
        ['Capacity added', 'One more person’s hours.', ['Up to 3× more declarations for every clerk on the desk.', 'dxHome']],
        ['Commitment', 'Employment contract.', ['Month to month. Cancel anytime.', 'dxPricing']],
      ],
    },
    blocks: [
      {
        label: 'WORKSHEET',
        title: 'Put your own numbers in.',
        ordered: [
          'Count declarations per week and the minutes each one takes today.',
          'Work out the loaded hourly cost of a clerk: salary, employer National Insurance, pension and overheads.',
          'Estimate how long a new hire takes to reach full speed on your work.',
          'Enter the same figures in the Declarix ROI calculator to see hours released and extra declarations supported.',
          'Compare the monthly cost of the hire with the Declarix package that fits your volume.',
        ],
      },
      {
        label: 'WORKED MODEL',
        title: 'What the same team can clear.',
        paragraphs: [
          'In the Declarix worked desk model, one declaration takes about 46 minutes of keying and assembly by hand and about 9 minutes of checking and submitting with Declarix. Labour cost moves from £7.95 to £2.45 per declaration. At 480 declarations a week, the model shows a bottom line of £137,280 a year.',
          'Bring your weekly volume, minutes per declaration and loaded clerk cost to the 20-minute numbers call to replace every assumption with your own.',
        ],
        src: ['dxHome'],
      },
    ],
    faqs: [
      ['Is automation cheaper than hiring a customs clerk?', `Declarix packages start at ${deskLine} with no seat fees, so compare that with the full loaded cost of a new clerk for your volume.`],
      ['How quickly does Declarix add capacity?', 'The pilot returns the CDS-ready pack within one working day, so you see the effect on a real job straight away.'],
      ['Does automation replace experienced clerks?', 'No, Declarix gives experienced clerks more output by removing the keying, and they keep every customs judgment.'],
      ['What employer costs come with a new hire?', 'Employer National Insurance is 15% above £5,000 a year for 2026 to 2027, and the auto-enrolment employer pension minimum is 3%.'],
      ['How do I model my desk?', 'Use the [ROI calculator](/roi-calculator/), then bring the result to the 20-minute numbers call.'],
    ],
    related: ['/compare/automation-vs-manual-entry/', '/compare/automation-vs-outsourcing/', '/compare/declarix-vs-sequoia/', '/compare/declarix-vs-cargowise-customs/'],
  },
]

// ---------- Hub (P44) ----------

export const compareHub = {
  kind: 'hub',
  path: '/compare/',
  title: 'Customs software comparison: UK tools side by side',
  description:
    'Compare UK customs software: Declarix, iCustoms, Customaite, Descartes, Sequoia, CargoWise, Customs4trade and Flytta. Sourced facts, checked 15 Oct 2026.',
  h1: 'Compare customs workflows and software',
  eyebrow: 'COMPARE · UK CUSTOMS SOFTWARE',
  ref: 'COMPARE 44 · INDEX',
  stamp: 'SOURCED\nAND DATED',
  standfirst:
    'Every comparison here uses the same criteria, links each vendor fact to its source and shows the date checked. Start with the decision you are making, then open the pair that matches it.',
  verdict: [
    'UK customs software falls into two layers. Filing systems, such as ASM Sequoia, Descartes e-Customs, CargoWise, Customs4trade and iCustoms iCDS, submit declarations to CDS. Preparation tools build the entry before filing. Declarix is best for UK customs desks that want up to 3× more declarations per clerk without changing their filing system: it works ahead of Sequoia and Descartes.',
  ],
  blocks: [
    {
      label: 'START WITH THE DECISION',
      title: 'Three questions buyers actually face.',
      list: [
        'Replace the filing system? Compare the filing platforms: [Sequoia vs Descartes](/compare/sequoia-vs-descartes/), [iCustoms vs Descartes](/compare/icustoms-vs-descartes/), [iCustoms vs Customs4trade](/compare/icustoms-vs-customs4trade/).',
        'Keep the filing system and add AI? Compare preparation options: [Declarix vs iCustoms](/compare/declarix-vs-icustoms/), [Declarix vs Customaite](/compare/declarix-vs-customaite/), [Declarix vs Flytta](/compare/declarix-vs-flytta/).',
        'Add capacity without hiring? Compare workflows: [automation vs manual entry](/compare/automation-vs-manual-entry/), [automation vs hiring](/compare/automation-vs-hiring/), [automation vs outsourcing](/compare/automation-vs-outsourcing/).',
      ],
    },
    {
      label: 'HOW WE COMPARE',
      title: 'Same criteria, every page.',
      paragraphs: [
        `Each Declarix comparison uses the same eight rows: ${criteria.map(([, label]) => label.toLowerCase()).join(', ')}. Vendor facts come from each vendor’s own public pages or GOV.UK, with a link and the date checked (${CHECKED}). Declarix publishes these pages.`,
      ],
    },
  ],
  groups: [
    ['Declarix and filing systems', 'Keep your filing system and add capacity in front of it.', ['/compare/declarix-vs-descartes-e-customs/', '/compare/declarix-vs-sequoia/', '/compare/declarix-vs-cargowise-customs/', '/compare/declarix-vs-customs4trade/']],
    ['Declarix and AI customs automation', 'Compare preparation and AI tools on evidence, pricing and pilot terms.', ['/compare/declarix-vs-icustoms/', '/compare/declarix-vs-customaite/', '/compare/declarix-vs-flytta/']],
    ['Vendor against vendor', 'Neutral side-by-side facts, then where Declarix fits.', ['/compare/icustoms-vs-descartes/', '/compare/sequoia-vs-descartes/', '/compare/icustoms-vs-customaite/', '/compare/icustoms-vs-flytta/', '/compare/icustoms-vs-customs4trade/']],
    ['Workflow choices', 'Automation against manual entry, hiring and outsourcing.', ['/compare/automation-vs-manual-entry/', '/compare/automation-vs-hiring/', '/compare/automation-vs-outsourcing/']],
  ],
  faqs: [
    ['What is the difference between customs filing software and customs preparation software?', 'Filing software submits the declaration to CDS, while preparation software such as Declarix builds the entry from the customer’s documents before filing.'],
    ['Which UK customs software is on HMRC’s CDS list?', `ASM, Descartes, WiseTech Global, iCustoms and Customs4trade all appear on HMRC’s list of CDS software providers (checked ${CHECKED}).`],
    ['Which customs software publishes its prices?', `Declarix publishes every package (${priceLine}) and is the only vendor compared here that publishes every package and per-pack rate.`],
    ['Can I keep Sequoia or Descartes and still automate?', 'Yes, Declarix supports CDS-ready exports for Sequoia and Descartes e-Customs, so you automate the build and keep your filing system.'],
    ['Who publishes these comparisons?', 'Declarix Limited publishes them, using vendor pages and GOV.UK as sources, each linked and dated.'],
  ],
}

export const comparisonRoutes = [compareHub, ...comparisonPages, ...workflowPages]

// ---------- Rendering ----------

const esc = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

// Escaped text with [label](/path/) links.
const rich = (value) => esc(value).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => `<a href="${href}">${label}</a>`)
const plain = (value) => String(value).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1')

const allRoutes = () => [...comparisonRoutes, { path: '/compare/automation-vs-outsourcing/', title: 'Automation vs outsourcing: cost model' }]
const routeName = (path) => {
  const route = allRoutes().find((candidate) => candidate.path === path)
  if (!route) throw new Error(`Unknown comparison link ${path}`)
  if (path === '/compare/automation-vs-outsourcing/') return 'Customs automation vs outsourcing: cost model'
  return route.h1
}

function collectSourceKeys(page) {
  const keys = []
  const add = (key) => {
    if (!sources[key]) throw new Error(`${page.path} cites unknown source ${key}`)
    if (!keys.includes(key)) keys.push(key)
  }
  for (const productKey of page.columns || []) for (const [criterion] of criteria) products[productKey].cells[criterion].src.forEach(add)
  for (const vendorKey of page.vendors || []) products[vendorKey].facts.forEach((fact) => fact.src.forEach(add))
  for (const row of page.table?.rows || []) for (const cell of row.slice(1)) if (Array.isArray(cell)) cell.slice(1).forEach(add)
  for (const block of page.blocks || []) (block.src || []).forEach(add)
  if (page.kind === 'hub') ['hmrcList', 'dxPricing', 'dxScope'].forEach(add)
  return keys
}

export function pageSources(page) {
  return collectSourceKeys(page).map((key) => ({ key, ...sources[key] }))
}

function refs(keys, order) {
  return keys.map((key) => `<sup><a href="#src-${key}" aria-label="Source ${order.indexOf(key) + 1}">[${order.indexOf(key) + 1}]</a></sup>`).join('')
}

function renderVerdict(page) {
  const best = [
    ...(page.bestFor || []).map(([name, text]) => [name, text, false]),
    ['Declarix', declarixBestFor, true],
  ]
  return `<section class="compare-block verdict" aria-labelledby="verdict-heading">
    <span class="section-label">THE SHORT ANSWER</span>
    <h2 id="verdict-heading">${page.kind === 'pair' ? 'Who each product suits.' : 'Who each option is best for.'}</h2>
    ${page.verdict.map((paragraph, index) => `<p${index === 0 ? ' class="verdict-lead"' : ''}>${rich(paragraph)}</p>`).join('')}
    ${best.length ? `<dl class="best-for">${best.map(([name, text, own]) => `<div${own ? ' class="is-declarix"' : ''}><dt>BEST FOR · ${esc(name.toUpperCase())}</dt><dd>${rich(text)}</dd></div>`).join('')}</dl>` : ''}
    <p class="publisher-note">PUBLISHED BY DECLARIX LIMITED · VENDOR FACTS FROM EACH VENDOR’S OWN PAGES AND GOV.UK · CHECKED ${CHECKED.toUpperCase()}</p>
  </section>`
}

function renderProductTable(page, order) {
  const cols = page.columns.map((key) => products[key])
  const head = `<tr><th scope="col">Criterion</th>${cols.map((product) => `<th scope="col">${esc(product.name)}</th>`).join('')}</tr>`
  const body = criteria
    .map(([criterion, label]) => `<tr><th scope="row">${esc(label)}</th>${page.columns
      .map((key) => {
        const cell = products[key].cells[criterion]
        return `<td${key === 'declarix' ? ' class="is-declarix"' : ''}>${esc(cell.text)}${refs(cell.src, order)}</td>`
      })
      .join('')}</tr>`)
    .join('')
  const caption = `${cols.map((product) => product.name).join(' and ')} on the same eight criteria. Vendor facts checked ${CHECKED}.`
  return `<section class="compare-block" aria-labelledby="table-heading">
    <span class="section-label">SIDE BY SIDE</span>
    <h2 id="table-heading">${esc(cols.map((product) => product.name).join(' vs '))}, criterion by criterion.</h2>
    <div class="table-wrap" role="region" aria-labelledby="table-caption" tabindex="0"><table class="compare-table"><caption id="table-caption">${esc(caption)}</caption><thead>${head}</thead><tbody>${body}</tbody></table></div>
    <p class="table-note">Numbers in brackets link to the source register below. Scroll sideways on a narrow screen.</p>
  </section>`
}

function renderCustomTable(page, order) {
  const { table } = page
  const cell = (value, index) => {
    if (Array.isArray(value)) return `<td${index === table.columns.length - 1 ? ' class="is-declarix"' : ''}>${esc(value[0])}${refs(value.slice(1), order)}</td>`
    return `<td${index === table.columns.length - 1 ? ' class="is-declarix"' : ''}>${esc(value)}</td>`
  }
  return `<section class="compare-block" aria-labelledby="table-heading">
    <span class="section-label">SIDE BY SIDE</span>
    <h2 id="table-heading">${esc(page.tableTitle)}</h2>
    <div class="table-wrap" role="region" aria-labelledby="table-caption" tabindex="0"><table class="compare-table"><caption id="table-caption">${esc(table.caption)}</caption><thead><tr>${table.columns.map((column) => `<th scope="col">${esc(column)}</th>`).join('')}</tr></thead><tbody>${table.rows
      .map((row) => `<tr><th scope="row">${esc(row[0])}</th>${row.slice(1).map((value, index) => cell(value, index + 1)).join('')}</tr>`)
      .join('')}</tbody></table></div>
    <p class="table-note">Numbers in brackets link to the source register below. Scroll sideways on a narrow screen.</p>
  </section>`
}

function renderHubTable(order) {
  const keys = ['declarix', 'descartes', 'sequoia', 'cargowise', 'customs4trade', 'icustoms', 'customaite', 'flytta']
  const linkFor = {
    declarix: '/compare/declarix-vs-descartes-e-customs/', descartes: '/compare/declarix-vs-descartes-e-customs/', sequoia: '/compare/declarix-vs-sequoia/',
    cargowise: '/compare/declarix-vs-cargowise-customs/', customs4trade: '/compare/declarix-vs-customs4trade/', icustoms: '/compare/declarix-vs-icustoms/',
    customaite: '/compare/declarix-vs-customaite/', flytta: '/compare/declarix-vs-flytta/',
  }
  const rows = keys.map((key) => {
    const product = products[key]
    const cells = ['job', 'filing', 'pricing'].map((criterion) => {
      const cell = product.cells[criterion]
      return `<td${key === 'declarix' ? ' class="is-declarix"' : ''}>${esc(cell.text)}${refs(cell.src, order)}</td>`
    })
    return `<tr><th scope="row"><a href="${linkFor[key]}">${esc(product.name)}</a></th>${cells.join('')}</tr>`
  })
  return `<section class="compare-block" aria-labelledby="table-heading">
    <span class="section-label">THE UK SHORTLIST</span>
    <h2 id="table-heading">Eight products, three facts each.</h2>
    <div class="table-wrap" role="region" aria-labelledby="table-caption" tabindex="0"><table class="compare-table"><caption id="table-caption">UK customs software: main job, CDS filing and published pricing. Checked ${esc(CHECKED)}.</caption><thead><tr><th scope="col">Product</th><th scope="col">Main job</th><th scope="col">Filing to HMRC CDS</th><th scope="col">Published pricing</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>
    <p class="table-note">Numbers in brackets link to the source register below. Scroll sideways on a narrow screen.</p>
  </section>`
}

function renderVendorCards(page, order) {
  if (!page.vendors?.length) return ''
  return `<section class="compare-block" aria-labelledby="facts-heading">
    <span class="section-label">VENDOR FACT CARDS</span>
    <h2 id="facts-heading">What each vendor says about itself.</h2>
    <div class="vendor-cards">${page.vendors
      .map((key) => {
        const product = products[key]
        return `<article class="vendor-card"><h3>${esc(product.name)}</h3><p class="vendor-role">${esc(product.role)}</p><ul class="fact-list">${product.facts
          .map((fact) => `<li>${esc(fact.text)}${refs(fact.src, order)}<span class="fact-source">SOURCE: <a href="${esc(sources[fact.src[0]].url)}">${esc(sources[fact.src[0]].publisher)}</a> · CHECKED ${CHECKED.toUpperCase()}</span></li>`)
          .join('')}</ul></article>`
      })
      .join('')}</div>
  </section>`
}

function renderBlock(block, order) {
  const paragraphs = (block.paragraphs || []).map((paragraph) => `<p>${rich(paragraph)}</p>`).join('')
  const list = block.list ? `<ul>${block.list.map((item) => `<li>${rich(item)}</li>`).join('')}</ul>` : ''
  const ordered = block.ordered ? `<ol>${block.ordered.map((item) => `<li>${rich(item)}</li>`).join('')}</ol>` : ''
  const cite = block.src?.length ? `<p class="table-note">Sources: ${refs(block.src, order)}</p>` : ''
  return `<section class="compare-block">
    <span class="section-label">${esc(block.label)}</span>
    <h2>${esc(block.title)}</h2>
    ${paragraphs}${list}${ordered}${cite}
  </section>`
}

function renderChoose(page) {
  if (page.kind === 'hub') return ''
  const items = commonChoose
  const heading = 'Choose Declarix if…'
  return `<section class="compare-block choose-declarix" aria-labelledby="choose-heading">
    <span class="section-label">THE DECLARIX CASE</span>
    <h2 id="choose-heading">${esc(heading)}</h2>
    <ul>${items.map((item) => `<li>${rich(item)}</li>`).join('')}</ul>
    <p>See the full workflow on <a href="/how-it-works/">how Declarix works</a>, or check the <a href="/supported-scope/">supported scope</a>.</p>
  </section>`
}

function renderHubGroups(page) {
  return `<section class="compare-block" aria-labelledby="hub-heading">
    <span class="section-label">ALL COMPARISONS</span>
    <h2 id="hub-heading">Open the comparison you need.</h2>
    <div class="hub-groups">${page.groups
      .map(([title, intro, paths]) => `<div><h3>${esc(title)}</h3><p>${esc(intro)}</p><ul>${paths.map((path) => `<li><a href="${path}">${esc(routeName(path))}</a></li>`).join('')}</ul></div>`)
      .join('')}</div>
  </section>`
}

function renderFaq(page) {
  return `<section class="compare-block" aria-labelledby="faq-heading">
    <span class="section-label">QUESTIONS BUYERS ASK</span>
    <h2 id="faq-heading">Short answers.</h2>
    <div class="faq-list">${page.faqs.map(([question, answer]) => `<div class="faq-item"><h3>${esc(question)}</h3><p>${rich(answer)}</p></div>`).join('')}</div>
  </section>`
}

function renderNextSteps(page) {
  const steps = [
    [PACK_CHECK, 'Check a document pack', 'Free pack check for the invoice, packing list and transport documents behind a UK import.'],
    [ROI, 'Model your desk', 'Enter volume, minutes and loaded clerk cost to see hours released and the package that fits.'],
    ['/pilot/', 'Prove it on one job', `${pilotLine.charAt(0).toUpperCase()}${pilotLine.slice(1)}.`],
    ...(page.kind === 'hub' ? [] : [['/compare/', 'All comparisons', 'Every customs software comparison, sourced and dated.']]),
  ]
  const related = (page.related || []).map((path) => [path, routeName(path), 'Related comparison'])
  return `<section class="compare-block" aria-labelledby="next-heading">
    <span class="section-label">NEXT STEP</span>
    <h2 id="next-heading">Test it on your own work.</h2>
    <ul class="next-steps">${[...steps, ...related].map(([href, title, text]) => `<li><a href="${href}"><strong>${esc(title)}</strong><span>${esc(text)}</span></a></li>`).join('')}</ul>
  </section>`
}

function renderSourceRegister(page, list) {
  return `<section class="source-register" aria-labelledby="sources-heading">
    <header>
      <span class="section-label">PRIMARY SOURCE REGISTER</span>
      <h2 id="sources-heading">Check every fact yourself.</h2>
      <p>Each vendor fact links to the vendor’s own page or GOV.UK. Declarix facts link to the published Declarix pages. All sources checked ${CHECKED}.</p>
    </header>
    <ol>${list
      .map((source) => `<li id="src-${source.key}">
          <a href="${esc(source.url)}">${esc(source.title)}</a>
          <span>${esc(source.publisher)} · CHECKED ${esc(CHECKED.toUpperCase())}</span>
        </li>`)
      .join('')}</ol>
  </section>`
}

function jsonLd(page, site, list) {
  const url = `${site.origin}${page.path}`
  const mentioned = [...new Set([...(page.columns || []), ...(page.kind === 'hub' ? Object.keys(products) : [])])]
    .filter((key) => key !== 'declarix')
    .map((key) => ({ '@type': 'SoftwareApplication', name: products[key].name, url: products[key].site, applicationCategory: 'BusinessApplication' }))
  const graph = [
    organizationNode(site),
    { '@type': 'WebSite', '@id': `${site.origin}/#website`, name: 'Declarix', url: `${site.origin}/`, publisher: { '@id': `${site.origin}/#organization` } },
    {
      '@type': page.kind === 'hub' ? 'CollectionPage' : 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: page.title,
      headline: page.h1,
      description: page.description,
      inLanguage: 'en-GB',
      datePublished: CHECKED_ISO,
      dateModified: CHECKED_ISO,
      isPartOf: { '@id': `${site.origin}/#website` },
      about: {
        '@type': 'SoftwareApplication',
        name: 'Declarix',
        url: `${site.origin}/`,
        applicationCategory: 'BusinessApplication',
        description: 'Builds CDS-ready customs entry packs from customer documents for Sequoia, Descartes e-Customs and customer integrations, with up to 3× more declarations per clerk.',
        publisher: { '@id': `${site.origin}/#organization` },
      },
      author: { '@id': `${site.origin}/#organization` },
      publisher: { '@id': `${site.origin}/#organization` },
      image: `${site.origin}/og.jpg`,
      mentions: mentioned,
      citation: list.map((source) => source.url),
      breadcrumb: { '@id': `${url}#breadcrumb` },
    },
    { ...breadcrumbList(site, page.path), '@id': `${url}#breadcrumb` },
    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: page.faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: plain(answer) } })),
    },
  ]
  if (page.kind === 'hub') {
    const paths = page.groups.flatMap(([, , list2]) => list2)
    graph.push({
      '@type': 'ItemList',
      '@id': `${url}#comparisons`,
      name: 'Customs software comparisons',
      itemListElement: paths.map((path, index) => ({ '@type': 'ListItem', position: index + 1, name: routeName(path), url: `${site.origin}${path}` })),
    })
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')
}

export function renderComparison(page, site, { navHtml = '', webmasterHtml = '', bookingHref = '/#book' } = {}) {
  const list = pageSources(page)
  const order = list.map((source) => source.key)
  const canonical = `${site.origin}${page.path}`
  const table = page.kind === 'hub' ? renderHubTable(order) : page.table ? renderCustomTable(page, order) : renderProductTable(page, order)
  const crumbs = page.kind === 'hub'
    ? `<a href="/">HOME</a> → COMPARE`
    : `<a href="/">HOME</a> → <a href="/compare/">COMPARE</a> → ${esc(page.eyebrow.replace(/^COMPARE · /, ''))}`
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${esc(page.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterHtml}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <link rel="stylesheet" href="/comparison.css" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${esc(page.title)}</title>
    <script type="application/ld+json">${jsonLd(page, site, list)}</script>
  </head>
  <body class="compare-page">
    <div class="docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>CORE OUTCOME</span><strong>UP TO 3×</strong></div>
        <a class="masthead-cta" href="${bookingHref}">BOOK THE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${navHtml}</nav>
      <div class="breadcrumbs">${crumbs}</div>
      <main>
        <header class="hero">
          <div class="hero-copy">
            <p class="eyebrow">${esc(page.eyebrow)}</p>
            <h1>${esc(page.h1)}</h1>
            <p>${esc(page.standfirst)}</p>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${esc(page.ref)}</span>
            <div class="stamp">${esc(page.stamp).replaceAll('\n', '<br />')}</div>
            <div class="review-cell"><span>FACTS CHECKED</span><strong>${CHECKED_ISO}</strong></div>
          </aside>
        </header>
        ${renderVerdict(page)}
        ${table}
        ${renderVendorCards(page, order)}
        ${page.kind === 'hub' ? renderHubGroups(page) : ''}
        ${(page.blocks || []).map((block) => renderBlock(block, order)).join('')}
        ${renderChoose(page)}
        ${renderFaq(page)}
        ${renderNextSteps(page)}
        ${renderSourceRegister(page, list)}
        <div class="source-stamp">SOURCE AND CORRECTIONS · FACTS CHECKED ${CHECKED_ISO} · <a href="/editorial-policy/">READ THE POLICY</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
        <section class="cta-band">
          <div><h2>Run the numbers on your desk.</h2><p>Bring weekly volume, current minutes per declaration, loaded clerk cost and the system your team files through. Leave the 20-minute numbers call with an ROI estimate, an integration route and a recommended first workflow.</p></div>
          <a class="button" href="${bookingHref}">BOOK THE 20-MINUTE NUMBERS CALL</a>
        </section>
      </main>
      <footer class="footer">
        <span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span>
        <nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/pricing-policy/">PRICING POLICY</a><a href="/compare/">COMPARE</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav>
      </footer>
    </div>
  </body>
</html>`
}

// Build-time checks for the comparison set. Throws on the first failure.
export function validateComparisons() {
  for (const page of comparisonRoutes) {
    if (page.title.length > 60) throw new Error(`${page.path} title is ${page.title.length} chars`)
    if (page.description.length < 80 || page.description.length > 155) throw new Error(`${page.path} description is ${page.description.length} chars`)
    if (!page.faqs?.length || page.faqs.length < 4) throw new Error(`${page.path} needs at least four visible FAQs`)
    for (const [question, answer] of page.faqs) {
      const sentences = plain(answer).split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean)
      if (sentences.length !== 1) throw new Error(`${page.path} FAQ answer must be one sentence: ${question}`)
    }
    if (!page.verdict?.[0]) throw new Error(`${page.path} needs an answer-first verdict`)
    if (!page.verdict.join(' ').includes('up to 3× more declarations per clerk') && !page.verdict.join(' ').includes('up to 3× more declarations')) {
      throw new Error(`${page.path} verdict must carry the Declarix proof line`)
    }
    for (const path of page.related || []) routeName(path)
    pageSources(page)
  }
}

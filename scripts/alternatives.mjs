import { breadcrumbList, organizationNode } from './site-graph.mjs'
import { declarix, hmrcList, HMRC_LIST_UPDATED, VENDOR_CHECKED, vendors } from './alternatives-vendors.mjs'

// Lane L3 (15 Oct 2026): /alternatives/ hub, seven alternatives pages, the UK buyer shortlist and the
// customs automation money page. Declarix is listed first and framed by its strengths; competitor facts
// come only from the vendors' own pages and the HMRC list (see alternatives-vendors.mjs).

export const ALTERNATIVES_REVIEWED_ON = '2026-10-15'

const PUBLISHED = '2026-10-15'

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const declarixSource = (title, path) => ({
  title,
  publisher: 'Declarix Limited',
  url: `https://getdeclarix.com${path}`,
  checked: VENDOR_CHECKED,
})

const altPath = (id) => `/alternatives/${id === 'descartes' ? 'descartes-e-customs' : id === 'cargowise' ? 'cargowise-customs' : id}/`

const hubLink = { href: '/alternatives/', label: 'All customs software alternatives', copy: 'Every alternatives page in one place, grouped by the job each tool does.' }
const shortlistLink = { href: '/best-customs-software/', label: 'Best customs declaration software UK', copy: 'The 2026 buyer shortlist, with a “best for” label for each option.' }
const automationLink = { href: '/customs-automation-software/', label: 'Customs automation software', copy: 'What Declarix automates, what your clerk decides, and the numbers.' }
const compareLink = { href: '/compare/', label: 'Compare customs workflows and software', copy: 'Side-by-side comparisons by workflow and vendor.' }
const scopeLink = { href: '/supported-scope/', label: 'Where Declarix fits', copy: 'Document intake, CDS-ready output and the systems it feeds.' }
const pilotLink = { href: '/pilot/', label: 'The one-job pilot', copy: '£0 upfront, £1 per declaration, capped at £500.' }

const altLink = (id, copy) => ({ href: altPath(id), label: `${vendors[id].name.replace(' (now part of Sedna)', '')} alternatives`, copy })

const altSources = (ids) => [
  ...ids.flatMap((id) => vendors[id].sources),
  hmrcList,
  ...declarix.sources,
]

// ---------------------------------------------------------------------------------------------
// Alternatives pages
// ---------------------------------------------------------------------------------------------

const alternativesPages = [
  {
    path: '/alternatives/descartes-e-customs/',
    focal: 'descartes',
    title: 'Descartes customs software alternatives (UK, 2026)',
    description:
      'Descartes e-Customs alternatives for UK desks: keep e-Customs and add up to 3× more declarations per clerk with Declarix, or compare CDS filing systems.',
    eyebrow: 'ALTERNATIVES · DESCARTES E-CUSTOMS',
    ref: 'ALTERNATIVES 01 · DESCARTES',
    h1: 'Descartes e-Customs alternatives: grow the desk without leaving Descartes.',
    standfirst:
      'Most desks searching for a Descartes alternative want more declarations out of the same team. Declarix gives you that while e-Customs keeps filing. If you need a different filing system, the UK options are compared below.',
    stamp: 'KEEP\nE-CUSTOMS\nADD 3×',
    answerTitle: 'The short answer.',
    answerLead:
      'The strongest Descartes e-Customs alternative for a busy UK desk is not a replacement filing system: it is Declarix in front of e-Customs, which builds the CDS-ready entry pack so each clerk can handle up to 3× more declarations.',
    answer: [
      'Declarix supports Descartes e-Customs directly. Your team keeps its screens, badge and permissions, and stops keying each field from invoices, packing lists and emails. If you are replacing the filing layer itself, ASM Sequoia, iCustoms, CargoWise and Customs4trade CAS are all on the HMRC software-developer list for CDS declarations.',
    ],
    takeaways: [
      'Declarix: best for keeping e-Customs and lifting output per clerk.',
      'Typical Declarix processing is around 200 seconds before clerk review.',
      'ASM Sequoia, iCustoms, CargoWise and Customs4trade CAS all file to CDS.',
      'Declarix publishes its prices; the filing suites on this page quote on request.',
      `Vendor facts checked ${VENDOR_CHECKED}; HMRC list updated ${HMRC_LIST_UPDATED}.`,
    ],
    options: ['sequoia', 'icustoms', 'cargowise', 'customs4trade'],
    sections: [
      {
        label: '01 · WHY DESKS LOOK',
        title: 'The pressure is usually volume, not the filing screen.',
        paragraphs: [
          'Searches for “Descartes customs software” and “Descartes alternative” often start on a desk that already files well but cannot keep up. Every new customer adds invoices, packing lists, scans and email chains that a clerk has to read and key before e-Customs ever sees the entry.',
          'Replacing the filing system moves that manual build to a new screen. Declarix removes it. The clerk opens a built, source-linked entry pack and checks it, and e-Customs files it exactly as before.',
        ],
      },
      {
        label: '02 · THE DECISION',
        title: 'Extend e-Customs, or replace the filing layer?',
        facts: [
          ['Extend with Declarix', 'Keep e-Customs, badge and permissions; add a CDS-ready entry pack with evidence for every field'],
          ['Replace the filing layer', 'Migrate to another CDS filing system such as Sequoia, iCustoms, CargoWise or CAS'],
          ['Do both', 'Choose the filing system you want, then put Declarix in front of it for capacity'],
        ],
        paragraphs: [
          'The extend route is the fastest way to add capacity because nothing about filing changes. It is also the route Declarix was built for.',
        ],
      },
      {
        label: '03 · BUYER QUESTIONS',
        title: 'What to ask any Descartes alternative.',
        list: [
          'Does it keep our e-Customs set-up, or does it ask us to migrate filing?',
          'How many more declarations can one clerk handle, measured on our own jobs?',
          'Is every proposed value linked to its source document, page and line?',
          'What happens when the invoice and the email disagree?',
          'Is the price published, and is it per declaration or per seat?',
        ],
      },
      {
        label: '04 · WORKED EXAMPLE',
        title: 'One import, two invoices, one email.',
        paragraphs: [
          'A Felixstowe import arrives as two Japanese invoices, a packing list, a bill of lading and a customer email that says “terms may be CIP?”. Declarix reads all six attachments, combines the invoices, fills exporter, importer, totals, packages, mass, previous document and origin, and flags the Incoterm conflict beside both sources.',
          'The clerk resolves the one question, approves, and the CDS-ready export goes to Descartes e-Customs for filing.',
        ],
      },
    ],
    faqs: [
      ['Does Declarix replace Descartes e-Customs?', 'No: Declarix builds the CDS-ready entry pack and Descartes e-Customs keeps filing it, so you add capacity without migrating.'],
      ['Does Declarix work with Descartes e-Customs today?', 'Yes, Descartes e-Customs is a supported Declarix export and customer workflow integration.'],
      ['Which Descartes alternatives file directly to CDS?', `ASM Sequoia, iCustoms, CargoWise (WiseTech Global) and Customs4trade are on the HMRC software-developer list, updated ${HMRC_LIST_UPDATED}.`],
      ['How much does Declarix cost next to Descartes?', 'Declarix packages start at £500 a month for 100 packs, with no seat fees, and sit alongside your existing Descartes licence.'],
      ['How do we test it?', 'Run the one-job pilot: £0 upfront, £1 per declaration, capped at £500, and fully waived if the agreed success criteria are missed.'],
    ],
    related: [altLink('sequoia', 'The same choice for desks on ASM Sequoia.'), shortlistLink, automationLink, hubLink, compareLink],
  },
  {
    path: '/alternatives/sequoia/',
    focal: 'sequoia',
    title: 'ASM Sequoia alternatives, and how to keep Sequoia',
    description:
      'ASM Sequoia alternatives for UK forwarders: keep Sequoia and add up to 3× more declarations per clerk with Declarix, or compare other CDS filing platforms.',
    eyebrow: 'ALTERNATIVES · ASM SEQUOIA',
    ref: 'ALTERNATIVES 02 · SEQUOIA',
    h1: 'ASM Sequoia alternatives: more declarations from the Sequoia desk you already run.',
    standfirst:
      'Sequoia connects your desk to customs and the port community systems. Declarix fills the gap before it: the reading, keying and cross-checking that slow every clerk down. If you are moving filing platforms, the main UK options are compared below.',
    stamp: 'KEEP\nSEQUOIA\nADD 3×',
    answerTitle: 'The short answer.',
    answerLead:
      'For most Sequoia desks the best alternative to the current workload is Declarix: it builds the CDS-ready entry pack from the customer’s documents, so each clerk can handle up to 3× more declarations while Sequoia keeps filing.',
    answer: [
      'Sequoia is a supported Declarix export and customer workflow integration. If you want to replace the filing platform instead, Descartes e-Customs, iCustoms, CargoWise and Customs4trade CAS are listed by HMRC for CDS declarations.',
    ],
    takeaways: [
      'Declarix: best for keeping Sequoia and lifting output per clerk.',
      'Sequoia keeps its customs and port-community connections untouched.',
      'Every Declarix field shows its source document, page and line.',
      'Declarix prices are published: from £500 a month for 100 packs.',
      `Vendor facts checked ${VENDOR_CHECKED}; HMRC list updated ${HMRC_LIST_UPDATED}.`,
    ],
    options: ['descartes', 'icustoms', 'cargowise', 'customs4trade'],
    sections: [
      {
        label: '01 · WHY DESKS LOOK',
        title: 'Sequoia files fast. The build before it does not.',
        paragraphs: [
          'Forwarders choose Sequoia for its filing and port connections. The time goes earlier, when a clerk opens a PDF invoice, a packing list in Excel and a forwarded email, then keys the entry field by field.',
          'Declarix does that build across the whole job and hands Sequoia a CDS-ready entry. Your team keeps the platform it trusts and gains the capacity it needs.',
        ],
      },
      {
        label: '02 · THE DECISION',
        title: 'Retain, extend or replace.',
        facts: [
          ['Retain Sequoia and extend', 'Add Declarix in front of Sequoia; no migration, same badge and permissions'],
          ['Replace the platform', 'Move filing to Descartes e-Customs, iCustoms, CargoWise or CAS'],
          ['Measure first', 'Run one real job through Declarix and compare clerk time with the manual build'],
        ],
      },
      {
        label: '03 · BUYER QUESTIONS',
        title: 'What to ask before you leave Sequoia.',
        list: [
          'Will the new tool keep our port-community connections and filing permissions?',
          'How long is the migration, and who retrains the clerks?',
          'How many more declarations per clerk will we get, on our own document mix?',
          'Does the price grow with seats or with declarations?',
          'Can we test it on one job before we commit?',
        ],
      },
      {
        label: '04 · WHAT CHANGES FOR THE CLERK',
        title: 'Check the entry instead of building it.',
        paragraphs: [
          'Today the clerk reads every attachment and types each value into Sequoia. With Declarix the job arrives built: exporter, importer, values, weights, packages, previous documents, origin and line data are already in their rows, each with its source.',
          'Conflicts such as an invoice that says CIF and an email that says CIP appear as one clear question. The clerk answers it, approves, and Sequoia files.',
        ],
      },
    ],
    faqs: [
      ['Does Declarix work with ASM Sequoia?', 'Yes, Sequoia is a supported Declarix export and customer workflow integration.'],
      ['Do we have to leave Sequoia to use Declarix?', 'No: Declarix sits in front of Sequoia and Sequoia keeps filing through your badge and permissions.'],
      ['Which Sequoia alternatives file directly to CDS?', `Descartes e-Customs, iCustoms, CargoWise (WiseTech Global) and Customs4trade are on the HMRC software-developer list, updated ${HMRC_LIST_UPDATED}.`],
      ['How fast is Declarix?', 'Typical Declarix processing is around 200 seconds before clerk review.'],
      ['What does it cost?', 'Desk is £500 a month for 100 packs, Team £4,000 for 1,000 and Scale £9,000 for 3,000, with extra packs at the package rate and never below £3.00.'],
    ],
    related: [altLink('descartes', 'The same choice for desks on Descartes e-Customs.'), shortlistLink, automationLink, scopeLink, hubLink],
  },
  {
    path: '/alternatives/icustoms/',
    focal: 'icustoms',
    title: 'iCustoms alternatives for UK customs desks (2026)',
    description:
      'iCustoms alternatives for UK brokers and forwarders by workflow: Declarix for up to 3× more declarations per clerk, plus Sequoia, Descartes and more.',
    eyebrow: 'ALTERNATIVES · ICUSTOMS',
    ref: 'ALTERNATIVES 03 · ICUSTOMS',
    h1: 'iCustoms alternatives: choose by the work your desk actually does.',
    standfirst:
      'iCustoms combines filing, classification and document processing on one platform. If your desk wants to keep its own filing system and multiply output per clerk, Declarix is built for exactly that. Other platform options are compared below.',
    stamp: 'YOUR\nSYSTEM\nADD 3×',
    answerTitle: 'The short answer.',
    answerLead:
      'If you want an iCustoms alternative that keeps your existing filing system, choose Declarix: it turns the customer’s documents into a CDS-ready entry pack for Sequoia, Descartes e-Customs or your customer integration, with up to 3× more declarations per clerk.',
    answer: [
      'If you want a different all-in-one filing platform instead, Descartes e-Customs, ASM Sequoia, CargoWise and Customs4trade CAS are on the HMRC software-developer list. Customaite is a further AI preparation option that names Sequoia and Descartes among the systems it works with.',
    ],
    takeaways: [
      'Declarix: best for desks that keep their filing system and want more output per clerk.',
      'Declarix publishes its prices; iCustoms quotes on request.',
      'Every Declarix field links to its source document, page and line.',
      'Descartes, Sequoia, CargoWise and CAS are the main CDS filing alternatives.',
      `Vendor facts checked ${VENDOR_CHECKED}; HMRC list updated ${HMRC_LIST_UPDATED}.`,
    ],
    options: ['descartes', 'sequoia', 'cargowise', 'customs4trade', 'customaite'],
    sections: [
      {
        label: '01 · WHY TEAMS LOOK',
        title: 'Platform switch, or a stronger desk?',
        paragraphs: [
          'Teams compare iCustoms alternatives for different reasons. Some want a platform that fits a filing system they already run. Some want clear, published pricing. Most want the same experienced clerks to clear more declarations each day.',
          'Declarix answers the capacity question without asking you to change platform. It prepares the entry; your system files it.',
        ],
      },
      {
        label: '02 · THE DECISION',
        title: 'Replace, extend or prepare.',
        facts: [
          ['Prepare with Declarix', 'Keep Sequoia, Descartes or your customer system; Declarix builds the CDS-ready entry pack'],
          ['Replace with another platform', 'Descartes e-Customs, ASM Sequoia, CargoWise or Customs4trade CAS'],
          ['Extend with AI preparation', 'Declarix or Customaite in front of the filing system you keep'],
        ],
      },
      {
        label: '03 · BUYER QUESTIONS',
        title: 'Five questions for every iCustoms alternative.',
        list: [
          'Does it work with the filing system we already pay for?',
          'Can we see the source of every proposed value before approval?',
          'How are conflicts between invoice, packing list and email shown?',
          'Is pricing published, and is it per declaration or per seat?',
          'Can we prove it on one real job before signing?',
        ],
      },
      {
        label: '04 · WORKED EXAMPLE',
        title: 'The 43-line amalgamated import.',
        paragraphs: [
          'Two supplier invoices cover 43 lines for one entry. A packing list gives 640 cartons on 16 pallets, and a phone photo of a delivery note confirms the pallet count. Declarix reads every attachment, combines the invoices and builds the line table with origin, values and weights.',
          'Each line keeps its source. The clerk checks the pack in minutes rather than keying 43 lines by hand.',
        ],
      },
    ],
    faqs: [
      ['What is the best iCustoms alternative for a broker on Sequoia or Descartes?', 'Declarix, because it builds the CDS-ready entry pack for Sequoia or Descartes e-Customs and leaves filing where it is.'],
      ['Which iCustoms alternatives file directly to CDS?', `Descartes, ASM Sequoia, CargoWise (WiseTech Global) and Customs4trade are on the HMRC software-developer list, updated ${HMRC_LIST_UPDATED}.`],
      ['Does Declarix publish its pricing?', 'Yes: Desk £500 a month for 100 packs, Team £4,000 for 1,000 and Scale £9,000 for 3,000.'],
      ['Does iCustoms publish a price?', `No public price was found on the iCustoms pages we checked on ${VENDOR_CHECKED}.`],
      ['How quickly can we see results?', 'Book the 20-minute numbers call, then run one real job through the pilot.'],
    ],
    related: [altLink('customaite', 'Other AI preparation tools compared.'), shortlistLink, automationLink, compareLink, hubLink],
  },
  {
    path: '/alternatives/flytta/',
    focal: 'flytta',
    title: 'Flytta alternatives: customs automation now in Sedna',
    description:
      'Flytta is now part of Sedna. Compare Flytta alternatives for UK customs desks, led by Declarix: up to 3× more declarations per clerk, no seat fees.',
    eyebrow: 'ALTERNATIVES · FLYTTA (SEDNA)',
    ref: 'ALTERNATIVES 04 · FLYTTA',
    h1: 'Flytta alternatives now that Flytta is part of Sedna.',
    standfirst:
      'Flytta’s customs workflow now sits inside Sedna AI. If you want a dedicated customs-preparation product that feeds Sequoia or Descartes, priced per pack with no seat fees, start with Declarix. Other options are compared below.',
    stamp: 'NO SEAT\nFEES',
    answerTitle: 'The short answer.',
    answerLead:
      'The best Flytta alternative for a UK broker or forwarder is Declarix: a dedicated customs-preparation product that builds CDS-ready entry packs for Sequoia, Descartes e-Customs and customer integrations, with every field linked to its source.',
    answer: [
      'Flytta has been acquired by Sedna, and Sedna says the Flytta workflow “is now part of Sedna AI”. Teams that want customs preparation as its own product can compare Declarix, Customaite and Digicust. Teams that want to change the filing system itself can compare iCustoms and the established filing platforms.',
    ],
    takeaways: [
      'Declarix: best for a dedicated customs-preparation layer in front of Sequoia or Descartes.',
      'Declarix pricing is per pack with no seat fees.',
      'Flytta is now part of Sedna AI (Sedna’s own wording).',
      'Customaite and Digicust are further AI preparation options.',
      `Vendor facts checked ${VENDOR_CHECKED}.`,
    ],
    options: ['customaite', 'digicust', 'icustoms', 'sequoia'],
    sections: [
      {
        label: '01 · WHY TEAMS LOOK',
        title: 'An acquisition is a natural review point.',
        paragraphs: [
          'When a product moves inside a larger platform, teams check whether the new home still matches the job they bought it for. Some will want Sedna’s wider communication workflow. Others want a product whose only job is customs preparation.',
          'Declarix is that product. It reads the whole job, builds the entry and shows its working, then hands a CDS-ready export to the filing system you already run.',
        ],
      },
      {
        label: '02 · PRICING MODELS',
        title: 'Per pack, per trade or per seat.',
        facts: [
          ['Declarix', 'Desk £500/month for 100 packs; Team £4,000 for 1,000; Scale £9,000 for 3,000; no seat fees'],
          ['Flytta (published)', '“£5 Per Trade”; Flytta Pro “£50 Per Month Per Seat”; Enterprise on request'],
          ['Customaite', 'Quote-based, with plans banded by monthly declaration volume'],
        ],
        paragraphs: [
          'Declarix volume grows without adding seats, so a growing desk does not pay more for each new clerk login.',
        ],
      },
      {
        label: '03 · BUYER QUESTIONS',
        title: 'What to ask any Flytta alternative.',
        list: [
          'Is customs preparation the core product, or one feature of a wider platform?',
          'Which filing systems does it feed today: Sequoia, Descartes, or both?',
          'Does each proposed value show its source document, page and line?',
          'How are missing facts handled: a visible question, or a silent guess?',
          'What does a pilot cost if it does not meet the agreed criteria?',
        ],
      },
      {
        label: '04 · WHAT THE CLERK SEES',
        title: 'A built entry with its evidence.',
        paragraphs: [
          'Declarix returns the entry pack with every field pinned to its evidence. The clerk opens a value, sees the invoice line it came from and moves on. Conflicts and gaps arrive as short questions.',
          'That is how one clerk reaches up to 3× more declarations: the reading and keying are done, and the judgment stays with the expert.',
        ],
      },
    ],
    faqs: [
      ['Is Flytta still available?', 'Flytta’s site states it has been acquired by Sedna, and Sedna says the workflow is now part of Sedna AI.'],
      ['What is the best Flytta alternative for a Sequoia desk?', 'Declarix, because Sequoia is a supported Declarix export and customer workflow integration.'],
      ['Does Declarix charge per seat?', 'No: Declarix charges per declaration pack, with no seat fees and no hosting fees.'],
      ['Does Declarix work with Descartes too?', 'Yes, Descartes e-Customs is a supported Declarix export and customer workflow integration.'],
      ['How do we try it?', 'Run the one-job pilot: £0 upfront, £1 per declaration, capped at £500, and fully waived if the agreed success criteria are missed.'],
    ],
    related: [altLink('customaite', 'Another AI preparation tool compared.'), shortlistLink, automationLink, hubLink, compareLink],
  },
  {
    path: '/alternatives/customaite/',
    focal: 'customaite',
    title: 'Customaite alternatives for UK customs teams (2026)',
    description:
      'Customaite alternatives for UK brokers and forwarders: Declarix builds CDS-ready entry packs for Sequoia and Descartes, with published per-pack pricing.',
    eyebrow: 'ALTERNATIVES · CUSTOMAITE',
    ref: 'ALTERNATIVES 05 · CUSTOMAITE',
    h1: 'Customaite alternatives built for the UK customs desk.',
    standfirst:
      'Customaite sells a declaration-preparation suite banded by volume. Declarix is built for UK brokers and forwarders on CDS: published prices from 100 packs a month, Sequoia and Descartes support, and up to 3× more declarations per clerk.',
    stamp: 'UK\nCDS\nREADY',
    answerTitle: 'The short answer.',
    answerLead:
      'For a UK broker or forwarder, the strongest Customaite alternative is Declarix: it builds CDS-ready entry packs for Sequoia, Descartes e-Customs and customer integrations, with published prices that start at 100 packs a month.',
    answer: [
      'Flytta (now part of Sedna) and Digicust are further AI preparation options. iCustoms, Descartes e-Customs and ASM Sequoia are the main platforms for teams that want to change the filing system itself.',
    ],
    takeaways: [
      'Declarix: best for UK desks on CDS that want published, per-pack pricing.',
      'Declarix packages start at 100 packs a month; Customaite’s Lite plan starts at 200 declarations.',
      'Both Declarix and Customaite name Sequoia and Descartes.',
      'Every Declarix field shows its source; conflicts become questions.',
      `Vendor facts checked ${VENDOR_CHECKED}.`,
    ],
    options: ['flytta', 'digicust', 'icustoms', 'descartes', 'sequoia'],
    sections: [
      {
        label: '01 · WHY TEAMS LOOK',
        title: 'UK focus and a price you can see.',
        paragraphs: [
          'Teams comparing Customaite alternatives often want two things: a product built around UK CDS work, and a price they can model before the first call.',
          'Declarix gives both. The packages are on the pricing page, the capacity calculator is public, and the product is built for UK brokers and forwarders filing through Sequoia, Descartes e-Customs or a customer integration.',
        ],
      },
      {
        label: '02 · ENTRY POINTS',
        title: 'Start at the size your desk is today.',
        facts: [
          ['Declarix Desk', '£500/month for 100 packs; extra packs £5.00'],
          ['Declarix Team', '£4,000/month for 1,000 packs; extra packs £4.00'],
          ['Declarix Scale', '£9,000/month for 3,000 packs; extra packs £3.00'],
          ['Customaite Lite', '200–2,500 declarations a month; price on request'],
        ],
      },
      {
        label: '03 · BUYER QUESTIONS',
        title: 'What to ask any Customaite alternative.',
        list: [
          'Is the product built for UK CDS declarations?',
          'Which filing systems does it hand off to, and how?',
          'Can we see the price before the demo?',
          'Does each value show the exact document, page and line it came from?',
          'Can we start with one job and a capped pilot fee?',
        ],
      },
      {
        label: '04 · WORKED EXAMPLE',
        title: 'Scans, spreadsheets and an email chain.',
        paragraphs: [
          'A haulage customer sends a skewed CMR scan, a 312-line spreadsheet with merged cells and an email with five attachments. Declarix reads the whole job, maps the lines into the entry and links each value back to its cell or page.',
          'The clerk checks the evidence, answers the flagged questions and approves. The export goes to the filing system the desk already uses.',
        ],
      },
    ],
    faqs: [
      ['What is the best Customaite alternative for a UK broker?', 'Declarix, because it is built for UK CDS work and feeds Sequoia, Descartes e-Customs and customer integrations.'],
      ['Does Declarix publish prices?', 'Yes: Desk £500 a month for 100 packs, Team £4,000 for 1,000 and Scale £9,000 for 3,000.'],
      ['Does Customaite publish prices?', `Customaite shows volume-banded plans but no public price on the pages we checked on ${VENDOR_CHECKED}.`],
      ['Does Declarix train models on our documents?', 'No, customer documents are never used to train models.'],
      ['What is the next step?', 'Book the 20-minute numbers call to estimate your ROI and choose the first workflow.'],
    ],
    related: [altLink('flytta', 'Flytta, now part of Sedna, compared.'), altLink('icustoms', 'Platform alternatives compared.'), shortlistLink, automationLink, hubLink],
  },
  {
    path: '/alternatives/cargowise-customs/',
    focal: 'cargowise',
    title: 'CargoWise Customs alternatives for UK declarations',
    description:
      'CargoWise Customs alternatives for UK desks: keep your core system, add up to 3× more declarations per clerk with Declarix, or compare UK filing platforms.',
    eyebrow: 'ALTERNATIVES · CARGOWISE CUSTOMS',
    ref: 'ALTERNATIVES 06 · CARGOWISE',
    h1: 'CargoWise Customs alternatives: keep the core system, speed up the UK entry.',
    standfirst:
      'CargoWise runs customs inside a global logistics platform. For a UK desk, the faster win is often the work before filing. Declarix builds the CDS-ready entry pack from the customer’s documents and maps it to the system you run.',
    stamp: 'CORE\nSYSTEM\nKEPT',
    answerTitle: 'The short answer.',
    answerLead:
      'If your UK desk wants more declarations per clerk without a platform migration, Declarix is the strongest CargoWise Customs alternative: it builds the CDS-ready entry pack and hands it to Sequoia, Descartes e-Customs or a mapped customer integration.',
    answer: [
      'If you are choosing a UK filing platform instead, ASM Sequoia, Descartes e-Customs, iCustoms and Customs4trade CAS are all on the HMRC software-developer list for CDS declarations.',
    ],
    takeaways: [
      'Declarix: best for UK desks that want capacity without a platform migration.',
      'Customer integrations are mapped on the 20-minute numbers call.',
      'Sequoia, Descartes, iCustoms and CAS are the main UK filing alternatives.',
      'Declarix prices are published; the platforms on this page quote on request.',
      `Vendor facts checked ${VENDOR_CHECKED}; HMRC list updated ${HMRC_LIST_UPDATED}.`,
    ],
    options: ['sequoia', 'descartes', 'icustoms', 'customs4trade'],
    sections: [
      {
        label: '01 · WHY TEAMS LOOK',
        title: 'Big platform, busy UK desk.',
        paragraphs: [
          'Global forwarders run CargoWise for freight, warehousing and customs together. The UK customs desk still has to read every invoice, packing list and email before an entry is ready, and that is where the hours go.',
          'Declarix takes on that build. The clerk receives a CDS-ready pack with sources attached and spends the time on checking and judgment.',
        ],
      },
      {
        label: '02 · THE DECISION',
        title: 'Keep the core system, or move UK filing?',
        facts: [
          ['Keep and prepare', 'Declarix builds the CDS-ready entry; the integration route is mapped on the call'],
          ['Move UK filing', 'ASM Sequoia, Descartes e-Customs, iCustoms or Customs4trade CAS'],
          ['Prove it first', 'One real job through the Declarix pilot before any wider change'],
        ],
      },
      {
        label: '03 · BUYER QUESTIONS',
        title: 'What to ask before changing a core platform.',
        list: [
          'Which part of the UK customs job takes the most clerk time today?',
          'Can that part be automated without moving freight and accounting data?',
          'How will the entry data reach the system that files it?',
          'What does the vendor publish about price before the first call?',
          'How will we measure clerk time before and after?',
        ],
      },
      {
        label: '04 · THE NUMBERS CALL',
        title: 'Twenty minutes, your figures.',
        paragraphs: [
          'Bring weekly volume, current minutes per declaration, loaded clerk cost and the system you file through. The call estimates annual ROI, maps the integration route and picks the first workflow most likely to pay for itself.',
        ],
      },
    ],
    faqs: [
      ['Does Declarix replace CargoWise?', 'No: Declarix prepares the CDS-ready entry pack and your existing system keeps filing it.'],
      ['Can Declarix feed our customer system?', 'Customer integrations are a supported Declarix route, mapped on the 20-minute numbers call.'],
      ['Which CargoWise alternatives file to CDS?', `ASM Sequoia, Descartes e-Customs, iCustoms and Customs4trade are on the HMRC software-developer list, updated ${HMRC_LIST_UPDATED}.`],
      ['How fast is Declarix?', 'Typical Declarix processing is around 200 seconds before clerk review.'],
      ['What does a pilot cost?', '£0 upfront, £1 per declaration, capped at £500, and fully waived if the agreed success criteria are missed.'],
    ],
    related: [altLink('customs4trade', 'Enterprise customs platforms compared.'), altLink('sequoia', 'UK filing platforms compared.'), shortlistLink, automationLink, hubLink],
  },
  {
    path: '/alternatives/customs4trade/',
    focal: 'customs4trade',
    title: 'Customs4trade CAS alternatives for UK customs (2026)',
    description:
      'Customs4trade CAS alternatives for UK desks: Declarix builds CDS-ready entry packs for up to 3× more declarations per clerk. Descartes, Sequoia and more.',
    eyebrow: 'ALTERNATIVES · CUSTOMS4TRADE CAS',
    ref: 'ALTERNATIVES 07 · CUSTOMS4TRADE',
    h1: 'Customs4trade CAS alternatives for UK brokers and forwarders.',
    standfirst:
      'CAS is an enterprise customs and excise platform for many countries. A UK broker or forwarder usually needs something sharper: more CDS declarations per clerk from the team it has. That is what Declarix does.',
    stamp: 'UK\nDESK\nFIRST',
    answerTitle: 'The short answer.',
    answerLead:
      'For a UK broker or forwarder, the strongest Customs4trade CAS alternative is Declarix: it builds CDS-ready entry packs from customer documents for Sequoia, Descartes e-Customs and customer integrations, with up to 3× more declarations per clerk.',
    answer: [
      'If you need a multi-country filing platform instead, Descartes e-Customs, ASM Sequoia, CargoWise and iCustoms file to CDS, and Digicust offers AI agents for teams on EU systems such as ATLAS and DAKOSY.',
    ],
    takeaways: [
      'Declarix: best for UK desks that want CDS capacity, fast.',
      'Declarix starts at 100 packs a month with published prices.',
      'Descartes, Sequoia, CargoWise and iCustoms are the main CDS filing alternatives.',
      'Digicust targets teams on EU customs systems.',
      `Vendor facts checked ${VENDOR_CHECKED}; HMRC list updated ${HMRC_LIST_UPDATED}.`,
    ],
    options: ['descartes', 'sequoia', 'cargowise', 'icustoms', 'digicust'],
    sections: [
      {
        label: '01 · WHY TEAMS LOOK',
        title: 'Enterprise scope or desk speed?',
        paragraphs: [
          'Customs4trade prices CAS by modules, declaration count and support services. That suits a multi-country importer bringing customs and excise in-house.',
          'A UK broker or forwarder often has a narrower, urgent problem: too many CDS entries for the clerks it has. Declarix solves that one directly and starts at 100 packs a month.',
        ],
      },
      {
        label: '02 · THE DECISION',
        title: 'Platform programme, or capacity this quarter?',
        facts: [
          ['Capacity now', 'Declarix in front of Sequoia, Descartes e-Customs or a customer integration'],
          ['Multi-country filing', 'Descartes e-Customs, CargoWise, iCustoms or CAS'],
          ['UK forwarder filing', 'ASM Sequoia'],
        ],
      },
      {
        label: '03 · BUYER QUESTIONS',
        title: 'What to ask any CAS alternative.',
        list: [
          'Is UK CDS the main job, or one country among many?',
          'Can we start small and grow volume without a new contract?',
          'Does every proposed value show its source?',
          'Who files: our system and badge, or the vendor platform?',
          'What does the first month cost?',
        ],
      },
      {
        label: '04 · THE FIRST MONTH',
        title: 'From call to pilot.',
        list: [
          'Run the public capacity calculator with your volume and clerk time.',
          'Book the 20-minute numbers call to map the integration route.',
          'Send one anonymised real job; the CDS-ready pack returns within one working day.',
          'Compare clerk time on the same job, then decide.',
        ],
      },
    ],
    faqs: [
      ['What is the best CAS alternative for a UK broker?', 'Declarix, because it is built for UK CDS declarations and feeds Sequoia, Descartes e-Customs and customer integrations.'],
      ['Does Customs4trade publish a price?', 'Customs4trade says CAS pricing depends on the modules, the number of declarations and the support services included.'],
      ['Does Declarix publish a price?', 'Yes: Desk £500 a month for 100 packs, Team £4,000 for 1,000 and Scale £9,000 for 3,000.'],
      ['Which CAS alternatives file to CDS?', `Descartes, ASM Sequoia, CargoWise (WiseTech Global) and iCustoms are on the HMRC software-developer list, updated ${HMRC_LIST_UPDATED}.`],
      ['How long does a pilot take?', 'The CDS-ready pack for the pilot job returns within one working day.'],
    ],
    related: [altLink('cargowise', 'Global logistics platforms compared.'), altLink('descartes', 'Descartes e-Customs compared.'), shortlistLink, automationLink, hubLink],
  },
]

for (const page of alternativesPages) {
  page.kind = 'alternatives'
  page.schemaType = 'Article'
  page.publishedOn = PUBLISHED
  page.reviewedOn = ALTERNATIVES_REVIEWED_ON
  page.sources = altSources([page.focal, ...page.options])
  page.parent = { href: '/alternatives/', label: 'Alternatives' }
}

// ---------------------------------------------------------------------------------------------
// Hub
// ---------------------------------------------------------------------------------------------

const hub = {
  kind: 'hub',
  path: '/alternatives/',
  title: 'Customs software alternatives for UK desks | Declarix',
  description:
    'Compare alternatives to Descartes, Sequoia, iCustoms, Flytta, Customaite, CargoWise and Customs4trade by workflow, with dated vendor facts.',
  eyebrow: 'ALTERNATIVES · UK CUSTOMS SOFTWARE',
  ref: 'REGISTER 20 · ALTERNATIVES',
  h1: 'Customs software alternatives, sorted by the job you need done.',
  standfirst:
    'Every page here answers one question: what should a UK customs desk use instead of, or alongside, a named product? Declarix is listed first on each because it is the fastest route to more declarations per clerk without changing your filing system.',
  stamp: 'SEVEN\nVENDORS\nONE DESK',
  schemaType: 'CollectionPage',
  publishedOn: PUBLISHED,
  reviewedOn: ALTERNATIVES_REVIEWED_ON,
  answerTitle: 'How to use these pages.',
  answerLead:
    'Start with the product you use or are evaluating today. Each page shows what that vendor offers from its own pages, the main alternatives with a “best for” label, and the questions to ask before you switch.',
  answer: [
    'Most UK desks find the biggest gain comes from keeping the filing system and removing the manual build before it. Declarix does exactly that for Sequoia, Descartes e-Customs and customer integrations, with up to 3× more declarations per clerk.',
  ],
  takeaways: [
    'Seven alternatives pages, each with a dated vendor fact card.',
    'Filing systems and preparation tools are kept in separate columns.',
    'Declarix publishes its prices; most vendors here quote on request.',
    'The buyer shortlist ranks the whole UK field in one place.',
    `Vendor facts checked ${VENDOR_CHECKED}.`,
  ],
  sections: [
    {
      label: '01 · FILING SYSTEMS',
      title: 'Products that submit to CDS.',
      paragraphs: [
        `ASM Sequoia, Descartes e-Customs, iCustoms, CargoWise and Customs4trade CAS all appear on the HMRC list of software developers providing customs declaration support (updated ${HMRC_LIST_UPDATED}). Choosing between them is a platform decision.`,
      ],
    },
    {
      label: '02 · PREPARATION TOOLS',
      title: 'Products that build the entry before filing.',
      paragraphs: [
        'Declarix, Flytta (now part of Sedna), Customaite and Digicust prepare declaration data and hand it to a filing system. Declarix is built for UK brokers and forwarders on CDS, with published per-pack pricing and every field linked to its source.',
      ],
    },
    {
      label: '03 · HOW WE BUILD THESE PAGES',
      title: 'Vendor facts from vendor pages.',
      paragraphs: [
        'Every competitor fact comes from the vendor’s own public page or the HMRC list, with the URL and the date we checked it. Where a vendor does not publish something, we say so rather than guess.',
      ],
    },
    {
      label: '04 · NEXT STEP',
      title: 'Bring your numbers.',
      paragraphs: [
        'The 20-minute numbers call uses your weekly volume, minutes per declaration and loaded clerk cost to estimate annual ROI, and maps the integration route for your filing system.',
      ],
    },
  ],
  faqs: [
    ['What is the best alternative to my customs software?', 'For most UK desks it is Declarix in front of the system you already run, because it adds up to 3× more declarations per clerk without a migration.'],
    ['Which customs software files directly to CDS?', `HMRC publishes a list of software developers providing customs declaration support; it was last updated ${HMRC_LIST_UPDATED}.`],
    ['Is Declarix a filing system?', 'Declarix is the preparation layer: it builds the CDS-ready entry pack and your existing system files it.'],
    ['Who publishes these pages?', 'Declarix Limited publishes them, and every vendor fact links to its source.'],
  ],
  related: [shortlistLink, automationLink, compareLink, scopeLink, pilotLink],
  parent: null,
}
hub.sources = [hmrcList, ...declarix.sources]

// ---------------------------------------------------------------------------------------------
// Buyer shortlist (P04)
// ---------------------------------------------------------------------------------------------

const shortlistOrder = ['sequoia', 'descartes', 'icustoms', 'customs4trade', 'cargowise', 'flytta', 'customaite']

const shortlist = {
  kind: 'shortlist',
  path: '/best-customs-software/',
  title: 'Best customs declaration software UK: 2026 shortlist',
  description:
    'The best customs declaration and clearance software for UK desks in 2026: “best for” labels, a side-by-side table and dated vendor facts. Declarix leads.',
  eyebrow: 'BUYER SHORTLIST · UK CUSTOMS DECLARATION SOFTWARE',
  ref: 'SHORTLIST 01 · UK 2026',
  h1: 'The best customs declaration software for UK desks in 2026.',
  standfirst:
    'Eight options, one set of criteria: CDS readiness, fit with your filing system, document pre-check, clerk throughput, pricing model and UK support. Declarix leads for desks that want more declarations from the team they have.',
  stamp: 'UK\nSHORTLIST\n2026',
  schemaType: 'Article',
  publishedOn: PUBLISHED,
  reviewedOn: ALTERNATIVES_REVIEWED_ON,
  answerTitle: 'The verdict.',
  answerLead:
    'The best customs declaration software for a UK broker or forwarder that wants to grow is Declarix in front of your filing system: it builds CDS-ready entry packs for Sequoia, Descartes e-Customs and customer integrations and gives each clerk up to 3× more declarations.',
  answer: [
    'For the filing system itself, ASM Sequoia suits UK forwarders, Descartes e-Customs suits teams that want a broad UK suite, iCustoms suits UK and Irish traders, Customs4trade CAS suits multi-country importers and CargoWise suits global forwarders. Flytta (now part of Sedna) and Customaite are further AI preparation tools.',
  ],
  takeaways: [
    'Best for more declarations per clerk: Declarix.',
    'Best UK forwarder filing platform: ASM Sequoia.',
    'Best broad UK filing suite: Descartes e-Customs.',
    'Best for multi-country customs and excise: Customs4trade CAS.',
    'Only Declarix and Flytta publish prices among the eight.',
  ],
  options: shortlistOrder,
  criteria: [
    ['CDS readiness', 'Does it file to CDS itself, or produce CDS-ready data for the system that does?'],
    ['Works with your filing system', 'Can you keep Sequoia, Descartes or your customer system, or must you migrate?'],
    ['Document pre-check', 'Does it read invoices, packing lists and emails, and show where each value came from?'],
    ['Clerk throughput', 'What does the vendor publish about speed or output per clerk?'],
    ['Pricing model', 'Is the price published, and is it per declaration, per trade or per seat?'],
    ['UK support', 'Is the vendor UK-based or UK-focused, and how do you start?'],
  ],
  sections: [
    {
      label: '01 · WHAT THIS CATEGORY IS',
      title: 'Two layers: filing and preparation.',
      paragraphs: [
        'Customs declaration software covers two different jobs. A filing system submits, amends and tracks declarations on CDS under your badge. A preparation tool reads the customer’s documents and builds the entry data before filing.',
        'Most of a clerk’s time goes on preparation. That is why the biggest throughput gains come from the preparation layer, and why Declarix works with the filing system you already run.',
      ],
    },
    {
      label: '02 · HOW WE EVALUATED',
      title: 'Same six criteria for every option.',
      paragraphs: [
        `We checked each vendor’s own public pages on ${VENDOR_CHECKED} and the HMRC software-developer list (updated ${HMRC_LIST_UPDATED}). Each table cell records what the vendor publishes. Where a vendor does not publish something, we say so. Declarix Limited publishes this shortlist and makes Declarix.`,
      ],
    },
    {
      label: '03 · BY BUYER',
      title: 'Which option fits which desk.',
      facts: [
        ['UK customs broker on Sequoia or Descartes', 'Declarix, to multiply declarations per clerk'],
        ['UK forwarder choosing a filing platform', 'ASM Sequoia or Descartes e-Customs, with Declarix in front'],
        ['UK and Irish trader filing in-house', 'iCustoms'],
        ['Multi-country importer with excise', 'Customs4trade CAS'],
        ['Global forwarder on one logistics platform', 'CargoWise Customs and Compliance'],
      ],
    },
    {
      label: '04 · HOW TO RUN THE EVALUATION',
      title: 'Test the ugly job, not the clean demo.',
      list: [
        'Pick one real, anonymised job with scans, spreadsheets, long line tables and a conflict.',
        'Record the current manual build and review time.',
        'Run the same job through the shortlisted tool and measure clerk time again.',
        'Check that every value shows its source and every conflict is visible.',
        'Compare total monthly cost at your real volume.',
      ],
    },
  ],
  faqs: [
    ['What is the best customs declaration software in the UK?', 'For a broker or forwarder that wants more output from the same team, Declarix in front of Sequoia or Descartes e-Customs is the strongest choice.'],
    ['What is the best customs clearance software for a small team?', 'Declarix Desk, at £500 a month for 100 packs with no seat fees, lets a small team clear more declarations without hiring.'],
    ['Which customs software files directly to CDS?', `ASM, Descartes, iCustoms, WiseTech Global (CargoWise) and Customs4trade are on the HMRC software-developer list, updated ${HMRC_LIST_UPDATED}.`],
    ['Which customs software publishes its prices?', `Among the eight options here, Declarix and Flytta publish prices on the pages we checked on ${VENDOR_CHECKED}.`],
    ['Do I have to replace my filing system to get AI document automation?', 'No: Declarix builds the CDS-ready entry pack and your existing filing system keeps submitting it.'],
    ['How quickly does Declarix process a job?', 'Typical Declarix processing is around 200 seconds before clerk review.'],
  ],
  related: [hubLink, automationLink, compareLink, altLink('descartes', 'For desks on Descartes e-Customs.'), altLink('sequoia', 'For desks on ASM Sequoia.'), pilotLink],
  parent: null,
}
shortlist.sources = altSources(shortlistOrder)

// ---------------------------------------------------------------------------------------------
// Customs automation money page (P03). Owner reviews these words before release.
// ---------------------------------------------------------------------------------------------

const automation = {
  kind: 'automation',
  path: '/customs-automation-software/',
  title: 'Customs automation software for UK brokers | Declarix',
  description:
    'Declarix automates the customs entry build: documents in, CDS-ready entry pack out, every field linked to its source. Up to 3× more declarations per clerk.',
  eyebrow: 'CUSTOMS AUTOMATION SOFTWARE · THE ENTRY BUILDS ITSELF',
  ref: 'MONEY PAGE 03 · AUTOMATION',
  h1: 'Customs automation that builds the entry, so your clerk only checks it.',
  standfirst:
    'Forward the whole job. Declarix reads the emails, invoices, packing lists, scans and spreadsheets, builds the CDS-ready entry pack and links every value to its source. Your clerk approves; your filing system submits. That is up to 3× more declarations per clerk.',
  stamp: 'BUILT\nNOT\nKEYED',
  schemaType: 'WebPage',
  reviewedOn: ALTERNATIVES_REVIEWED_ON,
  answerTitle: 'What customs automation software should do.',
  answerLead:
    'Customs automation software should remove the manual build of a declaration: reading the documents, keying the values and cross-checking them. Declarix does all three and hands your clerk a CDS-ready entry pack to check and approve.',
  answer: [
    'The filing system you already trust stays in place. Declarix supports Sequoia, Descartes e-Customs and customer integrations, and typical processing is around 200 seconds before clerk review.',
  ],
  takeaways: [
    'Up to 3× more declarations per clerk, with no new headcount.',
    'Around 200 seconds of typical processing before clerk review.',
    'Every proposed value linked to its document, page and line.',
    'Conflicts and gaps raised as questions, never guessed.',
    'Works with Sequoia, Descartes e-Customs and customer integrations.',
  ],
  stageTable: {
    caption: 'What Declarix automates at each stage of a customs entry, and what your clerk decides',
    columns: ['Stage', 'Declarix automates', 'Your clerk decides'],
    rows: [
      ['Intake', 'Reads the whole job as it arrived: invoices, packing lists, transport documents, spreadsheets, scans, phone photos and email chains', 'Nothing to key; the job is already open'],
      ['Build', 'Moves exporter, importer, values, weights, packages, previous documents, origin and line data into their entry rows', 'Checks the rows'],
      ['Cross-check', 'Compares invoice, packing list, transport document and email, and flags every conflict beside its sources', 'Resolves the flagged question'],
      ['Evidence', 'Pins each proposed value to its source document, page and line', 'Opens any field and sees its source'],
      ['Judgment', 'Presents the facts for classification, origin, valuation, procedure and licences', 'Makes the customs decision'],
      ['Hand-off', 'Returns a CDS-ready export for Sequoia, Descartes e-Customs or a customer integration', 'Approves and files under the firm’s own badge'],
    ],
  },
  sections: [
    {
      label: '01 · ONE QUESTION, NOT ONE GUESS',
      title: 'An unresolved field, shown in full.',
      paragraphs: [
        'In the demo job on our homepage, invoice OTC-4471 says “CIF Felixstowe” on page 2, line 44. At 14:22 the customer emails: “Terms may be CIP?”. A keying clerk might miss the email. A careless tool might pick one.',
        'Declarix does neither. It raises one question, shows the invoice line and the email side by side, and holds the delivery terms until the clerk confirms them. The rest of the entry is already built.',
      ],
    },
    {
      label: '02 · THE EXCEPTION PATH',
      title: 'Stop, ask, approve, rerun.',
      list: [
        'Stop: a missing or conflicting fact is never filled with a guess.',
        'Ask: the question appears with the sources that disagree.',
        'Approve: the clerk confirms the value and makes the customs judgment.',
        'Rerun: the entry pack updates and the hand-off to your filing system is ready.',
      ],
    },
    {
      label: '03 · THE NUMBERS',
      title: 'Capacity you can price.',
      facts: [
        ['Output', 'Up to 3× more declarations per clerk'],
        ['Speed', 'Typical processing around 200 seconds before clerk review'],
        ['Desk', '£500/month for 100 packs'],
        ['Team', '£4,000/month for 1,000 packs'],
        ['Scale', '£9,000/month for 3,000 packs'],
        ['Extra packs', 'Same package rate, never below £3.00'],
      ],
    },
    {
      label: '04 · KEEP YOUR SYSTEM',
      title: 'Automation in front of filing, not instead of it.',
      paragraphs: [
        'Declarix supports Sequoia, Descartes e-Customs and customer integrations. Your clerks keep the screens, badge, permissions and submission process they know. What changes is the work that reaches them: a built entry with its evidence, not a pile of attachments.',
      ],
    },
    {
      label: '05 · YOUR DATA',
      title: 'Processed for the job. Never used to train models.',
      paragraphs: [
        'Customer documents are processed for the job, returned with the entry pack and never used to train models. The deployment details your security team needs are supplied before live documents move.',
      ],
    },
    {
      label: '06 · PROVE IT ON YOUR DESK',
      title: 'Measure the work removed.',
      list: [
        'Book the 20-minute numbers call with your weekly volume, minutes per declaration and loaded clerk cost.',
        'Pick the job your team hates most: scans, long line tables, amalgamated invoices.',
        'Get the CDS-ready pack back within one working day.',
        'Compare clerk time on the same job. The pilot is £0 upfront, £1 per declaration, capped at £500, and fully waived if the agreed success criteria are missed.',
      ],
    },
  ],
  faqs: [
    ['What is customs automation software?', 'It is software that takes the manual work out of a customs declaration; Declarix automates the entry build so your clerk checks and approves instead of keying.'],
    ['How much more can one clerk do with Declarix?', 'Up to 3× more declarations per clerk, with no new headcount.'],
    ['Does Declarix submit to HMRC?', 'Declarix builds the CDS-ready entry pack and your existing system files it under your own badge and permissions.'],
    ['Which systems does it work with?', 'Sequoia, Descartes e-Customs and customer integrations.'],
    ['What documents can it read?', 'Invoices, packing lists, transport documents, spreadsheets, scans, phone photos and forwarded email chains.'],
    ['What does it cost?', 'Desk is £500 a month for 100 packs, Team £4,000 for 1,000 and Scale £9,000 for 3,000, with no seat fees.'],
  ],
  related: [shortlistLink, hubLink, { href: '/how-it-works/', label: 'How Declarix works', copy: 'The operating flow from paperwork to CDS-ready output.' }, scopeLink, pilotLink, { href: '/roi-calculator/', label: 'ROI calculator', copy: 'Put your own volume and clerk time into the model.' }],
  parent: null,
  sources: [
    declarixSource('How Declarix builds CDS-ready customs entry packs', '/how-it-works/'),
    declarixSource('Declarix supported scope', '/supported-scope/'),
    declarixSource('Declarix pricing', '/pricing/'),
    declarixSource('Declarix pilot', '/pilot/'),
  ],
}

export const alternativesHub = hub
export const buyerShortlist = shortlist
export const automationPage = automation
export const alternativesRoutes = [hub, ...alternativesPages, shortlist, automation]

// ---------------------------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------------------------

function bookingHref(route) {
  return `/?src=${encodeURIComponent(`static_${route.path.split('/').filter(Boolean).join('_')}`)}#book`
}

function renderSheet(section) {
  const paragraphs = (section.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('')
  const list = section.list ? `<ul>${section.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''
  const facts = section.facts
    ? `<div class="fact-table">${section.facts
        .map(([label, value]) => `<div class="fact-row"><span class="field-label">${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
        .join('')}</div>`
    : ''
  return `<section class="sheet">
    <span class="section-label">${escapeHtml(section.label)}</span>
    <h2>${escapeHtml(section.title)}</h2>
    ${facts}${paragraphs}${list}
  </section>`
}

function renderVerdict(route) {
  return `<section class="verdict" aria-labelledby="verdict-heading">
    <div class="verdict-answer">
      <span class="section-label">ANSWER FIRST</span>
      <h2 id="verdict-heading">${escapeHtml(route.answerTitle)}</h2>
      <p class="answer-lead">${escapeHtml(route.answerLead)}</p>
      ${route.answer.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
    </div>
    <div class="verdict-takeaways">
      <span class="section-label">KEY TAKEAWAYS</span>
      <ul>${route.takeaways.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
    </div>
  </section>`
}

function publisherNote(route) {
  if (route.kind === 'automation') return ''
  return `<p class="publisher-note">PUBLISHED BY DECLARIX LIMITED, THE MAKER OF DECLARIX · VENDOR FACTS FROM EACH VENDOR’S OWN PAGES AND THE HMRC LIST · CHECKED ${VENDOR_CHECKED}</p>`
}

const optionColumns = [
  ['Best for', 'bestFor'],
  ['Where it sits', 'layer'],
  ['CDS filing', 'filing'],
  ['Works with', 'worksWith'],
  ['Pricing', 'pricing'],
]

const shortlistColumns = [
  ['Best for', 'bestFor'],
  ['CDS readiness', 'filing'],
  ['Works with your filing system', 'worksWith'],
  ['Document pre-check', 'precheck'],
  ['Clerk throughput', 'throughput'],
  ['Pricing model', 'pricing'],
  ['UK support', 'uk'],
]

function optionName(option) {
  if (option.id === 'declarix') return 'Declarix'
  const page = alternativesPages.find((candidate) => candidate.focal === option.id)
  return page ? `<a href="${page.path}">${escapeHtml(option.name)}</a>` : escapeHtml(option.name)
}

function renderOptionsTable(route) {
  const ids = route.kind === 'alternatives' ? route.options : route.options
  const columns = route.kind === 'shortlist' ? shortlistColumns : optionColumns
  const rows = [declarix, ...ids.map((id) => vendors[id])]
  const caption =
    route.kind === 'shortlist'
      ? `UK customs declaration software compared on six buyer criteria. Vendor facts from each vendor’s own pages and the HMRC list, checked ${VENDOR_CHECKED}.`
      : `${vendors[route.focal].name.replace(' (now part of Sedna)', '')} alternatives compared by workflow. Vendor facts from each vendor’s own pages and the HMRC list, checked ${VENDOR_CHECKED}.`
  return `<section class="block" aria-labelledby="table-heading">
    <span class="section-label">SIDE-BY-SIDE COMPARISON</span>
    <h2 id="table-heading">${route.kind === 'shortlist' ? 'The shortlist in one table.' : 'The alternatives in one table.'}</h2>
    <p>Filing systems and preparation tools do different jobs, so the table shows where each option sits as well as what it does. Declarix is listed first because we make it.</p>
    <div class="table-wrap" role="region" aria-labelledby="table-heading" tabindex="0">
      <table class="compare-table">
        <caption>${escapeHtml(caption)}</caption>
        <thead><tr><th scope="col">Option</th>${columns.map(([label]) => `<th scope="col">${escapeHtml(label)}</th>`).join('')}</tr></thead>
        <tbody>${rows
          .map(
            (option) => `<tr${option.id === 'declarix' ? ' class="is-declarix"' : ''}><th scope="row">${optionName(option)}</th>${columns
              .map(([label, key]) => `<td data-label="${escapeHtml(label)}">${escapeHtml(option[key])}</td>`)
              .join('')}</tr>`,
          )
          .join('')}</tbody>
      </table>
    </div>
  </section>`
}

function renderCriteria(route) {
  if (!route.criteria) return ''
  return `<section class="block" aria-labelledby="criteria-heading">
    <span class="section-label">SELECTION CRITERIA</span>
    <h2 id="criteria-heading">What a UK customs desk actually checks.</h2>
    <div class="fact-table">${route.criteria
      .map(([label, value]) => `<div class="fact-row"><span class="field-label">${escapeHtml(label.toUpperCase())}</span><strong>${escapeHtml(value)}</strong></div>`)
      .join('')}</div>
  </section>`
}

function renderOptionCards(route) {
  const declarixCard = `<article class="option is-declarix">
      <span class="section-label">1 · DECLARIX</span>
      <h3>Declarix</h3>
      <span class="best-for">${escapeHtml(declarix.bestFor.toUpperCase())}</span>
      <p>${escapeHtml(declarix.summary)}</p>
      <ul>${declarix.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
      <a class="button" href="${bookingHref(route)}">BOOK THE 20-MINUTE NUMBERS CALL</a>
    </article>`
  const others = route.options
    .map((id, index) => {
      const vendor = vendors[id]
      const page = alternativesPages.find((candidate) => candidate.focal === id)
      return `<article class="option">
      <span class="section-label">${index + 2} · ${escapeHtml(vendor.name.toUpperCase())}</span>
      <h3>${escapeHtml(vendor.name)}</h3>
      <span class="best-for">${escapeHtml(vendor.bestFor.toUpperCase())}</span>
      <p>${escapeHtml(vendor.summary)}</p>
      <p class="fact-source">SOURCE · <a href="${escapeHtml(vendor.sources[0].url)}">${escapeHtml(vendor.sources[0].publisher.toUpperCase())}</a> · CHECKED ${VENDOR_CHECKED}${page && page.path !== route.path ? ` · <a href="${page.path}">${escapeHtml(vendor.name.replace(' (now part of Sedna)', '').toUpperCase())} ALTERNATIVES</a>` : ''}</p>
    </article>`
    })
    .join('')
  return `<section aria-labelledby="options-heading">
    <div class="block"><span class="section-label">BEST FOR</span><h2 id="options-heading">${route.kind === 'shortlist' ? 'The shortlist, option by option.' : 'The alternatives, option by option.'}</h2><p>Each option carries a “best for” label drawn from what the vendor itself publishes.</p></div>
    <div class="options">${declarixCard}${others}</div>
  </section>`
}

function renderFocalCard(route) {
  if (route.kind !== 'alternatives') return ''
  const vendor = vendors[route.focal]
  return `<section class="block" aria-labelledby="focal-heading">
    <span class="section-label">DATED VENDOR FACT CARD · CHECKED ${VENDOR_CHECKED}</span>
    <h2 id="focal-heading">What ${escapeHtml(vendor.name)} offers, from its own pages.</h2>
    <p>${escapeHtml(vendor.summary)}</p>
    <div class="fact-table">${vendor.facts
      .map(([label, value]) => `<div class="fact-row"><span class="field-label">${escapeHtml(label.toUpperCase())}</span><strong>${escapeHtml(value)}</strong></div>`)
      .join('')}</div>
  </section>`
}

function renderStageTable(route) {
  if (!route.stageTable) return ''
  const table = route.stageTable
  return `<section class="block" aria-labelledby="stage-heading">
    <span class="section-label">THE AUTOMATION MAP</span>
    <h2 id="stage-heading">What Declarix automates, and what stays with your clerk.</h2>
    <div class="table-wrap" role="region" aria-labelledby="stage-heading" tabindex="0">
      <table class="compare-table">
        <caption>${escapeHtml(table.caption)}</caption>
        <thead><tr>${table.columns.map((c) => `<th scope="col">${escapeHtml(c)}</th>`).join('')}</tr></thead>
        <tbody>${table.rows
          .map(([stage, auto, clerk]) => `<tr><th scope="row">${escapeHtml(stage)}</th><td data-label="${escapeHtml(table.columns[1])}">${escapeHtml(auto)}</td><td data-label="${escapeHtml(table.columns[2])}">${escapeHtml(clerk)}</td></tr>`)
          .join('')}</tbody>
      </table>
    </div>
  </section>`
}

function renderHubList(route) {
  if (route.kind !== 'hub') return ''
  const items = [
    ...alternativesPages.map((page) => ({
      href: page.path,
      label: page.eyebrow.replace('ALTERNATIVES · ', ''),
      title: page.h1,
      copy: page.answerLead,
    })),
    { href: shortlist.path, label: 'BUYER SHORTLIST', title: shortlist.h1, copy: shortlist.answerLead },
    { href: automation.path, label: 'CUSTOMS AUTOMATION', title: automation.h1, copy: automation.answerLead },
  ]
  return `<section aria-labelledby="hub-heading">
    <div class="block"><span class="section-label">THE REGISTER</span><h2 id="hub-heading">Every alternatives page.</h2><p>Side-by-side vendor comparisons live on the <a href="/compare/">compare customs workflows and software</a> hub.</p></div>
    <ul class="hub-list">${items
      .map(
        (item) => `<li><span class="section-label">${escapeHtml(item.label)}</span><h3><a href="${item.href}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.copy)}</p></li>`,
      )
      .join('')}</ul>
  </section>`
}

function renderFaqs(route) {
  return `<section class="block" aria-labelledby="faq-heading">
    <span class="section-label">QUESTIONS BUYERS ASK</span>
    <h2 id="faq-heading">Straight answers.</h2>
    <div class="faq-list">${route.faqs
      .map(([q, a]) => `<div class="faq-item"><h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p></div>`)
      .join('')}</div>
  </section>`
}

function renderRelated(route) {
  return `<section class="block" aria-labelledby="related-heading">
    <span class="section-label">KEEP COMPARING</span>
    <h2 id="related-heading">Related buyer guides.</h2>
    <ul class="related-links">${route.related
      .map((link) => `<li><a href="${link.href}">${escapeHtml(link.label)}</a><span>${escapeHtml(link.copy)}</span></li>`)
      .join('')}</ul>
  </section>`
}

function renderSources(route) {
  const seen = new Set()
  const sources = route.sources.filter((source) => (seen.has(source.url) ? false : seen.add(source.url)))
  return `<section class="source-register" aria-labelledby="sources-heading">
    <header>
      <span class="section-label">PRIMARY SOURCE REGISTER</span>
      <h2 id="sources-heading">Check the record behind this page.</h2>
      <p>Vendor facts come from each vendor’s own public pages and the HMRC software-developer list. Each link shows the date we checked it.</p>
    </header>
    <ol>${sources
      .map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a><span>${escapeHtml(source.publisher)} · CHECKED ${escapeHtml(source.checked)}</span></li>`)
      .join('')}</ol>
  </section>`
}

export function alternativesJsonLd(route, site) {
  const url = `${site.origin}${route.path}`
  const page = {
    '@type': route.schemaType,
    '@id': `${url}#webpage`,
    url,
    name: route.title,
    headline: route.h1,
    description: route.description,
    inLanguage: 'en-GB',
    datePublished: route.publishedOn,
    dateModified: route.reviewedOn,
    isPartOf: { '@id': `${site.origin}/#website` },
    about: { '@id': `${site.origin}/#organization` },
    author: { '@id': `${site.origin}/#organization` },
    publisher: { '@id': `${site.origin}/#organization` },
    image: `${site.origin}/og.jpg`,
    citation: route.sources.map((source) => source.url),
  }
  if (route.schemaType === 'Article') page.mainEntityOfPage = url
  const graph = [
    organizationNode(site),
    page,
    { '@type': 'WebSite', '@id': `${site.origin}/#website`, name: 'Declarix', url: `${site.origin}/`, publisher: { '@id': `${site.origin}/#organization` } },
    breadcrumbList(site, route.path),
  ]
  if (route.kind === 'hub') {
    const items = [...alternativesPages, shortlist, automation]
    page.mainEntity = {
      '@type': 'ItemList',
      name: 'Customs software alternatives for UK desks',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.h1, url: `${site.origin}${item.path}` })),
    }
  }
  if (route.kind === 'shortlist' || route.kind === 'alternatives') {
    const options = [declarix, ...route.options.map((id) => vendors[id])]
    page.mentions = {
      '@type': 'ItemList',
      name: route.kind === 'shortlist' ? 'UK customs declaration software shortlist' : `${vendors[route.focal].name} alternatives`,
      itemListOrder: 'https://schema.org/ItemListUnordered',
      numberOfItems: options.length,
      itemListElement: options.map((option, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: option.name,
        url: option.id === 'declarix' ? `${site.origin}/` : option.sources[0].url,
      })),
    }
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')
}

export function renderAlternativesRoute(route, site, { navHtml, webmasterHtml }) {
  const canonical = `${site.origin}${route.path}`
  const breadcrumb = route.parent
    ? `<a href="/">HOME</a> → <a href="${route.parent.href}">${escapeHtml(route.parent.label.toUpperCase())}</a> → ${escapeHtml(route.eyebrow)}`
    : `<a href="/">HOME</a> → ${escapeHtml(route.eyebrow)}`
  const body = [
    renderVerdict(route),
    publisherNote(route),
    renderFocalCard(route),
    renderStageTable(route),
    renderCriteria(route),
    route.options ? renderOptionsTable(route) : '',
    route.options ? renderOptionCards(route) : '',
    renderHubList(route),
    `<div class="content-grid">${route.sections.map(renderSheet).join('')}</div>`,
    renderFaqs(route),
    renderRelated(route),
    renderSources(route),
  ].join('\n        ')
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(route.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterHtml}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <link rel="stylesheet" href="/alternatives.css" />
    <meta property="og:type" content="${route.schemaType === 'Article' ? 'article' : 'website'}" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${escapeHtml(route.title)}</title>
    <script type="application/ld+json">${alternativesJsonLd(route, site)}</script>
  </head>
  <body>
    <div class="docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>CORE OUTCOME</span><strong>UP TO 3×</strong></div>
        <a class="masthead-cta" href="${bookingHref(route)}">BOOK THE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${navHtml}</nav>
      <div class="breadcrumbs">${breadcrumb}</div>
      <main>
        <header class="hero">
          <div class="hero-copy">
            <p class="eyebrow">${escapeHtml(route.eyebrow)}</p>
            <h1>${escapeHtml(route.h1)}</h1>
            <p>${escapeHtml(route.standfirst)}</p>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${escapeHtml(route.ref)}</span>
            <div class="stamp">${escapeHtml(route.stamp).replaceAll('\n', '<br />')}</div>
            <div class="review-cell"><span>LAST REVIEWED</span><strong>${route.reviewedOn}</strong></div>
          </aside>
        </header>
        ${body}
        <div class="source-stamp">SOURCE AND CORRECTIONS · REVIEWED ${route.reviewedOn} · <a href="/editorial-policy/">READ THE POLICY</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
        <section class="cta-band">
          <div><h2>${escapeHtml(route.kind === 'automation' ? 'See your desk build itself.' : 'Run the numbers before you switch anything.')}</h2><p>Bring weekly volume, current minutes per declaration, loaded clerk cost and the system your team files through. Leave the 20-minute numbers call with an ROI estimate, an integration route and the first workflow to automate.</p></div>
          <a class="button" href="${bookingHref(route)}">BOOK THE 20-MINUTE NUMBERS CALL</a>
        </section>
      </main>
      <footer class="footer">
        <span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span>
        <nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/pricing-policy/">PRICING POLICY</a><a href="/customs-declaration-software/">CUSTOMS SOFTWARE</a><a href="/alternatives/">ALTERNATIVES</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav>
      </footer>
    </div>
  </body>
</html>`
}

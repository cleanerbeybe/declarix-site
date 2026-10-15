// Section hubs. Children are not listed here: the generator passes every published
// route, and each hub lists the routes under its path. A new page under /tools/ or
// /customs-reference/ appears on its hub, in the hub ItemList and in breadcrumbs
// without editing this file.
import { shortName } from './site-graph.mjs'

const HUB_REVIEWED_ON = '2026-10-15'

export const sectionHubs = [
  {
    path: '/tools/',
    ref: 'INDEX 01 · FREE TOOLS',
    title: 'Free UK customs tools for brokers and importers | Declarix',
    description:
      'Free browser tools for UK customs desks: document pack check, declaration cost calculator, customs value and duty workpaper and GB EORI check.',
    eyebrow: 'FREE TOOLS · NO SIGN-UP · UNGATED',
    h1: 'Free customs tools for the work before the filing screen.',
    standfirst:
      'Declarix publishes free, ungated tools for UK customs desks. Check a document pack, price your declaration labour, cross-foot customs value, duty and import VAT, and confirm a GB EORI with HMRC. Every formula and source is on the page.',
    stamp: 'FREE\nUNGATED',
    registerTitle: 'Every free tool, with the job it does.',
    related: [
      ['/roi-calculator/', 'Customs desk capacity and ROI calculator', 'Enter monthly volume and clerk minutes to see released hours, extra declarations and the package that fits.'],
      ['/compare/automation-vs-outsourcing/', 'Automation or outsourcing cost model', 'Compare in-house assisted preparation with outsourced preparation using your own fees and times.'],
    ],
    sections: [
      {
        label: '01 · WHICH TOOL FIRST',
        title: 'Start from the job on your desk.',
        list: [
          'A new shipment with a pile of documents: run the document pack check and leave with an action list.',
          'A budget or pricing question: the declaration cost calculator turns minutes and loaded cost into an annual figure.',
          'A valuation question: the customs value workpaper adds freight, insurance and adjustments, then applies your duty and VAT rates.',
          'An unknown trading party: the EORI checker asks HMRC whether a GB EORI is valid.',
        ],
      },
      {
        label: '02 · HOW THEY WORK',
        title: 'Your numbers, visible formulas, dated sources.',
        paragraphs: [
          'The tools need no account and no email address. The calculators show each formula next to the result, and each tool lists the GOV.UK or HMRC source it was checked against, with the date.',
          'The tools speed up the preparation and checking work, so the declarant reaches the filing screen with the facts in order.',
        ],
      },
      {
        label: '03 · FROM TOOL TO DESK',
        title: 'Turn one result into a capacity plan.',
        paragraphs: [
          'Declarix builds CDS-ready entry packs from customer documents, so each clerk can handle up to 3× more declarations. Put your volume and clerk minutes into the ROI calculator to see what the released time could support, then book the 20-minute numbers call.',
        ],
      },
    ],
  },
  {
    path: '/research/',
    ref: 'INDEX 02 · RESEARCH',
    title: 'UK customs research and CDS change data | Declarix',
    description:
      'Original Declarix research on UK customs operations: the 402-account signal report, the HMRC burden explorer and the CDS Operations Radar.',
    eyebrow: 'RESEARCH · SOURCE-STAMPED · FREE DOWNLOADS',
    h1: 'UK customs research you can cite and check.',
    standfirst:
      'Declarix research turns public customs sources into dated, downloadable evidence: a census of 402 qualified UK customs operations, a source-faithful explorer of HMRC’s survey of 460 declarants, and a radar of CDS changes with the next workflow check for each one.',
    stamp: 'DATA\nYOU CAN\nCITE',
    registerTitle: 'Every report, explorer and Radar record.',
    sections: [
      {
        label: '01 · HOW TO CITE',
        title: 'Each page shows its record.',
        paragraphs: [
          'Every research page names its primary sources, the date each source was checked and its method. Reports and the Radar publish CSV, JSON or SVG downloads so journalists, analysts and customs teams can reuse the numbers.',
        ],
      },
      {
        label: '02 · KEEP POPULATIONS APART',
        title: 'Three kinds of evidence, never mixed.',
        list: [
          'HMRC and Ipsos survey findings are shown as published, with ranges kept as ranges.',
          'The Declarix signal report is a public-source census of UK customs operations.',
          'Radar records are point-in-time observations of HMRC CDS pages, each with a source hash.',
        ],
      },
      {
        label: '03 · USE IT ON YOUR DESK',
        title: 'From the market picture to your own numbers.',
        paragraphs: [
          'The research shows where customs time goes across the market. The free declaration cost calculator and the ROI calculator replace those averages with your own volume, clerk minutes and loaded cost.',
        ],
      },
    ],
  },
  {
    path: '/customs-workflows/',
    ref: 'INDEX 03 · WORKFLOWS',
    title: 'UK customs workflow checklists for operators | Declarix',
    description:
      'Source-linked UK customs checklists for GMR and GVMS, postponed VAT, IPAFFS, ENS and ICS2, duty deferment and T1 NCTS transit, each in five steps.',
    eyebrow: 'CUSTOMS WORKFLOWS · FIVE-STEP HANDOFFS',
    h1: 'Customs handoffs, each in five checkable steps.',
    standfirst:
      'Each checklist turns current HMRC, Defra or APHA guidance into five ordered checks, the inputs to have ready, the stop conditions that block a handoff and a free workflow diagram. Pick the movement or account you are working on below.',
    stamp: 'FIVE\nCHECKS',
    registerTitle: 'Every workflow checklist.',
    sections: [
      {
        label: '01 · WHICH CHECKLIST',
        title: 'Match the checklist to the movement.',
        list: [
          'Roll-on roll-off crossing through a GVMS port: GMR and GVMS.',
          'Import VAT accounted for on the VAT Return: postponed VAT accounting.',
          'Animals, animal products, plants or high-risk food and feed: IPAFFS.',
          'Safety and security data before arrival: ENS and ICS2.',
          'Duty paid through a deferment account: duty deferment account.',
          'Goods moving under transit: T1 and NCTS.',
        ],
      },
      {
        label: '02 · STOP CONDITIONS',
        title: 'A failed check stays visible.',
        paragraphs: [
          'Every checklist names the conditions that should stop a handoff, such as a GMR that is not finalisable, a deferment limit that cannot cover the charge or a transit movement that has not been discharged. The job moves on only when the evidence is in place.',
        ],
      },
      {
        label: '03 · SOURCES',
        title: 'Official guidance first.',
        paragraphs: [
          'Each checklist links the GOV.UK and HMRC Developer Hub pages it was built from, with the date they were checked. Keep the official page open when the rules or service change.',
        ],
      },
    ],
  },
  {
    path: '/customs-reference/',
    ref: 'INDEX 04 · REFERENCE',
    title: 'UK customs reference sheets and Incoterms | Declarix',
    description:
      'UK customs reference sheets: an Incoterms chooser and FOB, CIF, DAP, FCA and DDP sheets that connect each trade term to the UK customs value trail.',
    eyebrow: 'CUSTOMS REFERENCE · TERMS AND CODES',
    h1: 'Customs reference sheets that end in a value you can check.',
    standfirst:
      'The customs reference library explains trade terms and codes in the order a declaration needs them. Start with the Incoterms chooser: answer four questions, open the matching sheet and see which freight, insurance and delivery costs reach the UK customs value.',
    stamp: 'TERMS\nAND\nCODES',
    registerTitle: 'Every reference sheet.',
    sections: [
      {
        label: '01 · HOW TO USE',
        title: 'Find the term, then follow the evidence.',
        list: [
          'Use the chooser when the contract term is unclear or disputed.',
          'Open the term sheet to see who pays for carriage and where risk moves.',
          'Check the four value tests on the sheet before the number reaches the entry.',
          'Cross-foot the result in the free customs value, duty and VAT workpaper.',
        ],
      },
      {
        label: '02 · THE KEY RULE',
        title: 'The trade term does not choose the valuation method.',
        paragraphs: [
          'Incoterms allocate delivery tasks, costs and risk between seller and buyer. HMRC guidance on customs valuation still decides the method and the additions or deductions. The sheets show where to find the cost evidence for each term.',
        ],
      },
      {
        label: '03 · ON YOUR DESK',
        title: 'From reference to a checked entry.',
        paragraphs: [
          'Declarix reads the invoice, transport documents and emails, flags a conflict such as CIF on the invoice and CIP in the email, and links every proposed value to its source for the clerk to check.',
        ],
      },
    ],
  },
].map((hub) => ({ ...hub, kind: 'section-hub', schemaType: 'CollectionPage', publishedOn: HUB_REVIEWED_ON, reviewedOn: HUB_REVIEWED_ON }))

// Every published route under the hub path, each with its nearest published parent.
export function hubChildren(hub, allRoutes) {
  const under = allRoutes.filter((route) => route.path !== hub.path && route.path.startsWith(hub.path))
  const paths = new Set(under.map((route) => route.path))
  return under.map((route) => {
    const parts = route.path.split('/').filter(Boolean)
    let parent = hub.path
    for (let index = parts.length - 1; index > 0; index -= 1) {
      const candidate = `/${parts.slice(0, index).join('/')}/`
      if (paths.has(candidate)) {
        parent = candidate
        break
      }
    }
    return { path: route.path, name: shortName(route), description: route.description, parent }
  })
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

function renderBranch(children, parent) {
  const items = children.filter((child) => child.parent === parent)
  if (!items.length) return ''
  return `<ol class="hub-list">${items
    .map(
      (child) => `<li><a href="${child.path}">${escapeHtml(child.name)}</a><p>${escapeHtml(child.description)}</p>${renderBranch(children, child.path)}</li>`,
    )
    .join('')}</ol>`
}

export function renderHubRegister(hub, children) {
  const related = hub.related?.length
    ? `<div class="hub-related"><span class="section-label">RELATED MODELS</span><ol class="hub-list">${hub.related
        .map(([path, name, line]) => `<li><a href="${path}">${escapeHtml(name)}</a><p>${escapeHtml(line)}</p></li>`)
        .join('')}</ol></div>`
    : ''
  return `<section class="hub-register" aria-labelledby="hub-register-heading">
    <header><span class="section-label">IN THIS SECTION · ${children.length} PAGES</span><h2 id="hub-register-heading">${escapeHtml(hub.registerTitle)}</h2></header>
    ${renderBranch(children, hub.path)}${related}
  </section>`
}

export function hubItemList(site, children) {
  return {
    '@type': 'ItemList',
    numberOfItems: children.length,
    itemListElement: children.map((child, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: child.name,
      url: `${site.origin}${child.path}`,
    })),
  }
}

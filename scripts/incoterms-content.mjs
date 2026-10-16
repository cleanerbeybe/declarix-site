// Search-intent content for the Incoterms hub and the 11 rule pages (INTENT-REVIEW §4.3, 16 Oct 2026).
// Rule facts: ICC Incoterms® 2020 (https://iccwbo.org/business-solutions/incoterms-rules/, checked 16 Oct 2026:
// "entered into force on 1 January 2020", "eleven three-letter trade terms") and HMRC's summary of each rule
// (https://www.gov.uk/guidance/customs-valuation/incoterms, updated 14 April 2026, checked 16 Oct 2026).
// UK customs value: the transaction value plus transport and insurance costs up to the place the goods enter the UK
// (HMRC Notice 252 and "Delivery costs to include in the customs value", checked 16 Oct 2026).
// Import VAT and PVA: https://www.gov.uk/guidance/check-when-you-can-account-for-import-vat-on-your-vat-return (checked 16 Oct 2026).
// EORI: https://www.gov.uk/eori (checked 16 Oct 2026). ENS responsibility: the carrier (GOV.UK S&S import requirements).

export const SELLER = 'Seller'
export const BUYER = 'Buyer'

// Obligations per ICC Incoterms 2020 A/B articles. "insurance" is the contract duty to insure; no duty = "None required".
const sea = 'Sea and inland waterway'
const any = 'Any mode'

export const incotermsSeo = {
  EXW: {
    title: 'EXW Incoterms 2020: Ex Works Meaning, Costs and UK Value',
    h1: 'EXW (Ex Works): every cost after the seller’s door, priced for UK customs',
    description:
      'EXW (Ex Works) Incoterms 2020 and UK customs value: add every buyer-paid cost from the seller’s door to the UK border, from loading to main carriage.',
    definition:
      'EXW (Ex Works) is the Incoterms 2020 rule where the seller makes the goods available at its premises or another named place, not loaded and not cleared for export. The buyer does everything after that.',
    modeShort: any,
    obligations: {
      export: [BUYER, 'The buyer clears the goods for export in the seller’s country.'],
      carriage: [BUYER, 'The buyer books and pays all transport, including loading at the seller’s premises.'],
      insurance: ['None required', 'Neither party must insure. The buyer carries the risk and usually insures.'],
      unloading: [BUYER, 'The buyer unloads at its own premises.'],
      import: [BUYER, 'The UK buyer is the importer and makes the UK import declaration.'],
      duties: [BUYER, 'The buyer pays UK import duty and import VAT.'],
      risk: 'When the goods are placed at the buyer’s disposal at the named place, before loading.',
    },
    riskShort: 'Seller’s premises, before loading',
    chartValue: 'Add loading, export costs, freight and insurance to the UK border.',
    ukValue: 'The EXW price stops at the seller’s door. Add loading, export clearance costs, main carriage and insurance up to the place the goods enter the UK.',
    vs: [
      ['EXW vs FCA', 'Under FCA the seller clears the goods for export and, at its own premises, loads them onto the buyer’s vehicle. Under EXW the buyer does both. For most UK importers FCA is the easier rule, because export formalities stay with the party in the export country.'],
      ['EXW vs FOB', 'FOB is for sea and inland waterway only. The seller clears export and loads the goods on board at the named port. EXW works for any mode and leaves every step after the seller’s premises with the buyer. On an EXW sea shipment, the buyer also pays the origin haulage and port costs that a FOB price would contain.'],
      ['Who is the exporter under EXW?', 'The buyer must carry out the export clearance under EXW, but many countries only accept an exporter that is established there. In practice the UK buyer appoints a forwarder or agent in the seller’s country, or asks the seller to act as exporter of record. Agree this in writing before the goods are collected.'],
    ],
    advantages: {
      buyer: ['Lowest quoted price from the seller', 'Full control of the route, the carrier and the timing', 'Easy to compare supplier prices like for like'],
      seller: ['Fewest obligations of any rule', 'Risk passes at its own premises', 'No export formalities or freight to arrange'],
    },
    disadvantages: {
      buyer: ['Must handle export clearance in a foreign country', 'Pays and evidences every cost to the UK border for the customs value', 'Carries the risk from the seller’s premises, including loading'],
      seller: ['May still be named on export records without control of them', 'Proof of export for zero-rated VAT can be hard to get', 'Little influence over how the goods leave'],
    },
    faqs: [
      ['What does EXW (Ex Works) mean?', 'EXW means the seller makes the goods available at its premises or another named place. The buyer loads them, clears them for export, ships them and imports them.'],
      ['Who handles export clearance under EXW?', 'The buyer. EXW is the only Incoterms 2020 rule where the buyer clears the goods for export. A UK buyer usually appoints a forwarder or agent in the seller’s country to do it.'],
      ['Is EXW good for first-time importers?', 'EXW gives the buyer the most tasks of any rule. First-time UK importers often find FCA easier, because the seller clears export and loads the goods at its own premises.'],
      ['What is the UK customs value under EXW?', 'The EXW price plus loading, export costs, main carriage and insurance up to the place the goods enter the UK. Transport after that point stays out of the customs value when it is shown separately.'],
      ['Who pays import duty and VAT under EXW?', 'The buyer, as the UK importer. A VAT-registered importer can account for the import VAT on its VAT Return with postponed VAT accounting.'],
    ],
  },
  FCA: {
    title: 'FCA Incoterms 2020: Free Carrier Meaning and UK Value',
    h1: 'FCA (Free Carrier): the named-place handoff and UK customs value',
    description:
      'FCA (Free Carrier) Incoterms 2020: the two delivery options, export clearance, the on-board bill of lading, FCA vs FOB and EXW, and the UK customs value.',
    definition:
      'FCA (Free Carrier) is the Incoterms 2020 rule where the seller clears the goods for export and hands them to the buyer’s carrier at a named place. It works for any mode of transport.',
    modeShort: any,
    obligations: {
      export: [SELLER, 'The seller clears the goods for export.'],
      carriage: [BUYER, 'The buyer books and pays the main carriage from the named place.'],
      insurance: ['None required', 'Neither party must insure. The buyer carries the transit risk and usually insures.'],
      unloading: [BUYER, 'The buyer unloads at destination. At another named place, the buyer also unloads the seller’s vehicle.'],
      import: [BUYER, 'The UK buyer is the importer.'],
      duties: [BUYER, 'The buyer pays UK import duty and import VAT.'],
      risk: 'On delivery to the carrier at the named place: loaded on the buyer’s vehicle at the seller’s premises, or ready for unloading at any other named place.',
    },
    riskShort: 'Handed to the buyer’s carrier at the named place',
    chartValue: 'Add buyer-paid freight and insurance to the UK border.',
    ukValue: 'Add the buyer-paid main carriage, related charges and insurance up to the place the goods enter the UK. UK transport after that point stays out when it is shown separately.',
    vs: [
      ['FCA vs FOB', 'ICC recommends FCA, not FOB, for goods handed to a carrier before they are loaded, such as containers delivered to a terminal. Under FOB the seller carries the risk until the goods are on board, even while the container waits at the terminal. FCA moves the risk at the real handoff and works for any mode.'],
      ['FCA vs EXW', 'Under FCA the seller clears the goods for export and, at its own premises, loads the buyer’s vehicle. Under EXW the buyer does both. Both rules leave the main carriage and the UK import with the buyer.'],
      ['FCA at the seller’s premises vs another place', 'If the named place is the seller’s premises, delivery happens when the goods are loaded on the buyer’s vehicle. If it is any other place, such as a forwarder’s depot, delivery happens when the goods on the seller’s vehicle are ready for unloading there. Name the exact point, because risk passes there.'],
      ['FCA and the on-board bill of lading', 'Incoterms 2020 added an option for FCA: the parties can agree that the buyer tells its carrier to issue an on-board bill of lading to the seller. This helps when a letter of credit asks for an on-board bill.'],
    ],
    advantages: {
      buyer: ['Controls the main carriage and freight cost', 'Seller handles export clearance in its own country', 'Works for containers, air, road, rail and multimodal'],
      seller: ['Risk ends at a clear, named handoff', 'No freight or insurance to buy', 'Keeps control of export formalities'],
    },
    disadvantages: {
      buyer: ['Carries the risk for the whole main carriage', 'Must add freight and insurance to the customs value', 'Must coordinate collection with the seller'],
      seller: ['Depends on the buyer’s carrier turning up on time', 'Must load the vehicle when the named place is its premises', 'Needs the on-board bill of lading option for some letters of credit'],
    },
    faqs: [
      ['What does FCA (Free Carrier) mean?', 'FCA means the seller clears the goods for export and hands them to the carrier nominated by the buyer at a named place. Risk passes to the buyer at that handoff.'],
      ['Does FCA include customs clearance?', 'FCA includes export clearance by the seller. UK import clearance, duty and import VAT are the buyer’s.'],
      ['Who pays freight under FCA?', 'The buyer books and pays the main carriage. Under UK customs valuation, that freight and any insurance up to the UK border are added to the invoice price.'],
      ['Can FCA be used for sea freight?', 'Yes. FCA works for any mode. ICC recommends FCA instead of FOB for container shipments handed to a terminal before loading.'],
      ['What changed for FCA in Incoterms 2020?', 'The buyer can now instruct its carrier to issue an on-board bill of lading to the seller. This is useful for letters of credit.'],
    ],
  },
  CPT: {
    title: 'CPT Incoterms 2020: Carriage Paid To Meaning + UK Value',
    h1: 'CPT (Carriage Paid To): the seller pays carriage, the buyer carries the risk',
    description:
      'CPT (Carriage Paid To) Incoterms 2020: who pays carriage and insurance, why risk passes at the first carrier, CPT vs CIP and CIF, and the UK customs value.',
    definition:
      'CPT (Carriage Paid To) is the Incoterms 2020 rule where the seller pays carriage to a named destination, but risk passes to the buyer when the goods are handed to the first carrier.',
    modeShort: any,
    obligations: {
      export: [SELLER, 'The seller clears the goods for export.'],
      carriage: [SELLER, 'The seller books and pays carriage to the named place of destination.'],
      insurance: ['None required', 'Neither party must insure. The buyer carries the transit risk and usually insures.'],
      unloading: [BUYER, 'The buyer unloads, unless the seller’s carriage contract includes it.'],
      import: [BUYER, 'The UK buyer is the importer.'],
      duties: [BUYER, 'The buyer pays UK import duty and import VAT.'],
      risk: 'When the goods are handed to the first carrier.',
    },
    riskShort: 'Handed to the first carrier',
    chartValue: 'Freight is in the price. Deduct the UK leg if shown; add buyer insurance.',
    ukValue: 'Carriage is already in the price. Deduct the part after the place the goods enter the UK only when it is shown separately, and add any insurance the buyer buys for the journey to the UK border.',
    vs: [
      ['CPT vs CIP', 'CIP is CPT plus a seller duty to insure. Under CIP the seller must buy cover at the ICC (A) all-risks level for at least 110% of the contract price. Under CPT nobody has to insure, so the buyer usually buys its own cover.'],
      ['CPT vs CIF', 'CIF is for sea and inland waterway only, risk passes on board the vessel, and the seller must insure at the ICC (C) level. CPT works for any mode, risk passes at the first carrier, and there is no insurance duty. For containers, CPT or CIP fit better than CIF.'],
      ['CPT vs DDP', 'Under DDP the seller carries the risk to the named place, clears UK import and pays the duty and VAT. Under CPT the seller only pays the carriage; the buyer carries the risk from the first carrier and handles the UK import.'],
    ],
    advantages: {
      buyer: ['Freight is in the price, so landed cost is easier to compare', 'Seller arranges the transport', 'Works for any mode'],
      seller: ['Risk passes early, at the first carrier', 'Can sell freight as part of the deal', 'No insurance duty'],
    },
    disadvantages: {
      buyer: ['Carries the risk while the seller’s carrier moves the goods', 'Needs its own insurance', 'Needs a carriage split to remove the UK leg from the customs value'],
      seller: ['Pays freight to destination after risk has passed', 'Freight price changes hit the seller', 'Must give the buyer notice so it can insure'],
    },
    faqs: [
      ['What does CPT (Carriage Paid To) mean?', 'CPT means the seller pays carriage to the named destination. Risk passes to the buyer when the goods are handed to the first carrier.'],
      ['Does CPT include insurance?', 'No. Neither party must insure under CPT. The buyer carries the risk from the first carrier, so it usually buys cargo insurance. If you want the seller to insure, use CIP.'],
      ['When does risk pass under CPT?', 'When the seller hands the goods to the first carrier, not at the destination.'],
      ['What is the UK customs value under CPT?', 'The CPT price, minus the carriage after the place the goods enter the UK if the invoice shows it separately, plus any insurance the buyer pays for the journey to the UK border.'],
    ],
  },
  CIP: {
    title: 'CIP Incoterms 2020: Carriage and Insurance Paid To',
    h1: 'CIP (Carriage and Insurance Paid To): split carriage and cover at the UK border',
    description:
      'CIP (Carriage and Insurance Paid To) Incoterms 2020: ICC (A) cover at 110%, when risk passes, CIP vs CIF and CPT, and the UK customs value split.',
    definition:
      'CIP (Carriage and Insurance Paid To) is the Incoterms 2020 rule where the seller pays carriage and buys all-risks cargo insurance to a named destination, while risk passes at the first carrier.',
    modeShort: any,
    obligations: {
      export: [SELLER, 'The seller clears the goods for export.'],
      carriage: [SELLER, 'The seller books and pays carriage to the named place of destination.'],
      insurance: [SELLER, 'The seller must insure at the ICC (A) level, for at least 110% of the contract price.'],
      unloading: [BUYER, 'The buyer unloads, unless the seller’s carriage contract includes it.'],
      import: [BUYER, 'The UK buyer is the importer.'],
      duties: [BUYER, 'The buyer pays UK import duty and import VAT.'],
      risk: 'When the goods are handed to the first carrier.',
    },
    riskShort: 'Handed to the first carrier',
    chartValue: 'Freight and cover are in the price. Deduct the UK leg if shown.',
    ukValue: 'Carriage and insurance are already in the price. Deduct the carriage, and the share of the premium, after the place the goods enter the UK only when the evidence shows them separately.',
    vs: [
      ['CIP vs CIF', 'CIP works for any mode; CIF is for sea and inland waterway only. CIP needs ICC (A) all-risks cover; CIF needs only the more limited ICC (C) cover. Both need at least 110% of the contract price. Under CIP risk passes at the first carrier; under CIF it passes on board the vessel.'],
      ['CIP insurance: 110% and ICC (A)', 'Incoterms 2020 raised the CIP cover from ICC (C) to ICC (A), the all-risks clauses. The cover must be at least the contract price plus 10%, in the contract currency, and run from the delivery point to at least the named destination. The parties can agree a lower level in the contract.'],
      ['CIP vs CPT', 'CIP is CPT with a seller duty to insure. If the buyer already holds an annual cargo policy, CPT avoids paying twice for cover.'],
    ],
    advantages: {
      buyer: ['Seller pays freight and all-risks cover', 'One delivered price to compare', 'Works for any mode, including containers and air'],
      seller: ['Risk passes early, at the first carrier', 'Can sell freight and insurance as part of the deal', 'Clear insurance standard to meet'],
    },
    disadvantages: {
      buyer: ['Carries the risk from the first carrier and claims on the seller’s policy', 'Needs a split to take the UK leg out of the customs value', 'May pay for cover it already holds'],
      seller: ['ICC (A) cover costs more than ICC (C)', 'Pays freight and cover after risk has passed', 'Must give the buyer the policy or certificate'],
    },
    faqs: [
      ['What does CIP (Carriage and Insurance Paid To) mean?', 'CIP means the seller pays carriage and buys cargo insurance to the named destination. Risk passes to the buyer when the goods are handed to the first carrier.'],
      ['What insurance does CIP require?', 'Cover on the ICC (A) all-risks clauses for at least 110% of the contract price, unless the parties agree otherwise in the contract.'],
      ['Does CIP include customs clearance?', 'CIP includes export clearance by the seller. UK import clearance, duty and import VAT are the buyer’s.'],
      ['What is the UK customs value under CIP?', 'The CIP price, minus the carriage and the share of the premium after the place the goods enter the UK, when the invoice or carrier statement shows them separately.'],
    ],
  },
  DAP: {
    title: 'DAP Incoterms 2020: Delivered at Place vs DDP (UK)',
    h1: 'DAP (Delivered at Place): who clears UK import and pays the duty',
    description:
      'DAP Incoterms 2020: what Delivered at Place covers, who clears UK import and pays duty and VAT, when risk passes, DAP vs DDP and DPU, and DAP quotes.',
    definition:
      'DAP (Delivered at Place) is the Incoterms 2020 rule where the seller delivers the goods to a named destination, ready for unloading. The buyer clears UK import and pays the duty and import VAT.',
    modeShort: any,
    obligations: {
      export: [SELLER, 'The seller clears the goods for export.'],
      carriage: [SELLER, 'The seller books and pays carriage to the named place.'],
      insurance: ['None required', 'Neither party must insure. The seller carries the risk to the named place and usually insures for itself.'],
      unloading: [BUYER, 'The buyer unloads at the named place.'],
      import: [BUYER, 'The UK buyer is the importer and makes the UK import declaration.'],
      duties: [BUYER, 'The buyer pays UK import duty and import VAT.'],
      risk: 'At the named place of destination, when the goods are ready for unloading.',
    },
    riskShort: 'Named destination, ready for unloading',
    chartValue: 'Freight is in the price. Deduct the UK leg if shown separately.',
    ukValue: 'The DAP price includes carriage to the named place. Deduct the transport after the place the goods enter the UK only when the invoice or carrier statement shows it separately.',
    vs: [
      ['DAP vs DDP', 'Both deliver to the named place, ready for unloading. Under DDP the seller also clears UK import and pays the duty and import VAT. Under DAP the UK buyer does that. DAP is the usual choice when the seller has no UK presence, because the importer needs a GB EORI number.'],
      ['DAP vs DPU', 'Under DPU the seller also unloads the goods at the named place and carries the risk until they are unloaded. Under DAP the buyer unloads.'],
      ['What a DAP quote should include', 'Ask for the goods price, the carriage to the UK border and the carriage after the border as separate lines. Ask the seller to confirm that duty, import VAT and unloading are not in the price. That split lets you take the UK leg out of the customs value.'],
    ],
    advantages: {
      buyer: ['Seller carries the transport risk to the named place', 'One delivered price before import costs', 'Keeps control of UK customs clearance and PVA'],
      seller: ['No UK import role or GB EORI needed', 'Can sell freight as part of the deal', 'Buyer handles UK duty and VAT'],
    },
    disadvantages: {
      buyer: ['Must clear UK import and pay duty and VAT', 'Needs a carriage split to take the UK leg out of the customs value', 'Delays at import clearance can cost demurrage'],
      seller: ['Carries the risk for the whole journey', 'Pays freight before it is paid for the goods', 'Depends on the buyer clearing import on time'],
    },
    faqs: [
      ['What does DAP (Delivered at Place) mean?', 'DAP means the seller delivers the goods to the named destination, ready for unloading. Risk passes there. The buyer unloads and handles UK import.'],
      ['Does DAP include customs clearance?', 'DAP includes export clearance by the seller. UK import clearance is the buyer’s job under DAP.'],
      ['Who pays import duty under DAP?', 'The buyer pays UK import duty and import VAT. A VAT-registered buyer can account for the import VAT on its VAT Return with postponed VAT accounting.'],
      ['What is the UK customs value under DAP?', 'The DAP price, minus the transport after the place the goods enter the UK when it is shown separately. Without a split, the full DAP price stays in the customs value.'],
    ],
  },
  DPU: {
    title: 'DPU Incoterms 2020: Delivered at Place Unloaded + UK Value',
    h1: 'DPU (Delivered at Place Unloaded): the seller unloads, the value stops at the border',
    description:
      'DPU (Delivered at Place Unloaded) Incoterms 2020: the seller unloads, DPU vs DAP, why DPU replaced DAT, who pays UK import duty, and the UK customs value.',
    definition:
      'DPU (Delivered at Place Unloaded) is the Incoterms 2020 rule where the seller delivers the goods to a named destination and unloads them there. It is the only rule where the seller must unload.',
    modeShort: any,
    obligations: {
      export: [SELLER, 'The seller clears the goods for export.'],
      carriage: [SELLER, 'The seller books and pays carriage to the named place.'],
      insurance: ['None required', 'Neither party must insure. The seller carries the risk to unloading and usually insures for itself.'],
      unloading: [SELLER, 'The seller unloads at the named place.'],
      import: [BUYER, 'The UK buyer is the importer.'],
      duties: [BUYER, 'The buyer pays UK import duty and import VAT.'],
      risk: 'At the named place of destination, once the goods are unloaded.',
    },
    riskShort: 'Named destination, after unloading',
    chartValue: 'Freight is in the price. Deduct UK leg and unloading if shown.',
    ukValue: 'The DPU price includes carriage and unloading. Deduct the transport and unloading after the place the goods enter the UK only when the evidence shows them separately.',
    vs: [
      ['DPU vs DAP', 'Under DPU the seller unloads at the named place and carries the risk until the goods are unloaded. Under DAP the buyer unloads. Use DPU only when the seller can unload at that place.'],
      ['DPU replaced DAT in 2020', 'Incoterms 2010 had DAT (Delivered at Terminal). Incoterms 2020 renamed it DPU, because the named place can be any place, not only a terminal.'],
      ['Who pays import duty under DPU?', 'The buyer. DPU leaves UK import clearance, duty and import VAT with the buyer, just like DAP. Only DDP moves them to the seller.'],
    ],
    advantages: {
      buyer: ['Seller carries the risk until the goods are unloaded', 'Seller handles unloading equipment and labour', 'Keeps control of UK customs clearance and PVA'],
      seller: ['No UK import role or GB EORI needed', 'Can sell delivery and unloading as one service', 'Buyer handles UK duty and VAT'],
    },
    disadvantages: {
      buyer: ['Must clear UK import and pay duty and VAT', 'Unloading stays in the customs value unless priced separately', 'Must give the seller safe access to unload'],
      seller: ['Carries the risk through unloading', 'Must have the means to unload at the named place', 'Depends on the buyer clearing import on time'],
    },
    faqs: [
      ['What does DPU (Delivered at Place Unloaded) mean?', 'DPU means the seller delivers the goods to the named destination and unloads them. Risk passes once the goods are unloaded.'],
      ['Is DPU the same as DAT?', 'DPU replaced DAT (Delivered at Terminal) in Incoterms 2020. The named place can now be any place, not only a terminal.'],
      ['Who clears UK import under DPU?', 'The buyer clears UK import and pays the duty and import VAT.'],
      ['What is the UK customs value under DPU?', 'The DPU price, minus the transport and unloading after the place the goods enter the UK when they are shown separately.'],
    ],
  },
  DDP: {
    title: 'DDP Incoterms 2020: Delivered Duty Paid into the UK',
    h1: 'DDP (Delivered Duty Paid): what the seller must do to import into the UK',
    description:
      'DDP Incoterms 2020: Delivered Duty Paid explained, UK importer of record, EORI, import VAT and PVA for the seller, DDP vs DAP, and the price for CDS.',
    definition:
      'DDP (Delivered Duty Paid) is the Incoterms 2020 rule where the seller delivers the goods to a named destination, cleared for import, with import duty and import VAT paid. It puts the most on the seller.',
    modeShort: any,
    obligations: {
      export: [SELLER, 'The seller clears the goods for export.'],
      carriage: [SELLER, 'The seller books and pays carriage to the named place.'],
      insurance: ['None required', 'Neither party must insure. The seller carries the risk to the named place and usually insures for itself.'],
      unloading: [BUYER, 'The buyer unloads at the named place.'],
      import: [SELLER, 'The seller is the UK importer and makes, or has its agent make, the UK import declaration.'],
      duties: [SELLER, 'The seller pays UK import duty and import VAT.'],
      risk: 'At the named place of destination, when the goods are ready for unloading.',
    },
    riskShort: 'Named destination, ready for unloading',
    chartValue: 'Strip out duty, import VAT and the UK leg from the delivered price.',
    ukValue: 'The delivered price is not the customs value. Take out the UK duty, the import VAT and the transport after the place the goods enter the UK. The customs value is the goods plus transport and insurance to the UK border.',
    vs: [
      ['DDP vs DAP', 'Both deliver to the named place, ready for unloading. Under DDP the seller also clears UK import and pays the duty and import VAT. Under DAP the buyer does. Choose DAP when the seller has no UK importer set-up.'],
      ['DDP excluding VAT (DDP excl. VAT)', 'Some contracts say “DDP, VAT unpaid” or “DDP excl. VAT”. This is a change the parties write into the contract, not a separate Incoterms rule. If you use it, state in the contract who pays the UK import VAT and who can account for it.'],
      ['Importer of record under DDP: EORI, UK VAT, PVA', 'Under DDP the seller is the UK importer. It needs a GB EORI number. To account for import VAT with postponed VAT accounting it must be registered for UK VAT. A seller based outside the UK usually appoints a UK customs agent to declare for it.'],
    ],
    advantages: {
      buyer: ['Fewest tasks of any rule: the goods arrive cleared and duty paid', 'Landed cost known up front', 'Seller carries the risk to the named place'],
      seller: ['Can offer a simple delivered price', 'Controls the whole journey and the UK clearance', 'Strong offer for buyers new to importing'],
    },
    disadvantages: {
      buyer: ['Import VAT paid by the seller is not the buyer’s to reclaim', 'Less control over the UK customs declaration', 'Price contains costs that are hard to check'],
      seller: ['Needs a GB EORI and usually UK VAT registration', 'Carries UK duty and VAT risk, including rate changes', 'Answers for the UK customs declaration'],
    },
    faqs: [
      ['What does DDP (Delivered Duty Paid) mean?', 'DDP means the seller delivers the goods to the named place cleared for import, with duty and import VAT paid. It is sometimes written “Delivery Duty Paid”, but the ICC name is Delivered Duty Paid.'],
      ['Who clears customs under DDP?', 'The seller clears both export and UK import. A seller outside the UK usually appoints a UK customs agent.'],
      ['Who is the importer of record under DDP?', 'The seller. It needs a GB EORI number and, to use postponed VAT accounting, UK VAT registration.'],
      ['Can a DDP shipment be refused?', 'The buyer must take delivery when the goods arrive as agreed. A refusal is a contract dispute between the parties. Write in the contract who pays storage and return costs.'],
      ['What is the UK customs value under DDP?', 'The goods plus transport and insurance to the UK border. Take the UK duty, import VAT and post-border transport out of the delivered price.'],
    ],
  },
  FAS: {
    title: 'FAS Incoterms 2020: Free Alongside Ship and UK Value',
    h1: 'FAS (Free Alongside Ship): the quayside handoff before loading',
    description:
      'FAS (Free Alongside Ship) Incoterms 2020: delivery alongside the vessel, when risk passes, FAS vs FOB, FAS for bulk cargo, and the UK customs value.',
    definition:
      'FAS (Free Alongside Ship) is the Incoterms 2020 rule where the seller clears the goods for export and places them alongside the buyer’s vessel at the named port of shipment. It is for sea and inland waterway only.',
    modeShort: sea,
    obligations: {
      export: [SELLER, 'The seller clears the goods for export.'],
      carriage: [BUYER, 'The buyer pays loading on board and the sea freight.'],
      insurance: ['None required', 'Neither party must insure. The buyer carries the voyage risk and usually insures.'],
      unloading: [BUYER, 'The buyer pays discharge at the destination port.'],
      import: [BUYER, 'The UK buyer is the importer.'],
      duties: [BUYER, 'The buyer pays UK import duty and import VAT.'],
      risk: 'When the goods are alongside the vessel, for example on the quay or a barge, at the named port of shipment.',
    },
    riskShort: 'Alongside the vessel at the port of shipment',
    chartValue: 'Add loading on board, sea freight and insurance to the UK port.',
    ukValue: 'Add the cost of loading on board, the sea freight, surcharges and insurance up to the UK port of arrival.',
    vs: [
      ['FAS vs FOB', 'Under FOB the seller also loads the goods on board, and risk passes once they are on board. Under FAS the seller stops at the quayside, so loading and its risk are the buyer’s. A FAS customs value includes the loading cost; a FOB price already does.'],
      ['When to use FAS (bulk and break-bulk)', 'FAS fits bulk and break-bulk cargo, such as timber, grain or steel, where the buyer charters the vessel and arranges loading. It does not fit containers, which are handed over at a terminal; use FCA for those.'],
    ],
    advantages: {
      buyer: ['Controls the vessel, loading and freight', 'Lower goods price than FOB', 'Suits chartered bulk shipments'],
      seller: ['Risk ends at the quayside', 'No loading or freight to arrange', 'Simple handoff at its own port'],
    },
    disadvantages: {
      buyer: ['Pays and carries the risk of loading', 'Adds loading, freight and insurance to the customs value', 'Must nominate the vessel on time'],
      seller: ['Must clear export', 'Goods may wait on the quay if the vessel is late', 'Not suitable for container trade'],
    },
    faqs: [
      ['What does FAS (Free Alongside Ship) mean?', 'FAS means the seller clears the goods for export and places them alongside the buyer’s vessel at the named port of shipment. Risk passes there.'],
      ['Can FAS be used for containers?', 'FAS is meant for bulk and break-bulk cargo. For containers handed to a terminal, use FCA.'],
      ['What is the UK customs value under FAS?', 'The FAS price plus loading on board, sea freight, surcharges and insurance up to the UK port of arrival.'],
      ['Who pays import duty under FAS?', 'The UK buyer pays import duty and import VAT. A VAT-registered buyer can account for the import VAT on its VAT Return with postponed VAT accounting.'],
    ],
  },
  FOB: {
    title: 'FOB Incoterms 2020: Free On Board Meaning and UK Duty',
    h1: 'FOB (Free On Board): who pays, when risk passes, UK customs value',
    description:
      'FOB (Free On Board) Incoterms 2020 explained: seller and buyer costs, when risk passes on board, FOB vs CIF and FCA, and how to build the UK customs value.',
    definition:
      'FOB (Free On Board) is the Incoterms 2020 rule where the seller clears the goods for export and loads them on board the buyer’s vessel at the named port of shipment. It is for sea and inland waterway only.',
    modeShort: sea,
    obligations: {
      export: [SELLER, 'The seller clears the goods for export.'],
      carriage: [BUYER, 'The buyer books and pays the sea freight from the port of shipment.'],
      insurance: ['None required', 'Neither party must insure. The buyer carries the voyage risk and usually insures.'],
      unloading: [BUYER, 'The buyer pays discharge at the destination port, unless the freight contract includes it.'],
      import: [BUYER, 'The UK buyer is the importer.'],
      duties: [BUYER, 'The buyer pays UK import duty and import VAT.'],
      risk: 'When the goods are on board the vessel at the named port of shipment.',
    },
    riskShort: 'On board the vessel at the port of shipment',
    chartValue: 'Add sea freight, surcharges and insurance to the UK port.',
    ukValue: 'Add the sea freight, carrier surcharges and insurance from the port of shipment to the UK port of arrival.',
    vs: [
      ['FOB vs CIF', 'Under CIF the seller also pays the sea freight and minimum insurance to the destination port. Under FOB the buyer pays them. Risk passes at the same point in both: on board at the port of shipment. For UK customs value, a FOB price needs freight and insurance added; a CIF price already reaches the UK port.'],
      ['FOB vs FCA (why containers use FCA)', 'Container goods are handed to a terminal days before loading. Under FOB the seller still carries the risk until they are on board. ICC recommends FCA for containers, because risk passes at the terminal handoff.'],
      ['FOB shipping point vs FOB destination (US terms)', '“FOB shipping point” and “FOB destination” are US domestic terms, not Incoterms rules. In an international contract write “FOB [named port] Incoterms 2020”, so the ICC meaning applies.'],
      ['Who pays freight and insurance under FOB?', 'The buyer pays the sea freight and chooses whether to insure the voyage. For UK customs value, both are added to the FOB price up to the UK port of arrival.'],
    ],
    advantages: {
      buyer: ['Controls the shipping line and the freight rate', 'Seller handles export clearance and loading', 'Clear, widely understood sea term'],
      seller: ['Risk ends once the goods are on board', 'No freight or insurance to buy', 'Familiar term for port-based exporters'],
    },
    disadvantages: {
      buyer: ['Carries the voyage risk', 'Adds freight and insurance to the customs value', 'Not suited to containers handed over before loading'],
      seller: ['Carries the risk while containers wait at the terminal', 'Depends on the buyer’s vessel nomination', 'Sea and inland waterway only'],
    },
    faqs: [
      ['What does FOB (Free On Board) mean?', 'FOB means the seller clears the goods for export and loads them on board the buyer’s vessel at the named port of shipment. Risk passes once they are on board.'],
      ['Who pays freight under FOB?', 'The buyer pays the sea freight from the port of shipment.'],
      ['Is insurance included in FOB?', 'No. Neither party must insure under FOB. The buyer carries the voyage risk, so it usually insures.'],
      ['Can I use FOB for containers?', 'ICC recommends FCA for containers, because they are handed to the carrier at a terminal before loading. FOB fits goods loaded directly on board.'],
      ['Does FOB include import duty?', 'No. The UK buyer pays import duty and import VAT. The duty is worked out on the customs value: the FOB price plus freight and insurance to the UK port.'],
    ],
  },
  CFR: {
    title: 'CFR Incoterms 2020: Cost and Freight Meaning + UK Value',
    h1: 'CFR (Cost and Freight): freight is in the price, insurance is not',
    description:
      'CFR (Cost and Freight) Incoterms 2020: who pays freight and insurance, when risk passes, CFR vs CIF and FOB, C&F/CNF, and the UK customs value.',
    definition:
      'CFR (Cost and Freight) is the Incoterms 2020 rule where the seller pays the sea freight to the named destination port, but risk passes when the goods are on board at the port of shipment. It is for sea and inland waterway only.',
    modeShort: sea,
    obligations: {
      export: [SELLER, 'The seller clears the goods for export.'],
      carriage: [SELLER, 'The seller books and pays the sea freight to the named port of destination.'],
      insurance: ['None required', 'Neither party must insure. The buyer carries the voyage risk and usually insures.'],
      unloading: [BUYER, 'The buyer pays discharge at the destination port, unless the freight contract includes it.'],
      import: [BUYER, 'The UK buyer is the importer.'],
      duties: [BUYER, 'The buyer pays UK import duty and import VAT.'],
      risk: 'When the goods are on board the vessel at the port of shipment.',
    },
    riskShort: 'On board the vessel at the port of shipment',
    chartValue: 'Freight is in the price. Add the buyer’s voyage insurance.',
    ukValue: 'The CFR price already includes freight to the UK port. Add any insurance the buyer pays for the voyage.',
    vs: [
      ['CFR vs CIF', 'CIF adds a seller duty to insure at the ICC (C) level for 110% of the price. Under CFR nobody has to insure, so the buyer’s own voyage premium is added to the UK customs value. That one line is often the only difference between a CFR and a CIF customs value.'],
      ['CFR vs FOB', 'Under CFR the seller pays the sea freight; under FOB the buyer does. Risk passes on board at the port of shipment in both.'],
      ['Is C&F the same as CFR?', '“C&F”, “CNF” and “C+F” are older or informal names. The Incoterms 2020 rule is CFR. Write “CFR [named port] Incoterms 2020” in the contract.'],
      ['CFR for containers? Use CPT', 'Containers are handed to the carrier at a terminal before loading. ICC recommends CPT for that, because risk passes at the handoff to the first carrier.'],
    ],
    advantages: {
      buyer: ['Freight to the UK port is in the price', 'Free to choose its own insurer and cover', 'Simple customs value: add only insurance'],
      seller: ['Risk ends once the goods are on board', 'Can sell freight as part of the deal', 'No insurance duty'],
    },
    disadvantages: {
      buyer: ['Carries the voyage risk on a ship it did not choose', 'Must arrange its own insurance', 'Destination port charges can be extra'],
      seller: ['Pays freight after risk has passed', 'Freight price changes hit the seller', 'Not suited to containers'],
    },
    faqs: [
      ['What does CFR (Cost and Freight) mean?', 'CFR means the seller pays the sea freight to the named destination port. Risk passes to the buyer when the goods are on board at the port of shipment.'],
      ['Who insures under CFR?', 'Nobody has to. The buyer carries the voyage risk, so it usually buys its own cover.'],
      ['When does risk pass under CFR?', 'When the goods are on board the vessel at the port of shipment, even though the seller pays the freight to destination.'],
      ['What is the UK customs value under CFR?', 'The CFR price plus the buyer’s voyage insurance premium. The freight to the UK port is already in the price.'],
    ],
  },
  CIF: {
    title: 'CIF Incoterms 2020: Cost, Insurance and Freight + UK Duty',
    h1: 'CIF (Cost, Insurance and Freight): the cost point vs the risk point',
    description:
      'CIF Incoterms 2020: what Cost, Insurance and Freight covers, minimum cover (ICC C, 110%), when risk passes, CIF vs FOB and CIP, and the UK customs value.',
    definition:
      'CIF (Cost, Insurance and Freight) is the Incoterms 2020 rule where the seller pays sea freight and minimum insurance to the named destination port, but risk passes on board at the port of shipment. It is for sea and inland waterway only.',
    modeShort: sea,
    obligations: {
      export: [SELLER, 'The seller clears the goods for export.'],
      carriage: [SELLER, 'The seller books and pays the sea freight to the named port of destination.'],
      insurance: [SELLER, 'The seller must insure at the ICC (C) level, for at least 110% of the contract price.'],
      unloading: [BUYER, 'The buyer pays discharge at the destination port, unless the freight contract includes it.'],
      import: [BUYER, 'The UK buyer is the importer.'],
      duties: [BUYER, 'The buyer pays UK import duty and import VAT.'],
      risk: 'When the goods are on board the vessel at the port of shipment.',
    },
    riskShort: 'On board the vessel at the port of shipment',
    chartValue: 'Price already reaches the UK port. Nothing added.',
    ukValue: 'The CIF price already reaches the UK port, so nothing is added for freight or insurance. Costs after arrival stay out when they are shown separately.',
    vs: [
      ['CIF vs FOB', 'Under CIF the seller pays the sea freight and minimum insurance to the destination port; under FOB the buyer does. Risk passes on board at the port of shipment in both. For UK customs value, CIF needs no freight addition; FOB does.'],
      ['CIF vs CIP', 'CIP works for any mode and needs ICC (A) all-risks cover. CIF is sea only and needs ICC (C) cover. For containers, ICC recommends CIP.'],
      ['CIF vs CFR', 'CFR is CIF without the insurance duty. Under CFR the buyer’s own voyage premium is added to the UK customs value.'],
      ['CIF and destination charges (THC)', 'Terminal handling and other charges at the destination port are the buyer’s, unless the seller’s freight contract includes them. In the UK they come after arrival, so they stay out of the customs value when shown separately and go into the import VAT value.'],
    ],
    advantages: {
      buyer: ['Freight and insurance to the UK port are in the price', 'Customs value is easy to build: the CIF price', 'Seller handles export and booking'],
      seller: ['Risk ends once the goods are on board', 'Can sell freight and insurance as part of the deal', 'Widely accepted for letters of credit'],
    },
    disadvantages: {
      buyer: ['Carries the voyage risk on a ship it did not choose', 'ICC (C) cover is limited; top-up cover costs extra', 'Destination port charges can be extra'],
      seller: ['Pays freight and cover after risk has passed', 'Freight price changes hit the seller', 'Sea and inland waterway only'],
    },
    faqs: [
      ['What does CIF (Cost, Insurance and Freight) mean?', 'CIF means the seller pays the sea freight and minimum insurance to the named destination port. Risk passes to the buyer when the goods are on board at the port of shipment.'],
      ['Does CIF include duty?', 'No. The UK buyer pays import duty and import VAT. The CIF price is usually the starting point of the UK customs value.'],
      ['What insurance does CIF need?', 'Cover on the ICC (C) clauses for at least 110% of the contract price, unless the parties agree more.'],
      ['Can CIF be used for air freight?', 'No. CIF is for sea and inland waterway only. For air, road, rail or containers, use CIP.'],
      ['Is the UK customs value the CIF value?', 'Yes, in most cases. The UK customs value includes transport and insurance up to the place the goods enter the UK, which a CIF price to a UK port already covers.'],
    ],
  },
}

export const obligationRows = [
  ['export', 'Export clearance'],
  ['carriage', 'Main carriage'],
  ['insurance', 'Insurance'],
  ['unloading', 'Unloading at destination'],
  ['import', 'Import clearance'],
  ['duties', 'Import duty + VAT'],
]

export const hubSeo = {
  title: 'Incoterms 2020 Chart: All 11 Rules Explained for UK Trade',
  h1: 'Incoterms 2020: all 11 rules, chart and UK customs value',
  description:
    'Incoterms 2020 chart with all 11 rules: who pays freight, insurance, duty and VAT, where risk passes, and how each rule feeds UK customs value. Free CSV.',
  sections: [
    [
      'what-are-incoterms',
      'What are Incoterms?',
      [
        'Incoterms® are the International Chamber of Commerce (ICC) rules that say which party in a sale does which delivery task, pays which cost and carries the risk at each stage. The current edition, Incoterms 2020, entered into force on 1 January 2020.',
        'There are 11 rules. Seven work for any mode of transport: EXW, FCA, CPT, CIP, DAP, DPU and DDP. Four are for sea and inland waterway only: FAS, FOB, CFR and CIF.',
        'An Incoterms rule does not set the price, the ownership transfer or the customs valuation method. HMRC states that the rule does not restrict the valuation method: goods sold DDP can still be valued under Method 1. For UK customs, the rule tells you which freight and insurance costs are already in the invoice price, and which you must add or take out to reach the customs value.',
      ],
    ],
    [
      'incoterms-2010-vs-2020',
      'Incoterms 2010 vs 2020: what changed',
      [
        'DAT (Delivered at Terminal) became DPU (Delivered at Place Unloaded), because the place of unloading can be anywhere, not only a terminal.',
        'CIP insurance went up from ICC (C) to ICC (A) all-risks cover. CIF stayed at ICC (C). Both need at least 110% of the contract price.',
        'FCA gained an on-board bill of lading option: the buyer can tell its carrier to issue an on-board bill to the seller, which helps with letters of credit.',
        'Under FCA, DAP, DPU and DDP, the seller or buyer can now use its own vehicle instead of a third-party carrier.',
        'Security-related tasks and costs are now set out in each rule, and all costs are listed together in one article (A9/B9) of each rule.',
      ],
    ],
    [
      'incoterms-2026',
      'Is there an Incoterms 2026?',
      [
        'No. The current edition is Incoterms 2020, in force since 1 January 2020, and ICC lists it as the current set of rules. Write “Incoterms 2020” after the rule and the named place in your contracts, for example “FCA Shenzhen Yantian terminal Incoterms 2020”.',
        'Older editions such as Incoterms 2010 can still be used if the contract names them, because the edition is a contract choice. Naming the edition removes doubt.',
      ],
    ],
    [
      'uk-importers',
      'Most-used rules for UK importers',
      [
        'FOB and FCA: the buyer controls the main carriage. Common on purchases from Asia. Add freight and insurance to the UK border to get the customs value.',
        'CIF and CFR: the seller books the sea freight. A CIF price to a UK port is usually the customs value; under CFR, add your own insurance.',
        'EXW: common on purchases from European factories. Add loading, export costs, haulage and insurance to the UK border.',
        'DAP: common on EU road freight. The buyer clears UK import; take out the UK leg only when it is shown separately.',
        'DDP: common in e-commerce and from suppliers with a UK set-up. The seller is the UK importer and needs a GB EORI number.',
      ],
    ],
  ],
  faqs: [
    ['What are Incoterms?', 'Incoterms are the ICC rules that set which party does each delivery task, pays each cost and carries the risk in a sale of goods. The current edition is Incoterms 2020.'],
    ['How many Incoterms rules are there?', 'There are 11 rules in Incoterms 2020: seven for any mode of transport (EXW, FCA, CPT, CIP, DAP, DPU, DDP) and four for sea and inland waterway only (FAS, FOB, CFR, CIF).'],
    ['Which Incoterms include insurance?', 'Only CIF and CIP make the seller insure. CIF needs ICC (C) cover and CIP needs ICC (A) all-risks cover, both for at least 110% of the contract price. Under the other nine rules nobody has to insure.'],
    ['Can I still use Incoterms 2010?', 'Yes, if the contract names Incoterms 2010. The edition is a contract choice. Incoterms 2020 is the current edition, so most new contracts name it.'],
    ['Which Incoterms rule makes the seller pay UK import duty?', 'Only DDP (Delivered Duty Paid). Under the other ten rules the buyer clears UK import and pays the duty and import VAT.'],
    ['Do Incoterms decide the UK customs value?', 'No. The UK customs value includes transport and insurance up to the place the goods enter the UK, whatever rule is used. The rule shows which of those costs are already in the invoice price.'],
  ],
}

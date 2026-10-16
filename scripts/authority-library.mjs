import { breadcrumbHtml, breadcrumbList, organizationNode } from './site-graph.mjs'
import { referenceLinkStrip } from './customs-reference-links.mjs'
import { SELLER, hubSeo, incotermsSeo, obligationRows } from './incoterms-content.mjs'

const REVIEWED_ON = '2026-07-17'
const INCOTERMS_PUBLISHED_ON = '2026-10-15'
const INCOTERMS_REVIEWED_ON = '2026-10-16'

const source = (title, publisher, url, checked = '17 JULY 2026') => ({ title, publisher, url, checked })
const checkedOctober = (title, url) => source(title, 'HM Revenue & Customs · GOV.UK', url, '15 OCTOBER 2026')

const hmrcIncoterms = source(
  'Customs valuation: Incoterms',
  'HM Revenue & Customs · GOV.UK',
  'https://www.gov.uk/guidance/customs-valuation/incoterms',
)
const hmrcValuation = source(
  'Customs valuation',
  'HM Revenue & Customs · GOV.UK',
  'https://www.gov.uk/guidance/customs-valuation',
)
const iccIncoterms = source(
  'Incoterms rules',
  'International Chamber of Commerce',
  'https://iccwbo.org/business-solutions/incoterms-rules/',
)
const hmrcDeliveryCosts = checkedOctober('Delivery costs to include in the customs value', 'https://www.gov.uk/guidance/delivery-costs-to-include-in-the-customs-value')
const hmrcMethodOne = checkedOctober('Customs valuation: Method 1 transaction value', 'https://www.gov.uk/guidance/customs-valuation/method-1-transaction-value')
const hmrcDeliveryTerms = checkedOctober('Delivery terms for Data Element 4/1 of CDS', 'https://www.gov.uk/government/publications/delivery-terms-for-data-element-41-of-the-customs-declaration-service')
const hmrcImportVat = checkedOctober('Paying VAT on imports: valuation of imported goods', 'https://www.gov.uk/guidance/vat-imports-acquisitions-and-purchases-from-abroad')
const hmrcExchangeRates = checkedOctober('Exchange rates for customs and VAT', 'https://www.gov.uk/government/collections/exchange-rates-for-customs-and-vat')
const checkedSixteen = (title, publisher, url) => source(title, publisher, url, '16 OCTOBER 2026')
const hmrcNotice252 = checkedSixteen('Notice 252: valuation of imported goods for customs purposes, VAT and trade statistics', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/publications/notice-252-valuation-of-imported-goods-for-customs-purposes-vat-and-trade-statistics')
const hmrcPva = checkedSixteen('Check when you can account for import VAT on your VAT Return', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/check-when-you-can-account-for-import-vat-on-your-vat-return')
const hmrcEori = checkedSixteen('Get an EORI number', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/eori')
const incotermSources = [hmrcIncoterms, hmrcValuation, iccIncoterms, hmrcDeliveryCosts, hmrcMethodOne, hmrcDeliveryTerms, hmrcImportVat, hmrcExchangeRates, hmrcNotice252, hmrcPva, hmrcEori]

// Worked examples: every amount is an example. Treatments follow HMRC's delivery-cost rules:
// 'value' = in the customs value; 'uk' = after the place of introduction, separately shown, so outside the customs value
// but inside the import VAT value as a cost to the first UK destination; 'out' = outside both.
// 'duty' and 'vat' lines are calculated, used where a DDP price already contains them.

const termDefinitions = [
  {
    code: 'FOB',
    slug: 'fob',
    name: 'Free On Board',
    mode: 'Sea and inland waterway only',
    title: 'FOB Incoterms: risk, freight and UK customs value',
    description:
      'Use the FOB Incoterms workpaper to map seller and buyer handoffs, identify freight and insurance evidence, and cross-foot the UK customs value trail.',
    h1: 'FOB: find the handoff before you build customs value.',
    standfirst:
      'FOB puts the named port of shipment at the centre of the evidence trail. Map what the invoice includes, who booked the main carriage and which costs still need to reach the UK border value.',
    fit: 'Use for sea or inland-waterway shipments when the seller delivers the goods on board at the named port of shipment.',
    risk: 'Risk moves to the buyer when the goods are on board the vessel at the named port of shipment.',
    seller: ['Export clearance', 'Delivery on board', 'Origin costs to the named port'],
    buyer: ['Main carriage', 'Insurance if wanted', 'UK import clearance and onward delivery'],
    valueChecks: [
      'Confirm whether the commercial invoice stops at the FOB handoff.',
      'Identify freight, insurance and related costs from shipment to the UK border.',
      'Keep post-import inland transport separate when the evidence supports a deduction.',
      'Tie the named port, bill of lading and freight invoice to the same shipment.',
    ],
    phases: [
      ['Export preparation', 'Seller'],
      ['On board at named port', 'Seller → Buyer risk'],
      ['Main carriage', 'Buyer'],
      ['UK import and delivery', 'Buyer'],
    ],
    example: {
      title: 'Leeds tableware importer · FOB Ningbo by container',
      scenario:
        'A Leeds homeware importer buys stoneware dinner sets FOB Ningbo. The importer books the ocean freight to Felixstowe and pays the shipping line’s bunker and peak-season surcharges. A UK haulier then moves the container from Felixstowe to the Leeds warehouse.',
      de41: 'FOB · Ningbo (named port of shipment)',
      placeOfIntroduction: 'Felixstowe, the UK port where the goods arrive direct by sea',
      currency: 'USD',
      rate: 0.77,
      dutyRate: 6,
      lines: [
        ['Seller’s FOB invoice for the dinner sets', 24000, 'USD', 'value'],
        ['Ocean freight Ningbo to Felixstowe, including bunker adjustment factor', 2600, 'USD', 'value'],
        ['Peak season surcharge from the shipping line', 300, 'USD', 'value'],
        ['Marine insurance premium for the sea leg', 95, 'USD', 'value'],
        ['UK haulage Felixstowe to Leeds, invoiced separately', 640, 'GBP', 'uk'],
      ],
      lesson:
        'FOB stops at the ship’s rail in Ningbo, so every freight, surcharge and insurance cost to Felixstowe joins the customs value. The Leeds haulage sits after the place of introduction: it stays out of the customs value and goes into the import VAT value.',
    },
  },
  {
    code: 'CIF',
    slug: 'cif',
    name: 'Cost, Insurance and Freight',
    mode: 'Sea and inland waterway only',
    title: 'CIF Incoterms: insurance, freight and customs value',
    description:
      'Map a CIF shipment from on-board risk transfer to seller-paid freight and insurance, then test which costs are already in the UK customs value evidence.',
    h1: 'CIF: separate who pays from when risk moves.',
    standfirst:
      'Under CIF the seller contracts freight and minimum insurance to the named destination port, while risk moves earlier when the goods are on board. That split matters when the invoice and valuation trail are reviewed.',
    fit: 'Use for sea or inland-waterway shipments when the seller contracts freight and minimum insurance to the named destination port.',
    risk: 'Risk moves on board at the port of shipment even though the seller pays freight and insurance to destination.',
    seller: ['Export clearance', 'Delivery on board', 'Freight and minimum insurance to named port'],
    buyer: ['Risk during main carriage', 'UK import clearance', 'Onward delivery after destination port'],
    valueChecks: [
      'Confirm whether freight and insurance are already included in the invoice price.',
      'Separate destination handling and post-import transport where the evidence permits.',
      'Match the insurance certificate and freight document to the invoiced consignment.',
      'Do not add the same freight or insurance amount twice.',
    ],
    phases: [
      ['Export preparation', 'Seller'],
      ['On board · risk transfers', 'Seller → Buyer risk'],
      ['Freight + minimum insurance', 'Seller pays'],
      ['UK import and delivery', 'Buyer'],
    ],
    example: {
      title: 'Bristol olive oil importer · CIF Avonmouth',
      scenario:
        'A Bristol food wholesaler buys olive oil from an Izmir producer CIF Avonmouth. The producer’s price already contains the sea freight and its insurance to Avonmouth. The wholesaler also buys its own top-up cargo cover, then pays terminal handling at Avonmouth and local delivery.',
      de41: 'CIF · Avonmouth (named port of destination)',
      placeOfIntroduction: 'Avonmouth, the UK port where the goods arrive direct by sea',
      currency: 'EUR',
      rate: 0.86,
      dutyRate: 0,
      lines: [
        ['Seller’s CIF invoice, freight and insurance to Avonmouth included', 18500, 'EUR', 'value'],
        ['Buyer’s extra top-up cargo insurance', 60, 'EUR', 'out'],
        ['Terminal handling at Avonmouth after arrival', 210, 'GBP', 'uk'],
        ['Delivery Avonmouth to the Bristol warehouse', 180, 'GBP', 'uk'],
      ],
      lesson:
        'HMRC needs no transport addition on CIF terms because the price already reaches the UK port. Where the seller insures and the buyer also insures, only the seller’s insurance counts, so the top-up premium stays out. The duty rate here is 0% to show that the import VAT value still picks up the UK costs.',
    },
  },
  {
    code: 'DAP',
    slug: 'dap',
    name: 'Delivered At Place',
    mode: 'Any mode or combination of modes',
    title: 'DAP Incoterms: delivery handoff and customs value',
    description:
      'Use the DAP operational sheet to locate delivery, import-clearance and unloading responsibilities and separate border value from post-import transport.',
    h1: 'DAP: map the destination price back to the UK border.',
    standfirst:
      'DAP can put substantial delivery cost into the seller’s price while leaving UK import clearance and unloading with the buyer. The named place and cost breakdown keep the customs value trail legible.',
    fit: 'Use for any mode when the seller delivers at the named destination ready for unloading and the buyer handles import clearance.',
    risk: 'Risk moves at the named destination when the goods are placed at the buyer’s disposal ready for unloading.',
    seller: ['Export clearance', 'Main carriage', 'Delivery to the named place ready for unloading'],
    buyer: ['UK import clearance and duty', 'Unloading', 'Instructions and evidence for the importer role'],
    valueChecks: [
      'Obtain a cost split for transport before and after the UK border.',
      'Check whether duty, import VAT or unloading appears in the seller’s price.',
      'Name the delivery place precisely; city-only wording can hide the actual handoff.',
      'Retain the carriage invoice and delivery evidence beside the commercial invoice.',
    ],
    phases: [
      ['Export preparation', 'Seller'],
      ['Main carriage', 'Seller'],
      ['UK import clearance', 'Buyer'],
      ['Named place · ready to unload', 'Seller → Buyer risk'],
    ],
    example: {
      title: 'Manchester furniture retailer · DAP Manchester by road',
      scenario:
        'A Manchester retailer buys oak furniture from a Poznań factory DAP Manchester. The factory’s carrier drives the trailer via Calais and Dover. On request, the factory gives a carriage statement that splits the road freight at Dover.',
      de41: 'DAP · Manchester (named place of destination)',
      placeOfIntroduction: 'Dover, where the trailer first passes a UK customs office',
      currency: 'EUR',
      rate: 0.86,
      dutyRate: 0,
      lines: [
        ['DAP price for the furniture, carriage to Manchester included', 29300, 'EUR', 'value'],
        ['UK leg Dover to Manchester, inside the price and shown separately on the carriage statement', 700, 'EUR', 'uk'],
        ['Unloading at the Manchester store, paid by the buyer', 120, 'GBP', 'uk'],
      ],
      lesson:
        'The seller’s DAP price was €30,000. Because the carriage statement shows €700 for the Dover to Manchester leg, that part comes out of the customs value and moves to the import VAT value. Without the statement, the full €30,000 would stay in. This example uses a 0% duty rate, so the result shows how VAT is built.',
    },
  },
  {
    code: 'FCA',
    slug: 'fca',
    name: 'Free Carrier',
    mode: 'Any mode or combination of modes',
    title: 'FCA Incoterms: carrier handoff and customs value',
    description:
      'The FCA workpaper finds the named-place carrier handoff, export-clearance evidence, buyer-paid transport and the additions needed for UK customs value.',
    h1: 'FCA: make the named-place carrier handoff visible.',
    standfirst:
      'FCA works across transport modes and gives containerised movements a clearer carrier handoff than an on-board sea term. Record the exact named place before allocating freight, risk and customs-value evidence.',
    fit: 'Use for any mode when the seller delivers the goods to the carrier or nominated person at the named place.',
    risk: 'Risk moves when delivery to the carrier is completed at the named place.',
    seller: ['Export clearance', 'Delivery to carrier at named place', 'Origin evidence to that handoff'],
    buyer: ['Main carriage', 'Insurance if wanted', 'UK import clearance and onward delivery'],
    valueChecks: [
      'Write the terminal, depot or seller premises into the named-place field.',
      'Confirm who loaded the collecting vehicle when the seller’s premises are named.',
      'Add buyer-paid freight and insurance needed to reach the UK border where required.',
      'Match carrier receipt, transport booking and invoice to the handoff.',
    ],
    phases: [
      ['Export preparation', 'Seller'],
      ['Named place · carrier handoff', 'Seller → Buyer risk'],
      ['Main carriage', 'Buyer'],
      ['UK import and delivery', 'Buyer'],
    ],
    example: {
      title: 'Birmingham engineering firm · FCA seller’s premises, Milan',
      scenario:
        'A Birmingham engineering firm buys hydraulic valves FCA the seller’s Milan premises. The buyer’s own haulier collects, drives via the Channel crossing and delivers to Birmingham. The haulier’s invoice shows the Dover to Birmingham leg separately.',
      de41: 'FCA · seller’s premises, Milan (named place of delivery)',
      placeOfIntroduction: 'Dover, where the vehicle first passes a UK customs office',
      currency: 'EUR',
      rate: 0.86,
      dutyRate: 2,
      lines: [
        ['Seller’s FCA invoice for the valves', 15000, 'EUR', 'value'],
        ['Road freight Milan to Dover, buyer’s haulier', 1070, 'EUR', 'value'],
        ['Road freight Dover to Birmingham, separately shown on the same invoice', 380, 'EUR', 'uk'],
        ['Transit insurance for the whole journey, premium not split', 45, 'EUR', 'value'],
      ],
      lesson:
        'Under FCA the buyer pays the main carriage, so the freight to Dover is added to the invoice price. The UK leg is deducted because the haulier priced it separately. The insurance premium was not split, so all of it stays in the customs value.',
    },
  },
  {
    code: 'DDP',
    slug: 'ddp',
    name: 'Delivered Duty Paid',
    mode: 'Any mode or combination of modes',
    title: 'DDP Incoterms: import duty, VAT and customs value',
    description:
      'Unpack a DDP delivered price into customs value, duty, import VAT and post-border costs, without assuming the trade term sets the valuation method.',
    h1: 'DDP: unpack the delivered price before declaring it.',
    standfirst:
      'DDP puts import clearance and delivery obligations with the seller, but it does not choose the customs valuation method. Separate duty, import VAT and post-border transport from the evidence used to build the border value.',
    fit: 'Use for any mode when the seller undertakes delivery at the named place and handles export and import clearance, including import duties.',
    risk: 'Risk moves at the named destination when the goods are available to the buyer ready for unloading.',
    seller: ['Export and import clearance', 'Main carriage and named-place delivery', 'Import duties under the sale term'],
    buyer: ['Receive ready for unloading', 'Provide agreed importer information', 'Check local VAT and representation treatment'],
    valueChecks: [
      'Request a price build-up separating goods, carriage, duty, import VAT and post-border costs.',
      'Do not treat the Incoterm as a valuation method or commodity-code decision.',
      'Check who can lawfully act as importer and how representation is recorded.',
      'Reconcile any seller-paid duty or VAT with the declaration and commercial record.',
    ],
    phases: [
      ['Export preparation', 'Seller'],
      ['Main carriage', 'Seller'],
      ['UK import clearance + duty', 'Seller'],
      ['Named place · ready to unload', 'Seller → Buyer risk'],
    ],
    example: {
      title: 'Edinburgh retailer · DDP Edinburgh, sea via Leith',
      scenario:
        'A Bergen knitwear maker sells to an Edinburgh retailer DDP Edinburgh. The maker ships to Leith, arranges UK clearance through its representative and builds the duty and import VAT into one delivered price. The retailer asks for the price build-up before it agrees the importer details.',
      de41: 'DDP · Edinburgh (named place of destination)',
      placeOfIntroduction: 'Leith, the UK port where the goods arrive direct by sea',
      currency: 'GBP',
      rate: 1,
      dutyRate: 8,
      lines: [
        ['Goods element of the delivered price', 11500, 'GBP', 'value'],
        ['Sea freight Bergen to Leith', 650, 'GBP', 'value'],
        ['Cargo insurance for the sea leg', 40, 'GBP', 'value'],
        ['Haulage Leith to the Edinburgh shop', 160, 'GBP', 'uk'],
        ['Customs duty already inside the DDP price', null, 'GBP', 'duty'],
        ['Import VAT already inside the DDP price', null, 'GBP', 'vat'],
      ],
      lesson:
        'The delivered price is not the customs value. Strip out the duty, the import VAT and the haulage after Leith, and the border value is the goods plus freight and insurance to Leith. The duty and VAT lines are calculated from that value, so the build-up adds back to the delivered price.',
    },
  },
  {
    code: 'EXW',
    slug: 'exw',
    name: 'Ex Works',
    mode: 'Any mode or combination of modes',
    title: 'EXW Incoterms: buyer-side costs and UK customs value',
    description:
      'EXW and UK customs value: add every buyer-paid cost from the seller’s door to the UK border, from loading to main carriage, with a worked example.',
    h1: 'EXW: every cost after the seller’s door is yours to add.',
    standfirst:
      'Ex Works puts the least on the seller. The buyer loads, clears export, books the main carriage and handles UK import. Each of those costs up to the UK place of introduction belongs in the customs value evidence.',
    fit: 'Use for any mode when the seller makes the goods available at its premises or another named place, not loaded and not cleared for export.',
    risk: 'Risk moves when the goods are placed at the buyer’s disposal at the named place, before loading on the collecting vehicle.',
    seller: ['Goods ready at the named place', 'Packaging and marking for the journey', 'Help with information the buyer needs'],
    buyer: ['Loading at the seller’s premises', 'Export clearance and main carriage', 'UK import clearance and onward delivery'],
    valueChecks: [
      'Add loading at the seller’s premises and all transport in the country of export.',
      'Add main carriage, surcharges and insurance up to the UK place of introduction.',
      'Deduct only UK-leg transport that is charged separately and evidenced.',
      'Tie the collection note, haulier invoice and seller invoice to the same consignment.',
    ],
    phases: [
      ['Goods made available', 'Seller → Buyer risk'],
      ['Loading + export clearance', 'Buyer'],
      ['Main carriage', 'Buyer'],
      ['UK import and delivery', 'Buyer'],
    ],
    example: {
      title: 'Leicester machine shop · EXW Stuttgart',
      scenario:
        'A Leicester machine shop buys spindle parts EXW the maker’s Stuttgart works. The shop’s forwarder pays for loading at the works, then trucks the parts via the Channel crossing to Leicester. The forwarder’s invoice splits the road freight at Dover.',
      de41: 'EXW · Stuttgart works (named place of delivery)',
      placeOfIntroduction: 'Dover, where the vehicle first passes a UK customs office',
      currency: 'EUR',
      rate: 0.86,
      dutyRate: 2.7,
      lines: [
        ['Seller’s EXW invoice for the spindle parts', 12000, 'EUR', 'value'],
        ['Loading at the Stuttgart works, paid by the buyer', 150, 'EUR', 'value'],
        ['Road freight Stuttgart to Dover', 1250, 'EUR', 'value'],
        ['Road freight Dover to Leicester, separately shown', 350, 'EUR', 'uk'],
        ['Transit insurance to the UK border', 90, 'EUR', 'value'],
      ],
      lesson:
        'Ex Works prices leave out everything after the seller’s door. Loading, German haulage, the Channel crossing and insurance all join the customs value. Only the Dover to Leicester leg comes out, because it is priced separately.',
    },
  },
  {
    code: 'FAS',
    slug: 'fas',
    name: 'Free Alongside Ship',
    mode: 'Sea and inland waterway only',
    title: 'FAS Incoterms: quayside handoff and UK customs value',
    description:
      'FAS for bulk sea cargo: map the alongside-ship handoff, add loading, freight and insurance, and keep UK port costs out of the customs value.',
    h1: 'FAS: the quayside handoff comes before loading.',
    standfirst:
      'Under FAS the seller delivers alongside the vessel at the named port of shipment. Loading on board, the sea freight and the insurance are the buyer’s costs, and each one belongs in the UK customs value up to the port of arrival.',
    fit: 'Use for sea or inland-waterway cargo when the seller places the goods alongside the buyer’s vessel at the named port of shipment.',
    risk: 'Risk moves when the goods are alongside the ship, for example on the quay or a barge, at the named port of shipment.',
    seller: ['Export clearance', 'Delivery alongside the nominated vessel', 'Origin costs to the quay'],
    buyer: ['Loading on board', 'Main carriage and insurance', 'UK import clearance and onward delivery'],
    valueChecks: [
      'Add stevedoring or loading on board at the port of shipment.',
      'Add sea freight, bunker and other carrier surcharges to the UK port.',
      'Keep UK port discharge and onward haulage out when they are separately charged.',
      'Match the mate’s receipt or bill of lading to the quayside delivery and the invoice.',
    ],
    phases: [
      ['Export preparation', 'Seller'],
      ['Alongside ship at named port', 'Seller → Buyer risk'],
      ['Loading + main carriage', 'Buyer'],
      ['UK import and delivery', 'Buyer'],
    ],
    example: {
      title: 'Hull timber merchant · FAS Kotka',
      scenario:
        'A Hull timber merchant buys birch plywood FAS Kotka. The merchant charters space, pays the stevedores to load at Kotka, insures the voyage and pays Hull port discharge and haulage to its York yard.',
      de41: 'FAS · Kotka (named port of shipment)',
      placeOfIntroduction: 'Hull, the UK port where the goods arrive direct by sea',
      currency: 'EUR',
      rate: 0.86,
      dutyRate: 0,
      lines: [
        ['Seller’s FAS invoice for the plywood', 40000, 'EUR', 'value'],
        ['Stevedoring to load on board at Kotka', 1200, 'EUR', 'value'],
        ['Sea freight Kotka to Hull', 3800, 'EUR', 'value'],
        ['Marine insurance for the voyage', 160, 'EUR', 'value'],
        ['Discharge at Hull after arrival, separately charged', 900, 'GBP', 'uk'],
        ['Haulage Hull to the York yard', 420, 'GBP', 'uk'],
      ],
      lesson:
        'FAS stops one step earlier than FOB, so the loading cost at Kotka is also the buyer’s and joins the customs value. The Hull costs come after arrival at the place of introduction and move to the import VAT value.',
    },
  },
  {
    code: 'CFR',
    slug: 'cfr',
    name: 'Cost and Freight',
    mode: 'Sea and inland waterway only',
    title: 'CFR Incoterms: seller freight, buyer insurance, UK value',
    description:
      'Use the CFR workpaper to confirm the seller-paid freight to the UK port, add the buyer’s own cargo insurance and build a clean UK customs value trail.',
    h1: 'CFR: freight is in the price. Insurance is not.',
    standfirst:
      'CFR makes the seller pay freight to the named destination port while risk moves on board at the port of shipment. The seller does not have to insure, so any cover the buyer buys for the voyage belongs in the customs value.',
    fit: 'Use for sea or inland-waterway shipments when the seller contracts and pays freight to the named port of destination without an insurance obligation.',
    risk: 'Risk moves when the goods are on board the vessel at the port of shipment, even though the seller pays freight to destination.',
    seller: ['Export clearance', 'Delivery on board', 'Freight to the named destination port'],
    buyer: ['Risk and insurance during the voyage', 'UK import clearance', 'Destination port costs and onward delivery'],
    valueChecks: [
      'Confirm the invoice price includes freight to the named UK port.',
      'Add the buyer’s own voyage insurance premium.',
      'Keep UK port handling and inland delivery out when separately charged.',
      'Check the bill of lading port of discharge matches the named destination.',
    ],
    phases: [
      ['Export preparation', 'Seller'],
      ['On board · risk transfers', 'Seller → Buyer risk'],
      ['Freight to destination port', 'Seller pays'],
      ['UK import and delivery', 'Buyer'],
    ],
    example: {
      title: 'Reading food distributor · CFR Southampton',
      scenario:
        'A Reading distributor buys canned pineapple from a Bangkok packer CFR Southampton. The packer’s price covers the ocean freight. The distributor insures the voyage itself and pays a haulier from Southampton to Reading.',
      de41: 'CFR · Southampton (named place of destination)',
      placeOfIntroduction: 'Southampton, the UK port where the goods arrive direct by sea',
      currency: 'USD',
      rate: 0.77,
      dutyRate: 12,
      lines: [
        ['Seller’s CFR invoice, ocean freight to Southampton included', 21000, 'USD', 'value'],
        ['Buyer’s own voyage insurance premium', 70, 'USD', 'value'],
        ['Haulage Southampton to Reading', 380, 'GBP', 'uk'],
      ],
      lesson:
        'The CFR price already reaches Southampton, so no freight is added. The seller did not insure, so the buyer’s premium is added. That one line is the difference between this CFR value and a CIF value for the same shipment.',
    },
  },
  {
    code: 'CPT',
    slug: 'cpt',
    name: 'Carriage Paid To',
    mode: 'Any mode or combination of modes',
    title: 'CPT Incoterms: carriage to destination and UK value',
    description:
      'CPT and UK customs value: split the UK leg of seller-paid carriage, add the buyer’s insurance and trace the value to the border.',
    h1: 'CPT: the seller pays the carriage. The buyer carries the risk.',
    standfirst:
      'Under CPT the seller pays carriage to the named destination, but risk moves to the buyer when the goods are handed to the first carrier. When the named place is inland in the UK, the UK part of the carriage is the figure to evidence.',
    fit: 'Use for any mode when the seller hands the goods to its carrier and pays carriage to the named place of destination.',
    risk: 'Risk moves when the goods are handed to the first carrier, not at the named destination.',
    seller: ['Export clearance', 'Delivery to the first carrier', 'Carriage to the named destination'],
    buyer: ['Risk and insurance during carriage', 'UK import clearance', 'Unloading where not in the carriage contract'],
    valueChecks: [
      'Find how much of the carriage in the price covers the journey after the UK border.',
      'Deduct that UK leg only when it is shown separately and evidenced.',
      'Add any insurance the buyer buys for the journey to the UK border.',
      'Match the carrier’s receipt and the delivery evidence to the invoice.',
    ],
    phases: [
      ['Export preparation', 'Seller'],
      ['First carrier · risk transfers', 'Seller → Buyer risk'],
      ['Carriage to named place', 'Seller pays'],
      ['UK import clearance', 'Buyer'],
    ],
    example: {
      title: 'Northampton DIY wholesaler · CPT Northampton',
      scenario:
        'A Northampton wholesaler buys garden tools from a Rotterdam distributor CPT Northampton. The distributor’s carrier crosses to Harwich and drives on to Northampton. The invoice shows the carriage, and the Harwich to Northampton leg, as separate lines.',
      de41: 'CPT · Northampton (named place of destination)',
      placeOfIntroduction: 'Harwich, where the goods first pass a UK customs office',
      currency: 'EUR',
      rate: 0.86,
      dutyRate: 2,
      lines: [
        ['Tools at the invoice unit prices', 24900, 'EUR', 'value'],
        ['Carriage Rotterdam to Harwich, inside the CPT price', 810, 'EUR', 'value'],
        ['Carriage Harwich to Northampton, inside the price and shown separately', 290, 'EUR', 'uk'],
        ['Buyer’s transit insurance to Harwich', 55, 'EUR', 'value'],
      ],
      lesson:
        'The CPT invoice total was €26,000. The €290 UK leg comes out because the invoice shows it, and the buyer’s own insurance goes in because risk was the buyer’s from the first carrier.',
    },
  },
  {
    code: 'CIP',
    slug: 'cip',
    name: 'Carriage and Insurance Paid To',
    mode: 'Any mode or combination of modes',
    title: 'CIP Incoterms: seller carriage and insurance, UK value',
    description:
      'CIP and UK customs value: split seller-paid carriage and insurance at the UK border, apportion inland cover and never add a cost twice.',
    h1: 'CIP: split the carriage and the cover at the border.',
    standfirst:
      'CIP adds a seller insurance obligation to CPT. Both the carriage and the policy can run past the UK border to an inland named place, so the evidence needs to show what part of each sits before the place of introduction.',
    fit: 'Use for any mode when the seller pays carriage and contracts insurance to the named place of destination.',
    risk: 'Risk moves when the goods are handed to the first carrier, while the seller’s insurance covers the buyer’s risk during carriage.',
    seller: ['Export clearance', 'Carriage to the named destination', 'Insurance cover for the buyer’s risk in transit'],
    buyer: ['Risk from the first carrier', 'UK import clearance', 'Any extra cover above the contract level'],
    valueChecks: [
      'Confirm carriage and insurance are inside the price before adding anything.',
      'Deduct the UK carriage leg only when the invoice or carrier statement splits it.',
      'Apportion the insurance premium for the UK leg only when the split can be shown.',
      'Do not add the buyer’s extra cover when the seller’s policy already applies.',
    ],
    phases: [
      ['Export preparation', 'Seller'],
      ['First carrier · risk transfers', 'Seller → Buyer risk'],
      ['Carriage + insurance to named place', 'Seller pays'],
      ['UK import clearance', 'Buyer'],
    ],
    example: {
      title: 'Coventry auto-parts plant · CIP Coventry by rail and road',
      scenario:
        'A Coventry plant buys brake assemblies from a Lyon supplier CIP Coventry. The goods travel by rail freight through the Channel Tunnel to Folkestone, then by road to Coventry. The supplier’s invoice splits the carriage at Folkestone and states the insurance premium as one figure.',
      de41: 'CIP · Coventry (named place of destination)',
      placeOfIntroduction: 'Folkestone, where the goods first pass a UK customs office',
      currency: 'EUR',
      rate: 0.86,
      dutyRate: 3,
      lines: [
        ['Brake assemblies at the invoice unit prices', 45580, 'EUR', 'value'],
        ['Carriage Lyon to Folkestone, inside the CIP price', 1850, 'EUR', 'value'],
        ['Carriage Folkestone to Coventry, inside the price and shown separately', 450, 'EUR', 'uk'],
        ['Seller’s cargo insurance to Coventry, premium not split', 120, 'EUR', 'value'],
      ],
      lesson:
        'The CIP total was €48,000. The UK road leg comes out because it is priced on its own line. The premium covers the whole journey but was not split, so all of it stays in the customs value.',
    },
  },
  {
    code: 'DPU',
    slug: 'dpu',
    name: 'Delivered at Place Unloaded',
    mode: 'Any mode or combination of modes',
    title: 'DPU Incoterms: delivered unloaded and UK customs value',
    description:
      'DPU and UK customs value: split transport before and after the border and see which unloading costs can come out, with a worked example.',
    h1: 'DPU: the seller unloads. The value still stops at the border.',
    standfirst:
      'DPU replaced DAT in Incoterms 2020. The seller delivers the goods unloaded at the named place, while the buyer handles UK import clearance. Costs after the UK place of introduction only leave the customs value when the evidence shows them separately.',
    fit: 'Use for any mode when the seller delivers the goods unloaded at the named place of destination and the buyer handles import clearance.',
    risk: 'Risk moves when the goods are unloaded and placed at the buyer’s disposal at the named place of destination.',
    seller: ['Export clearance', 'Main carriage to the named place', 'Unloading at the named place'],
    buyer: ['UK import clearance and duty', 'Importer evidence and instructions', 'Onward handling after delivery'],
    valueChecks: [
      'Ask for a price build-up that splits transport before and after the UK border.',
      'Deduct UK transport only when it is shown separately and evidenced.',
      'Keep unloading in the value when the seller’s price does not show it separately.',
      'Name the delivery place precisely so the unloading point is clear.',
    ],
    phases: [
      ['Export preparation', 'Seller'],
      ['Main carriage', 'Seller'],
      ['UK import clearance', 'Buyer'],
      ['Named place · unloaded', 'Seller → Buyer risk'],
    ],
    example: {
      title: 'Cambridge lab-equipment buyer · DPU Cambridge',
      scenario:
        'A Cambridge research company buys a cold-storage cabinet system from an Aarhus maker DPU at its Cambridge site. The maker ships via Esbjerg and Harwich and unloads with a hired crane. Its quote splits the transport at Harwich but includes the crane in the goods price.',
      de41: 'DPU · Cambridge research site (named place of destination)',
      placeOfIntroduction: 'Harwich, where the goods first pass a UK customs office',
      currency: 'EUR',
      rate: 0.86,
      dutyRate: 2.2,
      lines: [
        ['Equipment price, crane unloading included but not shown separately', 59080, 'EUR', 'value'],
        ['Transport Aarhus to Harwich, inside the DPU price', 2400, 'EUR', 'value'],
        ['Transport Harwich to Cambridge, inside the price and shown separately', 520, 'EUR', 'uk'],
      ],
      lesson:
        'The DPU total was €62,000. The UK transport leg comes out because the quote prices it on its own line. The crane cost stays in because it is not shown separately. A fresh quote with the unloading on its own line gives the evidence to treat it the same way.',
    },
  },
]

const round2 = (value) => Math.round(value * 100) / 100

export function incotermExample(term) {
  const example = term.example
  const toGbp = (amount, currency) => round2(currency === 'GBP' ? amount : amount * example.rate)
  const lines = example.lines.map(([label, amount, currency, treatment]) => ({
    label,
    amount,
    currency,
    treatment,
    gbp: amount === null ? null : toGbp(amount, currency),
  }))
  const customsValue = round2(lines.filter((line) => line.treatment === 'value').reduce((sum, line) => sum + line.gbp, 0))
  const ukCosts = round2(lines.filter((line) => line.treatment === 'uk').reduce((sum, line) => sum + line.gbp, 0))
  const duty = round2((customsValue * example.dutyRate) / 100)
  const vatValue = round2(customsValue + ukCosts + duty)
  const vat = round2(vatValue * 0.2)
  for (const line of lines) {
    if (line.treatment === 'duty') line.gbp = duty
    if (line.treatment === 'vat') line.gbp = vat
  }
  const invoiceTotal = round2(lines.filter((line) => line.treatment !== 'out').reduce((sum, line) => sum + line.gbp, 0))
  return { ...example, lines, customsValue, ukCosts, duty, vatValue, vat, invoiceTotal }
}

const workflowDefinitions = [
  {
    slug: 'gmr-gvms-checklist',
    code: 'GMR / GVMS',
    title: 'GMR and GVMS checklist for a border-ready movement',
    description:
      'Build a Goods Movement Reference handoff from route decision and declaration references through OPEN state, carrier check-in and inspection instructions.',
    h1: 'Build the GMR around the crossing—not after it.',
    standfirst:
      'A GMR brings the movement’s declaration references into one carrier-facing record. This checklist keeps route, reference, vehicle and inspection decisions in the order the movement needs them.',
    direct: 'For a GVMS route, create one GMR for the crossing, include every required declaration reference, reach OPEN state before check-in and follow the inspection instruction after arrival.',
    steps: [
      ['01', 'Confirm the route', 'Check the port and direction use GVMS before the movement is built.'],
      ['02', 'Collect every reference', 'Reconcile import, export, transit and safety-and-security references for all goods carried.'],
      ['03', 'Create and repair the GMR', 'Resolve rule failures until the GMR is OPEN; NOT_FINALISABLE is not ready for check-in.'],
      ['04', 'Match the physical movement', 'Vehicle registration, trailer or container identifiers must match what reaches the carrier.'],
      ['05', 'Present and follow the outcome', 'Give the GMR to the carrier and check whether the goods must report for inspection.'],
    ],
    inputs: ['Port and route', 'Direction of travel', 'Vehicle/trailer/container', 'All declaration and transit references', 'Carrier booking'],
    stop: ['GMR is NOT_FINALISABLE', 'A declaration reference is missing', 'Physical identifiers changed', 'GVMS reports an incident or downtime'],
    sources: [
      source('Create a goods movement reference', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/create-a-goods-movement-reference'),
      source('Goods Vehicle Movement Service', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/collections/goods-vehicle-movement-service'),
      source('GVMS check-in service guide', 'HM Revenue & Customs · Developer Hub', 'https://developer.service.hmrc.gov.uk/guides/gvms-end-to-end-service-guide/documentation/checkin-gmr.html'),
    ],
    related: '/tools/customs-document-pack-check/',
    relatedLabel: 'Run the document pack check',
    extraTools: [['/tools/gmr-checker/', 'Check the GMR and plan its references'], ['/tools/mrn-checker/', 'Check every MRN for the GMR']],
  },
  {
    slug: 'postponed-vat-accounting-checklist',
    code: 'PVA',
    title: 'Postponed VAT Accounting declaration checklist',
    description:
      'Connect the importer instruction, CDS declaration treatment, documentary evidence, monthly postponed import VAT statement and VAT Return reconciliation.',
    h1: 'Make PVA one trace from declaration to VAT Return.',
    standfirst:
      'Postponed VAT Accounting moves the import VAT accounting point; it does not remove the declaration evidence. Keep the importer decision, CDS treatment, statement and VAT Return in one reconcilable trail.',
    direct: 'Confirm eligibility and instruction before declaration, retain the PVA evidence, then reconcile the monthly postponed import VAT statement into the correct VAT Return period.',
    steps: [
      ['01', 'Confirm the importer decision', 'Record that the UK VAT-registered importer will use PVA and that the representative has the instruction.'],
      ['02', 'Build the declaration treatment', 'Use the current CDS completion instructions and keep any manual-calculation evidence with the entry.'],
      ['03', 'Retain the source records', 'Commercial records and the customs declaration support the PVA treatment.'],
      ['04', 'Retrieve the monthly statement', 'Download the postponed import VAT statement from the CDS financial dashboard.'],
      ['05', 'Reconcile the VAT Return', 'Tie statement values, corrections and missing entries to the period before filing.'],
    ],
    inputs: ['UK VAT registration', 'Importer PVA instruction', 'CDS declaration evidence', 'Monthly PVA statement', 'VAT Return period'],
    stop: ['No importer instruction', 'Statement entry does not reconcile', 'Manual calculation lacks evidence', 'Import VAT treatment is unclear'],
    sources: [
      source('Using postponed VAT accounting', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/collections/using-postponed-vat-accounting'),
      source('Complete your VAT Return for import VAT', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/complete-your-vat-return-to-account-for-import-vat'),
      source('Get your postponed import VAT statement', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/get-your-postponed-import-vat-statement'),
    ],
    related: '/tools/customs-value-import-duty-vat-calculator/',
    relatedLabel: 'Cross-foot the import VAT scenario',
    extraTools: [['/tools/postponed-vat-statement-checker/', 'Reconcile the monthly PVA statement']],
  },
  {
    slug: 'ipaffs-import-notification-checklist',
    code: 'IPAFFS',
    title: 'IPAFFS import notification and document handoff checklist',
    description:
      'Route a controlled GB import through commodity scope, risk category, border control post, notification documents and customs-reference handoff.',
    h1: 'Do not let the IPAFFS reference arrive after the goods.',
    standfirst:
      'IPAFFS notifications sit beside commodity, health-document, border-control and customs work. This checklist puts those dependencies into one pre-arrival handoff.',
    direct: 'Identify the commodity and risk route first, select an eligible border control post, submit the notification with its documents on time, then carry the reference into the customs and arrival pack.',
    steps: [
      ['01', 'Classify the control route', 'Identify the product family, origin and current risk category before choosing the notification path.'],
      ['02', 'Check place and time', 'Confirm an eligible border control post and the source-specific pre-notification deadline.'],
      ['03', 'Assemble health evidence', 'Match certificates, commercial documents, commodity lines and transport details.'],
      ['04', 'Submit the IPAFFS notification', 'Upload the required documents and retain the notification reference and version.'],
      ['05', 'Join the arrival handoff', 'Keep IPAFFS, customs declaration, certificates and BCP instructions aligned through arrival.'],
    ],
    inputs: ['Commodity and risk category', 'Origin and destination', 'Border control post', 'Health certificates', 'Arrival date and transport'],
    stop: ['Commodity scope is unresolved', 'BCP does not handle the commodity', 'Certificate and consignment differ', 'Notification deadline is at risk'],
    sources: [
      source('Import of products, animals, food and feed system', 'APHA and Defra · GOV.UK', 'https://www.gov.uk/guidance/import-of-products-animals-food-and-feed-system'),
      source('Import risk categories', 'Defra and APHA · GOV.UK', 'https://www.gov.uk/government/collections/import-risk-categories-for-animals-animal-products-plants-and-plant-products'),
      source('Find a border control post', 'Defra · GOV.UK', 'https://www.gov.uk/government/publications/animals-animal-products-and-hrfnao-imports-authorised-border-control-posts-in-the-uk'),
    ],
    related: '/tools/customs-document-pack-check/',
    relatedLabel: 'Run the document pack check',
    extraTools: [['/tools/commodity-code-checker/', 'Check the commodity code and its document codes']],
  },
  {
    slug: 'ens-ics2-entry-summary-declaration-checklist',
    code: 'ENS / ICS2',
    title: 'ENS and ICS2 Guide: Entry Summary Declaration Checklist UK',
    description:
      'How to make an entry summary declaration (ENS) on S&S GB or ICS2 (Import Control System 2): who files, deadlines by mode, data elements, DNL, amendments.',
    guide: 'ens',
    reviewedOn: '2026-10-16',
    sourcesNote: 'The checklist facts were traced to the source editions checked on 17 July 2026. The step-by-step guide, data, filer and timing tables were checked against the sources marked 15 October 2026. The deadline, Do not load, ICS2 Release 3 and data-supplier sections were checked against the sources marked 16 October 2026. Operational prompts organise the job alongside the current official instruction.',
    h1: 'ENS and ICS2 entry summary declarations: the UK guide and checklist',
    // The previous H1 stays word for word as the subhead (INTENT-REVIEW §4.7).
    subhead: 'Choose the ENS system from the movement—not the habit.',
    faqs: [
      ['What is an ENS?', 'An entry summary declaration is a safety and security filing with advance data about goods coming into Great Britain, into Northern Ireland, or into the EU. Customs uses it for risk analysis before the goods arrive.'],
      ['Who submits the ENS?', 'The carrier is responsible. A forwarder, customs agent or other third party can submit it for the carrier with the carrier’s knowledge and consent, but the legal liability stays with the carrier.'],
      ['What is the difference between ENS and ICS2?', 'The ENS is the declaration. ICS2 is the system that receives it for Northern Ireland and the EU. For Great Britain, the ENS goes to HMRC’s S&S GB service.'],
      ['Can I amend an ENS?', 'Yes, until the goods arrive at the border. If the person lodging it or their representative changes, submit a new declaration instead of an amendment.'],
      ['What do I get when the ENS is accepted?', 'A movement reference number (MRN) from S&S GB or ICS2. Keep it with the shipment and pass it to the arrival team.'],
      ['What is a “Do not load” message?', 'For deep-sea containerised cargo, S&S GB or ICS2 can send a “Do not load” message (IE351 Advanced Intervention Notification) after risk analysis. Do not load the container. UK Border Force contacts you with the next step.'],
      ['When is the ENS deadline for container ships?', '24 hours before the goods are loaded at the port of departure. For short-sea and roll-on roll-off crossings it is 2 hours before arrival.'],
    ],
    standfirst:
      'Great Britain and Northern Ireland movements use different safety-and-security routes. Start with where the goods enter, then lock responsibility, timing, data and amendment ownership.',
    direct: 'Use S&S GB for relevant imports into Great Britain and ICS2 for goods brought into Northern Ireland; submit the complete ENS on time and keep amendment and arrival responsibility explicit.',
    steps: [
      ['01', 'Choose the jurisdiction and system', 'Map the first place of entry and whether S&S GB or ICS2 applies.'],
      ['02', 'Name the responsible party', 'Carrier responsibility remains clear even when a third party prepares the declaration.'],
      ['03', 'Work backwards from arrival', 'Use the current mode-specific time limit and preserve the transport schedule.'],
      ['04', 'Submit and retain the MRN', 'Resolve validation failures and pass the accepted reference into the movement pack.'],
      ['05', 'Own amendments and arrival', 'Update material changes before arrival and complete the required ICS2 arrival/presentation notifications.'],
    ],
    inputs: ['First place of entry', 'Mode and route', 'Carrier and filer', 'Consignment/transport data', 'Arrival schedule'],
    stop: ['System choice is unclear', 'Carrier has not authorised the filer', 'Timing window is missed', 'Diversion or material data changed'],
    sources: [
      source('Entry summary declaration requirements', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/safety-and-security-declarations/safety-and-security-import-requirements-entry-summary-declarations'),
      source('Making an entry summary declaration', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/making-an-entry-summary-declaration'),
      source('S&S import declarations service guide', 'HM Revenue & Customs · Developer Hub', 'https://developer.service.hmrc.gov.uk/guides/safety-and-security-import-declarations-end-to-end-service-guide/'),
      source('Entry summary declaration requirements (time limits and responsibility)', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/safety-and-security-declarations/safety-and-security-import-requirements-entry-summary-declarations#time-limits', '15 OCTOBER 2026'),
      source('Making an entry summary declaration (ICS2 for Northern Ireland, amendments)', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/making-an-entry-summary-declaration#ics2', '15 OCTOBER 2026'),
      source('Import Control System 2 (ICS2)', 'European Commission · Taxation and Customs Union', 'https://taxation-customs.ec.europa.eu/customs-4/customs-security/import-control-system-2-ics2-0_en', '15 OCTOBER 2026'),
      source('Making an entry summary declaration (Do not load messages, data elements file updated 14 October 2026)', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/making-an-entry-summary-declaration#do-not-load-messages', '16 OCTOBER 2026'),
      source('ICS2 frequently asked questions (notifications, referrals, multiple filing)', 'European Commission · Taxation and Customs Union', 'https://taxation-customs.ec.europa.eu/customs-4/customs-security/import-control-system-2-ics2-0/faq_en', '16 OCTOBER 2026'),
    ],
    related: '/tools/customs-document-pack-check/',
    relatedLabel: 'Run the document pack check',
    extraTools: [['/tools/mrn-checker/', 'Decode an ENS or import MRN']],
  },
  {
    slug: 'duty-deferment-account-checklist',
    code: 'DDA',
    title: 'Duty Deferment Account declaration and headroom checklist',
    description:
      'Check DDA authority, guarantee or waiver headroom, CDS declaration references, payment timing and statement reconciliation before clearance is at risk.',
    h1: 'Check DDA headroom before the declaration needs it.',
    standfirst:
      'A Duty Deferment Account can delay payment, but an exhausted limit, missing authority or incorrect declaration reference can delay clearance. Put capacity and permission ahead of submission.',
    direct: 'Confirm account authority and available limit, complete the current CDS deferment fields and authorisation references, then reconcile the monthly statement and payment date.',
    steps: [
      ['01', 'Check account and headroom', 'Confirm the account, guarantee or waiver and remaining monthly capacity for the expected liability.'],
      ['02', 'Confirm representative authority', 'Make sure the declarant is authorised to use the importer’s deferment approval number.'],
      ['03', 'Complete the CDS references', 'Use current 1DAN/2DAN, guarantee and authorisation instructions for the charge treatment.'],
      ['04', 'Watch the clearance response', 'A refused deferment needs a payment or account-resolution path before release.'],
      ['05', 'Reconcile statement and payment', 'Tie declarations and adjustments to the monthly statement and the next payment date.'],
    ],
    inputs: ['DDA number and authority', 'Guarantee/waiver position', 'Expected liability', 'CDS payment references', 'Monthly statement'],
    stop: ['Limit cannot cover the amount', 'Authority is missing', '1DAN/2DAN treatment conflicts', 'Statement does not reconcile'],
    sources: [
      source('How to use your duty deferment account', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/how-to-use-your-duty-deferment-account'),
      source('Set up an account to defer duty payments', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/how-to-set-up-an-account-to-defer-duty-payments-when-you-import-goods'),
      source('CDS DE 2/6 deferred payment instructions', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/publications/cds-uk-trade-tariff-volume-3-import-declaration-completion-guide/group-2-references-of-messages-document-certificates-and-authorisations'),
    ],
    related: '/tools/customs-value-import-duty-vat-calculator/',
    relatedLabel: 'Cross-foot the duty and VAT scenario',
    extraTools: [['/tools/import-duty-repayment-checker/', 'Reclaim overpaid import duty']],
  },
  {
    slug: 't1-ncts-transit-checklist',
    code: 'T1 / NCTS',
    title: 'T1 and NCTS transit movement checklist',
    description:
      'Build a T1 transit handoff from principal and guarantee through NCTS declaration, MRN, offices of departure and destination, presentation and discharge.',
    h1: 'Keep the transit open only as long as the movement is.',
    standfirst:
      'A T1 movement joins the principal, guarantee, NCTS declaration, transport documents and offices of departure and destination. The handoff is not complete until destination evidence closes the movement.',
    direct: 'Name the principal and guarantee, obtain the NCTS MRN and accompanying document, present the goods at departure and destination, and retain discharge evidence until the guarantee is released.',
    steps: [
      ['01', 'Set the transit responsibility', 'Confirm the principal, offices, route and guarantee before lodging the declaration.'],
      ['02', 'Lodge in NCTS', 'Submit complete movement and guarantee data and resolve rejection before presentation.'],
      ['03', 'Release at departure', 'Present goods and documents; retain the MRN/TAD and any seal or itinerary controls.'],
      ['04', 'Carry the movement evidence', 'Keep goods, transport identifiers and accompanying record aligned through offices of transit.'],
      ['05', 'Present and close at destination', 'Obtain arrival/control results and discharge evidence; investigate movements that remain open.'],
    ],
    inputs: ['Principal and EORI', 'Guarantee reference/access', 'Offices and route', 'Goods and transport data', 'MRN/TAD'],
    stop: ['Guarantee validation fails', 'Goods differ from declaration', 'MRN/TAD is unavailable', 'Destination has not discharged the movement'],
    sources: [
      source('New Computerised Transit System supporting guidance', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/publications/the-new-computerised-transit-system-supporting-guidance'),
      source('NCTS guarantees', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/publications/the-new-computerised-transit-system-supporting-guidance/ncts-guarantees'),
      source('How to use the online NCTS', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/publications/the-new-computerised-transit-system-supporting-guidance/how-to-use-the-online-ncts'),
    ],
    related: '/tools/customs-document-pack-check/',
    relatedLabel: 'Run the document pack check',
    extraTools: [['/tools/mrn-checker/', 'Check a transit MRN']],
  },
]

const SEED_TERMS = new Set(['FOB', 'CIF', 'DAP', 'FCA', 'DDP'])

const incotermsHub = {
  kind: 'incoterms-hub',
  path: '/customs-reference/incoterms/',
  title: hubSeo.title,
  description: hubSeo.description,
  h1: hubSeo.h1,
  // The previous H1 stays word for word as the subhead (INTENT-REVIEW §4.3).
  subhead: 'Choose the handoff. Then build the customs value trail.',
  faqs: hubSeo.faqs,
  eyebrow: 'INCOTERMS OPERATIONAL CHOOSER · ALL 11 INCOTERMS 2020 RULES · UK CUSTOMS VALUE',
  standfirst:
    'Incoterms allocate delivery tasks, costs and risk; they do not select the customs valuation method. Use four operational questions to reach a sensible term sheet, then test the actual contract and cost evidence.',
  ref: 'ATLAS 01 · DELIVERY HANDOFFS',
  stamp: '11\nTERMS',
  publishedOn: REVIEWED_ON,
  reviewedOn: INCOTERMS_REVIEWED_ON,
  sources: incotermSources,
}

const burden = {
  kind: 'burden-report',
  path: '/research/hmrc-customs-administrative-burden-explorer-2026/',
  title: 'HMRC customs administrative burden explorer 2026',
  description:
    'Explore HMRC and Ipsos findings from 460 declarants: process time, internal cost, intermediary mix and demand for automated data entry, with accessible downloads.',
  h1: 'What 460 declarants said customs processes cost in time.',
  eyebrow: 'HMRC RESEARCH EXPLORER · 460 DECLARANTS · SOURCE-FAITHFUL',
  standfirst:
    'HMRC’s Wave 2 study found average typical-process time ranging from 19 to 28 minutes and internal cost from £5 to £7. This explorer keeps those published findings separate from Declarix results and the 402-account census.',
  ref: 'PUBLIC STUDY 02 · HMRC / IPSOS',
  stamp: '460\nVOICES',
  reviewedOn: REVIEWED_ON,
  sources: [
    source('Customs Administrative Burden Wave 2', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/publications/customs-administrative-burden-wave-2'),
    source('Wave 2 executive summary', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/publications/customs-administrative-burden-wave-2/customs-administrative-burden-wave-2-executive-summary'),
  ],
}

export const authorityRoutes = [
  incotermsHub,
  ...termDefinitions.map((term) => ({
    ...term,
    // Search-intent title, H1 and meta (INTENT-REVIEW §4.3); the previous H1 stays as the subhead.
    title: incotermsSeo[term.code].title,
    description: incotermsSeo[term.code].description,
    h1: incotermsSeo[term.code].h1,
    subhead: term.h1,
    seo: incotermsSeo[term.code],
    faqs: incotermsSeo[term.code].faqs,
    kind: 'incoterm-term',
    path: `/customs-reference/incoterms/${term.slug}/`,
    eyebrow: `INCOTERMS 2020 · ${term.code} · OPERATIONAL VALUE SHEET`,
    ref: `TERM SHEET · ${term.code}`,
    stamp: `${term.code}\nMAP`,
    publishedOn: SEED_TERMS.has(term.code) ? REVIEWED_ON : INCOTERMS_PUBLISHED_ON,
    reviewedOn: INCOTERMS_REVIEWED_ON,
    sources: incotermSources,
  })),
  burden,
  ...workflowDefinitions.map((workflow, index) => ({
    ...workflow,
    kind: 'workflow',
    path: `/customs-workflows/${workflow.slug}/`,
    eyebrow: `CUSTOMS WORKFLOW · ${workflow.code} · OPERATOR HANDOFF`,
    ref: `WORKFLOW ${String(index + 1).padStart(2, '0')} · ${workflow.code}`,
    stamp: `${workflow.code.replace(' / ', '\n')}`,
    reviewedOn: workflow.reviewedOn || REVIEWED_ON,
  })),
]

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const sourceId = (route) => `sources-${route.path.split('/').filter(Boolean).join('-')}`

function bookingHref(route, placement) {
  const sourceName = `authority_${route.path.split('/').filter(Boolean).join('_')}_${placement}`
  return `/?src=${encodeURIComponent(sourceName)}#book`
}

function jsonLd(route, site) {
  const primaryType = route.kind === 'burden-report' ? 'Report' : route.kind === 'incoterms-hub' ? 'CollectionPage' : 'Article'
  const graph = [
    organizationNode(site),
    {
      '@type': primaryType,
      '@id': `${site.origin}${route.path}#page`,
      url: `${site.origin}${route.path}`,
      name: route.title,
      headline: route.h1,
      description: route.description,
      datePublished: route.publishedOn || REVIEWED_ON,
      dateModified: route.reviewedOn,
      isPartOf: { '@id': `${site.origin}/#website` },
      author: { '@id': `${site.origin}/#organization` },
      publisher: { '@id': `${site.origin}/#organization` },
      citation: route.sources.map((item) => item.url),
    },
    {
      '@type': 'WebSite',
      '@id': `${site.origin}/#website`,
      name: 'Declarix',
      url: `${site.origin}/`,
      publisher: { '@id': `${site.origin}/#organization` },
    },
    breadcrumbList(site, route.path),
  ]
  // FAQPage only mirrors the FAQ that is visible on the page (each item carries data-faq-item).
  if (route.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${site.origin}${route.path}#faq`,
      mainEntity: route.faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
    })
  }
  if (route.kind === 'burden-report') {
    graph.push({
      '@type': 'Dataset',
      '@id': `${site.origin}${route.path}#dataset`,
      name: 'Source-faithful summary of Customs Administrative Burden Wave 2',
      description: 'Published headline findings and ranges from the HMRC/Ipsos survey of 460 declarants. No respondent microdata or Declarix outcomes.',
      creator: { '@id': `${site.origin}/#organization` },
      isBasedOn: route.sources.map((item) => item.url),
      license: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
      distribution: [
        { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${site.origin}/downloads/hmrc-customs-burden-wave-2-summary.csv` },
        { '@type': 'DataDownload', encodingFormat: 'image/svg+xml', contentUrl: `${site.origin}/downloads/hmrc-customs-burden-wave-2-chart.svg` },
      ],
    })
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')
}

function renderSources(route) {
  return `<section class="authority-sources" aria-labelledby="${sourceId(route)}">
    <header><span>PRIMARY SOURCE REGISTER</span><h2 id="${sourceId(route)}">Keep the official page open.</h2><p>${escapeHtml(route.sourcesNote || (route.kind === 'incoterms-hub' || route.kind === 'incoterm-term' ? 'Facts above are traced to the source editions below, each with the date it was checked. Each worked example shows the method with its own amounts, exchange rates and duty rates.' : 'Facts above are traced to the source edition checked on 17 July 2026. Operational prompts organise the job; they do not replace the current official instruction.'))}</p></header>
    <ol>${route.sources.map((item) => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a><span>${escapeHtml(item.publisher)} · CHECKED ${escapeHtml(item.checked)}</span></li>`).join('')}</ol>
  </section>`
}

function wrapSvgText(value, maxCharacters) {
  const lines = []
  for (const word of String(value).split(/\s+/)) {
    const last = lines.at(-1)
    if (!last || `${last} ${word}`.length > maxCharacters) lines.push(word)
    else lines[lines.length - 1] = `${last} ${word}`
  }
  return lines
}

function svgTextLines(value, x, y, maxCharacters, lineHeight, attributes) {
  return wrapSvgText(value, maxCharacters)
    .map((line, index) => `<text x="${x}" y="${y + index * lineHeight}" ${attributes}>${escapeHtml(line)}</text>`)
    .join('')
}

function termSvg(term) {
  const cells = term.phases.map(([phase, owner], index) => {
    const x = 70 + index * 260
    const phaseText = svgTextLines(phase, x + 18, 252, 16, 27, 'font-family="Arial,sans-serif" font-weight="700" font-size="22" fill="#17333d"')
    const ownerText = svgTextLines(owner, x + 18, 318, 20, 21, 'font-family="monospace" font-size="16" fill="#1e7f4d"')
    return `<g><rect x="${x}" y="170" width="220" height="180" fill="${index % 2 ? '#e8e4d8' : '#ffffff'}" stroke="#17333d"/><text x="${x + 18}" y="210" font-family="monospace" font-size="17" fill="#5a6c73">0${index + 1}</text>${phaseText}${ownerText}</g>`
  }).join('')
  const riskText = svgTextLines(term.risk, 70, 466, 88, 27, 'font-family="Arial,sans-serif" font-size="22" fill="#17333d"')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img"><title>${term.code} delivery, cost and risk handoff</title><desc>Four-stage operational map for ${term.name}, showing the responsible party and risk handoff.</desc><rect width="1200" height="630" fill="#f4f1e9"/><rect x="40" y="40" width="1120" height="550" fill="none" stroke="#17333d" stroke-width="2"/><text x="70" y="98" font-family="monospace" font-size="18" fill="#5a6c73">DECLARIX · INCOTERMS OPERATIONAL ATLAS</text><text x="70" y="145" font-family="Arial,sans-serif" font-weight="800" font-size="42" fill="#17333d">${term.code} · ${escapeHtml(term.name)}</text>${cells}<path d="M70 410 H1110" stroke="#c8781c" stroke-width="14"/>${riskText}<text x="70" y="548" font-family="monospace" font-size="15" fill="#5a6c73">SOURCE-LED WORKPAPER · CHECK THE CONTRACT, NAMED PLACE AND CURRENT OFFICIAL GUIDANCE</text></svg>`
}

function workflowSvg(workflow) {
  const rows = workflow.steps.map(([number, title, copy], index) => {
    const y = 130 + index * 86
    const copyText = svgTextLines(copy, 140, y + 24, 92, 19, 'font-family="Arial,sans-serif" font-size="17" fill="#40565f"')
    return `<g><circle cx="90" cy="${y}" r="27" fill="${index === 4 ? '#1e7f4d' : '#c8781c'}"/><text x="90" y="${y + 6}" text-anchor="middle" font-family="monospace" font-size="17" fill="#fff">${number}</text><text x="140" y="${y - 5}" font-family="Arial,sans-serif" font-weight="700" font-size="23" fill="#17333d">${escapeHtml(title)}</text>${copyText}${index < 4 ? `<path d="M90 ${y + 29} V${y + 59}" stroke="#17333d" stroke-width="2"/>` : ''}</g>`
  }).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img"><title>${workflow.code} five-step handoff</title><desc>Five operational checkpoints for ${workflow.title}.</desc><rect width="1200" height="630" fill="#f4f1e9"/><rect x="40" y="40" width="1120" height="550" fill="none" stroke="#17333d" stroke-width="2"/><text x="70" y="86" font-family="monospace" font-size="16" fill="#5a6c73">DECLARIX · CUSTOMS WORKFLOW</text><text x="1110" y="86" text-anchor="end" font-family="monospace" font-weight="700" font-size="19" fill="#17333d">${escapeHtml(workflow.code)}</text>${rows}</svg>`
}

function burdenCsv() {
  return [
    'metric_id,label,value_low,value_high,unit,precision,denominator,source_note',
    'sample,Surveyed declarants,460,460,respondents,exact,460,Random probability telephone survey',
    'intermediary_mix,Customs intermediaries,70,70,percent,published percentage,460,Do not convert weighted percentage to respondent count',
    'trader_mix,Traders,30,30,percent,published percentage,460,Do not convert weighted percentage to respondent count',
    'typical_process_time,Average time per typical process,19,28,minutes,published range,varies by process,GVMS export low and NCTS import high',
    'internal_cost,Internal cost per process,5,7,GBP,published range,varies by process,GVMS export low and other process types high',
    'automation_data_entry,Automated data entry would help,70,70,percent,approximate,varies by process,Approximately 70 percent across process types',
    'no_change_needed,No change needed or already efficient,0,20,percent,upper bound,varies by process,At most one in five',
  ].map((line) => line.split(',').map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n') + '\n'
}

function burdenSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img"><title>HMRC Customs Administrative Burden Wave 2 headline findings</title><desc>Survey of 460 declarants: 70 percent customs intermediaries, typical processes averaging 19 to 28 minutes, internal cost from 5 to 7 pounds, and approximately 70 percent saying automated data entry would help.</desc><rect width="1200" height="630" fill="#f4f1e9"/><rect x="40" y="40" width="1120" height="550" fill="none" stroke="#17333d" stroke-width="2"/><text x="70" y="91" font-family="monospace" font-size="17" fill="#5a6c73">HMRC / IPSOS · WAVE 2 · PUBLISHED 26 FEBRUARY 2026</text><text x="70" y="158" font-family="Arial,sans-serif" font-weight="800" font-size="54" fill="#17333d">460 declarants</text><g transform="translate(70 210)"><rect width="500" height="72" fill="#17333d"/><rect width="350" height="72" fill="#1e7f4d"/><text x="20" y="45" font-family="Arial,sans-serif" font-weight="700" font-size="22" fill="#fff">70% intermediaries</text><text x="518" y="45" font-family="monospace" font-size="19" fill="#17333d">30% traders</text></g><g transform="translate(70 330)"><text y="30" font-family="monospace" font-size="17" fill="#5a6c73">AVERAGE TYPICAL-PROCESS TIME</text><text y="100" font-family="Arial,sans-serif" font-weight="800" font-size="65" fill="#17333d">19–28 min</text></g><g transform="translate(660 330)"><text y="30" font-family="monospace" font-size="17" fill="#5a6c73">INTERNAL COST / PROCESS</text><text y="100" font-family="Arial,sans-serif" font-weight="800" font-size="65" fill="#17333d">£5–£7</text></g><text x="70" y="544" font-family="Arial,sans-serif" font-size="22" fill="#17333d">≈70% across process types said automated data entry would help.</text></svg>`
}

export function authorityAssets(route) {
  if (route.kind === 'incoterms-hub') {
    return [{ href: '/downloads/incoterms-2020-chart-uk.csv', content: incotermsChartCsv() }]
  }
  if (route.kind === 'incoterm-term') {
    return [{ href: `/downloads/incoterms-${route.slug}-operational-map.svg`, content: termSvg(route) }]
  }
  if (route.kind === 'workflow') {
    return [{ href: `/downloads/${route.slug}-workflow.svg`, content: workflowSvg(route) }]
  }
  if (route.kind === 'burden-report') {
    return [
      { href: '/downloads/hmrc-customs-burden-wave-2-summary.csv', content: burdenCsv() },
      { href: '/downloads/hmrc-customs-burden-wave-2-chart.svg', content: burdenSvg() },
    ]
  }
  return []
}

function renderDownload(route, asset, label) {
  const extension = asset.href.split('.').pop().toUpperCase()
  return `<a class="authority-download" download href="${asset.href}" data-authority-download="${route.kind}" data-asset-format="${extension}"><span>${extension}</span><strong>${escapeHtml(label)}</strong><b>DOWNLOAD ↓</b></a>`
}

const ICC_ORDER = ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF']
const termByCode = (code) => termDefinitions.find((term) => term.code === code)
const insuranceShort = (code) => (code === 'CIF' ? 'Seller · ICC (C), 110%' : code === 'CIP' ? 'Seller · ICC (A), 110%' : 'None required')
const chartColumns = ['Rule', 'Full name', 'Mode', 'Risk passes', 'Main freight', 'Insurance', 'Export clearance', 'Import clearance + duty', 'UK customs value']

function chartRow(code) {
  const term = termByCode(code)
  const seo = incotermsSeo[code]
  const o = seo.obligations
  return [code, term.name, seo.modeShort, seo.riskShort, o.carriage[0], insuranceShort(code), o.export[0], o.import[0], seo.chartValue]
}

function incotermsChartCsv() {
  const cell = (value) => `"${String(value).replaceAll('"', '""')}"`
  return [chartColumns, ...ICC_ORDER.map(chartRow)].map((row) => row.map(cell).join(',')).join('\n') + '\n'
}

function renderFaq(route, heading) {
  return `<section class="authority-faq" id="faq" aria-labelledby="faq-heading"><header><span>QUESTIONS</span><h2 id="faq-heading">${escapeHtml(heading)}</h2></header>${route.faqs.map(([question, answer]) => `<div class="authority-faq-item" data-faq-item><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></div>`).join('')}</section>`
}

function renderIncotermsChart(route) {
  const asset = authorityAssets(route)[0]
  const rows = ICC_ORDER.map((code) => {
    const [, name, mode, risk, freight, insurance, exportClearance, importClearance, value] = chartRow(code)
    return `<tr><th scope="row" data-label="Rule"><a href="/customs-reference/incoterms/${code.toLowerCase()}/" data-authority-related="chart_${code.toLowerCase()}">${code}</a></th><td data-label="Full name">${escapeHtml(name)}</td><td data-label="Mode">${escapeHtml(mode)}</td><td data-label="Risk passes">${escapeHtml(risk)}</td><td data-label="Main freight">${escapeHtml(freight)}</td><td data-label="Insurance">${escapeHtml(insurance)}</td><td data-label="Export clearance">${escapeHtml(exportClearance)}</td><td data-label="Import clearance + duty">${escapeHtml(importClearance)}</td><td data-label="UK customs value">${escapeHtml(value)}</td></tr>`
  }).join('')
  return `<section class="incoterms-chart" id="incoterms-chart" aria-labelledby="incoterms-chart-heading"><header><span>INCOTERMS 2020 CHART · ALL 11 RULES</span><h2 id="incoterms-chart-heading">Incoterms 2020 chart: who does what under each rule</h2><p>Read across a row to see who pays the main freight, who must insure, who clears export and UK import, where risk passes, and what to add or take out for the UK customs value.</p></header><div class="table-scroll chart-scroll" tabindex="0" role="region" aria-label="Incoterms 2020 chart"><table><caption>Incoterms 2020 rules: costs, risk, clearance and UK customs value</caption><thead><tr>${chartColumns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><div class="chart-download"><h3>Download the chart</h3><p>Take the chart as a spreadsheet, or print it on one page.</p><div class="chart-download-actions">${renderDownload(route, asset, 'Incoterms 2020 chart for UK trade (CSV)')}<button class="button chart-print" type="button" data-chart-print>PRINT THE CHART</button></div></div></section>`
}

function renderHubSections() {
  const listSections = new Set(['incoterms-2010-vs-2020', 'uk-importers'])
  return hubSeo.sections
    .map(([id, heading, paragraphs]) => `<section class="authority-prose" id="${id}" aria-labelledby="${id}-heading"><h2 id="${id}-heading">${escapeHtml(heading)}</h2>${listSections.has(id) ? `<ul>${paragraphs.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : paragraphs.map((item) => `<p>${escapeHtml(item)}</p>`).join('')}${id === 'uk-importers' ? `<p>Work out the duty and VAT for any of these rules with the <a href="/tools/customs-value-import-duty-vat-calculator/" data-authority-related="duty_calculator">UK import duty and VAT calculator</a>.</p>` : ''}</section>`)
    .join('')
}

function renderIncotermsHub(route) {
  const termRow = (term) => `<a class="term-row" href="/customs-reference/incoterms/${term.slug}/" data-authority-related="term_${term.code.toLowerCase()}"><b>${term.code}</b><span><strong>${term.name}</strong><small>${term.mode}</small></span><em>OPEN SHEET →</em></a>`
  const anyMode = termDefinitions.filter((term) => term.mode.startsWith('Any')).map(termRow).join('')
  const seaOnly = termDefinitions.filter((term) => term.mode.startsWith('Sea')).map(termRow).join('')
  const examples = termDefinitions
    .map((term) => {
      const example = incotermExample(term)
      return `<tr><th scope="row"><a href="/customs-reference/incoterms/${term.slug}/">${term.code}</a></th><td data-label="Example">${escapeHtml(example.title)}</td><td data-label="Place of introduction">${escapeHtml(example.placeOfIntroduction)}</td><td data-label="Customs value">${money(example.customsValue)}</td></tr>`
    })
    .join('')
  return `${renderIncotermsChart(route)}<section class="chooser" aria-labelledby="chooser-heading"><header><span>FOUR-QUESTION CHOOSER</span><h2 id="chooser-heading">Find the closest operational sheet.</h2><p>The result narrows the handoff to inspect. Your contract and the current ICC rules remain decisive.</p></header><form id="incoterms-chooser"><fieldset><legend>1 · Transport mode</legend><label><input type="radio" name="mode" value="sea" required /> Sea / inland waterway only</label><label><input type="radio" name="mode" value="any" /> Any mode or multimodal</label></fieldset><fieldset><legend>2 · Who contracts main carriage?</legend><label><input type="radio" name="carriage" value="seller" required /> Seller</label><label><input type="radio" name="carriage" value="buyer" /> Buyer</label></fieldset><fieldset><legend>3 · Does the seller handle UK import clearance and duties?</legend><label><input type="radio" name="import" value="seller" required /> Yes</label><label><input type="radio" name="import" value="buyer" /> No</label></fieldset><fieldset><legend>4 · Is delivery promised at the destination place?</legend><label><input type="radio" name="destination" value="yes" required /> Yes</label><label><input type="radio" name="destination" value="no" /> No</label></fieldset><button class="button" type="submit">SHOW THE CLOSEST SHEET</button></form><div class="chooser-result" id="chooser-result" aria-live="polite" hidden><span>CLOSEST SHEET TO INSPECT</span><strong id="chooser-code"></strong><p id="chooser-copy"></p><a id="chooser-link" data-authority-related="chooser_result" href="/customs-reference/incoterms/">OPEN THE TERM SHEET →</a></div></section>${renderHubSections()}<section class="term-register" aria-labelledby="term-register-heading"><header><span>FULL ATLAS · INCOTERMS 2020</span><h2 id="term-register-heading">All eleven rules, grouped by transport mode.</h2><p>HMRC groups the rules the same way: seven for any mode of transport and four for sea and inland waterway only.</p></header><h3 class="term-group">Any mode or multimodal · 7 rules</h3>${anyMode}<h3 class="term-group">Sea and inland waterway only · 4 rules</h3>${seaOnly}</section><section class="term-examples" aria-labelledby="term-examples-heading"><header><span>ELEVEN WORKED UK EXAMPLES</span><h2 id="term-examples-heading">One real-world value build for every rule.</h2><p>Each sheet carries its own UK import, its own place of introduction and its own cost split. Each example uses its own amounts, exchange rates and duty rates.</p></header><div class="table-scroll" tabindex="0" role="region" aria-label="Worked example index"><table><caption>Worked customs value examples by Incoterm</caption><thead><tr><th scope="col">Rule</th><th scope="col">Example</th><th scope="col">Place of introduction</th><th scope="col">Customs value</th></tr></thead><tbody>${examples}</tbody></table></div></section><section class="authority-bridge"><span>CUSTOMS VALUE</span><h2>The trade term does not choose the valuation method.</h2><p>Use the term to locate cost and responsibility evidence, then build the value with the applicable valuation method and actual additions or deductions.</p><a data-authority-related="value_workpaper" href="/tools/customs-value-import-duty-vat-calculator/">OPEN THE VALUE + DUTY WORKPAPER →</a></section>${renderFaq(route, 'Incoterms questions, answered')}${referenceLinkStrip('incoterms')}`
}

const money = (value) => `£${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const foreign = (value, currency) => `${{ GBP: '£', EUR: '€', USD: '$' }[currency] || ''}${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

function renderExample(route) {
  const example = incotermExample(route)
  const treatmentLabel = { value: 'In the customs value', uk: 'After the border · import VAT value only', out: 'Outside both values', duty: 'Calculated duty inside the price', vat: 'Calculated import VAT inside the price' }
  const rows = example.lines
    .map((line) => `<tr class="treat-${line.treatment}"><th scope="row">${escapeHtml(line.label)}</th><td data-label="Amount">${line.amount === null ? 'calculated' : foreign(line.amount, line.currency)}</td><td data-label="GBP">${money(line.gbp)}</td><td data-label="Treatment">${treatmentLabel[line.treatment]}</td></tr>`)
    .join('')
  const rateNote = example.currency === 'GBP' ? 'Invoiced in sterling.' : `Example exchange rate: ${example.currency} 1 = £${example.rate}. Use the HMRC rate for the month of import.`
  const totals = [
    ['Customs value', money(example.customsValue)],
    [`Customs duty at ${example.dutyRate}% (example rate)`, money(example.duty)],
    ['UK costs to first destination', money(example.ukCosts)],
    ['Import VAT value (customs value + duty + UK costs)', money(example.vatValue)],
    ['Import VAT at 20%', money(example.vat)],
    ...(route.code === 'DDP' ? [['Delivered price rebuilt from the lines', money(example.invoiceTotal)]] : []),
  ]
  return `<section class="worked-example" aria-labelledby="worked-example-heading"><header><span>WORKED UK EXAMPLE · ${route.code}</span><h2 id="worked-example-heading">${escapeHtml(example.title)}</h2><p>${escapeHtml(example.scenario)}</p></header><dl class="example-facts"><div><dt>DE 4/1 delivery terms</dt><dd>${escapeHtml(example.de41)}</dd></div><div><dt>Place of introduction</dt><dd>${escapeHtml(example.placeOfIntroduction)}</dd></div><div><dt>Currency</dt><dd>${escapeHtml(rateNote)}</dd></div></dl><div class="table-scroll" tabindex="0" role="region" aria-label="${route.code} worked example cost lines"><table><caption>${route.code} cost lines and treatment</caption><thead><tr><th scope="col">Cost line</th><th scope="col">Amount</th><th scope="col">GBP</th><th scope="col">Treatment</th></tr></thead><tbody>${rows}</tbody></table></div><dl class="example-totals">${totals.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${value}</dd></div>`).join('')}</dl><p class="example-lesson"><strong>What this example shows.</strong> ${escapeHtml(example.lesson)}</p></section>`
}

function renderTermSiblings(route) {
  const links = termDefinitions
    .filter((term) => term.code !== route.code)
    .map((term) => `<a href="/customs-reference/incoterms/${term.slug}/" data-authority-related="sibling_${term.code.toLowerCase()}"><b>${term.code}</b> ${escapeHtml(term.name)}</a>`)
    .join('')
  return `<nav class="term-siblings" aria-label="Other Incoterms 2020 sheets"><span>OTHER INCOTERMS 2020 SHEETS</span><div>${links}</div></nav>`
}

function renderObligations(route) {
  const seo = route.seo
  const rows = obligationRows
    .map(([key, label]) => {
      const [party, detail] = seo.obligations[key]
      return `<tr><th scope="row" data-label="Obligation">${escapeHtml(label)}</th><td data-label="Who">${escapeHtml(party)}</td><td data-label="What it means">${escapeHtml(detail)}</td></tr>`
    })
    .join('')
  return `<section class="obligations" aria-labelledby="obligations-heading"><header><span>WHO DOES WHAT · ${route.code}</span><h2 id="obligations-heading">${route.code} obligations: seller vs buyer</h2><p>The Incoterms 2020 split for ${escapeHtml(route.name)}, line by line.</p></header><div class="table-scroll" tabindex="0" role="region" aria-label="${route.code} obligations table"><table><caption>${route.code} (${escapeHtml(route.name)}) obligations under Incoterms 2020</caption><thead><tr><th scope="col">Obligation</th><th scope="col">Who</th><th scope="col">What it means</th></tr></thead><tbody>${rows}<tr><th scope="row" data-label="Obligation">Risk passes at</th><td data-label="Who">Seller → Buyer</td><td data-label="What it means">${escapeHtml(seo.obligations.risk)}</td></tr><tr><th scope="row" data-label="Obligation">Mode</th><td data-label="Who">${escapeHtml(seo.modeShort)}</td><td data-label="What it means">${escapeHtml(route.mode)}.</td></tr></tbody></table></div></section>`
}

function renderUkGlance(route) {
  const o = route.seo.obligations
  const sellerImports = o.import[0] === SELLER
  const carrierParty = o.carriage[0] === SELLER ? 'seller' : 'buyer'
  const items = [
    ['UK importer and declarant', sellerImports ? 'The seller is the importer of record. A seller based outside the UK usually appoints a UK customs agent to make the import declaration on CDS.' : 'The buyer is the importer. The buyer, or its customs agent, makes the import declaration on CDS.'],
    ['UK customs value', route.seo.ukValue],
    ['Import VAT and PVA', sellerImports ? 'The seller pays the import VAT. It can use postponed VAT accounting (PVA) only if it is registered for UK VAT.' : 'The buyer pays the import VAT. A VAT-registered buyer can account for it on its VAT Return with postponed VAT accounting (PVA).'],
    ['EORI', sellerImports ? 'The seller needs a GB EORI number to import into Great Britain.' : 'The buyer needs a GB EORI number to import into Great Britain.'],
    ['Entry summary declaration (ENS)', `The carrier that brings the goods into Great Britain lodges the ENS in S&S GB, or a third party lodges it for the carrier. Under ${route.code} the ${carrierParty} books that carrier.`],
  ]
  return `<aside class="uk-glance" aria-labelledby="uk-glance-heading"><span>UK CUSTOMS AT A GLANCE · ${route.code}</span><h2 id="uk-glance-heading">UK customs at a glance</h2><dl>${items.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl><p>More on the ENS: the <a href="/customs-workflows/ens-ics2-entry-summary-declaration-checklist/" data-authority-related="ens_guide">ENS and ICS2 entry summary declaration guide</a>.</p></aside>`
}

function renderDutyLink(route) {
  return `<section class="duty-link" aria-labelledby="duty-link-heading"><span>DUTY AND VAT · ${route.code}</span><h2 id="duty-link-heading">Work out duty and VAT under ${route.code}</h2><p>Enter the ${route.code} invoice price, the freight and insurance to the UK border and the duty rate in the <a href="/tools/customs-value-import-duty-vat-calculator/" data-authority-related="duty_calculator">UK import duty and VAT calculator</a>. It builds the customs value, the import duty and the import VAT for you.</p></section>`
}

function renderVs(route) {
  return `<section class="term-vs" aria-label="${route.code} compared with other rules">${route.seo.vs.map(([heading, copy], index) => `<article><h2 id="vs-${index + 1}">${escapeHtml(heading)}</h2><p>${escapeHtml(copy)}</p></article>`).join('')}</section>`
}

function renderProsCons(route) {
  const card = (title, items, tone) => `<div class="pc-card pc-${tone}"><h3>${escapeHtml(title)}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>`
  const { advantages, disadvantages } = route.seo
  return `<section class="pros-cons" aria-labelledby="pros-cons-heading"><header><span>BUYER AND SELLER VIEW · ${route.code}</span><h2 id="pros-cons-heading">${route.code} advantages and disadvantages</h2></header><div class="pc-grid">${card('Advantages for the buyer', advantages.buyer, 'plus')}${card('Advantages for the seller', advantages.seller, 'plus')}${card('Disadvantages for the buyer', disadvantages.buyer, 'minus')}${card('Disadvantages for the seller', disadvantages.seller, 'minus')}</div></section>`
}

function renderTerm(route) {
  const asset = authorityAssets(route)[0]
  const phases = route.phases.map(([phase, owner], index) => `<li><span>0${index + 1}</span><strong>${escapeHtml(phase)}</strong><em>${escapeHtml(owner)}</em></li>`).join('')
  return `<section class="direct-answer"><span>DIRECT ANSWER · ${route.code}</span><h2>${escapeHtml(route.fit)}</h2><p>${escapeHtml(route.risk)}</p></section>${renderObligations(route)}${renderUkGlance(route)}${renderDutyLink(route)}<figure class="handoff-map"><figcaption><span>ORIGINAL OPERATIONAL MAP</span><h2>Delivery, cost and risk handoff.</h2></figcaption><ol>${phases}</ol></figure><div class="responsibility-grid"><section><span>SELLER HANDOFF</span><h2>Seller side</h2><ul>${route.seller.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section><section><span>BUYER HANDOFF</span><h2>Buyer side</h2><ul>${route.buyer.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section></div>${renderVs(route)}${renderProsCons(route)}<section class="value-checks"><header><span>VALUE WORKPAPER</span><h2>Four checks before the number moves.</h2><p>Keep the named place, transport evidence and commercial invoice tied to the same consignment.</p></header><ol>${route.valueChecks.map((item, index) => `<li><b>0${index + 1}</b><span>${escapeHtml(item)}</span></li>`).join('')}</ol></section>${renderExample(route)}${renderFaq(route, `${route.code} (${route.name}) questions, answered`)}<div class="download-row">${renderDownload(route, asset, `${route.code} operational map`)}</div><section class="authority-bridge"><span>NEXT WORKPAPER</span><h2>Cross-foot the cost trail.</h2><p>Bring the goods amount, currency direction, freight, insurance and adjustments into one browser-only calculation.</p><a data-authority-related="value_workpaper" href="/tools/customs-value-import-duty-vat-calculator/">OPEN THE VALUE + DUTY WORKPAPER →</a><a data-authority-related="incoterms_hub" href="/customs-reference/incoterms/">BACK TO THE INCOTERMS 2020 CHART</a></section>${renderTermSiblings(route)}${referenceLinkStrip('incoterms')}`
}

function renderBurden(route) {
  const [csv, svg] = authorityAssets(route)
  return `<section class="burden-read"><span>THE 90-SECOND READ</span><h2>Process burden was measured in minutes and internal cost—not software outcomes.</h2><p>HMRC commissioned Ipsos to survey 460 declarants. The published weighted split was 70% customs intermediaries and 30% traders. Fieldwork ran from 21 October 2024 to 17 January 2025.</p></section><section class="burden-metrics" aria-label="Headline findings"><div><span>SURVEY</span><strong>460</strong><small>declarants</small></div><div><span>TYPICAL PROCESS</span><strong>19–28</strong><small>average minutes</small></div><div><span>INTERNAL COST</span><strong>£5–£7</strong><small>per process</small></div><div><span>AUTOMATED DATA ENTRY</span><strong>≈70%</strong><small>said it would help across process types</small></div></section><section class="burden-table" aria-labelledby="burden-table-heading"><header><span>SOURCE-FAITHFUL RANGE</span><h2 id="burden-table-heading">The endpoints HMRC published.</h2><p>Percentages and ranges stay as published. Weighted percentages are not converted into respondent counts.</p></header><div tabindex="0" role="region" aria-label="HMRC burden findings table"><table><caption>Headline Customs Administrative Burden Wave 2 findings</caption><thead><tr><th>Finding</th><th>Published result</th><th>Meaning</th></tr></thead><tbody><tr><th>Declarant mix</th><td>70% intermediaries / 30% traders</td><td>Published weighted split; n=460 study</td></tr><tr><th>Typical-process time</th><td>19–28 minutes average</td><td>GVMS export low; NCTS import high</td></tr><tr><th>Internal process cost</th><td>£5–£7</td><td>GVMS export low; other process types high</td></tr><tr><th>Automated data entry</th><td>Approximately 70%</td><td>Would help across process types</td></tr><tr><th>No change / already efficient</th><td>At most 1 in 5</td><td>Upper bound, not an exact 20%</td></tr></tbody></table></div></section><section class="research-separation"><div><span>HMRC / IPSOS STUDY</span><strong>460 declarants</strong><p>Administrative burden across six customs processes. Published 26 February 2026.</p></div><div><span>DECLARIX SIGNAL REPORT</span><strong>402 qualified accounts</strong><p>A separate public-source market census. It is not survey evidence or a product outcome.</p></div><div><span>DECLARIX WORKED MODEL</span><strong>Your inputs</strong><p>The desk calculator is a scenario, not a result from either research population.</p></div></section><div class="download-row">${renderDownload(route, csv, 'Source-faithful summary data')}${renderDownload(route, svg, 'Press-ready findings chart')}</div><section class="authority-bridge"><span>RUN YOUR OWN DESK NUMBERS</span><h2>Replace the study range with your workflow.</h2><p>Use your volume, preparation time, rework and loaded clerk cost. No Declarix rate is assumed.</p><a data-authority-related="desk_calculator" href="/tools/customs-declaration-cost-calculator/">OPEN THE FREE COST CALCULATOR →</a></section>`
}

function renderWorkflow(route) {
  const asset = authorityAssets(route)[0]
  return `<section class="direct-answer"><span>DIRECT ANSWER · ${escapeHtml(route.code)}</span><h2>${escapeHtml(route.direct)}</h2></section>${route.guide === 'ens' ? renderEnsDeadlines() : ''}<section class="workflow-path" aria-labelledby="workflow-path-heading"><header><span>FIVE-CHECK HANDOFF</span><h2 id="workflow-path-heading">Move the job in order.</h2><p>Each checkpoint produces evidence for the next person or system. A failed checkpoint stays visible.</p></header><ol>${route.steps.map(([number, title, copy]) => `<li><b>${number}</b><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(copy)}</p></div></li>`).join('')}</ol></section><div class="responsibility-grid"><section><span>HAVE READY</span><h2>Inputs</h2><ul>${route.inputs.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section><section><span>STOP AND RESOLVE</span><h2>Do not hand off green</h2><ul>${route.stop.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section></div><div class="download-row">${renderDownload(route, asset, `${route.code} workflow diagram`)}</div><section class="authority-bridge"><span>RELATED DESK JOB</span><h2>Carry the handoff into the pack.</h2><p>The diagram is ungated. Use the related browser workpaper to turn the movement into a reviewable action list.</p><a data-authority-related="workflow_tool" href="${route.related}">${escapeHtml(route.relatedLabel).toUpperCase()} →</a>${(route.extraTools || []).map(([path, label]) => `<a data-authority-related="workflow_free_tool" href="${path}">${escapeHtml(label).toUpperCase()} →</a>`).join('')}</section>`
}

// ENS time limits into Great Britain: GOV.UK "Entry summary declaration requirements", time limits section
// (updated 11 February 2026, checked 16 October 2026).
const ensTimings = [
  ['Maritime containerised cargo', '24 hours before loading at the port of departure'],
  ['Maritime bulk or break bulk cargo', '4 hours before arrival'],
  ['Short-sea journeys', '2 hours before arrival'],
  ['Roll-on roll-off, accompanied or unaccompanied', '2 hours before arrival'],
  ['Short-haul flights (under 4 hours)', 'At the time of actual take-off'],
  ['Long-haul flights (4 hours or more)', '4 hours before arrival'],
  ['Rail, journey under 2 hours', '1 hour before arrival'],
  ['Rail, journey over 2 hours', '2 hours before arrival'],
  ['Road traffic (Channel Tunnel)', '1 hour before arrival at the Eurotunnel terminal (at Coquelles, France)'],
]

const ensTable = (label, head, rows) => `<div tabindex="0" role="region" aria-label="${escapeHtml(label)}"><table><thead><tr>${head.map((cell) => `<th scope="col">${escapeHtml(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map(([first, ...rest]) => `<tr><th scope="row" data-label="${escapeHtml(head[0])}">${escapeHtml(first)}</th>${rest.map((cell, index) => `<td data-label="${escapeHtml(head[index + 1])}">${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`

function renderEnsDeadlines() {
  return `<section class="burden-table ens-guide ens-deadlines" id="ens-timings" aria-labelledby="ens-timings-heading"><header><span>ENS TIME LIMITS BY MODE · GREAT BRITAIN</span><h2 id="ens-timings-heading">ENS deadlines by transport mode</h2><p>HMRC’s minimum ENS time limits for goods entering Great Britain. For delays of more than 2 hours on roll-on roll-off and road, an amendment is not needed if the vehicle moves on the same route with the same carrier within 12 hours of the scheduled departure.</p></header>${ensTable('ENS deadlines by transport mode', ['Mode', 'Lodge the ENS no later than'], ensTimings)}</section>`
}

function renderEnsGuide(route, eoriEnabled) {
  const table = ensTable
  const steps = [
    ['Find the first place of entry', 'Goods entering Great Britain use HMRC’s Safety and Security GB (S&S GB) service. Goods entering Northern Ireland use ICS2, which HMRC uses for movements into Northern Ireland from 31 December 2025. Goods entering the EU use the EU’s ICS2.'],
    ['Confirm who lodges it', 'The carrier is legally responsible. A forwarder, customs agent or other third party can lodge the ENS for the carrier, but only with the carrier’s knowledge and consent. Put that agreement in writing.'],
    ['Collect the data from the documents', 'Take parties, goods descriptions, commodity codes, packages and gross mass from the commercial invoice and packing list, and transport references from the bill of lading, air waybill or CMR.'],
    ['Check the parties and EORI numbers', 'Make sure the consignor, consignee, carrier and person lodging are named correctly, with EORI numbers where they hold them.'],
    ['Work back from arrival', 'Use the time limit for the mode in the table below. For maritime containerised cargo the clock runs from loading at the port of departure, not from arrival.'],
    ['Lodge, fix errors and keep the MRN', 'Submit through S&S GB or ICS2, resolve any validation errors, and record the movement reference number (MRN) returned when the ENS is accepted.'],
    ['Amend before arrival if anything changes', 'You can amend the ENS until the goods arrive at the border. If the person lodging it or their representative changes, submit a new declaration instead of an amendment.'],
    ['Hand the MRN to the arrival team', 'Pass the MRN with the transport schedule and document pack to whoever handles presentation and the import declaration.'],
  ]
  const data = [
    ['Consignor and consignee', 'Full name, address and EORI number where held', 'Commercial invoice'],
    ['Carrier and person lodging', 'Name and EORI number', 'Carrier booking or contract'],
    ['Goods description', 'Plain, specific wording such as “stainless steel ball bearings”, not “general cargo” or “parts”', 'Commercial invoice, packing list'],
    ['Commodity code', 'The goods’ HS code (first 6 digits of the commodity code)', 'Commercial invoice, UK Trade Tariff'],
    ['Packages', 'Number, type and shipping marks', 'Packing list'],
    ['Gross mass', 'Gross weight in kilograms', 'Packing list'],
    ['Transport documents', 'Master and house bill of lading, air waybill or CMR numbers', 'Transport document'],
    ['Container and seals', 'Container or trailer number and seal numbers', 'Transport document, loading record'],
    ['Route and arrival', 'Place of loading, countries of routing, first place of arrival and expected arrival time', 'Carrier schedule'],
  ]
  const filers = [
    ['Carrier', 'Operates the means of transport that brings the goods in: the shipping line, airline, rail operator, haulier (accompanied RoRo and Eurotunnel) or ferry operator (unaccompanied RoRo)', 'Lodges the ENS or makes sure it is lodged on time. The legal requirement lies with the carrier.'],
    ['Third party or house filer', 'Freight forwarder, NVOCC, customs agent or express operator that holds the house-level shipment data', 'May lodge for the carrier with the carrier’s knowledge and contractual agreement. The carrier’s legal liability remains.'],
    ['Both file for one shipment', 'Carrier and third party each submit data', 'Customs may use both declarations for risk analysis, or accept the carrier’s declaration and not the third party’s.'],
  ]
  const systems = [
    ['Great Britain (England, Scotland, Wales)', 'S&S GB, run by HMRC', 'Lodge the ENS through S&S GB; HMRC returns the MRN.'],
    ['Northern Ireland', 'ICS2, run by HMRC for Northern Ireland', 'Used for movements into Northern Ireland from 31 December 2025.'],
    ['EU member states', 'EU ICS2', 'From 1 June 2026, every consignment entering the EU by any means of transport should have a valid ENS, lodged directly in ICS2 or in a combined transit declaration through NCTS Phase 6 in opt-in countries.'],
  ]
  // GOV.UK "Making an entry summary declaration", 'Do not load' messages (updated 14 Oct 2026, checked 16 Oct 2026);
  // EC ICS2 FAQ notifications IE3Q01-IE3Q03 (checked 16 Oct 2026).
  const dnlSteps = [
    ['Stop the load', 'A “Do not load” message (IE351 Advanced Intervention Notification) goes to whoever lodged the ENS. Do not load the container onto the vessel.'],
    ['Find the shipment', 'Identify the affected shipment from the container and transport document numbers in the declaration. If a third party lodged it, the carrier is also told when the ENS carries its EORI number as ocean carrier and its transport document number.'],
    ['Wait for Border Force', 'UK Border Force contacts you to tell you what to do next. Keep the shipper and forwarder informed so the goods and documents stay ready.'],
    ['Answer EU referrals fast', 'In the EU’s ICS2 the person filing can receive a Do Not Load request, an additional information request or a high-risk cargo and mail screening request. Each one must be answered before the risk assessment can resume.'],
    ['Fix the data at source', 'Most holds come from vague goods descriptions, wrong parties or missing references. Correct the invoice or packing list, then amend the ENS before arrival.'],
  ]
  // EC ICS2 page (1 June 2026 statement) and ICS2 FAQ (partial filings, EORI, buyer and seller data), checked 16 Oct 2026.
  const releaseThree = [
    'Your EU carrier or forwarder lodges the ENS. They need an EORI number issued by an EU member state; a UK exporter does not file in ICS2 itself.',
    'Give a precise goods description, such as “men’s cotton knitted T-shirts”. ICS2 rejects vague words such as “parts”, “samples” or “general cargo”.',
    'Give the 6-digit HS code for each goods item.',
    'Give the full name and address of the seller and the buyer, and of the consignor and consignee where they differ.',
    'Give package numbers, package types, shipping marks and gross mass from the packing list.',
    'Where the carrier and a house filer each lodge part of the ENS, they share the carrier’s EORI, the house filer’s EORI and the transport document number in advance so ICS2 can link the filings.',
  ]
  const suppliers = [
    ['Seller and buyer, consignor and consignee', 'Names, addresses and EORI numbers', 'Checks and passes them on', 'Receives them in the house data'],
    ['Goods description and HS code', 'From the commercial invoice', 'Checks the wording is precise', 'Uses the house filer’s data'],
    ['Packages, marks and gross mass', 'From the packing list', 'Checks against the booking', 'Checks against the load'],
    ['House transport document', 'Not applicable', 'Issues the house bill or air waybill', 'Links it to the master document'],
    ['Master transport document, container and seals', 'Seal numbers when it loads the container', 'Passes on the booking reference', 'Issues the master bill and records containers and seals'],
    ['Route, first place of arrival and timing', 'Not applicable', 'Confirms the booking', 'Provides the voyage, flight or crossing details'],
  ]
  const tools = [
    ['/tools/commercial-invoice-generator/', 'FREE GENERATOR', 'Commercial invoice with commodity codes and EORI fields'],
    ['/tools/packing-list-generator/', 'FREE GENERATOR', 'Packing list with packages, marks and gross mass'],
    ['/tools/customs-document-pack-check/', 'FREE TOOL', 'Customs document pack check'],
    ...(eoriEnabled ? [['/tools/eori-checker/', 'FREE CHECKER', 'GB EORI number checker']] : []),
  ]
  return `<section class="burden-table ens-guide" id="ens-guide" aria-labelledby="ens-guide-heading"><header><span>ICS / ENS DECLARATION GUIDE</span><h2 id="ens-guide-heading">ICS2 and ENS declaration guide, step by step</h2><p>An entry summary declaration (ENS) gives customs the safety and security data for goods before they arrive. The carrier is legally responsible for it. Use S&amp;S GB for goods entering Great Britain and ICS2 for goods entering Northern Ireland or the EU.</p></header><ol class="ens-steps">${steps.map(([title, copy], index) => `<li><b>${String(index + 1).padStart(2, '0')}</b><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(copy)}</p></div></li>`).join('')}</ol></section>`
    + `<section class="burden-table ens-guide" id="ens-systems" aria-labelledby="ens-systems-heading"><header><span>S&amp;S GB OR ICS2</span><h2 id="ens-systems-heading">Which ENS system applies</h2><p>The first place of entry decides the system, not the habit of the team filing it.</p></header>${table('Which ENS system applies', ['Goods enter', 'System', 'What it means'], systems)}</section>`
    + `<section class="burden-table ens-guide" id="ens-data" aria-labelledby="ens-data-heading"><header><span>KEY DATA ELEMENTS</span><h2 id="ens-data-heading">Key ENS data elements and where they come from</h2><p>Most ENS rejections and holds trace back to the source documents. Get these right on the invoice, packing list and transport document, and the ENS follows.</p></header>${table('Key ENS data elements', ['Data', 'What to give', 'Usual source'], data)}</section>`
    + `<section class="burden-table ens-guide" id="ens-filers" aria-labelledby="ens-filers-heading"><header><span>WHO FILES WHAT</span><h2 id="ens-filers-heading">Who files the ENS: carrier, house filer or third party</h2><p>HMRC is clear that the carrier holds the legal requirement, even when someone else prepares the data.</p></header>${table('Who files the ENS', ['Party', 'Who that is', 'Position'], filers)}</section>`
    + `<section class="burden-table ens-guide" id="ens-dnl" aria-labelledby="ens-dnl-heading"><header><span>DO NOT LOAD · HIGH RISK</span><h2 id="ens-dnl-heading">‘Do not load’ (DNL) and high-risk messages: what to do</h2><p>Customs runs risk analysis on every ENS. It picks out goods it wants to control on arrival and, for deep-sea containerised cargo only, shipments it wants to stop from being loaded.</p></header><ol class="ens-steps">${dnlSteps.map(([title, copy], index) => `<li><b>${String(index + 1).padStart(2, '0')}</b><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(copy)}</p></div></li>`).join('')}</ol></section>`
    + `<section class="burden-table ens-guide" id="ens-ics2-release-3" aria-labelledby="ens-r3-heading"><header><span>EXPORTS TO THE EU · ICS2</span><h2 id="ens-r3-heading">ICS2 Release 3: what UK exporters to the EU must send</h2><p>Goods going from the UK into the EU need an ENS in the EU’s ICS2, not in S&amp;S GB. ICS2 Release 3 brought sea, inland waterway, road and rail carriers and house filers into ICS2. From 1 June 2026, every consignment entering the EU by any means of transport should have a valid ENS, lodged directly in ICS2 or in a combined transit declaration through NCTS Phase 6 in opt-in countries.</p></header><ul class="ens-list">${releaseThree.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`
    + `<section class="burden-table ens-guide" id="ens-suppliers" aria-labelledby="ens-suppliers-heading"><header><span>DATA SUPPLY CHAIN</span><h2 id="ens-suppliers-heading">Who supplies each data element</h2><p>The person lodging the ENS can only file what the supply chain gives them. Agree who sends each element, and when, before the first shipment.</p></header>${table('Who supplies each ENS data element', ['Data element', 'Shipper (seller or exporter)', 'Forwarder or house filer', 'Carrier'], suppliers)}</section>`
    + `<section class="burden-table ens-guide" id="ens-latest" aria-labelledby="ens-latest-heading"><header><span>LATEST CHANGE</span><h2 id="ens-latest-heading">Latest S&amp;S GB data change</h2><p>HMRC updated the file of entry summary declaration data elements for the S&amp;S GB service on 14 October 2026. Read what changed and what to re-test in the <a href="/research/cds-operations-radar/ics2-ens-data-elements-2026-10-14/" data-authority-related="ens_radar">latest S&amp;S GB data change</a> on the CDS operations radar.</p></header></section>`
    + `<section class="burden-table ens-guide" id="ens-tools" aria-labelledby="ens-tools-heading"><header><span>FREE TOOLS FOR THE ENS DATA</span><h2 id="ens-tools-heading">Build the source documents the ENS depends on</h2><p>Clean commercial invoices and packing lists give the filer the descriptions, commodity codes, packages and weights the ENS needs.</p></header><nav class="ens-tools" aria-label="Free Declarix tools for ENS data">${tools.map(([href, label, title]) => `<a href="${href}" data-authority-related="ens_${href.split('/')[2].replaceAll('-', '_')}"><span>${label}</span><strong>${escapeHtml(title)}</strong><b>OPEN →</b></a>`).join('')}</nav></section>`
    + `<section class="burden-table ens-guide ens-faq" aria-labelledby="ens-faq-heading"><header><span>QUESTIONS</span><h2 id="ens-faq-heading">ENS and ICS2 questions, answered</h2></header>${route.faqs.map(([q, a], index) => `<details class="ens-question" data-faq-item open><summary><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join('')}</section>`
}

function renderWorkflowCluster(currentRoute) {
  const links = workflowDefinitions
    .map((workflow) => {
      const path = `/customs-workflows/${workflow.slug}/`
      const current = path === currentRoute.path ? ' aria-current="page"' : ''
      return `<a href="${path}"${current} data-authority-related="workflow_${workflow.slug}"><span>${escapeHtml(workflow.code)}</span><strong>${escapeHtml(workflow.title)}</strong><em>${path === currentRoute.path ? 'CURRENT CHECKLIST' : 'OPEN CHECKLIST →'}</em></a>`
    })
    .join('')
  return `<section class="workflow-register" aria-labelledby="workflow-register-heading"><header><span>OPERATOR LIBRARY</span><h2 id="workflow-register-heading">Six connected customs workflows.</h2><p>Move between border, VAT, product-control, safety-and-security, payment and transit handoffs without losing the source trail.</p></header><div>${links}</div></section>`
}

function analyticsScript(route, posthogKey, posthogHost) {
  const config = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  const chooser = route.kind === 'incoterms-hub' ? `
    const chooser = document.getElementById('incoterms-chooser');
    chooser.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(chooser);
      const mode = data.get('mode');
      const carriage = data.get('carriage');
      const importer = data.get('import');
      const destination = data.get('destination');
      let code = 'FCA';
      if (importer === 'seller') code = 'DDP';
      else if (destination === 'yes') code = 'DAP';
      else if (mode === 'sea' && carriage === 'seller') code = 'CIF';
      else if (mode === 'sea') code = 'FOB';
      else if (carriage === 'seller') code = 'CPT';
      const copyByCode = { FOB: 'Sea shipment; buyer contracts main carriage after the on-board handoff. If the seller stops at the quayside, compare FAS.', CIF: 'Sea shipment; seller contracts freight and insurance to destination. If the seller does not insure, compare CFR.', DAP: 'Seller delivers to the named place; buyer handles UK import clearance and unloading. If the seller also unloads, compare DPU.', FCA: 'Seller delivers to the carrier at the named place; buyer contracts main carriage. If the buyer also loads at the seller’s premises, compare EXW.', CPT: 'Seller pays carriage to the named place; risk moves at the first carrier. If the seller also insures, compare CIP.', DDP: 'Seller handles delivery and import clearance, including duty under the sale term.' };
      document.getElementById('chooser-code').textContent = code;
      document.getElementById('chooser-copy').textContent = copyByCode[code];
      document.getElementById('chooser-link').href = '/customs-reference/incoterms/' + code.toLowerCase() + '/';
      document.getElementById('chooser-result').hidden = false;
      track('authority_chooser_completed', { result_code: code.toLowerCase() });
    });
    document.querySelectorAll('[data-chart-print]').forEach((button) => button.addEventListener('click', () => {
      document.body.classList.add('print-chart');
      track('authority_chart_printed', {});
      window.print();
    }));
    window.addEventListener('afterprint', () => document.body.classList.remove('print-chart'));` : ''
  return `<script>(() => {
    const config = ${config};
    const get = (key) => { try { return sessionStorage.getItem(key) || ''; } catch { return ''; } };
    const set = (key, value) => { try { sessionStorage.setItem(key, value); } catch {} };
    const attribution = () => { const params = new URLSearchParams(location.search); const incoming = { source: params.get('utm_source') || params.get('src') || '', medium: params.get('utm_medium') || '', campaign: params.get('utm_campaign') || '' }; Object.entries(incoming).forEach(([key,value]) => { if (value && !get('dclrx-' + key)) set('dclrx-' + key, value); }); return Object.fromEntries(Object.keys(incoming).map((key) => [key, get('dclrx-' + key) || (key === 'source' ? 'direct' : 'none')])); };
    const distinctId = get('dclrx-distinct-id') || crypto.randomUUID(); set('dclrx-distinct-id', distinctId);
    const track = (event, properties = {}) => { const payload = { ...attribution(), ...properties, asset_family: '${route.kind}', page_path: location.pathname }; window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event, ...payload }); if (!config.posthogKey) return; const body = JSON.stringify({ api_key: config.posthogKey, event, distinct_id: distinctId, properties: payload }); if (navigator.sendBeacon && navigator.sendBeacon(config.posthogHost + '/capture/', body)) return; fetch(config.posthogHost + '/capture/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => null); };
    document.querySelectorAll('[data-authority-download]').forEach((link) => link.addEventListener('click', () => track('authority_asset_downloaded', { asset_type: link.dataset.authorityDownload, asset_format: link.dataset.assetFormat })));
    document.querySelectorAll('[data-authority-related]').forEach((link) => link.addEventListener('click', () => track('authority_related_clicked', { target: link.dataset.authorityRelated })));
    document.querySelectorAll('[data-authority-booking]').forEach((link) => link.addEventListener('click', () => track('authority_booking_clicked', { placement: link.dataset.authorityBooking })));
    ${chooser}
  })();</script>`
}

export function renderAuthorityRoute(route, site, { navHtml, webmasterHtml, posthogKey = '', posthogHost = 'https://eu.i.posthog.com', eoriEnabled = false }) {
  const canonical = `${site.origin}${route.path}`
  const content = route.kind === 'incoterms-hub' ? renderIncotermsHub(route) : route.kind === 'incoterm-term' ? renderTerm(route) : route.kind === 'burden-report' ? renderBurden(route) : `${renderWorkflow(route)}${route.guide === 'ens' ? renderEnsGuide(route, eoriEnabled) : ''}${renderWorkflowCluster(route)}`
  return `<!doctype html><html lang="en-GB"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><meta name="description" content="${escapeHtml(route.description)}"/><meta name="robots" content="index,follow,max-image-preview:large"/><meta name="theme-color" content="#17333d"/>${webmasterHtml}<link rel="canonical" href="${canonical}"/><link rel="icon" type="image/svg+xml" href="/favicon.svg"/><link rel="apple-touch-icon" href="/apple-touch-icon.png" /><link rel="stylesheet" href="/static-routes.css"/><link rel="stylesheet" href="/authority-library.css"/>${route.kind === 'incoterms-hub' || route.kind === 'incoterm-term' ? '<link rel="stylesheet" href="/customs-reference.css"/>' : ''}<meta property="og:type" content="article"/><meta property="og:site_name" content="Declarix"/><meta property="og:title" content="${escapeHtml(route.title)}"/><meta property="og:description" content="${escapeHtml(route.description)}"/><meta property="og:url" content="${canonical}"/><meta property="og:image" content="${site.origin}/og.jpg"/><meta name="twitter:card" content="summary_large_image"/><title>${escapeHtml(route.title)}</title><script type="application/ld+json">${jsonLd(route, site)}</script></head><body><div class="docket"><header class="masthead"><a class="wordmark" href="/">DECLARIX</a><div class="masthead-cell"><span>FREE AUTHORITY ASSET</span><strong>UNGATED</strong></div><a class="masthead-cta" data-authority-booking="masthead" href="${bookingHref(route, 'masthead')}">BOOK THE NUMBERS CALL</a></header><nav class="route-nav" aria-label="Primary">${navHtml}</nav><div class="breadcrumbs">${breadcrumbHtml(route.path, escapeHtml(route.eyebrow))}</div><main><header class="authority-hero${route.subhead ? ' authority-hero--keyword' : ''}"><div><p class="eyebrow">${escapeHtml(route.eyebrow)}</p><h1>${escapeHtml(route.h1)}</h1>${route.subhead ? `<p class="authority-subhead">${escapeHtml(route.subhead)}</p>` : ''}${route.seo ? `<p class="authority-definition">${escapeHtml(route.seo.definition)}</p>` : ''}<p>${escapeHtml(route.standfirst)}</p></div><aside><span>${escapeHtml(route.ref)}</span><strong>${escapeHtml(route.stamp).replaceAll('\n', '<br/>')}</strong><small>REVIEWED<br/>${route.reviewedOn}</small></aside></header>${content}${renderSources(route)}<section class="cta-band authority-cta"><div><h2>Bring the real workflow to the numbers call.</h2><p>Map the source documents, current handling time, customs system and failure points. Leave with the best first workflow and an ROI range.</p></div><a class="button" data-authority-booking="bottom" href="${bookingHref(route, 'bottom')}">BOOK THE 20-MINUTE NUMBERS CALL</a></section><div class="source-stamp">SOURCE-LED AUTHORITY ASSET · REVIEWED ${route.reviewedOn} · <a href="/editorial-policy/">SOURCES AND CORRECTIONS</a> · <a href="mailto:${site.contact}">${site.contact}</a></div></main><footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav></footer></div>${analyticsScript(route, posthogKey, posthogHost)}</body></html>`
}

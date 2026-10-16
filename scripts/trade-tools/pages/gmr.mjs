import { gmrReferences } from '../gmr.mjs'
import { escapeHtml, source } from '../page-kit.mjs'

const ADDED = '16 OCTOBER 2026'

const gmrExample = gmrReferences({ direction: 'eu_gb', accompanied: true, consignments: 2 })

function widget() {
  // GM1: no default direction. Four large choices, grouped by leaving or arriving in GB.
  const directions = [['gb_eu', 'Leaving GB', 'to the EU'], ['gb_ni', 'Leaving GB', 'to Northern Ireland'], ['eu_gb', 'Arriving in GB', 'from the EU'], ['ni_gb', 'Arriving in GB', 'from Northern Ireland']]
    .map(([value, main, sub]) => `<label><input type="radio" name="direction" value="${value}" required /> <span>${main}<small>${sub}</small></span></label>`).join('')
  return `<section class="tt-panel" aria-labelledby="tt-form-heading">
    <header><span class="section-label">STEP 1 · CHECK THE GMR</span><h2 id="tt-form-heading">Paste the GMR.</h2><p>Confirm the reference has the format GVMS issues before you send it to the driver or the carrier.</p></header>
    <form id="tt-form" class="tt-form" novalidate>
      <label for="gmr-input"><span>GOODS MOVEMENT REFERENCE</span><small>12 characters, for example GMRA000002JR</small></label>
      <div class="tt-input-line"><input id="gmr-input" name="gmr" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="40" placeholder="GMRA000002JR" /><button class="button" type="submit">CHECK GMR</button></div>
    </form>
    <div id="gmr-format-result" class="tt-inline-result" aria-live="polite" hidden></div>
  </section>
  <section class="tt-panel" aria-labelledby="tt-plan-heading">
    <header><span class="section-label">STEP 2 · PLAN THE REFERENCES</span><h2 id="tt-plan-heading">Which references does this crossing need?</h2><p>Choose the direction, then answer three questions. The list follows the GOV.UK guidance for each direction of travel.</p></header>
    <form id="gmr-plan" class="tt-form tt-grid-form" novalidate>
      <fieldset class="tt-choice" id="gmr-direction"><legend>DIRECTION OF TRAVEL: CHOOSE ONE</legend>${directions}</fieldset>
      <fieldset><legend>Is the vehicle accompanied?</legend><label><input type="radio" name="accompanied" value="yes" checked /> Accompanied (driver with the goods)</label><label><input type="radio" name="accompanied" value="no" /> Unaccompanied trailer or container</label></fieldset>
      <fieldset><legend>Which of these apply?</legend><label><input type="checkbox" name="transit" /> Moving under transit (Common Transit Convention)</label><label><input type="checkbox" name="carnet" /> ATA, eATA or TIR carnet</label><label><input type="checkbox" name="eidr" /> Declared in the trader’s own records (EIDR)</label><label><input type="checkbox" name="oralOrEmpty" /> Empty, or goods declared orally or by conduct</label><label><input type="checkbox" name="standaloneExs" /> Leaving GB: some goods have no combined export declaration (for example, from temporary storage after 14 days)</label></fieldset>
      <label for="gmr-consignments"><span>HOW MANY CONSIGNMENTS?</span><small>One declaration reference per consignment</small><input id="gmr-consignments" name="consignments" type="number" inputmode="numeric" min="1" max="50" value="1" /></label>
      <div class="tt-actions"><button class="button" type="submit">LIST THE REFERENCES</button></div>
    </form>
  </section>`
}

function content() {
  const rows = gmrExample.map((item) => `<li><strong>${escapeHtml(item.reference)}</strong><span>${escapeHtml(item.detail)}</span>${item.slots.length ? `<ul class="tt-slots">${item.slots.map((slot) => `<li>${escapeHtml(slot)}</li>`).join('')}</ul>` : ''}</li>`).join('')
  return `<section class="tt-example" aria-labelledby="tt-example-heading">
      <header><span class="section-label">WORKED EXAMPLE</span><h2 id="tt-example-heading">A Calais to Dover lorry with two import declarations.</h2><p>An accompanied vehicle carries two consignments for UK importers, each declared in CDS before the crossing. GMRA000002JR passes the format check. The planner lists what goes into it:</p></header>
      <ol class="tt-cards">${rows}</ol>
      <p class="tt-note">Add both import MRNs, one per declaration, and check each with the <a href="/tools/mrn-checker/">MRN checker</a> first. The carrier validates the GMR with the vehicle registration at check-in.</p>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-before-heading">
      <header><span class="section-label">BEFORE YOU START</span><h2 id="tt-before-heading">What do you need before you create a GMR?</h2><p>You need a GVMS registration and a reference for every consignment on the vehicle. The references depend on the direction of travel.</p></header>
      <div class="tt-table-wrap"><table><caption>References to collect before you create a GMR, by direction</caption><thead><tr><th scope="col">Direction</th><th scope="col">Collect</th><th scope="col">Safety and security</th></tr></thead><tbody>
        <tr><th scope="row">EU → GB</th><td>Vehicle registration (or trailer or container number), and one import MRN per declaration, or the trader’s EORI for goods declared in their own records</td><td>Entry summary MRN optional</td></tr>
        <tr><th scope="row">GB → EU</th><td>Vehicle registration (or trailer or container number), and the DUCR for every combined export declaration in CDS</td><td>Exit summary MRN only when no combined export declaration covers the goods, or for transit</td></tr>
        <tr><th scope="row">GB → NI</th><td>Vehicle registration (or trailer or container number), and one import MRN per declaration</td><td>Entry summary MRN required</td></tr>
        <tr><th scope="row">NI → GB</th><td>Vehicle registration (or trailer or container number), and the DUCR or Export Accompanying Document where an export declaration applies</td><td>Export safety and security MRN for transit movements</td></tr>
      </tbody></table></div>
      <p class="tt-note">Empty trailers and goods declared orally or by conduct still need a GMR: choose the ‘empty’ or ‘oral or by conduct’ option in GVMS. For the full desk routine, use the <a href="/customs-workflows/gmr-gvms-checklist/">GMR and GVMS checklist</a>.</p>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-port-heading">
      <header><span class="section-label">AT THE PORT</span><h2 id="tt-port-heading">GMR status at the port: check-in and ‘inspection required’</h2></header>
      <ul class="tt-cards">
        <li><strong>Check-in</strong><span>The carrier captures and validates the GMR with the vehicle registration, or the trailer or container number. If the GMR is not valid, the haulier cannot embark until the information is correct.</span></li>
        <li><strong>Inspection required</strong><span>For goods coming into the UK, enter the GMR in HMRC’s ‘check if you need to report for an inspection’ service. At Dover and Eurotunnel, held goods go to an inland border facility; at other GVMS locations, to the inspection facility in or near the port.</span></li>
      </ul>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-ports-heading">
      <header><span class="section-label">LOCATIONS</span><h2 id="tt-ports-heading">Which ports use GVMS?</h2><p>GOV.UK lists the ports and carriers. These are the main ones.</p></header>
      <ul class="tt-cards">
        <li><strong>Always GVMS for RoRo into GB</strong><span>Dover, Eurotunnel, Fishguard, Heysham, Holyhead, Liverpool, Pembroke and Newhaven.</span></li>
        <li><strong>GVMS with some carriers</strong><span>Includes Birkenhead, Felixstowe, Harwich, Hull, Immingham, Killingholme, Plymouth, Poole, Portsmouth, Port of Tyne, Purfleet, Teesport, Thamesport and Tilbury. Check with the carrier.</span></li>
        <li><strong>Northern Ireland</strong><span>Belfast with Stena Line, Larne with P&amp;O or Isle of Man Steam Packet Company, and Warrenpoint with Cronus or CLdN.</span></li>
        <li><strong>Leaving GB</strong><span>At Dover (Irish Ferries, P&amp;O, DFDS), Eurotunnel, Holyhead, Liverpool and other listed locations, the export declaration must be ‘arrived’ or ‘pre-lodged’ before the goods start their journey.</span></li>
      </ul>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-format-heading">
      <header><span class="section-label">REFERENCE</span><h2 id="tt-format-heading">GMR, MRN, DUCR: which is which.</h2></header>
      <div class="tt-table-wrap"><table><caption>References used on a GVMS crossing</caption><thead><tr><th scope="col">Reference</th><th scope="col">Format</th><th scope="col">What it identifies</th></tr></thead><tbody>
        <tr><th scope="row">GMR</th><td>GMR + 1 letter + 8 letters or digits (12)</td><td>One vehicle, trailer or container crossing in GVMS</td></tr>
        <tr><th scope="row">MRN</th><td>2 digits + 2 letters + 14 characters (18)</td><td>One import, transit or safety and security declaration</td></tr>
        <tr><th scope="row">DUCR</th><td>Year digit + GB + EORI digits + your reference</td><td>One export consignment declared in CDS</td></tr>
        <tr><th scope="row">EORI</th><td>GB or XI + 12 to 15 digits</td><td>The trader, used in a GMR for goods declared in their own records</td></tr>
      </tbody></table></div>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-states-heading">
      <header><span class="section-label">FROM GMR TO ARRIVAL</span><h2 id="tt-states-heading">Four moments that decide the crossing.</h2></header>
      <ul class="tt-cards">
        <li><strong>Before the port</strong><span>Every reference is in the GMR and GVMS accepts it. Carnet references must be in before the vehicle reaches the port or inland border facility.</span></li>
        <li><strong>Check-in</strong><span>The carrier captures and validates the GMR with the vehicle registration, or the trailer or container number for unaccompanied goods.</span></li>
        <li><strong>Departure</strong><span>After the vessel or train leaves, the carrier tells HMRC which GMRs embarked.</span></li>
        <li><strong>Arrival</strong><span>Use the GMR to check whether the goods must report for an inspection. At Dover and Eurotunnel checks happen at an inland border facility.</span></li>
      </ul>
      <p class="tt-note">For the full five-step desk routine, use the <a href="/customs-workflows/gmr-gvms-checklist/">GMR and GVMS checklist</a>.</p>
    </section>`
}

export default {
  pageFile: 'gmr.mjs',
  id: 'gmr_checker',
  path: '/tools/gmr-checker/',
  shortName: 'GMR checker',
  ref: 'PUBLIC TOOL 07 · GMR',
  title: 'GMR Checker: Check a GVMS Goods Movement Reference (GMR)',
  schemaName: 'Free GMR checker and GVMS reference planner',
  description:
    'Free GMR checker: confirm a GVMS goods movement reference (GMR number) is valid, list every MRN, DUCR and carnet it needs and see what happens at check-in.',
  eyebrow: 'FREE GMR CHECKER · GVMS REFERENCE PLANNER',
  h1: 'GMR checker: check a GMR number and the references it needs',
  subhead: 'Check a GMR and the references it needs.',
  standfirst:
    'Paste a goods movement reference to confirm it has the format GVMS issues. Then choose the direction of travel and the type of movement to get the exact list of declaration references to collect before the vehicle reaches the port.',
  strip: ['GVMS FORMAT CHECK', 'REFERENCES BY DIRECTION', 'COPY THE LIST'],
  stamp: 'GMR\nREADY',
  featureList: [
    'Checks a GMR against the GVMS format GMR + letter + 8 characters',
    'Spots an MRN or DUCR pasted where a GMR belongs',
    'Lists the references GVMS needs for EU→GB, GB→EU, GB→NI and NI→GB movements',
    'Lists one reference line per consignment and copies the list as a ready-to-send message',
    'Covers transit, ATA and TIR carnets, EIDR and oral or by-conduct movements',
  ],
  answer: {
    question: 'What is a GMR?',
    text: 'A goods movement reference (GMR) is the 12-character reference the Goods Vehicle Movement Service (GVMS) creates for one vehicle, trailer or container crossing. It starts with GMR, carries every declaration reference for the goods on board, and the haulier shows it to the carrier at check-in.',
  },
  steps: [
    ['01', 'Check the GMR format', 'Paste the GMR. The checker confirms it is GMR, one letter and eight letters or digits, and flags a pasted MRN or DUCR.'],
    ['02', 'Choose the movement', 'Pick the direction of travel, say how many consignments, and say whether the movement is accompanied, under transit, under a carnet or declared in your own records.'],
    ['03', 'Collect the references', 'The planner lists each reference GVMS asks for, in the order the desk should collect it, with the GOV.UK rule behind it.'],
    ['04', 'Create the GMR in GVMS', 'Sign in to GVMS, add the references, and make sure the GMR is finalised before the vehicle reaches the carrier.'],
  ],
  faqs: [
    ['What does a GMR number look like?', 'A GMR has 12 characters: the letters GMR, one letter, then eight letters or digits, for example GMRA000002JR.'],
    ['Who creates the GMR?', 'The haulier or a person acting for them creates the GMR in the Goods Vehicle Movement Service after registering for GVMS.'],
    ['Do I need a GMR for goods from the EU to Great Britain?', 'Yes at locations that use GVMS: the driver presents a GMR holding the declaration reference, or the reason one is not needed, for each consignment on the vehicle.'],
    ['Can I put the import MRN in a transit GMR?', 'No, GOV.UK says you must not include associated import declaration references in a GMR for goods moving under the Common Transit Convention.'],
    ['How does the carrier check the GMR?', 'The carrier captures and validates the GMR at check-in, with the vehicle registration for accompanied movements or the trailer or container number for unaccompanied ones.'],
    ['Do I need a GMR for an empty vehicle?', 'Yes, an empty trailer needs a GMR for GB to NI, EU to GB and GB to EU movements: choose the ‘empty’ option in GVMS instead of declaration references.'],
    ['Do I need an exit summary declaration for GB to EU?', 'Usually not: a combined export declaration in CDS already carries the safety and security data. A standalone exit summary declaration is needed for goods it does not cover, such as goods in temporary storage for more than 14 days, and for goods moved under transit.'],
    ['What happens after the crossing?', 'For goods coming into the UK, use the GMR to check whether the goods must report for an inspection before you continue the journey.'],
  ],
  sources: [
    source('Create a goods movement reference', 'HM Revenue & Customs · GOV.UK · updated 9 June 2026', 'https://www.gov.uk/guidance/create-a-goods-movement-reference'),
    source('Check if a goods movement reference is valid', 'HM Revenue & Customs · GOV.UK · updated 8 October 2025', 'https://www.gov.uk/guidance/check-if-a-goods-movement-reference-is-valid'),
    source('Goods Movement System Haulier API 1.0 (gmrId format)', 'HM Revenue & Customs · Developer Hub', 'https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/goods-movement-system-haulier-api/1.0'),
    source('List of ports using the Goods Vehicle Movement Service', 'HM Revenue & Customs · GOV.UK · updated 19 August 2026', 'https://www.gov.uk/guidance/list-of-ports-using-the-goods-vehicle-movement-service', ADDED),
    source('Safety and security declarations: exit summary declarations', 'HM Revenue & Customs · GOV.UK · updated 31 January 2025', 'https://www.gov.uk/guidance/safety-and-security-declarations/safety-and-security-export-requirements-exit-summary-declarations', ADDED),
    source('Register for the Goods Vehicle Movement Service', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/register-for-the-goods-vehicle-movement-service'),
    source('Goods Vehicle Movement Service collection', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/collections/goods-vehicle-movement-service'),
  ],
  related: ['/tools/mrn-checker/', '/customs-workflows/gmr-gvms-checklist/', '/tools/commodity-code-checker/'],
  widget,
  content,
  modules: ['gmr'],
  behaviour: `
      const input = document.getElementById('gmr-input');
      const formatResult = document.getElementById('gmr-format-result');
      const plan = document.getElementById('gmr-plan');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const item = checkGmr(input.value);
        formatResult.className = 'tt-inline-result ' + (item.valid ? 'is-pass' : 'is-fail');
        formatResult.innerHTML = '<strong>' + (item.valid ? esc(item.normalised) + ' has the GVMS format.' : 'Check this GMR.') + '</strong>' +
          (item.valid ? '<span>GMR + series letter ' + esc(item.parts.series) + ' + ' + esc(item.parts.sequence) + '. The carrier validates it in GVMS at check-in.</span>' : '<span>' + esc(item.errors.join(' ')) + '</span>') +
          item.hints.map((hint) => '<span>' + esc(hint) + '</span>').join('');
        formatResult.hidden = false;
        track(started ? 'tool_completed' : 'tool_started', { step: 'format', outcome: item.valid ? 'format_pass' : 'format_fail' });
        started = true;
      });
      plan.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(plan);
        const directionField = plan.querySelector('input[name="direction"]');
        if (!data.get('direction')) { directionField.setCustomValidity('Choose the direction of travel.'); directionField.reportValidity(); return; }
        directionField.setCustomValidity('');
        const options = { direction: data.get('direction'), accompanied: data.get('accompanied') === 'yes', transit: data.has('transit'), carnet: data.has('carnet'), eidr: data.has('eidr'), oralOrEmpty: data.has('oralOrEmpty'), standaloneExs: data.has('standaloneExs'), consignments: Number(data.get('consignments')) || 1 };
        const list = gmrReferences(options);
        const count = Math.min(Math.max(Math.round(options.consignments), 1), 50);
        const toCollect = list.filter((item) => item.status !== 'not_needed').reduce((sum, item) => sum + (item.slots.length || 1), 0);
        const statusLabel = { needed: 'NEEDED', not_needed: 'NOT NEEDED', optional: 'OPTIONAL' };
        lastCopy = ['GMR REFERENCES · ' + GMR_DIRECTIONS[options.direction].toUpperCase() + ' · ' + count + ' CONSIGNMENT' + (count === 1 ? '' : 'S'), '', ...list.map((item, index) => (index + 1) + '. ' + item.reference + ' — ' + item.detail + (item.slots.length ? '\\n   ' + item.slots.join('\\n   ') : '')), '', 'Planner: ' + location.origin + location.pathname].join('\\n');
        plan.querySelectorAll('input[name="direction"]').forEach((field) => field.addEventListener('change', () => field.setCustomValidity(''), { once: true }));
        showResult('<header class="tt-verdict is-pass"><span>' + esc(GMR_DIRECTIONS[options.direction].toUpperCase()) + ' · ' + count + ' CONSIGNMENT' + (count === 1 ? '' : 'S') + '</span><h2>' + toCollect + ' references to collect.</h2><p>Add them to the GMR in GVMS before the vehicle reaches the carrier.</p></header><ol class="tt-cards">' +
          list.map((item) => '<li><strong>' + esc(item.reference) + (item.status ? ' · ' + statusLabel[item.status] : '') + '</strong><span>' + esc(item.detail) + '</span>' + (item.slots.length ? '<ul class="tt-slots">' + item.slots.map((slot) => '<li>' + esc(slot) + ': ________</li>').join('') + '</ul>' : '') + '</li>').join('') + '</ol>',
          { direction: options.direction, transit: options.transit, carnet: options.carnet, reference_count: list.length, consignment_count: count },
          { message: gmrMessage(options, list) });
      });
  `,
}

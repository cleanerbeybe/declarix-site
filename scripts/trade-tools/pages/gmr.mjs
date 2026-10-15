import { gmrReferences } from '../gmr.mjs'
import { escapeHtml, source } from '../page-kit.mjs'

const gmrExample = gmrReferences({ direction: 'eu_gb', accompanied: true })

function widget() {
  const options = [['eu_gb', 'EU to Great Britain'], ['gb_eu', 'Great Britain to the EU'], ['gb_ni', 'Great Britain to Northern Ireland'], ['ni_gb', 'Northern Ireland to Great Britain']]
    .map(([value, label]) => `<option value="${value}">${label}</option>`).join('')
  return `<section class="tt-panel" aria-labelledby="tt-form-heading">
    <header><span class="section-label">STEP 1 · CHECK THE GMR</span><h2 id="tt-form-heading">Paste the GMR.</h2><p>Confirm the reference has the format GVMS issues before you send it to the driver or the carrier.</p></header>
    <form id="tt-form" class="tt-form" novalidate>
      <label for="gmr-input"><span>GOODS MOVEMENT REFERENCE</span><small>12 characters, for example GMRA000002JR</small></label>
      <div class="tt-input-line"><input id="gmr-input" name="gmr" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="40" placeholder="GMRA000002JR" /><button class="button" type="submit">CHECK GMR</button></div>
    </form>
    <div id="gmr-format-result" class="tt-inline-result" aria-live="polite" hidden></div>
  </section>
  <section class="tt-panel" aria-labelledby="tt-plan-heading">
    <header><span class="section-label">STEP 2 · PLAN THE REFERENCES</span><h2 id="tt-plan-heading">Which references does this crossing need?</h2><p>Answer four questions. The list follows the GOV.UK guidance for each direction of travel.</p></header>
    <form id="gmr-plan" class="tt-form tt-grid-form" novalidate>
      <label for="gmr-direction"><span>DIRECTION OF TRAVEL</span><select id="gmr-direction" name="direction">${options}</select></label>
      <fieldset><legend>Is the vehicle accompanied?</legend><label><input type="radio" name="accompanied" value="yes" checked /> Accompanied (driver with the goods)</label><label><input type="radio" name="accompanied" value="no" /> Unaccompanied trailer or container</label></fieldset>
      <fieldset><legend>Which of these apply?</legend><label><input type="checkbox" name="transit" /> Moving under transit (Common Transit Convention)</label><label><input type="checkbox" name="carnet" /> ATA, eATA or TIR carnet</label><label><input type="checkbox" name="eidr" /> Declared in the trader’s own records (EIDR)</label><label><input type="checkbox" name="oralOrEmpty" /> Empty, or goods declared orally or by conduct</label></fieldset>
      <div class="tt-actions"><button class="button" type="submit">LIST THE REFERENCES</button></div>
    </form>
  </section>`
}

function content() {
  const rows = gmrExample.map((item) => `<li><strong>${escapeHtml(item.reference)}</strong><span>${escapeHtml(item.detail)}</span></li>`).join('')
  return `<section class="tt-example" aria-labelledby="tt-example-heading">
      <header><span class="section-label">WORKED EXAMPLE</span><h2 id="tt-example-heading">A Calais to Dover lorry with two import declarations.</h2><p>An accompanied vehicle carries two consignments for UK importers, each declared in CDS before the crossing. GMRA000002JR passes the format check. The planner lists what goes into it:</p></header>
      <ol class="tt-cards">${rows}</ol>
      <p class="tt-note">Add both import MRNs, one per declaration, and check each with the <a href="/tools/mrn-checker/">MRN checker</a> first. The carrier validates the GMR with the vehicle registration at check-in.</p>
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
  title: 'GMR checker | Check a GVMS goods movement reference',
  schemaName: 'Free GMR checker and GVMS reference planner',
  description:
    'Free GMR checker: confirm a goods movement reference has the right GVMS format and list every MRN, DUCR and carnet reference your crossing needs.',
  eyebrow: 'FREE GMR CHECKER · GVMS REFERENCE PLANNER',
  h1: 'Check a GMR and the references it needs.',
  standfirst:
    'Paste a goods movement reference to confirm it has the format GVMS issues. Then choose the direction of travel and the type of movement to get the exact list of declaration references to collect before the vehicle reaches the port.',
  strip: ['GVMS FORMAT CHECK', 'REFERENCES BY DIRECTION', 'COPY THE LIST'],
  stamp: 'GMR\nREADY',
  featureList: [
    'Checks a GMR against the GVMS format GMR + letter + 8 characters',
    'Spots an MRN or DUCR pasted where a GMR belongs',
    'Lists the references GVMS needs for EU→GB, GB→EU, GB→NI and NI→GB movements',
    'Covers transit, ATA and TIR carnets, EIDR and oral or by-conduct movements',
  ],
  answer: {
    question: 'What is a GMR?',
    text: 'A goods movement reference (GMR) is the 12-character reference the Goods Vehicle Movement Service (GVMS) creates for one vehicle, trailer or container crossing. It starts with GMR, carries every declaration reference for the goods on board, and the haulier shows it to the carrier at check-in.',
  },
  steps: [
    ['01', 'Check the GMR format', 'Paste the GMR. The checker confirms it is GMR, one letter and eight letters or digits, and flags a pasted MRN or DUCR.'],
    ['02', 'Choose the movement', 'Pick the direction of travel and say whether the movement is accompanied, under transit, under a carnet or declared in your own records.'],
    ['03', 'Collect the references', 'The planner lists each reference GVMS asks for, in the order the desk should collect it, with the GOV.UK rule behind it.'],
    ['04', 'Create the GMR in GVMS', 'Sign in to GVMS, add the references, and make sure the GMR is finalised before the vehicle reaches the carrier.'],
  ],
  faqs: [
    ['What does a GMR number look like?', 'A GMR has 12 characters: the letters GMR, one letter, then eight letters or digits, for example GMRA000002JR.'],
    ['Who creates the GMR?', 'The haulier or a person acting for them creates the GMR in the Goods Vehicle Movement Service after registering for GVMS.'],
    ['Do I need a GMR for goods from the EU to Great Britain?', 'Yes at locations that use GVMS: the driver presents a GMR holding the declaration reference, or the reason one is not needed, for each consignment on the vehicle.'],
    ['Can I put the import MRN in a transit GMR?', 'No, GOV.UK says you must not include associated import declaration references in a GMR for goods moving under the Common Transit Convention.'],
    ['How does the carrier check the GMR?', 'The carrier captures and validates the GMR at check-in, with the vehicle registration for accompanied movements or the trailer or container number for unaccompanied ones.'],
    ['What happens after the crossing?', 'For goods coming into the UK, use the GMR to check whether the goods must report for an inspection before you continue the journey.'],
  ],
  sources: [
    source('Create a goods movement reference', 'HM Revenue & Customs · GOV.UK · updated 9 June 2026', 'https://www.gov.uk/guidance/create-a-goods-movement-reference'),
    source('Check if a goods movement reference is valid', 'HM Revenue & Customs · GOV.UK · updated 8 October 2025', 'https://www.gov.uk/guidance/check-if-a-goods-movement-reference-is-valid'),
    source('Goods Movement System Haulier API 1.0 (gmrId format)', 'HM Revenue & Customs · Developer Hub', 'https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/goods-movement-system-haulier-api/1.0'),
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
        const options = { direction: data.get('direction'), accompanied: data.get('accompanied') === 'yes', transit: data.has('transit'), carnet: data.has('carnet'), eidr: data.has('eidr'), oralOrEmpty: data.has('oralOrEmpty') };
        const list = gmrReferences(options);
        lastCopy = ['GMR REFERENCES · ' + GMR_DIRECTIONS[options.direction].toUpperCase(), '', ...list.map((item, index) => (index + 1) + '. ' + item.reference + ' — ' + item.detail), '', 'Planner: ' + location.origin + location.pathname].join('\\n');
        showResult('<header class="tt-verdict is-pass"><span>' + esc(GMR_DIRECTIONS[options.direction].toUpperCase()) + '</span><h2>' + list.length + ' references to collect.</h2><p>Add them to the GMR in GVMS before the vehicle reaches the carrier.</p></header><ol class="tt-cards">' +
          list.map((item) => '<li><strong>' + esc(item.reference) + '</strong><span>' + esc(item.detail) + '</span></li>').join('') + '</ol>', { direction: options.direction, transit: options.transit, carnet: options.carnet, reference_count: list.length });
      });
  `,
}

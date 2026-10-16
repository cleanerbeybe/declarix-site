import { readFileSync } from 'node:fs'
import { escapeHtml, link, source } from '../page-kit.mjs'

// Issue intent §4.1 (16 Oct 2026): the H1 changed. The previous H1 stays word for word as the
// line under it, and the previous standfirst moves to "What the checker shows" below the tool.
const PREVIOUS_H1 = 'Check a commodity code, its duty and the documents it needs.'
const STANDFIRST =
  'Type the goods description from the invoice or a code you already use. The checker searches the live UK Trade Tariff, shows where the code sits in the tariff, and for the origin you choose gives the third-country duty, any preference, VAT and every document code the tariff attaches.'

export const tariffSnapshot = JSON.parse(readFileSync(new URL('../data/tariff-snapshot.json', import.meta.url), 'utf8'))

function widget() {
  const countries = tariffSnapshot.countries.map((country) => `<option value="${escapeHtml(country.id)}">${escapeHtml(country.name)}</option>`).join('')
  return `<section class="tt-panel" aria-labelledby="tt-form-heading">
    <header><span class="section-label">SEARCH THE LIVE UK TARIFF</span><h2 id="tt-form-heading">Describe the goods or paste a code.</h2><p>Your search goes from your browser straight to the UK Trade Tariff. Choose an origin to see the duty for that country.</p></header>
    <form id="tt-form" class="tt-form" novalidate>
      <label for="tariff-query"><span>COMMODITY CODE FINDER</span><small>Goods description or code, for example “cotton t-shirts”, “wooden dining chairs” or 6109100010</small></label>
      <div class="tt-input-line"><input id="tariff-query" name="q" type="text" autocomplete="off" spellcheck="true" maxlength="120" placeholder="cotton t-shirts" /><button class="button" type="submit">CHECK CODE</button></div>
      <label for="tariff-origin"><span>COUNTRY OF ORIGIN</span><small>Optional: shows preferences and extra duties for that origin</small><select id="tariff-origin" name="origin"><option value="">Any origin (third-country rate)</option>${countries}</select></label>
      <div class="tt-actions"><button class="tt-secondary" type="button" data-tt-example>TRY THE WORKED EXAMPLE</button></div>
    </form>
  </section>`
}

function content() {
  const sections = tariffSnapshot.sections
    .map((section) => {
      const chapters = tariffSnapshot.chapters.filter((chapter) => chapter.code >= section.from && chapter.code <= section.to)
      return `<details class="tt-section"><summary><b>${escapeHtml(section.numeral)}</b>${escapeHtml(section.title)} <small>Chapters ${section.from}–${section.to}</small></summary><ul>${chapters
        .map((chapter) => `<li><a href="https://www.trade-tariff.service.gov.uk/chapters/${chapter.code}"><b>${chapter.code}</b> ${escapeHtml(chapter.title)}</a></li>`)
        .join('')}</ul></details>`
    })
    .join('')
  return `<section class="tt-explainer" aria-labelledby="tt-shows-heading">
      <header><span class="section-label">WHAT THE CHECKER SHOWS</span><h2 id="tt-shows-heading">Duty, VAT, origin proof and document codes for one line.</h2><p>${escapeHtml(STANDFIRST)}</p></header>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-have-code-heading">
      <header><span class="section-label">CHECK A CODE YOU ALREADY HAVE</span><h2 id="tt-have-code-heading">Check a code you already have.</h2><p>Paste the code from a supplier invoice, a previous declaration or your product file into the <a href="#tariff-query">commodity code finder</a>. Spaces and dots are fine.</p></header>
      <ul class="tt-cards">
        <li><strong>10 digits, a declarable end line</strong><span>The result opens with the code and “DECLARABLE END LINE”. This is the code an import declaration needs.</span></li>
        <li><strong>10 digits, not an end line</strong><span>The tariff has subdivisions below it. The checker lists the declarable lines under the heading so you can pick the right one.</span></li>
        <li><strong>8 digits</strong><span>This is a UK export code. For an import, the checker adds 00 and opens the 10-digit line, or lists the lines below it.</span></li>
        <li><strong>4 or 6 digits</strong><span>A heading or an HS subheading. Pick the 10-digit line from the list.</span></li>
      </ul>
      <p class="tt-note">A wrong code means the wrong duty and VAT on the declaration. If you overpaid because of a wrong code, read the ${link('/customs-reference/c285-form/', 'C285 form guide')} or use the ${link('/tools/import-duty-repayment-checker/', 'import duty repayment checker')}.</p>
    </section>
    <section class="tt-example" aria-labelledby="tt-example-heading">
      <header><span class="section-label">WORKED EXAMPLE · CHECKED 15 OCTOBER 2026</span><h2 id="tt-example-heading">Cotton T-shirts: 6109 10 00 10.</h2><p>Search “cotton t-shirts” and the tariff returns 6109 10 00 10, under Section XI (textiles), chapter 61 (knitted or crocheted apparel), heading 6109 (T-shirts, singlets and other vests). The origin changes the answer:</p></header>
      <div class="tt-table-wrap"><table><caption>Cotton T-shirts, 6109 10 00 10, by origin</caption><thead><tr><th scope="col">Origin</th><th scope="col">Duty</th><th scope="col">Document codes the tariff attaches</th></tr></thead><tbody>
        <tr><th scope="row">Any third country, e.g. China</th><td>12.00% third-country duty</td><td>None for the standard rate</td></tr>
        <tr><th scope="row">Israel</th><td>0.00% tariff preference</td><td>Y864: proof of origin statement on the territory of production</td></tr>
        <tr><th scope="row">EU member state</th><td>0.00% tariff preference</td><td>No document code on the measure</td></tr>
        <tr><th scope="row">Russia or Belarus</th><td>12.00% plus 35.00% additional duties</td><td>9014: goods exported from any country before 1 June 2022</td></tr>
      </tbody></table></div>
      <p class="tt-note">VAT is 20%. The supplementary unit is items (p/st), so the declaration also needs the number of T-shirts. Re-run the search above for today’s figures.</p>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-structure-heading">
      <header><span class="section-label">HOW A CODE IS BUILT</span><h2 id="tt-structure-heading">Ten digits, five levels.</h2></header>
      <div class="tt-table-wrap"><table><caption>Structure of a UK import commodity code</caption><thead><tr><th scope="col">Digits</th><th scope="col">Level</th><th scope="col">Example (6109 10 00 10)</th></tr></thead><tbody>
        <tr><th scope="row">1–2</th><td>Chapter</td><td>61 · Apparel, knitted or crocheted</td></tr>
        <tr><th scope="row">1–4</th><td>Heading</td><td>6109 · T-shirts, singlets and other vests</td></tr>
        <tr><th scope="row">1–6</th><td>HS subheading (worldwide)</td><td>6109 10 · Of cotton</td></tr>
        <tr><th scope="row">1–8</th><td>UK export code</td><td>6109 10 00</td></tr>
        <tr><th scope="row">1–10</th><td>UK import commodity code</td><td>6109 10 00 10 · T-shirts</td></tr>
      </tbody></table></div>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-chapters-heading">
      <header><span class="section-label">BROWSE THE TARIFF</span><h2 id="tt-chapters-heading">All ${tariffSnapshot.sections.length} sections and ${tariffSnapshot.chapters.length} chapters.</h2><p>Open a section to see its chapters. Each chapter opens on the official UK Trade Tariff. Snapshot taken ${tariffSnapshot.fetchedOn}.</p></header>
      <div class="tt-sections">${sections}</div>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-hs-taric-heading">
      <header><span class="section-label">THREE NAMES, ONE NUMBER</span><h2 id="tt-hs-taric-heading">Commodity code vs HS code vs TARIC.</h2><p>All three share the same first 6 digits. They differ in who sets the extra digits and where the code is used.</p></header>
      <div class="tt-table-wrap"><table class="tt-compare"><caption>Commodity code, HS code and TARIC code compared</caption><thead><tr><th scope="col">Name</th><th scope="col">Digits</th><th scope="col">Set by</th><th scope="col">Used for</th></tr></thead><tbody>
        <tr><th scope="row">HS code</th><td data-label="Digits">6</td><td data-label="Set by">World Customs Organization (Harmonized System)</td><td data-label="Used for">The same worldwide. A supplier abroad usually quotes this part.</td></tr>
        <tr><th scope="row">UK commodity code</th><td data-label="Digits">8 (exports) or 10 (imports)</td><td data-label="Set by">UK Trade Tariff</td><td data-label="Used for">UK declarations on CDS. It sets UK duty, VAT, preferences and the document codes.</td></tr>
        <tr><th scope="row">TARIC code</th><td data-label="Digits">10</td><td data-label="Set by">European Union (TARIC database)</td><td data-label="Used for">Imports into the EU. Goods moving into Northern Ireland can follow the EU tariff, shown on the Trade Tariff’s Northern Ireland service.</td></tr>
      </tbody></table></div>
      <p class="tt-note">Only the first 6 digits are shared worldwide. If you take a code from an overseas supplier, check how much of it applies in the UK. The ${link('/customs-reference/commodity-code/', 'commodity code guide')} explains each level and how to find a code step by step.</p>
    </section>
    <section class="tt-explainer" aria-labelledby="tt-gri-heading">
      <header><span class="section-label">HOW TO CLASSIFY</span><h2 id="tt-gri-heading">How to classify: the General Interpretative Rules.</h2><p>Every tariff classification follows six rules, applied in order. Most goods are settled by rule 1 and rule 6.</p></header>
      <ol class="tt-gri">
        <li><strong>Rule 1</strong><span>Classify by the wording of the headings and the section and chapter notes. The section and chapter titles are only a guide.</span></li>
        <li><strong>Rule 2</strong><span>(a) Unfinished or unassembled goods are classified as the finished article if they already have its essential character. (b) A heading for a material also covers mixtures and goods made of it.</span></li>
        <li><strong>Rule 3</strong><span>When two headings could apply: (a) the most specific description wins; (b) mixtures and sets go by the material or part that gives the essential character; (c) otherwise, the heading that comes last in number order.</span></li>
        <li><strong>Rule 4</strong><span>Goods that fit no heading go in the heading for the goods they are most like.</span></li>
        <li><strong>Rule 5</strong><span>Fitted cases and normal packing go with the goods they hold.</span></li>
        <li><strong>Rule 6</strong><span>Choose the subheading with the same rules, comparing only subheadings at the same level.</span></li>
      </ol>
      <p class="tt-note">Worked example: men’s knitted cotton T-shirts. Rule 1 puts them in chapter 61 (knitted or crocheted apparel) and heading 6109 (T-shirts). Rule 6 picks 6109 10 (of cotton) and the 10-digit line 6109 10 00 10. For a ruling that binds HMRC, apply for an Advance Tariff Ruling.</p>
    </section>`
}

export default {
  pageFile: 'commodity.mjs',
  id: 'commodity_code_checker',
  path: '/tools/commodity-code-checker/',
  shortName: 'Commodity code checker',
  ref: 'PUBLIC TOOL 10 · TARIFF',
  title: 'Commodity Code Checker UK: HS Code Lookup, Duty and VAT',
  schemaName: 'Free UK commodity code checker',
  description:
    'Free UK commodity code checker on the live UK Trade Tariff: find or check an HS code, see duty, VAT, preferences and the CDS document codes it needs.',
  eyebrow: 'FREE COMMODITY CODE CHECKER · LIVE UK TRADE TARIFF',
  h1: 'Commodity code checker and HS code lookup (UK)',
  standfirst: PREVIOUS_H1,
  strip: ['LIVE UK TRADE TARIFF', 'DUTY + VAT + DOCUMENT CODES', 'NO SIGN-UP'],
  stamp: 'CODE\nCHECKED',
  featureList: [
    'Searches the UK Trade Tariff by goods description or by a 2- to 10-digit code',
    'Shows the code’s place in the tariff: section, chapter, heading and subheadings',
    'Gives third-country duty, preferential rates, additional duties and VAT for a chosen origin',
    'Lists every document code (C, Y, N, U and national 9xxx codes) the tariff attaches for the chosen origin',
    'Shows the proof of origin and DE 2/3 code under each preferential rate',
    'Finds the closest tariff lines for everyday descriptions such as “mens t-shirts cotton knitted”',
    'Checks whether a code you already have is a declarable 10-digit end line',
    'Browses all 21 sections and 98 chapters with a deep link to the official tariff',
  ],
  answer: {
    question: 'What is a commodity code?',
    text: 'A commodity code is the 10-digit number for imports (8 digits for exports) that classifies goods in the UK Trade Tariff. The first 6 digits are the international Harmonized System code; the rest are UK subdivisions. The code sets the duty rate, the VAT rate, any preference for the origin, and the licences and certificates CDS will ask for.',
  },
  steps: [
    ['01', 'Describe the goods', 'Type what the goods are, what they are made of and what they are for, or paste a code from a previous declaration or a supplier invoice.'],
    ['02', 'Pick the closest line', 'The checker lists matching codes with their full tariff path. Open a heading to see every declarable 10-digit line under it.'],
    ['03', 'Choose the origin', 'Select the country of origin to see the duty that applies: a preference where the UK has one, or the third-country rate.'],
    ['04', 'Collect the documents', 'Note every document code the tariff attaches, then check the rest of the shipment with the free pack check.'],
  ],
  faqs: [
    ['How many digits does a UK commodity code have?', 'Imports use a 10-digit commodity code and exports use an 8-digit code.'],
    ['Is the HS code the same as the commodity code?', 'The HS code is the first 6 digits, which are the same worldwide; the UK commodity code adds 4 more digits for UK duty and controls.'],
    ['Where does the duty rate come from?', 'The checker reads the third-country duty, preferences and VAT from the live UK Trade Tariff each time you search.'],
    ['What are document codes such as Y, C, N and 9xxx?', 'They are the CDS codes for certificates, licences, proofs of origin and exemptions that a measure on the tariff line can require in data element 2/3.'],
    ['How do I get a legally binding decision on a code?', 'Apply to HMRC for an Advance Tariff Ruling, which binds HMRC and you for the goods described.'],
    ['What happens if I use the wrong commodity code?', 'The duty, VAT and document codes on the declaration are wrong too: HMRC can recover duty that was underpaid, and you can claim back overpaid import duty with a CDS claim or form C285 within 3 years.'],
    ['Is this the same as the HMRC Trade Tariff?', 'Yes, it reads the live UK Trade Tariff each time you search, then adds the document codes and the proof of origin for the origin you choose.'],
    ['What proof of origin do I need for a preferential rate?', 'It depends on the trade agreement or scheme: the checker shows the accepted proofs under each preferential rate, such as an origin declaration (code 9001) or Form A (code N865) for DCTS goods from Bangladesh.'],
    ['Does the checker store what I search for?', 'No, your search goes from your browser straight to the UK Trade Tariff and Declarix does not record it.'],
  ],
  sources: [
    source('UK Trade Tariff API documentation', 'HM Revenue & Customs · Trade Tariff', 'https://docs.trade-tariff.service.gov.uk/'),
    source('Finding commodity codes for imports or exports', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/finding-commodity-codes-for-imports-or-exports'),
    source('Check what you’ll need to get a legally binding decision on a commodity code', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/check-what-youll-need-to-get-a-legally-binding-decision-on-a-commodity-code'),
    source('Trade Tariff: look up commodity codes, duty and VAT rates', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/trade-tariff'),
    source('UK Trade Tariff rules of origin API (proofs and DE 2/3 proof codes per scheme)', 'HM Revenue & Customs · Trade Tariff', 'https://www.trade-tariff.service.gov.uk/uk/api/rules_of_origin_schemes/610910/BD', '16 OCTOBER 2026'),
    source('Get proof of origin for your goods', 'HM Revenue & Customs · GOV.UK · updated 6 November 2024', 'https://www.gov.uk/guidance/get-proof-of-origin-for-your-goods', '16 OCTOBER 2026'),
    source('Reference Document for The Customs Tariff (Establishment) (EU Exit) Regulations 2020 (General Interpretative Rules)', 'HM Treasury and HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/government/publications/reference-document-for-the-customs-tariff-establishment-eu-exit-regulations-2020', '16 OCTOBER 2026'),
    source('How to claim a repayment of import duty and VAT if you’ve overpaid', 'HM Revenue & Customs · GOV.UK · updated 1 September 2026', 'https://www.gov.uk/guidance/how-to-claim-a-repayment-of-import-duty-and-vat-if-youve-overpaid', '16 OCTOBER 2026'),
  ],
  related: ['/tools/customs-value-import-duty-vat-calculator/', '/tools/import-duty-repayment-checker/', '/tools/gmr-checker/'],
  widget,
  content,
  modules: ['tariff'],
  behaviour: `
      const input = document.getElementById('tariff-query');
      const origin = document.getElementById('tariff-origin');
      const cache = new Map();
      let closestNote = '';
      const outLink = (cls, url, label) => { const a = document.createElement('a'); a.className = cls; a.href = url; a.textContent = label; return a.outerHTML; };
      // Issue CC6: Copy and Print show only on a result worth keeping.
      const applyResultActions = (show) => ['tt-copy', 'tt-print'].forEach((id) => { const button = document.getElementById(id); if (button) button.hidden = !show; });
      // The shell's showResult() resets the buttons, so apply the choice again once the result is on screen.
      const setResultActions = (show) => { applyResultActions(show); setTimeout(() => applyResultActions(show), 0); };
      const takeNote = () => { const note = closestNote; closestNote = ''; return note; };
      const getJson = async (path) => {
        if (cache.has(path)) return cache.get(path);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12000);
        try {
          const response = await fetch(TARIFF_API + path, { headers: { Accept: 'application/json' }, credentials: 'omit', signal: controller.signal });
          if (response.status === 404) return null;
          if (!response.ok) throw new Error('tariff ' + response.status);
          const json = await response.json();
          cache.set(path, json);
          return json;
        } finally { clearTimeout(timer); }
      };
      const fallback = (query) => {
        setResultActions(false);
        showResult('<header class="tt-verdict is-fail"><span>OPEN THE OFFICIAL TARIFF</span><h2>The live tariff did not answer just now.</h2><p>Run the same search on the UK Trade Tariff, or browse the chapters below.</p></header><div class="tt-actions">' + outLink('button', searchLink(query), 'SEARCH “' + String(query).toUpperCase() + '” ON THE UK TRADE TARIFF ↗') + '</div>', { outcome: 'tariff_unavailable' });
      };
      const rulesOfOrigin = async (code, country) => {
        try { const json = await getJson('/rules_of_origin_schemes/' + code.slice(0, 6) + '/' + country); return json ? parseRulesOfOrigin(json) : []; }
        catch { return []; }
      };
      const docTable = (caption, docs) => '<div class="tt-table-wrap"><table class="tt-doc-table"><caption>' + esc(caption) + '</caption><thead><tr><th scope="col">Code</th><th scope="col">Document</th><th scope="col">Measure</th></tr></thead><tbody>' +
        docs.map((d) => '<tr><th scope="row" data-label="Code"><code>' + esc(d.code) + '</code></th><td data-label="Document">' + esc(d.description) + '</td><td data-label="Measure">' + esc((d.measures || []).join(', ')) + '</td></tr>').join('') + '</tbody></table></div>';
      const showCommodity = async (code, typed) => {
        const json = await getJson('/commodities/' + code);
        if (!json) { await showHeading(code.slice(0, 4), typed ? code : ''); return; }
        const c = parseCommodity(json, { origin: origin.value });
        const originName = origin.value ? origin.options[origin.selectedIndex].text : '';
        const schemes = c.originPreference.length ? await rulesOfOrigin(c.code, origin.value) : [];
        const proofs = c.originPreference.map((p) => originProofLine(schemes, p.documents));
        const note = takeNote();
        let html = note + '<header class="tt-verdict is-pass"><span>UK TRADE TARIFF · ' + (c.declarable ? 'DECLARABLE END LINE' : 'NOT A DECLARABLE LINE') + '</span><h2>' + esc(c.description) + '</h2>' +
          '<p class="tt-code-line"><b class="tt-code">' + esc(c.formatted) + '</b><button class="tt-secondary tt-copy-code" type="button" data-copy-code="' + esc(c.code) + '">COPY CODE</button></p>' +
          '<p>' + esc(c.path.join(' › ')) + '</p></header>';
        html += '<dl class="tt-facts">' +
          '<div><dt>Third-country duty</dt><dd>' + esc(c.thirdCountryDuty || '–') + '</dd></div>' +
          (origin.value ? '<div class="tt-fact-wide"><dt>Preference from ' + esc(originName) + '</dt><dd>' + (c.originPreference.length ? c.originPreference.map((p, i) => '<span class="tt-pref-rate">' + esc(p.duty + ' · ' + p.type + ' (' + p.area + ')') + '</span>' + (proofs[i] ? '<span class="tt-proof">' + esc(proofs[i]) + '</span>' : '') + '<span class="tt-proof-link">' + outLink('', ORIGIN_PROOF_GUIDE, 'GOV.UK: get proof of origin ↗') + '</span>').join('') : 'No preference: the third-country rate applies') + '</dd></div>' : '') +
          (c.additionalDuties.length ? '<div><dt>Additional duties</dt><dd>' + c.additionalDuties.map((d) => esc(d.duty + ' · ' + d.type + ' (' + d.area + ')')).join('<br />') + '</dd></div>' : '') +
          '<div class="tt-fact-wide"><dt>VAT on this line</dt><dd>' + esc(c.vatSummary || '–') + '</dd></div>' +
          (c.supplementaryUnit ? '<div><dt>Supplementary unit</dt><dd>' + esc(c.supplementaryUnit) + '</dd></div>' : '') +
          '</dl>';
        const docLabel = origin.value ? 'Document codes for goods from ' + originName : 'Document codes at the third-country rate';
        if (c.documents.length) html += '<h3 class="tt-subhead">' + esc(docLabel) + '</h3>' + docTable(docLabel, c.documents);
        else html += '<p class="tt-note"><strong>' + esc(docLabel) + ':</strong> the tariff attaches no other document codes' + (origin.value ? ' for this origin' : '') + (c.originPreference.length ? ' beyond the proof of origin above' : '') + '.</p>';
        if (c.controls.length) html += '<p class="tt-note"><strong>Controls on this origin.</strong> ' + esc(c.controls.map((x) => x.type + ' (' + x.area + ')').join('; ')) + '</p>';
        if (!origin.value && c.preferences.length) html += '<p class="tt-note">' + c.preferences.length + ' preferential rates exist for this code. Choose the origin above to see the one that applies and the proof of origin it needs.</p>';
        if (c.endUse.length) html += '<details class="tt-enduse"><summary>Other measures on this line (special end uses)</summary><p>These apply only when the goods go to the end use named, under an authorisation. They do not change the duty for ordinary imports.</p>' +
          '<ul>' + c.endUse.map((m) => '<li><strong>' + esc(m.type) + '</strong>' + (m.duty ? ' · ' + esc(m.duty) : '') + (m.documents.length ? '<br />' + m.documents.map((d) => '<code>' + esc(d.code) + '</code> ' + esc(d.description)).join('<br />') : '') + '</li>').join('') + '</ul></details>';
        html += '<div class="tt-actions">' + outLink('tt-secondary', c.officialUrl, 'OPEN ' + c.formatted + ' ON THE UK TRADE TARIFF ↗') + outLink('tt-secondary', c.btiUrl, 'GET A BINDING RULING ↗') + '</div>';
        lastCopy = [c.formatted + ' — ' + c.description, c.path.join(' > '), 'Third-country duty: ' + c.thirdCountryDuty,
          ...c.originPreference.map((p, i) => 'Preference from ' + originName + ': ' + p.duty + ' (' + p.area + ')' + (proofs[i] ? '. ' + proofs[i] : '')),
          ...c.additionalDuties.map((d) => 'Additional duties: ' + d.duty + ' (' + d.area + ')'),
          'VAT: ' + c.vatSummary, ...(c.supplementaryUnit ? ['Supplementary unit: ' + c.supplementaryUnit] : []),
          ...c.documents.map((d) => 'Document ' + d.code + ': ' + d.description), 'Source: ' + c.officialUrl].join('\\n');
        setResultActions(true);
        showResult(html, { level: 'commodity', origin_selected: Boolean(origin.value), document_count: c.documents.length, preference_shown: c.originPreference.length > 0, closest_match: Boolean(note) });
      };
      const showHeading = async (code, notEndLine) => {
        const endpoint = code.length <= 4 ? '/headings/' + code.slice(0, 4) : '/subheadings/' + code;
        const json = await getJson(endpoint);
        if (!json) { fallback(code); return; }
        const h = parseHeading(json);
        if (h.declarable && !h.leaves.length) { await showCommodity(h.code); return; }
        const note = takeNote();
        const intro = notEndLine ? esc(formatCode(notEndLine)) + ' is not a declarable end line. Pick the 10-digit line that describes the goods.' : 'Pick the 10-digit line that describes the goods.';
        lastCopy = '';
        setResultActions(false);
        showResult(note + '<header class="tt-verdict ' + (notEndLine ? 'is-fail' : 'is-pass') + '"><span>HEADING ' + esc(h.code.slice(0, 4)) + '</span><h2>' + esc(h.description) + '</h2><p>' + intro + '</p></header><ul class="tt-candidates">' +
          h.leaves.map((leaf) => '<li><button type="button" data-code="' + esc(leaf.code) + '"><b>' + esc(formatCode(leaf.code)) + '</b><span>' + esc(leaf.description) + '</span></button></li>').join('') + '</ul>', { level: 'heading', candidate_count: h.leaves.length, not_end_line: Boolean(notEndLine) });
      };
      const showChapter = async (code) => {
        const json = await getJson('/chapters/' + code.slice(0, 2));
        if (!json) { fallback(code); return; }
        const headings = (json.included || []).filter((item) => item.type === 'heading');
        const note = takeNote();
        setResultActions(false);
        showResult(note + '<header class="tt-verdict is-pass"><span>CHAPTER ' + esc(code.slice(0, 2)) + '</span><h2>' + esc(String(json.data.attributes.formatted_description || json.data.attributes.description).replace(/<[^>]*>/g, '')) + '</h2><p>Pick the heading.</p></header><ul class="tt-candidates">' +
          headings.map((item) => '<li><button type="button" data-heading="' + esc(item.attributes.goods_nomenclature_item_id.slice(0, 4)) + '"><b>' + esc(item.attributes.goods_nomenclature_item_id.slice(0, 4)) + '</b><span>' + esc(String(item.attributes.formatted_description || item.attributes.description).replace(/<[^>]*>/g, '')) + '</span></button></li>').join('') + '</ul>', { level: 'chapter', candidate_count: headings.length });
      };
      const openFound = async (found) => {
        if (found.endpoint === 'commodities') await showCommodity(found.id);
        else if (found.endpoint === 'chapters') await showChapter(found.id);
        else await showHeading(found.endpoint === 'headings' ? found.id : found.id.split('-')[0]);
      };
      // Issue CC1: when no line matches every word, retry with fewer words and say so.
      const findLines = async (query) => {
        const first = parseSearch(await getJson('/search?q=' + encodeURIComponent(query)));
        if (first.type === 'exact' || first.candidates.length) return { found: first, used: '' };
        for (const variant of searchVariants(query)) {
          const next = parseSearch(await getJson('/search?q=' + encodeURIComponent(variant)));
          if (next.type === 'exact' || next.candidates.length) return { found: next, used: variant };
        }
        return { found: first, used: '' };
      };
      const search = async () => {
        const q = normaliseCodeQuery(input.value);
        if (!q.valid) { input.setCustomValidity(q.kind === 'code' ? 'Enter 2, 4, 6, 8 or 10 digits.' : 'Describe the goods in at least two letters.'); input.reportValidity(); return; }
        input.setCustomValidity('');
        closestNote = '';
        status.textContent = 'Searching the UK Trade Tariff…';
        try {
          if (q.kind === 'code' && q.query.length === 10) { await showCommodity(q.query, true); return; }
          if (q.kind === 'code' && q.query.length === 8) { await showCommodity(q.query + '00', true); return; }
          if (q.kind === 'code' && q.query.length === 2) { await showChapter(q.query); return; }
          if (q.kind === 'code') { await showHeading(q.query.length === 4 ? q.query : q.query.padEnd(10, '0')); return; }
          const { found, used } = await findLines(q.query);
          if (used) closestNote = '<p class="tt-closest"><strong>Closest lines for “' + esc(used) + '”.</strong> No tariff line matched every word of “' + esc(q.query) + '”, so the checker searched with fewer words.</p>';
          if (found.type === 'exact') { await openFound(found); return; }
          if (!found.candidates.length) {
            lastCopy = '';
            setResultActions(false);
            showResult('<header class="tt-verdict is-fail"><span>NO MATCH</span><h2>No tariff line matched “' + esc(q.query) + '”.</h2><p>Try fewer words, for example ‘cotton t-shirts’. Name what the goods are and what they are made of.</p></header><div class="tt-actions">' + outLink('tt-secondary', searchLink(q.query), 'TRY THE OFFICIAL TARIFF SEARCH ↗') + '</div>', { outcome: 'no_match' });
            return;
          }
          const note = takeNote();
          lastCopy = '';
          setResultActions(false);
          showResult(note + '<header class="tt-verdict is-pass"><span>' + found.candidates.length + (found.candidates.length === 1 ? ' MATCH' : ' MATCHES') + '</span><h2>Pick the closest line.</h2><p>Declarable 10-digit codes open straight away; headings open their full list.</p></header><ul class="tt-candidates">' +
            found.candidates.map((c) => '<li><button type="button" ' + (c.declarable ? 'data-code' : 'data-heading') + '="' + esc(c.declarable ? c.code : c.code.slice(0, 4)) + '"><b>' + esc(c.declarable ? formatCode(c.code) : c.code.slice(0, 4)) + '</b><span>' + esc(c.path.join(' › ')) + '</span></button></li>').join('') + '</ul>', { level: 'search', candidate_count: found.candidates.length, closest_match: Boolean(note) });
        } catch (error) {
          fallback(q.query);
        } finally { status.textContent = ''; }
      };
      form.addEventListener('submit', (event) => { event.preventDefault(); search(); });
      // Issue CC5: COPY CODE next to the 10-digit code, with a visible "COPIED ✓".
      const copyCode = async (button) => {
        const label = 'COPY CODE';
        try {
          await navigator.clipboard.writeText(button.dataset.copyCode);
          button.textContent = 'COPIED ✓';
          status.textContent = 'Commodity code ' + button.dataset.copyCode + ' copied.';
          track('tool_code_copied');
        } catch {
          button.textContent = 'COPY BLOCKED: SELECT THE CODE';
          status.textContent = 'Copy was blocked by the browser. Select the code and copy it by hand.';
        }
        clearTimeout(button._reset);
        button._reset = setTimeout(() => { button.textContent = label; }, 2000);
      };
      result.addEventListener('click', (event) => {
        const copy = event.target.closest('button[data-copy-code]');
        if (copy) { copyCode(copy); return; }
        const button = event.target.closest('button[data-code], button[data-heading]');
        if (!button) return;
        closestNote = '';
        const run = button.dataset.code ? showCommodity(button.dataset.code) : showHeading(button.dataset.heading);
        run.catch(() => fallback(button.dataset.code || button.dataset.heading));
      });
      exampleButton?.addEventListener('click', () => { input.value = 'cotton t-shirts'; origin.value = 'IL'; closestNote = ''; track('tool_example_loaded'); showCommodity('6109100010').catch(() => fallback('cotton t-shirts')); });
  `,
}

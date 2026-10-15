import { readFileSync } from 'node:fs'
import { escapeHtml, source } from '../page-kit.mjs'

export const tariffSnapshot = JSON.parse(readFileSync(new URL('../data/tariff-snapshot.json', import.meta.url), 'utf8'))

function widget() {
  const countries = tariffSnapshot.countries.map((country) => `<option value="${escapeHtml(country.id)}">${escapeHtml(country.name)}</option>`).join('')
  return `<section class="tt-panel" aria-labelledby="tt-form-heading">
    <header><span class="section-label">SEARCH THE LIVE UK TARIFF</span><h2 id="tt-form-heading">Describe the goods or paste a code.</h2><p>Your search goes from your browser straight to the UK Trade Tariff. Choose an origin to see the duty for that country.</p></header>
    <form id="tt-form" class="tt-form" novalidate>
      <label for="tariff-query"><span>GOODS DESCRIPTION OR COMMODITY CODE</span><small>For example “cotton t-shirts”, “wooden dining chairs” or 6109100010</small></label>
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
  return `<section class="tt-example" aria-labelledby="tt-example-heading">
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
    </section>`
}

export default {
  pageFile: 'commodity.mjs',
  id: 'commodity_code_checker',
  path: '/tools/commodity-code-checker/',
  shortName: 'Commodity code checker',
  ref: 'PUBLIC TOOL 10 · TARIFF',
  title: 'Commodity code checker | UK tariff, duty and VAT free',
  schemaName: 'Free UK commodity code checker',
  description:
    'Free commodity code checker on the live UK Trade Tariff: search by description or code for duty, VAT, preferences and the document codes CDS asks for.',
  eyebrow: 'FREE COMMODITY CODE CHECKER · LIVE UK TRADE TARIFF',
  h1: 'Check a commodity code, its duty and the documents it needs.',
  standfirst:
    'Type the goods description from the invoice or a code you already use. The checker searches the live UK Trade Tariff, shows where the code sits in the tariff, and for the origin you choose gives the third-country duty, any preference, VAT and every document code the tariff attaches.',
  strip: ['LIVE UK TRADE TARIFF', 'DUTY + VAT + DOCUMENT CODES', 'NO SIGN-UP'],
  stamp: 'CODE\nCHECKED',
  featureList: [
    'Searches the UK Trade Tariff by goods description or by a 2- to 10-digit code',
    'Shows the code’s place in the tariff: section, chapter, heading and subheadings',
    'Gives third-country duty, preferential rates, additional duties and VAT for a chosen origin',
    'Lists every document code (C, Y, N, U and national 9xxx codes) the tariff attaches',
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
    ['Does the checker store what I search for?', 'No, your search goes from your browser straight to the UK Trade Tariff and Declarix does not record it.'],
  ],
  sources: [
    source('UK Trade Tariff API documentation', 'HM Revenue & Customs · Trade Tariff', 'https://docs.trade-tariff.service.gov.uk/'),
    source('Finding commodity codes for imports or exports', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/finding-commodity-codes-for-imports-or-exports'),
    source('Check what you’ll need to get a legally binding decision on a commodity code', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/guidance/check-what-youll-need-to-get-a-legally-binding-decision-on-a-commodity-code'),
    source('Trade Tariff: look up commodity codes, duty and VAT rates', 'HM Revenue & Customs · GOV.UK', 'https://www.gov.uk/trade-tariff'),
  ],
  related: ['/tools/customs-value-import-duty-vat-calculator/', '/tools/import-duty-repayment-checker/', '/tools/gmr-checker/'],
  widget,
  content,
  modules: ['tariff'],
  behaviour: `
      const input = document.getElementById('tariff-query');
      const origin = document.getElementById('tariff-origin');
      const cache = new Map();
      const outLink = (cls, url, label) => { const a = document.createElement('a'); a.className = cls; a.href = url; a.textContent = label; return a.outerHTML; };
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
        showResult('<header class="tt-verdict is-fail"><span>OPEN THE OFFICIAL TARIFF</span><h2>The live tariff did not answer just now.</h2><p>Run the same search on the UK Trade Tariff, or browse the chapters below.</p></header><div class="tt-actions">' + outLink('button', searchLink(query), 'SEARCH “' + query.toUpperCase() + '” ON THE UK TRADE TARIFF ↗') + '</div>', { outcome: 'tariff_unavailable' });
      };
      const showCommodity = async (code) => {
        const json = await getJson('/commodities/' + code);
        if (!json) { await showHeading(code.slice(0, 4)); return; }
        const c = parseCommodity(json, { origin: origin.value });
        const originName = origin.value ? origin.options[origin.selectedIndex].text : '';
        let html = '<header class="tt-verdict is-pass"><span>UK TRADE TARIFF · ' + esc(c.formatted) + '</span><h2>' + esc(c.description) + '</h2><p>' + esc(c.path.join(' › ')) + '</p></header>';
        html += '<dl class="tt-facts">' +
          '<div><dt>Third-country duty</dt><dd>' + esc(c.thirdCountryDuty || '–') + '</dd></div>' +
          (origin.value ? '<div><dt>Preference from ' + esc(originName) + '</dt><dd>' + (c.originPreference.length ? c.originPreference.map((p) => esc(p.duty + ' · ' + p.type + ' (' + p.area + ')')).join('<br />') : 'No preference: the third-country rate applies') + '</dd></div>' : '') +
          (c.additionalDuties.length ? '<div><dt>Additional duties</dt><dd>' + c.additionalDuties.map((d) => esc(d.duty + ' · ' + d.type + ' (' + d.area + ')')).join('<br />') + '</dd></div>' : '') +
          '<div><dt>VAT on this line</dt><dd>' + esc(c.vat.join(' or ') || '–') + '</dd></div>' +
          (c.supplementaryUnit ? '<div><dt>Supplementary unit</dt><dd>' + esc(c.supplementaryUnit) + '</dd></div>' : '') +
          '</dl>';
        if (c.documents.length) {
          html += '<h3 class="tt-subhead">Document codes the tariff attaches' + (origin.value ? ' for ' + esc(originName) : '') + '</h3><div class="tt-table-wrap"><table><caption>Document codes</caption><thead><tr><th scope="col">Code</th><th scope="col">Document</th><th scope="col">Measure</th></tr></thead><tbody>' +
            c.documents.map((d) => '<tr><th scope="row">' + esc(d.code) + '</th><td>' + esc(d.description) + '</td><td>' + esc(d.measures.join(', ')) + '</td></tr>').join('') + '</tbody></table></div>';
        }
        if (c.controls.length) html += '<p class="tt-note"><strong>Controls on this origin.</strong> ' + esc(c.controls.map((x) => x.type + ' (' + x.area + ')').join('; ')) + '</p>';
        if (!origin.value && c.preferences.length) html += '<p class="tt-note">' + c.preferences.length + ' preferential rates exist for this code. Choose the origin above to see the one that applies.</p>';
        html += '<div class="tt-actions">' + outLink('tt-secondary', c.officialUrl, 'OPEN ' + c.formatted + ' ON THE UK TRADE TARIFF ↗') + outLink('tt-secondary', c.btiUrl, 'GET A BINDING RULING ↗') + '</div>';
        lastCopy = [c.formatted + ' — ' + c.description, c.path.join(' > '), 'Third-country duty: ' + c.thirdCountryDuty, 'VAT: ' + c.vat.join(' or '), ...c.documents.map((d) => 'Document ' + d.code + ': ' + d.description), 'Source: ' + c.officialUrl].join('\\n');
        showResult(html, { level: 'commodity', origin_selected: Boolean(origin.value), document_count: c.documents.length });
      };
      const showHeading = async (code) => {
        const endpoint = code.length <= 4 ? '/headings/' + code.slice(0, 4) : '/subheadings/' + code;
        const json = await getJson(endpoint);
        if (!json) { fallback(code); return; }
        const h = parseHeading(json);
        if (h.declarable && !h.leaves.length) { await showCommodity(h.code); return; }
        showResult('<header class="tt-verdict is-pass"><span>HEADING ' + esc(h.code.slice(0, 4)) + '</span><h2>' + esc(h.description) + '</h2><p>Pick the 10-digit line that describes the goods.</p></header><ul class="tt-candidates">' +
          h.leaves.map((leaf) => '<li><button type="button" data-code="' + esc(leaf.code) + '"><b>' + esc(formatCode(leaf.code)) + '</b><span>' + esc(leaf.description) + '</span></button></li>').join('') + '</ul>', { level: 'heading', candidate_count: h.leaves.length });
      };
      const showChapter = async (code) => {
        const json = await getJson('/chapters/' + code.slice(0, 2));
        if (!json) { fallback(code); return; }
        const headings = (json.included || []).filter((item) => item.type === 'heading');
        showResult('<header class="tt-verdict is-pass"><span>CHAPTER ' + esc(code.slice(0, 2)) + '</span><h2>' + esc(json.data.attributes.formatted_description || json.data.attributes.description) + '</h2><p>Pick the heading.</p></header><ul class="tt-candidates">' +
          headings.map((item) => '<li><button type="button" data-heading="' + esc(item.attributes.goods_nomenclature_item_id.slice(0, 4)) + '"><b>' + esc(item.attributes.goods_nomenclature_item_id.slice(0, 4)) + '</b><span>' + esc(String(item.attributes.formatted_description || item.attributes.description).replace(/<[^>]*>/g, '')) + '</span></button></li>').join('') + '</ul>', { level: 'chapter', candidate_count: headings.length });
      };
      const search = async () => {
        const q = normaliseCodeQuery(input.value);
        if (!q.valid) { input.setCustomValidity(q.kind === 'code' ? 'Enter 2, 4, 6, 8 or 10 digits.' : 'Describe the goods in at least two letters.'); input.reportValidity(); return; }
        input.setCustomValidity('');
        status.textContent = 'Searching the UK Trade Tariff…';
        try {
          if (q.kind === 'code' && q.query.length === 10) { await showCommodity(q.query); return; }
          if (q.kind === 'code' && q.query.length === 8) { await showCommodity(q.query + '00'); return; }
          if (q.kind === 'code' && q.query.length === 2) { await showChapter(q.query); return; }
          if (q.kind === 'code') { await showHeading(q.query.length === 4 ? q.query : q.query.padEnd(10, '0')); return; }
          const json = await getJson('/search?q=' + encodeURIComponent(q.query));
          const found = parseSearch(json);
          if (found.type === 'exact') {
            if (found.endpoint === 'commodities') await showCommodity(found.id);
            else if (found.endpoint === 'chapters') await showChapter(found.id);
            else await showHeading(found.endpoint === 'headings' ? found.id : found.id.split('-')[0]);
            return;
          }
          if (!found.candidates.length) {
            showResult('<header class="tt-verdict is-fail"><span>NO MATCH</span><h2>No tariff line matched “' + esc(q.query) + '”.</h2><p>Describe what the goods are, what they are made of and what they are for, for example “men’s cotton knitted T-shirts”.</p></header><div class="tt-actions">' + outLink('tt-secondary', searchLink(q.query), 'TRY THE OFFICIAL TARIFF SEARCH ↗') + '</div>', { outcome: 'no_match' });
            return;
          }
          showResult('<header class="tt-verdict is-pass"><span>' + found.candidates.length + (found.candidates.length === 1 ? ' MATCH' : ' MATCHES') + '</span><h2>Pick the closest line.</h2><p>Declarable 10-digit codes open straight away; headings open their full list.</p></header><ul class="tt-candidates">' +
            found.candidates.map((c) => '<li><button type="button" ' + (c.declarable ? 'data-code' : 'data-heading') + '="' + esc(c.declarable ? c.code : c.code.slice(0, 4)) + '"><b>' + esc(c.declarable ? formatCode(c.code) : c.code.slice(0, 4)) + '</b><span>' + esc(c.path.join(' › ')) + '</span></button></li>').join('') + '</ul>', { level: 'search', candidate_count: found.candidates.length });
        } catch (error) {
          fallback(q.query);
        } finally { status.textContent = ''; }
      };
      form.addEventListener('submit', (event) => { event.preventDefault(); search(); });
      result.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-code], button[data-heading]');
        if (!button) return;
        const run = button.dataset.code ? showCommodity(button.dataset.code) : showHeading(button.dataset.heading);
        run.catch(() => fallback(button.dataset.code || button.dataset.heading));
      });
      exampleButton?.addEventListener('click', () => { input.value = 'cotton t-shirts'; origin.value = 'IL'; track('tool_example_loaded'); showCommodity('6109100010').catch(() => fallback('cotton t-shirts')); });
  `,
}

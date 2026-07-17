export const eoriChecker = {
  path: '/tools/eori-checker/',
  id: 'gb_eori_checker',
  ref: 'PUBLIC TOOL 04 · GB EORI',
  title: 'GB EORI number checker | Free HMRC registry check',
  schemaName: 'Free GB EORI number checker',
  reviewedOn: '2026-07-17',
  description:
    'Check one GB EORI number against HMRC’s current registry, see the source and timestamp, and get the right XI or EU checker handoff without signing up.',
  eyebrow: 'FREE GB EORI CHECKER · HMRC REGISTRY RESULT · NO SIGN-UP',
  h1: 'Check a GB EORI number with HMRC.',
  standfirst:
    'Enter one number. Declarix asks HMRC for the current GB registry result and shows the source, check time and any business details the holder has chosen to make public.',
  sources: [
    {
      title: 'Check an EORI Number API v1.0',
      publisher: 'HM Revenue & Customs · Developer Hub',
      checked: '17 JULY 2026',
      url: 'https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/check-eori-number-api/1.0',
    },
    {
      title: 'Finding and checking an EORI',
      publisher: 'HM Revenue & Customs · GOV.UK',
      checked: '17 JULY 2026',
      url: 'https://www.gov.uk/guidance/economic-operators-registration-and-identification-eori/finding-and-checking-an-eori',
    },
    {
      title: 'Check an EORI number',
      publisher: 'European Commission · Taxation and Customs Union',
      checked: '17 JULY 2026',
      url: 'https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en',
    },
    {
      title: 'Get an EORI number',
      publisher: 'HM Revenue & Customs · GOV.UK',
      checked: '17 JULY 2026',
      url: 'https://www.gov.uk/eori',
    },
  ],
  questions: [
    {
      question: 'What does a valid result mean?',
      answer:
        'It means HMRC confirmed the GB EORI as valid when this check ran. It does not identify the person using the checker or replace the commercial checks needed for a shipment.',
    },
    {
      question: 'Why is no business name shown?',
      answer:
        'HMRC returns a trader name and address only when the EORI holder has chosen to make those details public. A GB EORI can still be registry-valid when no public details are returned.',
    },
    {
      question: 'Can I check an XI or EU EORI here?',
      answer:
        'This tool checks GB EORI numbers through HMRC. Use the European Commission EORI checker for XI and EU numbers; the handoff is linked beside the form and in unsupported results.',
    },
    {
      question: 'Is the number saved?',
      answer:
        'No. Declarix sends the number to its server-side HMRC proxy for this check, does not put it in the page URL or analytics, and does not persist or cache the result.',
    },
    {
      question: 'Why might HMRC be temporarily unavailable?',
      answer:
        'A timeout, upstream rate limit or service interruption can prevent a current registry answer. The page keeps that state separate from valid and invalid and asks you to retry rather than guessing.',
    },
  ],
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

export function resolvePublicEoriReleaseConfig(env = process.env) {
  const releaseValue = env.VITE_PUBLIC_EORI_RELEASE_ENABLED
  if (releaseValue === undefined || releaseValue === '' || releaseValue === 'false') {
    return { enabled: false, apiOrigin: null }
  }
  if (releaseValue !== 'true') {
    throw new Error('VITE_PUBLIC_EORI_RELEASE_ENABLED must be exactly true or false')
  }

  const rawOrigin = env.VITE_PUBLIC_EORI_API_ORIGIN
  if (!rawOrigin) throw new Error('VITE_PUBLIC_EORI_API_ORIGIN is required for an enabled EORI release')

  let parsed
  try {
    parsed = new URL(rawOrigin)
  } catch {
    throw new Error('VITE_PUBLIC_EORI_API_ORIGIN must be an absolute URL')
  }
  const localPreview = parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost'
  if ((!localPreview && parsed.protocol !== 'https:') || (localPreview && !['http:', 'https:'].includes(parsed.protocol))) {
    throw new Error('VITE_PUBLIC_EORI_API_ORIGIN must use HTTPS outside localhost')
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') {
    throw new Error('VITE_PUBLIC_EORI_API_ORIGIN must be a bare origin with no credentials, path, query or fragment')
  }
  return { enabled: true, apiOrigin: parsed.origin }
}

function jsonLd(checker, site) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.origin}/#organization`,
        name: site.company,
        legalName: site.company,
        url: `${site.origin}/`,
        email: site.contact,
        identifier: site.companyNumber,
      },
      {
        '@type': 'WebApplication',
        '@id': `${site.origin}${checker.path}#application`,
        name: checker.schemaName,
        url: `${site.origin}${checker.path}`,
        description: checker.description,
        dateModified: checker.reviewedOn,
        applicationCategory: 'BusinessApplication',
        browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        featureList: [
          'Checks one GB EORI number against the HMRC registry',
          'Shows the source and check timestamp',
          'Routes XI and EU EORI checks to the European Commission',
        ],
        citation: checker.sources.map((source) => source.url),
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
          { '@type': 'ListItem', position: 2, name: checker.schemaName, item: `${site.origin}${checker.path}` },
        ],
      },
    ],
  }).replaceAll('<', '\\u003c')
}

function renderSources(checker) {
  return `<section class="source-register" aria-labelledby="eori-sources">
    <header>
      <span class="section-label">OFFICIAL SOURCE REGISTER</span>
      <h2 id="eori-sources">Registry answer first. Source beside it.</h2>
      <p>The GB result comes from HMRC’s public checker API. XI and EU checks leave Declarix for the European Commission checker. Declarix is not endorsed by either service.</p>
    </header>
    <ol>${checker.sources
      .map(
        (source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a><span>${escapeHtml(source.publisher)} · CHECKED ${escapeHtml(source.checked)}</span></li>`,
      )
      .join('')}</ol>
  </section>`
}

function renderQuestions(checker) {
  return checker.questions
    .map(
      (item, index) => `<details class="eori-question">
        <summary><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(item.question)}</summary>
        <p>${escapeHtml(item.answer)}</p>
      </details>`,
    )
    .join('')
}

function checkerScript(checker, apiOrigin, posthogKey, posthogHost) {
  const config = JSON.stringify({
    apiUrl: `${apiOrigin}/public/v1/eori/check`,
    posthogKey,
    posthogHost,
  }).replaceAll('<', '\\u003c')
  return `<script>
    (() => {
      const config = ${config};
      const toolId = '${checker.id}';
      const form = document.getElementById('eori-form');
      const input = document.getElementById('eori-number');
      const button = document.getElementById('eori-submit');
      const result = document.getElementById('eori-result');
      const status = document.getElementById('eori-status');
      const stateLabel = document.getElementById('eori-state-label');
      const heading = document.getElementById('eori-result-heading');
      const copy = document.getElementById('eori-result-copy');
      const normalized = document.getElementById('eori-normalized');
      const checkedAt = document.getElementById('eori-checked-at');
      const providerTime = document.getElementById('eori-provider-time');
      const details = document.getElementById('eori-company-details');
      const trader = document.getElementById('eori-trader-name');
      const address = document.getElementById('eori-trader-address');
      const euHandoff = document.getElementById('eori-result-eu');
      const resultActions = document.getElementById('eori-result-actions');
      let outcome = 'not_checked';

      const get = (key) => { try { return sessionStorage.getItem(key) || ''; } catch { return ''; } };
      const set = (key, value) => { try { sessionStorage.setItem(key, value); } catch {} };
      const attribution = () => {
        const params = new URLSearchParams(location.search);
        const incoming = {
          source: params.get('utm_source') || params.get('src') || '',
          medium: params.get('utm_medium') || '',
          campaign: params.get('utm_campaign') || '',
          content: params.get('utm_content') || '',
          term: params.get('utm_term') || '',
        };
        Object.entries(incoming).forEach(([key, value]) => { if (value && !get('dclrx-' + key)) set('dclrx-' + key, value); });
        return Object.fromEntries(Object.keys(incoming).map((key) => [key, get('dclrx-' + key) || (key === 'source' ? 'direct' : 'none')]));
      };
      const distinctId = get('dclrx-distinct-id') || crypto.randomUUID();
      set('dclrx-distinct-id', distinctId);
      const track = (event, properties = {}) => {
        const payload = { ...attribution(), ...properties, tool_id: toolId, page_path: location.pathname };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event, ...payload });
        if (!config.posthogKey) return;
        const body = JSON.stringify({ api_key: config.posthogKey, event, distinct_id: distinctId, properties: payload });
        if (navigator.sendBeacon && navigator.sendBeacon(config.posthogHost + '/capture/', body)) return;
        fetch(config.posthogHost + '/capture/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => null);
      };
      const formatTime = (value) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? 'Not supplied' : date.toLocaleString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
        });
      };
      const resetResult = () => {
        result.className = 'eori-result';
        details.hidden = true;
        euHandoff.hidden = true;
        resultActions.hidden = true;
        trader.textContent = '';
        address.textContent = '';
        normalized.textContent = '—';
        checkedAt.textContent = '—';
        providerTime.textContent = '—';
      };
      const showResult = ({ state, label, title, message, payload, showEu = false, showActions = true }) => {
        resetResult();
        outcome = state;
        result.classList.add('is-' + state);
        stateLabel.textContent = label;
        heading.textContent = title;
        copy.textContent = message;
        normalized.textContent = payload?.normalized_eori || 'Not checked';
        checkedAt.textContent = payload?.checked_at ? formatTime(payload.checked_at) : 'No registry check completed';
        providerTime.textContent = payload?.registry?.processing_date ? formatTime(payload.registry.processing_date) : 'Not supplied';
        const company = payload?.registry?.company_details;
        if (company?.trader_name && company?.address) {
          trader.textContent = company.trader_name;
          address.textContent = [company.address.street_and_number, company.address.city_name, company.address.postcode].filter(Boolean).join(', ');
          details.hidden = false;
        }
        euHandoff.hidden = !showEu;
        resultActions.hidden = !showActions;
        result.hidden = false;
        result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      };
      const unavailable = (reason, message, payload = null) => {
        showResult({
          state: 'unavailable',
          label: 'NO REGISTRY ANSWER',
          title: 'HMRC did not return a current answer.',
          message,
          payload,
          showActions: false,
        });
        track('eori_check_unavailable', { reason });
      };
      const assertContract = (payload) => {
        if (!payload || typeof payload !== 'object' || typeof payload.normalized_eori !== 'string') throw new Error('contract');
        if (!payload.format || !['valid', 'invalid', 'not_supported'].includes(payload.format.status)) throw new Error('contract');
        if (!payload.registry || !['valid', 'invalid', 'unavailable', 'not_checked'].includes(payload.registry.status)) throw new Error('contract');
        if (payload.format.status === 'valid' && ['valid', 'invalid'].includes(payload.registry.status)) {
          if (payload.registry.provider !== 'HMRC Check an EORI Number API') throw new Error('contract');
          if (payload.source?.name !== 'HMRC Check an EORI Number API') throw new Error('contract');
          if (!payload.checked_at || Number.isNaN(Date.parse(payload.checked_at))) throw new Error('contract');
        }
        return payload;
      };

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (button.disabled) return;
        const candidate = input.value.trim();
        if (!candidate) {
          input.setCustomValidity('Enter one GB EORI number.');
          input.reportValidity();
          return;
        }
        input.setCustomValidity('');
        button.disabled = true;
        button.textContent = 'CHECKING HMRC…';
        status.textContent = 'Checking one GB EORI number with HMRC.';
        track('eori_check_started', { checker_scope: 'single_gb' });
        const controller = new AbortController();
        const requestTimeout = window.setTimeout(() => controller.abort(), 12000);
        try {
          const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ eori: candidate }),
            credentials: 'omit',
            cache: 'no-store',
            signal: controller.signal,
          });
          if (response.status === 429) {
            const limited = await response.json().catch(() => ({}));
            unavailable('rate_limited', limited.message || 'Too many checks reached the public limit. Wait a moment, then try again.');
            return;
          }
          if (!response.ok) {
            unavailable('api_response', 'The checker could not reach the registry service. Try again shortly.');
            return;
          }
          const payload = assertContract(await response.json());
          if (payload.format.status === 'not_supported') {
            showResult({
              state: 'unsupported',
              label: 'USE THE EU CHECKER',
              title: 'This is not a GB EORI number.',
              message: 'Use the European Commission checker for XI and EU EORI numbers.',
              payload,
              showEu: true,
              showActions: false,
            });
            track('eori_check_completed', { outcome: 'not_supported', public_company_details: false });
          } else if (payload.format.status === 'invalid') {
            showResult({
              state: 'format_invalid',
              label: 'CHECK THE NUMBER',
              title: 'HMRC was not asked yet.',
              message: payload.format.message || 'Enter a GB EORI in the format HMRC accepts, then check again.',
              payload,
              showActions: false,
            });
            track('eori_check_completed', { outcome: 'format_invalid', public_company_details: false });
          } else if (payload.registry.status === 'valid') {
            showResult({
              state: 'registry_valid',
              label: 'HMRC REGISTRY · VALID',
              title: 'HMRC confirms this GB EORI is valid.',
              message: payload.registry.company_details
                ? 'The holder has also chosen to make the business details below public.'
                : 'No public business name is shown. The registry-valid result is complete.',
              payload,
            });
            track('eori_check_completed', { outcome: 'registry_valid', public_company_details: Boolean(payload.registry.company_details) });
          } else if (payload.registry.status === 'invalid') {
            showResult({
              state: 'registry_invalid',
              label: 'HMRC REGISTRY · NOT CONFIRMED',
              title: 'HMRC does not confirm this GB EORI as valid.',
              message: payload.registry.message || 'Check the number and the official EORI guidance before relying on it.',
              payload,
            });
            track('eori_check_completed', { outcome: 'registry_invalid', public_company_details: false });
          } else {
            unavailable('registry_unavailable', payload.registry.message || 'The number reached the checker, but HMRC did not return a registry result. Try again.', payload);
          }
          status.textContent = heading.textContent;
        } catch {
          unavailable('network_or_contract', 'The current registry answer could not be loaded. Check your connection and try again.');
        } finally {
          window.clearTimeout(requestTimeout);
          button.disabled = false;
          button.textContent = 'CHECK WITH HMRC';
        }
      });

      document.querySelectorAll('[data-eori-booking]').forEach((link) => link.addEventListener('click', () => {
        track('eori_result_booking_clicked', { outcome, placement: link.dataset.eoriBooking });
      }));
      document.querySelectorAll('[data-eori-pack]').forEach((link) => link.addEventListener('click', () => {
        track('eori_result_pack_checker_clicked', { outcome, placement: link.dataset.eoriPack });
      }));
      document.querySelectorAll('[data-eori-eu]').forEach((link) => link.addEventListener('click', () => {
        track('eori_eu_handoff_clicked', { placement: link.dataset.eoriEu });
      }));
      attribution();
    })();
  </script>`
}

export function renderEoriChecker(checker, site, { apiOrigin, navHtml, webmasterHtml, posthogKey, posthogHost }) {
  const canonical = `${site.origin}${checker.path}`
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(checker.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterHtml}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <link rel="stylesheet" href="/eori-checker.css" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(checker.title)}" />
    <meta property="og:description" content="${escapeHtml(checker.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(checker.title)}" />
    <meta name="twitter:description" content="${escapeHtml(checker.description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${escapeHtml(checker.title)}</title>
    <script type="application/ld+json">${jsonLd(checker, site)}</script>
  </head>
  <body>
    <div class="docket eori-docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>REGISTRY SOURCE</span><strong>HMRC · V1.0 BETA</strong></div>
        <a class="masthead-cta" data-eori-booking="masthead" href="/?src=tool_gb_eori_checker#book">BOOK THE 20-MINUTE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${navHtml}</nav>
      <div class="breadcrumbs"><a href="/">HOME</a> → FREE TOOLS → GB EORI CHECKER</div>
      <main>
        <header class="hero eori-hero">
          <div class="hero-copy">
            <p class="eyebrow">${escapeHtml(checker.eyebrow)}</p>
            <h1>${escapeHtml(checker.h1)}</h1>
            <p>${escapeHtml(checker.standfirst)}</p>
            <div class="eori-hero-trust"><strong>ONE NUMBER</strong><strong>NO ACCOUNT</strong><strong>NO RESULT STORED</strong></div>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${escapeHtml(checker.ref)}</span>
            <div class="stamp">GB<br />REGISTRY</div>
            <div class="review-cell"><span>SOURCE REVIEW</span><strong>${checker.reviewedOn}</strong></div>
          </aside>
        </header>

        <section class="eori-check-panel" aria-labelledby="eori-form-heading">
          <header>
            <span class="section-label">CHECK ONE GB EORI</span>
            <h2 id="eori-form-heading">Paste the number. Get the registry answer.</h2>
            <p>Spaces and common pasted separators are accepted. The result stays ungated and shows when HMRC processed the check.</p>
          </header>
          <form id="eori-form" novalidate>
            <label for="eori-number"><span>GB EORI NUMBER</span><small>Usually GB followed by 12 or 15 digits</small></label>
            <div class="eori-input-line">
              <input id="eori-number" name="eori" type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="64" placeholder="GB123456789012" required />
              <button class="button" id="eori-submit" type="submit">CHECK WITH HMRC</button>
            </div>
            <p>Used only for this check. Never added to the page URL or analytics.</p>
          </form>
        </section>

        <aside class="eori-eu-handoff">
          <span>XI OR EU EORI?</span>
          <strong>Use the European Commission checker.</strong>
          <a data-eori-eu="before_result" href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en">OPEN THE OFFICIAL EU CHECKER ↗</a>
        </aside>

        <section class="eori-result" id="eori-result" aria-labelledby="eori-result-heading" aria-live="polite" hidden>
          <header>
            <span id="eori-state-label">REGISTRY RESULT</span>
            <div>
              <h2 id="eori-result-heading">HMRC registry result</h2>
              <p id="eori-result-copy"></p>
            </div>
          </header>
          <dl class="eori-result-ledger">
            <div><dt>NORMALIZED NUMBER</dt><dd id="eori-normalized">—</dd></div>
            <div><dt>DECLARIX CHECK TIME</dt><dd id="eori-checked-at">—</dd></div>
            <div><dt>HMRC PROCESSING TIME</dt><dd id="eori-provider-time">—</dd></div>
            <div><dt>REGISTRY SOURCE</dt><dd><a href="https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/check-eori-number-api/1.0">HMRC CHECK AN EORI NUMBER API · V1.0 BETA ↗</a></dd></div>
          </dl>
          <div class="eori-company-details" id="eori-company-details" hidden>
            <span>HOLDER-PUBLISHED BUSINESS DETAILS</span>
            <strong id="eori-trader-name"></strong>
            <p id="eori-trader-address"></p>
          </div>
          <div class="eori-result-eu" id="eori-result-eu" hidden>
            <a class="button" data-eori-eu="unsupported_result" href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en">CHECK WITH THE EUROPEAN COMMISSION ↗</a>
          </div>
          <div class="eori-result-actions" id="eori-result-actions" hidden>
            <div><span>NEXT JOB</span><h3>Got the party identifier. Now check the declaration handoff.</h3></div>
            <a class="eori-secondary-action" data-eori-pack="result" href="/tools/customs-document-pack-check/">RUN THE FREE PACK CHECK</a>
            <a class="button" data-eori-booking="result" href="/?src=tool_gb_eori_checker_result#book">MAP THE FIRST WORKFLOW IN 20 MINUTES</a>
          </div>
        </section>
        <p class="visually-hidden" id="eori-status" aria-live="polite"></p>

        <section class="eori-explainer" aria-labelledby="eori-explainer-heading">
          <header><span class="section-label">DIRECT ANSWER</span><h2 id="eori-explainer-heading">What this EORI check tells you.</h2><p>A GB EORI begins with GB and is used to identify an economic operator in customs activity. This checker gives you HMRC’s current registry answer for one number—not a guess based on its shape.</p></header>
          <div>
            <article><span>01 · REGISTRY</span><h3>Valid means HMRC confirmed it.</h3><p>The valid or not-confirmed answer comes from HMRC. Matching the expected letters and digits alone never creates a valid result.</p></article>
            <article><span>02 · PUBLIC DETAILS</span><h3>No name does not cancel a valid result.</h3><p>HMRC supplies trader details only when the holder has chosen to publish them. The validity answer stands separately.</p></article>
            <article><span>03 · FRESHNESS</span><h3>Use the timestamp.</h3><p>Every completed registry result shows the Declarix check time and the HMRC processing time when supplied.</p></article>
            <article><span>04 · NEXT WORKFLOW</span><h3>Move from identifier to usable pack.</h3><p>Use the free pack checker to organise the evidence handoff, or bring the first workflow and desk numbers to the 20-minute call.</p></article>
          </div>
        </section>

        <section class="eori-related" aria-labelledby="eori-related-heading">
          <header><span class="section-label">KEEP MOVING</span><h2 id="eori-related-heading">From EORI to first declaration workflow.</h2><p>Use the result now, then move into the next practical job without surrendering it to a form.</p></header>
          <nav aria-label="Related EORI and customs resources">
            <a data-eori-pack="related" href="/tools/customs-document-pack-check/"><span>FREE TOOL</span><strong>Customs document pack checker</strong><b>OPEN ↗</b></a>
            <a href="/customs-intermediary-registration-2026/"><span>RESPONSE KIT</span><strong>Customs intermediary registration 2026</strong><b>OPEN ↗</b></a>
            <a href="/how-it-works/"><span>WORKFLOW</span><strong>How Declarix builds a CDS-ready pack</strong><b>OPEN ↗</b></a>
          </nav>
        </section>

        <section class="eori-questions" aria-labelledby="eori-questions-heading">
          <header><span class="section-label">PRACTICAL QUESTIONS</span><h2 id="eori-questions-heading">Read the answer behind the result.</h2><p>Short explanations for the states the checker can actually return.</p></header>
          <div>${renderQuestions(checker)}</div>
        </section>
        ${renderSources(checker)}
        <section class="cta-band eori-bottom-cta">
          <div><h2>Turn the first declaration workflow into numbers.</h2><p>Bring weekly volume, current minutes, clerk cost and customs system. Leave with the ROI range, integration route and best first workflow.</p></div>
          <a class="button" data-eori-booking="bottom" href="/?src=tool_gb_eori_checker_bottom#book">BOOK THE 20-MINUTE NUMBERS CALL</a>
        </section>
        <div class="source-stamp">FREE GB EORI TOOL · HMRC API V1.0 BETA · REVIEWED ${checker.reviewedOn} · <a href="/editorial-policy/">SOURCES AND CORRECTIONS</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
      </main>
      <footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav></footer>
    </div>
    ${checkerScript(checker, apiOrigin, posthogKey, posthogHost)}
  </body>
</html>`
}

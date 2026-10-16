import { breadcrumbHtml, breadcrumbList, organizationNode } from './site-graph.mjs'
export const eoriChecker = {
  path: '/tools/eori-checker/',
  id: 'gb_eori_checker',
  ref: 'PUBLIC TOOL 04 · GB EORI',
  // Intent review §4.1 (16 Oct 2026): title, H1 and meta follow the "eori checker / check eori number" search intent.
  title: 'EORI Checker UK: Check a GB or XI EORI Number Free',
  schemaName: 'Free GB EORI number checker',
  reviewedOn: '2026-10-16',
  description:
    'Free EORI checker: validate a GB EORI number against HMRC’s live registry in seconds, see the source and time, and get the XI and EU check in one place.',
  eyebrow: 'FREE GB EORI CHECKER · HMRC REGISTRY RESULT · NO SIGN-UP',
  h1: 'EORI number checker: check a GB EORI with HMRC',
  // The previous H1, kept word for word as the subhead directly under the new H1.
  subhead: 'Check a GB EORI number with HMRC.',
  standfirst:
    'Enter one number. Declarix asks HMRC for the current GB registry result and shows the source, check time and any business details the holder has chosen to make public.',
  sources: [
    {
      title: 'Check an EORI Number API v1.0',
      publisher: 'HM Revenue & Customs · Developer Hub',
      checked: '12 OCTOBER 2026',
      url: 'https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/check-eori-number-api/1.0',
    },
    {
      title: 'Finding and checking an EORI',
      publisher: 'HM Revenue & Customs · GOV.UK',
      checked: '12 OCTOBER 2026',
      url: 'https://www.gov.uk/guidance/economic-operators-registration-and-identification-eori/finding-and-checking-an-eori-number',
    },
    {
      title: 'Check an EORI number',
      publisher: 'European Commission · Taxation and Customs Union',
      checked: '12 OCTOBER 2026',
      url: 'https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en',
    },
    {
      title: 'Get an EORI number',
      publisher: 'HM Revenue & Customs · GOV.UK',
      checked: '12 OCTOBER 2026',
      url: 'https://www.gov.uk/eori',
    },
    {
      title: 'Apply for an EORI number',
      publisher: 'HM Revenue & Customs · GOV.UK',
      checked: '15 OCTOBER 2026',
      url: 'https://www.gov.uk/eori/apply-for-eori',
    },
    {
      title: 'Get an EORI number for Northern Ireland (XI)',
      publisher: 'HM Revenue & Customs · GOV.UK',
      checked: '15 OCTOBER 2026',
      url: 'https://www.gov.uk/eori/eori-northern-ireland',
    },
  ],
  questions: [
    {
      question: 'What does a valid result mean?',
      answer:
        'It means HMRC confirmed the GB EORI as valid when this check ran. It does not identify the person using the checker or replace the commercial checks needed for a shipment.',
    },
    {
      // Live ICP issue 1 (16 Oct 2026). Sources: GOV.UK "Finding and checking an EORI" (checked 16 Oct 2026),
      // GOV.UK "Apply for an EORI number" (up to 5 working days when HMRC makes checks), GOV.UK "Get an EORI number"
      // (cancellation via change of circumstances).
      question: 'What does not confirmed mean?',
      answer:
        'It means HMRC’s live register has no active GB EORI for that number when the check ran. There are four usual causes: a typo, such as a missing digit or the letter O or I in place of 0 or 1; a new number that is not live yet, because HMRC can take up to 5 working days when it makes checks; a number that was never registered; or a number that has been cancelled. Next step: retype the number and check again. If HMRC still does not confirm it, ask the holder for their HMRC EORI confirmation letter or email and check the number on it. XI and EU numbers go to the European Commission checker.',
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
      // Source: GOV.UK "Finding and checking an EORI", EU EORI number checker paragraph (checked 16 Oct 2026).
      question: 'How do I validate an EU EORI number?',
      answer:
        'Use the European Commission’s EORI validation service. It checks every XI number and every EORI number issued by the 27 EU member states. Enter the full number with its country prefix, such as DE, FR, NL or IE. The service confirms whether the number is valid and, if the holder has consented, shows their name and address.',
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
    {
      question: 'Is this EORI checker free?',
      answer:
        'Yes. Checking a GB EORI number here is free, with no account and no sign-up. Each check returns HMRC’s current registry answer for one number.',
    },
    {
      question: 'How do I find my own EORI number?',
      answer:
        'Sign in to the EORI digital registration service with the same Government Gateway details you used to apply. HMRC’s guidance says not to sign in from another page, such as the business tax account; your number is shown once you are signed in.',
    },
    {
      question: 'How long does it take to get an EORI number?',
      answer:
        'HMRC says you get a GB EORI number immediately unless it needs to make checks, which can take up to 5 working days. An XI EORI number arrives within 5 days of the XI registration form.',
    },
    {
      question: 'Do I need an XI EORI number?',
      answer:
        'You will usually need an XI EORI number to move goods into Northern Ireland from Great Britain, to move goods from Northern Ireland to a non-EU country, to make a declaration in Northern Ireland or to apply for a customs decision there. You must apply for a GB EORI number first.',
    },
    {
      question: 'Is an EORI number the same as a VAT number?',
      answer:
        'No. A VAT number identifies a business for VAT. An EORI number identifies an economic operator in customs activity. A VAT-registered business’s GB EORI is often built from its 9-digit VAT number followed by 000, which is why the two are easy to mix up.',
    },
    {
      question: 'Can I check an EORI number by company name?',
      answer:
        'No. HMRC’s checker, and this one, work from the EORI number itself. Ask the trader for their number, then check it here. If the holder has consented, the result shows their published name and address.',
    },
  ],
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

// The official HMRC API name, spelled out wherever the version label appears (live ICP issue 8).
const HMRC_API_LABEL = 'LIVE FROM HMRC’S OFFICIAL CHECK AN EORI NUMBER API (V1.0 BETA)'
const EU_CHECKER_URL = 'https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en'
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
export const reviewStamp = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

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
      organizationNode(site),
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
      breadcrumbList(site, checker.path),
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
      const resultNext = document.getElementById('eori-result-next');
      const normalizedLabel = document.getElementById('eori-normalized-label');
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
        resultNext.hidden = true;
        normalizedLabel.textContent = 'NUMBER WE CHECKED WITH HMRC';
        trader.textContent = '';
        address.textContent = '';
        normalized.textContent = '—';
        checkedAt.textContent = '—';
        providerTime.textContent = '—';
      };
      const showResult = ({ state, label, title, message, payload, showEu = false, showActions = true, showNext = false, sentToHmrc = true }) => {
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
        resultNext.hidden = !showNext;
        if (!sentToHmrc) normalizedLabel.textContent = 'NUMBER YOU ENTERED';
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
        status.textContent = heading.textContent;
        track('eori_check_unavailable', { reason });
      };
      // Match the backend's NFKC, case, Python whitespace and common dash rules.
      // Other punctuation is retained, so it cannot silently change identity.
      const normalizeEori = (value) => value.normalize('NFKC').toUpperCase()
        .replace(/[\\t-\\r\\u001c-\\u0020\\u0085\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\u002d\\u2013\\u2014]/g, '');
      const assertContract = (payload, submittedEori) => {
        if (!payload || typeof payload !== 'object' || typeof payload.normalized_eori !== 'string') throw new Error('contract');
        if (payload.normalized_eori !== submittedEori) throw new Error('contract');
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
        const submittedEori = normalizeEori(candidate);
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
          const payload = assertContract(await response.json(), submittedEori);
          if (payload.format.status === 'not_supported') {
            showResult({
              state: 'unsupported',
              label: 'USE THE EU CHECKER',
              title: 'This is not a GB EORI number.',
              message: 'Use the European Commission checker for XI and EU EORI numbers.',
              payload,
              showEu: true,
              showActions: false,
              sentToHmrc: false,
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
              sentToHmrc: false,
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
              message: 'HMRC’s live register has no active GB EORI for this number. Check for a typo, then ask the holder for their HMRC confirmation.',
              payload,
              showActions: false,
              showNext: true,
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
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" /><link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
        <div class="masthead-cell eori-masthead-source"><span>REGISTRY SOURCE</span><strong>${HMRC_API_LABEL}</strong></div>
        <a class="masthead-cta" data-eori-booking="masthead" href="/?src=tool_gb_eori_checker#book">BOOK THE 20-MINUTE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${navHtml}</nav>
      <div class="breadcrumbs">${breadcrumbHtml(checker.path, 'GB EORI CHECKER')}</div>
      <main>
        <section class="eori-top" aria-labelledby="eori-h1">
          <p class="eyebrow">${escapeHtml(checker.eyebrow)}</p>
          <h1 id="eori-h1">${escapeHtml(checker.h1)}</h1>
          <p class="eori-subhead">${escapeHtml(checker.subhead)}</p>
          <form id="eori-form" novalidate>
            <div class="eori-form-head">
              <label for="eori-number"><span>GB EORI NUMBER</span><small>Usually GB followed by 12 or 15 digits</small></label>
              <span class="eori-chips" role="group" aria-label="EORI prefixes: GB is checked here with HMRC; XI and EU open the European Commission checker">
                <b title="Checked here with HMRC">GB</b><a data-eori-eu="chip_xi" href="${EU_CHECKER_URL}" title="XI numbers: European Commission checker">XI ↗</a><a data-eori-eu="chip_eu" href="${EU_CHECKER_URL}" title="EU numbers: European Commission checker">EU ↗</a>
              </span>
            </div>
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
          <a data-eori-eu="before_result" href="${EU_CHECKER_URL}">OPEN THE OFFICIAL EU CHECKER ↗</a>
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
            <div><dt id="eori-normalized-label">NUMBER WE CHECKED WITH HMRC</dt><dd id="eori-normalized">—</dd></div>
            <div><dt>DECLARIX CHECK TIME</dt><dd id="eori-checked-at">—</dd></div>
            <div><dt>HMRC PROCESSING TIME</dt><dd id="eori-provider-time">—</dd></div>
            <div><dt>REGISTRY SOURCE</dt><dd><a href="https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/check-eori-number-api/1.0">${HMRC_API_LABEL} ↗</a></dd></div>
          </dl>
          <div class="eori-company-details" id="eori-company-details" hidden>
            <span>HOLDER-PUBLISHED BUSINESS DETAILS</span>
            <strong id="eori-trader-name"></strong>
            <p id="eori-trader-address"></p>
          </div>
          <div class="eori-result-eu" id="eori-result-eu" hidden>
            <a class="button" data-eori-eu="unsupported_result" href="${EU_CHECKER_URL}">CHECK WITH THE EUROPEAN COMMISSION ↗</a>
          </div>
          <div class="eori-result-actions" id="eori-result-actions" hidden>
            <div><span>NEXT JOB</span><h3>Got the party identifier. Now check the declaration handoff.</h3></div>
            <a class="eori-secondary-action" data-eori-pack="result" href="/tools/customs-document-pack-check/">RUN THE FREE PACK CHECK</a>
            <a class="button" data-eori-booking="result" href="/?src=tool_gb_eori_checker_result#book">MAP THE FIRST WORKFLOW IN 20 MINUTES</a>
          </div>
          <div class="eori-result-next" id="eori-result-next" hidden>
            <div><span>NEXT STEP</span><h3>Number not confirmed. Fix the party, then check the declaration handoff in minutes.</h3></div>
            <ol>
              <li><strong>Re-check the format.</strong> A GB EORI is GB followed by 12 digits, sometimes 15. Northern Ireland numbers start with XI. Look for lookalikes: the letter O for 0 and the letter I for 1.</li>
              <li><strong>Use the right checker.</strong> GB numbers: check again here, with HMRC. XI and EU numbers: use the <a data-eori-eu="not_confirmed" href="${EU_CHECKER_URL}">European Commission EORI validation service ↗</a>.</li>
              <li><strong>Ask the holder.</strong> Ask your client for their HMRC EORI confirmation letter or email, then check the number on it.</li>
            </ol>
            <div class="eori-result-next-actions">
              <a class="eori-secondary-action" data-eori-pack="not_confirmed" href="/tools/customs-document-pack-check/">RUN THE FREE PACK CHECK</a>
              <a class="button" data-eori-booking="not_confirmed" href="/?src=tool_gb_eori_checker_result#book">MAP THE FIRST WORKFLOW IN 20 MINUTES</a>
            </div>
          </div>
        </section>
        <p class="visually-hidden" id="eori-status" aria-live="polite"></p>

        <section class="eori-about" aria-labelledby="eori-form-heading">
          <div class="eori-about-copy">
            <span class="section-label">CHECK ONE GB EORI</span>
            <h2 id="eori-form-heading">Paste the number. Get the registry answer.</h2>
            <p>${escapeHtml(checker.standfirst)}</p>
            <p>Spaces and common pasted separators are accepted. The result stays ungated and shows when HMRC processed the check.</p>
            <div class="eori-hero-trust"><strong>ONE NUMBER</strong><strong>NO ACCOUNT</strong><strong>NO RESULT STORED</strong></div>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${escapeHtml(checker.ref)}</span>
            <div class="stamp">GB<br />REGISTRY</div>
            <div class="review-cell"><span>HMRC SOURCES REVIEWED</span><strong>${reviewStamp(checker.reviewedOn)} · EVERY RESULT IS LIVE</strong></div>
          </aside>
        </section>

        <section class="eori-explainer" aria-labelledby="eori-explainer-heading">
          <header><span class="section-label">DIRECT ANSWER</span><h2 id="eori-explainer-heading">What this EORI check tells you.</h2><p>A GB EORI begins with GB and is used to identify an economic operator in customs activity. This checker gives you HMRC’s current registry answer for one number—not a guess based on its shape.</p></header>
          <div>
            <article><span>01 · REGISTRY</span><h3>Valid means HMRC confirmed it.</h3><p>The valid or not-confirmed answer comes from HMRC. Matching the expected letters and digits alone never creates a valid result.</p></article>
            <article><span>02 · PUBLIC DETAILS</span><h3>No name does not cancel a valid result.</h3><p>HMRC supplies trader details only when the holder has chosen to publish them. The validity answer stands separately.</p></article>
            <article><span>03 · FRESHNESS</span><h3>Use the timestamp.</h3><p>Every completed registry result shows the Declarix check time and the HMRC processing time when supplied.</p></article>
            <article><span>04 · NEXT WORKFLOW</span><h3>Move from identifier to usable pack.</h3><p>Use the free pack checker to organise the evidence handoff, or bring the first workflow and desk numbers to the 20-minute call.</p></article>
          </div>
        </section>

        <section class="eori-guide" id="how-to-check-eori" aria-labelledby="eori-how-heading">
          <header><span class="section-label">HOW TO CHECK AN EORI NUMBER</span><h2 id="eori-how-heading">How to check an EORI number in four steps</h2><p>Paste a GB number into the checker above for HMRC’s live registry answer. Use the European Commission checker for XI and EU numbers.</p></header>
          <ol class="eori-steps">
            <li><b>01</b><div><strong>Read the first two letters.</strong><p>GB means a UK number issued by HMRC: check it here. XI, or an EU country code such as DE, FR, NL or IE, goes to the European Commission checker.</p></div></li>
            <li><b>02</b><div><strong>Paste the whole number.</strong><p>Spaces, dashes and lower-case letters are fine. The checker tidies them before it asks HMRC.</p></div></li>
            <li><b>03</b><div><strong>Read the answer and the time.</strong><p>Valid means HMRC confirmed the number when the check ran. A name and address appear only when the holder has agreed to publish them.</p></div></li>
            <li><b>04</b><div><strong>Keep the record with the job.</strong><p>Note the check time beside the shipment, then move on to the invoice, packing list and the rest of the document pack.</p></div></li>
          </ol>
        </section>

        <!-- Format facts: HMRC Check an EORI Number API v1.0 and GOV.UK "Get an EORI number" / "Finding and checking an EORI" (checked 16 Oct 2026). -->
        <section class="eori-guide" id="eori-number-format" aria-labelledby="eori-format-heading">
          <header><span class="section-label">EORI NUMBER FORMAT</span><h2 id="eori-format-heading">EORI number format</h2><p>A GB EORI is GB followed by 12 digits, and sometimes 15. An XI EORI uses the same layout for Northern Ireland. An EU EORI starts with the member state’s country code.</p></header>
          <div class="eori-table-scroll" tabindex="0" role="region" aria-label="EORI number formats"><table class="eori-table eori-table-cards">
            <thead><tr><th scope="col">Prefix</th><th scope="col">Format</th><th scope="col">Worked example</th><th scope="col">What to watch</th></tr></thead>
            <tbody>
              <tr><th scope="row" data-label="Prefix">GB</th><td data-label="Format">GB + 12 digits (sometimes 15)</td><td data-label="Worked example"><code>GB123456789000</code></td><td data-label="What to watch">A VAT-registered business’s GB EORI is often its 9-digit VAT number followed by 000.</td></tr>
              <tr><th scope="row" data-label="Prefix">XI</th><td data-label="Format">XI + 12 digits (sometimes 15)</td><td data-label="Worked example"><code>XI123456789000</code></td><td data-label="What to watch">Needed for Northern Ireland movements. You must hold a GB EORI first.</td></tr>
              <tr><th scope="row" data-label="Prefix">DE, FR, NL, IE…</th><td data-label="Format">Country code + national number</td><td data-label="Worked example"><code>DE…</code>, <code>FR…</code></td><td data-label="What to watch">The member state sets the number after the code. Check it with the European Commission service.</td></tr>
            </tbody>
          </table></div>
          <p class="eori-guide-note">After GB or XI, only digits follow. A letter O in place of 0, or a letter I in place of 1, is the most common copying slip from a scan or photo.</p>
        </section>

        <section class="eori-guide" id="gb-eu-eori-checker" aria-labelledby="eori-which-heading">
          <header><span class="section-label">GB EORI CHECKER · EU EORI CHECKER</span><h2 id="eori-which-heading">GB, XI or EU EORI: which checker to use</h2><p>The prefix decides the checker. GB numbers go to HMRC through this page. XI and EU numbers are checked on the European Commission’s EORI validation service.</p></header>
          <div class="eori-table-scroll" tabindex="0" role="region" aria-label="Which EORI checker to use"><table class="eori-table eori-table-cards">
            <thead><tr><th scope="col">Prefix</th><th scope="col">Issued by</th><th scope="col">Check it with</th><th scope="col">Typical use</th></tr></thead>
            <tbody>
              <tr><th scope="row" data-label="Prefix">GB</th><td data-label="Issued by">HMRC</td><td data-label="Check it with">This free GB EORI checker (HMRC registry)</td><td data-label="Typical use">Importing to or exporting from Great Britain</td></tr>
              <tr><th scope="row" data-label="Prefix">XI</th><td data-label="Issued by">HMRC, for Northern Ireland</td><td data-label="Check it with"><a data-eori-eu="guide_xi" href="${EU_CHECKER_URL}">European Commission EORI checker ↗</a></td><td data-label="Typical use">Moving goods into Northern Ireland from Great Britain, declarations and customs decisions in Northern Ireland</td></tr>
              <tr><th scope="row" data-label="Prefix">DE, FR, NL, IE and other EU codes</th><td data-label="Issued by">The EU member state</td><td data-label="Check it with"><a data-eori-eu="guide_eu" href="${EU_CHECKER_URL}">European Commission EORI checker ↗</a></td><td data-label="Typical use">Customs activity in the EU</td></tr>
            </tbody>
          </table></div>
        </section>

        <section class="eori-guide" id="eori-errors" aria-labelledby="eori-errors-heading">
          <header><span class="section-label">COMMON ERRORS</span><h2 id="eori-errors-heading">Common EORI number errors and how to fix them</h2><p>Most failed checks come from a copying slip, the wrong prefix, or a VAT number used in place of an EORI.</p></header>
          <div class="eori-errors">
            <article><strong>An XI or EU number in the GB checker</strong><p>The checker routes it to the European Commission service. Open the handoff and check it there.</p></article>
            <article><strong>Digits missing</strong><p>A GB EORI is usually GB followed by 12 digits, and sometimes 15. Copy the whole number from the source document.</p></article>
            <article><strong>VAT number instead of EORI</strong><p>A GB VAT number has 9 digits. A VAT-registered business’s EORI often adds 000 to it. Ask for the EORI itself.</p></article>
            <article><strong>Letter O for zero, letter I for one</strong><p>GB and XI EORI numbers use only digits after the prefix. Retype any character that came from a scan or photo.</p></article>
            <article><strong>Valid, but no name shown</strong><p>The holder has not agreed to publish their details. The valid answer stands on its own.</p></article>
            <article><strong>HMRC does not confirm the number</strong><p>Check the copy first. The holder can see their number by signing in to the EORI registration service they applied through.</p></article>
          </div>
        </section>

        <!-- Source: GOV.UK "Finding and checking an EORI" (checked 16 Oct 2026): both checkers take a number; name and address show only with the holder's consent. -->
        <section class="eori-guide" id="find-eori-by-company-name" aria-labelledby="eori-name-heading">
          <header><span class="section-label">EORI NUMBER LOOKUP</span><h2 id="eori-name-heading">Can I find an EORI number by company name?</h2><p>No. HMRC’s GB checker and the European Commission checker both search by number, not by name. The register shows a name and address only when the holder has agreed to publish them.</p></header>
          <div class="eori-errors">
            <article><strong>Ask the trader</strong><p>Their EORI is on the HMRC confirmation letter or email they received when they registered. Ask for it, then check it above.</p></article>
            <article><strong>Look at earlier paperwork</strong><p>A previous commercial invoice, customs declaration or carrier entry for the same trader often carries their EORI. Check it again before you reuse it.</p></article>
            <article><strong>Your own business</strong><p>Sign in to the EORI registration service with the Government Gateway details you used to apply. HMRC shows your number once you are signed in.</p></article>
          </div>
        </section>

        <section class="eori-guide" id="how-to-get-eori" aria-labelledby="eori-get-heading">
          <header><span class="section-label">HOW TO GET AN EORI NUMBER</span><h2 id="eori-get-heading">How to get an EORI number, including XI</h2><p>Apply on GOV.UK with a Government Gateway user ID. HMRC says you get a GB EORI number immediately unless it needs to make checks, which can take up to 5 working days.</p></header>
          <div class="eori-get">
            <article><span>GB EORI · WHAT YOU NEED</span><ul><li>Unique Taxpayer Reference (UTR)</li><li>VAT number and effective date of registration, if you are VAT registered</li><li>Standard Industrial Classification (SIC) code</li><li>Business start date</li><li>National Insurance number, if you are an individual or sole trader</li></ul><p><a href="https://www.gov.uk/eori/apply-for-eori">Apply for an EORI number on GOV.UK ↗</a></p></article>
            <article id="xi-eori"><span>XI EORI · NORTHERN IRELAND</span><p>You will usually need an XI EORI number to move goods into Northern Ireland from Great Britain, to move goods from Northern Ireland to a non-EU country, to make a declaration in Northern Ireland, or to apply for a customs decision there.</p><p>Apply for a GB EORI number first. Then complete the XI EORI registration form. You will need your XI VAT number (if you have one), any EU VAT numbers and, in most cases, 2 documents that show a permanent business establishment in Northern Ireland, such as a bank statement and a utility bill. HMRC says the XI number arrives within 5 days. To check an XI EORI, use the <a data-eori-eu="guide_get_xi" href="${EU_CHECKER_URL}">European Commission checker ↗</a>.</p></article>
          </div>
        </section>

        <section class="eori-related" aria-labelledby="eori-related-heading">
          <header><span class="section-label">KEEP MOVING</span><h2 id="eori-related-heading">From EORI to first declaration workflow.</h2><p>Use the result now, then move into the next practical job without surrendering it to a form.</p></header>
          <nav aria-label="Related EORI and customs resources">
            <a data-eori-pack="related" href="/tools/customs-document-pack-check/"><span>FREE TOOL</span><strong>Customs document pack checker</strong><b>OPEN ↗</b></a>
            <a href="/customs-intermediary-registration-2026/"><span>RESPONSE KIT</span><strong>Customs intermediary registration 2026</strong><b>OPEN ↗</b></a>
            <a href="/how-it-works/"><span>WORKFLOW</span><strong>How Declarix builds a CDS-ready pack</strong><b>OPEN ↗</b></a>
            <a href="/tools/commercial-invoice-generator/"><span>FREE GENERATOR</span><strong>Commercial invoice template with EORI fields</strong><b>OPEN ↗</b></a>
            <a href="/tools/packing-list-generator/"><span>FREE GENERATOR</span><strong>Shipping packing list template</strong><b>OPEN ↗</b></a>
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
        <div class="source-stamp">FREE GB EORI TOOL · ${HMRC_API_LABEL} · REVIEWED ${checker.reviewedOn} · <a href="/editorial-policy/">SOURCES AND CORRECTIONS</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
      </main>
      <footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav></footer>
    </div>
    ${checkerScript(checker, apiOrigin, posthogKey, posthogHost)}
  </body>
</html>`
}

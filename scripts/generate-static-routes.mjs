import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { calculators, renderCalculator } from './calculators.mjs'
import {
  eoriChecker,
  renderEoriChecker,
  resolvePublicEoriReleaseConfig,
} from './eori-checker.mjs'
import { aggregateCsv, pressChartSvg, renderReport, reports } from './reports.mjs'
import { routes, site } from './routes.mjs'
import { renderTool, tools } from './tools.mjs'
import { renderValueDutyWorkpaper, valueDutyWorkpapers } from './value-duty-workpapers.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')
const posthogKey = process.env.VITE_POSTHOG_KEY || ''
const posthogHost = process.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com'
const publicEori = resolvePublicEoriReleaseConfig()

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

function webmasterTags() {
  return [
    ['google-site-verification', process.env.VITE_GOOGLE_SITE_VERIFICATION],
    ['msvalidate.01', process.env.VITE_BING_SITE_VERIFICATION],
  ]
    .filter(([, value]) => Boolean(value))
    .map(([name, content]) => `<meta name="${name}" content="${escapeHtml(content)}" />`)
    .join('\n    ')
}

function bookingHref(route) {
  const source = `static_${route.path.split('/').filter(Boolean).join('_')}`
  return `/?src=${encodeURIComponent(source)}#book`
}

function routeLinks() {
  const links = [
    ['HOW IT WORKS', '/how-it-works/'],
    ['SCOPE', '/supported-scope/'],
    ['PRICING', '/pricing/'],
    ['PILOT', '/pilot/'],
    ['FREE COST CALCULATOR', '/tools/customs-declaration-cost-calculator/'],
    ['VALUE + DUTY', '/tools/customs-value-import-duty-vat-calculator/'],
    ...(publicEori.enabled ? [['GB EORI CHECK', eoriChecker.path]] : []),
    ['FREE PACK CHECK', '/tools/customs-document-pack-check/'],
    ['CLEARANCE SOFTWARE', '/customs-clearance-software/'],
    ['REGISTRATION KIT', '/customs-intermediary-registration-2026/'],
    ['RESEARCH', '/research/uk-customs-operations-signal-report-2026/'],
    ['SECURITY', '/security/'],
    ['ABOUT', '/about/'],
  ]
  return links.map(([label, path]) => `<a href="${path}">${label}</a>`).join('')
}

function renderSection(section, index) {
  const paragraphs = (section.paragraphs || [])
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('')
  const list = section.list
    ? `<ul>${section.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : ''
  const facts = section.facts
    ? `<div class="fact-table">${section.facts
        .map(
          ([label, value]) =>
            `<div class="fact-row"><span class="field-label">${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`,
        )
        .join('')}</div>`
    : ''
  return `<section class="sheet">
    <span class="section-label">${escapeHtml(section.label || String(index + 1).padStart(2, '0'))}</span>
    <h2>${escapeHtml(section.title)}</h2>
    ${paragraphs}${list}${facts}
  </section>`
}

function renderSources(route) {
  if (!route.sources?.length) return ''
  const sourceId = `sources-${route.path.split('/').filter(Boolean).join('-')}`
  return `<section class="source-register" aria-labelledby="${sourceId}">
    <header>
      <span class="section-label">PRIMARY SOURCE REGISTER</span>
      <h2 id="${sourceId}">Check the record behind this page.</h2>
      <p>Publisher facts and Declarix interpretation are kept separate. Links below are the source register checked for this edition.</p>
    </header>
    <ol>${route.sources
      .map(
        (source) => `<li>
          <a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a>
          <span>${escapeHtml(source.publisher)} · CHECKED ${escapeHtml(source.checked)}</span>
        </li>`,
      )
      .join('')}</ol>
  </section>`
}

function renderHeroStrip(route) {
  if (route.heroStrip?.length) {
    return `<div class="hero-value-strip">${route.heroStrip.map((item) => `<strong>${escapeHtml(item)}</strong>`).join('')}</div>`
  }
  const boundaryRoutes = new Set(['/privacy/', '/security/', '/terms/', '/editorial-policy/'])
  return boundaryRoutes.has(route.path) && route.limitations
    ? `<p class="limitations">LIMITATION · ${escapeHtml(route.limitations)}</p>`
    : ''
}

function renderResourceKit(route) {
  if (!route.resourceKit) return ''
  const kit = route.resourceKit
  return `<section class="resource-kit" aria-labelledby="registration-kit-heading">
    <header class="resource-kit-header">
      <span class="section-label">${escapeHtml(kit.label)}</span>
      <h2 id="registration-kit-heading">${escapeHtml(kit.title)}</h2>
      <p>${escapeHtml(kit.intro)}</p>
    </header>
    <div class="resource-downloads">${kit.assets
      .map(
        (asset) => `<a class="resource-download" href="${escapeHtml(asset.href)}" download data-kit-download="${escapeHtml(asset.id)}" data-kit-format="${escapeHtml(asset.format.toLowerCase())}">
          <span class="resource-format">${escapeHtml(asset.format)}</span>
          <strong>${escapeHtml(asset.title)}</strong>
          <p>${escapeHtml(asset.description)}</p>
          <small>${escapeHtml(asset.meta)}</small>
          <b aria-hidden="true">DOWNLOAD ↓</b>
        </a>`,
      )
      .join('')}</div>
    <ol class="resource-steps">${kit.steps
      .map(
        ([number, title, copy]) => `<li><span>${escapeHtml(number)}</span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(copy)}</p></div></li>`,
      )
      .join('')}</ol>
    <aside class="resource-boundary"><strong>Keep the official source open.</strong><span>${escapeHtml(route.boundary)}</span></aside>
  </section>`
}

function routeAnalyticsScript(route) {
  if (!route.resourceKit) return ''
  return `<script>
    (() => {
      const push = (event, properties = {}) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event, page_path: location.pathname, ...properties });
      };
      document.querySelectorAll('[data-kit-download]').forEach((link) => link.addEventListener('click', () => {
        push('registration_kit_downloaded', {
          asset_id: link.dataset.kitDownload,
          asset_format: link.dataset.kitFormat,
        });
      }));
      document.querySelectorAll('[data-kit-booking]').forEach((link) => link.addEventListener('click', () => {
        push('registration_kit_booking_clicked', { placement: link.dataset.kitBooking });
      }));
    })();
  </script>`
}

function jsonLd(route) {
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
        '@type': route.schemaType || 'WebPage',
        '@id': `${site.origin}${route.path}#webpage`,
        url: `${site.origin}${route.path}`,
        name: route.title,
        headline: route.h1,
        description: route.description,
        datePublished: route.publishedOn,
        dateModified: site.reviewedOn,
        isPartOf: { '@id': `${site.origin}/#website` },
        about: { '@id': `${site.origin}/#organization` },
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
        image: `${site.origin}/og.jpg`,
        citation: route.sources?.map((source) => source.url),
      },
      {
        '@type': 'WebSite',
        '@id': `${site.origin}/#website`,
        name: 'Declarix',
        url: `${site.origin}/`,
        publisher: { '@id': `${site.origin}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
          { '@type': 'ListItem', position: 2, name: route.h1, item: `${site.origin}${route.path}` },
        ],
      },
    ],
  }).replaceAll('<', '\\u003c')
}

function renderRoute(route) {
  const canonical = `${site.origin}${route.path}`
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(route.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterTags()}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <meta property="og:type" content="website" />
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
    <script type="application/ld+json">${jsonLd(route)}</script>
  </head>
  <body>
    <div class="docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>CORE OUTCOME</span><strong>UP TO 3×</strong></div>
        <a class="masthead-cta" ${route.resourceKit ? 'data-kit-booking="masthead"' : ''} href="${bookingHref(route)}">BOOK THE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${routeLinks()}</nav>
      <div class="breadcrumbs"><a href="/">HOME</a> → ${escapeHtml(route.eyebrow)}</div>
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
            <div class="review-cell"><span>LAST REVIEWED</span><strong>${site.reviewedOn}</strong></div>
          </aside>
        </header>
        ${renderHeroStrip(route)}
        <div class="content-grid">${route.sections.map(renderSection).join('')}</div>
        ${renderResourceKit(route)}
        ${renderSources(route)}
        <div class="source-stamp">SOURCE AND CORRECTIONS · REVIEWED ${site.reviewedOn} · <a href="/editorial-policy/">READ THE POLICY</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
        <section class="cta-band">
          <div><h2>${escapeHtml(route.cta?.title || 'Run the numbers before you buy.')}</h2><p>${escapeHtml(route.cta?.copy || 'Bring weekly volume, current minutes per declaration, loaded clerk cost and the system your team files through. Leave with an ROI estimate, integration route and recommended first workflow.')}</p></div>
          <a class="button" ${route.resourceKit ? 'data-kit-booking="bottom_cta"' : ''} href="${bookingHref(route)}">${escapeHtml(route.cta?.label || 'BOOK THE 20-MINUTE NUMBERS CALL')}</a>
        </section>
      </main>
      <footer class="footer">
        <span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span>
        <nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/pricing-policy/">PRICING POLICY</a><a href="/customs-declaration-software/">CUSTOMS SOFTWARE</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav>
      </footer>
    </div>
    ${routeAnalyticsScript(route)}
  </body>
</html>`
}

function renderNotFound() {
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="The requested Declarix page was not found. Return home or use the evidence-backed product, scope, pricing, pilot, privacy, and security routes." />
    <meta name="robots" content="noindex,follow" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterTags()}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <title>Page not found | Declarix</title>
  </head>
  <body>
    <div class="docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>FORM STATUS</span><strong>NOT FOUND</strong></div>
        <a class="masthead-cta" href="/">RETURN HOME</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${routeLinks()}</nav>
      <main>
        <header class="hero">
          <div class="hero-copy">
            <p class="eyebrow">404 · NO MATCHING DOCKET</p>
            <h1>That docket is not in this register.</h1>
            <p>The address may have changed. Use the evidence-backed routes above or return to the Declarix homepage.</p>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">EXCEPTION 404 · ROUTE NOT FOUND</span>
            <div class="stamp">RETURN<br />TO REGISTER</div>
          </aside>
        </header>
      </main>
      <footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber}</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a></nav></footer>
    </div>
  </body>
</html>`
}

function renderBookingConfirmed() {
  const analyticsConfig = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Your Declarix workflow call has been booked. Return to the site or review what to bring to the conversation." />
    <meta name="robots" content="noindex,follow" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterTags()}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <title>Workflow call booked | Declarix</title>
  </head>
  <body>
    <div class="docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>FORM STATUS</span><strong>BOOKED</strong></div>
        <a class="masthead-cta" href="/pilot/">REVIEW THE PILOT</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${routeLinks()}</nav>
      <main>
        <header class="hero">
          <div class="hero-copy">
            <p class="eyebrow">BOOKING RECEIPT · WORKFLOW REVIEW</p>
            <h1>Your workflow call is in the diary.</h1>
            <p>Bring the approximate weekly volume, current customs system, representative document mix, and the exceptions that create work. Do not send live customer documents before a transfer channel is agreed.</p>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">CONVERSION · BOOKING COMPLETE</span>
            <div class="stamp">CALL<br />BOOKED</div>
          </aside>
        </header>
        <section class="cta-band">
          <div><h2>Prepare the useful facts.</h2><p>The call will define supported scope, the side-by-side measurement, and the information needed for a written pilot proposal.</p></div>
          <a class="button" href="/pilot/">READ THE PILOT DOCKET</a>
        </section>
      </main>
      <footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber}</span><nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a></nav></footer>
    </div>
    <script>
      (() => {
        const config = ${analyticsConfig};
        const source = sessionStorage.getItem('dclrx-source') || 'direct';
        const campaign = sessionStorage.getItem('dclrx-campaign') || 'none';
        const distinctId = sessionStorage.getItem('dclrx-distinct-id') || crypto.randomUUID();
        sessionStorage.setItem('dclrx-distinct-id', distinctId);
        const properties = { source, campaign, page_path: '/booking-confirmed/', provider: 'zoho' };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'booking_completed', ...properties });
        if (!config.posthogKey) return;
        const body = JSON.stringify({ api_key: config.posthogKey, event: 'booking_completed', distinct_id: distinctId, properties });
        if (navigator.sendBeacon && navigator.sendBeacon(config.posthogHost + '/capture/', body)) return;
        fetch(config.posthogHost + '/capture/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => undefined);
      })();
    </script>
  </body>
</html>`
}

const paths = new Set()
const titles = new Set()
const headings = new Set()
for (const route of routes) {
  if (!route.path.startsWith('/') || !route.path.endsWith('/')) throw new Error(`Route must use a trailing slash: ${route.path}`)
  if (paths.has(route.path)) throw new Error(`Duplicate route: ${route.path}`)
  if (titles.has(route.title)) throw new Error(`Duplicate title: ${route.title}`)
  if (headings.has(route.h1)) throw new Error(`Duplicate H1: ${route.h1}`)
  if (route.sections.length < 4) throw new Error(`Thin route: ${route.path}`)
  if (route.sources && route.sources.length < 2) throw new Error(`Authority route needs at least two sources: ${route.path}`)
  if (route.schemaType === 'Article' && !route.publishedOn) throw new Error(`Article is missing publication date: ${route.path}`)
  if (route.expiresOn && Date.now() > Date.parse(`${route.expiresOn}T23:59:59Z`)) {
    throw new Error(`Time-sensitive route requires review: ${route.path} expired ${route.expiresOn}`)
  }
  paths.add(route.path)
  titles.add(route.title)
  headings.add(route.h1)

  const target = join(dist, route.path.slice(1), 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, renderRoute(route))
}

for (const tool of tools) {
  if (!tool.path.startsWith('/') || !tool.path.endsWith('/')) throw new Error(`Tool must use a trailing slash: ${tool.path}`)
  if (paths.has(tool.path)) throw new Error(`Duplicate route: ${tool.path}`)
  if (titles.has(tool.title)) throw new Error(`Duplicate title: ${tool.title}`)
  if (headings.has(tool.h1)) throw new Error(`Duplicate H1: ${tool.h1}`)
  if (tool.groups.length < 4 || tool.groups.some((group) => group.prompts.length < 3)) {
    throw new Error(`Tool has an incomplete prompt model: ${tool.path}`)
  }
  if (tool.sources.length < 2) throw new Error(`Tool needs at least two primary sources: ${tool.path}`)
  paths.add(tool.path)
  titles.add(tool.title)
  headings.add(tool.h1)

  const target = join(dist, tool.path.slice(1), 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(
    target,
    renderTool(tool, site, {
      navHtml: routeLinks(),
      webmasterHtml: webmasterTags(),
      posthogKey,
      posthogHost,
    }),
  )
}

for (const calculator of calculators) {
  if (!calculator.path.startsWith('/') || !calculator.path.endsWith('/')) {
    throw new Error(`Calculator must use a trailing slash: ${calculator.path}`)
  }
  if (paths.has(calculator.path)) throw new Error(`Duplicate route: ${calculator.path}`)
  if (titles.has(calculator.title)) throw new Error(`Duplicate title: ${calculator.title}`)
  if (headings.has(calculator.h1)) throw new Error(`Duplicate H1: ${calculator.h1}`)
  if (calculator.faqs.length < 3) throw new Error(`Calculator needs visible FAQ support: ${calculator.path}`)
  if (calculator.sources.length < 2) throw new Error(`Calculator needs two context sources: ${calculator.path}`)
  paths.add(calculator.path)
  titles.add(calculator.title)
  headings.add(calculator.h1)

  const target = join(dist, calculator.path.slice(1), 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(
    target,
    renderCalculator(calculator, site, {
      navHtml: routeLinks(),
      webmasterHtml: webmasterTags(),
      posthogKey,
      posthogHost,
    }),
  )
}

for (const report of reports) {
  if (!report.path.startsWith('/') || !report.path.endsWith('/')) {
    throw new Error(`Report must use a trailing slash: ${report.path}`)
  }
  if (paths.has(report.path)) throw new Error(`Duplicate route: ${report.path}`)
  if (titles.has(report.title)) throw new Error(`Duplicate title: ${report.title}`)
  if (headings.has(report.h1)) throw new Error(`Duplicate H1: ${report.h1}`)
  if (report.sources.length < 3) throw new Error(`Report needs a documented source universe: ${report.path}`)
  if (report.tiers.reduce((sum, row) => sum + row.count, 0) !== report.qualifiedTotal) {
    throw new Error(`Report tier total does not reconcile: ${report.path}`)
  }
  if (report.ledger.reduce((sum, row) => sum + row.count, 0) !== report.totalDecisions) {
    throw new Error(`Report ledger total does not reconcile: ${report.path}`)
  }
  if (report.websiteDiscovery.reduce((sum, row) => sum + row.count, 0) !== report.websiteUniverse) {
    throw new Error(`Report website-discovery total does not reconcile: ${report.path}`)
  }
  paths.add(report.path)
  titles.add(report.title)
  headings.add(report.h1)

  const target = join(dist, report.path.slice(1), 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(
    target,
    renderReport(report, site, {
      navHtml: routeLinks(),
      webmasterHtml: webmasterTags(),
      posthogKey,
      posthogHost,
    }),
  )
  await mkdir(join(dist, 'downloads'), { recursive: true })
  await writeFile(join(dist, report.downloads[0].href.slice(1)), aggregateCsv(report))
  await writeFile(join(dist, report.downloads[1].href.slice(1)), pressChartSvg(report))
}

for (const workpaper of valueDutyWorkpapers) {
  if (!workpaper.path.startsWith('/') || !workpaper.path.endsWith('/')) {
    throw new Error(`Value and duty workpaper must use a trailing slash: ${workpaper.path}`)
  }
  if (paths.has(workpaper.path)) throw new Error(`Duplicate route: ${workpaper.path}`)
  if (titles.has(workpaper.title)) throw new Error(`Duplicate title: ${workpaper.title}`)
  if (headings.has(workpaper.h1)) throw new Error(`Duplicate H1: ${workpaper.h1}`)
  if (workpaper.questions.length < 3) throw new Error(`Workpaper needs visible question support: ${workpaper.path}`)
  if (workpaper.sources.length < 4) throw new Error(`Workpaper needs primary source coverage: ${workpaper.path}`)
  paths.add(workpaper.path)
  titles.add(workpaper.title)
  headings.add(workpaper.h1)

  const target = join(dist, workpaper.path.slice(1), 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(
    target,
    renderValueDutyWorkpaper(workpaper, site, {
      navHtml: routeLinks(),
      webmasterHtml: webmasterTags(),
      posthogKey,
      posthogHost,
    }),
  )
}

if (publicEori.enabled) {
  if (paths.has(eoriChecker.path)) throw new Error(`Duplicate route: ${eoriChecker.path}`)
  if (titles.has(eoriChecker.title)) throw new Error(`Duplicate title: ${eoriChecker.title}`)
  if (headings.has(eoriChecker.h1)) throw new Error(`Duplicate H1: ${eoriChecker.h1}`)
  if (eoriChecker.questions.length < 4) throw new Error('EORI checker needs visible question support')
  if (eoriChecker.sources.length < 3) throw new Error('EORI checker needs official source coverage')
  paths.add(eoriChecker.path)
  titles.add(eoriChecker.title)
  headings.add(eoriChecker.h1)

  const target = join(dist, eoriChecker.path.slice(1), 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(
    target,
    renderEoriChecker(eoriChecker, site, {
      apiOrigin: publicEori.apiOrigin,
      navHtml: routeLinks(),
      webmasterHtml: webmasterTags(),
      posthogKey,
      posthogHost,
    }),
  )
}

const indexableRoutes = [
  ...routes,
  ...tools,
  ...calculators,
  ...reports,
  ...valueDutyWorkpapers,
  ...(publicEori.enabled ? [eoriChecker] : []),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.origin}/</loc><lastmod>${site.reviewedOn}</lastmod></url>
${indexableRoutes.map((route) => `  <url><loc>${site.origin}${route.path}</loc><lastmod>${route.reviewedOn || site.reviewedOn}</lastmod></url>`).join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap)

const llmsRoutes = indexableRoutes
  .map((route) => `- [${route.title}](${site.origin}${route.path}): ${route.description}`)
  .join('\n')
const llms = `# Declarix
> Up to 3× more customs declarations per clerk, with no new headcount and more margin on every declaration.

## Primary pages
- [Declarix homepage](${site.origin}/): Core offer, product walkthrough, worked ROI model, integrations, pilot terms, and 20-minute numbers call.
${llmsRoutes}

## Product and commercial facts
- Declarix builds CDS-ready entry packs from customer documents.
- Typical processing is around 200 seconds before clerk review.
- Sequoia, Descartes e-Customs, and customer integrations are supported.
- The worked labour model shows £7.95 to £2.45 per declaration; buyers replace those assumptions with their numbers on the call.
- The pilot is free if it fails and capped at £500 if it works.
- Declarix does not submit to HMRC.
- The authorised clerk checks and approves; the broker files through its existing customs system.
- Do not send live customer documents through the public website.

## Contact and corrections
- Product and workflow enquiries: ${site.contact}
- Sources and corrections: ${site.origin}/editorial-policy/
`
const llmsFull = `${llms}
## Publication record
- Owner-approved offer version: ${site.claimsVersion}
- Last editorial review: ${site.reviewedOn}

## Citation guidance
Use the supported-scope, pricing, security, and editorial-policy pages for detail. The homepage shows a worked model. The free customs declaration cost calculator uses buyer-entered inputs and assumes no Declarix rate; the 20-minute numbers call tests the model against the buyer’s workflow and proposed per-entry rate.
`
await writeFile(join(dist, 'llms.txt'), llms)
await writeFile(join(dist, 'llms-full.txt'), llmsFull)

await writeFile(join(dist, '404.html'), renderNotFound())
await mkdir(join(dist, 'booking-confirmed'), { recursive: true })
await writeFile(join(dist, 'booking-confirmed', 'index.html'), renderBookingConfirmed())
await writeFile(join(dist, '.nojekyll'), '')

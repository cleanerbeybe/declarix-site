import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { routes, site } from './routes.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

function routeLinks() {
  const links = [
    ['HOW IT WORKS', '/how-it-works/'],
    ['SCOPE', '/supported-scope/'],
    ['PRICING', '/pricing/'],
    ['PILOT', '/pilot/'],
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
        '@type': 'WebPage',
        '@id': `${site.origin}${route.path}#webpage`,
        url: `${site.origin}${route.path}`,
        name: route.title,
        description: route.description,
        dateModified: site.reviewedOn,
        isPartOf: { '@id': `${site.origin}/#website` },
        about: { '@id': `${site.origin}/#organization` },
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
        <div class="masthead-cell"><span>CLAIMS MANIFEST</span><strong>${site.claimsVersion}</strong></div>
        <a class="masthead-cta" href="${site.booking}">BOOK A WORKFLOW CALL</a>
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
        <p class="limitations">LIMITATION · ${escapeHtml(route.limitations)}</p>
        <div class="content-grid">${route.sections.map(renderSection).join('')}</div>
        <div class="source-stamp">SOURCE AND CORRECTIONS · PUBLIC CLAIMS MANIFEST ${site.claimsVersion} · REVIEWED ${site.reviewedOn} · <a href="/editorial-policy/">READ THE POLICY</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
        <section class="cta-band">
          <div><h2>Put one workflow on the table.</h2><p>Bring a representative week’s volume and a synthetic or properly anonymised pack shape. Do not send live documents until the transfer channel is agreed.</p></div>
          <a class="button" href="${site.booking}">BOOK THE 20-MINUTE CALL</a>
        </section>
      </main>
      <footer class="footer">
        <span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span>
        <nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/pricing-policy/">PRICING POLICY</a><a href="/customs-declaration-software/">CUSTOMS SOFTWARE</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav>
      </footer>
    </div>
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

const paths = new Set()
const titles = new Set()
const headings = new Set()
for (const route of routes) {
  if (!route.path.startsWith('/') || !route.path.endsWith('/')) throw new Error(`Route must use a trailing slash: ${route.path}`)
  if (paths.has(route.path)) throw new Error(`Duplicate route: ${route.path}`)
  if (titles.has(route.title)) throw new Error(`Duplicate title: ${route.title}`)
  if (headings.has(route.h1)) throw new Error(`Duplicate H1: ${route.h1}`)
  if (route.sections.length < 4) throw new Error(`Thin route: ${route.path}`)
  paths.add(route.path)
  titles.add(route.title)
  headings.add(route.h1)

  const target = join(dist, route.path.slice(1), 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, renderRoute(route))
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.origin}/</loc><lastmod>${site.reviewedOn}</lastmod></url>
${routes.map((route) => `  <url><loc>${site.origin}${route.path}</loc><lastmod>${site.reviewedOn}</lastmod></url>`).join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap)

await writeFile(join(dist, '404.html'), renderNotFound())
await writeFile(join(dist, '.nojekyll'), '')

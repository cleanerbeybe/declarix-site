// Integration workflows, product feature pages and buyer guides (lane L7, 15 Oct 2026).
// Content lives in product-pages-content.mjs; this file renders it into static, script-free HTML.
import { breadcrumbList, nameForPath, organizationNode } from './site-graph.mjs'
import {
  featureHub,
  featureRoutes,
  guideHub,
  guideRoutes,
  integrationRoutes,
  workflowsHubPath,
} from './product-pages-content.mjs'

export { featureHub, featureRoutes, guideHub, guideRoutes, integrationRoutes, workflowsHubPath }

// Every indexable route this module renders, hubs first.
export const productPages = [featureHub, ...featureRoutes, guideHub, ...guideRoutes, ...integrationRoutes]

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

// Escapes text, then turns [anchor](/path/) or [anchor](https://…) into links.
function rich(text) {
  return escapeHtml(text).replace(/\[([^\]]+)\]\(((?:\/|https:\/\/)[^)\s]*)\)/g, (_, anchor, href) => `<a href="${href}">${anchor}</a>`)
}

function bookingHref(page) {
  const source = `static_${page.path.split('/').filter(Boolean).join('_')}`
  return `/?src=${encodeURIComponent(source)}#book`
}

function parentFor(page) {
  if (page.family === 'feature') return { name: 'Features', path: featureHub.path }
  if (page.family === 'guide') return { name: 'Guides', path: guideHub.path }
  if (page.family === 'integration' && workflowsHubPath) return { name: 'Customs workflows', path: workflowsHubPath }
  return null
}

function renderTable(table) {
  return `<div class="pp-table-wrap" role="region" aria-label="${escapeHtml(table.caption)}" tabindex="0"><table class="pp-table">
      <caption>${escapeHtml(table.caption)}</caption>
      <thead><tr>${table.head.map((cell) => `<th scope="col">${escapeHtml(cell)}</th>`).join('')}</tr></thead>
      <tbody>${table.rows
        .map((row) => `<tr>${row.map((cell, index) => (index === 0 ? `<th scope="row">${rich(cell)}</th>` : `<td>${rich(cell)}</td>`)).join('')}</tr>`)
        .join('')}</tbody>
    </table></div>`
}

function renderFigure(figure) {
  return `<figure class="pp-figure">
      <img src="${escapeHtml(figure.src)}" alt="${escapeHtml(figure.alt)}" width="${figure.width}" height="${figure.height}" loading="lazy" decoding="async" />
      <figcaption>${rich(figure.caption)}</figcaption>
    </figure>`
}

function renderBlock(block, index) {
  const label = block.label || `${String(index + 1).padStart(2, '0')}`
  const paragraphs = (block.paragraphs || []).map((paragraph) => `<p>${rich(paragraph)}</p>`).join('')
  const list = block.list ? `<ul>${block.list.map((item) => `<li>${rich(item)}</li>`).join('')}</ul>` : ''
  const steps = block.steps
    ? `<ol class="pp-steps">${block.steps
        .map(([title, copy], stepIndex) => `<li><span>${String(stepIndex + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(title)}</strong><p>${rich(copy)}</p></div></li>`)
        .join('')}</ol>`
    : ''
  const table = block.table ? renderTable(block.table) : ''
  const figure = block.figure ? renderFigure(block.figure) : ''
  const after = (block.after || []).map((paragraph) => `<p>${rich(paragraph)}</p>`).join('')
  return `<section class="pp-section${block.figure || block.table ? ' pp-wide' : ''}">
      <span class="section-label">${escapeHtml(label)}</span>
      <h2>${escapeHtml(block.title)}</h2>
      ${paragraphs}${list}${steps}${table}${figure}${after}
    </section>`
}

function renderHubIndex(page) {
  return `<section class="pp-index" aria-labelledby="pp-index-heading">
      <span class="section-label">${escapeHtml(page.indexLabel)}</span>
      <h2 id="pp-index-heading">${escapeHtml(page.indexTitle)}</h2>
      <ol>${page.items
        .map(
          (item) => `<li><a href="${item.path}"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.summary)}</span><b aria-hidden="true">OPEN →</b></a></li>`,
        )
        .join('')}</ol>
    </section>`
}

function renderFaqs(page) {
  if (!page.faqs?.length) return ''
  return `<section class="pp-faq" aria-labelledby="pp-faq-heading">
      <span class="section-label">QUESTIONS BUYERS ASK</span>
      <h2 id="pp-faq-heading">Straight answers.</h2>
      <dl>${page.faqs.map(([question, answer]) => `<div class="pp-faq-item"><dt>${escapeHtml(question)}</dt><dd>${rich(answer)}</dd></div>`).join('')}</dl>
    </section>`
}

function renderRelated(page) {
  if (!page.related?.length) return ''
  return `<nav class="pp-related" aria-label="Related pages">
      <span class="section-label">KEEP GOING</span>
      <ul>${page.related
        .map(([label, path, note]) => `<li><a href="${path}">${escapeHtml(label)}</a><span>${escapeHtml(note)}</span></li>`)
        .join('')}</ul>
    </nav>`
}

function renderSources(page) {
  if (!page.sources?.length) return ''
  const sourceId = `sources-${page.path.split('/').filter(Boolean).join('-')}`
  return `<section class="source-register" aria-labelledby="${sourceId}">
    <header>
      <span class="section-label">PRIMARY SOURCE REGISTER</span>
      <h2 id="${sourceId}">Check the record behind this page.</h2>
      <p>Official and vendor facts link to their publisher. Each link was checked on the date shown.</p>
    </header>
    <ol>${page.sources
      .map(
        (source) => `<li>
          <a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a>
          <span>${escapeHtml(source.publisher)} · CHECKED ${escapeHtml(source.checked)}</span>
        </li>`,
      )
      .join('')}</ol>
  </section>`
}

export function productPageJsonLd(page, site) {
  const url = `${site.origin}${page.path}`
  const firstFigure = page.blocks?.find((block) => block.figure)?.figure
  const main = {
    '@type': page.schemaType,
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    headline: page.h1,
    description: page.description,
    inLanguage: 'en-GB',
    datePublished: page.publishedOn,
    dateModified: page.reviewedOn,
    isPartOf: { '@id': `${site.origin}/#website` },
    about: { '@id': `${site.origin}/#organization` },
    author: { '@id': `${site.origin}/#organization` },
    publisher: { '@id': `${site.origin}/#organization` },
    image: firstFigure ? `${site.origin}${firstFigure.src}` : `${site.origin}/og.jpg`,
    citation: page.sources?.map((source) => source.url),
  }
  if (page.schemaType === 'CollectionPage') {
    main.mainEntity = {
      '@type': 'ItemList',
      numberOfItems: page.items.length,
      itemListElement: page.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: `${site.origin}${item.path}`,
      })),
    }
  }
  if (page.schemaType === 'TechArticle') main.mainEntityOfPage = url
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode(site),
      { '@type': 'WebSite', '@id': `${site.origin}/#website`, name: 'Declarix', url: `${site.origin}/`, publisher: { '@id': `${site.origin}/#organization` } },
      main,
      breadcrumbList(site, page.path, page.crumb || nameForPath(page.path)),
    ],
  }).replaceAll('<', '\\u003c')
}

export function renderProductPage(page, site, { navHtml, webmasterHtml }) {
  const canonical = `${site.origin}${page.path}`
  const parent = parentFor(page)
  const crumbTrail = parent
    ? `<a href="/">HOME</a> → <a href="${parent.path}">${escapeHtml(parent.name.toUpperCase())}</a> → ${escapeHtml(page.eyebrow)}`
    : `<a href="/">HOME</a> → ${escapeHtml(page.eyebrow)}`
  const strip = page.strip?.length ? `<div class="hero-value-strip">${page.strip.map((item) => `<strong>${escapeHtml(item)}</strong>`).join('')}</div>` : ''
  const answer = page.answer
    ? `<section class="pp-answer" aria-label="Short answer"><span class="section-label">THE SHORT ANSWER</span><p>${rich(page.answer)}</p></section>`
    : ''
  const secondary = page.cta?.secondary
    ? `<a class="pp-secondary" href="${page.cta.secondary[1]}">${escapeHtml(page.cta.secondary[0])}</a>`
    : ''
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${webmasterHtml}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <link rel="stylesheet" href="/product-pages.css" />
    <meta property="og:type" content="${page.schemaType === 'TechArticle' ? 'article' : 'website'}" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${escapeHtml(page.title)}</title>
    <script type="application/ld+json">${productPageJsonLd(page, site)}</script>
  </head>
  <body>
    <div class="docket">
      <header class="masthead">
        <a class="wordmark" href="/">DECLARIX</a>
        <div class="masthead-cell"><span>CORE OUTCOME</span><strong>UP TO 3×</strong></div>
        <a class="masthead-cta" href="${bookingHref(page)}">BOOK THE NUMBERS CALL</a>
      </header>
      <nav class="route-nav" aria-label="Primary">${navHtml}</nav>
      <div class="breadcrumbs">${crumbTrail}</div>
      <main>
        <header class="hero">
          <div class="hero-copy">
            <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
            <h1>${escapeHtml(page.h1)}</h1>
            <p>${escapeHtml(page.standfirst)}</p>
          </div>
          <aside class="hero-ledger">
            <span class="route-ref">${escapeHtml(page.ref)}</span>
            <div class="stamp">${escapeHtml(page.stamp).replaceAll('\n', '<br />')}</div>
            <div class="review-cell"><span>LAST REVIEWED</span><strong>${page.reviewedOn}</strong></div>
          </aside>
        </header>
        ${strip}
        ${answer}
        ${page.items ? renderHubIndex(page) : ''}
        <div class="pp-body">${(page.blocks || []).map(renderBlock).join('')}</div>
        ${renderFaqs(page)}
        ${renderRelated(page)}
        ${renderSources(page)}
        <div class="source-stamp">SOURCE AND CORRECTIONS · REVIEWED ${page.reviewedOn} · <a href="/editorial-policy/">READ THE POLICY</a> · <a href="mailto:${site.contact}">${site.contact}</a></div>
        <section class="cta-band">
          <div><h2>${escapeHtml(page.cta.title)}</h2><p>${escapeHtml(page.cta.copy)}</p>${secondary}</div>
          <a class="button" href="${bookingHref(page)}">${escapeHtml(page.cta.label)}</a>
        </section>
      </main>
      <footer class="footer">
        <span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span>
        <nav><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a><a href="/terms/">TERMS</a><a href="/pricing-policy/">PRICING POLICY</a><a href="${featureHub.path}">FEATURES</a><a href="${guideHub.path}">GUIDES</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a></nav>
      </footer>
    </div>
  </body>
</html>`
}

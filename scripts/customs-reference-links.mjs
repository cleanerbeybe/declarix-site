// Shared cross-links for the /customs-reference/ cluster.
// The section hub is built in a separate lane; generate-static-routes.mjs switches the hub link on
// as soon as a route with that path exists, so no page ever links to a missing URL.
export const referenceHub = { path: '/customs-reference/', label: 'CUSTOMS REFERENCE LIBRARY', available: false }

export const referencePages = [
  {
    key: 'procedure',
    path: '/customs-reference/customs-procedure-codes/',
    code: 'DE 1/10 · 1/11',
    label: 'Customs procedure codes',
    blurb: 'Every CDS procedure and additional procedure code, with a combination checker.',
  },
  {
    key: 'document',
    path: '/customs-reference/customs-document-codes/',
    code: 'DE 2/3',
    label: 'Customs document codes',
    blurb: 'All 998 Union and national document codes, with status codes and common errors.',
  },
  {
    key: 'error',
    path: '/customs-reference/cds-error-codes/',
    code: 'CDS ERRORS',
    label: 'CDS error codes',
    blurb: 'Every published CDS error code, what it means and the first thing to check.',
  },
  {
    key: 'incoterms',
    path: '/customs-reference/incoterms/',
    code: 'DE 4/1',
    label: 'Incoterms 2020 and UK customs value',
    blurb: 'All 11 rules with a worked UK customs value example for each.',
  },
]

export function referenceLinkStrip(currentKey) {
  const links = referencePages
    .filter((page) => page.key !== currentKey)
    .map(
      (page) =>
        `<a href="${page.path}" data-authority-related="reference_${page.key}"><span>${page.code}</span><strong>${page.label}</strong><small>${page.blurb}</small></a>`,
    )
    .join('')
  const hub = referenceHub.available
    ? `<a class="reference-hub-link" href="${referenceHub.path}" data-authority-related="reference_hub">OPEN THE FULL CUSTOMS REFERENCE LIBRARY →</a>`
    : ''
  return `<section class="reference-strip" aria-labelledby="reference-strip-${currentKey}"><header><span>CUSTOMS REFERENCE</span><h2 id="reference-strip-${currentKey}">Keep the next code on the same desk.</h2></header><div>${links}</div>${hub}</section>`
}

# Declarix / Customaite comparison slice

P17 owns `/compare/declarix-vs-customaite/`. P16 is the `#alternatives` section, not a second route or redirect.

## Evidence and scope

- `scripts/customaite-comparison.mjs`: renderer, nine decision dimensions and 45 scoped cells across five products.
- `contracts/comparisons/customaite-2026-09-16.json`: matching dated claim ledger, source URLs, capture receipts and query uncertainty.
- Four options exclude the focal vendor: Declarix, iCustoms iCDS, ASM Sequoia and Descartes UK e-Customs. They are different workflow choices, not equivalent replacements.
- Official vendor descriptions are attributed, not independent product tests. Unknown facts remain unknown, not negative feature claims.
- Declarix source-reviewed scope is separate from deployed acceptance. H1 is review-only and incomplete. No direct HMRC submission, released customer self-service, accepted named connector, current price or measured savings is asserted.
- No real customer data, input collection, tracking, new accounts or network submission. The CTA opens a scoped enquiry email and warns against attaching live documents.
- Nadia owns the quarterly review, due 2026-12-16, plus event-driven correction on product/plan/ownership changes.

## Reproduce

```sh
npm ci --ignore-scripts
npm run build
npm run lint
npm run test:comparison:browser
npm run test:economics:browser
```

Build runs 14 comparison and 32 existing economics unit tests. Browser checks cover four widths, keyboard use, disclosure scope, all local links and fragments, no JavaScript, automated WCAG checks, no third-party requests, canonical/sitemap ownership and four alternative records. Screenshots and JSON receipts are written under ignored `output/comparison/`.

## Release state

This is a draft comparison build, not release approval. No merge or deployment occurred during preparation. Build output includes the proposed page and discovery links for review; it does not claim the page is live.

Existing public scope/offer pages still carry older, stronger connector/readiness/price statements than the current product claim contract. This PR does not silently change that contract or those pages. Publication remains an explicit consistency decision; do not merge while that conflict is unresolved. Required repository review and branch protections remain binding. Record the final reviewed head, owner release decision and deployed route verification separately.

The comparison adds no arbitrary analytics events. Search demand is unknown and no ranking, traffic or conversion result is claimed. Qualified enquiries can be identified by the dedicated subject line; this is a measurement method, not an observed result.

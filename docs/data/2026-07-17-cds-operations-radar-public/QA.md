# Radar site QA evidence

## Build and regression

| Check | Result |
| --- | --- |
| Production build + route verifier | **24 indexable routes**, one conversion receipt, one real 404 |
| Radar route count | **1 hub + 5 record pages** |
| TypeScript/Vite/static generation | passed |
| Oxlint | passed |
| Patch hygiene | `git diff --check` passed |
| Browser console | **0 errors, 0 warnings** on hub and sampled records |

The verifier asserts unique title, H1, canonical, 80–180 character description, static HTML,
sitemap inclusion, inbound links, minimum content, inline-script syntax, accurate schema types,
deterministic downloads, and the explicit review gate. Existing routes remain in the same complete
build and offer-manifest check.

## Agent SEO skill evidence

The bundled SEO parser inspected the built hub HTML and confirmed:

- title: `CDS Operations Radar — HMRC changes and status | Declarix` (57 characters);
- one H1, a 151-character meta description, self-canonical, `index,follow`, `en-GB`, and viewport;
- 582 parsed words and internal links to all five records, free tool, discovery call, correction
  route, and downloads;
- CollectionPage, ItemList, Organization, and BreadcrumbList graph nodes; and
- complete Open Graph/Twitter image metadata after the final social-preview correction.

The skill's URL fetcher intentionally blocks private/loopback addresses, so robots, live-header,
PageSpeed, and network-crawl scripts could not run against the local preview. That is an environment
limitation, not a confirmed site defect. Static build assertions cover robots metadata, sitemap,
canonicals, links, and schema until live QA.

## Browser interaction QA

Playwright preview target: `http://127.0.0.1:4177`.

- `1440 × 900` hub and record visual review passed.
- `390 × 844` hub and record visual review passed.
- No-result search produced `0 RECORDS`, showed the empty state, and wrote `?q=zz-no-match`.
- Clearing returned five records and removed the query parameter.
- Topic `eori` produced exactly one matching record and wrote `?topic=eori`.
- A clock at 25 July produced one `expired` service-status record and four `stale` records.
- A clock before the effective dates produced the explicit `not_yet_effective` state.
- Both download endpoints returned HTTP 200.
- Print rendering produced a clean five-page record PDF; the rendered first page preserved the
  masthead, breadcrumb, headline, point-in-time summary, and dated ledger without clipping.
- The first visual pass exposed a collapsed conversion action row; it was fixed into a responsive,
  two-column action block with green reserved for the booking path and then rechecked at both widths.

## Visual result

The release preserves the existing Paper World system: Archivo + IBM Plex Mono, deep teal,
off-white paper, amber breadcrumb, one-pixel rules, square geometry, asymmetric ledger hero, dense
accessible tables, and green only for primary conversion. No rounded card grid, violet/indigo,
generic illustration, or governance/legal wall was introduced.

Release state: **no unresolved P0, P1, or P2 visual issue in the inspected hub, result, filter,
record, freshness, source-proof, related-action, booking, and mobile states.**

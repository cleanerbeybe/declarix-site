# Product-scope alignment: draft PR21

16 September 2026. This is **not a sitewide claims clearance, commercial change, or release approval**.

## Evidence and purpose

The operating workspace's 14 September product audit and `deliverables/declarix-seo-v4-2026-09-14/requirements/02_PRODUCT_CLAIMS.md` distinguish case preparation from accepted filing data. Old pages asserted readiness, named connectors, complete source coverage and numerical outcomes. These draft slices replace those assertions without inventing accepted integrations, customer proof or owner approval.

## Completed draft surfaces

- Four vendor comparisons: `/compare/declarix-vs-customaite/` (also owns alternatives), `/compare/declarix-vs-icustoms/`, `/compare/declarix-vs-flytta/`, `/compare/icustoms-vs-customaite/`. Dated evidence and distinct buyer decisions; separate contracts and tests in `contracts/comparisons/`.
- `/supported-scope/` and `/how-it-works/`: preparation, review, configured checks, missing-information work and controlled handoff. `contracts/product-scope-draft-2026-09-16.json` records this two-route slice.
- Homepage, synthetic walkthrough, metadata, no-JS fallback, shared `og.html`/`og.jpg`, global discovery: aligned in the preceding independently reviewed slice. Examples are not live product captures or customer results. Pilot price and turnaround are retained for separate owner decision. `contracts/home-discovery-draft-2026-09-16.json` records that scope.
- **Current selection/About slice:** `/about/`, `/customs-declaration-software/`, `/customs-clearance-software/`. The first explains product purpose, the second separates preparation from filing, and the third maps work and responsibility across the desk. Current H1 limits, safe enquiry copy, title/description, social image, JSON-LD, sitemap and discovery all come from the route data. `contracts/selection-pages-draft-2026-09-16.json` is a dated draft, not publication approval.
- All five scope/selection routes use `public/product-scope.png`, a text-only scope card, not a product screenshot. Regenerate with `node scripts/render-product-scope-card.mjs`.
- Both generated discovery files preserve URLs for eight remaining legacy routes but replace their titles **and descriptions** with neutral labels. Do not infer the underlying pages are aligned from their discovery labels.

The historical `public-claims.v2.0.0.json` remains an old offer record, not current authority for these superseding draft surfaces. The separate dated contracts supplement it; they do not invent a sitewide owner-approved manifest.

## Selection source refresh

The declaration-software route uses these official pages, retrieved 16 September 2026:

1. HMRC software developer list: <https://www.gov.uk/guidance/list-of-software-developers-providing-customs-declaration-support>. HMRC lists developer contact details and explicitly disclaims recommendation or endorsement. No claim that Declarix appears on this list.
2. HMRC end-to-end guide: <https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/>. Describes declaration APIs and end-to-end interaction, not acceptance of a Declarix connector.

## Tests and preservation

`npm run build` runs economics, comparison, scope, selection and home unit tests, TypeScript, the production build and rendered-route verification. `npm run test:scope:browser` now checks all five scope/selection routes at 1440/768/390/320, local links, canonical/social metadata, current JSON-LD, no-JS, safe enquiry copy and automated WCAG. Comparison, economics and home browser suites are regression checks. Automated phrase checks and accessibility scans do not replace semantic or manual review.

`contracts/selection-preserved-routes.json` pins the ten non-selection route definitions to the preceding reviewed head. This includes pilot, pricing, pricing-policy, privacy, security and terms. Their preservation is **not approval of their content**. No booking, telemetry, product runtime, access or account behavior changes in this slice.

## Asset inventory, not clearance

A path/size/digest inventory was recorded in the operating workspace as `reports/2026-09-16-build-trial/ASSET_INVENTORY.json` for `public/` and the local `dist/`. It covers 2,240 entries, counting source files and their built copies separately:

- 2,214 historical motion/frame entries under `world/` or `exhibits/`.
- 20 source or generated downloadable assets (CSV, Markdown and SVG).
- Four entries for the two previously reviewed bounded social images and their built copies.
- Two other image entries (favicon and its copy).

No PDF exists in those two trees. This does not establish that no historical PDF exists elsewhere. Files outside those trees and full git history were not inventoried. No historical asset was removed or modified. Paths and hashes do not inspect pixels, video frames, historical text or legal currency. Asset visual/content review remains open.

## Remaining publication gates

Eight legacy route definitions remain unaligned: `/privacy/`, `/security/`, `/pricing/`, `/pricing-policy/`, `/pilot/`, `/terms/`, `/customs-intermediary-registration-2026/`, `/editorial-policy/`. Separate bounded product-copy fixes from commercial, legal and security commitments. Recheck time-sensitive registration material against current official sources.

- Owner must reconfirm pilot terms (including £500 cap/free-on-failure) and the one-working-day commitment, or approve their replacement. Neither changed here.
- Reconcile the historical site manifest without silently granting commercial/security approval.
- Complete historical/downloadable asset review; no whole-site clearance from this inventory.
- Obtain independent exact-head review of each material change. Draft, built, tested, reviewed, required approval, merged, deployed and live-verified are different states.

Continue the same draft PR21. No merge, deployment or live result is claimed.

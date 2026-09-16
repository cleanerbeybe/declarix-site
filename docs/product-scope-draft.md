# Product-scope alignment: draft PR21

16 September 2026. This is **not a sitewide claims clearance, commercial change, or release approval**.

## Evidence and purpose

The operating workspace's 14 September product audit and `deliverables/declarix-seo-v4-2026-09-14/requirements/02_PRODUCT_CLAIMS.md` distinguish case preparation from accepted filing data. Old pages asserted readiness, named connectors, complete source coverage and numerical outcomes. These draft slices replace those assertions without inventing accepted integrations, customer proof or owner approval.

## Completed draft surfaces

- Four vendor comparisons: `/compare/declarix-vs-customaite/` (also owns alternatives), `/compare/declarix-vs-icustoms/`, `/compare/declarix-vs-flytta/`, `/compare/icustoms-vs-customaite/`. Dated evidence and distinct buyer decisions; separate contracts and tests in `contracts/comparisons/`.
- `/supported-scope/` and `/how-it-works/`: preparation, review, configured checks, missing-information work and controlled handoff. `contracts/product-scope-draft-2026-09-16.json` records this two-route slice.
- Homepage, synthetic walkthrough, metadata, no-JS fallback, shared `og.html`/`og.jpg`, global discovery: aligned in the preceding independently reviewed slice. Examples are not live product captures or customer results. Pilot price and turnaround are retained for separate owner decision. `contracts/home-discovery-draft-2026-09-16.json` records that scope.
- **Selection/About slice:** `/about/`, `/customs-declaration-software/`, `/customs-clearance-software/`. The first explains product purpose, the second separates preparation from filing, and the third maps work and responsibility across the desk. Current H1 limits, safe enquiry copy, title/description, social image, JSON-LD, sitemap and discovery all come from the route data. `contracts/selection-pages-draft-2026-09-16.json` is a dated draft, not publication approval.
- **Legacy product wording slice:** `/security/`, `/pricing/`, `/pilot/`, `/editorial-policy/` removed specific readiness/capacity/destination/every-field assertions. Its independent review did not approve commercial terms, security or the whole site.
- **Current offer-boundary slice:** `/security/`, `/pricing/`, `/pricing-policy/`, `/pilot/` each carry their own hero-adjacent H1 scope limit and safe enquiry CTA. Pricing drops fixed labour/savings figures and links to the existing blank, buyer-input preparation comparison. This compares in-house assisted versus outsourced preparation, not a Declarix performance benchmark. `contracts/offer-boundaries-draft-2026-09-16.json` records scope, preservation and remaining gates.
- All five scope/selection routes use `public/product-scope.png`, a text-only scope card, not a product screenshot. Regenerate with `node scripts/render-product-scope-card.mjs`.
- Both generated discovery files preserve URLs for eight commercial/legal/legacy routes but replace their titles **and descriptions** with neutral labels. Four have bounded product-copy changes, but their commercial/security/legal decisions are not approved. No further discovery promotion is made here.

The historical `public-claims.v2.0.0.json` remains an old offer record, not current authority for these superseding draft surfaces. The separate dated contracts supplement it; they do not invent a sitewide owner-approved manifest.

## Selection source refresh

The declaration-software route uses these official pages, retrieved 16 September 2026:

1. HMRC software developer list: <https://www.gov.uk/guidance/list-of-software-developers-providing-customs-declaration-support>. HMRC lists developer contact details and explicitly disclaims recommendation or endorsement. No claim that Declarix appears on this list.
2. HMRC end-to-end guide: <https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/>. Describes declaration APIs and end-to-end interaction, not acceptance of a Declarix connector.

## Tests and preservation

`npm run build` runs economics, comparison, scope, selection, legacy-offer, per-route offer-boundary and home unit tests, TypeScript, the production build and rendered-route verification. `npm run test:scope:browser` now checks all five scope/selection routes at 1440/768/390/320, local links, canonical/social metadata, current JSON-LD, no-JS, safe enquiry copy and automated WCAG. Comparison, economics and home browser suites are regression checks. Automated phrase checks and accessibility scans do not replace semantic or manual review.

The selection-era preservation manifest originally covered ten route definitions. The legacy four-route slice explicitly superseded four and left six pinned. This offer-boundary contract now supersedes the pricing-policy entry without deleting that historical entry. Five remain enforced under the old baseline; the new contract also pins all nine route objects outside this four-route slice to its immediately preceding head. Six homepage/booking/visual source files, security assertions, commercial pricing provisions and pilot terms have preservation tests. Their preservation is **not approval of their content**. No booking, telemetry, product runtime, access or account behavior changes. Scoped offer pages use the existing short scope navigation and bounded social image; no image is regenerated.

## Asset inventory, not clearance

A path/size/digest inventory was recorded in the operating workspace as `reports/2026-09-16-build-trial/ASSET_INVENTORY.json` for `public/` and the local `dist/`. It covers 2,240 entries, counting source files and their built copies separately:

- 2,214 historical motion/frame entries under `world/` or `exhibits/`.
- 20 source or generated downloadable assets (CSV, Markdown and SVG).
- Four entries for the two previously reviewed bounded social images and their built copies.
- Two other image entries (favicon and its copy).

No PDF exists in those two trees. This does not establish that no historical PDF exists elsewhere. Files outside those trees and full git history were not inventoried. No historical asset was removed or modified. Paths and hashes do not inspect pixels, video frames, historical text or legal currency. Asset visual/content review remains open.

## Remaining publication gates

Full content alignment remains open for `/privacy/`, `/terms/` and `/customs-intermediary-registration-2026/`. The security, pricing, pricing-policy and pilot routes now have bounded product-copy changes, not approval of the underlying security/legal/commercial commitments. Editorial contract succession is corrected, not a whole-site clearance. Dates on unchanged legal/security source material are not refreshed by this product-copy work. Recheck time-sensitive registration material against current official sources.

- Owner must reconfirm pilot terms (including £500 cap/free-on-failure) and the one-working-day commitment, or approve their replacement. Neither changed here.
- Reconcile the historical site manifest without silently granting commercial/security approval.
- Complete historical/downloadable asset review; no whole-site clearance from this inventory.
- Obtain independent exact-head review of each material change. Draft, built, tested, reviewed, required approval, merged, deployed and live-verified are different states.

Continue the same draft PR21. No merge, deployment or live result is claimed.

## Per-route evidence

`test:offer-boundaries` removes each required scope phrase on each route independently, checks hero placement in rendered markup, rejects reinstated fixed-result claims, and proves preservation. `test:offer-boundaries:browser` checks each of the four rendered pages at 1440/768/390/320 with JavaScript enabled and disabled. It checks visible adjacent limits, safe enquiry, the pricing model link, metadata, no overflow/third-party requests/runtime errors and automated WCAG when JavaScript is enabled. Build verification independently checks each generated offer page. This prevents cross-page phrase pooling from being mistaken for per-page scope coverage.

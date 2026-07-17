# QA record

## Deterministic build

- `npm ci`: pass; 0 known vulnerabilities reported by npm audit.
- `npm run lint`: pass.
- `npm run build`: pass.
- Static verifier: 17 indexable routes; one conversion receipt; one real 404; claims manifest `2.0.0`.
- Aggregate tiers: `50 + 73 + 279 = 402`.
- Coverage ledger: `402 + 309 + 489 + 3 = 1,203`.
- Website discovery: `469 + 80 + 305 = 854`.
- Public CSV: exact deterministic model match and allowed publication header only.
- Structured data: `Report` and `Dataset` present; no `FAQPage` or `HowTo`.
- Downloads: aggregate CSV and accessible SVG found in the built output.
- Indexing: canonical, sitemap, `llms.txt`, and `llms-full.txt` inclusion verified.

## Browser QA

Served the production build through Vite Preview and tested in a real Chromium browser.

| View | Result |
| --- | --- |
| 1440 × 1000 | document width 1,440; client width 1,440; no horizontal overflow |
| 390 × 844 | document width 390; client width 390; no horizontal overflow |
| Semantics | exactly one H1; three accessible tables; zero forms |
| Console | zero messages, warnings, or errors at desktop and mobile widths |
| Visual | Paper World hierarchy, charts, source register, free-workbench routes, and call CTA reviewed |
| Method action | scrolled to `#methodology` with section top at 18px; emitted `operations_report_methodology_viewed` |
| CSV download | downloaded successfully in Chromium; emitted `operations_report_downloaded` with `aggregate_csv` / `csv` |
| Calculator route | resolved to the desk economics tool with its expected H1 |
| Booking route | resolved to `/#book` with `src=research_uk_customs_operations_signal_report_2026_bottom_cta` |

Evidence screenshots were written to untracked `output/playwright/` during QA and are not publication artefacts.

## Regression checks

- Homepage source files: unchanged.
- Existing offer and conversion copy: unchanged.
- Existing product, price, pilot, tool, and booking destinations: retained.
- New internal navigation destination: report route resolves and is included across static routes.
- Acquisition hero: no legal, limitation, or governance strip directly under the hero.
- Newsletter: no form or capture UI.

## Final interaction checklist

- [x] Methodology hero link scrolls to visible method and emits its enum-only event.
- [x] CSV and SVG return successful responses with expected content types.
- [x] Related calculator, pack-check, and registration routes resolve.
- [x] Booking CTA preserves the report source parameter and reaches the homepage booking section.
- [x] First-touch UTM attribution persists for the session and is included in every report event.
- [x] Report events use the configured PostHog capture path when enabled and remain testable in `window.dataLayer` without an account.
- [x] Breadcrumb schema contains two distinct levels: Home and the report.
- [x] Full build re-run after the optical headline correction.

## Source-link check

The two HMRC, BIFA, and FIATA source-register URLs each returned `200` on 17 July 2026.

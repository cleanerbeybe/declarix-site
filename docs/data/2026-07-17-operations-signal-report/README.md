# Phase 7 — UK customs operations signal report

**Publication date:** 17 July 2026

**Research snapshot:** 15 July 2026

**Public route:** `/research/uk-customs-operations-signal-report-2026/`

## Outcome

This phase turns a private public-source research census into an original, linkable, aggregate-only research asset. It publishes evidence about the shape of UK customs operations without publishing a company directory, prospect list, source row, website, contact, or candidate identifier.

The report is designed to earn discovery and links while moving a qualified reader into one of four useful next steps:

1. download the aggregate CSV or press-ready SVG;
2. model customs-desk economics;
3. run the document-pack handoff checker;
4. book a 20-minute numbers call.

## Public deliverables

- premium Paper World report page with direct findings and visible methodology;
- three accessible HTML data tables paired with visual charts;
- deterministic aggregate CSV generated from the report data model;
- accessible 1200 × 630 vector press chart;
- `Report`, `Dataset`, `WebSite`, `Organization`, and `BreadcrumbList` structured data;
- sitemap, `llms.txt`, `llms-full.txt`, and internal navigation inclusion;
- privacy-safe download, related-resource, methodology, share, and booking events.

## Implementation map

- `scripts/reports.mjs` — report data contract, renderer, aggregate CSV, press chart, schema, and events.
- `public/report.css` — report-specific Paper World visual system and responsive behavior.
- `scripts/generate-static-routes.mjs` — route, asset, sitemap, LLM discovery, and nav generation.
- `scripts/verify-build.mjs` — aggregate reconciliation, disclosure, schema, asset, accessibility-support, and script checks.
- `docs/data/2026-07-17-operations-signal-report/` — derivation, disclosure, QA, decision, source, distribution, and follow-on record.

## Non-regression boundaries

- No homepage source file was edited.
- No offer, pricing, pilot, product, or booking copy was replaced.
- Methodology and limitations are kept after the findings, not used as the acquisition hero.
- The report has no email or newsletter form.
- No live customer documents or prospect data are collected.
- Green remains reserved for conversion and positive signal; orange carries research/manifest emphasis.

## Durable source boundary

The raw research package remains in the private/core repository. The website repository contains only the safe aggregate publication model and the documentation of its derivation. Row-level source material must not be copied into this repository or a public download.

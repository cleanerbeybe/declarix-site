# B01-PAGES — P08/P10 draft output contract

## Output and scope

- `/use-cases/customer-document-requests/`: broker-side missing-information request, reply, human confirmation and material replacement.
- `/use-cases/importers/`: how a customer understands and answers the broker’s exact request, with the broker’s responsibilities kept separate.
- A six-step fictional walkthrough uses fixed synthetic facts. It is a public explanation, not the authenticated product screen. It accepts no input or file, sends no message, sets no browser storage and emits no telemetry.
- The same complete explanation is in initial HTML with JavaScript disabled. The enhancement steps through it and moves focus to the selected heading.
- Distinct metadata, self-canonicals, WebPage/BreadcrumbList data, sitemap/discovery links and existing pilot/scope/workflow destinations. Existing shared site rendering is reused; no new tracking or account flow.

## Claim evidence and limits

| Claim | Evidence / boundary |
|---|---|
| Draft → approved → sent → replied → explicitly resolved | Product API PR464, exact reviewed head `1299b0d`; explicit event-derived lifecycle, not an inference from item completion |
| Item-bound returns and document versions | API return regressions, 299 tests at API parent; 302 expanded regressions including the UI’s customer-safe GET |
| Material replacement invalidates old acceptance | API safety fix and independent review; fresh same-item human confirmation required across review/attestation/pack gates |
| Narrow customer request view | Product UI PR465, reviewed head `f7e8cce`; independent static PASS. Hosted validation separate |
| Customer route or invitation available now | NOT claimed. No public product login/link/CTA; access and deployment availability must be agreed before use |
| Email delivery, automatic acceptance, filing or clearance | Explicitly excluded beside the relevant example, not merely in footer text |
| Importer experience or adoption | NOT claimed. No consented importer validation sample was obtained. P10’s original validation/publication check remains outstanding |
| Time savings, rankings, traffic, search volume, revenue | No numerical claim. P08 exact search volume unmeasured; P10 provider-null from the brief stays unknown. No new paid data or exact Google results capture was collected |

Editorial owner: Nadia. No expert credentials, customer interviews or customs advice are invented. The Incoterm change illustrates why evidence needs review; it does not recommend a term for a shipment. Official legal guidance and customer outcome studies are not claimed as evidence for this fictional example.

## Local verification

- Clean locked dependency install.
- 12 new static HTML/lifecycle/claim/script tests; the existing 32 economics tests also pass in the build.
- Full production build and site verifier pass: 40 indexable routes in the local build, one conversion receipt, real 404 artifact.
- Lint: zero errors and warnings.
- 226 Chromium browser assertions pass across both pages at 1440, 390 and 320 pixels, plus no-JavaScript views: step navigation, keyboard skip/focus, first/last boundaries, all-step fallback, FAQ, narrow layout, all internal destinations, no interaction requests, no third-party requests, no storage and no runtime errors. Automated WCAG A/AA checks pass in all six enhanced layouts.
- Full screenshots generated. Inspection found a wrapped mobile wordmark and overlong inherited navigation; corrected with a compact route navigation and no-wrap wordmark, then all affected checks rerun. Automated accessibility checks also caught low contrast in inherited amber strips; these two new routes now use accessible paper/ink and Cleared Green roles.
- Local tests are not production verification, field Core Web Vitals, importer validation, or a live authenticated product-to-database test. JSON-LD is locally parsed, not claimed externally certified.

## Review and release gate

This is a draft. Do not merge merely because the static pages build. Main pushes trigger automatic public deployment. Independent exact-head code/copy review, product availability/claim review and an explicit P10 importer-validation decision remain required. API/UI customer-access release remains owner-gated. Do not claim those product routes live or mark B01 complete from this site PR.

An eligible GitHub approval is a separate gate wherever repository policy requires it. No branch protection bypass, outbound send, customer data, account creation, paid tool, or production change is part of this build.

After authorised release: verify both live routes, canonical and sitemap membership, the example on mobile/no-JS, actual CTA destinations and the deployed revision. Record product release and page release separately. This branch adds no analytics events; search/qualified-use outcomes are not yet measured.

## Reproduce

```sh
npm ci
npm run build
npm run lint
npx playwright install chromium
npm run test:customer-workflows:browser
```

Browser receipts are written to `output/customer-workflows/` (git-ignored). Internal work receipts are in Nadia’s `reports/2026-09-16-build-trial/PAGES_*.log`.

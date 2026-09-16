# P13 / P15 / P27 comparison delivery contract

Draft expansion of PR21, not a publication approval. Nadia is the sole implementation writer.

## Distinct decisions

- P13 `/compare/declarix-vs-icustoms/`: iDP document processing versus UK iCDS filing; keep or replace the broker's current filing system. Ireland features are not transferred into the UK offer.
- P15 `/compare/declarix-vs-flytta/`: former Flytta customs workflow within Sedna AI, email-led intake versus case-based review. Sedna and Flytta are one current option, not two. The replacement-document/email-chain scenario differs from P13.
- P27 `/compare/icustoms-vs-customaite/`: the two named vendors lead the summary and table. Module-by-module versus suite-by-suite evaluation, with jurisdiction, filing owner and quoted plan explicit. Declarix appears only as a limited third path after their evaluation.
- P17 retains P16 alternatives ownership. Its iCustoms option now recognises iDP formats, merging and exports from the newly reviewed source; unknown third-party acceptance remains explicit.

## Evidence method

`contracts/comparisons/vendor-comparisons-2026-09-16.json` is a test-checked snapshot of all route copy, vendor cells and sources. Each cell records product, module, country, official source URL, review date, evidence type, reviewer and status. Runtime checks reject missing cells and unknown sources. Fit guidance is editorial, not hands-on testing. Missing information does not mean a missing feature.

Sources checked on 16 September 2026:

1. iCustoms iDP: https://www.icustoms.ai/intelligent-document-processing/ (HTTP 200, readable text). PDF/CSV/Excel intake, multi-document merging, human checks, CSV/Excel/XML/custom templates. Filing is through separate customs modules. No universal connector acceptance inferred.
2. iCustoms UK iCDS: https://www.icustoms.ai/uk-cds-import/ (HTTP 200, readable text). Vendor states UK import/export and direct HMRC CDS integration. No independent filing acceptance test.
3. Sedna acquisition: https://sedna.com/resources/sedna-expands-ai-leadership-in-global-trade-with-flytta-acquisition (HTTP 200, readable text). Former Flytta workflow is within Sedna AI; no inferred universal UK procedure coverage.
4. Sedna Casper case: https://sedna.com/case-studies/how-casper-customs-transformed-their-operations-with-sedna (HTTP 200, readable text). Vendor names ASM Sequoia and Descartes output, email intake and staff due diligence at Casper. Page also describes an automated path for standardised volume. Those are implementation-specific facts, not universal acceptance or policy guarantees. Numerical customer outcomes were deliberately omitted.
5. Sedna AI: https://sedna.com/build/sedna-ai (HTTP 200, readable text). Communication/data automation scope, not complete customs package coverage.
6. Customaite plans: https://www.customaite.ai/plans (HTTP 200, readable text). Implementation guidance and security/ROI FAQ; full plan/package text remains backed by the earlier raw receipt in the parent work record. Readability extraction alone does not contain the entire plan grid. Existing suite facts retain the same-day P17 primary-source review.

Do not reuse vendor accuracy, savings, compliance guarantees or customer outcomes as our tested results. No new price, current Declarix pilot fee, named Declarix connector, released customer portal or direct HMRC filing claim is introduced. Declarix H1 remains review-only and incomplete.

Exact-query UK volume and difficulty remain unknown. Official-source searches do not establish Google demand. There is no traffic, ranking or revenue claim.

## Tests and delivery

- `npm run test:comparison`: P17 regression plus three-page evidence, route, copy, attribution and negative validation tests.
- `npm run test:comparison:browser`: all four routes at 1440/768/390/320 pixels, local links, anchors, canonical, keyboard evidence disclosure, no-JavaScript path, no third-party requests, automated WCAG checks, screenshots and discovery files.
- `npm run build`: economics unit tests, comparison unit tests, TypeScript, static generation and whole-site verification.
- `npm run lint` and `npm run test:economics:browser` remain required.
- Independent reviewer checks the exact pushed head. Independent PASS is not GitHub approval, publication approval or live verification.

## Publication boundary

These routes enter the proposed static build, sitemap, llms files and related navigation together. PR21 remains draft. Nothing is deployed by building locally. Before publication, reconcile stronger legacy offer/scope/readiness claims with the current claims contract and obtain the scoped publication decision. Do not silently replace commercial terms. B01 customer-return pages remain in PR20, not this branch.

No new form, runtime request, analytics, customer documents or tracking is added. The CTA is an email link to Declarix with an explicit instruction not to attach live customer documents. Nadia owns corrections; the next review is due 16 December 2026, or sooner on vendor changes. This is an editorial due date, not a newly created scheduler job.

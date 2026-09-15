# P34 preparation economics — branch release record

Implemented 15 September 2026. Not deployed.

Route: `/compare/automation-vs-outsourcing/`.

The model compares assisted in-house preparation with outsourced data preparation using explicit user inputs. Includes review, rework, provider fees, monthly software/fixed costs and setup amortisation. Shows monthly/per-case totals, signed cost difference, volume sensitivity, formulas and local CSV export. No prefilled quotes, benchmark rates or savings claims. No document upload, remote calculation, input analytics or browser persistence.

## Files and tests

- `scripts/preparation-economics.mjs`: pure model and static page renderer.
- Existing route generator and verifier include the new route; existing framework and deployment mechanism retained.
- `tests/preparation-economics.test.mjs`: 32 model/HTML tests. They run as part of `npm run build`.
- `tests/preparation-economics.browser.cjs`: 33 checks across desktop 1440px and mobile 390px, plus no-JavaScript explanation. Real browser exercises validation, calculations, focus, CSV download, stale result invalidation, clear, no input transmission/persistence and working workflow links.

Reproduce:

```sh
npm ci
npm run build
npm run lint
npx playwright install chromium
npm run test:economics:browser
```

Browser setup is a local test dependency, not a production service. Screenshots/receipts go to ignored `output/economics/`.

Actual local result: clean dependency install; 32/32 model tests; full build with 38 generated indexable routes (default EORI configuration); lint clean; 33/33 browser checks. Desktop and mobile screenshots inspected. No live site, rankings, conversion or revenue test was performed.

Release review: verify the responsibility wording and input model. Normal merge to main triggers the existing site deployment; do not merge without the existing deployment approval. This branch adds no workflow, account, environment variable or deployment configuration change.

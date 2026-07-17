# QA record

## Required automated gates

- `npm ci`
- `npm run lint`
- `npm run build`
- Static verifier confirms one H1, unique title/canonical, valid description, route discovery,
  sitemap and LLM entries, WebApplication and visible FAQ schema, formula/boundary phrases, required
  outputs, no text/email/file/free-text input, and parseable inline JavaScript.

## Required interaction checks

- Starting example calculates to 5,760 annual entries, 4,320 current hours, 1,920 target hours,
  2,400 recoverable hours, £72,000 labour headroom, 7,200 theoretical additional entries, and £12.50
  labour-only break-even per entry.
- Changing an input recalculates the model.
- A target greater than or equal to current minutes produces zero headroom, not a negative saving.
- Invalid numeric input is rejected through native form validation.
- A shared query string restores all five valid inputs and ignores values outside allowed ranges.
- Share, print, and booking controls emit documented events without raw model inputs.
- Keyboard submission, focus visibility, FAQ disclosure, and live status messaging work.
- Mobile layout has no horizontal overflow.
- Print layout includes inputs and results and removes navigation/actions.

## Regression boundary

No existing React source, homepage copy, homepage style, offer example, pricing route content, or
booking component is changed by this release.

## Executed on 2026-07-17

- Clean dependency install: passed, 0 vulnerabilities.
- Oxlint: passed.
- TypeScript and Vite production build: passed.
- Deterministic site verifier: passed with 16 indexable routes.
- Default formula: matched all expected figures in this record.
- Zero-headroom case (`target=60`, `current=45`): returned £0 headroom, £0.00 break-even, and zero
  recovered capacity with an explanatory result.
- Shared-state case (`d=200&m=30&c=24&t=10&w=50`): restored all inputs and returned 10,000 entries,
  3,333 recoverable hours, £80,000 labour headroom, and £8.00 break-even.
- Keyboard Enter submitted the model.
- `window.dataLayer` inspection confirmed aggregate bands only and no raw input/output properties.
- Share-link control copied the explicit-input URL and emitted `tool_result_copied`.
- Chromium 390 × 844: document and body scroll widths both equalled 390; no horizontal overflow.
- Chromium 1440 × 1000: one H1; Organization, WebApplication, FAQPage, and BreadcrumbList schema;
  no `transition: all`; no console errors or warnings.
- Desktop hero, desktop result, full mobile, and two-page print renders were visually inspected. The
  first print pass exposed low contrast when print backgrounds were suppressed; print-only CSS was
  corrected and the second render passed with dark text on white, complete inputs, and complete
  results.

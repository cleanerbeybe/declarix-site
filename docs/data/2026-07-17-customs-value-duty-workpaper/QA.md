# QA record

Result: passed on 2026-07-17 against a production preview at
`http://127.0.0.1:4192/tools/customs-value-import-duty-vat-calculator/`.

## Required gates

- `npm run lint`
- `npm run build`, including deterministic formula and publication guards
- exactly one H1, canonical, description, indexable route, sitemap entry, and llms entries
- schema graph contains `Organization`, `WebApplication`, and `BreadcrumbList` only
- no `FAQPage`, `HowTo`, guessed rate, default rate, tariff lookup, email gate, or free-text input
- desktop and 390px browser interaction, overflow, focus, console, and screenshot checks
- exact deterministic fixture outputs and negative-customs-value validation
- HMRC-native exchange-rate direction with the published July 2026 EUR example
- ad valorem-only scope visible in the hero, result, questions, and build contract
- upper-bound penny preservation and rejection above the supported planning range
- initial hidden result, valid submission, explicit share restoration, and print output
- `window.dataLayer` contains coarse properties only and no raw financial inputs or outputs
- homepage source/copy/style files unchanged from branch base

## Automated result

- `npm run lint` — passed.
- `npm run build` — passed.
- Build verifier — passed: 18 indexable routes, deterministic formula and precision-boundary fixtures, publication contract,
  internal links, sitemap, llms files, schema, inline-script syntax, and route uniqueness.
- Metadata — title 64 characters; description 149 characters; one H1; ten numerical inputs.
- Schema — `Organization`, `WebApplication`, and `BreadcrumbList`; no `FAQPage` or `HowTo`.
- Homepage regression — no diff from branch base in `src/App.tsx`, `src/index.css`, `index.html`,
  `src/data.ts`, or `src/world.tsx`.

## Browser result

- Initial result hidden; all ten fields exposed without defaults.
- Deterministic browser result with `1.25` invoice-currency units per £1: converted goods £8,000; net adjustments £200; customs value £8,800;
  duty £440; import VAT value £9,500; import VAT £1,900; duties and taxes £2,400; planning total £11,400.
- HMRC July 2026 direction check: 10,000 EUR ÷ 1.1564 currency units per £1 = £8,647.53.
- Enter-key submission passed.
- Negative customs-value build-up hid the result and produced a field-specific validation message
  naming converted goods, freight, insurance, and additions.
- Specific and compound duty exclusion is visible beside the result and in the sixth workpaper question.
- Maximum supported conversion plus a £0.01 addition retains the penny; inputs above 100,000,000 are rejected.
- Complete explicit share query restored all ten inputs and the exact result.
- Clipboard fallback emitted `tool_result_shared`; event payload contained only attribution, the
  coarse value band, boolean flags, tool ID, page path, and share method.
- Desktop and 390 × 844 viewport checks showed zero horizontal overflow.
- Report ↔ workpaper cross-links render as a balanced 2 × 2 grid on desktop and a single column on
  mobile, with all four destinations resolving inside the 18-route publication set.
- Browser console: zero errors and zero warnings.
- Visual result ledger and mobile input sequence inspected from Playwright screenshots.
- Print CSS produced a clean two-page Letter workpaper after the corrections: page one shows the
  HMRC-direction input and all ten values; page two shows the ad valorem-scoped results and every
  formula. No split fields or number-input spinners appeared in print.

## Adversarial correction record

The final cross-review blocked release until four defects were fixed: reciprocal HMRC exchange-rate
entry, general-duty overclaiming, unsafe extreme-number bounds, and incomplete deductions-validation
copy. Each now has a visible product fix, deterministic build guard, durable decision record, and
browser verification above.

Artifacts were generated under ignored `output/playwright/value-duty/`; they are QA evidence, not
committed website assets.

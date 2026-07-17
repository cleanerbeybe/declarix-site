# QA record

Date: 17 July 2026

## Automated gates

| Check | Result |
|---|---|
| `npm ci` | Pass; 112 packages installed, 0 vulnerabilities reported |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| Publication verifier | Pass; 15 indexable routes, one conversion receipt, one 404, claims manifest 2.0.0 |
| Unique title, H1, canonical, description, sitemap and internal-link gates | Pass |
| WebApplication and Article JSON-LD gates | Pass |
| Download files present in the built artifact | Pass |
| Acquisition hero legal/governance regression assertion | Pass |
| `git diff --check` | Pass |

## Browser QA

Local production preview: `http://127.0.0.1:4181/`

Checked at 1440×1000 and 390×844:

- pack-checker hero, 24 controls, keyboard-addressable semantic checkboxes, mapped styling, P1–P3 order, 3/24 sample result, result CTA, and responsive stacking;
- registration-kit hero, value strip, source-backed sections, both download controls, three-step workflow, source register, CTA, and responsive stacking;
- Markdown download completed in a real browser;
- `registration_kit_downloaded` appeared in `window.dataLayer` with only route, asset ID, and format;
- checker completion and copy produced aggregate-only `tool_completed` and `tool_result_copied` events;
- the non-native share fallback copied the canonical link and emitted `tool_result_shared` with `method: clipboard`;
- print/save generated a readable four-page PDF with the checklist and prioritised result, while navigation and conversion controls were omitted;
- browser console showed 0 errors and 0 warnings on both tested routes.

Ephemeral visual evidence generated during the branch QA:

- `output/playwright/pack-result-desktop.png`
- `output/playwright/pack-result-mobile.png`
- `output/playwright/registration-kit-desktop.png`
- `output/playwright/registration-kit-mobile.png`

These screenshots are QA evidence, not production assets, and are intentionally excluded from the commit.

## Regression checks

- No source file for the homepage (`index.html`, `src/App.tsx`, `src/data.ts`, `src/world.tsx`, or homepage CSS) was changed.
- Existing booking destinations remain `/?src=…#book` and continue into the established Zoho flow.
- Paper World token roles and route layout remain intact.
- Privacy, security, terms, and editorial-policy pages retain their detailed hero-adjacent boundary strip.
- Acquisition and commercial pages no longer render the generic `LIMITATION` strip under the hero.

## Final live QA required after merge

Root QA should verify the deployed commit on both target routes, exercise one checker result, download both kit files, confirm the dataLayer events, and re-check homepage conversion copy against the pre-merge baseline.

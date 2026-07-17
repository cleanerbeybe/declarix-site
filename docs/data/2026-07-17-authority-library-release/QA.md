# QA record

Date: 2026-07-17

## Automated gates

- `npm ci`: pass, zero reported vulnerabilities.
- `npm run lint`: pass.
- `npm run build`: pass.
- Publication verifier: 31 indexable routes, one noindex booking receipt, one real noindex 404.
- New-route contract: unique title/H1/canonical, 80–180 character description, at least 220 rendered
  words, source register, non-orphaned internal links, sitemap and `llms*.txt` membership.
- Structured data: CollectionPage for the chooser, Article for term/workflow pages, Report + Dataset for
  the HMRC explorer, and non-duplicated BreadcrumbList on all 13 routes.
- No FAQPage or HowTo schema, external route script, email/free-text/document form, or unresolved token.
- Generated downloads are byte-compared against their deterministic model during the build.

## Browser and visual QA

Playwright was run against the production build at 1440×1000 and 390×844 for:

- Incoterms hub initial state and completed CIF chooser result;
- DDP term page and value-workpaper bridge;
- HMRC explorer hero, metric stack, table region, and downloads;
- GMR/GVMS workflow hero and six-workflow internal-link cluster.

Results:

- zero console errors or warnings;
- mobile document width 390px at a 390px viewport;
- all visible controls have usable labels and touch targets;
- long ledger stamps no longer clip;
- native 1200×630 DDP map, GMR/GVMS diagram, and HMRC chart visually inspected;
- Incoterms map text wrapping corrected before release;
- no unresolved P0, P1, or P2 visual issue.

Live-origin QA remains a deployment gate and must repeat the desktop/mobile smoke after merge.

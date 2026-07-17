# SEO wave live acceptance — 17 July 2026

## Release under test

- Site repository: `cleanerbeybe/declarix-site`
- Production commit: `64b65492dd7fc7d9e35f7c9eeeedf0d3e89a8181`
- Site deploy run: `29608699143` — passed
- GitHub Pages publish run: `29608731731` — passed
- Public EORI service: `declarix-public-eori` in `europe-west2`
- EORI revision: `declarix-public-eori-00002-8qz`
- EORI image digest: `sha256:328f811413580e625e6dbeb1fb866b64c0804e7bde69da0b033669024bb93449`

This acceptance covers roadmap work 2–6. Webmaster-account closure and search-console submission remain deliberately deferred as roadmap item 1.

## Automated release evidence

| Check | Result |
| --- | --- |
| Integrated production build with public EORI enabled | Passed: 38 indexable routes |
| Production sitemap crawl | 38 URLs, 38 unique, all HTTP 200 |
| Per-route title, one H1, self-canonical and parseable JSON-LD | Passed on all 38 sitemap URLs |
| Public downloads referenced across the site | 19 unique, all HTTP 200 and non-empty |
| Booking links found across sitemap routes | 77; all route-specific links retain `src` and `#book`, plus two intended direct homepage anchors |
| Radar hub production records | 5 visible records; `India` search narrowed the live set to 1 and preserved `?q=India` |
| Authority-library build contract | 13 routes and 13 new downloadable authority assets passed the repository verifier |
| Normal browser console | 0 errors and 0 warnings on the tested production pages |
| Page-level horizontal overflow | None at 1440×1000 or 390×844 on the tested production pages |

## Live browser acceptance

The live site was inspected with a real browser at desktop `1440×1000` and mobile `390×844` on:

- `/tools/eori-checker/`
- `/research/cds-operations-radar/`
- `/customs-reference/incoterms/`
- `/customs-reference/incoterms/ddp/`
- `/research/hmrc-customs-administrative-burden-explorer-2026/`
- `/customs-workflows/gmr-gvms-checklist/`

The workpaper visual system, navigation, ungated utility, primary-source registers, downloadable assets and green numbers-call CTAs remained coherent at both viewports. The Incoterms chooser completed a four-question path and returned DDP with a working term-sheet link. Radar search, current-observation labels and JSON/CSV downloads were present. DDP exposed its operational SVG and both conversion links. The HMRC burden page retained the source-faithful `460`, `19–28`, `£5–£7`, `≈70%` and `At most 1 in 5` findings. The GMR/GVMS page retained its five-check handoff, connected-workflow links, SVG and both conversion links.

## EORI end-to-end acceptance

Production browser checks covered registry-valid, registry-not-confirmed, unsupported prefix and malformed GB-format outcomes without placing the submitted value in the page URL. A browser-intercepted 429 returned the public-limit retry message, and a browser-intercepted 503 returned the provider-unavailable retry message. The HTTP error console entries produced during those two mocks are expected browser resource messages; normal live states had zero console errors or warnings.

The isolated Cloud Run service also passed its release boundary checks: immutable image, maximum instance cap, dedicated no-project-role service account, unauthenticated public endpoint, exact production-origin CORS, disallowed-origin rejection, `no-store`, valid response, invalid response and format-invalid response. An eight-request burst returned three successes and five quota responses. A Cloud Logging search found no submitted EORI fixtures or returned company-detail fields.

## Conversion and copy guardrail

Marketing and conversion copy remains the priority on commercial and acquisition pages. Legal, policy and evidence language may bound a claim or document a source, but must not replace the offer, practical value, sales momentum or booking path. Future SEO work must fail review if it removes a working CTA, weakens the existing promise without evidence, turns marketing copy into governance prose, adds an unowned newsletter form, or degrades the established visual system.

## Deliberately not changed

- Google Search Console, Bing Webmaster Tools and account-side analytics closure remain item 1 and were not performed.
- No newsletter form was added because no confirmed live list destination or consent workflow was in scope. Dead capture forms are not acceptable.
- No real provider outage was induced. Provider-unavailable behavior was tested by browser interception.

## Release decision

Accepted on production. Roadmap work 2–6 is built, merged, deployed and live-tested. The remaining operational follow-up is item 1 plus ongoing publication and refresh work, not a missing core build component in this wave.

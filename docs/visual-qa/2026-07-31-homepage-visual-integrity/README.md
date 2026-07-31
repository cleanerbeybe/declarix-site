# Homepage visual integrity QA

**Date:** 2026-07-31

**Base:** `main` at `4ff6751c610130b8b0b44670fecdffbc45448d9c`

**Branch:** `codex/homepage-visual-integrity`

## Reference lock

The current production homepage is the build target. Preserve its warm paper canvas, editorial typography, physical-document metaphor, black/orange/green role discipline, deliberate asymmetry, hero composition, and conversion copy. This change repairs responsive containment and animation geometry only.

## Decision ledger

| Decision | Source | Rule | Reason |
| --- | --- | --- | --- |
| Keep the three-part declaration footer | Existing production design | Preserve the document/signature metaphor | The concept is strong; its grid implementation was the failure. |
| Use bounded responsive footer columns | Live 1280px and 390px measurements | Every grid child must be allowed to shrink inside its track | The former non-wrapping navigation forced a 0px metadata column on desktop and ~930px children on mobile. |
| Measure extraction endpoints from real elements | Live extraction geometry | Connectors belong to responsive source and target elements, not a fixed SVG viewport | Hard-coded 42px/38px increments drifted progressively as rows wrapped and transformed. |
| Track geometry only while the stage is visible | Motion/performance craft rule | Keep animation work scoped to the active scene | This follows GSAP transforms without creating a permanent page-wide animation loop. |
| Keep a poster below each scrub canvas | Existing Paper World media role | The film may enhance a real still; it must not replace the fallback | A fast CTA or deep link can never expose an empty canvas. |
| Suppress intermediate scene wipes during CTA rides | Existing conversion journey | A deliberate CTA owns its destination | The visitor moves to the requested section without walking through several blank paper transitions. |

## Before and after

| Before | After |
| --- | --- |
| Footer metadata collapsed to `0px` at 1280px. | Metadata occupies a readable 289.5px column. |
| Fourteen footer links competed in one non-wrapping row. | Desktop links use a deliberate three-column grid; mobile uses two columns. |
| Mobile footer children measured approximately 930px inside a 370px shell and were clipped. | Every mobile footer child measures 322px inside the 370px shell; all links and the signature remain visible. |
| Connector-to-row error progressed from approximately `+31px` to `-19px`. | All eight endpoints remain within `0.05px` of their row centres at 1024, 1280, and 1440px, including during GSAP transforms. |
| The extraction caption began beneath the sticky header. | Caption keeps a measured 14.2–14.7px clear gap and uses restrained paper-backed lines for legibility over the document stack. |
| Tethers remained while the entry grid scaled into the handover. | Tethers and flight labels leave before the handover transform. |
| Scrub scenes could briefly present an unpainted canvas. | Each canvas upgrades over an eager, low-priority poster and fades in only after a frame is painted. |
| User CTA rides could trigger intermediate Paper World wipes and cold-load re-alignment. | User-initiated rides are shorter, suppress intermediate wipes, and are not fought by cold-load recovery timers. |

## Geometry and responsive acceptance

| Viewport | Connector error | Caption/header gap | Horizontal overflow | Result |
| --- | ---: | ---: | ---: | --- |
| 1024×768 | max `0.05px` | `14.23px` | none | Pass |
| 1280×720 | max `0.05px` | `14.73px` | none | Pass |
| 1440×900 | max `0.05px` | `14.66px` | none | Pass |
| 390×844 | desktop tethers intentionally hidden | static mobile narrative | none | Pass |

Desktop footer: 1244px shell, 1244px scroll width.

Mobile footer: 370px shell, 370px scroll width, three 322px children.

An adversarial fast-click check delayed the Paper World manifest by four seconds, clicked the hero CTA immediately, and sampled the transition every 100ms. Result: `0` blank-stage samples, all five posters loaded, and the BOX 2 title remained visible after the late pin refresh.

## Evidence

- [Desktop extraction — 1280×720](evidence/desktop-extraction-1280x720.png)
- [Desktop footer — 1280×720](evidence/desktop-footer-1280x720.png)
- [Mobile footer — 390×844](evidence/mobile-footer-390x844.png)

Local scroll recordings were also captured for the desktop CTA/extraction journey and the complete mobile page/footer journey. They are kept out of the website bundle and Git history.

## Verification

```text
npm run build
npm run lint
git diff --check
```

The production build verifies 37 indexable routes, one conversion receipt, one real 404, and the approved offer manifest. No marketing or conversion copy changed.

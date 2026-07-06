# DECLARIX — THE PAPER WORLD BUILD PLAN (complete handoff)
**Ref: DCLRX-WEB-4.0-BUILD · 6 July 2026 · This document is self-contained: a fresh agent session on any machine, given only this repo, must be able to build the whole thing from here. Read this first, then docs 01–11 in `docs/spec/` for depth. The owner refers to this effort as "website v3"; in-repo versioning: the shipped baseline is ISSUE 3.0, this build lands as ISSUE 4.0.**

---

## 0 · ORIENTATION (what this repo is)

- **Product:** Declarix — turns messy customs paperwork into entry-ready packs for Sequoia / Descartes e-Customs. UK customs brokers & freight forwarders. Zero-retention story. Pilot: free if it fails, capped £500.
- **This repo:** the marketing site. Vite + React + TypeScript + Tailwind (utility layer only; almost everything is hand CSS in `src/index.css`) + GSAP (ScrollTrigger, Flip, TextPlugin, SplitText) + Lenis. Single `App.tsx` (~1500 lines), `index.css` (~3300 lines), `data.ts`, `config.ts`. No component framework, no router — path checks in `App()` for `/privacy`, `/security`.
- **Live:** getdeclarix.com · deploy = push/merge to `main` → `.github/workflows/deploy.yml` builds and publishes gh-pages. CNAME in `public/`.
- **Design concept:** the whole site is ONE customs declaration form being completed as you scroll (Form DCLRX-H1). Paper-form furniture everywhere: header strip with FORM REF / ISSUE cells, BOX N sections, mono dockets with dot-leaders, ring stamps, a signature that draws itself in the footer.
- **Branch state:** `v3/100k-feel` contains the full v2.5 + v3.0 build (8 commits, see §2). NOT merged to main yet. Work on top of this branch.

## 1 · THE LOCKED DESIGN SYSTEM (non-negotiable, docs 01/02/09/10)

| Token | Value | Role |
|---|---|---|
| `--ink` | `#16313D` | text, borders, dark panels, film shadows |
| `--paper` | `#F7F6F1` | page, film highlights |
| `--field` | `#FFFFFF` | card/form interiors |
| `--cleared` | `#1B7A4B` | THE only accent: CTAs, stamps, key figures |
| `--muted` | `#5C6E76` | labels/captions |
| `--manifest` | `#C77B27` | rare alert orange, ONE component at a time |

Rules: zero border-radius (except stamps 4px) · zero gradients · zero drop-shadows (except mobile CTA bar) · Archivo (400/500/700/900) + IBM Plex Mono (400/500/600), self-hosted in `public/fonts` with `font-display: optional` · two easings only: `--ease-out`, `--ease-inout` · durations from {120, 300, 450, 600}ms · scrub smoothing 0.55 · Lenis lerp 0.08 · anchor rides 900ms · tabular figures everywhere · true `×` U+00D7 · banned words: AI-powered, revolutionary, seamless*, cutting-edge, leverage, empower, unlock, supercharge, game-changing, innovative, disrupt, platform*, and the bare word "AI" ("the models" is the ceiling) — *except "ICC SEAMLESS TRADE FINALIST" (award name) and "We're comparing capture platforms." (customer voice, locked).
Photography/film: ONLY inside the duotone system — grade recipe: desaturate → shadows `#16313D`, highlights `#F7F6F1` → +2% grain → no other colour survives. Green appears in imagery only as the single accent object.
Fixed rest-angle set for any rotated paper: {−2.5°, −1°, 0°, +1.5°, +3°}. Stamps exempt.

## 2 · WHAT IS ALREADY BUILT (branch `v3/100k-feel`)

Commits, in order: `b6dc157` spec docs 01–10 → `af64782` v2.5 trust/calm (provenance strip w/ {{}} tokens, integration wall, /security page, testimonial sockets dark, air budget, ink hierarchy, orthogonal tethers, sequential flights, marquee −20%) → `5e5bde1` v3.0 film hero (duotone terminal poster behind 65% ink scrim, paper-on-ink foreground, 2px paper seam, `CONFIG.heroLoopUrl` video slot wired w/ 0.75× playback, Ken Burns fallback, per-viewport LCP preloads, skeleton matched) → `ca90d6c` fluidity (load choreography 900ms, hover states on 100% interactives, ticking clock) → `e2b7a76` £100k checklist (fonts, tabular nums, print stylesheet, og.jpg from hero, ISSUE 3.0) → `b2f65d5` QA fixes → `c1ac6cf` doc 11 (concepts + prompts) → this doc.
Build stats: JS 126.6KB gz (ceiling 155KB), CSS 10.3KB gz. Perf targets: LCP <1.8s mobile, CLS <0.02, Lighthouse mobile ≥92, 60fps iPhone 12.

**Still open from v3.0 (find-replace before ANY deploy):**
- `{{NUMBER}}` company number (provenance strip + config)
- `{{YEAR}}` ICC finalist year (config `iccFinalistYear`)
- `{{SUBPROCESSOR LIST}}` + `{{UK / EU}}` on /security (config)
- Zoho admin task (not code): rename booking service "Product Demo" → "The 20-minute numbers call"
- `CONFIG.founderPortrait` (real duotone portrait), `CONFIG.testimonials` (first pilot quote) — ship dark until real
- OG verify in LinkedIn Post Inspector after deploy

## 3 · THE MISSION: THE PAPER WORLD (direction locked by owner, 6 Jul 2026)

Reference: viral Emons scroll-site (doc 11 Part A teardown). Its mechanics — one continuous miniature world, fixed narration card + moving world, scroll-scrubbed camera, one brand colour as wayfinding — translated into our language: **the world is built of paper.** Carton containers with ink stencils, folded-card gantry cranes, ink-wash sea, stacked-sheet hills, fold-line roads. Duotone ink/paper; exactly ONE deep-green object per scene. The journey narrates the product: paperwork moving through world trade, closed by the stamp.

**Five scenes (gen prompts in doc 11 §C2, style lock §C0):**
1. **THE INBOX** — documents drift onto a desk-plane, settle into the mess (one green-edged doc lands last)
2. **THE SCAN** — a green light bar sweeps; loose sheets align into ledger rows
3. **THE PORT** — paper ship, folded-card crane lifts the one green container
4. **THE ROAD** — paper lorry with green container crosses fold-line switchbacks
5. **THE STAMP** — giant ring-stamp presses PACK COMPLETE; held end frame

**Narration card copy (locked draft — refine rhythm, keep register; no banned words, no em-dash additions beyond existing style):**
- S1: `EVERY TRADE BECOMES PAPERWORK.` / body: "It lands like this — six attachments, three formats, nobody's favourite job."
- S2: `DECLARIX READS ALL OF IT.` / "Every format, every page, every line. Nothing keyed by hand."
- S3: `WHILE YOUR GOODS CROSS THE WORLD…` / "…the entry is already being built, evidence pinned to every field."
- S4: `…THE PACK IS ALREADY HOME.` / "Entry-ready for Sequoia or Descartes before the ship clears the strait."
- S5: `YOUR CLERK CHECKS. YOUR NAME SIGNS.` / price cue + both CTAs (reuse existing Button components + tracking events `cta_pack_mailto` / `cta_book_click`).

## 4 · PAGE INTEGRATION (where the world lives)

The world is the OPENING ACT, not a replacement for the product demo:
```
[Film hero — existing, unchanged: H1 paper-on-ink over terminal film/poster]
[2px paper seam — existing]
[THE PAPER WORLD — new pinned scroll journey, 5 scenes, ISSUE 4.0]
[BOX 2 assembly scene — existing interactive worked example (different register: the real form; keep)]
[rest of the form unchanged: numbers, files, system, security, FAQ, provenance, pilot, book, footer]
```
- The narration card reuses the header-cell/form-card grammar (mono labels, 1.5px ink borders, field bg), pinned LEFT on desktop like the existing assembly captions; card contents type in per scene (TextPlugin, 24 chars/s, existing rule).
- The world section carries its own `BOX 1A · THE JOURNEY` form tag so the form-metaphor survives.
- Duplication check: the world tells the MACRO story (trade-level), Box 2 tells the MICRO story (one job, field-level). Keep both; if the page feels long in QA, the candidate cut is the mid-page exhibit moments, never Box 2.
- Guardrail supersessions (explicitly approved for 4.0): v2.4-D "no new pins" lifted for this section only; "two photographic moments below the fold" ceiling excludes the world (it is THE moment). Everything else stands.

## 5 · ASSET PIPELINE (fresh machine, step by step)

1. **Generate** (Higgsfield / Veo 3 / Runway Gen-4 / Kling): first the five master STILLS (image model, doc 11 §C0 style lock + §C2 scene prompts), approve as a SET (same light direction, paper stock, green discipline) — then image-to-video each still, 6–8s, lowest motion strength. Also: the hero loop (doc 11 §C1-A) and 4:5 variants of scenes 1 & 5 for mobile.
2. **Grade everything** (normalises gen drift):
```bash
GRADE="format=gray,curves=all='0/0.05 0.5/0.48 1/0.88',format=rgb24,\
lutrgb=r='22+val*225/255':g='49+val*197/255':b='61+val*180/255',noise=alls=2:allf=t"
ffmpeg -i in.mp4 -vf "$GRADE" graded.mp4
```
3. **Hero loop encode** (goes live on v3.0 immediately, independent of the world):
```bash
ffmpeg -i graded.mp4 -an -c:v libx265 -crf 28 -tag:v hvc1 public/exhibits/hero-loop.mp4   # ≤2.5MB
ffmpeg -i graded.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 40 public/exhibits/hero-loop.webm
# then set CONFIG.heroLoopUrl = '/exhibits/hero-loop.mp4' (component handles poster/mobile/reduced-motion)
```
4. **Scrub frames per scene:**
```bash
mkdir -p public/world/scene-1
ffmpeg -i scene1-graded.mp4 -vf "fps=12,scale=1600:-2" -q:v 11 public/world/scene-1/f_%03d.jpg
# target 64–96 frames/scene, ~35–60KB each; mobile 4:5 sets at 1080px into scene-N-tall/
# poster still per scene: the best frame, copied to public/world/scene-N/poster.jpg
```
5. **Interim fallback if gen isn't available yet:** the world section must render fully from the poster stills alone (see §6 fallbacks) — build against stills first, drop frame sequences in later. Stills can even be produced from sourced photos duotone-graded (that's how the current hero poster was made — Unsplash source + the grade).

## 6 · SCRUB ENGINE (implementation spec)

New file `src/world.tsx` (+ styles in `index.css`, same file conventions):
- **Component `PaperWorld`**: five `<section class="world-scene">` blocks inside one `world-journey` wrapper. Desktop (≥981px, no reduced-motion, no Save-Data): each scene = pinned stage (`ScrollTrigger pin, scrub: 0.55, end: '+=160%'` per scene) driving a full-bleed `<canvas>`; frames drawn via `createImageBitmap` cache + `gsap.utils.mapRange(progress → frameIndex)`; draw with cover-fit math (reuse object-fit cover logic).
- **Preloading:** scene 1 frames fetch after the hero settles (`requestIdleCallback`); scene N+1 begins fetching when scene N pins. Never block LCP (poster hero remains the LCP element). Frame fetches are plain `<img>`/fetch to stay off the JS budget.
- **Narration card:** one persistent card element, `position: sticky` within the journey wrapper (not re-created per scene); per-scene copy swap with TextPlugin on scene enter; card uses existing `.header-cell`-style furniture; CTAs only on S5.
- **Seams (v2.4 continuity rules apply):** the card is the continuity object; scene transitions are hard paper-rule wipes (`clip-path inset`, 450ms grammar) — no crossfades ("nothing new fades in from nowhere if it could arrive from somewhere").
- **Fallbacks:** reduced-motion OR mobile OR Save-Data → no canvas, no pins: five static `exhibit-frame` figures (poster.jpg, ruled frame + mono caption = the narration line), standard `.reveal` entrances. This is also the no-frames-yet development state.
- **Budgets:** engine ≤8KB gz JS (ceiling 155 total; currently 126.6). 60fps scrub on iPhone 12 or the desktop threshold rises to ≥1280px. CLS 0 (canvas containers have fixed aspect).
- **A11y:** journey wrapped in `aria-label`, scenes `aria-hidden` canvases with the card text as the accessible narrative; keyboard users get the fallback stills path if pins trap scrolling (test tab order!).

## 7 · WORKING CONVENTIONS (how this repo is worked on)

- Node 24 / npm. `npm ci` → `npm run dev` (Vite, port 5173) → `npm run build` (tsc + vite; prints gz sizes — check the 155KB ceiling) → `npm run lint` (oxlint).
- Commit per pass with spec-referenced messages (see git log for the voice). Bump the ISSUE cell (`App.tsx` header `3.0 · JUL 2026`, footer, and `index.html` pre-render skeleton) to `4.0` in the FINAL commit of this build.
- The pre-render skeleton in `index.html` must be kept in sync with any hero/above-fold change (copy AND colors) — no-flash rule.
- Update `public/sitemap.xml` if routes change; print stylesheet lives at the bottom of `index.css` — any new section needs a print rule (world prints as the five captioned stills).
- QA workflow that worked: dev server + Chrome (screenshot-driven scroll sweeps, hover/anchor checks, console reads) · print check via `chrome --headless --print-to-pdf` · mobile via `chrome --headless=new --screenshot --window-size=500,950` (**gotcha: Chrome min window width is 500 on macOS — a "390" window silently renders at 500 and crops; don't chase phantom overflow**) · contrast zooms on the hero text regions.
- Acceptance: the v3.0 12-point checklist (doc 10 §4) + world additions: five scenes read as ONE place; 60fps scrub; grade test (no colour outside the triad survives); side-by-side vs the Emons recording AND edentri.com/cargowise.com — Declarix must read more considered, more grounded, calmer, sharper.

## 8 · DEPLOY

Merge `v3/100k-feel` (with this build) → `main` → GitHub Action `deploy.yml` builds and publishes gh-pages → getdeclarix.com. Pre-merge gate: ALL `{{}}` tokens resolved (grep `{{` in src/ and rendered output must return zero), Zoho service renamed, `npm run build` green, banned-word grep zero. Post-deploy: LinkedIn Post Inspector on og.jpg, re-record 30s desktop + mobile walkthroughs, side-by-side test per §7.

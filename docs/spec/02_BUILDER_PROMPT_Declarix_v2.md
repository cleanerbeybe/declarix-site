# BUILDER PROMPT — DECLARIX MARKETING SITE v2 (DCLRX-WEB-2)
**Paste everything below this line into Lovable or Claude Code. It is a complete, locked specification.**

---

You are building the production marketing site for **Declarix** — a UK service that turns messy customer paperwork (any file, straight off a forwarded email) into an entry-ready, CDS-compliant pack for customs brokers, who then check it and submit through the software they already run (Sequoia, Descartes e-Customs). Nothing is stored after processing.

You are building **one page** that must feel like a design team was given unlimited time: obsessive typography, scroll-driven storytelling, zero jank. The audience is sceptical UK customs-broker MDs and heads of customs, aged 40–60, on phones. The aesthetic is NOT "AI startup" — it is a beautifully set **customs declaration form** brought to life. Every visual and every animation must be *diegetic to paperwork*: things stack, scan, lift, tether, flag, seat, stamp, and shred. Nothing floats, glows, gradients, or parallaxes decoratively.

Anything marked **LOCKED** must be followed exactly, including copy (verbatim, character for character). Items marked **FLEX** allow judgment within the stated bounds. Where you see `{{PLACEHOLDER}}`, keep the token in code behind a single config object (`src/config.ts`) so values can be swapped without hunting.

---

## 0. STACK & DELIVERY — LOCKED

- **Vite + React 18 + TypeScript**, Tailwind CSS (arbitrary values allowed; design tokens live as CSS custom properties on `:root`, Tailwind consumes them).
- **GSAP 3.13+** with **ScrollTrigger**, **Flip**, **TextPlugin**, **SplitText** (all free tier). **Lenis** for smooth scroll.
- Fonts self-hosted via `@fontsource/archivo` (weights 400, 500, 700, 900) and `@fontsource/ibm-plex-mono` (400, 500, 600), latin subset only. **No Google Fonts runtime requests. No third-party requests at all except Cal.com and PostHog.**
- Icons: none from libraries. The only iconography is typographic (mono glyphs: `→ ✓ ⚠ ×`) and two inline SVGs specified in §8.
- Static export deployable to **GitHub Pages**. Include:
  - `vite.config.ts` with `base: '/'` (custom domain assumed; comment showing `'/REPO_NAME/'` alternative).
  - `public/CNAME` containing `{{DOMAIN}}`.
  - `public/404.html` that is a copy of `index.html` (SPA safety; the page is single-route anyway).
  - `.github/workflows/deploy.yml`:
    ```yaml
    name: Deploy to GitHub Pages
    on: { push: { branches: [main] } }
    permissions: { contents: read, pages: write, id-token: write }
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with: { node-version: 20, cache: npm }
          - run: npm ci
          - run: npm run build
          - uses: actions/upload-pages-artifact@v3
            with: { path: dist }
      deploy:
        needs: build
        runs-on: ubuntu-latest
        environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
        steps:
          - id: deployment
            uses: actions/deploy-pages@v4
    ```
- **If you are Lovable:** build identically; the user will connect GitHub and add the workflow file. Do not substitute Framer Motion for GSAP — the choreography below requires ScrollTrigger scrubbing and Flip.

### Performance budget — LOCKED (fail = rework)
- LCP < 1.8 s on simulated Fast-3G/mid-tier mobile; CLS < 0.02; total JS < 140 KB gzipped; fonts subset; **no raster images above the fold** (hero is pure DOM/CSS/SVG); page weight < 900 KB.
- Animate **transform and opacity only** (plus `stroke-dashoffset` and `clip-path` on SVG). Never animate layout properties, filters, or box-shadow. Pinned scenes use `will-change: transform` applied on pin-enter and removed on pin-leave.
- 60 fps scroll on an iPhone 12 / mid-tier Android. If any movement can't hold 60 fps, simplify that movement rather than the idea.

---

## 1. CONFIG OBJECT — LOCKED (single source of truth)

```ts
// src/config.ts
export const CONFIG = {
  domain: "{{DOMAIN}}",
  packEmail: "{{PACK_EMAIL}}",            // e.g. pack@getdeclarix.com
  calLink: "{{CAL_LINK}}",                 // e.g. declarix/numbers-call (Cal.com)
  companyLegal: "{{COMPANY_NAME_LEGAL}}",
  companyNo: "{{COMPANY_NO}}",
  linkedin: "{{LINKEDIN_URL}}",
  posthogKey: "{{POSTHOG_KEY}}",
  posthogHost: "https://eu.i.posthog.com",
  pilotSlotsOpen: 3,                        // manual for now
  multimodalBarUntil: "2026-07-31",        // ISO date; bar hides after
};
```

`src` attribution — LOCKED: on load, read `?src=` from the URL (values like `multimodal`, `li`, `qr`, `ref`). Persist in `sessionStorage`. Append to every mailto subject (`… — via DCLRX-H1/{src}`) and pass to Cal.com as metadata (`data-cal-config` → `{"metadata":{"src":"…"}}`). Default `direct`.

---

## 2. DESIGN TOKENS — LOCKED

```css
:root {
  --ink:      #16313D;  /* text, borders, dark panels */
  --paper:    #F7F6F1;  /* page background */
  --field:    #FFFFFF;  /* card / form-field interiors */
  --cleared:  #1B7A4B;  /* THE accent: CTAs, stamp, key figures, Declarix node */
  --muted:    #5C6E76;  /* labels, captions, metadata */
  --manifest: #C77B27;  /* RARE alert accent — see usage rule */
  --border-w: 1.5px;
  --frame-w:  2px;
  --ease-out:   cubic-bezier(0.22, 1, 0.36, 1);   /* entrances */
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);   /* scrubbed position moves */
}
```

Rules — LOCKED: green is the only CTA colour. Zero gradients anywhere. Zero border-radius except stamps (4px). Zero drop-shadows except the mobile sticky CTA bar (`0 -1px 0 var(--ink)` hairline + `0 -8px 24px rgb(22 49 61 / 0.08)`). Dark sections: `--ink` background, `--paper` text. Boxes: `1.5px solid var(--ink)`; the page's outer document frame: `2px`. **--manifest may appear in at most ONE component on the page at a time**: while the Multimodal bar is live (until `multimodalBarUntil`) it owns orange and the header pilot-slots cell renders in `--muted`; after that date, the slots cell takes orange. Amber *flags inside the assembly scene* are exempt from this rule (they are diegetic document markings, capped at 2 instances).

**Paper texture:** an SVG `feTurbulence` noise overlay on `--paper` sections at 2.5% opacity, `pointer-events:none`, generated inline (no image file).

### Typography — LOCKED
| Role | Face | Weight | Size (desktop / tablet / mobile) | Notes |
|---|---|---|---|---|
| Hero display | Archivo | 900 | clamp: 76 / 56 / 40 px | line-height 1.02, letter-spacing −0.025em |
| Section heads (Box titles) | Archivo | 700 | 34 / 30 / 26 px | lh 1.08, ls −0.015em |
| Sub heads | Archivo | 700 | 21 px | lh 1.25 |
| Body | Archivo | 400/500 | 17 px (16 mobile) | lh 1.55, max-width 62ch |
| Labels / box numbers / data | IBM Plex Mono | 500/600 | 11 px labels · 13 px data · 13 px captions | labels UPPERCASE, ls 0.10em |
| Big figures (ROI) | IBM Plex Mono | 600 | 44 px | tabular-nums |

Selection colour: `--cleared` background, `--paper` text. Focus rings: `2px solid var(--cleared)`, offset 2px, never removed.

---

## 3. MOTION SYSTEM — LOCKED

- **Lenis**: desktop only (`lerp: 0.09`, `wheelMultiplier: 1`). On touch devices do not initialise Lenis — native scroll. Sync Lenis with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` + gsap ticker.
- **Durations:** micro-interactions 120–180 ms; entrance reveals 450–600 ms with 40–60 ms stagger; scroll-scrubbed movements have no duration (progress-linked, `scrub: 0.4`).
- **Entrance pattern (global):** elements rise 24 px + fade, `--ease-out`, triggered at `top 78%`, once. Headlines use SplitText by lines with `overflow:hidden` line masks, y:110% → 0, stagger 70 ms. Never re-animate on scroll-up.
- **Typewriter captions:** GSAP TextPlugin, 28 chars/s, mono, with a 1ch `▍` cursor that blinks (steps(1), 1s) and disappears 400 ms after completion.
- **Tether lines:** SVG paths, `stroke: var(--ink)`, 1.5px, drawn via dashoffset, scrub-linked to their movement window; a 3px `--cleared` dot travels to the endpoint as the line completes.
- **THE STAMP (single animated signature — used exactly once, §6 movement 5):** an SVG stamp (see §8) scales 1.6 → 1.0 with `rotate: -8deg → -3deg`, opacity 0 → 1 over 140 ms, ease `back.out(3)`; on impact the pack card translates y 3px down and back over 90 ms and the ink ring renders at 92% opacity with a 1px misprint offset (two overlapping copies, second at 0.35 opacity, translated 0.5px). No sound.
- **prefers-reduced-motion — LOCKED map:** kill Lenis; kill all pins (scenes render as sequential static frames in normal flow); typewriters render full text instantly; tethers render fully drawn; stamp fades in over 200 ms; entrance reveals become opacity-only 200 ms. Every word and data point must remain readable — reduced-motion users get the complete argument.

---

## 4. PAGE ARCHITECTURE

Single route `/`. The entire page sits inside a **document frame**: `2px solid var(--ink)` border, `--paper` background, margin 16px from viewport (8px mobile), the frame drawn once around all content (header to footer). Section anchors: `#job #evidence #system #security #numbers #questions #pilot #book`.

Vertical rhythm: boxes separated by `1.5px` rules; internal padding 34px desktop / 20px mobile; boxes never exceed 1080px content width (copy blocks 760px), centred.

---

## 5. STICKY HEADER (form header strip) — LOCKED

A segmented strip, `--field` background, bottom border 1.5px, sticky top, height 72px → 56px after 80px scroll (animate height + padding only, 200 ms).

Desktop cells left→right (mono 11px labels above 13px values, cell dividers 1.5px):
1. **DECLARIX** wordmark (Archivo 900, 20px, ink) with a 6×6px `--cleared` square before it. Beneath, mono 9px: `THE OFFICE LAYER FOR CUSTOMS BROKERS`.
2. `FORM REF` → `DCLRX-H1`
3. `ISSUE` → `2.0 · JUL 2026`
4. `PILOT SLOTS` → `{pilotSlotsOpen} OF 5 OPEN` (colour per §2 manifest rule)
5. Nav links, mono 11px caps, in-page smooth-anchors: `THE JOB · EVIDENCE · SECURITY · NUMBERS · PILOT`
6. CTA button (see §9 button spec): **Book the 20-minute numbers call** → `#book`

Mobile: cell 1 + CTA (label shortens to **Book the call**) only. No hamburger — the page is the nav.

**Multimodal bar** (directly under header, date-gated by config, dismissible with `×`, dismissal in sessionStorage): `--manifest` background, ink text, mono 12px:
`MET US AT MULTIMODAL (NEC · 30 JUN–2 JUL)? Mention it when you book — we'll bring your stand notes to the call. →` (whole bar links to `#book`, sets `src=multimodal` if unset).

**Mobile sticky bottom bar:** appears after 40% scroll depth (translateY entrance), `--field`, two buttons side by side: `Send an ugly pack` (secondary style) · `Book the call` (primary). Hidden while Box 9 is in viewport.

---

## 6. SECTIONS — LOCKED copy (verbatim) + choreography

Box titles render as: mono 11px `BOX N` tag above the Archivo section head.

---

### BOX 1 — HERO (masthead)

Layout: single column, centred, 92vh min-height. No imagery above the fold except the peeking document pile (below).

- Mono kicker: `CUSTOMS ENTRY PREPARATION — FOR BROKERS, NOT INSTEAD OF THEM`
- **H1 (Archivo 900):** `Customer paperwork in. Entry-ready pack out.`
- Body (max 58ch, centred): `Declarix reads the whole job — any file, straight off a forwarded email — and returns a CDS-ready pack for Sequoia or Descartes, with the evidence pinned to every field. Your clerk checks it in minutes and submits through your own system, same as today.`
- Mono price cue: `PRICED PER ENTRY, NOT PER SEAT · PILOT: FREE IF IT FAILS`
- CTA row: **Send one ugly pack** (secondary) · **Book the 20-minute numbers call** (primary)
- Below CTAs, the top 90px of the *document pile* (Box 2's actors) peeks above the fold at slight rotations, inviting scroll. Mono scroll cue bottom-centre: `SCROLL — THE JOB ARRIVES ▾`

Choreography: on load (not scroll), H1 lines mask-rise (stagger 70 ms), then kicker/body/CTAs rise-fade sequentially (total sequence ≤ 1100 ms). The pile idles with a ±0.4deg, 6 s alternating rotation on two of the five documents (transform only) — barely alive, like a draught caught them.

---

### BOX 2 — THE JOB (`#job`) — the centrepiece assembly scene

**Desktop/tablet-landscape: one pinned container, `pin: true`, total scroll distance `+=420vh`, `scrub: 0.4`.** Inside: left half = the documents; right half = the building **ENTRY PACK** grid. An SVG layer between them carries tethers.
**Mobile & reduced-motion: NOT pinned.** The five movements render as five sequential full-width blocks (documents on top, grid beneath, vertical tethers), each with standard entrance reveals. Identical copy and data.

**The documents (DOM-rendered, not images — LOCKED):** five overlapping "papers" (`--field` bg, 1.5px ink borders, real text at mono 8–10px, ink at 80%), each with a mono corner tag:
`D1 · INVOICE OTC-4471` · `D2 · INVOICE OTC-4488` · `D3 · PACKING LIST` · `D4 · BILL OF LADING MAEU 2264 8891` · `D5 · EMAIL — RE: URGENT FELIXSTOWE` — plus `D6`, a skewed "phone photo" of a delivery note (CSS perspective transform + slight exposure vignette, still DOM).

**Movement windows (scene progress p):**

**mv-1 · THE MESS (p 0 → 0.18).** Documents shuffle from the hero pile into a fanned stack; typewriter caption sequence (each replaces the last):
`08:52 — THE JOB LANDS.`
`ONE JOB: 6 ATTACHMENTS · 3 FORMATS · 43 LINES · 2 INVOICES, AMALGAMATED`
`SOMEONE HAS TO KEY ALL OF THIS.`
Then, after a beat (p ≈ 0.16), same line position: `OR NO ONE DOES.` — and the empty ENTRY PACK grid fades in on the right, header row first: `ENTRY PACK — DRAFT · JOB REF DX-2216 · PREPARED 09:03`.

**mv-2 · THE READ (p 0.18 → 0.45).** A 100%-width, 28px-tall scan band (`--cleared` at 12% opacity with a 1.5px leading edge) sweeps down D1, then D3, then D4 in turn. As it crosses a value, that value lifts as a mono chip (Flip from document position → its grid cell), tether drawing behind it. **Eight choreographed flights, stagger ≈ 0.03 p each, in this order (source → grid row):**
1. `OSAKA TABLEWARE CO., LTD` (D1 head) → EXPORTER
2. `MERIDIAN HOUSEWARES LTD, LEICESTER` (D1) → IMPORTER · EORI GB4471…
3. `CIF FELIXSTOWE` (D1 footer) → INCOTERM / DELIVERY TERMS
4. `¥ 4,862,400 · JPY` (D1 total) → INVOICE TOTAL — chip visibly converts mid-flight to `£ 25,540.11` with a micro-caption `JPY→GBP · HMRC MONTHLY RATE — APPLIED ✓`
5. `640 CARTONS / 16 PALLETS` (D3) → PACKAGES
6. `8,412 KG GROSS · 7,706 KG NET` (D3) → MASS
7. `MAEU 2264 8891` (D4) → PREVIOUS DOCUMENT (N705)
8. `JP — ORIGIN, LINES 1–43` (D1/D2) → COUNTRY OF ORIGIN
Grid rows not fed by flights fill quietly (fade, 60 ms stagger): DECLARANT, CPC 40 00 000, DOC CODES `N935 · N271 · N705`, LOCATION `GBFXT`, and a final muted row `…29 FURTHER LINE ITEMS IN THE PACK`.

**mv-3 · THE FLAGS (p 0.45 → 0.62).** Two grid rows pulse amber (1.5px amber left-bar + amber value text — the two permitted diegetic amber instances):
- `COMMODITY CODE — NOT STATED (3 LINES)` → a research card slides from the row (Flip expand): mono header `PROPOSED — FOR YOUR CLERK'S CONFIRMATION`, body: `6912 00 — ceramic tableware, stoneware. Reasoned from line descriptions + supplier history. Indicative duty shown from the UK tariff. One alternative retained: 6911 10 (porcelain) — rejected: material stated "stoneware" on 41 of 43 lines.` (Chip: `ILLUSTRATIVE DEMO DATA`.)
- `INCOTERM — CONFLICT` → card: `Invoice says CIF; the 14:22 email says CIP. Flagged, not guessed — the pack ships with both cited and the question asked.`
- D2 sweeps late here; caption over the grid: `2 INVOICES → 1 ENTRY · LINES MERGED, TOTALS RECONCILED ✓ AMALGAMATION NOTED FOR THE RECORD.`
Section aside (static copy, right column head): **It flags what's missing, then does the looking-up.**

**mv-4 · THE EVIDENCE (p 0.62 → 0.78) (`#evidence` resolves here).** The scene auto-demonstrates the check: the INCOTERM row highlights → D1's footer zooms to 1.18× with a `--cleared` underline under `CIF FELIXSTOWE`, page/line ref chip `D1 · P.2 · L.44`; then the same for INVOICE TOTAL → D1 total. Static copy block (left column top during this window):
**Every field shows its working.**
`Tap any value in the pack and its source lights up — document, page, line. Checking an entry becomes the fast part, not the job. We don't ask you to trust it. We make it quick to check.`

**mv-5 · THE HANDOVER + THE STAMP (p 0.78 → 1.0).** The grid compresses (Flip) into a single **pack card**: `ENTRY PACK DX-2216 · 43 LINES · READY FOR SUBMISSION — mono footer: PREPARED BY DECLARIX · CHECKED BY __________ (YOUR CLERK)`. It slides right into a slotted receptacle labelled by a toggle chip group: `SEQUOIA ▸ DESCARTES E-CUSTOMS ▸ OTHER (CSV / YOUR FORMAT)` (clickable at rest; scene defaults to Sequoia). As the card seats (p 0.97): **THE STAMP** (§3) lands on it — stamp text `DECLARIX · PACK COMPLETE · 09:07`. Caption beneath, Archivo 700 21px: **Keep Sequoia. Keep Descartes. Lose the keying.**

**Aftermath (normal flow, directly after the pin):** the finished pack persists as a **live interactive element** — the full grid, where EVERY row is tappable and opens its evidence popover (source doc thumbnail crop, page/line ref, `↗ view in place` scrolls the mini-doc). This is the hands-on demo, and on mobile it is the primary evidence experience. Beneath it, centred CTA pair (both styles) + mono note: `THE PACK ABOVE IS A WORKED EXAMPLE — ILLUSTRATIVE VALUES.`

---

### BOX 3 — ANY FILE

Head: **It reads whatever your customers send.**
Body: `PDF invoices, spreadsheets with merged cells, scans, phone photos of delivery notes, forwarded email chains, the 300-line packing list. If a person could read it, it goes in the pack.`
Visual: a slow marquee (CSS transform loop, 48s, pause on hover) of six DOM "specimens" with mono tags: `SCANNED CMR — SKEWED 4°` · `XLSX — 312 LINES, MERGED CELLS` · `.EML + 5 ATTACHMENTS` · `HANDWRITTEN DELIVERY NOTE` · `TWO INVOICES, ONE ENTRY` · `PHOTO — TAKEN IN A CAB`.
Closing line (Archivo 700 21px): **Send us your worst.** → text link `pack yours off now →` (mailto, §9).

---

### BOX 4 — YOUR SYSTEM (`#system`)

Head: **Not customs software. The layer in front of it.**
Body: `Declarix never touches HMRC and never asks you to migrate anything. The pack drops into the system you already run — your badge, your CSP, your submission, your client relationship. Output for Sequoia and Descartes e-Customs today; other formats on request.`
Visual: a horizontal flow strip of four bordered nodes joined by 1.5px rules with mono arrows: `CUSTOMER PAPERWORK → DECLARIX (node in --cleared) → YOUR CLERK'S CHECK → SEQUOIA / DESCARTES → HMRC CDS`. Under the Declarix node, mono: `MINUTES`. Under the clerk node: `STILL YOURS`. Nodes rise-fade in sequence on entry; the connecting rule draws left→right (scrub-free, 700 ms total).
Footnote (mono, muted): `NO INTEGRATION PROJECT. NO INSTALLATION. AN EMAIL ADDRESS. GO-LIVE: TODAY.`

---

### BOX 5 — SECURITY (`#security`) — dark panel

Full-bleed inside the frame: `--ink` background, `--paper` text, generous 96px vertical padding.

Head: **Processed. Returned. Deleted.**
Body: `Your documents exist with us for exactly as long as it takes to build the pack. Then they're destroyed. Nothing is archived, nothing waits on a server, and nothing of yours trains anything. The models read your documents the way a clerk would — then forget them the way a clerk can't.`
Visual: the five demo documents from Box 2 reappear small, then **shred**: each splits into 6 vertical strips (clip-path columns) that drop 30px and fade, staggered 40 ms — triggered once at `top 65%`. What remains is a mono ledger (rows separated by 1px paper-tone rules at 20% opacity):
```
DOCUMENTS RETAINED ............ 0 DAYS
PACKS RETAINED ................ YOUR COPY ONLY
TRAINING ON YOUR DATA ......... NONE
ACCESS TO HMRC ................ NONE — WE NEVER SUBMIT
SUBPROCESSORS ................. LISTED IN FULL, ON REQUEST
```
(Reduced motion: strips pre-shredded, ledger visible.)
Note: this is the page's single permitted use of the word "AI"-adjacent framing; the word "AI" itself appears nowhere on the page — "the models" is the ceiling.

---

### BOX 6 — NUMBERS (`#numbers`)

Head: **The numbers call, previewed.**
Interactive calculator (state in React; figures in Plex Mono 600 44px, tabular; count-up 500 ms on change):
- Input: slider `ENTRIES PER WEEK` 40–600, default 120, mono value readout.
- Constants (mono, editable-looking but static): `KEYING COST PER ENTRY TODAY £7.95 · WITH DECLARIX £2.45 · ILLUSTRATIVE — WE REBUILD THIS WITH YOUR NUMBERS ON THE CALL`.
- Outputs: `KEYING HOURS BACK PER WEEK` · `SAVED PER WEEK £` · `SAME TEAM, ROUGHLY 3× THE ENTRIES` (static line).
Math: hours = entries × 14 min saved / 60 (comment the assumption in code); £ = entries × (7.95 − 2.45).
CTA beneath (primary): **Book the 20-minute numbers call** + mono aside `BRING A REAL WEEK'S VOLUME. WE'LL REBUILD THE MODEL LIVE.`

---

### BOX 7 — QUESTIONS BROKERS ASK (`#questions`)

Accordion of six rows (1.5px rules; mono `Q` cell left; Archivo question; `+`→`×` rotates 45°, 150 ms; panel height animates via grid-template-rows trick, 250 ms `--ease-out`). Copy LOCKED:

1. **Who carries the liability?** — `You do — exactly as today. Declarix prepares; your clerk approves; your firm submits through its own badge. Nothing reaches HMRC from us, ever. The pack exists to make your check faster, not to skip it.`
2. **We already run Sequoia / Descartes.** — `Keep them. That's the point. Declarix outputs a pack your system ingests; we sit in front of your software, not instead of it.`
3. **Our jobs are messy.** — `Good — messy is the product's home ground: amalgamated invoices, part shipments, scans, spreadsheets that fight back. The pilot is one anonymised ugly pack processed side-by-side. If Declarix can't structure it, you've lost nothing and we've learned something.`
4. **Where does client data go?** — `In, through, out. Documents are deleted once the pack is returned — retention zero days, no training on your data, subprocessors listed on request.`
5. **What does it cost?** — `Per entry, not per seat. The pilot is free if it fails and capped at £500 if it works. Exact per-entry rate depends on your mix — that's the 20-minute call.`
6. **Will my clerks need training?** — `No. The pack arrives; they check it in the system they already know. Most clerks are reviewing their first pack within the hour — with their own name still on the entry.`

---

### BOX 8 — THE PILOT (`#pilot`)

Two-column (stack on mobile). Left — terms as a mono docket:
```
THE PILOT — TERMS OF ENGAGEMENT
1. YOU SEND ......... ONE ANONYMISED, GENUINELY UGLY JOB
2. WE RETURN ........ THE ENTRY-READY PACK, WITHIN ONE WORKING DAY
3. YOUR CLERK ....... CHECKS IT SIDE-BY-SIDE AGAINST THE MANUAL RUN
4. IF IT FAILS ...... YOU PAY NOTHING
5. IF IT WORKS ...... PILOT CONTINUES, CAPPED AT £500 TOTAL
```
Right — a **static printed stamp graphic** (same SVG as §8, pre-rendered pose, no animation): ring text `FREE IF IT FAILS · CAPPED IF IT WORKS`, centre `£0 / £500`. Beneath, founder line (Archivo 500 body): `Declarix is built in the UK by {{FOUNDER_LINE — e.g. "a PhD engineer who has spent years building document-extraction systems for regulated industries, and a co-founder who runs the numbers"}}. We'd rather prove it on your paperwork than pitch it on ours.` Mono beneath: `{{COMPANY_NAME_LEGAL}} · CO. {{COMPANY_NO}} · ENGLAND & WALES`.

---

### BOX 9 — START (`#book`)

Head: **Two ways to start. Both cost you an email.**
Two equal cards:

**Card A — SEND ONE UGLY PACK** (secondary-styled but large)
`Pick your nastiest recent job — the amalgamation, the scans, the lot. Anonymise it, forward it, and the entry-ready pack comes back within one working day. No deck. No login. One email.`
- Primary action: **Email the job to {packEmail}** — a `mailto:` built as: subject `Ugly pack — [your company] — via DCLRX-H1/{src}`, body template: `Attached: one anonymised job.\nOur declaration system: [Sequoia / Descartes / other]\nEntries per week, roughly: [ ]\nSend the pack back to: [ ]`.
- Beside it a **copy-address chip** (mono, click → clipboard, label flips to `COPIED ✓` for 1.2s).
- Small print (mono, muted): `BY SENDING, YOU CONFIRM THE DOCUMENTS ARE ANONYMISED. EVERYTHING IS DELETED ONCE YOUR PACK GOES BACK.`
- **Do not build a file-upload form.** Uploads via a form vendor would breach the zero-retention claim. Email only.

**Card B — BOOK THE 20-MINUTE NUMBERS CALL** (primary)
`Bring one week's real volume. We rebuild the cost-per-entry model live and you leave with the spreadsheet either way.`
- **Cal.com inline embed** under the copy: official embed snippet, `data-cal-link={CONFIG.calLink}`, config `{"theme":"light","layout":"month_view","metadata":{"src":…}}`, brand colour `#1B7A4B`, container min-height 560px with a mono `LOADING THE DIARY…` fallback. Below, fallback link: `Calendar tools not your thing? Email {packEmail} with two times that suit. →`

---

### FOOTER (form footer)

1.5px top rule. Left: mono `DECLARIX · FORM DCLRX-H1 · ISSUE 2.0 · THIS PAGE SETS NO MARKETING COOKIES — THERE IS NOTHING TO CONSENT TO.` Centre: links `PRIVACY · {LINKEDIN}`. Right: the declaration block — body-size Archivo 400 italic: `I declare the particulars given on this page to be true and complete.` above the **signature scribble SVG** (§8) that draws itself (dashoffset, 600 ms) when scrolled into view, with mono beneath: `DECLARIX, JULY 2026`.

`/privacy` = minimal static page in the same frame: plain-English zero-retention statement, PostHog cookieless analytics disclosure, contact email. FLEX wording, same tokens.

---

## 7. BUTTONS & INTERACTIVE STATES — LOCKED

- **Primary:** `--cleared` bg, `--paper` text, 1.5px `--cleared` border, mono 12px caps ls 0.08em, padding 16×26, radius 0. Hover: bg darkens 6% + translateY(-1px), 130 ms. Active: translateY(0). Buttons say exactly what happens — never "Get started" / "Learn more".
- **Secondary:** transparent bg, `--ink` text, 1.5px ink border. Hover: `--ink` bg, `--paper` text.
- Links: 1.5px underline, offset 3px; hover shifts underline to `--cleared`.
- Accordion, toggle chips, slider: visible focus states per §2; slider thumb = 18px ink square (radius 0), track 2px ink at 25%, filled portion `--cleared`.

## 8. THE TWO SVGs — LOCKED

1. **The stamp:** double ring (outer 2px, inner 1px) circle Ø ~150px, curved mono text on the ring, centre lines in Plex Mono 600. Ink colour `--cleared`. Include the misprint-offset duplicate technique from §3. Author it by hand as inline SVG — no image trace.
2. **Signature scribble:** a single ~2px hand-style path (three looping strokes suggesting initials "DX"), authored as one `<path>`, ink colour, drawn via dashoffset.

## 9. ANALYTICS, SEO, A11Y — LOCKED

- **PostHog, cookieless:** `persistence: 'memory'`, EU host from config, autocapture on. Custom events: `cta_book_click`, `cta_pack_mailto`, `copy_pack_email`, `scene_complete` (pin progress = 1), `pack_field_tap`, `roi_slider_change` (debounced), `booking_confirmed` (Cal embed event listener `bookingSuccessful`). No cookie banner — and the footer claim above must remain true: verify nothing sets cookies.
- **Meta:** `<title>Declarix — customer paperwork in, entry-ready pack out</title>`; description: `Declarix turns any customer paperwork into a CDS-ready pack for Sequoia or Descartes — evidence pinned to every field, nothing stored, priced per entry. Send one ugly pack and see.` OG/Twitter card image at `/og.png` (1200×630 — supplied separately; ship a placeholder that renders the hero H1 on paper tokens if absent). Canonical `https://{{DOMAIN}}/`. `robots` allow; simple `sitemap.xml`.
- **A11y:** semantic landmarks; the pinned scene gets an `aria-label` narrating the demo and all caption text present in DOM (visually sequenced, never display:none from AT); accordion = proper `button[aria-expanded]`; colour contrast AA on every pairing (muted-on-paper is 5.4:1 — verify); full keyboard path to both CTAs; `prefers-reduced-motion` per §3.

## 10. ACCEPTANCE CHECKLIST — run before calling it done

1. Cold load on throttled Fast-3G: H1 readable < 1.8 s, no font swap flash (use `font-display: optional` + preload the two critical woff2s), CLS < 0.02.
2. Scroll the assembly scene at half speed: all 8 flights land in their exact grid rows; tethers never detach; stamp lands precisely as the pack seats; nothing overlaps illegibly at any progress point.
3. iPhone-width: scene renders as 5 stacked movements, no pinning, all copy present; sticky bottom bar appears at 40% and hides over Box 9.
4. `prefers-reduced-motion`: zero pins, full content, stamp fades, shred pre-done.
5. Keyboard-only: reach and operate accordion, toggle chips, slider, both CTAs, Cal embed.
6. Click every row of the live pack: evidence popover shows correct source + page/line per the dataset.
7. `?src=multimodal`: appears in mailto subject and Cal metadata; Multimodal bar shows before 31 Jul 2026, absent after (test by mocking date).
8. Lighthouse: Perf ≥ 95 mobile, A11y ≥ 95, no console errors, JS ≤ 140 KB gz.
9. Grep the built output for banned words — `AI-powered, revolutionary, seamless, cutting-edge, leverage, solution, empower, unlock, supercharge, game-changing, innovative, disrupt, platform` — zero hits in visible copy. The word `AI` itself: zero hits.
10. The GitHub Action deploys `dist` to Pages green on first push; CNAME intact.

Build it exactly to this document. Where something is genuinely unspecified, choose the quieter option.

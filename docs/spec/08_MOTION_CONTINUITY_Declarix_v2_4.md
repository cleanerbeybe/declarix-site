# DECLARIX v2.4 — MOTION CONTINUITY PASS: "ONE FORM, NOT TEN SECTIONS"
**Ref: DCLRX-WEB-2.4 · Paste into Claude Code after v2.3. Bump ISSUE to 2.4. All existing motion rules stand (transform/opacity/clip-path only, scrub 0.4, --ease-out entrances, reduced-motion map applies to everything below).**

## Governing idea — LOCKED
The page is **one declaration form being completed in front of the reader**, top to bottom. Every transition must express that: elements *carry over* between sections (same object, new duty), rules *draw* like pen strokes, and the dark panel is a **continuation sheet** of the same form — not a website mode-switch. Nothing new fades in from nowhere if it could arrive from somewhere.

---

## A. Inside the scene — blending the document animations

**A1 · Overlap the movements.** Movements currently butt-join. Overlap each boundary by 0.02 progress: as mv-1's last caption finishes, mv-2's scan band is already entering the top of D1. No dead frames between beats.

**A2 · Settle physics.** When the scan band exits a document, that document *settles*: 4px drop + rotation eases to its rest angle over 300ms (`--ease-out`), and dims to 88% opacity. Attention flows to the next live document without anything blinking off. The currently-scanned doc is always the only one at 100%.

**A3 · Ghost outlines — extraction foreshadows evidence.** When a chip lifts off a document (Flip flight), leave a **1.5px dotted outline rectangle** at its source position, ink at 35%. These ghosts persist. In mv-4 (evidence), the zoom re-lights the relevant ghost to solid `--cleared` underline — the same mark, upgraded. One visual grammar: *lifted from here → verifiable here*. (Reduced motion: ghosts render pre-drawn.)

**A4 · Chips decelerate into cells.** Flip flights get `--ease-inout` with the final 15% of the path easing hard (like paper sliding into a tray); on landing, the grid row's rule flashes to full ink for 120ms. No bounce — paper doesn't bounce.

**A5 · The clock is the metronome.** The timestamps (08:52 → 08:56 → 09:05) already exist; make the grid-header clock **tick upward live during mv-2–mv-5** (mono, minute increments tied to progress). The reader watches four minutes pass. This clock is then *reused* at the docket (B3) — one instrument across sections.

## B. The seams, one by one

**B1 · Hero → scene: the pile is the cast.** The five documents peeking under the hero CTAs must be the *same DOM nodes* the scene uses — on pin-enter, Flip them from the pile arrangement into the fanned mess (0 → 0.06 progress). No cut, no re-render: the reader followed the same papers down the page. (Currently the pile and scene docs are siblings; unify them.)

**B2 · Scene exit → live pack: morph, don't replace.** The stamped pack card currently scrolls away and the interactive grid appears below. Instead: on pin-leave, Flip the pack card back into the full live grid in normal flow (350ms) — the stamp shrinks to a small printed mark in the grid's header row, where it stays. The object the stamp blessed is the object you now touch.

**B3 · Scene → docket: hand over the minutes.** The final caption ends "…THE OTHER 40 MINUTES GO BACK TO THE DESK." As Box 3 enters, the docket's `~46 MIN` and `~9 MIN` values are the *only* animated items — they type in (TextPlugin) while everything else in the docket is already printed. The eye lands exactly where the previous sentence pointed. The scene's clock chip (A5) re-appears pinned to the docket corner, frozen at `09:05`.

**B4 · Docket → calculator → cards: animate once.** `£7.95 → £2.45` appears three times in Box 3. Count-up animates on **first appearance only** (docket TOTAL rows); calculator anchor and preset cards render static. Repeated fanfare cheapens the number.

**B5 · Box 3 → marquee: recurring cast.** One marquee specimen is literally the scene's D6 phone-photo, same node styling, with its mono tag reading `D6 · FROM THE JOB ABOVE`. The reader recognises it — the marquee stops being stock specimens and becomes *that job's* extended family.

**B6 · Marquee → system flow: the pack travels.** As Box 5 scrolls in, a small pack-card token (32px, green edge) slides along the flow strip's connecting rule from CUSTOMER PAPERWORK to the SEQUOIA/DESCARTES node (scrubbed, 0.6 of the section's entry), then the node's border thickens 1.5→2px. The flow strip stops being a diagram and becomes the journey the reader just watched, miniaturised.

**B7 · Into the dark panel: THE CONTINUATION SHEET.** This is the harshest seam on the page — solve it with form language, not a fade:
- The panel's top edge carries a mono tag, paper-on-ink, left-aligned: `CONTINUATION SHEET · SECURITY SCHEDULE — FORM DCLRX-H1` and the page's 2px document frame **runs straight through** the dark section in `--paper` colour. Same form, next sheet.
- Entry motion: the ink arrives as a straight-edged wipe (clip-path inset, scrubbed over the seam's 40vh — no gradient, a hard paper-fold line), timed so the Box 5 mono line `GO-LIVE: TODAY.` is the last thing readable on paper.
- Exit: bottom edge tag `END OF SCHEDULE — CONTINUE OVERLEAF →` and the wipe reverses into Box 7. The reader turned a page, twice.

**B8 · Dark panel internal echo.** The documents that shred here should be the *same five nodes* from the scene (clone at pin-leave, park hidden until Box 6). The reader watches papers they know get destroyed — the promise lands personally. Ghost outlines (A3) appear briefly where each doc stood, then fade: even the ghosts leave.

**B9 · FAQ → pilot → booking: the stamp's second life.** The pilot's static printed stamp should visibly be the *same stamp* from the scene: same SVG, rotated differently, 70% scale, with a mono caption `SECOND IMPRESSION`. In Box 9, the Zoho frame's ink border gets a small stamp *corner-crop* (top-right, 24px, clipped by the border) — the mark of the same office, getting fainter as the paperwork finishes. Three impressions, one stamp, decreasing ceremony.

## C. Global connective tissue

**C1 · Rules draw like pen strokes.** Every 1.5px inter-box rule draws left→right (scaleX 0→1, transform-origin left, 450ms `--ease-out`) as it enters at `top 85%`, once. The form is being ruled as you read it.

**C2 · Box tags type.** Each `BOX N` mono tag types in via TextPlugin (5 chars at 24 chars/s) just before its heading's line-mask reveal. Cheap, consistent, metronomic.

**C3 · The margin spine (desktop only, ≥1280px).** A 1px ink rail in the left page margin with tick marks and tiny mono numerals 1–9 that fill solid as each box passes centre-viewport. Form margin numbering as progress indicator. Clicking a numeral anchors to the box. (FLEX — drop if it crowds; never on mobile.)

**C4 · The scan band motif — budget of three.** The green reading-band from mv-2 may appear exactly twice more: once sweeping the docket's two TOTAL rows (B3 moment), once across an FAQ answer on open (200ms). Nowhere else. It is the page's "being read" gesture; scarcity keeps it meaningful.

**C5 · Velocity tilt (FLEX, desktop only).** Marquee specimens and the hero pile tilt ±0.4° with scroll velocity (lerped, 0.08). Paper caught in the draught of the reader's speed. Kill it if it costs a single frame.

## D. Budgets & guardrails — LOCKED
- No new pins. No parallax. Nothing moves that isn't paper, ink, rule, stamp, or clock.
- Added JS for this pass ≤ 12KB gz. Every effect: transform/opacity/clip-path only. 60fps or the effect ships disabled.
- Reduced motion: A3 ghosts pre-drawn, B7 renders as plain dark section with the continuation-sheet tags (the *copy* device carries the idea without motion), C1/C2 render complete, B2 renders the grid directly.
- Wit budget unchanged — B7/B9 tags are form furniture, not jokes. Do not add captions beyond those specified.
- Acceptance: scroll the full page at half speed — count hard cuts (elements appearing with no origin). Target: **zero** between hero and footer.

# DECLARIX v3.0 — CONSOLIDATED UPDATE: "THE £100K FEEL"
**Ref: DCLRX-WEB-3.0 · 4 July 2026 · Paste into Claude Code. This consolidates and sequences everything outstanding (v2.3 persona fixes → v2.4 continuity → v2.5 trust/calm/de-jank) plus the directives below. Bump ISSUE to 3.0.**

## REQUIRED INPUTS BEFORE DEPLOY (answered / still open)
- ✅ Multimodal: **attended, not exhibited** — use the framing in §1. Never claim a stand.
- ✅ ICC: `ICC SEAMLESS TRADE FINALIST {{YEAR — confirm}}` — ships in the provenance strip.
- ⚠️ Still open from v2.3: company number · founder-line names (Zoho already displays "Ihusan Adam", so the name is effectively public — default to including it unless vetoed) · the truthful supplier-history wording (option a or b) · real pack-back time at volume · correction-loop mechanism. **Builder: leave `{{}}` tokens for these; do not invent.**

---

## 1. Corrections — LOCKED
Provenance strip cells become:
`MULTIMODAL 2026 — NEC, IN ATTENDANCE` · `ICC SEAMLESS TRADE FINALIST {{YEAR}}` · `UK REGISTERED — CO. {{NUMBER}}` · `BUILT IN LEICESTER`
The header Multimodal bar copy ("Met us at Multimodal?") remains valid — you met people — but nothing anywhere may imply a stand or exhibitor status.

## 2. The cinematic hero — the enterprise trust move, done our way — LOCKED
The hero becomes a full-bleed **ink-duotone film hero**: the physical world behind, the paperwork in front.

- **Backdrop:** the 8–10s seamless loop (containers/quayside at dawn, per asset prompt §5), duotone-graded to the palette in post, playing at 0.75× speed behind a `#16313D` scrim at 55–65% so paper-white text passes AA. `muted playsinline loop`, ≤2.5MB, `preload="metadata"`.
- **Mobile + reduced-motion + Save-Data:** the poster still (same frame, same grade), never the video. The poster is the LCP element — preload it.
- **Foreground unchanged in content:** header strip, kicker, H1 `Up to 3× the entries per clerk.`, support line, trimmed body, price cue, CTAs — now set paper-on-ink. The document pile peeks below the hero's bottom edge where the page returns to paper; the seam between film-world and paper-world is a hard 2px paper rule (the top of the "form").
- **Grade recipe (non-negotiable):** desaturate → duotone map shadows `#16313D` / highlights `#F7F6F1` → +2% grain → no other colour survives. If the loop can't be produced in time, ship the poster still full-bleed with a 40s slow scale 1.0→1.04 Ken Burns (desktop only) and upgrade later.
- Everything below the hero remains the paper form. One cinematic statement, then the craft. (Box 6 keeps its 10–12% duotone backdrop; Box 8 keeps the portrait/desk exhibit; the mid-page `EXHIBIT A` band from v2.5-B3 is **removed** — the hero now carries the grounding, and two photographic moments per page is the ceiling below the fold.)

## 3. The fluidity mandate — "nothing snaps" — LOCKED
- Scrub smoothing 0.55 everywhere; Lenis lerp 0.08 desktop; anchor scrolls duration 900ms with `--ease-inout`.
- **Alive at rest:** hero film loop · pile draught (±0.4°, 6s) · marquee drift · the scene clock ticking · stamp ink at 92% (already static). Nothing else idles.
- **Page-load choreography (one orchestration, 900ms total):** frame draws (scaleX/Y from centre, 300ms) → header cells rise 60ms stagger → H1 line-masks → kicker/body/CTAs → film fades from poster. Runs once, never on navigation within the page.
- **Every interactive element has a crafted hover/active state** (150ms): buttons per spec; FAQ rows tint `--field`→paper; grid rows show a 2px left ink bar on hover; preset cards lift 1px; chips underline. No default browser states visible anywhere.
- **Image/section reveals:** exhibits and the Box 6 backdrop enter via clip-path inset wipe (450ms), not fade.
- All v2.4 continuity items stand (continuation sheet, ghost outlines, recurring cast, one stamp/three impressions); all v2.5 de-jank items stand (orthogonal tethers, sequential flights, fixed rest angles, kill list).

## 4. The "£100k" definition of done — acceptance checklist — LOCKED
Ship only when every line passes:
1. 60fps scroll end-to-end, iPhone 12 and mid-tier Android — measured, not vibes.
2. Zero hard cuts: nothing appears without an origin (v2.4 acceptance).
3. Zero default UI: no native focus rings replaced with nothing (custom rings present), no default cursors on interactives, no unstyled selection, no FOUC (`font-display: optional` + preloads).
4. Optical, not mathematical, alignment: stamp optically centred; H1 punctuation hangs; mono columns share a baseline grid (4px).
5. Type rendering: `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;` letterspacing per spec at every size.
6. The film hero: loop point invisible; scrim contrast AA verified on the brightest frame; poster and first video frame identical (no flash).
7. Every number on the page uses tabular figures; every `×` is U+00D7; every `£` value thousands-separated.
8. Hover states on 100% of interactive elements; keyboard path complete; reduced-motion delivers the full argument.
9. LCP < 1.8s mobile (poster hero), CLS < 0.02, JS ≤ 155KB gz (video excluded), Lighthouse mobile ≥ 92 with the film hero live.
10. OG image regenerated from the new hero (duotone frame + H1) and verified in LinkedIn Post Inspector on the live domain.
11. Print stylesheet flourish: printing the page yields a clean mono/ink form on white — headers, boxes, docket, FAQ; film and motion stripped; footer declaration intact. (This audience prints things. Let the printout be a leave-behind.)
12. Side-by-side tab test vs edentri.com and cargowise.com: Declarix reads as the most *considered* page of the three — grounded like them, precise like nobody.

## 5. Asset order (send to image/video gen or shoot) — updated from doc 03
1. **Hero loop (now required):** *"Static locked-off wide shot, first light over a UK container terminal, stacked containers and one gantry crane, thin mist, near-monochrome deep ink-navy (#16313D) shadows with warm paper (#F7F6F1) highlights, documentary restraint, almost no movement — mist drift only, no people, no readable branding, 10 seconds, seamless loop, 24fps."* Negative: *sunrise orange, lens flare, drone movement, ships underway, saturated colour, timelapse.*
2. **Poster still:** the loop's best frame, same grade, 1920×1080 ≤160KB.
3. **Box 6 backdrop still:** container stacks at night, ink-dominant duotone, heavy shadow, ≤120KB.
4. **Founder portrait ⚠️:** real photo, duotone treatment, ruled frame, mono caption.
5. **OG image:** new hero frame + H1 overlay per §4.10.
Own photography beats generated for 1–4 if a Felixstowe/port morning is feasible; grade identically either way.

## 6. Sequence for the builder — LOCKED
Apply in order, committing between passes: (1) v2.3 fixes with `{{}}` tokens for open inputs → (2) v2.4 continuity → (3) v2.5 trust/calm/de-jank minus the mid-page exhibit band → (4) this document's hero, fluidity, corrections, checklist. Then re-record desktop + mobile at 30s and return for the final diff.

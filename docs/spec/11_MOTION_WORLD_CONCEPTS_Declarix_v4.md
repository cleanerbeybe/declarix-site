# DECLARIX v4 CONCEPT — THE SCROLL-FILM DIRECTION + VIDEO-GEN PROMPT PACK
**Ref: DCLRX-WEB-4.0-CONCEPT · 6 July 2026 · Response to the Emons scroll-world reference. Part A = why it works. Part B = four concepts, one recommended. Part C = production-ready video-gen prompts. Part D = build architecture inside our system.**

---

## PART A — WHY THE EMONS SITE WORKS (the mechanics, not the magic)

Read from the recording (Emons forwarding, "$35k animated website" post):

1. **One continuous world.** The whole company is a single miniature diorama — warehouse, winding road, port, HQ. Scroll is a camera dolly through it. Spatial continuity is what reads as "expensive": the viewer's brain builds ONE model of the company instead of digesting eight disconnected sections.
2. **Fixed card, moving world.** The narration card ("Emons — your forwarding company...") never moves. The world does all the motion behind it. Text stays readable; spectacle never costs comprehension. This is the single most stealable pattern.
3. **The miniature scale trick.** Toy-scale makes heavy industry charming and *comprehensible*. Subtext: "we make your chaotic physical world tidy and manageable." That is a logistics value prop expressed purely through art direction.
4. **Brand colour as wayfinding.** Neutral world, brand-red on every truck, roof, container. The brand literally carries the cargo through every scene. One accent, total discipline — same rule our green already obeys.
5. **Scroll-scrub = user agency.** The user drives the film. It rewards replay, feels interactive without being a game, and demos brilliantly in screen recordings (which is why it went viral — it is *built to be recorded*).
6. **The pipeline is the story.** Generated video (Higgsfield-class) → frames → scroll-scrubbed sequence. Production cost collapsed; perceived value didn't. That arbitrage is available to us too.

**What does NOT transfer:** the pastel clay-render look. It is this month's default gen-aesthetic; it will date fast, it's rented, and it collides with everything v2/v3 locked (ink, paper, duotone, zero gradients). v2.5-B5 already refuses "stock photography outside the duotone system" — same rule applies to stock *renders*. We steal the mechanics, never the skin.

---

## PART B — FOUR CONCEPTS (pick one; B1 recommended)

### B1 · THE PAPER WORLD ★ RECOMMENDED
The Emons mechanic translated losslessly into our locked language: **the miniature world is built of paper.** A desk-scale diorama where containers are paper cartons with ink-stencilled codes, gantry cranes are folded card, the sea is a sheet of ink-washed paper, hills are stacked cut sheets, roads are fold lines. Everything duotone ink/paper; the ONLY colour is the green stamp/accents (one green container per scene, the way Emons uses red). Scroll dollies the camera through: **the messy inbox pile → the scan (green light bar sweeps the world) → the port (paper ship, folded cranes) → the road home (paper truck on a fold-line) → the stamp (giant PACK COMPLETE impression closes the journey).**
- Why it wins: it IS our brand (the site is already "one declaration form"); the world-journey literally illustrates the product (paperwork moving through trade); miniature charm without the clay cliché; every frame greys perfectly into the existing duotone system.
- Copy hook: *"Your trade, on paper. Handled."* The physical world made of the thing we process.
- Risk: gen models love turning "papercraft" into origami-cute. The prompt pack below fights this with "documentary restraint, engineering-model, architect's maquette" language.

### B2 · THE JOB'S JOURNEY (document POV)
No diorama — a **filmic relay following one declaration pack**: forwarded email glow → paper landing on a desk at dawn → macro of the scan line → cut to the real duotone terminal (our existing hero footage world) → gantry crane lift → the stamp. Real-footage-feel duotone film, scroll-scrubbed. The pack is the recurring cast member (v2.4's continuity rule, filmed).
- Why: maximum cinema, zero cuteness; doubles as a brand film for LinkedIn; the hero loop we already spec'd becomes Scene 4.
- Risk: harder continuity across gen clips (same document must persist); reads more "brand film" than "interactive world" — less of the Emons wow.

### B3 · DAWN AT THE DESK (macro craft film)
Apple-style **ultra-macro**: ink bleeding into fibre, a stamp hitting in slow motion, dot-matrix numerals printing, paper edges in raking light. Scroll-scrubbed intimacy; the "£100k feel" expressed as texture rather than world.
- Why: cheapest to generate convincingly (macro hides gen artefacts); devastatingly premium stills fallback.
- Risk: no journey, no world — it polishes the current site rather than leaping past Emons.

### B4 · THE LEDGER CITY (drawn, not filmed)
An **ink-line isometric port** that draws itself as you scroll — form boxes extrude into buildings, rules become quays, the tether lines become crane cables. Pure SVG/vector animation (no video at all), technical-pen aesthetic.
- Why: zero video weight, infinitely crisp, ages beautifully, deeply ours (the form becomes the city).
- Risk: massive hand-animation effort — this is weeks of motion design, not a gen-prompt afternoon. Park it as the someday-masterpiece.

**Decision recommendation: lock B1 (Paper World) as the v4 scroll concept, with B2's Scene 4 shared as the v3.0 hero loop** — the first asset generated serves the live site immediately, whether or not v4 ships this quarter.

---

## PART C — VIDEO-GEN PROMPT PACK

### C0 · Global rules (paste as style prefix on EVERY generation)
> **STYLE LOCK:** Hand-built paper architectural maquette, matte cotton-paper surfaces, visible paper grain and knife-cut edges, near-monochrome: deep ink-navy (#16313D) shadows and line detail, warm paper-white (#F7F6F1) surfaces. One restrained deep-green (#1B7A4B) accent object per scene only. Soft low morning light through a window, long soft shadows, thin drifting mist at surface level. Tilt-shift miniature depth of field. Camera: slow locked-off or creeping dolly, 24fps, documentary restraint, engineering-model sobriety. No people, no faces, no readable real-world branding (stencil "DCLRX" permitted), no text overlays.
>
> **NEGATIVE:** saturated colour, rainbow palette, clay or plastic material, origami-cute, cartoon, characters, lens flare, drone swoops, camera shake, timelapse, glossy 3D render look, fast motion, bokeh balls, watermark, text.

Every output is graded through our ffmpeg duotone recipe afterwards (desaturate → map shadows #16313D / highlights #F7F6F1 → +2% grain), so minor colour drift in generation is survivable — but prompting near-monochrome keeps detail from dying in the grade.

### C1 · SHIP-NOW ASSETS (v3.0 already has slots waiting)

**A. Hero film loop** (drops into `CONFIG.heroLoopUrl`, 8–10s seamless, ≤2.5MB after encode)
> Static locked-off wide shot, first light over a miniature paper container terminal: stacked paper cartons as containers with ink-stencilled codes, one folded-card gantry crane, paper ship at a paper quay on ink-washed water, thin mist drifting between the stacks. Almost no movement — mist drift only, one crane cable swaying barely perceptibly. Seamless loop, 10 seconds, 24fps. + STYLE LOCK
- Variant (real-world, if paper-world isn't locked): keep v3.0 §5.1 prompt verbatim (real terminal at dawn) — both grade identically.

**B. Box 6 backdrop loop** (optional upgrade of the still, 18% opacity behind the ledger)
> Miniature paper archive at night: rows of paper document boxes in deep ink shadow, one shaft of cold light, dust motes drifting, a single box slides itself shut. 8 seconds, seamless loop. + STYLE LOCK

**C. OG/social motion teaser** (not on-site; for LinkedIn)
> Slow 6-second push-in on the paper terminal as the DECLARIX ring-stamp descends and presses PACK COMPLETE into the sky above the world like a watermark, paper flexing subtly under the impression. + STYLE LOCK

### C2 · THE PAPER WORLD SCROLL SCENES (B1 · five scenes, each generated as a 6–8s slow dolly, delivered as scrub frame-sequences)

Continuity method: first generate ONE master still per scene with an image model (same STYLE LOCK), approve the five stills as a set (same light direction, same paper stock, same green placement), then feed each still to image-to-video as the start frame. This is how you keep one world across five generations.

**SCENE 1 — THE INBOX (the mess)**
> Slow dolly forward across a vast desk plane at dawn: a landscape of scattered paper documents — invoices, packing lists, a skewed phone-photo print — drifting down and settling into an untidy heap. The heap's shadows are long ink-navy. One green-edged document lands last on top. 7 seconds. + STYLE LOCK

**SCENE 2 — THE SCAN (the read)**
> The paper heap now squared into a neat stack; a thin horizontal band of green light sweeps once across the desk-world from left to right, and where it passes, loose sheets align themselves into ruled rows like a ledger. Everything else motionless. 6 seconds. + STYLE LOCK

**SCENE 3 — THE PORT (the trade)**
> Slow lateral dolly along a miniature paper harbour: paper container ship low in ink-washed water, folded-card gantry crane lifting a single green paper container while hundreds of paper-white and ink-navy cartons wait in stacks, thin mist between stacks. 8 seconds. + STYLE LOCK

**SCENE 4 — THE ROAD HOME (the return)**
> High three-quarter view of paper hills made of stacked cut sheets; a fold-line road switchbacks between them; one small paper lorry with a green container crosses a paper bridge, its shadow long in morning light. 7 seconds. + STYLE LOCK

**SCENE 5 — THE STAMP (the close)**
> Top-down view of a single pristine declaration form on the desk-world; a massive circular stamp descends in slow motion and presses a deep-green PACK COMPLETE impression; the paper flexes and settles; ink microscopically feathers at the edges. 6 seconds, ends on a held still frame. + STYLE LOCK

### C3 · B2/B3 spares (generate if we want the cinematic or macro flavour)
- **Terminal dawn (real):** v3.0 §5.1 verbatim — still the best "grounding" shot ever spec'd for us.
- **Macro stamp:** Extreme macro, slow motion: a rubber stamp face touching cotton paper, green ink impression spreading into the fibres, paper flexing. Raking side light. 5 seconds. + STYLE LOCK
- **Macro ledger print:** Extreme macro of dot-matrix numerals printing onto ruled paper, head moving out of focus, tabular digits landing crisply. 5 seconds. + STYLE LOCK

### C4 · Generation settings (Higgsfield / Veo 3 / Runway Gen-4 / Kling)
- Aspect: hero + scenes 16:9 at highest res offered; ALSO run scenes 1 & 5 at 4:5 for mobile scrub. OG teaser 1:1.
- Motion strength: lowest setting that still animates — our whole language is restraint; gen artefacts live in fast motion.
- Loops: request "seamless loop" AND check the first/last frame in post; if the model can't loop, generate 12s and find a crossfade-free cut pair; the hero can also ping-pong (mist tolerates it).
- Reject list per output: any readable text it invents, any person, any colour outside the triad, any plastic sheen. Regenerate rather than retouch.
- Post: ffmpeg duotone grade → hero loop encoded H.265 + VP9 ≤2.5MB `muted playsinline loop preload="metadata"`; scrub scenes exported as JPEG sequences, 64–96 frames per scene at 1600px, q≈11 (~35–60KB/frame).

---

## PART D — BUILD ARCHITECTURE (how it lives in our stack without breaking budgets)

1. **Scrub engine:** one pinned section per scene pair, `ScrollTrigger scrub: 0.55` driving a `<canvas>` image-sequence painter (frames pre-decoded via `createImageBitmap`, drawn on GSAP ticker). No `<video currentTime>` scrubbing — it stutters on Safari and fights Lenis.
2. **The fixed card:** the existing form-header card grammar becomes the Emons narration card — pinned left, mono furniture, contents typed per scene (TextPlugin, existing 24 chars/s rule).
3. **Budgets:** JS cost ≈ +6KB (painter + preloader) against our 155KB gz ceiling (currently 126.6). Image weight is the real spend: 5 scenes × 80 frames × 45KB ≈ 18MB — therefore **lazy-load per scene** (fetch scene N+1's frames while N pins), mobile gets 4:5 sequences at 40 frames or poster stills, `Save-Data` and reduced-motion get stills with the existing clip-path reveals. LCP stays the current poster — the world starts BELOW the fold or replaces the hero only after the loop file also ships.
4. **Guardrail changes needed:** v2.4-D's "no new pins" and "two photographic moments below the fold" are explicitly superseded IF v4 is approved — bump ISSUE to 4.0 and note it in the header cell, same ritual as every pass.
5. **Sequence:** (1) generate + grade Scene set, approve stills as a set → (2) hero loop goes live on v3.0 immediately (`CONFIG.heroLoopUrl`) → (3) build the scrub engine behind a `?v4` preview flag → (4) side-by-side vs Emons recording + edentri/cargowise, then decide the swap.

**Acceptance for the world (added to the 12-point list):** the five scenes must read as ONE place (same light, same paper, same green discipline); 60fps scrub on an iPhone 12; any scene failing the duotone grade test (colour surviving) is regenerated, not colour-corrected into mush.

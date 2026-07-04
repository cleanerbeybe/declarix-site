# DECLARIX v2 — GENERATED ASSET PROMPTS
**Ref: DCLRX-AST-2 · 2 July 2026**

## 0. Asset philosophy (read first)

The site's visuals are **deliberately DOM/SVG-built, not generated images**: the documents, the pack grid, the tethers, the stamp, the shred. Reasons: they animate (Flip/ScrollTrigger can't animate pixels apart), they're razor-sharp on retina, they weigh ~0 KB, and hand-set type in Archivo/Plex Mono *is* the brand. Generated imagery on the page itself would soften the "fluent paperwork" credibility.

So the generation list is short and mostly **off-page** (social/OG/outreach). Everything below uses the locked palette: ink `#16313D`, paper `#F7F6F1`, cleared green `#1B7A4B`, manifest orange `#C77B27` (sparingly).

---

## 1. OG / social share image — 1200 × 630 (REQUIRED)

**Route A (preferred): don't generate — render.** Build `/og.html` with the real tokens/fonts: paper background with the SVG grain, 2px ink frame inset 24px, top-left mono `DECLARIX · FORM DCLRX-H1`, centred Archivo 900 54px two-liner `Customer paperwork in. / Entry-ready pack out.`, bottom-left mono `PRICED PER ENTRY · NOTHING STORED`, bottom-right the green stamp SVG at 15° tilt overlapping the frame. Screenshot at 1200×630. Pixel-true to brand.

**Route B (image gen, if you want texture).** Prompt for GPT-image / Imagen / Midjourney v7:

> Flat-lay editorial photograph, directly overhead, of a single pristine customs declaration form on a warm off-white paper background (#F7F6F1). The form has sharp navy-ink ruled boxes (#16313D), dense small monospaced typography, a few fields visibly completed. One circular rubber stamp impression in deep green ink (#1B7A4B) reading "PACK COMPLETE", slightly rotated, ink very faintly uneven like a real stamp. Soft even studio light, tiny paper grain, no shadows of hands, no logos, no readable real company names. Minimalist, Kinfolk-magazine restraint, generous empty margin on the left half for headline overlay. Aspect 1200:630. — *Negative: glossy, 3D render, blue glow, holograms, circuit boards, robots, hands, blur, clutter.*

Then overlay the real H1 + wordmark in Figma (never let a model render the type).

---

## 2. Ambient loop video (OPTIONAL — recommend shipping v2 without)

If used at all: **one** muted, looping background inside Box 5's dark panel at 18% opacity behind the ledger — never in the hero (performance + the hero must be type-led). Specs: 8–10 s seamless loop, 1920×1080, 24 fps, no audio; encode H.265 + VP9 ≤ 2.5 MB, poster frame JPG ≤ 60 KB, `preload="none"`, only loads after scene completion.

**Variant 1 — "Paper, then none" (fits the deletion story) — Veo 3 / Runway Gen-4 prompt:**
> Macro study, locked-off camera, of crisp white commercial documents on a dark slate surface (#16313D tones). Extremely shallow depth of field. Over ten seconds, sheets slide out of frame one by one with clean mechanical motion until the surface is completely empty; final two seconds hold on bare dark slate with faint paper dust settling. Cinematic, single soft key light from upper left, no hands, no text legible, no logos, muted cold palette with one subtle deep-green reflection. Seamless loop: first and last frame identical empty slate. — *Negative: people, hands, fire, shredders with blades visible, warm orange light, motion blur streaks, watermark.*

**Variant 2 — "Felixstowe dawn" (if you ever want a cinematic beat):**
> Static wide shot at first light of a UK container port, dark teal-navy grade, stacked containers in silhouette, thin mist, one gantry crane motionless, sodium lights just switching off. Almost nothing moves — only mist drift and a distant gull. Ten seconds, seamless loop, moody restraint like a Gerhard-Richter-grey documentary frame. No ships moving, no people, no readable brand names on containers, no text. — *Negative: sunrise orange glow, lens flare, drone sweep, timelapse clouds, saturated colour.*

---

## 3. Multimodal follow-up card — 1080 × 1350 (USE THIS WEEK)

For LinkedIn DMs/posts to stand contacts. Route A again preferred (render with real tokens): paper card, mono header `MULTIMODAL 2026 · NEC · FORM DCLRX-H1`, Archivo 900 `Good to meet at the NEC.`, body `One anonymised ugly pack. The entry-ready pack back within one working day. Then a 20-minute numbers call — or not.`, green button-shaped block `pack@{{domain}}`, stamp bottom-right. If generating a texture base, reuse the §1 Route B prompt with aspect 1080:1350 and *"large clear margin across the middle band for text overlay"*.

## 4. LinkedIn company banner — 1584 × 396

Render route: paper field, hairline ink frame, left-aligned wordmark + `THE OFFICE LAYER FOR CUSTOMS BROKERS`, right side a faint 8%-opacity oversized stamp cropped by the edge. Gen route (texture only): §1 Route B prompt, aspect 4:1, *"form boxes fading toward the right edge, heavy negative space"*.

## 5. Email header for ugly-pack replies — 600 × 140

Plain render, no gen: ink rule top and bottom, mono `DECLARIX · ENTRY PACK ENCLOSED · RETENTION: 0 DAYS`, tiny stamp right. Ships inside the pack-return email so the artefact itself carries the brand.

## 6. Already specced as vectors (do NOT generate)

Stamp SVG, signature scribble, favicon (16/32/180: the 6×6 green square + "D" in Archivo 900 on paper), paper-grain (inline SVG turbulence). All defined in the builder prompt §8 — generating these would only make them worse.

## 7. Post-generation checklist

- Palette-lock every output in post (Curves → map blacks to #16313D, whites to #F7F6F1); models drift.
- No legible pseudo-text from generators survives to production — overlay real type.
- Compress: JPG ≤ 200 KB (OG), video per §2; verify OG in the LinkedIn Post Inspector before the first follow-up goes out.

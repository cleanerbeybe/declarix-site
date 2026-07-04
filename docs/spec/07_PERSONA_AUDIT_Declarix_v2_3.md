# DECLARIX v2.3 — SIX-PERSONA AUDIT & CONVERSION FIX PASS
**Ref: DCLRX-WEB-2.3 · 3 July 2026 · Based on full-copy OCR of Declarix_v3.mov. Fixes at the end are paste-ready for Claude Code. Placeholders marked ⚠️ need Ihusan's product truth — do not let the builder invent them.**

---

## PART A — THE PERSONAS, IN THEIR OWN HEADS

### P1 · Graham, 58 — MD/owner, 14-staff brokerage (Dover & Felixstowe lanes). Warm from Multimodal.
Reads the hero: "up to 3× — sales maths" → the *pilot modelling, not a promise* footnote disarms him more than any claim could. Scene: recognises the job, smiles at OR NO ONE KEYS IT. Then he does what every owner does: scrolls to find **who these people are** — and hits `DECLARIX LTD · CO. TBC`. **He stops here.** "TBC" reads as *not actually incorporated*; he checks Companies House, finds nothing under that name, and parks the whole thing. Second thought: "if nothing is stored, where's my audit trail when HMRC knocks in 2029?" The page sells zero-retention as a win but never says who keeps the evidence for the record-keeping years. **Books only if: real company number + named founder + audit-trail line.** Current likelihood: ~40%. With fixes: ~90%.

### P2 · Sarah, 41 — Operations manager, freight forwarder, 11-clerk clearance desk, Manchester. Cold LinkedIn.
Hero and persona strip speak straight to her. Her block is operational: **the demo shows a pack in 4 minutes, the pilot promises one working day — so what's the real turnaround when 40 jobs land at 09:00?** The page never states a production SLA or how a *desk* (not a person) feeds it — shared inbox? forwarding rules? job refs preserved? She won't book on an unquantified promise; she'll email a question instead, and half of those emails never get sent. **Books if: a turnaround fact + one line on desk-level intake.** Current: ~55%. With fixes: ~90%.

### P3 · Priya, 49 — Head of customs, 30-staff AEO-accredited broker. Sent the link by her MD.
Evidence view wins her early — it's the first vendor page she's seen that respects the check. Then she catches a contradiction a compliance brain cannot un-see: the HS proposal card says *"reasoned from line descriptions **+ supplier history**"* — but Box 6 swears **nothing is stored**. *Whose history, kept where?* One sentence is quietly undermining the page's strongest claim. She also wants the audit-trail answer (same as Graham) and, ideally, where processing happens (UK/EU?). **Books to interrogate — but arrives sceptical unless the contradiction is fixed.** Current: ~60%. With fixes: ~90%.

### P4 · Tom, 44 — Commercial director, forwarder. Skims on his phone between calls.
Gets it in ten seconds: capacity he can quote against, margin on every declaration, growth card says *grow declarations, not payroll*. His only wish: one line connecting desk speed to **his customer's experience** (same-day clearance response wins him business). Forwards it to ops either way. Current: ~80%. With fixes: ~90%.

### P5 · Denise, 52 — Senior clerk, 15 years on Sequoia. The MD asks: "thoughts?"
Her lens: *does this make me redundant, or dump garbage on my desk to fix?* The FAQ respects her ("your name still on the entry") — but the old kicker's *for brokers, not instead of them* reassurance vanished in the hero rework, and the persona strip has a cell for her boss but not for her. Her unanswered question: **when the pack's wrong, what happens — do corrections stick, or does zero-retention mean it makes the same mistake every Tuesday?** ⚠️ She doesn't book (not her call) but she can veto. Neutral today; positive with one cell and one FAQ line.

### P6 · Mark, 47 — Finance director / co-owner. Gets the link with "shall we?"
The docket is written for him: £7.95 anchored, rate "sized against your £7.95", pilot capped at £500, *you keep the spreadsheet*. He'll test the £7.95 on the call — the page already invites that. No blockers. Current: ~85%. With fixes: ~90%+.

### The pattern
Nobody bounces off the value proposition anymore — the 3×/£-per-declaration rework did its job. What blocks booking now is **verification debris**: a TBC company number, a contradiction inside the trust story, a missing SLA, and a booking widget that breaks its own promise at the moment of commitment (see fix 1). Clean the debris and the 90% goal is realistic for five of six chairs (Denise doesn't book; she approves).

---

## PART B — FIX PASS (paste into Claude Code; bump ISSUE to 2.3)

**1 · The booking widget contradicts the CTA — highest priority.** The Zoho frame currently offers **"Product Demo · Ihusan Adam · 30mins."** Every button on the page promises *the 20-minute numbers call*, and the page explicitly promises numbers, not a demo. Rename the Zoho service to **"The 20-minute numbers call"**, set duration **20 minutes**, description: `Bring one week's real volume. We rebuild your cost-per-declaration live. You keep the spreadsheet.` Keep the host name visible. Wrap the iframe in the 1.5px ink border, mono `LOADING THE DIARY…` fallback.

**2 · Kill `CO. TBC`.** ⚠️ Insert the real company number — or, until registration lands, replace the line with: `DECLARIX · BUILT IN LEICESTER, ENGLAND · {{LINKEDIN}}`. Never ship "TBC" in the credibility block.

**3 · Name the founder — the widget already does.** Box 8 founder line becomes: `Declarix is built in the UK by {{FOUNDER_NAME}}, a PhD engineer who builds document-reading systems for regulated industries, and co-founder {{CO-FOUNDER_NAME}}. We'd rather prove it on your paperwork than pitch it on ours.` ⚠️ Ihusan approves names/wording. Link the name to LinkedIn.

**4 · Resolve the supplier-history contradiction.** ⚠️ Pick the true one and apply to the HS research card:
   a. `Reasoned from the line descriptions and the other documents in this job.` (if no cross-job memory), or
   b. `Reasoned from line descriptions and your desk's own reference data — shared per job, deleted with it.` (if desks supply reference files).
   Whichever is chosen, add one row to the Box 6 ledger: `DESK REFERENCE DATA ......... {{'NONE HELD' or 'SUPPLIED PER JOB, DELETED WITH IT'}}`.

**5 · Answer the audit trail inside the zero-retention story.** Add to Box 6 body, after "…the way a clerk can't.": `The pack and its evidence file are returned to you in full — yours to archive against HMRC's record-keeping years. We keep the nothing; you keep the everything.` (Trim to one sentence if it fights the rhythm; the ledger row `PACKS RETAINED — YOUR COPY ONLY` gets a sub-caption `INCLUDING THE EVIDENCE FILE, FOR YOUR RECORDS`.)

**6 · State production turnaround.** ⚠️ Needs the real number. Add a fourth node caption in Box 5's flow (under DECLARIX · MINUTES): `TYPICAL PACK-BACK: {{X}} MINUTES AT DESK VOLUMES` and one FAQ: **`What's the turnaround at 9am, not in a demo?`** → `{{Honest answer: typical minutes per pack at volume, what happens in a surge, and the pilot's one-working-day promise explained as a worst-case for ugly jobs.}}`

**7 · Desk-level intake, one line.** Under Box 5's `NO INTEGRATION PROJECT…` mono line, add: `ONE FORWARDING RULE ON THE DESK INBOX. JOB REFS SURVIVE THE ROUND TRIP.` ⚠️ Confirm true.

**8 · Give Denise her cell.** Persona strip becomes four cells, add: `SENIOR CLERK` — `You check, you approve, your name on the entry — minus the keying.` And one FAQ line under "Will my clerks need training?": ⚠️ `When a pack needs correcting, {{how recurring quirks are handled without storing data — Ihusan to supply the truthful mechanism}}.`

**9 · Hero polish.** Desktop H1 currently orphans the last word (`…the entries per / clerk.`): set `per&nbsp;clerk` so it breaks as `Up to 3× the entries / per clerk.` Use the true multiplication glyph `×` (U+00D7) everywhere `3x` appears, including nav. Restore the time-anchored body: `…checks it in minutes instead of keying it for the best part of an hour.` (sets up the ~50-min caption and the £7.95 docket).

**10 · Tom's line.** Growth card closing gains a second mono line: `SAME-DAY ANSWERS YOUR CUSTOMERS CAN FEEL.`

**11 · Verify the Multimodal bar** still renders (absent from this recording — possibly dismissed via sessionStorage; it must show for fresh sessions until 31 Jul).

**12 · Privacy page** — update the analytics/booking disclosure to name Zoho alongside PostHog, matching the footer.

Re-record after deploy. Part A's percentages are the scoreboard: the goal is every chair except Denise's at ~90%, and Denise nodding.

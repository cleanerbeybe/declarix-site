# Pack checker and registration acquisition stream

Date: 17 July 2026
Branch: `codex/seo-pack-registration-20260717`
Baseline: site `main` at `2ff69b5`

## Outcome

This stream turns two existing authority surfaces into reusable operational assets while preserving the homepage and its conversion flow.

- `/tools/customs-document-pack-check/` is now version 2.0: 24 browser-only prompts produce a P1–P3 action list with copy, print, share, and a route-specific path to the 20-minute numbers call.
- `/customs-intermediary-registration-2026/` is now the canonical response-kit page rather than a second, competing thin URL. It includes an ungated Markdown draft and CSV evidence matrix.
- Generic `LIMITATION` strips no longer sit under acquisition or commercial heroes. Detailed hero-adjacent boundaries remain on privacy, security, terms, and editorial-policy pages.
- `/pricing-policy/` now explains counting, rework, total cost, and pilot measurement from a buyer’s point of view.
- The publishing gate fails if an acquisition route or tool renders `LIMITATION`, `LEGAL`, or `GOVERNANCE` as a hero-adjacent strip.
- Claims-manifest documentation drift is corrected from 1.0.0 to 2.0.0.

## Files shipped

- `public/downloads/customs-intermediary-registration-response-draft-2026.md`
- `public/downloads/customs-intermediary-registration-evidence-matrix-2026.csv`
- Build-generated registration and pack-checker HTML, sitemap entries, `llms.txt`, `llms-full.txt`, and structured data.

## Marketing-first publication rule

Lead with the job, value, proof, and next action. Put an honest boundary beside the interaction or source it qualifies. Do not use legal, governance, or policy language as the first response to commercial intent.

## Related artifacts

- [Decision ledger](./DECISION-LEDGER.md)
- [Source register](./SOURCE-REGISTER.md)
- [Conversion rationale](./CONVERSION-RATIONALE.md)
- [QA record](./QA.md)
- [Follow-on work](./FOLLOW-ON.md)

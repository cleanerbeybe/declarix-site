# Dated registration response resource — draft PR21

Scope: one existing route and its two existing working downloads. No response is sent. No customer-data collection, new provider, paid service, release or account change is included.

## Source reconciliation

Checked 16 September 2026 from the full HMRC consultation and Standard landing page. The committed readable snapshots, exact metadata, source URLs and capture hashes are recorded in `source-check-2026-09-16.json`. Raw HTML captures are retained in the operating workspace under `reports/2026-09-16-build-trial/registration-sources/`; committed readable text has its own checksum.

The original resource already gave the correct 23 June publication date. This edition verifies that fact and explicitly separates it from the consultation period's stated 22 June start. The published response deadline recorded from the source is 21 September. No exact closing hour is invented. Source metadata public publication/update dates are not conflated with later backend update timestamps.

All 13 question themes were reconciled: organisation, business type, annual movements, intermediary roles, size, trading experience, benefits/challenges, scope, requirements, enforcement, transition, unintended consequences and other design considerations. The Markdown quotes each full official question, including role/size options. The CSV retains paraphrased themes and identifies them as such. Q5 uses the source's own wording, including its unclarified 250-employee boundary, rather than silently correcting it.

The route expands the proposal's exclusions precisely: advice with no HMRC interaction for traders; carriers meeting their own obligations without making/amending declarations for traders; trader self-representation. The Standard claim is limited to what the checked HMRC landing page says. No claim of reviewing the full PAS document or establishing present law is made.

## Static expiry safety

This edition is a dated source record, not a live open/closed status display. It carries a recorded deadline and directs readers to the official source before submission or reuse. It works unchanged after the recorded date without a rebuild, JavaScript, a clock or a scheduled deploy. Removing the route's build-time `expiresOn` field does not weaken another route's expiry guard. Downloads repeat source/date/deadline/reuse context so the notice survives a saved copy. Metadata uses the same edition and dated description. Global discovery retains its prior neutral URL-only entry; it makes no consultation status claim.

The original page edition date remains 16 July. The current source review date is 16 September. They describe different events.

## Preservation and checks

The registration contract supersedes only this path in the earlier selection and offer preservation manifests. Their original hashes remain historical evidence. Twelve other route objects and six homepage/booking/visual source files are pinned byte-for-byte. A small registration-only stylesheet fixes the pre-existing three-column resource header overflow below 1100 px; shared CSS and other pages are unchanged.

Unit tests cover dates, questions, snapshots, context removal, unsupported status claims, CSV parsing and preservation. Browser tests use the same built artifact at four viewport widths, with and without JavaScript, before/on/after the recorded deadline; they exercise real downloads, schema, source links, discovery, sitemap and automated accessibility. The static build validator checks the actual route and downloadable files.

This is an independently reviewable draft, not legal advice, whole-site clearance or release approval. Commercial, security, asset and publication gates remain separate. No merge, deployment or live verification is claimed.

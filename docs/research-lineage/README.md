# Research lineage correction — draft only, 16 September 2026

Scope: the July Declarix aggregate report, the separate HMRC/Ipsos Wave 2 explorer, and their two CSV/two SVG downloads. No new customer research, source refresh of the July records, company/contact rows, paid services or live changes.

## Evidence and limits

- `aggregate-evidence.json` contains only recomputed aggregate counts and input digests. Research agents classified evidence and a coordinating agent reconciled it. A separate human qualification/sign-off is not established. The private input files remain outside this repository. Aggregate arithmetic does not validate every original source or any current product assumptions.
- `hmrc-evidence.json` records the official report URL, file digest, dates and selected exact text excerpts for definitions, weight methods and question bases. The full official ODT text was checked. This is not a visual audit of every figure. Published 26 February 2026; quantitative fieldwork 21 October 2024–17 January 2025; 15 qualitative interviews are separate from 460 survey respondents.
- Time refers to active work for a typical process without major issues, not elapsed clearance time. Time/internal-cost ranges are trimmed means. Internal costs use activity times and wage data, not broker invoices. Automation is an approximate response, not a measured saving. Weighted mix is not raw counts; every process has a different question base. No direct 2023 trend comparison is supported.
- Neither dataset establishes Declarix customers, outcomes, buying intent, market size or delivered integrations.

## Portable format migration — release gate

The existing four download URLs remain unchanged in this draft. The CSVs now declare **schema 2.0** on every row and append source/date/method/reuse fields. The HMRC CSV now quotes every cell and gives explicit process bases. The upper-bound-only row has a blank lower endpoint, rather than suggesting zero was measured. Existing headline values are unchanged. Software consumers that depend on a fixed column count, unquoted fields, old denominator text or the previous zero lower bound must migrate. No backward compatibility is claimed.

Both SVGs change from 1200×630 to 1200×900 so the source/method limits are legible in the asset itself. Review downstream embeds and update dimensions before release. Keep the visible source and qualification text when reusing an asset.

Publication/consumer migration and existing commercial/security/legal gates remain separate. A passing test or code review does not clear the whole site or publish this draft.

## Gates

`npm run test:research`, `npm run test:research:browser`, `npm run test:research:mutations`, lint and full build. Tests reconcile fixed aggregates and original sources, check per-row provenance/denominators, check visible HTML/schema/discovery, exercise downloads with/without JavaScript at four widths, run WCAG checks, and measure SVG text clipping/overlap. Actual-built mutations must be rejected by the production verifier and restored. Compare unchanged built files against the prior reviewed head. Obtain separate exact-head review before merge; fix/retest/re-review material findings.

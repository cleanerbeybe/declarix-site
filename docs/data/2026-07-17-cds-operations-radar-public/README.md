# CDS Operations Radar public site release

**Date:** 17 July 2026

**Repository:** Declarix marketing site

**State:** production-ready static hub, five substantive record pages, and ungated JSON/CSV data

## Public experience

The release adds six indexable routes:

- `/research/cds-operations-radar/`
- `/research/cds-operations-radar/cds-service-status-current/`
- `/research/cds-operations-radar/cds-workarounds-release-5-2-0/`
- `/research/cds-operations-radar/cds-technical-documentation-2026-07-09/`
- `/research/cds-operations-radar/cds-document-code-9001-uk-india-fta-2026-07-15/`
- `/research/cds-operations-radar/cds-aggregation-eu-eori-2026-07-04/`

The hub supports local search plus topic, workflow, and freshness filters. Filter state is shareable
in the URL. Freshness is recalculated in the browser, so a retained record moves to stale,
expired, or not-yet-effective without pretending the build timestamp is live evidence.

Every record leads with the useful source fact, the workflow it may touch, and the next check. The
related tool/workflow and 20-minute call appear after that value. Source proof, freshness,
correction state, and append-only history remain visible without becoming a legal wall.

## Authority and distribution

- The hub exposes `CollectionPage`, `ItemList`, and breadcrumb structured data.
- Each record exposes `Article` and breadcrumb structured data with its official citation.
- No FAQPage or HowTo schema is emitted.
- All six routes are in the sitemap, `llms.txt`, `llms-full.txt`, internal navigation, and route
  verifier.
- `/downloads/cds-operations-radar-v1.json` and `.csv` are deterministic and ungated.
- Source, filter, record, download, related-action, share, and booking events are attribution-aware
  and exclude declaration or prospect fields.

## Durable evidence

- [Reference lock and decision ledger](./REFERENCE-LOCK.md)
- [Data provenance](./DATA-PROVENANCE.md)
- [Publication gate](./PUBLICATION-GATE.md)
- [Build, SEO, interaction, and visual QA](./QA.md)

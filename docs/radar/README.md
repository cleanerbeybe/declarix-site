# Radar dated archive (draft, 16 September 2026)

## Scope and evidence

This slice changes presentation and portable-data semantics, not HMRC evidence. The five observations remain at 17 July 2026 18:08:43 UTC. `july-source-records.json` preserves the previous exact record objects from `686db54`; tests pin source URLs, hashes, timestamps, history, corrections, review fields, title, summary and workflow impacts. No source refresh, active polling or current service-state check occurred. Previously recorded review/publication fields are historical evidence, not new release approval.

All six pages carry an immutable archive/reuse notice. Metadata says July archive, and the 16 September modification date means presentation change, not observation. The workaround next step no longer asserts release 5.2.0 is current. Other historical facts stay unchanged. Both discovery files use the dated Radar titles and descriptions. They identify the July archive and direct readers to current official sources; they do not claim live freshness.

## Optional browser-clock assessment

The static state is `archived_observation`. It never turns into a green live-current claim. JavaScript separately assesses timestamps with `freshnessState(record, explicitDate)`, then labels that result as a browser-clock assessment, not a source recheck. An incorrect browser clock can only alter this supplemental assessment; the archive notice remains. The function has no default clock or fixed July default. Before observation -> `before_observation`; before a later effective date -> `not_yet_effective`; at expiry -> `expired`; at fresh-until -> `stale`; otherwise -> `within_recorded_window` (not live). Invalid or inconsistent dates -> `unknown`. Freshness end and expiry are exclusive boundaries. No network or timer is added. Filters reassess on interaction, returning to the page, or restoring the tab. Without JS the filters/share control are hidden, all records and ordinary links/downloads remain available.

## Explicit breaking data migration: schema 2.0

Recommended URLs: `/downloads/cds-operations-radar-v2.json` and `.csv`.

Version 2 deliberately removes the ambiguous JSON `status: current`. It uses `record_state: archived_observation`, a source edition time separate from presentation modification, per-record/per-row reuse warnings, recorded timing and unchanged evidence. JSON includes history. `recorded_poll_interval_hours` is historical policy and `monitoring_active: false` prevents an implied live service.

**The existing `-v1.json` and `-v1.csv` paths serve the same explicitly marked version 2 archive payload in this draft. This is a breaking migration, not v1 backward compatibility.** Old links remain usable for people, but v1 machine consumers must migrate their field mapping and assert the new schema version. We do not continue serving an unsafe live-current payload. CSV adds version/state/reuse columns before the retained columns. Every detached row carries the context.

This decision must be assessed before release. The draft does not establish that external consumers exist, that they migrated, or that publication is approved. Previously saved v1 files cannot be changed remotely. Re-download the new version and check HMRC before use.

No merge/deployment, monitoring service, legal/security/commercial or whole-site approval is included.

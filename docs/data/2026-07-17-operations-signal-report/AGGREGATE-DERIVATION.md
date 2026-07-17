# Aggregate derivation contract

## Source of truth

The inputs were read from the core repository's dated Phase 2 UK national census package. Its durable artefacts include `analysis.json`, `coverage-ledger.csv`, `SOURCES.md`, `QA.md`, and `scripts/merge_and_audit_findings.py`.

No row-level artefact was copied into the public website repository.

## Published totals

| Aggregate | Count | Denominator | Published share |
| --- | ---: | ---: | ---: |
| Priority tier | 50 | 402 | 12.4% |
| Strong tier | 73 | 402 | 18.2% |
| Structural tier | 279 | 402 | 69.4% |
| Qualified ledger status | 402 | 1,203 | 33.4% |
| Excluded ledger status | 309 | 1,203 | 25.7% |
| Unresolved ledger status | 489 | 1,203 | 40.6% |
| Duplicate-alias status | 3 | 1,203 | 0.2% |
| Customs + workflow website terms | 469 | 854 | 54.9% |
| Customs-only website terms | 80 | 854 | 9.4% |
| Insufficient public-page signal | 305 | 854 | 35.7% |
| CMS-preservation product fit | 397 | 402 | 98.8% |

Percentages use `round(count ÷ denominator × 100, 1)` and may sum to 99.9% or 100.1% after independent one-decimal rounding.

## Reconciliation invariants

```text
50 + 73 + 279 = 402 qualified accounts
402 + 309 + 489 + 3 = 1,203 ledger decisions
469 + 80 + 305 = 854 website-discovery candidates
73 + 279 = 352 strong or structural qualified accounts
397 ÷ 402 = 98.8% CMS-preservation product fit
```

The generator and verifier recompute the first three equations. The verifier also compares the built CSV byte-for-byte with the CSV generated from the report data model.

## Evidence score

Each qualified account in the source research was rated 0–5 on five dimensions. The final score was:

```text
round((pain × 25 + product fit × 25 + timing × 20 + reachability × 15 + evidence quality × 15) ÷ 5)
```

The qualifying threshold was 65. Durable source tiers are:

- priority: 85–100;
- strong: 75–84;
- structural: 65–74.

The 397 CMS-preservation count is the number of qualified accounts whose `product_fit` dimension was 4 or 5. The public report explicitly frames this as a rubric result, not observed CMS usage, software market share, or a benchmark.

## Source-universe figures

- HMRC customs-agent register: 567 raw organisation rows; 550 normalized company candidates.
- BIFA Customs Services result: 195 location records; 180 company candidates.
- FIATA UK: 273 records; 272 company candidates.
- Deduplicated directory union: 854 companies.
- HMRC ETSF register: 699 active facility-code rows; 458 unique operators.
- ETSF reconciliation: 124 immediate matches; 334 separate gap-review operators.

Source-universe counts overlap. They are not added together or presented as market size.

# CDS Operations Radar — reference lock

**Locked before implementation:** 17 July 2026

## Design brief

Designing a source-stamped CDS operations-change hub and record view for customs brokers,
forwarders, declaration managers, and customs-software teams on the Declarix marketing site.

- **Goal:** let an operator understand what changed, which workflow may be affected, and what to
  check next before offering a relevant tool, workflow, or 20-minute call.
- **Tone:** premium operational paper, precise and useful; never legalistic or alarmist.
- **Main risk:** source provenance or publication gating displacing the useful answer and existing
  conversion hierarchy.
- **Constraint:** a record may enter the indexable build only when it is explicitly
  publication-ready through either named human review or an honestly labelled agent-source-
  verification gate for narrow primary-source facts, plus owner-authorized publication. Drafts and
  broader customs interpretations remain excluded.
- **Path:** direct build against the existing report/workpaper design system, followed by desktop
  and mobile browser QA.

## Source truth and reference lock

**Primary target:** the live Declarix Operations Signal Report and customs-value workpaper system
captured from current main.

Preserve:

- Archivo display and body typography with IBM Plex Mono for operational labels and metadata;
- deep-teal `#16313d` ink/docket, warm off-white paper, white field surfaces, amber breadcrumb
  band, and green reserved for primary conversion actions;
- 1 px rules, square or low-radius geometry, an asymmetric ledger/hero, and dense accessible
  tables;
- value-first hero order: change, workflow impact, next check, then source/freshness/correction;
- useful content before related tools and the 20-minute booking action; and
- 44 px targets, visible focus, accessible table overflow, reduced-motion-safe behaviour, and
  printable detail.

Borrow only:

- report-style operational tally bars for topic/status scanning; and
- workpaper-style source and review stamps for freshness and correction history.

Role rules:

- green is for the main commercial action, not freshness theatre;
- amber is navigation/manifest context, not a warning wash;
- status uses text, icons, and borders as well as colour;
- provenance belongs beside the claim it supports and in the record tail, not in a legal wall;
- record containers exist because they are searchable/selectable results, not as decorative cards.

Reject:

- rounded-card grids, indigo/violet, gradients, generic SaaS illustration, or soft-serif editorial
  redesign;
- FAQPage or HowTo structured data;
- dead/gated subscription forms, email walls, or private operational inputs;
- generic limitation, governance, compliance, or legal-contract copy beneath the hero; and
- a public “current” state when the observation is stale, expired, corrected, or unpublished.

## Decision ledger

| Decision | Source | Role preserved | Why |
| --- | --- | --- | --- |
| Extend the current Paper World route system | Existing live report/workpaper | Canvas, type, rule geometry, docket | Prevents aesthetic and conversion regression. |
| Put filter state in the URL | Refero craft guidance | Search/filter interaction | Supports sharing, back/forward navigation, and agent-readable state. |
| Use semantic result links and native controls | Refero craft guidance | Accessibility and browser behaviour | Preserves keyboard, command-click, and touch expectations. |
| Make source, observation, freshness, and correction visible after the useful answer | Foundation publishing boundary | Evidence/trust | Builds authority without replacing marketing. |
| Publish 5 narrow source-fact records after a same-day exact re-observation | User instruction + primary-source hashes | Truth and editorial gate | The owner explicitly authorized item 3; the gate labels agent verification honestly and reserves broader interpretation for human review. |
| Exclude drafts and reviewed-interpretation claims from the agent-only path | Core publication contract | Risk boundary | Agent verification cannot be represented as human customs/editorial review. |

## Visual QA target

- **Source truth:** current main report/workpaper pages and this lock.
- **Viewports:** 1440 × 900 and 390 × 844.
- **States:** hub/results, filters/search/no-result, record freshness/correction/history, downloads,
  related value action, booking action, keyboard focus, and print.
- **Release rule:** no unresolved P0, P1, or P2 issue. Production output must contain only records
  that pass the explicit publication gate; no source-verified drafts or agent-authored broader
  customs interpretations may leak into public routes.

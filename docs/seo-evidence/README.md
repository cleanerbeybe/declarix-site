# Declarix directory evidence adapter — review proposal

This adds an **offline, on-demand evidence gate** to the existing directory programme. It does not run that programme, change product copy, publish a page, create a schedule, or install a skill. It is not a new directory list or generic SEO skill.

## Why this exists

Ihusan's 29 October 2026 request (Telegram 27661, following audit 27650) asked for review PRs which explain the skill, workflow, prompt, evidence and rationale. The prompt source was the Indexsy video: https://x.com/indexsy/status/2115248306557477229 . Its saved automatic captions were not independently audio-verified. Source material is evidence, not authority to act.

The 28 October audit found prepared Declarix rows but no completed vendor-fact reconciliation or maintained citation evidence loop in the inspected records. A target list does not establish execution. The 29 October reconciliation also corrects an important approval distinction: the **handed-over copy** records D0, D1 and D6 as answered; the older source copy records all ten decisions open. Do not overwrite the handover's decisions with the older copy.

Private source records, referenced for the operator and **not committed**:

- Audit: `/data/clawd/reports/indexsy-practice-audit-20261028-owner27641/REPORT.md`.
- Assignment: `/data/clawd/reports/indexsy-gap-prs-20261029-owner27661/ASSIGNMENTS.md`.
- Current operating pack: `/data/declarix-chief/directory-pack-2026-10-16/`.
- Legacy reference pack: `/data/orchestrator-100k/seo-fork/submission-pack/`.
- Existing execution preflight: current pack `reports/2026-10-16{,-mailbox-preflight}.md`.
- Website custody: `/data/orchestrator-100k/seo-fork/STATE.md`; later recovered-access handoff `handover/aeo-ranked-pr-2026-10-25.md` there. The dated token failure in STATE is not a current access gate.

The committed `2026-10-29-pack-reconciliation.json` contains only aggregate counts and decision states. Both packs have the same 86 unchanged row records, all `todo`, zero recorded attempts and zero recorded live URLs. Only D0/D1/D6 decision records differ. These are **saved-pack facts**, not proof that Declarix has no listings anywhere. HaulierScope receipts are not Declarix receipts.

## Actual skill route and invocation points

Installed method read for this proposal:

- `/root/.agents/skills/agent-seo-blueprint/SKILL.md`.
- Its `workflows/authority-and-links.md`: step 2 directories/entity profiles, step 4 evidence, step 7 approval handoff.
- Its `references/playbooks/authority/directory-submissions.md`: first-party verification and post-submission evidence.
- Its `workflows/monitoring.md`: steps 5/8 leading-indicator snapshot and review.
- Product execution remains `/data/declarix-chief/skills/directory-submission/SKILL.md` plus the current pack's `HANDOVER.md`. Do not follow the old pack path printed inside that copied handover.

**Proposed entry:** at authority step 2, before promoting any prepared row; at step 7, before presenting evidence to the owner; and at monitoring steps 5/8, when re-reading saved listings. Read this adapter and run the commands below. **Exit:** save the dated JSON in the private task report and present a conflict/due-check decision with its evidence. Return to the same pack, approved identity and ordinary approval gates. Never execute an external action from this output.

No installed skill file is changed. Generic Agent SEO source extensions belong to Zara's separate review scope. This PR is a Declarix adapter, not evidence that that extension is installed or an ongoing loop is running. The skill's workspace status check returned **no workspace** at the existing SEO fork path. This task does not initialise one: get the required setup approval before creating a skill workspace. The commands here inspect existing files without that setup.

## Offline commands

Run from this checkout; Python standard library only. No dependency install, network call, browser, mailbox or schedule is used. Commands write JSON to stdout; redirects below must point to a **private report folder outside this public repository**.

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_directory_evidence.py' -v
python3 tools/directory_evidence.py reconcile \
  --legacy /data/orchestrator-100k/seo-fork/submission-pack/TRACKER.json \
  --current /data/declarix-chief/directory-pack-2026-10-16/TRACKER.json
python3 tools/directory_evidence.py followups \
  --tracker /data/declarix-chief/directory-pack-2026-10-16/TRACKER.json \
  --as-of 2026-10-29 --limit 5
python3 tools/directory_evidence.py inspect \
  --packet docs/seo-evidence/example/packet.json --as-of 2026-10-29
```

The committed packet and HTML are **synthetic**, with `.invalid` domains, not Declarix listing results. Date arguments are explicit so an old example does not silently become current evidence. There is no npm script, build hook, automatic invocation or CI/scheduler change.

## Vendor/public-fact reconciliation

1. Read current approvals and holds first. The current pack is the operating source. D0 covers approved free Nadia P1 then P2 rows with verbatim copy; D1 names the plus-test-first mailbox; D6 defines full-address versus city fields. D2 password provenance and D3 directory-list GitHub identity remain open; other decisions retain their own gates. A code-review PR is not D3 approval to submit directory-list PRs.
2. Build a private `approved_facts` record with the identity/approval revision and states for **name, website, address, city, phone and hours**. Each is `approved` with an exact value, `unknown`, or `not_provided`. Missing telephone or hours stay missing. The registered office is not a customer-facing branch. Do not invent local presence, a phone, opening hours, customers or endorsements.
3. For each vendor-claimed listing, save its report claim separately from an observation of the actual public URL. A vendor's success badge is not public evidence. Capture access state, final URL, page bytes, UTC time, exact observed fields, visible anchor/href/rel, and indexability observations. Use `present`, `missing`, `gated`, `unavailable` or `unknown`; a failed load is not proof of deletion. The adapter reads saved artifacts only; collecting them is a separate permitted step, not done by this PR.
4. Keep captures immutable in a private dated folder, use relative capture paths, and record SHA-256 of the exact saved bytes. Include `capture`, `sha256`, `captured_at`, `url`, `listing_state`, `fields`, optional `link` and `indexability`. Save both vendor report and public capture references in the private packet; never commit them by default. The tool checks capture bytes and compares **operator-extracted facts**. It does not parse a rendered page or certify the extraction.
5. Run `inspect`. Exact matches remain matches. Formatting differences remain conflicts for human review, not automatic repairs. Unknown approved fields are not inferred from another business. A name conflict plus a website/address/phone conflict flags an old-business candidate; it is not an identity verdict. Preserve both sources and ask for the exact correction decision. Never edit an unidentified listing or repeat a refused submission.
6. Human review uses `{id, evidence_key, decision, reviewed_by, reviewed_at}`. Allowed decisions are `accepted`, `needs_correction`, `rejected`. Copy the evidence key from the inspected packet only after examining the capture and extracted facts. Retain reviews in an append-only private archive; the active packet contains at most one review per row. The key covers approved-fact revision/values, URL, capture digest/time and the entire observation. New bytes or changed facts make the prior review **stale**, never silently re-approved. Missing rows expose orphan reviews. A review before the capture is stale.
7. Freshness is explicit: default maximum 30 days, configurable 1–90. A byte-identical capture can still age out. `usable_review` means only a current review of evidence inside that window; it does **not** mean approved submission, accurate extraction, successful listing, or permission to write. Always inspect the decision, conflicts and unknown fields separately.

## Citation discovery and fit — no bulk target expansion

Use the existing 86-row pack, not a second target sheet. For a future permitted discovery check, attach private candidate evidence to its existing row (or queue a deduplicated proposal for review):

| Input | Required evidence and boundary |
|---|---|
| Industry/city directory | Destination-owned eligibility, UK customs/freight/software buyer fit, public sample, terms/cost and duplicate check. A city field is not proof of a physical branch. |
| Competitor business phone/address search | Public **business** source URL and observed date, query used, resulting citation URL, and a stated Declarix audience reason. Never use personal, home, provider, customer or private contact records. Never copy another firm's identity fields into Declarix facts. |
| Community/school/sponsorship prospect | Genuine product, audience and local fit; reason the organisation benefits; current terms, price, disclosure and appropriately qualified paid links. Online-only software does not automatically fit a local sponsorship. Poor fit is excluded; qualified fit remains a proposal. Exact outreach and spend need explicit approval. |
| Profile/social candidate | A real public entity/customer use case, not a thin account or a bulk “pillow link” quota. No fake reviews, offices or followed-link purchase scheme. |

These checks produce owner-ready evidence and reasons, **not** sends, accounts, listings or an extra cold-email workflow. No live discovery was run for this PR.

## Follow-up and listing survival

`followups` checks `submitted`, `pending_review`, `pending_email` and `live` rows. It exposes missing, invalid, past and due-today `next_check` dates. Future dates are left alone. `todo` rows are not falsely counted as overdue submissions. The queue is capped at five by default (maximum ten); `deferred_count` shows the rest. There is no resubmission, automatic date rewrite or schedule.

For each queued row: inspect its original receipt and holds; propose one read-only public check if allowed; compare new bytes and facts to the prior capture; retain the prior review as stale if changed; save the result and a justified next date through the pack's existing tracker procedure. Missing pages require diagnosis, not repeat submission. Preserve the product handover's day 7/21/45 review ladder and stop rules; do not copy HaulierScope's different cap or decisions.

The current Declarix pack produces **zero due listing checks** because all 86 rows are `todo`. This does not close the programme. The 16 October SMTP/IMAP failures did not establish that webmail is blocked. An authorised execution resumption must use the normal mail-tool/web route before an account-setting conclusion, verify the plus test and resolve password provenance. This review request authorises none of those external actions.

## Report distinct states

| State | What establishes it |
|---|---|
| Method documented | This review proposal, not installation/adoption. |
| Adapter tested | Offline regressions and saved-pack dry run, not a real vendor reconciliation. |
| Attempt | Actual dated action receipt, not a prepared row. |
| Submitted | Destination confirmation, not a filled form. |
| Public listing / link / rel | Dated public capture and human review, not a vendor badge. |
| Indexability | Captured access/robots/canonical facts; not indexation. |
| Search-engine indexation | **Unknown in this offline adapter.** It rejects other values. Separate appropriate search-engine evidence and manual interpretation are required; HTTP 200, no `noindex`, or a `site:` result count is not proof. No indexing service/request is authorised. |
| Traffic, leads, revenue | Separate dated analytics/business evidence, not a listing, citation or causal ranking claim. |

## Adoption and review gates

This branch changes docs, synthetic fixtures, a standalone tool and its tests only. No site/runtime/public copy, npm manifest, deployment workflow, installed skill, operational tracker, identity, approval or hold is changed. SEO lead retains site/release custody; existing PRs 18 and 27 remain separate. No merge or deployment is authorised, including the automatic main-branch Pages/IndexNow path.

Before adoption: independent code/workflow review; source custodian's normal integration decision; private fact/capture preparation and human review; any required workspace setup approval. Before execution: the existing outbound/D&D holds and exact per-action gates still apply. No new Henry acceptance loop is required. Real vendor reconciliation, real follow-up, public listings, indexation and business outcomes remain unverified by this change.

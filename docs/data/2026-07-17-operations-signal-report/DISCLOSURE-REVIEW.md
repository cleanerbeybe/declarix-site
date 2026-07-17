# Publication and disclosure review

## Decision

**Approved for aggregate-only publication.**

The public layer contains category counts, denominators, percentages, definitions, source-universe methods, and snapshot dates. It does not contain a directory or any row capable of identifying a researched account.

## Explicitly excluded

- company or trading names;
- candidate IDs, ledger IDs, source row IDs, or aliases;
- domains, websites, source URLs tied to a company, or vacancy links;
- personal or role email addresses and phone numbers;
- public-channel or personalized outreach notes;
- evidence excerpts, fit rationales, timing rationales, and cautions tied to a company;
- location cells that could expose small clusters;
- private, gated, authenticated, or sensitive data.

The four top-level source-register links are publisher directories/registers, not company-level source rows.

## Public CSV schema

The exact allowed columns are:

```text
group, metric_id, label, count, denominator, percent, definition, snapshot_date
```

The deterministic verifier rejects an unexpected header and scans for row-level field names, URLs, and email-like content. The built CSV must also match the generated aggregate data model exactly.

## Small-cell treatment

The report does not publish a geographic table. The duplicate-alias aggregate of three is safe because it describes data reconciliation, not people, companies, locations, or commercial behavior.

## Claims discipline

- “Census” is qualified as the documented public-source universe and dated snapshot.
- “Qualified” means the source research evidence threshold, not buyer intent or product use.
- Website terms routed manual review and never auto-qualified an account.
- CMS preservation is a product-fit rubric result, not market share.
- No causal, conversion, revenue, or performance conclusion is drawn from the account census.

## Collection review

The report has no form, email capture, file input, newsletter signup, or free-text field. Events contain only event name, page path, report ID, asset ID/format, destination ID, and placement/method enums.

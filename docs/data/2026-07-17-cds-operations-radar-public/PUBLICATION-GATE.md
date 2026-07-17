# Site publication gate

The production generator and verifier both fail closed unless every Radar record is explicitly
publication-ready. The five released records use:

- `state: agent_source_verified`
- `reviewerKind: agent`
- named reviewer `codex-radar-source-verifier`
- `publicationScope: narrow_primary_source_fact`
- `editorialAuthorization: owner_authorized_build`

This is intentionally not labelled as human customs review. A record reviewed only by an agent
cannot enter the site with a broader interpretation scope. Drafts, missing reviewer identity,
missing authorization, changed source bytes, or fabricated human-review language fail the release
contract.

The site verifier additionally checks every record for:

- exact official source URL, retained SHA-256, byte count, and two bounded workflow impacts;
- freshness/correction/source/history UI;
- Article and breadcrumb schema without FAQPage or HowTo;
- post-value related and booking actions; and
- deterministic public JSON/CSV parity.

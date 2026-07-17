# Decision ledger

| ID | Decision | Why | Guard |
|---|---|---|---|
| SITE-EORI-01 | Render the page only when an explicit release flag and API origin are both present. | A merged page must not become a dead or guessed checker while infrastructure is incomplete. | Generator and verifier share the strict config parser. |
| SITE-EORI-02 | Send raw input only in a credential-free POST body. | URLs, storage and analytics are wrong places for identifiers. | No query serialization; `credentials=omit`; `cache=no-store`. |
| SITE-EORI-03 | Treat the API's typed format and registry states separately. | GB-shaped text is not evidence of registration. | Browser contract assertion plus copy/schema build guards. |
| SITE-EORI-04 | Use text nodes for all response content. | Holder-published names and addresses are untrusted strings. | No response-backed `innerHTML`. |
| SITE-EORI-05 | Put source and timestamps inside the answer surface. | Freshness and provenance help the result without turning the hero into governance copy. | Result ledger always renders its source record. |
| SITE-EORI-06 | Give XI/EU users an official handoff before and within the unsupported result. | The HMRC endpoint checks GB values; other prefixes are not automatically invalid. | European Commission source link is build-verified. |
| SITE-EORI-07 | Keep the result ungated. | Utility, trust, links and conversion all depend on delivering the answer first. | No email input or newsletter form exists on the page. |
| SITE-EORI-08 | Preserve current Paper World rather than inventing a tool UI. | Visual continuity protects the site's quality and conversion system. | The reference lock and desktop/mobile screenshots govern review. |

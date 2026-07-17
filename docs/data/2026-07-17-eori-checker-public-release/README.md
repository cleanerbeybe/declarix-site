# Free GB EORI checker release candidate — 17 July 2026

This package records the complete static-site release candidate for
`/tools/eori-checker/`. The page checks one value through the Declarix server-side HMRC proxy and
never manufactures registry validity from a browser pattern check.

## Visitor value

- one immediately visible GB EORI field;
- a current HMRC registry-valid or registry-invalid result when HMRC answers;
- distinct format-invalid, XI/EU handoff, provider-unavailable and public-rate-limit states;
- normalized value, Declarix check time, HMRC processing time and official source beside the answer;
- holder-published trader details only when the API supplies them;
- an ungated result followed by the free pack checker and 20-minute numbers-call paths.

## Release switch

The route is absent from output, navigation, canonical inventory, sitemap and `llms.txt` by default.
Publishing requires both repository variables:

```text
PUBLIC_EORI_RELEASE_ENABLED=true
PUBLIC_EORI_API_ORIGIN=https://the-verified-dedicated-service-origin
```

The site generator refuses ambiguous booleans, non-HTTPS public URLs, credentials, paths, queries
or fragments. A localhost HTTP origin is accepted only for local QA.

## Current boundary

**Built and locally QAed; not published.** The variables must remain unset until the dedicated API
service passes the core repository's immutable-image, CORS, IAM, rate, no-store, registry and
privacy acceptance suite.

# Publication gates and rollback

## Before setting repository variables

- Dedicated minimal public-tools service deployed from the recorded core merge digest.
- Service URL read from Cloud Run rather than inferred from its name.
- Exact `https://getdeclarix.com` preflight and POST CORS pass; foreign origin fails.
- Registry-valid, registry-invalid, format-invalid, XI, provider-unavailable and 429 contracts pass.
- `Cache-Control: no-store` survives the application and edge.
- `max-instances=1` and unauthenticated invoker policy are confirmed.
- Application and edge logs contain no EORI, trader name or address.

## Site release acceptance

- Enabled build verifies 19 unique indexable routes; dormant build verifies 18.
- Live EORI route has one H1, exact canonical, WebApplication/Breadcrumb JSON-LD, no FAQPage or
  HowTo schema, and appears once in sitemap and `llms.txt`.
- Desktop and mobile initial, valid-with-details, valid-without-details, invalid, unsupported,
  unavailable and rate-limit states have no overflow or P0–P2 visual issue.
- Pack-checker and booking CTAs preserve attribution and emit only documented coarse events.
- Homepage copy, booking count and existing authority routes remain unchanged.

## Rollback

Set `PUBLIC_EORI_RELEASE_ENABLED=false` and redeploy the site. This removes the route and its links
from the generated static output while leaving the API service available for diagnosis. Never
replace an unavailable registry answer with browser format validation.

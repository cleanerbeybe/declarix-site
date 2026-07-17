# Local QA evidence

## Deterministic builds

```text
npm run build
Verified 18 indexable routes ...

VITE_PUBLIC_EORI_RELEASE_ENABLED=true \
VITE_PUBLIC_EORI_API_ORIGIN=http://127.0.0.1:4010 npm run build
Verified 19 indexable routes ...
```

The release-enabled verifier asserts one text input, POST-only endpoint wiring, `credentials=omit`,
`cache=no-store`, every result and conversion event, official handoff, WebApplication schema,
visible questions, no restricted FAQPage/HowTo schema, no prohibited validity/endorsement copy,
exact API-origin serialization, internal links and non-orphan status.

## Browser and visual QA

Playwright ran against the release-enabled build at 1180px desktop and 390×844 mobile using a local
typed API fixture. Covered:

- initial page and one-field form;
- registry-valid with and without public company details;
- registry-invalid;
- valid format plus provider unavailable;
- HTTP 429 rate-limited;
- malformed GB format not checked;
- XI unsupported with European Commission handoff;
- source/timestamp ledger, pack-checker CTA and 20-minute numbers-call CTA;
- no horizontal overflow at 390px; Archivo and the established deep-teal Paper World tokens loaded;
- no unexpected console errors (the deliberate 429 produced the browser's expected failed-resource
  line only).

The first browser pass found a timestamp-rendering exception caused by combining `dateStyle` with
`timeZoneName`. The formatter was corrected to explicit date/time fields, the build reran, and all
states then rendered successfully.

Visual result: **pass, with no unresolved P0/P1/P2 finding.** Screenshots were reviewed locally;
temporary QA images are not committed as public evidence because they use synthetic holder data.

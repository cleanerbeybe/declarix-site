# Follow-on

## Customs Operations Brief newsletter

No real subscription provider, list endpoint, or delivery workflow exists in either repository as of 17 July 2026. Do not ship a fake email form.

Provider-ready contract for a future implementation:

- Name: **Customs Operations Brief**.
- Placement: after a useful checker result and after the registration-kit downloads; never before value.
- Offer: a short update when an official source materially changes, plus one practical customs-desk workflow note.
- Gate: none. Checker results and downloads remain fully accessible without subscribing.
- Fields: email only for the first release.
- Consent: explicit unchecked consent tied to named content and frequency; link to privacy notice; store timestamp, source route, consent-copy version, and provider status.
- Success state: confirm subscription status without implying delivery before the provider accepts it.
- Failure state: preserve the result/download and show a recoverable error; never make the asset conditional on the request.
- Events: `newsletter_offer_viewed`, `newsletter_submitted`, `newsletter_confirmed`, `newsletter_failed`, `newsletter_unsubscribed`; never place the email address in `dataLayer` or analytics.
- Attribution: route, placement, asset/tool ID, and campaign values only.

Provider acceptance criteria:

1. API or hosted form supports verifiable consent records and unsubscribe.
2. Domain authentication and sender identity are configured.
3. A real list and welcome/update sequence exist.
4. Spam protection does not collect document or declaration data.
5. Success, failure, duplicate, and unsubscribe states can be tested end to end.

## Product and authority follow-on

1. Promote the registration kit through industry bodies, freight/customs newsletters, software partner resource pages, and consultation round-ups while the source is open.
2. Add a post-deadline outcome tracker after HMRC publishes the response summary; do not leave the “open” framing live.
3. Add a printable one-page pack-intake sheet only if user evidence shows the full 24-row workpaper is too long for daily stand-ups.
4. Measure checker completion → copy/print/share → booking, and registration page → asset download → booking before changing CTA density.
5. Use aggregate open-priority patterns to improve tool copy only; never collect the actual prompt text or customer pack facts.

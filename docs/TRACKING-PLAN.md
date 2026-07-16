# Declarix website tracking plan

Updated: 2026-07-16

## Decision contract

The site measures whether qualified visitors reach a workflow conversation. Events must support a
specific acquisition, conversion, or content decision. Analytics must never include customs-document
data, email addresses, names, EORIs, free-text enquiry content, or booking-form field values.

The browser always writes documented events to `window.dataLayer` so releases can be tested without
an analytics account. Network capture runs only when the `POSTHOG_KEY` repository variable is set.
The anonymous identifier is session-scoped.

## Events

| Event | Decision | Properties | Trigger |
|---|---|---|---|
| `$pageview` | Which routes and sources attract qualified visits? | source, medium, campaign, content, term, referrer_host, page_path | Homepage application starts |
| `cta_book_click` | Which placement moves visitors toward a call? | source, mode when external, page_path | Visitor selects a booking CTA |
| `booking_reveal` | Do visitors commit to opening the live diary? | source, page_path | Visitor asks to see available times |
| `booking_frame_load` | Is the provider loading successfully? | provider, source, page_path | Zoho iframe mounts |
| `booking_completed` | Which acquisition source produces a booked call? | provider, source, campaign, page_path | Zoho redirects to `/booking-confirmed/` |
| `cta_pack_mailto` | Which source produces a secure-pack enquiry? | source, page_path | Visitor opens the prepared enquiry email |
| `copy_pack_email` | Do visitors prefer copying the inbox? | source, page_path | Visitor copies the address |
| `volume_model_change` | Is the measurement model used? | entries, annual_entries, preset, source | Visitor changes the workload input |
| `scene_complete` | Does the long-form product explanation retain attention? | source, page_path | Desktop evidence scene completes |

## Attribution

Supported query parameters are `src`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and
`utm_term`. First-touch values persist for the browser session. Static-route booking links return to
the homepage with a route-specific `src` value before the third-party diary is loaded.

## Deployment closure

1. Set `POSTHOG_KEY` and, if needed, `POSTHOG_HOST` in GitHub repository variables.
2. Set `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` after creating the webmaster accounts.
3. In Zoho Bookings, set the successful-booking redirect to
   `https://getdeclarix.com/booking-confirmed/`.
4. Validate all events in a browser release QA and in the destination platform before using them for
   commercial decisions.

# Analytics contract

The page always emits documented events to `window.dataLayer`. Network capture occurs only when the
existing PostHog environment key is configured.

| Event | Safe properties |
|---|---|
| `tool_started` | tool ID, page path, session attribution |
| `tool_completed` | customs-value band, non-unit-FX flag, adjustments flag, duty-rate-present flag, VAT-rate-present flag |
| `tool_result_shared` | completion properties plus share method |
| `tool_result_printed` | completion properties |
| `tool_booking_clicked` | completion properties, or `result_generated: false` |

Raw goods amounts, exchange rates, additions, deductions, charges, percentage rates, calculated
outputs, and generated share URLs must never be sent to analytics. Names, email addresses, EORIs,
document content, commodity codes, origins, and free text are not collected by the workpaper.

The explicit share link contains the ten visible inputs because that is its user-requested function.
It removes attribution parameters before copying and is not generated or transmitted until Share is
selected.

# Analytics contract

All events always reach `window.dataLayer`. Network delivery remains subject to the existing PostHog
deployment configuration.

| Event | Trigger | Permitted properties beyond attribution, tool ID, and page path |
|---|---|---|
| `tool_started` | First input change | None |
| `tool_completed` | Valid model submission | `weekly_volume_band`, `current_minutes_band`, `target_reduces_minutes` |
| `tool_result_copied` | Share link copied | `result_type=share_link` |
| `tool_result_printed` | Print/save selected | `result_type=desk_model` |
| `tool_booking_clicked` | Numbers-call CTA selected | `weekly_volume_band`, `target_reduces_minutes` |

## Privacy boundary

Do not transmit raw weekly volume, current minutes, target minutes, hourly cost, working weeks,
calculated costs, calculated capacity, the generated share URL, names, emails, EORIs, identifiers,
documents, or free text. Bands are:

- weekly volume: `1_49`, `50_149`, `150_499`, `500_plus`
- current minutes: `under_15`, `15_29`, `30_59`, `60_plus`

The share URL contains the five visible model inputs only after a visitor asks to copy it. That URL
is never sent as an analytics property.

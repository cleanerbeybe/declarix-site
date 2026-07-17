# Analytics contract

The page emits:

| Event | Allowed result properties |
|---|---|
| `eori_check_started` | `checker_scope=single_gb` |
| `eori_check_completed` | enum `outcome`; boolean `public_company_details` |
| `eori_check_unavailable` | enum-like `reason` |
| `eori_result_booking_clicked` | `outcome`, CTA `placement` |
| `eori_result_pack_checker_clicked` | `outcome`, CTA `placement` |
| `eori_eu_handoff_clicked` | link `placement` |

Every event also receives the established first-touch attribution fields, tool ID and page path.
No event receives entered or normalized EORI, trader name, address, message, timestamps, response
body, free text or URL containing a result. Local browser QA inspected all six result attempts in
`window.dataLayer`; only the documented coarse fields appeared.

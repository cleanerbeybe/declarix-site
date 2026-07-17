# Release inventory

## Routes

- `/customs-reference/incoterms/`
- `/customs-reference/incoterms/fob/`
- `/customs-reference/incoterms/cif/`
- `/customs-reference/incoterms/dap/`
- `/customs-reference/incoterms/fca/`
- `/customs-reference/incoterms/ddp/`
- `/research/hmrc-customs-administrative-burden-explorer-2026/`
- `/customs-workflows/gmr-gvms-checklist/`
- `/customs-workflows/postponed-vat-accounting-checklist/`
- `/customs-workflows/ipaffs-import-notification-checklist/`
- `/customs-workflows/ens-ics2-entry-summary-declaration-checklist/`
- `/customs-workflows/duty-deferment-account-checklist/`
- `/customs-workflows/t1-ncts-transit-checklist/`

## Downloads

- `/downloads/incoterms-{fob,cif,dap,fca,ddp}-operational-map.svg`
- `/downloads/{workflow-slug}-workflow.svg` for all six workflow routes
- `/downloads/hmrc-customs-burden-wave-2-summary.csv`
- `/downloads/hmrc-customs-burden-wave-2-chart.svg`

## Measured actions

- `authority_chooser_completed`
- `authority_asset_downloaded`
- `authority_related_clicked`
- `authority_booking_clicked`

All events carry only route attribution and coarse enum-like action properties. No customs values,
document contents, identifiers, names, emails, or free text are transmitted.

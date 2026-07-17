# Formula contract

All ten inputs are required, user-supplied, non-negative numbers. Nothing is fetched or inferred.

## Inputs

1. Goods price or amount in the invoice currency.
2. Invoice-currency units per £1, matching HMRC's published monthly-table direction; enter `1` when
   the goods amount is already GBP.
3. Freight, loading and handling included in the customs value, in GBP.
4. Insurance included in the customs value, in GBP.
5. Other established customs-value additions, in GBP.
6. Established permitted deductions, in GBP.
7. Ad valorem duty percentage.
8. Other import charges excluding import VAT, in GBP.
9. Relevant import-VAT incidental expenses not already in customs value, in GBP.
10. Import VAT percentage.

## Equations

```text
converted_goods = goods_amount ÷ invoice_currency_units_per_gbp
net_adjustments = additions − deductions
customs_value_raw = converted_goods + freight + insurance + net_adjustments
customs_value = max(0, customs_value_raw)
ad_valorem_customs_duty = customs_value × duty_rate ÷ 100
import_vat_value = customs_value + customs_duty + other_import_charges + incidental_expenses
import_vat = import_vat_value × vat_rate ÷ 100
duties_and_taxes = customs_duty + other_import_charges + import_vat
planning_total = customs_value + customs_duty + other_import_charges + incidental_expenses + import_vat
```

The UI rejects a negative raw customs-value build-up instead of presenting the clamped zero as a
usable result. The clamp remains in the pure calculation function as a defensive arithmetic boundary.
This version applies an ad valorem percentage only; it does not calculate specific or compound duties.

Supported amount inputs are capped at £100,000,000 (or 100,000,000 invoice-currency units). The
currency-units-per-£1 input is bounded from 0.0001 to 1,000,000. These bounds keep all supported
percentage scenarios within a range that preserves pennies when formatted to GBP. The verifier tests
the upper conversion boundary with a one-penny addition and rejects inputs above the supported range.

## Deterministic fixture

Inputs: goods `10000`, currency units per £1 `1.25`, freight `500`, insurance `100`, additions `400`, deductions `200`,
duty `5%`, other charges `60`, VAT incidental expenses `200`, VAT `20%`.

Expected outputs: converted goods `8000`; net adjustments `200`; customs value `8800`; duty `440`;
import VAT value `9500`; import VAT `1900`; duties and taxes `2400`; planning total `11400`.

This fixture runs in `scripts/verify-build.mjs`. The browser receives the same pure calculation
function by source serialization, preventing a second formula implementation from drifting.

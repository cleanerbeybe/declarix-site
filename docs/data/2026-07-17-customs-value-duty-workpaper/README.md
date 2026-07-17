# Customs value, ad valorem duty and VAT planning workpaper

Status: implemented on a temporary branch from `origin/main` at `bd7b6fc`, including the live
Operations Signal Report and commercial-site FAQ-schema eligibility hotfix.

Public route: `/tools/customs-value-import-duty-vat-calculator/`

## Outcome

This release adds an ungated, browser-only workpaper for a user-controlled UK customs value, ad
valorem duty, import VAT value, and import VAT planning scenario. It is an acquisition asset first:
the useful calculation leads, the result is shareable and printable, and the next step connects the
number to desk economics and a 20-minute numbers call.

The tool does not choose a valuation method, exchange rate, commodity code, origin, preference,
relief, tariff measure, duty rate, or VAT rate. Those decisions stay with the user and current
official sources. Specific and compound tariff measures are explicitly outside this version.

## Durable records

- `FORMULA-CONTRACT.md` — the input and calculation contract.
- `SOURCE-REGISTER.md` — official primary sources and the claims each supports.
- `DECISION-LEDGER.md` — product, design, conversion, and schema decisions.
- `ANALYTICS.md` — coarse event contract and data exclusions.
- `SEO-CRO-RATIONALE.md` — search intent and conversion path.
- `LIMITATIONS.md` — explicit local result boundaries.
- `QA.md` — commands, browser cases, and release evidence.
- `FOLLOW-ON.md` — merge-sensitive and later distribution work.

## Regression rule

Acquisition and conversion copy must lead on marketing pages and free tools. Governance, legal,
source, and calculation boundaries belong beside the claim or result they qualify, in the source
register, or in the dedicated policy pages. They must not replace, dilute, or sit as a legalistic
strip directly beneath the acquisition hero.

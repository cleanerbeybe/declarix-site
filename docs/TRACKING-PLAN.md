# Declarix website tracking plan

Updated: 2026-07-17

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
| `tool_started` | Do visitors engage with the pack workpaper? | tool_id, source, page_path | First checklist interaction |
| `tool_completed` | How far do visitors map the handoff? | tool_id, mapped_count, open_count, attention_groups, priority_one_open_count, source | Visitor reviews the workpaper |
| `tool_result_copied` | Is the prioritised output useful? | tool_id, open_count, source | Visitor copies the action plan |
| `tool_result_shared` | Is the checker useful enough to pass to a colleague? | tool_id, open_count, method, source | Visitor shares the checker or copies its link |
| `tool_result_printed` | Is the workpaper used off-site? | tool_id, mapped_count, source | Visitor prints or saves the workpaper |
| `tool_booking_clicked` | Does the tool assist a workflow call? | tool_id, mapped_count, source | Visitor selects the tool booking CTA |
| `tool_started` | Do visitors engage with the desk economics calculator? | tool_id, source, page_path | First calculator input change |
| `tool_completed` | Do visitors produce a buyer-controlled desk model? | tool_id, weekly_volume_band, current_minutes_band, target_reduces_minutes, source | Visitor updates the model |
| `tool_result_copied` | Is the calculator useful enough to share? | tool_id, result_type, source | Visitor copies a share link |
| `tool_result_printed` | Is the calculator used in an internal decision? | tool_id, result_type, source | Visitor prints or saves the model |
| `tool_booking_clicked` | Does the calculator assist a numbers call? | tool_id, weekly_volume_band, target_reduces_minutes, source | Visitor selects the calculator booking CTA |
| `operations_report_downloaded` | Which report asset earns downstream use? | report_id, asset_id, asset_format, source, medium, campaign, content, term, page_path | Visitor downloads the aggregate CSV or press chart |
| `operations_report_booking_clicked` | Does original research assist a numbers call? | report_id, placement, source, medium, campaign, content, term, page_path | Visitor selects a report booking CTA |
| `operations_report_related_clicked` | Which free workbench route does report traffic choose? | report_id, destination_id, source, medium, campaign, content, term, page_path | Visitor opens a related tool or kit |
| `operations_report_methodology_viewed` | Do readers inspect the research method? | report_id, placement, source, medium, campaign, content, term, page_path | Visitor selects the methodology action |
| `operations_report_shared` | Is the report useful enough to distribute? | report_id, method, source, medium, campaign, content, term, page_path | Visitor completes native share or copies the report link |
| `tool_started` | Do visitors engage with the customs value and duty workpaper? | tool_id, source, page_path | First value, rate, or charge input change |
| `tool_completed` | Do visitors produce a customs value and duty planning scenario? | tool_id, customs_value_band, non_unit_fx, has_adjustments, has_duty_rate, has_vat_rate, source | Visitor builds a valid scenario |
| `tool_result_shared` | Is the value and duty scenario useful enough to pass to a colleague? | tool_id, customs_value_band, non_unit_fx, has_adjustments, has_duty_rate, has_vat_rate, method, source | Visitor explicitly shares or copies a scenario link |
| `tool_result_printed` | Is the value and duty workpaper used in a review? | tool_id, customs_value_band, non_unit_fx, has_adjustments, has_duty_rate, has_vat_rate, source | Visitor prints or saves the scenario |
| `tool_booking_clicked` | Does the value and duty scenario assist a numbers call? | tool_id, customs_value_band, non_unit_fx, has_adjustments, has_duty_rate, has_vat_rate, source | Visitor selects the workpaper booking CTA |
| `registration_kit_downloaded` | Which consultation asset delivers value? | page_path, asset_id, asset_format | Visitor downloads an editable response-kit file |
| `registration_kit_booking_clicked` | Does the response kit assist a workflow call? | page_path, placement | Visitor selects a kit booking CTA |
| `eori_check_started` | Do search visitors use the single-value GB registry check? | tool_id, checker_scope, source, medium, campaign, content, term, page_path | Visitor submits one candidate to the checker |
| `eori_check_completed` | Which useful registry outcome did the checker return? | tool_id, outcome, public_company_details, source, medium, campaign, content, term, page_path | A typed valid, invalid, format-invalid, or unsupported response renders |
| `eori_check_unavailable` | Is provider or edge reliability losing useful checks? | tool_id, reason, source, medium, campaign, content, term, page_path | Rate limit, upstream unavailable, network, or contract failure renders |
| `eori_result_booking_clicked` | Does an EORI result assist a workflow call? | tool_id, outcome, placement, source, medium, campaign, content, term, page_path | Visitor selects an EORI-page booking CTA |
| `eori_result_pack_checker_clicked` | Does EORI traffic continue into the document handoff tool? | tool_id, outcome, placement, source, medium, campaign, content, term, page_path | Visitor opens the pack checker from the EORI page |
| `eori_eu_handoff_clicked` | Does the GB boundary correctly route XI/EU intent? | tool_id, placement, source, medium, campaign, content, term, page_path | Visitor opens the official European Commission checker |
| `authority_chooser_completed` | Which Incoterms handoff attracts deeper use? | result_code, asset_family, source, medium, campaign, page_path | Visitor completes the four-question chooser |
| `authority_asset_downloaded` | Which linkable workpapers earn off-site use? | asset_type, asset_format, source, medium, campaign, page_path | Visitor downloads an operational map, workflow diagram, data file, or press chart |
| `authority_related_clicked` | Which authority page moves readers into another useful tool or cluster page? | target, asset_family, source, medium, campaign, page_path | Visitor follows a related workpaper, calculator, term sheet, or workflow |
| `authority_booking_clicked` | Which authority assets assist a numbers call? | placement, asset_family, source, medium, campaign, page_path | Visitor selects the masthead or bottom numbers-call CTA |

## Attribution

Supported query parameters are `src`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and
`utm_term`. First-touch values persist for the browser session. Static-route booking links return to
the homepage with a route-specific `src` value before the third-party diary is loaded. A later
internal `src` or UTM value never overwrites an attribution value already stored in that session.

The customs document pack workpaper records aggregate counts only. It does not transmit individual
checkbox selections, prompt text, document data, names, EORIs, values, or any free-text response.

The customs declaration cost calculator records coarse volume and time bands plus whether the target
reduces the current minutes. It does not transmit the raw weekly volume, minutes, hourly cost,
calculated financial outputs, share URL, names, EORIs, or free text. A share link is created only after
the visitor asks for one and contains the five model inputs shown on the page.

The operations report records report ID plus enum-only asset, placement, destination, and share-method
properties with the documented attribution fields. It does not transmit research rows, company or
contact data, domains, candidate IDs, evidence excerpts, or download contents.

The customs value and duty workpaper records only a coarse customs-value band and boolean indicators
for non-unit FX, adjustments, duty rate, and VAT rate. It does not transmit raw goods values, exchange
rates, charges, percentage rates, calculated outputs, the share URL, identifiers, or free text. A share
link is created only after the visitor asks for one and contains the ten visible numerical inputs.

The GB EORI checker records only enum-like outcome, reliability reason, CTA placement, checker scope,
and whether HMRC returned public company details. It never transmits the entered or normalized EORI,
trader name, address, provider message, raw response, or timestamps to analytics. The EORI is sent
only in the POST body to the configured Declarix proxy and never appears in a page URL.

Authority-library events contain enum-like page, placement, result-code, asset-type, format, and
related-target properties only. They do not transmit customs values, declaration references, account
identifiers, document contents, names, email addresses, or free text. Downloads are ungated.

## Deployment closure

1. Set `POSTHOG_KEY` and, if needed, `POSTHOG_HOST` in GitHub repository variables.
2. Set `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` after creating the webmaster accounts.
3. In Zoho Bookings, set the successful-booking redirect to
   `https://getdeclarix.com/booking-confirmed/`.
4. Validate all events in a browser release QA and in the destination platform before using them for
   commercial decisions.

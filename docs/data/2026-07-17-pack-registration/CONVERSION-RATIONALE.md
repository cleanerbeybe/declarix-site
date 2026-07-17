# Conversion rationale

## Pack checker

The first version identified unmapped groups but left the operator to reconstruct the actual work. Version 2.0 makes the result operational:

1. Tick only what is already mapped.
2. Generate individual actions ordered P1–P3.
3. Copy the plan into a job note, print/save it, or share the checker.
4. Bring the recurring P1 blockers, volume, time, and current system to the 20-minute workflow call.

The booking CTA is relevant because it connects an observed handoff problem to the product’s existing document-intake and clerk-capacity offer. The tool remains useful without booking.

Events contain aggregate counts only:

- `tool_started`
- `tool_completed`
- `tool_result_copied`
- `tool_result_printed`
- `tool_result_shared`
- `tool_booking_clicked`

No selection text, document facts, identifiers, EORIs, values, email, or free text is sent.

## Registration response kit

The response kit captures time-sensitive search demand with a practical asset rather than a commentary-only page. The canonical page answers the query, supplies source evidence, and gives visitors two reusable files without a gate.

The product CTA appears after value. It connects only where the evidence-mapping exercise reveals the operational pains Declarix addresses: document chasing, re-keying, and senior-clerk bottlenecks.

Events contain no personal data:

- `registration_kit_downloaded` with `asset_id`, `asset_format`, and `page_path`;
- `registration_kit_booking_clicked` with placement and `page_path`.

## Pricing explanation

The page now follows the buyer’s decision sequence: unit → rework → total cost → pilot test. It retains commercial clarity without presenting the page like contract boilerplate.

# Customs declaration cost calculator

Date: 2026-07-17

Route: `/tools/customs-declaration-cost-calculator/`

Release type: additive acquisition and conversion surface

## Outcome

The route gives customs-desk buyers a useful, indexable labour model before they speak to Declarix.
It turns five buyer-entered inputs into current annual load, a buyer-chosen target scenario,
recoverable hours, theoretical capacity, labour headroom, and a labour-only break-even price per
entry. It does not invent a Declarix price or a Declarix performance outcome.

## Release guardrails

- Existing homepage copy, offer, pricing example, animation, and booking flow are unchanged.
- Value, model, and CTA lead the page. Assumptions are kept beside the outputs they qualify.
- All calculations run in the browser. No account, email, document, identifier, or free text is
  collected.
- The page is static HTML with a small inline calculator script and a dedicated stylesheet.
- The route is added to primary static navigation, sitemap, `llms.txt`, `llms-full.txt`, and the
  deterministic build verifier.

## Durable record

- [FORMULA-CONTRACT.md](./FORMULA-CONTRACT.md)
- [DECISION-LEDGER.md](./DECISION-LEDGER.md)
- [SEO-CRO-RATIONALE.md](./SEO-CRO-RATIONALE.md)
- [ANALYTICS.md](./ANALYTICS.md)
- [QA.md](./QA.md)
- [FOLLOW-ON.md](./FOLLOW-ON.md)

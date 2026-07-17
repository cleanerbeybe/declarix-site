# Commercial FAQ schema eligibility correction

**Date:** 17 July 2026  
**Route:** `/tools/customs-declaration-cost-calculator/`

## Decision

Keep the five visible calculator questions because they help users interpret the model, but remove
the `FAQPage` JSON-LD node. Google restricts FAQ rich-result eligibility to authoritative government
and health sites; Declarix is a commercial software site and should not signal ineligible markup.

The page continues to publish truthful `Organization`, `WebApplication`, and `BreadcrumbList`
structured data. No visible copy, formula, layout, conversion path, or homepage source changes.

Primary source: [Google Search Central — Changes to HowTo and FAQ rich
results](https://developers.google.com/search/blog/2023/08/howto-faq-changes).

## Permanent gate

The deterministic build verifier now:

- requires at least three visible `.calculator-faq` question-and-answer elements;
- fails if any calculator output contains an `FAQPage` JSON-LD type; and
- continues to require the free `WebApplication` contract and all formula/conversion safeguards.

## QA

- `npm ci`: zero known vulnerabilities
- `npm run lint`: pass
- `npm run build`: pass, including the 16-route publication verifier
- generated calculator JSON-LD parses as `Organization`, `WebApplication`, and `BreadcrumbList`
- visible question count remains five
- homepage source diff remains empty

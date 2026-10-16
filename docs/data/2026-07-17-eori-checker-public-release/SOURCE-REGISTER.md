# Official source register

Checked on **12 October 2026**.

| Source | Supports | Page consequence |
|---|---|---|
| [HMRC Check an EORI Number API v1.0](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/check-eori-number-api/1.0) | Current GB registry provider, beta lifecycle, optional consented details. | Result names the provider/version and never promises company details. |
| [Finding and checking an EORI](https://www.gov.uk/guidance/economic-operators-registration-and-identification-eori/finding-and-checking-an-eori-number) | GB versus XI/EU checking route and holder consent for public details. | XI/EU handoff and no-name explanation. |
| [European Commission EORI validation](https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en) | Official destination for XI/EU lookup intent. | Visible before the result and in unsupported results. |
| [Get an EORI number](https://www.gov.uk/eori) | Official eligibility and application route. | Supporting source; not rewritten as individualized advice. |

No commercial EORI database, scraped registry or format-only validator defines the result.

## 12 October 2026 source review

The check date above is our retrieval/review date. It is not a publisher update date.

- The Developer Hub still lists API version 1.0 as beta. Its displayed publisher update is **2 October 2026**. GB validity and consented business details remain distinct.
- GOV.UK's checking guidance redirects to the final URL above. Its publisher update remains **10 September 2025**. It directs GB numbers to the GB checker and XI/member-state numbers to the EU checker.
- The Commission destination serves its EORI validation form and instructions. This is a document check, not an executed registry query.
- The GOV.UK application/eligibility guide remains available as supporting guidance.

Complete official captures and exact retrieval times are retained in the 12 October Q6 source-review evidence. The selected request/200/400/500 API contracts match the prior evidence after resolving references and treating required-field lists as sets. This is documentation compatibility, not a live registry or deployed-provider test. No identifier was submitted. The historical register path is retained; no consumer migration is required.

## 15 October 2026 guide additions

The page gained how-to-check, GB/XI/EU checker, common-error and how-to-get-an-EORI sections (SEO lane L4). Two supporting GOV.UK sources were added and checked on **15 October 2026**; the four sources above keep their 12 October check stamps.

| Source | Supports |
|---|---|
| [Apply for an EORI number](https://www.gov.uk/eori/apply-for-eori) | What you need to apply, "immediately unless HMRC needs to make any checks… up to 5 working days", XI requires a GB application first, XI within 5 days. |
| [Get an EORI number for Northern Ireland (XI)](https://www.gov.uk/eori/eori-northern-ireland) | The four activities that need an XI EORI number. |

## 16 October 2026 iteration-1 additions

The page gained a not-confirmed next step, an "EORI number format" section, a "Can I find an EORI number by company name?" section and two FAQs. Sources re-read on **16 October 2026**; the six source stamps above are unchanged.

| Source | Supports |
|---|---|
| [Finding and checking an EORI](https://www.gov.uk/guidance/economic-operators-registration-and-identification-eori/finding-and-checking-an-eori-number) (publisher update 10 September 2025) | GB checker for GB numbers; the EU checker covers every XI number and the numbers of the 27 member states; name and address only with the holder's consent; find your own number by signing in to the EORI digital registration service. |
| [European Commission EORI validation](https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en) | Returned HTTP 200 on 16 October 2026; official handoff for XI and EU numbers. |
| [Get an EORI number](https://www.gov.uk/eori) (publisher update 7 August 2025) | GB and XI prefixes; a GB EORI comes first; cancelling a GB EORI also cancels the XI EORI. |
| [Apply for an EORI number](https://www.gov.uk/eori/apply-for-eori) | Up to 5 working days when HMRC makes checks (the "not live yet" cause). |

The "GB + 12 digits, sometimes 15" layout repeats the page's existing format hint and the HMRC Check an EORI Number API v1.0 documentation.

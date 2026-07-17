# Declarix marketing site

Declarix marketing site, deployed through GitHub Pages. The cinematic homepage is Vite + React +
TypeScript; the trust, commercial, and category routes are build-generated static HTML with no
homepage JavaScript bundle.

## Run locally

```bash
npm install
npm run dev
```

Production parity and the SEO/claims gates:

```bash
npm ci
npm run lint
npm run build
npm run preview
```

`npm run build` generates the acquisition, trust, research, free-tool, Incoterms, and customs-workflow route set plus the homepage, downloadable workpapers, a noindex booking receipt, sitemap,
`llms.txt`, `llms-full.txt`, and a real noindex 404. It then checks unique titles, H1s,
self-canonicals, descriptions, sitemap membership, explicit AI crawler policy, IndexNow ownership,
and the pinned public claims contract in `contracts/public-claims.v2.0.0.json`.

## Launch configuration

Edit `src/config.ts` before a branded launch:

- `domain`: current published origin.
- `packEmail`: initial workflow-review inbox; do not request live documents before an approved transfer channel
- `zohoBookingUrl` and `zohoBookingScriptUrl`: live diary and click-to-load embed
- `companyLegal` and `companyNo`: legal footer and pilot copy
- `linkedin`: company LinkedIn URL
- `posthogKey`: read from the `VITE_POSTHOG_KEY` deployment variable; empty disables network capture
- `founderPortrait` and `founderName`: optional founder exhibit and accessible image label

The site is configured for `getdeclarix.com`, with `public/CNAME` included in the GitHub Pages artifact and the deploy workflow building with `VITE_BASE_PATH=/`.

## Discovery and measurement configuration

The deploy workflow reads optional repository variables `POSTHOG_KEY`, `POSTHOG_HOST`,
`GOOGLE_SITE_VERIFICATION`, and `BING_SITE_VERIFICATION`. Verification tags are omitted when their
values are empty. Every deployment publishes the IndexNow ownership key and submits the sitemap URL
set after the Pages branch is updated.

Configure Zoho Bookings to redirect a completed booking to
`https://getdeclarix.com/booking-confirmed/`. That noindex receipt emits `booking_completed` to the
local `dataLayer` and, when configured, PostHog. See `docs/TRACKING-PLAN.md` for the event and privacy
contract.

## Route and claims ownership

- Edit static route content in `scripts/routes.mjs` and layout in `public/static-routes.css`.
- Edit free-tool content and interaction in `scripts/tools.mjs` and its layout in `public/tool.css`.
- Edit the Incoterms atlas, HMRC burden explorer, and workflow library in `scripts/authority-library.mjs` and their layout in `public/authority-library.css`.
- `scripts/generate-static-routes.mjs` writes the production HTML and sitemap into `dist/`.
- `scripts/verify-build.mjs` is the fail-closed publication gate.
- Update the pinned claims contract only after the corresponding version is merged in
  `cleanerbeybe/declarix/docs/public-claims/current.json`.
- Never hand-edit generated files in `dist/` or reintroduce copied homepage shells for policy routes.

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

`npm run build` generates 11 static routes plus the homepage, sitemap, and real noindex 404. It then
checks unique titles, H1s, self-canonicals, descriptions, sitemap membership, and the pinned public
claims contract in `contracts/public-claims.v1.0.0.json`.

## Launch configuration

Edit `src/config.ts` before a branded launch:

- `domain`: current published origin.
- `packEmail`: initial workflow-review inbox; do not request live documents before an approved transfer channel
- `zohoBookingUrl` and `zohoBookingScriptUrl`: live diary and click-to-load embed
- `companyLegal` and `companyNo`: legal footer and pilot copy
- `linkedin`: company LinkedIn URL
- `posthogKey`: EU PostHog project key, if analytics should run
- `founderLine`: approved founder wording

The site is configured for `getdeclarix.com`, with `public/CNAME` included in the GitHub Pages artifact and the deploy workflow building with `VITE_BASE_PATH=/`.

## Route and claims ownership

- Edit static route content in `scripts/routes.mjs` and layout in `public/static-routes.css`.
- `scripts/generate-static-routes.mjs` writes the production HTML and sitemap into `dist/`.
- `scripts/verify-build.mjs` is the fail-closed publication gate.
- Update the pinned claims contract only after the corresponding version is merged in
  `cleanerbeybe/declarix/docs/public-claims/current.json`.
- Never hand-edit generated files in `dist/` or reintroduce copied homepage shells for policy routes.

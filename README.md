# Declarix marketing site

One-page Vite + React + TypeScript site for Declarix, deployed through GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

## Launch configuration

Edit `src/config.ts` before a branded launch:

- `domain`: final domain, for example `getdeclarix.com`
- `packEmail`: inbox for anonymised ugly packs
- `calLink`: Cal.com event slug, for example `declarix/numbers-call`
- `companyLegal` and `companyNo`: legal footer and pilot copy
- `linkedin`: company LinkedIn URL
- `posthogKey`: EU PostHog project key, if analytics should run
- `founderLine`: approved founder wording

For the default GitHub Pages project URL, the deploy workflow builds with `VITE_BASE_PATH=/declarix-site/`.
When the custom domain is ready, add `public/CNAME` with the domain and change the workflow base path to `/`.

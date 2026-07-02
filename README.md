# Declarix marketing site

One-page Vite + React + TypeScript site for Declarix, deployed through GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

## Launch configuration

Edit `src/config.ts` before a branded launch:

- `domain`: current published origin. It is set to `cleanerbeybe.github.io/declarix-site` until DNS moves to GitHub Pages.
- `packEmail`: inbox for anonymised ugly packs
- `googleCalendarUrl`: Google Calendar appointment schedule iframe URL, for example `https://calendar.google.com/calendar/appointments/schedules/...?...`
- `companyLegal` and `companyNo`: legal footer and pilot copy
- `linkedin`: company LinkedIn URL
- `posthogKey`: EU PostHog project key, if analytics should run
- `founderLine`: approved founder wording

For the default GitHub Pages project URL, the deploy workflow builds with `VITE_BASE_PATH=/declarix-site/`.
When the custom domain is ready, add `public/CNAME` with the domain, change the workflow base path to `/`, and switch the canonical/OG/sitemap URLs back to the custom domain.

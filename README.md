# Declarix marketing site

One-page Vite + React + TypeScript site for Declarix, deployed through GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

## Launch configuration

Edit `src/config.ts` before a branded launch:

- `domain`: current published origin.
- `packEmail`: inbox for anonymised ugly packs
- `googleCalendarUrl`: Google Calendar appointment schedule iframe URL, for example `https://calendar.google.com/calendar/appointments/schedules/...?...`
- `companyLegal` and `companyNo`: legal footer and pilot copy
- `linkedin`: company LinkedIn URL
- `posthogKey`: EU PostHog project key, if analytics should run
- `founderLine`: approved founder wording

The site is configured for `getdeclarix.com`, with `public/CNAME` included in the GitHub Pages artifact and the deploy workflow building with `VITE_BASE_PATH=/`.

# Review checks

- `npm run build`: PASS with the default EORI feature gate,140 indexable routes.
- Existing release mode (`VITE_PUBLIC_EORI_RELEASE_ENABLED=true`, existing public API origin): PASS,141 indexable routes. The build does not call that provider.
- `node --test tests/*.test.mjs`:200/200 PASS, including6 new source/built route contracts. `npm run lint`:0errors,13existing warnings.
- At the retained release's pinned `RADAR_BUILD_AT=2026-10-16T15:35:00Z`, exactly five generated files differ: clearance HTML and Markdown, sitemap.xml, feed.xml, llms-full.txt. This is deterministic preservation, not fresh Radar/vendor verification. The unpinned default build uses the real current clock.
- Original built home, pricing, pilot, how-it-works, Customaite comparison, small-brokerage page and glossary are byte-identical in the matching build mode.23additional route/link/protection checks pass.
- The first draft source test looked for the glossary in the wrong module; corrected to its real customs-procedures-content owner. No glossary source change.
- First-class local browser navigation was refused by policy. No screenshot or desktop/mobile visual pass is claimed. Owning release visual review remains open.
- D3 genuine successful product-run proof/rights, later provider-panel collection, separate exact-head review and eligible GitHub approval remain distinct. No merged/live outcome is claimed.

// Owner-held items (15 Oct 2026). On seo/integration-20261015 nothing is held, so every page ships.
// seo/ship-now-20261015 fills HELD_ROUTES in ONE commit. To release a page, delete its line.
// A held route is not generated, not in sitemap.xml, llms*.txt, feeds or Markdown twins, and every
// link to it is removed: list items are dropped at render time and any remaining in-text anchor is
// unwrapped to plain text by the generator's final pass. verify-build fails if a link to a held route survives.
export const HELD_ROUTES = [
  '/customs-automation-software/', // L3 P03: owner words pending (L3-P03-copy.md)
  '/compare/declarix-vs-cargowise-customs/', // CargoWise integration-route sentence: owner decision pending
  '/customs-workflows/customs-preparation-for-cargowise/', // CargoWise integration-route sentence: owner decision pending
  '/alternatives/descartes-e-customs/', // partner page: owner decision pending
  '/alternatives/sequoia/', // partner page: owner decision pending
]

export const isHeld = (path) => HELD_ROUTES.includes(path)
export const notHeld = (route) => !isHeld(typeof route === 'string' ? route : route.path)

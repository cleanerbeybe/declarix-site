// Owner-held items (15 Oct 2026). On seo/integration-20261015 nothing is held, so every page ships.
// seo/ship-now-20261015 fills HELD_ROUTES in ONE commit. To release a page, delete its line.
// A held route is not generated, not in sitemap.xml, llms*.txt, feeds or Markdown twins, and every
// link to it is removed: list items are dropped at render time and any remaining in-text anchor is
// unwrapped to plain text by the generator's final pass. verify-build fails if a link to a held route survives.
export const HELD_ROUTES = []

export const isHeld = (path) => HELD_ROUTES.includes(path)
export const notHeld = (route) => !isHeld(typeof route === 'string' ? route : route.path)

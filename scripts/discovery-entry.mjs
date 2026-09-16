// Unreviewed titles can contain claims too. Only their route URL is carried forward.
export function discoveryEntry(route, origin, reviewedPaths) {
  if (reviewedPaths.has(route.path)) {
    return `- [${route.title}](${origin}${route.path}): ${route.description}`
  }
  return `- [Indexed route: ${route.path}](${origin}${route.path}): Indexed route; product or commercial copy awaits claim alignment and is omitted from this discovery summary.`
}

export function verifyLegacyDiscovery(content, legacyRoutes, origin) {
  const lines = content.split('\n')
  for (const route of legacyRoutes) {
    const entries = lines.filter(line => line.includes(`](${origin}${route.path})`))
    const expected = discoveryEntry(route, origin, new Set())
    if (entries.length !== 1 || entries[0] !== expected) {
      throw new Error(`Unaligned discovery title or description: ${route.path}`)
    }
  }
}

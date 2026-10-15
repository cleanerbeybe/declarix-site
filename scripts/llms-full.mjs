// Builds the "full text" part of llms-full.txt from the rendered static pages, so
// agents that read it get the same words a visitor sees, not only a link list.
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Money pages, pricing, pilot, how-it-works and the free tools, in reading order.
export const llmsFullPaths = [
  '/customs-declaration-software/',
  '/customs-clearance-software/',
  '/how-it-works/',
  '/supported-scope/',
  '/pricing/',
  '/pricing-policy/',
  '/pilot/',
  '/roi-calculator/',
  '/security/',
  '/about/',
  '/tools/',
  '/tools/customs-document-pack-check/',
  '/tools/customs-declaration-cost-calculator/',
  '/tools/customs-value-import-duty-vat-calculator/',
  '/tools/eori-checker/',
  '/compare/automation-vs-outsourcing/',
]

const entities = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' }

export function htmlToText(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || ''
  return main
    .replace(/<(script|style|template|noscript|svg|form|button|select|textarea)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<h1[^>]*>/gi, '\n\n### ')
    .replace(/<h2[^>]*>/gi, '\n\n#### ')
    .replace(/<h3[^>]*>/gi, '\n\n##### ')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<tr[^>]*>/gi, '\n')
    .replace(/<\/t[hd]>/gi, ' | ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|section|header|aside|article|ol|ul|table|h[1-6]|figure|figcaption|code)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, (entity) => entities[entity] ?? ' ')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
    .replace(/\n(#{3,5} )/g, '\n\n$1')
    .trim()
}

export async function llmsFullText(dist, site, routesByPath) {
  const blocks = []
  for (const path of llmsFullPaths) {
    const route = routesByPath.get(path)
    if (!route) continue
    const html = await readFile(join(dist, path.slice(1), 'index.html'), 'utf8')
    const text = htmlToText(html)
    if (!text) throw new Error(`llms-full.txt could not extract text from ${path}`)
    blocks.push(`## ${route.title}\n\nSource: ${site.origin}${path}\n\n${text}`)
  }
  return blocks.join('\n\n')
}

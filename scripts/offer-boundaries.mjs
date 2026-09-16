import { readFileSync } from 'node:fs'
import { scopeBoundary, scopeCta } from './product-scope.mjs'

export const offerContract = JSON.parse(readFileSync(new URL('../contracts/offer-boundaries-draft-2026-09-16.json', import.meta.url), 'utf8'))
const requireText = (text, phrase, path) => {
  if (!text.includes(phrase)) throw new Error(`Offer boundary missing on ${path}: ${phrase}`)
}
export function validateOfferBoundaries(routes) {
  if (offerContract.status !== 'draft_only_not_publication_approval') throw new Error('Offer contract must stay draft-only')
  for (const path of offerContract.reviewed_paths) {
    const route = routes.find(r => r.path === path)
    if (!route || route.claimContract !== offerContract.contract_id) throw new Error(`Offer route/contract missing: ${path}`)
    // Each route must carry its own visible limitation, not borrow a phrase from another page.
    requireText(route.limitations || '', scopeBoundary, path)
    for (const phrase of offerContract.required_per_route) requireText(route.limitations, phrase, path)
    if (JSON.stringify(route.cta) !== JSON.stringify(scopeCta)) throw new Error(`Safe enquiry CTA missing: ${path}`)
    const text = JSON.stringify(route).toLowerCase()
    for (const phrase of offerContract.prohibited_result_claims) if (text.includes(phrase.toLowerCase())) throw new Error(`Unsupported offer result on ${path}: ${phrase}`)
  }
  const pilot = JSON.stringify(routes.find(r => r.path === '/pilot/'))
  for (const phrase of offerContract.preserved_commercial_strings) requireText(pilot, phrase, '/pilot/')
  const pricing = routes.find(r => r.path === '/pricing/')
  if (!pricing.sections.some(s => s.links?.some(l => l.href === '/compare/automation-vs-outsourcing/'))) throw new Error('Buyer-input economics link missing')
  for (const route of routes.filter(r => offerContract.reviewed_paths.includes(r.path))) {
    for (const section of route.sections) for (const link of section.links || []) {
      if (link.href !== '/compare/automation-vs-outsourcing/' || !link.label) throw new Error('Unapproved offer section link')
    }
  }
  return true
}
export function validateOfferHtml(html, path) {
  if (!offerContract.reviewed_paths.includes(path)) throw new Error(`Unscoped offer HTML: ${path}`)
  const heroEnd = html.indexOf('</header>', html.indexOf('<header class="hero'))
  const adjacent = heroEnd < 0 ? '' : html.slice(heroEnd + 9).trimStart()
  const strip = adjacent.match(/^<p class="limitations scope-boundary">([\s\S]*?)<\/p>/)?.[1] || ''
  requireText(strip, scopeBoundary, path)
  requireText(html, scopeCta.copy, path)
  for (const phrase of offerContract.prohibited_result_claims) if (html.toLowerCase().includes(phrase.toLowerCase())) throw new Error(`Unsupported built offer result on ${path}: ${phrase}`)
  if (path === '/pricing/') requireText(html, 'href="/compare/automation-vs-outsourcing/"', path)
  return true
}

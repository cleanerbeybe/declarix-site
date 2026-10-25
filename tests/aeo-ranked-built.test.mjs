import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const html = (route) => readFileSync(join('dist', route, 'index.html'), 'utf8')

test('D1: existing prepared comparison and audience destinations remain useful', () => {
  const comparison = html('compare/declarix-vs-customaite')
  const table = comparison.match(/<table class="compare-table">[\s\S]*?<\/table>/)?.[0]
  assert.ok(table, 'existing eight-criteria table')
  assert.equal((table.match(/<tr>/g) || []).length, 9, 'one heading and eight criteria')
  assert.match(comparison, /Who each option is best for\./)
  assert.match(comparison, /source-register/)
  for (const href of ['/supported-scope/', '/how-it-works/', '/pricing/', '/pilot/', '/tools/customs-document-pack-check/']) {
    assert.ok(comparison.includes(`href="${href}"`), href)
    assert.ok(existsSync(join('dist', href, 'index.html')), href)
  }
  const audience = html('for/small-customs-brokerages')
  for (const href of ['/pricing/', '/roi-calculator/', '/pilot/']) assert.ok(audience.includes(`href="${href}"`), href)
})

test('D2: the built buying file links to the four existing decision owners', () => {
  const page = html('customs-clearance-software')
  const buying = page.match(/<h2>Compare the same ugly pack\.<\/h2>([\s\S]*?)<\/section>/)?.[1]
  assert.ok(buying)
  for (const href of ['/how-it-works/', '/supported-scope/', '/pricing/', '/pilot/']) assert.ok(buying.includes(`href="${href}"`), href)
  assert.ok(page.includes('"dateModified":"2026-10-25"'))
  assert.ok(page.includes('<link rel="canonical" href="https://getdeclarix.com/customs-clearance-software/"'))
  assert.equal((page.match(/<h1>/g) || []).length, 1)
})

test('D4: original glossary concepts retain their official source and the relevant handoff', () => {
  const glossary = html('customs-reference/glossary')
  for (const [term, href] of [['cds', '/customs-declaration-software/'], ['cpc', '/customs-reference/customs-procedure-codes/']]) {
    const entry = glossary.match(new RegExp(`<div[^>]*id="term-${term}"[\\s\\S]*?<\\/dd>`))?.[0]
    assert.ok(entry, term)
    assert.ok(entry.includes('https://www.gov.uk/'))
    assert.ok(entry.includes(`href="${href}"`))
  }
  assert.ok(glossary.includes('id="term-eori"'))
  if (existsSync('dist/tools/eori-checker/index.html')) assert.ok(glossary.includes('href="/tools/eori-checker/"'))
  assert.ok(glossary.includes('href="/tools/customs-document-pack-check/"'))
})

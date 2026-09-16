import test from 'node:test'
import assert from 'node:assert/strict'
import { Script } from 'node:vm'
import { customerWorkflowRoutes, requestExample, renderCustomerWorkflow } from '../scripts/customer-workflows.mjs'
const site = { origin: 'https://getdeclarix.com', company: 'Declarix Limited' }
for (const route of customerWorkflowRoutes) {
  const html = renderCustomerWorkflow(route, site)
  test(`${route.audience}: unique initial HTML metadata and one H1`, () => {
    assert.equal((html.match(/<h1>/g) || []).length, 1)
    assert.ok(html.includes(`<title>${route.title}</title>`))
    assert.ok(html.includes(`href="${site.origin}${route.path}"`))
    assert.ok(html.includes(`content="${route.description}"`))
    assert.ok(html.includes('content="noindex,nofollow"'))
    assert.doesNotMatch(html, /content="index,follow"/)
    assert.equal((html.match(/data-example-step=/g) || []).length, 6)
  })
  test(`${route.audience}: no upload, auth, free text, persistence or telemetry path`, () => {
    assert.doesNotMatch(html, /<input|<textarea|<iframe|fetch\(|sendBeacon|localStorage|sessionStorage|posthog|<script[^>]+src=/i)
    assert.doesNotMatch(html, /href="[^"\n]*(?:login|sign-in|\/return\/|bookings)/i)
    assert.ok(html.includes('No files are uploaded and no message is sent.'))
    assert.ok(html.includes('FICTIONAL WORKED EXAMPLE'))
  })
  test(`${route.audience}: review/delivery/filing boundaries alongside example`, () => {
    for (const text of ['not email delivery proof', 'does not automatically confirm sufficiency', 'review reopened', 'fresh broker confirmation', 'Declarix does not submit to HMRC', 'not a customer result or importer validation study']) assert.ok(html.includes(text), text)
    assert.doesNotMatch(html, /3×|200 seconds|filing-ready|declaration-ready|guaranteed|every declaration is compliant/i)
  })
  test(`${route.audience}: static fallback and working counterpart/next-step anchors`, () => {
    assert.ok(html.includes('<noscript>'))
    assert.ok(html.includes('href="#worked-example"'))
    for (const path of ['/pilot/', '/supported-scope/', '/how-it-works/', customerWorkflowRoutes.find(x => x !== route).path]) assert.ok(html.includes(`href="${path}"`))
  })
  test(`${route.audience}: valid truthful structured data and executable inline controller`, () => {
    const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
    assert.equal(data['@graph'][0]['@type'], 'WebPage')
    assert.equal(data['@graph'][0].url, site.origin + route.path)
    assert.doesNotMatch(JSON.stringify(data), /rating|reviewCount|FAQPage|SoftwareApplication/)
    for (const [, source] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Script(source)
  })
}
test('exact lifecycle order retains fresh-review requirement', () => {
  assert.deepEqual(requestExample.map(x => x.state), ['Draft', 'Approved', 'Sent', 'Replied · pending review', 'Resolved', 'Replied · review reopened'])
  assert.match(requestExample[5].body, /no longer counts as acceptance/)
  assert.match(requestExample[5].evidence, /cancelling.*does not make.*earlier acceptance valid/)
})
test('page tasks are distinct and arbitrary route input is denied', () => {
  assert.notEqual(customerWorkflowRoutes[0].title, customerWorkflowRoutes[1].title)
  assert.throws(() => renderCustomerWorkflow({ path: '/evil' }, site), /Unknown/)
})

// Deliberately separate from build/deploy. Output is git-ignored and local-only.
import { cp, mkdir, writeFile, rm, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { customerWorkflowRoutes, renderCustomerWorkflow } from './customer-workflows.mjs'
import { site } from './routes.mjs'
const root = dirname(dirname(fileURLToPath(import.meta.url)))
const preview = join(root, 'output/customer-preview')
await rm(preview, { recursive: true, force: true })
await cp(join(root, 'dist'), preview, { recursive: true })
for (const route of customerWorkflowRoutes) {
  const target = join(preview, route.path.slice(1), 'index.html')
  const html = renderCustomerWorkflow(route, site)
  if (!html.includes('content="noindex,nofollow"')) throw new Error('Preview must not be indexable')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, html)
}
for (const name of ['sitemap.xml', 'llms.txt', 'llms-full.txt']) {
  const text = await readFile(join(preview, name), 'utf8')
  if (customerWorkflowRoutes.some(route => text.includes(route.path))) throw new Error('Preview route leaked into discovery')
}
console.log('Local-only B01 previews written under output/customer-preview; dist is unchanged')

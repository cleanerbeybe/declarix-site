// Run against a completed local build only. Each probe restores the original artifact.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir, rm, access } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { customerWorkflowRoutes } from '../scripts/customer-workflows.mjs'
const root = dirname(dirname(fileURLToPath(import.meta.url)))
function verify() { return execFileSync(process.execPath, ['scripts/verify-build.mjs'], { cwd: root, encoding: 'utf8', stdio: 'pipe' }) }
for (const route of customerWorkflowRoutes) {
 test('production verifier rejects a leaked route: ' + route.path, async () => {
  const path = join(root, 'dist', route.path.slice(1), 'index.html')
  await assert.rejects(access(path), { code: 'ENOENT' })
  await mkdir(dirname(path), { recursive: true })
  try {
   await writeFile(path, '<h1>Leaked preview</h1>')
   assert.throws(verify, /Unreleased customer workflow in public build/)
  } finally { await rm(path) }
  assert.match(verify(), /B01 release gate passed/)
 })
}
for (const name of ['sitemap.xml', 'llms.txt', 'llms-full.txt']) {
 test('production verifier rejects a leaked discovery URL: ' + name, async () => {
  const path=join(root,'dist',name), original=await readFile(path)
  try {
   await writeFile(path, original.toString()+'\nhttps://getdeclarix.com/use-cases/importers/\n')
   assert.throws(verify, /Unreleased customer workflow/)
  } finally { await writeFile(path, original) }
  assert.match(verify(), /B01 release gate passed/)
 })
}

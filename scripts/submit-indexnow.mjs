import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const key = (await readFile(join(root, 'public/indexnow.txt'), 'utf8')).trim()
const sitemap = await readFile(join(root, 'dist/sitemap.xml'), 'utf8')
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])

if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) throw new Error('Invalid IndexNow key')
if (!urlList.length) throw new Error('No sitemap URLs found for IndexNow')

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'getdeclarix.com',
    key,
    keyLocation: 'https://getdeclarix.com/indexnow.txt',
    urlList,
  }),
})

if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`)
}

console.log(`IndexNow accepted ${urlList.length} Declarix URLs with status ${response.status}`)

// Browser QA for the commercial invoice and packing list generators.
// Serves dist/ locally, drives each generator in Chromium and records screenshots.
const { chromium } = require('playwright')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')

const root = path.resolve(__dirname, '../dist')
const output = path.resolve(process.env.GENERATOR_QA_OUTPUT || path.join(__dirname, '../output/generators'))
fs.mkdirSync(output, { recursive: true })
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.csv': 'text/csv', '.woff2': 'font/woff2', '.jpg': 'image/jpeg' }

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  let file = path.join(root, decodeURIComponent(url.pathname))
  if (!file.startsWith(root)) { res.writeHead(403); return res.end() }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('not found') }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
})

const checks = []
const record = (name, value) => { checks.push({ name, pass: Boolean(value) }); assert.ok(value, name) }

const cases = [
  { path: '/tools/commercial-invoice-generator/', kind: 'invoice', total: '€3,559.00', csvTotal: '"3559.00"' },
  { path: '/tools/packing-list-generator/', kind: 'packing', total: '5 pkgs · 125.5 kg', csvTotal: '"0.338"' },
]

;(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const origin = 'http://127.0.0.1:' + server.address().port
  const browser = await chromium.launch()
  try {
    for (const spec of cases) {
      const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } })
      const page = await context.newPage()
      const external = []
      page.on('request', (request) => { if (!request.url().startsWith(origin)) external.push(request.url()) })
      const errors = []
      page.on('pageerror', (error) => errors.push(String(error)))
      await page.addInitScript(() => { window.__printed = 0; window.print = () => { window.__printed += 1 } })
      await page.goto(origin + spec.path)
      const label = spec.kind

      // Blank state: template visible, export blocked with an error summary.
      record(`${label}: blank template rendered`, await page.locator('#gen-preview .doc-title').isVisible())
      await page.click('#gen-print')
      record(`${label}: blank print blocked`, (await page.evaluate(() => window.__printed)) === 0)
      record(`${label}: error summary shown`, await page.locator('#gen-summary.has-errors').isVisible())
      record(`${label}: invalid fields marked`, (await page.locator('[aria-invalid="true"]').count()) >= 3)
      await page.screenshot({ path: path.join(output, `${label}-blank-errors.png`), fullPage: false })

      // Blank template print works without any data.
      await page.click('#gen-print-blank')
      record(`${label}: blank template print`, (await page.evaluate(() => window.__printed)) === 1)

      // Offline from here on: everything must keep working.
      await context.setOffline(true)

      await page.click('#gen-example')
      await page.waitForTimeout(100)
      record(`${label}: running total`, (await page.textContent('#gen-running-total')).includes(spec.total))
      record(`${label}: summary cleared after example`, await page.locator('#gen-summary').isHidden())
      const previewText = await page.textContent('#gen-preview')
      record(`${label}: preview filled`, previewText.includes('SYNTHETIC') && previewText.includes('848210'))

      await page.click('#gen-check')
      record(`${label}: example passes check`, await page.locator('#gen-summary.is-ready').isVisible())

      await page.click('#gen-print')
      record(`${label}: print with data`, (await page.evaluate(() => window.__printed)) === 2)

      const [csv] = await Promise.all([page.waitForEvent('download'), page.click('#gen-csv')])
      const csvText = fs.readFileSync(await csv.path(), 'utf8')
      record(`${label}: csv filename`, /\.csv$/.test(csv.suggestedFilename()))
      record(`${label}: csv total`, csvText.trim().split('\r\n').pop().endsWith(spec.csvTotal))

      const [json] = await Promise.all([page.waitForEvent('download'), page.click('#gen-json')])
      const jsonPath = path.join(output, `${label}.json`)
      await json.saveAs(jsonPath)
      record(`${label}: json format`, JSON.parse(fs.readFileSync(jsonPath, 'utf8')).format === `declarix-${label}-v1`)

      // Add, remove and invalid line states.
      await page.click('#gen-add-line')
      record(`${label}: line added`, (await page.locator('#gen-lines .gen-line').count()) === 3)
      await page.locator('#gen-lines .gen-line').nth(2).locator('[data-remove-line]').click()
      record(`${label}: line removed`, (await page.locator('#gen-lines .gen-line').count()) === 2)
      await page.fill('#l0-netMass', '500')
      await page.click('#gen-csv')
      record(`${label}: net above gross blocks export`, (await page.textContent('#gen-summary')).includes('gross mass must be at least the net mass'))
      record(`${label}: invalid gross marked`, (await page.getAttribute('#l0-grossMass', 'aria-invalid')) === 'true')

      // Clear, then reopen the saved JSON.
      await page.click('#gen-clear')
      record(`${label}: cleared`, (await page.locator('#gen-lines .gen-line').count()) === 1)
      await page.setInputFiles('#gen-open-json', jsonPath)
      await page.waitForTimeout(100)
      record(`${label}: saved json reopened`, (await page.textContent('#gen-running-total')).includes(spec.total))

      // Print stylesheet shows only the document.
      await page.emulateMedia({ media: 'print' })
      record(`${label}: print hides builder`, await page.locator('#gen-builder').isHidden())
      record(`${label}: print shows document`, await page.locator('#gen-preview').isVisible())
      await page.pdf({ path: path.join(output, `${label}.pdf`), format: 'A4' })
      await page.emulateMedia({ media: 'screen' })
      await page.locator('#gen-template').screenshot({ path: path.join(output, `${label}-preview.png`) })

      record(`${label}: no external requests`, external.length === 0)
      record(`${label}: no page errors`, errors.length === 0)
      await context.close()

      // Mobile 375 px: no horizontal page scroll.
      const mobile = await browser.newContext({ viewport: { width: 375, height: 800 }, deviceScaleFactor: 2 })
      const mobilePage = await mobile.newPage()
      await mobilePage.goto(origin + spec.path)
      await mobilePage.click('#gen-example')
      const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      record(`${label}: mobile no horizontal scroll (${overflow}px)`, overflow <= 0)
      await mobilePage.screenshot({ path: path.join(output, `${label}-mobile.png`), fullPage: false })
      await mobile.close()
    }
  } finally {
    await browser.close()
    server.close()
  }
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(checks, null, 2))
  console.log(`${checks.filter((c) => c.pass).length}/${checks.length} generator browser checks passed`)
})().catch((error) => {
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(checks, null, 2))
  console.error(error)
  server.close()
  process.exit(1)
})

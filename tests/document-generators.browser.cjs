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
      record(`${label}: preview filled`, previewText.includes('Beispiel Lager GmbH') && previewText.includes('848210'))

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

      // Iteration 1 behaviour (ICP round 1: CI1-CI5, PL1-PL5, S1).
      const iter = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } })
      const ip = await iter.newPage()
      const iterErrors = []
      ip.on('pageerror', (error) => iterErrors.push(String(error)))
      await ip.goto(origin + spec.path)
      const today = await ip.evaluate(() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') })
      const dateId = spec.kind === 'invoice' ? '#h-invoiceDate' : '#h-packingDate'
      record(`${label}: date defaults to today`, (await ip.inputValue(dateId)) === today)
      record(`${label}: date reads in UK order`, /^Reads as \d{1,2} [A-Z][a-z]+ \d{4}$/.test((await ip.locator(dateId + ' ~ [data-date-readout]').textContent()).trim()))
      if (spec.kind === 'invoice') {
        record('invoice: CDS tag explainer above the form', await ip.locator('.gen-cds-note').isVisible())
        record('invoice: importer EORI optional for GB', (await ip.locator('#h-importerEori').evaluate((el) => el.closest('.gen-field').querySelector('[data-required-mark]').hidden)) === true)
        await ip.fill('#h-destinationCountry', 'FR')
        record('invoice: importer EORI marked required outside GB', await ip.locator('#h-importerEori ~ [data-required-hint]').isVisible())
        record('invoice: required hint words', (await ip.textContent('#h-importerEori-required')).includes('Needed by the importer’s customs for EU deliveries'))
        await ip.click('#gen-example')
        record('invoice: packages on the printed document', (await ip.textContent('#gen-preview')).includes('5 cartons'))
        await ip.selectOption('#h-documentType', 'proforma')
        record('invoice: proforma relabels the document', (await ip.textContent('#gen-preview .doc-title')) === 'PROFORMA INVOICE')
        await ip.selectOption('#h-documentType', 'commercial')
        const [dl] = await Promise.all([ip.waitForEvent('download'), ip.click('#gen-csv')])
        const rows = fs.readFileSync(await dl.path(), 'utf8').split('\r\n')
        record('invoice: CSV rows carry parties and references', rows[1].includes('"Beispiel Lager GmbH"') && rows[1].includes('"GB123456789000"') && rows[1].includes('"PO-88231"'))
      } else {
        await ip.click('#gen-example')
        record('packing: weight labels say whole line', (await ip.textContent('label[for="l0-netMass"]')).includes('Net kg (whole line)'))
        record('packing: per-package weight shown', (await ip.textContent('#gen-lines .gen-line >> nth=0 >> [data-per-package="netMass"]')).trim() === '= 24 kg per package')
        record('packing: running totals include CBM', (await ip.textContent('#gen-running-total')).includes('0.338 m³'))
        await ip.locator('#gen-lines .gen-line').nth(0).locator('[data-duplicate-line]').click()
        record('packing: duplicate adds a line', (await ip.locator('#gen-lines .gen-line').count()) === 3)
        record('packing: duplicate continues the marks', (await ip.inputValue('#l1-marks')) === 'HX/0142 5-8')
        record('packing: duplicate copies contents and sizes', (await ip.inputValue('#l1-description')) === 'Stainless steel ball bearings, 22 mm bore' && (await ip.inputValue('#l1-length')) === '60')
        record('packing: no size warning while sizes are complete', await ip.locator('#gen-dim-warning').isHidden())
        for (const key of ['length', 'width', 'height']) await ip.fill('#l1-' + key, '')
        record('packing: missing-size warning shown', (await ip.textContent('#gen-dim-warning')).includes('Line 2 has no dimensions. Total volume is incomplete.'))
        record('packing: empty size boxes marked amber', (await ip.locator('#gen-lines .gen-line >> nth=1 >> .is-missing').count()) === 3)
        await ip.click('#gen-dim-fix')
        record('packing: ADD SIZES focuses the empty box', (await ip.evaluate(() => document.activeElement.id)) === 'l1-length')
        const [dl] = await Promise.all([ip.waitForEvent('download'), ip.click('#gen-csv')])
        record('packing: export not blocked by missing sizes', /\.csv$/.test(dl.suggestedFilename()))
        await ip.screenshot({ path: path.join(output, 'packing-dim-warning.png'), fullPage: false })
      }
      record(`${label}: iteration checks raise no page errors`, iterErrors.length === 0)
      await iter.close()

      // Mobile 375 px: no horizontal page scroll; the first input sits on the first screen (S1).
      const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
      const mobilePage = await mobile.newPage()
      await mobilePage.goto(origin + spec.path)
      const firstInput = await mobilePage.locator('#gen-form [data-field] >> nth=0').boundingBox()
      record(`${label}: mobile first input on first screen (${Math.round(firstInput.y + firstInput.height)}px)`, firstInput.y + firstInput.height <= 812)
      await mobilePage.click('#gen-example')
      const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      record(`${label}: mobile no horizontal scroll (${overflow}px)`, overflow <= 0)
      // PL4: typing into a line never moves the line boxes.
      const box = mobilePage.locator('#l0-grossMass')
      await box.scrollIntoViewIfNeeded()
      const before = await mobilePage.evaluate(() => document.querySelector('#l0-grossMass').getBoundingClientRect().top + scrollY)
      await mobilePage.fill('#l0-' + (spec.kind === 'invoice' ? 'quantity' : 'packageCount'), '12')
      await mobilePage.fill('#l0-netMass', '1234.567')
      const after = await mobilePage.evaluate(() => document.querySelector('#l0-grossMass').getBoundingClientRect().top + scrollY)
      record(`${label}: mobile line boxes stay put while typing (${after - before}px)`, after === before)
      await mobilePage.screenshot({ path: path.join(output, `${label}-mobile.png`), fullPage: false })
      await mobile.close()
    }

    // Customs document checker (pack check): S1 phone-first, S4 visible copy confirmation, intent links.
    const pc = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    await pc.grantPermissions(['clipboard-read', 'clipboard-write'], { origin })
    const pcPage = await pc.newPage()
    const pcErrors = []
    pcPage.on('pageerror', (error) => pcErrors.push(String(error)))
    await pcPage.goto(origin + '/tools/customs-document-pack-check/')
    record('pack check: guide link with keyword anchor', (await pcPage.locator('a[href="/guides/customs-declaration-document-checklist/"]', { hasText: 'full UK import document checklist' }).count()) >= 1)
    record('pack check: match table and FAQ present', (await pcPage.textContent('#pc-match-heading')) === 'What should match across the documents' && (await pcPage.locator('.pc-question').count()) >= 2)
    await pcPage.locator('.check-row').nth(0).click()
    await pcPage.click('#review-pack')
    await pcPage.click('#copy-unmapped')
    record('pack check: COPIED ✓ shown on the button', (await pcPage.textContent('#copy-unmapped')) === 'COPIED ✓')
    record('pack check: clipboard holds the plan', (await pcPage.evaluate(() => navigator.clipboard.readText())).startsWith('CUSTOMS DOCUMENT PACK'))
    await pcPage.screenshot({ path: path.join(output, 'packcheck-copied.png'), fullPage: false })
    await pcPage.waitForTimeout(2200)
    record('pack check: button label restored after 2 s', (await pcPage.textContent('#copy-unmapped')) === 'COPY ACTION PLAN')
    await pcPage.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('blocked')) })
    await pcPage.click('#copy-unmapped')
    record('pack check: failed copy shows visible error', (await pcPage.textContent('#copy-unmapped')) === 'COPY FAILED' && (await pcPage.locator('#copy-feedback').isVisible()))
    record('pack check: hidden live region still announces', (await pcPage.textContent('#tool-status')).includes('Copy was blocked'))
    record('pack check: no page errors', pcErrors.length === 0)
    await pc.close()
    const pcMobile = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
    const pcm = await pcMobile.newPage()
    await pcm.goto(origin + '/tools/customs-document-pack-check/')
    const firstRow = await pcm.locator('.check-row').nth(0).boundingBox()
    record(`pack check: mobile first prompt on first screen (${Math.round(firstRow.y + firstRow.height)}px)`, firstRow.y + firstRow.height <= 812)
    const pcOverflow = await pcm.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    record(`pack check: mobile no horizontal scroll (${pcOverflow}px)`, pcOverflow <= 0)
    await pcm.screenshot({ path: path.join(output, 'packcheck-mobile.png'), fullPage: false })
    await pcMobile.close()

    // /tools/ hub: search phrase on each card and the free-tools answer.
    const hub = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    const hubPage = await hub.newPage()
    await hubPage.goto(origin + '/tools/')
    record('tools hub: search phrases on the cards', (await hubPage.textContent('.hub-register')).includes('Import duty calculator UK.'))
    record('tools hub: free-tools question answered', (await hubPage.textContent('main')).includes('Are the tools free?'))
    await hub.close()
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

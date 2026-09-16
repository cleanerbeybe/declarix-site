// Local, reproducible social-card render. No generated product screenshot or customer claim.
import { chromium } from 'playwright'
import { readFile, writeFile } from 'node:fs/promises'
import { scopeCard } from './product-scope.mjs'
const font = (await readFile(new URL('../public/fonts/archivo-latin-700-normal.woff2', import.meta.url))).toString('base64')
const mono = (await readFile(new URL('../public/fonts/ibm-plex-mono-latin-400-normal.woff2', import.meta.url))).toString('base64')
const esc = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@font-face{font-family:Archivo;src:url(data:font/woff2;base64,${font})} @font-face{font-family:Mono;src:url(data:font/woff2;base64,${mono})}
*{box-sizing:border-box}body{margin:0;background:#f7f6f1;color:#16313d;font-family:Archivo;width:1200px;height:630px;padding:55px 65px;border-top:16px solid #1b7a4b}.brand{font-size:30px;border-bottom:2px solid #16313d;padding-bottom:25px}.label{font:18px Mono;margin-top:30px;color:#1b7a4b}h1{font-size:65px;line-height:1.08;max-width:1050px;margin:22px 0}p{font-size:28px;margin:20px 0}.boundary{font:21px Mono;border-top:1px solid #16313d;padding-top:23px;margin-top:30px}
</style></head><body><div class="brand">DECLARIX</div><div class="label">WORKFLOW SCOPE</div><h1>${esc(scopeCard.title)}</h1><p>${esc(scopeCard.subtitle)}</p><div class="boundary">${esc(scopeCard.boundary)}</div></body></html>`
const browser = await chromium.launch({headless:true})
try {const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});await page.setContent(html);await page.evaluate(()=>document.fonts.ready);if(await page.evaluate(()=>document.documentElement.scrollHeight>630)) throw new Error('Social card overflow');await writeFile(new URL('../public/product-scope.png',import.meta.url),await page.screenshot());} finally {await browser.close()}

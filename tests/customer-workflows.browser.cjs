const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const root = path.resolve(__dirname, '../output/customer-preview');
const output = path.resolve(__dirname, '../output/customer-workflows');
fs.mkdirSync(output, {recursive:true});
const paths = ['/use-cases/customer-document-requests/', '/use-cases/importers/'];
(async () => {
 const server = http.createServer((req,res) => {
  const pathname=decodeURIComponent(req.url.split('?')[0]); const file=path.resolve(root,'.'+pathname,pathname.endsWith('/')?'index.html':'');
  if (!file.startsWith(root+path.sep)) {res.writeHead(403);res.end();return;}
  try {const data=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.woff2')?'font/woff2':'application/octet-stream');res.end(data)}
  catch {res.writeHead(404,{'Content-Type':'text/html'});res.end(fs.readFileSync(path.join(root,'404.html')))}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin=`http://127.0.0.1:${server.address().port}`; const browser=await chromium.launch({headless:true});const checks=[];
 function record(name,ok) {assert.ok(ok,name);checks.push(name)}
 try {
  for(const route of paths) for(const width of [1440,390,320]) {
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});const page=await context.newPage();const network=[],errors=[];
   page.on('request',r=>network.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);
   const key=`${route} ${width}`;
   record(key+' status 200',response.status()===200);
   record(key+' preview noindex',await page.locator('meta[name=robots]').getAttribute('content')==='noindex,nofollow');
   record(key+' one H1',await page.locator('h1').count()===1);
   record(key+' logo on one line',await page.locator('.wordmark').evaluate(el=>{const r=document.createRange();r.selectNodeContents(el);return r.getClientRects().length===1}));
   record(key+' initial draft only',await page.locator('.example-step:visible').count()===1 && (await page.locator('.example-step:visible').textContent()).includes('Draft'));
   record(key+' previous disabled at start',await page.locator('#previous-step').isDisabled());
   await page.keyboard.press('Tab');record(key+' skip link first',await page.evaluate(()=>document.activeElement.textContent==='Skip to content'));
   await page.keyboard.press('Enter');record(key+' skip targets main',await page.evaluate(()=>location.hash==='#main'));
   const before=network.length;
   for (let i=1;i<6;i++) {await page.locator('#next-step').click();record(key+' step '+(i+1),await page.locator(`[data-example-step="${i}"]`).isVisible());record(key+' focused step '+(i+1),await page.evaluate(()=>document.activeElement.tagName==='H3'));}
   record(key+' changed evidence reopens review',(await page.locator('.example-step:visible').textContent()).includes('no longer counts as acceptance'));
   record(key+' next disabled at end',await page.locator('#next-step').isDisabled());
   await page.locator('#previous-step').click();record(key+' previous goes to resolved',(await page.locator('.example-step:visible').textContent()).includes('Resolved'));
   await page.locator('#show-all').click();record(key+' full no-JS equivalent',await page.locator('.example-step:visible').count()===6);
   await page.getByText('Does “sent” mean an email was delivered?',{exact:true}).click();
   record(key+' no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   record(key+' no interaction network',network.length===before);
   record(key+' no storage',await page.evaluate(()=>!localStorage.length&&!sessionStorage.length));
   record(key+' no third party requests',network.every(x=>x.startsWith(origin+'/')));
   record(key+' no script errors',errors.length===0);
   await page.addScriptTag({content:axeSource});
   const a11y=await page.evaluate(async()=> (await window.axe.run(document, {runOnly:{type:'tag', values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations);
   record(key+' accessibility '+JSON.stringify(a11y.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),a11y.length===0);
   const links=await page.locator('a[href^="/"]').evaluateAll(xs=>[...new Set(xs.map(x=>x.getAttribute('href').split('#')[0]))]);
   for (const link of links) record(key+' valid '+link,(await page.request.get(origin+link)).status()===200);
   await page.screenshot({path:path.join(output,`${route.includes('importers')?'P10':'P08'}-${width}.png`),fullPage:true});
   await context.close();
  }
  for(const route of paths) {
   const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:1000}});const page=await context.newPage();await page.goto(origin+route);
   record(route+' no-JS all steps',await page.locator('.example-step:visible').count()===6);
   record(route+' no-JS no dead controls',await page.locator('.example-controls').isHidden());
   record(route+' no-JS broker responsibility',(await page.textContent('main')).includes('broker remains responsible for approval and filing'));
   record(route+' no-JS 320 containment',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   record('unknown route 404 '+route,(await page.request.get(origin+'/not-a-declarix-page/')).status()===404);
   await context.close();
  }
  fs.writeFileSync(path.join(output,'BROWSER_TESTS.json'),JSON.stringify({status:'PASS',checks:checks.length,names:checks,environment:'Local build, synthetic only; no production/customer connection'},null,2));console.log(JSON.stringify({status:'PASS',checks:checks.length}));
 }finally {await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});

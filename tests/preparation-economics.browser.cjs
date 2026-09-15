const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '../dist');
const output = path.join(__dirname, '../output/economics');
fs.mkdirSync(output, {recursive:true});
const values = {cases:100,hourlyCost:30,months:12,internalMinutes:20,internalRework:2,softwareMonthly:100,internalSetup:1200,providerPerCase:10,providerMonthly:50,providerSetup:600,oversightMinutes:5,providerRework:1};
(async () => {
  const server = http.createServer((req,res) => { const pathname = decodeURIComponent(req.url.split('?')[0]); const file = path.join(root, pathname, pathname.endsWith('/') ? 'index.html' : ''); if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; } try { const data=fs.readFileSync(file); res.setHeader('Content-Type',file.endsWith('.html')?'text/html':'application/octet-stream');res.end(data); } catch {res.writeHead(404);res.end();} });
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({headless:true});
  const checks=[];
  const record=(name,pass)=>{assert.ok(pass,name);checks.push(name)};
  try {
    for (const width of [1440,390]) {
      const context=await browser.newContext({viewport:{width,height:1000},acceptDownloads:true});
      const page=await context.newPage();const requests=[];const errors=[];
      page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
      await page.goto(origin+'/compare/automation-vs-outsourcing/');
      record(width+' blank on first load',await page.locator('input').evaluateAll(xs=>xs.every(x=>x.value==='')));
      await page.getByRole('button',{name:'Compare my assumptions'}).click();
      record(width+' unknown blocked',await page.locator('#results').isHidden() && await page.locator('[aria-invalid=true]').count()===12);
      for (const [key,value] of Object.entries(values)) await page.locator('#'+key).fill(String(value));
      await page.getByRole('button',{name:'Compare my assumptions'}).click();
      record(width+' correct model', (await page.locator('#summary').textContent()).includes('£1,300.00') && (await page.locator('#summary').textContent()).includes('£1,400.00'));
      record(width+' sensitivity rows',await page.locator('#scenario-rows tr').count()===3);
      record(width+' focus on result',await page.evaluate(()=>document.activeElement.id==='result-title'));
      record(width+' no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      const dlEvent=page.waitForEvent('download');await page.locator('#download').click();const dl=await dlEvent;const csv=fs.readFileSync(await dl.path(),'utf8');record(width+' downloaded complete CSV',csv.includes('"100","1300.00","1400.00","100.00"'));
      await page.screenshot({path:path.join(output,`P34-${width}.png`),fullPage:true});
      await page.locator('#providerPerCase').fill('');
      record(width+' changed input hides stale result',await page.locator('#results').isHidden() && await page.locator('#download').isDisabled());
      await page.getByRole('button',{name:'Compare my assumptions'}).click();
      record(width+' missing quote not zero',(await page.locator('#providerPerCase-error').textContent()).includes('Enter an assumption'));
      await page.getByRole('button',{name:'Clear all inputs'}).click();
      record(width+' reset clears data',await page.locator('input').evaluateAll(xs=>xs.every(x=>x.value==='')));
      record(width+' no browser persistence',await page.evaluate(()=>localStorage.length===0&&sessionStorage.length===0));
      record(width+' no input/analytics network calls',requests.every(url=>url===origin+'/compare/automation-vs-outsourcing/'));
      record(width+' no console runtime errors',errors.length===0);
      for (const target of ['/how-it-works/','/supported-scope/','/pilot/']) record(width+' link '+target,(await page.request.get(origin+target)).status()===200);
      await context.close();
    }
    const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto(origin+'/compare/automation-vs-outsourcing/');record('no-JS method readable',(await page.textContent('main')).includes('Every formula is visible'));await context.close();
    fs.writeFileSync(path.join(output,'BROWSER_TESTS.json'),JSON.stringify({status:'PASS',checks:checks.length,names:checks,environment:'Local static build; Chromium; 1440px and 390px; no production access'},null,2));
    console.log(JSON.stringify({status:'PASS',checks:checks.length}));
  } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1});

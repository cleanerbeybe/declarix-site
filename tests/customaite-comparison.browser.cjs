const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');const http=require('node:http');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../dist');const output=path.resolve(__dirname,'../output/comparison');fs.mkdirSync(output,{recursive:true});
(async()=>{
 const checks=[];const check=(name,condition)=>{assert.ok(condition,name);checks.push(name)};
 const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');const file=path.resolve(root,'.'+decodeURIComponent(url.pathname),url.pathname.endsWith('/')?'index.html':'');if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}try{const bytes=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'application/octet-stream');res.end(bytes)}catch{res.writeHead(404).end()}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;const browser=await chromium.launch({headless:true});
 try{
  for(const width of [1440,768,390,320]){
   const context=await browser.newContext({viewport:{width,height:1000}});const page=await context.newPage();const requests=[];const errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+'/compare/declarix-vs-customaite/');await page.evaluate(()=>document.fonts.ready);
   check(width+' one visible H1',await page.locator('h1').count()===1&&await page.locator('h1').isVisible());
   check(width+' no page overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   check(width+' table has nine rows',await page.locator('tbody tr').count()===9);
   check(width+' four alternatives',await page.locator('.option').count()===4);
   check(width+' metadata canonical',(await page.locator('link[rel=canonical]').getAttribute('href'))==='https://getdeclarix.com/compare/declarix-vs-customaite/');
   await page.keyboard.press('Tab');check(width+' skip link keyboard focus',await page.evaluate(()=>document.activeElement.className==='skip-link'));await page.keyboard.press('Enter');check(width+' skip reaches main',await page.evaluate(()=>location.hash==='#main'));
   const summary=page.locator('tbody details summary').first();await summary.focus();await page.keyboard.press('Enter');check(width+' evidence opens with keyboard',await page.locator('tbody details').first().getAttribute('open')!==null);check(width+' evidence scope readable',await page.locator('tbody details').first().innerText().then(t=>t.includes('UK H1')&&t.includes('Nadia')));
   const links=await page.locator('a').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')));
   for(const href of new Set(links.filter(x=>x.startsWith('#'))))check(width+' anchor '+href,await page.locator(href).count()===1);
   for(const href of new Set(links.filter(x=>x.startsWith('/'))))check(width+' local link '+href,(await page.request.get(origin+href)).status()===200);
   for(const option of await page.locator('.option>details').all()){await option.locator(':scope>summary').click();check(width+' alternative dimensions '+await option.locator('..').getAttribute('id'),await option.locator(':scope>dl>dt').count()===9)}
   check(width+' no tracking or third-party requests',requests.every(u=>u.startsWith(origin+'/')));check(width+' no runtime errors',errors.length===0);
   await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const axe=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));check(width+' WCAG automated scan: '+JSON.stringify(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),axe.violations.length===0);
   await page.screenshot({path:path.join(output,`P17-${width}.png`),fullPage:true});await context.close();
  }
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto(origin+'/compare/declarix-vs-customaite/');await page.locator('.option>details>summary').first().click();check('no-JS content and disclosures usable',await page.locator('.option>details').first().getAttribute('open')!==null);await context.close();
  check('one sitemap entry',(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').match(/declarix-vs-customaite/g)||[]).length===1);check('no alternatives route',!fs.existsSync(path.join(root,'alternatives/customaite/index.html')));
  fs.writeFileSync(path.join(output,'BROWSER_TESTS.json'),JSON.stringify({status:'PASS',checks:checks.length,names:checks,environment:'Local Chromium static build at 1440/768/390/320; automated WCAG scan; not live acceptance'},null,2));console.log(JSON.stringify({status:'PASS',checks:checks.length}));
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});

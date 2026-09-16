const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');const http=require('node:http');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../dist');const output=path.resolve(__dirname,'../output/product-scope');fs.mkdirSync(output,{recursive:true});
(async()=>{
 const checks=[];const check=(name,condition)=>{assert.ok(condition,name);checks.push(name)};
 const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');const file=path.resolve(root,'.'+decodeURIComponent(url.pathname),url.pathname.endsWith('/')?'index.html':'');if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}try{const bytes=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'application/octet-stream');res.end(bytes)}catch{res.writeHead(404).end()}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;const browser=await chromium.launch({headless:true});
 try{
  const { productScopeRoutes, scopeBoundary } = await import('../scripts/product-scope.mjs');
  for(const route of productScopeRoutes) for(const width of [1440,768,390,320]){
   const context=await browser.newContext({viewport:{width,height:1000}});const page=await context.newPage();const requests=[];const errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+route.path);await page.evaluate(()=>document.fonts.ready);
   const tag=route.path+' '+width;
   check(tag+' one visible H1',await page.locator('h1').count()===1&&await page.locator('h1').isVisible());
   check(tag+' no page overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   check(tag+' boundary visible and exact',await page.locator('.scope-boundary').isVisible()&&(await page.locator('.scope-boundary').innerText()).includes(scopeBoundary));
   check(tag+' boundary before detailed content',await page.evaluate(()=>Boolean(document.querySelector('.scope-boundary').compareDocumentPosition(document.querySelector('.content-grid'))&Node.DOCUMENT_POSITION_FOLLOWING)));
   check(tag+' canonical',(await page.locator('link[rel=canonical]').getAttribute('href'))==='https://getdeclarix.com'+route.path);
   check(tag+' no unsupported rendered claims',!(/CDS.ready|3[×x]|200 seconds|£\d|every (?:proposed )?field|supported export|ready for Sequoia/i.test(await page.locator('body').innerText())));
   check(tag+' correct social card',(await page.locator('meta[property="og:image"]').getAttribute('content'))==='https://getdeclarix.com/product-scope.png');
   const response=await page.request.get(origin+'/product-scope.png');check(tag+' social card served',response.status()===200);
   const schemas=await page.locator('script[type="application/ld+json"]').evaluateAll(xs=>xs.map(x=>JSON.parse(x.textContent)));
   check(tag+' schema matches current review',schemas.some(s=>s['@graph'].some(x=>x['@type']==='WebPage'&&x.dateModified==='2026-09-16'&&x.image==='https://getdeclarix.com/product-scope.png')));
   const links=await page.locator('a').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')));
   for(const href of new Set(links.filter(x=>x.startsWith('/'))))check(tag+' local link '+href,(await page.request.get(origin+href)).status()===200);
   check(tag+' safe enquiry copy',(await page.locator('.cta-band').innerText()).includes('Do not attach live customer documents'));
   check(tag+' no unexpected third-party requests',requests.every(u=>u.startsWith(origin+'/')));check(tag+' no runtime errors',errors.length===0);
   await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const axe=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));check(tag+' WCAG: '+JSON.stringify(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),axe.violations.length===0);
   await page.screenshot({path:path.join(output,`${route.path.split('/')[1]}-${width}.png`),fullPage:true});await page.screenshot({path:path.join(output,`${route.path.split('/')[1]}-${width}-hero.png`)});await context.close();
  }
  for(const route of productScopeRoutes){
   const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto(origin+route.path);check(route.path+' no-JS scope and enquiry usable',await page.locator('.scope-boundary').isVisible()&&await page.locator('.cta-band a').isVisible());await context.close();
   check(route.path+' dated sitemap entry',fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').includes('https://getdeclarix.com'+route.path+'</loc><lastmod>2026-09-16</lastmod>'));
   check(route.path+' current discovery description',fs.readFileSync(path.join(root,'llms.txt'),'utf8').includes(route.description));
  }
  fs.writeFileSync(path.join(output,'BROWSER_TESTS.json'),JSON.stringify({status:'PASS',checks:checks.length,names:checks,environment:'Local Chromium 1440/768/390/320, no-JS, metadata, links and automated WCAG; scope routes only, not whole-site claim clearance'},null,2));console.log(JSON.stringify({status:'PASS',checks:checks.length}));
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});

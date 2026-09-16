const {chromium}=require('playwright');
const {readFileSync,mkdirSync,writeFileSync,existsSync,statSync}=require('node:fs');
const {join,extname}=require('node:path');const http=require('node:http');const assert=require('node:assert/strict');
const root=join(__dirname,'..','dist');const output=join(__dirname,'..','output','legacy-offer-product');mkdirSync(output,{recursive:true});
const contract=JSON.parse(readFileSync(join(__dirname,'..','contracts','legacy-offer-product-draft-2026-09-16.json'),'utf8'));
const types={'.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.xml':'application/xml','.txt':'text/plain'};
const server=http.createServer((req,res)=>{let pathname=decodeURIComponent(new URL(req.url,'http://x').pathname);let file=join(root,pathname);if(pathname.endsWith('/'))file=join(file,'index.html');if(!existsSync(file)||statSync(file).isDirectory())file=join(root,'index.html');res.setHeader('content-type',types[extname(file)]||'application/octet-stream');res.end(readFileSync(file));});
const checks=[];const check=(name,value)=>{checks.push(name);assert.ok(value,name)};
const esc=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;const browser=await chromium.launch({headless:true});
try{
 for(const route of contract.reviewed_paths) for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();const requests=[];const errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(String(e)));await page.goto(origin+route,{waitUntil:'networkidle'});const tag=`${route} ${width}`;const body=await page.locator('body').innerText();
  check(tag+' one visible H1',await page.locator('h1').count()===1&&await page.locator('h1').isVisible());check(tag+' no overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));check(tag+' canonical',(await page.locator('link[rel=canonical]').getAttribute('href'))==='https://getdeclarix.com'+route);if(['/security/','/editorial-policy/'].includes(route))check(tag+' boundary visible',await page.locator('.limitations').isVisible());
  for(const claim of contract.prohibited_product_claims)check(tag+' excludes '+claim,!new RegExp(esc(claim),'i').test(body));
  check(tag+' no third-party request',requests.every(url=>url.startsWith(origin+'/')));check(tag+' no runtime error',errors.length===0);
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const axe=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));check(tag+' WCAG '+JSON.stringify(axe.violations.map(v=>v.id)),axe.violations.length===0);
  await page.screenshot({path:join(output,`${route.split('/')[1]}-${width}.png`),fullPage:true});await context.close();
 }
 const built=contract.reviewed_paths.map(route=>readFileSync(join(root,route,'index.html'),'utf8')).join('\n');for(const boundary of contract.required_boundaries)check('reviewed build boundary '+boundary,built.includes(boundary));
 writeFileSync(join(output,'BROWSER_TESTS.json'),JSON.stringify({status:'PASS',checks:checks.length,reviewedPaths:contract.reviewed_paths,environment:'Local Chromium 1440/390, rendered static routes, metadata, no third-party request and automated WCAG; not publication clearance'},null,2));console.log(JSON.stringify({status:'PASS',checks:checks.length}));
}finally{await browser.close();await new Promise(r=>server.close(r))}})().catch(error=>{console.error(error);process.exitCode=1});

import { packages, priceForVolume } from './pricing.mjs'
import { breadcrumbHtml, breadcrumbList, jsonLdScript, organizationNode, socialHead } from './site-graph.mjs'

export const roiRoute = {
  path: '/roi-calculator/',
  title: 'Customs Automation ROI Calculator for Brokers | Declarix',
  h1: 'How much more work could your desk take on?',
  description: 'Enter your declaration volume and clerk time to see the hours released, extra capacity and best-fit Declarix monthly package.',
  reviewedOn: '2026-10-16',
}

// Working hours in one clerk year: 37.5 hours a week × 46.4 weeks (52 weeks less the 5.6 weeks of statutory
// holiday). Source: https://www.gov.uk/holiday-entitlement-rights (checked 16 October 2026).
export const CLERK_HOURS_PER_YEAR = 1740

export const roiFaqs = [
  {
    question: 'How is the customs automation ROI worked out?',
    answer: 'Start with the clerk hours Declarix releases each month: monthly declarations × (current minutes − minutes with Declarix) ÷ 60. Those hours support more declarations at the new time per declaration. Add your loaded cost per clerk and the calculator values the released hours and takes off the monthly package fee, so you see the net monthly saving after the plan fee.',
  },
  {
    question: 'What is the loaded cost per clerk?',
    answer: 'It is the full yearly cost of one clerk: salary plus employer National Insurance, pension contributions and the desk, software and management costs that come with each person. The calculator divides it by 1,740 working hours a year (37.5 hours a week for 46.4 weeks, after 5.6 weeks of statutory holiday) to get an hourly cost.',
  },
  {
    question: 'How is this different from the customs declaration cost calculator?',
    answer: 'This calculator shows the capacity case: hours released, extra declarations and the Declarix package that fits your volume. The customs declaration cost calculator works out the labour cost of each declaration on your desk today, with annual hours, cost and a break-even price per entry.',
    link: { href: '/tools/customs-declaration-cost-calculator/', label: 'Open the customs declaration cost calculator' },
  },
]

export function calculateRoi(input) {
  const volume = Number(input.volume)
  const current = Number(input.currentMinutes)
  const withDeclarix = Number(input.withDeclarixMinutes)
  if (input.volume === '' || !Number.isSafeInteger(volume) || volume < 1 || volume > 1000000) throw new RangeError('Enter a whole monthly volume from 1 to 1,000,000.')
  if (input.currentMinutes === '' || !Number.isFinite(current) || current <= 0 || current > 1440) throw new RangeError('Enter current minutes per declaration, above 0 and up to 1,440.')
  if (input.withDeclarixMinutes === '' || !Number.isFinite(withDeclarix) || withDeclarix <= 0 || withDeclarix > current) throw new RangeError('Enter a positive time with Declarix no greater than current time.')
  const hours = volume * (current - withDeclarix) / 60
  const extraPacks = hours * 60 / withDeclarix
  const packageFit = priceForVolume(volume)
  const feeRaw = input.clientFee
  const captureRaw = input.captureRate
  let annualCapturedRevenue = null
  let netMonthlySaving = null
  let releasedLabourValue = null
  const loadedRaw = input.loadedCost == null ? '' : String(input.loadedCost).trim()
  if (loadedRaw !== '') {
    const loadedCost = Number(loadedRaw)
    if (!Number.isFinite(loadedCost) || loadedCost <= 0 || loadedCost > 10000000) throw new RangeError('Enter a loaded cost per clerk above £0 and up to £10,000,000 a year, or leave it blank.')
    releasedLabourValue = hours * loadedCost / 1740
    netMonthlySaving = releasedLabourValue - packageFit.total
  }
  if (feeRaw !== '' || captureRaw !== '') {
    if (feeRaw === '' || captureRaw === '') throw new RangeError('Enter both your client fee and capture rate, or leave both blank.')
    const fee = Number(feeRaw), capture = Number(captureRaw)
    if (!Number.isFinite(fee) || fee < 0 || fee > 1000000 || !Number.isFinite(capture) || capture < 0 || capture > 100) throw new RangeError('Enter a valid client fee and a capture rate from 0 to 100%.')
    annualCapturedRevenue = extraPacks * fee * 12 * capture / 100
  }
  return { hours, extraPacks, annualCapturedRevenue, packageFit, releasedLabourValue, netMonthlySaving }
}

function roiJsonLd(site) {
  return [
    organizationNode(site),
    { '@type': 'WebSite', '@id': `${site.origin}/#website`, name: 'Declarix', url: `${site.origin}/`, publisher: { '@id': `${site.origin}/#organization` } },
    {
      '@type': 'WebApplication',
      '@id': `${site.origin}${roiRoute.path}#application`,
      name: 'Customs desk capacity and ROI calculator',
      url: `${site.origin}${roiRoute.path}`,
      description: roiRoute.description,
      dateModified: roiRoute.reviewedOn,
      applicationCategory: 'BusinessApplication',
      browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      image: `${site.origin}/og.jpg`,
      isPartOf: { '@id': `${site.origin}/#website` },
      author: { '@id': `${site.origin}/#organization` },
      publisher: { '@id': `${site.origin}/#organization` },
    },
    breadcrumbList(site, roiRoute.path),
  ]
}

export function renderRoiCalculator(site, { navHtml, webmasterHtml = '' }) {
  const canonical = `${site.origin}${roiRoute.path}`
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow"><meta name="description" content="${roiRoute.description}"><title>${roiRoute.title}</title><link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="stylesheet" href="/static-routes.css"><link rel="stylesheet" href="/roi-calculator.css">${webmasterHtml}${socialHead(site, { title: roiRoute.title, description: roiRoute.description, path: roiRoute.path })}${jsonLdScript(roiJsonLd(site))}</head><body><div class="docket"><header class="masthead"><a class="wordmark" href="/">DECLARIX</a><div class="masthead-cell"><span>CORE OUTCOME</span><strong>UP TO 3×</strong></div><a class="masthead-cta" href="/?src=roi_calculator#book">BOOK THE NUMBERS CALL</a></header><nav class="route-nav" aria-label="Primary">${navHtml}</nav><div class="breadcrumbs">${breadcrumbHtml(roiRoute.path, 'ROI CALCULATOR')}</div><main><header class="hero roi-hero"><div class="hero-copy"><p class="eyebrow">FREE CAPACITY CALCULATOR</p><h1>${roiRoute.h1}</h1><p>Up to 3x more declarations per clerk. Put your own volume and time into the model, then see the package that fits.</p></div></header>
  <div class="roi-layout"><form id="roi-form" novalidate><h2>Start with capacity.</h2><p>Enter your monthly declaration packs and the clerk minutes used per declaration.</p>
    <label for="volume">1 · Declaration packs per month</label><input id="volume" name="volume" type="number" min="1" max="1000000" step="1" required inputmode="numeric" placeholder="e.g. 1000">
    <label for="currentMinutes">2 · Current clerk time per declaration (minutes)</label><input id="currentMinutes" name="currentMinutes" type="number" min="0.01" max="1440" step="any" required inputmode="decimal" placeholder="e.g. 24">
    <label for="withDeclarixMinutes">3 · Clerk time with Declarix (minutes)</label><input id="withDeclarixMinutes" name="withDeclarixMinutes" type="number" min="0.01" max="1440" step="any" required inputmode="decimal" placeholder="e.g. 8">
    <div class="roi-extra"><h3>Net saving after the plan fee (optional)</h3><label for="loadedCost">Loaded cost per clerk (£/year)</label><input id="loadedCost" name="loadedCost" type="number" min="1" max="10000000" step="any" inputmode="decimal" placeholder="e.g. 38000"><p class="roi-hint">Salary plus employer National Insurance, pension and desk costs.</p></div>
    <div class="roi-extra"><h3>Value the extra capacity (optional)</h3><label for="clientFee">Your fee to clients per extra declaration (£)</label><input id="clientFee" name="clientFee" type="number" min="0" max="1000000" step="any" inputmode="decimal" placeholder="Your fee"><label for="captureRate">Share of extra capacity you expect to sell (%)</label><input id="captureRate" name="captureRate" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="e.g. 20"></div>
    <button type="submit" class="button">SHOW MY CAPACITY →</button><p id="roi-error" role="alert" aria-live="polite"></p></form>
    <section class="roi-results" id="roi-results" aria-live="polite"><span class="section-label">YOUR CAPACITY CASE</span><h2>More work. Same team.</h2><p>Enter your desk numbers to see what the released time can support.</p></section></div>
    <aside class="hero-ledger roi-ledger"><span class="route-ref">YOUR DESK · YOUR NUMBERS</span><div class="stamp">MORE<br>CAPACITY</div></aside>
    <section class="roi-method" id="how-the-capacity-case-is-worked-out"><h2>How the capacity case is worked out</h2><div class="roi-formulas"><p><b>Released clerk hours / month</b><code>MONTHLY DECLARATIONS × (CURRENT MINUTES − MINUTES WITH DECLARIX) ÷ 60</code></p><p><b>Extra declarations / month</b><code>RELEASED HOURS × 60 ÷ MINUTES WITH DECLARIX</code></p><p><b>Net monthly saving after the plan fee</b><code>RELEASED HOURS × LOADED COST PER CLERK ÷ ${CLERK_HOURS_PER_YEAR.toLocaleString('en-GB')} − MONTHLY PACKAGE FEE</code></p><p><b>Extra billable revenue / year</b><code>EXTRA DECLARATIONS × YOUR FEE × 12 × CAPTURE RATE</code></p></div><p>Released clerk hours per month = monthly declarations × (current minutes − minutes with Declarix) ÷ 60. Extra declarations supported by that time = released hours × 60 ÷ minutes with Declarix. If you add your client fee and expected capture rate, annual extra billable revenue = extra declarations × fee × 12 × capture rate. The package is the lowest monthly charge at your entered volume, including overage. Above 3,000 packs, the quoted rate is £3.00 per pack.</p><p>Your entries stay on this page and are not submitted to Declarix. The model follows the “ROI Model” worksheet in the Declarix broker ROI workbook; monthly time inputs replace the sheet’s daily clerk throughput inputs. Revenue from extra work is shown separately from released labour time, so the same hours are not counted twice.</p><p>Want the cost of each declaration on your desk today? Run the <a href="/tools/customs-declaration-cost-calculator/">customs declaration cost calculator</a>.</p><a href="/pricing/">SEE ALL PACKAGES →</a></section>
    <section class="roi-faq" aria-labelledby="roi-faq-heading"><span class="section-label">ROI CALCULATOR QUESTIONS</span><h2 id="roi-faq-heading">Customs automation ROI: your questions</h2>${roiFaqs.map((faq) => `<details class="roi-faq-item"><summary>${faq.question}</summary><p>${faq.answer}</p>${faq.link ? `<p><a href="${faq.link.href}">${faq.link.label} →</a></p>` : ''}</details>`).join('')}</section></main><footer class="footer"><span>DECLARIX LIMITED · LEICESTER, ENGLAND</span><nav><a href="/pricing/">PRICING</a><a href="/privacy/">PRIVACY</a></nav></footer></div>
<script>const packages = ${JSON.stringify(packages)}; const priceForVolume = ${priceForVolume.toString()}; const calculateRoi = ${calculateRoi.toString()};
const form=document.getElementById('roi-form'), results=document.getElementById('roi-results'),error=document.getElementById('roi-error'); const num=new Intl.NumberFormat('en-GB',{maximumFractionDigits:0}),money=new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0});
form.addEventListener('input',()=>{results.innerHTML='<span class="section-label">YOUR CAPACITY CASE</span><h2>More work. Same team.</h2><p>Calculate again to update your result.</p>';error.textContent=''});
form.addEventListener('submit',e=>{e.preventDefault();try{const model=calculateRoi(Object.fromEntries(new FormData(form)));const p=model.packageFit;error.textContent='';results.innerHTML='<span class="section-label">YOUR CAPACITY CASE</span><h2>More work. Same team.</h2><div class="roi-metric"><span>4 · Clerk hours released / month</span><strong>'+num.format(model.hours)+'</strong></div><div class="roi-metric"><span>5 · Extra declarations those hours support / month</span><strong>'+num.format(model.extraPacks)+'</strong></div>'+(model.netMonthlySaving===null?'':'<div class="roi-metric roi-net"><span>Net monthly saving after the plan fee</span><strong>'+(model.netMonthlySaving<0?'−':'')+money.format(Math.abs(model.netMonthlySaving))+'</strong><p>'+money.format(model.releasedLabourValue)+' of released clerk time − '+p.name+' '+money.format(p.total)+' / month</p></div>')+(model.annualCapturedRevenue===null?'':'<div class="roi-metric"><span>Potential extra billable revenue / year at your capture rate</span><strong>'+money.format(model.annualCapturedRevenue)+'</strong></div>')+'<div class="roi-plan"><span>6 · Your best-fit package</span><h3>'+p.name+'</h3><p>'+money.format(p.total)+' / month'+(p.quoted?' · quoted at £3.00 per pack':' · '+num.format(p.included)+' included + '+num.format(p.overage)+' extra at £'+p.rate.toFixed(2)+' each')+'</p><p>At this volume, '+money.format(p.total*12)+' / year.</p></div><a class="button" href="/?src=roi_calculator#book">DISCUSS MY NUMBERS →</a>';}catch(err){error.textContent=err.message;results.innerHTML='<span class="section-label">YOUR CAPACITY CASE</span><h2>More work. Same team.</h2><p>Correct your inputs to calculate your result.</p>'}});
</script></body></html>`
}

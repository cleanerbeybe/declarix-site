// Post-build step: the agent-readable layer (X1 items 2, 3, 5, 6, 7, 13).
// Runs after generate-static-routes.mjs and before verify-build.mjs. It only reads
// dist/ and the source modules and only ADDS files, head links and one footer link,
// so it never changes the words of an existing page.
//
//  - /for-ai-assistants/          facts page (chrome cloned from the built /about/ page)
//  - /<path>.md (home: /index.md)  Markdown twin of every sitemap page, made from its built <main>
//  - /api/{pricing,product,tools}.json, /agents/SKILL.md
//  - /feed.xml, /research/cds-operations-radar/feed.{xml,json}
//  - <link rel="alternate"> tags, WebMCP hooks on the free tools, llms.txt section

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  agentFactsJsonLd,
  agentFactsRoute,
  agentFiles,
  agentLayerReviewedOn,
  markdownPath,
  pricingJson,
  productJson,
  renderAgentFactsMain,
  skillMarkdown,
  toolsJson,
} from './agent-facts.mjs'
import { decodeEntities, findElement, htmlToMarkdown, parseHtml } from './html-to-markdown.mjs'
import { packages, priceForVolume } from './pricing.mjs'
import { radarHub, radarRecords } from './radar.mjs'
import { calculateRoi } from './roi-calculator.mjs'
import { site } from './routes.mjs'
import { tools as packTools } from './tools.mjs'
import { calculateValueDutyScenario } from './value-duty-workpapers.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')
const MARK = 'data-agent-layer'

// Offer pages get no new visible words without the owner's approval (BUILD-BRIEF). They still get invisible head links.
export const offerPaths = new Set(['/', '/pricing/', '/pilot/', '/pricing-policy/'])

const escapeXml = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const htmlFile = (path) => (path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html'))
const attr = (html, pattern) => decodeEntities(html.match(pattern)?.[1] || '').trim()

function replaceOnce(html, pattern, replacement, label) {
  const count = (html.match(new RegExp(pattern.source, `${pattern.flags.replace('g', '')}g`)) || []).length
  if (count !== 1) throw new Error(`agent-layer: expected one ${label} in the /about/ template, found ${count}`)
  return html.replace(pattern, replacement)
}

// 1. Facts page, using the built /about/ page as the shell so it always matches the current site chrome.
async function writeAgentFactsPage(pages) {
  const template = await readFile(htmlFile('/about/'), 'utf8')
  const canonical = `${site.origin}${agentFactsRoute.path}`
  // Strip anything this script added on an earlier run so the clone starts clean.
  let html = template
    .replace(new RegExp(`\\s*<link [^>]*${MARK}="[^"]*" />`, 'g'), '')
    .replace(new RegExp(`<a [^>]*${MARK}="footer">[^<]*</a>`, 'g'), '')
    .replace(new RegExp(`\\s*<script ${MARK}="[^"]*">[\\s\\S]*?</script>`, 'g'), '')
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeXml(agentFactsRoute.title)}</title>`, 'title')
  html = replaceOnce(html, /(<meta\s+name="description"\s+content=")[^"]*(")/i, `$1${escapeXml(agentFactsRoute.description)}$2`, 'meta description')
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`, 'canonical')
  for (const [name, value] of [
    ['og:title', agentFactsRoute.title],
    ['og:description', agentFactsRoute.description],
    ['og:url', canonical],
    ['twitter:title', agentFactsRoute.title],
    ['twitter:description', agentFactsRoute.description],
  ]) {
    const key = name.startsWith('og:') ? 'property' : 'name'
    html = html.replace(new RegExp(`(<meta ${key}="${name}" content=")[^"]*(")`), `$1${escapeXml(value)}$2`)
  }
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
  html = replaceOnce(
    html,
    /<\/head>/,
    `    <script type="application/ld+json">${agentFactsJsonLd()}</script>\n    <style>.agent-facts a,.agent-facts code{overflow-wrap:anywhere}</style>\n  </head>`,
    'head end',
  )
  html = replaceOnce(html, /<div class="breadcrumbs">[\s\S]*?<\/div>/, '<div class="breadcrumbs"><a href="/">HOME</a> → FOR AI ASSISTANTS</div>', 'breadcrumbs')
  html = replaceOnce(html, /<main>[\s\S]*<\/main>/, `<main>\n        ${renderAgentFactsMain(pages)}\n      </main>`, 'main')
  html = html.replaceAll('src=static_about', 'src=static_for-ai-assistants')
  const target = htmlFile(agentFactsRoute.path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, html)
}

async function readSitemap() {
  const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8')
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
    path: new URL(body.match(/<loc>(.*?)<\/loc>/)[1]).pathname,
    lastmod: body.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || site.reviewedOn,
  }))
  return { sitemap, entries }
}

async function pageMeta({ path, lastmod }) {
  const html = await readFile(htmlFile(path), 'utf8')
  const h1 = findElement(parseHtml(html.slice(html.indexOf('<body'))), (node) => node.tag === 'h1')
  return {
    path,
    lastmod,
    title: attr(html, /<title>([\s\S]*?)<\/title>/),
    description: attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
    h1: h1 ? decodeEntities(collectText(h1)).replace(/\s+/g, ' ').trim() : '',
  }
}
const collectText = (node) => (node.text !== undefined ? node.text : (node.children || []).map(collectText).join(''))

// 2. Markdown twin of a built page. The body is converted from the page's own <main>
// (home: the pre-rendered #root shell), so it cannot say anything the HTML does not.
async function writeMarkdownTwin(page) {
  const html = await readFile(htmlFile(page.path), 'utf8')
  const tree = parseHtml(html)
  const container =
    page.path === '/'
      ? findElement(tree, (node) => node.attrs?.id === 'root')
      : findElement(tree, (node) => node.tag === 'main')
  if (!container) throw new Error(`agent-layer: ${page.path} has no main content to convert`)
  let body = htmlToMarkdown(container, { origin: site.origin, pagePath: page.path })
  // The H1 leads the header block, so drop its first copy from the body.
  body = body.replace(/^# .*\n+/m, '')
  const canonical = `${site.origin}${page.path}`
  const twin = `# ${page.h1}

> ${page.description}

- Canonical: ${canonical}
- Last reviewed: ${page.lastmod}
- Publisher: ${site.company} (Companies House ${site.companyNumber}) · ${site.origin}/
- Format: Markdown copy of the HTML page, generated from the same build

---

${body}`
  const target = join(dist, markdownPath(page.path).slice(1))
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, twin)
  return twin
}

// 3. Head links, footer link and WebMCP hooks on built HTML.
function webmcpScript(path) {
  const common = `const mc = navigator.modelContext;
        if (!mc || (typeof mc.registerTool !== 'function' && typeof mc.provideContext !== 'function')) return;
        const page = location.origin + location.pathname;
        const booking = location.origin + '/#book';
        const note = (name) => { try { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'webmcp_tool_call', tool_name: name, page_path: location.pathname }); } catch (error) {} };
        const reply = (data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] });
        const round = (value) => Math.round(value * 100) / 100;`
  const register = `if (typeof mc.registerTool === 'function') tools.forEach((tool) => { try { mc.registerTool(tool); } catch (error) {} });
        else mc.provideContext({ tools });`
  let toolsSource = ''
  if (path === '/tools/customs-value-import-duty-vat-calculator/') {
    toolsSource = `const calculateValueDutyScenario = ${calculateValueDutyScenario.toString()};
        const tools = [{
          name: 'calculate_customs_value_duty_vat',
          description: 'Calculate a UK customs value, ad valorem import duty, import VAT value and import VAT from amounts and rates the user supplies, using the same formula as this Declarix workpaper. Returns the figures and a link that reopens the scenario on this page.',
          annotations: { readOnlyHint: true },
          inputSchema: {
            type: 'object',
            properties: {
              goodsAmount: { type: 'number', minimum: 0.01, maximum: 100000000, description: 'Invoice goods amount in the invoice currency' },
              fxRate: { type: 'number', minimum: 0.0001, maximum: 1000000, description: 'Invoice-currency units per GBP 1 (enter 1 if the invoice is in GBP)' },
              freight: { type: 'number', minimum: 0, description: 'Freight to the UK border, GBP' },
              insurance: { type: 'number', minimum: 0, description: 'Insurance to the UK border, GBP' },
              additions: { type: 'number', minimum: 0, description: 'Other additions to customs value, GBP' },
              deductions: { type: 'number', minimum: 0, description: 'Deductions from customs value, GBP' },
              dutyRate: { type: 'number', minimum: 0, maximum: 1000, description: 'Ad valorem duty rate, percent' },
              otherImportCharges: { type: 'number', minimum: 0, description: 'Other import charges, GBP' },
              incidentalExpenses: { type: 'number', minimum: 0, description: 'Incidental expenses to the first UK destination, GBP' },
              vatRate: { type: 'number', minimum: 0, maximum: 100, description: 'Import VAT rate, percent' },
              units: { type: 'number', exclusiveMinimum: 0, maximum: 100000000, description: 'Optional: units in the shipment, for duty + VAT and landed cost per unit' }
            },
            required: ['goodsAmount', 'fxRate', 'dutyRate', 'vatRate']
          },
          async execute(input) {
            note('calculate_customs_value_duty_vat');
            const keys = ['goodsAmount', 'fxRate', 'freight', 'insurance', 'additions', 'deductions', 'dutyRate', 'otherImportCharges', 'incidentalExpenses', 'vatRate'];
            const value = Object.fromEntries(keys.map((key) => [key, Number(input && input[key] != null ? input[key] : 0)]));
            if (input && input.units != null) value.units = Number(input.units);
            try {
              const scenario = calculateValueDutyScenario(value);
              const params = { g: value.goodsAmount, x: value.fxRate, f: value.freight, i: value.insurance, a: value.additions, d: value.deductions, r: value.dutyRate, o: value.otherImportCharges, e: value.incidentalExpenses, v: value.vatRate };
              if ('units' in value) params.u = value.units;
              const url = new URL(page);
              Object.entries(params).forEach(([key, entry]) => url.searchParams.set(key, entry));
              return reply({ currency: 'GBP', inputs: value, results: Object.fromEntries(Object.entries(scenario).map(([key, entry]) => [key, round(entry)])), open_on_page: url.toString(), book_a_call: booking });
            } catch (error) {
              return reply({ error: String(error && error.message || error) });
            }
          }
        }];`
  } else if (path === '/tools/customs-declaration-cost-calculator/') {
    toolsSource = `const fields = { declarations_per_week: 'declarations', current_minutes: 'current-minutes', hourly_cost_gbp: 'hourly-cost', target_minutes: 'target-minutes', working_weeks: 'working-weeks' };
        const shareKeys = { declarations_per_week: 'd', current_minutes: 'm', hourly_cost_gbp: 'c', target_minutes: 't', working_weeks: 'w' };
        const outputs = ['annual-entries', 'current-hours', 'current-cost', 'target-hours', 'target-cost', 'recoverable-hours', 'capacity-entries', 'capacity-weekly', 'labour-headroom', 'break-even', 'current-entry-cost', 'target-entry-cost'];
        const tools = [{
          name: 'calculate_customs_declaration_labour_cost',
          description: 'Run the Declarix customs declaration cost calculator on this page: labour cost per declaration, annual hours and cost, recoverable clerk hours, extra entries and labour-only break-even, from desk numbers the user supplies. Fills the visible form so the user sees the same result.',
          annotations: { readOnlyHint: true },
          inputSchema: {
            type: 'object',
            properties: {
              declarations_per_week: { type: 'number', minimum: 1, maximum: 100000 },
              current_minutes: { type: 'number', minimum: 0.5, maximum: 480, description: 'Current clerk minutes per declaration' },
              hourly_cost_gbp: { type: 'number', minimum: 1, maximum: 500, description: 'Loaded clerk cost per hour, GBP' },
              target_minutes: { type: 'number', minimum: 0.5, maximum: 480, description: 'Target review minutes per declaration' },
              working_weeks: { type: 'number', minimum: 1, maximum: 52 }
            },
            required: ['declarations_per_week', 'current_minutes', 'hourly_cost_gbp', 'target_minutes']
          },
          async execute(input) {
            note('calculate_customs_declaration_labour_cost');
            const url = new URL(page);
            for (const [key, id] of Object.entries(fields)) {
              const element = document.getElementById(id);
              if (!element) return reply({ error: 'Calculator form not found on this page.' });
              if (input && input[key] != null) {
                element.value = String(input[key]);
                element.dispatchEvent(new Event('input', { bubbles: true }));
              }
              url.searchParams.set(shareKeys[key], element.value);
            }
            const form = document.getElementById('declarations').form;
            if (form && !form.checkValidity()) {
              const invalid = Object.entries(fields).filter(([, id]) => !document.getElementById(id).checkValidity()).map(([key, id]) => key + ': ' + document.getElementById(id).validationMessage);
              return reply({ error: 'Inputs outside the calculator range.', details: invalid });
            }
            const results = Object.fromEntries(outputs.map((id) => [id.replace(/-/g, '_'), (document.getElementById(id) || {}).textContent || '']));
            return reply({ currency: 'GBP', inputs: Object.fromEntries(Object.entries(fields).map(([key, id]) => [key, Number(document.getElementById(id).value)])), results, open_on_page: url.toString(), book_a_call: booking });
          }
        }];`
  } else if (path === '/roi-calculator/') {
    toolsSource = `const packages = ${JSON.stringify(packages)};
        const priceForVolume = ${priceForVolume.toString()};
        const calculateRoi = ${calculateRoi.toString()};
        const tools = [{
          name: 'estimate_declarix_capacity_and_package',
          description: 'Estimate the clerk hours Declarix releases each month, the extra declarations those hours support and the best-fit Declarix monthly package for a volume, using the same model as this calculator and the published Declarix packages.',
          annotations: { readOnlyHint: true },
          inputSchema: {
            type: 'object',
            properties: {
              volume: { type: 'integer', minimum: 1, maximum: 1000000, description: 'Declaration packs per month' },
              currentMinutes: { type: 'number', exclusiveMinimum: 0, maximum: 1440, description: 'Current clerk minutes per declaration' },
              withDeclarixMinutes: { type: 'number', exclusiveMinimum: 0, maximum: 1440, description: 'Clerk minutes per declaration with Declarix' },
              clientFee: { type: 'number', minimum: 0, description: 'Optional: fee charged to clients per extra declaration, GBP' },
              captureRate: { type: 'number', minimum: 0, maximum: 100, description: 'Optional: share of extra capacity expected to sell, percent' },
              loadedCost: { type: 'number', exclusiveMinimum: 0, maximum: 10000000, description: 'Optional: loaded cost per clerk, GBP a year, for the net monthly saving after the plan fee' }
            },
            required: ['volume', 'currentMinutes', 'withDeclarixMinutes']
          },
          async execute(input) {
            note('estimate_declarix_capacity_and_package');
            const text = (value) => value == null ? '' : String(value);
            try {
              const model = calculateRoi({ volume: text(input && input.volume), currentMinutes: text(input && input.currentMinutes), withDeclarixMinutes: text(input && input.withDeclarixMinutes), clientFee: text(input && input.clientFee), captureRate: text(input && input.captureRate), loadedCost: text(input && input.loadedCost) });
              return reply({ currency: 'GBP', clerk_hours_released_per_month: round(model.hours), extra_declarations_per_month: round(model.extraPacks), annual_extra_billable_revenue: model.annualCapturedRevenue === null ? null : round(model.annualCapturedRevenue), best_fit_package: model.packageFit, annual_package_cost: model.packageFit.total * 12, net_monthly_saving_after_plan_fee: model.netMonthlySaving === null ? null : round(model.netMonthlySaving), pricing: location.origin + '/pricing/', book_a_call: booking });
            } catch (error) {
              return reply({ error: String(error && error.message || error) });
            }
          }
        }];`
  } else if (path === '/tools/customs-document-pack-check/') {
    const tool = packTools.find((candidate) => candidate.path === path)
    const groups = tool.groups.map((group) => ({ code: group.code, title: group.title, priority: group.priorityLabel, question: group.note, prompts: group.prompts }))
    toolsSource = `const groups = ${JSON.stringify(groups)};
        const tools = [{
          name: 'list_customs_document_pack_prompts',
          description: 'List the 24 customs document handoff prompts used by the free Declarix pack checker, grouped and prioritised, so an assistant can walk a user through which evidence and decisions are mapped before a UK customs declaration is prepared.',
          annotations: { readOnlyHint: true },
          inputSchema: { type: 'object', properties: {} },
          async execute() {
            note('list_customs_document_pack_prompts');
            return reply({ groups, use_on_page: page, book_a_call: booking });
          }
        }];`
  } else return ''
  return `<script ${MARK}="webmcp">
      (() => {
        try {
        ${common}
        ${toolsSource}
        ${register}
        } catch (error) {}
      })();
    </script>`
}

function decoratePage(html, path) {
  if (html.includes(`${MARK}=`)) return html
  const links = [
    `<link rel="alternate" type="text/markdown" href="${markdownPath(path)}" title="Markdown version" ${MARK}="md" />`,
    `<link rel="alternate" type="application/atom+xml" href="${agentFiles.siteFeed}" title="Declarix: new and updated pages" ${MARK}="feed" />`,
  ]
  if (path.startsWith(radarHub.path)) {
    links.push(`<link rel="alternate" type="application/atom+xml" href="${agentFiles.radarFeed}" title="CDS Operations Radar" ${MARK}="radar-feed" />`)
    links.push(`<link rel="alternate" type="application/feed+json" href="${agentFiles.radarJsonFeed}" title="CDS Operations Radar (JSON Feed)" ${MARK}="radar-json-feed" />`)
  }
  let out = html.replace(/<\/head>/i, `  ${links.join('\n    ')}\n  </head>`)
  if (!offerPaths.has(path) && path !== agentFactsRoute.path) {
    out = out.replace(/(<footer class="footer">[\s\S]*?)(<\/nav>)/, `$1<a href="${agentFactsRoute.path}" ${MARK}="footer">FOR AI ASSISTANTS</a>$2`)
  }
  const script = webmcpScript(path)
  if (script) out = out.replace(/<\/body>/i, `  ${script}\n  </body>`)
  return out
}

// 4. Feeds.
function siteFeed(pages) {
  const sorted = [...pages].sort((a, b) => b.lastmod.localeCompare(a.lastmod) || a.path.localeCompare(b.path))
  const updated = `${sorted[0].lastmod}T00:00:00Z`
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Declarix: new and updated pages</title>
  <subtitle>New and reviewed pages on getdeclarix.com: customs tools, CDS research, workflows and Declarix product facts.</subtitle>
  <link rel="self" type="application/atom+xml" href="${site.origin}${agentFiles.siteFeed}" />
  <link rel="alternate" type="text/html" href="${site.origin}/" />
  <id>${site.origin}${agentFiles.siteFeed}</id>
  <updated>${updated}</updated>
  <author><name>${escapeXml(site.company)}</name><uri>${site.origin}/</uri><email>${site.contact}</email></author>
  <rights>© ${escapeXml(site.company)}</rights>
${sorted
  .map(
    (page) => `  <entry>
    <title>${escapeXml(page.title)}</title>
    <link rel="alternate" type="text/html" href="${site.origin}${page.path}" />
    <link rel="alternate" type="text/markdown" href="${site.origin}${markdownPath(page.path)}" />
    <id>${site.origin}${page.path}</id>
    <updated>${page.lastmod}T00:00:00Z</updated>
    <summary>${escapeXml(page.description)}</summary>
  </entry>`,
  )
  .join('\n')}
</feed>
`
}

const recordDates = (record) => {
  const history = (record.history || []).map((event) => event.observedAt).filter(Boolean).sort()
  return {
    published: history[0] || record.observedAt,
    updated: history.at(-1) || record.observedAt,
  }
}

function radarAtom() {
  const records = [...radarRecords].sort((a, b) => recordDates(b).updated.localeCompare(recordDates(a).updated))
  const updated = records.length ? recordDates(records[0]).updated : `${agentLayerReviewedOn}T00:00:00Z`
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>CDS Operations Radar | Declarix</title>
  <subtitle>${escapeXml(radarHub.description)}</subtitle>
  <link rel="self" type="application/atom+xml" href="${site.origin}${agentFiles.radarFeed}" />
  <link rel="alternate" type="text/html" href="${site.origin}${radarHub.path}" />
  <id>${site.origin}${agentFiles.radarFeed}</id>
  <updated>${updated}</updated>
  <author><name>${escapeXml(site.company)}</name><uri>${site.origin}/</uri></author>
${records
  .map((record) => {
    const dates = recordDates(record)
    return `  <entry>
    <title>${escapeXml(record.title)}</title>
    <link rel="alternate" type="text/html" href="${site.origin}${record.path}" />
    <link rel="alternate" type="text/markdown" href="${site.origin}${markdownPath(record.path)}" />${record.source?.url ? `\n    <link rel="related" href="${escapeXml(record.source.url)}" title="${escapeXml(record.source.publisher || 'Primary source')}" />` : ''}
    <id>${site.origin}${record.path}</id>
    <published>${dates.published}</published>
    <updated>${dates.updated}</updated>
${(record.topics || []).map((topic) => `    <category term="${escapeXml(topic)}" />`).join('\n')}
    <summary>${escapeXml(record.summary || record.description || '')}</summary>
  </entry>`
  })
  .join('\n')}
</feed>
`
}

function radarJsonFeed() {
  const records = [...radarRecords].sort((a, b) => recordDates(b).updated.localeCompare(recordDates(a).updated))
  return `${JSON.stringify(
    {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'CDS Operations Radar | Declarix',
      home_page_url: `${site.origin}${radarHub.path}`,
      feed_url: `${site.origin}${agentFiles.radarJsonFeed}`,
      description: radarHub.description,
      language: 'en-GB',
      authors: [{ name: site.company, url: `${site.origin}/` }],
      items: records.map((record) => {
        const dates = recordDates(record)
        return {
          id: `${site.origin}${record.path}`,
          url: `${site.origin}${record.path}`,
          title: record.title,
          summary: record.summary || record.description || '',
          content_text: record.summary || record.description || '',
          date_published: dates.published,
          date_modified: dates.updated,
          tags: record.topics || [],
          ...(record.source?.url ? { external_url: record.source.url } : {}),
        }
      }),
    },
    null,
    2,
  )}\n`
}

// 5. llms.txt / llms-full.txt: one isolated section, inserted before "Contact and corrections".
function llmsSection() {
  const origin = site.origin
  return `## For AI assistants and agents
- [${agentFactsRoute.title}](${origin}${agentFactsRoute.path}): ${agentFactsRoute.description}
- [Declarix agent skill](${origin}${agentFiles.skill}): When Declarix fits a request, the key facts and how to use the free tools, prefilled links and in-browser tool calls.
- [Pricing data (JSON)](${origin}${agentFiles.pricing}): Packages, extra-pack rates, pilot terms and the worked example, generated from the pricing page source.
- [Product data (JSON)](${origin}${agentFiles.product}): What Declarix does, supported systems, key facts and company identity.
- [Free tools data (JSON)](${origin}${agentFiles.tools}): Every free tool with its inputs, outputs and prefilled links.
- [New and updated pages (Atom)](${origin}${agentFiles.siteFeed}): Every page with its last review date.
- [CDS Operations Radar (Atom)](${origin}${agentFiles.radarFeed}): Source-stamped HMRC CDS records as a feed (also as [JSON Feed](${origin}${agentFiles.radarJsonFeed})).
- Markdown copies: every page has a Markdown copy at the same path ending in .md, for example ${origin}${markdownPath('/pricing/')} and ${origin}${markdownPath('/')}.
`
}

async function addLlmsSection(filename) {
  const file = join(dist, filename)
  const content = await readFile(file, 'utf8')
  if (content.includes('## For AI assistants and agents')) return
  const section = llmsSection()
  const anchor = content.indexOf('\n## Contact and corrections')
  const next = anchor === -1 ? `${content.replace(/\n*$/, '\n')}\n${section}` : `${content.slice(0, anchor + 1)}${section}\n${content.slice(anchor + 1)}`
  await writeFile(file, next)
}

// Run.
let { sitemap, entries } = await readSitemap()
if (!entries.some((entry) => entry.path === agentFactsRoute.path)) {
  sitemap = sitemap.replace('</urlset>', `  <url><loc>${site.origin}${agentFactsRoute.path}</loc><lastmod>${agentFactsRoute.reviewedOn}</lastmod></url>\n</urlset>`)
  await writeFile(join(dist, 'sitemap.xml'), sitemap)
  entries = [...entries, { path: agentFactsRoute.path, lastmod: agentFactsRoute.reviewedOn }]
}

const basePages = await Promise.all(entries.filter((entry) => entry.path !== agentFactsRoute.path).map(pageMeta))
await writeAgentFactsPage(basePages)
const pages = await Promise.all(entries.map(pageMeta))

for (const page of pages) {
  const file = htmlFile(page.path)
  await writeFile(file, decoratePage(await readFile(file, 'utf8'), page.path))
}
for (const page of pages) await writeMarkdownTwin(page)

await mkdir(join(dist, 'api'), { recursive: true })
await mkdir(join(dist, 'agents'), { recursive: true })
await writeFile(join(dist, agentFiles.pricing.slice(1)), `${JSON.stringify(pricingJson(), null, 2)}\n`)
await writeFile(join(dist, agentFiles.product.slice(1)), `${JSON.stringify(productJson(), null, 2)}\n`)
await writeFile(join(dist, agentFiles.tools.slice(1)), `${JSON.stringify(toolsJson(pages), null, 2)}\n`)
await writeFile(join(dist, agentFiles.skill.slice(1)), skillMarkdown(pages))
await writeFile(join(dist, agentFiles.siteFeed.slice(1)), siteFeed(pages))
await mkdir(join(dist, radarHub.path.slice(1)), { recursive: true })
await writeFile(join(dist, agentFiles.radarFeed.slice(1)), radarAtom())
await writeFile(join(dist, agentFiles.radarJsonFeed.slice(1)), radarJsonFeed())
await addLlmsSection('llms.txt')
await addLlmsSection('llms-full.txt')

console.log(`Agent layer: ${pages.length} Markdown twins, /for-ai-assistants/, 3 JSON files, SKILL.md, 3 feeds, WebMCP on ${pages.filter((page) => webmcpScript(page.path)).length} tools`)

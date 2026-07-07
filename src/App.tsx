import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { TextPlugin } from 'gsap/TextPlugin'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { CONFIG, isConfigured } from './config'
import { initAnalytics, track } from './analytics'
import { documents, flights, mobileMovements, packRows, questions, specimens } from './data'
import { PaperWorld } from './world'

type ButtonTone = 'primary' | 'secondary'
type BookingStatus = 'loading' | 'ready' | 'missing' | 'error'

declare global {
  interface Window {
    Bookings?: {
      inlineEmbed: (options: { url: string; parent: string; height: string }) => void
    }
  }
}

function appPath(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  if (!base) return path
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function getStoredSource() {
  const params = new URLSearchParams(window.location.search)
  const fromUrl = params.get('src')
  if (fromUrl) {
    sessionStorage.setItem('dclrx-src', fromUrl)
    return fromUrl
  }
  return sessionStorage.getItem('dclrx-src') || 'direct'
}

function buildMailto(src: string) {
  const subject = encodeURIComponent(`Ugly pack — [your company] — via DCLRX-H1/${src}`)
  const body = encodeURIComponent(
    'Attached: one anonymised job.\nOur declaration system: [Sequoia / Descartes / other]\nDeclarations per week, roughly: [ ]\nSend the pack back to: [ ]',
  )
  return `mailto:${CONFIG.packEmail}?subject=${subject}&body=${body}`
}

const costPresets = [
  {
    title: 'THE 12-CLERK DESK',
    volume: 480,
    lines: ['480 DECLARATIONS / WK', 'COST / DECLARATION £7.95 → £2.45', 'BOTTOM LINE £137,280 / YR'],
    close: ['THE CAPACITY OF ~3 MORE CLERKS. HIRED BY NOBODY.'],
  },
  {
    title: 'THE 6-CLERK DESK',
    volume: 210,
    lines: ['210 DECLARATIONS / WK', 'COST / DECLARATION £7.95 → £2.45', 'BOTTOM LINE £60,060 / YR'],
    close: ['PEAK SEASON STOPS MEANING OVERTIME.'],
  },
  {
    title: 'THE GROWTH PROBLEM',
    volume: null,
    lines: ['BOOK UP 40% · HEADCOUNT FLAT', 'NEW BUSINESS AT £2.45 A DECLARATION, NOT £7.95'],
    close: ['GROW DECLARATIONS, NOT PAYROLL.', 'SAME-DAY ANSWERS YOUR CUSTOMERS CAN FEEL.'],
  },
]

const spineLinks = [
  { number: 1, label: 'Hero', href: '#top' },
  { number: 2, label: 'Job', href: '#job' },
  { number: 3, label: 'Numbers', href: '#numbers' },
  { number: 4, label: 'Files', href: '#files' },
  { number: 5, label: 'System', href: '#system' },
  { number: 6, label: 'Security', href: '#security' },
  { number: 7, label: 'Questions', href: '#questions' },
  { number: 8, label: 'Pilot', href: '#pilot' },
  { number: 9, label: 'Book', href: '#book' },
]

function Button({
  href,
  children,
  tone = 'primary',
  onClick,
  className = '',
}: {
  href: string
  children: ReactNode
  tone?: ButtonTone
  onClick?: () => void
  className?: string
}) {
  return (
    <a className={`btn btn-${tone} ${className}`} href={href} onClick={onClick}>
      {children}
    </a>
  )
}

function CountUp({
  value,
  formatter = (number) => Math.round(number).toLocaleString('en-GB'),
}: {
  value: number
  formatter?: (number: number) => string
}) {
  const previous = useRef(value)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const from = previous.current
    const to = value
    previous.current = value
    if (from === to) {
      setDisplay(to)
      return
    }

    const start = performance.now()
    let frame = 0
    const animate = (now: number) => {
      const progress = Math.min((now - start) / 500, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(from + (to - from) * eased)
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return <>{formatter(display)}</>
}

function PaperGrain() {
  return (
    <svg className="paper-grain" aria-hidden="true">
      <filter id="paper-noise">
        <feTurbulence baseFrequency="0.9" numOctaves="2" seed="9" type="fractalNoise" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-noise)" />
    </svg>
  )
}

function Stamp({
  ring,
  centre,
  className = '',
}: {
  ring: string
  centre: string
  className?: string
}) {
  const id = `stamp-${ring.replace(/[^a-z0-9]/gi, '').slice(0, 14)}`
  return (
    <svg className={`stamp ${className}`} viewBox="0 0 170 170" aria-hidden="true">
      <defs>
        <path id={id} d="M 31 85 a 54 54 0 1 1 108 0 a 54 54 0 1 1 -108 0" />
      </defs>
      <g className="stamp-offset">
        <circle cx="85" cy="85" r="73" />
        <circle cx="85" cy="85" r="58" />
        <text>
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
            {ring}
          </textPath>
        </text>
        <line x1="42" y1="85" x2="128" y2="85" />
        {centre.split(' · ').map((line, index) => (
          <text className="stamp-centre" key={line} x="85" y={centre.includes(' · ') ? 74 + index * 30 : 90}>
            {line}
          </text>
        ))}
      </g>
      <g>
        <circle cx="85" cy="85" r="73" />
        <circle cx="85" cy="85" r="58" />
        <text>
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
            {ring}
          </textPath>
        </text>
        <line x1="42" y1="85" x2="128" y2="85" />
        {centre.split(' · ').map((line, index) => (
          <text className="stamp-centre" key={line} x="85" y={centre.includes(' · ') ? 74 + index * 30 : 90}>
            {line}
          </text>
        ))}
      </g>
    </svg>
  )
}

function Signature() {
  return (
    <svg className="signature" viewBox="0 0 260 86" aria-label="Declarix signature">
      <path d="M14 54 C42 18, 70 18, 79 48 S105 81, 131 41 C143 23, 162 24, 151 53 C142 76, 178 76, 201 45 C217 24, 238 24, 244 51" />
    </svg>
  )
}

function MarginSpine() {
  return (
    <nav className="margin-spine" aria-label="Form progress">
      {spineLinks.map((link) => (
        <a data-spine-link={link.href} href={link.href} key={link.href} title={link.label}>
          <span>{link.number}</span>
        </a>
      ))}
    </nav>
  )
}

function Header({
  source,
  setSource,
}: {
  source: string
  setSource: (src: string) => void
}) {
  const [barDismissed, setBarDismissed] = useState(
    () => sessionStorage.getItem('dclrx-mm-dismissed') === '1',
  )
  const today = new Date().toISOString().slice(0, 10)
  const multimodalLive = today <= CONFIG.multimodalBarUntil && !barDismissed

  function useMultimodalSource() {
    if (source === 'direct') {
      sessionStorage.setItem('dclrx-src', 'multimodal')
      setSource('multimodal')
    }
  }

  return (
    <>
      <header className="site-header" aria-label="Declarix form header">
        <a className="wordmark" href="#top" aria-label="Declarix home">
          <span className="mark" />
          <span>
            <strong>DECLARIX</strong>
            <small>THE OFFICE LAYER FOR THE CLEARANCE DESK</small>
          </span>
        </a>
        <div className="header-cell">
          <span>FORM REF</span>
          <strong>DCLRX-H1</strong>
        </div>
        <div className="header-cell">
          <span>ISSUE</span>
          <strong>4.0 · JUL 2026</strong>
        </div>
        <div className="header-cell header-slots">
          <span>PILOT SLOTS</span>
          <strong>{CONFIG.pilotSlotsOpen} OF 5 OPEN</strong>
        </div>
        <nav className="header-nav" aria-label="Page sections">
          <a href="#job">THE 3×</a>
          <a href="#numbers">NUMBERS</a>
          <a href="#security">SECURITY</a>
          <a href="#pilot">PILOT</a>
        </nav>
        <Button href="#book" className="header-cta" onClick={() => track('cta_book_click', { source })}>
          <span className="full-label">Book the 20-minute numbers call</span>
          <span className="short-label">Book the call</span>
        </Button>
      </header>
      {multimodalLive ? (
        <a className="multimodal-bar" href="#book" onClick={useMultimodalSource}>
          <span>
            MET US AT MULTIMODAL (NEC · 30 JUN–2 JUL)? Mention it when you book — we'll pick up
            where the conversation left off. →
          </span>
          <button
            aria-label="Dismiss Multimodal bar"
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              sessionStorage.setItem('dclrx-mm-dismissed', '1')
              setBarDismissed(true)
            }}
          >
            ×
          </button>
        </a>
      ) : null}
    </>
  )
}

function SectionTitle({ box, title }: { box: string; title: string }) {
  return (
    <div className="section-title reveal">
      <span data-box-tag={box}>{box}</span>
      <h2>{title}</h2>
    </div>
  )
}

// v2.5 B1.1 / v3.0 §1 — every cell a verifiable fact; unresolved tokens ship dark, never literal
function ProvenanceStrip() {
  const cells = [
    'MULTIMODAL 2026 — NEC, ATTENDED',
    isConfigured(CONFIG.iccFinalistYear) ? `ICC SEAMLESS TRADE FINALIST ${CONFIG.iccFinalistYear}` : '',
    isConfigured(CONFIG.companyNo) ? `UK REGISTERED — CO. ${CONFIG.companyNo}` : 'UK REGISTERED',
    'BUILT IN LEICESTER',
  ].filter(Boolean)
  return (
    <div className="provenance-strip reveal" aria-label="Provenance">
      {cells.map((cell) => (
        <span key={cell}>{cell}</span>
      ))}
    </div>
  )
}

// v2.5 B1.3 — sockets ship dark; the day the first pilot quote lands, populate CONFIG.testimonials
function TestimonialStrip() {
  if (CONFIG.testimonials.length === 0) return null
  return (
    <section className="box" aria-label="What desks say">
      <div className="box-inner">
        <div className="testimonial-strip">
          {CONFIG.testimonials.map((item) => (
            <blockquote key={item.name}>
              <p>{item.quote}</p>
              <footer>
                {item.name} · {item.title} · <span>{item.firm}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

// v3.0 §2 — the ink-duotone film hero: the physical world behind, the paperwork in front.
// Mobile, reduced-motion and Save-Data always get the poster still; it is the LCP element.
function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [filmAllowed, setFilmAllowed] = useState(false)

  useEffect(() => {
    if (!isConfigured(CONFIG.heroLoopUrl)) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wide = window.matchMedia('(min-width: 981px)').matches
    const connection = (navigator as { connection?: { saveData?: boolean } }).connection
    const saveData = Boolean(connection?.saveData)
    setFilmAllowed(wide && !reduceMotion && !saveData)
  }, [])

  useEffect(() => {
    // 0.75× — the terminal moves at dawn pace, not showreel pace
    if (filmAllowed && videoRef.current) videoRef.current.playbackRate = 0.75
  }, [filmAllowed])

  return (
    <div className="hero-media" aria-hidden="true">
      {filmAllowed ? (
        <video
          className="hero-film"
          ref={videoRef}
          poster={appPath(CONFIG.heroPosterWide)}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
        >
          {/* VP9 first (Chrome/Firefox, smaller), H.264 mp4 fallback (Safari/iOS/all) */}
          <source src={appPath(CONFIG.heroLoopUrl.replace(/\.mp4$/, '.webm'))} type="video/webm" />
          <source src={appPath(CONFIG.heroLoopUrl)} type="video/mp4" />
        </video>
      ) : (
        <picture>
          <source media="(max-width: 980px)" srcSet={appPath(CONFIG.heroPosterTall)} />
          <img
            className="hero-poster"
            src={appPath(CONFIG.heroPosterWide)}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      )}
      <div className="hero-scrim" />
    </div>
  )
}

function Hero({ mailto, source }: { mailto: string; source: string }) {
  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <HeroMedia />
      <div className="hero-copy">
        <p className="kicker reveal">FOR CUSTOMS BROKERS & FREIGHT FORWARDERS WHO CLEAR THEIR OWN ENTRIES</p>
        <h1 className="hero-title" id="hero-title">
          <span className="hero-line">
            <span>
              Up to <span className="nowrap">3× the entries</span> <span className="nowrap">per clerk.</span>
            </span>
          </span>
        </h1>
        <p className="hero-support reveal">No new headcount. More margin on every declaration.</p>
        <p className="hero-body reveal">
          Declarix reads the whole job — any file, straight off a forwarded email — and returns an
          entry-ready pack for Sequoia or Descartes. Your clerk checks it in minutes instead of
          keying it for the best part of an hour.
        </p>
        <p className="price-cue reveal">PRICED PER ENTRY, NOT PER SEAT · PILOT: FREE IF IT FAILS</p>
        <div className="cta-row reveal">
          <Button href={mailto} tone="secondary" onClick={() => track('cta_pack_mailto', { source })}>
            Send one ugly pack
          </Button>
          <Button href="#book" onClick={() => track('cta_book_click', { source })}>
            Book the 20-minute numbers call
          </Button>
        </div>
      </div>
      <div className="hero-pile" aria-hidden="true">
        {documents.slice(0, 5).map((doc, index) => (
          <div className={`peek-doc peek-${index + 1}`} data-doc-id={`d${index + 1}`} key={doc.tag}>
            <span>{doc.tag}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function PaperDocument({ doc, index }: { doc: (typeof documents)[number]; index: number }) {
  return (
    <article className={`paper-doc paper-doc-${index + 1}`} data-doc-id={`d${index + 1}`}>
      <header>{doc.tag}</header>
      <strong>{doc.title}</strong>
      {doc.lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <div className="doc-rule" />
    </article>
  )
}

function EntryGrid({ selected, setSelected }: { selected: number; setSelected: (index: number) => void }) {
  return (
    <div className="entry-grid" aria-label="Entry pack worked example">
      <header>
        <strong>ENTRY PACK — DRAFT</strong>
        <span>
          JOB REF DX-2216 · LANDED 08:52 · PACK <b className="pack-clock">08:52</b>
        </span>
        <i className="grid-stamp-mark">PACK COMPLETE</i>
      </header>
      <div className="entry-grid-body">
        {packRows.map((row, index) => (
          <button
            className={`entry-grid-row ${index === selected ? 'is-selected' : ''} ${
              index === 2 || row.row.includes('COMMODITY') ? 'flag-row' : ''
            }`}
            key={`${row.row}-${row.value}`}
            type="button"
            onClick={() => {
              setSelected(index)
              track('pack_field_tap', { row: row.row })
            }}
          >
            <span>{row.row}</span>
            <strong>{row.value}</strong>
          </button>
        ))}
      </div>
    </div>
  )
}

function AssemblyScene({ mailto, source }: { mailto: string; source: string }) {
  const [selected, setSelected] = useState(2)
  const row = packRows[selected]

  return (
    <section className="box assembly-box" id="job" aria-labelledby="job-title">
      <div className="box-inner">
        <div className="section-title reveal">
          <span>BOX 2</span>
          <h2 id="job-title">Where the 3× comes from.</h2>
        </div>
        <p className="standfirst reveal">
          Customer paperwork in. Entry-ready pack out. Watch one real-shaped job go through.
        </p>
      </div>
      <div
        className="assembly-pin"
        aria-label="A messy customs job assembles into an entry-ready pack with evidence pinned to every field."
      >
        <div className="assembly-stage">
          <div className="mobile-story-steps" aria-label="Mobile assembly sequence">
            {mobileMovements.map((movement) => (
              <article className="mobile-story-step" key={movement.tag}>
                <span>{movement.tag}</span>
                <strong>{movement.title}</strong>
                <p>{movement.copy}</p>
                {movement.chips ? (
                  <div className="mobile-scan-values" aria-hidden="true">
                    {movement.chips.map((chip, index) => (
                      <i key={chip} style={{ animationDelay: `${index * 0.18}s` }}>
                        {chip}
                      </i>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
          <div className="assembly-caption">
            <p className="type-caption caption-one">08:52 — THE JOB LANDS.</p>
            <p className="type-caption caption-two">
              ONE JOB: 6 ATTACHMENTS · 3 FORMATS · 43 LINES · 2 INVOICES, AMALGAMATED
            </p>
            <p className="type-caption caption-three">
              KEYED BY HAND, THIS IS ~50 MINUTES OF A CLERK'S MORNING.
            </p>
            <p className="type-caption caption-four">OR NO ONE KEYS IT.</p>
          </div>
          <div className="docs-stage">
            <div className="scan-band" aria-hidden="true" />
            <div className="source-ghost ghost-0" aria-hidden="true" />
            <div className="source-ghost ghost-1" aria-hidden="true" />
            <div className="source-ghost ghost-2" aria-hidden="true" />
            <div className="source-ghost ghost-3" aria-hidden="true" />
            <div className="source-ghost ghost-4" aria-hidden="true" />
            {documents.map((doc, index) => (
              <PaperDocument doc={doc} index={index} key={doc.tag} />
            ))}
          </div>
          <svg className="tether-layer" aria-hidden="true" viewBox="0 0 1000 620" preserveAspectRatio="none">
            {/* v2.5 B4.1 — orthogonal routed connectors: horizontal → elbow → vertical → grid row.
                Routed lines read as engineering; each flight gets its own bus lane so nothing crosses. */}
            {flights.map((flight, index) => {
              const startX = 245 + index * 9
              const startY = 120 + index * 42
              const busX = 640 - index * 12
              const endY = 118 + index * 38
              return (
                <path
                  className={`tether tether-${index}`}
                  d={`M ${startX} ${startY} H ${busX} V ${endY} H 700`}
                  key={flight.row}
                />
              )
            })}
          </svg>
          <div className="pack-side">
            <EntryGrid selected={selected} setSelected={setSelected} />
            <div className="flight-deck" aria-hidden="true">
              {flights.map((flight, index) => (
                <span className={`flight-chip flight-${index}`} key={flight.row}>
                  {flight.value}
                  {flight.note ? <small>{flight.note}</small> : null}
                </span>
              ))}
            </div>
            <div className="flag-cards">
              <article>
                <span>PROPOSED — FOR YOUR CLERK'S CONFIRMATION</span>
                <p>
                  6912 00 — ceramic tableware, stoneware. Reasoned from the line descriptions and
                  the other documents in this job. Indicative duty shown from the UK tariff.
                </p>
                <em>ILLUSTRATIVE DEMO DATA</em>
              </article>
              <article>
                <span>INCOTERM — CONFLICT</span>
                <p>Invoice says CIF; the 14:22 email says CIP. Flagged, not guessed.</p>
              </article>
            </div>
            <div className="evidence-copy" id="evidence">
              <h3>Every field shows its working.</h3>
              <p>
                Tap any value in the pack and its source lights up — document, page, line. Checking
                an entry becomes the fast part, not the job. We don't ask you to trust it. We make it
                quick to check.
              </p>
            </div>
            <div className="handover-card">
              <div>
                <strong>ENTRY PACK DX-2216</strong>
                <span>43 LINES · READY FOR SUBMISSION</span>
                <small>PREPARED BY DECLARIX · CHECKED BY __________ (YOUR CLERK)</small>
              </div>
              <div className="slot-toggle">
                <button type="button">SEQUOIA</button>
                <button type="button">DESCARTES E-CUSTOMS</button>
                <button type="button">OTHER CSV</button>
              </div>
              <Stamp className="stamp-animated" ring="DECLARIX · PACK COMPLETE · 09:07" centre="PACK · COMPLETE" />
            </div>
            <div className="handover-caption">
              <strong>Keep Sequoia. Keep Descartes. Lose the keying.</strong>
              <span>
                LANDED 08:52 → PACK 08:56 → CHECKED &amp; SUBMITTED 09:05. THE OTHER 40 MINUTES GO
                BACK TO THE DESK.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="box-inner aftermath">
        <div className="live-pack reveal">
          <div>
            <SectionTitle box="WORKED EXAMPLE" title="The pack stays live for checking." />
            <p>
              Every row can be opened. The source reference, document, page and line stay attached
              to the value your clerk approves.
            </p>
          </div>
          <div className="live-grid-card">
            <EntryGrid selected={selected} setSelected={setSelected} />
            <div className="evidence-popover">
              <span>{row.ref}</span>
              <strong>{row.row}</strong>
              <p>{row.value}</p>
              <small>SOURCE: {row.source}</small>
              <a href="#job">↗ view in place</a>
            </div>
          </div>
        </div>
        <div className="cta-row centred">
          <Button href={mailto} tone="secondary" onClick={() => track('cta_pack_mailto', { source })}>
            Send one ugly pack
          </Button>
          <Button href="#book" onClick={() => track('cta_book_click', { source })}>
            Book the 20-minute numbers call
          </Button>
        </div>
        <p className="mono-note">THE PACK ABOVE IS A WORKED EXAMPLE — ILLUSTRATIVE VALUES.</p>
      </div>
    </section>
  )
}

function AnyFile({ mailto, source }: { mailto: string; source: string }) {
  return (
    <section className="box" id="files" aria-labelledby="files-title">
      <div className="box-inner two-col">
        <div>
          <SectionTitle box="BOX 4" title="It reads whatever your customers send." />
          <p>
            PDF invoices, spreadsheets with merged cells, scans, phone photos of delivery notes,
            forwarded email chains, the 300-line packing list. If a person could read it, it goes in
            the pack.
          </p>
          <h3>Send us your worst.</h3>
          <a className="text-link" href={mailto} onClick={() => track('cta_pack_mailto', { source })}>
            pack yours off now →
          </a>
        </div>
        <div className="specimen-marquee" aria-label="Example customer files">
          <div>
            {[...specimens, ...specimens].map((item, index) => (
              <article className={`specimen ${item.includes('D6 · FROM THE JOB ABOVE') ? 'specimen-from-job' : ''}`} key={`${item}-${index}`}>
                <span>{item}</span>
                <p>DECLARIX INTAKE · ANY FILE</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SystemSection() {
  return (
    <section className="box" id="system" aria-labelledby="system-title">
      <div className="box-inner">
        <SectionTitle box="BOX 5" title="Not customs software. The layer in front of it." />
        <p className="wide-copy">
          Declarix never touches HMRC and never asks you to migrate anything. Output for Sequoia
          and Descartes e-Customs today; other formats on request.
        </p>
        <div className="integration-wall reveal" aria-label="Output formats">
          <div>
            <span>SEQUOIA</span>
            <span>DESCARTES E-CUSTOMS</span>
            <span>CSV / YOUR FORMAT</span>
          </div>
          <p className="mono-note">THE SYSTEMS UK DESKS ALREADY RUN.</p>
        </div>
        <div className="flow-strip reveal">
          <span className="flow-pack-token" aria-hidden="true">PACK</span>
          {['CUSTOMER PAPERWORK', 'DECLARIX', "YOUR CLERK'S CHECK", 'SEQUOIA / DESCARTES', 'HMRC CDS'].map(
            (node) => (
              <div className={node === 'DECLARIX' ? 'flow-node flow-cleared' : 'flow-node'} key={node}>
                <span>{node}</span>
                {node === 'DECLARIX' ? (
                  <>
                    <small>MINUTES</small>
                    <small>TYPICAL PACK-BACK SLA SET AGAINST DESK VOLUME</small>
                  </>
                ) : null}
                {node === "YOUR CLERK'S CHECK" ? <small>STILL YOURS</small> : null}
              </div>
            ),
          )}
        </div>
        <p className="mono-note">
          NO INTEGRATION PROJECT. NO INSTALLATION. AN EMAIL ADDRESS. GO-LIVE: TODAY. NOT "WITHIN
          WEEKS."
        </p>
        <p className="mono-note intake-note">ONE FORWARDING RULE ON THE DESK INBOX. JOB REFS SURVIVE THE ROUND TRIP.</p>
      </div>
    </section>
  )
}

function SecuritySection() {
  return (
    <section className="box dark-box" id="security" aria-labelledby="security-title">
      {/* v2.5 B3.2 — container stacks, ink-dominant duotone, fixed at 10-12%: depth without noise */}
      <img
        className="dark-box-backdrop"
        src={appPath('/exhibits/box6-stacks.jpg')}
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden="true"
      />
      <div className="schedule-tag schedule-tag-top">CONTINUATION SHEET · SECURITY SCHEDULE — FORM DCLRX-H1</div>
      <div className="box-inner two-col">
        <div>
          <SectionTitle box="BOX 6" title="Processed. Returned. Deleted." />
          <p>
            Your documents exist with us for exactly as long as it takes to build the pack. Then
            they're destroyed. Nothing is archived, nothing waits on a server, and nothing of yours
            trains anything. The models read your documents the way a clerk would — then forget them
            the way a clerk can't.
            The pack and its evidence file are returned to you in full — yours to archive against
            HMRC record-keeping years. We keep the nothing; you keep the everything.
          </p>
        </div>
        <div className="shred-stage" aria-hidden="true">
          {documents.slice(0, 5).map((doc, index) => (
            <div className={`shred-doc shred-${index}`} key={doc.tag}>
              <span>{doc.tag}</span>
              {Array.from({ length: 6 }).map((_, strip) => (
                <i key={strip} />
              ))}
            </div>
          ))}
          <div className="shred-ghost shred-ghost-1" />
          <div className="shred-ghost shred-ghost-2" />
          <div className="shred-ghost shred-ghost-3" />
          <div className="ledger">
            <p>
              <span>DOCUMENTS RETAINED</span>
              <strong>0 DAYS</strong>
            </p>
            <p>
              <span>PACKS RETAINED</span>
              <strong>
                YOUR COPY ONLY
                <small>INCLUDING THE EVIDENCE FILE, FOR YOUR RECORDS</small>
              </strong>
            </p>
            <p>
              <span>TRAINING ON YOUR DATA</span>
              <strong>NONE</strong>
            </p>
            <p>
              <span>DESK REFERENCE DATA</span>
              <strong>NONE HELD</strong>
            </p>
            <p>
              <span>ACCESS TO HMRC</span>
              <strong>NONE — WE NEVER SUBMIT</strong>
            </p>
            <p>
              <span>SUBPROCESSORS</span>
              <strong>LISTED IN FULL, ON REQUEST</strong>
            </p>
            <p className="ledger-link-row">
              <span>FULL SECURITY NOTES</span>
              <strong>
                <a href={appPath('/security')}>→ /SECURITY</a>
              </strong>
            </p>
          </div>
        </div>
      </div>
      <div className="schedule-tag schedule-tag-bottom">END OF SCHEDULE — CONTINUE OVERLEAF →</div>
    </section>
  )
}

function DeskMathSection({ source }: { source: string }) {
  const [entries, setEntries] = useState(120)
  const annualSaving = Math.round(entries * 5.5 * 52)

  function applyPreset(volume: number | null) {
    if (!volume) return
    setEntries(volume)
    track('roi_slider_change', { entries: volume, annual_saving: Math.round(volume * 5.5 * 52), preset: true })
    window.setTimeout(() => {
      document.getElementById('cost-outputs')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 40)
  }

  return (
    <section className="box" id="numbers" aria-labelledby="numbers-title">
      <div className="box-inner desk-maths">
        <SectionTitle box="BOX 3" title="One declaration, costed." />
        <div className="cost-docket reveal">
          <span className="docket-clock">09:05</span>
          <span className="docket-scan" aria-hidden="true" />
          <p className="cost-docket-title">ONE DECLARATION, COSTED</p>
          <div className="cost-columns">
            <div>
              <h3>TODAY</h3>
              <p><span>KEYING &amp; ASSEMBLY</span><strong className="docket-minutes" data-text="~46 MIN">~46 MIN</strong></p>
              <p><span>CHASES &amp; REKEYS</span><strong>BUILT IN</strong></p>
              <p><span>LOADED CLERK COST</span><strong>£7.95</strong></p>
              <p className="total-row"><span>TOTAL</span><strong>£7.95</strong></p>
            </div>
            <div>
              <h3>WITH DECLARIX</h3>
              <p><span>CHECK &amp; SUBMIT</span><strong className="docket-minutes" data-text="~9 MIN">~9 MIN</strong></p>
              <p><span>FLAGS, PRE-ANSWERED</span><strong>IN THE PACK</strong></p>
              <p><span>LOADED CLERK COST</span><strong>£2.45</strong></p>
              <p><span>DECLARIX RATE</span><strong>SET ON THE CALL</strong></p>
              <p className="total-row"><span>TOTAL</span><strong>UNDER TODAY'S — OR THERE'S NO DEAL WORTH DOING.</strong></p>
            </div>
          </div>
        </div>
        <p className="desk-intro">
          The per-entry rate is priced against your £7.95, not against hope — if the total doesn't
          come down, the pilot already told you for free.
        </p>
        <div className="numbers-grid">
          <div className="calculator-panel">
            <p className="mono-note">HOW MANY DECLARATIONS DOES THE DESK PROCESS?</p>
          <label className="range-label" htmlFor="entries">
            <span>DECLARATIONS PER WEEK</span>
            <strong>{entries}</strong>
          </label>
          <input
            id="entries"
            max="600"
            min="40"
            onChange={(event) => {
              const value = Number(event.currentTarget.value)
              setEntries(value)
              track('roi_slider_change', { entries: value, annual_saving: Math.round(value * 5.5 * 52) })
            }}
            step="5"
            type="range"
            value={entries}
          />
        </div>
        <div className="roi-output" id="cost-outputs" aria-live="polite">
          <article>
            <span>COST PER DECLARATION</span>
            <strong>£7.95 <em>→</em> £2.45</strong>
            <small>LABOUR ONLY · YOUR PER-ENTRY RATE IS ADDED — AND SIZED — ON THE CALL</small>
          </article>
          <article>
            <span>BOTTOM LINE, PER YEAR</span>
            <strong>£<CountUp value={annualSaving} /></strong>
          </article>
          <article>
            <span>SAME TEAM</span>
            <strong>UP TO 3× THE ENTRIES</strong>
          </article>
        </div>
      </div>
        <p className="mono-note assumption-note">
          ASSUMES £5.50 LABOUR SAVING PER DECLARATION × 52 WEEKS · ILLUSTRATIVE — YOUR NUMBERS WILL DIFFER.
          THAT'S THE CALL. 3× IS PILOT MODELLING, NOT A PROMISE.
        </p>
        <div className="preset-cards">
          {costPresets.map((preset) => (
            <button
              className="preset-card"
              key={preset.title}
              type="button"
              onClick={() => applyPreset(preset.volume)}
            >
              <span>{preset.title}</span>
              {preset.lines.map((line) => (
                <strong key={line}>{line}</strong>
              ))}
              {preset.close.map((line) => (
                <em key={line}>{line}</em>
              ))}
            </button>
          ))}
        </div>
        <div className="persona-strip">
          <article>
            <span>MD / OWNER</span>
            <p>Margin per entry up. Fixed costs flat. No software migration on the risk register.</p>
          </article>
          <article>
            <span>OPS MANAGER</span>
            <p>Peaks absorbed without panic hires. Capacity you can quote against.</p>
          </article>
          <article>
            <span>HEAD OF CUSTOMS</span>
            <p>Fewer rekeys, fewer queries, evidence pinned to every field your clerk approves.</p>
          </article>
          <article>
            <span>SENIOR CLERK</span>
            <p>You check, you approve, your name on the entry — minus the keying.</p>
          </article>
        </div>
        <div className="desk-cta">
          <Button href="#book" onClick={() => track('cta_book_click', { source })}>
            Book the 20-minute numbers call
          </Button>
          <p className="mono-note">BRING A REAL WEEK'S VOLUME. WE'LL REBUILD THE MODEL LIVE — YOU KEEP THE SPREADSHEET.</p>
        </div>
      </div>
    </section>
  )
}

function QuestionsSection() {
  const [open, setOpen] = useState(0)

  return (
    <section className="box" id="questions" aria-labelledby="questions-title">
      <div className="box-inner">
        <SectionTitle box="BOX 7" title="Questions desks ask." />
        <div className="accordion">
          {questions.map((item, index) => (
            <article className="accordion-row" key={item.q}>
              <button
                aria-expanded={open === index}
                onClick={() => setOpen(open === index ? -1 : index)}
                type="button"
              >
                <span>Q</span>
                <strong>{item.q}</strong>
                <em>{open === index ? '×' : '+'}</em>
              </button>
              <div className="accordion-panel" aria-hidden={open !== index}>
                <p>{item.a}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PilotSection() {
  return (
    <section className="box" id="pilot" aria-labelledby="pilot-title">
      <div className="box-inner two-col">
        <div>
          <SectionTitle box="BOX 8" title="The pilot." />
          <div className="pilot-docket">
            <p>THE PILOT — TERMS OF ENGAGEMENT</p>
            <ol>
              <li>YOU SEND ......... ONE ANONYMISED, GENUINELY UGLY JOB</li>
              <li>WE RETURN ........ THE ENTRY-READY PACK, WITHIN ONE WORKING DAY</li>
              <li>YOUR CLERK ....... CHECKS IT SIDE-BY-SIDE AGAINST THE MANUAL RUN</li>
              <li>IF IT FAILS ...... YOU PAY NOTHING</li>
              <li>IF IT WORKS ...... PILOT CONTINUES, CAPPED AT £500 TOTAL</li>
            </ol>
          </div>
        </div>
        <div className="pilot-proof">
          <div className="pilot-stamp-wrap">
            <Stamp ring="FREE IF IT FAILS · CAPPED IF IT WORKS" centre="£0 · £500" />
            <span>SECOND IMPRESSION</span>
          </div>
          {isConfigured(CONFIG.founderPortrait) ? (
            <figure className="pilot-exhibit exhibit-frame">
              <img src={CONFIG.founderPortrait} alt={CONFIG.founderName} loading="lazy" decoding="async" />
              <figcaption>EXHIBIT — THE DESK IT'S BUILT AT</figcaption>
            </figure>
          ) : null}
          <p>
            Declarix is built in the UK by{' '}
            {isConfigured(CONFIG.linkedin) ? (
              <a href={CONFIG.linkedin}>{CONFIG.founderLine}</a>
            ) : (
              CONFIG.founderLine
            )}
            . We'd rather prove it on your paperwork than pitch it on ours.
          </p>
          <p className="mono-note">
            {isConfigured(CONFIG.companyNo)
              ? `${CONFIG.companyLegal} · CO. ${CONFIG.companyNo} · ENGLAND & WALES`
              : `DECLARIX · BUILT IN ${CONFIG.companyLocation.toUpperCase()}`}
          </p>
        </div>
      </div>
    </section>
  )
}

function ZohoBookingEmbed({ source }: { source: string }) {
  const [status, setStatus] = useState<BookingStatus>(() =>
    isConfigured(CONFIG.zohoBookingUrl) && isConfigured(CONFIG.zohoBookingScriptUrl) ? 'loading' : 'missing',
  )

  useEffect(() => {
    if (!isConfigured(CONFIG.zohoBookingUrl) || !isConfigured(CONFIG.zohoBookingScriptUrl)) {
      setStatus('missing')
      return
    }

    const scriptId = 'zoho-bookings-embed-script'
    let cancelled = false

    const mountEmbed = () => {
      if (cancelled) return
      const parent = document.querySelector('#inline-container')
      if (!parent || !window.Bookings?.inlineEmbed) {
        setStatus('error')
        return
      }
      parent.innerHTML = ''
      window.Bookings.inlineEmbed({
        url: CONFIG.zohoBookingUrl,
        parent: '#inline-container',
        height: CONFIG.bookingEmbedHeight,
      })
      setStatus('ready')
      track('booking_frame_load', { provider: 'zoho', source })
    }

    if (window.Bookings?.inlineEmbed) {
      mountEmbed()
      return
    }

    let script = document.getElementById(scriptId) as HTMLScriptElement | null
    const onError = () => {
      if (!cancelled) setStatus('error')
    }

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.async = true
      script.src = CONFIG.zohoBookingScriptUrl
      document.head.append(script)
    }

    script.addEventListener('load', mountEmbed)
    script.addEventListener('error', onError)

    return () => {
      cancelled = true
      script?.removeEventListener('load', mountEmbed)
      script?.removeEventListener('error', onError)
    }
  }, [source])

  if (status === 'missing') {
    return (
      <div className="cal-placeholder">
        <span>BOOKING LINK NEEDED</span>
        <p>
          Add the Zoho Bookings embed URL and script URL in the site config to turn this into the
          live diary.
        </p>
      </div>
    )
  }

  return (
    <div className="cal-inline-widget zoho-booking-widget">
      <Stamp className="booking-stamp-crop" ring="DECLARIX · PACK COMPLETE · 09:07" centre="PACK · COMPLETE" />
      {status !== 'ready' ? (
        <div className="cal-status">
          <span>{status === 'error' ? 'BOOKING WIDGET COULD NOT LOAD' : 'LOADING THE DIARY...'}</span>
          {status === 'error' ? <p>Email {CONFIG.packEmail} with two times that suit.</p> : null}
        </div>
      ) : null}
      <div id="inline-container" className="zoho-inline-container" />
    </div>
  )
}

function BookSection({
  mailto,
  source,
}: {
  mailto: string
  source: string
}) {
  const [copied, setCopied] = useState(false)

  function copyEmail() {
    setCopied(true)
    track('copy_pack_email', { source })
    navigator.clipboard?.writeText(CONFIG.packEmail).catch(() => undefined)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section className="box book-box" id="book" aria-labelledby="book-title">
      <div className="box-inner">
        <SectionTitle box="BOX 9" title="Two ways to start. Both cost you an email." />
        <div className="start-cards">
          <article className="start-card">
            <span>SEND ONE UGLY PACK</span>
            <p>
              Pick your nastiest recent job — the amalgamation, the scans, the lot. Anonymise it,
              forward it, and the entry-ready pack comes back within one working day. No deck. No
              login. One email.
            </p>
            <div className="card-actions">
              <Button href={mailto} onClick={() => track('cta_pack_mailto', { source })}>
                Email {CONFIG.packEmail}
              </Button>
              <button className="copy-chip" type="button" onClick={copyEmail}>
                {copied ? 'COPIED ✓' : 'COPY ADDRESS'}
              </button>
            </div>
            <p className="mono-note">
              BY SENDING, YOU CONFIRM THE DOCUMENTS ARE ANONYMISED. EVERYTHING IS DELETED ONCE YOUR
              PACK GOES BACK.
            </p>
          </article>
          <article className="start-card primary-card">
            <span>BOOK THE 20-MINUTE NUMBERS CALL</span>
            <p>
              Bring one week's real volume. We rebuild the cost-per-entry model live and you leave
              with the spreadsheet either way.
            </p>
            <ZohoBookingEmbed source={source} />
            <a className="text-link" href={`mailto:${CONFIG.packEmail}`}>
              Calendar tools not your thing? Email {CONFIG.packEmail} with two times that suit. →
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>DECLARIX · FORM DCLRX-H1 · ISSUE 4.0 · THIS PAGE SETS NO MARKETING COOKIES — ZOHO SERVES THE BOOKING FRAME.</p>
      <nav>
        <a href={appPath('/privacy')}>PRIVACY</a>
        {isConfigured(CONFIG.linkedin) ? <a href={CONFIG.linkedin}>LINKEDIN</a> : null}
      </nav>
      <div>
        <em>I declare the particulars given on this page to be true and complete.</em>
        <Signature />
        <span>DECLARIX, JULY 2026</span>
      </div>
    </footer>
  )
}

function MobileCta({ mailto, source }: { mailto: string; source: string }) {
  const [visible, setVisible] = useState(false)
  const [hiddenForBook, setHiddenForBook] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setVisible(scrollable > 0 && window.scrollY / scrollable > 0.4)
      const book = document.getElementById('book')
      if (book) {
        const rect = book.getBoundingClientRect()
        setHiddenForBook(rect.top < window.innerHeight && rect.bottom > 0)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`mobile-cta ${visible && !hiddenForBook ? 'is-visible' : ''}`}>
      <Button href={mailto} tone="secondary" onClick={() => track('cta_pack_mailto', { source })}>
        Send an ugly pack
      </Button>
      <Button href="#book" onClick={() => track('cta_book_click', { source })}>
        Book the call
      </Button>
    </div>
  )
}

function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacy — Declarix'
  }, [])
  return (
    <div className="document-frame privacy-page">
      <PaperGrain />
      <Header source="direct" setSource={() => undefined} />
      <main className="box">
        <div className="box-inner">
          <SectionTitle box="PRIVACY" title="Zero-retention privacy statement." />
          <p>
            Declarix processes documents only to prepare and return the requested customs pack.
            Documents are deleted once the pack is returned. We do not train models on customer
            documents, we do not submit to HMRC, and we do not keep a document archive.
          </p>
          <p>
            This site may use cookieless PostHog analytics when a key is configured. The analytics
            setup uses memory persistence and does not set marketing cookies. Booking is handled by
            Zoho Bookings, which serves the live diary frame.
          </p>
          <p>
            For subprocessors, security questions, or deletion evidence, contact {CONFIG.packEmail}.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// v2.5 B1.8 — the page an ops manager forwards to IT. Small, real, token-gated truths only.
function SecurityPage() {
  useEffect(() => {
    document.title = 'Security — Declarix'
  }, [])
  return (
    <div className="document-frame privacy-page">
      <PaperGrain />
      <Header source="direct" setSource={() => undefined} />
      <main className="box">
        <div className="box-inner">
          <SectionTitle box="SECURITY" title="The security schedule, in full." />
          <p>
            Declarix processes customer documents for exactly as long as it takes to build and
            return the entry pack. Documents are then destroyed. There is no archive, no queue of
            stored jobs, and no training of any model on customer documents — ours or anyone
            else's.
          </p>
          <div className="security-ledger">
            <p>
              <span>DOCUMENT RETENTION</span>
              <strong>0 DAYS — DELETED ON PACK RETURN</strong>
            </p>
            <p>
              <span>PACK RETENTION</span>
              <strong>YOUR COPY ONLY, WITH THE EVIDENCE FILE</strong>
            </p>
            <p>
              <span>TRAINING ON CUSTOMER DATA</span>
              <strong>NONE</strong>
            </p>
            <p>
              <span>ACCESS TO HMRC</span>
              <strong>NONE — WE NEVER SUBMIT</strong>
            </p>
            {isConfigured(CONFIG.securityProcessingLocation) ? (
              <p>
                <span>PROCESSING LOCATION</span>
                <strong>{CONFIG.securityProcessingLocation}</strong>
              </p>
            ) : null}
            <p>
              <span>SUBPROCESSORS</span>
              <strong>
                {isConfigured(CONFIG.securitySubprocessors)
                  ? CONFIG.securitySubprocessors
                  : 'LISTED IN FULL, ON REQUEST'}
              </strong>
            </p>
          </div>
          <p>
            For data-processing agreements, deletion evidence, or the subprocessor list on
            letterhead, contact {CONFIG.packEmail}. Answers come from the person who built the
            system, not a support queue.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// v3.0 §3 — anchor scrolls take 900ms on the --ease-inout curve; nothing snaps
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function HomePage() {
  const [source, setSource] = useState(() => getStoredSource())
  const mailto = useMemo(() => buildMailto(source), [source])

  useEffect(() => {
    initAnalytics()
    gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin, SplitText)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(pointer: coarse)').matches
    const wide = window.matchMedia('(min-width: 981px)').matches
    let sceneComplete = false
    let lenis: Lenis | null = null

    const ctx = gsap.context(() => {
      // v3.0 §3 — page-load choreography: one orchestration, 900ms total, runs once.
      // Frame draws -> header cells rise -> H1 line-masks -> kicker/body/CTAs.
      const heroReveals = gsap.utils.toArray<HTMLElement>('.hero-copy .reveal')
      if (!reduceMotion) {
        document.body.classList.add('js-choreo')
        const load = gsap.timeline({ defaults: { ease: 'power3.out' } })
        load
          .fromTo('.fd-top, .fd-bottom', { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.inOut' }, 0)
          .fromTo('.fd-left, .fd-right', { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: 'power2.inOut' }, 0)
          .fromTo(
            '.site-header > *',
            { y: 10, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.06 },
            0.15,
          )
          .fromTo('.hero-line > span', { yPercent: 110 }, { yPercent: 0, duration: 0.45 }, 0.35)
          .fromTo(
            heroReveals,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06 },
            0.5,
          )
      } else {
        gsap.set('.hero-line > span', { yPercent: 0 })
        gsap.set('.hero-copy .reveal', { autoAlpha: 1 })
      }

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        if (heroReveals.includes(element)) return
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: reduceMotion ? 0 : 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduceMotion ? 0.2 : 0.45,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 78%', once: true },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('.box').forEach((box) => {
        if (reduceMotion) {
          box.style.setProperty('--rule-scale', '1')
          return
        }
        gsap.fromTo(
          box,
          { '--rule-scale': 0 },
          {
            '--rule-scale': 1,
            duration: 0.45,
            ease: 'power3.out',
            scrollTrigger: { trigger: box, start: 'top 85%', once: true },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-box-tag]').forEach((tag) => {
        const text = tag.dataset.boxTag || tag.textContent || ''
        if (reduceMotion) {
          tag.textContent = text
          return
        }
        gsap.fromTo(
          tag,
          { text: '' },
          {
            text,
            duration: Math.max(text.length / 24, 0.18),
            ease: 'none',
            scrollTrigger: { trigger: tag, start: 'top 88%', once: true },
          },
        )
      })

      spineLinks.forEach((link) => {
        const section = document.querySelector(link.href)
        const anchor = document.querySelector(`[data-spine-link="${link.href}"]`)
        if (!section || !anchor) return
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => anchor.classList.add('is-active'),
          onEnterBack: () => anchor.classList.add('is-active'),
        })
      })

      ScrollTrigger.create({
        start: 80,
        onEnter: () => document.body.classList.add('is-scrolled'),
        onLeaveBack: () => document.body.classList.remove('is-scrolled'),
      })

      if (!reduceMotion) {
        gsap.utils.toArray<HTMLElement>('.docket-minutes').forEach((element, index) => {
          gsap.fromTo(
            element,
            { text: '' },
            {
              text: element.dataset.text || element.textContent || '',
              duration: 0.45,
              delay: index * 0.12,
              ease: 'none',
              scrollTrigger: { trigger: '.cost-docket', start: 'top 72%', once: true },
            },
          )
        })
        gsap.fromTo(
          '.docket-scan',
          { xPercent: -115, autoAlpha: 0 },
          {
            xPercent: 115,
            autoAlpha: 1,
            duration: 0.42,
            ease: 'none',
            scrollTrigger: { trigger: '.cost-docket', start: 'top 72%', once: true },
          },
        )
        gsap.fromTo(
          '.flow-pack-token',
          { x: 0, autoAlpha: 0 },
          {
            x: () => {
              const strip = document.querySelector<HTMLElement>('.flow-strip')
              return strip ? strip.clientWidth * 0.62 : 0
            },
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: { trigger: '.flow-strip', start: 'top 78%', end: 'top 30%', scrub: 0.55 },
          },
        )
        gsap.to('.flow-node:nth-child(5)', {
          borderWidth: 2,
          // the node only declares border-right; widening all edges must not
          // surface the preflight-gray default on the other three
          borderColor: '#16313d',
          scrollTrigger: { trigger: '.flow-strip', start: 'top 42%', once: true },
        })
        gsap.fromTo(
          '.dark-box',
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)',
            ease: 'none',
            scrollTrigger: { trigger: '.dark-box', start: 'top 86%', end: 'top 46%', scrub: 0.55 },
          },
        )
        gsap.fromTo(
          '.shred-ghost',
          { autoAlpha: 0 },
          {
            autoAlpha: 0.55,
            duration: 0.16,
            stagger: 0.06,
            yoyo: true,
            repeat: 1,
            scrollTrigger: { trigger: '.shred-stage', start: 'top 70%', once: true },
          },
        )
      }

      if (!reduceMotion && !touch) {
        // v3.0 §3 — Lenis lerp 0.08 on desktop
        lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1 })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (time: number) => lenis!.raf(time * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        window.addEventListener('beforeunload', () => lenis!.destroy(), { once: true })
      }

      if (!reduceMotion && wide) {
        gsap.set(
          '.entry-grid, .flight-chip, .flag-cards article, .evidence-copy, .handover-card, .handover-caption, .stamp-animated',
          {
            autoAlpha: 0,
          },
        )
        gsap.set('.live-grid-card .entry-grid', { autoAlpha: 1 })
        gsap.set('.stamp-animated', { scale: 1.6, rotate: -8 })
        gsap.set('.source-ghost', { autoAlpha: 0 })
        gsap.set('.paper-doc', { opacity: 0.88 })
        gsap.set('.paper-doc-5', { opacity: 1 })

        gsap.to('.peek-doc', {
          y: 64,
          rotate: 0,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.assembly-pin', start: 'top bottom', end: 'top top', scrub: 0.55 },
        })

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.assembly-pin',
            start: 'top top',
            end: '+=420%',
            pin: true,
            scrub: 0.55,
            onEnter: () => gsap.set('.assembly-stage', { willChange: 'transform' }),
            onLeave: () => gsap.set('.assembly-stage', { willChange: 'auto' }),
            onUpdate: (self) => {
              if (self.progress >= 0.99 && !sceneComplete) {
                sceneComplete = true
                track('scene_complete', { source })
              }
            },
          },
        })

        timeline
          .to('.docs-stage', { rotate: -1, x: -10, duration: 0.12 }, 0)
          .to('.caption-one', { text: '08:52 — THE JOB LANDS.', duration: 0.05 }, 0)
          .from('.paper-doc', { y: -18, rotate: 0, autoAlpha: 0, duration: 0.08, stagger: 0.008 }, 0.02)
          .to('.caption-two', { autoAlpha: 1, duration: 0.05 }, 0.06)
          .to('.caption-three', { autoAlpha: 1, duration: 0.05 }, 0.11)
          .to('.caption-four', { autoAlpha: 1, duration: 0.05 }, 0.16)
          .to('.entry-grid', { autoAlpha: 1, duration: 0.08 }, 0.18)
          .to('.scan-band', { yPercent: 560, duration: 0.31, ease: 'none' }, 0.16)
          .to('.paper-doc-5', { y: 4, opacity: 0.88, duration: 0.07, ease: 'power3.out' }, 0.22)
          .to('.paper-doc-1', { opacity: 1, duration: 0.025 }, 0.2)
          .to('.paper-doc-1', { y: 4, opacity: 0.88, duration: 0.07, ease: 'power3.out' }, 0.29)
          .to('.paper-doc-2', { opacity: 1, duration: 0.025 }, 0.27)
          .to('.paper-doc-2', { y: 4, opacity: 0.88, duration: 0.07, ease: 'power3.out' }, 0.36)
          .to('.paper-doc-3', { opacity: 1, duration: 0.025 }, 0.34)
          .to('.paper-doc-3', { y: 4, opacity: 0.88, duration: 0.07, ease: 'power3.out' }, 0.43)
          .to('.paper-doc-4', { opacity: 1, duration: 0.025 }, 0.41)
          .to('.paper-doc-4', { y: 4, opacity: 0.88, duration: 0.07, ease: 'power3.out' }, 0.49)
          .to('.pack-clock', { text: '08:53', duration: 0.02 }, 0.28)
          .to('.pack-clock', { text: '08:54', duration: 0.02 }, 0.42)
          .to('.pack-clock', { text: '08:55', duration: 0.02 }, 0.58)
          .to('.pack-clock', { text: '08:56', duration: 0.02 }, 0.74)
          .to('.pack-clock', { text: '09:05', duration: 0.02 }, 0.88)
          .to('.source-ghost', { autoAlpha: 1, duration: 0.04, stagger: 0.025 }, 0.28)

        // v2.5 B4.2 — one thing moves at a time: strictly sequential flights,
        // the next launches only when the previous has landed.
        flights.forEach((_, index) => {
          const slot = 0.2 + index * 0.042
          timeline
            .to(`.flight-${index}`, { autoAlpha: 1, x: 32 + index * 2, y: 16 + index * 3, duration: 0.034, ease: 'power3.out' }, slot)
            .to(`.tether-${index}`, { strokeDashoffset: 0, duration: 0.03 }, slot + 0.006)
            .to(`.entry-grid-row:nth-child(${index + 1})`, { borderBottomColor: 'rgb(22 49 61 / 1)', duration: 0.008, yoyo: true, repeat: 1 }, slot + 0.036)
        })

        timeline
          .to('.flag-cards article', { autoAlpha: 1, x: 0, duration: 0.08, stagger: 0.04 }, 0.56)
          .to('.evidence-copy', { autoAlpha: 1, y: -10, duration: 0.1 }, 0.66)
          .to('.ghost-2', { borderColor: 'var(--cleared)', borderStyle: 'solid', duration: 0.04 }, 0.66)
          .to('.entry-grid-row:nth-child(3), .entry-grid-row:nth-child(4)', { scale: 1.015, duration: 0.08 }, 0.7)
          .to('.handover-card', { autoAlpha: 1, x: 0, duration: 0.08 }, 0.82)
          .to('.entry-grid', { scale: 0.9, x: 16, duration: 0.1 }, 0.82)
          .to('.handover-caption', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.88)
          .to('.stamp-animated', { autoAlpha: 0.92, scale: 1, rotate: -3, duration: 0.035, ease: 'back.out(3)' }, 0.965)
          .to('.handover-card', { y: 3, duration: 0.02, yoyo: true, repeat: 1 }, 0.97)
      }

      gsap.fromTo(
        '.shred-doc i',
        { y: 0, autoAlpha: 1 },
        {
          y: reduceMotion ? 0 : 30,
          autoAlpha: reduceMotion ? 0.15 : 0,
          duration: reduceMotion ? 0.01 : 0.45,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.shred-stage', start: 'top 65%', once: true },
        },
      )

      gsap.fromTo(
        '.signature path',
        { strokeDasharray: 380, strokeDashoffset: 380 },
        {
          strokeDashoffset: 0,
          duration: reduceMotion ? 0.2 : 0.6,
          // the footer is the page's last inch: fire as soon as the signature enters the viewport
          scrollTrigger: { trigger: '.signature', start: 'top bottom-=32', once: true },
        },
      )
    })

    // v3.0 §3 — every anchor ride takes 900ms on --ease-inout, through Lenis when it runs
    const scrollToTarget = (target: HTMLElement) => {
      if (reduceMotion) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
        return
      }
      if (lenis) {
        lenis.scrollTo(target, { offset: -120, duration: 0.9, easing: easeInOutCubic })
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]')
      if (!anchor) return
      const hash = anchor.hash
      if (!hash || (anchor.pathname !== window.location.pathname && anchor.pathname !== '')) return
      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return
      event.preventDefault()
      history.pushState(null, '', hash)
      scrollToTarget(target)
    }
    document.addEventListener('click', onAnchorClick)

    // A cold deep link (e.g. shared #book) must survive the world mounting its
    // pins AFTER the async frame manifest loads — that grows the page ~6000px and
    // moves every target below the world. Re-align as layout settles and on each
    // ScrollTrigger refresh, but never fight a user who has already scrolled.
    let userScrolled = false
    const markScrolled = () => {
      userScrolled = true
    }
    window.addEventListener('wheel', markScrolled, { passive: true })
    window.addEventListener('touchstart', markScrolled, { passive: true })
    window.addEventListener('keydown', markScrolled)

    const scrollToHash = () => {
      if (!window.location.hash || userScrolled) return
      const target = document.querySelector<HTMLElement>(window.location.hash)
      if (target) scrollToTarget(target)
    }
    const hashTimers = [60, 500, 1200, 2200, 3400, 5000].map((delay) =>
      window.setTimeout(scrollToHash, delay),
    )
    ScrollTrigger.addEventListener('refresh', scrollToHash)
    const onHashChange = () => {
      userScrolled = false
      scrollToHash()
    }
    window.addEventListener('hashchange', onHashChange)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('wheel', markScrolled)
      window.removeEventListener('touchstart', markScrolled)
      window.removeEventListener('keydown', markScrolled)
      ScrollTrigger.removeEventListener('refresh', scrollToHash)
      hashTimers.forEach((timer) => window.clearTimeout(timer))
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [source])

  return (
    <div className="document-frame">
      {/* v3.0 §3 — the frame draws itself first: four edges, scaleX/Y from centre, 300ms */}
      <div className="frame-draw" aria-hidden="true">
        <i className="fd-top" />
        <i className="fd-bottom" />
        <i className="fd-left" />
        <i className="fd-right" />
      </div>
      <PaperGrain />
      <MarginSpine />
      <Header source={source} setSource={setSource} />
      <main>
        <Hero mailto={mailto} source={source} />
        <PaperWorld mailto={mailto} source={source} />
        <AssemblyScene mailto={mailto} source={source} />
        <DeskMathSection source={source} />
        <AnyFile mailto={mailto} source={source} />
        <SystemSection />
        <SecuritySection />
        <TestimonialStrip />
        <QuestionsSection />
        <ProvenanceStrip />
        <PilotSection />
        <BookSection mailto={mailto} source={source} />
      </main>
      <Footer />
      <MobileCta mailto={mailto} source={source} />
    </div>
  )
}

function App() {
  const path = window.location.pathname
  if (path.endsWith('/privacy')) return <PrivacyPage />
  if (path.endsWith('/security')) return <SecurityPage />
  return <HomePage />
}

export default App

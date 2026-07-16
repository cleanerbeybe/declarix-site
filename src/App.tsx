import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { TextPlugin } from 'gsap/TextPlugin'
import { SplitText } from 'gsap/SplitText'
import type Lenis from 'lenis'
import { CONFIG, isConfigured } from './config'
import { getAttribution, initAnalytics, track } from './analytics'
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
  return getAttribution().source
}

function buildMailto(src: string) {
  const subject = encodeURIComponent(`Workflow review — [your company] — via DCLRX-H1/${src}`)
  const body = encodeURIComponent(
    'Please do not attach live customer documents yet.\nOur customs system: [ ]\nDeclarations per week, roughly: [ ]\nRepresentative document mix: [ ]\nBest contact: [ ]',
  )
  return `mailto:${CONFIG.packEmail}?subject=${subject}&body=${body}`
}

const costPresets = [
  {
    title: 'THE 12-CLERK DESK',
    volume: 480,
    lines: ['480 DECLARATIONS / WK', '24,960 DECLARATIONS / YR', 'BASELINE EACH WORK STAGE'],
    close: ['MEASURE PREPARATION, REVIEW, CHASES AND REWORK SEPARATELY.'],
  },
  {
    title: 'THE 6-CLERK DESK',
    volume: 210,
    lines: ['210 DECLARATIONS / WK', '10,920 DECLARATIONS / YR', 'INCLUDE THE PEAK PATTERN'],
    close: ['TEST A REPRESENTATIVE PACK, NOT A PERFECT DEMO.'],
  },
  {
    title: 'THE GROWTH PROBLEM',
    volume: null,
    lines: ['VOLUME UP · TEAM FLAT', 'EXCEPTIONS AND REWORK VISIBLE'],
    close: ['MODEL WITH YOUR OWN NUMBERS.', 'KEEP EVERY UNSUPPORTED CASE IN THE RESULT.'],
  },
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
            <small>SOURCE-LINKED DRAFTS · BROKER REVIEW · EXISTING SYSTEMS</small>
          </span>
        </a>
        <div className="header-cell">
          <span>FORM REF</span>
          <strong>DCLRX-H1</strong>
        </div>
        <div className="header-cell">
          <span>ISSUE</span>
          <strong>4.1 · JUL 2026</strong>
        </div>
        <div className="header-cell header-slots">
          <span>PILOT STATUS</span>
          <strong>ASK AVAILABILITY</strong>
        </div>
        <nav className="header-nav" aria-label="Page sections">
          <a href="#job">THE DRAFT</a>
          <a href="#numbers">MEASURE</a>
          <a href="#security">SECURITY</a>
          <a href="#pilot">PILOT</a>
        </nav>
        <Button href="#book" className="header-cta" onClick={() => track('cta_book_click', { source })}>
          <span className="full-label">Book the 20-minute workflow call</span>
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

// v3.0 §2 / v4.0 — the ink-duotone film hero: the physical world behind, the
// paperwork in front. The film plays on every viewport (615KB loop, poster is
// still the LCP element); reduced-motion and Save-Data keep the poster still.
function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [filmAllowed, setFilmAllowed] = useState(false)
  const [smallViewport, setSmallViewport] = useState(false)

  useEffect(() => {
    if (!isConfigured(CONFIG.heroLoopUrl)) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as { connection?: { saveData?: boolean } }).connection
    const saveData = Boolean(connection?.saveData)
    // phones fetch the 960px encode (~40% of the bytes, identical at that scale)
    setSmallViewport(window.matchMedia('(max-width: 980px)').matches)
    setFilmAllowed(!reduceMotion && !saveData)
  }, [])

  useEffect(() => {
    // 0.75× — the terminal moves at dawn pace, not showreel pace
    if (filmAllowed && videoRef.current) videoRef.current.playbackRate = 0.75
  }, [filmAllowed])

  useEffect(() => {
    // iOS Low Power Mode rejects autoplay; a real gesture may start playback
    if (!filmAllowed) return
    const tryPlay = () => {
      const video = videoRef.current
      if (video?.paused) video.play().catch(() => undefined)
    }
    window.addEventListener('touchstart', tryPlay, { passive: true })
    window.addEventListener('scroll', tryPlay, { passive: true })
    return () => {
      window.removeEventListener('touchstart', tryPlay)
      window.removeEventListener('scroll', tryPlay)
    }
  }, [filmAllowed])

  return (
    <div className="hero-media" aria-hidden="true">
      {/* the poster is ALWAYS the base layer (and the LCP element); the film
          fades in over it only once frames are genuinely flowing, so no
          autoplay policy or browser quirk can leave the hero blank */}
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
      {filmAllowed ? (
        <video
          className="hero-film"
          key={smallViewport ? 'hero-960' : 'hero-1600'}
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          onPlaying={(event) => event.currentTarget.classList.add('is-playing')}
        >
          {/* VP9 first (Chrome/Firefox), H.264 mp4 fallback (Safari/iOS/all) */}
          <source
            src={appPath(CONFIG.heroLoopUrl.replace(/\.mp4$/, smallViewport ? '-960.webm' : '.webm'))}
            type="video/webm"
          />
          <source
            src={appPath(smallViewport ? CONFIG.heroLoopUrl.replace(/\.mp4$/, '-960.mp4') : CONFIG.heroLoopUrl)}
            type="video/mp4"
          />
        </video>
      ) : null}
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
            <span>Customer paperwork in. A source-linked draft pack out.</span>
          </span>
        </h1>
        <p className="hero-support reveal">The preparation layer before your existing customs system.</p>
        <p className="hero-body reveal">
          Declarix prepares source-linked draft data and unresolved questions for broker review. It
          does not submit to HMRC; your firm reviews and files.
        </p>
        <p className="price-cue reveal">CURRENT H1 PROFILE: REVIEW-ONLY · CLAIMS MANIFEST 1.0.0</p>
        <div className="cta-row reveal">
          <Button href={mailto} tone="secondary" onClick={() => track('cta_pack_mailto', { source })}>
            Ask for a secure pack review
          </Button>
          <Button href="#book" onClick={() => track('cta_book_click', { source })}>
            Book the 20-minute workflow call
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
        <i className="grid-stamp-mark">DRAFT ASSEMBLED</i>
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
          <h2 id="job-title">How the draft keeps its sources.</h2>
        </div>
        <p className="standfirst reveal">
          Customer paperwork in. Source-linked draft out. Watch one synthetic, real-shaped job go through.
        </p>
      </div>
      <div
        className="assembly-pin"
        aria-label="A messy customs job assembles into a source-linked draft pack for broker review."
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
              MANUAL PREPARATION TIME: MEASURE ON THE BROKER'S DESK.
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
              <h3>Each proposed value in this worked example shows its working.</h3>
              <p>
                In this worked example, tap a proposed value and its source lights up — document,
                page, line. The broker can inspect the evidence rather than relying on an unsupported
                confidence claim.
              </p>
            </div>
            <div className="handover-card">
              <div>
                <strong>ENTRY PACK DX-2216</strong>
                <span>43 LINES · DRAFT FOR BROKER REVIEW</span>
                <small>PREPARED BY DECLARIX · CHECKED BY __________ (YOUR CLERK)</small>
              </div>
              <div className="slot-toggle">
                <button type="button">CMS HANDOFF A</button>
                <button type="button">CMS HANDOFF B</button>
                <button type="button">REVIEW FORMAT</button>
              </div>
              <Stamp className="stamp-animated" ring="DECLARIX · DRAFT ASSEMBLED · SYNTHETIC" centre="BROKER · REVIEW" />
            </div>
            <div className="handover-caption">
              <strong>Keep the customs system. Review the source-linked draft.</strong>
              <span>
                SYNTHETIC EXAMPLE · TIMINGS ARE INTERFACE NARRATIVE, NOT A CUSTOMER OUTCOME.
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
            Ask for a secure pack review
          </Button>
          <Button href="#book" onClick={() => track('cta_book_click', { source })}>
            Book the 20-minute workflow call
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
          <SectionTitle box="BOX 4" title="Test the document mix your customers actually send." />
          <p>
            PDF invoices, spreadsheets with merged cells, scans, phone photos of delivery notes,
            forwarded email chains, the 300-line packing list. A pilot records what can be structured,
            what needs review, and what remains unsupported.
          </p>
          <h3>Bring the real edge cases.</h3>
          <a className="text-link" href={mailto} onClick={() => track('cta_pack_mailto', { source })}>
            scope a secure pack review →
          </a>
        </div>
        <div className="specimen-marquee" aria-label="Example customer files">
          <div>
            {[...specimens, ...specimens].map((item, index) => (
              <article className={`specimen ${item.includes('D6 · FROM THE JOB ABOVE') ? 'specimen-from-job' : ''}`} key={`${item}-${index}`}>
                <span>{item}</span>
                <p>DECLARIX INTAKE · DOCUMENT MIX</p>
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
          Declarix prepares in front of the broker's existing customs system. It does not submit to
          HMRC, and any system-specific handoff is described as tested only when the evidence exists.
        </p>
        <div className="integration-wall reveal" aria-label="Customs system boundary">
          <div>
            <span>SOURCE DOCUMENTS</span>
            <span>DECLARIX DRAFT</span>
            <span>BROKER REVIEW FORMAT</span>
          </div>
          <p className="mono-note">THE BROKER'S CUSTOMS SYSTEM REMAINS THE FILING LAYER.</p>
        </div>
        <div className="flow-strip reveal">
          <span className="flow-pack-token" aria-hidden="true">PACK</span>
          {['CUSTOMER PAPERWORK', 'DECLARIX DRAFT', "YOUR CLERK'S CHECK", 'EXISTING CMS', 'HMRC CDS'].map(
            (node) => (
              <div className={node === 'DECLARIX DRAFT' ? 'flow-node flow-cleared' : 'flow-node'} key={node}>
                <span>{node}</span>
                {node === 'DECLARIX DRAFT' ? (
                  <>
                    <small>SOURCE-LINKED</small>
                    <small>UNRESOLVED FACTS STAY VISIBLE</small>
                  </>
                ) : null}
                {node === "YOUR CLERK'S CHECK" ? <small>STILL YOURS</small> : null}
              </div>
            ),
          )}
        </div>
        <p className="mono-note">
          PREPARATION BOUNDARY FIRST. TARGET-SYSTEM HANDOFF TESTED IN THE AGREED PILOT SCOPE.
        </p>
        <p className="mono-note intake-note">DO NOT SEND LIVE DOCUMENTS UNTIL THE APPROVED TRANSFER CHANNEL IS AGREED.</p>
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
          <SectionTitle box="BOX 6" title="Defined for the deployment. Confirmed in writing." />
          <p>
            Before a pilot, Declarix records the approved data flow, purpose, access, subprocessors,
            processing locations, retention classes, deletion behavior, legal-hold treatment, and
            incident contacts. Customs records and short-lived operational artefacts can have
            different obligations, so the deployment schedule controls the answer.
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
              <span>DOCUMENT TRANSFER</span>
              <strong>APPROVED CHANNEL BEFORE PILOT</strong>
            </p>
            <p>
              <span>RETENTION &amp; DELETION</span>
              <strong>
                DEFINED BY DATA CLASS
                <small>RECORDED IN THE PILOT SCHEDULE</small>
              </strong>
            </p>
            <p>
              <span>DATA USE TERMS</span>
              <strong>CONFIRMED IN WRITING</strong>
            </p>
            <p>
              <span>PROCESSING LOCATIONS</span>
              <strong>DEPLOYMENT INVENTORY</strong>
            </p>
            <p>
              <span>ACCESS TO HMRC</span>
              <strong>NONE — WE NEVER SUBMIT</strong>
            </p>
            <p>
              <span>SUBPROCESSORS</span>
              <strong>CURRENT INVENTORY BEFORE PILOT</strong>
            </p>
            <p className="ledger-link-row">
              <span>FULL SECURITY NOTES</span>
              <strong>
                <a href={appPath('/security/')}>→ /SECURITY</a>
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
  const annualEntries = entries * 52

  function applyPreset(volume: number | null) {
    if (!volume) return
    setEntries(volume)
    track('volume_model_change', { entries: volume, annual_entries: volume * 52, preset: true })
    window.setTimeout(() => {
      document.getElementById('cost-outputs')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 40)
  }

  return (
    <section className="box" id="numbers" aria-labelledby="numbers-title">
      <div className="box-inner desk-maths">
        <SectionTitle box="BOX 3" title="One declaration, measured honestly." />
        <div className="cost-docket reveal">
          <span className="docket-clock">09:05</span>
          <span className="docket-scan" aria-hidden="true" />
          <p className="cost-docket-title">ONE DECLARATION, SIDE BY SIDE</p>
          <div className="cost-columns">
            <div>
              <h3>CURRENT WORKFLOW</h3>
              <p><span>PREPARATION</span><strong className="docket-minutes" data-text="MEASURE">MEASURE</strong></p>
              <p><span>CUSTOMER CHASE</span><strong>RECORD</strong></p>
              <p><span>BROKER REVIEW</span><strong>RECORD</strong></p>
              <p className="total-row"><span>REWORK</span><strong>KEEP VISIBLE</strong></p>
            </div>
            <div>
              <h3>DECLARIX-ASSISTED</h3>
              <p><span>SAME SOURCE PACK</span><strong className="docket-minutes" data-text="COMPARE">COMPARE</strong></p>
              <p><span>SOURCE-LINKED DRAFT</span><strong>BROKER REVIEW</strong></p>
              <p><span>UNSUPPORTED CASES</span><strong>COUNTED</strong></p>
              <p className="total-row"><span>COMMERCIAL TERMS</span><strong>WRITTEN AFTER SCOPE</strong></p>
            </div>
          </div>
        </div>
        <p className="desk-intro">
          Use the same source pack and agreed start and stop points. Separate preparation, customer
          chase, broker review, correction, and filing so the result can survive scrutiny.
        </p>
        <div className="numbers-grid">
          <div className="calculator-panel">
            <p className="mono-note">SIZE THE WORKFLOW TO TEST — THIS IS VOLUME, NOT A SAVINGS FORECAST.</p>
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
              track('volume_model_change', { entries: value, annual_entries: value * 52 })
            }}
            step="5"
            type="range"
            value={entries}
          />
        </div>
        <div className="roi-output" id="cost-outputs" aria-live="polite">
          <article>
            <span>WEEKLY ENTRY VOLUME</span>
            <strong><CountUp value={entries} /></strong>
            <small>YOUR INPUT · NO INDUSTRY BENCHMARK IMPLIED</small>
          </article>
          <article>
            <span>ANNUAL ENTRY VOLUME</span>
            <strong><CountUp value={annualEntries} /></strong>
          </article>
          <article>
            <span>PILOT DECISION</span>
            <strong>MEASURE THE SAME PACK</strong>
          </article>
        </div>
      </div>
        <p className="mono-note assumption-note">
          NO GENERIC SAVINGS CLAIM · RECORD PREPARATION, REVIEW, CHASES, EXCEPTIONS, REWORK AND HANDOFF.
          PRICE AND PILOT TERMS ARE CONFIRMED IN WRITING AFTER THE SCOPE IS KNOWN.
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
            <p>A commercial decision tied to measured workflow evidence, not a headline scenario.</p>
          </article>
          <article>
            <span>OPS MANAGER</span>
            <p>Peak volume, exception load, review time, and rework captured in the same pilot ledger.</p>
          </article>
          <article>
            <span>HEAD OF CUSTOMS</span>
            <p>Sources attached to proposed fields and every unsupported case left visible.</p>
          </article>
          <article>
            <span>SENIOR CLERK</span>
            <p>You check, you approve, and the firm files through the system it already controls.</p>
          </article>
        </div>
        <div className="desk-cta">
          <Button href="#book" onClick={() => track('cta_book_click', { source })}>
            Book the 20-minute workflow call
          </Button>
          <p className="mono-note">BRING A REPRESENTATIVE WEEK'S VOLUME. WE'LL DEFINE THE SIDE-BY-SIDE MEASUREMENT LEDGER.</p>
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
              <li>YOU SCOPE ........ ONE SYNTHETIC OR PROPERLY ANONYMISED JOB</li>
              <li>WE AGREE ......... TRANSFER, DATA, SUPPORT AND COMMERCIAL TERMS</li>
              <li>WE PREPARE ....... A SOURCE-LINKED DRAFT FOR BROKER REVIEW</li>
              <li>YOUR CLERK ....... CHECKS IT SIDE-BY-SIDE AGAINST THE MANUAL RUN</li>
              <li>WE RECORD ........ TIME, EXCEPTIONS, REWORK AND HANDOFF OUTCOME</li>
            </ol>
          </div>
        </div>
        <div className="pilot-proof">
          <div className="pilot-stamp-wrap">
            <Stamp ring="ONE PACK · SAME BASELINE · WRITTEN TERMS" centre="MEASURED · NOT PROMISED" />
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

// v4.0 — the Zoho diary is a third-party iframe that can't inherit our ink/paper
// system, so it stays hidden until the visitor commits to booking: the panel reads
// on-brand by default and the live calendar mounts inline on click (no new tab).
function ZohoBookingEmbed({ source }: { source: string }) {
  const configured =
    isConfigured(CONFIG.zohoBookingUrl) && isConfigured(CONFIG.zohoBookingScriptUrl)
  const [revealed, setRevealed] = useState(false)
  const [status, setStatus] = useState<BookingStatus>(configured ? 'loading' : 'missing')

  useEffect(() => {
    if (!revealed || !configured) return

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
      window.setTimeout(
        () => document.querySelector('#inline-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
        120,
      )
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
  }, [revealed, configured, source])

  if (!configured) {
    // no live diary configured — the public booking page is still one click away
    return (
      <div className="cal-reveal">
        <Button
          href="https://declarixlimited.zohobookings.eu/#/declarixlimited"
          onClick={() => track('cta_book_click', { source, mode: 'external' })}
        >
          See available times
        </Button>
        <p className="mono-note">OPENS THE DECLARIX DIARY.</p>
      </div>
    )
  }

  if (!revealed) {
    return (
      <div className="cal-reveal">
        <Stamp className="booking-stamp-crop" ring="DECLARIX · WORKFLOW REVIEW · 20 MIN" centre="BOOK · A CALL" />
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            setRevealed(true)
            track('booking_reveal', { source })
          }}
        >
          See available times
        </button>
        <p className="mono-note">PICK A SLOT INLINE — NO NEW TAB, NO LOGIN.</p>
      </div>
    )
  }

  return (
    <div className="cal-inline-widget zoho-booking-widget">
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
        <SectionTitle box="BOX 9" title="Two ways to start. Neither needs a live document." />
        <div className="start-cards">
          <article className="start-card">
            <span>ASK FOR A SECURE PACK REVIEW</span>
            <p>
              Tell us the document mix, weekly volume, current customs system, and the edge cases
              that create work. We agree the transfer channel and data schedule before any live
              customer document moves.
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
              DO NOT ATTACH LIVE CUSTOMER DOCUMENTS TO THE FIRST EMAIL. START WITH THE WORKFLOW SHAPE.
            </p>
          </article>
          <article className="start-card primary-card">
            <span>BOOK THE 20-MINUTE WORKFLOW CALL</span>
            <p>
              Bring one week's representative volume. We define the side-by-side measurement,
              supported scope, and information needed for a written pilot proposal.
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
      <p>DECLARIX · FORM DCLRX-H1 · ISSUE 4.1 · PUBLIC CLAIMS MANIFEST 1.0.0 · ZOHO LOADS AFTER VISITOR ACTION.</p>
      <nav>
        <a href={appPath('/privacy/')}>PRIVACY</a>
        <a href={appPath('/security/')}>SECURITY</a>
        <a href={appPath('/supported-scope/')}>SUPPORTED SCOPE</a>
        <a href={appPath('/pricing/')}>PRICING</a>
        <a href={appPath('/pricing-policy/')}>PRICING POLICY</a>
        <a href={appPath('/how-it-works/')}>HOW IT WORKS</a>
        <a href={appPath('/customs-declaration-software/')}>CUSTOMS SOFTWARE</a>
        <a href={appPath('/pilot/')}>PILOT</a>
        <a href={appPath('/about/')}>ABOUT</a>
        <a href={appPath('/terms/')}>TERMS</a>
        <a href={appPath('/editorial-policy/')}>SOURCES &amp; CORRECTIONS</a>
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
        Scope a pack review
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
          <SectionTitle box="PRIVACY" title="Know what happens before you send data." />
          <p>
            This public site does not accept document uploads. Do not attach live customer documents
            to an initial email. Before a pilot, Declarix agrees the transfer channel, data purpose,
            access, vendors, locations, retention classes, deletion behavior, and incident contacts.
          </p>
          <p>
            This release does not activate Declarix product analytics or marketing cookies. Zoho
            Bookings loads only after a visitor asks to view the diary and then handles the booking
            information entered there.
          </p>
          <p>
            Customs records and short-lived operational artefacts may have different obligations.
            The deployment schedule controls the pilot. For privacy requests, contact {CONFIG.packEmail}.
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
          <SectionTitle box="SECURITY" title="A security answer should name the deployment." />
          <p>
            Declarix prepares a source-linked draft pack for broker review. It does not submit to
            HMRC; the broker remains responsible for review and filing. Before a pilot, the actual
            data flow and control schedule are supplied for the proposed deployment.
          </p>
          <div className="security-ledger">
            <p>
              <span>DOCUMENT TRANSFER</span>
              <strong>APPROVED CHANNEL BEFORE PILOT</strong>
            </p>
            <p>
              <span>RETENTION AND DELETION</span>
              <strong>DEFINED BY DATA CLASS AND LEGAL BASIS</strong>
            </p>
            <p>
              <span>DATA USE TERMS</span>
              <strong>CONFIRMED IN WRITING</strong>
            </p>
            <p>
              <span>ACCESS TO HMRC</span>
              <strong>NONE — WE NEVER SUBMIT</strong>
            </p>
            <p>
              <span>VENDORS AND LOCATIONS</span>
              <strong>CURRENT DEPLOYMENT INVENTORY BEFORE PILOT</strong>
            </p>
          </div>
          <p>
            For the deployment packet, data-processing terms, vendor inventory, locations,
            retention rules, or security questionnaire, contact {CONFIG.packEmail}.
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
    let cancelled = false
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
        // v3.0 §3 — Lenis lerp 0.08 on desktop. Loaded as its own async chunk so
        // the touch / reduced-motion / Save-Data paths never fetch it; until it
        // resolves, anchor rides fall back to native smooth scroll (see below).
        void import('lenis').then(({ default: Lenis }) => {
          if (cancelled) return
          lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1 })
          lenis.on('scroll', ScrollTrigger.update)
          const tick = (time: number) => lenis!.raf(time * 1000)
          gsap.ticker.add(tick)
          gsap.ticker.lagSmoothing(0)
          window.addEventListener('beforeunload', () => lenis!.destroy(), { once: true })
        })
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
      // tolerate '#book?src=x' — anything after ? is not part of the anchor
      const hash = window.location.hash.split('?')[0]
      if (hash.length < 2) return
      const target = document.querySelector<HTMLElement>(hash)
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
      cancelled = true
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
  if (path.endsWith('/privacy') || path.endsWith('/privacy/')) return <PrivacyPage />
  if (path.endsWith('/security') || path.endsWith('/security/')) return <SecurityPage />
  return <HomePage />
}

export default App

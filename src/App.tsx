import { type ReactNode, useEffect, useMemo, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { TextPlugin } from 'gsap/TextPlugin'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { CONFIG, isConfigured } from './config'
import { initAnalytics, track } from './analytics'
import { documents, flights, packRows, questions, specimens } from './data'

type ButtonTone = 'primary' | 'secondary'

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
    'Attached: one anonymised job.\nOur declaration system: [Sequoia / Descartes / other]\nEntries per week, roughly: [ ]\nSend the pack back to: [ ]',
  )
  return `mailto:${CONFIG.packEmail}?subject=${subject}&body=${body}`
}

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
            <small>THE OFFICE LAYER FOR CUSTOMS BROKERS</small>
          </span>
        </a>
        <div className="header-cell">
          <span>FORM REF</span>
          <strong>DCLRX-H1</strong>
        </div>
        <div className="header-cell">
          <span>ISSUE</span>
          <strong>2.0 · JUL 2026</strong>
        </div>
        <div className="header-cell header-slots">
          <span>PILOT SLOTS</span>
          <strong>{CONFIG.pilotSlotsOpen} OF 5 OPEN</strong>
        </div>
        <nav className="header-nav" aria-label="Page sections">
          <a href="#job">THE JOB</a>
          <a href="#evidence">EVIDENCE</a>
          <a href="#security">SECURITY</a>
          <a href="#numbers">NUMBERS</a>
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
            MET US AT MULTIMODAL (NEC · 30 JUN-2 JUL)? Mention it when you book — we'll bring
            your stand notes to the call. →
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
      <span>{box}</span>
      <h2>{title}</h2>
    </div>
  )
}

function Hero({ mailto, source }: { mailto: string; source: string }) {
  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="kicker reveal">CUSTOMS ENTRY PREPARATION — FOR BROKERS, NOT INSTEAD OF THEM</p>
        <h1 className="hero-title" id="hero-title">
          <span className="hero-line">
            <span>Customer paperwork in.</span>
          </span>
          <span className="hero-line">
            <span>Entry-ready pack out.</span>
          </span>
        </h1>
        <p className="hero-body reveal">
          Declarix reads the whole job — any file, straight off a forwarded email — and returns a
          CDS-ready pack for Sequoia or Descartes, with the evidence pinned to every field. Your
          clerk checks it in minutes and submits through your own system, same as today.
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
          <div className={`peek-doc peek-${index + 1}`} key={doc.tag}>
            <span>{doc.tag}</span>
          </div>
        ))}
      </div>
      <p className="scroll-cue">SCROLL — THE JOB ARRIVES ▾</p>
    </section>
  )
}

function PaperDocument({ doc, index }: { doc: (typeof documents)[number]; index: number }) {
  return (
    <article className={`paper-doc paper-doc-${index + 1}`}>
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
        <span>JOB REF DX-2216 · PREPARED 09:03</span>
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
          <h2 id="job-title">The job assembles itself.</h2>
        </div>
      </div>
      <div
        className="assembly-pin"
        aria-label="A messy customs job assembles into an entry-ready pack with evidence pinned to every field."
      >
        <div className="assembly-stage">
          <div className="assembly-caption">
            <p className="type-caption caption-one">08:52 — THE JOB LANDS.</p>
            <p className="type-caption caption-two">
              ONE JOB: 6 ATTACHMENTS · 3 FORMATS · 43 LINES · 2 INVOICES, AMALGAMATED
            </p>
            <p className="type-caption caption-three">OR NO ONE DOES.</p>
          </div>
          <div className="docs-stage">
            <div className="scan-band" aria-hidden="true" />
            {documents.map((doc, index) => (
              <PaperDocument doc={doc} index={index} key={doc.tag} />
            ))}
          </div>
          <svg className="tether-layer" aria-hidden="true" viewBox="0 0 1000 620" preserveAspectRatio="none">
            {flights.map((flight, index) => (
              <path
                className={`tether tether-${index}`}
                d={`M ${245 + index * 9} ${120 + index * 42} C 420 ${100 + index * 20}, 540 ${
                  122 + index * 28
                }, 700 ${118 + index * 38}`}
                key={flight.row}
              />
            ))}
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
                  6912 00 — ceramic tableware, stoneware. Reasoned from line descriptions +
                  supplier history. Indicative duty shown from the UK tariff.
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
          <div className="evidence-popover">
            <span>{row.ref}</span>
            <strong>{row.row}</strong>
            <p>{row.value}</p>
            <small>SOURCE: {row.source}</small>
            <a href="#job">↗ view in place</a>
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
    <section className="box" aria-labelledby="files-title">
      <div className="box-inner two-col">
        <div>
          <SectionTitle box="BOX 3" title="It reads whatever your customers send." />
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
              <article className="specimen" key={`${item}-${index}`}>
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
        <SectionTitle box="BOX 4" title="Not customs software. The layer in front of it." />
        <p className="wide-copy">
          Declarix never touches HMRC and never asks you to migrate anything. The pack drops into
          the system you already run — your badge, your CSP, your submission, your client
          relationship. Output for Sequoia and Descartes e-Customs today; other formats on request.
        </p>
        <div className="flow-strip reveal">
          {['CUSTOMER PAPERWORK', 'DECLARIX', "YOUR CLERK'S CHECK", 'SEQUOIA / DESCARTES', 'HMRC CDS'].map(
            (node) => (
              <div className={node === 'DECLARIX' ? 'flow-node flow-cleared' : 'flow-node'} key={node}>
                <span>{node}</span>
                {node === 'DECLARIX' ? <small>MINUTES</small> : null}
                {node === "YOUR CLERK'S CHECK" ? <small>STILL YOURS</small> : null}
              </div>
            ),
          )}
        </div>
        <p className="mono-note">NO INTEGRATION PROJECT. NO INSTALLATION. AN EMAIL ADDRESS. GO-LIVE: TODAY.</p>
      </div>
    </section>
  )
}

function SecuritySection() {
  return (
    <section className="box dark-box" id="security" aria-labelledby="security-title">
      <div className="box-inner two-col">
        <div>
          <SectionTitle box="BOX 5" title="Processed. Returned. Deleted." />
          <p>
            Your documents exist with us for exactly as long as it takes to build the pack. Then
            they're destroyed. Nothing is archived, nothing waits on a server, and nothing of yours
            trains anything. The models read your documents the way a clerk would — then forget them
            the way a clerk can't.
          </p>
        </div>
        <div className="shred-stage" aria-hidden="true">
          {documents.slice(0, 5).map((doc, index) => (
            <div className={`shred-doc shred-${index}`} key={doc.tag}>
              {Array.from({ length: 6 }).map((_, strip) => (
                <i key={strip} />
              ))}
            </div>
          ))}
          <div className="ledger">
            <p>
              <span>DOCUMENTS RETAINED</span>
              <strong>0 DAYS</strong>
            </p>
            <p>
              <span>PACKS RETAINED</span>
              <strong>YOUR COPY ONLY</strong>
            </p>
            <p>
              <span>TRAINING ON YOUR DATA</span>
              <strong>NONE</strong>
            </p>
            <p>
              <span>ACCESS TO HMRC</span>
              <strong>NONE — WE NEVER SUBMIT</strong>
            </p>
            <p>
              <span>SUBPROCESSORS</span>
              <strong>LISTED IN FULL, ON REQUEST</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function NumbersSection({ source }: { source: string }) {
  const [entries, setEntries] = useState(120)
  const hours = Math.round((entries * 14) / 60)
  const saved = Math.round(entries * (7.95 - 2.45))

  return (
    <section className="box" id="numbers" aria-labelledby="numbers-title">
      <div className="box-inner two-col numbers-grid">
        <div>
          <SectionTitle box="BOX 6" title="The numbers call, previewed." />
          <p className="mono-note">
            KEYING COST PER ENTRY TODAY £7.95 · WITH DECLARIX £2.45 · ILLUSTRATIVE — WE REBUILD
            THIS WITH YOUR NUMBERS ON THE CALL
          </p>
          <label className="range-label" htmlFor="entries">
            <span>ENTRIES PER WEEK</span>
            <strong>{entries}</strong>
          </label>
          <input
            id="entries"
            max="600"
            min="40"
            onChange={(event) => {
              const value = Number(event.currentTarget.value)
              setEntries(value)
              track('roi_slider_change', { entries: value })
            }}
            step="5"
            type="range"
            value={entries}
          />
          <Button href="#book" onClick={() => track('cta_book_click', { source })}>
            Book the 20-minute numbers call
          </Button>
          <p className="mono-note">BRING A REAL WEEK'S VOLUME. WE'LL REBUILD THE MODEL LIVE.</p>
        </div>
        <div className="roi-output" aria-live="polite">
          <article>
            <span>KEYING HOURS BACK PER WEEK</span>
            <strong>{hours}</strong>
          </article>
          <article>
            <span>SAVED PER WEEK £</span>
            <strong>{saved.toLocaleString('en-GB')}</strong>
          </article>
          <article>
            <span>SAME TEAM</span>
            <strong>ROUGHLY 3× THE ENTRIES</strong>
          </article>
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
        <SectionTitle box="BOX 7" title="Questions brokers ask." />
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
          <Stamp ring="FREE IF IT FAILS · CAPPED IF IT WORKS" centre="£0 · £500" />
          <p>
            Declarix is built in the UK by {CONFIG.founderLine}. We'd rather prove it on your
            paperwork than pitch it on ours.
          </p>
          <p className="mono-note">
            {CONFIG.companyLegal} · CO. {CONFIG.companyNo} · ENGLAND &amp; WALES
          </p>
        </div>
      </div>
    </section>
  )
}

function CalEmbed({ source }: { source: string }) {
  useEffect(() => {
    if (!isConfigured(CONFIG.calLink)) return
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://app.cal.com/embed/embed.js'
    document.body.appendChild(script)

    const handler = (event: MessageEvent) => {
      if (typeof event.data === 'object' && event.data?.type === 'bookingSuccessful') {
        track('booking_confirmed', { source })
      }
    }
    window.addEventListener('message', handler)
    return () => {
      window.removeEventListener('message', handler)
      script.remove()
    }
  }, [source])

  if (!isConfigured(CONFIG.calLink)) {
    return (
      <div className="cal-placeholder">
        <span>CAL.COM LINK NEEDED</span>
        <p>Add the Cal.com event slug to CONFIG.calLink to turn this into the live diary.</p>
      </div>
    )
  }

  return (
    <div
      className="cal-inline-widget"
      data-cal-config={JSON.stringify({
        theme: 'light',
        layout: 'month_view',
        brandColor: '#1B7A4B',
        metadata: { src: source },
      })}
      data-cal-link={CONFIG.calLink}
    >
      <p className="mono-note">LOADING THE DIARY...</p>
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
                Email the job to {CONFIG.packEmail}
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
            <CalEmbed source={source} />
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
      <p>DECLARIX · FORM DCLRX-H1 · ISSUE 2.0 · THIS PAGE SETS NO MARKETING COOKIES — THERE IS NOTHING TO CONSENT TO.</p>
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
            Cal.com only when a calendar link is connected.
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

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-line > span',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out' },
      )

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: reduceMotion ? 0 : 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduceMotion ? 0.2 : 0.55,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 78%', once: true },
          },
        )
      })

      ScrollTrigger.create({
        start: 80,
        onEnter: () => document.body.classList.add('is-scrolled'),
        onLeaveBack: () => document.body.classList.remove('is-scrolled'),
      })

      if (!reduceMotion && !touch) {
        const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        window.addEventListener('beforeunload', () => lenis.destroy(), { once: true })
      }

      if (!reduceMotion && wide) {
        gsap.set('.flight-chip, .flag-cards article, .evidence-copy, .handover-card, .stamp-animated', {
          autoAlpha: 0,
        })
        gsap.set('.stamp-animated', { scale: 1.6, rotate: -8 })

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.assembly-pin',
            start: 'top top',
            end: '+=420%',
            pin: true,
            scrub: 0.4,
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
          .to('.caption-two', { autoAlpha: 1, duration: 0.05 }, 0.08)
          .to('.caption-three', { autoAlpha: 1, duration: 0.05 }, 0.16)
          .to('.entry-grid', { autoAlpha: 1, duration: 0.08 }, 0.16)
          .to('.scan-band', { yPercent: 560, duration: 0.25, ease: 'none' }, 0.18)

        flights.forEach((_, index) => {
          timeline
            .to(`.flight-${index}`, { autoAlpha: 1, x: 32 + index * 2, y: 16 + index * 3, duration: 0.03 }, 0.22 + index * 0.03)
            .to(`.tether-${index}`, { strokeDashoffset: 0, duration: 0.06 }, 0.21 + index * 0.03)
        })

        timeline
          .to('.flag-cards article', { autoAlpha: 1, x: 0, duration: 0.08, stagger: 0.04 }, 0.48)
          .to('.evidence-copy', { autoAlpha: 1, y: -10, duration: 0.1 }, 0.63)
          .to('.entry-grid-row:nth-child(3), .entry-grid-row:nth-child(4)', { scale: 1.015, duration: 0.08 }, 0.66)
          .to('.handover-card', { autoAlpha: 1, x: 0, duration: 0.08 }, 0.82)
          .to('.entry-grid', { scale: 0.9, x: 16, duration: 0.1 }, 0.82)
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
          scrollTrigger: { trigger: '.signature', start: 'top 85%', once: true },
        },
      )
    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [source])

  return (
    <div className="document-frame">
      <PaperGrain />
      <Header source={source} setSource={setSource} />
      <main>
        <Hero mailto={mailto} source={source} />
        <AssemblyScene mailto={mailto} source={source} />
        <AnyFile mailto={mailto} source={source} />
        <SystemSection />
        <SecuritySection />
        <NumbersSection source={source} />
        <QuestionsSection />
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
  return <HomePage />
}

export default App

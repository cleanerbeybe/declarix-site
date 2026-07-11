import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { track } from './analytics'

// v4.0 §6 — THE PAPER WORLD: five scrub scenes, one narration card, the macro story.
// Renders fully from poster stills alone; frame sequences upgrade it to a scroll film.

type WorldManifest = { scenes: Record<string, number>; source?: string }

const scenes = [
  {
    id: 1,
    tag: 'S1 · THE INBOX',
    headline: 'EVERY TRADE BECOMES PAPERWORK.',
    body: "It lands like this — six attachments, three formats, nobody's favourite job.",
  },
  {
    id: 2,
    tag: 'S2 · THE SCAN',
    headline: 'DECLARIX READS ALL OF IT.',
    body: 'Every format, every page, every line. Nothing keyed by hand.',
  },
  {
    id: 3,
    tag: 'S3 · THE PORT',
    headline: 'WHILE YOUR GOODS CROSS THE WORLD…',
    body: '…the entry is already being built, evidence pinned to every field.',
  },
  {
    id: 4,
    tag: 'S4 · THE ROAD',
    headline: '…THE PACK IS ALREADY HOME.',
    body: 'Entry-ready for Sequoia or Descartes before the ship clears the strait.',
  },
  {
    id: 5,
    tag: 'S5 · THE STAMP',
    headline: 'YOUR CLERK CHECKS. YOUR NAME SIGNS.',
    body: 'PRICED PER ENTRY, NOT PER SEAT · PILOT: FREE IF IT FAILS',
  },
]

// scenes with a 4:5 poster-tall.jpg crop for narrow viewports
const tallPosterScenes = [1, 5]

function worldPath(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  if (!base) return path
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

// frames ship as a WebP ladder — w840/w1200 landscape plus p720 (a 9:16
// centre crop of the same film) so portrait phones get full-bleed cover
// without letterboxing or mush; 1200px JPEGs remain the legacy fallback
function frameUrl(scene: number, index: number, rung: string, webp: boolean) {
  const name = `f_${String(index + 1).padStart(3, '0')}`
  return webp
    ? worldPath(`/world/scene-${scene}/${rung}/${name}.webp`)
    : worldPath(`/world/scene-${scene}/${name}.jpg`)
}

function webpSupported() {
  try {
    return document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp')
  } catch {
    return false
  }
}

function posterUrl(scene: number) {
  return worldPath(`/world/scene-${scene}/poster.jpg`)
}

// cover-fit draw with a zoom cap: on ordinary landscape viewports this is
// object-fit: cover; on extreme narrow-tall windows an uncapped cover would
// blow a slice of the frame up 3-5× (mush) — beyond the cap the frame sits as
// a film strip letterboxed in ink instead
function drawCover(
  canvas: HTMLCanvasElement,
  source: ImageBitmap | HTMLImageElement,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const sw = source.width
  const sh = source.height
  const cw = canvas.width
  const ch = canvas.height
  if (!sw || !sh || !cw || !ch) return
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  const cover = Math.max(cw / sw, ch / sh)
  const contain = Math.min(cw / sw, ch / sh)
  // portrait stages (phones) are ALWAYS full-bleed — ink letterbox bars read
  // as broken black borders on OLED; the zoom cap only serves odd desktop windows
  const scale = ch > cw ? cover : Math.min(cover, contain * 1.45)
  if (scale < cover) {
    ctx.fillStyle = '#16313d'
    ctx.fillRect(0, 0, cw, ch)
  }
  const dw = sw * scale
  const dh = sh * scale
  ctx.drawImage(source, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
}

async function fetchBitmap(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`frame ${url}: ${response.status}`)
  return createImageBitmap(await response.blob())
}

function loadPoster(scene: number, src?: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src || posterUrl(scene)
  })
}

// The mobile/fallback edition plays each scene as a muted looping film
// (hardware-decoded, ~150KB, fetched only when the figure nears the viewport).
// Reduced-motion and Save-Data keep the plain stills.
function WorldStill({ scene, film }: { scene: (typeof scenes)[number]; film: boolean }) {
  const tall = tallPosterScenes.includes(scene.id)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!film || !video) return
    let inView = false
    const tryPlay = () => {
      if (inView && video.paused) video.play().catch(() => undefined)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (entry.isIntersecting) {
          tryPlay()
        } else {
          video.pause()
        }
      },
      { rootMargin: '160px 0px' },
    )
    // iOS Low Power Mode rejects autoplay but allows playback started from a
    // real gesture — retry on the first touches/scrolls so the films still run
    window.addEventListener('touchstart', tryPlay, { passive: true })
    window.addEventListener('touchmove', tryPlay, { passive: true })
    window.addEventListener('scroll', tryPlay, { passive: true })
    observer.observe(video)
    return () => {
      observer.disconnect()
      window.removeEventListener('touchstart', tryPlay)
      window.removeEventListener('touchmove', tryPlay)
      window.removeEventListener('scroll', tryPlay)
    }
  }, [film])

  return (
    <figure className={`exhibit-frame world-still world-still-${scene.id} reveal`}>
      {/* the still is ALWAYS the base layer — the film fades in over it only
          once it is genuinely playing, so no browser quirk can leave a blank */}
      <div className={film ? 'world-media has-film' : 'world-media'}>
        <picture>
          {tall && !film ? (
            <source
              media="(max-width: 640px)"
              srcSet={worldPath(`/world/scene-${scene.id}/poster-tall.jpg`)}
            />
          ) : null}
          <img src={posterUrl(scene.id)} alt="" loading="lazy" decoding="async" />
        </picture>
        {film ? (
          <video
            ref={videoRef}
            muted
            playsInline
            loop
            preload="none"
            aria-hidden="true"
            onPlaying={(event) => event.currentTarget.classList.add('is-playing')}
          >
            <source src={worldPath(`/world/scene-${scene.id}/loop.mp4`)} type="video/mp4" />
          </video>
        ) : null}
      </div>
      <figcaption>
        {scene.tag} — {scene.headline} {scene.body}
      </figcaption>
    </figure>
  )
}

export function PaperWorld({ mailto, source }: { mailto: string; source: string }) {
  const [frameCounts, setFrameCounts] = useState<Record<string, number> | null>(null)
  // 'scrub' = desktop canvas frame-scrub · 'video' = phones, hardware-decoded
  // sticky loop videos (near-zero main-thread cost) · 'stills' = the fallback
  const [renderMode, setRenderMode] = useState<'stills' | 'video' | 'scrub'>('stills')
  const rootRef = useRef<HTMLElement>(null)
  const cardTag = useRef<HTMLSpanElement>(null)
  const cardHeadline = useRef<HTMLHeadingElement>(null)
  const cardBody = useRef<HTMLParagraphElement>(null)

  const scrub = renderMode === 'scrub' && Boolean(frameCounts)

  // choose the engine: phones get sticky hardware-decoded loop videos (the
  // thing iOS is actually fast at); desktop gets the canvas scrub; reduced-motion
  // and Save-Data get the filed still exhibits
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as { connection?: { saveData?: boolean } }).connection
    if (reduceMotion || connection?.saveData) {
      setRenderMode('stills')
      return
    }
    if (window.matchMedia('(max-width: 980px)').matches) {
      setRenderMode('video')
      return
    }
    let cancelled = false
    const request = () =>
      fetch(worldPath('/world/manifest.json'))
        .then((response) => (response.ok ? (response.json() as Promise<WorldManifest>) : null))
        .then((manifest) => {
          if (cancelled || !manifest) return
          const counts = manifest.scenes || {}
          if (Object.values(counts).some((count) => count > 0)) {
            setFrameCounts(counts)
            setRenderMode('scrub')
          }
        })
        .catch(() => undefined)
    // after the hero settles; never in the LCP window
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(request, { timeout: 2500 })
    } else {
      window.setTimeout(request, 1600)
    }
    return () => {
      cancelled = true
    }
  }, [])

  // video mode: play each sticky loop only while it's near the viewport
  // (hardware-decoded, so cost is trivial), and start on the first gesture in
  // case iOS Low Power Mode blocked autoplay
  useEffect(() => {
    if (renderMode !== 'video' || !rootRef.current) return
    const root = rootRef.current
    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('.world-vfilm'))
    const near = new Set<HTMLVideoElement>()
    const pump = () => near.forEach((v) => v.paused && v.play().catch(() => undefined))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement
          if (e.isIntersecting) {
            near.add(v)
            v.play().catch(() => undefined)
          } else {
            near.delete(v)
            v.pause()
          }
        })
      },
      { rootMargin: '200px 0px' },
    )
    videos.forEach((v) => io.observe(v))
    window.addEventListener('touchstart', pump, { passive: true })

    // the video plays itself (smooth), but the COMPOSITION is tied to scroll:
    // the frame pushes in and the card slides/fades as you scroll each scene —
    // transform+opacity only, GPU-composited, so it stays glassy (the aalo feel)
    const vscenes = Array.from(root.querySelectorAll<HTMLElement>('.world-vscene'))
    let raf = 0
    const onScroll = () => {
      pump()
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const vh = window.innerHeight
        vscenes.forEach((sec) => {
          const rect = sec.getBoundingClientRect()
          const travel = rect.height - vh
          if (travel <= 0 || rect.bottom < -vh || rect.top > vh) return
          const p = Math.min(1, Math.max(0, -rect.top / travel))
          const video = sec.querySelector<HTMLElement>('.world-vfilm')
          const card = sec.querySelector<HTMLElement>('.world-vcard')
          if (video) video.style.transform = `scale(${(1 + 0.2 * p).toFixed(3)})`
          if (card) {
            // entry slide settles by p=0.16, then the card keeps drifting up at a
            // different rate than the film's push-in — the parallax gap between the
            // two layers is what makes the scene read as scroll-driven
            const slide = (1 - Math.min(p / 0.16, 1)) * 30 - p * 44
            const out = Math.max(0, (p - 0.86) / 0.14)
            card.style.transform = `translateY(${slide.toFixed(1)}px)`
            card.style.opacity = (1 - out).toFixed(2)
          }
        })
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      io.disconnect()
      window.removeEventListener('touchstart', pump)
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [renderMode])

  useEffect(() => {
    if (!scrub || !frameCounts || !rootRef.current) return
    gsap.registerPlugin(ScrollTrigger, TextPlugin)

    const root = rootRef.current
    const frameCache = new Map<number, Array<ImageBitmap | HTMLImageElement>>()
    const posterCache = new Map<number, HTMLImageElement>()
    const loading = new Set<number>()
    const seen = new Set<number>()
    const lastFrame = new Map<number, number>()
    const denseLen = new Map<number, number>()
    let cardTimeline: gsap.core.Timeline | null = null
    let activeScene = 0

    // pick the frame rung the screen can actually show: portrait viewports
    // take the 9:16 centre-crop rung (full-bleed cover, no letterbox); wide
    // viewports take w840/w1200 by stage CSS px × DPR
    const webp = webpSupported()
    const stage = root.querySelector('.world-stage')
    const stageW = stage?.clientWidth || window.innerWidth
    const stageH = stage?.clientHeight || window.innerHeight
    const portrait = stageH > stageW
    const rung = portrait ? 'p720' : (stageW * (window.devicePixelRatio || 1) <= 1000 ? 'w840' : 'w1200')
    // phones: half the DPR ceiling (1.5×) and every OTHER frame (stride 2) —
    // the scrub smoothing hides the drop, halving decode work + RAM
    const dpr = Math.min(window.devicePixelRatio || 1, portrait ? 1.5 : 2)
    const stride = portrait ? 2 : 1

    // iOS address-bar show/hide fires resize events mid-pin; re-measuring the
    // whole pin stack for those makes the film judder — ignore them
    ScrollTrigger.config({ ignoreMobileResize: true })

    const countFor = (scene: number) => frameCounts[String(scene)] || 0

    const canvasFor = (scene: number) =>
      root.querySelector<HTMLCanvasElement>(`[data-world-canvas="${scene}"]`)

    const redraw = (scene: number) => {
      const canvas = canvasFor(scene)
      if (!canvas) return
      const frames = frameCache.get(scene)
      const index = lastFrame.get(scene) ?? 0
      if (frames) {
        // frames stream in order; if a fast scroll outran the decode, hold the
        // nearest loaded frame rather than dropping to the poster
        let f: ImageBitmap | HTMLImageElement | undefined = frames[index]
        for (let j = index; !f && j >= 0; j--) f = frames[j]
        for (let j = index; !f && j < frames.length; j++) f = frames[j]
        if (f) {
          drawCover(canvas, f)
          return
        }
      }
      if (posterCache.get(scene)) {
        drawCover(canvas, posterCache.get(scene)!)
      }
    }

    const sizeCanvas = (scene: number) => {
      const canvas = canvasFor(scene)
      if (!canvas) return
      const { clientWidth, clientHeight } = canvas
      // dpr is capped to 1.5 on phones — fewer fill pixels per frame; the buffer
      // never exceeds the frame width (supersampling just re-samples the same px)
      const width = Math.min(Math.round(clientWidth * dpr), 1600)
      canvas.width = width
      canvas.height = Math.round((width * clientHeight) / Math.max(clientWidth, 1))
      redraw(scene)
    }

    // posters paint the stage immediately; frames replace them as they land.
    // Portrait stages take the portrait crop's first frame as the poster —
    // a landscape poster would letterbox the very first paint
    const loadScene = (scene: number) => {
      if (scene < 1 || scene > 5 || loading.has(scene)) return
      loading.add(scene)
      loadPoster(scene, portrait && webp ? frameUrl(scene, 0, rung, webp) : undefined)
        .then((poster) => {
          posterCache.set(scene, poster)
          redraw(scene)
        })
        .catch(() => undefined)
      const count = countFor(scene)
      if (!count) return
      // phones load every `stride`-th frame (36 not 72) and decode in small
      // chunks so Safari's main thread never stalls under a 72-image burst
      const indices: number[] = []
      for (let i = 0; i < count; i += stride) indices.push(i)
      if (indices[indices.length - 1] !== count - 1) indices.push(count - 1)
      denseLen.set(scene, indices.length)
      const dense: Array<ImageBitmap | HTMLImageElement> = []
      frameCache.set(scene, dense)

      const CHUNK = 8
      let cursor = 0
      const decodeChunk = () => {
        // bail if the scroll moved this scene out of the resident window
        if (activeScene && Math.abs(scene - activeScene) >= 2) {
          loading.delete(scene)
          return
        }
        const slice = indices.slice(cursor, cursor + CHUNK)
        Promise.all(
          slice.map((idx) => fetchBitmap(frameUrl(scene, idx, rung, webp)).catch(() => null)),
        ).then((bitmaps) => {
          if (!frameCache.has(scene)) {
            bitmaps.forEach((b) => b?.close())
            return
          }
          bitmaps.forEach((b, k) => {
            if (b) dense[cursor + k] = b
          })
          redraw(scene)
          cursor += CHUNK
          if (cursor < indices.length) {
            // yield to the compositor between chunks
            window.setTimeout(decodeChunk, 0)
          }
        })
      }
      decodeChunk()
    }

    // decoded frames are ~4MB each off-heap — only the active scene and its
    // neighbours may stay resident, or laptops OOM the renderer
    const evictFor = (scene: number) => {
      frameCache.forEach((frames, key) => {
        if (Math.abs(key - scene) >= 2) {
          frames.forEach((frame) => {
            if (frame instanceof ImageBitmap) frame.close()
          })
          frameCache.delete(key)
          loading.delete(key)
        }
      })
    }

    const setCard = (scene: number) => {
      if (activeScene === scene) return
      activeScene = scene
      evictFor(scene)
      const copy = scenes[scene - 1]
      root.classList.toggle('world-final', scene === 5)
      cardTimeline?.kill()
      if (!cardTag.current || !cardHeadline.current || !cardBody.current) return
      // existing TextPlugin rule: 24 chars/s, ease none
      cardTimeline = gsap
        .timeline()
        .set(cardTag.current, { text: copy.tag })
        .fromTo(
          cardHeadline.current,
          { text: '' },
          { text: copy.headline, duration: copy.headline.length / 24, ease: 'none' },
          0,
        )
        .fromTo(
          cardBody.current,
          { text: '' },
          { text: copy.body, duration: copy.body.length / 24, ease: 'none' },
          '<+0.2',
        )
      if (!seen.has(scene)) {
        seen.add(scene)
        track('world_scene_view', { scene, source })
      }
    }

    const cardEl = root.querySelector<HTMLElement>('.world-card')

    const ctx = gsap.context(() => {
      scenes.forEach((scene) => {
        const section = root.querySelector<HTMLElement>(`[data-world-scene="${scene.id}"]`)
        if (!section) return
        const stage = section.querySelector<HTMLElement>('.world-stage')
        const wipe = section.querySelector<HTMLElement>('.world-wipe')
        const count = countFor(scene.id)
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          // shorter pin on phones = each scene resolves in less thumb-travel
          end: portrait ? '+=120%' : '+=160%',
          pin: true,
          scrub: portrait ? 0.4 : 0.55,
          // the card is height-0-rail furniture: past the journey it would jut
          // over BOX 2's heading — it leaves with the last scene
          onLeave: () => {
            if (scene.id === 5 && cardEl) {
              gsap.to(cardEl, { autoAlpha: 0, duration: 0.3, ease: 'power2.inOut' })
            }
          },
          onEnter: () => {
            if (scene.id === 5 && cardEl) {
              gsap.to(cardEl, { autoAlpha: 1, duration: 0.3, ease: 'power2.inOut' })
            }
            setCard(scene.id)
            loadScene(scene.id) // deep links land mid-journey
            loadScene(scene.id + 1)
            // v2.4 seam grammar — a hard paper-rule wipe, never a crossfade
            if (wipe) {
              gsap.fromTo(
                wipe,
                { clipPath: 'inset(0 0 0 0)' },
                { clipPath: 'inset(0 0 100% 0)', duration: 0.45, ease: 'power2.inOut' },
              )
            }
          },
          onEnterBack: () => {
            if (scene.id === 5 && cardEl) {
              gsap.to(cardEl, { autoAlpha: 1, duration: 0.3, ease: 'power2.inOut' })
            }
            setCard(scene.id)
            loadScene(scene.id)
            loadScene(scene.id - 1)
          },
          onUpdate: (self) => {
            // map scroll progress across the frames actually loaded (the strided
            // subset on phones), falling back to the full count before load
            const span = (denseLen.get(scene.id) || count) - 1
            if (span < 1) return
            const index = Math.round(gsap.utils.mapRange(0, 1, 0, span, self.progress))
            if (lastFrame.get(scene.id) !== index) {
              lastFrame.set(scene.id, index)
              redraw(scene.id)
            }
          },
        })
        if (stage) sizeCanvas(scene.id)
      })
      // these pins are created after BOX 2's trigger and out of document order —
      // without a sort, every trigger below the world keeps pre-pin positions
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }, root)

    // scene 1 begins fetching once the page is idle; the pins fetch the rest
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => loadScene(1))
    } else {
      window.setTimeout(() => loadScene(1), 400)
    }

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        scenes.forEach((scene) => sizeCanvas(scene.id))
      }, 160)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(resizeTimer)
      cardTimeline?.kill()
      ctx.revert()
      frameCache.forEach((frames) =>
        frames.forEach((frame) => {
          if (frame instanceof ImageBitmap) frame.close()
        }),
      )
      frameCache.clear()
      ScrollTrigger.refresh()
    }
  }, [scrub, frameCounts, source])

  return (
    <section
      className="box world-journey"
      id="journey"
      ref={rootRef}
      aria-label="The journey of one job through world trade, told as a paper world"
    >
      <div className="box-inner world-intro">
        <div className="section-title reveal">
          <span data-box-tag="BOX 1A · THE JOURNEY">BOX 1A · THE JOURNEY</span>
          <h2>One job, door to door.</h2>
        </div>
      </div>
      {/* the full narration, readable without the film */}
      <ul className="visually-hidden">
        {scenes.map((scene) => (
          <li key={scene.id}>
            {scene.headline} {scene.body}
          </li>
        ))}
      </ul>
      {scrub ? (
        <div className="world-stages">
          <div className="world-card-rail" aria-hidden="true">
            <aside className="world-card">
              <span className="world-card-tag" ref={cardTag}>
                {scenes[0].tag}
              </span>
              <h3 className="world-card-headline" ref={cardHeadline}>
                {scenes[0].headline}
              </h3>
              <p className="world-card-body" ref={cardBody}>
                {scenes[0].body}
              </p>
              <div className="world-card-ctas">
                <a
                  className="btn btn-secondary"
                  href={mailto}
                  tabIndex={-1}
                  onClick={() => track('cta_pack_mailto', { source })}
                >
                  Send one ugly pack
                </a>
                <a
                  className="btn btn-primary"
                  href="#book"
                  tabIndex={-1}
                  onClick={() => track('cta_book_click', { source })}
                >
                  Book the 20-minute numbers call
                </a>
              </div>
            </aside>
          </div>
          {scenes.map((scene) => (
            <div className="world-scene" data-world-scene={scene.id} key={scene.id}>
              <div className="world-stage">
                <canvas
                  className="world-canvas"
                  data-world-canvas={scene.id}
                  aria-hidden="true"
                />
                <div className="world-wipe" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      ) : renderMode === 'video' ? (
        <div className="world-videos">
          {scenes.map((scene) => (
            <section className="world-vscene" key={scene.id}>
              <div className="world-vsticky">
                <video
                  className="world-vfilm"
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={worldPath(`/world/scene-${scene.id}/poster-tall.jpg`)}
                  aria-hidden="true"
                  onPlaying={(event) => event.currentTarget.classList.add('is-playing')}
                >
                  <source src={worldPath(`/world/loops/scene-${scene.id}.mp4`)} type="video/mp4" />
                </video>
                <div className="world-vcard">
                  <span className="world-card-tag">{scene.tag}</span>
                  <h3 className="world-card-headline">{scene.headline}</h3>
                  <p className="world-card-body">{scene.body}</p>
                  {scene.id === 5 ? (
                    <div className="world-card-ctas">
                      <a
                        className="btn btn-secondary"
                        href={mailto}
                        onClick={() => track('cta_pack_mailto', { source })}
                      >
                        Send one ugly pack
                      </a>
                      <a
                        className="btn btn-primary"
                        href="#book"
                        onClick={() => track('cta_book_click', { source })}
                      >
                        Book the 20-minute numbers call
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="box-inner world-stills">
          {scenes.map((scene) => (
            <WorldStill scene={scene} film={false} key={scene.id} />
          ))}
          <div className="cta-row centred reveal">
            <a
              className="btn btn-secondary"
              href={mailto}
              onClick={() => track('cta_pack_mailto', { source })}
            >
              Send one ugly pack
            </a>
            <a
              className="btn btn-primary"
              href="#book"
              onClick={() => track('cta_book_click', { source })}
            >
              Book the 20-minute numbers call
            </a>
          </div>
        </div>
      )}
      {/* the world prints as the five captioned stills */}
      <div className="box-inner world-print" aria-hidden="true">
        {scenes.map((scene) => (
          <figure className="exhibit-frame world-still" key={scene.id}>
            <img src={posterUrl(scene.id)} alt="" loading="lazy" decoding="async" />
            <figcaption>
              {scene.tag} — {scene.headline} {scene.body}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

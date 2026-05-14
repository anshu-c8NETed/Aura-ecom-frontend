

import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

import hero1 from '../../assets/images/hero1.jpg'
import hero2 from '../../assets/images/hero2.jpg'
import hero3 from '../../assets/images/hero3.jpg'
import hero4 from '../../assets/images/hero4.jpg'
import hero5 from '../../assets/images/hero5.jpg'

gsap.registerPlugin(ScrollTrigger)

const PANELS = [
  {
    num: '01',
    category: 'The Edit — SS 2025',
    title: 'Culture,\nCurated.',
    body: "From the streets to the runway — icons don't follow the brief, they rewrite it. This is the edit that defines the season.",
    img: hero1,
    accent: '#fff',
  },
  {
    num: '02',
    category: 'Noir Collective',
    title: 'Leather\n& Dark.',
    body: 'Precision-cut leather. Architectural silhouettes. Six looks. One statement: black is never simple.',
    img: hero2,
    accent: '#e8e8e8',
  },
  {
    num: '03',
    category: 'Modern Room',
    title: 'The Show-\nroom.',
    body: 'Save time. Never compromise. Our curated showroom brings every essential under one roof — for those who move fast.',
    img: hero3,
    accent: '#f5f0e8',
  },
  {
    num: '04',
    category: 'Origin Collection',
    title: 'Ours in\nOrigin.',
    body: 'Yours in meaning. Each piece begins the same — what you make of it is entirely your own.',
    img: hero4,
    accent: '#fff',
  },
  {
    num: '05',
    category: 'New Arrivals — FW 24',
    title: 'New\nSeason.',
    body: 'Bold. Enduring. Edge meets elegance in leather drape and structured geometry. The new chapter — now open.',
    img: hero5,
    accent: '#d4c9b8',
  },
]

const BLOOM_IMG = hero1

export default function Hero() {
  const wrapRef     = useRef(null)
  const bloomRef    = useRef(null)
  const loadingRef  = useRef(null)
  const panelsRef   = useRef(null)
  const progressRef = useRef(null)
  const dotsRef     = useRef(null)

  /* ── ACT 1: Bloom entrance ─────────────────────────────────────── */
  useEffect(() => {
    const bloom   = bloomRef.current
    const loading = loadingRef.current
    const panels  = panelsRef.current
    if (!bloom || !loading || !panels) return

    gsap.set(panels, { autoAlpha: 0 })
    const copyWords = panels.querySelectorAll('.hero-copy-word')
    if (copyWords.length) gsap.set(copyWords, { yPercent: 110 })

    if (window.__lenis) window.__lenis.stop()

    const tl = gsap.timeline({
      delay: 0.3,
      defaults: { ease: 'power2.inOut' },
      onComplete: () => { if (window.__lenis) window.__lenis.start() },
    })

    const brandSpans = loading.querySelectorAll('.hero-brand-letter')
    if (brandSpans.length) {
      tl.from(brandSpans, { opacity: 0, y: 10, stagger: 0.1, duration: 0.55 })
    }

    const loadingLine = loading.querySelector('.hero-loading-line')
    if (loadingLine) tl.from(loadingLine, { scaleX: 0, duration: 0.7, ease: 'power3.inOut' }, '<0.3')

    tl.to(bloom, { rotate: -6, scale: 1, duration: 0.6 }, '<0.5')
    tl.to(bloom, { rotate: 0, duration: 0.55 }, '<0.4')
    tl.to(bloom, { width: '100%', height: '100%', duration: 1.2, ease: 'power3.inOut' }, '<0.1')
    tl.to(loading, { autoAlpha: 0, duration: 0.4 }, '<0.7')
    tl.to(panels,  { autoAlpha: 1, duration: 0.2 }, '<0.15')

    if (copyWords.length) {
      tl.to(copyWords, { yPercent: 0, stagger: 0.05, duration: 0.65, ease: 'power3.out' }, '<0.1')
    }

    const ctaGroup  = panels.querySelector('.hero-cta-group')
    const floatTags = panels.querySelectorAll('.hero-float-tag')
    const badge     = panels.querySelector('.hero-badge')

    if (ctaGroup)         tl.from(ctaGroup,  { opacity: 0, y: 14, duration: 0.5 }, '<0.2')
    if (floatTags.length) tl.from(floatTags, { opacity: 0, y: 10, stagger: 0.13, duration: 0.45 }, '<0.1')
    if (badge)            tl.from(badge,      { opacity: 0, x: 12, duration: 0.4 }, '<0.12')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── ACT 2: 5-panel clip-path scroll ───────────────────────────── */
  useGSAP(() => {
    const container = panelsRef.current
    if (!container) return

    const panels = Array.from(container.querySelectorAll('.hero-panel'))
    const bar    = progressRef.current
    const dotEls = dotsRef.current?.querySelectorAll('.hero-dot')
    if (!panels.length) return

    panels.forEach((panel, i) => {
      if (i === 0) return
      const els = panel.querySelectorAll('.ph-number, .ph-cat, .ph-body, .hero-copy-word')
      if (els.length) gsap.set(els, { opacity: 0, y: 22 })
    })

    const tl = gsap.timeline()

    panels.forEach((panel, i) => {
      if (i === 0) {
        const hdrEls = panel.querySelectorAll('.ph-number, .ph-cat, .ph-body')
        if (hdrEls.length) {
          tl.fromTo(hdrEls,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' }
          )
        }
      }

      if (i < panels.length - 1) {
        tl.fromTo(panel,
          { clipPath: 'inset(0 0 0% 0)' },
          { clipPath: 'inset(0 0 100% 0)', ease: 'none', duration: 1 }
        )

        const nextImg = panels[i + 1]?.querySelector('img')
        if (nextImg) {
          tl.fromTo(nextImg,
            { scale: 1.16 },
            { scale: 1, duration: 1.3, ease: 'power2.out' },
            '<'
          )
        }

        const nextHdr = panels[i + 1]?.querySelectorAll(
          '.ph-number, .ph-cat, .ph-body, .hero-copy-word'
        )
        if (nextHdr?.length) {
          tl.fromTo(nextHdr,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' },
            '<0.35'
          )
        }
      }
    })

    ScrollTrigger.create({
      animation: tl,
      trigger:   container,
      start:     'top top',
      end:       () => `+=${tl.totalDuration() * window.innerHeight}`,
      scrub:     0.55,
      pin:       true,
      onUpdate:  ({ progress }) => {
        if (bar) bar.style.width = `${progress * 100}%`
        if (dotEls?.length) {
          const active = Math.min(panels.length - 1, Math.floor(progress * panels.length))
          dotEls.forEach((d, i) => {
            d.style.background = i === active ? 'var(--go)' : 'rgba(250,248,245,0.25)'
            d.style.transform  = i === active ? 'scale(1.9)' : 'scale(1)'
          })
        }
      },
    })
  }, { scope: panelsRef })

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>

      {/* ── Loading / bloom screen ──────────────────────────────── */}
      <div
        ref={loadingRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#0a0a0a',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Brand wordmark */}
        <div style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(0.9rem,1.8vw,1.3rem)',
          fontWeight: 300,
          letterSpacing: '0.55em',
          textTransform: 'uppercase',
          color: '#faf8f5',
          marginBottom: '2.4rem',
          display: 'flex',
          gap: '0.4rem',
        }}>
          {'AURA'.split('').map((ch, i) => (
            <span className="hero-brand-letter" key={i}>{ch}</span>
          ))}
        </div>

        {/* Thin rule beneath brand */}
        <div
          className="hero-loading-line"
          style={{
            width: 120,
            height: 1,
            background: 'rgba(250,248,245,0.25)',
            transformOrigin: 'left center',
            marginBottom: '2.8rem',
          }}
        />

        {/* Season label */}
        <div style={{
          fontSize: '.48rem',
          letterSpacing: '.35em',
          textTransform: 'uppercase',
          color: 'rgba(250,248,245,0.35)',
        }}>
          SS 2025 — The Edit
        </div>

        {/* Bloom image */}
        <div
          ref={bloomRef}
          style={{
            position: 'absolute',
            width: '8vw', height: '13vw',
            transform: 'rotate(0deg) scale(0)',
            overflow: 'hidden',
            willChange: 'transform, width, height',
          }}
        >
          <img
            src={BLOOM_IMG}
            alt="AURA SS 2025"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              display: 'block',
              transform: 'scale(1.6)',
              filter: 'grayscale(20%)',
            }}
          />
        </div>
      </div>

      {/* ── 5-Panel pinned hero ──────────────────────────────────── */}
      <div
        ref={panelsRef}
        style={{ position: 'relative', height: '100vh', visibility: 'hidden' }}
      >
        {/* Progress bar — sits just below the fixed navbar */}
        <div style={{
          position: 'absolute', top: 'clamp(54px,6vw,62px)', left: 0, right: 0,
          height: 1, background: 'rgba(255,255,255,0.08)', zIndex: 60,
        }}>
          <div
            ref={progressRef}
            style={{ height: '100%', width: '0%', background: 'rgba(255,255,255,0.7)', transition: 'width 0.05s linear' }}
          />
        </div>

        {/* Panel counter — top left, clears fixed navbar (54px mobile / 62px desktop) */}
        <div style={{
          position: 'absolute',
          top: 'calc(clamp(54px, 6vw, 62px) + 1.1rem)',
          left: 'clamp(1.5rem,3vw,3rem)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <span style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(.8rem,1.4vw,1rem)',
            fontWeight: 300,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(250,248,245,0.9)',
          }}>
            AURA
          </span>
          <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.25)' }} />
          <span style={{
            fontSize: '.5rem',
            letterSpacing: '.28em',
            textTransform: 'uppercase',
            color: 'rgba(250,248,245,0.4)',
          }}>
            SS 2025
          </span>
        </div>

        {/* Dot nav — right */}
        <div ref={dotsRef} style={{
          position: 'absolute',
          right: 'clamp(1.4rem,2.5vw,2.5rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'center',
        }}>
          {PANELS.map((_, i) => (
            <div
              key={i}
              className="hero-dot"
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: i === 0 ? 'rgba(250,248,245,0.9)' : 'rgba(250,248,245,0.2)',
                transform: i === 0 ? 'scale(1.9)' : 'scale(1)',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          ))}
        </div>

        {/* Panels */}
        {PANELS.map((panel, i) => (
          <section
            key={panel.num}
            className="hero-panel"
            style={{
              position: 'absolute', inset: 0,
              zIndex: PANELS.length - i,
              overflow: 'hidden',
              clipPath: 'inset(0 0 0% 0)',
              willChange: 'clip-path',
              pointerEvents: 'none',
            }}
          >
            {/* Image */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <img
                src={panel.img}
                alt={panel.title}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  objectPosition: i === 0 ? 'center center' : i === 1 ? 'center 30%' : i === 3 ? 'center center' : 'center top',
                  willChange: 'transform',
                  display: 'block',
                  /* Slight desaturate on panels 1,4 to keep editorial look */
                  filter: i === 3 ? 'brightness(0.92) contrast(1.05)' : 'none',
                }}
              />

              {/* Panel-specific overlays */}
              {i === 0 && (
                /* Panel 1: dark vignette + heavy bottom grad for text legibility */
                <div style={{
                  position: 'absolute', inset: 0,
                  background: [
                    'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 30%)',
                    'linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 42%, transparent 65%)',
                  ].join(','),
                  pointerEvents: 'none',
                }} />
              )}
              {i === 1 && (
                /* Panel 2: subtle gradient — image is already dark */
                <div style={{
                  position: 'absolute', inset: 0,
                  background: [
                    'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 32%)',
                    'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.18) 40%, transparent 62%)',
                  ].join(','),
                  pointerEvents: 'none',
                }} />
              )}
              {i === 2 && (
                /* Panel 3: strong gradient — image has light areas */
                <div style={{
                  position: 'absolute', inset: 0,
                  background: [
                    'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 28%)',
                    'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 40%, transparent 60%)',
                  ].join(','),
                  pointerEvents: 'none',
                }} />
              )}
              {i === 3 && (
                /* Panel 4: very light scene — heavy overlay needed */
                <div style={{
                  position: 'absolute', inset: 0,
                  background: [
                    'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 35%)',
                    'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 42%, transparent 65%)',
                    'linear-gradient(90deg, rgba(0,0,0,0.25) 0%, transparent 60%)',
                  ].join(','),
                  pointerEvents: 'none',
                }} />
              )}
              {i === 4 && (
                /* Panel 5: muted editorial */
                <div style={{
                  position: 'absolute', inset: 0,
                  background: [
                    'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 30%)',
                    'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.22) 38%, transparent 60%)',
                  ].join(','),
                  pointerEvents: 'none',
                }} />
              )}
            </div>

            {/* Content */}
            <div style={{
              position: 'absolute', inset: 0,
              padding: 'clamp(2rem,4vw,4rem) clamp(1.8rem,4.5vw,4rem)',
              paddingTop: 'calc(clamp(54px, 6vw, 62px) + clamp(3.5rem,5vw,4.5rem))',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 2,
              color: 'var(--cr)',
            }}>
              {/* Header row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}>
                <span
                  className="ph-number"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '.65rem',
                    letterSpacing: '.14em',
                    color: 'rgba(250,248,245,0.4)',
                  }}
                >
                  {panel.num}
                </span>
                <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.22)' }} />
                <span
                  className="ph-cat"
                  style={{
                    fontSize: '.52rem',
                    letterSpacing: '.28em',
                    textTransform: 'uppercase',
                    color: 'rgba(250,248,245,0.5)',
                  }}
                >
                  {panel.category}
                </span>
              </div>

              {/* Footer row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '2rem',
                flexWrap: 'wrap',
              }}>
                {/* Left: body + CTA */}
                <div style={{ maxWidth: 290 }}>
                  <p
                    className="ph-body"
                    style={{
                      fontSize: '.76rem',
                      lineHeight: 1.95,
                      color: 'rgba(250,248,245,0.82)',
                      textShadow: '0 1px 8px rgba(0,0,0,0.55)',
                      letterSpacing: '.01em',
                    }}
                  >
                    {panel.body}
                  </p>

                  {i === 0 && (
                    <div
                      className="hero-cta-group"
                      style={{
                        marginTop: '1.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        pointerEvents: 'all',
                      }}
                    >
                      <Link to="/collection">
                        <button className="btn-primary"><span>Explore The Edit</span></button>
                      </Link>
                      <button
                        className="btn-ghost"
                        style={{ color: 'var(--cr)' }}
                      >
                        Our Story
                      </button>
                    </div>
                  )}

                  {i === 1 && (
                    <div
                      className="hero-cta-group"
                      style={{
                        marginTop: '1.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        pointerEvents: 'all',
                      }}
                    >
                      <Link to="/collection">
                        <button className="btn-primary"><span>Shop Noir</span></button>
                      </Link>
                    </div>
                  )}

                  {i === 3 && (
                    <div
                      className="hero-cta-group"
                      style={{
                        marginTop: '1.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        pointerEvents: 'all',
                      }}
                    >
                      <Link to="/collection/origin">
                        <button className="btn-primary"><span>Find Your Meaning</span></button>
                      </Link>
                    </div>
                  )}

                  {i === 4 && (
                    <div
                      className="hero-cta-group"
                      style={{
                        marginTop: '1.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        pointerEvents: 'all',
                      }}
                    >
                      <Link to="/new-arrivals">
                        <button className="btn-primary"><span>New Arrivals</span></button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Right: large display title */}
                <div style={{ textAlign: 'right', overflow: 'hidden' }}>
                  {panel.title.split('\n').map((line, li) => (
                    <div key={li} style={{ overflow: 'hidden' }}>
                      <h2
                        className="hero-copy-word"
                        style={{
                          fontFamily: 'var(--fd)',
                          fontSize: i === 2
                            ? 'clamp(3.5rem,8.5vw,7.5rem)'
                            : 'clamp(4rem,10vw,8.8rem)',
                          fontWeight: 300,
                          color: 'var(--cr)',
                          letterSpacing: '-0.035em',
                          lineHeight: 0.9,
                          display: 'inline-block',
                          /* Slightly italic on panel 4 to match "Origin" vibe */
                          fontStyle: i === 3 ? 'italic' : 'normal',
                        }}
                      >
                        {line}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Panel-specific floating elements ───────────────── */}

            {/* Panel 01 — mood board, editorial tags */}
            {i === 0 && (
              <>
                <div
                  className="hero-float-tag"
                  style={{
                    position: 'absolute',
                    top: '16%',
                    right: '8%',
                    background: 'rgba(10,10,10,0.88)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '.75rem 1.05rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                    minWidth: 140,
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ display: 'block', fontSize: '.46rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '.28rem' }}>
                    The Edit
                  </span>
                  <strong style={{ display: 'block', fontFamily: 'var(--fd)', fontSize: '.92rem', fontWeight: 400, color: '#faf8f5', marginBottom: '.18rem' }}>
                    Saint Laurent Trench
                  </strong>
                  <span style={{ fontSize: '.68rem', color: 'rgba(250,248,245,0.45)' }}>₹38,500</span>
                </div>

                <div
                  className="hero-float-tag"
                  style={{
                    position: 'absolute',
                    bottom: '22%',
                    left: '6%',
                    background: 'rgba(10,10,10,0.88)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '.75rem 1.05rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                    minWidth: 140,
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ display: 'block', fontSize: '.46rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '.28rem' }}>
                    Street Luxe
                  </span>
                  <strong style={{ display: 'block', fontFamily: 'var(--fd)', fontSize: '.92rem', fontWeight: 400, color: '#faf8f5', marginBottom: '.18rem' }}>
                    Noir Graphic Tee
                  </strong>
                  <span style={{ fontSize: '.68rem', color: 'rgba(250,248,245,0.45)' }}>₹5,200</span>
                </div>

                <div
                  className="hero-badge"
                  style={{
                    position: 'absolute',
                    bottom: '1.8rem',
                    right: '1.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.6rem',
                    background: 'var(--go)',
                    padding: '.5rem .95rem',
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ch)', flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ch)' }}>
                    The Edit — 24 Pieces
                  </span>
                </div>
              </>
            )}

            {/* Panel 02 — Noir Collective product tag */}
            {i === 1 && (
              <>
                <div
                  className="hero-float-tag"
                  style={{
                    position: 'absolute',
                    top: '18%',
                    right: '7%',
                    background: 'rgba(250,248,245,0.05)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    padding: '.75rem 1.1rem',
                    boxShadow: '0 6px 28px rgba(0,0,0,0.4)',
                    minWidth: 148,
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ display: 'block', fontSize: '.46rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '.28rem' }}>
                    Noir Collective
                  </span>
                  <strong style={{ display: 'block', fontFamily: 'var(--fd)', fontSize: '.92rem', fontWeight: 400, color: '#faf8f5', marginBottom: '.18rem' }}>
                    Croc Leather Coat
                  </strong>
                  <span style={{ fontSize: '.68rem', color: 'rgba(250,248,245,0.45)' }}>₹64,000</span>
                </div>

                <div
                  className="hero-badge"
                  style={{
                    position: 'absolute',
                    bottom: '1.8rem',
                    right: '1.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.6rem',
                    background: 'rgba(10,10,10,0.75)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(8px)',
                    padding: '.5rem .95rem',
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--go)', flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(250,248,245,0.7)' }}>
                    6 Looks — 1 Statement
                  </span>
                </div>
              </>
            )}

            {/* Panel 03 — Modern Room showroom tag */}
            {i === 2 && (
              <>
                <div
                  className="hero-float-tag"
                  style={{
                    position: 'absolute',
                    top: '18%',
                    right: '7%',
                    background: 'rgba(10,10,10,0.82)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '.75rem 1.1rem',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
                    minWidth: 148,
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ display: 'block', fontSize: '.46rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '.28rem' }}>
                    Modern Room
                  </span>
                  <strong style={{ display: 'block', fontFamily: 'var(--fd)', fontSize: '.92rem', fontWeight: 400, color: '#faf8f5', marginBottom: '.18rem' }}>
                    Linen Shift Dress
                  </strong>
                  <span style={{ fontSize: '.68rem', color: 'rgba(250,248,245,0.45)' }}>₹18,500</span>
                </div>

                <div
                  className="hero-badge"
                  style={{
                    position: 'absolute',
                    bottom: '1.8rem',
                    right: '1.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.6rem',
                    background: 'var(--go)',
                    padding: '.5rem .95rem',
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ch)', flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ch)' }}>
                    Showroom — Open Now
                  </span>
                </div>
              </>
            )}

            {/* Panel 04 — Origin Collection */}
            {i === 3 && (
              <>
                <div
                  className="hero-float-tag"
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '6%',
                    background: 'rgba(10,10,10,0.78)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '.75rem 1.1rem',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
                    minWidth: 148,
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ display: 'block', fontSize: '.46rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '.28rem' }}>
                    Origin Drop
                  </span>
                  <strong style={{ display: 'block', fontFamily: 'var(--fd)', fontSize: '.92rem', fontWeight: 400, color: '#faf8f5', marginBottom: '.18rem' }}>
                    Oversized Hood Jacket
                  </strong>
                  <span style={{ fontSize: '.68rem', color: 'rgba(250,248,245,0.45)' }}>₹12,800</span>
                </div>

                <div
                  className="hero-badge"
                  style={{
                    position: 'absolute',
                    bottom: '1.8rem',
                    right: '1.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.6rem',
                    background: 'rgba(10,10,10,0.72)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px)',
                    padding: '.5rem .95rem',
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--go)', flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(250,248,245,0.7)' }}>
                    #OursInOrigin
                  </span>
                </div>
              </>
            )}

            {/* Panel 05 — New Arrivals */}
            {i === 4 && (
              <>
                <div
                  className="hero-float-tag"
                  style={{
                    position: 'absolute',
                    top: '18%',
                    right: '7%',
                    background: 'rgba(10,10,10,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '.75rem 1.1rem',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
                    minWidth: 148,
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ display: 'block', fontSize: '.46rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '.28rem' }}>
                    FW 24 Drop
                  </span>
                  <strong style={{ display: 'block', fontFamily: 'var(--fd)', fontSize: '.92rem', fontWeight: 400, color: '#faf8f5', marginBottom: '.18rem' }}>
                    Structured Leather Vest
                  </strong>
                  <span style={{ fontSize: '.68rem', color: 'rgba(250,248,245,0.45)' }}>₹24,000</span>
                </div>

                <div
                  className="hero-float-tag"
                  style={{
                    position: 'absolute',
                    bottom: '24%',
                    left: '6%',
                    background: 'rgba(10,10,10,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '.75rem 1.1rem',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
                    minWidth: 148,
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ display: 'block', fontSize: '.46rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '.28rem' }}>
                    New Arrival
                  </span>
                  <strong style={{ display: 'block', fontFamily: 'var(--fd)', fontSize: '.92rem', fontWeight: 400, color: '#faf8f5', marginBottom: '.18rem' }}>
                    Burgundy Leather Skirt
                  </strong>
                  <span style={{ fontSize: '.68rem', color: 'rgba(250,248,245,0.45)' }}>₹19,500</span>
                </div>

                <div
                  className="hero-badge"
                  style={{
                    position: 'absolute',
                    bottom: '1.8rem',
                    right: '1.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.6rem',
                    background: 'var(--go)',
                    padding: '.5rem .95rem',
                    zIndex: 3,
                    pointerEvents: 'all',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ch)', flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ch)' }}>
                    FW 24 — Zero Compromise
                  </span>
                </div>
              </>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
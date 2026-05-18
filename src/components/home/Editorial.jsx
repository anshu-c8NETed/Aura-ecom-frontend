import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── breakpoint hook (same pattern as Navbar.jsx) ────────────────── */
function useWindowWidth() {
  const [w, setW] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  )
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h, { passive: true })
    return () => window.removeEventListener('resize', h)
  }, [])
  return w
}

const LINES = [
  [
    { text: 'We dress' },
    {
      img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      alt: 'AURA editorial — silk drape',
    },
    { text: 'people' },
  ],
  [
    { text: 'in' },
    {
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      alt: 'AURA editorial — structured gown',
    },
    { text: 'silence' },
  ],
  [
    { text: '& grace.' },
    {
      img: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&auto=format&fit=crop&q=80',
      alt: 'AURA editorial — ivory coat',
    },
  ],
]

const SIDE_IMG =
  'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=900&auto=format&fit=crop&q=80'

const THUMBS = [
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&auto=format&fit=crop&q=80',
]

export default function Editorial() {
  const ref   = useRef(null)
  const width = useWindowWidth()

  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024

  /* Slot sizes scale with viewport */
  const SLOT_H       = isMobile ? 60  : isTablet ? 76  : 100
  const SLOT_W_TARGET = isMobile ? 130 : isTablet ? 180 : 240

  useGSAP(() => {
    const section = ref.current

    /* Eyebrow */
    gsap.from('.ed-eyebrow-line', {
      scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'power3.inOut',
      scrollTrigger: { trigger: section, start: 'top 78%', once: true },
    })
    gsap.from('.ed-eyebrow-text', {
      opacity: 0, x: -12, duration: 0.7, delay: 0.3, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 78%', once: true },
    })

    /* Word-mask — fromTo so words stay visible until ST fires */
    gsap.fromTo(
      section.querySelectorAll('.ed-word-inner'),
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0, opacity: 1,
        duration: 1.05, ease: 'power3.out',
        stagger: { each: 0.065, ease: 'power1.out' },
        scrollTrigger: { trigger: '.ed-headline', start: 'top 82%', once: true },
      }
    )

    /* Image slots — width + clip-path wipe */
    section.querySelectorAll('.ed-line').forEach(line => {
      const slot = line.querySelector('.ed-img-slot')
      const img  = line.querySelector('.ed-slot-img')
      if (!slot || !img) return

      gsap.set(img, { clipPath: 'inset(0% 0% 100% 0%)' })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: line, start: 'top 85%', end: 'top 38%', scrub: 1.4 },
      })
      tl.fromTo(slot, { width: 0 }, { width: SLOT_W_TARGET, ease: 'none' }, 0)
      tl.fromTo(img,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out' },
        0.08
      )
    })

    /* Divider */
    gsap.from('.ed-divider', {
      scaleX: 0, transformOrigin: 'left', duration: 1.1, ease: 'power3.inOut',
      scrollTrigger: { trigger: '.ed-lower', start: 'top 78%', once: true },
    })

    /* Side image */
    gsap.fromTo('.ed-side-img',
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35, ease: 'power3.inOut',
        scrollTrigger: { trigger: '.ed-lower', start: 'top 78%', once: true },
      }
    )
    gsap.to('.ed-side-img-inner', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '.ed-lower', start: 'top bottom', end: 'bottom top', scrub: 1 },
    })

    /* Body stagger */
    gsap.from('.ed-body-el', {
      opacity: 0, y: 22, duration: 0.75, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.ed-lower', start: 'top 72%', once: true },
    })

    /* Thumbs pop-in */
    gsap.fromTo('.ed-thumb',
      { scale: 0, transformOrigin: 'center center' },
      {
        scale: 1, duration: 0.65, ease: 'power3.out',
        stagger: { each: 0.09, ease: 'power1.out' },
        scrollTrigger: { trigger: '.ed-thumb-strip', start: 'top 84%', once: true },
      }
    )
  }, { scope: ref, dependencies: [isMobile, isTablet, SLOT_W_TARGET, SLOT_H] })

  return (
    <section
      ref={ref}
      style={{
        background:    'var(--cr2)',
        overflow:      'hidden',
        paddingTop:    'clamp(4rem,9vw,10rem)',
        paddingBottom: 'clamp(4rem,9vw,10rem)',
      }}
    >
      {/* ── Eyebrow ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1.2rem',
        padding: '0 5vw', marginBottom: 'clamp(2.5rem,5vw,5rem)',
      }}>
        <div className="ed-eyebrow-line"
          style={{ width: 36, height: 1, background: 'var(--go)', flexShrink: 0 }} />
        <span className="ed-eyebrow-text eyebrow" style={{ margin: 0 }}>
          The Aura Edit — SS 2025
        </span>
      </div>

      {/* ══ UPPER — headline + inline slots ══════════════════════════ */}
      <div
        className="ed-headline"
        style={{ padding: '0 5vw', marginBottom: 'clamp(3rem,7vw,8rem)' }}
      >
        {LINES.map((chunks, li) => (
          <div key={li} className="ed-line" style={{
            display: 'flex', alignItems: 'center',
            gap: 'clamp(.35rem,1.2vw,1.2rem)',
            marginBottom: '.2rem',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}>
            {/* Line index — hide on mobile */}
            {!isMobile && (
              <span style={{
                fontFamily: 'var(--fb)', fontSize: '.44rem', letterSpacing: '.2em',
                color: 'var(--mu)', minWidth: '2.5ch', alignSelf: 'flex-end',
                paddingBottom: '.7rem', fontVariantNumeric: 'tabular-nums', flexShrink: 0,
              }}>
                {String(li + 1).padStart(2, '0')}
              </span>
            )}

            {chunks.map((chunk, ci) =>
              chunk.img ? (
                <span key={ci} className="ed-img-slot" style={{
                  display: 'inline-block',
                  height: SLOT_H, width: 0,
                  borderRadius: 4, overflow: 'hidden',
                  position: 'relative', verticalAlign: 'middle', flexShrink: 0,
                }}>
                  <img
                    className="ed-slot-img"
                    src={chunk.img} alt={chunk.alt}
                    style={{
                      height: '100%', width: SLOT_W_TARGET + 60,
                      position: 'absolute', left: '50%',
                      transform: 'translateX(-50%)',
                      objectFit: 'cover', objectPosition: 'center 20%',
                      display: 'block', willChange: 'clip-path',
                    }}
                  />
                  <div aria-hidden style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse 100% 88% at 50% 42%, transparent 25%, rgba(0,0,0,0.38) 100%)',
                    pointerEvents: 'none', zIndex: 1,
                  }} />
                </span>
              ) : (
                <span key={ci} style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.2em' }}>
                  {chunk.text.split(' ').filter(Boolean).map((word, wi) => (
                    <span key={wi} style={{
                      display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom',
                    }}>
                      <span className="ed-word-inner" style={{
                        fontFamily: 'var(--fd)',
                        fontSize: isMobile ? 'clamp(2.4rem,10vw,3.8rem)' : 'clamp(3rem,7vw,8.5rem)',
                        fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95,
                        color: 'var(--ch)', display: 'inline-block',
                        fontStyle: li === 1 ? 'italic' : 'normal',
                      }}>
                        {word}
                      </span>
                    </span>
                  ))}
                </span>
              )
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="ed-divider" style={{
        height: 1, background: 'var(--bo)',
        margin: `0 5vw clamp(2.5rem,5vw,5rem)`, transformOrigin: 'left',
      }} />

      {/* ══ LOWER — side image + body ════════════════════════════════ */}
      <div className="ed-lower" style={{
        padding: '0 5vw',
        display: 'grid',
        /* single col on mobile/tablet, two col on desktop */
        gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1.1fr',
        gap: isMobile ? '2.5rem' : isTablet ? '3rem' : 'clamp(3rem,6vw,8rem)',
        alignItems: 'start',
      }}>

        {/* Left — editorial image */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="ed-side-img" style={{
            /* taller on desktop, landscape-ish on mobile */
            aspectRatio: isMobile ? '4/3' : isTablet ? '16/9' : '3/4',
            overflow: 'hidden', position: 'relative', willChange: 'clip-path',
          }}>
            <img
              className="ed-side-img-inner"
              src={SIDE_IMG} alt="AURA SS 2025 editorial"
              style={{
                width: '100%', height: '112%', objectFit: 'cover',
                objectPosition: 'center top', display: 'block',
                marginTop: '-6%', willChange: 'transform',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(26,23,20,0.55) 0%, transparent 55%)',
              pointerEvents: 'none', zIndex: 1,
            }} />
            {/* Caption */}
            <div style={{
              position: 'absolute', bottom: '1.2rem', left: '1.2rem',
              zIndex: 2, display: 'flex', flexDirection: 'column', gap: '.2rem',
            }}>
              <span style={{
                fontSize: '.46rem', letterSpacing: '.22em',
                textTransform: 'uppercase', color: 'var(--go)',
              }}>SS 2025</span>
              <span style={{
                fontFamily: 'var(--fd)',
                fontSize: isMobile ? '.9rem' : 'clamp(.9rem,1.3vw,1.3rem)',
                fontWeight: 300, fontStyle: 'italic',
                color: 'rgba(250,248,245,0.92)', lineHeight: 1.15,
              }}>Onyx Evening Dress</span>
            </div>
          </div>
          {/* Gold accent line — hide on mobile */}
          {!isMobile && (
            <div style={{
              position: 'absolute', bottom: '-1.5rem', right: 0,
              width: '65%', height: 1,
              background: 'linear-gradient(to left, var(--go), transparent)',
            }} />
          )}
        </div>

        {/* Right — body */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: isMobile ? '1.75rem' : '2.5rem',
          paddingTop: isMobile ? 0 : 'clamp(1rem,2vw,2rem)',
        }}>
          {/* Pull quote */}
          <div className="ed-body-el">
            <span className="eyebrow" style={{ marginBottom: '1rem', display: 'block' }}>
              Editorial
            </span>
            <p style={{
              fontFamily: 'var(--fd)',
              fontSize: isMobile ? '1.1rem' : 'clamp(1.1rem,1.8vw,1.6rem)',
              fontWeight: 300, fontStyle: 'italic', lineHeight: 1.5,
              color: 'var(--ch)', letterSpacing: '-0.01em',
            }}>
              "Pieces designed not to be noticed at first glance — impossible to forget by the end of the evening."
            </p>
          </div>

          {/* Body copy */}
          <p className="ed-body-el" style={{
            fontSize: '.82rem', lineHeight: 2,
            color: 'var(--mu)', maxWidth: 460,
          }}>
            The new evening collection draws from the quietude of Parisian
            ateliers. Bias-cut silhouettes, recessive palettes, and textures
            that reward proximity — fashion as a private language.
          </p>

          {/* Thumb strip */}
          <div
            className="ed-thumb-strip"
            style={{
              display: 'flex', gap: '.4rem',
              /* scroll on small screens instead of overflowing */
              overflowX: isMobile ? 'auto' : 'visible',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: isMobile ? '.5rem' : 0,
            }}
          >
            {THUMBS.map((src, i) => (
              <div key={i} className="ed-thumb" style={{
                width: isMobile ? 60 : 70,
                height: isMobile ? 76 : 88,
                overflow: 'hidden', flexShrink: 0,
                willChange: 'transform', borderRadius: 2,
              }}>
                <img src={src} alt="" style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                  transition: 'transform .6s cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            ))}
            {/* +18 pill */}
            <div style={{
              width: isMobile ? 60 : 70,
              height: isMobile ? 76 : 88,
              borderRadius: 2, background: 'var(--ch)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '.2rem', flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'var(--fd)', fontSize: '1.1rem',
                fontWeight: 300, color: 'var(--cr)', lineHeight: 1,
              }}>+18</span>
              <span style={{
                fontSize: '.4rem', letterSpacing: '.2em',
                textTransform: 'uppercase', color: 'rgba(250,248,245,0.4)',
              }}>pieces</span>
            </div>
          </div>

          {/* Meta strip */}
          <div className="ed-body-el" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '1.2rem 2rem' : '2.5rem',
            paddingTop: '1rem', borderTop: '1px solid var(--bo)',
          }}>
            {[['Season', 'SS 2025'], ['Location', 'Paris, FR'], ['Looks', '24 pieces']].map(([k, v]) => (
              <div key={k}>
                <p style={{
                  fontSize: '.46rem', letterSpacing: '.18em',
                  textTransform: 'uppercase', color: 'var(--mu)', marginBottom: '.3rem',
                }}>{k}</p>
                <p style={{ fontSize: '.72rem', color: 'var(--ch)', letterSpacing: '.04em' }}>{v}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="ed-body-el" style={{
            display: 'flex',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? '1rem' : '1.4rem',
            alignItems: 'center',
          }}>
            <button
              className="btn-primary"
              style={{ width: isMobile ? '100%' : 'auto' }}
            >
              <span>Explore the Edit</span>
            </button>
            <button
              style={{
                background: 'none', border: 'none', fontFamily: 'var(--fb)',
                fontSize: '.6rem', letterSpacing: '.15em', textTransform: 'uppercase',
                color: 'var(--mu)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '.5rem',
                transition: 'color .3s, gap .3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--go)'; e.currentTarget.style.gap = '.9rem' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--mu)'; e.currentTarget.style.gap = '.5rem' }}
            >
              Read Editorial
              <svg width="18" height="5" viewBox="0 0 18 5" fill="none" aria-hidden>
                <line x1="0" y1="2.5" x2="14" y2="2.5" stroke="currentColor" strokeWidth="0.8"/>
                <path d="M11 1L14.5 2.5L11 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

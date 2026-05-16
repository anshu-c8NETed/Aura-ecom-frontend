import { useRef, useEffect, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PHOTO_COUNT = 6

const T = [
  {
    quote: ['Wearing AURA is the closest', 'I have come to wearing', 'silence itself.'],
    author: 'Priya Mehta',
    location: 'Mumbai',
    piece: 'Noir Silk Gown',
    num: '01',
    keywords: ['closest', 'silence'],
    photos: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=520&q=80',
    ],
  },
  {
    quote: ['Nothing has fit quite like this.', 'It moves the way a good', 'sentence moves.'],
    author: 'Anika Bose',
    location: 'New Delhi',
    piece: 'Ivory Wool Coat',
    num: '02',
    keywords: ['fit', 'sentence'],
    photos: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=520&q=80',
    ],
  },
  {
    quote: ["Three people asked where I'd been.", 'I had simply', 'changed.'],
    author: 'Rhea Singhania',
    location: 'Bangalore',
    piece: 'Dusk Blazer',
    num: '03',
    keywords: ['simply', 'changed'],
    photos: [
      'https://images.unsplash.com/photo-1633655442432-620aa55d7ac1?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=520&q=80',
    ],
  },
  {
    quote: ['Restraint really is', 'the highest form', 'of luxury.'],
    author: 'Kavya Nair',
    location: 'Chennai',
    piece: 'Stone Linen Set',
    num: '04',
    keywords: ['restraint', 'luxury'],
    photos: [
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=520&q=80',
    ],
  },
  {
    quote: ['Quiet authority', 'that no louder brand', 'has ever given me.'],
    author: 'Mira Choudhury',
    location: 'Kolkata',
    piece: 'Onyx Evening Dress',
    num: '05',
    keywords: ['quiet', 'authority'],
    photos: [
      'https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=520&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=520&q=80',
    ],
  },
]

/* ─── Single animated quote line ────────────────────────────────── */
function QuoteLine({ text, delay, direction, keywords = [], onKeywordEnter }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const words = text.split(' ')
    el.innerHTML = words.map(w => {
      // Strip punctuation for matching, compare case-insensitively
      const bare = w.replace(/[.,!?'"]/g, '').toLowerCase()
      const isKw  = keywords.some(k => bare === k.toLowerCase())

      if (isKw) {
        return (
          `<span class="qw" style="display:inline-block;overflow:hidden;vertical-align:bottom">` +
          `<span class="qi qk" style="display:inline-block;` +
          `text-decoration:underline;text-decoration-style:dotted;` +
          `text-decoration-thickness:1px;text-underline-offset:0.22em;` +
          `text-decoration-color:rgba(201,169,110,0.5);` +
          `cursor:default;color:#C9A96E;transition:color 0.2s ease;">${w}</span></span>`
        )
      }
      return (
        `<span class="qw" style="display:inline-block;overflow:hidden;vertical-align:bottom">` +
        `<span class="qi" style="display:inline-block">${w}</span></span>`
      )
    }).join('<span class="qs" style="display:inline-block;width:.28em"> </span>')

    const inner    = el.querySelectorAll('.qi')
    const kwSpans  = el.querySelectorAll('.qk')

    gsap.fromTo(inner,
      { y: direction === 'up' ? '105%' : '-105%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.055, delay }
    )

    kwSpans.forEach(span => {
      if (onKeywordEnter) span.addEventListener('mouseenter', onKeywordEnter)
    })

    return () => {
      gsap.killTweensOf(inner)
      kwSpans.forEach(span => {
        if (onKeywordEnter) span.removeEventListener('mouseenter', onKeywordEnter)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay, direction, keywords, onKeywordEnter])

  return (
    <div
      ref={ref}
      style={{
        fontFamily: 'var(--fd)',
        fontSize: 'clamp(2.4rem, 5.5vw, 6.4rem)',
        fontWeight: 300,
        fontStyle: 'italic',
        lineHeight: 1.08,
        color: 'rgba(250,248,245,0.92)',
        letterSpacing: '-0.02em',
        willChange: 'transform',
        marginBottom: '0.12em',
      }}
    />
  )
}

/* ─── Main ──────────────────────────────────────────────────────── */
export default function Testimonials() {
  const [idx, setIdx]         = useState(0)
  const [dir, setDir]         = useState('up')
  const [transitioning, setT] = useState(false)
  const [key, setKey]         = useState(0)

  const sectionRef = useRef(null)
  const ruleRef    = useRef(null)
  const metaRef    = useRef(null)
  const numRef     = useRef(null)
  const photoRefs  = useRef([])
  const burstTlRef = useRef(null)

  const current = T[idx]

  /* ── Photo burst helpers ─────────────────────────────────────── */
  const getPhotos = useCallback(() => photoRefs.current.filter(Boolean), [])

  const hidePhotos = useCallback(() => {
    const photos = photoRefs.current.filter(Boolean)
    if (!photos.length) return
    gsap.set(photos, {
      left: '50%', top: '50%',
      xPercent: -50, yPercent: -50,
      x: 0, y: 0, rotation: 0,
      clipPath: 'inset(100% 0 0 0)',
    })
  }, [])

  const stopBurst = useCallback(() => {
    burstTlRef.current?.kill()
    burstTlRef.current = null
    gsap.killTweensOf(photoRefs.current.filter(Boolean))
    hidePhotos()
  }, [hidePhotos])

  const playBurst = useCallback(() => {
    stopBurst()

    const photos = getPhotos()
    if (!photos.length) return

    const rnd = gsap.utils.random

    // Scatter starting positions
    photos.forEach((photo, i) => {
      gsap.set(photo, {
        left:     rnd(5, 88) + '%',
        top:      rnd(5, 82) + '%',
        x:        rnd(-48, 48),
        y:        rnd(50, 110),
        rotation: rnd(-12, 12) * 0.2,
        zIndex:   i,
      })
    })

    const revealDur    = 0.34
    const staggerIn    = 0.09
    const exitDur      = 0.3
    const staggerOut   = 0.07
    const revealEnd    = (photos.length - 1) * staggerIn + revealDur

    const tl = gsap.timeline({ onComplete: stopBurst })

    // Reveal: clip wipes up
    photos.forEach((photo, i) => {
      tl.to(photo, {
        x:        rnd(-40, 40),
        y:        rnd(-30, 30),
        rotation: rnd(-12, 12),
        clipPath: 'inset(0% 0 0 0)',
        ease:     'power3.out',
        duration: revealDur,
      }, i * staggerIn)
    })

    // Exit: clip wipes down
    photos.forEach((photo, i) => {
      tl.to(photo, {
        y:        '+=' + rnd(180, 280),
        x:        '+=' + rnd(-55, 55),
        rotation: '+=' + rnd(-10, 10),
        clipPath: 'inset(0% 0 100% 0)',
        ease:     'power2.in',
        duration: exitDur,
      }, revealEnd + i * staggerOut)
    })

    burstTlRef.current = tl
  }, [stopBurst, getPhotos])

  /* ── Swap photo srcs when testimonial changes ─────────────────── */
  useEffect(() => {
    const srcs = T[idx].photos
    photoRefs.current.forEach((img, i) => {
      if (img) img.src = srcs[i] || ''
    })
    hidePhotos()
  }, [idx, hidePhotos])

  /* ── Initial hide ─────────────────────────────────────────────── */
  useEffect(() => { hidePhotos() }, [hidePhotos])

  /* ── Section entrance ─────────────────────────────────────────── */
  useGSAP(() => {
    const el = sectionRef.current
    if (!el) return
    gsap.from(el.querySelector('.tm-enter'), {
      opacity: 0, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%', once: true },
    })
  }, { scope: sectionRef })

  /* ── Transition to a new quote ────────────────────────────────── */
  const goTo = useCallback((newIdx) => {
    if (transitioning || newIdx === idx) return
    stopBurst()
    setT(true)
    const direction = newIdx > idx ? 'down' : 'up'

    const tl = gsap.timeline({
      onComplete: () => {
        setDir(direction === 'down' ? 'up' : 'down')
        setIdx(newIdx)
        setKey(k => k + 1)
        setT(false)
      }
    })

    if (ruleRef.current) {
      tl.to(ruleRef.current, {
        scaleX: 0, transformOrigin: 'right center',
        duration: 0.55, ease: 'power3.inOut',
      }, 0)
    }

    if (metaRef.current) tl.to(metaRef.current, { opacity: 0, y: -8, duration: 0.4, ease: 'power2.in' }, 0)
    if (numRef.current)  tl.to(numRef.current,  { opacity: 0, duration: 0.3 }, 0)

    tl.to({}, { duration: 0.15 })
  }, [idx, transitioning, stopBurst])

  /* ── Re-enter rule + meta + ghost num after idx change ────────── */
  useEffect(() => {
    if (key === 0) return

    const tl = gsap.timeline({ delay: 0.1 })

    if (ruleRef.current) {
      gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'left center' })
      tl.to(ruleRef.current, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 0.25)
    }

    if (metaRef.current) {
      gsap.set(metaRef.current, { opacity: 0, y: 12 })
      tl.to(metaRef.current, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.55)
    }

    if (numRef.current) {
      gsap.set(numRef.current, { opacity: 0 })
      tl.to(numRef.current, { opacity: 1, duration: 0.8 }, 0.3)
    }
  }, [key])

  /* ── Keyboard nav ─────────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') goTo(Math.min(idx + 1, T.length - 1))
      if (e.key === 'ArrowLeft')  goTo(Math.max(idx - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [idx, goTo])

  return (
    <section
      ref={sectionRef}
      onMouseLeave={stopBurst}
      style={{
        position: 'relative',
        background: '#0D0B09',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 'clamp(6rem,12vw,11rem) clamp(2rem,8vw,10rem)',
      }}
    >
      {/* ── Film grain ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.032,
      }} />

      {/* ── Radial bloom ── */}
      <div style={{
        position: 'absolute', bottom: '-10%', left: '50%',
        transform: 'translateX(-50%)',
        width: '70%', height: '55%',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(184,149,96,0.07), transparent 65%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ── Ghost number ── */}
      <div
        ref={numRef}
        style={{
          position: 'absolute',
          right: 'clamp(-1rem,2vw,4rem)',
          top: '50%',
          transform: 'translateY(-60%)',
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(16rem,30vw,28rem)',
          fontWeight: 300,
          color: 'rgba(250,248,245,0.018)',
          lineHeight: 1,
          letterSpacing: '-0.06em',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {current.num}
      </div>

      {/* ── Photo burst layer — sits above background, below text ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 8,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: PHOTO_COUNT }).map((_, i) => (
          <img
            key={i}
            ref={el => { photoRefs.current[i] = el }}
            alt=""
            src={T[0].photos[i]}
            style={{
              position: 'absolute',
              width: 'min(22vw, 200px)',
              aspectRatio: '3 / 4',
              objectFit: 'cover',
              borderRadius: '2px',
              border: 'none',
              pointerEvents: 'none',
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* ── Top: eyebrow + fraction ── */}
      <div className="tm-enter" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'clamp(3rem,6vw,6rem)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ width: 32, height: 1, background: 'rgba(184,149,96,0.5)' }} />
          <span style={{
            fontSize: '.44rem', letterSpacing: '.34em',
            textTransform: 'uppercase', color: 'rgba(184,149,96,0.65)',
          }}>
            Client Stories
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--fd)', fontSize: '.9rem', fontWeight: 300,
          color: 'rgba(250,248,245,0.12)', letterSpacing: '.1em',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {String(idx + 1).padStart(2,'0')}&thinsp;/&thinsp;{String(T.length).padStart(2,'0')}
        </span>
      </div>

      {/* ── Quote — keywords trigger burst ── */}
      <div style={{ position: 'relative', zIndex: 10, marginBottom: 'clamp(2.5rem,5vw,5rem)' }}>
        {current.quote.map((line, li) => (
          <QuoteLine
            key={`${key}-${li}`}
            text={line}
            delay={li * 0.08}
            direction={dir}
            keywords={current.keywords}
            onKeywordEnter={playBurst}
          />
        ))}
        {/* Hover hint — fades after first interaction */}
        <p style={{
          marginTop: '1.4rem',
          fontSize: '.42rem',
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: 'rgba(184,149,96,0.35)',
        }}>
          Hover the golden words
        </p>
      </div>

      {/* ── Gold rule ── */}
      <div
        ref={ruleRef}
        style={{
          height: 1,
          background: 'linear-gradient(to right, rgba(184,149,96,0.7), rgba(184,149,96,0.15), transparent)',
          width: '100%',
          transformOrigin: 'left center',
          marginBottom: 'clamp(2rem,4vw,4rem)',
          position: 'relative', zIndex: 10,
        }}
      />

      {/* ── Meta: author + nav ── */}
      <div
        ref={metaRef}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          position: 'relative', zIndex: 10,
        }}
      >
        {/* Author block */}
        <div>
          <p style={{
            fontFamily: 'var(--fb)',
            fontSize: '.58rem',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: 'rgba(250,248,245,0.75)',
            marginBottom: '.45rem',
            fontWeight: 400,
          }}>
            {current.author}
          </p>
          <p style={{
            fontSize: '.44rem',
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: 'rgba(184,149,96,0.5)',
          }}>
            {current.location}&ensp;·&ensp;{current.piece}
          </p>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Prev */}
          <button
            onClick={() => goTo(Math.max(idx - 1, 0))}
            disabled={idx === 0}
            aria-label="Previous"
            style={{
              background: 'none', border: 'none',
              cursor: idx === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '.6rem',
              opacity: idx === 0 ? 0.18 : 0.55,
              transition: 'opacity .3s',
              padding: 0,
            }}
            onMouseEnter={e => { if (idx > 0) e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = idx === 0 ? '0.18' : '0.55' }}
          >
            <svg width="36" height="1" viewBox="0 0 36 1">
              <line x1="36" y1="0.5" x2="0" y2="0.5" stroke="rgba(250,248,245,0.6)" strokeWidth="1"/>
            </svg>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M7 1L1 6L7 11" stroke="rgba(250,248,245,0.6)" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {T.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === idx ? 22 : 4,
                  height: 1,
                  background: i === idx
                    ? 'rgba(184,149,96,0.8)'
                    : 'rgba(250,248,245,0.15)',
                  cursor: 'pointer',
                  transition: 'all .5s cubic-bezier(.25,.46,.45,.94)',
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => goTo(Math.min(idx + 1, T.length - 1))}
            disabled={idx === T.length - 1}
            aria-label="Next"
            style={{
              background: 'none', border: 'none',
              cursor: idx === T.length - 1 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '.6rem',
              opacity: idx === T.length - 1 ? 0.18 : 0.55,
              transition: 'opacity .3s',
              padding: 0,
            }}
            onMouseEnter={e => { if (idx < T.length - 1) e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = idx === T.length - 1 ? '0.18' : '0.55' }}
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M1 1L7 6L1 11" stroke="rgba(250,248,245,0.6)" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <svg width="36" height="1" viewBox="0 0 36 1">
              <line x1="0" y1="0.5" x2="36" y2="0.5" stroke="rgba(250,248,245,0.6)" strokeWidth="1"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Brand watermark ── */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(1.5rem,3vw,3rem)',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '.38rem',
        letterSpacing: '.5em',
        textTransform: 'uppercase',
        color: 'rgba(250,248,245,0.08)',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 10,
        whiteSpace: 'nowrap',
      }}>
        AURA — High Fashion
      </div>
    </section>
  )
}

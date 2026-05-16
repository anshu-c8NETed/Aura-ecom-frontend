import { useRef, useState, useCallback, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const T = [
  {
    quote: ['Wearing AURA is the closest', 'I have come to wearing', 'silence itself.'],
    author: 'Priya Mehta',
    location: 'Mumbai',
    piece: 'Noir Silk Gown',
    num: '01',
  },
  {
    quote: ['Nothing has fit quite like this.', 'It moves the way a good', 'sentence moves.'],
    author: 'Anika Bose',
    location: 'New Delhi',
    piece: 'Ivory Wool Coat',
    num: '02',
  },
  {
    quote: ['Three people asked where I\'d been.', 'I had simply', 'changed.'],
    author: 'Rhea Singhania',
    location: 'Bangalore',
    piece: 'Dusk Blazer',
    num: '03',
  },
  {
    quote: ['Restraint really is', 'the highest form', 'of luxury.'],
    author: 'Kavya Nair',
    location: 'Chennai',
    piece: 'Stone Linen Set',
    num: '04',
  },
  {
    quote: ['Quiet authority', 'that no louder brand', 'has ever given me.'],
    author: 'Mira Choudhury',
    location: 'Kolkata',
    piece: 'Onyx Evening Dress',
    num: '05',
  },
]

/* ─── Single animated quote line ────────────────────────────────── */
function QuoteLine({ text, delay, direction }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Split into word spans
    const words = text.split(' ')
    el.innerHTML = words
      .map(w => `<span class="qw" style="display:inline-block;overflow:hidden;vertical-align:bottom">` +
        `<span class="qi" style="display:inline-block">${w}</span></span>`)
      .join('<span class="qs" style="display:inline-block;width:.28em"> </span>')

    const inner = el.querySelectorAll('.qi')
    gsap.fromTo(inner,
      { y: direction === 'up' ? '105%' : '-105%', opacity: 0 },
      {
        y: '0%', opacity: 1,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.055,
        delay,
      }
    )

    return () => gsap.killTweensOf(inner)
  }, [text, delay, direction])

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
  const [idx, setIdx]           = useState(0)
  const [dir, setDir]           = useState('up')
  const [transitioning, setT]   = useState(false)
  const [key, setKey]           = useState(0)
  const sectionRef              = useRef(null)
  const ruleRef                 = useRef(null)
  const metaRef                 = useRef(null)
  const numRef                  = useRef(null)

  const current = T[idx]

  /* Section entrance */
  useGSAP(() => {
    const el = sectionRef.current
    if (!el) return
    gsap.from(el.querySelector('.tm-enter'), {
      opacity: 0, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%', once: true },
    })
  }, { scope: sectionRef })

  /* Transition to a new quote */
  const goTo = useCallback((newIdx) => {
    if (transitioning || newIdx === idx) return
    setT(true)
    const direction = newIdx > idx ? 'down' : 'up'

    // Exit: rule wipes right, meta fades, ghost num fades
    const tl = gsap.timeline({
      onComplete: () => {
        setDir(direction === 'down' ? 'up' : 'down')
        setIdx(newIdx)
        setKey(k => k + 1)
        setT(false)
      }
    })

    // Sweep the rule off to the right
    if (ruleRef.current) {
      tl.to(ruleRef.current, {
        scaleX: 0, transformOrigin: 'right center',
        duration: 0.55, ease: 'power3.inOut',
      }, 0)
    }

    // Fade meta + ghost number
    if (metaRef.current) tl.to(metaRef.current, { opacity: 0, y: -8, duration: 0.4, ease: 'power2.in' }, 0)
    if (numRef.current)  tl.to(numRef.current,  { opacity: 0, duration: 0.3 }, 0)

    tl.to({}, { duration: 0.15 }) // brief hold

  }, [idx, transitioning])

  /* After idx changes: re-enter rule + meta + ghost num */
  useEffect(() => {
    if (key === 0) return // skip initial mount

    const tl = gsap.timeline({ delay: 0.1 })

    if (ruleRef.current) {
      gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'left center' })
      tl.to(ruleRef.current, {
        scaleX: 1,
        duration: 0.9, ease: 'power3.inOut',
      }, 0.25)
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

  /* Keyboard nav */
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

      {/* ── Radial bloom — bottom centre ── */}
      <div style={{
        position: 'absolute', bottom: '-10%', left: '50%',
        transform: 'translateX(-50%)',
        width: '70%', height: '55%',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(184,149,96,0.07), transparent 65%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ── Ghost number — enormous, behind everything ── */}
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

      {/* ── Top: eyebrow + fraction ── */}
      <div className="tm-enter" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'clamp(3rem,6vw,6rem)',
        position: 'relative', zIndex: 1,
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

      {/* ── Quote — animated line by line ── */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: 'clamp(2.5rem,5vw,5rem)' }}>
        {current.quote.map((line, li) => (
          <QuoteLine
            key={`${key}-${li}`}
            text={line}
            delay={li * 0.08}
            direction={dir}
          />
        ))}
      </div>

      {/* ── Gold rule — animates in after quote ── */}
      <div
        ref={ruleRef}
        style={{
          height: 1,
          background: 'linear-gradient(to right, rgba(184,149,96,0.7), rgba(184,149,96,0.15), transparent)',
          width: '100%',
          transformOrigin: 'left center',
          marginBottom: 'clamp(2rem,4vw,4rem)',
          position: 'relative', zIndex: 1,
        }}
      />

      {/* ── Meta: author + nav ── */}
      <div
        ref={metaRef}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          position: 'relative', zIndex: 1,
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

          {/* Dots — minimal pill style */}
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

      {/* ── Bottom: brand watermark ── */}
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
        zIndex: 1,
        whiteSpace: 'nowrap',
      }}>
        AURA — High Fashion
      </div>
    </section>
  )
}

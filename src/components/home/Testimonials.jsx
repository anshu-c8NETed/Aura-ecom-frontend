import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
  {
    quote: 'AURA pieces feel like wearing architecture. The Noir Silk Gown stopped every conversation in the room — not because it shouted, but because it didn\'t need to.',
    author: 'Priya Mehta',
    location: 'Mumbai',
    piece: 'Noir Silk Gown',
    index: '01',
    initial: 'P',
  },
  {
    quote: 'I\'ve worn luxury for twenty years. Nothing has fit quite like the Ivory Wool Coat — it moves the way a good sentence moves. Completely inevitable.',
    author: 'Anika Bose',
    location: 'Delhi',
    piece: 'Ivory Wool Coat',
    index: '02',
    initial: 'A',
  },
  {
    quote: 'The tailoring on the Dusk Blazer is extraordinary. I wore it to a board meeting and three people asked where I\'d been, not realising I\'d simply changed.',
    author: 'Rhea Singhania',
    location: 'Bangalore',
    piece: 'Dusk Blazer',
    index: '03',
    initial: 'R',
  },
  {
    quote: 'Every morning I reach for something from AURA first. Restraint really is the highest form of luxury — I understand that now.',
    author: 'Kavya Nair',
    location: 'Chennai',
    piece: 'Stone Linen Set',
    index: '04',
    initial: 'K',
  },
  {
    quote: 'The knitwear is impossibly soft. I gifted the Pearl Cardigan to my mother and she rang me every day for a week just to say thank you.',
    author: 'Tara Kapoor',
    location: 'Pune',
    piece: 'Pearl Cardigan',
    index: '05',
    initial: 'T',
  },
  {
    quote: 'Silence is the right word. AURA clothes carry a kind of quiet authority that no louder brand has ever given me.',
    author: 'Mira Choudhury',
    location: 'Kolkata',
    piece: 'Onyx Evening Dress',
    index: '06',
    initial: 'M',
  },
]

export default function Testimonials() {
  const sectionRef  = useRef(null)
  const trackRef    = useRef(null)
  const fillRef     = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragged, setDragged] = useState(false)

  useGSAP(() => {
    // Heading orchestration
    gsap.from('.tm-label', {
      opacity: 0, y: 14, duration: .6,
      scrollTrigger: { trigger: '.tm-label', start: 'top 88%' },
    })

    // Large quote mark
    gsap.fromTo('.tm-bigquote', {
      scale: 0.6, opacity: 0,
    }, {
      scale: 1, opacity: 0.04,
      duration: 1.5, ease: 'power3.out',
      scrollTrigger: { trigger: '.tm-bigquote', start: 'top 85%', once: true },
    })

    // Heading characters stagger
    const heading = sectionRef.current?.querySelector('.tm-heading')
    if (heading) {
      const text = heading.textContent
      heading.innerHTML = ''
      text.split('').forEach(char => {
        const span = document.createElement('span')
        span.textContent = char === ' ' ? '\u00A0' : char
        span.style.display = 'inline-block'
        span.style.transition = 'none'
        heading.appendChild(span)
      })

      gsap.from(heading.children, {
        y: 60, opacity: 0, rotationX: -40,
        stagger: 0.025, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
      })
    }

    // Horizontal rule sweep
    gsap.from('.tm-rule', {
      scaleX: 0, duration: 1.2, ease: 'power3.out', transformOrigin: 'left',
      scrollTrigger: { trigger: '.tm-rule', start: 'top 90%' },
    })
  }, { scope: sectionRef })

  /* ── Drag carousel physics ── */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const PAD        = Math.max(24, window.innerWidth * 0.055)
    const CARD_W     = Math.min(window.innerWidth * 0.38, 460)
    const GAP        = Math.max(16, window.innerWidth * 0.02)
    const CARD_TOTAL = CARD_W + GAP
    const TOTAL_W    = TESTIMONIALS.length * CARD_TOTAL
    const MAX_DRAG   = 0
    const MIN_DRAG   = -(TOTAL_W - window.innerWidth + PAD * 1.5)

    let current     = 0
    let target      = 0
    let momentum    = 0
    let isDragging  = false
    let startX      = 0
    let startTarget = 0
    let hasDragged  = false
    let lastActive  = 0
    let rafId

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

    function tick() {
      current = current + (target - current) * 0.08
      if (!isDragging) momentum *= 0.92
      if (!isDragging && Math.abs(momentum) > 0.3)
        target = clamp(target + momentum, MIN_DRAG, MAX_DRAG)

      gsap.set(track, { x: current })

      const newActive = clamp(Math.round(Math.abs(current) / CARD_TOTAL), 0, TESTIMONIALS.length - 1)
      if (newActive !== lastActive) { lastActive = newActive; setActiveIndex(newActive) }

      // Perspective fade for off-screen cards
      const cards = track.children
      for (let i = 0; i < cards.length; i++) {
        const cardLeft = cards[i].offsetLeft + current
        const cardCenter = cardLeft + CARD_W / 2
        const viewCenter = window.innerWidth / 2
        const dist = Math.abs(cardCenter - viewCenter) / (window.innerWidth * 0.5)
        const fade = clamp(1 - dist * 0.5, 0.15, 1)
        const lift = clamp(1 - dist * 0.03, 0.97, 1)
        gsap.set(cards[i], { opacity: fade, scale: lift })
      }

      if (fillRef.current) {
        const pct = clamp(Math.abs(current / MIN_DRAG) * 100, 0, 100)
        fillRef.current.style.transform = `scaleX(${pct / 100})`
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    const getX = e => e.clientX ?? e.touches?.[0]?.clientX ?? 0

    const onDown = e => {
      isDragging = true; momentum = 0
      startX = getX(e); startTarget = target
      track.style.cursor = 'grabbing'
    }

    const onMove = e => {
      if (!isDragging) return
      const diff = getX(e) - startX
      if (!hasDragged && Math.abs(diff) > 6) { hasDragged = true; setDragged(true) }
      momentum = diff * 0.06
      target = clamp(startTarget + diff * 1.05, MIN_DRAG, MAX_DRAG)
    }

    const onUp = () => {
      isDragging = false
      track.style.cursor = 'grab'
      const snap = clamp(Math.round(Math.abs(target) / CARD_TOTAL), 0, TESTIMONIALS.length - 1)
      target = clamp(-snap * CARD_TOTAL, MIN_DRAG, MAX_DRAG)
      momentum = 0
    }

    track.addEventListener('mousedown',   onDown)
    track.addEventListener('touchstart',  onDown, { passive: true })
    window.addEventListener('mousemove',  onMove)
    window.addEventListener('touchmove',  onMove, { passive: true })
    window.addEventListener('mouseup',    onUp)
    window.addEventListener('touchend',   onUp)
    track.addEventListener('selectstart', e => e.preventDefault())
    track.addEventListener('dragstart',   e => e.preventDefault())

    return () => {
      cancelAnimationFrame(rafId)
      track.removeEventListener('mousedown',   onDown)
      track.removeEventListener('touchstart',  onDown)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('touchmove',  onMove)
      window.removeEventListener('mouseup',    onUp)
      window.removeEventListener('touchend',   onUp)
    }
  }, [])

  const active = TESTIMONIALS[activeIndex]

  return (
    <section
      ref={sectionRef}
      style={{
        background:    'var(--ch)',
        paddingTop:    'clamp(6rem,12vw,12rem)',
        paddingBottom: 'clamp(5rem,10vw,10rem)',
        overflow:      'hidden',
        position:      'relative',
      }}
    >
      {/* ── Background elements ── */}

      {/* Large decorative quote mark */}
      <div className="tm-bigquote" style={{
        position: 'absolute', top: 'clamp(3rem,8vw,8rem)', right: 'clamp(2rem,8vw,10rem)',
        fontFamily: 'var(--fd)', fontSize: 'clamp(12rem,25vw,22rem)',
        fontWeight: 300, color: 'rgba(250,248,245,0.04)',
        lineHeight: 0.8, pointerEvents: 'none', userSelect: 'none',
      }}>
        "
      </div>

      {/* Film grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.03,
      }} />

      {/* Radial bloom that follows active card colour */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: '60%',
        background: `radial-gradient(ellipse at 50% 100%, rgba(184,149,96,0.06), transparent 70%)`,
        pointerEvents: 'none',
        transition: 'opacity .6s',
      }} />

      {/* ── Header ── */}
      <div style={{
        padding: '0 clamp(2rem,5.5vw,7rem)',
        marginBottom: 'clamp(3rem,6vw,6rem)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          flexWrap: 'wrap', gap: '2rem',
        }}>
          <div>
            <p className="tm-label" style={{
              margin: '0 0 1rem',
              fontSize: '.46rem', letterSpacing: '.32em', textTransform: 'uppercase',
              color: 'rgba(250,248,245,0.3)',
            }}>
              Client Stories
            </p>
            <h2 className="tm-heading" style={{
              margin: 0,
              color: 'var(--cr)',
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2.8rem,5.5vw,5rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-.02em',
            }}>
              Worn & Loved
            </h2>
          </div>

          {/* Counter + drag hint */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '.5rem' }}>
              <span style={{
                fontSize: 'clamp(2.5rem,4.5vw,4rem)',
                fontFamily: 'var(--fd)', fontWeight: 300,
                color: 'rgba(250,248,245,0.07)',
                lineHeight: 1, letterSpacing: '-.03em',
                fontVariantNumeric: 'tabular-nums',
                transition: 'color .5s ease',
              }}>
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span style={{
                fontSize: '.7rem', fontFamily: 'var(--fd)', fontWeight: 300,
                color: 'rgba(250,248,245,0.12)',
              }}>
                / {String(TESTIMONIALS.length).padStart(2, '0')}
              </span>
            </div>

            {/* Drag hint — fades after first drag */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '.7rem',
              opacity: dragged ? 0 : 1,
              transition: 'opacity .6s',
            }}>
              <span style={{
                fontSize: '.42rem', letterSpacing: '.24em', textTransform: 'uppercase',
                color: 'rgba(250,248,245,0.2)',
              }}>
                Drag
              </span>
              <svg width="36" height="8" viewBox="0 0 36 8" fill="none">
                <line x1="0" y1="4" x2="28" y2="4" stroke="rgba(250,248,245,0.18)" strokeWidth="1"/>
                <path d="M26 1L33 4L26 7" stroke="rgba(250,248,245,0.18)" strokeWidth="1" fill="none"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="tm-rule" style={{
          height: 1,
          background: 'linear-gradient(to right, rgba(250,248,245,0.15), rgba(184,149,96,0.15), rgba(250,248,245,0.05))',
          marginTop: 'clamp(2rem,4vw,3.5rem)',
        }} />
      </div>

      {/* ── Carousel track ── */}
      <div
        ref={trackRef}
        style={{
          display:          'flex',
          gap:              'clamp(1rem,2vw,1.8rem)',
          paddingLeft:      'clamp(2rem,5.5vw,7rem)',
          paddingRight:     'clamp(2rem,5.5vw,7rem)',
          willChange:       'transform',
          cursor:           'grab',
          userSelect:       'none',
          WebkitUserSelect: 'none',
          position:         'relative',
          zIndex:           1,
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={i} t={t} i={i} isActive={i === activeIndex} />
        ))}
      </div>

      {/* ── Footer: progress bar + dots ── */}
      <div style={{
        padding: 'clamp(2.5rem,5vw,4rem) clamp(2rem,5.5vw,7rem) 0',
        display: 'flex', alignItems: 'center', gap: '2rem',
        position: 'relative', zIndex: 1,
      }}>
        <span style={{
          fontSize: '.44rem', letterSpacing: '.2em',
          color: 'rgba(250,248,245,0.2)',
          whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
        }}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
        </span>

        <div style={{ flex: 1, height: 1, background: 'rgba(250,248,245,0.06)', overflow: 'hidden', borderRadius: 1 }}>
          <div
            ref={fillRef}
            style={{
              height: '100%',
              background: 'linear-gradient(to right, rgba(184,149,96,0.6), rgba(250,248,245,0.4))',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
              transition: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {TESTIMONIALS.map((_, i) => (
            <div key={i} style={{
              width:        i === activeIndex ? 20 : 4,
              height:       4,
              borderRadius: 2,
              background:   i === activeIndex
                ? 'rgba(184,149,96,0.7)'
                : 'rgba(250,248,245,0.1)',
              transition: 'all .5s cubic-bezier(.25,.46,.45,.94)',
            }} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Testimonial Card ── */
function TestimonialCard({ t, i, isActive }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0, y: 30, scale: 0.96,
        duration: .7, delay: i * 0.06, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      })
    })
    return () => ctx.revert()
  }, [i])

  return (
    <div
      ref={cardRef}
      style={{
        flexShrink:     0,
        width:          'clamp(300px,38vw,460px)',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'space-between',
        minHeight:      'clamp(320px,36vw,440px)',
        padding:        'clamp(2rem,3vw,3rem)',
        borderTop:      isActive
          ? '1px solid rgba(184,149,96,0.6)'
          : '1px solid rgba(250,248,245,0.07)',
        background:     isActive
          ? 'rgba(250,248,245,0.02)'
          : 'transparent',
        pointerEvents:  'none',
        transition:     'border-top-color .5s ease, background .5s ease',
        position:       'relative',
        overflow:       'hidden',
      }}
    >
      {/* Large initial letter — decorative */}
      <span style={{
        position: 'absolute', top: '-0.3rem', right: '1rem',
        fontFamily: 'var(--fd)', fontSize: 'clamp(5rem,9vw,8rem)',
        fontWeight: 300, fontStyle: 'italic',
        color: isActive ? 'rgba(184,149,96,0.06)' : 'rgba(250,248,245,0.02)',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
        transition: 'color .5s',
      }}>
        {t.initial}
      </span>

      {/* Quote */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
        {/* Opening quote mark */}
        <span style={{
          display: 'block',
          fontFamily: 'var(--fd)', fontSize: '2rem', fontWeight: 300,
          color: isActive ? 'rgba(184,149,96,0.35)' : 'rgba(250,248,245,0.08)',
          lineHeight: 1, marginBottom: '.6rem',
          transition: 'color .5s',
        }}>
          "
        </span>
        <p style={{
          fontFamily:    'var(--fd)',
          fontStyle:     'italic',
          fontSize:      'clamp(.9rem,1.2vw,1.05rem)',
          fontWeight:    300,
          lineHeight:    2,
          color:         isActive ? 'rgba(250,248,245,0.82)' : 'rgba(250,248,245,0.3)',
          margin:        0,
          paddingBottom: 'clamp(2rem,3vw,2.8rem)',
          transition:    'color .5s ease',
        }}>
          {t.quote}
        </p>
      </div>

      {/* Author */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Gradient rule */}
        <div style={{
          height: 1,
          background: isActive
            ? 'linear-gradient(to right, rgba(184,149,96,0.3), transparent)'
            : 'rgba(250,248,245,0.06)',
          marginBottom: '1.2rem',
          transition: 'background .5s',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <strong style={{
              display: 'block',
              fontFamily: 'var(--fb)',
              fontSize: '.56rem', letterSpacing: '.16em', textTransform: 'uppercase',
              fontWeight: 500,
              color: isActive ? 'rgba(250,248,245,0.85)' : 'rgba(250,248,245,0.22)',
              marginBottom: '.35rem',
              transition: 'color .5s',
            }}>
              {t.author}
            </strong>
            <span style={{
              fontSize: '.42rem', letterSpacing: '.18em', textTransform: 'uppercase',
              color: isActive ? 'rgba(184,149,96,0.5)' : 'rgba(250,248,245,0.15)',
              transition: 'color .5s',
            }}>
              {t.location} &nbsp;·&nbsp; {t.piece}
            </span>
          </div>
          <span style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(1.2rem,2vw,1.6rem)',
            fontWeight: 300,
            color: isActive ? 'rgba(184,149,96,0.25)' : 'rgba(250,248,245,0.04)',
            lineHeight: 1,
            transition: 'color .5s',
          }}>
            {t.index}
          </span>
        </div>
      </div>
    </div>
  )
}
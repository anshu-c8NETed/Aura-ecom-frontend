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
  },
  {
    quote: 'I\'ve worn luxury for twenty years. Nothing has fit quite like the Ivory Wool Coat — it moves the way a good sentence moves. Completely inevitable.',
    author: 'Anika Bose',
    location: 'Delhi',
    piece: 'Ivory Wool Coat',
    index: '02',
  },
  {
    quote: 'The tailoring on the Dusk Blazer is extraordinary. I wore it to a board meeting and three people asked where I\'d been, not realising I\'d simply changed.',
    author: 'Rhea Singhania',
    location: 'Bangalore',
    piece: 'Dusk Blazer',
    index: '03',
  },
  {
    quote: 'Every morning I reach for something from AURA first. Restraint really is the highest form of luxury — I understand that now.',
    author: 'Kavya Nair',
    location: 'Chennai',
    piece: 'Stone Linen Set',
    index: '04',
  },
  {
    quote: 'The knitwear is impossibly soft. I gifted the Pearl Cardigan to my mother and she rang me every day for a week just to say thank you.',
    author: 'Tara Kapoor',
    location: 'Pune',
    piece: 'Pearl Cardigan',
    index: '05',
  },
  {
    quote: 'Silence is the right word. AURA clothes carry a kind of quiet authority that no louder brand has ever given me.',
    author: 'Mira Choudhury',
    location: 'Kolkata',
    piece: 'Onyx Evening Dress',
    index: '06',
  },
]

export default function Testimonials() {
  const sectionRef  = useRef(null)
  const trackRef    = useRef(null)
  const fillRef     = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragged, setDragged] = useState(false)

  useGSAP(() => {
    gsap.from('.tm-label', {
      opacity: 0, y: 10, duration: .5,
      scrollTrigger: { trigger: '.tm-label', start: 'top 88%' },
    })
    gsap.from('.tm-heading', {
      opacity: 0, y: 20, duration: .7, delay: .05,
      scrollTrigger: { trigger: '.tm-heading', start: 'top 88%' },
    })
    gsap.from('.tm-rule', {
      scaleX: 0, duration: .8, ease: 'power3.out', transformOrigin: 'left',
      scrollTrigger: { trigger: '.tm-rule', start: 'top 90%' },
    })
  }, { scope: sectionRef })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const PAD        = Math.max(24, window.innerWidth * 0.055)
    const CARD_W     = Math.min(window.innerWidth * 0.4, 480)
    const GAP        = Math.max(12, window.innerWidth * 0.018)
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
      current = current + (target - current) * 0.1
      if (!isDragging) momentum *= 0.9
      if (!isDragging && Math.abs(momentum) > 0.3)
        target = clamp(target + momentum, MIN_DRAG, MAX_DRAG)

      gsap.set(track, { x: current })

      const newActive = clamp(Math.round(Math.abs(current) / CARD_TOTAL), 0, TESTIMONIALS.length - 1)
      if (newActive !== lastActive) { lastActive = newActive; setActiveIndex(newActive) }

      const cards = track.children
      for (let i = 0; i < cards.length; i++) {
        const cardLeft = cards[i].offsetLeft + current
        if (cardLeft < 0) {
          const ratio = clamp(Math.abs(cardLeft) / (CARD_W * 0.7), 0, 1)
          gsap.set(cards[i], { opacity: 1 - ratio * 0.85 })
        } else {
          gsap.set(cards[i], { opacity: 1 })
        }
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
      momentum = diff * 0.08
      target = clamp(startTarget + diff * 1.06, MIN_DRAG, MAX_DRAG)
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

  return (
    <section
      ref={sectionRef}
      style={{
        background:    'var(--ch)',
        paddingTop:    'clamp(6rem,12vw,12rem)',
        paddingBottom: 'clamp(5rem,10vw,10rem)',
        overflow:      'hidden',
      }}
    >
      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{ padding: '0 clamp(2rem,5.5vw,7rem)', marginBottom: 'clamp(3rem,6vw,6rem)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <p className="tm-label" style={{
              margin:        '0 0 1.2rem',
              fontSize:      '.48rem',
              letterSpacing: '.3em',
              textTransform: 'uppercase',
              color:         'rgba(250,248,245,0.35)',
            }}>
              Client Stories
            </p>
            <h2 className="tm-heading display-heading" style={{
              margin:        0,
              color:         'var(--cr)',
              fontSize:      'clamp(2.6rem,5.5vw,4.8rem)',
              fontWeight:    400,
              lineHeight:    1.08,
              letterSpacing: '-.02em',
            }}>
              Worn <em style={{ fontStyle: 'italic', fontWeight: 300 }}>&amp; Loved</em>
            </h2>
          </div>

          {/* Right: large ghost counter + drag hint */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <span style={{
              fontSize:           'clamp(2rem,4vw,3.5rem)',
              fontFamily:         'var(--fd)',
              fontWeight:         300,
              color:              'rgba(250,248,245,0.08)',
              lineHeight:         1,
              letterSpacing:      '-.03em',
              fontVariantNumeric: 'tabular-nums',
              transition:         'color .4s',
            }}>
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <div style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '.7rem',
              opacity:    dragged ? 0 : 1,
              transition: 'opacity .5s',
            }}>
              <span style={{
                fontSize:      '.44rem',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color:         'rgba(250,248,245,0.22)',
              }}>
                Drag
              </span>
              <svg width="32" height="8" viewBox="0 0 32 8" fill="none">
                <line x1="0" y1="4" x2="26" y2="4" stroke="rgba(250,248,245,0.22)" strokeWidth="1"/>
                <path d="M24 1L30 4L24 7" stroke="rgba(250,248,245,0.22)" strokeWidth="1" fill="none"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="tm-rule" style={{ height: 1, background: 'rgba(250,248,245,0.1)', marginTop: 'clamp(2rem,4vw,3.5rem)' }} />
      </div>

      {/* ── Track ────────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        style={{
          display:          'flex',
          gap:              'clamp(.8rem,1.8vw,1.6rem)',
          paddingLeft:      'clamp(2rem,5.5vw,7rem)',
          paddingRight:     'clamp(2rem,5.5vw,7rem)',
          willChange:       'transform',
          cursor:           'grab',
          userSelect:       'none',
          WebkitUserSelect: 'none',
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={i} t={t} i={i} isActive={i === activeIndex} />
        ))}
      </div>

      {/* ── Footer: fraction + progress + dots ───────────────────── */}
      <div style={{
        padding:    'clamp(2.5rem,5vw,4rem) clamp(2rem,5.5vw,7rem) 0',
        display:    'flex',
        alignItems: 'center',
        gap:        '2rem',
      }}>
        <span style={{
          fontSize:           '.46rem',
          letterSpacing:      '.18em',
          color:              'rgba(250,248,245,0.22)',
          whiteSpace:         'nowrap',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {String(activeIndex + 1).padStart(2, '0')} / 0{TESTIMONIALS.length}
        </span>

        <div style={{ flex: 1, height: 1, background: 'rgba(250,248,245,0.08)', overflow: 'hidden' }}>
          <div
            ref={fillRef}
            style={{
              height:          '100%',
              background:      'rgba(250,248,245,0.55)',
              transformOrigin: 'left',
              transform:       'scaleX(0)',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {TESTIMONIALS.map((_, i) => (
            <div key={i} style={{
              width:        i === activeIndex ? 16 : 4,
              height:       4,
              borderRadius: 2,
              background:   i === activeIndex ? 'rgba(250,248,245,0.7)' : 'rgba(250,248,245,0.14)',
              transition:   'all .4s ease',
            }} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ── Card ────────────────────────────────────────────────────────────── */
function TestimonialCard({ t, i, isActive }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0, y: 24, duration: .65, delay: i * 0.055, ease: 'power2.out',
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
        width:          'clamp(280px,40vw,480px)',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'space-between',
        minHeight:      'clamp(300px,36vw,440px)',
        padding:        'clamp(2rem,3vw,3rem)',
        borderTop:      isActive
          ? '1px solid rgba(250,248,245,0.55)'
          : '1px solid rgba(250,248,245,0.1)',
        background:     'transparent',
        pointerEvents:  'none',
        transition:     'border-top-color .45s ease',
      }}
    >
      {/* Quote */}
      <p style={{
        fontFamily:    'var(--fd)',
        fontStyle:     'italic',
        fontSize:      'clamp(.95rem,1.3vw,1.1rem)',
        fontWeight:    300,
        lineHeight:    1.9,
        color:         isActive ? 'rgba(250,248,245,0.85)' : 'rgba(250,248,245,0.38)',
        margin:        0,
        flex:          1,
        paddingBottom: 'clamp(2rem,3vw,2.8rem)',
        transition:    'color .45s ease',
      }}>
        {t.quote}
      </p>

      {/* Author */}
      <div>
        <div style={{ height: 1, background: 'rgba(250,248,245,0.08)', marginBottom: '1.2rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <strong style={{
              display:       'block',
              fontFamily:    'var(--fb, sans-serif)',
              fontSize:      '.58rem',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              fontWeight:    500,
              color:         isActive ? 'rgba(250,248,245,0.85)' : 'rgba(250,248,245,0.28)',
              marginBottom:  '.3rem',
              transition:    'color .45s',
            }}>
              {t.author}
            </strong>
            <span style={{
              fontSize:      '.44rem',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color:         'rgba(250,248,245,0.22)',
            }}>
              {t.location} &nbsp;·&nbsp; {t.piece}
            </span>
          </div>
          <span style={{
            fontFamily:  'var(--fd)',
            fontSize:    'clamp(1.2rem,2vw,1.6rem)',
            fontWeight:  300,
            color:       isActive ? 'rgba(250,248,245,0.18)' : 'rgba(250,248,245,0.06)',
            lineHeight:  1,
            transition:  'color .45s',
          }}>
            {t.index}
          </span>
        </div>
      </div>
    </div>
  )
}
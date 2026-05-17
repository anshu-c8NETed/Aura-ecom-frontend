import { useRef, useLayoutEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import RevealText from '../layout/RevealText'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = [
  {
    label:  'Dresses',
    sub:    '42 pieces',
    to:     '/collection?category=dresses',
    img:    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    accent: '#D4B478',
    layout: 'tall',
    num:    '01',
    tag:    'Womenswear',
  },
  {
    label:  'Outerwear',
    sub:    '18 pieces',
    to:     '/collection?category=outerwear',
    img:    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&auto=format&fit=crop&q=80',
    accent: '#9B8F82',
    layout: 'tall',
    num:    '02',
    tag:    'Seasonal',
  },
  {
    label:  'Tailoring',
    sub:    '31 pieces',
    to:     '/collection?category=tailoring',
    img:    'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&auto=format&fit=crop&q=80',
    accent: '#C09458',
    layout: 'normal',
    num:    '03',
    tag:    'SS 2025',
  },
  {
    label:  'Knitwear',
    sub:    '24 pieces',
    to:     '/collection?category=knitwear',
    img:    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    accent: '#C8B898',
    layout: 'normal',
    num:    '04',
    tag:    'Essential',
  },
  {
    label:  'New Arrivals',
    sub:    'SS 2025',
    to:     '/collection?filter=new',
    img:    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&auto=format&fit=crop&q=80',
    accent: '#FAF8F5',
    layout: 'wide',
    num:    '05',
    tag:    'Just Landed',
  },
]

export default function CategoryGrid() {
  const sectionRef   = useRef(null)
  const wrappersRef  = useRef([])
  const innersRef    = useRef([])
  const [active, setActive] = useState(-1)

  /* ── AbstractCards-style scatter → grid animation ── */
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const initial = CATEGORIES.map(() => ({
      rotation: Math.round(Math.random() * 30 - 15),
      scale:    1.15,
      zIndex:   gsap.utils.random(5, 50, 1),
    }))

    // Set random stacking order
    wrappersRef.current.forEach((wrapper, i) => {
      if (wrapper) wrapper.style.zIndex = String(initial[i].zIndex)
    })

    const ctx = gsap.context(() => {
      innersRef.current.forEach((inner, i) => {
        const wrapper = wrappersRef.current[i]
        if (!inner || !wrapper) return

        const measureOffset = () => {
          const wRect = wrapper.getBoundingClientRect()
          const sRect = section.getBoundingClientRect()
          return {
            x: sRect.left + sRect.width  / 2 - (wRect.left + wRect.width  / 2),
            y: sRect.top  + sRect.height / 2 - (wRect.top  + wRect.height / 2),
          }
        }

        gsap.fromTo(
          inner,
          {
            x:      () => measureOffset().x,
            y:      () => measureOffset().y,
            scale:  initial[i].scale,
            rotate: initial[i].rotation,
          },
          {
            x: 0, y: 0, scale: 1, rotate: 0,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: section,
              start:   'top 70%',
              end:     'top -25%',
              scrub:   3,
              invalidateOnRefresh: true,
            },
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  /* ── Section-level GSAP (header, rule) ── */
  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.from('.cg3-eyebrow', {
      opacity: 0, y: 14, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    })

    gsap.from('.cg3-rule', {
      scaleX: 0, duration: 1.1, ease: 'power3.out', transformOrigin: 'left',
      scrollTrigger: { trigger: section, start: 'top 78%', once: true },
    })

    gsap.from('.cg3-viewall', {
      opacity: 0, x: 16, duration: 0.75, ease: 'power3.out', delay: 0.15,
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{ background: 'var(--cr2)', overflow: 'hidden' }}
    >
      {/* ── Section header ── */}
      <div className="section-header" style={{ alignItems: 'flex-end' }}>
        <div>
          <span className="eyebrow cg3-eyebrow">Browse by Category</span>
          <RevealText tag="h2" className="display-heading" stagger={0.03} start="top 85%">
            Shop by Wardrobe
          </RevealText>
        </div>
        <Link to="/collection" className="va-link cg3-viewall">
          All Categories
        </Link>
      </div>

      {/* ── Gold accent rule ── */}
      <div
        className="cg3-rule"
        style={{
          height: 1,
          background: 'linear-gradient(to right, var(--go), rgba(184,149,96,0.15), transparent)',
          marginBottom: 'clamp(2rem,4vw,3rem)',
        }}
      />

      {/* ── Masonry grid ── */}
      <div className="cg2-masonry">
        {CATEGORIES.map((cat, i) => (
          <div
            key={cat.label}
            ref={el => { wrappersRef.current[i] = el }}
            className="cg2-tile"
            style={{
              gridRow:    cat.layout === 'tall' ? 'span 2' : undefined,
              gridColumn: cat.layout === 'wide' ? 'span 2' : undefined,
              position:   'relative',
              overflow:   'visible',      // let inner overflow during animation
            }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(-1)}
          >
            {/* Inner — this is what GSAP animates FROM center */}
            <div
              ref={el => { innersRef.current[i] = el }}
              style={{
                width:        '100%',
                height:       '100%',
                overflow:     'hidden',
                willChange:   'transform',
                position:     'relative',
              }}
            >
              <CategoryTile cat={cat} isActive={active === i} />
            </div>

            {/* Ghost number — outside the overflow:hidden inner */}
            <div
              style={{
                position:      'absolute',
                bottom:        '-.55em',
                right:         '-.15em',
                fontFamily:    'var(--fd)',
                fontSize:      cat.layout === 'wide' ? 'clamp(5rem,9vw,10rem)' : 'clamp(3.5rem,6vw,7rem)',
                fontWeight:    300,
                lineHeight:    1,
                letterSpacing: '-0.05em',
                color:         'rgba(26,23,20,0.045)',
                pointerEvents: 'none',
                userSelect:    'none',
                zIndex:        -1,
                fontVariantNumeric: 'tabular-nums',
                transition:    'color 0.4s',
                ...(active === i ? { color: `${cat.accent}22` } : {}),
              }}
            >
              {cat.num}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Individual tile ── */
function CategoryTile({ cat, isActive }) {
  const ruleRef = useRef(null)

  // Gold underline rule on hover
  useGSAP(() => {
    if (!ruleRef.current) return
    gsap.to(ruleRef.current, {
      scaleX:          isActive ? 1 : 0,
      transformOrigin: isActive ? 'left' : 'right',
      duration:        0.55,
      ease:            'power3.inOut',
    })
  }, [isActive])

  return (
    <div
      style={{
        position: 'relative',
        width:    '100%',
        height:   '100%',
        cursor:   'pointer',
      }}
    >
      {/* Image with parallax headroom */}
      <img
        src={cat.img}
        alt={cat.label}
        style={{
          position:       'absolute',
          top:            '-12%',
          left:           0,
          right:          0,
          width:          '100%',
          height:         '124%',
          objectFit:      'cover',
          display:        'block',
          transform:      isActive ? 'scale(1.07)' : 'scale(1)',
          transition:     'transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      />

      {/* Persistent bottom gradient */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to top, rgba(26,23,20,0.85) 0%, rgba(26,23,20,0.25) 50%, transparent 100%)',
          transition: 'opacity 0.45s ease',
          opacity:    isActive ? 1 : 0.72,
        }}
      />

      {/* Hover: top gradient for tag legibility */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to bottom, rgba(26,23,20,0.55) 0%, transparent 35%)',
          opacity:    isActive ? 1 : 0,
          transition: 'opacity 0.45s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Colour bloom on hover */}
      <div
        style={{
          position:      'absolute',
          inset:         0,
          background:    `radial-gradient(circle at 50% 110%, ${cat.accent}28, transparent 65%)`,
          opacity:       isActive ? 1 : 0,
          transition:    'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
      />

      {/* ── Top: category tag + number pill ── */}
      <div
        style={{
          position:       'absolute',
          top:            0,
          left:           0,
          right:          0,
          padding:        'clamp(.6rem,1.2vw,.9rem) clamp(.8rem,1.5vw,1.1rem)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          zIndex:         2,
        }}
      >
        {/* Category tag */}
        <span
          style={{
            fontFamily:    'var(--fb)',
            fontSize:      '.42rem',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color:         isActive ? cat.accent : 'rgba(250,248,245,0.45)',
            border:        `1px solid ${isActive ? cat.accent + '55' : 'rgba(250,248,245,0.12)'}`,
            padding:       '.2rem .5rem',
            backdropFilter:'blur(8px)',
            background:    'rgba(6,4,2,0.28)',
            transition:    'color 0.35s, border-color 0.35s',
          }}
        >
          {cat.tag}
        </span>

        {/* Number pill */}
        <span
          style={{
            fontFamily:       'var(--fd)',
            fontSize:         '.78rem',
            fontWeight:       300,
            color:            isActive ? 'rgba(250,248,245,0.55)' : 'rgba(250,248,245,0.18)',
            letterSpacing:    '-0.02em',
            transition:       'color 0.35s',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {cat.num}
        </span>
      </div>

      {/* ── Bottom label block ── */}
      <div
        style={{
          position: 'absolute',
          bottom:   0,
          left:     0,
          right:    0,
          padding:  'clamp(.8rem,1.8vw,1.4rem) clamp(.8rem,1.8vw,1.3rem)',
          zIndex:   2,
        }}
      >
        {/* Animated gold underline */}
        <div
          style={{
            height:          1,
            background:      `linear-gradient(to right, ${cat.accent}, transparent)`,
            marginBottom:    'clamp(.5rem,1vw,.75rem)',
            transformOrigin: 'left',
          }}
        >
          <div
            ref={ruleRef}
            style={{ width: '60%', height: '100%', background: 'inherit', transform: 'scaleX(0)' }}
          />
        </div>

        {/* Label */}
        <p
          style={{
            fontFamily:    'var(--fd)',
            fontSize:      cat.layout === 'wide'
              ? 'clamp(1.35rem,2.4vw,2rem)'
              : 'clamp(1.1rem,1.7vw,1.55rem)',
            fontWeight:    300,
            color:         '#FAF8F5',
            lineHeight:    1.1,
            marginBottom:  '.35rem',
            letterSpacing: '-0.015em',
            transform:     isActive ? 'translateY(-3px)' : 'translateY(0)',
            transition:    'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        >
          {cat.label}
        </p>

        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Piece count */}
          <span
            style={{
              fontSize:      '.44rem',
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color:         isActive ? cat.accent : 'rgba(250,248,245,0.35)',
              transition:    'color 0.35s',
            }}
          >
            {cat.sub}
          </span>

          {/* Explore arrow — slides in on hover */}
          <span
            style={{
              fontSize:      '.44rem',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color:         cat.accent,
              transform:     isActive ? 'translateX(0)' : 'translateX(14px)',
              opacity:       isActive ? 1 : 0,
              transition:    'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.35s',
              display:       'flex',
              alignItems:    'center',
              gap:           '.35rem',
            }}
          >
            Explore
            <svg width="20" height="5" viewBox="0 0 20 5" fill="none" aria-hidden="true">
              <line x1="0" y1="2.5" x2="16" y2="2.5" stroke="currentColor" strokeWidth="0.8"/>
              <path d="M13 1L16.5 2.5L13 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
            </svg>
          </span>
        </div>

        {/* Bottom: animated underline bar */}
        <div
          style={{
            height:          '1px',
            marginTop:       '.65rem',
            background:      cat.accent,
            transform:       isActive ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition:      'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
            opacity:         0.35,
          }}
        />
      </div>

      {/* ── Accent dot ── */}
      <div
        style={{
          position:   'absolute',
          top:        isActive ? '.85rem' : '.75rem',
          right:      isActive ? '.85rem' : '.75rem',
          width:      isActive ? 7 : 5,
          height:     isActive ? 7 : 5,
          borderRadius: '50%',
          background: cat.accent,
          opacity:    isActive ? 1 : 0.4,
          transition: 'all 0.35s ease',
          pointerEvents: 'none',
          zIndex:     3,
        }}
      />

      {/* ── Link overlay ── */}
      <Link
        to={cat.to}
        style={{
          position: 'absolute',
          inset:    0,
          zIndex:   4,
        }}
        aria-label={`Shop ${cat.label}`}
      />
    </div>
  )
}

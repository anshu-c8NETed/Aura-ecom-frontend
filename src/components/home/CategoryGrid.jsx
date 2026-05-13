import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

// Replace image URLs with your own photography.
// layout: 'tall' = spans 2 rows, 'wide' = spans 2 cols, 'normal' = 1×1
const CATEGORIES = [
  {
    label:   'Dresses',
    sub:     '42 pieces',
    to:      '/collection?category=dresses',
    img:     'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    accent:  'rgba(212,180,120,0.55)',  // warm gold
    layout:  'tall',
  },
  {
    label:   'Outerwear',
    sub:     '18 pieces',
    to:      '/collection?category=outerwear',
    img:     'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&auto=format&fit=crop&q=80',
    accent:  'rgba(155,143,130,0.5)',   // warm grey
    layout:  'tall',
  },
  {
    label:   'Tailoring',
    sub:     '31 pieces',
    to:      '/collection?category=tailoring',
    img:     'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&auto=format&fit=crop&q=80',
    accent:  'rgba(192,148,88,0.5)',    // camel
    layout:  'normal',
  },
  {
    label:   'Knitwear',
    sub:     '24 pieces',
    to:      '/collection?category=knitwear',
    img:     'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    accent:  'rgba(200,184,152,0.55)',  // ecru
    layout:  'normal',
  },
  {
    label:   'New Arrivals',
    sub:     'SS 2025',
    to:      '/collection?filter=new',
    img:     'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&auto=format&fit=crop&q=80',
    accent:  'rgba(26,23,20,0.3)',
    layout:  'wide',
  },
]

export default function CategoryGrid() {
  const ref = useRef(null)

  useGSAP(() => {
    gsap.from('.cg2-header', {
      opacity: 0, y: 22, duration: .7,
      scrollTrigger: { trigger: '.cg2-header', start: 'top 82%' },
    })
    gsap.from('.cg2-tile', {
      opacity: 0, y: 32, stagger: .1, duration: .75, ease: 'power3.out',
      scrollTrigger: { trigger: '.cg2-masonry', start: 'top 76%' },
    })
  }, { scope: ref })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--cr2)' }}>
      <div className="section-header cg2-header">
        <div>
          <span className="eyebrow">Browse by Category</span>
          <h2 className="display-heading">Shop by <em>Wardrobe</em></h2>
        </div>
        <Link to="/collection" className="va-link">All Categories</Link>
      </div>

      {/*
        Grid layout:
          col 1: Dresses (tall — rows 1+2)
          col 2: Outerwear (tall — rows 1+2)
          col 3: Tailoring (row 1) + wide bottom (row 2, cols 3+4)
          col 4: Knitwear (row 1)
          row 2 cols 3-4: New Arrivals (wide)
      */}
      <div
        className="cg2-masonry"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: '340px 200px',
          gap: '10px',
        }}
      >
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.label}
            to={cat.to}
            className="cg2-tile"
            style={{
              display: 'block',
              textDecoration: 'none',
              gridRow:    cat.layout === 'tall' ? 'span 2' : undefined,
              gridColumn: cat.layout === 'wide' ? 'span 2' : undefined,
            }}
          >
            <CategoryTile cat={cat} />
          </Link>
        ))}
      </div>
    </section>
  )
}

function CategoryTile({ cat }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.querySelector('.cgt-img').style.transform = 'scale(1.06)'
        e.currentTarget.querySelector('.cgt-cta').style.opacity = '1'
        e.currentTarget.querySelector('.cgt-cta').style.transform = 'translateX(0)'
      }}
      onMouseLeave={e => {
        e.currentTarget.querySelector('.cgt-img').style.transform = 'scale(1)'
        e.currentTarget.querySelector('.cgt-cta').style.opacity = '0'
        e.currentTarget.querySelector('.cgt-cta').style.transform = 'translateX(-8px)'
      }}
    >
      {/* Photo */}
      <img
        className="cgt-img"
        src={cat.img}
        alt={cat.label}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'transform .65s cubic-bezier(0.25,0.46,0.45,0.94)',
          display: 'block',
        }}
      />

      {/* Gradient overlay — always */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to top, rgba(26,23,20,0.72) 0%, ${cat.accent} 55%, transparent 100%)`,
      }} />

      {/* Label block */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '1.2rem 1.4rem',
      }}>
        <p style={{
          fontFamily: 'var(--fd)',
          fontSize: cat.layout === 'wide' ? '1.8rem' : '1.5rem',
          fontWeight: 300,
          color: '#FAF8F5',
          lineHeight: 1.05,
          marginBottom: '.25rem',
        }}>
          {cat.label}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '.52rem',
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: 'rgba(250,248,245,0.5)',
          }}>
            {cat.sub}
          </span>

          {/* Animated arrow CTA */}
          <span
            className="cgt-cta"
            style={{
              fontSize: '.56rem',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: 'var(--go)',
              opacity: 0,
              transform: 'translateX(-8px)',
              transition: 'opacity .3s, transform .3s',
              display: 'flex',
              alignItems: 'center',
              gap: '.4rem',
            }}
          >
            Explore →
          </span>
        </div>
      </div>

      {/* Top-right accent dot */}
      <div style={{
        position: 'absolute',
        top: '.9rem', right: '.9rem',
        width: 6, height: 6,
        borderRadius: '50%',
        background: 'var(--go)',
        opacity: .6,
      }} />
    </div>
  )
}
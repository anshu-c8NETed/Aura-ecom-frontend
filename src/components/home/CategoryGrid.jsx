import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import RevealText from '../layout/Revealtext'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = [
  {
    label:  'Dresses',
    sub:    '42 pieces',
    to:     '/collection?category=dresses',
    img:    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    accent: 'rgba(212,180,120,0.55)',
    layout: 'tall',
    speed:  0.04,   // parallax scroll speed — like data-scroll-speed
  },
  {
    label:  'Outerwear',
    sub:    '18 pieces',
    to:     '/collection?category=outerwear',
    img:    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&auto=format&fit=crop&q=80',
    accent: 'rgba(155,143,130,0.5)',
    layout: 'tall',
    speed:  0.07,
  },
  {
    label:  'Tailoring',
    sub:    '31 pieces',
    to:     '/collection?category=tailoring',
    img:    'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&auto=format&fit=crop&q=80',
    accent: 'rgba(192,148,88,0.5)',
    layout: 'normal',
    speed:  0.05,
  },
  {
    label:  'Knitwear',
    sub:    '24 pieces',
    to:     '/collection?category=knitwear',
    img:    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    accent: 'rgba(200,184,152,0.55)',
    layout: 'normal',
    speed:  0.03,
  },
  {
    label:  'New Arrivals',
    sub:    'SS 2025',
    to:     '/collection?filter=new',
    img:    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&auto=format&fit=crop&q=80',
    accent: 'rgba(26,23,20,0.35)',
    layout: 'wide',
    speed:  0.06,
  },
]

export default function CategoryGrid() {
  const ref = useRef(null)

  useGSAP(() => {
    // Header reveal
    gsap.from('.cg2-header', {
      opacity: 0, y: 22, duration: .7,
      scrollTrigger: { trigger: '.cg2-header', start: 'top 82%', once: true },
    })

    // Tile entrance — stagger + scale
    gsap.from('.cg2-tile', {
      opacity: 0, y: 40, scale: 0.96,
      stagger: { amount: 0.45 },
      duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: '.cg2-masonry', start: 'top 78%', once: true },
    })

    // Per-tile image parallax — each tile photo scrolls at its own speed
    // (mirrors Canvas.jsx data-scroll-speed pattern from the inspiration)
    CATEGORIES.forEach((cat, i) => {
      const tile = ref.current?.querySelectorAll('.cg2-tile')?.[i]
      const img  = tile?.querySelector('.cgt-img')
      if (!tile || !img) return

      gsap.to(img, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: tile,
          start:   'top bottom',
          end:     'bottom top',
          scrub:   cat.speed,
        },
      })
    })
  }, { scope: ref })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--cr2)' }}>
      <div className="section-header cg2-header">
        <div>
          <span className="eyebrow">Browse by Category</span>
          <RevealText tag="h2" className="display-heading" stagger={0.03} start="top 85%">
            Shop by Wardrobe
          </RevealText>
        </div>
        <Link to="/collection" className="va-link">All Categories</Link>
      </div>

      <div
        className="cg2-masonry"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: '340px 200px',
          gap: '10px',
        }}
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            to={cat.to}
            className="cg2-tile"
            style={{
              display: 'block',
              textDecoration: 'none',
              gridRow:    cat.layout === 'tall' ? 'span 2' : undefined,
              gridColumn: cat.layout === 'wide' ? 'span 2' : undefined,
              overflow: 'hidden',       // needed for parallax overflow
              position: 'relative',
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
        position: 'relative', width: '100%', height: '100%',
        overflow: 'hidden', cursor: 'pointer',
      }}
      onMouseEnter={e => {
        const img = e.currentTarget.querySelector('.cgt-img')
        const cta = e.currentTarget.querySelector('.cgt-cta')
        if (img) img.style.transform = 'scale(1.06)'
        if (cta) { cta.style.opacity = '1'; cta.style.transform = 'translateX(0)' }
      }}
      onMouseLeave={e => {
        const img = e.currentTarget.querySelector('.cgt-img')
        const cta = e.currentTarget.querySelector('.cgt-cta')
        if (img) img.style.transform = 'scale(1)'
        if (cta) { cta.style.opacity = '0'; cta.style.transform = 'translateX(-8px)' }
      }}
    >
      {/* Photo — extends slightly beyond tile for parallax room */}
      <img
        className="cgt-img"
        src={cat.img}
        alt={cat.label}
        style={{
          position: 'absolute',
          top: '-10%', left: 0, right: 0,
          width: '100%', height: '120%',
          objectFit: 'cover',
          transition: 'transform .65s cubic-bezier(0.25,0.46,0.45,0.94)',
          display: 'block',
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to top, rgba(26,23,20,0.72) 0%, ${cat.accent} 55%, transparent 100%)`,
      }} />

      {/* Label */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.2rem 1.4rem' }}>
        <p style={{
          fontFamily: 'var(--fd)',
          fontSize: cat.layout === 'wide' ? '1.8rem' : '1.5rem',
          fontWeight: 300, color: '#FAF8F5', lineHeight: 1.05, marginBottom: '.25rem',
        }}>
          {cat.label}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '.52rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(250,248,245,0.5)' }}>
            {cat.sub}
          </span>
          <span className="cgt-cta" style={{
            fontSize: '.56rem', letterSpacing: '.16em', textTransform: 'uppercase',
            color: 'var(--go)', opacity: 0, transform: 'translateX(-8px)',
            transition: 'opacity .3s, transform .3s',
          }}>
            Explore →
          </span>
        </div>
      </div>

      {/* Accent dot */}
      <div style={{
        position: 'absolute', top: '.9rem', right: '.9rem',
        width: 6, height: 6, borderRadius: '50%',
        background: 'var(--go)', opacity: .6,
      }} />
    </div>
  )
}
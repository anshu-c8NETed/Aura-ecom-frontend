import { useRef, useState } from 'react'
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
  },
  {
    label:  'Outerwear',
    sub:    '18 pieces',
    to:     '/collection?category=outerwear',
    img:    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&auto=format&fit=crop&q=80',
    accent: '#9B8F82',
    layout: 'tall',
  },
  {
    label:  'Tailoring',
    sub:    '31 pieces',
    to:     '/collection?category=tailoring',
    img:    'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&auto=format&fit=crop&q=80',
    accent: '#C09458',
    layout: 'normal',
  },
  {
    label:  'Knitwear',
    sub:    '24 pieces',
    to:     '/collection?category=knitwear',
    img:    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    accent: '#C8B898',
    layout: 'normal',
  },
  {
    label:  'New Arrivals',
    sub:    'SS 2025',
    to:     '/collection?filter=new',
    img:    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&auto=format&fit=crop&q=80',
    accent: '#FAF8F5',
    layout: 'wide',
  },
]

export default function CategoryGrid() {
  const ref = useRef(null)

  useGSAP(() => {
    const tiles = ref.current?.querySelectorAll('.cg2-tile')
    if (!tiles?.length) return

    /* ── Tile entrance: clip-path curtain + subtle scale ── */
    tiles.forEach((tile, i) => {
      gsap.fromTo(tile,
        { clipPath: 'inset(100% 0 0 0)', scale: 1.05 },
        {
          clipPath: 'inset(0% 0 0 0)', scale: 1,
          duration: 1.1, ease: 'power4.inOut',
          delay: i * 0.08,
          scrollTrigger: { trigger: tile, start: 'top 85%', once: true },
        }
      )

      /* Label slides up after the clip reveals */
      const label = tile.querySelector('.cg-label')
      if (label) {
        gsap.fromTo(label,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.7, ease: 'power3.out',
            delay: i * 0.08 + 0.45,
            scrollTrigger: { trigger: tile, start: 'top 85%', once: true },
          }
        )
      }

      /* Per-tile parallax on the image */
      const img = tile.querySelector('.cg-img')
      if (img) {
        gsap.to(img, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: tile,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.25 + i * 0.08,
          },
        })
      }
    })

    /* Header rule sweep */
    gsap.from('.cg-rule', {
      scaleX: 0, duration: 1, ease: 'power3.out', transformOrigin: 'left',
      scrollTrigger: { trigger: '.cg-rule', start: 'top 90%', once: true },
    })
  }, { scope: ref })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--cr2)' }}>
      {/* ── Header ── */}
      <div className="section-header">
        <div>
          <span className="eyebrow">Browse by Category</span>
          <RevealText tag="h2" className="display-heading" stagger={0.03} start="top 85%">
            Shop by Wardrobe
          </RevealText>
        </div>
        <Link to="/collection" className="va-link">All Categories</Link>
      </div>

      {/* Accent rule */}
      <div className="cg-rule" style={{
        height: 1,
        background: 'linear-gradient(to right, var(--go), var(--bo))',
        marginBottom: 'clamp(2rem,4vw,3rem)',
      }} />

      {/* ── Masonry grid ── */}
      <div className="cg2-masonry">
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
              overflow: 'hidden',
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
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        position: 'relative', width: '100%', height: '100%',
        overflow: 'hidden', cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image — extends 24% for parallax headroom */}
      <img
        className="cg-img"
        src={cat.img}
        alt={cat.label}
        style={{
          position: 'absolute',
          top: '-12%', left: 0, right: 0,
          width: '100%', height: '124%',
          objectFit: 'cover',
          transition: 'transform .7s cubic-bezier(.25,.46,.45,.94)',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          display: 'block',
        }}
      />

      {/* Gradient overlay — deepens on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(26,23,20,0.8) 0%, rgba(26,23,20,0.3) 45%, transparent 100%)',
        transition: 'opacity .4s',
        opacity: hovered ? 0.95 : 0.7,
      }} />

      {/* Colour bloom */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 100%, ${cat.accent}20, transparent 65%)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity .5s',
        pointerEvents: 'none',
      }} />

      {/* Label group */}
      <div className="cg-label" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 'clamp(1rem,2vw,1.5rem) clamp(1.2rem,2vw,1.6rem)',
      }}>
        <p style={{
          fontFamily: 'var(--fd)',
          fontSize: cat.layout === 'wide' ? 'clamp(1.4rem,2.5vw,2rem)' : 'clamp(1.2rem,1.8vw,1.6rem)',
          fontWeight: 300,
          color: '#FAF8F5', lineHeight: 1.1, marginBottom: '.35rem',
          transition: 'transform .4s cubic-bezier(.25,.46,.45,.94)',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        }}>
          {cat.label}
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: '.48rem', letterSpacing: '.2em', textTransform: 'uppercase',
            color: 'rgba(250,248,245,0.45)',
            transition: 'color .35s',
            ...(hovered ? { color: cat.accent } : {}),
          }}>
            {cat.sub}
          </span>

          {/* Explore — slides in on hover */}
          <span style={{
            fontSize: '.48rem', letterSpacing: '.16em', textTransform: 'uppercase',
            color: cat.accent,
            transform: hovered ? 'translateX(0)' : 'translateX(16px)',
            opacity: hovered ? 1 : 0,
            transition: 'transform .45s cubic-bezier(.25,.46,.45,.94), opacity .35s',
          }}>
            Explore →
          </span>
        </div>

        {/* Animated underline */}
        <div style={{
          height: '1px', marginTop: '.7rem',
          background: cat.accent,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform .55s cubic-bezier(.25,.46,.45,.94)',
          opacity: 0.4,
        }} />
      </div>

      {/* Accent dot */}
      <div style={{
        position: 'absolute', top: '.9rem', right: '.9rem',
        width: 6, height: 6, borderRadius: '50%',
        background: cat.accent,
        transition: 'transform .35s, opacity .35s',
        transform: hovered ? 'scale(1.5)' : 'scale(1)',
        opacity: hovered ? 1 : 0.5,
      }} />
    </div>
  )
}

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
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
    // Tiles entrance — cascade with clip-path reveal
    const tiles = ref.current?.querySelectorAll('.cg3-tile')
    if (!tiles?.length) return

    tiles.forEach((tile, i) => {
      gsap.fromTo(tile,
        {
          clipPath: 'inset(100% 0 0 0)',
          scale: 1.08,
        },
        {
          clipPath: 'inset(0% 0 0 0)',
          scale: 1,
          duration: 1.2,
          ease: 'power4.inOut',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: tile,
            start: 'top 85%',
            once: true,
          },
        }
      )

      // Label reveal after clip
      const label = tile.querySelector('.cg3-label')
      if (label) {
        gsap.fromTo(label,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.1 + 0.5,
            scrollTrigger: {
              trigger: tile,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }

      // Parallax on each tile's image
      const img = tile.querySelector('.cg3-img')
      if (img) {
        gsap.to(img, {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: tile,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.3 + i * 0.1,
          },
        })
      }
    })
  }, { scope: ref })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--cr2)' }}>
      {/* ── Header ── */}
      <div className="section-header" style={{ marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
        <div>
          <span className="eyebrow">Browse by Category</span>
          <RevealText tag="h2" className="display-heading" stagger={0.03} start="top 85%">
            Shop by Wardrobe
          </RevealText>
        </div>
        <Link to="/collection" className="va-link" style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          All Categories <ArrowUpRight size={13} strokeWidth={1.5} />
        </Link>
      </div>

      {/* ── Masonry grid ── */}
      <div className="cg2-masonry">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            to={cat.to}
            className="cg2-tile cg3-tile"
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
      {/* Photo — extends for parallax headroom */}
      <img
        className="cg3-img"
        src={cat.img}
        alt={cat.label}
        style={{
          position: 'absolute',
          top: '-12%', left: 0, right: 0,
          width: '100%', height: '124%',
          objectFit: 'cover',
          transition: 'transform .8s cubic-bezier(.25,.46,.45,.94)',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          display: 'block',
        }}
      />

      {/* Multi-layer gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(
          to top,
          rgba(26,23,20,0.85) 0%,
          rgba(26,23,20,0.35) 40%,
          transparent 100%
        )`,
        transition: 'opacity .5s',
        opacity: hovered ? 0.95 : 0.75,
      }} />

      {/* Colour bloom on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 100%, ${cat.accent}25, transparent 70%)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity .6s ease',
        pointerEvents: 'none',
      }} />

      {/* Label group */}
      <div className="cg3-label" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 'clamp(1rem,2vw,1.6rem) clamp(1.2rem,2vw,1.8rem)',
      }}>
        {/* Category name */}
        <p style={{
          fontFamily: 'var(--fd)',
          fontSize: cat.layout === 'wide' ? 'clamp(1.6rem,2.5vw,2.2rem)' : 'clamp(1.3rem,2vw,1.8rem)',
          fontWeight: 300, fontStyle: 'italic',
          color: '#FAF8F5', lineHeight: 1.05, marginBottom: '.4rem',
          transition: 'transform .5s cubic-bezier(.25,.46,.45,.94)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}>
          {cat.label}
        </p>

        {/* Sub + CTA row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          overflow: 'hidden',
        }}>
          <span style={{
            fontSize: '.48rem', letterSpacing: '.22em', textTransform: 'uppercase',
            color: 'rgba(250,248,245,0.45)',
            transition: 'color .4s',
            ...(hovered ? { color: cat.accent } : {}),
          }}>
            {cat.sub}
          </span>

          {/* Explore CTA — slides in on hover */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '.4rem',
            transform: hovered ? 'translateX(0)' : 'translateX(24px)',
            opacity: hovered ? 1 : 0,
            transition: 'transform .5s cubic-bezier(.25,.46,.45,.94), opacity .4s',
          }}>
            <span style={{
              fontSize: '.48rem', letterSpacing: '.18em', textTransform: 'uppercase',
              color: cat.accent,
            }}>
              Explore
            </span>
            <ArrowUpRight size={12} strokeWidth={1.5} color={cat.accent} />
          </div>
        </div>

        {/* Animated underline */}
        <div style={{
          height: '1px', marginTop: '.8rem',
          background: cat.accent,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform .6s cubic-bezier(.25,.46,.45,.94)',
          opacity: 0.5,
        }} />
      </div>

      {/* Accent dot — pulses on hover */}
      <div style={{
        position: 'absolute', top: '1rem', right: '1rem',
        width: 6, height: 6, borderRadius: '50%',
        background: cat.accent,
        transition: 'transform .4s, opacity .4s',
        transform: hovered ? 'scale(1.6)' : 'scale(1)',
        opacity: hovered ? 1 : 0.5,
      }} />
    </div>
  )
}
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  { label: 'Dresses',    sub: '42 pieces',   to: '/collection?category=dresses',   accent: '#D4B478' },
  { label: 'Outerwear',  sub: '18 pieces',   to: '/collection?category=outerwear',  accent: '#9B8F82' },
  { label: 'Tailoring',  sub: '31 pieces',   to: '/collection?category=tailoring',  accent: '#B89560' },
  { label: 'Knitwear',   sub: '24 pieces',   to: '/collection?category=knitwear',   accent: '#C8B898' },
]

export default function CategoryGrid() {
  const ref = useRef(null)

  useGSAP(() => {
    gsap.from('.cg-header', { opacity: 0, y: 24, duration: .7, scrollTrigger: { trigger: '.cg-header', start: 'top 80%' } })
    gsap.from('.cg-tile', {
      opacity: 0, y: 36, stagger: .12, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: '.cg-grid', start: 'top 75%' },
    })
  }, { scope: ref })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--cr2)' }}>
      <div className="section-header cg-header">
        <div>
          <span className="eyebrow">Browse by Category</span>
          <h2 className="display-heading">Shop by <em>Wardrobe</em></h2>
        </div>
      </div>

      <div className="cg-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {categories.map(cat => (
          <Link key={cat.label} to={cat.to} className="cg-tile" style={{ display: 'block', textDecoration: 'none' }}>
            <CategoryTile {...cat} />
          </Link>
        ))}
      </div>
    </section>
  )
}

function CategoryTile({ label, sub, accent }) {
  const [hovered, setHovered] = [false, () => {}]

  return (
    <div
      style={{
        aspectRatio: '3/4', background: 'var(--cr3)', position: 'relative',
        overflow: 'hidden', cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.querySelector('.ct-overlay').style.opacity = 1
        e.currentTarget.querySelector('.ct-arrow').style.opacity = 1
        e.currentTarget.querySelector('.ct-arrow').style.transform = 'translateX(6px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.querySelector('.ct-overlay').style.opacity = 0
        e.currentTarget.querySelector('.ct-arrow').style.opacity = 0
        e.currentTarget.querySelector('.ct-arrow').style.transform = 'translateX(0)'
      }}
    >
      {/* CSS figure per category */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SimpleFigure accent={accent} />
      </div>

      {/* Hover overlay */}
      <div className="ct-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(26,23,20,0.55)', opacity: 0, transition: 'opacity var(--tr)' }} />

      {/* Label */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.2rem' }}>
        <p style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--cr)', marginBottom: '.2rem', textShadow: '0 1px 8px rgba(0,0,0,.2)' }}>{label}</p>
        <p style={{ fontSize: '.55rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(250,248,245,.55)' }}>{sub}</p>
        <div className="ct-arrow" style={{ marginTop: '.7rem', color: 'var(--go)', fontSize: '.6rem', letterSpacing: '.15em', opacity: 0, transform: 'translateX(0)', transition: 'opacity .3s, transform .3s' }}>
          Explore →
        </div>
      </div>

      {/* Top accent */}
      <div style={{ position: 'absolute', top: '.8rem', right: '.8rem', width: 18, height: 18, border: `1px solid ${accent}`, opacity: .4 }} />
    </div>
  )
}

function SimpleFigure({ accent }) {
  return (
    <div style={{ position: 'relative', width: 70, height: 170 }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 26, height: 30, background: '#D0BEA8', borderRadius: '50% 50% 46% 46%' }} />
      <div style={{ position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)', width: 36, height: 60, background: accent, clipPath: 'polygon(20% 0%,80% 0%,88% 100%,12% 100%)', opacity: .8 }} />
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 62, height: 88, background: accent, clipPath: 'polygon(28% 0%,72% 0%,90% 100%,10% 100%)', opacity: .55 }} />
    </div>
  )
}
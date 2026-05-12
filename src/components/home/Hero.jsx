import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'

export default function Hero() {
  const containerRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Eyebrow
    tl.from('.hero-eyebrow', { opacity: 0, y: 12, duration: .7 }, .3)
    // Heading words
    tl.from('.hero-word', { y: '110%', stagger: .12, duration: .9 }, .4)
    // Desc
    tl.from('.hero-desc', { opacity: 0, y: 14, duration: .7 }, .85)
    // CTA row
    tl.from('.hero-cta', { opacity: 0, y: 14, duration: .7 }, 1.05)
    // Scroll hint
    tl.from('.hero-scroll', { opacity: 0, duration: .7 }, 1.3)
    // Right panel
    tl.from('.hero-fig', { opacity: 0, duration: 1.2 }, .8)
    tl.from('.hero-tags', { opacity: 0, y: 10, stagger: .2, duration: .8 }, 1.4)
    tl.from('.hero-circles', { opacity: 0, scale: .85, stagger: .15, duration: 1, ease: 'power2.out' }, .5)
    tl.from('.hero-num', { opacity: 0, x: 20, duration: 1.2 }, .6)
  }, { scope: containerRef })

  return (
    <section ref={containerRef} style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      minHeight: '100vh', paddingTop: 62, overflow: 'hidden',
    }}>
      {/* Left */}
      <div style={{
        padding: 'clamp(3rem,6vw,7rem) 5vw clamp(3rem,6vw,7rem)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <span className="hero-eyebrow" style={{ fontSize: '.58rem', letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '2rem', display: 'block' }}>
          SS 2025 Collection
        </span>

        <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(3.2rem,5.5vw,6.5rem)', fontWeight: 300, lineHeight: 1.0, marginBottom: '2.5rem' }}>
          {[['Dressed'], ['in', <em key="em" style={{ fontStyle: 'italic', color: 'var(--mu)' }}> Silence</em>], ['& Grace']].map((line, li) => (
            <span key={li} style={{ display: 'block', overflow: 'hidden' }}>
              <span className="hero-word" style={{ display: 'inline-block' }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-desc" style={{ fontSize: '.82rem', lineHeight: 1.95, color: 'var(--mu)', maxWidth: 330, marginBottom: '3rem' }}>
          Discover pieces that transcend seasons — curated for those who understand that true luxury lies in restraint, not excess.
        </p>

        <div className="hero-cta" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/collection">
            <button className="btn-primary"><span>Explore Collection</span></button>
          </Link>
          <button className="btn-ghost">Our Story</button>
        </div>

        <div className="hero-scroll" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '3.5rem' }}>
          <div style={{ width: 38, height: 1, background: 'var(--cr3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
              background: 'var(--go)', animation: 'shimmer 2.2s 2s infinite',
            }} />
          </div>
          <span style={{ fontSize: '.55rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--mu)' }}>
            Scroll to Discover
          </span>
        </div>
      </div>

      {/* Right — image panel */}
      <div style={{
        background: 'var(--cr2)', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', minHeight: '100%',
      }}>
        {/* Decorative circles */}
        <div className="hero-circles" style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          border: '1px solid var(--cr3)', top: -70, right: -80,
        }} />
        <div className="hero-circles" style={{
          position: 'absolute', width: 130, height: 130, borderRadius: '50%',
          border: '1px solid var(--cr3)', bottom: 80, left: 20,
        }} />

        {/* CSS Figure */}
        <div className="hero-fig" style={{ position: 'relative', width: 240, height: 460 }}>
          {/* Hair */}
          <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 50, height: 42, background: '#1A1008', borderRadius: '50% 50% 0 0' }} />
          <div style={{ position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%) translateX(-23px)', width: 13, height: 62, background: '#1A1008', borderRadius: '0 0 5px 5px' }} />
          {/* Head */}
          <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 44, height: 54, background: '#D8C8AE', borderRadius: '50% 50% 46% 46%' }} />
          {/* Neck */}
          <div style={{ position: 'absolute', top: 62, left: '50%', transform: 'translateX(-50%)', width: 17, height: 24, background: '#D0BEA8' }} />
          {/* Body */}
          <div style={{ position: 'absolute', top: 78, left: '50%', transform: 'translateX(-50%)', width: 68, height: 108, background: 'linear-gradient(170deg,#2A2018,#3E3028)', clipPath: 'polygon(18% 0%,82% 0%,90% 100%,10% 100%)' }} />
          {/* Dress */}
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 150, height: 300, background: 'linear-gradient(162deg,#2A2018 0%,#3E3028 45%,#1C1810 100%)', clipPath: 'polygon(30% 0%,70% 0%,90% 100%,10% 100%)' }} />
          {/* Arms */}
          <div style={{ position: 'absolute', top: 96, left: '50%', transform: 'translateX(-50%) translateX(-58px) rotate(12deg)', width: 12, height: 110, background: '#D0BEA8', borderRadius: 5 }} />
          <div style={{ position: 'absolute', top: 96, left: '50%', transform: 'translateX(-50%) translateX(44px) rotate(-8deg)', width: 12, height: 92, background: '#D0BEA8', borderRadius: 5 }} />
        </div>

        {/* Floating tags */}
        <div className="hero-tags" style={{ position: 'absolute', top: '22%', right: '6%', background: '#fff', padding: '.6rem .85rem', boxShadow: '0 4px 20px rgba(0,0,0,.07)' }}>
          <strong style={{ display: 'block', fontWeight: 500, fontSize: '.72rem', marginBottom: 2, color: 'var(--ch)' }}>Noir Silk Gown</strong>
          <span style={{ fontSize: '.58rem', color: 'var(--mu)' }}>₹28,500</span>
        </div>
        <div className="hero-tags" style={{ position: 'absolute', bottom: '28%', left: '5%', background: '#fff', padding: '.6rem .85rem', boxShadow: '0 4px 20px rgba(0,0,0,.07)' }}>
          <strong style={{ display: 'block', fontWeight: 500, fontSize: '.72rem', marginBottom: 2, color: 'var(--ch)' }}>Ivory Wool Coat</strong>
          <span style={{ fontSize: '.58rem', color: 'var(--mu)' }}>₹42,000</span>
        </div>

        {/* Large background number */}
        <div className="hero-num" style={{
          position: 'absolute', bottom: '1.5rem', right: '2rem',
          fontFamily: 'var(--fd)', fontSize: '7rem', fontWeight: 300,
          color: 'var(--cr3)', lineHeight: 1, userSelect: 'none',
        }}>25</div>
      </div>
    </section>
  )
}
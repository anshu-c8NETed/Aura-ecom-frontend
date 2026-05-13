import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

// Replace with your own editorial photo
const HERO_IMG = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&auto=format&fit=crop&q=80'
const NEW_ARRIVALS_COUNT = 12

export default function Hero() {
  const containerRef = useRef(null)
  const imgRef       = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Entrance
    tl.from('.hero-eyebrow',  { opacity: 0, y: 10, duration: .6 }, .3)
    tl.from('.hero-word',     { y: '110%', stagger: .1, duration: .85 }, .4)
    tl.from('.hero-desc',     { opacity: 0, y: 12, duration: .65 }, .8)
    tl.from('.hero-cta',      { opacity: 0, y: 12, duration: .6 }, .95)
    tl.from('.hero-scroll',   { opacity: 0, duration: .6 }, 1.2)
    tl.from('.hero-img-wrap', { opacity: 0, scale: 1.04, duration: 1.4, ease: 'power2.out' }, .2)
    tl.from('.hero-tag',      { opacity: 0, y: 8, stagger: .18, duration: .65 }, 1.0)
    tl.from('.hero-arrival-badge', { opacity: 0, x: 10, duration: .5 }, 1.2)

    // Parallax — image scrolls slower than page
    gsap.to(imgRef.current, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="hero-grid">

      {/* ── Left: copy ── */}
      <div style={{
        padding: 'clamp(3rem,6vw,7rem) 5vw clamp(3rem,6vw,7rem)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <span className="hero-eyebrow" style={{
          fontSize: '.56rem',
          letterSpacing: '.3em',
          textTransform: 'uppercase',
          color: 'var(--go)',
          marginBottom: '1.8rem',
          display: 'block',
        }}>
          SS 2025 Collection
        </span>

        <h1 style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(3rem,5.2vw,6.2rem)',
          fontWeight: 300,
          lineHeight: 1.0,
          marginBottom: '2.2rem',
        }}>
          {[
            ['Dressed'],
            ['in', <em key="em" style={{ fontStyle: 'italic', color: 'var(--mu)' }}> Silence</em>],
            ['& Grace'],
          ].map((line, li) => (
            <span key={li} style={{ display: 'block', overflow: 'hidden' }}>
              <span className="hero-word" style={{ display: 'inline-block' }}>{line}</span>
            </span>
          ))}
        </h1>

        <p className="hero-desc" style={{
          fontSize: '.8rem',
          lineHeight: 2,
          color: 'var(--mu)',
          maxWidth: 320,
          marginBottom: '2.8rem',
        }}>
          Pieces that transcend seasons — curated for those who understand that true luxury lies in restraint, not excess.
        </p>

        <div className="hero-cta" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <Link to="/collection">
            <button className="btn-primary"><span>Explore Collection</span></button>
          </Link>
          <button className="btn-ghost">Our Story</button>
        </div>

        <div className="hero-scroll" style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          marginTop: '3.5rem',
        }}>
          <div style={{
            width: 36, height: 1,
            background: 'var(--cr3)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '-100%',
              width: '100%', height: '100%',
              background: 'var(--go)',
              animation: 'shimmer 2.2s 2s infinite',
            }} />
          </div>
          <span style={{
            fontSize: '.54rem',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: 'var(--mu)',
          }}>
            Scroll to Discover
          </span>
        </div>
      </div>

      {/* ── Right: full-bleed editorial photo ── */}
      <div className="hero-right" style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100%',
      }}>
        {/* Parallax image wrapper — taller than container so parallax has room */}
        <div className="hero-img-wrap" ref={imgRef} style={{
          position: 'absolute',
          inset: '-18% 0',
          willChange: 'transform',
        }}>
          <img
            src={HERO_IMG}
            alt="AURA SS 2025 Editorial"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
          {/* Subtle dark vignette at bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '35%',
            background: 'linear-gradient(to top, rgba(26,23,20,0.45), transparent)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* ── Floating product tag — top right ── */}
        <div className="hero-tag" style={{
          position: 'absolute', top: '18%', right: '6%',
          background: 'rgba(250,248,245,0.95)',
          backdropFilter: 'blur(8px)',
          padding: '.7rem 1rem',
          boxShadow: '0 4px 24px rgba(26,23,20,0.1)',
          minWidth: 130,
        }}>
          <span style={{
            display: 'block',
            fontSize: '.5rem',
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--go)',
            marginBottom: '.25rem',
          }}>
            Featured
          </span>
          <strong style={{
            display: 'block',
            fontFamily: 'var(--fd)',
            fontSize: '1rem',
            fontWeight: 400,
            color: 'var(--ch)',
            marginBottom: '.18rem',
          }}>
            Noir Silk Gown
          </strong>
          <span style={{ fontSize: '.72rem', color: 'var(--mu)' }}>₹28,500</span>
        </div>

        {/* ── Second tag — lower left ── */}
        <div className="hero-tag" style={{
          position: 'absolute', bottom: '26%', left: '5%',
          background: 'rgba(250,248,245,0.95)',
          backdropFilter: 'blur(8px)',
          padding: '.7rem 1rem',
          boxShadow: '0 4px 24px rgba(26,23,20,0.1)',
          minWidth: 130,
        }}>
          <span style={{
            display: 'block',
            fontSize: '.5rem',
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--go)',
            marginBottom: '.25rem',
          }}>
            New Arrival
          </span>
          <strong style={{
            display: 'block',
            fontFamily: 'var(--fd)',
            fontSize: '1rem',
            fontWeight: 400,
            color: 'var(--ch)',
            marginBottom: '.18rem',
          }}>
            Ivory Wool Coat
          </strong>
          <span style={{ fontSize: '.72rem', color: 'var(--mu)' }}>₹42,000</span>
        </div>

        {/* ── New arrivals pill badge ── */}
        <div className="hero-arrival-badge" style={{
          position: 'absolute',
          bottom: '1.8rem',
          right: '1.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '.6rem',
          background: 'var(--go)',
          padding: '.5rem .9rem',
        }}>
          <span style={{
            display: 'inline-block',
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'var(--ch)',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: '.52rem',
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: 'var(--ch)',
            fontWeight: 400,
          }}>
            {NEW_ARRIVALS_COUNT} New Arrivals
          </span>
        </div>
      </div>
    </section>
  )
}
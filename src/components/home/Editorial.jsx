import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Replace with your own editorial photo
const EDITORIAL_IMG = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80'

export default function Editorial() {
  const ref = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 65%' }
    })
    tl.from('.ed-label',          { opacity: 0, y: 14, duration: .6 })
    tl.from('.ed-title .ed-word', { y: '110%', stagger: .1, duration: .85, ease: 'power3.out' }, .1)
    tl.from('.ed-body',           { opacity: 0, y: 14, duration: .7 }, .5)
    tl.from('.ed-cta',            { opacity: 0, y: 10, duration: .6 }, .7)
    tl.from('.ed-img',            { opacity: 0, scale: 1.04, duration: 1.3, ease: 'power2.out' }, 0)
  }, { scope: ref })

  return (
    <section
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--ch)',
        color: 'var(--cr)',
        overflow: 'hidden',
        minHeight: 520,
      }}
    >
      {/* ── Left: full-bleed photo ── */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 500 }}>
        <img
          className="ed-img"
          src={EDITORIAL_IMG}
          alt="AURA Editorial"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
        />
        {/* Subtle right-side fade so it blends into the dark content panel */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, transparent 60%, var(--ch) 100%)',
          pointerEvents: 'none',
        }} />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '30%',
          background: 'linear-gradient(to top, rgba(26,23,20,0.6), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Decorative lines */}
        <div style={{
          position: 'absolute', bottom: '1.5rem', left: '1.5rem',
          fontFamily: 'var(--fd)', fontSize: '5rem', fontWeight: 300,
          color: 'rgba(255,255,255,.04)', lineHeight: 1, userSelect: 'none',
        }}>
          AURA
        </div>
      </div>

      {/* ── Right: content ── */}
      <div style={{
        padding: 'clamp(3rem,6vw,7rem) 5vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <span
          className="ed-label"
          style={{
            fontSize: '.58rem',
            letterSpacing: '.28em',
            textTransform: 'uppercase',
            color: 'var(--go)',
            marginBottom: '2rem',
            display: 'block',
          }}
        >
          The Aura Edit
        </span>

        <h2
          className="ed-title"
          style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(2.2rem,4vw,4.5rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: '1.8rem',
          }}
        >
          {[
            'Dressed',
            <span key="line2" style={{ display: 'inline' }}>
              {' for the '}
              <em style={{ fontStyle: 'italic', color: 'rgba(250,248,245,.4)' }}>Rare</em>
            </span>,
            ' Occasion',
          ].map((line, i) => (
            <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
              <span className="ed-word" style={{ display: 'inline-block' }}>{line}</span>
            </span>
          ))}
        </h2>

        <p
          className="ed-body"
          style={{
            fontSize: '.8rem',
            lineHeight: 2,
            color: 'rgba(250,248,245,.5)',
            maxWidth: 360,
            marginBottom: '3rem',
          }}
        >
          The new evening collection draws from the quietude of Parisian ateliers — pieces designed not to be noticed at first glance, but impossible to forget by the end of the evening.
        </p>

        <div
          className="ed-cta"
          style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}
        >
          <button className="btn-outline"><span>Explore the Edit</span></button>
          <button
            style={{
              background: 'none', border: 'none',
              fontFamily: 'var(--fb)', fontSize: '.62rem',
              letterSpacing: '.15em', textTransform: 'uppercase',
              color: 'rgba(250,248,245,.4)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '.6rem',
              transition: 'color .3s, gap .3s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--go)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,248,245,.4)'}
          >
            Read Editorial →
          </button>
        </div>
      </div>
    </section>
  )
}
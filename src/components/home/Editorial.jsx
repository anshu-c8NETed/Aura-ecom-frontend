import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LINES = [
  [
    { text: 'We dress' },
    {
      img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
      alt: 'AURA editorial — silk drape',
    },
    { text: 'people' },
  ],
  [
    { text: 'in' },
    {
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      alt: 'AURA editorial — structured gown',
    },
    { text: 'silence' },
  ],
  [
    { text: '& grace.' },
    {
      img: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&auto=format&fit=crop&q=80',
      alt: 'AURA editorial — ivory coat',
    },
  ],
]

const SLOT_W_TARGET = 220   // px the img-span grows to
const SLOT_H        = 90    // px — height of slot (constant)

export default function Editorial() {
  const ref = useRef(null)

  /* ── Image slot expansion — one ScrollTrigger per line ─────────────── */
  useGSAP(() => {
    ref.current.querySelectorAll('.ed-line').forEach(line => {
      const slot = line.querySelector('.ed-img-slot')
      if (!slot) return

      gsap.fromTo(
        slot,
        { width: 0 },
        {
          width: SLOT_W_TARGET,
          ease: 'none',
          scrollTrigger: {
            trigger: line,
            start: 'top 88%',
            end:   'top 42%',
            scrub: 1,
          },
        }
      )
    })

    /* ── Label + body + CTA entrance ─────────────────────────────────── */
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.ed-body-block', start: 'top 72%' },
    })
    tl.from('.ed-body-label',   { opacity: 0, y: 14, duration: .55 })
    tl.from('.ed-body-text',    { opacity: 0, y: 14, duration: .65 }, .15)
    tl.from('.ed-body-cta',     { opacity: 0, y: 10, duration: .55 }, .3)

  }, { scope: ref })

  return (
    <section
      ref={ref}
      className="section"
      style={{ background: 'var(--cr2)', paddingTop: 'clamp(5rem,9vw,10rem)' }}
    >
      {/* ── Eyebrow ──────────────────────────────────────────────────── */}
      <span className="eyebrow" style={{ marginBottom: '3rem', display: 'block' }}>
        The Aura Edit
      </span>

      {/* ── Headline with inline expanding images ────────────────────── */}
      <div style={{ marginBottom: 'clamp(3rem,6vw,7rem)' }}>
        {LINES.map((chunks, li) => (
          <div
            key={li}
            className="ed-line"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(.6rem,1.5vw,1.4rem)',
              marginBottom: '.4rem',
              flexWrap: 'wrap',
            }}
          >
            {chunks.map((chunk, ci) =>
              chunk.img ? (
                /* ── expanding image slot ── */
                <span
                  key={ci}
                  className="ed-img-slot"
                  style={{
                    display: 'inline-block',
                    height: SLOT_H,
                    width: 0,
                    borderRadius: 6,
                    overflow: 'hidden',
                    position: 'relative',
                    verticalAlign: 'middle',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={chunk.img}
                    alt={chunk.alt}
                    style={{
                      height: '100%',
                      width: SLOT_W_TARGET + 60,    // wider than slot → centred crop
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      borderRadius: 6,
                      display: 'block',
                    }}
                  />
                </span>
              ) : (
                /* ── plain text word ── */
                <span
                  key={ci}
                  style={{
                    fontFamily: 'var(--fd)',
                    fontSize: 'clamp(3rem,6.5vw,7.5rem)',
                    fontWeight: 300,
                    letterSpacing: '-0.025em',
                    lineHeight: 1,
                    color: 'var(--ch)',
                    display: 'inline-block',
                  }}
                >
                  {chunk.text}
                </span>
              )
            )}
          </div>
        ))}
      </div>

      {/* ── Body / CTA block (dark panel) ───────────────────────────── */}
      <div
        className="ed-body-block"
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 'clamp(3rem,6vw,8rem)',
          alignItems: 'start',
          borderTop: '1px solid var(--cr3)',
          paddingTop: 'clamp(2rem,4vw,4rem)',
        }}
      >
        <span className="ed-body-label eyebrow">
          Editorial — SS 2025
        </span>

        <div>
          <p className="ed-body-text" style={{
            fontSize: '.82rem', lineHeight: 2,
            color: 'var(--mu)',
            maxWidth: 480,
            marginBottom: '2.4rem',
          }}>
            The new evening collection draws from the quietude of Parisian
            ateliers — pieces designed not to be noticed at first glance, but
            impossible to forget by the end of the evening.
          </p>

          <div className="ed-body-cta" style={{ display: 'flex', gap: '1.6rem', alignItems: 'center' }}>
            <button className="btn-primary"><span>Explore the Edit</span></button>
            <button
              style={{
                background: 'none', border: 'none',
                fontFamily: 'var(--fb)', fontSize: '.62rem',
                letterSpacing: '.15em', textTransform: 'uppercase',
                color: 'var(--mu)', cursor: 'pointer',
                transition: 'color .3s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--go)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--mu)'}
            >
              Read Editorial →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
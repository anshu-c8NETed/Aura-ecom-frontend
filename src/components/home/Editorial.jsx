import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Editorial() {
  const ref = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 65%' }
    })
    tl.from('.ed-label', { opacity: 0, y: 14, duration: .6 })
    tl.from('.ed-title .ed-word', { y: '110%', stagger: .1, duration: .85, ease: 'power3.out' }, .1)
    tl.from('.ed-body', { opacity: 0, y: 14, duration: .7 }, .5)
    tl.from('.ed-cta', { opacity: 0, y: 10, duration: .6 }, .7)
    tl.from('.ed-fig', { opacity: 0, scale: .94, duration: 1.2, ease: 'power2.out' }, 0)
    tl.from('.ed-deco', { opacity: 0, duration: 1 }, .4)
  }, { scope: ref })

  return (
    <section ref={ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--ch)', color: 'var(--cr)', overflow: 'hidden' }}>
      {/* Visual side */}
      <div style={{ background: '#1E1810', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', minHeight: 500 }}>
        {/* CSS gown figure */}
        <div className="ed-fig" style={{ position: 'relative', width: 170, height: 370 }}>
          <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 46, height: 38, background: '#100C08', borderRadius: '50% 50% 0 0' }} />
          <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 40, height: 50, background: '#C8B898', borderRadius: '50% 50% 46% 46%' }} />
          <div style={{ position: 'absolute', top: 58, left: '50%', transform: 'translateX(-50%)', width: 15, height: 20, background: '#C0B090' }} />
          <div style={{
            position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)',
            width: 148, height: 300,
            background: 'linear-gradient(162deg, #C09458 0%, #9A7438 35%, #7A5420 70%, #5A3408 100%)',
            clipPath: 'polygon(34% 0%,66% 0%,84% 8%,100% 100%,0% 100%,16% 8%)',
          }} />
        </div>

        {/* Decorative lines */}
        <div className="ed-deco" style={{ position: 'absolute', right: '16%', top: '14%', width: 1, height: 80, background: 'rgba(184,149,96,.22)' }} />
        <div className="ed-deco" style={{ position: 'absolute', left: '8%', bottom: '20%', width: 48, height: 1, background: 'rgba(184,149,96,.22)' }} />
        <div className="ed-deco" style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', fontFamily: 'var(--fd)', fontSize: '5rem', fontWeight: 300, color: 'rgba(255,255,255,.03)', lineHeight: 1, userSelect: 'none' }}>
          AURA
        </div>
      </div>

      {/* Content side */}
      <div style={{
        padding: 'clamp(3rem,6vw,7rem) 5vw',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <span className="ed-label" style={{ fontSize: '.58rem', letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '2rem', display: 'block' }}>
          The Aura Edit
        </span>

        <h2 className="ed-title" style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.2rem,4vw,4.5rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '1.8rem' }}>
          {['Dressed', <span key="em" style={{ display: 'inline' }}> for the <em style={{ fontStyle: 'italic', color: 'rgba(250,248,245,.4)' }}>Rare</em></span>, ' Occasion'].map((line, i) => (
            <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
              <span className="ed-word" style={{ display: 'inline-block' }}>{line}</span>
            </span>
          ))}
        </h2>

        <p className="ed-body" style={{ fontSize: '.8rem', lineHeight: 2, color: 'rgba(250,248,245,.5)', maxWidth: 360, marginBottom: '3rem' }}>
          The new evening collection draws from the quietude of Parisian ateliers — pieces designed not to be noticed at first glance, but impossible to forget by the end of the evening.
        </p>

        <div className="ed-cta" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button className="btn-outline"><span>Explore the Edit</span></button>
          <button style={{ background: 'none', border: 'none', fontFamily: 'var(--fb)', fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(250,248,245,.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.6rem', transition: 'color .3s, gap .3s' }}
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
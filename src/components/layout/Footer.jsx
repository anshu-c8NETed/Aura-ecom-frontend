import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import RevealText from '../layout/RevealText'

gsap.registerPlugin(ScrollTrigger)

const col = {
  Shop: [
    ['New Arrivals', '/collection?filter=new'],
    ['Dresses',      '/collection?category=dresses'],
    ['Outerwear',    '/collection?category=outerwear'],
    ['Tailoring',    '/collection?category=tailoring'],
    ['Sale',         '/collection?filter=sale'],
  ],
  'World of Aura': [
    ['About',          '#'],
    ['Editorial',      '#'],
    ['Designers',      '#'],
    ['Sustainability', '#'],
    ['Press',          '#'],
  ],
  Help: [
    ['Contact',   '#'],
    ['Shipping',  '#'],
    ['Returns',   '#'],
    ['Size Guide','#'],
    ['Privacy',   '#'],
  ],
}

export default function Footer() {
  const ref = useRef(null)

  useGSAP(() => {
    // Columns fade in staggered
    gsap.from('.footer-col', {
      opacity: 0, y: 24,
      stagger: 0.1, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
    })

    // Bottom bar slides up
    gsap.from('.footer-bottom', {
      opacity: 0, y: 12, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%', once: true },
    })

    // Oversized ghost AURA text parallax — from App.css .elem h1 inspiration
    gsap.to('.footer-ghost', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end:   'bottom top',
        scrub: 1.5,
      },
    })
  }, { scope: ref })

  return (
    <footer ref={ref} style={{ background: 'var(--ch)', color: 'var(--cr)', position: 'relative', overflow: 'hidden' }}>

      {/* Ghost oversized brand — parallax background element */}
      <div
        className="footer-ghost"
        style={{
          position: 'absolute',
          bottom: '-2rem', left: '5vw',
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(8rem, 20vw, 18rem)',
          fontWeight: 300,
          color: 'rgba(250,248,245,0.03)',
          letterSpacing: '.15em',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        AURA
      </div>

      {/* Main grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
        gap: '3rem',
        padding: 'clamp(3rem,6vw,6rem) 5vw',
        borderBottom: '1px solid rgba(250,248,245,.07)',
        position: 'relative', zIndex: 1,
      }}>

        {/* Brand column */}
        <div className="footer-col">
          <RevealText
            tag="div"
            stagger={0.06}
            start="top 88%"
            style={{
              fontFamily: 'var(--fd)',
              fontSize: '1.8rem',
              letterSpacing: '.3em',
              marginBottom: '1.2rem',
            }}
          >
            AURA
          </RevealText>
          <p style={{ fontSize: '.78rem', lineHeight: 1.9, color: 'rgba(250,248,245,.45)', maxWidth: 260, marginBottom: '1.8rem' }}>
            High fashion curated for the discerning few. Every piece tells a story of craft, elegance, and intention.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['IG', 'PI', 'TK'].map(s => (
              <a key={s} href="#" style={{
                width: 32, height: 32,
                border: '1px solid rgba(250,248,245,.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.55rem', letterSpacing: '.1em',
                color: 'rgba(250,248,245,.5)',
                transition: 'border-color .3s, color .3s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--go)'; e.target.style.color = 'var(--go)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(250,248,245,.15)'; e.target.style.color = 'rgba(250,248,245,.5)' }}
              >{s}</a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(col).map(([title, links]) => (
          <div key={title} className="footer-col">
            <h4 style={{ fontSize: '.6rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(250,248,245,.4)', marginBottom: '1.4rem' }}>
              {title}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
              {links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    to={href}
                    style={{ fontSize: '.78rem', color: 'rgba(250,248,245,.55)', transition: 'color .3s, letter-spacing .3s' }}
                    onMouseEnter={e => { e.target.style.color = 'var(--cr)'; e.target.style.letterSpacing = '.08em' }}
                    onMouseLeave={e => { e.target.style.color = 'rgba(250,248,245,.55)'; e.target.style.letterSpacing = '0' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="footer-bottom"
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.4rem 5vw',
          fontSize: '.58rem', letterSpacing: '.15em', textTransform: 'uppercase',
          color: 'rgba(250,248,245,.25)',
          position: 'relative', zIndex: 1,
        }}
      >
        <span>© {new Date().getFullYear()} AURA. All rights reserved.</span>
        <span>Paris · Milan · London</span>
      </div>
    </footer>
  )
}
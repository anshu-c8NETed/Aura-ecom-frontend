import { Link } from 'react-router-dom'

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
    ['Contact',  '#'],
    ['Shipping', '#'],
    ['Returns',  '#'],
    ['Size Guide','#'],
    ['Privacy',  '#'],
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ch)', color: 'var(--cr)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
        gap: '3rem',
        padding: 'clamp(3rem,6vw,6rem) 5vw',
        borderBottom: '1px solid rgba(250,248,245,.07)',
      }}>
        {/* Brand */}
        <div>
          <div style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', letterSpacing: '.3em', marginBottom: '1.2rem' }}>
            AURA
          </div>
          <p style={{ fontSize: '.78rem', lineHeight: 1.9, color: 'rgba(250,248,245,.45)', maxWidth: 260, marginBottom: '1.8rem' }}>
            High fashion curated for the discerning few. Every piece tells a story of craft, elegance, and intention.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['IG', 'PI', 'TK'].map(s => (
              <a key={s} href="#" style={{
                width: 32, height: 32, border: '1px solid rgba(250,248,245,.15)',
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
          <div key={title}>
            <h4 style={{ fontSize: '.6rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(250,248,245,.4)', marginBottom: '1.4rem' }}>
              {title}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
              {links.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} style={{
                    fontSize: '.78rem', color: 'rgba(250,248,245,.55)',
                    transition: 'color .3s',
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--cr)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(250,248,245,.55)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.4rem 5vw',
        fontSize: '.58rem', letterSpacing: '.15em', textTransform: 'uppercase',
        color: 'rgba(250,248,245,.25)',
      }}>
        <span>© {new Date().getFullYear()} AURA. All rights reserved.</span>
        <span>Paris · Milan · London</span>
      </div>
    </footer>
  )
}
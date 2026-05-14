import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Newsletter() {
  const ref = useRef(null)
  const [email, setEmail]       = useState('')
  const [submitted, setSubmitted] = useState(false)

  useGSAP(() => {
    gsap.from('.nl-content > *', {
      opacity: 0, y: 28, stagger: .14, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 78%' },
    })
  }, { scope: ref })

  const handleSubmit = e => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section ref={ref} style={{
      background: 'var(--cr2)', borderTop: '1px solid var(--bo)', borderBottom: '1px solid var(--bo)',
      padding: 'clamp(3.5rem,7vw,7rem) 5vw',
      display: 'flex', justifyContent: 'center',
    }}>
      <div className="nl-content" style={{ maxWidth: 540, textAlign: 'center' }}>
        <span className="eyebrow">Stay in the Circle</span>
        <h2 className="display-heading" style={{ marginBottom: '1rem' }}>
          The <em>Inner</em> Circle
        </h2>
        <p style={{ fontSize: '.8rem', lineHeight: 1.9, color: 'var(--mu)', marginBottom: '2.4rem' }}>
          Private access to new arrivals, exclusive events, and the stories behind every piece — for those who appreciate the finer details.
        </p>

        {submitted ? (
          <div>
            <p style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', color: 'var(--go)', marginBottom: '.4rem' }}>
              Welcome to the Circle.
            </p>
            <p style={{ fontSize: '.72rem', color: 'var(--mu)', letterSpacing: '.08em' }}>
              Your first letter arrives soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 0, maxWidth: 400, margin: '0 auto' }}>
            <input
              type="email" required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="form-input"
              style={{ flex: 1, borderRight: 'none' }}
            />
            <button type="submit" className="btn-primary" style={{ flexShrink: 0 }}>
              <span>Join</span>
            </button>
          </form>
        )}

        <p style={{ fontSize: '.55rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mu)', marginTop: '1.2rem', opacity: .6 }}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
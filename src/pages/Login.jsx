import { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Eye, EyeOff } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import './auth.css'

const MARQUEE_WORDS = [
  'Noir', 'Dresses', 'Tailoring', 'SS 2025', 'Curated', 'Silk', 'Editorial',
  'Leather', 'Outerwear', 'AURA', 'Collection', 'Origin', 'Runway', 'Refined',
]

function MarqueeRow({ offset = 0 }) {
  const words = [...MARQUEE_WORDS, ...MARQUEE_WORDS]
  return (
    <div className="auth-marquee-row" style={{ marginLeft: offset }}>
      {words.map((w, i) => <span key={i}>{w}</span>)}
    </div>
  )
}

export default function Login() {
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const containerRef             = useRef(null)

  const { login, isLoading } = useAuthStore()
  const navigate              = useNavigate()
  const location              = useLocation()
  const from                  = location.state?.from?.pathname || '/'

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.auth-left',   { opacity: 0, x: -50, duration: 1 }, 0)
    tl.from('.auth-panel',  { opacity: 0, x:  50, duration: 1 }, 0)
    tl.from('.auth-panel > *', { opacity: 0, y: 20, stagger: .1, duration: .75 }, .4)
  }, { scope: containerRef })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div ref={containerRef} className="auth-wrap">

      {/* ── Left: Brand panel ──────────────────────────────────────── */}
      <div className="auth-left auth-left-panel">

        {/* Diagonal background marquee */}
        <div className="auth-marquee-wrap">
          <div className="auth-marquee-track">
            {Array.from({ length: 14 }).map((_, i) => (
              <MarqueeRow key={i} offset={i % 2 === 0 ? 0 : -120} />
            ))}
          </div>
        </div>

        {/* Diagonal rules */}
        <div className="auth-diagonal-rule" style={{ left: '25%' }} />
        <div className="auth-diagonal-rule" style={{ left: '65%' }} />

        {/* Content — above z-index 1 */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 320 }}>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '2.5rem' }}>
            <div style={{ width: 28, height: 1, background: 'rgba(184,149,96,.5)' }} />
            <span style={{ fontSize: '.48rem', letterSpacing: '.32em', textTransform: 'uppercase', color: 'rgba(184,149,96,.7)' }}>
              SS 2025
            </span>
          </div>

          {/* Wordmark */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div
              className="auth-left-panel-wordmark"
              style={{
                fontFamily: 'var(--fd)',
                fontSize: '3.8rem',
                letterSpacing: '.38em',
                color: 'var(--cr)',
                marginBottom: '1.8rem',
                lineHeight: 1,
                fontWeight: 300,
              }}
            >
              AURA
            </div>
          </Link>

          {/* Quote */}
          <div className="auth-left-quote">
            <p style={{
              fontFamily: 'var(--fd)',
              fontSize: '1rem',
              fontStyle: 'italic',
              color: 'rgba(250,248,245,.28)',
              lineHeight: 1.85,
              maxWidth: 270,
              marginBottom: '.8rem',
            }}>
              "Fashion is the armour to survive the reality of everyday life."
            </p>
            <p style={{
              fontSize: '.5rem',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'rgba(250,248,245,.16)',
            }}>
              — Bill Cunningham
            </p>
          </div>

          {/* Bottom rule + season */}
          <div style={{
            position: 'absolute',
            bottom: '-6rem',
            left: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{ width: 40, height: 1, background: 'rgba(250,248,245,.12)' }} />
            <span style={{ fontSize: '.46rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'rgba(250,248,245,.18)' }}>
              The Edit
            </span>
          </div>
        </div>

        {/* CSS fashion figure — hidden on mobile via .auth-left-figure */}
        <div className="auth-left-figure" style={{
          position: 'absolute',
          bottom: '3rem', right: '2rem',
          width: 72, height: 148, zIndex: 2, opacity: 0.55,
        }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 8, height: 36, background: '#1A1008', borderRadius: '0 0 4px 4px' }} />
          <div style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', width: 28, height: 32, background: '#C8B898', borderRadius: '50% 50% 46% 46%' }} />
          <div style={{ position: 'absolute', top: 34, left: '50%', transform: 'translateX(-50%)', width: 10, height: 14, background: '#C0B090' }} />
          <div style={{ position: 'absolute', top: 44, left: '50%', transform: 'translateX(-50%)', width: 42, height: 62, background: 'rgba(184,149,96,.22)', clipPath: 'polygon(18% 0%,82% 0%,88% 100%,12% 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 70, height: 88, background: 'rgba(184,149,96,.12)', clipPath: 'polygon(28% 0%,72% 0%,92% 100%,8% 100%)' }} />
          <div style={{ position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%) translateX(-34px) rotate(14deg)', width: 7, height: 60, background: '#C8B898', borderRadius: 4 }} />
          <div style={{ position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%) translateX(26px) rotate(-10deg)', width: 7, height: 52, background: '#C8B898', borderRadius: 4 }} />
        </div>
      </div>

      {/* ── Right: Form panel ──────────────────────────────────────── */}
      <div className="auth-right-panel">
        <div
          className="auth-panel auth-panel-inner"
          style={{ width: '100%', maxWidth: 400, padding: '0 .5rem' }}
        >

          {/* Heading */}
          <div style={{ marginBottom: '2.8rem' }}>
            <span style={{
              fontSize: '.5rem', letterSpacing: '.28em',
              textTransform: 'uppercase', color: 'var(--mu)',
              display: 'block', marginBottom: '.9rem',
            }}>
              Welcome back
            </span>
            <h1 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2rem,4vw,2.8rem)',
              fontWeight: 300,
              color: 'var(--ch)',
              letterSpacing: '-.02em',
              lineHeight: 1.1,
              margin: 0,
            }}>
              Sign <em>In</em>
            </h1>
            <p style={{
              fontSize: '.75rem',
              color: 'var(--mu)',
              marginTop: '.7rem',
              lineHeight: 1.75,
            }}>
              Access your account, orders, and wishlist.
            </p>
          </div>

          {/* Error */}
          {error && <div className="auth-error">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>

            {/* Email */}
            <div>
              <label className="auth-label">Email Address</label>
              <div className="auth-field">
                <input
                  name="email" type="email" required
                  value={form.email} onChange={handleChange}
                  className="auth-input" placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                <label className="auth-label" style={{ margin: 0 }}>Password</label>
                <button
                  type="button"
                  style={{
                    background: 'none', border: 'none',
                    fontSize: '.5rem', letterSpacing: '.14em',
                    textTransform: 'uppercase', color: 'var(--go)',
                    cursor: 'pointer', fontFamily: 'var(--fb)',
                    padding: 0, transition: 'opacity .2s',
                  }}
                  onMouseEnter={e => e.target.style.opacity = '.65'}
                  onMouseLeave={e => e.target.style.opacity = '1'}
                >
                  Forgot password?
                </button>
              </div>
              <div className="auth-field">
                <input
                  name="password" type={showPass ? 'text' : 'password'} required
                  value={form.password} onChange={handleChange}
                  className="auth-input" placeholder="Min. 8 characters"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPass(v => !v)}
                  style={{ top: '44%' }}
                >
                  {showPass
                    ? <EyeOff size={14} strokeWidth={1.5} />
                    : <Eye    size={14} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="auth-submit" disabled={isLoading}>
              <span>{isLoading ? 'Signing in…' : 'Sign In'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line" />
          </div>

          {/* Footer link */}
          <p style={{ textAlign: 'center', fontSize: '.72rem', color: 'var(--mu)' }}>
            New to AURA?{' '}
            <Link to="/register" className="auth-link">
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
/**
 * Login.jsx
 * Place at: src/pages/Login.jsx  (or src/components/auth/Login.jsx)
 *
 * Improvements over v1:
 *  - Fully responsive (desktop split → mobile stacked)
 *  - Bottom-border input style (luxury minimal)
 *  - Animated left panel: diagonal marquee + grain overlay
 *  - Floating error toast with slide-in
 *  - Input focus micro-animations
 *  - All GSAP logic preserved
 */

import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Eye, EyeOff } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

/* ─── Responsive + component CSS injected once ─────────────────────── */
const AUTH_CSS = `
  .auth-wrap {
    display: grid;
    grid-template-columns: 46% 1fr;
    min-height: 100vh;
  }
  .auth-left-panel {
    position: relative;
    background: var(--ch);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3.5rem 3rem;
    overflow: hidden;
  }
  .auth-right-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2.5rem;
    background: var(--cr);
    overflow-y: auto;
  }

  /* Grain overlay on left panel */
  .auth-left-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.035;
    pointer-events: none;
    z-index: 1;
  }

  /* Diagonal marquee strip */
  .auth-marquee-wrap {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }
  .auth-marquee-track {
    position: absolute;
    top: -30%;
    left: -20%;
    width: 160%;
    display: flex;
    flex-direction: column;
    gap: 2.8rem;
    transform: rotate(-22deg);
    animation: authMarquee 28s linear infinite;
  }
  .auth-marquee-row {
    display: flex;
    gap: 3rem;
    white-space: nowrap;
  }
  .auth-marquee-row span {
    font-family: var(--fd);
    font-size: 1.05rem;
    font-weight: 300;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(250,248,245,0.045);
    user-select: none;
  }
  @keyframes authMarquee {
    0%   { transform: rotate(-22deg) translateY(0); }
    100% { transform: rotate(-22deg) translateY(calc(-50% - 1.4rem)); }
  }

  /* Thin diagonal rule across left panel */
  .auth-diagonal-rule {
    position: absolute;
    width: 1px;
    height: 200%;
    background: rgba(250,248,245,0.05);
    top: -50%;
    transform: rotate(-22deg);
    pointer-events: none;
  }

  /* Form inputs — bottom border style */
  .auth-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--bo);
    border-radius: 0;
    padding: .75rem 2.6rem .75rem 0;
    font-family: var(--fb);
    font-size: .8rem;
    color: var(--ch);
    letter-spacing: .03em;
    outline: none;
    transition: border-color .25s ease;
    box-sizing: border-box;
  }
  .auth-input::placeholder { color: rgba(26,23,20,0.3); }
  .auth-input:focus { border-bottom-color: var(--ch); }

  .auth-label {
    display: block;
    font-size: .52rem;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: var(--mu);
    margin-bottom: .5rem;
    font-family: var(--fb);
  }

  .auth-field { position: relative; }

  .auth-eye-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--mu);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    transition: color .2s;
  }
  .auth-eye-btn:hover { color: var(--ch); }

  .auth-submit {
    width: 100%;
    padding: 1.1rem 1.5rem;
    background: var(--ch);
    color: var(--cr);
    border: none;
    font-family: var(--fb);
    font-size: .6rem;
    letter-spacing: .28em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background .25s ease, transform .15s ease;
    position: relative;
    overflow: hidden;
    margin-top: .5rem;
  }
  .auth-submit::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--go);
    transform: translateX(-101%);
    transition: transform .35s cubic-bezier(.77,0,.18,1);
  }
  .auth-submit:hover::after { transform: translateX(0); }
  .auth-submit:hover { color: var(--ch); }
  .auth-submit span { position: relative; z-index: 1; }
  .auth-submit:disabled { opacity: .6; cursor: not-allowed; }
  .auth-submit:disabled::after { display: none; }

  .auth-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0;
  }
  .auth-divider-line { flex: 1; height: 1px; background: var(--bo); }
  .auth-divider-text { font-size: .5rem; letter-spacing: .2em; text-transform: uppercase; color: var(--mu); }

  .auth-error {
    background: #fdf2f2;
    border-left: 2px solid #c0392b;
    padding: .9rem 1rem;
    margin-bottom: 1.5rem;
    font-size: .7rem;
    color: #c0392b;
    letter-spacing: .03em;
    animation: authErrorIn .3s ease;
  }
  @keyframes authErrorIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-link {
    color: var(--ch);
    text-decoration: none;
    border-bottom: 1px solid var(--bo);
    padding-bottom: 1px;
    transition: border-color .3s;
    font-weight: 400;
  }
  .auth-link:hover { border-color: var(--go); }

  /* Mobile — stack vertically */
  @media (max-width: 767px) {
    .auth-wrap {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
    }
    .auth-left-panel {
      padding: 2.5rem 2rem 2rem;
      min-height: unset;
      align-items: flex-start;
    }
    .auth-left-quote { display: none; }
    .auth-left-figure { display: none; }
    .auth-left-panel-wordmark {
      font-size: 2rem !important;
      margin-bottom: 0.5rem !important;
    }
    .auth-left-tagline {
      font-size: .88rem !important;
      max-width: unset !important;
    }
    .auth-marquee-wrap { display: none; }
    .auth-right-panel {
      padding: 2rem 1.5rem 3rem;
      align-items: flex-start;
    }
    .auth-panel-inner { padding: 0 !important; }
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    .auth-wrap { grid-template-columns: 42% 1fr; }
    .auth-left-panel { padding: 2.5rem 2rem; }
  }
`

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

  /* Inject CSS once */
  useEffect(() => {
    if (document.getElementById('auth-styles')) return
    const tag = document.createElement('style')
    tag.id = 'auth-styles'
    tag.textContent = AUTH_CSS
    document.head.appendChild(tag)
  }, [])

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
import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Eye, EyeOff, Check, ArrowRight } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import './auth.css'

const passwordRules = [
  { label: 'At least 8 characters', test: v => v.length >= 8 },
  { label: 'One uppercase letter',   test: v => /[A-Z]/.test(v) },
  { label: 'One number',             test: v => /\d/.test(v) },
]

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

const BENEFITS = [
  { label: 'Early access to new collections' },
  { label: 'Exclusive member-only pricing' },
  { label: 'Complimentary style consultations' },
  { label: 'Priority shipping on all orders' },
]

export default function Register() {
  const [form, setForm]         = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [error, setError]       = useState('')
  const [agree, setAgree]       = useState(false)
  const containerRef             = useRef(null)

  const { register, isLoading } = useAuthStore()
  const navigate                 = useNavigate()


  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.auth-left',  { opacity: 0, x: -50, duration: 1 }, 0)
    tl.from('.auth-panel', { opacity: 0, x:  50, duration: 1 }, 0)
    tl.from('.auth-panel > *', { opacity: 0, y: 20, stagger: .08, duration: .75 }, .4)
  }, { scope: containerRef })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (!agree) { setError('Please agree to the terms to continue.'); return }
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  const passStrength = passwordRules.filter(r => r.test(form.password)).length
  const strengthColor = passStrength === 1 ? '#c0392b' : passStrength === 2 ? '#b8912a' : 'var(--go)'

  return (
    <div ref={containerRef} className="auth-wrap">

      {/* ── Left: Brand panel ──────────────────────────────────────── */}
      <div className="auth-left auth-left-panel">

        <div className="auth-marquee-wrap">
          <div className="auth-marquee-track">
            {Array.from({ length: 14 }).map((_, i) => (
              <MarqueeRow key={i} offset={i % 2 === 0 ? 0 : -120} />
            ))}
          </div>
        </div>

        <div className="auth-diagonal-rule" style={{ left: '30%' }} />
        <div className="auth-diagonal-rule" style={{ left: '70%' }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 300 }}>

          {/* Season chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '2.5rem' }}>
            <div style={{ width: 28, height: 1, background: 'rgba(184,149,96,.5)' }} />
            <span style={{ fontSize: '.48rem', letterSpacing: '.32em', textTransform: 'uppercase', color: 'rgba(184,149,96,.7)' }}>
              Join AURA
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
                marginBottom: '1.6rem',
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
              "Elegance is not about being noticed, it is about being remembered."
            </p>
            <p style={{
              fontSize: '.5rem',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'rgba(250,248,245,.16)',
              marginBottom: '2.8rem',
            }}>
              — Giorgio Armani
            </p>
          </div>

          {/* Benefits */}
          <div className="auth-left-benefits" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 20, height: 20,
                  border: '1px solid rgba(184,149,96,.3)',
                  background: 'rgba(184,149,96,.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Check size={9} color="var(--go)" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '.65rem', color: 'rgba(250,248,245,.38)', letterSpacing: '.05em', lineHeight: 1.5 }}>
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form panel ──────────────────────────────────────── */}
      <div className="auth-right-panel">
        <div
          className="auth-panel auth-panel-inner"
          style={{ width: '100%', maxWidth: 430, padding: '0 .5rem' }}
        >

          {/* Heading */}
          <div style={{ marginBottom: '2.4rem' }}>
            <span style={{
              fontSize: '.5rem', letterSpacing: '.28em',
              textTransform: 'uppercase', color: 'var(--mu)',
              display: 'block', marginBottom: '.9rem',
            }}>
              Join the Circle
            </span>
            <h1 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.9rem,4vw,2.7rem)',
              fontWeight: 300,
              color: 'var(--ch)',
              letterSpacing: '-.02em',
              lineHeight: 1.1,
              margin: 0,
            }}>
              Create <em>Account</em>
            </h1>
            <p style={{
              fontSize: '.75rem',
              color: 'var(--mu)',
              marginTop: '.7rem',
              lineHeight: 1.75,
            }}>
              Become a member and unlock the world of Aura.
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div>
                <label className="auth-label">First Name</label>
                <div className="auth-field">
                  <input
                    name="firstName" type="text" required
                    value={form.firstName} onChange={handleChange}
                    className="auth-input" placeholder="Jane"
                    autoComplete="given-name"
                  />
                </div>
              </div>
              <div>
                <label className="auth-label">Last Name</label>
                <div className="auth-field">
                  <input
                    name="lastName" type="text" required
                    value={form.lastName} onChange={handleChange}
                    className="auth-input" placeholder="Doe"
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </div>

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

            {/* Password + strength */}
            <div>
              <label className="auth-label">Password</label>
              <div className="auth-field">
                <input
                  name="password" type={showPass ? 'text' : 'password'} required
                  value={form.password} onChange={handleChange}
                  className="auth-input" placeholder="Min. 8 characters"
                  autoComplete="new-password"
                />
                <button type="button" className="auth-eye-btn" style={{ top: '44%' }} onClick={() => setShowPass(v => !v)}>
                  {showPass ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                </button>
              </div>

              {/* Strength */}
              {form.password && (
                <div style={{ marginTop: '.75rem' }}>
                  {/* Bar */}
                  <div style={{ display: 'flex', gap: '.2rem', marginBottom: '.55rem' }}>
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: 2,
                          background: i < passStrength ? strengthColor : 'var(--bo)',
                          transition: 'background .3s ease',
                        }}
                      />
                    ))}
                  </div>
                  {/* Rules */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {passwordRules.map(r => {
                      const ok = r.test(form.password)
                      return (
                        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                          <div style={{
                            width: 9, height: 9,
                            borderRadius: '50%',
                            background: ok ? 'var(--go)' : 'var(--bo)',
                            flexShrink: 0,
                            transition: 'background .25s',
                          }} />
                          <span style={{ fontSize: '.58rem', color: ok ? 'var(--ch)' : 'var(--mu)', transition: 'color .25s' }}>
                            {r.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="auth-label">Confirm Password</label>
              <div className="auth-field">
                <input
                  name="confirm" type={showConf ? 'text' : 'password'} required
                  value={form.confirm} onChange={handleChange}
                  className="auth-input" placeholder="Repeat password"
                  autoComplete="new-password"
                  style={{
                    borderBottomColor:
                      form.confirm && form.confirm !== form.password
                        ? '#c0392b'
                        : undefined,
                  }}
                />
                <button type="button" className="auth-eye-btn" style={{ top: '44%' }} onClick={() => setShowConf(v => !v)}>
                  {showConf ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: '.58rem', color: '#c0392b', marginTop: '.35rem', letterSpacing: '.02em' }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '.8rem', cursor: 'pointer' }}>
              <div
                onClick={() => setAgree(v => !v)}
                style={{
                  width: 17, height: 17, flexShrink: 0, marginTop: 1,
                  border: `1px solid ${agree ? 'var(--ch)' : 'var(--bo)'}`,
                  background: agree ? 'var(--ch)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .22s ease', cursor: 'pointer',
                }}
              >
                {agree && <Check size={9} color="var(--cr)" strokeWidth={2.5} />}
              </div>
              <span style={{ fontSize: '.66rem', color: 'var(--mu)', lineHeight: 1.65 }}>
                I agree to AURA's{' '}
                <a href="#" className="auth-link">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="auth-link">Privacy Policy</a>
              </span>
            </label>

            {/* Submit */}
            <button type="submit" className="auth-submit" disabled={isLoading}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem' }}>
                {isLoading ? 'Creating account…' : (
                  <>
                    Create Account
                    <ArrowRight size={13} strokeWidth={1.8} />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer link */}
          <p style={{ textAlign: 'center', fontSize: '.72rem', color: 'var(--mu)', marginTop: '2rem' }}>
            Already a member?{' '}
            <Link to="/login" className="auth-link">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
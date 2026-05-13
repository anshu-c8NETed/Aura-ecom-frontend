import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Eye, EyeOff, Check } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

const passwordRules = [
  { label: 'At least 8 characters', test: v => v.length >= 8 },
  { label: 'One uppercase letter',   test: v => /[A-Z]/.test(v) },
  { label: 'One number',             test: v => /\d/.test(v) },
]

export default function Register() {
  const [form, setForm]         = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [error, setError]         = useState('')
  const [agree, setAgree]         = useState(false)
  const containerRef               = useRef(null)

  const { register, isLoading } = useAuthStore()
  const navigate                  = useNavigate()

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.auth-left',  { opacity: 0, x: -40, duration: .9 }, 0)
    tl.from('.auth-panel', { opacity: 0, x:  40, duration: .9 }, 0)
    tl.from('.auth-panel > *', { opacity: 0, y: 18, stagger: .09, duration: .7 }, .35)
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

  return (
    <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

      {/* Left — brand */}
      <div className="auth-left" style={{
        background: 'var(--ch)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '3rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', border: '1px solid rgba(250,248,245,.04)', top: -80, left: -80 }} />
        <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', border: '1px solid rgba(250,248,245,.04)', bottom: 40, right: -40 }} />

        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--fd)', fontSize: '3rem', letterSpacing: '.35em', color: 'var(--cr)', marginBottom: '1.5rem', textAlign: 'center' }}>
            AURA
          </div>
        </Link>

        <p style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(250,248,245,.35)', textAlign: 'center', lineHeight: 1.7, maxWidth: 280 }}>
          "Elegance is not about being noticed, it's about being remembered."
        </p>
        <p style={{ fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(250,248,245,.2)', marginTop: '.8rem' }}>
          — Giorgio Armani
        </p>

        {/* Benefits list */}
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 280 }}>
          {[
            'Early access to new collections',
            'Exclusive member-only pricing',
            'Complimentary style consultations',
            'Priority shipping on all orders',
          ].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <div style={{ width: 18, height: 18, background: 'rgba(184,149,96,.15)', border: '1px solid rgba(184,149,96,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={9} color="var(--go)" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '.68rem', color: 'rgba(250,248,245,.4)', letterSpacing: '.06em' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--cr)', overflowY: 'auto' }}>
        <div className="auth-panel" style={{ width: '100%', maxWidth: 420, padding: '1rem 0' }}>

          <span className="eyebrow">Join the Circle</span>
          <h1 className="display-heading" style={{ marginBottom: '.6rem' }}>Create <em>Account</em></h1>
          <p style={{ fontSize: '.78rem', color: 'var(--mu)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Become a member and unlock the world of Aura.
          </p>

          {error && (
            <div style={{ background: '#fdf2f2', border: '1px solid #f5c6c6', padding: '.85rem 1rem', marginBottom: '1.5rem', fontSize: '.72rem', color: '#c0392b', letterSpacing: '.04em' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem' }}>
              <div>
                <label className="form-label">First Name</label>
                <input name="firstName" type="text" required value={form.firstName} onChange={handleChange} className="form-input" placeholder="Jane" autoComplete="given-name" />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input name="lastName" type="text" required value={form.lastName} onChange={handleChange} className="form-input" placeholder="Doe" autoComplete="family-name" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} className="form-input" placeholder="you@example.com" autoComplete="email" />
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPass ? 'text' : 'password'} required value={form.password} onChange={handleChange} className="form-input" placeholder="Min. 8 characters" autoComplete="new-password" style={{ paddingRight: '2.8rem' }} />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: '.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer', display: 'flex' }}>
                  {showPass ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>

              {/* Strength indicator */}
              {form.password && (
                <div style={{ marginTop: '.6rem' }}>
                  <div style={{ display: 'flex', gap: '.25rem', marginBottom: '.4rem' }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ flex: 1, height: 2, background: i < passStrength ? (passStrength === 1 ? '#c0392b' : passStrength === 2 ? 'var(--go2)' : 'var(--go)') : 'var(--bo)', transition: 'background .3s' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
                    {passwordRules.map(r => (
                      <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.test(form.password) ? 'var(--go)' : 'var(--cr3)', transition: 'background .3s', flexShrink: 0 }} />
                        <span style={{ fontSize: '.6rem', color: r.test(form.password) ? 'var(--ch)' : 'var(--mu)' }}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input name="confirm" type={showConf ? 'text' : 'password'} required value={form.confirm} onChange={handleChange} className="form-input" placeholder="Repeat password" autoComplete="new-password"
                  style={{ paddingRight: '2.8rem', borderColor: form.confirm && form.confirm !== form.password ? '#c0392b' : undefined }}
                />
                <button type="button" onClick={() => setShowConf(v => !v)} style={{ position: 'absolute', right: '.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer', display: 'flex' }}>
                  {showConf ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: '.6rem', color: '#c0392b', marginTop: '.3rem' }}>Passwords do not match</p>
              )}
            </div>

            {/* Terms */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '.7rem', cursor: 'pointer' }}>
              <div onClick={() => setAgree(v => !v)} style={{
                width: 16, height: 16, border: `1px solid ${agree ? 'var(--ch)' : 'var(--bo)'}`,
                background: agree ? 'var(--ch)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 2, cursor: 'pointer', transition: 'all .2s',
              }}>
                {agree && <Check size={9} color="var(--cr)" strokeWidth={2.5} />}
              </div>
              <span style={{ fontSize: '.68rem', color: 'var(--mu)', lineHeight: 1.6 }}>
                I agree to AURA's{' '}
                <a href="#" style={{ color: 'var(--ch)', borderBottom: '1px solid var(--bo)' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={{ color: 'var(--ch)', borderBottom: '1px solid var(--bo)' }}>Privacy Policy</a>
              </span>
            </label>

            {/* Submit */}
            <button type="submit" className="btn-primary" disabled={isLoading}
              style={{ width: '100%', padding: '1.05rem', marginTop: '.3rem', opacity: isLoading ? .7 : 1 }}
            >
              <span>{isLoading ? 'Creating account…' : 'Create Account'}</span>
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '.72rem', color: 'var(--mu)', marginTop: '1.8rem' }}>
            Already a member?{' '}
            <Link to="/login" style={{ color: 'var(--ch)', textDecoration: 'none', fontWeight: 400, borderBottom: '1px solid var(--bo)', paddingBottom: '1px', transition: 'border-color .3s' }}
              onMouseEnter={e => e.target.style.borderColor = 'var(--go)'}
              onMouseLeave={e => e.target.style.borderColor = 'var(--bo)'}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
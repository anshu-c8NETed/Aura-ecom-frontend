import { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Eye, EyeOff } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError]     = useState('')
  const containerRef           = useRef(null)

  const { login, isLoading } = useAuthStore()
  const navigate              = useNavigate()
  const location              = useLocation()
  const from                  = location.state?.from?.pathname || '/'

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.auth-left',  { opacity: 0, x: -40, duration: .9 }, 0)
    tl.from('.auth-panel', { opacity: 0, x:  40, duration: .9 }, 0)
    tl.from('.auth-panel > *', { opacity: 0, y: 18, stagger: .1, duration: .7 }, .35)
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
    <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

      {/* Left — brand panel */}
      <div className="auth-left" style={{
        background: 'var(--ch)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '3rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(250,248,245,.04)', top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(250,248,245,.04)', bottom: 60, left: -60 }} />

        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--fd)', fontSize: '3rem', letterSpacing: '.35em', color: 'var(--cr)', marginBottom: '1.5rem', textAlign: 'center' }}>
            AURA
          </div>
        </Link>

        <p style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(250,248,245,.35)', textAlign: 'center', lineHeight: 1.7, maxWidth: 280 }}>
          "Fashion is the armour to survive the reality of everyday life."
        </p>
        <p style={{ fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(250,248,245,.2)', marginTop: '.8rem' }}>
          — Bill Cunningham
        </p>

        {/* CSS figure */}
        <div style={{ marginTop: '3rem', position: 'relative', width: 90, height: 180 }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 10, height: 44, background: '#1A1008', borderRadius: '0 0 5px 5px' }} />
          <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 34, height: 40, background: '#C8B898', borderRadius: '50% 50% 46% 46%' }} />
          <div style={{ position: 'absolute', top: 42, left: '50%', transform: 'translateX(-50%)', width: 13, height: 18, background: '#C0B090' }} />
          <div style={{ position: 'absolute', top: 55, left: '50%', transform: 'translateX(-50%)', width: 50, height: 75, background: 'rgba(184,149,96,.25)', clipPath: 'polygon(18% 0%,82% 0%,88% 100%,12% 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 88, height: 115, background: 'rgba(184,149,96,.15)', clipPath: 'polygon(28% 0%,72% 0%,92% 100%,8% 100%)' }} />
          <div style={{ position: 'absolute', top: 62, left: '50%', transform: 'translateX(-50%) translateX(-42px) rotate(14deg)', width: 9, height: 76, background: '#C8B898', borderRadius: 5 }} />
          <div style={{ position: 'absolute', top: 62, left: '50%', transform: 'translateX(-50%) translateX(32px) rotate(-10deg)', width: 9, height: 64, background: '#C8B898', borderRadius: 5 }} />
        </div>
      </div>

      {/* Right — form panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', background: 'var(--cr)' }}>
        <div className="auth-panel" style={{ width: '100%', maxWidth: 380 }}>

          <span className="eyebrow">Welcome back</span>
          <h1 className="display-heading" style={{ marginBottom: '.6rem' }}>Sign <em>In</em></h1>
          <p style={{ fontSize: '.78rem', color: 'var(--mu)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Access your account, orders, and wishlist.
          </p>

          {error && (
            <div style={{ background: '#fdf2f2', border: '1px solid #f5c6c6', padding: '.85rem 1rem', marginBottom: '1.5rem', fontSize: '.72rem', color: '#c0392b', letterSpacing: '.04em' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <input
                name="email" type="email" required
                value={form.email} onChange={handleChange}
                className="form-input" placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <button type="button" style={{ background: 'none', border: 'none', fontSize: '.58rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--go)', cursor: 'pointer', fontFamily: 'var(--fb)' }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  name="password" type={showPass ? 'text' : 'password'} required
                  value={form.password} onChange={handleChange}
                  className="form-input" placeholder="Min. 8 characters"
                  autoComplete="current-password"
                  style={{ paddingRight: '2.8rem' }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{
                  position: 'absolute', right: '.8rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer', display: 'flex',
                }}>
                  {showPass ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary" disabled={isLoading}
              style={{ width: '100%', padding: '1.05rem', marginTop: '.4rem', opacity: isLoading ? .7 : 1 }}
            >
              <span>{isLoading ? 'Signing in…' : 'Sign In'}</span>
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--bo)' }} />
            <span style={{ fontSize: '.55rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mu)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--bo)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '.72rem', color: 'var(--mu)' }}>
            New to AURA?{' '}
            <Link to="/register" style={{ color: 'var(--ch)', textDecoration: 'none', fontWeight: 400, borderBottom: '1px solid var(--bo)', paddingBottom: '1px', transition: 'border-color .3s' }}
              onMouseEnter={e => e.target.style.borderColor = 'var(--go)'}
              onMouseLeave={e => e.target.style.borderColor = 'var(--bo)'}
            >
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
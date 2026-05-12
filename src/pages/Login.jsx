import { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import api from '../api/axios'

/* ─── Shared input style (mirrors Checkout.jsx) ──────────────── */
const inputStyle = (err) => ({
  width: '100%',
  padding: '.8rem 1rem .8rem 2.6rem',
  border: `1px solid ${err ? '#c0392b' : 'var(--bo)'}`,
  background: 'var(--cr)',
  fontFamily: 'var(--fb)',
  fontSize: '.75rem',
  color: 'var(--ch)',
  outline: 'none',
  transition: 'border-color .2s',
  boxSizing: 'border-box',
  letterSpacing: '.04em',
})

const labelStyle = {
  display: 'block',
  fontSize: '.58rem',
  letterSpacing: '.16em',
  textTransform: 'uppercase',
  color: 'var(--mu)',
  marginBottom: '.4rem',
}

/* ─── Decorative side figure ─────────────────────────────────── */
function SideFigure() {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Ambient gradient blob */}
      <div style={{
        position: 'absolute',
        width: '70%', height: '70%',
        background: 'radial-gradient(ellipse at 60% 40%, rgba(180,155,110,.18) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />
      {/* Thin frame lines */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%', border: '1px solid rgba(180,155,110,.18)' }} />
      <div style={{ position: 'absolute', top: '14%', left: '14%', right: '14%', bottom: '14%', border: '1px solid rgba(180,155,110,.1)' }} />

      {/* Typography art */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(5rem,9vw,9rem)',
          fontWeight: 300,
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(180,155,110,.22)',
          letterSpacing: '.15em',
          userSelect: 'none',
        }}>
          AURA
        </p>
        <p style={{
          fontSize: '.52rem',
          letterSpacing: '.38em',
          textTransform: 'uppercase',
          color: 'rgba(180,155,110,.45)',
          marginTop: '.6rem',
        }}>
          Luxury Fashion House
        </p>
      </div>

      {/* Corner marks */}
      {[
        { top: '8%', left: '8%', borderTop: '1px solid rgba(180,155,110,.3)', borderLeft: '1px solid rgba(180,155,110,.3)' },
        { top: '8%', right: '8%', borderTop: '1px solid rgba(180,155,110,.3)', borderRight: '1px solid rgba(180,155,110,.3)' },
        { bottom: '8%', left: '8%', borderBottom: '1px solid rgba(180,155,110,.3)', borderLeft: '1px solid rgba(180,155,110,.3)' },
        { bottom: '8%', right: '8%', borderBottom: '1px solid rgba(180,155,110,.3)', borderRight: '1px solid rgba(180,155,110,.3)' },
      ].map((style, i) => (
        <div key={i} style={{ position: 'absolute', width: 24, height: 24, ...style }} />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuthStore()

  const [form,        setForm]        = useState({ email: '', password: '' })
  const [errors,      setErrors]      = useState({})
  const [showPass,    setShowPass]    = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [serverError, setServerError] = useState('')

  const containerRef = useRef(null)
  const formRef      = useRef(null)

  /* ── GSAP entrance ── */
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.login-side',  { opacity: 0, x: -30, duration: .9 }, 0)
    tl.from('.login-panel', { opacity: 0, x: 30,  duration: .9 }, 0)
    tl.from('.login-el',    { opacity: 0, y: 16, stagger: .09, duration: .6 }, .3)
  }, { scope: containerRef })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  /* ── Validation ── */
  function validate() {
    const e = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email    = 'Valid email required'
    if (form.password.length < 6)                          e.password = 'At least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setServerError('')
    setSubmitting(true)
    try {
      const { data } = await api.post('/auth/login', {
        email:    form.email,
        password: form.password,
      })
      // Store user + token via auth store
      login(data?.data?.user || data?.data, data?.data?.token || data?.token)
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password'
      setServerError(msg)
      /* Shake animation */
      gsap.fromTo(formRef.current,
        { x: -8 }, { x: 0, duration: .45, ease: 'elastic.out(1, .4)' }
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div ref={containerRef} style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>

      {/* ── Left: decorative side ── */}
      <div className="login-side" style={{
        position: 'relative',
        background: 'var(--cr2)',
        borderRight: '1px solid var(--bo)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <SideFigure />
      </div>

      {/* ── Right: form panel ── */}
      <div className="login-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(3rem,8vw,6rem) clamp(2.5rem,6vw,5rem)',
        background: 'var(--cr)',
        minHeight: '100vh',
      }}>
        {/* Logo */}
        <Link to="/" className="login-el" style={{
          fontFamily: 'var(--fd)',
          fontSize: '1.1rem',
          fontWeight: 300,
          letterSpacing: '.35em',
          textTransform: 'uppercase',
          color: 'var(--ch)',
          textDecoration: 'none',
          marginBottom: '3.5rem',
          display: 'inline-block',
        }}>
          AURA
        </Link>

        {/* Heading */}
        <div className="login-el" style={{ marginBottom: '2.5rem' }}>
          <span style={{
            fontSize: '.52rem',
            letterSpacing: '.28em',
            textTransform: 'uppercase',
            color: 'var(--go)',
            display: 'block',
            marginBottom: '.6rem',
          }}>
            Welcome Back
          </span>
          <h1 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(1.8rem,3vw,2.6rem)',
            fontWeight: 300,
            lineHeight: 1.1,
          }}>
            Sign in to your<br /><em>account</em>
          </h1>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="login-el" style={{
            padding: '.8rem 1rem',
            border: '1px solid #c0392b',
            marginBottom: '1.4rem',
            fontSize: '.68rem',
            color: '#c0392b',
            letterSpacing: '.05em',
            background: 'rgba(192,57,43,.04)',
          }}>
            {serverError}
          </div>
        )}

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

          {/* Email */}
          <div className="login-el" style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={13} strokeWidth={1.5} color={errors.email ? '#c0392b' : 'var(--mu)'}
                style={{ position: 'absolute', left: '.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="email"
                placeholder="priya@example.com"
                value={form.email}
                onChange={set('email')}
                style={inputStyle(errors.email)}
                onFocus={e  => e.target.style.borderColor = 'var(--go)'}
                onBlur={e   => e.target.style.borderColor = errors.email ? '#c0392b' : 'var(--bo)'}
              />
            </div>
            {errors.email && (
              <span style={{ fontSize: '.58rem', color: '#c0392b', marginTop: '.3rem' }}>{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="login-el" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{
                fontSize: '.55rem', letterSpacing: '.1em', textTransform: 'uppercase',
                color: 'var(--mu)', textDecoration: 'none', transition: 'color .2s',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--ch)'}
                onMouseLeave={e => e.target.style.color = 'var(--mu)'}
              >
                Forgot?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={13} strokeWidth={1.5} color={errors.password ? '#c0392b' : 'var(--mu)'}
                style={{ position: 'absolute', left: '.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                style={{ ...inputStyle(errors.password), paddingRight: '2.8rem' }}
                onFocus={e  => e.target.style.borderColor = 'var(--go)'}
                onBlur={e   => e.target.style.borderColor = errors.password ? '#c0392b' : 'var(--bo)'}
              />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{
                position: 'absolute', right: '.9rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: 'var(--mu)', display: 'flex',
              }}>
                {showPass ? <EyeOff size={13} strokeWidth={1.5} /> : <Eye size={13} strokeWidth={1.5} />}
              </button>
            </div>
            {errors.password && (
              <span style={{ fontSize: '.58rem', color: '#c0392b', marginTop: '.3rem' }}>{errors.password}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="login-el btn-primary"
            style={{
              padding: '1.1rem',
              opacity: submitting ? .65 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
              marginTop: '.4rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
            }}
          >
            <span>{submitting ? 'Signing In…' : 'Sign In'}</span>
            {!submitting && <ArrowRight size={14} strokeWidth={1.5} />}
          </button>
        </form>

        {/* Divider */}
        <div className="login-el" style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          margin: '2rem 0',
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--bo)' }} />
          <span style={{ fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mu)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--bo)' }} />
        </div>

        {/* Register CTA */}
        <p className="login-el" style={{ fontSize: '.7rem', color: 'var(--mu)', textAlign: 'center' }}>
          New to AURA?{' '}
          <Link to="/register" style={{
            color: 'var(--ch)', textDecoration: 'none',
            fontFamily: 'var(--fb)', letterSpacing: '.06em',
            borderBottom: '1px solid var(--bo)', paddingBottom: '.1rem',
            transition: 'border-color .2s',
          }}
            onMouseEnter={e => e.target.style.borderColor = 'var(--ch)'}
            onMouseLeave={e => e.target.style.borderColor = 'var(--bo)'}
          >
            Create an account
          </Link>
        </p>

        {/* Trust note */}
        <div className="login-el" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '.4rem', marginTop: '2.5rem',
        }}>
          <Lock size={10} strokeWidth={1.5} color="var(--mu)" />
          <span style={{ fontSize: '.55rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mu)' }}>
            Secured with 256-bit encryption
          </span>
        </div>
      </div>
    </div>
  )
}
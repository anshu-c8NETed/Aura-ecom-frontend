import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Lock, Mail, Eye, EyeOff, User, ArrowRight, Phone } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import api from '../api/axios'

/* ─── Shared styles (mirrors Login / Checkout) ───────────────── */
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

function Field({ label, error, icon: Icon, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={13} strokeWidth={1.5} color={error ? '#c0392b' : 'var(--mu)'}
            style={{ position: 'absolute', left: '.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        )}
        {children}
      </div>
      {error && <span style={{ fontSize: '.58rem', color: '#c0392b', marginTop: '.3rem' }}>{error}</span>}
    </div>
  )
}

/* ─── Decorative side figure (mirrored from Login) ───────────── */
function SideFigure() {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute',
        width: '70%', height: '70%',
        background: 'radial-gradient(ellipse at 40% 60%, rgba(180,155,110,.18) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />
      <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%', border: '1px solid rgba(180,155,110,.18)' }} />
      <div style={{ position: 'absolute', top: '14%', left: '14%', right: '14%', bottom: '14%', border: '1px solid rgba(180,155,110,.1)' }} />

      <div style={{ position: 'relative', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(4rem,7vw,7.5rem)',
          fontWeight: 300,
          lineHeight: 1.1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(180,155,110,.22)',
          letterSpacing: '.12em',
          userSelect: 'none',
        }}>
          Join<br /><em>AURA</em>
        </p>
        <p style={{
          fontSize: '.5rem',
          letterSpacing: '.34em',
          textTransform: 'uppercase',
          color: 'rgba(180,155,110,.4)',
          marginTop: '.8rem',
        }}>
          Exclusive Membership
        </p>
      </div>

      {[
        { top: '8%',    left: '8%',   borderTop: '1px solid rgba(180,155,110,.3)', borderLeft:  '1px solid rgba(180,155,110,.3)' },
        { top: '8%',    right: '8%',  borderTop: '1px solid rgba(180,155,110,.3)', borderRight: '1px solid rgba(180,155,110,.3)' },
        { bottom: '8%', left: '8%',   borderBottom: '1px solid rgba(180,155,110,.3)', borderLeft:  '1px solid rgba(180,155,110,.3)' },
        { bottom: '8%', right: '8%',  borderBottom: '1px solid rgba(180,155,110,.3)', borderRight: '1px solid rgba(180,155,110,.3)' },
      ].map((style, i) => (
        <div key={i} style={{ position: 'absolute', width: 24, height: 24, ...style }} />
      ))}
    </div>
  )
}

/* ─── Password strength meter ────────────────────────────────── */
function PasswordStrength({ password }) {
  const score = (() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 8)          s++
    if (/[A-Z]/.test(password))        s++
    if (/[0-9]/.test(password))        s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  })()

  if (!password) return null

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#c0392b', '#e67e22', '#d4ac0d', 'var(--go)']

  return (
    <div style={{ marginTop: '.5rem' }}>
      <div style={{ display: 'flex', gap: '.2rem', marginBottom: '.3rem' }}>
        {[1, 2, 3, 4].map(n => (
          <div key={n} style={{
            flex: 1, height: 2,
            background: n <= score ? colors[score] : 'var(--bo)',
            transition: 'background .3s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: '.55rem', letterSpacing: '.1em', color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   REGISTER PAGE
═══════════════════════════════════════════════════════════════ */
const EMPTY = {
  firstName: '', lastName: '', email: '',
  phone: '', password: '', confirmPassword: '',
}

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [form,        setForm]        = useState(EMPTY)
  const [errors,      setErrors]      = useState({})
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [serverError, setServerError] = useState('')
  const [agreed,      setAgreed]      = useState(false)

  const containerRef = useRef(null)
  const formRef      = useRef(null)

  /* ── GSAP entrance ── */
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.reg-side',  { opacity: 0, x: 30,  duration: .9 }, 0)
    tl.from('.reg-panel', { opacity: 0, x: -30, duration: .9 }, 0)
    tl.from('.reg-el',    { opacity: 0, y: 16, stagger: .08, duration: .6 }, .3)
  }, { scope: containerRef })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  /* ── Validation ── */
  function validate() {
    const e = {}
    if (!form.firstName.trim())                               e.firstName       = 'Required'
    if (!form.lastName.trim())                                e.lastName        = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))     e.email           = 'Valid email required'
    if (form.phone && !form.phone.replace(/\D/,'').match(/^\d{10}$/))
                                                              e.phone           = 'Valid 10-digit number'
    if (form.password.length < 8)                             e.password        = 'At least 8 characters'
    if (form.password !== form.confirmPassword)               e.confirmPassword = 'Passwords do not match'
    if (!agreed)                                              e.agreed          = 'Please accept the terms'
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
      const { data } = await api.post('/auth/register', {
        name:     `${form.firstName.trim()} ${form.lastName.trim()}`,
        email:    form.email,
        password: form.password,
        phone:    form.phone || undefined,
      })
      login(data?.data?.user || data?.data, data?.data?.token || data?.token)
      navigate('/', { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.'
      setServerError(msg)
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
      /* Form on left, art on right — opposite of Login for visual variety */
      gridTemplateColumns: '1fr 1fr',
    }}>

      {/* ── Left: form panel ── */}
      <div className="reg-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(2.5rem,6vw,4.5rem) clamp(2.5rem,6vw,5rem)',
        background: 'var(--cr)',
        minHeight: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <Link to="/" className="reg-el" style={{
          fontFamily: 'var(--fd)',
          fontSize: '1.1rem',
          fontWeight: 300,
          letterSpacing: '.35em',
          textTransform: 'uppercase',
          color: 'var(--ch)',
          textDecoration: 'none',
          marginBottom: '2.8rem',
          display: 'inline-block',
        }}>
          AURA
        </Link>

        {/* Heading */}
        <div className="reg-el" style={{ marginBottom: '2rem' }}>
          <span style={{
            fontSize: '.52rem',
            letterSpacing: '.28em',
            textTransform: 'uppercase',
            color: 'var(--go)',
            display: 'block',
            marginBottom: '.6rem',
          }}>
            Create Account
          </span>
          <h1 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(1.6rem,2.8vw,2.4rem)',
            fontWeight: 300,
            lineHeight: 1.1,
          }}>
            Join the world of<br /><em>AURA</em>
          </h1>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="reg-el" style={{
            padding: '.8rem 1rem',
            border: '1px solid #c0392b',
            marginBottom: '1.2rem',
            fontSize: '.68rem',
            color: '#c0392b',
            letterSpacing: '.05em',
            background: 'rgba(192,57,43,.04)',
          }}>
            {serverError}
          </div>
        )}

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Name row */}
          <div className="reg-el" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem' }}>
            <Field label="First Name" error={errors.firstName} icon={User}>
              <input
                value={form.firstName} onChange={set('firstName')}
                style={inputStyle(errors.firstName)} placeholder="Priya"
                onFocus={e  => e.target.style.borderColor = 'var(--go)'}
                onBlur={e   => e.target.style.borderColor = errors.firstName ? '#c0392b' : 'var(--bo)'}
              />
            </Field>
            <Field label="Last Name" error={errors.lastName}>
              {/* No icon on last name — space-constrained */}
              <input
                value={form.lastName} onChange={set('lastName')}
                style={{ ...inputStyle(errors.lastName), paddingLeft: '1rem' }}
                placeholder="Sharma"
                onFocus={e  => e.target.style.borderColor = 'var(--go)'}
                onBlur={e   => e.target.style.borderColor = errors.lastName ? '#c0392b' : 'var(--bo)'}
              />
            </Field>
          </div>

          {/* Email */}
          <div className="reg-el">
            <Field label="Email Address" error={errors.email} icon={Mail}>
              <input
                type="email" value={form.email} onChange={set('email')}
                style={inputStyle(errors.email)} placeholder="priya@example.com"
                onFocus={e  => e.target.style.borderColor = 'var(--go)'}
                onBlur={e   => e.target.style.borderColor = errors.email ? '#c0392b' : 'var(--bo)'}
              />
            </Field>
          </div>

          {/* Phone (optional) */}
          <div className="reg-el">
            <Field label="Phone (Optional)" error={errors.phone} icon={Phone}>
              <input
                type="tel" value={form.phone} onChange={set('phone')}
                style={inputStyle(errors.phone)} placeholder="+91 98765 43210"
                onFocus={e  => e.target.style.borderColor = 'var(--go)'}
                onBlur={e   => e.target.style.borderColor = errors.phone ? '#c0392b' : 'var(--bo)'}
              />
            </Field>
          </div>

          {/* Password */}
          <div className="reg-el">
            <Field label="Password" error={errors.password} icon={Lock}>
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password} onChange={set('password')}
                style={{ ...inputStyle(errors.password), paddingRight: '2.8rem' }}
                placeholder="Minimum 8 characters"
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
            </Field>
            <PasswordStrength password={form.password} />
          </div>

          {/* Confirm password */}
          <div className="reg-el">
            <Field label="Confirm Password" error={errors.confirmPassword} icon={Lock}>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword} onChange={set('confirmPassword')}
                style={{ ...inputStyle(errors.confirmPassword), paddingRight: '2.8rem' }}
                placeholder="Repeat password"
                onFocus={e  => e.target.style.borderColor = 'var(--go)'}
                onBlur={e   => e.target.style.borderColor = errors.confirmPassword ? '#c0392b' : 'var(--bo)'}
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)} style={{
                position: 'absolute', right: '.9rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: 'var(--mu)', display: 'flex',
              }}>
                {showConfirm ? <EyeOff size={13} strokeWidth={1.5} /> : <Eye size={13} strokeWidth={1.5} />}
              </button>
            </Field>
          </div>

          {/* Terms */}
          <div className="reg-el" style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '.7rem', cursor: 'pointer' }}>
              <div
                onClick={() => setAgreed(a => !a)}
                style={{
                  width: 16, height: 16, flexShrink: 0, marginTop: '.1rem',
                  border: `1px solid ${errors.agreed ? '#c0392b' : agreed ? 'var(--ch)' : 'var(--bo)'}`,
                  background: agreed ? 'var(--ch)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all .2s',
                }}
              >
                {agreed && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="var(--cr)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '.65rem', color: 'var(--mu)', lineHeight: 1.6 }}>
                I agree to AURA's{' '}
                <Link to="/terms" style={{ color: 'var(--ch)', textDecoration: 'none', borderBottom: '1px solid var(--bo)' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" style={{ color: 'var(--ch)', textDecoration: 'none', borderBottom: '1px solid var(--bo)' }}>Privacy Policy</Link>
              </span>
            </label>
            {errors.agreed && (
              <span style={{ fontSize: '.58rem', color: '#c0392b', paddingLeft: '1.7rem' }}>{errors.agreed}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="reg-el btn-primary"
            style={{
              padding: '1.1rem',
              opacity: submitting ? .65 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
              marginTop: '.4rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
            }}
          >
            <span>{submitting ? 'Creating Account…' : 'Create Account'}</span>
            {!submitting && <ArrowRight size={14} strokeWidth={1.5} />}
          </button>
        </form>

        {/* Divider */}
        <div className="reg-el" style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.8rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--bo)' }} />
          <span style={{ fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mu)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--bo)' }} />
        </div>

        {/* Login CTA */}
        <p className="reg-el" style={{ fontSize: '.7rem', color: 'var(--mu)', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: 'var(--ch)', textDecoration: 'none',
            fontFamily: 'var(--fb)', letterSpacing: '.06em',
            borderBottom: '1px solid var(--bo)', paddingBottom: '.1rem',
            transition: 'border-color .2s',
          }}
            onMouseEnter={e => e.target.style.borderColor = 'var(--ch)'}
            onMouseLeave={e => e.target.style.borderColor = 'var(--bo)'}
          >
            Sign in
          </Link>
        </p>

        {/* Trust note */}
        <div className="reg-el" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '.4rem', marginTop: '2rem',
        }}>
          <Lock size={10} strokeWidth={1.5} color="var(--mu)" />
          <span style={{ fontSize: '.55rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mu)' }}>
            Secured with 256-bit encryption
          </span>
        </div>
      </div>

      {/* ── Right: decorative side ── */}
      <div className="reg-side" style={{
        position: 'relative',
        background: 'var(--cr2)',
        borderLeft: '1px solid var(--bo)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <SideFigure />
      </div>
    </div>
  )
}
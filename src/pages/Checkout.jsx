import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {
  ChevronRight, ChevronLeft, Check, MapPin,
  CreditCard, Landmark, Truck, ShieldCheck, Package,
  Lock
} from 'lucide-react'
import useCartStore    from '../store/useCartStore'
import useAuthStore    from '../store/useAuthStore'
import api             from '../api/axios'

/* ─── Step labels ────────────────────────────────────────────── */
const STEPS = ['Delivery', 'Payment', 'Confirmation']

/* ─── Indian states ──────────────────────────────────────────── */
const IN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh',
]

/* ─── Helpers ────────────────────────────────────────────────── */
function fmt(n) { return `₹${Number(n).toLocaleString('en-IN')}` }

/* ─── Shared input style ─────────────────────────────────────── */
const inputStyle = (err) => ({
  width: '100%',
  padding: '.75rem 1rem',
  border: `1px solid ${err ? '#c0392b' : 'var(--bo)'}`,
  background: 'var(--cr)',
  fontFamily: 'var(--fb)',
  fontSize: '.75rem',
  color: 'var(--ch)',
  outline: 'none',
  transition: 'border-color .2s',
  boxSizing: 'border-box',
})

const labelStyle = {
  display: 'block',
  fontSize: '.58rem',
  letterSpacing: '.16em',
  textTransform: 'uppercase',
  color: 'var(--mu)',
  marginBottom: '.4rem',
}

// Bug 2 fix: co-step needs flex + gap so form groups aren't cramped
const coStepStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <span style={{ fontSize: '.58rem', color: '#c0392b', marginTop: '.3rem' }}>{error}</span>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STEP 1 — DELIVERY
═══════════════════════════════════════════════════════════════ */
function DeliveryStep({ form, setForm, errors, onNext }) {
  const { user } = useAuthStore()

  useEffect(() => {
    if (user && !form.firstName) {
      const [first = '', ...rest] = (user.name || '').split(' ')
      setForm(f => ({
        ...f,
        firstName: first,
        lastName:  rest.join(' '),
        email:     user.email || '',
        phone:     user.phone || '',
      }))
    }
  }, [user])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    // Bug 2 fix: inline coStepStyle instead of relying on undefined .co-step CSS class
    <div style={coStepStyle}>
      <SectionTitle icon={<MapPin size={14} strokeWidth={1.5} color="var(--go)" />} title="Delivery Address" />

      {/* Name row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="First Name" error={errors.firstName}>
          <input style={inputStyle(errors.firstName)} value={form.firstName} onChange={set('firstName')}
            onFocus={e => e.target.style.borderColor = 'var(--go)'}
            onBlur={e  => e.target.style.borderColor = errors.firstName ? '#c0392b' : 'var(--bo)'}
            placeholder="Priya" />
        </Field>
        <Field label="Last Name" error={errors.lastName}>
          <input style={inputStyle(errors.lastName)} value={form.lastName} onChange={set('lastName')}
            onFocus={e => e.target.style.borderColor = 'var(--go)'}
            onBlur={e  => e.target.style.borderColor = errors.lastName ? '#c0392b' : 'var(--bo)'}
            placeholder="Sharma" />
        </Field>
      </div>

      {/* Contact row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Email" error={errors.email}>
          <input type="email" style={inputStyle(errors.email)} value={form.email} onChange={set('email')}
            onFocus={e => e.target.style.borderColor = 'var(--go)'}
            onBlur={e  => e.target.style.borderColor = errors.email ? '#c0392b' : 'var(--bo)'}
            placeholder="priya@example.com" />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input type="tel" style={inputStyle(errors.phone)} value={form.phone} onChange={set('phone')}
            onFocus={e => e.target.style.borderColor = 'var(--go)'}
            onBlur={e  => e.target.style.borderColor = errors.phone ? '#c0392b' : 'var(--bo)'}
            placeholder="+91 98765 43210" />
        </Field>
      </div>

      {/* Address */}
      <Field label="Address Line 1" error={errors.address1}>
        <input style={inputStyle(errors.address1)} value={form.address1} onChange={set('address1')}
          onFocus={e => e.target.style.borderColor = 'var(--go)'}
          onBlur={e  => e.target.style.borderColor = errors.address1 ? '#c0392b' : 'var(--bo)'}
          placeholder="House / Flat / Building no., Street" />
      </Field>
      <Field label="Address Line 2 (Optional)">
        <input style={inputStyle(false)} value={form.address2} onChange={set('address2')}
          onFocus={e => e.target.style.borderColor = 'var(--go)'}
          onBlur={e  => e.target.style.borderColor = 'var(--bo)'}
          placeholder="Area, Landmark" />
      </Field>

      {/* City / State / Pincode */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '1rem' }}>
        <Field label="City" error={errors.city}>
          <input style={inputStyle(errors.city)} value={form.city} onChange={set('city')}
            onFocus={e => e.target.style.borderColor = 'var(--go)'}
            onBlur={e  => e.target.style.borderColor = errors.city ? '#c0392b' : 'var(--bo)'}
            placeholder="Mumbai" />
        </Field>
        <Field label="State" error={errors.state}>
          <select style={{ ...inputStyle(errors.state), appearance: 'none', cursor: 'pointer' }}
            value={form.state} onChange={set('state')}
            onFocus={e => e.target.style.borderColor = 'var(--go)'}
            onBlur={e  => e.target.style.borderColor = errors.state ? '#c0392b' : 'var(--bo)'}
          >
            <option value="">Select</option>
            {IN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="PIN Code" error={errors.pincode}>
          <input style={inputStyle(errors.pincode)} value={form.pincode} onChange={set('pincode')}
            onFocus={e => e.target.style.borderColor = 'var(--go)'}
            onBlur={e  => e.target.style.borderColor = errors.pincode ? '#c0392b' : 'var(--bo)'}
            maxLength={6} placeholder="400001" />
        </Field>
      </div>

      <StepButton onClick={onNext} label="Continue to Payment" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STEP 2 — PAYMENT
═══════════════════════════════════════════════════════════════ */
const PAY_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'upi',  label: 'UPI',                 icon: Landmark   },
  { id: 'cod',  label: 'Cash on Delivery',    icon: Truck      },
]

function PaymentStep({ form, setForm, errors, onBack, onNext, placing }) {
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    // Bug 2 fix: inline coStepStyle instead of relying on undefined .co-step CSS class
    <div style={coStepStyle}>
      <SectionTitle icon={<CreditCard size={14} strokeWidth={1.5} color="var(--go)" />} title="Payment Method" />

      {/* Method selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
        {PAY_METHODS.map(({ id, label, icon: Icon }) => (
          <button key={id}
            onClick={() => setForm(f => ({ ...f, payMethod: id }))}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.2rem',
              border: form.payMethod === id ? '1px solid var(--ch)' : '1px solid var(--bo)',
              background: form.payMethod === id ? 'var(--cr2)' : 'none',
              cursor: 'pointer', transition: 'all .2s', textAlign: 'left',
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: `1px solid ${form.payMethod === id ? 'var(--ch)' : 'var(--bo)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {form.payMethod === id && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ch)' }} />
              )}
            </div>
            <Icon size={15} strokeWidth={1.5} color={form.payMethod === id ? 'var(--ch)' : 'var(--mu)'} />
            <span style={{ fontFamily: 'var(--fb)', fontSize: '.7rem', letterSpacing: '.1em', color: form.payMethod === id ? 'var(--ch)' : 'var(--mu)' }}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Card fields */}
      {form.payMethod === 'card' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.4rem', background: 'var(--cr2)', border: '1px solid var(--bo)' }}>
          <Field label="Card Number" error={errors.cardNumber}>
            {/* Bug 1 fix: removed duplicate onChange={set('cardNumber')} — only keep the formatting one */}
            <input
              style={inputStyle(errors.cardNumber)}
              value={form.cardNumber}
              onFocus={e => e.target.style.borderColor = 'var(--go)'}
              onBlur={e  => e.target.style.borderColor = errors.cardNumber ? '#c0392b' : 'var(--bo)'}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
                const formatted = raw.replace(/(.{4})/g, '$1 ').trim()
                setForm(f => ({ ...f, cardNumber: formatted }))
              }}
            />
          </Field>
          <Field label="Name on Card" error={errors.cardName}>
            <input style={inputStyle(errors.cardName)} value={form.cardName} onChange={set('cardName')}
              onFocus={e => e.target.style.borderColor = 'var(--go)'}
              onBlur={e  => e.target.style.borderColor = errors.cardName ? '#c0392b' : 'var(--bo)'}
              placeholder="PRIYA SHARMA" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Expiry (MM/YY)" error={errors.cardExpiry}>
              <input
                style={inputStyle(errors.cardExpiry)}
                value={form.cardExpiry}
                onFocus={e => e.target.style.borderColor = 'var(--go)'}
                onBlur={e  => e.target.style.borderColor = errors.cardExpiry ? '#c0392b' : 'var(--bo)'}
                maxLength={5}
                placeholder="08/27"
                onChange={e => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
                  const formatted = raw.length > 2 ? `${raw.slice(0,2)}/${raw.slice(2)}` : raw
                  setForm(f => ({ ...f, cardExpiry: formatted }))
                }}
              />
            </Field>
            <Field label="CVV" error={errors.cardCvv}>
              <input
                type="password"
                style={inputStyle(errors.cardCvv)}
                value={form.cardCvv}
                onFocus={e => e.target.style.borderColor = 'var(--go)'}
                onBlur={e  => e.target.style.borderColor = errors.cardCvv ? '#c0392b' : 'var(--bo)'}
                maxLength={4}
                placeholder="•••"
                onChange={e => setForm(f => ({ ...f, cardCvv: e.target.value.replace(/\D/g, '').slice(0,4) }))}
              />
            </Field>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <Lock size={11} strokeWidth={1.5} color="var(--mu)" />
            <span style={{ fontSize: '.58rem', color: 'var(--mu)', letterSpacing: '.08em' }}>
              Your payment info is encrypted and secure
            </span>
          </div>
        </div>
      )}

      {/* UPI */}
      {form.payMethod === 'upi' && (
        <div style={{ padding: '1.4rem', background: 'var(--cr2)', border: '1px solid var(--bo)' }}>
          <Field label="UPI ID" error={errors.upiId}>
            <input style={inputStyle(errors.upiId)} value={form.upiId} onChange={set('upiId')}
              onFocus={e => e.target.style.borderColor = 'var(--go)'}
              onBlur={e  => e.target.style.borderColor = errors.upiId ? '#c0392b' : 'var(--bo)'}
              placeholder="priya@paytm" />
          </Field>
        </div>
      )}

      {form.payMethod === 'cod' && (
        <div style={{ padding: '1rem 1.2rem', background: 'var(--cr2)', border: '1px solid var(--bo)' }}>
          <p style={{ fontSize: '.7rem', color: 'var(--mu)', lineHeight: 1.7 }}>
            Pay with cash at the time of delivery. A nominal COD fee of ₹49 will be added.
          </p>
        </div>
      )}

      {/* Nav */}
      <div style={{ display: 'flex', gap: '.8rem', marginTop: '.8rem' }}>
        <BackButton onClick={onBack} />
        <StepButton onClick={onNext} label={placing ? 'Placing Order…' : 'Place Order'} disabled={placing} flex />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STEP 3 — CONFIRMATION
═══════════════════════════════════════════════════════════════ */
function ConfirmationStep({ orderId }) {
  const confRef = useRef(null)
  useGSAP(() => {
    gsap.from('.conf-el', { opacity: 0, y: 20, stagger: .12, duration: .7, ease: 'power3.out' })
  }, { scope: confRef })

  return (
    <div ref={confRef} style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <div className="conf-el" style={{
        width: 72, height: 72, borderRadius: '50%',
        border: '1px solid var(--go)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Check size={28} strokeWidth={1.2} color="var(--go)" />
      </div>

      <div className="conf-el">
        <p style={{ fontSize: '.6rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '.6rem' }}>
          Order Confirmed
        </p>
        <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 300, lineHeight: 1.15 }}>
          Thank you for<br /><em>your order</em>
        </h2>
      </div>

      {orderId && (
        <div className="conf-el" style={{ padding: '.8rem 1.6rem', border: '1px solid var(--bo)', background: 'var(--cr2)' }}>
          <p style={{ fontSize: '.58rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: '.2rem' }}>Order ID</p>
          <p style={{ fontFamily: 'var(--fb)', fontSize: '.75rem', letterSpacing: '.1em', color: 'var(--ch)' }}>{orderId}</p>
        </div>
      )}

      <p className="conf-el" style={{ fontSize: '.75rem', color: 'var(--mu)', lineHeight: 1.8, maxWidth: 360 }}>
        A confirmation has been sent to your email. We'll notify you once your order is dispatched.
      </p>

      <div className="conf-el" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          [ShieldCheck, 'Authenticity Guaranteed'],
          [Truck,       'Dispatched in 2–3 days'],
          [Package,     'Signature packaging'],
        ].map(([Icon, txt]) => (
          <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.5rem .9rem', border: '1px solid var(--bo)' }}>
            <Icon size={12} strokeWidth={1.5} color="var(--go)" />
            <span style={{ fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)' }}>{txt}</span>
          </div>
        ))}
      </div>

      <Link to="/collection" className="conf-el btn-primary" style={{ padding: '.9rem 3rem', marginTop: '.5rem', textDecoration: 'none', display: 'inline-block' }}>
        Continue Shopping
      </Link>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ORDER SUMMARY SIDEBAR
═══════════════════════════════════════════════════════════════ */
function OrderSummary({ items, payMethod }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= 5000 ? 0 : 299
  const codFee   = payMethod === 'cod' ? 49 : 0
  const total    = subtotal + shipping + codFee

  return (
    <aside style={{
      position: 'sticky', top: 110,
      border: '1px solid var(--bo)',
      padding: '2rem',
      background: 'var(--cr)',
      alignSelf: 'start',
    }}>
      <h3 style={{ fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '1.5rem', color: 'var(--mu)' }}>
        Order Summary
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.6rem' }}>
        {items.map(item => (
          <div key={item.key} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: 60, aspectRatio: '2/3', background: 'var(--cr2)', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
              {item.image
                ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <CartItemFigure color={item.color} />
              }
              <div style={{
                position: 'absolute', top: -6, right: -6,
                width: 18, height: 18, borderRadius: '50%',
                background: 'var(--ch)', color: 'var(--cr)',
                fontSize: '.52rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.quantity}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '.62rem', letterSpacing: '.06em', marginBottom: '.15rem' }}>{item.name}</p>
              <p style={{ fontSize: '.58rem', color: 'var(--mu)' }}>{item.color} · {item.size}</p>
            </div>
            <p style={{ fontFamily: 'var(--fd)', fontSize: '.9rem', fontWeight: 300, flexShrink: 0 }}>
              {fmt(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--bo)', paddingTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
        <LineItem label="Subtotal" value={fmt(subtotal)} />
        <LineItem label="Shipping" value={shipping === 0 ? 'Free' : fmt(shipping)} accent={shipping === 0} />
        {codFee > 0 && <LineItem label="COD Fee" value={fmt(codFee)} />}
        <div style={{ borderTop: '1px solid var(--bo)', paddingTop: '.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '.2rem' }}>
          <span style={{ fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase' }}>Total</span>
          <span style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 300 }}>{fmt(total)}</span>
        </div>
        <p style={{ fontSize: '.58rem', color: 'var(--mu)', textAlign: 'right' }}>Inclusive of all taxes</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', marginTop: '1.4rem', padding: '.7rem', background: 'var(--cr2)', border: '1px solid var(--bo)' }}>
        <Lock size={11} strokeWidth={1.5} color="var(--mu)" />
        <span style={{ fontSize: '.55rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mu)' }}>
          Secure Checkout
        </span>
      </div>
    </aside>
  )
}

function LineItem({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '.62rem', color: 'var(--mu)' }}>{label}</span>
      <span style={{ fontSize: '.7rem', color: accent ? 'var(--go)' : 'var(--ch)', letterSpacing: '.04em' }}>{value}</span>
    </div>
  )
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
      {icon}
      <h2 style={{ fontFamily: 'var(--fb)', fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase' }}>{title}</h2>
    </div>
  )
}

function StepButton({ onClick, label, disabled, flex }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn-primary"
      style={{ flex: flex ? 1 : undefined, padding: '1.1rem', opacity: disabled ? .6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}>
        {label} {!disabled && <ChevronRight size={14} strokeWidth={1.5} />}
      </span>
    </button>
  )
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '.4rem',
      background: 'none', border: '1px solid var(--bo)',
      fontFamily: 'var(--fb)', fontSize: '.62rem', letterSpacing: '.15em',
      textTransform: 'uppercase', color: 'var(--mu)', cursor: 'pointer',
      padding: '.8rem 1.2rem', transition: 'border-color .2s, color .2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ch)'; e.currentTarget.style.color = 'var(--ch)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bo)'; e.currentTarget.style.color = 'var(--mu)' }}
    >
      <ChevronLeft size={13} strokeWidth={1.5} /> Back
    </button>
  )
}

function CartItemFigure({ color }) {
  const c = (color || '').toLowerCase()
  const bg = c.includes('noir') || c.includes('black') ? '#2A2018'
           : c.includes('ivory') || c.includes('white') ? '#E8DDD0'
           : c.includes('burg') ? '#6B2737'
           : c.includes('camel') || c.includes('ecru') ? '#C09458'
           : '#8A7A6A'
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--cr2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 14, height: 36, background: bg, opacity: .7 }} />
    </div>
  )
}

function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '2.5rem' }}>
      {STEPS.map((label, i) => {
        const done   = i < current
        const active = i === current
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : undefined }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.35rem' }}>
              <div style={{
                width: 28, height: 28,
                border: `1px solid ${done || active ? 'var(--ch)' : 'var(--bo)'}`,
                background: done ? 'var(--ch)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', transition: 'all .3s',
              }}>
                {done
                  ? <Check size={12} strokeWidth={2} color="var(--cr)" />
                  : <span style={{ fontSize: '.6rem', color: active ? 'var(--ch)' : 'var(--mu)' }}>{i + 1}</span>
                }
              </div>
              <span style={{ fontSize: '.52rem', letterSpacing: '.14em', textTransform: 'uppercase', color: active || done ? 'var(--ch)' : 'var(--mu)', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1, background: done ? 'var(--ch)' : 'var(--bo)', margin: '0 .6rem', marginBottom: '1.4rem', transition: 'background .4s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CHECKOUT PAGE
═══════════════════════════════════════════════════════════════ */
const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  address1: '', address2: '', city: '', state: '', pincode: '',
  payMethod: 'card',
  cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '',
  upiId: '',
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const { isAuthenticated }  = useAuthStore()

  const [step,    setStep]    = useState(0)
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [errors,  setErrors]  = useState({})
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const containerRef = useRef(null)

  // Bug 3 fix: only redirect if step is still < 2 AND we haven't just placed an order.
  // Use a ref to track whether we're mid-confirmation so the zustand clearCart()
  // update doesn't race with setStep(2) and fire the redirect.
  const confirmingRef = useRef(false)

  useEffect(() => {
    if (items.length === 0 && step < 2 && !confirmingRef.current) {
      navigate('/collection')
    }
  }, [items.length, step])

  useGSAP(() => {
    gsap.from('.co-step-anim', { opacity: 0, y: 18, duration: .5, ease: 'power2.out' })
  }, { scope: containerRef, dependencies: [step] })

  /* ── Validators ─────────────────────────────── */
  function validateDelivery() {
    const e = {}
    if (!form.firstName.trim())               e.firstName = 'Required'
    if (!form.lastName.trim())                e.lastName  = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.phone.replace(/\D/g,'').match(/^\d{10}$/)) e.phone = 'Valid 10-digit number required'
    if (!form.address1.trim())                e.address1  = 'Required'
    if (!form.city.trim())                    e.city      = 'Required'
    if (!form.state)                          e.state     = 'Required'
    if (!form.pincode.match(/^\d{6}$/))       e.pincode   = '6-digit PIN required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validatePayment() {
    const e = {}
    if (form.payMethod === 'card') {
      if (form.cardNumber.replace(/\s/g,'').length < 16) e.cardNumber = 'Enter 16-digit card number'
      if (!form.cardName.trim())                          e.cardName   = 'Required'
      if (!form.cardExpiry.match(/^\d{2}\/\d{2}$/))      e.cardExpiry = 'Format: MM/YY'
      if (form.cardCvv.length < 3)                        e.cardCvv    = '3–4 digits required'
    }
    if (form.payMethod === 'upi') {
      if (!form.upiId.match(/^[\w.\-]+@[\w]+$/))         e.upiId = 'Valid UPI ID required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleDeliveryNext() {
    if (validateDelivery()) {
      setErrors({})
      setStep(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function handlePlaceOrder() {
    if (!validatePayment()) return

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const shipping = subtotal >= 5000 ? 0 : 299
    const codFee   = form.payMethod === 'cod' ? 49 : 0

    const payload = {
      items: items.map(i => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity, price: i.price })),
      shippingAddress: {
        firstName: form.firstName, lastName: form.lastName,
        phone: form.phone, address1: form.address1,
        address2: form.address2, city: form.city,
        state: form.state, pincode: form.pincode, country: 'India',
      },
      paymentMethod: form.payMethod,
      subtotal, shipping, total: subtotal + shipping + codFee,
    }

    setPlacing(true)
    // Bug 3 fix: set the ref before clearCart so the useEffect redirect guard
    // knows we're intentionally emptying the cart for a confirmed order.
    confirmingRef.current = true
    try {
      const { data } = await api.post('/orders', payload)
      setOrderId(data?.data?._id || data?.data?.orderId || 'AURA-' + Date.now())
      clearCart()
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Order error:', err)
      setOrderId('AURA-' + Date.now())
      clearCart()
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0 && step < 2 && !confirmingRef.current) {
    return (
      <div className="page-offset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loader"><div className="loader-ring" /></div>
      </div>
    )
  }

  return (
    <div className="page-offset" ref={containerRef}>
      {/* ── Page header ── */}
      <div style={{
        padding: 'clamp(1.5rem,4vw,3rem) 5vw 1.5rem',
        borderBottom: '1px solid var(--bo)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.1rem,2vw,1.5rem)', fontWeight: 300, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--ch)', textDecoration: 'none' }}>
          AURA
        </Link>
        {step < 2 && (
          <Link to="/collection" style={{ fontSize: '.58rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--mu)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
            <ChevronLeft size={12} strokeWidth={1.5} /> Continue Shopping
          </Link>
        )}
      </div>

      {/* ── Main layout ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: step === 2 ? '1fr' : 'minmax(0,1.3fr) minmax(280px,480px)',
        minHeight: '80vh',
      }}>
        {/* Left: steps */}
        <div className="co-step-anim" style={{ padding: 'clamp(2rem,5vw,4rem) 5vw', borderRight: step < 2 ? '1px solid var(--bo)' : 'none' }}>
          {step < 2 && <StepIndicator current={step} />}

          {step === 0 && (
            <DeliveryStep form={form} setForm={setForm} errors={errors} onNext={handleDeliveryNext} />
          )}
          {step === 1 && (
            <PaymentStep
              form={form} setForm={setForm} errors={errors}
              onBack={() => { setErrors({}); setStep(0) }}
              onNext={handlePlaceOrder}
              placing={placing}
            />
          )}
          {step === 2 && <ConfirmationStep orderId={orderId} />}
        </div>

        {/* Right: order summary */}
        {step < 2 && (
          <div style={{ padding: 'clamp(2rem,5vw,4rem) 2.5rem', background: 'var(--cr2)' }}>
            <OrderSummary items={items} payMethod={form.payMethod} />
          </div>
        )}
      </div>
    </div>
  )
}
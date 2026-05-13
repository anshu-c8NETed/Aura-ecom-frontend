import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import useCartStore from '../../store/useCartStore'

export default function CartDrawer() {
  const isOpen    = useCartStore(s => s.isOpen)
  const closeCart = useCartStore(s => s.closeCart)
  const items     = useCartStore(s => s.items)
  const removeItem = useCartStore(s => s.removeItem)
  const updateQty  = useCartStore(s => s.updateQty)

  const drawerRef  = useRef(null)
  const overlayRef = useRef(null)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  useGSAP(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'all', duration: .35 })
      gsap.to(drawerRef.current,  { x: 0, duration: .5, ease: 'power3.out' })
    } else {
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: .35 })
      gsap.to(drawerRef.current,  { x: '100%', duration: .45, ease: 'power3.in' })
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeCart])

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(26,23,20,0.45)',
          zIndex: 200, opacity: 0, pointerEvents: 'none',
        }}
      />

      {/* Drawer */}
      <div ref={drawerRef} style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(440px, 100vw)',
        background: 'var(--cr)',
        zIndex: 201,
        transform: 'translateX(100%)',
        display: 'flex', flexDirection: 'column',
        borderLeft: '1px solid var(--bo)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.4rem 1.8rem',
          borderBottom: '1px solid var(--bo)',
        }}>
          <span style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 300 }}>
            Your Bag
            {items.length > 0 && (
              <span style={{ fontFamily: 'var(--fb)', fontSize: '.6rem', letterSpacing: '.15em', color: 'var(--mu)', marginLeft: '.8rem' }}>
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            )}
          </span>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', color: 'var(--ch)', cursor: 'pointer', padding: 4 }}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem 1.8rem' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1.2rem', color: 'var(--mu)' }}>
              <ShoppingBag size={40} strokeWidth={1} />
              <p style={{ fontSize: '.78rem', letterSpacing: '.1em' }}>Your bag is empty</p>
              <button onClick={closeCart} className="btn-primary" style={{ marginTop: '.5rem' }}>
                <span>Continue Shopping</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              {items.map(item => (
                <CartItem key={item.key} item={item} onRemove={removeItem} onUpdateQty={updateQty} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.4rem 1.8rem', borderTop: '1px solid var(--bo)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mu)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem' }}>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
            </div>
            <p style={{ fontSize: '.6rem', color: 'var(--mu)', marginBottom: '1rem', letterSpacing: '.05em' }}>
              Shipping and taxes calculated at checkout
            </p>
            <Link to="/checkout" onClick={closeCart}>
              <button className="btn-primary" style={{ width: '100%', padding: '1rem', textAlign: 'center' }}>
                <span>Proceed to Checkout</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

function CartItem({ item, onRemove, onUpdateQty }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1.4rem', borderBottom: '1px solid var(--bo)' }}>
      {/* Image */}
      <div style={{ width: 80, height: 100, background: 'var(--cr2)', flexShrink: 0, overflow: 'hidden' }}>
        {item.image ? (
          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--cr3)' }} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--fd)', fontSize: '1rem', marginBottom: '.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.name}
        </p>
        <p style={{ fontSize: '.6rem', color: 'var(--mu)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.8rem' }}>
          {item.size} · {item.color}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Qty controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', border: '1px solid var(--bo)' }}>
            <button
              onClick={() => onUpdateQty(item.key, item.quantity - 1)}
              style={{ background: 'none', border: 'none', padding: '.3rem .6rem', color: 'var(--ch)', cursor: 'pointer' }}
            >
              <Minus size={11} />
            </button>
            <span style={{ fontSize: '.75rem', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.key, item.quantity + 1)}
              style={{ background: 'none', border: 'none', padding: '.3rem .6rem', color: 'var(--ch)', cursor: 'pointer' }}
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Price + remove */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
            <span style={{ fontSize: '.85rem', fontWeight: 400 }}>
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </span>
            <button
              onClick={() => onRemove(item.key)}
              style={{ background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer', fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase' }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
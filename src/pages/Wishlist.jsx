import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Heart, ArrowRight, Sparkles } from 'lucide-react'
import useWishlistStore from '../store/useWishlistStore'
import useCartStore from '../store/useCartStore'
import ProductCard from '../components/product/ProductCard'
import { MOCK_PRODUCTS } from '../data/mockProducts'

export default function Wishlist() {
  const { ids, toggle } = useWishlistStore()
  const addItem = useCartStore(s => s.addItem)
  const containerRef = useRef(null)

  // Match wishlist IDs to products
  const wishedProducts = MOCK_PRODUCTS.filter(p => ids.includes(p._id))

  useGSAP(() => {
    if (wishedProducts.length === 0) {
      gsap.from('.wl-empty > *', {
        opacity: 0, y: 24, stagger: .12, duration: .75, ease: 'power3.out', delay: .15,
      })
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.wl-header',  { opacity: 0, y: 20, duration: .65 }, 0)
    tl.from('.wl-meta',    { opacity: 0, y: 12, duration: .55 }, .15)
    tl.from('.wl-divider', { scaleX: 0, duration: .8, ease: 'power2.inOut', transformOrigin: 'left' }, .2)
    tl.from('.wl-card',    { opacity: 0, y: 32, stagger: .08, duration: .7 }, .3)
    tl.from('.wl-footer',  { opacity: 0, y: 16, duration: .6 }, .5)
  }, { scope: containerRef, dependencies: [ids.length] })

  return (
    <div className="page-offset" ref={containerRef}>

      {/* ── Decorative top rule ── */}
      <div style={{
        height: 1,
        background: 'linear-gradient(to right, transparent, var(--bo) 20%, var(--bo) 80%, transparent)',
      }} />

      {/* ── Page header ── */}
      <div style={{
        padding: 'clamp(2.5rem,5vw,5rem) 5vw 0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="eyebrow wl-header" style={{ display: 'block' }}>Your Collection</span>
            <h1
              className="display-heading wl-header"
              style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}
            >
              Saved <em>Pieces</em>
              <Heart
                size={22}
                strokeWidth={1.2}
                color="var(--go)"
                fill="var(--go)"
                style={{ marginBottom: '.2rem', opacity: .8 }}
              />
            </h1>
          </div>

          {wishedProducts.length > 0 && (
            <p className="wl-meta" style={{
              fontSize: '.68rem',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--mu)',
              paddingBottom: '.35rem',
            }}>
              {wishedProducts.length} {wishedProducts.length === 1 ? 'piece' : 'pieces'} saved
            </p>
          )}
        </div>

        {/* Animated divider */}
        <div className="wl-divider" style={{
          height: 1,
          background: 'var(--bo)',
          margin: 'clamp(1.5rem, 3vw, 2.5rem) 0 0',
        }} />
      </div>

      {/* ══════════════════════════════
          EMPTY STATE
      ══════════════════════════════ */}
      {wishedProducts.length === 0 && (
        <div className="wl-empty" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(4rem,10vw,9rem) 5vw',
          textAlign: 'center',
          gap: '0',
        }}>

          {/* Ornamental heart cluster */}
          <div style={{
            position: 'relative',
            width: 100,
            height: 100,
            marginBottom: '2.5rem',
          }}>
            {/* Outer ring */}
            <div style={{
              position: 'absolute', inset: 0,
              border: '1px solid var(--bo)',
              borderRadius: '50%',
            }} />
            {/* Inner ring */}
            <div style={{
              position: 'absolute', inset: 14,
              border: '1px solid var(--cr3)',
              borderRadius: '50%',
            }} />
            {/* Gold dot accent ring */}
            {[0, 60, 120, 180, 240, 300].map(deg => (
              <div key={deg} style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: 3, height: 3,
                borderRadius: '50%',
                background: 'var(--go)',
                opacity: .4,
                transform: `rotate(${deg}deg) translateY(-42px) translateX(-1.5px)`,
              }} />
            ))}
            {/* Center heart */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={28} strokeWidth={1} color="var(--go)" />
            </div>
          </div>

          <span className="eyebrow" style={{ marginBottom: '.8rem' }}>Nothing Saved Yet</span>

          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(1.6rem,3vw,2.4rem)',
            fontWeight: 300,
            lineHeight: 1.15,
            marginBottom: '1.2rem',
            color: 'var(--ch)',
          }}>
            Your <em>wishlist</em> awaits
          </h2>

          <p style={{
            fontSize: '.8rem',
            lineHeight: 2,
            color: 'var(--mu)',
            maxWidth: 340,
            marginBottom: '2.8rem',
          }}>
            Save pieces that speak to you. Return to them at your leisure — true luxury is never rushed.
          </p>

          {/* Decorative horizontal rule with diamond */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            marginBottom: '2.8rem', width: '100%', maxWidth: 280,
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--bo)' }} />
            <div style={{
              width: 6, height: 6,
              background: 'var(--go)',
              transform: 'rotate(45deg)',
              opacity: .6,
            }} />
            <div style={{ flex: 1, height: 1, background: 'var(--bo)' }} />
          </div>

          <Link to="/collection">
            <button className="btn-primary" style={{ padding: '.95rem 3rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
                Explore the Collection
                <ArrowRight size={14} strokeWidth={1.5} />
              </span>
            </button>
          </Link>
        </div>
      )}

      {/* ══════════════════════════════
          PRODUCTS GRID
      ══════════════════════════════ */}
      {wishedProducts.length > 0 && (
        <>
          <div style={{ padding: 'clamp(2rem,4vw,3.5rem) 5vw' }}>

            {/* Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <Sparkles size={12} strokeWidth={1.5} color="var(--go)" />
                <span style={{
                  fontSize: '.58rem',
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                  color: 'var(--mu)',
                }}>
                  Curated by you
                </span>
              </div>

              <button
                onClick={() => wishedProducts.forEach(p => toggle(p._id))}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--fb)',
                  fontSize: '.58rem',
                  letterSpacing: '.16em',
                  textTransform: 'uppercase',
                  color: 'var(--mu)',
                  cursor: 'pointer',
                  transition: 'color .3s',
                  padding: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--ch)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--mu)'}
              >
                Clear All
              </button>
            </div>

            {/* Grid */}
            <div className="product-grid">
              {wishedProducts.map(product => (
                <div key={product._id} className="wl-card">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer CTA ── */}
          <div className="wl-footer" style={{
            margin: '0 5vw clamp(3rem,6vw,6rem)',
            padding: 'clamp(2rem,4vw,3.5rem)',
            background: 'var(--cr2)',
            border: '1px solid var(--bo)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            <div>
              <p style={{
                fontFamily: 'var(--fd)',
                fontSize: 'clamp(1.1rem,2vw,1.6rem)',
                fontWeight: 300,
                marginBottom: '.4rem',
                lineHeight: 1.2,
              }}>
                Not quite ready?
              </p>
              <p style={{
                fontSize: '.72rem',
                color: 'var(--mu)',
                lineHeight: 1.7,
                maxWidth: 360,
              }}>
                Your wishlist is saved. Discover more pieces or move directly to checkout.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/collection">
                <button className="btn-ghost">Continue Browsing</button>
              </Link>
              <Link to="/checkout">
                <button className="btn-primary">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                    Go to Checkout
                    <ArrowRight size={13} strokeWidth={1.5} />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
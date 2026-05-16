import { useRef, useEffect, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useFeaturedProducts } from '../../hooks/useProducts'
import { MOCK_PRODUCTS } from '../../data/mockProducts'

gsap.registerPlugin(ScrollTrigger)

const MOCK_FEATURED = MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, 4)

/* ── SVG organic brush paths ─────────────────────────────────── */
const PATH_A = 'M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262'
const PATH_B = 'M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012'

/* ── Layout config: hero card left, three right ──────────────── */
const LAYOUT = [
  { gridRow: '1 / 3', gridColumn: '1 / 2', isHero: true },  // tall hero
  { gridRow: '1 / 2', gridColumn: '2 / 3', isHero: false }, // top-right
  { gridRow: '1 / 2', gridColumn: '3 / 4', isHero: false }, // top-far-right
  { gridRow: '2 / 3', gridColumn: '2 / 4', isHero: false }, // bottom-right wide
]

/* ─── InkCard ────────────────────────────────────────────────── */
function InkCard({ product, index }) {
  const refA    = useRef(null)
  const refB    = useRef(null)
  const lblRef  = useRef(null)
  const img2Ref = useRef(null)
  const nameRef = useRef(null)
  const lens    = useRef([0, 0])

  const layout = LAYOUT[index] || LAYOUT[0]
  const img1   = product.images?.[0]?.url ?? ''
  const img2   = product.images?.[1]?.url ?? img1
  const price  = product.basePrice ?? product.price ?? 0
  const cat    = product.category ?? 'Womenswear'
  const isHero = layout.isHero

  /* ── Detect touch/hover capability ── */
  const isTouch = useRef(
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  )

  /* ── Setup: hide everything to initial state ── */
  useEffect(() => {
    const pa = refA.current
    const pb = refB.current
    if (!pa || !pb) return

    const la = pa.getTotalLength()
    const lb = pb.getTotalLength()

    gsap.set(pa, { strokeDasharray: la, strokeDashoffset: la, attr: { 'stroke-width': 160 } })
    gsap.set(pb, { strokeDasharray: lb, strokeDashoffset: lb, attr: { 'stroke-width': 160 } })
    lens.current = [la, lb]

    /* On touch devices keep img2 and label hidden — CSS handles reveal */
    if (!isTouch.current) {
      gsap.set(img2Ref.current, { opacity: 0 })
      gsap.set(lblRef.current,  { opacity: 0, y: 20 })
    }
  }, [])

  /* ── Hover in (pointer devices only) ── */
  const onEnter = useCallback(() => {
    if (isTouch.current) return
    const pa   = refA.current
    const pb   = refB.current
    const lbl  = lblRef.current
    const img2 = img2Ref.current
    if (!pa || !pb) return

    gsap.killTweensOf([pa, pb, lbl, img2])

    gsap.to(pa, { strokeDashoffset: 0, attr: { 'stroke-width': 720 }, duration: 1.3, ease: 'power2.out' })
    gsap.to(pb, { strokeDashoffset: 0, attr: { 'stroke-width': 700 }, duration: 1.3, ease: 'power2.out', delay: 0.1 })
    gsap.to(img2, { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.4 })
    gsap.to(lbl,  { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: 0.55 })
  }, [])

  /* ── Hover out (pointer devices only) ── */
  const onLeave = useCallback(() => {
    if (isTouch.current) return
    const pa   = refA.current
    const pb   = refB.current
    const lbl  = lblRef.current
    const img2 = img2Ref.current
    const [la, lb] = lens.current
    if (!pa || !pb) return

    gsap.killTweensOf([pa, pb, lbl, img2])

    gsap.to(pa,   { strokeDashoffset: la, attr: { 'stroke-width': 160 }, duration: 0.8, ease: 'power2.inOut' })
    gsap.to(pb,   { strokeDashoffset: lb, attr: { 'stroke-width': 160 }, duration: 0.8, ease: 'power2.inOut' })
    gsap.to(img2, { opacity: 0, duration: 0.4, ease: 'power2.in' })
    gsap.to(lbl,  { opacity: 0, y: 20, duration: 0.25, ease: 'power2.in' })
  }, [])

  return (
    <div
      className={`fp-ink-card fp-ink-card-${index}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position:   'relative',
        overflow:   'hidden',
        cursor:     'pointer',
        background: '#1a1714',
        borderRadius: '3px',
      }}
    >
      {/* ── Always-visible gradient base ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(to top, rgba(8,6,4,0.75) 0%, rgba(8,6,4,0.12) 45%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Image 1 — default ── */}
      <img
        src={img1}
        alt={product.name}
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: isHero ? 'center 8%' : 'center 15%',
          transition: 'transform 0.9s cubic-bezier(.25,.46,.45,.94)',
        }}
      />

      {/* ── Ink A ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%) scale(1.55)',
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 2,
      }}>
        <svg viewBox="0 0 2453 2273" fill="none" style={{ width: '100%', height: '100%' }}>
          <path ref={refA} d={PATH_A} stroke="rgba(10,8,6,0.9)" strokeLinecap="round" />
        </svg>
      </div>

      {/* ── Ink B ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%) scale(1.55)',
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 3,
      }}>
        <svg viewBox="0 0 2250 2535" fill="none" style={{ width: '100%', height: '100%' }}>
          <path ref={refB} d={PATH_B} stroke="rgba(26,20,14,0.82)" strokeLinecap="round" />
        </svg>
      </div>

      {/* ── Image 2 — ink reveal ── */}
      <img
        ref={img2Ref}
        src={img2}
        alt={product.name}
        style={{
          position: 'absolute', inset: 0, zIndex: 4,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: isHero ? 'center 8%' : 'center 15%',
          pointerEvents: 'none',
        }}
      />

      {/* ── Dark veil over img2 for label legibility ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        background: 'linear-gradient(to top, rgba(6,4,2,0.8) 0%, rgba(6,4,2,0.2) 50%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Top row: index + category ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 6,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: 'clamp(.75rem,1.5vw,1.3rem) clamp(.85rem,1.8vw,1.5rem)',
      }}>
        <span style={{
          fontFamily: 'var(--fd)', fontWeight: 300,
          fontSize: isHero ? '.95rem' : '.75rem',
          letterSpacing: '.2em', fontVariantNumeric: 'tabular-nums',
          color: 'rgba(250,248,245,0.3)',
          userSelect: 'none',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{
          fontFamily: 'var(--fb)', fontWeight: 400,
          fontSize: '.38rem', letterSpacing: '.28em', textTransform: 'uppercase',
          color: 'rgba(250,248,245,0.22)',
          userSelect: 'none',
        }}>
          {cat}
        </span>
      </div>

      {/* ── Bottom label block ── */}
      {/* On pointer devices: hidden until hover (GSAP-controlled)       */}
      {/* On touch devices:   always visible via .fp-ink-label CSS rule  */}
      <div
        ref={lblRef}
        className="fp-ink-label"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 6,
          padding: isHero
            ? 'clamp(1.2rem,3vw,2.5rem) clamp(1rem,2.5vw,2rem)'
            : 'clamp(.85rem,1.8vw,1.5rem) clamp(.85rem,1.8vw,1.4rem)',
        }}
      >
        {/* Product name */}
        <p
          ref={nameRef}
          style={{
            fontFamily: 'var(--fd)', fontWeight: 300, fontStyle: 'italic',
            fontSize: isHero ? 'clamp(1.1rem,2.2vw,2rem)' : 'clamp(0.85rem,1.3vw,1.2rem)',
            color: 'rgba(250,248,245,0.95)',
            letterSpacing: '-0.015em', lineHeight: 1.12,
            marginBottom: isHero ? '.7rem' : '.45rem',
          }}
        >
          {product.name}
        </p>

        {/* Gold separator */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, rgba(184,149,96,0.65), transparent)',
          width: isHero ? '55%' : '60%',
          marginBottom: isHero ? '.9rem' : '.6rem',
        }} />

        {/* Price row + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem', flexWrap: 'wrap' }}>
          <div>
            {product.comparePrice > 0 && product.comparePrice > product.basePrice && (
              <span style={{
                fontFamily: 'var(--fb)', fontWeight: 300,
                fontSize: '.44rem', letterSpacing: '.08em',
                color: 'rgba(250,248,245,0.3)',
                textDecoration: 'line-through',
                display: 'block', marginBottom: '.1rem',
              }}>
                ₹{product.comparePrice?.toLocaleString('en-IN')}
              </span>
            )}
            <span style={{
              fontFamily: 'var(--fb)', fontWeight: 300,
              fontSize: isHero ? '.65rem' : '.54rem',
              letterSpacing: '.1em',
              color: 'rgba(250,248,245,0.55)',
            }}>
              ₹{price.toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            to={`/product/${product.slug ?? product._id}`}
            onClick={e => e.stopPropagation()}
            style={{
              fontFamily: 'var(--fb)', fontWeight: 400,
              fontSize: '.38rem', letterSpacing: '.28em', textTransform: 'uppercase',
              color: 'rgba(250,248,245,0.85)',
              display: 'flex', alignItems: 'center', gap: '.4rem',
              paddingBottom: '1px',
              borderBottom: '1px solid rgba(250,248,245,0.18)',
              transition: 'color .22s, gap .28s, border-color .22s',
              whiteSpace: 'nowrap',
              /* Ensure tap target on mobile */
              minHeight: '44px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color       = '#C9A96E'
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.55)'
              e.currentTarget.style.gap         = '.65rem'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color       = 'rgba(250,248,245,0.85)'
              e.currentTarget.style.borderColor = 'rgba(250,248,245,0.18)'
              e.currentTarget.style.gap         = '.4rem'
            }}
          >
            View Piece
            <svg width="14" height="6" viewBox="0 0 14 6" fill="none" aria-hidden="true">
              <line x1="0" y1="3" x2="10.5" y2="3" stroke="currentColor" strokeWidth="0.8"/>
              <path d="M8 1L11.5 3L8 5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Hero-only: brand tag */}
        {isHero && (
          <p style={{
            marginTop: '.85rem',
            fontFamily: 'var(--fb)', fontWeight: 400,
            fontSize: '.38rem', letterSpacing: '.38em', textTransform: 'uppercase',
            color: 'rgba(184,149,96,0.45)',
          }}>
            {product.brand ?? 'AURA'}
          </p>
        )}
      </div>
    </div>
  )
}

/* ─── Section ────────────────────────────────────────────────── */
export default function FeaturedProducts() {
  const sectionRef = useRef(null)
  const { data, isLoading } = useFeaturedProducts()

  const apiProducts = data?.data?.products ?? data?.data ?? []
  const products    = Array.isArray(apiProducts) && apiProducts.length ? apiProducts : MOCK_FEATURED

  useGSAP(() => {
    if (isLoading || !products.length) return
    const root = sectionRef.current
    if (!root) return

    const st = { trigger: root, start: 'top 78%', once: true }

    gsap.from('.fp-eyebrow', { opacity: 0, y: 14, duration: 0.9, ease: 'power3.out', scrollTrigger: st })
    gsap.from('.fp-heading', { opacity: 0, y: 22, duration: 1.1, ease: 'power3.out', delay: 0.08, scrollTrigger: st })
    gsap.from('.fp-viewall', { opacity: 0, x: 12, duration: 0.9, ease: 'power3.out', delay: 0.16, scrollTrigger: st })
    gsap.from('.fp-rule',    { scaleX: 0, duration: 1.3, ease: 'power3.inOut', transformOrigin: 'left', scrollTrigger: { ...st, start: 'top 82%' } })

    /* Curtain wipe — skip on very small screens to avoid jank */
    const isMobile = window.matchMedia('(max-width: 480px)').matches
    if (!isMobile) {
      gsap.fromTo(
        root.querySelectorAll('.fp-ink-card'),
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1, ease: 'power3.inOut',
          stagger: { each: 0.18, ease: 'power1.out' },
          delay: 0.1,
          scrollTrigger: st,
        }
      )
    }
  }, { scope: sectionRef, dependencies: [isLoading, products.length] })

  return (
    <section
      ref={sectionRef}
      style={{ padding: 'clamp(3rem,8vw,8rem) clamp(1rem,5vw,5vw)', background: 'var(--cr)' }}
    >
      {/* ── Header ── */}
      <div
        className="fp-section-header"
        style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 'clamp(1rem,2.5vw,2rem)',
          flexWrap: 'wrap', gap: '1rem',
        }}
      >
        <div>
          <span className="fp-eyebrow" style={{
            display: 'block', fontFamily: 'var(--fb)', fontWeight: 400,
            fontSize: '.46rem', letterSpacing: '.38em', textTransform: 'uppercase',
            color: 'var(--go)', marginBottom: '.55rem',
          }}>
            Curated Selection
          </span>
          <h2 className="fp-heading" style={{
            fontFamily: 'var(--fd)', fontWeight: 300, fontStyle: 'italic',
            fontSize: 'clamp(1.5rem,3.2vw,3rem)',
            lineHeight: 1.06, letterSpacing: '-0.02em', color: 'var(--ch)',
          }}>
            Featured Pieces
          </h2>
        </div>

        <Link
          to="/collection"
          className="fp-viewall"
          style={{
            fontFamily: 'var(--fb)', fontSize: '.46rem', letterSpacing: '.3em',
            textTransform: 'uppercase', color: 'var(--mu)',
            display: 'flex', alignItems: 'center', gap: '.5rem',
            paddingBottom: '1px', borderBottom: '1px solid transparent',
            transition: 'color .3s, gap .35s, border-color .3s',
            minHeight: '44px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color       = 'var(--ch)'
            e.currentTarget.style.gap         = '.85rem'
            e.currentTarget.style.borderColor = 'rgba(26,23,20,0.18)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color       = 'var(--mu)'
            e.currentTarget.style.gap         = '.5rem'
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          View All
          <svg width="20" height="7" viewBox="0 0 20 7" fill="none" aria-hidden="true">
            <line x1="0" y1="3.5" x2="16" y2="3.5" stroke="currentColor" strokeWidth="0.8"/>
            <path d="M13 1L16.5 3.5L13 6" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      {/* Gold rule */}
      <div className="fp-rule" style={{
        height: '1px',
        background: 'linear-gradient(to right, var(--go), rgba(184,149,96,0.1), transparent)',
        marginBottom: 'clamp(1.4rem,3.5vw,3rem)',
        transformOrigin: 'left center',
      }} />

      {/* ── Asymmetric editorial grid ── */}
      {isLoading ? (
        <div className="loader"><div className="loader-ring" /></div>
      ) : (
        <div className="fp-editorial-grid">
          {products.slice(0, 4).map((p, i) => (
            <InkCard key={p._id} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}

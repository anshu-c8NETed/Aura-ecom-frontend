import { useRef, useEffect, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useFeaturedProducts } from '../../hooks/useProducts'
import { MOCK_PRODUCTS } from '../../data/mockProducts'

gsap.registerPlugin(ScrollTrigger)

const MOCK_FEATURED = MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, 4)

/* ── Ink SVG paths ──────────────────────────────────────────────── */
const PATH_A = 'M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262'
const PATH_B = 'M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012'

const LAYOUT = [
  { gridRow: '1 / 3', gridColumn: '1 / 2', isHero: true  },
  { gridRow: '1 / 2', gridColumn: '2 / 3', isHero: false },
  { gridRow: '1 / 2', gridColumn: '3 / 4', isHero: false },
  { gridRow: '2 / 3', gridColumn: '2 / 4', isHero: false },
]

/* ─── InkCard ────────────────────────────────────────────────────── */
function InkCard({ product, index }) {
  const refA    = useRef(null)
  const refB    = useRef(null)
  const img2Ref = useRef(null)
  const ruleRef = useRef(null)   // gold rule — animates width on hover
  const lens    = useRef([0, 0])

  const layout   = LAYOUT[index] || LAYOUT[0]
  const img1     = product.images?.[0]?.url ?? ''
  const img2     = product.images?.[1]?.url ?? img1
  const price    = product.basePrice ?? product.price ?? 0
  const cat      = (product.category ?? 'Womenswear').toUpperCase()
  const isHero   = layout.isHero
  const numLabel = String(index + 1).padStart(2, '0')

  const isTouch = useRef(
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  )

  /* ── Init: only hide ink overlay image — label stays visible ── */
  useEffect(() => {
    const pa = refA.current
    const pb = refB.current
    if (!pa || !pb) return
    const la = pa.getTotalLength()
    const lb = pb.getTotalLength()
    gsap.set(pa, { strokeDasharray: la, strokeDashoffset: la, attr: { 'stroke-width': 160 } })
    gsap.set(pb, { strokeDasharray: lb, strokeDashoffset: lb, attr: { 'stroke-width': 160 } })
    lens.current = [la, lb]
    // img2 hidden until ink draws — label always visible
    gsap.set(img2Ref.current, { opacity: 0 })
    // gold rule starts at 0 width
    if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'left' })
  }, [])

  /* ── Hover in ── */
  const onEnter = useCallback(() => {
    if (isTouch.current) return
    const pa   = refA.current
    const pb   = refB.current
    const img  = img2Ref.current
    const rule = ruleRef.current
    if (!pa || !pb) return
    gsap.killTweensOf([pa, pb, img, rule])
    // Ink draws
    gsap.to(pa, { strokeDashoffset: 0, attr: { 'stroke-width': 720 }, duration: 1.35, ease: 'power2.out' })
    gsap.to(pb, { strokeDashoffset: 0, attr: { 'stroke-width': 700 }, duration: 1.35, ease: 'power2.out', delay: 0.1 })
    // img2 fades through ink
    gsap.to(img,  { opacity: 1, duration: 0.65, ease: 'power2.out', delay: 0.38 })
    // Gold rule expands
    if (rule) gsap.to(rule, { scaleX: 1, duration: 0.55, ease: 'power3.out', delay: 0.28 })
  }, [])

  /* ── Hover out ── */
  const onLeave = useCallback(() => {
    if (isTouch.current) return
    const pa   = refA.current
    const pb   = refB.current
    const img  = img2Ref.current
    const rule = ruleRef.current
    const [la, lb] = lens.current
    if (!pa || !pb) return
    gsap.killTweensOf([pa, pb, img, rule])
    gsap.to(pa,  { strokeDashoffset: la, attr: { 'stroke-width': 160 }, duration: 0.85, ease: 'power2.inOut' })
    gsap.to(pb,  { strokeDashoffset: lb, attr: { 'stroke-width': 160 }, duration: 0.85, ease: 'power2.inOut' })
    gsap.to(img, { opacity: 0, duration: 0.38, ease: 'power2.in' })
    if (rule) gsap.to(rule, { scaleX: 0, transformOrigin: 'right', duration: 0.35, ease: 'power2.in' })
  }, [])

  return (
    <div
      className={`fp2-card fp2-card-${index}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#111009',
        borderRadius: '2px',
      }}
    >
      {/* Gradient veils */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(to top, rgba(6,4,2,0.88) 0%, rgba(6,4,2,0.12) 46%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(to bottom, rgba(6,4,2,0.5) 0%, transparent 28%)',
        pointerEvents: 'none',
      }} />

      {/* Image 1 */}
      <img
        src={img1}
        alt={product.name}
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: isHero ? 'center 8%' : 'center 15%',
        }}
      />

      {/* Ink A */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%) scale(1.55)',
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 2,
      }}>
        <svg viewBox="0 0 2453 2273" fill="none" style={{ width: '100%', height: '100%' }}>
          <path ref={refA} d={PATH_A} stroke="rgba(8,6,4,0.92)" strokeLinecap="round" />
        </svg>
      </div>

      {/* Ink B */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%) scale(1.55)',
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 3,
      }}>
        <svg viewBox="0 0 2250 2535" fill="none" style={{ width: '100%', height: '100%' }}>
          <path ref={refB} d={PATH_B} stroke="rgba(22,16,10,0.84)" strokeLinecap="round" />
        </svg>
      </div>

      {/* Image 2 — revealed through ink */}
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

      {/* Veil over img2 */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        background: 'linear-gradient(to top, rgba(4,2,0,0.88) 0%, rgba(4,2,0,0.18) 50%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── TOP: ghost number + category pill ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 6,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: isHero
          ? 'clamp(1rem,2vw,1.5rem) clamp(1rem,2vw,1.4rem)'
          : 'clamp(.65rem,1.3vw,1rem) clamp(.7rem,1.3vw,1rem)',
      }}>
        <span style={{
          fontFamily: 'var(--fd)',
          fontWeight: 300,
          fontSize: isHero ? 'clamp(4rem,7vw,8.5rem)' : 'clamp(2.2rem,3.8vw,5rem)',
          lineHeight: 0.82,
          letterSpacing: '-0.04em',
          color: 'rgba(250,248,245,0.1)',
          userSelect: 'none',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {numLabel}
        </span>
        <span style={{
          fontFamily: 'var(--fb)',
          fontSize: '.36rem',
          letterSpacing: '.26em',
          textTransform: 'uppercase',
          color: 'rgba(250,248,245,0.35)',
          border: '1px solid rgba(250,248,245,0.12)',
          padding: '.22rem .55rem',
          backdropFilter: 'blur(8px)',
          background: 'rgba(6,4,2,0.3)',
        }}>
          {cat}
        </span>
      </div>

      {/* ── BOTTOM LABEL — always visible ── */}
      <div
        className="fp2-ink-label"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 6,
          padding: isHero
            ? 'clamp(1.2rem,3vw,2.4rem) clamp(1rem,2.5vw,1.8rem)'
            : 'clamp(.85rem,1.8vw,1.4rem) clamp(.85rem,1.8vw,1.3rem)',
        }}
      >
        {/* Gold rule — animates on hover via ruleRef */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, rgba(184,149,96,0.75), rgba(184,149,96,0.15), transparent)',
          width: isHero ? '52%' : '62%',
          marginBottom: isHero ? '.85rem' : '.55rem',
          transformOrigin: 'left',
        }}>
          {/* Inner div is what we scale */}
          <div ref={ruleRef} style={{
            height: '100%',
            background: 'inherit',
            width: '100%',
          }} />
        </div>

        {/* Product name */}
        <p style={{
          fontFamily: 'var(--fd)',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: isHero
            ? 'clamp(1.1rem,2.2vw,2rem)'
            : 'clamp(0.82rem,1.25vw,1.18rem)',
          color: 'rgba(250,248,245,0.95)',
          letterSpacing: '-0.015em',
          lineHeight: 1.1,
          marginBottom: isHero ? '.75rem' : '.5rem',
        }}>
          {product.name}
        </p>

        {/* Price + CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '.6rem',
          flexWrap: 'wrap',
        }}>
          <div>
            {product.comparePrice > 0 && product.comparePrice > product.basePrice && (
              <span style={{
                display: 'block',
                fontFamily: 'var(--fb)',
                fontSize: '.4rem',
                letterSpacing: '.06em',
                color: 'rgba(250,248,245,0.22)',
                textDecoration: 'line-through',
                marginBottom: '.05rem',
              }}>
                ₹{product.comparePrice?.toLocaleString('en-IN')}
              </span>
            )}
            <span style={{
              fontFamily: 'var(--fb)',
              fontWeight: 300,
              fontSize: isHero ? '.65rem' : '.54rem',
              letterSpacing: '.1em',
              color: 'rgba(250,248,245,0.5)',
            }}>
              ₹{price.toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            to={`/product/${product.slug ?? product._id}`}
            onClick={e => e.stopPropagation()}
            style={{
              fontFamily: 'var(--fb)',
              fontWeight: 400,
              fontSize: '.36rem',
              letterSpacing: '.26em',
              textTransform: 'uppercase',
              color: 'rgba(250,248,245,0.75)',
              display: 'flex',
              alignItems: 'center',
              gap: '.38rem',
              paddingBottom: '1px',
              borderBottom: '1px solid rgba(250,248,245,0.14)',
              transition: 'color .22s, gap .28s, border-color .22s',
              whiteSpace: 'nowrap',
              minHeight: '44px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color       = '#C9A96E'
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'
              e.currentTarget.style.gap         = '.6rem'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color       = 'rgba(250,248,245,0.75)'
              e.currentTarget.style.borderColor = 'rgba(250,248,245,0.14)'
              e.currentTarget.style.gap         = '.38rem'
            }}
          >
            View Piece
            <svg width="14" height="5" viewBox="0 0 14 5" fill="none" aria-hidden="true">
              <line x1="0" y1="2.5" x2="10.5" y2="2.5" stroke="currentColor" strokeWidth="0.8"/>
              <path d="M8 1L11.5 2.5L8 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {isHero && (
          <p style={{
            marginTop: '.8rem',
            fontFamily: 'var(--fb)',
            fontSize: '.36rem',
            letterSpacing: '.36em',
            textTransform: 'uppercase',
            color: 'rgba(184,149,96,0.38)',
          }}>
            {product.brand ?? 'AURA'}
          </p>
        )}
      </div>

      {/* Gold dot */}
      <div style={{
        position: 'absolute',
        top: isHero ? '1rem' : '.72rem',
        right: isHero ? '1rem' : '.72rem',
        width: 4, height: 4,
        borderRadius: '50%',
        background: 'var(--go)',
        opacity: 0.4,
        zIndex: 6,
        pointerEvents: 'none',
      }} />
    </div>
  )
}

/* ─── Section ───────────────────────────────────────────────────── */
export default function FeaturedProducts() {
  const sectionRef = useRef(null)
  const { data, isLoading } = useFeaturedProducts()

  const api      = data?.data?.products ?? data?.data ?? []
  const products = Array.isArray(api) && api.length ? api : MOCK_FEATURED

  useGSAP(() => {
    if (isLoading || !products.length) return
    const root = sectionRef.current
    if (!root) return

    const st = { trigger: root, start: 'top 80%', once: true }

    gsap.from('.fp2-eyebrow', { opacity: 0, y: 10, duration: 0.8,  ease: 'power3.out', scrollTrigger: st })
    gsap.from('.fp2-heading', { opacity: 0, y: 20, duration: 1.05, ease: 'power3.out', delay: 0.07, scrollTrigger: st })
    gsap.from('.fp2-meta',    { opacity: 0, y: 8,  duration: 0.7,  ease: 'power3.out', delay: 0.1,  scrollTrigger: st })
    gsap.from('.fp2-viewall', { opacity: 0, x: 10, duration: 0.85, ease: 'power3.out', delay: 0.15, scrollTrigger: st })
    gsap.from('.fp2-rule',    {
      scaleX: 0, duration: 1.25, ease: 'power3.inOut', transformOrigin: 'left',
      scrollTrigger: { ...st, start: 'top 84%' },
    })

    const isMobile = window.matchMedia('(max-width: 640px)').matches
    if (!isMobile) {
      gsap.fromTo(
        root.querySelectorAll('.fp2-card'),
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1, ease: 'power3.inOut',
          stagger: { each: 0.16, ease: 'power1.out' },
          delay: 0.08,
          scrollTrigger: st,
        }
      )
    }
  }, { scope: sectionRef, dependencies: [isLoading, products.length] })

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(3.5rem,8vw,8rem) clamp(1rem,5vw,5vw)',
        background: 'var(--cr)',
      }}
    >
      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 'clamp(1rem,2vw,1.8rem)',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <span className="fp2-eyebrow" style={{
            display: 'block',
            fontFamily: 'var(--fb)',
            fontWeight: 400,
            fontSize: '.46rem',
            letterSpacing: '.38em',
            textTransform: 'uppercase',
            color: 'var(--go)',
            marginBottom: '.5rem',
          }}>
            Curated Selection
          </span>
          <h2 className="fp2-heading" style={{
            fontFamily: 'var(--fd)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem,3.2vw,3rem)',
            lineHeight: 1.06,
            letterSpacing: '-0.02em',
            color: 'var(--ch)',
          }}>
            Featured Pieces
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem' }}>
          <span className="fp2-meta" style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(1.8rem,2.5vw,2.8rem)',
            fontWeight: 300,
            color: 'rgba(26,23,20,0.055)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            userSelect: 'none',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {String(products.slice(0,4).length).padStart(2,'0')}
          </span>

          <Link
            to="/collection"
            className="fp2-viewall"
            style={{
              fontFamily: 'var(--fb)',
              fontSize: '.46rem',
              letterSpacing: '.28em',
              textTransform: 'uppercase',
              color: 'var(--mu)',
              display: 'flex',
              alignItems: 'center',
              gap: '.5rem',
              paddingBottom: '1px',
              borderBottom: '1px solid transparent',
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
      </div>

      {/* Gold rule */}
      <div className="fp2-rule" style={{
        height: '1px',
        background: 'linear-gradient(to right, var(--go), rgba(184,149,96,0.1), transparent)',
        marginBottom: 'clamp(1.4rem,3vw,2.8rem)',
        transformOrigin: 'left center',
      }} />

      {/* Grid */}
      {isLoading ? (
        <div className="loader"><div className="loader-ring" /></div>
      ) : (
        <div className="fp2-grid">
          {products.slice(0, 4).map((p, i) => (
            <InkCard key={p._id} product={p} index={i} />
          ))}
        </div>
      )}

      {/* Bottom strip */}
      <div style={{
        marginTop: 'clamp(1.2rem,2vw,2rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'clamp(.8rem,1.5vw,1.1rem)',
        borderTop: '1px solid var(--bo)',
      }}>
        <span style={{
          fontFamily: 'var(--fb)',
          fontSize: '.4rem',
          letterSpacing: '.35em',
          textTransform: 'uppercase',
          color: 'rgba(26,23,20,0.2)',
          userSelect: 'none',
        }}>
          AURA — High Fashion
        </span>
        <span style={{
          fontFamily: 'var(--fb)',
          fontSize: '.4rem',
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          color: 'rgba(26,23,20,0.2)',
          userSelect: 'none',
        }}>
          SS 2025 · The Edit
        </span>
      </div>
    </section>
  )
}

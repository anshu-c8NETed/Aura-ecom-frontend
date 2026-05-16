import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useFeaturedProducts } from '../../hooks/useProducts'
import ProductCard from '../product/ProductCard'
import { MOCK_PRODUCTS } from '../../data/mockProducts'
import RevealText from '../layout/RevealText'

gsap.registerPlugin(ScrollTrigger)

const MOCK_FEATURED = MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, 4)

export default function FeaturedProducts() {
  const containerRef = useRef(null)
  const { data, isLoading } = useFeaturedProducts()

  const apiProducts = data?.data?.products ?? data?.data ?? []
  const products    = Array.isArray(apiProducts) && apiProducts.length ? apiProducts : MOCK_FEATURED

  useGSAP(() => {
    if (isLoading || !products.length) return

    const grid = containerRef.current?.querySelector('.fp-grid')
    if (!grid) return

    const rect           = grid.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight * 0.76

    if (alreadyVisible) {
      gsap.set('.fp-card', { opacity: 1, y: 0 })
      return
    }

    /* ── Card entrance: stagger up with scale + clip-path ── */
    gsap.fromTo('.fp-card',
      { opacity: 0, y: 60, scale: 0.96, clipPath: 'inset(8% 0 0 0)' },
      {
        opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0 0 0)',
        stagger: { amount: 0.6, from: 'start' },
        duration: 1,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.fp-grid',
          start: 'top 80%',
          once: true,
        },
      }
    )

    /* ── Per-card image parallax at different speeds ── */
    containerRef.current.querySelectorAll('.fp-card img').forEach((img, i) => {
      gsap.to(img, {
        yPercent: -10 - i * 3,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.fp-card'),
          start: 'top bottom',
          end:   'bottom top',
          scrub: 0.3 + i * 0.12,
        },
      })
    })

    /* ── Header eyebrow line sweep ── */
    gsap.from('.fp-rule', {
      scaleX: 0, duration: 1, ease: 'power3.out', transformOrigin: 'left',
      scrollTrigger: { trigger: '.fp-rule', start: 'top 90%', once: true },
    })
  }, { scope: containerRef, dependencies: [isLoading, products.length] })

  return (
    <section ref={containerRef} className="section">
      {/* ── Header ── */}
      <div className="section-header fp-header">
        <div>
          <span className="eyebrow">Curated Selection</span>
          <RevealText tag="h2" className="display-heading" stagger={0.03} start="top 85%">
            Featured Pieces
          </RevealText>
        </div>
        <Link to="/collection" className="va-link" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          View All <ArrowRight size={13} strokeWidth={1.5} />
        </Link>
      </div>

      {/* Thin accent rule — sweeps in */}
      <div className="fp-rule" style={{
        height: 1,
        background: 'linear-gradient(to right, var(--go), var(--bo))',
        marginBottom: 'clamp(2rem,4vw,3.5rem)',
      }} />

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="loader"><div className="loader-ring" /></div>
      ) : (
        <div className="fp-grid">
          {products.slice(0, 4).map(product => (
            <div key={product._id} className="fp-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

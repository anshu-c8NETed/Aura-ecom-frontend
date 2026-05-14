import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useFeaturedProducts } from '../../hooks/useProducts'
import ProductCard from '../product/ProductCard'
import { MOCK_PRODUCTS } from '../../data/mockProducts'

gsap.registerPlugin(ScrollTrigger)

const MOCK_FEATURED = MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, 4)

export default function FeaturedProducts() {
  const containerRef = useRef(null)
  const { data, isLoading } = useFeaturedProducts()

  /**
   * Resolve products from API response, falling back to mock data.
   *
   * WHY NOT || :
   *   [] is truthy in JS, so `data?.data || MOCK_FEATURED` short-circuits
   *   to [] when the API returns an empty array — mock fallback never runs.
   *   We check .length explicitly instead.
   */
  const apiProducts = data?.data?.products ?? data?.data ?? []
  const products    = Array.isArray(apiProducts) && apiProducts.length
    ? apiProducts
    : MOCK_FEATURED

  /* ── Header entrance ─────────────────────────────────────────────── */
  useGSAP(() => {
    gsap.from('.fp-header', {
      opacity: 0,
      y: 28,
      duration: 0.75,
      immediateRender: false,
      scrollTrigger: { trigger: '.fp-header', start: 'top 82%', once: true },
    })
  }, { scope: containerRef })

  /* ── Product cards entrance ──────────────────────────────────────── */
  useGSAP(() => {
    if (isLoading || !products.length) return

    const grid = containerRef.current?.querySelector('.product-grid')
    if (!grid) return

    // If the section is already in view when data arrives, skip the
    // scroll animation and just show cards — otherwise they stay at opacity:0
    const rect           = grid.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight * 0.76

    if (alreadyVisible) {
      gsap.set('.fp-card', { opacity: 1, y: 0 })
      return
    }

    gsap.from('.fp-card', {
      opacity: 0,
      y: 36,
      stagger: 0.1,
      duration: 0.75,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.product-grid',
        start:   'top 76%',
        once:    true,
      },
    })
  }, { scope: containerRef, dependencies: [isLoading, products.length] })

  return (
    <section ref={containerRef} className="section">
      <div className="section-header fp-header">
        <div>
          <span className="eyebrow">Curated Selection</span>
          <h2 className="display-heading">Featured <em>Pieces</em></h2>
        </div>
        <Link to="/collection" className="va-link">View All</Link>
      </div>

      {isLoading ? (
        <div className="loader"><div className="loader-ring" /></div>
      ) : (
        <div className="product-grid">
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
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
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

  /* ── Cards: stagger up from below on scroll entry ── */
  useGSAP(() => {
    if (isLoading || !products.length) return

    const grid = containerRef.current?.querySelector('.product-grid')
    if (!grid) return

    const rect           = grid.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight * 0.76

    if (alreadyVisible) {
      gsap.set('.fp-card', { opacity: 1, y: 0 })
      return
    }

    // Staggered upward reveal — each card also gets a subtle scale
    gsap.from('.fp-card', {
      opacity: 0,
      y: 50,
      scale: 0.97,
      stagger: { amount: 0.5, from: 'start' },
      duration: 0.85,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.product-grid',
        start: 'top 78%',
        once: true,
      },
    })

    // Subtle parallax on each card image — they move at slightly different rates
    // (evokes the Canvas.jsx data-scroll-speed stagger from the inspiration)
    containerRef.current.querySelectorAll('.fp-card img').forEach((img, i) => {
      const speed = 0.04 + i * 0.015
      gsap.to(img, {
        yPercent: -8 - i * 3,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.fp-card'),
          start: 'top bottom',
          end:   'bottom top',
          scrub: speed,
        },
      })
    })
  }, { scope: containerRef, dependencies: [isLoading, products.length] })

  return (
    <section ref={containerRef} className="section">
      <div className="section-header fp-header">
        <div>
          <span className="eyebrow">Curated Selection</span>
          <RevealText tag="h2" className="display-heading" stagger={0.03} start="top 85%">
            Featured Pieces
          </RevealText>
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
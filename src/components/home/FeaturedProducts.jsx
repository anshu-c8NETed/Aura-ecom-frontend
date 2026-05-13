import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useFeaturedProducts } from '../../hooks/useProducts'
import ProductCard from '../product/ProductCard'
import { MOCK_PRODUCTS } from '../../data/mockProducts'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedProducts() {
  const containerRef = useRef(null)
  const { data, isLoading } = useFeaturedProducts()
  const products = data?.data?.products || data?.data || MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, 4)

  useGSAP(() => {
    gsap.from('.fp-header', {
      opacity: 0, y: 28, duration: .75,
      scrollTrigger: { trigger: '.fp-header', start: 'top 82%' },
    })
    gsap.from('.fp-card', {
      opacity: 0, y: 36, stagger: .1, duration: .75, ease: 'power3.out',
      scrollTrigger: { trigger: '.product-grid', start: 'top 76%' },
    })
  }, { scope: containerRef })

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
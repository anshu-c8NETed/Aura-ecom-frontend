import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useFeaturedProducts } from '../../hooks/useProducts'
import ProductCard from '../product/ProductCard'

gsap.registerPlugin(ScrollTrigger)

// Mock data shown while API loads / has no data yet
const MOCK_PRODUCTS = [
  { _id: '1', slug: 'noir-silk-gown', name: 'Noir Silk Gown', brand: 'AURA', basePrice: 28500, comparePrice: 0, images: [], variants: [{ _id: 'v1', size: 'S', color: 'Noir', stock: 5 }], isNewArrival: true },
  { _id: '2', slug: 'ivory-wool-coat', name: 'Ivory Wool Coat', brand: 'AURA', basePrice: 42000, comparePrice: 52000, images: [], variants: [{ _id: 'v2', size: 'M', color: 'Ivory', stock: 3 }] },
  { _id: '3', slug: 'camel-blazer', name: 'Camel Structured Blazer', brand: 'AURA', basePrice: 18500, comparePrice: 0, images: [], variants: [{ _id: 'v3', size: 'S', color: 'Camel', stock: 8 }] },
  { _id: '4', slug: 'velvet-slip', name: 'Velvet Bias Slip', brand: 'AURA', basePrice: 12800, comparePrice: 15000, images: [], variants: [{ _id: 'v4', size: 'XS', color: 'Burgundy', stock: 2 }], isNewArrival: true },
]

export default function FeaturedProducts() {
  const containerRef = useRef(null)
  const { data, isLoading } = useFeaturedProducts()
  const products = data?.data?.products || data?.data || MOCK_PRODUCTS

  useGSAP(() => {
    gsap.from('.fp-header', {
      opacity: 0, y: 30, duration: .8,
      scrollTrigger: { trigger: '.fp-header', start: 'top 80%' },
    })
    gsap.from('.fp-card', {
      opacity: 0, y: 40, stagger: .12, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: '.product-grid', start: 'top 75%' },
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
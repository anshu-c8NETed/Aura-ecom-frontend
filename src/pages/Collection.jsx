import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/product/ProductCard'

const SORT_OPTIONS = [
  { label: 'Newest',         value: 'newest' },
  { label: 'Price: Low–High',value: 'price_asc' },
  { label: 'Price: High–Low',value: 'price_desc' },
  { label: 'Most Popular',   value: 'popular' },
]

const MOCK_PRODUCTS = [
  { _id: '1', slug: 'noir-silk-gown', name: 'Noir Silk Gown', brand: 'AURA', basePrice: 28500, comparePrice: 0, images: [], variants: [{ _id: 'v1', size: 'S', color: 'Noir', stock: 5 }], isNewArrival: true },
  { _id: '2', slug: 'ivory-wool-coat', name: 'Ivory Wool Coat', brand: 'AURA', basePrice: 42000, comparePrice: 52000, images: [], variants: [{ _id: 'v2', size: 'M', color: 'Ivory', stock: 3 }] },
  { _id: '3', slug: 'camel-blazer', name: 'Camel Structured Blazer', brand: 'AURA', basePrice: 18500, comparePrice: 0, images: [], variants: [{ _id: 'v3', size: 'S', color: 'Camel', stock: 8 }] },
  { _id: '4', slug: 'velvet-slip', name: 'Velvet Bias Slip', brand: 'AURA', basePrice: 12800, comparePrice: 15000, images: [], variants: [{ _id: 'v4', size: 'XS', color: 'Burgundy', stock: 2 }], isNewArrival: true },
  { _id: '5', slug: 'cashmere-wrap', name: 'Cashmere Wrap Coat', brand: 'AURA', basePrice: 58000, comparePrice: 0, images: [], variants: [{ _id: 'v5', size: 'M', color: 'Camel', stock: 4 }] },
  { _id: '6', slug: 'silk-blouse', name: 'Duchesse Silk Blouse', brand: 'AURA', basePrice: 16800, comparePrice: 0, images: [], variants: [{ _id: 'v6', size: 'S', color: 'Ivory', stock: 6 }] },
  { _id: '7', slug: 'wide-trousers', name: 'Wide-Leg Trousers', brand: 'AURA', basePrice: 14200, comparePrice: 18000, images: [], variants: [{ _id: 'v7', size: 'M', color: 'Ecru', stock: 9 }] },
  { _id: '8', slug: 'knit-dress', name: 'Merino Knit Dress', brand: 'AURA', basePrice: 22400, comparePrice: 0, images: [], variants: [{ _id: 'v8', size: 'S', color: 'Espresso', stock: 3 }] },
]

export default function Collection() {
  const [searchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sort, setSort] = useState('newest')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const headerRef = useRef(null)

  const params = {
    sort,
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    isFeatured: searchParams.get('filter') === 'featured' || undefined,
    isNewArrival: searchParams.get('filter') === 'new' || undefined,
  }

  const { data, isLoading } = useProducts(params)
  const products = data?.data?.products || data?.data || MOCK_PRODUCTS

  useGSAP(() => {
    gsap.from(headerRef.current, { opacity: 0, y: 20, duration: .7, ease: 'power2.out' })
  }, { scope: headerRef })

  useEffect(() => {
    gsap.from('.col-card', { opacity: 0, y: 30, stagger: .07, duration: .6, ease: 'power2.out' })
  }, [products.length])

  return (
    <div className="page-offset">
      {/* Page header */}
      <div ref={headerRef} style={{
        padding: 'clamp(2rem,5vw,4.5rem) 5vw 2rem',
        borderBottom: '1px solid var(--bo)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div>
          <span className="eyebrow">
            {searchParams.get('search') ? `Search: "${searchParams.get('search')}"` : searchParams.get('category') ? searchParams.get('category').charAt(0).toUpperCase() + searchParams.get('category').slice(1) : 'All Collections'}
          </span>
          <h1 className="display-heading">
            {searchParams.get('filter') === 'new' ? <>New <em>Arrivals</em></> : searchParams.get('filter') === 'sale' ? <>On <em>Sale</em></> : <>The <em>Collection</em></>}
          </h1>
        </div>
        <p style={{ fontSize: '.72rem', color: 'var(--mu)', letterSpacing: '.08em' }}>
          {products.length} pieces
        </p>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Sidebar filters */}
        <aside style={{
          width: filtersOpen ? 240 : 0,
          overflow: 'hidden',
          transition: 'width .4s var(--tr)',
          flexShrink: 0,
          borderRight: filtersOpen ? '1px solid var(--bo)' : 'none',
        }}>
          <div style={{ padding: '2rem 1.5rem', width: 240 }}>
            <h3 style={{ fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '2rem', color: 'var(--mu)' }}>Refine</h3>

            {/* Price range */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '.6rem', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--ch)' }}>Price</p>
              <input type="range" min={0} max={100000} step={1000}
                value={priceRange[1]}
                onChange={e => setPriceRange([0, Number(e.target.value)])}
                style={{ width: '100%', accentColor: 'var(--go)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.65rem', color: 'var(--mu)', marginTop: '.4rem' }}>
                <span>₹0</span>
                <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '.6rem', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--ch)' }}>Size</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                {['XS','S','M','L','XL','XXL'].map(sz => (
                  <button key={sz} style={{
                    padding: '.3rem .6rem', border: '1px solid var(--bo)',
                    background: 'none', fontSize: '.65rem', letterSpacing: '.08em',
                    cursor: 'pointer', fontFamily: 'var(--fb)',
                    transition: 'border-color .2s, background .2s',
                  }}
                  onMouseEnter={e => { e.target.style.borderColor = 'var(--go)'; e.target.style.background = 'var(--cr2)' }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--bo)'; e.target.style.background = 'none' }}
                  >{sz}</button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, padding: '1.8rem 5vw' }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--bo)',
          }}>
            <button
              onClick={() => setFiltersOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: '.5rem', background: 'none', border: 'none', fontFamily: 'var(--fb)', fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer', color: 'var(--ch)' }}
            >
              {filtersOpen ? <X size={14} /> : <SlidersHorizontal size={14} />}
              {filtersOpen ? 'Close Filters' : 'Filters'}
            </button>

            <select
              value={sort} onChange={e => setSort(e.target.value)}
              style={{ background: 'none', border: '1px solid var(--bo)', fontFamily: 'var(--fb)', fontSize: '.62rem', letterSpacing: '.1em', padding: '.4rem .8rem', color: 'var(--ch)', cursor: 'pointer', outline: 'none' }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {isLoading ? (
            <div className="loader"><div className="loader-ring" /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.4rem' }}>
              {products.map(product => (
                <div key={product._id} className="col-card">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
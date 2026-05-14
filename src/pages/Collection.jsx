import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/product/ProductCard'
import { MOCK_PRODUCTS } from '../data/mockProducts'

const SORT_OPTIONS = [
  { label: 'Newest',          value: 'newest' },
  { label: 'Price: Low–High', value: 'price_asc' },
  { label: 'Price: High–Low', value: 'price_desc' },
  { label: 'Most Popular',    value: 'popular' },
]

export default function Collection() {
  const [searchParams]  = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sort,        setSort]        = useState('newest')
  const [priceRange,  setPriceRange]  = useState([0, 100000])
  const [activeSize,  setActiveSize]  = useState(null)
  const headerRef = useRef(null)

  const params = {
    sort,
    search:       searchParams.get('search')   || undefined,
    category:     searchParams.get('category') || undefined,
    isFeatured:   searchParams.get('filter') === 'featured' || undefined,
    isNewArrival: searchParams.get('filter') === 'new' || undefined,
  }

  const { data, isLoading } = useProducts(params)

  // Filter mock products based on URL params
  const filteredMocks = MOCK_PRODUCTS.filter(p => {
    if (params.isNewArrival) return p.isNewArrival
    if (params.isFeatured)   return p.isFeatured
    if (params.category)     return p.category === params.category
    if (params.search)       return p.name.toLowerCase().includes(params.search.toLowerCase())
    return true
  })

  // Bug fix: [] is truthy in JS, so we can't use ||
  // Only use API data if it's a non-empty array
  const raw = data?.data?.products ?? data?.data ?? null
  const products = (Array.isArray(raw) && raw.length > 0) ? raw : filteredMocks

  useGSAP(() => {
    gsap.from(headerRef.current, { opacity: 0, y: 18, duration: .65, ease: 'power2.out' })
  }, { scope: headerRef })

  useEffect(() => {
    gsap.from('.col-card', {
      opacity: 0, y: 28, stagger: .06, duration: .55, ease: 'power2.out',
    })
  }, [products.length])

  const category = searchParams.get('category')
  const filter   = searchParams.get('filter')
  const search   = searchParams.get('search')

  const pageTitle = filter === 'new'  ? <><em>New</em> Arrivals</>
                  : filter === 'sale' ? <>On <em>Sale</em></>
                  : category          ? <>{category.charAt(0).toUpperCase() + category.slice(1)}</>
                  : <>The <em>Collection</em></>

  const eyebrow = search    ? `Search: "${search}"`
                : category  ? category.charAt(0).toUpperCase() + category.slice(1)
                : 'All Collections'

  return (
    <div className="page-offset">
      {/* ── Page header ── */}
      <div ref={headerRef} style={{
        padding: 'clamp(2rem,5vw,4.5rem) 5vw 2rem',
        borderBottom: '1px solid var(--bo)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="display-heading">{pageTitle}</h1>
        </div>
        <p style={{ fontSize: '.72rem', color: 'var(--mu)', letterSpacing: '.08em' }}>
          {products.length} pieces
        </p>
      </div>

      <div style={{ display: 'flex' }}>
        {/* ── Sidebar filters ── */}
        <aside style={{
          width: filtersOpen ? 240 : 0,
          overflow: 'hidden',
          transition: 'width .4s var(--tr)',
          flexShrink: 0,
          borderRight: filtersOpen ? '1px solid var(--bo)' : 'none',
        }}>
          <div style={{ padding: '2rem 1.5rem', width: 240 }}>
            <h3 style={{
              fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase',
              marginBottom: '2rem', color: 'var(--mu)',
            }}>
              Refine
            </h3>

            {/* Price range */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '.6rem', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--ch)' }}>Price</p>
              <input
                type="range" min={0} max={100000} step={1000}
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
                  <button
                    key={sz}
                    onClick={() => setActiveSize(activeSize === sz ? null : sz)}
                    style={{
                      padding: '.3rem .65rem',
                      border: `1px solid ${activeSize === sz ? 'var(--ch)' : 'var(--bo)'}`,
                      background: activeSize === sz ? 'var(--ch)' : 'none',
                      color: activeSize === sz ? 'var(--cr)' : 'var(--ch)',
                      fontSize: '.65rem', letterSpacing: '.08em',
                      cursor: 'pointer', fontFamily: 'var(--fb)',
                      transition: 'all .2s',
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color filter */}
            <div>
              <p style={{ fontSize: '.6rem', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--ch)' }}>Colour</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                {[
                  { name: 'Noir',     hex: '#1A1714' },
                  { name: 'Ivory',    hex: '#F5F0E8' },
                  { name: 'Camel',    hex: '#C09458' },
                  { name: 'Burgundy', hex: '#6B2737' },
                  { name: 'Ecru',     hex: '#E8DDD0' },
                ].map(c => (
                  <button
                    key={c.name}
                    title={c.name}
                    style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: c.hex,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 0 0 1px rgba(0,0,0,.15)',
                      outline: '2px solid transparent',
                      outlineOffset: '2px',
                      transition: 'outline .2s',
                      minHeight: 'unset', minWidth: 'unset',
                    }}
                    onMouseEnter={e => e.currentTarget.style.outlineColor = 'var(--ch)'}
                    onMouseLeave={e => e.currentTarget.style.outlineColor = 'transparent'}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div style={{ flex: 1, padding: '1.8rem 5vw' }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--bo)',
          }}>
            <button
              onClick={() => setFiltersOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.5rem',
                background: 'none', border: 'none',
                fontFamily: 'var(--fb)', fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase',
                cursor: 'pointer', color: 'var(--ch)',
              }}
            >
              {filtersOpen ? <X size={14} strokeWidth={1.5} /> : <SlidersHorizontal size={14} strokeWidth={1.5} />}
              {filtersOpen ? 'Close' : 'Filters'}
            </button>

            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                background: 'none', border: '1px solid var(--bo)',
                fontFamily: 'var(--fb)', fontSize: '.62rem', letterSpacing: '.1em',
                padding: '.4rem .8rem', color: 'var(--ch)',
                cursor: 'pointer', outline: 'none',
              }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {isLoading ? (
            <div className="loader"><div className="loader-ring" /></div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.4rem',
            }}>
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
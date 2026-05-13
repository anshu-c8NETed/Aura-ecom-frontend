import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Heart, ChevronDown, ChevronUp, Star, Truck, RefreshCw, Shield } from 'lucide-react'
import { useProduct } from '../hooks/useProducts'
import useCartStore from '../store/useCartStore'
import useWishlistStore from '../store/useWishlistStore'

// Mock product for dev
const MOCK = {
  _id: 'm1', slug: 'noir-silk-gown', name: 'Noir Silk Evening Gown',
  brand: 'AURA', basePrice: 28500, comparePrice: 35000,
  description: 'Cut from the finest silk charmeuse, this column gown falls with effortless elegance. The deep V-neckline and bias-cut construction ensure a silhouette that moves with the body, never against it.',
  material: '100% Silk Charmeuse', madeIn: 'France',
  ratingsAverage: 4.8, ratingsCount: 24,
  isNewArrival: true,
  images: [],
  variants: [
    { _id: 'v1', size: 'XS', color: 'Noir', colorHex: '#1A1714', stock: 3, price: 28500 },
    { _id: 'v2', size: 'S',  color: 'Noir', colorHex: '#1A1714', stock: 5, price: 28500 },
    { _id: 'v3', size: 'M',  color: 'Noir', colorHex: '#1A1714', stock: 2, price: 28500 },
    { _id: 'v4', size: 'L',  color: 'Noir', colorHex: '#1A1714', stock: 0, price: 28500 },
    { _id: 'v5', size: 'XS', color: 'Ivory', colorHex: '#F5F0E8', stock: 4, price: 28500 },
    { _id: 'v6', size: 'S',  color: 'Ivory', colorHex: '#F5F0E8', stock: 6, price: 28500 },
  ],
  careInstructions: ['Dry clean only', 'Cool iron if needed', 'Store hanging'],
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useProduct(slug)
  const product = data?.data || MOCK

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize,  setSelectedSize]  = useState(null)
  const [activeImg,     setActiveImg]     = useState(0)
  const [adding,        setAdding]        = useState(false)
  const [sizeErr,       setSizeErr]       = useState(false)
  const [openAccordion, setOpenAccordion] = useState('details')

  const addItem = useCartStore(s => s.addItem)
  const { toggle, has } = useWishlistStore()
  const wished = has(product._id)

  const containerRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: .7 } })
    tl.from('.pd-gallery', { opacity: 0, x: -30 }, 0)
    tl.from('.pd-info > *', { opacity: 0, y: 22, stagger: .1 }, .15)
  }, { scope: containerRef })

  // Unique colors and sizes
  const colors = [...new Map(product.variants.map(v => [v.color, v])).values()]
  const activeColor = selectedColor || colors[0]?.color
  const sizesForColor = product.variants.filter(v => v.color === activeColor)

  const selectedVariant = product.variants.find(v => v.color === activeColor && v.size === selectedSize)

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeErr(true); setTimeout(() => setSizeErr(false), 2000); return }
    if (!selectedVariant || selectedVariant.stock === 0) return
    setAdding(true)
    addItem(product, selectedVariant, 1)
    setTimeout(() => setAdding(false), 900)
  }

  if (isLoading) return <div className="loader" style={{ marginTop: 100 }}><div className="loader-ring" /></div>

  const isOnSale = product.comparePrice > 0 && product.comparePrice > product.basePrice

  return (
    <div className="page-offset" ref={containerRef}>
      {/* Breadcrumb */}
      <div style={{ padding: '1rem 5vw', display: 'flex', gap: '.6rem', alignItems: 'center' }}>
        {[['Home', '/'], ['Collection', '/collection'], [product.name, null]].map(([label, to], i) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            {i > 0 && <span style={{ color: 'var(--cr3)', fontSize: '.7rem' }}>›</span>}
            {to ? (
              <Link to={to} style={{ fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mu)', transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--ch)'}
                onMouseLeave={e => e.target.style.color = 'var(--mu)'}
              >{label}</Link>
            ) : (
              <span style={{ fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ch)' }}>{label}</span>
            )}
          </span>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', padding: '1rem 5vw 5rem' }}>

        {/* Gallery */}
        <div className="pd-gallery" style={{ display: 'flex', gap: '1rem' }}>
          {/* Thumbnails */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', width: 70 }}>
            {(product.images.length > 0 ? product.images : Array(4).fill(null)).map((img, i) => (
              <div key={i} onClick={() => setActiveImg(i)} style={{
                width: 70, aspectRatio: '2/3', background: 'var(--cr2)',
                border: activeImg === i ? '1px solid var(--ch)' : '1px solid var(--bo)',
                cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
                transition: 'border-color .25s',
              }}>
                {img ? <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <PlaceholderThumb idx={i} />}
              </div>
            ))}
          </div>

          {/* Main image */}
          <div style={{ flex: 1, background: 'var(--cr2)', aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
            {product.images[activeImg] ? (
              <img src={product.images[activeImg].url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <LargeProductFigure color={activeColor} />
            )}
            {product.isNewArrival && (
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--ch)', color: 'var(--cr)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', padding: '.25rem .6rem' }}>
                New Arrival
              </div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="pd-info" style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Brand + name */}
          <div>
            <p style={{ fontSize: '.58rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '.5rem' }}>{product.brand}</p>
            <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '.8rem' }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
              {[1,2,3,4,5].map(n => (
                <Star key={n} size={11} strokeWidth={1.5} fill={n <= Math.round(product.ratingsAverage) ? 'var(--go)' : 'none'} color="var(--go)" />
              ))}
              <span style={{ fontSize: '.6rem', color: 'var(--mu)' }}>{product.ratingsAverage} ({product.ratingsCount} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div>
            <span style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', fontWeight: 300 }}>
              ₹{product.basePrice?.toLocaleString('en-IN')}
            </span>
            {isOnSale && (
              <span style={{ fontSize: '1rem', color: 'var(--mu)', textDecoration: 'line-through', marginLeft: '.7rem' }}>
                ₹{product.comparePrice?.toLocaleString('en-IN')}
              </span>
            )}
            <p style={{ fontSize: '.6rem', color: 'var(--mu)', letterSpacing: '.08em', marginTop: '.3rem' }}>
              Inclusive of all taxes
            </p>
          </div>

          {/* Color */}
          <div>
            <p style={{ fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.75rem' }}>
              Color — <span style={{ color: 'var(--go)' }}>{activeColor}</span>
            </p>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              {colors.map(v => (
                <button key={v.color} onClick={() => { setSelectedColor(v.color); setSelectedSize(null) }} title={v.color}
                  style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: v.colorHex, border: 'none',
                    outline: activeColor === v.color ? '2px solid var(--ch)' : '2px solid transparent',
                    outlineOffset: 2, cursor: 'pointer', transition: 'outline .2s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
              <p style={{ fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase' }}>Size</p>
              <button style={{ background: 'none', border: 'none', fontSize: '.58rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--go)', cursor: 'pointer', fontFamily: 'var(--fb)' }}>
                Size Guide
              </button>
            </div>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {sizesForColor.map(v => (
                <button key={v.size} onClick={() => v.stock > 0 && setSelectedSize(v.size)}
                  disabled={v.stock === 0}
                  style={{
                    width: 44, height: 44, border: selectedSize === v.size ? '1px solid var(--ch)' : `1px solid ${sizeErr ? '#c0392b' : 'var(--bo)'}`,
                    background: selectedSize === v.size ? 'var(--ch)' : 'none',
                    color: selectedSize === v.size ? 'var(--cr)' : v.stock === 0 ? 'var(--cr3)' : 'var(--ch)',
                    fontFamily: 'var(--fb)', fontSize: '.65rem', letterSpacing: '.1em',
                    cursor: v.stock === 0 ? 'not-allowed' : 'pointer',
                    position: 'relative', transition: 'all .25s',
                    textDecoration: v.stock === 0 ? 'line-through' : 'none',
                  }}
                >{v.size}</button>
              ))}
            </div>
            {sizeErr && <p style={{ fontSize: '.6rem', color: '#c0392b', marginTop: '.4rem' }}>Please select a size</p>}
          </div>

          {/* Add to bag + wishlist */}
          <div style={{ display: 'flex', gap: '.7rem' }}>
            <button onClick={handleAddToCart} className="btn-primary" style={{ flex: 1, padding: '1.1rem' }}>
              <span>{adding ? '✓ Added to Bag' : selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
            </button>
            <button onClick={() => toggle(product._id)} style={{
              width: 52, height: 52, border: '1px solid var(--bo)',
              background: wished ? 'var(--ch)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0, transition: 'background .3s, border-color .3s',
            }}>
              <Heart size={16} strokeWidth={1.5} color={wished ? 'var(--cr)' : 'var(--ch)'} fill={wished ? 'var(--cr)' : 'none'} />
            </button>
          </div>

          {/* Trust bar */}
          <div style={{ display: 'flex', gap: '1.5rem', padding: '1.2rem 0', borderTop: '1px solid var(--bo)', borderBottom: '1px solid var(--bo)' }}>
            {[
              [Truck,      'Free Shipping', 'On orders over ₹5000'],
              [RefreshCw,  'Easy Returns',  '30-day returns'],
              [Shield,     'Authenticity',  'Guaranteed genuine'],
            ].map(([Icon, title, sub]) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem', flex: 1 }}>
                <Icon size={14} strokeWidth={1.5} color="var(--go)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.1rem' }}>{title}</p>
                  <p style={{ fontSize: '.58rem', color: 'var(--mu)' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Accordions */}
          {[
            ['details',  'Product Details',    product.description],
            ['material', 'Material & Care',    [product.material, ...(product.careInstructions || [])].join(' · ')],
            ['shipping', 'Shipping & Returns', 'Complimentary standard shipping on orders over ₹5,000. Express shipping available. Returns accepted within 30 days.'],
          ].map(([key, label, content]) => (
            <div key={key} style={{ borderBottom: '1px solid var(--bo)' }}>
              <button onClick={() => setOpenAccordion(openAccordion === key ? null : key)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'none', border: 'none', padding: '1rem 0',
                fontFamily: 'var(--fb)', fontSize: '.62rem', letterSpacing: '.18em', textTransform: 'uppercase',
                color: 'var(--ch)', cursor: 'pointer',
              }}>
                {label}
                {openAccordion === key ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
              </button>
              <div style={{
                maxHeight: openAccordion === key ? 200 : 0,
                overflow: 'hidden', transition: 'max-height .4s var(--tr)',
              }}>
                <p style={{ fontSize: '.78rem', lineHeight: 1.9, color: 'var(--mu)', paddingBottom: '1rem' }}>{content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PlaceholderThumb({ idx }) {
  const accents = ['#2A2018', '#C09458', '#D0BEA8', '#9B8F82']
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--cr2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 16, height: 40, background: accents[idx % 4], opacity: .4 }} />
    </div>
  )
}

function LargeProductFigure({ color }) {
  const bodyColor = color === 'Ivory' ? '#E8DDD0' : '#2A2018'
  const skinColor = '#D0BEA8'
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cr2)' }}>
      <div style={{ position: 'relative', width: 140, height: 340 }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 14, height: 48, background: '#1A1008', borderRadius: '0 0 5px 5px' }} />
        <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 46, height: 56, background: skinColor, borderRadius: '50% 50% 46% 46%' }} />
        <div style={{ position: 'absolute', top: 58, left: '50%', transform: 'translateX(-50%)', width: 18, height: 22, background: skinColor }} />
        <div style={{ position: 'absolute', top: 74, left: '50%', transform: 'translateX(-50%)', width: 70, height: 110, background: bodyColor, clipPath: 'polygon(18% 0%,82% 0%,90% 100%,10% 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 140, height: 180, background: bodyColor, opacity: .85, clipPath: 'polygon(28% 0%,72% 0%,96% 100%,4% 100%)' }} />
        <div style={{ position: 'absolute', top: 88, left: '50%', transform: 'translateX(-50%) translateX(-58px) rotate(15deg)', width: 12, height: 100, background: skinColor, borderRadius: 5 }} />
        <div style={{ position: 'absolute', top: 88, left: '50%', transform: 'translateX(-50%) translateX(44px) rotate(-10deg)', width: 12, height: 84, background: skinColor, borderRadius: 5 }} />
      </div>
    </div>
  )
}
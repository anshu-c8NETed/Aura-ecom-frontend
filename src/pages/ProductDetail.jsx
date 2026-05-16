import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Heart, ChevronDown, ChevronUp, Star, Truck, RefreshCw, Shield } from 'lucide-react'
import { useProduct } from '../hooks/useProducts'
import useCartStore from '../store/useCartStore'
import useWishlistStore from '../store/useWishlistStore'
import useToastStore from '../store/useToastStore'
import { MOCK_PRODUCTS } from '../data/mockProducts'

export default function ProductDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useProduct(slug)

  // Find matching mock product by slug, fallback to first
  const mockProduct = MOCK_PRODUCTS.find(p => p.slug === slug) || MOCK_PRODUCTS[0]

  // Merge mock with extra detail fields
  const MOCK = {
    ...mockProduct,
    description: 'Cut from the finest silk charmeuse, this column gown falls with effortless elegance. The deep V-neckline and bias-cut construction ensure a silhouette that moves with the body, never against it.',
    material: '100% Silk Charmeuse',
    madeIn: 'France',
    ratingsAverage: 4.8,
    ratingsCount: 24,
    careInstructions: ['Dry clean only', 'Cool iron if needed', 'Store hanging'],
  }

  const product = data?.data || MOCK

  const [selectedColor,  setSelectedColor]  = useState(null)
  const [selectedSize,   setSelectedSize]   = useState(null)
  const [activeImg,      setActiveImg]      = useState(0)
  const [adding,         setAdding]         = useState(false)
  const [sizeErr,        setSizeErr]        = useState(false)
  const [openAccordion,  setOpenAccordion]  = useState('details')

  const addItem = useCartStore(s => s.addItem)
  const { toggle, has } = useWishlistStore()
  const showToast = useToastStore(s => s.show)
  const wished = has(product._id)

  const containerRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: .7 } })
    tl.from('.pd-gallery', { opacity: 0, x: -24 }, 0)
    tl.from('.pd-info > *', { opacity: 0, y: 20, stagger: .09 }, .15)
  }, { scope: containerRef })

  const colors = [...new Map(product.variants.map(v => [v.color, v])).values()]
  const activeColor = selectedColor || colors[0]?.color
  const sizesForColor = product.variants.filter(v => v.color === activeColor)
  const selectedVariant = product.variants.find(v => v.color === activeColor && v.size === selectedSize)

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeErr(true); setTimeout(() => setSizeErr(false), 2000); return }
    if (!selectedVariant || selectedVariant.stock === 0) return
    setAdding(true)
    addItem(product, selectedVariant, 1)
    showToast(`${product.name} — ${selectedSize} added to bag`, { type: 'success' })
    setTimeout(() => setAdding(false), 900)
  }

  if (isLoading) return (
    <div className="loader" style={{ marginTop: 100 }}>
      <div className="loader-ring" />
    </div>
  )

  const isOnSale = product.comparePrice > 0 && product.comparePrice > product.basePrice

  // Use real images; fallback to a clean placeholder (no CSS figure)
  const images = product.images?.length > 0 ? product.images : []
  const hasImages = images.length > 0

  return (
    <div className="page-offset" ref={containerRef}>

      {/* ── Breadcrumb ── */}
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

      {/* ── Main grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        padding: '1rem 5vw 5rem',
      }}>

        {/* ── Gallery ── */}
        <div className="pd-gallery" style={{ display: 'flex', gap: '1rem' }}>

          {/* Thumbnails */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', width: 72 }}>
            {(hasImages ? images : Array(4).fill(null)).map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: 72, aspectRatio: '2/3',
                  background: 'var(--cr2)',
                  border: activeImg === i ? '1px solid var(--ch)' : '1px solid var(--bo)',
                  cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
                  transition: 'border-color .25s',
                }}
              >
                {img ? (
                  <img
                    src={img.url}
                    alt={img.alt || product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <BlankThumb />
                )}
              </div>
            ))}
          </div>

          {/* Main image */}
          <div style={{
            flex: 1,
            background: 'var(--cr2)',
            aspectRatio: '3/4',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {hasImages ? (
              <img
                src={images[activeImg]?.url || images[0]?.url}
                alt={images[activeImg]?.alt || product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <BlankMainImage />
            )}

            {product.isNewArrival && (
              <div style={{
                position: 'absolute', top: '1rem', left: '1rem',
                background: 'var(--ch)', color: 'var(--cr)',
                fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase',
                padding: '.25rem .6rem',
              }}>
                New Arrival
              </div>
            )}
          </div>
        </div>

        {/* ── Product info ── */}
        <div className="pd-info" style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Brand + name + rating */}
          <div>
            <p style={{ fontSize: '.58rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--go)', marginBottom: '.5rem' }}>
              {product.brand}
            </p>
            <h1 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.8rem,3vw,2.8rem)',
              fontWeight: 300, lineHeight: 1.1, marginBottom: '.8rem',
            }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              {[1,2,3,4,5].map(n => (
                <Star key={n} size={12} strokeWidth={1.5}
                  fill={n <= Math.round(product.ratingsAverage || 0) ? 'var(--go)' : 'none'}
                  color="var(--go)"
                />
              ))}
              <span style={{ fontSize: '.6rem', color: 'var(--mu)' }}>
                {product.ratingsAverage} ({product.ratingsCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '.7rem' }}>
              <span style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', fontWeight: 300 }}>
                ₹{product.basePrice?.toLocaleString('en-IN')}
              </span>
              {isOnSale && (
                <span style={{ fontSize: '1rem', color: 'var(--mu)', textDecoration: 'line-through' }}>
                  ₹{product.comparePrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p style={{ fontSize: '.6rem', color: 'var(--mu)', letterSpacing: '.08em', marginTop: '.3rem' }}>
              Inclusive of all taxes
            </p>
          </div>

          {/* Color selector */}
          <div>
            <p style={{ fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.75rem' }}>
              Color — <span style={{ color: 'var(--go)' }}>{activeColor}</span>
            </p>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              {colors.map(v => (
                <button
                  key={v.color}
                  onClick={() => { setSelectedColor(v.color); setSelectedSize(null) }}
                  title={v.color}
                  style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: v.colorHex || '#9B8F82',
                    border: 'none',
                    outline: activeColor === v.color ? '2px solid var(--ch)' : '2px solid transparent',
                    outlineOffset: 3,
                    cursor: 'pointer',
                    transition: 'outline .2s',
                    boxShadow: '0 0 0 0.5px rgba(0,0,0,0.2)',
                    minHeight: 'unset', minWidth: 'unset',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
              <p style={{ fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase' }}>Size</p>
              <button style={{
                background: 'none', border: 'none',
                fontSize: '.58rem', letterSpacing: '.12em', textTransform: 'uppercase',
                color: 'var(--go)', cursor: 'pointer', fontFamily: 'var(--fb)',
              }}>
                Size Guide
              </button>
            </div>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {sizesForColor.map(v => (
                <button
                  key={v.size}
                  onClick={() => v.stock > 0 && setSelectedSize(v.size)}
                  disabled={v.stock === 0}
                  style={{
                    width: 46, height: 46,
                    border: selectedSize === v.size
                      ? '1px solid var(--ch)'
                      : `1px solid ${sizeErr ? '#c0392b' : 'var(--bo)'}`,
                    background: selectedSize === v.size ? 'var(--ch)' : 'none',
                    color: selectedSize === v.size ? 'var(--cr)' : v.stock === 0 ? 'var(--cr3)' : 'var(--ch)',
                    fontFamily: 'var(--fb)', fontSize: '.65rem', letterSpacing: '.1em',
                    cursor: v.stock === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all .2s',
                    textDecoration: v.stock === 0 ? 'line-through' : 'none',
                    minHeight: 'unset',
                  }}
                >
                  {v.size}
                </button>
              ))}
            </div>
            {sizeErr && (
              <p style={{ fontSize: '.6rem', color: '#c0392b', marginTop: '.4rem' }}>Please select a size</p>
            )}
          </div>

          {/* Add to bag + wishlist */}
          <div style={{ display: 'flex', gap: '.7rem' }}>
            <button
              onClick={handleAddToCart}
              className="btn-primary"
              style={{ flex: 1, padding: '1.1rem' }}
            >
              <span>
                {adding ? '✓ Added to Bag'
                  : !selectedSize ? 'Add to Bag'
                  : selectedVariant?.stock === 0 ? 'Out of Stock'
                  : 'Add to Bag'}
              </span>
            </button>
            <button
              onClick={() => {
                const wasWished = has(product._id)
                toggle(product._id)
                showToast(
                  wasWished ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`,
                  { type: wasWished ? 'info' : 'success' }
                )
              }}
              style={{
                width: 54, height: 54,
                border: '1px solid var(--bo)',
                background: wished ? 'var(--ch)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                transition: 'background .3s, border-color .3s',
                minHeight: 'unset', minWidth: 'unset',
              }}
            >
              <Heart
                size={16} strokeWidth={1.5}
                color={wished ? 'var(--cr)' : 'var(--ch)'}
                fill={wished ? 'var(--cr)' : 'none'}
              />
            </button>
          </div>

          {/* Trust bar */}
          <div style={{
            display: 'flex', gap: '1.5rem',
            padding: '1.2rem 0',
            borderTop: '1px solid var(--bo)', borderBottom: '1px solid var(--bo)',
          }}>
            {[
              [Truck,     'Free Shipping', 'On orders over ₹5000'],
              [RefreshCw, 'Easy Returns',  '30-day returns'],
              [Shield,    'Authenticity',  'Guaranteed genuine'],
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
              <button
                onClick={() => setOpenAccordion(openAccordion === key ? null : key)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', padding: '1rem 0',
                  fontFamily: 'var(--fb)', fontSize: '.62rem', letterSpacing: '.18em', textTransform: 'uppercase',
                  color: 'var(--ch)', cursor: 'pointer',
                }}
              >
                {label}
                {openAccordion === key
                  ? <ChevronUp size={14} strokeWidth={1.5} />
                  : <ChevronDown size={14} strokeWidth={1.5} />
                }
              </button>
              <div style={{
                maxHeight: openAccordion === key ? 200 : 0,
                overflow: 'hidden',
                transition: 'max-height .4s var(--tr)',
              }}>
                <p style={{ fontSize: '.78rem', lineHeight: 1.9, color: 'var(--mu)', paddingBottom: '1rem' }}>
                  {content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Clean blank placeholder — no CSS figure, just a neutral surface with subtle label
function BlankMainImage() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--cr2)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1rem',
    }}>
      <div style={{
        width: 40, height: 1,
        background: 'var(--cr3)',
      }} />
      <span style={{
        fontSize: '.55rem', letterSpacing: '.2em',
        textTransform: 'uppercase', color: 'var(--cr3)',
      }}>
        Image coming soon
      </span>
    </div>
  )
}

function BlankThumb() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--cr2)',
    }} />
  )
}
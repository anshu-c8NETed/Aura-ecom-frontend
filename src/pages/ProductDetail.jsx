import { useState, useRef, useLayoutEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Heart, ChevronDown, ChevronUp, Star, Truck, RefreshCw, Shield } from 'lucide-react'
import { useProduct } from '../hooks/useProducts'
import useCartStore from '../store/useCartStore'
import useWishlistStore from '../store/useWishlistStore'
import useToastStore from '../store/useToastStore'
import { MOCK_PRODUCTS } from '../data/mockProducts'

function MaskedTitle({ children, className, style, delay = 0 }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const words = ref.current?.querySelectorAll('.pd-word-inner')
    if (!words?.length) return
    gsap.set(words, { yPercent: 110, opacity: 0 })
    const tween = gsap.to(words, {
      yPercent: 0,
      opacity:  1,
      duration: 0.95,
      ease:     'power3.out',
      stagger:  0.07,
      delay,
    })
    return () => tween.kill()
  }, [delay, children])

  const words = String(children).split(' ')

  return (
    <h1 ref={ref} className={className} style={{ ...style, opacity: 1 }}>
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{
            display:       'inline-block',
            overflow:      'hidden',
            verticalAlign: 'bottom',
            marginRight:   wi < words.length - 1 ? '0.28em' : 0,
          }}
        >
          <span className="pd-word-inner" style={{ display: 'inline-block' }}>
            {word}
          </span>
        </span>
      ))}
    </h1>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useProduct(slug)

  const mockProduct = MOCK_PRODUCTS.find(p => p.slug === slug) || MOCK_PRODUCTS[0]
  const MOCK = {
    ...mockProduct,
    description:      'Cut from the finest silk charmeuse, this column gown falls with effortless elegance. The deep V-neckline and bias-cut construction ensure a silhouette that moves with the body, never against it.',
    material:         '100% Silk Charmeuse',
    madeIn:           'France',
    ratingsAverage:   4.8,
    ratingsCount:     24,
    careInstructions: ['Dry clean only', 'Cool iron if needed', 'Store hanging'],
  }

  const product = data?.data || MOCK

  const [selectedColor,  setSelectedColor]  = useState(null)
  const [selectedSize,   setSelectedSize]   = useState(null)
  const [activeImg,      setActiveImg]      = useState(0)
  const [adding,         setAdding]         = useState(false)
  const [sizeErr,        setSizeErr]        = useState(false)
  const [openAccordion,  setOpenAccordion]  = useState('details')

  const addItem   = useCartStore(s => s.addItem)
  const { toggle, has } = useWishlistStore()
  const showToast = useToastStore(s => s.show)
  const wished    = has(product._id)

  const containerRef = useRef(null)
  const mainImgRef   = useRef(null)
  const thumbsRef    = useRef([])

  const colors       = [...new Map(product.variants.map(v => [v.color, v])).values()]
  const activeColor  = selectedColor || colors[0]?.color
  const sizesForColor = product.variants.filter(v => v.color === activeColor)
  const selectedVariant = product.variants.find(v => v.color === activeColor && v.size === selectedSize)

  const images    = product.images?.length > 0 ? product.images : []
  const hasImages = images.length > 0
  const isOnSale  = product.comparePrice > 0 && product.comparePrice > product.basePrice

  /* ── Entrance animation ─────────────────────────────────────────
     Borrows three patterns from the inspiration files:
     1. Thumbnails: scale(0) → scale(1) staggered  [Preloader.tsx]
     2. Main image: clipPath wipe from bottom       [Intro.tsx]
     3. Info elements: staggered fade+slide         [Intro.tsx + Text.tsx]
  ─────────────────────────────────────────────────────────────── */
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const thumbEls = thumbsRef.current.filter(Boolean)
    const mainWrap = container.querySelector('.pd-main-wrap')
    const infoEls  = container.querySelectorAll('.pd-info-el')
    const brandEl  = container.querySelector('.pd-brand-el')

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    /* 1 — Thumbnails scale from 0 (Preloader-style "pop-in") */
    if (thumbEls.length) {
      gsap.set(thumbEls, { scale: 0, transformOrigin: 'center center' })
      tl.to(thumbEls, {
        scale:    1,
        duration: 0.65,
        stagger:  { each: 0.09, ease: 'power1.out' },
      }, 0)
    }

    /* 2 — Main image clip-path wipe (Intro.tsx-style curtain reveal) */
    if (mainWrap) {
      gsap.set(mainWrap, { clipPath: 'inset(100% 0% 0% 0%)' })
      tl.to(mainWrap, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.15,
        ease:     'power3.inOut',
      }, 0.15)
    }

    /* 3 — Brand label slides in from left */
    if (brandEl) {
      gsap.set(brandEl, { opacity: 0, x: -14 })
      tl.to(brandEl, { opacity: 1, x: 0, duration: 0.6 }, 0.55)
    }

    /* 4 — Info elements stagger up */
    if (infoEls.length) {
      gsap.set(infoEls, { opacity: 0, y: 18 })
      tl.to(infoEls, {
        opacity:  1,
        y:        0,
        duration: 0.65,
        stagger:  0.07,
      }, 0.7)
    }

    return () => tl.kill()
  }, [product._id])

  /* ── Image switch — clip-path wipe (Intro.tsx-style) ─────────── */
  const switchImage = useCallback((idx) => {
    if (idx === activeImg) return
    const mainWrap = containerRef.current?.querySelector('.pd-main-wrap')
    if (mainWrap) {
      gsap.fromTo(mainWrap,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.inOut' }
      )
    }
    setActiveImg(idx)
  }, [activeImg])

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

  return (
    <div className="page-offset" ref={containerRef}>

      {/* ── Breadcrumb ── */}
      <div style={{
        padding:     '1rem 5vw',
        display:     'flex',
        gap:         '.6rem',
        alignItems:  'center',
        borderBottom:'1px solid var(--bo)',
      }}>
        {[['Home', '/'], ['Collection', '/collection'], [product.name, null]].map(([label, to], i) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            {i > 0 && <span style={{ color: 'var(--cr3)', fontSize: '.7rem' }}>›</span>}
            {to ? (
              <Link
                to={to}
                style={{
                  fontSize:      '.58rem',
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color:         'var(--mu)',
                  transition:    'color .2s',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--ch)'}
                onMouseLeave={e => e.target.style.color = 'var(--mu)'}
              >
                {label}
              </Link>
            ) : (
              <span style={{
                fontSize:      '.58rem',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color:         'var(--ch)',
                maxWidth:      '18ch',
                overflow:      'hidden',
                textOverflow:  'ellipsis',
                whiteSpace:    'nowrap',
              }}>
                {label}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        gap:                 '0',
        padding:             '0 0 5rem',
        alignItems:          'start',
      }}>

        {/* ═══════════════════════════════════
            LEFT — Gallery
        ═══════════════════════════════════ */}
        <div
          className="pd-gallery"
          style={{
            display:  'flex',
            gap:      '1rem',
            padding:  'clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,3vw,2.5rem) 5vw',
            position: 'sticky',
            top:      '62px',
          }}
        >
          {/* Thumbnails column */}
          <div style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '.5rem',
            width:         64,
            flexShrink:    0,
          }}>
            {(hasImages ? images : Array(4).fill(null)).map((img, i) => (
              <button
                key={i}
                ref={el => { thumbsRef.current[i] = el }}
                onClick={() => switchImage(i)}
                style={{
                  width:      64,
                  aspectRatio:'2/3',
                  background: 'var(--cr2)',
                  border:     activeImg === i
                    ? '1px solid var(--ch)'
                    : '1px solid transparent',
                  padding:    0,
                  cursor:     'pointer',
                  overflow:   'hidden',
                  flexShrink: 0,
                  position:   'relative',
                  transition: 'border-color .25s, transform .2s',
                  transform:  activeImg === i ? 'scale(1)' : 'scale(0.95)',
                  minHeight:  'unset',
                  minWidth:   'unset',
                }}
                onMouseEnter={e => { if (i !== activeImg) e.currentTarget.style.transform = 'scale(1)' }}
                onMouseLeave={e => { if (i !== activeImg) e.currentTarget.style.transform = 'scale(0.95)' }}
              >
                {img ? (
                  <img
                    src={img.url}
                    alt={img.alt || product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--cr2)' }} />
                )}

                {/* Active indicator — thin left border bar */}
                <div style={{
                  position:   'absolute',
                  left:       0, top: 0, bottom: 0,
                  width:      2,
                  background: 'var(--go)',
                  transform:  activeImg === i ? 'scaleY(1)' : 'scaleY(0)',
                  transformOrigin: 'top',
                  transition: 'transform .35s cubic-bezier(0.25,0.46,0.45,0.94)',
                }} />
              </button>
            ))}

            {/* Image counter */}
            {hasImages && (
              <div style={{
                marginTop:     '.5rem',
                textAlign:     'center',
                fontSize:      '.44rem',
                letterSpacing: '.18em',
                color:         'var(--mu)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {String(activeImg + 1).padStart(2, '0')}
                <span style={{ opacity: 0.4, margin: '0 .2em' }}>·</span>
                {String(images.length || 1).padStart(2, '0')}
              </div>
            )}
          </div>

          {/* Main image — clip-path target */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div
              className="pd-main-wrap"
              style={{
                aspectRatio: '3/4',
                overflow:    'hidden',
                background:  'var(--cr2)',
                position:    'relative',
              }}
            >
              {hasImages ? (
                <img
                  ref={mainImgRef}
                  src={images[activeImg]?.url || images[0]?.url}
                  alt={images[activeImg]?.alt || product.name}
                  style={{
                    width:      '100%',
                    height:     '100%',
                    objectFit:  'cover',
                    display:    'block',
                  }}
                />
              ) : (
                <div style={{
                  width:          '100%',
                  height:         '100%',
                  background:     'var(--cr2)',
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '1rem',
                }}>
                  <div style={{ width: 40, height: 1, background: 'var(--cr3)' }} />
                  <span style={{ fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--cr3)' }}>
                    Image coming soon
                  </span>
                </div>
              )}

              {/* New Arrival badge */}
              {product.isNewArrival && (
                <div style={{
                  position:      'absolute',
                  top:           '1rem',
                  left:          '1rem',
                  background:    'var(--ch)',
                  color:         'var(--cr)',
                  fontSize:      '.48rem',
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  padding:       '.25rem .6rem',
                }}>
                  New Arrival
                </div>
              )}

              {/* Sale badge */}
              {isOnSale && (
                <div style={{
                  position:      'absolute',
                  top:           product.isNewArrival ? '2.5rem' : '1rem',
                  left:          '1rem',
                  background:    'var(--go)',
                  color:         'var(--ch)',
                  fontSize:      '.48rem',
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  padding:       '.25rem .6rem',
                }}>
                  Sale
                </div>
              )}

              {/* Wishlist — bottom-right of image */}
              <button
                onClick={() => {
                  const wasWished = has(product._id)
                  toggle(product._id)
                  showToast(
                    wasWished
                      ? `${product.name} removed from wishlist`
                      : `${product.name} saved to wishlist`,
                    { type: wasWished ? 'info' : 'success' }
                  )
                }}
                style={{
                  position:       'absolute',
                  bottom:         '1rem',
                  right:          '1rem',
                  width:          36,
                  height:         36,
                  borderRadius:   '50%',
                  border:         'none',
                  background:     wished ? 'var(--ch)' : 'rgba(250,248,245,0.88)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  cursor:         'pointer',
                  backdropFilter: 'blur(6px)',
                  transition:     'background .3s, transform .2s',
                  minHeight:      'unset',
                  minWidth:       'unset',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Heart
                  size={14}
                  strokeWidth={1.5}
                  color={wished ? 'var(--cr)' : 'var(--ch)'}
                  fill={wished ? 'var(--cr)' : 'none'}
                />
              </button>
            </div>

            {/* Scroll hint — vertical image strip progress indicator */}
            {images.length > 1 && (
              <div style={{
                display:       'flex',
                gap:           4,
                justifyContent:'center',
                marginTop:     '1rem',
              }}>
                {images.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => switchImage(i)}
                    style={{
                      height:     2,
                      width:      i === activeImg ? 22 : 8,
                      background: i === activeImg ? 'var(--ch)' : 'var(--cr3)',
                      cursor:     'pointer',
                      transition: 'width .4s cubic-bezier(0.25,0.46,0.45,0.94), background .3s',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════
            RIGHT — Product Info
        ═══════════════════════════════════ */}
        <div
          style={{
            padding:       'clamp(1.5rem,3vw,2.5rem) 5vw clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,3vw,2.5rem)',
            display:       'flex',
            flexDirection: 'column',
            gap:           '1.75rem',
            borderLeft:    '1px solid var(--bo)',
          }}
        >
          {/* Brand + category */}
          <div className="pd-brand-el" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize:      '.56rem',
              letterSpacing: '.26em',
              textTransform: 'uppercase',
              color:         'var(--go)',
              fontWeight:    400,
            }}>
              {product.brand}
            </span>
            <span style={{
              fontSize:      '.52rem',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color:         'var(--mu)',
              border:        '1px solid var(--bo)',
              padding:       '.18rem .55rem',
            }}>
              {(product.category || 'Womenswear').charAt(0).toUpperCase() + (product.category || 'Womenswear').slice(1)}
            </span>
          </div>

          {/* Product name — word-masked reveal (Text.tsx pattern) */}
          <MaskedTitle
            delay={0.65}
            style={{
              fontFamily:    'var(--fd)',
              fontSize:      'clamp(1.8rem,3vw,2.9rem)',
              fontWeight:    300,
              lineHeight:    1.08,
              letterSpacing: '-0.02em',
              color:         'var(--ch)',
              margin:        0,
            }}
          >
            {product.name}
          </MaskedTitle>

          {/* Rating */}
          <div className="pd-info-el" style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <Star
                  key={n}
                  size={11}
                  strokeWidth={1.5}
                  fill={n <= Math.round(product.ratingsAverage || 0) ? 'var(--go)' : 'none'}
                  color="var(--go)"
                />
              ))}
            </div>
            <span style={{ fontSize: '.58rem', color: 'var(--mu)', letterSpacing: '.06em' }}>
              {product.ratingsAverage} ({product.ratingsCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="pd-info-el" style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--bo)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '.75rem', marginBottom: '.3rem' }}>
              <span style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 300 }}>
                ₹{product.basePrice?.toLocaleString('en-IN')}
              </span>
              {isOnSale && (
                <span style={{ fontSize: '1rem', color: 'var(--mu)', textDecoration: 'line-through' }}>
                  ₹{product.comparePrice?.toLocaleString('en-IN')}
                </span>
              )}
              {isOnSale && (
                <span style={{
                  fontSize:      '.5rem',
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color:         'var(--go)',
                  border:        '1px solid rgba(184,149,96,0.4)',
                  padding:       '.15rem .45rem',
                }}>
                  {Math.round((1 - product.basePrice / product.comparePrice) * 100)}% off
                </span>
              )}
            </div>
            <p style={{ fontSize: '.58rem', color: 'var(--mu)', letterSpacing: '.06em' }}>
              Inclusive of all taxes · Free shipping over ₹5,000
            </p>
          </div>

          {/* Color selector */}
          <div className="pd-info-el">
            <p style={{
              fontSize:      '.58rem',
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              marginBottom:  '.85rem',
              display:       'flex',
              alignItems:    'center',
              gap:           '.5rem',
            }}>
              Colour
              <span style={{
                fontFamily: 'var(--fd)',
                fontSize:   '.8rem',
                fontWeight: 300,
                color:      'var(--go)',
                letterSpacing: '0',
                textTransform: 'none',
              }}>
                — {activeColor}
              </span>
            </p>
            <div style={{ display: 'flex', gap: '.55rem' }}>
              {colors.map(v => (
                <button
                  key={v.color}
                  onClick={() => { setSelectedColor(v.color); setSelectedSize(null) }}
                  title={v.color}
                  style={{
                    width:        28,
                    height:       28,
                    borderRadius: '50%',
                    background:   v.colorHex || '#9B8F82',
                    border:       'none',
                    outline:      activeColor === v.color
                      ? '2px solid var(--ch)'
                      : '2px solid transparent',
                    outlineOffset:3,
                    cursor:       'pointer',
                    transition:   'outline .2s, transform .2s',
                    boxShadow:    '0 0 0 0.5px rgba(0,0,0,0.2)',
                    minHeight:    'unset',
                    minWidth:     'unset',
                    transform:    activeColor === v.color ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="pd-info-el">
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              marginBottom:   '.85rem',
            }}>
              <p style={{ fontSize: '.58rem', letterSpacing: '.18em', textTransform: 'uppercase' }}>
                Size
              </p>
              <button style={{
                background:    'none',
                border:        'none',
                fontSize:      '.56rem',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color:         'var(--go)',
                cursor:        'pointer',
                fontFamily:    'var(--fb)',
                display:       'flex',
                alignItems:    'center',
                gap:           '.3rem',
              }}>
                Size Guide
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
              {sizesForColor.map(v => (
                <button
                  key={v.size}
                  onClick={() => v.stock > 0 && setSelectedSize(v.size)}
                  disabled={v.stock === 0}
                  style={{
                    width:          46,
                    height:         46,
                    border:         selectedSize === v.size
                      ? '1px solid var(--ch)'
                      : `1px solid ${sizeErr ? '#c0392b55' : 'var(--bo)'}`,
                    background:     selectedSize === v.size ? 'var(--ch)' : 'none',
                    color:          selectedSize === v.size ? 'var(--cr)'
                                  : v.stock === 0 ? 'var(--cr3)' : 'var(--ch)',
                    fontFamily:     'var(--fb)',
                    fontSize:       '.63rem',
                    letterSpacing:  '.1em',
                    cursor:         v.stock === 0 ? 'not-allowed' : 'pointer',
                    transition:     'all .22s',
                    textDecoration: v.stock === 0 ? 'line-through' : 'none',
                    minHeight:      'unset',
                    position:       'relative',
                  }}
                >
                  {v.size}
                  {v.stock > 0 && v.stock <= 3 && (
                    <span style={{
                      position:   'absolute',
                      top:        -4,
                      right:      -4,
                      width:      8,
                      height:     8,
                      borderRadius:'50%',
                      background: 'var(--go)',
                      border:     '1px solid var(--cr)',
                    }} />
                  )}
                </button>
              ))}
            </div>
            {sizeErr && (
              <p style={{ fontSize: '.58rem', color: '#c0392b', marginTop: '.5rem', letterSpacing: '.04em' }}>
                Please select a size to continue
              </p>
            )}
            {/* Low stock warning */}
            {selectedSize && selectedVariant && selectedVariant.stock <= 3 && selectedVariant.stock > 0 && (
              <p style={{
                fontSize:      '.56rem',
                color:         'var(--go)',
                marginTop:     '.5rem',
                letterSpacing: '.06em',
                display:       'flex',
                alignItems:    'center',
                gap:           '.4rem',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--go)', display: 'inline-block' }} />
                Only {selectedVariant.stock} left in this size
              </p>
            )}
          </div>

          {/* Add to bag + Wishlist */}
          <div className="pd-info-el" style={{ display: 'flex', gap: '.6rem' }}>
            <button
              onClick={handleAddToCart}
              className="btn-primary"
              style={{ flex: 1, padding: '1.15rem' }}
            >
              <span>
                {adding
                  ? '✓ Added to Bag'
                  : !selectedSize
                  ? 'Select a Size'
                  : selectedVariant?.stock === 0
                  ? 'Out of Stock'
                  : 'Add to Bag'}
              </span>
            </button>
            <button
              onClick={() => {
                const wasWished = has(product._id)
                toggle(product._id)
                showToast(
                  wasWished
                    ? `${product.name} removed from wishlist`
                    : `${product.name} saved to wishlist`,
                  { type: wasWished ? 'info' : 'success' }
                )
              }}
              style={{
                width:          54,
                height:         54,
                border:         '1px solid var(--bo)',
                background:     wished ? 'var(--ch)' : 'none',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                cursor:         'pointer',
                flexShrink:     0,
                transition:     'background .3s, border-color .3s',
                minHeight:      'unset',
                minWidth:       'unset',
              }}
              onMouseEnter={e => {
                if (!wished) e.currentTarget.style.borderColor = 'var(--ch)'
              }}
              onMouseLeave={e => {
                if (!wished) e.currentTarget.style.borderColor = 'var(--bo)'
              }}
            >
              <Heart
                size={15}
                strokeWidth={1.5}
                color={wished ? 'var(--cr)' : 'var(--ch)'}
                fill={wished ? 'var(--cr)' : 'none'}
              />
            </button>
          </div>

          {/* Trust bar */}
          <div className="pd-info-el" style={{
            display:       'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:           '0',
            borderTop:     '1px solid var(--bo)',
            borderBottom:  '1px solid var(--bo)',
          }}>
            {[
              [Truck,     'Free Shipping', 'Orders over ₹5,000'],
              [RefreshCw, 'Easy Returns',  '30-day policy'],
              [Shield,    'Authentic',     'Guaranteed genuine'],
            ].map(([Icon, title, sub], i) => (
              <div
                key={title}
                style={{
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  gap:            '.5rem',
                  padding:        '1.1rem .8rem',
                  textAlign:      'center',
                  borderRight:    i < 2 ? '1px solid var(--bo)' : 'none',
                }}
              >
                <Icon size={14} strokeWidth={1.5} color="var(--go)" />
                <div>
                  <p style={{ fontSize: '.56rem', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.15rem', color: 'var(--ch)' }}>
                    {title}
                  </p>
                  <p style={{ fontSize: '.52rem', color: 'var(--mu)', letterSpacing: '.04em' }}>
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Material + origin strip */}
          <div className="pd-info-el" style={{
            display:   'flex',
            gap:       '2rem',
            padding:   '.9rem 0',
          }}>
            {[
              ['Material', product.material || '—'],
              ['Made in',  product.madeIn   || '—'],
              ['Care',     (product.careInstructions || ['—'])[0]],
            ].map(([label, val]) => (
              <div key={label}>
                <p style={{ fontSize: '.48rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: '.3rem' }}>
                  {label}
                </p>
                <p style={{ fontSize: '.68rem', color: 'var(--ch)', letterSpacing: '.04em' }}>
                  {val}
                </p>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div className="pd-info-el" style={{ borderTop: '1px solid var(--bo)' }}>
            {[
              ['details',  'Product Details',    product.description],
              ['material', 'Material & Care',    [product.material, ...(product.careInstructions || [])].join(' · ')],
              ['shipping', 'Shipping & Returns', 'Complimentary standard shipping on orders over ₹5,000. Express shipping available. Returns accepted within 30 days.'],
            ].map(([key, label, content]) => (
              <div key={key} style={{ borderBottom: '1px solid var(--bo)' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === key ? null : key)}
                  style={{
                    width:          '100%',
                    display:        'flex',
                    justifyContent: 'space-between',
                    alignItems:     'center',
                    background:     'none',
                    border:         'none',
                    padding:        '.95rem 0',
                    fontFamily:     'var(--fb)',
                    fontSize:       '.6rem',
                    letterSpacing:  '.16em',
                    textTransform:  'uppercase',
                    color:          'var(--ch)',
                    cursor:         'pointer',
                    transition:     'color .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--go)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--ch)'}
                >
                  {label}
                  {openAccordion === key
                    ? <ChevronUp   size={13} strokeWidth={1.5} />
                    : <ChevronDown size={13} strokeWidth={1.5} />
                  }
                </button>
                <div style={{
                  maxHeight:  openAccordion === key ? 200 : 0,
                  overflow:   'hidden',
                  transition: 'max-height .4s var(--tr)',
                }}>
                  <p style={{
                    fontSize:   '.76rem',
                    lineHeight: 1.95,
                    color:      'var(--mu)',
                    paddingBottom: '1.1rem',
                  }}>
                    {content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Share / reference strip */}
          <div className="pd-info-el" style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            paddingTop:     '.5rem',
          }}>
            <span style={{
              fontFamily:    'monospace',
              fontSize:      '.52rem',
              letterSpacing: '.1em',
              color:         'var(--mu)',
            }}>
              SKU · {product._id?.toUpperCase().slice(0, 8) || 'AURA-001'}
            </span>
            <button style={{
              background:    'none',
              border:        'none',
              fontSize:      '.52rem',
              letterSpacing: '.15em',
              textTransform: 'uppercase',
              color:         'var(--mu)',
              cursor:        'pointer',
              fontFamily:    'var(--fb)',
              display:       'flex',
              alignItems:    'center',
              gap:           '.35rem',
              transition:    'color .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--ch)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--mu)'}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="9.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="0.8"/>
                <circle cx="2.5" cy="6"   r="1.5" stroke="currentColor" strokeWidth="0.8"/>
                <circle cx="9.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="0.8"/>
                <line x1="3.9" y1="5.3" x2="8.1" y2="3.2" stroke="currentColor" strokeWidth="0.8"/>
                <line x1="3.9" y1="6.7" x2="8.1" y2="8.8" stroke="currentColor" strokeWidth="0.8"/>
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import useWishlistStore from '../../store/useWishlistStore'
import useCartStore from '../../store/useCartStore'
import useToastStore from '../../store/useToastStore'

export default function ProductCard({ product }) {
  const [hovered,    setHovered]    = useState(false)
  const [adding,     setAdding]     = useState(false)
  const [activeColor, setActiveColor] = useState(null)

  const { toggle, has } = useWishlistStore()
  const addItem = useCartStore(s => s.addItem)
  const showToast = useToastStore(s => s.show)
  const wished  = has(product._id)

  // Images
  const primaryImg  = product.images?.find(i => i.isPrimary) || product.images?.[0]
  const hoverImg    = product.images?.[1] || primaryImg

  // Sale / badge logic
  const isOnSale   = product.comparePrice > 0 && product.comparePrice > product.basePrice

  // Unique colors from variants
  const colorMap = new Map()
  product.variants?.forEach(v => {
    if (!colorMap.has(v.color)) colorMap.set(v.color, v.colorHex || '#9B8F82')
  })
  const colors = [...colorMap.entries()] // [[colorName, hex], ...]

  // Low stock: any color has a variant with stock <= 3 and > 0
  const totalStock = product.variants?.reduce((s, v) => s + (v.stock || 0), 0) ?? 99
  const isLowStock = totalStock > 0 && totalStock <= 5

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const colorToUse = activeColor || colors[0]?.[0]
    const variant = product.variants?.find(v => v.color === colorToUse && v.stock > 0)
      || product.variants?.find(v => v.stock > 0)
      || product.variants?.[0]
      || { _id: 'default', size: 'ONE SIZE', color: 'Default' }
    setAdding(true)
    addItem(product, variant, 1)
    showToast(`${product.name} added to bag`, { type: 'success' })
    setTimeout(() => setAdding(false), 900)
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      style={{ display: 'block', cursor: 'pointer', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image container ── */}
      <div style={{
        position: 'relative',
        aspectRatio: '3/4',
        overflow: 'hidden',
        marginBottom: '.75rem',
        background: 'var(--cr2)',
      }}>
        {/* Primary image */}
        <img
          src={primaryImg?.url || 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&auto=format&fit=crop'}
          alt={primaryImg?.alt || product.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'opacity .5s ease, transform .6s ease',
            opacity: hovered && hoverImg && hoverImg !== primaryImg ? 0 : 1,
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />

        {/* Hover / secondary image */}
        {hoverImg && hoverImg !== primaryImg && (
          <img
            src={hoverImg.url}
            alt={hoverImg.alt || product.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'opacity .5s ease, transform .6s ease',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        )}

        {/* ── Badges ── */}
        {isLowStock && (
          <span style={{
            position: 'absolute', top: '.7rem', left: '.7rem',
            background: '#FAF0E0', color: '#8A6020',
            fontSize: '.5rem', letterSpacing: '.14em', textTransform: 'uppercase',
            padding: '.22rem .55rem',
          }}>
            Only {totalStock} left
          </span>
        )}
        {!isLowStock && isOnSale && (
          <span style={{
            position: 'absolute', top: '.7rem', left: '.7rem',
            background: 'var(--go)', color: 'var(--ch)',
            fontSize: '.5rem', letterSpacing: '.15em', textTransform: 'uppercase',
            padding: '.22rem .55rem',
          }}>
            Sale
          </span>
        )}
        {!isLowStock && !isOnSale && product.isNewArrival && (
          <span style={{
            position: 'absolute', top: '.7rem', left: '.7rem',
            background: 'var(--ch)', color: 'var(--cr)',
            fontSize: '.5rem', letterSpacing: '.15em', textTransform: 'uppercase',
            padding: '.22rem .55rem',
          }}>
            New
          </span>
        )}

        {/* ── Wishlist button — always visible, subtle ── */}
        <button
          onClick={e => {
            e.preventDefault(); e.stopPropagation();
            const wasWished = has(product._id)
            toggle(product._id)
            showToast(
              wasWished ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
              { type: wasWished ? 'info' : 'success' }
            )
          }}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute', top: '.7rem', right: '.7rem',
            width: 30, height: 30,
            background: wished ? 'var(--ch)' : 'rgba(255,255,255,0.85)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
            color: wished ? 'var(--cr)' : 'var(--ch)',
            backdropFilter: 'blur(4px)',
            transition: 'background .25s, transform .2s',
            transform: hovered ? 'scale(1)' : 'scale(0.9)',
            opacity: hovered || wished ? 1 : 0.7,
          }}
        >
          <Heart size={13} strokeWidth={1.5} fill={wished ? 'currentColor' : 'none'} />
        </button>

        {/* ── Quick Add — slides up on hover ── */}
        <button
          onClick={handleQuickAdd}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: adding ? 'var(--go)' : 'var(--ch)',
            color: 'var(--cr)',
            border: 'none',
            padding: '.75rem',
            fontFamily: 'var(--fb)',
            fontSize: '.56rem',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform .35s cubic-bezier(0.25,0.46,0.45,0.94), background .3s',
          }}
        >
          {adding ? '✓ Added to Bag' : 'Quick Add'}
        </button>
      </div>

      {/* ── Info ── */}
      <div style={{ paddingBottom: '.2rem' }}>
        {/* Color swatches */}
        {colors.length > 0 && (
          <div style={{ display: 'flex', gap: '5px', marginBottom: '.5rem', alignItems: 'center' }}>
            {colors.map(([colorName, hex]) => (
              <button
                key={colorName}
                onClick={e => { e.preventDefault(); e.stopPropagation(); setActiveColor(colorName) }}
                title={colorName}
                aria-label={colorName}
                style={{
                  width: 13, height: 13,
                  borderRadius: '50%',
                  background: hex,
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  outline: activeColor === colorName || (!activeColor && colorName === colors[0]?.[0])
                    ? '1.5px solid var(--ch)'
                    : '1.5px solid transparent',
                  outlineOffset: '2px',
                  transition: 'outline .2s',
                  boxShadow: '0 0 0 0.5px rgba(0,0,0,0.15)',
                  minHeight: 'unset', minWidth: 'unset',
                }}
              />
            ))}
            {colors.length > 4 && (
              <span style={{ fontSize: '.55rem', color: 'var(--mu)', letterSpacing: '.06em' }}>
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        <p style={{
          fontFamily: 'var(--fd)',
          fontSize: '1rem',
          fontWeight: 400,
          marginBottom: '.15rem',
          color: 'var(--ch)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {product.name}
        </p>

        <p style={{
          fontSize: '.56rem',
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: 'var(--mu)',
          marginBottom: '.35rem',
        }}>
          {product.brand}
        </p>

        <p style={{ fontSize: '.8rem', display: 'flex', alignItems: 'baseline', gap: '.4rem' }}>
          {isOnSale && (
            <span style={{ textDecoration: 'line-through', color: 'var(--mu)', fontSize: '.72rem' }}>
              ₹{product.comparePrice?.toLocaleString('en-IN')}
            </span>
          )}
          <span style={{ color: isOnSale ? 'var(--go)' : 'var(--ch)', fontWeight: isOnSale ? 400 : 300 }}>
            ₹{product.basePrice?.toLocaleString('en-IN')}
          </span>
        </p>
      </div>
    </Link>
  )
}
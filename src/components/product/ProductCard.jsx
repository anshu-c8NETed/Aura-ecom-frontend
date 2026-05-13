import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import useWishlistStore from '../../store/useWishlistStore'
import useCartStore from '../../store/useCartStore'

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)
  const [adding,  setAdding]  = useState(false)

  const { toggle, has } = useWishlistStore()
  const addItem = useCartStore(s => s.addItem)
  const wished  = has(product._id)

  const primaryImg = product.images?.find(i => i.isPrimary) || product.images?.[0]
  const isOnSale   = product.comparePrice > 0 && product.comparePrice > product.basePrice

  const handleQuickAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Use first variant, or fallback
    const variant = product.variants?.[0] || { _id: 'default', size: 'ONE SIZE', color: 'Default' }
    setAdding(true)
    addItem(product, variant, 1)
    setTimeout(() => setAdding(false), 800)
  }

  return (
    <Link to={`/product/${product.slug}`} style={{ display: 'block', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', marginBottom: '.85rem', background: 'var(--cr2)' }}>
        {/* Image */}
        <div style={{ position: 'absolute', inset: 0, transition: 'transform var(--tr)', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}>
          {primaryImg ? (
            <img src={primaryImg.url} alt={primaryImg.alt || product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <PlaceholderFigure />
          )}
        </div>

        {/* Badge */}
        {isOnSale && (
          <span style={{
            position: 'absolute', top: '.7rem', left: '.7rem',
            background: 'var(--go)', color: 'var(--ch)',
            fontSize: '.5rem', letterSpacing: '.15em', textTransform: 'uppercase',
            padding: '.22rem .5rem',
          }}>
            Sale
          </span>
        )}
        {product.isNewArrival && !isOnSale && (
          <span style={{
            position: 'absolute', top: '.7rem', left: '.7rem',
            background: 'var(--ch)', color: 'var(--cr)',
            fontSize: '.5rem', letterSpacing: '.15em', textTransform: 'uppercase',
            padding: '.22rem .5rem',
          }}>
            New
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(product._id) }}
          style={{
            position: 'absolute', top: '.7rem', right: '.7rem',
            width: 28, height: 28, background: '#fff', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', color: wished ? 'var(--go)' : 'var(--mu)',
            opacity: hovered ? 1 : 0, transition: 'opacity .3s, color .3s',
          }}
        >
          <Heart size={13} strokeWidth={1.5} fill={wished ? 'var(--go)' : 'none'} />
        </button>

        {/* Quick Add */}
        <button
          onClick={handleQuickAdd}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'var(--ch)', color: 'var(--cr)',
            border: 'none', padding: '.8rem',
            fontFamily: 'var(--fb)', fontSize: '.58rem', letterSpacing: '.2em', textTransform: 'uppercase',
            cursor: 'pointer',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform var(--tr)',
          }}
        >
          {adding ? '✓ Added' : 'Quick Add'}
        </button>
      </div>

      {/* Info */}
      <p style={{ fontFamily: 'var(--fd)', fontSize: '1.05rem', fontWeight: 400, marginBottom: '.2rem' }}>
        {product.name}
      </p>
      <p style={{ fontSize: '.58rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: '.38rem' }}>
        {product.brand}
      </p>
      <p style={{ fontSize: '.8rem', fontWeight: 400 }}>
        {isOnSale && (
          <span style={{ textDecoration: 'line-through', color: 'var(--mu)', marginRight: '.4rem', fontSize: '.76rem' }}>
            ₹{product.comparePrice?.toLocaleString('en-IN')}
          </span>
        )}
        ₹{product.basePrice?.toLocaleString('en-IN')}
      </p>
    </Link>
  )
}

// CSS art placeholder when no image
function PlaceholderFigure() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cr2)' }}>
      <div style={{ position: 'relative', width: 60, height: 140 }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 22, height: 26, background: '#D0BEA8', borderRadius: '50% 50% 46% 46%' }} />
        <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', width: 32, height: 55, background: '#2A2018', clipPath: 'polygon(20% 0%,80% 0%,88% 100%,12% 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 54, height: 65, background: '#1C1810', clipPath: 'polygon(28% 0%,72% 0%,88% 100%,12% 100%)' }} />
      </div>
    </div>
  )
}
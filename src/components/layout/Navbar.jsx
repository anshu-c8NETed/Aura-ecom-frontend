import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ShoppingBag, Search, Heart, User } from 'lucide-react'
import useCartStore from '../../store/useCartStore'
import useAuthStore from '../../store/useAuthStore'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const navRef = useRef(null)
  const navigate = useNavigate()

  const items = useCartStore(s => s.items)
  const toggleCart = useCartStore(s => s.toggleCart)
  const { isAuthenticated, logout } = useAuthStore()

  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -70, opacity: 0, duration: 1.1,
      ease: 'power3.out', delay: 0.2,
    })
  }, { scope: navRef })

  const handleSearch = e => {
    e.preventDefault()
    if (searchQ.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQ.trim())}`)
      setSearchOpen(false)
      setSearchQ('')
    }
  }

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(250,248,245,0.97)',
      borderBottom: '1px solid var(--bo)',
      height: 62,
      display: 'flex', alignItems: 'center',
      padding: '0 5vw', gap: '1rem',
      backdropFilter: 'blur(10px)',
      transition: 'box-shadow .4s',
      boxShadow: scrolled ? '0 2px 24px rgba(26,23,20,0.07)' : 'none',
    }}>
      {/* Logo */}
      <Link to="/" style={{
        fontFamily: 'var(--fd)', fontSize: '1.55rem',
        letterSpacing: '.32em', fontWeight: 400,
        color: 'var(--ch)', flex: 1,
      }}>
        AURA
      </Link>

      {/* Nav links */}
      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', flex: 1, justifyContent: 'center' }}>
        {[
          ['New Arrivals', '/collection?filter=new'],
          ['Dresses',      '/collection?category=dresses'],
          ['Outerwear',    '/collection?category=outerwear'],
          ['Tailoring',    '/collection?category=tailoring'],
          ['Sale',         '/collection?filter=sale'],
        ].map(([label, to]) => (
          <li key={label}>
            <NavLink to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1.4rem', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* Search */}
        {searchOpen ? (
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <input
              autoFocus
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search..."
              style={{
                background: 'transparent', border: 'none', borderBottom: '1px solid var(--bo)',
                fontFamily: 'var(--fb)', fontSize: '.75rem', color: 'var(--ch)',
                padding: '.2rem .3rem', outline: 'none', width: 140,
              }}
            />
            <button type="button" onClick={() => setSearchOpen(false)} style={iconBtnStyle}>✕</button>
          </form>
        ) : (
          <button onClick={() => setSearchOpen(true)} style={iconBtnStyle} aria-label="Search">
            <Search size={15} strokeWidth={1.5} />
          </button>
        )}

        {/* Wishlist */}
        <Link to="/wishlist" style={iconBtnStyle} aria-label="Wishlist">
          <Heart size={15} strokeWidth={1.5} />
        </Link>

        {/* Auth */}
        {isAuthenticated ? (
          <button onClick={logout} style={textBtnStyle}>Sign Out</button>
        ) : (
          <Link to="/login" style={textBtnStyle}>
            <User size={14} strokeWidth={1.5} style={{ display: 'inline', marginRight: 4 }} />
            Sign In
          </Link>
        )}

        {/* Cart */}
        <button onClick={toggleCart} style={{ ...textBtnStyle, display: 'flex', alignItems: 'center', gap: 5 }} aria-label="Cart">
          <ShoppingBag size={15} strokeWidth={1.5} />
          {itemCount > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 16, height: 16, background: 'var(--ch)', color: 'var(--cr)',
              borderRadius: '50%', fontSize: '.5rem', fontWeight: 500,
            }}>{itemCount}</span>
          )}
        </button>
      </div>
    </nav>
  )
}

const iconBtnStyle = {
  background: 'none', border: 'none', color: 'var(--ch)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0,
  transition: 'color .3s',
}

const textBtnStyle = {
  background: 'none', border: 'none', fontFamily: 'var(--fb)',
  fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase',
  color: 'var(--ch)', cursor: 'pointer', display: 'flex', alignItems: 'center',
  transition: 'color .3s',
}
import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ShoppingBag, Search, Heart, User, Menu, X } from 'lucide-react'
import useCartStore from '../../store/useCartStore'
import useAuthStore from '../../store/useAuthStore'

const NAV_LINKS = [
  ['New Arrivals', '/collection?filter=new'],
  ['Dresses',      '/collection?category=dresses'],
  ['Outerwear',    '/collection?category=outerwear'],
  ['Tailoring',    '/collection?category=tailoring'],
  ['Sale',         '/collection?filter=sale'],
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [searchQ,     setSearchQ]     = useState('')
  const navRef  = useRef(null)
  const navigate = useNavigate()

  const items      = useCartStore(s => s.items)
  const toggleCart = useCartStore(s => s.toggleCart)
  const { isAuthenticated, logout } = useAuthStore()

  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [navigate])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useGSAP(() => {
    gsap.from(navRef.current, { y: -70, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.2 })
  }, { scope: navRef })

  const handleSearch = e => {
    e.preventDefault()
    if (searchQ.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQ.trim())}`)
      setSearchOpen(false)
      setMobileOpen(false)
      setSearchQ('')
    }
  }

  return (
    <>
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

        {/* Desktop Nav links */}
        <ul className="nav-links-desktop" style={{ display: 'flex', gap: '2rem', listStyle: 'none', flex: 1, justifyContent: 'center' }}>
          {NAV_LINKS.map(([label, to]) => (
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

          {/* Wishlist — hidden on mobile */}
          <Link to="/wishlist" className="nav-wishlist" style={iconBtnStyle} aria-label="Wishlist">
            <Heart size={15} strokeWidth={1.5} />
          </Link>

          {/* Auth — hidden on mobile */}
          <span className="nav-auth">
            {isAuthenticated ? (
              <button onClick={logout} style={textBtnStyle}>Sign Out</button>
            ) : (
              <Link to="/login" style={textBtnStyle}>
                <User size={14} strokeWidth={1.5} style={{ display: 'inline', marginRight: 4 }} />
                Sign In
              </Link>
            )}
          </span>

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

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(o => !o)}
            style={iconBtnStyle}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(26,23,20,0.4)',
          top: 62,
        }} onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Menu Panel */}
      <div className="mobile-menu" style={{
        position: 'fixed', top: 62, left: 0, right: 0, zIndex: 100,
        background: 'var(--cr)',
        borderBottom: '1px solid var(--bo)',
        transform: mobileOpen ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
        padding: '1.5rem 5vw 2rem',
        display: 'flex', flexDirection: 'column', gap: '0',
      }}>
        {/* Mobile search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--bo)' }}>
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search the collection..."
            style={{
              flex: 1, background: 'transparent',
              border: 'none', borderBottom: '1px solid var(--bo)',
              fontFamily: 'var(--fb)', fontSize: '.8rem', color: 'var(--ch)',
              padding: '.4rem 0', outline: 'none',
            }}
          />
          <button type="submit" style={iconBtnStyle}><Search size={15} strokeWidth={1.5} /></button>
        </form>

        {/* Mobile nav links */}
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
          {NAV_LINKS.map(([label, to]) => (
            <li key={label} style={{ borderBottom: '1px solid var(--bo)' }}>
              <NavLink
                to={to}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '1rem 0',
                  fontSize: '.75rem',
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--go)' : 'var(--ch)',
                  fontFamily: 'var(--fb)',
                  minHeight: 'unset',
                })}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile auth + wishlist */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--bo)' }}>
          <Link to="/wishlist" onClick={() => setMobileOpen(false)} style={{ ...textBtnStyle, minHeight: 'unset' }}>
            <Heart size={14} strokeWidth={1.5} style={{ marginRight: 6 }} />
            Wishlist
          </Link>
          {isAuthenticated ? (
            <button onClick={() => { logout(); setMobileOpen(false) }} style={{ ...textBtnStyle, minHeight: 'unset' }}>Sign Out</button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ ...textBtnStyle, minHeight: 'unset' }}>
              <User size={14} strokeWidth={1.5} style={{ marginRight: 6 }} />
              Sign In
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-wishlist { display: none !important; }
          .nav-auth { display: none !important; }
        }
        @media (min-width: 901px) {
          .nav-hamburger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </>
  )
}

const iconBtnStyle = {
  background: 'none', border: 'none', color: 'var(--ch)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0,
  transition: 'color .3s', minHeight: 'unset', minWidth: 'unset',
}

const textBtnStyle = {
  background: 'none', border: 'none', fontFamily: 'var(--fb)',
  fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase',
  color: 'var(--ch)', cursor: 'pointer', display: 'flex', alignItems: 'center',
  transition: 'color .3s', minHeight: 'unset', minWidth: 'unset',
}
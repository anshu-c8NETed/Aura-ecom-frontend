import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import * as THREE from 'three'
import { ShoppingBag, Search, Heart, User, X } from 'lucide-react'
import useCartStore from '../../store/useCartStore'
import useAuthStore from '../../store/useAuthStore'

/* ─── Nav links ──────────────────────────────────────────────────── */
const NAV_LINKS = [
  {
    label: 'Home',
    to: '/',
    num: '00',
    img: 'https://images.unsplash.com/photo-1747380843475-1dda9f487f10?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3R5bGUlMjBwb3N0ZXJ8ZW58MHx8MHx8fDA%3D',
    color: '#B8A898',
    caption: 'Welcome home',
  },
  {
    label: 'New Arrivals',
    to: '/collection?filter=new',
    num: '01',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHN0eWxlfGVufDB8fDB8fHww',
    color: '#C09458',
    caption: 'SS 2025 — Just landed',
  },
  {
    label: 'Dresses',
    to: '/collection?category=dresses',
    num: '02',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    color: '#D4B478',
    caption: '42 exclusive pieces',
  },
  {
    label: 'Outerwear',
    to: '/collection?category=outerwear',
    num: '03',
    img: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&auto=format&fit=crop&q=80',
    color: '#9B8F82',
    caption: 'Seasonal coats & jackets',
  },
  {
    label: 'Tailoring',
    to: '/collection?category=tailoring',
    num: '04',
    img: 'https://images.unsplash.com/photo-1633655442432-620aa55d7ac1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRhaWxvcnxlbnwwfHwwfHx8MA%3D%3D',
    color: '#B89560',
    caption: 'Precision craftsmanship',
  },
  {
    label: 'Sale',
    to: '/collection?filter=sale',
    num: '05',
    img: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    color: '#8B7355',
    caption: 'Selected reductions',
  },
]

/* ─── Shaders ────────────────────────────────────────────────────── */
const VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAGMENT = `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uBlend;
  uniform sampler2D uImage1;
  uniform sampler2D uImage2;
  uniform sampler2D uImage3;
  uniform sampler2D uImage4;
  uniform sampler2D uImage5;
  uniform sampler2D uImage6;
  uniform int uIndex;
  uniform int uPrevIndex;
  varying vec2 vUv;
  #define NUM_OCTAVES 5

  float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898,4.1414))) * 43758.5453); }

  float noise(vec2 p) {
    vec2 ip = floor(p); vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    return mix(
      mix(rand(ip),               rand(ip+vec2(1.0,0.0)), u.x),
      mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 x) {
    float v=0.0, a=0.5;
    vec2 shift=vec2(100.0);
    mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));
    for(int i=0;i<NUM_OCTAVES;i++){
      v+=a*noise(x);
      x=rot*x*2.0+shift;
      a*=0.5;
    }
    return v;
  }

  vec4 getImage(int idx, vec2 uv) {
    vec4 result = texture2D(uImage1, uv);
    if      (idx == 1) result = texture2D(uImage2, uv);
    else if (idx == 2) result = texture2D(uImage3, uv);
    else if (idx == 3) result = texture2D(uImage4, uv);
    else if (idx == 4) result = texture2D(uImage5, uv);
    else if (idx == 5) result = texture2D(uImage6, uv);
    return result;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float wave  = fbm(3.5*uv + uTime/3.0);
    float swell = sin(uBlend*3.14159)*0.18;
    uv *= mix(1.0, 1.15+swell, wave);
    uv += 0.5;
    if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0) discard;
    vec4 cA    = getImage(uPrevIndex, uv);
    vec4 cB    = getImage(uIndex,     uv);
    float n    = noise(uv*4.5 + uTime*0.25);
    float wipe = smoothstep(n-0.28, n+0.28, uBlend);
    vec4 color = mix(cA, cB, wipe);
    gl_FragColor = vec4(color.rgb, color.a * uOpacity);
  }
`

/* ─── WebGL Canvas ───────────────────────────────────────────────── */
function MenuCanvas({ activeIdx }) {
  const mountRef = useRef(null)
  const stateRef = useRef({
    renderer: null, material: null, mesh: null,
    scene: null, camera: null,
    time: 0, raf: null, curIdx: -1,
  })

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const s = stateRef.current

    const W = window.innerWidth
    const H = window.innerHeight

    s.scene  = new THREE.Scene()
    s.camera = new THREE.PerspectiveCamera(75, W / H, 100, 2000)
    s.camera.position.z = 200
    s.camera.fov = 2 * Math.atan(H / 2 / 200) * (180 / Math.PI)
    s.camera.updateProjectionMatrix()

    s.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    s.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    s.renderer.setSize(W, H)

    Object.assign(s.renderer.domElement.style, {
      position: 'absolute',
      top: '0', left: '0',
      width: '100%', height: '100%',
      pointerEvents: 'none',
    })
    el.appendChild(s.renderer.domElement)

    const loader   = new THREE.TextureLoader()
    const textures = NAV_LINKS.map(l => loader.load(l.img))

    /*
     * Image sits in the LEFT 42% of the screen.
     * Plane dimensions: ~26vw wide, portrait ratio.
     */
    const planeW = W * 0.26
    const planeH = W * 0.33
    const geo = new THREE.PlaneGeometry(planeW, planeH)

    s.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime:      { value: 0 },
        uOpacity:   { value: 0 },
        uBlend:     { value: 1 },
        uIndex:     { value: 0 },
        uPrevIndex: { value: 0 },
        uImage1:    { value: textures[0] },
        uImage2:    { value: textures[1] },
        uImage3:    { value: textures[2] },
        uImage4:    { value: textures[3] },
        uImage5:    { value: textures[4] },
        uImage6:    { value: textures[5] },
      },
      vertexShader:   VERTEX,
      fragmentShader: FRAGMENT,
      transparent:    true,
    })

    s.mesh = new THREE.Mesh(geo, s.material)
    /* Centre image in the left 42% → world-x ≈ -W * 0.29 */
    s.mesh.position.x = -W * 0.29
    s.mesh.position.y = 0
    s.scene.add(s.mesh)

    const tick = () => {
      s.time += 0.04
      s.material.uniforms.uTime.value = s.time
      s.renderer.render(s.scene, s.camera)
      s.raf = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => {
      const nW = window.innerWidth
      const nH = window.innerHeight
      s.camera.aspect = nW / nH
      s.camera.fov    = 2 * Math.atan(nH / 2 / 200) * (180 / Math.PI)
      s.camera.updateProjectionMatrix()
      s.renderer.setSize(nW, nH)
      s.mesh.position.x = -nW * 0.29
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(s.raf)
      window.removeEventListener('resize', onResize)
      s.renderer.dispose()
      if (el.contains(s.renderer.domElement)) el.removeChild(s.renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const s = stateRef.current
    if (!s.material) return

    if (activeIdx < 0) {
      gsap.killTweensOf(s.material.uniforms.uOpacity)
      gsap.to(s.material.uniforms.uOpacity, { value: 0, duration: 0.45, ease: 'power2.out' })
      return
    }

    const isFirst = s.curIdx < 0
    const prev    = isFirst ? activeIdx : s.curIdx
    s.curIdx = activeIdx

    s.material.uniforms.uPrevIndex.value = prev
    s.material.uniforms.uIndex.value     = activeIdx

    if (!isFirst) {
      s.material.uniforms.uBlend.value = 0
      gsap.killTweensOf(s.material.uniforms.uBlend)
      gsap.to(s.material.uniforms.uBlend, { value: 1, duration: 0.85, ease: 'power2.inOut' })
    } else {
      s.material.uniforms.uBlend.value = 1
    }

    gsap.killTweensOf(s.material.uniforms.uOpacity)
    gsap.to(s.material.uniforms.uOpacity, { value: 1, duration: 0.55, ease: 'power2.out' })
  }, [activeIdx])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  )
}

/* ─── Full-screen Menu ───────────────────────────────────────────── */
function FullMenu({ isOpen, onNavigate }) {
  const overlayRef = useRef(null)
  const itemsRef   = useRef([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return

    if (isOpen) {
      gsap.set(el, { display: 'flex', clipPath: 'inset(0 0 100% 0)' })
      gsap.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 0.85, ease: 'power3.inOut' })

      itemsRef.current.forEach((item, i) => {
        if (!item) return
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 + i * 0.08 }
        )
      })
      gsap.fromTo(
        '.mnav-right-link',
        { opacity: 0, x: 18 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, delay: 0.45, ease: 'power2.out' }
      )
    } else {
      itemsRef.current.forEach((item, i) => {
        if (!item) return
        gsap.to(item, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in', delay: i * 0.04 })
      })
      gsap.to('.mnav-right-link', { opacity: 0, duration: 0.25 })
      gsap.to(el, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.75, delay: 0.2, ease: 'power3.inOut',
        onComplete: () => gsap.set(el, { display: 'none' }),
      })

    }
  }, [isOpen])

  return (
    <div
      ref={overlayRef}
      style={{
        display: 'none',
        position: 'fixed', inset: 0, zIndex: 500,
        background: '#0E0C0A',
        overflow: 'hidden',
        alignItems: 'center',
      }}
    >
      {/* WebGL — z:0, behind everything, occupies LEFT side */}
      <MenuCanvas activeIdx={activeIdx} />

      {/* Colour bloom — z:1 */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        opacity: activeIdx >= 0 ? 1 : 0,
        background: activeIdx >= 0
          ? `radial-gradient(ellipse 45% 65% at 21% 50%, ${NAV_LINKS[activeIdx]?.color}22, transparent 70%)`
          : 'none',
        filter: 'blur(50px)',
        transition: 'opacity 0.6s ease, background 0.5s ease',
      }} />

      {/* Film grain — z:2 */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.04,
      }} />

      {/* Thin vertical divider between left image zone and right nav zone */}
      <div style={{
        position: 'absolute', left: '42%', top: '10%', bottom: '10%',
        width: '1px',
        background: 'rgba(250,248,245,0.06)',
        zIndex: 5, pointerEvents: 'none',
      }} />

      {/* Counter — bottom right */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', right: '5vw',
        zIndex: 20, pointerEvents: 'none',
        fontFamily: 'var(--fb)', fontSize: '.7rem', letterSpacing: '.1em',
        color: 'rgba(250,248,245,0.2)',
        display: 'flex', alignItems: 'baseline', gap: '.3rem',
      }}>
        <span style={{
          fontSize: '1.1rem', color: 'rgba(250,248,245,0.5)',
          minWidth: '2ch', display: 'inline-block', textAlign: 'right',
          transition: 'all .35s cubic-bezier(0.23,1,0.32,1)',
        }}>
          {activeIdx >= 0 ? NAV_LINKS[activeIdx].num : '—'}
        </span>
        <span>/ 05</span>
      </div>

      {/* Caption — bottom left (inside image zone) */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', left: '6vw',
        zIndex: 20, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <span style={{
          display: 'block',
          fontFamily: 'var(--fd)', fontStyle: 'italic',
          fontSize: '.78rem', letterSpacing: '.16em',
          color: 'rgba(250,248,245,0.3)',
          transform: activeIdx >= 0 ? 'translateY(0)' : 'translateY(120%)',
          transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {activeIdx >= 0 ? NAV_LINKS[activeIdx].caption : ''}
        </span>
      </div>

      {/* Vertical side label */}
      <div style={{
        position: 'absolute', right: '2.2rem', top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
        fontFamily: 'var(--fb)', fontSize: '.52rem', letterSpacing: '.32em',
        textTransform: 'uppercase', color: 'rgba(250,248,245,0.1)',
        whiteSpace: 'nowrap', zIndex: 20, pointerEvents: 'none',
      }}>
        Paris · Milan · London
      </div>

      {/* Content — z:10 */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', width: '100%', height: '100%',
        alignItems: 'center',
      }}>
        {/*
          ── LEFT zone (42%) ──────────────────────────────────────────
          Empty — the WebGL canvas renders here via absolute positioning.
          We keep this spacer so flexbox pushes the nav to the right.
        */}
        <div style={{ width: '42%', flexShrink: 0 }} />

        {/*
          ── RIGHT zone (58%) — primary nav + secondary links ─────────
        */}
        <div style={{
          width: '58%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 0,
          paddingLeft: '5vw',
          paddingRight: '8vw',
          height: '100%',
        }}>
          {/* Primary nav links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.1rem' }}>
            {NAV_LINKS.map((link, i) => (
              <div
                key={link.label}
                ref={el => (itemsRef.current[i] = el)}
                style={{ position: 'relative', cursor: 'pointer', padding: '.4rem 0', opacity: 0 }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(0)}
                onClick={() => onNavigate(link.to)}
              >
                <span style={{
                  fontFamily: 'var(--fb)', fontSize: '.58rem', letterSpacing: '.14em',
                  color: activeIdx === i ? link.color : 'rgba(250,248,245,0.18)',
                  marginRight: '1.2rem', transition: 'color 0.35s',
                  verticalAlign: 'middle',
                }}>
                  {link.num}
                </span>

                <span style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 'clamp(2.2rem, 3.8vw, 4.6rem)',
                  fontWeight: 300, fontStyle: 'italic',
                  color: activeIdx === i ? '#FAF8F5' : 'rgba(250,248,245,0.14)',
                  letterSpacing: '-0.01em', lineHeight: 1.15,
                  transition: 'color 0.4s ease',
                  verticalAlign: 'middle',
                }}>
                  {link.label}
                </span>

                <div style={{
                  position: 'absolute', bottom: 0, left: 0, height: '1px',
                  background: link.color,
                  width: activeIdx === i ? '100%' : '0%',
                  transition: 'width 0.55s cubic-bezier(0.16,1,0.3,1)',
                }} />
              </div>
            ))}
          </div>

          {/* Thin separator */}
          <div style={{
            width: '100%', height: '1px',
            background: 'rgba(250,248,245,0.07)',
            margin: '1.8rem 0 1.4rem',
          }} />

          {/* Secondary links — horizontal row */}
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              ['The Edit',       '/collection?filter=featured'],
              ['Our Story',      '#'],
              ['Sustainability', '#'],
              ['Contact',        '#'],
            ].map(([label, to]) => (
              <div
                key={label}
                className="mnav-right-link"
                onClick={() => onNavigate(to)}
                style={{
                  fontFamily: 'var(--fd)', fontStyle: 'italic',
                  fontSize: 'clamp(.85rem,1.1vw,1.15rem)',
                  color: 'rgba(250,248,245,0.28)',
                  cursor: 'pointer', letterSpacing: '.04em',
                  transition: 'color 0.3s', opacity: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(250,248,245,0.85)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,248,245,0.28)')}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Navbar ────────────────────────────────────────────────── */
export default function Navbar() {
  const [isOpen,     setIsOpen]     = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [atTop,      setAtTop]      = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ,    setSearchQ]    = useState('')
  const navRef   = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const items      = useCartStore(s => s.items)
  const toggleCart = useCartStore(s => s.toggleCart)
  const { isAuthenticated, logout } = useAuthStore()
  const itemCount  = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => { setIsOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setAtTop(y < 10)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (!navRef.current) return
    gsap.fromTo(
      navRef.current,
      { y: -70, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.2 }
    )
  }, [])

  const handleNavigate = useCallback((to) => {
    setIsOpen(false)
    setTimeout(() => { if (to !== '#') navigate(to) }, 500)
  }, [navigate])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQ.trim())}`)
      setSearchOpen(false)
      setSearchQ('')
    }
  }

  const isHome      = location.pathname === '/'
  const transparent = isHome && atTop && !isOpen
  const iconColor   = isOpen ? '#FAF8F5' : 'var(--ch)'
  const logoColor   = isOpen ? '#FAF8F5' : 'var(--ch)'
  const navBg       = isOpen || transparent ? 'transparent' : 'rgba(250,248,245,0.97)'
  const navBorder   = isOpen || transparent ? 'none' : '1px solid var(--bo)'
  const navShadow   = scrolled && !isOpen && !transparent ? '0 2px 24px rgba(26,23,20,0.07)' : 'none'

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 550, height: 62,
          display: 'flex', alignItems: 'center',
          padding: '0 5vw', gap: '1rem',
          background: navBg,
          borderBottom: navBorder,
          backdropFilter: transparent || isOpen ? 'none' : 'blur(10px)',
          transition: 'background .4s, box-shadow .4s, border-color .4s',
          boxShadow: navShadow,
          opacity: 1,
        }}
      >
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          style={{
            fontFamily: 'var(--fd)', fontSize: '1.55rem',
            letterSpacing: '.32em', fontWeight: 400,
            color: logoColor, flex: 1,
            transition: 'color .4s', textDecoration: 'none',
          }}
        >
          AURA
        </Link>

        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          {searchOpen && !isOpen ? (
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <input
                autoFocus value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search..."
                style={{
                  background: 'transparent', border: 'none',
                  borderBottom: `1px solid ${iconColor}40`,
                  fontFamily: 'var(--fb)', fontSize: '.75rem',
                  color: iconColor, padding: '.2rem .3rem', outline: 'none', width: 140,
                }}
              />
              <button type="button" onClick={() => setSearchOpen(false)} style={mkIconBtn(iconColor)}>
                <X size={14} strokeWidth={1.5} />
              </button>
            </form>
          ) : (
            <button onClick={() => !isOpen && setSearchOpen(true)} style={mkIconBtn(iconColor)} aria-label="Search">
              <Search size={15} strokeWidth={1.5} />
            </button>
          )}

          <Link to="/wishlist" className="nav-wishlist-link" style={mkIconBtn(iconColor)} aria-label="Wishlist">
            <Heart size={15} strokeWidth={1.5} />
          </Link>

          {isAuthenticated ? (
            <button onClick={logout} className="nav-auth-btn" style={mkTextBtn(iconColor)}>Sign Out</button>
          ) : (
            <Link to="/login" className="nav-auth-btn" style={mkTextBtn(iconColor)}>
              <User size={14} strokeWidth={1.5} style={{ marginRight: 4 }} />
              Sign In
            </Link>
          )}

          <button
            onClick={toggleCart}
            style={{ ...mkIconBtn(iconColor), display: 'flex', alignItems: 'center', gap: 5 }}
            aria-label="Cart"
          >
            <ShoppingBag size={15} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 16, height: 16,
                background: iconColor === '#FAF8F5' ? '#FAF8F5' : 'var(--ch)',
                color: iconColor === '#FAF8F5' ? 'var(--ch)' : 'var(--cr)',
                borderRadius: '50%', fontSize: '.5rem', fontWeight: 500,
                transition: 'background .4s, color .4s',
              }}>
                {itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsOpen(o => !o)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            style={{
              ...mkIconBtn(iconColor),
              flexDirection: 'column', gap: '5px',
              width: 36, height: 36,
              justifyContent: 'center', alignItems: 'center',
              padding: 0,
            }}
          >
            {isOpen ? (
              <X size={18} strokeWidth={1.2} color={iconColor} />
            ) : (
              <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                <path d="M9 1H21"  stroke={iconColor} strokeWidth="1.2" strokeLinecap="round" />
                <path d="M1 9H21"  stroke={iconColor} strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <FullMenu isOpen={isOpen} onNavigate={handleNavigate} />

      <style>{`
        @media (max-width: 600px) {
          .nav-wishlist-link, .nav-auth-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}

const mkIconBtn = (color) => ({
  background: 'none', border: 'none',
  color, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 0, transition: 'color .3s, opacity .3s',
  minHeight: 'unset', minWidth: 'unset',
})

const mkTextBtn = (color) => ({
  background: 'none', border: 'none',
  fontFamily: 'var(--fb)', fontSize: '.62rem',
  letterSpacing: '.15em', textTransform: 'uppercase',
  color, cursor: 'pointer',
  display: 'flex', alignItems: 'center',
  transition: 'color .3s',
  minHeight: 'unset', minWidth: 'unset',
  textDecoration: 'none',
})

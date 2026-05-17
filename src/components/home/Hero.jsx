import { useRef, useEffect, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import * as THREE from 'three'

import hero1 from '../../assets/images/hero1.jpg'
import hero2 from '../../assets/images/hero2.jpg'
import hero3 from '../../assets/images/hero3.jpg'

gsap.registerPlugin(ScrollTrigger)

/* ─── Panel data ─────────────────────────────────────────────── */
const PANELS = [
  {
    num: '01', category: 'The Edit — SS 2025',
    title: 'Culture,\nCurated.',
    body: "From the streets to the runway — icons don't follow the brief, they rewrite it. This is the edit that defines the season.",
    cta: { label: 'Explore The Edit', to: '/collection' },
    cta2: { label: 'Our Story' },
    img: hero1,
    tags: [
      { pos: { top: '18%', right: '8%' },    collection: 'The Edit',    name: 'Saint Laurent Trench', price: '₹38,500' },
      { pos: { bottom: '22%', left: '6%' },  collection: 'Street Luxe', name: 'Noir Graphic Tee',     price: '₹5,200'  },
    ],
    badge: 'The Edit — 24 Pieces',
  },
  {
    num: '02', category: 'Noir Collective',
    title: 'Leather\n& Dark.',
    body: 'Precision-cut leather. Architectural silhouettes. Six looks. One statement: black is never simple.',
    cta: { label: 'Shop Noir', to: '/collection' },
    img: hero2,
    tags: [
      { pos: { top: '18%', right: '7%' }, collection: 'Noir Collective', name: 'Croc Leather Coat', price: '₹64,000' },
    ],
    badge: '6 Looks — 1 Statement',
  },
  {
    num: '03', category: 'Modern Room',
    title: 'The Show-\nroom.',
    body: 'Save time. Never compromise. Our curated showroom brings every essential under one roof — for those who move fast.',
    cta: { label: 'Visit Showroom', to: '/collection' },
    img: hero3,
    tags: [
      { pos: { top: '18%', right: '7%' }, collection: 'Modern Room', name: 'Linen Shift Dress', price: '₹18,500' },
    ],
    badge: 'Showroom — Open Now',
  },
]

/* ─── Shaders (from main.js inspiration) ─────────────────────── */
const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */`
  uniform sampler2D u_texture0;
  uniform sampler2D u_texture1;
  uniform sampler2D u_displacement;
  uniform float     u_progress;
  uniform float     u_strength;
  uniform float     u_rgbShift;
  uniform float     u_scale;
  uniform vec2      u_resolution;
  uniform vec2      u_textureResolution0;
  uniform vec2      u_textureResolution1;
  varying vec2 vUv;

  vec2 coverUV(vec2 uv, vec2 planeRes, vec2 texRes) {
    float sc = max(planeRes.x / texRes.x, planeRes.y / texRes.y);
    vec2  ns = texRes * sc;
    return uv * (planeRes / ns) + (ns - planeRes) / 2.0 / ns;
  }

  void main() {
    // Displacement with animated wave ripple
    float d = texture2D(u_displacement, vUv).r;
    d = mix(d, d * (sin(vUv.y * 10.0 + u_progress * 6.28318) * 0.5 + 0.5), 0.3);

    vec2 uv0 = coverUV(vUv, u_resolution, u_textureResolution0);
    vec2 uv1 = coverUV(vUv, u_resolution, u_textureResolution1);

    float se     = 1.0 + u_progress * (1.0 - u_progress) * u_scale;
    vec2  center = vec2(0.5);

    vec2 dist0 = (uv0 - center) / se       + center + u_progress         * d * u_strength * vec2(1.0, 0.5);
    vec2 dist1 = (uv1 - center) * se       + center - (1.0 - u_progress) * d * u_strength * vec2(1.0, 0.5);

    // RGB channel split at peak of transition
    float rgb = u_progress * (1.0 - u_progress) * u_rgbShift;

    vec4 t0 = vec4(
      texture2D(u_texture0, dist0 + vec2(rgb, 0.0)).r,
      texture2D(u_texture0, dist0).g,
      texture2D(u_texture0, dist0 - vec2(rgb, 0.0)).b,
      texture2D(u_texture0, dist0).a
    );
    vec4 t1 = vec4(
      texture2D(u_texture1, dist1 + vec2(rgb, 0.0)).r,
      texture2D(u_texture1, dist1).g,
      texture2D(u_texture1, dist1 - vec2(rgb, 0.0)).b,
      texture2D(u_texture1, dist1).a
    );

    gl_FragColor = mix(t0, t1, smoothstep(0.0, 1.0, u_progress));
  }
`

/* ─── Procedural displacement texture ────────────────────────── */
function makeDispTex() {
  const sz  = 256
  const c1  = document.createElement('canvas')
  c1.width  = c1.height = sz
  const g1  = c1.getContext('2d')
  const img = g1.createImageData(sz, sz)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  g1.putImageData(img, 0, 0)

  // Smooth the noise for softer displacement
  const c2  = document.createElement('canvas')
  c2.width  = c2.height = sz
  const g2  = c2.getContext('2d')
  g2.filter = 'blur(8px)'
  g2.drawImage(c1, 0, 0)

  const tex        = new THREE.CanvasTexture(c2)
  tex.wrapS        = tex.wrapT = THREE.RepeatWrapping
  return tex
}

/* ─── Scramble text (from ScrollScramble.jsx inspiration) ────── */
const SCRAMBLE_CHARS = '▙▚▞▝▀▖▜▛▟ ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function scrambleTo(el, text, duration = 600) {
  if (!el) return
  let raf, t0 = null
  function tick(ts) {
    if (!t0) t0 = ts
    const p = Math.min((ts - t0) / duration, 1)
    const revealed = Math.floor(p * text.length)
    let out = ''
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '\n') { out += '\n'; continue }
      out += i < revealed
        ? text[i]
        : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    }
    el.textContent = out
    if (p < 1) raf = requestAnimationFrame(tick)
    else el.textContent = text
  }
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(tick)
}

/* ─── Main Hero component ─────────────────────────────────────── */
export default function Hero() {
  /* DOM refs */
  const wrapRef     = useRef(null)
  const loadingRef  = useRef(null)
  const bloomRef    = useRef(null)
  const scrollRef   = useRef(null)   // scroll container — height: N*100vh
  const canvasRef   = useRef(null)   // Three.js mount point

  /* Text refs — managed by scramble / GSAP directly (not React) */
  const numRef      = useRef(null)
  const catRef      = useRef(null)
  const titleRef    = useRef(null)
  const bodyRef     = useRef(null)
  const badgeRef    = useRef(null)

  /* UI refs */
  const progressRef = useRef(null)
  const dotsRef     = useRef(null)

  /* Three.js imperative state — never triggers re-renders */
  const gl = useRef({
    renderer: null, camera: null, scene: null, mesh: null,
    textures: [], curIdx: 0, transitioning: false, raf: null,
  })

  /* React state — only for structural DOM changes (tags, CTA link) */
  const [activeIdx, setActiveIdx] = useState(0)

  /* ─── Three.js init ─────────────────────────────────────────── */
  useEffect(() => {
    const g  = gl.current
    const el = canvasRef.current
    if (!el) return

    const W = window.innerWidth
    const H = window.innerHeight

    // Renderer
    g.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    g.renderer.setSize(W, H)
    g.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    Object.assign(g.renderer.domElement.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
    })
    el.appendChild(g.renderer.domElement)

    // Camera — orthographic so shader fills exact viewport
    g.camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -1, 1)
    g.scene  = new THREE.Scene()

    // Shader mesh
    const geo = new THREE.PlaneGeometry(W, H)
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        u_texture0:           { value: null },
        u_texture1:           { value: null },
        u_displacement:       { value: makeDispTex() },
        u_progress:           { value: 0 },
        u_resolution:         { value: new THREE.Vector2(W, H) },
        u_textureResolution0: { value: new THREE.Vector2(1, 1) },
        u_textureResolution1: { value: new THREE.Vector2(1, 1) },
        u_strength:           { value: 0.8 },
        u_rgbShift:           { value: 0.05 },
        u_scale:              { value: 0.15 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    })

    g.mesh = new THREE.Mesh(geo, mat)
    g.scene.add(g.mesh)

    // Load all hero textures
    const loader = new THREE.TextureLoader()
    Promise.all(
      PANELS.map(p => new Promise(res =>
        loader.load(p.img, tex => {
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping
          res(tex)
        })
      ))
    ).then(textures => {
      g.textures = textures
      const u = mat.uniforms
      u.u_texture0.value = textures[0]
      u.u_texture1.value = textures[0]
      if (textures[0].image) {
        const { width: iw, height: ih } = textures[0].image
        u.u_textureResolution0.value.set(iw, ih)
        u.u_textureResolution1.value.set(iw, ih)
      }
    })

    // Render loop — only renders Three.js scene.
    // Lenis is already driven by the GSAP ticker in Smoothscroller.jsx,
    // so we must NOT call __lenis.raf() here (double-pumping causes
    // erratic scroll positions and repeated image transitions).
    function render() {
      g.raf = requestAnimationFrame(render)
      g.renderer.render(g.scene, g.camera)
    }
    g.raf = requestAnimationFrame(render)

    // Resize handler
    function onResize() {
      const w = window.innerWidth, h = window.innerHeight
      g.renderer.setSize(w, h)
      g.camera.left   = -w / 2; g.camera.right  = w / 2
      g.camera.top    =  h / 2; g.camera.bottom = -h / 2
      g.camera.updateProjectionMatrix()
      g.mesh.geometry.dispose()
      g.mesh.geometry = new THREE.PlaneGeometry(w, h)
      mat.uniforms.u_resolution.value.set(w, h)
      ScrollTrigger.update()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(g.raf)
      window.removeEventListener('resize', onResize)
      g.renderer.dispose()
      if (el.contains(g.renderer.domElement)) el.removeChild(g.renderer.domElement)
    }
  }, [])

  /* ─── WebGL texture transition ──────────────────────────────── */
  const transitionTo = useCallback((idx) => {
    const g = gl.current
    // Guard: valid index, textures loaded, not already on this panel, not mid-transition
    if (
      !g.textures.length ||
      idx < 0 || idx >= g.textures.length ||
      idx === g.curIdx ||
      g.transitioning
    ) return
    g.transitioning = true

    const mat = g.mesh.material
    const tex = g.textures[idx]
    mat.uniforms.u_texture1.value = tex
    if (tex.image) {
      mat.uniforms.u_textureResolution1.value.set(tex.image.width, tex.image.height)
    }

    // Kill any in-progress tween on the progress uniform before starting a new one
    gsap.killTweensOf(mat.uniforms.u_progress)

    gsap.to(mat.uniforms.u_progress, {
      value: 1, duration: 0.85, ease: 'power3.inOut',
      onComplete() {
        mat.uniforms.u_texture0.value = tex
        if (tex.image) {
          mat.uniforms.u_textureResolution0.value.set(tex.image.width, tex.image.height)
        }
        mat.uniforms.u_progress.value = 0
        g.curIdx = idx
        g.transitioning = false
      },
    })
  }, [])

  /* ─── ScrollTrigger (sticky scroll from style.css pattern) ──── */
  useGSAP(() => {
    if (!scrollRef.current) return

    let prev = -1  // -1 so first call always fires

    ScrollTrigger.create({
      trigger: scrollRef.current,
      // 'bottom bottom' aligns the end to the actual bottom of the
      // scroll container (PANELS.length * 100vh), so progress goes
      // 0→1 exactly once as the user scrolls through the hero section.
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate(self) {
        // Clamp index strictly — never loops, never repeats
        const idx = Math.min(
          PANELS.length - 1,
          Math.max(0, Math.round(self.progress * (PANELS.length - 1)))
        )

        // Progress bar
        if (progressRef.current)
          progressRef.current.style.width = `${self.progress * 100}%`

        // Dots
        dotsRef.current?.querySelectorAll('.h-dot').forEach((d, i) => {
          const active = i === idx
          d.style.background = active ? 'rgba(184,149,96,0.9)' : 'rgba(250,248,245,0.2)'
          d.style.transform  = active ? 'scale(1.9)' : 'scale(1)'
        })

        // Only run panel-change logic when the index actually changes
        if (idx === prev) return
        prev = idx
        const panel = PANELS[idx]

        // 1. WebGL displacement transition
        transitionTo(idx)

        // 2. Scramble text
        scrambleTo(numRef.current,   panel.num,      260)
        scrambleTo(catRef.current,   panel.category, 380)
        scrambleTo(titleRef.current, panel.title,    680)

        // 3. Body fades out ↕ in (too long to scramble)
        if (bodyRef.current) {
          gsap.to(bodyRef.current, {
            opacity: 0, y: -8, duration: 0.18,
            onComplete() {
              if (!bodyRef.current) return
              bodyRef.current.textContent = panel.body
              gsap.to(bodyRef.current, { opacity: 1, y: 0, duration: 0.38 })
            },
          })
        }

        // 4. Badge
        if (badgeRef.current) {
          gsap.to(badgeRef.current, {
            opacity: 0, duration: 0.15,
            onComplete() {
              if (!badgeRef.current) return
              badgeRef.current.textContent = panel.badge
              gsap.to(badgeRef.current, { opacity: 1, duration: 0.35 })
            },
          })
        }

        // 5. React state update — re-renders tags + CTA link only
        setActiveIdx(idx)
      },
    })
  }, [transitionTo])

  /* ─── Bloom entrance (preserved from original Hero.jsx) ─────── */
  useEffect(() => {
    const bloom   = bloomRef.current
    const loading = loadingRef.current
    const scroll  = scrollRef.current
    if (!bloom || !loading || !scroll) return

    gsap.set(scroll, { autoAlpha: 0 })

    if (window.__lenis) window.__lenis.stop()

    const tl = gsap.timeline({
      delay: 0.3,
      defaults: { ease: 'power2.inOut' },
      onComplete: () => { if (window.__lenis) window.__lenis.start() },
    })

    const brandSpans = loading.querySelectorAll('.hero-brand-letter')
    if (brandSpans.length) {
      tl.from(brandSpans, { opacity: 0, y: 10, stagger: 0.1, duration: 0.55 })
    }

    const line = loading.querySelector('.hero-loading-line')
    if (line) tl.from(line, { scaleX: 0, duration: 0.7, ease: 'power3.inOut' }, '<0.3')

    tl.to(bloom, { rotate: -6, scale: 1, duration: 0.6 }, '<0.5')
    tl.to(bloom, { rotate: 0, duration: 0.55 }, '<0.4')
    tl.to(bloom, { width: '100%', height: '100%', duration: 1.2, ease: 'power3.inOut' }, '<0.1')
    tl.to(loading, { autoAlpha: 0, duration: 0.4 }, '<0.7')
    tl.to(scroll,  { autoAlpha: 1, duration: 0.25 }, '<0.2')

    // Entrance animations for initial panel UI
    tl.from(
      [numRef.current, catRef.current],
      { opacity: 0, y: 14, stagger: 0.09, duration: 0.55, ease: 'power3.out' },
      '<0.15'
    )
    tl.from(titleRef.current, { opacity: 0, y: 22, duration: 0.7, ease: 'power3.out' }, '<0.1')
    tl.from(bodyRef.current,  { opacity: 0, y: 10, duration: 0.5, ease: 'power3.out' }, '<0.12')
    tl.from('.hero-cta-group', { opacity: 0, y: 10, duration: 0.45, ease: 'power3.out' }, '<0.1')
    tl.from('.hero-tag',  { opacity: 0, y: 14, stagger: 0.1, duration: 0.45 }, '<0.1')
    tl.from(badgeRef.current, { opacity: 0, x: 10, duration: 0.4 }, '<0.08')
  }, [])

  const panel = PANELS[activeIdx]

  /* ─── Render ─────────────────────────────────────────────────── */
  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>

      {/* ══ Loading / bloom screen ════════════════════════════════ */}
      <div
        ref={loadingRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#0a0a0a',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Brand wordmark */}
        <div style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(0.9rem,1.8vw,1.3rem)',
          fontWeight: 300, letterSpacing: '0.55em',
          textTransform: 'uppercase', color: '#faf8f5',
          marginBottom: '2.4rem',
          display: 'flex', gap: '0.4rem',
        }}>
          {'AURA'.split('').map((ch, i) => (
            <span className="hero-brand-letter" key={i}>{ch}</span>
          ))}
        </div>

        <div
          className="hero-loading-line"
          style={{
            width: 120, height: 1,
            background: 'rgba(250,248,245,0.25)',
            transformOrigin: 'left center',
            marginBottom: '2.8rem',
          }}
        />

        <div style={{
          fontSize: '.48rem', letterSpacing: '.35em',
          textTransform: 'uppercase', color: 'rgba(250,248,245,0.35)',
        }}>
          SS 2025 — The Edit
        </div>

        {/* Bloom image */}
        <div
          ref={bloomRef}
          style={{
            position: 'absolute',
            width: '8vw', height: '13vw',
            transform: 'rotate(0deg) scale(0)',
            overflow: 'hidden', willChange: 'transform, width, height',
          }}
        >
          <img
            src={hero1}
            alt="AURA SS 2025"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block', transform: 'scale(1.6)', filter: 'grayscale(20%)',
            }}
          />
        </div>
      </div>

      {/* ══ Sticky scroll hero ════════════════════════════════════
          Outer div creates the scroll height (N×100vh).
          Inner sticky div is the visible viewport. This pattern
          is taken directly from style.css (#gl-container / #gl-scroller).
      ═══════════════════════════════════════════════════════════ */}
      <div
        ref={scrollRef}
        style={{ position: 'relative', height: `${PANELS.length * 100}vh`, visibility: 'hidden' }}
      >
        {/* ── Sticky viewport ─────────────────────────────────── */}
        <div style={{
          position: 'sticky', top: 0,
          height: '100vh', overflow: 'hidden',
          background: '#0e0e0e',
        }}>
          {/* WebGL canvas mount */}
          <div
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />

          {/* Gradient veil — depth + legibility */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: [
              'linear-gradient(180deg, rgba(0,0,0,0.58) 0%, transparent 30%)',
              'linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.22) 42%, transparent 66%)',
            ].join(', '),
          }} />

          {/* Film grain */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.04,
          }} />

          {/* Progress bar */}
          <div style={{
            position: 'absolute',
            top: 'clamp(54px,6vw,62px)', left: 0, right: 0,
            height: 1, background: 'rgba(255,255,255,0.1)', zIndex: 10,
          }}>
            <div
              ref={progressRef}
              style={{
                height: '100%', width: '0%',
                background: 'rgba(255,255,255,0.65)',
                transition: 'width 0.05s linear',
              }}
            />
          </div>

          {/* Brand / season label */}
          <div style={{
            position: 'absolute',
            top: 'calc(clamp(54px, 6vw, 62px) + 1.1rem)',
            left: 'clamp(1.5rem,3vw,3rem)',
            zIndex: 10, display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <span style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(.8rem,1.4vw,1rem)',
              fontWeight: 300, letterSpacing: '0.4em', textTransform: 'uppercase',
              color: 'rgba(250,248,245,0.9)',
            }}>
              AURA
            </span>
            <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.25)' }} />
            <span style={{
              fontSize: '.5rem', letterSpacing: '.28em',
              textTransform: 'uppercase', color: 'rgba(250,248,245,0.4)',
            }}>
              SS 2025
            </span>
          </div>

          {/* Dot navigation */}
          <div ref={dotsRef} style={{
            position: 'absolute',
            right: 'clamp(1.4rem,2.5vw,2.5rem)', top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10, display: 'flex', flexDirection: 'column',
            gap: 10, alignItems: 'center',
          }}>
            {PANELS.map((_, i) => (
              <div
                key={i}
                className="h-dot"
                style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: i === 0 ? 'rgba(250,248,245,0.9)' : 'rgba(250,248,245,0.2)',
                  transform: i === 0 ? 'scale(1.9)' : 'scale(1)',
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            ))}
          </div>

          {/* ── Main UI overlay ──────────────────────────────── */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            padding: 'clamp(2rem,4vw,4rem) clamp(1.8rem,4.5vw,4rem)',
            paddingTop: 'calc(clamp(54px, 6vw, 62px) + clamp(3.5rem,5vw,4.5rem))',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'var(--cr)',
          }}>
            {/* Panel header — number + category (scrambled on scroll) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span
                ref={numRef}
                style={{
                  fontFamily: 'monospace', fontSize: '.65rem',
                  letterSpacing: '.14em', color: 'rgba(250,248,245,0.4)',
                }}
              >
                {PANELS[0].num}
              </span>
              <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.22)' }} />
              <span
                ref={catRef}
                style={{
                  fontSize: '.52rem', letterSpacing: '.28em',
                  textTransform: 'uppercase', color: 'rgba(250,248,245,0.5)',
                }}
              >
                {PANELS[0].category}
              </span>
            </div>

            {/* Panel footer — body copy + large scramble title */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap',
            }}>
              {/* Left: body + CTA */}
              <div style={{ maxWidth: 290 }}>
                <p
                  ref={bodyRef}
                  style={{
                    fontSize: '.76rem', lineHeight: 1.95,
                    color: 'rgba(250,248,245,0.82)',
                    textShadow: '0 1px 8px rgba(0,0,0,0.55)',
                    letterSpacing: '.01em',
                  }}
                >
                  {PANELS[0].body}
                </p>

                {/* CTA — React state manages link target */}
                <div
                  className="hero-cta-group"
                  style={{
                    marginTop: '1.8rem',
                    display: 'flex', alignItems: 'center', gap: '2rem',
                  }}
                >
                  <Link to={panel.cta.to}>
                    <button className="btn-primary"><span>{panel.cta.label}</span></button>
                  </Link>
                  {activeIdx === 0 && (
                    <button className="btn-ghost" style={{ color: 'var(--cr)' }}>
                      Our Story
                    </button>
                  )}
                </div>
              </div>

              {/* Right: large title — scrambled on scroll */}
              <div style={{ textAlign: 'right' }}>
                <h2
                  ref={titleRef}
                  style={{
                    fontFamily: 'var(--fd)',
                    fontSize: 'clamp(4rem,10vw,8.8rem)',
                    fontWeight: 300, color: 'var(--cr)',
                    letterSpacing: '-0.035em', lineHeight: 0.9,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {PANELS[0].title}
                </h2>
              </div>
            </div>
          </div>

          {/* ── Floating product tags ────────────────────────────
              All panels pre-rendered; CSS opacity reveals active panel.
              This avoids React re-renders during scramble animation.
          ─────────────────────────────────────────────────────── */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none' }}>
            {PANELS.map((p, pi) =>
              p.tags.map((tag, ti) => (
                <div
                  key={`${pi}-${ti}`}
                  className="hero-tag"
                  style={{
                    position: 'absolute',
                    ...tag.pos,
                    opacity: pi === activeIdx ? 1 : 0,
                    transform: pi === activeIdx ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.35s ease, transform 0.35s ease',
                    pointerEvents: pi === activeIdx ? 'all' : 'none',
                    background: 'rgba(10,10,10,0.88)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '.75rem 1.05rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                    minWidth: 140,
                  }}
                >
                  <span style={{
                    display: 'block', fontSize: '.46rem',
                    letterSpacing: '.2em', textTransform: 'uppercase',
                    color: 'var(--go)', marginBottom: '.28rem',
                  }}>
                    {tag.collection}
                  </span>
                  <strong style={{
                    display: 'block', fontFamily: 'var(--fd)',
                    fontSize: '.92rem', fontWeight: 400,
                    color: '#faf8f5', marginBottom: '.18rem',
                  }}>
                    {tag.name}
                  </strong>
                  <span style={{ fontSize: '.68rem', color: 'rgba(250,248,245,0.45)' }}>
                    {tag.price}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* ── Badge ─────────────────────────────────────────── */}
          <div style={{
            position: 'absolute', bottom: '1.8rem', right: '1.8rem', zIndex: 10,
            display: 'flex', alignItems: 'center', gap: '.6rem',
            background: 'var(--go)', padding: '.5rem .95rem',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--ch)', flexShrink: 0, display: 'inline-block',
            }} />
            <span
              ref={badgeRef}
              style={{
                fontSize: '.5rem', letterSpacing: '.2em',
                textTransform: 'uppercase', color: 'var(--ch)',
              }}
            >
              {PANELS[0].badge}
            </span>
          </div>

          {/* ── Vertical side label ───────────────────────────── */}
          <div style={{
            position: 'absolute', right: '2.2rem', top: '50%',
            transform: 'translateY(-50%) rotate(90deg)',
            fontFamily: 'var(--fb)', fontSize: '.52rem',
            letterSpacing: '.32em', textTransform: 'uppercase',
            color: 'rgba(250,248,245,0.1)',
            whiteSpace: 'nowrap', zIndex: 10, pointerEvents: 'none',
          }}>
            Paris · Milan · London
          </div>
        </div>
      </div>
    </div>
  )
}

import { useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

/**
 * TransitionLayout — wraps all routes and plays a clip-path reveal
 * animation on every route change.
 *
 * Uses a full-screen overlay that wipes in, swaps content, then wipes out.
 */
export default function TransitionLayout({ children }) {
  const location = useLocation()
  const overlayRef = useRef(null)
  const contentRef = useRef(null)
  const prevPath = useRef(location.pathname)

  const playReveal = useCallback(() => {
    const overlay = overlayRef.current
    const content = contentRef.current
    if (!overlay || !content) return

    const tl = gsap.timeline()

    // Fade in content from below
    tl.fromTo(content,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all' },
      0.05
    )

    // Thin accent line sweep (top of page)
    tl.fromTo(overlay,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(overlay, {
            scaleX: 0,
            duration: 0.4,
            ease: 'power2.in',
            transformOrigin: 'right center',
          })
        }
      },
      0
    )
  }, [])

  useGSAP(() => {
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname
      playReveal()
    }
  }, [location.pathname, playReveal])

  return (
    <>
      {/* Transition accent line */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'var(--go)',
          zIndex: 10000,
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          pointerEvents: 'none',
        }}
      />

      {/* Page content */}
      <div ref={contentRef}>
        {children}
      </div>
    </>
  )
}

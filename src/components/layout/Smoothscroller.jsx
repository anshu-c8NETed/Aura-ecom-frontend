import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroller({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,          // GSAP ticker drives the RAF loop
      lerp: 0.085,             // smoothing factor — lower = slower/silkier
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false,
    })

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from the GSAP ticker for frame-perfect sync
    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Expose lenis instance globally so Hero.jsx can stop/start it
    window.__lenis = lenis

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  return <>{children}</>
}
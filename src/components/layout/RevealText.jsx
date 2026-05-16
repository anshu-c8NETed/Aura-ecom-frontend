import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function RevealText({
  children,
  tag: Tag = 'div',
  className = '',
  delay = 0,
  stagger = 0.022,
  start = 'top 88%',
  once = true,
}) {
  const ref = useRef(null)

  useGSAP(() => {
    const chars = ref.current?.querySelectorAll('.rv-char')
    if (!chars?.length) return
    gsap.from(chars, {
      y: '105%',
      opacity: 0,
      duration: 0.95,
      stagger,
      delay,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: ref.current,
        start,
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    })
  }, { scope: ref })

  if (typeof children !== 'string') return <Tag className={className}>{children}</Tag>

  const words = children.split(' ')

  return (
    <Tag ref={ref} className={className} style={{ overflow: 'visible' }}>
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          {word.split('').map((char, ci) => (
            <span key={ci} className="rv-char" style={{ display: 'inline-block' }}>
              {char}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span className="rv-char" style={{ display: 'inline-block' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  )
}
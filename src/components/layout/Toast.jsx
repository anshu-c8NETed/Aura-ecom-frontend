import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useToastStore from '../../store/useToastStore'

const TYPE_STYLES = {
  success: {
    bg: 'var(--ch)',
    accent: 'var(--go)',
    color: 'var(--cr)',
  },
  error: {
    bg: '#2A1418',
    accent: '#c0392b',
    color: '#FAF8F5',
  },
  info: {
    bg: 'var(--ch)',
    accent: 'var(--mu)',
    color: 'var(--cr)',
  },
}

function ToastItem({ toast, onDismiss }) {
  const ref = useRef(null)
  const style = TYPE_STYLES[toast.type] || TYPE_STYLES.success

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Enter animation
    gsap.fromTo(el,
      { y: 60, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    )
  }, [])

  useEffect(() => {
    if (!toast.exiting || !ref.current) return
    gsap.to(ref.current, {
      y: 20, opacity: 0, scale: 0.92,
      duration: 0.35, ease: 'power2.in',
    })
  }, [toast.exiting])

  return (
    <div
      ref={ref}
      onClick={() => onDismiss(toast.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.9rem',
        background: style.bg,
        color: style.color,
        padding: '0.85rem 1.6rem 0.85rem 1.2rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(26,23,20,0.25), 0 2px 8px rgba(26,23,20,0.12)',
        backdropFilter: 'blur(12px)',
        maxWidth: '380px',
        width: 'max-content',
        pointerEvents: 'auto',
      }}
    >
      {/* Accent left bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '3px', background: style.accent,
      }} />

      {/* Icon */}
      <span style={{
        fontFamily: 'var(--fb)',
        fontSize: '0.72rem',
        fontWeight: 500,
        color: style.accent,
        flexShrink: 0,
        width: 20,
        textAlign: 'center',
      }}>
        {toast.icon}
      </span>

      {/* Message */}
      <span style={{
        fontFamily: 'var(--fb)',
        fontSize: '0.64rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        lineHeight: 1.5,
      }}>
        {toast.message}
      </span>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '2px', background: 'rgba(255,255,255,0.06)',
      }}>
        <div
          style={{
            height: '100%',
            background: style.accent,
            animation: `toastProgress 3s linear forwards`,
            transformOrigin: 'left',
          }}
        />
      </div>
    </div>
  )
}

export default function Toast() {
  const toasts = useToastStore(s => s.toasts)
  const dismiss = useToastStore(s => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '0.6rem',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  )
}

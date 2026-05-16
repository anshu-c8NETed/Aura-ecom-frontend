import { create } from 'zustand'

let toastId = 0

const useToastStore = create((set, get) => ({
  toasts: [],

  /**
   * Show a toast notification.
   * @param {string} message  — text to display
   * @param {object} options  — { type: 'success'|'error'|'info', duration: ms, icon: string }
   */
  show: (message, options = {}) => {
    const id = ++toastId
    const {
      type = 'success',
      duration = 3000,
      icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ',
    } = options

    set(s => ({
      toasts: [...s.toasts, { id, message, type, icon, exiting: false }],
    }))

    // Auto-dismiss
    setTimeout(() => get().dismiss(id), duration)

    return id
  },

  dismiss: (id) => {
    // Mark as exiting for exit animation
    set(s => ({
      toasts: s.toasts.map(t => t.id === id ? { ...t, exiting: true } : t),
    }))

    // Remove after animation
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
    }, 400)
  },
}))

export default useToastStore

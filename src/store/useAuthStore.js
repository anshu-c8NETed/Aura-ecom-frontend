import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/axios'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({ user: data.data.user, isAuthenticated: true, isLoading: false })
          return data
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed'
          set({ error: msg, isLoading: false })
          throw new Error(msg)
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post('/auth/register', payload)
          set({ user: data.data.user, isAuthenticated: true, isLoading: false })
          return data
        } catch (err) {
          const msg = err.response?.data?.message || 'Registration failed'
          set({ error: msg, isLoading: false })
          throw new Error(msg)
        }
      },

      logout: async () => {
        try { await api.post('/auth/logout') } catch (_) {}
        set({ user: null, isAuthenticated: false, error: null })
      },

      updateUser: (patch) => set(s => ({ user: { ...s.user, ...patch } })),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'aura-auth',
      partialize: s => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
)

// Listen for axios-triggered logouts
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => useAuthStore.getState().logout())
}

export default useAuthStore
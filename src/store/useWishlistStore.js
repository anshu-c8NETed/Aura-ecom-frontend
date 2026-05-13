import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWishlistStore = create(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (productId) => {
        const ids = get().ids
        set({ ids: ids.includes(productId) ? ids.filter(id => id !== productId) : [...ids, productId] })
      },

      has: (productId) => get().ids.includes(productId),
    }),
    { name: 'aura-wishlist' }
  )
)

export default useWishlistStore
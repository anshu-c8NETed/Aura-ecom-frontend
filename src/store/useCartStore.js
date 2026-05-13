import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
      toggleCart: () => set(s => ({ isOpen: !s.isOpen })),

      addItem: (product, variant, quantity = 1) => {
        const key = `${product._id}-${variant._id}`
        const items = get().items
        const existing = items.find(i => i.key === key)
        if (existing) {
          set({ items: items.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i) })
        } else {
          set({
            items: [...items, {
              key,
              productId: product._id,
              variantId: variant._id,
              name:      product.name,
              brand:     product.brand,
              image:     product.images?.[0]?.url || '',
              size:      variant.size,
              color:     variant.color,
              price:     variant.price ?? product.basePrice,
              quantity,
            }],
          })
        }
        set({ isOpen: true })
      },

      removeItem: (key) => set(s => ({ items: s.items.filter(i => i.key !== key) })),

      updateQty: (key, qty) => {
        if (qty < 1) { get().removeItem(key); return }
        set(s => ({ items: s.items.map(i => i.key === key ? { ...i, quantity: qty } : i) }))
      },

      clearCart: () => set({ items: [] }),

      // Computed
      get itemCount() { return get().items.reduce((s, i) => s + i.quantity, 0) },
      get subtotal()  { return get().items.reduce((s, i) => s + i.price * i.quantity, 0) },
    }),
    {
      name: 'aura-cart',
      partialize: s => ({ items: s.items }),
    }
  )
)

export default useCartStore
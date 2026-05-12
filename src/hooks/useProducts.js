import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

// ── Products list (with optional filters) ──────────────────
export const useProducts = (params = {}) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get('/products', { params }).then(r => r.data),
    placeholderData: prev => prev,
  })

// ── Single product by slug ──────────────────────────────────
export const useProduct = (slug) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/slug/${slug}`).then(r => r.data),
    enabled: !!slug,
  })

// ── Featured products ───────────────────────────────────────
export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products', { params: { isFeatured: true, limit: 4 } }).then(r => r.data),
  })

// ── New arrivals ────────────────────────────────────────────
export const useNewArrivals = () =>
  useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => api.get('/products', { params: { isNewArrival: true, limit: 4 } }).then(r => r.data),
  })

// ── Categories list ─────────────────────────────────────────
export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  })
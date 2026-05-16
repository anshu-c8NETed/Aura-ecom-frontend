import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

// ── Categories list ─────────────────────────────────
// Fetches active categories from the API, falls back gracefully.
export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  })

export default useCategories

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Refresh token interceptor
let isRefreshing = false
let refreshQueue = []

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then(() => api(original)).catch(e => Promise.reject(e))
      }
      original._retry = true
      isRefreshing = true
      try {
        await axios.post('/api/auth/refresh-token', {}, { withCredentials: true })
        refreshQueue.forEach(p => p.resolve())
        refreshQueue = []
        return api(original)
      } catch (refreshErr) {
        refreshQueue.forEach(p => p.reject(refreshErr))
        refreshQueue = []
        // Clear auth state without importing store (avoid circular deps)
        window.dispatchEvent(new Event('auth:logout'))
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(err)
  }
)

export default api
// Central API client for the Durrani Harvest backend.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const TOKEN_KEY = 'dh_admin_token'

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || null
  } catch {
    return null
  }
}

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }

  const isJson = (res.headers.get('content-type') || '').includes('application/json')
  const data = isJson ? await res.json() : null

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  base: API_BASE,

  // ---- auth ----
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/api/auth/me', { auth: true }),
  changePassword: (currentPassword, newPassword) =>
    request('/api/auth/change-password', {
      method: 'POST',
      auth: true,
      body: { currentPassword, newPassword },
    }),

  // ---- customer auth ----
  customerRegister: (firstName, lastName, email, password) =>
    request('/api/customer/register', { method: 'POST', body: { firstName, lastName, email, password } }),
  customerLogin: (email, password) =>
    request('/api/customer/login', { method: 'POST', body: { email, password } }),

  // ---- products ----
  listProducts: () => request('/api/products'),
  createProduct: (payload) =>
    request('/api/products', { method: 'POST', auth: true, body: payload }),
  updateProduct: (id, payload) =>
    request(`/api/products/${id}`, { method: 'PUT', auth: true, body: payload }),
  deleteProduct: (id) =>
    request(`/api/products/${id}`, { method: 'DELETE', auth: true }),

  // ---- orders ----
  createOrder: (payload) => request('/api/orders', { method: 'POST', body: payload }),
  listOrders: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v),
    ).toString()
    return request(`/api/orders${qs ? `?${qs}` : ''}`, { auth: true })
  },
  getOrder: (id) => request(`/api/orders/${id}`, { auth: true }),
  updateOrderStatus: (id, status) =>
    request(`/api/orders/${id}`, { method: 'PATCH', auth: true, body: { status } }),

  // ---- dashboard ----
  stats: () => request('/api/stats', { auth: true }),
}

export default api

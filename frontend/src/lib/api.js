// Central API client for the Purevale Honey backend (Express + Prisma).
// Auth is cookie-based (httpOnly) — every request sends credentials, and a 401
// triggers one silent refresh-token attempt before giving up.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

let refreshPromise = null

async function request(path, { method = 'GET', body, headers } = {}, _retried = false) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'include',
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }

  // One transparent refresh + retry on an expired access token.
  if (res.status === 401 && !_retried && !path.startsWith('/api/auth/')) {
    try {
      refreshPromise =
        refreshPromise ||
        fetch(`${API_BASE}/api/auth/refresh-token`, { method: 'POST', credentials: 'include' })
      const refreshRes = await refreshPromise
      refreshPromise = null
      if (refreshRes.ok) return request(path, { method, body, headers }, true)
    } catch {
      refreshPromise = null
    }
  }

  const isJson = (res.headers.get('content-type') || '').includes('application/json')
  const payload = isJson ? await res.json() : null

  if (!res.ok) {
    const err = new Error(payload?.message || `Request failed (${res.status})`)
    err.status = res.status
    err.errors = payload?.errors
    throw err
  }

  // Success envelope: { success, message, data }
  return payload && 'data' in payload ? payload.data : payload
}

const qs = (params = {}) => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  return entries.length ? `?${new URLSearchParams(entries)}` : ''
}

// Turn an API error into a human-readable string, expanding field-level
// validation details (backend sends { errors: { body: ["...", "..."] } }).
export const errorMessage = (err) => {
  const parts = []
  const walk = (v) => {
    if (!v) return
    if (typeof v === 'string') parts.push(v)
    else if (Array.isArray(v)) v.forEach(walk)
    else if (typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(err?.errors)
  return parts.length ? parts.join('. ') : err?.message || 'Something went wrong'
}

export const api = {
  base: API_BASE,

  // ---- auth (shared by customers + admins) ----
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  me: () => request('/api/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    request('/api/auth/password', { method: 'PATCH', body: { currentPassword, newPassword } }),

  // ---- products ----
  listProducts: (params) => request(`/api/products${qs(params)}`),
  getProduct: (id) => request(`/api/products/${id}`),
  createProduct: (payload) => request('/api/products', { method: 'POST', body: payload }),
  updateProduct: (id, payload) => request(`/api/products/${id}`, { method: 'PATCH', body: payload }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),

  // ---- categories ----
  listCategories: () => request('/api/categories'),
  createCategory: (name) => request('/api/categories', { method: 'POST', body: { name } }),
  updateCategory: (id, name) => request(`/api/categories/${id}`, { method: 'PATCH', body: { name } }),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: 'DELETE' }),

  // ---- cart (auth) ----
  getCart: () => request('/api/cart'),
  addCartItem: (payload) => request('/api/cart/items', { method: 'POST', body: payload }),
  updateCartItem: (itemId, quantity) =>
    request(`/api/cart/items/${itemId}`, { method: 'PATCH', body: { quantity } }),
  removeCartItem: (itemId) => request(`/api/cart/items/${itemId}`, { method: 'DELETE' }),
  clearCart: () => request('/api/cart', { method: 'DELETE' }),

  // ---- orders ----
  createOrder: (payload) => request('/api/orders', { method: 'POST', body: payload }),
  listMyOrders: (params) => request(`/api/orders${qs(params)}`),
  getMyOrder: (id) => request(`/api/orders/${id}`),
  adminListOrders: (params) => request(`/api/orders/admin/all${qs(params)}`),
  updateOrderStatus: (id, status) =>
    request(`/api/orders/${id}/status`, { method: 'PATCH', body: { status } }),

  // ---- reviews ----
  listProductReviews: (productId) => request(`/api/reviews/product/${productId}`),
  upsertReview: (productId, payload) =>
    request(`/api/reviews/product/${productId}`, { method: 'PUT', body: payload }),
  deleteReview: (id) => request(`/api/reviews/${id}`, { method: 'DELETE' }),

  // ---- admin ----
  adminStats: () => request('/api/admin/stats'),
  adminListUsers: (params) => request(`/api/admin/users${qs(params)}`),
  adminGetUser: (id) => request(`/api/admin/users/${id}`),
  adminUpdateUserRole: (id, role) =>
    request(`/api/admin/users/${id}/role`, { method: 'PATCH', body: { role } }),
  adminDeleteUser: (id) => request(`/api/admin/users/${id}`, { method: 'DELETE' }),

  // ---- site content ----
  getSiteSettings: () => request('/api/settings').then((d) => d.settings),
  updateSiteSettings: (payload) =>
    request('/api/settings', { method: 'PUT', body: payload }).then((d) => d.settings),

  // ---- submissions ----
  submitContactSubmission: (payload) =>
    request('/api/submissions/contact', { method: 'POST', body: payload }),
  submitExportInquiry: (payload) =>
    request('/api/submissions/export', { method: 'POST', body: payload }),
  listContactSubmissions: () =>
    request('/api/submissions?type=contact').then((d) => d.submissions),
  listExportInquiries: () =>
    request('/api/submissions?type=export').then((d) => d.submissions),

  // ---- uploads ----
  uploadImage: (dataUri) => request('/api/uploads', { method: 'POST', body: { file: dataUri } }),
  uploadSiteAsset: (dataUri) => request('/api/uploads', { method: 'POST', body: { file: dataUri } }),
}

export default api

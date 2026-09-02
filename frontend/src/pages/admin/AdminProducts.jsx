import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice } from '../../data/products'
import { useShop } from '../../components/shop/ShopContext'
import './admin.css'

const COLLECTIONS = [
  { key: 'honey', label: 'Pure Honey' },
  { key: 'dates', label: 'Dates' },
  { key: 'jaggery', label: 'Jaggery (Gur)' },
  { key: 'shilajit', label: 'Shilajit' },
  { key: 'cosmetics', label: 'Cosmetics' },
]

const EMPTY = {
  title: '',
  collection: 'honey',
  image: '',
  priceMin: '',
  priceMax: '',
  variants: '',
  rating: '',
  reviews: '',
  available: true,
}

const toForm = (p) => ({
  title: p.title || '',
  collection: p.collection || 'honey',
  image: p.image || '',
  priceMin: p.priceMin ?? '',
  priceMax: p.priceMax ?? '',
  variants: Array.isArray(p.variants) ? p.variants.join(', ') : '',
  rating: p.rating ?? '',
  reviews: p.reviews ?? '',
  available: p.available !== false,
})

const AdminProducts = () => {
  const { refreshProducts } = useShop()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .listProducts()
      .then((rows) => setProducts(rows))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditingId(p.id)
    setForm(toForm(p))
    setError('')
    setModalOpen(true)
  }

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || form.priceMin === '') {
      setError('Title and minimum price are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editingId) await api.updateProduct(editingId, form)
      else await api.createProduct(form)
      setModalOpen(false)
      load()
      refreshProducts?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`Delete “${p.title}”? This cannot be undone.`)) return
    try {
      await api.deleteProduct(p.id)
      load()
      refreshProducts?.()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-page-inner">
      <div className="admin-page-head">
        <h1 className="admin-h1">Products</h1>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} strokeWidth={2.2} /> New product
        </button>
      </div>

      <p className="admin-hint">
        Products added here are saved on the server and appear on the storefront home page and their
        collection page.
      </p>

      {error && !modalOpen && <div className="admin-alert">{error}</div>}

      <div className="admin-panel">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : products.length === 0 ? (
          <p className="admin-empty">No products yet. Click “New product” to add one.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Collection</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="admin-ta-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-cell-product">
                      <img src={p.image} alt={p.title} />
                      <span>{p.title}</span>
                    </div>
                  </td>
                  <td>{COLLECTIONS.find((c) => c.key === p.collection)?.label || p.collection}</td>
                  <td>
                    {formatPrice(p.priceMin)}
                    {p.priceMax ? ` – ${formatPrice(p.priceMax)}` : ''}
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge-${p.available !== false ? 'delivered' : 'cancelled'}`}>
                      {p.available !== false ? 'In stock' : 'Sold out'}
                    </span>
                  </td>
                  <td className="admin-ta-right">
                    <button type="button" className="admin-icon-btn" onClick={() => openEdit(p)} aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button type="button" className="admin-icon-btn admin-icon-danger" onClick={() => remove(p)} aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h2>{editingId ? 'Edit product' : 'New product'}</h2>
              <button type="button" className="admin-icon-btn" onClick={() => setModalOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {error && <div className="admin-alert">{error}</div>}

            <form className="admin-form-grid" onSubmit={submit}>
              <label className="admin-input-group admin-col-full">
                <span>Title *</span>
                <input type="text" value={form.title} onChange={update('title')} required placeholder="Wildflower Raw Honey" />
              </label>

              <label className="admin-input-group">
                <span>Collection *</span>
                <select value={form.collection} onChange={update('collection')}>
                  {COLLECTIONS.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </label>

              <label className="admin-input-group">
                <span>Image URL</span>
                <input type="text" value={form.image} onChange={update('image')} placeholder="/honey-jar.jpg or https://…" />
              </label>

              <label className="admin-input-group">
                <span>Price min (Rs.) *</span>
                <input type="number" min="0" value={form.priceMin} onChange={update('priceMin')} required placeholder="850" />
              </label>

              <label className="admin-input-group">
                <span>Price max (Rs.)</span>
                <input type="number" min="0" value={form.priceMax} onChange={update('priceMax')} placeholder="optional (range)" />
              </label>

              <label className="admin-input-group admin-col-full">
                <span>Sizes / variants (comma separated)</span>
                <input type="text" value={form.variants} onChange={update('variants')} placeholder="250g, 500g, 1kg" />
              </label>

              <label className="admin-input-group">
                <span>Rating (0–5)</span>
                <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={update('rating')} placeholder="0" />
              </label>

              <label className="admin-input-group">
                <span>Review count</span>
                <input type="number" min="0" value={form.reviews} onChange={update('reviews')} placeholder="0" />
              </label>

              <label className="admin-checkbox admin-col-full">
                <input type="checkbox" checked={form.available} onChange={update('available')} />
                <span>In stock</span>
              </label>

              <div className="admin-col-full admin-modal-actions">
                <button type="button" className="admin-btn" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts

import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X, ImagePlus } from 'lucide-react'
import api, { errorMessage } from '../../lib/api'
import { formatPrice } from '../../data/products'
import { useShop } from '../../components/shop/ShopContext'
import './admin.css'

const EMPTY = {
  name: '',
  price: '',
  discountPercent: '0',
  rating: '0',
  reviewCount: '0',
  stock: '0',
  categoryId: '',
  image: '',
  variants: '',
}

const toForm = (p) => ({
  name: p.name || '',
  price: p.price ?? '',
  discountPercent: p.discountPercent ?? 0,
  rating: p.rating ?? 0,
  reviewCount: p.reviewCount ?? 0,
  stock: p.stock ?? 0,
  categoryId: p.categoryId || p.category?.id || '',
  image: Array.isArray(p.images) ? p.images[0] || '' : '',
  variants: Array.isArray(p.variants)
    ? p.variants.map((v) => (typeof v === 'string' ? v : v.label)).join(', ')
    : '',
})

const readImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    const image = new Image()
    image.onload = () => {
      const maxSize = 1200
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    image.onerror = () => reject(new Error('That image could not be read'))
    image.src = reader.result
  }
  reader.onerror = () => reject(new Error('That image could not be read'))
  reader.readAsDataURL(file)
})

const AdminProducts = () => {
  const { refreshProducts } = useShop()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [newCat, setNewCat] = useState('')
  const [addingCat, setAddingCat] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([api.listProducts({ limit: 200 }), api.listCategories()])
      .then(([p, c]) => {
        setProducts(p.items || [])
        setCategories(c.categories || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const catName = (id) => categories.find((c) => c.id === id)?.name || '—'

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...EMPTY, categoryId: categories[0]?.id || '' })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditingId(p.id)
    setForm(toForm(p))
    setError('')
    setModalOpen(true)
  }

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const addCategory = async () => {
    const name = newCat.trim()
    if (!name) return
    setAddingCat(true)
    setError('')
    try {
      const { category } = await api.createCategory(name)
      const next = [...categories, category].sort((a, b) => a.name.localeCompare(b.name))
      setCategories(next)
      setForm((f) => ({ ...f, categoryId: category.id }))
      setNewCat('')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setAddingCat(false)
    }
  }

  const chooseImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file')
      return
    }
    try {
      const dataUrl = await readImage(file)
      setForm((f) => ({ ...f, image: dataUrl }))
      setError('')
    } catch (err) {
      setError(err.message)
    }
    e.target.value = ''
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || form.price === '') {
      setError('Name and price are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      let imageUrl = form.image
      if (imageUrl.startsWith('data:image/')) {
        const uploaded = await api.uploadImage(imageUrl)
        imageUrl = uploaded.url
      }
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        discountPercent: Math.max(0, Math.min(95, Math.round(Number(form.discountPercent) || 0))),
        rating: Math.max(0, Math.min(5, Number(form.rating) || 0)),
        reviewCount: Math.max(0, Math.round(Number(form.reviewCount) || 0)),
        stock: Number(form.stock) || 0,
        categoryId: form.categoryId || null,
        images: imageUrl ? [imageUrl] : [],
        variants: form.variants
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((label) => ({ label })),
      }
      if (editingId) await api.updateProduct(editingId, payload)
      else await api.createProduct(payload)
      setModalOpen(false)
      load()
      refreshProducts?.()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return
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
        Products are stored on the server and appear on the storefront home page and their category
        page. {categories.length === 0 && 'No categories exist yet — open /admin/categories to add one.'}
      </p>

      {error && !modalOpen && <div className="admin-alert">{error}</div>}

      <div className="admin-panel">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : products.length === 0 ? (
          <p className="admin-empty">No products yet. Click "New product" to add one.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
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
                      <img src={p.images?.[0] || '/honey-jar.jpg'} alt={p.name} />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category?.name || catName(p.categoryId)}</td>
                  <td>
                    {formatPrice(p.price)}
                    {p.discountPercent > 0 && (
                      <span className="admin-badge admin-badge-paid" style={{ marginLeft: 6 }}>
                        -{p.discountPercent}%
                      </span>
                    )}
                    {p.reviewCount > 0 && (
                      <div style={{ fontSize: '0.72rem', color: '#888' }}>
                        ★ {p.rating} · {p.reviewCount} reviews
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge-${p.stock > 0 ? 'delivered' : 'cancelled'}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Sold out'}
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
                <span>Name *</span>
                <input type="text" value={form.name} onChange={update('name')} required placeholder="Wildflower Raw Honey" />
              </label>

              <div className="admin-input-group admin-col-full">
                <span>Category</span>
                <select value={form.categoryId} onChange={update('categoryId')}>
                  <option value="">— none —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="admin-inline-add">
                  <input
                    type="text"
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    placeholder="…or type a new category name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); addCategory() }
                    }}
                  />
                  <button type="button" className="admin-btn" onClick={addCategory} disabled={addingCat || !newCat.trim()}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              <label className="admin-input-group admin-image-picker">
                <span>Product image</span>
                <span className="admin-file-btn"><ImagePlus size={16} /> Choose from gallery</span>
                <input type="file" accept="image/*" onChange={chooseImage} />
                {form.image && <img className="admin-image-preview" src={form.image} alt="Selected product" />}
              </label>

              <label className="admin-input-group">
                <span>Price (Rs.) *</span>
                <input type="number" min="0" step="0.01" value={form.price} onChange={update('price')} required placeholder="850" />
              </label>

              <label className="admin-input-group">
                <span>Discount %</span>
                <input type="number" min="0" max="95" step="1" value={form.discountPercent} onChange={update('discountPercent')} placeholder="0" />
              </label>

              <label className="admin-input-group">
                <span>Rating (0–5)</span>
                <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={update('rating')} placeholder="0" />
              </label>

              <label className="admin-input-group">
                <span>Review count</span>
                <input type="number" min="0" step="1" value={form.reviewCount} onChange={update('reviewCount')} placeholder="0" />
              </label>

              <label className="admin-input-group">
                <span>Stock</span>
                <input type="number" min="0" value={form.stock} onChange={update('stock')} placeholder="0" />
              </label>

              <label className="admin-input-group admin-col-full">
                <span>Sizes / variants (comma separated)</span>
                <input type="text" value={form.variants} onChange={update('variants')} placeholder="250g, 500g, 1kg" />
              </label>

              <div className="admin-col-full admin-modal-actions">
                <button type="button" className="admin-btn" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? (form.image.startsWith('data:image/') ? 'Uploading…' : 'Saving…') : editingId ? 'Save changes' : 'Create product'}
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

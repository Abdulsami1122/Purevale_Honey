import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, PackagePlus } from 'lucide-react'
import { useShop, COLLECTION_KEYS } from '../components/shop/ShopContext'
import { formatPrice } from '../data/products'
import './AdminPage.css'

const EMPTY_FORM = {
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

const COLLECTION_LABELS = {
  honey: 'Pure Honey',
  dates: 'Dates',
  jaggery: 'Jaggery (Gur)',
  shilajit: 'Shilajit',
  cosmetics: 'Cosmetics',
}

const AdminPage = () => {
  const { customProducts, addCustomProduct, removeCustomProduct } = useShop()
  const [form, setForm] = useState(EMPTY_FORM)
  const [savedName, setSavedName] = useState('')

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.priceMin) return
    const product = addCustomProduct(form)
    setSavedName(product.title)
    setForm(EMPTY_FORM)
    window.setTimeout(() => setSavedName(''), 4000)
  }

  return (
    <div className="admin-page">
      <div className="admin-inner">
        <header className="admin-head">
          <h1>
            <PackagePlus size={26} strokeWidth={1.8} /> Add Product
          </h1>
          <p>
            New items appear instantly on the <Link to="/">home page</Link> and their collection page.
            Products are saved in <strong>this browser only</strong> (no server).
          </p>
        </header>

        {savedName && (
          <div className="admin-toast">“{savedName}” added to the store.</div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="admin-field admin-field-full">
            <span>Product title *</span>
            <input type="text" value={form.title} onChange={update('title')} required placeholder="e.g. Wildflower Raw Honey" />
          </label>

          <label className="admin-field">
            <span>Collection *</span>
            <select value={form.collection} onChange={update('collection')}>
              {COLLECTION_KEYS.map((key) => (
                <option key={key} value={key}>
                  {COLLECTION_LABELS[key] || key}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Image URL</span>
            <input type="text" value={form.image} onChange={update('image')} placeholder="/honey-jar.jpg or https://..." />
          </label>

          <label className="admin-field">
            <span>Price min (Rs.) *</span>
            <input type="number" min="0" value={form.priceMin} onChange={update('priceMin')} required placeholder="850" />
          </label>

          <label className="admin-field">
            <span>Price max (Rs.)</span>
            <input type="number" min="0" value={form.priceMax} onChange={update('priceMax')} placeholder="optional — for a range" />
          </label>

          <label className="admin-field admin-field-full">
            <span>Sizes / variants (comma separated)</span>
            <input type="text" value={form.variants} onChange={update('variants')} placeholder="250g, 500g, 1kg" />
          </label>

          <label className="admin-field">
            <span>Rating (0–5)</span>
            <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={update('rating')} placeholder="0" />
          </label>

          <label className="admin-field">
            <span>Review count</span>
            <input type="number" min="0" value={form.reviews} onChange={update('reviews')} placeholder="0" />
          </label>

          <label className="admin-checkbox admin-field-full">
            <input type="checkbox" checked={form.available} onChange={update('available')} />
            <span>In stock</span>
          </label>

          <div className="admin-field-full">
            <button type="submit" className="admin-submit">Add product</button>
          </div>
        </form>

        <section className="admin-list">
          <h2>Added products ({customProducts.length})</h2>
          {customProducts.length === 0 ? (
            <p className="admin-list-empty">Nothing added yet.</p>
          ) : (
            <ul>
              {customProducts.map((p) => (
                <li key={p.id}>
                  <img src={p.image} alt={p.title} />
                  <div className="admin-list-info">
                    <strong>{p.title}</strong>
                    <span>
                      {COLLECTION_LABELS[p.collection] || p.collection} · {formatPrice(p.priceMin)}
                      {p.priceMax ? ` – ${formatPrice(p.priceMax)}` : ''}
                    </span>
                  </div>
                  <button type="button" onClick={() => removeCustomProduct(p.id)} aria-label={`Remove ${p.title}`}>
                    <Trash2 size={16} strokeWidth={1.7} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default AdminPage

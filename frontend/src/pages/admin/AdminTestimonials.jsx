import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X, ImagePlus, Star } from 'lucide-react'
import api, { errorMessage } from '../../lib/api'
import './admin.css'

const EMPTY = { name: '', image: '', rating: 5, message: '', sortOrder: 0 }

const toForm = (t) => ({
  name: t.name || '',
  image: t.image || '',
  rating: t.rating ?? 5,
  message: t.message || '',
  sortOrder: t.sortOrder ?? 0,
})

const readImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const maxSize = 500
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => reject(new Error('That image could not be read'))
    img.src = reader.result
  }
  reader.onerror = () => reject(new Error('That image could not be read'))
  reader.readAsDataURL(file)
})

const StarPicker = ({ value, onChange }) => (
  <div className="admin-star-picker">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" className="admin-star-btn" onClick={() => onChange(n)} aria-label={`${n} star`}>
        <Star size={22} fill={n <= value ? 'currentColor' : 'none'} strokeWidth={1.6} />
      </button>
    ))}
  </div>
)

const AdminTestimonials = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .listTestimonials()
      .then((d) => setRows(d.testimonials || []))
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

  const openEdit = (t) => {
    setEditingId(t.id)
    setForm(toForm(t))
    setError('')
    setModalOpen(true)
  }

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

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
    if (!form.name.trim() || form.message.trim().length < 10) {
      setError('Name and a message of at least 10 characters are required')
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
        image: imageUrl || null,
        rating: Number(form.rating) || 5,
        message: form.message.trim(),
        sortOrder: Number(form.sortOrder) || 0,
      }
      if (editingId) await api.updateTestimonial(editingId, payload)
      else await api.createTestimonial(payload)
      setModalOpen(false)
      load()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (t) => {
    if (!window.confirm(`Delete the testimonial from "${t.name}"?`)) return
    try {
      await api.deleteTestimonial(t.id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-page-inner">
      <div className="admin-page-head">
        <h1 className="admin-h1">Testimonials</h1>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} strokeWidth={2.2} /> New testimonial
        </button>
      </div>

      <p className="admin-hint">
        Shown as a carousel on the storefront home page. Lower "Order" numbers appear first.
      </p>

      {error && !modalOpen && <div className="admin-alert">{error}</div>}

      <div className="admin-panel">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="admin-empty">No testimonials yet. Click "New testimonial" to add one.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Order</th>
                <th className="admin-ta-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="admin-cell-product">
                      {t.image ? (
                        <img src={t.image} alt={t.name} />
                      ) : (
                        <span className="admin-avatar-fallback">{t.name?.[0]?.toUpperCase() || '?'}</span>
                      )}
                      <span>{t.name}</span>
                    </div>
                  </td>
                  <td>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</td>
                  <td className="admin-submission-message">{t.message}</td>
                  <td>{t.sortOrder}</td>
                  <td className="admin-ta-right">
                    <button type="button" className="admin-icon-btn" onClick={() => openEdit(t)} aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button type="button" className="admin-icon-btn admin-icon-danger" onClick={() => remove(t)} aria-label="Delete">
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
              <h2>{editingId ? 'Edit testimonial' : 'New testimonial'}</h2>
              <button type="button" className="admin-icon-btn" onClick={() => setModalOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {error && <div className="admin-alert">{error}</div>}

            <form className="admin-form-grid" onSubmit={submit}>
              <label className="admin-input-group admin-col-full">
                <span>Customer name *</span>
                <input type="text" value={form.name} onChange={update('name')} required placeholder="Ayesha Khan" />
              </label>

              <label className="admin-input-group admin-image-picker admin-col-full">
                <span>Customer photo (optional)</span>
                <span className="admin-file-btn"><ImagePlus size={16} /> Choose photo</span>
                <input type="file" accept="image/*" onChange={chooseImage} />
                {form.image && <img className="admin-image-preview admin-image-preview-round" src={form.image} alt="Selected" />}
              </label>

              <div className="admin-input-group">
                <span>Rating</span>
                <StarPicker value={Number(form.rating)} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
              </div>

              <label className="admin-input-group">
                <span>Display order</span>
                <input type="number" value={form.sortOrder} onChange={update('sortOrder')} placeholder="0" />
              </label>

              <label className="admin-input-group admin-col-full">
                <span>Testimonial *</span>
                <textarea
                  rows="4"
                  value={form.message}
                  onChange={update('message')}
                  required
                  minLength={10}
                  placeholder="What did the customer say about their experience?"
                />
              </label>

              <div className="admin-col-full admin-modal-actions">
                <button type="button" className="admin-btn" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? (form.image.startsWith('data:image/') ? 'Uploading…' : 'Saving…') : editingId ? 'Save changes' : 'Create testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTestimonials

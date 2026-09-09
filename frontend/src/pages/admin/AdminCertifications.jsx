import React, { useEffect, useRef, useState } from 'react'
import { ImagePlus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import api, { errorMessage } from '../../lib/api'
import { useShop } from '../../components/shop/ShopContext'
import './admin.css'

// Downscale to a JPEG data URL before upload (same approach as the other editors)
const readImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const maxSize = 1400
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

const AdminCertifications = () => {
  const { refreshSiteSettings } = useShop()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const fileInput = useRef(null)

  useEffect(() => {
    api
      .getSiteSettings()
      .then((s) => setItems(Array.isArray(s.certifications) ? s.certifications : []))
      .catch((e) => setMsg({ type: 'error', text: e.message }))
      .finally(() => setLoading(false))
  }, [])

  // Persist a new list to site settings and refresh the storefront.
  const persist = async (next) => {
    setItems(next)
    setMsg(null)
    try {
      await api.updateSiteSettings({ certifications: next })
      await refreshSiteSettings?.()
      setMsg({ type: 'ok', text: 'Saved. The home page is updated.' })
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) })
    }
  }

  const addFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    const images = files.filter((f) => f.type.startsWith('image/'))
    if (images.length === 0) return
    setBusy(true)
    setMsg(null)
    try {
      const urls = []
      for (const file of images) {
        const dataUrl = await readImage(file)
        const { url } = await api.uploadSiteAsset(dataUrl)
        urls.push(url)
      }
      await persist([...items, ...urls])
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  const removeAt = (i) => persist(items.filter((_, idx) => idx !== i))

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    persist(next)
  }

  return (
    <div className="admin-page-inner">
      <div className="admin-page-head">
        <h1 className="admin-h1">Certifications</h1>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => fileInput.current?.click()}
          disabled={busy}
        >
          <ImagePlus size={16} strokeWidth={2.2} /> {busy ? 'Uploading…' : 'Add certificates'}
        </button>
        <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={addFiles} />
      </div>

      <p className="admin-hint">
        Upload certificate images — they appear in the <strong>Certifications</strong> section on the
        home page, just below “Uncompromising Quality”. Use the arrows to reorder.
      </p>

      {msg && <div className={msg.type === 'ok' ? 'admin-success' : 'admin-alert'}>{msg.text}</div>}

      <div className="admin-panel">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : items.length === 0 ? (
          <p className="admin-empty">No certificates yet. Click “Add certificates” to upload.</p>
        ) : (
          <div className="admin-cert-grid">
            {items.map((src, i) => (
              <div className="admin-cert-card" key={`${src}-${i}`}>
                <img src={src} alt={`Certificate ${i + 1}`} />
                <div className="admin-cert-actions">
                  <button type="button" className="admin-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left">
                    <ArrowLeft size={15} />
                  </button>
                  <button type="button" className="admin-icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move right">
                    <ArrowRight size={15} />
                  </button>
                  <button type="button" className="admin-icon-btn admin-icon-danger" onClick={() => removeAt(i)} aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCertifications

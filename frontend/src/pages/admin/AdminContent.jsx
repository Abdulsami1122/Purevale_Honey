import React, { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, ImagePlus, Film, ArrowUp, ArrowDown } from 'lucide-react'
import api from '../../lib/api'
import { useShop } from '../../components/shop/ShopContext'
import { DEFAULT_SITE_SETTINGS } from '../../lib/siteSettings'
import './admin.css'

const ICON_OPTIONS = ['Gem', 'Gift', 'Cookie', 'Mountain', 'Sparkles', 'ShoppingBag', 'Home', 'Tag']
const TONE_OPTIONS = ['green', 'cyan', 'amber', 'red']

// Downscale an image file to a JPEG data URL (same approach as the product editor)
const readImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const maxSize = 1600
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

const readRaw = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('That file could not be read'))
  reader.readAsDataURL(file)
})

const AdminContent = () => {
  const { refreshSiteSettings } = useShop()
  const [form, setForm] = useState(DEFAULT_SITE_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState(null)
  const storyInput = useRef(null)
  const videoInput = useRef(null)

  useEffect(() => {
    api
      .getSiteSettings()
      .then((data) => setForm({ ...DEFAULT_SITE_SETTINGS, ...data }))
      .catch((e) => setMsg({ type: 'error', text: e.message }))
      .finally(() => setLoading(false))
  }, [])

  const setSection = (section, patch) =>
    setForm((f) => ({ ...f, [section]: { ...f[section], ...patch } }))

  // ---- announcements ----
  const setAnnouncement = (i, value) =>
    setForm((f) => ({ ...f, announcements: f.announcements.map((a, idx) => (idx === i ? value : a)) }))
  const addAnnouncement = () =>
    setForm((f) => ({ ...f, announcements: [...f.announcements, ''] }))
  const removeAnnouncement = (i) =>
    setForm((f) => ({ ...f, announcements: f.announcements.filter((_, idx) => idx !== i) }))

  // ---- built-in categories: only an on/off switch (by href) ----
  const builtinDisabled = (href) => (form.disabledCategories || []).includes(href)
  const toggleBuiltin = (href) =>
    setForm((f) => {
      const set = new Set(f.disabledCategories || [])
      if (set.has(href)) set.delete(href)
      else set.add(href)
      return { ...f, disabledCategories: [...set] }
    })

  // ---- extra nav categories (built-ins stay untouched) ----
  const setCategory = (i, patch) =>
    setForm((f) => ({
      ...f,
      extraNavCategories: f.extraNavCategories.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    }))
  const addCategory = () =>
    setForm((f) => ({
      ...f,
      extraNavCategories: [
        ...f.extraNavCategories,
        { label: '', href: '/', icon: 'Tag', badge: '', badgeTone: 'green', enabled: true },
      ],
    }))
  const removeCategory = (i) =>
    setForm((f) => ({ ...f, extraNavCategories: f.extraNavCategories.filter((_, idx) => idx !== i) }))
  const moveCategory = (i, dir) =>
    setForm((f) => {
      const next = [...f.extraNavCategories]
      const j = i + dir
      if (j < 0 || j >= next.length) return f
      ;[next[i], next[j]] = [next[j], next[i]]
      return { ...f, extraNavCategories: next }
    })

  const uploadStory = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy('story')
    setMsg(null)
    try {
      const dataUrl = await readImage(file)
      const { url } = await api.uploadSiteAsset(dataUrl)
      setSection('story', { image: url })
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    } finally {
      setBusy('')
    }
  }

  const uploadVideo = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > 60 * 1024 * 1024) {
      setMsg({ type: 'error', text: 'Video is larger than 60 MB. Compress it or paste a hosted URL instead.' })
      return
    }
    setBusy('video')
    setMsg(null)
    try {
      const dataUrl = await readRaw(file)
      const { url } = await api.uploadSiteAsset(dataUrl)
      setSection('hero', { videoUrl: url })
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    } finally {
      setBusy('')
    }
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      const payload = {
        ...form,
        announcements: form.announcements.map((a) => a.trim()).filter(Boolean),
        extraNavCategories: form.extraNavCategories
          .map((c) => ({ ...c, label: c.label.trim(), href: c.href.trim() }))
          .filter((c) => c.label && c.href),
      }
      delete payload.navCategories
      const saved = await api.updateSiteSettings(payload)
      setForm({ ...DEFAULT_SITE_SETTINGS, ...saved })
      await refreshSiteSettings?.()
      setMsg({ type: 'ok', text: 'Saved. The storefront is updated.' })
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-page-inner">
        <h1 className="admin-h1">Site Content</h1>
        <p className="admin-empty">Loading…</p>
      </div>
    )
  }

  return (
    <div className="admin-page-inner">
      <h1 className="admin-h1">Site Content</h1>
      <p className="admin-hint">
        Everything here is live on the storefront — the top announcement bar, hero banner video,
        navigation categories, the “Our Story” image, and contact / social details.
      </p>

      {msg && <div className={msg.type === 'ok' ? 'admin-success' : 'admin-alert'}>{msg.text}</div>}

      <form onSubmit={save}>
        {/* Announcement bar */}
        <div className="admin-panel">
          <h2 className="admin-h2">Announcement bar</h2>
          <p className="admin-hint">Lines rotate every few seconds at the very top of every page.</p>
          {form.announcements.map((line, i) => (
            <div key={i} className="admin-repeat-row">
              <input
                type="text"
                value={line}
                onChange={(e) => setAnnouncement(i, e.target.value)}
                placeholder="Free delivery on orders over Rs. 5000"
              />
              <button type="button" className="admin-icon-btn admin-icon-danger" onClick={() => removeAnnouncement(i)} aria-label="Remove">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button type="button" className="admin-btn" onClick={addAnnouncement}>
            <Plus size={15} /> Add line
          </button>
        </div>

        {/* Hero banner */}
        <div className="admin-panel">
          <h2 className="admin-h2">Hero banner</h2>
          <div className="admin-form-grid">
            <label className="admin-input-group admin-col-full">
              <span>Background video URL</span>
              <input
                type="text"
                value={form.hero.videoUrl}
                onChange={(e) => setSection('hero', { videoUrl: e.target.value })}
                placeholder="https://res.cloudinary.com/…/banner.mp4"
              />
            </label>
            <div className="admin-col-full">
              <button type="button" className="admin-file-btn" onClick={() => videoInput.current?.click()} disabled={busy === 'video'}>
                <Film size={16} /> {busy === 'video' ? 'Uploading…' : 'Upload video file'}
              </button>
              <input ref={videoInput} type="file" accept="video/*" hidden onChange={uploadVideo} />
            </div>
            <label className="admin-input-group admin-col-full">
              <span>Small heading (above title)</span>
              <input type="text" value={form.hero.subtitle} onChange={(e) => setSection('hero', { subtitle: e.target.value })} />
            </label>
            <label className="admin-input-group admin-col-full">
              <span>Main title</span>
              <input type="text" value={form.hero.title} onChange={(e) => setSection('hero', { title: e.target.value })} />
            </label>
            <label className="admin-input-group admin-col-full">
              <span>Description</span>
              <input type="text" value={form.hero.description} onChange={(e) => setSection('hero', { description: e.target.value })} />
            </label>
          </div>
        </div>

        {/* Navigation categories */}
        <div className="admin-panel">
          <h2 className="admin-h2">Navigation categories</h2>
          <p className="admin-hint">
            The built-in categories below always stay in the header. Anything you add here is placed
            <strong> after them</strong>, in order.
          </p>

          <ul className="admin-builtin-list">
            {DEFAULT_SITE_SETTINGS.navCategories.map((c) => (
              <li key={c.href} className={builtinDisabled(c.href) ? 'is-off' : ''}>
                <span>{c.label}</span>
                <label className="admin-toggle">
                  <input
                    type="checkbox"
                    checked={!builtinDisabled(c.href)}
                    onChange={() => toggleBuiltin(c.href)}
                  />
                  <span>{builtinDisabled(c.href) ? 'Hidden' : 'Shown'}</span>
                </label>
              </li>
            ))}
          </ul>

          {form.extraNavCategories.length > 0 && (
            <p className="admin-hint" style={{ marginTop: '1rem' }}>Your added categories</p>
          )}
          {form.extraNavCategories.map((c, i) => (
            <div key={i} className="admin-cat-row">
              <div className="admin-form-grid">
                <label className="admin-input-group">
                  <span>Label</span>
                  <input type="text" value={c.label} onChange={(e) => setCategory(i, { label: e.target.value })} placeholder="Pure Honey" />
                </label>
                <label className="admin-input-group">
                  <span>Link</span>
                  <input type="text" value={c.href} onChange={(e) => setCategory(i, { href: e.target.value })} placeholder="/honey" />
                </label>
                <label className="admin-input-group">
                  <span>Icon</span>
                  <select value={c.icon || 'Tag'} onChange={(e) => setCategory(i, { icon: e.target.value })}>
                    {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
                <label className="admin-input-group">
                  <span>Badge (optional)</span>
                  <input type="text" value={c.badge || ''} onChange={(e) => setCategory(i, { badge: e.target.value })} placeholder="new" />
                </label>
                <label className="admin-input-group">
                  <span>Badge colour</span>
                  <select value={c.badgeTone || 'green'} onChange={(e) => setCategory(i, { badgeTone: e.target.value })}>
                    {TONE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
                <label className="admin-checkbox admin-col-full" style={{ marginBottom: 0 }}>
                  <input
                    type="checkbox"
                    checked={c.enabled !== false}
                    onChange={(e) => setCategory(i, { enabled: e.target.checked })}
                  />
                  <span>Shown in navigation</span>
                </label>
              </div>
              <div className="admin-cat-row-actions">
                <button type="button" className="admin-icon-btn" onClick={() => moveCategory(i, -1)} aria-label="Move up"><ArrowUp size={15} /></button>
                <button type="button" className="admin-icon-btn" onClick={() => moveCategory(i, 1)} aria-label="Move down"><ArrowDown size={15} /></button>
                <button type="button" className="admin-icon-btn admin-icon-danger" onClick={() => removeCategory(i)} aria-label="Remove"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          <button type="button" className="admin-btn" onClick={addCategory}>
            <Plus size={15} /> Add category
          </button>
        </div>

        {/* Our Story image */}
        <div className="admin-panel">
          <h2 className="admin-h2">“Our Story” image</h2>
          <div className="admin-form-grid">
            <label className="admin-input-group admin-col-full">
              <span>Image URL</span>
              <input type="text" value={form.story.image} onChange={(e) => setSection('story', { image: e.target.value })} />
            </label>
            <div className="admin-col-full">
              <button type="button" className="admin-file-btn" onClick={() => storyInput.current?.click()} disabled={busy === 'story'}>
                <ImagePlus size={16} /> {busy === 'story' ? 'Uploading…' : 'Upload image'}
              </button>
              <input ref={storyInput} type="file" accept="image/*" hidden onChange={uploadStory} />
            </div>
            {form.story.image && <img className="admin-image-preview" src={form.story.image} alt="Our Story" />}
          </div>
        </div>

        {/* Contact details */}
        <div className="admin-panel">
          <h2 className="admin-h2">Contact details</h2>
          <div className="admin-form-grid">
            <label className="admin-input-group">
              <span>Phone (display)</span>
              <input type="text" value={form.contact.phone} onChange={(e) => setSection('contact', { phone: e.target.value })} />
            </label>
            <label className="admin-input-group">
              <span>WhatsApp number</span>
              <input type="text" value={form.contact.whatsapp} onChange={(e) => setSection('contact', { whatsapp: e.target.value })} placeholder="923339300672" />
            </label>
            <label className="admin-input-group">
              <span>Email</span>
              <input type="email" value={form.contact.email} onChange={(e) => setSection('contact', { email: e.target.value })} />
            </label>
            <label className="admin-input-group admin-col-full">
              <span>Address</span>
              <input type="text" value={form.contact.address} onChange={(e) => setSection('contact', { address: e.target.value })} />
            </label>
          </div>
        </div>

        {/* Social links */}
        <div className="admin-panel">
          <h2 className="admin-h2">Social links</h2>
          <p className="admin-hint">Leave a field blank to hide that icon.</p>
          <div className="admin-form-grid">
            {['facebook', 'instagram', 'youtube', 'tiktok'].map((k) => (
              <label key={k} className="admin-input-group">
                <span style={{ textTransform: 'capitalize' }}>{k}</span>
                <input
                  type="text"
                  value={form.socials[k] || ''}
                  onChange={(e) => setSection('socials', { [k]: e.target.value })}
                  placeholder={`https://${k}.com/durraniharvest`}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="admin-panel admin-panel-narrow">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save all changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminContent

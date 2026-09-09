import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X, Landmark } from 'lucide-react'
import api, { errorMessage } from '../../lib/api'
import { useShop } from '../../components/shop/ShopContext'
import { DEFAULT_SITE_SETTINGS } from '../../lib/siteSettings'
import './admin.css'

const EMPTY = { name: '', country: '*', city: '*', price: 0, sortOrder: 0, active: true }

const BANK_EMPTY = { ...DEFAULT_SITE_SETTINGS.bankDeposit }

const toForm = (r) => ({
  name: r.name || '',
  country: r.country || '*',
  city: r.city || '*',
  price: r.price ?? 0,
  sortOrder: r.sortOrder ?? 0,
  active: r.active ?? true,
})

const AdminShipping = () => {
  const { refreshSiteSettings } = useShop()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  // Bank Deposit details (stored in site settings, shown on checkout)
  const [bank, setBank] = useState(BANK_EMPTY)
  const [bankSaving, setBankSaving] = useState(false)
  const [bankMsg, setBankMsg] = useState(null)

  useEffect(() => {
    api
      .getSiteSettings()
      .then((s) => setBank({ ...BANK_EMPTY, ...(s.bankDeposit || {}) }))
      .catch(() => {})
  }, [])

  const setBankField = (key) => (e) => setBank((b) => ({ ...b, [key]: e.target.value }))

  const saveBank = async (e) => {
    e.preventDefault()
    setBankSaving(true)
    setBankMsg(null)
    try {
      await api.updateSiteSettings({ bankDeposit: bank })
      await refreshSiteSettings?.()
      setBankMsg({ type: 'ok', text: 'Saved. It now shows on checkout under "Bank Deposit".' })
    } catch (err) {
      setBankMsg({ type: 'error', text: errorMessage(err) })
    } finally {
      setBankSaving(false)
    }
  }

  const load = () => {
    setLoading(true)
    api
      .adminListShipping()
      .then((d) => setRows(d.rates || []))
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

  const openEdit = (r) => {
    setEditingId(r.id)
    setForm(toForm(r))
    setError('')
    setModalOpen(true)
  }

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (form.name.trim().length < 2) {
      setError('A method name of at least 2 characters is required')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        country: form.country.trim() || '*',
        city: form.city.trim() || '*',
        price: Number(form.price) || 0,
        sortOrder: Number(form.sortOrder) || 0,
        active: !!form.active,
      }
      if (editingId) await api.updateShipping(editingId, payload)
      else await api.createShipping(payload)
      setModalOpen(false)
      load()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (r) => {
    if (!window.confirm(`Delete shipping method "${r.name}"?`)) return
    try {
      await api.deleteShipping(r.id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleActive = async (r) => {
    try {
      await api.updateShipping(r.id, { active: !r.active })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-page-inner">
      <div className="admin-page-head">
        <h1 className="admin-h1">Shipping</h1>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} strokeWidth={2.2} /> New method
        </button>
      </div>

      <p className="admin-hint">
        Delivery options shown at checkout. Use <strong>*</strong> for "any country" / "any city".
        A more specific rule (matching country, or country + city) overrides a general one with the
        same name. Price is added to the customer's order total.
      </p>

      {error && !modalOpen && <div className="admin-alert">{error}</div>}

      <div className="admin-panel">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="admin-empty">No shipping methods yet. Click "New method" to add one.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>City</th>
                <th>Price</th>
                <th>Order</th>
                <th>Active</th>
                <th className="admin-ta-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.country}</td>
                  <td>{r.city}</td>
                  <td>{Number(r.price) > 0 ? `PKR ${Number(r.price).toLocaleString()}` : 'FREE'}</td>
                  <td>{r.sortOrder}</td>
                  <td>
                    <button
                      type="button"
                      className={`admin-badge ${r.active ? 'admin-badge-ok' : 'admin-badge-muted'}`}
                      onClick={() => toggleActive(r)}
                    >
                      {r.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="admin-ta-right">
                    <button type="button" className="admin-icon-btn" onClick={() => openEdit(r)} aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button type="button" className="admin-icon-btn admin-icon-danger" onClick={() => remove(r)} aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-page-head" style={{ marginTop: '2rem' }}>
        <h1 className="admin-h1"><Landmark size={20} style={{ verticalAlign: '-3px', marginRight: 6 }} />Bank Deposit details</h1>
      </div>
      <p className="admin-hint">
        Shown to the customer on checkout when they choose <strong>Bank Deposit</strong>. They transfer
        the order total to this account and send a payment screenshot to the WhatsApp number below.
      </p>

      {bankMsg && (
        <div className={bankMsg.type === 'ok' ? 'admin-success' : 'admin-alert'}>{bankMsg.text}</div>
      )}

      <div className="admin-panel">
        <form className="admin-form-grid" onSubmit={saveBank}>
          <label className="admin-input-group">
            <span>Bank name</span>
            <input type="text" value={bank.bankName} onChange={setBankField('bankName')} placeholder="Meezan Bank" />
          </label>
          <label className="admin-input-group">
            <span>Account title</span>
            <input type="text" value={bank.accountTitle} onChange={setBankField('accountTitle')} placeholder="Durrani Harvest" />
          </label>
          <label className="admin-input-group">
            <span>Account number</span>
            <input type="text" value={bank.accountNumber} onChange={setBankField('accountNumber')} placeholder="0123 4567 8901 234" />
          </label>
          <label className="admin-input-group">
            <span>IBAN</span>
            <input type="text" value={bank.iban} onChange={setBankField('iban')} placeholder="PK00 MEZN 0000 0000 0000 0000" />
          </label>
          <label className="admin-input-group">
            <span>Branch (optional)</span>
            <input type="text" value={bank.branch} onChange={setBankField('branch')} placeholder="Hayatabad, Peshawar" />
          </label>
          <label className="admin-input-group">
            <span>WhatsApp number (for screenshots)</span>
            <input type="text" value={bank.whatsapp} onChange={setBankField('whatsapp')} placeholder="03339285792" />
          </label>
          <label className="admin-input-group admin-col-full">
            <span>Instructions shown to the customer</span>
            <textarea
              rows="3"
              value={bank.instructions}
              onChange={setBankField('instructions')}
              placeholder="After placing your order, transfer the total to the account above and send a screenshot to our WhatsApp."
            />
          </label>
          <div className="admin-col-full">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={bankSaving}>
              {bankSaving ? 'Saving…' : 'Save bank details'}
            </button>
          </div>
        </form>
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h2>{editingId ? 'Edit shipping method' : 'New shipping method'}</h2>
              <button type="button" className="admin-icon-btn" onClick={() => setModalOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {error && <div className="admin-alert">{error}</div>}

            <form className="admin-form-grid" onSubmit={submit}>
              <label className="admin-input-group admin-col-full">
                <span>Method name *</span>
                <input type="text" value={form.name} onChange={update('name')} required placeholder="Standard Delivery" />
              </label>

              <label className="admin-input-group">
                <span>Country</span>
                <input type="text" value={form.country} onChange={update('country')} placeholder="* for any" />
              </label>

              <label className="admin-input-group">
                <span>City</span>
                <input type="text" value={form.city} onChange={update('city')} placeholder="* for any" />
              </label>

              <label className="admin-input-group">
                <span>Price (PKR)</span>
                <input type="number" min="0" step="1" value={form.price} onChange={update('price')} placeholder="0" />
              </label>

              <label className="admin-input-group">
                <span>Display order</span>
                <input type="number" value={form.sortOrder} onChange={update('sortOrder')} placeholder="0" />
              </label>

              <label className="admin-input-group admin-col-full admin-checkbox-row">
                <input
                  type="checkbox"
                  checked={!!form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                />
                <span>Show this method at checkout</span>
              </label>

              <div className="admin-col-full admin-modal-actions">
                <button type="button" className="admin-btn" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminShipping

import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import api from '../../lib/api'
import './admin.css'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState(null) // { id, name }
  const [busy, setBusy] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .listCategories()
      .then((d) => setCategories(d.categories || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const create = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setBusy(true)
    setError('')
    try {
      await api.createCategory(newName.trim())
      setNewName('')
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const saveEdit = async () => {
    if (!editing.name.trim()) return
    setBusy(true)
    setError('')
    try {
      await api.updateCategory(editing.id, editing.name.trim())
      setEditing(null)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return
    setError('')
    try {
      await api.deleteCategory(c.id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-page-inner">
      <h1 className="admin-h1">Categories</h1>
      <p className="admin-hint">Categories group products on the storefront. A category in use by a product cannot be deleted.</p>

      {error && <div className="admin-alert">{error}</div>}

      <div className="admin-panel admin-panel-narrow">
        <form className="admin-repeat-row" onSubmit={create}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name"
          />
          <button type="submit" className="admin-btn admin-btn-primary" disabled={busy} style={{ width: 'auto' }}>
            <Plus size={15} /> Add
          </button>
        </form>
      </div>

      <div className="admin-panel">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : categories.length === 0 ? (
          <p className="admin-empty">No categories yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Products</th>
                <th className="admin-ta-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    {editing?.id === c.id ? (
                      <input
                        type="text"
                        value={editing.name}
                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        autoFocus
                      />
                    ) : (
                      c.name
                    )}
                  </td>
                  <td>{c._count?.products ?? 0}</td>
                  <td className="admin-ta-right">
                    {editing?.id === c.id ? (
                      <>
                        <button type="button" className="admin-icon-btn" onClick={saveEdit} disabled={busy} aria-label="Save">
                          <Check size={15} />
                        </button>
                        <button type="button" className="admin-icon-btn" onClick={() => setEditing(null)} aria-label="Cancel">
                          <X size={15} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="admin-icon-btn" onClick={() => setEditing({ id: c.id, name: c.name })} aria-label="Rename">
                          <Pencil size={15} />
                        </button>
                        <button type="button" className="admin-icon-btn admin-icon-danger" onClick={() => remove(c)} aria-label="Delete">
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminCategories

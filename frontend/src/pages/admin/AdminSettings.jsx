import React, { useState } from 'react'
import api from '../../lib/api'
import { useAdminAuth } from '../../admin/AdminAuthContext'
import './admin.css'

const AdminSettings = () => {
  const { admin } = useAdminAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null)
    if (newPassword !== confirm) {
      setMsg({ type: 'error', text: 'New passwords do not match' })
      return
    }
    setBusy(true)
    try {
      await api.changePassword(currentPassword, newPassword)
      setMsg({ type: 'ok', text: 'Password updated.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-page-inner">
      <h1 className="admin-h1">Settings</h1>

      <div className="admin-panel admin-panel-narrow">
        <h2 className="admin-h2">Account</h2>
        <p className="admin-hint">Signed in as <strong>{admin?.email}</strong></p>
      </div>

      <div className="admin-panel admin-panel-narrow">
        <h2 className="admin-h2">Change password</h2>
        {msg && (
          <div className={msg.type === 'ok' ? 'admin-success' : 'admin-alert'}>{msg.text}</div>
        )}
        <form className="admin-form-grid" onSubmit={submit}>
          <label className="admin-input-group admin-col-full">
            <span>Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <label className="admin-input-group admin-col-full">
            <span>New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
          <label className="admin-input-group admin-col-full">
            <span>Confirm new password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <div className="admin-col-full">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>
              {busy ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminSettings

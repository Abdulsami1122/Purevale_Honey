import React, { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, KeyRound } from 'lucide-react'
import api, { errorMessage } from '../lib/api'
import './Pages.css'

const ResetPasswordPage = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      await api.resetPassword(token, password)
      setDone(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>Reset Password</span>
        </div>
        <h1 className="page-hero-title">Set a new password</h1>
      </div>

      <div className="page-content-wrapper">
        <div className="rp-card">
          {!token ? (
            <p className="rp-msg">
              This link is missing its reset token. Please request a new one from the sign-in
              screen.
            </p>
          ) : done ? (
            <div className="rp-done">
              <CheckCircle2 size={44} strokeWidth={1.6} />
              <h2>Password updated</h2>
              <p>You can now sign in with your new password.</p>
              <button type="button" className="rp-btn" onClick={() => navigate('/')}>
                Go to store
              </button>
            </div>
          ) : (
            <form className="rp-form" onSubmit={submit}>
              <p className="rp-icon"><KeyRound size={28} strokeWidth={1.7} /></p>
              {error && <div className="rp-error">{error}</div>}

              <label className="rp-field">
                <span>New password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </label>
              <label className="rp-field">
                <span>Confirm new password</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </label>

              <button type="submit" className="rp-btn" disabled={busy}>
                {busy ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage

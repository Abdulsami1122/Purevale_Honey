import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAdminAuth } from '../../admin/AdminAuthContext'
import './admin.css'

const AdminLogin = () => {
  const { login, logout, isAdmin } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dest = location.state?.from || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // If an admin session already exists, skip the form
  useEffect(() => {
    if (isAdmin) navigate(dest, { replace: true })
  }, [isAdmin, dest, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = await login(email.trim(), password)
      if (user.role !== 'admin') {
        await logout()
        setError('This account does not have admin access.')
        return
      }
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img src="/logo.png" alt="Durrani Harvest" className="admin-login-logo" />
        <h1>Durrani Harvest</h1>
        <p className="admin-login-sub">Admin sign in</p>

        {error && <div className="admin-alert">{error}</div>}

        <label className="admin-input-group">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="admin-input-group">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>
          {busy ? <Loader2 size={16} className="admin-spin" /> : 'Sign in'}
        </button>

        <Link to="/" className="admin-login-back">← Back to store</Link>
      </form>
    </div>
  )
}

export default AdminLogin

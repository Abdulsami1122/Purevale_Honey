import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'

const RequireAdmin = ({ children }) => {
  const { status } = useAdminAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <div className="admin-boot">Checking session…</div>
  }
  if (status !== 'authed') {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }
  return children
}

export default RequireAdmin

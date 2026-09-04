import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'

const RequireAdmin = ({ children }) => {
  const { status, isAdmin } = useAdminAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <div className="admin-boot">Checking session…</div>
  }
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return children
}

export default RequireAdmin

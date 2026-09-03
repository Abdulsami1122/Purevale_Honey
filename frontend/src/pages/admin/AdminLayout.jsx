import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Inbox,
} from 'lucide-react'
import { useAdminAuth } from '../../admin/AdminAuthContext'
import './admin.css'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/submissions', label: 'Submissions', icon: Inbox },
]

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className={`admin-shell ${navOpen ? 'nav-open' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span>Durrani Harvest</span>
          <button
            type="button"
            className="admin-nav-close"
            onClick={() => setNavOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setNavOpen(false)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <Link to="/" className="admin-nav-link">
            <ExternalLink size={18} strokeWidth={1.8} />
            <span>View store</span>
          </Link>
          <button type="button" className="admin-nav-link admin-logout" onClick={handleLogout}>
            <LogOut size={18} strokeWidth={1.8} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-nav-toggle"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="admin-topbar-email">{admin?.email}</span>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <div className="admin-nav-backdrop" onClick={() => setNavOpen(false)} />
    </div>
  )
}

export default AdminLayout

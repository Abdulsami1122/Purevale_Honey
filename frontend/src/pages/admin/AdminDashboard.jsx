import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Package, Wallet, Clock, Users, AlertTriangle } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice } from '../../data/products'
import './admin.css'

const STATUS_LABEL = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .adminStats()
      .then((d) => setStats(d.stats))
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="admin-alert">{error}</div>
  if (!stats) return <div className="admin-boot">Loading dashboard…</div>

  const cards = [
    { label: 'Revenue (paid+)', value: formatPrice(stats.revenue), icon: Wallet },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart },
    { label: 'Pending orders', value: stats.pendingOrders, icon: Clock },
    { label: 'Products', value: stats.products, icon: Package },
    { label: 'Customers', value: stats.users, icon: Users },
  ]

  return (
    <div className="admin-page-inner">
      <h1 className="admin-h1">Dashboard</h1>

      <div className="admin-stat-grid">
        {cards.map(({ label, value, icon: Icon }) => (
          <div className="admin-stat-card" key={label}>
            <div className="admin-stat-icon">
              <Icon size={20} strokeWidth={1.8} />
            </div>
            <div>
              <p className="admin-stat-value">{value}</p>
              <p className="admin-stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2 className="admin-h2">Recent orders</h2>
          <Link to="/admin/orders" className="admin-link">View all</Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="admin-empty">No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th className="admin-ta-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td><Link to="/admin/orders" className="admin-link">{o.id.slice(0, 8)}</Link></td>
                  <td>{o.user?.email || o.shippingName || '—'}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${o.status}`}>
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </td>
                  <td className="admin-ta-right">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2 className="admin-h2">
            <AlertTriangle size={16} strokeWidth={1.9} style={{ verticalAlign: '-2px', marginRight: 6 }} />
            Low stock
          </h2>
          <Link to="/admin/products" className="admin-link">Manage products</Link>
        </div>
        {stats.lowStock.length === 0 ? (
          <p className="admin-empty">Nothing running low.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="admin-ta-right">Stock left</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStock.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="admin-ta-right">
                    <span className={`admin-badge admin-badge-${p.stock === 0 ? 'cancelled' : 'pending'}`}>
                      {p.stock}
                    </span>
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

export default AdminDashboard

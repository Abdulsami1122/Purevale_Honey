import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Package, Wallet, Clock } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice } from '../../data/products'
import './admin.css'

const STATUS_LABEL = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.stats().then(setStats).catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="admin-alert">{error}</div>
  if (!stats) return <div className="admin-boot">Loading dashboard…</div>

  const maxRevenue = Math.max(1, ...stats.revenueByDay.map((d) => d.revenue))

  const cards = [
    { label: 'Total revenue', value: formatPrice(stats.totalRevenue), icon: Wallet },
    { label: 'Orders', value: stats.totalOrders, icon: ShoppingCart },
    { label: 'Pending orders', value: stats.pendingOrders, icon: Clock },
    { label: 'Products', value: stats.productCount, icon: Package },
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
        <h2 className="admin-h2">Revenue — last 7 days</h2>
        <div className="admin-chart">
          {stats.revenueByDay.map((d) => (
            <div className="admin-chart-col" key={d.date}>
              <div
                className="admin-chart-bar"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                title={`${d.date}: ${formatPrice(d.revenue)}`}
              />
              <span className="admin-chart-label">{d.date.slice(5)}</span>
            </div>
          ))}
        </div>
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
                  <td><Link to="/admin/orders" className="admin-link">{o.id}</Link></td>
                  <td>{o.customer.email}</td>
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
    </div>
  )
}

export default AdminDashboard

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Package, Wallet, Clock, Users } from 'lucide-react'
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

const stockTone = (stock) => (stock === 0 ? 'cancelled' : stock <= 5 ? 'pending' : 'delivered')

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
    { label: 'Total products', value: stats.products, icon: Package },
    { label: 'Customers', value: stats.users, icon: Users },
  ]

  const revenueByDay = stats.revenueByDay || []
  const maxRevenue = Math.max(1, ...revenueByDay.map((d) => d.revenue))
  const productStock = stats.productStock || []

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
        {revenueByDay.every((d) => d.revenue === 0) ? (
          <p className="admin-empty">No paid orders in the last 7 days.</p>
        ) : (
          <div className="admin-chart">
            {revenueByDay.map((d) => (
              <div className="admin-chart-col" key={d.date}>
                <span className="admin-chart-value">{d.revenue > 0 ? formatPrice(d.revenue) : ''}</span>
                <div
                  className="admin-chart-bar"
                  style={{ height: `${Math.max(4, (d.revenue / maxRevenue) * 100)}%` }}
                  title={`${d.date}: ${formatPrice(d.revenue)}`}
                />
                <span className="admin-chart-label">
                  {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        )}
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
          <h2 className="admin-h2">Product stock ({productStock.length})</h2>
          <Link to="/admin/products" className="admin-link">Manage products</Link>
        </div>
        {productStock.length === 0 ? (
          <p className="admin-empty">No products yet.</p>
        ) : (
          <div className="admin-scroll-table">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th className="admin-ta-right">Stock</th>
                </tr>
              </thead>
              <tbody>
                {productStock.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-cell-product">
                        <img src={p.images?.[0] || '/honey-jar.jpg'} alt={p.name} />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.category?.name || '—'}</td>
                    <td className="admin-ta-right">
                      <span className={`admin-badge admin-badge-${stockTone(p.stock)}`}>
                        {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

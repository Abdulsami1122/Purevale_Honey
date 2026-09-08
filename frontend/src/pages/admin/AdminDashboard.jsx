import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Package, Wallet, Clock, Users, Mail, Globe } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice } from '../../data/products'
import DateRangeCalendar from './DateRangeCalendar'
import './admin.css'

const STATUS_LABEL = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const stockTone = (stock) => (stock === 0 ? 'cancelled' : stock <= 5 ? 'pending' : 'delivered')

const pad = (n) => String(n).padStart(2, '0')
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fmtDate = (s) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}
const defaultRange = () => {
  const t = new Date()
  const s = new Date(t)
  s.setDate(s.getDate() - 6)
  return { from: toKey(s), to: toKey(t) }
}

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [range, setRange] = useState(defaultRange)
  const [periodLoading, setPeriodLoading] = useState(false)

  const offset = -new Date().getTimezoneOffset()

  useEffect(() => {
    setPeriodLoading(true)
    api
      .adminStats({ from: range.from, to: range.to, offset })
      .then((d) => setStats(d.stats))
      .catch((e) => setError(e.message))
      .finally(() => setPeriodLoading(false))
  }, [range.from, range.to, offset])

  if (error) return <div className="admin-alert">{error}</div>
  if (!stats) return <div className="admin-boot">Loading dashboard…</div>

  const cards = [
    { label: 'Revenue (paid+)', value: formatPrice(stats.revenue), icon: Wallet },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart },
    { label: 'Pending orders', value: stats.pendingOrders, icon: Clock },
    { label: 'Total products', value: stats.products, icon: Package },
    { label: 'Customers', value: stats.users, icon: Users },
  ]

  const period = stats.period || { days: [], totals: { orders: 0, revenue: 0, contacts: 0, exports: 0 }, orders: [] }
  const days = period.days || []
  const singleDay = range.from === range.to
  const maxRevenue = Math.max(1, ...days.map((d) => d.revenue))
  const productStock = stats.productStock || []
  const rangeLabel = singleDay ? fmtDate(range.from) : `${fmtDate(range.from)} – ${fmtDate(range.to)}`

  return (
    <div className="admin-page-inner">
      <div className="admin-page-head">
        <h1 className="admin-h1">Dashboard</h1>
        <DateRangeCalendar value={range} onChange={setRange} />
      </div>

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

      {/* ----- Activity for the selected date / range ----- */}
      <div className={`admin-panel ${periodLoading ? 'is-loading' : ''}`}>
        <div className="admin-panel-head">
          <h2 className="admin-h2">Activity · {rangeLabel}</h2>
          <button type="button" className="admin-link" onClick={() => setRange(defaultRange())}>
            Reset to last 7 days
          </button>
        </div>

        <div className="dash-period-totals">
          <span><ShoppingCart size={15} /> {period.totals.orders} orders</span>
          <span className="dash-period-rev"><Wallet size={15} /> {formatPrice(period.totals.revenue)} received</span>
          <span><Mail size={15} /> {period.totals.contacts} contact messages</span>
          <span><Globe size={15} /> {period.totals.exports} export enquiries</span>
        </div>

        {days.every((d) => d.revenue === 0) ? (
          <p className="admin-empty">No payments received in this period.</p>
        ) : (
          <div className="admin-chart">
            {days.map((d) => (
              <div className="admin-chart-col" key={d.date}>
                <span className="admin-chart-value">{d.revenue > 0 ? formatPrice(d.revenue) : ''}</span>
                <div
                  className="admin-chart-bar"
                  style={{ height: `${Math.max(4, (d.revenue / maxRevenue) * 100)}%` }}
                  title={`${d.date}: ${formatPrice(d.revenue)} · ${d.orders} orders`}
                />
                <span className="admin-chart-label">
                  {new Date(`${d.date}T00:00:00`).toLocaleDateString(undefined,
                    singleDay ? { day: 'numeric', month: 'short' } : { day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}

        {!singleDay && days.some((d) => d.orders || d.contacts || d.exports || d.revenue) && (
          <div className="admin-scroll-table" style={{ marginTop: '1rem', maxHeight: 260 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="admin-ta-right">Orders</th>
                  <th className="admin-ta-right">Received</th>
                  <th className="admin-ta-right">Messages</th>
                  <th className="admin-ta-right">Enquiries</th>
                </tr>
              </thead>
              <tbody>
                {days
                  .filter((d) => d.orders || d.contacts || d.exports || d.revenue)
                  .map((d) => (
                    <tr key={d.date}>
                      <td>{fmtDate(d.date)}</td>
                      <td className="admin-ta-right">{d.orders}</td>
                      <td className="admin-ta-right">{d.revenue ? formatPrice(d.revenue) : '—'}</td>
                      <td className="admin-ta-right">{d.contacts}</td>
                      <td className="admin-ta-right">{d.exports}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {period.orders && period.orders.length > 0 && (
          <div className="admin-scroll-table" style={{ marginTop: '1rem', maxHeight: 300 }}>
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
                {period.orders.map((o) => (
                  <tr key={o.id}>
                    <td><Link to="/admin/orders" className="admin-link">{o.id.slice(0, 8)}</Link></td>
                    <td>{o.customer}</td>
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

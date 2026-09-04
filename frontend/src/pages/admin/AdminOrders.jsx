import React, { useEffect, useMemo, useState } from 'react'
import { X, Search } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice } from '../../data/products'
import './admin.css'

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
const STATUS_LABEL = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .adminListOrders({ limit: 100 })
      .then((d) => setOrders(d.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false
      if (!needle) return true
      return (
        o.id.toLowerCase().includes(needle) ||
        (o.user?.email || '').toLowerCase().includes(needle) ||
        (o.shippingName || '').toLowerCase().includes(needle)
      )
    })
  }, [orders, statusFilter, query])

  const changeStatus = async (order, status) => {
    setUpdating(true)
    try {
      const { order: updated } = await api.updateOrderStatus(order.id, status)
      setOrders((rows) => rows.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)))
      setSelected((s) => (s && s.id === updated.id ? { ...s, ...updated } : s))
    } catch (e) {
      setError(e.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="admin-page-inner">
      <h1 className="admin-h1">Orders</h1>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search by order #, email, name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>

      {error && <div className="admin-alert">{error}</div>}

      <div className="admin-panel">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="admin-empty">No orders match.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th className="admin-ta-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="admin-row-click" onClick={() => setSelected(o)}>
                  <td>{o.id.slice(0, 8)}</td>
                  <td>{fmtDate(o.createdAt)}</td>
                  <td>{o.shippingName || o.user?.email || '—'}</td>
                  <td>{o.items?.reduce((n, it) => n + it.quantity, 0) ?? '—'}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className={`admin-status-select admin-badge-${o.status}`}
                      value={o.status}
                      disabled={updating}
                      onChange={(e) => changeStatus(o, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="admin-ta-right">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="admin-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal admin-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h2>Order {selected.id.slice(0, 8)}</h2>
              <button type="button" className="admin-icon-btn" onClick={() => setSelected(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="admin-order-meta">
              <div>
                <p className="admin-order-label">Placed</p>
                <p>{fmtDate(selected.createdAt)}</p>
              </div>
              <div>
                <p className="admin-order-label">Coupon</p>
                <p>{selected.couponCode || '—'}</p>
              </div>
              <div>
                <p className="admin-order-label">Status</p>
                <select
                  value={selected.status}
                  disabled={updating}
                  onChange={(e) => changeStatus(selected, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-order-cols">
              <div>
                <p className="admin-order-label">Customer</p>
                <p>{selected.shippingName || '—'}</p>
                <p>{selected.user?.email || '—'}</p>
                <p>{selected.shippingPhone || '—'}</p>
              </div>
              <div>
                <p className="admin-order-label">Shipping address</p>
                <p>{selected.shippingAddress || '—'}</p>
                <p>{[selected.shippingCity, selected.shippingCountry].filter(Boolean).join(', ')}</p>
              </div>
            </div>

            <table className="admin-table admin-order-items">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th className="admin-ta-right">Price</th>
                  <th className="admin-ta-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(selected.items || []).map((it) => (
                  <tr key={it.id}>
                    <td>
                      {it.name}
                      {it.variant ? <span className="admin-muted"> · {it.variant}</span> : null}
                    </td>
                    <td>{it.quantity}</td>
                    <td className="admin-ta-right">{formatPrice(it.price)}</td>
                    <td className="admin-ta-right">{formatPrice(it.price * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="admin-ta-right">Subtotal</td>
                  <td className="admin-ta-right">{formatPrice(selected.subtotal)}</td>
                </tr>
                {Number(selected.discount) > 0 && (
                  <tr>
                    <td colSpan={3} className="admin-ta-right">Discount</td>
                    <td className="admin-ta-right">− {formatPrice(selected.discount)}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={3} className="admin-ta-right">Shipping</td>
                  <td className="admin-ta-right">
                    {Number(selected.shippingCost) ? formatPrice(selected.shippingCost) : 'FREE'}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="admin-ta-right"><strong>Total</strong></td>
                  <td className="admin-ta-right"><strong>{formatPrice(selected.total)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders

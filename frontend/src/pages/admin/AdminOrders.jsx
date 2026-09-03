import React, { useEffect, useMemo, useState } from 'react'
import { X, Search } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice } from '../../data/products'
import './admin.css'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const STATUS_LABEL = {
  pending: 'Pending',
  confirmed: 'Confirmed',
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
  const [loadingOrder, setLoadingOrder] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .listOrders()
      .then(setOrders)
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
        o.customer.email.toLowerCase().includes(needle) ||
        `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(needle)
      )
    })
  }, [orders, statusFilter, query])

  const changeStatus = async (order, status) => {
    setUpdating(true)
    try {
      const updated = await api.updateOrderStatus(order.id, status)
      setOrders((rows) => rows.map((o) => (o.id === updated.id ? updated : o)))
      if (selected?.id === updated.id) {
        const details = await api.getOrder(updated.id)
        setSelected(details)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setUpdating(false)
    }
  }

  const openOrder = async (order) => {
    setSelected(order)
    setLoadingOrder(true)
    try {
      setSelected(await api.getOrder(order.id))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingOrder(false)
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
                <tr key={o.id} className="admin-row-click" onClick={() => openOrder(o)}>
                  <td>{o.id}</td>
                  <td>{fmtDate(o.createdAt)}</td>
                  <td>
                    {o.customer.firstName || o.customer.lastName
                      ? `${o.customer.firstName} ${o.customer.lastName}`.trim()
                      : o.customer.email}
                  </td>
                  <td>{o.items?.reduce((n, it) => n + it.quantity, 0) ?? '—'}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${o.status}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
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
              <h2>Order {selected.id}</h2>
              <button type="button" className="admin-icon-btn" onClick={() => setSelected(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {loadingOrder ? <p className="admin-empty">Loading order details…</p> : <>
            <div className="admin-order-meta">
              <div>
                <p className="admin-order-label">Placed</p>
                <p>{fmtDate(selected.createdAt)}</p>
              </div>
              <div>
                <p className="admin-order-label">Payment</p>
                <p>{selected.paymentMethod === 'bank' ? 'Bank Deposit' : 'Cash on Delivery'}</p>
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
                <p>{`${selected.customer.firstName} ${selected.customer.lastName}`.trim() || '—'}</p>
                <p>{selected.customer.email}</p>
                <p>{selected.customer.phone || '—'}</p>
              </div>
              <div>
                <p className="admin-order-label">Shipping address</p>
                <p>{selected.shipping.address || '—'}</p>
                {selected.shipping.apartment && <p>{selected.shipping.apartment}</p>}
                <p>
                  {[selected.shipping.city, selected.shipping.postalCode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                <p>{selected.shipping.country}</p>
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
                {selected.items.map((it, i) => (
                  <tr key={i}>
                    <td>
                      {it.title}
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
                <tr>
                  <td colSpan={3} className="admin-ta-right">Shipping</td>
                  <td className="admin-ta-right">
                    {selected.shippingCost ? formatPrice(selected.shippingCost) : 'FREE'}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="admin-ta-right"><strong>Total</strong></td>
                  <td className="admin-ta-right"><strong>{formatPrice(selected.total)}</strong></td>
                </tr>
              </tfoot>
            </table>
            </>}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders

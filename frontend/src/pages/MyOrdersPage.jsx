import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import api from '../lib/api'
import { useAdminAuth } from '../admin/AdminAuthContext'
import { formatPrice } from '../data/products'
import './Pages.css'

const STATUS_LABEL = {
  pending: 'Pending',
  paid: 'Paid / Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}
const STATUS_CLASS = {
  pending: 'mo-status-pending',
  paid: 'mo-status-paid',
  shipped: 'mo-status-shipped',
  delivered: 'mo-status-delivered',
  cancelled: 'mo-status-cancelled',
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const MyOrdersPage = () => {
  const { status, isAuthed } = useAdminAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!isAuthed) {
      setLoading(false)
      return
    }
    api
      .listMyOrders({ limit: 50 })
      .then((d) => setOrders(d.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [status, isAuthed])

  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>My Orders</span>
        </div>
        <h1 className="page-hero-title">My Orders</h1>
        <p className="page-hero-subtitle">Track the status of every order you've placed with us.</p>
      </div>

      <div className="page-content-wrapper">
        {status === 'loading' || loading ? (
          <p className="mo-empty">Loading…</p>
        ) : !isAuthed ? (
          <p className="mo-empty">
            Please sign in to view your orders. Use the account icon in the header.
          </p>
        ) : error ? (
          <p className="mo-empty">{error}</p>
        ) : orders.length === 0 ? (
          <p className="mo-empty">
            You haven't placed any orders yet. <Link to="/shop">Start shopping →</Link>
          </p>
        ) : (
          <div className="mo-list">
            {orders.map((o) => (
              <div className="mo-card" key={o.id}>
                <div className="mo-card-head">
                  <div>
                    <span className="mo-id"><Package size={15} strokeWidth={1.9} /> Order #{o.id.slice(0, 8)}</span>
                    <span className="mo-date">{fmtDate(o.createdAt)}</span>
                  </div>
                  <span className={`mo-status ${STATUS_CLASS[o.status] || ''}`}>
                    {STATUS_LABEL[o.status] || o.status}
                  </span>
                </div>

                <ul className="mo-items">
                  {(o.items || []).map((it) => (
                    <li key={it.id}>
                      <span className="mo-item-name">
                        {it.name}
                        {it.variant ? <span className="mo-item-variant"> · {it.variant}</span> : null}
                        <span className="mo-item-qty"> × {it.quantity}</span>
                      </span>
                      <span className="mo-item-price">{formatPrice(it.price * it.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mo-card-foot">
                  <span>Ship to: {o.shippingName}, {[o.shippingCity, o.shippingCountry].filter(Boolean).join(', ')}</span>
                  <span className="mo-total">Total {formatPrice(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrdersPage

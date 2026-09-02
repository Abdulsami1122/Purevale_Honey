import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, HelpCircle, CheckCircle2, Lock } from 'lucide-react'
import { formatPrice } from '../data/products'
import { useShop } from '../components/shop/ShopContext'
import api from '../lib/api'
import './CheckoutPage.css'

const CheckoutPage = () => {
  const { cart, cartTotal, cartCount, clearCart } = useShop()
  const navigate = useNavigate()

  const [payment, setPayment] = useState('cod')
  const [billing, setBilling] = useState('same')
  const [placedOrder, setPlacedOrder] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return
    setError('')
    setSubmitting(true)

    const f = new FormData(e.target)
    const payload = {
      customer: {
        email: f.get('email')?.trim(),
        firstName: f.get('firstName')?.trim() || '',
        lastName: f.get('lastName')?.trim() || '',
        phone: f.get('phone')?.trim() || '',
      },
      shipping: {
        country: f.get('country') || '',
        address: f.get('address')?.trim() || '',
        apartment: f.get('apartment')?.trim() || '',
        city: f.get('city')?.trim() || '',
        postalCode: f.get('postalCode')?.trim() || '',
      },
      paymentMethod: payment,
      billingSameAsShipping: billing === 'same',
      shippingCost: 0,
      items: cart.map((it) => ({
        productId: it.productId,
        title: it.title,
        variant: it.variant,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
      })),
    }

    try {
      const order = await api.createOrder(payload)
      setPlacedOrder(order)
      clearCart()
      window.scrollTo(0, 0)
    } catch (err) {
      setError(err.message || 'Could not place the order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (placedOrder) {
    return (
      <div className="ck-page">
        <div className="ck-confirm">
          <CheckCircle2 size={54} strokeWidth={1.6} />
          <h1>Thank you for your order!</h1>
          <p>
            Your order <strong>{placedOrder.id}</strong> has been placed with{' '}
            <strong>Durrani Harvest</strong>. A confirmation will be sent to{' '}
            <strong>{placedOrder.customer.email}</strong>.
          </p>
          <button type="button" className="ck-confirm-btn" onClick={() => navigate('/')}>
            Continue shopping
          </button>
        </div>
      </div>
    )
  }

  const orderSummary = (
    <aside className="ck-summary">
      <div className="ck-summary-inner">
        {cart.length === 0 ? (
          <p className="ck-summary-empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="ck-line-list">
              {cart.map((item) => (
                <li className="ck-line" key={item.lineId}>
                  <span className="ck-line-thumb">
                    <img src={item.image} alt={item.title} />
                    <span className="ck-line-qty">{item.quantity}</span>
                  </span>
                  <span className="ck-line-meta">
                    <span className="ck-line-title">{item.title}</span>
                    {item.variant && <span className="ck-line-variant">{item.variant}</span>}
                  </span>
                  <span className="ck-line-price">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="ck-summary-rows">
              <div className="ck-summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="ck-summary-row">
                <span>
                  Shipping <HelpCircle size={14} strokeWidth={1.8} />
                </span>
                <span>FREE</span>
              </div>
            </div>

            <div className="ck-summary-total">
              <span>Total</span>
              <span>
                <span className="ck-total-currency">PKR</span> {formatPrice(cartTotal)}
              </span>
            </div>
          </>
        )}
      </div>
    </aside>
  )

  return (
    <div className="ck-page">
      {/* Minimal checkout header */}
      <header className="ck-header">
        <div className="ck-header-inner">
          <Link to="/" className="ck-brand">Durrani Harvest</Link>
          <Link to="/shop" className="ck-header-cart" aria-label="Cart">
            <ShoppingBag size={22} strokeWidth={1.7} />
            {cartCount > 0 && <span className="ck-header-cart-count">{cartCount}</span>}
          </Link>
        </div>
      </header>

      <div className="ck-body">
        <div className="ck-grid">
          {/* LEFT: form */}
          <form className="ck-form" onSubmit={handleSubmit}>
            <section className="ck-section">
              <div className="ck-section-head">
                <h2>Contact</h2>
                <Link to="/shop" className="ck-link">Sign in</Link>
              </div>
              <label className="ck-field">
                <input type="email" name="email" placeholder="Email" required />
                <span className="ck-field-hint"><HelpCircle size={16} strokeWidth={1.8} /></span>
              </label>
              <label className="ck-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Email me with news and offers</span>
              </label>
            </section>

            <section className="ck-section">
              <h2>Delivery</h2>
              <label className="ck-field ck-select">
                <span className="ck-select-label">Country/Region</span>
                <select name="country" defaultValue="Pakistan">
                  <option>Pakistan</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>United Arab Emirates</option>
                  <option>Saudi Arabia</option>
                </select>
              </label>

              <div className="ck-row">
                <label className="ck-field">
                  <input type="text" name="firstName" placeholder="First name (optional)" />
                </label>
                <label className="ck-field">
                  <input type="text" name="lastName" placeholder="Last name" required />
                </label>
              </div>

              <label className="ck-field">
                <input type="text" name="address" placeholder="Address" required />
              </label>
              <label className="ck-field">
                <input type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" />
              </label>

              <div className="ck-row">
                <label className="ck-field">
                  <input type="text" name="city" placeholder="City" required />
                </label>
                <label className="ck-field">
                  <input type="text" name="postalCode" placeholder="Postal code (optional)" />
                </label>
              </div>

              <label className="ck-field">
                <input type="tel" name="phone" placeholder="Phone" required />
                <span className="ck-field-hint"><HelpCircle size={16} strokeWidth={1.8} /></span>
              </label>

              <label className="ck-checkbox">
                <input type="checkbox" />
                <span>Save this information for next time</span>
              </label>
            </section>

            <section className="ck-section">
              <h2>Shipping method</h2>
              <div className="ck-radio-card is-selected ck-shipping-row">
                <span>Free Shipping</span>
                <span className="ck-free">FREE</span>
              </div>
            </section>

            <section className="ck-section">
              <h2>Payment</h2>
              <p className="ck-muted">All transactions are secure and encrypted.</p>

              <label className={`ck-radio-card ${payment === 'cod' ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === 'cod'}
                  onChange={() => setPayment('cod')}
                />
                <span>Cash on Delivery (COD)</span>
              </label>
              <label className={`ck-radio-card ${payment === 'bank' ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === 'bank'}
                  onChange={() => setPayment('bank')}
                />
                <span>Bank Deposit</span>
              </label>
            </section>

            <section className="ck-section">
              <h2>Billing address</h2>
              <label className={`ck-radio-card ${billing === 'same' ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="billing"
                  checked={billing === 'same'}
                  onChange={() => setBilling('same')}
                />
                <span>Same as shipping address</span>
              </label>
              <label className={`ck-radio-card ${billing === 'diff' ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="billing"
                  checked={billing === 'diff'}
                  onChange={() => setBilling('diff')}
                />
                <span>Use a different billing address</span>
              </label>
            </section>

            {error && <p className="ck-error">{error}</p>}

            <button
              type="submit"
              className="ck-submit"
              disabled={cart.length === 0 || submitting}
            >
              {submitting ? 'Placing order…' : 'Complete order'}
            </button>

            <p className="ck-secure">
              <Lock size={13} strokeWidth={2} /> Secure checkout
            </p>

            <footer className="ck-footer">
              <Link to="/return-policy">Refund policy</Link>
              <Link to="/return-policy">Shipping</Link>
              <Link to="/privacy-policy">Privacy policy</Link>
              <Link to="/terms">Terms of service</Link>
              <Link to="/contact">Contact</Link>
            </footer>
          </form>

          {/* RIGHT: order summary */}
          {orderSummary}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, HelpCircle, CheckCircle2, Lock, ChevronLeft } from 'lucide-react'
import { formatPrice } from '../data/products'
import { useShop } from '../components/shop/ShopContext'
import { useAdminAuth } from '../admin/AdminAuthContext'
import AuthDrawer from '../components/shop/AuthDrawer'
import { POLICIES } from '../data/policies'
import api, { errorMessage } from '../lib/api'
import './CheckoutPage.css'

// Shown when the admin has not defined any rate for the destination yet, so
// checkout is never blocked.
const FALLBACK_METHOD = { id: '', name: 'Standard Shipping', price: 0 }

// Always offered in the Country dropdown; any country the admin adds a rate for
// is merged in on top of these.
const DEFAULT_COUNTRIES = [
  'Pakistan',
  
]

// wa.me needs an international number. A local Pakistani number like "0333…"
// becomes "92333…"; anything already in international form is left alone.
const waLink = (raw) => {
  let digits = String(raw || '').replace(/\D/g, '')
  if (digits.startsWith('0')) digits = `92${digits.slice(1)}`
  return `https://wa.me/${digits}`
}

// Downscale an image file to a compact JPEG data URL before upload.
const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const max = 1400
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = () => reject(new Error('That image could not be read'))
      img.src = reader.result
    }
    reader.onerror = () => reject(new Error('That image could not be read'))
    reader.readAsDataURL(file)
  })

const CheckoutPage = () => {
  const { cart, cartTotal, cartCount, clearCart, siteSettings } = useShop()
  const bank = siteSettings?.bankDeposit || {}
  const hasBankDetails = Boolean(bank.bankName || bank.accountNumber || bank.iban)
  const contact = siteSettings?.contact || {}
  const { isAuthed, user, login } = useAdminAuth()
  const navigate = useNavigate()

  const [payment, setPayment] = useState('cod')
  const [proofUrl, setProofUrl] = useState('')
  const [proofUploading, setProofUploading] = useState(false)
  const [proofError, setProofError] = useState('')
  const [policyKey, setPolicyKey] = useState(null) // which footer pop-up is open
  const [placedOrder, setPlacedOrder] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Destination — controlled so shipping methods can re-fetch when it changes.
  const [country, setCountry] = useState('Pakistan')
  const [city, setCity] = useState('')

  // Countries + cities the admin has configured shipping rates for.
  const [locations, setLocations] = useState({ countries: [], citiesByCountry: {} })

  // Merge admin-configured countries into the defaults, case-insensitively —
  // a default's spelling wins so a stray "pakistan" from the DB shows as "Pakistan".
  const countryOptions = (() => {
    const seen = new Map()
    for (const c of DEFAULT_COUNTRIES) seen.set(c.toLowerCase(), c)
    for (const c of locations.countries || []) {
      if (!seen.has(c.toLowerCase())) seen.set(c.toLowerCase(), c)
    }
    return [...seen.values()]
  })()

  // Cities the admin set up for the chosen country (matched case-insensitively).
  const cityOptions = (() => {
    const map = locations.citiesByCountry || {}
    const key = Object.keys(map).find((k) => k.toLowerCase() === country.toLowerCase())
    return key ? map[key] : []
  })()

  // Shipping methods for the current destination.
  const [methods, setMethods] = useState([FALLBACK_METHOD])
  const [methodId, setMethodId] = useState('')
  const [methodsLoading, setMethodsLoading] = useState(false)

  useEffect(() => {
    let alive = true
    api
      .listShippingLocations()
      .then((d) => alive && setLocations(d || { countries: [], citiesByCountry: {} }))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  // When the country changes, clear the city so the new country's list applies.
  useEffect(() => {
    setCity('')
  }, [country])

  useEffect(() => {
    let alive = true
    setMethodsLoading(true)
    const handle = setTimeout(async () => {
      try {
        const data = await api.listShippingMethods({ country, city: city.trim() })
        if (!alive) return
        const list = data?.methods?.length ? data.methods : [FALLBACK_METHOD]
        setMethods(list)
        setMethodId((cur) => (list.some((m) => m.id === cur) ? cur : list[0].id))
      } catch {
        if (!alive) return
        setMethods([FALLBACK_METHOD])
        setMethodId('')
      } finally {
        if (alive) setMethodsLoading(false)
      }
    }, 350)
    return () => {
      alive = false
      clearTimeout(handle)
    }
  }, [country, city])

  // Close the footer policy pop-up on Escape
  useEffect(() => {
    if (!policyKey) return
    const onKey = (e) => e.key === 'Escape' && setPolicyKey(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [policyKey])

  const selectedMethod = methods.find((m) => m.id === methodId) || methods[0] || FALLBACK_METHOD
  const shippingCost = Number(selectedMethod?.price || 0)
  const grandTotal = cartTotal + shippingCost

  // Checkout requires an account: inline sign-in here, or the full register
  // drawer (same one as the storefront header) when "Create account" is clicked.
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthBusy(true)
    try {
      await login(authForm.email.trim(), authForm.password)
    } catch (err) {
      setAuthError(errorMessage(err) || 'Authentication failed')
    } finally {
      setAuthBusy(false)
    }
  }

  const handleProofChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setProofError('Please choose an image file')
      return
    }
    setProofError('')
    setProofUploading(true)
    try {
      const dataUrl = await readImageFile(file)
      const { url } = await api.uploadPaymentProof(dataUrl)
      setProofUrl(url)
    } catch (err) {
      setProofError(errorMessage(err) || 'Could not upload the screenshot')
    } finally {
      setProofUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return
    setError('')
    setSubmitting(true)

    const f = new FormData(e.target)
    const first = f.get('firstName')?.trim() || ''
    const last = f.get('lastName')?.trim() || ''
    const apartment = f.get('apartment')?.trim() || ''
    const shipping = {
      name: `${first} ${last}`.trim() || user?.name || 'Customer',
      phone: f.get('phone')?.trim() || '',
      address: [f.get('address')?.trim() || '', apartment].filter(Boolean).join(', '),
      city: city.trim() || f.get('city')?.trim() || '',
      country: country || 'Pakistan',
    }

    try {
      // Push the local cart to the server cart, then place the order from it.
      await api.clearCart()
      for (const it of cart) {
        await api.addCartItem({
          productId: it.productId,
          variant: it.variant || '',
          quantity: it.quantity,
        })
      }
      const payload = { shipping, paymentMethod: payment }
      if (selectedMethod?.id) payload.shippingMethodId = selectedMethod.id
      else payload.shippingCost = shippingCost
      if (payment === 'bank' && proofUrl) payload.paymentProofUrl = proofUrl
      const { order } = await api.createOrder(payload)
      setPlacedOrder({ ...order, email: user?.email })
      clearCart()
      window.scrollTo(0, 0)
    } catch (err) {
      if (err.status === 404) {
        setError('Some items in your cart are no longer available. Please clear your cart and add them again.')
      } else {
        setError(err.message || 'Could not place the order. Please try again.')
      }
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
            Your order <strong>{placedOrder.id?.slice(0, 8)}</strong> has been placed with{' '}
            <strong>Durrani Harvest</strong>
            {placedOrder.email ? <> — a confirmation will be sent to <strong>{placedOrder.email}</strong></> : null}.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" className="ck-confirm-btn" onClick={() => navigate('/orders')}>
              View my orders
            </button>
            <button type="button" className="ck-confirm-btn" onClick={() => navigate('/')} style={{ background: 'transparent', color: '#133827', border: '1px solid #133827' }}>
              Continue shopping
            </button>
          </div>
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
                <span>Shipping <HelpCircle size={14} strokeWidth={1.8} /></span>
                <span>{shippingCost > 0 ? formatPrice(shippingCost) : 'FREE'}</span>
              </div>
            </div>

            <div className="ck-summary-total">
              <span>Total</span>
              <span><span className="ck-total-currency">PKR</span> {formatPrice(grandTotal)}</span>
            </div>
          </>
        )}
      </div>
    </aside>
  )

  // Footer pop-ups. "contact" is built here so it always reflects live settings.
  const activePolicy =
    policyKey === 'contact'
      ? {
          title: 'Contact Us',
          body: (
            <ul>
              {contact.phone && <li><strong>Phone:</strong> {contact.phone}</li>}
              {contact.whatsapp && (
                <li>
                  <strong>WhatsApp:</strong>{' '}
                  <a href={waLink(contact.whatsapp)} target="_blank" rel="noreferrer">
                    {contact.whatsapp}
                  </a>
                </li>
              )}
              {contact.email && (
                <li><strong>Email:</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a></li>
              )}
              {contact.address && <li><strong>Address:</strong> {contact.address}</li>}
            </ul>
          ),
        }
      : policyKey
      ? POLICIES[policyKey]
      : null

  return (
    <div className="ck-page">
      <header className="ck-header">
        <div className="ck-header-inner">
          <div className="ck-header-left">
            <button type="button" className="ck-back" onClick={() => navigate(-1)}>
              <ChevronLeft size={18} strokeWidth={2.2} />
              Back
            </button>
            <Link to="/" className="ck-brand">Durrani Harvest</Link>
          </div>
          <Link to="/shop" className="ck-header-cart" aria-label="Cart">
            <ShoppingBag size={22} strokeWidth={1.7} />
            {cartCount > 0 && <span className="ck-header-cart-count">{cartCount}</span>}
          </Link>
        </div>
      </header>

      <div className="ck-body">
        <div className="ck-grid">
          {!isAuthed ? (
            <form className="ck-form" onSubmit={handleAuth}>
              <section className="ck-section">
                <div className="ck-section-head">
                  <h2>Sign in to check out</h2>
                  <button
                    type="button"
                    className="ck-link"
                    onClick={() => { setAuthError(''); setAuthDrawerOpen(true) }}
                  >
                    Create account
                  </button>
                </div>

                <label className="ck-field">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  />
                </label>
                <label className="ck-field">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  />
                </label>

                {authError && <p className="ck-error">{authError}</p>}

                <button type="submit" className="ck-submit" disabled={authBusy}>
                  {authBusy ? 'Please wait…' : 'Sign in & continue'}
                </button>

                <p className="ck-muted" style={{ marginTop: '0.85rem' }}>
                  New customer?{' '}
                  <button type="button" className="ck-link" onClick={() => { setAuthError(''); setAuthDrawerOpen(true) }}>
                    Create your account
                  </button>
                </p>
              </section>
            </form>
          ) : (
            <form className="ck-form" onSubmit={handleSubmit}>
              <section className="ck-section">
                <div className="ck-section-head">
                  <h2>Contact</h2>
                  <span className="ck-muted">{user?.email}</span>
                </div>
              </section>

              <section className="ck-section">
                <h2>Delivery</h2>
                <label className="ck-field ck-select">
                  <span className="ck-select-label">Country/Region</span>
                  <select name="country" value={country} onChange={(e) => setCountry(e.target.value)}>
                    {countryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
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
                  {cityOptions.length > 0 ? (
                    <label className="ck-field ck-select">
                      <span className="ck-select-label">City</span>
                      <select
                        name="city"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      >
                        <option value="">Select your city</option>
                        {cityOptions.map((o) => (
                          <option key={o.city} value={o.city}>
                            {o.city} — {o.price > 0 ? formatPrice(o.price) : 'FREE'}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <label className="ck-field">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </label>
                  )}
                  <label className="ck-field">
                    <input type="text" name="postalCode" placeholder="Postal code (optional)" />
                  </label>
                </div>

                <label className="ck-field">
                  <input type="tel" name="phone" placeholder="Phone" required />
                </label>
              </section>

              <section className="ck-section">
                <h2>Shipping method</h2>
                <label className="ck-field ck-select">
                  <span className="ck-select-label">
                    {methodsLoading ? 'Loading options…' : 'Choose a shipping method'}
                  </span>
                  <select
                    value={methodId}
                    onChange={(e) => setMethodId(e.target.value)}
                    disabled={methodsLoading || methods.length === 0}
                  >
                    {methods.map((m) => (
                      <option key={m.id || 'fallback'} value={m.id}>
                        {m.name} — {Number(m.price) > 0 ? formatPrice(Number(m.price)) : 'FREE'}
                      </option>
                    ))}
                  </select>
                </label>
              </section>

              <section className="ck-section">
                <h2>Payment</h2>
                <p className="ck-muted">All transactions are secure and encrypted.</p>
                <label className={`ck-radio-card ${payment === 'cod' ? 'is-selected' : ''}`}>
                  <input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label className={`ck-radio-card ${payment === 'bank' ? 'is-selected' : ''}`}>
                  <input type="radio" name="payment" checked={payment === 'bank'} onChange={() => setPayment('bank')} />
                  <span>Bank Deposit</span>
                </label>

                {payment === 'bank' && (
                  <div className="ck-bank">
                    {hasBankDetails ? (
                      <>
                        <ul className="ck-bank-rows">
                          {bank.bankName && (
                            <li><span>Bank</span><strong>{bank.bankName}</strong></li>
                          )}
                          {bank.accountTitle && (
                            <li><span>Account title</span><strong>{bank.accountTitle}</strong></li>
                          )}
                          {bank.accountNumber && (
                            <li><span>Account number</span><strong>{bank.accountNumber}</strong></li>
                          )}
                          {bank.iban && (
                            <li><span>IBAN</span><strong>{bank.iban}</strong></li>
                          )}
                          {bank.branch && (
                            <li><span>Branch</span><strong>{bank.branch}</strong></li>
                          )}
                        </ul>
                        {bank.instructions && <p className="ck-bank-note">{bank.instructions}</p>}
                        {bank.whatsapp && (
                          <a
                            className="ck-bank-wa"
                            href={waLink(bank.whatsapp)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Send payment screenshot on WhatsApp: {bank.whatsapp}
                          </a>
                        )}
                      </>
                    ) : (
                      <p className="ck-bank-note">
                        Bank details will be shared with you after you place the order.
                      </p>
                    )}

                    <div className="ck-proof">
                      <span className="ck-proof-label">Payment screenshot (optional)</span>
                      {proofUrl ? (
                        <div className="ck-proof-preview">
                          <img src={proofUrl} alt="Payment screenshot" />
                          <button
                            type="button"
                            className="ck-proof-remove"
                            onClick={() => setProofUrl('')}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="ck-proof-btn">
                          {proofUploading ? 'Uploading…' : 'Upload screenshot'}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            disabled={proofUploading}
                            onChange={handleProofChange}
                          />
                        </label>
                      )}
                      {proofError && <p className="ck-error">{proofError}</p>}
                    </div>
                  </div>
                )}
              </section>

              {error && <p className="ck-error">{error}</p>}

              <button type="submit" className="ck-submit" disabled={cart.length === 0 || submitting}>
                {submitting ? 'Placing order…' : 'Complete order'}
              </button>

              <p className="ck-secure"><Lock size={13} strokeWidth={2} /> Secure checkout</p>

              <footer className="ck-footer">
                <button type="button" onClick={() => setPolicyKey('refund')}>Refund policy</button>
                <button type="button" onClick={() => setPolicyKey('shipping')}>Shipping</button>
                <button type="button" onClick={() => setPolicyKey('privacy')}>Privacy policy</button>
                <button type="button" onClick={() => setPolicyKey('terms')}>Terms of service</button>
                <button type="button" onClick={() => setPolicyKey('contact')}>Contact</button>
              </footer>
            </form>
          )}

          {orderSummary}
        </div>
      </div>

      {policyKey && (
        <div className="ck-policy-backdrop" onClick={() => setPolicyKey(null)}>
          <div className="ck-policy-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="ck-policy-head">
              <h3>{activePolicy?.title}</h3>
              <button type="button" className="ck-policy-close" onClick={() => setPolicyKey(null)} aria-label="Close">
                &times;
              </button>
            </div>
            <div className="ck-policy-body">{activePolicy?.body}</div>
          </div>
        </div>
      )}

      <AuthDrawer
        isOpen={authDrawerOpen}
        initialMode="register"
        onClose={() => setAuthDrawerOpen(false)}
      />
    </div>
  )
}

export default CheckoutPage

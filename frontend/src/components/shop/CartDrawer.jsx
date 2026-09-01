import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { formatPrice } from '../../data/products'
import { useShop } from './ShopContext'
import './CartDrawer.css'

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, cartCount, cartTotal, updateCartQuantity, removeFromCart } = useShop()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.body.classList.add('auth-drawer-open')
    document.documentElement.classList.add('auth-drawer-open')
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('auth-drawer-open')
      document.documentElement.classList.remove('auth-drawer-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const goToShop = () => {
    onClose()
    navigate('/shop')
  }

  const goToCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <>
      <div className="cart-backdrop" onClick={onClose}></div>
      <div className="cart-drawer is-open" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="cart-drawer-header">
          <h2>CART ({cartCount})</h2>
          <button type="button" className="cart-drawer-close" onClick={onClose} aria-label="Close">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <ShoppingCart size={46} strokeWidth={1.2} />
            <p>Your cart is empty</p>
            <button type="button" className="cart-continue-btn" onClick={goToShop}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer-body">
              {cart.map((item) => (
                <div className="cart-line" key={item.lineId}>
                  <img className="cart-line-img" src={item.image} alt={item.title} />
                  <div className="cart-line-info">
                    <p className="cart-line-title">{item.title}</p>
                    {item.variant && <p className="cart-line-variant">{item.variant}</p>}
                    <p className="cart-line-price">{formatPrice(item.price)}</p>

                    <div className="cart-line-controls">
                      <div className="cart-qty">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateCartQuantity(item.lineId, item.quantity - 1)}
                        >
                          <Minus size={14} strokeWidth={2} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateCartQuantity(item.lineId, item.quantity + 1)}
                        >
                          <Plus size={14} strokeWidth={2} />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-line-remove"
                        aria-label="Remove item"
                        onClick={() => removeFromCart(item.lineId)}
                      >
                        <Trash2 size={16} strokeWidth={1.7} />
                      </button>
                    </div>
                  </div>
                  <p className="cart-line-subtotal">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-subtotal-row">
                <span>Subtotal</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
              <p className="cart-tax-note">Shipping &amp; taxes calculated at checkout.</p>
              <button type="button" className="cart-checkout-btn" onClick={goToCheckout}>
                CHECKOUT
              </button>
              <button type="button" className="cart-viewcart-btn" onClick={onClose}>
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CartDrawer

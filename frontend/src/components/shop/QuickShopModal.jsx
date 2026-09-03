import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { X, Heart, Minus, Plus } from 'lucide-react'
import { discountPercent, formatPrice, originalPrice, salePrice } from '../../data/products'
import { useShop } from './ShopContext'
import './QuickShopModal.css'

// Products only carry a min/max price, so spread it evenly across the
// available variants: first variant -> priceMin, last -> priceMax.
const variantPrice = (product, index) => {
  const { priceMin, priceMax, variants = [] } = product
  if (!priceMax || variants.length < 2) return salePrice(product, priceMin)
  const step = (priceMax - priceMin) / (variants.length - 1)
  return salePrice(product, Math.round(originalPrice(product, priceMin) + step * index))
}

const QuickShopModal = ({ product, isOpen, onClose }) => {
  const { wishlist, toggleWishlist, addToCart } = useShop()
  const navigate = useNavigate()
  const [variantIndex, setVariantIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Reset selections whenever a new product is opened
  useEffect(() => {
    if (isOpen) {
      setVariantIndex(0)
      setQuantity(1)
    }
  }, [isOpen, product])

  // Lock body scroll + close on Escape while the modal is open
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

  if (!isOpen || !product) return null

  const variants = product.variants && product.variants.length ? product.variants : ['Default']
  const isWishlisted = wishlist.has(product.id)
  const price = variantPrice(product, variantIndex)
  const original = product.priceMax && variants.length > 1
    ? Math.round(Number(product.priceMin) + ((Number(product.priceMax) - Number(product.priceMin)) / (variants.length - 1)) * variantIndex)
    : originalPrice(product)
  const discount = discountPercent(product)

  const handleAddToCart = () => {
    addToCart(product, { variant: variants[variantIndex], price, quantity })
    onClose()
  }

  const handleBuyNow = () => {
    addToCart(product, { variant: variants[variantIndex], price, quantity })
    onClose()
    navigate('/checkout')
  }

  return createPortal(
    <>
      <div className="quick-shop-backdrop" onClick={onClose}></div>
      <div className="quick-shop-modal" role="dialog" aria-modal="true" aria-label={`Quick shop ${product.title}`}>
        <button type="button" className="quick-shop-close" onClick={onClose} aria-label="Close">
          <X size={22} strokeWidth={2} />
        </button>

        <div className="quick-shop-body">
          <h2 className="quick-shop-title">{product.title}</h2>
          <p className="quick-shop-price">
            {discount > 0 && <span className="quick-shop-price-compare">{formatPrice(original)}</span>}
            <span>{formatPrice(price)}</span>
            {discount > 0 && <small>{discount}% off</small>}
          </p>

          <p className="quick-shop-size-label">
            SIZE: <strong>{variants[variantIndex]}</strong>
          </p>

          <div className="quick-shop-variants">
            {variants.map((variant, i) => (
              <button
                key={variant}
                type="button"
                className={`quick-shop-variant ${i === variantIndex ? 'is-active' : ''}`}
                onClick={() => setVariantIndex(i)}
              >
                {variant.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="quick-shop-actions-row">
            <div className="quick-shop-qty">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={16} strokeWidth={2} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={16} strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              className={`quick-shop-circle ${isWishlisted ? 'is-active' : ''}`}
              aria-label="Toggle wishlist"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={1.8} />
            </button>
          </div>

          <button
            type="button"
            className="quick-shop-btn quick-shop-btn-cart"
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            {product.available ? 'ADD TO CART' : 'SOLD OUT'}
          </button>
          <button
            type="button"
            className="quick-shop-btn quick-shop-btn-buy"
            onClick={handleBuyNow}
            disabled={!product.available}
          >
            BUY IT NOW
          </button>
        </div>
      </div>
    </>,
    document.body,
  )
}

export default QuickShopModal

import React from 'react'
import { Heart, Star, StarHalf } from 'lucide-react'
import { discountPercent, formatPrice, priceLabel } from '../../data/products'
import { useShop } from './ShopContext'
import './ProductCard.css'

const Stars = ({ rating }) => {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <span className="product-stars" aria-hidden="true">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} size={14} fill="currentColor" strokeWidth={0} />
      ))}
      {half && <StarHalf size={14} fill="currentColor" strokeWidth={0} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} size={14} fill="none" strokeWidth={1.5} />
      ))}
    </span>
  )
}

const ProductCard = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useShop()
  const isWishlisted = wishlist.has(product.id)
  const discount = discountPercent(product)

  return (
    <div className="product-card">
      <div className="product-card-media">
        {discount > 0 && <span className="product-badge">-{discount}%</span>}
        {!product.available && <span className="product-badge product-badge-muted">Sold out</span>}

        <button
          type="button"
          className={`product-wish ${isWishlisted ? 'is-active' : ''}`}
          aria-label="Toggle wishlist"
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </button>

        <img src={product.image} alt={product.title} loading="lazy" />

        <div className="product-card-overlay">
          <button type="button" className="product-pill">
            Quick view
          </button>
          <button type="button" className="product-pill product-pill-solid" onClick={() => addToCart(1)}>
            Quick shop
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">
          {product.compareAt && (
            <span className="product-price-compare">{formatPrice(product.compareAt)}</span>
          )}
          <span className={product.compareAt ? 'product-price-sale' : ''}>{priceLabel(product)}</span>
        </p>

        {product.reviews > 0 && (
          <div className="product-rating">
            <Stars rating={product.rating} />
            <span>{product.reviews} review{product.reviews === 1 ? '' : 's'}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard

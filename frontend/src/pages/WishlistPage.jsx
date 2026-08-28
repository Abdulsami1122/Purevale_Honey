import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import ProductGrid from '../components/shop/ProductGrid'
import { useShop } from '../components/shop/ShopContext'
import './Pages.css'

const WishlistPage = () => {
  const { wishlistProducts } = useShop()
  const count = wishlistProducts.length

  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>Wishlist</span>
        </div>
        <h1 className="page-hero-title">Your Wishlist</h1>
        <p className="page-hero-subtitle">
          {count > 0
            ? `${count} item${count === 1 ? '' : 's'} saved. Tap the heart on a product to add or remove it.`
            : 'Tap the heart on any product to save it here.'}
        </p>
      </div>

      <div className="container section">
        {count > 0 ? (
          <ProductGrid products={wishlistProducts} />
        ) : (
          <div className="wishlist-empty">
            <Heart size={44} strokeWidth={1.4} />
            <p>Your wishlist is empty.</p>
            <Link to="/shop" className="wishlist-empty-btn">
              Browse products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage

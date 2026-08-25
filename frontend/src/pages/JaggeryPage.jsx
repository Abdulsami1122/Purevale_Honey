import React from 'react'
import { Link } from 'react-router-dom'
import CollectionSection from '../components/shop/CollectionSection'
import { jaggeryProducts } from '../data/products'
import './Pages.css'

const JaggeryPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>Jaggery (Gur)</span>
        </div>
        <h1 className="page-hero-title">Organic Desi Jaggery (Gur) & Shakkar</h1>
        <p className="page-hero-subtitle">
          100% unrefined, chemical-free sugarcane jaggery rich in natural iron, minerals, and digestive antioxidants.
        </p>
      </div>

      <CollectionSection
        id="jaggery-section"
        title="Jaggery (Gur) Collection"
        subtitle="Traditional handmade Gur, Dry Fruit Masala Gur, and Organic Shakkar"
        products={jaggeryProducts}
      />
    </div>
  )
}

export default JaggeryPage

import React from 'react'
import { Link } from 'react-router-dom'
import CollectionSection from '../components/shop/CollectionSection'
import { datesProducts } from '../data/products'
import './Pages.css'

const DatesPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>Dates Collection</span>
        </div>
        <h1 className="page-hero-title">Premium Fresh Dates</h1>
        <p className="page-hero-subtitle">
          Ajwa, Medjool, and Kalmi dates harvested at peak ripeness for rich natural nutrition and sweetness.
        </p>
      </div>

      <CollectionSection
        id="dates-section"
        title="Dates Collection"
        subtitle="Hand-picked for optimal softness, rich minerals, and authentic flavor"
        products={datesProducts}
      />
    </div>
  )
}

export default DatesPage

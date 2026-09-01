import React from 'react'
import { Link } from 'react-router-dom'
import CollectionSection from '../components/shop/CollectionSection'
import { useShop } from '../components/shop/ShopContext'
import './Pages.css'

const ShilajitPage = () => {
  const { collections } = useShop()
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>Shilajit & Herbal</span>
        </div>
        <h1 className="page-hero-title">Pure Himalayan Shilajit & Herbal</h1>
        <p className="page-hero-subtitle">
          Ethically sourced gold-grade mountain resin loaded with fulvic acid and 84+ ionic trace minerals.
        </p>
      </div>

      <CollectionSection
        id="shilajit-section"
        title="Shilajit Collection"
        subtitle="Natural vitality, endurance, and wellness boosters"
        products={collections.shilajit}
      />
    </div>
  )
}

export default ShilajitPage

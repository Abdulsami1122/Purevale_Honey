import React from 'react'
import { Link } from 'react-router-dom'
import CollectionSection from '../components/shop/CollectionSection'
import { honeyProducts, datesProducts, shilajitProducts } from '../data/products'
import './Pages.css'

const ShopPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>All Products</span>
        </div>
        <h1 className="page-hero-title">Purevale Complete Store</h1>
        <p className="page-hero-subtitle">
          Explore our range of 100% natural, lab-tested raw honey, fresh dates, and mountain shilajit.
        </p>
      </div>

      <CollectionSection
        id="honey-collection"
        title="Pure Honey Collection"
        subtitle="100% pure raw honey varieties from pristine valleys"
        products={honeyProducts}
      />

      <CollectionSection
        id="dates-collection"
        title="Organic Dates Collection"
        subtitle="Hand-selected fresh premium dates"
        products={datesProducts}
      />

      <CollectionSection
        id="shilajit-collection"
        title="Pure Shilajit & Vitality"
        subtitle="Gold-grade Himalayan shilajit for strength and health"
        products={shilajitProducts}
      />
    </div>
  )
}

export default ShopPage

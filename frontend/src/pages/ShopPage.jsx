import React from 'react'
import { Link } from 'react-router-dom'
import CollectionSection from '../components/shop/CollectionSection'
import { honeyProducts, datesProducts, jaggeryProducts, shilajitProducts, cosmeticsProducts } from '../data/products'
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
          Explore our range of 100% natural raw honey, fresh dates, organic jaggery (gur), mountain shilajit, and beeswax cosmetics.
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
        subtitle="Hand-selected fresh premium dates from trusted orchards"
        products={datesProducts}
      />

      <CollectionSection
        id="jaggery-collection"
        title="Organic Jaggery (Gur) Collection"
        subtitle="Pure unrefined desi jaggery cubes, dry fruit masala gur & shakkar"
        products={jaggeryProducts}
      />

      <CollectionSection
        id="shilajit-collection"
        title="Pure Shilajit & Vitality"
        subtitle="Gold-grade Himalayan shilajit for strength and health"
        products={shilajitProducts}
      />

      <CollectionSection
        id="cosmetics-collection"
        title="Natural Honey Cosmetics & Skincare"
        subtitle="Organic royal jelly, beeswax, and propolis facial care"
        products={cosmeticsProducts}
      />
    </div>
  )
}

export default ShopPage

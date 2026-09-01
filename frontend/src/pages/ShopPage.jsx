import React from 'react'
import { Link } from 'react-router-dom'
import CollectionSection from '../components/shop/CollectionSection'
import { useShop } from '../components/shop/ShopContext'
import './Pages.css'

const ShopPage = () => {
  const { collections } = useShop()
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>All Products</span>
        </div>
        <h1 className="page-hero-title">Durrani Harvest Complete Store</h1>
        <p className="page-hero-subtitle">
          Explore our range of 100% natural raw honey, fresh dates, organic jaggery (gur), mountain shilajit, and beeswax cosmetics.
        </p>
      </div>

      <CollectionSection
        id="honey-collection"
        title="Pure Honey Collection"
        subtitle="100% pure raw honey varieties from pristine valleys"
        products={collections.honey}
      />

      <CollectionSection
        id="dates-collection"
        title="Organic Dates Collection"
        subtitle="Hand-selected fresh premium dates from trusted orchards"
        products={collections.dates}
      />

      <CollectionSection
        id="jaggery-collection"
        title="Organic Jaggery (Gur) Collection"
        subtitle="Pure unrefined desi jaggery cubes, dry fruit masala gur & shakkar"
        products={collections.jaggery}
      />

      <CollectionSection
        id="shilajit-collection"
        title="Pure Shilajit & Vitality"
        subtitle="Gold-grade Himalayan shilajit for strength and health"
        products={collections.shilajit}
      />

      <CollectionSection
        id="cosmetics-collection"
        title="Natural Honey Cosmetics & Skincare"
        subtitle="Organic royal jelly, beeswax, and propolis facial care"
        products={collections.cosmetics}
      />
    </div>
  )
}

export default ShopPage

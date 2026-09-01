import React from 'react'
import { Link } from 'react-router-dom'
import CollectionSection from '../components/shop/CollectionSection'
import QualitySection from '../components/QualitySection'
import { useShop } from '../components/shop/ShopContext'
import './Pages.css'

const HoneyPage = () => {
  const { collections } = useShop()
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>Honey Collection</span>
        </div>
        <h1 className="page-hero-title">100% Pure Raw Honey</h1>
        <p className="page-hero-subtitle">
          Unfiltered, unpasteurized, and rich in natural live enzymes, bee pollen, and antioxidants.
        </p>
      </div>

      <CollectionSection
        id="honey-collection"
        title="Honey Collection"
        subtitle="Explore our pure Sidr, Acacia, Multi-flower, and Wildflower honeys"
        products={collections.honey}
      />

      <QualitySection />
    </div>
  )
}

export default HoneyPage

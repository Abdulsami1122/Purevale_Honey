import React from 'react'
import HeroSection from '../components/HeroSection'
import ProductHighlight from '../components/ProductHighlight'
import PageBanner from '../components/shop/PageBanner'
import CollectionSection from '../components/shop/CollectionSection'
import QualitySection from '../components/QualitySection'
import WholesaleExport from '../components/WholesaleExport'
import AboutOrigin from '../components/AboutOrigin'
import { honeyProducts, datesProducts, shilajitProducts } from '../data/products'

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <ProductHighlight />
      <PageBanner title="Our Collections" crumb="Shop" />
      <CollectionSection
        id="honey-collection"
        title="Honey Collection"
        subtitle="100% pure and natural honey"
        products={honeyProducts}
      />
      <CollectionSection
        id="dates"
        title="Dates Collection"
        subtitle="Hand-picked, naturally sweet dates"
        products={datesProducts}
      />
      <CollectionSection
        id="shilajit"
        title="Shilajit Collection"
        subtitle="Pure Himalayan shilajit for daily vitality"
        products={shilajitProducts}
      />
      <AboutOrigin />
      <QualitySection />
      <WholesaleExport />
    </div>
  )
}

export default HomePage

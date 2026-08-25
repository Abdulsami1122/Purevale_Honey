import React from 'react'
import HeroSection from '../components/HeroSection'
import PageBanner from '../components/shop/PageBanner'
import CollectionSection from '../components/shop/CollectionSection'
import QualitySection from '../components/QualitySection'
import WholesaleExport from '../components/WholesaleExport'
import AboutOrigin from '../components/AboutOrigin'
import NetworkSection from '../components/NetworkSection'
import { honeyProducts, datesProducts, jaggeryProducts, shilajitProducts, cosmeticsProducts } from '../data/products'

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <PageBanner title="Our Collections" crumb="Shop" />
      <CollectionSection
        id="honey-collection"
        title="Honey Collection"
        subtitle="100% pure and natural raw honey"
        products={honeyProducts}
      />
      <CollectionSection
        id="dates"
        title="Dates Collection"
        subtitle="Hand-picked, naturally sweet fresh dates"
        products={datesProducts}
      />
      <CollectionSection
        id="jaggery"
        title="Jaggery (Gur) Collection"
        subtitle="100% organic, unrefined desi jaggery & shakkar"
        products={jaggeryProducts}
      />
      <CollectionSection
        id="shilajit"
        title="Shilajit Collection"
        subtitle="Pure Himalayan shilajit for daily vitality"
        products={shilajitProducts}
      />
      <CollectionSection
        id="cosmetics"
        title="Natural Cosmetics Collection"
        subtitle="Beeswax & propolis infused botanical skincare"
        products={cosmeticsProducts}
      />
      <AboutOrigin />
      <QualitySection />
      <WholesaleExport />
      
      {/* Handcrafted Our Network: World & Domestic Destinations */}
      <NetworkSection />
    </div>
  )
}

export default HomePage

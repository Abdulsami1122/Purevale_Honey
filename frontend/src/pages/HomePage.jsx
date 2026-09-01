import React from 'react'
import HeroSection from '../components/HeroSection'
import PageBanner from '../components/shop/PageBanner'
import CollectionSection from '../components/shop/CollectionSection'
import QualitySection from '../components/QualitySection'
import WholesaleExport from '../components/WholesaleExport'
import AboutOrigin from '../components/AboutOrigin'
import NetworkSection from '../components/NetworkSection'
import Reveal from '../components/Reveal'
import { useShop } from '../components/shop/ShopContext'

const HomePage = () => {
  const { collections } = useShop()

  return (
    <div className="home-page">
      <HeroSection />
      <Reveal><PageBanner title="Our Collections" crumb="Shop" /></Reveal>
      <Reveal>
        <CollectionSection
          id="honey-collection"
          title="Honey Collection"
          subtitle="100% pure and natural raw honey"
          products={collections.honey}
        />
      </Reveal>
      <Reveal>
        <CollectionSection
          id="dates"
          title="Dates Collection"
          subtitle="Hand-picked, naturally sweet fresh dates"
          products={collections.dates}
        />
      </Reveal>
      <Reveal>
        <CollectionSection
          id="jaggery"
          title="Jaggery (Gur) Collection"
          subtitle="100% organic, unrefined desi jaggery & shakkar"
          products={collections.jaggery}
        />
      </Reveal>
      <Reveal>
        <CollectionSection
          id="shilajit"
          title="Shilajit Collection"
          subtitle="Pure Himalayan shilajit for daily vitality"
          products={collections.shilajit}
        />
      </Reveal>
      <Reveal>
        <CollectionSection
          id="cosmetics"
          title="Natural Cosmetics Collection"
          subtitle="Beeswax & propolis infused botanical skincare"
          products={collections.cosmetics}
        />
      </Reveal>
      <Reveal><AboutOrigin /></Reveal>
      <Reveal><QualitySection /></Reveal>
      <Reveal><WholesaleExport /></Reveal>

      {/* Handcrafted Our Network: World & Domestic Destinations */}
      <Reveal><NetworkSection /></Reveal>
    </div>
  )
}

export default HomePage

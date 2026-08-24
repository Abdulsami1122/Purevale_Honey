import React from 'react'
import { ShopProvider } from './components/shop/ShopContext'
import ShopHeader from './components/shop/ShopHeader'
import PageBanner from './components/shop/PageBanner'
import CollectionSection from './components/shop/CollectionSection'
import HeroSection from './components/HeroSection'
import ProductHighlight from './components/ProductHighlight'
import QualitySection from './components/QualitySection'
import WholesaleExport from './components/WholesaleExport'
import AboutOrigin from './components/AboutOrigin'
import Footer from './components/Footer'
import { honeyProducts, datesProducts, shilajitProducts } from './data/products'
import './App.css'

function App() {
  return (
    <ShopProvider>
      <div className="App">
        <ShopHeader />
        <main>
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
        </main>
        <Footer />
      </div>
    </ShopProvider>
  )
}

export default App

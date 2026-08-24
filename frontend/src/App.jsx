import React from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProductHighlight from './components/ProductHighlight'
import QualitySection from './components/QualitySection'
import WholesaleExport from './components/WholesaleExport'
import AboutOrigin from './components/AboutOrigin'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <HeroSection />
        <ProductHighlight />
        <AboutOrigin />
        <QualitySection />
        <WholesaleExport />
      </main>
      <Footer />
    </div>
  )
}

export default App

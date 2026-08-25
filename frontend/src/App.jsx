import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ShopProvider } from './components/shop/ShopContext'
import ShopHeader from './components/shop/ShopHeader'
import Footer from './components/Footer'

// Dedicated Pages
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import HoneyPage from './pages/HoneyPage'
import DatesPage from './pages/DatesPage'
import ShilajitPage from './pages/ShilajitPage'
import JaggeryPage from './pages/JaggeryPage'
import HeartHealthPage from './pages/HeartHealthPage'
import WholesalePage from './pages/WholesalePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FaqPage from './pages/FaqPage'
import ReturnPolicyPage from './pages/ReturnPolicyPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import CosmeticsPage from './pages/CosmeticsPage'

import './App.css'

// Helper component that resets window scroll when changing routes
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />
        <div className="App">
          <ShopHeader />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/honey" element={<HoneyPage />} />
              <Route path="/dates" element={<DatesPage />} />
              <Route path="/jaggery" element={<JaggeryPage />} />
              <Route path="/shilajit" element={<ShilajitPage />} />
              <Route path="/heart-health" element={<HeartHealthPage />} />
              <Route path="/wholesale" element={<WholesalePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/return-policy" element={<ReturnPolicyPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cosmetics" element={<CosmeticsPage />} />
              {/* Fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ShopProvider>
    </BrowserRouter>
  )
}

export default App

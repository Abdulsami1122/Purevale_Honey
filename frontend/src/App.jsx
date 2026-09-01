import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ShopProvider } from './components/shop/ShopContext'
import ShopHeader from './components/shop/ShopHeader'
import Footer from './components/Footer'
import FlyingBee from './components/FlyingBee'

// Dedicated Pages
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import WishlistPage from './pages/WishlistPage'
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
import AdminPage from './pages/AdminPage'
import CheckoutPage from './pages/CheckoutPage'

import './App.css'

// Helper component that resets window scroll when changing routes
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function Shell() {
  const { pathname } = useLocation()
  // Checkout uses its own minimal header/footer, like a hosted checkout
  const bareLayout = pathname === '/checkout'

  return (
    <div className="App">
      {!bareLayout && <FlyingBee />}
      {!bareLayout && <ShopHeader />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
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
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!bareLayout && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />
        <Shell />
      </ShopProvider>
    </BrowserRouter>
  )
}

export default App

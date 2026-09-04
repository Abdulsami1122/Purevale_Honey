import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ShopProvider } from './components/shop/ShopContext'
import { AdminAuthProvider } from './admin/AdminAuthContext'
import RequireAdmin from './admin/RequireAdmin'
import ShopHeader from './components/shop/ShopHeader'
import Footer from './components/Footer'
import FlyingBee from './components/FlyingBee'

// Storefront pages
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
import MyOrdersPage from './pages/MyOrdersPage'
import FaqPage from './pages/FaqPage'
import ReturnPolicyPage from './pages/ReturnPolicyPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import CosmeticsPage from './pages/CosmeticsPage'
import CheckoutPage from './pages/CheckoutPage'

// Admin pages
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminSettings from './pages/admin/AdminSettings'
import AdminSubmissions from './pages/admin/AdminSubmissions'
import AdminContent from './pages/admin/AdminContent'
import AdminCategories from './pages/admin/AdminCategories'
import AdminLogin from './pages/admin/AdminLogin'

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
  // Checkout and the whole admin area render without the storefront chrome
  const bareLayout = pathname === '/checkout' || pathname.startsWith('/admin')

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
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/return-policy" element={<ReturnPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cosmetics" element={<CosmeticsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="submissions" element={<AdminSubmissions />} />
          </Route>

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
        <AdminAuthProvider>
          <ScrollToTop />
          <Shell />
        </AdminAuthProvider>
      </ShopProvider>
    </BrowserRouter>
  )
}

export default App

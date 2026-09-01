import React from 'react'
import { Link } from 'react-router-dom'
import './Pages.css'

const TermsPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>Terms & Conditions</span>
        </div>
        <h1 className="page-hero-title">Terms & Conditions of Service</h1>
        <p className="page-hero-subtitle">
          Please review the terms and user policies governing orders, delivery, and services at Durrani Harvest.
        </p>
      </div>

      <div className="page-content-wrapper">
        <div className="info-section-card">
          <h2>1. Authentic Natural Products</h2>
          <p>
            All products listed on Durrani Harvest are 100% genuine and sourced ethically. Because our raw honey, unrefined dates, and Himalayan shilajit are natural products without chemical stabilization, slight seasonal variations in flavor, texture, color, and natural aroma may occur between harvests.
          </p>

          <h2>2. Order Verification & Dispatch</h2>
          <p>
            Orders placed on our website or through WhatsApp are processed from Peshawar within 24 hours. For Cash on Delivery (COD) orders, our verification team may confirm your address via call or WhatsApp message to <strong>0333 9300672</strong> before dispatch.
          </p>

          <h2>3. Pricing & Availability</h2>
          <p>
            All prices are listed in Pakistani Rupees (PKR). Durrani Harvest reserves the right to adjust product availability based on seasonal harvest yields.
          </p>

          <h2>4. Contact & Support</h2>
          <p>
            For any contractual questions, corporate bulk orders, or dispute resolution, please reach out to:
          </p>
          <ul className="info-list-styled">
            <li><strong>Headquarters:</strong> Hayatabad, Peshawar, KP, Pakistan</li>
            <li><strong>Support Phone & WhatsApp:</strong> <a href="tel:+923339300672" style={{color: '#EAA82C'}}>+92 333 9300672</a></li>
            <li><strong>Email:</strong> <a href="mailto:support@durraniharvest.com" style={{color: '#EAA82C'}}>support@durraniharvest.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TermsPage

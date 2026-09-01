import React from 'react'
import { Link } from 'react-router-dom'
import './Pages.css'

const PrivacyPolicyPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>Privacy Policy</span>
        </div>
        <h1 className="page-hero-title">Privacy & Data Security Policy</h1>
        <p className="page-hero-subtitle">
          Your personal data and privacy are safeguarded with strict confidentiality and encryption.
        </p>
      </div>

      <div className="page-content-wrapper">
        <div className="info-section-card">
          <h2>1. Information We Collect</h2>
          <p>
            When you place an order or subscribe to Durrani Harvest, we collect basic order details including your full name, phone number, delivery address, and email address solely to dispatch your products and communicate tracking updates.
          </p>

          <h2>2. How Your Information Is Used</h2>
          <ul className="info-list-styled">
            <li><strong>✓ Order Fulfillment:</strong> Coordinating dispatch with local and international courier partners.</li>
            <li><strong>✓ Customer Care:</strong> Providing instant order confirmations and dispatch tracking via SMS or WhatsApp.</li>
            <li><strong>✓ Exclusive Offers:</strong> If opted in, sending discounts on seasonal honey harvests.</li>
          </ul>

          <h2>3. Zero Third-Party Sharing</h2>
          <p>
            Durrani Harvest guarantees that your personal data is never sold, traded, rented, or distributed to any unauthorized external marketing entities.
          </p>

          <h2>4. Data Deletion & Inquiries</h2>
          <p>
            You may request the deletion of your account or contact data at any time by contacting our Hayatabad support desk at <strong>0333 9300672</strong> or emailing <strong>support@durraniharvest.com</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage

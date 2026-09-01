import React from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw, ShieldCheck } from 'lucide-react'
import './Pages.css'

const ReturnPolicyPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>Return & Refund Policy</span>
        </div>
        <h1 className="page-hero-title">Return & Refund Policy</h1>
        <p className="page-hero-subtitle">
          Transparent, fair, and backed by our 100% purity and customer satisfaction guarantee.
        </p>
      </div>

      <div className="page-content-wrapper">
        <div className="info-section-card">
          <h2>1. 7-Day Replacement & Return Guarantee</h2>
          <p>
            At Durrani Harvest, we take great pride in our carefully packed glass jars and vacuum-sealed products. If your parcel arrives damaged, leaking, broken in transit, or if you receive an incorrect product, you are eligible for an immediate replacement or full refund within <strong>7 days</strong> of delivery.
          </p>

          <h2>2. 100% Purity & Lab Test Guarantee</h2>
          <p>
            We stand unreservedly behind the authentic purity of our raw honey and natural products. If you test our honey in any accredited government laboratory and find artificial adulteration (such as corn syrup, invert sugar, or chemical additives), Durrani Harvest will issue a <strong>100% full refund</strong> including reimbursement for your testing fees.
          </p>

          <h2>3. Simple 3-Step Claim Process</h2>
          <ul className="info-list-styled">
            <li>
              <strong>Step 1:</strong> Take a photo or short video showing the issue along with your order ID / invoice.
            </li>
            <li>
              <strong>Step 2:</strong> Send the details via WhatsApp to <strong>0333 9300672</strong> or email <strong>support@durraniharvest.com</strong>.
            </li>
            <li>
              <strong>Step 3:</strong> Our customer support desk in Hayatabad, Peshawar will process your replacement or refund within 24 business hours.
            </li>
          </ul>

          <h2>4. Refund Methods</h2>
          <p>
            Refunds can be disbursed immediately via JazzCash, EasyPaisa, or direct Bank Transfer to any Pakistani bank account.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReturnPolicyPage

import React from 'react'
import { Link } from 'react-router-dom'
import './Pages.css'

const ReturnPolicyPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>Return &amp; Refund Policy</span>
        </div>
        <h1 className="page-hero-title">Return &amp; Refund Policy</h1>
        <p className="page-hero-subtitle">
          Transparent, fair, and backed by our 100% purity and customer satisfaction guarantee.
        </p>
      </div>

      <div className="page-content-wrapper">
        <div className="info-section-card">
          <p>
            At Durrani Harvest, we strive to provide our customers with the highest quality honey and
            natural products. Your satisfaction is our priority, and we understand that sometimes you
            may need to return a product. Please review our return policy below.
          </p>

          <h2>Return Eligibility</h2>
          <ul className="info-list-styled">
            <li>
              <strong>Timeframe:</strong> Returns must be requested within <strong>24 hours</strong> of
              your order being delivered.
            </li>
            <li>
              <strong>Condition:</strong> Products must be unopened, unused, and in their original
              packaging. Opened or used products are not eligible for return.
            </li>
            <li>
              <strong>Receipt:</strong> A valid proof of purchase (receipt or order confirmation) is
              required for all returns.
            </li>
          </ul>

          <h2>Non-Returnable Items</h2>
          <p>The following items cannot be returned:</p>
          <ul className="info-list-styled">
            <li>Opened or used products.</li>
            <li>Products purchased on sale or with promotional discounts.</li>
            <li>Custom or personalized products.</li>
            <li>Perishable items (including any products with a limited shelf life).</li>
          </ul>

          <h2>Return Process</h2>
          <ul className="info-list-styled">
            <li>
              <strong>Step 1:</strong> Contact our customer service team at{' '}
              <strong>support@durraniharvest.com</strong> or on WhatsApp at{' '}
              <strong>+92 333 9300672</strong> to initiate the return. Please provide your order
              number and the reason for the return.
            </li>
            <li>
              <strong>Step 2:</strong> If your return is approved, you will receive instructions on
              how to return the product. You are responsible for the shipping costs associated with
              returning the product.
            </li>
            <li>
              <strong>Step 3:</strong> Once we receive the returned product, it will be inspected to
              ensure it meets our return eligibility criteria.
            </li>
            <li>
              <strong>Step 4:</strong> If approved, a refund will be issued to your original method of
              payment within 7–10 business days. Shipping costs are non-refundable.
            </li>
          </ul>

          <h2>Damaged or Defective Products</h2>
          <p>
            If you receive a damaged or defective product, please contact us immediately at{' '}
            <strong>support@durraniharvest.com</strong> or <strong>+92 333 9300672</strong>. We will
            arrange for a replacement or refund as quickly as possible. Please provide photos of the
            damaged or defective product to help us resolve the issue.
          </p>

          <h2>Exchanges</h2>
          <p>
            We do not offer direct exchanges. If you wish to exchange a product, please return the
            original item following the return process above and place a new order for the desired
            product.
          </p>

          <h2>Refunds</h2>
          <ul className="info-list-styled">
            <li>Refunds will be processed to the original payment method used during the purchase.</li>
            <li>
              Shipping costs are non-refundable unless the return is due to our error (e.g., wrong
              item sent, defective product).
            </li>
            <li>Please allow up to 14 business days for the refund to appear in your account.</li>
          </ul>

          <h2>Customer Service</h2>
          <p>
            For any questions or concerns regarding returns, please contact our customer service team
            at <strong>support@durraniharvest.com</strong> or <strong>+92 333 9300672</strong>. Our
            support desk in Hayatabad, Peshawar, Khyber Pakhtunkhwa, Pakistan is here to help.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReturnPolicyPage

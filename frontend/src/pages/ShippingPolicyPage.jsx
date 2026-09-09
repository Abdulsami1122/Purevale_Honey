import React from 'react'
import { Link } from 'react-router-dom'
import './Pages.css'

const ShippingPolicyPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>Shipping Policy</span>
        </div>
        <h1 className="page-hero-title">Shipping Policy</h1>
        <p className="page-hero-subtitle">
          How Durrani Harvest processes, packs, and delivers your order across Pakistan.
        </p>
      </div>

      <div className="page-content-wrapper">
        <div className="info-section-card">
          <p>
            At Durrani Harvest, we aim to deliver your order safely, quickly, and efficiently. Please
            read our shipping policy to understand how we process and dispatch your items.
          </p>

          <h2>Order Processing</h2>
          <ul className="info-list-styled">
            <li>All orders are processed within 1–2 business days after payment confirmation.</li>
            <li>
              Orders placed on weekends or public holidays will be processed on the next business
              day.
            </li>
          </ul>

          <h2>Shipping Time</h2>
          <ul className="info-list-styled">
            <li>
              Standard delivery within Pakistan typically takes 2–4 business days, depending on your
              city and courier service.
            </li>
            <li>Remote areas may require additional delivery time.</li>
          </ul>

          <h2>Shipping Charges</h2>
          <ul className="info-list-styled">
            <li>Shipping charges are calculated at checkout based on your location and order weight.</li>
            <li>Free shipping may be offered on selected promotions or minimum order amounts.</li>
          </ul>

          <h2>Order Tracking</h2>
          <p>
            Once your order is dispatched, you will receive a tracking number via SMS or WhatsApp to
            monitor your shipment status.
          </p>

          <h2>Delays</h2>
          <p>Although we strive for timely delivery, delays may occur due to:</p>
          <ul className="info-list-styled">
            <li>Weather conditions</li>
            <li>Courier service issues</li>
            <li>High-volume order seasons (e.g., Ramadan, Eid)</li>
          </ul>
          <p>We appreciate your patience in such situations.</p>

          <h2>Incorrect Address</h2>
          <p>
            Please ensure your shipping details are accurate. Durrani Harvest is not responsible for
            delays or delivery failures due to incorrect or incomplete addresses.
          </p>

          <h2>Damaged Packages</h2>
          <p>
            If your package arrives damaged, please contact us within 24 hours with pictures/video at{' '}
            <strong>support@durraniharvest.com</strong> or <strong>+92 333 9300672</strong> so we can
            resolve the issue promptly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShippingPolicyPage

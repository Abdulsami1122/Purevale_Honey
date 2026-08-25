import React from 'react'
import { Link } from 'react-router-dom'
import QualitySection from '../components/QualitySection'
import ProductHighlight from '../components/ProductHighlight'
import './Pages.css'

const HeartHealthPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>Heart Health & Quality</span>
        </div>
        <h1 className="page-hero-title">Heart Health & Natural Wellness</h1>
        <p className="page-hero-subtitle">
          Discover how pure raw honey, organic dates, and bio-active antioxidants support cardiovascular vitality.
        </p>
      </div>

      <div className="page-content-wrapper">
        <div className="info-section-card">
          <h2>The Science of Pure Honey for Heart Vitality</h2>
          <p>
            Pure raw honey is packed with flavonoids, polyphenols, and nitric oxide boosters. Regular consumption of unpasteurized honey helps regulate cholesterol levels, supports healthy blood flow, and reduces oxidative stress on arterial walls.
          </p>
          <ul className="info-list-styled">
            <li>
              <strong>✓ Rich in Phenolic Compounds:</strong> Protects cells from free radical damage and reinforces cardiovascular strength.
            </li>
            <li>
              <strong>✓ Natural Blood Pressure Support:</strong> Helps relax vascular tension and promotes smooth circulation.
            </li>
            <li>
              <strong>✓ Healthy Metabolic Energy:</strong> Unlike refined sugar, raw honey provides sustained, natural glycogen replenishment.
            </li>
          </ul>
        </div>
      </div>

      <ProductHighlight />
      <QualitySection />
    </div>
  )
}

export default HeartHealthPage

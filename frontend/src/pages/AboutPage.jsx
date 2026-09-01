import React from 'react'
import { Link } from 'react-router-dom'
import AboutOrigin from '../components/AboutOrigin'
import QualitySection from '../components/QualitySection'
import './Pages.css'

const AboutPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>About Us</span>
        </div>
        <h1 className="page-hero-title">About Durrani Harvest</h1>
        <p className="page-hero-subtitle">
          Dedicated to purity, nature conservation, and delivering authentic honey and wellness products to your doorstep.
        </p>
      </div>

      <div className="page-content-wrapper">
        <div className="info-section-card">
          <h2>Our Philosophy & Mission</h2>
          <p>
            At <strong>Durrani Harvest</strong>, based in <strong>Hayatabad, Peshawar</strong>, our journey began with a simple belief: nature provides the most potent nutrition in its unadulterated state. In a world full of artificial additives, ultra-processed sugars, and diluted products, Durrani Harvest stands as a trusted beacon of integrity.
          </p>
          <p>
            We work directly with traditional beekeeping families and alpine foragers across the Karakoram, Hindu Kush, and fertile plains of Pakistan. We ensure that our bees are never fed synthetic syrups, and our honey is never boiled or chemically altered.
          </p>

          <div className="about-pillars-grid">
            <div className="about-pillar-card">
              <span className="pillar-icon">🌿</span>
              <h4>100% Raw & Pure</h4>
              <p>Zero pasteurization. Zero added syrups. Direct from the hive to jar with natural enzymes intact.</p>
            </div>
            <div className="about-pillar-card">
              <span className="pillar-icon">🔬</span>
              <h4>Scientific Testing</h4>
              <p>Every harvest is lab-tested for HMF levels, pollen density, sucrose purity, and organic integrity.</p>
            </div>
            <div className="about-pillar-card">
              <span className="pillar-icon">🐝</span>
              <h4>Bee Conservation</h4>
              <p>We practice regenerative and ethical apiculture, safeguarding vital wild bee populations.</p>
            </div>
          </div>
        </div>
      </div>

      <AboutOrigin />
      <QualitySection />
    </div>
  )
}

export default AboutPage

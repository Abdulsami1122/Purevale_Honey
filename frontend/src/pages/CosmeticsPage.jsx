import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react'
import CollectionSection from '../components/shop/CollectionSection'
import QualitySection from '../components/QualitySection'
import { cosmeticsProducts } from '../data/products'
import './Pages.css'

const CosmeticsPage = () => {
  return (
    <div className="page-container">
      {/* 1. Hero Banner */}
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>Natural Cosmetics</span>
        </div>
        <h1 className="page-hero-title">Purevale Natural Cosmetics & Beauty</h1>
        <p className="page-hero-subtitle">
          Pure raw honey, bee propolis, and organic mountain beeswax infused skincare crafted for radiant, nourished skin.
        </p>
      </div>

      {/* 2. Collection Section (Store Grid with Filter, Toolbar, Sort & Cart) */}
      <CollectionSection
        id="cosmetics-collection"
        title="Honey & Propolis Cosmetics"
        subtitle="100% organic, chemical-free beeswax creams, serums, and botanical elixirs"
        products={cosmeticsProducts}
      />

      {/* 3. Product Benefits Info */}
      <div className="page-content-wrapper" style={{ marginTop: '3rem' }}>
        <div className="info-section-card">
          <h2>100% Organic & Chemical-Free Bee Skincare</h2>
          <p>
            Purevale's natural beauty line harnesses the regenerative powers of wild Sidr honey, golden beeswax, and soothing propolis. Formulated with zero parabens, artificial fragrances, or petrochemicals.
          </p>
          <ul className="info-list-styled">
            <li>
              <strong><CheckCircle2 size={16} color="#133827" style={{ display: 'inline', marginRight: '6px' }} /> Bio-Active Bee Propolis:</strong> Promotes cellular repair, calms acne, and boosts natural collagen.
            </li>
            <li>
              <strong><CheckCircle2 size={16} color="#133827" style={{ display: 'inline', marginRight: '6px' }} /> Pure Mountain Beeswax:</strong> Creates a breathable protective moisture seal that deeply hydrates.
            </li>
            <li>
              <strong><CheckCircle2 size={16} color="#133827" style={{ display: 'inline', marginRight: '6px' }} /> Cold-Pressed Botanical Oils:</strong> Infused with Kalonji (Black Seed), Vitamin E, and Almond oil for silky soft skin.
            </li>
          </ul>
        </div>
      </div>

      <QualitySection />
    </div>
  )
}

export default CosmeticsPage

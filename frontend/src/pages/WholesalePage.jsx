import React from 'react'
import { Link } from 'react-router-dom'
import WholesaleExport from '../components/WholesaleExport'
import './Pages.css'

const WholesalePage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>Wholesale & Global Export</span>
        </div>
        <h1 className="page-hero-title">Wholesale & International Export</h1>
        <p className="page-hero-subtitle">
          Partner with Durrani Harvest for bulk raw honey, fresh dates, private labeling, and custom commercial packaging worldwide.
        </p>
      </div>

      <WholesaleExport />
    </div>
  )
}

export default WholesalePage

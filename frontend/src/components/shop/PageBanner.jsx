import React from 'react'
import { ChevronRight } from 'lucide-react'
import './PageBanner.css'

const PageBanner = ({ title, crumb }) => (
  <div className="page-banner">
    <div className="container page-banner-inner">
      <h1>{title}</h1>
      <div className="page-banner-crumb">
        <a href="#home">Home</a>
        <ChevronRight size={16} strokeWidth={2} />
        <span>{crumb ?? title}</span>
      </div>
    </div>
  </div>
)

export default PageBanner

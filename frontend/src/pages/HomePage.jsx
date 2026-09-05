import React from 'react'
import HeroSection from '../components/HeroSection'
import PageBanner from '../components/shop/PageBanner'
import FeaturedMixSection from '../components/shop/FeaturedMixSection'
import QualitySection from '../components/QualitySection'
import WholesaleExport from '../components/WholesaleExport'
import AboutOrigin from '../components/AboutOrigin'
import NetworkSection from '../components/NetworkSection'
import TestimonialsSection from '../components/TestimonialsSection'
import Reveal from '../components/Reveal'

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <Reveal><PageBanner title="Our Collections" crumb="Shop" /></Reveal>
      <Reveal><FeaturedMixSection /></Reveal>
      <Reveal><AboutOrigin /></Reveal>
      <Reveal><QualitySection /></Reveal>
      <Reveal><TestimonialsSection /></Reveal>
      <Reveal><WholesaleExport /></Reveal>

      {/* Handcrafted Our Network: World & Domestic Destinations */}
      <Reveal><NetworkSection /></Reveal>
    </div>
  )
}

export default HomePage

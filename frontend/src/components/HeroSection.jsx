import React from 'react';
import { useShop } from './shop/ShopContext';
import { DEFAULT_SITE_SETTINGS } from '../lib/siteSettings';
import './HeroSection.css';

// Twinkling star burst that plays while a hero button is hovered.
const Sparkles = () => (
  <span className="btn-sparkles" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => (
      <span key={i} className="btn-sparkle" style={{ '--i': i }} />
    ))}
  </span>
);

const HeroSection = () => {
  const { siteSettings } = useShop();
  const hero = { ...DEFAULT_SITE_SETTINGS.hero, ...(siteSettings?.hero || {}) };

  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <video
          key={hero.videoUrl}
          className="hero-video"
          src={hero.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="hero-overlay"></div>
      </div>
      <div className="container hero-content animate-fade-in">
        <h2 className="hero-subtitle">{hero.subtitle}</h2>
        <h1 className="hero-title">{hero.title}</h1>
        <p className="hero-description">{hero.description}</p>
        <div className="hero-buttons">
          <a href="/shop" className="btn btn-gold hero-btn">
            Shop Now
            <Sparkles />
          </a>
          <a href="#wholesale" className="btn btn-outline-white hero-btn">
            Wholesale Enquiry
            <Sparkles />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

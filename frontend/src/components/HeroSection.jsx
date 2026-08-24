import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <img src="/hero-bg.jpg" alt="Premium Natural Honey and Jaggery" />
        <div className="hero-overlay"></div>
      </div>
      <div className="container hero-content animate-fade-in">
        <h2 className="hero-subtitle">Pure Nature. Trusted Worldwide.</h2>
        <h1 className="hero-title">Nature, Sourced with Integrity.</h1>
        <p className="hero-description">
          Premium natural products from Pakistan, delivered to the world.
        </p>
        <div className="hero-buttons">
          <a href="#products" className="btn btn-gold">Shop Now</a>
          <a href="#wholesale" className="btn btn-outline-white">Wholesale Enquiry</a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

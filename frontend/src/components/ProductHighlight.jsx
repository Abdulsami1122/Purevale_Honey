import React from 'react';
import './ProductHighlight.css';

const ProductHighlight = () => {
  return (
    <section className="section bg-cream" id="products">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Our Premium Selection</h2>
          <p className="section-subtitle">Sustainably sourced, naturally perfect.</p>
        </div>

        <div className="product-grid">
          {/* Honey Product */}
          <div className="product-card">
            <div className="product-image">
              <img src="/honey-jar.jpg" alt="Pure Raw Honey" />
            </div>
            <div className="product-content">
              <h3>Pure Raw Honey</h3>
              <p className="product-desc">
                Harvested from the pristine floral valleys of Pakistan. Unfiltered, unheated, and 100% natural, preserving its natural enzymes and rich flavor profile.
              </p>
              <div className="product-sizes">
                <span className="size-badge">250g</span>
                <span className="size-badge">500g</span>
                <span className="size-badge">1kg</span>
              </div>
              <button className="btn btn-primary w-100 mt-4">Enquire Details</button>
            </div>
          </div>

          {/* Jaggery Product */}
          <div className="product-card">
            <div className="product-image">
              <img src="/jaggery.jpg" alt="Natural Jaggery Blocks" />
            </div>
            <div className="product-content">
              <h3>Natural Jaggery (Gur)</h3>
              <p className="product-desc">
                Traditional, hand-crafted jaggery blocks made from pure sugarcane juice. Rich in minerals and free from chemical additives or preservatives.
              </p>
              <div className="product-sizes">
                <span className="size-badge">500g</span>
                <span className="size-badge">1kg</span>
                <span className="size-badge">5kg Box</span>
              </div>
              <button className="btn btn-primary w-100 mt-4">Enquire Details</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlight;

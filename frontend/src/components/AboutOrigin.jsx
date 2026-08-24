import React from 'react';
import './AboutOrigin.css';

const AboutOrigin = () => {
  return (
    <section className="section bg-cream" id="story">
      <div className="container">
        <div className="origin-layout">
          <div className="origin-image-wrapper">
            <div className="origin-image-box">
              {/* Using a solid color or gradient as a placeholder for a rich contextual image */}
              <div className="placeholder-image"></div>
              <div className="experience-badge">
                <span className="years">100%</span>
                <span className="text">Natural<br/>Source</span>
              </div>
            </div>
          </div>
          
          <div className="origin-content">
            <h4 className="subtitle">Our Story</h4>
            <h2 className="title">Rooted in Tradition. Crafted for the World.</h2>
            <p className="desc">
              At Purevale, our journey begins in the lush, fertile landscapes of Pakistan. For generations, traditional farming communities have harvested honey from wild flora and crafted jaggery using time-honored methods. 
            </p>
            <p className="desc">
              We bridge the gap between these pristine origins and global markets. By combining age-old artisanal techniques with rigorous modern quality standards, we ensure that every product we export—from Lahore to London, from Karachi to New York—delivers an authentic, premium experience.
            </p>
            
            <div className="stats-grid">
              <div className="stat-item">
                <h3>0%</h3>
                <p>Artificial Additives</p>
              </div>
              <div className="stat-item">
                <h3>100%</h3>
                <p>Traceable Origins</p>
              </div>
              <div className="stat-item">
                <h3>Global</h3>
                <p>Export Network</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutOrigin;

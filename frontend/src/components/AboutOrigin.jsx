import React from 'react';
import { useShop } from './shop/ShopContext';
import { DEFAULT_SITE_SETTINGS } from '../lib/siteSettings';
import './AboutOrigin.css';

const AboutOrigin = () => {
  const { siteSettings } = useShop();
  const storyImage = siteSettings?.story?.image || DEFAULT_SITE_SETTINGS.story.image;

  return (
    <section className="section bg-cream" id="story">
      <div className="container">
        <div className="origin-layout">
          <div className="origin-image-wrapper">
            <div className="origin-image-box">
              <img
                className="origin-image"
                src={storyImage}
                alt="A jar of Durrani Harvest raw honey with a wooden dipper, beside blocks of natural jaggery and wild botanicals"
              />
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
              Durrani Harvest begins where the honey does — in the wildflower meadows and
              mountain foothills of Pakistan, tended by beekeeping families who have read these
              landscapes for generations. Our raw honey is lifted straight from the comb, still
              carrying the scent of the herbs and blossoms it was drawn from, while our jaggery
              is pressed from freshly cut sugarcane and set into blocks the way village makers
              have always done it.
            </p>
            <p className="desc">
              Nothing is over-heated, filtered, or blended into anonymity. Each jar is
              cold-extracted and hand-poured; every block of gur is unrefined and whole. We keep
              each batch traceable to the apiary or field it came from — so what reaches your
              table is exactly what left the farm.
            </p>
            <p className="desc">
              From these origins we carry it outward — from Peshawar to London, from Islamabad to
              New York. Wherever it travels, the promise stays the same: real Pakistani honey,
              jaggery, dates and natural harvests, with nothing added and nothing hidden.
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

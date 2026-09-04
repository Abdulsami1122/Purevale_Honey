import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TiktokIcon } from './shop/BrandIcons';
import { useShop } from './shop/ShopContext';
import { DEFAULT_SITE_SETTINGS, telHref, waHref } from '../lib/siteSettings';
import './Footer.css';

const Footer = () => {
  const { siteSettings } = useShop();
  const contact = { ...DEFAULT_SITE_SETTINGS.contact, ...(siteSettings?.contact || {}) };
  const socials = { ...DEFAULT_SITE_SETTINGS.socials, ...(siteSettings?.socials || {}) };
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <>
      <footer className="ih-footer" id="footer-section">
        <div className="ih-footer-container">
          <div className="ih-footer-grid">
            
            {/* 1. Durrani Harvest Brand & Contact Details */}
            <div className="ih-footer-col ih-brand-col">
              <div className="ih-logo-wrapper">
                <Link to="/" className="pv-footer-brand">
                  <img src="/logo.png" alt="Durrani Harvest" className="pv-footer-logo-img" />
                  <div className="pv-brand-meta">
                    <span className="pv-brand-name">DURRANI HARVEST</span>
                    <span className="pv-brand-sub">100% PURE & NATURAL</span>
                  </div>
                </Link>
              </div>

              <div className="ih-contact-list">
                <Link to="/contact" className="ih-contact-item ih-contact-link">
                  <span className="ih-contact-icon">
                    <MapPin size={18} strokeWidth={1.8} />
                  </span>
                  <span className="ih-contact-text">
                    {contact.address}
                  </span>
                </Link>

                <a href={`mailto:${contact.email}`} className="ih-contact-item ih-contact-link">
                  <span className="ih-contact-icon">
                    <Mail size={18} strokeWidth={1.8} />
                  </span>
                  <span className="ih-contact-text">{contact.email}</span>
                </a>

                <a href={telHref(contact.phone)} className="ih-contact-item ih-contact-link">
                  <span className="ih-contact-icon">
                    <Phone size={18} strokeWidth={1.8} />
                  </span>
                  <span className="ih-contact-text">{contact.phone}</span>
                </a>

                <a
                  href={waHref(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ih-contact-item ih-contact-link"
                >
                  <span className="ih-contact-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                  </span>
                  <span className="ih-contact-text">{contact.whatsapp} (WhatsApp)</span>
                </a>
              </div>
            </div>

            {/* 2. Categories Column */}
            <div className="ih-footer-col">
              <h3 className="ih-footer-heading">Categories</h3>
              <ul className="ih-footer-links">
                <li><Link to="/honey">Pure Honey</Link></li>
                <li><Link to="/dates">Fresh Dates</Link></li>
                <li><Link to="/jaggery">Jaggery (Gur)</Link></li>
                <li><Link to="/shilajit">Himalayan Shilajit</Link></li>
                <li><Link to="/cosmetics">Natural Cosmetics</Link></li>
                <li><Link to="/wholesale">Wholesale & Bulk</Link></li>
                <li><Link to="/shop">All Products</Link></li>
              </ul>
            </div>

            {/* 3. Information Column */}
            <div className="ih-footer-col">
              <h3 className="ih-footer-heading">Information</h3>
              <ul className="ih-footer-links">
                <li><Link to="/about">About Durrani Harvest</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ's</Link></li>
                <li><Link to="/return-policy">Return Policy</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* 4. Useful Links Column */}
            <div className="ih-footer-col">
              <h3 className="ih-footer-heading">Useful Links</h3>
              <ul className="ih-footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Complete Store</Link></li>
                <li><Link to="/heart-health">Heart Health</Link></li>
                <li><Link to="/about">Quality Guarantee</Link></li>
                <li><Link to="/wholesale">Export Inquiry</Link></li>
              </ul>
            </div>

            {/* 5. Newsletter Signup Column */}
            <div className="ih-footer-col ih-newsletter-col">
              <h3 className="ih-footer-heading">Newsletter Signup</h3>
              <p className="ih-newsletter-desc">
                Subscribe to our newsletter for latest offers and discounts.
              </p>

              <form className="ih-newsletter-form" onSubmit={handleSubscribe}>
                <div className="ih-input-pill-container">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="ih-email-input"
                    required
                  />
                  <button type="submit" className="ih-subscribe-btn">
                    {subscribed ? 'Joined ✓' : 'Subscribe'}
                  </button>
                </div>
                {subscribed && (
                  <div className="ih-subscribe-success">
                    ✓ Thank you for subscribing to Durrani Harvest!
                  </div>
                )}
              </form>

              {/* Social Media Icons with aligned unified SVGs */}
              <div className="ih-social-row">
                {socials.facebook && (
                  <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="ih-social-icon" aria-label="Facebook">
                    <FacebookIcon size={18} />
                  </a>
                )}

                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="ih-social-icon" aria-label="Instagram">
                    <InstagramIcon size={18} />
                  </a>
                )}

                {socials.youtube && (
                  <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="ih-social-icon" aria-label="YouTube">
                    <YoutubeIcon size={18} />
                  </a>
                )}

                {socials.tiktok && (
                  <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="ih-social-icon" aria-label="TikTok">
                    <TiktokIcon size={18} />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Honey Gold Bottom Bar */}
        <div className="ih-bottom-bar">
          <div className="ih-bottom-container">
            <p className="ih-copyright-text">
              Copyright © 2026 <strong>Durrani Harvest</strong>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button (Bottom Left) */}
      <a
        href={waHref(contact.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className="ih-floating-whatsapp"
        title={`Chat on WhatsApp (${contact.whatsapp})`}
        aria-label="Chat on WhatsApp"
      >
        <span className="ih-wa-ping"></span>
        <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.12.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.12-.22-.19-.47-.31z"/>
        </svg>
      </a>
    </>
  );
};

export default Footer;

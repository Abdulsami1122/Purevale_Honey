import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
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
            
            {/* 1. Purevale Brand & Contact Details */}
            <div className="ih-footer-col ih-brand-col">
              <div className="ih-logo-wrapper">
                <Link to="/" className="pv-footer-brand">
                  <img src="/logo.jpeg" alt="Purevale Natural" className="pv-footer-logo-img" />
                  <div className="pv-brand-meta">
                    <span className="pv-brand-name">PUREVALE</span>
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
                    Hayatabad, Peshawar, Pakistan
                  </span>
                </Link>

                <a href="mailto:support@purevale.com" className="ih-contact-item ih-contact-link">
                  <span className="ih-contact-icon">
                    <Mail size={18} strokeWidth={1.8} />
                  </span>
                  <span className="ih-contact-text">support@purevale.com</span>
                </a>

                <a href="tel:+923339300672" className="ih-contact-item ih-contact-link">
                  <span className="ih-contact-icon">
                    <Phone size={18} strokeWidth={1.8} />
                  </span>
                  <span className="ih-contact-text">+92 333 9300672</span>
                </a>

                <a 
                  href="https://wa.me/923339300672" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ih-contact-item ih-contact-link"
                >
                  <span className="ih-contact-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                  </span>
                  <span className="ih-contact-text">0333 9300672 (WhatsApp)</span>
                </a>
              </div>
            </div>

            {/* 2. Categories Column */}
            <div className="ih-footer-col">
              <h3 className="ih-footer-heading">Categories</h3>
              <ul className="ih-footer-links">
                <li><Link to="/honey">Honey Collection</Link></li>
                <li><Link to="/heart-health">Heart Health</Link></li>
                <li><Link to="/shilajit">Herbal Products</Link></li>
                <li><Link to="/honey">Jams</Link></li>
                <li><Link to="/shop">Sauces</Link></li>
                <li><Link to="/dates">Dates</Link></li>
                <li><Link to="/shilajit">Fat Burner</Link></li>
                <li><Link to="/wholesale">Oils</Link></li>
                <li><Link to="/shop">Pickles</Link></li>
              </ul>
            </div>

            {/* 3. Infomation Column */}
            <div className="ih-footer-col">
              <h3 className="ih-footer-heading">Infomation</h3>
              <ul className="ih-footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/faq">FAQ's</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/return-policy">Return Policy</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms and Conditions</Link></li>
              </ul>
            </div>

            {/* 4. Useful links Column */}
            <div className="ih-footer-col">
              <h3 className="ih-footer-heading">Useful links</h3>
              <ul className="ih-footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/heart-health">Explore</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
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
                    ✓ Thank you for subscribing to Purevale!
                  </div>
                )}
              </form>

              {/* Social Media Icons */}
              <div className="ih-social-row">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="ih-social-icon" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ih-social-icon" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>

                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="ih-social-icon" aria-label="YouTube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="ih-social-icon" aria-label="TikTok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.14 1.16 2.05 2.29 2.29.64.13 1.3.09 1.92-.12.87-.29 1.57-.96 1.88-1.82.2-.55.26-1.13.25-1.71l-.03-17.57z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Honey Gold Bottom Bar */}
        <div className="ih-bottom-bar">
          <div className="ih-bottom-container">
            <p className="ih-copyright-text">
              Copyright © 2026 <strong>Purevale Natural</strong>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button (Bottom Left) */}
      <a 
        href="https://wa.me/923339300672" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="ih-floating-whatsapp"
        title="Chat on WhatsApp (0333 9300672)"
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

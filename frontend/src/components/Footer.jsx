import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo footer-logo">
              <span className="logo-text text-white">PUREVALE</span>
              <span className="logo-leaf">🌿</span>
            </div>
            <p className="footer-desc">
              Premium natural products from Pakistan, delivered to the world. Sourced with integrity, verified by science.
            </p>
            <div className="social-links-text">
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#story">Our Story</a></li>
              <li><a href="#quality">Quality & Testing</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Export & Support</h4>
            <ul>
              <li><a href="#wholesale">Wholesale Orders</a></li>
              <li><a href="#">Private Labeling</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Information</h4>
            <ul>
              <li>
                <Mail size={16} className="contact-icon" />
                <span>export@purevale.com</span>
              </li>
              <li>
                <Phone size={16} className="contact-icon" />
                <span>+92 300 000 0000 (WhatsApp)</span>
              </li>
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>Lahore, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Purevale International. All rights reserved.</p>
          <div className="payment-methods">
            {/* Payment method placeholders - would ideally be SVG icons */}
            <span className="payment-icon">Visa</span>
            <span className="payment-icon">Mastercard</span>
            <span className="payment-icon">Wire Transfer</span>
            <span className="payment-icon">LC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

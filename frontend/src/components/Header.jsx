import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ShoppingBag } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide if scrolling down and past 100px, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`header ${isVisible ? '' : 'header-hidden'}`}>
      <div className="container header-content">
        <a href="#home" className="logo">
          <img src="/logo.jpeg" alt="Durrani Harvest" className="logo-img" />
          <span className="logo-text">DURRANI HARVEST</span>
        </a>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#wholesale">Wholesale & Export</a>
          <a href="#story">Our Story</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <div className="currency-selector">
            <Globe size={18} />
            <select>
              <option>USD ($)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          <button className="btn btn-outline btn-sm">Enquire Now</button>
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

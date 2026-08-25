import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Apple,
  Container,
  Croissant,
  FlaskConical,
  Gem,
  Gift,
  Heart,
  Leaf,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from './BrandIcons'
import { useShop } from './ShopContext'
import './ShopHeader.css'

const NAV_ITEMS = [
  { label: 'Shop', icon: ShoppingBag, href: '/shop' },
  { label: 'Pure Honey', icon: Gem, badge: 'premium', badgeTone: 'cyan', href: '/honey' },
  { label: 'Heart Health', icon: Heart, href: '/heart-health' },
  { label: 'Honey Jams', icon: Apple, badge: 'new', badgeTone: 'amber', href: '/honey' },
  { label: 'Dates', icon: Gift, badge: 'Fresh', badgeTone: 'green', href: '/dates' },
  { label: 'Shilajit', icon: Leaf, badge: 'new', badgeTone: 'amber', href: '/shilajit' },
  { label: 'Oils & Ghee', icon: FlaskConical, href: '/wholesale' },
  { label: 'Pickles', icon: Container, badge: 'EVOO', badgeTone: 'red', href: '/shop' },
  { label: 'Breakfast', icon: Croissant, hideIcon: true, href: '/shop' },
]

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YoutubeIcon },
  { label: 'TikTok', href: 'https://tiktok.com', Icon: TiktokIcon },
]

const ShopHeader = () => {
  const [announcementOpen, setAnnouncementOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { wishlist, cartCount } = useShop()
  const location = useLocation()

  return (
    <header className="shop-header">
      {announcementOpen && (
        <div className="announcement-bar">
          <p className="announcement-text">Welcome to Purevale Natural • 100% Pure Raw Honey & Wellness</p>
          <button
            type="button"
            className="announcement-close"
            onClick={() => setAnnouncementOpen(false)}
          >
            <X size={20} strokeWidth={2.2} />
            close
          </button>
        </div>
      )}

      <div className="info-bar">
        <a className="info-phone" href="tel:+923339300672">
          <Phone size={17} strokeWidth={1.8} />
          +92 333 9300672
        </a>

        <p className="info-message">
          Premium natural products, sourced with <span>PUREVALE</span> integrity
        </p>

        <div className="info-socials">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>

      <div className="nav-bar">
        <Link className="brand" to="/">
          <img className="brand-seal" src="/logo.jpeg" alt="Purevale" />
          <span className="brand-word">
            <span className="brand-word-main">PUREVALE</span>
            <span className="brand-word-sub">N A T U R A L</span>
          </span>
        </Link>

        <nav className={`shop-nav ${mobileNavOpen ? 'is-open' : ''}`}>
          {NAV_ITEMS.map(({ label, icon: Icon, badge, badgeTone, hideIcon, href }) => {
            const isActive = location.pathname === href
            return (
              <Link 
                key={label} 
                className={`shop-nav-link ${isActive ? 'is-active' : ''}`} 
                to={href}
                onClick={() => setMobileNavOpen(false)}
              >
                {!hideIcon && <Icon size={22} strokeWidth={1.6} />}
                {label}
                {badge && <span className={`nav-badge nav-badge-${badgeTone}`}>{badge}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="nav-actions">
          <Link to="/shop" aria-label="Search" className="nav-action-btn">
            <Search size={24} strokeWidth={1.6} />
          </Link>
          <Link to="/contact" aria-label="Account" className="nav-action-btn">
            <User size={24} strokeWidth={1.6} />
          </Link>
          <Link to="/shop" aria-label="Wishlist" className="nav-action-counted">
            <Heart size={24} strokeWidth={1.6} />
            <span className="nav-count">{wishlist.size}</span>
          </Link>
          <Link to="/shop" aria-label="Cart" className="nav-action-counted">
            <ShoppingCart size={24} strokeWidth={1.6} />
            <span className="nav-count">{cartCount}</span>
          </Link>
          <button
            type="button"
            className="nav-burger"
            aria-label="Menu"
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default ShopHeader

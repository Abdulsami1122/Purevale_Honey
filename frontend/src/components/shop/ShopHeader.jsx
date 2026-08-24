import React, { useState } from 'react'
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
  { label: 'Shop', icon: ShoppingBag, href: '#products' },
  { label: 'Pure Honey', icon: Gem, badge: 'premium', badgeTone: 'cyan', href: '#honey-collection' },
  { label: 'Heart Health', icon: Heart, href: '#quality' },
  { label: 'Honey Jams', icon: Apple, badge: 'new', badgeTone: 'amber', href: '#honey-collection' },
  { label: 'Dates', icon: Gift, badge: 'Fresh', badgeTone: 'green', href: '#dates' },
  { label: 'Shilajit', icon: Leaf, badge: 'new', badgeTone: 'amber', href: '#shilajit' },
  { label: 'Oils & Ghee', icon: FlaskConical, href: '#wholesale' },
  { label: 'Pickles', icon: Container, badge: 'EVOO', badgeTone: 'red', href: '#products' },
  { label: 'Breakfast', icon: Croissant, hideIcon: true, href: '#products' },
]

const SOCIALS = [
  { label: 'Facebook', href: '#facebook', Icon: FacebookIcon },
  { label: 'Instagram', href: '#instagram', Icon: InstagramIcon },
  { label: 'YouTube', href: '#youtube', Icon: YoutubeIcon },
  { label: 'TikTok', href: '#tiktok', Icon: TiktokIcon },
]

const ShopHeader = () => {
  const [announcementOpen, setAnnouncementOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { wishlist, cartCount } = useShop()

  return (
    <header className="shop-header">
      {announcementOpen && (
        <div className="announcement-bar">
          <p className="announcement-text">Welcome to Purevale</p>
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
        <a className="info-phone" href="tel:+923000000000">
          <Phone size={17} strokeWidth={1.8} />
          +92 300 000 0000
        </a>

        <p className="info-message">
          Premium natural products, sourced with <span>PUREVALE</span> integrity
        </p>

        <div className="info-socials">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a key={label} href={href} aria-label={label}>
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>

      <div className="nav-bar">
        <a className="brand" href="#home">
          <img className="brand-seal" src="/logo.jpeg" alt="Purevale" />
          <span className="brand-word">
            <span className="brand-word-main">PUREVALE</span>
            <span className="brand-word-sub">N A T U R A L</span>
          </span>
        </a>

        <nav className={`shop-nav ${mobileNavOpen ? 'is-open' : ''}`}>
          {NAV_ITEMS.map(({ label, icon: Icon, badge, badgeTone, hideIcon, href }) => (
            <a key={label} className="shop-nav-link" href={href}>
              {!hideIcon && <Icon size={22} strokeWidth={1.6} />}
              {label}
              {badge && <span className={`nav-badge nav-badge-${badgeTone}`}>{badge}</span>}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button type="button" aria-label="Search">
            <Search size={24} strokeWidth={1.6} />
          </button>
          <button type="button" aria-label="Account">
            <User size={24} strokeWidth={1.6} />
          </button>
          <button type="button" aria-label="Wishlist" className="nav-action-counted">
            <Heart size={24} strokeWidth={1.6} />
            <span className="nav-count">{wishlist.size}</span>
          </button>
          <button type="button" aria-label="Cart" className="nav-action-counted">
            <ShoppingCart size={24} strokeWidth={1.6} />
            <span className="nav-count">{cartCount}</span>
          </button>
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

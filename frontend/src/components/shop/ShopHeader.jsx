import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  ShoppingBag,
  Gem,
  Gift,
  Cookie,
  Mountain,
  Sparkles,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Heart,
  User,
  X,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from './BrandIcons'
import { useShop } from './ShopContext'
import './ShopHeader.css'

// 1. Home -> 2. Shop -> 3. Pure Honney [premium] -> 4. Dates [Fresh] -> 5. Jaggery (Gur) [Natural] -> 6. Shilajit [Gold] -> 7. Cosmetics [new]
const NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Shop', icon: ShoppingBag, href: '/shop' },
  { label: 'Pure Honey', icon: Gem, badge: 'premium', badgeTone: 'cyan', href: '/honey' },
  { label: 'Dates', icon: Gift, badge: 'Fresh', badgeTone: 'green', href: '/dates' },
  { label: 'Jaggery (Gur)', icon: Cookie, badge: 'Natural', badgeTone: 'amber', href: '/jaggery' },
  { label: 'Shilajit', icon: Mountain, badge: 'Gold', badgeTone: 'cyan', href: '/shilajit' },
  { label: 'Cosmetics', icon: Sparkles, badge: 'new', badgeTone: 'amber', href: '/cosmetics' },
]

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YoutubeIcon },
  { label: 'TikTok', href: 'https://tiktok.com', Icon: TiktokIcon },
]

const ANNOUNCEMENT_MESSAGES = [
  'Welcome to Purevale Natural',
  'Limited Time Offer Upto 25% Off '
]

const ShopHeader = () => {
  const [announcementOpen, setAnnouncementOpen] = useState(true)
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [scrollState, setScrollState] = useState('top') // 'top' | 'down' | 'up'
  const { wishlist, cartCount } = useShop()
  const location = useLocation()

  // Rotate announcement message every 4 seconds
  useEffect(() => {
    if (!announcementOpen) return
    const timer = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [announcementOpen])

  // Smart Scroll Handler:
  // - Scrolling Down: Hides header completely
  // - Scrolling Up: Reveals ONLY the Nav Bar
  // - At Top: Shows full header
  useEffect(() => {
    let lastScrollY = window.pageYOffset

    const handleScroll = () => {
      const scrollY = window.pageYOffset

      if (scrollY <= 60) {
        setScrollState('top')
        lastScrollY = scrollY
        return
      }

      const diff = scrollY - lastScrollY

      if (Math.abs(diff) < 8) return

      if (diff > 0 && scrollY > 120) {
        setScrollState('down')
      } else if (diff < 0) {
        setScrollState('up')
      }

      lastScrollY = scrollY > 0 ? scrollY : 0
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('handleScroll', handleScroll)
  }, [])

  return (
    <header className={`shop-header header-scroll-${scrollState}`}>
      {/* 1. Top Announcement Bar */}
      {announcementOpen && (
        <div className="announcement-bar">
          <div className="announcement-slider-wrap">
            <p key={currentMsgIndex} className="announcement-text animate-slide-right">
              {ANNOUNCEMENT_MESSAGES[currentMsgIndex]}
            </p>
          </div>
          <button
            type="button"
            className="announcement-close"
            onClick={() => setAnnouncementOpen(false)}
            aria-label="Close announcement"
          >
            <X size={16} strokeWidth={2.2} />
            <span>close</span>
          </button>
        </div>
      )}

      {/* 2. Middle Info Bar */}
      <div className="info-bar">
        <a className="info-phone" href="tel:+923339300672">
          <Phone size={16} strokeWidth={1.8} />
          <span>+92 3339300672</span>
        </a>

        <p className="info-message">
          <strong>Purevale Honey</strong> is now <strong>PUREVALE NATURAL</strong>
        </p>

        <div className="info-socials">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
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
                {!hideIcon && <Icon size={20} strokeWidth={1.7} className="shop-nav-icon" />}
                <span className="shop-nav-text">{label}</span>
                {badge && <span className={`nav-badge nav-badge-${badgeTone}`}>{badge}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="nav-actions">
          <Link to="/shop" aria-label="Search" className="nav-action-btn">
            <Search size={22} strokeWidth={1.6} />
          </Link>
          <Link to="/contact" aria-label="Account" className="nav-action-btn">
            <User size={22} strokeWidth={1.6} />
          </Link>
          <Link to="/shop" aria-label="Wishlist" className="nav-action-counted">
            <Heart size={22} strokeWidth={1.6} />
            <span className="nav-count">{wishlist.size}</span>
          </Link>
          <Link to="/shop" aria-label="Cart" className="nav-action-counted">
            <ShoppingCart size={22} strokeWidth={1.6} />
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

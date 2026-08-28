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
  Mail,
  Search,
  ShoppingCart,
  Heart,
  User,
  X,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from './BrandIcons'
import { useShop } from './ShopContext'
import AuthDrawer from './AuthDrawer'
import SearchDrawer from './SearchDrawer'
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
  const [authOpen, setAuthOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrollState, setScrollState] = useState('top') // 'top' | 'down' | 'up'
  const { wishlist, cartCount } = useShop()
  const location = useLocation()

  const navLinks = NAV_ITEMS.map(({ label, icon: Icon, badge, badgeTone, hideIcon, href }) => (
    <Link
      key={label}
      className={`shop-nav-link ${location.pathname === href ? 'is-active' : ''}`}
      to={href}
      onClick={() => setMobileNavOpen(false)}
    >
      {!hideIcon && <Icon size={20} strokeWidth={1.7} className="shop-nav-icon" />}
      <span className="shop-nav-text">{label}</span>
      {badge && <span className={`nav-badge nav-badge-${badgeTone}`}>{badge}</span>}
    </Link>
  ))

  // Lock scrolling when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.classList.add('auth-drawer-open')
      document.documentElement.classList.add('auth-drawer-open')
    } else if (!authOpen && !searchOpen) {
      document.body.classList.remove('auth-drawer-open')
      document.documentElement.classList.remove('auth-drawer-open')
    }
  }, [mobileNavOpen])

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
    <>
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

          <nav className="shop-nav">
            <div className="mobile-nav-links">{navLinks}</div>
          </nav>

          <div className="nav-actions">
            <button type="button" aria-label="Search" className="nav-action-btn" onClick={() => setSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
              <Search size={22} strokeWidth={1.6} />
            </button>
            <button type="button" aria-label="Account" className="nav-action-btn" onClick={() => setAuthOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
              <User size={22} strokeWidth={1.6} />
            </button>
            <Link to="/shop" aria-label="Wishlist" className="nav-action-counted nav-action-wishlist">
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
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav" aria-label="Primary mobile navigation">
        <Link
          to="/"
          className={`bottom-nav-item ${location.pathname === '/' ? 'is-active' : ''}`}
        >
          <Home size={22} strokeWidth={1.7} />
          <span>Home</span>
        </Link>
        <Link
          to="/shop"
          className={`bottom-nav-item ${location.pathname === '/shop' ? 'is-active' : ''}`}
        >
          <ShoppingBag size={22} strokeWidth={1.7} />
          <span>Shop</span>
        </Link>
        <Link to="/shop" className="bottom-nav-item" aria-label="Wishlist">
          <span className="bottom-nav-icon">
            <Heart size={22} strokeWidth={1.7} />
            {wishlist.size > 0 && <span className="bottom-nav-count">{wishlist.size}</span>}
          </span>
          <span>Wishlist</span>
        </Link>
        <Link to="/shop" className="bottom-nav-item" aria-label="Cart">
          <span className="bottom-nav-icon">
            <ShoppingCart size={22} strokeWidth={1.7} />
            {cartCount > 0 && <span className="bottom-nav-count">{cartCount}</span>}
          </span>
          <span>Cart</span>
        </Link>
        <button
          type="button"
          className="bottom-nav-item"
          onClick={() => setAuthOpen(true)}
        >
          <User size={22} strokeWidth={1.7} />
          <span>Account</span>
        </button>
      </nav>

      {/* Mobile Menu Drawer (rendered outside the header, closes on outside click) */}
      {mobileNavOpen && (
        <>
          <div className="mobile-nav-backdrop" onClick={() => setMobileNavOpen(false)}></div>
          <div className="mobile-nav-drawer is-open">
            <div className="mobile-nav-header">
              <h2>MENU</h2>
              <button
                type="button"
                className="mobile-nav-close"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="mobile-nav-links">{navLinks}</div>

            <div className="mobile-nav-contact">
              <a className="mobile-nav-contact-item" href="tel:+923339300672">
                <Phone size={18} strokeWidth={1.7} />
                <span>+92 3339300672</span>
              </a>
              <a className="mobile-nav-contact-item" href="mailto:support@purevale.com">
                <Mail size={18} strokeWidth={1.7} />
                <span>support@purevale.com</span>
              </a>
            </div>
          </div>
        </>
      )}

      <AuthDrawer isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <SearchDrawer isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

export default ShopHeader

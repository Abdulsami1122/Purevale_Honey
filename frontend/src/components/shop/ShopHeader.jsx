import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  Tag,
  Package,
  LogOut,
  X,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from './BrandIcons'
import { useShop } from './ShopContext'
import { useAdminAuth } from '../../admin/AdminAuthContext'
import { DEFAULT_SITE_SETTINGS, telHref } from '../../lib/siteSettings'
import AuthDrawer from './AuthDrawer'
import SearchDrawer from './SearchDrawer'
import CartDrawer from './CartDrawer'
import './ShopHeader.css'

// Home and Shop are always present; the category links after them are
// admin-managed (Site Content → Navigation categories).
const STATIC_NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Shop', icon: ShoppingBag, href: '/shop' },
]

// Icon names the admin can pick for a nav category -> lucide component
const NAV_ICONS = { Gem, Gift, Cookie, Mountain, Sparkles, ShoppingBag, Home, Tag }

const SOCIAL_ICONS = [
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'youtube', label: 'YouTube', Icon: YoutubeIcon },
  { key: 'tiktok', label: 'TikTok', Icon: TiktokIcon },
]

const ShopHeader = () => {
  const [announcementOpen, setAnnouncementOpen] = useState(true)
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [scrollState, setScrollState] = useState('top') // 'top' | 'down' | 'up'
  const { wishlist, cartCount, siteSettings, authDrawerOpen, openAuthDrawer, closeAuthDrawer } = useShop()
  const { isAuthed, user, logout } = useAdminAuth()
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Close the account dropdown on outside click or route change
  useEffect(() => setAccountMenuOpen(false), [location.pathname])
  useEffect(() => {
    if (!accountMenuOpen) return
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [accountMenuOpen])

  const handleLogout = async () => {
    setAccountMenuOpen(false)
    await logout()
    navigate('/')
  }

  const handleAccountClick = () => {
    if (isAuthed) setAccountMenuOpen((v) => !v)
    else openAuthDrawer()
  }

  const firstName = (user?.name || '').trim().split(/\s+/)[0] || 'Account'

  const announcements =
    Array.isArray(siteSettings?.announcements) && siteSettings.announcements.filter(Boolean).length
      ? siteSettings.announcements.filter(Boolean)
      : DEFAULT_SITE_SETTINGS.announcements

  const contact = { ...DEFAULT_SITE_SETTINGS.contact, ...(siteSettings?.contact || {}) }
  const socials = { ...DEFAULT_SITE_SETTINGS.socials, ...(siteSettings?.socials || {}) }

  // Built-in categories are fixed (but can be switched off by href); admin-added
  // ones are appended after them and can carry enabled:false.
  const disabledCats = new Set(
    Array.isArray(siteSettings?.disabledCategories) ? siteSettings.disabledCategories : [],
  )
  const extraCategories = (
    Array.isArray(siteSettings?.extraNavCategories) ? siteSettings.extraNavCategories : []
  ).filter((c) => c && c.enabled !== false)
  const categoryItems = [
    ...DEFAULT_SITE_SETTINGS.navCategories.filter((c) => !disabledCats.has(c.href)),
    ...extraCategories,
  ]

  const navItems = [
    ...STATIC_NAV_ITEMS,
    ...categoryItems
      .filter((c) => c && c.label && c.href)
      .map((c) => ({
        label: c.label,
        href: c.href,
        icon: NAV_ICONS[c.icon] || Tag,
        badge: c.badge,
        badgeTone: c.badgeTone || 'green',
      })),
  ]

  const navLinks = navItems.map(({ label, icon: Icon, badge, badgeTone, hideIcon, href }) => (
    <Link
      key={label}
      className={`shop-nav-link ${location.pathname === href ? 'is-active' : ''}`}
      to={href}
      onClick={() => setMobileNavOpen(false)}
    >
      {!hideIcon && Icon && <Icon size={20} strokeWidth={1.7} className="shop-nav-icon" />}
      <span className="shop-nav-text">{label}</span>
      {badge && <span className={`nav-badge nav-badge-${badgeTone}`}>{badge}</span>}
    </Link>
  ))

  // Lock scrolling when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.classList.add('auth-drawer-open')
      document.documentElement.classList.add('auth-drawer-open')
    } else if (!authDrawerOpen && !searchOpen && !cartOpen) {
      document.body.classList.remove('auth-drawer-open')
      document.documentElement.classList.remove('auth-drawer-open')
    }
  }, [mobileNavOpen])

  // Rotate announcement message every 4 seconds
  useEffect(() => {
    if (!announcementOpen || announcements.length < 2) return
    const timer = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [announcementOpen, announcements.length])

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
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`shop-header header-scroll-${scrollState}`}>
        {/* 1. Top Announcement Bar */}
        {announcementOpen && (
          <div className="announcement-bar">
            <div className="announcement-slider-wrap">
              <p key={currentMsgIndex} className="announcement-text animate-slide-right">
                {announcements[currentMsgIndex % announcements.length]}
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
          <a className="info-phone" href={telHref(contact.phone)}>
            <Phone size={16} strokeWidth={1.8} />
            <span>{contact.phone}</span>
          </a>

          <p className="info-message">
            <strong>DURRANI HARVEST</strong> — Natural · Pure · Premium
          </p>

          <div className="info-socials">
            {SOCIAL_ICONS.filter(({ key }) => socials[key]).map(({ key, label, Icon }) => (
              <a key={key} href={socials[key]} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* 3. Main Navigation Bar */}
        <div className="nav-bar">
          <Link className="brand" to="/">
            <img className="brand-seal" src="/logo.png" alt="Durrani Harvest" />
            <span className="brand-word">
              <span className="brand-word-main">DURRANI</span>
              <span className="brand-word-sub">H A R V E S T</span>
            </span>
          </Link>

          <nav className="shop-nav">
            <div className="mobile-nav-links">{navLinks}</div>
          </nav>

          <div className="nav-actions">
            <button type="button" aria-label="Search" className="nav-action-btn" onClick={() => setSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
              <Search size={22} strokeWidth={1.6} />
            </button>
            <div className="account-wrap" ref={accountRef}>
              <button
                type="button"
                aria-label="Account"
                className={`nav-action-btn account-btn ${isAuthed ? 'is-authed' : ''}`}
                onClick={handleAccountClick}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <User size={22} strokeWidth={1.6} />
              </button>

              {isAuthed && accountMenuOpen && (
                <div className="account-menu" role="menu">
                  <div className="account-menu-head">
                    <span className="account-menu-name">{user?.name || 'Account'}</span>
                    <span className="account-menu-email">{user?.email}</span>
                  </div>
                  {user?.role === 'admin' ? (
                    <Link to="/admin" className="account-menu-item" role="menuitem">
                      <Package size={16} strokeWidth={1.8} /> Admin dashboard
                    </Link>
                  ) : (
                    <Link to="/orders" className="account-menu-item" role="menuitem">
                      <Package size={16} strokeWidth={1.8} /> My orders
                    </Link>
                  )}
                  <button type="button" className="account-menu-item account-menu-logout" onClick={handleLogout} role="menuitem">
                    <LogOut size={16} strokeWidth={1.8} /> Log out
                  </button>
                </div>
              )}
            </div>
            <Link to="/wishlist" aria-label="Wishlist" className="nav-action-counted nav-action-wishlist">
              <Heart size={22} strokeWidth={1.6} />
              <span className="nav-count">{wishlist.size}</span>
            </Link>
            <button
              type="button"
              aria-label="Cart"
              className="nav-action-counted"
              onClick={() => setCartOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
            >
              <ShoppingCart size={22} strokeWidth={1.6} />
              <span className="nav-count">{cartCount}</span>
            </button>
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
        <Link
          to="/wishlist"
          className={`bottom-nav-item ${location.pathname === '/wishlist' ? 'is-active' : ''}`}
          aria-label="Wishlist"
        >
          <span className="bottom-nav-icon">
            <Heart size={22} strokeWidth={1.7} />
            {wishlist.size > 0 && <span className="bottom-nav-count">{wishlist.size}</span>}
          </span>
          <span>Wishlist</span>
        </Link>
        <button type="button" className="bottom-nav-item" aria-label="Cart" onClick={() => setCartOpen(true)}>
          <span className="bottom-nav-icon">
            <ShoppingCart size={22} strokeWidth={1.7} />
            {cartCount > 0 && <span className="bottom-nav-count">{cartCount}</span>}
          </span>
          <span>Cart</span>
        </button>
        {isAuthed ? (
          <Link
            to={user?.role === 'admin' ? '/admin' : '/orders'}
            className={`bottom-nav-item is-authed ${
              location.pathname === (user?.role === 'admin' ? '/admin' : '/orders') ? 'is-active' : ''
            }`}
          >
            <User size={22} strokeWidth={1.7} />
            <span>{firstName}</span>
          </Link>
        ) : (
          <button type="button" className="bottom-nav-item" onClick={openAuthDrawer}>
            <User size={22} strokeWidth={1.7} />
            <span>Account</span>
          </button>
        )}
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

            {isAuthed && (
              <div className="mobile-nav-account">
                <p className="mobile-nav-account-name">{user?.name}</p>
                {user?.role === 'admin' ? (
                  <Link to="/admin" className="mobile-nav-contact-item" onClick={() => setMobileNavOpen(false)}>
                    <Package size={18} strokeWidth={1.7} />
                    <span>Admin dashboard</span>
                  </Link>
                ) : (
                  <Link to="/orders" className="mobile-nav-contact-item" onClick={() => setMobileNavOpen(false)}>
                    <Package size={18} strokeWidth={1.7} />
                    <span>My orders</span>
                  </Link>
                )}
                <button
                  type="button"
                  className="mobile-nav-contact-item"
                  onClick={() => { setMobileNavOpen(false); handleLogout() }}
                >
                  <LogOut size={18} strokeWidth={1.7} />
                  <span>Log out</span>
                </button>
              </div>
            )}

            <div className="mobile-nav-contact">
              <a className="mobile-nav-contact-item" href={telHref(contact.phone)}>
                <Phone size={18} strokeWidth={1.7} />
                <span>{contact.phone}</span>
              </a>
              <a className="mobile-nav-contact-item" href={`mailto:${contact.email}`}>
                <Mail size={18} strokeWidth={1.7} />
                <span>{contact.email}</span>
              </a>
            </div>
          </div>
        </>
      )}

      <AuthDrawer isOpen={authDrawerOpen} onClose={closeAuthDrawer} />
      <SearchDrawer isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default ShopHeader

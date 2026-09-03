// Front-end fallback copy of the editable site content. Used for the first
// paint (and when the API is unreachable) before GET /api/settings resolves.
// The server owns the source of truth in backend/src/routes/settings.routes.js.
export const DEFAULT_SITE_SETTINGS = {
  announcements: [
    'Welcome to Durrani Harvest',
    'Limited Time Offer Upto 25% Off',
  ],
  hero: {
    videoUrl: '/banner-vedio.mp4',
    subtitle: 'Pure Nature. Trusted Worldwide.',
    title: 'Nature, Sourced with Integrity.',
    description: 'Premium natural products from Pakistan, delivered to the world.',
  },
  // Built-in nav categories — always shown, not editable from admin.
  navCategories: [
    { label: 'Pure Honey', href: '/honey', icon: 'Gem', badge: 'premium', badgeTone: 'cyan' },
    { label: 'Dates', href: '/dates', icon: 'Gift', badge: 'Fresh', badgeTone: 'green' },
    { label: 'Jaggery (Gur)', href: '/jaggery', icon: 'Cookie', badge: 'Natural', badgeTone: 'amber' },
    { label: 'Shilajit', href: '/shilajit', icon: 'Mountain', badge: 'Gold', badgeTone: 'cyan' },
    { label: 'Cosmetics', href: '/cosmetics', icon: 'Sparkles', badge: 'new', badgeTone: 'amber' },
  ],
  // Admin-added categories — appended after the built-ins. May carry `enabled: false`.
  extraNavCategories: [],
  // hrefs of built-in categories the admin has switched off.
  disabledCategories: [],
  story: {
    image: '/hero-bg.jpg',
  },
  contact: {
    phone: '+92 333 9300672',
    whatsapp: '923339300672',
    email: 'support@durraniharvest.com',
    address: 'Hayatabad, Peshawar, Khyber Pakhtunkhwa, Pakistan',
  },
  socials: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    tiktok: 'https://tiktok.com',
  },
}

// Digits-only phone, usable in a tel: href.
export const telHref = (value) => `tel:${String(value || '').replace(/[^\d+]/g, '')}`

// Normalises a WhatsApp number (digits only) into a wa.me URL.
export const waHref = (value) => `https://wa.me/${String(value || '').replace(/\D/g, '')}`

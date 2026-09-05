import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  honeyProducts,
  datesProducts,
  jaggeryProducts,
  shilajitProducts,
  cosmeticsProducts,
} from '../../data/products'
import api from '../../lib/api'
import { DEFAULT_SITE_SETTINGS } from '../../lib/siteSettings'

const ShopContext = createContext(null)

// Base catalogue shipped with the app, keyed by collection slug
const BASE_COLLECTIONS = {
  honey: honeyProducts,
  dates: datesProducts,
  jaggery: jaggeryProducts,
  shilajit: shilajitProducts,
  cosmetics: cosmeticsProducts,
}

export const COLLECTION_KEYS = Object.keys(BASE_COLLECTIONS)

// "Achar Special" -> "achar-special"
export const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// Map a backend category name to one of the 5 storefront collection slugs.
const toCollectionKey = (name = '') => {
  const n = String(name).toLowerCase()
  return COLLECTION_KEYS.find((k) => n.includes(k)) || 'honey'
}

// Backend product -> the shape the storefront components expect.
const adaptProduct = (p) => {
  const variantObjs = Array.isArray(p.variants) ? p.variants : []
  const categoryName = p.category?.name || ''
  return {
    id: p.id,
    title: p.name,
    description: p.description || '',
    image: (p.images && p.images[0]) || '/honey-jar.jpg',
    images: Array.isArray(p.images) ? p.images : [],
    priceMin: Number(p.price) || 0,
    priceMax: null,
    compareAt: null,
    discountPercent: Number(p.discountPercent) || 0,
    rating: Number(p.rating) || p.ratingAverage || 0,
    reviews: Number(p.reviewCount) || p._count?.reviews || p.ratingCount || 0,
    available: (p.stock ?? 0) > 0,
    stock: p.stock ?? 0,
    variants: variantObjs.length
      ? variantObjs.map((v) => (typeof v === 'string' ? v : v.label)).filter(Boolean)
      : ['Default'],
    variantPrices: Object.fromEntries(
      variantObjs
        .filter((v) => v && typeof v === 'object' && v.price != null)
        .map((v) => [v.label, Number(v.price)]),
    ),
    collection: toCollectionKey(categoryName),
    categoryId: p.categoryId || p.category?.id || null,
    categoryName,
    categorySlug: slugify(categoryName),
    featured: 0,
  }
}

const WISHLIST_STORAGE_KEY = 'purevale_wishlist'
const CART_STORAGE_KEY = 'purevale_cart'
const PRODUCTS_CACHE_KEY = 'dh_products_cache_v3'
const SITE_SETTINGS_CACHE_KEY = 'dh_site_settings_cache'

const readCachedSiteSettings = () => {
  try {
    const raw = localStorage.getItem(SITE_SETTINGS_CACHE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? { ...DEFAULT_SITE_SETTINGS, ...parsed } : DEFAULT_SITE_SETTINGS
  } catch {
    return DEFAULT_SITE_SETTINGS
  }
}

const readStoredWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY)
    const ids = raw ? JSON.parse(raw) : []
    return Array.isArray(ids) ? new Set(ids) : new Set()
  } catch {
    return new Set()
  }
}

const readStoredCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    const items = raw ? JSON.parse(raw) : []
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

// Last successful product fetch — lets the storefront keep working if the API
// is briefly unreachable.
const readCachedProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY)
    const items = raw ? JSON.parse(raw) : []
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export const ShopProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(readStoredWishlist)
  const [cart, setCart] = useState(readStoredCart)
  const [adminProducts, setAdminProducts] = useState(readCachedProducts)
  const [siteSettings, setSiteSettings] = useState(readCachedSiteSettings)
  // Lets any component (e.g. the home page testimonials CTA) open the header's
  // sign-in drawer without prop-drilling.
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false)
  const openAuthDrawer = useCallback(() => setAuthDrawerOpen(true), [])
  const closeAuthDrawer = useCallback(() => setAuthDrawerOpen(false), [])

  // Keep the wishlist so it survives a page reload
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([...wishlist]))
    } catch {
      /* storage unavailable (private mode / quota) — ignore */
    }
  }, [wishlist])

  // Persist the cart the same way
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      /* ignore */
    }
  }, [cart])

  // Load the catalogue from the backend and normalise it for the storefront.
  const refreshProducts = useCallback(async () => {
    try {
      const res = await api.listProducts({ limit: 200 })
      const rows = (res.items || []).map(adaptProduct)
      setAdminProducts(rows)
      try {
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(rows))
      } catch {
        /* ignore */
      }
      return rows
    } catch {
      // keep whatever we already have (cache / previous fetch)
      return null
    }
  }, [])

  useEffect(() => {
    refreshProducts()
  }, [refreshProducts])

  // Load admin-managed site content (announcement bar, hero, nav categories,
  // story image, contact + socials)
  const refreshSiteSettings = useCallback(async () => {
    try {
      const data = await api.getSiteSettings()
      const next = { ...DEFAULT_SITE_SETTINGS, ...data }
      setSiteSettings(next)
      try {
        localStorage.setItem(SITE_SETTINGS_CACHE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    refreshSiteSettings()
  }, [refreshSiteSettings])

  const toggleWishlist = useCallback((id) => {
    setWishlist((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // addToCart(product, { variant, price, quantity })
  const addToCart = useCallback((product, options = {}) => {
    const { variant = null, price, quantity = 1 } = options
    if (!product) return
    const lineId = `${product.id}::${variant ?? 'default'}`
    const unitPrice = typeof price === 'number' ? price : product.priceMin

    setCart((current) => {
      const existing = current.find((item) => item.lineId === lineId)
      if (existing) {
        return current.map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [
        ...current,
        {
          lineId,
          productId: product.id,
          title: product.title,
          image: product.image,
          variant,
          price: unitPrice,
          quantity,
        },
      ]
    })
  }, [])

  const updateCartQuantity = useCallback((lineId, quantity) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.lineId !== lineId)
        : current.map((item) => (item.lineId === lineId ? { ...item, quantity } : item)),
    )
  }, [])

  const removeFromCart = useCallback((lineId) => {
    setCart((current) => current.filter((item) => item.lineId !== lineId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  // Catalogue grouped by collection slug. Backend products are the source of
  // truth; the shipped static catalogue is only a fallback when the API has
  // returned nothing yet (first load offline).
  const collections = useMemo(() => {
    const grouped = {}
    for (const key of COLLECTION_KEYS) grouped[key] = []
    if (adminProducts.length === 0) {
      for (const key of COLLECTION_KEYS) grouped[key] = [...BASE_COLLECTIONS[key]]
      return grouped
    }
    for (const p of adminProducts) {
      const key = COLLECTION_KEYS.includes(p.collection) ? p.collection : 'honey'
      grouped[key].push(p)
    }
    return grouped
  }, [adminProducts])

  const allProducts = useMemo(
    () => COLLECTION_KEYS.flatMap((key) => collections[key]),
    [collections],
  )

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  )

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  )

  // Full product objects for everything currently wishlisted
  const wishlistProducts = useMemo(
    () => allProducts.filter((product) => wishlist.has(product.id)),
    [wishlist, allProducts],
  )

  const value = useMemo(
    () => ({
      wishlist,
      wishlistProducts,
      toggleWishlist,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      collections,
      allProducts,
      adminProducts,
      refreshProducts,
      siteSettings,
      refreshSiteSettings,
      authDrawerOpen,
      openAuthDrawer,
      closeAuthDrawer,
    }),
    [
      wishlist,
      wishlistProducts,
      toggleWishlist,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      collections,
      allProducts,
      adminProducts,
      refreshProducts,
      siteSettings,
      refreshSiteSettings,
      authDrawerOpen,
      openAuthDrawer,
      closeAuthDrawer,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used inside a ShopProvider')
  return context
}

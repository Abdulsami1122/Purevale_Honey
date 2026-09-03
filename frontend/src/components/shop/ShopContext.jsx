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

const WISHLIST_STORAGE_KEY = 'purevale_wishlist'
const CART_STORAGE_KEY = 'purevale_cart'
const PRODUCTS_CACHE_KEY = 'dh_products_cache'
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

  // Load admin-managed products from the backend
  const refreshProducts = useCallback(async () => {
    try {
      const rows = await api.listProducts()
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

  // Base catalogue + admin products, grouped by collection slug
  const collections = useMemo(() => {
    const merged = {}
    for (const key of COLLECTION_KEYS) merged[key] = [...BASE_COLLECTIONS[key]]
    for (const p of adminProducts) {
      const key = COLLECTION_KEYS.includes(p.collection) ? p.collection : 'honey'
      merged[key] = [...merged[key], p]
    }
    return merged
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
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used inside a ShopProvider')
  return context
}

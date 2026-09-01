import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  honeyProducts,
  datesProducts,
  jaggeryProducts,
  shilajitProducts,
  cosmeticsProducts,
} from '../../data/products'

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
const CUSTOM_PRODUCTS_STORAGE_KEY = 'purevale_custom_products'

const readStoredCustomProducts = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_STORAGE_KEY)
    const items = raw ? JSON.parse(raw) : []
    return Array.isArray(items) ? items : []
  } catch {
    return []
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

export const ShopProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(readStoredWishlist)
  const [cart, setCart] = useState(readStoredCart)
  const [customProducts, setCustomProducts] = useState(readStoredCustomProducts)

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

  // Persist admin-added products
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(customProducts))
    } catch {
      /* ignore */
    }
  }, [customProducts])

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

  // ---- Admin: add / remove products (stored in this browser only) ----
  const addCustomProduct = useCallback((draft) => {
    const slug =
      (draft.title || 'product')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'product'

    const product = {
      id: `custom-${slug}-${Date.now()}`,
      title: draft.title?.trim() || 'Untitled Product',
      collection: COLLECTION_KEYS.includes(draft.collection) ? draft.collection : 'honey',
      image: draft.image?.trim() || '/honey-jar.jpg',
      priceMin: Number(draft.priceMin) || 0,
      ...(draft.priceMax ? { priceMax: Number(draft.priceMax) } : {}),
      rating: Number(draft.rating) || 0,
      reviews: Number(draft.reviews) || 0,
      available: draft.available !== false,
      featured: 0,
      variants:
        draft.variants && draft.variants.trim()
          ? draft.variants.split(',').map((v) => v.trim()).filter(Boolean)
          : ['Default'],
      isCustom: true,
    }

    setCustomProducts((current) => [product, ...current])
    return product
  }, [])

  const removeCustomProduct = useCallback((id) => {
    setCustomProducts((current) => current.filter((p) => p.id !== id))
  }, [])

  // Base catalogue + admin products, grouped by collection slug
  const collections = useMemo(() => {
    const merged = {}
    for (const key of COLLECTION_KEYS) merged[key] = [...BASE_COLLECTIONS[key]]
    for (const p of customProducts) {
      const key = COLLECTION_KEYS.includes(p.collection) ? p.collection : 'honey'
      merged[key] = [...merged[key], p]
    }
    return merged
  }, [customProducts])

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
      customProducts,
      addCustomProduct,
      removeCustomProduct,
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
      customProducts,
      addCustomProduct,
      removeCustomProduct,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used inside a ShopProvider')
  return context
}

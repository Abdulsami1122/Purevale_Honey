import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  honeyProducts,
  datesProducts,
  jaggeryProducts,
  shilajitProducts,
  cosmeticsProducts,
} from '../../data/products'

const ShopContext = createContext(null)

const ALL_PRODUCTS = [
  ...honeyProducts,
  ...datesProducts,
  ...jaggeryProducts,
  ...shilajitProducts,
  ...cosmeticsProducts,
]

const WISHLIST_STORAGE_KEY = 'purevale_wishlist'
const CART_STORAGE_KEY = 'purevale_cart'

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
    () => ALL_PRODUCTS.filter((product) => wishlist.has(product.id)),
    [wishlist],
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
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used inside a ShopProvider')
  return context
}

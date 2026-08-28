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

const readStoredWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY)
    const ids = raw ? JSON.parse(raw) : []
    return Array.isArray(ids) ? new Set(ids) : new Set()
  } catch {
    return new Set()
  }
}

export const ShopProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(readStoredWishlist)
  const [cartCount, setCartCount] = useState(6)

  // Keep the wishlist so it survives a page reload
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([...wishlist]))
    } catch {
      /* storage unavailable (private mode / quota) — ignore */
    }
  }, [wishlist])

  const toggleWishlist = useCallback((id) => {
    setWishlist((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const addToCart = useCallback((quantity = 1) => {
    setCartCount((current) => current + quantity)
  }, [])

  // Full product objects for everything currently wishlisted
  const wishlistProducts = useMemo(
    () => ALL_PRODUCTS.filter((product) => wishlist.has(product.id)),
    [wishlist],
  )

  const value = useMemo(
    () => ({ wishlist, wishlistProducts, toggleWishlist, cartCount, addToCart }),
    [wishlist, wishlistProducts, toggleWishlist, cartCount, addToCart],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used inside a ShopProvider')
  return context
}

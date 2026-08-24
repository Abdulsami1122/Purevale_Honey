import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ShopContext = createContext(null)

export const ShopProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => new Set())
  const [cartCount, setCartCount] = useState(6)

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

  const value = useMemo(
    () => ({ wishlist, toggleWishlist, cartCount, addToCart }),
    [wishlist, toggleWishlist, cartCount, addToCart],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used inside a ShopProvider')
  return context
}

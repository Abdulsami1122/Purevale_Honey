import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from '../lib/api'

// Cookie-based session shared by customers and admins. The name is kept for
// backwards compatibility with existing imports.
const AdminAuthContext = createContext(null)

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'authed' | 'guest'

  useEffect(() => {
    let cancelled = false
    api
      .me()
      .then((res) => {
        if (cancelled) return
        setUser(res.user)
        setStatus('authed')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('guest')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password)
    setUser(res.user)
    setStatus('authed')
    return res.user
  }, [])

  // Registration creates the account but does not start a session — the caller
  // should send the user to the login form afterwards.
  const register = useCallback(async (payload) => {
    const res = await api.register(payload)
    return res.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      /* ignore network errors on logout */
    }
    setUser(null)
    setStatus('guest')
  }, [])

  const value = useMemo(
    () => ({
      user,
      admin: user, // alias kept for existing call sites
      status,
      isAuthed: status === 'authed',
      isAdmin: status === 'authed' && user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [user, status, login, register, logout],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}

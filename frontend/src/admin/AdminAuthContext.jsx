import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { getToken, setToken } from '../lib/api'

const AdminAuthContext = createContext(null)

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'authed' | 'guest'

  // On boot, validate any stored token
  useEffect(() => {
    let cancelled = false
    const token = getToken()
    if (!token) {
      setStatus('guest')
      return
    }
    api
      .me()
      .then((res) => {
        if (cancelled) return
        setAdmin(res.admin)
        setStatus('authed')
      })
      .catch(() => {
        if (cancelled) return
        setToken(null)
        setStatus('guest')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password)
    setToken(res.token)
    setAdmin(res.admin)
    setStatus('authed')
    return res.admin
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setAdmin(null)
    setStatus('guest')
  }, [])

  const value = useMemo(
    () => ({ admin, status, isAuthed: status === 'authed', login, logout }),
    [admin, status, login, logout],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}

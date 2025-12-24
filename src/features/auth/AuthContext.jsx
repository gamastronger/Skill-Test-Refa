import { useEffect, useCallback, useState } from 'react'
import { AuthContext } from './AuthCore.js'
import { login as loginApi, register as registerApi, logout as logoutApi, getMe, getStoredUser } from './authService.js'


export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => getStoredUser())
  // Derive initial loading from presence of token to avoid synchronous setState in effect
  const [loading, setLoading] = useState(() => !!localStorage.getItem('token'))
  const isAuthenticated = !!token

  useEffect(() => {

    if (!token) return
    let cancelled = false

    getMe()
      .then(data => {
        if (!cancelled && data) {
          setUser(data)
        }
      })
      .catch(err => {
        console.error('[AUTH] Failed to fetch user:', err.message)
        if (!cancelled) {

          logoutApi()
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [token])

  const login = useCallback(async (username, password) => {
    const data = await loginApi(username, password)
    setToken(data.accessToken)
    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    }
    setUser(userData)
    // Save to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData))
    return data
  }, [])

  const register = useCallback(async (userData) => {
    const data = await registerApi(userData)
    return data
  }, [])

  const refreshMe = useCallback(async () => {
    const data = await getMe()
    if (data) {
      setUser(data)
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data))
    }
    return data
  }, [])

  const logout = useCallback(() => {
    logoutApi()
    setToken(null)
    setUser(null)
  }, [])

  const value = { token, user, isAuthenticated, loading, login, register, refreshMe, logout, setUser }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

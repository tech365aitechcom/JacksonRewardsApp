'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { initGoogleAuth, getCurrentUser, signInWithGoogle, signOut } from '../../lib/mobileAuth'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export default function AuthSessionProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initGoogleAuth()
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.warn('Failed to initialize auth:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()
  }, [])

  const login = async () => {
    const result = await signInWithGoogle()
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  const logout = async () => {
    const result = await signOut()
    if (result.success) {
      setUser(null)
    }
    return result
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
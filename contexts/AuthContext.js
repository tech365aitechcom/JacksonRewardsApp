'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const signIn = async (email, password) => {
    setIsLoading(true)
    try {
      // Simulate API call - replace with your actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userData = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        image: null
      }
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setIsLoading(false)
      
      return { ok: true }
    } catch (error) {
      setIsLoading(false)
      return { ok: false, error: error.message }
    }
  }

  const signInWithProvider = async (provider) => {
    setIsLoading(true)
    try {
      // For mobile apps, you'd use Capacitor plugins for social auth
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userData = {
        id: '1',
        email: `user@${provider}.com`,
        name: `${provider} User`,
        image: null,
        provider: provider
      }
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setIsLoading(false)
      
      return { ok: true }
    } catch (error) {
      setIsLoading(false)
      return { ok: false, error: error.message }
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signInWithProvider,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
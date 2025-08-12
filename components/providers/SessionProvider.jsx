'use client'
import { AuthProvider } from '../../contexts/AuthContext'

export default function AuthSessionProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
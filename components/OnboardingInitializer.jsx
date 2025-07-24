'use client'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { useEffect } from 'react'

export default function OnboardingInitializer({ children }) {
  const loadFromStorage = useOnboardingStore((s) => s.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
  }, [])

  return children
}

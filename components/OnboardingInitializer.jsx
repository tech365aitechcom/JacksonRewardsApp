'use client'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { useEffect, useState } from 'react'

export default function OnboardingInitializer({ children }) {
  const loadFromStorage = useOnboardingStore((s) => s.loadFromStorage)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function hydrate() {
      await loadFromStorage()
      setIsLoaded(true)
    }
    hydrate()
  }, [loadFromStorage])

  if (!isLoaded) {
    return null
  }

  return children
}

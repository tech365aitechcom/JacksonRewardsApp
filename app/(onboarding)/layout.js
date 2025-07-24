import OnboardingInitializer from '@/components/OnboardingInitializer'
import React from 'react'

const OnboardingLayout = ({ children }) => {
  return (
    <div>
      <OnboardingInitializer>{children}</OnboardingInitializer>
    </div>
  )
}

export default OnboardingLayout

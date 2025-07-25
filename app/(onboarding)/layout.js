import OnboardingInitializer from '@/components/OnboardingInitializer'
import React from 'react'

const OnboardingLayout = ({ children }) => {
  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden'>
      <OnboardingInitializer>{children}</OnboardingInitializer>
    </div>
  )
}

export default OnboardingLayout

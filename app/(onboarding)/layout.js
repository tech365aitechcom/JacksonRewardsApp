'use client'
import OnboardingInitializer from '@/components/OnboardingInitializer'
import useOnboardingStore from '@/stores/useOnboardingStore'
import React from 'react'

const TOTAL_STEPS = 5

const OnboardingLayout = ({ children }) => {
  const currentStep = useOnboardingStore((state) => state.currentStep)

  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden'>
      {/* Progress bar and step indicator */}
      <div className='absolute top-6 left-0 px-4 w-full z-10'>
        <div className='flex items-center space-x-2 mb-2'>
          {[...Array(TOTAL_STEPS)].map((_, i) => {
            const step = i + 1
            return (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full ${
                  step < currentStep
                    ? 'bg-[#8BDFBC]'
                    : step === currentStep
                    ? 'bg-[#B4AFFF]'
                    : 'bg-gray-200 opacity-50'
                }`}
              />
            )
          })}
        </div>
        <div className='flex items-center space-x-2'>
          <div className='relative flex items-center justify-center w-4 h-4 rounded-full bg-[#9EADF7]'>
            <div className='w-1.5 h-1.5 rounded-full bg-[#272052]' />
          </div>
          <span className='text-white text-sm font-medium'>
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>
      </div>

      <OnboardingInitializer>{children}</OnboardingInitializer>
    </div>
  )
}

export default OnboardingLayout

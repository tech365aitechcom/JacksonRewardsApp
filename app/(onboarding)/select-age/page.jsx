'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { AGE_OPTIONS } from '@/constants/onboardingOptions'

export default function AgeSelection() {
  const router = useRouter()
  const { ageRange, setAgeRange, setCurrentStep } = useOnboardingStore()

  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  const handleSelectAge = async (age) => {
    await setAgeRange(age)
    setTimeout(() => {
      router.push('/select-gender')
    }, 200)
  }

  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden'>
      {/* Blurred Gradient Background */}
      <div className='absolute w-[542px] h-[542px] top-0 left-0 bg-[#af7de6] rounded-[271px] blur-[250px]' />

      {/* Title and Description */}
      <div className='absolute top-[100px] left-0 px-4'>
        <h1 className='text-white font-poppins font-normal text-4xl tracking-wide leading-tight'>
          Select your age <br /> range
        </h1>
        <p className='mt-4 text-white font-poppins font-light text-base'>
          Helps with content filtering, COPPA <br /> compliance, and reward
          expectations
        </p>
      </div>

      {/* Age Options */}
      <div className='absolute inset-0 w-full flex items-center justify-center'>
        <div className='relative w-full mx-4'>
          <div className='relative h-[250px] rounded-xl bg-transparent'>
            <div className='absolute inset-0 rounded-xl overflow-hidden'>
              <div className='flex flex-col items-center py-2'>
                {AGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectAge(option.value)}
                    className={`items-center gap-3 px-3 py-2 w-full flex justify-center relative self-stretch rounded-xl ${
                      ageRange === option.value ? 'bg-white' : 'bg-transparent'
                    }`}
                  >
                    <div
                      className={`[font-family:'Poppins-${
                        ageRange === option.value ? 'SemiBold' : 'Regular'
                      }',Helvetica] ${
                        ageRange === option.value
                          ? 'text-[#6433aa]'
                          : 'text-white'
                      } font-${
                        ageRange === option.value ? 'semibold' : 'normal'
                      } text-lg text-center tracking-[0] leading-6`}
                    >
                      {option.label}
                    </div>
                  </button>
                ))}
                <div className='h-9 relative self-stretch w-full' />
              </div>
            </div>
          </div>

          {/* Scroll Mask Gradient */}
          <div className='pointer-events-none absolute w-full h-[210px] top-0 left-0 rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.2)_20%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.2)_80%,rgba(255,255,255,0.4)_100%)]' />
        </div>
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { getOnboardingOptions } from '@/lib/api'


export default function AgeSelection() {
  const router = useRouter()
  const { ageRange, setAgeRange, currentStep, setCurrentStep } =
    useOnboardingStore()

  const [ageOptions, setAgeOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setCurrentStep(1)

    const fetchOptions = async () => {
      try {
        setIsLoading(true)
        const data = await getOnboardingOptions('age_range')
        if (data && Array.isArray(data.options)) {
          setAgeOptions(data.options)
        } else {
          setError('Could not parse age options.')
        }
      } catch (err) {
        setError('Could not load age ranges. Please try again.')
        console.error('Failed to fetch age ranges:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOptions()
  }, [setCurrentStep])

  const handleSelectAge = async (ageOptionId) => {
    await setAgeRange(ageOptionId)
    setTimeout(() => {
      router.push('/select-improvement')
    }, 200)
  }

  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden'>
      <div className='absolute top-6 left-0 px-4 w-full'>
        <div className='flex items-center space-x-2 mb-2'>
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full ${step < currentStep
                ? 'bg-[#8BDFBC]'
                : step === currentStep
                  ? 'bg-[#B4AFFF]'
                  : 'bg-gray-200 opacity-50'
                }`}
            />
          ))}
        </div>
        <div className='flex items-center space-x-2'>
          <div className='w-2 h-2 rounded-full bg-[#B4AFFF]' />
          <span className='text-white text-sm font-medium'>
            Step {currentStep} of 5
          </span>
        </div>
      </div>

      <div className='absolute top-[100px] left-0 px-4'>
        <h1 className='text-white font-poppins font-normal text-4xl tracking-wide leading-tight'>
          Select your age <br /> range
        </h1>
        <p className='mt-2 text-white font-poppins font-light text-base leading-tight'>
          Helps with content filtering, COPPA <br /> compliance, and reward
          expectations
        </p>
      </div>

      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='relative w-[335px] mx-4'>
          <div className='relative h-[300px] rounded-xl bg-transparent'>
            <div className='absolute inset-0 bg-[#31275d] rounded-xl overflow-hidden'>
              <div className='flex flex-col items-center py-2'>
                {isLoading && (
                  <p className='text-white text-base py-4'>Loading options...</p>
                )}
                {error && <p className='text-red-400 text-base py-4'>{error}</p>}
                {!isLoading &&
                  !error &&
                  ageOptions.map((option) => (
                    <button
                      key={option.id} // Use unique ID from API
                      onClick={() => handleSelectAge(option.id)} // Pass ID to handler
                      className={`items-center w-full flex justify-center py-4 rounded-xl transition-colors duration-200 ease-in-out ${ageRange === option.id // Compare stored ID with option ID
                        ? 'bg-white'
                        : 'bg-transparent'
                        }`}
                    >
                      <div
                        className={`text-base font-poppins transition-colors duration-200 ease-in-out ${ageRange === option.id // Compare stored ID with option ID
                          ? 'text-[#6433aa] font-semibold'
                          : 'text-white font-normal'
                          }`}
                      >
                        {option.label} {/* Display label from API */}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
            <div className='pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-[rgba(255,255,255,0.05)] to-transparent' />
          </div>
        </div>
      </div>
    </div>
  )
}
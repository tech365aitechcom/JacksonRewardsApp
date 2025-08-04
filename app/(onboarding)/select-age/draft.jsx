'use client'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { useRouter } from 'next/navigation'

const AGE_OPTIONS = [
  { label: 'Under 18', value: 'Under 18' },
  { label: '18-24', value: '18-24' },
  { label: '25-34', value: '25-34' },
  { label: '35-44', value: '35-44' },
  { label: '45+', value: '45+' },
  { label: '44-60', value: '44-60' }, // This option is in the image but overlaps with 45+, keeping it for now
]

export default function AgeSelection() {
  const router = useRouter()
  const { ageRange, setAgeRange } = useOnboardingStore()
  const currentStep = 1
  const handleSelectAge = (age) => {
    console.log('Selected Age:', age)
    setAgeRange(age)
    setTimeout(() => {
      router.push('/select-improvement')
    }, 200)
  }

  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden'>
      {/* Top progress bar and step indicator */}
      <div className='absolute top-6 left-0 px-4 w-full'>
        <div className='flex items-center space-x-2 mb-2'>
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full ${
                step < currentStep
                  ? 'bg-[#8BDFBC]' // completed (green)
                  : step === currentStep
                  ? 'bg-[#B4AFFF]' // current (purple)
                  : 'bg-gray-200 opacity-50' // upcoming (gray)
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

      {/* Title and description */}
      <div className='absolute top-[100px] left-0 px-4'>
        <h1 className='text-white font-poppins font-normal text-4xl tracking-wide leading-tight'>
          Select your age <br /> range
        </h1>
        <p className='mt-2 text-white font-poppins font-light text-base leading-tight'>
          Helps with content filtering, COPPA <br /> compliance, and reward
          expectations
        </p>
      </div>

      {/* Age selection list */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='relative w-[335px] mx-4'>
          <div className='relative h-[300px] rounded-xl bg-transparent'>
            <div className='absolute inset-0 bg-[#31275d] rounded-xl overflow-hidden'>
              <div className='flex flex-col items-center py-2'>
                {AGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectAge(option.value)}
                    className={`items-center w-full flex justify-center py-4 rounded-xl transition-colors duration-200 ease-in-out ${
                      ageRange === option.value ? 'bg-white' : 'bg-transparent'
                    }`}
                  >
                    <div
                      className={`text-base font-poppins transition-colors duration-200 ease-in-out ${
                        ageRange === option.value
                          ? 'text-[#6433aa] font-semibold'
                          : 'text-white font-normal'
                      }`}
                    >
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* Gradient overlay for fading effect */}
            <div className='pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-[rgba(255,255,255,0.05)] to-transparent' />
          </div>
        </div>
      </div>
    </div>
  )
}

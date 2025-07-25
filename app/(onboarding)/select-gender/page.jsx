'use client'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { useRouter } from 'next/navigation'

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Other', value: 'other' },
]

export default function GenderSelection() {
  const router = useRouter()
  const { gender, setGender } = useOnboardingStore()

  const handleGenderSelect = (gender) => {
    setGender(gender)
    setTimeout(() => {
      router.push('/select-age')
    }, 200)
  }

  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden flex flex-col'>
      {/* Background blur effect */}
      <div className='absolute w-[542px] h-[542px] top-0 left-0 bg-[#af7de6] rounded-full blur-[250px]' />

      {/* Header content */}
      <div className='relative z-10 px-6 pt-20 font-poppins'>
        <h1 className='text-white text-4xl font-light leading-tight mb-4'>
          Select your gender
        </h1>

        <p className='text-white/70 text-base font-light'>
          This will help to make your training plan more relevant
        </p>
      </div>

      {/* Selection buttons */}
      <div className='relative z-10 flex-1 flex flex-col justify-center px-6 space-y-6'>
        {GENDER_OPTIONS.map((option) => {
          const isSelected = gender === option.value
          return (
            <button
              key={option.value}
              onClick={() => handleGenderSelect(option.value)}
              className='relative w-full h-16 group focus:outline-none'
            >
              {/* Bottom shadow */}
              <div
                className={`${
                  isSelected
                    ? ''
                    : 'absolute inset-x-0 top-0 h-18 bg-[#D8D5E9] rounded-full'
                }`}
              />

              {/* Main button */}
              <div
                className={`absolute inset-x-0 top-0 h-16 rounded-full transition-all duration-300 flex items-center justify-center
                ${
                  isSelected
                    ? 'bg-white border-2 border-[#af7de6] shadow-lg shadow-[#af7de6]/50 scale-105'
                    : 'bg-white group-hover:translate-y-0.5'
                }`}
              >
                <span
                  className={`text-base font-semibold font-poppins tracking-wide transition-colors duration-200 ${
                    isSelected ? 'text-[#272052]' : 'text-[#2D2D2D]'
                  }`}
                >
                  {option.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

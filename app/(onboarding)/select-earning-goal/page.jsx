'use client'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { useRouter } from 'next/navigation'

const EARNING_GOAL_OPTIONS = [
  { label: '$20/day', value: '$20/day' },
  { label: '$50/day', value: '$50/day' },
  { label: '$100/day', value: '$100/day' },
  { label: '$200/day', value: '$200/day' },
]

export default function EarningGoalSelection() {
  const router = useRouter()
  const { earning, setEarning } = useOnboardingStore()

  const handleEarningGoalSelect = (earningGoal) => {
    setEarning(earningGoal)
    setTimeout(() => {
      router.push('/sign-up')
    }, 200)
  }

  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden flex flex-col'>
      {/* Background blur effect */}
      <div className='absolute w-[542px] h-[542px] top-0 left-0 bg-[#af7de6] rounded-full blur-[250px]' />

      {/* Header content */}
      <div className='relative z-10 px-6 pt-20 font-poppins'>
        <h1 className='text-white text-4xl font-light leading-tight mb-4'>
          Set a daily earning
          <br />
          goal
        </h1>

        <p className='text-white/70 text-base font-light'>
          This will boost your motivation and earnings
        </p>
      </div>

      {/* Selection buttons */}
      <div className='relative z-10 flex-1 flex flex-col justify-center px-6 space-y-6'>
        {EARNING_GOAL_OPTIONS.map((option) => {
          const isSelected = earning === option.value
          return (
            <button
              key={option.value}
              onClick={() => handleEarningGoalSelect(option.value)}
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
                  className={`text-base font-poppins font-semibold tracking-wide transition-colors duration-200 ${
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

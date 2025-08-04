'use client'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const GAME_OPTIONS = [
  { label: 'Puzzle & Brain', value: 'puzzle_brain' },
  { label: 'Strategy', value: 'strategy' },
  { label: 'Arcade', value: 'arcade' },
  { label: 'Simulation', value: 'simulation' },
  { label: 'Card & Casino', value: 'card_casino' },
  { label: 'Sports & Racing', value: 'sports_racing' },
  { label: 'Word & Trivia', value: 'word_trivia' },
  { label: 'Role Playing / Adventure', value: 'role_playing_adventure' },
]

export default function GamePreferencesSelection() {
  const router = useRouter()
  const { gamePreferences, setGamePreferences, setCurrentStep } =
    useOnboardingStore()
  const gamePreferencesSafe = Array.isArray(gamePreferences)
    ? gamePreferences
    : []

  useEffect(() => {
    setCurrentStep(3)
  }, [setCurrentStep])

  const handlePreferenceSelect = async (value) => {
    const current = Array.isArray(gamePreferences) ? [...gamePreferences] : []

    let updated
    if (current.includes(value)) {
      updated = current.filter((item) => item !== value)
    } else {
      if (current.length < 3) {
        updated = [...current, value]
      } else {
        return // don't allow more than 3
      }
    }

    await setGamePreferences(updated)

    if (updated.length === 3) {
      router.push('/game-styles')
    }
  }

  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden flex flex-col'>
      {/* Background blur effect */}
      <div className='absolute w-[542px] h-[542px] top-0 left-0 bg-[#af7de6] rounded-full blur-[250px]' />

      {/* Header content */}
      <div className='relative z-10 px-6 pt-20 font-poppins'>
        <h1 className='text-white text-4xl font-light leading-tight mb-4'>
          What types of games do you enjoy playing?
        </h1>

        <p className='text-white/70 text-base font-light'>Select up to 3</p>
      </div>

      {/* Selection buttons */}
      <div className='relative z-10 flex-1 flex flex-col justify-center px-6 space-y-6'>
        {GAME_OPTIONS.map((option) => {
          const isSelected = gamePreferencesSafe.includes(option.value)
          return (
            <button
              key={option.value}
              onClick={() => handlePreferenceSelect(option.value)}
              className='relative w-full h-16 group focus:outline-none'
            >
              {/* Bottom shadow */}
              <div className='absolute inset-x-0 top-0 h-18 bg-[#D8D5E9] rounded-full' />

              {/* Main button */}
              <div
                className={`absolute inset-x-0 top-0 h-16 rounded-full transition-all duration-300 flex items-center justify-start px-12 gap-4
             bg-white group-hover:translate-y-0.5`}
              >
                {isSelected ? (
                  <div className='w-5 h-5 bg-[#7e22ce] rounded-md flex items-center justify-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-3 h-3 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                ) : (
                  <div className='w-5 h-5 border-2 border-gray-300 rounded' />
                )}

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

'use client'
import { GAME_STYLE_OPTIONS } from '@/constants/onboardingOptions'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function GameStyleSelection() {
  const router = useRouter()
  const { gameStyle, setGameStyle, setCurrentStep } = useOnboardingStore()

  console.log('Game Style:', gameStyle)

  useEffect(() => {
    setCurrentStep(4)
  }, [setCurrentStep])

  const handleSelectGameStyle = (style) => {
    setGameStyle(style)
    setTimeout(() => {
      router.push('/player-type')
    }, 200)
  }

  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden flex flex-col'>
      {/* Background blur */}
      <div className='absolute w-[542px] h-[542px] top-0 left-0 bg-[#af7de6] rounded-full blur-[250px]' />

      {/* Header content */}
      <div className='relative z-10 px-6 pt-28 font-poppins'>
        <h1 className='text-white text-4xl font-light leading-tight mb-4'>
          What kind of games do you prefer?
        </h1>

        <p className='text-white/70 text-base font-light'>
          Choose the pace and reward style you like.
        </p>
      </div>

      {/* Selection buttons */}
      <div className='relative z-10 pt-12 flex flex-col justify-center px-6 space-y-6'>
        {GAME_STYLE_OPTIONS.map((option) => {
          const isSelected = gameStyle === option.value
          return (
            <button
              key={option.value}
              onClick={() => handleSelectGameStyle(option.value)}
              className='relative w-full h-16 group focus:outline-none'
            >
              <div
                className={`absolute inset-x-0 top-0 h-18 bg-[#D8D5E9] rounded-full transition-transform duration-300 ${
                  isSelected ? 'scale-105' : ''
                }`}
              />
              <div
                className={`absolute inset-x-0 top-0 h-16 rounded-full transition-all duration-300 flex items-center justify-center bg-white group-hover:translate-y-0.5 ${
                  isSelected ? 'scale-105 shadow-lg shadow-[#AF7DE6]/50' : ''
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

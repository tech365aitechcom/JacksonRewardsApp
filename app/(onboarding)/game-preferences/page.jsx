'use client'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getOnboardingOptions } from '@/lib/api'


export default function GamePreferencesSelection() {
  const router = useRouter()
  const { gamePreferences, setGamePreferences, setCurrentStep } =
    useOnboardingStore()

  const [gameOptions, setGameOptions] = useState([])
  const [maxSelection, setMaxSelection] = useState(3)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const gamePreferencesSafe = Array.isArray(gamePreferences)
    ? gamePreferences
    : []

  useEffect(() => {
    setCurrentStep(3)

    const fetchOptions = async () => {
      try {
        setIsLoading(true)
        const data = await getOnboardingOptions('game_preferences')
        if (data && Array.isArray(data.options)) {
          setGameOptions(data.options)
          if (data.maxSelection) {
            setMaxSelection(data.maxSelection)
          }
        } else {
          setError('Could not parse game options.')
        }
      } catch (err) {
        setError('Could not load game options. Please try again.')
        console.error('Failed to fetch game preferences:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOptions()
  }, [setCurrentStep])

  const handlePreferenceSelect = async (optionId) => {
    const current = [...gamePreferencesSafe]

    let updated
    if (current.includes(optionId)) {
      updated = current.filter((item) => item !== optionId)
    } else {
      if (current.length < maxSelection) {
        updated = [...current, optionId]
      } else {
        return
      }
    }

    await setGamePreferences(updated)

    if (updated.length === maxSelection) {
      setTimeout(() => {
        router.push('/game-styles')
      }, 300)
    }
  }

  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden flex flex-col'>
      <div className='absolute w-[542px] h-[542px] top-0 left-0 bg-[#af7de6] rounded-full blur-[250px]' />

      <div className='relative z-10 px-6 pt-20 font-poppins'>
        <h1 className='text-white text-4xl font-light leading-tight mb-4'>
          What types of games do you enjoy playing?
        </h1>
        <p className='text-white/70 text-base font-light'>Select up to 3</p>
      </div>

      <div className='relative z-10 flex-1 flex flex-col justify-center px-6 space-y-6'>
        {isLoading && (
          <p className='text-white text-center font-poppins'>
            Loading game options...
          </p>
        )}
        {error && <p className='text-red-400 text-center font-poppins'>{error}</p>}

        {!isLoading &&
          !error &&
          gameOptions.map((option) => {
            const isSelected = gamePreferencesSafe.includes(option.id)
            return (
              <button
                key={option.id}
                onClick={() => handlePreferenceSelect(option.id)}
                className='relative w-full h-16 group focus:outline-none'
              >
                <div className='absolute inset-x-0 top-0 h-18 bg-[#D8D5E9] rounded-full' />
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
                    className={`text-base font-semibold font-poppins tracking-wide transition-colors duration-200 ${isSelected ? 'text-[#272052]' : 'text-[#2D2D2D]'
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
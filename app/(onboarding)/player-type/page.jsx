'use client'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getOnboardingOptions } from '@/lib/api'


export default function PlayerTypeSelection() {
  const router = useRouter()
  const { gameHabit, setGameHabit, setCurrentStep } = useOnboardingStore()

  const [gameHabitOptions, setGameHabitOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setCurrentStep(5)

    const fetchOptions = async () => {
      try {
        setIsLoading(true)
        const data = await getOnboardingOptions('dealy_game')
        if (data && Array.isArray(data.options)) {
          setGameHabitOptions(data.options)
        } else {
          setError('Could not parse player types.')
        }
      } catch (err) {
        setError('Could not load player types. Please try again.')
        console.error('Failed to fetch player types:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOptions()
  }, [setCurrentStep])

  const handleSelectGameHabit = async (habitId) => {
    await setGameHabit(habitId)
    setTimeout(() => {
      router.push('/signup')
    }, 200)
  }

  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden flex flex-col'>
      <div className='absolute w-[542px] h-[542px] top-0 left-0 bg-[#af7de6] rounded-full blur-[250px]' />

      <div className='relative z-10 px-6 pt-20 font-poppins'>
        <h1 className='text-white text-4xl font-light leading-tight mb-4'>
          Which of these sounds most like you?
        </h1>
        <p className='text-white/70 text-base font-light'>
          Select one to help us match the right games & rewards.
        </p>
      </div>

      <div className='relative z-10 flex-1 flex flex-col justify-center px-6 space-y-6'>
        {isLoading && (
          <p className='text-white text-center font-poppins'>
            Loading options...
          </p>
        )}
        {error && <p className='text-red-400 text-center font-poppins'>{error}</p>}

        {!isLoading &&
          !error &&
          gameHabitOptions.map((option) => {
            const isSelected = gameHabit === option.id // Use `option.id` from API
            return (
              <button
                key={option.id} // Use `option.id` as the key
                onClick={() => handleSelectGameHabit(option.id)} // Pass `option.id`
                className='relative w-full h-16 group focus:outline-none'
              >
                <div
                  className={`absolute inset-x-0 top-0 h-18 bg-[#D8D5E9] rounded-full transition-transform duration-300 ${isSelected ? 'scale-105' : ''
                    }`}
                />
                <div
                  className={`absolute inset-x-0 top-0 h-16 p-5 rounded-full transition-all duration-300 flex items-center justify-center bg-white group-hover:translate-y-0.5 ${isSelected ? 'scale-105 shadow-lg shadow-[#AF7DE6]/50' : ''
                    }`}
                >
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
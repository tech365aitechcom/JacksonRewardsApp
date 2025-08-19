'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { getOnboardingOptions } from '@/lib/api'


export default function AgeSelection() {
  const router = useRouter()
  const { ageRange, setAgeRange, setCurrentStep } = useOnboardingStore()
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
      router.push('/select-gender')
    }, 200)
  }


  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden'>
      <div className='absolute w-[542px] h-[542px] top-0 left-0 bg-[#af7de6] rounded-[271px] blur-[250px]' />

      <div className='absolute top-[100px] left-0 px-4'>
        <h1 className='text-white font-poppins font-normal text-4xl tracking-wide leading-tight'>
          Select your age <br /> range
        </h1>
        <p className='mt-4 text-white font-poppins font-light text-base'>
          Helps with content filtering, COPPA <br /> compliance, and reward
          expectations
        </p>
      </div>

      <div className='absolute inset-0 w-full flex items-center justify-center'>
        <div className='relative w-full mx-4'>
          <div className='relative h-[250px] rounded-xl bg-transparent'>
            <div className='absolute inset-0 rounded-xl overflow-hidden'>
              <div className='flex flex-col items-center py-2'>
                {isLoading && (
                  <div className='text-white text-lg p-4'>Loading...</div>
                )}
                {error && (
                  <div className='text-red-400 text-lg p-4'>{error}</div>
                )}
                {!isLoading &&
                  !error &&
                  ageOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectAge(option.id)}
                      className={`items-center gap-3 px-3 py-2 w-full flex justify-center relative self-stretch rounded-xl ${ageRange === option.id ? 'bg-white' : 'bg-transparent'
                        }`}
                    >
                      <div
                        className={`[font-family:'Poppins-${ageRange === option.id ? 'SemiBold' : 'Regular'
                          }',Helvetica] ${ageRange === option.id
                            ? 'text-[#6433aa]'
                            : 'text-white'
                          } font-${ageRange === option.id ? 'semibold' : 'normal'
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
          <div className='pointer-events-none absolute w-full h-[210px] top-0 left-0 rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.2)_20%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.2)_80%,rgba(255,255,255,0.4)_100%)]' />
        </div>
      </div>

    </div>
  )
}
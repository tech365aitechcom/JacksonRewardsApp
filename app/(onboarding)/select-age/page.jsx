'use client'
import useOnboardingStore from '@/stores/useOnboardingStore'
import { useRouter } from 'next/navigation'

const AGE_OPTIONS = [
  { label: '10-13', value: '10-13' },
  { label: '14-17', value: '14-17' },
  { label: '18-24', value: '18-24' },
  { label: '25-30', value: '25-30' },
  { label: '31-35', value: '31-35' },
  { label: '36-44', value: '36-44' },
  { label: '44-60', value: '44-60' },
]

export default function AgeSelection() {
  const router = useRouter()
  const { ageRange, setAgeRange } = useOnboardingStore()

  const handleSelectAge = (age) => {
    console.log('Selected Age:', age)
    setAgeRange(age)
    setTimeout(() => {
      router.push('/select-improvement')
    }, 200)
  }

  return (
    <div className='relative w-full h-screen bg-[#272052] overflow-hidden'>
      <div className='absolute w-[542px] h-[542px] top-0 left-0 bg-[#af7de6] rounded-[271px] blur-[250px]' />

      <div className='absolute top-[100px] left-11 font-poppins font-normal text-white text-3xl tracking-[0.20px] leading-[39px]'>
        Select your age
        <br />
        range
      </div>

      <p className='absolute top-50 left-11 font-poppins font-light text-white text-base tracking-[0.20px] leading-[22px]'>
        This will help to make your training plan
        <br />
        more relevant
      </p>

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[335px]'>
        <div className='relative h-[260px] rounded-xl'>
          <div className='flex items-center justify-center px-2 py-1 top-0 left-0 bg-[#31275d] rounded-xl overflow-hidden shadow-[0px_8px_20px_#18181814] absolute w-[335px] h-[260px]'>
            <div className='items-start flex-1 grow flex justify-center relative self-stretch'>
              <div className='flex flex-col items-start relative flex-1 grow mb-[-36.00px] overflow-y-auto'>
                {AGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectAge(option.value)}
                    className={`items-center gap-3 px-3 py-1.5 w-full flex justify-center relative self-stretch rounded-xl ${
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
                      } text-base text-center tracking-[0] leading-6`}
                    >
                      {option.label}
                    </div>
                  </button>
                ))}
                <div className='h-9 relative self-stretch w-full' />
              </div>
            </div>
          </div>

          <div className='pointer-events-none absolute w-[335px] h-[260px] top-0 left-0 rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.2)_20%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.2)_80%,rgba(255,255,255,0.4)_100%)]' />
        </div>
      </div>
    </div>
  )
}

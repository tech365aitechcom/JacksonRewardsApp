'use client'
import useOnboardingStore from '@/stores/useOnboardingStore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const ageOptions = [
  { label: '10–13', top: '27%' },
  { label: '14–17', top: '33.5%' },
  { label: '18–24', top: '40%' },
  { label: '25–30', top: '46.5%' },
  { label: '31–35', top: '53%' },
  { label: '36–44', top: '59.5%' },
  { label: '44–60', top: '66%' },
]

export default function AgeSelection() {
  const { ageRange, setAgeRange } = useOnboardingStore()
  const router = useRouter()

  const handleAgeSelect = (age) => {
    setAgeRange(age)
    setTimeout(() => {
      router.push('/select-improvement')
    }, 200)
  }

  return (
    <div className='relative w-full min-h-screen flex justify-center items-center bg-black overflow-hidden'>
      {/* Background Image */}
      <Image
        src='/age.png' // Place in /public folder
        alt='Age Selection Background'
        layout='fill'
        objectFit='cover'
        priority
        onClick={() => handleAgeSelect('25–30')}
      />

      {/* Transparent Clickable Areas */}
      {/* <div className='w-full max-w-md px-6 relative z-10'>
        {ageOptions.map((age) => (
          <button
            key={age.label}
            onClick={() => handleAgeSelect(age.label)}
            className='w-full h-10 absolute bg-black'
            style={{ top: age.top }}
            aria-label={age.label}
          />
        ))}
      </div> */}
    </div>
  )
}

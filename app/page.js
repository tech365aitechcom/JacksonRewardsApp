'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleClick = async () => {
    if (isNavigating) return // Prevent multiple clicks
    
    setIsNavigating(true)
    try {
      await router.push('/select-age')
    } catch (error) {
      console.error('Navigation error:', error)
      setIsNavigating(false)
    }
  }

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Background Image */}
      <Image
        src='/welcome.png'
        alt='Jackson Welcome Screen'
        width={1920}
        height={1080}
        className='w-full h-full object-cover absolute inset-0'
        priority
      />

      {/* Navigation Button with improved touch handling */}
      <button
        onClick={handleClick}
        disabled={isNavigating}
        className='absolute z-20 touch-manipulation active:scale-95 transition-transform duration-100 hover:opacity-80 disabled:opacity-50'
        style={{
          right: '18px',
          bottom: '262px',
          width: '60px', // Increased touch target
          height: '60px', // Increased touch target
          background: 'transparent',
          borderRadius: '50%',
          WebkitTapHighlightColor: 'transparent', // Remove tap highlight
        }}
        aria-label='Navigate to Select Goal'
      />
    </div>
  )
}

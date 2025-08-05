'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/select-age')
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    router.push('/select-age')
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

      {/* Invisible Button placed over the image button area */}
      <button
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        className='absolute z-50 cursor-pointer'
        style={{
          right: '18px',
          bottom: '262px',
          width: '50px',
          height: '50px',
          background: 'transparent',
          border: '1px solid transparent',
          borderRadius: '50%',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label='Navigate to Select Goal'
      />
    </div>
  )
}

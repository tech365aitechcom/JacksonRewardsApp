'use client'
import useOnboardingStore from '@/stores/useOnboardingStore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ImprovementGoalSelection() {
  const router = useRouter()
  const { improvement, setImprovement } = useOnboardingStore()

  const handleImprovementSelect = (area) => {
    setImprovement(area)
    setTimeout(() => {
      router.push('/select-earning-goal')
    }, 200)
  }

  return (
    <div className='relative w-full min-h-screen flex justify-center items-center bg-black overflow-hidden'>
      {/* Background Screenshot with buttons baked in */}
      <Image
        src='/improvement.png'
        alt='Goal Background'
        layout='fill'
        objectFit='cover'
        priority
      />

      {/* Transparent clickable areas aligned over image buttons */}
      <div className='w-full max-w-md px-6'>
        <button
          onClick={() => handleImprovementSelect('Money')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[40%]'
          aria-label='Money'
        />
        <button
          onClick={() => handleImprovementSelect('Relax mind')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[50%]'
          aria-label='Relax mind'
        />
        <button
          onClick={() => handleImprovementSelect('Problem solving')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[60%]'
          aria-label='Problem solving'
        />
      </div>
    </div>
  )
}

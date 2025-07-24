'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useOnboardingStore from '@/stores/useOnboardingStore'

export default function EarningGoalSelection() {
  const router = useRouter()
  const { earning, setEarning } = useOnboardingStore()

  const handleEarningGoalSelect = (earningGoal) => {
    setEarning(earningGoal)
    setTimeout(() => {
      router.push('/sign-up')
    }, 200)
  }

  return (
    <div className='relative w-full min-h-screen flex justify-center items-center bg-black overflow-hidden'>
      {/* Background Screenshot with buttons baked in */}
      <Image
        src='/earning.png'
        alt='Goal Background'
        layout='fill'
        objectFit='cover'
        priority
      />

      {/* Transparent clickable areas aligned over image buttons */}
      <div className='w-full max-w-md px-6'>
        <button
          onClick={() => handleEarningGoalSelect('$20/day')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[40%]'
          aria-label='$20/day'
        />
        <button
          onClick={() => handleEarningGoalSelect('$50/day')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[50%]'
          aria-label='$50/day'
        />
        <button
          onClick={() => handleEarningGoalSelect('$100/day')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[61%]'
          aria-label='$100/day'
        />
        <button
          onClick={() => handleEarningGoalSelect('$200/day')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[72%]'
          aria-label='$200/day'
        />
      </div>
    </div>
  )
}

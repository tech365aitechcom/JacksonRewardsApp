'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function GoalSelection() {
  const router = useRouter()
  const [selectedGoal, setSelectedGoal] = useState(null)

  const handleGoalSelect = (goalId) => {
    setSelectedGoal(goalId)
    console.log('Selected goal:', goalId)
    setTimeout(() => {
      router.push('/select-gender')
    }, 200) // slight delay to show highlight before routing
  }

  return (
    <div className='relative w-full min-h-screen flex justify-center items-center bg-black overflow-hidden'>
      {/* Background Screenshot with buttons baked in */}
      <Image
        src='/goal.png'
        alt='Goal Background'
        layout='fill'
        objectFit='cover'
        priority
      />

      {/* Transparent clickable areas aligned over image buttons */}
      <div className='w-full max-w-md px-6'>
        <button
          onClick={() => handleGoalSelect('Overcome anxiety')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[40%]'
          aria-label='Overcome anxiety'
        />
        <button
          onClick={() => handleGoalSelect('Relax & collect rewards')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[50%]'
          aria-label='Relax & collect rewards'
        />
        <button
          onClick={() => handleGoalSelect('Other')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[60%]'
          aria-label='Other'
        />
      </div>
    </div>
  )
}

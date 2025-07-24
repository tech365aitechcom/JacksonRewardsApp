'use client'
import React from 'react'
import Image from 'next/image'

export default function GenderSelection() {
  const handleGoalSelect = (goalId) => {
    console.log('Selected gender:', goalId)
    // Navigate or store the selected gender
  }

  return (
    <div className='relative w-full min-h-screen flex justify-center items-center bg-black overflow-hidden'>
      {/* Background Screenshot with buttons baked in */}
      <Image
        src='/gender.png'
        alt='Goal Background'
        layout='fill'
        objectFit='cover'
        priority
      />

      {/* Transparent clickable areas aligned over image buttons */}
      <div className='w-full max-w-md px-6'>
        <button
          onClick={() => handleGoalSelect('Male')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[34%]'
          aria-label='Male'
        />
        <button
          onClick={() => handleGoalSelect('Female')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[45%]'
          aria-label='Female'
        />
        <button
          onClick={() => handleGoalSelect('Non-binary')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[56%]'
          aria-label='Non-binary'
        />
        <button
          onClick={() => handleGoalSelect('Other')}
          className='w-full h-16 rounded-full bg-transparent absolute top-[67%]'
          aria-label='Other'
        />
      </div>
    </div>
  )
}

'use client'
import React, { useState, useEffect } from 'react'
import { Geolocation } from '@capacitor/geolocation'

export default function LocationAccess() {
  const [permissionStatus, setPermissionStatus] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [showNativePromptExplanation, setShowNativePromptExplanation] =
    useState(true)
  const [currentLocation, setCurrentLocation] = useState(null)

  // Function to request location permissions
  const requestLocationPermission = async () => {
    try {
      // Request permissions
      const status = await Geolocation.requestPermissions()
      setPermissionStatus(status.location) // 'granted', 'denied', 'prompt'

      if (status.location === 'granted') {
        // If granted, try to get the current position
        const position = await Geolocation.getCurrentPosition()
        setCurrentLocation(position.coords)
        setLocationError(null)
        setShowNativePromptExplanation(false) // Hide explanation after permission is handled
      } else {
        setLocationError(
          'Location permission denied. Please enable it in your device settings.'
        )
        setShowNativePromptExplanation(false)
      }
    } catch (error) {
      console.error('Error requesting location permission:', error)
      if (error.message.includes('User denied location permission')) {
        setLocationError('Location access was denied by the user.')
      } else {
        setLocationError(
          'Could not get location. Please ensure location services are enabled.'
        )
      }
      setShowNativePromptExplanation(false)
    }
  }

  // Listen for permission changes (useful if user changes settings outside the app)
  useEffect(() => {
    const checkPermissions = async () => {
      const status = await Geolocation.checkPermissions()
      setPermissionStatus(status.location)
    }

    checkPermissions()

    // Optional: Add a listener for when the app comes to foreground to re-check permissions
    // This requires @capacitor/app plugin, but for simplicity, we'll keep it manual for now.
    // For a real app, you might want to re-check on app resume.
  }, [])

  const handleContinue = () => {
    setShowNativePromptExplanation(false) // Hide the initial screen
    requestLocationPermission() // Trigger the native prompt
  }

  const handleSkip = () => {
    setLocationError('Location access is required for full functionality.')
    setShowNativePromptExplanation(false)
  }

  return (
    <div className='h-screen bg-[#272052] flex flex-col items-center justify-start py-6 text-white font-poppins overflow-hidden'>
      {/* Background blur effect */}
      <div className='absolute w-[542px] h-[542px] top-0 left-0 bg-[#af7de6] rounded-full blur-[250px]' />

      {/* Header */}
      <div className='w-full max-w-md flex items-center px-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 mr-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15 19l-7-7 7-7'
          />
        </svg>
        <h1 className='text-xl font-semibold'>Location Access</h1>
      </div>
      {/* Main Content Area */}
      {showNativePromptExplanation ? (
        <div className='relative flex flex-col items-center justify-center flex-1 w-full max-w-md'>
          {/* Location Icon */}
          <div className='relative w-48 h-48 mb-8'>
            {/* Placeholder for the map and pin image */}
            <img
              src='/map.png'
              alt='Location Map'
              className='w-full h-full object-contain'
              onError={(e) => {
                e.target.onerror = null
                e.target.src =
                  'https://placehold.co/192x192/4F46E5/FFFFFF?text=Location'
              }}
            />
            {/* You could also use an SVG for the pin for better scalability if desired */}
            {/* <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4 w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg> */}
          </div>

          {/* Explanation Text */}
          <p className='text-center text-lg px-10 mb-12 leading-relaxed'>
            You must select "Allow While Using the App" on the next screen for
            Jackson app to work
          </p>

          {/* Buttons */}
          <div className='absolute bottom-0 w-full px-6 space-y-2 mb-8'>
            <button
              onClick={handleContinue}
              className='w-full bg-[#716AE7] text-white font-bold py-3 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105'
            >
              Continue
            </button>
            <button
              onClick={handleSkip}
              className='w-full text-center text-white text-sm font-semibold py-2 transition duration-300 ease-in-out'
            >
              Skip for now{' '}
              <span className='text-gray-400'>(Jackson won't work)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center flex-grow justify-center w-full max-w-md'>
          {locationError && (
            <p className='text-red-400 text-center text-lg px-6 mb-8'>
              {locationError}
            </p>
          )}
          {currentLocation && (
            <div className='text-center text-lg px-6 mb-8'>
              <p>Location Granted!</p>
              <p>Latitude: {currentLocation.latitude.toFixed(4)}</p>
              <p>Longitude: {currentLocation.longitude.toFixed(4)}</p>
            </div>
          )}
          {permissionStatus === 'prompt' && (
            <p className='text-white text-center text-lg px-6 mb-8'>
              Waiting for you to grant permission on the native prompt...
            </p>
          )}
          {permissionStatus === 'denied' && !locationError && (
            <p className='text-red-400 text-center text-lg px-6 mb-8'>
              Location permission was denied. Please enable it in your device
              settings.
            </p>
          )}
          {permissionStatus === 'granted' && !currentLocation && (
            <p className='text-white text-center text-lg px-6 mb-8'>
              Location permission granted. Attempting to fetch location...
            </p>
          )}
        </div>
      )}
    </div>
  )
}

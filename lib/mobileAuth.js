import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { Preferences } from '@capacitor/preferences'

// Initialize Google Auth for mobile
export const initGoogleAuth = async () => {
  try {
    await GoogleAuth.initialize({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    })
    console.log('Google Auth initialized successfully')
  } catch (error) {
    console.error('Google Auth initialization failed:', error)
  }
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await GoogleAuth.signIn()

    // Store user data locally
    await Preferences.set({
      key: 'user',
      value: JSON.stringify({
        id: result.id,
        email: result.email,
        name: result.name,
        image: result.imageUrl,
        accessToken: result.accessToken,
      }),
    })

    return {
      success: true,
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        image: result.imageUrl,
      },
    }
  } catch (error) {
    console.error('Google sign in failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Sign out
export const signOut = async () => {
  try {
    await GoogleAuth.signOut()
    await Preferences.remove({ key: 'user' })
    return { success: true }
  } catch (error) {
    console.error('Sign out failed:', error)
    return { success: false, error: error.message }
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const { value } = await Preferences.get({ key: 'user' })
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Get current user failed:', error)
    return null
  }
}

// Check if user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser()
  return !!user
}

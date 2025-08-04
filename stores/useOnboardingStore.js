'use client'
import { create } from 'zustand'
import { Storage } from '@capacitor/storage'

const STORAGE_KEY = 'onboarding-data'

const useOnboardingStore = create((set, get) => ({
  currentStep: 1,
  ageRange: null,
  gender: null,
  gamePreferences: [],
  gameStyle: null,
  gameHabit: null,

  setCurrentStep: async (step) => {
    set({ currentStep: step })
    await saveToStorage({ ...get(), currentStep: step })
  },

  setAgeRange: async (ageRange) => {
    set({ ageRange })
    await saveToStorage({ ...get(), ageRange })
  },

  setGender: async (gender) => {
    set({ gender })
    await saveToStorage({ ...get(), gender })
  },

  setGamePreferences: async (prefs) => {
    const safePrefs = Array.isArray(prefs) ? prefs : []
    set({ gamePreferences: safePrefs })
    await saveToStorage({ ...get(), gamePreferences: safePrefs })
  },

  setGameStyle: async (gameStyle) => {
    set({ gameStyle })
    await saveToStorage({ ...get(), gameStyle })
  },

  setGameHabit: async (gameHabit) => {
    set({ gameHabit })
    await saveToStorage({ ...get(), gameHabit })
  },

  loadFromStorage: async () => {
    const result = await Storage.get({ key: STORAGE_KEY })
    if (result.value) {
      const data = JSON.parse(result.value)
      set({
        ...data,
        gamePreferences: Array.isArray(data.gamePreferences)
          ? data.gamePreferences
          : [],
      })
    }
  },

  resetOnboarding: async () => {
    const reset = { goal: null, gender: null, ageRange: null }
    set(reset)
    await Storage.remove({ key: STORAGE_KEY })
  },
}))

async function saveToStorage(data) {
  await Storage.set({
    key: STORAGE_KEY,
    value: JSON.stringify({
      currentStep: data.currentStep,
      ageRange: data.ageRange,
      gender: data.gender,
      gamePreferences: data.gamePreferences,
      gameStyle: data.gameStyle,
      gameHabit: data.gameHabit,
    }),
  })
}

export default useOnboardingStore

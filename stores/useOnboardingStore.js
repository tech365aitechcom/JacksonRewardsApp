'use client'
import { create } from 'zustand'
import { Storage } from '@capacitor/storage'

const STORAGE_KEY = 'onboarding-data'

const useOnboardingStore = create((set, get) => ({
  goal: null,
  gender: null,
  ageRange: '25-30',
  improvement: null,
  earning: null,

  setGoal: async (goal) => {
    set({ goal })
    await saveToStorage({ ...get(), goal })
  },

  setGender: async (gender) => {
    set({ gender })
    await saveToStorage({ ...get(), gender })
  },

  setAgeRange: async (ageRange) => {
    set({ ageRange })
    await saveToStorage({ ...get(), ageRange })
  },

  setImprovement: async (improvement) => {
    set({ improvement })
    await saveToStorage({ ...get(), improvement })
  },

  setEarning: async (earning) => {
    set({ earning })
    await saveToStorage({ ...get(), earning })
  },

  loadFromStorage: async () => {
    const result = await Storage.get({ key: STORAGE_KEY })
    if (result.value) {
      const data = JSON.parse(result.value)
      set(data)
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
      goal: data.goal,
      gender: data.gender,
      ageRange: data.ageRange,
      improvement: data.improvement,
      earning: data.earning,
    }),
  })
}

export default useOnboardingStore

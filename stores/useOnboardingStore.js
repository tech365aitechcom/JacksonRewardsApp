import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { updateOnboardingData } from "@/lib/api";

const useOnboardingStore = create(
  persist(
    (set, get) => ({
      // Data for Onboarding Steps
      mobile: null,
      currentStep: 1,
      ageRange: null,
      gender: null,
      gamePreferences: [],
      gameStyle: null,
      gameHabit: null, // UI state, not sent to API

      // Additional Fields for Signup API
      improvementArea: "budgeting",
      dailyEarningGoal: 100,

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),
      setMobile: (mobile) => set({ mobile }),

      // Async Setters that call the "save-as-you-go" API
      setAgeRange: async (age) => {
        set({ ageRange: age });
        const mobile = get().mobile;
        if (mobile) {
          try {
            await updateOnboardingData("ageRange", age, mobile);
          } catch (error) {
            console.error("Failed to save age range:", error.message);
          }
        }
      },

      setGender: async (gender) => {
        set({ gender });
        const mobile = get().mobile;
        if (mobile) {
          try {
            await updateOnboardingData("gender", gender, mobile);
          } catch (error) {
            console.error("Failed to save gender:", error.message);
          }
        }
      },

      // Setters that only update local state
      setGamePreferences: (preferences) =>
        set({ gamePreferences: preferences }),
      setGameStyle: (style) => set({ gameStyle: style }),
      setGameHabit: (habit) => set({ gameHabit: habit }),

      // Reset the store after a successful signup
      resetOnboarding: () =>
        set({
          mobile: null,
          currentStep: 1,
          ageRange: null,
          gender: null,
          gamePreferences: [],
          gameStyle: null,
          gameHabit: null,
          improvementArea: "budgeting",
          dailyEarningGoal: 100,
        }),

      loadFromStorage: () => Promise.resolve(),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useOnboardingStore;

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Safe localStorage utilities for Next.js SSR
export const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  },

  setItem: (key, value) => {
    if (typeof window === "undefined") return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error("Error setting localStorage:", error);
      return false;
    }
  },

  removeItem: (key) => {
    if (typeof window === "undefined") return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  },
};

/**
 * Get user data from localStorage as fallback when Redux profile fails
 * @returns {Object|null} User object with age and gender, or null if not found
 */
// DEBUG: track how many times this is called to detect loops
let _getUserCallCount = 0;

export const getUserFromLocalStorage = () => {
  if (typeof window === "undefined") return null;

  _getUserCallCount++;
  const callId = _getUserCallCount;

  try {
    // Try to get user from localStorage key "user"
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      // Validate it's a proper user object
      if (
        user &&
        typeof user === "object" &&
        (user.age || user.ageRange || user.gender || user._id)
      ) {

        return user;
      } else {
        console.warn(`[getUserFromLocalStorage] #${callId} → "user" key exists but failed validation:`, user);
      }
    } else {
      console.warn(`[getUserFromLocalStorage] #${callId} → no "user" key in localStorage`);
    }

    // Try to get from Redux persist storage
    const persistProfile = localStorage.getItem("persist:profile");
    if (persistProfile) {
      const profileData = JSON.parse(persistProfile);
      if (profileData.details) {
        const details = JSON.parse(profileData.details);
        // Check if details is not an error object
        if (
          details &&
          typeof details === "object" &&
          !details.success === false &&
          !details.error
        ) {
          if (
            details.age ||
            details.ageRange ||
            details.gender ||
            details._id
          ) {

            return details;
          } else {
            console.warn(`[getUserFromLocalStorage] #${callId} → persist:profile.details found but missing age/gender/_id`);
          }
        } else {
          console.warn(`[getUserFromLocalStorage] #${callId} → persist:profile.details is error/invalid:`, details);
        }
      } else {
        console.warn(`[getUserFromLocalStorage] #${callId} → persist:profile exists but no details key`);
      }
    } else {
      console.warn(`[getUserFromLocalStorage] #${callId} → no persist:profile in localStorage`);
    }
  } catch (error) {
    console.error(`[getUserFromLocalStorage] #${callId} → ERROR reading localStorage:`, error);
  }

  console.warn(`[getUserFromLocalStorage] #${callId} → returning NULL — no valid user found`);
  return null;
};

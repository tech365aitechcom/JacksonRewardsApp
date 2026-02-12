/**
 * Verisoul Frontend SDK Integration
 * Official Browser SDK Integration
 * Documentation: https://docs.verisoul.ai/integration/frontend/browser
 */

const VERISOUL_API_KEY = process.env.NEXT_PUBLIC_VERISOUL_API_KEY;

if (!VERISOUL_API_KEY) {
  console.warn("⚠️ [Verisoul] NEXT_PUBLIC_VERISOUL_API_KEY is not set. Please add it to your .env file.");
}

// IMPORTANT: Default to PRODUCTION because the client project_id is prod.
// If you ever need sandbox, explicitly set NEXT_PUBLIC_VERISOUL_BASE_URL to the sandbox URL.
const VERISOUL_BASE_URL =
  process.env.NEXT_PUBLIC_VERISOUL_BASE_URL || "https://api.verisoul.ai";

const VERISOUL_ENV = VERISOUL_BASE_URL.includes("sandbox") ? "sandbox" : "prod";

let isInitialized = false;
let sessionId = null;

/**
 * Wait for Verisoul SDK to be available
 * @param {number} maxWaitMs - Maximum time to wait in milliseconds
 * @returns {Promise<boolean>} - True if SDK is available, false otherwise
 */
const waitForVerisoul = (maxWaitMs = 10000) => {
  return new Promise((resolve) => {
    // Check immediately
    if (typeof window !== "undefined" && window.Verisoul && typeof window.Verisoul.session === "function") {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (typeof window !== "undefined" && window.Verisoul && typeof window.Verisoul.session === "function") {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > maxWaitMs) {
        clearInterval(checkInterval);
        console.warn("⚠️ [Verisoul] SDK not available after waiting");
        resolve(false);
      }
    }, 100);
  });
};

/**
 * Initialize Verisoul SDK
 * This should be called early in the app lifecycle
 * Official API: https://docs.verisoul.ai/integration/frontend/browser
 */
export const initializeVerisoulSDK = async () => {
  if (typeof window === "undefined") {
    console.warn("⚠️ [Verisoul] Cannot initialize on server side");
    return { success: false, error: "Server side initialization not supported" };
  }

  if (isInitialized && sessionId) {
    console.log("✅ [Verisoul] SDK already initialized with session:", sessionId);
    return { success: true, sessionId };
  }

  try {
    // Wait for Verisoul SDK to load from HTML script tag
    const sdkAvailable = await waitForVerisoul();

    if (!sdkAvailable) {
      // SDK not available - use fallback (this is expected until SDK loads)
      // Only log once during initialization to avoid console spam
      if (!isInitialized) {
        console.log("ℹ️ [Verisoul] Waiting for SDK to load, using fallback session ID");
      }
      // Generate a fallback session ID
      sessionId = generateFallbackSessionId();
      isInitialized = true;
      return { success: true, sessionId, fallback: true };
    }

    // Get session ID using official Verisoul.session() API
    // Documentation: https://docs.verisoul.ai/integration/frontend/browser#session
    if (window.Verisoul && typeof window.Verisoul.session === "function") {
      try {
        // Official API: Verisoul.session() returns Promise<{session_id}>
        const result = await window.Verisoul.session();
        
        if (result && result.session_id) {
          sessionId = result.session_id;
          isInitialized = true;
          console.log("✅ [Verisoul] SDK initialized successfully with session:", sessionId);
          return { success: true, sessionId };
        } else if (typeof result === "string") {
          // Handle case where session() returns string directly
          sessionId = result;
          isInitialized = true;
          console.log("✅ [Verisoul] SDK initialized successfully with session:", sessionId);
          return { success: true, sessionId };
        } else {
          console.warn("⚠️ [Verisoul] Unexpected session() response format:", result);
          sessionId = generateFallbackSessionId();
          isInitialized = true;
          return { success: true, sessionId, fallback: true };
        }
      } catch (sessionError) {
        console.error("❌ [Verisoul] Error getting session ID:", sessionError);
        // Use fallback on error
        sessionId = generateFallbackSessionId();
        isInitialized = true;
        return { success: true, sessionId, fallback: true };
      }
    } else {
      // Fallback if SDK not available
      sessionId = generateFallbackSessionId();
      isInitialized = true;
      return { success: true, sessionId, fallback: true };
    }
  } catch (error) {
    console.error("❌ [Verisoul] Initialization error:", error);
    // Use fallback even on error
    sessionId = generateFallbackSessionId();
    isInitialized = true;
    return { success: true, sessionId, fallback: true, error: error.message };
  }
};

/**
 * Generate a fallback session ID when SDK is not available
 */
const generateFallbackSessionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const deviceId = localStorage.getItem("deviceId") || "unknown";
  return `fallback_${timestamp}_${random}_${deviceId.substring(0, 8)}`;
};

/**
 * Get current Verisoul session ID
 * Uses official Verisoul.session() API
 * @returns {Promise<string|null>} Session ID or null
 */
export const getVerisoulSessionId = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // If not initialized, initialize first
    if (!isInitialized) {
      const initResult = await initializeVerisoulSDK();
      if (initResult.success && initResult.sessionId) {
        return initResult.sessionId;
      }
    }

    // Return stored session ID
    if (sessionId) {
      return sessionId;
    }

    // Try to get from SDK again using official API
    if (window.Verisoul && typeof window.Verisoul.session === "function") {
      try {
        const result = await window.Verisoul.session();
        if (result && result.session_id) {
          sessionId = result.session_id;
          return sessionId;
        } else if (typeof result === "string") {
          sessionId = result;
          return sessionId;
        }
      } catch (error) {
        console.error("❌ [Verisoul] Error getting session ID:", error);
      }
    }

    return null;
  } catch (error) {
    console.error("❌ [Verisoul] Error getting session ID:", error);
    return null;
  }
};

/**
 * Reinitialize Verisoul session
 * Official API: https://docs.verisoul.ai/integration/frontend/browser#reinitialize
 * Useful when user logs out to generate a new session_id
 */
export const reinitializeVerisoulSession = async () => {
  try {
    // Clear existing session
    sessionId = null;
    isInitialized = false;

    // Use official Verisoul.reinitialize() API
    if (window.Verisoul && typeof window.Verisoul.reinitialize === "function") {
      try {
        await window.Verisoul.reinitialize();
        console.log("✅ [Verisoul] Session reinitialized");
      } catch (error) {
        console.error("❌ [Verisoul] Error reinitializing:", error);
      }
    }

    // Get new session ID
    const result = await initializeVerisoulSDK();
    return result;
  } catch (error) {
    console.error("❌ [Verisoul] Error reinitializing:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if Verisoul SDK is initialized
 */
export const isVerisoulSDKInitialized = () => {
  return isInitialized;
};

/**
 * Get current session ID (sync version)
 * Returns null if not initialized
 */
export const getCurrentSessionId = () => {
  return sessionId;
};

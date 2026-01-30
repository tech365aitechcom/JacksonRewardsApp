import { getUserFromLocalStorage } from "./utils";

// A custom error class to hold structured API error data
class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

const BASE_URL = "https://rewardsapi.hireagent.co" || "http://localhost:5000";

// Performance optimization: Only log in development or when explicitly enabled
const DEBUG_API = typeof window !== 'undefined' && (
  process.env.NODE_ENV === 'development' || 
  localStorage.getItem('debug_api') === 'true'
);

// Optimized logging function - only logs if DEBUG_API is true
const apiLog = (...args) => {
  if (DEBUG_API) {
    console.log(...args);
  }
};

const apiError = (...args) => {
  // Always log errors, but less verbose
  if (DEBUG_API) {
    console.error(...args);
  } else {
    // In production, only log critical errors
    const lastArg = args[args.length - 1];
    if (lastArg?.error || lastArg?.message) {
      console.error('API Error:', lastArg.error || lastArg.message);
    }
  }
};
// const BASE_URL = "http://localhost:4001";
// const BASE_URL = "http://10.0.2.2:4001";

const handleResponse = async (response) => {
  try {
    apiLog("🔍 [API] handleResponse called, status:", response.status);
    const contentType = response.headers.get("content-type");
    
    let responseData;

    if (response.status === 204) {
      return { success: true, data: null };
    }

    // Handle HTML responses (usually 404 or error pages)
    const isHtml = contentType && contentType.includes("text/html");
    
    if (isHtml) {
      const htmlText = await response.text();
      apiError("⚠️ [API] Received HTML response instead of JSON");
      
      // If it's HTML (likely 404), provide a more helpful error
      if (response.status === 404) {
        throw new ApiError(
          "API endpoint not found. Please ensure the backend routes are implemented.",
          response.status,
          { html: htmlText.substring(0, 200) }
        );
      }
      throw new ApiError(
        `Server returned HTML instead of JSON. Status: ${response.status}. This usually means the endpoint doesn't exist or the server is misconfigured.`,
        response.status,
        { html: htmlText.substring(0, 200) }
      );
    }

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
      apiLog("🔍 [API] JSON parsed successfully");
    } else {
      const textData = await response.text();
      responseData = { message: textData };
    }

    if (!response.ok) {
      apiError("❌ [API] Response not OK, status:", response.status, responseData);
      
      const errorMessage =
        responseData.error ||
        (responseData.errors && responseData.errors[0]?.msg) ||
        responseData.message ||
        `HTTP error! status: ${response.status}`;
      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData;
  } catch (error) {
    apiError("❌ [API] handleResponse error:", error);
    throw error; // Re-throw to be caught by apiRequest
  }
};

const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  token = null,
  isFormData = false,
  options = {}
) => {
  const headers = {};

  // Only set Content-Type for non-FormData requests
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    // Endpoints that require Bearer token
    const needsBearer = [
      "/api/cash-coach",
      "/api/vip",
      "/api/payment",
      "/api/game",
      "/api/profile/notifications",
      "/api/biometric",
      "/api/non-game-offers",
      "/api/daily-rewards",
      "/api/daily-challenge",
      "/api/xp-tier",
      "/api/user/game-offers",
    ].some((p) => endpoint.startsWith(p));
    if (needsBearer) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      // Payout endpoints use x-auth-token (protect middleware)
      headers["x-auth-token"] = token;
    }
  }

  const config = { method, headers };
  if (body) {
    if (isFormData) {
      config.body = body; // Use FormData directly
    } else {
      config.body = JSON.stringify(body);
    }
  }

  try {
    apiLog("🔍 [API] apiRequest:", method, endpoint);
    
    // Add timeout to prevent hanging (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      apiError("❌ [API] Request timeout:", endpoint);
    }, 30000);
    
    const fetchConfig = {
      ...config,
      signal: controller.signal
    };
    
    const fetchStartTime = Date.now();
    const response = await fetch(`${BASE_URL}${endpoint}`, fetchConfig);
    
    clearTimeout(timeoutId);
    const fetchDuration = Date.now() - fetchStartTime;
    
    // Only log slow requests (> 1 second) or in debug mode
    if (fetchDuration > 1000 || DEBUG_API) {
      apiLog(`🔍 [API] ${endpoint} completed in ${fetchDuration}ms, status: ${response.status}`);
    }
    
    const result = await handleResponse(response);
    
    // For biometric endpoints, ensure consistent response structure
    if (endpoint.includes("/biometric")) {
      // For status endpoint, preserve isRegistered flag and log for debugging
      if (endpoint.includes("/biometric/status")) {
        // Backend returns: { success: true, isRegistered: true/false, ... }
        // Preserve the structure as-is
        apiLog("🔍 [API] Biometric status response:", JSON.stringify(result, null, 2));
        return result;
      }
      
      // For login/setup endpoints, extract token and user
      if (result.success && result.data) {
        return {
          ...result,
          token: result.data.token || result.token,
          user: result.data.user || result.user,
        };
      }
      // If backend returns token/user directly, preserve them
      if (result.token || result.user) {
        return result;
      }
    }
    
    return result;
  } catch (error) {
    apiError("❌ [API] apiRequest error:", {
      endpoint,
      error: error.message,
      type: error.name
    });
    
    // Handle AbortError (timeout)
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: "Request timeout. Please check your internet connection and try again.",
        status: 0,
        timeout: true
      };
    }
    
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        status: error.status,
        body: error.body,
      };
    } else {
      // Handle network errors
      return {
        success: false,
        error: error.message || "A network error occurred. Please try again.",
        status: 0,
      };
    }
  }
};

// --- Authentication Endpoints ---
export const sendOtp = (mobile) =>
  apiRequest("/api/auth/send-otp", "POST", { mobile });
export const verifyOtp = (mobile, otp) =>
  apiRequest("/api/auth/verify-otp", "POST", { mobile, otp });
export const signup = (userData) =>
  apiRequest("/api/auth/signup", "POST", userData);
export const login = (emailOrMobile, password, turnstileToken = null) => {
  const body = { emailOrMobile, password };
  if (turnstileToken) {
    body.turnstileToken = turnstileToken;
  }
  return apiRequest("/api/auth/login", "POST", body);
};

// --- Onboarding Endpoints ---
export const getOnboardingOptions = (screenName) =>
  apiRequest(`/api/onboarding/options/${screenName}`);
export const updateOnboardingData = (field, value, mobile) => {
  const fieldMapping = {
    ageRange: { endpoint: "/api/onboarding/age-range", key: "ageRange" },
    gender: { endpoint: "/api/onboarding/gender", key: "gender" },
    improvementArea: {
      endpoint: "/api/onboarding/improvement-area",
      key: "area",
    },
    dailyEarningGoal: {
      endpoint: "/api/onboarding/daily-earning-goal",
      key: "goal",
    },
  };
  const mapping = fieldMapping[field];
  if (!mapping) {
    return Promise.resolve();
  }
  const body = { mobile, [mapping.key]: value };
  return apiRequest(mapping.endpoint, "PUT", body);
};

// --- Disclosure Endpoints ---
export const acceptDisclosure = (token) =>
  apiRequest("/api/disclosure/accept", "POST", null, token);

// --- Location Endpoints ---
export const updateLocation = (locationData, token) =>
  apiRequest("/api/location/report", "POST", locationData, token);
export const getLocationHistory = (token) =>
  apiRequest("/api/location/history", "GET", null, token);

// --- Biometric/Face Verification Endpoints ---
// POST /api/biometric/setup - Register biometric (requires mobile, type, verificationData, deviceId)
export const registerFace = (faceData, token) =>
  apiRequest("/api/biometric/setup", "POST", faceData, token);

// POST /api/biometric/verify - Verify biometric (requires token, verificationData, deviceId, scanType)
export const verifyFace = (verificationData, token) =>
  apiRequest("/api/biometric/verify", "POST", verificationData, token);

// POST /api/biometric/reset - Reset biometric (requires mobile)
export const resetBiometric = (mobile) =>
  apiRequest("/api/biometric/reset", "POST", { mobile });

// NOTE: toggleBiometric endpoint doesn't exist in backend - removed to prevent errors
// If needed, use registerFace or verifyFace instead
export const checkBiometricStatus = async (identifier) => {
  // Handle both mobile and email
  // Mobile numbers can be in various formats: +919999988888, 919999988888, etc.
  // Email contains @ symbol
  try {
    apiLog("🔍 [API] checkBiometricStatus:", identifier);
    
    let endpoint;
    if (identifier && identifier.includes("@")) {
      endpoint = `/api/biometric/status?email=${encodeURIComponent(identifier)}`;
    } else {
      // Treat as mobile number
      endpoint = `/api/biometric/status?mobile=${encodeURIComponent(identifier)}`;
    }
    
    const result = await apiRequest(endpoint, "GET");
    
    // Only log full response in debug mode
    if (DEBUG_API) {
      apiLog("🔍 [DEBUG] API Response received:", JSON.stringify(result, null, 2));
    }
    
    return result;
  } catch (error) {
    apiError("❌ [API] checkBiometricStatus error:", error);
    
    // Return error object instead of throwing
    return {
      error: error.message || "Failed to check biometric status",
      status: error.status || 0,
      success: false
    };
  }
};
export const checkBiometricStatusByDevice = (deviceId) =>
  apiRequest(`/api/biometric/status?deviceId=${encodeURIComponent(deviceId)}`, "GET");
export const biometricLogin = (loginData) =>
  apiRequest("/api/biometric/biometric-login", "POST", loginData);

// --- Achievements Endpoints ---
export const getUserAchievements = (
  token,
  category = "games",
  status = "completed"
) =>
  apiRequest(
    `/api/achievements/user?category=${category}&status=${status}`,
    "GET",
    null,
    token
  );

// --- Profile Endpoints ---
export const getProfile = (token) =>
  apiRequest("/api/profile", "GET", null, token);
export const getProfileStats = (token) =>
  apiRequest("/api/profile/stats", "GET", null, token);
export const updateProfile = (profileData, token) =>
  apiRequest("/api/profile", "PUT", profileData, token);
// --- Notification Endpoints ---
export const getUserNotifications = (token) =>
  apiRequest("/api/profile/notifications", "GET", null, token);
export const dismissNotification = (notificationId, token) =>
  apiRequest(
    `/api/profile/notifications/${notificationId}/dismiss`,
    "POST",
    null,
    token
  );
export const uploadAvatar = async (avatarFile, token) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);
  const headers = { "x-auth-token": token };
  try {
    const response = await fetch(`${BASE_URL}/api/profile/avatar`, {
      method: "POST",
      headers,
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(
      error.message || "A network error occurred. Please try again."
    );
  }
};

// --- VIP Endpoints ---
export const getVipStatus = (token) =>
  apiRequest("/api/vip/status", "GET", null, token);
export const getHomeDashboard = (token) =>
  apiRequest("/api/dashboard", "GET", null, token);

// --- Welcome Bonus Timer Endpoint ---
export const getWelcomeBonusTimer = (token) =>
  apiRequest("/api/user/game-offers/welcome-bonus-timer", "GET", null, token);

export const forgotPassword = (email) =>
  apiRequest("/api/auth/forgot-password", "POST", { identifier: email });
export const resetPassword = (token, newPassword) =>
  apiRequest("/api/auth/reset-password", "POST", { token, newPassword });
// --- NEW: Cash Coach Endpoints (Following the exact same pattern) ---
// ===================================================================
export const getFinancialGoals = (token) =>
  apiRequest("/api/cash-coach/financial-goals", "GET", null, token);

export const updateFinancialGoals = (goalsData, token) =>
  apiRequest("/api/cash-coach/financial-goals", "PUT", goalsData, token);

// --- VIP MEMBERSHIP & PAYMENT ENDPOINTS ---
// These functions align with your Postman collection and are called by the Redux slice.

/**
 * Fetches all available VIP tiers and their pricing for a given region.
 * This is a public endpoint and does not require a token.
 * Note: Your original file was calling `/api/vip/tiers` but your Postman collection has `/vip/tiers`. The BASE_URL includes `/api`.
 * So the endpoint should be `/vip/tiers`.
 * @param {string} region - The region code (e.g., "US").
 */
export const getVipTiers = (region = "US") =>
  apiRequest(`/api/vip/tiers?region=${region}`);

/**
 * Initiates the upgrade process by creating a 'pending' subscription record.
 * @param {object} data - The upgrade data: { tierId, plan, region }.
 * @param {string} token - The user's authentication token.
 */
export const initiateUpgrade = (data, token) =>
  apiRequest("/api/vip/upgrade", "POST", data, token);

/**
 * Initiates the payment with the payment provider (e.g., Stripe).
 * @param {object} data - The payment data: { subscriptionId, paymentMethod }.
 * @param {string} token - The user's authentication token.
 */

// --- OTHER API FUNCTIONS (UNCHANGED) ---
// ... (Your other functions like getVipStatus, login, signup, etc. would go here)
export const startPayment = (data, token) =>
  apiRequest("/api/payment/initiate", "POST", data, token);

/**
 * Confirms that the payment was successful, activating the subscription.
 * NOTE: In a modern payment flow with webhooks, this endpoint might not be called
 * from the client. The payment provider (e.g., Stripe) would notify the backend
 * directly via a webhook, which is more secure.
 * @param {object} data - The confirmation data: { paymentIntentId, subscriptionId }.
 * @param {string} token - The user's authentication token.
 */
export const confirmPayment = (data, token) => {
  return apiRequest("/api/payment/confirm", "POST", data, token);
};

// --- WALLET TRANSACTIONS ENDPOINTS ---
export const getWalletTransactions = (token, limit = 5) =>
  apiRequest(`/api/wallet/transactions?limit=${limit}`, "GET", null, token);

export const getFullWalletTransactions = (
  token,
  page = 1,
  limit = 20,
  type = "all"
) =>
  apiRequest(
    `/api/wallet/transactions?page=${page}&limit=${limit}&type=${type}`,
    "GET",
    null,
    token
  );

export const getWalletScreen = (token) =>
  apiRequest("/api/wallet-screen", "GET", null, token);

// --- WITHDRAWAL/PAYOUT ENDPOINTS ---
export const getWithdrawalMethods = (token, queryParams = {}) => {
  const params = new URLSearchParams({
    currency_code: "USD",
    country: "US",
    ...queryParams,
  }).toString();
  return apiRequest(`/api/methods?${params}`, "GET", null, token);
};

export const getFundingSources = (token, queryParams = {}) => {
  const params = new URLSearchParams({
    currency_code: "USD",
    country: "US",
    ...queryParams,
  }).toString();
  return apiRequest(
    `/api/payout/funding-sources?${params}`,
    "GET",
    null,
    token
  );
};

export const createWithdrawal = (withdrawalData, token) =>
  apiRequest("/api/payout/create", "POST", withdrawalData, token);

export const getWithdrawalHistory = (token, page = 1, limit = 20) =>
  apiRequest(
    `/api/payout/history?page=${page}&limit=${limit}`,
    "GET",
    null,
    token
  );

export const getWithdrawalStatus = (orderId, token) =>
  apiRequest(`/api/payout/${orderId}/status`, "GET", null, token);

// --- TREMENDOUS API ENDPOINTS ---
export const getTremendousMethods = (token, queryParams = {}) => {
  const params = new URLSearchParams({
    currency: "USD",
    country: "US",
    ...queryParams,
  }).toString();
  return apiRequest(`/api/payouts/methods?${params}`, "GET", null, token);
};

export const getTremendousFundingSources = (token, queryParams = {}) => {
  const params = new URLSearchParams({
    currency: "USD",
    country: "US",
    ...queryParams,
  }).toString();
  return apiRequest(
    `/api/payouts/funding-sources?${params}`,
    "GET",
    null,
    token
  );
};

export const createTremendousPayout = (payoutData, token) =>
  apiRequest("/api/payouts/create", "POST", payoutData, token);

export const getTremendousOrderStatus = (orderId, token) =>
  apiRequest(`/api/payouts/${orderId}/status`, "GET", null, token);

// --- BESITOS GAME API ENDPOINTS ---
// Base URL for Besitos API - HARDCODED FOR TESTING ONLY
const BESITOS_BASE_URL = "http://localhost:4001";

// Custom API request function for Besitos endpoints
const besitosApiRequest = async (endpoint, method = "GET", body = null) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "JacksonRewardsApp/1.0.0 (Android)",
    "X-Platform": "android",
    "X-App-Version": "1.0.0",
    // Add VPN-friendly headers
    "X-Forwarded-For": "auto-detect",
    "X-Real-IP": "auto-detect",
  };

  // Attach bearer token if available to avoid 401 on protected endpoints
  try {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
  } catch (_) {
    // ignore storage errors
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BESITOS_BASE_URL}${endpoint}`, config);
    return handleResponse(response);
  } catch (error) {

    // Handle specific error types for Android and VPN
    if (error.name === "AbortError") {
      // Check if user is using VPN and provide specific guidance
      const isVpnDetected =
        navigator.connection?.type === "cellular" &&
        navigator.connection?.effectiveType === "4g" &&
        window.location.protocol === "https:";

      if (isVpnDetected) {
        throw new Error(
          "Request timeout detected. VPN connection may be causing delays. Please try switching VPN servers or temporarily disabling VPN."
        );
      } else {
        throw new Error(
          "Request timeout. Please check your internet connection."
        );
      }
    } else if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Network error. Please check your internet connection and VPN settings."
      );
    } else if (error instanceof ApiError) {
      throw error;
    } else {
      throw new Error(
        error.message || "A network error occurred. Please try again."
      );
    }
  }
};

/**
 * Fetch user data from Besitos API (User Data API)
 * This returns available, in_progress, and completed games for a specific user
 * @param {string} userId - User ID
 * @param {string} token - User authentication token
 * @returns {Promise} User data object with games categorized by status
 */
export const getUserData = (userId, token) => {
  // Use the production API endpoint with live base URL
  let endpoint = `/api/besitos/user-data/${userId}`;
  const params = new URLSearchParams();

  if (token) {
    params.append("token", token);
  }

  if (params.toString()) {
    endpoint += `?${params.toString()}`;
  }

  // Use main apiRequest function to use production BASE_URL
  return apiRequest(endpoint, "GET", null, token);
};

/**
 * Fetch conversions from Besitos API
 * @returns {Promise} Array of conversions
 */
export const getConversions = () => besitosApiRequest("/conversions");

/**
 * Fetch surveys from Besitos API
 * @param {string} userId - User ID
 * @param {string} device - Device type (default: "mobile")
 * @param {string} userIp - User IP address
 * @returns {Promise} Array of surveys
 */
export const getSurveys = (userId, device = "mobile", userIp) =>
  besitosApiRequest(`/surveys/${userId}?device=${device}&user_ip=${userIp}`);

/**
 * Fetch user profiling data from Besitos API
 * @param {string} userId - User ID
 * @returns {Promise} User profiling data
 */
export const getUserProfiling = (userId) =>
  besitosApiRequest(`/user-profiling/${userId}`);

/**
 * Fetch messenger data from Besitos API
 * @param {string} userId - User ID
 * @returns {Promise} Messenger data
 */
export const getMessenger = (userId) =>
  besitosApiRequest(`/messenger/${userId}`);

/**
 * Fetch offers/games from Besitos API
 * @param {Object} params - Parameters object
 * @param {number} params.per_page - Number of records per page (default: 5)
 * @param {string} params.device_platform - Device platform (android/ios)
 * @param {number} params.page - Page number (default: 1)
 * @returns {Promise} Array of offers/games
 */
export const getOffers = ({
  per_page = 5,
  device_platform = "android",
  page = 1,
} = {}) => {
  const params = new URLSearchParams();

  if (per_page) params.append("per_page", per_page);
  if (device_platform) params.append("device_platform", device_platform);
  if (page) params.append("page", page);

  const endpoint = `/offers?${params.toString()}`;

  return besitosApiRequest(endpoint);
};

// --- NEW GAME DISCOVERY API ENDPOINTS ---
/**
 * Get games by UI section (replaces old offers API)
 * @param {string} uiSection - UI section name (e.g., "Swipe", "Most Played", "Cash Coach Recommendation")
 * @param {string} ageGroup - Age group (e.g., "18-24", "25-34") - will be overridden by user.age or user.ageRange if user is provided
 * @param {string} gender - Gender (e.g., "male", "female") - will be overridden by user.gender if user is provided
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of games per page (default: 20)
 * @param {string} token - User authentication token
 * @param {Object} user - User object with age/ageRange and gender properties - if provided, will be used instead of ageGroup and gender parameters
 * @returns {Promise} Array of games for the specified UI section
 */
export const getGamesBySection = async ({
  uiSection = "Swipe",
  ageGroup = "18-24",
  gender = "male",
  page = 1,
  limit = 20,
  token = null,
  user = null,
} = {}) => {
  // Extract age group and gender from user object if provided
  let finalAgeGroup = ageGroup;
  let finalGender = gender;

  // Validate user object - don't use error objects or invalid responses
  const isErrorObject =
    user && typeof user === "object" && (user.success === false || user.error);
  const isValidUserObject =
    user &&
    typeof user === "object" &&
    !Array.isArray(user) &&
    !isErrorObject && // Don't use error responses
    (user.age !== undefined ||
      user.ageRange !== undefined ||
      user.gender !== undefined ||
      user._id !== undefined); // Must have at least one user property

  // If user object is invalid, try to get from localStorage as fallback
  let userToUse = isValidUserObject ? user : null;
  if (!userToUse) {
    userToUse = getUserFromLocalStorage();
  } else {
    // Even if Redux user is valid, check if it has age/gender
    // If not, try to get from localStorage and merge
    const hasAgeOrGender =
      userToUse.age || userToUse.ageRange || userToUse.gender;
    if (!hasAgeOrGender) {
      const localStorageUser = getUserFromLocalStorage();
      if (
        localStorageUser &&
        (localStorageUser.age ||
          localStorageUser.ageRange ||
          localStorageUser.gender)
      ) {
        // Merge localStorage data with Redux user (localStorage has priority for age/gender)
        userToUse = {
          ...userToUse,
          age: localStorageUser.age || userToUse.age,
          ageRange: localStorageUser.ageRange || userToUse.ageRange,
          gender: localStorageUser.gender || userToUse.gender,
        };
      }
    }
  }

  if (userToUse) {
    // Extract age group from user object
    // Check both top-level and nested properties
    // Priority: ageRange > age (if age is string like "25-34") > age (if age is number, convert to age group)
    const userAge =
      userToUse.age || userToUse.profile?.age || userToUse.details?.age;
    const userAgeRange =
      userToUse.ageRange ||
      userToUse.profile?.ageRange ||
      userToUse.details?.ageRange;

    if (userAgeRange && typeof userAgeRange === "string") {
      finalAgeGroup = userAgeRange;
    } else if (userAge !== undefined && userAge !== null) {
      // Check if age is already in age group format (string like "25-34")
      if (typeof userAge === "string" && userAge.includes("-")) {
        finalAgeGroup = userAge;
      } else if (typeof userAge === "number") {
        // Convert numeric age to age group
        const age = userAge;
        if (age < 18) finalAgeGroup = "18-24";
        else if (age >= 18 && age <= 24) finalAgeGroup = "18-24";
        else if (age >= 25 && age <= 34) finalAgeGroup = "25-34";
        else if (age >= 35 && age <= 44) finalAgeGroup = "35-44";
        else if (age >= 45 && age <= 54) finalAgeGroup = "45-54";
        else if (age >= 55 && age <= 64) finalAgeGroup = "55-64";
        else if (age >= 65) finalAgeGroup = "65+";
      }
    } else {
      // Try localStorage as last resort before using defaults
      const localStorageUser = getUserFromLocalStorage();
      if (localStorageUser) {
        const localAge = localStorageUser.age || localStorageUser.ageRange;
        if (localAge) {
          if (typeof localAge === "string" && localAge.includes("-")) {
            finalAgeGroup = localAge;
          } else if (typeof localAge === "number") {
            const age = localAge;
            if (age < 18) finalAgeGroup = "18-24";
            else if (age >= 18 && age <= 24) finalAgeGroup = "18-24";
            else if (age >= 25 && age <= 34) finalAgeGroup = "25-34";
            else if (age >= 35 && age <= 44) finalAgeGroup = "35-44";
            else if (age >= 45 && age <= 54) finalAgeGroup = "45-54";
            else if (age >= 55 && age <= 64) finalAgeGroup = "55-64";
            else if (age >= 65) finalAgeGroup = "65+";
          }
        }
      }
    }

    // Extract gender from user object - check nested properties too
    const userGender =
      userToUse.gender ||
      userToUse.profile?.gender ||
      userToUse.details?.gender;

    if (userGender && typeof userGender === "string") {
      finalGender = userGender.toLowerCase().trim();
    } else {
      // Try localStorage as last resort before using defaults
      const localStorageUser = getUserFromLocalStorage();
      if (localStorageUser && localStorageUser.gender) {
        finalGender = localStorageUser.gender.toLowerCase().trim();
      }
    }
  }

  const params = new URLSearchParams();

  if (uiSection) params.append("uiSection", uiSection);
  if (finalAgeGroup) params.append("ageGroup", finalAgeGroup);
  if (finalGender) params.append("gender", finalGender);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  const endpoint = `/api/game/discover?${params.toString()}`;

  const response = await apiRequest(endpoint, "GET", null, token);

  // Add xpRewardConfig to the response
  const enhancedResponse = {
    ...response,
    xpRewardConfig: {
      baseXP: 1,
      multiplier: 1.8,
    },
  };

  // If response has data array, ensure each game also has access to xpRewardConfig
  if (enhancedResponse.data && Array.isArray(enhancedResponse.data)) {
    // Optionally add xpRewardConfig to each game object for convenience
    // enhancedResponse.data = enhancedResponse.data.map(game => ({
    //   ...game,
    //   xpRewardConfig: enhancedResponse.xpRewardConfig
    // }));
  }

  return enhancedResponse;
};

/**
 * Get game details by ID
 * @param {string} gameId - Game ID
 * @param {string} token - User authentication token
 * @returns {Promise} Game details with goals, rewards, and requirements
 */
export const getGameById = (gameId, token = null) => {
  const endpoint = `/api/game/get-game-by-id/${gameId}`;
  return apiRequest(endpoint, "GET", null, token);
};

// --- DAILY CHALLENGE API ENDPOINTS ---
/**
 * Get calendar view of daily challenges for the month
 * @param {number} year - Year (default: current year)
 * @param {number} month - Month 0-11 (default: current month)
 * @param {string} token - User authentication token
 * @returns {Promise} Calendar data with challenge states
 */
export const getDailyChallengeCalendar = (year, month, token) => {
  const params = new URLSearchParams();
  if (year) params.append("year", year);
  if (month !== undefined) params.append("month", month);

  const endpoint = `/api/daily-challenge/calendar?${params.toString()}`;
  return apiRequest(endpoint, "GET", null, token);
};

/**
 * Get today's challenge with countdown timer and details
 * @param {string} token - User authentication token
 * @returns {Promise} Today's challenge data
 */
export const getTodaysChallenge = (token) => {
  return apiRequest("/api/daily-challenge/today", "GET", null, token);
};

/**
 * Select a game for today's challenge
 * @param {string} gameId - Game ID to select
 * @param {string} token - User authentication token
 * @returns {Promise} Selection confirmation
 */
export const selectChallengeGame = (gameId, token) => {
  return apiRequest(
    "/api/daily-challenge/select-game",
    "POST",
    { gameId },
    token
  );
};

/**
 * Start today's challenge
 * @param {string} token - User authentication token
 * @returns {Promise} Challenge start confirmation with game deep link
 */
export const startChallenge = (token) => {
  return apiRequest("/api/daily-challenge/start", "POST", null, token);
};

/**
 * Spin for daily challenge (bypasses eligibility, creates spin log)
 * @param {string} token - User authentication token
 * @returns {Promise} Spin result with spin log
 */
export const spinForChallenge = (token) => {
  return apiRequest("/api/daily-challenge/spin", "POST", null, token);
};

/**
 * Complete today's challenge and claim rewards
 * @param {string} conversionId - Optional Besitos conversion ID
 * @param {string} token - User authentication token
 * @returns {Promise} Completion confirmation with rewards
 */
export const completeChallenge = (conversionId, token) => {
  return apiRequest(
    "/api/daily-challenge/complete",
    "POST",
    { conversionId },
    token
  );
};

/**
 * Get bonus days for the authenticated user
 * @param {string} token - User authentication token
 * @returns {Promise} Bonus days data with rewards and status
 */
export const getBonusDays = (token) => {
  return apiRequest("/api/streak/bonus-days", "GET", null, token);
};

/**
 * Get user's challenge completion history
 * @param {number} limit - Number of records to return (default: 30)
 * @param {string} token - User authentication token
 * @returns {Promise} Challenge history data
 */
export const getChallengeHistory = (limit = 30, token) =>
  apiRequest(`/api/daily-challenge/history?limit=${limit}`, "GET", null, token);

/**
 * Get user's challenge statistics and completion rates
 * @param {string} token - User authentication token
 * @returns {Promise} User challenge statistics
 */
export const getChallengeStats = (token) =>
  apiRequest("/api/daily-challenge/stats", "GET", null, token);

// --- DAILY REWARDS API ENDPOINTS ---
/**
 * Get daily rewards week data
 * @param {string} date - Optional date string (YYYY-MM-DD format)
 * @param {string} token - User authentication token
 * @returns {Promise} Week data with daily rewards
 */
export const getDailyRewardsWeek = (date = null, token = null) => {
  const endpoint = date
    ? `/api/daily-rewards/week?date=${date}`
    : `/api/daily-rewards/week`;

  return apiRequest(endpoint, "GET", null, token);
};

/**
 * Claim daily reward for a specific day
 * @param {number} dayNumber - Day number (1-7)
 * @param {string} token - User authentication token
 * @returns {Promise} Claim confirmation with rewards
 */
export const claimDailyReward = (dayNumber, token = null) => {
  const endpoint = `/api/daily-rewards/claim`;
  return apiRequest(endpoint, "POST", { dayNumber }, token);
};

/**
 * Recover missed daily reward day
 * @param {string} method - Recovery method
 * @param {string} token - User authentication token
 * @returns {Promise} Recovery confirmation
 */
export const recoverMissedDailyReward = (method, token = null) => {
  const endpoint = `/api/daily-rewards/recover`;
  return apiRequest(endpoint, "POST", { method }, token);
};

/**
 * Get user's current streak status and milestone progress
 * @param {string} token - User authentication token
 * @returns {Promise} Streak status data
 */
export const getStreakStatus = (token) =>
  apiRequest("/api/streak/status", "GET", null, token);

/**
 * Get streak history for the last 30 days
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of records per page (default: 30)
 * @param {string} token - User authentication token
 * @returns {Promise} Streak history data
 */
export const getStreakHistory = (page = 1, limit = 30, token) =>
  apiRequest(
    `/api/streak/history?page=${page}&limit=${limit}`,
    "GET",
    null,
    token
  );

/**
 * Get top users by streak count
 * @param {number} limit - Number of top users to return (default: 10)
 * @param {string} token - User authentication token
 * @returns {Promise} Streak leaderboard data
 */
export const getStreakLeaderboard = (limit = 10, token) =>
  apiRequest(`/api/streak/leaderboard?limit=${limit}`, "GET", null, token);

/**
 * Claim milestone reward for 7, 14, 21, or 30 day streak
 * @param {number} milestoneDay - Milestone day (7, 14, 21, or 30)
 * @param {Object} rewardAmount - Reward amounts: { coins: number, xp: number }
 * @param {string} token - User authentication token
 * @returns {Promise} Claim confirmation with rewards
 */
export const claimStreakMilestoneReward = (
  milestoneDay,
  rewardAmount,
  token
) => {
  return apiRequest(
    "/api/streak/claim-reward",
    "POST",
    {
      milestoneDay,
      rewardAmount,
    },
    token
  );
};

// ============================================================================
// TICKET SYSTEM APIs
// ============================================================================

/**
 * Get user's games list for ticket form dropdown
 * @param {string} token - User authentication token
 * @returns {Promise} List of games user has played
 */
export const getUserGamesList = (token) =>
  apiRequest("/api/tickets/games/list", "GET", null, token);

/**
 * Raise a new support ticket
 * @param {Object} ticketData - Ticket data including gameId, description, category, images, deviceInfo
 * @param {string} token - User authentication token
 * @returns {Promise} Created ticket response
 */
export const raiseTicket = (ticketData, token) => {
  // Send JSON payload with new structure
  const payload = {
    subject: ticketData.subject || "Support Request",
    description: ticketData.description || "",
    priority: ticketData.priority || "Medium",
    category: ticketData.category || "Other",
    game: "68ece317d8b3c45c06dd3908",
    contact: ticketData.contact || {},
    tags: ticketData.tags || [],
    images: ticketData.images || [],
    metadata: ticketData.metadata || {},
  };

  return apiRequest("/api/tickets", "POST", payload, token, false);
};

/**
 * Get user's tickets with filters and pagination
 * @param {Object} filters - Filter options (status, category, page, limit)
 * @param {string} token - User authentication token
 * @returns {Promise} User's tickets list
 */
export const getUserTickets = (filters = {}, token) => {
  const params = new URLSearchParams();

  // Always add userOnly=true for user tickets
  params.append("userOnly", "true");

  if (filters.status) params.append("status", filters.status);
  if (filters.category) params.append("category", filters.category);
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);

  const queryString = params.toString();
  const endpoint = `/api/tickets?${queryString}`;

  return apiRequest(endpoint, "GET", null, token);
};

/**
 * Get detailed ticket information
 * @param {string} ticketId - Ticket ID
 * @param {string} token - User authentication token
 * @returns {Promise} Detailed ticket information
 */
export const getTicketDetails = (ticketId, token) =>
  apiRequest(`/api/tickets/${ticketId}`, "GET", null, token);

/**
 * Get user's ticket statistics
 * @param {string} token - User authentication token
 * @returns {Promise} Ticket statistics
 */
export const getTicketStats = (token) =>
  apiRequest("/api/tickets/stats", "GET", null, token);

/**
 * Delete/cancel a ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} token - User authentication token
 * @returns {Promise} Deletion response
 */
export const deleteTicket = (ticketId, token) =>
  apiRequest(`/api/tickets/${ticketId}`, "DELETE", null, token);

// ============================================================================
// GAME EARNING APIs
// ============================================================================

/**
 * Transfer earned coins and XP from game session to user wallet
 * @param {Object} earningData - Earning data: { gameId, coins, xp, reason }
 * @param {string} token - User authentication token
 * @returns {Promise} Transfer confirmation with updated wallet balance
 */
export const transferGameEarnings = async (earningData, token) => {
  // Use production API for game earning endpoint
  const GAME_EARNINGS_BASE_URL = "https://rewardsapi.hireagent.co";

  // Send only the specific payload with exact key names
  const payload = {
    gameId: earningData.gameId,
    coins: earningData.coins,
    xp: earningData.xp,
    reason: earningData.reason,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const config = {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(
      `${GAME_EARNINGS_BASE_URL}/api/game/earn`,
      config
    );
    return handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        status: error.status,
        body: error.body,
      };
    } else {
      return {
        success: false,
        error: error.message || "A network error occurred. Please try again.",
      };
    }
  }
};

// ============================================================================
// DAILY ACTIVITY STATS API
// ============================================================================

/**
 * Get user's daily activity statistics for streak tracking
 * @param {string} token - User authentication token
 * @returns {Promise} Daily activity stats including currentStreak, totalActiveDays, longestStreak, lastActiveDate, streakHistory, isActiveToday
 */
export const getDailyActivityStats = (token) =>
  apiRequest("/api/daily-activity/stats", "GET", null, token);

// ============================================================================
// SPIN WHEEL APIs
// ============================================================================

/**
 * Get spin wheel configuration and rewards
 * @param {string} token - User authentication token
 * @returns {Promise} Spin config with rewards, eligibility, and user tier
 */
export const getSpinConfig = (token) =>
  apiRequest("/api/spin/config", "GET", null, token);

/**
 * Get user's spin status (canSpin, remainingSpins, cooldown, etc.)
 * @param {string} token - User authentication token
 * @returns {Promise} Spin status with remaining spins, cooldown, VIP multiplier
 */
export const getSpinStatus = (token) =>
  apiRequest("/api/spin/status", "GET", null, token);

/**
 * Perform a spin
 * @param {string} token - User authentication token
 * @returns {Promise} Spin result with reward, spinId, status
 */
export const performSpin = (token) =>
  apiRequest("/api/spin/spin", "POST", {}, token);

/**
 * Redeem a spin reward
 * @param {string} spinId - Spin ID from spin result
 * @param {string} token - User authentication token
 * @returns {Promise} Redemption result with reward, new balance, XP earned
 */
export const redeemSpinReward = (spinId, token) =>
  apiRequest("/api/spin/redeem", "POST", { spinId }, token);

// ============================================================================
// BITLABS SURVEY APIs
// ============================================================================

/**
 * Fetch configured Bitlabs surveys for users
 * @param {Object} params - Query parameters
 * @param {string} params.category - Category filter (default: "all")
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.useAdminConfig - Use admin-configured surveys (default: "true")
 * @param {string} token - User authentication token
 * @returns {Promise} Surveys data with pagination
 */
export const getBitlabsSurveys = (params = {}, token) => {
  const queryParams = new URLSearchParams();

  if (params.category) queryParams.append("category", params.category);
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.useAdminConfig !== undefined) {
    queryParams.append("useAdminConfig", params.useAdminConfig);
  } else {
    queryParams.append("useAdminConfig", "true");
  }

  const endpoint = `/api/non-game-offers/surveys?${queryParams.toString()}`;
  return apiRequest(endpoint, "GET", null, token);
};

/**
 * Track survey click for analytics (optional but recommended)
 * @param {string} offerId - Survey offer ID
 * @param {string} token - User authentication token
 * @returns {Promise} Tracking response
 */
export const trackSurveyClick = (offerId, token) => {
  const endpoint = `/api/non-game-offers/click`;
  return apiRequest(endpoint, "POST", { offerId, offerType: "survey" }, token);
};

// ============================================================================
// NON-GAME OFFERS APIs (Cashback, Shopping, Magic Receipts)
// ============================================================================

/**
 * Fetch all non-game offers (surveys, cashback, shopping, magic receipts)
 * @param {Object} params - Query parameters
 * @param {string} params.type - Filter by type: "all", "survey", "cashback", "shopping", "magic_receipt"
 * @param {string} params.category - Category filter (default: "all")
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.useAdminConfig - Use admin-configured offers (default: "true")
 * @param {string} token - User authentication token
 * @returns {Promise} Offers data with pagination
 */
export const getAllNonGameOffers = (params = {}, token) => {
  const queryParams = new URLSearchParams();

  if (params.type) queryParams.append("type", params.type);
  if (params.category) queryParams.append("category", params.category);
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.useAdminConfig !== undefined) {
    queryParams.append("useAdminConfig", params.useAdminConfig);
  } else {
    queryParams.append("useAdminConfig", "true");
  }

  const endpoint = `/api/non-game-offers?${queryParams.toString()}`;
  return apiRequest(endpoint, "GET", null, token);
};

/**
 * Fetch cashback offers only
 * @param {Object} params - Query parameters
 * @param {string} params.category - Category filter (default: "all")
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.useAdminConfig - Use admin-configured offers (default: "true")
 * @param {string} token - User authentication token
 * @returns {Promise} Cashback offers data
 */
export const getCashbackOffers = (params = {}, token) => {
  return getAllNonGameOffers({ ...params, type: "cashback" }, token);
};

/**
 * Fetch shopping offers only
 * @param {Object} params - Query parameters
 * @param {string} params.category - Category filter (default: "all")
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.useAdminConfig - Use admin-configured offers (default: "true")
 * @param {string} token - User authentication token
 * @returns {Promise} Shopping offers data
 */
export const getShoppingOffers = (params = {}, token) => {
  return getAllNonGameOffers({ ...params, type: "shopping" }, token);
};

/**
 * Fetch magic receipt offers only
 * @param {Object} params - Query parameters
 * @param {string} params.category - Category filter (default: "all")
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.useAdminConfig - Use admin-configured offers (default: "true")
 * @param {string} token - User authentication token
 * @returns {Promise} Magic receipt offers data
 */
export const getMagicReceipts = (params = {}, token) => {
  const queryParams = new URLSearchParams();

  if (params.category) queryParams.append("category", params.category);
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.useAdminConfig !== undefined) {
    queryParams.append("useAdminConfig", params.useAdminConfig);
  } else {
    queryParams.append("useAdminConfig", "true");
  }

  const endpoint = `/api/non-game-offers/magic-receipts?${queryParams.toString()}`;
  return apiRequest(endpoint, "GET", null, token);
};

// ============================================================================
// XP TIER PROGRESS BAR API
// ============================================================================

/**
 * Get XP tier progress bar data
 * @param {string} token - User authentication token
 * @returns {Promise} XP tier progress data with current tier, tiers list, and progress percentage
 */
export const getXPTierProgressBar = (token) =>
  apiRequest("/api/xp-tier/progress-bar", "GET", null, token);

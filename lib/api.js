const BASE_URL = "http://94.249.151.176:4001";

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let responseData;

  if (contentType && contentType.includes("application/json")) {
    responseData = await response.json();
  } else {
    responseData = { message: await response.text() };
  }
  if (!response.ok) {
    throw new Error(
      responseData.message || `HTTP error! status: ${response.status}`
    );
  }

  return responseData;
};

const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  token = null
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  // Change the header to match the backend's expectation
  if (token) {
    // This is the line that fixes the entire issue
    headers["x-auth-token"] = token;
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  console.log(`[FRONTEND] Preparing to send request:`, {
    endpoint: endpoint,
    method: config.method,
    headers: config.headers,
    body: config.body,
  });

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    return handleResponse(response);
  } catch (error) {
    console.error(`API request failed: ${method} ${endpoint}`, error);
    throw new Error(
      error.message || "A network error occurred. Please try again."
    );
  }
};

// --- Authentication Endpoints ---
export const sendOtp = (mobile) =>
  apiRequest("/api/auth/send-otp", "POST", { mobile });
export const verifyOtp = (mobile, otp) =>
  apiRequest("/api/auth/verify-otp", "POST", { mobile, otp });
export const signup = (userData) =>
  apiRequest("/api/auth/signup", "POST", userData);
export const login = (emailOrMobile, password) =>
  apiRequest("/api/auth/login", "POST", { emailOrMobile, password });

// --- Onboarding Endpoints ---

// Fetches the dynamic options (e.g., age ranges, genders) for a given screen
export const getOnboardingOptions = (screenName) =>
  apiRequest(`/api/onboarding/options/${screenName}`);

// Updates a user's onboarding progress in the background ("save-as-you-go")
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
    console.warn(
      `No API mapping for individual save on field: ${field}. It will be saved at final signup.`
    );
    return Promise.resolve();
  }

  const body = { mobile, [mapping.key]: value };
  return apiRequest(mapping.endpoint, "PUT", body);
};

// --- Disclosure Endpoints ---
export const acceptDisclosure = (token) =>
  apiRequest("/api/disclosure/accept", "POST", null, token);

export const updateLocationSettings = (mobile, status, mode) =>
  apiRequest("/api/location/settings", "POST", { mobile, status, mode });

/**
 * Sends the user's current coordinates to the backend.
 * @param {object} locationData - { latitude, longitude }.
 * @param {string} token - The user's authentication token.
 */
export const updateLocation = (locationData, token) =>
  apiRequest("/api/location/update", "POST", locationData, token);

export const getProfile = (token) =>
  apiRequest("/api/profile", "GET", null, token);

/**
 * Fetches the user's statistics (XP, wallet balance, etc.).
 * @param {string} token - The user's authentication token.
 */
export const getProfileStats = (token) =>
  apiRequest("/api/profile/stats", "GET", null, token);

/**
 * Updates the user's profile information.
 * @param {object} profileData - { firstName, lastName, status, notifications }.
 * @param {string} token - The user's authentication token.
 */
export const updateProfile = (profileData, token) =>
  apiRequest("/api/profile", "PUT", profileData, token);

/**
 * Uploads a new avatar for the user.
 * This function uses FormData, so it's handled separately from the main apiRequest.
 * @param {File} avatarFile - The image file to upload.
 * @param {string} token - The user's authentication token.
 */
export const uploadAvatar = async (avatarFile, token) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  const headers = {
    "x-auth-token": token,
  };

  try {
    const response = await fetch(`${BASE_URL}/api/profile/avatar`, {
      method: "POST",
      headers,
      body: formData,
    });
    // handleResponse is your existing function for processing the server's reply
    return handleResponse(response);
  } catch (error) {
    console.error(`API request failed: POST /api/profile/avatar`, error);
    throw new Error(
      error.message || "A network error occurred. Please try again."
    );
  }
};

// --- VIP Endpoints ---

/**
 * Fetches the user's current VIP status.
 * @param {string} token - The user's authentication token.
 */
export const getVipStatus = (token) =>
  apiRequest("/api/vip/status", "GET", null, token);

export const getHomeDashboard = (token) =>
  apiRequest("/api/dashboard", "GET", null, token);

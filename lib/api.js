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

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let responseData;

  if (response.status === 204) {
    return null;
  }

  if (contentType && contentType.includes("application/json")) {
    responseData = await response.json();
  } else {
    responseData = { message: await response.text() };
  }

  if (!response.ok) {
    const errorMessage =
      responseData.error ||
      (responseData.errors && responseData.errors[0]?.msg) ||
      responseData.message ||
      `HTTP error! status: ${response.status}`;
    throw new ApiError(errorMessage, response.status, responseData);
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

  if (token) {
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
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new Error(
        error.message || "A network error occurred. Please try again."
      );
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
export const login = (emailOrMobile, password) =>
  apiRequest("/api/auth/login", "POST", { emailOrMobile, password });

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

// --- Location Endpoints ---
export const updateLocationSettings = (mobile, status, mode) =>
  apiRequest("/api/location/settings", "POST", { mobile, status, mode });
export const updateLocation = (locationData, token) =>
  apiRequest("/api/location/update", "POST", locationData, token);

// --- Profile Endpoints ---
export const getProfile = (token) =>
  apiRequest("/api/profile", "GET", null, token);
export const getProfileStats = (token) =>
  apiRequest("/api/profile/stats", "GET", null, token);
export const updateProfile = (profileData, token) =>
  apiRequest("/api/profile", "PUT", profileData, token);
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
    console.error(`API request failed: POST /api/profile/avatar`, error);
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

export const forgotPassword = (email) =>
  apiRequest("/api/auth/forgot-password", "POST", { identifier: email });
export const resetPassword = (token, newPassword) =>
  apiRequest("/api/auth/reset-password", "POST", { token, newPassword });

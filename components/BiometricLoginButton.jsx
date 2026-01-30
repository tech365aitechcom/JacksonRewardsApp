"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    checkBiometricAvailability,
    authenticateWithBiometric,
    hasBiometricCredentials,
    getBiometricType,
} from "@/lib/biometricAuth";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { useAuth } from "@/contexts/AuthContext";
import { checkBiometricStatus, checkBiometricStatusByDevice, biometricLogin } from "@/lib/api";

/**
 * Biometric Login Button Component
 * Uses capacitor-native-biometric properly following documentation
 * Flow: Check availability -> Verify identity -> Retrieve credentials -> Login
 */
export default function BiometricLoginButton({ onSuccess, onError }) {
    const [biometryType, setBiometryType] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [hasCredentials, setHasCredentials] = useState(false);
    const { refreshSession } = useAuth();
    const router = useRouter();

    useEffect(() => {
        checkAvailabilityAndCredentials();
    }, []);

    const checkAvailabilityAndCredentials = async () => {
        try {
            // Step 1: Check if biometric is available on device
            const availability = await checkBiometricAvailability();
            console.log("🔍 [LOGIN-BTN] Biometric availability:", availability);

            if (!availability.isAvailable) {
                console.log("⚠️ [LOGIN-BTN] Biometric not available");
                setBiometryType("none");
                return;
            }

            // Set the biometry type for display
            setBiometryType(availability.biometryTypeName);
            console.log("✅ [LOGIN-BTN] Biometry type:", availability.biometryTypeName);

            // Step 2: Check if user has stored credentials
            const credentialsExist = await hasBiometricCredentials();
            setHasCredentials(credentialsExist);
            console.log("🔍 [LOGIN-BTN] Has stored credentials:", credentialsExist);
        } catch (error) {
            console.error("❌ [LOGIN-BTN] Error checking availability:", error);
        }
    };

    const handleBiometricLogin = async () => {
        if (!Capacitor.isNativePlatform()) {
            onError?.("Biometric login is only available on the mobile app.");
            return;
        }

        setIsAuthenticating(true);

        try {
            console.log("🔐 [LOGIN-BTN] Starting biometric login flow...");

            // Check if credentials are stored locally
            if (!hasCredentials) {
                console.warn("⚠️ [LOGIN-BTN] No credentials stored");
                onError?.("Biometric login is not set up. Please sign in manually once to enable biometric login.");
                setIsAuthenticating(false);
                return;
            }

            // Get user identifier from Capacitor Preferences (survives logout)
            // This is stored during face verification registration
            let userIdentifier = null;

            if (Capacitor.isNativePlatform()) {
                try {
                    const prefResult = await Preferences.get({ key: "biometric_username" });
                    if (prefResult && prefResult.value) {
                        userIdentifier = prefResult.value;
                        console.log("✅ [LOGIN-BTN] Got user identifier from Preferences:", userIdentifier);
                    }
                } catch (e) {
                    console.warn("⚠️ [LOGIN-BTN] Failed to get username from Preferences:", e);
                }
            }

            // Fallback to localStorage if Preferences not available
            if (!userIdentifier) {
                try {
                    const storedUser = localStorage.getItem("user") || localStorage.getItem("biometricUser");
                    if (storedUser) {
                        const user = JSON.parse(storedUser);
                        userIdentifier = user.mobile || user.email;
                        console.log("✅ [LOGIN-BTN] Got user identifier from localStorage:", userIdentifier);
                    }
                } catch (e) {
                    console.error("❌ [LOGIN-BTN] Failed to get user from localStorage:", e);
                }
            }

            // Get device ID as backup for status check
            const { Device } = await import("@capacitor/device");
            const deviceInfo = await Device.getId();
            const deviceId = deviceInfo.identifier || "unknown";
            console.log("📱 [LOGIN-BTN] Device ID:", deviceId);

            // Step 1: Check if user has registered Face ID with backend
            // Try by user identifier first, fallback to device ID if identifier not available
            // OPTIMIZATION: Defer status check to next tick to prevent frame drops
            const DEBUG_BIOMETRIC = typeof window !== 'undefined' && (
                process.env.NODE_ENV === 'development' ||
                localStorage.getItem('debug_biometric') === 'true'
            );

            const bioLog = (...args) => {
                if (DEBUG_BIOMETRIC) console.log(...args);
            };

            bioLog("🔍 [LOGIN-BTN] Checking biometric registration status...");

            let statusResult;

            // OPTIMIZATION: Defer status check to next tick to prevent frame drops
            await new Promise(resolve => setTimeout(resolve, 0));

            try {
                const statusCheckStartTime = Date.now();

                if (userIdentifier) {
                    statusResult = await checkBiometricStatus(userIdentifier);
                    const duration = Date.now() - statusCheckStartTime;
                    bioLog(`🔍 [LOGIN-BTN] Status check completed in ${duration}ms`);
                    if (DEBUG_BIOMETRIC) {
                        bioLog("🔍 [LOGIN-BTN] Status check result:", JSON.stringify(statusResult, null, 2));
                    }
                } else {
                    // Fallback: Check by device ID (backend must support this)
                    statusResult = await checkBiometricStatusByDevice(deviceId);
                    const duration = Date.now() - statusCheckStartTime;
                    bioLog(`🔍 [LOGIN-BTN] Status check completed in ${duration}ms`);
                    if (DEBUG_BIOMETRIC) {
                        bioLog("🔍 [LOGIN-BTN] Status check result:", JSON.stringify(statusResult, null, 2));
                    }
                }
            } catch (error) {
                console.error("❌ [LOGIN-BTN] Exception during status check:", error.message);

                // Convert exception to error object
                statusResult = {
                    error: error.message || "Failed to check biometric status",
                    success: false,
                    status: 0
                };
            }

            // Handle API errors (404, HTML responses, etc.)
            // apiRequest returns error objects, not throws exceptions
            if (statusResult.error) {
                if (DEBUG_BIOMETRIC) {
                    console.error("❌ [LOGIN-BTN] Status check API error:", statusResult.error);
                }

                // If user not found (404), it means biometric is not registered
                if (statusResult.error.includes("User not found") || statusResult.status === 404) {
                    const errorMessage = "Face ID is not registered. Please log in first to register Face ID for faster login next time.";
                    onError?.(errorMessage, {
                        showRedirectLink: true,
                        redirectPath: "/login",
                        redirectMessage: "Log In to Register Face ID"
                    });
                    setIsAuthenticating(false);
                    return;
                }

                // If endpoint doesn't exist (HTML response), treat as not registered
                if (statusResult.error.includes("not found") ||
                    statusResult.error.includes("HTML")) {
                    const errorMessage = "Face ID is not registered. Please log in first to register Face ID for faster login next time.";
                    onError?.(errorMessage, {
                        showRedirectLink: true,
                        redirectPath: "/login",
                        redirectMessage: "Log In to Register Face ID"
                    });
                    setIsAuthenticating(false);
                    return;
                }
            }

            // Check if biometric is registered (handle different response structures)
            // Backend returns: { success: true, isRegistered: true/false, ... }
            const isRegistered =
                (statusResult.success === true && statusResult.isRegistered === true) ||
                (statusResult.data && statusResult.data.isRegistered === true) ||
                (statusResult.isRegistered === true);

            if (DEBUG_BIOMETRIC) {
                bioLog("🔍 [LOGIN-BTN] Status check result:", {
                    success: statusResult.success,
                    isRegistered: statusResult.isRegistered,
                    finalIsRegistered: isRegistered
                });
            }

            if (!isRegistered) {
                // INDUSTRIAL BEST PRACTICE: Clear error message with action
                // User must log in first to register Face ID (token required for security)
                const errorMessage = "Face ID is not registered. Please log in first to register Face ID for faster login next time.";
                onError?.(errorMessage, {
                    showRedirectLink: true,
                    redirectPath: "/login",
                    redirectMessage: "Log In to Register Face ID"
                });
                setIsAuthenticating(false);
                return;
            }

            console.log("✅ [LOGIN-BTN] Face ID is registered, proceeding with biometric authentication...");

            // Step 2: Perform biometric authentication on device to get user credentials
            // This also retrieves the username (mobile/email) from secure storage
            const authResult = await authenticateWithBiometric({
                reason: "Login to your Jackson account securely",
                title: "Biometric Login",
                subtitle: "Verify your identity to log in",
                description: "Use your biometric to access your account",
            });

            console.log("🔐 [LOGIN-BTN] Authentication result:", {
                success: authResult.success,
                hasUsername: !!authResult.username,
                biometryType: authResult.biometryTypeName,
            });

            if (!authResult.success) {
                console.error("❌ [LOGIN-BTN] Biometric authentication failed:", authResult.error);
                onError?.(authResult.error || "Biometric authentication failed");
                setIsAuthenticating(false);
                return;
            }

            // Get user identifier from authenticated credentials (update if not already set)
            if (!userIdentifier) {
                userIdentifier = authResult.username;
            }
            if (!userIdentifier && authResult.password) {
                try {
                    const credentialPayload = JSON.parse(authResult.password);
                    userIdentifier = credentialPayload.user?.mobile || credentialPayload.user?.email || authResult.username;
                } catch (e) {
                    // If password is not JSON, use username from authResult
                    if (!userIdentifier) {
                        userIdentifier = authResult.username;
                    }
                }
            }

            if (!userIdentifier) {
                console.error("❌ [LOGIN-BTN] Cannot determine user identifier from credentials");
                onError?.("Unable to identify your account. Please sign in manually.");
                setIsAuthenticating(false);
                return;
            }

            console.log("🌐 [LOGIN-BTN] Calling biometric login endpoint...");

            // Step 3: Call backend biometric login endpoint to get fresh token
            const loginData = {
                deviceId: deviceId,
                biometricType: authResult.biometryTypeName || "face_id",
            };

            // Include mobile or email based on identifier type
            if (userIdentifier.includes("@")) {
                loginData.email = userIdentifier;
            } else {
                loginData.mobile = userIdentifier;
            }

            console.log("🌐 [LOGIN-BTN] Calling biometric login with data:", {
                ...loginData,
                deviceId: deviceId.substring(0, 10) + "...", // Log partial deviceId for privacy
            });

            const loginResult = await biometricLogin(loginData);
            console.log("🌐 [LOGIN-BTN] Biometric login result:", {
                success: !loginResult.error,
                hasToken: !!(loginResult.token || loginResult.data?.token),
                hasUser: !!(loginResult.user || loginResult.data?.user),
                error: loginResult.error,
            });

            // Handle API errors (404, HTML responses, etc.) - apiRequest returns error objects
            if (loginResult.error) {
                console.error("❌ [LOGIN-BTN] Biometric login API error:", loginResult.error);

                if (loginResult.error.includes("not found") ||
                    loginResult.error.includes("HTML") ||
                    loginResult.status === 404) {
                    onError?.("Biometric login endpoint is not available. Please ensure backend routes are implemented. Sign in manually for now.");
                    setIsAuthenticating(false);
                    return;
                }

                // Handle specific backend error messages
                if (loginResult.error.includes("not registered") ||
                    loginResult.error.includes("not set up") ||
                    loginResult.error.includes("Biometric not")) {
                    onError?.("Face ID is not registered. Please log in first to register Face ID for faster login next time.", {
                        showRedirectLink: true,
                        redirectPath: "/login",
                        redirectMessage: "Log In to Register Face ID"
                    });
                    setIsAuthenticating(false);
                    return;
                }

                if (loginResult.error.includes("locked") || loginResult.error.includes("Account locked")) {
                    onError?.("Account is temporarily locked. Please try again later or sign in manually.");
                    setIsAuthenticating(false);
                    return;
                }

                if (loginResult.error.includes("not active") || loginResult.error.includes("suspended")) {
                    onError?.("Account is not active. Please contact support.");
                    setIsAuthenticating(false);
                    return;
                }
            }

            // Handle different response structures
            const token = loginResult.token || loginResult.data?.token;
            const user = loginResult.user || loginResult.data?.user;

            if (loginResult.error || !token || !user) {
                console.error("❌ [LOGIN-BTN] Backend biometric login failed:", loginResult.error);
                const errorMessage = loginResult.error || "Biometric login failed. Please try again or sign in manually.";
                onError?.(errorMessage);
                setIsAuthenticating(false);
                return;
            }

            // Step 5: Refresh session with fresh token from backend
            const refreshResult = await refreshSession({
                token: token,
                user: user,
            });

            if (refreshResult?.ok) {
                console.log("✅ [LOGIN-BTN] Session restored successfully with fresh token!");
                onSuccess?.({
                    token: token,
                    user: user
                });
            } else {
                console.error("❌ [LOGIN-BTN] Session refresh failed");
                onError?.("Failed to restore your session. Please sign in manually.");
            }
        } catch (error) {
            console.error("❌ [LOGIN-BTN] Biometric login error:", error);
            onError?.(error.message || "Biometric login failed. Please try again.");
        } finally {
            setIsAuthenticating(false);
        }
    };

    // Button is always visible now (removed the auto-hide logic)

    return (
        <button
            onClick={handleBiometricLogin}
            disabled={isAuthenticating}
            className="relative w-[58.1px] h-11 rounded-[12px] border border-gray-600 bg-black/10 backdrop-blur-sm cursor-pointer flex items-center justify-center hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            type="button"
            aria-label="Sign in with Biometric"
        >
            {isAuthenticating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
                <div className="w-[20px] h-[20px] flex items-center justify-center">
                    <Image
                        className="w-7 h-[30px] object-cover"
                        alt="Apple logo"
                        src="https://c.animaapp.com/2Y7fJDnh/img/image-3961@2x.png"
                        width={28}
                        height={30}
                    />
                </div>
            )}
        </button>
    );
}


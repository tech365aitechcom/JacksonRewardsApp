/**
 * Native BiometricPrompt Plugin Interface for Jackson App
 *
 * Uses androidx.biometric.BiometricPrompt with BIOMETRIC_STRONG
 * Tied to device hardware trust zone (TEE - Trusted Execution Environment)
 *
 * Official Documentation:
 * - API Reference: https://developer.android.com/reference/androidx/biometric/BiometricPrompt
 * - Guide: https://developer.android.com/identity/sign-in/biometric-auth
 * - Security: https://source.android.com/docs/security/features/biometric
 *
 * Security Levels:
 * - BIOMETRIC_STRONG (Class 3): Hardware-backed, anti-spoofing, TEE
 * - BIOMETRIC_WEAK (Class 2): Software-based
 * - DEVICE_CREDENTIAL (Class 1): PIN/Pattern/Password
 *
 * @module nativeBiometricPrompt
 */

import { registerPlugin } from "@capacitor/core";
import { Capacitor } from "@capacitor/core";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Result from checking biometric availability
 */
export interface BiometricAvailabilityResult {
  /** Whether biometric authentication is available */
  isAvailable: boolean;

  /** Biometry type code: 0=None, 3=Fingerprint, 4=Face, 5=Iris */
  biometryType: number;

  /** Human-readable biometry type name */
  biometryTypeName: "none" | "fingerprint" | "face" | "iris";

  /** Error code from BiometricManager (0 = success) */
  errorCode: number;

  /** Human-readable message */
  message: string;

  /** Security level (always "BIOMETRIC_STRONG" when available) */
  securityLevel?: string;

  /** Security class (3 = Class 3 / Strong / TEE) */
  securityClass?: number;

  /** Whether hardware trust zone (TEE) is available */
  hardwareTEE?: boolean;

  /** Whether user can enroll biometrics in settings */
  canEnroll?: boolean;

  /** Whether hardware is temporarily unavailable */
  temporarilyUnavailable?: boolean;

  /** Whether security update is required */
  securityUpdateRequired?: boolean;

  /** Android SDK version */
  androidVersion?: number;

  /** Android release version string */
  androidRelease?: string;

  /** Device model name */
  deviceModel?: string;

  /** Device manufacturer */
  manufacturer?: string;

  /** Security patch level */
  securityPatch?: string;

  /** Exception type if error occurred */
  exceptionType?: string;
}

/**
 * Result from biometric verification
 */
export interface BiometricVerifyResult {
  /** Whether authentication was successful */
  success: boolean;

  /** Success/error message */
  message?: string;

  /** Authentication type: "biometric" | "device_credential" | "unknown" */
  authType?: string;

  /** Authentication type code from BiometricPrompt */
  authTypeCode?: number;

  /** Human-readable description of auth type */
  authTypeDescription?: string;

  /** Security level used */
  securityLevel?: string;

  /** Security class (3 = Class 3 / Strong) */
  securityClass?: number;

  /** Whether hardware TEE was used */
  hardwareTEE?: boolean;

  /** BiometricPrompt error code if failed */
  errorCode?: number;

  /** Human-readable error type */
  errorType?: string;

  /** Error message from system */
  errorMessage?: string;

  /** Whether user canceled the prompt */
  isUserCanceled?: boolean;

  /** Whether device is in lockout state */
  isLockout?: boolean;

  /** Whether lockout is permanent (requires device unlock) */
  isLockoutPermanent?: boolean;

  /** Exception type if error occurred */
  exceptionType?: string;

  /** Timestamp of the result */
  timestamp?: number;
}

/**
 * Options for verifyIdentity() method
 */
export interface BiometricVerifyOptions {
  /** Title shown in the biometric prompt */
  title?: string;

  /** Subtitle shown below the title */
  subtitle?: string;

  /** Description text */
  description?: string;

  /** Text for the cancel/negative button */
  negativeButtonText?: string;
}

/**
 * Native BiometricPrompt Plugin Interface
 */
export interface NativeBiometricPromptPlugin {
  /**
   * Check if biometric authentication is available on this device
   * Uses BIOMETRIC_STRONG (Class 3 / hardware trust zone)
   *
   * @returns Promise with availability result
   */
  isAvailable(): Promise<BiometricAvailabilityResult>;

  /**
   * Verify identity using BiometricPrompt
   * Triggers OS-level biometric dialog with BIOMETRIC_STRONG
   *
   * @param options - Prompt configuration options
   * @returns Promise with verification result
   */
  verifyIdentity(options: BiometricVerifyOptions): Promise<BiometricVerifyResult>;
}

// ============================================================================
// PLUGIN REGISTRATION
// ============================================================================

/**
 * Register the native plugin with Capacitor
 * This connects to NativeBiometricPlugin.java on Android
 */
const NativeBiometricPrompt = registerPlugin<NativeBiometricPromptPlugin>(
  "NativeBiometricPrompt"
);

export default NativeBiometricPrompt;

// ============================================================================
// HELPER FUNCTIONS WITH EXTENSIVE LOGGING
// ============================================================================

/**
 * Check if native biometric authentication is available
 * Uses BIOMETRIC_STRONG (Class 3 / hardware trust zone)
 *
 * @returns Promise with detailed availability information
 *
 * @example
 * ```typescript
 * const result = await checkNativeBiometric();
 * if (result.isAvailable) {
 * console.log('Biometric available:', result.biometryTypeName);
 * console.log('Security level:', result.securityLevel);
 * }
 * ```
 */
export async function checkNativeBiometric(): Promise<BiometricAvailabilityResult> {

  try {
    // Check if we're on a native platform
    const isNative = Capacitor.isNativePlatform();
    const platform = Capacitor.getPlatform();

    if (!isNative) {

      return {
        isAvailable: false,
        biometryType: 0,
        biometryTypeName: "none",
        errorCode: -1,
        message: "Biometric authentication only available on native mobile app",
        hardwareTEE: false,
      };
    }

    if (platform !== "android") {

      return {
        isAvailable: false,
        biometryType: 0,
        biometryTypeName: "none",
        errorCode: -2,
        message: "Native BiometricPrompt only available on Android",
        hardwareTEE: false,
      };
    }

    const startTime = Date.now();

    const result = await NativeBiometricPrompt.isAvailable();

    const duration = Date.now() - startTime;

    return result;

  } catch (error) {
    console.error("╔════════════════════════════════════════════════════════════╗");
    console.error("║   [NATIVE-BIOMETRIC] Error in checkNativeBiometric()     ║");
    console.error("╚════════════════════════════════════════════════════════════╝");
    console.error("• Error:", error);

    return {
      isAvailable: false,
      biometryType: 0,
      biometryTypeName: "none",
      errorCode: -99,
      message: `Error checking biometric: ${error}`,
      hardwareTEE: false,
      exceptionType: error instanceof Error ? error.constructor.name : "Unknown",
    };
  }
}

/**
 * Verify identity using native BiometricPrompt with BIOMETRIC_STRONG
 * This triggers the OS-level biometric dialog with hardware trust zone security
 *
 * @param options - Optional prompt configuration
 * @returns Promise with verification result
 *
 * @example
 * ```typescript
 * const result = await verifyWithNativeBiometric({
 * title: "Face Verification",
 * subtitle: "Verify your identity",
 * description: "Move your head slowly from left to right",
 * negativeButtonText: "Cancel"
 * });
 *
 * if (result.success) {
 * console.log('Authentication successful!');
 * console.log('Auth type:', result.authType);
 * console.log('Security:', result.securityLevel);
 * } else {
 * console.log('Authentication failed:', result.errorType);
 * }
 * ```
 */
export async function verifyWithNativeBiometric(
  options?: BiometricVerifyOptions
): Promise<BiometricVerifyResult> {

  const config = {
    title: options?.title || "Face Verification",
    subtitle: options?.subtitle || "Verify your identity",
    description: options?.description || "Move your head slowly from left to right",
    negativeButtonText: options?.negativeButtonText || "Cancel",
  };

  try {
    // Check if we're on a native platform
    const isNative = Capacitor.isNativePlatform();
    const platform = Capacitor.getPlatform();

    if (!isNative) {

      return {
        success: false,
        errorCode: -1,
        errorType: "not_native",
        errorMessage: "Biometric authentication only available on native mobile app",
      };
    }

    if (platform !== "android") {

      return {
        success: false,
        errorCode: -2,
        errorType: "wrong_platform",
        errorMessage: "Native BiometricPrompt only available on Android",
      };
    }

    const startTime = Date.now();

    const result = await NativeBiometricPrompt.verifyIdentity(config);

    const duration = Date.now() - startTime;

    return result;

  } catch (error) {
    console.error("╔════════════════════════════════════════════════════════════╗");
    console.error("║   [NATIVE-BIOMETRIC] Exception in verifyWithNativeBiometric ║");
    console.error("╚════════════════════════════════════════════════════════════╝");
    console.error("• Error:", error);

    return {
      success: false,
      errorCode: -99,
      errorType: "exception",
      errorMessage: `Exception: ${error}`,
      exceptionType: error instanceof Error ? error.constructor.name : "Unknown",
      timestamp: Date.now(),
    };
  }
}

/**
 * Get a user-friendly message for biometric errors
 *
 * @param result - The verification result
 * @returns User-friendly error message
 */
export function getBiometricErrorMessage(result: BiometricVerifyResult): string {
  if (result.success) {
    return "Authentication successful";
  }

  if (result.isUserCanceled) {
    return "Verification was cancelled. You can try again or skip for now.";
  }

  if (result.isLockout) {
    if (result.isLockoutPermanent) {
      return "Too many failed attempts. Please unlock your device with PIN/Pattern/Password first, then try again.";
    }
    return "Too many failed attempts. Please wait 30 seconds and try again.";
  }

  switch (result.errorType) {
    case "no_biometrics_enrolled":
      return "No biometric enrolled. Please set up Face ID or Fingerprint in Settings > Security > Biometrics.";
    case "hardware_not_present":
      return "This device does not have biometric hardware.";
    case "hardware_unavailable":
      return "Biometric hardware is temporarily unavailable. Please try again.";
    case "timeout":
      return "Authentication timed out. Please try again.";
    case "unable_to_process":
      return "Unable to process biometric. Please try again.";
    case "vendor_error":
      return "A device-specific error occurred. Please try again.";
    default:
      return result.errorMessage || "Biometric authentication failed. Please try again.";
  }
}

/**
 * Check if biometric result indicates user can retry
 *
 * @param result - The verification result
 * @returns Whether user can retry
 */
export function canRetryBiometric(result: BiometricVerifyResult): boolean {
  if (result.success) return false;

  // Can't retry if permanently locked out
  if (result.isLockoutPermanent) return false;

  // Can retry in these cases
  if (result.isUserCanceled) return true;
  if (result.errorType === "timeout") return true;
  if (result.errorType === "unable_to_process") return true;
  if (result.isLockout && !result.isLockoutPermanent) return true;

  return false;
}


"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export const useVPNDetector = (options = {}) => {
  const {
    checkOnMount = true,
    checkOnAppResume = true,
    blockOnDetection = true,
  } = options;

  const router = useRouter();
  const [isVPNDetected, setIsVPNDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);
  const cooldownRef = useRef(false);
  const isNativeAppRef = useRef(false);

  useEffect(() => {
    isNativeAppRef.current = !!(
      typeof window !== "undefined" &&
      (window.Capacitor?.isNativePlatform?.() ||
        window.androidBridge ||
        window.webkit?.messageHandlers?.nativeBridge)
    );
  }, []);

  const redirectToBlocked = useCallback(
    (reason = "vpn_detected", message = null) => {
      if (cooldownRef.current || typeof window === "undefined") return;
      cooldownRef.current = true;

      try {
        localStorage.setItem("vpn_blocked", "true");
        localStorage.setItem("vpn_blocked_recent", "true");
        localStorage.setItem("vpn_reason", reason);
        if (message) {
          localStorage.setItem("vpn_message", message);
        }
      } catch (e) {}

      const encodedMessage = message
        ? `&message=${encodeURIComponent(message)}`
        : "";
      router.replace(`/blocked?reason=${reason}${encodedMessage}`);
    },
    [router]
  );

  const checkNativeVPN = useCallback(async () => {
    if (typeof window === "undefined") return null;
    if (!isNativeAppRef.current) {
      console.log("[VPN] Not native app - skipping native VPN check");
      return null;
    }

    try {
      console.log("[VPN] Checking native VPN status...");
      const { VpnDetector } = await import("capacitor-vpn-detector");
      if (!VpnDetector?.isVpnActive) {
        console.warn("[VPN] VpnDetector plugin not available");
        return null;
      }
      const result = await VpnDetector.isVpnActive();
      console.log("[VPN] Native VPN check result:", result);
      return result?.value ?? null;
    } catch (e) {
      console.error("[VPN] Native VPN check error:", e);
      return null;
    }
  }, []);

  const detectVPN = useCallback(async () => {
    if (isLoading) return;
    if (typeof window === "undefined") {
      console.log("[VPN] Window undefined - skipping detection");
      return;
    }

    setIsLoading(true);
    console.log("[VPN] Starting VPN detection...");

    try {
      const nativeResult = await checkNativeVPN();
      console.log("[VPN] Native result:", nativeResult, "type:", typeof nativeResult);

      if (nativeResult === true) {
        console.log("[VPN] ✅ VPN DETECTED via native!");
        setDetectionMethod("native");
        setIsVPNDetected(true);
        if (blockOnDetection) {
          redirectToBlocked(
            "vpn_detected",
            "We noticed a VPN is active on your device. Please turn off the VPN, close the app completely, and then reopen it to continue."
          );
        }
        return;
      }

      console.log("[VPN] No VPN detected - clearing blocked state");
      setIsVPNDetected(false);
      localStorage.removeItem("vpn_blocked");
      localStorage.removeItem("vpn_blocked_recent");
      localStorage.removeItem("vpn_reason");
      localStorage.removeItem("vpn_message");
      setLastCheck(new Date());
    } catch (error) {
      console.error("[VPN] Detection error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, checkNativeVPN, blockOnDetection, redirectToBlocked]);

  useEffect(() => {
    if (!checkOnMount) return;

    const timer = setTimeout(async () => {
      const alreadyBlocked = localStorage.getItem("vpn_blocked_recent") === "true";
      
      if (alreadyBlocked) {
        await detectVPN();
        return;
      }

      detectVPN();
    }, 1500);

    return () => clearTimeout(timer);
  }, [checkOnMount, detectVPN, redirectToBlocked]);

  useEffect(() => {
    if (!checkOnAppResume || typeof window === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const blockedRecently = localStorage.getItem("vpn_blocked_recent");
        if (blockedRecently !== "true") {
          setTimeout(() => {
            detectVPN();
          }, 500);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkOnAppResume, detectVPN]);

  const retryDetection = useCallback(() => {
    cooldownRef.current = false;
    try {
      localStorage.removeItem("vpn_blocked");
      localStorage.removeItem("vpn_blocked_recent");
      localStorage.removeItem("vpn_reason");
      localStorage.removeItem("vpn_message");
    } catch (e) {}
    detectVPN();
  }, [detectVPN]);

  return {
    isVPNDetected,
    isLoading,
    detectionMethod,
    lastCheck,
    detectVPN,
    retryDetection,
  };
};

export default useVPNDetector;

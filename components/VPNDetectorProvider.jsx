"use client";

import { useEffect } from "react";
import { useVPNDetector } from "@/hooks/useVPNDetector";

export default function VPNDetectorProvider({ children }) {
  const { isVPNDetected, isLoading, detectionMethod } = useVPNDetector({
    checkOnMount: true,
    checkOnAppResume: true,
    blockOnDetection: true,
  });

  useEffect(() => {
    if (isVPNDetected && !isLoading) {
      console.log("[VPN] Blocked - Detection method:", detectionMethod);
    }
  }, [isVPNDetected, isLoading, detectionMethod]);

  return children;
}
"use client";

import { useVPNDetector } from "@/hooks/useVPNDetector";

export default function VPNDetectorProvider({ children }) {
  useVPNDetector({
    checkOnMount: true,
    checkOnAppResume: true,
    blockOnDetection: true,
  });

  return children;
}

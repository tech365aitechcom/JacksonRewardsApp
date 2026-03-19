"use client";

import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen as CapSplashScreen } from "@capacitor/splash-screen";
import Image from "next/image";

const FADE_MS = 300;
const NATIVE_FADE_MS = 400;
const NATIVE_MAX_MS = 8000; // safety: hide no matter what after 8s
const SPLASH_SHOWN_KEY = "jr_splash_shown";

// Show web overlay only on first open of a session (native handles its own splash).
function shouldShowSplash() {
  try {
    if (typeof window === "undefined") return false;
    if (Capacitor.isNativePlatform?.()) return false;
    return !sessionStorage.getItem(SPLASH_SHOWN_KEY);
  } catch {
    return false;
  }
}

export default function SplashScreen({ children }) {
  const [visible, setVisible] = useState(shouldShowSplash);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform?.();

    // ── Native ──────────────────────────────────────────────────────────────
    // Hide the Capacitor native splash as soon as the React app has mounted
    // and the first frame is ready to paint — same pattern as Instagram/WhatsApp.
    // A safety max timeout ensures it always hides even if something hangs.
    if (isNative) {
      const hide = () =>
        CapSplashScreen.hide({ fadeOutDuration: NATIVE_FADE_MS }).catch(() => {});

      // requestAnimationFrame fires after the browser has painted the first frame.
      // This is the native-equivalent of "app is ready to display".
      const raf = requestAnimationFrame(() => hide());
      const max = setTimeout(hide, NATIVE_MAX_MS);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(max);
      };
    }

    // ── Web — skip if already shown this session ─────────────────────────
    if (!visible) return;

    // ── Web — hide after first paint ─────────────────────────────────────
    sessionStorage.setItem(SPLASH_SHOWN_KEY, "1");

    const raf = requestAnimationFrame(() => {
      setFading(true);
      setTimeout(() => setVisible(false), FADE_MS);
    });

    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {children}

      {visible && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#3a9e42",
            opacity: fading ? 0 : 1,
            transition: fading ? `opacity ${FADE_MS}ms ease-out` : "none",
            pointerEvents: fading ? "none" : "auto",
          }}
        >
          <Image
            src="/splash.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
      )}
    </>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen as CapSplashScreen } from "@capacitor/splash-screen";
import Image from "next/image";

const SPLASH_MIN_MS = 2500;
const FADE_MS = 500;
const NATIVE_FADE_MS = 400;
const NATIVE_MAX_MS = 8000;
const SPLASH_SHOWN_KEY = "jr_splash_shown";

// Decide synchronously on first render whether to show the splash.
// This prevents any flicker on returning sessions where the key is already set.
function shouldShowSplash() {
  try {
    if (typeof window === "undefined") return false;   // SSR
    if (Capacitor.isNativePlatform?.()) return false;  // native: Capacitor handles it
    return !sessionStorage.getItem(SPLASH_SHOWN_KEY);   // web: once per session
  } catch {
    return false;
  }
}

export default function SplashScreen({ children }) {
  // Initialised lazily — reads sessionStorage before the first paint so there is
  // never a frame where a stale splash is visible and then instantly hidden.
  const [visible, setVisible] = useState(shouldShowSplash);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform?.();

    // ── Native ──────────────────────────────────────────────────────────────────
    // Capacitor's own native overlay covers the screen.  We call hide() after the
    // minimum branding time.  No web overlay is used so visible is already false.
    if (isNative) {
      const hide = () =>
        CapSplashScreen.hide({ fadeOutDuration: NATIVE_FADE_MS }).catch(() => { });
      const min = setTimeout(hide, SPLASH_MIN_MS);
      const max = setTimeout(hide, NATIVE_MAX_MS);
      return () => { clearTimeout(min); clearTimeout(max); };
    }

    // ── Web — not showing (already seen this session) ────────────────────────
    if (!visible) return;

    // ── Web — first open of this session ────────────────────────────────────
    sessionStorage.setItem(SPLASH_SHOWN_KEY, "1");

    const timer = setTimeout(() => {
      setFading(true);                                   // start opacity → 0
      setTimeout(() => setVisible(false), FADE_MS);      // remove from DOM after fade
    }, SPLASH_MIN_MS);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/*
        Children ALWAYS render here — the welcome/login page loads in the background
        while the splash is visible.  The solid backgroundColor on the overlay below
        ensures children are completely hidden until the fade completes.
        When the splash finishes fading the target page is already ready, so the
        user sees a clean single transition with no blank frame.
      */}
      {children}

      {visible && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            // Solid colour that matches the dominant green of splash.jpg.
            // Visible for the ~50 ms before the image loads — no transparent flash.
            backgroundColor: "#3a9e42",
            opacity: fading ? 0 : 1,
            transition: fading
              ? `opacity ${FADE_MS}ms ease-out`
              : "none",
            // Disable pointer events while fading so taps reach the page beneath
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

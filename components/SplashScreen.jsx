"use client";

import React, { useEffect, useState } from "react";
import { SplashScreen as CapSplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import Image from "next/image";

export default function SplashScreen({ children }) {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isWeb, setIsWeb] = useState(false);

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform?.();
    setIsWeb(!isNative);

    const initializeApp = async () => {
      try {
        if (isNative) {
          const checkAppReady = () => {
            const currentPath = window.location.pathname;
            const isNotOnRootPage = currentPath !== "/";
            if (isNotOnRootPage) setIsAppReady(true);
            else setTimeout(checkAppReady, 100);
          };
          setTimeout(checkAppReady, 500);
        } else {
          setIsAppReady(true);
        }
      } catch (error) {
        console.error("Error in splash screen initialization:", error);
        setIsAppReady(true);
      }
    };

    initializeApp();
  }, []);

  return (
    <>
      {children}
      {/* Web loading screen: show splash design until app is ready */}
      {isWeb && !isAppReady && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          style={{ width: "100vw", height: "100dvh", maxWidth: "100%", maxHeight: "100%" }}
          aria-hidden="true"
        >
          <Image
            src="/splash.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}
    </>
  );
}
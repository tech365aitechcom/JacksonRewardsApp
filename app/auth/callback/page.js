"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import Image from "next/image";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

const Spinner = () => (
  <div className="border-gray-500 h-16 w-16 animate-spin rounded-full border-4 border-t-[#af7de6]" />
);

// A simple SVG checkmark for the success state
const SuccessIcon = () => (
  <svg
    className="h-16 w-16 text-green-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// A simple SVG error icon for the failure state
const ErrorIcon = () => (
  <svg
    className="h-16 w-16 text-red-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleSocialAuthCallback, user, isLoading, token } = useAuth();

  // State to manage UI: 'processing', 'success', or 'error'
  const [status, setStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");
  const [authCompleted, setAuthCompleted] = useState(false);
  const [userStatusFlags, setUserStatusFlags] = useState(null); // New state for flags
  useEffect(() => {
    const processAuth = async () => {
      const token = searchParams.get("token");
      const authError =
        searchParams.get("message") || searchParams.get("error");
      const provider = searchParams.get("provider");
      const userId = searchParams.get("userId");

      // 1. Handle Native Deep Link (Keep as is)
      if (Capacitor.isNativePlatform()) {
        let deepLink = "com.jackson.app://auth/callback";
        if (token) {
          deepLink += `?token=${encodeURIComponent(token)}`;
          if (provider) deepLink += `&provider=${encodeURIComponent(provider)}`;
          if (userId) deepLink += `&userId=${encodeURIComponent(userId)}`;
        } else {
          const message = authError || "Authentication token not found.";
          deepLink += `?message=${encodeURIComponent(message)}`;
        }

        try {
          await Browser.close();
          setTimeout(() => {
            window.location.href = deepLink;
          }, 500);
        } catch (closeError) {
          window.location.href = deepLink;
        }
        return;
      }

      // 2. Handle Errors
      if (authError) {
        setErrorMessage(authError);
        setStatus("error");
        setTimeout(() => router.replace("/login"), 4000);
        return;
      }

      // 3. Process Login (WEB FLOW)
      if (token) {
        try {
          console.log(
            "✅ [Auth Callback] Token received, processing via Context..."
          );

          // result now contains: { ok: true, statusData: { needsDisclosure, needsLocation } }
          const result = await handleSocialAuthCallback(token);

          if (result.ok) {
            console.log("✅ [Auth Callback] Login and Status check successful");

            // NEW: Set the flags directly from the AuthContext result
            if (result.statusData) {
              setUserStatusFlags(result.statusData);
            }

            setStatus("success");
            setAuthCompleted(true);
          } else {
            setErrorMessage(result.error || "Authentication failed");
            setStatus("error");
            setTimeout(() => router.replace("/login"), 4000);
          }
        } catch (error) {
          setErrorMessage(error.message);
          setStatus("error");
          setTimeout(() => router.replace("/login"), 4000);
        }
      } else {
        setErrorMessage("Authentication token not found.");
        setStatus("error");
        setTimeout(() => router.replace("/login"), 3000);
      }
    };

    processAuth();
  }, [router, searchParams, handleSocialAuthCallback]);

  // Wait for auth state to be ready before redirecting
  // useEffect(() => {
  //   if (authCompleted && !isLoading && user) {
  //     // Small delay to ensure state is fully propagated
  //     const redirectTimer = setTimeout(() => {
  //       router.replace("/permissions");
  //     }, 500);
  //     return () => clearTimeout(redirectTimer);
  //   }
  // }, [authCompleted, isLoading, user, router]);

  useEffect(() => {
    // 1. Log why the effect is (or isn't) running

    if (authCompleted && !isLoading && user && userStatusFlags) {
      const { needsDisclosure, needsLocation } = userStatusFlags;

      // Start the redirect timer
      console.log("⏱️ [DEBUG-REDIRECT] Starting 800ms redirect timer...");

      const redirectTimer = setTimeout(() => {
        console.log("🚀 [DEBUG-REDIRECT] Timer Fired. Executing Logic...");

        // 2. Log LocalStorage Actions
        if (!needsDisclosure) {
          console.log(
            "💾 [DEBUG-REDIRECT] Setting local: permissionsAccepted = true"
          );
          localStorage.setItem("permissionsAccepted", "true");
        }
        if (!needsLocation) {
          console.log(
            "💾 [DEBUG-REDIRECT] Setting local: locationCompleted = true"
          );
          localStorage.setItem("locationCompleted", "true");
        }

        // 3. Log the Final Decision
        if (needsDisclosure) {
          console.log(
            "👉 [DEBUG-REDIRECT] DECISION: Redirecting to /permissions (Disclosure Required)"
          );
          router.replace("/permissions");
        } else if (needsLocation) {
          console.log(
            "👉 [DEBUG-REDIRECT] DECISION: Redirecting to /location (Location Required)"
          );
          router.replace("/location");
        } else {
          console.log(
            "👉 [DEBUG-REDIRECT] DECISION: Redirecting to /homepage (All steps complete)"
          );
          router.replace("/homepage");
        }
      }, 800);

      return () => {
        console.log("🧹 [DEBUG-REDIRECT] Cleaning up timer");
        clearTimeout(redirectTimer);
      };
    } else {
      // Log what is missing if the condition fails
      const missing = [];
      if (!authCompleted) missing.push("authCompleted");
      if (isLoading) missing.push("isLoading (still true)");
      if (!user) missing.push("user object");
      if (!userStatusFlags) missing.push("userStatusFlags");

      console.log(
        "⚠️ [DEBUG-REDIRECT] Condition not met yet. Waiting for:",
        missing.join(", ")
      );
    }
  }, [authCompleted, isLoading, user, userStatusFlags, router]);

  // Helper function to render content based on status
  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <>
            <SuccessIcon />
            <h1 className="text-2xl font-semibold text-white mt-4">Success!</h1>
            <p className="text-neutral-400 mt-2">
              Welcome! Setting up your account...
            </p>
            <p className="text-neutral-500 text-sm mt-1">
              Please wait, we&apos;re almost there...
            </p>
          </>
        );
      case "error":
        return (
          <>
            <ErrorIcon />
            <h1 className="text-2xl font-semibold text-red-400 mt-4">
              Authentication Failed
            </h1>
            <p className="text-neutral-400 mt-2 text-center">{errorMessage}</p>
          </>
        );
      case "processing":
      default:
        return (
          <>
            <Spinner />
            <h1 className="text-2xl font-semibold text-white mt-4">
              Authenticating...
            </h1>
            <p className="text-neutral-400 mt-2">
              Please wait while we securely sign you in.
            </p>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#272052] overflow-x-hidden">
      <div className="relative w-full min-h-screen bg-[#272052] flex justify-center items-center">
        <div className="absolute w-[375px] h-[1061px] bg-[#272052] overflow-hidden">
          <div className="absolute w-[470px] h-[883px] -top-32 -left-3.5">
            <div className="absolute w-[358px] h-[358px] top-0 left-7 bg-[#af7de6] rounded-[179px] blur-[250px]" />
            <Image
              className="absolute w-[83px] h-[125px] top-[140px] left-3.5"
              alt="Front shapes"
              src="https://c.animaapp.com/bkGH9LUL/img/front-shapes@2x.png"
              width={83}
              height={125}
            />
            <Image
              className="absolute w-[18px] h-[275px] top-[160px] left-[371px]"
              alt="Saly"
              src="https://c.animaapp.com/bkGH9LUL/img/saly-16@2x.png"
              width={18}
              height={275}
            />
          </div>
        </div>

        {/* Centered Content Box */}
        <div className="relative z-10 w-[314px] flex flex-col items-center justify-center p-6 [font-family:'Poppins',Helvetica]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#272052] flex justify-center items-center">
          <div className="border-gray-500 h-16 w-16 animate-spin rounded-full border-4 border-t-[#af7de6]" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

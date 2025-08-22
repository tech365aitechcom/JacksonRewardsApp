"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import Image from "next/image"; // Import Image for decorative elements

// A loading spinner styled to match your app's purple theme
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
  const { handleSocialAuthCallback } = useAuth();

  // State to manage UI: 'processing', 'success', or 'error'
  const [status, setStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const processAuth = async () => {
      const token = searchParams.get("token");
      const authError = searchParams.get("message");

      if (authError) {
        setErrorMessage(authError || "An unknown error occurred.");
        setStatus("error");
        setTimeout(() => router.push("/login"), 4000);
        return;
      }

      if (token) {
        const result = await handleSocialAuthCallback(token);
        if (result.ok) {
          // On success, show a success message before redirecting
          setStatus("success");
          setTimeout(() => router.push("/homepage"), 5000); // Shorter delay for success
        } else {
          setErrorMessage(
            result.error ||
              "Failed to process authentication. Please try again."
          );
          setStatus("error");
          setTimeout(() => router.push("/login"), 4000);
        }
      } else {
        setErrorMessage(
          "Authentication token not found. Redirecting to login..."
        );
        setStatus("error");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    processAuth();
  }, [router, searchParams, handleSocialAuthCallback]);

  // Helper function to render content based on status
  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <>
            <SuccessIcon />
            <h1 className="text-2xl font-semibold text-white mt-4">Success!</h1>
            <p className="text-neutral-400 mt-2">
              Redirecting you to the app...
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
    <Suspense fallback={
      <div className="min-h-screen w-full bg-[#272052] flex justify-center items-center">
        <div className="border-gray-500 h-16 w-16 animate-spin rounded-full border-4 border-t-[#af7de6]" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

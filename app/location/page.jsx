"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // Import auth context
import { updateLocationSettings, updateLocation } from "@/lib/api"; // Import API functions

export default function LocationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // State for user feedback
  const router = useRouter();
  const [isSkipping, setIsSkipping] = useState(false);
  const { user, token } = useAuth(); // Get user and token for API calls
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const handleContinue = () => {
    // Guard against missing auth data
    if (!user || !token) {
      setError("Authentication session not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Use the browser's Geolocation API
    navigator.geolocation.getCurrentPosition(
      // SUCCESS CALLBACK (User clicked "Allow")
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Location permission granted:", { latitude, longitude });

        try {
          // 1. Update permission status on the backend
          await updateLocationSettings(user.mobile, "granted", "while_using");
          console.log("Location settings updated to 'granted'");

          // 2. Send the actual coordinates to the backend
          await updateLocation({ latitude, longitude }, token);
          console.log("User's current location sent to backend");

          // 3. Navigate to the dashboard
          router.push("/dashboard");
        } catch (apiError) {
          console.error("Failed to update location on backend:", apiError);
          setError(apiError.message || "Could not save your location. Please try again.");
          setIsLoading(false);
        }
      },
      // ERROR CALLBACK (User clicked "Block" or an error occurred)
      async (err) => {
        console.warn(`Location permission error (${err.code}): ${err.message}`);

        try {
          // Update permission status to 'denied' on the backend
          await updateLocationSettings(user.mobile, "denied", "never");
          console.log("Location settings updated to 'denied'");
        } catch (apiError) {
          console.error("Failed to update location settings to 'denied':", apiError);
        } finally {
          // Provide feedback to the user and stop loading
          setError("Location access is required for the app to work correctly.");
          setIsLoading(false);
        }
      },
      // Geolocation API options
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSkip = async () => {
    if (!user) {
      setError("Authentication session not found. Please log in again.");
      return;
    }

    setIsSkipping(true);
    setError(null);

    try {
      // Update the backend immediately when the user chooses to skip
      await updateLocationSettings(user.mobile, "denied", "never");
      console.log("User chose to skip. Settings updated, showing warning.");

      // THIS IS THE KEY CHANGE: Show the in-page warning
      setShowSkipWarning(true);

    } catch (apiError) {
      console.error("Failed to update location settings on skip:", apiError);
      setError("An error occurred. Please try again.");
    } finally {
      // Stop the "Skipping..." loader, the user will now see the warning
      setIsSkipping(false);
    }
  };

  const handleConfirmSkip = () => {
    router.push("/homepage");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div
      className="relative w-screen h-screen bg-[#272052] overflow-hidden"
      data-model-id="949:9584"
    >
      <div className="relative w-[375px] h-[812px] mx-auto">
        <div className="absolute w-[375px] h-[637px] -top-32 left-0">
          <div className="absolute w-[358px] h-[358px] top-0 left-3.5 bg-[#af7de6] rounded-[179px] blur-[250px]" />

          <img
            className="absolute w-[285px] h-[285px] top-[248px] left-[45px] aspect-[1] object-cover"
            alt="Location access illustration showing a map pin on a colorful map"
            src="https://c.animaapp.com/gGYGC01x/img/image-4028@2x.png"
          />

          <p className="absolute w-[310px] top-[517px] left-8 [font-family:'Poppins',Helvetica] font-normal text-white text-xl text-center tracking-[0] leading-[normal]">
            You must select &quot;Allow While Using the App&quot; on the next
            screen for Jackson app to work
          </p>

          {/* <div className="absolute w-[375px] h-11 top-32 left-0 bg-[url(https://c.animaapp.com/gGYGC01x/img/iphone-x--11-pro---black.svg)] bg-[100%_100%]" /> */}

          <header className="flex flex-col w-[375px] items-start gap-2 px-5 py-3 absolute top-[182px] left-0">
            <nav
              className="items-center gap-4 self-stretch w-full rounded-[32px] flex relative flex-[0_0_auto]"
              role="navigation"
              aria-label="Location access navigation"
            >
              <button
                className="relative w-6 h-6 cursor-pointer"
                aria-label="Go back"
                onClick={handleGoBack}
              >
                <img
                  className="w-full h-full"
                  alt=""
                  src="https://c.animaapp.com/gGYGC01x/img/arrow-back-ios-new@2x.png"
                />
              </button>

              <h1 className="relative w-[255px] [font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0] leading-5">
                Location Access
              </h1>

              <button
                className="relative w-6 h-6 mb-[-5739.00px] cursor-pointer"
                aria-label="Open messages"
              >
                {/* <img
                className="w-full h-full"
                alt=""
                src="/img/messages-chat.png"
              /> */}
              </button>
            </nav>
          </header>
        </div>

        <div className="absolute bottom-4 left-0 w-[375px] px-4">
          {/* Added a small error display that doesn't affect the layout */}
          {
            error && (
              <p className="text-red-400 text-center text-sm mb-2">{error}</p>
            )
          }
          {!showSkipWarning ? (
            // DEFAULT VIEW
            <>
              <button
                className="w-full h-12 rounded-[12.97px] bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)] cursor-pointer transition-opacity duration-200 hover:opacity-90 active:opacity-80 disabled:opacity-50 flex items-center justify-center"
                onClick={handleContinue}
                disabled={isLoading || isSkipping}
                aria-label="Continue to location permission request"
              >
                <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-[normal]">
                  {isLoading ? "Requesting..." : "Continue"}
                </span>
              </button>
              <button
                onClick={handleSkip}
                disabled={isLoading || isSkipping}
                className="w-full mt-4 [font-family:'Poppins',Helvetica] font-normal text-gray-400 text-sm text-center tracking-[0] leading-[normal] hover:text-white transition-colors duration-200 disabled:opacity-50"
              >
                {isSkipping ? "Updating..." : "Skip for now"}
              </button>
            </>
          ) : (
            // WARNING VIEW
            <div className="text-center">
              <p className="mb-4 text-yellow-300 [font-family:'Poppins',Helvetica] text-sm leading-6">
                Warning: Location-dependent features won't work correctly if you skip this step.
              </p>
              <button
                className="w-full h-12 rounded-[12.97px] bg-[linear-gradient(180deg,rgba(226,106,106,1)_0%,rgba(192,57,43,1)_100%)] cursor-pointer transition-opacity duration-200 hover:opacity-90 active:opacity-80 flex items-center justify-center"
                onClick={handleConfirmSkip}
                aria-label="Proceed to dashboard anyway"
              >
                <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-[normal]">
                  Proceed Anyway
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


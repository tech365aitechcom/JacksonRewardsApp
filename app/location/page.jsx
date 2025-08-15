"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LocationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    setIsLoading(true);
    // Simulate location permission request
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to next page after permission
      router.push("/dashboard");
    }, 1000);
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
          <button
            className="w-full h-12 rounded-[12.97px] bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)] cursor-pointer transition-opacity duration-200 hover:opacity-90 active:opacity-80 disabled:opacity-50 flex items-center justify-center"
            onClick={handleContinue}
            disabled={isLoading}
            aria-label="Continue to location permission request"
          >
            <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-[normal]">
              {isLoading ? "Loading..." : "Continue"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
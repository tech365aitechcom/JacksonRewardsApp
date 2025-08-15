"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function FaceIdPage() {
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleContinue = () => {
    setIsScanning(true);
    // Simulate Face ID scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Navigate to next page after successful scan
      router.push("/dashboard");
    }, 3000);
  };

  return (
    <div className="relative w-screen h-screen bg-[#272052] overflow-hidden">
      <div className="relative w-[375px] h-[812px] mx-auto">
        <div className="absolute w-[375px] h-[589px] -top-32 left-0">
          <div className="absolute w-[358px] h-[358px] top-0 left-3.5 bg-[#af7de6] rounded-[179px] blur-[250px]" />

          <img
            className="absolute w-[333px] h-[351px] top-[239px] left-[21px]"
            alt="Face ID scanning interface showing a person's face with biometric scanning overlay"
            src="/Image.png"
          />

          <header className="flex flex-col w-[375px] items-start gap-2 px-5 py-3 absolute top-[182px] left-0">
            <nav
              className="items-center gap-4 self-stretch w-full rounded-[32px] flex relative flex-[0_0_auto]"
              role="navigation"
              aria-label="Face ID navigation"
            >
              <button
                className="relative w-6 h-6 p-0 bg-transparent border-0 cursor-pointer"
                aria-label="Go back"
                type="button"
                onClick={handleGoBack}
              >
                <img 
                  className="w-full h-full" 
                  alt="" 
                  src="https://c.animaapp.com/gGYGC01x/img/arrow-back-ios-new@2x.png" 
                />
              </button>

              <h1 className="relative w-[255px] [font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0] leading-5">
                Face ID
              </h1>

              <button
                className="relative w-6 h-6 p-0 bg-transparent border-0 cursor-pointer"
                aria-label="Open messages"
                type="button"
              >
                {/* <img 
                  className="w-full h-full" 
                  alt="" 
                  src="/img/messages-chat.svg" 
                /> */}
              </button>
            </nav>
          </header>
        </div>

        <section
          className="absolute w-[310px] top-[479px] left-[43px]"
          aria-live="polite"
        >
          <p className="[font-family:'Poppins',Helvetica] font-normal text-white text-xl text-center tracking-[0] leading-[normal]">
            {isScanning 
              ? "Scanning your face... Keep your head still" 
              : "Move your head slowly from left to right to complete the process"
            }
          </p>
        </section>

        <div className="absolute bottom-4 left-0 w-[375px] px-4">
          <button
            className="w-full h-12 rounded-[12.97px] bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)] cursor-pointer transition-opacity duration-200 hover:opacity-90 active:opacity-80 disabled:opacity-50 flex items-center justify-center border-0"
            type="button"
            onClick={handleContinue}
            disabled={isScanning}
            aria-label="Continue with Face ID setup"
          >
            <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-[normal]">
              {isScanning ? "Scanning..." : "Continue"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
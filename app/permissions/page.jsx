"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

import { acceptDisclosure } from "@/lib/api";

export default function PermissionsPage() {
  const router = useRouter();
  const { token } = useAuth(); // Get the auth token from your context
  console.log("token", token)

  // + ADDED state for loading and error handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [verificationCode, setVerificationCode] = useState([
    "0",
    "0",
    "0",
    "0",
  ]);

  const verificationInputs = [
    { id: 0, value: verificationCode[0] },
    { id: 1, value: verificationCode[1] },
    { id: 2, value: verificationCode[2] },
    { id: 3, value: verificationCode[3] },
  ];

  const permissionItems = [
    {
      title: "Access to Installed Apps",
      description:
        "You are granted a limited, non-exclusive, non-transferable license to access and use the Software/Platform solely for business purposes in object code form.",
    },
    {
      title: "Approximate Geolocation Data (Non-Continuous)",
      description:
        "You are granted a limited, non-exclusive, non-transferable license to access and use the Software/Platform solely for business purposes in object code form.",
    },
    {
      title: "Display Over Other Apps Permission",
      description:
        "You are granted a limited, non-exclusive, non-transferable license to access and use the Software/Platform solely for business purposes in object code form.",
    },
    {
      title: "Notifications",
      description:
        "You are granted a limited, non-exclusive, non-transferable license to access and use the Software/Platform solely for business purposes in object code form.",
    },
  ];

  const handleVerificationInputChange = (index, value) => {
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
  };

  const handleVerify = () => {
    console.log("Verification code:", verificationCode.join(""));
  };

  const handleAgree = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Ensure token exists before making the API call
    if (!token) {
      console.error("No auth token found. User must be logged in.");
      setError("Authentication error. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Accepting disclosure...");
      await acceptDisclosure(token);
      console.log("Disclosure accepted successfully");

      // On success, redirect the user
      router.push("/location");

    } catch (err) {
      console.error("Failed to accept disclosure:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      // Re-enable the button
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#272052] relative overflow-hidden">
      <div className="w-full max-w-sm mx-auto h-full bg-[#272052] relative overflow-hidden">
        {/* Background blur effect */}
        <div
          className="absolute w-full h-full bg-[#af7de6] rounded-full blur-[250px] opacity-40 scale-150 top-[-200px] left-[-100px]"
          aria-hidden="true"
        />

        {/* Verification Section */}
        <section
          className="relative z-10 text-center px-8 pt-20"
          aria-labelledby="verification-heading"
        >
          <h1
            id="verification-heading"
            className="[font-family:'Poppins',Helvetica] font-normal text-white text-3xl tracking-[0.20px] leading-[1.3] mb-20"
          >
            We have sent<br />
            verification code to<br />
            your phone number
          </h1>

          <p className="[font-family:'Poppins',Helvetica] font-light text-white text-base tracking-[0.20px] leading-normal mb-16">
            Verify it&apos;s you
          </p>

          <div
            className="flex items-center justify-center gap-4 mb-12"
            role="group"
            aria-label="Verification code input"
          >
            {verificationInputs.map((input, index) => (
              <div key={input.id} className="relative">
                <div className="w-16 h-16 bg-[url(https://c.animaapp.com/3ZacrHav/img/card@2x.png)] bg-cover rounded-lg">
                  <input
                    type="text"
                    maxLength="1"
                    value={input.value}
                    onChange={(e) =>
                      handleVerificationInputChange(index, e.target.value)
                    }
                    className="w-full h-full bg-transparent [font-family:'Poppins',Helvetica] font-medium text-white text-xl text-center focus:outline-none border-none"
                    aria-label={`Verification code digit ${index + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleVerify}
            className="w-full max-w-xs mx-auto h-12 rounded-xl bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#272052]"
            aria-label="Verify phone number"
          >
            <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-lg tracking-[0] leading-[normal]">
              Verify
            </span>
          </button>
        </section>

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20"
          aria-hidden="true"
        />

        {/* Permissions Modal */}
        <section
          className="absolute bottom-4 left-4 right-4 h-[85%] z-30 rounded-2xl overflow-hidden [background:radial-gradient(50%_50%_at_50%_50%,rgba(134,47,148,1)_0%,rgba(6,9,78,1)_100%)] flex flex-col"
          aria-labelledby="permissions-heading"
        >
          <header className="p-6 pb-4">
            <h2
              id="permissions-heading"
              className="[font-family:'Poppins',Helvetica] font-semibold text-white text-lg tracking-[0] leading-[normal]"
            >
              Prominent Disclosure
            </h2>
          </header>

          <div className="flex-1 px-6 pb-20 overflow-y-auto">
            <div className="space-y-6">
              {permissionItems.map((item, index) => (
                <article
                  key={index}
                  className="flex flex-col gap-2"
                >
                  <h3 className="[font-family:'Poppins',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 text-left">
                    {item.title}
                  </h3>
                  <p className="[font-family:'Poppins',Helvetica] font-light text-gray-300 text-xs tracking-[0] leading-5 text-left pl-4">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            {/* + ADDED: Conditional error message display */}
            {error && <p className="text-red-400 text-center text-sm mb-2">{error}</p>}
            <button
              onClick={handleAgree}
              // + ADDED: Disable button when submitting
              disabled={isSubmitting}
              // + ADDED: Styling for the disabled state
              className="w-full h-12 rounded-xl bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Agree to permissions"
            >
              <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
                {/* + ADDED: Dynamic button text based on loading state */}
                {isSubmitting ? 'Agreeing...' : 'Agree'}
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
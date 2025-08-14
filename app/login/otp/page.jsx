"use client";
import React, { useState } from "react";

export default function OTPPage() {
  const [otpValues, setOtpValues] = useState(["0", "0", "0", "0"]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otpValues.join("");
    console.log("OTP Code:", otpCode);
    // Add verification logic here
  };

  return (
    <div className="bg-[#272052] grid justify-items-center items-start w-screen min-h-screen">
      <div className="bg-[#272052] overflow-hidden w-[375px] h-[812px] relative">
        <div className="absolute w-[542px] h-[542px] top-[-58px] -left-6 bg-[#af7de6] rounded-[271px] blur-[250px]">
          {/* This div creates the blurred circle background */}
        </div>
        
        <div className="relative z-10 p-11">
          <h1 className="font-normal text-white text-3xl tracking-[0.20px] leading-[39px] mt-[137px]">
            We have sent
            <br />
            verification code to
            <br />
            your phone number
          </h1>

          <p className="font-light text-white text-base tracking-[0.20px] leading-[39px] whitespace-nowrap mt-[60px]">
            Verify it&apos;s you
          </p>

          <div
            className="flex items-center gap-4 mt-[40px] justify-center"
            role="group"
            aria-label="OTP verification code input"
          >
            {otpValues.map((value, index) => (
              <div key={index} className="w-[60px] h-[60px]">
                <input
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full h-full bg-white/10 border border-white/20 rounded-lg text-white text-2xl font-medium text-center outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-200"
                  aria-label={`OTP digit ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <div className="w-[316px] h-[50px] mt-[60px]">
            <button
              onClick={handleVerify}
              className="relative w-[314px] h-[50px] rounded-[12.97px] bg-gradient-to-b from-[#9eadf7] to-[#716ae7] hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Verify OTP code"
            >
              <span className="absolute top-[11px] left-[126px] font-semibold text-white text-lg tracking-[0] leading-[normal]">
                Verify
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
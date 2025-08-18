"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [step, setStep] = useState("email"); // "email" or "verification"
  const router = useRouter();

  const handleVerificationCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      console.log("Sending reset email to:", email);
      setStep("verification");
    }
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    const code = verificationCode.join("");
    if (code.length === 4) {
      console.log("Verification code submitted:", code);
      // Handle verification logic here
      // On success, redirect to reset password page or login
      router.push("/login");
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const handleResendCode = () => {
    console.log("Resending verification code to:", email);
    // Handle resend logic here
  };

  if (step === "verification") {
    return (
      <div className="bg-[#272052] flex h-screen flex-row justify-center w-full relative overflow-hidden">
        <div className="bg-[#272052] overflow-hidden w-full max-w-[375px] relative">
          {/* Background blur effects */}
          <div className="absolute w-[358px] h-[358px] top-0 left-[9px] bg-[#af7de6] rounded-[179px] blur-[250px]" />
          
          {/* Background overlay */}
          <div className="absolute inset-0 bg-[#20202033] backdrop-blur-[5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5px)_brightness(100%)]" />

          {/* Content container */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <p className="text-center [font-family:'Poppins',Helvetica] font-normal text-white text-3xl tracking-[0.20px] leading-[39px] mb-8">
              We have sent
              <br />
              verification code to
              <br />
              your email address
            </p>

            <div className="text-center [font-family:'Poppins',Helvetica] font-light text-white text-base tracking-[0.20px] leading-[39px] mb-8">
              Verify it&apos;s you
            </div>

            <form
              onSubmit={handleVerificationSubmit}
              className="flex items-center gap-[18.62px] mb-8"
            >
              {verificationCode.map((digit, index) => (
                <div key={index} className="relative w-[69.49px] h-16">
                  <div className="relative w-[67px] h-16 bg-[url(https://c.animaapp.com/mFOMgUve/img/card@2x.png)] bg-[100%_100%]">
                    <input
                      id={`code-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) =>
                        handleVerificationCodeChange(index, e.target.value)
                      }
                      className="absolute top-[15px] left-[27px] [font-family:'Poppins',Helvetica] font-medium text-white text-[23.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none text-center w-[13px]"
                      maxLength="1"
                      aria-label={`Verification code digit ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
            </form>

            <button
              onClick={handleVerificationSubmit}
              className="w-[316px] h-[50px] mb-4"
              aria-label="Verify code"
              type="button"
            >
              <div className="relative w-[314px] h-[50px] rounded-[12.97px] bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)]">
                <div className="absolute top-[11px] left-[126px] [font-family:'Poppins',Helvetica] font-semibold text-white text-lg tracking-[0] leading-[normal]">
                  Verify
                </div>
              </div>
            </button>

            <button
              onClick={handleResendCode}
              className="[font-family:'Poppins',Helvetica] font-medium text-[#9098f2] text-sm tracking-[0] leading-[normal] cursor-pointer bg-transparent border-none underline mb-2"
              type="button"
            >
              Resend Code
            </button>

            <button
              onClick={handleBackToLogin}
              className="[font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-sm tracking-[0] leading-[normal] cursor-pointer bg-transparent border-none"
              type="button"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#272052] flex h-screen flex-row justify-center w-full relative overflow-hidden">
      <div className="bg-[#272052] overflow-hidden w-full max-w-[375px] relative">
        {/* Background blur effects */}
        <div className="absolute w-[358px] h-[358px] top-0 left-[9px] bg-[#af7de6] rounded-[179px] blur-[250px]" />
        
        {/* Background overlay */}
        <div className="absolute inset-0 bg-[#20202033] backdrop-blur-[5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5px)_brightness(100%)]" />

        {/* Main content card */}
        <div className="absolute w-[271px] h-[481px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[15px] overflow-hidden [background:radial-gradient(50%_50%_at_50%_50%,rgba(134,47,148,1)_0%,rgba(6,9,78,1)_100%)] z-10">
          <div className="absolute w-[168px] h-[81px] top-[25px] left-[51px]">
            <div
              className="absolute w-28 top-px left-[33px] [font-family:'Poppins',Helvetica] font-medium text-white text-[64px] text-center tracking-[0] leading-[normal]"
              role="img"
              aria-label="Lock icon"
            >
              🔐
            </div>
          </div>

          <h1 className="absolute top-[117px] left-[31px] [font-family:'Poppins',Helvetica] font-extrabold text-[#efefef] text-2xl tracking-[0] leading-[normal]">
            Forgot Password?
          </h1>

          <div className="absolute w-[240px] h-[140px] top-[164px] left-4">
            <p className="absolute w-[220px] top-0 left-[10px] [font-family:'Poppins',Helvetica] font-medium text-white text-[13px] text-center tracking-[0] leading-[normal]">
              Don&#39;t worry! Enter your email address below and we&#39;ll send
              you a link to reset your password.
            </p>

            <label className="absolute w-[134px] top-[75px] left-[10px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
              Email Address
            </label>

            <div className="absolute w-[220px] h-[45px] top-[95px] left-[10px]">
              <div className="relative w-full h-full bg-[rgba(255,255,255,0.1)] rounded-lg border border-[rgba(255,255,255,0.2)] backdrop-blur-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full px-4 bg-transparent border-none outline-none text-white [font-family:'Poppins',Helvetica] font-medium text-[14.3px] tracking-[0] leading-[normal] placeholder:text-[#d3d3d3]"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  required
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleEmailSubmit}
            className="absolute w-[210px] h-[39px] top-[320px] left-[30px] rounded-lg overflow-hidden bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)]"
            aria-label="Send reset link"
            type="button"
          >
            <div className="flex items-center justify-center w-full h-full [font-family:'Poppins',Helvetica] font-semibold text-white text-sm text-center tracking-[0] leading-[normal]">
              Send Reset Link
            </div>
          </button>

          <button
            onClick={handleBackToLogin}
            className="absolute top-[380px] left-[90px] text-center"
            aria-label="Back to login"
            type="button"
          >
            <div className="[font-family:'Poppins',Helvetica] font-normal text-neutral-400 text-sm tracking-[0] leading-5 cursor-pointer">
              Back to Login
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
'use client'
import React, { useState } from 'react'
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import useOnboardingStore from '@/stores/useOnboardingStore';

const SignUp = () => {
  const router = useRouter();
  const { signUpAndSignIn } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    otp: "123423", // Kept in state but will be unused by the user
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");


  const handleInputChange = (field, value) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- Form Validations ---
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      setError("Please fill all the required fields.");
      return;
    }
    if (countryCode === "+91" && !/^[6-9]\d{9}$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    } else if (countryCode !== "+91" && formData.mobile.length < 7) {
      setError("Please enter a valid mobile number.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const fullMobile = `${countryCode}${formData.mobile}`;

    try {
      const [firstName, ...lastNameParts] = formData.name.trim().split(' ');
      const lastName = lastNameParts.join(' ') || '-';

      // 1. Get all the collected onboarding data from the Zustand store
      const onboardingData = useOnboardingStore.getState();

      // 2. Construct a complete user object with both form data AND onboarding data
      const fullSignupData = {
        // Data from this signup form
        firstName,
        lastName,
        email: formData.email,
        mobile: fullMobile,
        password: formData.password,
        otp: "123456", // Dummy OTP as backend marks user verified

        // Data from the onboarding store
        gender: onboardingData.gender,
        ageRange: onboardingData.ageRange,
        gamePreferences: onboardingData.gamePreferences,
        gameStyle: onboardingData.gameStyle,
        improvementArea: onboardingData.improvementArea,
        dailyEarningGoal: onboardingData.dailyEarningGoal,
      };

      // 3. Call the signUpAndSignIn function with the complete data payload
      const result = await signUpAndSignIn(fullSignupData);

      if (result.ok) {
        // On success, AuthContext handles saving the token/user and resetting the onboarding store.
        // We just need to navigate to the next page.
        router.push('/permissions');
      } else {
        // If signup fails, display the error from the context
        setError(result.error || "Signup failed. An unknown error occurred.");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInClick = () => {
    router.push('/login');
  };
  return (
    <div className="min-h-screen w-full bg-[#272052] overflow-x-hidden">
      <div
        className="relative w-full min-h-screen bg-[#272052] flex justify-center"
        data-model-id="1322:2980"
      >
        <div className="relative w-[375px] min-h-[1061px] bg-[#272052] overflow-hidden"
        >
          <div className="absolute w-[470px] h-[883px] -top-32 -left-3.5">
            <div className="absolute w-[358px] h-[358px] top-0 left-7 bg-[#af7de6] rounded-[179px] blur-[250px]" />

            <div className="absolute w-[470px] h-[312px] top-[374px] left-0">
              <Image
                className="absolute w-[83px] h-[125px] top-[-22px] left-3.5"
                alt="Front shapes"
                src="https://c.animaapp.com/bkGH9LUL/img/front-shapes@2x.png"
                width={83}
                height={125}
              />

              <div className="absolute w-[41px] h-72 top-[33px] left-[348px]">
                <Image
                  className="absolute w-[41px] h-[106px] top-0 left-0"
                  alt="Front shapes"
                  src="https://c.animaapp.com/bkGH9LUL/img/front-shapes-1@2x.png"
                  width={41}
                  height={106}
                />

                <Image
                  className="absolute w-[18px] h-[275px] top-[13px] left-[23px]"
                  alt="Saly"
                  src="https://c.animaapp.com/bkGH9LUL/img/saly-16@2x.png"
                  width={18}
                  height={275}
                />
              </div>
            </div>

            <Image
              className="absolute w-[21px] h-[22px] top-[189px] left-[338px]"
              alt="Gem"
              src="https://c.animaapp.com/bkGH9LUL/img/gem-1@2x.png"
              width={21}
              height={22}
            />

            <form
              onSubmit={handleSubmit}
              className="w-[314px] absolute top-[274px] left-[50px] flex flex-col items-start gap-5"
            >
              <div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative w-[314px] h-[55px]">
                  <div className="relative bg-[url(https://c.animaapp.com/bkGH9LUL/img/card@2x.png)] w-[314px] h-[55px] bg-[100%_100%]">
                    <Image
                      className="absolute w-[17px] h-[17px] top-5 left-5"
                      alt="User icon"
                      src="https://c.animaapp.com/bkGH9LUL/img/vector-2.svg"
                      width={17}
                      height={17}
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[240px]"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative w-[314px] h-[55px]">
                  <div className="relative bg-[url(https://c.animaapp.com/bkGH9LUL/img/card@2x.png)] w-[314px] h-[55px] bg-[100%_100%]">
                    <Image
                      className="absolute w-[17px] h-[17px] top-5 left-5"
                      alt="Email icon"
                      src="https://c.animaapp.com/bkGH9LUL/img/vector-2.svg"
                      width={17}
                      height={17}
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[240px]"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative w-[314px] h-[55px]">
                  <div className="relative bg-[url(https://c.animaapp.com/bkGH9LUL/img/card@2x.png)] w-[314px] h-[55px] bg-[100%_100%]">
                    <Image
                      className="absolute w-[17px] h-[17px] top-5 left-5"
                      alt="Phone icon"
                      src="https://c.animaapp.com/bkGH9LUL/img/vector-2.svg"
                      width={17}
                      height={17}
                    />
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="absolute top-[17px] left-[50px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] bg-transparent border-none outline-none w-[50px]"
                    >
                      <option value="+91" className="bg-[#272052] text-[#d3d3d3]">+91</option>
                      <option value="+1" className="bg-[#272052] text-[#d3d3d3]">+1</option>
                      <option value="+44" className="bg-[#272052] text-[#d3d3d3]">+44</option>
                      <option value="+61" className="bg-[#272052] text-[#d3d3d3]">+61</option>
                    </select>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      className="absolute top-[17px] left-[105px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[190px]"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                </div>
              </div>

              {showOtp && (<div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  Verify OTP sent to your mobile number
                </label>
                <div className="relative w-[314px] h-[55px]">
                  <Image
                    className="absolute w-[314px] h-[55px] top-0 left-0"
                    alt="OTP input background"
                    src="https://c.animaapp.com/bkGH9LUL/img/username@2x.png"
                    width={314}
                    height={55}
                  />
                  <input
                    type="text"
                    maxLength="6"
                    className="absolute top-[17px] left-[20px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[274px] disabled:opacity-50 text-center"
                    placeholder='----'
                    disabled={true}
                  />
                </div>
              </div>)}

              <div className="flex flex-col items-start gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative bg-[url(https://c.animaapp.com/bkGH9LUL/img/card@2x.png)] w-[314px] h-[55px] bg-[100%_100%]">
                  <div className="absolute w-[17px] h-[17px] top-5 left-5">
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path d="M4 7V5C4 2.5 5.5 1 8 1C10.5 1 12 2.5 12 5V7M8 10C8.5 10 9 10.5 9 11C9 11.5 8.5 12 8 12C7.5 12 7 11.5 7 11C7 10.5 7.5 10 8 10ZM3 7H13C13.5 7 14 7.5 14 8V14C14 14.5 13.5 15 13 15H3C2.5 15 2 14.5 2 14V8C2 7.5 2.5 7 3 7Z" stroke="#d3d3d3" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[200px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-[17px] right-[20px] w-[17px] h-[17px]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M8.5 2.5c-4 0-7.5 4-7.5 4s3.5 4 7.5 4 7.5-4 7.5-4-3.5-4-7.5-4zM8.5 5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" stroke="#d3d3d3" strokeWidth="1" fill="none"/>
                        <path d="M2 2l13 13" stroke="#d3d3d3" strokeWidth="1"/>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M8.5 2.5c-4 0-7.5 4-7.5 4s3.5 4 7.5 4 7.5-4 7.5-4-3.5-4-7.5-4zM8.5 5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" stroke="#d3d3d3" strokeWidth="1" fill="none"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-start gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative bg-[url(https://c.animaapp.com/bkGH9LUL/img/card@2x.png)] w-[314px] h-[55px] bg-[100%_100%]">
                  <div className="absolute w-[17px] h-[17px] top-5 left-5">
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path d="M4 7V5C4 2.5 5.5 1 8 1C10.5 1 12 2.5 12 5V7M8 10C8.5 10 9 10.5 9 11C9 11.5 8.5 12 8 12C7.5 12 7 11.5 7 11C7 10.5 7.5 10 8 10ZM3 7H13C13.5 7 14 7.5 14 8V14C14 14.5 13.5 15 13 15H3C2.5 15 2 14.5 2 14V8C2 7.5 2.5 7 3 7Z" stroke="#d3d3d3" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[200px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-[17px] right-[20px] w-[17px] h-[17px]"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M8.5 2.5c-4 0-7.5 4-7.5 4s3.5 4 7.5 4 7.5-4 7.5-4-3.5-4-7.5-4zM8.5 5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" stroke="#d3d3d3" strokeWidth="1" fill="none"/>
                        <path d="M2 2l13 13" stroke="#d3d3d3" strokeWidth="1"/>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M8.5 2.5c-4 0-7.5 4-7.5 4s3.5 4 7.5 4 7.5-4 7.5-4-3.5-4-7.5-4zM8.5 5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" stroke="#d3d3d3" strokeWidth="1" fill="none"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="w-full text-center">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* CAPTCHA */}
              <div className="w-full flex justify-center mt-4">
                <Image
                  className="w-[314px] h-[70px]"
                  alt="Captcha verification"
                  src="https://c.animaapp.com/bkGH9LUL/img/image-4040@2x.png"
                  width={314}
                  height={70}
                />
              </div>

              {/* Sign Up Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="all-[unset] box-border w-full h-[50px] cursor-pointer disabled:opacity-50 mt-4"
                type="submit"
              >
                <div className="relative w-full h-[50px] rounded-[12.97px] bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)]">
                  <div className="absolute top-[11px] left-1/2 transform -translate-x-1/2 [font-family:'Poppins',Helvetica] font-semibold text-white text-lg tracking-[0] leading-[normal]">
                    {isLoading ? "Signing Up..." : "Sign up"}
                  </div>
                </div>
              </button>

              {/* Sign In Link */}
              <div className="w-full text-center mt-8">
                <p className="[font-family:'Poppins',Helvetica] font-medium text-sm tracking-[0] leading-[normal]">
                  <span className="text-white">Already have an account? </span>
                  <button
                    onClick={handleSignInClick}
                    className="text-[#9098f2] cursor-pointer bg-transparent border-none outline-none [font-family:'Poppins',Helvetica] font-medium text-sm"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>

            <div className="absolute w-[305px] h-[65px] top-[179px] left-[50px]">
              <p className="absolute top-11 left-0 [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-sm tracking-[0] leading-[normal]">
                Create account to earn &amp; withdraw money
              </p>
              <h1 className="absolute top-0 left-[19px] [font-family:'Poppins',Helvetica] font-semibold text-[#efefef] text-2xl tracking-[0] leading-[normal]">
                Welcome to Jackson!
              </h1>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUp;
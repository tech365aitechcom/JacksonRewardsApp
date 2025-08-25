'use client'
import React, { useState, useRef, useEffect } from 'react'
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import useOnboardingStore from '@/stores/useOnboardingStore';
import { sendOtp, verifyOtp } from '@/lib/api';

const validateName = (name, fieldName = 'Name') => {
  const trimmedName = name.trim();


  if (!trimmedName) {
    return `${fieldName} is required.`;
  }
  if (trimmedName.length < 2) {
    return `${fieldName} must be at least 2 characters.`;
  }
  if (trimmedName.length > 30) {
    return `${fieldName} cannot exceed 50 characters.`;
  }

  const nameRegex = /^[\p{L}'\- ]+$/u;
  if (!nameRegex.test(trimmedName)) {
    return `${fieldName} contains invalid characters.`;
  }

  return "";
};


const SignUp = () => {
  const router = useRouter();
  const { signUpAndSignIn } = useAuth();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    otp: new Array(4).fill(""),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const otpInputs = useRef([]);




  useEffect(() => {
    let timer;
    if (isOtpSent && countdown > 0 && !isMobileVerified) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [isOtpSent, countdown, isMobileVerified]);


  const handleInputChange = (field, value) => {
    // Clear errors when user starts typing
    setError({});
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false; // Only allow numbers
    setError({}); // Clear errors on input

    const newOtp = [...formData.otp];
    newOtp[index] = element.value;
    setFormData({ ...formData, otp: newOtp });

    // Auto-focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Handle backspace to move to previous field
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      const newOtp = [...formData.otp];
      newOtp[index - 1] = '';
      setFormData({ ...formData, otp: newOtp });
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    setError({});
    if (!formData.mobile.trim() || (countryCode === "+91" && !/^[6-9]\d{9}$/.test(formData.mobile))) {
      setError({ mobile: "Please enter a valid 10-digit Indian mobile number." });
      return;
    }
    setIsLoading(true);
    try {
      await sendOtp(`${countryCode}${formData.mobile}`);
      setIsOtpSent(true);
      setCountdown(60); // Reset timer
      setTimeout(() => otpInputs.current[0]?.focus(), 100); // Focus the first OTP box
    } catch (err) {
      setError({ mobile: err.message || "Failed to send OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      await sendOtp(`${countryCode}${formData.mobile}`);
      setFormData(prev => ({ ...prev, otp: new Array(4).fill("") })); // Clear old OTP
      setCountdown(60);
      setError({});
      otpInputs.current[0]?.focus();
    } catch (err) {
      setError({ otp: err.message || "Failed to resend OTP." });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = formData.otp.join('');
    if (otpCode.length < 4) {
      setError({ otp: "Please enter the full 4-digit code." });
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(`${countryCode}${formData.mobile}`, otpCode);
      setIsMobileVerified(true);
      setError({});
    } catch (err) {
      setError({ otp: err.message || "An unknown verification error occurred." });
    } finally {
      setIsLoading(false);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    if (!isMobileVerified) {
      setError({ form: "Please verify your mobile number before signing up." });
      return;
    }

    const clientErrors = {};
    const firstNameError = validateName(formData.firstname, "First name");
    if (firstNameError) clientErrors.firstname = firstNameError;

    const lastNameError = validateName(formData.lastname, "Last name");
    if (lastNameError) clientErrors.lastname = lastNameError;
    if (!formData.email.trim()) {
      clientErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      clientErrors.email = "Please enter a valid email address.";
    }
    if (!formData.mobile.trim()) {
      clientErrors.mobile = "Mobile number is required.";
    } else if (countryCode === "+91" && !/^[6-9]\d{9}$/.test(formData.mobile)) {
      clientErrors.mobile = "Please enter a valid 10-digit Indian mobile number.";
    }
    if (!formData.password) {
      clientErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      clientErrors.password = "Password must be at least 8 characters long.";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
      clientErrors.password = "Password must include uppercase, lowercase, and a number.";
    }
    if (!formData.confirmPassword) {
      clientErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      clientErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(clientErrors).length > 0) {
      setError(clientErrors);
      return;
    }

    setIsLoading(true);
    const fullMobile = `${countryCode}${formData.mobile}`;

    try {
      const onboardingData = useOnboardingStore.getState();
      const fullSignupData = {
        firstName: formData.firstname.trim(),
        lastName: formData.lastname.trim() || '-',
        email: formData.email,
        mobile: fullMobile,
        password: formData.password,
        gender: onboardingData.gender,
        ageRange: onboardingData.ageRange,
        gamePreferences: onboardingData.gamePreferences,
        gameStyle: onboardingData.gameStyle,
        improvementArea: onboardingData.improvementArea,
        dailyEarningGoal: onboardingData.dailyEarningGoal,
      };

      const result = await signUpAndSignIn(fullSignupData);

      // CHANGE: The AuthProvider now handles the redirect.
      // We only need to handle the error case here.
      if (!result.ok) {
        const backendError = result?.error;
        if (backendError && backendError.errors) {
          const newErrors = {};
          backendError.errors.forEach(err => {
            if (err.param) newErrors[err.param] = err.msg;
          });
          setError(newErrors);
        } else {
          const errorMessage = backendError?.error || backendError?.message || "An unknown error occurred. Please try again.";
          setError({ form: errorMessage });
        }
      }
    }
    catch (err) {
      setError({ form: err.message || "An error occurred. Please check your details and try again." });
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
        <div className="relative w-[375px] min-h-screen bg-[#272052] overflow-y-auto"
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
              className="w-[314px] absolute top-[274px] left-[50px] flex flex-col items-start gap-5 pb-20"
            >
              <div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative w-[314px] h-[55px] rounded-[12px] border border-gray-600 bg-black/2 backdrop-blur-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
                  <Image
                    className="absolute w-[17px] h-[17px] top-5 left-5"
                    alt="User icon"
                    src="https://c.animaapp.com/bkGH9LUL/img/vector-2.svg"
                    width={17}
                    height={17}
                  />
                  <input
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => handleInputChange("firstname", e.target.value)}
                    className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[240px]"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>
              {error.firstname && <p className="text-red-400 text-xs -mt-3">{error.firstname}</p>}
              <div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative w-[314px] h-[55px] rounded-[12px] border border-gray-600 bg-black/2 backdrop-blur-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
                  <Image
                    className="absolute w-[17px] h-[17px] top-5 left-5"
                    alt="User icon"
                    src="https://c.animaapp.com/bkGH9LUL/img/vector-2.svg"
                    width={17}
                    height={17}
                  />
                  <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => handleInputChange("lastname", e.target.value)}
                    className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[240px]"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
              {error.lastname && <p className="text-red-400 text-xs -mt-3">{error.lastname}</p>}
              <div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative w-[314px] h-[55px] rounded-[12px] border border-gray-600 bg-black/2 backdrop-blur-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
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
              {error.email && <p className="text-red-400 text-xs -mt-3">{error.email}</p>}


              <div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative w-[314px] h-[55px] rounded-[12px] border border-gray-600 bg-black/2 backdrop-blur-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
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
                    className="absolute top-[17px] left-[50px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] bg-transparent border-none outline-none w-[50px] disabled:opacity-50"
                    disabled={isOtpSent || isMobileVerified}
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
                    className="absolute top-[17px] left-[105px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[190px] disabled:opacity-50"
                    // placeholder="Enter mobile number"
                    required
                    disabled={isOtpSent || isMobileVerified}
                  />
                  {!isOtpSent && !isMobileVerified && formData.mobile.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="absolute right-4 top-[10px] h-[35px] px-4 rounded-lg bg-gradient-to-r from-[#a18aff] to-[#6d4aff] text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all"
                    >
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                  )}
                  {isMobileVerified && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 text-sm font-semibold flex items-center">✓ Verified</div>
                  )}
                </div>
                {error.mobile && <p className="text-red-400 text-xs -mt-3">{error.mobile}</p>}
              </div>


              {isOtpSent && !isMobileVerified && (
                <div className="w-full flex flex-col items-center gap-6 mt-8 mb-4">
                  <p className="text-white text-xl font-semibold text-center mb-2">
                    We have sent verification code to your phone number
                  </p>
                  <p className="text-[#bdb7e3] text-base font-medium text-center mb-4">
                    Verify it's you
                  </p>
                  <div className="flex justify-center gap-4 mb-6">
                    {formData.otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={e => handleOtpChange(e.target, index)}
                        onKeyDown={e => handleOtpKeyDown(e, index)}
                        onFocus={e => e.target.select()}
                        ref={el => otpInputs.current[index] = el}
                        disabled={isMobileVerified}
                        className={`w-16 h-16 text-center text-3xl font-bold text-white bg-gradient-to-b from-[#a18aff] to-[#6d4aff] rounded-xl border-2 ${error.otp ? 'border-red-500' : 'border-transparent'} focus:border-[#9098f2] focus:outline-none transition-all disabled:opacity-50`}
                      />
                    ))}
                  </div>
                  {error.otp && <p className="text-red-400 text-xs mb-2">{error.otp}</p>}
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isLoading || formData.otp.join('').length < 4}
                    className="w-full h-12 rounded-lg bg-gradient-to-b from-[#a18aff] to-[#6d4aff] text-white text-lg font-semibold shadow-md disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isResending}
                    className="mt-2 text-[#9098f2] text-sm font-semibold disabled:text-gray-500"
                  >
                    {isResending ? 'Sending...' : (countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code')}
                  </button>
                </div>
              )}

              <div className="flex flex-col items-start gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative w-[314px] h-[55px] rounded-[12px] border border-gray-600 bg-black/2 backdrop-blur-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
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
                      <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className="w-full h-full">
                        <path d="M10 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" stroke="#d3d3d3" strokeWidth="1.2" fill="none" />
                        <path d="M10 4C5.5 4 1.73 7.11 1 10c.73 2.89 4.5 6 9 6s8.27-3.11 9-6c-.73-2.89-4.5-6-9-6z" stroke="#d3d3d3" strokeWidth="1.2" fill="none" />
                        <line x1="3" y1="3" x2="17" y2="17" stroke="#d3d3d3" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className="w-full h-full">
                        <path d="M10 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" stroke="#d3d3d3" strokeWidth="1.2" fill="none" />
                        <path d="M10 4C5.5 4 1.73 7.11 1 10c.73 2.89 4.5 6 9 6s8.27-3.11 9-6c-.73-2.89-4.5-6-9-6z" stroke="#d3d3d3" strokeWidth="1.2" fill="none" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {error.password && <p className="text-red-400 text-xs">{error.password}</p>}


              <div className="flex flex-col items-start gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
                <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative w-[314px] h-[55px] rounded-[12px] border border-gray-600 bg-black/2 backdrop-blur-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
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
                      <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className="w-full h-full">
                        <path d="M10 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" stroke="#d3d3d3" strokeWidth="1.2" fill="none" />
                        <path d="M10 4C5.5 4 1.73 7.11 1 10c.73 2.89 4.5 6 9 6s8.27-3.11 9-6c-.73-2.89-4.5-6-9-6z" stroke="#d3d3d3" strokeWidth="1.2" fill="none" />
                        <line x1="3" y1="3" x2="17" y2="17" stroke="#d3d3d3" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className="w-full h-full">
                        <path d="M10 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" stroke="#d3d3d3" strokeWidth="1.2" fill="none" />
                        <path d="M10 4C5.5 4 1.73 7.11 1 10c.73 2.89 4.5 6 9 6s8.27-3.11 9-6c-.73-2.89-4.5-6-9-6z" stroke="#d3d3d3" strokeWidth="1.2" fill="none" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {error.confirmPassword && <p className="text-red-400 text-xs">{error.confirmPassword}</p>}

              {/* Error Message Display */}
              {error.form && (
                <div className="w-full text-center">
                  <p className="text-red-400 text-sm">{error.form}</p>
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
                onClick={handleSubmit} disabled={isLoading || !isMobileVerified}

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
"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/lib/api'; // <-- IMPORT THE API FUNCTION

const ResetPasswordComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage('Invalid or missing reset token. Please request a new link.');
      setIsError(true);
    }
  }, [searchParams]);

  // Enhanced validation function
  const validatePasswords = () => {
    if (!newPassword || !confirmPassword) {
      return 'Both password fields are required.';
    }
    if (newPassword !== confirmPassword) {
      return 'Passwords do not match.';
    }
    if (newPassword.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(newPassword)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(newPassword)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(newPassword)) {
      return 'Password must contain at least one number.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return 'Password must contain at least one special character.';
    }
    return ''; // All good
  };

  const isFormValid = newPassword && confirmPassword && validatePasswords() === '' && token;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const validationError = validatePasswords();
    if (validationError) {
      setMessage(validationError);
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      // Use the centralized API function
      const data = await resetPassword(token, newPassword);

      setMessage(data.message || 'Password reset successful! Redirecting to login...');
      setIsError(false);
      setTimeout(() => {
        router.push('/homepage');
      }, 1000); // Increased timeout to let user read the message
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage(error.message || 'Failed to reset password. The link may be invalid or expired.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="bg-[#272052] flex h-screen flex-row justify-center w-full relative overflow-hidden">
      <div className="bg-[#272052] overflow-hidden w-full max-w-[375px] relative">
        {/* Background effects */}
        <div className="absolute w-[358px] h-[358px] top-0 left-[9px] bg-[#af7de6] rounded-[179px] blur-[250px]" />
        <div className="absolute inset-0 bg-[#20202033] backdrop-blur-[5px]" />

        {/* Main content card */}
        <div className="absolute w-[280px] h-auto min-h-[520px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[15px] overflow-hidden [background:radial-gradient(50%_50%_at_50%_50%,rgba(134,47,148,1)_0%,rgba(6,9,78,1)_100%)] z-10 p-4">
          <div className="relative w-full h-[81px] mt-2 flex justify-center items-center">
            <div className="text-white text-[64px]" role="img" aria-label="Key icon">🔑</div>
          </div>
          <h1 className="text-center mt-4 [font-family:'Poppins',Helvetica] font-extrabold text-[#efefef] text-2xl">
            Reset Password
          </h1>

          <form onSubmit={handleResetPassword} className="mt-4 px-2">
            <p className="[font-family:'Poppins',Helvetica] font-medium text-white text-[13px] text-center mb-4">
              Enter your new password below to complete the reset process.
            </p>

            {/* New Password Field */}
            <div className="mb-4">
              <label className="block [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] mb-2">
                New Password
              </label>
              <div className="relative w-full h-[45px] bg-[rgba(255,255,255,0.1)] rounded-lg border border-[rgba(255,255,255,0.2)] backdrop-blur-sm">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-full px-4 bg-transparent border-none outline-none text-white [font-family:'Poppins',Helvetica] font-medium text-[14.3px] placeholder:text-[#d3d3d3]"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="block [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] mb-2">
                Confirm Password
              </label>
              <div className="relative w-full h-[45px] bg-[rgba(255,255,255,0.1)] rounded-lg border border-[rgba(255,255,255,0.2)] backdrop-blur-sm">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-full px-4 bg-transparent border-none outline-none text-white [font-family:'Poppins',Helvetica] font-medium text-[14.3px] placeholder:text-[#d3d3d3]"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            {/* Error/Success Message */}
            {message && (
              <div className={`w-full mt-2 text-xs [font-family:'Poppins',Helvetica] font-medium text-center ${isError ? 'text-red-400' : 'text-green-400'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full h-[39px] mt-6 rounded-lg transition-all duration-200 ${isFormValid && !isLoading ? 'bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)] hover:opacity-90' : 'bg-gray-500 cursor-not-allowed opacity-50'}`}
            >
              <div className="[font-family:'Poppins',Helvetica] font-semibold text-white text-sm">
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </div>
            </button>
          </form>

          <button
            onClick={handleBackToLogin}
            className="w-full mt-4 text-center"
            type="button"
          >
            <div className="[font-family:'Poppins',Helvetica] font-normal text-neutral-400 text-sm cursor-pointer">
              Back to Login
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};


// Wrap with Suspense for useSearchParams
const ResetPassword = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordComponent />
  </Suspense>
);


export default ResetPassword;
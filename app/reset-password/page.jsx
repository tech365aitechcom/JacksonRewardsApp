"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPassword = () => {
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
      setMessage('Invalid reset link. Please request a new password reset.');
      setIsError(true);
    }
  }, [searchParams]);

  const validatePasswords = () => {
    if (newPassword !== confirmPassword) {
      return 'Passwords do not match.';
    }
    if (newPassword.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    return '';
  };

  const isFormValid = newPassword && confirmPassword && validatePasswords() === '' && token;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setMessage('Invalid reset token.');
      setIsError(true);
      return;
    }

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
      // Replace this URL with your actual backend URL
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setIsError(false);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to reset password. Please try again.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage('Network error. Please try again.');
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
        {/* Background blur effects */}
        <div className="absolute w-[358px] h-[358px] top-0 left-[9px] bg-[#af7de6] rounded-[179px] blur-[250px]" />

        {/* Background overlay */}
        <div className="absolute inset-0 bg-[#20202033] backdrop-blur-[5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5px)_brightness(100%)]" />

        {/* Main content card */}
        <div className="absolute w-[280px] h-[520px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[15px] overflow-hidden [background:radial-gradient(50%_50%_at_50%_50%,rgba(134,47,148,1)_0%,rgba(6,9,78,1)_100%)] z-10">
          <div className="absolute w-[168px] h-[81px] top-[25px] left-[51px]">
            <div
              className="absolute w-28 top-px left-[33px] [font-family:'Poppins',Helvetica] font-medium text-white text-[64px] text-center tracking-[0] leading-[normal]"
              role="img"
              aria-label="Key icon"
            >
              🔑
            </div>
          </div>

          <h1 className="absolute top-[117px] left-[31px] [font-family:'Poppins',Helvetica] font-extrabold text-[#efefef] text-2xl tracking-[0] leading-[normal]">
            Reset Password
          </h1>

          <div className="absolute w-[240px] h-[220px] top-[164px] left-4">
            <p className="absolute w-[220px] top-0 left-[10px] [font-family:'Poppins',Helvetica] font-medium text-white text-[13px] text-center tracking-[0] leading-[normal]">
              Enter your new password below to complete the password reset process.
            </p>

            {/* New Password Field */}
            <label className="absolute w-[134px] top-[50px] left-[10px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
              New Password
            </label>

            <div className="absolute w-[220px] h-[45px] top-[70px] left-[10px]">
              <div className="relative w-full h-full bg-[rgba(255,255,255,0.1)] rounded-lg border border-[rgba(255,255,255,0.2)] backdrop-blur-sm">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-full px-4 bg-transparent border-none outline-none text-white [font-family:'Poppins',Helvetica] font-medium text-[14.3px] tracking-[0] leading-[normal] placeholder:text-[#d3d3d3]"
                  placeholder="Enter new password"
                  aria-label="New password"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <label className="absolute w-[134px] top-[125px] left-[10px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
              Confirm Password
            </label>

            <div className="absolute w-[220px] h-[45px] top-[145px] left-[10px]">
              <div className="relative w-full h-full bg-[rgba(255,255,255,0.1)] rounded-lg border border-[rgba(255,255,255,0.2)] backdrop-blur-sm">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-full px-4 bg-transparent border-none outline-none text-white [font-family:'Poppins',Helvetica] font-medium text-[14.3px] tracking-[0] leading-[normal] placeholder:text-[#d3d3d3]"
                  placeholder="Confirm new password"
                  aria-label="Confirm password"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {/* Error/Success Message */}
            {message && (
              <div className={`absolute w-[220px] top-[200px] left-[10px] text-xs [font-family:'Poppins',Helvetica] font-medium text-center ${
                isError ? 'text-red-400' : 'text-green-400'
              }`}>
                {message}
              </div>
            )}
          </div>

          <button
            onClick={handleResetPassword}
            disabled={!isFormValid || isLoading}
            className={`absolute w-[210px] h-[39px] top-[400px] left-[30px] rounded-lg overflow-hidden transition-all duration-200 ${
              isFormValid && !isLoading
                ? 'bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)] hover:opacity-90 cursor-pointer' 
                : 'bg-gray-500 cursor-not-allowed opacity-50'
            }`}
            aria-label="Reset password"
            type="button"
          >
            <div className="flex items-center justify-center w-full h-full [font-family:'Poppins',Helvetica] font-semibold text-white text-sm text-center tracking-[0] leading-[normal]">
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </div>
          </button>

          <button
            onClick={handleBackToLogin}
            className="absolute top-[460px] left-[90px] text-center"
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

export default ResetPassword;
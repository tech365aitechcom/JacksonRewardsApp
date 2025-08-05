'use client'
import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { useAuth } from '../../components/providers/SessionProvider'

export default function LoginPage() {
  const [email, setEmail] = useState("jatin@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSignIn = () => {
    // Handle sign in logic
    console.log("Sign in clicked");
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log("Forgot password clicked");
  };

  const handleSocialLogin = async (provider) => {
    try {
      if (provider === 'google') {
        const result = await login();
        if (result.success) {
          router.push('/');
        } else {
          alert('Login failed. Please try again.');
        }
      } else {
        console.log(`${provider} login not implemented yet`);
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <div
      className="bg-[#272052] flex h-screen items-center justify-center w-full"
      data-model-id="363:24235"
    >
      <div className="bg-[#272052] overflow-hidden w-full max-w-md mx-auto px-4">
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center py-8">
          <div className="fixed w-[200px] h-[200px] top-20 left-1/2 transform -translate-x-1/2 bg-[#af7de6] rounded-full blur-[150px] opacity-60" />
          <div className="fixed w-[200px] h-[200px] bottom-40 left-20 rounded-full [background:radial-gradient(50%_50%_at_50%_50%,rgba(196,86,71,1)_0%,rgba(210,90,99,0)_100%)] opacity-[0.58]" />
          <div className="fixed w-[200px] h-[200px] bottom-20 right-20 rounded-full [background:radial-gradient(50%_50%_at_50%_50%,rgba(179,121,223,1)_0%,rgba(54,0,96,0)_100%)] opacity-[0.58]" />
          
          <div className="relative w-full max-w-sm mx-auto rounded-[59px] backdrop-blur-2xl backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(40px)_brightness(100%)] [background:radial-gradient(50%_50%_at_68%_49%,rgba(179,121,223,0.2)_0%,rgba(204,88,84,0.02)_77%,rgba(179,121,223,0.2)_100%)] p-8 z-10">
            
            <div className="flex justify-center items-center mb-6 relative">
              <Image
                className="w-[60px] h-[90px]"
                alt="Front shapes"
                src="https://c.animaapp.com/2Y7fJDnh/img/front-shapes@2x.png"
                width={60}
                height={90}
              />
              <Image
                className="w-[30px] h-[80px] ml-4"
                alt="Front shapes"
                src="https://c.animaapp.com/2Y7fJDnh/img/front-shapes-1@2x.png"
                width={30}
                height={80}
              />
              <Image
                className="w-[14px] h-[160px] ml-2"
                alt="Saly"
                src="https://c.animaapp.com/2Y7fJDnh/img/saly-16@2x.png"
                width={14}
                height={160}
              />
            </div>

            <div className="text-center mb-6">
              <div className="flex justify-center items-center gap-3 mb-2">
                <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#efefef] text-2xl tracking-[0] leading-[normal]">
                  Welcome Back!
                </h1>
                <Image
                  className="w-[42px] h-[35px]"
                  alt="Gem"
                  src="https://c.animaapp.com/2Y7fJDnh/img/gem-1.png"
                  width={42}
                  height={35}
                />
              </div>
              <p className="[font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-sm tracking-[0] leading-[normal]">
                welcome back we missed you
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal] mb-2">
                  Email/ Phone Number
                </label>
                <div className="relative w-full h-[55px] bg-[url(https://c.animaapp.com/2Y7fJDnh/img/card@2x.png)] bg-[100%_100%]">
                  <Image
                    className="absolute w-[17px] h-[17px] top-5 left-5"
                    alt="Email icon"
                    src="https://c.animaapp.com/2Y7fJDnh/img/vector.svg"
                    width={17}
                    height={17}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[calc(100%-70px)]"
                    placeholder="jatin@gmail.com"
                    aria-label="Email or Phone Number"
                  />
                </div>
              </div>

              <div>
                <label className="block [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal] mb-2">
                  Password
                </label>
                <div className="relative w-full h-[55px]">
                  <Image
                    className="absolute w-full h-[55px] top-0 left-0"
                    alt="Password field background"
                    src="https://c.animaapp.com/2Y7fJDnh/img/password@2x.png"
                    width={314}
                    height={55}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[calc(100%-70px)]"
                    placeholder="Enter your password"
                    aria-label="Password"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <button
                className="[font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[11.3px] tracking-[0] leading-[normal] cursor-pointer"
                onClick={handleForgotPassword}
                type="button"
              >
                Forgot Password?
              </button>
            </div>

            <div className="mb-6">
              <Image
                className="w-full h-[70px]"
                alt="CAPTCHA verification"
                src="https://c.animaapp.com/2Y7fJDnh/img/image-4040@2x.png"
                width={312}
                height={70}
              />
            </div>

            <button
              className="w-full h-[50px] cursor-pointer mb-6"
              onClick={handleSignIn}
              type="button"
              aria-label="Sign in"
            >
              <div className="w-full h-[50px] rounded-[12.97px] bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)] flex items-center justify-center">
                <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-lg tracking-[0] leading-[normal]">
                  Sign in
                </span>
              </div>
            </button>

            <div className="absolute top-[-50px] left-[-50px] opacity-50">
              <Image
                className="w-20 h-[90px] object-cover"
                alt="Coins"
                src="https://c.animaapp.com/2Y7fJDnh/img/coins-1.png"
                width={80}
                height={90}
              />
            </div>

            <div className="absolute top-[-40px] right-[-40px] opacity-60">
              <Image
                className="w-[100px] h-16 object-cover"
                alt="Element"
                src="https://c.animaapp.com/2Y7fJDnh/img/2211-w030-n003-510b-p1-510--converted--02-2.png"
                width={100}
                height={64}
              />
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center w-full">
                  <div className="flex-1 h-px bg-[#b5b5b5] opacity-30"></div>
                  <span className="px-4 [font-family:'Poppins',Helvetica] font-medium text-[#b5b5b5] text-[11.2px] tracking-[0] leading-[normal]">
                    Or login with
                  </span>
                  <div className="flex-1 h-px bg-[#b5b5b5] opacity-30"></div>
                </div>

                <div className="flex items-center gap-5 justify-center">
                  <button
                    className="w-[58.1px] h-11 bg-[url(https://c.animaapp.com/2Y7fJDnh/img/card-1@2x.png)] bg-[100%_100%] cursor-pointer"
                    onClick={() => handleSocialLogin("google")}
                    type="button"
                    aria-label="Sign in with Google"
                  >
                    <div className="relative w-[19px] h-[19px] mx-auto mt-3 bg-[url(https://c.animaapp.com/2Y7fJDnh/img/vector-1.svg)] bg-[100%_100%]">
                      <div className="absolute w-[18px] h-3 top-2 left-px">
                        <Image
                          className="absolute w-[15px] h-2 top-1 left-0"
                          alt="Google logo part"
                          src="https://c.animaapp.com/2Y7fJDnh/img/vector-2.svg"
                          width={15}
                          height={2}
                        />
                        <Image
                          className="absolute w-2.5 h-[9px] top-0 left-[9px]"
                          alt="Google logo part"
                          src="https://c.animaapp.com/2Y7fJDnh/img/vector-3.svg"
                          width={10}
                          height={9}
                        />
                      </div>
                      <Image
                        className="absolute w-[15px] h-2 top-0 left-px"
                        alt="Google logo part"
                        src="https://c.animaapp.com/2Y7fJDnh/img/vector-4.svg"
                        width={15}
                        height={2}
                      />
                    </div>
                  </button>

                  <button
                    className="bg-[url(https://c.animaapp.com/2Y7fJDnh/img/card-2@2x.png)] bg-[100%_100%] w-[58.1px] h-11 cursor-pointer"
                    onClick={() => handleSocialLogin("apple")}
                    type="button"
                    aria-label="Sign in with Apple"
                  >
                    <Image
                      className="w-7 h-[30px] mx-auto mt-[7px] object-cover"
                      alt="Apple logo"
                      src="https://c.animaapp.com/2Y7fJDnh/img/image-3961@2x.png"
                      width={28}
                      height={30}
                    />
                  </button>

                  <button
                    className="w-[58.1px] h-11 cursor-pointer"
                    onClick={() => handleSocialLogin("facebook")}
                    type="button"
                    aria-label="Sign in with Facebook"
                  >
                    <Image
                      className="w-full h-full"
                      alt="Facebook login button"
                      src="https://c.animaapp.com/2Y7fJDnh/img/buttons@2x.png"
                      width={58.1}
                      height={44}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center w-full">
                  <div className="flex-1 h-px bg-[#b5b5b5] opacity-30"></div>
                  <span className="px-4 [font-family:'Poppins',Helvetica] font-medium text-[#b5b5b5] text-[11.2px] tracking-[0] leading-[normal]">
                    Or
                  </span>
                  <div className="flex-1 h-px bg-[#b5b5b5] opacity-30"></div>
                </div>

                <p className="[font-family:'Poppins',Helvetica] font-medium text-sm text-center tracking-[0] leading-[normal]">
                  <span className="text-white">Want to create an account? </span>
                  <button
                    className="text-[#9098f2] cursor-pointer bg-transparent border-none underline"
                    onClick={handleSignUp}
                    type="button"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
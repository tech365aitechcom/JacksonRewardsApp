'use client'
import React, { useState } from 'react'
import Image from "next/image"
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState("jatin@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithProvider, isLoading } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) return;
    
    try {
      const result = await signIn(email, password);
      if (result?.ok) {
        window.location.href = '/homepage';
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log("Forgot password clicked");
  };

  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithProvider(provider);
      
      if (result?.ok) {
        window.location.href = '/homepage';
      } else {
        console.error('Login failed:', result?.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignUp = () => {
    window.location.href = '/signup';
  };

  return (
    <div
      className="bg-[#272052] flex h-screen flex-row justify-center w-full "
      data-model-id="363:24235"
    >
      <div className="bg-[#272052]  overflow-hidden w-full pl-2 ">
        <div className="relative w-[904px] h-[1221px] -top-32 left-[-215px] ">
          <div className="absolute w-[358px] h-[358px] top-0 left-[229px] bg-[#af7de6] rounded-[179px] blur-[250px]" />

          <div className="absolute w-[904px] h-[1037px] top-[184px] left-0">
            <div className="relative h-[1037px]">
              <div className="absolute w-[397px] h-[397px] top-[640px] left-[430px] rounded-[198.5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(179,121,223,1)_0%,rgba(54,0,96,0)_100%)] opacity-[0.58]" />

              <div className="absolute w-[397px] h-[397px] top-[619px] left-0 rounded-[198.5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(196,86,71,1)_0%,rgba(210,90,99,0)_100%)] opacity-[0.58]" />

              <div className="absolute w-[377px] h-[803px] top-[68px] left-[213px] rounded-[59px] backdrop-blur-2xl backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(40px)_brightness(100%)] [background:radial-gradient(50%_50%_at_68%_49%,rgba(179,121,223,0.2)_0%,rgba(204,88,84,0.02)_77%,rgba(179,121,223,0.2)_100%)]" />

              <div className="absolute w-[397px] h-[397px] top-0 left-[507px] rounded-[198.5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(179,121,223,1)_0%,rgba(54,0,96,0)_100%)] opacity-[0.58]" />
            </div>
          </div>

          <div className="absolute w-[470px] h-[197px] top-[358px] left-[201px]">
            <Image
              className="absolute w-[83px] h-[125px] -top-1.5 left-3.5"
              alt="Front shapes"
              src="https://c.animaapp.com/2Y7fJDnh/img/front-shapes@2x.png"
              width={83}
              height={125}
            />

            <div className="absolute w-[41px] h-[215px] top-[-9px] left-[348px]">
              <Image
                className="absolute w-[41px] h-[106px] top-[58px] left-0"
                alt="Front shapes"
                src="https://c.animaapp.com/2Y7fJDnh/img/front-shapes-1@2x.png"
                width={41}
                height={106}
              />

              <Image
                className="absolute w-[18px] h-[215px] top-0 left-[23px]"
                alt="Saly"
                src="https://c.animaapp.com/2Y7fJDnh/img/saly-16@2x.png"
                width={18}
                height={215}
              />
            </div>
          </div>

          <button
            className="absolute w-[316px] h-[50px] top-[685px] left-[246px] cursor-pointer"
            onClick={handleSignIn}
            type="button"
            aria-label="Sign in"
          >
            <div className="relative w-[314px] h-[50px] rounded-[12.97px] bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)]">
              <div className="absolute top-[11px] left-[126px] [font-family:'Poppins',Helvetica] font-semibold text-white text-lg tracking-[0] leading-[normal]">
                Sign in
              </div>
            </div>
          </button>

          <div className="absolute w-[316px] h-[55px] top-[403px] left-[246px]">
            <div className="relative w-[314px] h-[55px] bg-[url(https://c.animaapp.com/2Y7fJDnh/img/card@2x.png)] bg-[100%_100%]">
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
                className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[240px]"
                placeholder="jatin@gmail.com"
                aria-label="Email or Phone Number"
              />
            </div>
          </div>

          <label className="absolute top-[369px] left-[246px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
            Email/ Phone Number
          </label>

          <label className="absolute top-[489px] left-[246px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
            Password
          </label>

          <button
            className="absolute top-[581px] left-[457px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[11.3px] tracking-[0] leading-[normal] cursor-pointer"
            onClick={handleForgotPassword}
            type="button"
          >
            Forgot Password?
          </button>

          <div className="absolute w-[314px] h-[55px] top-[497px] left-[247px] ">
            <Image
              className="absolute w-[314px] h-[55px] top-0 left-0"
              alt="Password field background"
              src="https://c.animaapp.com/2Y7fJDnh/img/password@2x.png"
              width={314}
              height={55}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[200px]"
              placeholder="Enter your password"
              aria-label="Password"
            />
            {/* <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[17px] right-[20px] text-neutral-400 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁" : "👁"}
            </button> */}
          </div>

          <div className="absolute w-[216px] h-[65px] top-[289px] left-[302px]">
            <p className="absolute top-11 left-0 [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-sm tracking-[0] leading-[normal]">
              welcome back we missed you
            </p>

            <h1 className="absolute top-0 left-[11px] [font-family:'Poppins',Helvetica] font-semibold text-[#efefef] text-2xl tracking-[0] leading-[normal]">
              Welcome Back!
            </h1>
          </div>

          <Image
            className="absolute w-[52px] h-[43px] top-[315px] left-[519px]"
            alt="Gem"
            src="https://c.animaapp.com/2Y7fJDnh/img/gem-1.png"
            width={52}
            height={43}
          />

          <Image
            className="absolute w-28 h-[123px] top-[131px] left-[215px] object-cover"
            alt="Coins"
            src="https://c.animaapp.com/2Y7fJDnh/img/coins-1.png"
            width={112}
            height={123}
          />

          <Image
            className="absolute w-[138px] h-24 top-36 left-[328px] object-cover"
            alt="Element"
            src="https://c.animaapp.com/2Y7fJDnh/img/2211-w030-n003-510b-p1-510--converted--02-2.png"
            width={138}
            height={96}
          />

          <div className="flex flex-col w-[303px] items-start gap-[30px] absolute top-[755px] left-[252px]">
            <div className="flex flex-col items-center gap-[18px] relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative w-[305px] h-[17px] mr-[-2.00px]">
                <div className="absolute top-0 left-[116px] [font-family:'Poppins',Helvetica] font-medium text-[#b5b5b5] text-[11.2px] tracking-[0] leading-[normal]">
                  Or login with
                </div>

                <Image
                  className="absolute w-[98px] h-px top-2 left-0"
                  alt="Divider line"
                  src="https://c.animaapp.com/2Y7fJDnh/img/rectangle-3.svg"
                  width={98}
                  height={1}
                />

                <Image
                  className="absolute w-[98px] h-px top-2 left-[205px]"
                  alt="Divider line"
                  src="https://c.animaapp.com/2Y7fJDnh/img/rectangle-4.svg"
                  width={98}
                  height={1}
                />
              </div>

              <div className="inline-flex items-center gap-5 relative flex-[0_0_auto]">
                <button
                  className="relative w-[58.1px] h-11 bg-[url(https://c.animaapp.com/2Y7fJDnh/img/card-1@2x.png)] bg-[100%_100%] cursor-pointer"
                  onClick={() => handleSocialLogin("google")}
                  type="button"
                  aria-label="Sign in with Google"
                >
                  <div className="relative w-[19px] h-[19px] top-[13px] left-[17px] bg-[url(https://c.animaapp.com/2Y7fJDnh/img/vector-1.svg)] bg-[100%_100%]">
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
                      className="absolute w-[15px] h-2 top-0  left-px"
                      alt="Google logo part"
                      src="https://c.animaapp.com/2Y7fJDnh/img/vector-4.svg"
                      width={15}
                      height={2}
                    />
                  </div>
                </button>

                <button
                  className="bg-[url(https://c.animaapp.com/2Y7fJDnh/img/card-2@2x.png)] bg-[100%_100%] relative w-[58.1px] h-11 cursor-pointer"
                  onClick={() => handleSocialLogin("apple")}
                  type="button"
                  aria-label="Sign in with Apple"
                >
                  <Image
                    className="absolute w-7 h-[30px] top-[7px] left-4 object-cover"
                    alt="Apple logo"
                    src="https://c.animaapp.com/2Y7fJDnh/img/image-3961@2x.png"
                    width={28}
                    height={30}
                  />
                </button>

                <button
                  className="relative w-[58.1px] h-11 cursor-pointer"
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

            <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative w-[305px] h-[17px] mr-[-2.00px]">
                <div className="absolute top-0 left-[145px] [font-family:'Poppins',Helvetica] font-medium text-[#b5b5b5] text-[11.2px] tracking-[0] leading-[normal]">
                  Or
                </div>

                <Image
                  className="absolute w-[137px] h-px top-2 left-0"
                  alt="Divider line"
                  src="https://c.animaapp.com/2Y7fJDnh/img/rectangle-3-1.svg"
                  width={137}
                  height={1}
                />

                <Image
                  className="absolute w-[139px] h-px top-2 left-[164px]"
                  alt="Divider line"
                  src="https://c.animaapp.com/2Y7fJDnh/img/rectangle-4-1.svg"
                  width={139}
                  height={1}
                />
              </div>

              <p className="relative self-stretch [font-family:'Poppins',Helvetica] font-medium text-transparent text-sm text-center tracking-[0] leading-[normal]">
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


          <Image
            className="absolute w-[312px] h-[70px] top-[589px] left-[247px]"
            alt="CAPTCHA verification"
            src="https://c.animaapp.com/2Y7fJDnh/img/image-4040@2x.png"
            width={312}
            height={70}
          />
        </div>
      </div>
    </div>
  );
}
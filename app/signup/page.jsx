'use client'
import React, { useState } from 'react'
import Image from "next/image";

 const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "Jatin",
    email: "jatin@gmail.com",
    mobile: "+33  |  9876579976",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [otpTimer, setOtpTimer] = useState(50);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleSignInClick = () => {
    // Handle sign in navigation
    console.log("Navigate to sign in");
  };

  return (
    <div
      className="relative w-full h-[1061px] bg-[#272052] overflow-hidden"
      data-model-id="1322:2980"
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
          className="w-[314px] absolute top-[274px] left-[50px] flex flex-col items-start gap-3"
        >
          <div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
            <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
              Name
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
                  placeholder="Jatin"
                />
              </div>
            </div>
          </div>

          <div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
            <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
              Email
            </label>

            <div className="relative w-[314px] h-[55px]">
              <div className="relative bg-[url(https://c.animaapp.com/bkGH9LUL/img/card-1@2x.png)] w-[314px] h-[55px] bg-[100%_100%]">
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
                  placeholder="jatin@gmail.com"
                />
              </div>
            </div>
          </div>

          <div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
            <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
              Mobile Number
            </label>

            <div className="relative w-[314px] h-[55px]">
              <div className="relative w-[314px] h-[55px]">
                <div className="absolute w-[314px] h-[55px] top-0 left-0">
                  <Image
                    className="absolute w-[314px] h-[55px] top-[5459px] left-[1637px]"
                    alt="Rectangle"
                    src="/img/rectangle-3.svg"
                    width={314}
                    height={55}
                  />

                  <div className="absolute top-0 left-0 bg-[url(https://c.animaapp.com/bkGH9LUL/img/rectangle-1.svg)] w-[314px] h-[55px] bg-[100%_100%]">
                    <Image
                      className="absolute w-2 h-2 top-6 left-[86px]"
                      alt="Arrow back ios new"
                      src="https://c.animaapp.com/bkGH9LUL/img/arrow-back-ios-new@2x.png"
                      width={8}
                      height={8}
                    />
                  </div>
                </div>

                <Image
                  className="absolute w-[17px] h-[17px] top-5 left-5"
                  alt="Phone icon"
                  src="https://c.animaapp.com/bkGH9LUL/img/vector-2.svg"
                  width={17}
                  height={17}
                />

                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[240px]"
                  placeholder="+33  |  9876579976"
                />
              </div>
            </div>
          </div>

          <div className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-3">
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
                value={formData.otp}
                onChange={(e) => handleInputChange("otp", e.target.value)}
                maxLength="6"
                className="absolute top-[17px] left-[20px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[274px]"
               
              />
            </div>

            <div className="relative w-[149px] [font-family:'Poppins',Helvetica] font-medium text-white text-[14.3px] tracking-[0] leading-[normal]">
              00:{otpTimer.toString().padStart(2, "0")} sec remaining
            </div>
          </div>

          <div className="flex flex-col items-start gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
            <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
              Password
            </label>

            <div className="relative w-[314px] h-[55px]">
              <Image
                className="absolute w-[314px] h-[55px] top-0 left-0"
                alt="Password input background"
                src="https://c.animaapp.com/bkGH9LUL/img/password@2x.png"
                width={314}
                height={55}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[200px]"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[17px] right-[20px] text-[#d3d3d3] text-[14.3px]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {/* {showPassword ? "👁" : "👁"} */}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
            <label className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]">
              Confirm Password
            </label>

            <div className="relative w-[314px] h-[55px]">
              <Image
                className="absolute w-[314px] h-[55px] top-0 left-0"
                alt="Confirm password input background"
                src="https://c.animaapp.com/bkGH9LUL/img/password-1@2x.png"
                width={314}
                height={55}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-[200px]"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-[17px] right-[20px] text-[#d3d3d3] text-[14.3px]"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {/* {showConfirmPassword ? "👁" : "👁"} */}
              </button>
            </div>
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

      <button
        onClick={handleSubmit}
        className="all-[unset] box-border absolute w-[314px] h-[50px] top-[881px] left-[50px] cursor-pointer"
        type="submit"
      >
        <div className="relative w-[314px] h-[50px] rounded-[12.97px] bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)]">
          <div className="absolute top-[11px] left-[122px] [font-family:'Poppins',Helvetica] font-semibold text-white text-lg tracking-[0] leading-[normal]">
            Sign up
          </div>
        </div>
      </button>

      <p className="absolute top-[960px] left-[70px] [font-family:'Poppins',Helvetica] font-medium text-transparent text-sm tracking-[0] leading-[normal]">
        <span className="text-white">Already have an account? </span>

        <button
          onClick={handleSignInClick}
          className="text-[#9098f2] cursor-pointer bg-transparent border-none outline-none [font-family:'Poppins',Helvetica] font-medium text-sm"
        >
          Sign In
        </button>
      </p>


      <Image
        className="absolute w-[314px] h-[70px] top-[787px] left-[50px]"
        alt="Captcha verification"
        src="https://c.animaapp.com/bkGH9LUL/img/image-4040@2x.png"
        width={314}
        height={70}
      />
    </div>
  );
};


export default SignUp;
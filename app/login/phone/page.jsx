"use client";
import React, { useState } from "react";

export default function PhoneLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("9876579976");
  const [countryCode, setCountryCode] = useState("+33");

  const handleProceed = () => {
    // Handle form submission logic here
    console.log("Proceeding with phone number:", countryCode + phoneNumber);
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  return (
    <div
      className="bg-[#272052] grid justify-items-center [align-items:start] w-screen min-h-screen"
      data-model-id="775:49986"
    >
      <div className="bg-[#272052] overflow-hidden w-[375px] h-[812px]">
        <div className="relative w-[904px] h-[1291px] -top-32 left-[-215px]">
          <div className="absolute w-[358px] h-[358px] top-0 left-[229px] bg-[#af7de6] rounded-[179px] blur-[250px]" />

          <div className="absolute w-[904px] h-[1037px] top-[254px] left-0">
            <div className="relative h-[1037px]">
              <div className="absolute w-[397px] h-[397px] top-[640px] left-[430px] rounded-[198.5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(179,121,223,1)_0%,rgba(54,0,96,0)_100%)] opacity-[0.58]" />

              <div className="absolute w-[397px] h-[397px] top-[619px] left-0 rounded-[198.5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(196,86,71,1)_0%,rgba(210,90,99,0)_100%)] opacity-[0.58]" />

              <div className="absolute w-[377px] h-[803px] top-[68px] left-[213px] rounded-[59px] backdrop-blur-2xl backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(40px)_brightness(100%)] [background:radial-gradient(50%_50%_at_68%_49%,rgba(179,121,223,0.2)_0%,rgba(204,88,84,0.02)_77%,rgba(179,121,223,0.2)_100%)]" />

              <div className="absolute w-[397px] h-[397px] top-0 left-[507px] rounded-[198.5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(179,121,223,1)_0%,rgba(54,0,96,0)_100%)] opacity-[0.58]" />
            </div>
          </div>

          <div className="absolute w-[470px] h-[197px] top-[358px] left-[201px]">
            <img
              className="absolute w-[83px] h-[125px] -top-1.5 left-3.5"
              alt="Front shapes"
              src="https://c.animaapp.com/TCUof8k2/img/front-shapes@2x.png"
            />

            <div className="absolute w-[41px] h-[215px] top-[-9px] left-[348px]">
              <img
                className="absolute w-[41px] h-[106px] top-[58px] left-0"
                alt="Front shapes"
                src="https://c.animaapp.com/TCUof8k2/img/front-shapes-1@2x.png"
              />

              <img
                className="absolute w-[18px] h-[215px] top-0 left-[23px]"
                alt="Saly"
                src="https://c.animaapp.com/TCUof8k2/img/saly-16@2x.png"
              />
            </div>
          </div>

          <button
            className="all-[unset] box-border absolute w-[316px] h-[50px] top-[598px] left-[246px] cursor-pointer"
            onClick={handleProceed}
            type="button"
            aria-label="Proceed with phone verification"
          >
            <div className="relative w-[314px] h-[50px] rounded-[12.97px] bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)]">
              <div className="absolute top-[11px] left-[120px] [font-family:'Poppins',Helvetica] font-semibold text-white text-lg tracking-[0] leading-[normal]">
                Proceed
              </div>
            </div>
          </button>

          <div className="flex flex-col w-[315px] items-start gap-3 absolute top-[478px] left-[246px]">
            <label
              htmlFor="phone-input"
              className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal]"
            >
              Mobile Number
            </label>

            <div className="relative w-[316px] h-[55px] mr-[-1.00px]">
              <div className="relative w-[314px] h-[55px]">
                <div className="absolute w-[314px] h-[55px] top-0 left-0">
                  <img
                    className="absolute w-[314px] h-[55px] top-[3457px] left-[-2722px]"
                    alt="Rectangle"
                    src="/img/rectangle-3.svg"
                  />

                  <div className="absolute w-[314px] h-[55px] top-0 left-0 bg-[url(https://c.animaapp.com/TCUof8k2/img/rectangle-1.svg)] bg-[100%_100%]">
                    <img
                      className="absolute w-2 h-2 top-6 left-[86px]"
                      alt="Arrow back ios new"
                      src="https://c.animaapp.com/TCUof8k2/img/arrow-back-ios-new@2x.png"
                    />
                  </div>
                </div>

                <img
                  className="absolute w-[17px] h-[17px] top-5 left-5"
                  alt="Vector"
                  src="https://c.animaapp.com/TCUof8k2/img/vector.svg"
                />

                <div className="absolute top-[17px] left-[58px] [font-family:'Poppins',Helvetica] font-medium text-[#d3d3d3] text-[14.3px] tracking-[0] leading-[normal] flex items-center">
                  <span>{countryCode}&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                  <input
                    id="phone-input"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="bg-transparent text-[#d3d3d3] [font-family:'Poppins',Helvetica] font-medium text-[14.3px] tracking-[0] leading-[normal] outline-none border-none w-[120px]"
                    placeholder="Enter phone number"
                    aria-describedby="phone-description"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute w-[286px] h-[87px] top-[359px] left-[255px]">
            <p
              id="phone-description"
              className="absolute w-[282px] top-[45px] left-0 [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-sm text-center tracking-[0] leading-[normal]"
            >
              We need your mobile number to verify your identity
            </p>

            <h1 className="absolute top-0 left-[58px] [font-family:'Poppins',Helvetica] font-semibold text-[#efefef] text-2xl tracking-[0] leading-[normal]">
              One Last Thing
            </h1>
          </div>

          <img
            className="absolute w-[52px] h-[43px] top-[315px] left-[519px]"
            alt="Gem"
            src="https://c.animaapp.com/TCUof8k2/img/gem-1@2x.png"
          />

          <img
            className="absolute w-28 h-[123px] top-[131px] left-[215px] object-cover"
            alt="Coins"
            src="https://c.animaapp.com/TCUof8k2/img/coins-1@2x.png"
          />

          <img
            className="absolute w-[179px] h-[125px] top-[191px] left-[313px] object-cover"
            alt="Element"
            src="https://c.animaapp.com/TCUof8k2/img/2211-w030-n003-510b-p1-510--converted--02-2@2x.png"
          />
        </div>
      </div>
    </div>
  );
}
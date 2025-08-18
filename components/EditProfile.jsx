"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const EditProfile = () => {
  const [formData, setFormData] = useState({
    userName: "",
    emailAddress: "",
    phoneNumber: "",
    socialTag: "",
  });
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", formData);
    // Here you would typically save to backend/context
    // For now, just navigate back to profile or previous page
    router.back();
  };

  const handleCancel = () => {
    console.log("Cancelling changes");
    router.back();
  };

  const handleClose = () => {
    console.log("Closing edit profile");
    router.back();
  };

  const handleProfilePictureChange = () => {
    console.log("Change profile picture");
    // Handle profile picture upload logic
  };

  return (
    <div className="bg-[#272052] flex h-screen flex-row justify-center w-full relative overflow-hidden">
      <div
        className="relative w-full max-w-[390px] h-full bg-[#272052] mx-auto"
        data-model-id="2739:7886"
      >
        <header className="absolute w-full h-24 top-[44px] left-0 px-4">
          <div className="relative w-full h-full flex items-center justify-between">
            <div
              className="w-[58px] h-[58px] font-semibold text-[40px] [font-family:'Poppins',Helvetica] text-white tracking-[0] leading-[normal] flex items-center justify-center"
              role="img"
              aria-label="Sun icon"
            >
              ☀
            </div>

            <h1 className="absolute left-1/2 transform -translate-x-1/2 [font-family:'Poppins',Helvetica] font-bold text-white text-xl text-center tracking-[0] leading-[normal]">
              Edit Profile
            </h1>

            <button
              onClick={handleClose}
              className="w-[31px] h-[31px] cursor-pointer flex items-center justify-center"
              aria-label="Close edit profile"
            >
              <img
                className="w-full h-full"
                alt="Close"
                src="https://c.animaapp.com/mFM2C37Z/img/close.svg"
              />
            </button>
          </div>
        </header>

        <div className="absolute w-[132px] h-[124px] top-[140px] left-1/2 transform -translate-x-1/2">
          <div className="relative w-full h-full">
            <img
              className="w-[132px] h-[120px]"
              alt="Profile avatar background"
              src="https://c.animaapp.com/mFM2C37Z/img/component-1.svg"
            />

            <div className="absolute w-[45px] h-[45px] bottom-0 right-0">
              <div className="relative w-[43px] h-[45px]">
                <div className="w-[43px] h-[43px] bg-darkgray-2 rounded-[21.73px] border-[5px] border-solid border-darkgray-1" />

                <button
                  onClick={handleProfilePictureChange}
                  className="absolute inset-0 flex items-center justify-center font-medium text-xl [font-family:'Poppins',Helvetica] text-white tracking-[0] leading-[normal] cursor-pointer"
                  aria-label="Change profile picture"
                >
                  📸
                </button>
              </div>
            </div>
          </div>
        </div>

        <form className="absolute top-[280px] left-0 w-full px-8 space-y-6">
          <div className="w-full">
            <label
              htmlFor="userName"
              className="block [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal] mb-2"
            >
              User Name
            </label>
            <div className="relative w-full">
              <img
                className="w-full h-[54px]"
                alt="Input background"
                src="https://c.animaapp.com/mFM2C37Z/img/card-4@2x.png"
              />
              <input
                id="userName"
                type="text"
                value={formData.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
                className="absolute inset-0 bg-transparent px-4 py-3 text-white [font-family:'Poppins',Helvetica] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="emailAddress"
              className="block [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal] mb-3"
            >
              Email Address
            </label>
            <div className="relative w-full">
              <img
                className="w-full h-[54px]"
                alt="Input background"
                src="https://c.animaapp.com/mFM2C37Z/img/card-4@2x.png"
              />
              <input
                id="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={(e) =>
                  handleInputChange("emailAddress", e.target.value)
                }
                className="absolute inset-0 bg-transparent px-4 py-3 text-white [font-family:'Poppins',Helvetica] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="phoneNumber"
              className="block [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal] mb-3"
            >
              Phone Number
            </label>
            <div className="relative w-full">
              <img
                className="w-full h-[54px]"
                alt="Input background"
                src="https://c.animaapp.com/mFM2C37Z/img/card-4@2x.png"
              />
              <input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className="absolute inset-0 bg-transparent px-4 py-3 text-white [font-family:'Poppins',Helvetica] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="socialTag"
              className="block [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal] mb-3"
            >
              Social Tag
            </label>
            <div className="relative w-full">
              <img
                className="w-full h-[54px]"
                alt="Input background"
                src="https://c.animaapp.com/mFM2C37Z/img/card-4@2x.png"
              />
              <input
                id="socialTag"
                type="text"
                value={formData.socialTag}
                onChange={(e) => handleInputChange("socialTag", e.target.value)}
                className="absolute inset-0 bg-transparent px-4 py-3 text-white [font-family:'Poppins',Helvetica] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                placeholder="Enter your social tag"
              />
            </div>
          </div>

          <div className="w-full pt-4 space-y-3">
            <button
              type="button"
              onClick={handleSaveChanges}
              className="w-full h-[42px] rounded-lg bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)] hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center"
            >
              <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-sm tracking-[0] leading-[normal]">
                Save Changes
              </span>
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full h-[42px] bg-[#2c2c2c] rounded-lg hover:bg-[#3c3c3c] transition-colors cursor-pointer flex items-center justify-center"
            >
              <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-sm tracking-[0] leading-[normal]">
                Cancel
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
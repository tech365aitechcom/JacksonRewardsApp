"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image for the preview
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile, uploadAvatar } from "@/lib/api";

export const EditProfile = () => {
  const router = useRouter();
  const { user, token, updateUserInContext } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [originalAvatar, setOriginalAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null); // For immediate
  const fileInputRef = useRef(null);


  // 1. Fetch profile data to pre-fill the form
  useEffect(() => {
    if (token && user) {
      const fetchProfileData = async () => {
        try {
          const profileData = await getProfile(token);
          setFormData({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
          });
          setAvatarPreview(profileData.profile.avatar);
          setOriginalAvatar(profileData.profile.avatar); // Store the original
        } catch (err) {
          setError("Could not load your profile data.");
          console.error("Failed to load profile for editing:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfileData();
    }
  }, [token, user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 2. Handle saving changes to the backend
  const handleSaveChanges = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }
    if (!formData.firstName) {
      setError("First name cannot be empty.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const dataToUpdate = {
      firstName: formData.firstName,
      lastName: formData.lastName || "-",
      status: "active",
    };

    try {
      await updateProfile(dataToUpdate, token);
      if (updateUserInContext) {
        updateUserInContext({ ...user, ...dataToUpdate });
      }
      router.replace('/myprofile');
    } catch (err) {
      setError(err.message || "Failed to save profile.");
      console.error("Failed to save profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // A. Optimistic UI: Show a local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // B. Upload the file to the backend
    if (token) {
      const upload = async () => {
        try {
          const response = await uploadAvatar(file, token);
          setAvatarPreview(response.avatar);
          setOriginalAvatar(response.avatar);
          alert("Avatar updated successfully!");
        } catch (err) {
          setError(err.message || "Failed to upload avatar.");
          setAvatarPreview(originalAvatar);
          console.error("Failed to upload avatar:", err);
        }
      };
      upload();
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();
  const handleClose = () => router.replace('/myprofile');

  if (isLoading) {
    return <div className="bg-[#272052] flex h-screen justify-center items-center text-white">Loading Editor...</div>;
  }

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
            <Image
              src={"https://c.animaapp.com/mFM2C37Z/img/component-1.svg"}
              alt="Profile avatar preview"
              width={132}
              height={120}
              className="object-cover rounded-full"
            />
            <div className="absolute w-[45px] h-[45px] bottom-0 right-0">
              <div className="relative w-[43px] h-[45px]">
                <div className="w-[43px] h-[43px] bg-darkgray-2 rounded-[21.73px] border-[5px] border-solid border-darkgray-1" />

                {/* Hidden file input for avatar upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  accept="image/*"
                />

                <button
                  type="button" // Important: prevent form submission
                  onClick={triggerFileInput}
                  className="absolute inset-0 flex items-center justify-center font-medium text-xl [font-family:'Poppins',Helvetica] text-white tracking-[0] leading-[normal] cursor-pointer"
                  aria-label="Change profile picture"
                >
                  📸
                </button>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveChanges} className="absolute top-[280px] left-0 w-full px-8 space-y-6">
          <div className="w-full">
            <label
              htmlFor="firstName"
              className="block [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal] mb-2"
            >
              First Name
            </label>
            <div className="relative w-full">
              <img className="w-full h-[54px]" alt="Input background" src="https://c.animaapp.com/mFM2C37Z/img/card-4@2x.png" />
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="absolute inset-0 bg-transparent px-4 py-3 text-white [font-family:'Poppins',Helvetica] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                placeholder="Enter your first name"
                required
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="lastName"
              className="block [font-family:'Poppins',Helvetica] font-medium text-neutral-400 text-[14.3px] tracking-[0] leading-[normal] mb-2"
            >
              Last Name
            </label>
            <div className="relative w-full">
              <img className="w-full h-[54px]" alt="Input background" src="https://c.animaapp.com/mFM2C37Z/img/card-4@2x.png" />
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="absolute inset-0 bg-transparent px-4 py-3 text-white [font-family:'Poppins',Helvetica] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                placeholder="Enter your last name"
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
              <img className="w-full h-[54px]" alt="Input background" src="https://c.animaapp.com/mFM2C37Z/img/card-4@2x.png" />
              <input
                id="emailAddress"
                type="email"
                readOnly
                value={user?.email || ''}

                className="absolute inset-0 bg-transparent px-4 py-3 text-gray-400 [font-family:'Poppins',Helvetica] text-sm cursor-not-allowed"
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
              <img className="w-full h-[54px]" alt="Input background" src="https://c.animaapp.com/mFM2C37Z/img/card-4@2x.png" />
              <input
                id="phoneNumber"
                type="tel"
                readOnly
                value={user?.mobile || ''}
                className="absolute inset-0 bg-transparent px-4 py-3 text-gray-400 [font-family:'Poppins',Helvetica] text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-center text-sm -mt-2">{error}</p>}

          <div className="w-full pt-4 space-y-3">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full h-[42px] rounded-lg bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)] hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-sm tracking-[0] leading-[normal]">
                {isSaving ? "Saving..." : "Save Changes"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleClose}
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
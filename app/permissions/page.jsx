'use client'
import React, { useState } from 'react'

const ImageDisplay = ({ 
  src, 
  alt = "Permissions interface", 
  className = "" 
}) => {
  return (
    <figure className={`w-full flex justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        className="aspect-[0.45] object-contain w-full self-center max-w-[326px] rounded-[15px]"
        loading="lazy" // Added for better Next.js image loading
      />
    </figure>
  );
};


const PermissionsScreen = ({ 
  imageUrl = "/permission.png",
  imageAlt = "Permissions interface illustration"
}) => {
  return (
    <main className="bg-[rgba(39,32,82,1)]  max-w-[480px] w-full overflow-hidden mx-auto min-h-screen ">
      <div className="bg-[rgba(32,32,32,0.2)] flex w-full flex-col items-stretch pt-[37px]">
        <ImageDisplay 
          src={imageUrl}
          alt={imageAlt}
        />
      </div>
    </main>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PermissionsScreen />
    </div>
  );
}
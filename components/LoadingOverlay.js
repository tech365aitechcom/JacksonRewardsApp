// components/LoadingOverlay.js

import React from "react";

// A spinner styled to match your app's theme
const Spinner = () => (
  <div className="border-gray-500 h-16 w-16 animate-spin rounded-full border-4 border-t-[#af7de6]" />
);

// The overlay component
export default function LoadingOverlay({ message }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50">
      <Spinner />
      {message && (
        <p className="text-white text-lg font-semibold mt-4 [font-family:'Poppins',Helvetica]">
          {message}
        </p>
      )}
    </div>
  );
}

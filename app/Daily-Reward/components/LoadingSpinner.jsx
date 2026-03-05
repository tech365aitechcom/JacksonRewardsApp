"use client";

import React from "react";

export const LoadingSpinner = ({ size = "medium", message = "Loading..." }) => {
    const sizeClasses = {
        small: "w-6 h-6",
        medium: "w-8 h-8",
        large: "w-12 h-12"
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
            {message && (
                <p className="mt-2 text-white text-sm [font-family:'Poppins',Helvetica]">
                    {message}
                </p>
            )}
        </div>
    );
};

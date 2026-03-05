"use client";
import React from "react";
import { useSelector } from "react-redux";
import { getLocationDisplayInfo } from "@/lib/locationUtils";

/**
 * LocationDisplay Component
 * Displays user's current location information from Redux store
 */
const LocationDisplay = ({
    showCoordinates = false,
    showIcon = true,
    className = "",
    fallbackText = "Location not available"
}) => {
    const { locationHistory, locationStatus } = useSelector((state) => state.profile);

    // Get the most recent location
    const currentLocation = locationHistory?.data?.[0] || locationHistory;

    const displayInfo = getLocationDisplayInfo(currentLocation);

    if (locationStatus === "loading") {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                {showIcon && <span className="text-sm">🔄</span>}
                <span className="text-sm text-gray-500">Loading location...</span>
            </div>
        );
    }

    if (!currentLocation || locationStatus === "failed") {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                {showIcon && <span className="text-sm">📍</span>}
                <span className="text-sm text-gray-500">{fallbackText}</span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {showIcon && <span className="text-sm">{displayInfo.icon}</span>}
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {displayInfo.primary}
                </span>
                {showCoordinates && displayInfo.secondary && (
                    <span className="text-xs text-gray-500">
                        {displayInfo.secondary}
                    </span>
                )}
            </div>
        </div>
    );
};

export default LocationDisplay;

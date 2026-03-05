"use client";

import React, { useState, useEffect } from "react";

export const TimerBadge = ({ nextUnlockTime, isClaimed, countdown }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [isExpired, setIsExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [initialCountdown, setInitialCountdown] = useState(null);
    const [countdownStartTime, setCountdownStartTime] = useState(null);

    useEffect(() => {
        // Only show timer if we have valid data
        if (!countdown && !nextUnlockTime) {
            setIsLoading(false);
            setInitialCountdown(null);
            setCountdownStartTime(null);
            return;
        }

        setIsLoading(false);

        // Initialize countdown from API or calculate from nextUnlockTime
        if (countdown && countdown > 0) {
            // Store the initial countdown value and when we received it
            setInitialCountdown(countdown);
            setCountdownStartTime(Date.now());
        } else if (nextUnlockTime) {
            // Use nextUnlockTime if countdown not available
            const now = new Date().getTime();
            const unlockTime = new Date(nextUnlockTime).getTime();
            const timeUntilUnlock = Math.max(0, unlockTime - now);
            setInitialCountdown(timeUntilUnlock);
            setCountdownStartTime(now);
        }
    }, [nextUnlockTime, isClaimed, countdown]);

    // Calculate and update countdown every second
    useEffect(() => {
        if (initialCountdown === null || countdownStartTime === null) {
            return;
        }

        const calculateTimeLeft = () => {
            const now = Date.now();
            const elapsed = now - countdownStartTime;
            const remaining = Math.max(0, initialCountdown - elapsed);

            if (remaining <= 0) {
                setIsExpired(true);
                setTimeLeft(isClaimed ? "Next reward ready!" : "Ready!");
                return;
            }

            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

            // Format: "23h:30m" for clear countdown display
            // For claimed rewards, show "Next: 23h:30m"
            if (isClaimed) {
                setTimeLeft(`Next: ${hours}h:${minutes.toString().padStart(2, '0')}m`);
            } else {
                setTimeLeft(`${hours}h:${minutes.toString().padStart(2, '0')}m`);
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [initialCountdown, countdownStartTime, isClaimed]);

    // Only show timer if we have valid countdown data
    if (!countdown && !nextUnlockTime) return null;

    return (
        <div className="absolute bottom-[6px] left-1/2 transform -translate-x-1/2 w-[120px] h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg border border-purple-400 z-10">
            <div className="flex items-center gap-2">
                {/* Countdown Icon */}
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>

                {/* Timer Text */}
                <span className="text-white text-xs font-bold">
                    {isLoading ? "Loading..." : timeLeft}
                </span>
            </div>
        </div>
    );
};

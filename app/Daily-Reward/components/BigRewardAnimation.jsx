"use client";

import React, { useState, useEffect } from "react";

export const BigRewardAnimation = ({ isEligible, onAnimationComplete }) => {
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        if (isEligible) {
            setShowAnimation(true);
            const timer = setTimeout(() => {
                setShowAnimation(false);
                onAnimationComplete?.();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isEligible, onAnimationComplete]);

    if (!showAnimation) return null;

    const handleClose = () => {
        setShowAnimation(false);
        onAnimationComplete?.();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative bg-black/90 backdrop-blur-md rounded-[20px] px-6 py-8 shadow-2xl border border-gray-600/50 max-w-sm mx-4">
                {/* Close Button - aligned to top right */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-600/50 hover:bg-gray-500/50 rounded-full text-white text-xl font-bold transition-all duration-200"
                    aria-label="Close"
                >
                    ✕
                </button>
                
                <div className="text-center pt-2">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <div className="text-4xl mb-2 text-yellow-400 font-bold animate-pulse">
                        BIG REWARD UNLOCKED!
                    </div>
                    <div className="text-xl text-white">
                        Perfect 7-day streak achieved!
                    </div>
                    <div className="text-2xl mt-4 text-yellow-300">
                        🏆 GOLDEN TREASURE CHEST 🏆
                    </div>
                </div>
            </div>
        </div>
    );
};

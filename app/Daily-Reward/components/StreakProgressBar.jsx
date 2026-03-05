"use client";
import React, { useMemo } from "react";
export const StreakProgressBar = ({ weekData }) => {
    const streakProgress = useMemo(() => {
        if (!weekData || !weekData.days) return { current: 0, total: 7, percentage: 0 };

        const claimedDays = weekData.days.filter(day => day.status === 'claimed').length;
        const percentage = (claimedDays / 7) * 100;

        return {
            current: claimedDays,
            total: 7,
            percentage: Math.round(percentage),
            isBigRewardEligible: weekData.bigRewardEligible || false
        };
    }, [weekData]);

    return (
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
                className={`h-2 rounded-full transition-all duration-500 ${streakProgress.isBigRewardEligible
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}
                style={{ width: `${streakProgress.percentage}%` }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Streak: {streakProgress.current}/7</span>
                <span>{streakProgress.percentage}%</span>
                {streakProgress.isBigRewardEligible && (
                    <span className="text-yellow-400">🏆 Big Reward Ready!</span>
                )}
            </div>
        </div>
    );
};

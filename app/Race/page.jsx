"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Race } from "./components/Race";
import { HomeIndicator } from "../../components/HomeIndicator";
import { getXPTierProgressBar } from "@/lib/api";
import { useWalletUpdates } from "@/hooks/useWalletUpdates";


const RacePage = () => {
    const router = useRouter();
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef(null);

    const [xpTierData, setXPTierData] = useState(null);
    const [isLoadingXP, setIsLoadingXP] = useState(true);
    const [errorXP, setErrorXP] = useState(null);
    const [token, setToken] = useState(null);

    const { realTimeXP } = useWalletUpdates(token);
    const xpCurrent = realTimeXP;

    // Cache key for localStorage
    const CACHE_KEY = 'xpTierProgressBarRace'; // Unique cache key for RacePage
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

    // Effect to get token from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('authToken');
            setToken(storedToken);
        }
    }, []);

    // Load cached data immediately on mount (non-blocking)
    useEffect(() => {
        if (typeof window === 'undefined' || !token) return;

        try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                const cacheAge = Date.now() - (parsed.timestamp || 0);

                if (cacheAge < CACHE_TTL && parsed.data) {
                    setXPTierData(parsed.data);
                } else if (parsed.data) {
                    setXPTierData(parsed.data);
                }
            }
        } catch (err) {
            // Failed to load cache
        }
    }, [token]);

    // Fetch fresh data in background
    useEffect(() => {
        if (!token) {
            setIsLoadingXP(false);
            return;
        }

        const fetchXPTierData = async () => {
            setIsLoadingXP(true);
            setErrorXP(null);
            try {
                const response = await getXPTierProgressBar(token);
                if (response.success && response.data) {
                    const cacheData = {
                        data: response.data,
                        timestamp: Date.now(),
                    };
                    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
                    setXPTierData(response.data);
                } else {
                    setErrorXP(response.error || 'Failed to fetch XP data');
                }
            } catch (err) {
                setErrorXP('Failed to fetch XP data');
            } finally {
                setIsLoadingXP(false);
            }
        };

        fetchXPTierData();
    }, [token]);

    // OPTIMIZED: Memoize progress data from API response with real-time XP updates
    const progressData = useMemo(() => {
        if (!xpTierData) {
            return {
                title: "Loading XP data...",
                currentXP: 0,
                totalXP: 1000,
                currentTier: null,
                tiers: [],
                progressBarStart: 0,
                progressBarWidth: 0,
                indicatorPosition: 0,
            };
        }

        const currentXP = (xpCurrent !== null && xpCurrent !== undefined) ? xpCurrent : (xpTierData.currentXP || 0);
        const currentTier = xpTierData.currentTier || null;
        const tiers = xpTierData.tiers || [];

        const BAR_WIDTH = 288;
        const JUNIOR_POS = 0;
        const MID_LEVEL_POS = 114;
        const SENIOR_POS = 259;

        let progressBarStart = 0;
        let progressBarWidth = 0;
        let indicatorPosition = 0;
        let totalXP = 1000;

        if (currentTier && tiers.length > 0) {
            const maxTier = tiers.reduce((max, tier) =>
                (tier.xpMax > (max?.xpMax || 0)) ? tier : max, tiers[0]
            );
            totalXP = maxTier.xpMax || currentTier.xpMax || 1000;

            const tierName = currentTier.name || "";
            const tierRange = currentTier.xpMax - currentTier.xpMin;

            const adjustedXP = Math.max(currentXP, currentTier.xpMin);
            const tierProgress = tierRange > 0
                ? Math.min(Math.max((adjustedXP - currentTier.xpMin) / tierRange, 0), 1)
                : 0;

            if (tierName === "Junior" || tierName.toLowerCase() === "junior") {
                progressBarStart = JUNIOR_POS;
                const segmentWidth = MID_LEVEL_POS - JUNIOR_POS;
                progressBarWidth = segmentWidth * tierProgress;
                indicatorPosition = JUNIOR_POS + progressBarWidth;
            } else if (tierName === "Middle" || tierName === "Mid-level" || tierName.toLowerCase() === "middle" || tierName.toLowerCase() === "mid-level") {
                progressBarStart = JUNIOR_POS;
                const juniorSegmentWidth = MID_LEVEL_POS - JUNIOR_POS;
                const midSegmentWidth = SENIOR_POS - MID_LEVEL_POS;
                progressBarWidth = juniorSegmentWidth + (midSegmentWidth * tierProgress);
                indicatorPosition = JUNIOR_POS + progressBarWidth;
            } else if (tierName === "Senior" || tierName.toLowerCase() === "senior") {
                progressBarStart = JUNIOR_POS;
                const juniorSegmentWidth = MID_LEVEL_POS - JUNIOR_POS;
                const midSegmentWidth = SENIOR_POS - MID_LEVEL_POS;
                const seniorSegmentWidth = BAR_WIDTH - SENIOR_POS;
                progressBarWidth = juniorSegmentWidth + midSegmentWidth + (seniorSegmentWidth * tierProgress);
                indicatorPosition = JUNIOR_POS + progressBarWidth;
            } else {
                progressBarStart = 0;
                progressBarWidth = BAR_WIDTH * tierProgress;
                indicatorPosition = progressBarWidth;
            }

            progressBarWidth = Math.min(progressBarWidth, BAR_WIDTH - progressBarStart);
            indicatorPosition = Math.max(0, Math.min(indicatorPosition, BAR_WIDTH - 6));
        } else {
            totalXP = xpTierData.totalXP || 1000;
            const progressPercentage = totalXP > 0 ? Math.min((currentXP / totalXP) * 100, 100) : 0;
            progressBarStart = 0;
            progressBarWidth = (BAR_WIDTH * progressPercentage) / 100;
            indicatorPosition = progressBarWidth;
        }

        return {
            title: xpTierData.title || "You're off to a great start!",
            currentXP: currentXP,
            totalXP: totalXP,
            currentTier: currentTier,
            tiers: tiers,
            progressBarStart: progressBarStart,
            progressBarWidth: progressBarWidth,
            indicatorPosition: indicatorPosition,
        };
    }, [xpTierData, xpCurrent]);

    return (
        <div
            className="relative w-full min-h-screen bg-black pb-[150px]"
            onClick={() => setShowTooltip(false)}
        >
            {/* Header */}
            <div className="absolute w-full h-[49px] top-0 left-0 z-10 px-5">
                <div className="absolute top-[1px] left-5 [font-family:'Poppins',Helvetica] font-light text-[#A4A4A4] text-[10px] tracking-[0] leading-3 whitespace-nowrap">
                    App Version: V0.0.1
                </div>
            </div>
            <header className="flex flex-col w-[375px] items-start gap-2 px-5 py-3 absolute top-[30px] left-0">
                <nav className="items-center gap-4 self-stretch w-full rounded-[32px] flex relative flex-[0_0_auto]">
                    <button
                        aria-label="Go back"
                        onClick={() => {
                            router.back();
                        }}
                    >
                        <svg
                            className="relative w-6 h-6 text-white cursor-pointer transition-transform duration-150 active:scale-95"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path
                                d="M15 18l-6-6 6-6"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                    </button>

                    <h1 className="relative w-[255px] [font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0] leading-5">
                        Race
                    </h1>

                    <button aria-label="Messages">
                        <img
                            className="relative w-6 h-6 mt-[-65182.00px] mr-[-15123.00px]"
                            alt="Messages chat"
                            src="/img/messages-chat.png"
                            loading="eager"
                            decoding="async"
                            width="24"
                            height="24"
                        />
                    </button>
                    {/* Show a clickable info icon that opens a tooltip modal */}
                    <button
                        aria-label="More information about Race"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowTooltip(!showTooltip);
                        }}
                        className="ml-2 focus:outline-none"
                        type="button"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd"
                                d="M19.6004 9.99844C19.6004 12.5445 18.589 14.9863 16.7886 16.7867C14.9883 18.587 12.5465 19.5984 10.0004 19.5984C7.45431 19.5984 5.01252 18.587 3.21217 16.7867C1.41182 14.9863 0.400391 12.5445 0.400391 9.99844C0.400391 7.45236 1.41182 5.01056 3.21217 3.21021C5.01252 1.40986 7.45431 0.398438 10.0004 0.398438C12.5465 0.398438 14.9883 1.40986 16.7886 3.21021C18.589 5.01056 19.6004 7.45236 19.6004 9.99844ZM11.2004 5.19844C11.2004 5.5167 11.074 5.82192 10.8489 6.04697C10.6239 6.27201 10.3187 6.39844 10.0004 6.39844C9.68213 6.39844 9.37691 6.27201 9.15186 6.04697C8.92682 5.82192 8.80039 5.5167 8.80039 5.19844C8.80039 4.88018 8.92682 4.57495 9.15186 4.34991C9.37691 4.12487 9.68213 3.99844 10.0004 3.99844C10.3187 3.99844 10.6239 4.12487 10.8489 4.34991C11.074 4.57495 11.2004 4.88018 11.2004 5.19844ZM8.80039 8.79844C8.48213 8.79844 8.17691 8.92487 7.95186 9.14991C7.72682 9.37495 7.60039 9.68018 7.60039 9.99844C7.60039 10.3167 7.72682 10.6219 7.95186 10.847C8.17691 11.072 8.48213 11.1984 8.80039 11.1984V14.7984C8.80039 15.1167 8.92682 15.4219 9.15186 15.647C9.37691 15.872 9.68213 15.9984 10.0004 15.9984H11.2004C11.5187 15.9984 11.8239 15.872 12.0489 15.647C12.274 15.4219 12.4004 15.1167 12.4004 14.7984C12.4004 14.4802 12.274 14.175 12.0489 13.9499C11.8239 13.7249 11.5187 13.5984 11.2004 13.5984V9.99844C11.2004 9.68018 11.074 9.37495 10.8489 9.14991C10.6239 8.92487 10.3187 8.79844 10.0004 8.79844H8.80039Z"
                                fill="#8B92DF" />
                        </svg>
                    </button>
                    {showTooltip && (
                        <div
                            ref={tooltipRef}
                            className="absolute top-[34px] right-[-8px] z-50 w-[340px] bg-black/95 backdrop-blur-sm rounded-[12px] px-4 py-4 shadow-2xl border border-gray-600/50 animate-fade-in"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-white font-medium text-sm [font-family:'Poppins',Helvetica] leading-normal space-y-3">
                                {/* Main Information */}
                                <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                                    <p className="font-semibold mb-2 text-purple-300 text-center">🏁 How It Works</p>
                                    <p className="text-gray-200 text-xs mb-2">
                                        Complete tasks to climb the ladder faster. Levels unlock sequentially, rewards increase, and higher tiers unlock more races.
                                    </p>
                                </div>

                                {/* XP Progress Section */}
                                {isLoadingXP ? (
                                    <div className="text-center text-gray-300">
                                        <p>⏳ Loading XP data...</p>
                                    </div>
                                ) : errorXP ? (
                                    <div className="text-center text-red-400">
                                        <p>❌ Error: {errorXP}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                                            <p className="font-semibold mb-2 text-center text-gray-100">📊 Your Progress</p>
                                            <div className="space-y-1.5 text-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-300">Current XP:</span>
                                                    <span className="text-purple-400 font-semibold">{progressData.currentXP}</span>
                                                </div>
                                                {progressData.currentTier && (
                                                    <>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-300">Current Tier:</span>
                                                            <span className="text-yellow-400 font-semibold">{progressData.currentTier.name}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-300">XP to Next Tier:</span>
                                                            <span className="text-green-400 font-semibold">
                                                                {Math.max(0, progressData.currentTier.xpMax - progressData.currentXP)}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-300">Total XP Needed:</span>
                                                    <span className="text-gray-200 font-semibold">{progressData.totalXP}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tips Section */}
                                        <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/30">
                                            <p className="font-semibold mb-1.5 text-blue-300 text-xs">💡 Quick Tips</p>
                                            <ul className="space-y-1 text-gray-300 text-xs">
                                                <li className="flex gap-2">
                                                    <span className="text-green-400">✓</span>
                                                    <span>Complete tasks to earn XP and advance tiers</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-green-400">✓</span>
                                                    <span>Higher tiers unlock better rewards and more race options</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-yellow-400">★</span>
                                                    <span>Stay consistent to climb faster through the levels</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="absolute top-[-8px] right-[25px] w-4 h-4 bg-black/95 border-t border-l border-gray-600/50 transform rotate-45"></div>
                        </div>
                    )}
                </nav>
            </header>

            {/* Main Content */}
            <div className="flex flex-col w-full max-w-[375px] mx-auto items-center gap-6 pt-24 px-4">
                <Race progressData={progressData} isLoadingXP={isLoadingXP} />
            </div>

            {/* Home Indicator */}
            <HomeIndicator activeTab="home" />
        </div>
    );
};

export default RacePage;

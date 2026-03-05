"use client";
import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// Coins from profile API (https://rewardsapi.hireagent.co/api/profile) -> wallet.balance
const RewardProgress = ({ stats }) => {
    const router = useRouter();
    const rewardGoal = 10000;

    const profile = useSelector((state) => state.profile.details);
    const walletScreen = useSelector((state) => state.walletTransactions.walletScreen);
    const balance = profile?.wallet?.balance ?? profile?.data?.wallet?.balance ?? walletScreen?.wallet?.balance ?? 0;

    // Round to 2 decimal places to avoid floating-point display (e.g. 3266.9000000000015)
    const round2 = (n) => (typeof n === "number" && !Number.isNaN(n) ? Math.round(n * 100) / 100 : n);

    // OPTIMIZED: Memoize expensive calculations to prevent re-computation
    const pointsData = useMemo(() => {
        const totalCoins = Number(balance) || 0;
        const currentLevel = Math.floor(totalCoins / rewardGoal) + 1;
        const nextLevel = currentLevel + 1;
        const progressTowardsNext = round2(totalCoins % rewardGoal);
        const pointsNeeded = round2(Math.max(0, rewardGoal - progressTowardsNext));
        const progressPercentage = Math.min(round2((progressTowardsNext / rewardGoal) * 100), 100);

        return {
            currentPoints: progressTowardsNext,
            targetPoints: rewardGoal,
            pointsNeeded: pointsNeeded,
            currentLevel: currentLevel,
            nextLevel: nextLevel,
            progressPercentage,
            totalCoins: round2(totalCoins),
        };
    }, [balance]);

    // OPTIMIZED: Memoize click handler
    const handleHurryBoxClick = useCallback(() => {
        // Navigate to wallet to show balance breakdown and transaction history
        router.push('/Wallet');
    }, [router]);



    return (
        <div
            className="relative w-full max-w-[375px] mx-auto h-[135px]"
            data-model-id="1151:33569"
        >
            <div className="relative w-full h-[135px]">
                <div className="absolute w-full h-[135px] top-0 left-0">
                    <div
                        className="relative w-full h-[135px] bg-black rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8),2.48px_2.48px_18.58px_#3b3b3b80,-1.24px_-1.24px_16.1px_#825700] cursor-pointer hover:opacity-95 transition-opacity duration-200"
                        onClick={handleHurryBoxClick}
                        role="button"
                        tabIndex={0}
                        aria-label="View wallet balance and transaction history"
                    >
                        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_30px_8px_rgba(255,215,0,0.06)]" />
                        <div className="absolute w-[calc(100%-34px)] max-w-[302px] h-[25px] top-[79px] left-[17px]">
                            <div className="absolute w-full h-[25px] top-0 left-0">
                                <div className="w-full h-[25px]">
                                    <div className="relative w-full h-[25px]">
                                        {/* Progress bar background */}
                                        <div className="absolute w-full h-full rounded-full overflow-hidden ring-1 ring-[#8b7332] bg-gradient-to-r from-[#4a3c1a] to-[#6b5424] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.25)]"></div>

                                        {/* Progress bar fill */}
                                        <div
                                            className="absolute h-full bg-gradient-to-r from-[#ffd700] via-[#ffed4e] to-[#f4d03f] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                                            style={{
                                                left: '10px', // Start from circle center to create curved connection
                                                width: `calc(${pointsData.progressPercentage}% - 10px)`,
                                                borderRadius: '9999px',
                                                borderTopLeftRadius: '12px', // Curved left edge to flow from circle
                                                borderBottomLeftRadius: '12px',
                                                borderTopRightRadius: '9999px',
                                                borderBottomRightRadius: '9999px',
                                            }}
                                        ></div>
                                        {/* Current level indicator */}
                                        <div className="absolute w-[24px] h-[25px] top-0.3 left-[-1px] bg-[#d4af37] rounded-full border-0.5 border-[#b8860b] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                                            <div className="[font-family:'Poppins',Helvetica] font-semibold text-[#815c23] text-[12px] tracking-[0.02px] leading-[normal]">
                                                {pointsData.currentLevel}
                                            </div>
                                        </div>
                                        {/* Next level indicator - MOVED & FIXED */}
                                        <div className="absolute w-[24px] h-[25px] top-0.3 right-[-1px] bg-[#d4af37] rounded-full border-0.5 border-[#b8860b] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                                            <div className="[font-family:'Poppins',Helvetica] font-semibold text-[#815c23] text-[12px] tracking-[0.02px] leading-[normal]">
                                                {pointsData.nextLevel}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="absolute top-1 left-1/2 -translate-x-1/2 opacity-80 [font-family:'Poppins',Helvetica] font-semibold text-transparent text-[12px] tracking-[0.02px] leading-[normal]">
                                <span className="text-white">
                                    <span
                                        role="img"
                                        aria-label="star"
                                        className="inline-block relative "
                                        style={{
                                            filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))',
                                            transform: 'translateY(-1px)'
                                        }}
                                    >
                                        ⭐
                                    </span>{" "}
                                    {Number(pointsData.currentPoints).toFixed(2)}
                                </span>

                                <span className="text-gray-400">
                                    /{pointsData.targetPoints}
                                </span>
                            </p>
                        </div>

                        <header className="absolute w-[calc(100%-40px)] max-w-[299px] h-[42px] top-[19px]  left-5">
                            <div className="relative  w-full h-[42px]">
                                <div className="absolute w-full h-[21px] top-0 left-0">
                                    <h1 className="absolute w-full top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-md sm:text-md tracking-[-0.37px] leading-[27.2px] truncate">
                                        {"Keep a track your Coins"}
                                    </h1>
                                </div>

                                <p className="absolute w-full top-[27px] left-0 [font-family:'Poppins',Helvetica] font-semibold text-[#ffffff99] text-sm tracking-[0.02px] leading-[normal] truncate">
                                    {pointsData.pointsNeeded > 0
                                        ? `${Number(pointsData.pointsNeeded).toFixed(2)} Coins until level ${pointsData.nextLevel}`
                                        : `Level ${pointsData.currentLevel} completed!`
                                    }
                                </p>
                            </div>
                        </header>
                    </div>
                </div>
                {/* The misplaced circle and star icon have been removed from here */}
            </div>
        </div>
    );
};

export default RewardProgress;

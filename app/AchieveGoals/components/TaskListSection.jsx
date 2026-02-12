"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchGamesBySection } from "@/lib/redux/slice/gameSlice";
// Removed getAgeGroupFromProfile and getGenderFromProfile - now passing user object directly

const RecommendationCard = ({ card, onCardClick }) => {
    return (
        <article
            className="flex flex-col w-[158px] rounded-md overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-all duration-200"
            onClick={() => onCardClick(card)}
        >
            <div className="relative w-full min-h-[158px] flex items-center justify-center bg-gray-800">
                <Image
                    className="object-contain w-full max-w-[158px]"
                    alt="Game promotion"
                    src={card.image || '/placeholder.png'}
                    width={158}
                    height={158}
                    sizes="158px"
                    priority
                    style={{
                        height: 'auto',
                        maxHeight: '158px'
                    }}
                />
            </div>
            <div className="flex flex-col h-[60px] p-2  bg-[linear-gradient(180deg,rgba(81,98,182,0.9)_0%,rgba(63,56,184,0.9)_100%)]">

                <div className="flex flex-col mt-auto">
                    <div className="flex items-center mb-1 gap-1">
                        <p className="[font-family:'Poppins',Helvetica] font-medium text-white text-[14px]">Earn upto {card.earnings || "100"}</p>
                        <Image
                            className="w-[18px] h-[19px]"
                            alt="Coin"
                            src="/dollor.png"
                            width={18}
                            height={19}
                            priority
                            unoptimized
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <p className="[font-family:'Poppins',Helvetica] font-medium text-white text-[14px]">and {card.xpPoints || "50"}</p>
                        <Image
                            className="w-[21px] h-[16px]"
                            alt="Reward icon"
                            src="/xp.svg"
                            width={21}
                            height={16}
                            priority
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </article>
    );
};

export const TaskListSection = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    // Use new game discovery API for Cash Coach Recommendation section
    const { gamesBySection, gamesBySectionStatus } = useSelector((state) => state.games);
    const { details: userProfile } = useSelector((state) => state.profile);

    // Get the specific section data and status
    const sectionKey = "Cash Coach Recommendation";
    const sectionGames = gamesBySection?.[sectionKey] || [];
    const sectionStatus = gamesBySectionStatus?.[sectionKey] || "idle";

    // STALE-WHILE-REVALIDATE: Always fetch - will use cache if available and fresh
    useEffect(() => {
        // Validate userProfile - don't pass error objects
        const isValidUser = userProfile &&
            typeof userProfile === "object" &&
            !Array.isArray(userProfile) &&
            userProfile.success !== false && // Not an error response
            !userProfile.error && // Not an error object
            (userProfile.age !== undefined || userProfile.ageRange !== undefined || userProfile.gender !== undefined || userProfile._id !== undefined); // Has user properties


        // Only pass user object if it's valid, otherwise pass null to use defaults
        const userToPass = isValidUser ? userProfile : null;

        // Always dispatch - stale-while-revalidate will handle cache logic automatically
        // Pass user object directly - API will extract age and gender dynamically
        // This ensures:
        // 1. Shows cached data immediately if available (< 5 min old)
        // 2. Refreshes in background if cache is stale or 80% expired
        // 3. Fetches fresh if no cache exists

        dispatch(fetchGamesBySection({
            uiSection: sectionKey,
            user: userToPass, // Pass null if invalid, API will use defaults
            page: 1,
            limit: 10
        }));
    }, [dispatch, sectionKey, userProfile]);

    // Refresh games in background after showing cached data (to get admin updates)
    // Do this in background without blocking UI - show cached data immediately
    useEffect(() => {
        if (!userProfile) return;

        // Use setTimeout to refresh in background after showing cached data
        // This ensures smooth UX - cached data shows immediately, fresh data loads in background
        const refreshTimer = setTimeout(() => {
            dispatch(fetchGamesBySection({
                uiSection: sectionKey,
                user: userProfile,
                page: 1,
                limit: 10,
                force: true,
                background: true
            }));
        }, 100); // Small delay to let cached data render first

        return () => clearTimeout(refreshTimer);
    }, [dispatch, sectionKey, userProfile]);

    // Refresh games in background when app comes to foreground (admin might have updated)
    useEffect(() => {
        if (!userProfile) return;

        const handleFocus = () => {
            dispatch(fetchGamesBySection({
                uiSection: sectionKey,
                user: userProfile,
                page: 1,
                limit: 10,
                force: true,
                background: true
            }));
        };

        window.addEventListener("focus", handleFocus);

        const handleVisibilityChange = () => {
            if (!document.hidden && userProfile) {
                dispatch(fetchGamesBySection({
                    uiSection: sectionKey,
                    user: userProfile,
                    page: 1,
                    limit: 10,
                    force: true,
                    background: true
                }));
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [dispatch, sectionKey, userProfile]);

    // Map the new API data to component format - using normalizer for both besitos and bitlab
    const recommendationCards = Array.isArray(sectionGames)
        ? sectionGames.map((game) => {
            // Use normalizer for both besitos and bitlab
            const { normalizeGameImages, normalizeGameTitle, normalizeGameCategory, normalizeGameAmount, getTotalPromisedPoints } = require('@/lib/gameDataNormalizer');
            const images = normalizeGameImages(game);
            const title = normalizeGameTitle(game);
            const category = normalizeGameCategory(game);
            const amount = normalizeGameAmount(game);

            // Prefer API rewards.coins / rewards.gold everywhere
            const coinAmount = game.rewards?.coins ?? game.rewards?.gold ?? amount ?? 0;
            const raw = typeof coinAmount === 'number' ? coinAmount : (typeof coinAmount === 'string' ? parseFloat(String(coinAmount).replace('$', '')) || 0 : 0);
            const earnings = Number.isFinite(raw) ? (raw === Math.round(raw) ? String(Math.round(raw)) : (Math.round(raw * 100) / 100).toString()) : '0';
            const { totalXP } = getTotalPromisedPoints(game);
            const xpPoints = Number.isFinite(totalXP) ? Math.floor(totalXP).toString() : '0';

            return {
                id: game.gameId || game.details?.id || game._id || game.id,
                title: title,
                category: category,
                image: images.square_image || images.icon || game.images?.icon || game.images?.banner,
                earnings: earnings, // Now shows coins without $ sign
                xpPoints, // Total XP from tasks (getTotalPromisedPoints)
                fullGameData: game // Store full game including besitosRawData
            };
        })
        : [];

    // Handle game click - navigate to game details
    const handleGameClick = useCallback((game) => {
        // Clear Redux state BEFORE navigation to prevent showing old data
        dispatch({ type: 'games/clearCurrentGameDetails' });

        // Store full game data including besitosRawData in localStorage
        const fullGame = game.fullGameData || game;
        if (fullGame) {
            try {
                localStorage.setItem('selectedGameData', JSON.stringify(fullGame));
            } catch (error) {
                // Failed to store game data
            }
        }

        // Use provider gameId (BitLabs/Besitos) for get-game-by-id API; fallback to id/_id
        const gameId = game.gameId || game.details?.id || game.id || game._id;
        router.push(`/gamedetails?gameId=${gameId}&source=cashCoach`);
    }, [router, dispatch]);


    // Show loading state only if games are loading AND we have no cached data
    // With stale-while-revalidate, we show cached data immediately, so loading only shows on first load
    if (sectionStatus === 'loading' && sectionGames.length === 0) {
        return (
            <section className="flex flex-col justify-center items-center gap-2 w-full min-w-0 max-w-full">
                <header>
                    <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-white text-[20px]">
                        💸💸Recommendations💸💸
                    </h2>
                </header>
                <div className="flex items-start justify-center gap-3 self-stretch flex-wrap min-w-0 max-w-full">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col w-[158px] rounded-md overflow-hidden shadow-lg animate-pulse">
                            <div className="w-full min-h-[158px] bg-gray-700"></div>
                            <div className="h-[71px] bg-gray-700"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col justify-center items-center gap-2 w-full min-w-0 max-w-full">
            <header>
                <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-white text-[20px]">
                    💸💸Recommendations💸💸
                </h2>
            </header>
            <div className="flex items-start justify-center gap-3 self-stretch flex-wrap min-w-0 max-w-full">
                {recommendationCards.length > 0 ? (
                    recommendationCards.map((card) => (
                        <RecommendationCard
                            key={card.id}
                            card={card}
                            onCardClick={handleGameClick}
                        />
                    ))
                ) : (
                    <div className="w-full flex flex-col items-center justify-center py-6 px-4">
                        <h3 className="[font-family:'Poppins',Helvetica] font-semibold text-white text-lg mb-2 text-center">
                            Gaming - Cash Coach Recommendation
                        </h3>
                        <p className="[font-family:'Poppins',Helvetica] font-normal text-gray-400 text-sm text-center">
                            No games available
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
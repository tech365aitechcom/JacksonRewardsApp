"use client";
import React, { useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchGamesBySection } from "@/lib/redux/slice/gameSlice";
// Removed getAgeGroupFromProfile and getGenderFromProfile - now passing user object directly

const MostPlayedGames = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        gamesBySection,
        gamesBySectionStatus,
        error
    } = useSelector((state) => state.games);

    // Get data for "Most Played" section specifically
    const sectionName = "Most Played";
    const mostPlayedGames = gamesBySection[sectionName] || [];
    const mostPlayedStatus = gamesBySectionStatus[sectionName] || "idle";

    const { details: userProfile } = useSelector((state) => state.profile);

    // OPTIMIZED: Use section-specific games data
    const allGames = useMemo(() => {
        return mostPlayedGames;
    }, [mostPlayedGames]);

    // OPTIMIZED: Map games using besitosRawData for display
    const filteredGames = useMemo(() => {
        return allGames.map(game => {
            // Use besitosRawData if available, otherwise fallback to existing structure
            const rawData = game.besitosRawData || {};

            return {
                ...game,
                // Map from besitosRawData for display
                optimizedImage: rawData.square_image || rawData.image || game.details?.square_image || game.images?.icon,
                displayTitle: rawData.title || game.title || game.details?.name,
                displayAmount: rawData.amount ? `$${rawData.amount}` : (game.rewards?.coins ? `$${game.rewards.coins}` : '$0'),
                displayCategory: rawData.categories?.[0]?.name || game.details?.category,
                // Keep full game data including besitosRawData for details page
                fullGameData: game
            };
        });
    }, [allGames]);

    // OPTIMIZED: Reduced image preloading for faster initial render
    useEffect(() => {
        if (filteredGames.length > 0) {
            // Only preload first game for immediate display
            const firstGame = filteredGames[0];
            if (firstGame?.optimizedImage && firstGame.optimizedImage !== "/placeholder-game.png") {
                const img = new Image();
                img.src = firstGame.optimizedImage;
            }
        }
    }, [filteredGames]);

    // Memoize game click handler to prevent recreation on every render
    const handleGameClick = useCallback((game) => {
        // Clear Redux state BEFORE navigation to prevent showing old data
        dispatch({ type: 'games/clearCurrentGameDetails' });

        // Store full game data including besitosRawData in localStorage for details page
        if (game.fullGameData) {
            try {
                localStorage.setItem('selectedGameData', JSON.stringify(game.fullGameData));
            } catch (error) {
                // Failed to store game data - silently handle
            }
        }

        // Use 'id' field first (as expected by API), fallback to '_id'
        const gameId = game.id || game._id || game.gameId;
        router.push(`/gamedetails?gameId=${gameId}&source=mostPlayed`);
    }, [router, dispatch]);

    // STALE-WHILE-REVALIDATE: Always fetch - will use cache if available and fresh
    useEffect(() => {
        // Always dispatch - stale-while-revalidate will handle cache logic automatically
        // Pass user object directly - API will extract age and gender dynamically
        // This ensures:
        // 1. Shows cached data immediately if available (< 5 min old)
        // 2. Refreshes in background if cache is stale or 80% expired
        // 3. Fetches fresh if no cache exists
        dispatch(fetchGamesBySection({
            uiSection: sectionName,
            user: userProfile,
            page: 1,
            limit: 10
        }));
    }, [dispatch, sectionName, userProfile]);

    // Refresh games in background after showing cached data (to get admin updates)
    // Do this in background without blocking UI - show cached data immediately
    useEffect(() => {
        if (!userProfile) return;

        // Use setTimeout to refresh in background after showing cached data
        // This ensures smooth UX - cached data shows immediately, fresh data loads in background
        const refreshTimer = setTimeout(() => {
            dispatch(fetchGamesBySection({
                uiSection: sectionName,
                user: userProfile,
                page: 1,
                limit: 10,
                force: true,
                background: true
            }));
        }, 100); // Small delay to let cached data render first

        return () => clearTimeout(refreshTimer);
    }, [dispatch, sectionName, userProfile]);

    // Refresh games in background when app comes to foreground (admin might have updated)
    useEffect(() => {
        if (!userProfile) return;

        const handleFocus = () => {
            dispatch(fetchGamesBySection({
                uiSection: sectionName,
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
                    uiSection: sectionName,
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
    }, [dispatch, sectionName, userProfile]);

    // OPTIMIZED: Memoize localStorage operations to prevent unnecessary writes
    const handleStoreGamesData = useCallback((games) => {
        try {
            localStorage.setItem('featuredGamesData', JSON.stringify(games));
        } catch (error) {
            // Failed to store games data - silently handle
        }
    }, []);


    return (
        <div className="flex flex-col items-start gap-4 relative w-full animate-fade-in">
            <div className="flex w-full items-center justify-between">
                <div className="[font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
                    Most Played Games
                </div>
                <Link
                    href="/DownloadGame"
                    className="[font-family:'Poppins',Helvetica] font-medium text-[#8b92de] text-base tracking-[0] leading-[normal] hover:text-[#9ba0e8] transition-colors duration-200"
                    onClick={() => handleStoreGamesData(filteredGames.slice(0, 1))}
                >
                    See All
                </Link>
            </div>
            <div className="flex h-[110px] items-start gap-1 w-full justify-start">
                {filteredGames.length > 0 ? (
                    filteredGames.map((game, index) => {
                        return (
                            <div
                                key={game._id || game.id}
                                className="items-start inline-flex flex-col gap-1.5 relative flex-[0_0_auto] w-[80px] cursor-pointer hover:scale-105 transition-all duration-200"
                                onClick={() => handleGameClick(game)}
                            >
                                <div
                                    className="relative w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#983EFF] to-[#FFB700] p-[2.5px]"
                                    style={{
                                        boxShadow: `0 0 0 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.3), 0 0 8px #983EFF40`,
                                    }}
                                >
                                    <div className="w-full h-full rounded-full bg-black p-[1.8px]">
                                        <img
                                            className="w-full h-full object-cover rounded-full"
                                            alt={game.displayTitle || game.details?.name}
                                            src={game.optimizedImage || "/placeholder-game.png"}
                                            loading="eager"
                                            decoding="async"
                                            width="72"
                                            height="72"
                                            onError={(e) => {
                                                e.target.src = "/placeholder-game.png";
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="relative w-[72px] [font-family:'Poppins',Helvetica] font-medium text-white text-xs text-center tracking-[0] leading-4 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                                    {(game.displayTitle || game.details?.name || game.title || 'Game').split(' - ')[0]}
                                </div>

                                {/* New tag - only for first game */}
                                {/* {index < 1 && (
                                    <div className="absolute w-11 h-4 top-[59px] left-3.5 rounded overflow-hidden bg-[linear-gradient(90deg,rgba(34,197,94,1)_0%,rgba(16,185,129,1)_100%)]">
                                        <div className="absolute w-[33px] -top-px left-[5px] [font-family:'Poppins',Helvetica] font-semibold text-white text-xs text-center tracking-[0] leading-4 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                                            New
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        );
                    })
                ) : (
                    // Show empty state when no games available
                    <div className="flex flex-col items-center justify-center w-full py-4">
                        <h3 className="[font-family:'Poppins',Helvetica] font-semibold text-white text-lg mb-2">
                            Gaming - Most Played
                        </h3>
                        <p className="[font-family:'Poppins',Helvetica] font-normal text-gray-400 text-sm text-center">
                            No games available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MostPlayedGames;
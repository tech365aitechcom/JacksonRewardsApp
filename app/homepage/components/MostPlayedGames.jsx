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

    // Touch handling state for Android WebView
    const touchState = React.useRef({
        startX: 0,
        startY: 0,
        hasMoved: false,
        touchStartTime: 0,
        game: null
    });
    const scrollContainerRef = React.useRef(null);
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

    // OPTIMIZED: Map games using normalizer for both besitos and bitlab (coins + total XP from tasks)
    const filteredGames = useMemo(() => {
        const { normalizeGameImages, normalizeGameTitle, normalizeGameAmount, normalizeGameCategory, getTotalPromisedPoints } = require('@/lib/gameDataNormalizer');

        return allGames.map(game => {
            // Normalize game data for both besitos and bitlab
            const images = normalizeGameImages(game);
            const title = normalizeGameTitle(game);
            const amount = normalizeGameAmount(game);
            const coinVal = game.rewards?.coins ?? game.rewards?.gold ?? amount;
            const raw = typeof coinVal === 'number' ? coinVal : (typeof coinVal === 'string' ? parseFloat(String(coinVal).replace('$', '')) || 0 : 0);
            const displayCoins = Number.isFinite(raw) ? (raw === Math.round(raw) ? Math.round(raw) : Math.round(raw * 100) / 100) : 0;
            const { totalXP } = getTotalPromisedPoints(game);
            const displayXP = Number.isFinite(totalXP) ? Math.round(totalXP) : 0;
            const category = normalizeGameCategory(game);

            // Get optimized image - ensure we have a valid URL (not empty string)
            const getOptimizedImage = () => {
                const candidates = [
                    images.square_image,
                    images.icon,
                    game.details?.square_image,
                    game.images?.icon,
                    game.images?.square_image,
                    game.square_image,
                    game.image
                ];

                // Find first valid non-empty URL
                for (const candidate of candidates) {
                    if (candidate && typeof candidate === 'string' && candidate.trim() !== '' && candidate !== 'null' && candidate !== 'undefined') {
                        return candidate;
                    }
                }
                return null; // Return null instead of empty string to trigger placeholder
            };

            return {
                ...game,
                // Map from normalized data for display
                optimizedImage: getOptimizedImage(),
                displayTitle: title,
                displayAmount: displayCoins ? `$${displayCoins}` : '$0',
                displayCategory: category,
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
            if (firstGame?.optimizedImage && firstGame.optimizedImage && firstGame.optimizedImage.trim() !== '') {
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

        // Use provider gameId (BitLabs/Besitos) for get-game-by-id API; fallback to id/_id
        const gameId = game.gameId || game.details?.id || game.id || game._id;
        router.push(`/gamedetails?gameId=${gameId}&source=mostPlayed`);
    }, [router, dispatch]);

    // Passive touch listeners on scroll container so browser can scroll without waiting for JS; we only detect tap vs scroll for click
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const games = filteredGames;
        const onStart = (e) => {
            const card = e.target?.closest?.('[data-game-index]');
            if (!card) return;
            const index = parseInt(card.getAttribute('data-game-index'), 10);
            if (Number.isNaN(index) || index < 0 || index >= games.length) return;
            const t = e.touches[0];
            touchState.current = { startX: t.clientX, startY: t.clientY, hasMoved: false, touchStartTime: Date.now(), game: games[index] };
        };
        const onMove = (e) => {
            if (!touchState.current.game) return;
            const t = e.touches[0];
            const dx = Math.abs(t.clientX - touchState.current.startX);
            const dy = Math.abs(t.clientY - touchState.current.startY);
            if (dx > 10 || dy > 10) touchState.current.hasMoved = true;
        };
        const onEnd = () => {
            const { game, hasMoved, touchStartTime } = touchState.current;
            if (!hasMoved && Date.now() - touchStartTime < 200 && game) handleGameClick(game);
            touchState.current = { startX: 0, startY: 0, hasMoved: false, touchStartTime: 0, game: null };
        };
        el.addEventListener('touchstart', onStart, { passive: true });
        el.addEventListener('touchmove', onMove, { passive: true });
        el.addEventListener('touchend', onEnd, { passive: true });
        return () => {
            el.removeEventListener('touchstart', onStart);
            el.removeEventListener('touchmove', onMove);
            el.removeEventListener('touchend', onEnd);
        };
    }, [filteredGames, handleGameClick]);

    // Android WebView fallback: programmatic horizontal scroll when native scroll is blocked
    const androidScrollState = React.useRef({ lastX: 0, lastY: 0, scrolling: false });
    useEffect(() => {
        const isAndroid = typeof window !== "undefined" && (
            (window.Capacitor && window.Capacitor.getPlatform?.() === "android") ||
            /Android/i.test(navigator.userAgent || "")
        );
        if (!isAndroid) return;
        const el = scrollContainerRef.current;
        if (!el) return;
        const onStart = (e) => {
            if (!e.target?.closest?.(".most-played-games-scroll")) return;
            const t = e.touches[0];
            androidScrollState.current = { lastX: t.clientX, lastY: t.clientY, scrolling: false };
        };
        const onMove = (e) => {
            if (!e.target?.closest?.(".most-played-games-scroll")) return;
            const t = e.touches[0];
            const state = androidScrollState.current;
            const dx = Math.abs(t.clientX - state.lastX);
            const dy = Math.abs(t.clientY - state.lastY);
            if (!state.scrolling && (dx > 8 || dy > 8)) {
                state.scrolling = dx >= dy;
            }
            if (state.scrolling) {
                e.preventDefault();
                el.scrollLeft -= t.clientX - state.lastX;
            }
            state.lastX = t.clientX;
            state.lastY = t.clientY;
        };
        el.addEventListener("touchstart", onStart, { passive: true });
        el.addEventListener("touchmove", onMove, { passive: false });
        return () => {
            el.removeEventListener("touchstart", onStart);
            el.removeEventListener("touchmove", onMove);
        };
    }, []);

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
            {/* Scoped styles for smooth, fast horizontal scroll (web + Android WebView) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .most-played-games-scroll,
                    .most-played-games-scroll * {
                        touch-action: pan-x !important;
                    }
                    .most-played-games-scroll {
                        min-width: 0;
                        -webkit-overflow-scrolling: touch !important;
                        overflow-x: scroll !important;
                        overflow-y: hidden;
                        scroll-behavior: smooth;
                        scroll-snap-type: x proximity;
                        scroll-padding-inline: 0;
                        will-change: scroll-position;
                    }
                    .most-played-games-scroll > * {
                        scroll-snap-align: center;
                        scroll-snap-stop: normal;
                    }
                `
            }} />
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
            <div
                ref={scrollContainerRef}
                className="most-played-games-scroll flex h-[110px] min-w-0 items-start gap-1 w-full justify-start scrollbar-hide overscroll-x-contain"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                    scrollBehavior: 'smooth',
                }}
            >
                {filteredGames.length > 0 ? (
                    filteredGames.map((game, index) => {
                        return (
                            <div
                                key={game._id || game.id}
                                data-game-index={index}
                                className="items-start inline-flex flex-col gap-1.5 relative flex-shrink-0 w-[80px] cursor-pointer hover:scale-105 transition-all duration-200 snap-center touch-pan-x"
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
                                            src={game.optimizedImage || "https://c.animaapp.com/DfFsihWg/img/image-3930@2x.png"}
                                            loading="eager"
                                            decoding="async"
                                            width="72"
                                            height="72"
                                            onError={(e) => {
                                                // Fallback to a valid placeholder image
                                                if (e.target.src !== "https://c.animaapp.com/DfFsihWg/img/image-3930@2x.png") {
                                                    e.target.src = "https://c.animaapp.com/DfFsihWg/img/image-3930@2x.png";
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="relative w-[72px] [font-family:'Poppins',Helvetica] font-medium text-white text-xs text-center tracking-[0] leading-4 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                                    {(game.displayTitle || game.details?.name || game.title || 'Game').split(' - ')[0]}
                                </div>
                                <div className="flex items-center justify-center gap-1 text-[10px] text-white/80">
                                    <span>{game.displayAmount ?? '$0'}</span>
                                    <span>·</span>
                                    <span>{game.displayXP ?? 0} XP</span>
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
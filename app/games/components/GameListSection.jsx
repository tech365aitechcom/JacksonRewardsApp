"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchUserData, loadUserDataFromCache } from "@/lib/redux/slice/gameSlice";
import { safeLocalStorage } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import GameItemCard from "./GameItemCard";
import NonGamingOffersCarousel from "./NonGamingOffersCarousel";
import AccountOverviewCard from "./AccountOverviewCard";
import WatchAdCard from "./WatchAdCard";
import NonGameOffersSection from "../../homepage/components/NonGameOffersSection";


// Static data for non-gaming offers carousel
const nonGamingOffers = [
  {
    id: 1,
    name: "Albert- Mobile Banking",
    image: "https://c.animaapp.com/xCaMzUYh/img/image-3982@2x.png",
    bgImage: "https://c.animaapp.com/xCaMzUYh/img/rectangle-74@2x.png",
    bottomBg: "https://c.animaapp.com/xCaMzUYh/img/rectangle-76@2x.png",
    earnAmount: "Earn upto 100",
  },
  {
    id: 2,
    name: "Chime- Mobile Banking",
    image: "https://c.animaapp.com/xCaMzUYh/img/image-3980@2x.png",
    bgImage: "https://c.animaapp.com/xCaMzUYh/img/rectangle-73-1@2x.png",
    bottomBg: "https://c.animaapp.com/xCaMzUYh/img/rectangle-74-1@2x.png",
    earnAmount: "Earn upto 100",
  },
  {
    id: 3,
    name: "Albert- Mobile Banking",
    image: "https://c.animaapp.com/xCaMzUYh/img/image-3982@2x.png",
    bgImage: "https://c.animaapp.com/xCaMzUYh/img/rectangle-74@2x.png",
    bottomBg: "https://c.animaapp.com/xCaMzUYh/img/rectangle-76@2x.png",
    earnAmount: "Earn upto 100",
  },
];

// Use this custom hook to subscribe to Downloaded events (works in React Native WebView/Android too)
function useGameDownloadedRefetch(callback) {
  useEffect(() => {
    // In ANDROID or WebView, you should post a "game-downloaded" event after download.
    // For pure web fallback, listen to window event.
    // When download happens inside the app (e.g. download button), trigger window.dispatchEvent(new CustomEvent('game-downloaded'))
    function onGameDownloaded(e) {
      callback && callback(e);
    }

    window.addEventListener('game-downloaded', onGameDownloaded);

    // Listen for message events (for Android WebView):
    function onMessage(event) {
      if (
        typeof event.data === 'string' &&
        event.data.toLowerCase().includes('game-downloaded')
      ) {
        callback && callback({ type: "webview", data: event.data });
      }
    }
    window.addEventListener('message', onMessage);

    // In some Android web app glue code, you may have to listen for other bridge events.

    return () => {
      window.removeEventListener('game-downloaded', onGameDownloaded);
      window.removeEventListener('message', onMessage);
    }
  }, [callback]);
}


export const GameListSection = ({ searchQuery = "", showSearch = false }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useAuth();

  // Redux
  const { inProgressGames, userDataStatus, error } = useSelector((state) => state.games);

  // Client-side only state to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setHasNavigated(true); // Mark that user has navigated to this page
  }, []);

  // Helper to get userId
  const getUserId = () => {
    try {
      const userData = safeLocalStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const userId = user._id || user.id;
        return userId;
      }
    } catch (error) {
      // Error getting user ID from localStorage
    }
    return null;
  };

  // Refresh user data in background when app comes to foreground (admin might have updated)
  useEffect(() => {
    if (!isClient) return;

    const handleFocus = () => {
      const userId = getUserId();
      if (userId) {
        dispatch(fetchUserData({ userId, token, force: true, background: true }));
      }
    };

    window.addEventListener('focus', handleFocus);

    const handleVisibilityChange = () => {
      if (!document.hidden && isClient) {
        const userId = getUserId();
        if (userId) {
          dispatch(fetchUserData({ userId, token, force: true, background: true }));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isClient, dispatch, token]);

  // Track loading at download event
  const refreshingRef = useRef(false);

  // Load cached data from localStorage immediately for instant display
  useEffect(() => {
    if (!isClient) return;

    const userId = getUserId();
    if (!userId) return;

    // Load from localStorage cache immediately (before API call)
    try {
      const CACHE_KEY = `userData_${userId}`;
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const cacheAge = Date.now() - (parsed.timestamp || 0);
        const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

        // Load cache if it exists (even if stale - will refresh in background)
        if (parsed.data && cacheAge < CACHE_TTL * 2) { // Allow stale cache up to 10 minutes
          dispatch(loadUserDataFromCache({
            userData: parsed.data,
            timestamp: parsed.timestamp,
          }));
        }
      }
    } catch (err) {
      // Failed to load cache - continue to API fetch
    }
  }, [dispatch, isClient]);

  // Single data fetch on component mount - stale-while-revalidate handles caching
  // This fetches data once, showing cached data immediately if available
  // Redux slice automatically handles background refresh for stale cache
  useEffect(() => {
    if (!isClient) return;

    const userId = getUserId();
    if (userId) {
      // Fetch data - stale-while-revalidate will return cached data immediately if available
      // and refresh in background automatically
      dispatch(fetchUserData({ userId, token }));
    }
  }, [dispatch, isClient, token]);

  // Main fix: Listen to game download event - refetch without full refresh
  useGameDownloadedRefetch((event) => {
    const userId = getUserId();
    if (userId && userDataStatus !== 'loading') {
      refreshingRef.current = true;

      // Add retry logic for VPN connections
      const fetchWithRetry = async (retryCount = 0) => {
        try {
          await dispatch(fetchUserData({ userId, devicePlatform: "android" }));
        } catch (error) {
          if (retryCount < 3 && error.message.includes('timeout')) {
            setTimeout(() => fetchWithRetry(retryCount + 1), 2000);
          } else {
            // Failed to refresh after retries
          }
        }
      };

      fetchWithRetry();
    }
  });

  // Auto hide manual loading indicator after update
  useEffect(() => {
    if (refreshingRef.current && userDataStatus !== "loading") {
      refreshingRef.current = false;
    }
  }, [userDataStatus]);


  // Add retry mechanism for failed requests
  useEffect(() => {
    if (userDataStatus === "failed" && !refreshingRef.current) {
      const userId = getUserId();
      if (userId) {
        setTimeout(() => {
          dispatch(fetchUserData({ userId, token }));
        }, 2000); // Retry after 2 seconds
      }
    }
  }, [userDataStatus, dispatch]);


  // Re-map with safety check
  const downloadedGames = (inProgressGames && Array.isArray(inProgressGames) ? inProgressGames : []).map((game) => {
    const completedGoalsCount = game.goals?.filter(g => g.completed === true).length || 0;
    const totalGoals = game.goals?.length || 0;
    const earnedAmount = game.goals
      ?.filter(g => g.completed === true)
      .reduce((sum, goal) => sum + (goal.amount || 0), 0) || 0;
    const xpBonus = Math.floor(earnedAmount * 0.1);
    const category = game.categories?.[0]?.name || "Game";
    return {
      id: game.id,
      name: game.title,
      genre: category,
      subtitle: `${completedGoalsCount} of ${totalGoals} completed`,
      image: game.square_image || game.large_image || game.image,
      overlayImage: game.image || game.square_image,
      score: earnedAmount.toFixed(2),
      bonus: `+${xpBonus}`,
      coinIcon: "/dollor.png",
      picIcon: "/xp.svg",
      hasStatusDot: true,
      backgroundImage: game.large_image || game.image,
      isGradientBg: !game.square_image,
      fullData: game,
    };
  });

  // Navigation
  const handleDownloadedGameClick = (game) => {
    if (game && game.fullData) {
      // For downloaded games, we use localStorage (not API), so clear Redux state
      dispatch({ type: 'games/clearCurrentGameDetails' });

      // Store game data in localStorage for immediate access
      localStorage.setItem('selectedGameData', JSON.stringify(game.fullData));
      router.push(`/gamedetails?id=${game.id}`);
    }
  };

  // Search
  const filterGamesBySearch = (games, query) => {
    if (!query || query.trim() === "") return games;
    const searchTerm = query.toLowerCase().trim();
    return games.filter(game =>
      game.name.toLowerCase().includes(searchTerm) ||
      game.genre.toLowerCase().includes(searchTerm)
    );
  };

  const filteredDownloadedGames = filterGamesBySearch(downloadedGames, searchQuery);

  return (
    <div className={`flex flex-col w-full items-start gap-8 relative px-5 ${showSearch ? 'top-[180px]' : 'top-[96px]'}`}>
      {/* ==================== DOWNLOADED GAMES SECTION ==================== */}
      <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto] max-w-sm mx-auto">
        <div className="flex flex-col w-full items-start gap-4 relative flex-[0_0_auto]">
          <div className="relative flex-[0_0_auto]">
            <div className="relative w-fit [font-family:'Poppins',Helvetica] font-medium text-[#4bba56] text-base tracking-[0] leading-[normal]">
              {downloadedGames.length > 0 ? "Downloaded" : "Downloaded Games"}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full items-start gap-2.5 px-0 py-2.5 relative flex-[0_0_auto] overflow-y-scroll">
          {/* REMOVED: Loading state for better Android UX - show content immediately */}
          {userDataStatus === "failed" ? (
            <div className="text-red-400 text-center py-4 w-full">
              <p>Failed to load games</p>
              <p className="text-sm text-gray-400 mt-1">Check your internet connection</p>
              <button
                onClick={() => {
                  const userId = getUserId();
                  if (userId) {
                    dispatch(fetchUserData({ userId, token }));
                  } else {
                    // Cannot retry - no userId found
                  }
                }}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : downloadedGames.length > 0 ? (
            filteredDownloadedGames.length > 0 ? (
              filteredDownloadedGames.map((game) => (
                <GameItemCard
                  key={game.id}
                  game={game}
                  isEmpty={false}
                  onClick={() => handleDownloadedGameClick(game)}
                />
              ))
            ) : (
              <div className="text-white text-md text-center py-4 w-full">
                No games found matching your search
              </div>
            )
          ) : (
            <div className="text-white text-center py-4 w-full">
              <GameItemCard isEmpty={true} />
              <p className="mt-4 text-sm text-gray-400">No games downloaded yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ==================== ACCOUNT OVERVIEW SECTION ==================== */}
      <AccountOverviewCard />

      {/* ==================== WATCH AD SECTION ==================== */}
      <WatchAdCard xpAmount={5} />

      <div className="-mt-6">
        <NonGameOffersSection />
      </div>


      {/* ==================== NON-GAMING OFFERS CAROUSEL SECTION ==================== */}
      {/* <NonGamingOffersCarousel offers={nonGamingOffers} /> */}

      {/* Extra spacing to ensure content isn't hidden behind navigation */}
      <div className="h-[6px]"></div>
    </div>
  );
};
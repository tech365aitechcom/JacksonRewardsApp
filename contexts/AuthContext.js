"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  login,
  signup,
  getProfile,
  getDailyRewardsWeek,
  getXPTierProgressBar,
} from "@/lib/api";
import useOnboardingStore from "@/stores/useOnboardingStore";
import { App } from "@capacitor/app";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  fetchProfileStats,
  fetchVipStatus,
  clearProfile,
  fetchHomeDashboard,
  fetchLocationHistory,
  fetchUserAchievements,
} from "@/lib/redux/slice/profileSlice";
import { fetchFinancialGoals } from "@/lib/redux/slice/cashCoachSlice";
import { fetchOnboardingOptions } from "@/lib/redux/slice/onboardingSlice";
import { fetchVipTiers } from "@/lib/redux/slice/vipSlice";
import {
  fetchWalletTransactions,
  fetchWalletScreen,
  fetchFullWalletTransactions,
} from "@/lib/redux/slice/walletTransactionsSlice";
import {
  fetchAccountOverview,
  clearAccountOverview,
} from "@/lib/redux/slice/accountOverviewSlice";
import {
  fetchUserData,
  clearGames,
  fetchGamesBySection,
} from "@/lib/redux/slice/gameSlice";
import { clearWalletTransactions } from "@/lib/redux/slice/walletTransactionsSlice";
import { store, persistor } from "@/lib/redux/store";
import {
  fetchCalendar as fetchDailyCalendar,
  fetchToday as fetchDailyToday,
  fetchBonusDays,
} from "@/lib/redux/slice/dailyChallengeSlice";
import {
  fetchSurveys,
  fetchNonGameOffers,
  clearSurveys,
  clearNonGameOffers,
} from "@/lib/redux/slice/surveysSlice";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

const PROTECTED_ROUTES = [
  "/homepage",
  "/myprofile",
  "/edit-profile",
  "/games",
  "/permissions",
  "/location",
];
const PUBLIC_ONLY_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/select-age",
  "/onboarding/select-gender",
  "/onboarding/game-preferences",
  "/onboarding/game-styles",
  "/onboarding/player-type",
  "/welcome",
];

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUserFlow, setIsNewUserFlow] = useState(false);

  // NEW: Get the Redux dispatch function and the current status of the profile fetch
  const dispatch = useDispatch();
  const { detailsStatus } = useSelector((state) => state.profile);
  const { status: onboardingStatus } = useSelector((state) => state.onboarding);
  const { status: walletTransactionsStatus, walletScreenStatus } = useSelector(
    (state) => state.walletTransactions
  );
  const { status: accountOverviewStatus } = useSelector(
    (state) => state.accountOverview
  );
  // Deep link listener useEffect - Handles both custom scheme and HTTPS deep links
  useEffect(() => {
    let listener = null;

    // Check if we're in a Capacitor environment
    if (typeof window !== "undefined" && window.Capacitor && App) {
      try {
        listener = App.addListener("appUrlOpen", (event) => {
          const urlString = event.url;

          let parsableUrl;
          let path;
          let token;

          // Handle custom URL scheme (com.jackson.app://)
          if (urlString.startsWith("com.jackson.app://")) {
            parsableUrl = new URL(
              urlString.replace("com.jackson.app://", "http://app/")
            );
            path = parsableUrl.pathname;
            token = parsableUrl.searchParams.get("token");
          }
          // Handle HTTPS deep links (Android App Links)
          else if (urlString.startsWith("https://")) {
            parsableUrl = new URL(urlString);
            path = parsableUrl.pathname;
            token = parsableUrl.searchParams.get("token");
          }

          // Process the deep link
          if (path && token) {
            if (path === "/reset-password") {
              router.push(`/reset-password?token=${token}`);
            } else if (path === "/auth/callback") {
              handleSocialAuthCallback(token).then((result) => {
                router.replace(result.ok ? "/location" : "/login");
              });
            }
          }
        });
      } catch (error) {
        console.warn(
          "App.addListener not available in this environment:",
          error
        );
      }
    }

    return () => {
      if (listener) {
        try {
          // Try different possible cleanup methods
          if (listener.remove && typeof listener.remove === "function") {
            listener.remove();
          } else if (
            listener.unsubscribe &&
            typeof listener.unsubscribe === "function"
          ) {
            listener.unsubscribe();
          } else if (
            listener.destroy &&
            typeof listener.destroy === "function"
          ) {
            listener.destroy();
          } else if (typeof listener === "function") {
            listener();
          }
        } catch (error) {
          console.warn("Error cleaning up listener:", error);
        }
      }
    };
  }, [router]);

  // MODIFIED: This effect now focuses only on loading the session from storage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("❌ Failed to load session from storage", error);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // OPTIMIZED: Smart data fetching with persistence awareness
  useEffect(() => {
    if (!token) return;

    // Get current state to check what data is already available
    const currentState = store.getState();
    const {
      detailsStatus,
      statsStatus,
      dashboardStatus,
      details,
      stats,
      dashboardData,
    } = currentState.profile;
    const { userDataStatus, userData, gamesBySection } = currentState.games;
    const { walletScreenStatus, walletScreen } =
      currentState.walletTransactions;
    const {
      calendarStatus: dailyCalendarStatus,
      todayStatus: dailyTodayStatus,
      bonusDaysStatus,
      bonusDays: bonusDaysData,
    } = currentState.dailyChallenge || {};

    // OPTIMIZED: Check if data exists and is valid before fetching
    // IMPORTANT: Check for data existence first, then status (persisted data may have status "idle")
    const hasProfileData = details && detailsStatus === "succeeded";
    const hasStatsData =
      (stats || dashboardData?.stats) && statsStatus === "succeeded";
    const hasUserData = userData && userDataStatus === "succeeded";
    // Check for walletScreen data existence (persisted data is available even if status is "idle")
    const hasWalletData = walletScreen && (walletScreenStatus === "succeeded" || walletScreenStatus === "idle");
    const hasGamesData = gamesBySection && gamesBySection.length > 0;
    const hasBonusDaysData = bonusDaysData && bonusDaysStatus === "succeeded";

    // PRIORITY 1: Only fetch essential data if not already loaded and valid
    if (!hasProfileData && detailsStatus === "idle") {
      dispatch(fetchUserProfile(token));
    }

    // REMOVED: Wallet screen fetch - handled in handleAuthSuccess to avoid duplicate fetches
    // This prevents multiple simultaneous wallet fetches during login which causes UI delays

    if (user && user._id && !hasUserData && userDataStatus === "idle") {
      dispatch(
        fetchUserData({
          userId: user._id,
          token: token,
        })
      );
    }

    // NEW: Prefetch Daily Challenge data early for instant page load
    // Only trigger if not already loading/succeeded to avoid duplicate requests
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    if (dailyCalendarStatus === "idle") {
      dispatch(
        fetchDailyCalendar({
          year,
          month,
          token,
        })
      );
    }
    if (dailyTodayStatus === "idle") {
      dispatch(
        fetchDailyToday({
          token,
        })
      );
    }
    if (bonusDaysStatus === "idle") {
      dispatch(fetchBonusDays({ token }));
    }

    // PRIORITY 2: Defer heavy data fetching to prevent app slowdown
    // Only fetch if not already loaded or loading
    if (!hasStatsData && statsStatus === "idle") {
      setTimeout(() => {
        dispatch(fetchProfileStats(token));
      }, 100);
    }

    if (!hasStatsData && dashboardStatus === "idle") {
      setTimeout(() => {
        dispatch(fetchHomeDashboard(token));
      }, 100);
    }

    // PRIORITY 3: Load other heavy data after a longer delay - only if not already loaded
    setTimeout(() => {

      // Only fetch other heavy data if not already loaded
      dispatch(fetchAccountOverview()); // Account overview for games page
      dispatch(fetchVipStatus(token));
      dispatch(fetchFinancialGoals(token));
      dispatch(fetchVipTiers("US"));
      dispatch(fetchWalletTransactions({ token, limit: 5 }));
      dispatch(
        fetchFullWalletTransactions({
          token,
          page: 1,
          limit: 20,
          type: "all",
        })
      );
      dispatch(fetchLocationHistory(token));
      dispatch(
        fetchUserAchievements({
          token,
          category: "games",
          status: "completed",
        })
      );
    }, 500);
  }, [token, dispatch, user]);

  // Refresh profile and wallet when app comes to foreground (to get admin updates)
  useEffect(() => {
    if (!token) return;

    const handleFocus = () => {
      dispatch(fetchUserProfile({ token, force: true }));
      dispatch(fetchVipStatus(token));
      // Also refresh wallet/balance/XP when app comes to foreground
      dispatch(fetchWalletScreen({ token, force: true }));
      dispatch(fetchProfileStats({ token, force: true }));
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [token, dispatch]);

  // useEffect(() => {
  //   // Only fetch if we haven't fetched before
  //   if (onboardingStatus === "idle") {
  //     console.log("🚀 [Onboarding] Preloading all onboarding options...");
  //     dispatch(fetchOnboardingOptions("age_range"));
  //     dispatch(fetchOnboardingOptions("gender"));
  //     dispatch(fetchOnboardingOptions("game_preferences"));
  //     dispatch(fetchOnboardingOptions("game_style"));
  //     dispatch(fetchOnboardingOptions("dealy_game"));
  //   }
  // }, [dispatch, onboardingStatus]);

  // Gatekeeper logic for routing (No changes needed here)
  useEffect(() => {
    if (isLoading) return;
    if (pathname === "/") return;

    // ✅ FIX: Skip gatekeeper during NEW USER onboarding flow
    if (isNewUserFlow) return;

    // Skip gatekeeper logic during auth callback to prevent redirect loop
    if (pathname === "/auth/callback") return;

    const isAuthenticated = !!user;
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );
    const isPublicOnlyRoute = PUBLIC_ONLY_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // SIMPLE FLOW FOR ANDROID APP:
    // If user is logged in and visits any public-only route (login, signup, welcome, etc.),
    // always send them straight to the homepage, regardless of permissions/location/biometric flags.
    if (isAuthenticated && isPublicOnlyRoute) {
      router.replace("/homepage");
      return;
    }

    if (!isAuthenticated && isProtectedRoute) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isProtectedRoute && isNewUserFlow) {
      setIsNewUserFlow(false);
    }
  }, [isLoading, user, pathname, router, isNewUserFlow]);

  // Hardware back button handler for Capacitor - prevents logout on back navigation
  useEffect(() => {
    let backButtonListener = null;

    // Check if we're in a Capacitor environment
    if (typeof window !== "undefined" && window.Capacitor && App) {
      try {
        backButtonListener = App.addListener("backButton", ({ canGoBack }) => {
          // Always check authentication from localStorage first (most reliable)
          const storedToken = localStorage.getItem("authToken");
          const storedUser = localStorage.getItem("user");
          const isAuthenticated = !!storedToken && !!storedUser;

          if (!isAuthenticated) {
            // Not authenticated - allow default behavior (go to login)
            App.exitApp();
            return;
          }

          // User is authenticated - handle navigation safely
          const currentPath = window.location.pathname;
          const isHomepage = currentPath === "/homepage" || currentPath === "/";
          const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
            currentPath.startsWith(route)
          );

          // Check if we can go back in browser history
          const hasHistory = window.history.length > 1;

          if (hasHistory && !isHomepage) {
            // Has history and not on homepage - navigate back
            router.back();
          } else if (isHomepage) {
            // On homepage with no history or can't go back - exit app
            App.exitApp();
          } else if (isProtectedRoute) {
            // On protected route with no history - go to homepage instead of login
            router.push("/homepage");
          } else {
            // On public route - navigate to homepage
            router.push("/homepage");
          }
        });
      } catch (error) {
        console.warn("⚠️ Hardware back button listener not available:", error);
      }
    }

    return () => {
      if (backButtonListener) {
        try {
          if (
            backButtonListener.remove &&
            typeof backButtonListener.remove === "function"
          ) {
            backButtonListener.remove();
          } else if (
            backButtonListener.unsubscribe &&
            typeof backButtonListener.unsubscribe === "function"
          ) {
            backButtonListener.unsubscribe();
          }
        } catch (error) {
          console.warn("⚠️ Error cleaning up back button listener:", error);
        }
      }
    };
  }, [router, pathname]);

  // Prefetch Daily Rewards current week so data is ready on navigation
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    const prefetchDailyRewards = async () => {
      try {
        const existing = localStorage.getItem("daily_rewards_current_week");
        if (existing) {
          try {
            const parsed = JSON.parse(existing);
            if (
              parsed?.cacheTime &&
              Date.now() - parsed.cacheTime < 5 * 60 * 1000
            ) {
              return; // Fresh cache exists
            }
          } catch (_) {}
        }

        // Use centralized API function instead of hardcoded URL
        const data = await getDailyRewardsWeek(null, token);
        if (data?.success && data?.data) {
          const cacheData = { data: data.data, cacheTime: Date.now() };
          localStorage.setItem(
            "daily_rewards_current_week",
            JSON.stringify(cacheData)
          );
        }
      } catch (_) {
        // ignore prefetch errors
      }
    };
    prefetchDailyRewards();
    return () => controller.abort();
  }, [token]);

  const handleAuthSuccess = async (data) => {
    const { token, user } = data;

    setUser(user);
    setToken(token); // Setting the token here triggers the Redux fetch effect above

    // PRIORITY 1: Fetch wallet screen data FIRST (needed for RewardProgress and XPTierTracker)
    // This must happen before other dispatches to ensure data is available immediately
    // Dispatch synchronously to ensure it's the first in the Redux queue
    if (token) {
      dispatch(fetchWalletScreen({ token }));
    }

    // IMPORTANT: Store user data in Redux profile immediately after login
    // This ensures age and gender are available immediately for game fetching
    // without waiting for the profile API call
    if (user && (user.age || user.ageRange || user.gender || user._id)) {
      dispatch({
        type: "profile/setUserFromLogin",
        payload: user,
      });
    }

    // Preload games data immediately after successful login
    if (user && user._id) {
      // Fetch userData immediately (needed for downloaded games section)
      dispatch(
        fetchUserData({
          userId: user._id,
          token: token,
        })
      );

      // DEFERRED: Preload game sections AFTER first paint to prevent blocking
      // Components will show cached data if available, or fetch their own if needed
      // This prevents multiple heavy API calls from blocking the login -> homepage transition
      setTimeout(() => {
        // Preload "Most Played" section - used by MostPlayedGames component
        dispatch(
          fetchGamesBySection({
            uiSection: "Most Played",
            user: user, // Pass user object directly for age/gender extraction
            page: 1,
            limit: 10,
            token: token,
          })
        );

        // Preload "Swipe" section - used by GameCard component
        dispatch(
          fetchGamesBySection({
            uiSection: "Swipe",
            user: user, // Pass user object directly for age/gender extraction
            page: 1,
            limit: 10,
            token: token,
          })
        );
      }, 200); // Defer by 200ms to allow homepage to render first
    }

    // Preload XP tier progress bar data immediately after successful login/signup
    // This pre-populates the cache so the homepage shows data instantly
    // OPTIMIZED: Wait for this to complete before allowing navigation for better UX
    if (token) {
      try {
        const response = await getXPTierProgressBar(token);
        if (response.success && response.data) {
          // Cache the data immediately
          const CACHE_KEY = "xpTierProgressBar";
          const cacheData = {
            data: response.data,
            timestamp: Date.now(),
          };
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
          } catch (err) {
            console.warn(
              "⚠️ [AuthContext] Failed to cache XP tier data:",
              err
            );
          }
        }
      } catch (err) {
        console.error(
          "❌ [AuthContext] Failed to preload XP tier data (non-blocking):",
          err
        );
        // Don't fail auth if this fails - it's just a preload
      }
    }

    // DEFERRED: Preload surveys and non-game offers AFTER first paint
    // This prevents blocking the critical login -> homepage transition
    // Components will fetch their own data if not available, but this preloads in background
    if (token) {
      setTimeout(() => {
        // Preload surveys - used by SurveysSection component
        dispatch(fetchSurveys({ token }));

        // Preload non-game offers (cashback_shopping) - used by NonGameOffersSection component
        dispatch(fetchNonGameOffers({ token, offerType: "cashback_shopping" }));
      }, 300); // Defer by 300ms to allow homepage to render first
    }

    try {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token);
    } catch (err) {
      console.error("❌ Failed to save to localStorage", err);
    }
    return { ok: true, user };
  };

  const signIn = async (emailOrMobile, password, turnstileToken = null) => {
    try {
      const data = await login(emailOrMobile, password, turnstileToken);
      localStorage.setItem("permissionsAccepted", "true");
      // Purge persisted state to avoid showing previous account balances
      try {
        localStorage.removeItem("persist:root");
        localStorage.removeItem("persist:walletTransactions");
        localStorage.removeItem("persist:profile");
        localStorage.removeItem("persist:accountOverview");
      } catch (_) {}
      // Clear Redux slices proactively
      dispatch(clearWalletTransactions());
      dispatch(clearProfile());
      dispatch(clearAccountOverview());

      // Save credentials for biometric login (following capacitor-native-biometric documentation)
      // Only save if on native platform
      if (
        typeof window !== "undefined" &&
        window.Capacitor &&
        window.Capacitor.isNativePlatform()
      ) {
        try {
          const {
            setCredentials,
            enableBiometricLocally,
            checkBiometricAvailability,
          } = await import("@/lib/biometricAuth");

          // Check if biometric is available before saving
          const availability = await checkBiometricAvailability();
          if (availability.isAvailable) {
            // IMPORTANT: Check if we're logging in with a different account
            // If so, we need to delete old credentials first to avoid conflicts
            try {
              const { Preferences } = await import("@capacitor/preferences");
              const storedUsername = await Preferences.get({ key: "biometric_username" });
              
              // If there's a stored username and it's different from current login, delete old credentials
              if (storedUsername?.value && storedUsername.value !== emailOrMobile) {
                console.log("🔄 [AuthContext] Different user detected, deleting old biometric credentials...");
                console.log("🔄 [AuthContext] Old username:", storedUsername.value);
                console.log("🔄 [AuthContext] New username:", emailOrMobile);
                
                const { deleteCredentials } = await import("@/lib/biometricAuth");
                const deleteResult = await deleteCredentials();
                
                if (deleteResult.success) {
                  console.log("✅ [AuthContext] Old credentials deleted successfully");
                } else {
                  console.warn("⚠️ [AuthContext] Failed to delete old credentials:", deleteResult.error);
                  // Continue anyway - setCredentials will overwrite if possible
                }
              }
            } catch (prefError) {
              console.warn("⚠️ [AuthContext] Could not check stored username:", prefError);
              // Continue anyway - try to save new credentials
            }

            // First, check if there are pending credentials from face verification
            // These might have failed to save due to UserNotAuthenticatedException
            const pendingCredentials = localStorage.getItem("biometricCredentialsPending");
            const pendingCredentialsData = localStorage.getItem("biometricCredentialsData");
            
            let credentialResult = null;
            
            if (pendingCredentials === "true" && pendingCredentialsData) {
              try {
                console.log("🔄 [AuthContext] Retrying to save pending biometric credentials...");
                const credentialsData = JSON.parse(pendingCredentialsData);
                
                // Check if pending credentials match current user
                if (credentialsData.username === emailOrMobile) {
                  credentialResult = await setCredentials({
                    username: credentialsData.username,
                    password: credentialsData.password,
                  });

                  if (credentialResult.success) {
                    console.log("✅ [AuthContext] Pending credentials saved successfully!");
                    // Clear pending flags
                    localStorage.removeItem("biometricCredentialsPending");
                    localStorage.removeItem("biometricCredentialsData");
                    
                    // Get biometric type from localStorage (set during face verification)
                    const biometricType = localStorage.getItem("biometricType") || availability.biometryTypeName;
                    enableBiometricLocally(biometricType);
                  } else {
                    console.warn(
                      "⚠️ [AuthContext] Failed to save pending credentials:",
                      credentialResult.error
                    );
                    // If still fails, fall through to normal credential saving
                  }
                } else {
                  console.log("🔄 [AuthContext] Pending credentials are for a different user, clearing them...");
                  localStorage.removeItem("biometricCredentialsPending");
                  localStorage.removeItem("biometricCredentialsData");
                  // Fall through to normal credential saving
                }
              } catch (parseError) {
                console.error("❌ [AuthContext] Error parsing pending credentials:", parseError);
                // Clear invalid pending credentials
                localStorage.removeItem("biometricCredentialsPending");
                localStorage.removeItem("biometricCredentialsData");
                // Fall through to normal credential saving
              }
            }

            // If pending credentials weren't saved or don't exist, save current credentials
            if (!credentialResult || !credentialResult.success) {
              console.log("💾 [AuthContext] Saving biometric credentials for current login...");
              // Save credentials securely using native biometric storage
              // Store username and a JSON string containing token and user data
              // This way we don't rely on localStorage for user data during biometric login
              const credentialPayload = {
                token: data.token,
                user: data.user,
              };

              credentialResult = await setCredentials({
                username: emailOrMobile,
                password: JSON.stringify(credentialPayload), // Store token + user as JSON
              });

              if (credentialResult.success) {
                // Enable biometric locally
                enableBiometricLocally(availability.biometryTypeName);
                // Clear any pending credentials flags since we successfully saved new ones
                localStorage.removeItem("biometricCredentialsPending");
                localStorage.removeItem("biometricCredentialsData");
                
                // Update stored username in Preferences
                try {
                  const { Preferences } = await import("@capacitor/preferences");
                  await Preferences.set({
                    key: "biometric_username",
                    value: emailOrMobile
                  });
                  console.log("✅ [AuthContext] Updated biometric username in Preferences");
                } catch (prefError) {
                  console.warn("⚠️ [AuthContext] Failed to update username in Preferences:", prefError);
                }
              } else {
                console.warn(
                  "⚠️ [AuthContext] Failed to save biometric credentials:",
                  credentialResult.error
                );
                console.warn(
                  "⚠️ [AuthContext] Error code:",
                  credentialResult.errorCode
                );
                
                // If device authentication is required, store credentials for retry
                if (credentialResult.requiresDeviceAuth) {
                  console.warn("⚠️ [AuthContext] Device authentication required - credentials will be saved on next login");
                  localStorage.setItem("biometricCredentialsPending", "true");
                  localStorage.setItem("biometricCredentialsData", JSON.stringify({
                    username: emailOrMobile,
                    password: JSON.stringify(credentialPayload),
                  }));
                }
              }
            }
          }
        } catch (biometricError) {
          console.error(
            "❌ [AuthContext] Error setting up biometric:",
            biometricError
          );
          // Don't fail login if biometric setup fails
        }
      }

      return handleAuthSuccess(data);
    } catch (error) {
      return { ok: false, error: error.body || { error: error.message } };
    }
  };

  const signUpAndSignIn = async (signupData) => {
    try {
      const data = await signup(signupData);
      useOnboardingStore.getState().resetOnboarding();
      setIsNewUserFlow(true);

      // Clear permission/location flags for new signups so they go through the flow
      localStorage.removeItem("permissionsAccepted");
      localStorage.removeItem("onboardingComplete");
      localStorage.removeItem("locationCompleted");
      localStorage.removeItem("faceVerificationCompleted");
      localStorage.removeItem("faceVerificationSkipped");

      // DON'T save biometric credentials here for new users
      // New users will go through: Permissions → Location → Face Verification
      // Biometric credentials will be saved AFTER face verification is complete
      // This ensures proper onboarding flow

      // return handleAuthSuccess(data);
      const result = await handleAuthSuccess(data);
      // 🔥 FETCH ONBOARDING OPTIONS ONCE (RIGHT HERE)
      await Promise.all([
        dispatch(fetchOnboardingOptions("age_range")),
        dispatch(fetchOnboardingOptions("gender")),
        dispatch(fetchOnboardingOptions("game_preferences")),
        dispatch(fetchOnboardingOptions("game_style")),
        dispatch(fetchOnboardingOptions("dealy_game")),
      ]);

      router.replace("/select-age"); // or first onboarding route

      return result;
    } catch (error) {
      return { ok: false, error: error.body || { error: error.message } };
    }
  };

  // MODIFIED: signOut clears the profile state in the Redux store but KEEPS biometric credentials
  // Biometric credentials are preserved so users can login with biometric after signout
  const signOut = async () => {
    // Clear all Redux state first
    dispatch(clearProfile()); // Clear profile data
    dispatch(clearGames()); // Clear games data (includes userData, gamesBySection, imageCache, etc.)
    dispatch(clearWalletTransactions()); // Clear wallet transactions
    dispatch(clearAccountOverview()); // Clear account overview
    dispatch(clearSurveys()); // Clear surveys data
    dispatch(clearNonGameOffers()); // Clear non-game offers data
    
    // Purge all Redux persist data to prevent QuotaExceededError
    // Use persistor.purge() which properly handles cleanup without serialization issues
    try {
      await persistor.purge();
    } catch (err) {
      console.error("❌ Failed to purge persistor:", err);
    }
    
    setUser(null);
    setToken(null);

    // DON'T delete biometric credentials on signout
    // This allows users to use biometric login after signout without needing to login manually first
    // Biometric credentials are stored in native secure storage and remain available

    try {
      // Clear authentication data
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("onboarding-storage");
      
      // Clear ALL Redux persist keys (pattern-based to catch all)
      // This prevents QuotaExceededError by ensuring all persist data is removed
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("persist:")) {
          localStorage.removeItem(key);
        }
      });

      // Don't clear permission/location flags on logout
      // Existing users should be able to login without re-doing permissions
      // Only new signups will clear these flags

      // Don't clear biometric flags (biometricEnabled, biometricType) on logout
      // Biometric credentials are preserved in native secure storage
      // This allows users to use biometric login after signout without manual login

      // Clear daily rewards data from localStorage
      // Remove all daily rewards cache entries
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("daily_rewards_")) {
          localStorage.removeItem(key);
        }
      });

      // Clear quest timer data from localStorage
      // Remove all quest timer cache entries
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("questTimer_")) {
          localStorage.removeItem(key);
        }
      });

      // Clear user data cache (userData_${userId})
      // Remove all user data cache entries to prevent showing previous user's data
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("userData_")) {
          localStorage.removeItem(key);
        }
      });

      // Clear XP tier progress bar cache
      localStorage.removeItem("xpTierProgressBar");
      localStorage.removeItem("xpTierProgressBarRace");

      // Clear game-related cache data
      localStorage.removeItem("featuredGamesData");
      localStorage.removeItem("selectedGameData");
      localStorage.removeItem("gameCard_undoCount");
      localStorage.removeItem("gameCard_swipeHistory");
      localStorage.removeItem("gamePreferences");
      localStorage.removeItem("lastBoosterAdWatched");

      // Clear countdown timer cache
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("countdownTimer") || key === "countdownTimer") {
          localStorage.removeItem(key);
        }
      });

      // Clear session manager data
      localStorage.removeItem("jackson_rewards_sessions");

      // Clear face verification user-specific data (but keep biometric flags)
      localStorage.removeItem("cameraFacePhotoPath");
      localStorage.removeItem("cameraFacePhoto");
      localStorage.removeItem("faceVerificationSkipped");
      // Note: biometricToken, biometricUser, biometric_username, biometric_password are preserved
      // for biometric login functionality
    } catch (err) {
      console.error("❌ Failed to clear localStorage", err);
    }
    router.push("/login");
  };

  // MODIFIED: This function now leverages our Redux thunk for cleaner logic
  const handleSocialAuthCallback = async (socialToken) => {
    setIsLoading(true);

    try {
      // 1. Fetch User Profile
      const resultAction = await dispatch(fetchUserProfile(socialToken));

      if (fetchUserProfile.fulfilled.match(resultAction)) {
        const userProfile = resultAction.payload;

        // --- FETCH USER STATUS (Disclosure/Location) ---
        let statusData = { needsDisclosure: true, needsLocation: true }; // Safe defaults

        try {
          const statusRes = await fetch(
            "https://rewardsapi.hireagent.co/api/location/status",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${socialToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const rawText = await statusRes.text();

          try {
            const statusJson = JSON.parse(rawText);

            if (statusJson.success) {
              statusData = statusJson.data;
            }
          } catch (_) {
            // Silent JSON parse failure
          }
        } catch (_) {
          // Silent network/CORS failure
        }
        // ----------------------------------------------------

        // 2. Handle Auth Success (Save to state/Redux)
        const authResult = await handleAuthSuccess({
          token: socialToken,
          user: userProfile.data?.user || userProfile.user || userProfile,
        });

        return {
          ...authResult,
          statusData,
        };
      } else {
        throw new Error(
          resultAction.payload || "Social auth profile fetch failed"
        );
      }
    } catch (error) {
      return { ok: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserInContext = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUpAndSignIn,
    signOut,
    updateUserInContext,
    handleSocialAuthCallback,
    refreshSession: handleAuthSuccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

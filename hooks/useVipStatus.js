import { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchVipStatus } from "@/lib/redux/slice/profileSlice";

/**
 * Custom hook for managing VIP status across the application
 * Automatically fetches VIP status when needed and provides refresh functionality
 */
export const useVipStatus = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token);
  const { vipStatus, vipStatusState } = useSelector((state) => state.profile);

  // Auto-fetch VIP status when token is available and status is idle
  useEffect(() => {
    if (token && vipStatusState === "idle") {
      console.log("🔄 [useVipStatus] Auto-fetching VIP status...");
      dispatch(fetchVipStatus(token));
    }
  }, [dispatch, token, vipStatusState]);

  // Memoized refresh VIP status function
  const refreshVipStatus = useCallback(() => {
    if (token) {
      console.log("🔄 [useVipStatus] Manually refreshing VIP status...");
      dispatch(fetchVipStatus(token));
    }
  }, [token, dispatch]);

  // Memoized force refresh VIP status (bypasses idle check)
  const forceRefreshVipStatus = useCallback(() => {
    if (token) {
      console.log("🔄 [useVipStatus] Force refreshing VIP status...");
      dispatch(fetchVipStatus(token));
    }
  }, [token, dispatch]);

  // Check if VIP is active
  const isVipActive =
    vipStatus?.data?.isActive &&
    vipStatus?.data?.currentTier &&
    vipStatus?.data?.currentTier !== "Free";

  // Get current tier
  const currentTier = vipStatus?.data?.currentTier;

  // Get formatted tier name
  const formattedTierName = currentTier
    ? currentTier.charAt(0).toUpperCase() + currentTier.slice(1).toLowerCase()
    : "VIP";

  return {
    vipStatus,
    vipStatusState,
    isVipActive,
    currentTier,
    formattedTierName,
    refreshVipStatus,
    forceRefreshVipStatus,
    isLoading: vipStatusState === "loading",
    hasError: vipStatusState === "failed",
  };
};

/**
 * Hook for pages that need VIP status refresh on focus/visibility
 * Uses debouncing to prevent multiple refresh calls from firing simultaneously
 */
export const useVipStatusWithRefresh = () => {
  const vipStatusHook = useVipStatus();
  const token = useSelector((state) => state.auth?.token);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // Debounced refresh to prevent multiple simultaneous calls
    const debouncedRefresh = () => {
      // Clear any pending refresh
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Schedule refresh after debounce delay (500ms)
      debounceTimerRef.current = setTimeout(() => {
        if (token) {
          console.log(
            "🔄 [useVipStatusWithRefresh] Refreshing VIP status (debounced)..."
          );
          vipStatusHook.refreshVipStatus();
        }
      }, 500);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && token) {
        console.log(
          "🔄 [useVipStatusWithRefresh] Page became visible..."
        );
        debouncedRefresh();
      }
    };

    const handleFocus = () => {
      if (token) {
        console.log(
          "🔄 [useVipStatusWithRefresh] Page focused..."
        );
        debouncedRefresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);

      // Clear any pending debounced refresh
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [token, vipStatusHook.refreshVipStatus]);

  return vipStatusHook;
};

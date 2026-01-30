import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProfile,
  getProfileStats,
  getVipStatus,
  getHomeDashboard,
  updateProfile as apiUpdateProfile,
  getLocationHistory,
  getUserAchievements,
} from "@/lib/api";

const initialState = {
  details: null,
  stats: null,
  vipStatus: null,
  dashboardData: null,
  locationHistory: null,
  achievements: [],
  detailsStatus: "idle",
  statsStatus: "idle",
  vipStatusState: "idle",
  dashboardStatus: "idle",
  locationStatus: "idle",
  achievementsStatus: "idle",
  error: null,
  // STALE-WHILE-REVALIDATE: Cache timestamps for balance and XP
  statsCacheTimestamp: null,
  statsCacheTTL: 5 * 60 * 1000, // 5 minutes in milliseconds
};

export const fetchHomeDashboard = createAsyncThunk(
  "profile/fetchHomeDashboard",
  async (token, { rejectWithValue }) => {
    try {
      return await getHomeDashboard(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//Fetch user's main profile details
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (tokenOrParams, { rejectWithValue }) => {
    try {
      // Support both: fetchUserProfile(token) and fetchUserProfile({ token, force: true })
      const token =
        typeof tokenOrParams === "string"
          ? tokenOrParams
          : tokenOrParams?.token || tokenOrParams;

      return await getProfile(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user's stats (earnings, XP, etc.) with stale-while-revalidate
export const fetchProfileStats = createAsyncThunk(
  "profile/fetchProfileStats",
  async (
    { token, force = false, background = false } = {},
    { rejectWithValue, getState }
  ) => {
    try {
      // STALE-WHILE-REVALIDATE: Check cache if not forcing refresh
      if (!force && !background) {
        const state = getState();
        const cachedStats = state.profile.stats;
        const cacheTimestamp = state.profile.statsCacheTimestamp;
        const cacheTTL = state.profile.statsCacheTTL;

        if (cachedStats && cacheTimestamp) {
          const cacheAge = Date.now() - cacheTimestamp;

          // If cache is fresh (< 5 minutes), return cached data immediately
          if (cacheAge < cacheTTL) {
            // Trigger background refresh if cache is 80% expired (4 minutes)
            if (cacheAge > cacheTTL * 0.8) {
              setTimeout(() => {
                const { store } = require("@/lib/redux/store");
                store.dispatch(
                  fetchProfileStats({
                    token,
                    background: true,
                  })
                );
              }, 0);
            }

            return {
              ...cachedStats,
              fromCache: true,
              cacheAge,
            };
          }

          // Cache is stale but exists - return it and refresh in background
          // Trigger background refresh immediately
          setTimeout(() => {
            const { store } = require("@/lib/redux/store");
            store.dispatch(
              fetchProfileStats({
                token,
                background: true,
              })
            );
          }, 0);

          // Return stale cache immediately (stale-while-revalidate pattern)
          return {
            ...cachedStats,
            fromCache: true,
            cacheAge,
            stale: true,
          };
        }
      }

      // Fetch fresh data from API
      const response = await getProfileStats(token);
      return {
        ...response,
        fromCache: false,
        timestamp: Date.now(),
        background,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  Fetch user's VIP status
export const fetchVipStatus = createAsyncThunk(
  "profile/fetchVipStatus",
  async (token, { rejectWithValue }) => {
    try {
      return await getVipStatus(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  Handle updating the user profile
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async ({ profileData, token }, { dispatch, getState, rejectWithValue }) => {
    try {
      await apiUpdateProfile(profileData, token);
      const currentState = getState();
      const currentProfile = currentState.profile.details;
      return {
        ...currentProfile,
        ...profileData,
        profile: {
          ...currentProfile?.profile,
          ...profileData,
        },
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user's location history
export const fetchLocationHistory = createAsyncThunk(
  "profile/fetchLocationHistory",
  async (token, { rejectWithValue }) => {
    try {
      return await getLocationHistory(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user's achievements
export const fetchUserAchievements = createAsyncThunk(
  "profile/fetchUserAchievements",
  async (
    { token, category = "games", status = "completed" },
    { rejectWithValue }
  ) => {
    try {
      return await getUserAchievements(token, category, status);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE DEFINITION ---
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.details = null;
      state.dashboardData = null;
      state.stats = null;
      state.vipStatus = null;
      state.locationHistory = null;
      state.achievements = [];
      state.detailsStatus = "idle";
      state.statsStatus = "idle";
      state.vipStatusState = "idle";
      state.dashboardStatus = "idle";
      state.locationStatus = "idle";
      state.achievementsStatus = "idle";
      state.error = null;
      // Clear cache timestamps
      state.statsCacheTimestamp = null;
    },
    // Store user data from login response immediately
    // This allows components to use age/gender right away without waiting for profile API
    setUserFromLogin: (state, action) => {
      const user = action.payload;
      // Only update if user has valid data and current details is null or error
      const isErrorObject =
        user &&
        typeof user === "object" &&
        (user.success === false || user.error);
      if (user && typeof user === "object" && !isErrorObject) {
        // Merge with existing details if available, otherwise set as new
        const existingIsError =
          state.details &&
          typeof state.details === "object" &&
          (state.details.success === false || state.details.error);
        if (
          state.details &&
          typeof state.details === "object" &&
          !existingIsError
        ) {
          // Merge login data with existing profile data
          state.details = { ...state.details, ...user };
        } else {
          // Set login user data as details (will be updated when profile API succeeds)
          state.details = user;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeDashboard.pending, (state) => {
        state.dashboardStatus = "loading";
      })
      .addCase(fetchHomeDashboard.fulfilled, (state, action) => {
        state.dashboardStatus = "succeeded";
        state.dashboardData = action.payload;
      })

      // Reducers for fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.detailsStatus = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        // Don't store error objects in details - check if response is an error
        const payload = action.payload;
        const isErrorObject =
          payload &&
          typeof payload === "object" &&
          (payload.success === false || payload.error);

        if (isErrorObject) {
          // Treat error objects as failed requests
          state.detailsStatus = "failed";
          state.error = payload.error || "Failed to fetch profile";
          // Don't update details - keep existing or null
        } else {
          state.detailsStatus = "succeeded";
          state.details = payload;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.detailsStatus = "failed";
        state.error = action.payload;
        // Don't clear details if we have cached data
      })

      //  Reducers for fetchProfileStats with stale-while-revalidate
      .addCase(fetchProfileStats.pending, (state, action) => {
        const isBackground = action.meta.arg?.background || false;

        // IMPORTANT: Background refreshes do NOT set loading status
        // This ensures UI doesn't show loading spinners during background refresh
        if (!isBackground) {
          state.statsStatus = "loading";
        }
        // Background refreshes keep existing status (don't change it)
        state.error = null;
      })
      .addCase(fetchProfileStats.fulfilled, (state, action) => {
        const isBackground = action.meta.arg?.background || false;
        const fromCache = action.payload.fromCache || false;

        // Only update stats if not from cache (fresh data)
        if (!fromCache) {
          // Remove cache metadata before storing
          const {
            fromCache: _,
            cacheAge: __,
            stale: ___,
            timestamp: ____,
            background: _____,
            ...statsData
          } = action.payload;
          state.stats = statsData;
          state.statsCacheTimestamp = Date.now();
        }

        // IMPORTANT: Background refreshes do NOT update status
        // This prevents UI from showing loading states during background refresh
        if (!isBackground) {
          state.statsStatus = "succeeded";
        }
        // Background refreshes: status stays as "succeeded" (or whatever it was)
      })
      .addCase(fetchProfileStats.rejected, (state, action) => {
        const isBackground = action.meta.arg?.background || false;

        // Only update status if not background refresh
        if (!isBackground) {
          state.statsStatus = "failed";
          state.error = action.payload;
        }
        // Background refresh errors are silent (don't change status)
      })

      //  Reducers for fetchVipStatus
      .addCase(fetchVipStatus.pending, (state) => {
        state.vipStatusState = "loading";
      })
      .addCase(fetchVipStatus.fulfilled, (state, action) => {
        state.vipStatusState = "succeeded";
        state.vipStatus = action.payload;
      })
      .addCase(fetchVipStatus.rejected, (state, action) => {
        state.vipStatusState = "failed";
        state.error = action.payload;
      })

      //Reducers for updateUserProfile (optional, for handling saving state)
      .addCase(updateUserProfile.pending, (state) => {})
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.details = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Reducers for fetchLocationHistory
      .addCase(fetchLocationHistory.pending, (state) => {
        state.locationStatus = "loading";
      })
      .addCase(fetchLocationHistory.fulfilled, (state, action) => {
        state.locationStatus = "succeeded";
        state.locationHistory = action.payload;
      })
      .addCase(fetchLocationHistory.rejected, (state, action) => {
        state.locationStatus = "failed";
        state.error = action.payload;
      })

      // Reducers for fetchUserAchievements
      .addCase(fetchUserAchievements.pending, (state) => {
        state.achievementsStatus = "loading";
      })
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.achievementsStatus = "succeeded";
        state.achievements = action.payload.data?.achievements || [];
      })
      .addCase(fetchUserAchievements.rejected, (state, action) => {
        state.achievementsStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;

export default profileSlice.reducer;

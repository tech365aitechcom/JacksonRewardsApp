import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL ="https://rewardsapi.hireagent.co";

// Initial state for account overview
const initialState = {
  data: {
    user: {
      name: "",
      avatar: null,
      tier: "beginner",
      vipLevel: "free",
    },
    totalEarnings: {
      coins: 0,
      xp: 0,
    },
    progress: {
      gamesPlayed: { current: 0, target: 0, percentage: 0, isCompleted: false },
      coinsEarned: { current: 0, target: 0, percentage: 0, isCompleted: false },
      challengesCompleted: {
        current: 0,
        target: 0,
        percentage: 0,
        isCompleted: false,
      },
    },
    rewardBadges: [],
    recentAchievements: [],
    streak: { current: 0, lastUpdated: null },
    badges: [],
    userGoals: {
      gamesPlayed: 0,
      coinsEarned: 0,
      challengesCompleted: 0,
    },
    userProfile: {},
  },
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastFetched: null,
};

// Async thunk to fetch account overview
export const fetchAccountOverview = createAsyncThunk(
  "accountOverview/fetchAccountOverview",
  async (_, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("x-auth-token");

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(`${BASE_URL}/api/account-overview`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch account overview"
        );
      }

      const data = await response.json();

      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update progress
export const updateAccountProgress = createAsyncThunk(
  "accountOverview/updateAccountProgress",
  async ({ activityType, progressData }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("x-auth-token");

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(
        `${BASE_URL}/api/account-overview/update-progress`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activityType,
            progressData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update progress");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to claim reward
export const claimAccountReward = createAsyncThunk(
  "accountOverview/claimAccountReward",
  async ({ milestoneType }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("x-auth-token");

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(
        `${BASE_URL}/api/account-overview/claim-reward`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ milestoneType }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to claim reward");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Account Overview Slice
const accountOverviewSlice = createSlice({
  name: "accountOverview",
  initialState,
  reducers: {
    clearAccountOverview: (state) => {
      state.data = initialState.data;
      state.status = "idle";
      state.error = null;
      state.lastFetched = null;
    },
    updateLocalProgress: (state, action) => {
      const { activityType, progressData } = action.payload;

      // Update local state immediately for better UX
      if (activityType === "game") {
        state.data.progress.gamesPlayed.current += 1;
        state.data.progress.gamesPlayed.percentage =
          (state.data.progress.gamesPlayed.current /
            state.data.progress.gamesPlayed.target) *
          100;
      } else if (activityType === "coin") {
        state.data.progress.coinsEarned.current += progressData.amount || 0;
        state.data.progress.coinsEarned.percentage =
          (state.data.progress.coinsEarned.current /
            state.data.progress.coinsEarned.target) *
          100;
        state.data.totalEarnings.coins += progressData.amount || 0;
      } else if (activityType === "challenge") {
        state.data.progress.challengesCompleted.current += 1;
        state.data.progress.challengesCompleted.percentage =
          (state.data.progress.challengesCompleted.current /
            state.data.progress.challengesCompleted.target) *
          100;
      }
    },
    updateTotalEarnings: (state, action) => {
      const { coins, xp } = action.payload;
      state.data.totalEarnings.coins += coins || 0;
      state.data.totalEarnings.xp += xp || 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Account Overview
      .addCase(fetchAccountOverview.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAccountOverview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAccountOverview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Progress
      .addCase(updateAccountProgress.pending, (state) => {
        // Keep current state, just update in background
      })
      .addCase(updateAccountProgress.fulfilled, (state, action) => {
        // Optionally update local state with server response
        if (action.payload) {
          // Update with server response if needed
        }
      })
      .addCase(updateAccountProgress.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Claim Reward
      .addCase(claimAccountReward.pending, (state) => {
        // Keep current state
      })
      .addCase(claimAccountReward.fulfilled, (state, action) => {
        // Update total earnings with claimed reward
        if (action.payload.reward) {
          state.data.totalEarnings.coins += action.payload.reward.coins || 0;
          state.data.totalEarnings.xp += action.payload.reward.xp || 0;
        }

        // Mark reward as claimed
        const badgeIndex = state.data.rewardBadges.findIndex(
          (badge) => badge.type === action.payload.milestoneType
        );
        if (badgeIndex !== -1) {
          state.data.rewardBadges[badgeIndex].isClaimed = true;
        }
      })
      .addCase(claimAccountReward.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearAccountOverview,
  updateLocalProgress,
  updateTotalEarnings,
} = accountOverviewSlice.actions;

export default accountOverviewSlice.reducer;

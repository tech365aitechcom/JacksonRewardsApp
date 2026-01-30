import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getBitlabsSurveys, 
  getAllNonGameOffers, 
  getCashbackOffers, 
  getShoppingOffers, 
  getMagicReceipts 
} from "@/lib/api";

const initialState = {
  surveys: [],
  nonGameOffers: [], // Cashback, Shopping, Magic Receipts
  status: "idle", // idle | loading | succeeded | failed
  nonGameOffersStatus: "idle",
  error: null,
  nonGameOffersError: null,
  // STALE-WHILE-REVALIDATE: Cache timestamps for surveys
  cacheTimestamp: null,
  nonGameOffersCacheTimestamp: null,
  cacheTTL: 90 * 1000, // 90 seconds in milliseconds
};

// Fetch Bitlabs surveys with stale-while-revalidate pattern
export const fetchSurveys = createAsyncThunk(
  "surveys/fetchSurveys",
  async (
    { token, force = false, background = false, params = {} } = {},
    { rejectWithValue, getState }
  ) => {
    try {
      // STALE-WHILE-REVALIDATE: Check cache if not forcing refresh
      if (!force && !background) {
        const state = getState();
        const cachedSurveys = state.surveys.surveys;
        const cacheTimestamp = state.surveys.cacheTimestamp;
        const cacheTTL = state.surveys.cacheTTL;

        if (cachedSurveys && cachedSurveys.length > 0 && cacheTimestamp) {
          const cacheAge = Date.now() - cacheTimestamp;

          // If cache is fresh (< 90 seconds), return cached data immediately
          if (cacheAge < cacheTTL) {
            // Trigger background refresh if cache is 80% expired (72 seconds)
            if (cacheAge > cacheTTL * 0.8) {
              setTimeout(() => {
                const { store } = require("@/lib/redux/store");
                store.dispatch(
                  fetchSurveys({
                    token,
                    background: true,
                    params,
                  })
                );
              }, 0);
            }

            return {
              surveys: cachedSurveys,
              fromCache: true,
              cacheAge,
            };
          }

          // Cache is stale but exists - return it and refresh in background
          // Trigger background refresh immediately
          setTimeout(() => {
            const { store } = require("@/lib/redux/store");
            store.dispatch(
              fetchSurveys({
                token,
                background: true,
                params,
              })
            );
          }, 0);

          // Return stale cache immediately (stale-while-revalidate pattern)
          return {
            surveys: cachedSurveys,
            fromCache: true,
            cacheAge,
            stale: true,
          };
        }
      }

      // Fetch fresh data from API
      const defaultParams = {
        category: "all",
        page: 1,
        limit: 3, // Only fetch top 3 surveys
        useAdminConfig: "true",
        ...params,
      };

      const response = await getBitlabsSurveys(defaultParams, token);

      if (response.success && response.data?.surveys) {
        // Only take the top 3 surveys
        const top3Surveys = response.data.surveys.slice(0, 3);
        return {
          surveys: top3Surveys,
          fromCache: false,
          timestamp: Date.now(),
          background,
        };
      } else {
        return {
          surveys: [],
          fromCache: false,
          timestamp: Date.now(),
          background,
        };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch non-game offers (cashback, shopping, magic receipts) with stale-while-revalidate pattern
export const fetchNonGameOffers = createAsyncThunk(
  "surveys/fetchNonGameOffers",
  async (
    { token, force = false, background = false, params = {}, offerType = "all" } = {},
    { rejectWithValue, getState }
  ) => {
    try {
      // STALE-WHILE-REVALIDATE: Check cache if not forcing refresh
      if (!force && !background) {
        const state = getState();
        const cachedOffers = state.surveys.nonGameOffers;
        const cacheTimestamp = state.surveys.nonGameOffersCacheTimestamp;
        const cacheTTL = state.surveys.cacheTTL;

        if (cachedOffers && cachedOffers.length > 0 && cacheTimestamp) {
          const cacheAge = Date.now() - cacheTimestamp;

          // If cache is fresh (< 90 seconds), return cached data immediately
          if (cacheAge < cacheTTL) {
            // Trigger background refresh if cache is 80% expired (72 seconds)
            if (cacheAge > cacheTTL * 0.8) {
              setTimeout(() => {
                const { store } = require("@/lib/redux/store");
                store.dispatch(
                  fetchNonGameOffers({
                    token,
                    background: true,
                    params,
                    offerType,
                  })
                );
              }, 0);
            }

            return {
              offers: cachedOffers,
              fromCache: true,
              cacheAge,
            };
          }

          // Cache is stale but exists - return it and refresh in background
          // Trigger background refresh immediately
          setTimeout(() => {
            const { store } = require("@/lib/redux/store");
            store.dispatch(
              fetchNonGameOffers({
                token,
                background: true,
                params,
                offerType,
              })
            );
          }, 0);

          // Return stale cache immediately (stale-while-revalidate pattern)
          return {
            offers: cachedOffers,
            fromCache: true,
            cacheAge,
            stale: true,
          };
        }
      }

      // Fetch fresh data from API - fetch 2 cashback, 1 shopping, and 1 magic receipt
      const defaultParams = {
        category: "all",
        page: 1,
        useAdminConfig: "true",
        ...params,
      };

      // Handle different offer types
      if (offerType === "cashback_shopping" || offerType === "all") {
        // Fetch 2 cashback and 1 shopping in parallel (magic receipt commented out for now)
        const [cashbackResponse, shoppingResponse] = await Promise.all([
          getCashbackOffers({ ...defaultParams, limit: 2 }, token),
          getShoppingOffers({ ...defaultParams, limit: 1 }, token),
          // getMagicReceipts({ ...defaultParams, limit: 1 }, token), // Commented out for now
        ]);

        // Extract offers from responses
        let offers = [];
        
        // Process cashback offers - limit to 2
        if (cashbackResponse.success && cashbackResponse.data) {
          if (cashbackResponse.data.offers && Array.isArray(cashbackResponse.data.offers)) {
            offers = [...offers, ...cashbackResponse.data.offers.slice(0, 2)];
          } else if (cashbackResponse.data.categorized?.cashback) {
            offers = [...offers, ...cashbackResponse.data.categorized.cashback.slice(0, 2)];
          }
        }

        // Process shopping offers - limit to 1
        if (shoppingResponse.success && shoppingResponse.data) {
          if (shoppingResponse.data.offers && Array.isArray(shoppingResponse.data.offers)) {
            offers = [...offers, ...shoppingResponse.data.offers.slice(0, 1)];
          } else if (shoppingResponse.data.categorized?.shopping) {
            offers = [...offers, ...shoppingResponse.data.categorized.shopping.slice(0, 1)];
          }
        }

        // Process magic receipt offers - COMMENTED OUT FOR NOW
        // if (magicReceiptResponse.success && magicReceiptResponse.data) {
        //   if (magicReceiptResponse.data.magicReceipts && Array.isArray(magicReceiptResponse.data.magicReceipts)) {
        //     offers = [...offers, ...magicReceiptResponse.data.magicReceipts.slice(0, 1)];
        //   } else if (magicReceiptResponse.data.offers && Array.isArray(magicReceiptResponse.data.offers)) {
        //     offers = [...offers, ...magicReceiptResponse.data.offers.slice(0, 1)];
        //   } else if (magicReceiptResponse.data.categorized?.magicReceipts) {
        //     offers = [...offers, ...magicReceiptResponse.data.categorized.magicReceipts.slice(0, 1)];
        //   }
        // }

        // Return combined offers (2 cashback + 1 shopping, already filtered by backend based on user's age/gender)
        return {
          offers: offers,
          fromCache: false,
          timestamp: Date.now(),
          background,
        };
      }

      // Handle individual offer types
      let response;
      if (offerType === "cashback") {
        response = await getCashbackOffers(defaultParams, token);
      } else if (offerType === "shopping") {
        response = await getShoppingOffers(defaultParams, token);
      } else if (offerType === "magic_receipt") {
        response = await getMagicReceipts(defaultParams, token);
      } else {
        response = await getAllNonGameOffers({ ...defaultParams, type: "all" }, token);
      }

      // Extract offers from response based on type
      let offers = [];
      if (response.success && response.data) {
        if (offerType === "magic_receipt" && response.data.magicReceipts) {
          offers = response.data.magicReceipts;
        } else if (response.data.offers && Array.isArray(response.data.offers)) {
          offers = response.data.offers;
        } else if (response.data.categorized) {
          offers = [
            ...(response.data.categorized.cashback || []),
            ...(response.data.categorized.shopping || []),
            ...(response.data.categorized.magicReceipts || []),
          ];
        }
      }

      return {
        offers: offers,
        fromCache: false,
        timestamp: Date.now(),
        background,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE DEFINITION ---
const surveysSlice = createSlice({
  name: "surveys",
  initialState,
  reducers: {
    clearSurveys: (state) => {
      state.surveys = [];
      state.status = "idle";
      state.error = null;
      state.cacheTimestamp = null;
    },
    clearNonGameOffers: (state) => {
      state.nonGameOffers = [];
      state.nonGameOffersStatus = "idle";
      state.nonGameOffersError = null;
      state.nonGameOffersCacheTimestamp = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurveys.pending, (state, action) => {
        const isBackground = action.meta.arg?.background || false;

        // IMPORTANT: Background refreshes do NOT set loading status
        // This ensures UI doesn't show loading spinners during background refresh
        if (!isBackground) {
          state.status = "loading";
        }
        // Background refreshes keep existing status (don't change it)
        state.error = null;
      })
      .addCase(fetchSurveys.fulfilled, (state, action) => {
        const isBackground = action.meta.arg?.background || false;
        const fromCache = action.payload.fromCache || false;

        // Only update surveys if not from cache (fresh data)
        if (!fromCache) {
          // Remove cache metadata before storing
          const {
            fromCache: _,
            cacheAge: __,
            stale: ___,
            timestamp: ____,
            background: _____,
            ...surveysData
          } = action.payload;
          state.surveys = surveysData.surveys || [];
          state.cacheTimestamp = Date.now();
        }

        // IMPORTANT: Background refreshes do NOT update status
        // This prevents UI from showing loading states during background refresh
        if (!isBackground) {
          state.status = "succeeded";
        }
        // Background refreshes: status stays as "succeeded" (or whatever it was)
      })
      .addCase(fetchSurveys.rejected, (state, action) => {
        const isBackground = action.meta.arg?.background || false;

        // Only update status if not background refresh
        if (!isBackground) {
          state.status = "failed";
          state.error = action.payload;
        }
        // Background refresh errors are silent (don't change status)
      })
      // Non-game offers reducers
      .addCase(fetchNonGameOffers.pending, (state, action) => {
        const isBackground = action.meta.arg?.background || false;

        if (!isBackground) {
          state.nonGameOffersStatus = "loading";
        }
        state.nonGameOffersError = null;
      })
      .addCase(fetchNonGameOffers.fulfilled, (state, action) => {
        const isBackground = action.meta.arg?.background || false;
        const fromCache = action.payload.fromCache || false;

        if (!fromCache) {
          const {
            fromCache: _,
            cacheAge: __,
            stale: ___,
            timestamp: ____,
            background: _____,
            ...offersData
          } = action.payload;
          state.nonGameOffers = offersData.offers || [];
          state.nonGameOffersCacheTimestamp = Date.now();
        }

        if (!isBackground) {
          state.nonGameOffersStatus = "succeeded";
        }
      })
      .addCase(fetchNonGameOffers.rejected, (state, action) => {
        const isBackground = action.meta.arg?.background || false;

        if (!isBackground) {
          state.nonGameOffersStatus = "failed";
          state.nonGameOffersError = action.payload;
        }
      });
  },
});

export const { clearSurveys, clearNonGameOffers } = surveysSlice.actions;

export default surveysSlice.reducer;


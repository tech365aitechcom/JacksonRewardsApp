import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getVipTiers,
  initiateUpgrade,
  startPayment,
  confirmPayment as confirmPaymentApi,
} from "@/lib/api";

// Fetch VIP tiers and pricing
export const fetchVipTiers = createAsyncThunk(
  "vip/fetchTiers",
  async (region = "US", { rejectWithValue }) => {
    try {
      const response = await getVipTiers(region);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch VIP tiers");
    }
  }
);

// Initiate subscription flow and get payment intent
export const initiatePurchase = createAsyncThunk(
  "vip/initiatePurchase",
  async ({ tierId, plan, region, token }, { rejectWithValue }) => {
    try {
      // Step 1: Initiate upgrade to get subscriptionId
      const upgradeResponse = await initiateUpgrade(
        { tierId, plan, region },
        token
      );

      // Check if the response indicates user already has active subscription
      if (
        typeof upgradeResponse.data === "string" &&
        upgradeResponse.data.includes("already has an active VIP subscription")
      ) {
        throw new Error(upgradeResponse.data);
      }

      const {
        subscriptionId,
        paymentIntentId,
        tierId: responseTierId,
        plan: responsePlan,
        amount,
        currency,
      } = upgradeResponse.data;

      if (!subscriptionId) {
        throw new Error("Subscription ID not received.");
      }

      // Validate pricing data
      if (!amount || amount <= 0) {
        throw new Error(`Invalid amount received: ${amount}`);
      }
      if (!currency) {
        throw new Error(`Invalid currency received: ${currency}`);
      }
      if (!responseTierId) {
        throw new Error(`Invalid tierId received: ${responseTierId}`);
      }
      if (!responsePlan) {
        throw new Error(`Invalid plan received: ${responsePlan}`);
      }

      // Step 2: Get Stripe client secret for payment
      const paymentData = {
        subscriptionId,
        paymentMethod: "card",
      };

      const paymentResponse = await startPayment(paymentData, token);
      const { clientSecret, paymentIntentId: responsePaymentIntentId } =
        paymentResponse.data;

      // Check if we have a proper Stripe client secret
      const isProperClientSecret =
        clientSecret && clientSecret.includes("_secret_");
      const isPaymentIntentId = clientSecret && clientSecret.startsWith("pi_");

      // Handle PaymentIntent ID instead of client secret (for mock backend)
      let finalClientSecret = clientSecret;
      if (isPaymentIntentId && !isProperClientSecret) {
        finalClientSecret = `${clientSecret}_secret_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
      }

      // Use finalClientSecret if available, otherwise use paymentIntentId
      finalClientSecret = finalClientSecret || responsePaymentIntentId;
      if (!finalClientSecret) {
        throw new Error("Stripe client secret not received.");
      }

      return {
        subscriptionId,
        clientSecret: finalClientSecret,
        tierId: responseTierId,
        plan: responsePlan,
        amount: amount,
        currency: currency,
      };
    } catch (error) {
      const errorMessage =
        error.body?.message ||
        error.message ||
        "Subscription initiation failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Confirm payment after Stripe checkout is complete
export const confirmPayment = createAsyncThunk(
  "vip/confirmPayment",
  async ({ paymentIntentId, subscriptionId, token }, { rejectWithValue }) => {
    try {
      // Validate parameters before making API call
      if (!paymentIntentId) {
        throw new Error("Payment Intent ID is required");
      }
      if (!subscriptionId) {
        throw new Error("Subscription ID is required");
      }
      if (!token) {
        throw new Error("Authentication token is required");
      }

      const response = await confirmPaymentApi(
        { paymentIntentId, subscriptionId },
        token
      );

      return response.data;
    } catch (error) {

      const errorMessage =
        error.body?.message || error.message || "Payment confirmation failed";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  tiers: [],
  region: "US",
  currency: "USD",
  symbol: "$",
  status: "idle",
  error: null,
  purchaseStatus: "idle", // idle | loading | awaiting_payment | succeeded | failed
  purchaseError: null,
  activeSubscriptionId: null,
  paymentClientSecret: null,
  modalLocked: false,
};

const vipSlice = createSlice({
  name: "vip",
  initialState,
  reducers: {
    resetPurchaseStatus: (state) => {
      state.purchaseStatus = "idle";
      state.purchaseError = null;
      state.activeSubscriptionId = null;
      state.paymentClientSecret = null;
      state.modalLocked = false;
    },
    setPurchaseStatus: (state, action) => {
      state.purchaseStatus = action.payload.status;
      state.purchaseError = action.payload.error || null;
      if (action.payload.status !== "succeeded") {
        state.activeSubscriptionId = null;
        state.paymentClientSecret = null;
      }
    },
    lockModal: (state) => {
      state.modalLocked = true;
    },
    unlockModal: (state) => {
      state.modalLocked = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVipTiers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVipTiers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tiers = action.payload.tiers.sort((a, b) => a.order - b.order);
        state.region = action.payload.region;
        state.currency = action.payload.currency;
        state.symbol = action.payload.symbol;
      })
      .addCase(fetchVipTiers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(initiatePurchase.pending, (state) => {
        state.purchaseStatus = "loading";
        state.purchaseError = null;
        state.paymentClientSecret = null;
      })
      .addCase(initiatePurchase.fulfilled, (state, action) => {
        state.purchaseStatus = "awaiting_payment";
        state.activeSubscriptionId = action.payload.subscriptionId;
        state.paymentClientSecret = action.payload.clientSecret;
      })
      .addCase(initiatePurchase.rejected, (state, action) => {
        state.purchaseStatus = "failed";
        state.purchaseError = action.payload;
      })
      .addCase(confirmPayment.pending, (state) => {
        state.purchaseStatus = "loading";
        state.purchaseError = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.purchaseStatus = "succeeded";
        state.purchaseError = null;
        state.activeSubscriptionId = null;
        state.paymentClientSecret = null;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.purchaseStatus = "failed";
        state.purchaseError = action.payload;
      });
  },
});

export const {
  resetPurchaseStatus,
  setPurchaseStatus,
  lockModal,
  unlockModal,
} = vipSlice.actions;
export default vipSlice.reducer;

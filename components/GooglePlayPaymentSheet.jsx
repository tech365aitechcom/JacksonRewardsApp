"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  confirmGooglePlayPayment,
  lockModal,
  unlockModal,
} from "@/lib/redux/slice/vipSlice";
import { purchaseSubscription } from "@/lib/googlePlayBilling";

export default function GooglePlayPaymentSheet({
  subscriptionId,
  googlePlayProductId,
  token,
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  // TEST MODE: skip product fetch — render the button immediately
  useEffect(() => {
    setIsInitializing(false);
  }, []);

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);
    dispatch(lockModal());

    try {
      // Launch the Google Play purchase flow
      const { purchaseToken, productId, orderId } = await purchaseSubscription(
        googlePlayProductId
      );

      // Confirm with backend
      const result = await dispatch(
        confirmGooglePlayPayment({
          subscriptionId,
          purchaseToken,
          productId,
          orderId,
          token,
        })
      );

      if (result.type && result.type.endsWith("/rejected")) {
        throw new Error(result.payload || "Payment confirmation failed");
      }

      if (onPaymentSuccess) {
        onPaymentSuccess({ purchaseToken, productId, orderId });
      }
    } catch (err) {
      console.error("[GooglePlayPaymentSheet] Purchase error:", JSON.stringify(err), "code:", err?.code, "message:", err?.message);

      const msg = err?.message || "";
      const code = err?.code;

      // User cancelled (code 1)
      const isCancelled =
        code === 1 || code === "1" ||
        msg.toLowerCase().includes("cancel") ||
        msg.toLowerCase().includes("user_cancelled");

      // Product not found in Play Console yet (code 4)
      const isItemUnavailable =
        code === 4 || code === "4" ||
        msg.toLowerCase().includes("item_unavailable") ||
        msg.toLowerCase().includes("item unavailable") ||
        msg.toLowerCase().includes("not available");

      if (isCancelled) {
        if (onPaymentCancel) onPaymentCancel();
      } else if (isItemUnavailable) {
        setError("Product not found in Google Play. Product IDs need to be created in Play Console first.");
      } else {
        setError(`Purchase failed (code: ${code || "unknown"}): ${msg || "Please try again."}`);
        if (onPaymentError) onPaymentError(err);
      }
    } finally {
      setIsLoading(false);
      dispatch(unlockModal());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-white/20 rounded-xl p-6 max-w-sm w-full">
        <div className="text-center">
          {/* Google Play icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            {isLoading || isInitializing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <svg
                className="w-8 h-8"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.2 2.4L27.6 22.8L7.2 43.2C6.48 42.72 6 41.88 6 41.04V4.56C6 3.72 6.48 2.88 7.2 2.4Z"
                  fill="#00BCD4"
                />
                <path
                  d="M36 24L27.6 32.4L7.2 43.2L33.12 30.24L36 24Z"
                  fill="#F44336"
                />
                <path
                  d="M36 24L33.12 17.76L7.2 4.8L27.6 15.6L36 24Z"
                  fill="#4CAF50"
                />
                <path
                  d="M42 20.4C43.2 21.12 44.4 22.44 44.4 24C44.4 25.56 43.44 26.88 42 27.6L36 24L42 20.4Z"
                  fill="#FFC107"
                />
              </svg>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            {isInitializing
              ? "Loading..."
              : isLoading
              ? "Processing..."
              : "Subscribe with Google Play"}
          </h3>

          {error ? (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            !isInitializing && !isLoading && (
              <p className="text-gray-300 text-sm mb-6">
                Your subscription will be billed via Google Play
              </p>
            )
          )}

          {!isInitializing && !isLoading && (
            <button
              onClick={handlePurchase}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Subscribe Now
            </button>
          )}

          {!isLoading && (
            <button
              onClick={onPaymentCancel}
              className="w-full mt-3 px-6 py-2 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          )}

          <p className="text-xs text-gray-400 mt-4">
            Secured by{" "}
            <span className="font-semibold">Google Play</span>
          </p>
        </div>
      </div>
    </div>
  );
}

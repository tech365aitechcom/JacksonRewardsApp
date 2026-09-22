"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Stripe } from "@capacitor-community/stripe";
import {
    resetPurchaseStatus,
    lockModal,
    unlockModal,
} from "@/lib/redux/slice/vipSlice";

export default function StripePaymentSheet({
    clientSecret,
    paymentIntentId,
    onPaymentSuccess,
    onPaymentError,
    onPaymentCancel,
}) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize Stripe with publishable key
    useEffect(() => {
        const initializeStripe = async () => {
            try {
                // Check if we're on mobile (Capacitor) or web
                const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

                if (isMobile && typeof Stripe !== 'undefined' && Stripe.initialize) {
                    // Mobile: Use Capacitor Stripe plugin
                    // According to official docs, use initialize() instead of setPublishableKey()

                    try {
                        const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
                        if (!stripePublishableKey) {
                            throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Please add it to your .env file.");
                        }
                        await Stripe.initialize({
                            publishableKey: stripePublishableKey
                        });

                    } catch (initError) {
                        console.error("[StripePaymentSheet] Stripe initialization failed");
                        console.error("[StripePaymentSheet] Error details");
                        // This is critical for mobile, so set error
                        if (isMobile) {
                            setError("Failed to initialize payment service. Please restart the app.");
                        }
                    }
                } else {
                    // Web: Skip Stripe initialization for now, will use redirect approach

                }
            } catch (error) {
                console.error("[StripePaymentSheet] Failed to initialize Stripe");
                // Don't set error for web, just log it
                if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    setError("Failed to initialize payment service");
                }
            }
        };

        initializeStripe();
    }, []);

    const handlePayment = async () => {

        setIsLoading(true);
        setError(null);
        dispatch(lockModal());

        try {
            // Validate client secret
            if (!clientSecret) {
                throw new Error("No payment information available");
            }

            // Check if we're on mobile or web
            const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (isMobile && typeof Stripe !== 'undefined' && Stripe.createPaymentSheet) {
                // Mobile: Use Capacitor Stripe plugin

                // Simplify config - remove optional features that might cause issues
                const paymentSheetConfig = {
                    paymentIntentClientSecret: clientSecret,
                    merchantDisplayName: "Jackson Rewards",
                    // Removed: allowsDelayedPaymentMethods (might cause Google Pay issues)
                    // Removed: appearance customization (might cause rendering issues)
                };

                try {
                    const createResult = await Stripe.createPaymentSheet(paymentSheetConfig);

                } catch (createError) {
                    console.error("[StripePaymentSheet] createPaymentSheet threw error");
                    console.error("[StripePaymentSheet] Error type");
                    console.error("[StripePaymentSheet] Error keys");
                    console.error("[StripePaymentSheet] Error JSON");
                    console.error("[StripePaymentSheet] Error message");
                    console.error("[StripePaymentSheet] Error code");

                    // Rethrow with more details
                    throw new Error(`Failed to create payment sheet: ${createError.message || 'Unknown error'}`);
                }

                let result;
                try {
                    result = await Stripe.presentPaymentSheet();
                } catch (presentError) {
                    console.error("[StripePaymentSheet] presentPaymentSheet threw error");
                    console.error("[StripePaymentSheet] Error type");
                    console.error("[StripePaymentSheet] Error keys");
                    console.error("[StripePaymentSheet] Error JSON");

                    // Rethrow to be caught by outer try-catch
                    throw new Error(presentError.message || "Failed to present payment sheet");
                }

                // Handle payment result according to Stripe's official documentation
                // Result can be: "completed", "paymentSheetCompleted", "failed", "canceled", "paymentSheetFailed"

                if (result.paymentResult === "completed" || result.paymentResult === "paymentSheetCompleted") {

                    const paymentIntentId = clientSecret.split("_secret_")[0];

                    if (onPaymentSuccess) {
                        onPaymentSuccess(paymentIntentId);
                    }
                } else if (result.paymentResult === "failed") {

                    // Try to get more detailed error information
                    const errorDetails = result.error || {};
                    console.error("[StripePaymentSheet] Payment failure details");

                    let errorMessage = "Payment failed. Please try again.";

                    // Provide specific error messages based on error type
                    if (errorDetails.message) {
                        if (errorDetails.message.includes("card_declined")) {
                            errorMessage = "Your card was declined. Please try a different card.";
                        } else if (errorDetails.message.includes("insufficient_funds")) {
                            errorMessage = "Insufficient funds. Please try a different card.";
                        } else if (errorDetails.message.includes("expired_card")) {
                            errorMessage = "Your card has expired. Please use a different card.";
                        } else if (errorDetails.message.includes("incorrect_cvc")) {
                            errorMessage = "Incorrect CVC code. Please check your card details.";
                        } else {
                            errorMessage = `Payment failed: ${errorDetails.message}`;
                        }
                    }

                    setError(errorMessage);
                    if (onPaymentError) {
                        onPaymentError(new Error(errorMessage));
                    }
                } else if (result.paymentResult === "canceled") {

                    if (onPaymentCancel) {
                        onPaymentCancel();
                    }
                } else if (result.paymentResult === "paymentSheetFailed") {
                    console.error("[StripePaymentSheet] Payment sheet failed to load or display");
                    console.error("[StripePaymentSheet] This usually indicates a configuration issue");
                    console.error("[StripePaymentSheet] Error details");

                    // Provide more specific error message
                    const errorMessage = result.error?.message || "Payment system could not be loaded. Please check your internet connection and try again.";

                    setError(errorMessage);
                    if (onPaymentError) {
                        onPaymentError(new Error(errorMessage));
                    }
                } else {
                    console.warn("[StripePaymentSheet] Unknown payment result");
                    console.warn("[StripePaymentSheet] Expected values: 'completed', 'paymentSheetCompleted', 'failed', 'canceled', 'paymentSheetFailed'");
                    console.warn("[StripePaymentSheet] Actual value");
                    console.warn("[StripePaymentSheet] Full result object");
                    setError("Unexpected payment result. Please contact support.");
                }
            } else {
                // Web: Redirect to Stripe Checkout

                // For web, we'll redirect to a Stripe Checkout URL
                // This is a simplified approach for web browsers
                const stripeCheckoutUrl = `https://checkout.stripe.com/pay/${clientSecret}`;

                // Try to open in new window/tab
                const newWindow = window.open(stripeCheckoutUrl, '_blank', 'noopener,noreferrer');

                if (!newWindow) {
                    // If popup blocked, redirect current window
                    window.location.href = stripeCheckoutUrl;
                } else {
                    // Monitor the popup window
                    const checkClosed = setInterval(() => {
                        if (newWindow.closed) {
                            clearInterval(checkClosed);
                            // Payment completed (user closed window)

                            const paymentIntentId = clientSecret.split("_secret_")[0];
                            if (onPaymentSuccess) {
                                onPaymentSuccess(paymentIntentId);
                            }
                        }
                    }, 1000);
                }
            }

        } catch (error) {
            console.error("[StripePaymentSheet] Payment error");

            let errorMessage = "An unexpected error occurred. Please try again.";

            if (error.message) {
                if (error.message.includes("network")) {
                    errorMessage = "Network error. Please check your connection and try again.";
                } else if (error.message.includes("card")) {
                    errorMessage = "Card error. Please check your card details and try again.";
                } else if (error.message.includes("declined")) {
                    errorMessage = "Payment was declined. Please try a different card.";
                } else if (error.message.includes("expired")) {
                    errorMessage = "Card has expired. Please use a different card.";
                } else if (error.message.includes("insufficient")) {
                    errorMessage = "Insufficient funds. Please try a different card.";
                } else if (error.message.includes("cvc")) {
                    errorMessage = "Invalid CVC code. Please check your card details.";
                } else if (error.message.includes("postal")) {
                    errorMessage = "Invalid postal code. Please check your billing address.";
                } else if (error.message.includes("Stripe")) {
                    errorMessage = "Payment service error. Please try again in a few moments.";
                } else if (process.env.NODE_ENV === "development") {
                    errorMessage = `Error: ${error.message}`;
                }
            }

            setError(errorMessage);

            if (onPaymentError) {
                onPaymentError(error);
            }
        } finally {
            setIsLoading(false);
            dispatch(unlockModal());
        }
    };

    // Auto-trigger payment when component mounts with client secret
    useEffect(() => {
        if (clientSecret && !isLoading && !error) {

            handlePayment();
        }
    }, [clientSecret]);

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black border border-white/20 rounded-xl p-6 max-w-sm w-full">
                <div className="text-center">
                    {/* Loading Spinner */}
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        ) : (
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                        {isLoading ? "Processing Payment..." : "Secure Payment"}
                    </h3>

                    {error ? (
                        <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    ) : (
                        <p className="text-gray-300 text-sm mb-6">
                            {isLoading
                                ? "Please wait while we process your payment..."
                                : "Click below to complete your secure payment"
                            }
                        </p>
                    )}

                    {!isLoading && !error && (
                        <button
                            onClick={handlePayment}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Complete Payment
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
                        Secured by <span className="font-semibold">Stripe</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

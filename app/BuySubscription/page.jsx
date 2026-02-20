"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVipTiers, initiatePurchase, resetPurchaseStatus, setPurchaseStatus, confirmPayment, confirmGooglePlayPayment } from "@/lib/redux/slice/vipSlice";
import { fetchVipStatus } from "@/lib/redux/slice/profileSlice";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import StripePaymentSheet from "@/components/StripePaymentSheet";
import GooglePlayPaymentSheet from "@/components/GooglePlayPaymentSheet";
import { isGooglePlayAvailable, getProductId } from "@/lib/googlePlayBilling";
const tierData = {
    gold: {
        name: 'Gold',
        gradient: 'linear-gradient(331deg, rgba(237,131,0,1) 0%, rgba(237,215,0,1) 100%)',
        iconColor: '#F5D800',
        features: [
            { icon: 'https://c.animaapp.com/aGU3sKRJ/img/image-3941@2x.png' },
            { icon: 'https://c.animaapp.com/aGU3sKRJ/img/image-3944@2x.png' },
            { icon: 'https://c.animaapp.com/aGU3sKRJ/img/image@2x.png' },
        ],
    },
    bronze: {
        name: 'Bronze',
        gradient: 'linear-gradient(331deg, #6D5C4B 0%, #C4B3A1 100%)',
        iconColor: '#C4B3A1',
        features: [
            { icon: 'https://c.animaapp.com/aGU3sKRJ/img/image-3941@2x.png' },
            { icon: 'https://c.animaapp.com/aGU3sKRJ/img/image-3944@2x.png' },
            { icon: 'https://c.animaapp.com/aGU3sKRJ/img/image@2x.png' },
        ],
    },
    platinum: {
        name: 'Platinum',
        gradient: 'linear-gradient(331deg, #8A89E6 0%, #C2C1FF 100%)',
        iconColor: '#C2C1FF',
        features: [
            { icon: 'https://c.animaapp.com/aGU3sKRJ/img/image-3941@2x.png' },
            { icon: 'https://c.animaapp.com/aGU3sKRJ/img/image-3944@2x.png' },
            { icon: 'https://c.animaapp.com/aGU3sKRJ/img/image@2x.png' },
        ],
    },
};

const membershipTiers = [
    { id: "gold", name: "Gold" },
    { id: "bronze", name: "Bronze" },
    { id: "platinum", name: "Platinum" },
];
const StarIcon = ({ className, color }) => (
    <svg className={className} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.5 0L11.6329 7.36714H19L13.1836 11.9214L15.3164 19L9.5 14.4457L3.68359 19L5.81641 11.9214L0 7.36714H7.36719L9.5 0Z" fill={color} />
    </svg>
);
const SparkleIcon = ({ className, color }) => (
    <svg className={className} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.5 0L12.5858 6.41421L19 9.5L12.5858 12.5858L9.5 19L6.41421 12.5858L0 9.5L6.41421 6.41421L9.5 0Z" fill={color} />
    </svg>
);
const SparkleSmallIcon = ({ className, color }) => (
    <svg className={className} viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0L7.90192 4.09808L12 6L7.90192 7.90192L6 12L4.09808 7.90192L0 6L4.09808 4.09808L6 0Z" fill={color} />
    </svg>
);
export default function BuySubscription() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedTier, setSelectedTier] = useState("gold");
    const [purchaseResponse, setPurchaseResponse] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("stripe"); // "stripe" | "google_play"
    const currentTierData = tierData[selectedTier];

    const dispatch = useDispatch();
    const { tiers, status, symbol, purchaseStatus, purchaseError, paymentClientSecret, activeSubscriptionId, googlePlayProductId, modalLocked } = useSelector((state) => state.vip);
    const { token } = useAuth();
    const router = useRouter();

    // Detect platform on mount — use Google Play on native Android
    useEffect(() => {
        isGooglePlayAvailable().then((available) => {
            setPaymentMethod(available ? "google_play" : "stripe");
        });
    }, []);

    // VIP status will be refreshed directly via Redux dispatch after successful payment

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (status === "idle" && tiers.length === 0) {
            // Only fetch if we somehow don't have data yet
            dispatch(fetchVipTiers("US"));
        }
    }, [status, dispatch, tiers.length]);

    // Force re-render when tiers data becomes available
    useEffect(() => {
        if (tiers && tiers.length > 0 && selectedTier) {
            // Ensure the selected tier is valid, if not, select the first available tier
            const validTier = tiers.find(tier => tier.id === selectedTier) || tiers[0];
            if (validTier && validTier.id !== selectedTier) {
                setSelectedTier(validTier.id);
            }
        }
    }, [tiers, selectedTier]);

    // Memoize expensive calculations to prevent unnecessary re-renders
    const backendTierMap = useMemo(() =>
        Array.isArray(tiers)
            ? tiers.reduce((acc, t) => {
                acc[t.id] = t;
                return acc;
            }, {})
            : {}
        , [tiers]);

    const currentBackendTier = useMemo(() =>
        backendTierMap[selectedTier]
        , [backendTierMap, selectedTier]);

    const benefitsForUi = useMemo(() =>
        (currentBackendTier?.benefits || []).map((b, index) => {
            const icons = currentTierData?.features || [];
            const iconSrc = icons.length ? icons[index % icons.length].icon : "";
            return { title: b.title, icon: iconSrc };
        })
        , [currentBackendTier, currentTierData]);

    const handlePlanSelect = useCallback((planId) => {
        setSelectedPlan(planId);
    }, [selectedPlan]);

    const handleTierSelect = useCallback((tierId) => {
        setSelectedTier(tierId);
        // Set trending plan as default for the new tier
        const trendingId = (backendTierMap[tierId]?.pricing?.trending) || "monthly";
        setSelectedPlan(trendingId);
    }, [backendTierMap, selectedTier]);

    const handleSubscribe = async () => {
        if (!selectedTier || !selectedPlan || !token) {
            alert("Please select both a tier and a plan.");
            return;
        }

        // Reset any previous payment response to ensure fresh payment intent
        setPurchaseResponse(null);
        dispatch(resetPurchaseStatus());

        // Use Google Play Billing on native Android
        // TEST MODE: Skip backend API call and show Google Play UI directly
        if (paymentMethod === "google_play") {
            dispatch(setPurchaseStatus({ status: "awaiting_payment" }));
            // Manually set the product ID in Redux state for GooglePlayPaymentSheet
            dispatch({ type: "vip/initiateGooglePlayPurchase/fulfilled", payload: {
                subscriptionId: "test_subscription_id",
                googlePlayProductId: getProductId(selectedTier, selectedPlan),
                tierId: selectedTier,
                plan: selectedPlan,
            }});
            return;
        }

        // Use Stripe for web/iOS
        try {
            const response = await dispatch(initiatePurchase({
                tierId: selectedTier,
                plan: selectedPlan,
                region: "US",
                token,
                // Add timestamp to force backend to create new payment intent
                _forceNew: Date.now()
            }));

            // Check if the thunk was rejected
            if (response.type && response.type.endsWith('/rejected')) {
                const errorMessage = response.payload || "Payment initiation failed. Please try again.";
                alert(`Subscription error: ${errorMessage}`);
                return;
            }

            // ✅ FIX: Backend returns data in response.payload.data (nested)
            const payloadData = response.payload?.data || response.payload;

            // Check if user already has an active subscription
            if (typeof payloadData === 'string' && payloadData.includes('already has an active VIP subscription')) {
                alert("You already have an active VIP subscription. No payment is needed!");
                return;
            }

            // Check if we have the required payment data
            if (payloadData?.clientSecret && payloadData?.subscriptionId) {
                // Create the expected response structure for StripePaymentSheet
                const paymentData = {
                    success: true,
                    data: {
                        clientSecret: payloadData.clientSecret,
                        paymentIntentId: payloadData.paymentIntentId,
                        amount: payloadData.amount,
                        currency: payloadData.currency,
                        subscriptionId: payloadData.subscriptionId
                    }
                };

                setPurchaseResponse(paymentData);
            } else {
                // Check if this is an error message from the backend
                if (typeof payloadData === 'string') {
                    alert(`Subscription error: ${payloadData}`);
                } else {
                    alert("Payment initiation failed: Missing payment data. Please try again.");
                }
            }
        } catch (error) {
            console.error("Payment initiation error:", error);
            const errorMessage = error?.message || error?.body?.message || "An error occurred. Please try again.";
            alert(`Subscription error: ${errorMessage}`);
        }
    };

    const handlePaymentError = (error) => {
        alert("Payment failed. Please try again.");
        dispatch(resetPurchaseStatus());
        setPurchaseResponse(null);
    };

    const handlePaymentCancel = () => {
        dispatch(resetPurchaseStatus());
        setPurchaseResponse(null);
    };

    const handlePaymentSuccess = async (paymentIntentId) => {
        // Clear the StripePaymentSheet immediately to prevent double modals
        setPurchaseResponse(null);

        // Set loading state immediately to show processing modal and prevent black box
        dispatch(setPurchaseStatus({
            status: 'loading',
            message: 'Processing your subscription...'
        }));

        // This is called from our CapacitorCheckoutForm on success
        // Confirm the payment with the backend
        try {
            // Add validation before making the API call
            if (!paymentIntentId) {
                throw new Error("Payment Intent ID is missing");
            }
            if (!activeSubscriptionId) {
                throw new Error("Subscription ID is missing");
            }
            if (!token) {
                throw new Error("Authentication token is missing");
            }

            // Add a small delay to ensure Stripe has processed the payment
            await new Promise(resolve => setTimeout(resolve, 2000)); // Increased delay for backend processing

            const result = await dispatch(confirmPayment({
                paymentIntentId,
                subscriptionId: activeSubscriptionId,
                token
            })).unwrap();

            // Refresh VIP status to update membership status across the app
            // This updates: homepage banner, profile page, and wallet page
            // All components use state.profile.vipStatus to display membership status
            dispatch(fetchVipStatus(token));

            // Show success message
            dispatch(setPurchaseStatus({
                status: 'succeeded',
                message: 'Payment completed successfully! VIP subscription activated.'
            }));

            // Redirect after showing success message
            setTimeout(() => {
                if (!modalLocked) {
                    dispatch(resetPurchaseStatus());
                    router.push("/Wallet");
                }
            }, 3000); // Increased delay to show success message
        } catch (error) {
            console.error("❌ [handlePaymentSuccess] Error details:", error);
            console.error("❌ [handlePaymentSuccess] Error type:", typeof error);
            console.error("❌ [handlePaymentSuccess] Error keys:", error ? Object.keys(error) : "null");
            
            // More detailed error handling
            let errorMessage = 'Payment confirmation failed. Please contact support.';
            
            // Extract error message from various possible locations
            // The error from unwrap() is the rejected value from rejectWithValue
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (error?.body?.error) {
                errorMessage = error.body.error;
            } else if (error?.body?.message) {
                errorMessage = error.body.message;
            } else if (error?.error) {
                errorMessage = error.error;
            }

            // Check if this is a backend configuration issue (like missing Stripe customer)
            if (errorMessage.includes("No such customer") || 
                errorMessage.includes("customer") || 
                errorMessage.includes("Customer")) {
                errorMessage = "Payment processing error: Account configuration issue detected. Your payment was processed, but we need to set up your account. Please contact support with your payment details and we'll activate your subscription.";
            }

            // Check if this is a network/server error vs validation error
            const isNetworkError = !error?.status || error?.status >= 500;
            const isValidationError = error?.status >= 400 && error?.status < 500;

            if (isNetworkError && !errorMessage.includes("No such customer") && !errorMessage.includes("Account configuration")) {
                // For network errors, show a more user-friendly message
                errorMessage = 'Network error during payment confirmation. Your payment was successful, but we need to verify it. Please contact support if this persists.';
            } else if (isValidationError && !errorMessage.includes("No such customer") && !errorMessage.includes("Account configuration")) {
                // For validation errors, show the specific error
                errorMessage = `Payment confirmation failed: ${errorMessage}`;
            }

            dispatch(setPurchaseStatus({
                status: 'failed',
                error: errorMessage
            }));
        }
    };

    // Called by GooglePlayPaymentSheet after a successful Play purchase + backend confirmation
    const handleGooglePlayPaymentSuccess = async () => {
        dispatch(fetchVipStatus(token));
        dispatch(setPurchaseStatus({
            status: 'succeeded',
            message: 'Payment completed successfully! VIP subscription activated.'
        }));
    };

    // Set trending plan as default when tier data is available
    useEffect(() => {
        if (currentBackendTier?.pricing?.trending) {
            const trendingId = currentBackendTier.pricing.trending;
            setSelectedPlan(trendingId);
        }
    }, [currentBackendTier]);

    useEffect(() => {
        if (purchaseStatus === "succeeded") {
            const t = setTimeout(() => {
                // Only redirect if modal is not locked
                if (!modalLocked) {
                    dispatch(resetPurchaseStatus());
                    router.push("/Wallet");
                }
            }, 800);
            return () => clearTimeout(t);
        }
    }, [purchaseStatus, dispatch, router, modalLocked]);

    // Cleanup effect to clear purchase response when component unmounts
    useEffect(() => {
        return () => {
            // Clear purchase response on unmount to prevent memory leaks
            setPurchaseResponse(null);
        };
    }, []);

    if ((status === "loading" || (status === "idle" && tiers.length === 0))) {
        return (
            <div className="w-full min-h-screen bg-black flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                    <p className="text-white text-lg font-medium">Loading subscription plans...</p>
                </div>
            </div>
        );
    }

    // Show error state if data fetching failed
    if (status === "failed") {
        return (
            <div className="w-full min-h-screen bg-black flex justify-center items-center">
                <div className="flex flex-col items-center gap-4 text-center px-4">
                    <div className="text-red-400 text-6xl">⚠️</div>
                    <p className="text-white text-lg font-medium">Failed to load subscription plans</p>
                    <button
                        onClick={() => dispatch(fetchVipTiers("US"))}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-black flex justify-center">
            <div className="w-full  relative flex flex-col items-center">
                <main className="w-full flex flex-col items-center ">
                    {purchaseStatus !== "idle" && (
                        <div
                            className="fixed inset-0 flex justify-center items-center z-50 bg-black/70 backdrop-blur-sm"
                            onClick={(e) => {
                                // Only allow closing if modal is not locked and not in critical states
                                if (!modalLocked && purchaseStatus !== "loading" && purchaseStatus !== "awaiting_payment") {
                                    dispatch(resetPurchaseStatus());
                                }
                            }}
                        >
                            <div
                                className="bg-[#1f1f24] border border-[#ffffff26] w-[320px] rounded-2xl p-6 text-white text-center shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {purchaseStatus === "loading" && (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-10 w-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                                        <p className="[font-family:'Poppins',Helvetica] text-sm opacity-90">Processing your subscription...</p>
                                    </div>
                                )}
                                {purchaseStatus === "succeeded" && (
                                    <div className="flex flex-col items-center gap-3">
                                        <svg className="h-12 w-12 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                            <path d="M7 12l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="text-center">
                                            <p className="text-green-400 [font-family:'Poppins',Helvetica] font-bold text-lg">Payment Completed!</p>
                                            <p className="text-white [font-family:'Poppins',Helvetica] text-sm mt-1">VIP subscription activated successfully</p>
                                        </div>
                                        <button onClick={() => dispatch(resetPurchaseStatus())} className="mt-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">Continue</button>
                                    </div>
                                )}
                                {purchaseStatus === "failed" && (
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="h-10 w-10 text-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                            <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <p className="text-red-400 [font-family:'Poppins',Helvetica] font-medium">{purchaseError || "Something went wrong."}</p>
                                        <button onClick={() => dispatch(resetPurchaseStatus())} className="mt-1 px-4 py-2 bg-red-600 rounded-md">Close</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <header className="relative w-full h-[279px] rounded-b-[50px]">
                        {/* Close button for main page */}
                        <button
                            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition-colors z-20"
                            onClick={() => router.back()}
                        >
                            <svg
                                className="w-6 h-6 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18 6L6 18M6 6L18 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <div
                            className="absolute w-full h-full top-0 left-0 rounded-b-[50px] overflow-hidden border border-solid border-[#ffffff80]"
                            style={{ background: (currentTierData && currentTierData.gradient) || 'linear-gradient(331deg, #555 0%, #888 100%)' }}
                        >
                            <div className="absolute w-[219px] h-[216px] top-8 left-1/2 -translate-x-1/2">
                                <div className="absolute w-[210px] h-[216px] top-0 left-0">
                                    <div className="flex flex-col w-[198px] items-center justify-center pt-0 pb-2 px-0 absolute top-[143px] left-0">
                                        <div className="relative w-fit mt-[-1.00px] ml-9 [font-family:'Poppins',Helvetica] font-bold text-white text-[14px] tracking-[0] leading-4 whitespace-nowrap">
                                            Become a
                                        </div>
                                        <h1 className="relative w-fit ml-9 [text-shadow:0px_4px_8px_#1a002f40] [-webkit-text-stroke:0.5px_transparent] s [-webkit-background-clip:text] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(245,245,245,1)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins',Helvetica] font-bold text-transparent text-[32px] tracking-[0] leading-8 whitespace-nowrap">
                                            VIP Member
                                        </h1>
                                    </div>
                                    <StarIcon color={currentTierData.iconColor} className="absolute w-[19px] h-[19px] top-[21px] left-[191px]" />
                                    <StarIcon color={currentTierData.iconColor} className="absolute w-[19px] h-[19px] top-[197px] left-[156px]" />
                                    <SparkleIcon color={currentTierData.iconColor} className="absolute w-[19px] h-[19px] top-2.5 left-[22px]" />
                                    <img className="absolute w-[165px] h-[153px] top-0 left-[27px]" alt="VIP Crown illustration" src="https://c.animaapp.com/aGU3sKRJ/img/-group-@2x.png" />
                                </div>
                                <SparkleIcon color={currentTierData.iconColor} className="absolute w-[19px] h-[19px] top-[143px] left-[200px]" />
                            </div>
                            <StarIcon color={currentTierData.iconColor} className="absolute w-[19px] h-[19px] top-[134px] left-[37px]" />
                            <SparkleSmallIcon color={currentTierData.iconColor} className="absolute w-3 h-[13px] top-[63px] left-[41px]" />
                            <SparkleSmallIcon color={currentTierData.iconColor} className="absolute w-3 h-[13px] top-[194px] left-[321px]" />
                            <SparkleSmallIcon color={currentTierData.iconColor} className="absolute w-3 h-[13px] top-[223px] left-[63px]" />
                            <SparkleIcon color={currentTierData.iconColor} className="absolute w-[19px] h-[19px] top-[113px] left-[337px]" />
                        </div>
                    </header>
                    <nav
                        className="flex w-[335px] h-[56px] items-center justify-between mt-8 rounded-[10px] overflow-hidden border border-solid border-[#616161]"
                        role="tablist"
                    >
                        {membershipTiers.map((tier) => {
                            const isActive = selectedTier === tier.id;
                            return (
                                <button
                                    key={tier.id}
                                    className={`inline-flex items-center justify-center gap-2.5 px-[21px] py-[13px] relative flex-1 ${tier.id === "bronze" ? "border-r [border-right-style:solid] border-l [border-left-style:solid] border-[#ffffff4c]" : ""
                                        } ${isActive ? "rounded-[10px] overflow-hidden" : ""}`}
                                    onClick={() => handleTierSelect(tier.id)}
                                    role="tab"
                                    aria-selected={isActive}
                                    style={isActive ? { background: tierData[tier.id].gradient } : {}}
                                >
                                    <div
                                        className={`relative w-fit [font-family:'Poppins',Helvetica] 
    ${isActive
                                                ? `font-bold text-[#f4f3fc] text-[18px] text-center ${tier.name === "Platinum" ? "mr-3" : ""
                                                }`
                                                : "font-normal text-[#f4f3fc] text-[16px] text-center"
                                            } 
    tracking-[0] leading-[normal]`}
                                    >
                                        {tier.name}
                                    </div>

                                </button>
                            );
                        })}
                    </nav>
                    <section
                        className="flex flex-col w-[335px] items-start gap-3 mt-6 px-2.5"
                        aria-labelledby="features-heading"
                    >
                        {(benefitsForUi.length ? benefitsForUi : (currentTierData?.features || [])).map((feature, index) => (
                            <div key={index} className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
                                <img className="relative w-[40px] h-[40px] aspect-[1] object-cover" alt="" src={feature.icon} />
                                <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#F4F3FC] opacity-[100%] text-[20px] tracking-[0] leading-[normal]">
                                    {feature.title || `Feature ${index + 1}`}
                                </div>
                            </div>
                        ))}
                    </section>
                    <section
                        className="flex flex-col w-[335px] items-center gap-5 mb-4 mt-8"
                        aria-labelledby="pricing-heading"
                    >
                        <div
                            className="inline-flex flex-col items-start gap-[11.14px] relative"
                            role="radiogroup"
                            aria-labelledby="pricing-heading"
                        >
                            {(() => {
                                const pricing = currentBackendTier?.pricing || {};
                                const orderIds = ["weekly", "monthly", "yearly"];
                                const built = orderIds.map((id) => {
                                    const p = pricing[id];
                                    if (!p) return null;
                                    const name = id.charAt(0).toUpperCase() + id.slice(1);
                                    const price = p.formatted || `${(symbol || p.symbol || "$")}${p.amount || "0"}`;
                                    const trendingPlanId = pricing.trending || "monthly";
                                    return { id, name, price, trending: id === trendingPlanId };
                                }).filter(Boolean);
                                const plans = built;

                                // If no plans are available, show default plans
                                if (plans.length === 0) {
                                    const defaultPlans = [
                                        { id: "monthly", name: "Monthly", price: "$9.99", trending: true },
                                        { id: "yearly", name: "Yearly", price: "$99.99", trending: false }
                                    ];
                                    return defaultPlans.map((plan) => (
                                        <button
                                            key={plan.id}
                                            className={`flex w-[335px] h-[70.53px] items-center justify-between px-[25.98px] py-[22.27px] relative rounded-[18.56px] ${selectedPlan === plan.id
                                                ? "bg-black overflow-hidden border-[2.78px] border-solid border-[#1c1c1e] shadow-[0px_0px_0px_0.93px_#ffd200]"
                                                : "border border-solid border-[#ffffff80]"
                                                }`}
                                            onClick={() => handlePlanSelect(plan.id)}
                                            role="radio"
                                            aria-checked={selectedPlan === plan.id}
                                        >
                                            <div className="inline-flex items-start gap-[7.42px] relative flex-[0_0_auto]">
                                                <div className="relative w-fit mt-[-0.93px] [font-family:'SF_Pro-Medium',Helvetica] font-medium text-white text-[18.6px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                                                    {plan.name}
                                                </div>
                                                {plan.trending && (
                                                    <div className="inline-flex items-center justify-center gap-[9.28px] px-[7.42px] py-[3.71px] relative flex-[0_0_auto] bg-[#ef890f] rounded-[13.92px] overflow-hidden">
                                                        <div className="relative w-fit mt-[-0.93px] [font-family:'SF_Pro-Heavy',Helvetica] font-normal text-white text-[12.1px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                                                            Trending
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="relative w-fit mt-[-0.79px] [font-family:'SF_Pro-Bold',Helvetica] font-bold text-white text-[18.6px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                                                {plan.price}
                                            </div>
                                        </button>
                                    ));
                                }

                                return plans.map((plan) => (
                                    <button
                                        key={plan.id}
                                        className={`flex w-[335px] h-[70.53px] items-center justify-between px-[25.98px] py-[22.27px] relative rounded-[18.56px] ${selectedPlan === plan.id
                                            ? "bg-black overflow-hidden border-[2.78px] border-solid border-[#1c1c1e] shadow-[0px_0px_0px_0.93px_#ffd200]"
                                            : "border border-solid border-[#ffffff80]"
                                            }`}
                                        onClick={() => handlePlanSelect(plan.id)}
                                        role="radio"
                                        aria-checked={selectedPlan === plan.id}
                                    >
                                        <div className="inline-flex items-start gap-[7.42px] relative flex-[0_0_auto]">
                                            <div className="relative w-fit mt-[-0.93px] [font-family:'SF_Pro-Medium',Helvetica] font-medium text-white text-[18.6px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                                                {plan.name}
                                            </div>
                                            {plan.trending && (
                                                <div className="inline-flex items-center justify-center gap-[9.28px] px-[7.42px] py-[3.71px] relative flex-[0_0_auto] bg-[#ef890f] rounded-[13.92px] overflow-hidden">
                                                    <div className="relative w-fit mt-[-0.93px] [font-family:'SF_Pro-Heavy',Helvetica] font-normal text-white text-[12.1px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                                                        Trending
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative w-fit mt-[-0.79px] [font-family:'SF_Pro-Bold',Helvetica] font-bold text-white text-[18.6px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                                            {plan.price}
                                        </div>
                                    </button>
                                ));
                            })()}
                        </div>
                    </section>
                    <div className="w-full  mt-6 mb-4 px-4">
                        <button
                            className="relative w-full h-[55px] rounded-[13px] overflow-hidden border border-solid border-[#ffffff80] cursor-pointer"
                            onClick={handleSubscribe}
                            style={{ background: currentTierData?.gradient || 'linear-gradient(331deg, #555 0%, #888 100%)' }}
                            disabled={purchaseStatus === "loading"}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-[normal]">
                                {purchaseStatus === "loading" ? "Processing..." : "Subscribe Now"}
                            </div>
                        </button>
                    </div>
                </main>
            </div>

            {/* Google Play Payment Sheet — shown on native Android */}
            {paymentMethod === "google_play" && purchaseStatus === "awaiting_payment" && googlePlayProductId && (
                <GooglePlayPaymentSheet
                    subscriptionId={activeSubscriptionId}
                    googlePlayProductId={googlePlayProductId}
                    token={token}
                    onPaymentSuccess={handleGooglePlayPaymentSuccess}
                    onPaymentError={handlePaymentError}
                    onPaymentCancel={handlePaymentCancel}
                />
            )}

            {/* Stripe Payment Sheet — shown on web / non-Android */}
            {paymentMethod === "stripe" && purchaseResponse && purchaseResponse.data?.clientSecret && (
                <StripePaymentSheet
                    clientSecret={purchaseResponse.data.clientSecret}
                    paymentIntentId={purchaseResponse.data.paymentIntentId}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    onPaymentCancel={handlePaymentCancel}
                />
            )}
        </div>
    );
};
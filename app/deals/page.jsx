"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
    getCashbackOffers,
    getShoppingOffers,
    getBitlabsSurveys,
} from "@/lib/api";
import {
    dealsCache,
    dealsCacheTimestamp,
    DEALS_CACHE_TTL,
    setDealsCache,
} from "@/lib/dealsCache";

const TABS = ["All", "Shopping", "Cashback", "Surveys"];

const DealsPage = () => {
    const router = useRouter();
    const { token } = useAuth();

    const [activeTab, setActiveTab] = useState("All");
    const [cashbackOffers, setCashbackOffers] = useState([]);
    const [shoppingOffers, setShoppingOffers] = useState([]);
    const [surveyOffers, setSurveyOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ref so fetchAllDeals can read latest "has data" without being recreated on every data change
    const hasLocalDataRef = useRef(false);
    // Prevent concurrent fetches (e.g. mount + focus firing simultaneously)
    const isFetchingRef = useRef(false);

    useEffect(() => {
        hasLocalDataRef.current =
            cashbackOffers.length > 0 ||
            shoppingOffers.length > 0 ||
            surveyOffers.length > 0;
    }, [cashbackOffers, shoppingOffers, surveyOffers]);

    const handleBack = () => {
        router.back();
    };

    // Shared fetcher that can run with or without UI loading state
    const fetchAllDeals = useCallback(
        async ({ background = false } = {}) => {
            if (!token) return;
            if (isFetchingRef.current) return; // prevent concurrent duplicate calls
            isFetchingRef.current = true;

            const shouldShowLoader = !background && !hasLocalDataRef.current;

            try {
                if (shouldShowLoader) {
                    setLoading(true);
                    setError(null);
                }

                const defaultParams = {
                    category: "all",
                    page: 1,
                    limit: 6, // fetch more than homepage sections
                    useAdminConfig: "true",
                };

                const [cashbackRes, shoppingRes, surveysRes] = await Promise.all([
                    getCashbackOffers(defaultParams, token),
                    getShoppingOffers(defaultParams, token),
                    getBitlabsSurveys(defaultParams, token),
                ]);

                // Normalize cashback offers
                let cbOffers = [];
                if (cashbackRes?.success && cashbackRes.data) {
                    if (Array.isArray(cashbackRes.data.offers)) {
                        cbOffers = cashbackRes.data.offers;
                    } else if (cashbackRes.data.categorized?.cashback) {
                        cbOffers = cashbackRes.data.categorized.cashback;
                    }
                }

                // Normalize shopping offers
                let shOffers = [];
                if (shoppingRes?.success && shoppingRes.data) {
                    if (Array.isArray(shoppingRes.data.offers)) {
                        shOffers = shoppingRes.data.offers;
                    } else if (shoppingRes.data.categorized?.shopping) {
                        shOffers = shoppingRes.data.categorized.shopping;
                    }
                }

                // Normalize survey offers
                let svOffers = [];
                if (surveysRes?.success && Array.isArray(surveysRes.data?.surveys)) {
                    svOffers = surveysRes.data.surveys;
                }

                // Keep full lists for cashback and surveys,
                // but limit shopping offers to 6 items
                setCashbackOffers(cbOffers);
                setShoppingOffers(shOffers.slice(0, 6));
                setSurveyOffers(svOffers);

                // Update shared cache for future visits (also pre-warmed by AuthContext)
                setDealsCache({
                    cashbackOffers: cbOffers,
                    shoppingOffers: shOffers.slice(0, 6),
                    surveyOffers: svOffers,
                });
            } catch (err) {
                console.error("Failed to load deals:", err);
                if (!background) {
                    setError("Failed to load deals. Please try again later.");
                }
            } finally {
                if (shouldShowLoader) {
                    setLoading(false);
                }
                isFetchingRef.current = false;
            }
        },
        [token] // stable — hasLocalData read via ref, not as a dep
    );

    // Initial load with stale-while-revalidate: show cached data instantly if fresh,
    // then refresh in background.
    useEffect(() => {
        if (!token) return;

        const now = Date.now();
        const hasFreshCache =
            dealsCache &&
            dealsCacheTimestamp &&
            now - dealsCacheTimestamp < DEALS_CACHE_TTL;

        if (hasFreshCache) {
            setCashbackOffers(dealsCache.cashbackOffers || []);
            setShoppingOffers(dealsCache.shoppingOffers || []);
            setSurveyOffers(dealsCache.surveyOffers || []);

            // Background refresh
            fetchAllDeals({ background: true });
        } else {
            // No fresh cache – show loader once
            fetchAllDeals({ background: false });
        }
    }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

    // Background refresh when app gains focus / becomes visible
    useEffect(() => {
        if (!token) return;

        const handleFocus = () => {
            fetchAllDeals({ background: true });
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchAllDeals({ background: true });
            }
        };

        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [token, fetchAllDeals]); // fetchAllDeals is now stable (only changes when token changes)

    // Helpers to extract display data
    const getNonGameImage = (offer, fallback) => {
        const isCashback =
            offer?.type === "cashback" || offer?.offerType === "cashback";
        const isShopping =
            offer?.type === "shopping" || offer?.offerType === "shopping";

        if (isCashback) {
            return (
                offer?.metadata?.thumbnail ||
                offer?.images?.cardImage ||
                offer?.images?.backgroundImage ||
                offer?.images?.cardImageSmall ||
                fallback
            );
        }

        if (isShopping) {
            return (
                offer?.metadata?.thumbnail ||
                offer?.banner ||
                offer?.icon ||
                offer?.category?.icon_url ||
                fallback
            );
        }

        return offer?.banner || offer?.icon || offer?.category?.icon_url || fallback;
    };

    const getNonGameTitle = (offer) => {
        return offer?.title || offer?.merchant_name || offer?.anchor || "Offer";
    };

    const getNonGameDescription = (offer) => {
        return (
            offer?.description ||
            offer?.short_description ||
            offer?.metadata?.description ||
            "Complete this offer to earn rewards."
        );
    };

    const getSurveyImage = (survey, fallback) => {
        return survey?.banner || survey?.icon || survey?.category?.icon_url || fallback;
    };

    const getSurveyTitle = (survey) => survey?.title || "Survey";

    const getSurveyDescription = (survey) => {
        if (survey?.description) return survey.description;
        const est =
            survey?.estimatedTime || survey?.reward?.estimatedTime || null;
        if (est) {
            return `Estimated time: ${est} min`;
        }
        return "Answer quick questions and earn rewards.";
    };

    // Combine data based on active tab
    const buildKey = (prefix, entity, index) => {
        // Prefer truly unique identifiers from backend first
        const rawId =
            entity?.externalId ||
            entity?._id ||
            entity?.offerId ||
            entity?.surveyId ||
            entity?.id ||
            entity?.click_url ||
            entity?.clickUrl ||
            index;

        return `${prefix}-${String(rawId)}`;
    };

    // Handle click - mirror NonGameOffersSection + SurveysSection behavior
    const handleDealClick = (deal) => {
        let clickUrl = null;

        if (deal.type === "survey") {
            // Surveys: use clickUrl like SurveysSection
            clickUrl = deal.raw?.clickUrl || deal.raw?.click_url || null;
        } else {
            // Cashback / Shopping / Others: prefer externalUrl from metadata, then click/deep links
            const src = deal.raw || {};
            clickUrl =
                src.metadata?.externalUrl ||
                src.clickUrl ||
                src.click_url ||
                src.deepLink ||
                null;
        }

        if (clickUrl) {
            window.open(clickUrl, "_blank", "noopener,noreferrer");
        }
    };

    const dealsToShow = useMemo(() => {
        const fallbackImg = "https://static.bitlabs.ai/categories/other.svg";

        const cashbackCards = cashbackOffers.map((offer, index) => ({
            id: buildKey("cashback", offer, index),
            type: "cashback",
            title: getNonGameTitle(offer),
            description: getNonGameDescription(offer),
            image: getNonGameImage(offer, fallbackImg),
            raw: offer,
        }));

        const shoppingCards = shoppingOffers.map((offer, index) => ({
            id: buildKey("shopping", offer, index),
            type: "shopping",
            title: getNonGameTitle(offer),
            description: getNonGameDescription(offer),
            image: getNonGameImage(offer, fallbackImg),
            raw: offer,
        }));

        const surveyCards = surveyOffers.map((survey, index) => ({
            id: buildKey("survey", survey, index),
            type: "survey",
            title: getSurveyTitle(survey),
            description: getSurveyDescription(survey),
            image: getSurveyImage(survey, fallbackImg),
            raw: survey,
        }));

        // De-duplicate cards globally by id so the same offer
        // never appears twice when switching tabs or in "All"
        const allCards = [...cashbackCards, ...shoppingCards, ...surveyCards];
        const seen = new Set();
        const uniqueCards = allCards.filter((card) => {
            if (seen.has(card.id)) return false;
            seen.add(card.id);
            return true;
        });

        if (activeTab === "Shopping") {
            return uniqueCards.filter((card) => card.type === "shopping");
        }
        if (activeTab === "Cashback") {
            return uniqueCards.filter((card) => card.type === "cashback");
        }
        if (activeTab === "Surveys") {
            return uniqueCards.filter((card) => card.type === "survey");
        }

        // "All" tab: show all unique cards from all three sources
        return uniqueCards;
    }, [activeTab, cashbackOffers, shoppingOffers, surveyOffers]);

    return (
        <div className="relative w-full min-h-screen bg-black max-w-sm mx-auto flex flex-col items-center text-white">
            {/* App version text */}
            <div className="absolute top-[12px] left-4 [font-family:'Poppins',Helvetica] font-normal text-[#A4A4A4] text-[10px] tracking-[0] leading-3 whitespace-nowrap">
                App Version: V0.0.1
            </div>

            {/* Header */}
            <div className="flex flex-col w-full items-start gap-2 px-4 py-4 mt-[40px]">
                <div className="flex items-center gap-4 w-full rounded-[32px]">
                    <button
                        type="button"
                        aria-label="Go back"
                        onClick={handleBack}
                        className="relative w-6 h-6 flex items-center justify-center"
                    >
                        <img
                            src="https://c.animaapp.com/ciot1lOr/img/arrow-back-ios-new-1@2x.png"
                            alt="Back"
                            className="w-full h-full"
                        />
                    </button>

                    <h1 className="relative [font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0] leading-5">
                        Deals
                    </h1>
                </div>
            </div>

            {/* Tabs */}
            <div className="w-full px-4 mt-1">
                <div className="flex flex-row items-center gap-2">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1 rounded-[8px] text-[12px] [font-family:'Poppins',Helvetica] leading-[14px] tracking-[0] ${isActive
                                    ? "bg-[#7046D7] text-white"
                                    : "bg-[#1E1E1E] text-[#A4A4A4]"
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Deals list */}
            <div className="w-full flex-1 px-4 pt-4 pb-6 overflow-y-auto scrollbar-hide">
                {loading && (
                    <div className="w-full flex flex-col gap-3">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="w-full bg-[#111111] border border-[#333333] rounded-[16px] px-3 py-3 flex flex-row gap-3 animate-pulse"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-[84px] h-[112px] rounded-[12px] bg-[#1E1E1E]" />
                                </div>
                                <div className="flex flex-col justify-between flex-1 gap-2">
                                    <div className="h-4 bg-[#1E1E1E] rounded" />
                                    <div className="h-3 bg-[#1E1E1E] rounded" />
                                    <div className="h-3 bg-[#1E1E1E] rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="w-full text-center text-xs text-red-400 mt-4 px-4">
                        {error}
                    </div>
                )}

                {!loading && !error && dealsToShow.length === 0 && (
                    <div className="w-full text-center text-xs text-[#A4A4A4] mt-4 px-4">
                        No deals available right now. Please check back later.
                    </div>
                )}

                {!loading && !error && dealsToShow.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {dealsToShow.map((deal) => (
                            <article
                                key={deal.id}
                                className="w-full bg-[#111111] border border-[#333333] rounded-[16px] px-3 py-3 flex flex-row gap-3 cursor-pointer"
                                onClick={() => handleDealClick(deal)}
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-[84px] h-[112px] rounded-[12px] overflow-hidden bg-[#1E1E1E] flex items-center justify-center">
                                        <img
                                            src={deal.image}
                                            alt={deal.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between flex-1">
                                    <div>
                                        <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-[16px] leading-[16px] tracking-[0] text-white mb-1">
                                            {deal.title}
                                        </h2>
                                        <p className="[font-family:'Poppins',Helvetica] font-normal text-[13px] leading-[13px] tracking-[0] text-[#D4D4D4]">
                                            {deal.description}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DealsPage;


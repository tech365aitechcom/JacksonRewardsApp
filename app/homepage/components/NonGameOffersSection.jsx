"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchNonGameOffers } from "@/lib/redux/slice/surveysSlice";

const NonGameOffersSection = () => {
    const { token } = useAuth();
    const dispatch = useDispatch();
    const [activesIndex, setActivesIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const MIN_SWIPE_DISTANCE = 50;
    const HORIZONTAL_SPREAD = 120;

    // Get non-game offers from Redux store
    const { nonGameOffers, nonGameOffersStatus, nonGameOffersError } = useSelector((state) => state.surveys);

    // STALE-WHILE-REVALIDATE: Always fetch - will use cache if available and fresh
    useEffect(() => {
        if (!token) return;

        // Always dispatch - stale-while-revalidate will handle cache logic automatically
        // This ensures:
        // 1. Shows cached data immediately if available (< 90 seconds old)
        // 2. Refreshes in background if cache is stale or 80% expired
        // 3. Fetches fresh if no cache exists
        dispatch(fetchNonGameOffers({ token, offerType: "cashback_shopping" }));
    }, [token, dispatch]);

    // Refresh offers in background after showing cached data (to get admin updates)
    // Do this in background without blocking UI - show cached data immediately
    useEffect(() => {
        if (!token) return;

        // Use setTimeout to refresh in background after showing cached data
        // This ensures smooth UX - cached data shows immediately, fresh data loads in background
        const refreshTimer = setTimeout(() => {
            dispatch(fetchNonGameOffers({ token, force: true, background: true, offerType: "cashback_shopping" }));
        }, 100); // Small delay to let cached data render first

        return () => clearTimeout(refreshTimer);
    }, [token, dispatch]);

    // Refresh offers in background when app comes to foreground (admin might have updated)
    useEffect(() => {
        if (!token) return;

        const handleFocus = () => {
            dispatch(fetchNonGameOffers({ token, force: true, background: true, offerType: "cashback_shopping" }));
        };

        window.addEventListener("focus", handleFocus);

        const handleVisibilityChange = () => {
            if (!document.hidden && token) {
                dispatch(fetchNonGameOffers({ token, force: true, background: true, offerType: "cashback_shopping" }));
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [token, dispatch]);

    // Reset active index when offers change
    useEffect(() => {
        if (nonGameOffers && nonGameOffers.length > 0) {
            setActivesIndex(0);
        }
    }, [nonGameOffers?.length]);

    const totalsCards = nonGameOffers?.length || 0;

    const handleOfferClick = (offer) => {
        // For shopping offers, use metadata.externalUrl, otherwise use clickUrl/click_url/deepLink
        let clickUrl;
        if (offer.type === "shopping" || offer.offerType === "shopping") {
            clickUrl = offer.metadata?.externalUrl || offer.clickUrl || offer.click_url || offer.deepLink;
        } else {
            clickUrl = offer.clickUrl || offer.click_url || offer.deepLink;
        }

        if (clickUrl) {
            window.open(clickUrl, '_blank', 'noopener,noreferrer');
        }
    };

    // Touch handlers for circular swipe
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd || isAnimating) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
        const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

        if (isLeftSwipe && nonGameOffers && nonGameOffers.length > 0) {
            setIsAnimating(true);
            setActivesIndex((prev) => (prev + 1) % nonGameOffers.length);
            setTimeout(() => setIsAnimating(false), 400);
        }
        if (isRightSwipe && nonGameOffers && nonGameOffers.length > 0) {
            setIsAnimating(true);
            setActivesIndex((prev) => (prev - 1 + nonGameOffers.length) % nonGameOffers.length);
            setTimeout(() => setIsAnimating(false), 400);
        }
    };

    // Format title with line break (matching NonGamingOffers)
    const formatTitle = (title) => {
        if (!title) return '';
        const words = title.split(' ');
        if (words.length <= 1) return title;
        const lastWord = words.pop();
        return <>{words.join(' ')}<br />{lastWord}</>;
    };

    // Circular rotation calculation - middle card bigger for user-friendliness
    const getCardTransform = (index, totalCards) => {
        const currentIndex = activesIndex;
        let offset = index - currentIndex;

        // Handle circular wrapping for smooth rotation
        if (offset > totalCards / 2) {
            offset = offset - totalCards;
        } else if (offset < -totalCards / 2) {
            offset = offset + totalCards;
        }

        // Calculate circular position with 3D effect
        const angle = (offset * 50) * (Math.PI / 180); // 50 degrees per card for smoother curve
        const radius = 70; // Circular radius
        const x = Math.sin(angle) * radius;

        // Middle card (offset 0) is bigger, side cards are slightly smaller
        const scale = offset === 0 ? 1.0 : 0.85;
        const opacity = offset === 0 ? 1 : Math.max(0.6, 1 - Math.abs(offset) * 0.3);

        return {
            transform: `translateX(calc(-50% + ${x}px)) scale(${scale})`,
            opacity: opacity,
            zIndex: totalCards - Math.abs(offset),
        };
    };

    // Get reward display based on offer type
    const getRewardDisplay = (offer) => {
        if (offer.type === "cashback") {
            return offer.cashback ? `${offer.cashback} ${offer.currency || ""}` : `${offer.coinReward || offer.userRewardCoins || 0}`;
        } else if (offer.type === "shopping") {
            return offer.total_points || `${offer.coinReward || offer.userRewardCoins || 0}`;
        } else if (offer.type === "magic_receipt") {
            return offer.total_points || `${offer.coinReward || offer.userRewardCoins || 0}`;
        } else {
            return offer.coinReward || offer.userRewardCoins || 0;
        }
    };

    // Get time display based on offer type
    const getTimeDisplay = (offer) => {
        if (offer.type === "cashback") {
            return offer.reward_delay_days ? `${offer.reward_delay_days}d` : offer.estimatedTime || "1m";
        } else if (offer.type === "shopping") {
            return offer.estimatedTime ? `${offer.estimatedTime}m` : "1m";
        } else if (offer.type === "magic_receipt") {
            return offer.confirmation_time || offer.estimatedTime ? `${offer.estimatedTime || 2}m` : "2m";
        } else {
            return offer.estimatedTime ? `${offer.estimatedTime}m` : "1m";
        }
    };

    // REMOVED: Loading state - always show content immediately (stale-while-revalidate pattern)
    // Background fetching happens automatically without blocking UI

    return (
        <div className="w-[335px] h-[275px] mx-auto mt-6 flex flex-col items-center">
            <div className="w-full h-[24px] px-4 mb-2.5 mr-4">
                <h2 className="font-['Poppins',Helvetica] text-[16px] font-semibold leading-normal tracking-[0] text-[#FFFFFF]">
                    Non- Gaming Offers
                </h2>
            </div>

            {/* Card viewport - slightly reduced height */}
            <div
                className="relative w-full h-[240px] overflow-hidden"
                style={{ perspective: '1000px' }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {nonGameOffers && nonGameOffers.length > 0 ? nonGameOffers.map((offer, index) => {
                    // Get offer image - for cashback use images.cardImage, for shopping use metadata.thumbnail, otherwise use banner/icon
                    let offerImage;
                    if (offer.type === "cashback" && offer.images) {
                        offerImage = offer.images.cardImage || offer.images.backgroundImage || offer.images.cardImageSmall || "https://static.bitlabs.ai/categories/other.svg";
                    } else if (offer.type === "shopping" || offer.offerType === "shopping") {
                        offerImage = offer.metadata?.thumbnail || offer.banner || offer.icon || offer.category?.icon_url || "https://static.bitlabs.ai/categories/other.svg";
                    } else {
                        offerImage = offer.banner || offer.icon || offer.category?.icon_url || "https://static.bitlabs.ai/categories/other.svg";
                    }

                    // Get coins and XP
                    const coins = offer.coinReward || offer.userRewardCoins || 0;
                    const xp = offer.userRewardXP || 0;
                    const rewardDisplay = getRewardDisplay(offer);
                    const timeDisplay = getTimeDisplay(offer);

                    // Get offer name/title
                    const offerName = offer.title || offer.merchant_name || offer.anchor || "Offer";

                    // Get circular transform - middle card bigger
                    const circularTransform = getCardTransform(index, nonGameOffers.length);

                    const cardStyle = {
                        ...circularTransform,
                        transition: isAnimating ? 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'all 0.3s ease-out',
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                    };

                    return (
                        <article
                            key={offer.id || offer.externalId || index}
                            className="absolute top-0 left-1/2 cursor-pointer"
                            style={cardStyle}
                            onClick={() => {
                                if (index !== activesIndex) {
                                    setIsAnimating(true);
                                    setActivesIndex(index);
                                    setTimeout(() => setIsAnimating(false), 400);
                                } else {
                                    handleOfferClick(offer);
                                }
                            }}
                        >
                            {/* Card content - decreased height to fit image and footer: w-[168px] h-[238px] */}
                            <div className="relative h-[234px] w-[168px]">
                                {/* Background container */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[15px] overflow-hidden">
                                    {/* Offer Image Section - full width to contain image */}
                                    <div className="relative w-full h-[174px] overflow-hidden">
                                        {offer.type === "cashback" ? (
                                            <img
                                                className="w-full h-full object-contain rounded-t-[10px]"
                                                src={offerImage}
                                                alt={offer.merchant_name || "Cashback Offer"}
                                                style={{ imageRendering: 'crisp-edges' }}
                                                loading="eager"
                                                decoding="async"
                                                width="168"
                                                height="174"
                                                onError={(e) => {
                                                    e.target.src = "https://static.bitlabs.ai/categories/other.svg";
                                                }}
                                            />
                                        ) : (offer.type === "shopping" || offer.offerType === "shopping") ? (
                                            <img
                                                className="w-full h-full object-contain rounded-t-[10px]"
                                                src={offerImage}
                                                alt={offer.anchor || offer.title || "Shopping Offer"}
                                                style={{ imageRendering: 'crisp-edges' }}
                                                loading="eager"
                                                decoding="async"
                                                width="168"
                                                height="174"
                                                onError={(e) => {
                                                    e.target.src = "https://static.bitlabs.ai/categories/other.svg";
                                                }}
                                            />
                                        ) : (
                                            <img
                                                className="w-full h-full object-contain rounded-t-[10px]"
                                                src={offerImage}
                                                alt={offer.title || "Offer"}
                                                style={{ imageRendering: 'crisp-edges' }}
                                                loading="eager"
                                                decoding="async"
                                                width="168"
                                                height="174"
                                                onError={(e) => {
                                                    e.target.src = "https://static.bitlabs.ai/categories/other.svg";
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Bottom gradient section - increased height by 2px: h-[52px] - faded to differentiate from Earn button */}
                                    <div className="absolute bottom-0 h-[63px] w-full bg-gradient-to-b from-[#9EADF7]/50 to-[#716AE7]/50 rounded-b-[6px] flex items-center justify-center backdrop-blur-sm">
                                        <div className="text-center font-['Poppins',Helvetica] text-base font-semibold leading-5 tracking-[0] text-white px-2">
                                            {formatTitle(offerName)}
                                        </div>
                                    </div>

                                    {/* Earn button - moved down slightly: top-[110px] min-h-[29px] w-[140px] */}
                                    <div
                                        className="absolute top-[128px] left-1/2 flex flex-wrap items-center justify-center gap-0.5 px-1.5 py-1 min-h-[29px] w-[140px] -translate-x-1/2 rounded-[10px] bg-gradient-to-b from-[#9EADF7] to-[#716AE7] cursor-pointer hover:opacity-90 transition-opacity leading-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOfferClick(offer);
                                        }}
                                    >
                                        <span className="font-['Poppins',Helvetica] text-[12px] font-medium leading-none tracking-[0] text-white">
                                            Earn upto
                                        </span>
                                        {coins > 0 && (
                                            <>
                                                <span className="font-['Poppins',Helvetica] text-[12px] font-semibold leading-none text-white">
                                                    {String(coins)}
                                                </span>
                                                <img
                                                    className="w-3.5 h-3.5 object-contain flex-shrink-0"
                                                    alt="Coin icon"
                                                    src="/dollor.png"
                                                    loading="eager"
                                                    decoding="async"
                                                    width="14"
                                                    height="14"
                                                />
                                            </>
                                        )}
                                        {xp > 0 && (
                                            <>
                                                {coins > 0 && (
                                                    <span className="text-white text-[12px] leading-none">&</span>
                                                )}
                                                <span className="font-['Poppins',Helvetica] text-[12px] font-semibold leading-none text-white">
                                                    {String(xp)}
                                                </span>
                                                <img
                                                    className="w-3.5 h-3.5 object-contain flex-shrink-0"
                                                    alt="XP icon"
                                                    src="/xp.svg"
                                                    loading="eager"
                                                    decoding="async"
                                                    width="14"
                                                    height="14"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                }) : (
                    <div className="w-full flex flex-col items-center justify-center py-6 px-4">
                        <h4 className="[font-family:'Poppins',Helvetica] font-semibold text-[#F4F3FC] text-[14px] text-center mb-2">
                            No Offers Available
                        </h4>
                        <p className="[font-family:'Poppins',Helvetica] font-normal text-white text-[12px] text-center opacity-90">
                            Check back later for new opportunities!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NonGameOffersSection;


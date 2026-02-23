"use client";
import React, { useEffect } from "react";
import MyEarningCard from "./Components/MyEarningCard";
import { HighestEarningGame } from "./Components/HighestEarningGame";
import TransactionHistory from "./Components/TransactionHistory";
import { VipMember } from "./Components/VipMember";
import { WithdrawalOption } from "./Components/WithdrawalOption";
import { Conversion } from "./Components/Conversion";
import { HomeIndicator } from "../../components/HomeIndicator";
import WalletHeader from "./Components/WalletHeader";
import SpinWin from "../myprofile/components/SpinWin";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useVipStatus } from "@/hooks/useVipStatus";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfileStats } from "@/lib/redux/slice/profileSlice";
import { fetchWalletScreen } from "@/lib/redux/slice/walletTransactionsSlice";


export default function WalletPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useAuth();

  const {
    detailsStatus,
    statsStatus,
    error,
  } = useSelector((state) => state.profile);

  // VIP status using custom hook
  const { vipStatus, isLoading: vipLoadingStatus, forceRefreshVipStatus } = useVipStatus();


  // Get wallet screen data from Redux store
  const { walletScreen, walletScreenStatus } = useSelector((state) => state.walletTransactions);
  const coinBalance = walletScreen?.wallet?.balance || 0;
  const balance = coinBalance || 0;

  // Preload critical wallet images for faster rendering on Android
  useEffect(() => {
    const criticalImages = [
      '/dollor.png',
      '/xp.svg',
      '/dot.svg',
      '/vipbg.svg',
      '/vipdecoration.png',
      '/bgearning.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = src.endsWith('.svg') ? 'image/svg+xml' : 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Cleanup function to remove preload links
    return () => {
      criticalImages.forEach(src => {
        const links = document.head.querySelectorAll(`link[href="${src}"]`);
        links.forEach(link => link.remove());
      });
    };
  }, []);

  // Refresh wallet and balance data when page is visited (to get admin updates)
  // Do this in background without blocking UI - show cached data immediately
  useEffect(() => {
    if (!token) return;

    // Use setTimeout to refresh in background after showing cached data
    // This ensures smooth UX - cached data shows immediately, fresh data loads in background
    const refreshTimer = setTimeout(() => {
      dispatch(fetchWalletScreen({ token, force: true }));
      dispatch(fetchProfileStats({ token, force: true }));
      // Also refresh Google Play subscription status (Android only)
      forceRefreshVipStatus();
    }, 100); // Small delay to let cached data render first

    return () => clearTimeout(refreshTimer);
  }, [token, dispatch, forceRefreshVipStatus]);

  // Refresh when app comes to foreground
  useEffect(() => {
    if (!token) return;

    const handleFocus = () => {
      dispatch(fetchWalletScreen({ token, force: true }));
      dispatch(fetchProfileStats({ token, force: true }));
      // Also refresh Google Play subscription status (Android only)
      forceRefreshVipStatus();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [token, dispatch, forceRefreshVipStatus]);

  const handleVipUpgrade = () => {
    router.prefetch("/BuySubscription");
    router.push("/BuySubscription");
  };

  // Only show loading if we have NO cached data at all
  // This allows showing cached data immediately while refreshing in background
  const hasCachedData = walletScreen || statsStatus === 'succeeded' || detailsStatus === 'succeeded' || vipStatus;
  const isLoading = !hasCachedData && (detailsStatus === 'loading' || statsStatus === 'loading' || walletScreenStatus === 'loading' || vipLoadingStatus === 'loading');
  const hasFailed = detailsStatus === 'failed' || statsStatus === 'failed' || walletScreenStatus === 'failed' || vipLoadingStatus === 'failed';

  // Only show loading screen if we have absolutely no data
  // Otherwise, show cached data immediately and refresh in background
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center text-white text-xl">
        Loading Wallet...
      </div>
    );
  }

  // Only show error if we have no cached data to fall back to
  if (hasFailed && !hasCachedData) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center text-red-500 text-xl">
        Error: {error || "Failed to load data. Please try again later."}
      </div>
    );
  }



  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black flex justify-center">
      <div className="w-full max-w-md min-h-screen flex flex-col items-center bg-black pb-6">
        <WalletHeader balance={balance} appVersion="V0.1.1" token={token} />
        <MyEarningCard token={token} />
        <TransactionHistory />
        <HighestEarningGame />
        <SpinWin />
        <Conversion />
        <WithdrawalOption />
        <VipMember vipStatus={vipStatus} handleVipUpgrade={handleVipUpgrade} />
        <HomeIndicator activeTab="wallet" />
      </div>
    </div>
  );
}
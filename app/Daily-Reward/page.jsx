"use client";

import React, { Suspense, lazy } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import { NavigationGuard } from "./components/NavigationGuard";

// Lazy load the main component for better performance
const DailyReward = lazy(() => import("./components/DailyReward"));

export default function DailyRewardPage() {
    return (
        <NavigationGuard>
            <div className="flex justify-center w-full">
                <div className="relative w-full max-w-md min-h-screen bg-black mx-auto">
                    <Suspense fallback={<LoadingScreen />}>
                        <DailyReward />
                    </Suspense>
                </div>
            </div>
        </NavigationGuard>
    );
}
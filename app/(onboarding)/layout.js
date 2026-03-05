"use client";
import OnboardingInitializer from "@/components/OnboardingInitializer";
import useOnboardingStore from "@/stores/useOnboardingStore";
import React from "react";

const TOTAL_STEPS = 5;

const OnboardingLayout = ({ children }) => {
  const currentStep = useOnboardingStore((state) => state.currentStep);

  return (
    <div className="relative w-full h-screen bg-[#272052] overflow-hidden">
      <OnboardingInitializer>{children}</OnboardingInitializer>
    </div>
  );
};

export default OnboardingLayout;

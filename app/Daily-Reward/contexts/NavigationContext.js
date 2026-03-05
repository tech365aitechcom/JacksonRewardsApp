"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState([]);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const endNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  const addToHistory = useCallback((route) => {
    setNavigationHistory((prev) => [...prev, route]);
  }, []);

  const goBack = useCallback(() => {
    if (navigationHistory.length > 0) {
      const previousRoute = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((prev) => prev.slice(0, -1));
      return previousRoute;
    }
    return null;
  }, [navigationHistory]);

  const clearHistory = useCallback(() => {
    setNavigationHistory([]);
  }, []);

  const value = {
    isNavigating,
    navigationHistory,
    startNavigation,
    endNavigation,
    addToHistory,
    goBack,
    clearHistory,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

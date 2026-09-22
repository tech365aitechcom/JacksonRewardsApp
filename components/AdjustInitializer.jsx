"use client";
/**
 * AdjustInitializer
 *
 * Initializes the Adjust Web SDK once per app session.
 * Fires app install (first open) and app session start events.
 *
 * Retention tracking strategy (industry best practice):
 * PRIMARY   → GET /v2/adjust/retention (backend, per-user, survives reinstalls)
 * FALLBACK  → localStorage (device-level, used only when not logged in)
 *
 * Renders nothing — purely a side-effect component.
 */
import { useEffect } from "react";
import { initAdjustSDK } from "@/lib/adjustSDK";
import {
  fetchDynamicTokens,
  fetchUserRetention,
  onAppOpenWithRetention,
  onAppInstall,
  onAppOpen,
} from "@/lib/adjustService";
import { initFromServer as initAdjustCounters } from "@/lib/adjustCounters";

export default function AdjustInitializer() {
  useEffect(() => {
    const run = async () => {

      // 1. Initialize the Web SDK
      await initAdjustSDK();

      const authToken = localStorage.getItem("authToken");

      // 2. Fetch dynamic event tokens from backend
      if (authToken) {
        try {

          await fetchDynamicTokens(authToken);
        } catch {

        }

        // 2b. Seed in-memory milestone counters from server (survives reinstalls)
        try {
          await initAdjustCounters(authToken);
        } catch {

        }
      } else {

      }

      // 3. Retention tracking — backend-driven (primary) or localStorage (fallback)
      if (authToken) {
        // PRIMARY: backend-driven (per-user, survives reinstalls & account switches)

        const retention = await fetchUserRetention(authToken);

        if (retention) {
          // Backend returned valid data — use it
          onAppOpenWithRetention(retention, authToken);

          return;
        }

      }

      // FALLBACK: localStorage (used when logged out or backend unavailable)
      // Note: device-level only — resets on reinstall, shared across accounts

      let daysSinceInstall = 0;
      try {
        const storedDate = localStorage.getItem("adjust_install_date");
        if (!storedDate) {
          localStorage.setItem("adjust_install_date", Date.now().toString());

        } else {
          const ms = Date.now() - parseInt(storedDate, 10);
          daysSinceInstall = Math.floor(ms / (1000 * 60 * 60 * 24));

        }
      } catch {
        // ignore storage errors
      }

      onAppInstall();
      onAppOpen(daysSinceInstall);

    };

    run();
  }, []);

  return null;
}

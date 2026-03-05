// File: app/components/StatusBarSetter.jsx

"use client";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export default function StatusBarSetter() {
    useEffect(() => {
        // Only run on native platforms
        const platform = Capacitor.getPlatform();
        if (platform === "web") return;

        const setBars = async () => {
            try {
                // Keep status bar visible, don't overlay content
                await StatusBar.setOverlaysWebView({ overlay: false });

                // Set status bar background to black
                await StatusBar.setBackgroundColor({ color: "#000000" });

                // Set style to Dark for light icons on dark background
                await StatusBar.setStyle({ style: Style.Dark });
            } catch (e) {
                console.warn("StatusBar config failed:", e);
            }
        };

        setBars();
    }, []);

    return null;
}
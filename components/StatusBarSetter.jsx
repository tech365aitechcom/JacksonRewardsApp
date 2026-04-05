// File: app/components/StatusBarSetter.jsx

"use client";
import { useEffect } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

const SoftInputPlugin = registerPlugin("SoftInputPlugin");

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

                // Set style to Light for white icons on dark/black background
                await StatusBar.setStyle({ style: Style.Light });

                // Set window background to solid black NOW so keyboard gaps
                // never reveal the splash image at any point in the app.
                // This runs once when JS loads (Capacitor splash still covering).
                await SoftInputPlugin.setMode({ mode: "pan" });
            } catch (e) {
                console.warn("StatusBar config failed:", e);
            }
        };

        setBars();
    }, []);

    return null;
}
#!/bin/bash

echo "🔧 Rebuilding mobile app with Stripe plugin..."

# Build the Next.js app
echo "📦 Building Next.js app..."
npm run build

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

# Copy web assets
echo "📱 Copying web assets..."
npx cap copy android

# Open Android Studio (optional)
echo "🚀 Opening Android Studio..."
npx cap open android

echo "✅ Rebuild complete! Now build and run the app in Android Studio."

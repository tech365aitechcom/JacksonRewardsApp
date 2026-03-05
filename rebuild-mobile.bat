@echo off
echo 🔧 Rebuilding mobile app with Stripe plugin...

REM Build the Next.js app
echo 📦 Building Next.js app...
call npm run build

REM Sync Capacitor
echo 🔄 Syncing Capacitor...
call npx cap sync android

REM Copy web assets
echo 📱 Copying web assets...
call npx cap copy android

REM Open Android Studio (optional)
echo 🚀 Opening Android Studio...
call npx cap open android

echo ✅ Rebuild complete! Now build and run the app in Android Studio.
pause

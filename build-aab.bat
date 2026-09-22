@echo off
setlocal
cd /d "%~dp0"
call npm run build
if errorlevel 1 exit /b 1
call npx cap sync android
if errorlevel 1 exit /b 1
cd android
call gradlew.bat bundleRelease
if errorlevel 1 exit /b 1
echo Bundle: android\app\build\outputs\bundle\release\app-release.aab
echo Configure and verify release signing before distribution.

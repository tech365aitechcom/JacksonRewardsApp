@echo off
setlocal
cd /d "%~dp0"
call npm run build
if errorlevel 1 exit /b 1
call npx cap sync android
if errorlevel 1 exit /b 1
call npx cap open android
if errorlevel 1 exit /b 1

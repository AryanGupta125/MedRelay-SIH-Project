@echo off
title MedRelay - Hyperlocal Medicine Delivery Ecosystem
cd /d "%~dp0"

echo ===================================================
echo   MedRelay - Hyperlocal Medicine Delivery Ecosystem
echo ===================================================
echo.

REM [Step 1] Ensure environment configuration exists
if not exist ".env.local" (
    if exist ".env.example" (
        echo [Config] Initializing .env.local from .env.example...
        copy .env.example .env.local >nul
    )
)

echo [1/2] Checking Dependencies...
if not exist "node_modules\" (
    echo node_modules not found. Installing packages...
    call npm install
) else (
    echo Dependencies already installed.
)
echo.

echo [2/2] Starting MedRelay Web Server...
echo Access URL: http://localhost:3000
echo.
call .\node_modules\.bin\next.cmd dev
pause

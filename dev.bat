@echo off
chcp 65001 >nul 2>&1
title SmartEstate Dev Server

echo.
echo  ========================================
echo    SmartEstate Dev Mode (Hot Reload)
echo  ========================================
echo.

pushd "%~dp0frontend"
if %errorlevel% neq 0 (
    echo  [ERROR] Failed to enter frontend directory
    pause
    exit /b 1
)

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found, please install Node.js 18+
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo  Installing dependencies - first run...
    call npm install
    if %errorlevel% neq 0 (
        echo  [ERROR] npm install failed
        pause
        exit /b 1
    )
    echo.
)

echo  Starting dev server...
echo  URL: http://localhost:5180
echo  Press Ctrl+C to stop
echo.

call npx vite --host 0.0.0.0 --port 5180

popd
pause

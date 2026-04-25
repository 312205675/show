@echo off
chcp 65001 >nul 2>&1
title SmartEstate Deploy

echo.
echo  ========================================
echo    SmartEstate - One-Click Deploy
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

echo  [1/3] Checking environment...
node -v
echo.

if not exist "node_modules\" (
    echo  [2/3] Installing dependencies - first run...
    call npm install
    if %errorlevel% neq 0 (
        echo  [ERROR] npm install failed
        pause
        exit /b 1
    )
) else (
    echo  [2/3] Dependencies installed, skipping
)
echo.

echo  [3/3] Building production bundle...
call npx vite build
if %errorlevel% neq 0 (
    echo  [ERROR] Build failed
    pause
    exit /b 1
)
echo.

echo  ========================================
echo    Build complete!
echo  ========================================
echo.
echo  Starting preview server...
echo  URL: http://localhost:5180
echo  Press Ctrl+C to stop
echo.

call npx vite preview --host 0.0.0.0 --port 5180

popd
pause

@echo off
setlocal enabledelayedexpansion
title SmartEstate Dev Server

echo.
echo  ========================================
echo    SmartEstate Dev Mode (Hot Reload)
echo  ========================================
echo.

pushd "%~dp0frontend"
if !errorlevel! neq 0 (
    echo  [ERROR] Cannot enter frontend directory
    pause
    exit /b 1
)

where node >nul 2>&1
if !errorlevel! neq 0 (
    echo  [ERROR] Node.js not found, please install Node.js 18+
    echo  Download: https://nodejs.org/
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo  [1/2] First run - installing dependencies...
    call npm install
    if !errorlevel! neq 0 (
        echo  [ERROR] npm install failed
        popd
        pause
        exit /b 1
    )
    echo.
) else (
    echo  [1/2] Dependencies ready
)

echo  [2/2] Starting dev server...
echo.
echo  ----------------------------------------
echo    Local:    http://localhost:5180
echo    Network:  http://0.0.0.0:5180
echo    Press Ctrl+C to stop
echo  ----------------------------------------
echo.

call npx vite --host 0.0.0.0 --port 5180

popd
pause

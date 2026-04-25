@echo off
chcp 65001 >nul 2>&1
title SmartEstate 开发服务器

echo.
echo  ========================================
echo    SmartEstate 开发模式 (Hot Reload)
echo  ========================================
echo.

cd /d "%~dp0frontend"

if not exist "node_modules\" (
    echo  首次运行，安装依赖...
    call npm install
    echo.
)

echo  启动开发服务器...
echo  访问地址: http://localhost:5180
echo  按 Ctrl+C 停止
echo.

call node ./node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5180

pause

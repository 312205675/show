@echo off
chcp 65001 >nul 2>&1
title SmartEstate 一键部署

echo.
echo  ========================================
echo    SmartEstate 集团决策大盘 - 一键部署
echo  ========================================
echo.

cd /d "%~dp0frontend"

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [错误] 未检测到 Node.js，请先安装 Node.js 18+
    pause
    exit /b 1
)

echo  [1/3] 检查环境...
node -v
echo.

if not exist "node_modules\" (
    echo  [2/3] 安装依赖（首次运行，请耐心等待）...
    call npm install
    if %errorlevel% neq 0 (
        echo  [错误] 依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo  [2/3] 依赖已安装，跳过
)
echo.

echo  [3/3] 构建生产包...
call node ./node_modules/vite/bin/vite.js build
if %errorlevel% neq 0 (
    echo  [错误] 构建失败
    pause
    exit /b 1
)
echo.

echo  ========================================
echo    构建完成！
echo  ========================================
echo.
echo  启动预览服务器...
echo  访问地址: http://localhost:5180
echo  按 Ctrl+C 停止
echo.

call node ./node_modules/vite/bin/vite.js preview --host 0.0.0.0 --port 5180

pause

@echo off
chcp 65001 >nul 2>&1
title SmartEstate Deploy

echo.
echo  ========================================
echo    SmartEstate - Docker 部署工具
echo  ========================================
echo.

:: ===== 检查 Docker =====
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Docker 未安装，请先安装 Docker
    echo  下载地址: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Docker 未启动，请先启动 Docker Desktop
    pause
    exit /b 1
)

echo  [OK] Docker 已就绪
echo.

:: ===== 菜单 =====
echo  请选择操作:
echo.
echo    1. 构建并启动（首次部署 / 重新部署）
echo    2. 停止服务
echo    3. 重启服务
echo    4. 查看日志
echo    5. 清理旧镜像
echo    6. 仅构建镜像（不启动）
echo.
set /p choice=  请输入选项 (1-6): 

if "%choice%"=="1" goto deploy
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto clean
if "%choice%"=="6" goto build_only
echo  [ERROR] 无效选项
pause
exit /b 1

:: ===== 构建并启动 =====
:deploy
echo.
echo  [1/3] 构建镜像...
docker compose build --no-cache
if %errorlevel% neq 0 (
    echo  [ERROR] 镜像构建失败
    pause
    exit /b 1
)

echo.
echo  [2/3] 停止旧容器...
docker compose down 2>nul

echo.
echo  [3/3] 启动服务...
docker compose up -d
if %errorlevel% neq 0 (
    echo  [ERROR] 启动失败
    pause
    exit /b 1
)

echo.
echo  ========================================
echo    部署成功！
echo  ========================================
echo.
echo    访问地址: http://localhost
echo    查看日志: docker compose logs -f
echo    停止服务: docker compose down
echo.
goto end

:: ===== 停止服务 =====
:stop
echo.
echo  停止服务...
docker compose down
echo  [OK] 服务已停止
goto end

:: ===== 重启服务 =====
:restart
echo.
echo  重启服务...
docker compose restart
echo  [OK] 服务已重启
goto end

:: ===== 查看日志 =====
:logs
echo.
echo  实时日志（Ctrl+C 退出）:
echo.
docker compose logs -f --tail 100
goto end

:: ===== 清理旧镜像 =====
:clean
echo.
echo  清理未使用的 Docker 镜像...
docker image prune -f
echo  [OK] 清理完成
goto end

:: ===== 仅构建镜像 =====
:build_only
echo.
echo  构建镜像...
docker compose build --no-cache
if %errorlevel% neq 0 (
    echo  [ERROR] 构建失败
    pause
    exit /b 1
)
echo  [OK] 构建完成
goto end

:end
pause

@echo off
setlocal enabledelayedexpansion
title SmartEstate Deploy

:menu
cls
echo.
echo  ========================================
echo    SmartEstate - Deploy Tool
echo  ========================================
echo.
echo  -- Local Deploy -----------------------
echo    1. Local build + preview (no Docker)
echo    2. Local Docker deploy
echo.
echo  -- Aliyun Deploy ----------------------
echo    3. Build image + push to ACR
echo    4. SSH deploy to Aliyun ECS
echo    5. One-click Aliyun deploy (ACR+ECS)
echo.
echo  -- Service Management -----------------
echo    6. Stop local Docker service
echo    7. Restart local Docker service
echo    8. View local Docker logs
echo    9. Clean unused images
echo.
echo    0. Exit
echo.
set /p choice=  Select (0-9): 

if "%choice%"=="1" goto local_deploy
if "%choice%"=="2" goto docker_deploy
if "%choice%"=="3" goto acr_push
if "%choice%"=="4" goto ecs_deploy
if "%choice%"=="5" goto cloud_all
if "%choice%"=="6" goto stop
if "%choice%"=="7" goto restart
if "%choice%"=="8" goto logs
if "%choice%"=="9" goto clean
if "%choice%"=="0" exit /b 0
echo  [ERROR] Invalid option
timeout /t 2 >nul
goto menu

:: ============================================================
::  1. Local build + preview (no Docker)
:: ============================================================
:local_deploy
cls
echo.
echo  -- Local Deploy Mode ------------------
echo.

where node >nul 2>&1
if !errorlevel! neq 0 (
    echo  [ERROR] Node.js not found, please install Node.js 18+
    echo  Download: https://nodejs.org/
    pause
    goto menu
)

pushd "%~dp0frontend"

if not exist "node_modules\" (
    echo  [1/3] Installing dependencies...
    call npm install
    if !errorlevel! neq 0 (
        echo  [ERROR] npm install failed
        popd
        pause
        goto menu
    )
    echo.
) else (
    echo  [1/3] Dependencies already installed, skipping
    echo.
)

echo  [2/3] Building production bundle...
call npx vite build
if !errorlevel! neq 0 (
    echo  [ERROR] Build failed
    popd
    pause
    goto menu
)
echo.

echo  [3/3] Starting preview server...
echo.
echo  ========================================
echo    Preview server started
echo    URL: http://localhost:4173
echo    Press Ctrl+C to stop
echo  ========================================
echo.
call npx vite preview --host 0.0.0.0 --port 4173

popd
pause
goto menu

:: ============================================================
::  2. Local Docker deploy
:: ============================================================
:docker_deploy
cls
echo.
echo  -- Local Docker Deploy ----------------
echo.

call :check_docker
if !errorlevel! neq 0 goto menu

echo  [1/3] Building image...
docker compose build --no-cache
if !errorlevel! neq 0 (
    echo  [ERROR] Image build failed
    pause
    goto menu
)

echo.
echo  [2/3] Stopping old containers...
docker compose down 2>nul

echo.
echo  [3/3] Starting service...
docker compose up -d
if !errorlevel! neq 0 (
    echo  [ERROR] Start failed
    pause
    goto menu
)

echo.
echo  ========================================
echo    Deploy success!
echo    URL: http://localhost
echo    Logs:  docker compose logs -f
echo    Stop:  Select menu option 6
echo  ========================================
echo.
pause
goto menu

:: ============================================================
::  3. Build image + push to ACR
:: ============================================================
:acr_push
cls
echo.
echo  -- Push to Aliyun ACR -----------------
echo.

call :check_docker
if !errorlevel! neq 0 goto menu

set /p "ACR_REGISTRY=  ACR registry (e.g. registry.cn-hangzhou.aliyuncs.com): "
set /p "ACR_NAMESPACE=  ACR namespace (e.g. smartestate): "
set /p "ACR_IMAGE=  Image name (e.g. smartestate-web): "
set /p "ACR_TAG=  Image tag (default: latest): "
if "%ACR_TAG%"=="" set ACR_TAG=latest

set "FULL_IMAGE=%ACR_REGISTRY%/%ACR_NAMESPACE%/%ACR_IMAGE%:%ACR_TAG%"

echo.
echo  Target image: %FULL_IMAGE%
echo.

echo  [1/4] Logging in to ACR...
docker login %ACR_REGISTRY%
if !errorlevel! neq 0 (
    echo  [ERROR] ACR login failed, check your credentials
    pause
    goto menu
)

echo.
echo  [2/4] Building image...
docker compose build --no-cache
if !errorlevel! neq 0 (
    echo  [ERROR] Image build failed
    pause
    goto menu
)

echo.
echo  [3/4] Tagging image...
docker tag smartestate-web %FULL_IMAGE%
if !errorlevel! neq 0 (
    echo  [ERROR] Tag failed - image name mismatch
    echo  Hint: Make sure docker-compose.yml has container_name: smartestate-web
    pause
    goto menu
)

echo.
echo  [4/4] Pushing to ACR...
docker push %FULL_IMAGE%
if !errorlevel! neq 0 (
    echo  [ERROR] Push failed
    pause
    goto menu
)

echo.
echo  ========================================
echo    Push success!
echo    Image: %FULL_IMAGE%
echo.
echo    Pull on ECS:
echo      docker pull %FULL_IMAGE%
echo      docker run -d -p 80:80 --name smartestate-web %FULL_IMAGE%
echo  ========================================
echo.
pause
goto menu

:: ============================================================
::  4. SSH deploy to Aliyun ECS
:: ============================================================
:ecs_deploy
cls
echo.
echo  -- SSH Deploy to Aliyun ECS -----------
echo.

call :check_docker
if !errorlevel! neq 0 goto menu

set /p "ECS_HOST=  ECS public IP: "
set /p "ECS_USER=  SSH user (default: root): "
if "%ECS_USER%"=="" set ECS_USER=root
set /p "ECS_PORT=  SSH port (default: 22): "
if "%ECS_PORT%"=="" set ECS_PORT=22

echo.
echo  Deploy method:
echo    1. Pull image from ACR
echo    2. Upload source and build on ECS
echo.
set /p "deploy_method=  Select (1-2): "

if "%deploy_method%"=="1" goto ecs_from_acr
if "%deploy_method%"=="2" goto ecs_from_source
echo  [ERROR] Invalid option
pause
goto menu

:ecs_from_acr
set /p "ACR_IMAGE_PULL=  ACR image URL (e.g. registry.cn-hangzhou.aliyuncs.com/ns/app:latest): "

echo.
echo  [1/3] Pulling image on ECS via SSH...
ssh -p %ECS_PORT% %ECS_USER%@%ECS_HOST% "docker pull %ACR_IMAGE_PULL%"
if !errorlevel! neq 0 (
    echo  [ERROR] Pull failed. Check:
    echo    1. Docker installed on ECS
    echo    2. ACR logged in on ECS (docker login)
    echo    3. Image URL is correct
    pause
    goto menu
)

echo.
echo  [2/3] Stopping old container and starting new one...
ssh -p %ECS_PORT% %ECS_USER%@%ECS_HOST% "docker rm -f smartestate-web 2>/dev/null; docker run -d -p 80:80 --restart=always --name smartestate-web -e TZ=Asia/Shanghai %ACR_IMAGE_PULL%"
if !errorlevel! neq 0 (
    echo  [ERROR] Container start failed
    pause
    goto menu
)

echo.
echo  [3/3] Verifying...
ssh -p %ECS_PORT% %ECS_USER%@%ECS_HOST% "docker ps --filter name=smartestate-web"

echo.
echo  ========================================
echo    ECS deploy success!
echo    URL: http://%ECS_HOST%
echo.
echo    Manage commands:
echo      ssh -p %ECS_PORT% %ECS_USER%@%ECS_HOST%
echo      docker logs -f smartestate-web
echo      docker restart smartestate-web
echo      docker stop smartestate-web
echo  ========================================
echo.
pause
goto menu

:ecs_from_source
echo.
echo  [1/4] Packaging and uploading project...
tar -cf - --exclude=node_modules --exclude=dist --exclude=.git --exclude=target --exclude=src --exclude=pom.xml -C "%~dp0." . | ssh -p %ECS_PORT% %ECS_USER%@%ECS_HOST% "mkdir -p /opt/smartestate && cd /opt/smartestate && tar -xf -"
if !errorlevel! neq 0 (
    echo  [ERROR] Upload failed, check SSH connection
    pause
    goto menu
)

echo.
echo  [2/4] Building image on ECS...
ssh -p %ECS_PORT% %ECS_USER%@%ECS_HOST% "cd /opt/smartestate && docker compose build --no-cache"
if !errorlevel! neq 0 (
    echo  [ERROR] Build failed
    pause
    goto menu
)

echo.
echo  [3/4] Starting service...
ssh -p %ECS_PORT% %ECS_USER%@%ECS_HOST% "cd /opt/smartestate && docker compose down 2>/dev/null; docker compose up -d"
if !errorlevel! neq 0 (
    echo  [ERROR] Start failed
    pause
    goto menu
)

echo.
echo  [4/4] Verifying...
ssh -p %ECS_PORT% %ECS_USER%@%ECS_HOST% "cd /opt/smartestate && docker compose ps"

echo.
echo  ========================================
echo    ECS deploy success!
echo    URL: http://%ECS_HOST%
echo.
echo    Project dir: /opt/smartestate
echo    Manage:
echo      ssh -p %ECS_PORT% %ECS_USER%@%ECS_HOST%
echo      cd /opt/smartestate && docker compose logs -f
echo  ========================================
echo.
pause
goto menu

:: ============================================================
::  5. One-click Aliyun deploy (ACR + ECS)
:: ============================================================
:cloud_all
cls
echo.
echo  -- One-click Aliyun Deploy ------------
echo.

call :check_docker
if !errorlevel! neq 0 goto menu

set /p "ACR_REGISTRY=  ACR registry (e.g. registry.cn-hangzhou.aliyuncs.com): "
set /p "ACR_NAMESPACE=  ACR namespace (e.g. smartestate): "
set /p "ACR_IMAGE=  Image name (e.g. smartestate-web): "
set /p "ACR_TAG=  Image tag (default: latest): "
if "%ACR_TAG%"=="" set ACR_TAG=latest
set "FULL_IMAGE=%ACR_REGISTRY%/%ACR_NAMESPACE%/%ACR_IMAGE%:%ACR_TAG%"

set /p "ECS_HOST=  ECS public IP: "
set /p "ECS_USER=  SSH user (default: root): "
if "%ECS_USER%"=="" set ECS_USER=root
set /p "ECS_PORT=  SSH port (default: 22): "
if "%ECS_PORT%"=="" set ECS_PORT=22

echo.
echo  -- Deploy Summary ---------------------
echo    Image:  %FULL_IMAGE%
echo    Target: %ECS_USER%@%ECS_HOST%:%ECS_PORT%
echo.
set /p "confirm=  Confirm deploy? (Y/N): "
if /i not "%confirm%"=="Y" goto menu

echo.
echo  [1/6] Logging in to ACR...
docker login %ACR_REGISTRY%
if !errorlevel! neq 0 (
    echo  [ERROR] ACR login failed
    pause
    goto menu
)

echo.
echo  [2/6] Building image...
docker compose build --no-cache
if !errorlevel! neq 0 (
    echo  [ERROR] Build failed
    pause
    goto menu
)

echo.
echo  [3/6] Tagging image...
docker tag smartestate-web %FULL_IMAGE%

echo.
echo  [4/6] Pushing to ACR...
docker push %FULL_IMAGE%
if !errorlevel! neq 0 (
    echo  [ERROR] Push failed
    pause
    goto menu
)

echo.
echo  [5/6] Pulling and starting on ECS...
ssh -p %ECS_PORT% %ECS_USER%@%ECS_HOST% "docker pull %FULL_IMAGE% && docker rm -f smartestate-web 2>/dev/null; docker run -d -p 80:80 --restart=always --name smartestate-web -e TZ=Asia/Shanghai %FULL_IMAGE%"
if !errorlevel! neq 0 (
    echo  [ERROR] ECS deploy failed
    pause
    goto menu
)

echo.
echo  [6/6] Verifying...
ssh -p %ECS_PORT% %ECS_USER%@%ECS_HOST% "docker ps --filter name=smartestate-web"

echo.
echo  ========================================
echo    One-click deploy complete!
echo.
echo    Image: %FULL_IMAGE%
echo    URL:   http://%ECS_HOST%
echo  ========================================
echo.
pause
goto menu

:: ============================================================
::  6. Stop service
:: ============================================================
:stop
cls
echo.
echo  Stopping local Docker service...
docker compose down
echo  [OK] Service stopped
echo.
pause
goto menu

:: ============================================================
::  7. Restart service
:: ============================================================
:restart
cls
echo.
echo  Restarting local Docker service...
docker compose restart
echo  [OK] Service restarted
echo.
pause
goto menu

:: ============================================================
::  8. View logs
:: ============================================================
:logs
cls
echo.
echo  Live logs (Ctrl+C to exit):
echo.
docker compose logs -f --tail 100
goto menu

:: ============================================================
::  9. Clean unused images
:: ============================================================
:clean
cls
echo.
echo  Cleaning unused Docker images...
docker image prune -f
echo  [OK] Cleanup complete
echo.
pause
goto menu

:: ============================================================
::  Check Docker availability
:: ============================================================
:check_docker
where docker >nul 2>&1
if !errorlevel! neq 0 (
    echo  [ERROR] Docker not found, please install Docker
    echo  Download: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker info >nul 2>&1
if !errorlevel! neq 0 (
    echo  [ERROR] Docker not running, please start Docker Desktop
    pause
    exit /b 1
)

echo  [OK] Docker is ready
echo.
exit /b 0

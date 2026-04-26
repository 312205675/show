#!/bin/bash
# ============================================================
#  SmartEstate 阿里云 ECS 一键部署脚本
#  使用方法: bash deploy-aliyun.sh
# ============================================================

set -e

# ── 颜色定义 ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ── 配置区（按需修改） ──
DEPLOY_DIR="/opt/smartestate"
PORT=80
IMAGE_NAME="smartestate-web"
TZ="Asia/Shanghai"

# ── ACR 配置（选填，推送到阿里云镜像仓库时使用） ──
ACR_REGISTRY=""       # 如: registry.cn-hangzhou.aliyuncs.com
ACR_NAMESPACE=""      # 如: smartestate
ACR_IMAGE=""          # 如: smartestate-web
ACR_TAG="latest"

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║   SmartEstate 阿里云 ECS 部署工具        ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""

# ── 检查 Docker ──
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}  [ERROR] Docker 未安装${NC}"
        echo "  安装命令: curl -fsSL https://get.docker.com | sh"
        exit 1
    fi

    if ! docker info &> /dev/null; then
        echo -e "${RED}  [ERROR] Docker 未启动${NC}"
        echo "  启动命令: systemctl start docker"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}  [ERROR] Docker Compose 未安装${NC}"
        exit 1
    fi

    echo -e "${GREEN}  [OK] Docker 已就绪${NC}"
}

# ── 方式一：源码构建部署 ──
deploy_from_source() {
    echo ""
    echo -e "${CYAN}  ── 源码构建部署 ──${NC}"
    echo ""

    cd "$DEPLOY_DIR"

    echo "  [1/3] 构建镜像..."
    docker compose build --no-cache

    echo ""
    echo "  [2/3] 停止旧容器..."
    docker compose down 2>/dev/null || true

    echo ""
    echo "  [3/3] 启动服务..."
    docker compose up -d

    echo ""
    echo -e "${GREEN}  ══════════════════════════════════════════${NC}"
    echo -e "${GREEN}    部署成功！${NC}"
    echo "    访问地址: http://$(hostname -I | awk '{print $1}')"
    echo "    管理命令: cd $DEPLOY_DIR && docker compose logs -f"
    echo -e "${GREEN}  ══════════════════════════════════════════${NC}"
}

# ── 方式二：ACR 镜像部署 ──
deploy_from_acr() {
    echo ""
    echo -e "${CYAN}  ── ACR 镜像部署 ──${NC}"
    echo ""

    if [ -z "$ACR_REGISTRY" ] || [ -z "$ACR_NAMESPACE" ] || [ -z "$ACR_IMAGE" ]; then
        echo -e "${YELLOW}  请先在脚本顶部配置 ACR 信息${NC}"
        read -p "  ACR 仓库地址: " ACR_REGISTRY
        read -p "  ACR 命名空间: " ACR_NAMESPACE
        read -p "  ACR 镜像名称: " ACR_IMAGE
    fi

    FULL_IMAGE="${ACR_REGISTRY}/${ACR_NAMESPACE}/${ACR_IMAGE}:${ACR_TAG}"

    echo "  目标镜像: $FULL_IMAGE"
    echo ""

    # 登录 ACR
    echo "  [1/3] 登录 ACR..."
    docker login "$ACR_REGISTRY"

    # 拉取镜像
    echo ""
    echo "  [2/3] 拉取镜像..."
    docker pull "$FULL_IMAGE"

    # 启动容器
    echo ""
    echo "  [3/3] 启动容器..."
    docker rm -f "$IMAGE_NAME" 2>/dev/null || true
    docker run -d \
        -p ${PORT}:80 \
        --restart=always \
        --name "$IMAGE_NAME" \
        -e TZ="$TZ" \
        "$FULL_IMAGE"

    echo ""
    echo -e "${GREEN}  ══════════════════════════════════════════${NC}"
    echo -e "${GREEN}    部署成功！${NC}"
    echo "    访问地址: http://$(hostname -I | awk '{print $1}')"
    echo "    管理命令: docker logs -f $IMAGE_NAME"
    echo -e "${GREEN}  ══════════════════════════════════════════${NC}"
}

# ── 推送镜像到 ACR ──
push_to_acr() {
    echo ""
    echo -e "${CYAN}  ── 推送镜像到 ACR ──${NC}"
    echo ""

    if [ -z "$ACR_REGISTRY" ] || [ -z "$ACR_NAMESPACE" ] || [ -z "$ACR_IMAGE" ]; then
        read -p "  ACR 仓库地址: " ACR_REGISTRY
        read -p "  ACR 命名空间: " ACR_NAMESPACE
        read -p "  ACR 镜像名称: " ACR_IMAGE
    fi

    FULL_IMAGE="${ACR_REGISTRY}/${ACR_NAMESPACE}/${ACR_IMAGE}:${ACR_TAG}"

    echo "  [1/4] 构建镜像..."
    cd "$DEPLOY_DIR"
    docker compose build --no-cache

    echo ""
    echo "  [2/4] 登录 ACR..."
    docker login "$ACR_REGISTRY"

    echo ""
    echo "  [3/4] 打标签..."
    docker tag "$IMAGE_NAME" "$FULL_IMAGE"

    echo ""
    echo "  [4/4] 推送..."
    docker push "$FULL_IMAGE"

    echo ""
    echo -e "${GREEN}  推送成功！镜像: $FULL_IMAGE${NC}"
}

# ── 停止服务 ──
stop_service() {
    echo ""
    if [ -f "$DEPLOY_DIR/docker-compose.yml" ]; then
        cd "$DEPLOY_DIR" && docker compose down
    else
        docker rm -f "$IMAGE_NAME" 2>/dev/null || true
    fi
    echo -e "${GREEN}  [OK] 服务已停止${NC}"
}

# ── 查看日志 ──
show_logs() {
    echo ""
    if [ -f "$DEPLOY_DIR/docker-compose.yml" ]; then
        cd "$DEPLOY_DIR" && docker compose logs -f --tail 100
    else
        docker logs -f --tail 100 "$IMAGE_NAME"
    fi
}

# ── 主菜单 ──
check_docker

echo ""
echo "  请选择操作:"
echo ""
echo "    1. 源码构建部署（本机有项目源码）"
echo "    2. ACR 镜像部署（从阿里云镜像仓库拉取）"
echo "    3. 推送镜像到 ACR"
echo "    4. 停止服务"
echo "    5. 重启服务"
echo "    6. 查看日志"
echo "    7. 清理旧镜像"
echo "    0. 退出"
echo ""
read -p "  请输入选项 (0-7): " choice

case $choice in
    1) deploy_from_source ;;
    2) deploy_from_acr ;;
    3) push_to_acr ;;
    4) stop_service ;;
    5)
        echo ""
        if [ -f "$DEPLOY_DIR/docker-compose.yml" ]; then
            cd "$DEPLOY_DIR" && docker compose restart
        else
            docker restart "$IMAGE_NAME"
        fi
        echo -e "${GREEN}  [OK] 服务已重启${NC}"
        ;;
    6) show_logs ;;
    7)
        echo ""
        docker image prune -f
        echo -e "${GREEN}  [OK] 清理完成${NC}"
        ;;
    0) exit 0 ;;
    *) echo -e "${RED}  无效选项${NC}"; exit 1 ;;
esac

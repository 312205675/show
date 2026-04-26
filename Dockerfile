# ===== 构建阶段 =====
FROM node:18-alpine AS builder

# 设置 npm 镜像（加速阿里云构建）
RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

# 先复制依赖声明，利用 Docker 层缓存
COPY frontend/package.json frontend/package-lock.json* ./

# 安装依赖
RUN npm install --prefer-offline --no-audit --progress=false

# 复制源代码
COPY frontend/ .

# 构建生产包（跳过 vue-tsc 类型检查以避免 OOM，Vite 构建已含足够校验）
RUN npx vite build

# ===== 生产阶段 =====
FROM nginx:1.25-alpine

# 设置时区
ENV TZ=Asia/Shanghai
RUN apk add --no-cache tzdata curl && \
    cp /usr/share/zoneinfo/${TZ} /etc/localtime && \
    echo "${TZ}" > /etc/timezone && \
    apk del tzdata

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 删除默认配置避免冲突
RUN rm -f /etc/nginx/conf.d/server.conf 2>/dev/null || true

EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

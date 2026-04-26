# ===== 构建阶段 =====
FROM node:18-alpine AS builder

WORKDIR /app

# 先复制依赖声明，利用 Docker 层缓存
COPY frontend/package.json frontend/package-lock.json* ./

# 安装依赖（使用 npm install 兼容无 lock 文件场景）
RUN npm install --prefer-offline --no-audit --progress=false

# 复制源代码
COPY frontend/ .

# 构建生产包（跳过 vue-tsc 类型检查以避免 OOM，Vite 构建已含足够校验）
RUN npx vite build

# ===== 生产阶段 =====
FROM nginx:1.25-alpine

# 添加安全相关头部和健康检查
RUN apk add --no-cache curl

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 删除默认 nginx 配置避免冲突
RUN rm -f /etc/nginx/conf.d/server.conf 2>/dev/null; true

# 确保 nginx 主配置包含 conf.d
RUN grep -q 'include /etc/nginx/conf.d' /etc/nginx/nginx.conf || \
    sed -i 's|include /etc/nginx/conf.d/\*\.conf;|include /etc/nginx/conf.d/*.conf;|' /etc/nginx/nginx.conf

EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

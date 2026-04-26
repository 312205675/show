<template>
  <div class="indicator-overview-page" @mousemove="onPageMouseMove" :class="{ 'intro-active': !introDone }">
    <!-- ===== 入场动画遮罩 ===== -->
    <Teleport to="body">
      <Transition name="intro-fade">
        <div v-if="!introDone" class="intro-overlay" :class="'intro-phase-' + introPhase">
          <!-- 阶段0: 黑屏等待 -->
          <!-- 阶段1: 核心充能 - 旋转的六边形 + 能量环 -->
          <div v-if="introPhase >= 1" class="intro-core">
            <!-- 六边形引擎核心 -->
            <div class="intro-hex-core">
              <svg width="160" height="160" viewBox="-80 -80 160 160" class="intro-hex-svg">
                <polygon
                  v-for="r in 3" :key="'ring'+r"
                  :points="hexRingPoints(26 * r, 6 + r * 2)"
                  fill="none"
                  :stroke="['rgba(96,165,250,0.2)','rgba(167,139,250,0.25)','rgba(34,197,94,0.3)'][r-1]"
                  :stroke-width="1.5 - r * 0.3"
                  :class="'intro-hex-ring intro-hex-ring-' + r"
                />
              </svg>
              <div class="intro-core-glow" />
              <div class="intro-core-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
            <!-- 环绕粒子 -->
            <div class="intro-orbit-particles">
              <div
                v-for="p in introRingParticles" :key="p.id"
                class="intro-orbit-dot"
                :style="{
                  '--orbit-angle': p.angle + 'deg',
                  '--orbit-radius': p.orbitRadius + 'px',
                  '--orbit-speed': p.speed + 's',
                  '--dot-size': p.size + 'px',
                  '--dot-color': p.color,
                  animationDelay: p.delay + 's',
                }"
              />
            </div>
          </div>

          <!-- 阶段2: 数据爆发 - 径向数据流 + 矩阵雨 -->
          <div v-if="introPhase >= 2" class="intro-burst">
            <!-- 径向数据流 -->
            <div
              v-for="s in introDataStreams" :key="s.id"
              class="intro-stream"
              :style="{
                '--stream-angle': s.angle + 'deg',
                '--stream-length': s.length + 'px',
                '--stream-width': s.width + 'px',
                '--stream-color': s.color,
                animationDelay: s.delay + 's',
              }"
            />
            <!-- 矩阵数字雨 -->
            <div class="intro-matrix">
              <div
                v-for="line in introMatrixLines" :key="line.id"
                class="intro-matrix-line"
                :style="{
                  left: line.x + '%',
                  animationDelay: line.delay + 's',
                  animationDuration: line.duration + 's',
                }"
              >{{ line.chars }}</div>
            </div>
            <!-- 冲击波 -->
            <div class="intro-shockwave intro-shockwave-1" />
            <div class="intro-shockwave intro-shockwave-2" />
          </div>

          <!-- 阶段3: 引擎标识 -->
          <div v-if="introPhase >= 3" class="intro-engine-label">
            <div class="intro-engine-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <div class="intro-engine-text">
              <span class="intro-engine-title">DATA ENGINE</span>
              <span class="intro-engine-sub">860万条数据 · 30秒刷新 · 实时计算</span>
            </div>
            <div class="intro-engine-bar">
              <div class="intro-engine-bar-fill" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 动态背景光晕 -->
    <div class="dynamic-glow" :style="{ left: mouseX + 'px', top: mouseY + 'px' }" />
    <!-- 装饰粒子 -->
    <div class="bg-particles">
      <div v-for="p in bgParticles" :key="p.id" class="bg-particle" :style="p.style" />
    </div>

    <!-- 顶部装饰线条 -->
    <div class="top-deco">
      <div class="deco-line" />
      <div class="deco-dot" />
      <div class="deco-line" />
    </div>

    <!-- 页头 -->
    <header class="page-header">
      <button class="back-btn" @click="goBack">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回首页
      </button>
      <div class="header-center">
        <div class="header-badge">EXECUTIVE BRIEFING</div>
        <h1 class="header-title">
          <span v-for="(ch, i) in headerTitleChars" :key="i" class="header-char" :style="{ animationDelay: (i * 50) + 'ms' }">{{ ch }}</span>
        </h1>
        <div class="header-sub">SmartEstate 指标全览 · 决策全景透视 · {{ totalIndicators }}项指标精炼至6大核心</div>
      </div>
      <div class="header-right">
        <span class="live-badge"><span class="live-dot" />LIVE</span>
        <span class="header-time">{{ currentTime }}</span>
      </div>
    </header>

    <!-- 六大核心指标 Hero 区域 -->
    <section class="core-hero">
      <div class="core-hero-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        六大核心指标 — 每日必盯
      </div>
      <div class="core-grid">
        <div v-for="(core, i) in coreIndicators" :key="core.key" class="core-card zoomable" :class="'core-card-' + i" :style="{ '--core-color': core.color, animationDelay: (i * 120) + 'ms' }" @click="openZoom('core', core)">
          <div class="core-card-glow" />
          <div class="core-card-border-glow" />
          <div class="core-rank">{{ i + 1 }}</div>
          <div class="core-content">
            <div class="core-name">{{ core.name }}</div>
            <div class="core-value" :style="{ color: core.color }">
              <span class="core-num">{{ core.displayValue }}</span>
              <span class="core-unit">{{ core.unit }}</span>
            </div>
            <div class="core-bar">
              <div class="core-bar-fill" :style="{ width: core.barPercent + '%', background: core.color }" />
            </div>
            <div class="core-why">{{ core.why }}</div>
          </div>
          <div class="core-status" :class="core.status">{{ core.statusText }}</div>
        </div>
      </div>
    </section>

    <!-- 分隔线 -->
    <div class="section-divider">
      <div class="sd-line" />
      <div class="sd-diamond" />
      <div class="sd-line" />
    </div>

    <!-- 指标体系全景 -->
    <section class="indicator-panorama">
      <div class="panorama-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20"/><path d="M2 12h20"/></svg>
        指标体系全景 · 十大维度 {{ totalIndicators }}+项指标
      </div>
      <div class="panorama-grid">
        <div v-for="(group, gi) in indicatorGroups" :key="group.title" class="panorama-group zoomable" :style="{ '--group-color': group.color, animationDelay: (gi * 80) + 'ms' }" @click="openZoom('group', group)">
          <div class="pg-header">
            <span class="pg-icon" v-html="group.icon" />
            <span class="pg-title">{{ group.title }}</span>
            <span class="pg-count">{{ group.indicators.length }}项</span>
          </div>
          <div class="pg-list">
            <div v-for="ind in group.indicators" :key="ind.name" class="pg-item" :class="{ 'pg-item-core': ind.isCore }">
              <span class="pgi-name">{{ ind.name }}</span>
              <span class="pgi-desc">{{ ind.desc }}</span>
              <span v-if="ind.isCore" class="pgi-core-badge">核心</span>
            </div>
          </div>
          <div class="pg-insight">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            {{ group.bossWhy }}
          </div>
        </div>
      </div>
    </section>

    <!-- 分隔线 -->
    <div class="section-divider">
      <div class="sd-line" />
      <div class="sd-diamond" />
      <div class="sd-line" />
    </div>

    <!-- 决策全景解读 -->
    <section class="decision-interpretation">
      <div class="interp-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
        决策全景解读
      </div>
      <div class="interp-grid">
        <div v-for="(item, i) in bossInterpretations" :key="i" class="interp-card zoomable" :style="{ borderLeftColor: item.color, animationDelay: (i * 120) + 'ms' }" @click="openZoom('interp', item)">
          <div class="interp-card-header">
            <span class="interp-card-icon" v-html="item.icon" />
            <span class="interp-card-title">{{ item.title }}</span>
          </div>
          <div class="interp-card-body">{{ item.content }}</div>
          <div class="interp-card-action">{{ item.action }}</div>
        </div>
      </div>
    </section>

    <!-- 分隔线 -->
    <div class="section-divider">
      <div class="sd-line" />
      <div class="sd-diamond" />
      <div class="sd-line" />
    </div>

    <!-- 系统能力展示 -->
    <section class="system-capabilities">
      <div class="cap-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        系统能力全景
      </div>
      <div class="cap-grid">
        <div v-for="(cap, i) in systemCapabilities" :key="i" class="cap-card zoomable" :style="{ '--cap-color': cap.color, animationDelay: (i * 100) + 'ms' }" @click="openZoom('cap', cap)">
          <div class="cap-icon" v-html="cap.icon" />
          <div class="cap-name">{{ cap.name }}</div>
          <div class="cap-desc">{{ cap.desc }}</div>
          <div class="cap-metrics">
            <span v-for="m in cap.metrics" :key="m" class="cap-metric">{{ m }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="page-footer">
      <div class="footer-line" />
      <div class="footer-content">
        <span class="footer-brand">SMART<span class="footer-accent">ESTATE</span></span>
        <span class="footer-divider" />
        <span class="footer-text">石家庄城发投 · 智慧楼盘数据中台 · 集团决策驾驶舱</span>
        <span class="footer-divider" />
        <span class="footer-version">v3.2.1</span>
      </div>
    </footer>

    <!-- 点击放大弹窗 -->
    <Teleport to="body">
      <Transition name="zoom-overlay">
        <div v-if="zoomedItem" class="zoom-overlay" @click.self="closeZoom">
          <div class="zoom-backdrop" @click="closeZoom" />
          <div class="zoom-panel" :class="'zoom-panel--' + zoomedItem.type">
            <button class="zoom-close" @click="closeZoom">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <!-- 核心指标放大 -->
            <template v-if="zoomedItem.type === 'core'">
              <div class="zoom-core">
                <div class="zoom-core-status" :class="zoomedItem.data.status">{{ zoomedItem.data.statusText }}</div>
                <div class="zoom-core-name">{{ zoomedItem.data.name }}</div>
                <div class="zoom-core-value" :style="{ color: zoomedItem.data.color }">
                  <span class="zoom-core-num">{{ zoomedItem.data.displayValue }}</span>
                  <span class="zoom-core-unit">{{ zoomedItem.data.unit }}</span>
                </div>
                <div class="zoom-core-bar">
                  <div class="zoom-core-bar-fill" :style="{ width: zoomedItem.data.barPercent + '%', background: zoomedItem.data.color }" />
                </div>
                <div class="zoom-core-why">{{ zoomedItem.data.why }}</div>
              </div>
            </template>

            <!-- 全景指标组放大 -->
            <template v-if="zoomedItem.type === 'group'">
              <div class="zoom-group">
                <div class="zoom-group-header" :style="{ '--group-color': zoomedItem.data.color }">
                  <span class="zoom-group-icon" v-html="zoomedItem.data.icon" />
                  <span class="zoom-group-title">{{ zoomedItem.data.title }}</span>
                  <span class="zoom-group-count">{{ zoomedItem.data.indicators.length }}项指标</span>
                </div>
                <div class="zoom-group-list">
                  <div v-for="ind in zoomedItem.data.indicators" :key="ind.name" class="zoom-group-item" :class="{ 'zoom-group-item-core': ind.isCore }">
                    <span class="zgi-dot" />
                    <span class="zgi-name">{{ ind.name }}</span>
                    <span class="zgi-desc">{{ ind.desc }}</span>
                    <span v-if="ind.isCore" class="zgi-badge">核心</span>
                  </div>
                </div>
                <div class="zoom-group-insight">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  {{ zoomedItem.data.bossWhy }}
                </div>
              </div>
            </template>

            <!-- 解读卡片放大 -->
            <template v-if="zoomedItem.type === 'interp'">
              <div class="zoom-interp" :style="{ borderLeftColor: zoomedItem.data.color }">
                <div class="zoom-interp-header">
                  <span class="zoom-interp-icon" v-html="zoomedItem.data.icon" :style="{ color: zoomedItem.data.color }" />
                  <span class="zoom-interp-title">{{ zoomedItem.data.title }}</span>
                </div>
                <div class="zoom-interp-body">{{ zoomedItem.data.content }}</div>
                <div class="zoom-interp-action">{{ zoomedItem.data.action }}</div>
              </div>
            </template>

            <!-- 能力卡片放大 -->
            <template v-if="zoomedItem.type === 'cap'">
              <div class="zoom-cap">
                <div class="zoom-cap-icon" v-html="zoomedItem.data.icon" :style="{ color: zoomedItem.data.color }" />
                <div class="zoom-cap-name">{{ zoomedItem.data.name }}</div>
                <div class="zoom-cap-desc">{{ zoomedItem.data.desc }}</div>
                <div class="zoom-cap-metrics">
                  <span v-for="m in zoomedItem.data.metrics" :key="m" class="zoom-cap-metric" :style="{ '--cap-color': zoomedItem.data.color }">{{ m }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/store'

const router = useRouter()
const store = useDashboardStore()

// ===== 进入动画状态 =====
const introPhase = ref(0) // 0=初始 1=核心充能 2=数据爆发 3=引擎标识 4=完成
const introDone = ref(false)
const introDataStreams = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  angle: (360 / 24) * i,
  delay: Math.random() * 0.4,
  length: 60 + Math.random() * 140,
  width: 1 + Math.random() * 2,
  color: ['#60a5fa', '#a78bfa', '#22C55E', '#fbbf24', '#ef4444', '#00e5ff'][i % 6],
}))
const introRingParticles = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  angle: (360 / 48) * i + Math.random() * 7,
  size: 1 + Math.random() * 3,
  delay: Math.random() * 0.3,
  orbitRadius: 80 + Math.random() * 60,
  speed: 0.8 + Math.random() * 0.6,
  color: ['#60a5fa', '#a78bfa', '#22C55E', '#fbbf24', '#00e5ff'][i % 5],
}))
const introHexChars = '0123456789ABCDEF'
const introMatrixLines = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: (100 / 16) * i + Math.random() * 4,
  chars: Array.from({ length: 12 }, () => introHexChars[Math.floor(Math.random() * 16)]).join(' '),
  delay: Math.random() * 0.6,
  duration: 0.6 + Math.random() * 0.8,
}))

function goBack() {
  router.push('/')
}

// 生成六边形环的顶点
function hexRingPoints(radius: number, sides: number): string {
  const pts: string[] = []
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 / sides) * i - Math.PI / 2
    pts.push(`${Math.cos(angle) * radius},${Math.sin(angle) * radius}`)
  }
  return pts.join(' ')
}

// 点击放大
const zoomedItem = ref<{ type: string; data: any } | null>(null)

function openZoom(type: string, data: any) {
  zoomedItem.value = { type, data }
  document.body.style.overflow = 'hidden'
}

function closeZoom() {
  zoomedItem.value = null
  document.body.style.overflow = ''
}

// ESC 关闭
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeZoom()
}

// 鼠标跟踪光晕
const mouseX = ref(-200)
const mouseY = ref(-200)
function onPageMouseMove(e: MouseEvent) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

// 背景粒子
const bgParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  style: {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    width: (1 + Math.random() * 2) + 'px',
    height: (1 + Math.random() * 2) + 'px',
    animationDuration: (3 + Math.random() * 6) + 's',
    animationDelay: (Math.random() * 5) + 's',
    opacity: 0.15 + Math.random() * 0.35,
  },
}))

// 时钟
const now = ref(new Date())
let clockTimer: ReturnType<typeof setInterval> | null = null
const currentTime = computed(() => {
  const d = now.value
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
})

// 标题动画
const headerTitle = '指标全览 · 决策全景'
const headerTitleChars = headerTitle.split('')

// 总指标数
const totalIndicators = 150

// 六大核心指标
const coreIndicators = computed(() => {
  const kpi = store.coreKPI
  return [
    {
      key: 'depletion', name: '去化率', displayValue: kpi.depletionRate.toFixed(1), unit: '%',
      barPercent: kpi.depletionRate, color: '#22C55E', status: kpi.depletionRate >= 70 ? 'healthy' : kpi.depletionRate >= 50 ? 'warning' : 'danger',
      statusText: kpi.depletionRate >= 70 ? '健康' : kpi.depletionRate >= 50 ? '关注' : '预警',
      why: '房企生命线。去化率低意味着资金回笼慢，银行利息持续吞噬利润',
    },
    {
      key: 'return', name: '回款率', displayValue: kpi.returnRate.toFixed(1), unit: '%',
      barPercent: kpi.returnRate, color: '#60a5fa', status: kpi.returnRate >= 75 ? 'healthy' : kpi.returnRate >= 60 ? 'warning' : 'danger',
      statusText: kpi.returnRate >= 75 ? '健康' : kpi.returnRate >= 60 ? '关注' : '预警',
      why: '现金为王。回款率才是真正可支配的现金流，80%以下就该预警',
    },
    {
      key: 'cashflow', name: '现金流', displayValue: kpi.cashFlow.toFixed(1), unit: '亿',
      barPercent: Math.min(100, kpi.cashFlow / 20 * 100), color: kpi.cashFlow >= 10 ? '#00d68f' : kpi.cashFlow >= 5 ? '#ffab00' : '#ef4444',
      status: kpi.cashFlow >= 10 ? 'healthy' : kpi.cashFlow >= 5 ? 'warning' : 'danger',
      statusText: kpi.cashFlow >= 10 ? '充裕' : kpi.cashFlow >= 5 ? '紧张' : '危险',
      why: '生存底线。房企暴雷的前兆永远是现金流断裂，负现金流靠借债维持',
    },
    {
      key: 'sales', name: '累计销售额', displayValue: kpi.totalSales.toFixed(1), unit: '亿',
      barPercent: Math.min(100, kpi.totalSales / 120 * 100), color: '#a78bfa',
      status: kpi.totalSales >= 80 ? 'healthy' : 'warning',
      statusText: kpi.totalSales >= 80 ? '达标' : '追赶',
      why: '营收基本盘。直接决定集团年度营收规模和资本市场信心',
    },
    {
      key: 'cycle', name: '去化周期', displayValue: (kpi.inventoryUnits / Math.max(1, kpi.monthDeals)).toFixed(0), unit: '月',
      barPercent: Math.min(100, (kpi.inventoryUnits / Math.max(1, kpi.monthDeals)) / 24 * 100),
      color: (kpi.inventoryUnits / Math.max(1, kpi.monthDeals)) <= 12 ? '#22C55E' : (kpi.inventoryUnits / Math.max(1, kpi.monthDeals)) <= 18 ? '#ffab00' : '#ef4444',
      status: (kpi.inventoryUnits / Math.max(1, kpi.monthDeals)) <= 12 ? 'healthy' : (kpi.inventoryUnits / Math.max(1, kpi.monthDeals)) <= 18 ? 'warning' : 'danger',
      statusText: (kpi.inventoryUnits / Math.max(1, kpi.monthDeals)) <= 12 ? '安全' : (kpi.inventoryUnits / Math.max(1, kpi.monthDeals)) <= 18 ? '关注' : '红灯',
      why: '超过18个月就是红灯，意味着市场不接受你的产品或价格',
    },
    {
      key: 'inventory', name: '库存货值', displayValue: kpi.inventoryValue.toFixed(1), unit: '亿',
      barPercent: Math.min(100, kpi.inventoryValue / 50 * 100), color: '#fbbf24',
      status: kpi.inventoryValue <= 30 ? 'healthy' : kpi.inventoryValue <= 45 ? 'warning' : 'danger',
      statusText: kpi.inventoryValue <= 30 ? '可控' : kpi.inventoryValue <= 45 ? '偏高' : '高压',
      why: '沉淀规模。10亿货值库存按5%融资成本，每年利息就5000万',
    },
  ]
})

// 十大维度指标体系
const indicatorGroups = [
  {
    title: '核心经营', color: '#22C55E', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    bossWhy: '这6个指标决定企业生死，决策层必须每天盯盘',
    indicators: [
      { name: '去化率', desc: '已售/总套数', isCore: true },
      { name: '累计销售额', desc: '签约总金额(亿)', isCore: true },
      { name: '回款金额', desc: '实收款项(亿)', isCore: false },
      { name: '回款率', desc: '回款/应收%', isCore: true },
      { name: '环比增长', desc: '本期vs上期%', isCore: false },
      { name: '现金流', desc: '经营性净流入(亿)', isCore: true },
      { name: '利润率', desc: '净利/营收%', isCore: false },
      { name: '今日/月成交', desc: '签约套数', isCore: false },
    ],
  },
  {
    title: '库存定价', color: '#fbbf24', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>',
    bossWhy: '库存=锁死的资金，定价偏差=利润流失',
    indicators: [
      { name: '库存套数', desc: '未售总套数', isCore: true },
      { name: '库存货值', desc: '未售总价值(亿)', isCore: true },
      { name: '去化周期', desc: '卖完需多少月', isCore: true },
      { name: '均价', desc: '平均售价元/㎡', isCore: false },
      { name: '建议均价', desc: 'AI定价建议', isCore: false },
      { name: '调价幅度', desc: '建议vs当前偏差', isCore: false },
      { name: '在售天数', desc: '房源挂出天数', isCore: false },
      { name: '库存周转天数', desc: '入库到售出天数', isCore: false },
    ],
  },
  {
    title: '渠道分析', color: '#60a5fa', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    bossWhy: '渠道决定获客效率，ROI低于1就是亏钱',
    indicators: [
      { name: '渠道销售额', desc: '各渠道销售金额', isCore: false },
      { name: '渠道转化率', desc: '获客→成交%', isCore: false },
      { name: '获客成本', desc: '单客户获取花费', isCore: false },
      { name: '渠道ROI', desc: '投入产出比', isCore: false },
      { name: '自销/分销占比', desc: '自营vs中介', isCore: false },
      { name: '线上获客占比', desc: '线上渠道占比', isCore: false },
    ],
  },
  {
    title: '销售漏斗', color: '#a78bfa', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>',
    bossWhy: '漏斗每个环节都在漏人，总转化率低于5%需全面检视',
    indicators: [
      { name: '线索获取量', desc: '潜在客户线索数', isCore: false },
      { name: '到访看房量', desc: '实际到访客户数', isCore: false },
      { name: '意向确认量', desc: '明确购买意向数', isCore: false },
      { name: '认购签约量', desc: '签订认购书数', isCore: false },
      { name: '成交回款量', desc: '完成付款客户数', isCore: false },
      { name: '总转化率', desc: '线索→成交%', isCore: false },
    ],
  },
  {
    title: '客户画像', color: '#f472b6', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    bossWhy: '产品匹配客群才能卖得动，错配就是最大的浪费',
    indicators: [
      { name: '客群分层占比', desc: '刚需/改善/投资等', isCore: false },
      { name: '客均预算', desc: '各客群平均预算', isCore: false },
      { name: '客均年龄', desc: '各客群平均年龄', isCore: false },
      { name: '年龄性别分布', desc: '年龄段×性别交叉', isCore: false },
      { name: '老带新比例', desc: '老客户推荐占比', isCore: false },
    ],
  },
  {
    title: '区域对比', color: '#00e5ff', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    bossWhy: '资源按产出分配，高风险区域拿地需极其谨慎',
    indicators: [
      { name: '区域销售额', desc: '各区域销售总额', isCore: false },
      { name: '区域均价', desc: '各区域成交单价', isCore: false },
      { name: '区域库存压力', desc: '库存压力指数0-100', isCore: false },
      { name: '风险等级', desc: 'low/medium/high', isCore: false },
      { name: '区域调度建议', desc: '可执行经营建议', isCore: false },
    ],
  },
  {
    title: '年度目标', color: '#38bdf8', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    bossWhy: '军令状。完不成影响集团评级和领导考核',
    indicators: [
      { name: '年度销售额目标', desc: '120亿及完成进度', isCore: false },
      { name: '年度回款额目标', desc: '95亿及完成进度', isCore: false },
      { name: '目标完成进度', desc: '当前/目标%', isCore: false },
      { name: '目标差距', desc: '当前与目标差额', isCore: false },
    ],
  },
  {
    title: '风险预警', color: '#ef4444', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    bossWhy: '底线风险。资金风险高的项目随时可能爆雷',
    indicators: [
      { name: '资金风险', desc: '现金流/融资评分', isCore: false },
      { name: '去化压力', desc: '销售速度风险', isCore: false },
      { name: '回款风险', desc: '逾期/延迟风险', isCore: false },
      { name: '库存积压', desc: '超合理范围风险', isCore: false },
      { name: '市场竞争', desc: '竞品分流风险', isCore: false },
      { name: '政策影响', desc: '调控政策风险', isCore: false },
    ],
  },
  {
    title: 'AI诊断预测', color: '#a855f7', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z"/><circle cx="12" cy="12" r="2"/></svg>',
    bossWhy: '从"问题是什么"到"应该怎么做"，缩短决策链条',
    indicators: [
      { name: '项目健康度', desc: 'AI综合评分0-100', isCore: false },
      { name: '下月销售预测', desc: 'AI预测额及趋势', isCore: false },
      { name: '预测置信度', desc: 'AI可信度0-100%', isCore: false },
      { name: '滞销诊断', desc: 'AI识别滞销原因', isCore: false },
      { name: '智能建议', desc: '调价/加渠道/加推', isCore: false },
    ],
  },
  {
    title: '热门楼盘', color: '#fb923c', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    bossWhy: '热度是成交的先行指标，浏览量上涨领先成交2-4周',
    indicators: [
      { name: '楼盘浏览量', desc: '线上浏览次数', isCore: false },
      { name: '热度评分', desc: '综合热度评分', isCore: false },
      { name: '浏览量环比', desc: '浏览量增长趋势', isCore: false },
    ],
  },
]

// 决策全景解读
const bossInterpretations = [
  {
    title: '为什么只盯6个指标？',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    color: '#22C55E',
    content: '150+项指标中，去化率、回款率、现金流、销售额、去化周期、库存货值这6个是"牵一发而动全身"的核心。其余所有指标都是在解释这6个"为什么是这个数字"和"应该怎么办"。',
    action: '→ 每天早会只看这6个数字，异常时再深入',
  },
  {
    title: '去化率是房企生命线',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    color: '#ef4444',
    content: '去化率低于50%的项目就是"出血点"。每低1个百分点，意味着数百万资金被锁死，银行利息持续吞噬利润。去化率低→回款慢→现金流紧→利润下降，这是恶性循环。',
    action: '→ 去化率<50%的项目必须"一项目一策"精准施策',
  },
  {
    title: '回款率比销售额更重要',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
    color: '#60a5fa',
    content: '签了约不等于拿到钱。回款率低于80%说明按揭审批慢或客户首付逾期，可能是银行合作或客户资质问题。只有回款到账才算"落袋为安"——回款目标比销售目标更关键。',
    action: '→ 回款率<80%的项目需专项督办银行放款',
  },
  {
    title: '现金流是生存底线',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
    color: '#ffab00',
    content: '房企暴雷的前兆永远是现金流断裂。负现金流意味着靠借债维持运营，每多借1亿、年利息就500万+。现金流充裕=主动权在手，现金流紧张=被债权人牵着走。',
    action: '→ 现金流<5亿立即启动应急预案',
  },
]

// 系统能力
const systemCapabilities = [
  {
    name: '实时数据汇聚',
    color: '#60a5fa',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    desc: '24个项目860万条数据30秒刷新',
    metrics: ['多源接入', '实时计算', '数据治理'],
  },
  {
    name: 'AI智能预测',
    color: '#a855f7',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z"/><circle cx="12" cy="12" r="2"/></svg>',
    desc: 'LLM+RAG+NL2SQL三引擎驱动',
    metrics: ['LLM', 'RAG', 'NL2SQL', 'Agent'],
  },
  {
    name: '风控预警',
    color: '#ef4444',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    desc: '六维风险评估实时预警',
    metrics: ['资金风险', '去化压力', '市场竞争'],
  },
  {
    name: '决策辅助',
    color: '#22C55E',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    desc: '从问题到行动的最后一公里',
    metrics: ['智能定价', '渠道优化', '调度建议'],
  },
  {
    name: '3D可视化',
    color: '#00e5ff',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    desc: '3D地球+中国地图+项目矩阵',
    metrics: ['3D Globe', 'ChinaMap', '散点图', '漏斗图'],
  },
  {
    name: '大数据底座',
    color: '#fbbf24',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    desc: 'Lakehouse+Flink+ClickHouse',
    metrics: ['Lakehouse', 'Flink', 'ClickHouse'],
  },
]

onMounted(() => {
  clockTimer = setInterval(() => { now.value = new Date() }, 1000)
  window.addEventListener('keydown', onKeydown)
  // 启动入场动画序列
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    setTimeout(() => { introPhase.value = 1 }, 200)   // 核心充能
    setTimeout(() => { introPhase.value = 2 }, 1600)  // 数据爆发
    setTimeout(() => { introPhase.value = 3 }, 2800)  // 引擎标识
    setTimeout(() => {
      introPhase.value = 4
      introDone.value = true
      document.body.style.overflow = ''
    }, 4200)  // 完成
  })
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.indicator-overview-page {
  min-height: 100vh;
  background: #060a12;
  color: #cbd5e1;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', -apple-system, sans-serif;
  overflow-x: hidden;
  position: relative;
}

// 动态鼠标光晕
.dynamic-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.06) 0%, transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 0;
  transition: left 0.3s ease-out, top 0.3s ease-out;
}

// 背景粒子
.bg-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.bg-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(96, 165, 250, 0.6);
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: var(--opacity, 0.2); }
  90% { opacity: var(--opacity, 0.2); }
  100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
}

// 顶部装饰
.top-deco {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 28px 0 0;
  position: relative;
  z-index: 1;
}

.deco-line {
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.4), transparent);
}

.deco-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #60a5fa;
  box-shadow: 0 0 14px rgba(96, 165, 250, 0.6);
  animation: decoDotPulse 3s ease-in-out infinite;
}

@keyframes decoDotPulse {
  0%, 100% { box-shadow: 0 0 14px rgba(96, 165, 250, 0.6); }
  50% { box-shadow: 0 0 24px rgba(96, 165, 250, 0.9); }
}

// 区间分隔线
.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 8px 32px;
  position: relative;
  z-index: 1;
}

.sd-line {
  width: 160px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.15), transparent);
}

.sd-diamond {
  width: 6px;
  height: 6px;
  background: rgba(96, 165, 250, 0.3);
  transform: rotate(45deg);
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.2);
}

// 页头
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  position: relative;
  z-index: 1;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(96, 165, 250, 0.15);
  background: rgba(96, 165, 250, 0.05);
  color: #60a5fa;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(96, 165, 250, 0.12);
    border-color: rgba(96, 165, 250, 0.3);
  }
}

.header-center {
  text-align: center;
  flex: 1;
}

.header-badge {
  display: inline-block;
  padding: 3px 14px;
  border: 1px solid rgba(251, 191, 36, 0.25);
  border-radius: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #fbbf24;
  letter-spacing: 3px;
  margin-bottom: 8px;
  background: rgba(251, 191, 36, 0.04);
}

.header-title {
  font-size: 36px;
  font-weight: 800;
  color: #e2e8f0;
  letter-spacing: 6px;
  margin: 0 0 8px;
  display: flex;
  justify-content: center;
  text-shadow: 0 0 30px rgba(96, 165, 250, 0.15);
}

.header-char {
  display: inline-block;
  animation: headerCharIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes headerCharIn {
  from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.header-sub {
  font-size: 12px;
  color: #64748b;
  letter-spacing: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #22C55E;
  letter-spacing: 1px;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22C55E;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
  animation: livePulse 2s ease-in-out infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.header-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #64748b;
}

// 六大核心指标 Hero
.core-hero {
  padding: 24px 32px;
  position: relative;
  z-index: 1;
}

.core-hero-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #fbbf24;
  margin-bottom: 20px;
  letter-spacing: 2px;

  svg { color: #fbbf24; }
}

.core-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.core-card {
  position: relative;
  padding: 24px 18px;
  border-radius: 14px;
  background: rgba(15, 18, 25, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  animation: coreCardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  cursor: zoom-in;

  &:hover {
    transform: translateY(-8px) scale(1.08);
    border-color: var(--core-color, rgba(96, 165, 250, 0.2));
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px color-mix(in srgb, var(--core-color) 20%, transparent);
    z-index: 10;

    .core-card-border-glow { opacity: 1; }
    .core-card-glow { opacity: 0.8; transform: scale(1.5); }
    .core-num { transform: scale(1.15); }
  }

  &:active {
    transform: translateY(-4px) scale(1.02);
    transition-duration: 0.1s;
  }
}

.core-card-border-glow {
  position: absolute;
  inset: -1px;
  border-radius: 12px;
  border: 1px solid var(--core-color, rgba(96, 165, 250, 0.2));
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

@keyframes coreCardIn {
  from { opacity: 0; transform: translateY(30px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.core-card-glow {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--core-color, rgba(96, 165, 250, 0.06));
  filter: blur(30px);
  opacity: 0.4;
  transition: all 0.5s;
}

.core-rank {
  position: absolute;
  top: 8px;
  right: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.04);
  line-height: 1;
}

.core-name {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.core-value {
  margin-bottom: 8px;
}

.core-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.1;
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.core-unit {
  font-size: 12px;
  font-weight: 600;
  margin-left: 2px;
  opacity: 0.7;
}

.core-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
}

.core-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s ease;
}

.core-why {
  font-size: 9px;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.core-status {
  position: absolute;
  top: 10px;
  left: 12px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 2px 8px;
  border-radius: 4px;

  &.healthy {
    color: #22C55E;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
  }
  &.warning {
    color: #ffab00;
    background: rgba(255, 171, 0, 0.1);
    border: 1px solid rgba(255, 171, 0, 0.2);
  }
  &.danger {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    animation: dangerPulse 2s ease-in-out infinite;
  }
}

@keyframes dangerPulse {
  0%, 100% { border-color: rgba(239, 68, 68, 0.2); }
  50% { border-color: rgba(239, 68, 68, 0.5); }
}

// 指标全景
.indicator-panorama {
  padding: 24px 32px;
  position: relative;
  z-index: 1;
}

.panorama-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #60a5fa;
  margin-bottom: 20px;
  letter-spacing: 2px;

  svg { color: #60a5fa; }
}

.panorama-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.panorama-group {
  border-radius: 10px;
  background: rgba(15, 18, 25, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: pgIn 0.5s ease-out both;
  cursor: zoom-in;

  &:hover {
    transform: translateY(-4px) scale(1.04);
    border-color: var(--group-color, rgba(96, 165, 250, 0.15));
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), 0 0 20px color-mix(in srgb, var(--group-color) 10%, transparent);
    z-index: 5;

    .pg-header { background: color-mix(in srgb, var(--group-color) 6%, rgba(255, 255, 255, 0.03)); }
    .pg-title { color: var(--group-color); }
  }

  &:active {
    transform: translateY(-2px) scale(1.01);
    transition-duration: 0.1s;
  }
}

@keyframes pgIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.pg-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(255, 255, 255, 0.02);
}

.pg-icon {
  color: var(--group-color, #60a5fa);
  display: flex;
  align-items: center;
}

.pg-title {
  font-size: 12px;
  font-weight: 700;
  color: #e2e8f0;
  flex: 1;
  transition: color 0.3s;
}

.pg-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--group-color, #60a5fa);
  padding: 1px 6px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--group-color) 10%, transparent);
}

.pg-list {
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pg-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0;

  &.pg-item-core {
    .pgi-name { color: #fbbf24; font-weight: 700; }
  }
}

.pgi-name {
  font-size: 11px;
  color: #cbd5e1;
  width: 70px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pgi-desc {
  font-size: 9px;
  color: #64748b;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pgi-core-badge {
  font-size: 8px;
  font-weight: 700;
  color: #fbbf24;
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  flex-shrink: 0;
}

.pg-insight {
  padding: 8px 12px;
  font-size: 9px;
  color: #64748b;
  line-height: 1.5;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: flex-start;
  gap: 4px;

  svg { color: #ffab00; flex-shrink: 0; margin-top: 1px; }
}

// 决策解读
.decision-interpretation {
  padding: 24px 32px;
  position: relative;
  z-index: 1;
}

.interp-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #a78bfa;
  margin-bottom: 20px;
  letter-spacing: 2px;

  svg { color: #a78bfa; }
}

.interp-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.interp-card {
  padding: 20px;
  border-radius: 10px;
  background: rgba(15, 18, 25, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 3px solid;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: interpIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  cursor: zoom-in;

  &:hover {
    transform: translateY(-6px) scale(1.03);
    background: rgba(15, 18, 25, 0.9);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), 0 0 24px color-mix(in srgb, var(--cap-color, #a78bfa) 8%, transparent);
    z-index: 5;
  }

  &:active {
    transform: translateY(-3px) scale(1.01);
    transition-duration: 0.1s;
  }
}

@keyframes interpIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.interp-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.interp-card-icon {
  display: flex;
  align-items: center;
  color: inherit;
}

.interp-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #e2e8f0;
}

.interp-card-body {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.8;
  margin-bottom: 12px;
}

.interp-card-action {
  font-size: 11px;
  color: #60a5fa;
  font-weight: 600;
}

// 系统能力
.system-capabilities {
  padding: 24px 32px;
  position: relative;
  z-index: 1;
}

.cap-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #00e5ff;
  margin-bottom: 20px;
  letter-spacing: 2px;

  svg { color: #00e5ff; }
}

.cap-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.cap-card {
  padding: 18px 14px;
  border-radius: 10px;
  background: rgba(15, 18, 25, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  animation: capIn 0.5s ease-out both;
  cursor: zoom-in;

  &:hover {
    transform: translateY(-8px) scale(1.06);
    border-color: color-mix(in srgb, var(--cap-color) 25%, transparent);
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4), 0 0 28px color-mix(in srgb, var(--cap-color) 12%, transparent);
    z-index: 5;

    .cap-icon { transform: scale(1.2) rotate(5deg); }
  }

  &:active {
    transform: translateY(-4px) scale(1.02);
    transition-duration: 0.1s;
  }
}

.cap-icon {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes capIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.cap-icon {
  color: var(--cap-color, #60a5fa);
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.cap-name {
  font-size: 13px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 4px;
}

.cap-desc {
  font-size: 10px;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 10px;
}

.cap-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.cap-metric {
  font-size: 8px;
  padding: 2px 6px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--cap-color) 8%, transparent);
  color: var(--cap-color, #60a5fa);
  border: 1px solid color-mix(in srgb, var(--cap-color) 12%, transparent);
}

// 底部
.page-footer {
  padding: 24px 32px 32px;
  position: relative;
  z-index: 1;
}

.footer-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.15), transparent);
  margin-bottom: 16px;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.footer-brand {
  font-size: 14px;
  font-weight: 800;
  color: #e2e8f0;
  letter-spacing: 2px;
}

.footer-accent {
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-divider {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.1);
}

.footer-text {
  font-size: 11px;
  color: #64748b;
  letter-spacing: 1px;
}

.footer-version {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #475569;
}

// 点击放大通用
.zoomable {
  cursor: zoom-in;
}

// 放大弹窗
.zoom-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.zoom-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.zoom-panel {
  position: relative;
  z-index: 1;
  max-width: 640px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 20px;
  background: rgba(12, 15, 22, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(96, 165, 250, 0.08);
  padding: 36px;
}

.zoom-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 2;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
    border-color: rgba(255, 255, 255, 0.2);
  }
}

// Transition
.zoom-overlay-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  .zoom-panel { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
}
.zoom-overlay-leave-active {
  transition: all 0.25s ease-in;
  .zoom-panel { transition: all 0.25s ease-in; }
}
.zoom-overlay-enter-from {
  .zoom-backdrop { opacity: 0; }
  .zoom-panel { opacity: 0; transform: scale(0.85) translateY(20px); }
}
.zoom-overlay-leave-to {
  .zoom-backdrop { opacity: 0; }
  .zoom-panel { opacity: 0; transform: scale(0.9) translateY(10px); }
}

// 核心指标放大
.zoom-core {
  text-align: center;
  padding: 12px 0;
}

.zoom-core-status {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 4px 16px;
  border-radius: 6px;
  margin-bottom: 16px;

  &.healthy { color: #22C55E; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); }
  &.warning { color: #ffab00; background: rgba(255, 171, 0, 0.1); border: 1px solid rgba(255, 171, 0, 0.2); }
  &.danger { color: #ef4444; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); }
}

.zoom-core-name {
  font-size: 18px;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.zoom-core-value {
  margin-bottom: 20px;
}

.zoom-core-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 64px;
  font-weight: 900;
  line-height: 1;
}

.zoom-core-unit {
  font-size: 20px;
  font-weight: 600;
  margin-left: 4px;
  opacity: 0.7;
}

.zoom-core-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  margin: 0 auto 24px;
  max-width: 320px;
}

.zoom-core-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.zoom-core-why {
  font-size: 14px;
  color: #94a3b8;
  line-height: 2;
  max-width: 480px;
  margin: 0 auto;
}

// 全景指标组放大
.zoom-group {
  padding: 4px 0;
}

.zoom-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.zoom-group-icon {
  color: var(--group-color);
  display: flex;
  align-items: center;

  svg { width: 20px; height: 20px; }
}

.zoom-group-title {
  font-size: 22px;
  font-weight: 800;
  color: #e2e8f0;
  letter-spacing: 2px;
}

.zoom-group-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--group-color);
  padding: 3px 10px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--group-color) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--group-color) 15%, transparent);
  margin-left: auto;
}

.zoom-group-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.zoom-group-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.06);
  }

  &.zoom-group-item-core {
    background: rgba(251, 191, 36, 0.04);
    border-color: rgba(251, 191, 36, 0.1);

    .zgi-dot { background: #fbbf24; box-shadow: 0 0 6px rgba(251, 191, 36, 0.4); }
    .zgi-name { color: #fbbf24; font-weight: 700; }
  }
}

.zgi-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #475569;
  flex-shrink: 0;
}

.zgi-name {
  font-size: 14px;
  color: #cbd5e1;
  font-weight: 600;
  width: 100px;
  flex-shrink: 0;
}

.zgi-desc {
  font-size: 12px;
  color: #64748b;
  flex: 1;
}

.zgi-badge {
  font-size: 10px;
  font-weight: 700;
  color: #fbbf24;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  flex-shrink: 0;
}

.zoom-group-insight {
  padding: 14px 16px;
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.8;
  border-radius: 8px;
  background: rgba(255, 171, 0, 0.04);
  border: 1px solid rgba(255, 171, 0, 0.08);
  display: flex;
  align-items: flex-start;
  gap: 8px;

  svg { color: #ffab00; flex-shrink: 0; margin-top: 2px; }
}

// 解读卡片放大
.zoom-interp {
  padding: 8px 0 8px 24px;
  border-left: 4px solid;
}

.zoom-interp-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.zoom-interp-icon {
  display: flex;
  align-items: center;

  svg { width: 22px; height: 22px; }
}

.zoom-interp-title {
  font-size: 20px;
  font-weight: 800;
  color: #e2e8f0;
  letter-spacing: 1px;
}

.zoom-interp-body {
  font-size: 15px;
  color: #94a3b8;
  line-height: 2;
  margin-bottom: 20px;
}

.zoom-interp-action {
  font-size: 14px;
  color: #60a5fa;
  font-weight: 700;
  letter-spacing: 0.5px;
}

// 能力卡片放大
.zoom-cap {
  text-align: center;
  padding: 16px 0;
}

.zoom-cap-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;

  svg { width: 40px; height: 40px; }
}

.zoom-cap-name {
  font-size: 22px;
  font-weight: 800;
  color: #e2e8f0;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.zoom-cap-desc {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.8;
  margin-bottom: 20px;
}

.zoom-cap-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.zoom-cap-metric {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--cap-color, #60a5fa) 10%, transparent);
  color: var(--cap-color, #60a5fa);
  border: 1px solid color-mix(in srgb, var(--cap-color, #60a5fa) 15%, transparent);
}

// Responsive
@media (max-width: 1200px) {
  .core-grid { grid-template-columns: repeat(3, 1fr); }
  .panorama-grid { grid-template-columns: repeat(3, 1fr); }
  .cap-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .page-header { padding: 12px 16px; flex-wrap: wrap; gap: 8px; }
  .header-center { order: -1; flex-basis: 100%; }
  .header-title { font-size: 20px; }

  .core-hero { padding: 16px; }
  .core-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .core-num { font-size: 22px; }

  .indicator-panorama { padding: 16px; }
  .panorama-grid { grid-template-columns: 1fr 1fr; gap: 8px; }

  .decision-interpretation { padding: 16px; }
  .interp-grid { grid-template-columns: 1fr; }

  .system-capabilities { padding: 16px; }
  .cap-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
}

@media (max-width: 480px) {
  .core-grid { grid-template-columns: 1fr; }
  .panorama-grid { grid-template-columns: 1fr; }
  .cap-grid { grid-template-columns: 1fr; }
}

// ===== 入场动画：页面内容延迟出现 =====
.indicator-overview-page.intro-active {
  .page-header,
  .core-hero,
  .section-divider,
  .indicator-panorama,
  .decision-interpretation,
  .system-capabilities,
  .page-footer {
    opacity: 0;
    transform: translateY(20px);
  }
}

.indicator-overview-page:not(.intro-active) {
  .page-header { animation: contentReveal 0.8s ease-out 0s both; }
  .core-hero { animation: contentReveal 0.8s ease-out 0.1s both; }
  .section-divider:nth-of-type(1) { animation: contentReveal 0.6s ease-out 0.15s both; }
  .indicator-panorama { animation: contentReveal 0.8s ease-out 0.2s both; }
  .section-divider:nth-of-type(2) { animation: contentReveal 0.6s ease-out 0.25s both; }
  .decision-interpretation { animation: contentReveal 0.8s ease-out 0.3s both; }
  .section-divider:nth-of-type(3) { animation: contentReveal 0.6s ease-out 0.35s both; }
  .system-capabilities { animation: contentReveal 0.8s ease-out 0.4s both; }
  .page-footer { animation: contentReveal 0.6s ease-out 0.5s both; }
}

@keyframes contentReveal {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

<!-- Non-scoped styles for intro animation (Teleported to body) -->
<style lang="scss">
// ===== 入场动画遮罩 =====
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #060a12;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: all;
}

.intro-fade-leave-active {
  transition: opacity 0.6s ease;
}
.intro-fade-leave-to {
  opacity: 0;
}

// ===== 阶段1: 核心充能 =====
.intro-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 320px;
}

.intro-hex-core {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-hex-svg {
  position: absolute;
  animation: introHexSpin 8s linear infinite;
  filter: drop-shadow(0 0 12px rgba(96,165,250,0.3));
}

@keyframes introHexSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.intro-hex-ring {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: hexRingDraw 1.2s ease-out forwards;
}

.intro-hex-ring-1 { animation-delay: 0.2s; }
.intro-hex-ring-2 { animation-delay: 0.5s; }
.intro-hex-ring-3 { animation-delay: 0.8s; }

@keyframes hexRingDraw {
  to { stroke-dashoffset: 0; }
}

.intro-core-glow {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(96,165,250,0.35) 0%, rgba(167,139,250,0.15) 40%, transparent 70%);
  animation: coreGlowPulse 1.4s ease-in-out infinite alternate;
  z-index: 1;
}

@keyframes coreGlowPulse {
  from { transform: scale(0.8); opacity: 0.5; }
  to { transform: scale(1.4); opacity: 1; }
}

.intro-core-icon {
  position: relative;
  z-index: 2;
  animation: coreIconIn 0.6s ease-out 0.3s both;
  filter: drop-shadow(0 0 16px rgba(96,165,250,0.5));
}

@keyframes coreIconIn {
  from { opacity: 0; transform: scale(0.3) rotate(-90deg); }
  to { opacity: 1; transform: scale(1) rotate(0deg); }
}

// 环绕粒子
.intro-orbit-particles {
  position: absolute;
  inset: 0;
}

.intro-orbit-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background: var(--dot-color);
  box-shadow: 0 0 6px var(--dot-color);
  animation: orbitSpin var(--orbit-speed) linear infinite;
  opacity: 0;
  animation-delay: var(--animation-delay, 0s);

  .intro-phase-1 & {
    animation: orbitSpin var(--orbit-speed) linear infinite, dotFadeIn 0.5s ease-out forwards;
    animation-delay: var(--animation-delay, 0s), var(--animation-delay, 0s);
  }
}

@keyframes orbitSpin {
  from { transform: rotate(var(--orbit-angle)) translateX(var(--orbit-radius)); }
  to { transform: rotate(calc(var(--orbit-angle) + 360deg)) translateX(var(--orbit-radius)); }
}

@keyframes dotFadeIn {
  from { opacity: 0; }
  to { opacity: 0.8; }
}

// ===== 阶段2: 数据爆发 =====
.intro-burst {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.intro-stream {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--stream-width);
  width: 0;
  background: linear-gradient(90deg, transparent 0%, var(--stream-color) 60%, var(--stream-color) 100%);
  transform-origin: 0 50%;
  transform: rotate(var(--stream-angle));
  border-radius: 2px;
  box-shadow: 0 0 8px var(--stream-color), 0 0 20px color-mix(in srgb, var(--stream-color) 30%, transparent);
  animation: streamShoot 0.8s ease-out forwards;
  animation-delay: var(--animation-delay, 0s);
  opacity: 0;
}

@keyframes streamShoot {
  0% { width: 0; opacity: 0; }
  20% { opacity: 1; }
  100% { width: var(--stream-length); opacity: 0; }
}

// 矩阵数字雨
.intro-matrix {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.intro-matrix-line {
  position: absolute;
  top: -40px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(96, 165, 250, 0.5);
  letter-spacing: 2px;
  writing-mode: vertical-rl;
  animation: matrixFall linear forwards;
  text-shadow: 0 0 8px rgba(96,165,250,0.3);
}

@keyframes matrixFall {
  0% { transform: translateY(-40px); opacity: 0; }
  10% { opacity: 0.7; }
  80% { opacity: 0.4; }
  100% { transform: translateY(calc(100vh + 40px)); opacity: 0; }
}

// 冲击波
.intro-shockwave {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid rgba(96, 165, 250, 0.5);
  box-shadow: 0 0 20px rgba(96,165,250,0.2), inset 0 0 20px rgba(96,165,250,0.1);
  animation: shockwaveExpand 1.2s ease-out forwards;
  pointer-events: none;
}

.intro-shockwave-1 { animation-delay: 0s; }
.intro-shockwave-2 { animation-delay: 0.3s; border-color: rgba(167,139,250,0.4); }

@keyframes shockwaveExpand {
  0% { width: 0; height: 0; opacity: 1; }
  100% { width: 160vmax; height: 160vmax; opacity: 0; }
}

// ===== 阶段3: 引擎标识 =====
.intro-engine-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 10;
  animation: engineLabelIn 0.6s ease-out forwards;
}

@keyframes engineLabelIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); filter: blur(8px); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); }
}

.intro-engine-icon {
  color: #60a5fa;
  animation: engineIconPulse 1s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 20px rgba(96,165,250,0.5));
}

@keyframes engineIconPulse {
  from { transform: scale(1); filter: drop-shadow(0 0 20px rgba(96,165,250,0.5)); }
  to { transform: scale(1.1); filter: drop-shadow(0 0 30px rgba(96,165,250,0.8)); }
}

.intro-engine-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.intro-engine-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 8px;
  color: #e2e8f0;
  text-shadow: 0 0 40px rgba(96,165,250,0.4), 0 0 80px rgba(167,139,250,0.2);
}

.intro-engine-sub {
  font-size: 12px;
  letter-spacing: 3px;
  color: #64748b;
  font-family: 'JetBrains Mono', monospace;
}

.intro-engine-bar {
  width: 200px;
  height: 3px;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
}

.intro-engine-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #a78bfa, #22C55E);
  border-radius: 2px;
  animation: engineBarFill 1s ease-out 0.3s both;
  box-shadow: 0 0 10px rgba(96,165,250,0.5);
}

@keyframes engineBarFill {
  from { width: 0%; }
  to { width: 100%; }
}

// 阶段4过渡：遮罩淡出
.intro-phase-4 {
  animation: introOut 0.6s ease-in forwards;
}

@keyframes introOut {
  to { opacity: 0; }
}
</style>

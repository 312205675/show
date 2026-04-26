<template>
  <div class="page customer-page">
    <!-- ===== 宇宙级入场特效 ===== -->
    <Teleport to="body">
      <Transition name="cosmic">
        <div v-if="showEntrance" class="cosmic-overlay">
          <!-- Canvas 星空 -->
          <canvas ref="starCanvas" class="star-canvas" />

          <!-- 星云光环 -->
          <div class="nebula-ring nebula-1" />
          <div class="nebula-ring nebula-2" />
          <div class="nebula-ring nebula-3" />

          <!-- 中心爆发光晕 -->
          <div class="center-burst" :style="{ opacity: burstOpacity }">
            <div class="burst-ring ring-1" />
            <div class="burst-ring ring-2" />
            <div class="burst-ring ring-3" />
            <div class="burst-core" />
          </div>

          <!-- 飞散粒子 -->
          <div v-for="p in flyingParticles" :key="'f'+p.id" class="flying-particle"
            :style="{
              left: '50%', top: '50%',
              width: p.size + 'px', height: p.size + 'px',
              background: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              transform: `translate(-50%, -50%) translate(${p.tx}px, ${p.ty}px) scale(${p.scale})`,
              opacity: p.opacity,
              transition: `all ${p.dur}ms cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}ms`
            }"
          />

          <!-- 全息六边形网格 -->
          <div class="holo-hex-grid" :style="{ opacity: holoOpacity }">
            <svg viewBox="0 0 1200 600" class="hex-svg">
              <defs>
                <pattern id="hexPat" width="60" height="52" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                  <polygon points="30,1 57,15 57,37 30,51 3,37 3,15" fill="none" stroke="rgba(96,165,250,0.08)" stroke-width="0.5"/>
                </pattern>
              </defs>
              <rect width="1200" height="600" fill="url(#hexPat)"/>
            </svg>
          </div>

          <!-- 主标题区 -->
          <div class="cosmic-title-area" :style="{ opacity: titleOpacity, transform: titleTransform }">
            <div class="cosmic-badge">INTELLIGENT ANALYSIS</div>
            <div class="cosmic-main-title">
              <span v-for="(ch, i) in titleChars" :key="i" class="title-char" :style="{ animationDelay: (i * 60) + 'ms' }">{{ ch }}</span>
            </div>
            <div class="cosmic-sub-title">CUSTOMER PROFILE UNIVERSE</div>
            <div class="cosmic-data-stream">
              <span v-for="d in dataStream" :key="d" class="data-bit">{{ d }}</span>
            </div>
            <!-- 扫描进度 -->
            <div class="cosmic-progress">
              <div class="cosmic-progress-bar" :style="{ width: scanProgress + '%' }" />
            </div>
            <div class="cosmic-percent">{{ Math.round(scanProgress) }}% LOADED</div>
          </div>

          <!-- 角落装饰 -->
          <div class="corner-deco top-left" />
          <div class="corner-deco top-right" />
          <div class="corner-deco bottom-left" />
          <div class="corner-deco bottom-right" />
        </div>
      </Transition>
    </Teleport>

    <!-- Period Selector -->
    <PeriodSelector v-model="localPeriod" />

    <!-- 2D Mode -->
    <template v-if="viewMode !== '3d'">
      <!-- 客群分层总览 - Enhanced -->
      <div class="seg-overview">
        <div v-for="seg in profiles" :key="seg.segment" class="seg-card" :style="{ '--seg-color': seg.color }">
          <div class="seg-glow" />
          <div class="seg-header">
            <span class="seg-dot" :style="{ background: seg.color, boxShadow: `0 0 8px ${seg.color}60` }" />
            <span class="seg-name">{{ seg.segment }}</span>
            <span class="seg-pct" :style="{ color: seg.color }">{{ seg.percent }}%</span>
          </div>
          <div class="seg-ring">
            <svg viewBox="0 0 36 36">
              <circle class="ring-bg" cx="18" cy="18" r="15.5" />
              <circle class="ring-fill" cx="18" cy="18" r="15.5" :style="{ strokeDasharray: `${seg.percent} 100`, stroke: seg.color }" />
            </svg>
            <span class="ring-label" :style="{ color: seg.color }">{{ seg.percent }}%</span>
          </div>
          <div class="seg-body">
            <div class="seg-stat">
              <span class="stat-val">{{ seg.count }}</span>
              <span class="stat-lbl">客户数</span>
            </div>
            <div class="seg-stat">
              <span class="stat-val">{{ seg.avgBudget }}万</span>
              <span class="stat-lbl">均预算</span>
            </div>
            <div class="seg-stat">
              <span class="stat-val">{{ seg.avgAge }}岁</span>
              <span class="stat-lbl">均龄</span>
            </div>
          </div>
          <div class="seg-meta">
            <span>来源: {{ seg.topSource }}</span>
            <span>偏好: {{ seg.preferredType }}</span>
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- 年龄分布 - Enhanced with ECharts -->
        <div class="card">
          <div class="card-title">年龄性别分布</div>
          <div class="age-chart-area">
            <ChartWrapper :option="ageChartOption" height="100%" />
          </div>
        </div>

        <!-- 客户来源 - Donut Chart -->
        <div class="card">
          <div class="card-title">客户来源渠道</div>
          <div class="source-chart-area">
            <ChartWrapper :option="sourceDonutOption" height="100%" />
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- 偏好分析 - Horizontal bars -->
        <div class="card">
          <div class="card-title">户型/面积偏好</div>
          <div class="pref-list">
            <div v-for="p in preferences" :key="p.name" class="pref-item">
              <span class="pref-name">{{ p.name }}</span>
              <div class="pref-bar-bg">
                <div class="pref-bar-fill" :style="{ width: p.percent + '%', background: p.color }" />
              </div>
              <span class="pref-pct" :style="{ color: p.color }">{{ p.percent }}%</span>
            </div>
          </div>
          <div class="card-title" style="margin-top: 16px">区域偏好</div>
          <div class="pref-list">
            <div v-for="a in areaPrefs" :key="a.name" class="pref-item">
              <span class="pref-name">{{ a.name }}</span>
              <div class="pref-bar-bg">
                <div class="pref-bar-fill" :style="{ width: a.percent + '%', background: a.color }" />
              </div>
              <span class="pref-pct" :style="{ color: a.color }">{{ a.percent }}%</span>
            </div>
          </div>
        </div>

        <!-- 客户画像雷达图 -->
        <div class="card">
          <div class="card-title">客群能力雷达</div>
          <div class="radar-area">
            <ChartWrapper :option="radarOption" height="100%" />
          </div>
        </div>
      </div>

      <!-- 渠道转化对比 -->
      <div class="card">
        <div class="card-title">渠道转化率 × 获客成本</div>
        <div class="source-compare">
          <div v-for="s in sourceCompare" :key="s.name" class="sc-item">
            <span class="sc-name">{{ s.name }}</span>
            <div class="sc-bars">
              <div class="sc-bar-row">
                <span class="sc-bar-label">转化</span>
                <div class="sc-bar-bg">
                  <div class="sc-bar-fill conv" :style="{ width: (s.conversionRate / 25 * 100) + '%' }" />
                </div>
                <span class="sc-rate">{{ s.conversionRate }}%</span>
              </div>
              <div class="sc-bar-row">
                <span class="sc-bar-label">成本</span>
                <div class="sc-bar-bg">
                  <div class="sc-bar-fill cost" :style="{ width: (s.cost / 2500 * 100) + '%' }" />
                </div>
                <span class="sc-cost">{{ s.cost }}元</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 3D Mode -->
    <template v-else>
      <div class="three-d-grid">
        <div class="td-card">
          <div class="card-title">客群3D分布</div>
          <Scatter3DChart :data="scatterData" x-axis-label="预算(万)" y-axis-label="年龄" z-axis-label="转化率(%)" height="100%" />
        </div>
        <div class="td-card">
          <div class="card-title">渠道转化率3D</div>
          <Bar3DChart :data="sourceBarData" height="100%" />
        </div>
      </div>
      <div class="three-d-row">
        <div class="td-card-sm" v-for="seg in profiles" :key="seg.segment">
          <div class="seg-dot" :style="{ background: seg.color }" />
          <span class="seg-name">{{ seg.segment }}</span>
          <span class="seg-pct" :style="{ color: seg.color }">{{ seg.percent }}%</span>
          <span class="td-meta">{{ seg.count }}人 / 均{{ seg.avgBudget }}万</span>
        </div>
      </div>
    </template>

    <!-- AI结论 -->
    <div class="ai-box">
      <div class="ai-icon">AI</div>
      <div class="ai-content">
        <div class="ai-title">客户诊断</div>
        <div class="ai-text">刚需首置占比38%为核心客群，改善置换客单价最高；抖音渠道获客成本低但转化率仅5.2%，建议优化直播话术；老带新转化率22%远超均值，建议加大激励。</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { generateCustomerProfiles, generateAgeDistribution, type CustomerProfile, type AgeDistribution } from '@/utils/pageMockData'
import Scatter3DChart from '@/components/charts/Scatter3DChart.vue'
import Bar3DChart from '@/components/charts/Bar3DChart.vue'
import ChartWrapper from '@/components/common/ChartWrapper.vue'
import PeriodSelector from '@/components/common/PeriodSelector.vue'

const props = withDefaults(defineProps<{ isActive?: boolean; viewMode?: '2d' | '3d'; period?: 'day' | 'week' | 'month' | 'year' }>(), { viewMode: '2d', period: 'month' })

// ===== 宇宙级入场特效 =====
const showEntrance = ref(false)
const scanProgress = ref(0)
const burstOpacity = ref(0)
const holoOpacity = ref(0)
const titleOpacity = ref(0)
const titleTransform = ref('scale(0.8) translateY(20px)')
const starCanvas = ref<HTMLCanvasElement | null>(null)
let animFrameId = 0
let starAnimId = 0

const titleText = '客户画像系统'
const titleChars = titleText.split('')
const dataStream = ['0x4F8A', 'KPI:98.6', 'SEG:6', '38.2%', 'API:OK', 'SYNC', 'ML:v3.1', '◎']

interface FlyingParticle {
  id: number; size: number; color: string; tx: number; ty: number; scale: number; opacity: number; dur: number; delay: number
}
const flyingParticles = ref<FlyingParticle[]>([])

function generateFlyingParticles() {
  const colors = ['#60a5fa', '#a78bfa', '#00e5ff', '#f472b6', '#00d68f', '#ffab00', '#818cf8', '#38bdf8']
  const arr: FlyingParticle[] = []
  for (let i = 0; i < 80; i++) {
    const angle = (Math.PI * 2 * i) / 80 + (Math.random() - 0.5) * 0.5
    const dist = 200 + Math.random() * 500
    arr.push({
      id: i,
      size: 2 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      scale: 0.3 + Math.random() * 1.2,
      opacity: 0.6 + Math.random() * 0.4,
      dur: 1200 + Math.random() * 1500,
      delay: Math.random() * 600,
    })
  }
  flyingParticles.value = arr
}

// 星空 Canvas 动画
interface Star { x: number; y: number; z: number; prevX: number; prevY: number }
let stars: Star[] = []
let canvasW = 0
let canvasH = 0

function initStars() {
  stars = []
  for (let i = 0; i < 400; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 2000,
      prevX: 0, prevY: 0,
    })
  }
}

function animateStars() {
  const canvas = starCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvasW = canvas.width = window.innerWidth
  canvasH = canvas.height = window.innerHeight
  const cx = canvasW / 2
  const cy = canvasH / 2
  const speed = 6

  ctx.fillStyle = 'rgba(4, 6, 12, 0.25)'
  ctx.fillRect(0, 0, canvasW, canvasH)

  for (const s of stars) {
    s.prevX = (s.x / s.z) * 400 + cx
    s.prevY = (s.y / s.z) * 400 + cy
    s.z -= speed
    if (s.z <= 0) {
      s.x = (Math.random() - 0.5) * 2000
      s.y = (Math.random() - 0.5) * 2000
      s.z = 2000
      s.prevX = (s.x / s.z) * 400 + cx
      s.prevY = (s.y / s.z) * 400 + cy
    }
    const sx = (s.x / s.z) * 400 + cx
    const sy = (s.y / s.z) * 400 + cy
    const size = Math.max(0.5, (1 - s.z / 2000) * 3)
    const alpha = Math.min(1, (1 - s.z / 2000) * 1.5)

    // 拖尾线
    ctx.beginPath()
    ctx.moveTo(s.prevX, s.prevY)
    ctx.lineTo(sx, sy)
    ctx.strokeStyle = `rgba(140, 180, 255, ${alpha * 0.6})`
    ctx.lineWidth = size * 0.5
    ctx.stroke()

    // 星点
    ctx.beginPath()
    ctx.arc(sx, sy, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`
    ctx.fill()
  }

  starAnimId = requestAnimationFrame(animateStars)
}

const entrancePlayed = ref(false)

function playEntrance() {
  if (entrancePlayed.value) return
  entrancePlayed.value = true
  generateFlyingParticles()
  initStars()
  showEntrance.value = true
  scanProgress.value = 0
  burstOpacity.value = 0
  holoOpacity.value = 0
  titleOpacity.value = 0
  titleTransform.value = 'scale(0.8) translateY(20px)'

  // 启动星空
  nextTick(() => {
    animateStars()
  })

  const startTime = performance.now()
  const totalDuration = 3500

  // 阶段1: 0-800ms 星空穿越 + 中心光晕
  // 阶段2: 800-2000ms 粒子爆发 + 全息网格
  // 阶段3: 2000-3000ms 标题显现 + 进度条
  // 阶段4: 3000-3500ms 淡出

  function tick(now: number) {
    const elapsed = now - startTime

    // 扫描进度 (0-3000ms)
    const scanT = Math.min(elapsed / 3000, 1)
    scanProgress.value = (1 - Math.pow(1 - scanT, 3)) * 100

    // 中心爆发 (300-1200ms)
    if (elapsed > 300) {
      const bt = Math.min((elapsed - 300) / 900, 1)
      burstOpacity.value = bt < 0.6 ? bt / 0.6 : 1 - (bt - 0.6) / 0.4
    }

    // 全息网格 (600ms+)
    if (elapsed > 600) {
      const ht = Math.min((elapsed - 600) / 800, 1)
      holoOpacity.value = ht < 0.7 ? ht / 0.7 * 0.6 : 0.6 * (1 - (ht - 0.7) / 0.3)
    }

    // 标题 (1000ms+)
    if (elapsed > 1000) {
      const tt = Math.min((elapsed - 1000) / 800, 1)
      const eased = 1 - Math.pow(1 - tt, 3)
      titleOpacity.value = eased
      titleTransform.value = `scale(${0.8 + eased * 0.2}) translateY(${20 - eased * 20}px)`
    }

    if (elapsed < totalDuration) {
      animFrameId = requestAnimationFrame(tick)
    } else {
      // 淡出
      cancelAnimationFrame(starAnimId)
      setTimeout(() => {
        showEntrance.value = false
      }, 200)
    }
  }
  animFrameId = requestAnimationFrame(tick)
}

watch(() => props.isActive, (active) => {
  if (active) {
    nextTick(() => playEntrance())
  }
})

onMounted(() => {
  if (props.isActive) {
    nextTick(() => playEntrance())
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
  cancelAnimationFrame(starAnimId)
})

const localPeriod = ref<'day' | 'week' | 'month' | 'year'>(props.period || 'month')
watch(() => props.period, v => { if (v) localPeriod.value = v })

const profiles = ref<CustomerProfile[]>(generateCustomerProfiles())
const ageDist = ref<AgeDistribution[]>(generateAgeDistribution())

const maxAgeVal = computed(() => Math.max(...ageDist.value.flatMap(a => [a.male, a.female])))

const preferences = ref([
  { name: '80-100㎡', percent: 32, color: '#4a9eff' },
  { name: '100-130㎡', percent: 28, color: '#00d68f' },
  { name: '130-150㎡', percent: 18, color: '#ffab00' },
  { name: '150-200㎡', percent: 12, color: '#a78bfa' },
  { name: '商铺/其他', percent: 10, color: '#6b7590' },
])

const areaPrefs = ref([
  { name: '裕华区', percent: 28, color: '#4a9eff' },
  { name: '长安区', percent: 25, color: '#00d68f' },
  { name: '桥西区', percent: 20, color: '#ffab00' },
  { name: '新华区', percent: 15, color: '#a78bfa' },
  { name: '正定/栾城', percent: 12, color: '#00e5ff' },
])

const sourceCompare = ref([
  { name: '自渠', conversionRate: 18.5, cost: 320, color: '#4a9eff' },
  { name: '贝壳链家', conversionRate: 14.2, cost: 1800, color: '#00d68f' },
  { name: '安居客', conversionRate: 8.6, cost: 450, color: '#ffab00' },
  { name: '抖音直播', conversionRate: 5.2, cost: 180, color: '#a78bfa' },
  { name: '老带新', conversionRate: 22.0, cost: 800, color: '#00e5ff' },
  { name: '中介分销', conversionRate: 10.8, cost: 2200, color: '#f472b6' },
])

// Age distribution ECharts option
const ageChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 18, 23, 0.95)',
    borderColor: 'rgba(96, 165, 250, 0.15)',
    textStyle: { color: '#e2e8f0', fontSize: 11 },
  },
  legend: {
    data: ['男', '女'],
    bottom: 4,
    textStyle: { color: '#64748b', fontSize: 10 },
    itemWidth: 10,
    itemHeight: 6,
  },
  grid: { left: '3%', right: '5%', bottom: '14%', top: '8%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ageDist.value.map(a => a.range),
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    axisLabel: { color: '#64748b', fontSize: 9 },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    axisLabel: { color: '#64748b', fontSize: 9 },
  },
  series: [
    {
      name: '男', type: 'bar', barWidth: 10,
      data: ageDist.value.map(a => a.male),
      itemStyle: { color: '#60a5fa', borderRadius: [3, 3, 0, 0] },
    },
    {
      name: '女', type: 'bar', barWidth: 10,
      data: ageDist.value.map(a => a.female),
      itemStyle: { color: '#f472b6', borderRadius: [3, 3, 0, 0] },
    },
  ],
}))

// Source donut chart option
const sourceDonutOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 18, 23, 0.95)',
    borderColor: 'rgba(96, 165, 250, 0.15)',
    textStyle: { color: '#e2e8f0', fontSize: 11 },
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { color: '#64748b', fontSize: 10 },
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 10,
  },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['35%', '50%'],
    avoidLabelOverlap: false,
    label: { show: false },
    emphasis: {
      label: { show: true, fontSize: 12, fontWeight: 'bold', color: '#e2e8f0' },
      itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,0,0,0.3)' },
    },
    data: sourceCompare.value.map(s => ({
      name: s.name,
      value: Math.round(s.conversionRate * 10),
      itemStyle: { color: s.color },
    })),
  }],
}))

// Radar chart option
const radarOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 18, 23, 0.95)',
    borderColor: 'rgba(96, 165, 250, 0.15)',
    textStyle: { color: '#e2e8f0', fontSize: 11 },
  },
  legend: {
    data: profiles.value.slice(0, 3).map(p => p.segment),
    bottom: 4,
    textStyle: { color: '#64748b', fontSize: 9 },
    itemWidth: 10,
    itemHeight: 6,
  },
  radar: {
    indicator: [
      { name: '客户量', max: 100 },
      { name: '预算力', max: 100 },
      { name: '转化力', max: 100 },
      { name: '忠诚度', max: 100 },
      { name: '复购力', max: 100 },
    ],
    shape: 'polygon',
    splitNumber: 4,
    axisName: { color: '#64748b', fontSize: 9 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.01)'] } },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
  },
  series: [{
    type: 'radar',
    data: profiles.value.slice(0, 3).map(p => ({
      name: p.segment,
      value: [
        Math.min(100, p.count / 5),
        Math.min(100, p.avgBudget / 3),
        Math.min(100, p.percent * 2),
        Math.min(100, 40 + Math.random() * 40),
        Math.min(100, 20 + Math.random() * 50),
      ],
      lineStyle: { color: p.color, width: 1.5 },
      areaStyle: { color: p.color, opacity: 0.1 },
      itemStyle: { color: p.color },
    })),
  }],
}))

const scatterData = computed(() => profiles.value.map(p => ({
  name: p.segment, x: p.avgBudget, y: p.avgAge,
  z: Math.round(p.percent * 0.8 + Math.random() * 10),
  size: Math.max(8, p.count / 50), category: p.segment,
})))

const sourceBarData = computed(() => sourceCompare.value.map(s => ({
  name: s.name, value: s.conversionRate, color: s.color,
})))
</script>

<style scoped lang="scss">
.page { height: 100%; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; background: var(--bg, #0F1217); color: var(--text-body, #cbd5e1); }

// ===== 宇宙级入场特效 =====
.cosmic-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #04060c;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.star-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

// 星云光环
.nebula-ring {
  position: absolute;
  border-radius: 50%;
  z-index: 2;
  pointer-events: none;
}

.nebula-1 {
  width: 120vmax;
  height: 120vmax;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center,
    transparent 30%,
    rgba(96, 165, 250, 0.03) 40%,
    rgba(167, 139, 250, 0.05) 50%,
    rgba(0, 229, 255, 0.03) 60%,
    transparent 70%
  );
  animation: nebulaSpin 20s linear infinite;
}

.nebula-2 {
  width: 80vmax;
  height: 80vmax;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center,
    transparent 40%,
    rgba(244, 114, 182, 0.04) 50%,
    rgba(167, 139, 250, 0.03) 60%,
    transparent 70%
  );
  animation: nebulaSpin 15s linear infinite reverse;
}

.nebula-3 {
  width: 50vmax;
  height: 50vmax;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center,
    transparent 30%,
    rgba(0, 229, 255, 0.06) 45%,
    rgba(96, 165, 250, 0.04) 55%,
    transparent 65%
  );
  animation: nebulaSpin 10s linear infinite;
}

@keyframes nebulaSpin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

// 中心爆发
.center-burst {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
}

.burst-ring {
  position: absolute;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid;
}

.ring-1 {
  width: 200px;
  height: 200px;
  border-color: rgba(96, 165, 250, 0.3);
  animation: ringExpand 2s ease-out infinite;
  box-shadow: 0 0 40px rgba(96, 165, 250, 0.15), inset 0 0 40px rgba(96, 165, 250, 0.05);
}

.ring-2 {
  width: 300px;
  height: 300px;
  border-color: rgba(167, 139, 250, 0.2);
  animation: ringExpand 2s ease-out 0.4s infinite;
  box-shadow: 0 0 60px rgba(167, 139, 250, 0.1);
}

.ring-3 {
  width: 420px;
  height: 420px;
  border-color: rgba(0, 229, 255, 0.12);
  animation: ringExpand 2s ease-out 0.8s infinite;
  box-shadow: 0 0 80px rgba(0, 229, 255, 0.06);
}

.burst-core {
  position: absolute;
  width: 80px;
  height: 80px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(96,165,250,0.4) 30%, rgba(167,139,250,0.2) 60%, transparent 80%);
  box-shadow:
    0 0 60px rgba(96, 165, 250, 0.5),
    0 0 120px rgba(167, 139, 250, 0.3),
    0 0 200px rgba(0, 229, 255, 0.15);
  animation: corePulse 1s ease-in-out infinite alternate;
}

@keyframes ringExpand {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
}

@keyframes corePulse {
  from { transform: translate(-50%, -50%) scale(1); }
  to { transform: translate(-50%, -50%) scale(1.3); }
}

// 飞散粒子
.flying-particle {
  position: absolute;
  border-radius: 50%;
  z-index: 4;
  pointer-events: none;
  will-change: transform, opacity;
  transition-property: transform, opacity;
}

// 全息六边形
.holo-hex-grid {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.hex-svg {
  width: 100%;
  height: 100%;
  opacity: 0.5;
}

// 标题区
.cosmic-title-area {
  position: relative;
  z-index: 10;
  text-align: center;
  will-change: transform, opacity;
}

.cosmic-badge {
  display: inline-block;
  padding: 4px 18px;
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #60a5fa;
  letter-spacing: 3px;
  margin-bottom: 16px;
  background: rgba(96, 165, 250, 0.06);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.1);
}

.cosmic-main-title {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 12px;
}

.title-char {
  display: inline-block;
  font-size: clamp(32px, 6vw, 64px);
  font-weight: 900;
  color: #e2e8f0;
  letter-spacing: 4px;
  text-shadow:
    0 0 20px rgba(96, 165, 250, 0.6),
    0 0 40px rgba(96, 165, 250, 0.3),
    0 0 80px rgba(167, 139, 250, 0.2);
  animation: charReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes charReveal {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.5) rotateX(90deg);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: blur(0);
  }
}

.cosmic-sub-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(10px, 1.5vw, 14px);
  color: #64748b;
  letter-spacing: 8px;
  margin-bottom: 16px;
}

.cosmic-data-stream {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.data-bit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(96, 165, 250, 0.5);
  padding: 2px 8px;
  border: 1px solid rgba(96, 165, 250, 0.1);
  border-radius: 3px;
  animation: dataBitFlicker 2s ease-in-out infinite alternate;
}

@keyframes dataBitFlicker {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; color: #60a5fa; border-color: rgba(96, 165, 250, 0.3); }
}

.cosmic-progress {
  width: clamp(240px, 40vw, 480px);
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  margin: 0 auto 10px;
  overflow: hidden;
}

.cosmic-progress-bar {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #60a5fa, #a78bfa, #00e5ff, #f472b6);
  box-shadow: 0 0 16px rgba(96, 165, 250, 0.6);
  transition: width 0.08s linear;
}

.cosmic-percent {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #60a5fa;
  letter-spacing: 3px;
}

// 角落装饰
.corner-deco {
  position: absolute;
  width: 60px;
  height: 60px;
  z-index: 5;
  pointer-events: none;

  &::before, &::after {
    content: '';
    position: absolute;
    background: rgba(96, 165, 250, 0.2);
  }
}

.top-left {
  left: 20px; top: 20px;
  &::before { left: 0; top: 0; width: 30px; height: 1px; }
  &::after { left: 0; top: 0; width: 1px; height: 30px; }
}

.top-right {
  right: 20px; top: 20px;
  &::before { right: 0; top: 0; width: 30px; height: 1px; }
  &::after { right: 0; top: 0; width: 1px; height: 30px; }
}

.bottom-left {
  left: 20px; bottom: 20px;
  &::before { left: 0; bottom: 0; width: 30px; height: 1px; }
  &::after { left: 0; bottom: 0; width: 1px; height: 30px; }
}

.bottom-right {
  right: 20px; bottom: 20px;
  &::before { right: 0; bottom: 0; width: 30px; height: 1px; }
  &::after { right: 0; bottom: 0; width: 1px; height: 30px; }
}

// Transition
.cosmic-enter-active { transition: opacity 0.3s ease-out; }
.cosmic-leave-active { transition: opacity 0.5s ease-in; }
.cosmic-enter-from { opacity: 0; }
.cosmic-leave-to { opacity: 0; }

// ===== 原有页面样式 =====
.seg-overview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }

.seg-card {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--border, rgba(255,255,255,0.06));
  background: var(--card-bg, #161B22);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 32px rgba(0,0,0,0.4), 0 0 20px var(--seg-color, rgba(96,165,250,0.1));
    border-color: var(--seg-color, rgba(96,165,250,0.2));
  }
}

.seg-glow {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--seg-color, rgba(96,165,250,0.08));
  filter: blur(30px);
  opacity: 0.5;
}

.seg-header { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; position: relative; }
.seg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.seg-name { font-size: 14px; font-weight: 700; color: var(--text-title, #e2e8f0); }
.seg-pct { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; margin-left: auto; position: relative; }

.seg-ring {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 4px auto 8px;

  svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .ring-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 3; }
  .ring-fill { fill: none; stroke-width: 3; stroke-linecap: round; transition: stroke-dasharray 0.8s ease; }
  .ring-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
  }
}

.seg-body { display: flex; gap: 14px; margin-bottom: 8px; position: relative; }
.seg-stat { display: flex; flex-direction: column; }
.stat-val { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--text-title, #e2e8f0); font-weight: 600; }
.stat-lbl { font-size: 9px; color: var(--text-caption, #64748b); letter-spacing: 0.5px; }

.seg-meta { font-size: 10px; color: var(--text-caption, #64748b); display: flex; gap: 8px; position: relative; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.card {
  padding: 14px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06));
  background: var(--card-bg, #161B22); box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s; &:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
}
.card-title { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); margin-bottom: 12px; padding-left: 10px; border-left: 3px solid var(--primary, #60a5fa); }

.age-chart-area { height: 220px; }
.source-chart-area { height: 220px; }
.radar-area { height: 240px; }

.pref-list { display: flex; flex-direction: column; gap: 8px; }
.pref-item { display: flex; align-items: center; gap: 8px; padding: 2px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; padding: 2px 4px; } }
.pref-name { font-size: 11px; color: var(--text-body, #cbd5e1); width: 70px; flex-shrink: 0; }
.pref-bar-bg { flex: 1; height: 8px; background: var(--bar-track, rgba(255,255,255,0.05)); border-radius: 4px; overflow: hidden; }
.pref-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
.pref-pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; width: 36px; text-align: right; flex-shrink: 0; font-weight: 600; }

.source-compare { display: flex; flex-direction: column; gap: 8px; }
.sc-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.sc-name { font-size: 11px; color: var(--text-body, #cbd5e1); width: 60px; flex-shrink: 0; font-weight: 600; }
.sc-bars { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.sc-bar-row { display: flex; align-items: center; gap: 6px; }
.sc-bar-label { font-size: 9px; color: var(--text-caption, #64748b); width: 22px; flex-shrink: 0; }
.sc-bar-bg { flex: 1; height: 6px; background: var(--bar-track, rgba(255,255,255,0.05)); border-radius: 3px; overflow: hidden; }
.sc-bar-fill { height: 100%; border-radius: 3px; transition: width 0.4s; &.conv { background: var(--primary, #60a5fa); } &.cost { background: var(--warning, #F59E0B); } }
.sc-rate { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--success, #22C55E); width: 40px; text-align: right; flex-shrink: 0; font-weight: 600; }
.sc-cost { font-size: 10px; color: var(--text-caption, #64748b); width: 50px; text-align: right; flex-shrink: 0; }

.ai-box { display: flex; gap: 10px; padding: 14px; border-radius: 10px; border: 1px solid var(--primary-light, rgba(96,165,250,0.12)); background: var(--primary-light, rgba(96,165,250,0.06)); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.ai-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--primary-light, rgba(96,165,250,0.12)); color: var(--primary, #60a5fa); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ai-content { flex: 1; }
.ai-title { font-size: 12px; font-weight: 600; color: var(--primary, #60a5fa); margin-bottom: 4px; }
.ai-text { font-size: 11px; color: var(--text-body, #cbd5e1); line-height: 1.7; }

// 3D mode
.three-d-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; flex: 1; min-height: 0; }
.td-card { padding: 10px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22); min-height: 220px; }
.three-d-row { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
.td-card-sm { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22); }
.td-meta { font-size: 10px; color: var(--text-caption, #64748b); }

@media (max-width: 768px) {
  .seg-overview { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .three-d-grid { grid-template-columns: 1fr; }
}
</style>

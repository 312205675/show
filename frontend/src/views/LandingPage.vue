<template>
  <div class="landing-page">
    <!-- Particle Background -->
    <canvas ref="canvasRef" class="particle-canvas" />

    <!-- Top Section: Data Flow -->
    <section class="flow-section">
      <div class="section-header">
        <h1 class="main-title">
          <span class="title-smart">SMART</span><span class="title-estate">ESTATE</span>
        </h1>
        <p class="main-subtitle">石家庄城发投 · 智慧楼盘数据中台</p>
      </div>

      <div class="flow-diagram">
        <!-- District Nodes -->
        <div class="district-nodes">
          <div
            v-for="(dist, idx) in districts"
            :key="dist.name"
            class="district-node"
            :style="{ '--delay': idx * 0.12 + 's', '--angle': dist.angle + 'deg' }"
          >
            <div class="node-ring">
              <div class="node-dot" />
            </div>
            <div class="node-icon" v-html="dist.icon" />
            <div class="node-label">{{ dist.name }}</div>
            <div class="node-stat">{{ dist.count }}<span class="node-unit">盘</span></div>
            <!-- Animated connection line -->
            <svg class="conn-line" :style="{ '--delay': idx * 0.15 + 's' }">
              <line :x1="dist.lineX1" :y1="dist.lineY1" :x2="dist.lineX2" :y2="dist.lineY2" />
            </svg>
          </div>
        </div>

        <!-- Central Engine -->
        <div class="engine-node">
          <div class="engine-outer-ring" />
          <div class="engine-mid-ring" />
          <div class="engine-core">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div class="engine-label">数据处理引擎</div>
          <div class="engine-sub">Data Processing Engine</div>
          <div class="engine-stats">
            <div class="es-item">
              <span class="es-val">{{ animatedData.projects }}</span>
              <span class="es-unit">项目</span>
            </div>
            <div class="es-divider" />
            <div class="es-item">
              <span class="es-val">{{ animatedData.records }}</span>
              <span class="es-unit">万条</span>
            </div>
            <div class="es-divider" />
            <div class="es-item">
              <span class="es-val">{{ animatedData.refreshRate }}</span>
              <span class="es-unit">秒刷新</span>
            </div>
          </div>
        </div>

        <!-- Flow Label -->
        <div class="flow-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
          <span>实时数据汇聚</span>
        </div>
      </div>
    </section>

    <!-- Bottom Section: Entry Cards -->
    <section class="entry-section">
      <div class="entry-divider">
        <div class="divider-line" />
        <div class="divider-label">系统入口</div>
        <div class="divider-line" />
      </div>

      <div class="entry-cards">
        <!-- Dashboard Entry -->
        <router-link to="/dashboard" class="entry-card dashboard-card">
          <div class="card-glow" />
          <div class="card-border-anim" />
          <div class="card-content">
            <div class="card-icon-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <div class="card-info">
              <h2 class="card-title">决策驾驶舱</h2>
              <p class="card-desc">集团全局数据大盘 · 多维度分析 · AI智能预测</p>
              <div class="card-tags">
                <span class="tag">去化率</span>
                <span class="tag">回款率</span>
                <span class="tag">风险诊断</span>
                <span class="tag">3D地图</span>
              </div>
            </div>
            <div class="card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </router-link>

        <!-- BigData Entry -->
        <router-link to="/bigdata" class="entry-card bigdata-card">
          <div class="card-glow bigdata-glow" />
          <div class="card-border-anim" />
          <div class="card-content">
            <div class="card-icon-wrap bigdata-icon-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </div>
            <div class="card-info">
              <h2 class="card-title">大数据平台</h2>
              <p class="card-desc">多源数据汇聚 · 数据湖仓 · 实时计算引擎</p>
              <div class="card-tags">
                <span class="tag">Lakehouse</span>
                <span class="tag">Flink</span>
                <span class="tag">ClickHouse</span>
                <span class="tag">数据治理</span>
              </div>
            </div>
            <div class="card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </router-link>

        <!-- AI Engine Entry -->
        <router-link to="/aiengine" class="entry-card ai-card">
          <div class="card-glow ai-glow" />
          <div class="card-border-anim" />
          <div class="card-content">
            <div class="card-icon-wrap ai-icon-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div class="card-info">
              <h2 class="card-title">AI 智能引擎</h2>
              <p class="card-desc">自然语言查询 · 智能决策预测 · AI辅助分析</p>
              <div class="card-tags">
                <span class="tag">LLM</span>
                <span class="tag">RAG</span>
                <span class="tag">NL2SQL</span>
                <span class="tag">Agent</span>
              </div>
            </div>
            <div class="card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </router-link>

        <!-- Staff Entry -->
        <router-link to="/staff" class="entry-card staff-card">
          <div class="card-glow staff-glow" />
          <div class="card-border-anim" />
          <div class="card-content">
            <div class="card-icon-wrap staff-icon-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div class="card-info">
              <h2 class="card-title">后台管理</h2>
              <p class="card-desc">业务录入 · 客户管理 · 渠道追踪 · 房源库存</p>
              <div class="card-tags">
                <span class="tag">成交录入</span>
                <span class="tag">回款管理</span>
                <span class="tag">线索跟进</span>
                <span class="tag">渠道数据</span>
              </div>
            </div>
            <div class="card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </router-link>
      </div>

      <div class="footer-info">
        <span class="footer-dot" />
        <span>Powered by SmartEstate Data Platform v2.0</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const districts = [
  { name: '长安区', count: 5, angle: -60, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>', lineX1: '100%', lineY1: '50%', lineX2: '0%', lineY2: '50%' },
  { name: '桥西区', count: 4, angle: -30, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>', lineX1: '100%', lineY1: '50%', lineX2: '0%', lineY2: '50%' },
  { name: '裕华区', count: 6, angle: 0, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', lineX1: '100%', lineY1: '50%', lineX2: '0%', lineY2: '50%' },
  { name: '新华区', count: 3, angle: 30, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>', lineX1: '100%', lineY1: '50%', lineX2: '0%', lineY2: '50%' },
  { name: '鹿泉区', count: 4, angle: 60, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>', lineX1: '100%', lineY1: '50%', lineX2: '0%', lineY2: '50%' },
  { name: '高新区', count: 2, angle: 90, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', lineX1: '100%', lineY1: '50%', lineX2: '0%', lineY2: '50%' },
]

const animatedData = reactive({
  projects: 0,
  records: 0,
  refreshRate: 0,
})

// Particle animation
let animFrameId = 0

function initParticles() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = []
  const count = 80

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.4 + 0.1,
    })
  }

  function draw() {
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(96, 165, 250, ${p.a})`
      ctx.fill()
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(96, 165, 250, ${0.08 * (1 - dist / 120)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    animFrameId = requestAnimationFrame(draw)
  }

  draw()

  return () => {
    cancelAnimationFrame(animFrameId)
    window.removeEventListener('resize', resize)
  }
}

// Counter animation
function animateCount(target: number, key: keyof typeof animatedData, duration = 2000) {
  const start = performance.now()
  function step(now: number) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    animatedData[key] = Math.round(target * eased)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

let cleanup: (() => void) | undefined

onMounted(() => {
  cleanup = initParticles()
  animateCount(24, 'projects', 2000)
  animateCount(860, 'records', 2500)
  animateCount(30, 'refreshRate', 1800)
})

onUnmounted(() => {
  if (cleanup) cleanup()
  cancelAnimationFrame(animFrameId)
})
</script>

<style lang="scss" scoped>
.landing-page {
  width: 100vw;
  height: 100vh;
  background: #060a10;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', -apple-system, sans-serif;
}

.particle-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

// ===== Top Section: Data Flow =====
.flow-section {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 24px 40px 0;
  min-height: 0;
}

.section-header {
  text-align: center;
  margin-bottom: 16px;
  animation: fadeSlideDown 0.8s ease-out both;
}

@keyframes fadeSlideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.main-title {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: 6px;
  margin: 0;
  line-height: 1.2;
}

.title-smart {
  color: #e2e8f0;
}

.title-estate {
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-subtitle {
  font-size: 14px;
  color: #64748b;
  letter-spacing: 3px;
  margin: 6px 0 0;
}

// ===== Flow Diagram =====
.flow-diagram {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.district-nodes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.district-node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  animation: nodeAppear 0.6s ease-out both;
  animation-delay: var(--delay);

  &:nth-child(1) { left: 2%; top: 8%; }
  &:nth-child(2) { left: 8%; top: 48%; }
  &:nth-child(3) { left: 18%; top: 78%; }
  &:nth-child(4) { right: 18%; top: 8%; }
  &:nth-child(5) { right: 8%; top: 48%; }
  &:nth-child(6) { right: 2%; top: 78%; }
}

@keyframes nodeAppear {
  from { opacity: 0; transform: scale(0.7); }
  to { opacity: 1; transform: scale(1); }
}

.node-ring {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid rgba(96, 165, 250, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(96, 165, 250, 0.06);
  position: relative;
  transition: all 0.3s;

  .district-node:hover & {
    border-color: rgba(96, 165, 250, 0.7);
    background: rgba(96, 165, 250, 0.12);
    box-shadow: 0 0 20px rgba(96, 165, 250, 0.2);
  }
}

.node-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #60a5fa;
  box-shadow: 0 0 6px rgba(96, 165, 250, 0.5);
  animation: dotPulse 2s ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.6); }
}

.node-icon {
  color: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-label {
  font-size: 11px;
  font-weight: 600;
  color: #cbd5e1;
  white-space: nowrap;
}

.node-stat {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: #60a5fa;
}

.node-unit {
  font-size: 10px;
  font-weight: 400;
  color: #64748b;
  margin-left: 1px;
}

.conn-line {
  position: absolute;
  width: 100px;
  height: 2px;
  top: 24px;
  right: -100px;
  overflow: visible;
  animation: lineAppear 0.5s ease-out both;
  animation-delay: var(--delay);

  line {
    stroke: rgba(96, 165, 250, 0.2);
    stroke-width: 1.5;
    stroke-dasharray: 6 4;
    animation: dashFlow 2s linear infinite;
    animation-delay: var(--delay);
  }
}

.district-node:nth-child(n+4) .conn-line {
  right: auto;
  left: -100px;

  line {
    animation-direction: reverse;
  }
}

@keyframes lineAppear {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes dashFlow {
  to { stroke-dashoffset: -20; }
}

// ===== Central Engine =====
.engine-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
  animation: engineAppear 1s ease-out both;
  animation-delay: 0.4s;
}

@keyframes engineAppear {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

.engine-outer-ring {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 1px solid rgba(96, 165, 250, 0.12);
  top: -36px;
  animation: ringRotate 20s linear infinite;
}

.engine-mid-ring {
  position: absolute;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 1px dashed rgba(167, 139, 250, 0.15);
  top: -21px;
  animation: ringRotate 15s linear infinite reverse;
}

@keyframes ringRotate {
  to { transform: rotate(360deg); }
}

.engine-core {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(167, 139, 250, 0.15));
  border: 2px solid rgba(96, 165, 250, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
  box-shadow: 0 0 40px rgba(96, 165, 250, 0.2), 0 0 80px rgba(96, 165, 250, 0.08), inset 0 0 20px rgba(96, 165, 250, 0.1);
  animation: corePulse 3s ease-in-out infinite;
  position: relative;
}

@keyframes corePulse {
  0%, 100% { box-shadow: 0 0 40px rgba(96, 165, 250, 0.2), 0 0 80px rgba(96, 165, 250, 0.08); }
  50% { box-shadow: 0 0 60px rgba(96, 165, 250, 0.35), 0 0 120px rgba(96, 165, 250, 0.15); }
}

.engine-label {
  font-size: 16px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 2px;
}

.engine-sub {
  font-size: 10px;
  color: #64748b;
  letter-spacing: 1.5px;
  margin-top: -4px;
}

.engine-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(96, 165, 250, 0.06);
  border: 1px solid rgba(96, 165, 250, 0.12);
}

.es-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.es-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 700;
  color: #60a5fa;
  line-height: 1.2;
}

.es-unit {
  font-size: 9px;
  color: #64748b;
}

.es-divider {
  width: 1px;
  height: 24px;
  background: rgba(96, 165, 250, 0.15);
}

.flow-label {
  position: absolute;
  bottom: -8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #64748b;
  animation: flowBlink 3s ease-in-out infinite;

  svg { color: #60a5fa; }
}

@keyframes flowBlink {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

// ===== Bottom Section: Entry Cards =====
.entry-section {
  flex: 0.9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 0 40px 24px;
  gap: 20px;
}

.entry-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 800px;
  animation: fadeSlideDown 0.8s ease-out both;
  animation-delay: 0.6s;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.3), transparent);
}

.divider-label {
  font-size: 12px;
  color: #64748b;
  letter-spacing: 3px;
  font-weight: 600;
  white-space: nowrap;
}

.entry-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  width: 100%;
  max-width: 860px;
}

.entry-card {
  flex: 1;
  position: relative;
  border-radius: 14px;
  background: rgba(22, 27, 34, 0.8);
  border: 1px solid rgba(96, 165, 250, 0.1);
  padding: 22px 20px;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  animation: cardAppear 0.7s ease-out both;

  &:first-child { animation-delay: 0.8s; }
  &:nth-child(2) { animation-delay: 0.9s; }
  &:nth-child(3) { animation-delay: 1.0s; }
  &:last-child { animation-delay: 1.1s; }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: rgba(96, 165, 250, 0.35);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(96, 165, 250, 0.1);

    .card-glow { opacity: 1; }
    .card-arrow { transform: translateX(4px); color: #60a5fa; }
    .card-icon-wrap { box-shadow: 0 0 24px rgba(96, 165, 250, 0.3); }
  }

  &.staff-card:hover {
    border-color: rgba(167, 139, 250, 0.35);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(167, 139, 250, 0.1);

    .staff-glow { opacity: 1; }
    .staff-icon-wrap { box-shadow: 0 0 24px rgba(167, 139, 250, 0.3); }
    .card-arrow { color: #a78bfa; }
  }

  &.bigdata-card:hover {
    border-color: rgba(34, 211, 238, 0.35);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 211, 238, 0.1);

    .bigdata-glow { opacity: 1; }
    .bigdata-icon-wrap { box-shadow: 0 0 24px rgba(34, 211, 238, 0.3); }
    .card-arrow { color: #22d3ee; }
  }

  &.ai-card:hover {
    border-color: rgba(168, 85, 247, 0.35);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(168, 85, 247, 0.1);

    .ai-glow { opacity: 1; }
    .ai-icon-wrap { box-shadow: 0 0 24px rgba(168, 85, 247, 0.3); }
    .card-arrow { color: #a855f7; }
  }
}

@keyframes cardAppear {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(ellipse at center, rgba(96, 165, 250, 0.06) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;

  &.staff-glow {
    background: radial-gradient(ellipse at center, rgba(167, 139, 250, 0.06) 0%, transparent 60%);
  }

  &.bigdata-glow {
    background: radial-gradient(ellipse at center, rgba(34, 211, 238, 0.06) 0%, transparent 60%);
  }

  &.ai-glow {
    background: radial-gradient(ellipse at center, rgba(168, 85, 247, 0.06) 0%, transparent 60%);
  }
}

.card-border-anim {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  pointer-events: none;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent 0deg, rgba(96, 165, 250, 0.15) 90deg, transparent 180deg);
    animation: borderSpin 6s linear infinite;

    .staff-card & {
      background: conic-gradient(from 0deg, transparent 0deg, rgba(167, 139, 250, 0.15) 90deg, transparent 180deg);
    }

    .bigdata-card & {
      background: conic-gradient(from 0deg, transparent 0deg, rgba(34, 211, 238, 0.15) 90deg, transparent 180deg);
    }

    .ai-card & {
      background: conic-gradient(from 0deg, transparent 0deg, rgba(168, 85, 247, 0.15) 90deg, transparent 180deg);
    }
  }
}

@keyframes borderSpin {
  to { transform: rotate(360deg); }
}

.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(96, 165, 250, 0.05));
  border: 1px solid rgba(96, 165, 250, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
  flex-shrink: 0;
  transition: all 0.4s;

  &.staff-icon-wrap {
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(167, 139, 250, 0.05));
    border-color: rgba(167, 139, 250, 0.2);
    color: #a78bfa;
  }

  &.bigdata-icon-wrap {
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(34, 211, 238, 0.05));
    border-color: rgba(34, 211, 238, 0.2);
    color: #22d3ee;
  }

  &.ai-icon-wrap {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.05));
    border-color: rgba(168, 85, 247, 0.2);
    color: #a855f7;
  }
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 5px;
  letter-spacing: 1px;
}

.card-desc {
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 10px;
  line-height: 1.5;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(96, 165, 250, 0.08);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.12);

  .staff-card & {
    background: rgba(167, 139, 250, 0.08);
    color: #a78bfa;
    border-color: rgba(167, 139, 250, 0.12);
  }

  .bigdata-card & {
    background: rgba(34, 211, 238, 0.08);
    color: #22d3ee;
    border-color: rgba(34, 211, 238, 0.12);
  }

  .ai-card & {
    background: rgba(168, 85, 247, 0.08);
    color: #a855f7;
    border-color: rgba(168, 85, 247, 0.12);
  }
}

.card-arrow {
  color: #475569;
  flex-shrink: 0;
  transition: all 0.3s;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #475569;
  letter-spacing: 1px;
  animation: fadeSlideDown 0.8s ease-out both;
  animation-delay: 1.2s;
}

.footer-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
  animation: dotPulse 2s ease-in-out infinite;
}

// ===== Responsive =====
@media (max-width: 768px) {
  .flow-section { padding: 16px 16px 0; }
  .entry-section { padding: 0 16px 16px; }

  .main-title { font-size: 28px; letter-spacing: 3px; }
  .main-subtitle { font-size: 11px; }

  .flow-diagram { height: 200px; }

  .district-node {
    &:nth-child(1) { left: 0%; top: 5%; }
    &:nth-child(2) { left: 5%; top: 45%; }
    &:nth-child(3) { left: 15%; top: 80%; }
    &:nth-child(4) { right: 15%; top: 5%; }
    &:nth-child(5) { right: 5%; top: 45%; }
    &:nth-child(6) { right: 0%; top: 80%; }
  }

  .node-ring { width: 38px; height: 38px; }
  .node-icon { :deep(svg) { width: 16px; height: 16px; } }
  .node-label { font-size: 9px; }
  .node-stat { font-size: 11px; }

  .conn-line { width: 60px; right: -60px; }
  .district-node:nth-child(n+4) .conn-line { left: -60px; }

  .engine-core { width: 52px; height: 52px; }
  .engine-outer-ring { width: 100px; height: 100px; top: -24px; }
  .engine-mid-ring { width: 80px; height: 80px; top: -14px; }
  .engine-label { font-size: 13px; }

  .entry-cards { grid-template-columns: 1fr; gap: 10px; }

  .card-content { gap: 12px; }
  .card-icon-wrap { width: 44px; height: 44px; }
  .card-title { font-size: 15px; }
}
</style>

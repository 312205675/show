<template>
  <div id="app-root" class="w-full h-full">
    <router-view />
    <!-- Page Transition Overlay -->
    <Teleport to="body">
      <Transition name="pt-overlay">
        <div v-if="transitionActive" class="page-transition" :class="`pt-${transitionType}`">

          <!-- ===== BigData: Data Vortex Portal ===== -->
          <template v-if="transitionType === 'bigdata'">
            <div class="pt-rain">
              <span v-for="col in bigDataRain" :key="col.id" class="rain-col" :style="col.style">{{ col.text }}</span>
            </div>
            <div class="pt-vortex">
              <svg class="vortex-svg" viewBox="0 0 200 200">
                <polygon class="hex-outer" :points="hexPoints(100, 100, 85)" />
                <polygon class="hex-mid" :points="hexPoints(100, 100, 60)" />
                <polygon class="hex-inner" :points="hexPoints(100, 100, 35)" />
              </svg>
              <div class="vortex-core">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
              </div>
            </div>
            <div class="pt-streams">
              <div v-for="s in bigDataStreams" :key="s.id" class="stream-line" :style="s.style" />
            </div>
            <div class="pt-orbit-labels">
              <span v-for="lb in bigDataOrbitLabels" :key="lb.text" class="orbit-label" :style="{ '--angle': lb.angle + 'deg', '--delay': lb.delay }">{{ lb.text }}</span>
            </div>
          </template>

          <!-- ===== AI: Neural Genesis ===== -->
          <template v-if="transitionType === 'ai'">
            <div class="pt-neural-field">
              <svg class="neural-svg" viewBox="0 0 400 400">
                <line v-for="conn in aiConnections" :key="conn.id" class="neural-arc" :x1="conn.x1" :y1="conn.y1" :x2="conn.x2" :y2="conn.y2" :style="{ animationDelay: conn.delay + 's' }" />
              </svg>
              <div v-for="node in aiNeuralNodes" :key="node.id" class="neural-node" :style="node.style">
                <div class="node-ring-anim" />
                <span class="node-label">{{ node.label }}</span>
              </div>
            </div>
            <div class="ai-brain-core">
              <div class="brain-pulse" />
              <div class="brain-pulse p2" />
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div class="ai-sparks">
              <div v-for="sp in aiSparks" :key="sp.id" class="spark" :style="sp.style" />
            </div>
          </template>

          <!-- ===== Staff: Command Center Boot ===== -->
          <template v-if="transitionType === 'staff'">
            <div class="pt-scanline" />
            <div class="pt-grid-overlay" />
            <div class="pt-hud">
              <div class="hud-corner tl" /><div class="hud-corner tr" />
              <div class="hud-corner bl" /><div class="hud-corner br" />
              <div class="hud-line top" /><div class="hud-line bottom" />
              <div class="hud-line left" /><div class="hud-line right" />
            </div>
            <div class="pt-panels">
              <div v-for="p in staffBootPanels" :key="p.id" class="boot-panel" :style="p.style">
                <div class="panel-scan" />
                <div class="panel-label">{{ p.label }}</div>
              </div>
            </div>
            <div class="pt-boot-text">
              <div class="boot-line l1">SYSTEM INITIALIZING<span class="boot-cursor">_</span></div>
              <div class="boot-line l2">MODULES LOADING...<span class="boot-check">✓</span></div>
              <div class="boot-line l3">SYSTEM ONLINE</div>
            </div>
          </template>

          <!-- Common Flash -->
          <div class="pt-flash" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { usePageTransition } from '@/composables/usePageTransition'

const { transitionActive, transitionType } = usePageTransition()

// ===== Helper =====
function hexPoints(cx: number, cy: number, r: number, sides = 6) {
  return Array.from({ length: sides }, (_, i) => {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')
}

// ===== BigData Animation Data =====
const bigDataRain = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  style: {
    left: `${(i / 24) * 100}%`,
    animationDelay: `${(Math.random() * 1.2).toFixed(2)}s`,
    animationDuration: `${(0.8 + Math.random() * 1.0).toFixed(2)}s`,
  },
  text: Array.from({ length: 14 }, () =>
    '0123456789ABCDEF'[Math.floor(Math.random() * 16)]
  ).join('\n'),
}))

const bigDataStreams = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2
  return {
    id: i,
    style: {
      '--angle': (angle * 180 / Math.PI).toFixed(1) + 'deg',
      animationDelay: `${(i * 0.06).toFixed(2)}s`,
    },
  }
})

const bigDataOrbitLabels = [
  { text: 'Lakehouse', angle: -60, delay: '0.5s' },
  { text: 'Flink', angle: 0, delay: '0.65s' },
  { text: 'ClickHouse', angle: 60, delay: '0.8s' },
  { text: 'Kafka', angle: 120, delay: '0.95s' },
  { text: '数据治理', angle: 180, delay: '1.1s' },
  { text: '实时计算', angle: 240, delay: '1.25s' },
]

// ===== AI Animation Data =====
const aiNeuralNodes = Array.from({ length: 6 }, (_, i) => {
  const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
  const r = 30
  return {
    id: i,
    label: ['LLM', 'RAG', 'NL2SQL', 'Agent', 'Embed', 'Vector'][i],
    style: {
      left: `${50 + Math.cos(angle) * r}%`,
      top: `${50 + Math.sin(angle) * r}%`,
      animationDelay: `${(0.2 + i * 0.1).toFixed(2)}s`,
    },
  }
})

const aiConnections = (() => {
  const conns: { id: number; x1: number; y1: number; x2: number; y2: number; delay: string }[] = []
  const pairs = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3],[1,4],[2,5]]
  pairs.forEach(([a, b], i) => {
    const angleA = (a / 6) * Math.PI * 2 - Math.PI / 2
    const angleB = (b / 6) * Math.PI * 2 - Math.PI / 2
    const r = 30
    conns.push({
      id: i,
      x1: 200 + Math.cos(angleA) * r * 4,
      y1: 200 + Math.sin(angleA) * r * 4,
      x2: 200 + Math.cos(angleB) * r * 4,
      y2: 200 + Math.sin(angleB) * r * 4,
      delay: (0.4 + i * 0.07).toFixed(2),
    })
  })
  return conns
})()

const aiSparks = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  style: {
    left: `${10 + Math.random() * 80}%`,
    top: `${10 + Math.random() * 80}%`,
    animationDelay: `${(Math.random() * 1.0).toFixed(2)}s`,
    animationDuration: `${(0.4 + Math.random() * 0.6).toFixed(2)}s`,
    '--dx': `${(Math.random() - 0.5) * 60}px`,
    '--dy': `${(Math.random() - 0.5) * 60}px`,
  },
}))

// ===== Staff Animation Data =====
const staffBootPanels = [
  { id: 'sidebar', label: '导航', left: '2%', top: '5%', width: '15%', height: '88%', delay: '0.3s' },
  { id: 'header', label: '顶栏', left: '19%', top: '3%', width: '79%', height: '7%', delay: '0.4s' },
  { id: 'stat1', label: '成交', left: '19%', top: '12%', width: '26%', height: '20%', delay: '0.5s' },
  { id: 'stat2', label: '回款', left: '47%', top: '12%', width: '26%', height: '20%', delay: '0.55s' },
  { id: 'stat3', label: '线索', left: '75%', top: '12%', width: '23%', height: '20%', delay: '0.6s' },
  { id: 'table', label: '数据表', left: '19%', top: '34%', width: '55%', height: '60%', delay: '0.65s' },
  { id: 'chart', label: '图表', left: '76%', top: '34%', width: '22%', height: '60%', delay: '0.7s' },
].map(p => ({
  ...p,
  style: {
    left: p.left, top: p.top, width: p.width, height: p.height,
    animationDelay: p.delay,
  },
}))
</script>

<style lang="scss">
// ============================================
// Page Transition Overlay (Non-scoped for Teleport)
// ============================================
.page-transition {
  position: fixed;
  inset: 0;
  z-index: 99999;
  overflow: hidden;
  background: #060a10;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Overlay transition
.pt-overlay-enter-active { transition: opacity 0.3s ease; }
.pt-overlay-leave-active { transition: opacity 0.5s ease; }
.pt-overlay-enter-from, .pt-overlay-leave-to { opacity: 0; }

// Common flash
.pt-flash {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}

// ============================================
// BigData: Data Vortex Portal (Cyan #22d3ee)
// ============================================
.pt-bigdata {
  .pt-flash {
    background: radial-gradient(circle, rgba(34, 211, 238, 0.9), rgba(34, 211, 238, 0.3));
    animation: ptFlash 0.4s ease 1.4s both;
  }
}

// Binary Rain
.pt-rain {
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0.6;
}

.rain-col {
  position: absolute;
  top: -100%;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  line-height: 1.4;
  color: #22d3ee;
  white-space: pre;
  text-shadow: 0 0 6px rgba(34, 211, 238, 0.5);
  animation: rainFall linear infinite;
}

@keyframes rainFall {
  from { transform: translateY(-100%); }
  to { transform: translateY(calc(100vh + 100%)); }
}

// Vortex
.pt-vortex {
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vortex-svg {
  position: absolute;
  width: 100%;
  height: 100%;
}

.hex-outer {
  fill: none;
  stroke: #22d3ee;
  stroke-width: 2;
  stroke-dasharray: 520;
  stroke-dashoffset: 520;
  filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.6));
  animation: hexDraw 0.8s ease-out 0.3s forwards, hexRotate 8s linear 1.1s infinite;
  transform-origin: 100px 100px;
}

.hex-mid {
  fill: none;
  stroke: rgba(34, 211, 238, 0.5);
  stroke-width: 1.5;
  stroke-dasharray: 360;
  stroke-dashoffset: 360;
  filter: drop-shadow(0 0 6px rgba(34, 211, 238, 0.4));
  animation: hexDraw 0.7s ease-out 0.5s forwards, hexRotate 6s linear 0.9s infinite reverse;
  transform-origin: 100px 100px;
}

.hex-inner {
  fill: rgba(34, 211, 238, 0.05);
  stroke: rgba(34, 211, 238, 0.7);
  stroke-width: 1.5;
  stroke-dasharray: 210;
  stroke-dashoffset: 210;
  filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.5));
  animation: hexDraw 0.6s ease-out 0.7s forwards, hexRotate 4s linear 1.3s infinite;
  transform-origin: 100px 100px;
}

@keyframes hexDraw {
  to { stroke-dashoffset: 0; }
}

@keyframes hexRotate {
  to { transform: rotate(360deg); }
}

.vortex-core {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.05));
  border: 1.5px solid rgba(34, 211, 238, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22d3ee;
  z-index: 2;
  animation: coreAppear 0.5s ease-out 0.8s both, coreGlow 2s ease-in-out 1.3s infinite;
}

@keyframes coreAppear {
  from { opacity: 0; transform: scale(0); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes coreGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), 0 0 40px rgba(34, 211, 238, 0.1); }
  50% { box-shadow: 0 0 40px rgba(34, 211, 238, 0.6), 0 0 80px rgba(34, 211, 238, 0.2); }
}

// Data Streams
.pt-streams {
  position: absolute;
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.stream-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 2px;
  transform-origin: 0 0;
  transform: rotate(var(--angle));
  background: linear-gradient(90deg, rgba(34, 211, 238, 0.8), transparent);
  animation: streamPulse 1.5s ease-in-out infinite;
  border-radius: 1px;
  box-shadow: 0 0 6px rgba(34, 211, 238, 0.4);
}

@keyframes streamPulse {
  0% { opacity: 0; width: 0; }
  30% { opacity: 1; width: 120px; }
  60% { opacity: 0.6; width: 80px; }
  100% { opacity: 0; width: 0; }
}

// Orbit Labels
.pt-orbit-labels {
  position: absolute;
  width: 320px;
  height: 320px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: orbitSpin 10s linear infinite;
}

@keyframes orbitSpin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.orbit-label {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  color: #22d3ee;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.25);
  white-space: nowrap;
  left: 50%;
  top: 50%;
  transform: rotate(var(--angle)) translateY(-140px) rotate(calc(-1 * var(--angle)));
  animation: labelAppear 0.4s ease-out var(--delay) both;
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.4);
}

@keyframes labelAppear {
  from { opacity: 0; transform: rotate(var(--angle)) translateY(-100px) rotate(calc(-1 * var(--angle))) scale(0.5); }
  to { opacity: 1; transform: rotate(var(--angle)) translateY(-140px) rotate(calc(-1 * var(--angle))) scale(1); }
}

// ============================================
// AI: Neural Genesis (Purple #a855f7)
// ============================================
.pt-ai {
  .pt-flash {
    background: radial-gradient(circle, rgba(168, 85, 247, 0.9), rgba(168, 85, 247, 0.3));
    animation: ptFlash 0.4s ease 1.4s both;
  }
}

.pt-neural-field {
  position: absolute;
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.neural-svg {
  position: absolute;
  width: 100%;
  height: 100%;
}

.neural-arc {
  stroke: rgba(168, 85, 247, 0.6);
  stroke-width: 1.5;
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  filter: drop-shadow(0 0 4px rgba(168, 85, 247, 0.5));
  animation: arcDraw 0.5s ease-out forwards;
}

@keyframes arcDraw {
  to { stroke-dashoffset: 0; }
}

.neural-node {
  position: absolute;
  width: 52px;
  height: 52px;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: nodeAppear 0.5s ease-out forwards;
}

.node-ring-anim {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(168, 85, 247, 0.6);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.3), inset 0 0 8px rgba(168, 85, 247, 0.15);
  animation: nodePulse 1.5s ease-in-out infinite;
}

@keyframes nodeAppear {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes nodePulse {
  0%, 100% { box-shadow: 0 0 12px rgba(168, 85, 247, 0.3), inset 0 0 8px rgba(168, 85, 247, 0.15); transform: scale(1); }
  50% { box-shadow: 0 0 24px rgba(168, 85, 247, 0.5), inset 0 0 12px rgba(168, 85, 247, 0.25); transform: scale(1.08); }
}

.node-label {
  position: relative;
  z-index: 1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  color: #a855f7;
  text-shadow: 0 0 6px rgba(168, 85, 247, 0.5);
}

// AI Brain Core
.ai-brain-core {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.25), rgba(168, 85, 247, 0.05));
  border: 2px solid rgba(168, 85, 247, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a855f7;
  animation: brainAppear 0.6s ease-out 0.3s both;
  z-index: 3;
}

@keyframes brainAppear {
  from { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1.3); }
  to { opacity: 1; transform: scale(1); }
}

.brain-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1.5px solid rgba(168, 85, 247, 0.4);
  animation: brainRing 2s ease-out 0.8s infinite;

  &.p2 { animation-delay: 1.2s; }
}

@keyframes brainRing {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(3); opacity: 0; }
}

// AI Sparks
.ai-sparks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.spark {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #a855f7;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.8);
  animation: sparkBurst ease-out infinite;
}

@keyframes sparkBurst {
  0% { opacity: 0; transform: translate(0, 0) scale(1); }
  20% { opacity: 1; transform: scale(1.5); }
  100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0); }
}

// ============================================
// Staff: Command Center Boot (Lavender #a78bfa)
// ============================================
.pt-staff {
  .pt-flash {
    background: radial-gradient(circle, rgba(167, 139, 250, 0.8), rgba(167, 139, 250, 0.2));
    animation: ptFlash 0.4s ease 1.5s both;
  }
}

// Scan Line
.pt-scanline {
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.8), rgba(167, 139, 250, 0.4), transparent);
  box-shadow: 0 0 20px rgba(167, 139, 250, 0.5), 0 -20px 60px rgba(167, 139, 250, 0.15);
  animation: scanDown 1.2s ease-in-out forwards;
  z-index: 5;
}

@keyframes scanDown {
  from { top: -3px; }
  to { top: 100%; }
}

// Grid Overlay
.pt-grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(167, 139, 250, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(167, 139, 250, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridAppear 0.8s ease-out 0.3s both;
}

@keyframes gridAppear {
  from { opacity: 0; }
  to { opacity: 1; }
}

// HUD Frame
.pt-hud {
  position: absolute;
  inset: 30px;
  pointer-events: none;
}

.hud-corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border-color: rgba(167, 139, 250, 0.6);
  border-style: solid;
  border-width: 0;
  animation: hudAppear 0.4s ease-out both;
  filter: drop-shadow(0 0 4px rgba(167, 139, 250, 0.4));

  &.tl { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; animation-delay: 0.4s; }
  &.tr { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; animation-delay: 0.45s; }
  &.bl { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; animation-delay: 0.5s; }
  &.br { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; animation-delay: 0.55s; }
}

.hud-line {
  position: absolute;
  background: rgba(167, 139, 250, 0.2);
  animation: hudLine 0.5s ease-out both;

  &.top { top: 0; left: 44px; right: 44px; height: 1px; animation-delay: 0.5s; }
  &.bottom { bottom: 0; left: 44px; right: 44px; height: 1px; animation-delay: 0.55s; }
  &.left { left: 0; top: 44px; bottom: 44px; width: 1px; animation-delay: 0.6s; }
  &.right { right: 0; top: 44px; bottom: 44px; width: 1px; animation-delay: 0.65s; }
}

@keyframes hudAppear {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes hudLine {
  from { opacity: 0; transform: scaleX(0) or scaleY(0); }
  to { opacity: 1; transform: scaleX(1) or scaleY(1); }
}

// Boot Panels
.pt-panels {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.boot-panel {
  position: absolute;
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 6px;
  background: rgba(167, 139, 250, 0.04);
  overflow: hidden;
  opacity: 0;
  animation: panelSlide 0.5s ease-out forwards;
  box-shadow: 0 0 12px rgba(167, 139, 250, 0.08);
}

@keyframes panelSlide {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.panel-scan {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.6), transparent);
  animation: panelScan 0.8s ease-out 0.3s both;
}

@keyframes panelScan {
  from { top: 0; opacity: 1; }
  to { top: 100%; opacity: 0; }
}

.panel-label {
  position: absolute;
  top: 6px;
  left: 8px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(167, 139, 250, 0.7);
  font-family: 'JetBrains Mono', monospace;
}

// Boot Text
.pt-boot-text {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  text-align: center;
  z-index: 6;
}

.boot-line {
  opacity: 0;
  color: rgba(167, 139, 250, 0.8);

  &.l1 { animation: textAppear 0.3s ease-out 0.6s both; }
  &.l2 { animation: textAppear 0.3s ease-out 1.0s both; color: rgba(167, 139, 250, 0.6); }
  &.l3 { animation: textAppear 0.4s ease-out 1.3s both; color: #22c55e; font-weight: 700; font-size: 15px; letter-spacing: 3px; }
}

.boot-cursor {
  animation: cursorBlink 0.5s step-end infinite;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.boot-check {
  color: #22c55e;
  animation: checkAppear 0.3s ease-out 1.2s both;
  margin-left: 6px;
}

@keyframes checkAppear {
  from { opacity: 0; transform: scale(0); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes textAppear {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

// ============================================
// Common Flash Animation
// ============================================
@keyframes ptFlash {
  0% { opacity: 0; }
  30% { opacity: 1; }
  100% { opacity: 0; }
}
</style>

<template>
  <div class="page inventory-page" ref="pageRef">
    <!-- Period Selector -->
    <PeriodSelector v-model="localPeriod" />

    <!-- 2D Mode -->
    <template v-if="viewMode !== '3d'">
      <!-- 库存总览 KPI - 醒目大字体 + 入场动画 -->
      <div class="inv-summary">
        <div
          v-for="(kpi, idx) in summaryKpis"
          :key="kpi.key"
          class="sum-item glow-card"
          :class="[kpi.cls, { 'is-visible': visible }]"
          :style="{ '--delay': idx * 0.1 + 's', '--accent': kpi.accent }"
          @mouseenter="kpiHover = idx"
          @mouseleave="kpiHover = -1"
        >
          <div class="sum-shimmer" />
          <div class="sum-icon-wrap" :class="kpi.iconCls">
            <component :is="kpi.icon" />
          </div>
          <span class="sum-val" :class="kpi.valCls">
            <DigitalFlipper :value="kpi.value" :decimals="kpi.decimals" :size="32" :color="kpi.valColor" />
            <small>{{ kpi.unit }}</small>
          </span>
          <span class="sum-lbl">{{ kpi.label }}</span>
          <div class="sum-glow" :class="kpi.glowCls" />
          <div class="sum-corner tl" /><div class="sum-corner tr" /><div class="sum-corner bl" /><div class="sum-corner br" />
        </div>
      </div>

      <!-- 库存排名 - 重构 -->
      <div class="card neon-card rank-card" :class="{ 'is-visible': visible }" style="--delay: 0.4s">
        <div class="rank-header">
          <div class="rank-header-left">
            <span class="rank-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>
            </span>
            <div class="rank-header-text">
              <span class="rank-title">项目库存排名</span>
              <span class="rank-subtitle">按去化周期排序</span>
            </div>
          </div>
          <div class="rank-legend">
            <span class="legend-item"><i class="legend-dot green" />健康 ≤12月</span>
            <span class="legend-item"><i class="legend-dot yellow" />关注 ≤18月</span>
            <span class="legend-item"><i class="legend-dot red" />高危 &gt;18月</span>
          </div>
        </div>
        <div class="inv-table">
          <div class="it-header">
            <span class="col-rank">排名</span><span class="col-name">项目</span><span class="col-city">区域</span><span class="col-num">总套数</span><span class="col-num">已售</span><span class="col-unsold">未售</span><span class="col-num">货值</span><span class="col-rate">去化率</span><span class="col-cycle">周期</span><span class="col-bar">风险</span><span class="col-status">状态</span>
          </div>
          <div
            v-for="(item, idx) in sortedInventory"
            :key="item.projectName"
            class="it-row"
            :class="[`row-${item.status}`, { 'is-visible': visible }]"
            :style="{ '--row-delay': (0.5 + idx * 0.06) + 's' }"
          >
            <span class="it-rank" :class="{ 'top-3': idx < 3 }">
              <span v-if="idx < 3" class="rank-badge" :class="['rank-' + (idx + 1)]">{{ idx + 1 }}</span>
              <span v-else class="rank-num">{{ idx + 1 }}</span>
            </span>
            <span class="it-name">{{ item.projectName }}</span>
            <span class="it-city">{{ item.city }}</span>
            <span class="it-num">{{ item.totalUnits }}</span>
            <span class="it-num">{{ item.soldUnits }}</span>
            <span class="it-unsold">{{ item.unsoldUnits }}</span>
            <span class="it-num">{{ item.unsoldValue }}亿</span>
            <span class="it-rate">
              <span class="rate-val" :class="item.status">{{ item.depletionRate }}%</span>
              <span class="rate-bar-track"><span class="rate-bar-fill" :class="item.status" :style="{ width: item.depletionRate + '%' }" /></span>
            </span>
            <span class="it-cycle" :class="item.status">
              <span class="cycle-val">{{ item.depletionCycle }}</span><small>月</small>
            </span>
            <span class="it-bar-cell">
              <span class="cycle-bar-track"><span class="cycle-bar-fill" :class="item.status" :style="{ width: Math.min(item.depletionCycle / 30 * 100, 100) + '%' }" /></span>
            </span>
            <span class="it-status" :class="`st-${item.status}`">
              <span class="status-dot" /><span>{{ statusLabel(item.status) }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- 滞销房源 -->
        <div class="card neon-card" :class="{ 'is-visible': visible }" style="--delay: 0.7s">
          <div class="card-title neon-title">
            <span class="nt-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            滞销房源 TOP
          </div>
          <div class="slow-list">
            <div
              v-for="(s, i) in slowItems.slice(0, 10)"
              :key="i"
              class="slow-item"
              :class="[s.daysOnMarket > 300 ? 'danger-row' : 'warn-row', { 'is-visible': visible }]"
              :style="{ '--row-delay': (0.8 + i * 0.05) + 's' }"
            >
              <div class="slow-head">
                <span class="slow-rank">{{ i + 1 }}</span>
                <span class="slow-proj">{{ s.projectName }}</span>
                <span class="slow-days" :class="s.daysOnMarket > 300 ? 'danger' : 'warn'">
                  <span class="days-pulse" />{{ s.daysOnMarket }}天
                </span>
              </div>
              <div class="slow-body">
                <span>{{ s.buildingNo }} {{ s.floor }}</span>
                <span>{{ s.unitType }} {{ s.area }}㎡</span>
                <span class="slow-price">¥{{ s.price }}/㎡</span>
              </div>
              <div class="slow-reason">
                <span class="reason-tag">原因</span> {{ s.reason }}
              </div>
            </div>
          </div>
        </div>

        <!-- 定价建议 -->
        <div class="card neon-card" :class="{ 'is-visible': visible }" style="--delay: 0.8s">
          <div class="card-title neon-title">
            <span class="nt-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </span>
            定价建议
          </div>
          <div class="price-list">
            <div
              v-for="(item, i) in inventory"
              :key="item.projectName"
              class="price-item"
              :class="[item.priceChange <= 0 ? 'price-down' : 'price-up', { 'is-visible': visible }]"
              :style="{ '--row-delay': (0.9 + i * 0.05) + 's' }"
            >
              <span class="price-name">{{ item.projectName }}</span>
              <div class="price-row">
                <span class="price-cur">当前 ¥{{ item.avgPrice }}</span>
                <span class="price-arrow" :class="item.priceChange > 0 ? 'up' : 'down'">
                  <svg v-if="item.priceChange > 0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                </span>
                <span class="price-sug" :class="item.priceChange > 0 ? 'up' : 'down'">建议 ¥{{ item.suggestedPrice }}</span>
                <span class="price-pct" :class="item.priceChange > 0 ? 'up' : 'down'">{{ item.priceChange > 0 ? '+' : '' }}{{ item.priceChange }}%</span>
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
          <div class="card-title neon-title"><span class="nt-icon">📊</span>库存去化3D对比</div>
          <Bar3DChart :data="inventoryBarData" height="100%" />
        </div>
        <div class="td-card">
          <div class="card-title neon-title"><span class="nt-icon">🔬</span>货值×周期3D分析</div>
          <Scatter3DChart :data="inventoryScatterData" x-axis-label="去化周期(月)" y-axis-label="货值(亿)" z-axis-label="去化率(%)" height="100%" />
        </div>
      </div>
      <div class="td-kpi-row">
        <div class="sum-item warn glow-card"><span class="sum-val">{{ totalUnsold }}<small>套</small></span><span class="sum-lbl">未售总套数</span></div>
        <div class="sum-item glow-card"><span class="sum-val blue">{{ totalUnsoldValue.toFixed(1) }}<small>亿</small></span><span class="sum-lbl">未售总货值</span></div>
        <div class="sum-item glow-card"><span class="sum-val cyan">{{ avgCycle.toFixed(1) }}<small>月</small></span><span class="sum-lbl">平均去化周期</span></div>
        <div class="sum-item danger glow-card pulse-card"><span class="sum-val red">{{ slowCount }}</span><span class="sum-lbl">高风险项目</span></div>
      </div>
    </template>

    <!-- AI结论 -->
    <div class="ai-box neon-ai" :class="{ 'is-visible': visible }" style="--delay: 1s">
      <div class="ai-icon-wrap">
        <div class="ai-orb" />
        <span class="ai-label">AI</span>
      </div>
      <div class="ai-content">
        <div class="ai-title">库存诊断</div>
        <div class="ai-text">
          <span v-for="(char, i) in displayedAiText" :key="i" :style="{ '--char-delay': i * 0.02 + 's' }" class="ai-char">{{ char }}</span>
          <span v-if="showCursor" class="ai-cursor">|</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, h } from 'vue'
import { generateInventory, generateSlowMoving, type InventoryItem } from '@/utils/pageMockData'
import Bar3DChart from '@/components/charts/Bar3DChart.vue'
import Scatter3DChart from '@/components/charts/Scatter3DChart.vue'
import PeriodSelector from '@/components/common/PeriodSelector.vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'

const props = withDefaults(defineProps<{ isActive?: boolean; viewMode?: '2d' | '3d'; period?: 'day' | 'week' | 'month' | 'year' }>(), { viewMode: '2d', period: 'month' })

const localPeriod = ref<'day' | 'week' | 'month' | 'year'>(props.period || 'month')
watch(() => props.period, v => { if (v) localPeriod.value = v })

const inventory = ref<InventoryItem[]>(generateInventory())
const slowItems = ref(generateSlowMoving())

const totalUnsold = computed(() => inventory.value.reduce((s, i) => s + i.unsoldUnits, 0))
const totalUnsoldValue = computed(() => inventory.value.reduce((s, i) => s + i.unsoldValue, 0))
const avgCycle = computed(() => inventory.value.reduce((s, i) => s + i.depletionCycle, 0) / inventory.value.length)
const slowCount = computed(() => inventory.value.filter(i => i.status === 'red').length)

// Sort by depletion cycle descending (worst first)
const sortedInventory = computed(() => [...inventory.value].sort((a, b) => b.depletionCycle - a.depletionCycle))

function statusLabel(s: string) {
  const m: Record<string, string> = { green: '健康', yellow: '关注', red: '高危' }
  return m[s] || s
}

// KPI summary data
const summaryKpis = computed(() => [
  {
    key: 'unsold', label: '未售总套数', value: totalUnsold.value, decimals: 0, unit: '套',
    cls: 'warn', valCls: '', valColor: '#F59E0B', accent: '#F59E0B',
    iconCls: 'warn-icon', glowCls: '',
    icon: { render: () => h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('path', { d: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' })]) },
  },
  {
    key: 'value', label: '未售总货值', value: totalUnsoldValue.value, decimals: 1, unit: '亿',
    cls: '', valCls: 'blue', valColor: '#60a5fa', accent: '#60a5fa',
    iconCls: 'blue-icon', glowCls: 'blue-glow',
    icon: { render: () => h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('path', { d: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' })]) },
  },
  {
    key: 'cycle', label: '平均去化周期', value: avgCycle.value, decimals: 1, unit: '月',
    cls: '', valCls: 'cyan', valColor: '#06b6d4', accent: '#06b6d4',
    iconCls: 'cyan-icon', glowCls: 'cyan-glow',
    icon: { render: () => h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('circle', { cx: 12, cy: 12, r: 10 }), h('polyline', { points: '12 6 12 12 16 14' })]) },
  },
  {
    key: 'risk', label: '高风险项目', value: slowCount.value, decimals: 0, unit: '',
    cls: 'danger pulse-card', valCls: 'red', valColor: '#EF4444', accent: '#EF4444',
    iconCls: 'danger-icon', glowCls: 'danger-glow',
    icon: { render: () => h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('path', { d: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' }), h('line', { x1: 12, y1: 9, x2: 12, y2: 13 }), h('line', { x1: 12, y1: 17, x2: 12.01, y2: 17 })]) },
  },
])

const kpiHover = ref(-1)

// Visibility observer for entrance animations
const pageRef = ref<HTMLElement | null>(null)
const visible = ref(false)

onMounted(() => {
  // Trigger entrance animation
  requestAnimationFrame(() => { visible.value = true })
})

// AI typing effect
const aiFullText = '鹿泉区与高新板块库存去化周期超24个月，风险较高。建议：①云华下调定价5-8%以加速去化；②麓湖四季启动特价房+公积金合作；③龙泉湖55号地可考虑打包转让部分库存回收资金。和平路板块项目经营健康，可适度加推新房源。'
const displayedAiText = ref('')
const showCursor = ref(true)
let typingTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  let i = 0
  function typeChar() {
    if (i < aiFullText.length) {
      displayedAiText.value = aiFullText.slice(0, i + 1)
      i++
      typingTimer = setTimeout(typeChar, 25 + Math.random() * 20)
    } else {
      showCursor.value = false
    }
  }
  setTimeout(typeChar, 1200)
})

onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer)
})

const inventoryBarData = computed(() => inventory.value.map(i => ({
  name: i.projectName.slice(0, 4), value: i.unsoldUnits,
  color: i.status === 'red' ? '#ff4757' : i.status === 'yellow' ? '#ffab00' : '#00d68f',
})))

const inventoryScatterData = computed(() => inventory.value.map(i => ({
  name: i.projectName, x: i.depletionCycle, y: i.unsoldValue, z: i.depletionRate,
  size: Math.max(8, i.unsoldUnits / 30), category: i.status === 'red' ? '刚需' : i.status === 'yellow' ? '改善' : '投资',
})))
</script>

<style scoped lang="scss">
// ========== Variables ==========
$bg: #0F1217;
$card-bg: #161B22;
$border: rgba(255,255,255,0.08);
$text-title: #e2e8f0;
$text-body: #cbd5e1;
$text-caption: #64748b;
$primary: #60a5fa;
$success: #22C55E;
$warning: #F59E0B;
$danger: #EF4444;
$cyan: #06b6d4;

// ========== Base ==========
.page {
  height: 100%; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 14px;
  background: $bg; color: $text-body;
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(96,165,250,0.2); border-radius: 4px; }
}

// ========== KPI Summary ==========
.inv-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

.glow-card {
  text-align: center; padding: 22px 16px 18px; border-radius: 16px;
  border: 1px solid $border; background: $card-bg;
  position: relative; cursor: default;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);
  overflow: hidden;

  // Entrance animation
  opacity: 0; transform: translateY(24px) scale(0.96);
  &.is-visible { opacity: 1; transform: translateY(0) scale(1); transition-delay: var(--delay, 0s); }

  &:hover {
    transform: perspective(800px) translateY(-8px) scale(1.04) rotateX(2deg);
    box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 40px color-mix(in srgb, var(--accent, $primary) 12%, transparent);
    z-index: 2;
  }

  &.warn { border-color: rgba($warning, 0.3); }
  &.danger { border-color: rgba($danger, 0.4); }
}

// Shimmer sweep effect on hover
.sum-shimmer {
  position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
  .glow-card:hover & { left: 100%; }
}

// Corner decorations
.sum-corner {
  position: absolute; width: 8px; height: 8px; border-color: var(--accent, $primary); opacity: 0.3;
  &.tl { top: 4px; left: 4px; border-top: 1px solid; border-left: 1px solid; }
  &.tr { top: 4px; right: 4px; border-top: 1px solid; border-right: 1px solid; }
  &.bl { bottom: 4px; left: 4px; border-bottom: 1px solid; border-left: 1px solid; }
  &.br { bottom: 4px; right: 4px; border-bottom: 1px solid; border-right: 1px solid; }
}

.sum-icon-wrap {
  width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 10px; position: relative; z-index: 2;
  &.warn-icon { background: rgba($warning, 0.12); color: $warning; }
  &.blue-icon { background: rgba($primary, 0.12); color: $primary; }
  &.cyan-icon { background: rgba($cyan, 0.12); color: $cyan; }
  &.danger-icon { background: rgba($danger, 0.15); color: $danger; }
}

.sum-val {
  display: flex; align-items: baseline; justify-content: center; gap: 2px;
  position: relative; z-index: 2;
  small { font-size: 14px; opacity: 0.5; font-weight: 600; margin-left: 2px; }
  &.blue { color: $primary; text-shadow: 0 0 24px rgba($primary, 0.35); }
  &.cyan { color: $cyan; text-shadow: 0 0 24px rgba($cyan, 0.35); }
  &.red { color: $danger; text-shadow: 0 0 24px rgba($danger, 0.4); }
}

.sum-lbl {
  display: block; font-size: 11px; color: $text-caption; margin-top: 6px; letter-spacing: 1.5px;
  font-weight: 600; position: relative; z-index: 2; text-transform: uppercase;
}

.sum-glow {
  position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); width: 80%; height: 40px;
  background: radial-gradient(ellipse, rgba($primary, 0.15) 0%, transparent 70%); pointer-events: none;
  &.blue-glow { background: radial-gradient(ellipse, rgba($primary, 0.15) 0%, transparent 70%); }
  &.cyan-glow { background: radial-gradient(ellipse, rgba($cyan, 0.15) 0%, transparent 70%); }
  &.danger-glow { background: radial-gradient(ellipse, rgba($danger, 0.2) 0%, transparent 70%); }
}

.pulse-card { animation: dangerPulse 3s ease-in-out infinite; }
@keyframes dangerPulse {
  0%, 100% { box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 0 rgba($danger, 0); }
  50% { box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba($danger, 0.12); }
}

// ========== Neon Cards ==========
.neon-card {
  padding: 18px; border-radius: 16px; border: 1px solid rgba($primary, 0.1);
  background: $card-bg; position: relative;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  // Entrance animation
  opacity: 0; transform: translateY(30px);
  &.is-visible { opacity: 1; transform: translateY(0); transition-delay: var(--delay, 0s); }

  &:hover {
    border-color: rgba($primary, 0.22);
    box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 50px rgba($primary, 0.05);
  }

  // Animated gradient border on top
  &::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, $primary, rgba($cyan, 0.8), $primary, transparent);
    background-size: 200% 100%;
    animation: borderFlow 4s linear infinite;
    opacity: 0.7;
  }
}

@keyframes borderFlow {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.card-title {
  font-size: 15px; font-weight: 700; color: $text-title; margin-bottom: 16px;
  padding-left: 14px; border-left: 3px solid $primary; letter-spacing: 0.5px;
}
.neon-title {
  display: flex; align-items: center; gap: 8px;
  .nt-icon {
    display: flex; align-items: center; color: $primary; font-size: 16px;
  }
}
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

// ========== Ranking Header (Fixed text obscuring) ==========
.rank-card {
  overflow: visible; // Key fix: prevent title from being clipped
}

.rank-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px; padding-bottom: 14px;
  border-bottom: 1px solid rgba($primary, 0.08);
  flex-wrap: wrap; gap: 10px;
}

.rank-header-left {
  display: flex; align-items: center; gap: 12px;
}

.rank-header-icon {
  width: 40px; height: 40px; border-radius: 12px;
  background: rgba($primary, 0.1); color: $primary;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.rank-header-text {
  display: flex; flex-direction: column; gap: 2px;
}

.rank-title {
  font-size: 18px; font-weight: 800; color: $text-title; letter-spacing: 0.5px;
  background: linear-gradient(135deg, $text-title, $primary);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rank-subtitle {
  font-size: 12px; color: $text-caption; letter-spacing: 1px;
}

.rank-legend {
  display: flex; gap: 14px; align-items: center; flex-wrap: wrap;
}

.legend-item {
  display: flex; align-items: center; gap: 5px; font-size: 11px; color: $text-caption; white-space: nowrap;
}

.legend-dot {
  width: 8px; height: 8px; border-radius: 50%; display: inline-block;
  &.green { background: $success; box-shadow: 0 0 6px rgba($success, 0.4); }
  &.yellow { background: $warning; box-shadow: 0 0 6px rgba($warning, 0.4); }
  &.red { background: $danger; box-shadow: 0 0 6px rgba($danger, 0.4); }
}

// ========== Inventory Table (Refactored) ==========
.inv-table { display: flex; flex-direction: column; gap: 4px; overflow-x: auto; }

.it-header {
  display: grid;
  grid-template-columns: 44px 1.5fr 0.7fr 0.6fr 0.5fr 0.6fr 0.7fr 1fr 0.8fr 1fr 72px;
  font-size: 10px; color: $text-caption; padding: 8px 6px;
  border-bottom: 1px solid rgba($primary, 0.1); gap: 6px;
  font-weight: 700; letter-spacing: 0.5px; min-width: 820px; align-items: center;
  text-transform: uppercase;
}

.it-row {
  display: grid;
  grid-template-columns: 44px 1.5fr 0.7fr 0.6fr 0.5fr 0.6fr 0.7fr 1fr 0.8fr 1fr 72px;
  font-size: 12px; color: $text-body; padding: 10px 6px; gap: 6px;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 8px; border-left: 3px solid transparent;
  min-width: 820px; align-items: center;

  // Entrance animation
  opacity: 0; transform: translateX(-20px);
  &.is-visible { opacity: 1; transform: translateX(0); transition-delay: var(--row-delay, 0s); }

  &:hover {
    background: rgba(255,255,255,0.04);
    transform: translateX(4px) scale(1.005);
    box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  }

  &.row-red { border-left-color: $danger; background: rgba($danger, 0.04); }
  &.row-yellow { border-left-color: $warning; background: rgba($warning, 0.03); }
  &.row-green { border-left-color: $success; }
}

// Rank column
.it-rank { display: flex; align-items: center; justify-content: center; }

.rank-badge {
  width: 24px; height: 24px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; font-family: 'JetBrains Mono', monospace;
  &.rank-1 { background: linear-gradient(135deg, #FFD700, #FFA500); color: #1a1a2e; box-shadow: 0 0 10px rgba(255,215,0,0.3); }
  &.rank-2 { background: linear-gradient(135deg, #C0C0C0, #A0A0A0); color: #1a1a2e; box-shadow: 0 0 10px rgba(192,192,192,0.3); }
  &.rank-3 { background: linear-gradient(135deg, #CD7F32, #A0522D); color: #fff; box-shadow: 0 0 10px rgba(205,127,50,0.3); }
}

.rank-num {
  font-size: 12px; color: $text-caption; font-weight: 600; font-family: 'JetBrains Mono', monospace;
}

.it-name { color: $text-title; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; min-width: 0; }
.it-city { color: $text-caption; white-space: nowrap; font-size: 11px; }
.it-num { font-family: 'JetBrains Mono', monospace; white-space: nowrap; font-size: 12px; }
.it-unsold { color: $warning; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 13px; }

// Rate with mini bar
.it-rate {
  display: flex; flex-direction: column; gap: 3px; min-width: 0;
}
.rate-val {
  font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; white-space: nowrap;
  &.green { color: $success; }
  &.yellow { color: $warning; }
  &.red { color: $danger; }
}
.rate-bar-track {
  height: 3px; border-radius: 2px; background: rgba(255,255,255,0.06); overflow: hidden;
}
.rate-bar-fill {
  height: 100%; border-radius: 2px;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
  &.green { background: linear-gradient(90deg, $success, rgba($success, 0.5)); }
  &.yellow { background: linear-gradient(90deg, $warning, rgba($warning, 0.5)); }
  &.red { background: linear-gradient(90deg, $danger, rgba($danger, 0.5)); }
}

.it-cycle {
  font-family: 'JetBrains Mono', monospace; font-weight: 700; white-space: nowrap;
  display: flex; align-items: baseline; gap: 1px;
  .cycle-val { font-size: 14px; }
  small { font-size: 10px; opacity: 0.6; }
  &.green { color: $success; }
  &.yellow { color: $warning; }
  &.yellow .cycle-val { animation: warnCyclePulse 2.5s ease-in-out infinite; }
  &.red { color: $danger; }
  &.red .cycle-val { animation: dangerCyclePulse 2s ease-in-out infinite; }
}

@keyframes warnCyclePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
@keyframes dangerCyclePulse {
  0%, 100% { opacity: 1; text-shadow: 0 0 8px rgba($danger, 0.3); }
  50% { opacity: 0.8; text-shadow: 0 0 16px rgba($danger, 0.6); }
}

// Cycle bar visualization
.it-bar-cell { display: flex; align-items: center; min-width: 0; }
.cycle-bar-track {
  width: 100%; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.06); overflow: hidden;
}
.cycle-bar-fill {
  height: 100%; border-radius: 3px;
  transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  &.green { background: linear-gradient(90deg, $success, rgba($success, 0.6)); box-shadow: 0 0 8px rgba($success, 0.2); }
  &.yellow { background: linear-gradient(90deg, $warning, rgba($warning, 0.6)); box-shadow: 0 0 8px rgba($warning, 0.2); }
  &.red { background: linear-gradient(90deg, $danger, rgba($danger, 0.6)); box-shadow: 0 0 8px rgba($danger, 0.2); animation: barPulseRed 2s ease-in-out infinite; }
}

@keyframes barPulseRed {
  0%, 100% { box-shadow: 0 0 8px rgba($danger, 0.2); }
  50% { box-shadow: 0 0 16px rgba($danger, 0.4); }
}

.it-status {
  font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 6px;
  text-align: center; letter-spacing: 0.5px; white-space: nowrap;
  display: flex; align-items: center; justify-content: center; gap: 4px;
  &.st-green { background: rgba($success, 0.12); color: $success; }
  &.st-yellow { background: rgba($warning, 0.12); color: $warning; }
  &.st-red { background: rgba($danger, 0.12); color: $danger; animation: statusPulse 2s ease-in-out infinite; }
}

.status-dot {
  width: 5px; height: 5px; border-radius: 50%;
  .st-green & { background: $success; box-shadow: 0 0 6px rgba($success, 0.5); }
  .st-yellow & { background: $warning; box-shadow: 0 0 6px rgba($warning, 0.5); }
  .st-red & { background: $danger; box-shadow: 0 0 6px rgba($danger, 0.5); animation: dotPulse 1.5s ease-in-out infinite; }
}

@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 4px rgba($danger, 0.4); }
  50% { box-shadow: 0 0 10px rgba($danger, 0.8); }
}

@keyframes statusPulse {
  0%, 100% { box-shadow: 0 0 6px rgba($danger, 0.08); }
  50% { box-shadow: 0 0 16px rgba($danger, 0.2); }
}

// ========== Slow Items ==========
.slow-list { display: flex; flex-direction: column; gap: 6px; }
.slow-item {
  padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.02);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  border-left: 3px solid $warning; position: relative; overflow: hidden;

  // Entrance
  opacity: 0; transform: translateY(12px);
  &.is-visible { opacity: 1; transform: translateY(0); transition-delay: var(--row-delay, 0s); }

  &:hover { background: rgba(255,255,255,0.05); transform: translateX(4px) scale(1.01); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
  &.danger-row { border-left-color: $danger; background: rgba($danger, 0.03); }
  &.warn-row { border-left-color: $warning; }
}

.slow-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; gap: 8px; }
.slow-rank {
  width: 22px; height: 22px; border-radius: 6px; background: rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: center; font-size: 11px;
  font-weight: 700; color: $text-caption; flex-shrink: 0; font-family: 'JetBrains Mono', monospace;
}
.slow-proj { font-size: 13px; color: $text-title; font-weight: 700; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.slow-days {
  font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800;
  display: flex; align-items: center; gap: 4px; flex-shrink: 0;
  &.danger { color: $danger; text-shadow: 0 0 12px rgba($danger, 0.3); }
  &.warn { color: $warning; text-shadow: 0 0 12px rgba($warning, 0.3); }
}

.days-pulse {
  width: 6px; height: 6px; border-radius: 50%;
  .danger & { background: $danger; animation: dotPulse 1.5s ease-in-out infinite; }
  .warn & { background: $warning; animation: warnCyclePulse 2.5s ease-in-out infinite; }
}

.slow-body { font-size: 12px; color: $text-caption; display: flex; gap: 12px; padding-left: 30px; }
.slow-price { color: $primary; font-weight: 600; }
.slow-reason {
  font-size: 11px; color: $text-caption; margin-top: 4px; padding-left: 30px;
  display: flex; align-items: center; gap: 6px;
}
.reason-tag {
  font-size: 9px; padding: 1px 6px; border-radius: 3px; background: rgba($danger, 0.1);
  color: $danger; font-weight: 700; letter-spacing: 0.3px; flex-shrink: 0;
}

// ========== Price Suggestions ==========
.price-list { display: flex; flex-direction: column; gap: 6px; }
.price-item {
  padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.02);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  border-left: 3px solid transparent; position: relative; overflow: hidden;

  // Entrance
  opacity: 0; transform: translateY(12px);
  &.is-visible { opacity: 1; transform: translateY(0); transition-delay: var(--row-delay, 0s); }

  &:hover { background: rgba(255,255,255,0.05); transform: translateX(3px); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
  &.price-down { border-left-color: $danger; background: rgba($danger, 0.03); }
  &.price-up { border-left-color: $success; background: rgba($success, 0.03); }
}
.price-name { font-size: 14px; color: $text-title; font-weight: 700; display: block; margin-bottom: 8px; }
.price-row { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; flex-wrap: wrap; }
.price-cur { color: $text-caption; }
.price-arrow {
  display: flex; align-items: center;
  &.up { color: $success; } &.down { color: $danger; }
  animation: arrowBounce 2s ease-in-out infinite;
}
@keyframes arrowBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
.price-sug {
  font-weight: 700; font-size: 14px;
  &.up { color: $success; text-shadow: 0 0 10px rgba($success, 0.3); }
  &.down { color: $danger; text-shadow: 0 0 10px rgba($danger, 0.3); }
}
.price-pct {
  font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px;
  padding: 3px 10px; border-radius: 6px; margin-left: auto;
  &.up { background: rgba($success, 0.12); color: $success; }
  &.down { background: rgba($danger, 0.12); color: $danger; }
}

// ========== AI Box ==========
.neon-ai {
  display: flex; gap: 14px; padding: 18px; border-radius: 16px;
  border: 1px solid rgba($primary, 0.15);
  background: linear-gradient(135deg, rgba($primary, 0.06), rgba(99,102,241,0.03));
  box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba($primary, 0.04);
  position: relative;

  // Entrance
  opacity: 0; transform: translateY(20px);
  &.is-visible { opacity: 1; transform: translateY(0); transition-delay: var(--delay, 0s); }

  // Animated border
  &::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, $primary, rgba($cyan, 0.8), $primary, transparent);
    background-size: 200% 100%;
    animation: borderFlow 4s linear infinite;
    opacity: 0.5;
  }

  // Scan line effect
  &::after {
    content: ''; position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba($primary, 0.15), transparent);
    animation: scanLine 4s ease-in-out infinite;
    pointer-events: none;
  }
}

@keyframes scanLine {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.ai-icon-wrap {
  width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
  background: rgba($primary, 0.1); position: relative;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}

.ai-orb {
  position: absolute; inset: 4px; border-radius: 10px;
  background: radial-gradient(circle at 30% 30%, rgba($primary, 0.3), transparent);
  animation: orbRotate 3s linear infinite;
}

@keyframes orbRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.ai-label {
  position: relative; z-index: 2; font-size: 13px; font-weight: 800; color: $primary;
  letter-spacing: 1px;
}

.ai-content { flex: 1; min-width: 0; }
.ai-title { font-size: 14px; font-weight: 700; color: $primary; margin-bottom: 8px; letter-spacing: 0.5px; }

.ai-text {
  font-size: 13px; color: $text-body; line-height: 1.9;
  display: flex; flex-wrap: wrap;
}

.ai-char {
  opacity: 0; animation: charFadeIn 0.3s ease forwards;
  animation-delay: var(--char-delay, 0s);
}

@keyframes charFadeIn {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}

.ai-cursor {
  color: $primary; font-weight: 300; animation: cursorBlink 0.8s step-end infinite;
}

@keyframes cursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

// ========== 3D Mode ==========
.three-d-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; flex: 1; min-height: 0; }
.td-card {
  padding: 10px; border-radius: 14px; border: 1px solid rgba($primary, 0.12);
  background: $card-bg; min-height: 220px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.td-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; flex-shrink: 0; }

// ========== Responsive ==========
@media (max-width: 768px) {
  .inv-summary { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .td-kpi-row { grid-template-columns: repeat(2, 1fr); }
  .three-d-grid { grid-template-columns: 1fr; }
  .rank-header { flex-direction: column; align-items: flex-start; }
  .rank-legend { gap: 8px; }
}
</style>

<template>
  <div class="boss-kpi">
    <div class="boss-kpi-header">
      <span class="header-icon">◉</span>
      <span class="header-title">核心经营指标</span>
    </div>
    <div class="boss-kpi-grid">
      <div
        v-for="item in indicators"
        :key="item.label"
        class="indicator"
        :class="item.level"
      >
        <div class="ind-top">
          <span class="ind-label">{{ item.label }}</span>
          <span v-if="item.trend !== 0" class="ind-trend" :class="item.trend > 0 ? 'up' : 'down'">
            {{ item.trend > 0 ? '▲' : '▼' }}{{ Math.abs(item.trend).toFixed(1) }}%
          </span>
        </div>
        <div class="ind-value-row">
          <DigitalFlipper :value="item.value" :decimals="item.decimals" :size="item.hero ? 26 : 20" :color="item.color" />
          <span class="ind-suffix" :style="{ color: item.color }">{{ item.suffix }}</span>
        </div>
        <div v-if="item.bar !== undefined" class="ind-bar-track">
          <div class="ind-bar-fill" :style="{ width: Math.min(item.bar, 100) + '%', background: item.color }" />
        </div>
        <div v-if="item.sub" class="ind-sub">{{ item.sub }}</div>
      </div>
    </div>
    <div class="boss-kpi-verdict" :class="verdict.level">
      <span class="verdict-icon">{{ verdict.icon }}</span>
      <span class="verdict-text">{{ verdict.text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'

const props = defineProps<{
  depletionRate: number
  totalSales: number
  returnAmount: number
  returnRate: number
  inventoryUnits: number
  inventoryValue: number
  todayDeals: number
  monthDeals: number
  momGrowth: number
}>()

// Strict color system
const CG = '#22C55E'
const CA = '#F59E0B'
const CR = '#EF4444'
const CB = '#60a5fa'
const CN = '#94a3b8'
const CP = '#8b5cf6'

const indicators = computed(() => [
  {
    label: '去化率',
    value: props.depletionRate,
    decimals: 1,
    suffix: '%',
    color: props.depletionRate >= 70 ? CG : props.depletionRate >= 50 ? CA : CR,
    bar: props.depletionRate,
    trend: props.momGrowth,
    level: props.depletionRate >= 70 ? 'good' : props.depletionRate >= 50 ? 'warn' : 'danger',
    hero: true,
  },
  {
    label: '累计销售额',
    value: props.totalSales,
    decimals: 1,
    suffix: '亿',
    color: CB,
    trend: props.momGrowth,
    level: 'normal',
  },
  {
    label: '回款率',
    value: props.returnRate,
    decimals: 1,
    suffix: '%',
    color: props.returnRate >= 75 ? CG : props.returnRate >= 60 ? CA : CR,
    bar: props.returnRate,
    sub: `回款 ${props.returnAmount.toFixed(1)}亿`,
    level: props.returnRate >= 75 ? 'good' : props.returnRate >= 60 ? 'warn' : 'danger',
  },
  {
    label: '库存套数',
    value: props.inventoryUnits,
    decimals: 0,
    suffix: '套',
    color: props.inventoryUnits > 3500 ? CR : props.inventoryUnits > 3000 ? CA : CG,
    sub: `货值 ${props.inventoryValue}亿`,
    level: props.inventoryUnits > 3500 ? 'danger' : props.inventoryUnits > 3000 ? 'warn' : 'good',
  },
  {
    label: '本月成交',
    value: props.monthDeals,
    decimals: 0,
    suffix: '套',
    color: CP,
    sub: `今日 ${props.todayDeals} 套`,
    level: 'normal',
  },
  {
    label: '环比增长',
    value: props.momGrowth,
    decimals: 1,
    suffix: '%',
    color: props.momGrowth >= 0 ? CG : CR,
    trend: props.momGrowth,
    level: props.momGrowth >= 5 ? 'good' : props.momGrowth >= 0 ? 'normal' : 'danger',
  },
])

const verdict = computed(() => {
  const { depletionRate, returnRate, momGrowth, inventoryUnits } = props
  const score = (depletionRate >= 70 ? 1 : 0) + (returnRate >= 75 ? 1 : 0) + (momGrowth >= 0 ? 1 : 0) + (inventoryUnits <= 3000 ? 1 : 0)
  if (score >= 3) return { level: 'good', icon: '●', text: '经营健康' }
  if (score >= 2) return { level: 'warn', icon: '◐', text: '需关注' }
  return { level: 'danger', icon: '◉', text: '需干预' }
})
</script>

<style scoped lang="scss">
$c-green: #22C55E;
$c-green-dim: rgba(34, 197, 94, 0.15);
$c-amber: #F59E0B;
$c-amber-dim: rgba(245, 158, 11, 0.15);
$c-red: #EF4444;
$c-red-dim: rgba(239, 68, 68, 0.15);
$c-neutral: #94a3b8;
$c-text: #e2e8f0;
$c-text-dim: #64748b;
$c-surface: rgba(255, 255, 255, 0.03);
$c-surface-hover: rgba(255, 255, 255, 0.06);
$c-bar-track: rgba(255, 255, 255, 0.05);

.boss-kpi {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  overflow: hidden;
}

.boss-kpi-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.header-icon {
  font-size: 12px;
  color: #60a5fa;
}

.header-title {
  font-size: 12px;
  font-weight: 600;
  color: $c-text;
  letter-spacing: 0.5px;
}

.boss-kpi-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  min-height: 0;
  overflow-y: auto;
}

.indicator {
  padding: 8px 10px;
  border-radius: 6px;
  background: $c-surface;
  border-left: 2px solid transparent;
  transition: all 0.2s;

  &.good { border-left-color: $c-green; }
  &.warn { border-left-color: $c-amber; }
  &.danger { border-left-color: $c-red; }
  &.normal { border-left-color: $c-neutral; }

  &:hover { background: $c-surface-hover; }
}

.ind-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
}

.ind-label {
  font-size: 10px;
  color: $c-text-dim;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.ind-trend {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 3px;

  &.up { color: $c-green; background: $c-green-dim; }
  &.down { color: $c-red; background: $c-red-dim; }
}

.ind-value-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.ind-suffix {
  font-size: 10px;
  font-weight: 500;
  opacity: 0.6;
}

.ind-bar-track {
  height: 2px;
  background: $c-bar-track;
  border-radius: 1px;
  margin-top: 4px;
  overflow: hidden;
}

.ind-bar-fill {
  height: 100%;
  border-radius: 1px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.ind-sub {
  font-size: 9px;
  color: $c-text-dim;
  margin-top: 2px;
}

.boss-kpi-verdict {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 4px;
  margin-top: 8px;
  flex-shrink: 0;

  &.good { background: $c-green-dim; color: $c-green; }
  &.warn { background: $c-amber-dim; color: $c-amber; }
  &.danger { background: $c-red-dim; color: $c-red; }
}

.verdict-icon { font-size: 10px; }

.verdict-text {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>

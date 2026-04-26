<template>
  <div class="page channel-page">
    <!-- Hero KPI Band -->
    <div class="hero-band">
      <div v-for="(kpi, i) in heroKPIs" :key="kpi.label" class="hero-kpi" :class="kpi.level"
        :style="{ animationDelay: i * 80 + 'ms' }">
        <div class="hero-kpi-glow" />
        <div class="hero-kpi-icon">{{ kpi.icon }}</div>
        <div class="hero-kpi-body">
          <span class="hero-kpi-label">{{ kpi.label }}</span>
          <div class="hero-kpi-value-row">
            <DigitalFlipper :value="kpi.value" :decimals="kpi.decimals" :size="kpi.hero ? 28 : 22"
              :color="kpi.color" />
            <span class="hero-kpi-suffix" :style="{ color: kpi.color }">{{ kpi.suffix }}</span>
            <span v-if="kpi.trend != null" class="hero-kpi-trend" :class="kpi.trend > 0 ? 'up' : 'down'">
              {{ kpi.trend > 0 ? '▲' : '▼' }}{{ Math.abs(kpi.trend).toFixed(1) }}%
            </span>
          </div>
          <div v-if="kpi.bar !== undefined" class="hero-kpi-bar-track">
            <div class="hero-kpi-bar-fill" :style="{ width: Math.min(kpi.bar, 100) + '%', background: kpi.color }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Strip -->
    <div v-if="alertChannels.length" class="alert-strip" :class="{ 'alert-pulse': alertChannels.length >= 2 }">
      <div class="alert-icon-wrap">
        <span class="alert-icon">⚠</span>
      </div>
      <div class="alert-body">
        <span class="alert-title">渠道预警</span>
        <div class="alert-items">
          <span v-for="ch in alertChannels" :key="ch.name" class="alert-tag" :style="{ '--tag-color': ch.color }">
            {{ ch.name }}：{{ ch.alertReason }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="main-grid">
      <!-- Left: Channel Ranking with Animated Bars -->
      <div class="card channel-ranking-card">
        <div class="card-header">
          <span class="card-header-dot" />
          <span class="card-title">渠道销售贡献</span>
          <span class="card-badge">{{ channels.length }} 渠道</span>
        </div>
        <div class="ranking-list">
          <div v-for="(ch, i) in sortedChannels" :key="ch.name" class="rank-row"
            :style="{ animationDelay: i * 60 + 'ms' }" :class="{ 'rank-warning': ch.conversionRate < 10 }">
            <div class="rank-no" :class="{ top: i < 3 }">{{ i + 1 }}</div>
            <div class="rank-info">
              <div class="rank-top-row">
                <span class="rank-name">{{ ch.name }}</span>
                <span class="rank-type-badge" :class="`type-${ch.type}`">{{ ch.type }}</span>
                <span class="rank-value" :style="{ color: ch.color }">{{ ch.salesAmount }}亿</span>
              </div>
              <div class="rank-bar-row">
                <div class="rank-bar-track">
                  <div class="rank-bar-fill" :style="{ width: (ch.salesAmount / maxSales * 100) + '%', background: `linear-gradient(90deg, ${ch.color}88, ${ch.color})` }">
                    <div class="rank-bar-shimmer" />
                  </div>
                </div>
              </div>
              <div class="rank-meta-row">
                <span>成交 <b>{{ ch.dealCount }}</b> 套</span>
                <span>转化 <b :style="{ color: ch.conversionRate < 10 ? '#EF4444' : '#22C55E' }">{{ ch.conversionRate }}%</b></span>
                <span>ROI <b>{{ ch.roi }}</b></span>
                <span>获客 <b class="cost-highlight">{{ ch.costPerCustomer }}元</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Top: Channel Capability Radar -->
      <div class="card radar-card">
        <div class="card-header">
          <span class="card-header-dot green" />
          <span class="card-title">渠道综合能力</span>
        </div>
        <div class="radar-chart-area">
          <ChartWrapper :option="radarOption" height="100%" />
        </div>
      </div>

      <!-- Right Bottom: Conversion × ROI Matrix -->
      <div class="card matrix-card">
        <div class="card-header">
          <span class="card-header-dot purple" />
          <span class="card-title">转化率 × ROI 矩阵</span>
        </div>
        <div class="matrix-area">
          <ChartWrapper :option="matrixOption" height="100%" />
        </div>
      </div>
    </div>

    <!-- Cost & Trend Row -->
    <div class="cost-row-grid">
      <div class="card cost-card">
        <div class="card-header">
          <span class="card-header-dot amber" />
          <span class="card-title">获客成本 vs 趋势</span>
        </div>
        <div class="cost-table">
          <div class="cost-header-row">
            <span>渠道</span><span>获客成本</span><span>成交数</span><span>环比趋势</span>
          </div>
          <div v-for="ch in channels" :key="ch.name" class="cost-data-row"
            :class="{ 'cost-danger': ch.costPerCustomer > 2000 }">
            <span class="cost-name">{{ ch.name }}</span>
            <span class="cost-cpc">{{ ch.costPerCustomer }}元</span>
            <span>{{ ch.dealCount }}套</span>
            <span class="cost-trend" :class="ch.trend > 0 ? 'up' : 'down'">
              {{ ch.trend > 0 ? '▲' : '▼' }}{{ Math.abs(ch.trend) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- AI Insight Panel -->
      <div class="ai-insight-card" :class="aiLevel">
        <div class="ai-insight-glow" />
        <div class="ai-insight-header">
          <div class="ai-avatar">
            <span>AI</span>
          </div>
          <div class="ai-header-text">
            <span class="ai-title">渠道智能诊断</span>
            <span class="ai-subtitle">{{ aiLevel === 'danger' ? '发现严重问题' : aiLevel === 'warn' ? '需要关注' : '整体良好' }}</span>
          </div>
          <div class="ai-severity-badge" :class="aiLevel">
            {{ aiLevel === 'danger' ? '高风险' : aiLevel === 'warn' ? '中风险' : '低风险' }}
          </div>
        </div>
        <div class="ai-insight-body">
          <div v-for="(insight, i) in aiInsights" :key="i" class="ai-insight-item" :class="insight.level">
            <span class="insight-dot" />
            <span class="insight-text">{{ insight.text }}</span>
          </div>
        </div>
        <div class="ai-insight-action">
          <span class="action-label">建议操作</span>
          <span class="action-text">{{ aiAction }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { generateChannels, type ChannelItem } from '@/utils/pageMockData'
import ChartWrapper from '@/components/common/ChartWrapper.vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'
import PeriodSelector from '@/components/common/PeriodSelector.vue'

const props = withDefaults(defineProps<{
  isActive?: boolean
  viewMode?: '2d' | '3d'
  period?: 'day' | 'week' | 'month' | 'year'
}>(), {
  viewMode: '2d',
  period: 'month',
})

const localPeriod = ref<'day' | 'week' | 'month' | 'year'>(props.period || 'month')
watch(() => props.period, v => { if (v) localPeriod.value = v })

const channels = ref<ChannelItem[]>(generateChannels())

const totalSales = computed(() => channels.value.reduce((s, c) => s + c.salesAmount, 0))
const totalDeals = computed(() => channels.value.reduce((s, c) => s + c.dealCount, 0))
const avgConversion = computed(() => channels.value.reduce((s, c) => s + c.conversionRate, 0) / channels.value.length)
const avgROI = computed(() => channels.value.reduce((s, c) => s + c.roi, 0) / channels.value.length)
const maxSales = computed(() => Math.max(...channels.value.map(c => c.salesAmount)))
const maxROI = computed(() => Math.max(...channels.value.map(c => c.roi)))

const sortedChannels = computed(() => [...channels.value].sort((a, b) => b.salesAmount - a.salesAmount))

const alertChannels = computed(() => {
  const alerts: { name: string; color: string; alertReason: string }[] = []
  channels.value.forEach(ch => {
    if (ch.conversionRate < 10) alerts.push({ name: ch.name, color: '#EF4444', alertReason: `转化率仅${ch.conversionRate}%` })
    else if (ch.costPerCustomer > 2000) alerts.push({ name: ch.name, color: '#F59E0B', alertReason: `获客成本${ch.costPerCustomer}元偏高` })
    else if (ch.roi < 1.5) alerts.push({ name: ch.name, color: '#F59E0B', alertReason: `ROI仅${ch.roi}偏低` })
  })
  return alerts
})

const heroKPIs = computed(() => [
  {
    label: '渠道总销售额', value: totalSales.value, decimals: 1, suffix: '亿',
    color: '#60a5fa', icon: '💰', bar: undefined, trend: undefined,
    level: 'normal', hero: true,
  },
  {
    label: '渠道总成交', value: totalDeals.value, decimals: 0, suffix: '套',
    color: '#22C55E', icon: '🏠', bar: undefined, trend: undefined,
    level: 'normal', hero: false,
  },
  {
    label: '平均转化率', value: avgConversion.value, decimals: 1, suffix: '%',
    color: avgConversion.value < 12 ? '#EF4444' : '#22C55E', icon: '📊',
    bar: avgConversion.value, trend: undefined,
    level: avgConversion.value < 12 ? 'danger' : 'good', hero: false,
  },
  {
    label: '平均ROI', value: avgROI.value, decimals: 1, suffix: '',
    color: avgROI.value < 2 ? '#F59E0B' : '#8b5cf6', icon: '📈',
    bar: undefined, trend: undefined,
    level: avgROI.value < 2 ? 'warn' : 'normal', hero: false,
  },
])

const aiLevel = computed(() => {
  const dangerCount = alertChannels.value.filter(a => a.color === '#EF4444').length
  if (dangerCount >= 2) return 'danger'
  if (alertChannels.value.length >= 2) return 'warn'
  return 'good'
})

const aiInsights = computed(() => {
  const insights: { text: string; level: string }[] = []
  const selfChannel = channels.value.find(c => c.type === '自建')
  if (selfChannel && selfChannel.conversionRate > 15) {
    insights.push({ text: `自渠转化率${selfChannel.conversionRate}%领先，但获客量仅占${(selfChannel.dealCount / totalDeals.value * 100).toFixed(0)}%，建议加大线上引流至自渠`, level: 'warn' })
  }
  const onlineChannels = channels.value.filter(c => c.type === '线上')
  onlineChannels.forEach(ch => {
    if (ch.conversionRate < 10) {
      insights.push({ text: `${ch.name}转化率仅${ch.conversionRate}%，获客成本${ch.costPerCustomer}元，需优化内容策略降低流失`, level: 'danger' })
    }
  })
  const agencyChannels = channels.value.filter(c => c.type === '中介')
  agencyChannels.forEach(ch => {
    if (ch.roi > 2) {
      insights.push({ text: `${ch.name} ROI ${ch.roi}稳健，可适度增加佣金比例扩大成交`, level: 'good' })
    }
  })
  if (insights.length === 0) {
    insights.push({ text: '各渠道整体运营平稳，建议持续监测转化率波动', level: 'good' })
  }
  return insights
})

const aiAction = computed(() => {
  if (aiLevel.value === 'danger') return '立即优化低转化渠道内容，加大自渠线上投放，降低整体获客成本'
  if (aiLevel.value === 'warn') return '关注线上渠道转化率，调整投放策略，增加高ROI渠道预算'
  return '维持当前渠道配比，持续优化自渠转化能力'
})

const radarOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 18, 23, 0.95)',
    borderColor: 'rgba(96, 165, 250, 0.15)',
    textStyle: { color: '#e2e8f0', fontSize: 11 },
  },
  legend: {
    data: channels.value.slice(0, 4).map(c => c.name),
    bottom: 4,
    textStyle: { color: '#64748b', fontSize: 9 },
    itemWidth: 10,
    itemHeight: 6,
  },
  radar: {
    indicator: [
      { name: '销售额', max: 100 },
      { name: '转化率', max: 100 },
      { name: 'ROI', max: 100 },
      { name: '成交数', max: 100 },
      { name: '成本控制', max: 100 },
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
    data: channels.value.slice(0, 4).map(c => ({
      name: c.name,
      value: [
        (c.salesAmount / maxSales.value * 100).toFixed(0),
        c.conversionRate * 4,
        (c.roi / maxROI.value * 100).toFixed(0),
        (c.dealCount / Math.max(...channels.value.map(x => x.dealCount)) * 100).toFixed(0),
        Math.max(0, 100 - c.costPerCustomer / 10),
      ],
      lineStyle: { color: c.color, width: 1.5 },
      areaStyle: { color: c.color, opacity: 0.1 },
      itemStyle: { color: c.color },
    })),
  }],
}))

const matrixOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 18, 23, 0.95)',
    borderColor: 'rgba(96, 165, 250, 0.15)',
    textStyle: { color: '#e2e8f0', fontSize: 11 },
    formatter: (p: any) => {
      const ch = channels.value[p.dataIndex]
      return `<b>${ch.name}</b><br/>转化率: ${ch.conversionRate}%<br/>ROI: ${ch.roi}<br/>获客成本: ${ch.costPerCustomer}元`
    },
  },
  grid: { left: '12%', right: '8%', top: '12%', bottom: '15%' },
  xAxis: {
    name: '转化率%',
    nameTextStyle: { color: '#64748b', fontSize: 9 },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    axisLabel: { color: '#64748b', fontSize: 9 },
  },
  yAxis: {
    name: 'ROI',
    nameTextStyle: { color: '#64748b', fontSize: 9 },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    axisLabel: { color: '#64748b', fontSize: 9 },
  },
  series: [{
    type: 'effectScatter',
    rippleEffect: { brushType: 'stroke', scale: 3, period: 4 },
    showEffectOn: 'render',
    symbolSize: (val: number[]) => Math.max(val[2] / 50, 10),
    data: channels.value.map(c => ({
      name: c.name,
      value: [c.conversionRate, c.roi, c.costPerCustomer],
      itemStyle: {
        color: c.color,
        shadowBlur: 10,
        shadowColor: c.color + '80',
      },
    })),
    label: {
      show: true,
      formatter: '{b}',
      position: 'right',
      color: '#94a3b8',
      fontSize: 9,
    },
  }],
}))
</script>

<style scoped lang="scss">
$page-bg: #0F1217;
$card-bg: #161B22;
$border: rgba(255, 255, 255, 0.06);
$text-body: #cbd5e1;
$text-title: #e2e8f0;
$text-caption: #64748b;
$primary: #60a5fa;
$success: #22C55E;
$warning: #F59E0B;
$danger: #EF4444;
$purple: #8b5cf6;

.page {
  height: 100%;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: $page-bg;
  color: $text-body;
}

/* ===== Hero KPI Band ===== */
.hero-band {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.hero-kpi {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 12px;
  border-radius: 10px;
  border: 1px solid $border;
  background: $card-bg;
  overflow: hidden;
  animation: slideUp 0.5s ease-out both;

  &.good { border-top: 2px solid $success; }
  &.warn { border-top: 2px solid $warning; }
  &.danger { border-top: 2px solid $danger; }
  &.normal { border-top: 2px solid $primary; }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    .hero-kpi-glow { opacity: 1; }
  }
}

.hero-kpi-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0;
  transition: opacity 0.3s;

  .good & { background: linear-gradient(90deg, transparent, $success, transparent); }
  .warn & { background: linear-gradient(90deg, transparent, $warning, transparent); }
  .danger & { background: linear-gradient(90deg, transparent, $danger, transparent); }
  .normal & { background: linear-gradient(90deg, transparent, $primary, transparent); }
}

.hero-kpi-icon { font-size: 22px; flex-shrink: 0; }

.hero-kpi-body { flex: 1; min-width: 0; }
.hero-kpi-label { display: block; font-size: 10px; color: $text-caption; letter-spacing: 0.3px; margin-bottom: 2px; }
.hero-kpi-value-row { display: flex; align-items: baseline; gap: 3px; }
.hero-kpi-suffix { font-size: 11px; font-weight: 500; opacity: 0.7; }
.hero-kpi-trend {
  font-size: 9px; font-weight: 700; margin-left: 6px; padding: 1px 5px; border-radius: 3px;
  &.up { color: $success; background: rgba(34, 197, 94, 0.15); }
  &.down { color: $danger; background: rgba(239, 68, 68, 0.15); }
}
.hero-kpi-bar-track { height: 3px; background: rgba(255, 255, 255, 0.05); border-radius: 2px; margin-top: 6px; overflow: hidden; }
.hero-kpi-bar-fill { height: 100%; border-radius: 2px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }

/* ===== Alert Strip ===== */
.alert-strip {
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.06);
  animation: slideUp 0.5s ease-out 0.2s both;

  &.alert-pulse { animation: slideUp 0.5s ease-out 0.2s both, pulseBorder 2s ease-in-out infinite; }
}

.alert-icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon { font-size: 14px; }
.alert-body { flex: 1; }
.alert-title { font-size: 12px; font-weight: 700; color: $danger; display: block; margin-bottom: 4px; }
.alert-items { display: flex; flex-wrap: wrap; gap: 6px; }
.alert-tag {
  font-size: 10px;
  color: var(--tag-color, $warning);
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.12);
}

/* ===== Main Grid ===== */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 10px;
}

.card {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid $border;
  background: $card-bg;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  &:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3); }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.card-header-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $primary;
  &.green { background: $success; }
  &.purple { background: $purple; }
  &.amber { background: $warning; }
}

.card-title { font-size: 13px; font-weight: 600; color: $text-title; }
.card-badge { font-size: 9px; color: $text-caption; background: rgba(96, 165, 250, 0.08); padding: 2px 6px; border-radius: 3px; margin-left: auto; }

/* ===== Channel Ranking ===== */
.channel-ranking-card { grid-row: span 2; }
.ranking-list { display: flex; flex-direction: column; gap: 6px; }
.rank-row {
  display: flex;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid transparent;
  transition: all 0.25s;
  animation: slideIn 0.4s ease-out both;

  &:hover { background: rgba(255, 255, 255, 0.04); border-color: rgba(96, 165, 250, 0.1); }
  &.rank-warning { border-left: 3px solid $danger; background: rgba(239, 68, 68, 0.04); }
}

.rank-no {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: $text-caption;
  background: rgba(255, 255, 255, 0.04);
  flex-shrink: 0;

  &.top { color: #fff; background: linear-gradient(135deg, $primary, $purple); }
}

.rank-info { flex: 1; min-width: 0; }
.rank-top-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.rank-name { font-size: 12px; font-weight: 600; color: $text-title; }
.rank-type-badge {
  font-size: 8px; font-weight: 700; padding: 1px 5px; border-radius: 3px; letter-spacing: 0.3px;
  &.type-自建 { background: rgba(96, 165, 250, 0.12); color: $primary; }
  &.type-中介 { background: rgba(34, 197, 94, 0.15); color: $success; }
  &.type-平台 { background: rgba(245, 158, 11, 0.15); color: $warning; }
  &.type-线上 { background: rgba(139, 92, 246, 0.1); color: $purple; }
}
.rank-value { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; margin-left: auto; }

.rank-bar-row { margin-bottom: 4px; }
.rank-bar-track { height: 6px; background: rgba(255, 255, 255, 0.05); border-radius: 3px; overflow: hidden; }
.rank-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}
.rank-bar-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation: shimmer 2s infinite;
}

.rank-meta-row {
  display: flex;
  gap: 12px;
  font-size: 10px;
  color: $text-caption;

  b { font-weight: 600; color: $text-body; }
  .cost-highlight { color: $warning; }
}

/* ===== Radar & Matrix ===== */
.radar-card, .matrix-card { min-height: 200px; }
.radar-chart-area { height: 200px; }
.matrix-area { height: 200px; }

/* ===== Cost Row ===== */
.cost-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.cost-card { overflow: hidden; }
.cost-table { display: flex; flex-direction: column; gap: 2px; }
.cost-header-row {
  display: grid;
  grid-template-columns: 100px 80px 60px 80px;
  font-size: 10px;
  color: $text-caption;
  padding-bottom: 6px;
  border-bottom: 1px solid $border;
}
.cost-data-row {
  display: grid;
  grid-template-columns: 100px 80px 60px 80px;
  font-size: 11px;
  padding: 5px 0;
  transition: all 0.2s;
  border-left: 2px solid transparent;

  &:hover { background: rgba(255, 255, 255, 0.03); border-radius: 4px; }
  &.cost-danger { border-left-color: $danger; background: rgba(239, 68, 68, 0.04); }
}
.cost-name { color: $text-title; font-weight: 500; }
.cost-cpc { font-family: 'JetBrains Mono', monospace; color: $warning; font-weight: 600; }
.cost-trend {
  font-family: 'JetBrains Mono', monospace; font-weight: 600;
  &.up { color: $success; }
  &.down { color: $danger; }
}

/* ===== AI Insight ===== */
.ai-insight-card {
  position: relative;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid rgba(96, 165, 250, 0.12);
  background: rgba(96, 165, 250, 0.04);
  overflow: hidden;

  &.danger { border-color: rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.04); }
  &.warn { border-color: rgba(245, 158, 11, 0.2); background: rgba(245, 158, 11, 0.04); }
  &.good { border-color: rgba(34, 197, 94, 0.2); background: rgba(34, 197, 94, 0.04); }
}

.ai-insight-glow {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  opacity: 0.05;
  pointer-events: none;

  .danger & { background: radial-gradient(circle, $danger, transparent); }
  .warn & { background: radial-gradient(circle, $warning, transparent); }
  .good & { background: radial-gradient(circle, $success, transparent); }
}

.ai-insight-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.ai-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(96, 165, 250, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: $primary;
  flex-shrink: 0;

  .danger & { background: rgba(239, 68, 68, 0.12); color: $danger; }
  .warn & { background: rgba(245, 158, 11, 0.12); color: $warning; }
  .good & { background: rgba(34, 197, 94, 0.12); color: $success; }
}

.ai-header-text { flex: 1; }
.ai-title { font-size: 13px; font-weight: 700; color: $text-title; display: block; }
.ai-subtitle { font-size: 10px; color: $text-caption; }
.ai-severity-badge {
  font-size: 9px; font-weight: 700; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px;
  &.danger { color: $danger; background: rgba(239, 68, 68, 0.15); }
  &.warn { color: $warning; background: rgba(245, 158, 11, 0.15); }
  &.good { color: $success; background: rgba(34, 197, 94, 0.15); }
}

.ai-insight-body { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.ai-insight-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 11px;
  line-height: 1.6;
  color: $text-body;

  &.danger .insight-dot { background: $danger; box-shadow: 0 0 6px $danger; }
  &.warn .insight-dot { background: $warning; box-shadow: 0 0 6px $warning; }
  &.good .insight-dot { background: $success; box-shadow: 0 0 6px $success; }
}

.insight-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
}

.ai-insight-action {
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(96, 165, 250, 0.15);
}

.action-label { font-size: 10px; color: $primary; font-weight: 600; display: block; margin-bottom: 2px; }
.action-text { font-size: 11px; color: $text-body; line-height: 1.5; }

/* ===== Animations ===== */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 200%; }
}

@keyframes pulseBorder {
  0%, 100% { border-color: rgba(239, 68, 68, 0.2); }
  50% { border-color: rgba(239, 68, 68, 0.5); }
}

@media (max-width: 768px) {
  .hero-band { grid-template-columns: repeat(2, 1fr); }
  .main-grid { grid-template-columns: 1fr; }
  .channel-ranking-card { grid-row: auto; }
  .cost-row-grid { grid-template-columns: 1fr; }
}
</style>

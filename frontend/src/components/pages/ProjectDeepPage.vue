<template>
  <div class="page project-deep-page">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="project-selector-wrap">
        <select v-model="selectedProject" class="project-select">
          <option v-for="p in PROJECT_LIST" :key="p.name" :value="p.name">{{ p.name }}</option>
        </select>
        <span class="location-tag">{{ data.city }} · {{ data.district }}</span>
      </div>
      <div class="top-severity-badge" :class="severity">
        <span class="tsb-dot" />
        <span>{{ severityText }}</span>
      </div>
    </div>

    <!-- Executive Alert Banner -->
    <div v-if="execAlerts.length" class="exec-alert-banner" :class="severity">
      <div class="eab-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div class="eab-body">
        <div class="eab-title">经营者必看</div>
        <div class="eab-items">
          <div v-for="(a, i) in execAlerts" :key="i" class="eab-item" :class="a.level">
            <span class="eab-item-dot" />
            <span>{{ a.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Health Score -->
    <div class="health-score-section" :class="severity">
      <div class="health-glow" />
      <div class="health-score-ring" :style="ringStyle">
        <div class="score-inner">
          <DigitalFlipper :value="data.aiDiagnosis.score" :decimals="0" :size="36" :color="scoreColor" />
          <span class="score-unit">分</span>
        </div>
      </div>
      <span class="health-status" :class="severity">{{ severityText }}</span>
      <span class="health-sublabel">项目健康度</span>
    </div>

    <!-- AI Diagnosis Problems -->
    <div v-if="data.aiDiagnosis.problems.length" class="diagnosis-section">
      <div class="diagnosis-header">
        <span class="diagnosis-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/></svg>
        </span>
        <span class="diagnosis-title">AI 诊断问题</span>
        <span class="diagnosis-count">{{ data.aiDiagnosis.problems.length }}项</span>
      </div>
      <div class="problem-grid">
        <div v-for="(p, i) in data.aiDiagnosis.problems" :key="i" class="problem-card" :class="`sev-${p.severity}`"
          :style="{ animationDelay: i * 100 + 'ms' }">
          <div class="problem-top">
            <span class="problem-badge" :class="`badge-${p.severity}`">{{ severityLabel(p.severity) }}</span>
            <span class="problem-title">{{ p.title }}</span>
          </div>
          <div class="problem-detail">
            <div class="detail-row"><span class="detail-label">原因</span><span>{{ p.reason }}</span></div>
            <div class="detail-row"><span class="detail-label">建议</span><span class="suggestion">{{ p.suggestion }}</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Mini Cards -->
    <div class="kpi-mini-row">
      <div v-for="(kpi, i) in miniKPIs" :key="kpi.label" class="kpi-mini" :class="kpi.level"
        :style="{ animationDelay: i * 60 + 'ms' }">
        <span class="kpi-mini-label">{{ kpi.label }}</span>
        <div class="kpi-mini-value-row">
          <DigitalFlipper :value="kpi.value" :decimals="kpi.decimals" :size="18" :color="kpi.color" />
          <span class="kpi-mini-suffix" :style="{ color: kpi.color }">{{ kpi.suffix }}</span>
        </div>
        <div class="kpi-mini-bar">
          <div class="kpi-mini-bar-fill" :style="{ width: Math.min(kpi.bar, 100) + '%', background: kpi.color }" />
        </div>
      </div>
    </div>

    <!-- Financial Impact Row -->
    <div class="finance-row">
      <div v-for="(f, i) in financeKPIs" :key="f.label" class="finance-card" :class="f.level"
        :style="{ animationDelay: i * 80 + 'ms' }">
        <div class="fc-icon" :style="{ color: f.color }">{{ f.icon }}</div>
        <div class="fc-body">
          <span class="fc-label">{{ f.label }}</span>
          <div class="fc-value-row">
            <DigitalFlipper :value="f.value" :decimals="f.decimals" :size="22" :color="f.color" />
            <span class="fc-suffix" :style="{ color: f.color }">{{ f.suffix }}</span>
          </div>
          <div class="fc-desc" :class="f.level">{{ f.desc }}</div>
        </div>
      </div>
    </div>

    <!-- Visual Grid -->
    <div class="visual-grid">
      <!-- Sales Funnel -->
      <div class="card funnel-card">
        <div class="card-header">
          <span class="header-dot cyan" />
          <span class="card-title">销售漏斗</span>
          <span class="card-badge">{{ overallConversion }}% 总转化</span>
        </div>
        <div class="funnel-visual">
          <div v-for="(s, i) in data.funnel" :key="i" class="funnel-stage"
            :style="{ animationDelay: i * 80 + 'ms' }">
            <div class="funnel-bar-wrap">
              <div class="funnel-bar" :style="funnelBarStyle(s, i)">
                <span class="funnel-name">{{ s.name }}</span>
                <span class="funnel-count">{{ s.count.toLocaleString() }}</span>
              </div>
            </div>
            <div v-if="i > 0 && data.funnel[i - 1]" class="funnel-conversion"
              :class="{ 'conv-danger': (s.count / data.funnel[i - 1].count) < 0.4 }">
              <div class="conversion-arrow" />
              <span class="conversion-text">{{ conversionRate(s, i) }}</span>
            </div>
          </div>
        </div>
        <!-- Loss analysis -->
        <div class="funnel-loss-row">
          <template v-for="(s, i) in data.funnel" :key="'l' + i">
            <div v-if="i > 0 && data.funnel[i - 1]" class="loss-chip"
              :class="{ 'loss-severe': (1 - s.count / data.funnel[i - 1].count) > 0.6 }">
              <span class="loss-from">{{ data.funnel[i - 1].name }}</span>
              <span class="loss-arrow">→</span>
              <span class="loss-to">{{ s.name }}</span>
              <span class="loss-pct">{{ lossRate(s, i) }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Customer Sources -->
      <div class="card source-card">
        <div class="card-header">
          <span class="header-dot green" />
          <span class="card-title">客户来源</span>
        </div>
        <div class="source-visual">
          <div class="source-donut-area">
            <ChartWrapper :option="sourceDonutOption" height="140px" />
          </div>
          <div class="source-legend">
            <div v-for="s in data.customerSources" :key="s.name" class="source-legend-item">
              <span class="legend-dot" :style="{ background: s.color }" />
              <span class="legend-name">{{ s.name }}</span>
              <span class="legend-pct" :style="{ color: s.color }">{{ s.percent }}%</span>
              <div class="legend-bar-track">
                <div class="legend-bar-fill" :style="{ width: s.percent + '%', background: s.color }" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Segments -->
      <div class="card segment-card">
        <div class="card-header">
          <span class="header-dot purple" />
          <span class="card-title">客户画像</span>
        </div>
        <div class="segment-visual">
          <div v-for="seg in data.customerSegments" :key="seg.segment" class="segment-row">
            <div class="seg-avatar" :style="segAvatarStyle(seg)">
              {{ seg.segment.charAt(0) }}
            </div>
            <div class="seg-body">
              <div class="seg-top">
                <span class="seg-name">{{ seg.segment }}</span>
                <span class="seg-pct" :style="{ color: seg.color }">{{ seg.percent }}%</span>
              </div>
              <div class="seg-meta">
                <span>均龄{{ seg.avgAge }}岁</span>
                <span>预算{{ seg.avgBudget }}万</span>
              </div>
              <div class="seg-bar-track">
                <div class="seg-bar-fill" :style="segBarStyle(seg)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventory Structure -->
      <div class="card inventory-card">
        <div class="card-header">
          <span class="header-dot red" />
          <span class="card-title">库存结构</span>
          <span class="card-badge inv-badge" :class="inventoryRiskLevel">{{ totalUnsold }}套未售</span>
        </div>
        <div class="inventory-visual">
          <div v-for="inv in data.inventoryStructure" :key="inv.type" class="inv-row"
            :class="inv.unsold / inv.total > 0.4 ? 'inv-danger' : inv.unsold / inv.total > 0.25 ? 'inv-warn' : 'inv-good'">
            <div class="inv-header">
              <span class="inv-type">{{ inv.type }}</span>
              <span class="inv-unsold-pct" :style="{ color: invColor(inv) }">
                {{ (inv.unsold / inv.total * 100).toFixed(0) }}%未售
              </span>
              <span class="inv-unsold-val">¥{{ (inv.unsold * avgPriceByType(inv.type) / 10000).toFixed(0) }}万占资</span>
            </div>
            <div class="inv-stacked-bar">
              <div class="inv-sold" :style="{ width: (inv.sold / inv.total * 100) + '%' }">
                <span v-if="inv.sold / inv.total > 0.15">{{ inv.sold }}套已售</span>
              </div>
              <div class="inv-unsold" :style="{ width: (inv.unsold / inv.total * 100) + '%' }">
                <span v-if="inv.unsold / inv.total > 0.15">{{ inv.unsold }}套未售</span>
              </div>
            </div>
            <div class="inv-meta">共{{ inv.total }}套 · 去化率{{ (inv.sold / inv.total * 100).toFixed(0) }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PROJECT_LIST } from '@/utils/mockData'
import { generateProjectDeepData, type ProjectDeepData } from '@/utils/pageMockData'
import ChartWrapper from '@/components/common/ChartWrapper.vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'

const props = withDefaults(defineProps<{
  isActive?: boolean
  viewMode?: '2d' | '3d'
  period?: 'day' | 'week' | 'month' | 'year'
}>(), { viewMode: '2d', period: 'month' })

const selectedProject = ref(PROJECT_LIST[0].name)
const data = ref<ProjectDeepData>(generateProjectDeepData(selectedProject.value))

watch(selectedProject, (v) => { data.value = generateProjectDeepData(v) })

const severity = computed(() => {
  const s = data.value.aiDiagnosis.score
  return s >= 70 ? 'good' : s >= 45 ? 'warn' : 'danger'
})

const scoreColor = computed(() => {
  if (severity.value === 'good') return '#22C55E'
  if (severity.value === 'warn') return '#F59E0B'
  return '#EF4444'
})

const severityText = computed(() => {
  if (severity.value === 'good') return '经营健康'
  if (severity.value === 'warn') return '需要关注'
  return '亟需干预'
})

function severityLabel(s: string) {
  const m: Record<string, string> = { danger: '严重', warn: '预警', info: '正常' }
  return m[s] || s
}

const ringStyle = computed(() => {
  const score = data.value.aiDiagnosis.score
  const color = scoreColor.value
  return {
    background: `conic-gradient(${color} ${score}%, rgba(255, 255, 255, 0.05) ${score}%)`,
    boxShadow: severity.value === 'danger'
      ? '0 0 24px rgba(239, 68, 68, 0.3)'
      : severity.value === 'warn'
        ? '0 0 20px rgba(245, 158, 11, 0.2)'
        : '0 0 20px rgba(0, 0, 0, 0.3)',
  }
})

const overallConversion = computed(() => {
  if (data.value.funnel.length < 2) return '0.0'
  const closed = data.value.funnel[data.value.funnel.length - 1].count
  const leads = data.value.funnel[0].count
  if (leads === 0) return '0.0'
  return ((closed / leads) * 100).toFixed(1)
})

const totalUnsold = computed(() => data.value.inventoryStructure.reduce((s, inv) => s + inv.unsold, 0))

const inventoryRiskLevel = computed(() => {
  if (data.value.inventoryStructure.length === 0) return 'badge-good'
  const maxUnsoldPct = Math.max(...data.value.inventoryStructure.map(inv => inv.unsold / inv.total))
  if (maxUnsoldPct > 0.4) return 'badge-danger'
  if (maxUnsoldPct > 0.25) return 'badge-warn'
  return 'badge-good'
})

const execAlerts = computed(() => {
  const alerts: { text: string; level: string }[] = []
  const d = data.value

  const closed = d.funnel.length > 0 ? d.funnel[d.funnel.length - 1].count : 0
  const leads = d.funnel.length > 0 ? d.funnel[0].count : 1
  const convRate = closed / leads * 100
  if (convRate < 5) {
    alerts.push({ text: `总转化率仅${convRate.toFixed(1)}%，大量营销投入无产出，需立即优化`, level: 'danger' })
  } else if (convRate < 10) {
    alerts.push({ text: `总转化率${convRate.toFixed(1)}%，低于行业均值12%，建议检视渠道质量`, level: 'warn' })
  }

  const highUnsold = d.inventoryStructure.filter(inv => inv.unsold / inv.total > 0.4)
  if (highUnsold.length > 0) {
    const totalUnsoldValue = highUnsold.reduce((s, inv) => s + inv.unsold * avgPriceByType(inv.type), 0)
    alerts.push({ text: `${highUnsold.map(i => i.type).join('、')}未售率超40%，资金占用约¥${(totalUnsoldValue / 10000).toFixed(0)}万`, level: 'danger' })
  }

  if (d.aiDiagnosis.score < 45) {
    alerts.push({ text: `项目健康度仅${d.aiDiagnosis.score}分，已进入红色预警区间`, level: 'danger' })
  }

  for (let i = 1; i < d.funnel.length; i++) {
    const dropRate = 1 - d.funnel[i].count / d.funnel[i - 1].count
    if (dropRate > 0.65) {
      alerts.push({ text: `${d.funnel[i - 1].name}→${d.funnel[i].name}流失率${(dropRate * 100).toFixed(0)}%，严重异常`, level: 'danger' })
      break
    }
  }

  return alerts
})

const miniKPIs = computed(() => {
  const d = data.value
  const closed = d.funnel.length > 0 ? d.funnel[d.funnel.length - 1].count : 0
  const leads = d.funnel.length > 0 ? d.funnel[0].count : 1
  const convRate = closed / leads * 100
  return [
    { label: '总线索', value: leads, decimals: 0, suffix: '条', color: '#60a5fa', bar: 100, level: 'normal' },
    { label: '总成交', value: closed, decimals: 0, suffix: '套', color: '#22C55E', bar: convRate, level: convRate > 5 ? 'good' : 'warn' },
    { label: '转化率', value: convRate, decimals: 1, suffix: '%', color: convRate > 5 ? '#22C55E' : '#EF4444', bar: convRate, level: convRate > 5 ? 'good' : 'danger' },
    { label: '未售套数', value: totalUnsold.value, decimals: 0, suffix: '套', color: totalUnsold.value > 200 ? '#EF4444' : '#F59E0B', bar: totalUnsold.value > 300 ? 90 : totalUnsold.value / 4, level: totalUnsold.value > 300 ? 'danger' : 'warn' },
  ]
})

const financeKPIs = computed(() => {
  const d = data.value
  const closed = d.funnel.length > 0 ? d.funnel[d.funnel.length - 1].count : 0
  const leads = d.funnel.length > 0 ? d.funnel[0].count : 1
  const convRate = closed / leads * 100

  const avgDealPrice = 180
  const totalRevenue = closed * avgDealPrice
  const costPerCustomer = Math.round(1500 + (1 - convRate / 20) * 1000)
  const totalMarketingCost = leads * costPerCustomer / 10000
  const roiNum = totalMarketingCost > 0 ? Number((totalRevenue / totalMarketingCost).toFixed(1)) : 0
  const unsoldCapital = totalUnsold.value * avgDealPrice
  const returnRate = d.aiDiagnosis.score >= 70 ? 88 : d.aiDiagnosis.score >= 45 ? 78 : 65

  return [
    {
      label: '预估总货值', value: totalRevenue, decimals: 0, suffix: '万',
      color: '#60a5fa', icon: '💰', level: 'normal',
      desc: `已成交${closed}套 × 均价${avgDealPrice}万`,
    },
    {
      label: '库存资金占用', value: unsoldCapital, decimals: 0, suffix: '万',
      color: unsoldCapital > 30000 ? '#EF4444' : unsoldCapital > 15000 ? '#F59E0B' : '#22C55E',
      icon: '🏦',
      level: unsoldCapital > 30000 ? 'danger' : unsoldCapital > 15000 ? 'warn' : 'good',
      desc: unsoldCapital > 30000 ? '资金积压严重，影响周转' : unsoldCapital > 15000 ? '资金占用偏高，需加快去化' : '库存资金占用可控',
    },
    {
      label: '营销ROI', value: roiNum, decimals: 1, suffix: '',
      color: roiNum < 2 ? '#EF4444' : roiNum < 4 ? '#F59E0B' : '#22C55E',
      icon: '📈',
      level: roiNum < 2 ? 'danger' : roiNum < 4 ? 'warn' : 'good',
      desc: roiNum < 2 ? '投入产出严重失衡' : roiNum < 4 ? 'ROI偏低，需优化投放' : '投入产出比健康',
    },
    {
      label: '回款率', value: returnRate, decimals: 0, suffix: '%',
      color: returnRate < 75 ? '#EF4444' : returnRate < 85 ? '#F59E0B' : '#22C55E',
      icon: '💳',
      level: returnRate < 75 ? 'danger' : returnRate < 85 ? 'warn' : 'good',
      desc: returnRate < 75 ? '回款严重滞后，现金流风险' : returnRate < 85 ? '回款偏慢，需加强催收' : '回款节奏正常',
    },
  ]
})

function invColor(inv: { unsold: number; total: number }) {
  const pct = inv.unsold / inv.total
  if (pct > 0.4) return '#EF4444'
  if (pct > 0.25) return '#F59E0B'
  return '#22C55E'
}

function avgPriceByType(type: string): number {
  const priceMap: Record<string, number> = { '高层': 160, '洋房': 220, '别墅': 450, '商铺': 280 }
  return priceMap[type] || 180
}

function funnelBarStyle(s: { count: number; color: string }, _i: number) {
  const firstCount = data.value.funnel[0]?.count || 1
  const pct = s.count / firstCount * 100
  return {
    width: Math.max(pct, 8) + '%',
    background: s.color,
  }
}

function conversionRate(s: { count: number }, i: number): string {
  const prev = data.value.funnel[i - 1]
  if (!prev || prev.count === 0) return '0%'
  return ((s.count / prev.count) * 100).toFixed(0) + '%'
}

function lossRate(s: { count: number }, i: number): string {
  const prev = data.value.funnel[i - 1]
  if (!prev || prev.count === 0) return '0%流失'
  return ((1 - s.count / prev.count) * 100).toFixed(0) + '%流失'
}

function segAvatarStyle(seg: { color: string }) {
  return {
    background: seg.color + '20',
    color: seg.color,
  }
}

function segBarStyle(seg: { color: string; percent: number }) {
  return {
    width: seg.percent + '%',
    background: `linear-gradient(90deg, ${seg.color}66, ${seg.color})`,
  }
}

const sourceDonutOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 18, 23, 0.95)',
    borderColor: 'rgba(96, 165, 250, 0.15)',
    textStyle: { color: '#e2e8f0', fontSize: 11 },
    formatter: '{b}: {c}%',
  },
  series: [{
    type: 'pie',
    radius: ['48%', '76%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: true,
    itemStyle: { borderRadius: 4, borderColor: '#161B22', borderWidth: 2 },
    label: { show: false },
    emphasis: {
      itemStyle: { shadowBlur: 20, shadowColor: 'rgba(96, 165, 250, 0.5)' },
      label: { show: true, fontSize: 11, color: '#e2e8f0', formatter: '{b}\n{c}%' },
    },
    data: data.value.customerSources.map(s => ({
      name: s.name,
      value: s.percent,
      itemStyle: { color: s.color },
    })),
    animationType: 'scale',
    animationEasing: 'elasticOut',
    animationDuration: 1500,
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
$cyan: #06b6d4;

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

/* ===== Top Bar ===== */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-selector-wrap { display: flex; align-items: center; gap: 10px; }

.project-select {
  background: $card-bg;
  border: 1px solid $border;
  border-radius: 8px;
  padding: 8px 14px;
  color: $text-title;
  font-size: 14px;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
  &:hover { border-color: rgba(96, 165, 250, 0.2); box-shadow: 0 0 12px rgba(96, 165, 250, 0.12); }
  option { background: #1a1e28; }
}

.location-tag {
  font-size: 11px;
  color: $text-caption;
  background: $card-bg;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid $border;
}

.top-severity-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 6px;
  animation: fadeIn 0.6s ease-out;

  &.good { color: $success; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); }
  &.warn { color: $warning; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); }
  &.danger { color: $danger; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); animation: fadeIn 0.6s ease-out, pulseDanger 2s ease-in-out infinite; }
}

.tsb-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  .good & { background: $success; box-shadow: 0 0 6px $success; }
  .warn & { background: $warning; box-shadow: 0 0 6px $warning; }
  .danger & { background: $danger; box-shadow: 0 0 8px $danger; }
}

/* ===== Executive Alert Banner ===== */
.exec-alert-banner {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.04);
  animation: fadeIn 0.5s ease-out;

  &.good { border-color: rgba(34, 197, 94, 0.2); background: rgba(34, 197, 94, 0.04); }
  &.warn { border-color: rgba(245, 158, 11, 0.2); background: rgba(245, 158, 11, 0.04); }
  &.danger { border-color: rgba(239, 68, 68, 0.25); background: rgba(239, 68, 68, 0.06); animation: fadeIn 0.5s ease-out, pulseDangerBg 3s ease-in-out infinite; }
}

.eab-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .good & { background: rgba(34, 197, 94, 0.12); color: $success; }
  .warn & { background: rgba(245, 158, 11, 0.12); color: $warning; }
  .danger & { background: rgba(239, 68, 68, 0.15); color: $danger; }
}

.eab-body { flex: 1; }
.eab-title { font-size: 12px; font-weight: 700; color: $text-title; margin-bottom: 6px; letter-spacing: 0.5px; }
.eab-items { display: flex; flex-direction: column; gap: 4px; }
.eab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  line-height: 1.5;
  color: $text-body;

  &.danger { color: #fca5a5; }
  &.warn { color: #fcd34d; }
}

.eab-item-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;

  .danger & { background: $danger; box-shadow: 0 0 4px $danger; }
  .warn & { background: $warning; box-shadow: 0 0 4px $warning; }
}

/* ===== Health Score Section (compact) ===== */
.health-score-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid $border;
  background: $card-bg;
  overflow: visible;
  animation: fadeIn 0.6s ease-out;

  &.good { border-left: 4px solid $success; }
  &.warn { border-left: 4px solid $warning; }
  &.danger { border-left: 4px solid $danger; }
}

.health-glow {
  position: absolute;
  top: -30%;
  left: -10%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  opacity: 0.06;
  pointer-events: none;

  .good & { background: radial-gradient(circle, $success, transparent); }
  .warn & { background: radial-gradient(circle, $warning, transparent); }
  .danger & { background: radial-gradient(circle, $danger, transparent); }
}

.health-score-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  animation: ringPulse 2s ease-in-out infinite;
}

.score-inner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: $card-bg;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 1px;
}

.score-unit { font-size: 10px; color: $text-caption; font-weight: 500; margin-top: 2px; }

.health-status {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;

  &.good { color: $success; }
  &.warn { color: $warning; }
  &.danger { color: $danger; animation: blink 1.5s ease-in-out infinite; }
}

.health-sublabel { font-size: 11px; color: $text-caption; }

/* ===== AI Diagnosis Section ===== */
.diagnosis-section {
  border-radius: 10px;
  border: 1px solid $border;
  background: $card-bg;
  overflow: visible;
  animation: fadeIn 0.6s ease-out 0.1s both;
}

.diagnosis-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid $border;
  background: rgba(255, 255, 255, 0.015);
}

.diagnosis-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(96, 165, 250, 0.12);
  color: $primary;
}

.diagnosis-title { font-size: 12px; font-weight: 700; color: $text-title; }
.diagnosis-count { font-size: 10px; color: $text-caption; background: rgba(96, 165, 250, 0.08); padding: 2px 8px; border-radius: 10px; margin-left: auto; }

.problem-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
}

.problem-card {
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  animation: slideIn 0.4s ease-out both;
  transition: all 0.2s;
  overflow: visible;

  &:hover { background: rgba(255, 255, 255, 0.05); transform: translateX(3px); }
  &.sev-danger { border-left: 3px solid $danger; background: rgba(239, 68, 68, 0.04); }
  &.sev-warn { border-left: 3px solid $warning; background: rgba(245, 158, 11, 0.04); }
  &.sev-info { border-left: 3px solid $primary; background: rgba(96, 165, 250, 0.04); }
}

.problem-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }

.problem-badge {
  font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 3px; letter-spacing: 0.5px; flex-shrink: 0;
  &.badge-danger { color: $danger; background: rgba(239, 68, 68, 0.15); }
  &.badge-warn { color: $warning; background: rgba(245, 158, 11, 0.15); }
  &.badge-info { color: $primary; background: rgba(96, 165, 250, 0.12); }
}

.problem-title { font-size: 13px; font-weight: 700; color: $text-title; }
.problem-detail { display: flex; flex-direction: column; gap: 4px; }
.detail-row { font-size: 11px; color: $text-caption; display: flex; gap: 8px; line-height: 1.6; }
.detail-label { flex-shrink: 0; width: 30px; color: $text-caption; font-weight: 600; }
.suggestion { color: $text-body; }

/* ===== KPI Mini Row ===== */
.kpi-mini-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.kpi-mini {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid $border;
  background: $card-bg;
  animation: slideUp 0.4s ease-out both;
  transition: all 0.2s;

  &:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); }
  &.good { border-left: 2px solid $success; }
  &.warn { border-left: 2px solid $warning; }
  &.danger { border-left: 2px solid $danger; }
  &.normal { border-left: 2px solid $primary; }
}

.kpi-mini-label { display: block; font-size: 10px; color: $text-caption; margin-bottom: 3px; }
.kpi-mini-value-row { display: flex; align-items: baseline; gap: 2px; margin-bottom: 6px; }
.kpi-mini-suffix { font-size: 10px; font-weight: 500; opacity: 0.7; }
.kpi-mini-bar { height: 3px; background: rgba(255, 255, 255, 0.05); border-radius: 2px; overflow: hidden; }
.kpi-mini-bar-fill { height: 100%; border-radius: 2px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }

/* ===== Finance Row ===== */
.finance-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.finance-card {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid $border;
  background: $card-bg;
  animation: slideUp 0.5s ease-out both;
  transition: all 0.2s;

  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); }
  &.good { border-top: 2px solid $success; }
  &.warn { border-top: 2px solid $warning; }
  &.danger { border-top: 2px solid $danger; animation: slideUp 0.5s ease-out both, glowDanger 2s ease-in-out infinite; }
  &.normal { border-top: 2px solid $primary; }
}

.fc-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.fc-body { flex: 1; min-width: 0; }
.fc-label { display: block; font-size: 10px; color: $text-caption; margin-bottom: 2px; }
.fc-value-row { display: flex; align-items: baseline; gap: 2px; margin-bottom: 4px; }
.fc-suffix { font-size: 10px; font-weight: 500; opacity: 0.7; }
.fc-desc {
  font-size: 10px;
  line-height: 1.4;
  color: $text-caption;

  &.good { color: rgba(34, 197, 94, 0.8); }
  &.warn { color: rgba(245, 158, 11, 0.8); }
  &.danger { color: rgba(239, 68, 68, 0.9); }
  &.normal { color: $text-caption; }
}

/* ===== Visual Grid ===== */
.visual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.header-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $primary;
  &.cyan { background: $cyan; }
  &.green { background: $success; }
  &.purple { background: $purple; }
  &.red { background: $danger; }
}

.card-title { font-size: 13px; font-weight: 600; color: $text-title; }
.card-badge { font-size: 9px; color: $text-caption; background: rgba(96, 165, 250, 0.08); padding: 2px 6px; border-radius: 3px; margin-left: auto; }
.inv-badge {
  &.badge-danger { color: $danger; background: rgba(239, 68, 68, 0.12); }
  &.badge-warn { color: $warning; background: rgba(245, 158, 11, 0.12); }
  &.badge-good { color: $success; background: rgba(34, 197, 94, 0.12); }
}

/* ===== Funnel Visual ===== */
.funnel-visual {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.funnel-stage { animation: slideIn 0.4s ease-out both; }
.funnel-bar-wrap { display: flex; justify-content: center; }

.funnel-bar {
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  min-width: 60px;
  position: relative;
  overflow: hidden;
  opacity: 0.85;
  transition: all 0.3s;

  &:hover { transform: scaleX(1.02); }
}

.funnel-name { position: relative; z-index: 1; font-size: 11px; color: rgba(255, 255, 255, 0.9); font-weight: 500; }
.funnel-count { position: relative; z-index: 1; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: rgba(255, 255, 255, 0.95); font-weight: 700; }

.funnel-conversion {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
  padding-right: 20%;
  margin: 1px 0;

  &.conv-danger .conversion-text { color: $danger; font-weight: 700; }
  &.conv-danger .conversion-arrow { border-top-color: $danger; }
}

.conversion-arrow { width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid $cyan; }
.conversion-text { font-size: 10px; color: $cyan; font-weight: 600; }

.funnel-loss-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 255, 255, 0.06);
}

.loss-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  color: $text-caption;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(239, 68, 68, 0.06);

  &.loss-severe { background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.2); }
}

.loss-from, .loss-to { color: $text-body; }
.loss-arrow { color: $text-caption; }
.loss-pct { color: $danger; font-weight: 600; }

/* ===== Source Visual ===== */
.source-visual { display: flex; gap: 12px; }
.source-donut-area { width: 140px; height: 140px; flex-shrink: 0; }

.source-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
}

.source-legend-item { display: flex; align-items: center; gap: 6px; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.legend-name { font-size: 11px; color: $text-body; width: 36px; flex-shrink: 0; }
.legend-pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; width: 36px; text-align: right; flex-shrink: 0; }
.legend-bar-track { flex: 1; height: 4px; background: rgba(255, 255, 255, 0.05); border-radius: 2px; overflow: hidden; }
.legend-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }

/* ===== Segment Visual ===== */
.segment-visual { display: flex; flex-direction: column; gap: 8px; }

.segment-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.03); }
}

.seg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.seg-body { flex: 1; }
.seg-top { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
.seg-name { font-size: 12px; font-weight: 600; color: $text-title; }
.seg-pct { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; margin-left: auto; }
.seg-meta { font-size: 10px; color: $text-caption; display: flex; gap: 10px; margin-bottom: 4px; }
.seg-bar-track { height: 4px; background: rgba(255, 255, 255, 0.05); border-radius: 2px; overflow: hidden; }
.seg-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }

/* ===== Inventory Visual ===== */
.inventory-visual { display: flex; flex-direction: column; gap: 10px; }

.inv-row {
  padding: 8px 10px;
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.2s;

  &.inv-danger { border-left-color: $danger; background: rgba(239, 68, 68, 0.04); }
  &.inv-warn { border-left-color: $warning; background: rgba(245, 158, 11, 0.04); }
  &.inv-good { border-left-color: $success; background: rgba(34, 197, 94, 0.04); }
}

.inv-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; gap: 6px; }
.inv-type { font-size: 12px; font-weight: 600; color: $text-title; }
.inv-unsold-pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; }
.inv-unsold-val { font-size: 10px; color: $warning; font-weight: 500; margin-left: auto; }

.inv-stacked-bar {
  display: flex;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.inv-sold {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.85);
  background: $success;
  opacity: 0.7;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.inv-unsold {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.9);
  background: $danger;
  opacity: 0.6;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);

  .inv-good & { background: $warning; opacity: 0.5; }
}

.inv-meta { font-size: 10px; color: $text-caption; }

/* ===== Animations ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes ringPulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.1); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes pulseDanger {
  0%, 100% { border-color: rgba(239, 68, 68, 0.3); }
  50% { border-color: rgba(239, 68, 68, 0.6); }
}

@keyframes pulseDangerBg {
  0%, 100% { background: rgba(239, 68, 68, 0.06); }
  50% { background: rgba(239, 68, 68, 0.1); }
}

@keyframes glowDanger {
  0%, 100% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); }
  50% { box-shadow: 0 2px 16px rgba(239, 68, 68, 0.15); }
}

@media (max-width: 768px) {
  .kpi-mini-row { grid-template-columns: repeat(2, 1fr); }
  .finance-row { grid-template-columns: repeat(2, 1fr); }
  .visual-grid { grid-template-columns: 1fr; }
  .health-score-section { flex-wrap: wrap; }
  .health-score-ring { width: 56px; height: 56px; }
  .score-inner { width: 44px; height: 44px; }
  .problem-grid { padding: 10px; }
  .detail-row { flex-wrap: wrap; }
}
</style>

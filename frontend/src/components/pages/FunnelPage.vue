<template>
  <div class="funnel-page">
    <!-- Period Selector -->
    <PeriodSelector v-model="localPeriod" />

    <!-- 2D Mode -->
    <template v-if="viewMode !== '3d'">
      <!-- Executive Alert -->
      <div v-if="funnelAlerts.length" class="exec-alert" :class="funnelAlertLevel">
        <div class="ea-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="ea-body">
          <div class="ea-title">漏斗预警</div>
          <div class="ea-items">
            <div v-for="(a, i) in funnelAlerts" :key="i" class="ea-item" :class="a.level">
              <span class="ea-dot" />
              <span>{{ a.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Core KPI Row -->
      <div class="core-kpi-row">
        <div v-for="(kpi, i) in coreKPIs" :key="kpi.label" class="core-kpi" :class="kpi.level"
          :style="{ animationDelay: i * 80 + 'ms' }">
          <div class="ck-icon" :style="{ color: kpi.color }">{{ kpi.icon }}</div>
          <div class="ck-body">
            <span class="ck-label">{{ kpi.label }}</span>
            <div class="ck-value-row">
              <DigitalFlipper :value="kpi.value" :decimals="kpi.decimals" :size="22" :color="kpi.color" />
              <span class="ck-suffix" :style="{ color: kpi.color }">{{ kpi.suffix }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 全集团漏斗 -->
      <div class="card main-funnel">
        <div class="card-title-row">
          <span class="card-title"><span class="title-bar" />全集团销售漏斗</span>
          <span class="card-badge">{{ funnelOverallRate }}% 总转化</span>
        </div>
        <div class="funnel-visual">
          <div v-for="(stage, i) in funnel" :key="stage.name" class="funnel-stage">
            <div class="stage-bar-wrap">
              <div class="stage-bar" :style="{ width: (stage.count / funnel[0].count * 100) + '%', background: stage.color }">
                <div class="stage-bar-inner" />
                <span class="stage-name">{{ stage.name }}</span>
                <span class="stage-count">{{ stage.count.toLocaleString() }}</span>
              </div>
            </div>
            <div v-if="i > 0" class="stage-meta" :class="{ 'meta-danger': stage.rate < 30 }">
              <span class="stage-rate" :class="stage.rate >= 40 ? 'good' : stage.rate >= 25 ? 'warn' : 'bad'">
                转化 {{ stage.rate }}%
              </span>
              <span class="stage-loss">流失 {{ stage.lossRate }}%</span>
              <span v-if="stage.lossReason" class="stage-reason">{{ stage.lossReason }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- 按项目对比 -->
        <div class="card">
          <div class="card-title-row">
            <span class="card-title"><span class="title-bar green" />项目漏斗对比</span>
          </div>
          <div class="compare-table">
            <div class="ct-header">
              <span>项目</span><span>线索</span><span>到访</span><span>意向</span><span>认购</span><span>成交</span><span>转化率</span>
            </div>
            <div v-for="item in funnelCompare" :key="item.projectName" class="ct-row"
              :class="{ 'ct-row-danger': item.overallRate < 2, 'ct-row-warn': item.overallRate >= 2 && item.overallRate < 3 }">
              <span class="ct-name">{{ item.projectName }}</span>
              <span>{{ item.leads }}</span>
              <span>{{ item.visited }}</span>
              <span>{{ item.intent }}</span>
              <span>{{ item.subscribed }}</span>
              <span>{{ item.closed }}</span>
              <span class="ct-rate" :class="item.overallRate >= 3 ? 'good' : item.overallRate >= 2 ? 'warn' : 'bad'">
                {{ item.overallRate }}%
              </span>
            </div>
          </div>
        </div>

        <!-- 流失原因 -->
        <div class="card">
          <div class="card-title-row">
            <span class="card-title"><span class="title-bar red" />流失原因分布</span>
            <span class="card-badge red-badge">重点关注</span>
          </div>
          <div class="loss-list">
            <div v-for="l in lossReasons" :key="l.name" class="loss-item"
              :class="{ 'loss-highlight': l.percent >= 20 }">
              <span class="loss-name">{{ l.name }}</span>
              <div class="loss-bar-bg">
                <div class="loss-bar-fill" :style="{ width: l.percent + '%', background: l.color }" />
              </div>
              <span class="loss-pct" :style="{ color: l.percent >= 20 ? '#EF4444' : l.color }">{{ l.percent }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- 渠道漏斗对比 -->
        <div class="card">
          <div class="card-title-row">
            <span class="card-title"><span class="title-bar purple" />渠道漏斗对比</span>
          </div>
          <div class="ch-funnel">
            <div v-for="cf in channelFunnels" :key="cf.name" class="cf-row"
              :class="{ 'cf-danger': cf.rate < 5 }">
              <span class="cf-name">{{ cf.name }}</span>
              <div class="cf-bars">
                <div v-for="(v, i) in cf.stages" :key="i" class="cf-seg" :style="{ width: (v / cf.stages[0] * 100) + '%' }" :class="`seg-${i}`" />
              </div>
              <span class="cf-rate" :class="cf.rate >= 10 ? 'good' : cf.rate >= 5 ? 'warn' : 'bad'">{{ cf.rate }}%</span>
            </div>
          </div>
        </div>

        <!-- Loss Financial Impact -->
        <div class="card impact-card">
          <div class="card-title-row">
            <span class="card-title"><span class="title-bar amber" />流失经济损失</span>
            <span class="card-badge red-badge">老板关注</span>
          </div>
          <div class="impact-visual">
            <div class="impact-hero">
              <span class="impact-hero-label">因漏斗流失损失预估</span>
              <div class="impact-hero-value">
                <DigitalFlipper :value="estimatedLoss" :decimals="0" :size="32" color="#EF4444" />
                <span class="impact-hero-unit">万元</span>
              </div>
              <span class="impact-hero-desc">按均价180万/套 × 流失到访意向客户</span>
            </div>
            <div class="impact-breakdown">
              <div class="ib-row">
                <span class="ib-label">线索→到访流失</span>
                <span class="ib-value">{{ leadsToVisitedLoss }}人</span>
                <span class="ib-money">≈ ¥{{ (leadsToVisitedLoss * 180).toLocaleString() }}万</span>
              </div>
              <div class="ib-row">
                <span class="ib-label">到访→意向流失</span>
                <span class="ib-value">{{ visitedToIntentLoss }}人</span>
                <span class="ib-money">≈ ¥{{ (visitedToIntentLoss * 180).toLocaleString() }}万</span>
              </div>
              <div class="ib-row">
                <span class="ib-label">意向→成交流失</span>
                <span class="ib-value">{{ intentToClosedLoss }}人</span>
                <span class="ib-money danger">≈ ¥{{ (intentToClosedLoss * 180).toLocaleString() }}万</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 3D Mode -->
    <template v-else>
      <div class="three-d-layout">
        <div class="td-funnel-card">
          <div class="card-title">3D销售漏斗</div>
          <Funnel3D :stages="funnel3DStages" />
        </div>
        <div class="td-side">
          <div class="card" style="flex:1; min-height:0; overflow-y:auto;">
            <div class="card-title">渠道转化3D</div>
            <Bar3DChart :data="channelBarData" height="100%" />
          </div>
          <div class="card" style="flex:1; min-height:0; overflow-y:auto;">
            <div class="card-title">流失原因</div>
            <div class="loss-list">
              <div v-for="l in lossReasons" :key="l.name" class="loss-item">
                <span class="loss-name">{{ l.name }}</span>
                <div class="loss-bar-bg">
                  <div class="loss-bar-fill" :style="{ width: l.percent + '%', background: l.color }" />
                </div>
                <span class="loss-pct" :style="{ color: l.color }">{{ l.percent }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- AI结论 -->
    <div class="ai-box" :class="funnelAlertLevel">
      <div class="ai-icon">AI</div>
      <div class="ai-content">
        <div class="ai-title">漏斗诊断</div>
        <div class="ai-text">线索→到访转化率仅32%，大量线索被浪费。核心原因：渠道质量参差，信息触达不精准。到访→意向流失率45%，主要因价格预期不匹配和竞品分流。建议：①提高线上线索筛选精度；②加强案场第一印象营造；③推出限时优惠缩短决策周期。</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { generateFunnel, generateFunnelCompare } from '@/utils/pageMockData'
import Funnel3D from '@/components/charts/Funnel3D.vue'
import Bar3DChart from '@/components/charts/Bar3DChart.vue'
import PeriodSelector from '@/components/common/PeriodSelector.vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'

const props = withDefaults(defineProps<{ isActive?: boolean; viewMode?: '2d' | '3d'; period?: 'day' | 'week' | 'month' | 'year' }>(), { viewMode: '2d', period: 'month' })

const localPeriod = ref<'day' | 'week' | 'month' | 'year'>(props.period || 'month')
watch(() => props.period, v => { if (v) localPeriod.value = v })

const funnel = ref(generateFunnel())
const funnelCompare = ref(generateFunnelCompare())

const lossReasons = ref([
  { name: '价格预期不匹配', percent: 28, color: '#ef4444' },
  { name: '竞品分流', percent: 22, color: '#f59e0b' },
  { name: '按揭/首付困难', percent: 18, color: '#60a5fa' },
  { name: '楼盘信息虚假', percent: 12, color: '#8b5cf6' },
  { name: '配套不兑现', percent: 10, color: '#06b6d4' },
  { name: '其他', percent: 10, color: '#64748b' },
])

const channelFunnels = ref([
  { name: '自渠', stages: [500, 220, 130, 65, 52], rate: 10.4 },
  { name: '贝壳', stages: [400, 180, 100, 48, 38], rate: 9.5 },
  { name: '抖音', stages: [600, 120, 50, 18, 12], rate: 2.0 },
  { name: '安居客', stages: [350, 100, 45, 16, 10], rate: 2.9 },
  { name: '老带新', stages: [150, 85, 55, 32, 28], rate: 18.7 },
])

const funnel3DStages = computed(() => funnel.value.map(s => ({ name: s.name, count: s.count, color: s.color })))
const channelBarData = computed(() => channelFunnels.value.map(cf => ({ name: cf.name, value: cf.rate })))

// Executive-level computations
const funnelOverallRate = computed(() => {
  if (funnel.value.length < 2) return 0
  const last = funnel.value[funnel.value.length - 1]
  return ((last.count / funnel.value[0].count) * 100).toFixed(1)
})

const funnelAlerts = computed(() => {
  const alerts: { text: string; level: string }[] = []
  const f = funnel.value

  if (f.length >= 2) {
    const overallRate = f[f.length - 1].count / f[0].count * 100
    if (overallRate < 5) {
      alerts.push({ text: `总转化率仅${overallRate.toFixed(1)}%，远低于行业12%均值，营销投入严重浪费`, level: 'danger' })
    }

    // Check each stage
    for (let i = 1; i < f.length; i++) {
      const stageRate = f[i].count / f[i - 1].count * 100
      if (stageRate < 30) {
        alerts.push({ text: `${f[i - 1].name}→${f[i].name}转化率仅${stageRate.toFixed(0)}%，严重瓶颈`, level: 'danger' })
      }
    }
  }

  // Check channel performance
  const badChannels = channelFunnels.value.filter(c => c.rate < 5)
  if (badChannels.length > 0) {
    alerts.push({ text: `${badChannels.map(c => c.name).join('、')}转化率低于5%，渠道投入产出失衡`, level: 'warn' })
  }

  return alerts
})

const funnelAlertLevel = computed(() => {
  if (funnelAlerts.value.some(a => a.level === 'danger')) return 'danger'
  if (funnelAlerts.value.some(a => a.level === 'warn')) return 'warn'
  return 'good'
})

const coreKPIs = computed(() => {
  const f = funnel.value
  const leads = f.length > 0 ? f[0].count : 0
  const closed = f.length > 0 ? f[f.length - 1].count : 0
  const overallRate = leads > 0 ? closed / leads * 100 : 0
  const avgDealPrice = 180 // 万

  return [
    { label: '总线索量', value: leads, decimals: 0, suffix: '条', color: '#60a5fa', icon: '📊', level: 'normal' },
    { label: '总成交量', value: closed, decimals: 0, suffix: '套', color: '#22C55E', icon: '🏠', level: 'good' },
    { label: '总转化率', value: overallRate, decimals: 1, suffix: '%', color: overallRate < 5 ? '#EF4444' : overallRate < 10 ? '#F59E0B' : '#22C55E', icon: '📈', level: overallRate < 5 ? 'danger' : overallRate < 10 ? 'warn' : 'good' },
    { label: '预估成交额', value: closed * avgDealPrice, decimals: 0, suffix: '万', color: '#8b5cf6', icon: '💰', level: 'normal' },
  ]
})

// Financial impact of funnel loss
const leadsToVisitedLoss = computed(() => {
  if (funnel.value.length < 2) return 0
  return funnel.value[0].count - funnel.value[1].count
})

const visitedToIntentLoss = computed(() => {
  if (funnel.value.length < 3) return 0
  return funnel.value[1].count - funnel.value[2].count
})

const intentToClosedLoss = computed(() => {
  if (funnel.value.length < 5) return 0
  return funnel.value[2].count - funnel.value[4].count
})

const estimatedLoss = computed(() => {
  return (leadsToVisitedLoss.value + visitedToIntentLoss.value + intentToClosedLoss.value) * 180 / 3
})
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

.funnel-page {
  height: 100%;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: $page-bg;
  color: $text-body;
}

/* ===== Executive Alert ===== */
.exec-alert {
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

.ea-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(239, 68, 68, 0.1);

  .good & { background: rgba(34, 197, 94, 0.12); color: $success; }
  .warn & { background: rgba(245, 158, 11, 0.12); color: $warning; }
  .danger & { background: rgba(239, 68, 68, 0.15); color: $danger; }
}

.ea-body { flex: 1; }
.ea-title { font-size: 12px; font-weight: 700; color: $text-title; margin-bottom: 4px; }
.ea-items { display: flex; flex-direction: column; gap: 3px; }
.ea-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  line-height: 1.5;

  &.danger { color: #fca5a5; }
  &.warn { color: #fcd34d; }
}

.ea-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;

  .danger & { background: $danger; box-shadow: 0 0 4px $danger; }
  .warn & { background: $warning; box-shadow: 0 0 4px $warning; }
}

/* ===== Core KPI Row ===== */
.core-kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.core-kpi {
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
  &.danger { border-top: 2px solid $danger; }
  &.normal { border-top: 2px solid $primary; }
}

.ck-icon { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
.ck-body { flex: 1; min-width: 0; }
.ck-label { display: block; font-size: 10px; color: $text-caption; margin-bottom: 2px; }
.ck-value-row { display: flex; align-items: baseline; gap: 2px; }
.ck-suffix { font-size: 10px; font-weight: 500; opacity: 0.7; }

/* ===== Card ===== */
.card {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid $border;
  background: $card-bg;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  &:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3); }
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: $text-title;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: $primary;
  display: inline-block;

  &.green { background: $success; }
  &.red { background: $danger; }
  &.purple { background: $purple; }
  &.amber { background: $warning; }
}

.card-badge {
  font-size: 9px;
  color: $text-caption;
  background: rgba(96, 165, 250, 0.08);
  padding: 2px 6px;
  border-radius: 3px;

  &.red-badge { color: $danger; background: rgba(239, 68, 68, 0.1); }
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* ===== Funnel ===== */
.funnel-visual {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stage-bar {
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  min-width: 80px;
  opacity: 0.85;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover { opacity: 1; transform: scaleX(1.02); }
}

.stage-bar-inner {
  position: absolute;
  inset: 0;
  background: inherit;
  opacity: 0.15;
  filter: blur(8px);
}

.stage-name { position: relative; z-index: 1; font-size: 12px; color: rgba(255, 255, 255, 0.9); font-weight: 500; }
.stage-count { position: relative; z-index: 1; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: rgba(255, 255, 255, 0.95); font-weight: 600; }

.stage-meta { display: flex; gap: 12px; margin-top: 4px; padding-left: 6px;
  &.meta-danger .stage-rate { color: $danger !important; }
}
.stage-rate { font-size: 11px; font-weight: 500; &.good { color: $success; } &.warn { color: $warning; } &.bad { color: $danger; } }
.stage-loss { font-size: 11px; color: $danger; font-weight: 500; }
.stage-reason { font-size: 10px; color: $text-caption; }

/* ===== Compare Table ===== */
.compare-table { display: flex; flex-direction: column; gap: 2px; }
.ct-header { display: grid; grid-template-columns: 120px repeat(5, 60px) 70px; font-size: 10px; color: $text-caption; padding: 4px 0; border-bottom: 1px solid $border; }
.ct-row {
  display: grid;
  grid-template-columns: 120px repeat(5, 60px) 70px;
  font-size: 11px;
  color: $text-body;
  padding: 5px 0;
  transition: all 0.2s;
  border-left: 2px solid transparent;

  &:hover { background: rgba(255, 255, 255, 0.03); border-radius: 4px; }
  &.ct-row-danger { border-left-color: $danger; background: rgba(239, 68, 68, 0.04); }
  &.ct-row-warn { border-left-color: $warning; background: rgba(245, 158, 11, 0.04); }
}
.ct-name { color: $text-title; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ct-rate { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; &.good { color: $success; } &.warn { color: $warning; } &.bad { color: $danger; } }

/* ===== Loss Reasons ===== */
.loss-list { display: flex; flex-direction: column; gap: 8px; }
.loss-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
  transition: all 0.2s;

  &:hover { background: rgba(255, 255, 255, 0.03); border-radius: 4px; }
  &.loss-highlight { padding: 4px 6px; border-radius: 4px; background: rgba(239, 68, 68, 0.04); border-left: 2px solid $danger; }
}
.loss-name { font-size: 11px; color: $text-body; width: 100px; flex-shrink: 0; }
.loss-bar-bg { flex: 1; height: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 5px; overflow: hidden; }
.loss-bar-fill { height: 100%; border-radius: 5px; transition: width 0.4s; }
.loss-pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; width: 36px; text-align: right; flex-shrink: 0; font-weight: 600; }

/* ===== Channel Funnel ===== */
.ch-funnel { display: flex; flex-direction: column; gap: 10px; }
.cf-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  transition: all 0.2s;
  border-left: 2px solid transparent;

  &:hover { background: rgba(255, 255, 255, 0.03); border-radius: 4px; }
  &.cf-danger { border-left-color: $danger; background: rgba(239, 68, 68, 0.04); }
}
.cf-name { font-size: 11px; color: $text-body; width: 50px; flex-shrink: 0; }
.cf-bars { flex: 1; display: flex; height: 16px; border-radius: 4px; overflow: hidden; }
.cf-seg { min-width: 2px; transition: width 0.4s;
  &.seg-0 { background: rgba(96, 165, 250, 0.35); }
  &.seg-1 { background: rgba(6, 182, 212, 0.35); }
  &.seg-2 { background: rgba(34, 197, 94, 0.35); }
  &.seg-3 { background: rgba(245, 158, 11, 0.35); }
  &.seg-4 { background: rgba(139, 92, 246, 0.35); }
}
.cf-rate {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  width: 40px;
  text-align: right;
  flex-shrink: 0;
  font-weight: 600;
  &.good { color: $success; }
  &.warn { color: $warning; }
  &.bad { color: $danger; }
}

/* ===== Financial Impact ===== */
.impact-card { border: 1px solid rgba(239, 68, 68, 0.1); }
.impact-visual { display: flex; flex-direction: column; gap: 12px; }
.impact-hero { text-align: center; padding: 12px; border-radius: 8px; background: rgba(239, 68, 68, 0.04); border: 1px solid rgba(239, 68, 68, 0.1); }
.impact-hero-label { display: block; font-size: 11px; color: $text-caption; margin-bottom: 6px; }
.impact-hero-value { display: flex; align-items: baseline; justify-content: center; gap: 4px; }
.impact-hero-unit { font-size: 14px; color: $danger; font-weight: 600; }
.impact-hero-desc { display: block; font-size: 9px; color: $text-caption; margin-top: 4px; }
.impact-breakdown { display: flex; flex-direction: column; gap: 4px; }
.ib-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  padding: 4px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.02);

  &:hover { background: rgba(255, 255, 255, 0.04); }
}
.ib-label { color: $text-caption; width: 100px; flex-shrink: 0; }
.ib-value { color: $text-body; font-weight: 500; width: 40px; text-align: right; }
.ib-money { color: $warning; font-weight: 600; margin-left: auto;
  &.danger { color: $danger; }
}

/* ===== AI Box ===== */
.ai-box {
  display: flex;
  gap: 10px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid rgba(96, 165, 250, 0.12);
  background: rgba(96, 165, 250, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;

  &.warn { border-color: rgba(245, 158, 11, 0.2); background: rgba(245, 158, 11, 0.04); }
  &.danger { border-color: rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.04); }
}

.ai-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(96, 165, 250, 0.12);
  color: $primary;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .warn & { background: rgba(245, 158, 11, 0.12); color: $warning; }
  .danger & { background: rgba(239, 68, 68, 0.12); color: $danger; }
}

.ai-content { flex: 1; }
.ai-title { font-size: 12px; font-weight: 600; color: $primary; margin-bottom: 4px;
  .warn & { color: $warning; }
  .danger & { color: $danger; }
}
.ai-text { font-size: 11px; color: $text-body; line-height: 1.7; }

// 3D mode
.three-d-layout { display: flex; gap: 10px; flex: 1; min-height: 0; }
.td-funnel-card { flex: 1; min-height: 0; padding: 10px; border-radius: 10px; border: 1px solid $border; background: $card-bg; }
.td-side { width: 40%; display: flex; flex-direction: column; gap: 8px; }

/* ===== Animations ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulseDangerBg {
  0%, 100% { background: rgba(239, 68, 68, 0.06); }
  50% { background: rgba(239, 68, 68, 0.1); }
}

@media (max-width: 768px) {
  .two-col { grid-template-columns: 1fr; }
  .three-d-layout { flex-direction: column; }
  .td-side { width: 100%; }
  .ct-header, .ct-row { grid-template-columns: 80px repeat(5, 45px) 55px; font-size: 9px; }
  .core-kpi-row { grid-template-columns: repeat(2, 1fr); }
}
</style>

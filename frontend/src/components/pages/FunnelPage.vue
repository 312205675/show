<template>
  <div class="funnel-page">
    <!-- Period Selector -->
    <PeriodSelector v-model="localPeriod" />

    <!-- 2D Mode -->
    <template v-if="viewMode !== '3d'">
      <!-- 全集团漏斗 -->
      <div class="card main-funnel">
        <div class="card-title">全集团销售漏斗</div>
        <div class="funnel-visual">
          <div v-for="(stage, i) in funnel" :key="stage.name" class="funnel-stage">
            <div class="stage-bar-wrap">
              <div class="stage-bar" :style="{ width: (stage.count / funnel[0].count * 100) + '%', background: stage.color }">
                <span class="stage-name">{{ stage.name }}</span>
                <span class="stage-count">{{ stage.count.toLocaleString() }}</span>
              </div>
            </div>
            <div v-if="i > 0" class="stage-meta">
              <span class="stage-rate">总转化 {{ stage.rate }}%</span>
              <span class="stage-loss">流失 {{ stage.lossRate }}%</span>
              <span v-if="stage.lossReason" class="stage-reason">{{ stage.lossReason }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 按项目对比 -->
      <div class="card">
        <div class="card-title">项目漏斗对比</div>
        <div class="compare-table">
          <div class="ct-header">
            <span>项目</span><span>线索</span><span>到访</span><span>意向</span><span>认购</span><span>成交</span><span>总转化率</span>
          </div>
          <div v-for="item in funnelCompare" :key="item.projectName" class="ct-row">
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

      <div class="two-col">
        <div class="card">
          <div class="card-title">流失原因分布</div>
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

        <div class="card">
          <div class="card-title">渠道漏斗对比</div>
          <div class="ch-funnel">
            <div v-for="cf in channelFunnels" :key="cf.name" class="cf-row">
              <span class="cf-name">{{ cf.name }}</span>
              <div class="cf-bars">
                <div v-for="(v, i) in cf.stages" :key="i" class="cf-seg" :style="{ width: (v / cf.stages[0] * 100) + '%' }" :class="`seg-${i}`" />
              </div>
              <span class="cf-rate">{{ cf.rate }}%</span>
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
    <div class="ai-box">
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

const props = withDefaults(defineProps<{ viewMode?: '2d' | '3d'; period?: 'day' | 'week' | 'month' | 'year' }>(), { viewMode: '2d', period: 'month' })

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
</script>

<style scoped lang="scss">
.funnel-page {
  height: 100%;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--bg, #0F1217);
  color: var(--text-body, #cbd5e1);
}

.card {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid var(--border, rgba(255,255,255,0.06));
  background: var(--card-bg, #161B22);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s;
  &:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-title, #e2e8f0);
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid var(--primary, #60a5fa);
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

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
  &:hover { opacity: 1; transform: scaleX(1.02); }
}

.stage-name { font-size: 12px; color: rgba(255,255,255,0.9); font-weight: 500; }
.stage-count { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: rgba(255,255,255,0.95); font-weight: 600; }

.stage-meta { display: flex; gap: 12px; margin-top: 4px; padding-left: 6px; }
.stage-rate { font-size: 11px; color: var(--success, #22C55E); font-weight: 500; }
.stage-loss { font-size: 11px; color: var(--danger, #EF4444); font-weight: 500; }
.stage-reason { font-size: 10px; color: var(--text-caption, #64748b); }

.compare-table { display: flex; flex-direction: column; gap: 2px; }
.ct-header { display: grid; grid-template-columns: 120px repeat(5, 60px) 70px; font-size: 10px; color: var(--text-caption, #64748b); padding: 4px 0; border-bottom: 1px solid var(--border, rgba(255,255,255,0.06)); }
.ct-row { display: grid; grid-template-columns: 120px repeat(5, 60px) 70px; font-size: 11px; color: var(--text-body, #cbd5e1); padding: 5px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.ct-name { color: var(--text-title, #e2e8f0); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ct-rate { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; &.good { color: var(--success, #22C55E); } &.warn { color: var(--warning, #F59E0B); } &.bad { color: var(--danger, #EF4444); } }

.loss-list { display: flex; flex-direction: column; gap: 8px; }
.loss-item { display: flex; align-items: center; gap: 8px; padding: 2px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.loss-name { font-size: 11px; color: var(--text-body, #cbd5e1); width: 100px; flex-shrink: 0; }
.loss-bar-bg { flex: 1; height: 10px; background: var(--bar-track, rgba(255,255,255,0.05)); border-radius: 5px; overflow: hidden; }
.loss-bar-fill { height: 100%; border-radius: 5px; transition: width 0.4s; }
.loss-pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; width: 36px; text-align: right; flex-shrink: 0; font-weight: 600; }

.ch-funnel { display: flex; flex-direction: column; gap: 10px; }
.cf-row { display: flex; align-items: center; gap: 8px; padding: 2px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.cf-name { font-size: 11px; color: var(--text-body, #cbd5e1); width: 50px; flex-shrink: 0; }
.cf-bars { flex: 1; display: flex; height: 16px; border-radius: 4px; overflow: hidden; }
.cf-seg { min-width: 2px; transition: width 0.4s;
  &.seg-0 { background: rgba(96, 165, 250, 0.35); }
  &.seg-1 { background: rgba(6, 182, 212, 0.35); }
  &.seg-2 { background: rgba(34, 197, 94, 0.35); }
  &.seg-3 { background: rgba(245, 158, 11, 0.35); }
  &.seg-4 { background: rgba(139, 92, 246, 0.35); }
}
.cf-rate { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--success, #22C55E); width: 40px; text-align: right; flex-shrink: 0; font-weight: 600; }

.ai-box { display: flex; gap: 10px; padding: 14px; border-radius: 10px; border: 1px solid var(--primary-light, rgba(96,165,250,0.12)); background: var(--primary-light, rgba(96,165,250,0.06)); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.ai-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--primary-light, rgba(96,165,250,0.12)); color: var(--primary, #60a5fa); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ai-content { flex: 1; }
.ai-title { font-size: 12px; font-weight: 600; color: var(--primary, #60a5fa); margin-bottom: 4px; }
.ai-text { font-size: 11px; color: var(--text-body, #cbd5e1); line-height: 1.7; }

// 3D mode
.three-d-layout { display: flex; gap: 10px; flex: 1; min-height: 0; }
.td-funnel-card { flex: 1; min-height: 0; padding: 10px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22); }
.td-side { width: 40%; display: flex; flex-direction: column; gap: 8px; }

@media (max-width: 768px) {
  .two-col { grid-template-columns: 1fr; }
  .three-d-layout { flex-direction: column; }
  .td-side { width: 100%; }
  .ct-header, .ct-row { grid-template-columns: 80px repeat(5, 45px) 55px; font-size: 9px; }
}
</style>

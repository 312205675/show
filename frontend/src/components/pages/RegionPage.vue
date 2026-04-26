<template>
  <div class="page region-page">
    <!-- Period Selector -->
    <PeriodSelector v-model="localPeriod" />

    <!-- 2D Mode -->
    <template v-if="viewMode !== '3d'">
      <!-- View mode toggle -->
      <div class="view-toggle-bar">
        <button class="vt-btn" :class="{ active: viewMode2D === 'list' }" @click="viewMode2D = 'list'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          列表
        </button>
        <button class="vt-btn" :class="{ active: viewMode2D === 'map' }" @click="viewMode2D = 'map'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
          地图
        </button>
      </div>

      <!-- Map Mode -->
      <template v-if="viewMode2D === 'map'">
        <div class="map-container card">
          <div class="map-chart-area">
            <ChinaMap :points="mapPoints" :regions="mapRegions" :zoom-level="1.8"
              map-geo-url="https://geo.datav.aliyun.com/areas_v3/bound/130100_full.json"
              map-name="shijiazhuang"
              :center="[114.5, 38.04]"
              :scale-limit-min="0.8"
              :scale-limit-max="20"
            />
          </div>
          <div class="map-legend">
            <div class="ml-item"><span class="ml-dot healthy" />健康去化 (≥65%)</div>
            <div class="ml-item"><span class="ml-dot warning" />需要关注 (50-65%)</div>
            <div class="ml-item"><span class="ml-dot danger" />高风险 (<50%)</div>
          </div>
          <div class="map-summary">
            <div v-for="r in regions" :key="r.name" class="ms-card" :class="`risk-${r.riskLevel}`">
              <div class="ms-name">{{ r.name }}</div>
              <div class="ms-stats">
                <span class="ms-val good">{{ r.depletionRate }}%</span>
                <span class="ms-lbl">去化</span>
              </div>
              <div class="ms-stats">
                <span class="ms-val">{{ r.totalSales.toFixed(1) }}亿</span>
                <span class="ms-lbl">销售</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- List Mode -->
      <template v-else>
        <!-- 区域排名 -->
        <div class="card">
          <div class="card-title">区域经营排名</div>
          <div class="region-cards">
            <div v-for="(r, i) in regions" :key="r.name" class="region-card" :class="`risk-${r.riskLevel}`">
              <div class="rc-head">
                <span class="rc-rank" :class="{ top: i < 3 }">{{ i + 1 }}</span>
                <span class="rc-name">{{ r.name }}</span>
                <span class="rc-risk" :class="`rl-${r.riskLevel}`">{{ riskLabel(r.riskLevel) }}</span>
              </div>
              <div class="rc-body">
                <div class="rc-stat">
                  <span class="rc-val">{{ r.totalSales.toFixed(1) }}亿</span>
                  <span class="rc-lbl">销售额</span>
                </div>
                <div class="rc-stat">
                  <span class="rc-val">{{ r.dealCount }}套</span>
                  <span class="rc-lbl">成交</span>
                </div>
                <div class="rc-stat">
                  <span class="rc-val">{{ r.avgPrice }}</span>
                  <span class="rc-lbl">均价</span>
                </div>
                <div class="rc-stat">
                  <span class="rc-val" :class="r.depletionRate >= 65 ? 'good' : r.depletionRate >= 50 ? 'warn' : 'bad'">{{ r.depletionRate }}%</span>
                  <span class="rc-lbl">去化率</span>
                </div>
                <div class="rc-stat">
                  <span class="rc-val" :class="r.returnRate >= 75 ? 'good' : r.returnRate >= 65 ? 'warn' : 'bad'">{{ r.returnRate }}%</span>
                  <span class="rc-lbl">回款率</span>
                </div>
              </div>
              <div class="rc-pressure">
                <span class="pressure-label">库存压力</span>
                <div class="pressure-bar">
                  <div class="pressure-fill" :style="{ width: r.inventoryPressure + '%', background: pressureColor(r.inventoryPressure) }" />
                </div>
                <span class="pressure-val">{{ r.inventoryPressure }}</span>
              </div>
              <div class="rc-suggestion">{{ r.suggestion }}</div>
            </div>
          </div>
        </div>

        <div class="two-col">
          <div class="card">
            <div class="card-title">区域销售额对比</div>
            <div class="bar-compare">
              <div v-for="r in sortedBySales" :key="r.name" class="bc-row">
                <span class="bc-name">{{ r.name }}</span>
                <div class="bc-bar-bg">
                  <div class="bc-bar-fill" :style="{ width: (r.totalSales / maxSales * 100) + '%' }" />
                </div>
                <span class="bc-val">{{ r.totalSales.toFixed(1) }}亿</span>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">风险识别与调度建议</div>
            <div class="risk-list">
              <div v-for="r in regions.filter(x => x.riskLevel !== 'low')" :key="r.name" class="risk-item" :class="`rl-${r.riskLevel}`">
                <div class="ri-head">
                  <span class="ri-name">{{ r.name }}</span>
                  <span class="ri-level" :class="`rl-${r.riskLevel}`">{{ riskLabel(r.riskLevel) }}</span>
                </div>
                <div class="ri-detail">
                  <div class="ri-row"><span class="ri-lbl">问题</span><span>库存压力{{ r.inventoryPressure }}分，去化率{{ r.depletionRate }}%，回款率{{ r.returnRate }}%</span></div>
                  <div class="ri-row"><span class="ri-lbl">原因</span><span>{{ r.inventoryPressure > 60 ? '供过于求，区域配套不足' : '市场观望情绪重' }}</span></div>
                  <div class="ri-row"><span class="ri-lbl">建议</span><span>{{ r.suggestion }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">资源调度建议</div>
          <div class="dispatch-table">
            <div class="dt-header">
              <span>区域</span><span>当前项目</span><span>建议动作</span><span>优先级</span>
            </div>
            <div v-for="d in dispatchPlan" :key="d.region" class="dt-row">
              <span class="dt-region">{{ d.region }}</span>
              <span>{{ d.projects }}个</span>
              <span>{{ d.action }}</span>
              <span class="dt-priority" :class="d.priority">{{ d.priority }}</span>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- 3D Mode -->
    <template v-else>
      <div class="three-d-layout">
        <div class="td-main-card">
          <div class="card-title">区域3D经营地图</div>
          <Bar3DChart :data="regionBarData" height="100%" />
        </div>
        <div class="td-side-col">
          <div class="card" style="flex:1; min-height:0;">
            <div class="card-title">风险×去化3D分析</div>
            <Scatter3DChart :data="regionScatterData" x-axis-label="库存压力" y-axis-label="去化率(%)" z-axis-label="回款率(%)" height="100%" />
          </div>
          <div class="card" style="flex-shrink:0; max-height: 160px; overflow-y:auto;">
            <div class="card-title">资源调度</div>
            <div class="dispatch-table">
              <div class="dt-header"><span>区域</span><span>项目</span><span>动作</span><span>优先级</span></div>
              <div v-for="d in dispatchPlan" :key="d.region" class="dt-row">
                <span class="dt-region">{{ d.region }}</span>
                <span>{{ d.projects }}个</span>
                <span>{{ d.action }}</span>
                <span class="dt-priority" :class="d.priority">{{ d.priority }}</span>
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
        <div class="ai-title">区域诊断</div>
        <div class="ai-text">裕华区为集团利润核心，建议加大推盘力度；鹿泉区与高新板块需重点关注，库存压力超70分，建议启动以价换量策略；桥西区高端盘占比高但去化偏慢，建议调整产品结构。资源调度优先级：高新>鹿泉>桥西。</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { generateRegions, type RegionItem } from '@/utils/pageMockData'
import Bar3DChart from '@/components/charts/Bar3DChart.vue'
import Scatter3DChart from '@/components/charts/Scatter3DChart.vue'
import ChinaMap from '@/components/charts/ChinaMap.vue'
import PeriodSelector from '@/components/common/PeriodSelector.vue'

const props = withDefaults(defineProps<{ isActive?: boolean; viewMode?: '2d' | '3d'; period?: 'day' | 'week' | 'month' | 'year' }>(), { viewMode: '2d', period: 'month' })

const localPeriod = ref<'day' | 'week' | 'month' | 'year'>(props.period || 'month')
watch(() => props.period, v => { if (v) localPeriod.value = v })

const viewMode2D = ref<'list' | 'map'>('map')
const regions = ref<RegionItem[]>(generateRegions())
const sortedBySales = computed(() => [...regions.value].sort((a, b) => b.totalSales - a.totalSales))
const maxSales = computed(() => Math.max(...regions.value.map(r => r.totalSales)))

// Map data
const mapPoints = computed(() => {
  const coords: Record<string, [number, number]> = {
    '裕华区': [114.53, 38.02],
    '长安区': [114.56, 38.05],
    '桥西区': [114.46, 38.03],
    '新华区': [114.46, 38.06],
    '鹿泉区': [114.28, 38.08],
    '高新区': [114.58, 38.00],
  }
  return regions.value.map(r => ({
    name: `石家庄·${r.name}`,
    value: [...(coords[r.name] || [114.5, 38.0]), r.depletionRate],
    itemStyle: { color: r.depletionRate >= 65 ? '#22C55E' : r.depletionRate >= 50 ? '#F59E0B' : '#EF4444', borderColor: r.depletionRate >= 65 ? '#22C55E' : r.depletionRate >= 50 ? '#F59E0B' : '#EF4444', borderWidth: 2 },
    symbolSize: 28,
    label: { show: true, formatter: r.name, fontSize: 11, fontWeight: 700, color: '#e2e8f0', position: 'top' as const, textBorderColor: 'rgba(0,0,0,0.6)', textBorderWidth: 2 },
  }))
})

const mapRegions = computed(() => regions.value.map(r => ({
  name: r.name,
  value: r.depletionRate,
  level: r.riskLevel === 'low' ? 'active' : r.riskLevel === 'medium' ? 'warning' : 'danger',
})))

const dispatchPlan = computed(() => regions.value.map(r => ({
  region: r.name, projects: r.projects,
  action: r.riskLevel === 'high' ? '降价促销+渠道加码' : r.riskLevel === 'medium' ? '优化定价+渠道调整' : '维持策略+适度加推',
  priority: r.riskLevel === 'high' ? '紧急' as const : r.riskLevel === 'medium' ? '重要' as const : '常规' as const,
})))

function riskLabel(l: string) { const m: Record<string, string> = { low: '低风险', medium: '中风险', high: '高风险' }; return m[l] || l }
function pressureColor(v: number) { return v >= 70 ? '#ff4757' : v >= 50 ? '#ffab00' : '#00d68f' }

const regionBarData = computed(() => sortedBySales.value.map(r => ({ name: r.name, value: Number(r.totalSales.toFixed(1)), color: r.riskLevel === 'high' ? '#ff4757' : r.riskLevel === 'medium' ? '#ffab00' : '#00d68f' })))
const regionScatterData = computed(() => regions.value.map(r => ({ name: r.name, x: r.inventoryPressure, y: r.depletionRate, z: r.returnRate, size: Math.max(8, r.projects * 3), category: r.riskLevel === 'high' ? '刚需' : r.riskLevel === 'medium' ? '改善' : '投资' })))
</script>

<style scoped lang="scss">
.page { height: 100%; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; background: var(--bg, #0F1217); color: var(--text-body, #cbd5e1); }
.card { padding: 14px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22); box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: all 0.3s; &:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.3); } }
.card-title { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); margin-bottom: 12px; padding-left: 10px; border-left: 3px solid var(--primary, #60a5fa); }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

// View toggle
.view-toggle-bar { display: flex; gap: 4px; padding: 4px; border-radius: 8px; background: var(--card-bg, #161B22); border: 1px solid var(--border, rgba(255,255,255,0.06)); align-self: flex-start; }
.vt-btn { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 6px; border: none; background: transparent; color: var(--text-caption, #64748b); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  &:hover { color: var(--text-body, #cbd5e1); background: rgba(255,255,255,0.04); }
  &.active { background: rgba(99, 102, 241, 0.15); color: var(--primary, #60a5fa); box-shadow: 0 0 8px rgba(99,102,241,0.15); }
}

// Map mode
.map-container { flex: 1; display: flex; flex-direction: column; gap: 10px; min-height: 400px; }
.map-chart-area { flex: 1; min-height: 400px; border-radius: 8px; overflow: hidden; }
.map-legend { display: flex; gap: 16px; padding: 6px 10px; justify-content: center; }
.ml-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-caption, #64748b); }
.ml-dot { width: 8px; height: 8px; border-radius: 50%;
  &.healthy { background: var(--success, #22C55E); box-shadow: 0 0 6px rgba(34,197,94,0.4); }
  &.warning { background: var(--warning, #F59E0B); box-shadow: 0 0 6px rgba(245,158,11,0.4); }
  &.danger { background: var(--danger, #EF4444); box-shadow: 0 0 6px rgba(239,68,68,0.4); }
}
.map-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.ms-card { padding: 10px; border-radius: 8px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--surface, rgba(255,255,255,0.03)); display: flex; align-items: center; gap: 8px;
  &.risk-high { border-left: 3px solid var(--danger, #EF4444); }
  &.risk-medium { border-left: 3px solid var(--warning, #F59E0B); }
  &.risk-low { border-left: 3px solid var(--success, #22C55E); }
}
.ms-name { font-size: 12px; font-weight: 600; color: var(--text-title, #e2e8f0); flex: 1; }
.ms-stats { display: flex; flex-direction: column; }
.ms-val { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: var(--text-body, #cbd5e1);
  &.good { color: var(--success, #22C55E); }
}
.ms-lbl { font-size: 9px; color: var(--text-caption, #64748b); }

.region-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.region-card {
  padding: 12px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); cursor: default;
  &:hover { transform: translateY(-2px) scale(1.01); box-shadow: 0 8px 28px rgba(0,0,0,0.3); }
  &.risk-high { border-top: 2px solid var(--danger, #EF4444); }
  &.risk-medium { border-top: 2px solid var(--warning, #F59E0B); }
  &.risk-low { border-top: 2px solid var(--success, #22C55E); }
}

.rc-head { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.rc-rank { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: var(--text-caption, #64748b); width: 20px; font-weight: 600; &.top { color: var(--warning, #F59E0B); font-weight: 700; text-shadow: 0 0 6px var(--warning-light); } }
.rc-name { font-size: 14px; font-weight: 600; color: var(--text-title, #e2e8f0); }
.rc-risk { font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 3px; margin-left: auto;
  &.rl-high { background: var(--danger-light, rgba(239,68,68,0.15)); color: var(--danger, #EF4444); }
  &.rl-medium { background: var(--warning-light, rgba(245,158,11,0.15)); color: var(--warning, #F59E0B); }
  &.rl-low { background: var(--success-light, rgba(34,197,94,0.15)); color: var(--success, #22C55E); }
}

.rc-body { display: flex; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
.rc-stat { display: flex; flex-direction: column; }
.rc-val { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text-title, #e2e8f0); font-weight: 600; &.good { color: var(--success, #22C55E); } &.warn { color: var(--warning, #F59E0B); } &.bad { color: var(--danger, #EF4444); } }
.rc-lbl { font-size: 9px; color: var(--text-caption, #64748b); letter-spacing: 0.3px; }

.rc-pressure { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.pressure-label { font-size: 9px; color: var(--text-caption, #64748b); width: 48px; }
.pressure-bar { flex: 1; height: 6px; background: var(--bar-track, rgba(255,255,255,0.05)); border-radius: 3px; overflow: hidden; }
.pressure-fill { height: 100%; border-radius: 3px; transition: width 0.4s; }
.pressure-val { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-caption, #64748b); width: 20px; text-align: right; }

.rc-suggestion { font-size: 11px; color: var(--info, #06b6d4); line-height: 1.5; }

.bar-compare { display: flex; flex-direction: column; gap: 10px; }
.bc-row { display: flex; align-items: center; gap: 8px; padding: 2px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.bc-name { font-size: 12px; color: var(--text-body, #cbd5e1); width: 50px; flex-shrink: 0; font-weight: 500; }
.bc-bar-bg { flex: 1; height: 14px; background: var(--primary-light, rgba(96,165,250,0.12)); border-radius: 6px; overflow: hidden; }
.bc-bar-fill { height: 100%; border-radius: 6px; background: var(--primary, #60a5fa); opacity: 0.6; transition: width 0.4s; }
.bc-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--primary, #60a5fa); width: 55px; text-align: right; flex-shrink: 0; font-weight: 600; }

.risk-list { display: flex; flex-direction: column; gap: 8px; }
.risk-item { padding: 10px; border-radius: 6px; background: var(--surface, rgba(255,255,255,0.03)); transition: all 0.2s; &:hover { background: var(--surface-hover, rgba(255,255,255,0.06)); transform: translateX(2px); }
  &.rl-high { border-left: 3px solid var(--danger, #EF4444); }
  &.rl-medium { border-left: 3px solid var(--warning, #F59E0B); }
}
.ri-head { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.ri-name { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); }
.ri-level { font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 3px;
  &.rl-high { background: var(--danger-light, rgba(239,68,68,0.15)); color: var(--danger, #EF4444); }
  &.rl-medium { background: var(--warning-light, rgba(245,158,11,0.15)); color: var(--warning, #F59E0B); }
}
.ri-detail { display: flex; flex-direction: column; gap: 3px; }
.ri-row { font-size: 11px; color: var(--text-caption, #64748b); display: flex; gap: 6px; }
.ri-lbl { color: var(--text-caption, #64748b); flex-shrink: 0; width: 30px; }

.dispatch-table { display: flex; flex-direction: column; gap: 2px; }
.dt-header { display: grid; grid-template-columns: 70px 60px 1fr 50px; font-size: 10px; color: var(--text-caption, #64748b); padding: 4px 0; border-bottom: 1px solid var(--border, rgba(255,255,255,0.06)); }
.dt-row { display: grid; grid-template-columns: 70px 60px 1fr 50px; font-size: 11px; color: var(--text-body, #cbd5e1); padding: 5px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.dt-region { color: var(--text-title, #e2e8f0); font-weight: 500; }
.dt-priority { font-weight: 700; &.紧急 { color: var(--danger, #EF4444); } &.重要 { color: var(--warning, #F59E0B); } &.常规 { color: var(--success, #22C55E); } }

.ai-box { display: flex; gap: 10px; padding: 14px; border-radius: 10px; border: 1px solid var(--primary-light, rgba(96,165,250,0.12)); background: var(--primary-light, rgba(96,165,250,0.06)); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.ai-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--primary-light, rgba(96,165,250,0.12)); color: var(--primary, #60a5fa); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ai-content { flex: 1; }
.ai-title { font-size: 12px; font-weight: 600; color: var(--primary, #60a5fa); margin-bottom: 4px; }
.ai-text { font-size: 11px; color: var(--text-body, #cbd5e1); line-height: 1.7; }

.three-d-layout { display: flex; gap: 10px; flex: 1; min-height: 0; }
.td-main-card { flex: 1; min-height: 0; padding: 10px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22); }
.td-side-col { width: 38%; display: flex; flex-direction: column; gap: 8px; min-height: 0; }

@media (max-width: 768px) {
  .region-cards { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .three-d-layout { flex-direction: column; }
  .td-side-col { width: 100%; }
}
</style>

<template>
  <div class="page region-page">
    <!-- Period Selector -->
    <PeriodSelector v-model="localPeriod" />

    <!-- 2D Mode -->
    <template v-if="viewMode !== '3d'">
      <!-- View mode toggle -->
      <div class="view-toggle-bar">
        <button class="vt-btn" :class="{ active: viewMode2D === 'map3d' }" @click="viewMode2D = 'map3d'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          立体地图
        </button>
        <button class="vt-btn" :class="{ active: viewMode2D === 'map' }" @click="viewMode2D = 'map'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
          平面地图
        </button>
        <button class="vt-btn" :class="{ active: viewMode2D === 'list' }" @click="viewMode2D = 'list'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          列表
        </button>
      </div>

      <!-- 3D Map Mode (Default) -->
      <template v-if="viewMode2D === 'map3d'">
        <div class="map3d-container">
          <RegionMap3D
            :regions="regions"
            :project-buildings="projectBuildings"
            @select-region="onSelectRegion"
            @hover-building="onHoverBuilding"
          />
          <!-- Floating region cards overlay -->
          <div class="map3d-overlay-top">
            <div class="overlay-title">
              <span class="overlay-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              石家庄 · 区域经营全景
            </div>
            <div class="overlay-legend">
              <span class="ol-item"><i class="ol-dot healthy" />健康 (≥65%)</span>
              <span class="ol-item"><i class="ol-dot warning" />关注 (50-65%)</span>
              <span class="ol-item"><i class="ol-dot danger" />高危 (&lt;50%)</span>
            </div>
          </div>

          <!-- Bottom stats bar -->
          <div class="map3d-overlay-bottom">
            <div
              v-for="r in regions"
              :key="r.name"
              class="region-quick-stat"
              :class="[`risk-${r.riskLevel}`, { active: selectedRegion === r.name }]"
              @mouseenter="selectedRegion = r.name"
              @mouseleave="selectedRegion = ''"
            >
              <div class="rqs-name">{{ r.name }}</div>
              <div class="rqs-nums">
                <span class="rqs-rate" :class="r.depletionRate >= 65 ? 'good' : r.depletionRate >= 50 ? 'warn' : 'bad'">{{ r.depletionRate }}%</span>
                <span class="rqs-sep">·</span>
                <span class="rqs-sales">{{ r.totalSales.toFixed(1) }}亿</span>
                <span class="rqs-sep">·</span>
                <span class="rqs-projects">{{ r.projects }}盘</span>
              </div>
            </div>
          </div>

          <!-- Hover info panel -->
          <Transition name="slide-fade">
            <div v-if="hoveredBuilding" class="building-tooltip">
              <div class="bt-name">{{ hoveredBuilding.name }}</div>
              <div class="bt-row"><span class="bt-label">区域</span><span>{{ hoveredBuilding.city }}</span></div>
              <div class="bt-row"><span class="bt-label">均价</span><span class="bt-val">¥{{ hoveredBuilding.avgPrice }}/㎡</span></div>
              <div class="bt-row"><span class="bt-label">状态</span><span class="bt-status" :class="hoveredBuilding.statusClass">{{ hoveredBuilding.statusLabel }}</span></div>
            </div>
          </Transition>
        </div>
      </template>

      <!-- Flat Map Mode -->
      <template v-else-if="viewMode2D === 'map'">
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
        <div class="card neon-card">
          <div class="card-title neon-title">
            <span class="nt-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
            </span>
            区域经营排名
          </div>
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
          <div class="card neon-card">
            <div class="card-title neon-title">
              <span class="nt-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
              </span>
              区域销售额对比
            </div>
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

          <div class="card neon-card">
            <div class="card-title neon-title">
              <span class="nt-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </span>
              风险识别与调度建议
            </div>
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

        <div class="card neon-card">
          <div class="card-title neon-title">
            <span class="nt-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><path d="M1 12h6"/></svg>
            </span>
            资源调度建议
          </div>
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
    <div class="ai-box neon-ai">
      <div class="ai-icon-wrap">
        <div class="ai-orb" />
        <span class="ai-label">AI</span>
      </div>
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
import RegionMap3D from '@/components/charts/RegionMap3D.vue'

const props = withDefaults(defineProps<{ isActive?: boolean; viewMode?: '2d' | '3d'; period?: 'day' | 'week' | 'month' | 'year' }>(), { viewMode: '2d', period: 'month' })

const localPeriod = ref<'day' | 'week' | 'month' | 'year'>(props.period || 'month')
watch(() => props.period, v => { if (v) localPeriod.value = v })

const viewMode2D = ref<'map3d' | 'map' | 'list'>('map3d')
const regions = ref<RegionItem[]>(generateRegions())
const selectedRegion = ref('')
const sortedBySales = computed(() => [...regions.value].sort((a, b) => b.totalSales - a.totalSales))
const maxSales = computed(() => Math.max(...regions.value.map(r => r.totalSales)))

// Project buildings data for 3D map — grouped by region
interface ProjectBuilding {
  name: string
  city: string
  district: string
  avgPrice: number
  depletionRate: number
  x: number
  z: number
  height: number
  color: string
  statusLabel: string
  statusClass: string
}

const projectBuildings = computed<ProjectBuilding[]>(() => {
  // All projects positioned by their region, with realistic geo spread
  const projects: Omit<ProjectBuilding, 'height' | 'color' | 'statusLabel' | 'statusClass'>[] = [
    // 裕华区
    { name: '城发投·云华', city: '裕华区', district: '东南板块', avgPrice: 12500, depletionRate: 48, x: 4, z: -2 },
    { name: '城发投·云徽颂', city: '裕华区', district: '东南板块', avgPrice: 19200, depletionRate: 78, x: 6, z: -1 },
    // 长安区
    { name: '城发投·云山樾', city: '长安区', district: '和平路板块', avgPrice: 18800, depletionRate: 86, x: 2, z: -5 },
    { name: '城发投·云澜悦府', city: '长安区', district: '和平路板块', avgPrice: 18500, depletionRate: 82, x: 4, z: -6 },
    { name: '城发投·瑞凝府', city: '长安区', district: '东北板块', avgPrice: 16200, depletionRate: 65, x: 6, z: -4 },
    { name: '东方禧', city: '长安区', district: '中心板块', avgPrice: 16800, depletionRate: 56, x: 3, z: -3 },
    // 桥西区
    { name: '城发投·云和赋', city: '桥西区', district: '高铁板块', avgPrice: 21000, depletionRate: 72, x: -2, z: -1 },
    { name: '城发投·瑞晟府', city: '桥西区', district: '中心板块', avgPrice: 17800, depletionRate: 55, x: -4, z: 1 },
    { name: '城发投·雲境府', city: '桥西区', district: '西南板块', avgPrice: 17500, depletionRate: 60, x: -3, z: 2 },
    { name: '高铁商务14号地', city: '桥西区', district: '高铁板块', avgPrice: 22000, depletionRate: 58, x: -1, z: -3 },
    { name: '自强路金融区', city: '桥西区', district: '中心板块', avgPrice: 25000, depletionRate: 52, x: -5, z: -1 },
    { name: '客运段洗整基地', city: '桥西区', district: '高铁板块', avgPrice: 8500, depletionRate: 18, x: -6, z: -3 },
    // 新华区
    { name: '城发投·云尚', city: '新华区', district: '西北板块', avgPrice: 13500, depletionRate: 45, x: -2, z: 5 },
    // 鹿泉区
    { name: '城发投·麓湖四季', city: '鹿泉区', district: '龙泉湖板块', avgPrice: 14800, depletionRate: 35, x: -8, z: 5 },
    { name: '城发投·龙泉湖55号地', city: '鹿泉区', district: '龙泉湖板块', avgPrice: 13800, depletionRate: 28, x: -9, z: 3 },
    // 高新区
    { name: '生物医药园一期', city: '高新区', district: '高新板块', avgPrice: 9800, depletionRate: 22, x: 8, z: 3 },
  ]

  return projects.map(p => {
    const rate = p.depletionRate
    const height = Math.max(2, rate / 5.5)
    const color = rate >= 65 ? '#22C55E' : rate >= 50 ? '#F59E0B' : '#EF4444'
    const statusLabel = rate >= 65 ? '健康' : rate >= 50 ? '关注' : '高危'
    const statusClass = rate >= 65 ? 'healthy' : rate >= 50 ? 'warning' : 'danger'
    return { ...p, height, color, statusLabel, statusClass }
  })
})

const hoveredBuilding = ref<ProjectBuilding | null>(null)

function onSelectRegion(name: string) { selectedRegion.value = name }
function onHoverBuilding(b: ProjectBuilding | null) { hoveredBuilding.value = b }

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

.page {
  height: 100%; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 12px;
  background: $bg; color: $text-body;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba($primary, 0.2); border-radius: 4px; }
}

.card {
  padding: 16px; border-radius: 14px; border: 1px solid $border; background: $card-bg;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: all 0.3s;
  &:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
}

.neon-card {
  position: relative; overflow: hidden;
  &::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, $primary, rgba($cyan, 0.8), $primary, transparent);
    background-size: 200% 100%; animation: borderFlow 4s linear infinite; opacity: 0.6;
  }
}

@keyframes borderFlow {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.card-title {
  font-size: 14px; font-weight: 700; color: $text-title; margin-bottom: 14px;
  padding-left: 12px; border-left: 3px solid $primary; letter-spacing: 0.5px;
}
.neon-title { display: flex; align-items: center; gap: 8px; .nt-icon { display: flex; color: $primary; } }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

// View toggle
.view-toggle-bar {
  display: flex; gap: 4px; padding: 4px; border-radius: 10px;
  background: $card-bg; border: 1px solid $border; align-self: flex-start;
}
.vt-btn {
  display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 7px;
  border: none; background: transparent; color: $text-caption; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.3s;
  &:hover { color: $text-body; background: rgba(255,255,255,0.04); }
  &.active {
    background: rgba($primary, 0.15); color: $primary;
    box-shadow: 0 0 12px rgba($primary, 0.15);
  }
}

// ========== 3D Map Container ==========
.map3d-container {
  flex: 1; min-height: 520px; position: relative; border-radius: 16px;
  border: 1px solid $border; background: $card-bg; overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}

.map3d-overlay-top {
  position: absolute; top: 12px; left: 14px; z-index: 5; pointer-events: none;
  display: flex; flex-direction: column; gap: 6px;
}
.overlay-title {
  display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700;
  color: $text-title; letter-spacing: 0.5px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.6);
  .overlay-icon { display: flex; color: $primary; }
}
.overlay-legend { display: flex; gap: 12px; }
.ol-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: $text-caption; }
.ol-dot {
  width: 8px; height: 8px; border-radius: 50%;
  &.healthy { background: $success; box-shadow: 0 0 8px rgba($success, 0.5); }
  &.warning { background: $warning; box-shadow: 0 0 8px rgba($warning, 0.5); }
  &.danger { background: $danger; box-shadow: 0 0 8px rgba($danger, 0.5); }
}

.map3d-overlay-bottom {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 5;
  display: flex; gap: 8px; padding: 10px 14px;
  background: linear-gradient(to top, rgba($bg, 0.92), rgba($bg, 0.6), transparent);
}
.region-quick-stat {
  flex: 1; padding: 8px 10px; border-radius: 8px; background: rgba(255,255,255,0.04);
  border: 1px solid transparent; cursor: pointer; transition: all 0.3s;
  &.risk-high { border-left: 3px solid $danger; }
  &.risk-medium { border-left: 3px solid $warning; }
  &.risk-low { border-left: 3px solid $success; }
  &.active { background: rgba($primary, 0.1); border-color: rgba($primary, 0.3); }
  &:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); }
}
.rqs-name { font-size: 12px; font-weight: 700; color: $text-title; margin-bottom: 3px; }
.rqs-nums { display: flex; align-items: center; gap: 4px; font-size: 10px; color: $text-caption; flex-wrap: wrap; }
.rqs-rate { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px;
  &.good { color: $success; } &.warn { color: $warning; } &.bad { color: $danger; }
}
.rqs-sales { font-family: 'JetBrains Mono', monospace; font-weight: 600; color: $primary; }
.rqs-projects { font-weight: 600; }
.rqs-sep { opacity: 0.3; }

// Building tooltip
.building-tooltip {
  position: absolute; top: 50px; right: 14px; z-index: 10; width: 200px;
  padding: 14px; border-radius: 12px;
  background: rgba($card-bg, 0.95); border: 1px solid rgba($primary, 0.2);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
}
.bt-name { font-size: 14px; font-weight: 700; color: $text-title; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.bt-row { display: flex; justify-content: space-between; font-size: 12px; color: $text-caption; padding: 3px 0; }
.bt-val { color: $primary; font-weight: 600; font-family: 'JetBrains Mono', monospace; }
.bt-status {
  font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px;
  &.healthy { background: rgba($success, 0.15); color: $success; }
  &.warning { background: rgba($warning, 0.15); color: $warning; }
  &.danger { background: rgba($danger, 0.15); color: $danger; }
}

.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s ease-in; }
.slide-fade-enter-from { transform: translateX(20px); opacity: 0; }
.slide-fade-leave-to { transform: translateX(-10px); opacity: 0; }

// ========== Flat Map ==========
.map-container { flex: 1; display: flex; flex-direction: column; gap: 10px; min-height: 400px; }
.map-chart-area { flex: 1; min-height: 400px; border-radius: 8px; overflow: hidden; }
.map-legend { display: flex; gap: 16px; padding: 6px 10px; justify-content: center; }
.ml-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: $text-caption; }
.ml-dot {
  width: 8px; height: 8px; border-radius: 50%;
  &.healthy { background: $success; box-shadow: 0 0 6px rgba($success, 0.4); }
  &.warning { background: $warning; box-shadow: 0 0 6px rgba($warning, 0.4); }
  &.danger { background: $danger; box-shadow: 0 0 6px rgba($danger, 0.4); }
}
.map-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.ms-card { padding: 10px; border-radius: 8px; border: 1px solid $border; background: rgba(255,255,255,0.03); display: flex; align-items: center; gap: 8px;
  &.risk-high { border-left: 3px solid $danger; }
  &.risk-medium { border-left: 3px solid $warning; }
  &.risk-low { border-left: 3px solid $success; }
}
.ms-name { font-size: 12px; font-weight: 600; color: $text-title; flex: 1; }
.ms-stats { display: flex; flex-direction: column; }
.ms-val { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: $text-body; &.good { color: $success; } }
.ms-lbl { font-size: 9px; color: $text-caption; }

// ========== List Mode ==========
.region-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.region-card {
  padding: 14px; border-radius: 12px; border: 1px solid $border; background: $card-bg;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2); transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); cursor: default;
  &:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 10px 32px rgba(0,0,0,0.35); }
  &.risk-high { border-top: 2px solid $danger; }
  &.risk-medium { border-top: 2px solid $warning; }
  &.risk-low { border-top: 2px solid $success; }
}
.rc-head { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.rc-rank { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: $text-caption; width: 20px; font-weight: 600; &.top { color: $warning; font-weight: 700; } }
.rc-name { font-size: 14px; font-weight: 600; color: $text-title; }
.rc-risk {
  font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 3px; margin-left: auto;
  &.rl-high { background: rgba($danger, 0.15); color: $danger; }
  &.rl-medium { background: rgba($warning, 0.15); color: $warning; }
  &.rl-low { background: rgba($success, 0.15); color: $success; }
}
.rc-body { display: flex; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
.rc-stat { display: flex; flex-direction: column; }
.rc-val { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: $text-title; font-weight: 600; &.good { color: $success; } &.warn { color: $warning; } &.bad { color: $danger; } }
.rc-lbl { font-size: 9px; color: $text-caption; letter-spacing: 0.3px; }
.rc-pressure { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.pressure-label { font-size: 9px; color: $text-caption; width: 48px; }
.pressure-bar { flex: 1; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
.pressure-fill { height: 100%; border-radius: 3px; transition: width 0.4s; }
.pressure-val { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: $text-caption; width: 20px; text-align: right; }
.rc-suggestion { font-size: 11px; color: $cyan; line-height: 1.5; }

.bar-compare { display: flex; flex-direction: column; gap: 10px; }
.bc-row { display: flex; align-items: center; gap: 8px; padding: 3px 0; transition: all 0.2s; &:hover { background: rgba(255,255,255,0.03); border-radius: 4px; } }
.bc-name { font-size: 12px; color: $text-body; width: 50px; flex-shrink: 0; font-weight: 500; }
.bc-bar-bg { flex: 1; height: 14px; background: rgba($primary, 0.12); border-radius: 6px; overflow: hidden; }
.bc-bar-fill { height: 100%; border-radius: 6px; background: $primary; opacity: 0.6; transition: width 0.4s; }
.bc-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: $primary; width: 55px; text-align: right; flex-shrink: 0; font-weight: 600; }

.risk-list { display: flex; flex-direction: column; gap: 8px; }
.risk-item { padding: 12px; border-radius: 8px; background: rgba(255,255,255,0.03); transition: all 0.3s; &:hover { background: rgba(255,255,255,0.06); transform: translateX(3px); }
  &.rl-high { border-left: 3px solid $danger; }
  &.rl-medium { border-left: 3px solid $warning; }
}
.ri-head { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.ri-name { font-size: 13px; font-weight: 600; color: $text-title; }
.ri-level {
  font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 3px;
  &.rl-high { background: rgba($danger, 0.15); color: $danger; }
  &.rl-medium { background: rgba($warning, 0.15); color: $warning; }
}
.ri-detail { display: flex; flex-direction: column; gap: 3px; }
.ri-row { font-size: 11px; color: $text-caption; display: flex; gap: 6px; }
.ri-lbl { color: $text-caption; flex-shrink: 0; width: 30px; }

.dispatch-table { display: flex; flex-direction: column; gap: 2px; }
.dt-header { display: grid; grid-template-columns: 70px 60px 1fr 50px; font-size: 10px; color: $text-caption; padding: 4px 0; border-bottom: 1px solid $border; }
.dt-row { display: grid; grid-template-columns: 70px 60px 1fr 50px; font-size: 11px; color: $text-body; padding: 5px 0; transition: all 0.2s; &:hover { background: rgba(255,255,255,0.03); border-radius: 4px; } }
.dt-region { color: $text-title; font-weight: 500; }
.dt-priority { font-weight: 700; &.紧急 { color: $danger; } &.重要 { color: $warning; } &.常规 { color: $success; } }

// ========== AI Box ==========
.neon-ai {
  display: flex; gap: 14px; padding: 16px; border-radius: 14px;
  border: 1px solid rgba($primary, 0.15);
  background: linear-gradient(135deg, rgba($primary, 0.06), rgba(99,102,241,0.03));
  box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba($primary, 0.04);
  position: relative; overflow: hidden;
  &::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, $primary, rgba($cyan, 0.8), $primary, transparent);
    background-size: 200% 100%; animation: borderFlow 4s linear infinite; opacity: 0.5;
  }
}
.ai-icon-wrap {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  background: rgba($primary, 0.1); position: relative;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.ai-orb {
  position: absolute; inset: 4px; border-radius: 8px;
  background: radial-gradient(circle at 30% 30%, rgba($primary, 0.3), transparent);
  animation: orbRotate 3s linear infinite;
}
@keyframes orbRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.ai-label { position: relative; z-index: 2; font-size: 12px; font-weight: 800; color: $primary; letter-spacing: 1px; }
.ai-content { flex: 1; }
.ai-title { font-size: 13px; font-weight: 700; color: $primary; margin-bottom: 4px; letter-spacing: 0.5px; }
.ai-text { font-size: 12px; color: $text-body; line-height: 1.8; }
.ai-box { display: flex; gap: 10px; padding: 14px; border-radius: 10px; border: 1px solid rgba($primary, 0.12); background: rgba($primary, 0.06); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.ai-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba($primary, 0.12); color: $primary; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.three-d-layout { display: flex; gap: 10px; flex: 1; min-height: 0; }
.td-main-card { flex: 1; min-height: 0; padding: 10px; border-radius: 10px; border: 1px solid $border; background: $card-bg; }
.td-side-col { width: 38%; display: flex; flex-direction: column; gap: 8px; min-height: 0; }

@media (max-width: 768px) {
  .region-cards { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .three-d-layout { flex-direction: column; }
  .td-side-col { width: 100%; }
  .map3d-overlay-bottom { flex-wrap: wrap; }
  .region-quick-stat { min-width: calc(50% - 4px); }
}
</style>

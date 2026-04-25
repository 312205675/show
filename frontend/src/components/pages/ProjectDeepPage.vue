<template>
  <div class="page project-deep-page">
    <!-- Period Selector -->
    <PeriodSelector v-model="localPeriod" />

    <!-- 项目选择器 -->
    <div class="page-toolbar">
      <select v-model="selectedProject" class="project-select">
        <option v-for="p in PROJECT_LIST" :key="p.name" :value="p.name">{{ p.name }}</option>
      </select>
      <span class="toolbar-tag">{{ data.city }} · {{ data.district }}</span>
      <span v-if="viewMode === '3d'" class="toolbar-mode">3D</span>
    </div>

    <!-- AI诊断 -->
    <div class="ai-diagnosis" :class="`score-${severity}`">
      <div class="ai-score">
        <div class="score-ring" :style="{ '--pct': data.aiDiagnosis.score + '%' }">
          <span class="score-val">{{ data.aiDiagnosis.score }}</span>
        </div>
        <span class="score-label">健康度</span>
      </div>
      <div class="ai-problems">
        <div v-for="(p, i) in data.aiDiagnosis.problems" :key="i" class="problem-item" :class="`sev-${p.severity}`">
          <div class="problem-header">
            <span class="problem-sev-tag">{{ severityLabel(p.severity) }}</span>
            <span class="problem-title">{{ p.title }}</span>
          </div>
          <div class="problem-body">
            <div class="problem-row"><span class="row-label">原因</span><span>{{ p.reason }}</span></div>
            <div class="problem-row"><span class="row-label">建议</span><span>{{ p.suggestion }}</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2D模式 -->
    <template v-if="viewMode === '2d'">
      <div class="two-col">
        <!-- 销售漏斗 -->
        <div class="card">
          <div class="card-title">销售漏斗</div>
          <div class="funnel-chart">
            <div v-for="(s, i) in data.funnel" :key="i" class="funnel-step">
              <div class="funnel-bar" :style="{ width: (s.count / data.funnel[0].count * 100) + '%', background: s.color }">
                <span class="funnel-name">{{ s.name }}</span>
                <span class="funnel-count">{{ s.count }}</span>
              </div>
              <div v-if="i > 0" class="funnel-rate">
                转化{{ ((s.count / data.funnel[i - 1].count) * 100).toFixed(0) }}%
              </div>
            </div>
          </div>
        </div>

        <!-- 客户来源 -->
        <div class="card">
          <div class="card-title">客户来源</div>
          <div class="source-list">
            <div v-for="s in data.customerSources" :key="s.name" class="source-item">
              <span class="source-name">{{ s.name }}</span>
              <div class="source-bar-bg">
                <div class="source-bar-fill" :style="{ width: s.percent + '%', background: s.color }" />
              </div>
              <span class="source-pct" :style="{ color: s.color }">{{ s.percent }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- 客户画像 -->
        <div class="card">
          <div class="card-title">客户画像</div>
          <div class="segment-list">
            <div v-for="s in data.customerSegments" :key="s.segment" class="segment-item">
              <div class="seg-head">
                <span class="seg-dot" :style="{ background: s.color }" />
                <span class="seg-name">{{ s.segment }}</span>
                <span class="seg-pct" :style="{ color: s.color }">{{ s.percent }}%</span>
              </div>
              <div class="seg-detail">
                <span>均龄{{ s.avgAge }}岁</span>
                <span>预算{{ s.avgBudget }}万</span>
              </div>
              <div class="seg-bar">
                <div class="seg-fill" :style="{ width: s.percent + '%', background: s.color }" />
              </div>
            </div>
          </div>
        </div>

        <!-- 库存结构 -->
        <div class="card">
          <div class="card-title">库存结构</div>
          <div class="inv-list">
            <div v-for="inv in data.inventoryStructure" :key="inv.type" class="inv-item">
              <div class="inv-type">{{ inv.type }}</div>
              <div class="inv-bars">
                <div class="inv-bar sold" :style="{ width: (inv.sold / inv.total * 100) + '%' }">
                  <span v-if="inv.sold / inv.total > 0.15">{{ inv.sold }}</span>
                </div>
                <div class="inv-bar unsold" :style="{ width: (inv.unsold / inv.total * 100) + '%' }">
                  <span v-if="inv.unsold / inv.total > 0.15">{{ inv.unsold }}</span>
                </div>
              </div>
              <div class="inv-meta">共{{ inv.total }}套 · 未售{{ inv.unsold }}套</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 3D模式 -->
    <template v-else>
      <div class="two-col-3d">
        <div class="card card-3d-chart">
          <div class="card-title">销售漏斗 3D</div>
          <Funnel3D :stages="data.funnel" />
        </div>
        <div class="card card-3d-chart">
          <div class="card-title">客户来源 3D</div>
          <Bar3DChart :data="sourceBarData" height="100%" />
        </div>
      </div>
      <div class="two-col-3d">
        <div class="card card-3d-chart">
          <div class="card-title">客户画像 3D</div>
          <Scatter3DChart :data="customerScatterData" xAxisLabel="预算(万)" yAxisLabel="年龄" zAxisLabel="占比%" height="100%" />
        </div>
        <div class="card card-3d-chart">
          <div class="card-title">库存结构 3D</div>
          <Bar3DChart :data="inventoryBarData" height="100%" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PROJECT_LIST } from '@/utils/mockData'
import { generateProjectDeepData, type ProjectDeepData } from '@/utils/pageMockData'
import Funnel3D from '@/components/charts/Funnel3D.vue'
import Bar3DChart from '@/components/charts/Bar3DChart.vue'
import Scatter3DChart from '@/components/charts/Scatter3DChart.vue'
import PeriodSelector from '@/components/common/PeriodSelector.vue'

const props = withDefaults(defineProps<{ viewMode?: '2d' | '3d'; period?: 'day' | 'week' | 'month' | 'year' }>(), { viewMode: '2d', period: 'month' })

const localPeriod = ref<'day' | 'week' | 'month' | 'year'>(props.period || 'month')
watch(() => props.period, v => { if (v) localPeriod.value = v })

const selectedProject = ref(PROJECT_LIST[0].name)
const data = ref<ProjectDeepData>(generateProjectDeepData(selectedProject.value))

watch(selectedProject, (v) => { data.value = generateProjectDeepData(v) })

const severity = computed(() => {
  const s = data.value.aiDiagnosis.score
  return s >= 70 ? 'good' : s >= 45 ? 'warn' : 'danger'
})

function severityLabel(s: string) {
  const m: Record<string, string> = { danger: '严重', warn: '预警', info: '正常' }
  return m[s] || s
}

const sourceBarData = computed(() => data.value.customerSources.map(s => ({ name: s.name, value: s.percent, color: s.color })))
const customerScatterData = computed(() => data.value.customerSegments.map(s => ({ name: s.segment, x: s.avgBudget, y: s.avgAge, z: s.percent, size: s.percent, category: s.segment })))
const inventoryBarData = computed(() => data.value.inventoryStructure.map(inv => ({ name: inv.type, value: inv.unsold, color: inv.unsold / inv.total > 0.4 ? '#ff4757' : inv.unsold / inv.total > 0.25 ? '#ffab00' : '#00d68f' })))
</script>

<style scoped lang="scss">
.page { height: 100%; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; background: var(--bg, #0F1217); color: var(--text-body, #cbd5e1); }

.page-toolbar { display: flex; align-items: center; gap: 10px; }

.project-select {
  background: var(--card-bg, #161B22); border: 1px solid var(--border, rgba(255,255,255,0.06));
  border-radius: 8px; padding: 8px 14px; color: var(--text-title, #e2e8f0);
  font-size: 13px; font-weight: 600; outline: none; cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: all 0.2s;
  &:hover { border-color: rgba(96,165,250,0.2); box-shadow: 0 0 8px rgba(96,165,250,0.12); }
  option { background: #1a1e28; }
}

.toolbar-tag { font-size: 11px; color: var(--text-caption, #64748b); background: var(--card-bg, #161B22); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border, rgba(255,255,255,0.06)); }
.toolbar-mode { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: var(--primary, #60a5fa); background: var(--primary-light, rgba(96,165,250,0.12)); padding: 3px 8px; border-radius: 4px; margin-left: auto; }

.ai-diagnosis {
  display: flex; gap: 16px; padding: 16px; border-radius: 10px;
  border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  &.score-good { border-left: 3px solid var(--success, #22C55E); }
  &.score-warn { border-left: 3px solid var(--warning, #F59E0B); }
  &.score-danger { border-left: 3px solid var(--danger, #EF4444); }
}

.ai-score { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; width: 70px; }
.score-ring {
  width: 56px; height: 56px; border-radius: 50%;
  background: conic-gradient(var(--primary, #60a5fa) var(--pct), var(--bar-track, rgba(255,255,255,0.05)) var(--pct));
  display: flex; align-items: center; justify-content: center;
  .score-val { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700; color: var(--text-title, #e2e8f0); background: var(--card-bg, #161B22); width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
}
.score-label { font-size: 10px; color: var(--text-caption, #64748b); }

.ai-problems { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.problem-item { padding: 10px 12px; border-radius: 8px; background: var(--surface, rgba(255,255,255,0.03)); transition: all 0.2s; &:hover { background: var(--surface-hover, rgba(255,255,255,0.06)); transform: translateX(2px); }
  &.sev-danger { border-left: 3px solid var(--danger, #EF4444); }
  &.sev-warn { border-left: 3px solid var(--warning, #F59E0B); }
  &.sev-info { border-left: 3px solid var(--primary, #60a5fa); }
}

.problem-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.problem-sev-tag { font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 3px; letter-spacing: 0.5px;
  .sev-danger & { background: var(--danger-light, rgba(239,68,68,0.15)); color: var(--danger, #EF4444); }
  .sev-warn & { background: var(--warning-light, rgba(245,158,11,0.15)); color: var(--warning, #F59E0B); }
  .sev-info & { background: var(--primary-light, rgba(96,165,250,0.12)); color: var(--primary, #60a5fa); }
}
.problem-title { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); }
.problem-body { display: flex; flex-direction: column; gap: 2px; }
.problem-row { font-size: 11px; color: var(--text-caption, #64748b); display: flex; gap: 6px; }
.row-label { color: var(--text-caption, #64748b); flex-shrink: 0; width: 30px; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.two-col-3d { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.card { padding: 14px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22); box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: all 0.3s; &:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.3); } }
.card-3d-chart { height: 240px; overflow: hidden; }
.card-title { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); margin-bottom: 12px; padding-left: 10px; border-left: 3px solid var(--primary, #60a5fa); }

.funnel-chart { display: flex; flex-direction: column; gap: 6px; }
.funnel-step { position: relative; }
.funnel-bar { height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; min-width: 60px; opacity: 0.85; transition: all 0.3s; &:hover { opacity: 1; transform: scaleX(1.02); } }
.funnel-name { font-size: 11px; color: rgba(255,255,255,0.9); font-weight: 500; }
.funnel-count { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: rgba(255,255,255,0.9); font-weight: 600; }
.funnel-rate { font-size: 10px; color: var(--info, #06b6d4); text-align: right; margin-top: 1px; }

.source-list { display: flex; flex-direction: column; gap: 8px; }
.source-item { display: flex; align-items: center; gap: 8px; padding: 2px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.source-name { font-size: 11px; color: var(--text-body, #cbd5e1); width: 50px; flex-shrink: 0; }
.source-bar-bg { flex: 1; height: 8px; background: var(--bar-track, rgba(255,255,255,0.05)); border-radius: 4px; overflow: hidden; }
.source-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
.source-pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; width: 36px; text-align: right; flex-shrink: 0; font-weight: 600; }

.segment-list { display: flex; flex-direction: column; gap: 10px; }
.segment-item { display: flex; flex-direction: column; gap: 3px; padding: 4px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; padding: 4px 6px; } }
.seg-head { display: flex; align-items: center; gap: 6px; }
.seg-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.seg-name { font-size: 12px; color: var(--text-title, #e2e8f0); font-weight: 500; }
.seg-pct { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; margin-left: auto; }
.seg-detail { font-size: 10px; color: var(--text-caption, #64748b); display: flex; gap: 10px; padding-left: 12px; }
.seg-bar { height: 4px; background: var(--bar-track, rgba(255,255,255,0.05)); border-radius: 2px; overflow: hidden; }
.seg-fill { height: 100%; border-radius: 2px; transition: width 0.4s; }

.inv-list { display: flex; flex-direction: column; gap: 10px; }
.inv-item { display: flex; flex-direction: column; gap: 3px; }
.inv-type { font-size: 12px; color: var(--text-body, #cbd5e1); font-weight: 500; }
.inv-bars { display: flex; height: 18px; border-radius: 4px; overflow: hidden; }
.inv-bar { display: flex; align-items: center; justify-content: center; font-size: 9px; color: rgba(255,255,255,0.8); transition: width 0.4s;
  &.sold { background: var(--success, #22C55E); opacity: 0.7; }
  &.unsold { background: var(--danger, #EF4444); opacity: 0.5; }
}
.inv-meta { font-size: 10px; color: var(--text-caption, #64748b); }

@media (max-width: 768px) {
  .two-col, .two-col-3d { grid-template-columns: 1fr; }
}
</style>

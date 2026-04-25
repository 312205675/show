<template>
  <div class="page customer-page">
    <!-- 2D Mode -->
    <template v-if="viewMode !== '3d'">
      <!-- 客群分层总览 -->
      <div class="seg-overview">
        <div v-for="seg in profiles" :key="seg.segment" class="seg-card">
          <div class="seg-header">
            <span class="seg-dot" :style="{ background: seg.color, boxShadow: `0 0 6px ${seg.color}40` }" />
            <span class="seg-name">{{ seg.segment }}</span>
            <span class="seg-pct" :style="{ color: seg.color }">{{ seg.percent }}%</span>
          </div>
          <div class="seg-body">
            <div class="seg-stat">
              <span class="stat-val">{{ seg.count }}</span>
              <span class="stat-lbl">客户数</span>
            </div>
            <div class="seg-stat">
              <span class="stat-val">{{ seg.avgBudget }}万</span>
              <span class="stat-lbl">均预算</span>
            </div>
            <div class="seg-stat">
              <span class="stat-val">{{ seg.avgAge }}岁</span>
              <span class="stat-lbl">均龄</span>
            </div>
          </div>
          <div class="seg-meta">
            <span>来源: {{ seg.topSource }}</span>
            <span>偏好: {{ seg.preferredType }}</span>
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- 年龄分布 -->
        <div class="card">
          <div class="card-title">年龄分布</div>
          <div class="age-chart">
            <div class="age-bars">
              <div v-for="age in ageDist" :key="age.range" class="age-group">
                <span class="age-label">{{ age.range }}</span>
                <div class="age-bar-pair">
                  <div class="age-bar male" :style="{ width: (age.male / maxAgeVal * 100) + '%' }">
                    <span class="bar-text">♂{{ age.male }}</span>
                  </div>
                  <div class="age-bar female" :style="{ width: (age.female / maxAgeVal * 100) + '%' }">
                    <span class="bar-text">♀{{ age.female }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 偏好分析 -->
        <div class="card">
          <div class="card-title">户型/面积偏好</div>
          <div class="pref-list">
            <div v-for="p in preferences" :key="p.name" class="pref-item">
              <span class="pref-name">{{ p.name }}</span>
              <div class="pref-bar-bg">
                <div class="pref-bar-fill" :style="{ width: p.percent + '%', background: p.color }" />
              </div>
              <span class="pref-pct" :style="{ color: p.color }">{{ p.percent }}%</span>
            </div>
          </div>
          <div class="card-title" style="margin-top: 16px">区域偏好</div>
          <div class="pref-list">
            <div v-for="a in areaPrefs" :key="a.name" class="pref-item">
              <span class="pref-name">{{ a.name }}</span>
              <div class="pref-bar-bg">
                <div class="pref-bar-fill" :style="{ width: a.percent + '%', background: a.color }" />
              </div>
              <span class="pref-pct" :style="{ color: a.color }">{{ a.percent }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户来源对比 -->
      <div class="card">
        <div class="card-title">客户来源渠道对比</div>
        <div class="source-compare">
          <div v-for="s in sourceCompare" :key="s.name" class="sc-item">
            <span class="sc-name">{{ s.name }}</span>
            <div class="sc-bar-bg">
              <div class="sc-bar-fill" :style="{ width: s.conversionRate + '%', background: s.color }" />
            </div>
            <span class="sc-rate">{{ s.conversionRate }}%</span>
            <span class="sc-cost">获客{{ s.cost }}元</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 3D Mode -->
    <template v-else>
      <div class="three-d-grid">
        <div class="td-card">
          <div class="card-title">客群3D分布</div>
          <Scatter3DChart :data="scatterData" x-axis-label="预算(万)" y-axis-label="年龄" z-axis-label="转化率(%)" height="100%" />
        </div>
        <div class="td-card">
          <div class="card-title">渠道转化率3D</div>
          <Bar3DChart :data="sourceBarData" height="100%" />
        </div>
      </div>
      <div class="three-d-row">
        <div class="td-card-sm" v-for="seg in profiles" :key="seg.segment">
          <div class="seg-dot" :style="{ background: seg.color }" />
          <span class="seg-name">{{ seg.segment }}</span>
          <span class="seg-pct" :style="{ color: seg.color }">{{ seg.percent }}%</span>
          <span class="td-meta">{{ seg.count }}人 / 均{{ seg.avgBudget }}万</span>
        </div>
      </div>
    </template>

    <!-- AI结论 -->
    <div class="ai-box">
      <div class="ai-icon">AI</div>
      <div class="ai-content">
        <div class="ai-title">客户诊断</div>
        <div class="ai-text">刚需首置占比38%为核心客群，改善置换客单价最高；抖音渠道获客成本低但转化率仅5.2%，建议优化直播话术；老带新转化率22%远超均值，建议加大激励。</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { generateCustomerProfiles, generateAgeDistribution, type CustomerProfile, type AgeDistribution } from '@/utils/pageMockData'
import Scatter3DChart from '@/components/charts/Scatter3DChart.vue'
import Bar3DChart from '@/components/charts/Bar3DChart.vue'

withDefaults(defineProps<{ viewMode?: '2d' | '3d' }>(), { viewMode: '2d' })

const profiles = ref<CustomerProfile[]>(generateCustomerProfiles())
const ageDist = ref<AgeDistribution[]>(generateAgeDistribution())

const maxAgeVal = computed(() => Math.max(...ageDist.value.flatMap(a => [a.male, a.female])))

const preferences = ref([
  { name: '80-100㎡', percent: 32, color: '#4a9eff' },
  { name: '100-130㎡', percent: 28, color: '#00d68f' },
  { name: '130-150㎡', percent: 18, color: '#ffab00' },
  { name: '150-200㎡', percent: 12, color: '#a78bfa' },
  { name: '商铺/其他', percent: 10, color: '#6b7590' },
])

const areaPrefs = ref([
  { name: '裕华区', percent: 28, color: '#4a9eff' },
  { name: '长安区', percent: 25, color: '#00d68f' },
  { name: '桥西区', percent: 20, color: '#ffab00' },
  { name: '新华区', percent: 15, color: '#a78bfa' },
  { name: '正定/栾城', percent: 12, color: '#00e5ff' },
])

const sourceCompare = ref([
  { name: '自渠', conversionRate: 18.5, cost: 320, color: '#4a9eff' },
  { name: '贝壳链家', conversionRate: 14.2, cost: 1800, color: '#00d68f' },
  { name: '安居客', conversionRate: 8.6, cost: 450, color: '#ffab00' },
  { name: '抖音直播', conversionRate: 5.2, cost: 180, color: '#a78bfa' },
  { name: '老带新', conversionRate: 22.0, cost: 800, color: '#00e5ff' },
  { name: '中介分销', conversionRate: 10.8, cost: 2200, color: '#f472b6' },
])

const scatterData = computed(() => profiles.value.map(p => ({
  name: p.segment, x: p.avgBudget, y: p.avgAge,
  z: Math.round(p.percent * 0.8 + Math.random() * 10),
  size: Math.max(8, p.count / 50), category: p.segment,
})))

const sourceBarData = computed(() => sourceCompare.value.map(s => ({
  name: s.name, value: s.conversionRate, color: s.color,
})))
</script>

<style scoped lang="scss">
.page { height: 100%; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; background: var(--bg, #0F1217); color: var(--text-body, #cbd5e1); }

.seg-overview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }

.seg-card {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border, rgba(255,255,255,0.06));
  background: var(--card-bg, #161B22);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 28px rgba(0,0,0,0.35);
    border-color: rgba(96, 165, 250, 0.12);
  }
}

.seg-header { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.seg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.seg-name { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); }
.seg-pct { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; margin-left: auto; }

.seg-body { display: flex; gap: 14px; margin-bottom: 8px; }
.seg-stat { display: flex; flex-direction: column; }
.stat-val { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--text-title, #e2e8f0); font-weight: 600; }
.stat-lbl { font-size: 9px; color: var(--text-caption, #64748b); letter-spacing: 0.5px; }

.seg-meta { font-size: 10px; color: var(--text-caption, #64748b); display: flex; gap: 8px; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.card {
  padding: 14px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06));
  background: var(--card-bg, #161B22); box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s; &:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
}
.card-title { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); margin-bottom: 12px; padding-left: 10px; border-left: 3px solid var(--primary, #60a5fa); }

.age-chart { display: flex; flex-direction: column; gap: 6px; }
.age-group { display: flex; align-items: center; gap: 6px; }
.age-label { font-size: 10px; color: var(--text-caption, #64748b); width: 32px; flex-shrink: 0; text-align: right; }
.age-bar-pair { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.age-bar {
  height: 14px; border-radius: 4px; min-width: 30px; display: flex; align-items: center; padding: 0 6px; transition: all 0.3s;
  &.male { background: rgba(96, 165, 250, 0.3); }
  &.female { background: rgba(244, 114, 182, 0.3); }
  &:hover { transform: scaleX(1.02); }
}
.bar-text { font-size: 9px; color: var(--text-body, #cbd5e1); font-family: 'JetBrains Mono', monospace; white-space: nowrap; }

.pref-list { display: flex; flex-direction: column; gap: 8px; }
.pref-item { display: flex; align-items: center; gap: 8px; padding: 2px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; padding: 2px 4px; } }
.pref-name { font-size: 11px; color: var(--text-body, #cbd5e1); width: 70px; flex-shrink: 0; }
.pref-bar-bg { flex: 1; height: 8px; background: var(--bar-track, rgba(255,255,255,0.05)); border-radius: 4px; overflow: hidden; }
.pref-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
.pref-pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; width: 36px; text-align: right; flex-shrink: 0; font-weight: 600; }

.source-compare { display: flex; flex-direction: column; gap: 8px; }
.sc-item { display: flex; align-items: center; gap: 8px; padding: 4px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.sc-name { font-size: 11px; color: var(--text-body, #cbd5e1); width: 60px; flex-shrink: 0; font-weight: 500; }
.sc-bar-bg { flex: 1; height: 10px; background: var(--bar-track, rgba(255,255,255,0.05)); border-radius: 5px; overflow: hidden; }
.sc-bar-fill { height: 100%; border-radius: 5px; transition: width 0.4s; }
.sc-rate { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--success, #22C55E); width: 45px; text-align: right; flex-shrink: 0; font-weight: 600; }
.sc-cost { font-size: 10px; color: var(--text-caption, #64748b); width: 65px; text-align: right; flex-shrink: 0; }

.ai-box { display: flex; gap: 10px; padding: 14px; border-radius: 10px; border: 1px solid var(--primary-light, rgba(96,165,250,0.12)); background: var(--primary-light, rgba(96,165,250,0.06)); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.ai-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--primary-light, rgba(96,165,250,0.12)); color: var(--primary, #60a5fa); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ai-content { flex: 1; }
.ai-title { font-size: 12px; font-weight: 600; color: var(--primary, #60a5fa); margin-bottom: 4px; }
.ai-text { font-size: 11px; color: var(--text-body, #cbd5e1); line-height: 1.7; }

// 3D mode
.three-d-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; flex: 1; min-height: 0; }
.td-card { padding: 10px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22); min-height: 220px; }
.three-d-row { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
.td-card-sm { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22); }
.td-meta { font-size: 10px; color: var(--text-caption, #64748b); }

@media (max-width: 768px) {
  .seg-overview { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .three-d-grid { grid-template-columns: 1fr; }
}
</style>

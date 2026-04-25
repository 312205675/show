<template>
  <div class="page inventory-page">
    <!-- 2D Mode -->
    <template v-if="viewMode !== '3d'">
      <!-- 库存总览 KPI -->
      <div class="inv-summary">
        <div class="sum-item warn">
          <span class="sum-val">{{ totalUnsold }}<small>套</small></span>
          <span class="sum-lbl">未售总套数</span>
        </div>
        <div class="sum-item">
          <span class="sum-val">{{ totalUnsoldValue.toFixed(1) }}<small>亿</small></span>
          <span class="sum-lbl">未售总货值</span>
        </div>
        <div class="sum-item">
          <span class="sum-val">{{ avgCycle.toFixed(1) }}<small>月</small></span>
          <span class="sum-lbl">平均去化周期</span>
        </div>
        <div class="sum-item danger">
          <span class="sum-val">{{ slowCount }}</span>
          <span class="sum-lbl">高风险项目</span>
        </div>
      </div>

      <!-- 库存排名 -->
      <div class="card">
        <div class="card-title">项目库存排名（按去化周期）</div>
        <div class="inv-table">
          <div class="it-header">
            <span>项目</span><span>区域</span><span>总套数</span><span>已售</span><span>未售</span><span>货值</span><span>去化率</span><span>周期</span><span>状态</span>
          </div>
          <div v-for="item in inventory" :key="item.projectName" class="it-row">
            <span class="it-name">{{ item.projectName }}</span>
            <span class="it-city">{{ item.city }}</span>
            <span>{{ item.totalUnits }}</span>
            <span>{{ item.soldUnits }}</span>
            <span class="it-unsold">{{ item.unsoldUnits }}</span>
            <span>{{ item.unsoldValue }}亿</span>
            <span class="it-rate" :class="item.status">{{ item.depletionRate }}%</span>
            <span class="it-cycle" :class="item.status">{{ item.depletionCycle }}月</span>
            <span class="it-status" :class="`st-${item.status}`">{{ statusLabel(item.status) }}</span>
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- 滞销房源 -->
        <div class="card">
          <div class="card-title">滞销房源 TOP</div>
          <div class="slow-list">
            <div v-for="(s, i) in slowItems.slice(0, 10)" :key="i" class="slow-item">
              <div class="slow-head">
                <span class="slow-proj">{{ s.projectName }}</span>
                <span class="slow-days" :class="s.daysOnMarket > 300 ? 'danger' : 'warn'">{{ s.daysOnMarket }}天</span>
              </div>
              <div class="slow-body">
                <span>{{ s.buildingNo }} {{ s.floor }}</span>
                <span>{{ s.unitType }} {{ s.area }}㎡</span>
                <span>{{ s.price }}元/㎡</span>
              </div>
              <div class="slow-reason">原因: {{ s.reason }}</div>
            </div>
          </div>
        </div>

        <!-- 定价建议 -->
        <div class="card">
          <div class="card-title">定价建议</div>
          <div class="price-list">
            <div v-for="item in inventory" :key="item.projectName" class="price-item">
              <span class="price-name">{{ item.projectName }}</span>
              <div class="price-row">
                <span class="price-cur">当前 {{ item.avgPrice }}</span>
                <span class="price-arrow" :class="item.priceChange > 0 ? 'up' : 'down'">→</span>
                <span class="price-sug" :class="item.priceChange > 0 ? 'up' : 'down'">建议 {{ item.suggestedPrice }}</span>
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
          <div class="card-title">库存去化3D对比</div>
          <Bar3DChart :data="inventoryBarData" height="100%" />
        </div>
        <div class="td-card">
          <div class="card-title">货值×周期3D分析</div>
          <Scatter3DChart :data="inventoryScatterData" x-axis-label="去化周期(月)" y-axis-label="货值(亿)" z-axis-label="去化率(%)" height="100%" />
        </div>
      </div>
      <div class="td-kpi-row">
        <div class="sum-item warn"><span class="sum-val">{{ totalUnsold }}<small>套</small></span><span class="sum-lbl">未售总套数</span></div>
        <div class="sum-item"><span class="sum-val">{{ totalUnsoldValue.toFixed(1) }}<small>亿</small></span><span class="sum-lbl">未售总货值</span></div>
        <div class="sum-item"><span class="sum-val">{{ avgCycle.toFixed(1) }}<small>月</small></span><span class="sum-lbl">平均去化周期</span></div>
        <div class="sum-item danger"><span class="sum-val">{{ slowCount }}</span><span class="sum-lbl">高风险项目</span></div>
      </div>
    </template>

    <!-- AI结论 -->
    <div class="ai-box">
      <div class="ai-icon">AI</div>
      <div class="ai-content">
        <div class="ai-title">库存诊断</div>
        <div class="ai-text">正定新区与栾城区库存去化周期超24个月，风险较高。建议：①翡翠城下调定价5-8%以加速去化；②御河上院启动特价房+公积金合作；③海棠苑可考虑打包转让部分库存回收资金。裕华区项目经营健康，可适度加推新房源。</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { generateInventory, generateSlowMoving, type InventoryItem } from '@/utils/pageMockData'
import Bar3DChart from '@/components/charts/Bar3DChart.vue'
import Scatter3DChart from '@/components/charts/Scatter3DChart.vue'

withDefaults(defineProps<{ viewMode?: '2d' | '3d' }>(), { viewMode: '2d' })

const inventory = ref<InventoryItem[]>(generateInventory())
const slowItems = ref(generateSlowMoving())

const totalUnsold = computed(() => inventory.value.reduce((s, i) => s + i.unsoldUnits, 0))
const totalUnsoldValue = computed(() => inventory.value.reduce((s, i) => s + i.unsoldValue, 0))
const avgCycle = computed(() => inventory.value.reduce((s, i) => s + i.depletionCycle, 0) / inventory.value.length)
const slowCount = computed(() => inventory.value.filter(i => i.status === 'red').length)

function statusLabel(s: string) {
  const m: Record<string, string> = { green: '健康', yellow: '关注', red: '高危' }
  return m[s] || s
}

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
.page { height: 100%; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; background: var(--bg, #0F1217); color: var(--text-body, #cbd5e1); }

.inv-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.sum-item {
  text-align: center; padding: 14px 10px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06));
  background: var(--card-bg, #161B22); box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); cursor: default;
  &:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  &.warn { border-top: 2px solid var(--warning, #F59E0B); }
  &.danger { border-top: 2px solid var(--danger, #EF4444); }
}
.sum-val { display: block; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; color: var(--primary, #60a5fa); small { font-size: 12px; opacity: 0.7; font-weight: 500; } }
.sum-lbl { display: block; font-size: 10px; color: var(--text-caption, #64748b); margin-top: 4px; letter-spacing: 0.5px; }

.card { padding: 14px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22); box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: all 0.3s; &:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.3); } }
.card-title { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); margin-bottom: 12px; padding-left: 10px; border-left: 3px solid var(--primary, #60a5fa); }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.inv-table { display: flex; flex-direction: column; gap: 2px; }
.it-header { display: grid; grid-template-columns: 100px 50px 45px 40px 40px 50px 50px 45px 40px; font-size: 9px; color: var(--text-caption, #64748b); padding: 4px 0; border-bottom: 1px solid var(--border, rgba(255,255,255,0.06)); }
.it-row { display: grid; grid-template-columns: 100px 50px 45px 40px 40px 50px 50px 45px 40px; font-size: 10px; color: var(--text-body, #cbd5e1); padding: 4px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.it-name { color: var(--text-title, #e2e8f0); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.it-city { color: var(--text-caption, #64748b); }
.it-unsold { color: var(--warning, #F59E0B); font-weight: 600; }
.it-rate, .it-cycle { font-family: 'JetBrains Mono', monospace; font-weight: 600; &.green { color: var(--success, #22C55E); } &.yellow { color: var(--warning, #F59E0B); } &.red { color: var(--danger, #EF4444); } }
.it-status { font-size: 9px; font-weight: 600; padding: 2px 5px; border-radius: 3px; text-align: center;
  &.st-green { background: var(--success-light, rgba(34,197,94,0.15)); color: var(--success, #22C55E); }
  &.st-yellow { background: var(--warning-light, rgba(245,158,11,0.15)); color: var(--warning, #F59E0B); }
  &.st-red { background: var(--danger-light, rgba(239,68,68,0.15)); color: var(--danger, #EF4444); }
}

.slow-list { display: flex; flex-direction: column; gap: 6px; }
.slow-item { padding: 8px 10px; border-radius: 6px; background: var(--surface, rgba(255,255,255,0.03)); border-left: 3px solid var(--warning, #F59E0B); transition: all 0.2s; &:hover { background: var(--surface-hover, rgba(255,255,255,0.06)); transform: translateX(2px); } }
.slow-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
.slow-proj { font-size: 11px; color: var(--text-title, #e2e8f0); font-weight: 600; }
.slow-days { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; &.danger { color: var(--danger, #EF4444); } &.warn { color: var(--warning, #F59E0B); } }
.slow-body { font-size: 10px; color: var(--text-caption, #64748b); display: flex; gap: 8px; }
.slow-reason { font-size: 10px; color: var(--text-caption, #64748b); margin-top: 2px; }

.price-list { display: flex; flex-direction: column; gap: 6px; }
.price-item { padding: 8px 10px; border-radius: 6px; background: var(--surface, rgba(255,255,255,0.03)); transition: all 0.2s; &:hover { background: var(--surface-hover, rgba(255,255,255,0.06)); } }
.price-name { font-size: 12px; color: var(--text-title, #e2e8f0); font-weight: 600; display: block; margin-bottom: 4px; }
.price-row { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.price-cur { color: var(--text-caption, #64748b); }
.price-arrow { color: var(--text-caption, #64748b); }
.price-sug { font-weight: 600; &.up { color: var(--success, #22C55E); } &.down { color: var(--danger, #EF4444); } }
.price-pct { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; &.up { color: var(--success, #22C55E); } &.down { color: var(--danger, #EF4444); } margin-left: auto; }

.ai-box { display: flex; gap: 10px; padding: 14px; border-radius: 10px; border: 1px solid var(--primary-light, rgba(96,165,250,0.12)); background: var(--primary-light, rgba(96,165,250,0.06)); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.ai-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--primary-light, rgba(96,165,250,0.12)); color: var(--primary, #60a5fa); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ai-content { flex: 1; }
.ai-title { font-size: 12px; font-weight: 600; color: var(--primary, #60a5fa); margin-bottom: 4px; }
.ai-text { font-size: 11px; color: var(--text-body, #cbd5e1); line-height: 1.7; }

.three-d-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; flex: 1; min-height: 0; }
.td-card { padding: 10px; border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.06)); background: var(--card-bg, #161B22); min-height: 220px; }
.td-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; flex-shrink: 0; }

@media (max-width: 768px) {
  .inv-summary { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .td-kpi-row { grid-template-columns: repeat(2, 1fr); }
  .three-d-grid { grid-template-columns: 1fr; }
}
</style>

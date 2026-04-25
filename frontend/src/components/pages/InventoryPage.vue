<template>
  <div class="page inventory-page">
    <!-- 2D Mode -->
    <template v-if="viewMode !== '3d'">
      <!-- 库存总览 KPI - 醒目大字体 -->
      <div class="inv-summary">
        <div class="sum-item warn glow-card">
          <div class="sum-icon-wrap warn-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>
          </div>
          <span class="sum-val">{{ totalUnsold }}<small>套</small></span>
          <span class="sum-lbl">未售总套数</span>
          <div class="sum-glow" />
        </div>
        <div class="sum-item glow-card">
          <div class="sum-icon-wrap blue-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <span class="sum-val blue">{{ totalUnsoldValue.toFixed(1) }}<small>亿</small></span>
          <span class="sum-lbl">未售总货值</span>
          <div class="sum-glow blue-glow" />
        </div>
        <div class="sum-item glow-card">
          <div class="sum-icon-wrap cyan-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <span class="sum-val cyan">{{ avgCycle.toFixed(1) }}<small>月</small></span>
          <span class="sum-lbl">平均去化周期</span>
          <div class="sum-glow cyan-glow" />
        </div>
        <div class="sum-item danger glow-card pulse-card">
          <div class="sum-icon-wrap danger-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <span class="sum-val red">{{ slowCount }}</span>
          <span class="sum-lbl">高风险项目</span>
          <div class="sum-glow danger-glow" />
        </div>
      </div>

      <!-- 库存排名 -->
      <div class="card neon-card">
        <div class="card-title neon-title">
          <span class="nt-icon">📊</span>
          项目库存排名（按去化周期）
        </div>
        <div class="inv-table">
          <div class="it-header">
            <span>项目</span><span>区域</span><span>总套数</span><span>已售</span><span>未售</span><span>货值</span><span>去化率</span><span>周期</span><span>状态</span>
          </div>
          <div v-for="item in inventory" :key="item.projectName" class="it-row" :class="`row-${item.status}`">
            <span class="it-name">{{ item.projectName }}</span>
            <span class="it-city">{{ item.city }}</span>
            <span class="it-num">{{ item.totalUnits }}</span>
            <span class="it-num">{{ item.soldUnits }}</span>
            <span class="it-unsold">{{ item.unsoldUnits }}</span>
            <span class="it-num">{{ item.unsoldValue }}亿</span>
            <span class="it-rate" :class="item.status">{{ item.depletionRate }}%</span>
            <span class="it-cycle" :class="item.status">{{ item.depletionCycle }}月</span>
            <span class="it-status" :class="`st-${item.status}`">{{ statusLabel(item.status) }}</span>
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- 滞销房源 -->
        <div class="card neon-card">
          <div class="card-title neon-title">
            <span class="nt-icon">⏳</span>
            滞销房源 TOP
          </div>
          <div class="slow-list">
            <div v-for="(s, i) in slowItems.slice(0, 10)" :key="i" class="slow-item" :class="s.daysOnMarket > 300 ? 'danger-row' : 'warn-row'">
              <div class="slow-head">
                <span class="slow-proj">{{ s.projectName }}</span>
                <span class="slow-days" :class="s.daysOnMarket > 300 ? 'danger' : 'warn'">{{ s.daysOnMarket }}天</span>
              </div>
              <div class="slow-body">
                <span>{{ s.buildingNo }} {{ s.floor }}</span>
                <span>{{ s.unitType }} {{ s.area }}㎡</span>
                <span class="slow-price">¥{{ s.price }}/㎡</span>
              </div>
              <div class="slow-reason">原因: {{ s.reason }}</div>
            </div>
          </div>
        </div>

        <!-- 定价建议 -->
        <div class="card neon-card">
          <div class="card-title neon-title">
            <span class="nt-icon">💡</span>
            定价建议
          </div>
          <div class="price-list">
            <div v-for="item in inventory" :key="item.projectName" class="price-item" :class="item.priceChange <= 0 ? 'price-down' : 'price-up'">
              <span class="price-name">{{ item.projectName }}</span>
              <div class="price-row">
                <span class="price-cur">当前 ¥{{ item.avgPrice }}</span>
                <span class="price-arrow" :class="item.priceChange > 0 ? 'up' : 'down'">→</span>
                <span class="price-sug" :class="item.priceChange > 0 ? 'up' : 'down'">建议 ¥{{ item.suggestedPrice }}</span>
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
          <div class="card-title neon-title"><span class="nt-icon">📊</span>库存去化3D对比</div>
          <Bar3DChart :data="inventoryBarData" height="100%" />
        </div>
        <div class="td-card">
          <div class="card-title neon-title"><span class="nt-icon">🔬</span>货值×周期3D分析</div>
          <Scatter3DChart :data="inventoryScatterData" x-axis-label="去化周期(月)" y-axis-label="货值(亿)" z-axis-label="去化率(%)" height="100%" />
        </div>
      </div>
      <div class="td-kpi-row">
        <div class="sum-item warn glow-card"><span class="sum-val">{{ totalUnsold }}<small>套</small></span><span class="sum-lbl">未售总套数</span></div>
        <div class="sum-item glow-card"><span class="sum-val blue">{{ totalUnsoldValue.toFixed(1) }}<small>亿</small></span><span class="sum-lbl">未售总货值</span></div>
        <div class="sum-item glow-card"><span class="sum-val cyan">{{ avgCycle.toFixed(1) }}<small>月</small></span><span class="sum-lbl">平均去化周期</span></div>
        <div class="sum-item danger glow-card pulse-card"><span class="sum-val red">{{ slowCount }}</span><span class="sum-lbl">高风险项目</span></div>
      </div>
    </template>

    <!-- AI结论 -->
    <div class="ai-box neon-ai">
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
.page { height: 100%; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 12px; background: var(--bg, #0F1217); color: var(--text-body, #cbd5e1); }

// ===== 醒目 KPI =====
.inv-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

.glow-card {
  text-align: center; padding: 20px 14px; border-radius: 14px; border: 1px solid var(--border, rgba(255,255,255,0.08));
  background: var(--card-bg, #161B22); position: relative; overflow: hidden; cursor: default;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);

  &:hover {
    transform: perspective(800px) translateY(-6px) scale(1.05) rotateX(3deg);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    z-index: 2;
  }

  &.warn { border-color: rgba(245, 158, 11, 0.3); }
  &.danger { border-color: rgba(239, 68, 68, 0.4); }
}

.sum-icon-wrap {
  width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 10px; position: relative; z-index: 2;
  &.warn-icon { background: rgba(245, 158, 11, 0.12); color: #F59E0B; }
  &.blue-icon { background: rgba(96, 165, 250, 0.12); color: #60a5fa; }
  &.cyan-icon { background: rgba(6, 182, 212, 0.12); color: #06b6d4; }
  &.danger-icon { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
}

.sum-val {
  display: block; font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 800;
  color: var(--primary, #60a5fa); position: relative; z-index: 2; line-height: 1.2;
  letter-spacing: -0.5px;
  small { font-size: 16px; opacity: 0.6; font-weight: 600; margin-left: 2px; }
  &.blue { color: #60a5fa; text-shadow: 0 0 20px rgba(96,165,250,0.3); }
  &.cyan { color: #06b6d4; text-shadow: 0 0 20px rgba(6,182,212,0.3); }
  &.red { color: #EF4444; text-shadow: 0 0 20px rgba(239,68,68,0.4); }
}
.sum-lbl { display: block; font-size: 12px; color: var(--text-caption, #64748b); margin-top: 6px; letter-spacing: 1px; font-weight: 600; position: relative; z-index: 2; text-transform: uppercase; }

.sum-glow {
  position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); width: 80%; height: 40px;
  background: radial-gradient(ellipse, rgba(96,165,250,0.15) 0%, transparent 70%); pointer-events: none;
  &.blue-glow { background: radial-gradient(ellipse, rgba(96,165,250,0.15) 0%, transparent 70%); }
  &.cyan-glow { background: radial-gradient(ellipse, rgba(6,182,212,0.15) 0%, transparent 70%); }
  &.danger-glow { background: radial-gradient(ellipse, rgba(239,68,68,0.2) 0%, transparent 70%); }
}

.pulse-card {
  animation: dangerPulse 3s ease-in-out infinite;
}
@keyframes dangerPulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 0 rgba(239,68,68,0); }
  50% { box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 30px rgba(239,68,68,0.15); }
}

// ===== Neon Cards =====
.neon-card {
  padding: 16px; border-radius: 14px; border: 1px solid rgba(96,165,250,0.12);
  background: var(--card-bg, #161B22); position: relative; overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: rgba(96,165,250,0.25);
    box-shadow: 0 8px 30px rgba(0,0,0,0.4), 0 0 40px rgba(96,165,250,0.06);
  }

  &::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--primary, #60a5fa), transparent);
    opacity: 0.6;
  }
}

.card-title { font-size: 15px; font-weight: 700; color: var(--text-title, #e2e8f0); margin-bottom: 14px; padding-left: 12px; border-left: 3px solid var(--primary, #60a5fa); letter-spacing: 0.5px; }
.neon-title {
  display: flex; align-items: center; gap: 6px;
  .nt-icon { font-size: 16px; }
}
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

// ===== Inventory Table =====
.inv-table { display: flex; flex-direction: column; gap: 3px; }
.it-header { display: grid; grid-template-columns: 1.4fr 0.7fr 0.6fr 0.5fr 0.6fr 0.7fr 0.7fr 0.6fr 0.6fr; font-size: 11px; color: var(--text-caption, #64748b); padding: 6px 0; border-bottom: 1px solid rgba(96,165,250,0.1); gap: 4px; font-weight: 600; letter-spacing: 0.3px; }
.it-row {
  display: grid; grid-template-columns: 1.4fr 0.7fr 0.6fr 0.5fr 0.6fr 0.7fr 0.7fr 0.6fr 0.6fr;
  font-size: 12px; color: var(--text-body, #cbd5e1); padding: 8px 4px; gap: 4px;
  transition: all 0.25s; border-radius: 6px; border-left: 3px solid transparent;

  &:hover { background: var(--surface, rgba(255,255,255,0.04)); transform: translateX(2px); }

  &.row-red { border-left-color: var(--danger, #EF4444); background: rgba(239,68,68,0.04); }
  &.row-yellow { border-left-color: var(--warning, #F59E0B); background: rgba(245,158,11,0.03); }
  &.row-green { border-left-color: var(--success, #22C55E); }
}
.it-name { color: var(--text-title, #e2e8f0); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
.it-city { color: var(--text-caption, #64748b); }
.it-num { font-family: 'JetBrains Mono', monospace; }
.it-unsold { color: var(--warning, #F59E0B); font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 13px; text-shadow: 0 0 8px rgba(245,158,11,0.2); }
.it-rate, .it-cycle {
  font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px;
  &.green { color: var(--success, #22C55E); text-shadow: 0 0 8px rgba(34,197,94,0.2); }
  &.yellow { color: var(--warning, #F59E0B); text-shadow: 0 0 8px rgba(245,158,11,0.2); }
  &.red { color: var(--danger, #EF4444); text-shadow: 0 0 8px rgba(239,68,68,0.3); }
}
.it-status {
  font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-align: center; letter-spacing: 0.5px;
  &.st-green { background: rgba(34,197,94,0.15); color: var(--success, #22C55E); box-shadow: 0 0 8px rgba(34,197,94,0.1); }
  &.st-yellow { background: rgba(245,158,11,0.15); color: var(--warning, #F59E0B); box-shadow: 0 0 8px rgba(245,158,11,0.1); }
  &.st-red { background: rgba(239,68,68,0.15); color: var(--danger, #EF4444); box-shadow: 0 0 10px rgba(239,68,68,0.15); animation: statusPulse 2s ease-in-out infinite; }
}
@keyframes statusPulse {
  0%, 100% { box-shadow: 0 0 8px rgba(239,68,68,0.1); }
  50% { box-shadow: 0 0 16px rgba(239,68,68,0.25); }
}

// ===== Slow Items =====
.slow-list { display: flex; flex-direction: column; gap: 6px; }
.slow-item {
  padding: 10px 12px; border-radius: 8px; background: var(--surface, rgba(255,255,255,0.03));
  transition: all 0.3s; border-left: 3px solid var(--warning, #F59E0B);
  &:hover { background: var(--surface-hover, rgba(255,255,255,0.06)); transform: translateX(3px) scale(1.01); }
  &.danger-row { border-left-color: var(--danger, #EF4444); background: rgba(239,68,68,0.04); }
  &.warn-row { border-left-color: var(--warning, #F59E0B); }
}
.slow-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.slow-proj { font-size: 13px; color: var(--text-title, #e2e8f0); font-weight: 700; }
.slow-days {
  font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800;
  &.danger { color: var(--danger, #EF4444); text-shadow: 0 0 12px rgba(239,68,68,0.3); }
  &.warn { color: var(--warning, #F59E0B); text-shadow: 0 0 12px rgba(245,158,11,0.3); }
}
.slow-body { font-size: 12px; color: var(--text-caption, #64748b); display: flex; gap: 10px; }
.slow-price { color: var(--primary, #60a5fa); font-weight: 600; }
.slow-reason { font-size: 11px; color: var(--text-caption, #64748b); margin-top: 3px; }

// ===== Price Suggestions =====
.price-list { display: flex; flex-direction: column; gap: 6px; }
.price-item {
  padding: 10px 12px; border-radius: 8px; background: var(--surface, rgba(255,255,255,0.03));
  transition: all 0.3s; border-left: 3px solid transparent;
  &:hover { background: var(--surface-hover, rgba(255,255,255,0.06)); transform: translateX(2px); }
  &.price-down { border-left-color: var(--danger, #EF4444); background: rgba(239,68,68,0.03); }
  &.price-up { border-left-color: var(--success, #22C55E); background: rgba(34,197,94,0.03); }
}
.price-name { font-size: 14px; color: var(--text-title, #e2e8f0); font-weight: 700; display: block; margin-bottom: 6px; }
.price-row { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; }
.price-cur { color: var(--text-caption, #64748b); }
.price-arrow { font-size: 16px; font-weight: 800; &.up { color: var(--success, #22C55E); } &.down { color: var(--danger, #EF4444); } }
.price-sug {
  font-weight: 700; font-size: 14px;
  &.up { color: var(--success, #22C55E); text-shadow: 0 0 10px rgba(34,197,94,0.3); }
  &.down { color: var(--danger, #EF4444); text-shadow: 0 0 10px rgba(239,68,68,0.3); }
}
.price-pct {
  font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 15px;
  padding: 2px 8px; border-radius: 4px;
  &.up { background: rgba(34,197,94,0.15); color: var(--success, #22C55E); }
  &.down { background: rgba(239,68,68,0.15); color: var(--danger, #EF4444); }
  margin-left: auto;
}

// ===== AI Box =====
.neon-ai {
  display: flex; gap: 12px; padding: 16px; border-radius: 14px;
  border: 1px solid rgba(96,165,250,0.2);
  background: linear-gradient(135deg, rgba(96,165,250,0.08), rgba(99,102,241,0.04));
  box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 30px rgba(96,165,250,0.06);
  position: relative; overflow: hidden;

  &::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--primary, #60a5fa), transparent);
  }
}
.ai-icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: rgba(96,165,250,0.15); color: var(--primary, #60a5fa);
  font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 0 15px rgba(96,165,250,0.15);
}
.ai-content { flex: 1; }
.ai-title { font-size: 14px; font-weight: 700; color: var(--primary, #60a5fa); margin-bottom: 6px; letter-spacing: 0.5px; }
.ai-text { font-size: 13px; color: var(--text-body, #cbd5e1); line-height: 1.8; }

// ===== 3D Mode =====
.three-d-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; flex: 1; min-height: 0; }
.td-card {
  padding: 10px; border-radius: 14px; border: 1px solid rgba(96,165,250,0.12);
  background: var(--card-bg, #161B22); min-height: 220px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--primary, #60a5fa), transparent); opacity: 0.4; }
}
.td-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; flex-shrink: 0; }

@media (max-width: 768px) {
  .inv-summary { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .td-kpi-row { grid-template-columns: repeat(2, 1fr); }
  .three-d-grid { grid-template-columns: 1fr; }
  .sum-val { font-size: 24px; }
}
</style>

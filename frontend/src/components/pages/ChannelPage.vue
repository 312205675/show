<template>
  <div class="page channel-page">
    <!-- 渠道总览 KPI -->
    <div class="channel-summary">
      <div class="sum-item highlight">
        <span class="sum-val">{{ totalSales.toFixed(1) }}<small>亿</small></span>
        <span class="sum-lbl">渠道总销售额</span>
      </div>
      <div class="sum-item">
        <span class="sum-val">{{ totalDeals }}<small>套</small></span>
        <span class="sum-lbl">渠道总成交</span>
      </div>
      <div class="sum-item">
        <span class="sum-val">{{ avgConversion.toFixed(1) }}<small>%</small></span>
        <span class="sum-lbl">平均转化率</span>
      </div>
      <div class="sum-item">
        <span class="sum-val">{{ avgROI.toFixed(1) }}</span>
        <span class="sum-lbl">平均ROI</span>
      </div>
    </div>

    <!-- 2D模式 -->
    <template v-if="viewMode === '2d'">
      <!-- 渠道贡献图 -->
      <div class="card">
        <div class="card-title">渠道销售额贡献</div>
        <div class="channel-bars">
          <div v-for="ch in channels" :key="ch.name" class="ch-row">
            <span class="ch-name">{{ ch.name }}</span>
            <span class="ch-type" :class="`type-${ch.type}`">{{ ch.type }}</span>
            <div class="ch-bar-bg">
              <div class="ch-bar-fill" :style="{ width: (ch.salesAmount / maxSales * 100) + '%', background: ch.color }" />
            </div>
            <span class="ch-val" :style="{ color: ch.color }">{{ ch.salesAmount }}亿</span>
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- 渠道综合能力雷达图 -->
        <div class="card">
          <div class="card-title">渠道综合能力</div>
          <div class="radar-chart-area">
            <ChartWrapper :option="radarOption" height="100%" />
          </div>
        </div>

        <!-- 转化率 & ROI 双轴排名 -->
        <div class="card">
          <div class="card-title">转化率 × ROI 对比</div>
          <div class="dual-rank-list">
            <div v-for="(ch, i) in channels" :key="ch.name" class="dual-rank-item">
              <span class="dr-name">{{ ch.name }}</span>
              <div class="dr-bars">
                <div class="dr-bar-row">
                  <span class="dr-bar-label">转化</span>
                  <div class="dr-bar-bg">
                    <div class="dr-bar-fill conv" :style="{ width: ch.conversionRate + '%' }" />
                  </div>
                  <span class="dr-bar-val">{{ ch.conversionRate }}%</span>
                </div>
                <div class="dr-bar-row">
                  <span class="dr-bar-label">ROI</span>
                  <div class="dr-bar-bg">
                    <div class="dr-bar-fill roi" :style="{ width: (ch.roi / maxROI * 100) + '%' }" />
                  </div>
                  <span class="dr-bar-val">{{ ch.roi }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 获客成本 -->
      <div class="card">
        <div class="card-title">获客成本 vs 趋势</div>
        <div class="cost-table">
          <div class="cost-header">
            <span>渠道</span><span>获客成本</span><span>成交数</span><span>环比趋势</span>
          </div>
          <div v-for="ch in channels" :key="ch.name" class="cost-row">
            <span class="cost-name">{{ ch.name }}</span>
            <span class="cost-cpc">{{ ch.costPerCustomer }}元</span>
            <span>{{ ch.dealCount }}套</span>
            <span class="cost-trend" :class="ch.trend > 0 ? 'up' : 'down'">
              {{ ch.trend > 0 ? '+' : '' }}{{ ch.trend }}%
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- 3D模式 -->
    <template v-else>
      <div class="two-col-3d">
        <div class="card card-3d-chart">
          <div class="card-title">渠道销售额 3D</div>
          <Bar3DChart :data="channelBarData" height="100%" />
        </div>
        <div class="card card-3d-chart">
          <div class="card-title">转化率 × ROI 3D</div>
          <Scatter3DChart
            :data="channelScatterData"
            xAxisLabel="转化率%"
            yAxisLabel="ROI"
            zAxisLabel="获客成本"
            height="100%"
          />
        </div>
      </div>
      <div class="card card-3d-chart" style="height: 220px;">
        <div class="card-title">获客成本 3D</div>
        <Bar3DChart :data="costBarData" height="100%" />
      </div>
    </template>

    <!-- AI结论 -->
    <div class="ai-box">
      <div class="ai-icon">AI</div>
      <div class="ai-content">
        <div class="ai-title">渠道诊断</div>
        <div class="ai-text">自渠转化率最高但获客量不足，建议加大线上投放；贝壳链家ROI稳健，可适度增加佣金比例；抖音直播获客成本低但转化率偏低，需优化内容策略。</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { generateChannels, type ChannelItem } from '@/utils/pageMockData'
import Bar3DChart from '@/components/charts/Bar3DChart.vue'
import Scatter3DChart from '@/components/charts/Scatter3DChart.vue'
import ChartWrapper from '@/components/common/ChartWrapper.vue'

const props = withDefaults(defineProps<{
  viewMode?: '2d' | '3d'
}>(), {
  viewMode: '2d',
})

const channels = ref<ChannelItem[]>(generateChannels())

const totalSales = computed(() => channels.value.reduce((s, c) => s + c.salesAmount, 0))
const totalDeals = computed(() => channels.value.reduce((s, c) => s + c.dealCount, 0))
const avgConversion = computed(() => channels.value.reduce((s, c) => s + c.conversionRate, 0) / channels.value.length)
const avgROI = computed(() => channels.value.reduce((s, c) => s + c.roi, 0) / channels.value.length)
const maxSales = computed(() => Math.max(...channels.value.map(c => c.salesAmount)))
const maxROI = computed(() => Math.max(...channels.value.map(c => c.roi)))
const sortedByConversion = computed(() => [...channels.value].sort((a, b) => b.conversionRate - a.conversionRate))
const sortedByROI = computed(() => [...channels.value].sort((a, b) => b.roi - a.roi))

const channelBarData = computed(() =>
  channels.value.map(c => ({ name: c.name, value: c.salesAmount, color: c.color }))
)
const channelScatterData = computed(() =>
  channels.value.map(c => ({
    name: c.name,
    x: c.conversionRate,
    y: c.roi,
    z: c.costPerCustomer / 100,
    size: c.salesAmount * 1.5,
    category: c.type,
  }))
)
const costBarData = computed(() =>
  channels.value.map(c => ({ name: c.name, value: c.costPerCustomer, color: c.color }))
)

// Radar chart option for channel capability
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
</script>

<style scoped lang="scss">
.page { height: 100%; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; background: var(--bg, #0F1217); color: var(--text-body, #cbd5e1); }

.channel-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.sum-item {
  text-align: center;
  padding: 14px 10px;
  border-radius: 10px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  background: var(--card-bg, #161B22);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border-color: rgba(96, 165, 250, 0.15);
  }

  &.highlight {
    border-top: 2px solid var(--primary, #60a5fa);
  }
}

.sum-val {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 700;
  color: var(--primary, #60a5fa);
  small { font-size: 12px; opacity: 0.7; font-weight: 500; }
}
.sum-lbl { display: block; font-size: 10px; color: var(--text-caption, #64748b); margin-top: 4px; letter-spacing: 0.5px; }

.card {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  background: var(--card-bg, #161B22);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  &:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3); }
}
.card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-title, #e2e8f0);
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid var(--primary, #60a5fa);
}
.card-3d-chart { height: 240px; overflow: hidden; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.two-col-3d { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.radar-chart-area { height: 240px; }

.dual-rank-list { display: flex; flex-direction: column; gap: 8px; }
.dual-rank-item { padding: 6px 8px; border-radius: 6px; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); } }
.dr-name { font-size: 11px; font-weight: 600; color: var(--text-title, #e2e8f0); margin-bottom: 4px; }
.dr-bars { display: flex; flex-direction: column; gap: 3px; }
.dr-bar-row { display: flex; align-items: center; gap: 6px; }
.dr-bar-label { font-size: 9px; color: var(--text-caption, #64748b); width: 26px; flex-shrink: 0; }
.dr-bar-bg { flex: 1; height: 6px; background: var(--bar-track, rgba(255,255,255,0.05)); border-radius: 3px; overflow: hidden; }
.dr-bar-fill { height: 100%; border-radius: 3px; transition: width 0.4s; &.conv { background: var(--primary, #60a5fa); } &.roi { background: var(--success, #22C55E); } }
.dr-bar-val { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-body, #cbd5e1); width: 36px; text-align: right; flex-shrink: 0; font-weight: 600; }

.channel-bars { display: flex; flex-direction: column; gap: 8px; }
.ch-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.ch-name { font-size: 11px; color: var(--text-body, #cbd5e1); width: 80px; flex-shrink: 0; }
.ch-type { font-size: 9px; padding: 2px 6px; border-radius: 3px; width: 30px; text-align: center; flex-shrink: 0; font-weight: 600; }
.type-自建 { background: var(--primary-light, rgba(96, 165, 250, 0.12)); color: var(--primary, #60a5fa); }
.type-中介 { background: var(--success-light, rgba(34, 197, 94, 0.15)); color: var(--success, #22C55E); }
.type-平台 { background: var(--warning-light, rgba(245, 158, 11, 0.15)); color: var(--warning, #F59E0B); }
.type-线上 { background: var(--purple-light, rgba(139, 92, 246, 0.10)); color: var(--purple, #8b5cf6); }

.ch-bar-bg { flex: 1; height: 10px; background: var(--bar-track, rgba(255, 255, 255, 0.05)); border-radius: 5px; overflow: hidden; }
.ch-bar-fill { height: 100%; border-radius: 5px; transition: width 0.4s; }
.ch-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; width: 50px; text-align: right; flex-shrink: 0; font-weight: 600; }

.rank-list { display: flex; flex-direction: column; gap: 6px; }
.rank-item { display: flex; align-items: center; gap: 6px; padding: 4px 6px; border-radius: 4px; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); } }
.rank-no { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text-caption, #64748b); width: 20px; text-align: center; font-weight: 600; &.top { color: var(--warning, #F59E0B); font-weight: 700; text-shadow: 0 0 6px var(--warning-light); } }
.rank-name { font-size: 11px; color: var(--text-body, #cbd5e1); width: 70px; flex-shrink: 0; }
.rank-bar-bg { flex: 1; height: 8px; background: var(--bar-track, rgba(255, 255, 255, 0.05)); border-radius: 4px; overflow: hidden; }
.rank-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
.rank-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-body, #cbd5e1); width: 45px; text-align: right; flex-shrink: 0; font-weight: 600; }

.cost-table { display: flex; flex-direction: column; gap: 2px; }
.cost-header { display: grid; grid-template-columns: 100px 80px 60px 80px; font-size: 10px; color: var(--text-caption, #64748b); padding-bottom: 6px; border-bottom: 1px solid var(--border, rgba(255,255,255,0.06)); }
.cost-row { display: grid; grid-template-columns: 100px 80px 60px 80px; font-size: 11px; color: var(--text-body, #cbd5e1); padding: 5px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.cost-name { color: var(--text-title, #e2e8f0); font-weight: 500; }
.cost-cpc { font-family: 'JetBrains Mono', monospace; color: var(--warning, #F59E0B); font-weight: 600; }
.cost-trend { font-family: 'JetBrains Mono', monospace; font-weight: 600; &.up { color: var(--success, #22C55E); } &.down { color: var(--danger, #EF4444); } }

.ai-box {
  display: flex;
  gap: 10px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid var(--primary-light, rgba(96, 165, 250, 0.12));
  background: var(--primary-light, rgba(96, 165, 250, 0.06));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.ai-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--primary-light, rgba(96, 165, 250, 0.12)); color: var(--primary, #60a5fa); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ai-content { flex: 1; }
.ai-title { font-size: 12px; font-weight: 600; color: var(--primary, #60a5fa); margin-bottom: 4px; }
.ai-text { font-size: 11px; color: var(--text-body, #cbd5e1); line-height: 1.7; }

@media (max-width: 768px) {
  .channel-summary { grid-template-columns: repeat(2, 1fr); }
  .two-col, .two-col-3d { grid-template-columns: 1fr; }
  .cost-header, .cost-row { grid-template-columns: 80px 60px 50px 60px; font-size: 10px; }
}
</style>

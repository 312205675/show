<template>
  <div class="combined-trend">
    <div class="trend-section">
      <div class="trend-label">
        <span class="label-dot deal-dot" />
        成交趋势
        <span class="trend-period">近30天</span>
      </div>
      <div class="trend-chart-area">
        <ChartWrapper :option="dealOption" height="100%" />
      </div>
    </div>
    <div class="trend-divider" />
    <div class="trend-section">
      <div class="trend-label">
        <span class="label-dot return-dot" />
        回款趋势
        <span class="trend-period">近30天</span>
      </div>
      <div class="trend-chart-area">
        <ChartWrapper :option="returnOption" height="100%" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartWrapper from '@/components/common/ChartWrapper.vue'

const props = defineProps<{
  dealDates: string[]
  dealCount: number[]
  dealSalesAmount: number[]
  returnDates: string[]
  returnAmount: number[]
  returnRate: number[]
}>()

const commonGrid = {
  left: '3%',
  right: '5%',
  bottom: '14%',
  top: '8%',
  containLabel: true,
}

const commonXAxis = {
  type: 'category' as const,
  axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  axisLabel: { color: '#64748b', fontSize: 9, interval: 6, rotate: 0 },
  boundaryGap: false,
}

const commonTooltip = {
  trigger: 'axis' as const,
  backgroundColor: 'rgba(15, 18, 23, 0.95)',
  borderColor: 'rgba(96, 165, 250, 0.15)',
  borderWidth: 1,
  textStyle: { color: '#e2e8f0', fontSize: 12 },
  confine: true,
}

const dealOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: commonTooltip,
  grid: commonGrid,
  xAxis: { ...commonXAxis, data: props.dealDates },
  yAxis: [
    {
      type: 'value' as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
      axisLabel: { color: '#64748b', fontSize: 9 },
    },
    {
      type: 'value' as const,
      axisLine: { show: false },
      splitLine: { show: false },
      axisLabel: { color: '#64748b', fontSize: 9 },
    },
  ],
  series: [
    {
      name: '销售额(万)',
      type: 'line' as const,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2.5, color: '#60a5fa' },
      areaStyle: {
        color: {
          type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(96, 165, 250, 0.20)' },
            { offset: 1, color: 'rgba(96, 165, 250, 0.01)' },
          ],
        },
      },
      data: props.dealSalesAmount,
    },
    {
      name: '成交(套)',
      type: 'bar' as const,
      yAxisIndex: 1,
      barWidth: '40%',
      itemStyle: {
        color: {
          type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(34, 197, 94, 0.35)' },
            { offset: 1, color: 'rgba(34, 197, 94, 0.05)' },
          ],
        },
        borderRadius: [2, 2, 0, 0],
      },
      data: props.dealCount,
    },
  ],
}))

const returnOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: commonTooltip,
  grid: commonGrid,
  xAxis: { ...commonXAxis, data: props.returnDates },
  yAxis: [
    {
      type: 'value' as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
      axisLabel: { color: '#64748b', fontSize: 9 },
    },
    {
      type: 'value' as const,
      axisLine: { show: false },
      splitLine: { show: false },
      axisLabel: { color: '#64748b', fontSize: 9, formatter: '{value}%' },
    },
  ],
  series: [
    {
      name: '回款(万)',
      type: 'line' as const,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2.5, color: '#22C55E' },
      areaStyle: {
        color: {
          type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(34, 197, 94, 0.20)' },
            { offset: 1, color: 'rgba(34, 197, 94, 0.01)' },
          ],
        },
      },
      data: props.returnAmount,
    },
    {
      name: '回款率',
      type: 'line' as const,
      yAxisIndex: 1,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 1.5, color: '#F59E0B', type: 'dashed' as const },
      data: props.returnRate,
    },
  ],
}))
</script>

<style scoped lang="scss">
.combined-trend {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 10px;
  overflow: hidden;
}

.trend-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.trend-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 4px;
  flex-shrink: 0;
}

.label-dot {
  width: 10px;
  height: 3px;
  border-radius: 1px;

  &.deal-dot { background: #60a5fa; }
  &.return-dot { background: #22C55E; }
}

.trend-period {
  font-size: 9px;
  color: #64748b;
  font-weight: 400;
  margin-left: 4px;
}

.trend-chart-area {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.trend-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 4px 0;
  flex-shrink: 0;
}
</style>

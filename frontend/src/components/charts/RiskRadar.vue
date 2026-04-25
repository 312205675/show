<template>
  <div ref="chartRef" class="risk-radar-chart" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { RiskRadarData } from '@/utils/mockData'

echarts.use([RadarChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{
  data: RiskRadarData
}>()

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

function render() {
  if (!chartRef.value) return
  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  const isDark = document.documentElement.getAttribute('data-theme') !== 'lightBiz' && document.documentElement.getAttribute('data-theme') !== 'lightWarm'

  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? 'rgba(15,18,23,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      textStyle: { color: isDark ? '#e2e8f0' : '#1e293b', fontSize: 12 },
    },
    legend: {
      data: ['当前风险', '行业基准'],
      bottom: 4,
      textStyle: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 10 },
      itemWidth: 12,
      itemHeight: 8,
    },
    radar: {
      indicator: props.data.dimensions,
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: isDark ? '#94a3b8' : '#64748b',
        fontSize: 10,
        fontWeight: 500,
      },
      splitLine: {
        lineStyle: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
      },
      splitArea: {
        areaStyle: { color: isDark ? ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] : ['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.04)'] },
      },
      axisLine: {
        lineStyle: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: props.data.current,
            name: '当前风险',
            symbol: 'circle',
            symbolSize: 5,
            lineStyle: { width: 2, color: '#EF4444' },
            areaStyle: { color: 'rgba(239, 68, 68, 0.15)' },
            itemStyle: { color: '#EF4444' },
          },
          {
            value: props.data.benchmark,
            name: '行业基准',
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: { width: 1.5, color: '#60a5fa', type: 'dashed' },
            areaStyle: { color: 'rgba(96, 165, 250, 0.08)' },
            itemStyle: { color: '#60a5fa' },
          },
        ],
      },
    ],
  }, true)
}

onMounted(() => {
  render()
  window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => {
  chart?.dispose()
})

watch(() => props.data, render, { deep: true })
</script>

<style scoped>
.risk-radar-chart {
  width: 100%;
  height: 100%;
  min-height: 180px;
}
</style>

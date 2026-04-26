<template>
  <div ref="chartRef" class="chart-wrapper" :style="{ width: '100%', height: height }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart, ScatterChart, EffectScatterChart, HeatmapChart, GaugeChart, RadarChart, MapChart } from 'echarts/charts'
import {
  TitleComponent, TooltipComponent, LegendComponent, GridComponent,
  VisualMapComponent, GeoComponent, DatasetComponent
} from 'echarts/components'

// Register echarts-gl for 3D charts
import 'echarts-gl'

echarts.use([
  CanvasRenderer, LineChart, BarChart, PieChart, ScatterChart, EffectScatterChart,
  HeatmapChart, GaugeChart, RadarChart, MapChart,
  TitleComponent, TooltipComponent, LegendComponent, GridComponent,
  VisualMapComponent, GeoComponent, DatasetComponent
])

const props = defineProps<{
  option: Record<string, any>
  height?: string
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, 'dark')
  chart.setOption(props.option)
}

function handleResize() {
  chart?.resize()
}

watch(() => props.option, (newOpt) => {
  chart?.setOption(newOpt, { notMerge: false })
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped>
.chart-wrapper {
  min-height: 60px;
}
</style>

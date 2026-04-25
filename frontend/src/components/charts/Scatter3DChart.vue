<template>
  <ChartWrapper :option="chartOption" :height="height" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartWrapper from '@/components/common/ChartWrapper.vue'
import { useThemeStore } from '@/store/theme'

const props = defineProps<{
  data: Array<{ name: string; x: number; y: number; z: number; size?: number; category?: string }>
  xAxisLabel?: string
  yAxisLabel?: string
  zAxisLabel?: string
  title?: string
  height?: string
}>()

const themeStore = useThemeStore()

const chartOption = computed(() => {
  const categories = [...new Set(props.data.map(d => d.category || 'default'))]
  const colorMap: Record<string, string> = {
    刚需: '#4a9eff',
    改善: '#00d68f',
    投资: '#ffab00',
    高端: '#a78bfa',
    default: '#4a9eff',
  }

  const seriesData = props.data.map(d => ({
    name: d.name,
    value: [d.x, d.y, d.z],
    itemStyle: {
      color: colorMap[d.category || 'default'] || '#4a9eff',
    },
  }))

  return {
    title: props.title ? {
      text: props.title,
      textStyle: { color: themeStore.config.textCaption, fontSize: 12 },
      left: 10,
      top: 6,
    } : undefined,
    tooltip: {
      backgroundColor: 'rgba(20,24,32,0.9)',
      borderColor: 'rgba(74,158,255,0.2)',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      formatter: (p: any) => {
        const d = props.data[p.dataIndex]
        return `${d.name}<br/>
          ${props.xAxisLabel || 'X'}: ${d.x}<br/>
          ${props.yAxisLabel || 'Y'}: ${d.y}<br/>
          ${props.zAxisLabel || 'Z'}: ${d.z}`
      },
    },
    legend: categories.length > 1 ? {
      data: categories,
      textStyle: { color: themeStore.config.textCaption, fontSize: 10 },
      right: 10,
      top: 6,
    } : undefined,
    xAxis3D: {
      type: 'value',
      name: props.xAxisLabel || '',
      nameTextStyle: { color: themeStore.config.textCaption, fontSize: 9 },
      axisLabel: { color: themeStore.config.textCaption, fontSize: 9 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    },
    yAxis3D: {
      type: 'value',
      name: props.yAxisLabel || '',
      nameTextStyle: { color: themeStore.config.textCaption, fontSize: 9 },
      axisLabel: { color: themeStore.config.textCaption, fontSize: 9 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    },
    zAxis3D: {
      type: 'value',
      name: props.zAxisLabel || '',
      nameTextStyle: { color: themeStore.config.textCaption, fontSize: 9 },
      axisLabel: { color: themeStore.config.textCaption, fontSize: 9 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    },
    grid3D: {
      viewControl: {
        autoRotate: true,
        autoRotateSpeed: 3,
        distance: 200,
        alpha: 20,
        beta: 40,
        rotateSensitivity: 2,
        zoomSensitivity: 1,
      },
      light: {
        main: { intensity: 1.2, shadow: true, alpha: 40, beta: 30 },
        ambient: { intensity: 0.3 },
      },
      environment: 'none',
    },
    series: [{
      type: 'scatter3D',
      data: seriesData,
      symbolSize: (val: number[], params: any) => {
        const d = props.data[params.dataIndex]
        return d.size || 12
      },
      itemStyle: { opacity: 0.85, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
      emphasis: {
        itemStyle: { opacity: 1, borderWidth: 2, borderColor: '#fff' },
      },
    }],
  }
})
</script>

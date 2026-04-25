<template>
  <ChartWrapper :option="chartOption" :height="height" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartWrapper from '@/components/common/ChartWrapper.vue'
import { useThemeStore } from '@/store/theme'

const props = defineProps<{
  data: Array<{ name: string; value: number; color?: string }>
  title?: string
  height?: string
}>()

const themeStore = useThemeStore()

const chartOption = computed(() => {
  const names = props.data.map(d => d.name)
  const values = props.data.map(d => d.value)
  const maxVal = Math.max(...values, 1)

  const barData = props.data.map((d, i) => ({
    name: d.name,
    value: [i, 0, d.value],
    itemStyle: {
      color: d.color || (i === 0 ? '#4a9eff' : i === 1 ? '#00d68f' : i === 2 ? '#ffab00' : '#a78bfa'),
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
      formatter: (p: any) => `${p.name}<br/><b style="color:#4a9eff">${p.value[2]}</b>`,
    },
    visualMap: {
      show: false,
      max: maxVal,
      min: 0,
      inRange: {
        color: ['#1a3a6e', '#3b82f6', '#60a5fa'],
      },
    },
    xAxis3D: {
      type: 'category',
      data: names,
      axisLabel: { color: themeStore.config.textCaption, fontSize: 10, rotate: 20 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    yAxis3D: {
      type: 'category',
      data: [''],
      axisLabel: { show: false },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    zAxis3D: {
      type: 'value',
      axisLabel: { color: themeStore.config.textCaption, fontSize: 9 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    grid3D: {
      show: true,
      boxWidth: 120,
      boxHeight: 20,
      boxDepth: 60,
      viewControl: {
        autoRotate: true,
        autoRotateSpeed: 4,
        distance: 180,
        alpha: 22,
        beta: 35,
        rotateSensitivity: 2,
        zoomSensitivity: 1,
      },
      light: {
        main: { intensity: 1.2, shadow: true, alpha: 40, beta: 30 },
        ambient: { intensity: 0.4 },
      },
      environment: 'none',
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      axisPointer: { lineStyle: { color: 'rgba(74,158,255,0.4)' } },
    },
    series: [{
      type: 'bar3D',
      data: barData,
      barSize: 14,
      shading: 'lambert',
      label: { show: true, distance: 2, formatter: '{b}', textStyle: { fontSize: 9, color: '#94a3b8' } },
      itemStyle: { opacity: 0.85 },
      emphasis: {
        label: { textStyle: { fontSize: 11, color: '#fff' } },
        itemStyle: { opacity: 1 },
      },
    }],
  }
})
</script>

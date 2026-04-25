<template>
  <ChartWrapper :option="chartOption" :height="height" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartWrapper from '@/components/common/ChartWrapper.vue'
import { useThemeStore } from '@/store/theme'

const props = defineProps<{
  regions: Array<{ name: string; value: number; coord: [number, number] }>
  title?: string
  height?: string
}>()

const themeStore = useThemeStore()

const chartOption = computed(() => {
  const scatterData = props.regions.map(r => ({
    name: r.name,
    value: [...r.coord, r.value],
  }))

  const barData = props.regions.map(r => ({
    name: r.name,
    value: [...r.coord, r.value * 10],
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
        if (p.seriesType === 'bar3D') return `${p.name}<br/>销售额: <b style="color:#00d68f">${(p.value[2] / 10).toFixed(1)}亿</b>`
        return `${p.name}<br/>指数: <b style="color:#4a9eff">${p.value[2]}</b>`
      },
    },
    visualMap: {
      show: true,
      min: 0,
      max: Math.max(...props.regions.map(r => r.value), 1),
      inRange: { color: ['#0a3d6e', '#3b82f6', '#60a5fa', '#fbbf24', '#ef4444'] },
      text: ['高', '低'],
      textStyle: { color: themeStore.config.textCaption, fontSize: 9 },
      left: 10,
      bottom: 10,
      itemWidth: 10,
      itemHeight: 80,
    },
    geo3D: {
      map: 'hebei',
      roam: true,
      environment: 'none',
      shading: 'realistic',
      realisticMaterial: {
        roughness: 0.6,
        metalness: 0.1,
      },
      postEffect: {
        enable: true,
        bloom: { enable: true, bloomIntensity: 0.08 },
        SSAO: { enable: true, radius: 2, intensity: 1 },
      },
      viewControl: {
        autoRotate: true,
        autoRotateSpeed: 2,
        distance: 80,
        alpha: 40,
        beta: -10,
        rotateSensitivity: 2,
        zoomSensitivity: 1.5,
      },
      itemStyle: {
        color: '#1a2a40',
        borderWidth: 1,
        borderColor: 'rgba(74,158,255,0.15)',
      },
      emphasis: {
        itemStyle: {
          color: '#2a4a70',
        },
        label: {
          show: true,
          textStyle: { color: '#fff', fontSize: 12 },
        },
      },
      regionHeight: 3,
      light: {
        main: { intensity: 1.5, shadow: true, shadowQuality: 'high', alpha: 30, beta: -20 },
        ambient: { intensity: 0.4 },
      },
    },
    series: [
      {
        type: 'scatter3D',
        coordinateSystem: 'geo3D',
        symbolSize: 12,
        data: scatterData,
        itemStyle: {
          color: '#4a9eff',
          opacity: 0.9,
          borderWidth: 1,
          borderColor: '#60a5fa',
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{b}',
          textStyle: { color: '#e2e8f0', fontSize: 10, backgroundColor: 'rgba(20,24,32,0.7)', padding: [2, 4], borderRadius: 3 },
        },
      },
      {
        type: 'bar3D',
        coordinateSystem: 'geo3D',
        barSize: 1.5,
        data: barData,
        shading: 'lambert',
        itemStyle: { opacity: 0.75 },
        label: { show: false },
      },
    ],
  }
})
</script>

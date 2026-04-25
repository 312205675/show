<template>
  <ChartWrapper :option="chartOption" :height="height" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import ChartWrapper from '@/components/common/ChartWrapper.vue'
import * as echarts from 'echarts/core'

const props = defineProps<{
  cities: Array<{ name: string; value: number; coord: number[] }>
  height?: string
}>()

const mapLoaded = ref(false)

onMounted(async () => {
  try {
    // Try to register china map from CDN
    const resp = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    const geoJson = await resp.json()
    echarts.registerMap('china', geoJson as any)
    mapLoaded.value = true
  } catch {
    // If map data fails to load, scatter mode will be used
    mapLoaded.value = false
  }
})

const chartOption = computed(() => {
  if (mapLoaded.value) {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(10, 14, 39, 0.9)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        textStyle: { color: '#e0e6ff' },
        formatter: (params: any) => {
          if (params.seriesType === 'effectScatter') {
            return `${params.name}<br/>热度: ${params.value[2]}`
          }
          return params.name
        },
      },
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.2,
        center: [104.5, 35.5],
        label: { show: false },
        itemStyle: {
          areaColor: 'rgba(13, 17, 53, 0.8)',
          borderColor: 'rgba(0, 212, 255, 0.25)',
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: 'rgba(0, 212, 255, 0.15)',
            borderColor: '#00d4ff',
          },
        },
      },
      series: [
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          rippleEffect: { brushType: 'stroke', scale: 4, period: 4 },
          showEffectOn: 'render',
          itemStyle: {
            color: '#00d4ff',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 212, 255, 0.5)',
          },
          symbolSize: (val: number[]) => Math.max(val[2] / 8, 6),
          data: props.cities.map(c => ({
            name: c.name,
            value: [...c.coord, c.value],
          })),
          animationDuration: 1500,
        },
      ],
    }
  }

  // Fallback: scatter chart without map
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 14, 39, 0.9)',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      textStyle: { color: '#e0e6ff' },
      formatter: (params: any) => `${params.name}<br/>热度: ${params.value[2]}`,
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '10%',
      bottom: '10%',
    },
    xAxis: {
      min: 73,
      max: 136,
      show: false,
    },
    yAxis: {
      min: 18,
      max: 54,
      show: false,
    },
    series: [
      {
        type: 'effectScatter',
        rippleEffect: { brushType: 'stroke', scale: 3, period: 4 },
        showEffectOn: 'render',
        itemStyle: {
          color: (params: any) => {
            const v = params.value[2]
            if (v > 80) return '#00d4ff'
            if (v > 60) return '#a855f7'
            return '#00ff88'
          },
          shadowBlur: 10,
          shadowColor: 'rgba(0, 212, 255, 0.5)',
        },
        symbolSize: (val: number[]) => Math.max(val[2] / 5, 8),
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          color: '#8892b0',
          fontSize: 9,
        },
        data: props.cities.map(c => ({
          name: c.name,
          value: [...c.coord, c.value],
        })),
        animationDuration: 1500,
      },
    ],
  }
})
</script>

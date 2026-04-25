<template>
  <ChartWrapper :option="chartOption" :height="height" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartWrapper from '@/components/common/ChartWrapper.vue'

const props = defineProps<{
  dates: string[]
  salesData: number[]
  signedData: number[]
  height?: string
}>()

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10, 14, 39, 0.9)',
    borderColor: 'rgba(0, 212, 255, 0.3)',
    textStyle: { color: '#e0e6ff' },
  },
  legend: {
    data: ['销售额(万)', '签约套数'],
    textStyle: { color: '#8892b0', fontSize: 11 },
    top: 0,
    right: 0,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '18%',
    containLabel: true,
  },
  xAxis: {
    type: 'category' as const,
    data: props.dates,
    axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.15)' } },
    axisLabel: { color: '#8892b0', fontSize: 10 },
    boundaryGap: false,
  },
  yAxis: [
    {
      type: 'value' as const,
      name: '万元',
      nameTextStyle: { color: '#8892b0', fontSize: 10 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.06)' } },
      axisLabel: { color: '#8892b0', fontSize: 10 },
    },
    {
      type: 'value' as const,
      name: '套',
      nameTextStyle: { color: '#8892b0', fontSize: 10 },
      axisLine: { show: false },
      splitLine: { show: false },
      axisLabel: { color: '#8892b0', fontSize: 10 },
    },
  ],
  series: [
    {
      name: '销售额(万)',
      type: 'line' as const,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color: '#00d4ff' },
      areaStyle: {
        color: {
          type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.01)' },
          ],
        },
      },
      data: props.salesData,
      animationDuration: 2000,
      animationEasing: 'cubicOut' as const,
    },
    {
      name: '签约套数',
      type: 'line' as const,
      yAxisIndex: 1,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color: '#a855f7' },
      areaStyle: {
        color: {
          type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(168, 85, 247, 0.25)' },
            { offset: 1, color: 'rgba(168, 85, 247, 0.01)' },
          ],
        },
      },
      data: props.signedData,
      animationDuration: 2000,
      animationDelay: 300,
      animationEasing: 'cubicOut' as const,
    },
  ],
}))
</script>

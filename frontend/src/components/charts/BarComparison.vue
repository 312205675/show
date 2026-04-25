<template>
  <ChartWrapper :option="chartOption" :height="height" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartWrapper from '@/components/common/ChartWrapper.vue'

const props = defineProps<{
  projects: string[]
  target: number[]
  actual: number[]
  height?: string
}>()

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10, 14, 39, 0.9)',
    borderColor: 'rgba(96, 165, 250, 0.3)',
    textStyle: { color: '#e0e6ff' },
  },
  legend: {
    data: ['目标', '实际'],
    textStyle: { color: '#64748b', fontSize: 10 },
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
    data: props.projects,
    axisLine: { lineStyle: { color: 'rgba(96, 165, 250, 0.15)' } },
    axisLabel: { color: '#64748b', fontSize: 9, rotate: 15 },
  },
  yAxis: {
    type: 'value' as const,
    name: '万元',
    nameTextStyle: { color: '#64748b', fontSize: 10 },
    axisLine: { show: false },
    splitLine: { lineStyle: { color: 'rgba(96, 165, 250, 0.06)' } },
    axisLabel: { color: '#64748b', fontSize: 9 },
  },
  series: [
    {
      name: '目标',
      type: 'bar' as const,
      barWidth: '30%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: {
          type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(96, 165, 250, 0.8)' },
            { offset: 1, color: 'rgba(96, 165, 250, 0.2)' },
          ],
        },
      },
      data: props.target,
      animationDuration: 1500,
      animationEasing: 'elasticOut' as const,
    },
    {
      name: '实际',
      type: 'bar' as const,
      barWidth: '30%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: {
          type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(34, 197, 94, 0.8)' },
            { offset: 1, color: 'rgba(34, 197, 94, 0.2)' },
          ],
        },
      },
      data: props.actual,
      animationDuration: 1500,
      animationDelay: 200,
      animationEasing: 'elasticOut' as const,
    },
  ],
}))
</script>

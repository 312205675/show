<template>
  <ChartWrapper :option="chartOption" :height="height" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartWrapper from '@/components/common/ChartWrapper.vue'

const props = defineProps<{
  value: number
  label: string
  height?: string
  color?: string[]
}>()

const gaugeColors = props.color || ['#22C55E', '#60a5fa', '#8b5cf6', '#F59E0B', '#EF4444']

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  series: [
    {
      type: 'gauge' as const,
      startAngle: 220,
      endAngle: -40,
      min: 0,
      max: 100,
      splitNumber: 5,
      radius: '90%',
      center: ['50%', '55%'],
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [0.2, gaugeColors[0]],
            [0.4, gaugeColors[1]],
            [0.6, gaugeColors[2]],
            [0.8, gaugeColors[3]],
            [1, gaugeColors[4]],
          ],
        },
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '55%',
        width: 8,
        offsetCenter: [0, '-10%'],
        itemStyle: {
          color: 'auto',
          shadowColor: 'rgba(96, 165, 250, 0.5)',
          shadowBlur: 6,
        },
      },
      axisTick: {
        length: 6,
        lineStyle: { color: 'auto', width: 1 },
      },
      splitLine: {
        length: 12,
        lineStyle: { color: 'auto', width: 2 },
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 9,
        distance: 16,
      },
      title: {
        offsetCenter: [0, '30%'],
        fontSize: 11,
        color: '#64748b',
      },
      detail: {
        fontSize: 20,
        fontFamily: 'Orbitron, JetBrains Mono, monospace',
        fontWeight: 700,
        offsetCenter: [0, '55%'],
        valueAnimation: true,
        formatter: '{value}%',
        color: '#60a5fa',
        textShadowColor: 'rgba(96, 165, 250, 0.5)',
        textShadowBlur: 10,
      },
      data: [{ value: props.value, name: props.label }],
      animationDuration: 2000,
      animationEasing: 'cubicOut' as const,
    },
  ],
}))
</script>

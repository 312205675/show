<template>
  <ChartWrapper :option="chartOption" :height="height" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartWrapper from '@/components/common/ChartWrapper.vue'

const props = defineProps<{
  data: Array<{ name: string; value: number }>
  color?: string
  height?: string
  title?: string
}>()

const colors = ['#22C55E', '#F59E0B', '#EF4444', '#60a5fa', '#8b5cf6', '#06b6d4']

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(10, 14, 39, 0.9)',
    borderColor: 'rgba(96, 165, 250, 0.3)',
    textStyle: { color: '#e0e6ff' },
    formatter: '{b}: {c} ({d}%)',
  },
  title: props.title ? {
    text: props.title,
    textStyle: { color: '#94a3b8', fontSize: 12, fontWeight: 400 },
    left: 'center',
    top: 0,
  } : undefined,
  series: [
    {
      type: 'pie' as const,
      radius: ['40%', '70%'],
      center: ['50%', '55%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#161B22',
        borderWidth: 2,
      },
      label: {
        color: '#94a3b8',
        fontSize: 10,
        formatter: '{b}\n{d}%',
      },
      labelLine: {
        lineStyle: { color: 'rgba(96, 165, 250, 0.3)' },
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowOffsetX: 0,
          shadowColor: 'rgba(96, 165, 250, 0.5)',
        },
      },
      data: props.data.map((item, i) => ({
        ...item,
        itemStyle: { color: colors[i % colors.length] },
      })),
      animationType: 'scale' as const,
      animationEasing: 'elasticOut' as const,
      animationDuration: 1500,
    },
  ],
}))
</script>

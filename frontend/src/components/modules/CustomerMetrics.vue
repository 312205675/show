<template>
  <SectionPanel title="客户指标">
    <div class="customer-layout">
      <div v-for="item in items" :key="item.label" class="customer-item">
        <div class="customer-ring" :style="ringStyle(item.value, item.color)">
          <span class="ring-value" :style="{ color: item.color }">{{ item.displayValue }}{{ item.suffix }}</span>
        </div>
        <div class="customer-label">{{ item.label }}</div>
      </div>
    </div>
  </SectionPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SectionPanel from '@/components/common/SectionPanel.vue'

const props = defineProps<{
  todayVisits: number
  todayReservations: number
  conversionRate: number
  referralRate: number
  satisfaction: number
}>()

const items = computed(() => [
  { label: '今日来访', value: props.todayVisits, displayValue: props.todayVisits, suffix: '人', color: '#00d4ff', max: 200 },
  { label: '今日认筹', value: props.todayReservations, displayValue: props.todayReservations, suffix: '套', color: '#00ff88', max: 30 },
  { label: '转化率', value: props.conversionRate, displayValue: props.conversionRate, suffix: '%', color: '#a855f7', max: 100 },
  { label: '老带新比例', value: props.referralRate, displayValue: props.referralRate, suffix: '%', color: '#fbbf24', max: 100 },
  { label: '满意度', value: props.satisfaction, displayValue: props.satisfaction, suffix: '%', color: '#ec4899', max: 100 },
])

function ringStyle(value: number, color: string) {
  const pct = Math.min((value / 100) * 100, 100)
  return {
    background: `conic-gradient(${color} ${pct * 3.6}deg, $bar-track ${pct * 3.6}deg)`,
  }
}
</script>

<style scoped lang="scss">
.customer-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  height: 100%;
  align-content: center;
  justify-content: center;
}

.customer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 70px;
}

.customer-ring {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: rgba(10, 14, 39, 0.9);
  }
}

.ring-value {
  position: relative;
  z-index: 1;
  font-family: 'Orbitron', monospace;
  font-size: 12px;
  font-weight: 700;
}

.customer-label {
  font-size: 11px;
  color: #8892b0;
  text-align: center;
}
</style>

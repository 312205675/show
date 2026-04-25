<template>
  <SectionPanel title="实时销售指标" animated>
    <div class="sales-grid">
      <div v-for="item in metricItems" :key="item.label" class="metric-card" :class="item.class">
        <div class="metric-label">{{ item.label }}</div>
        <DigitalFlipper
          :value="item.value"
          :decimals="item.decimals"
          :suffix="item.suffix"
          :size="item.size || 28"
          :color="item.color || '#00d4ff'"
        />
      </div>
    </div>
  </SectionPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SectionPanel from '@/components/common/SectionPanel.vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'

const props = defineProps<{
  todaySales: number
  todaySigned: number
  totalSales: number
  totalSigned: number
  completionRate: number
  returnAmount: number
}>()

const metricItems = computed(() => [
  { label: '今日销售额', value: props.todaySales, decimals: 2, suffix: '万', color: '#00d4ff', size: 30, class: 'primary' },
  { label: '今日签约套数', value: props.todaySigned, decimals: 0, suffix: '套', color: '#00ff88', class: 'success' },
  { label: '累计销售额', value: props.totalSales, decimals: 2, suffix: '亿', color: '#fbbf24', size: 30, class: 'gold' },
  { label: '累计签约套数', value: props.totalSigned, decimals: 0, suffix: '套', color: '#a855f7', class: 'purple' },
  { label: '销售完成率', value: props.completionRate, decimals: 1, suffix: '%', color: '#00d4ff', class: 'blue' },
  { label: '回款金额', value: props.returnAmount, decimals: 2, suffix: '万', color: '#00ff88', class: 'success' },
])
</script>

<style scoped lang="scss">
.sales-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  height: 100%;
}

.metric-card {
  background: rgba(0, 212, 255, 0.03);
  border: 1px solid rgba(0, 212, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent-color, #00d4ff), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::after {
    opacity: 1;
  }

  &.primary { --accent-color: #00d4ff; }
  &.success { --accent-color: #00ff88; }
  &.gold { --accent-color: #fbbf24; }
  &.purple { --accent-color: #a855f7; }
  &.blue { --accent-color: #00d4ff; }
}

.metric-label {
  font-size: 12px;
  color: #8892b0;
  margin-bottom: 6px;
  letter-spacing: 1px;
  text-align: center;
}

@media (max-width: 768px) {
  .sales-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .metric-card {
    padding: 8px 10px;
  }
}
</style>

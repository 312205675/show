<template>
  <div class="kpi-bar">
    <div
      v-for="item in kpiItems"
      :key="item.label"
      class="kpi-item card-3d"
      :class="{ 'kpi-hero': item.primary }"
      @click="emit('select', { label: item.label, value: item.value, color: item.color })"
    >
      <div class="kpi-label">{{ item.label }}</div>
      <div class="kpi-value-row">
        <span class="kpi-number" :style="{ color: item.color }">
          <DigitalFlipper :value="item.value" :decimals="item.decimals" :size="item.primary ? 30 : 22" :color="item.color" />
        </span>
        <span class="kpi-suffix" :style="{ color: item.color }">{{ item.suffix }}</span>
        <span v-if="item.trend" class="kpi-trend" :class="item.trend > 0 ? 'up' : 'down'">
          {{ item.trend > 0 ? '↑' : '↓' }}
        </span>
      </div>
      <div v-if="item.sub" class="kpi-sub" :style="{ color: item.subColor }">{{ item.sub }}</div>
      <div class="kpi-click-hint">查看详情</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'

const props = defineProps<{
  depletionRate: number
  totalSales: number
  returnAmount: number
  returnRate: number
  inventoryUnits: number
  inventoryValue: number
  todayDeals: number
  monthDeals: number
  momGrowth: number
}>()

const emit = defineEmits<{
  select: [kpi: { label: string; value: number; color: string }]
}>()

const kpiItems = computed(() => [
  {
    label: '去化率',
    value: props.depletionRate,
    decimals: 1,
    suffix: '%',
    color: props.depletionRate >= 70 ? '#00d68f' : props.depletionRate >= 50 ? '#ffab00' : '#ff4757',
    primary: true,
    trend: props.momGrowth > 0 ? 1 : -1,
  },
  {
    label: '销售额(亿)',
    value: props.totalSales,
    decimals: 2,
    suffix: '',
    color: '#4a9eff',
  },
  {
    label: '回款金额(亿)',
    value: props.returnAmount,
    decimals: 2,
    suffix: '',
    color: '#00d68f',
    sub: `回款率 ${props.returnRate}%`,
    subColor: props.returnRate >= 75 ? '#00d68f' : '#ffab00',
  },
  {
    label: '库存(套)',
    value: props.inventoryUnits,
    decimals: 0,
    suffix: '',
    color: '#ffab00',
    sub: `货值 ${props.inventoryValue}亿`,
    subColor: '#6b7590',
  },
  {
    label: '今日成交',
    value: props.todayDeals,
    decimals: 0,
    suffix: '套',
    color: '#4a9eff',
    sub: `本月 ${props.monthDeals} 套`,
    subColor: '#6b7590',
  },
  {
    label: '环比增长',
    value: props.momGrowth,
    decimals: 1,
    suffix: '%',
    color: props.momGrowth >= 0 ? '#00d68f' : '#ff4757',
    trend: props.momGrowth > 0 ? 1 : -1,
  },
])
</script>

<style scoped lang="scss">
.kpi-bar {
  display: flex;
  height: 100%;
  align-items: stretch;
}

.kpi-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-right: 1px solid $border-color;
  gap: 2px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;

  &:last-child {
    border-right: none;
  }

  &.kpi-hero {
    background: $accent-blue-light;
    border-left: 2px solid $border-glow;
  }

  &:hover {
    background: $accent-blue-light;

    .kpi-click-hint {
      opacity: 1;
    }
  }
}

.kpi-label {
  font-size: 10px;
  color: $gray-500;
  letter-spacing: 0.5px;
  white-space: nowrap;
  font-weight: 500;
}

.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.kpi-number {
  display: inline-flex;
  align-items: baseline;
}

.kpi-suffix {
  font-size: 12px;
  font-weight: 500;
  opacity: 0.6;
}

.kpi-trend {
  font-size: 12px;
  font-weight: 700;
  margin-left: 2px;

  &.up { color: $accent-green; }
  &.down { color: $accent-red; }
}

.kpi-sub {
  font-size: 10px;
  color: $gray-500;
  white-space: nowrap;
}

.kpi-click-hint {
  position: absolute;
  bottom: 4px;
  font-size: 9px;
  color: $accent-blue;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}
</style>

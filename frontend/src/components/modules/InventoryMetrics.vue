<template>
  <SectionPanel title="库存与去化指标">
    <div class="inventory-layout">
      <div class="gauge-area">
        <GaugeChart :value="depletionRate" label="去化率" height="200px" />
      </div>
      <div class="metrics-area">
        <div v-for="item in metricItems" :key="item.label" class="inv-item">
          <span class="inv-label">{{ item.label }}</span>
          <span class="inv-value" :style="{ color: item.color }">
            <DigitalFlipper :value="item.value" :decimals="item.decimals" :suffix="item.suffix" :size="18" :color="item.color" />
          </span>
        </div>
      </div>
    </div>
  </SectionPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SectionPanel from '@/components/common/SectionPanel.vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'

const props = defineProps<{
  totalArea: number
  soldArea: number
  remainingArea: number
  depletionRate: number
  avgPrice: number
  turnoverDays: number
}>()

const metricItems = computed(() => [
  { label: '总可售面积', value: props.totalArea, decimals: 2, suffix: '万㎡', color: '#00d4ff' },
  { label: '已售面积', value: props.soldArea, decimals: 2, suffix: '万㎡', color: '#00ff88' },
  { label: '剩余可售', value: props.remainingArea, decimals: 2, suffix: '万㎡', color: '#fbbf24' },
  { label: '平均售价', value: props.avgPrice, decimals: 0, suffix: '元/㎡', color: '#a855f7' },
  { label: '库存周转', value: props.turnoverDays, decimals: 0, suffix: '天', color: '#ec4899' },
])
</script>

<style scoped lang="scss">
.inventory-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;
}

.gauge-area {
  flex-shrink: 0;
}

.metrics-area {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  justify-content: space-around;
}

.inv-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 212, 255, 0.02);
}

.inv-label {
  font-size: 11px;
  color: #8892b0;
}

.inv-value {
  font-family: 'Orbitron', monospace;
}
</style>

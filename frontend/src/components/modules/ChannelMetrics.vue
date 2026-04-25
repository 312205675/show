<template>
  <SectionPanel title="渠道指标">
    <div class="channel-layout">
      <div class="channel-bars">
        <div v-for="item in barItems" :key="item.label" class="channel-bar-row">
          <span class="ch-label">{{ item.label }}</span>
          <div class="ch-bar-track">
            <div
              class="ch-bar-fill"
              :style="{ width: item.pct + '%', background: item.gradient }"
            />
          </div>
          <span class="ch-value" :style="{ color: item.color }">{{ item.displayValue }}{{ item.suffix }}</span>
        </div>
      </div>
      <div class="channel-kpi">
        <div class="kpi-item">
          <span class="kpi-label">渠道成本</span>
          <DigitalFlipper :value="channelCost" :decimals="2" suffix="万" :size="20" color="#f97316" />
        </div>
        <div class="kpi-item">
          <span class="kpi-label">渠道ROI</span>
          <DigitalFlipper :value="channelROI" :decimals="1" suffix="%" :size="20" color="#00ff88" />
        </div>
      </div>
    </div>
  </SectionPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SectionPanel from '@/components/common/SectionPanel.vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'

const props = defineProps<{
  selfSalesRate: number
  distributionRate: number
  onlineRate: number
  channelCost: number
  channelROI: number
}>()

const barItems = computed(() => [
  {
    label: '自销占比',
    pct: props.selfSalesRate,
    displayValue: props.selfSalesRate,
    suffix: '%',
    color: '#00d4ff',
    gradient: 'linear-gradient(90deg, rgba(0,212,255,0.8), rgba(0,212,255,0.2))',
  },
  {
    label: '分销占比',
    pct: props.distributionRate,
    displayValue: props.distributionRate,
    suffix: '%',
    color: '#a855f7',
    gradient: 'linear-gradient(90deg, rgba(168,85,247,0.8), rgba(168,85,247,0.2))',
  },
  {
    label: '线上获客',
    pct: props.onlineRate,
    displayValue: props.onlineRate,
    suffix: '%',
    color: '#00ff88',
    gradient: 'linear-gradient(90deg, rgba(0,255,136,0.8), rgba(0,255,136,0.2))',
  },
])
</script>

<style scoped lang="scss">
.channel-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
}

.channel-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.channel-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ch-label {
  font-size: 11px;
  color: #8892b0;
  width: 56px;
  flex-shrink: 0;
}

.ch-bar-track {
  flex: 1;
  height: 8px;
  background: $bar-track;
  border-radius: 4px;
  overflow: hidden;
}

.ch-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.ch-value {
  font-family: 'Orbitron', monospace;
  font-size: 12px;
  font-weight: 600;
  width: 60px;
  text-align: right;
  flex-shrink: 0;
}

.channel-kpi {
  display: flex;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 212, 255, 0.08);
}

.kpi-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.kpi-label {
  font-size: 11px;
  color: #8892b0;
}
</style>

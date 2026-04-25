<template>
  <SectionPanel title="项目进度指标">
    <div class="project-grid">
      <div v-for="item in items" :key="item.label" class="project-item">
        <div class="project-icon" :style="{ background: item.bgColor }">
          <span class="icon-text">{{ item.icon }}</span>
        </div>
        <div class="project-info">
          <DigitalFlipper :value="item.value" :decimals="0" :size="24" :color="item.color" />
          <div class="project-label">{{ item.label }}</div>
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
  started: number
  ongoing: number
  completed: number
  presalePermits: number
  salePermits: number
}>()

const items = computed(() => [
  { label: '开工项目', value: props.started, icon: '🏗', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.12)' },
  { label: '在建项目', value: props.ongoing, icon: '⚙', color: '#00d4ff', bgColor: 'rgba(0, 212, 255, 0.12)' },
  { label: '竣工项目', value: props.completed, icon: '✓', color: '#00ff88', bgColor: 'rgba(0, 255, 136, 0.12)' },
  { label: '预售许可', value: props.presalePermits, icon: '📋', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.12)' },
  { label: '销售许可', value: props.salePermits, icon: '📄', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.12)' },
])
</script>

<style scoped lang="scss">
.project-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  justify-content: space-around;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  background: rgba(0, 212, 255, 0.02);
  transition: background 0.3s;

  &:hover {
    background: rgba(0, 212, 255, 0.06);
  }
}

.project-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-text {
  font-size: 16px;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.project-label {
  font-size: 11px;
  color: #8892b0;
  letter-spacing: 0.5px;
}
</style>

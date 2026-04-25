<template>
  <div class="risk-panel">
    <div class="risk-header">
      <div class="rh-left">
        <svg class="rh-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span class="rh-title">问题诊断</span>
      </div>
      <span class="rh-badge" :class="hasDanger ? 'danger' : 'warn'">{{ props.risks.length }}</span>
    </div>

    <div class="risk-list">
      <div
        v-for="(item, idx) in sortedRisks"
        :key="idx"
        class="risk-item"
        :class="`severity-${item.severity}`"
        @click="emit('select', item)"
      >
        <div class="ri-indicator">
          <span v-if="item.severity === 'danger'" class="ri-pulse danger" />
          <span v-else class="ri-dot warn" />
        </div>
        <div class="ri-body">
          <div class="ri-project">{{ item.projectName }}</div>
          <div class="ri-desc">{{ item.description }}</div>
          <div class="ri-type-badge" :class="`type-${item.type}`">
            {{ typeLabel(item.type) }}
          </div>
        </div>
        <svg class="ri-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>

    <div v-if="props.risks.length === 0" class="risk-empty">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <span>所有项目运行正常</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RiskItem } from '@/utils/mockData'

const props = defineProps<{
  risks: RiskItem[]
}>()

const emit = defineEmits<{
  select: [risk: RiskItem]
}>()

const hasDanger = computed(() => props.risks.some(r => r.severity === 'danger'))

const sortedRisks = computed(() => {
  return [...props.risks].sort((a, b) => {
    if (a.severity === 'danger' && b.severity !== 'danger') return -1
    if (a.severity !== 'danger' && b.severity === 'danger') return 1
    return 0
  })
})

function typeLabel(type: RiskItem['type']): string {
  const map: Record<string, string> = {
    unsalable: '滞销',
    returnAbnormal: '回款异常',
    highInventory: '高库存',
  }
  return map[type] || type
}
</script>

<style scoped lang="scss">
$c-green: #22C55E;
$c-green-dim: rgba(34, 197, 94, 0.15);
$c-amber: #F59E0B;
$c-amber-dim: rgba(245, 158, 11, 0.15);
$c-red: #EF4444;
$c-red-dim: rgba(239, 68, 68, 0.15);
$c-red-glow: rgba(239, 68, 68, 0.3);
$c-blue: #60a5fa;
$c-purple: #8b5cf6;
$c-purple-dim: rgba(139, 92, 246, 0.15);
$c-text: #e2e8f0;
$c-text-dim: #64748b;
$c-border: rgba(255, 255, 255, 0.06);

.risk-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
}

.risk-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.rh-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rh-icon {
  color: $c-red;
}

.rh-title {
  font-size: 13px;
  font-weight: 600;
  color: $c-text;
  letter-spacing: 0.5px;
}

.rh-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;

  &.danger { background: $c-red-dim; color: $c-red; }
  &.warn { background: $c-amber-dim; color: $c-amber; }
}

.risk-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.risk-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 10px;
  border-radius: 6px;
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s;

  &.severity-danger {
    background: $c-red-dim;
    border-left-color: $c-red;
  }
  &.severity-warn {
    background: $c-amber-dim;
    border-left-color: $c-amber;
  }

  &:hover {
    transform: translateX(2px);
    &.severity-danger { background: rgba(239, 68, 68, 0.22); }
    &.severity-warn { background: rgba(245, 158, 11, 0.22); }
    .ri-arrow { opacity: 1; }
  }
}

.ri-indicator {
  flex-shrink: 0;
  padding-top: 2px;
}

.ri-pulse {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.danger {
    background: $c-red;
    box-shadow: 0 0 8px $c-red-glow;
    animation: pulseDanger 2s ease-in-out infinite;
  }
}

@keyframes pulseDanger {
  0%, 100% { box-shadow: 0 0 4px $c-red-glow; }
  50% { box-shadow: 0 0 12px $c-red-glow; }
}

.ri-dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.warn { background: $c-amber; }
}

.ri-body {
  flex: 1;
  min-width: 0;
}

.ri-project {
  font-size: 12px;
  font-weight: 600;
  color: $c-text;
  margin-bottom: 2px;
}

.ri-desc {
  font-size: 11px;
  color: $c-text-dim;
  line-height: 1.4;
  margin-bottom: 4px;
}

.ri-type-badge {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
  letter-spacing: 0.5px;

  &.type-unsalable { background: $c-red-dim; color: $c-red; }
  &.type-returnAbnormal { background: $c-amber-dim; color: $c-amber; }
  &.type-highInventory { background: $c-purple-dim; color: $c-purple; }
}

.ri-arrow {
  flex-shrink: 0;
  color: $c-blue;
  opacity: 0;
  transition: opacity 0.2s;
  margin-top: 4px;
}

.risk-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: $c-green;
  font-size: 12px;
}
</style>

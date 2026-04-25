<template>
  <div class="insight-bar" :class="levelClass">
    <div class="insight-indicator" />
    <span class="insight-tag">{{ levelTag }}</span>
    <span class="insight-text">{{ insight.text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  insight: { level: 'good' | 'warn' | 'danger'; text: string }
  time: string
}>()

const levelClass = computed(() => `level-${props.insight.level}`)

const levelTag = computed(() => {
  const map = { good: '健康', warn: '预警', danger: '告警' }
  return map[props.insight.level]
})
</script>

<style scoped lang="scss">
$c-green: #22C55E;
$c-green-dim: rgba(34, 197, 94, 0.15);
$c-amber: #F59E0B;
$c-amber-dim: rgba(245, 158, 11, 0.15);
$c-red: #EF4444;
$c-red-dim: rgba(239, 68, 68, 0.15);
$c-text: #e2e8f0;
$c-text-dim: #64748b;

.insight-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid;
  max-width: 100%;
  min-width: 0;
}

.insight-indicator {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.level-good {
  border-left-color: $c-green;
  .insight-indicator { background: $c-green; box-shadow: 0 0 6px $c-green-dim; }
  .insight-tag { color: $c-green; }
}
.level-warn {
  border-left-color: $c-amber;
  .insight-indicator { background: $c-amber; box-shadow: 0 0 6px $c-amber-dim; }
  .insight-tag { color: $c-amber; }
}
.level-danger {
  border-left-color: $c-red;
  .insight-indicator { background: $c-red; box-shadow: 0 0 6px $c-red-dim; }
  .insight-tag { color: $c-red; }
}

.insight-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  flex-shrink: 0;
}

.insight-text {
  font-size: 12px;
  color: $c-text;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

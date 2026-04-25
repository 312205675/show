<template>
  <div class="period-bar">
    <button
      v-for="p in periods"
      :key="p.key"
      class="period-btn"
      :class="{ active: modelValue === p.key }"
      @click="$emit('update:modelValue', p.key)"
    >{{ p.label }}</button>
  </div>
</template>

<script setup lang="ts">
export type PeriodKey = 'day' | 'week' | 'month' | 'year'

defineProps<{
  modelValue: PeriodKey
}>()

defineEmits<{
  'update:modelValue': [value: PeriodKey]
}>()

const periods: { key: PeriodKey; label: string }[] = [
  { key: 'day', label: '日' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' },
]
</script>

<style scoped lang="scss">
.period-bar {
  display: flex;
  gap: 2px;
  padding: 4px;
  border-radius: 8px;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  flex-shrink: 0;
  align-self: flex-start;
}

.period-btn {
  padding: 4px 10px;
  border-radius: 5px;
  border: none;
  background: transparent;
  color: var(--text-caption, #64748b);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;

  &:hover { color: var(--text-body, #cbd5e1); background: rgba(255,255,255,0.04); }

  &.active {
    background: rgba(99, 102, 241, 0.15);
    color: var(--primary, #60a5fa);
    box-shadow: 0 0 6px rgba(99,102,241,0.1);
  }
}
</style>

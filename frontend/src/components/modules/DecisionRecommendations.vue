<template>
  <div class="decision-rec">
    <div class="rec-header">
      <div class="rec-title-group">
        <span class="rec-icon">✦</span>
        <span class="rec-title">智能决策建议</span>
        <span class="rec-badge">{{ items.length }}</span>
      </div>
      <div class="rec-filters">
        <button v-for="f in filters" :key="f.key" class="rec-filter" :class="{ active: activeFilter === f.key }" @click="activeFilter = f.key">
          {{ f.label }}
        </button>
      </div>
    </div>
    <div class="rec-body">
      <TransitionGroup name="rec-list" tag="div" class="rec-list">
        <div v-for="item in filteredItems" :key="item.id" class="rec-card" :class="item.priority" @click="$emit('select', item)">
          <div class="rec-card-header">
            <span class="rec-priority" :class="item.priority">
              {{ item.priority === 'urgent' ? '紧急' : item.priority === 'important' ? '重要' : '建议' }}
            </span>
            <span class="rec-category">{{ item.category }}</span>
          </div>
          <div class="rec-card-title">{{ item.title }}</div>
          <div class="rec-card-desc">{{ item.description }}</div>
          <div class="rec-card-impact">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{{ item.impact }}</span>
          </div>
          <div v-if="item.project" class="rec-card-project">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {{ item.project }}
          </div>
        </div>
      </TransitionGroup>
      <div v-if="filteredItems.length === 0" class="rec-empty">暂无该类型建议</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RecommendationItem } from '@/utils/mockData'

const props = defineProps<{
  items: RecommendationItem[]
}>()

defineEmits<{
  select: [item: RecommendationItem]
}>()

const activeFilter = ref<'all' | 'urgent' | 'important' | 'suggested'>('all')

const filters = [
  { key: 'all' as const, label: '全部' },
  { key: 'urgent' as const, label: '紧急' },
  { key: 'important' as const, label: '重要' },
  { key: 'suggested' as const, label: '建议' },
]

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return props.items
  return props.items.filter(i => i.priority === activeFilter.value)
})
</script>

<style scoped lang="scss">
.decision-rec {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.rec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 6px;
  flex-shrink: 0;
}

.rec-title-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rec-icon {
  font-size: 13px;
  color: var(--primary, #60a5fa);
  animation: recGlow 2.5s ease-in-out infinite;
}

@keyframes recGlow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.rec-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-title, #e2e8f0);
}

.rec-badge {
  font-size: 10px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  padding: 1px 6px;
  border-radius: 8px;
  background: var(--primary-light, rgba(96, 165, 250, 0.12));
  color: var(--primary, #60a5fa);
}

.rec-filters {
  display: flex;
  gap: 2px;
}

.rec-filter {
  padding: 3px 8px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--text-caption, #64748b);
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-body, #cbd5e1);
  }

  &.active {
    background: var(--primary-light, rgba(96, 165, 250, 0.12));
    color: var(--primary, #60a5fa);
  }
}

.rec-body {
  flex: 1;
  overflow-y: auto;
  padding: 4px 10px 10px;
}

.rec-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rec-card {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &.urgent {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.15);
    &:hover { border-color: var(--danger, #EF4444); box-shadow: 0 4px 16px rgba(239, 68, 68, 0.15); transform: translateX(3px); }
  }
  &.important {
    background: rgba(245, 158, 11, 0.08);
    border-color: rgba(245, 158, 11, 0.15);
    &:hover { border-color: var(--warning, #F59E0B); box-shadow: 0 4px 16px rgba(245, 158, 11, 0.12); transform: translateX(3px); }
  }
  &.suggested {
    background: rgba(96, 165, 250, 0.06);
    border-color: rgba(96, 165, 250, 0.1);
    &:hover { border-color: var(--primary, #60a5fa); box-shadow: 0 4px 16px rgba(96, 165, 250, 0.1); transform: translateX(3px); }
  }
}

.rec-card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.rec-priority {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;

  &.urgent { background: rgba(239, 68, 68, 0.2); color: var(--danger, #EF4444); }
  &.important { background: rgba(245, 158, 11, 0.2); color: var(--warning, #F59E0B); }
  &.suggested { background: rgba(96, 165, 250, 0.15); color: var(--primary, #60a5fa); }
}

.rec-category {
  font-size: 9px;
  font-weight: 600;
  color: var(--text-caption, #64748b);
  padding: 1px 4px;
  background: var(--surface, rgba(255, 255, 255, 0.03));
  border-radius: 2px;
}

.rec-card-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-title, #e2e8f0);
  margin-bottom: 3px;
}

.rec-card-desc {
  font-size: 10px;
  color: var(--text-caption, #64748b);
  line-height: 1.4;
  margin-bottom: 6px;
}

.rec-card-impact {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--success, #22C55E);
  font-weight: 500;
  padding: 3px 6px;
  background: rgba(34, 197, 94, 0.06);
  border-radius: 4px;
}

.rec-card-project {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  color: var(--text-caption, #64748b);
  margin-top: 4px;
}

.rec-empty {
  text-align: center;
  padding: 20px;
  font-size: 11px;
  color: var(--text-caption, #64748b);
}

.rec-list-enter-active,
.rec-list-leave-active {
  transition: all 0.3s ease;
}
.rec-list-enter-from { opacity: 0; transform: translateX(-10px); }
.rec-list-leave-to { opacity: 0; transform: translateX(10px); }
</style>

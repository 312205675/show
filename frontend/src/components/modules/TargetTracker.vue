<template>
  <div class="target-tracker" :class="{ compact }">
    <div v-for="item in targets" :key="item.label" class="target-row" :class="[item.status, { compact }]">
      <div class="target-head">
        <span class="target-label">{{ item.label }}</span>
        <div class="target-values">
          <span class="target-actual">{{ item.actual }}<small>{{ item.unit }}</small></span>
          <span class="target-divider">/</span>
          <span class="target-goal">{{ item.target }}<small>{{ item.unit }}</small></span>
        </div>
      </div>
      <div class="target-bar-row">
        <div class="target-bar">
          <div class="target-bar-fill" :style="{ width: Math.min(item.progress, 100) + '%' }" :class="item.status" />
          <div class="target-bar-marker" :style="{ left: '75%' }" />
        </div>
        <span class="target-pct" :class="item.status">{{ item.progress.toFixed(1) }}%</span>
      </div>
      <div v-if="!compact" class="target-footer">
        <span class="target-yoy" :class="item.yoy >= 0 ? 'up' : 'down'">
          同比 {{ item.yoy >= 0 ? '+' : '' }}{{ item.yoy }}%
        </span>
        <span class="target-mom" :class="item.mom >= 0 ? 'up' : 'down'">
          环比 {{ item.mom >= 0 ? '+' : '' }}{{ item.mom }}%
        </span>
        <span class="target-status-text" :class="item.status">
          {{ item.status === 'on-track' ? '达标' : item.status === 'at-risk' ? '有风险' : '落后' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TargetItem } from '@/utils/mockData'

withDefaults(defineProps<{
  targets: TargetItem[]
  compact?: boolean
}>(), {
  compact: false,
})
</script>

<style scoped lang="scss">
.target-tracker {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 10px 8px;

  &.compact {
    flex-direction: row;
    gap: 6px;
    padding: 4px 8px 6px;
    overflow-x: auto;
  }
}

.target-row {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.25s;
  flex-shrink: 0;

  &.compact {
    min-width: 170px;
    padding: 6px 8px;
  }

  &.on-track {
    background: rgba(34, 197, 94, 0.06);
    border-color: rgba(34, 197, 94, 0.12);
  }
  &.at-risk {
    background: rgba(245, 158, 11, 0.06);
    border-color: rgba(245, 158, 11, 0.12);
  }
  &.behind {
    background: rgba(239, 68, 68, 0.06);
    border-color: rgba(239, 68, 68, 0.12);
  }
}

.target-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.target-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-title, #e2e8f0);

  .compact & { font-size: 10px; }
}

.target-values {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.target-actual {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-body, #cbd5e1);

  .compact & { font-size: 12px; }

  small {
    font-size: 9px;
    font-weight: 500;
    opacity: 0.6;
    margin-left: 1px;
  }
}

.target-divider {
  font-size: 10px;
  color: var(--text-caption, #64748b);
  opacity: 0.5;
}

.target-goal {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-caption, #64748b);

  .compact & { font-size: 10px; }

  small {
    font-size: 9px;
    opacity: 0.6;
    margin-left: 1px;
  }
}

.target-bar-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}

.target-bar {
  flex: 1;
  height: 5px;
  background: var(--bar-track, rgba(255, 255, 255, 0.05));
  border-radius: 3px;
  overflow: visible;
  position: relative;

  .compact & { height: 4px; }
}

.target-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);

  &.on-track { background: linear-gradient(90deg, #22C55E, #4ade80); }
  &.at-risk { background: linear-gradient(90deg, #F59E0B, #fbbf24); }
  &.behind { background: linear-gradient(90deg, #EF4444, #f87171); }
}

.target-bar-marker {
  position: absolute;
  top: -2px;
  width: 2px;
  height: 9px;
  background: var(--text-caption, #64748b);
  border-radius: 1px;
  opacity: 0.5;

  .compact & { height: 8px; }
}

.target-pct {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  min-width: 44px;
  text-align: right;

  .compact & { font-size: 10px; min-width: 38px; }

  &.on-track { color: var(--success, #22C55E); }
  &.at-risk { color: var(--warning, #F59E0B); }
  &.behind { color: var(--danger, #EF4444); }
}

.target-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.target-yoy, .target-mom {
  font-size: 9px;
  font-weight: 600;

  &.up { color: var(--success, #22C55E); }
  &.down { color: var(--danger, #EF4444); }
}

.target-status-text {
  font-size: 9px;
  font-weight: 700;
  margin-left: auto;
  padding: 1px 5px;
  border-radius: 3px;

  &.on-track { background: rgba(34, 197, 94, 0.12); color: var(--success, #22C55E); }
  &.at-risk { background: rgba(245, 158, 11, 0.12); color: var(--warning, #F59E0B); }
  &.behind { background: rgba(239, 68, 68, 0.12); color: var(--danger, #EF4444); }
}
</style>

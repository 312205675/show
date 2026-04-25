<template>
  <div class="project-matrix">
    <div class="matrix-header">
      <div class="matrix-title">
        <span class="title-bar" />
        项目分布
        <span class="title-count">{{ projects.length }}个项目</span>
      </div>
      <div class="matrix-legend">
        <span class="legend-item"><span class="dot green" />去化≥70%</span>
        <span class="legend-item"><span class="dot yellow" />去化50-70%</span>
        <span class="legend-item"><span class="dot red" />去化&lt;50%</span>
      </div>
    </div>

    <div class="matrix-summary">
      <div class="summary-item">
        <span class="summary-val green">{{ summary.green }}</span>
        <span class="summary-lbl">健康</span>
      </div>
      <div class="summary-item">
        <span class="summary-val yellow">{{ summary.yellow }}</span>
        <span class="summary-lbl">关注</span>
      </div>
      <div class="summary-item">
        <span class="summary-val red">{{ summary.red }}</span>
        <span class="summary-lbl">预警</span>
      </div>
    </div>

    <div class="matrix-grid">
      <div
        v-for="project in projects"
        :key="project.name"
        class="matrix-card card-3d"
        :class="`status-${project.status}`"
        :style="{ '--scale': cardScale(project.salesAmount) }"
        @click="emit('select', project)"
        @mouseenter="hovered = project.name"
        @mouseleave="hovered = null"
      >
        <div class="card-top">
          <div class="card-name">{{ project.name }}</div>
          <div class="card-city">{{ project.city }}</div>
        </div>
        <div class="card-rate" :class="`rate-${project.status}`">
          {{ project.depletionRate.toFixed(1) }}<span class="rate-unit">%</span>
        </div>
        <div class="card-meta">
          <span class="meta-item">{{ project.soldUnits }}/{{ project.totalUnits }}套</span>
          <span class="meta-item">{{ project.salesAmount }}亿</span>
        </div>
        <div class="card-return" :class="{ low: project.returnRate < 70 }">
          <span class="return-label">回款</span>
          <span class="return-val">{{ project.returnRate.toFixed(1) }}%</span>
          <div class="return-bar">
            <div class="return-bar-fill" :style="{ width: project.returnRate + '%' }" :class="`fill-${project.returnRate >= 80 ? 'good' : project.returnRate >= 60 ? 'warn' : 'bad'}`" />
          </div>
        </div>
        <div class="card-arrow">→</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProjectItem } from '@/utils/mockData'

const props = defineProps<{
  projects: ProjectItem[]
}>()

const emit = defineEmits<{
  select: [project: ProjectItem]
}>()

const hovered = ref<string | null>(null)

const summary = computed(() => {
  const p = props.projects
  return {
    green: p.filter(x => x.status === 'green').length,
    yellow: p.filter(x => x.status === 'yellow').length,
    red: p.filter(x => x.status === 'red').length,
  }
})

function cardScale(amount: number): number {
  const min = 0.85
  const max = 1.05
  const maxAmount = 30
  return min + (Math.min(amount, maxAmount) / maxAmount) * (max - min)
}
</script>

<style scoped lang="scss">
.project-matrix {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
}

.matrix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.matrix-title {
  font-size: 13px;
  font-weight: 600;
  color: $gray-200;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-bar {
  width: 3px;
  height: 14px;
  border-radius: 1px;
  background: $accent-blue;
}

.title-count {
  font-size: 11px;
  color: $gray-500;
  font-weight: 400;
}

.matrix-legend {
  display: flex;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: $gray-500;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  &.green { background: $accent-green; }
  &.yellow { background: $accent-amber; }
  &.red { background: $accent-red; }
}

.matrix-summary {
  display: flex;
  gap: 16px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.summary-val {
  font-family: $font-digital;
  font-size: 16px;
  font-weight: 700;

  &.green { color: $accent-green; }
  &.yellow { color: $accent-amber; }
  &.red { color: $accent-red; }
}

.summary-lbl {
  font-size: 10px;
  color: $gray-500;
}

.matrix-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  overflow-y: auto;
  align-content: start;
}

.matrix-card {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transform: scale(var(--scale, 1));
  transform-origin: center;
  position: relative;

  &.status-green {
    background: $accent-green-light;
    border-color: $accent-green-light;
  }
  &.status-yellow {
    background: $accent-amber-light;
    border-color: $accent-amber-light;
  }
  &.status-red {
    background: $accent-red-light;
    border-color: $accent-red-light;
  }

  &:hover {
    transform: scale(var(--scale, 1)) translateY(-3px);
    &.status-green { border-color: $accent-green; box-shadow: 0 4px 16px $accent-green-light; }
    &.status-yellow { border-color: $accent-amber; box-shadow: 0 4px 16px $accent-amber-light; }
    &.status-red { border-color: $accent-red; box-shadow: 0 4px 16px $accent-red-light; }

    .card-arrow { opacity: 1; }
  }
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-name {
  font-size: 12px;
  font-weight: 600;
  color: $gray-100;
}

.card-city {
  font-size: 9px;
  color: $gray-500;
  padding: 1px 4px;
  background: $surface;
  border-radius: 2px;
}

.card-rate {
  font-family: $font-digital;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;

  &.rate-green { color: $accent-green; }
  &.rate-yellow { color: $accent-amber; }
  &.rate-red { color: $accent-red; }
}

.rate-unit {
  font-size: 12px;
  opacity: 0.6;
  margin-left: 1px;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: $gray-500;
}

.card-return {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;

  &.low {
    .return-val { color: $accent-red; font-weight: 600; }
  }
}

.return-label {
  font-size: 9px;
  color: $gray-500;
  flex-shrink: 0;
}

.return-val {
  font-family: $font-digital;
  font-size: 11px;
  color: $gray-400;
  flex-shrink: 0;
}

.return-bar {
  flex: 1;
  height: 2px;
  background: $bar-track;
  border-radius: 1px;
  overflow: hidden;
}

.return-bar-fill {
  height: 100%;
  border-radius: 1px;
  transition: width 0.6s ease;

  &.fill-good { background: $accent-green; }
  &.fill-warn { background: $accent-amber; }
  &.fill-bad { background: $accent-red; }
}

.card-arrow {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 10px;
  color: $accent-blue;
  opacity: 0;
  transition: opacity 0.2s;
}
</style>

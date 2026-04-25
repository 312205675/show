<template>
  <div class="mode-toggle" :class="{ 'is-3d': themeStore.is3D }">
    <button
      class="mode-btn"
      :class="{ active: !themeStore.is3D }"
      @click="themeStore.setViewMode('2d')"
      title="2D 数据大屏"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
      <span class="mode-label">2D</span>
    </button>
    <button
      class="mode-btn"
      :class="{ active: themeStore.is3D }"
      @click="themeStore.setViewMode('3d')"
      title="3D 沉浸模式"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
      <span class="mode-label">3D</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/theme'

const themeStore = useThemeStore()
</script>

<style scoped lang="scss">
.mode-toggle {
  display: flex;
  align-items: center;
  background: $surface;
  border: 1px solid $border-color;
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
  transition: all 0.3s;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: $gray-500;
  font-size: 11px;
  font-weight: 600;
  font-family: $font-digital;
  cursor: pointer;
  transition: all 0.25s;
  letter-spacing: 0.5px;

  &:hover {
    color: $gray-300;
    background: $surface-hover;
  }

  &.active {
    background: $accent-blue;
    color: #fff;
    box-shadow: 0 2px 8px rgba(74, 158, 255, 0.35);
  }
}

.mode-label {
  font-size: 10px;
  line-height: 1;
}
</style>

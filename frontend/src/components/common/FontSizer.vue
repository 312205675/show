<template>
  <div class="font-sizer">
    <button class="fs-btn" @click="themeStore.decreaseFont()" title="缩小字体">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </button>
    <button class="fs-btn fs-reset" @click="themeStore.resetFont()" title="重置字体">
      <span class="fs-label">{{ Math.round(themeStore.fontScale * 100) }}%</span>
    </button>
    <button class="fs-btn" @click="themeStore.increaseFont()" title="放大字体">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/theme'
const themeStore = useThemeStore()
</script>

<style scoped lang="scss">
.font-sizer {
  display: flex;
  align-items: center;
  gap: 2px;
  background: $surface;
  border: 1px solid $border-color;
  border-radius: 6px;
  padding: 2px;
}

.fs-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: $gray-500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;

  &:hover {
    background: $surface-hover;
    color: $gray-300;
  }
}

.fs-reset {
  width: auto;
  padding: 0 4px;
}

.fs-label {
  font-family: $font-digital;
  font-size: 9px;
  font-weight: 600;
  color: $gray-400;
  letter-spacing: 0.5px;
}
</style>

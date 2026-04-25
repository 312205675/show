<template>
  <div class="page-nav">
    <button class="nav-arrow left" :class="{ disabled: currentPage === 0 }" @click="go(-1)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <div class="nav-tabs" ref="tabsRef">
      <div class="tab-slider" :style="sliderStyle" />
      <button
        v-for="(page, i) in pages"
        :key="page.key"
        class="nav-tab"
        :class="{ active: i === currentPage }"
        :ref="el => { if (el) tabEls[i] = el as HTMLElement }"
        @click="emit('change', i)"
      >
        <span class="tab-icon">{{ page.icon }}</span>
        <span class="tab-label">{{ page.label }}</span>
      </button>
    </div>
    <button class="nav-arrow right" :class="{ disabled: currentPage === pages.length - 1 }" @click="go(1)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'

const props = defineProps<{
  currentPage: number
  pages: { key: string; label: string; icon?: string }[]
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const tabsRef = ref<HTMLElement | null>(null)
const tabEls = ref<HTMLElement[]>([])

const sliderStyle = computed(() => {
  const el = tabEls.value[props.currentPage]
  if (!el || !tabsRef.value) return { left: '0px', width: '0px' }
  const parentRect = tabsRef.value.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    left: `${elRect.left - parentRect.left}px`,
    width: `${elRect.width}px`,
  }
})

function go(delta: number) {
  const next = props.currentPage + delta
  if (next >= 0 && next < props.pages.length) {
    emit('change', next)
  }
}

onMounted(() => {
  nextTick(() => { tabEls.value = [...tabEls.value] })
})

watch(() => props.currentPage, () => {
  nextTick(() => { tabEls.value = [...tabEls.value] })
})
</script>

<style scoped lang="scss">
.page-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-arrow {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  background: var(--surface, rgba(255, 255, 255, 0.03));
  color: var(--text-caption, #64748b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;

  &:hover:not(.disabled) {
    background: var(--primary-light, rgba(96, 165, 250, 0.12));
    border-color: rgba(96, 165, 250, 0.2);
    color: var(--primary, #60a5fa);
    box-shadow: 0 0 8px rgba(96, 165, 250, 0.15);
  }

  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.nav-tabs {
  display: flex;
  gap: 2px;
  position: relative;
  padding: 3px;
  border-radius: 8px;
  background: var(--surface, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
}

.tab-slider {
  position: absolute;
  top: 3px;
  height: calc(100% - 6px);
  border-radius: 6px;
  background: var(--primary-light, rgba(96, 165, 250, 0.15));
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.12);
  transition: left 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  z-index: 1;

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.04);
  }

  &.active {
    .tab-icon {
      color: var(--primary, #60a5fa);
      text-shadow: 0 0 8px rgba(96, 165, 250, 0.4);
      transform: scale(1.15);
    }

    .tab-label {
      color: var(--text-title, #e2e8f0);
      font-weight: 700;
    }
  }
}

.tab-icon {
  font-size: 12px;
  color: var(--text-caption, #64748b);
  transition: all 0.3s ease;
}

.tab-label {
  font-size: 10px;
  color: var(--text-caption, #64748b);
  white-space: nowrap;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.25s ease;
}

@media (max-width: 768px) {
  .tab-label { display: none; }
  .nav-tab { padding: 5px 8px; }
  .tab-icon { font-size: 14px; }
}
</style>

<template>
  <div class="page-nav">
    <button class="nav-arrow left" :class="{ disabled: currentPage === 0 }" @click="go(-1)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <div class="nav-tabs" ref="tabsRef">
      <div class="tab-slider" :style="sliderStyle" />
      <button
        v-for="(page, i) in orderedPages"
        :key="page.key"
        class="nav-tab"
        :class="{ active: page.key === currentKey, 'drag-over': dragOverIndex === i }"
        :draggable="true"
        :ref="el => { if (el) tabEls[i] = el as HTMLElement }"
        @click="handleTabClick(page.key)"
        @dragstart="onDragStart($event, i)"
        @dragover.prevent="onDragOver($event, i)"
        @dragleave="onDragLeave(i)"
        @drop="onDrop($event, i)"
        @dragend="onDragEnd"
      >
        <span class="tab-icon">{{ page.icon }}</span>
        <span class="tab-label">{{ page.label }}</span>
        <span class="drag-handle" title="拖拽排序">⠿</span>
      </button>
    </div>
    <button class="nav-arrow right" :class="{ disabled: currentPage === pages.length - 1 }" @click="go(1)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useSound } from '@/composables/useSound'

const { playTabSwitchSound } = useSound()

interface PageItem {
  key: string
  label: string
  icon?: string
  component?: unknown
}

const props = defineProps<{
  currentPage: number
  pages: PageItem[]
}>()

const emit = defineEmits<{
  change: [page: number]
  reorder: [pages: PageItem[]]
}>()

const tabsRef = ref<HTMLElement | null>(null)
const tabEls = ref<HTMLElement[]>([])

// Draggable order
const orderedPages = ref<PageItem[]>([...props.pages])
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const currentKey = computed(() => orderedPages.value[props.currentPage]?.key ?? props.pages[props.currentPage]?.key)

// Sync when external pages change
watch(() => props.pages, (newPages) => {
  const currentKeys = orderedPages.value.map(p => p.key)
  const newKeys = newPages.map(p => p.key)
  if (currentKeys.join(',') !== newKeys.join(',')) {
    orderedPages.value = [...newPages]
  }
}, { deep: true })

const sliderStyle = computed(() => {
  const idx = props.currentPage
  const el = tabEls.value[idx]
  if (!el || !tabsRef.value) return { left: '0px', width: '0px' }
  const parentRect = tabsRef.value.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    left: `${elRect.left - parentRect.left}px`,
    width: `${elRect.width}px`,
  }
})

function handleTabClick(key: string) {
  const idx = orderedPages.value.findIndex(p => p.key === key)
  if (idx >= 0) {
    playTabSwitchSound()
    emit('change', idx)
  }
}

function go(delta: number) {
  const next = props.currentPage + delta
  if (next >= 0 && next < orderedPages.value.length) {
    playTabSwitchSound()
    emit('change', next)
  }
}

// ===== Drag & Drop =====
function onDragStart(e: DragEvent, index: number) {
  dragIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }
  const target = e.target as HTMLElement
  target.classList.add('dragging')
}

function onDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dragOverIndex.value = index
}

function onDragLeave(_index: number) {
  dragOverIndex.value = null
}

function onDrop(_e: DragEvent, targetIndex: number) {
  const fromIndex = dragIndex.value
  if (fromIndex === null || fromIndex === targetIndex) {
    dragOverIndex.value = null
    return
  }
  const newPages = [...orderedPages.value]
  const [moved] = newPages.splice(fromIndex, 1)
  newPages.splice(targetIndex, 0, moved)
  orderedPages.value = newPages
  const currentKeyVal = currentKey.value
  const newIdx = newPages.findIndex(p => p.key === currentKeyVal)
  if (newIdx >= 0) {
    emit('change', newIdx)
  }
  emit('reorder', newPages)
  dragOverIndex.value = null
  dragIndex.value = null
}

function onDragEnd(e: DragEvent) {
  const target = e.target as HTMLElement
  target.classList.remove('dragging')
  dragIndex.value = null
  dragOverIndex.value = null
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
  gap: 6px;
}

.nav-arrow {
  width: 34px;
  height: 34px;
  border-radius: 8px;
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
    border-color: rgba(96, 165, 250, 0.25);
    color: var(--primary, #60a5fa);
    box-shadow: 0 0 12px rgba(96, 165, 250, 0.15);
  }

  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.nav-tabs {
  display: flex;
  gap: 3px;
  position: relative;
  padding: 4px;
  border-radius: 10px;
  background: var(--surface, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
}

.tab-slider {
  position: absolute;
  top: 4px;
  height: calc(100% - 8px);
  border-radius: 7px;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.18), rgba(99, 102, 241, 0.12));
  border: 1px solid rgba(96, 165, 250, 0.25);
  box-shadow: 0 0 16px rgba(96, 165, 250, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 7px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  user-select: none;

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.04);
  }

  &.active {
    .tab-icon {
      color: var(--primary, #60a5fa);
      text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
      transform: scale(1.2);
    }

    .tab-label {
      color: var(--text-title, #e2e8f0);
      font-weight: 700;
      letter-spacing: 0.5px;
    }
  }

  &.dragging {
    opacity: 0.4;
    transform: scale(0.95);
  }

  &.drag-over {
    border-left: 2px solid var(--primary, #60a5fa);
    padding-left: 12px;
  }
}

.drag-handle {
  font-size: 9px;
  color: var(--text-caption, #64748b);
  opacity: 0;
  transition: opacity 0.2s;
  margin-left: 2px;
  cursor: grab;

  .nav-tab:hover & {
    opacity: 0.5;
  }
}

.tab-icon {
  font-size: 16px;
  color: var(--text-caption, #64748b);
  transition: all 0.3s ease;
}

.tab-label {
  font-size: 12px;
  color: var(--text-caption, #64748b);
  white-space: nowrap;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .tab-label { display: none; }
  .drag-handle { display: none; }
  .nav-tab { padding: 6px 10px; }
  .tab-icon { font-size: 16px; }
  .nav-arrow { width: 30px; height: 30px; }
}
</style>

<template>
  <div class="theme-switcher" ref="switcherRef">
    <button class="theme-btn" @click.stop="showPanel = !showPanel" :title="themeStore.config.label">
      <svg v-if="themeStore.mode === 'dark'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
    </button>
    <Transition name="panel">
      <div v-if="showPanel" class="theme-panel" @click.stop>
        <div class="panel-section" v-for="group in THEME_GROUPS" :key="group.group">
          <div class="section-label">{{ group.label }}</div>
          <div class="theme-options">
            <button
              v-for="tKey in group.themes"
              :key="tKey"
              class="theme-option"
              :class="{ active: themeStore.current === tKey }"
              @click="switchTheme(tKey)"
            >
              <span class="option-preview" :style="{ background: THEMES[tKey].preview }">
                <span class="preview-dot" :style="{ background: THEMES[tKey].primary }" />
              </span>
              <span class="option-info">
                <span class="option-label">{{ THEMES[tKey].label }}</span>
                <span class="option-desc">{{ THEMES[tKey].description }}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore, THEMES, THEME_GROUPS, type ThemeKey } from '@/store/theme'

const themeStore = useThemeStore()
const showPanel = ref(false)
const switcherRef = ref<HTMLElement | null>(null)

function switchTheme(key: ThemeKey) {
  themeStore.setTheme(key)
  showPanel.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (switcherRef.value && !switcherRef.value.contains(e.target as Node)) {
    showPanel.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<style scoped lang="scss">
.theme-switcher {
  position: relative;
}

.theme-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  background: var(--surface, rgba(255, 255, 255, 0.03));
  color: var(--text-caption, #64748b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: var(--surface-hover, rgba(255, 255, 255, 0.06));
    border-color: var(--primary-light, rgba(96, 165, 250, 0.12));
    color: var(--primary, #60a5fa);
  }
}

.theme-panel {
  position: absolute;
  top: 38px;
  right: 0;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  border-radius: 10px;
  padding: 14px;
  min-width: 260px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.panel-section {
  & + & {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  }
}

.section-label {
  font-size: 10px;
  color: var(--text-caption, #64748b);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 8px;
}

.theme-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-family: $font-cn;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: var(--surface, rgba(255, 255, 255, 0.03));
  }

  &.active {
    background: var(--primary-light, rgba(96, 165, 250, 0.12));
    border-color: var(--primary-light, rgba(96, 165, 250, 0.12));

    .option-label {
      color: var(--primary, #60a5fa);
    }
  }
}

.option-preview {
  width: 32px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.preview-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
  bottom: 3px;
  right: 3px;
}

.option-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.option-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-title, #e2e8f0);
  white-space: nowrap;
}

.option-desc {
  font-size: 10px;
  color: var(--text-caption, #64748b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Panel transition
.panel-enter-active, .panel-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.panel-enter-from, .panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

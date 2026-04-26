<template>
  <div class="staff-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="brand" v-show="!sidebarCollapsed">
          <div class="brand-icon">S</div>
          <div class="brand-text">
            <span class="brand-name">SmartEstate</span>
            <span class="brand-sub">楼盘工作台</span>
          </div>
        </div>
        <div class="brand-collapsed" v-show="sidebarCollapsed">S</div>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: $route.path === item.path }"
          @mouseenter="showNavTooltip(item.path, $event)"
          @mouseleave="hideNavTooltip"
        >
          <span class="nav-icon" v-html="item.iconSvg"></span>
          <span class="nav-label" v-show="!sidebarCollapsed">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" :style="{ transform: sidebarCollapsed ? 'rotate(180deg)' : '' }">
            <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        <router-link to="/dashboard" class="back-dashboard" v-show="!sidebarCollapsed">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L1 7h3v7h3v-4h2v4h3V7h3L8 1z"/></svg>
          <span>返回决策大盘</span>
        </router-link>
      </div>
    </aside>

    <!-- 主内容 -->
    <main class="staff-main">
      <header class="staff-header">
        <div class="header-left">
          <h1 class="page-title">{{ currentTitle }}</h1>
          <span class="page-breadcrumb">楼盘工作台 / {{ currentTitle }}</span>
        </div>
        <div class="header-right">
          <span class="header-time">{{ currentTime }}</span>

          <!-- 帮助按钮 -->
          <button class="help-btn" @click="startGuide" title="新手引导">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>

          <!-- 主题切换器 -->
          <div class="theme-switcher" ref="switcherRef">
            <button class="theme-btn" @click="showThemePanel = !showThemePanel" :title="currentThemeLabel">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </button>
            <div class="theme-panel" v-if="showThemePanel" @click.stop>
              <div class="theme-panel-title">切换皮肤</div>
              <div class="theme-options">
                <button
                  v-for="opt in themeOptions"
                  :key="opt.key"
                  class="theme-option"
                  :class="{ active: currentTheme === opt.key }"
                  @click="setTheme(opt.key); showThemePanel = false"
                >
                  <div class="theme-preview" :style="{ background: opt.preview.bg }">
                    <div class="theme-preview-accent" :style="{ background: opt.preview.accent }"></div>
                  </div>
                  <div class="theme-option-info">
                    <span class="theme-option-label">{{ opt.label }}</span>
                    <span class="theme-option-desc">{{ opt.desc }}</span>
                  </div>
                  <svg v-if="currentTheme === opt.key" class="theme-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="user-avatar">张</div>
        </div>
      </header>
      <div class="staff-content">
        <!-- 页面欢迎提示 -->
        <Transition name="page-hint">
          <div v-if="showPageHint && currentPageGuide" class="page-hint-banner">
            <span class="page-hint-icon">{{ currentPageGuide.icon }}</span>
            <div class="page-hint-body">
              <div class="page-hint-title">{{ currentPageGuide.label }} · 功能说明</div>
              <div class="page-hint-desc">{{ currentPageGuide.detail }}</div>
              <div class="page-hint-tips" v-if="currentPageGuide.tips.length">
                <span class="page-hint-tip" v-for="(tip, i) in currentPageGuide.tips" :key="i">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ tip }}
                </span>
              </div>
            </div>
            <button class="page-hint-close" @click="closePageHint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </Transition>
        <router-view />
      </div>
    </main>

    <!-- 导航菜单悬浮提示 -->
    <Teleport to="body">
      <Transition name="nav-tooltip">
        <div
          v-if="hoveredNav && !guideActive"
          class="nav-tooltip-overlay"
          :style="tooltipStyle"
        >
          <div class="nav-tooltip-card">
            <div class="nav-tooltip-header">
              <span class="nav-tooltip-emoji">{{ menuGuides.find(m => m.path === hoveredNav)?.icon }}</span>
              <span class="nav-tooltip-label">{{ menuGuides.find(m => m.path === hoveredNav)?.label }}</span>
            </div>
            <div class="nav-tooltip-desc">{{ menuGuides.find(m => m.path === hoveredNav)?.description }}</div>
            <div class="nav-tooltip-tips" v-if="menuGuides.find(m => m.path === hoveredNav)?.tips.length">
              <span class="nav-tooltip-tip" v-for="(tip, i) in menuGuides.find(m => m.path === hoveredNav)?.tips" :key="i">
                {{ tip }}
              </span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 新手引导遮罩 -->
    <Teleport to="body">
      <Transition name="guide-fade">
        <div v-if="guideActive" class="guide-overlay" @click.self="skipGuide">
          <!-- 聚光灯高亮区域 -->
          <div class="guide-spotlight" :style="spotlightStyle"></div>
          <!-- 引导弹窗 -->
          <div class="guide-tooltip" :style="guideTooltipStyle" @click.stop>
            <div class="guide-tooltip-header">
              <span class="guide-step-icon">{{ currentStep?.icon }}</span>
              <span class="guide-step-title">{{ currentStep?.title }}</span>
              <span class="guide-step-badge">{{ currentStepIndex + 1 }} / {{ totalSteps }}</span>
            </div>
            <div class="guide-tooltip-body">{{ currentStep?.description }}</div>
            <div class="guide-tooltip-progress">
              <div class="guide-progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="guide-tooltip-actions">
              <button class="guide-btn guide-btn-skip" @click="skipGuide">跳过引导</button>
              <div class="guide-btn-group">
                <button v-if="!isFirstStep" class="guide-btn guide-btn-prev" @click="prevStep">上一步</button>
                <button v-if="!isLastStep" class="guide-btn guide-btn-next" @click="nextStep">下一步</button>
                <button v-if="isLastStep" class="guide-btn guide-btn-finish" @click="finishGuide">完成引导</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStaffTheme, themeOptions } from '@/composables/useStaffTheme'
import { useGuide, menuGuides } from '@/composables/useGuide'

const route = useRoute()
const { currentTheme, setTheme } = useStaffTheme()
const {
  guideActive, currentStepIndex, currentStep, totalSteps,
  isFirstStep, isLastStep, progress, guideCompleted,
  startGuide, nextStep, prevStep, skipGuide, finishGuide,
  isPageFirstVisit, dismissPageHint, getMenuGuide, checkAutoStart,
} = useGuide()

const sidebarCollapsed = ref(false)
const showThemePanel = ref(false)
const switcherRef = ref<HTMLElement | null>(null)

// Nav item tooltip
const hoveredNav = ref<string | null>(null)
const tooltipStyle = ref<Record<string, string>>({})
const tooltipTimer = ref<ReturnType<typeof setTimeout> | null>(null)

// Page welcome hint
const showPageHint = ref(false)
const currentPageGuide = computed(() => getMenuGuide(route.path))

// Spotlight position
const spotlightStyle = computed(() => {
  if (!guideActive.value) return {}
  const step = currentStep.value
  if (!step) return {}
  const el = document.querySelector(step.target) as HTMLElement
  if (!el) return {}
  const rect = el.getBoundingClientRect()
  const pad = 8
  return {
    top: `${rect.top - pad}px`,
    left: `${rect.left - pad}px`,
    width: `${rect.width + pad * 2}px`,
    height: `${rect.height + pad * 2}px`,
  }
})

// Guide tooltip position
const guideTooltipStyle = computed(() => {
  if (!guideActive.value) return {}
  const step = currentStep.value
  if (!step) return {}
  const el = document.querySelector(step.target) as HTMLElement
  if (!el) return {}
  const rect = el.getBoundingClientRect()
  const pos = step.position || 'right'
  const gap = 16

  switch (pos) {
    case 'right':
      return { top: `${rect.top}px`, left: `${rect.right + gap}px` }
    case 'left':
      return { top: `${rect.top}px`, right: `${window.innerWidth - rect.left + gap}px` }
    case 'bottom':
      return { top: `${rect.bottom + gap}px`, left: `${rect.left}px` }
    case 'top':
      return { bottom: `${window.innerHeight - rect.top + gap}px`, left: `${rect.left}px` }
    default:
      return { top: `${rect.top}px`, left: `${rect.right + gap}px` }
  }
})

function showNavTooltip(path: string, event: MouseEvent) {
  if (guideActive.value) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  hoveredNav.value = path
  tooltipStyle.value = {
    top: `${rect.top}px`,
    left: `${rect.right + 12}px`,
  }
}

function hideNavTooltip() {
  hoveredNav.value = null
}

// Watch route for page hints
watch(() => route.path, (path) => {
  if (isPageFirstVisit(path) && !guideActive.value) {
    showPageHint.value = true
    dismissPageHint(path)
  } else {
    showPageHint.value = false
  }
}, { immediate: true })

function closePageHint() {
  showPageHint.value = false
}

const currentThemeLabel = computed(() => {
  return themeOptions.find(o => o.key === currentTheme.value)?.label || '暗夜黑'
})

const navItems = menuGuides.map(m => ({
  path: m.path,
  label: m.label,
  description: m.description,
  iconEmoji: m.icon,
  iconSvg: getIconSvg(m.path),
}))

function getIconSvg(path: string): string {
  const icons: Record<string, string> = {
    '/staff/workbench': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    '/staff/projects': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    '/staff/deals': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    '/staff/returns': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
    '/staff/leads': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
    '/staff/inventory': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>',
    '/staff/channel': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  }
  return icons[path] || ''
}

const currentTitle = computed(() => {
  const item = navItems.find(n => n.path === route.path)
  return item?.label || '工作台'
})

const currentTime = ref('')
function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}
updateTime()
setInterval(updateTime, 1000)

// 点击外部关闭主题面板
function handleClickOutside(e: MouseEvent) {
  if (switcherRef.value && !switcherRef.value.contains(e.target as Node)) {
    showThemePanel.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  checkAutoStart()
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (tooltipTimer.value) clearTimeout(tooltipTimer.value)
})
</script>

<style lang="scss" scoped>
.staff-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--staff-bg);
  color: var(--staff-text);
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', -apple-system, sans-serif;
  overflow: hidden;
  transition: background 0.4s ease, color 0.3s ease;
}

.sidebar {
  width: 240px;
  min-width: 240px;
  background: var(--staff-sidebar-bg);
  border-right: 1px solid var(--staff-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, min-width 0.3s ease, background 0.4s ease;
  overflow: hidden;

  &.collapsed {
    width: 64px;
    min-width: 64px;
  }
}

.sidebar-header {
  padding: 20px 16px 16px;
  border-bottom: 1px solid var(--staff-border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--staff-brand-1), var(--staff-brand-2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.brand-sub {
  font-size: 11px;
  color: var(--staff-text-3);
  margin-top: 2px;
}

.brand-collapsed {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--staff-brand-1), var(--staff-brand-2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  margin: 0 auto;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--staff-text-2);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
  margin-bottom: 2px;
  white-space: nowrap;

  &:hover {
    background: var(--staff-hover-2);
    color: var(--staff-text);
  }

  &.active {
    background: var(--staff-primary-bg);
    color: var(--staff-primary);
    font-weight: 500;

    .nav-icon { color: var(--staff-primary); }
  }
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: inherit;
}

.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer {
  padding: 12px 8px 16px;
  border-top: 1px solid var(--staff-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.collapse-btn {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--staff-hover-4);
  border: 1px solid var(--staff-border);
  border-radius: 8px;
  color: var(--staff-text-3);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--staff-hover-3);
    color: var(--staff-text);
  }
}

.back-dashboard {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--staff-text-3);
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    background: var(--staff-hover-2);
    color: var(--staff-text);
  }
}

.staff-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.staff-header {
  height: 56px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--staff-border);
  background: var(--staff-header-bg);
  backdrop-filter: blur(12px);
  flex-shrink: 0;
  transition: background 0.4s ease;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
}

.page-breadcrumb {
  font-size: 11px;
  color: var(--staff-text-4);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-time {
  font-size: 12px;
  color: var(--staff-text-3);
  font-family: 'JetBrains Mono', monospace;
}

// ===== 主题切换器 =====
.theme-switcher {
  position: relative;
}

.theme-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--staff-hover-4);
  border: 1px solid var(--staff-border);
  color: var(--staff-text-2);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--staff-hover-3);
    color: var(--staff-primary);
    border-color: var(--staff-primary-border);
  }
}

.theme-panel {
  position: absolute;
  top: 44px;
  right: 0;
  width: 260px;
  background: var(--staff-card-bg);
  border: 1px solid var(--staff-border);
  border-radius: 12px;
  padding: 12px;
  box-shadow: var(--staff-shadow);
  z-index: 100;
  animation: panelIn 0.2s ease-out;
}

@keyframes panelIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.theme-panel-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--staff-text-3);
  padding: 4px 4px 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.theme-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  color: var(--staff-text);

  &:hover {
    background: var(--staff-hover-2);
  }

  &.active {
    background: var(--staff-primary-bg);
    border-color: var(--staff-primary-border);
  }
}

.theme-preview {
  width: 36px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--staff-border);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 40%;
    background: var(--staff-card-bg);
    border-top: 1px solid var(--staff-border);
  }
}

.theme-preview-accent {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 3px;
  border-radius: 1px;
  z-index: 1;
}

.theme-option-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.theme-option-label {
  font-size: 13px;
  font-weight: 500;
}

.theme-option-desc {
  font-size: 11px;
  color: var(--staff-text-3);
  margin-top: 1px;
}

.theme-check {
  color: var(--staff-primary);
  flex-shrink: 0;
}

// ===== 用户头像 =====
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--staff-brand-1), var(--staff-brand-2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: scale(1.05); }
}

.staff-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: var(--staff-bg);
  transition: background 0.4s ease;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: var(--staff-scrollbar-track); }
  &::-webkit-scrollbar-thumb { background: var(--staff-scrollbar); border-radius: 3px; }
}

// ===== 帮助按钮 =====
.help-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--staff-hover-4);
  border: 1px solid var(--staff-border);
  color: var(--staff-text-2);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: var(--staff-primary-bg);
    color: var(--staff-primary);
    border-color: var(--staff-primary-border);
    transform: scale(1.05);
  }

  &:active { transform: scale(0.95); }
}

// ===== 页面欢迎提示 =====
.page-hint-banner {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--staff-primary-bg), rgba(var(--staff-primary-rgb), 0.06));
  border: 1px solid var(--staff-primary-border);
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--staff-primary-grad);
    border-radius: 4px 0 0 4px;
  }
}

.page-hint-icon {
  font-size: 28px;
  flex-shrink: 0;
  margin-top: 2px;
}

.page-hint-body {
  flex: 1;
  min-width: 0;
}

.page-hint-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--staff-primary);
  margin-bottom: 6px;
}

.page-hint-desc {
  font-size: 13px;
  color: var(--staff-text-2);
  line-height: 1.6;
  margin-bottom: 10px;
}

.page-hint-tips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.page-hint-tip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--staff-text-3);
  background: var(--staff-hover-2);
  padding: 4px 10px;
  border-radius: 6px;

  svg { color: var(--staff-success); flex-shrink: 0; }
}

.page-hint-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: var(--staff-text-3);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    background: var(--staff-hover-3);
    color: var(--staff-text);
  }
}

.page-hint-enter-active { transition: all 0.4s ease-out; }
.page-hint-leave-active { transition: all 0.3s ease-in; }
.page-hint-enter-from { opacity: 0; transform: translateY(-12px); }
.page-hint-leave-to { opacity: 0; transform: translateY(-8px); }
</style>

<!-- Non-scoped styles for Teleported elements (rendered to body, outside scoped context) -->
<style lang="scss">
.nav-tooltip-overlay {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}

.nav-tooltip-card {
  width: 260px;
  padding: 14px 16px;
  background: var(--staff-card-bg);
  border: 1px solid var(--staff-border);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(var(--staff-primary-rgb), 0.08);
  pointer-events: auto;
}

.nav-tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.nav-tooltip-emoji { font-size: 18px; }

.nav-tooltip-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--staff-text);
}

.nav-tooltip-desc {
  font-size: 12px;
  color: var(--staff-text-2);
  line-height: 1.6;
  margin-bottom: 10px;
}

.nav-tooltip-tips {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-tooltip-tip {
  font-size: 11px;
  color: var(--staff-text-3);
  padding: 3px 8px;
  background: var(--staff-hover-2);
  border-radius: 4px;

  &::before { content: '💡 '; }
}

.nav-tooltip-enter-active { transition: all 0.2s ease-out; }
.nav-tooltip-leave-active { transition: all 0.15s ease-in; }
.nav-tooltip-enter-from { opacity: 0; transform: translateX(-8px); }
.nav-tooltip-leave-to { opacity: 0; transform: translateX(-4px); }

// ===== Guide overlay (teleported) =====
.guide-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(2px);
}

.guide-spotlight {
  position: fixed;
  z-index: 10001;
  border-radius: 10px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55), 0 0 0 2px rgba(var(--staff-primary-rgb), 0.5), 0 0 24px rgba(var(--staff-primary-rgb), 0.2);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.guide-tooltip {
  position: fixed;
  z-index: 10002;
  width: 320px;
  background: var(--staff-card-bg);
  border: 1px solid var(--staff-primary-border);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(var(--staff-primary-rgb), 0.15);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--staff-primary-grad);
    border-radius: 16px 16px 0 0;
  }
}

.guide-tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.guide-step-icon { font-size: 22px; }

.guide-step-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--staff-text);
  flex: 1;
}

.guide-step-badge {
  font-size: 11px;
  color: var(--staff-primary);
  background: var(--staff-primary-bg);
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
}

.guide-tooltip-body {
  font-size: 13px;
  color: var(--staff-text-2);
  line-height: 1.7;
  margin-bottom: 16px;
}

.guide-tooltip-progress {
  height: 3px;
  background: var(--staff-hover-3);
  border-radius: 2px;
  margin-bottom: 16px;
  overflow: hidden;
}

.guide-progress-bar {
  height: 100%;
  background: var(--staff-primary-grad);
  border-radius: 2px;
  transition: width 0.35s ease;
}

.guide-tooltip-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.guide-btn {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: inherit;
}

.guide-btn-skip {
  background: transparent;
  color: var(--staff-text-3);
  &:hover {
    color: var(--staff-text-2);
    background: var(--staff-hover-2);
  }
}

.guide-btn-group { display: flex; gap: 8px; }

.guide-btn-prev {
  background: var(--staff-hover-3);
  color: var(--staff-text-2);
  border: 1px solid var(--staff-border);
  &:hover { background: var(--staff-hover-4); }
}

.guide-btn-next {
  background: var(--staff-primary-grad);
  color: #fff;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
  &:active { transform: translateY(0); }
}

.guide-btn-finish {
  background: linear-gradient(135deg, var(--staff-success), #16a34a);
  color: #fff;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
  &:active { transform: translateY(0); }
}

.guide-fade-enter-active { transition: opacity 0.3s ease; }
.guide-fade-leave-active { transition: opacity 0.2s ease; }
.guide-fade-enter-from { opacity: 0; }
.guide-fade-leave-to { opacity: 0; }
</style>

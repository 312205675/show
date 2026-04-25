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
        <router-link to="/" class="back-dashboard" v-show="!sidebarCollapsed">
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
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStaffTheme, themeOptions } from '@/composables/useStaffTheme'

const route = useRoute()
const { currentTheme, setTheme } = useStaffTheme()
const sidebarCollapsed = ref(false)
const showThemePanel = ref(false)
const switcherRef = ref<HTMLElement | null>(null)

const currentThemeLabel = computed(() => {
  return themeOptions.find(o => o.key === currentTheme.value)?.label || '暗夜黑'
})

const navItems = [
  {
    path: '/staff/workbench',
    label: '工作台',
    iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  },
  {
    path: '/staff/projects',
    label: '项目管理',
    iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  },
  {
    path: '/staff/deals',
    label: '成交录入',
    iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  },
  {
    path: '/staff/returns',
    label: '回款管理',
    iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  },
  {
    path: '/staff/leads',
    label: '客户线索',
    iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  },
  {
    path: '/staff/inventory',
    label: '房源库存',
    iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>',
  },
  {
    path: '/staff/channel',
    label: '渠道数据',
    iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  },
]

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
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
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
</style>

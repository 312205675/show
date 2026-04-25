import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ===== 主题配色方案 =====
// 设计原则：高对比度、信息层级清晰、适合长时间观看
// 两套风格：深色科技风 + 浅色商务风

export type ThemeMode = 'dark' | 'light'
export type ThemeKey = 'darkCarbon' | 'darkNavy' | 'lightBiz' | 'lightWarm'
export type ViewMode = '2d' | '3d'

export interface ThemeConfig {
  key: ThemeKey
  label: string
  mode: ThemeMode
  description: string
  // 预览色块
  preview: string
  // 背景层级
  bg: string
  cardBg: string
  headerBg: string
  border: string
  // 表面（微弱区分于card的底色，用于内嵌区域）
  surface: string
  surfaceHover: string
  // 文本层级
  textTitle: string    // 标题 — 最强
  textBody: string     // 正文 — 标准
  textCaption: string  // 说明/弱化 — 最弱
  // 品牌色
  primary: string
  primaryLight: string  // 品牌色浅色（用于背景点缀）
  // 语义色
  success: string
  successLight: string
  danger: string
  dangerLight: string
  warning: string
  warningLight: string
  info: string
  infoLight: string
  purple: string
  purpleLight: string
  // 阴影
  shadowSm: string
  shadowMd: string
  // 遮罩
  overlay: string
  // 进度条/图表背景
  barTrack: string
  // 滚动条
  scrollbarThumb: string
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  // ===== 深色科技风 =====
  darkCarbon: {
    key: 'darkCarbon',
    label: '碳灰科技',
    mode: 'dark',
    description: '高级碳灰底色，蓝调品牌色，适合数据驾驶舱',
    preview: '#1a2030',
    bg: '#0F1217',
    cardBg: '#161B22',
    headerBg: 'rgba(15, 18, 23, 0.95)',
    border: 'rgba(255, 255, 255, 0.06)',
    surface: 'rgba(255, 255, 255, 0.03)',
    surfaceHover: 'rgba(255, 255, 255, 0.06)',
    textTitle: '#e2e8f0',
    textBody: '#cbd5e1',
    textCaption: '#64748b',
    primary: '#60a5fa',
    primaryLight: 'rgba(96, 165, 250, 0.12)',
    success: '#22C55E',
    successLight: 'rgba(34, 197, 94, 0.15)',
    danger: '#EF4444',
    dangerLight: 'rgba(239, 68, 68, 0.15)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.15)',
    info: '#06b6d4',
    infoLight: 'rgba(6, 182, 212, 0.10)',
    purple: '#8b5cf6',
    purpleLight: 'rgba(139, 92, 246, 0.10)',
    shadowSm: '0 1px 3px rgba(0, 0, 0, 0.5)',
    shadowMd: '0 4px 12px rgba(0, 0, 0, 0.6)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    barTrack: 'rgba(255, 255, 255, 0.05)',
    scrollbarThumb: 'rgba(255, 255, 255, 0.12)',
  },
  darkNavy: {
    key: 'darkNavy',
    label: '深海蓝',
    mode: 'dark',
    description: '深蓝底色，冷色科技感，适合大屏展示',
    preview: '#1a3050',
    bg: '#0c1929',
    cardBg: 'rgba(14, 28, 48, 0.96)',
    headerBg: 'rgba(10, 20, 38, 0.92)',
    border: 'rgba(59, 130, 246, 0.10)',
    surface: 'rgba(59, 130, 246, 0.04)',
    surfaceHover: 'rgba(59, 130, 246, 0.08)',
    textTitle: '#e2e8f0',
    textBody: '#94a3b8',
    textCaption: '#475569',
    primary: '#60a5fa',
    primaryLight: 'rgba(96, 165, 250, 0.10)',
    success: '#34d399',
    successLight: 'rgba(52, 211, 153, 0.10)',
    danger: '#f87171',
    dangerLight: 'rgba(248, 113, 113, 0.10)',
    warning: '#fbbf24',
    warningLight: 'rgba(251, 191, 36, 0.10)',
    info: '#22d3ee',
    infoLight: 'rgba(34, 211, 238, 0.10)',
    purple: '#a78bfa',
    purpleLight: 'rgba(167, 139, 250, 0.10)',
    shadowSm: '0 1px 3px rgba(0, 0, 0, 0.6)',
    shadowMd: '0 4px 12px rgba(0, 0, 0, 0.7)',
    overlay: 'rgba(0, 0, 0, 0.65)',
    barTrack: 'rgba(59, 130, 246, 0.06)',
    scrollbarThumb: 'rgba(59, 130, 246, 0.15)',
  },

  // ===== 浅色商务风 =====
  lightBiz: {
    key: 'lightBiz',
    label: '商务白',
    mode: 'light',
    description: '经典商务白，高可读性，推荐日常决策使用',
    preview: '#f1f5f9',
    bg: '#f1f5f9',
    cardBg: '#ffffff',
    headerBg: 'rgba(255, 255, 255, 0.92)',
    border: 'rgba(0, 0, 0, 0.07)',
    surface: 'rgba(0, 0, 0, 0.025)',
    surfaceHover: 'rgba(0, 0, 0, 0.045)',
    textTitle: '#0f172a',
    textBody: '#475569',
    textCaption: '#94a3b8',
    primary: '#2563eb',
    primaryLight: 'rgba(37, 99, 235, 0.08)',
    success: '#059669',
    successLight: 'rgba(5, 150, 105, 0.08)',
    danger: '#dc2626',
    dangerLight: 'rgba(220, 38, 38, 0.08)',
    warning: '#d97706',
    warningLight: 'rgba(217, 119, 6, 0.08)',
    info: '#0891b2',
    infoLight: 'rgba(8, 145, 178, 0.08)',
    purple: '#7c3aed',
    purpleLight: 'rgba(124, 58, 237, 0.08)',
    shadowSm: '0 1px 3px rgba(0, 0, 0, 0.06)',
    shadowMd: '0 4px 12px rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(15, 23, 42, 0.4)',
    barTrack: 'rgba(0, 0, 0, 0.05)',
    scrollbarThumb: 'rgba(0, 0, 0, 0.12)',
  },
  lightWarm: {
    key: 'lightWarm',
    label: '暖纸色',
    mode: 'light',
    description: '暖调米白，长时间观看更舒适，适合打印输出',
    preview: '#faf8f5',
    bg: '#faf8f5',
    cardBg: '#ffffff',
    headerBg: 'rgba(255, 253, 250, 0.92)',
    border: 'rgba(0, 0, 0, 0.06)',
    surface: 'rgba(0, 0, 0, 0.02)',
    surfaceHover: 'rgba(0, 0, 0, 0.04)',
    textTitle: '#1c1917',
    textBody: '#57534e',
    textCaption: '#a8a29e',
    primary: '#1d4ed8',
    primaryLight: 'rgba(29, 78, 216, 0.07)',
    success: '#047857',
    successLight: 'rgba(4, 120, 87, 0.07)',
    danger: '#b91c1c',
    dangerLight: 'rgba(185, 28, 28, 0.07)',
    warning: '#b45309',
    warningLight: 'rgba(180, 83, 9, 0.07)',
    info: '#0e7490',
    infoLight: 'rgba(14, 116, 144, 0.07)',
    purple: '#6d28d9',
    purpleLight: 'rgba(109, 40, 217, 0.07)',
    shadowSm: '0 1px 3px rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 12px rgba(0, 0, 0, 0.07)',
    overlay: 'rgba(28, 25, 23, 0.35)',
    barTrack: 'rgba(0, 0, 0, 0.04)',
    scrollbarThumb: 'rgba(0, 0, 0, 0.10)',
  },
}

// 主题分类
export const THEME_GROUPS = [
  {
    group: 'dark' as ThemeMode,
    label: '深色科技风',
    themes: ['darkCarbon', 'darkNavy'] as ThemeKey[],
  },
  {
    group: 'light' as ThemeMode,
    label: '浅色商务风',
    themes: ['lightBiz', 'lightWarm'] as ThemeKey[],
  },
]

export const useThemeStore = defineStore('theme', () => {
  const current = ref<ThemeKey>('darkCarbon')
  const viewMode = ref<ViewMode>('2d')
  const fontScale = ref(1)

  const config = computed(() => THEMES[current.value])
  const mode = computed(() => config.value.mode)
  const is3D = computed(() => viewMode.value === '3d')

  function setTheme(key: ThemeKey) {
    current.value = key
    applyTheme()
  }

  function setViewMode(m: ViewMode) {
    viewMode.value = m
    document.documentElement.setAttribute('data-view-mode', m)
  }

  function toggleViewMode() {
    setViewMode(viewMode.value === '2d' ? '3d' : '2d')
  }

  function setFontScale(scale: number) {
    fontScale.value = Math.max(0.8, Math.min(1.3, scale))
    document.documentElement.style.setProperty('--font-scale', String(fontScale.value))
    document.documentElement.style.fontSize = `${14 * fontScale.value}px`
  }

  function increaseFont() {
    setFontScale(fontScale.value + 0.1)
  }

  function decreaseFont() {
    setFontScale(fontScale.value - 0.1)
  }

  function resetFont() {
    setFontScale(1)
  }

  function applyTheme() {
    const c = config.value
    const root = document.documentElement

    // Mode
    root.setAttribute('data-theme-mode', c.mode)

    // 背景层级
    root.style.setProperty('--bg', c.bg)
    root.style.setProperty('--card-bg', c.cardBg)
    root.style.setProperty('--header-bg', c.headerBg)
    root.style.setProperty('--border', c.border)
    root.style.setProperty('--surface', c.surface)
    root.style.setProperty('--surface-hover', c.surfaceHover)

    // 文本层级
    root.style.setProperty('--text-title', c.textTitle)
    root.style.setProperty('--text-body', c.textBody)
    root.style.setProperty('--text-caption', c.textCaption)

    // 品牌色
    root.style.setProperty('--primary', c.primary)
    root.style.setProperty('--primary-light', c.primaryLight)

    // 语义色
    root.style.setProperty('--success', c.success)
    root.style.setProperty('--success-light', c.successLight)
    root.style.setProperty('--danger', c.danger)
    root.style.setProperty('--danger-light', c.dangerLight)
    root.style.setProperty('--warning', c.warning)
    root.style.setProperty('--warning-light', c.warningLight)
    root.style.setProperty('--info', c.info)
    root.style.setProperty('--info-light', c.infoLight)
    root.style.setProperty('--purple', c.purple)
    root.style.setProperty('--purple-light', c.purpleLight)

    // 兼容旧变量名（过渡期）
    root.style.setProperty('--panel-bg', c.cardBg)
    root.style.setProperty('--text-primary', c.textTitle)
    root.style.setProperty('--text-secondary', c.textBody)
    root.style.setProperty('--text-muted', c.textCaption)
    root.style.setProperty('--accent-blue', c.primary)
    root.style.setProperty('--accent-green', c.success)
    root.style.setProperty('--accent-red', c.danger)
    root.style.setProperty('--accent-amber', c.warning)
    root.style.setProperty('--accent-cyan', c.info)
    root.style.setProperty('--accent-purple', c.purple)

    // 阴影与遮罩
    root.style.setProperty('--shadow-sm', c.shadowSm)
    root.style.setProperty('--shadow-md', c.shadowMd)
    root.style.setProperty('--overlay', c.overlay)
    root.style.setProperty('--bar-track', c.barTrack)
    root.style.setProperty('--scrollbar-thumb', c.scrollbarThumb)

    // 字体缩放
    root.style.setProperty('--font-scale', String(fontScale.value))
  }

  // Initialize
  applyTheme()

  return {
    current, viewMode, fontScale, config, mode, is3D,
    setTheme, setViewMode, toggleViewMode, applyTheme,
    setFontScale, increaseFont, decreaseFont, resetFont,
  }
})

import { ref, watch } from 'vue'

export type StaffTheme = 'dark' | 'light' | 'blue' | 'lightBlue'

export interface ThemeOption {
  key: StaffTheme
  label: string
  desc: string
  preview: { bg: string; accent: string; text: string }
}

export const themeOptions: ThemeOption[] = [
  {
    key: 'dark',
    label: '暗夜黑',
    desc: '经典深色模式',
    preview: { bg: '#0a0e14', accent: '#60a5fa', text: '#e2e8f0' },
  },
  {
    key: 'light',
    label: '日光白',
    desc: '明亮清爽风格',
    preview: { bg: '#f5f7fa', accent: '#3b82f6', text: '#1e293b' },
  },
  {
    key: 'blue',
    label: '科技蓝',
    desc: '深邃蓝调科技感',
    preview: { bg: '#0a1628', accent: '#4da6ff', text: '#e2e8f0' },
  },
  {
    key: 'lightBlue',
    label: '浅蓝',
    desc: '清新天蓝优雅风',
    preview: { bg: '#eaf1fb', accent: '#4a8bc2', text: '#1c3a5c' },
  },
]

const cssVars: Record<StaffTheme, Record<string, string>> = {
  dark: {
    '--staff-bg': '#0a0e14',
    '--staff-sidebar-bg': '#0d1117',
    '--staff-card-bg': '#161B22',
    '--staff-input-bg': '#0d1117',
    '--staff-header-bg': 'rgba(13, 17, 23, 0.8)',
    '--staff-border': 'rgba(255,255,255,0.06)',
    '--staff-border-input': 'rgba(255,255,255,0.08)',
    '--staff-border-focus': 'rgba(96,165,250,0.4)',
    '--staff-text': '#e2e8f0',
    '--staff-text-2': '#94a3b8',
    '--staff-text-3': '#64748b',
    '--staff-text-4': '#475569',
    '--staff-hover': 'rgba(255,255,255,0.02)',
    '--staff-hover-2': 'rgba(255,255,255,0.05)',
    '--staff-hover-3': 'rgba(255,255,255,0.08)',
    '--staff-hover-4': 'rgba(255,255,255,0.04)',
    '--staff-primary': '#60a5fa',
    '--staff-primary-rgb': '96,165,250',
    '--staff-primary-bg': 'rgba(96,165,250,0.12)',
    '--staff-primary-border': 'rgba(96,165,250,0.25)',
    '--staff-primary-hover': 'rgba(96,165,250,0.4)',
    '--staff-primary-grad': 'linear-gradient(135deg, #60a5fa, #4a8fe7)',
    '--staff-success': '#22C55E',
    '--staff-success-rgb': '34,197,94',
    '--staff-success-bg': 'rgba(34,197,94,0.12)',
    '--staff-warning': '#F59E0B',
    '--staff-warning-rgb': '245,158,11',
    '--staff-warning-bg': 'rgba(245,158,11,0.12)',
    '--staff-danger': '#EF4444',
    '--staff-danger-rgb': '239,68,68',
    '--staff-danger-bg': 'rgba(239,68,68,0.12)',
    '--staff-purple': '#a78bfa',
    '--staff-purple-rgb': '167,139,250',
    '--staff-purple-bg': 'rgba(167,139,250,0.12)',
    '--staff-cyan': '#06b6d4',
    '--staff-cyan-rgb': '6,182,212',
    '--staff-cyan-bg': 'rgba(6,182,212,0.12)',
    '--staff-brand-1': '#60a5fa',
    '--staff-brand-2': '#a78bfa',
    '--staff-overlay': 'rgba(0,0,0,0.6)',
    '--staff-scrollbar': 'rgba(255,255,255,0.1)',
    '--staff-scrollbar-track': 'transparent',
    '--staff-shadow': '0 8px 24px rgba(0,0,0,0.3)',
  },
  light: {
    '--staff-bg': '#f5f7fa',
    '--staff-sidebar-bg': '#ffffff',
    '--staff-card-bg': '#ffffff',
    '--staff-input-bg': '#f0f2f5',
    '--staff-header-bg': 'rgba(255,255,255,0.85)',
    '--staff-border': 'rgba(0,0,0,0.08)',
    '--staff-border-input': 'rgba(0,0,0,0.12)',
    '--staff-border-focus': 'rgba(59,130,246,0.4)',
    '--staff-text': '#1e293b',
    '--staff-text-2': '#475569',
    '--staff-text-3': '#94a3b8',
    '--staff-text-4': '#cbd5e1',
    '--staff-hover': 'rgba(0,0,0,0.02)',
    '--staff-hover-2': 'rgba(0,0,0,0.04)',
    '--staff-hover-3': 'rgba(0,0,0,0.06)',
    '--staff-hover-4': 'rgba(0,0,0,0.03)',
    '--staff-primary': '#3b82f6',
    '--staff-primary-rgb': '59,130,246',
    '--staff-primary-bg': 'rgba(59,130,246,0.08)',
    '--staff-primary-border': 'rgba(59,130,246,0.2)',
    '--staff-primary-hover': 'rgba(59,130,246,0.3)',
    '--staff-primary-grad': 'linear-gradient(135deg, #3b82f6, #2563eb)',
    '--staff-success': '#16a34a',
    '--staff-success-rgb': '22,163,74',
    '--staff-success-bg': 'rgba(22,163,74,0.08)',
    '--staff-warning': '#d97706',
    '--staff-warning-rgb': '217,119,6',
    '--staff-warning-bg': 'rgba(217,119,6,0.08)',
    '--staff-danger': '#dc2626',
    '--staff-danger-rgb': '220,38,38',
    '--staff-danger-bg': 'rgba(220,38,38,0.08)',
    '--staff-purple': '#7c3aed',
    '--staff-purple-rgb': '124,58,237',
    '--staff-purple-bg': 'rgba(124,58,237,0.08)',
    '--staff-cyan': '#0891b2',
    '--staff-cyan-rgb': '8,145,178',
    '--staff-cyan-bg': 'rgba(8,145,178,0.08)',
    '--staff-brand-1': '#3b82f6',
    '--staff-brand-2': '#7c3aed',
    '--staff-overlay': 'rgba(0,0,0,0.3)',
    '--staff-scrollbar': 'rgba(0,0,0,0.15)',
    '--staff-scrollbar-track': 'transparent',
    '--staff-shadow': '0 4px 16px rgba(0,0,0,0.08)',
  },
  blue: {
    '--staff-bg': '#0a1628',
    '--staff-sidebar-bg': '#0d1f3c',
    '--staff-card-bg': '#132744',
    '--staff-input-bg': '#0d1f3c',
    '--staff-header-bg': 'rgba(13,31,60,0.85)',
    '--staff-border': 'rgba(77,166,255,0.1)',
    '--staff-border-input': 'rgba(77,166,255,0.12)',
    '--staff-border-focus': 'rgba(77,166,255,0.5)',
    '--staff-text': '#e2e8f0',
    '--staff-text-2': '#8bb4e0',
    '--staff-text-3': '#5a7fa8',
    '--staff-text-4': '#3d6490',
    '--staff-hover': 'rgba(77,166,255,0.04)',
    '--staff-hover-2': 'rgba(77,166,255,0.06)',
    '--staff-hover-3': 'rgba(77,166,255,0.08)',
    '--staff-hover-4': 'rgba(77,166,255,0.05)',
    '--staff-primary': '#4da6ff',
    '--staff-primary-rgb': '77,166,255',
    '--staff-primary-bg': 'rgba(77,166,255,0.12)',
    '--staff-primary-border': 'rgba(77,166,255,0.25)',
    '--staff-primary-hover': 'rgba(77,166,255,0.4)',
    '--staff-primary-grad': 'linear-gradient(135deg, #4da6ff, #2d7dd2)',
    '--staff-success': '#00e676',
    '--staff-success-rgb': '0,230,118',
    '--staff-success-bg': 'rgba(0,230,118,0.1)',
    '--staff-warning': '#ffab40',
    '--staff-warning-rgb': '255,171,64',
    '--staff-warning-bg': 'rgba(255,171,64,0.1)',
    '--staff-danger': '#ff5252',
    '--staff-danger-rgb': '255,82,82',
    '--staff-danger-bg': 'rgba(255,82,82,0.1)',
    '--staff-purple': '#b388ff',
    '--staff-purple-rgb': '179,136,255',
    '--staff-purple-bg': 'rgba(179,136,255,0.1)',
    '--staff-cyan': '#18ffff',
    '--staff-cyan-rgb': '24,255,255',
    '--staff-cyan-bg': 'rgba(24,255,255,0.1)',
    '--staff-brand-1': '#4da6ff',
    '--staff-brand-2': '#b388ff',
    '--staff-overlay': 'rgba(5,12,30,0.7)',
    '--staff-scrollbar': 'rgba(77,166,255,0.15)',
    '--staff-scrollbar-track': 'transparent',
    '--staff-shadow': '0 8px 24px rgba(0,0,0,0.4)',
  },
  lightBlue: {
    '--staff-bg': '#eaf1fb',
    '--staff-sidebar-bg': '#ffffff',
    '--staff-card-bg': '#ffffff',
    '--staff-input-bg': '#e4ecf7',
    '--staff-header-bg': 'rgba(234,241,251,0.88)',
    '--staff-border': 'rgba(74,139,194,0.1)',
    '--staff-border-input': 'rgba(74,139,194,0.14)',
    '--staff-border-focus': 'rgba(74,139,194,0.45)',
    '--staff-text': '#1c3a5c',
    '--staff-text-2': '#4a6d8c',
    '--staff-text-3': '#7a9bb8',
    '--staff-text-4': '#b0c7db',
    '--staff-hover': 'rgba(74,139,194,0.04)',
    '--staff-hover-2': 'rgba(74,139,194,0.07)',
    '--staff-hover-3': 'rgba(74,139,194,0.1)',
    '--staff-hover-4': 'rgba(74,139,194,0.05)',
    '--staff-primary': '#4a8bc2',
    '--staff-primary-rgb': '74,139,194',
    '--staff-primary-bg': 'rgba(74,139,194,0.1)',
    '--staff-primary-border': 'rgba(74,139,194,0.22)',
    '--staff-primary-hover': 'rgba(74,139,194,0.3)',
    '--staff-primary-grad': 'linear-gradient(135deg, #4a8bc2, #3570a8)',
    '--staff-success': '#1a9e5c',
    '--staff-success-rgb': '26,158,92',
    '--staff-success-bg': 'rgba(26,158,92,0.08)',
    '--staff-warning': '#c47f17',
    '--staff-warning-rgb': '196,127,23',
    '--staff-warning-bg': 'rgba(196,127,23,0.08)',
    '--staff-danger': '#c43a3a',
    '--staff-danger-rgb': '196,58,58',
    '--staff-danger-bg': 'rgba(196,58,58,0.08)',
    '--staff-purple': '#6c4db5',
    '--staff-purple-rgb': '108,77,181',
    '--staff-purple-bg': 'rgba(108,77,181,0.08)',
    '--staff-cyan': '#1a8fa8',
    '--staff-cyan-rgb': '26,143,168',
    '--staff-cyan-bg': 'rgba(26,143,168,0.08)',
    '--staff-brand-1': '#4a8bc2',
    '--staff-brand-2': '#6c4db5',
    '--staff-overlay': 'rgba(234,241,251,0.6)',
    '--staff-scrollbar': 'rgba(74,139,194,0.18)',
    '--staff-scrollbar-track': 'transparent',
    '--staff-shadow': '0 4px 16px rgba(28,58,92,0.1)',
  },
}

const STORAGE_KEY = 'smartestate-staff-theme'

const currentTheme = ref<StaffTheme>(
  (localStorage.getItem(STORAGE_KEY) as StaffTheme) || 'dark'
)

function applyTheme(theme: StaffTheme) {
  const root = document.documentElement
  const vars = cssVars[theme]
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
  // Add theme class for any CSS that needs it
  root.classList.remove('staff-theme-dark', 'staff-theme-light', 'staff-theme-blue', 'staff-theme-lightBlue')
  root.classList.add(`staff-theme-${theme}`)
}

// Apply on initial load
applyTheme(currentTheme.value)

watch(currentTheme, (val) => {
  applyTheme(val)
  localStorage.setItem(STORAGE_KEY, val)
})

export function useStaffTheme() {
  function setTheme(theme: StaffTheme) {
    currentTheme.value = theme
  }

  function toggleTheme() {
    const keys: StaffTheme[] = ['dark', 'light', 'blue', 'lightBlue']
    const idx = keys.indexOf(currentTheme.value)
    currentTheme.value = keys[(idx + 1) % keys.length]
  }

  return {
    currentTheme,
    themeOptions,
    setTheme,
    toggleTheme,
  }
}

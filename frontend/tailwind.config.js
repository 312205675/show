/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark': {
          950: '#06080d',
          900: '#0b0e14',
          800: '#12161f',
          700: '#1a1f2e',
          600: '#242a3a',
          500: '#2e3548',
        },
        'g': {
          100: '#e8eaed',
          200: '#c4c9d4',
          300: '#a0a8b8',
          400: '#6b7590',
          500: '#4a5270',
          600: '#363e54',
        },
        'accent': {
          blue: '#4a9eff',
          green: '#00d68f',
          red: '#ff4757',
          amber: '#ffab00',
          cyan: '#00e5ff',
          purple: '#a78bfa',
        },
      },
      fontFamily: {
        'digital': ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
        'display': ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'cn': ['PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}

<template>
  <div class="standalone-page">
    <header class="standalone-header">
      <router-link to="/" class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>返回首页</span>
      </router-link>
      <div class="header-brand">
        <span class="brand-smart">SMART</span><span class="brand-estate">ESTATE</span>
        <span class="brand-sep">|</span>
        <span class="brand-page">AI 智能引擎</span>
      </div>
      <router-link to="/dashboard" class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>决策驾驶舱</span>
      </router-link>
    </header>
    <main class="standalone-content">
      <AIEnginePage />
    </main>
  </div>
</template>

<script setup lang="ts">
import AIEnginePage from '@/components/pages/AIEnginePage.vue'
</script>

<style lang="scss" scoped>
.standalone-page {
  width: 100vw;
  height: 100vh;
  background: #0F1217;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.standalone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: rgba(15, 18, 23, 0.95);
  border-bottom: 1px solid rgba(96, 165, 250, 0.1);
  backdrop-filter: blur(12px);
  flex-shrink: 0;
  z-index: 10;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(96, 165, 250, 0.1);

  &:hover {
    color: #60a5fa;
    border-color: rgba(96, 165, 250, 0.3);
    background: rgba(96, 165, 250, 0.06);
  }
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-smart {
  font-weight: 800;
  font-size: 14px;
  color: #e2e8f0;
  letter-spacing: 2px;
}

.brand-estate {
  font-weight: 800;
  font-size: 14px;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.brand-sep {
  color: #334155;
  font-size: 16px;
}

.brand-page {
  font-size: 12px;
  color: #94a3b8;
  letter-spacing: 1px;
}

.standalone-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(96, 165, 250, 0.2);
    border-radius: 3px;
    &:hover {
      background: rgba(96, 165, 250, 0.35);
    }
  }
}
</style>

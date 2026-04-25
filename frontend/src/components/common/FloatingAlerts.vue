<template>
  <div class="floating-alerts" :class="{ paused: isPaused }" @mouseenter="isPaused = true" @mouseleave="isPaused = false">
    <div class="alert-track" :style="{ transform: `translateY(-${currentIndex * 40}px)` }">
      <div v-for="(item, i) in displayItems" :key="i" class="alert-item" :class="item.severity">
        <span class="alert-dot" />
        <span class="alert-text">{{ item.text }}</span>
        <span class="alert-tag">{{ item.tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { RiskItem } from '@/utils/mockData'

const props = defineProps<{
  risks: RiskItem[]
}>()

const isPaused = ref(false)
const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

interface AlertEntry {
  severity: 'danger' | 'warn' | 'info'
  text: string
  tag: string
}

const alertPool = computed<AlertEntry[]>(() => {
  const items: AlertEntry[] = []

  // From risk items
  for (const r of props.risks) {
    items.push({
      severity: r.severity,
      text: `${r.projectName}: ${r.description}`,
      tag: r.type === 'unsalable' ? '滞销' : r.type === 'returnAbnormal' ? '回款' : '库存',
    })
  }

  // Add some general alerts
  items.push(
    { severity: 'info', text: '裕华区今日成交8套，去化率持续领先', tag: '热区' },
    { severity: 'warn', text: '鹿泉区库存去化周期超24个月，需关注', tag: '预警' },
    { severity: 'info', text: '城发投·云山樾本月销售目标完成率92%', tag: '进度' },
    { severity: 'warn', text: '抖音渠道转化率仅2.0%，低于行业均值', tag: '渠道' },
    { severity: 'danger', text: '高新区回款率降至55%，建议启动专项催收', tag: '回款' },
    { severity: 'info', text: '老带新渠道转化率22%，远超其他渠道', tag: '亮点' },
  )

  return items
})

const displayItems = computed(() => {
  const items = alertPool.value
  if (items.length === 0) return [{ severity: 'info' as const, text: '系统运行正常', tag: '正常' }]
  // Duplicate for seamless loop
  return [...items, ...items.slice(0, 2)]
})

onMounted(() => {
  timer = setInterval(() => {
    if (!isPaused.value) {
      currentIndex.value = (currentIndex.value + 1) % alertPool.value.length
    }
  }, 3500)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.floating-alerts {
  height: 40px;
  overflow: hidden;
  border-radius: 8px;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  position: relative;
  cursor: default;
  backdrop-filter: blur(8px);
}

.alert-track {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.alert-item {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.danger {
    .alert-dot { background: var(--danger, #EF4444); box-shadow: 0 0 6px var(--danger-light, rgba(239, 68, 68, 0.3)); animation: pulseDot 2s ease-in-out infinite; }
    .alert-text { color: var(--text-title, #e2e8f0); }
    .alert-tag { background: var(--danger-light, rgba(239, 68, 68, 0.15)); color: var(--danger, #EF4444); }
  }
  &.warn {
    .alert-dot { background: var(--warning, #F59E0B); box-shadow: 0 0 6px var(--warning-light, rgba(245, 158, 11, 0.25)); }
    .alert-text { color: var(--text-body, #cbd5e1); }
    .alert-tag { background: var(--warning-light, rgba(245, 158, 11, 0.15)); color: var(--warning, #F59E0B); }
  }
  &.info {
    .alert-dot { background: var(--primary, #60a5fa); box-shadow: 0 0 6px var(--primary-light, rgba(96, 165, 250, 0.25)); }
    .alert-text { color: var(--text-body, #cbd5e1); }
    .alert-tag { background: var(--primary-light, rgba(96, 165, 250, 0.12)); color: var(--primary, #60a5fa); }
  }
}

.alert-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.alert-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alert-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>

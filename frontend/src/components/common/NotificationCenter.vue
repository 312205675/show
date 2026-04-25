<template>
  <Teleport to="body">
    <Transition name="notify-slide">
      <div v-if="currentNotification" class="notification-popup" :class="currentNotification.severity" @click="handleClick">
        <div class="notify-header">
          <span class="notify-icon">{{ severityIcon }}</span>
          <span class="notify-title">{{ currentNotification.title }}</span>
          <button class="notify-close" @click.stop="dismiss">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="notify-body">{{ currentNotification.body }}</div>
        <div class="notify-footer">
          <span class="notify-time">{{ currentNotification.time }}</span>
          <span class="notify-action">点击查看详情 →</span>
        </div>
        <div class="notify-progress">
          <div class="notify-progress-bar" :style="{ animationDuration: displayDuration + 'ms' }" />
        </div>
      </div>
    </Transition>

    <!-- Detail Modal -->
    <Transition name="modal-fade">
      <div v-if="detailVisible" class="notify-modal-overlay" @click.self="detailVisible = false">
        <div class="notify-modal" :class="detailData.severity">
          <div class="modal-header">
            <span class="modal-icon">{{ severityIcon }}</span>
            <span class="modal-title">{{ detailData.title }}</span>
            <button class="modal-close" @click="detailVisible = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="modal-detail-row" v-for="(row, i) in detailData.rows" :key="i">
              <span class="detail-label">{{ row.label }}</span>
              <span class="detail-value" :class="row.class">{{ row.value }}</span>
            </div>
            <div class="modal-description">{{ detailData.description }}</div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn" @click="detailVisible = false">关闭</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fluctuate } from '@/utils/mockData'
import { useSound } from '@/composables/useSound'

const { playNotificationSound, playClickSound } = useSound()

interface NotificationItem {
  severity: 'deal' | 'viewing' | 'alert' | 'milestone'
  title: string
  body: string
  time: string
  rows: { label: string; value: string; class?: string }[]
  description: string
}

const currentNotification = ref<NotificationItem | null>(null)
const detailVisible = ref(false)
const detailData = ref<NotificationItem>({ severity: 'deal', title: '', body: '', time: '', rows: [], description: '' })
const displayDuration = 6000

const severityIcon = computed(() => {
  if (!currentNotification.value) return ''
  const s = currentNotification.value.severity
  if (s === 'deal') return '🎉'
  if (s === 'viewing') return '👁'
  if (s === 'alert') return '⚠️'
  if (s === 'milestone') return '🏆'
  return '📢'
})

const projects = [
  '城发投·云山樾', '城发投·云澜悦府', '城发投·云和赋', '城发投·瑞晟府',
  '城发投·云华', '城发投·云尚', '城发投·瑞凝府', '城发投·云徽颂',
  '城发投·雲境府', '城发投·麓湖四季', '东方禧', '城发投·龙泉湖55号地',
  '高铁商务14号地', '自强路金融区', '生物医药园一期', '客运段洗整基地',
]

const areas = ['裕华区', '长安区', '桥西区', '新华区', '鹿泉区', '高新区']
const unitTypes = ['3室2厅 120㎡', '2室1厅 89㎡', '4室2厅 145㎡', '3室1厅 105㎡']

function generateNotification(): NotificationItem {
  const type = ['deal', 'viewing', 'alert', 'milestone'][Math.floor(Math.random() * 4)] as NotificationItem['severity']
  const project = projects[Math.floor(Math.random() * projects.length)]
  const area = areas[Math.floor(Math.random() * areas.length)]
  const now = new Date()
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  const unit = unitTypes[Math.floor(Math.random() * unitTypes.length)]
  const price = fluctuate(120, 60, 0)

  if (type === 'deal') {
    return {
      severity: 'deal', title: '🎉 新成交通知',
      body: `${project} ${unit} 成交！总价 ${price}万元`,
      time: `${timeStr} · 刚刚`,
      rows: [
        { label: '项目', value: project },
        { label: '户型', value: unit },
        { label: '成交价', value: `${price}万元`, class: 'highlight' },
        { label: '区域', value: area },
      ],
      description: `${project}于${timeStr}成功签约${unit}房源，成交价${price}万元。该区域本月已成交${fluctuate(15, 8)}套，去化势头良好。`,
    }
  } else if (type === 'viewing') {
    const count = fluctuate(5, 3)
    return {
      severity: 'viewing', title: '👁 看房动态',
      body: `${project} 今日 ${count} 组客户到访`,
      time: `${timeStr} · 实时`,
      rows: [
        { label: '项目', value: project },
        { label: '到访组数', value: `${count}组`, class: 'highlight' },
        { label: '意向客户', value: `${Math.max(1, count - 2)}组` },
        { label: '转化率', value: `${fluctuate(22, 8)}%` },
      ],
      description: `${project}今日共有${count}组客户到访看房，其中${Math.max(1, count - 2)}组表示强烈意向，预计本周可签约${fluctuate(2, 1)}套。`,
    }
  } else if (type === 'alert') {
    const alertTypes = ['库存预警', '回款提醒', '价格波动']
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    return {
      severity: 'alert', title: `⚠️ ${alertType}`,
      body: `${area} ${alertType}，请及时关注`,
      time: `${timeStr} · 系统`,
      rows: [
        { label: '区域', value: area },
        { label: '类型', value: alertType, class: 'warning' },
        { label: '影响项目', value: `${fluctuate(3, 1)}个` },
        { label: '紧急程度', value: '中等', class: 'warning' },
      ],
      description: `${area}区域出现${alertType}信号，涉及${fluctuate(3, 1)}个在售项目。建议运营团队及时评估风险并制定应对方案。`,
    }
  } else {
    const milestone = ['月度目标', '季度目标', '去化目标'][Math.floor(Math.random() * 3)]
    const percent = fluctuate(85, 10)
    return {
      severity: 'milestone', title: '🏆 里程碑达成',
      body: `${project} ${milestone}完成率 ${percent}%`,
      time: `${timeStr} · 系统`,
      rows: [
        { label: '项目', value: project },
        { label: '目标类型', value: milestone },
        { label: '完成率', value: `${percent}%`, class: percent >= 90 ? 'success' : 'warning' },
        { label: '剩余时间', value: `${fluctuate(8, 3)}天` },
      ],
      description: `${project}本${milestone === '月度目标' ? '月' : '季度'}完成率已达${percent}%，${percent >= 90 ? '预计将提前完成目标' : '需要加速推进以达成目标'}。`,
    }
  }
}

function showNext() {
  if (currentNotification.value) return
  currentNotification.value = generateNotification()
  playNotificationSound()
  setTimeout(() => {
    currentNotification.value = null
  }, displayDuration)
}

function dismiss() {
  currentNotification.value = null
}

function handleClick() {
  if (currentNotification.value) {
    detailData.value = { ...currentNotification.value }
    detailVisible.value = true
    currentNotification.value = null
    playClickSound()
  }
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  setTimeout(() => {
    showNext()
    timer = setInterval(() => {
      setTimeout(showNext, fluctuate(3000, 2000))
    }, 60000)
  }, 8000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.notification-popup {
  position: fixed;
  top: 72px;
  right: 20px;
  width: 340px;
  border-radius: 12px;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 40px rgba(96, 165, 250, 0.08);
  z-index: 300;
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: blur(12px);

  &.deal { border-color: rgba(34, 197, 94, 0.25); }
  &.viewing { border-color: rgba(96, 165, 250, 0.25); }
  &.alert { border-color: rgba(245, 158, 11, 0.25); }
  &.milestone { border-color: rgba(139, 92, 246, 0.25); }
}

.notify-header { display: flex; align-items: center; gap: 8px; padding: 12px 14px 6px; }
.notify-icon { font-size: 16px; }
.notify-title { flex: 1; font-size: 13px; font-weight: 700; color: var(--text-title, #e2e8f0); }

.notify-close {
  width: 20px; height: 20px; border: none; background: transparent;
  color: var(--text-caption, #64748b); cursor: pointer; border-radius: 4px;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.06); color: var(--text-body, #cbd5e1); }
}

.notify-body { padding: 4px 14px 8px; font-size: 12px; color: var(--text-body, #cbd5e1); line-height: 1.5; }
.notify-footer { display: flex; justify-content: space-between; align-items: center; padding: 0 14px 8px; }
.notify-time { font-size: 10px; color: var(--text-caption, #64748b); }
.notify-action { font-size: 10px; font-weight: 600; color: var(--primary, #60a5fa); letter-spacing: 0.3px; }
.notify-progress { height: 2px; background: rgba(255, 255, 255, 0.05); }
.notify-progress-bar { height: 100%; background: var(--primary, #60a5fa); animation: progressShrink linear forwards; }
@keyframes progressShrink { from { width: 100%; } to { width: 0%; } }

.notify-slide-enter-active { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.notify-slide-leave-active { animation: slideOut 0.3s ease-in; }
@keyframes slideIn { from { opacity: 0; transform: translateX(60px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes slideOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(60px); } }

.notify-modal-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(6px);
  z-index: 310; display: flex; align-items: center; justify-content: center;
}

.notify-modal {
  width: 420px; max-width: 90vw; border-radius: 14px;
  background: var(--card-bg, #161B22); border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5); overflow: hidden;
  animation: modalEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  &.deal { border-top: 3px solid var(--success, #22C55E); }
  &.viewing { border-top: 3px solid var(--primary, #60a5fa); }
  &.alert { border-top: 3px solid var(--warning, #F59E0B); }
  &.milestone { border-top: 3px solid #8b5cf6; }
}

@keyframes modalEnter { from { opacity: 0; transform: translateY(-20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }

.modal-header { display: flex; align-items: center; gap: 8px; padding: 16px 18px 10px; }
.modal-icon { font-size: 20px; }
.modal-title { flex: 1; font-size: 15px; font-weight: 700; color: var(--text-title, #e2e8f0); }
.modal-close {
  width: 28px; height: 28px; border: none; background: transparent;
  color: var(--text-caption, #64748b); cursor: pointer; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.06); color: var(--text-body, #cbd5e1); }
}

.modal-body { padding: 8px 18px 16px; }
.modal-detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.04); &:last-child { border-bottom: none; } }
.detail-label { font-size: 12px; color: var(--text-caption, #64748b); }
.detail-value { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: var(--text-body, #cbd5e1);
  &.highlight { color: var(--primary, #60a5fa); } &.success { color: var(--success, #22C55E); } &.warning { color: var(--warning, #F59E0B); }
}
.modal-description { margin-top: 12px; padding: 10px 12px; border-radius: 8px; background: rgba(255, 255, 255, 0.03); font-size: 12px; color: var(--text-body, #cbd5e1); line-height: 1.7; }
.modal-footer { padding: 0 18px 14px; display: flex; justify-content: flex-end; }
.modal-btn { padding: 6px 16px; border-radius: 6px; border: 1px solid var(--border, rgba(255, 255, 255, 0.08)); background: rgba(255, 255, 255, 0.04); color: var(--text-body, #cbd5e1); font-size: 12px; cursor: pointer; transition: all 0.2s; &:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.12); } }

.modal-fade-enter-active { transition: opacity 0.3s ease; }
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .notification-popup { width: calc(100vw - 20px); right: 10px; top: 65px; }
  .notify-modal { width: calc(100vw - 24px); max-width: none; }
}
</style>

<template>
  <div
    class="ai-robot"
    :class="{ minimized: isMinimized, 'minimizing': isMinimizing, 'waking': isWaking }"
    :style="robotStyle"
    @mousedown="startDrag"
    @touchstart.prevent="startDragTouch"
    @mouseenter="onInteract"
    @click="onInteract"
  >
    <!-- Minimized Indicator (edge dot) -->
    <Transition name="dot-fade">
      <div v-if="isMinimized" class="minimized-indicator" @click.stop="wakeUp">
        <div class="indicator-dot">
          <div class="dot-ring" />
          <div class="dot-core" />
        </div>
        <div class="indicator-label">助手</div>
      </div>
    </Transition>

    <!-- Robot Body -->
    <div v-show="!isMinimized" class="robot-body" :class="{ active: isSpeaking, sleeping: isSleeping }" @click="toggleChat">
      <div class="robot-head">
        <div class="robot-antenna">
          <div class="antenna-ball" />
        </div>
        <div class="robot-eyes">
          <div class="eye left" :class="{ blink: isBlinking, sleepy: isSleeping }" />
          <div class="eye right" :class="{ blink: isBlinking, sleepy: isSleeping }" />
        </div>
        <div class="robot-mouth" :class="{ speaking: isSpeaking }" />
      </div>
      <div class="robot-torso">
        <div class="robot-screen">
          <div class="screen-line l1" />
          <div class="screen-line l2" />
          <div class="screen-line l3" />
        </div>
        <!-- Minimize button -->
        <button class="minimize-btn" @click.stop="minimizeRobot" title="收起助手">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
      </div>
    </div>

    <!-- Speech Bubble -->
    <Transition name="bubble">
      <div v-if="showBubble" class="speech-bubble" :class="bubbleType">
        <div class="bubble-content">{{ bubbleText }}</div>
        <div class="bubble-arrow" />
      </div>
    </Transition>

    <!-- Mini Chat Panel -->
    <Transition name="chat-slide">
      <div v-if="chatOpen" class="robot-chat">
        <div class="chat-header">
          <span class="chat-title">🤖 智能助手</span>
          <button class="chat-close" @click.stop="chatOpen = false">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="chat-messages" ref="chatMessagesRef">
          <div v-for="(msg, i) in messages" :key="i" class="chat-msg" :class="msg.from">
            {{ msg.text }}
          </div>
        </div>
        <div class="chat-input-row">
          <input
            v-model="userInput"
            class="chat-input"
            placeholder="输入问题，如：今天成交情况"
            @keydown.enter="sendMessage"
          />
          <button class="chat-send" @click="sendMessage">发送</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useSound } from '@/composables/useSound'
import { fluctuate } from '@/utils/mockData'

const { playRobotTipSound, playClickSound } = useSound()

// ===== Idle & Minimize =====
const IDLE_TIMEOUT = 60_000 // 1 minute
const isMinimized = ref(false)
const isMinimizing = ref(false)
const isWaking = ref(false)
const isSleeping = ref(false)
let idleTimer: ReturnType<typeof setTimeout> | null = null

function resetIdle() {
  if (idleTimer) clearTimeout(idleTimer)
  if (isMinimized.value) return // don't start idle timer while minimized
  idleTimer = setTimeout(() => {
    minimizeRobot()
  }, IDLE_TIMEOUT)
}

function onInteract() {
  resetIdle()
}

function minimizeRobot() {
  if (isMinimized.value) return
  chatOpen.value = false
  showBubble.value = false
  isMinimizing.value = true
  isSleeping.value = true
  setTimeout(() => {
    isMinimized.value = true
    isMinimizing.value = false
  }, 400)
  if (idleTimer) clearTimeout(idleTimer)
}

function wakeUp() {
  isMinimized.value = false
  isWaking.value = true
  isSleeping.value = false
  playClickSound()
  setTimeout(() => {
    isWaking.value = false
  }, 500)
  resetIdle()
}

// ===== Position & Dragging =====
const pos = ref({ x: window.innerWidth - 100, y: window.innerHeight - 160 })
const dragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

const robotStyle = computed(() => {
  if (isMinimized.value) {
    // Stick to the right edge, vertically centered
    return {
      right: '0px',
      top: '50%',
      transform: 'translateY(-50%)',
      left: 'auto',
    }
  }
  return {
    left: pos.value.x + 'px',
    top: pos.value.y + 'px',
    right: 'auto',
    transform: 'none',
  }
})

function startDrag(e: MouseEvent) {
  if (isMinimized.value) return
  dragging.value = true
  dragOffset.value = { x: e.clientX - pos.value.x, y: e.clientY - pos.value.y }
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  onInteract()
}

function startDragTouch(e: TouchEvent) {
  if (isMinimized.value) return
  dragging.value = true
  const t = e.touches[0]
  dragOffset.value = { x: t.clientX - pos.value.x, y: t.clientY - pos.value.y }
  window.addEventListener('touchmove', onDragTouch, { passive: false })
  window.addEventListener('touchend', stopDrag)
  onInteract()
}

function onDrag(e: MouseEvent) {
  if (!dragging.value) return
  pos.value = {
    x: Math.max(0, Math.min(window.innerWidth - 80, e.clientX - dragOffset.value.x)),
    y: Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffset.value.y)),
  }
}

function onDragTouch(e: TouchEvent) {
  if (!dragging.value) return
  e.preventDefault()
  const t = e.touches[0]
  pos.value = {
    x: Math.max(0, Math.min(window.innerWidth - 80, t.clientX - dragOffset.value.x)),
    y: Math.max(0, Math.min(window.innerHeight - 80, t.clientY - dragOffset.value.y)),
  }
}

function stopDrag() {
  dragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDragTouch)
  window.removeEventListener('touchend', stopDrag)
}

// ===== Blinking =====
const isBlinking = ref(false)
let blinkTimer: ReturnType<typeof setInterval> | null = null

// ===== Speech =====
const isSpeaking = ref(false)
const showBubble = ref(false)
const bubbleText = ref('')
const bubbleType = ref<'info' | 'tip' | 'alert'>('info')
let bubbleTimer: ReturnType<typeof setTimeout> | null = null

// ===== Chat =====
const chatOpen = ref(false)
const userInput = ref('')
const chatMessagesRef = ref<HTMLElement | null>(null)

interface ChatMsg {
  from: 'bot' | 'user'
  text: string
}

const messages = ref<ChatMsg[]>([
  { from: 'bot', text: '你好！我是城发投智能助手，你可以问我任何关于大盘数据的问题。' },
])

const tips = [
  '今日成交有所上升，关注龙泉湖片区动向',
  '城发投·云山樾去化率领先，建议加大推广',
  '高新板块回款率偏低，建议专项催收',
  '抖音渠道转化率2.0%，低于行业均值',
  '老带新渠道效果最佳，转化率22%',
  '桥西区本月成交38套，区域第一',
  '本月环比增长5.2%，整体趋势向好',
  '库存去化周期14.2月，需关注滞销房源',
]

function showTip() {
  // Wake up if minimized to show the tip
  if (isMinimized.value) {
    isMinimized.value = false
    isSleeping.value = false
    isWaking.value = true
    setTimeout(() => { isWaking.value = false }, 500)
  }

  if (chatOpen.value) return
  const tip = tips[Math.floor(Math.random() * tips.length)]
  bubbleText.value = tip
  bubbleType.value = Math.random() > 0.7 ? 'alert' : 'tip'
  showBubble.value = true
  isSpeaking.value = true
  playRobotTipSound()

  if (bubbleTimer) clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => {
    showBubble.value = false
    isSpeaking.value = false
    // After tip finishes, restart idle timer (will minimize if still idle)
    resetIdle()
  }, 5000)
}

function toggleChat() {
  if (dragging.value) return
  chatOpen.value = !chatOpen.value
  showBubble.value = false
  playClickSound()
  onInteract()
}

function sendMessage() {
  const text = userInput.value.trim()
  if (!text) return
  messages.value.push({ from: 'user', text })
  userInput.value = ''

  setTimeout(() => {
    const reply = generateReply(text)
    messages.value.push({ from: 'bot', text: reply })
    isSpeaking.value = true
    playRobotTipSound()
    setTimeout(() => { isSpeaking.value = false }, 1500)
    nextTick(() => {
      if (chatMessagesRef.value) {
        chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
      }
    })
  }, 600)
  onInteract()
}

function generateReply(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('成交') || lower.includes('销售')) {
    return `今日成交${fluctuate(18, 6)}套，本月累计${fluctuate(386, 40)}套，环比增长${fluctuate(5, 3).toFixed(1)}%。裕华区表现最佳。`
  }
  if (lower.includes('库存') || lower.includes('滞销')) {
    return `当前库存${fluctuate(3280, 200)}套，货值${fluctuate(38, 4).toFixed(1)}亿，去化周期${fluctuate(14, 3).toFixed(1)}个月。鹿泉区和高新板块去化较慢，需重点关注。`
  }
  if (lower.includes('回款') || lower.includes('资金')) {
    return `总回款率${fluctuate(76, 6).toFixed(1)}%，回款金额${fluctuate(62, 8).toFixed(1)}亿。高新板块回款率最低，建议启动专项催收。`
  }
  if (lower.includes('渠道')) {
    return `老带新渠道转化率最高(22%)，抖音渠道仅2.0%。建议加大老带新激励力度，优化线上渠道投放策略。`
  }
  if (lower.includes('风险') || lower.includes('预警')) {
    return `当前${fluctuate(3, 1)}个项目处于预警状态，主要集中在鹿泉区和高新板块。主要风险为库存去化慢和回款率偏低。`
  }
  if (lower.includes('客户') || lower.includes('画像')) {
    return `主力客群为改善型需求(45%)，预算区间120-200万。年龄集中在30-45岁，主要来源为老带新和线上渠道。`
  }
  return `收到！根据最新数据：去化率${fluctuate(68, 8).toFixed(1)}%，累计销售${fluctuate(86, 10).toFixed(1)}亿。整体经营稳中向好，建议重点关注回款和库存指标。`
}

let tipInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  blinkTimer = setInterval(() => {
    if (isMinimized.value) return
    isBlinking.value = true
    setTimeout(() => { isBlinking.value = false }, 200)
  }, 3000)

  // Show first tip after 15s, then every 30-60s
  setTimeout(() => {
    showTip()
    tipInterval = setInterval(() => {
      if (Math.random() > 0.4) showTip()
    }, 35000)
  }, 15000)

  // Start idle timer
  resetIdle()
})

onUnmounted(() => {
  if (blinkTimer) clearInterval(blinkTimer)
  if (tipInterval) clearInterval(tipInterval)
  if (bubbleTimer) clearTimeout(bubbleTimer)
  if (idleTimer) clearTimeout(idleTimer)
})
</script>

<style scoped lang="scss">
.ai-robot {
  position: fixed;
  z-index: 250;
  cursor: grab;
  user-select: none;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &:active { cursor: grabbing; }

  &.minimized {
    cursor: pointer;
    left: auto !important;
  }

  &.minimizing .robot-body {
    animation: minimizeShrink 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  &.waking .robot-body {
    animation: wakeStretch 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

@keyframes minimizeShrink {
  0% { transform: scale(1) rotate(0deg); opacity: 1; }
  30% { transform: scale(1.05) rotate(-3deg); opacity: 1; }
  60% { transform: scale(0.4) rotate(5deg); opacity: 0.5; }
  100% { transform: scale(0.1) rotate(0deg) translateX(60px); opacity: 0; }
}

@keyframes wakeStretch {
  0% { transform: scale(0.1) rotate(0deg) translateX(40px); opacity: 0; }
  20% { transform: scale(0.5) rotate(-5deg) translateX(10px); opacity: 0.7; }
  50% { transform: scale(1.15) rotate(3deg) translateX(-3px); opacity: 1; }
  70% { transform: scale(0.95) rotate(-1deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg) translateX(0); opacity: 1; }
}

// ===== Minimized Indicator =====
.minimized-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    .indicator-dot { transform: scale(1.2); }
    .dot-ring { border-color: rgba(99, 102, 241, 0.6); }
    .dot-core { box-shadow: 0 0 12px rgba(99, 102, 241, 0.8); }
    .indicator-label { color: var(--text-body, #cbd5e1); }
  }
}

.indicator-dot {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dot-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(99, 102, 241, 0.3);
  animation: ringPulse 2.5s ease-in-out infinite;
}

.dot-core {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
  animation: coreGlow 2.5s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); border-color: rgba(99, 102, 241, 0.2); }
  50% { transform: scale(1.15); border-color: rgba(99, 102, 241, 0.5); }
}

@keyframes coreGlow {
  0%, 100% { box-shadow: 0 0 6px rgba(99, 102, 241, 0.4); }
  50% { box-shadow: 0 0 16px rgba(99, 102, 241, 0.8); }
}

.indicator-label {
  font-size: 9px;
  color: var(--text-caption, #64748b);
  letter-spacing: 1px;
  writing-mode: horizontal-tb;
  transition: color 0.2s;
}

.dot-fade-enter-active { animation: dotIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.dot-fade-leave-active { animation: dotOut 0.2s ease-in; }

@keyframes dotIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes dotOut {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.5); }
}

.robot-body {
  width: 64px;
  height: 72px;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;

  &:hover { transform: scale(1.1); }
  &.active { animation: robotBounce 0.5s ease; }
  &.sleeping {
    opacity: 0.5;
    transform: scale(0.9);
    .antenna-ball { animation: none; box-shadow: 0 0 4px rgba(96, 165, 250, 0.2); }
    .screen-line { animation: none; opacity: 0.2; }
  }
}

@keyframes robotBounce {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-6px) rotate(-3deg); }
  75% { transform: translateY(-3px) rotate(3deg); }
}

.robot-head {
  width: 48px;
  height: 36px;
  margin: 0 auto;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border-radius: 12px 12px 8px 8px;
  position: relative;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.4);
}

.robot-antenna {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 8px;
  background: #6366f1;
}

.antenna-ball {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #60a5fa;
  position: absolute;
  top: -4px;
  left: -2px;
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.6);
  animation: antennaPulse 2s ease-in-out infinite;
}

@keyframes antennaPulse {
  0%, 100% { box-shadow: 0 0 6px rgba(96, 165, 250, 0.4); }
  50% { box-shadow: 0 0 14px rgba(96, 165, 250, 0.8); }
}

.robot-eyes {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 10px;
}

.eye {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
  transition: all 0.15s;

  &.blink {
    height: 2px;
    border-radius: 2px;
    margin-top: 3px;
  }

  &.sleepy {
    height: 3px;
    border-radius: 2px;
    margin-top: 2.5px;
    opacity: 0.5;
  }
}

.robot-mouth {
  width: 12px;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.5);
  margin: 5px auto 0;
  transition: all 0.2s;

  &.speaking {
    width: 14px;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.8);
    animation: mouthMove 0.3s ease-in-out infinite;
  }
}

@keyframes mouthMove {
  0%, 100% { height: 6px; }
  50% { height: 3px; }
}

.robot-torso {
  width: 40px;
  height: 30px;
  margin: 4px auto 0;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 6px 6px 10px 10px;
  position: relative;
  box-shadow: 0 3px 12px rgba(124, 58, 237, 0.3);
  overflow: visible;
}

.robot-screen {
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  padding: 3px;
}

.minimize-btn {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(30, 34, 42, 0.9);
  color: var(--text-caption, #64748b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s;
  z-index: 2;

  .robot-body:hover & { opacity: 1; }
  &:hover { background: rgba(99, 102, 241, 0.3); color: var(--text-title, #e2e8f0); }
}

.screen-line {
  height: 2px;
  border-radius: 1px;
  margin-bottom: 3px;
  background: rgba(96, 165, 250, 0.6);
  animation: screenPulse 3s ease-in-out infinite;

  &.l1 { width: 80%; animation-delay: 0s; }
  &.l2 { width: 60%; animation-delay: 0.5s; }
  &.l3 { width: 70%; animation-delay: 1s; }
}

@keyframes screenPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

// ===== Speech Bubble =====
.speech-bubble {
  position: absolute;
  bottom: calc(100% + 10px);
  right: -10px;
  width: 220px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-body, #cbd5e1);
  pointer-events: none;

  &.info {
    background: var(--card-bg, #161B22);
    border: 1px solid rgba(96, 165, 250, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }
  &.tip {
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.2);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
  }
  &.alert {
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.2);
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.15);
  }
}

.bubble-arrow {
  position: absolute;
  bottom: -6px;
  right: 30px;
  width: 12px;
  height: 12px;
  background: var(--card-bg, #161B22);
  border-right: 1px solid rgba(96, 165, 250, 0.2);
  border-bottom: 1px solid rgba(96, 165, 250, 0.2);
  transform: rotate(45deg);
}

.bubble-enter-active { animation: bubbleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.bubble-leave-active { animation: bubbleOut 0.2s ease-in; }

@keyframes bubbleIn {
  from { opacity: 0; transform: scale(0.8) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes bubbleOut {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.8) translateY(10px); }
}

// ===== Chat Panel =====
.robot-chat {
  position: absolute;
  bottom: calc(100% + 10px);
  right: -200px;
  width: 300px;
  border-radius: 12px;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  background: rgba(99, 102, 241, 0.08);
}

.chat-title {
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-title, #e2e8f0);
}

.chat-close {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--text-caption, #64748b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { color: var(--text-body, #cbd5e1); }
}

.chat-messages {
  height: 200px;
  overflow-y: auto;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chat-msg {
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.5;
  max-width: 85%;

  &.bot {
    align-self: flex-start;
    background: rgba(99, 102, 241, 0.1);
    color: var(--text-body, #cbd5e1);
    border-bottom-left-radius: 2px;
  }

  &.user {
    align-self: flex-end;
    background: rgba(96, 165, 250, 0.15);
    color: var(--text-title, #e2e8f0);
    border-bottom-right-radius: 2px;
  }
}

.chat-input-row {
  display: flex;
  gap: 6px;
  padding: 8px 10px;
  border-top: 1px solid var(--border, rgba(255, 255, 255, 0.06));
}

.chat-input {
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-body, #cbd5e1);
  font-size: 11px;
  outline: none;

  &:focus { border-color: rgba(99, 102, 241, 0.3); }
}

.chat-send {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: rgba(99, 102, 241, 0.3); }
}

.chat-slide-enter-active { animation: chatIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.chat-slide-leave-active { animation: chatOut 0.2s ease-in; }

@keyframes chatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes chatOut {
  from { opacity: 1; }
  to { opacity: 0; transform: translateY(10px); }
}

@media (max-width: 768px) {
  .robot-chat { width: 260px; right: -140px; }
  .speech-bubble { width: 180px; }
}
</style>

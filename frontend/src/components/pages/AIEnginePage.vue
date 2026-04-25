<template>
  <div class="ai-cinema" :class="{ 'is-paused': isPaused }">
    <!-- 背景粒子网格 -->
    <div class="cinema-bg">
      <canvas ref="bgCanvas" class="bg-canvas"></canvas>
      <div class="grid-overlay"></div>
    </div>

    <!-- HUD 顶部栏 -->
    <header class="cinema-hud-top">
      <div class="hud-left">
        <span class="live-dot"></span>
        <span class="hud-label">SMART ESTATE AI ENGINE</span>
        <span class="hud-divider">|</span>
        <span class="hud-scene-counter">{{ currentScenarioIndex + 1 }} / {{ liveScenarios.length }}</span>
      </div>
      <div class="hud-center">
        <div class="scenario-indicators">
          <span v-for="(_, i) in liveScenarios" :key="i"
            class="indicator-dot"
            :class="{ active: currentScenarioIndex === i, visited: visitedScenarios.has(i) }"
            :style="{ '--dot-color': liveScenarios[i].color }"
            @click="jumpToScenario(i)"
          ></span>
        </div>
      </div>
      <div class="hud-right">
        <button class="hud-btn" :class="{ active: voiceEnabled }" @click="toggleVoice" :title="voiceEnabled ? '关闭语音' : '开启语音'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="voiceEnabled" d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path v-else d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/>
          </svg>
        </button>
        <button class="hud-btn" :class="{ active: isPaused }" @click="togglePause" :title="isPaused ? '继续' : '暂停'">
          <svg v-if="isPaused" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 3l14 9-14 9V3z"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- 主舞台 -->
    <main class="cinema-stage">
      <!-- 场景标题卡 (场景切换时短暂显示) -->
      <Transition name="title-card">
        <div v-if="showTitleCard" class="title-card" :style="{ '--accent': currentScenarioData?.color }">
          <div class="tc-number">{{ String(currentScenarioIndex + 1).padStart(2, '0') }}</div>
          <div class="tc-title">{{ currentScenarioData?.title }}</div>
          <div class="tc-bar"></div>
        </div>
      </Transition>

      <!-- 终端对话区 (左) -->
      <div class="stage-terminal">
        <div class="terminal-inner" ref="terminalBody">
          <!-- 用户输入 -->
          <div class="chat-row user-row" :class="{ 'row-enter': showUserRow }">
            <div class="chat-avatar user-av">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div class="chat-bubble user-bubble">
              <span class="bubble-label">自然语言查询</span>
              <div class="bubble-text">
                <span class="typed-text">{{ typedQuery }}</span>
                <span class="cursor-blink" v-if="phase === 'typing-query'">|</span>
              </div>
            </div>
          </div>

          <!-- SQL转换展示 -->
          <div class="sql-preview" v-if="phase === 'thinking' || phase === 'typing-response' || phase === 'paused'">
            <div class="sql-badge">NL → SQL</div>
            <code class="sql-code">{{ currentScenarioData?.sqlPreview }}</code>
          </div>

          <!-- AI思考动画 -->
          <div class="chat-row ai-row thinking-row" v-if="phase === 'thinking'">
            <div class="chat-avatar ai-av">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93V12h3.75a2.5 2.5 0 0 1 2.5 2.5v1.75c1.85.35 3.25 1.98 3.25 3.93a4 4 0 1 1-6.5-3.12V14.5a.5.5 0 0 0-.5-.5h-8.5a.5.5 0 0 0-.5.5v2.56A4 4 0 1 1 2 20.18c0-1.95 1.4-3.58 3.25-3.93V14.5A2.5 2.5 0 0 1 7.75 12h3.5V9.93A4.002 4.002 0 0 1 12 2z"/></svg>
            </div>
            <div class="thinking-dots">
              <span class="dot-anim"></span><span class="dot-anim"></span><span class="dot-anim"></span>
            </div>
          </div>

          <!-- AI回复 -->
          <div class="chat-row ai-row" :class="{ 'row-enter': showAiRow }" v-if="phase === 'typing-response' || phase === 'paused'">
            <div class="chat-avatar ai-av">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93V12h3.75a2.5 2.5 0 0 1 2.5 2.5v1.75c1.85.35 3.25 1.98 3.25 3.93a4 4 0 1 1-6.5-3.12V14.5a.5.5 0 0 0-.5-.5h-8.5a.5.5 0 0 0-.5.5v2.56A4 4 0 1 1 2 20.18c0-1.95 1.4-3.58 3.25-3.93V14.5A2.5 2.5 0 0 1 7.75 12h3.5V9.93A4.002 4.002 0 0 1 12 2z"/></svg>
            </div>
            <div class="chat-bubble ai-bubble">
              <span class="bubble-label ai-label">AI 智能分析</span>
              <div class="bubble-text">
                <span class="typed-text">{{ typedResponse }}</span>
                <span class="cursor-blink" v-if="phase === 'typing-response'">|</span>
              </div>
              <div class="response-techs" v-if="phase === 'paused' || phase === 'typing-response'">
                <span class="r-tech" v-for="t in currentScenarioData?.techs" :key="t">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据可视化区 (右) -->
      <div class="stage-visual" :style="{ '--accent': currentScenarioData?.color }">
        <div class="visual-header">
          <span class="vh-badge">DATA INSIGHT</span>
          <span class="vh-title">{{ currentScenarioData?.title }}</span>
        </div>
        <div class="visual-body">
          <!-- 场景专属可视化 -->
          <div class="visual-chart" v-if="currentScenarioIndex === 0">
            <!-- 区域对比柱状 -->
            <div class="bar-compare">
              <div class="bar-item" v-for="b in regionBars" :key="b.name">
                <span class="bar-name">{{ b.name }}</span>
                <div class="bar-track"><div class="bar-fill" :style="{ width: b.pct + '%', background: b.color }"></div></div>
                <span class="bar-val">{{ b.val }}</span>
              </div>
            </div>
          </div>
          <div class="visual-chart" v-else-if="currentScenarioIndex === 1">
            <!-- 价格仪表盘 -->
            <div class="gauge-display">
              <div class="gauge-ring" :style="{ '--gauge-pct': 68, '--gauge-color': '#22c55e' }">
                <span class="gauge-val">13200</span>
                <span class="gauge-unit">元/㎡</span>
              </div>
              <div class="gauge-labels">
                <span class="gl-item"><span class="gl-dot" style="background:#ef4444"></span>当前 14000</span>
                <span class="gl-item"><span class="gl-dot" style="background:#22c55e"></span>建议 13200</span>
                <span class="gl-item"><span class="gl-dot" style="background:#f59e0b"></span>竞品 12800</span>
              </div>
            </div>
          </div>
          <div class="visual-chart" v-else-if="currentScenarioIndex === 2">
            <!-- 回款率漏斗 -->
            <div class="funnel-chart">
              <div v-for="f in paymentFunnel" :key="f.label" class="funnel-step" :style="{ '--f-color': f.color, '--f-width': f.pct + '%' }">
                <span class="funnel-label">{{ f.label }}</span>
                <span class="funnel-val">{{ f.val }}</span>
              </div>
            </div>
          </div>
          <div class="visual-chart" v-else-if="currentScenarioIndex === 3">
            <!-- 趋势预测线 -->
            <div class="forecast-chart">
              <div class="fc-row fc-header">
                <span></span><span>Q2</span><span>Q3</span><span>Q4</span>
              </div>
              <div v-for="f in forecastData" :key="f.label" class="fc-row">
                <span class="fc-label">{{ f.label }}</span>
                <span v-for="(v, i) in f.values" :key="i" class="fc-cell" :class="{ highlight: i === f.values.length - 1 }">{{ v }}</span>
              </div>
              <div class="fc-note">置信区间 95% | Prophet + 政策变量</div>
            </div>
          </div>
          <div class="visual-chart" v-else-if="currentScenarioIndex === 4">
            <!-- 客户画像 -->
            <div class="persona-chart">
              <div v-for="p in personaData" :key="p.label" class="persona-bar">
                <span class="pb-label">{{ p.label }}</span>
                <div class="pb-track"><div class="pb-fill" :style="{ width: p.pct + '%', background: p.color }"></div></div>
                <span class="pb-val">{{ p.pct }}%</span>
              </div>
            </div>
          </div>
          <div class="visual-chart" v-else-if="currentScenarioIndex === 5">
            <!-- 渠道ROI -->
            <div class="roi-chart">
              <div v-for="r in channelRoi" :key="r.name" class="roi-item" :class="{ best: r.best }">
                <span class="roi-name">{{ r.name }}</span>
                <div class="roi-bar-wrap">
                  <div class="roi-bar" :style="{ width: r.pct + '%', background: r.color }"></div>
                </div>
                <span class="roi-val">1:{{ r.roi }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 底部AI能力环 -->
        <div class="visual-footer">
          <div class="cap-mini" v-for="c in capacityItems" :key="c.label">
            <div class="cap-ring-sm" :style="{ '--ring-pct': c.percent, '--ring-color': c.color }">
              <span class="cap-v">{{ c.value }}</span>
            </div>
            <span class="cap-l">{{ c.label }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部进度条 -->
    <footer class="cinema-hud-bottom">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: scenarioProgress + '%' }"></div>
      </div>
      <div class="phase-label">{{ phaseLabel }}</div>
    </footer>

    <!-- 扫描线 -->
    <div class="scanline"></div>
    <!-- 四角HUD -->
    <div class="corner-hud ch-tl"><span></span><span></span></div>
    <div class="corner-hud ch-tr"><span></span><span></span></div>
    <div class="corner-hud ch-bl"><span></span><span></span></div>
    <div class="corner-hud ch-br"><span></span><span></span></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

// ====== 场景数据 ======
interface LiveScenario {
  title: string
  color: string
  userQuery: string
  sqlPreview: string
  aiResponse: string
  techs: string[]
  voiceIntro: string
}

const liveScenarios: LiveScenario[] = [
  {
    title: '自然语言查询',
    color: '#60a5fa',
    userQuery: '裕华区这个月卖了多少套？跟长安区比怎么样？',
    sqlPreview: "SELECT r.name, COUNT(*) AS deals, AVG(u.price) AS avg_price FROM deals d JOIN units u ON d.unit_id=u.id JOIN projects p ON u.project_id=p.id JOIN regions r ON p.region_id=r.id WHERE d.deal_date >= '2025-04-01' AND r.name IN ('裕华区','长安区') GROUP BY r.name ORDER BY deals DESC;",
    aiResponse: '裕华区本月成交180套，环比+12%，均价17500元/㎡；长安区成交210套但环比-3%。裕华区虽然量少但增速更快，建议加推热门户型。',
    techs: ['NL2SQL', 'RAG', 'LLM Reasoning'],
    voiceIntro: '自然语言查询场景演示。用户用日常语言提问，AI自动转化为SQL查询并返回分析结果。',
  },
  {
    title: '智能定价决策',
    color: '#22c55e',
    userQuery: '龙泉湖项目要不要降价？降多少合适？',
    sqlPreview: "SELECT p.name, p.avg_price, p.sales_cycle, c.competitor_avg FROM projects p LEFT JOIN competitor_analysis c ON p.region_id=c.region_id WHERE p.name = '龙泉湖';",
    aiResponse: '龙泉湖项目去化周期22个月(红灯)，周边竞品均价12800。建议下调至13200元/㎡(降6%)，预计去化周期缩短至14个月，利润率从8%降至5.2%但总利润增加1200万。',
    techs: ['XGBoost', '因果推断', '优化求解'],
    voiceIntro: '智能定价决策场景。AI综合考虑竞品、去化周期和利润率，给出最优定价建议。',
  },
  {
    title: '预警根因分析',
    color: '#ef4444',
    userQuery: '为什么这个月回款率突然降了？',
    sqlPreview: "SELECT region, SUM(amount) AS total, SUM(CASE WHEN status='overdue' THEN amount ELSE 0 END)/SUM(amount) AS overdue_rate FROM payment_records WHERE month = CURRENT_MONTH GROUP BY region ORDER BY overdue_rate DESC;",
    aiResponse: '回款率从78%降至65%，根因分析：①桥西区3个项目按揭放款延迟(占58%)；②高新区首付逾期率升至22%(占30%)；③季节因素(占12%)。建议：对接公积金中心加速审批+逾期专项催收。',
    techs: ['异常检测', '因果推断', 'DoWhy'],
    voiceIntro: '预警根因分析场景。AI自动识别异常指标，通过因果推断找到根本原因并给出对策。',
  },
  {
    title: '趋势预测研判',
    color: '#a78bfa',
    userQuery: '下半年市场会怎么样？我们能不能完成目标？',
    sqlPreview: "WITH forecast AS (SELECT prophet_predict(sales_amount, '2025-Q3', '2025-Q4', confidence=>0.95) AS pred FROM monthly_sales) SELECT pred.q3_estimate, pred.q4_estimate, pred.annual_completion FROM forecast;",
    aiResponse: '基于Prophet+政策变量预测：Q3销售额预计38亿(置信区间34-42亿)，Q4预计45亿(受政策利好)。全年完成率预计92%，缺口9.6亿。建议Q3加大渠道投放+Q4推出2个新盘补缺口。',
    techs: ['Prophet', '蒙特卡洛模拟', 'LLM合成'],
    voiceIntro: '趋势预测研判场景。AI基于时序模型和政策变量，预测未来销售趋势和目标完成率。',
  },
  {
    title: '客户画像洞察',
    color: '#06b6d4',
    userQuery: '我们高端项目的客户都有什么特征？哪里还能找到类似客户？',
    sqlPreview: "SELECT c.age_group, c.income_level, c.occupation, COUNT(*) AS cnt, shap_explain(c.*) AS top_features FROM customers c JOIN deals d ON c.id=d.customer_id JOIN projects p ON d.project_id=p.id WHERE p.tier='luxury' GROUP BY c.age_group, c.income_level, c.occupation ORDER BY cnt DESC LIMIT 10;",
    aiResponse: '高端客户核心画像：35-50岁(72%)、企业主/高管(65%)、家庭年收入80万+(58%)。关键决策因子：学区(32%)、圈层社交(25%)、投资回报(22%)。建议重点拓展金融街CBD和高新区产业园客户。',
    techs: ['SHAP', '聚类分析', '知识图谱'],
    voiceIntro: '客户画像洞察场景。AI通过SHAP可解释分析，揭示高端客户的决策因子和拓展方向。',
  },
  {
    title: '渠道效果归因',
    color: '#f59e0b',
    userQuery: '各渠道的投入产出比怎么样？哪些渠道值得加大投放？',
    sqlPreview: "SELECT ch.name, ch.cost, COUNT(d.id) AS deals, SUM(d.amount)/ch.cost AS roi, causal_effect(ch.cost, d.amount) AS true_effect FROM channels ch LEFT JOIN deals d ON ch.id=d.channel_id GROUP BY ch.name ORDER BY roi DESC;",
    aiResponse: '渠道ROI排名：①自然来访 1:18 ②老带新 1:15 ③贝壳 1:8 ④抖音 1:5 ⑤户外广告 1:2。因果推断显示贝壳真实贡献被高估20%(混淆变量：项目地段)，抖音被低估35%(长尾效应)。建议削减户外预算50%→转投抖音信息流。',
    techs: ['因果推断', 'CausalML', 'SHAP'],
    voiceIntro: '渠道效果归因场景。AI通过因果推断剥离混淆变量，还原各渠道的真实贡献。',
  },
]

// ====== 可视化数据 ======
const regionBars = [
  { name: '裕华区', val: '180套', pct: 85, color: '#60a5fa' },
  { name: '长安区', val: '210套', pct: 100, color: '#a78bfa' },
  { name: '桥西区', val: '95套', pct: 45, color: '#f59e0b' },
  { name: '高新区', val: '150套', pct: 71, color: '#22c55e' },
]

const paymentFunnel = [
  { label: '签约总额', val: '12.8亿', pct: 100, color: '#60a5fa' },
  { label: '首付到位', val: '9.6亿', pct: 75, color: '#a78bfa' },
  { label: '按揭放款', val: '6.8亿', pct: 53, color: '#f59e0b' },
  { label: '实际回款', val: '8.3亿', pct: 65, color: '#ef4444' },
]

const forecastData = [
  { label: '销售额', values: ['32亿', '38亿', '45亿'] },
  { label: '完成率', values: ['68%', '82%', '92%'] },
  { label: '缺口', values: ['14.4亿', '9.6亿', '4.8亿'] },
]

const personaData = [
  { label: '35-50岁', pct: 72, color: '#06b6d4' },
  { label: '企业主/高管', pct: 65, color: '#a78bfa' },
  { label: '年收入80万+', pct: 58, color: '#f59e0b' },
  { label: '学区决策', pct: 32, color: '#22c55e' },
  { label: '圈层社交', pct: 25, color: '#60a5fa' },
]

const channelRoi = [
  { name: '自然来访', roi: 18, pct: 100, color: '#22c55e', best: true },
  { name: '老带新', roi: 15, pct: 83, color: '#06b6d4', best: false },
  { name: '贝壳', roi: 8, pct: 44, color: '#60a5fa', best: false },
  { name: '抖音', roi: 5, pct: 28, color: '#f59e0b', best: false },
  { name: '户外广告', roi: 2, pct: 11, color: '#ef4444', best: false },
]

const capacityItems = [
  { label: '查询准确率', value: '96%', percent: 96, color: '#60a5fa' },
  { label: '预测精度', value: '89%', percent: 89, color: '#22c55e' },
  { label: '响应时延', value: '<1s', percent: 95, color: '#f59e0b' },
  { label: '决策覆盖', value: '85%', percent: 85, color: '#a78bfa' },
  { label: '幻觉率', value: '<3%', percent: 97, color: '#ef4444' },
]

// ====== 状态机 ======
type Phase = 'idle' | 'typing-query' | 'thinking' | 'typing-response' | 'paused'

const currentScenarioIndex = ref(0)
const phase = ref<Phase>('idle')
const typedQuery = ref('')
const typedResponse = ref('')
const voiceEnabled = ref(true)
const isPaused = ref(false)
const visitedScenarios = ref<Set<number>>(new Set())
const terminalBody = ref<HTMLElement | null>(null)
const showUserRow = ref(false)
const showAiRow = ref(false)
const showTitleCard = ref(false)
const bgCanvas = ref<HTMLCanvasElement | null>(null)

let typeTimer: ReturnType<typeof setTimeout> | null = null
let scenarioTimer: ReturnType<typeof setTimeout> | null = null
let thinkTimer: ReturnType<typeof setTimeout> | null = null
let titleCardTimer: ReturnType<typeof setTimeout> | null = null
let bgAnimFrame: number | null = null

const currentScenarioData = computed(() => liveScenarios[currentScenarioIndex.value])

const scenarioProgress = computed(() => {
  const total = liveScenarios.length
  if (phase.value === 'idle') return ((currentScenarioIndex.value) / total) * 100
  return ((currentScenarioIndex.value + 1) / total) * 100
})

const phaseLabel = computed(() => {
  const labels: Record<Phase, string> = {
    idle: '准备中...',
    'typing-query': '自然语言输入',
    thinking: 'AI 推理中',
    'typing-response': '智能分析输出',
    paused: '场景展示',
  }
  return labels[phase.value]
})

// ====== 语音合成 ======
function speak(text: string, rate = 1.05) {
  if (!voiceEnabled.value || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = rate
  utterance.pitch = 1.0
  const voices = window.speechSynthesis.getVoices()
  const zhVoice = voices.find(v => v.lang.includes('zh'))
  if (zhVoice) utterance.voice = zhVoice
  window.speechSynthesis.speak(utterance)
}

function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

// ====== 打字效果 ======
function typeString(target: 'query' | 'response', text: string, startIndex: number, onDone: () => void) {
  if (isPaused.value) return
  if (startIndex >= text.length) {
    onDone()
    return
  }
  const char = text[startIndex]
  if (target === 'query') {
    typedQuery.value += char
  } else {
    typedResponse.value += char
  }
  const delay = /[，。！？、；：""''】）]/.test(char) ? 90 : 38
  typeTimer = setTimeout(() => {
    typeString(target, text, startIndex + 1, onDone)
  }, delay)
}

function scrollToBottom() {
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  })
}

// ====== 场景播放 ======
function startScenario(index: number) {
  currentScenarioIndex.value = index
  visitedScenarios.value.add(index)
  typedQuery.value = ''
  typedResponse.value = ''
  showUserRow.value = false
  showAiRow.value = false
  phase.value = 'idle'

  // 先显示标题卡
  showTitleCard.value = true
  speak(liveScenarios[index].voiceIntro, 1.0)

  titleCardTimer = setTimeout(() => {
    showTitleCard.value = false
    if (isPaused.value) return
    showUserRow.value = true
    phase.value = 'typing-query'
    scrollToBottom()

    const scenario = liveScenarios[index]
    typeString('query', scenario.userQuery, 0, () => {
      phase.value = 'thinking'
      scrollToBottom()

      thinkTimer = setTimeout(() => {
        if (isPaused.value) return
        phase.value = 'typing-response'
        showAiRow.value = true
        scrollToBottom()

        stopSpeech()
        typeString('response', scenario.aiResponse, 0, () => {
          phase.value = 'paused'
          speak(scenario.aiResponse, 1.15)
          scrollToBottom()

          scenarioTimer = setTimeout(() => {
            const nextIdx = (currentScenarioIndex.value + 1) % liveScenarios.length
            startScenario(nextIdx)
          }, 5000)
        })
      }, 1800)
    })
  }, 2800)
}

function jumpToScenario(index: number) {
  clearAllTimers()
  stopSpeech()
  startScenario(index)
}

function togglePause() {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    clearAllTimers()
    stopSpeech()
    phase.value = 'paused'
  } else {
    startScenario(currentScenarioIndex.value)
  }
}

function toggleVoice() {
  voiceEnabled.value = !voiceEnabled.value
  if (!voiceEnabled.value) {
    stopSpeech()
  }
}

function clearAllTimers() {
  if (typeTimer) clearTimeout(typeTimer)
  if (scenarioTimer) clearTimeout(scenarioTimer)
  if (thinkTimer) clearTimeout(thinkTimer)
  if (titleCardTimer) clearTimeout(titleCardTimer)
  typeTimer = null
  scenarioTimer = null
  thinkTimer = null
  titleCardTimer = null
}

// ====== 背景粒子动画 ======
function initBgCanvas() {
  const canvas = bgCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const c = canvas
  const g = ctx

  const resize = () => {
    c.width = c.offsetWidth * devicePixelRatio
    c.height = c.offsetHeight * devicePixelRatio
    g.scale(devicePixelRatio, devicePixelRatio)
  }
  resize()
  window.addEventListener('resize', resize)

  const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = []
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * c.offsetWidth,
      y: Math.random() * c.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.3 + 0.1,
    })
  }

  function animate() {
    const w = c.offsetWidth
    const h = c.offsetHeight
    g.clearRect(0, 0, w, h)

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0

      g.beginPath()
      g.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      g.fillStyle = `rgba(96, 165, 250, ${p.a})`
      g.fill()
    }

    // 连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          g.beginPath()
          g.moveTo(particles[i].x, particles[i].y)
          g.lineTo(particles[j].x, particles[j].y)
          g.strokeStyle = `rgba(96, 165, 250, ${0.06 * (1 - dist / 120)})`
          g.lineWidth = 0.5
          g.stroke()
        }
      }
    }

    bgAnimFrame = requestAnimationFrame(animate)
  }
  animate()
}

watch([typedQuery, typedResponse], () => {
  scrollToBottom()
})

onMounted(() => {
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices()
  }
  initBgCanvas()
  startScenario(0)
})

onUnmounted(() => {
  clearAllTimers()
  stopSpeech()
  if (bgAnimFrame) cancelAnimationFrame(bgAnimFrame)
})
</script>

<style scoped lang="scss">
/* ===== 全屏影院布局 ===== */
.ai-cinema {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #060a10;
  color: #cbd5e1;
  display: flex;
  flex-direction: column;
}

/* ===== 背景层 ===== */
.cinema-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(96, 165, 250, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(96, 165, 250, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: grid-shift 20s linear infinite;
}
@keyframes grid-shift {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}

/* ===== HUD 顶部 ===== */
.cinema-hud-top {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: rgba(6, 10, 16, 0.8);
  border-bottom: 1px solid rgba(96, 165, 250, 0.08);
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}
.hud-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.live-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
  animation: live-pulse 1.5s ease-in-out infinite;
}
@keyframes live-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}
.hud-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 2px;
  color: rgba(96, 165, 250, 0.6);
  font-weight: 600;
}
.hud-divider {
  color: rgba(96, 165, 250, 0.2);
}
.hud-scene-counter {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(96, 165, 250, 0.8);
  font-weight: 700;
}
.hud-center {
  display: flex;
  align-items: center;
}
.scenario-indicators {
  display: flex;
  gap: 8px;
}
.indicator-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &.visited { border-color: rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.06); }
  &.active {
    border-color: var(--dot-color, #60a5fa);
    background: var(--dot-color, #60a5fa);
    box-shadow: 0 0 12px color-mix(in srgb, var(--dot-color, #60a5fa) 50%, transparent);
    transform: scale(1.3);
  }
}
.hud-right {
  display: flex;
  gap: 6px;
}
.hud-btn {
  width: 34px; height: 34px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  &:hover { border-color: rgba(96, 165, 250, 0.3); color: #60a5fa; background: rgba(96, 165, 250, 0.06); }
  &.active { border-color: rgba(96, 165, 250, 0.4); color: #60a5fa; background: rgba(96, 165, 250, 0.1); }
}

/* ===== 主舞台 ===== */
.cinema-stage {
  position: relative;
  z-index: 5;
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  min-height: 0;
}

/* ===== 场景标题卡 ===== */
.title-card {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(6, 10, 16, 0.92);
  backdrop-filter: blur(20px);
}
.tc-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 64px;
  font-weight: 800;
  color: var(--accent, #60a5fa);
  opacity: 0.15;
  line-height: 1;
}
.tc-title {
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 4px;
  margin-top: 8px;
}
.tc-bar {
  width: 60px;
  height: 3px;
  border-radius: 2px;
  background: var(--accent, #60a5fa);
  margin-top: 16px;
  box-shadow: 0 0 20px color-mix(in srgb, var(--accent, #60a5fa) 40%, transparent);
}

.title-card-enter-active { animation: tc-in 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.title-card-leave-active { animation: tc-out 0.4s cubic-bezier(0.7, 0, 0.84, 0); }
@keyframes tc-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes tc-out { from { opacity: 1; } to { opacity: 0; } }

/* ===== 终端区 ===== */
.stage-terminal {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid rgba(96, 165, 250, 0.1);
  background: rgba(10, 14, 22, 0.85);
  backdrop-filter: blur(12px);
  overflow: hidden;
}
.terminal-inner {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(96, 165, 250, 0.15); border-radius: 2px; }
}

/* 对话行 */
.chat-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  animation: row-slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes row-slide-in {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
.chat-avatar {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-av {
  background: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.25);
}
.ai-av {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.25);
}
.chat-bubble {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: calc(100% - 48px);
}
.user-bubble {
  background: rgba(96, 165, 250, 0.06);
  border: 1px solid rgba(96, 165, 250, 0.12);
}
.ai-bubble {
  background: rgba(34, 197, 94, 0.04);
  border: 1px solid rgba(34, 197, 94, 0.1);
}
.bubble-label {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1.5px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  &.ai-label { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
}
.bubble-text {
  font-size: 14px;
  line-height: 1.8;
  color: #e2e8f0;
  font-weight: 500;
}
.cursor-blink {
  display: inline-block;
  color: #60a5fa;
  font-weight: 300;
  animation: blink-cursor 0.8s step-end infinite;
}
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* SQL预览 */
.sql-preview {
  margin: 4px 0 4px 48px;
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.04);
  border: 1px solid rgba(245, 158, 11, 0.12);
  animation: sql-fade-in 0.5s ease;
  overflow-x: auto;
  &::-webkit-scrollbar { height: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.2); border-radius: 2px; }
}
@keyframes sql-fade-in {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.sql-badge {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}
.sql-code {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  line-height: 1.7;
  color: #94a3b8;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 思考动画 */
.thinking-dots {
  display: flex;
  gap: 5px;
  padding: 14px 0;
  .dot-anim {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #22c55e;
    animation: dot-bounce 1.4s ease-in-out infinite;
    &:nth-child(2) { animation-delay: 0.16s; }
    &:nth-child(3) { animation-delay: 0.32s; }
  }
}
@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* 技术标签 */
.response-techs {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(34, 197, 94, 0.08);
  flex-wrap: wrap;
}
.r-tech {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(34, 197, 94, 0.08);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.15);
}

/* ===== 可视化区 ===== */
.stage-visual {
  flex: 0.9;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid rgba(96, 165, 250, 0.1);
  background: rgba(10, 14, 22, 0.85);
  backdrop-filter: blur(12px);
  overflow: hidden;
}
.visual-header {
  padding: 14px 18px;
  border-bottom: 1px solid rgba(96, 165, 250, 0.06);
  display: flex;
  align-items: center;
  gap: 10px;
}
.vh-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  letter-spacing: 1.5px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(96, 165, 250, 0.08);
  color: rgba(96, 165, 250, 0.6);
}
.vh-title {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
}
.visual-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(96, 165, 250, 0.1); border-radius: 2px; }
}
.visual-chart {
  animation: chart-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes chart-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* 柱状对比图 */
.bar-compare {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.bar-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bar-name { font-size: 12px; color: #94a3b8; width: 50px; text-align: right; flex-shrink: 0; }
.bar-track { flex: 1; height: 24px; background: rgba(255,255,255,0.04); border-radius: 6px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 6px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); position: relative;
  &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 60%, rgba(255,255,255,0.1)); }
}
.bar-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #e2e8f0; font-weight: 600; width: 48px; }

/* 仪表盘 */
.gauge-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
}
.gauge-ring {
  width: 120px; height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    var(--gauge-color, #22c55e) calc(var(--gauge-pct, 0) * 1%),
    rgba(255, 255, 255, 0.06) calc(var(--gauge-pct, 0) * 1%)
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 96px; height: 96px;
    border-radius: 50%;
    background: rgba(10, 14, 22, 0.95);
  }
  .gauge-val {
    position: relative; z-index: 1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px; font-weight: 700;
    color: var(--gauge-color, #22c55e);
  }
  .gauge-unit {
    position: relative; z-index: 1;
    font-size: 10px; color: #64748b;
    margin-top: -2px;
  }
}
.gauge-labels {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gl-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
}
.gl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* 漏斗图 */
.funnel-chart {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}
.funnel-step {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--f-color, #60a5fa) 15%, transparent);
  border-left: 3px solid var(--f-color, #60a5fa);
  width: var(--f-width, 100%);
  min-width: 50%;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.funnel-label { font-size: 12px; color: #94a3b8; }
.funnel-val { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: #e2e8f0; }

/* 预测表 */
.forecast-chart {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.fc-row {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 1fr;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255,255,255,0.02);
  &.fc-header { font-size: 10px; color: #64748b; font-weight: 600; letter-spacing: 1px; }
}
.fc-label { font-size: 12px; color: #94a3b8; }
.fc-cell {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #cbd5e1;
  text-align: center;
  &.highlight { color: #a78bfa; font-weight: 700; }
}
.fc-note {
  font-size: 9px;
  color: #475569;
  text-align: center;
  margin-top: 8px;
  font-family: 'JetBrains Mono', monospace;
}

/* 客户画像 */
.persona-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.persona-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pb-label { font-size: 11px; color: #94a3b8; width: 72px; text-align: right; flex-shrink: 0; }
.pb-track { flex: 1; height: 18px; background: rgba(255,255,255,0.04); border-radius: 4px; overflow: hidden; }
.pb-fill { height: 100%; border-radius: 4px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
.pb-val { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #e2e8f0; font-weight: 600; width: 36px; }

/* 渠道ROI */
.roi-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.roi-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  transition: all 0.3s;
  &.best { background: rgba(34, 197, 94, 0.04); border-color: rgba(34, 197, 94, 0.12); }
}
.roi-name { font-size: 12px; color: #94a3b8; width: 60px; flex-shrink: 0; }
.roi-bar-wrap { flex: 1; height: 16px; background: rgba(255,255,255,0.04); border-radius: 4px; overflow: hidden; }
.roi-bar { height: 100%; border-radius: 4px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
.roi-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #e2e8f0; font-weight: 600; width: 36px; text-align: right; }

/* 底部能力环 */
.visual-footer {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid rgba(96, 165, 250, 0.06);
  justify-content: center;
  flex-wrap: wrap;
}
.cap-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.cap-ring-sm {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: conic-gradient(
    var(--ring-color, #60a5fa) calc(var(--ring-pct, 0) * 1%),
    rgba(255, 255, 255, 0.06) calc(var(--ring-pct, 0) * 1%)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: rgba(10, 14, 22, 0.95);
  }
  .cap-v {
    position: relative; z-index: 1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px; font-weight: 700;
    color: var(--ring-color, #60a5fa);
  }
}
.cap-l {
  font-size: 8px;
  color: #475569;
  white-space: nowrap;
}

/* ===== HUD 底部 ===== */
.cinema-hud-bottom {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 24px 10px;
  background: rgba(6, 10, 16, 0.8);
  border-top: 1px solid rgba(96, 165, 250, 0.06);
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}
.progress-track {
  flex: 1;
  height: 3px;
  background: rgba(96, 165, 250, 0.08);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #a78bfa, #22c55e);
  border-radius: 2px;
  transition: width 0.8s ease;
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.4);
}
.phase-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  color: rgba(96, 165, 250, 0.5);
  white-space: nowrap;
}

/* ===== 扫描线 ===== */
.scanline {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    top: -100%;
    left: 0; right: 0;
    height: 50px;
    background: linear-gradient(to bottom, transparent, rgba(96, 165, 250, 0.025), transparent);
    animation: scanline-sweep 5s linear infinite;
  }
}
@keyframes scanline-sweep {
  0% { top: -100%; }
  100% { top: 200%; }
}

/* ===== 四角HUD ===== */
.corner-hud {
  position: absolute;
  width: 24px; height: 24px;
  pointer-events: none;
  z-index: 20;
  &::before, &::after {
    content: '';
    position: absolute;
    background: rgba(96, 165, 250, 0.25);
  }
}
.ch-tl { top: 8px; left: 8px;
  &::before { top: 0; left: 0; width: 24px; height: 1px; }
  &::after { top: 0; left: 0; width: 1px; height: 24px; }
}
.ch-tr { top: 8px; right: 8px;
  &::before { top: 0; right: 0; width: 24px; height: 1px; }
  &::after { top: 0; right: 0; width: 1px; height: 24px; }
}
.ch-bl { bottom: 8px; left: 8px;
  &::before { bottom: 0; left: 0; width: 24px; height: 1px; }
  &::after { bottom: 0; left: 0; width: 1px; height: 24px; }
}
.ch-br { bottom: 8px; right: 8px;
  &::before { bottom: 0; right: 0; width: 24px; height: 1px; }
  &::after { bottom: 0; right: 0; width: 1px; height: 24px; }
}

/* ===== 暂停状态 ===== */
.is-paused .scanline::after { animation-play-state: paused; }
.is-paused .grid-overlay { animation-play-state: paused; }
</style>

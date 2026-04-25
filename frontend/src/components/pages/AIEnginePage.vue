<template>
  <div class="page ai-page">
    <!-- 页面标题区 -->
    <div class="hero-header">
      <div class="hero-badge">AI-POWERED INTELLIGENCE ENGINE</div>
      <h2 class="hero-title">AI 智能引擎架构</h2>
      <p class="hero-sub">大模型驱动的自然语言交互、智能决策与预测分析，让数据自己说话</p>
    </div>

    <!-- ===== 实时交互演示终端 ===== -->
    <div class="live-demo-section">
      <div class="live-terminal">
        <!-- 终端顶部栏 -->
        <div class="terminal-bar">
          <div class="terminal-dots">
            <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
          </div>
          <div class="terminal-title">
            <span class="live-indicator"></span>
            SMART ESTATE AI — 实时交互演示
          </div>
          <div class="terminal-controls">
            <button class="ctrl-btn voice-btn" :class="{ active: voiceEnabled }" @click="toggleVoice" :title="voiceEnabled ? '关闭语音播报' : '开启语音播报'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="voiceEnabled" d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path v-else d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/>
              </svg>
            </button>
            <button class="ctrl-btn pause-btn" :class="{ active: isPaused }" @click="togglePause" :title="isPaused ? '继续播放' : '暂停播放'">
              <svg v-if="isPaused" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 3l14 9-14 9V3z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 场景标签 -->
        <div class="scenario-tabs">
          <div class="scenario-tab"
            v-for="(s, i) in liveScenarios" :key="i"
            :class="{ active: currentScenarioIndex === i, visited: visitedScenarios.has(i) }"
            @click="jumpToScenario(i)"
          >
            <span class="tab-dot" :style="{ background: s.color }"></span>
            <span class="tab-label">{{ s.title }}</span>
          </div>
        </div>

        <!-- 对话区域 -->
        <div class="terminal-body" ref="terminalBody">
          <!-- 用户输入 -->
          <div class="chat-row user-row" :class="{ 'row-enter': showUserRow }">
            <div class="chat-avatar user-av">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93V12h3.75a2.5 2.5 0 0 1 2.5 2.5v1.75c1.85.35 3.25 1.98 3.25 3.93a4 4 0 1 1-6.5-3.12V14.5a.5.5 0 0 0-.5-.5h-8.5a.5.5 0 0 0-.5.5v2.56A4 4 0 1 1 2 20.18c0-1.95 1.4-3.58 3.25-3.93V14.5A2.5 2.5 0 0 1 7.75 12h3.5V9.93A4.002 4.002 0 0 1 12 2z"/></svg>
            </div>
            <div class="thinking-dots">
              <span class="dot-anim"></span><span class="dot-anim"></span><span class="dot-anim"></span>
            </div>
          </div>

          <!-- AI回复 -->
          <div class="chat-row ai-row" :class="{ 'row-enter': showAiRow }" v-if="phase === 'typing-response' || phase === 'paused'">
            <div class="chat-avatar ai-av">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93V12h3.75a2.5 2.5 0 0 1 2.5 2.5v1.75c1.85.35 3.25 1.98 3.25 3.93a4 4 0 1 1-6.5-3.12V14.5a.5.5 0 0 0-.5-.5h-8.5a.5.5 0 0 0-.5.5v2.56A4 4 0 1 1 2 20.18c0-1.95 1.4-3.58 3.25-3.93V14.5A2.5 2.5 0 0 1 7.75 12h3.5V9.93A4.002 4.002 0 0 1 12 2z"/></svg>
            </div>
            <div class="chat-bubble ai-bubble">
              <span class="bubble-label ai-label">AI 智能分析</span>
              <div class="bubble-text">
                <span class="typed-text">{{ typedResponse }}</span>
                <span class="cursor-blink" v-if="phase === 'typing-response'">|</span>
              </div>
              <!-- 技术标签 -->
              <div class="response-techs" v-if="phase === 'paused' || phase === 'typing-response'">
                <span class="r-tech" v-for="t in currentScenarioData?.techs" :key="t">{{ t }}</span>
              </div>
            </div>
          </div>

          <!-- 进度指示 -->
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: scenarioProgress + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- 扫描线效果 -->
      <div class="scanline"></div>
      <!-- 四角装饰 -->
      <div class="corner-deco top-left"></div>
      <div class="corner-deco top-right"></div>
      <div class="corner-deco bottom-left"></div>
      <div class="corner-deco bottom-right"></div>
    </div>

    <!-- 流程图区域 -->
    <div class="flow-section">
      <div class="flow-pipeline">
        <!-- 交互层 -->
        <div class="flow-layer" :class="{ 'layer-highlight': currentScenarioIndex === 0 }">
          <div class="flow-layer-label">
            <span class="layer-icon">💬</span>
            <span>智能交互层</span>
          </div>
          <div class="flow-nodes">
            <div class="flow-node interact-node" v-for="n in interactNodes" :key="n.name" :style="{ '--node-color': n.color }">
              <div class="node-pulse"></div>
              <div class="node-icon">{{ n.icon }}</div>
              <div class="node-name">{{ n.name }}</div>
              <div class="node-tag">{{ n.tag }}</div>
            </div>
          </div>
        </div>

        <div class="flow-connector">
          <div class="connector-line"><div class="connector-flow"></div></div>
          <div class="connector-label">意图识别 / 语义解析</div>
        </div>

        <!-- 认知层 -->
        <div class="flow-layer" :class="{ 'layer-highlight': currentScenarioIndex === 1 }">
          <div class="flow-layer-label">
            <span class="layer-icon">🧠</span>
            <span>认知理解层</span>
          </div>
          <div class="flow-nodes center-nodes">
            <div class="flow-node cognitive-node" v-for="c in cognitiveNodes" :key="c.name" :style="{ '--node-color': c.color }">
              <div class="node-pulse"></div>
              <div class="node-icon">{{ c.icon }}</div>
              <div class="node-name">{{ c.name }}</div>
              <div class="node-desc">{{ c.desc }}</div>
            </div>
          </div>
        </div>

        <div class="flow-connector">
          <div class="connector-line"><div class="connector-flow"></div></div>
          <div class="connector-label">推理链 / Prompt Chain</div>
        </div>

        <!-- 推理层 -->
        <div class="flow-layer" :class="{ 'layer-highlight': currentScenarioIndex === 2 }">
          <div class="flow-layer-label">
            <span class="layer-icon">⚡</span>
            <span>推理决策层</span>
          </div>
          <div class="flow-nodes">
            <div class="flow-node reason-node" v-for="r in reasonNodes" :key="r.name" :style="{ '--node-color': r.color }">
              <div class="node-pulse"></div>
              <div class="node-icon">{{ r.icon }}</div>
              <div class="node-name">{{ r.name }}</div>
              <div class="node-tag">{{ r.tag }}</div>
            </div>
          </div>
        </div>

        <div class="flow-connector">
          <div class="connector-line"><div class="connector-flow"></div></div>
          <div class="connector-label">结构化输出 / Action执行</div>
        </div>

        <!-- 输出层 -->
        <div class="flow-layer" :class="{ 'layer-highlight': currentScenarioIndex === 3 }">
          <div class="flow-layer-label">
            <span class="layer-icon">🎯</span>
            <span>智能输出层</span>
          </div>
          <div class="flow-nodes">
            <div class="flow-node output-node" v-for="o in outputNodes" :key="o.name" :style="{ '--node-color': o.color }">
              <div class="node-pulse"></div>
              <div class="node-icon">{{ o.icon }}</div>
              <div class="node-name">{{ o.name }}</div>
              <div class="node-tag">{{ o.tag }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术名词区 -->
    <div class="tech-section">
      <div class="section-header">
        <div class="section-line"></div>
        <span class="section-title">AI 核心技术栈</span>
        <div class="section-line"></div>
      </div>
      <div class="tech-grid">
        <div class="tech-card" v-for="t in techTerms" :key="t.name" :style="{ '--card-accent': t.color }">
          <div class="tech-name">{{ t.name }}</div>
          <div class="tech-full">{{ t.fullName }}</div>
          <div class="tech-desc">{{ t.desc }}</div>
          <div class="tech-scene">应用场景：{{ t.scene }}</div>
        </div>
      </div>
    </div>

    <!-- AI能力指标 -->
    <div class="capacity-section">
      <div class="section-header">
        <div class="section-line"></div>
        <span class="section-title">智能引擎能力指标</span>
        <div class="section-line"></div>
      </div>
      <div class="capacity-grid">
        <div class="capacity-item" v-for="c in capacityItems" :key="c.label">
          <div class="cap-ring" :style="{ '--ring-percent': c.percent, '--ring-color': c.color }">
            <span class="cap-val">{{ c.value }}</span>
          </div>
          <div class="cap-label">{{ c.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

// ====== 基础数据 ======
const interactNodes = [
  { name: '自然语言查询', icon: '🗣️', tag: 'Text/Voice Input', color: '#60a5fa' },
  { name: '智能问答', icon: '💬', tag: 'Multi-turn Dialog', color: '#22c55e' },
  { name: '报表指令', icon: '📝', tag: 'NL2SQL', color: '#f59e0b' },
  { name: '移动端语音', icon: '📱', tag: 'ASR + TTS', color: '#a78bfa' },
]

const cognitiveNodes = [
  { name: '大语言模型', icon: '🤖', desc: 'DeepSeek / GPT-4o / Claude\n企业私有化部署', color: '#60a5fa' },
  { name: '知识图谱', icon: '🕸️', desc: '地产领域本体 + 实体关系\nNeo4j / NebulaGraph', color: '#22c55e' },
  { name: 'RAG检索增强', icon: '📚', desc: '向量数据库 + 语义检索\nMilvus / Pinecone', color: '#f59e0b' },
]

const reasonNodes = [
  { name: 'Agent编排', icon: '🔗', tag: 'LangChain / CrewAI', color: '#00e5ff' },
  { name: '预测模型', icon: '📈', tag: 'Prophet / XGBoost', color: '#a78bfa' },
  { name: '优化求解', icon: '⚙️', tag: 'OR-Tools / PuLP', color: '#22c55e' },
  { name: '因果推断', icon: '🔬', tag: 'DoWhy / CausalML', color: '#f472b6' },
  { name: '异常检测', icon: '🔍', tag: 'Isolation Forest', color: '#ef4444' },
]

const outputNodes = [
  { name: '智能报告', icon: '📊', tag: 'NLG自动生成', color: '#60a5fa' },
  { name: '决策建议', icon: '💡', tag: '可解释AI', color: '#22c55e' },
  { name: '自动工单', icon: '📋', tag: 'RPA执行', color: '#f59e0b' },
  { name: '预警推送', icon: '🔔', tag: '多端触达', color: '#ef4444' },
  { name: '趋势预测', icon: '🔮', tag: '时序推理', color: '#a78bfa' },
]

// ====== 实时演示场景数据 ======
interface LiveScenario {
  title: string
  color: string
  userQuery: string
  sqlPreview: string
  aiResponse: string
  techs: string[]
}

const liveScenarios: LiveScenario[] = [
  {
    title: '自然语言查询',
    color: '#60a5fa',
    userQuery: '裕华区这个月卖了多少套？跟长安区比怎么样？',
    sqlPreview: "SELECT r.name, COUNT(*) AS deals, AVG(u.price) AS avg_price FROM deals d JOIN units u ON d.unit_id=u.id JOIN projects p ON u.project_id=p.id JOIN regions r ON p.region_id=r.id WHERE d.deal_date >= '2025-04-01' AND r.name IN ('裕华区','长安区') GROUP BY r.name ORDER BY deals DESC;",
    aiResponse: '裕华区本月成交180套，环比+12%，均价17500元/㎡；长安区成交210套但环比-3%。裕华区虽然量少但增速更快，建议加推热门户型。',
    techs: ['NL2SQL', 'RAG', 'LLM Reasoning'],
  },
  {
    title: '智能定价决策',
    color: '#22c55e',
    userQuery: '龙泉湖项目要不要降价？降多少合适？',
    sqlPreview: "SELECT p.name, p.avg_price, p.sales_cycle, c.competitor_avg FROM projects p LEFT JOIN competitor_analysis c ON p.region_id=c.region_id WHERE p.name = '龙泉湖';",
    aiResponse: '龙泉湖项目去化周期22个月(红灯)，周边竞品均价12800。建议下调至13200元/㎡(降6%)，预计去化周期缩短至14个月，利润率从8%降至5.2%但总利润增加1200万。',
    techs: ['XGBoost', '因果推断', '优化求解'],
  },
  {
    title: '预警根因分析',
    color: '#ef4444',
    userQuery: '为什么这个月回款率突然降了？',
    sqlPreview: "SELECT region, SUM(amount) AS total, SUM(CASE WHEN status='overdue' THEN amount ELSE 0 END)/SUM(amount) AS overdue_rate FROM payment_records WHERE month = CURRENT_MONTH GROUP BY region ORDER BY overdue_rate DESC;",
    aiResponse: '回款率从78%降至65%，根因分析：①桥西区3个项目按揭放款延迟(占58%)；②高新区首付逾期率升至22%(占30%)；③季节因素(占12%)。建议：对接公积金中心加速审批+逾期专项催收。',
    techs: ['异常检测', '因果推断', 'DoWhy'],
  },
  {
    title: '趋势预测研判',
    color: '#a78bfa',
    userQuery: '下半年市场会怎么样？我们能不能完成目标？',
    sqlPreview: "WITH forecast AS (SELECT prophet_predict(sales_amount, '2025-Q3', '2025-Q4', confidence=>0.95) AS pred FROM monthly_sales) SELECT pred.q3_estimate, pred.q4_estimate, pred.annual_completion FROM forecast;",
    aiResponse: '基于Prophet+政策变量预测：Q3销售额预计38亿(置信区间34-42亿)，Q4预计45亿(受政策利好)。全年完成率预计92%，缺口9.6亿。建议Q3加大渠道投放+Q4推出2个新盘补缺口。',
    techs: ['Prophet', '蒙特卡洛模拟', 'LLM合成'],
  },
  {
    title: '客户画像洞察',
    color: '#06b6d4',
    userQuery: '我们高端项目的客户都有什么特征？哪里还能找到类似客户？',
    sqlPreview: "SELECT c.age_group, c.income_level, c.occupation, COUNT(*) AS cnt, shap_explain(c.*) AS top_features FROM customers c JOIN deals d ON c.id=d.customer_id JOIN projects p ON d.project_id=p.id WHERE p.tier='luxury' GROUP BY c.age_group, c.income_level, c.occupation ORDER BY cnt DESC LIMIT 10;",
    aiResponse: '高端客户核心画像：35-50岁(72%)、企业主/高管(65%)、家庭年收入80万+(58%)。关键决策因子：学区(32%)、圈层社交(25%)、投资回报(22%)。建议重点拓展金融街CBD和高新区产业园客户。',
    techs: ['SHAP', '聚类分析', '知识图谱'],
  },
  {
    title: '渠道效果归因',
    color: '#f59e0b',
    userQuery: '各渠道的投入产出比怎么样？哪些渠道值得加大投放？',
    sqlPreview: "SELECT ch.name, ch.cost, COUNT(d.id) AS deals, SUM(d.amount)/ch.cost AS roi, causal_effect(ch.cost, d.amount) AS true_effect FROM channels ch LEFT JOIN deals d ON ch.id=d.channel_id GROUP BY ch.name ORDER BY roi DESC;",
    aiResponse: '渠道ROI排名：①自然来访 1:18 ②老带新 1:15 ③贝壳 1:8 ④抖音 1:5 ⑤户外广告 1:2。因果推断显示贝壳真实贡献被高估20%(混淆变量：项目地段)，抖音被低估35%(长尾效应)。建议削减户外预算50%→转投抖音信息流。',
    techs: ['因果推断', 'CausalML', 'SHAP'],
  },
]

// ====== 打字动画状态机 ======
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

let typeTimer: ReturnType<typeof setTimeout> | null = null
let scenarioTimer: ReturnType<typeof setTimeout> | null = null
let thinkTimer: ReturnType<typeof setTimeout> | null = null

const currentScenarioData = computed(() => liveScenarios[currentScenarioIndex.value])

const scenarioProgress = computed(() => {
  const total = liveScenarios.length
  if (phase.value === 'idle') return ((currentScenarioIndex.value) / total) * 100
  return ((currentScenarioIndex.value + 1) / total) * 100
})

// ====== 语音合成 ======
function speak(text: string, rate = 1.1) {
  if (!voiceEnabled.value || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = rate
  utterance.pitch = 1.0
  // 尝试选择中文语音
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
  // 标点和中文稍慢，英文和数字稍快
  const delay = /[，。！？、；：""''】]/.test(char) ? 80 : /[，；]/.test(char) ? 60 : 35
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

// ====== 场景播放控制 ======
function startScenario(index: number) {
  currentScenarioIndex.value = index
  visitedScenarios.value.add(index)
  typedQuery.value = ''
  typedResponse.value = ''
  showUserRow.value = false
  showAiRow.value = false
  phase.value = 'idle'

  // 稍延迟开始，让UI先渲染
  setTimeout(() => {
    if (isPaused.value) return
    showUserRow.value = true
    phase.value = 'typing-query'
    scrollToBottom()

    const scenario = liveScenarios[index]
    typeString('query', scenario.userQuery, 0, () => {
      phase.value = 'thinking'
      scrollToBottom()

      // 语音播报用户查询
      speak(scenario.userQuery)

      // 思考1.5秒后开始回复
      thinkTimer = setTimeout(() => {
        if (isPaused.value) return
        phase.value = 'typing-response'
        showAiRow.value = true
        scrollToBottom()

        // 停止用户查询语音，播报AI回复
        stopSpeech()
        typeString('response', scenario.aiResponse, 0, () => {
          phase.value = 'paused'
          // 语音播报AI回复
          speak(scenario.aiResponse, 1.2)
          scrollToBottom()

          // 暂停4秒后切换下一个场景
          scenarioTimer = setTimeout(() => {
            const nextIdx = (currentScenarioIndex.value + 1) % liveScenarios.length
            startScenario(nextIdx)
          }, 4000)
        })
      }, 1500)
    })
  }, 600)
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
    // 重新开始当前场景
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
  typeTimer = null
  scenarioTimer = null
  thinkTimer = null
}

// 监听打字时自动滚动
watch([typedQuery, typedResponse], () => {
  scrollToBottom()
})

onMounted(() => {
  // 预加载语音
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices()
  }
  startScenario(0)
})

onUnmounted(() => {
  clearAllTimers()
  stopSpeech()
})

// ====== 技术术语和能力指标数据 ======
const techTerms = [
  { name: 'LLM', fullName: 'Large Language Model 大语言模型', desc: '千亿参数级语言模型，支持自然语言理解、推理与生成，私有化部署保障数据安全', color: '#60a5fa', scene: '自然语言查询转SQL、智能报告生成、对话式数据分析' },
  { name: 'RAG', fullName: 'Retrieval-Augmented Generation 检索增强生成', desc: '结合向量检索与LLM生成，让AI回答基于企业真实数据而非编造', color: '#22c55e', scene: '基于历史报告和行业数据的智能问答，杜绝"AI幻觉"' },
  { name: 'NL2SQL', fullName: 'Natural Language to SQL 自然语言转查询', desc: '将老板的口语化提问自动转化为精确的SQL查询语句', color: '#f59e0b', scene: '"裕华区去化率多少"→ 自动生成多表关联SQL → 秒级返回' },
  { name: 'Agent', fullName: 'AI Agent 智能体编排', desc: '多步骤自主决策与工具调用的AI代理，支持ReAct推理循环', color: '#00e5ff', scene: '自动执行：查数据→分析原因→生成建议→推送工单' },
  { name: 'Knowledge Graph', fullName: 'Knowledge Graph 领域知识图谱', desc: '地产领域实体关系网络，连接项目/区域/客户/政策/竞品多维知识', color: '#a78bfa', scene: '"裕华区"→自动关联项目/学校/地铁/竞品/客户画像' },
  { name: 'Prophet', fullName: 'Meta Prophet 时序预测框架', desc: 'Facebook开源时间序列预测，自动识别趋势/季节/节假日效应', color: '#f472b6', scene: '销售额/去化率/回款率月度预测，含置信区间' },
  { name: 'XGBoost', fullName: 'eXtreme Gradient Boosting 极端梯度提升', desc: '工业级集成学习框架，高精度+可解释，特征重要性排序', color: '#ef4444', scene: '客户购买意向预测、定价弹性模型、流失预警' },
  { name: 'Causal Inference', fullName: '因果推断 (DoWhy/CausalML)', desc: '超越相关性分析，识别因果关系的统计框架，避免伪相关误导决策', color: '#34d399', scene: '降价是否真的促进成交？渠道佣金调整的真实效果？' },
  { name: 'SHAP', fullName: 'SHapley Additive exPlanations 可解释AI', desc: '博弈论驱动的模型解释框架，量化每个特征对预测结果的贡献', color: '#fb923c', scene: '告诉老板"这个客户为什么不买"——因为首付压力占40%，竞品分流占35%' },
  { name: 'Milvus', fullName: 'Milvus 分布式向量数据库', desc: '亿级向量毫秒检索，支持ANN近似最近邻搜索', color: '#06b6d4', scene: '报告/合同/政策的语义搜索，相似楼盘/客户匹配' },
  { name: 'RLHF', fullName: 'Reinforcement Learning from Human Feedback 人类反馈强化学习', desc: '基于专家反馈微调AI行为，使推荐结果符合地产经营逻辑', color: '#8b5cf6', scene: '让AI学会"先保现金流再追利润"等经营优先级' },
  { name: 'Digital Twin', fullName: 'Digital Twin 数字孪生', desc: '构建项目/区域的虚拟镜像，支持沙盘推演与What-If模拟', color: '#e879f9', scene: '模拟"如果降价5%，去化率提升多少？利润影响几何？"' },
]

const capacityItems = [
  { label: '查询准确率', value: '96%', percent: 96, color: '#60a5fa' },
  { label: '预测精度', value: '89%', percent: 89, color: '#22c55e' },
  { label: '响应时延', value: '<1s', percent: 95, color: '#f59e0b' },
  { label: '决策覆盖率', value: '85%', percent: 85, color: '#a78bfa' },
  { label: '幻觉率', value: '<3%', percent: 97, color: '#ef4444' },
  { label: '可解释性', value: '92%', percent: 92, color: '#00e5ff' },
]
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg, #0F1217);
  color: var(--text-body, #cbd5e1);
}

/* ===== Hero Header ===== */
.hero-header {
  text-align: center;
  padding: 20px 0 8px;
}
.hero-badge {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--primary, #60a5fa);
  background: rgba(96, 165, 250, 0.08);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 20px;
  padding: 4px 16px;
  margin-bottom: 10px;
  animation: badge-glow 3s ease-in-out infinite;
}
@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(96, 165, 250, 0.1); }
  50% { box-shadow: 0 0 20px rgba(96, 165, 250, 0.25); }
}
.hero-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-title, #e2e8f0);
  margin: 0 0 6px;
  background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 40%, #00e5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  font-size: 12px;
  color: var(--text-caption, #64748b);
  margin: 0;
}

/* ===== Live Demo Terminal ===== */
.live-demo-section {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.15);
  background: linear-gradient(145deg, rgba(15, 20, 30, 0.95), rgba(10, 14, 22, 0.98));
  box-shadow: 0 0 30px rgba(96, 165, 250, 0.06), inset 0 1px 0 rgba(96, 165, 250, 0.1);
}

.live-terminal {
  display: flex;
  flex-direction: column;
}

.terminal-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: rgba(20, 25, 35, 0.9);
  border-bottom: 1px solid rgba(96, 165, 250, 0.1);
}

.terminal-dots {
  display: flex;
  gap: 6px;
  .dot {
    width: 10px; height: 10px; border-radius: 50%;
    &.red { background: #ef4444; }
    &.yellow { background: #f59e0b; }
    &.green { background: #22c55e; }
  }
}

.terminal-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(96, 165, 250, 0.7);
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.live-indicator {
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #ef4444;
  animation: live-pulse 1.5s ease-in-out infinite;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.5);
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.terminal-controls {
  display: flex;
  gap: 6px;
}

.ctrl-btn {
  width: 30px; height: 30px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    border-color: rgba(96, 165, 250, 0.3);
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.08);
  }

  &.active {
    border-color: rgba(96, 165, 250, 0.4);
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.12);
  }
}

/* 场景标签 */
.scenario-tabs {
  display: flex;
  gap: 2px;
  padding: 8px 12px;
  background: rgba(15, 18, 25, 0.6);
  border-bottom: 1px solid rgba(96, 165, 250, 0.06);
  overflow-x: auto;

  &::-webkit-scrollbar { height: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(96, 165, 250, 0.2); border-radius: 2px; }
}

.scenario-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  border: 1px solid transparent;

  .tab-dot {
    width: 6px; height: 6px; border-radius: 50%;
    opacity: 0.5;
    transition: all 0.3s;
  }

  &:hover {
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.03);
  }

  &.active {
    color: #e2e8f0;
    background: rgba(96, 165, 250, 0.08);
    border-color: rgba(96, 165, 250, 0.2);

    .tab-dot {
      opacity: 1;
      box-shadow: 0 0 8px currentColor;
    }
  }

  &.visited {
    color: #94a3b8;
  }
}

/* 终端对话区域 */
.terminal-body {
  padding: 16px;
  min-height: 280px;
  max-height: 420px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(96, 165, 250, 0.15); border-radius: 2px; }
}

.chat-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  animation: row-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes row-slide-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-avatar {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-av {
  background: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.ai-av {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.chat-bubble {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  max-width: calc(100% - 42px);
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
  letter-spacing: 1px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;

  &.ai-label {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }
}

.bubble-text {
  font-size: 13px;
  line-height: 1.7;
  color: #e2e8f0;
  font-weight: 500;
}

.typed-text {
  /* 打字文本 */
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
  margin: 4px 0 4px 42px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.04);
  border: 1px solid rgba(245, 158, 11, 0.1);
  animation: sql-fade-in 0.5s ease;
  overflow-x: auto;

  &::-webkit-scrollbar { height: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.2); border-radius: 2px; }
}

@keyframes sql-fade-in {
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 1; transform: translateX(0); }
}

.sql-badge {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 6px;
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.sql-code {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  line-height: 1.6;
  color: #94a3b8;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 思考动画 */
.thinking-dots {
  display: flex;
  gap: 4px;
  padding: 12px 0;
  align-items: center;

  .dot-anim {
    width: 8px; height: 8px;
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
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(34, 197, 94, 0.08);
  flex-wrap: wrap;
}

.r-tech {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(34, 197, 94, 0.08);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.15);
}

/* 进度条 */
.progress-bar {
  height: 2px;
  background: rgba(96, 165, 250, 0.08);
  border-radius: 1px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #a78bfa, #22c55e);
  border-radius: 1px;
  transition: width 0.8s ease;
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.4);
}

/* 扫描线 */
.scanline {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  z-index: 5;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -100%;
    left: 0; right: 0;
    height: 40px;
    background: linear-gradient(to bottom, transparent, rgba(96, 165, 250, 0.03), transparent);
    animation: scanline-sweep 4s linear infinite;
  }
}

@keyframes scanline-sweep {
  0% { top: -100%; }
  100% { top: 200%; }
}

/* 四角装饰 */
.corner-deco {
  position: absolute;
  width: 16px; height: 16px;
  pointer-events: none;
  z-index: 6;

  &::before, &::after {
    content: '';
    position: absolute;
    background: rgba(96, 165, 250, 0.3);
  }

  &.top-left {
    top: 0; left: 0;
    &::before { top: 0; left: 0; width: 16px; height: 1px; }
    &::after { top: 0; left: 0; width: 1px; height: 16px; }
  }
  &.top-right {
    top: 0; right: 0;
    &::before { top: 0; right: 0; width: 16px; height: 1px; }
    &::after { top: 0; right: 0; width: 1px; height: 16px; }
  }
  &.bottom-left {
    bottom: 0; left: 0;
    &::before { bottom: 0; left: 0; width: 16px; height: 1px; }
    &::after { bottom: 0; left: 0; width: 1px; height: 16px; }
  }
  &.bottom-right {
    bottom: 0; right: 0;
    &::before { bottom: 0; right: 0; width: 16px; height: 1px; }
    &::after { bottom: 0; right: 0; width: 1px; height: 16px; }
  }
}

/* ===== Flow Section ===== */
.flow-section { padding: 10px 0; }
.flow-pipeline { display: flex; flex-direction: column; gap: 0; }
.flow-layer {
  display: flex; flex-direction: column; gap: 8px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.5s ease;

  &.layer-highlight {
    background: rgba(96, 165, 250, 0.04);
    border: 1px solid rgba(96, 165, 250, 0.1);
    box-shadow: 0 0 20px rgba(96, 165, 250, 0.05);
  }
}
.flow-layer-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 600; color: var(--text-title, #e2e8f0);
  padding-left: 4px;
  .layer-icon { font-size: 14px; }
}
.flow-nodes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  &.center-nodes { grid-template-columns: repeat(3, 1fr); }
}

.flow-node {
  position: relative;
  display: flex; flex-direction: column; align-items: center;
  padding: 14px 10px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: var(--card-bg, #161B22);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;

  &:hover {
    transform: translateY(-3px) scale(1.03);
    border-color: var(--node-color, rgba(96, 165, 250, 0.3));
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px color-mix(in srgb, var(--node-color, #60a5fa) 20%, transparent);
  }
}
.node-pulse {
  position: absolute; top: 6px; right: 6px;
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--node-color, #60a5fa);
  animation: pulse-ring 2s ease-out infinite;
}
@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--node-color, #60a5fa) 50%, transparent); }
  70% { box-shadow: 0 0 0 8px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
.node-icon { font-size: 20px; margin-bottom: 6px; }
.node-name { font-size: 11px; font-weight: 600; color: var(--text-title, #e2e8f0); margin-bottom: 4px; }
.node-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  color: var(--node-color, #60a5fa);
  background: color-mix(in srgb, var(--node-color, #60a5fa) 10%, transparent);
  padding: 2px 6px; border-radius: 4px;
}
.node-desc {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  color: var(--text-caption, #64748b); line-height: 1.5;
  white-space: pre-line;
}

.interact-node { border-top: 2px solid var(--node-color, #60a5fa); }
.cognitive-node { border-top: 2px solid var(--node-color, #22c55e); }
.reason-node { border-top: 2px solid var(--node-color, #a78bfa); }
.output-node { border-top: 2px solid var(--node-color, #f59e0b); }

.flow-connector { display: flex; flex-direction: column; align-items: center; padding: 6px 0; gap: 4px; }
.connector-line { width: 2px; height: 20px; background: rgba(96, 165, 250, 0.15); position: relative; overflow: hidden; }
.connector-flow {
  position: absolute; top: -100%; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, transparent, var(--primary, #60a5fa), transparent);
  animation: flow-down 1.5s linear infinite;
}
@keyframes flow-down { 0% { top: -100%; } 100% { top: 100%; } }
.connector-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-caption, #64748b); letter-spacing: 0.5px; }

/* ===== Section Header ===== */
.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.section-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(96, 165, 250, 0.2), transparent); }
.section-title { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); white-space: nowrap; letter-spacing: 1px; }

/* ===== Tech Section ===== */
.tech-section { padding: 4px 0; }
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px;
}
.tech-card {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: var(--card-bg, #161B22);
  border-left: 3px solid var(--card-accent, #60a5fa);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border-color: color-mix(in srgb, var(--card-accent, #60a5fa) 30%, rgba(255,255,255,0.06));
  }
}
.tech-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px; font-weight: 700;
  color: var(--card-accent, #60a5fa);
  margin-bottom: 2px;
}
.tech-full { font-size: 10px; color: var(--text-caption, #64748b); margin-bottom: 8px; line-height: 1.4; }
.tech-desc { font-size: 11px; color: var(--text-body, #cbd5e1); line-height: 1.6; margin-bottom: 8px; }
.tech-scene {
  font-size: 10px; color: var(--text-caption, #64748b); line-height: 1.5;
  padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.04);
}

/* ===== Capacity Section ===== */
.capacity-section { padding: 4px 0 20px; }
.capacity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
}
.capacity-item {
  display: flex; flex-direction: column; align-items: center;
  padding: 16px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: var(--card-bg, #161B22);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
}
.cap-ring {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: conic-gradient(
    var(--ring-color, #60a5fa) calc(var(--ring-percent, 0) * 1%),
    rgba(255, 255, 255, 0.06) calc(var(--ring-percent, 0) * 1%)
  );
  display: flex; align-items: center; justify-content: center;
  position: relative;
  margin-bottom: 8px;

  &::after {
    content: '';
    position: absolute;
    width: 42px; height: 42px;
    border-radius: 50%;
    background: var(--card-bg, #161B22);
  }

  .cap-val {
    position: relative; z-index: 1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; font-weight: 700;
    color: var(--ring-color, #60a5fa);
  }
}
.cap-label { font-size: 10px; color: var(--text-caption, #64748b); text-align: center; }

@media (max-width: 768px) {
  .flow-nodes, .flow-nodes.center-nodes { grid-template-columns: repeat(2, 1fr); }
  .tech-grid { grid-template-columns: 1fr; }
  .capacity-grid { grid-template-columns: repeat(3, 1fr); }
  .scenario-tabs { padding: 6px 8px; }
  .terminal-body { min-height: 240px; padding: 12px; }
  .bubble-text { font-size: 12px; }
  .sql-preview { margin-left: 0; }
}
</style>

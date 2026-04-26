<template>
  <div class="ai-cinema" :class="{ 'is-paused': isPaused, 'is-glitching': isGlitching }">
    <!-- Three.js 3D 背景 -->
    <div class="cinema-bg">
      <canvas ref="bgCanvas3D" class="bg-canvas-3d"></canvas>
      <div class="grid-overlay"></div>
      <div class="hex-grid-overlay"></div>
    </div>

    <!-- 场景切换 Glitch 叠加层 -->
    <Transition name="glitch">
      <div v-if="isGlitching" class="glitch-overlay">
        <div class="glitch-slice g1"></div>
        <div class="glitch-slice g2"></div>
        <div class="glitch-slice g3"></div>
        <div class="glitch-noise"></div>
      </div>
    </Transition>

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
      <!-- 全息标题卡 -->
      <Transition name="holo-card">
        <div v-if="showTitleCard" class="title-card" :style="{ '--accent': currentScenarioData?.color }">
          <div class="tc-holo-ring"></div>
          <div class="tc-scanline"></div>
          <div class="tc-number">{{ String(currentScenarioIndex + 1).padStart(2, '0') }}</div>
          <div class="tc-title">{{ currentScenarioData?.title }}</div>
          <div class="tc-bar"></div>
          <div class="tc-subtitle">{{ currentScenarioData?.techs?.join(' · ') }}</div>
          <div class="tc-corner tc-c-tl"></div>
          <div class="tc-corner tc-c-tr"></div>
          <div class="tc-corner tc-c-bl"></div>
          <div class="tc-corner tc-c-br"></div>
        </div>
      </Transition>

      <!-- 终端对话区 (左) -->
      <div class="stage-terminal" :class="{ 'terminal-glow': phase === 'typing-response' }">
        <div class="terminal-header">
          <span class="th-dot" style="background:#ef4444"></span>
          <span class="th-dot" style="background:#f59e0b"></span>
          <span class="th-dot" style="background:#22c55e"></span>
          <span class="th-title">AI QUERY TERMINAL</span>
        </div>
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

      <!-- 3D 数据可视化区 (右) -->
      <div class="stage-visual" :style="{ '--accent': currentScenarioData?.color }">
        <div class="visual-header">
          <span class="vh-badge">3D DATA INSIGHT</span>
          <span class="vh-title">{{ currentScenarioData?.title }}</span>
          <span class="vh-3d-tag">WEBGL</span>
        </div>
        <div class="visual-body">
          <v-chart
            v-if="chartReady"
            :key="'chart-' + currentScenarioIndex"
            :option="currentChartOption"
            autoresize
            class="echart-3d"
          />
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
        <div class="progress-glow"></div>
      </div>
      <div class="phase-label">{{ phaseLabel }}</div>
    </footer>

    <!-- 扫描线 -->
    <div class="scanline"></div>
    <!-- 数据流雨 -->
    <div class="data-rain">
      <span v-for="i in 18" :key="i" class="rain-col" :style="{
        left: (i * 5.5 + Math.random() * 2) + '%',
        animationDuration: (3 + Math.random() * 4) + 's',
        animationDelay: (-Math.random() * 5) + 's',
        '--rain-opacity': 0.04 + Math.random() * 0.06
      }"></span>
    </div>
    <!-- 四角HUD -->
    <div class="corner-hud ch-tl"><span></span><span></span></div>
    <div class="corner-hud ch-tr"><span></span><span></span></div>
    <div class="corner-hud ch-bl"><span></span><span></span></div>
    <div class="corner-hud ch-br"><span></span><span></span></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch, shallowRef } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import 'echarts-gl'
import {
  TitleComponent, TooltipComponent, LegendComponent,
} from 'echarts/components'

use([
  CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent,
])

// ====== 页面可见性控制 ======
const props = withDefaults(defineProps<{
  isActive?: boolean
}>(), {
  isActive: true,
})

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
const capacityItems = [
  { label: '查询准确率', value: '96%', percent: 96, color: '#60a5fa' },
  { label: '预测精度', value: '89%', percent: 89, color: '#22c55e' },
  { label: '响应时延', value: '<1s', percent: 95, color: '#f59e0b' },
  { label: '决策覆盖', value: '85%', percent: 85, color: '#a78bfa' },
  { label: '幻觉率', value: '<3%', percent: 97, color: '#ef4444' },
]

// ====== 3D ECharts Options ======
const chartReady = ref(false)

function makeBar3DOption() {
  const regions = ['裕华区', '长安区', '桥西区', '高新区', '新华区']
  const data: number[][] = []
  for (let i = 0; i < regions.length; i++) {
    const deals = [180, 210, 95, 150, 120][i]
    const avgPrice = [17500, 16800, 14200, 18500, 15800][i]
    data.push([i, 0, deals])
    data.push([i, 1, avgPrice / 1000])
  }
  return {
    tooltip: {},
    visualMap: {
      show: true,
      min: 0,
      max: 210,
      inRange: { color: ['#1a3a5c', '#60a5fa', '#22c55e'] },
      textStyle: { color: '#64748b', fontSize: 9 },
      right: 0,
      top: 10,
      itemHeight: 80,
    },
    xAxis3D: {
      type: 'category',
      data: regions,
      axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      axisTick: { show: false },
    },
    yAxis3D: {
      type: 'category',
      data: ['成交套数', '均价(千/㎡)'],
      axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } },
      axisLabel: { color: '#94a3b8', fontSize: 9 },
      axisTick: { show: false },
    },
    zAxis3D: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(96,165,250,0.15)' } },
      axisLabel: { color: '#64748b', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(96,165,250,0.06)' } },
    },
    grid3D: {
      boxWidth: 120,
      boxHeight: 40,
      boxDepth: 60,
      viewControl: { autoRotate: true, autoRotateSpeed: 6, distance: 200, alpha: 22, beta: 30 },
      light: { main: { intensity: 1.2, shadow: true }, ambient: { intensity: 0.4 } },
      environment: '#060a10',
      axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } },
      axisPointer: { lineStyle: { color: 'rgba(96,165,250,0.3)' } },
    },
    series: [{
      type: 'bar3D',
      data: data.map(d => ({
        value: d,
        itemStyle: d[1] === 0
          ? { color: 'rgba(96,165,250,0.85)', opacity: 0.9 }
          : { color: 'rgba(34,197,94,0.85)', opacity: 0.9 },
      })),
      shading: 'realistic',
      realisticMaterial: { roughness: 0.4, metalness: 0.3 },
      barSize: 12,
      bevelSize: 1.5,
      label: { show: true, distance: 2, formatter: (p: any) => p.value[2], textStyle: { color: '#e2e8f0', fontSize: 9, fontWeight: 600 } },
      itemStyle: { borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
      emphasis: { itemStyle: { color: '#f59e0b' } },
    }],
  }
}

function makeScatter3DOption() {
  // 智能定价：价格-去化-利润 3D散点
  const projects = [
    { name: '龙泉湖', price: 14000, cycle: 22, profit: 8 },
    { name: '翡翠城', price: 18500, cycle: 12, profit: 14 },
    { name: '碧桂苑', price: 12200, cycle: 18, profit: 6 },
    { name: '融创府', price: 22000, cycle: 8, profit: 18 },
    { name: '万科里', price: 16000, cycle: 15, profit: 10 },
    { name: '保利天悦', price: 19500, cycle: 10, profit: 16 },
    { name: '中海锦城', price: 13000, cycle: 20, profit: 5 },
    { name: '绿地新里', price: 15000, cycle: 16, profit: 9 },
  ]
  const data = projects.map(p => ({
    value: [p.price / 1000, p.cycle, p.profit],
    name: p.name,
  }))
  return {
    tooltip: { formatter: (p: any) => `${p.name}<br/>均价: ${p.value[0]}千/㎡<br/>去化周期: ${p.value[1]}月<br/>利润率: ${p.value[2]}%` },
    visualMap: {
      show: true, min: 5, max: 18, dimension: 2,
      inRange: { color: ['#ef4444', '#f59e0b', '#22c55e'] },
      textStyle: { color: '#64748b', fontSize: 9 },
      right: 0, top: 10, itemHeight: 80,
    },
    xAxis3D: { name: '均价(千/㎡)', type: 'value', nameTextStyle: { color: '#64748b', fontSize: 9 }, axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(96,165,250,0.06)' } } },
    yAxis3D: { name: '去化(月)', type: 'value', nameTextStyle: { color: '#64748b', fontSize: 9 }, axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(96,165,250,0.06)' } } },
    zAxis3D: { name: '利润率(%)', type: 'value', nameTextStyle: { color: '#64748b', fontSize: 9 }, axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(96,165,250,0.06)' } } },
    grid3D: {
      boxWidth: 120, boxHeight: 80, boxDepth: 80,
      viewControl: { autoRotate: true, autoRotateSpeed: 4, distance: 220, alpha: 20, beta: 40 },
      light: { main: { intensity: 1.2, shadow: true }, ambient: { intensity: 0.4 } },
      environment: '#060a10',
    },
    series: [{
      type: 'scatter3D',
      data,
      symbolSize: (val: number[]) => Math.max(12, val[2] * 2.5),
      shading: 'realistic',
      realisticMaterial: { roughness: 0.3, metalness: 0.5 },
      label: { show: true, formatter: (p: any) => p.name, distance: 5, textStyle: { color: '#e2e8f0', fontSize: 9, backgroundColor: 'rgba(6,10,16,0.7)', padding: [2, 4], borderRadius: 3 } },
      itemStyle: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
      emphasis: { itemStyle: { borderColor: '#f59e0b', borderWidth: 2 } },
    }],
  }
}

function makeBar3DFunnelOption() {
  // 回款漏斗 - 3D柱状
  const stages = ['签约总额', '首付到位', '按揭放款', '实际回款']
  const amounts = [1280, 960, 680, 830]
  const overdue = [0, 80, 280, 200]
  const data: any[] = []
  for (let i = 0; i < stages.length; i++) {
    data.push({ value: [i, 0, amounts[i]], itemStyle: { color: 'rgba(96,165,250,0.85)' } })
    data.push({ value: [i, 1, overdue[i]], itemStyle: { color: 'rgba(239,68,68,0.85)' } })
  }
  return {
    tooltip: {},
    xAxis3D: { type: 'category', data: stages, axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 10 }, axisTick: { show: false } },
    yAxis3D: { type: 'category', data: ['到位(百万)', '逾期(百万)'], axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 9 }, axisTick: { show: false } },
    zAxis3D: { type: 'value', axisLine: { lineStyle: { color: 'rgba(96,165,250,0.15)' } }, axisLabel: { color: '#64748b', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(96,165,250,0.06)' } } },
    grid3D: {
      boxWidth: 140, boxHeight: 40, boxDepth: 60,
      viewControl: { autoRotate: true, autoRotateSpeed: 5, distance: 200, alpha: 20, beta: 35 },
      light: { main: { intensity: 1.2, shadow: true }, ambient: { intensity: 0.4 } },
      environment: '#060a10',
    },
    series: [{
      type: 'bar3D', data, shading: 'realistic',
      realisticMaterial: { roughness: 0.4, metalness: 0.3 },
      barSize: 16, bevelSize: 2,
      label: { show: true, formatter: (p: any) => p.value[2] + '百万', textStyle: { color: '#e2e8f0', fontSize: 9 } },
      emphasis: { itemStyle: { color: '#f59e0b' } },
    }],
  }
}

function makeLine3DOption() {
  // 趋势预测 - 3D折线
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const actual = [28, 30, 32, 35, 33, 36, null, null, null, null, null, null]
  const forecast = [null, null, null, null, null, 36, 38, 37, 39, 42, 44, 45]
  const lower = [null, null, null, null, null, 36, 34, 33, 35, 38, 40, 41]
  const upper = [null, null, null, null, null, 36, 42, 41, 43, 46, 48, 49]
  const actualData = actual.map((v, i) => v !== null ? [i, 0, v] : null).filter(Boolean) as number[][]
  const forecastData = forecast.map((v, i) => v !== null ? [i, 0, v] : null).filter(Boolean) as number[][]
  const lowerData = lower.map((v, i) => v !== null ? [i, 1, v] : null).filter(Boolean) as number[][]
  const upperData = upper.map((v, i) => v !== null ? [i, 2, v] : null).filter(Boolean) as number[][]
  return {
    tooltip: {},
    legend: { data: ['实际值', '预测值', '下界', '上界'], textStyle: { color: '#94a3b8', fontSize: 9 }, right: 0, top: 0 },
    xAxis3D: { type: 'category', data: months, axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 9, rotate: 30 }, axisTick: { show: false } },
    yAxis3D: { type: 'category', data: ['销售额(亿)', '下界(亿)', '上界(亿)'], axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 9 }, axisTick: { show: false } },
    zAxis3D: { type: 'value', axisLine: { lineStyle: { color: 'rgba(96,165,250,0.15)' } }, axisLabel: { color: '#64748b', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(96,165,250,0.06)' } } },
    grid3D: {
      boxWidth: 180, boxHeight: 30, boxDepth: 80,
      viewControl: { autoRotate: true, autoRotateSpeed: 3, distance: 240, alpha: 18, beta: 25 },
      light: { main: { intensity: 1.2, shadow: true }, ambient: { intensity: 0.4 } },
      environment: '#060a10',
    },
    series: [
      { type: 'line3D', name: '实际值', data: actualData, lineStyle: { color: '#60a5fa', width: 3 }, itemStyle: { color: '#60a5fa' } },
      { type: 'line3D', name: '预测值', data: forecastData, lineStyle: { color: '#a78bfa', width: 3 }, itemStyle: { color: '#a78bfa' } },
      { type: 'line3D', name: '下界', data: lowerData, lineStyle: { color: 'rgba(167,139,250,0.3)', width: 1 }, itemStyle: { color: 'rgba(167,139,250,0.3)' } },
      { type: 'line3D', name: '上界', data: upperData, lineStyle: { color: 'rgba(167,139,250,0.3)', width: 1 }, itemStyle: { color: 'rgba(167,139,250,0.3)' } },
    ],
  }
}

function makeScatter3DClustersOption() {
  // 客户画像 - 3D散点聚类
  const clusters = [
    { label: '学区决策', color: '#22c55e', points: [[35,80,1],[40,90,1],[38,85,1],[42,120,1],[36,75,1],[45,95,1]] },
    { label: '圈层社交', color: '#06b6d4', points: [[50,100,2],[48,110,2],[52,95,2],[55,130,2],[47,88,2],[53,105,2]] },
    { label: '投资回报', color: '#f59e0b', points: [[30,60,3],[28,55,3],[32,70,3],[35,65,3],[27,50,3],[33,72,3]] },
    { label: '改善居住', color: '#a78bfa', points: [[40,70,4],[38,65,4],[43,80,4],[45,75,4],[37,68,4],[42,82,4]] },
  ]
  const series = clusters.map(c => ({
    type: 'scatter3D' as const,
    name: c.label,
    data: c.points.map(p => ({ value: p, itemStyle: { color: c.color, opacity: 0.85 } })),
    symbolSize: 14,
    shading: 'realistic' as const,
    realisticMaterial: { roughness: 0.3, metalness: 0.5 },
    label: { show: false },
    emphasis: { itemStyle: { borderColor: '#fff', borderWidth: 2 } },
  }))
  return {
    tooltip: {},
    legend: { textStyle: { color: '#94a3b8', fontSize: 9 }, right: 0, top: 0 },
    xAxis3D: { name: '年龄', type: 'value', nameTextStyle: { color: '#64748b', fontSize: 9 }, axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(96,165,250,0.06)' } } },
    yAxis3D: { name: '收入(万)', type: 'value', nameTextStyle: { color: '#64748b', fontSize: 9 }, axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(96,165,250,0.06)' } } },
    zAxis3D: { name: '聚类', type: 'category', data: ['学区', '圈层', '投资', '改善'], nameTextStyle: { color: '#64748b', fontSize: 9 }, axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 9 } },
    grid3D: {
      boxWidth: 100, boxHeight: 80, boxDepth: 60,
      viewControl: { autoRotate: true, autoRotateSpeed: 5, distance: 200, alpha: 22, beta: 35 },
      light: { main: { intensity: 1.2, shadow: true }, ambient: { intensity: 0.4 } },
      environment: '#060a10',
    },
    series,
  }
}

function makeBar3DChannelOption() {
  // 渠道ROI - 3D柱状
  const channels = ['自然来访', '老带新', '贝壳', '抖音', '户外广告']
  const cost = [50, 80, 200, 150, 300]
  const revenue = [900, 1200, 1600, 750, 600]
  const data: any[] = []
  for (let i = 0; i < channels.length; i++) {
    data.push({ value: [i, 0, cost[i]], itemStyle: { color: 'rgba(239,68,68,0.8)' } })
    data.push({ value: [i, 1, revenue[i]], itemStyle: { color: i === 0 ? 'rgba(34,197,94,1)' : 'rgba(96,165,250,0.85)' } })
  }
  return {
    tooltip: {},
    xAxis3D: { type: 'category', data: channels, axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 9 }, axisTick: { show: false } },
    yAxis3D: { type: 'category', data: ['投入(万)', '产出(万)'], axisLine: { lineStyle: { color: 'rgba(96,165,250,0.2)' } }, axisLabel: { color: '#94a3b8', fontSize: 9 }, axisTick: { show: false } },
    zAxis3D: { type: 'value', axisLine: { lineStyle: { color: 'rgba(96,165,250,0.15)' } }, axisLabel: { color: '#64748b', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(96,165,250,0.06)' } } },
    grid3D: {
      boxWidth: 140, boxHeight: 40, boxDepth: 60,
      viewControl: { autoRotate: true, autoRotateSpeed: 5, distance: 200, alpha: 20, beta: 30 },
      light: { main: { intensity: 1.2, shadow: true }, ambient: { intensity: 0.4 } },
      environment: '#060a10',
    },
    series: [{
      type: 'bar3D', data, shading: 'realistic',
      realisticMaterial: { roughness: 0.4, metalness: 0.3 },
      barSize: 16, bevelSize: 2,
      label: { show: true, formatter: (p: any) => p.value[2] + '万', textStyle: { color: '#e2e8f0', fontSize: 9 } },
      emphasis: { itemStyle: { color: '#f59e0b' } },
    }],
  }
}

const currentChartOption = shallowRef({})

function updateChart() {
  const opts = [
    makeBar3DOption,
    makeScatter3DOption,
    makeBar3DFunnelOption,
    makeLine3DOption,
    makeScatter3DClustersOption,
    makeBar3DChannelOption,
  ]
  const idx = currentScenarioIndex.value
  if (opts[idx]) {
    currentChartOption.value = opts[idx]()
  }
  chartReady.value = true
}

// ====== 状态机 ======
type Phase = 'idle' | 'typing-query' | 'thinking' | 'typing-response' | 'paused'

const currentScenarioIndex = ref(0)
const phase = ref<Phase>('idle')
const typedQuery = ref('')
const typedResponse = ref('')
const voiceEnabled = ref(true)
const isPaused = ref(false)
const isGlitching = ref(false)
const visitedScenarios = ref<Set<number>>(new Set())
const terminalBody = ref<HTMLElement | null>(null)
const showUserRow = ref(false)
const showAiRow = ref(false)
const showTitleCard = ref(false)
const bgCanvas3D = ref<HTMLCanvasElement | null>(null)

let typeTimer: ReturnType<typeof setTimeout> | null = null
let scenarioTimer: ReturnType<typeof setTimeout> | null = null
let thinkTimer: ReturnType<typeof setTimeout> | null = null
let titleCardTimer: ReturnType<typeof setTimeout> | null = null
let glitchTimer: ReturnType<typeof setTimeout> | null = null

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
const selectedVoice = ref<SpeechSynthesisVoice | null>(null)

function pickBestVoice(): SpeechSynthesisVoice | null {
  if (!window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  const preferred = [
    'Google 普通话', 'Google 國語', 'Microsoft Yaoyao',
    'Microsoft Kangkang', 'Ting-Ting', 'Sin-Ji', 'Meijia', 'Lili',
  ]
  for (const name of preferred) {
    const v = voices.find(v => v.name.includes(name) && v.lang.startsWith('zh'))
    if (v) return v
  }
  const premium = voices.find(v =>
    v.lang.startsWith('zh') && (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('premium') || v.name.toLowerCase().includes('enhanced'))
  )
  if (premium) return premium
  const cloud = voices.find(v =>
    v.lang.startsWith('zh') && (v.name.includes('Google') || v.name.includes('Microsoft'))
  )
  if (cloud) return cloud
  return voices.find(v => v.lang.startsWith('zh')) || null
}

function speak(text: string, rate = 1.0) {
  if (!voiceEnabled.value || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = rate
  utterance.pitch = 1.05
  utterance.volume = 1.0
  if (selectedVoice.value) {
    utterance.voice = selectedVoice.value
  } else {
    const v = pickBestVoice()
    if (v) { selectedVoice.value = v; utterance.voice = v }
  }
  window.speechSynthesis.speak(utterance)
}

function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}

// ====== 打字效果 ======
function typeString(target: 'query' | 'response', text: string, startIndex: number, onDone: () => void) {
  if (isPaused.value) return
  if (startIndex >= text.length) { onDone(); return }
  const char = text[startIndex]
  if (target === 'query') typedQuery.value += char
  else typedResponse.value += char
  const delay = /[，。！？、；：""''】）]/.test(char) ? 120 : 55
  typeTimer = setTimeout(() => typeString(target, text, startIndex + 1, onDone), delay)
}

function scrollToBottom() {
  nextTick(() => {
    if (terminalBody.value) terminalBody.value.scrollTop = terminalBody.value.scrollHeight
  })
}

// ====== Glitch 切换效果 ======
function triggerGlitch(duration: number, callback?: () => void) {
  isGlitching.value = true
  glitchTimer = setTimeout(() => {
    isGlitching.value = false
    callback?.()
  }, duration)
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

  // Glitch 切换 → 显示标题卡 → 开始打字
  triggerGlitch(600, () => {
    showTitleCard.value = true
    speak(liveScenarios[index].voiceIntro, 1.0)

    titleCardTimer = setTimeout(() => {
      showTitleCard.value = false
      if (isPaused.value) return

      // 更新3D图表
      updateChart()

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
            }, 10000)
          })
        }, 2500)
      })
    }, 2800)
  })
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
  if (!voiceEnabled.value) stopSpeech()
}

function clearAllTimers() {
  if (typeTimer) clearTimeout(typeTimer)
  if (scenarioTimer) clearTimeout(scenarioTimer)
  if (thinkTimer) clearTimeout(thinkTimer)
  if (titleCardTimer) clearTimeout(titleCardTimer)
  if (glitchTimer) clearTimeout(glitchTimer)
  typeTimer = null; scenarioTimer = null; thinkTimer = null; titleCardTimer = null; glitchTimer = null
}

// ====== Three.js 3D 背景 ======
let threeRenderer: any = null
let threeScene: any = null
let threeCamera: any = null
let threeAnimId: number | null = null
let threeObjects: any[] = []

async function initThreeBackground() {
  const canvas = bgCanvas3D.value
  if (!canvas) return

  const THREE = await import('three')
  const w = canvas.offsetWidth
  const h = canvas.offsetHeight

  // Renderer
  threeRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  threeRenderer.setSize(w, h)
  threeRenderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  threeRenderer.setClearColor(0x000000, 0)

  // Scene
  threeScene = new THREE.Scene()

  // Camera
  threeCamera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
  threeCamera.position.set(0, 0, 30)

  // 数据节点 - 随机分布在球面上
  const nodeCount = 80
  const nodePositions: InstanceType<typeof THREE.Vector3>[] = []
  const nodeGeom = new THREE.SphereGeometry(0.12, 8, 8)
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.7 })
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.15 })

  for (let i = 0; i < nodeCount; i++) {
    const phi = Math.acos(2 * Math.random() - 1)
    const theta = 2 * Math.PI * Math.random()
    const r = 12 + Math.random() * 4
    const pos = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    )
    nodePositions.push(pos)

    const node = new THREE.Mesh(nodeGeom, nodeMat.clone())
    node.position.copy(pos)
    threeScene.add(node)

    // 光晕
    const glowGeom = new THREE.SphereGeometry(0.35, 8, 8)
    const glow = new THREE.Mesh(glowGeom, glowMat.clone())
    glow.position.copy(pos)
    threeScene.add(glow)

    threeObjects.push(node, glow)
  }

  // 连线
  const lineMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.06 })
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (nodePositions[i].distanceTo(nodePositions[j]) < 8) {
        const geom = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]])
        const line = new THREE.Line(geom, lineMat)
        threeScene.add(line)
        threeObjects.push(line)
      }
    }
  }

  // 中心核心 - 旋转多面体
  const coreGeom = new THREE.IcosahedronGeometry(2.5, 1)
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.15 })
  const core = new THREE.Mesh(coreGeom, coreMat)
  threeScene.add(core)
  threeObjects.push(core)

  // 内核
  const innerGeom = new THREE.IcosahedronGeometry(1.5, 0)
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.1 })
  const inner = new THREE.Mesh(innerGeom, innerMat)
  threeScene.add(inner)
  threeObjects.push(inner)

  // 外环
  const ringGeom = new THREE.TorusGeometry(8, 0.03, 8, 120)
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.08 })
  const ring1 = new THREE.Mesh(ringGeom, ringMat)
  ring1.rotation.x = Math.PI / 2
  threeScene.add(ring1)
  threeObjects.push(ring1)

  const ring2Geom = new THREE.TorusGeometry(10, 0.02, 8, 120)
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.05 })
  const ring2 = new THREE.Mesh(ring2Geom, ring2Mat)
  ring2.rotation.x = Math.PI / 3
  ring2.rotation.y = Math.PI / 4
  threeScene.add(ring2)
  threeObjects.push(ring2)

  // 动画
  const clock = new THREE.Clock()
  function animate() {
    threeAnimId = requestAnimationFrame(animate)
    const t = clock.getElapsedTime()

    // 缓慢旋转整体
    core.rotation.x = t * 0.15
    core.rotation.y = t * 0.2
    inner.rotation.x = -t * 0.1
    inner.rotation.z = t * 0.15

    ring1.rotation.z = t * 0.08
    ring2.rotation.z = -t * 0.06

    // 节点脉冲
    threeObjects.forEach((obj, i) => {
      if (obj.material && obj.material.opacity !== undefined && obj.geometry?.type === 'SphereGeometry') {
        if (obj.geometry.parameters?.radius === 0.12) {
          obj.material.opacity = 0.5 + 0.3 * Math.sin(t * 2 + i * 0.3)
        }
      }
    })

    // 相机微移
    threeCamera.position.x = Math.sin(t * 0.1) * 2
    threeCamera.position.y = Math.cos(t * 0.08) * 1
    threeCamera.lookAt(0, 0, 0)

    threeRenderer.render(threeScene, threeCamera)
  }
  animate()

  // Resize
  const onResize = () => {
    if (!bgCanvas3D.value) return
    const nw = bgCanvas3D.value.offsetWidth
    const nh = bgCanvas3D.value.offsetHeight
    threeCamera.aspect = nw / nh
    threeCamera.updateProjectionMatrix()
    threeRenderer.setSize(nw, nh)
  }
  window.addEventListener('resize', onResize)
}

function disposeThree() {
  if (threeAnimId) cancelAnimationFrame(threeAnimId)
  if (threeRenderer) threeRenderer.dispose()
  threeObjects = []
  threeAnimId = null
}

watch([typedQuery, typedResponse], () => scrollToBottom())

// 页面可见性切换
watch(() => props.isActive, (active) => {
  if (active) {
    if (phase.value === 'paused' || phase.value === 'idle') {
      isPaused.value = false
      startScenario(currentScenarioIndex.value)
    }
  } else {
    clearAllTimers()
    stopSpeech()
    isPaused.value = true
  }
})

onMounted(() => {
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices()
    window.speechSynthesis.onvoiceschanged = () => { selectedVoice.value = pickBestVoice() }
    selectedVoice.value = pickBestVoice()
  }
  initThreeBackground()
  // 独立页面始终自动启动；Dashboard 中由 isActive 控制
  startScenario(0)
})

onUnmounted(() => {
  clearAllTimers()
  stopSpeech()
  disposeThree()
})
</script>

<style scoped lang="scss">
/* ===== 全屏影院布局 ===== */
.ai-cinema {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #040810;
  color: #cbd5e1;
  display: flex;
  flex-direction: column;
  perspective: 1200px;
}

/* ===== Three.js 背景 ===== */
.cinema-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.bg-canvas-3d {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(96, 165, 250, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(96, 165, 250, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: grid-shift 25s linear infinite;
}
.hex-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='rgba(96,165,250,0.015)' stroke-width='0.5'/%3E%3C/svg%3E");
  background-size: 60px 52px;
  animation: grid-shift 40s linear infinite;
}
@keyframes grid-shift {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}

/* ===== Glitch 效果 ===== */
.glitch-overlay {
  position: absolute;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  overflow: hidden;
}
.glitch-slice {
  position: absolute;
  left: 0; right: 0;
  height: 4px;
  background: rgba(96, 165, 250, 0.3);
  mix-blend-mode: screen;
  &.g1 { top: 30%; animation: glitch-slice-1 0.15s infinite steps(2); }
  &.g2 { top: 55%; background: rgba(239, 68, 68, 0.2); animation: glitch-slice-2 0.12s infinite steps(3); }
  &.g3 { top: 75%; background: rgba(34, 197, 94, 0.15); animation: glitch-slice-3 0.1s infinite steps(2); }
}
@keyframes glitch-slice-1 { 0% { transform: translateX(-20%); } 50% { transform: translateX(15%); } 100% { transform: translateX(-5%); } }
@keyframes glitch-slice-2 { 0% { transform: translateX(10%); } 50% { transform: translateX(-18%); } 100% { transform: translateX(8%); } }
@keyframes glitch-slice-3 { 0% { transform: translateX(-8%); } 50% { transform: translateX(12%); } 100% { transform: translateX(-3%); } }
.glitch-noise {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(96, 165, 250, 0.015) 2px,
    rgba(96, 165, 250, 0.015) 4px
  );
  animation: noise-shift 0.08s infinite steps(4);
}
@keyframes noise-shift {
  0% { transform: translateY(0); }
  100% { transform: translateY(-10px); }
}

.glitch-enter-active { animation: glitch-fade-in 0.1s; }
.glitch-leave-active { animation: glitch-fade-out 0.15s; }
@keyframes glitch-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes glitch-fade-out { from { opacity: 1; } to { opacity: 0; } }

/* ===== 数据流雨 ===== */
.data-rain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}
.rain-col {
  position: absolute;
  top: -100%;
  width: 1px;
  height: 200px;
  background: linear-gradient(to bottom, transparent, rgba(96, 165, 250, var(--rain-opacity, 0.05)), transparent);
  animation: rain-fall linear infinite;
}
@keyframes rain-fall {
  0% { top: -200px; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 110%; opacity: 0; }
}

/* ===== HUD 顶部 ===== */
.cinema-hud-top {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;
  background: rgba(4, 8, 16, 0.85);
  border-bottom: 1px solid rgba(96, 165, 250, 0.08);
  backdrop-filter: blur(16px);
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
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6), 0 0 20px rgba(239, 68, 68, 0.2);
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
.hud-divider { color: rgba(96, 165, 250, 0.2); }
.hud-scene-counter {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(96, 165, 250, 0.8);
  font-weight: 700;
}
.hud-center { display: flex; align-items: center; }
.scenario-indicators { display: flex; gap: 8px; }
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
    box-shadow: 0 0 12px color-mix(in srgb, var(--dot-color, #60a5fa) 50%, transparent),
                0 0 24px color-mix(in srgb, var(--dot-color, #60a5fa) 20%, transparent);
    transform: scale(1.3);
  }
}
.hud-right { display: flex; gap: 6px; }
.hud-btn {
  width: 34px; height: 34px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #64748b;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
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
  padding: 14px 24px;
  min-height: 0;
  transform-style: preserve-3d;
}

/* ===== 全息标题卡 ===== */
.title-card {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(4, 8, 16, 0.92);
  backdrop-filter: blur(24px);
  transform: rotateY(0deg);
  transform-style: preserve-3d;
}
.tc-holo-ring {
  position: absolute;
  width: 300px; height: 300px;
  border-radius: 50%;
  border: 1px solid rgba(96, 165, 250, 0.08);
  box-shadow: 0 0 60px rgba(96, 165, 250, 0.05), inset 0 0 40px rgba(96, 165, 250, 0.03);
  animation: holo-rotate 8s linear infinite;
}
@keyframes holo-rotate {
  from { transform: rotateZ(0deg); }
  to { transform: rotateZ(360deg); }
}
.tc-scanline {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent, #60a5fa), transparent);
  box-shadow: 0 0 20px var(--accent, #60a5fa);
  animation: tc-scan 2s ease-in-out infinite;
}
@keyframes tc-scan {
  0% { top: 20%; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { top: 80%; opacity: 0; }
}
.tc-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 72px;
  font-weight: 800;
  color: var(--accent, #60a5fa);
  opacity: 0.12;
  line-height: 1;
  text-shadow: 0 0 40px color-mix(in srgb, var(--accent, #60a5fa) 30%, transparent);
}
.tc-title {
  font-size: 30px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 6px;
  margin-top: 8px;
  text-shadow: 0 0 20px rgba(226, 232, 240, 0.3);
}
.tc-bar {
  width: 80px;
  height: 3px;
  border-radius: 2px;
  background: var(--accent, #60a5fa);
  margin-top: 16px;
  box-shadow: 0 0 24px color-mix(in srgb, var(--accent, #60a5fa) 50%, transparent);
}
.tc-subtitle {
  margin-top: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(96, 165, 250, 0.4);
}
.tc-corner {
  position: absolute;
  width: 40px; height: 40px;
  &::before, &::after {
    content: '';
    position: absolute;
    background: var(--accent, #60a5fa);
    opacity: 0.3;
  }
}
.tc-c-tl { top: 15%; left: 15%; &::before { top: 0; left: 0; width: 40px; height: 1px; } &::after { top: 0; left: 0; width: 1px; height: 40px; } }
.tc-c-tr { top: 15%; right: 15%; &::before { top: 0; right: 0; width: 40px; height: 1px; } &::after { top: 0; right: 0; width: 1px; height: 40px; } }
.tc-c-bl { bottom: 15%; left: 15%; &::before { bottom: 0; left: 0; width: 40px; height: 1px; } &::after { bottom: 0; left: 0; width: 1px; height: 40px; } }
.tc-c-br { bottom: 15%; right: 15%; &::before { bottom: 0; right: 0; width: 40px; height: 1px; } &::after { bottom: 0; right: 0; width: 1px; height: 40px; } }

.holo-card-enter-active { animation: holo-in 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.holo-card-leave-active { animation: holo-out 0.4s cubic-bezier(0.7, 0, 0.84, 0); }
@keyframes holo-in { from { opacity: 0; transform: scale(1.05) rotateY(5deg); } to { opacity: 1; transform: scale(1) rotateY(0deg); } }
@keyframes holo-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }

/* ===== 终端区 ===== */
.stage-terminal {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid rgba(96, 165, 250, 0.1);
  background: rgba(8, 12, 20, 0.9);
  backdrop-filter: blur(16px);
  overflow: hidden;
  transition: box-shadow 0.6s ease;
  &.terminal-glow {
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.08), inset 0 0 20px rgba(34, 197, 94, 0.02);
    border-color: rgba(34, 197, 94, 0.15);
  }
}
.terminal-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-bottom: 1px solid rgba(96, 165, 250, 0.06);
  background: rgba(255, 255, 255, 0.01);
}
.th-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
}
.th-title {
  margin-left: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1.5px;
  color: rgba(96, 165, 250, 0.3);
}
.terminal-inner {
  flex: 1;
  padding: 18px;
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
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.user-av {
  background: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.25);
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.08);
}
.ai-av {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.25);
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.08);
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
  font-size: 9px; letter-spacing: 1px;
  padding: 2px 8px; border-radius: 4px; margin-bottom: 8px;
  background: rgba(245, 158, 11, 0.12); color: #f59e0b;
}
.sql-code {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; line-height: 1.7;
  color: #94a3b8;
  white-space: pre-wrap; word-break: break-all;
}

/* 思考动画 */
.thinking-dots {
  display: flex; gap: 5px; padding: 14px 0;
  .dot-anim {
    width: 10px; height: 10px; border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
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
  display: flex; gap: 6px; margin-top: 12px;
  padding-top: 10px; border-top: 1px solid rgba(34, 197, 94, 0.08);
  flex-wrap: wrap;
}
.r-tech {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; padding: 3px 8px; border-radius: 4px;
  background: rgba(34, 197, 94, 0.08); color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.15);
}

/* ===== 3D 可视化区 ===== */
.stage-visual {
  flex: 0.9;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid rgba(96, 165, 250, 0.1);
  background: rgba(8, 12, 20, 0.9);
  backdrop-filter: blur(16px);
  overflow: hidden;
  box-shadow: 0 0 40px rgba(96, 165, 250, 0.04), inset 0 0 30px rgba(96, 165, 250, 0.01);
}
.visual-header {
  padding: 12px 18px;
  border-bottom: 1px solid rgba(96, 165, 250, 0.06);
  display: flex; align-items: center; gap: 10px;
}
.vh-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px; letter-spacing: 1.5px;
  padding: 2px 8px; border-radius: 4px;
  background: rgba(96, 165, 250, 0.08); color: rgba(96, 165, 250, 0.6);
}
.vh-title { font-size: 13px; font-weight: 600; color: #e2e8f0; }
.vh-3d-tag {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px; letter-spacing: 1px;
  padding: 2px 6px; border-radius: 3px;
  background: rgba(34, 197, 94, 0.1); color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.2);
  animation: tag-pulse 2s ease-in-out infinite;
}
@keyframes tag-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
.visual-body {
  flex: 1;
  min-height: 0;
  padding: 4px;
}
.echart-3d {
  width: 100%;
  height: 100%;
  min-height: 280px;
}

/* 底部能力环 */
.visual-footer {
  display: flex; gap: 12px;
  padding: 10px 16px;
  border-top: 1px solid rgba(96, 165, 250, 0.06);
  justify-content: center; flex-wrap: wrap;
}
.cap-mini {
  display: flex; flex-direction: column;
  align-items: center; gap: 3px;
}
.cap-ring-sm {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: conic-gradient(
    var(--ring-color, #60a5fa) calc(var(--ring-pct, 0) * 1%),
    rgba(255, 255, 255, 0.06) calc(var(--ring-pct, 0) * 1%)
  );
  display: flex; align-items: center; justify-content: center;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: rgba(8, 12, 20, 0.95);
  }
  .cap-v {
    position: relative; z-index: 1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px; font-weight: 700;
    color: var(--ring-color, #60a5fa);
  }
}
.cap-l { font-size: 8px; color: #475569; white-space: nowrap; }

/* ===== HUD 底部 ===== */
.cinema-hud-bottom {
  position: relative; z-index: 10;
  display: flex; align-items: center; gap: 12px;
  padding: 8px 24px 10px;
  background: rgba(4, 8, 16, 0.85);
  border-top: 1px solid rgba(96, 165, 250, 0.06);
  backdrop-filter: blur(16px);
  flex-shrink: 0;
}
.progress-track {
  flex: 1; height: 3px;
  background: rgba(96, 165, 250, 0.08);
  border-radius: 2px; overflow: hidden;
  position: relative;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #a78bfa, #22c55e);
  border-radius: 2px;
  transition: width 0.8s ease;
  position: relative; z-index: 1;
}
.progress-glow {
  position: absolute;
  right: 0; top: -4px; bottom: -4px;
  width: 40px;
  background: radial-gradient(ellipse at right, rgba(96, 165, 250, 0.3), transparent);
  z-index: 2;
}
.phase-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 1px;
  color: rgba(96, 165, 250, 0.5);
  white-space: nowrap;
}

/* ===== 扫描线 ===== */
.scanline {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 20;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    top: -100%; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(to bottom, transparent, rgba(96, 165, 250, 0.02), transparent);
    animation: scanline-sweep 4s linear infinite;
  }
}
@keyframes scanline-sweep {
  0% { top: -100%; }
  100% { top: 200%; }
}

/* ===== 四角HUD ===== */
.corner-hud {
  position: absolute;
  width: 32px; height: 32px;
  pointer-events: none; z-index: 20;
  &::before, &::after {
    content: '';
    position: absolute;
    background: rgba(96, 165, 250, 0.2);
    box-shadow: 0 0 4px rgba(96, 165, 250, 0.1);
  }
}
.ch-tl { top: 6px; left: 6px;
  &::before { top: 0; left: 0; width: 32px; height: 1px; }
  &::after { top: 0; left: 0; width: 1px; height: 32px; }
}
.ch-tr { top: 6px; right: 6px;
  &::before { top: 0; right: 0; width: 32px; height: 1px; }
  &::after { top: 0; right: 0; width: 1px; height: 32px; }
}
.ch-bl { bottom: 6px; left: 6px;
  &::before { bottom: 0; left: 0; width: 32px; height: 1px; }
  &::after { bottom: 0; left: 0; width: 1px; height: 32px; }
}
.ch-br { bottom: 6px; right: 6px;
  &::before { bottom: 0; right: 0; width: 32px; height: 1px; }
  &::after { bottom: 0; right: 0; width: 1px; height: 32px; }
}

/* ===== 暂停状态 ===== */
.is-paused .scanline::after { animation-play-state: paused; }
.is-paused .grid-overlay { animation-play-state: paused; }
.is-paused .hex-grid-overlay { animation-play-state: paused; }

/* ===== Glitching 状态 ===== */
.is-glitching {
  .stage-terminal, .stage-visual {
    animation: content-glitch 0.1s steps(2) infinite;
  }
}
@keyframes content-glitch {
  0% { transform: translateX(0); filter: none; }
  25% { transform: translateX(-2px); filter: hue-rotate(10deg); }
  50% { transform: translateX(2px); filter: hue-rotate(-10deg); }
  75% { transform: translateX(-1px); filter: hue-rotate(5deg); }
  100% { transform: translateX(0); filter: none; }
}
</style>

<template>
  <div class="page ai-page">
    <!-- 页面标题区 -->
    <div class="hero-header">
      <div class="hero-badge">AI-POWERED INTELLIGENCE ENGINE</div>
      <h2 class="hero-title">AI 智能引擎架构</h2>
      <p class="hero-sub">大模型驱动的自然语言交互、智能决策与预测分析，让数据自己说话</p>
    </div>

    <!-- 流程图区域 -->
    <div class="flow-section">
      <div class="flow-pipeline">
        <!-- 交互层 -->
        <div class="flow-layer">
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
        <div class="flow-layer">
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
        <div class="flow-layer">
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
        <div class="flow-layer">
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

    <!-- 核心场景演示区 -->
    <div class="demo-section">
      <div class="section-header">
        <div class="section-line"></div>
        <span class="section-title">核心智能场景</span>
        <div class="section-line"></div>
      </div>
      <div class="demo-grid">
        <div class="demo-card" v-for="d in demoScenarios" :key="d.title" :style="{ '--card-accent': d.color }">
          <div class="demo-header">
            <span class="demo-icon">{{ d.icon }}</span>
            <span class="demo-title">{{ d.title }}</span>
          </div>
          <div class="demo-dialog">
            <div class="dialog-user">
              <span class="dialog-avatar user-avatar">老板</span>
              <span class="dialog-text">{{ d.userQuery }}</span>
            </div>
            <div class="dialog-ai">
              <span class="dialog-avatar ai-avatar">AI</span>
              <span class="dialog-text ai-text">{{ d.aiResponse }}</span>
            </div>
          </div>
          <div class="demo-tech">
            <span class="demo-tech-tag" v-for="t in d.techs" :key="t">{{ t }}</span>
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

const demoScenarios = [
  {
    title: '自然语言查询报表',
    icon: '🗣️',
    color: '#60a5fa',
    userQuery: '"裕华区这个月卖了多少套？跟长安区比怎么样？"',
    aiResponse: '裕华区本月成交180套，环比+12%，均价17500元/㎡；长安区成交210套但环比-3%。裕华区虽然量少但增速更快，建议加推热门户型。',
    techs: ['NL2SQL', 'RAG', 'LLM Reasoning'],
  },
  {
    title: 'AI辅助定价决策',
    icon: '💰',
    color: '#22c55e',
    userQuery: '"龙泉湖项目要不要降价？降多少合适？"',
    aiResponse: '龙泉湖项目去化周期22个月(红灯)，周边竞品均价12800。建议下调至13200元/㎡(降6%)，预计去化周期缩短至14个月，利润率从8%降至5.2%但总利润增加1200万。',
    techs: ['XGBoost', '因果推断', '优化求解'],
  },
  {
    title: '智能预警与根因分析',
    icon: '🚨',
    color: '#ef4444',
    userQuery: '"为什么这个月回款率突然降了？"',
    aiResponse: '回款率从78%降至65%，根因分析：①桥西区3个项目按揭放款延迟(占58%)；②高新区首付逾期率升至22%(占30%)；③季节因素(占12%)。建议：对接公积金中心加速审批+逾期专项催收。',
    techs: ['异常检测', '因果推断', 'DoWhy'],
  },
  {
    title: '预测与趋势研判',
    icon: '🔮',
    color: '#a78bfa',
    userQuery: '"下半年市场会怎么样？我们能不能完成目标？"',
    aiResponse: '基于Prophet+政策变量预测：Q3销售额预计38亿(置信区间34-42亿)，Q4预计45亿(受政策利好)。全年完成率预计92%，缺口9.6亿。建议Q3加大渠道投放+Q4推出2个新盘补缺口。',
    techs: ['Prophet', '蒙特卡洛模拟', 'LLM合成'],
  },
]

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

/* ===== Flow Section ===== */
.flow-section { padding: 10px 0; }
.flow-pipeline { display: flex; flex-direction: column; gap: 0; }
.flow-layer { display: flex; flex-direction: column; gap: 8px; }
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

/* ===== Demo Section ===== */
.demo-section { padding: 4px 0; }
.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.section-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(96, 165, 250, 0.2), transparent); }
.section-title { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); white-space: nowrap; letter-spacing: 1px; }

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}
.demo-card {
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
.demo-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.demo-icon { font-size: 18px; }
.demo-title { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); }
.demo-dialog { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
.dialog-user, .dialog-ai { display: flex; gap: 8px; align-items: flex-start; }
.dialog-avatar {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; flex-shrink: 0;
}
.user-avatar {
  background: rgba(96, 165, 250, 0.12); color: var(--primary, #60a5fa);
}
.ai-avatar {
  background: rgba(34, 197, 94, 0.12); color: var(--success, #22c55e);
}
.dialog-text {
  font-size: 11px; color: var(--text-body, #cbd5e1); line-height: 1.6;
  padding: 8px 10px; border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
}
.ai-text {
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.1);
}
.demo-tech { display: flex; gap: 6px; flex-wrap: wrap; }
.demo-tech-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(96, 165, 250, 0.08);
  color: var(--primary, #60a5fa);
  border: 1px solid rgba(96, 165, 250, 0.15);
}

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
  .demo-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: 1fr; }
  .capacity-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>

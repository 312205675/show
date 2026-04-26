<template>
  <div class="page bigdata-page">
    <!-- 页面标题区 -->
    <div class="hero-header">
      <div class="hero-badge">DATA LAKEHOUSE ARCHITECTURE</div>
      <h2 class="hero-title">大数据智能平台架构</h2>
      <p class="hero-sub">聚合多项目多系统数据源，构建地产经营全域数据湖，驱动精准决策</p>
    </div>

    <!-- 流程图区域 -->
    <div class="flow-section">
      <div class="flow-pipeline">
        <!-- Layer 1: 数据源 -->
        <div class="flow-layer">
          <div class="flow-layer-label">
            <span class="layer-icon">⬡</span>
            <span>数据采集层</span>
          </div>
          <div class="flow-nodes">
            <div class="flow-node source-node zoomable" v-for="s in dataSources" :key="s.name" :style="{ '--node-color': s.color }" @click="openZoom('node', s)">
              <div class="node-pulse"></div>
              <div class="node-icon">{{ s.icon }}</div>
              <div class="node-name">{{ s.name }}</div>
              <div class="node-tag">{{ s.tag }}</div>
            </div>
          </div>
        </div>

        <!-- 箭头连接 -->
        <div class="flow-connector">
          <div class="connector-line">
            <div class="connector-flow"></div>
          </div>
          <div class="connector-label">实时 / 离线双通道采集</div>
        </div>

        <!-- Layer 2: 数据湖 -->
        <div class="flow-layer">
          <div class="flow-layer-label">
            <span class="layer-icon">◈</span>
            <span>数据湖仓层</span>
          </div>
          <div class="flow-nodes center-nodes">
            <div class="flow-node lake-node zoomable" v-for="l in lakeNodes" :key="l.name" :style="{ '--node-color': l.color }" @click="openZoom('node', l)">
              <div class="node-pulse"></div>
              <div class="node-icon">{{ l.icon }}</div>
              <div class="node-name">{{ l.name }}</div>
              <div class="node-desc">{{ l.desc }}</div>
            </div>
          </div>
        </div>

        <!-- 箭头连接 -->
        <div class="flow-connector">
          <div class="connector-line">
            <div class="connector-flow"></div>
          </div>
          <div class="connector-label">ETL / ELT 清洗转换</div>
        </div>

        <!-- Layer 3: 计算分析 -->
        <div class="flow-layer">
          <div class="flow-layer-label">
            <span class="layer-icon">◉</span>
            <span>计算分析层</span>
          </div>
          <div class="flow-nodes">
            <div class="flow-node compute-node zoomable" v-for="c in computeNodes" :key="c.name" :style="{ '--node-color': c.color }" @click="openZoom('node', c)">
              <div class="node-pulse"></div>
              <div class="node-icon">{{ c.icon }}</div>
              <div class="node-name">{{ c.name }}</div>
              <div class="node-tag">{{ c.tag }}</div>
            </div>
          </div>
        </div>

        <!-- 箭头连接 -->
        <div class="flow-connector">
          <div class="connector-line">
            <div class="connector-flow"></div>
          </div>
          <div class="connector-label">API Gateway / 微服务</div>
        </div>

        <!-- Layer 4: 应用层 -->
        <div class="flow-layer">
          <div class="flow-layer-label">
            <span class="layer-icon">◎</span>
            <span>智能应用层</span>
          </div>
          <div class="flow-nodes">
            <div class="flow-node app-node zoomable" v-for="a in appNodes" :key="a.name" :style="{ '--node-color': a.color }" @click="openZoom('node', a)">
              <div class="node-pulse"></div>
              <div class="node-icon">{{ a.icon }}</div>
              <div class="node-name">{{ a.name }}</div>
              <div class="node-tag">{{ a.tag }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术名词区 -->
    <div class="tech-section">
      <div class="section-header">
        <div class="section-line"></div>
        <span class="section-title">核心技术栈</span>
        <div class="section-line"></div>
      </div>
      <div class="tech-grid">
        <div class="tech-card zoomable" v-for="t in techTerms" :key="t.name" :style="{ '--card-accent': t.color }" @click="openZoom('tech', t)">
          <div class="tech-name">{{ t.name }}</div>
          <div class="tech-full">{{ t.fullName }}</div>
          <div class="tech-desc">{{ t.desc }}</div>
          <div class="tech-scene">应用场景：{{ t.scene }}</div>
        </div>
      </div>
    </div>

    <!-- 数据规模指标 -->
    <div class="scale-section">
      <div class="section-header">
        <div class="section-line"></div>
        <span class="section-title">平台数据规模</span>
        <div class="section-line"></div>
      </div>
      <div class="scale-grid">
        <div class="scale-item zoomable" v-for="s in scaleItems" :key="s.label" @click="openZoom('scale', s)">
          <div class="scale-value">{{ s.value }}<small>{{ s.unit }}</small></div>
          <div class="scale-label">{{ s.label }}</div>
          <div class="scale-bar">
            <div class="scale-bar-fill" :style="{ width: s.percent + '%', background: s.color }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 点击放大弹窗 -->
    <Teleport to="body">
      <Transition name="zoom-overlay">
        <div v-if="zoomedItem" class="zoom-overlay" @click.self="closeZoom">
          <div class="zoom-backdrop" @click="closeZoom" />
          <div class="zoom-panel">
            <button class="zoom-close" @click="closeZoom">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <!-- 流程节点放大 -->
            <template v-if="zoomedItem.type === 'node'">
              <div class="zoom-node">
                <div class="zoom-node-icon">{{ zoomedItem.data.icon }}</div>
                <div class="zoom-node-name">{{ zoomedItem.data.name }}</div>
                <div v-if="zoomedItem.data.tag" class="zoom-node-tag" :style="{ color: zoomedItem.data.color, borderColor: zoomedItem.data.color + '33', background: zoomedItem.data.color + '15' }">{{ zoomedItem.data.tag }}</div>
                <div v-if="zoomedItem.data.desc" class="zoom-node-desc">{{ zoomedItem.data.desc }}</div>
                <div v-if="zoomedItem.data.layer" class="zoom-node-layer" :style="{ color: zoomedItem.data.color }">{{ zoomedItem.data.layer }}</div>
                <div v-if="zoomedItem.data.detail" class="zoom-node-detail">{{ zoomedItem.data.detail }}</div>
              </div>
            </template>

            <!-- 技术卡片放大 -->
            <template v-if="zoomedItem.type === 'tech'">
              <div class="zoom-tech" :style="{ borderLeftColor: zoomedItem.data.color }">
                <div class="zoom-tech-name" :style="{ color: zoomedItem.data.color }">{{ zoomedItem.data.name }}</div>
                <div class="zoom-tech-full">{{ zoomedItem.data.fullName }}</div>
                <div class="zoom-tech-desc">{{ zoomedItem.data.desc }}</div>
                <div class="zoom-tech-scene">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  应用场景
                </div>
                <div class="zoom-tech-scene-text">{{ zoomedItem.data.scene }}</div>
              </div>
            </template>

            <!-- 数据规模放大 -->
            <template v-if="zoomedItem.type === 'scale'">
              <div class="zoom-scale">
                <div class="zoom-scale-value" :style="{ color: zoomedItem.data.color }">{{ zoomedItem.data.value }}<small>{{ zoomedItem.data.unit }}</small></div>
                <div class="zoom-scale-label">{{ zoomedItem.data.label }}</div>
                <div class="zoom-scale-bar">
                  <div class="zoom-scale-bar-fill" :style="{ width: zoomedItem.data.percent + '%', background: zoomedItem.data.color }"></div>
                </div>
                <div class="zoom-scale-detail">{{ zoomedItem.data.detail }}</div>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{ isActive?: boolean }>()

// 点击放大
const zoomedItem = ref<{ type: string; data: any } | null>(null)

function openZoom(type: string, data: any) {
  zoomedItem.value = { type, data }
  document.body.style.overflow = 'hidden'
}

function closeZoom() {
  zoomedItem.value = null
  document.body.style.overflow = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeZoom()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

const dataSources = [
  { name: '售楼ERP', icon: '🏢', tag: '业务系统', color: '#60a5fa', layer: '数据采集层', detail: '销售签约、认购、房源管理等核心业务数据，通过CDC实时捕获变更，日均增量约800万条记录。对接明源、致远等主流ERP系统，支持全量/增量双模式同步。' },
  { name: '物业系统', icon: '🏠', tag: '物联数据', color: '#22c55e', layer: '数据采集层', detail: '业主信息、物业费收缴、报修工单等物业管理数据。通过标准API对接，实现业主画像与销售客群的交叉分析，提升老带新转化率。' },
  { name: '渠道平台', icon: '📊', tag: '第三方API', color: '#f59e0b', layer: '数据采集层', detail: '贝壳、链家、自渠等分销渠道数据，通过标准化API对接。实时获取渠道带看量、转化率、佣金结算等关键指标，精准计算各渠道ROI。' },
  { name: '财务系统', icon: '💰', tag: 'SAP对接', color: '#a78bfa', layer: '数据采集层', detail: 'SAP财务系统对接，获取回款、应收、应付、成本等财务数据。通过RFC/ODATA接口实时同步，确保销售与财务数据口径一致，回款率计算准确到分。' },
  { name: 'IoT设备', icon: '📡', tag: '实时流', color: '#00e5ff', layer: '数据采集层', detail: '售楼处人流传感器、智能门禁、环境监测等IoT设备数据。通过MQTT协议接入Kafka，实现到访客户秒级感知，支撑实时客流热力图和到访预警。' },
  { name: '市场数据', icon: '🌐', tag: '爬虫采集', color: '#f472b6', layer: '数据采集层', detail: '竞品楼盘动态、土地拍卖信息、政策发布等市场数据。通过分布式爬虫定时采集，结合NLP提取关键信息，为竞品分析和政策影响评估提供数据支撑。' },
]

const lakeNodes = [
  { name: 'Data Lakehouse', icon: '🔷', desc: 'Iceberg + Hudi 元数据管理', color: '#60a5fa', layer: '数据湖仓层', detail: '基于Apache Iceberg构建的Data Lakehouse架构，融合数据湖的灵活性与数据仓库的ACID事务能力。支持Schema演进、时间旅行查询、隐藏分区等高级特性，实现"一份数据、多种计算"的统一数据底座。' },
  { name: '实时数仓', icon: '⚡', desc: 'Doris / ClickHouse MPP引擎', color: '#22c55e', layer: '数据湖仓层', detail: '采用Doris/ClickHouse MPP架构的实时数仓，支持千万级数据秒级查询响应。向量化执行引擎 + MergeTree存储，支撑Dashboard千人千面的亚秒级渲染，同时满足实时大屏与即席分析双场景。' },
  { name: '数据治理', icon: '🛡️', desc: 'DataHub 元数据目录 &血缘追踪', color: '#f59e0b', layer: '数据湖仓层', detail: '基于LinkedIn DataHub构建的全链路数据治理体系。元数据目录管理150+业务指标定义与口径，数据血缘追踪实现"指标从哪来、影响谁"的透明化管理，数据质量监控覆盖完整性、一致性、时效性三大维度。' },
]

const computeNodes = [
  { name: '流式计算', icon: '⚡', tag: 'Flink / Kafka Streams', color: '#00e5ff', layer: '计算分析层', detail: 'Apache Flink流批一体计算引擎，毫秒级实时处理IoT设备数据与ERP变更事件。支持Exactly-Once语义与状态后端容错，日均处理事件超5亿条，端到端延迟<200ms。' },
  { name: '批处理引擎', icon: '🔧', tag: 'Spark / Presto', color: '#a78bfa', layer: '计算分析层', detail: 'Apache Spark内存计算框架处理大规模离线分析任务，包括客户画像聚类、区域价格预测模型训练等。Presto提供交互式即席查询能力，10亿级数据Join秒级返回。' },
  { name: 'OLAP引擎', icon: '📊', tag: 'Doris / Kylin', color: '#22c55e', layer: '计算分析层', detail: 'Doris MPP引擎支撑实时OLAP分析，预聚合 + 向量化执行实现多维分析秒级响应。Kylin预计算引擎处理超大规模Cube计算，支持百亿级数据亚秒级查询。' },
  { name: '图计算', icon: '🕸️', tag: 'Neo4j / NebulaGraph', color: '#f472b6', layer: '计算分析层', detail: 'Neo4j/NebulaGraph图数据库存储客户关系网络、企业股权穿透图、渠道利益链等图结构数据。支持图遍历、最短路径、社区发现等图算法，挖掘隐式关联关系。' },
]

const appNodes = [
  { name: '决策驾驶舱', icon: '🎛️', tag: '本系统', color: '#60a5fa', layer: '智能应用层', detail: '集团级经营决策驾驶舱，汇聚6大核心KPI与150+业务指标。3D地球+中国地图+项目矩阵多维度可视化，支持钻取、联动、筛选等交互分析，每日早会必看。' },
  { name: '智能预警', icon: '🚨', tag: '风控中心', color: '#ef4444', layer: '智能应用层', detail: '六维风险评估体系（资金/去化/回款/库存/竞争/政策），实时监控24个项目健康度。风险评分<60分自动触发预警，通过企微/短信/邮件多通道推送，确保决策层第一时间知情。' },
  { name: '预测引擎', icon: '🔮', tag: 'ML Pipeline', color: '#a78bfa', layer: '智能应用层', detail: '基于XGBoost/Prophet的时序预测引擎，结合项目特征、市场环境、政策因素预测未来1-3个月销售额。MLflow管理模型版本与实验，A/B测试验证预测准确率>85%。' },
  { name: '自然语言查询', icon: '💬', tag: 'LLM Agent', color: '#22c55e', layer: '智能应用层', detail: 'LLM+NL2SQL+RAG三引擎驱动的智能问答系统。支持中文自然语言查询数据，如"石家庄各项目本月去化率排名"，秒级返回图表+解读。Agent模式自动拆解复杂问题，多轮对话追踪上下文。' },
  { name: '自动报告', icon: '📋', tag: 'RAG + NLG', color: '#f59e0b', layer: '智能应用层', detail: 'RAG检索增强生成 + NLG自然语言生成，自动撰写周报/月报/专题分析报告。自动提取关键指标变化、异常点、归因分析，生成可读性强的经营分析文档，节省分析师80%报告撰写时间。' },
]

const techTerms = [
  { name: 'Lakehouse', fullName: 'Data Lakehouse 数据湖仓', desc: '融合数据湖的灵活性与数据仓库的ACID事务能力，支持SQL查询与机器学习统一访问', color: '#60a5fa', scene: '多源异构数据统一入湖，实现"一份数据、多种计算"' },
  { name: 'Apache Iceberg', fullName: 'Apache Iceberg 开放表格式', desc: '支持大规模数据集的ACID事务、Schema演进与时间旅行查询，消除数据孤岛', color: '#00e5ff', scene: '售楼、物业、财务数据跨系统关联分析' },
  { name: 'Apache Flink', fullName: 'Apache Flink 流批一体计算', desc: '毫秒级实时流处理引擎，支持Exactly-Once语义与状态后端容错', color: '#22c55e', scene: 'IoT设备数据实时采集、线索到访秒级预警' },
  { name: 'ClickHouse', fullName: 'ClickHouse 列式OLAP引擎', desc: '单节点百万级QPS查询性能，支持向量化执行与MergeTree引擎族', color: '#f59e0b', scene: '千人千面Dashboard秒级响应、多维即席查询' },
  { name: 'DataHub', fullName: 'LinkedIn DataHub 数据治理平台', desc: '元数据目录、数据血缘追踪、数据质量监控三合一的现代数据治理方案', color: '#a78bfa', scene: '指标口径统一管理、数据溯源与影响分析' },
  { name: 'dbt', fullName: 'dbt (Data Build Tool) 数据转换', desc: 'SQL-first的ELT转换框架，支持增量模型、测试与文档自动生成', color: '#f472b6', scene: '去化率、回款率等150+业务指标标准化建模' },
  { name: 'Apache Kafka', fullName: 'Apache Kafka 分布式事件流', desc: '百万级TPS分布式消息队列，支撑事件驱动架构与CDC数据变更捕获', color: '#ef4444', scene: 'ERP实时变更同步、跨系统数据解耦' },
  { name: 'Apache Spark', fullName: 'Apache Spark 统一计算引擎', desc: '内存计算框架，支持SQL、MLlib、GraphX、Structured Streaming多范式', color: '#8b5cf6', scene: '客户画像聚类分析、区域价格预测模型训练' },
  { name: 'Airflow', fullName: 'Apache Airflow 工作流编排', desc: 'DAG驱动的数据流水线编排与调度，支持依赖管理与失败重试', color: '#34d399', scene: '每日ETL调度、月度报告自动化生成' },
  { name: 'Great Expectations', fullName: 'Great Expectations 数据质量', desc: '声明式数据验证框架，自动生成数据质量报告与告警', color: '#06b6d4', scene: '回款数据异常检测、线索数据完整性校验' },
  { name: 'Trino', fullName: 'Trino (PrestoSQL) 联邦查询', desc: '跨数据源联邦SQL查询引擎，无需数据移动即可联合查询', color: '#fb923c', scene: 'SAP财务数据+售楼ERP数据+渠道API联合分析' },
  { name: 'Delta Lake', fullName: 'Delta Lake 可靠数据湖', desc: 'ACID事务支持的开源存储层，Time Travel + Z-Order优化', color: '#e879f9', scene: '历史数据版本对比、Z-Order按项目+区域加速查询' },
]

const scaleItems = [
  { label: '数据源接入', value: '36', unit: '+', percent: 90, color: '#60a5fa', detail: '已接入36+数据源，覆盖售楼ERP、物业系统、渠道平台、财务系统、IoT设备、市场数据等六大类别。通过标准化数据接入框架，新数据源接入周期从2周缩短至3天。' },
  { label: '日增数据量', value: '2.8', unit: 'TB', percent: 70, color: '#22c55e', detail: '日均新增数据2.8TB，包括结构化业务数据、半结构化日志数据和非结构化文档。通过Iceberg分层存储策略，热数据SSD加速、温数据HDD、冷数据对象存储，综合存储成本降低40%。' },
  { label: '数据总量', value: '50', unit: 'PB', percent: 80, color: '#f59e0b', detail: '累计数据总量50PB，涵盖24个项目3年历史数据。通过Z-Order按项目+区域优化，核心查询性能提升8倍。支持Time Travel查询任意历史时点数据快照。' },
  { label: '实时延迟', value: '<200', unit: 'ms', percent: 95, color: '#00e5ff', detail: '端到端实时延迟<200ms，从IoT设备数据采集到Dashboard展示全链路。Flink Checkpoint间隔30秒，Kafka消费者延迟监控，确保实时数据与离线数据一致性。' },
  { label: '指标覆盖', value: '150', unit: '+', percent: 85, color: '#a78bfa', detail: '150+业务指标覆盖核心经营、库存定价、渠道分析、销售漏斗、客户画像、区域对比、年度目标、风险预警、AI诊断预测、热门楼盘等十大维度。dbt标准化建模，指标口径100%统一。' },
  { label: '数据质量', value: '99.2', unit: '%', percent: 99, color: '#22c55e', detail: '数据质量综合评分99.2%，覆盖完整性、一致性、时效性、准确性四大维度。Great Expectations自动执行200+数据质量校验规则，异常数据秒级告警，人工介入率<0.1%。' },
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
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #00e5ff 100%);
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
.flow-section {
  padding: 10px 0;
}
.flow-pipeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.flow-layer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.flow-layer-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-title, #e2e8f0);
  padding-left: 4px;
  .layer-icon {
    color: var(--primary, #60a5fa);
    font-size: 14px;
  }
}
.flow-nodes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  &.center-nodes {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Flow Node */
.flow-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 10px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: var(--card-bg, #161B22);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  cursor: zoom-in;

  &:hover {
    transform: translateY(-3px) scale(1.03);
    border-color: var(--node-color, rgba(96, 165, 250, 0.3));
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px color-mix(in srgb, var(--node-color, #60a5fa) 20%, transparent);
  }

  &:active {
    transform: translateY(-1px) scale(1.01);
    transition-duration: 0.1s;
  }
}
.node-pulse {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
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
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--node-color, #60a5fa);
  background: color-mix(in srgb, var(--node-color, #60a5fa) 10%, transparent);
  padding: 2px 6px;
  border-radius: 4px;
}
.node-desc {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--text-caption, #64748b);
  line-height: 1.5;
}

/* Source node special */
.source-node { border-top: 2px solid var(--node-color, #60a5fa); }
.lake-node { border-top: 2px solid var(--node-color, #22c55e); }
.compute-node { border-top: 2px solid var(--node-color, #a78bfa); }
.app-node { border-top: 2px solid var(--node-color, #f59e0b); }

/* Connector */
.flow-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  gap: 4px;
}
.connector-line {
  width: 2px;
  height: 20px;
  background: rgba(96, 165, 250, 0.15);
  position: relative;
  overflow: hidden;
}
.connector-flow {
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent, var(--primary, #60a5fa), transparent);
  animation: flow-down 1.5s linear infinite;
}
@keyframes flow-down {
  0% { top: -100%; }
  100% { top: 100%; }
}
.connector-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--text-caption, #64748b);
  letter-spacing: 0.5px;
}

/* ===== Tech Section ===== */
.tech-section {
  padding: 4px 0;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(96, 165, 250, 0.2), transparent);
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-title, #e2e8f0);
  white-space: nowrap;
  letter-spacing: 1px;
}

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
  cursor: zoom-in;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 16px color-mix(in srgb, var(--card-accent, #60a5fa) 10%, transparent);
    border-color: color-mix(in srgb, var(--card-accent, #60a5fa) 30%, rgba(255,255,255,0.06));
  }

  &:active {
    transform: translateY(-1px) scale(1.01);
    transition-duration: 0.1s;
  }
}
.tech-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: var(--card-accent, #60a5fa);
  margin-bottom: 2px;
}
.tech-full {
  font-size: 10px;
  color: var(--text-caption, #64748b);
  margin-bottom: 8px;
  line-height: 1.4;
}
.tech-desc {
  font-size: 11px;
  color: var(--text-body, #cbd5e1);
  line-height: 1.6;
  margin-bottom: 8px;
}
.tech-scene {
  font-size: 10px;
  color: var(--text-caption, #64748b);
  line-height: 1.5;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

/* ===== Scale Section ===== */
.scale-section {
  padding: 4px 0 20px;
}
.scale-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}
.scale-item {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: var(--card-bg, #161B22);
  text-align: center;
  transition: all 0.3s;
  cursor: zoom-in;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(-1px) scale(1.01);
    transition-duration: 0.1s;
  }
}
.scale-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  color: var(--primary, #60a5fa);
  small {
    font-size: 11px;
    opacity: 0.7;
    font-weight: 500;
  }
}
.scale-label {
  font-size: 10px;
  color: var(--text-caption, #64748b);
  margin: 6px 0 8px;
}
.scale-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}
.scale-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ===== Zoomable cursor ===== */
.zoomable {
  cursor: zoom-in;
}

/* ===== Zoom Overlay ===== */
.zoom-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.zoom-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.zoom-panel {
  position: relative;
  z-index: 1;
  max-width: 640px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 20px;
  background: rgba(12, 15, 22, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(96, 165, 250, 0.08);
  padding: 36px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(96, 165, 250, 0.2); border-radius: 2px; }
}

.zoom-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 2;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
    border-color: rgba(255, 255, 255, 0.2);
  }
}

/* Transition */
.zoom-overlay-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  .zoom-panel { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
}
.zoom-overlay-leave-active {
  transition: all 0.25s ease-in;
  .zoom-panel { transition: all 0.25s ease-in; }
}
.zoom-overlay-enter-from {
  .zoom-backdrop { opacity: 0; }
  .zoom-panel { opacity: 0; transform: scale(0.85) translateY(20px); }
}
.zoom-overlay-leave-to {
  .zoom-backdrop { opacity: 0; }
  .zoom-panel { opacity: 0; transform: scale(0.9) translateY(10px); }
}

/* Zoom Node */
.zoom-node {
  text-align: center;
  padding: 12px 0;
}

.zoom-node-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.zoom-node-name {
  font-size: 24px;
  font-weight: 800;
  color: #e2e8f0;
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.zoom-node-tag {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  padding: 4px 14px;
  border-radius: 6px;
  border: 1px solid;
  margin-bottom: 16px;
}

.zoom-node-desc {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 16px;
}

.zoom-node-layer {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 3px 12px;
  border-radius: 4px;
  background: rgba(96, 165, 250, 0.08);
  border: 1px solid rgba(96, 165, 250, 0.15);
  margin-bottom: 20px;
}

.zoom-node-detail {
  font-size: 14px;
  color: #94a3b8;
  line-height: 2;
  text-align: left;
  padding: 16px 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

/* Zoom Tech */
.zoom-tech {
  padding: 4px 0 4px 24px;
  border-left: 4px solid;
}

.zoom-tech-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 4px;
}

.zoom-tech-full {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.6;
}

.zoom-tech-desc {
  font-size: 15px;
  color: #cbd5e1;
  line-height: 2;
  margin-bottom: 20px;
}

.zoom-tech-scene {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #fbbf24;
  letter-spacing: 1px;
  margin-bottom: 10px;

  svg { width: 14px; height: 14px; }
}

.zoom-tech-scene-text {
  font-size: 14px;
  color: #94a3b8;
  line-height: 2;
  padding: 14px 18px;
  border-radius: 8px;
  background: rgba(251, 191, 36, 0.04);
  border: 1px solid rgba(251, 191, 36, 0.08);
}

/* Zoom Scale */
.zoom-scale {
  text-align: center;
  padding: 16px 0;
}

.zoom-scale-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 56px;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 8px;

  small {
    font-size: 18px;
    font-weight: 600;
    opacity: 0.7;
  }
}

.zoom-scale-label {
  font-size: 16px;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.zoom-scale-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  max-width: 360px;
  margin: 0 auto 24px;
}

.zoom-scale-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.zoom-scale-detail {
  font-size: 14px;
  color: #94a3b8;
  line-height: 2;
  text-align: left;
  padding: 16px 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

@media (max-width: 768px) {
  .flow-nodes, .flow-nodes.center-nodes {
    grid-template-columns: repeat(2, 1fr);
  }
  .tech-grid { grid-template-columns: 1fr; }
  .scale-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>

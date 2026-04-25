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
            <div class="flow-node source-node" v-for="s in dataSources" :key="s.name" :style="{ '--node-color': s.color }">
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
            <div class="flow-node lake-node" v-for="l in lakeNodes" :key="l.name" :style="{ '--node-color': l.color }">
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
            <div class="flow-node compute-node" v-for="c in computeNodes" :key="c.name" :style="{ '--node-color': c.color }">
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
            <div class="flow-node app-node" v-for="a in appNodes" :key="a.name" :style="{ '--node-color': a.color }">
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
        <div class="tech-card" v-for="t in techTerms" :key="t.name" :style="{ '--card-accent': t.color }">
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
        <div class="scale-item" v-for="s in scaleItems" :key="s.label">
          <div class="scale-value">{{ s.value }}<small>{{ s.unit }}</small></div>
          <div class="scale-label">{{ s.label }}</div>
          <div class="scale-bar">
            <div class="scale-bar-fill" :style="{ width: s.percent + '%', background: s.color }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const dataSources = [
  { name: '售楼ERP', icon: '🏢', tag: '业务系统', color: '#60a5fa' },
  { name: '物业系统', icon: '🏠', tag: '物联数据', color: '#22c55e' },
  { name: '渠道平台', icon: '📊', tag: '第三方API', color: '#f59e0b' },
  { name: '财务系统', icon: '💰', tag: 'SAP对接', color: '#a78bfa' },
  { name: 'IoT设备', icon: '📡', tag: '实时流', color: '#00e5ff' },
  { name: '市场数据', icon: '🌐', tag: '爬虫采集', color: '#f472b6' },
]

const lakeNodes = [
  { name: 'Data Lakehouse', icon: '🔷', desc: 'Iceberg + Hudi 元数据管理', color: '#60a5fa' },
  { name: '实时数仓', icon: '⚡', desc: 'Doris / ClickHouse MPP引擎', color: '#22c55e' },
  { name: '数据治理', icon: '🛡️', desc: 'DataHub 元数据目录 &血缘追踪', color: '#f59e0b' },
]

const computeNodes = [
  { name: '流式计算', icon: '⚡', tag: 'Flink / Kafka Streams', color: '#00e5ff' },
  { name: '批处理引擎', icon: '🔧', tag: 'Spark / Presto', color: '#a78bfa' },
  { name: 'OLAP引擎', icon: '📊', tag: 'Doris / Kylin', color: '#22c55e' },
  { name: '图计算', icon: '🕸️', tag: 'Neo4j / NebulaGraph', color: '#f472b6' },
]

const appNodes = [
  { name: '决策驾驶舱', icon: '🎛️', tag: '本系统', color: '#60a5fa' },
  { name: '智能预警', icon: '🚨', tag: '风控中心', color: '#ef4444' },
  { name: '预测引擎', icon: '🔮', tag: 'ML Pipeline', color: '#a78bfa' },
  { name: '自然语言查询', icon: '💬', tag: 'LLM Agent', color: '#22c55e' },
  { name: '自动报告', icon: '📋', tag: 'RAG + NLG', color: '#f59e0b' },
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
  { label: '数据源接入', value: '36', unit: '+', percent: 90, color: '#60a5fa' },
  { label: '日增数据量', value: '2.8', unit: 'TB', percent: 70, color: '#22c55e' },
  { label: '数据总量', value: '50', unit: 'PB', percent: 80, color: '#f59e0b' },
  { label: '实时延迟', value: '<200', unit: 'ms', percent: 95, color: '#00e5ff' },
  { label: '指标覆盖', value: '150', unit: '+', percent: 85, color: '#a78bfa' },
  { label: '数据质量', value: '99.2', unit: '%', percent: 99, color: '#22c55e' },
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

  &:hover {
    transform: translateY(-3px) scale(1.03);
    border-color: var(--node-color, rgba(96, 165, 250, 0.3));
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px color-mix(in srgb, var(--node-color, #60a5fa) 20%, transparent);
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border-color: color-mix(in srgb, var(--card-accent, #60a5fa) 30%, rgba(255,255,255,0.06));
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

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
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

@media (max-width: 768px) {
  .flow-nodes, .flow-nodes.center-nodes {
    grid-template-columns: repeat(2, 1fr);
  }
  .tech-grid { grid-template-columns: 1fr; }
  .scale-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>

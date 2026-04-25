<template>
  <div class="risk-detail">
    <div class="risk-badge-row">
      <span class="risk-type-badge" :class="`type-${risk.type}`">{{ typeLabel }}</span>
      <span class="risk-severity" :class="`sev-${risk.severity}`">{{ risk.severity === 'danger' ? '严重' : '关注' }}</span>
    </div>

    <div class="risk-desc-card" :class="`card-${risk.severity}`">
      <div class="desc-project">{{ risk.projectName }}</div>
      <div class="desc-text">{{ risk.description }}</div>
    </div>

    <div class="detail-section">
      <div class="section-title">详细分析</div>
      <p class="detail-text">{{ risk.detail }}</p>
    </div>

    <div class="detail-section">
      <div class="section-title">处置建议</div>
      <div class="suggestion-list">
        <div v-for="(s, i) in suggestions" :key="i" class="suggestion-item">
          <span class="suggestion-num">{{ i + 1 }}</span>
          <span class="suggestion-text">{{ s }}</span>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="section-title">时间线</div>
      <div class="timeline">
        <div v-for="(t, i) in timeline" :key="i" class="timeline-item">
          <div class="tl-dot" :class="t.type" />
          <div class="tl-content">
            <div class="tl-time">{{ t.time }}</div>
            <div class="tl-text">{{ t.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RiskItem } from '@/utils/mockData'

const props = defineProps<{ risk: RiskItem }>()

const typeLabel = computed(() => {
  const map = { unsalable: '滞销预警', returnAbnormal: '回款异常', highInventory: '高库存预警' }
  return map[props.risk.type]
})

const suggestions = computed(() => {
  if (props.risk.type === 'unsalable') return ['调整定价策略，加大优惠力度', '增加渠道投放，拓展客户来源', '考虑打包转让部分库存']
  if (props.risk.type === 'returnAbnormal') return ['催办银行按揭放款', '启动逾期客户催收', '与财务部门协调回款计划']
  return ['启动特价房促销活动', '与公积金中心合作加快放款', '调整推盘节奏，集中去化']
})

const timeline = computed(() => [
  { time: '30天前', text: `${props.risk.projectName}指标开始偏离正常范围`, type: 'warn' as const },
  { time: '15天前', text: '运营部门发出预警通知', type: 'warn' as const },
  { time: '7天前', text: '管理层讨论处置方案', type: 'info' as const },
  { time: '今日', text: props.risk.description, type: props.risk.severity === 'danger' ? 'danger' as const : 'warn' as const },
])
</script>

<style scoped lang="scss">
.risk-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.risk-badge-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.risk-type-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 4px;

  &.type-unsalable { background: $accent-red-light; color: $accent-red; }
  &.type-returnAbnormal { background: $accent-amber-light; color: $accent-amber; }
  &.type-highInventory { background: $accent-purple-light; color: $accent-purple; }
}

.risk-severity {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;

  &.sev-danger { background: $accent-red-light; color: $accent-red; }
  &.sev-warn { background: $accent-amber-light; color: $accent-amber; }
}

.risk-desc-card {
  padding: 14px 16px;
  border-radius: 8px;
  border-left: 3px solid;

  &.card-danger { background: $accent-red-light; border-color: $accent-red; }
  &.card-warn { background: $accent-amber-light; border-color: $accent-amber; }
}

.desc-project {
  font-size: 16px;
  font-weight: 700;
  color: $gray-100;
  margin-bottom: 4px;
}

.desc-text {
  font-size: 13px;
  color: $gray-300;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: $gray-300;
  padding-left: 8px;
  border-left: 2px solid $accent-blue;
}

.detail-text {
  font-size: 13px;
  color: $gray-300;
  line-height: 1.7;
  padding: 10px 14px;
  background: $surface;
  border-radius: 6px;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 12px;
  background: $accent-blue-light;
  border-radius: 6px;
}

.suggestion-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: $accent-blue-light;
  color: $accent-blue;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.suggestion-text {
  font-size: 13px;
  color: $gray-200;
  line-height: 1.5;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 12px;
  border-left: 2px solid $border-color;
}

.timeline-item {
  display: flex;
  gap: 12px;
  position: relative;
}

.tl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
  left: -17px;
  top: 4px;

  &.warn { background: $accent-amber; }
  &.danger { background: $accent-red; }
  &.info { background: $accent-blue; }
}

.tl-content {
  padding-left: 4px;
}

.tl-time {
  font-size: 10px;
  color: $gray-500;
  margin-bottom: 2px;
}

.tl-text {
  font-size: 12px;
  color: $gray-300;
}
</style>

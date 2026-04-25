<template>
  <div class="kpi-detail">
    <div class="kpi-hero" :style="{ borderColor: kpi.color }">
      <div class="kpi-hero-val" :style="{ color: kpi.color }">
        <DigitalFlipper :value="kpi.value" :decimals="1" :size="40" :color="kpi.color" />
      </div>
      <div class="kpi-hero-label">{{ kpi.label }}</div>
    </div>

    <div class="detail-section">
      <div class="section-title">指标解读</div>
      <p class="detail-text">{{ interpretation }}</p>
    </div>

    <div class="detail-section">
      <div class="section-title">近7日走势</div>
      <div class="sparkline">
        <div v-for="(v, i) in sparkData" :key="i" class="spark-bar" :style="{ height: (v / maxSpark * 100) + '%' }" />
      </div>
      <div class="spark-labels">
        <span v-for="(d, i) in sparkLabels" :key="i">{{ d }}</span>
      </div>
    </div>

    <div class="detail-section">
      <div class="section-title">对标分析</div>
      <div class="benchmark-row">
        <div class="benchmark-item">
          <div class="bm-label">集团目标</div>
          <div class="bm-val">{{ target }}</div>
        </div>
        <div class="benchmark-item">
          <div class="bm-label">当前值</div>
          <div class="bm-val" :style="{ color: kpi.color }">{{ kpi.value.toFixed(1) }}</div>
        </div>
        <div class="benchmark-item">
          <div class="bm-label">差距</div>
          <div class="bm-val" :class="gap >= 0 ? 'positive' : 'negative'">{{ gap >= 0 ? '+' : '' }}{{ gap.toFixed(1) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'

const props = defineProps<{
  kpi: { label: string; value: number; color: string }
}>()

const sparkData = computed(() => {
  const base = props.kpi.value
  return Array.from({ length: 7 }, () => base + (Math.random() - 0.5) * base * 0.2)
})

const maxSpark = computed(() => Math.max(...sparkData.value))

const sparkLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const target = computed(() => {
  const map: Record<string, number> = {
    '去化率': 75, '销售额(亿)': 90, '回款金额(亿)': 70,
    '库存(套)': 3000, '今日成交': 25, '环比增长': 8,
  }
  return map[props.kpi.label] || 70
})

const gap = computed(() => {
  if (props.kpi.label === '库存(套)') return target.value - props.kpi.value // 库存越少越好
  return props.kpi.value - target.value
})

const interpretation = computed(() => {
  const map: Record<string, string> = {
    '去化率': `当前去化率${props.kpi.value.toFixed(1)}%，${props.kpi.value >= 70 ? '高于集团目标75%的基准线，整体销售节奏良好' : '低于集团目标，需加速推盘节奏'}。去化率是衡量项目销售进度的核心指标，直接影响资金回笼速度和库存压力。`,
    '销售额(亿)': `累计销售额${props.kpi.value.toFixed(2)}亿元，${props.kpi.value >= 90 ? '已接近年度目标' : '与年度目标存在差距'}。建议关注高库存项目的促销力度，确保年度目标达成。`,
    '回款金额(亿)': `回款金额${props.kpi.value.toFixed(2)}亿元，回款速度直接影响集团现金流。需重点关注回款率低于70%的项目，督促按揭放款。`,
    '库存(套)': `当前库存${Math.round(props.kpi.value)}套，${props.kpi.value <= 3000 ? '库存处于可控范围' : '库存偏高，需加大去化力度'}。重点关注去化周期超18个月的项目。`,
    '今日成交': `今日成交${Math.round(props.kpi.value)}套，反映当前市场活跃度。建议持续跟踪日成交数据，及时发现市场变化。`,
    '环比增长': `环比增长${props.kpi.value.toFixed(1)}%，${props.kpi.value >= 0 ? '市场呈上升趋势' : '市场有降温迹象'}。需关注宏观政策和竞品动态。`,
  }
  return map[props.kpi.label] || '该指标反映集团经营的核心状态，需要持续关注。'
})
</script>

<style scoped lang="scss">
.kpi-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.kpi-hero {
  text-align: center;
  padding: 24px;
  border-radius: 8px;
  background: $surface;
  border: 1px solid;
}

.kpi-hero-val {
  font-family: $font-digital;
  margin-bottom: 4px;
}

.kpi-hero-label {
  font-size: 13px;
  color: $gray-400;
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

.sparkline {
  display: flex;
  gap: 6px;
  align-items: flex-end;
  height: 60px;
}

.spark-bar {
  flex: 1;
  background: $accent-blue;
  border-radius: 2px 2px 0 0;
  min-height: 2px;
  transition: height 0.4s ease;
  opacity: 0.7;
}

.spark-labels {
  display: flex;
  gap: 6px;

  span {
    flex: 1;
    text-align: center;
    font-size: 9px;
    color: $gray-500;
  }
}

.benchmark-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.benchmark-item {
  text-align: center;
  padding: 12px;
  background: $surface;
  border-radius: 6px;
  border: 1px solid $border-color;
}

.bm-label {
  font-size: 10px;
  color: $gray-500;
  margin-bottom: 4px;
}

.bm-val {
  font-family: $font-digital;
  font-size: 18px;
  font-weight: 700;
  color: $gray-100;

  &.positive { color: $accent-green; }
  &.negative { color: $accent-red; }
}
</style>

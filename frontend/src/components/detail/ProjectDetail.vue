<template>
  <div class="project-detail">
    <!-- KPI Row -->
    <div class="detail-kpi-row">
      <div class="detail-kpi" :class="`kpi-${project.status}`">
        <div class="detail-kpi-val">{{ project.depletionRate.toFixed(1) }}%</div>
        <div class="detail-kpi-lbl">去化率</div>
      </div>
      <div class="detail-kpi">
        <div class="detail-kpi-val">{{ project.salesAmount }}亿</div>
        <div class="detail-kpi-lbl">销售额</div>
      </div>
      <div class="detail-kpi">
        <div class="detail-kpi-val">{{ project.returnRate.toFixed(1) }}%</div>
        <div class="detail-kpi-lbl">回款率</div>
      </div>
      <div class="detail-kpi">
        <div class="detail-kpi-val">{{ project.avgPrice }}</div>
        <div class="detail-kpi-lbl">均价(元/㎡)</div>
      </div>
    </div>

    <!-- Info Grid -->
    <div class="detail-info-grid">
      <div class="info-item">
        <span class="info-lbl">项目名称</span>
        <span class="info-val">{{ project.name }}</span>
      </div>
      <div class="info-item">
        <span class="info-lbl">所属区域</span>
        <span class="info-val">{{ project.city }} · {{ project.district }}</span>
      </div>
      <div class="info-item">
        <span class="info-lbl">总套数</span>
        <span class="info-val">{{ project.totalUnits }} 套</span>
      </div>
      <div class="info-item">
        <span class="info-lbl">已售</span>
        <span class="info-val">{{ project.soldUnits }} 套</span>
      </div>
      <div class="info-item">
        <span class="info-lbl">未售</span>
        <span class="info-val">{{ project.totalUnits - project.soldUnits }} 套</span>
      </div>
      <div class="info-item">
        <span class="info-lbl">库存货值</span>
        <span class="info-val">{{ ((project.totalUnits - project.soldUnits) * project.avgPrice / 10000).toFixed(2) }} 亿</span>
      </div>
    </div>

    <!-- Monthly Trend -->
    <div class="detail-section">
      <div class="section-title">月度成交趋势</div>
      <div class="trend-bars">
        <div v-for="(val, i) in project.monthlyDeals" :key="i" class="trend-bar-item">
          <div class="bar-fill" :style="{ height: (val / maxDeal * 100) + '%' }" />
          <span class="bar-val">{{ val }}</span>
          <span class="bar-lbl">{{ monthLabels[i] }}</span>
        </div>
      </div>
    </div>

    <!-- Return Rate Trend -->
    <div class="detail-section">
      <div class="section-title">月度回款率</div>
      <div class="trend-bars">
        <div v-for="(val, i) in project.returnMonthly" :key="i" class="trend-bar-item return">
          <div class="bar-fill" :style="{ height: val + '%' }" :class="val >= 80 ? 'good' : val >= 60 ? 'warn' : 'bad'" />
          <span class="bar-val">{{ val.toFixed(1) }}%</span>
          <span class="bar-lbl">{{ monthLabels[i] }}</span>
        </div>
      </div>
    </div>

    <!-- Type Distribution -->
    <div class="detail-section" v-if="project.topTypes.length">
      <div class="section-title">产品类型分布</div>
      <div class="type-list">
        <div v-for="t in project.topTypes" :key="t.name" class="type-item">
          <span class="type-name">{{ t.name }}</span>
          <div class="type-bar">
            <div class="type-fill" :style="{ width: t.percent + '%' }" />
          </div>
          <span class="type-pct">{{ t.percent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectItem } from '@/utils/mockData'

const props = defineProps<{ project: ProjectItem }>()

const maxDeal = computed(() => Math.max(...props.project.monthlyDeals))

const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月']
</script>

<style scoped lang="scss">
.project-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.detail-kpi {
  text-align: center;
  padding: 12px 8px;
  border-radius: 6px;
  background: $surface;
  border: 1px solid $border-color;

  &.kpi-green { border-color: $accent-green-light; }
  &.kpi-yellow { border-color: $accent-amber-light; }
  &.kpi-red { border-color: $accent-red-light; }
}

.detail-kpi-val {
  font-family: $font-digital;
  font-size: 20px;
  font-weight: 700;
  color: $gray-100;
}

.detail-kpi-lbl {
  font-size: 10px;
  color: $gray-500;
  margin-top: 2px;
}

.detail-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  background: $surface;
  border-radius: 4px;
}

.info-lbl {
  font-size: 10px;
  color: $gray-500;
}

.info-val {
  font-size: 13px;
  font-weight: 600;
  color: $gray-100;
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

.trend-bars {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  height: 80px;
}

.trend-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;

  .bar-fill {
    width: 100%;
    max-width: 30px;
    border-radius: 3px 3px 0 0;
    background: $accent-blue;
    min-height: 2px;
    transition: height 0.4s ease;
  }

  &.return .bar-fill {
    max-width: 30px;

    &.good { background: $accent-green; }
    &.warn { background: $accent-amber; }
    &.bad { background: $accent-red; }
  }
}

.bar-val {
  font-family: $font-digital;
  font-size: 10px;
  color: $gray-400;
}

.bar-lbl {
  font-size: 9px;
  color: $gray-500;
}

.type-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-name {
  font-size: 11px;
  color: $gray-300;
  width: 40px;
  flex-shrink: 0;
}

.type-bar {
  flex: 1;
  height: 6px;
  background: $bar-track;
  border-radius: 3px;
  overflow: hidden;
}

.type-fill {
  height: 100%;
  background: $accent-blue;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.type-pct {
  font-family: $font-digital;
  font-size: 11px;
  color: $gray-400;
  width: 36px;
  text-align: right;
  flex-shrink: 0;
}
</style>

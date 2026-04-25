<template>
  <div class="dashboard" :style="{ zoom: themeStore.fontScale }">
    <!-- ===== Executive Header ===== -->
    <header class="exec-header">
      <div class="header-left">
        <div class="brand-group">
          <h1 class="brand">SMART<span class="brand-accent">ESTATE</span></h1>
          <span class="brand-divider" />
          <span class="brand-sub">石家庄城发投 · 集团决策驾驶舱</span>
        </div>
      </div>
      <div class="header-center">
        <InsightBar v-if="currentPage === 0" :insight="store.insight" :time="store.formattedUpdateTime" />
        <div v-else class="page-title-bar">
          <span class="page-title-icon">{{ pages[currentPage].icon }}</span>
          <span class="page-title-text">{{ pages[currentPage].label }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="live-indicator">
          <span class="live-dot" />
          <span class="live-text">LIVE</span>
        </div>
        <div class="header-clock">
          <span class="clock-time">{{ currentTime }}</span>
          <span class="clock-date">{{ currentDate }}</span>
        </div>
        <FontSizer />
        <ModeToggle />
        <ThemeSwitcher />
        <PageNav :current-page="currentPage" :pages="pages" @change="switchPage" />
        <button class="refresh-btn" :class="{ spinning: store.isRefreshing }" @click="store.refreshAll()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
        </button>
      </div>
    </header>

    <!-- ===== Main Content ===== -->
    <main class="dash-main">
      <div class="page-slider" :style="{ transform: `translateX(-${currentPage * 100}%)` }">
        <!-- Page 0: Executive Dashboard -->
        <div class="page-slide">
          <!-- 2D Mode -->
          <div v-if="!themeStore.is3D" class="exec-layout">

            <!-- ===== TOP KPI BANNER ===== -->
            <section class="kpi-banner">
              <div class="kpi-card hero" :class="depletionClass" @click="openKPIDetail({ label: '去化率', value: store.coreKPI.depletionRate, color: depletionColor })">
                <div class="kpi-label">去化率</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="store.coreKPI.depletionRate" :decimals="1" :size="38" :color="depletionColor" />
                  <span class="kpi-unit" :style="{ color: depletionColor }">%</span>
                </div>
                <div class="kpi-trend" :class="store.coreKPI.momGrowth >= 0 ? 'up' : 'down'">
                  {{ store.coreKPI.momGrowth >= 0 ? '▲' : '▼' }} {{ Math.abs(store.coreKPI.momGrowth).toFixed(1) }}%
                </div>
                <div class="kpi-bar"><div class="kpi-bar-fill" :style="{ width: store.coreKPI.depletionRate + '%', background: depletionColor }" /></div>
              </div>

              <div class="kpi-card primary" @click="openKPIDetail({ label: '累计销售额', value: store.coreKPI.totalSales, color: 'var(--primary)' })">
                <div class="kpi-label">累计销售额</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="store.coreKPI.totalSales" :decimals="1" :size="34" color="var(--primary)" />
                  <span class="kpi-unit" style="color: var(--primary)">亿</span>
                </div>
              </div>

              <div class="kpi-card" :class="returnClass" @click="openKPIDetail({ label: '总回款率', value: store.coreKPI.returnRate, color: returnColor })">
                <div class="kpi-label">总回款率</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="store.coreKPI.returnRate" :decimals="1" :size="34" :color="returnColor" />
                  <span class="kpi-unit" :style="{ color: returnColor }">%</span>
                </div>
                <div class="kpi-sub">回款 {{ store.coreKPI.returnAmount.toFixed(1) }}亿</div>
                <div class="kpi-bar"><div class="kpi-bar-fill" :style="{ width: store.coreKPI.returnRate + '%', background: returnColor }" /></div>
              </div>

              <div class="kpi-card" :class="inventoryClass" @click="openKPIDetail({ label: '总库存套数', value: store.coreKPI.inventoryUnits, color: inventoryColor })">
                <div class="kpi-label">总库存套数</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="store.coreKPI.inventoryUnits" :decimals="0" :size="34" :color="inventoryColor" />
                  <span class="kpi-unit" :style="{ color: inventoryColor }">套</span>
                </div>
                <div class="kpi-sub">货值 {{ store.coreKPI.inventoryValue }}亿</div>
              </div>

              <div class="kpi-card normal" @click="openKPIDetail({ label: '今日成交', value: store.coreKPI.todayDeals, color: 'var(--text-caption)' })">
                <div class="kpi-label">今日成交</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="store.coreKPI.todayDeals" :decimals="0" :size="34" color="var(--text-caption)" />
                  <span class="kpi-unit" style="color: var(--text-caption)">套</span>
                </div>
              </div>

              <div class="kpi-card normal" @click="openKPIDetail({ label: '本月成交', value: store.coreKPI.monthDeals, color: 'var(--text-caption)' })">
                <div class="kpi-label">本月成交</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="store.coreKPI.monthDeals" :decimals="0" :size="34" color="var(--text-caption)" />
                  <span class="kpi-unit" style="color: var(--text-caption)">套</span>
                </div>
                <div class="kpi-sub">今日 {{ store.coreKPI.todayDeals }} 套</div>
              </div>

              <div class="kpi-card" :class="growthClass" @click="openKPIDetail({ label: '环比增长', value: store.coreKPI.momGrowth, color: growthColor })">
                <div class="kpi-label">环比增长</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="store.coreKPI.momGrowth" :decimals="1" :size="34" :color="growthColor" />
                  <span class="kpi-unit" :style="{ color: growthColor }">%</span>
                </div>
                <div class="kpi-trend" :class="store.coreKPI.momGrowth >= 0 ? 'up' : 'down'">
                  {{ store.coreKPI.momGrowth >= 0 ? '▲' : '▼' }}
                </div>
              </div>
            </section>

            <!-- ===== Floating Alerts ===== -->
            <FloatingAlerts :risks="store.riskDiagnosis" />

            <!-- ===== MAIN BODY (Enhanced 3-column + bottom) ===== -->
            <div class="exec-body">
              <!-- ===== LEFT COLUMN: Trend + Pie + Map ===== -->
              <div class="exec-left">
                <div class="panel-card" :class="{ 'is-fullscreen': fsKey === 'trends' }">
                  <div class="panel-toolbar">
                    <span class="panel-title"><span class="pt-bar" />成交与回款趋势</span>
                    <button class="fs-btn" @click="toggleFs('trends')" :title="fsKey === 'trends' ? '退出全屏' : '全屏'">
                      <svg v-if="fsKey !== 'trends'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                      <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6m0 0v6m0-6H4m6 0L4 20M20 10h-6m0 0V4m0 6h6m-6 0L20 4"/></svg>
                    </button>
                  </div>
                  <div class="panel-body">
                    <CombinedTrendChart
                      :deal-dates="store.dealTrend.dates"
                      :deal-count="store.dealTrend.dealCount"
                      :deal-sales-amount="store.dealTrend.salesAmount"
                      :return-dates="store.returnTrend.dates"
                      :return-amount="store.returnTrend.returnAmount"
                      :return-rate="store.returnTrend.returnRate"
                    />
                  </div>
                </div>

                <div class="panel-card" :class="{ 'is-fullscreen': fsKey === 'pie' }">
                  <div class="panel-toolbar">
                    <span class="panel-title"><span class="pt-bar" />项目状态分布</span>
                    <button class="fs-btn" @click="toggleFs('pie')" :title="fsKey === 'pie' ? '退出全屏' : '全屏'">
                      <svg v-if="fsKey !== 'pie'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                      <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6m0 0v6m0-6H4m6 0L4 20M20 10h-6m0 0V4m0 6h6m-6 0L20 4"/></svg>
                    </button>
                  </div>
                  <div class="panel-body">
                    <PieDistribution :data="statusPieData" />
                  </div>
                </div>

                <div class="panel-card" :class="{ 'is-fullscreen': fsKey === 'areamap' }">
                  <div class="panel-toolbar">
                    <span class="panel-title"><span class="pt-bar" />楼盘区域布局</span>
                    <button class="fs-btn" @click="toggleFs('areamap')" :title="fsKey === 'areamap' ? '退出全屏' : '全屏'">
                      <svg v-if="fsKey !== 'areamap'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                      <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6m0 0v6m0-6H4m6 0L4 20M20 10h-6m0 0V4m0 6h6m-6 0L20 4"/></svg>
                    </button>
                  </div>
                  <div class="panel-body area-map-body">
                    <div class="area-map-grid">
                      <div v-for="area in areaMapData" :key="area.name" class="area-cell" :class="area.level">
                        <div class="area-name">{{ area.name }}</div>
                        <div class="area-count">{{ area.count }}盘</div>
                        <div class="area-sales">{{ area.sales }}亿</div>
                        <div class="area-dot" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ===== CENTER COLUMN: Project Health ===== -->
              <div class="exec-center">
                <div class="panel-card projects-panel" :class="{ 'is-fullscreen': fsKey === 'projects' }">
                  <div class="panel-toolbar">
                    <span class="panel-title"><span class="pt-bar" />项目健康概览<span class="ph-count">{{ store.projectMatrix.length }}个项目</span></span>
                    <div class="health-summary">
                      <div class="hs-item danger"><span class="hs-dot" /><span class="hs-count">{{ redProjects.length }}</span><span class="hs-label">预警</span></div>
                      <div class="hs-item warning"><span class="hs-dot" /><span class="hs-count">{{ yellowProjects.length }}</span><span class="hs-label">关注</span></div>
                      <div class="hs-item healthy"><span class="hs-dot" /><span class="hs-count">{{ greenProjects.length }}</span><span class="hs-label">健康</span></div>
                    </div>
                    <button class="fs-btn" @click="toggleFs('projects')" :title="fsKey === 'projects' ? '退出全屏' : '全屏'">
                      <svg v-if="fsKey !== 'projects'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                      <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6m0 0v6m0-6H4m6 0L4 20M20 10h-6m0 0V4m0 6h6m-6 0L20 4"/></svg>
                    </button>
                  </div>
                  <div class="panel-body projects-scroll">
                    <div v-if="redProjects.length" class="project-group">
                      <div class="group-label danger">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        预警项目
                        <span class="group-badge danger">{{ redProjects.length }}</span>
                      </div>
                      <div class="project-cards">
                        <div v-for="p in redProjects" :key="p.name" class="pcard status-red" @click="openProjectDetail(p)">
                          <div class="pcard-header"><span class="pcard-name">{{ p.name }}</span><span class="pcard-city">{{ p.city }}</span></div>
                          <div class="pcard-rate danger">{{ p.depletionRate.toFixed(1) }}<span class="pcard-rate-unit">%</span></div>
                          <div class="pcard-metrics">
                            <div class="pm-item"><span class="pm-label">回款率</span><span class="pm-val" :class="p.returnRate < 60 ? 'danger' : p.returnRate < 75 ? 'warn' : 'ok'">{{ p.returnRate.toFixed(1) }}%</span></div>
                            <div class="pm-item"><span class="pm-label">库存</span><span class="pm-val">{{ p.totalUnits - p.soldUnits }}套</span></div>
                            <div class="pm-item"><span class="pm-label">销售</span><span class="pm-val">{{ p.salesAmount }}亿</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="yellowProjects.length" class="project-group">
                      <div class="group-label warning">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        关注项目
                        <span class="group-badge warning">{{ yellowProjects.length }}</span>
                      </div>
                      <div class="project-cards">
                        <div v-for="p in yellowProjects" :key="p.name" class="pcard status-yellow" @click="openProjectDetail(p)">
                          <div class="pcard-header"><span class="pcard-name">{{ p.name }}</span><span class="pcard-city">{{ p.city }}</span></div>
                          <div class="pcard-rate warn">{{ p.depletionRate.toFixed(1) }}<span class="pcard-rate-unit">%</span></div>
                          <div class="pcard-metrics">
                            <div class="pm-item"><span class="pm-label">回款率</span><span class="pm-val" :class="p.returnRate < 60 ? 'danger' : p.returnRate < 75 ? 'warn' : 'ok'">{{ p.returnRate.toFixed(1) }}%</span></div>
                            <div class="pm-item"><span class="pm-label">库存</span><span class="pm-val">{{ p.totalUnits - p.soldUnits }}套</span></div>
                            <div class="pm-item"><span class="pm-label">销售</span><span class="pm-val">{{ p.salesAmount }}亿</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="greenProjects.length" class="project-group">
                      <div class="group-label healthy">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        健康项目
                        <span class="group-badge healthy">{{ greenProjects.length }}</span>
                      </div>
                      <div class="project-cards compact">
                        <div v-for="p in greenProjects" :key="p.name" class="pcard status-green" @click="openProjectDetail(p)">
                          <div class="pcard-header"><span class="pcard-name">{{ p.name }}</span><span class="pcard-city">{{ p.city }}</span></div>
                          <div class="pcard-rate ok">{{ p.depletionRate.toFixed(1) }}<span class="pcard-rate-unit">%</span></div>
                          <div class="pcard-metrics">
                            <div class="pm-item"><span class="pm-label">回款率</span><span class="pm-val ok">{{ p.returnRate.toFixed(1) }}%</span></div>
                            <div class="pm-item"><span class="pm-label">库存</span><span class="pm-val">{{ p.totalUnits - p.soldUnits }}套</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ===== RIGHT COLUMN: Bar + Gauge + Risk ===== -->
              <div class="exec-right">
                <div class="panel-card" :class="{ 'is-fullscreen': fsKey === 'bar' }">
                  <div class="panel-toolbar">
                    <span class="panel-title"><span class="pt-bar" />项目销售对比</span>
                    <button class="fs-btn" @click="toggleFs('bar')" :title="fsKey === 'bar' ? '退出全屏' : '全屏'">
                      <svg v-if="fsKey !== 'bar'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                      <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6m0 0v6m0-6H4m6 0L4 20M20 10h-6m0 0V4m0 6h6m-6 0L20 4"/></svg>
                    </button>
                  </div>
                  <div class="panel-body">
                    <BarComparison
                      :projects="barProjects"
                      :target="barTarget"
                      :actual="barActual"
                    />
                  </div>
                </div>

                <div class="panel-card" :class="{ 'is-fullscreen': fsKey === 'gauges' }">
                  <div class="panel-toolbar">
                    <span class="panel-title"><span class="pt-bar" />核心指标仪表</span>
                    <button class="fs-btn" @click="toggleFs('gauges')" :title="fsKey === 'gauges' ? '退出全屏' : '全屏'">
                      <svg v-if="fsKey !== 'gauges'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                      <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6m0 0v6m0-6H4m6 0L4 20M20 10h-6m0 0V4m0 6h6m-6 0L20 4"/></svg>
                    </button>
                  </div>
                  <div class="panel-body gauges-body">
                    <div class="gauges-grid">
                      <GaugeChart :value="store.coreKPI.depletionRate" label="去化率" />
                      <GaugeChart :value="store.coreKPI.returnRate" label="回款率" />
                    </div>
                  </div>
                </div>

                <div class="panel-card risk-panel" :class="{ 'is-fullscreen': fsKey === 'risk' }">
                  <div class="panel-toolbar">
                    <span class="panel-title"><span class="pt-bar" />问题诊断</span>
                    <button class="fs-btn" @click="toggleFs('risk')" :title="fsKey === 'risk' ? '退出全屏' : '全屏'">
                      <svg v-if="fsKey !== 'risk'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                      <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6m0 0v6m0-6H4m6 0L4 20M20 10h-6m0 0V4m0 6h6m-6 0L20 4"/></svg>
                    </button>
                  </div>
                  <div class="panel-body">
                    <RiskDiagnosis :risks="store.riskDiagnosis" @select="openRiskDetail" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3D Mode -->
          <div v-else class="exec-3d-layout">
            <div class="main-3d-panel">
              <div class="panel-3d-split">
                <div class="split-left">
                  <BossKPI v-bind="store.coreKPI" />
                </div>
                <div class="split-right">
                  <Globe3D :markers="globeMarkers" />
                </div>
              </div>
            </div>
            <div class="side-3d-panel">
              <div class="trend-3d-panel">
                <CombinedTrendChart
                  :deal-dates="store.dealTrend.dates"
                  :deal-count="store.dealTrend.dealCount"
                  :deal-sales-amount="store.dealTrend.salesAmount"
                  :return-dates="store.returnTrend.dates"
                  :return-amount="store.returnTrend.returnAmount"
                  :return-rate="store.returnTrend.returnRate"
                />
              </div>
              <div class="risk-3d-panel">
                <RiskDiagnosis :risks="store.riskDiagnosis" @select="openRiskDetail" />
              </div>
            </div>
          </div>
        </div>

        <!-- Page 1-6: Drill-down Pages -->
        <div v-for="page in drillPages" :key="page.key" class="page-slide">
          <div class="slide-content drill-layout">
            <component :is="page.component" :view-mode="themeStore.viewMode" />
          </div>
        </div>
      </div>
    </main>

    <!-- ===== Detail Modals ===== -->
    <DetailModal :visible="!!activeProject" :title="activeProject?.name || ''" @close="activeProject = null">
      <ProjectDetail v-if="activeProject" :project="activeProject" />
    </DetailModal>
    <DetailModal :visible="!!activeRisk" :title="activeRisk?.projectName || '问题详情'" @close="activeRisk = null">
      <RiskDetail v-if="activeRisk" :risk="activeRisk" />
    </DetailModal>
    <DetailModal :visible="!!activeKPI" :title="activeKPI?.label || ''" @close="activeKPI = null">
      <KPIDetail v-if="activeKPI" :kpi="activeKPI" />
    </DetailModal>

    <!-- Swipe Hint -->
    <Transition name="fade">
      <div v-if="showSwipeHint" class="swipe-hint" @click="showSwipeHint = false">
        <div class="hint-content">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          <span>左右滑动或使用导航切换页面</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, defineAsyncComponent, markRaw, type Component } from 'vue'
import { useDashboardStore } from '@/store'
import { useThemeStore } from '@/store/theme'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import type { ProjectItem, RiskItem } from '@/utils/mockData'
import { fluctuate } from '@/utils/mockData'

import InsightBar from '@/components/modules/InsightBar.vue'
import BossKPI from '@/components/modules/BossKPI.vue'
import RiskDiagnosis from '@/components/modules/RiskDiagnosis.vue'
import CombinedTrendChart from '@/components/charts/CombinedTrendChart.vue'
import PieDistribution from '@/components/charts/PieDistribution.vue'
import BarComparison from '@/components/charts/BarComparison.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'
import Globe3D from '@/components/charts/Globe3D.vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue'
import ModeToggle from '@/components/common/ModeToggle.vue'
import FontSizer from '@/components/common/FontSizer.vue'
import PageNav from '@/components/common/PageNav.vue'
import DetailModal from '@/components/common/DetailModal.vue'
import FloatingAlerts from '@/components/common/FloatingAlerts.vue'

const ProjectDetail = defineAsyncComponent(() => import('@/components/detail/ProjectDetail.vue'))
const RiskDetail = defineAsyncComponent(() => import('@/components/detail/RiskDetail.vue'))
const KPIDetail = defineAsyncComponent(() => import('@/components/detail/KPIDetail.vue'))

const ProjectDeepPage = markRaw(defineAsyncComponent(() => import('@/components/pages/ProjectDeepPage.vue')))
const ChannelPage = markRaw(defineAsyncComponent(() => import('@/components/pages/ChannelPage.vue')))
const CustomerPage = markRaw(defineAsyncComponent(() => import('@/components/pages/CustomerPage.vue')))
const FunnelPage = markRaw(defineAsyncComponent(() => import('@/components/pages/FunnelPage.vue')))
const InventoryPage = markRaw(defineAsyncComponent(() => import('@/components/pages/InventoryPage.vue')))
const RegionPage = markRaw(defineAsyncComponent(() => import('@/components/pages/RegionPage.vue')))

interface PageDef {
  key: string
  label: string
  icon: string
  component?: Component
}

const pages: PageDef[] = [
  { key: 'dashboard', label: '总览', icon: '◉' },
  { key: 'project', label: '项目深度', icon: '◈', component: ProjectDeepPage },
  { key: 'channel', label: '渠道分析', icon: '⬡', component: ChannelPage },
  { key: 'customer', label: '客户画像', icon: '◎', component: CustomerPage },
  { key: 'funnel', label: '销售漏斗', icon: '▽', component: FunnelPage },
  { key: 'inventory', label: '库存定价', icon: '◻', component: InventoryPage },
  { key: 'region', label: '区域对比', icon: '◇', component: RegionPage },
]

const drillPages = pages.slice(1)

const store = useDashboardStore()
const themeStore = useThemeStore()
const { start, stop } = useAutoRefresh(30000)

// Page navigation
const currentPage = ref(0)
const showSwipeHint = ref(true)

// Fullscreen state
const fsKey = ref<string | null>(null)

function toggleFs(key: string) {
  fsKey.value = fsKey.value === key ? null : key
  document.body.style.overflow = fsKey.value ? 'hidden' : ''
}

// Real-time clock
const now = ref(new Date())
let clockTimer: ReturnType<typeof setInterval> | null = null

const currentTime = computed(() => {
  const d = now.value
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
})

const currentDate = computed(() => {
  const d = now.value
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} 周${weekdays[d.getDay()]}`
})

// Color helpers — using CSS variables for theme reactivity
const depletionColor = computed(() => store.coreKPI.depletionRate >= 70 ? 'var(--success)' : store.coreKPI.depletionRate >= 50 ? 'var(--warning)' : 'var(--danger)')
const depletionClass = computed(() => store.coreKPI.depletionRate >= 70 ? 'healthy' : store.coreKPI.depletionRate >= 50 ? 'warning' : 'danger')
const returnColor = computed(() => store.coreKPI.returnRate >= 75 ? 'var(--success)' : store.coreKPI.returnRate >= 60 ? 'var(--warning)' : 'var(--danger)')
const returnClass = computed(() => store.coreKPI.returnRate >= 75 ? 'healthy' : store.coreKPI.returnRate >= 60 ? 'warning' : 'danger')
const inventoryColor = computed(() => store.coreKPI.inventoryUnits > 3500 ? 'var(--danger)' : store.coreKPI.inventoryUnits > 3000 ? 'var(--warning)' : 'var(--success)')
const inventoryClass = computed(() => store.coreKPI.inventoryUnits > 3500 ? 'danger' : store.coreKPI.inventoryUnits > 3000 ? 'warning' : 'healthy')
const growthColor = computed(() => store.coreKPI.momGrowth >= 5 ? 'var(--success)' : store.coreKPI.momGrowth >= 0 ? 'var(--text-caption)' : 'var(--danger)')
const growthClass = computed(() => store.coreKPI.momGrowth >= 5 ? 'healthy' : store.coreKPI.momGrowth >= 0 ? 'normal' : 'danger')

// Project grouping by health
const redProjects = computed(() => store.projectMatrix.filter(p => p.status === 'red').sort((a, b) => a.depletionRate - b.depletionRate))
const yellowProjects = computed(() => store.projectMatrix.filter(p => p.status === 'yellow').sort((a, b) => a.depletionRate - b.depletionRate))
const greenProjects = computed(() => store.projectMatrix.filter(p => p.status === 'green').sort((a, b) => b.depletionRate - a.depletionRate))

// Status pie chart data
const statusPieData = computed(() => [
  { name: '健康项目', value: greenProjects.value.length },
  { name: '关注项目', value: yellowProjects.value.length },
  { name: '预警项目', value: redProjects.value.length },
])

// Bar chart data - top 6 projects by sales
const barProjects = computed(() => store.projectMatrix.slice(0, 6).map(p => p.name.replace('城发投·', '')))
const barTarget = computed(() => store.projectMatrix.slice(0, 6).map(() => fluctuate(15000, 3000)))
const barActual = computed(() => store.projectMatrix.slice(0, 6).map(p => Math.round(p.salesAmount * 10000)))

// Area map data
const areaMapData = computed(() => {
  const areas = [
    { name: '裕华区', level: 'healthy' as const },
    { name: '长安区', level: 'warning' as const },
    { name: '桥西区', level: 'warning' as const },
    { name: '新华区', level: 'healthy' as const },
    { name: '正定新区', level: 'danger' as const },
    { name: '栾城区', level: 'danger' as const },
  ]
  return areas.map(a => {
    const projects = store.projectMatrix.filter(p => p.city === a.name)
    return {
      name: a.name,
      level: a.level,
      count: projects.length || Math.floor(Math.random() * 4) + 1,
      sales: projects.reduce((s, p) => s + p.salesAmount, 0).toFixed(1) || (Math.random() * 30 + 5).toFixed(1),
    }
  })
})

// 3D mode globe markers
const globeMarkers = computed(() => {
  const projects = store.projectMatrix
  return projects.map(p => ({
    name: p.name,
    lat: fluctuate(38, 0.3, 2),
    lng: fluctuate(114.5, 0.3, 2),
    size: Math.max(1, p.salesAmount / 5),
    value: p.depletionRate,
  }))
})

function switchPage(idx: number) {
  currentPage.value = idx
  showSwipeHint.value = false
}

// Swipe detection
let touchStartX = 0
let touchStartY = 0

function handleTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function handleTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    if (dx < 0 && currentPage.value < pages.length - 1) {
      currentPage.value++
    } else if (dx > 0 && currentPage.value > 0) {
      currentPage.value--
    }
    showSwipeHint.value = false
  }
}

function handleWheel(e: WheelEvent) {
  if (e.deltaX !== 0) {
    if (e.deltaX > 30 && currentPage.value < pages.length - 1) {
      currentPage.value++
    } else if (e.deltaX < -30 && currentPage.value > 0) {
      currentPage.value--
    }
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' && currentPage.value < pages.length - 1) {
    currentPage.value++
  } else if (e.key === 'ArrowLeft' && currentPage.value > 0) {
    currentPage.value--
  } else if (e.key === 'Escape' && fsKey.value) {
    fsKey.value = null
    document.body.style.overflow = ''
  }
}

// Drill-down state
const activeProject = ref<ProjectItem | null>(null)
const activeRisk = ref<RiskItem | null>(null)
const activeKPI = ref<{ label: string; value: number; color: string } | null>(null)

function openProjectDetail(project: ProjectItem) {
  activeProject.value = project
}

function openRiskDetail(risk: RiskItem) {
  activeRisk.value = risk
}

function openKPIDetail(kpi: { label: string; value: number; color: string }) {
  activeKPI.value = kpi
}

onMounted(() => {
  start(store.refreshAll)
  themeStore.applyTheme()
  document.documentElement.setAttribute('data-view-mode', themeStore.viewMode)
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchend', handleTouchEnd, { passive: true })
  window.addEventListener('wheel', handleWheel, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  clockTimer = setInterval(() => { now.value = new Date() }, 1000)
  setTimeout(() => { showSwipeHint.value = false }, 4000)
})

onUnmounted(() => {
  stop()
  if (clockTimer) clearInterval(clockTimer)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped lang="scss">
// ===== Dashboard uses CSS variables for full theme reactivity =====
.dashboard {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg, #0F1217);
}

// ===== Header =====
.exec-header {
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  background: var(--header-bg, rgba(15, 18, 23, 0.95));
  backdrop-filter: blur(16px);
  flex-shrink: 0;
  z-index: 10;
}

.header-left { flex-shrink: 0; }

.brand-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand {
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: var(--text-title, #e2e8f0);
  letter-spacing: 2px;
}

.brand-accent { color: var(--primary, #60a5fa); }

.brand-divider {
  width: 1px;
  height: 16px;
  background: var(--border, rgba(255, 255, 255, 0.06));
}

.brand-sub {
  font-size: 11px;
  color: var(--text-caption, #64748b);
  letter-spacing: 1px;
  white-space: nowrap;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  min-width: 0;
}

.page-title-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 14px;
  border-radius: 4px;
  background: var(--primary-light, rgba(96, 165, 250, 0.12));
  border: 1px solid rgba(96, 165, 250, 0.15);
  animation: titleSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes titleSlideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-title-icon { font-size: 14px; color: var(--primary, #60a5fa); }
.page-title-text { font-size: 13px; font-weight: 600; color: var(--text-title, #e2e8f0); letter-spacing: 0.5px; }

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--success, #22C55E);
  box-shadow: 0 0 8px var(--success-light, rgba(34, 197, 94, 0.25));
  animation: pulseDot 2s ease-in-out infinite;
}

.live-text {
  font-size: 10px;
  font-weight: 700;
  color: var(--success, #22C55E);
  letter-spacing: 1.5px;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.header-clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0;
}

.clock-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-title, #e2e8f0);
  letter-spacing: 1px;
  line-height: 1.2;
}

.clock-date {
  font-size: 9px;
  color: var(--text-caption, #64748b);
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.refresh-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  background: var(--card-bg, #161B22);
  color: var(--text-caption, #64748b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;

  &:hover {
    background: var(--surface-hover, rgba(255, 255, 255, 0.06));
    border-color: rgba(96, 165, 250, 0.2);
    color: var(--primary, #60a5fa);
    box-shadow: 0 0 8px rgba(96, 165, 250, 0.15);
  }

  &.spinning svg { animation: spin 0.6s linear; }
}

@keyframes spin { to { transform: rotate(360deg); } }

// ===== Main Layout =====
.dash-main {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.page-slider {
  display: flex;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.slide-content { flex: 1; min-height: 0; }

// ===== Executive Dashboard Layout (2D) =====
.exec-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  gap: 8px;
}

// ===== KPI Banner =====
.kpi-banner {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.kpi-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: transparent;
    transition: background 0.3s;
  }

  // 3D depth + hover animation
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.12);
  }

  &.hero {
    flex: 1.3;
    padding: 14px 18px;
    &::before { background: var(--success, #22C55E); }
    &.warning::before { background: var(--warning, #F59E0B); }
    &.danger::before { background: var(--danger, #EF4444); }
  }

  &.healthy::before { background: var(--success, #22C55E); }
  &.warning::before { background: var(--warning, #F59E0B); }
  &.danger::before { background: var(--danger, #EF4444); }
  &.primary::before { background: var(--primary, #60a5fa); }
  &.normal::before { background: var(--text-caption, #64748b); }

  &.healthy:hover { border-color: var(--success, #22C55E); box-shadow: 0 8px 30px var(--success-light, rgba(34, 197, 94, 0.2)); }
  &.warning:hover { border-color: var(--warning, #F59E0B); box-shadow: 0 8px 30px var(--warning-light, rgba(245, 158, 11, 0.2)); }
  &.danger:hover { border-color: var(--danger, #EF4444); box-shadow: 0 8px 30px var(--danger-light, rgba(239, 68, 68, 0.2)); }
  &.primary:hover { border-color: rgba(96, 165, 250, 0.3); box-shadow: 0 8px 30px var(--primary-light, rgba(96, 165, 250, 0.15)); }
}

.kpi-label { font-size: 10px; font-weight: 500; color: var(--text-caption, #64748b); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
.kpi-main { display: flex; align-items: baseline; gap: 2px; }
.kpi-unit { font-size: 14px; font-weight: 600; opacity: 0.7; }
.kpi-trend { font-size: 11px; font-weight: 700; margin-top: 2px; &.up { color: var(--success, #22C55E); } &.down { color: var(--danger, #EF4444); } }
.kpi-sub { font-size: 10px; color: var(--text-caption, #64748b); margin-top: 2px; }
.kpi-bar { height: 3px; background: var(--bar-track, rgba(255, 255, 255, 0.05)); border-radius: 2px; margin-top: 6px; overflow: hidden; }
.kpi-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }

// ===== Main Body (3-column) =====
.exec-body {
  flex: 1;
  display: flex;
  gap: 10px;
  min-height: 0;
}

.exec-left {
  width: 22%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exec-center {
  flex: 1;
  min-width: 0;
}

.exec-right {
  width: 26%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// ===== Panel Card (reusable) — with 3D depth =====
.panel-card {
  border-radius: 10px;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  // 3D perspective depth
  transform: perspective(1000px) translateZ(0);

  &:hover {
    transform: perspective(1000px) translateZ(8px) scale(1.01);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
    border-color: rgba(96, 165, 250, 0.12);
  }

  &.is-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 200;
    border-radius: 0;
    background: var(--bg, #0F1217);
    transform: none;
    box-shadow: none;
    animation: fsEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1);

    .panel-body {
      transform: scale(1.15);
      transform-origin: center center;
      height: 100%;
    }
  }
}

@keyframes fsEnter {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.exec-left .panel-card { flex: 1; min-height: 0; }
.exec-center .panel-card { height: 100%; }
.exec-right .panel-card { flex: 1; min-height: 0; }

.panel-toolbar {
  display: flex;
  align-items: center;
  padding: 10px 14px 6px;
  flex-shrink: 0;
}

.panel-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-title, #e2e8f0);
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.pt-bar {
  width: 3px;
  height: 12px;
  border-radius: 1px;
  background: var(--primary, #60a5fa);
  flex-shrink: 0;
}

.ph-count {
  font-size: 11px;
  color: var(--text-caption, #64748b);
  font-weight: 400;
  margin-left: 4px;
}

.fs-btn {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  background: transparent;
  color: var(--text-caption, #64748b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
  flex-shrink: 0;

  &:hover {
    background: var(--primary-light, rgba(96, 165, 250, 0.12));
    color: var(--primary, #60a5fa);
    border-color: rgba(96, 165, 250, 0.2);
    box-shadow: 0 0 8px rgba(96, 165, 250, 0.12);
  }
}

.panel-body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.health-summary {
  display: flex;
  gap: 10px;
  margin-left: auto;
  margin-right: 8px;
}

.hs-item {
  display: flex;
  align-items: center;
  gap: 4px;
  &.danger .hs-dot { background: var(--danger, #EF4444); box-shadow: 0 0 6px var(--danger-light, rgba(239, 68, 68, 0.3)); }
  &.danger .hs-count { color: var(--danger, #EF4444); }
  &.warning .hs-dot { background: var(--warning, #F59E0B); box-shadow: 0 0 6px var(--warning-light, rgba(245, 158, 11, 0.25)); }
  &.warning .hs-count { color: var(--warning, #F59E0B); }
  &.healthy .hs-dot { background: var(--success, #22C55E); box-shadow: 0 0 6px var(--success-light, rgba(34, 197, 94, 0.25)); }
  &.healthy .hs-count { color: var(--success, #22C55E); }
}

.hs-dot { width: 6px; height: 6px; border-radius: 50%; }
.hs-count { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; }
.hs-label { font-size: 10px; color: var(--text-caption, #64748b); }

// ===== Project Health Section =====
.projects-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.group-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 4px 0;
  &.danger { color: var(--danger, #EF4444); }
  &.warning { color: var(--warning, #F59E0B); }
  &.healthy { color: var(--success, #22C55E); }
}

.group-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 8px;
  &.danger { background: var(--danger-light, rgba(239, 68, 68, 0.15)); color: var(--danger, #EF4444); }
  &.warning { background: var(--warning-light, rgba(245, 158, 11, 0.15)); color: var(--warning, #F59E0B); }
  &.healthy { background: var(--success-light, rgba(34, 197, 94, 0.15)); color: var(--success, #22C55E); }
}

.project-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  gap: 6px;
  &.compact { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
}

.pcard {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &.status-red {
    background: var(--danger-light, rgba(239, 68, 68, 0.15));
    border-color: rgba(239, 68, 68, 0.2);
    &:hover { border-color: var(--danger, #EF4444); box-shadow: 0 4px 20px var(--danger-light); transform: translateY(-2px) scale(1.02); }
  }
  &.status-yellow {
    background: var(--warning-light, rgba(245, 158, 11, 0.15));
    border-color: rgba(245, 158, 11, 0.2);
    &:hover { border-color: var(--warning, #F59E0B); box-shadow: 0 4px 20px var(--warning-light); transform: translateY(-2px) scale(1.02); }
  }
  &.status-green {
    background: var(--success-light, rgba(34, 197, 94, 0.15));
    border-color: rgba(34, 197, 94, 0.15);
    &:hover { border-color: var(--success, #22C55E); box-shadow: 0 4px 20px var(--success-light); transform: translateY(-2px) scale(1.02); }
  }
}

.pcard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.pcard-name { font-size: 11px; font-weight: 600; color: var(--text-title, #e2e8f0); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%; }
.pcard-city { font-size: 9px; color: var(--text-caption, #64748b); padding: 1px 4px; background: var(--surface, rgba(255, 255, 255, 0.03)); border-radius: 2px; flex-shrink: 0; }
.pcard-rate { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; line-height: 1.2; margin-bottom: 6px; &.danger { color: var(--danger, #EF4444); } &.warn { color: var(--warning, #F59E0B); } &.ok { color: var(--success, #22C55E); } }
.pcard-rate-unit { font-size: 12px; opacity: 0.6; margin-left: 1px; }
.pcard-metrics { display: flex; gap: 10px; }
.pm-item { display: flex; flex-direction: column; gap: 1px; }
.pm-label { font-size: 9px; color: var(--text-caption, #64748b); }
.pm-val { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: var(--text-body, #cbd5e1); &.danger { color: var(--danger, #EF4444); } &.warn { color: var(--warning, #F59E0B); } &.ok { color: var(--success, #22C55E); } }

// ===== Area Map =====
.area-map-body { overflow-y: auto; padding: 6px; }

.area-map-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.area-cell {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid transparent;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;

  &.healthy {
    background: var(--success-light, rgba(34, 197, 94, 0.08));
    border-color: rgba(34, 197, 94, 0.15);
  }
  &.warning {
    background: var(--warning-light, rgba(245, 158, 11, 0.08));
    border-color: rgba(245, 158, 11, 0.15);
  }
  &.danger {
    background: var(--danger-light, rgba(239, 68, 68, 0.08));
    border-color: rgba(239, 68, 68, 0.15);
  }

  &:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3); }
}

.area-name { font-size: 11px; font-weight: 600; color: var(--text-title, #e2e8f0); }
.area-count { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: var(--text-body, #cbd5e1); }
.area-sales { font-size: 9px; color: var(--text-caption, #64748b); }

.area-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;

  .healthy & { background: var(--success, #22C55E); box-shadow: 0 0 6px var(--success-light); }
  .warning & { background: var(--warning, #F59E0B); box-shadow: 0 0 6px var(--warning-light); }
  .danger & { background: var(--danger, #EF4444); box-shadow: 0 0 6px var(--danger-light); }
}

// ===== Gauges =====
.gauges-body { padding: 4px; }

.gauges-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  height: 100%;
}

// ===== 3D Mode Layout =====
.exec-3d-layout {
  display: flex;
  gap: 8px;
  padding: 8px;
  height: 100%;
}

.main-3d-panel {
  flex: 1;
  min-height: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--card-bg);
}

.panel-3d-split { display: flex; height: 100%; }
.split-left { width: 38%; border-right: 1px solid var(--border); overflow-y: auto; }
.split-right { flex: 1; min-width: 0; }

.side-3d-panel {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trend-3d-panel { flex: 1; min-height: 0; border-radius: 8px; border: 1px solid var(--border); background: var(--card-bg); overflow: hidden; }
.risk-3d-panel { height: 200px; min-height: 140px; border-radius: 8px; border: 1px solid var(--border); background: var(--card-bg); overflow: auto; }

// ===== Drill-down Layout =====
.drill-layout { height: 100%; overflow: hidden; }

// ===== Swipe Hint =====
.swipe-hint {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  cursor: pointer;
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 20px;
  background: var(--primary-light, rgba(96, 165, 250, 0.12));
  border: 1px solid rgba(96, 165, 250, 0.15);
  backdrop-filter: blur(12px);
  color: var(--primary, #60a5fa);
  font-size: 12px;
  animation: hintSlide 1.5s ease-in-out infinite;
  svg { animation: hintArrow 1.5s ease-in-out infinite; }
}

@keyframes hintSlide { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } }
@keyframes hintArrow { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

// ===== Responsive =====
@media (max-width: 1200px) {
  .kpi-banner { flex-wrap: wrap; }
  .kpi-card { min-width: calc(25% - 8px); }
  .exec-body { flex-direction: column; }
  .exec-left, .exec-center, .exec-right { width: 100%; min-height: 200px; }
}

@media (max-width: 768px) {
  .exec-header {
    height: auto;
    flex-wrap: wrap;
    padding: 8px 10px;
    gap: 6px;
  }
  .header-left { flex-basis: 100%; }
  .header-center { order: 3; flex-basis: 100%; padding: 0; }
  .header-right { flex-wrap: wrap; gap: 6px; }
  .brand-sub { display: none; }
  .brand-divider { display: none; }

  .kpi-banner { gap: 4px; }
  .kpi-card { min-width: calc(50% - 4px); padding: 8px 10px; }

  .exec-layout { padding: 6px 8px; gap: 6px; overflow-y: auto; }
  .exec-body { flex-direction: column; gap: 6px; }
  .exec-left, .exec-right { width: 100%; }
  .exec-left .panel-card, .exec-right .panel-card { min-height: 180px; }

  .exec-3d-layout { flex-direction: column; }
  .side-3d-panel { width: 100%; max-height: 200px; }
}

@media (max-width: 480px) {
  .kpi-card { min-width: 100%; }
  .area-map-grid { grid-template-columns: 1fr; }
  .gauges-grid { grid-template-columns: 1fr; }
}
</style>

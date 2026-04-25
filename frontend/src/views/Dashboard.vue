<template>
  <div class="dashboard" :class="{ 'present-active': presentMode }" :style="{ zoom: themeStore.fontScale }">
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
        <button class="present-btn" :class="{ active: presentMode }" @click="togglePresentation" :title="presentMode ? '退出汇报模式' : '汇报模式'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </button>
        <button class="mute-btn" :class="{ muted: isMuted }" @click="toggleMute" :title="isMuted ? '取消静音' : '静音'">
          <svg v-if="!isMuted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
        </button>
        <FontSizer />
        <ModeToggle />
        <ThemeSwitcher />
        <PageNav :current-page="currentPage" :pages="pages" @change="switchPage" @reorder="onReorderPages" />
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
              <div class="kpi-card hero" :class="depletionClass" @click="openKPIDetail({ label: '去化率', value: adjustedKPI.depletionRate, color: depletionColor })">
                <div class="kpi-label">去化率</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="adjustedKPI.depletionRate" :decimals="1" :size="38" :color="depletionColor" />
                  <span class="kpi-unit" :style="{ color: depletionColor }">%</span>
                </div>
                <div class="kpi-trend" :class="adjustedKPI.momGrowth >= 0 ? 'up' : 'down'">
                  {{ adjustedKPI.momGrowth >= 0 ? '▲' : '▼' }} {{ Math.abs(adjustedKPI.momGrowth).toFixed(1) }}%
                </div>
                <div class="kpi-bar"><div class="kpi-bar-fill" :style="{ width: adjustedKPI.depletionRate + '%', background: depletionColor }" /></div>
              </div>

              <div class="kpi-card primary" @click="openKPIDetail({ label: '累计销售额', value: adjustedKPI.totalSales, color: 'var(--primary)' })">
                <div class="kpi-label">累计销售额</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="adjustedKPI.totalSales" :decimals="1" :size="34" color="var(--primary)" />
                  <span class="kpi-unit" style="color: var(--primary)">亿</span>
                </div>
              </div>

              <div class="kpi-card" :class="returnClass" @click="openKPIDetail({ label: '总回款率', value: adjustedKPI.returnRate, color: returnColor })">
                <div class="kpi-label">总回款率</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="adjustedKPI.returnRate" :decimals="1" :size="34" :color="returnColor" />
                  <span class="kpi-unit" :style="{ color: returnColor }">%</span>
                </div>
                <div class="kpi-bar"><div class="kpi-bar-fill" :style="{ width: adjustedKPI.returnRate + '%', background: returnColor }" /></div>
              </div>

              <div class="kpi-card" :class="inventoryClass" @click="openKPIDetail({ label: '总库存套数', value: adjustedKPI.inventoryUnits, color: inventoryColor })">
                <div class="kpi-label">总库存</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="adjustedKPI.inventoryUnits" :decimals="0" :size="34" :color="inventoryColor" />
                  <span class="kpi-unit" :style="{ color: inventoryColor }">套</span>
                </div>
                <div class="kpi-sub">货值 {{ adjustedKPI.inventoryValue }}亿</div>
              </div>

              <div class="kpi-card" :class="adjustedKPI.cashFlow >= 10 ? 'healthy' : adjustedKPI.cashFlow >= 5 ? 'warning' : 'danger'" @click="openKPIDetail({ label: '现金流', value: adjustedKPI.cashFlow, color: adjustedKPI.cashFlow >= 10 ? 'var(--success)' : adjustedKPI.cashFlow >= 5 ? 'var(--warning)' : 'var(--danger)' })">
                <div class="kpi-label">现金流</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="adjustedKPI.cashFlow" :decimals="1" :size="34" :color="adjustedKPI.cashFlow >= 10 ? 'var(--success)' : adjustedKPI.cashFlow >= 5 ? 'var(--warning)' : 'var(--danger)'" />
                  <span class="kpi-unit" :style="{ color: adjustedKPI.cashFlow >= 10 ? 'var(--success)' : adjustedKPI.cashFlow >= 5 ? 'var(--warning)' : 'var(--danger)' }">亿</span>
                </div>
              </div>

              <div class="kpi-card" :class="adjustedKPI.profitMargin >= 20 ? 'healthy' : adjustedKPI.profitMargin >= 15 ? 'warning' : 'danger'" @click="openKPIDetail({ label: '利润率', value: adjustedKPI.profitMargin, color: adjustedKPI.profitMargin >= 20 ? 'var(--success)' : adjustedKPI.profitMargin >= 15 ? 'var(--warning)' : 'var(--danger)' })">
                <div class="kpi-label">利润率</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="adjustedKPI.profitMargin" :decimals="1" :size="34" :color="adjustedKPI.profitMargin >= 20 ? 'var(--success)' : adjustedKPI.profitMargin >= 15 ? 'var(--warning)' : 'var(--danger)'" />
                  <span class="kpi-unit" :style="{ color: adjustedKPI.profitMargin >= 20 ? 'var(--success)' : adjustedKPI.profitMargin >= 15 ? 'var(--warning)' : 'var(--danger)' }">%</span>
                </div>
              </div>

              <div class="kpi-card normal" @click="openKPIDetail({ label: '环比增长', value: adjustedKPI.momGrowth, color: growthColor })">
                <div class="kpi-label">环比增长</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="adjustedKPI.momGrowth" :decimals="1" :size="34" :color="growthColor" />
                  <span class="kpi-unit" :style="{ color: growthColor }">%</span>
                </div>
                <div class="kpi-trend" :class="adjustedKPI.momGrowth >= 0 ? 'up' : 'down'">
                  {{ adjustedKPI.momGrowth >= 0 ? '▲' : '▼' }}
                </div>
              </div>

              <!-- Period Selector -->
              <div class="period-selector">
                <button v-for="p in (['day','week','month','year'] as const)" :key="p" class="period-btn" :class="{ active: period === p }" @click="period = p">{{ periodLabels[p] }}</button>
              </div>
            </section>

            <!-- ===== Annual Target Tracker (Compact) ===== -->
            <section v-if="currentPage === 0" class="target-banner">
              <TargetTracker :targets="store.targets" :compact="true" />
            </section>

            <!-- ===== Risk Alert Carousel ===== -->
            <section v-if="store.riskDiagnosis.length > 0" class="risk-carousel">
              <div class="rc-header">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span class="rc-title">预警监控</span>
                <span class="rc-count" :class="store.riskDiagnosis.some(r => r.severity === 'danger') ? 'danger' : 'warn'">{{ store.riskDiagnosis.length }}</span>
              </div>
              <div class="rc-body">
                <Transition name="rc-slide" mode="out-in">
                  <div :key="riskCarouselIdx" class="rc-item" :class="`severity-${store.riskDiagnosis[riskCarouselIdx].severity}`" @click="openRiskDetail(store.riskDiagnosis[riskCarouselIdx])">
                    <span v-if="store.riskDiagnosis[riskCarouselIdx].severity === 'danger'" class="rc-pulse danger" />
                    <span v-else class="rc-dot warn" />
                    <span class="rc-project">{{ store.riskDiagnosis[riskCarouselIdx].projectName }}</span>
                    <span class="rc-desc">{{ store.riskDiagnosis[riskCarouselIdx].description }}</span>
                    <svg class="rc-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </Transition>
              </div>
              <div class="rc-dots">
                <span v-for="(_, i) in store.riskDiagnosis" :key="i" class="rc-dot-indicator" :class="{ active: i === riskCarouselIdx }" @click="riskCarouselIdx = i; startRiskCarousel()" />
              </div>
            </section>

            <!-- ===== MAIN BODY (Enhanced 3-column + bottom) ===== -->
            <div class="exec-body">
              <!-- ===== LEFT COLUMN: 3D Stacked Panels ===== -->
              <div class="exec-left">
                <div class="left-stack-container">
                  <!-- Stack tab bar -->
                  <div class="stack-tabs">
                    <button class="stack-tab" :class="{ active: leftActiveTab === 'trends' }" @click="leftActiveTab = 'trends'">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                      趋势
                    </button>
                    <button class="stack-tab" :class="{ active: leftActiveTab === 'pie' }" @click="leftActiveTab = 'pie'">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                      分布
                    </button>
                    <button class="stack-tab" :class="{ active: leftActiveTab === 'areamap' }" @click="leftActiveTab = 'areamap'">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      区域
                    </button>
                    <button class="stack-tab" :class="{ active: leftActiveTab === 'radar' }" @click="leftActiveTab = 'radar'">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
                      雷达
                    </button>
                  </div>
                  <!-- Stacked cards -->
                  <div class="stack-cards">
                    <div class="panel-card stack-card" :class="{ 'stack-active': leftActiveTab === 'trends', 'stack-behind-1': leftActiveTab !== 'trends', 'is-fullscreen': fsKey === 'trends' }">
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

                    <div class="panel-card stack-card" :class="{ 'stack-active': leftActiveTab === 'pie', 'stack-behind-1': leftActiveTab !== 'pie', 'is-fullscreen': fsKey === 'pie' }">
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

                    <div class="panel-card stack-card" :class="{ 'stack-active': leftActiveTab === 'areamap', 'stack-behind-1': leftActiveTab !== 'areamap', 'is-fullscreen': fsKey === 'areamap' }">
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

                    <div class="panel-card stack-card" :class="{ 'stack-active': leftActiveTab === 'radar', 'stack-behind-1': leftActiveTab !== 'radar', 'is-fullscreen': fsKey === 'radar' }">
                      <div class="panel-toolbar">
                        <span class="panel-title"><span class="pt-bar" />风险雷达<span class="ph-count">六维评估</span></span>
                        <button class="fs-btn" @click="toggleFs('radar')" :title="fsKey === 'radar' ? '退出全屏' : '全屏'">
                          <svg v-if="fsKey !== 'radar'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                          <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6m0 0v6m0-6H4m6 0L4 20M20 10h-6m0 0V4m0 6h6m-6 0L20 4"/></svg>
                        </button>
                      </div>
                      <div class="panel-body">
                        <RiskRadar :data="store.riskRadar" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ===== CENTER COLUMN: Project Health + Prediction ===== -->
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

              <!-- ===== RIGHT COLUMN: Tab Switch (Hot Props / Sales / Gauges / Decision) ===== -->
              <div class="exec-right">
                <div class="right-stack-container">
                  <!-- Right tab bar -->
                  <div class="stack-tabs">
                    <button class="stack-tab" :class="{ active: rightActiveTab === 'hot' }" @click="rightActiveTab = 'hot'">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8v4l3 3"/></svg>
                      楼盘
                    </button>
                    <button class="stack-tab" :class="{ active: rightActiveTab === 'bar' }" @click="rightActiveTab = 'bar'">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="17" y="3" width="4" height="18"/></svg>
                      对比
                    </button>
                    <button class="stack-tab" :class="{ active: rightActiveTab === 'gauges' }" @click="rightActiveTab = 'gauges'">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      指标
                    </button>
                    <button class="stack-tab" :class="{ active: rightActiveTab === 'decision' }" @click="rightActiveTab = 'decision'">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                      决策
                    </button>
                  </div>
                  <!-- Stacked cards -->
                  <div class="stack-cards">
                    <!-- Hot Properties -->
                    <div class="panel-card stack-card" :class="{ 'stack-active': rightActiveTab === 'hot', 'stack-behind-1': rightActiveTab !== 'hot' }">
                      <div class="panel-toolbar">
                        <span class="panel-title"><span class="pt-bar" />热门楼盘<span class="ph-count">浏览量排行</span></span>
                        <span class="hot-fire">🔥</span>
                      </div>
                      <div class="panel-body hot-body">
                        <div v-for="(h, i) in store.hotProperties.slice(0, 5)" :key="h.name" class="hot-row">
                          <span class="hot-rank" :class="{ top: i < 3 }">{{ i + 1 }}</span>
                          <div class="hot-info">
                            <span class="hot-name">{{ h.name.replace('城发投·', '') }}</span>
                            <span class="hot-tag" :style="{ background: h.tagColor + '20', color: h.tagColor }">{{ h.tag }}</span>
                          </div>
                          <div class="hot-views">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            {{ (h.views / 1000).toFixed(1) }}k
                          </div>
                          <span class="hot-growth" :class="h.viewGrowth >= 0 ? 'up' : 'down'">{{ h.viewGrowth >= 0 ? '+' : '' }}{{ h.viewGrowth }}%</span>
                        </div>
                      </div>
                    </div>

                    <!-- Sales Comparison -->
                    <div class="panel-card stack-card" :class="{ 'stack-active': rightActiveTab === 'bar', 'stack-behind-1': rightActiveTab !== 'bar', 'is-fullscreen': fsKey === 'bar' }">
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

                    <!-- Core Gauges -->
                    <div class="panel-card stack-card" :class="{ 'stack-active': rightActiveTab === 'gauges', 'stack-behind-1': rightActiveTab !== 'gauges', 'is-fullscreen': fsKey === 'gauges' }">
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

                    <!-- Decision Recommendations -->
                    <div class="panel-card stack-card" :class="{ 'stack-active': rightActiveTab === 'decision', 'stack-behind-1': rightActiveTab !== 'decision' }">
                      <DecisionRecommendations :items="store.recommendations" @select="openRecommendation" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3D Mode -->
          <div v-else class="exec-3d-layout">
            <div class="side-3d-panel left-3d">
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
              <BossKPI v-bind="store.coreKPI" />
            </div>
            <div class="main-3d-panel">
              <div class="panel-toolbar map-3d-toolbar">
                <span class="panel-title"><span class="pt-bar" />石家庄楼盘3D地图</span>
                <div class="map-3d-legend">
                  <span class="ml3-item"><span class="ml3-dot healthy" />健康</span>
                  <span class="ml3-item"><span class="ml3-dot warning" />关注</span>
                  <span class="ml3-item"><span class="ml3-dot danger" />预警</span>
                </div>
              </div>
              <ChinaMap :show-property-detail="true" :zoom-level="presentMode ? 12 : 8" />
              <!-- KPI overlay -->
              <div class="globe-overlay">
                <div class="overlay-kpi" :class="depletionClass">
                  <span class="ov-label">去化率</span>
                  <span class="ov-value" :style="{ color: depletionColor }">{{ store.coreKPI.depletionRate.toFixed(1) }}<small>%</small></span>
                </div>
                <div class="overlay-kpi primary-kpi">
                  <span class="ov-label">销售额</span>
                  <span class="ov-value" style="color: var(--primary, #60a5fa)">{{ store.coreKPI.totalSales.toFixed(1) }}<small>亿</small></span>
                </div>
                <div class="overlay-kpi" :class="returnClass">
                  <span class="ov-label">回款率</span>
                  <span class="ov-value" :style="{ color: returnColor }">{{ store.coreKPI.returnRate.toFixed(1) }}<small>%</small></span>
                </div>
                <div class="overlay-kpi" :class="inventoryClass">
                  <span class="ov-label">库存</span>
                  <span class="ov-value" :style="{ color: inventoryColor }">{{ store.coreKPI.inventoryUnits }}<small>套</small></span>
                </div>
              </div>
            </div>
            <div class="side-3d-panel right-3d">
              <div class="risk-3d-panel">
                <RiskDiagnosis :risks="store.riskDiagnosis" @select="openRiskDetail" />
              </div>
              <div class="pred-3d-panel">
                <div class="panel-toolbar"><span class="panel-title"><span class="pt-bar" />智能决策建议</span><span class="pred-icon">✦</span></div>
                <div class="pred-3d-body">
                  <div v-for="r in store.recommendations.slice(0, 3)" :key="r.id" class="pred-3d-row" :class="r.priority" @click="openRecommendation(r)">
                    <div class="pred-3d-head">
                      <span class="pred-3d-name">{{ r.title }}</span>
                      <span class="rec-mini-badge" :class="r.priority">{{ r.priority === 'urgent' ? '紧急' : r.priority === 'important' ? '重要' : '建议' }}</span>
                    </div>
                    <div class="pred-3d-vals">
                      <span class="pred-3d-cur">{{ r.category }}</span>
                      <span class="pred-3d-arrow">→</span>
                      <span class="pred-3d-pred" :class="r.priority === 'urgent' ? 'down' : 'up'">{{ r.impact.slice(0, 12) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Page 1-6: Drill-down Pages -->
        <div v-for="page in drillPages" :key="page.key" class="page-slide">
          <div class="slide-content drill-layout">
            <component :is="page.component" :view-mode="themeStore.viewMode" :period="period" />
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
    <DetailModal :visible="!!activeRecommendation" :title="activeRecommendation?.title || '决策建议'" @close="activeRecommendation = null">
      <div v-if="activeRecommendation" class="rec-detail">
        <div class="rec-detail-header">
          <span class="rec-detail-priority" :class="activeRecommendation.priority">
            {{ activeRecommendation.priority === 'urgent' ? '紧急' : activeRecommendation.priority === 'important' ? '重要' : '建议' }}
          </span>
          <span class="rec-detail-category">{{ activeRecommendation.category }}</span>
          <span v-if="activeRecommendation.project" class="rec-detail-project">{{ activeRecommendation.project }}</span>
        </div>
        <div class="rec-detail-desc">{{ activeRecommendation.description }}</div>
        <div class="rec-detail-impact">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>预期效果：{{ activeRecommendation.impact }}</span>
        </div>
      </div>
    </DetailModal>

    <!-- ===== Notification Center (pop-up notifications) ===== -->
    <NotificationCenter />

    <!-- ===== AI Assistant Robot ===== -->
    <AIAssistant v-if="!presentMode" />

    <!-- ===== Presentation Mode Overlay ===== -->
    <Transition name="present">
      <div v-if="presentMode" class="present-overlay" @click.self="togglePresentation">
        <div class="present-top-bar">
          <div class="present-brand">
            <h1 class="brand">SMART<span class="brand-accent">ESTATE</span></h1>
            <span class="present-sub">集团经营决策汇报</span>
          </div>
          <div class="present-info">
            <span class="present-page-indicator">{{ currentPage + 1 }} / {{ pages.length }}</span>
            <span class="present-page-name">{{ pages[currentPage].label }}</span>
            <span class="present-clock">{{ currentTime }}</span>
          </div>
          <button class="present-exit" @click="togglePresentation">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            退出汇报
          </button>
        </div>
        <div class="present-progress-bar">
          <div class="present-progress-fill" :style="{ width: presentProgress + '%' }" />
        </div>

        <!-- Floating navigation arrows -->
        <button v-if="currentPage > 0" class="present-nav-arrow present-nav-left" @click="currentPage--; if (presentAutoEnabled) { presentProgress = 0; startPresentAutoRotate() }">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button v-if="currentPage < pages.length - 1" class="present-nav-arrow present-nav-right" @click="currentPage++; if (presentAutoEnabled) { presentProgress = 0; startPresentAutoRotate() }">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <div class="present-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="15 18 9 12 15 6"/></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span>{{ presentAutoEnabled ? '自动轮播中' : '手动模式' }} · 点击左右切换 · ESC退出</span>
          <button class="present-auto-toggle" @click="togglePresentAuto" :title="presentAutoEnabled ? '暂停自动轮播' : '开启自动轮播'">
            <svg v-if="presentAutoEnabled" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
        </div>
      </div>
    </Transition>

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
import { useSound } from '@/composables/useSound'
import type { ProjectItem, RiskItem, RecommendationItem } from '@/utils/mockData'
import { fluctuate } from '@/utils/mockData'

import InsightBar from '@/components/modules/InsightBar.vue'
import BossKPI from '@/components/modules/BossKPI.vue'
import RiskDiagnosis from '@/components/modules/RiskDiagnosis.vue'
import DecisionRecommendations from '@/components/modules/DecisionRecommendations.vue'
import TargetTracker from '@/components/modules/TargetTracker.vue'
import CombinedTrendChart from '@/components/charts/CombinedTrendChart.vue'
import PieDistribution from '@/components/charts/PieDistribution.vue'
import BarComparison from '@/components/charts/BarComparison.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'
import Globe3D from '@/components/charts/Globe3D.vue'
import ChinaMap from '@/components/charts/ChinaMap.vue'
import RiskRadar from '@/components/charts/RiskRadar.vue'
import DigitalFlipper from '@/components/common/DigitalFlipper.vue'
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue'
import ModeToggle from '@/components/common/ModeToggle.vue'
import FontSizer from '@/components/common/FontSizer.vue'
import PageNav from '@/components/common/PageNav.vue'
import DetailModal from '@/components/common/DetailModal.vue'
import NotificationCenter from '@/components/common/NotificationCenter.vue'
import AIAssistant from '@/components/common/AIAssistant.vue'

const { isMuted, toggleMute, playClickSound, playExpandSound, playHoverSound } = useSound()

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

const pages = ref<PageDef[]>([
  { key: 'dashboard', label: '总览', icon: '◉' },
  { key: 'region', label: '区域对比', icon: '◇', component: RegionPage },
  { key: 'inventory', label: '库存排名', icon: '◻', component: InventoryPage },
  { key: 'channel', label: '项目分析', icon: '⬡', component: ChannelPage },
  { key: 'project', label: '项目深度', icon: '◈', component: ProjectDeepPage },
  { key: 'customer', label: '客户画像', icon: '◎', component: CustomerPage },
  { key: 'funnel', label: '销售漏斗', icon: '▽', component: FunnelPage },
])

const drillPages = computed(() => pages.value.slice(1))

const store = useDashboardStore()
const themeStore = useThemeStore()
const { start, stop } = useAutoRefresh(30000)

// Page navigation
const currentPage = ref(0)
const showSwipeHint = ref(true)

// Fullscreen state
const fsKey = ref<string | null>(null)
const leftActiveTab = ref<'trends' | 'pie' | 'areamap' | 'radar'>('trends')
const rightActiveTab = ref<'hot' | 'bar' | 'gauges' | 'decision'>('hot')

// Presentation Mode
const presentMode = ref(false)
const presentAutoTimer = ref<ReturnType<typeof setInterval> | null>(null)
const presentProgress = ref(0)
const presentAutoEnabled = ref(true)
const PRESENT_INTERVAL = 15000 // 15 seconds per page

// Period selector
const period = ref<'day' | 'week' | 'month' | 'year'>('month')
const periodLabels: Record<string, string> = { day: '日', week: '周', month: '月', year: '年' }
const periodMultiplier = computed(() => {
  const m: Record<string, number> = { day: 0.03, week: 0.23, month: 1, year: 12 }
  return m[period.value] ?? 1
})

// Risk carousel
const riskCarouselIdx = ref(0)
let riskCarouselTimer: ReturnType<typeof setInterval> | null = null

function togglePresentation() {
  presentMode.value = !presentMode.value
  if (presentMode.value) {
    currentPage.value = 0
    presentProgress.value = 0
    if (presentAutoEnabled.value) startPresentAutoRotate()
    playExpandSound()
  } else {
    stopPresentAutoRotate()
  }
}

function startPresentAutoRotate() {
  stopPresentAutoRotate()
  presentProgress.value = 0
  let elapsed = 0
  presentAutoTimer.value = setInterval(() => {
    elapsed += 100
    presentProgress.value = (elapsed / PRESENT_INTERVAL) * 100
    if (elapsed >= PRESENT_INTERVAL) {
      elapsed = 0
      presentProgress.value = 0
      if (currentPage.value < pages.value.length - 1) {
        currentPage.value++
      } else {
        currentPage.value = 0
      }
    }
  }, 100)
}

function stopPresentAutoRotate() {
  if (presentAutoTimer.value) {
    clearInterval(presentAutoTimer.value)
    presentAutoTimer.value = null
  }
  presentProgress.value = 0
}

function togglePresentAuto() {
  presentAutoEnabled.value = !presentAutoEnabled.value
  if (presentAutoEnabled.value) {
    startPresentAutoRotate()
  } else {
    stopPresentAutoRotate()
  }
}

function startRiskCarousel() {
  stopRiskCarousel()
  if (store.riskDiagnosis.length <= 1) return
  riskCarouselTimer = setInterval(() => {
    riskCarouselIdx.value = (riskCarouselIdx.value + 1) % store.riskDiagnosis.length
  }, 4000)
}

function stopRiskCarousel() {
  if (riskCarouselTimer) {
    clearInterval(riskCarouselTimer)
    riskCarouselTimer = null
  }
}

function toggleFs(key: string) {
  fsKey.value = fsKey.value === key ? null : key
  document.body.style.overflow = fsKey.value ? 'hidden' : ''
  if (fsKey.value) playExpandSound()
}

// Handle tab reorder from PageNav
function onReorderPages(newPages: PageDef[]) {
  pages.value = newPages
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

// Period-adjusted KPI values
const adjustedKPI = computed(() => {
  const kpi = store.coreKPI
  const m = periodMultiplier.value
  return {
    depletionRate: kpi.depletionRate,
    totalSales: Number((kpi.totalSales * m).toFixed(1)),
    returnRate: kpi.returnRate,
    inventoryUnits: Math.round(kpi.inventoryUnits / m),
    inventoryValue: Number((kpi.inventoryValue / m).toFixed(1)),
    cashFlow: Number((kpi.cashFlow * m).toFixed(1)),
    profitMargin: kpi.profitMargin,
    momGrowth: Number((kpi.momGrowth * (m < 1 ? 3 : m > 1 ? 0.5 : 1)).toFixed(1)),
  }
})

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
  playClickSound()
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
    if (dx < 0 && currentPage.value < pages.value.length - 1) {
      currentPage.value++
    } else if (dx > 0 && currentPage.value > 0) {
      currentPage.value--
    }
    showSwipeHint.value = false
  }
}

function handleWheel(e: WheelEvent) {
  if (e.deltaX !== 0) {
    if (e.deltaX > 30 && currentPage.value < pages.value.length - 1) {
      currentPage.value++
    } else if (e.deltaX < -30 && currentPage.value > 0) {
      currentPage.value--
    }
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' && currentPage.value < pages.value.length - 1) {
    currentPage.value++
    if (presentMode.value && presentAutoEnabled.value) { presentProgress.value = 0; startPresentAutoRotate() }
  } else if (e.key === 'ArrowLeft' && currentPage.value > 0) {
    currentPage.value--
    if (presentMode.value && presentAutoEnabled.value) { presentProgress.value = 0; startPresentAutoRotate() }
  } else if (e.key === 'Escape') {
    if (fsKey.value) {
      fsKey.value = null
      document.body.style.overflow = ''
    } else if (presentMode.value) {
      togglePresentation()
    }
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

function openRecommendation(item: RecommendationItem) {
  activeRecommendation.value = item
}

const activeRecommendation = ref<RecommendationItem | null>(null)

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
  startRiskCarousel()
})

onUnmounted(() => {
  stop()
  stopPresentAutoRotate()
  stopRiskCarousel()
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

  &.present-active {
    .exec-header { display: none; }
    .dash-main { flex: 1; }
    .target-banner { display: none; }
    .risk-carousel { display: none; }
    .swipe-hint { display: none; }
  }
}

// ===== Header =====
.exec-header {
  height: 56px;
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

.mute-btn {
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
  }

  &.muted {
    color: var(--danger, #EF4444);
    border-color: rgba(239, 68, 68, 0.2);
  }
}

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
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
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

  // 3D depth + hover animation — enhanced
  &:hover {
    transform: perspective(800px) translateY(-6px) scale(1.04) rotateX(2deg);
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45), 0 0 20px rgba(96, 165, 250, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
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

  &.healthy:hover { border-color: var(--success, #22C55E); box-shadow: 0 14px 40px var(--success-light, rgba(34, 197, 94, 0.2)), 0 0 20px rgba(34, 197, 94, 0.1); }
  &.warning:hover { border-color: var(--warning, #F59E0B); box-shadow: 0 14px 40px var(--warning-light, rgba(245, 158, 11, 0.2)), 0 0 20px rgba(245, 158, 11, 0.1); }
  &.danger:hover { border-color: var(--danger, #EF4444); box-shadow: 0 14px 40px var(--danger-light, rgba(239, 68, 68, 0.2)), 0 0 20px rgba(239, 68, 68, 0.1); }
  &.primary:hover { border-color: rgba(96, 165, 250, 0.3); box-shadow: 0 14px 40px var(--primary-light, rgba(96, 165, 250, 0.15)), 0 0 20px rgba(96, 165, 250, 0.08); }
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
  min-height: 0;
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
  min-height: 0;
}

// ===== Panel Card (reusable) — with enhanced 3D depth =====
.panel-card {
  border-radius: 10px;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 1px rgba(96, 165, 250, 0.05);

  // 3D layered depth effect
  transform: perspective(1200px) translateZ(0);
  transform-style: preserve-3d;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }

  &:hover {
    transform: perspective(800px) translateZ(30px) scale(1.03) rotateX(1deg);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(96, 165, 250, 0.06);
    border-color: rgba(96, 165, 250, 0.2);
    z-index: 2;
  }

  &.is-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 200;
    border-radius: 0;
    background: var(--bg, #0F1217);
    transform: none !important;
    box-shadow: none;
    animation: fsEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1);

    .panel-toolbar {
      padding: 14px 20px 8px;
      .panel-title { font-size: 16px; }
    }

    .panel-body {
      flex: 1;
      height: 100%;
      padding: 10px 20px;
      overflow: auto;
    }

    &:hover {
      transform: none !important;
      box-shadow: none;
      border-color: transparent;
    }
  }
}

@keyframes fsEnter {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.exec-left .panel-card { flex: 1; min-height: 0; }
.exec-center .panel-card { height: 100%; }

// ===== 3D Stacked Left Panels =====
.left-stack-container { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.right-stack-container { flex: 1; display: flex; flex-direction: column; min-height: 0; }

.stack-tabs {
  display: flex;
  gap: 2px;
  padding: 4px;
  border-radius: 8px 8px 0 0;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255,255,255,0.06));
  border-bottom: none;
}

.stack-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-caption, #64748b);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;

  &:hover { color: var(--text-body, #cbd5e1); background: rgba(255,255,255,0.04); }

  &.active {
    background: rgba(99, 102, 241, 0.15);
    color: var(--primary, #60a5fa);
    box-shadow: 0 0 8px rgba(99,102,241,0.1);
  }
}

.stack-cards {
  flex: 1;
  position: relative;
  min-height: 0;
  perspective: 1200px;
}

.stack-card {
  position: absolute;
  inset: 0;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center center;
  backface-visibility: hidden;
  border-radius: 0 0 10px 10px;

  &.stack-active {
    opacity: 1;
    transform: translateZ(0) rotateY(0deg) scale(1);
    z-index: 3;
    pointer-events: auto;
  }

  &.stack-behind-1 {
    opacity: 0;
    transform: translateZ(-60px) rotateY(8deg) scale(0.92) translateX(12px);
    z-index: 1;
    pointer-events: none;
  }
}

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
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  &.status-red {
    background: var(--danger-light, rgba(239, 68, 68, 0.15));
    border-color: rgba(239, 68, 68, 0.2);
    &:hover { border-color: var(--danger, #EF4444); box-shadow: 0 8px 24px var(--danger-light); transform: perspective(600px) translateY(-4px) scale(1.04) rotateX(2deg); }
  }
  &.status-yellow {
    background: var(--warning-light, rgba(245, 158, 11, 0.15));
    border-color: rgba(245, 158, 11, 0.2);
    &:hover { border-color: var(--warning, #F59E0B); box-shadow: 0 8px 24px var(--warning-light); transform: perspective(600px) translateY(-4px) scale(1.04) rotateX(2deg); }
  }
  &.status-green {
    background: var(--success-light, rgba(34, 197, 94, 0.15));
    border-color: rgba(34, 197, 94, 0.15);
    &:hover { border-color: var(--success, #22C55E); box-shadow: 0 8px 24px var(--success-light); transform: perspective(600px) translateY(-4px) scale(1.04) rotateX(2deg); }
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
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
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

  &:hover { transform: perspective(600px) translateY(-3px) scale(1.04); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35); }
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

// ===== Risk Alert Carousel =====
.risk-carousel {
  flex-shrink: 0;
  border-radius: 8px;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.rc-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.04));
  svg { color: var(--danger, #EF4444); animation: riskPulse 2s ease-in-out infinite; }
}

.rc-title { font-size: 11px; font-weight: 600; color: var(--text-title, #e2e8f0); flex: 1; }

.rc-count {
  font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 8px; font-family: 'JetBrains Mono', monospace;
  &.danger { background: var(--danger-light, rgba(239,68,68,0.15)); color: var(--danger, #EF4444); }
  &.warn { background: var(--warning-light, rgba(245,158,11,0.15)); color: var(--warning, #F59E0B); }
}

@keyframes riskPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.rc-body {
  padding: 4px 10px;
  min-height: 32px;
  display: flex;
  align-items: center;
}

.rc-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;

  &.severity-danger { background: var(--danger-light, rgba(239,68,68,0.08)); }
  &.severity-warn { background: var(--warning-light, rgba(245,158,11,0.06)); }

  &:hover { transform: translateX(2px); }
}

.rc-pulse {
  width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
  &.danger { background: var(--danger, #EF4444); box-shadow: 0 0 6px var(--danger-light, rgba(239,68,68,0.3)); animation: pulseDanger 2s ease-in-out infinite; }
}

.rc-dot {
  width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
  &.warn { background: var(--warning, #F59E0B); }
}

@keyframes pulseDanger { 0%, 100% { box-shadow: 0 0 4px rgba(239,68,68,0.2); } 50% { box-shadow: 0 0 10px rgba(239,68,68,0.5); } }

.rc-project { font-size: 10px; font-weight: 600; color: var(--text-title, #e2e8f0); white-space: nowrap; }
.rc-desc { font-size: 10px; color: var(--text-caption, #64748b); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rc-arrow { color: var(--text-caption, #64748b); flex-shrink: 0; opacity: 0.5; }

.rc-dots {
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 3px 0 5px;
}

.rc-dot-indicator {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--border, rgba(255,255,255,0.1));
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: var(--primary, #60a5fa);
    box-shadow: 0 0 6px rgba(96, 165, 250, 0.3);
  }

  &:hover { background: var(--text-caption, #64748b); }
}

.rc-slide-enter-active { transition: all 0.3s ease-out; }
.rc-slide-leave-active { transition: all 0.2s ease-in; }
.rc-slide-enter-from { opacity: 0; transform: translateY(6px); }
.rc-slide-leave-to { opacity: 0; transform: translateY(-6px); }

// ===== Period Selector =====
.period-selector {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  border-radius: 8px;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  flex-shrink: 0;
  align-self: center;
}

.period-btn {
  padding: 3px 6px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--text-caption, #64748b);
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;

  &:hover { color: var(--text-body, #cbd5e1); background: rgba(255,255,255,0.04); }

  &.active {
    background: rgba(99, 102, 241, 0.15);
    color: var(--primary, #60a5fa);
    box-shadow: 0 0 6px rgba(99,102,241,0.1);
  }
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
  position: relative;
  display: flex;
  flex-direction: column;
}

.map-3d-toolbar { flex-shrink: 0; }

.map-3d-legend {
  display: flex;
  gap: 10px;
  margin-left: auto;
  margin-right: 8px;
}

.ml3-item { display: flex; align-items: center; gap: 4px; font-size: 10px; color: var(--text-caption, #64748b); }
.ml3-dot { width: 6px; height: 6px; border-radius: 50%;
  &.healthy { background: var(--success, #22C55E); box-shadow: 0 0 4px rgba(34,197,94,0.3); }
  &.warning { background: var(--warning, #F59E0B); box-shadow: 0 0 4px rgba(245,158,11,0.3); }
  &.danger { background: var(--danger, #EF4444); box-shadow: 0 0 4px rgba(239,68,68,0.3); }
}

// ===== Globe Overlay (Core Indicators on 3D) =====
.globe-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  z-index: 5;
  pointer-events: none;
}

.overlay-kpi {
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(15, 18, 23, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: ovFadeIn 0.6s ease-out both;

  &:nth-child(1) { animation-delay: 0.2s; }
  &:nth-child(2) { animation-delay: 0.4s; }
  &:nth-child(3) { animation-delay: 0.6s; }
  &:nth-child(4) { animation-delay: 0.8s; }

  &.healthy { border-left: 2px solid var(--success, #22C55E); }
  &.warning { border-left: 2px solid var(--warning, #F59E0B); }
  &.danger { border-left: 2px solid var(--danger, #EF4444); }
  &.primary-kpi { border-left: 2px solid var(--primary, #60a5fa); }
}

@keyframes ovFadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.ov-label {
  font-size: 9px;
  color: var(--text-caption, #64748b);
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.ov-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;

  small {
    font-size: 10px;
    opacity: 0.6;
    font-weight: 500;
    margin-left: 1px;
  }
}

.side-3d-panel {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trend-3d-panel { flex: 1; min-height: 0; border-radius: 8px; border: 1px solid var(--border); background: var(--card-bg); overflow: hidden; }
.risk-3d-panel { height: 200px; min-height: 140px; border-radius: 8px; border: 1px solid var(--border); background: var(--card-bg); overflow: auto; }

.pred-3d-panel { border-radius: 8px; border: 1px solid var(--border); background: var(--card-bg); flex-shrink: 0; max-height: 200px; overflow-y: auto; }
.pred-3d-body { padding: 6px 10px; display: flex; flex-direction: column; gap: 6px; }
.pred-3d-row { display: flex; flex-direction: column; gap: 2px; padding: 5px 6px; border-radius: 4px; cursor: pointer; transition: all 0.2s;
  &.urgent { background: rgba(239,68,68,0.08); }
  &.important { background: rgba(245,158,11,0.06); }
  &.suggested { background: rgba(96,165,250,0.05); }
  &:hover { transform: translateX(2px); }
}
.pred-3d-head { display: flex; justify-content: space-between; align-items: center; }
.pred-3d-name { font-size: 10px; font-weight: 600; color: var(--text-title, #e2e8f0); }
.rec-mini-badge { font-size: 8px; font-weight: 700; padding: 1px 4px; border-radius: 2px;
  &.urgent { background: rgba(239,68,68,0.2); color: var(--danger, #EF4444); }
  &.important { background: rgba(245,158,11,0.2); color: var(--warning, #F59E0B); }
  &.suggested { background: rgba(96,165,250,0.15); color: var(--primary, #60a5fa); }
}
.pred-3d-vals { display: flex; align-items: center; gap: 4px; font-size: 10px; }
.pred-3d-cur { color: var(--text-caption, #64748b); }
.pred-3d-arrow { color: var(--text-caption, #64748b); }
.pred-3d-pred { font-weight: 600; color: var(--text-body, #cbd5e1); &.up { color: var(--success, #22C55E); } &.down { color: var(--danger, #EF4444); } }

// ===== Hot Properties =====
.hot-fire { font-size: 12px; }
.hot-body { padding: 4px 10px 8px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
.hot-row { display: flex; align-items: center; gap: 6px; padding: 4px 0; transition: all 0.2s; &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } }
.hot-rank { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; width: 18px; text-align: center; color: var(--text-caption, #64748b); &.top { color: var(--warning, #F59E0B); text-shadow: 0 0 6px rgba(245,158,11,0.3); } }
.hot-info { flex: 1; display: flex; align-items: center; gap: 5px; min-width: 0; }
.hot-name { font-size: 11px; font-weight: 600; color: var(--text-title, #e2e8f0); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hot-tag { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 3px; flex-shrink: 0; }
.hot-views { display: flex; align-items: center; gap: 3px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: var(--text-body, #cbd5e1); }
.hot-growth { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; &.up { color: var(--success, #22C55E); } &.down { color: var(--danger, #EF4444); } }

// ===== Decision Recommendations =====

// ===== Recommendation Detail Modal =====
.rec-detail {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rec-detail-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rec-detail-priority {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;

  &.urgent { background: rgba(239, 68, 68, 0.15); color: var(--danger, #EF4444); }
  &.important { background: rgba(245, 158, 11, 0.15); color: var(--warning, #F59E0B); }
  &.suggested { background: rgba(96, 165, 250, 0.15); color: var(--primary, #60a5fa); }
}

.rec-detail-category {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-caption, #64748b);
  padding: 2px 6px;
  background: var(--surface, rgba(255, 255, 255, 0.03));
  border-radius: 3px;
}

.rec-detail-project {
  font-size: 11px;
  color: var(--primary, #60a5fa);
  font-weight: 500;
}

.rec-detail-desc {
  font-size: 13px;
  color: var(--text-body, #cbd5e1);
  line-height: 1.6;
}

.rec-detail-impact {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(34, 197, 94, 0.06);
  border: 1px solid rgba(34, 197, 94, 0.12);
  color: var(--success, #22C55E);
  font-size: 12px;
  font-weight: 500;
}

// ===== Target Banner =====
.target-banner {
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: targetSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes targetSlideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

// ===== Presentation Mode Button =====
.present-btn {
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

  &.active {
    background: var(--primary-light, rgba(96, 165, 250, 0.15));
    border-color: rgba(96, 165, 250, 0.3);
    color: var(--primary, #60a5fa);
    box-shadow: 0 0 12px rgba(96, 165, 250, 0.2);
  }
}

// ===== Presentation Mode Overlay =====
.present-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: transparent;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.present-top-bar {
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: rgba(15, 18, 23, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(96, 165, 250, 0.15);
  pointer-events: auto;
  gap: 20px;
}

.present-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.present-sub {
  font-size: 12px;
  color: var(--text-caption, #64748b);
  letter-spacing: 1px;
  white-space: nowrap;
}

.present-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.present-page-indicator {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: var(--primary, #60a5fa);
}

.present-page-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-title, #e2e8f0);
}

.present-clock {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--text-caption, #64748b);
}

.present-exit {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.08);
  color: var(--danger, #EF4444);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  pointer-events: auto;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: var(--danger, #EF4444);
  }
}

.present-progress-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: auto;
}

.present-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary, #60a5fa), var(--success, #22C55E));
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
}

// ===== Presentation Nav Arrows =====
.present-nav-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 80px;
  border: none;
  background: rgba(96, 165, 250, 0.08);
  backdrop-filter: blur(8px);
  color: rgba(96, 165, 250, 0.5);
  cursor: pointer;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border-radius: 12px;
  z-index: 510;

  &:hover {
    background: rgba(96, 165, 250, 0.18);
    color: rgba(96, 165, 250, 0.9);
    width: 56px;
  }
}

.present-nav-left { left: 16px; border-radius: 0 12px 12px 0; &:hover { border-radius: 0 14px 14px 0; } }
.present-nav-right { right: 16px; border-radius: 12px 0 0 12px; &:hover { border-radius: 14px 0 0 14px; } }

.present-hint {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 20px;
  background: rgba(15, 18, 23, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  color: var(--text-caption, #64748b);
  font-size: 11px;
  pointer-events: auto;
  animation: hintFade 3s ease-in-out infinite;

  svg { color: var(--text-caption, #64748b); opacity: 0.6; }
}

.present-auto-toggle {
  width: 24px; height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: var(--text-caption, #64748b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  margin-left: 4px;

  &:hover {
    background: rgba(96, 165, 250, 0.15);
    color: var(--primary, #60a5fa);
    border-color: rgba(96, 165, 250, 0.2);
  }
}

@keyframes hintFade {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.3; }
}

.present-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.present-leave-active { transition: all 0.3s ease; }
.present-enter-from { opacity: 0; }
.present-leave-to { opacity: 0; }

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
  .mute-btn { width: 24px; height: 24px; }

  .kpi-banner { gap: 4px; }
  .kpi-card { min-width: calc(50% - 4px); padding: 8px 10px; }

  .exec-layout { padding: 6px 8px; gap: 6px; overflow-y: auto; }
  .exec-body { flex-direction: column; gap: 6px; }
  .exec-left, .exec-right { width: 100%; }
  .exec-left .panel-card, .exec-right .panel-card { min-height: 180px; }

  .exec-3d-layout { flex-direction: column; }
  .side-3d-panel { width: 100%; max-height: 200px; }

  .stack-cards { min-height: 250px; }
  .stack-card.stack-behind-1 { transform: none; opacity: 0; }
  .stack-card.stack-active { position: relative; }

  .globe-overlay { grid-template-columns: 1fr 1fr; gap: 4px; }
  .ov-value { font-size: 14px; }
}

@media (max-width: 480px) {
  .kpi-card { min-width: 100%; }
  .area-map-grid { grid-template-columns: 1fr; }
  .gauges-grid { grid-template-columns: 1fr; }
  .globe-overlay { grid-template-columns: 1fr; }
}
</style>

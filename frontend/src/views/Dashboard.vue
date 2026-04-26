<template>
  <div class="dashboard" :class="{ 'present-active': presentMode }" :style="{ zoom: themeStore.fontScale }">
    <!-- ===== 总览级入场特效 ===== -->
    <Teleport to="body">
      <Transition name="dash-cosmic">
        <div v-if="showDashEntrance" class="dash-entrance-overlay">
          <!-- 数据矩阵雨 Canvas -->
          <canvas ref="matrixCanvas" class="matrix-canvas" />

          <!-- 天际线剪影 -->
          <div class="skyline-silhouette">
            <svg viewBox="0 0 1920 200" preserveAspectRatio="none" class="skyline-svg">
              <path d="M0,200 L0,160 L40,160 L40,120 L60,120 L60,90 L80,90 L80,120 L100,120 L100,140 L120,140 L120,100 L130,100 L130,70 L140,70 L140,100 L160,100 L160,130 L200,130 L200,80 L210,80 L210,50 L220,50 L220,80 L240,80 L240,120 L280,120 L280,90 L290,90 L290,55 L300,55 L300,90 L320,90 L320,110 L360,110 L360,70 L370,70 L370,40 L380,35 L390,40 L390,70 L420,70 L420,100 L460,100 L460,60 L470,60 L470,30 L480,25 L490,30 L490,60 L520,60 L520,95 L560,95 L560,75 L570,75 L570,45 L580,45 L580,75 L620,75 L620,105 L660,105 L660,65 L670,65 L670,35 L680,30 L690,35 L690,65 L720,65 L720,100 L760,100 L760,85 L770,85 L770,55 L780,55 L780,85 L820,85 L820,110 L860,110 L860,70 L870,70 L870,40 L880,35 L890,40 L890,70 L920,70 L920,105 L960,105 L960,80 L970,80 L970,50 L980,50 L980,80 L1020,80 L1020,115 L1060,115 L1060,75 L1070,75 L1070,45 L1080,40 L1090,45 L1090,75 L1120,75 L1120,100 L1160,100 L1160,85 L1170,85 L1170,55 L1180,55 L1180,85 L1220,85 L1220,110 L1260,110 L1260,65 L1270,65 L1270,35 L1280,30 L1290,35 L1290,65 L1320,65 L1320,95 L1360,95 L1360,80 L1370,80 L1370,50 L1380,50 L1380,80 L1420,80 L1420,120 L1460,120 L1460,70 L1470,70 L1470,40 L1480,35 L1490,40 L1490,70 L1520,70 L1520,105 L1560,105 L1560,90 L1570,90 L1570,60 L1580,60 L1580,90 L1620,90 L1620,115 L1660,115 L1660,75 L1670,75 L1670,45 L1680,40 L1690,45 L1690,75 L1720,75 L1720,100 L1760,100 L1760,130 L1800,130 L1800,90 L1810,90 L1810,60 L1820,55 L1830,60 L1830,90 L1860,90 L1860,140 L1920,140 L1920,200 Z"
                fill="rgba(15, 20, 30, 0.9)" />
              <path d="M0,200 L0,170 L60,170 L60,145 L100,145 L100,165 L140,165 L140,135 L160,135 L160,155 L200,155 L200,120 L220,120 L220,145 L260,145 L260,160 L300,160 L300,130 L320,130 L320,150 L360,150 L360,125 L380,125 L380,148 L420,148 L420,115 L440,115 L440,140 L480,140 L480,155 L520,155 L520,128 L540,128 L540,150 L580,150 L580,120 L600,120 L600,145 L640,145 L640,160 L680,160 L680,135 L700,135 L700,155 L740,155 L740,125 L760,125 L760,148 L800,148 L800,165 L840,165 L840,138 L860,138 L860,158 L900,158 L900,130 L920,130 L920,152 L960,152 L960,170 L1000,170 L1000,142 L1020,142 L1020,162 L1060,162 L1060,135 L1080,135 L1080,155 L1120,155 L1120,168 L1160,168 L1160,140 L1180,140 L1180,160 L1220,160 L1220,175 L1260,175 L1260,148 L1280,148 L1280,168 L1320,168 L1320,145 L1340,145 L1340,165 L1380,165 L1380,180 L1420,180 L1420,152 L1440,152 L1440,172 L1480,172 L1480,148 L1500,148 L1500,168 L1540,168 L1540,185 L1580,185 L1580,158 L1600,158 L1600,175 L1640,175 L1640,150 L1660,150 L1660,170 L1700,170 L1700,188 L1740,188 L1740,162 L1760,162 L1760,180 L1800,180 L1800,165 L1820,165 L1820,182 L1860,182 L1860,175 L1900,175 L1900,190 L1920,190 L1920,200 Z"
                fill="rgba(10, 14, 22, 0.95)" />
            </svg>
          </div>

          <!-- 旋转指标环 -->
          <div class="kpi-orbit-ring orbit-1" :style="{ opacity: orbitOpacity }">
            <span v-for="(kpi, i) in orbitKPIs1" :key="'o1'+i" class="orbit-kpi" :style="{ transform: `rotate(${i * 60}deg) translateY(-180px) rotate(${-i * 60}deg)` }">{{ kpi }}</span>
          </div>
          <div class="kpi-orbit-ring orbit-2" :style="{ opacity: orbitOpacity }">
            <span v-for="(kpi, i) in orbitKPIs2" :key="'o2'+i" class="orbit-kpi orbit-kpi-sm" :style="{ transform: `rotate(${i * 45}deg) translateY(-260px) rotate(${-i * 45}deg)` }">{{ kpi }}</span>
          </div>
          <div class="kpi-orbit-ring orbit-3" :style="{ opacity: orbitOpacity }">
            <span v-for="(kpi, i) in orbitKPIs3" :key="'o3'+i" class="orbit-kpi orbit-kpi-xs" :style="{ transform: `rotate(${i * 36}deg) translateY(-340px) rotate(${-i * 36}deg)` }">{{ kpi }}</span>
          </div>

          <!-- 飞入的KPI指标卡 -->
          <div v-for="kpi in flyingKPIs" :key="'k'+kpi.id" class="flying-kpi-card"
            :style="{
              left: kpi.startX + 'px',
              top: kpi.startY + 'px',
              transform: `translate(${kpi.tx}px, ${kpi.ty}px) scale(${kpi.scale})`,
              opacity: kpi.opacity,
              transition: `all ${kpi.dur}ms cubic-bezier(0.16, 1, 0.3, 1) ${kpi.delay}ms`,
            }"
          >
            <span class="fkpi-label">{{ kpi.label }}</span>
            <span class="fkpi-value" :style="{ color: kpi.color }">{{ kpi.value }}</span>
          </div>

          <!-- 聚合核心 -->
          <div class="convergence-core" :style="{ opacity: coreOpacity, transform: coreTransform }">
            <div class="core-ring core-ring-1" />
            <div class="core-ring core-ring-2" />
            <div class="core-ring core-ring-3" />
            <div class="core-glow" />
          </div>

          <!-- 爆炸冲击波 -->
          <div class="explosion-wave" :style="{ opacity: explosionOpacity, transform: explosionTransform }" />

          <!-- 爆炸碎片粒子 -->
          <div v-for="p in explosionParticles" :key="'e'+p.id" class="explosion-particle"
            :style="{
              left: '50%', top: '50%',
              width: p.size + 'px', height: p.size + 'px',
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              transform: `translate(-50%, -50%) translate(${p.tx}px, ${p.ty}px) scale(${p.scale})`,
              opacity: p.opacity,
              transition: `all ${p.dur}ms cubic-bezier(0.22, 1, 0.36, 1) ${p.delay}ms`,
            }"
          />

          <!-- 科技网格 -->
          <div class="tech-grid-overlay" :style="{ opacity: techGridOpacity }">
            <svg viewBox="0 0 1200 600" class="tech-grid-svg">
              <defs>
                <pattern id="circuitPat" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0,40 L30,40 L30,20 L50,20 L50,40 L80,40" fill="none" stroke="rgba(251,191,36,0.06)" stroke-width="0.5"/>
                  <path d="M40,0 L40,30 L20,30 L20,50 L40,50 L40,80" fill="none" stroke="rgba(96,165,250,0.06)" stroke-width="0.5"/>
                  <circle cx="30" cy="40" r="2" fill="rgba(251,191,36,0.1)"/>
                  <circle cx="50" cy="20" r="1.5" fill="rgba(96,165,250,0.08)"/>
                </pattern>
              </defs>
              <rect width="1200" height="600" fill="url(#circuitPat)"/>
            </svg>
          </div>

          <!-- 主标题区 -->
          <div class="dash-title-area" :style="{ opacity: dashTitleOpacity, transform: dashTitleTransform }">
            <div class="dash-badge">REAL-TIME COMMAND CENTER</div>
            <div class="dash-main-title">
              <span v-for="(ch, i) in dashTitleChars" :key="i" class="dash-title-char" :style="{ animationDelay: (i * 70) + 'ms' }">{{ ch }}</span>
            </div>
            <div class="dash-sub-title">SMART ESTATE · 集团决策驾驶舱</div>
            <div class="dash-kpi-preview">
              <div v-for="k in previewKPIs" :key="k.label" class="dkp-item" :style="{ '--dkp-color': k.color }">
                <span class="dkp-val" :style="{ color: k.color }">{{ k.displayValue }}</span>
                <span class="dkp-label">{{ k.label }}</span>
              </div>
            </div>
            <!-- 加载进度 -->
            <div class="dash-progress">
              <div class="dash-progress-bar" :style="{ width: dashScanProgress + '%' }" />
            </div>
            <div class="dash-percent">{{ Math.round(dashScanProgress) }}% SYSTEM READY</div>
          </div>

          <!-- 角落HUD装饰 -->
          <div class="hud-corner hud-tl"><span /><span /><span>SYS:ONLINE</span></div>
          <div class="hud-corner hud-tr"><span /><span /><span>v3.2.1</span></div>
          <div class="hud-corner hud-bl"><span /><span /><span>DATA:LIVE</span></div>
          <div class="hud-corner hud-br"><span /><span /><span>NET:OK</span></div>
        </div>
      </Transition>
    </Teleport>

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
    <main class="dash-main" :class="{ 'page-transitioning': isPageTransitioning }">
      <div class="page-slider" :style="{ transform: `translateX(-${currentPage * 100}%)` }">
        <!-- Page 0: Executive Dashboard -->
        <div class="page-slide">
          <!-- 2D Mode -->
          <div v-if="!themeStore.is3D" class="exec-layout" :class="'layout-' + layoutTemplate">

            <!-- ===== Layout Template Switcher ===== -->
            <div class="layout-switcher">
              <button v-for="t in layoutTemplates" :key="t.key" class="layout-btn" :class="{ active: layoutTemplate === t.key }" @click="switchLayout(t.key)" :title="t.label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <template v-if="t.key === 'classic'"><rect x="2" y="2" width="5" height="20" rx="1"/><rect x="8" y="2" width="10" height="20" rx="1"/><rect x="19" y="2" width="4" height="20" rx="1"/></template>
                  <template v-else-if="t.key === 'focus'"><rect x="1" y="2" width="3" height="20" rx="0.5" opacity="0.5"/><rect x="5" y="2" width="14" height="20" rx="1" stroke-width="2"/><rect x="20" y="2" width="3" height="20" rx="0.5" opacity="0.5"/></template>
                  <template v-else-if="t.key === 'dual'"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="12" y="2" width="10" height="9" rx="1"/><rect x="2" y="12" width="20" height="10" rx="1"/></template>
                  <template v-else-if="t.key === 'grid'"><rect x="2" y="2" width="6" height="20" rx="1"/><rect x="9" y="2" width="6" height="20" rx="1"/><rect x="16" y="2" width="6" height="20" rx="1"/></template>
                </svg>
                <span>{{ t.label }}</span>
              </button>
            </div>

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

              <div class="kpi-card" :class="adjustedKPI.profitMargin >= 12 ? 'healthy' : adjustedKPI.profitMargin >= 8 ? 'warning' : 'danger'" @click="openKPIDetail({ label: '利润率', value: adjustedKPI.profitMargin, color: adjustedKPI.profitMargin >= 12 ? 'var(--success)' : adjustedKPI.profitMargin >= 8 ? 'var(--warning)' : 'var(--danger)' })">
                <div class="kpi-label">利润率</div>
                <div class="kpi-main">
                  <DigitalFlipper :value="adjustedKPI.profitMargin" :decimals="1" :size="34" :color="adjustedKPI.profitMargin >= 12 ? 'var(--success)' : adjustedKPI.profitMargin >= 8 ? 'var(--warning)' : 'var(--danger)'" />
                  <span class="kpi-unit" :style="{ color: adjustedKPI.profitMargin >= 12 ? 'var(--success)' : adjustedKPI.profitMargin >= 8 ? 'var(--warning)' : 'var(--danger)' }">%</span>
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
                        <div class="hot-auto-indicator" :class="{ spinning: hotAutoRefresh }" @click="hotAutoRefresh = !hotAutoRefresh" :title="hotAutoRefresh ? '自动刷新中' : '点击开启自动刷新'">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                        </div>
                        <span class="hot-fire">🔥</span>
                      </div>
                      <div class="panel-body hot-body">
                        <TransitionGroup name="hot-list" tag="div">
                          <div v-for="(h, i) in displayedHotProperties" :key="h.name + '-' + i" class="hot-row" :class="{ 'hot-rank-change': h._rankChanged }">
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
                        </TransitionGroup>
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
        <div v-for="(page, idx) in drillPages" :key="page.key" class="page-slide">
          <div class="slide-content drill-layout">
            <component :is="page.component" :view-mode="themeStore.viewMode" :period="period" :is-active="currentPage === idx + 1" />
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
import { onMounted, onUnmounted, ref, computed, defineAsyncComponent, markRaw, watch, nextTick, type Component } from 'vue'
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
const Globe3D = defineAsyncComponent(() => import('@/components/charts/Globe3D.vue'))
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

// ⛔ 受限页面：不允许在驾驶舱内滑动访问，只能从首页进入
const RESTRICTED_PAGES = ['aiengine', 'staff']

const drillPages = computed(() => pages.value.slice(1))

const store = useDashboardStore()
const themeStore = useThemeStore()
const { start, stop } = useAutoRefresh(30000)

// Page navigation
const currentPage = ref(0)
const showSwipeHint = ref(true)
const isPageTransitioning = ref(false)

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

// Layout template
type LayoutTemplate = 'classic' | 'focus' | 'dual' | 'grid'
const layoutTemplate = ref<LayoutTemplate>('classic')
const layoutTemplates = [
  { key: 'classic' as LayoutTemplate, label: '经典三栏' },
  { key: 'focus' as LayoutTemplate, label: '影院模式' },
  { key: 'dual' as LayoutTemplate, label: '上下分屏' },
  { key: 'grid' as LayoutTemplate, label: '监控大屏' },
]

function switchLayout(key: LayoutTemplate) {
  layoutTemplate.value = key
  playClickSound()
}

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

// Handle tab reorder from PageNav — 阻止受限页面混入
function onReorderPages(newPages: PageDef[]) {
  pages.value = newPages.filter(p => !RESTRICTED_PAGES.includes(p.key))
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
// 规则：累计性指标（销售额、回款、库存、现金流）不做周期倍率；增量性指标（今日成交、环比增长）做周期缩放
const adjustedKPI = computed(() => {
  const kpi = store.coreKPI
  const p = period.value
  // 仅增量指标按周期缩放
  const todayDealMap: Record<string, number> = { day: kpi.todayDeals, week: Math.round(kpi.todayDeals * 5), month: kpi.monthDeals, year: Math.round(kpi.monthDeals * 12) }
  const momGrowthMap: Record<string, number> = { day: Number((kpi.momGrowth * 3).toFixed(1)), week: Number((kpi.momGrowth * 1.5).toFixed(1)), month: kpi.momGrowth, year: Number((kpi.momGrowth * 0.5).toFixed(1)) }
  return {
    depletionRate: kpi.depletionRate,
    totalSales: kpi.totalSales,
    returnRate: kpi.returnRate,
    inventoryUnits: kpi.inventoryUnits,
    inventoryValue: kpi.inventoryValue,
    cashFlow: kpi.cashFlow,
    profitMargin: kpi.profitMargin,
    todayDeals: todayDealMap[p] ?? kpi.todayDeals,
    monthDeals: kpi.monthDeals,
    momGrowth: momGrowthMap[p] ?? kpi.momGrowth,
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

// Bar chart data - top 6 projects by sales (salesAmount 单位为亿)
const barProjects = computed(() => store.projectMatrix.slice(0, 6).map(p => p.name.replace('城发投·', '')))
const barTarget = computed(() => store.projectMatrix.slice(0, 6).map(() => fluctuate(15, 3)))
const barActual = computed(() => store.projectMatrix.slice(0, 6).map(p => Number(p.salesAmount.toFixed(1))))

// Hot properties auto-refresh ranking
const hotAutoRefresh = ref(true)
const hotRefreshTimer = ref<ReturnType<typeof setInterval> | null>(null)
const displayedHotProperties = ref(store.hotProperties.slice(0, 5).map(h => ({ ...h, _rankChanged: false })))

function refreshHotRanking() {
  const newRanking = [...store.hotProperties].sort((a, b) => b.views + Math.random() * 200 - 100 - (a.views + Math.random() * 200 - 100)).slice(0, 5)
  const oldNames = displayedHotProperties.value.map(h => h.name)
  displayedHotProperties.value = newRanking.map(h => ({
    ...h,
    views: h.views + Math.floor(Math.random() * 80 - 20),
    _rankChanged: !oldNames.includes(h.name) || oldNames.indexOf(h.name) !== newRanking.indexOf(h),
  }))
  setTimeout(() => {
    displayedHotProperties.value.forEach(h => { h._rankChanged = false })
  }, 800)
}

function startHotRefresh() {
  stopHotRefresh()
  if (!hotAutoRefresh.value) return
  hotRefreshTimer.value = setInterval(refreshHotRanking, 5000)
}

function stopHotRefresh() {
  if (hotRefreshTimer.value) {
    clearInterval(hotRefreshTimer.value)
    hotRefreshTimer.value = null
  }
}

watch(hotAutoRefresh, (v) => {
  if (v) { startHotRefresh() } else { stopHotRefresh() }
})

// Area map data
const areaMapData = computed(() => {
  const areas = [
    { name: '裕华区', level: 'healthy' as const },
    { name: '长安区', level: 'warning' as const },
    { name: '桥西区', level: 'warning' as const },
    { name: '新华区', level: 'healthy' as const },
    { name: '鹿泉区', level: 'danger' as const },
    { name: '高新区', level: 'danger' as const },
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
  const target = pages.value[idx]
  if (!target || RESTRICTED_PAGES.includes(target.key)) return
  if (idx === currentPage.value) return
  isPageTransitioning.value = true
  currentPage.value = idx
  showSwipeHint.value = false
  playClickSound()
  setTimeout(() => { isPageTransitioning.value = false }, 650)
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
      isPageTransitioning.value = true
      setTimeout(() => { isPageTransitioning.value = false }, 650)
    } else if (dx > 0 && currentPage.value > 0) {
      currentPage.value--
      isPageTransitioning.value = true
      setTimeout(() => { isPageTransitioning.value = false }, 650)
    }
    showSwipeHint.value = false
  }
}

function handleWheel(e: WheelEvent) {
  if (e.deltaX !== 0) {
    if (e.deltaX > 30 && currentPage.value < pages.value.length - 1) {
      currentPage.value++
      isPageTransitioning.value = true
      setTimeout(() => { isPageTransitioning.value = false }, 650)
    } else if (e.deltaX < -30 && currentPage.value > 0) {
      currentPage.value--
      isPageTransitioning.value = true
      setTimeout(() => { isPageTransitioning.value = false }, 650)
    }
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' && currentPage.value < pages.value.length - 1) {
    currentPage.value++
    isPageTransitioning.value = true
    setTimeout(() => { isPageTransitioning.value = false }, 650)
    if (presentMode.value && presentAutoEnabled.value) { presentProgress.value = 0; startPresentAutoRotate() }
  } else if (e.key === 'ArrowLeft' && currentPage.value > 0) {
    currentPage.value--
    isPageTransitioning.value = true
    setTimeout(() => { isPageTransitioning.value = false }, 650)
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

// ===== 总览级入场特效 =====
const showDashEntrance = ref(false)
const dashScanProgress = ref(0)
const orbitOpacity = ref(0)
const coreOpacity = ref(0)
const coreTransform = ref('scale(0.3)')
const explosionOpacity = ref(0)
const explosionTransform = ref('translate(-50%, -50%) scale(0)')
const techGridOpacity = ref(0)
const dashTitleOpacity = ref(0)
const dashTitleTransform = ref('scale(0.8) translateY(20px)')
const matrixCanvas = ref<HTMLCanvasElement | null>(null)
let dashAnimFrameId = 0
let matrixAnimId = 0

const dashTitleText = '智慧地产决策中枢'
const dashTitleChars = dashTitleText.split('')

const orbitKPIs1 = ['去化率 68.5%', '销售额 12.8亿', '回款率 82.3%', '库存 2,847套', '现金流 8.6亿', '利润率 15.2%']
const orbitKPIs2 = ['环比+5.3%', '月成交186套', '均价1.2万/㎡', '来访2,430组', '转化率8.6%', '老带新22%', '自渠18.5%', '分销10.8%']
const orbitKPIs3 = ['裕华区28%', '长安区25%', '桥西区20%', '刚需38%', '改善28%', '投资15%', '商铺10%', '回款+3.2%', '库存-120', '目标92%']

const previewKPIs = computed(() => [
  { label: '去化率', displayValue: adjustedKPI.value.depletionRate.toFixed(1) + '%', color: depletionColor.value },
  { label: '销售额', displayValue: adjustedKPI.value.totalSales.toFixed(1) + '亿', color: 'var(--primary)' },
  { label: '回款率', displayValue: adjustedKPI.value.returnRate.toFixed(1) + '%', color: returnColor.value },
  { label: '库存', displayValue: adjustedKPI.value.inventoryUnits + '套', color: inventoryColor.value },
  { label: '利润率', displayValue: adjustedKPI.value.profitMargin.toFixed(1) + '%', color: 'var(--success)' },
])

interface FlyingKPI {
  id: number; label: string; value: string; color: string;
  startX: number; startY: number; tx: number; ty: number; scale: number; opacity: number; dur: number; delay: number
}
const flyingKPIs = ref<FlyingKPI[]>([])

function generateFlyingKPIs() {
  const kpis = [
    { label: '去化率', value: '68.5%', color: '#22C55E' },
    { label: '累计销售', value: '12.8亿', color: '#60a5fa' },
    { label: '回款率', value: '82.3%', color: '#00d68f' },
    { label: '库存套数', value: '2,847', color: '#ffab00' },
    { label: '现金流', value: '8.6亿', color: '#f472b6' },
    { label: '利润率', value: '15.2%', color: '#a78bfa' },
    { label: '环比增长', value: '+5.3%', color: '#00e5ff' },
    { label: '月成交', value: '186套', color: '#38bdf8' },
    { label: '均价', value: '1.2万/㎡', color: '#fbbf24' },
    { label: '来访量', value: '2,430组', color: '#fb923c' },
    { label: '转化率', value: '8.6%', color: '#34d399' },
    { label: '目标完成', value: '92%', color: '#818cf8' },
  ]
  const arr: FlyingKPI[] = []
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  for (let i = 0; i < kpis.length; i++) {
    const angle = (Math.PI * 2 * i) / kpis.length + (Math.random() - 0.5) * 0.6
    const startDist = 600 + Math.random() * 500
    const startX = cx + Math.cos(angle) * startDist
    const startY = cy + Math.sin(angle) * startDist
    arr.push({
      id: i,
      ...kpis[i],
      startX,
      startY,
      tx: cx - startX,
      ty: cy - startY,
      scale: 0,
      opacity: 0.9,
      dur: 1000 + Math.random() * 800,
      delay: 400 + i * 80,
    })
  }
  flyingKPIs.value = arr
}

interface ExplosionParticle {
  id: number; size: number; color: string; tx: number; ty: number; scale: number; opacity: number; dur: number; delay: number
}
const explosionParticles = ref<ExplosionParticle[]>([])

function generateExplosionParticles() {
  const colors = ['#fbbf24', '#60a5fa', '#00e5ff', '#f472b6', '#00d68f', '#ffab00', '#818cf8', '#38bdf8', '#ef4444', '#34d399']
  const arr: ExplosionParticle[] = []
  for (let i = 0; i < 100; i++) {
    const angle = (Math.PI * 2 * i) / 100 + (Math.random() - 0.5) * 0.8
    const dist = 250 + Math.random() * 600
    arr.push({
      id: i,
      size: 2 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      scale: 0.5 + Math.random() * 1.5,
      opacity: 0.8 + Math.random() * 0.2,
      dur: 800 + Math.random() * 1200,
      delay: Math.random() * 300,
    })
  }
  explosionParticles.value = arr
}

// 数据矩阵雨
interface MatrixDrop { x: number; y: number; speed: number; chars: string[]; charIdx: number; len: number }
let matrixDrops: MatrixDrop[] = []

function initMatrixDrops() {
  const cols = Math.floor(window.innerWidth / 18)
  const realEstateChars = '去化率销售额回款库存现金流利润环比成交均价来访转化目标裕华长安桥西刚需改善投资商铺0123456789%亿套/㎡¥'
  matrixDrops = []
  for (let i = 0; i < cols; i++) {
    const len = 8 + Math.floor(Math.random() * 20)
    const chars: string[] = []
    for (let j = 0; j < len; j++) {
      chars.push(realEstateChars[Math.floor(Math.random() * realEstateChars.length)])
    }
    matrixDrops.push({
      x: i * 18,
      y: Math.random() * -500,
      speed: 2 + Math.random() * 6,
      chars,
      charIdx: Math.floor(Math.random() * len),
      len,
    })
  }
}

function animateMatrix() {
  const canvas = matrixCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  ctx.fillStyle = 'rgba(4, 6, 14, 0.12)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (const d of matrixDrops) {
    for (let i = 0; i < d.len; i++) {
      const y = d.y - i * 18
      if (y < -18 || y > canvas.height + 18) continue
      const alpha = i === 0 ? 1 : Math.max(0.05, 1 - i / d.len)
      if (i === 0) {
        ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`
        ctx.font = 'bold 14px JetBrains Mono, monospace'
      } else {
        ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.6})`
        ctx.font = '13px JetBrains Mono, monospace'
      }
      ctx.fillText(d.chars[(d.charIdx + i) % d.len], d.x, y)
    }
    d.y += d.speed
    if (d.y - d.len * 18 > canvas.height) {
      d.y = Math.random() * -200
      d.charIdx = Math.floor(Math.random() * d.len)
    }
    // randomly mutate a char
    if (Math.random() < 0.03) {
      const realEstateChars = '去化率销售额回款库存现金流利润环比成交均价来访转化目标裕华长安桥西刚需改善投资商铺0123456789%亿套/㎡¥'
      d.chars[d.charIdx] = realEstateChars[Math.floor(Math.random() * realEstateChars.length)]
    }
  }

  matrixAnimId = requestAnimationFrame(animateMatrix)
}

const dashEntrancePlayed = ref(false)

function playDashEntrance() {
  if (dashEntrancePlayed.value) return
  dashEntrancePlayed.value = true
  generateFlyingKPIs()
  generateExplosionParticles()
  initMatrixDrops()
  showDashEntrance.value = true
  dashScanProgress.value = 0
  orbitOpacity.value = 0
  coreOpacity.value = 0
  coreTransform.value = 'scale(0.3)'
  explosionOpacity.value = 0
  explosionTransform.value = 'translate(-50%, -50%) scale(0)'
  techGridOpacity.value = 0
  dashTitleOpacity.value = 0
  dashTitleTransform.value = 'scale(0.8) translateY(20px)'

  nextTick(() => animateMatrix())

  const startTime = performance.now()
  const totalDuration = 4200

  // 阶段1: 0-1000ms 矩阵雨 + KPI从四周飞入
  // 阶段2: 1000-2200ms KPI聚合到中心 + 旋转指标环 + 核心形成
  // 阶段3: 2200-3000ms 核心爆炸 + 冲击波 + 碎片粒子
  // 阶段4: 2800-3800ms 科技网格 + 标题显现
  // 阶段5: 3800-4200ms 淡出

  function tick(now: number) {
    const elapsed = now - startTime

    // 扫描进度 (0-3800ms)
    const scanT = Math.min(elapsed / 3800, 1)
    dashScanProgress.value = (1 - Math.pow(1 - scanT, 3)) * 100

    // 旋转指标环 (300ms+)
    if (elapsed > 300) {
      const ot = Math.min((elapsed - 300) / 1000, 1)
      orbitOpacity.value = ot < 0.7 ? ot / 0.7 * 0.8 : 0.8 * (1 - (ot - 0.7) / 0.3)
    }

    // 聚合核心 (1000ms+)
    if (elapsed > 1000) {
      const ct = Math.min((elapsed - 1000) / 800, 1)
      const eased = 1 - Math.pow(1 - ct, 3)
      coreOpacity.value = eased < 0.8 ? eased / 0.8 : 1 - (eased - 0.8) / 0.2
      coreTransform.value = `scale(${0.3 + eased * 2.2})`
    }

    // 爆炸 (2200ms+)
    if (elapsed > 2200) {
      const et = Math.min((elapsed - 2200) / 600, 1)
      explosionOpacity.value = et < 0.3 ? et / 0.3 : Math.max(0, 1 - (et - 0.3) / 0.7)
      explosionTransform.value = `translate(-50%, -50%) scale(${et * 8})`
    }

    // 科技网格 (2000ms+)
    if (elapsed > 2000) {
      const gt = Math.min((elapsed - 2000) / 1000, 1)
      techGridOpacity.value = gt < 0.6 ? gt / 0.6 * 0.5 : 0.5 * (1 - (gt - 0.6) / 0.4)
    }

    // 标题 (2800ms+)
    if (elapsed > 2800) {
      const tt = Math.min((elapsed - 2800) / 800, 1)
      const eased = 1 - Math.pow(1 - tt, 3)
      dashTitleOpacity.value = eased
      dashTitleTransform.value = `scale(${0.8 + eased * 0.2}) translateY(${20 - eased * 20}px)`
    }

    if (elapsed < totalDuration) {
      dashAnimFrameId = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(matrixAnimId)
      setTimeout(() => {
        showDashEntrance.value = false
      }, 300)
    }
  }

  dashAnimFrameId = requestAnimationFrame(tick)
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
  startRiskCarousel()
  startHotRefresh()
  // 总览入场特效
  nextTick(() => playDashEntrance())
})

onUnmounted(() => {
  stop()
  stopPresentAutoRotate()
  stopRiskCarousel()
  stopHotRefresh()
  if (clockTimer) clearInterval(clockTimer)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('keydown', handleKeydown)
  cancelAnimationFrame(dashAnimFrameId)
  cancelAnimationFrame(matrixAnimId)
})
</script>

<style scoped lang="scss">
// ===== 总览级入场特效 =====
.dash-entrance-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #040610;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.matrix-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

// 天际线
.skyline-silhouette {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 180px;
  z-index: 2;
  pointer-events: none;
  opacity: 0.6;
}

.skyline-svg {
  width: 100%;
  height: 100%;
}

// 旋转指标环
.kpi-orbit-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  z-index: 3;
  pointer-events: none;
}

.orbit-1 {
  animation: orbitSpin 12s linear infinite;
}

.orbit-2 {
  animation: orbitSpin 18s linear infinite reverse;
}

.orbit-3 {
  animation: orbitSpin 25s linear infinite;
}

@keyframes orbitSpin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.orbit-kpi {
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(251, 191, 36, 0.6);
  padding: 3px 10px;
  border: 1px solid rgba(251, 191, 36, 0.15);
  border-radius: 4px;
  background: rgba(251, 191, 36, 0.04);
  transform-origin: 0 0;

  &.orbit-kpi-sm {
    font-size: 9px;
    color: rgba(96, 165, 250, 0.5);
    border-color: rgba(96, 165, 250, 0.12);
    background: rgba(96, 165, 250, 0.03);
    padding: 2px 8px;
  }

  &.orbit-kpi-xs {
    font-size: 8px;
    color: rgba(0, 229, 255, 0.4);
    border-color: rgba(0, 229, 255, 0.1);
    background: rgba(0, 229, 255, 0.02);
    padding: 2px 6px;
  }
}

// 飞入KPI卡片
.flying-kpi-card {
  position: absolute;
  z-index: 5;
  pointer-events: none;
  padding: 8px 14px;
  border-radius: 8px;
  background: rgba(15, 18, 25, 0.85);
  border: 1px solid rgba(251, 191, 36, 0.2);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 2px;
  will-change: transform, opacity;
  transition-property: transform, opacity;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.08), 0 4px 12px rgba(0, 0, 0, 0.4);
}

.fkpi-label {
  font-size: 9px;
  color: #64748b;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'JetBrains Mono', monospace;
}

.fkpi-value {
  font-size: 18px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

// 聚合核心
.convergence-core {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  pointer-events: none;
  will-change: transform, opacity;
}

.core-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid;
}

.core-ring-1 {
  width: 120px;
  height: 120px;
  border-color: rgba(251, 191, 36, 0.4);
  animation: coreRingPulse 1.2s ease-in-out infinite alternate;
  box-shadow: 0 0 40px rgba(251, 191, 36, 0.2), inset 0 0 30px rgba(251, 191, 36, 0.05);
}

.core-ring-2 {
  width: 200px;
  height: 200px;
  border-color: rgba(96, 165, 250, 0.25);
  animation: coreRingPulse 1.2s ease-in-out 0.3s infinite alternate;
  box-shadow: 0 0 50px rgba(96, 165, 250, 0.1);
}

.core-ring-3 {
  width: 300px;
  height: 300px;
  border-color: rgba(0, 229, 255, 0.12);
  animation: coreRingPulse 1.2s ease-in-out 0.6s infinite alternate;
  box-shadow: 0 0 60px rgba(0, 229, 255, 0.06);
}

.core-glow {
  position: absolute;
  width: 60px;
  height: 60px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251,191,36,0.5) 0%, rgba(96,165,250,0.3) 35%, rgba(167,139,250,0.15) 60%, transparent 80%);
  box-shadow:
    0 0 80px rgba(251, 191, 36, 0.5),
    0 0 140px rgba(96, 165, 250, 0.3),
    0 0 220px rgba(0, 229, 255, 0.15);
  animation: coreGlowPulse 0.8s ease-in-out infinite alternate;
}

@keyframes coreRingPulse {
  from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  to { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
}

@keyframes coreGlowPulse {
  from { transform: translate(-50%, -50%) scale(1); }
  to { transform: translate(-50%, -50%) scale(1.4); }
}

// 爆炸冲击波
.explosion-wave {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid rgba(251, 191, 36, 0.6);
  box-shadow:
    0 0 40px rgba(251, 191, 36, 0.3),
    inset 0 0 40px rgba(251, 191, 36, 0.1);
  z-index: 7;
  pointer-events: none;
  will-change: transform, opacity;
}

// 爆炸碎片粒子
.explosion-particle {
  position: absolute;
  border-radius: 50%;
  z-index: 7;
  pointer-events: none;
  will-change: transform, opacity;
  transition-property: transform, opacity;
}

// 科技网格
.tech-grid-overlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

.tech-grid-svg {
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

// 标题区
.dash-title-area {
  position: relative;
  z-index: 10;
  text-align: center;
  will-change: transform, opacity;
}

.dash-badge {
  display: inline-block;
  padding: 5px 20px;
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #fbbf24;
  letter-spacing: 3px;
  margin-bottom: 18px;
  background: rgba(251, 191, 36, 0.06);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.1);
}

.dash-main-title {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 10px;
}

.dash-title-char {
  display: inline-block;
  font-size: clamp(28px, 5.5vw, 58px);
  font-weight: 900;
  color: #e2e8f0;
  letter-spacing: 4px;
  text-shadow:
    0 0 20px rgba(251, 191, 36, 0.5),
    0 0 40px rgba(251, 191, 36, 0.25),
    0 0 80px rgba(96, 165, 250, 0.15);
  animation: dashCharReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes dashCharReveal {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.5) rotateX(90deg);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: blur(0);
  }
}

.dash-sub-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(10px, 1.5vw, 14px);
  color: #64748b;
  letter-spacing: 6px;
  margin-bottom: 20px;
}

.dash-kpi-preview {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.dkp-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  animation: dkpGlow 2s ease-in-out infinite alternate;
  animation-delay: calc(var(--dkp-color, #60a5fa) * 0s);
}

.dkp-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 700;
}

.dkp-label {
  font-size: 9px;
  color: #64748b;
  letter-spacing: 0.5px;
}

@keyframes dkpGlow {
  from { border-color: rgba(255, 255, 255, 0.06); }
  to { border-color: rgba(96, 165, 250, 0.2); }
}

.dash-progress {
  width: clamp(260px, 42vw, 500px);
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  margin: 0 auto 10px;
  overflow: hidden;
}

.dash-progress-bar {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #fbbf24, #60a5fa, #00e5ff, #a78bfa);
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.5);
  transition: width 0.08s linear;
}

.dash-percent {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #fbbf24;
  letter-spacing: 3px;
}

// HUD角落
.hud-corner {
  position: absolute;
  z-index: 8;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(96, 165, 250, 0.4);
  letter-spacing: 1px;

  span {
    &:nth-child(1) {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.6);
      animation: hudBlink 2s ease-in-out infinite;
    }
    &:nth-child(2) {
      width: 20px;
      height: 1px;
      background: rgba(96, 165, 250, 0.2);
    }
  }
}

.hud-tl { left: 24px; top: 24px; }
.hud-tr { right: 24px; top: 24px; }
.hud-bl { left: 24px; bottom: 24px; }
.hud-br { right: 24px; bottom: 24px; }

@keyframes hudBlink {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

// Transition
.dash-cosmic-enter-active { transition: opacity 0.3s ease-out; }
.dash-cosmic-leave-active { transition: opacity 0.5s ease-in; }
.dash-cosmic-enter-from { opacity: 0; }
.dash-cosmic-leave-to { opacity: 0; }

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
  position: relative;

  &.page-transitioning::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(96, 165, 250, 0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 100;
    animation: page-flash 0.65s ease-out forwards;
  }
}

@keyframes page-flash {
  0% { opacity: 1; backdrop-filter: blur(2px); }
  30% { opacity: 0.6; backdrop-filter: blur(0px); }
  100% { opacity: 0; backdrop-filter: blur(0px); }
}

.page-slider {
  display: flex;
  height: 100%;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
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

.dash-main.page-transitioning .slide-content {
  animation: slide-enter 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes slide-enter {
  0% { opacity: 0.4; transform: scale(0.97); filter: brightness(1.2); }
  40% { opacity: 0.8; transform: scale(0.99); filter: brightness(1.05); }
  100% { opacity: 1; transform: scale(1); filter: brightness(1); }
}

// ===== Executive Dashboard Layout (2D) =====
.exec-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  gap: 8px;
}

// ===== Layout Template Switcher =====
.layout-switcher {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
  background: var(--card-bg, #161B22);
  border: 1px solid var(--border, rgba(255,255,255,0.06));
  border-radius: 8px;
  padding: 3px;
  width: fit-content;
  align-self: center;
}

.layout-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-caption, #64748b);
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;

  &:hover { color: var(--text-body, #cbd5e1); background: rgba(255,255,255,0.04); }

  &.active {
    background: rgba(96, 165, 250, 0.12);
    color: var(--primary, #60a5fa);
    box-shadow: 0 0 8px rgba(96, 165, 250, 0.1);
  }
}

// ===== Layout: Classic (default 3-column) =====
.layout-classic .exec-body {
  flex: 1;
  display: flex;
  gap: 10px;
  min-height: 0;
}
.layout-classic .exec-left { width: 22%; flex-shrink: 0; display: flex; flex-direction: column; min-height: 0; }
.layout-classic .exec-center { flex: 1; min-width: 0; }
.layout-classic .exec-right { width: 26%; flex-shrink: 0; display: flex; flex-direction: column; min-height: 0; }

// ===== Layout: Focus (cinematic — center dominates, sides are narrow icon bars) =====
.layout-focus {
  background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%);
}
.layout-focus .exec-body {
  flex: 1;
  display: flex;
  gap: 4px;
  min-height: 0;
}
.layout-focus .exec-left {
  width: 14%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  opacity: 0.85;
  border-right: 1px solid rgba(96, 165, 250, 0.08);
}
.layout-focus .exec-center {
  flex: 1;
  min-width: 0;
  border-radius: 12px;
  box-shadow: 0 0 40px rgba(96, 165, 250, 0.04), inset 0 0 30px rgba(96, 165, 250, 0.02);
  border: 1px solid rgba(96, 165, 250, 0.1);
}
.layout-focus .exec-right {
  width: 14%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  opacity: 0.85;
  border-left: 1px solid rgba(96, 165, 250, 0.08);
}
.layout-focus .kpi-banner { gap: 4px; }
.layout-focus .kpi-card { padding: 6px 10px; border-radius: 6px; }
.layout-focus .kpi-card.hero { flex: 1.1; }
.layout-focus .panel-card { border-radius: 8px; }
.layout-focus .panel-toolbar { padding: 6px 8px; }
.layout-focus .stack-tabs { gap: 0; }
.layout-focus .stack-tab { padding: 4px 6px; font-size: 10px; }
.layout-focus .left-stack-container,
.layout-focus .right-stack-container { gap: 4px; }

// ===== Layout: Dual (top-bottom split — left+center on top, right on bottom) =====
.layout-dual .exec-body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1.3fr 1fr;
  gap: 8px;
  min-height: 0;
}
.layout-dual .exec-left {
  width: auto;
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.layout-dual .exec-center {
  width: auto;
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.layout-dual .exec-right {
  width: auto;
  grid-column: 1 / -1;
  grid-row: 2;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
.layout-dual .kpi-banner {
  flex-wrap: wrap;
  gap: 6px;
}
.layout-dual .kpi-card { flex: 0 0 calc(25% - 6px); padding: 8px 10px; }
.layout-dual .kpi-card.hero { flex: 0 0 calc(25% - 6px); }
.layout-dual .period-selector { flex: 0 0 calc(25% - 6px); }
.layout-dual .right-stack-container { flex-direction: row; gap: 8px; }
.layout-dual .right-stack-container .stack-cards { flex: 1; display: flex; gap: 8px; overflow: hidden; }
.layout-dual .right-stack-container .stack-card {
  position: relative;
  flex: 1;
  opacity: 1 !important;
  transform: none !important;
  min-width: 0;
}

// ===== Layout: Grid (bento 3-column equal — dense monitoring wall) =====
.layout-grid {
  background: linear-gradient(180deg, rgba(15,23,42,0.5) 0%, transparent 100%);
}
.layout-grid .exec-body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 6px;
  min-height: 0;
}
.layout-grid .exec-left {
  width: auto;
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.layout-grid .exec-center {
  width: auto;
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.layout-grid .exec-right {
  width: auto;
  grid-column: 3;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.layout-grid .kpi-banner {
  flex-wrap: wrap;
  gap: 4px;
}
.layout-grid .kpi-card {
  flex: 0 0 calc(14.28% - 4px);
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 10px;
}
.layout-grid .kpi-card.hero { flex: 0 0 calc(14.28% - 4px); }
.layout-grid .kpi-label { font-size: 8px; margin-bottom: 1px; }
.layout-grid .kpi-trend { font-size: 9px; }
.layout-grid .period-selector { flex: 0 0 calc(14.28% - 4px); }
.layout-grid .panel-card { border-radius: 6px; }
.layout-grid .panel-toolbar { padding: 5px 8px; }
.layout-grid .panel-title { font-size: 11px; }
.layout-grid .stack-tab { padding: 3px 5px; font-size: 9px; }
.layout-grid .target-banner { padding: 4px 8px; }
.layout-grid .risk-carousel { padding: 4px 8px; }

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

// ===== Main Body (3-column) — default styles overridden by layout-classic =====
.exec-body {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.exec-left, .exec-center, .exec-right {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
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
  position: relative;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 10%;
    width: 80%;
    height: 8px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.3);
    filter: blur(4px);
    opacity: 0;
    transition: opacity 0.4s;
    z-index: -1;
  }

  &:hover {
    &::before { opacity: 1; }
    &::after { opacity: 0.6; }
  }

  &.status-red {
    background: linear-gradient(145deg, rgba(239, 68, 68, 0.18), rgba(239, 68, 68, 0.08));
    border-color: rgba(239, 68, 68, 0.25);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255,255,255,0.05);
    &:hover { border-color: var(--danger, #EF4444); box-shadow: 0 12px 32px rgba(239, 68, 68, 0.25), 0 0 20px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255,255,255,0.08); transform: perspective(800px) translateY(-6px) scale(1.05) rotateX(4deg) rotateY(-1deg); }
  }
  &.status-yellow {
    background: linear-gradient(145deg, rgba(245, 158, 11, 0.18), rgba(245, 158, 11, 0.08));
    border-color: rgba(245, 158, 11, 0.25);
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.1), inset 0 1px 0 rgba(255,255,255,0.05);
    &:hover { border-color: var(--warning, #F59E0B); box-shadow: 0 12px 32px rgba(245, 158, 11, 0.25), 0 0 20px rgba(245, 158, 11, 0.1), inset 0 1px 0 rgba(255,255,255,0.08); transform: perspective(800px) translateY(-6px) scale(1.05) rotateX(4deg) rotateY(1deg); }
  }
  &.status-green {
    background: linear-gradient(145deg, rgba(34, 197, 94, 0.16), rgba(34, 197, 94, 0.06));
    border-color: rgba(34, 197, 94, 0.2);
    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.08), inset 0 1px 0 rgba(255,255,255,0.05);
    &:hover { border-color: var(--success, #22C55E); box-shadow: 0 12px 32px rgba(34, 197, 94, 0.25), 0 0 20px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255,255,255,0.08); transform: perspective(800px) translateY(-6px) scale(1.05) rotateX(4deg) rotateY(-1deg); }
  }
}

.pcard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.pcard-name { font-size: 11px; font-weight: 600; color: var(--text-title, #e2e8f0); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%; }
.pcard-city { font-size: 9px; color: var(--text-caption, #64748b); padding: 1px 4px; background: var(--surface, rgba(255, 255, 255, 0.03)); border-radius: 2px; flex-shrink: 0; }
.pcard-rate { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; line-height: 1.2; margin-bottom: 6px; position: relative; &.danger { color: var(--danger, #EF4444); text-shadow: 0 0 12px rgba(239, 68, 68, 0.3), 0 2px 4px rgba(0,0,0,0.3); } &.warn { color: var(--warning, #F59E0B); text-shadow: 0 0 12px rgba(245, 158, 11, 0.3), 0 2px 4px rgba(0,0,0,0.3); } &.ok { color: var(--success, #22C55E); text-shadow: 0 0 12px rgba(34, 197, 94, 0.3), 0 2px 4px rgba(0,0,0,0.3); } }
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
.hot-row { display: flex; align-items: center; gap: 6px; padding: 4px 0; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); &:hover { background: var(--surface, rgba(255,255,255,0.03)); border-radius: 4px; } &.hot-rank-change { animation: hot-flash 0.8s ease-out; } }
.hot-rank { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; width: 18px; text-align: center; color: var(--text-caption, #64748b); &.top { color: var(--warning, #F59E0B); text-shadow: 0 0 6px rgba(245,158,11,0.3); } }
.hot-info { flex: 1; display: flex; align-items: center; gap: 5px; min-width: 0; }
.hot-name { font-size: 11px; font-weight: 600; color: var(--text-title, #e2e8f0); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hot-tag { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 3px; flex-shrink: 0; }
.hot-views { display: flex; align-items: center; gap: 3px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: var(--text-body, #cbd5e1); }
.hot-growth { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; &.up { color: var(--success, #22C55E); } &.down { color: var(--danger, #EF4444); } }
.hot-auto-indicator {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 6px; cursor: pointer;
  color: var(--text-caption, #64748b); transition: all 0.3s;
  border: 1px solid transparent;
  &:hover { color: var(--primary, #60a5fa); border-color: rgba(96, 165, 250, 0.2); background: rgba(96, 165, 250, 0.06); }
  &.spinning { color: var(--success, #22C55E); animation: spin-icon 2s linear infinite; }
}
@keyframes spin-icon { to { transform: rotate(360deg); } }
@keyframes hot-flash {
  0% { background: rgba(96, 165, 250, 0.15); transform: translateX(-2px); }
  50% { background: rgba(96, 165, 250, 0.06); }
  100% { background: transparent; transform: translateX(0); }
}

// Hot list transition group
.hot-list-enter-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.hot-list-leave-active { transition: all 0.3s ease-in; position: absolute; }
.hot-list-enter-from { opacity: 0; transform: translateX(20px); }
.hot-list-leave-to { opacity: 0; transform: translateX(-20px); }
.hot-list-move { transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }

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

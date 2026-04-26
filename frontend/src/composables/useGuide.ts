import { ref, computed, nextTick } from 'vue'

export interface GuideStep {
  target: string       // CSS selector for the target element
  title: string
  description: string
  position?: 'right' | 'left' | 'top' | 'bottom'
  icon?: string
}

export interface MenuGuide {
  path: string
  label: string
  description: string      // Brief description for tooltip
  detail: string           // Detailed description for guide
  tips: string[]           // Quick tips
  icon: string
}

const GUIDE_STORAGE_KEY = 'smartestate-guide-completed'

export const menuGuides: MenuGuide[] = [
  {
    path: '/staff/workbench',
    label: '工作台',
    description: '日常办公入口，一览核心数据与待办事项',
    detail: '工作台是您每天登录后的第一站，这里汇集了核心业务数据、今日待办事项、最近成交动态和跟进提醒，帮您快速掌握当日工作重点。',
    tips: ['顶部卡片展示关键指标趋势', '待办事项可点击勾选完成', '关注跟进提醒不遗漏客户'],
    icon: '🏠',
  },
  {
    path: '/staff/projects',
    label: '项目管理',
    description: '管理所有楼盘项目，监控健康状态',
    detail: '集中管理所有在售楼盘项目，实时监控项目健康状态（健康/关注/预警），支持按区域、状态筛选，快速新增或编辑项目信息。',
    tips: ['状态标签：绿色健康 / 黄色关注 / 红色预警', '支持按区域和状态组合筛选', '点击卡片可快速编辑项目'],
    icon: '🏗️',
  },
  {
    path: '/staff/deals',
    label: '成交录入',
    description: '录入和管理每一笔房产成交记录',
    detail: '记录每一笔房产成交的完整信息，包括房号、户型、面积、单价、总价、客户和渠道等，支持多维度筛选和快速录入。',
    tips: ['支持按项目/渠道筛选', '一键录入新成交', '自动计算销售指标'],
    icon: '💰',
  },
  {
    path: '/staff/returns',
    label: '回款管理',
    description: '跟踪每笔回款进度，掌控资金流入',
    detail: '全流程跟踪每笔回款的计划与实际到账情况，自动计算回款率，及时识别逾期风险，确保资金按时回笼。',
    tips: ['回款状态一目了然', '逾期回款自动标红提醒', '回款率自动计算'],
    icon: '💳',
  },
  {
    path: '/staff/leads',
    label: '客户线索',
    description: '管理潜在客户，提升转化效率',
    detail: '统一管理所有潜在客户线索，从初次接触到最终成交全程跟踪，支持线索分级（A/B/C级），智能分配跟进人，提升转化率。',
    tips: ['线索分级：A级优质 / B级一般 / C级待培育', '点击可查看客户详情和跟进记录', '支持快速添加新线索'],
    icon: '👥',
  },
  {
    path: '/staff/inventory',
    label: '房源库存',
    description: '查看和管理可售房源，掌握库存动态',
    detail: '实时查看所有可售房源的库存状态，按项目、户型、楼层多维度筛选，快速了解去化率和库存压力，辅助定价决策。',
    tips: ['去化率反映项目销售进度', '支持按项目/户型筛选', '关注高库存房源及时调整策略'],
    icon: '🏢',
  },
  {
    path: '/staff/channel',
    label: '渠道数据',
    description: '分析渠道转化效果，优化投放策略',
    detail: '深度分析各渠道的带看量、成交量和转化率，对比渠道ROI，发现最优获客渠道，为营销投放提供数据支撑。',
    tips: ['转化率 = 成交 / 带看 × 100%', '对比不同渠道的投入产出比', '关注低效渠道及时调整'],
    icon: '📊',
  },
]

const guideSteps: GuideStep[] = [
  {
    target: '.sidebar',
    title: '导航菜单',
    description: '这是侧边栏导航菜单，可以快速切换到不同功能模块。鼠标悬停可查看每个模块的说明，点击即可进入。',
    position: 'right',
    icon: '🧭',
  },
  {
    target: '.nav-item[href="/staff/workbench"]',
    title: '工作台',
    description: '日常办公入口，汇集核心指标、待办事项和跟进提醒，帮您快速进入工作状态。',
    position: 'right',
    icon: '🏠',
  },
  {
    target: '.nav-item[href="/staff/projects"]',
    title: '项目管理',
    description: '集中管理所有楼盘项目，实时监控项目健康状态，支持筛选和快速操作。',
    position: 'right',
    icon: '🏗️',
  },
  {
    target: '.nav-item[href="/staff/deals"]',
    title: '成交录入',
    description: '录入和管理每一笔房产成交记录，完整追踪交易全流程。',
    position: 'right',
    icon: '💰',
  },
  {
    target: '.nav-item[href="/staff/returns"]',
    title: '回款管理',
    description: '跟踪回款进度，自动计算回款率，及时识别逾期风险。',
    position: 'right',
    icon: '💳',
  },
  {
    target: '.nav-item[href="/staff/leads"]',
    title: '客户线索',
    description: '统一管理潜在客户，智能分级跟进，提升转化效率。',
    position: 'right',
    icon: '👥',
  },
  {
    target: '.nav-item[href="/staff/inventory"]',
    title: '房源库存',
    description: '实时掌握可售房源状态，多维度分析库存和去化情况。',
    position: 'right',
    icon: '🏢',
  },
  {
    target: '.nav-item[href="/staff/channel"]',
    title: '渠道数据',
    description: '深度分析渠道转化效果，优化营销投放策略。',
    position: 'right',
    icon: '📊',
  },
  {
    target: '.staff-header',
    title: '顶部工具栏',
    description: '这里显示当前页面标题和时间，右侧可以切换皮肤主题（暗夜黑/日光白/科技蓝/浅蓝），也可以点击帮助按钮重新查看引导。',
    position: 'bottom',
    icon: '⚙️',
  },
  {
    target: '.sidebar-footer',
    title: '更多功能',
    description: '底部可以折叠侧边栏节省空间，也可以一键返回决策驾驶舱大盘。',
    position: 'right',
    icon: '🔧',
  },
]

const guideActive = ref(false)
const currentStepIndex = ref(0)
const guideCompleted = ref(localStorage.getItem(GUIDE_STORAGE_KEY) === 'true')
// Track which pages have been visited (show hint on first visit)
const visitedPages = ref<Set<string>>(
  new Set(JSON.parse(localStorage.getItem('smartestate-visited-pages') || '[]'))
)

export function useGuide() {
  const totalSteps = computed(() => guideSteps.length)
  const currentStep = computed(() => guideSteps[currentStepIndex.value])
  const isFirstStep = computed(() => currentStepIndex.value === 0)
  const isLastStep = computed(() => currentStepIndex.value === guideSteps.length - 1)
  const progress = computed(() => ((currentStepIndex.value + 1) / totalSteps.value) * 100)

  function startGuide() {
    currentStepIndex.value = 0
    guideActive.value = true
    document.body.style.overflow = 'hidden'
  }

  function nextStep() {
    if (currentStepIndex.value < guideSteps.length - 1) {
      currentStepIndex.value++
    }
  }

  function prevStep() {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value--
    }
  }

  function skipGuide() {
    guideActive.value = false
    guideCompleted.value = true
    document.body.style.overflow = ''
    localStorage.setItem(GUIDE_STORAGE_KEY, 'true')
  }

  function finishGuide() {
    guideActive.value = false
    guideCompleted.value = true
    document.body.style.overflow = ''
    localStorage.setItem(GUIDE_STORAGE_KEY, 'true')
  }

  function resetGuide() {
    localStorage.removeItem(GUIDE_STORAGE_KEY)
    guideCompleted.value = false
  }

  function markPageVisited(path: string) {
    visitedPages.value.add(path)
    localStorage.setItem('smartestate-visited-pages', JSON.stringify([...visitedPages.value]))
  }

  function isPageFirstVisit(path: string): boolean {
    return !visitedPages.value.has(path)
  }

  function dismissPageHint(path: string) {
    visitedPages.value.add(path)
    localStorage.setItem('smartestate-visited-pages', JSON.stringify([...visitedPages.value]))
  }

  function getMenuGuide(path: string): MenuGuide | undefined {
    return menuGuides.find(m => m.path === path)
  }

  // Auto-start guide on first visit
  function checkAutoStart() {
    if (!guideCompleted.value) {
      nextTick(() => {
        setTimeout(() => startGuide(), 800)
      })
    }
  }

  return {
    guideActive,
    currentStepIndex,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    guideCompleted,
    visitedPages,
    guideSteps,
    menuGuides,
    startGuide,
    nextStep,
    prevStep,
    skipGuide,
    finishGuide,
    resetGuide,
    markPageVisited,
    isPageFirstVisit,
    dismissPageHint,
    getMenuGuide,
    checkAutoStart,
  }
}

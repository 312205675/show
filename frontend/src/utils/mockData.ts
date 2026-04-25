// Mock data generators — 石家庄城发投集团决策大盘

export function rand(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min
  return decimals > 0 ? Number(val.toFixed(decimals)) : Math.round(val)
}

export function fluctuate(base: number, range: number, decimals = 0): number {
  return rand(base - range, base + range, decimals)
}

// ========== 石家庄城发投项目 ==========
// 真实参考：石家庄城发投集团旗下楼盘

export const PROJECT_LIST = [
  { name: '城发投·云山樾', city: '长安区', district: '和平路板块', avgPrice: 18800 },
  { name: '城发投·云澜悦府', city: '长安区', district: '和平路板块', avgPrice: 18500 },
  { name: '城发投·云和赋', city: '桥西区', district: '高铁板块', avgPrice: 21000 },
  { name: '城发投·瑞晟府', city: '桥西区', district: '中心板块', avgPrice: 17800 },
  { name: '城发投·云华', city: '裕华区', district: '东南板块', avgPrice: 12500 },
  { name: '城发投·云尚', city: '新华区', district: '西北板块', avgPrice: 13500 },
  { name: '城发投·瑞凝府', city: '长安区', district: '东北板块', avgPrice: 16200 },
  { name: '城发投·云徽颂', city: '裕华区', district: '东南板块', avgPrice: 19200 },
  { name: '城发投·雲境府', city: '桥西区', district: '西南板块', avgPrice: 17500 },
  { name: '城发投·麓湖四季', city: '鹿泉区', district: '龙泉湖板块', avgPrice: 14800 },
  { name: '东方禧', city: '长安区', district: '中心板块', avgPrice: 16800 },
  { name: '城发投·龙泉湖55号地', city: '鹿泉区', district: '龙泉湖板块', avgPrice: 13800 },
  { name: '高铁商务14号地', city: '桥西区', district: '高铁板块', avgPrice: 22000 },
  { name: '自强路金融区', city: '桥西区', district: '中心板块', avgPrice: 25000 },
  { name: '生物医药园一期', city: '高新区', district: '高新板块', avgPrice: 9800 },
  { name: '客运段洗整基地', city: '桥西区', district: '高铁板块', avgPrice: 8500 },
]

// ========== 核心KPI ==========

export function generateCoreKPI() {
  const depletionRate = fluctuate(68, 8, 1)
  const totalSales = fluctuate(86.5, 12, 2)
  const returnAmount = fluctuate(62.8, 10, 2)
  // 回款率应与去化率正相关：回款率 ≤ 去化率 × 缴款比例(0.85~1.0)
  const paymentRatio = fluctuate(0.88, 0.08, 2) // 缴款比例
  const returnRate = Number(Math.min(depletionRate * paymentRatio, 98).toFixed(1))
  const inventoryUnits = fluctuate(3280, 300)
  const inventoryValue = fluctuate(38.6, 6, 1)
  const todayDeals = fluctuate(18, 8)
  const monthDeals = fluctuate(386, 40)
  const momGrowth = fluctuate(5.2, 8, 1)
  const cashFlow = fluctuate(12.8, 5, 1)
  // 利润率基准下调至10%，符合2024-2026年城投类国企实际情况
  const profitMargin = fluctuate(10, 3.5, 1)
  // 销售效率定义为"销售费效比"：每投入1元营销费换回的销售额倍数
  const salesEfficiency = fluctuate(3.2, 0.8, 1)
  return { depletionRate, totalSales, returnAmount, returnRate, inventoryUnits, inventoryValue, todayDeals, monthDeals, momGrowth, cashFlow, profitMargin, salesEfficiency }
}

// ========== 经营结论 ==========

export function generateInsight() {
  const insights = [
    { level: 'warn' as const, text: '当前去化率68.3%，库存压力集中在云华与云尚，回款率低于70%需关注' },
    { level: 'good' as const, text: '本月成交环比增长8.2%，去化率持续回升，但瑞晟府回款滞后需跟进' },
    { level: 'danger' as const, text: '去化率降至61.5%，3个项目库存超200套，回款率仅62%——建议紧急调度' },
    { level: 'good' as const, text: '去化率72.1%超预期，回款率达81%，集团整体经营健康' },
    { level: 'warn' as const, text: '回款率68.5%低于目标，云山樾与云和赋回款异常，需专项督办' },
  ]
  return insights[rand(0, insights.length - 1)]
}

// ========== 项目矩阵 ==========

export interface ProjectItem {
  name: string
  city: string
  district: string
  avgPrice: number
  depletionRate: number
  totalUnits: number
  soldUnits: number
  salesAmount: number
  returnRate: number
  status: 'green' | 'yellow' | 'red'
  // 二级详情
  monthlyDeals: number[]
  returnMonthly: number[]
  topTypes: { name: string; percent: number }[]
}

export function generateProjectMatrix(): ProjectItem[] {
  return PROJECT_LIST.map(({ name, city, district, avgPrice }) => {
    const totalUnits = rand(150, 1200)
    const depletionRate = rand(25, 95, 1)
    const soldUnits = Math.round(totalUnits * depletionRate / 100)
    // 销售额 = 已售套数 × 均价 × 套均面积(100㎡) / 100000000 → 亿
    const avgUnitArea = rand(85, 130)
    const salesAmount = Number((soldUnits * avgPrice * avgUnitArea / 100000000).toFixed(2))
    // 回款率与去化率正相关：回款率 ≤ 去化率 × 缴款比例
    const paymentRatio = fluctuate(0.88, 0.08, 2)
    const returnRate = Number(Math.min(depletionRate * paymentRatio, 98).toFixed(1))
    const status: 'green' | 'yellow' | 'red' = depletionRate >= 70 ? 'green' : depletionRate >= 50 ? 'yellow' : 'red'

    // 月度成交（近6个月）
    const monthlyDeals = Array.from({ length: 6 }, () => rand(5, 60))
    // 月度回款
    const returnMonthly = Array.from({ length: 6 }, () => rand(40, 98, 1))
    // 户型分布 — 归一化确保加和为100%
    const allTypes = ['高层', '洋房', '别墅', '商铺']
    const typeCount = rand(2, 4)
    const selectedTypes = allTypes.slice(0, typeCount)
    const rawPercents = selectedTypes.map(() => rand(10, 50))
    const totalRaw = rawPercents.reduce((a, b) => a + b, 0)
    const topTypes = selectedTypes.map((t, i) => ({ name: t, percent: Number((rawPercents[i] / totalRaw * 100).toFixed(1)) }))

    return { name, city, district, avgPrice, depletionRate, totalUnits, soldUnits, salesAmount, returnRate, status, monthlyDeals, returnMonthly, topTypes }
  })
}

// ========== 问题诊断 ==========

export interface RiskItem {
  type: 'unsalable' | 'returnAbnormal' | 'highInventory'
  projectName: string
  description: string
  severity: 'danger' | 'warn'
  detail: string
}

export function generateRiskDiagnosis(): RiskItem[] {
  const items: RiskItem[] = []

  const unsalableProjects = ['城发投·云华', '城发投·云尚', '城发投·龙泉湖55号地']
  const count = rand(1, 3)
  for (let i = 0; i < count && i < unsalableProjects.length; i++) {
    const months = rand(3, 8)
    items.push({
      type: 'unsalable',
      projectName: unsalableProjects[i],
      description: `连续${months}个月去化率低于30%`,
      severity: months >= 6 ? 'danger' : 'warn',
      detail: `${unsalableProjects[i]}近${months}个月月均去化不足15套，库存去化周期超24个月。建议：①调整定价策略；②增加渠道投放；③考虑打包转让部分库存。`,
    })
  }

  const returnAbnormal = ['城发投·云山樾', '城发投·云和赋', '城发投·瑞晟府']
  const rCount = rand(1, 3)
  for (let i = 0; i < rCount && i < returnAbnormal.length; i++) {
    const gap = rand(15, 35, 1)
    items.push({
      type: 'returnAbnormal',
      projectName: returnAbnormal[i],
      description: `回款率低于目标${gap}个百分点`,
      severity: gap >= 25 ? 'danger' : 'warn',
      detail: `${returnAbnormal[i]}当前回款率仅${(78 - gap).toFixed(1)}%，与目标差距${gap}个百分点。主要原因为：①按揭放款周期延长；②部分客户首付逾期。建议：①催办按揭；②启动逾期催收。`,
    })
  }

  const highInventory = ['城发投·龙泉湖55号地', '城发投·麓湖四季', '城发投·云尚']
  const hCount = rand(1, 3)
  for (let i = 0; i < hCount && i < highInventory.length; i++) {
    const units = rand(200, 500)
    items.push({
      type: 'highInventory',
      projectName: highInventory[i],
      description: `剩余${units}套未售，去化周期超18个月`,
      severity: units >= 350 ? 'danger' : 'warn',
      detail: `${highInventory[i]}剩余${units}套未售，货值约${(units * 0.0135).toFixed(1)}亿。去化周期超18个月，占用资金量大。建议：①启动特价房促销；②与公积金中心合作加快放款。`,
    })
  }

  return items
}

// ========== 成交趋势 ==========

export function generateDealTrend() {
  const days = 30
  const dates: string[] = []
  const dealCount: number[] = []
  const salesAmount: number[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    dates.push(`${d.getMonth() + 1}/${d.getDate()}`)
    dealCount.push(rand(5, 35))
    salesAmount.push(rand(600, 2800))
  }
  return { dates, dealCount, salesAmount }
}

// ========== 回款趋势 ==========

export function generateReturnTrend() {
  const days = 30
  const dates: string[] = []
  const returnAmount: number[] = []
  const returnRate: number[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    dates.push(`${d.getMonth() + 1}/${d.getDate()}`)
    returnAmount.push(rand(400, 2200))
    returnRate.push(rand(55, 95, 1))
  }
  return { dates, returnAmount, returnRate }
}

// ========== 7天趋势 ==========

export function generateWeeklyTrend() {
  const days = 7
  const dates: string[] = []
  const dealCount: number[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    dates.push(`${d.getMonth() + 1}/${d.getDate()}`)
    dealCount.push(rand(8, 30))
  }
  return { dates, dealCount }
}

// ========== 年度目标追踪 ==========

export interface TargetItem {
  label: string
  target: number
  actual: number
  unit: string
  progress: number
  gap: number
  status: 'on-track' | 'at-risk' | 'behind'
  yoy: number
  mom: number
}

export function generateTargets(): TargetItem[] {
  const items = [
    { label: '年度销售额', target: 120, actual: fluctuate(86.5, 12, 1), unit: '亿', yoy: fluctuate(12, 5, 1), mom: fluctuate(5, 8, 1) },
    { label: '年度回款额', target: 95, actual: fluctuate(62.8, 10, 1), unit: '亿', yoy: fluctuate(8, 6, 1), mom: fluctuate(3, 5, 1) },
    { label: '去化率目标', target: 85, actual: fluctuate(68, 8, 1), unit: '%', yoy: fluctuate(5, 4, 1), mom: fluctuate(2, 3, 1) },
    { label: '新增成交', target: 5000, actual: fluctuate(3800, 400), unit: '套', yoy: fluctuate(15, 8, 1), mom: fluctuate(6, 5, 1) },
    { label: '客户到访', target: 20000, actual: fluctuate(14500, 1500), unit: '组', yoy: fluctuate(10, 6, 1), mom: fluctuate(4, 4, 1) },
  ]
  return items.map(item => {
    const progress = Number((item.actual / item.target * 100).toFixed(1))
    // gap 直接表示与目标的差距：负数表示未达标
    const gap = Number((item.actual - item.target).toFixed(1))
    const status: TargetItem['status'] = progress >= 80 ? 'on-track' : progress >= 65 ? 'at-risk' : 'behind'
    return { ...item, progress, gap, status }
  })
}

// ========== 智能决策建议 ==========

export interface RecommendationItem {
  id: number
  priority: 'urgent' | 'important' | 'suggested'
  category: '去化' | '回款' | '库存' | '渠道' | '定价'
  title: string
  description: string
  impact: string
  project?: string
}

export function generateRecommendations(): RecommendationItem[] {
  const allRecommendations: RecommendationItem[] = [
    { id: 1, priority: 'urgent', category: '去化', title: '加速滞销项目去化', description: '云华、云尚连续3月去化率低于30%，建议启动限时优惠+渠道加推', impact: '预计提升去化率8-12个百分点', project: '城发投·云华' },
    { id: 2, priority: 'urgent', category: '回款', title: '专项督办回款异常项目', description: '云山樾、云和赋回款率低于目标20个百分点，需催办按揭+启动逾期催收', impact: '预计回收资金1.2-1.8亿', project: '城发投·云山樾' },
    { id: 3, priority: 'important', category: '库存', title: '龙泉湖片区库存减压', description: '麓湖四季+龙泉湖55号地合计库存超500套，建议特价房+公积金合作方案', impact: '预计减少库存120-180套', project: '城发投·麓湖四季' },
    { id: 4, priority: 'important', category: '定价', title: '高新板块价格策略调整', description: '生物医药园一期均价9800元/㎡，区域竞品降价5-8%，建议跟进调整或增加附加值', impact: '预计提升来访量30%', project: '生物医药园一期' },
    { id: 5, priority: 'suggested', category: '渠道', title: '优化渠道佣金结构', description: '当前渠道成交占比42%但佣金成本偏高，建议调整分级佣金+自渠建设', impact: '预计降低获客成本15-20%' },
    { id: 6, priority: 'suggested', category: '去化', title: '热点项目加推节奏优化', description: '云山樾、云和赋去化率超85%，建议加快后续批次推盘节奏', impact: '预计提前1-2月完成年度目标', project: '城发投·云和赋' },
  ]
  const count = rand(4, 6)
  const shuffled = allRecommendations.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// ========== 风险雷达维度 ==========

export interface RiskRadarData {
  dimensions: { name: string; max: number }[]
  current: number[]
  benchmark: number[]
}

export function generateRiskRadar(): RiskRadarData {
  return {
    dimensions: [
      { name: '资金风险', max: 100 },
      { name: '去化压力', max: 100 },
      { name: '回款风险', max: 100 },
      { name: '库存积压', max: 100 },
      { name: '市场竞争', max: 100 },
      { name: '政策影响', max: 100 },
    ],
    current: [
      rand(30, 75),
      rand(40, 80),
      rand(25, 70),
      rand(35, 85),
      rand(45, 75),
      rand(20, 60),
    ],
    benchmark: [50, 55, 45, 50, 50, 40],
  }
}

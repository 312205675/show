// 下沉页面 Mock 数据生成器 — 石家庄城发投集团

import { PROJECT_LIST, rand, fluctuate } from './mockData'

// ========== 渠道分析 ==========

export interface ChannelItem {
  name: string
  type: string
  salesAmount: number
  dealCount: number
  conversionRate: number
  costPerCustomer: number
  roi: number
  trend: number
  color: string
}

export function generateChannels(): ChannelItem[] {
  const channels = [
    { name: '自渠(售楼处)', type: '自建', color: '#4a9eff' },
    { name: '贝壳链家', type: '中介', color: '#00d68f' },
    { name: '安居客', type: '平台', color: '#ffab00' },
    { name: '抖音直播', type: '线上', color: '#a78bfa' },
    { name: '微信小程序', type: '线上', color: '#00e5ff' },
    { name: '房天下', type: '平台', color: '#ff4757' },
    { name: '中介分销', type: '中介', color: '#f472b6' },
    { name: '老带新', type: '自建', color: '#34d399' },
  ]
  return channels.map(ch => ({
    name: ch.name,
    type: ch.type,
    salesAmount: fluctuate(ch.type === '自建' ? 28 : 12, 8, 1),
    dealCount: fluctuate(ch.type === '自建' ? 120 : 45, 20),
    conversionRate: fluctuate(ch.type === '自建' ? 18 : 8, 5, 1),
    costPerCustomer: fluctuate(ch.type === '线上' ? 280 : 1800, 300),
    roi: fluctuate(ch.type === '自建' ? 3.2 : 1.8, 0.8, 1),
    trend: fluctuate(5, 15, 1),
    color: ch.color,
  }))
}

// ========== 客户画像 ==========

export interface CustomerProfile {
  segment: string
  count: number
  percent: number
  avgBudget: number
  avgAge: number
  topSource: string
  preferredType: string
  preferredArea: string
  color: string
}

export function generateCustomerProfiles(): CustomerProfile[] {
  return [
    { segment: '刚需首置', count: fluctuate(1860, 200), percent: fluctuate(38, 3, 1), avgBudget: fluctuate(120, 15), avgAge: fluctuate(28, 2), topSource: '安居客', preferredType: '高层80-100㎡', preferredArea: '长安区/新华区', color: '#4a9eff' },
    { segment: '改善置换', count: fluctuate(1280, 150), percent: fluctuate(26, 2, 1), avgBudget: fluctuate(220, 20), avgAge: fluctuate(36, 2), topSource: '贝壳链家', preferredType: '洋房120-150㎡', preferredArea: '裕华区/桥西区', color: '#00d68f' },
    { segment: '投资理财', count: fluctuate(680, 80), percent: fluctuate(14, 2, 1), avgBudget: fluctuate(180, 25), avgAge: fluctuate(42, 3), topSource: '中介分销', preferredType: '商铺/小户型', preferredArea: '正定新区', color: '#ffab00' },
    { segment: '学区需求', count: fluctuate(520, 60), percent: fluctuate(11, 2, 1), avgBudget: fluctuate(200, 20), avgAge: fluctuate(34, 2), topSource: '自渠', preferredType: '高层100-130㎡', preferredArea: '桥西区/长安区', color: '#a78bfa' },
    { segment: '养老康养', count: fluctuate(360, 40), percent: fluctuate(7, 1, 1), avgBudget: fluctuate(150, 15), avgAge: fluctuate(55, 3), topSource: '老带新', preferredType: '洋房90-120㎡', preferredArea: '栾城区/正定新区', color: '#00e5ff' },
    { segment: '高端改善', count: fluctuate(280, 30), percent: fluctuate(4, 1, 1), avgBudget: fluctuate(400, 50), avgAge: fluctuate(40, 3), topSource: '自渠', preferredType: '别墅/大平层', preferredArea: '裕华区', color: '#f472b6' },
  ]
}

export interface AgeDistribution {
  range: string
  male: number
  female: number
}

export function generateAgeDistribution(): AgeDistribution[] {
  return [
    { range: '20-25', male: fluctuate(120, 30), female: fluctuate(95, 25) },
    { range: '26-30', male: fluctuate(380, 50), female: fluctuate(320, 40) },
    { range: '31-35', male: fluctuate(450, 60), female: fluctuate(380, 50) },
    { range: '36-40', male: fluctuate(320, 40), female: fluctuate(280, 35) },
    { range: '41-50', male: fluctuate(260, 30), female: fluctuate(220, 25) },
    { range: '50+', male: fluctuate(140, 20), female: fluctuate(120, 15) },
  ]
}

// ========== 销售漏斗 ==========

export interface FunnelStage {
  name: string
  count: number
  rate: number
  lossRate: number
  lossReason?: string
  color: string
}

export function generateFunnel(): FunnelStage[] {
  const leads = fluctuate(12500, 1500)
  const visited = Math.round(leads * fluctuate(0.32, 0.05, 2))
  const intent = Math.round(visited * fluctuate(0.55, 0.08, 2))
  const subscribed = Math.round(intent * fluctuate(0.45, 0.06, 2))
  const closed = Math.round(subscribed * fluctuate(0.82, 0.05, 2))
  return [
    { name: '线索获取', count: leads, rate: 100, lossRate: 0, color: '#4a9eff' },
    { name: '到访看房', count: visited, rate: Number((visited / leads * 100).toFixed(1)), lossRate: Number(((1 - visited / leads) * 100).toFixed(1)), lossReason: '渠道质量差/信息不匹配', color: '#00e5ff' },
    { name: '意向确认', count: intent, rate: Number((intent / leads * 100).toFixed(1)), lossRate: Number(((1 - intent / visited) * 100).toFixed(1)), lossReason: '价格预期不匹配/竞品分流', color: '#00d68f' },
    { name: '认购签约', count: subscribed, rate: Number((subscribed / leads * 100).toFixed(1)), lossRate: Number(((1 - subscribed / intent) * 100).toFixed(1)), lossReason: '按揭审批/首付压力/观望犹豫', color: '#ffab00' },
    { name: '成交回款', count: closed, rate: Number((closed / leads * 100).toFixed(1)), lossRate: Number(((1 - closed / subscribed) * 100).toFixed(1)), lossReason: '按揭放款延迟/退房', color: '#a78bfa' },
  ]
}

export interface FunnelCompare {
  projectName: string
  leads: number
  visited: number
  intent: number
  subscribed: number
  closed: number
  overallRate: number
}

export function generateFunnelCompare(): FunnelCompare[] {
  return PROJECT_LIST.slice(0, 8).map(p => {
    const leads = fluctuate(800, 200)
    const visited = Math.round(leads * fluctuate(0.3, 0.08, 2))
    const intent = Math.round(visited * fluctuate(0.5, 0.1, 2))
    const sub = Math.round(intent * fluctuate(0.4, 0.1, 2))
    const closed = Math.round(sub * fluctuate(0.8, 0.08, 2))
    return { projectName: p.name, leads, visited, intent, subscribed: sub, closed, overallRate: Number((closed / leads * 100).toFixed(1)) }
  })
}

// ========== 库存与定价 ==========

export interface InventoryItem {
  projectName: string
  city: string
  totalUnits: number
  soldUnits: number
  unsoldUnits: number
  unsoldValue: number
  depletionRate: number
  depletionCycle: number // 去化周期(月)
  avgPrice: number
  suggestedPrice: number
  priceChange: number
  status: 'green' | 'yellow' | 'red'
}

export function generateInventory(): InventoryItem[] {
  return PROJECT_LIST.map(p => {
    const totalUnits = rand(150, 1200)
    const depletionRate = rand(25, 95, 1)
    const soldUnits = Math.round(totalUnits * depletionRate / 100)
    const unsoldUnits = totalUnits - soldUnits
    const avgPrice = p.avgPrice
    const unsoldValue = Number((unsoldUnits * avgPrice / 10000).toFixed(2))
    const depletionCycle = Number((unsoldUnits / Math.max(1, soldUnits / 6)).toFixed(1))
    const priceChange = depletionRate < 40 ? fluctuate(-8, 5, 1) : fluctuate(2, 5, 1)
    const suggestedPrice = Math.round(avgPrice * (1 + priceChange / 100))
    const status: 'green' | 'yellow' | 'red' = depletionCycle <= 12 ? 'green' : depletionCycle <= 18 ? 'yellow' : 'red'
    return { projectName: p.name, city: p.city, totalUnits, soldUnits, unsoldUnits, unsoldValue, depletionRate, depletionCycle, avgPrice, suggestedPrice, priceChange, status }
  }).sort((a, b) => a.depletionRate - b.depletionRate)
}

export interface SlowMovingItem {
  projectName: string
  buildingNo: string
  floor: string
  unitType: string
  area: number
  price: number
  daysOnMarket: number
  reason: string
}

export function generateSlowMoving(): SlowMovingItem[] {
  const items: SlowMovingItem[] = []
  const slowProjects = [
    { name: '城发投·翡翠城', priceRange: [14000, 17000] },
    { name: '城发投·熙湖', priceRange: [12000, 14500] },
    { name: '城发投·栾城壹号院', priceRange: [8500, 11000] },
    { name: '城发投·御河上院', priceRange: [10500, 13000] },
  ]
  const reasons = ['定价偏高', '楼层不理想', '朝向偏西', '户型奇葩', '竞品分流', '配套未兑现', '距地铁较远', '采光不足']
  const unitTypes = ['3室2厅', '2室1厅', '4室2厅', '1室1厅', '3室1厅', '2室2厅']
  for (const proj of slowProjects) {
    for (let i = 0; i < rand(3, 6); i++) {
      items.push({
        projectName: proj.name,
        buildingNo: `${rand(1, 12)}栋`,
        floor: `${rand(1, 32)}层`,
        unitType: unitTypes[rand(0, unitTypes.length - 1)],
        area: rand(65, 180),
        price: rand(proj.priceRange[0], proj.priceRange[1]),
        daysOnMarket: rand(120, 400),
        reason: reasons[rand(0, reasons.length - 1)],
      })
    }
  }
  return items.sort((a, b) => b.daysOnMarket - a.daysOnMarket)
}

// ========== 区域对比 ==========

export interface RegionItem {
  name: string
  totalSales: number
  dealCount: number
  avgPrice: number
  depletionRate: number
  returnRate: number
  inventoryPressure: number // 0-100
  riskLevel: 'low' | 'medium' | 'high'
  projects: number
  suggestion: string
}

export function generateRegions(): RegionItem[] {
  return [
    { name: '裕华区', totalSales: fluctuate(32.5, 5, 1), dealCount: fluctuate(180, 20), avgPrice: fluctuate(17500, 1000), depletionRate: fluctuate(72, 5, 1), returnRate: fluctuate(78, 5, 1), inventoryPressure: fluctuate(35, 10), riskLevel: 'low', projects: 4, suggestion: '经营稳健，可适度加推' },
    { name: '长安区', totalSales: fluctuate(28.2, 4, 1), dealCount: fluctuate(210, 25), avgPrice: fluctuate(16800, 800), depletionRate: fluctuate(65, 6, 1), returnRate: fluctuate(72, 6, 1), inventoryPressure: fluctuate(48, 10), riskLevel: 'medium', projects: 5, suggestion: '关注去化节奏，加强渠道' },
    { name: '桥西区', totalSales: fluctuate(22.8, 3, 1), dealCount: fluctuate(145, 15), avgPrice: fluctuate(18200, 900), depletionRate: fluctuate(58, 7, 1), returnRate: fluctuate(68, 5, 1), inventoryPressure: fluctuate(55, 12), riskLevel: 'medium', projects: 2, suggestion: '高端盘去化偏慢，需精准营销' },
    { name: '新华区', totalSales: fluctuate(15.6, 2, 1), dealCount: fluctuate(120, 15), avgPrice: fluctuate(13200, 600), depletionRate: fluctuate(62, 8, 1), returnRate: fluctuate(75, 5, 1), inventoryPressure: fluctuate(42, 10), riskLevel: 'low', projects: 2, suggestion: '性价比板块，刚需客户充足' },
    { name: '正定新区', totalSales: fluctuate(12.3, 2, 1), dealCount: fluctuate(95, 10), avgPrice: fluctuate(11800, 500), depletionRate: fluctuate(45, 8, 1), returnRate: fluctuate(60, 8, 1), inventoryPressure: fluctuate(72, 10), riskLevel: 'high', projects: 2, suggestion: '库存压力大，建议特价房+公积金合作' },
    { name: '栾城区', totalSales: fluctuate(6.8, 1, 1), dealCount: fluctuate(65, 8), avgPrice: fluctuate(9900, 400), depletionRate: fluctuate(38, 10, 1), returnRate: fluctuate(55, 10, 1), inventoryPressure: fluctuate(85, 8), riskLevel: 'high', projects: 1, suggestion: '需重新评估定价，考虑以价换量' },
  ]
}

// ========== 项目深度 — 扩展数据 ==========

export interface ProjectDeepData {
  name: string
  city: string
  district: string
  // 销售漏斗
  funnel: { name: string; count: number; color: string }[]
  // 客户来源
  customerSources: { name: string; percent: number; color: string }[]
  // 客户画像
  customerSegments: { segment: string; percent: number; avgAge: number; avgBudget: number; color: string }[]
  // 库存结构
  inventoryStructure: { type: string; total: number; sold: number; unsold: number }[]
  // AI诊断
  aiDiagnosis: {
    score: number
    problems: { title: string; reason: string; suggestion: string; severity: 'danger' | 'warn' | 'info' }[]
  }
}

export function generateProjectDeepData(projectName: string): ProjectDeepData {
  const proj = PROJECT_LIST.find(p => p.name === projectName) || PROJECT_LIST[0]
  const leads = rand(500, 2000)
  const visited = Math.round(leads * fluctuate(0.3, 0.05, 2))
  const intent = Math.round(visited * fluctuate(0.5, 0.08, 2))
  const sub = Math.round(intent * fluctuate(0.4, 0.06, 2))
  const closed = Math.round(sub * fluctuate(0.8, 0.05, 2))

  const problems: ProjectDeepData['aiDiagnosis']['problems'] = []
  const deplRate = rand(25, 95, 1)
  if (deplRate < 40) {
    problems.push({ title: '去化严重滞后', reason: '项目定位与区域客群不匹配，价格偏高', suggestion: '①调整定价至区域均价95折；②增加渠道佣金至2.5%；③推出特价房引流', severity: 'danger' })
  }
  if (rand(0, 1)) {
    problems.push({ title: '到访转化率偏低', reason: '案场逼定能力不足，竞品分流严重', suggestion: '①加强案场培训；②增加限时优惠；③强化老带新政策', severity: 'warn' })
  }
  if (rand(0, 1)) {
    problems.push({ title: '回款周期偏长', reason: '按揭放款慢，首付逾期比例高', suggestion: '①对接公积金中心加速审批；②逾期客户专项催收', severity: 'warn' })
  }
  if (problems.length === 0) {
    problems.push({ title: '整体经营健康', reason: '去化率达标，回款节奏正常', suggestion: '持续关注市场变化，保持当前策略', severity: 'info' })
  }

  return {
    name: proj.name,
    city: proj.city,
    district: proj.district,
    funnel: [
      { name: '线索', count: leads, color: '#4a9eff' },
      { name: '到访', count: visited, color: '#00e5ff' },
      { name: '意向', count: intent, color: '#00d68f' },
      { name: '认购', count: sub, color: '#ffab00' },
      { name: '成交', count: closed, color: '#a78bfa' },
    ],
    customerSources: [
      { name: '自渠', percent: fluctuate(32, 5, 1), color: '#4a9eff' },
      { name: '贝壳', percent: fluctuate(22, 4, 1), color: '#00d68f' },
      { name: '安居客', percent: fluctuate(15, 3, 1), color: '#ffab00' },
      { name: '抖音', percent: fluctuate(12, 3, 1), color: '#a78bfa' },
      { name: '老带新', percent: fluctuate(10, 2, 1), color: '#00e5ff' },
      { name: '其他', percent: fluctuate(9, 2, 1), color: '#6b7590' },
    ],
    customerSegments: [
      { segment: '刚需首置', percent: fluctuate(35, 5, 1), avgAge: fluctuate(28, 2), avgBudget: fluctuate(120, 15), color: '#4a9eff' },
      { segment: '改善置换', percent: fluctuate(28, 4, 1), avgAge: fluctuate(36, 2), avgBudget: fluctuate(220, 20), color: '#00d68f' },
      { segment: '投资理财', percent: fluctuate(18, 3, 1), avgAge: fluctuate(42, 3), avgBudget: fluctuate(180, 25), color: '#ffab00' },
      { segment: '学区需求', percent: fluctuate(12, 2, 1), avgAge: fluctuate(34, 2), avgBudget: fluctuate(200, 20), color: '#a78bfa' },
      { segment: '高端改善', percent: fluctuate(7, 2, 1), avgAge: fluctuate(45, 3), avgBudget: fluctuate(400, 50), color: '#f472b6' },
    ],
    inventoryStructure: [
      { type: '高层', total: rand(200, 600), sold: rand(100, 400), unsold: rand(50, 200) },
      { type: '洋房', total: rand(80, 200), sold: rand(40, 150), unsold: rand(20, 80) },
      { type: '别墅', total: rand(20, 60), sold: rand(5, 40), unsold: rand(5, 30) },
      { type: '商铺', total: rand(30, 80), sold: rand(10, 40), unsold: rand(10, 50) },
    ],
    aiDiagnosis: {
      score: rand(35, 90),
      problems,
    },
  }
}

// ========== 楼盘浏览量 & 热门楼盘 ==========

export interface HotProperty {
  name: string
  city: string
  views: number          // 浏览量
  viewGrowth: number     // 浏览量环比增长%
  deals: number          // 成交套数
  score: number          // 热度评分 0-100
  tag: string            // 标签
  tagColor: string
}

export function generateHotProperties(): HotProperty[] {
  const tags = [
    { tag: '销冠', color: '#EF4444' },
    { tag: '热搜', color: '#F59E0B' },
    { tag: '新开', color: '#60a5fa' },
    { tag: '必看', color: '#22C55E' },
    { tag: '爆款', color: '#a78bfa' },
  ]
  return PROJECT_LIST.slice(0, 8).map((p, i) => ({
    name: p.name,
    city: p.city,
    views: fluctuate(12000 - i * 800, 2000),
    viewGrowth: fluctuate(15 - i * 2, 12, 1),
    deals: fluctuate(45 - i * 3, 10),
    score: fluctuate(95 - i * 7, 5, 1),
    tag: tags[i % tags.length].tag,
    tagColor: tags[i % tags.length].color,
  })).sort((a, b) => b.score - a.score)
}

// ========== 预测模块 ==========

export interface PredictionItem {
  indicator: string        // 指标名称
  current: number          // 当前值
  predicted: number        // 预测值
  change: number           // 变化%
  confidence: number       // 置信度 0-100
  trend: 'up' | 'down' | 'stable'
  unit: string
  advice: string
}

export function generatePredictions(): PredictionItem[] {
  return [
    {
      indicator: '下月销售额',
      current: fluctuate(12.5, 2, 1),
      predicted: fluctuate(13.8, 2, 1),
      change: fluctuate(8.5, 5, 1),
      confidence: fluctuate(82, 8, 1),
      trend: 'up',
      unit: '亿',
      advice: '市场回暖信号明显，建议加推热门户型',
    },
    {
      indicator: '去化率',
      current: fluctuate(68, 5, 1),
      predicted: fluctuate(71, 5, 1),
      change: fluctuate(3.2, 2, 1),
      confidence: fluctuate(78, 10, 1),
      trend: 'up',
      unit: '%',
      advice: '去化趋势向好，维持当前营销节奏',
    },
    {
      indicator: '库存去化周期',
      current: fluctuate(16, 3, 1),
      predicted: fluctuate(14.5, 3, 1),
      change: fluctuate(-8, 5, 1),
      confidence: fluctuate(75, 10, 1),
      trend: 'down',
      unit: '月',
      advice: '库存压力有望缓解，关注正定新区去化',
    },
    {
      indicator: '回款率',
      current: fluctuate(76, 6, 1),
      predicted: fluctuate(79, 6, 1),
      change: fluctuate(4, 3, 1),
      confidence: fluctuate(70, 12, 1),
      trend: 'up',
      unit: '%',
      advice: '按揭放款提速预期，回款率有望改善',
    },
    {
      indicator: '新增线索量',
      current: fluctuate(3800, 500),
      predicted: fluctuate(4200, 500),
      change: fluctuate(10, 8, 1),
      confidence: fluctuate(68, 15, 1),
      trend: 'up',
      unit: '条',
      advice: '线上渠道持续发力，线索量稳中有升',
    },
  ]
}

// ========== 通用：月度趋势数据 ==========

export function generateMonthlyTrend(months = 12) {
  const labels: string[] = []
  const values: number[] = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(`${d.getMonth() + 1}月`)
    values.push(rand(15, 65))
  }
  return { labels, values }
}

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PROJECT_LIST, rand, fluctuate } from '@/utils/mockData'

// ===== 类型定义 =====

export interface ProjectInfo {
  id: string
  name: string
  city: string
  district: string
  avgPrice: number
  totalUnits: number
  soldUnits: number
  status: 'green' | 'yellow' | 'red'
  openDate: string
  developer: string
  contact: string
  phone: string
  address: string
  description: string
}

export interface DealRecord {
  id: string
  projectId: string
  projectName: string
  dealDate: string
  unitNo: string
  unitType: string
  area: number
  unitPrice: number
  totalAmount: number
  customerName: string
  customerPhone: string
  channel: string
  remark: string
  createdAt: string
}

export interface ReturnRecord {
  id: string
  projectId: string
  projectName: string
  returnDate: string
  amount: number
  payerName: string
  payerPhone: string
  paymentType: '首付' | '按揭' | '全款' | '分期'
  bankName: string
  contractNo: string
  remark: string
  createdAt: string
}

export interface ChannelRecord {
  id: string
  date: string
  channelName: string
  channelType: string
  projectId: string
  projectName: string
  leadCount: number
  visitCount: number
  dealCount: number
  salesAmount: number
  cost: number
  conversionRate: number
  roi: number
}

export interface LeadRecord {
  id: string
  projectId: string
  projectName: string
  customerName: string
  phone: string
  gender: '男' | '女'
  age: number
  segment: string
  budget: number
  preferredType: string
  preferredArea: string
  source: string
  status: '新线索' | '已到访' | '有意向' | '已认购' | '已成交' | '已流失'
  followUpPerson: string
  lastFollowDate: string
  nextFollowDate: string
  remark: string
  createdAt: string
}

export interface InventoryUnit {
  id: string
  projectId: string
  projectName: string
  buildingNo: string
  unitNo: string
  floor: number
  totalFloors: number
  unitType: string
  area: number
  price: number
  totalPrice: number
  orientation: string
  decoration: '毛坯' | '简装' | '精装'
  status: '可售' | '已售' | '预留' | '签约中'
  daysOnMarket: number
  createdAt: string
}

export interface ViewRecord {
  id: string
  projectId: string
  projectName: string
  date: string
  onlineViews: number
  offlineVisits: number
  phoneInquiries: number
  source: string
}

// ===== 辅助函数 =====

const genId = () => Math.random().toString(36).slice(2, 10)
const today = () => new Date().toISOString().slice(0, 10)
const recentDate = (daysAgo = 0) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

const channelNames = ['自渠(售楼处)', '贝壳链家', '安居客', '抖音直播', '微信小程序', '房天下', '中介分销', '老带新']
const channelTypes = ['自建', '中介', '平台', '线上', '线上', '平台', '中介', '自建']
const unitTypes = ['1室1厅', '2室1厅', '2室2厅', '3室1厅', '3室2厅', '4室2厅']
const orientations = ['南北通透', '朝南', '朝东', '朝西', '东南', '西南']
const segments = ['刚需首置', '改善置换', '投资理财', '学区需求', '养老康养', '高端改善']
const leadStatuses: LeadRecord['status'][] = ['新线索', '已到访', '有意向', '已认购', '已成交', '已流失']
const decorations: InventoryUnit['decoration'][] = ['毛坯', '简装', '精装']
const invStatuses: InventoryUnit['status'][] = ['可售', '已售', '预留', '签约中']

// ===== Store =====

export const useStaffStore = defineStore('staff', () => {
  // ---- 项目信息 ----
  const projects = ref<ProjectInfo[]>(PROJECT_LIST.map((p, i) => ({
    id: `proj-${i}`,
    name: p.name,
    city: p.city,
    district: p.district,
    avgPrice: p.avgPrice,
    totalUnits: rand(150, 1200),
    soldUnits: rand(80, 600),
    status: (['green', 'yellow', 'red'] as const)[rand(0, 2)],
    openDate: recentDate(rand(30, 600)),
    developer: '石家庄城发投集团',
    contact: `张${['伟', '强', '磊', '军', '勇'][rand(0, 4)]}`,
    phone: `138${rand(10000000, 99999999)}`,
    address: `石家庄市${p.city}${p.district}`,
    description: `${p.name}位于${p.city}${p.district}，均价${p.avgPrice}元/㎡`,
  })))

  // ---- 成交记录 ----
  const deals = ref<DealRecord[]>(Array.from({ length: 50 }, () => {
    const proj = PROJECT_LIST[rand(0, PROJECT_LIST.length - 1)]
    const area = rand(65, 180)
    const unitPrice = proj.avgPrice + rand(-1500, 1500)
    return {
      id: genId(),
      projectId: `proj-${PROJECT_LIST.indexOf(proj)}`,
      projectName: proj.name,
      dealDate: recentDate(rand(0, 30)),
      unitNo: `${rand(1, 12)}栋${rand(1, 4)}单元${rand(1, 32).toString().padStart(2, '0')}`,
      unitType: unitTypes[rand(0, unitTypes.length - 1)],
      area,
      unitPrice,
      totalAmount: Math.round(area * unitPrice / 10000),
      customerName: `${['李', '王', '张', '刘', '陈', '杨'][rand(0, 5)]}${['某', '先生', '女士'][rand(0, 2)]}`,
      customerPhone: `1${rand(3000000000, 9999999999)}`,
      channel: channelNames[rand(0, channelNames.length - 1)],
      remark: '',
      createdAt: recentDate(rand(0, 30)),
    }
  }))

  // ---- 回款记录 ----
  const returns = ref<ReturnRecord[]>(Array.from({ length: 40 }, () => {
    const proj = PROJECT_LIST[rand(0, PROJECT_LIST.length - 1)]
    return {
      id: genId(),
      projectId: `proj-${PROJECT_LIST.indexOf(proj)}`,
      projectName: proj.name,
      returnDate: recentDate(rand(0, 30)),
      amount: fluctuate(80, 50, 1),
      payerName: `${['赵', '钱', '孙', '周', '吴'][rand(0, 4)]}${['某', '先生', '女士'][rand(0, 2)]}`,
      payerPhone: `1${rand(3000000000, 9999999999)}`,
      paymentType: (['首付', '按揭', '全款', '分期'] as const)[rand(0, 3)],
      bankName: (['工商银行', '建设银行', '农业银行', '中国银行', '交通银行', '招商银行'])[rand(0, 5)],
      contractNo: `HT${Date.now().toString().slice(-8)}${rand(10, 99)}`,
      remark: '',
      createdAt: recentDate(rand(0, 30)),
    }
  }))

  // ---- 渠道数据 ----
  const channelRecords = ref<ChannelRecord[]>(Array.from({ length: 60 }, () => {
    const ci = rand(0, channelNames.length - 1)
    const proj = PROJECT_LIST[rand(0, PROJECT_LIST.length - 1)]
    const leadCount = rand(20, 200)
    const visitCount = Math.round(leadCount * rand(20, 40) / 100)
    const dealCount = Math.round(visitCount * rand(15, 35) / 100)
    const salesAmount = fluctuate(dealCount * 1.2, 3, 1)
    const cost = rand(5000, 50000)
    return {
      id: genId(),
      date: recentDate(rand(0, 30)),
      channelName: channelNames[ci],
      channelType: channelTypes[ci],
      projectId: `proj-${PROJECT_LIST.indexOf(proj)}`,
      projectName: proj.name,
      leadCount,
      visitCount,
      dealCount,
      salesAmount,
      cost,
      conversionRate: Number((dealCount / leadCount * 100).toFixed(1)),
      roi: Number((salesAmount / (cost / 10000)).toFixed(2)),
    }
  }))

  // ---- 客户线索 ----
  const leads = ref<LeadRecord[]>(Array.from({ length: 80 }, () => {
    const proj = PROJECT_LIST[rand(0, PROJECT_LIST.length - 1)]
    const si = rand(0, segments.length - 1)
    return {
      id: genId(),
      projectId: `proj-${PROJECT_LIST.indexOf(proj)}`,
      projectName: proj.name,
      customerName: `${['李', '王', '张', '刘', '陈'][rand(0, 4)]}${['某', '先生', '女士'][rand(0, 2)]}`,
      phone: `1${rand(3000000000, 9999999999)}`,
      gender: (['男', '女'] as const)[rand(0, 1)],
      age: rand(22, 60),
      segment: segments[si],
      budget: rand(80, 500),
      preferredType: unitTypes[rand(0, unitTypes.length - 1)],
      preferredArea: proj.city,
      source: channelNames[rand(0, channelNames.length - 1)],
      status: leadStatuses[rand(0, leadStatuses.length - 1)],
      followUpPerson: `销售${rand(1, 20)}号`,
      lastFollowDate: recentDate(rand(0, 14)),
      nextFollowDate: recentDate(rand(-3, 7)),
      remark: '',
      createdAt: recentDate(rand(0, 30)),
    }
  }))

  // ---- 库存房源 ----
  const inventoryUnits = ref<InventoryUnit[]>(Array.from({ length: 120 }, () => {
    const proj = PROJECT_LIST[rand(0, PROJECT_LIST.length - 1)]
    const area = rand(55, 220)
    const price = proj.avgPrice + rand(-2000, 2000)
    const status = invStatuses[rand(0, invStatuses.length - 1)]
    return {
      id: genId(),
      projectId: `proj-${PROJECT_LIST.indexOf(proj)}`,
      projectName: proj.name,
      buildingNo: `${rand(1, 12)}栋`,
      unitNo: `${rand(1, 4)}单元${rand(1, 33).toString().padStart(3, '0')}`,
      floor: rand(1, 32),
      totalFloors: rand(18, 33),
      unitType: unitTypes[rand(0, unitTypes.length - 1)],
      area,
      price,
      totalPrice: Math.round(area * price / 10000),
      orientation: orientations[rand(0, orientations.length - 1)],
      decoration: decorations[rand(0, decorations.length - 1)],
      status,
      daysOnMarket: status === '已售' ? rand(5, 60) : rand(30, 400),
      createdAt: recentDate(rand(30, 300)),
    }
  }))

  // ---- 浏览统计 ----
  const viewRecords = ref<ViewRecord[]>(Array.from({ length: 45 }, () => {
    const proj = PROJECT_LIST[rand(0, PROJECT_LIST.length - 1)]
    return {
      id: genId(),
      projectId: `proj-${PROJECT_LIST.indexOf(proj)}`,
      projectName: proj.name,
      date: recentDate(rand(0, 30)),
      onlineViews: rand(200, 5000),
      offlineVisits: rand(10, 200),
      phoneInquiries: rand(5, 80),
      source: (['微信小程序', '安居客', '抖音', '贝壳', '官网', '房天下'])[rand(0, 5)],
    }
  }))

  // ===== 计算属性 =====
  const todayDealCount = computed(() =>
    deals.value.filter(d => d.dealDate === today()).length
  )
  const todayReturnAmount = computed(() =>
    returns.value.filter(r => r.returnDate === today()).reduce((s, r) => s + r.amount, 0)
  )
  const activeLeadCount = computed(() =>
    leads.value.filter(l => !['已成交', '已流失'].includes(l.status)).length
  )
  const salableUnits = computed(() =>
    inventoryUnits.value.filter(u => u.status === '可售').length
  )
  const monthDealCount = computed(() => {
    const m = new Date().toISOString().slice(0, 7)
    return deals.value.filter(d => d.dealDate.startsWith(m)).length
  })
  const monthReturnAmount = computed(() => {
    const m = new Date().toISOString().slice(0, 7)
    return returns.value.filter(r => r.returnDate.startsWith(m)).reduce((s, r) => s + r.amount, 0)
  })

  // ===== 操作方法 =====
  function addDeal(record: Omit<DealRecord, 'id' | 'createdAt'>) {
    deals.value.unshift({ ...record, id: genId(), createdAt: today() })
  }
  function addReturn(record: Omit<ReturnRecord, 'id' | 'createdAt'>) {
    returns.value.unshift({ ...record, id: genId(), createdAt: today() })
  }
  function addLead(record: Omit<LeadRecord, 'id' | 'createdAt'>) {
    leads.value.unshift({ ...record, id: genId(), createdAt: today() })
  }
  function addChannelRecord(record: Omit<ChannelRecord, 'id'>) {
    channelRecords.value.unshift({ ...record, id: genId() })
  }
  function addInventoryUnit(record: Omit<InventoryUnit, 'id' | 'createdAt'>) {
    inventoryUnits.value.unshift({ ...record, id: genId(), createdAt: today() })
  }
  function addViewRecord(record: Omit<ViewRecord, 'id'>) {
    viewRecords.value.unshift({ ...record, id: genId() })
  }
  function updateProject(id: string, data: Partial<ProjectInfo>) {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx >= 0) Object.assign(projects.value[idx], data)
  }
  function updateLeadStatus(id: string, status: LeadRecord['status']) {
    const lead = leads.value.find(l => l.id === id)
    if (lead) lead.status = status
  }
  function updateInventoryStatus(id: string, status: InventoryUnit['status']) {
    const unit = inventoryUnits.value.find(u => u.id === id)
    if (unit) unit.status = status
  }

  return {
    projects, deals, returns, channelRecords, leads, inventoryUnits, viewRecords,
    todayDealCount, todayReturnAmount, activeLeadCount, salableUnits,
    monthDealCount, monthReturnAmount,
    addDeal, addReturn, addLead, addChannelRecord, addInventoryUnit, addViewRecord,
    updateProject, updateLeadStatus, updateInventoryStatus,
  }
})
